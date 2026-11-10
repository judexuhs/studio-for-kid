import {imageStyleSettings} from './image-styles.js';
import {validRegion,validDrawing,validPicture,NEXT_STEPS} from './creative-tools.js';
export const FOX='asset:fox';
export function initialBoard(){return {schema:2,name:'A little space adventure',unlocked:false,view:{x:0,y:0,z:1},nodes:[
{id:'idea',kind:'note',x:140,y:210,text:'What if a tiny fox\nwent to the moon?',title:'A small idea'},
{id:'reference',kind:'material',x:930,y:190,title:'My space explorer',image:FOX},
{id:'task',kind:'task',partner:'moss',x:530,y:160,source:'idea',text:'Give my fox a mint-green spacesuit and a little flag.',color:'mint',scene:'moon'}]};}
export function reduceBoard(b,a){switch(a.type){
case 'character-profile':{
 const profile={...characterProfile(b,a.id),...a.patch};
 if(b.world?.characterId===a.id)return {...b,world:{...b.world,characterName:profile.name,characterBio:profile.bio}};
 return {...b,cards:{...b.cards,[a.id]:profile}};
}
case 'main-character':{
 const n=b.nodes.find(n=>n.id===a.id);if(a.id!==null&&!n?.image)return b;
 const previous=b.world?.characterId,profile=characterProfile(b,a.id);
 const cards=previous?{...b.cards,[previous]:characterProfile(b,previous)}:b.cards;
 if(a.id===null)return {...b,cards,world:{...b.world,characterId:null}};
 const hasProfile=!!b.cards?.[a.id]||a.id===previous||a.id===b.finishedId;
 return {...b,cards,world:{...b.world,characterId:n.id,characterName:a.name??(hasProfile?profile.name:characterProfile(b).name),characterBio:hasProfile?profile.bio:characterProfile(b).bio,setting:a.setting??b.world?.setting??''}};
}
case 'revise-inline':{
 const result=b.nodes.find(n=>n.id===a.id),owner=result&&resultOwner(b,result);
 if(!owner||!result.image||validate(a.text)||owner.job?.status==='working')return b;
 return {...b,nodes:b.nodes.map(n=>n.id===owner.id?{...n,partner:'moss',source:result.id,sources:[result.id],text:a.text,...imageStyleSettings(a,true),preserve:a.preserve||'',editRegion:validRegion(a.editRegion)?structuredClone(a.editRegion):null,goal:undefined,operation:undefined,resultTitle:result.title,job:undefined,activeResultId:result.id}:n)};
}
case 'draft': {
 return {...b,nodes:[...b.nodes,{id:a.id,kind:'task',inline:true,partner:'moss',goal:'idea',text:'',source:null,...freePosition(b,{x:a.x??160,y:a.y??160})}]};
}
case 'creation': {
 if(validate(a.text)||!CREATION_TYPES[a.goal])return b;
 const node={id:a.id,kind:'task',inline:true,partner:'moss',goal:a.goal,title:CREATION_TYPES[a.goal].label,text:a.text,source:null,...freePosition(b,{x:a.x??160,y:a.y??160})};
 return {...b,nodes:[...b.nodes,node]};
}
case 'drawing': {
 if(!validPicture(a.image)||!validDrawing(a.drawing)||(a.description&&validate(a.description))||(['tavi','nix'].includes(a.partner)&&!a.description?.trim()))return b;
 const material={id:a.id,kind:'material',medium:'drawing',title:'My drawing',text:a.description||'',image:a.image,drawing:structuredClone(a.drawing),...(a.source?{source:a.source}:{}),...freePosition(b,{x:a.x??160,y:a.y??160})};
 let next={...b,nodes:[...b.nodes,material]};
 if(a.partner&&a.taskId){next=reduceBoard(next,{type:'task',id:a.taskId,source:a.id,partner:a.partner,x:material.x+400,y:material.y});next={...next,nodes:next.nodes.map(n=>n.id===a.taskId?{...n,text:{moss:'Use my drawing as the starting point. Keep its shapes and details, and turn it into an illustration.',tavi:'Write a short story inspired by my drawing description.',nix:'Make a soundtrack for the idea in my drawing description.',pip:'Make my drawing float gently.'}[a.partner]}:n)}}
 return next;
}
case 'continue': {
 const option=NEXT_STEPS[a.step],source=b.nodes.find(n=>n.id===a.source);if(!option||!source?.image)return b;
 const owner=visibleOwner(b,source.id);const next=reduceBoard(b,{type:'task',id:a.id,partner:option.partner,source:source.id,x:owner.x+400,y:owner.y});
 return {...next,nodes:next.nodes.map(n=>n.id===a.id?{...n,text:option.prompt,creationType:option.creationType}:n)};
}
case 'arrange':return arrangeGroup(b,a.id);
case 'compose': {
 const sources=[...new Set(a.sources||[])];
 const inputs=sources.map(id=>b.nodes.find(n=>n.id===id));
 const option=CREATION_ACTIONS[a.operation];
 if(!option||sources.length!==(a.sources||[]).length||sources.length<(option.multi?2:1)||sources.length>4||inputs.some(n=>!n?.image||n.kind==='task'))return b;
 return {...b,nodes:[...b.nodes,{id:a.id,kind:'task',inline:true,partner:'moss',...imageStyleSettings(inputs[0],true),sources,source:sources[0],operation:a.operation,title:option.label,text:option.prompt,...freePosition(b,{x:option.multi?Math.max(...inputs.map(n=>n.x))+400:a.x??inputs[0].x+400,y:a.y??inputs[0].y})}]};
}
case 'add':return {...b,nodes:[...b.nodes,{...a.node,...freePosition(b,a.node)}]};
case 'edit':return {...b,nodes:b.nodes.map(n=>n.id===a.id?{...n,...a.patch}:n)};
case 'details':return {...b,...a.patch};
case 'finish':return {...b,finishedId:a.id};
case 'name':return {...b,name:a.name};
case 'view':return {...b,view:a.view};
case 'task':{if(!['moss','tavi','nix','pip'].includes(a.partner))return b;let input=b.nodes.find(n=>n.id===a.source);if(input?.kind==='task')input=null;return {...b,nodes:[...b.nodes,{id:a.id,kind:'task',inline:true,partner:a.partner,...(a.partner==='moss'?imageStyleSettings(input||{},!!input?.image):{}),...freePosition(b,{x:a.x??500,y:a.y??250}),source:input?.id??null,useWorld:false,text:a.partner==='tavi'?'Tell a short story about my idea.':a.partner==='pip'?'Make my picture float gently.':a.partner==='nix'?(input?.partner==='nix'?input.instruction:'Make a playful soundtrack for my idea.'):(input?.partner==='tavi'?(input.storyFormat==='comic'?'Illustrate this story as a three-panel comic. Keep the same characters. No text.':'Illustrate this story, keeping its characters and setting.'):'Turn my idea into a character.'),instrumental:!!input?.instrumental,lyrics:input?.lyrics||'',color:'mint',scene:'moon',move:'float',storyFormat:a.partner==='tavi'&&input?'next-scene':'story'}]};}
case 'result':{const t=a.snapshot||b.nodes.find(n=>n.id===a.task);if(!t||t.kind!=='task'||!t.text.trim())return b;const input=a.inputSnapshot||b.nodes.find(n=>n.id===t.source);if(t.partner==='pip'&&!input?.image)return b;return {...b,nodes:[...b.nodes.map(n=>n.id===t.id&&n.inline?{...n,activeResultId:a.id}:n),{id:a.id,kind:'result',...(t.inline?{x:t.x,y:t.y}:freePosition(b,{x:t.x+390,y:t.y+(a.offset||0)})),source:t.id,title:t.resultTitle||(t.goal?{character:'My character',world:'My world',comic:'My comic'}[t.goal]:null)||t.title|| (t.partner==='tavi'?'My story':t.partner==='nix'?'My new song':t.partner==='pip'?'My moving character':'My new character'),...(t.partner==='tavi'?{text:a.text,partner:'tavi',storyFormat:t.storyFormat||'story'}:t.partner==='nix'?{audio:a.audio,partner:'nix',lyrics:t.lyrics||'',instrumental:!!t.instrumental}:{image:a.image||input?.image||FOX}),live:!!a.live,...(t.partner==='moss'?imageStyleSettings(t,!!input?.image):{}),instruction:t.text,preserve:t.preserve||'',editRegion:validRegion(t.editRegion)?structuredClone(t.editRegion):null,worldContext:t.worldContext||'',input:input?structuredClone(input):null,inputs:structuredClone(a.inputsSnapshot||sourceNodes(b,t)),operation:t.operation,creationType:t.creationType||t.goal||({scene:'world',comic:'comic',stickers:'stickers',fusion:'character',together:'scene'}[t.operation])||input?.creationType,color:t.color,scene:t.scene,move:t.partner==='pip'?(t.move||'float'):null,accepted:false}]};}
case 'accept':return b.nodes.some(n=>n.id===a.id&&n.kind==='result')?{...b,unlocked:b.unlocked||b.nodes.some(n=>n.id===a.id&&!!n.image),nodes:b.nodes.map(n=>n.id===a.id?{...n,accepted:a.value??!n.accepted}:n)}:b;
case 'remove':{const target=b.nodes.find(n=>n.id===a.id);const ids=new Set([a.id,...(target?.inline?b.nodes.filter(n=>n.kind==='result'&&n.source===a.id).map(n=>n.id):[])]);return {...b,...(b.presentation?{presentation:{...b.presentation,ids:b.presentation.ids.filter(id=>!ids.has(id)),...(ids.has(b.presentation.coverId)?{coverId:null}:{}),...(ids.has(b.presentation.musicId)?{musicId:null}:{})}}:{}),...(ids.has(b.world?.characterId)?{world:{...b.world,characterId:null}}:{}),nodes:b.nodes.filter(n=>!ids.has(n.id)).map(n=>({...n,...(ids.has(n.source)?{source:null}:{}),...(n.sources?{sources:n.sources.filter(id=>!ids.has(id))}:{})}))};}

default:return b;}}
export function restore(raw){try{const b=JSON.parse(raw);if(b.schema!==2||!Array.isArray(b.nodes)||b.nodes.length>300)throw Error();if(!b.nodes.every(n=>typeof n.id==='string'&&['note','material','task','result'].includes(n.kind)&&Number.isFinite(n.x)&&Number.isFinite(n.y)))throw Error();if(b.nodes.some(n=>n.sources&&(!Array.isArray(n.sources)||n.sources.length>4||n.sources.some(id=>typeof id!=='string'))))throw Error();if(b.nodes.some(n=>n.image&&!/^data:image\/(png|jpeg|webp);base64,/.test(n.image)&&n.image!==FOX))throw Error();if(b.world&&(typeof b.world!=='object'||typeof (b.world.setting??'')!=='string'||(b.world.setting||'').length>400||typeof (b.world.characterName??'')!=='string'||(b.world.characterName||'').length>40))throw Error();if(b.presentation&&(!Array.isArray(b.presentation.ids)||b.presentation.ids.length>5||b.presentation.ids.some(id=>typeof id!=='string')))throw Error();if(b.nodes.some(n=>n.partner==='tavi'&&n.kind==='result'&&(typeof n.text!=='string'||n.text.length>6000)))throw Error();if(b.nodes.some(n=>(n.editRegion&&!validRegion(n.editRegion))||(n.drawing&&!validDrawing(n.drawing))))throw Error();if(b.nodes.some(n=>n.audio&&(typeof n.audio!=='string'||!/^data:audio\/mpeg;base64,[A-Za-z0-9+/=]+$/.test(n.audio)||n.audio.length>28000000)))throw Error();return {...b,...legacyCharacter(b),view:b.view&&[b.view.x,b.view.y,b.view.z].every(Number.isFinite)?{...b.view,z:Math.max(.15,Math.min(1.5,b.view.z))}:{x:0,y:0,z:1}};}catch{return initialBoard();}}
export function validate(text){if(!text.trim())return 'Tell your partner what to make first.';if(text.length>500)return 'Keep your idea under 500 characters.';if(/[\w.+-]+@[\w.-]+\.[a-z]{2,}|(?:\d[\s-]?){8,}/i.test(text))return 'Keep names, email addresses and phone numbers out of your idea.';return '';}

