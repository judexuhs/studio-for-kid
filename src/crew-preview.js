// Local, preset homepage interaction. Never submits a generation request or unlocks saved projects.
export const crewPreviewInitial={stage:'idea',move:'float',playing:false};
export function crewPreview(state,action){
 switch(action.type){
 case 'make':return state.stage==='idea'?{...state,stage:'picture'}:state;
 case 'handoff':return state.stage==='picture'?{...state,stage:'movement',playing:true}:state;
 case 'move':return state.stage==='movement'&&['float','hop','dance'].includes(action.move)?{...state,move:action.move,playing:true}:state;
 case 'toggle':return state.stage==='movement'?{...state,playing:!state.playing}:state;
 case 'reset':return {...crewPreviewInitial};
 default:return state;
 }
}
