import test from 'node:test';
import assert from 'node:assert/strict';
import {validateRequest,buildProviderRequest,generate} from './generation.js';
test('blocks contact details, empty prompts and external image references',()=>{assert.throws(()=>validateRequest({prompt:'',requestId:'a'}));assert.throws(()=>validateRequest({prompt:'email me a@b.com',requestId:'a'}));assert.throws(()=>validateRequest({prompt:'a fox',reference:'https://example.com/a.png',requestId:'a'}));});
test('reference edits preserve identity and separate instructions from input data',()=>{const b=buildProviderRequest({prompt:'blue hat',reference:'data:image/png;base64,aGVsbG8=',intent:'edit'});assert.equal(b.input_references.length,1);assert.match(b.prompt,/identity/);assert.match(b.prompt,/blue hat/);});
test('provider errors never leak tokens or response bodies',async()=>{await assert.rejects(generate({prompt:'fox',requestId:'test'},{key:'secret-token',fetcher:async()=>({ok:false,status:401,json:async()=>({error:{message:'secret-token'}})})}),e=>!e.message.includes('secret-token'));});
test('successful request returns actual image with timeout signal and reference',async()=>{let req;const r=await generate({prompt:'fox',requestId:'test'},{key:'test',fetcher:async(url,options)=>{req=JSON.parse(options.body);return {ok:true,json:async()=>({data:[{b64_json:'aGVsbG8=',media_type:'image/png'}]})}}});assert.match(r.image,/^data:image\/png;base64,/);assert.equal(req.n,1);});
test('composition sends every reference with explicit fusion or together semantics',()=>{
 const refs=['data:image/png;base64,YQ==','data:image/png;base64,Yg=='];
 for(const intent of ['fusion','together']){const input=validateRequest({requestId:'combo',prompt:'At the beach',references:refs,intent});const payload=buildProviderRequest(input);assert.equal(payload.input_references.length,2);assert.match(payload.prompt,intent==='fusion'?/new character/:/distinct characters/);}
});
test('multi-reference validation rejects URLs, excessive images and oversized totals',()=>{
 for(const references of [['https://example.com/a.png'],Array(5).fill('data:image/png;base64,YQ=='),['data:image/png;base64,'+'a'.repeat(5e6),'data:image/png;base64,'+'a'.repeat(5e6)]])assert.throws(()=>validateRequest({requestId:'bad',prompt:'A scene',references}));
});
test('a new world or comic brief is not overridden by a mandatory single-character composition',()=>{
 const payload=buildProviderRequest({prompt:'A floating library above the clouds',intent:'create'});
 assert.match(payload.prompt,/floating library/);assert.doesNotMatch(payload.prompt,/Show one original character/);
});
test('marked edits preserve the original and attach a separate positioning guide',()=>{
 const original='data:image/png;base64,YQ==',guide='data:image/png;base64,Yg==';
 const editRegion={x:.1,y:.2,width:.3,height:.4};
 const input=validateRequest({requestId:'marked',prompt:'Make the scarf yellow.',references:[original],intent:'edit',editRegion,editGuide:guide});
 assert.deepEqual(input.editRegion,editRegion);const payload=buildProviderRequest(input);
 assert.equal(payload.input_references[0].image_url.url,original);assert.equal(payload.input_references[1].image_url.url,guide);
 assert.match(payload.prompt,/positioning guide/);assert.match(payload.prompt,/Do not draw the marking/);
});
test('marked edit validation rejects invalid areas, orphan guides and excessive reference budgets',()=>{
 const image='data:image/png;base64,YQ==',region={x:.1,y:.1,width:.2,height:.2};
 const good={requestId:'marked',prompt:'Blue scarf',references:[image],intent:'edit',editRegion:region,editGuide:image};
 for(const patch of [{editRegion:{...region,x:.95}},{editRegion:{...region,width:0}},{editGuide:'https://example.com/guide.png'},{editRegion:null},{references:[]},{intent:'fusion'},{references:[image,image,image,image]},{editGuide:'data:image/png;base64,'+'a'.repeat(9e6)}])assert.throws(()=>validateRequest({...good,...patch}));
});