export function newProject(idea){const id=crypto.randomUUID();return {schema:2,id,name:'My new character',unlocked:false,view:typeof window!=='undefined'&&window.innerWidth<600?{x:-105,y:-80,z:1}:{x:0,y:0,z:1},nodes:[{id:'idea',kind:'note',x:140,y:210,text:idea,title:'My idea'},{id:'task',kind:'task',inline:true,partner:'moss',x:530,y:160,source:'idea',text:'Make this character. Give it a personality of its own.'}]}}
export function canvasEntry(items){if(items.length)return {board:restore(JSON.stringify(items[0].board)),showStart:false};return {board:{schema:2,id:crypto.randomUUID(),name:'My new canvas',unlocked:false,view:{x:0,y:0,z:1},nodes:[]},showStart:true}}
export function startIdea(board,idea){const next=newProject(idea);return {...next,id:board.nodes.length?next.id:board.id,unlocked:board.unlocked}}

export const CREATION_ACTIONS={
 scene:{label:'A new scene',prompt:'Make a scene featuring this character. Keep their recognizable appearance.'},
 comic:{label:'A little comic',prompt:'Make a three-panel visual comic inspired by this picture. Keep its subjects recognizable, without text.'},
 stickers:{label:'A sticker sheet',prompt:'Make a sticker sheet inspired by the subjects in this picture, with different expressions and poses.'},
 together:{label:'Together in a picture',multi:true,prompt:'Show these distinct characters together in one scene. Keep each character recognizable.'},
 fusion:{label:'Fuse into a new character',multi:true,prompt:'Invent one new character that combines recognizable features from all the reference characters.'}
};
export function sourceIds(node){return node.sources|| (node.source?[node.source]:[])}
export function sourceNodes(board,node){return sourceIds(node).map(id=>board.nodes.find(n=>n.id===id)).filter(Boolean)}

