import test from 'node:test';
import assert from 'node:assert/strict';
import {initialBoard, reduceBoard, restore} from './model.js';
import {worldContext, presentationItems, creativeJourney, buildWorldHtml} from './world.js';

test('every partner can prepare work without a progress gate; Pip validates material at generation',()=>{
 for(const partner of ['moss','tavi','nix','pip']){
  const b=reduceBoard({...initialBoard(),unlocked:false},{type:'task',id:partner,partner});
  assert.equal(b.nodes.at(-1).partner,partner);assert.equal(b.nodes.at(-1).job,undefined);
 }
});
test('a chosen character is an exact version; world context survives reload and original snapshots survive changes',()=>{
 let b=initialBoard();b=reduceBoard(b,{type:'main-character',id:'reference',name:'Nova',setting:'A moon made of marshmallow.'});
 assert.equal(b.world.characterId,'reference');
 assert.match(worldContext(b),/Nova/);
 const task={...b.nodes[2],worldContext:worldContext(b)};
 b=reduceBoard(b,{type:'result',task:'task',snapshot:task,id:'first',image:'asset:fox'});
 const old=b.nodes.at(-1).worldContext;
 b=reduceBoard(b,{type:'details',patch:{world:{...b.world,setting:'An ocean.'}}});
 assert.equal(restore(JSON.stringify(b)).world.characterId,'reference');
 assert.equal(b.nodes.at(-1).worldContext,old);
 b=reduceBoard(b,{type:'remove',id:'reference'});assert.equal(b.world.characterId,null);
});
test('Tavi produces immutable text versions, never a placeholder image, and restores them',()=>{
 let b=reduceBoard(initialBoard(),{type:'task',id:'tavi',partner:'tavi'});
 b=reduceBoard(b,{type:'result',task:'tavi',id:'story',text:'The moon sneezed a sky full of stars.',live:true});
 const result=b.nodes.at(-1);assert.equal(result.text,'The moon sneezed a sky full of stars.');assert.equal(result.image,undefined);
 assert.equal(restore(JSON.stringify(b)).nodes.at(-1).text,result.text);
});
test('presentation filters deleted results, keeps explicit order and exports inert text with no autoplay',()=>{
 const b={...initialBoard(),name:'<script>alert(1)</script>',nodes:[
  {id:'a',kind:'result',title:'One',image:'data:image/png;base64,YQ==',instruction:'Give it a hat',preserve:'Keep the face'},
  {id:'b',kind:'result',title:'Two',partner:'tavi',text:'</script><img onerror=alert(2)>',instruction:'Write a story'},
  {id:'c',kind:'result',audio:'data:audio/mpeg;base64,SUQz',title:'My song'}
 ],presentation:{ids:['b','gone','a'],coverId:'a',musicId:'c',includeJourney:true}};
 assert.deepEqual(presentationItems(b).map(n=>n.id),['b','a']);
 assert.match(creativeJourney(b)[0].preserve,/face/);
 const html=buildWorldHtml(b);
 assert.ok(html.includes('&lt;script&gt;'));assert.ok(!html.includes('<img onerror'));
 assert.ok(!html.includes('autoplay'));assert.ok(html.includes('data:audio/mpeg'));
 assert.ok(html.includes('prefers-reduced-motion'));assert.ok(html.includes('Keep the face'));
});

test('crew links prepare every real capability without generating or changing a previous canvas',async()=>{
 const {studioEntry}=await import('./starters.js');const old={...initialBoard(),id:'old'};
 for(const crew of ['moss','tavi','nix','pip']){
  const entry=studioEntry([{board:old}],new URLSearchParams('crew='+crew));
  assert.equal(entry.board.nodes.at(-1).partner,crew);assert.notEqual(entry.board.id,'old');
  assert.ok(entry.board.nodes.every(n=>!n.job));assert.equal(restore(JSON.stringify(entry.board)).id,entry.board.id);
 }
});
test('selected world context is opt-in, survives prompt snapshots, and text works hand off as source material',async()=>{
 const {requestContext}=await import('./world.js');let board=initialBoard();board.world={characterName:'Nova',setting:'A moon library',characterId:'reference'};
 board=reduceBoard(board,{type:'task',id:'story',partner:'tavi'});const t=board.nodes.at(-1);
 assert.equal(t.useWorld,false);assert.equal(requestContext(board,t,[]),'');
 assert.match(requestContext(board,{...t,useWorld:true},[]),/moon library/);
 board=reduceBoard(board,{type:'result',task:'story',id:'story-v1',text:'The moon opened a library.'});
 board=reduceBoard(board,{type:'task',id:'illustration',partner:'moss',source:'story-v1'});
 assert.match(requestContext(board,board.nodes.at(-1),[board.nodes.find(n=>n.id==='story-v1')]),/opened a library/);
});
test('deleting a presentation work frees its slot and clears deleted cover and soundtrack',()=>{
 const b={...initialBoard(),world:{characterId:'reference'},presentation:{ids:['reference'],coverId:'reference',musicId:'reference'}};
 const next=reduceBoard(b,{type:'remove',id:'reference'});assert.deepEqual(next.presentation.ids,[]);assert.equal(next.presentation.coverId,null);assert.equal(next.presentation.musicId,null);assert.equal(next.world.characterId,null);
});
