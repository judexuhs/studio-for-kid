import test from 'node:test';
import assert from 'node:assert/strict';
import {validateText,buildTextRequest,generateText} from './text-generation.js';
const input={requestId:'story-one',prompt:'A fox meets a moon whale.',format:'story',context:'Nova wears a mint suit.'};
test('story validation rejects contact details, oversized context and invalid format',()=>{
 assert.equal(validateText(input).format,'story');
 for(const patch of [{prompt:'email me at child@example.com'},{context:'x'.repeat(2001)},{format:'chat'}])assert.throws(()=>validateText({...input,...patch}));
 const body=buildTextRequest(input);assert.equal(body.messages[0].role,'system');assert.match(body.messages[1].content,/Nova/);assert.equal(body.provider.data_collection,'deny');
});
test('text provider returns bounded plain text, rejects missing/unsafe outputs and hides provider errors',async()=>{
 const good=await generateText(input,{key:'test',fetcher:async()=>Response.json({choices:[{message:{content:'The whale sang hello.'}}]})});
 assert.equal(good.text,'The whale sang hello.');
 for(const payload of [{choices:[]},{choices:[{message:{content:'Contact friend@example.com'}}]}])await assert.rejects(()=>generateText(input,{key:'test',fetcher:async()=>Response.json(payload)}));
 await assert.rejects(()=>generateText(input,{key:'test',fetcher:async()=>new Response('secret upstream text',{status:500})}),e=>!e.message.includes('secret'));
});