export function freePosition(board,point){
 const clear=(x,y)=>!canvasNodes(board).some(n=>x<n.x+360&&x+360>n.x&&y<n.y+cardHeight(n)+40&&y+720>n.y);
 for(let ring=0;ring<=board.nodes.length+1;ring++){
  for(let column=0;column<=ring;column++){
   const row=ring-column;
   for(const sign of row?[1,-1]:[1]){const x=point.x+column*400,y=point.y+row*720*sign;if(clear(x,y))return {x,y}}
  }
 }
 return {x:point.x+400*(board.nodes.length+2),y:point.y};
}

export function cardHeight(node){return node.kind==='task'&&node.partner==='nix'?820:node.kind==='task'||node.kind==='result'?640:node.kind==='note'?300:500}

export const CREATION_TYPES={idea:{label:'My idea',brief:'Follow the requested subject and format. Keep the creator’s own idea at the center.'},character:{label:'Create a character',brief:'Create an original character with an expressive personality.'},world:{label:'Build a world',brief:'Create an imaginative scene or place full of distinctive details.'},comic:{label:'Make a comic',brief:'Create a three-panel visual comic on one image. Keep characters consistent across panels. No text.'}};
export function taskIsComplete(board,node){return !['working','failed'].includes(node.job?.status)&&board.nodes.some(n=>n.kind==='result'&&n.source===node.id)}
export function togglePictureSelection(ids,id){return ids.includes(id)?ids.filter(a=>a!==id):ids.length<4?[...ids,id]:ids}
function arrangeVisibleGroup(board,id){
 if(!board.nodes.some(n=>n.id===id))return board;
 const ids=new Set([id]);let changed=true;
 while(changed){changed=false;for(const n of board.nodes){const sources=sourceIds(n).filter(s=>board.nodes.some(a=>a.id===s));if(ids.has(n.id)||sources.some(s=>ids.has(s))){for(const key of [n.id,...sources])if(!ids.has(key)){ids.add(key);changed=true}}}}
 const group=board.nodes.filter(n=>ids.has(n.id)),others=board.nodes.filter(n=>!ids.has(n.id));
 const ranks=new Map();for(let pass=0;pass<group.length;pass++)for(const n of group){if(ranks.has(n.id))continue;const sources=sourceIds(n).filter(s=>ids.has(s));if(sources.every(s=>ranks.has(s)))ranks.set(n.id,sources.length?Math.max(...sources.map(s=>ranks.get(s)))+1:0)}
 const left=Math.min(...group.map(n=>n.x)),top=Math.min(...group.map(n=>n.y)),rows=new Map(),placed=[];
 for(const n of [...group].sort((a,b)=>(ranks.get(a.id)||0)-(ranks.get(b.id)||0))){const rank=ranks.get(n.id)||0,row=rows.get(rank)||0;rows.set(rank,row+1);placed.push({...n,...freePosition({nodes:[...others,...placed]},{x:left+rank*420,y:top+row*720})})}
 return {...board,nodes:board.nodes.map(n=>placed.find(a=>a.id===n.id)||n)};
}

