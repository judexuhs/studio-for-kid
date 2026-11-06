import test from 'node:test';
import assert from 'node:assert/strict';
import { validateMusic, claimJob, publicJob } from './policy.js';
function store(){const data=new Map();const s={get:async k=>structuredClone(data.get(k)),put:async(k,v)=>data.set(k,structuredClone(v)),data};s.transaction=async fn=>fn(s);return s;}
const input={requestId:'request-1',prompt:'A gentle song about a whale in space',lyrics:'Hello stars',instrumental:false};
test('music preserves explicit lyrics and rejects contact details and oversized input',()=>{
 assert.equal(validateMusic(input).lyrics,'Hello stars');
 assert.throws(()=>validateMusic({...input,lyrics:'mail me at kid@example.com'}));
 assert.throws(()=>validateMusic({...input,prompt:'x'.repeat(1501)}));
 assert.equal(validateMusic({...input,instrumental:true}).lyrics,'');
});
test('paid jobs deduplicate by owner and ID, conflict on changed content, and do not share results',async()=>{
 const s=store(),args={owner:'a',ip:'ip',id:'request-1',hash:'hash',kind:'image',now:1000};
 const first=await claimJob(s,args);assert.equal(first.claimed,true);
 assert.equal((await claimJob(s,args)).claimed,false);
 assert.equal((await claimJob(s,{...args,hash:'different'})).status,409);
 assert.equal((await claimJob(s,{...args,owner:'b'})).claimed,true);
 assert.equal(publicJob({...first.job,provider:'secret',owner:'private'}).owner,undefined);
});
test('guest resets cannot bypass network or global paid generation budgets',async()=>{
 const s=store();
 for(let i=0;i<6;i++)assert.equal((await claimJob(s,{owner:`guest${i}`,ip:'shared',id:`req-${i}`,hash:'h',kind:'image',now:1000})).claimed,true);
 assert.equal((await claimJob(s,{owner:'fresh',ip:'shared',id:'req-7',hash:'h',kind:'image',now:1000})).status,429);
});
test('unknown completion does not expose provider payloads and keeps uncertainty explicit',()=>{
 const j=publicJob({id:'a',status:'uncertain',error:'The request may still be processing. Start a new one only if needed.',providerId:'hidden',hash:'hidden'});
 assert.equal(j.status,'uncertain');assert.equal(j.hash,undefined);assert.equal(j.providerId,undefined);
});
