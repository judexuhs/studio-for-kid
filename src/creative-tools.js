const clamp=value=>Math.min(1,Math.max(0,value));
const round=value=>Number(value.toFixed(4));
export function pointOnDrawing(x,y,rect){return {x:clamp((x-rect.left)/rect.width),y:clamp((y-rect.top)/rect.height)}}
export function validRegion(r){return !!r&&['x','y','width','height'].every(k=>Number.isFinite(r[k]))&&r.x>=0&&r.y>=0&&r.width>=.01&&r.height>=.01&&r.x+r.width<=1.00001&&r.y+r.height<=1.00001}
export function regionFromDrag(start,end){const r={x:round(Math.min(start.x,end.x)),y:round(Math.min(start.y,end.y)),width:round(Math.abs(start.x-end.x)),height:round(Math.abs(start.y-end.y))};return validRegion(r)?r:null}
export const AREA_CHOICES=['Top left','Top center','Top right','Middle left','Center','Middle right','Bottom left','Bottom center','Bottom right'];
export function areaRegion(index){return {x:round((index%3)/3),y:round(Math.floor(index/3)/3),width:.3333,height:.3333}}
export const validPicture=value=>typeof value==='string'&&(value==='asset:fox'||(value.length<=9e6&&/^data:image\/(png|jpeg|webp);base64,[A-Za-z0-9+/=]+$/.test(value)));
export function strokeCapacity(strokes){return strokes.length>=200?0:Math.max(0,Math.min(800,30000-strokes.reduce((total,s)=>total+s.points.length,0)))}
export function validDrawing(d){
 if(!d||d.version!==1||d.width!==800||d.height!==520||!Array.isArray(d.strokes)||d.strokes.length>200||(d.baseImage&&!validPicture(d.baseImage)))return false;
 let points=0;
 return d.strokes.every(s=>s&&['pen','eraser'].includes(s.tool)&&/^#[a-f\d]{6}$/i.test(s.color)&&Number.isFinite(s.width)&&s.width>=2&&s.width<=32&&Array.isArray(s.points)&&s.points.length>0&&s.points.length<=800&&(points+=s.points.length)<=30000&&s.points.every(p=>p&&Number.isFinite(p.x)&&Number.isFinite(p.y)&&p.x>=0&&p.x<=1&&p.y>=0&&p.y<=1));
}
export function drawingHistory(state,action){
 if(action.type==='undo'){if(!state.past.length)return state;return {strokes:state.past.at(-1),past:state.past.slice(0,-1),future:[state.strokes,...state.future]}}
 if(action.type==='redo'){if(!state.future.length)return state;return {strokes:state.future[0],past:[...state.past,state.strokes].slice(-30),future:state.future.slice(1)}}
 const strokes=action.type==='clear'?[]:action.type==='stroke'?[...state.strokes,structuredClone(action.stroke)]:null;
 if(!strokes||!validDrawing({version:1,width:800,height:520,strokes}))return state;
 return {strokes,past:[...state.past,state.strokes].slice(-30),future:[]};
}
export const NEXT_STEPS={
 home:{creationType:'world',label:'Give them a home',partner:'moss',prompt:'Design a home for this character. Include the character and keep their recognizable appearance.'},
 adventure:{label:'Start an adventure',partner:'tavi',prompt:'Write the start of an adventure for my character. Leave the next decision open for me.'},
 scene:{creationType:'world',label:'Imagine a new scene',partner:'moss',prompt:'Use this picture as inspiration for a new scene. Keep the details I describe.'},
 story:{label:'Tell a story',partner:'tavi',prompt:'Write a short story inspired by the description of this work.'},
 movement:{label:'Make them move',partner:'pip',prompt:'Make my picture float gently.'}
};

export function continuationSteps(output){
 const ids=output.creationType==='character'?['home','adventure']:['scene','story'];
 return ids.map(id=>({id,...NEXT_STEPS[id]}));
}
