export async function readGeneration(job,signal){
 const post=await fetch(job.kind==='music'?'/api/pebli/music':job.kind==='text'?'/api/pebli/text':'/api/pebli/images',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(job.body),signal});
 const submitted=await post.json();if(!post.ok)throw Error(submitted.error||'The crew could not connect. Try again.');
 if(['failed','uncertain'].includes(submitted.status))throw Error(submitted.error||'This request could not finish.');
 const response=await fetch('/api/pebli/jobs/'+job.id,{signal});
 const data=await response.json();if(!response.ok)throw Error(data.error||'Your request could not be found.');
 if(['failed','uncertain'].includes(data.status))throw Error(data.error||'This request could not finish.');
 if(data.status!=='completed'||!data.mediaUrl)return data;
 if(!/^\/api\/pebli\/media\/[a-zA-Z0-9-]{1,80}$/.test(data.mediaUrl))throw Error('The creation address could not be verified.');
 const media=await fetch(data.mediaUrl,{signal});if(!media.ok)throw Error('Your creation could not be downloaded.');
 if(data.kind==='text'){const result=await media.json();if(typeof result.text!=='string'||result.text.length>6000)throw Error('The story could not be opened.');return {...data,text:result.text}}
 const blob=await media.blob();
 const file=await new Promise((resolve,reject)=>{const reader=new FileReader();reader.onload=()=>resolve(reader.result);reader.onerror=()=>reject(Error('Your creation could not be saved.'));reader.readAsDataURL(blob)});
 return {...data,...(data.kind==='music'?{audio:file}:{image:file})};
}
