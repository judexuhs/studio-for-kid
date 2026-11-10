import test from 'node:test';
import assert from 'node:assert/strict';
import {canvasEntry,reduceBoard,restore,canvasNodes,taskOutput} from './model.js';
import {prepareCreationRequest} from './generation-plan.js';
test('a blank canvas draft is editable and restorable without submitting generation',()=>{
 const board=reduceBoard(canvasEntry([]).board,{type:'draft',id:'draft',x:200,y:140});
 const draft=board.nodes[0];
 assert.equal(draft.text,'');assert.equal(draft.goal,'idea');assert.equal(draft.inline,true);
 assert.equal(draft.job,undefined);assert.equal(restore(JSON.stringify(board)).nodes[0].id,'draft');
 assert.throws(()=>prepareCreationRequest(board,'draft'));
});
test('draft, progress and versions occupy the same visible canvas node',()=>{
 let board=reduceBoard(canvasEntry([]).board,{type:'draft',id:'draft',x:200,y:140});
 board=reduceBoard(board,{type:'edit',id:'draft',patch:{text:'A dragon afraid of toast'}});
 const {snapshot}=prepareCreationRequest(board,'draft');
 board=reduceBoard(board,{type:'result',task:'draft',id:'v1',snapshot,image:'data:image/png;base64,YQ=='});
 assert.equal(canvasNodes(board).length,1);assert.equal(canvasNodes(board)[0].x,200);
 assert.equal(taskOutput(board,board.nodes[0]).id,'v1');
 board=reduceBoard(board,{type:'revise-inline',id:'v1',text:'Add a hat'});
 board=reduceBoard(board,{type:'result',task:'draft',id:'v2',image:'data:image/png;base64,Yg=='});
 assert.equal(canvasNodes(board).length,1);assert.equal(canvasNodes(board)[0].y,140);
 assert.equal(taskOutput(board,board.nodes[0]).id,'v2');assert.equal(board.nodes.find(n=>n.id==='v1').image,'data:image/png;base64,YQ==');
});
