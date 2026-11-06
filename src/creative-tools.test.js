import test from 'node:test';
import assert from 'node:assert/strict';
import {canvasEntry,reduceBoard,restore,taskOutput,CREATION_TYPES} from './model.js';
import {studioEntry} from './starters.js';
import {pointOnDrawing,regionFromDrag,validRegion,drawingHistory,validDrawing,strokeCapacity} from './creative-tools.js';
import {exportDrawing} from './drawing-renderer.js';
import {creativeJourney} from './world.js';
const image='data:image/png;base64,YQ==';
const doc={version:1,width:800,height:520,strokes:[{tool:'pen',color:'#25344b',width:6,points:[{x:.3,y:.4}]}]};
test('own ideas stay neutral, in the same canvas, without submitting a job',()=>{
 const b=canvasEntry([]).board;const next=reduceBoard(b,{type:'creation',id:'own',goal:'idea',text:'A city under the sea.'});
 assert.equal(next.id,b.id);assert.equal(next.nodes[0].text,'A city under the sea.');assert.equal(next.nodes[0].goal,'idea');
 assert.doesNotMatch(CREATION_TYPES.idea.brief,/character/i);assert.equal(next.nodes[0].job,undefined);
});
test('fresh entry focuses the prepared task while a return visit keeps its view',()=>{
 for(const search of ['create=character','starter=moon-explorer','crew=tavi']){const entry=studioEntry([],new URLSearchParams(search));assert.equal(entry.focusId,'task');assert.equal(entry.board.nodes.find(n=>n.id==='task').job,undefined)}
 const b=canvasEntry([]).board;b.view={x:42,y:90,z:.7};const returned=studioEntry([{board:b}],new URLSearchParams());assert.equal(returned.focusId,undefined);assert.deepEqual(returned.board.view,b.view);
});
test('drawing, description and partner task are one reversible preparation with no generation',()=>{
 const b=canvasEntry([]).board;
 for(const partner of [null,'moss','tavi','nix','pip']){
  const next=reduceBoard(b,{type:'drawing',id:'draw',taskId:'task',image,drawing:doc,description:'A turtle who bakes cloud cakes.',partner});
  const drawing=next.nodes.find(n=>n.id==='draw');assert.equal(next.id,b.id);assert.equal(drawing.medium,'drawing');assert.deepEqual(drawing.drawing,doc);assert.equal(drawing.text,'A turtle who bakes cloud cakes.');
  if(partner){const task=next.nodes.find(n=>n.id==='task');assert.equal(task.source,'draw');assert.equal(task.partner,partner);assert.equal(task.job,undefined)}
  assert.equal(restore(JSON.stringify(next)).nodes.length,partner?2:1);
 }
 const result=reduceBoard(reduceBoard(b,{type:'drawing',id:'draw',taskId:'task',image,drawing:doc,description:'A turtle.',partner:'pip'}),{type:'result',task:'task',id:'result'});
 result.nodes.find(n=>n.id==='draw').title='My renamed sketch';assert.equal(creativeJourney(result)[0].fromDrawing,true);
});
test('continuations use the selected exact version and leave old results untouched',()=>{
 let b=reduceBoard(canvasEntry([]).board,{type:'creation',id:'t',goal:'character',text:'A fox'});
 b=reduceBoard(b,{type:'result',task:'t',id:'v1',image});b=reduceBoard(b,{type:'result',task:'t',id:'v2',image});
 b=reduceBoard(b,{type:'edit',id:'t',patch:{activeResultId:'v1'}});const before=structuredClone(b.nodes);
 const next=reduceBoard(b,{type:'continue',id:'next',step:'home',source:taskOutput(b,b.nodes[0]).id});
 assert.deepEqual(next.nodes.slice(0,b.nodes.length),before);assert.equal(next.nodes.at(-1).source,'v1');assert.match(next.nodes.at(-1).text,/home/);assert.equal(next.nodes.at(-1).job,undefined);
});
test('marked edits are immutable across revisions and survive reload; clearing removes only the new mark',()=>{
 let b=reduceBoard(canvasEntry([]).board,{type:'creation',id:'t',goal:'character',text:'A fox'});b=reduceBoard(b,{type:'result',task:'t',id:'v1',image});
 const editRegion={x:.1,y:.2,width:.3,height:.4};b=reduceBoard(b,{type:'revise-inline',id:'v1',text:'Make the scarf yellow.',preserve:'Keep the ears.',editRegion});
 const snapshot=structuredClone(b.nodes.find(n=>n.id==='t'));b=reduceBoard(b,{type:'result',task:'t',id:'v2',snapshot,image});editRegion.x=.7;
 assert.equal(b.nodes.find(n=>n.id==='v2').editRegion.x,.1);assert.equal(b.nodes.find(n=>n.id==='v1').image,image);
 b=reduceBoard(b,{type:'revise-inline',id:'v2',text:'Add a cloud.',editRegion:null});assert.equal(b.nodes.find(n=>n.id==='t').editRegion,null);assert.equal(restore(JSON.stringify(b)).nodes.find(n=>n.id==='v2').editRegion.x,.1);
});
test('selection coordinates clamp to the drawing and tiny/invalid regions are rejected',()=>{
 assert.deepEqual(pointOnDrawing(150,25,{left:50,top:50,width:100,height:100}),{x:1,y:0});
 assert.deepEqual(regionFromDrag({x:.8,y:.9},{x:.2,y:.3}),{x:.2,y:.3,width:.6,height:.6});
 assert.equal(regionFromDrag({x:.2,y:.3},{x:.201,y:.301}),null);
 for(const value of [{x:-.1,y:0,width:.5,height:.5},{x:.9,y:0,width:.5,height:.5},{x:0,y:0,width:0,height:.5},{x:NaN,y:0,width:.5,height:.5}])assert.equal(validRegion(value),false);
});
test('drawing history keeps single dots, undo/redo and erasers as distinct strokes; clear is undoable',()=>{
 let state={strokes:[],past:[],future:[]};const dot=doc.strokes[0];state=drawingHistory(state,{type:'stroke',stroke:dot});assert.equal(state.strokes[0].points.length,1);
 state=drawingHistory(state,{type:'stroke',stroke:{...dot,tool:'eraser'}});assert.equal(state.strokes.at(-1).tool,'eraser');
 state=drawingHistory(state,{type:'undo'});assert.equal(state.strokes.length,1);state=drawingHistory(state,{type:'redo'});assert.equal(state.strokes.length,2);
 state=drawingHistory(state,{type:'clear'});assert.equal(state.strokes.length,0);state=drawingHistory(state,{type:'undo'});assert.equal(state.strokes.length,2);
 assert.equal(validDrawing(doc),true);assert.equal(validDrawing({...doc,strokes:[{...dot,points:[{x:3,y:0}]}]}),false);
});
test('the drawing point budget keeps the final partial stroke instead of dropping it',()=>{
 const stroke={...doc.strokes[0],points:Array.from({length:800},()=>({x:.2,y:.3}))};
 const strokes=Array.from({length:37},()=>structuredClone(stroke));
 assert.equal(strokeCapacity(strokes),400);
 const next=drawingHistory({strokes,past:[],future:[]},{type:'stroke',stroke:{...stroke,points:stroke.points.slice(0,strokeCapacity(strokes))}});
 assert.equal(next.strokes.length,38);assert.equal(strokeCapacity(next.strokes),0);
 assert.equal(strokeCapacity(Array.from({length:200},()=>doc.strokes[0])),0);
});
test('drawing export freezes the visible strokes before waiting for a base picture',async()=>{
 const savedDocument=globalThis.document,savedImage=globalThis.Image;let finishLoad;
 const makeCanvas=()=>{const canvas={value:''};canvas.getContext=()=>({fillRect(){},drawImage(source){canvas.value+=source.value||''}});canvas.toDataURL=()=>canvas.value;return canvas};
 globalThis.document={createElement:makeCanvas};
 globalThis.Image=class{constructor(){this.width=800;this.height=520}set src(value){finishLoad=()=>this.onload()}};
 try{const visibleLayer={value:'original strokes'};const pending=exportDrawing(visibleLayer,{baseImage:image});visibleLayer.value='changed during save';finishLoad();assert.equal(await pending,'original strokes')}
 finally{globalThis.document=savedDocument;globalThis.Image=savedImage}
});
