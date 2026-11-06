import React,{useRef,useState} from 'react';
import {X,ArrowRight,RotateCcw} from 'lucide-react';
import {pointOnDrawing,regionFromDrag,AREA_CHOICES,areaRegion} from './creative-tools';
import {artwork} from './StudioViews';
import {validate} from './model';
import {trapDialogKeys} from './drawing-renderer';
export function RegionPicture({node,region,onChange}){
 const drag=useRef(null),[draft,setDraft]=useState(null);const mark=draft||region;
 function pointer(event){return pointOnDrawing(event.clientX,event.clientY,event.currentTarget.getBoundingClientRect())}
 return <div className={`region-picture ${onChange?'can-mark':''}`}
  onPointerDown={onChange?e=>{if(e.button!==0)return;e.preventDefault();drag.current={id:e.pointerId,start:pointer(e)};e.currentTarget.setPointerCapture(e.pointerId);setDraft(null)}:undefined}
  onPointerMove={onChange?e=>{if(drag.current?.id===e.pointerId)setDraft(regionFromDrag(drag.current.start,pointer(e)))}:undefined}
  onPointerUp={onChange?e=>{if(drag.current?.id!==e.pointerId)return;const next=regionFromDrag(drag.current.start,pointer(e));drag.current=null;setDraft(null);if(next)onChange(next)}:undefined}
  onPointerCancel={()=>{drag.current=null;setDraft(null)}}>
  <img draggable="false" src={artwork(node)} alt={onChange?'The original picture. Drag to circle an area.':node.title||'Marked original picture'}/>
  {mark&&<svg viewBox="0 0 1 1" preserveAspectRatio="none" aria-hidden="true"><ellipse cx={mark.x+mark.width/2} cy={mark.y+mark.height/2} rx={mark.width/2} ry={mark.height/2} className="region-halo"/><ellipse cx={mark.x+mark.width/2} cy={mark.y+mark.height/2} rx={mark.width/2} ry={mark.height/2}/></svg>}
 </div>;
}
export function PictureRevision({node,initialText='',initialPreserve='',initialRegion=null,onClose,onSubmit}){
 const [text,setText]=useState(initialText),[preserve,setPreserve]=useState(initialPreserve),[region,setRegion]=useState(initialRegion),[error,setError]=useState('');
 function submit(e){e.preventDefault();const error=validate(text)||(preserve?validate(preserve):'');if(error){setError(error);return}onSubmit({text,preserve,editRegion:region})}
 return <section className="revision-sheet marked-revision" role="dialog" aria-modal="true" aria-labelledby="revision-title" onKeyDown={e=>trapDialogKeys(e,onClose)}>
  <header><h2 id="revision-title">What would you change?</h2><button aria-label="Close revision" onClick={onClose}><X size={22}/></button></header>
  <div className="revision-picture"><RegionPicture node={node} region={region} onChange={setRegion}/><div className="region-controls"><label>Mark an area<select aria-label="Choose an area to change" value="" onChange={e=>{if(e.target.value!=='')setRegion(areaRegion(Number(e.target.value)))}}><option value="">{region?'Area marked · choose another':'Drag a circle, or choose here'}</option>{AREA_CHOICES.map((label,i)=><option key={label} value={i}>{label}</option>)}</select></label><button aria-label="Clear marked area" disabled={!region} onClick={()=>setRegion(null)}><RotateCcw size={17}/></button></div><p>The circle guides Moss. Your original stays safe.</p></div>
  <form onSubmit={submit}><label htmlFor="change-words">I want to change…</label><textarea id="change-words" aria-label="Your changes" maxLength={500} placeholder="Make the scarf yellow. Add tiny stars to it." value={text} onChange={e=>{setText(e.target.value);setError('')}}/>
   <label htmlFor="keep-words">Keep these details <span>(optional)</span></label><textarea id="keep-words" aria-label="Keep these details" maxLength={180} placeholder="The face, ears and blue boots." value={preserve} onChange={e=>setPreserve(e.target.value)}/>
   <details className="word-help"><summary>Help me say it</summary><p>Try one detail at a time: “Make the hat taller.”</p><p>Then say what you like: “Keep the little ears.”</p></details>
   {error&&<p className="entry-error" role="alert">{error}</p>}<button className="make-button" disabled={!text.trim()}>Make this change<ArrowRight size={18}/></button>
  </form>
 </section>;
}
