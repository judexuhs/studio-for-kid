import test from 'node:test';
import assert from 'node:assert/strict';
import {canvasEntry,reduceBoard,restore,materialChoices,characterProfile} from './model.js';
import {continuationSteps} from './creative-tools.js';
import {creativeJourney,openPresentation,buildWorldHtml} from './world.js';
import {prepareCreationRequest} from './generation-plan.js';
const image='data:image/png;base64,YQ==';
function versions(){let b=reduceBoard(canvasEntry([]).board,{type:'creation',id:'t',text:'A fox',goal:'character'});b=reduceBoard(b,{type:'result',task:'t',id:'v1',image});return reduceBoard(b,{type:'result',task:'t',id:'v2',image})}
test('material choices group versions, respect current choice and keep explicitly selected old IDs',()=>{
 let b=versions();assert.deepEqual(materialChoices(b).map(n=>n.id),['v2']);
 assert.deepEqual(materialChoices(b,{selectedIds:['v1']}).map(n=>n.id),['v2','v1']);
 b=reduceBoard(b,{type:'edit',id:'t',patch:{activeResultId:'v1'}});
 assert.deepEqual(materialChoices(b).map(n=>n.id),['v1']);
 assert.deepEqual(materialChoices(b,{includeHistory:true}).map(n=>n.id),['v1','v2']);
 assert.equal(b.nodes.length,3);
});
test('legacy character cards migrate without losing names; main identity and other cards stay distinct',()=>{
 const legacy={...versions(),finishedId:'v1',characterName:'Nova',characterBio:'Likes clouds.'};
 let b=restore(JSON.stringify(legacy));assert.equal(b.world?.characterId,undefined);
 assert.deepEqual(characterProfile(b,'v1'),{name:'Nova',bio:'Likes clouds.'});
 b=reduceBoard(b,{type:'main-character',id:'v1'});
 b=reduceBoard(b,{type:'character-profile',id:'v1',patch:{name:'Nori'}});
 assert.equal(b.world.characterName,'Nori');assert.equal(characterProfile(b,'v1').name,'Nori');
 b=reduceBoard(b,{type:'character-profile',id:'v2',patch:{name:'A different fox'}});
 assert.equal(characterProfile(b,'v2').name,'A different fox');assert.equal(characterProfile(b,'v1').name,'Nori');
 const conflict=restore(JSON.stringify({...legacy,world:{characterId:'v1',characterName:'World name'}}));
 assert.equal(characterProfile(conflict,'v1').name,'World name');assert.equal(conflict.characterName,'Nova');
});
test('continuations use known creation type and neutral choices for unknown pictures',()=>{
 const b=versions();assert.deepEqual(continuationSteps(b.nodes.at(-1)).map(n=>n.id),['home','adventure']);
 const revised=reduceBoard(b,{type:'revise-inline',id:'v2',text:'Add a hat'});
 const result=reduceBoard(revised,{type:'result',task:'t',id:'v3',image}).nodes.at(-1);
 assert.equal(result.creationType,'character');
 for(const type of ['world','comic','idea',undefined])assert.ok(continuationSteps({creationType:type}).every(n=>!['home','adventure'].includes(n.id)));
});
test('presentation opens explicit current work, respects saved or deliberately empty selection and never adds unrelated works',()=>{
 const b=versions();const next=openPresentation(b,'v1');
 assert.deepEqual(next.presentation.ids,['v1']);assert.equal(next.presentation.includeJourney,false);
 assert.equal(b.presentation,undefined);assert.deepEqual(openPresentation(b).presentation.ids,[]);
 const saved={...b,presentation:{ids:['v1'],includeJourney:true}};
 assert.deepEqual(openPresentation(saved).presentation,saved.presentation);
 assert.deepEqual(openPresentation({...b,presentation:{ids:[]}}).presentation.ids,[]);
});
test('export journey follows only selected works and their frozen ancestry, not sibling or unrelated results',()=>{
 let b=versions();b=reduceBoard(b,{type:'revise-inline',id:'v1',text:'Add a hat'});b=reduceBoard(b,{type:'result',task:'t',id:'v3',image});
 b=reduceBoard(b,{type:'task',id:'other',partner:'tavi'});b=reduceBoard(b,{type:'result',task:'other',id:'private',text:'Unselected story'});
 b.presentation={ids:['v3'],includeJourney:true};
 assert.deepEqual(creativeJourney(b,b.presentation.ids).map(n=>n.id),['v1','v3']);
 const html=buildWorldHtml(b);assert.ok(!html.includes('Unselected story'));assert.ok(!html.includes('Tell a short story about my idea.'));
 assert.deepEqual(creativeJourney(b,[]),[]);
});
test('generation plans freeze latest edit and exact source without generating on preparation or restore',()=>{
 let b=versions();b=reduceBoard(b,{type:'revise-inline',id:'v1',text:'Make the scarf yellow',preserve:'Keep ears',editRegion:{x:.1,y:.1,width:.3,height:.3}});
 const plan=prepareCreationRequest(b,'t');b.nodes[0].text='A later draft';
 assert.equal(plan.snapshot.text,'Make the scarf yellow');assert.equal(plan.input.id,'v1');assert.equal(plan.snapshot.preserve,'Keep ears');
 assert.equal(plan.snapshot.job,undefined);assert.ok(restore(JSON.stringify(b)).nodes.every(n=>!n.job));
});
test('Pip uses the chosen movement without needing a prompt and leaves source/version history untouched',()=>{
 let b=reduceBoard(versions(),{type:'task',id:'p',partner:'pip',source:'v1'});
 b=reduceBoard(b,{type:'edit',id:'p',patch:{text:'',move:'dance'}});const before=structuredClone(b.nodes);
 const {snapshot,input}=prepareCreationRequest(b,'p');
 b=reduceBoard(b,{type:'result',task:'p',id:'motion',snapshot,inputSnapshot:input});
 assert.equal(b.nodes.at(-1).move,'dance');assert.equal(b.nodes.at(-1).input.id,'v1');assert.deepEqual(b.nodes.slice(0,3),before.slice(0,3));
 assert.match(b.nodes.at(-1).instruction,/dance/);
 assert.throws(()=>prepareCreationRequest(reduceBoard(b,{type:'edit',id:'p',patch:{source:null}}),'p'),/picture/i);
});

