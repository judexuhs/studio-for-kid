import {characterProfile} from './model.js';
export const CREW={moss:'Moss',tavi:'Tavi',nix:'Nix',pip:'Pip'};
export function worldContext(board){
 const world=board.world||{};
 return [characterProfile(board).name?`Main character: ${characterProfile(board).name}.`:'',world.setting?`World: ${world.setting}`:''].filter(Boolean).join('\n');
}
export function requestContext(board,task,inputs){
 return [task.useWorld?worldContext(board):'',...inputs.map(n=>n.text||n.instruction||n.title||'')].filter(Boolean).join('\n').slice(0,2000);
}
export function presentationItems(board){
 const ids=board.presentation?.ids||[];
 return [...new Set(ids)].slice(0,5).map(id=>board.nodes.find(n=>n.id===id&&(n.image||n.kind==='result'&&n.text))).filter(Boolean);
}
export function openPresentation(board,id){
 const work=board.nodes.find(n=>n.id===id&&(n.image||n.kind==='result'&&n.text));
 return {...board,presentation:work?{...board.presentation,ids:[work.id],coverId:work.id,includeJourney:board.presentation?.includeJourney||false}:board.presentation||{ids:[],includeJourney:false}};
}
export function creativeJourney(board,selectedIds){
 const seen=new Set(),selected=[];
 function include(n){if(!n||seen.has(n.id))return;seen.add(n.id);for(const input of n.inputs?.length?n.inputs:n.input?[n.input]:[])include(input);if(n.kind==='result')selected.push(n)}
 if(selectedIds)for(const id of selectedIds)include(board.nodes.find(n=>n.id===id));
 return (selectedIds?selected:board.nodes.filter(n=>n.kind==='result')).map(n=>({id:n.id,title:n.title,instruction:n.instruction||'',preserve:n.preserve||'',partner:CREW[n.partner]||(n.move?'Pip':'Moss'),kept:!!n.accepted,fromDrawing:(n.inputs||[n.input]).some(s=>s?.medium==='drawing'||s?.title==='My drawing'),references:(n.inputs||[n.input]).filter(s=>s?.image).length}));
}
export const escapeHtml=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const imageUrl=value=>/^data:image\/(png|jpeg|webp);base64,[A-Za-z0-9+/=]+$/.test(value||'')?value:'';
export function buildWorldHtml(board){
 const items=presentationItems(board),cover=items.find(n=>n.id===board.presentation?.coverId)||items[0];
 const music=board.nodes.find(n=>n.id===board.presentation?.musicId&&/^data:audio\/mpeg;base64,[A-Za-z0-9+/=]+$/.test(n.audio||''));
 const render=n=>n.image?`<img src="${imageUrl(n.image)}" alt="${escapeHtml(n.title)}" class="${['float','hop','dance'].includes(n.move)?'motion-'+n.move:''}">`:`<p class="story">${escapeHtml(n.text)}</p>`;
 const journey=board.presentation?.includeJourney?`<section class="journey"><h2>My creative journey</h2>${creativeJourney(board,[...items.map(n=>n.id),...(music?[music.id]:[])]).map(n=>`<article><h3>${escapeHtml(n.title)}</h3><p>My direction: ${escapeHtml(n.instruction)}</p>${n.preserve?`<p>I wanted to keep: ${escapeHtml(n.preserve)}</p>`:''}<p>${escapeHtml(n.partner)} helped make this.${n.fromDrawing?' I started with my drawing.':''}${n.kept?' I marked this version as a favorite.':''}</p></article>`).join('')}</section>`:'';
 return `<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta http-equiv="Content-Security-Policy" content="default-src 'none'; img-src data:; media-src data:; style-src 'unsafe-inline'"><title>${escapeHtml(board.name)} — Pebli</title><style>body{margin:0;background:#f8f6f0;color:#253630;font:18px/1.65 system-ui}main{max-width:1040px;margin:auto;padding:50px 24px}h1{font-size:clamp(36px,7vw,76px);line-height:1.05;letter-spacing:-.03em}h2{font-size:30px}figure{margin:40px 0 70px}img{display:block;max-width:100%;max-height:75vh;margin:auto;object-fit:contain;border-radius:16px}figcaption{margin-top:18px}.story{white-space:pre-wrap;max-width:65ch;font-size:22px}audio{max-width:100%}.cover{max-height:60vh}.journey{border-top:1px solid #bccac0;margin-top:80px;padding-top:30px}.journey article{margin:30px 0}footer{margin-top:70px} .motion-float{animation:float 4s ease-in-out 1}.motion-hop{animation:hop 3s ease-in-out 1}.motion-dance{animation:dance 3s ease-in-out 1}@keyframes float{50%{transform:translateY(-12px)}}@keyframes hop{50%{transform:translateY(-24px)}}@keyframes dance{25%{transform:rotate(-5deg)}75%{transform:rotate(5deg)}}@media(prefers-reduced-motion:reduce){img{animation:none!important}}</style><main><header><h1>${escapeHtml(board.name)}</h1>${board.world?.setting?`<p>${escapeHtml(board.world.setting)}</p>`:''}${cover?.image?`<img class="cover ${['float','hop','dance'].includes(cover.move)?'motion-'+cover.move:''}" src="${imageUrl(cover.image)}" alt="${escapeHtml(cover.title)}"><p>${escapeHtml(cover.title)}</p>`:''}${music?`<p>My soundtrack</p><audio controls src="${music.audio}" aria-label="${escapeHtml(music.title)}"></audio>`:''}</header>${items.filter(n=>n.id!==cover?.id||!cover?.image).map(n=>`<figure>${render(n)}<figcaption><h2>${escapeHtml(n.title)}</h2></figcaption></figure>`).join('')}${journey}<footer>Created with Pebli · My ideas, with a little help from my crew.</footer></main></html>`;
}
export async function prepareWorldExport(board){
 const copy=structuredClone(board);
 const selected=new Set(presentationItems(copy).map(n=>n.id));
 for(const n of copy.nodes){if(selected.has(n.id)&&n.image==='asset:fox'){
  const r=await fetch('/assets/moon-fox.png');if(!r.ok)throw Error('The picture could not be included. Try again.');const blob=await r.blob();
  n.image=await new Promise((resolve,reject)=>{const reader=new FileReader();reader.onload=()=>resolve(reader.result);reader.onerror=()=>reject(Error('Could not read the picture.'));reader.readAsDataURL(blob)});
 }}
 return buildWorldHtml(copy);
}
export function downloadFile(data,name,type){const url=URL.createObjectURL(new Blob([data],{type})),a=document.createElement('a');a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000)}
