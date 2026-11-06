import {CREATION_GOALS} from './creation-content.js';
import {canvasEntry,newProject,restore,reduceBoard} from './model.js';
export const STARTERS=[
 {id:'moon-explorer',title:'A very small space adventure',name:'The moon explorer',category:'Space',image:'/assets/moon-fox.png',color:'lilac',prompt:'A tiny fox astronaut with a mint spacesuit and a flag, exploring a lavender moon.',twist:'What if the moon was made of marshmallow?',description:'One tiny explorer. A whole moon of possibilities.',move:'float'},
 {id:'cloud-baker',title:'The cloud bakery',name:'The cloud baker',category:'Make-believe',image:'/assets/starters/cloud-baker.png',color:'mint',prompt:'A gentle little turtle baker with a big cloud-shaped chef hat, making fluffy cloud cakes in a bakery in the sky.',twist:'What if every cake could change the weather?',description:'A turtle with a whisk and a deliciously cloudy idea.',move:'hop'},
 {id:'reef-inventor',title:'An inventor under the sea',name:'The reef inventor',category:'Nature',image:'/assets/starters/reef-inventor.png',color:'blue',prompt:'A curious turquoise axolotl inventor in overalls, carrying a little brass submarine and building helpful gadgets for a coral reef.',twist:'What would a fish need a submarine for?',description:'Meet the little maker with an ocean of inventions.',move:'dance'},
 {id:'night-guide',title:'A pocketful of moonlight',name:'The night guide',category:'Make-believe',image:'/assets/starters/night-guide.png',color:'rose',prompt:'A fluffy purple moth explorer wearing a cozy scarf, carrying a glowing lantern and guiding lost travelers through a moonlit garden.',twist:'What if the lantern collected forgotten dreams?',description:'A tiny lantern. A very big nighttime adventure.',move:'float'}
];
export const starterHref=id=>`/studio?starter=${encodeURIComponent(id)}`;
export function studioEntry(items,params){
 const crew=params.get('crew');
 if(['moss','tavi','nix','pip'].includes(crew)){
  let board=canvasEntry([]).board;board.name={moss:'My pictures',tavi:'My story',nix:'My soundtrack',pip:'My moving character'}[crew];
  if(crew==='pip')board.nodes.push({id:'sample',kind:'material',title:'A picture to try with Pip',image:'asset:fox',x:140,y:180});
  board=reduceBoard(board,{type:'task',id:'task',partner:crew,source:crew==='pip'?'sample':null,x:crew==='pip'?530:160,y:160});
  return {board,showStart:false,persist:true,focusId:'task'};
 }
 const goal=params.get('create');
 const project=CREATION_GOALS.find(item=>item.id===goal);
 if(project){
  const board=newProject(project.prompt||'A small fox astronaut.');
  board.name=project.name;
  if(project.instruction)board.nodes[1].text=project.instruction;
  if(goal==='motion'){
   board.unlocked=true;
   board.nodes=[{id:'sample',kind:'material',x:140,y:180,title:'A picture to try with Pip',image:'asset:fox'},{id:'task',kind:'task',inline:true,partner:'pip',x:530,y:160,source:'sample',text:'Make my explorer float gently.',move:'float'}];
  }else board.unlocked=items.some(p=>p.board.unlocked);
  return {board,showStart:false,persist:true,focusId:'task'};
 }

 const starter=STARTERS.find(s=>s.id===params.get('starter'));
 if(starter){const board=newProject(starter.prompt+(params.get('twist')==='1'?' '+starter.twist:''));return {board:{...board,name:starter.title,unlocked:items.some(p=>p.board.unlocked)},showStart:false,persist:true,focusId:'task'}}
 if(params.get('new')==='1')return canvasEntry([]);
 const selected=items.find(p=>p.board.id===params.get('project'));
 if(selected)return {board:restore(JSON.stringify(selected.board)),showStart:false};
 return canvasEntry(items);
}
