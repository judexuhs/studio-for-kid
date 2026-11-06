import {validateText,generateText,TEXT_MODEL} from '../server/text-generation.js';
import {validateRequest} from '../server/generation.js';
import {claimJob, publicJob, validateMusic, RETENTION_MS, validId} from './policy.js';
import {makeImage, submitSong, readSong, MUSIC_MODEL} from './providers.js';
const json=(data,status=200)=>Response.json(data,{status,headers:{'Cache-Control':'no-store','X-Content-Type-Options':'nosniff'}});
const sha=async value=>Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',new TextEncoder().encode(value))),n=>n.toString(16).padStart(2,'0')).join('');
const ownerFrom=request=>request.headers.get('Cookie')?.match(/(?:^|;\s*)__Host-pebli_guest=([a-f0-9-]{36})(?:;|$)/)?.[1];
const jobKey=(owner,id)=>`job:${owner}:${id}`;
const mediaKey=job=>`${job.owner}/${job.id}/output`;
const inputKey=job=>`${job.owner}/${job.id}/input`;
async function readJson(request,limit){
 const reader=request.body?.getReader();if(!reader)throw Error('Send a creative idea first.');
 let bytes=0,text='';const decoder=new TextDecoder();
 try {while(true){const {done,value}=await reader.read();if(done)break;bytes+=value.length;if(bytes>limit)throw Error('This request is too large.');text+=decoder.decode(value,{stream:true})}}finally{await reader.cancel().catch(()=>{})}
 return JSON.parse(text+decoder.decode());
}
export default {
 async fetch(request,env) {
  const url=new URL(request.url);
  if(!url.pathname.startsWith('/api/'))return env.ASSETS.fetch(request);
  try {
   const crossSite=request.headers.get('Sec-Fetch-Site')==='cross-site';
   if(crossSite||(request.headers.has('Origin')&&request.headers.get('Origin')!==url.origin))return json({error:'Open Pebli to continue.'},403);
   if(url.pathname==='/api/pebli/status'&&request.method==='GET'){
    const response=json({configured:!!env.OPENROUTER_API_KEY,musicConfigured:!!env.FAL_KEY,textConfigured:!!env.OPENROUTER_API_KEY,model:env.OPENROUTER_IMAGE_MODEL||'qwen/qwen-image-3'});
    if(!ownerFrom(request))response.headers.set('Set-Cookie',`__Host-pebli_guest=${crypto.randomUUID()}; Path=/; Secure; HttpOnly; SameSite=Strict; Max-Age=2592000`);
    return response;
   }
   const owner=ownerFrom(request);
   if(!owner)return json({error:'Reopen Pebli to reconnect your canvas. Saved work is still on this device.'},401);
   const isPost=request.method==='POST'&&['/api/pebli/images','/api/pebli/music','/api/pebli/text'].includes(url.pathname);
   const isGet=request.method==='GET'&&/^\/api\/pebli\/(jobs|media)\/[a-zA-Z0-9-]{1,80}$/.test(url.pathname);
   if(!isPost&&!isGet)return json({error:'Not found.'},404);
   if(isPost&&(request.headers.get('Origin')!==url.origin||request.headers.get('Content-Type')?.split(';')[0]!=='application/json'))return json({error:'Create from the Pebli canvas.'},403);
   const headers=new Headers({'X-Pebli-Owner':owner,'X-Pebli-Network':await sha(request.headers.get('CF-Connecting-IP')||'local')});
   let body;
   if(isPost){
    const music=url.pathname.endsWith('/music'),text=url.pathname.endsWith('/text');
    if(!(music?env.FAL_KEY:env.OPENROUTER_API_KEY))return json({error:music?'The music service is not connected yet.':text?'The story service is not connected yet.':'The image service is not connected yet.'},503);
    const raw=await readJson(request,music||text?24000:10_000_000);
    body=JSON.stringify(music?validateMusic(raw):text?validateText(raw):validateRequest(raw));headers.set('Content-Type','application/json');
   }
   return await env.JOBS.get(env.JOBS.idFromName('pebli-creative-jobs-v1')).fetch(new Request(request.url,{method:request.method,headers,body}));
  }catch(error){return json({error:request.method==='POST'&&(error instanceof SyntaxError)?'That request could not be read.':error.message?.startsWith('Tell Moss')||error.message?.startsWith('Leave email')||error.message?.startsWith('Describe your')||error.message?.startsWith('Choose a')||error.message?.startsWith('Start a')||error.message?.startsWith('This request')?error.message:'The crew could not connect. Your work is still on this device.'},400)}
 }
};
export class PebliJobs {
 constructor(ctx,env){this.ctx=ctx;this.env=env;this.running=false}
 async schedule(delay=1000){const alarm=await this.ctx.storage.getAlarm();const next=Date.now()+delay;if(!alarm||alarm>next)await this.ctx.storage.setAlarm(next)}
 async fetch(request){
  const url=new URL(request.url),owner=request.headers.get('X-Pebli-Owner'),id=url.pathname.split('/').at(-1),s=this.ctx.storage;
  if(request.method==='GET'){
   const job=await s.get(jobKey(owner,id));if(!job)return json({error:'This request was not found for this browser.'},404);
   if(url.pathname.includes('/media/')){
    if(job.status!=='completed')return json({error:'Your creation is not ready yet.'},409);
    const object=await this.env.MEDIA.get(mediaKey(job));if(!object)return json({error:'This server copy has expired. Check your saved canvas.'},410);
    return new Response(object.body,{headers:{'Content-Type':job.kind==='music'?'audio/mpeg':job.mime,'Cache-Control':'private, no-store','X-Content-Type-Options':'nosniff'}});
   }
   return json(publicJob(job));
  }
  const input=await request.json(),kind=url.pathname.endsWith('/music')?'music':url.pathname.endsWith('/text')?'text':'image';
  const claim=await claimJob(s,{owner,ip:request.headers.get('X-Pebli-Network'),id:input.requestId,hash:await sha(JSON.stringify({kind,input})),kind});
  if(claim.status)return json({error:claim.error},claim.status);
  if(!claim.claimed)return json(publicJob(claim.job));
  const job=claim.job;
  // Schedule before external storage so an interrupted preparation is recoverable.
  await this.schedule();
  try {
   await this.env.MEDIA.put(inputKey(job),JSON.stringify(input),{httpMetadata:{contentType:'application/json'}});
   job.status='queued';await s.put(claim.key,job);await this.schedule();
   return json(publicJob(job),202);
  }catch{
   job.status='failed';job.error='The request could not be saved. No generation was started.';await s.put(claim.key,job);
   return json(publicJob(job),503);
  }
 }
 async alarm(){
  if(this.running){await this.schedule(10000);return}
  this.running=true;
  try {
   const now=Date.now(),jobs=await this.ctx.storage.list({prefix:'job:'});let processed=0;
   for(const [key,job] of jobs){
    if(now-job.created>RETENTION_MS){await this.env.MEDIA.delete([inputKey(job),mediaKey(job)]);await this.ctx.storage.put(`seen:${job.owner}:${job.id}`,{id:job.id,hash:job.hash,status:'failed',error:'This server copy has expired. Start a new request if needed.'});await this.ctx.storage.delete(key);continue}
    if(job.status==='preparing'&&now-job.created>120000){job.status='failed';job.error='The request could not be saved. Please start a new one.';await this.ctx.storage.put(key,job)}
    if(job.status==='submitting'||job.status==='storing'){
     // Alarm replay after a crash must never issue another paid POST.
     const saved=await this.env.MEDIA.head(mediaKey(job));
     job.status=saved?'completed':'uncertain';job.mime=saved?.httpMetadata?.contentType;
     if(!saved)job.error='This request may still have been processed. It will not be sent again automatically.';
     await this.ctx.storage.put(key,job);
    }
    if(processed<2&&job.status==='queued'){processed++;await this.startJob(key,job)}
    else if(processed<2&&job.status==='pending'){processed++;await this.pollSong(key,job)}
   }
   const budgets=await this.ctx.storage.list({prefix:'budget:'});
   for(const [key,value] of budgets)if(value.expires<now)await this.ctx.storage.delete(key);
  }finally{
   this.running=false;
   const jobs=await this.ctx.storage.list({prefix:'job:'});
   const active=[...jobs.values()].some(j=>['queued','preparing','pending'].includes(j.status));
   await this.schedule(active?10000:86400000);
  }
 }
 async startJob(key,job){
  const s=this.ctx.storage;
  try {
   const object=await this.env.MEDIA.get(inputKey(job));if(!object)throw Error('Missing input');
   const input=await object.json();
   job.status='submitting';job.updated=Date.now();job.model=job.kind==='music'?MUSIC_MODEL:job.kind==='text'?(this.env.OPENROUTER_TEXT_MODEL||TEXT_MODEL):this.env.OPENROUTER_IMAGE_MODEL||'qwen/qwen-image-3';
   await s.put(key,job);
   if(job.kind==='music'){
    job.providerId=await submitSong(input,this.env);job.status='pending';job.updated=Date.now();await s.put(key,job);
   }else if(job.kind==='text'){
    const result=await generateText(input,{key:this.env.OPENROUTER_API_KEY,model:this.env.OPENROUTER_TEXT_MODEL||TEXT_MODEL});
    job.mime='application/json';job.status='storing';await s.put(key,job);
    await this.env.MEDIA.put(mediaKey(job),JSON.stringify({text:result.text}),{httpMetadata:{contentType:job.mime}});
    job.status='completed';await s.put(key,job);
   }else{
    const result=await makeImage(input,this.env);const [prefix,b64]=result.image.split(',');job.mime=prefix.slice(5,-7);job.status='storing';await s.put(key,job);
    const binary=atob(b64),bytes=Uint8Array.from(binary,c=>c.charCodeAt(0));
    await this.env.MEDIA.put(mediaKey(job),bytes,{httpMetadata:{contentType:job.mime}});
    job.status='completed';await s.put(key,job);
   }
  }catch{
   job.status='uncertain';job.error='The request could not be confirmed. It will not be sent again automatically. Start a new one only if you want to try again.';await s.put(key,job);
  }finally{await this.env.MEDIA.delete(inputKey(job)).catch(()=>{})}
 }
 async pollSong(key,job){
  if(Date.now()-job.created>20*60*1000){job.status='uncertain';job.error='This song is taking too long. It may still have been processed; no new request was sent.';await this.ctx.storage.put(key,job);return}
  try {
   const audio=await readSong(job.providerId,this.env);if(!audio)return;
   await this.env.MEDIA.put(mediaKey(job),audio,{httpMetadata:{contentType:'audio/mpeg'}});
   job.status='completed';await this.ctx.storage.put(key,job);
  }catch{/* Retry status/download only; never submit another paid request. */}
 }
}