test('switching and removing a main character retain edited profiles and explicit removal survives legacy reload',()=>{
 let b=restore(JSON.stringify({...versions(),finishedId:'v1',characterName:'Legacy'}));
 b=reduceBoard(b,{type:'main-character',id:'v1'});
 b=reduceBoard(b,{type:'character-profile',id:'v1',patch:{name:'Nori',bio:'Likes rain'}});
 b=reduceBoard(b,{type:'main-character',id:'v2'});
 assert.deepEqual(characterProfile(b,'v1'),{name:'Nori',bio:'Likes rain'});
 b=reduceBoard(b,{type:'main-character',id:'v1'});
 b=reduceBoard(b,{type:'main-character',id:null});
 b=restore(JSON.stringify(b));assert.equal(b.world.characterId,null);assert.equal(characterProfile(b,'v1').name,'Nori');
 b=reduceBoard(b,{type:'main-character',id:'v1'});b=reduceBoard(b,{type:'character-profile',id:'v1',patch:{name:'',bio:''}});
 assert.deepEqual(characterProfile(restore(JSON.stringify(b)),'v1'),{name:'',bio:''});
});

test('selected journey retains frozen ancestors after upstream deletion',()=>{
 let b=versions();b=reduceBoard(b,{type:'task',id:'p',partner:'pip',source:'v1'});
 b=reduceBoard(b,{type:'result',task:'p',id:'p1'});b.presentation={ids:['p1'],includeJourney:true};
 b=reduceBoard(b,{type:'remove',id:'t'});
 assert.deepEqual(creativeJourney(b,['p1']).map(n=>n.id),['v1','p1']);
});

test('a single Pip cover exports once with its movement intact',()=>{
 let b=reduceBoard(versions(),{type:'task',id:'p',partner:'pip',source:'v1'});
 b=reduceBoard(b,{type:'result',task:'p',id:'p1'});b=openPresentation(b,'p1');
 const html=buildWorldHtml(b);assert.equal((html.match(/<img /g)||[]).length,1);assert.match(html,/<img[^>]*class="cover motion-float"/);
});

test('a home continuation is a place, and is not recommended character-only next steps',()=>{
 let b=reduceBoard(versions(),{type:'continue',id:'home',step:'home',source:'v1'});
 b=reduceBoard(b,{type:'result',task:'home',id:'home1',image});
 assert.equal(b.nodes.at(-1).creationType,'world');assert.equal(continuationSteps(b.nodes.at(-1))[0].id,'scene');
});

test('making a card is an export choice and never implicitly selects a main character',()=>{
 const b=reduceBoard(versions(),{type:'finish',id:'v1'});assert.equal(b.finishedId,'v1');assert.equal(b.world?.characterId,undefined);
 const legacy=restore(JSON.stringify({...b,characterName:'Nori'}));assert.equal(legacy.world?.characterId,undefined);assert.equal(characterProfile(legacy,'v1').name,'Nori');
});
