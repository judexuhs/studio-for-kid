import React,{useEffect,useRef,useState} from 'react';
import {X,Pencil,Eraser,Undo2,Redo2,Trash2,ArrowRight} from 'lucide-react';
import {drawingHistory,pointOnDrawing,validDrawing,strokeCapacity} from './creative-tools';
import {renderStrokes,exportDrawing,trapDialogKeys} from './drawing-renderer';
import {validate} from './model';
const COLORS=[['Ink','#25344b'],['Red','#c94351'],['Orange','#b8621c'],['Yellow','#d6a729'],['Green','#287c50'],['Blue','#356dc3'],['Purple','#8050b0'],['White','#ffffff']];
export function DrawingBoard({inline=false,source,initialPartner='',onSave,onClose}){
 const initial=source?.drawing||{version:1,width:800,height:520,strokes:[],...(source?.image?{baseImage:source.image}:{})};
 const [history,setHistory]=useState({strokes:initial.strokes,past:[],future:[]}),[active,setActive]=useState(null),[tool,setTool]=useState('pen'),[color,setColor]=useState(COLORS[0][1]),[width,setWidth]=useState(6),[description,setDescription]=useState(source?.text||''),[partner,setPartner]=useState(initialPartner),[error,setError]=useState(''),[pending,setPending]=useState(false),[leaving,setLeaving]=useState(false);
 const canvas=useRef(null),stroke=useRef(null),saving=useRef(false);const dirty=history.past.length>0||history.future.length>0||description!==(source?.text||'');
 function act(action){if(saving.current)return;setHistory(state=>drawingHistory(state,action));setError('')}
 useEffect(()=>{renderStrokes(canvas.current.getContext('2d'),[...history.strokes,...(active?[active]:[])])},[history.strokes,active]);
 function end(event,cancel=false){if(!stroke.current||stroke.current.id!==event.pointerId)return;const {line}=stroke.current;stroke.current=null;setActive(null);if(!cancel)act({type:'stroke',stroke:line})}
 function close(){if(pending)return;if(dirty)setLeaving(true);else onClose()}
 async function save(){
  if(saving.current)return;saving.current=true;setError('');
  try{
   if(description&&validate(description))throw Error(validate(description));
   if(['tavi','nix'].includes(partner)&&!description.trim())throw Error('Tell your partner what you drew first.');
   const drawing={...initial,strokes:history.strokes};if(!validDrawing(drawing))throw Error('This drawing is full. Keep it, then start a new drawing.');
   const pixels=canvas.current.getContext('2d').getImageData(0,0,800,520).data;
   if(!drawing.baseImage&&!pixels.some((value,index)=>index%4===3&&value>0))throw Error('Your page is still empty. Draw a little something first.');
   setPending(true);const image=await exportDrawing(canvas.current,drawing);await onSave({image,drawing,description,partner:partner||null});
  }catch(e){setError(e.message)}finally{saving.current=false;setPending(false)}
 }
 function keys(e){
  if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==='z'&&!e.target.closest('input,textarea')){e.preventDefault();e.stopPropagation();act({type:e.shiftKey?'redo':'undo'});return}
  if(inline){if(e.key==='Escape'){e.preventDefault();close()}}else trapDialogKeys(e,close);e.stopPropagation();
 }
 return <section className={`drawing-overlay ${inline?'inline-drawing':''}`} role={inline?"region":"dialog"} aria-modal={inline?undefined:true} aria-labelledby="drawing-title" onKeyDown={keys}>
  <div className="drawing-workspace"><header><h2 id="drawing-title">Your drawing board</h2><button aria-label="Close drawing board" disabled={pending} onClick={close}><X size={22}/></button></header>
   <div className="drawing-tools" aria-label="Drawing tools"><div className="drawing-tool-pair"><button aria-label="Pencil" aria-pressed={tool==='pen'} onClick={()=>setTool('pen')}><Pencil size={20}/></button><button aria-label="Eraser" aria-pressed={tool==='eraser'} onClick={()=>setTool('eraser')}><Eraser size={20}/></button></div>
    <div className="drawing-colors" aria-label="Ink colors">{COLORS.map(([name,value])=><button key={name} aria-label={name+' ink'} aria-pressed={color===value&&tool==='pen'} style={{'--ink-color':value}} onClick={()=>{setColor(value);setTool('pen')}}><span/></button>)}</div>
    <label className="brush-size">Size<input aria-label="Brush size" type="range" min="2" max="32" step="2" value={width} onChange={e=>setWidth(Number(e.target.value))}/></label>
    <div className="drawing-history"><button aria-label="Undo stroke" disabled={pending||!history.past.length} onClick={()=>act({type:'undo'})}><Undo2 size={19}/></button><button aria-label="Redo stroke" disabled={pending||!history.future.length} onClick={()=>act({type:'redo'})}><Redo2 size={19}/></button><button aria-label="Clear strokes" disabled={pending||!history.strokes.length} onClick={()=>act({type:'clear'})}><Trash2 size={19}/></button></div>
   </div>
   <div className="drawing-paper">{initial.baseImage&&<img src={initial.baseImage==='asset:fox'?'/assets/moon-fox.png':initial.baseImage} alt="Starting picture"/>}<canvas ref={canvas} width="800" height="520" aria-label="Drawing area" tabIndex={0}
    onPointerDown={e=>{if(e.button!==0||pending)return;e.preventDefault();const limit=strokeCapacity(history.strokes);if(!limit){setError('Your drawing is full. Keep this one, then start another.');return}const line={tool,color,width,points:[pointOnDrawing(e.clientX,e.clientY,e.currentTarget.getBoundingClientRect())]};stroke.current={id:e.pointerId,line,limit};setActive(line);e.currentTarget.setPointerCapture(e.pointerId)}}
    onPointerMove={e=>{if(stroke.current?.id!==e.pointerId)return;const last=stroke.current.line,point=pointOnDrawing(e.clientX,e.clientY,e.currentTarget.getBoundingClientRect());if(last.points.length>=stroke.current.limit){setError('This part is kept. Lift your pencil before continuing.');return;}const line={...last,points:[...last.points,point]};stroke.current.line=line;setActive(line)}}
    onPointerUp={e=>end(e)} onPointerCancel={e=>end(e,true)}/></div>
   <footer><label className="drawing-description">What did you draw? <span>{['tavi','nix'].includes(partner)?'Your partner uses these words.':'(optional)'}</span><textarea aria-label="Describe your drawing" maxLength={500} rows={2} placeholder="A turtle who bakes cakes in the clouds…" value={description} onChange={e=>setDescription(e.target.value)}/></label>
    <div className="drawing-next"><label>What’s next?<select aria-label="What to do with your drawing" value={partner} onChange={e=>setPartner(e.target.value)}><option value="">Keep my drawing</option><option value="moss">Make a picture with Moss</option><option value="tavi">Tell a story with Tavi</option><option value="nix">Make music with Nix</option><option value="pip">Add motion with Pip</option></select></label><button className="make-button" disabled={pending||!!active||(!initial.baseImage&&!history.strokes.some(s=>s.tool==='pen'))||(['tavi','nix'].includes(partner)&&!description.trim())} onClick={save}>{pending?'Keeping your drawing…':partner?'Prepare with '+{moss:'Moss',tavi:'Tavi',nix:'Nix',pip:'Pip'}[partner]:'Keep my drawing'}<ArrowRight size={18}/></button></div>
   </footer>
   {error&&<p className="entry-error" role="alert">{error}</p>}
   {leaving&&<div className="drawing-leave" role="alert"><p>Keep working on this drawing?</p><button autoFocus onClick={()=>setLeaving(false)}>Keep drawing</button><button onClick={onClose}>Leave without saving</button></div>}
  </div>
 </section>;
}
