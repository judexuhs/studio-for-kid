import {mkdir,readFile,writeFile,rename} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {validateRequest,generate} from './generation.js';
import {validateText,generateText,TEXT_MODEL} from './text-generation.js';
import {validateMusic} from '../cloudflare/policy.js';
import {submitSong,readSong,MUSIC_MODEL} from '../cloudflare/providers.js';
const dir=new URL('../.pebli-data/jobs/',import.meta.url);
async function writeJob(id,data){await mkdir(dir,{recursive:true});const path=new URL(id+'.json',dir),temp=new URL(id+'.tmp',dir);await writeFile(temp,JSON.stringify(data),{mode:0o600});await rename(temp,path)}
async function readJob(id){try{return JSON.parse(await readFile(new URL(id+'.json',dir),'utf8'))}catch(e){if(e.code==='ENOENT')return null;throw Error('Saved requests could not be read. Check disk space before trying again.')}}
export function pebliApi({generator=generate,textGenerator=generateText,songSubmit=submitSong,songRead=readSong,saveJob=writeJob,loadJob=readJob}={}){
 const active=new Map(),recovery=new Map();let recent=[];
 const read=id=>recovery.has(id)?Promise.resolve(recovery.get(id)):loadJob(id);
 const persist=async(id,data)=>{try{await saveJob(id,data);recovery.delete(id)}catch{recovery.set(id,data)}};
 async function finishSong(id,job){
  try{
   while(Date.now()-job.started<20*60*1000){
    const audio=await songRead(job.providerId,process.env).catch(()=>null);
    if(audio){await persist(id,{hash:job.hash,kind:'music',status:'completed',audio:`data:audio/mpeg;base64,${Buffer.from(audio).toString('base64')}`,model:MUSIC_MODEL});return}
    await new Promise(resolve=>setTimeout(resolve,2500));
   }
   await persist(id,{...job,status:'uncertain',error:'This song is taking too long. No new request was sent. Retry only if you want a new request.'});
  }finally{active.delete(id)}
 }
 function install(server){server.middlewares.use(async(req,res,next)=>{
  if(!req.url?.startsWith('/api/pebli/'))return next();
  res.setHeader('Content-Type','application/json');res.setHeader('Cache-Control','no-store');
  const send=(status,data)=>{res.statusCode=status;res.end(JSON.stringify(data))};
  const host=req.headers.host||'';
  if(!/^(127\.0\.0\.1|localhost):\d+$/.test(host))return send(403,{error:'Local access only.'});
  if(req.headers.origin&&req.headers.origin!==`http://${host}`)return send(403,{error:'Open Pebli in this browser to continue.'});
  if(req.method==='GET'&&req.url==='/api/pebli/status')return send(200,{configured:!!process.env.OPENROUTER_API_KEY,textConfigured:!!process.env.OPENROUTER_API_KEY,musicConfigured:!!process.env.FAL_KEY,model:process.env.OPENROUTER_IMAGE_MODEL||'qwen/qwen-image-3'});
  const match=req.url.match(/^\/api\/pebli\/jobs\/([a-zA-Z0-9-]{1,80})$/);
  if(req.method==='GET'&&match){
   let j;try{j=await read(match[1])}catch{return send(503,{error:'Saved requests could not be read. Please check disk space.'})}
   if(!j)return send(404,{error:'This request was not found. Please try again.'});
   if(['working','pending'].includes(j.status)&&!active.has(match[1])){
    if(j.kind==='music'&&j.providerId){active.set(match[1],j.hash);finishSong(match[1],j).catch(()=>{});}
    else return send(200,{status:'uncertain',error:'The app restarted before this creation finished. It will not be sent again automatically.'});
   }
   const {hash,providerId,started,...safe}=j;return send(200,{...safe,status:j.status==='pending'?'working':j.status});
  }
  const kinds={'/api/pebli/images':'image','/api/pebli/text':'text','/api/pebli/music':'music'},kind=kinds[req.url];
  if(req.method!=='POST'||!kind)return send(404,{error:'Not found'});
  if(req.headers['content-type']?.split(';')[0]!=='application/json')return send(415,{error:'Use JSON.'});
  let claimedId=null;
  try{
   let raw='';for await(const chunk of req){raw+=chunk;if(raw.length>(kind==='image'?10e6:24000))return send(413,{error:'This request is too big. Use a smaller idea or picture.'})}
   const input=(kind==='music'?validateMusic:kind==='text'?validateText:validateRequest)(JSON.parse(raw));
   const id=input.requestId,hash=createHash('sha256').update(JSON.stringify({kind,input})).digest('hex');
   const existing=await read(id);
   if(existing){
    const legacy=kind==='image'&&!existing.kind&&existing.hash===createHash('sha256').update(JSON.stringify(input)).digest('hex');
    if(existing.hash!==hash&&!legacy)return send(409,{error:'Use a new request for this change.'});
    return send(200,{requestId:id,status:existing.status==='pending'?'working':existing.status});
   }
   if(!(kind==='music'?process.env.FAL_KEY:process.env.OPENROUTER_API_KEY))return send(503,{error:`The ${kind==='text'?'story':kind} service is not connected yet.`});
   if(active.has(id))return active.get(id)===hash?send(202,{requestId:id,status:'working'}):send(409,{error:'Use a new request for this change.'});
   recent=recent.filter(t=>Date.now()-t<3600000);
   if(active.size>=2||recent.length>=30)return send(429,{error:'The crew needs a making break. Please try again later.'});
   active.set(id,hash);claimedId=id;recent.push(Date.now());await saveJob(id,{hash,kind,status:'working',started:Date.now()});
   send(202,{requestId:id,status:'working'});
   (async()=>{
    try{
     if(kind==='music'){
      const providerId=await songSubmit(input,process.env),job={hash,kind,status:'pending',providerId,started:Date.now()};
      await persist(id,job);await finishSong(id,job);
     }else{
      const result=kind==='text'?await textGenerator(input,{key:process.env.OPENROUTER_API_KEY,model:process.env.OPENROUTER_TEXT_MODEL||TEXT_MODEL}):await generator(input);
      await persist(id,{hash,kind,status:'completed',...result});
     }
    }catch{
     await persist(id,{hash,kind,status:'uncertain',error:'This creation could not be confirmed. It will not be sent again automatically. Your original work is safe.'});
    }finally{active.delete(id)}
   })().catch(()=>{});
  }catch(e){if(claimedId)active.delete(claimedId);send(400,{error:claimedId?'Your request could not be saved. No generation was started.':e instanceof SyntaxError?'This request could not be read. Try again.':e.message})}
 })}
 return {name:'pebli-private-api',configureServer:install,configurePreviewServer:install};
}
