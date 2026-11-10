import test from 'node:test';
import assert from 'node:assert/strict';
import {validateRequest,buildProviderRequest} from '../server/generation.js';
import {reduceBoard,canvasEntry,restore} from './model.js';
import {prepareCreationRequest} from './generation-plan.js';
test('new images have a matte 2D default; references keep style unless explicitly changed',()=>{
 assert.match(buildProviderRequest({prompt:'a handsome pig'}).prompt,/matte.*2D|2D.*matte/);
 const ref={prompt:'blue hat',reference:'data:image/png;base64,YQ==',intent:'edit'};
 assert.match(buildProviderRequest(ref).prompt,/Preserve the reference.*style/);
 const restyle=buildProviderRequest({...ref,imageStyle:'pencil',styleDescription:'Loose colored pencil on cream paper.'});
 assert.match(restyle.prompt,/Loose colored pencil/);assert.doesNotMatch(restyle.prompt,/Preserve the reference.*style/);
});
test('server validates style and contact details and keeps explicit description',()=>{
 const base={prompt:'a fox',requestId:'style'};
 assert.equal(validateRequest({...base,imageStyle:'pencil',styleDescription:'Light pencil marks'}).styleDescription,'Light pencil marks');
 for(const patch of [{imageStyle:'unknown'},{styleDescription:'a'.repeat(501)},{styleDescription:'email me a@b.com'},{styleDescription:42}])assert.throws(()=>validateRequest({...base,...patch}));
});
test('style survives snapshots, results, continuation, revision and reload',()=>{
 let b=reduceBoard(canvasEntry([]).board,{type:'draft',id:'draft'});
 b=reduceBoard(b,{type:'edit',id:'draft',patch:{text:'a fox',imageStyle:'pencil',styleDescription:'Loose pencil marks'}});
 const {snapshot}=prepareCreationRequest(b,'draft');
 b=reduceBoard(b,{type:'result',task:'draft',id:'art',snapshot,image:'data:image/png;base64,YQ=='});
 assert.equal(b.nodes.at(-1).imageStyle,'pencil');
 b=reduceBoard(b,{type:'continue',id:'scene',source:'art',step:'scene'});
 assert.equal(b.nodes.at(-1).imageStyle,'pencil');assert.equal(b.nodes.at(-1).inline,true);
 b=reduceBoard(b,{type:'revise-inline',id:'art',text:'a blue scarf',imageStyle:'paper',styleDescription:'Layered paper'});
 assert.equal(b.nodes[0].imageStyle,'paper');
 assert.equal(restore(JSON.stringify(b)).nodes[0].styleDescription,'Layered paper');
});
