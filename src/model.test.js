import test from 'node:test';
import assert from 'node:assert/strict';
import {initialBoard, reduceBoard, restore} from './model.js';
test('one material branches to two tasks by the same partner',()=>{let b=initialBoard();b=reduceBoard(b,{type:'task',id:'t1',partner:'moss',source:'idea',x:1,y:2});b=reduceBoard(b,{type:'task',id:'t2',partner:'moss',source:'idea',x:5,y:6});assert.equal(b.nodes.filter(n=>n.source==='idea').length,3);});
test('results capture input and instruction without later upstream mutations',()=>{let b=initialBoard();b=reduceBoard(b,{type:'result',task:'task',id:'r1'});const r=b.nodes.find(n=>n.id==='r1');b=reduceBoard(b,{type:'edit',id:'task',patch:{text:'different'}});assert.notEqual(r.instruction,b.nodes.find(n=>n.id==='task').text);assert.equal(r.source,'task');});
test('Pip prepares work immediately and can animate any picture without acceptance',()=>{let b=initialBoard();b=reduceBoard(b,{type:'task',id:'p',partner:'pip',source:'reference'});assert.equal(b.nodes.at(-1).partner,'pip');assert.equal(b.nodes.at(-1).source,'reference');b=reduceBoard(b,{type:'result',task:'p',id:'motion'});assert.equal(b.nodes.at(-1).image,'asset:fox');assert.equal(b.nodes.at(-1).move,'float');});
test('deleting a source removes live edges but preserves result snapshots',()=>{let b=reduceBoard(initialBoard(),{type:'result',task:'task',id:'r1'});b=reduceBoard(b,{type:'remove',id:'task'});assert.equal(b.nodes.find(n=>n.id==='r1').source,null);assert.ok(b.nodes.find(n=>n.id==='r1').instruction);});
test('positions and viewport survive reload; corrupt data falls back',()=>{let b=reduceBoard(initialBoard(),{type:'edit',id:'idea',patch:{x:300,y:200}});assert.equal(restore(JSON.stringify(b)).nodes[0].x,300);assert.ok(restore('{bad').nodes.length);});
test('live results use requested snapshot and returned image, never a placeholder',()=>{const b=initialBoard(),snapshot={...b.nodes.find(n=>n.id==='task'),text:'original brief'};const next=reduceBoard(b,{type:'result',task:'task',id:'live',snapshot,image:'data:image/png;base64,aGVsbG8=',live:true});assert.equal(next.nodes.at(-1).image,'data:image/png;base64,aGVsbG8=');assert.equal(next.nodes.at(-1).instruction,'original brief');assert.equal(next.nodes.at(-1).live,true)});
test('canvas entry resumes most recent saved work without resetting its graph',async()=>{const {canvasEntry}=await import('./model.js');const original={...initialBoard(),id:'existing',unlocked:true};const result=canvasEntry([{board:original}]);assert.equal(result.showStart,false);assert.deepEqual(result.board,original)});
test('first entry is an empty canvas; starting an idea keeps its identity',async()=>{const {canvasEntry,startIdea}=await import('./model.js');const entry=canvasEntry([]);assert.equal(entry.showStart,true);assert.equal(entry.board.nodes.length,0);const next=startIdea(entry.board,'A dragon in a cloud');assert.equal(next.id,entry.board.id);assert.equal(next.nodes.length,2);assert.equal(next.nodes[0].text,'A dragon in a cloud');assert.equal(next.nodes[1].source,next.nodes[0].id)});
test('new idea from occupied canvas creates a separate project and preserves unlock',async()=>{const {startIdea}=await import('./model.js');const original={...initialBoard(),id:'old',unlocked:true};const next=startIdea(original,'A sleepy owl');assert.notEqual(next.id,'old');assert.equal(next.unlocked,true);assert.equal(original.nodes.length,3)});

