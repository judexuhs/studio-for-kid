import test from 'node:test';
import assert from 'node:assert/strict';
import worker,{PebliJobs} from './worker.js';
import {musicInput,readSong} from './providers.js';
function fixture(){
 const data=new Map(),files=new Map();let alarm=null;
 const storage={get:async k=>structuredClone(data.get(k)),put:async(k,v)=>data.set(k,structuredClone(v)),delete:async k=>data.delete(k),list:async({prefix})=>new Map([...data].filter(([k])=>k.startsWith(prefix)).map(([k,v])=>[k,structuredClone(v)])),getAlarm:async()=>alarm,setAlarm:async n=>{alarm=n}};
 storage.transaction=async fn=>fn(storage);
 const env={OPENROUTER_API_KEY:'test-only',FAL_KEY:'test-only',MEDIA:{
  put:async(k,v,options)=>files.set(k,{bytes:typeof v==='string'?new TextEncoder().encode(v):v,httpMetadata:options?.httpMetadata}),
  get:async k=>{const f=files.get(k);return f?{body:f.bytes,json:async()=>JSON.parse(new TextDecoder().decode(f.bytes))}:null},
  head:async k=>files.get(k),delete:async k=>{for(const item of Array.isArray(k)?k:[k])files.delete(item)}},
  ASSETS:{fetch:async()=>new Response('static')}};
 const object=new PebliJobs({storage},env);env.JOBS={idFromName:n=>n,get:()=>object};
 return {env,object,storage,files,data};
}
const origin='https://pebli.example';
const owner='12345678-1234-1234-1234-123456789012';
function request(path,{method='GET',body,guest=owner,site=origin}={}){
 return new Request(origin+path,{method,headers:{Origin:site,Cookie:`__Host-pebli_guest=${guest}`,'Content-Type':'application/json'},...(body?{body:JSON.stringify(body)}:{})});
}
const input={requestId:'one',prompt:'A small friendly space whale'};
test('API status is non-cacheable with private guest cookie; cross-origin and missing owners are rejected',async()=>{
 const {env}=fixture();const r=await worker.fetch(new Request(origin+'/api/pebli/status'),env);
 assert.match(r.headers.get('Set-Cookie'),/Secure; HttpOnly; SameSite=Strict/);
 assert.equal(r.headers.get('Cache-Control'),'no-store');
 assert.equal((await worker.fetch(request('/api/pebli/images',{method:'POST',body:input,site:'https://other.example'}),env)).status,403);
 assert.equal((await worker.fetch(new Request(origin+'/api/pebli/jobs/one'),env)).status,401);
 assert.equal((await worker.fetch(request('/api/unknown'),env)).status,404);
});
test('completed jobs stay private and reuse the same paid request after refresh',async()=>{
 const {env,object}=fixture();let calls=0;const original=globalThis.fetch;
 globalThis.fetch=async()=>{calls++;return Response.json({data:[{b64_json:'aGVsbG8=',media_type:'image/png'}]})};
 try {
  assert.equal((await worker.fetch(request('/api/pebli/images',{method:'POST',body:input}),env)).status,202);
  await object.alarm();
  const done=await(await worker.fetch(request('/api/pebli/jobs/one'),env)).json();assert.equal(done.status,'completed');
  assert.equal((await worker.fetch(request(done.mediaUrl,{guest:'87654321-1234-1234-1234-123456789012'}),env)).status,404);
  const media=await worker.fetch(request(done.mediaUrl),env);assert.equal(media.headers.get('Content-Type'),'image/png');assert.equal(await media.text(),'hello');
  await worker.fetch(request('/api/pebli/images',{method:'POST',body:input}),env);await object.alarm();assert.equal(calls,1);
 } finally {globalThis.fetch=original}
});
test('alarm replay never resubmits an uncertain paid operation; expired results retain dedup tombstones',async()=>{
 const {env,object,data}=fixture();let calls=0;const original=globalThis.fetch;globalThis.fetch=async()=>{calls++;throw Error('provider secret failure')};
 try {
  await worker.fetch(request('/api/pebli/images',{method:'POST',body:input}),env);
  const key=`job:${owner}:one`;data.get(key).status='submitting';await object.alarm();assert.equal(calls,0);assert.equal(data.get(key).status,'uncertain');
  data.get(key).created=Date.now()-8*86400000;await object.alarm();assert.equal(data.has(key),false);
  const repeat=await(await worker.fetch(request('/api/pebli/images',{method:'POST',body:input}),env)).json();assert.equal(repeat.status,'failed');assert.match(repeat.error,/expired/);assert.equal(calls,0);
 }finally{globalThis.fetch=original}
});
test('music keeps child lyrics, disables optimization when supplied, and rejects remote download redirects',async()=>{
 const result=musicInput({prompt:'A happy space song',lyrics:'My own words',instrumental:false});assert.equal(result.lyrics,'My own words');assert.equal(result.lyrics_optimizer,false);
 let i=0;await assert.rejects(()=>readSong('safe-id',{FAL_KEY:'test-only'},async()=>{
  i++;return i===1?Response.json({status:'COMPLETED'}):i===2?Response.json({audio:{url:'https://example.com/private'}}):new Response('unexpected');
 }));assert.equal(i,2);
});

test('Tavi completes a private text job, deduplicates, and conflicts with a changed kind',async()=>{
 const {env,object}=fixture();let calls=0;const original=globalThis.fetch;
 globalThis.fetch=async()=>{calls++;return Response.json({choices:[{message:{content:'The moon sneezed a sky full of stars.'}}]})};
 const text={requestId:'story',prompt:'Write a story about Nova',format:'story',context:'Nova is a fox.'};
 try{
  const status=await(await worker.fetch(request('/api/pebli/status'),env)).json();assert.equal(status.textConfigured,true);
  assert.equal((await worker.fetch(request('/api/pebli/text',{method:'POST',body:text}),env)).status,202);
  await object.alarm();
  const done=await(await worker.fetch(request('/api/pebli/jobs/story'),env)).json();assert.equal(done.kind,'text');assert.equal(done.status,'completed');
  const media=await worker.fetch(request(done.mediaUrl),env);assert.equal(media.headers.get('Content-Type'),'application/json');assert.match((await media.json()).text,/moon/);
  assert.equal((await worker.fetch(request(done.mediaUrl,{guest:'87654321-1234-1234-1234-123456789012'}),env)).status,404);
  await worker.fetch(request('/api/pebli/text',{method:'POST',body:text}),env);await object.alarm();assert.equal(calls,1);
  assert.equal((await worker.fetch(request('/api/pebli/images',{method:'POST',body:{requestId:'story',prompt:'Write a story about Nova'}}),env)).status,409);
 }finally{globalThis.fetch=original}
});
test('Tavi rejects contact information and never substitutes text after provider failure',async()=>{
 const {env,object}=fixture();const original=globalThis.fetch;globalThis.fetch=async()=>new Response('private upstream failure',{status:500});
 try{
  assert.equal((await worker.fetch(request('/api/pebli/text',{method:'POST',body:{requestId:'bad',prompt:'hello me@example.com',format:'story'}}),env)).status,400);
  await worker.fetch(request('/api/pebli/text',{method:'POST',body:{requestId:'fail',prompt:'A moon story',format:'story'}}),env);await object.alarm();
  const result=await(await worker.fetch(request('/api/pebli/jobs/fail'),env)).json();assert.equal(result.status,'uncertain');assert.equal(result.mediaUrl,undefined);assert.ok(!result.error.includes('upstream'));
 }finally{globalThis.fetch=original}
});