export function resultOwner(board,result){return result?.kind==='result'?board.nodes.find(n=>n.id===result.source&&n.kind==='task'&&n.inline):undefined}
export function taskOutput(board,task){if(!task?.inline)return null;const versions=board.nodes.filter(n=>n.kind==='result'&&n.source===task.id);return versions.find(n=>n.id===task.activeResultId)||versions.at(-1)||null}
export function canvasNodes(board){return board.nodes.filter(n=>!resultOwner(board,n))}
export function visibleOwner(board,id){const n=board.nodes.find(n=>n.id===id);return resultOwner(board,n)||n}
export function arrangeGroup(board,id){const nodes=canvasNodes(board).map(n=>({...n,sources:sourceIds(n).map(s=>visibleOwner(board,s)?.id).filter(s=>s&&s!==n.id)}));const next=arrangeVisibleGroup({...board,nodes},visibleOwner(board,id)?.id);return {...board,nodes:board.nodes.map(n=>{const moved=next.nodes.find(a=>a.id===n.id);return moved?{...n,x:moved.x,y:moved.y}:n})}}

// Keep exact selected references even when the task displays a newer version.
export function materialChoices(board,{includeHistory=false,selectedIds=[]}={}){
 const all=board.nodes.filter(n=>n.kind!=='task');
 if(includeHistory)return all;
 const current=all.filter(n=>!resultOwner(board,n)||taskOutput(board,resultOwner(board,n))?.id===n.id);
 return [...current,...all.filter(n=>selectedIds.includes(n.id)&&!current.includes(n))];
}
export function characterProfile(board,id=board.world?.characterId){
 if(id&&id===board.world?.characterId)return {name:board.world.characterName??(board.finishedId===id?board.characterName:'')??'',bio:board.world.characterBio??(board.finishedId===id?board.characterBio:'')??''};
 return board.cards?.[id]||{name:board.finishedId===id?board.characterName||'':'',bio:board.finishedId===id?board.characterBio||'':''};
}
function legacyCharacter(board){
 if(!board.finishedId||!board.nodes.some(n=>n.id===board.finishedId&&n.image))return {};
 if(!board.characterName&&!board.characterBio)return {};
 const world=board.world||{};
 if(world.characterId!==board.finishedId)return {cards:{...board.cards,[board.finishedId]:board.cards?.[board.finishedId]||{name:board.characterName||'',bio:board.characterBio||''}}};
 return {world:{...world,characterName:world.characterName??board.characterName??'',characterBio:world.characterBio??board.characterBio??''}};
}