test('homepage starter opens a separate named canvas without triggering generation',async()=>{const {studioEntry,STARTERS}=await import('./starters.js');const old={...initialBoard(),id:'old',unlocked:true};const entry=studioEntry([{board:old}],new URLSearchParams('starter=cloud-baker'));assert.notEqual(entry.board.id,old.id);assert.equal(entry.board.name,STARTERS.find(s=>s.id==='cloud-baker').title);assert.equal(entry.board.nodes[0].text,STARTERS.find(s=>s.id==='cloud-baker').prompt);assert.equal(entry.board.nodes[1].job,undefined);assert.equal(entry.board.unlocked,true);assert.equal(entry.showStart,false);assert.equal(entry.persist,true);assert.equal(old.nodes.length,3)});
test('homepage selects exact saved project, new canvas stays empty, unknown starter safely resumes',async()=>{const {studioEntry}=await import('./starters.js');const first={...initialBoard(),id:'one'},second={...initialBoard(),id:'two'};const items=[{board:first},{board:second}];assert.equal(studioEntry(items,new URLSearchParams('project=two')).board.id,'two');const blank=studioEntry(items,new URLSearchParams('new=1'));assert.equal(blank.board.nodes.length,0);assert.equal(blank.showStart,true);assert.notEqual(blank.board.id,'one');assert.equal(studioEntry(items,new URLSearchParams('starter=unknown')).board.id,'one')});
test('imagination stretch carries the selected twist into the new idea',async()=>{const {studioEntry,STARTERS}=await import('./starters.js');const entry=studioEntry([],new URLSearchParams('starter=cloud-baker&twist=1'));assert.equal(entry.board.nodes[0].text,STARTERS[1].prompt+' '+STARTERS[1].twist);assert.equal(entry.board.nodes[1].job,undefined)});

test('crew handoff requires a picture and the child’s keep decision before Pip works',async()=>{const {crewPreview,crewPreviewInitial}=await import('./crew-preview.js');let s=crewPreviewInitial;assert.equal(crewPreview(s,{type:'handoff'}),s);assert.equal(crewPreview(s,{type:'move',move:'hop'}),s);s=crewPreview(s,{type:'make'});assert.equal(s.stage,'picture');assert.equal(s.playing,false);s=crewPreview(s,{type:'handoff'});assert.equal(s.stage,'movement');assert.equal(s.playing,true);s=crewPreview(s,{type:'move',move:'dance'});assert.equal(s.move,'dance');s=crewPreview(s,{type:'toggle'});assert.equal(s.playing,false);assert.deepEqual(crewPreview(s,{type:'reset'}),crewPreviewInitial)});
test('creation goals open distinct safe starter boards without starting jobs',async()=>{const {studioEntry}=await import('./starters.js');const old={...initialBoard(),id:'old'};const character=studioEntry([{board:old}],new URLSearchParams('create=character'));const world=studioEntry([{board:old}],new URLSearchParams('create=world'));const motion=studioEntry([{board:old}],new URLSearchParams('create=motion'));assert.match(character.board.name,/character/i);assert.match(world.board.nodes.find(n=>n.kind==='task').text,/scene/i);assert.equal(motion.board.nodes.find(n=>n.kind==='task').partner,'pip');assert.equal(motion.board.nodes.find(n=>n.kind==='material').image,'asset:fox');assert.equal(motion.board.unlocked,true);for(const e of [character,world,motion]){assert.notEqual(e.board.id,'old');assert.equal(e.persist,true);assert.ok(e.board.nodes.every(n=>!n.job));assert.equal(restore(JSON.stringify(e.board)).id,e.board.id)}assert.equal(old.unlocked,false)});

test('expanded creative projects prepare specific image briefs without starting generation',async()=>{
 const {studioEntry}=await import('./starters.js');
 for(const [goal,word] of [['comic','panel'],['poster','poster'],['stickers','sticker']]){
  const entry=studioEntry([],new URLSearchParams('create='+goal));
  assert.equal(entry.persist,true);
  assert.match(entry.board.nodes.find(n=>n.kind==='task').text,new RegExp(word,'i'));
  assert.ok(entry.board.nodes.every(n=>!n.job));
  assert.equal(entry.board.unlocked,false);
  assert.equal(restore(JSON.stringify(entry.board)).id,entry.board.id);
 }
});
test('homepage exhibition board branches real tasks into multiple formats without live jobs',async()=>{
 const {showcaseBoard}=await import('./showcase-board.js');
 const board=showcaseBoard();
 const ids=new Set(board.nodes.map(n=>n.id));
 assert.equal(ids.size,board.nodes.length);
 for(const node of board.nodes) {
  if(node.source) assert.ok(ids.has(node.source));
  assert.equal(node.job,undefined);
 }
 const tasks=board.nodes.filter(n=>n.kind==='task');
 assert.ok(tasks.some(n=>n.partner==='pip'));
 assert.deepEqual(new Set(board.nodes.filter(n=>n.partner).map(n=>n.partner)),new Set(['moss','tavi','nix','pip']));
 assert.ok(tasks.filter(n=>n.source==='nova').length>=2);
 assert.deepEqual(new Set(board.nodes.filter(n=>n.format).map(n=>n.format)),new Set(['character','world','story','sound','motion']));
 const copy=showcaseBoard();board.nodes[0].text='changed';
 assert.notEqual(copy.nodes[0].text,'changed');
});
test('importing studio storage does not open a database for the homepage',async()=>{
 const previous=globalThis.indexedDB;let opens=0;
 globalThis.indexedDB={open(){opens++;throw Error('test database blocked')}};
 try{
  const storage=await import('./storage.js');
  assert.equal(opens,0);
  await assert.rejects(storage.getProjects(),/test database blocked/);
  assert.equal(opens,1);
 }finally{globalThis.indexedDB=previous}
});

