import test from 'node:test';
import assert from 'node:assert/strict';
import http from 'node:http';
import {Readable} from 'node:stream';
import {pebliApi} from './plugin.js';
import {randomUUID} from 'node:crypto';
import {rm} from 'node:fs/promises';
test('duplicate and conflicting jobs never trigger a second provider call',async()=>{const previous=process.env.OPENROUTER_API_KEY;process.env.OPENROUTER_API_KEY='unit-test-placeholder';let calls=0,complete;const plugin=pebliApi({generator:()=>{calls++;return new Promise(r=>complete=r)}});let middleware;plugin.configureServer({middlewares:{use:fn=>middleware=fn}});const srv=http.createServer((req,res)=>middleware(req,res,()=>res.end()));await new Promise(r=>srv.listen(0,'127.0.0.1',r));const base=`http://127.0.0.1:${srv.address().port}`,id=randomUUID();const post=prompt=>fetch(base+'/api/pebli/images',{method:'POST',headers:{'Content-Type':'application/json',Origin:base},body:JSON.stringify({requestId:id,prompt})});try{const replies=await Promise.all([post('a fox'),post('a fox')]);assert.ok(replies.every(r=>r.ok));assert.equal(calls,1);assert.equal((await post('different')).status,409);assert.equal((await fetch(base+'/api/pebli/status',{headers:{Origin:'https://evil.example'}})).status,403);complete({image:'data:image/png;base64,aGVsbG8=',model:'test'});let final;for(let i=0;i<30;i++){final=await(await fetch(base+'/api/pebli/jobs/'+id)).json();if(final.status==='completed')break;await new Promise(r=>setTimeout(r,10))}assert.equal(final.status,'completed');await post('a fox');assert.equal(calls,1)}finally{srv.closeAllConnections();await new Promise(r=>srv.close(r));await rm(new URL('../.pebli-data/jobs/'+id+'.json',import.meta.url),{force:true});if(previous===undefined)delete process.env.OPENROUTER_API_KEY;else process.env.OPENROUTER_API_KEY=previous}});
test('completed image remains retrievable when final disk write fails',async()=>{const prev=process.env.OPENROUTER_API_KEY;process.env.OPENROUTER_API_KEY='test';const saved=new Map();const plugin=pebliApi({generator:async()=>({image:'data:image/png;base64,aGVsbG8=',model:'test'}),loadJob:async id=>saved.get(id)||null,saveJob:async(id,data)=>{if(data.status!=='working')throw Error('disk full');saved.set(id,data)}});let middleware;plugin.configureServer({middlewares:{use:fn=>middleware=fn}});const srv=http.createServer((req,res)=>middleware(req,res,()=>res.end()));await new Promise(r=>srv.listen(0,'127.0.0.1',r));const base=`http://127.0.0.1:${srv.address().port}`;try{await fetch(base+'/api/pebli/images',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({requestId:'disk-failure',prompt:'fox'})});const r=await(await fetch(base+'/api/pebli/jobs/disk-failure')).json();assert.equal(r.status,'completed');assert.match(r.image,/^data:image/)}finally{srv.closeAllConnections();await new Promise(r=>srv.close(r));if(prev===undefined)delete process.env.OPENROUTER_API_KEY;else process.env.OPENROUTER_API_KEY=prev}});

test('local Tavi and Nix complete and recover results, while IDs cannot cross service kinds',async()=>{
 const oldKey=process.env.OPENROUTER_API_KEY,oldFal=process.env.FAL_KEY;process.env.OPENROUTER_API_KEY='test';process.env.FAL_KEY='test';
 const saved=new Map();let textCalls=0,songCalls=0;
 const plugin=pebliApi({textGenerator:async()=>{textCalls++;return {text:'A moon library opened.',model:'test'}},songSubmit:async()=>{songCalls++;return 'song-remote'},songRead:async()=>new Uint8Array([73,68,51,0]),loadJob:async id=>saved.get(id)||null,saveJob:async(id,data)=>saved.set(id,data)});
 let middleware;plugin.configureServer({middlewares:{use:fn=>middleware=fn}});const srv=http.createServer((req,res)=>middleware(req,res,()=>res.end()));await new Promise(r=>srv.listen(0,'127.0.0.1',r));const base=`http://127.0.0.1:${srv.address().port}`;
 const post=(path,body)=>fetch(base+path,{method:'POST',headers:{'Content-Type':'application/json',Origin:base},body:JSON.stringify(body)});
 try{
  const status=await(await fetch(base+'/api/pebli/status')).json();assert.equal(status.musicConfigured,true);assert.equal(status.textConfigured,true);
  const text={requestId:'tavi',prompt:'A moon library opens',format:'story'};
  assert.equal((await post('/api/pebli/text',text)).status,202);await post('/api/pebli/text',text);
  assert.equal((await post('/api/pebli/images',{requestId:'tavi',prompt:'A moon library opens'})).status,409);
  await post('/api/pebli/music',{requestId:'nix',prompt:'An instrumental for a moon library',lyrics:'',instrumental:true});
  for(let i=0;i<30&&saved.get('nix')?.status!=='completed';i++)await new Promise(r=>setTimeout(r,10));
  const story=await(await fetch(base+'/api/pebli/jobs/tavi')).json(),song=await(await fetch(base+'/api/pebli/jobs/nix')).json();
  assert.equal(story.kind,'text');assert.equal(story.text,'A moon library opened.');assert.equal(story.image,undefined);assert.equal(textCalls,1);
  assert.equal(song.kind,'music');assert.match(song.audio,/data:audio\/mpeg/);assert.equal(songCalls,1);
 }finally{srv.closeAllConnections();await new Promise(r=>srv.close(r));if(oldKey===undefined)delete process.env.OPENROUTER_API_KEY;else process.env.OPENROUTER_API_KEY=oldKey;if(oldFal===undefined)delete process.env.FAL_KEY;else process.env.FAL_KEY=oldFal}
});

test('successful disk recovery clears stale pending music state',async()=>{
 const oldFal=process.env.FAL_KEY;process.env.FAL_KEY='test';const saved=new Map();let failPending=true,reads=0;
 const plugin=pebliApi({songSubmit:async()=> 'remote',songRead:async()=>{reads++;return new Uint8Array([73,68,51,0])},loadJob:async id=>saved.get(id)||null,saveJob:async(id,data)=>{if(data.status==='pending'&&failPending){failPending=false;throw Error('temporary write failure')}saved.set(id,data)}});
 let middleware;plugin.configureServer({middlewares:{use:fn=>middleware=fn}});const srv=http.createServer((req,res)=>middleware(req,res,()=>res.end()));await new Promise(r=>srv.listen(0,'127.0.0.1',r));const base=`http://127.0.0.1:${srv.address().port}`;
 try{await fetch(base+'/api/pebli/music',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({requestId:'recovery-song',prompt:'A song for a fox in space',lyrics:'',instrumental:true})});
 for(let i=0;i<30&&saved.get('recovery-song')?.status!=='completed';i++)await new Promise(r=>setTimeout(r,10));
 for(let i=0;i<2;i++){const result=await(await fetch(base+'/api/pebli/jobs/recovery-song')).json();assert.equal(result.status,'completed');assert.ok(result.audio)}assert.equal(reads,1);
 }finally{srv.closeAllConnections();await new Promise(r=>srv.close(r));if(oldFal===undefined)delete process.env.FAL_KEY;else process.env.FAL_KEY=oldFal}
});
