import {imageStyleSettings} from './image-styles.js';
import {sourceNodes,validate} from './model.js';
import {worldContext} from './world.js';

// Called only by an explicit creation action. Nothing is submitted here.
export function prepareCreationRequest(board,id){
 const current=board.nodes.find(n=>n.id===id&&n.kind==='task');
 if(!current)throw Error('This creation is no longer on the canvas.');
 const task=structuredClone(current);
 if(task.partner==='pip')task.text=`Make my picture ${['float','hop','dance'].includes(task.move)?task.move:'float'}.`;
 const error=validate(task.text);if(error)throw Error(error);
 let inputs=sourceNodes(board,task);const input=inputs[0];
 if(task.sources&&(!inputs.length||inputs.length!==task.sources.length||(['fusion','together'].includes(task.operation)&&inputs.length<2)))throw Error('Choose the pictures for this creation again.');
 if(task.partner==='pip'&&!input?.image)throw Error('Choose a picture for Pip first.');
 if(['tavi','nix'].includes(task.partner)&&inputs.some(n=>n.medium==='drawing'&&!n.text?.trim()))throw Error('Add a description to your drawing first, so this partner knows what you drew.');
 const main=board.nodes.find(n=>n.id===board.world?.characterId);
 if(task.useWorld&&main?.image&&!inputs.some(n=>n.id===main.id)){
  if(inputs.filter(n=>n.image).length===4)throw Error('Four pictures are already selected. Turn off Bring my world or remove a picture.');
  inputs=[...inputs,main];
 }
 if(task.partner==='moss'){Object.assign(task,imageStyleSettings(task,inputs.some(n=>n.image)));const styleError=task.styleDescription?validate(task.styleDescription):'';if(styleError)throw Error(styleError)}
 return {snapshot:{...task,worldContext:task.useWorld?worldContext(board):''},input:input?structuredClone(input):null,inputs:structuredClone(inputs)};
}