test('Nix creates audio results without substituting a character image and keeps audio on restore',()=>{
 const board=reduceBoard({schema:2,nodes:[],view:{x:0,y:0,z:1}},{type:'task',id:'song-task',partner:'nix'});
 const result=reduceBoard(board,{type:'result',task:'song-task',id:'song',audio:'data:audio/mpeg;base64,SUQz',live:true});
 assert.equal(result.nodes.at(-1).image,undefined);
 assert.equal(!!reduceBoard(result,{type:'accept',id:'song'}).unlocked,false);
 const next=reduceBoard(result,{type:'task',id:'next-song',partner:'nix',source:'song'});assert.equal(next.nodes.at(-1).text,result.nodes.at(-1).instruction);
 assert.equal(result.nodes.at(-1).audio,'data:audio/mpeg;base64,SUQz');
 assert.equal(restore(JSON.stringify(result)).nodes.at(-1).audio,'data:audio/mpeg;base64,SUQz');
 const unsafe=structuredClone(result);unsafe.nodes.at(-1).audio='https://untrusted.example/song.mp3';
 assert.notEqual(restore(JSON.stringify(unsafe)).nodes.at(-1).id,'song');
});

test('compositions keep multiple live sources, immutable snapshots and no automatic job',()=>{
 const b=initialBoard();b.nodes.push({id:'second',kind:'material',x:200,y:600,image:'asset:fox',title:'Second'});
 const next=reduceBoard(b,{type:'compose',id:'together',sources:['reference','second'],operation:'together',x:1000,y:500});
 const t=next.nodes.at(-1);assert.equal(t.kind,'task');assert.deepEqual(t.sources,['reference','second']);assert.equal(t.job,undefined);
 const made=reduceBoard(next,{type:'result',task:t.id,id:'combined',image:'data:image/png;base64,YQ=='});
 assert.equal(made.nodes.at(-1).inputs.length,2);
 const removed=reduceBoard(made,{type:'remove',id:'reference'});
 assert.deepEqual(removed.nodes.find(n=>n.id===t.id).sources,['second']);
 assert.equal(removed.nodes.at(-1).inputs.length,2);
 assert.deepEqual(restore(JSON.stringify(made)).nodes.at(-1).inputs,made.nodes.at(-1).inputs);
});
test('composition rejects missing, duplicate and non-picture sources; expansion branches without replacing',()=>{
 const b=initialBoard();
 for(const sources of [['reference'],['reference','reference'],['reference','missing'],['reference','idea']])assert.equal(reduceBoard(b,{type:'compose',id:'bad',sources,operation:'fusion'}),b);
 const next=reduceBoard(b,{type:'compose',id:'scene',sources:['reference'],operation:'scene',x:1400,y:200});
 assert.equal(next.nodes.length,b.nodes.length+1);assert.deepEqual(next.nodes[1],b.nodes[1]);assert.equal(next.nodes.at(-1).operation,'scene');
});
test('new branches are placed beside sources without covering existing cards',()=>{
 const b=initialBoard();b.nodes.push({id:'other',kind:'material',x:1320,y:190,image:'asset:fox'});
 const next=reduceBoard(b,{type:'compose',id:'joint',sources:['reference','other'],operation:'fusion',x:1320,y:190});
 const n=next.nodes.at(-1);
 assert.ok(b.nodes.every(a=>n.x>=a.x+360||n.x+360<=a.x||n.y>=a.y+580||n.y+580<=a.y));
});
test('repeated partner tasks and added materials never reuse occupied positions',()=>{
 let b=initialBoard();
 for(const id of ['moss-one','moss-two'])b=reduceBoard(b,{type:'task',id,partner:'moss',source:'idea',x:530,y:160});
 b=reduceBoard(b,{type:'add',node:{id:'uploaded',kind:'material',image:'asset:fox',x:530,y:160}});
 b=reduceBoard(b,{type:'add',node:{id:'copy',kind:'material',image:'asset:fox',x:530,y:160}});
 const added=b.nodes.slice(3);
 for(const n of added)for(const other of b.nodes.filter(a=>a.id!==n.id))assert.ok(n.x>=other.x+360||n.x+360<=other.x||n.y>=other.y+580||n.y+580<=other.y,`${n.id} overlaps ${other.id}`);
});

