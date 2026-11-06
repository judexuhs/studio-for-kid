// Guest budgets are shared across all Worker instances through one Durable Object.
export const RETENTION_MS = 7 * 24 * 60 * 60 * 1000;
export const validId = value => typeof value === 'string' && /^[a-zA-Z0-9-]{1,80}$/.test(value);
const contact = /[\w.+-]+@[\w.-]+\.[a-z]{2,}|(?:\d[\s-]?){8,}/i;
export function validateMusic(body) {
  if (!body || !validId(body.requestId)) throw Error('Start a new song request.');
  if (typeof body.prompt !== 'string' || body.prompt.trim().length < 10 || body.prompt.length > 1500) throw Error('Describe your song in 10–1500 characters.');
  if (typeof body.instrumental !== 'boolean' || typeof body.lyrics !== 'string' || body.lyrics.length > 3500) throw Error('Choose a song or instrumental, with lyrics under 3,500 characters.');
  if (body.context!==undefined&&(typeof body.context!=='string'||body.context.length>3000)) throw Error('Keep the song context under 3,000 characters.');
  if (contact.test(body.prompt + '\n' + body.lyrics+'\n'+(body.context||''))) throw Error('Leave email addresses and phone numbers out of your song.');
  return {...(body.context?{context:body.context}:{}),requestId:body.requestId,prompt:body.prompt.trim(),lyrics:body.instrumental?'':body.lyrics,instrumental:body.instrumental};
}
export async function claimJob(storage, {owner, ip, id, hash, kind, now = Date.now()}) {
  return storage.transaction(async tx => {
    const key = `job:${owner}:${id}`;
    const existing = await tx.get(key) || await tx.get(`seen:${owner}:${id}`);
    if (existing) return existing.hash === hash ? {claimed:false,job:existing} : {status:409,error:'Use a new request for this change.'};
    const hour = Math.floor(now / 3600000), day = Math.floor(now / 86400000);
    const budgets = [
      [`budget:guest:${owner}:${hour}`, 4],
      [`budget:network:${ip}:${hour}`, 6],
      [`budget:global:hour:${hour}`, 20],
      [`budget:global:day:${day}`, 60],
      ...(kind === 'music' ? [[`budget:music:day:${day}`, 12]] : []),
    ];
    const counts = await Promise.all(budgets.map(async ([key, limit]) => ({key,limit,value:await tx.get(key)||{count:0,expires:now+86400000}})));
    if (counts.some(c => c.value.count >= c.limit)) return {status:429,error:'The crew needs a making break. Please come back later.'};
    for (const c of counts) await tx.put(c.key,{...c.value,count:c.value.count+1});
    const job = {id,owner,hash,kind,status:'preparing',created:now,updated:now};
    await tx.put(key,job);
    return {claimed:true,job,key};
  });
}
export function publicJob(job) {
  return {requestId:job.id,status:['queued','preparing','submitting','pending','storing'].includes(job.status)?'working':job.status,
    ...(job.status === 'completed' ? {mediaUrl:`/api/pebli/media/${job.id}`,kind:job.kind,model:job.model} : {}),
    ...(job.error ? {error:job.error} : {})};
}
