import test from 'node:test';
import assert from 'node:assert/strict';
import {exampleBoard} from './example-board.js';
import {canvasEntry,restore,canvasNodes,taskOutput,reduceBoard} from './model.js';
const image='data:image/png;base64,AAAA',audio='data:audio/mpeg;base64,SUQz';
const assets={character:image,world:image,firstWorld:image,comic:image,stickers:image,audio,story:'Nova and Bloop found the missing note.'};
test('example is editable, portable, connected, and uses all four partners',()=>{
 const b=exampleBoard(assets,'sample');
 assert.deepEqual(restore(JSON.stringify(b)),b);
 assert.deepEqual(new Set(b.nodes.filter(n=>n.kind==='task').map(n=>n.partner)),new Set(['moss','tavi','nix','pip']));
 for(const n of b.nodes){if(n.source)assert.ok(b.nodes.some(p=>p.id===n.source));if(n.kind==='task')assert.ok(taskOutput(b,n));}
 assert.equal(canvasNodes(b).length,8);
 assert.ok(b.presentation.ids.every(id=>b.nodes.some(n=>n.id===id)));
 assert.notEqual(reduceBoard(b,{type:'name',name:'My remix'}).name,b.name);
 assert.equal(b.nodes.some(n=>n.job?.status==='working'),false);
});
test('examples never replace blank or existing default canvas',()=>{
 const item={board:exampleBoard(assets,'sample')};
 assert.equal(canvasEntry([item]).showStart,true);
 const mine={board:{schema:2,id:'mine',name:'Mine',nodes:[],view:{x:0,y:0,z:1}}};
 assert.equal(canvasEntry([item,mine]).board.id,'mine');
});
test('each opening creates independent content',()=>{
 const a=exampleBoard(assets,'one'),b=exampleBoard(assets,'two');
 a.nodes[0].text='Changed';assert.notEqual(a.nodes[0].text,b.nodes[0].text);assert.notEqual(a.id,b.id);
});

test('media failures reject without creating or overwriting a board',async()=>{
 const {loadExample}=await import('./example-board.js');
 const old=globalThis.fetch;globalThis.fetch=async()=>({ok:false});
 try{await assert.rejects(loadExample(),/could not load/)}finally{globalThis.fetch=old}
});

test('shipped example survives backup and self-contained world export',async()=>{
 const {readFile}=await import('node:fs/promises');
 const {buildWorldHtml,presentationItems}=await import('./world.js');
 const media=async(path,mime)=>`data:${mime};base64,${(await readFile(new URL('../public/assets/'+path,import.meta.url))).toString('base64')}`;
 const real={character:await media('moon-fox.png','image/png'),world:await media('nova-song-world.png','image/png'),firstWorld:await media('nova-world.png','image/png'),stickers:await media('example/nova-stickers.webp','image/webp'),comic:await media('example/nova-comic.webp','image/webp'),audio:await media('example/nova-star-song.mp3','audio/mpeg'),story:JSON.parse(await readFile(new URL('../public/assets/example/nova-story.json',import.meta.url),'utf8')).text};
 const b=exampleBoard(real,'export-test'),backup=JSON.stringify(b);
 assert.ok(Buffer.byteLength(backup)<40e6);
 assert.equal(restore(backup).id,'export-test');
 assert.equal(presentationItems(b).length,5);
 const html=buildWorldHtml(b);assert.ok(html.includes(real.audio));assert.ok(html.includes(real.comic));assert.ok(!html.includes('autoplay'));
 assert.equal(b.nodes.filter(n=>n.source==='world-task').length,2);
});