test('adding a creation stays on the same canvas without replacing existing work',()=>{
 const b={...initialBoard(),id:'my-world'};
 const next=reduceBoard(b,{type:'creation',id:'second-character',text:'A snowman who is afraid of heat',goal:'character',x:500,y:200});
 assert.equal(next.id,b.id);assert.equal(next.nodes.length,b.nodes.length+1);
 assert.deepEqual(next.nodes.slice(0,b.nodes.length),b.nodes);
 assert.equal(next.nodes.at(-1).text,'A snowman who is afraid of heat');assert.equal(next.nodes.at(-1).job,undefined);
});
test('completed tasks collapse only after a result exists and never hide working or failed jobs',async()=>{
 const {taskIsComplete}=await import('./model.js');let b=initialBoard();
 assert.equal(taskIsComplete(b,b.nodes[2]),false);
 b=reduceBoard(b,{type:'result',task:'task',id:'done'});assert.equal(taskIsComplete(b,b.nodes[2]),true);
 assert.equal(taskIsComplete(b,{...b.nodes[2],job:{status:'working'}}),false);
 assert.equal(taskIsComplete(b,{...b.nodes[2],job:{status:'failed'}}),false);
});
test('selection keeps the first four references instead of silently replacing one',async()=>{
 const {togglePictureSelection}=await import('./model.js');
 assert.deepEqual(togglePictureSelection(['a','b','c','d'],'e'),['a','b','c','d']);
 assert.deepEqual(togglePictureSelection(['a','b'],'a'),['b']);
});
test('arranging a connected group preserves unrelated manual positions and its graph',()=>{
 let b=initialBoard();b.nodes.push({id:'separate',kind:'material',x:2500,y:50,image:'asset:fox'});
 const next=reduceBoard(b,{type:'arrange',id:'idea'});
 assert.deepEqual(next.nodes.find(n=>n.id==='separate'),b.nodes.find(n=>n.id==='separate'));
 assert.equal(next.nodes.find(n=>n.id==='task').source,'idea');
 assert.ok(next.nodes.find(n=>n.id==='task').x>next.nodes.find(n=>n.id==='idea').x);
 assert.notEqual(next,b);
});

test('new creation units keep immutable result versions in place and show one canvas card',async()=>{
 const {canvasNodes,taskOutput,visibleOwner}=await import('./model.js');
 let b=reduceBoard({...initialBoard(),nodes:[]},{type:'creation',id:'unit',goal:'character',text:'A sleepy dragon',x:200,y:180});
 b=reduceBoard(b,{type:'result',task:'unit',id:'v1',image:'data:image/png;base64,YQ=='});
 b=reduceBoard(b,{type:'result',task:'unit',id:'v2',image:'data:image/png;base64,Yg=='});
 assert.equal(canvasNodes(b).length,1);assert.equal(taskOutput(b,b.nodes[0]).id,'v2');
 assert.equal(visibleOwner(b,'v1').id,'unit');
 assert.equal(b.nodes.find(n=>n.id==='v1').image,'data:image/png;base64,YQ==');
 const selected=reduceBoard(b,{type:'edit',id:'unit',patch:{activeResultId:'v1'}});assert.equal(taskOutput(selected,selected.nodes[0]).id,'v1');
 assert.equal(canvasNodes(restore(JSON.stringify(b))).length,1);
});
test('in-place revision keeps earlier versions and uses the chosen version as its reference',()=>{
 let b=reduceBoard({...initialBoard(),nodes:[]},{type:'creation',id:'unit',goal:'character',text:'A sleepy dragon'});
 b=reduceBoard(b,{type:'result',task:'unit',id:'v1',image:'data:image/png;base64,YQ=='});
 const next=reduceBoard(b,{type:'revise-inline',id:'v1',text:'Give it a blue hat'});
 assert.equal(next.nodes.length,2);assert.equal(next.nodes[0].source,'v1');assert.equal(next.nodes[0].text,'Give it a blue hat');assert.equal(next.nodes[1],b.nodes[1]);
});
test('legacy separate results remain visible and deleting a unit detaches its external branches',async()=>{
 const {canvasNodes}=await import('./model.js');let old=reduceBoard(initialBoard(),{type:'result',task:'task',id:'old'});assert.equal(canvasNodes(old).length,4);
 let b=reduceBoard({...initialBoard(),nodes:[]},{type:'creation',id:'unit',goal:'character',text:'A dragon'});
 b=reduceBoard(b,{type:'result',task:'unit',id:'v1'});b=reduceBoard(b,{type:'compose',id:'scene',sources:['v1'],operation:'scene'});
 const removed=reduceBoard(b,{type:'remove',id:'unit'});assert.equal(removed.nodes.length,1);assert.deepEqual(removed.nodes[0].sources,[]);
});
