import React,{useState,useRef,useEffect} from 'react';
import {ArrowRight,Plus,X,Download,Upload,Trash2,Folder,ImagePlus,Pencil,Sparkles,Lightbulb} from 'lucide-react';
import {STARTERS} from './starters';
import {artwork} from './StudioViews';
const START_CHOICES=[
 {id:'character',title:'A character',image:'/assets/gallery/jelly.png',idea:'A bouncy jelly creature with headphones and a tiny backpack.'},
 {id:'world',title:'A world',image:'/assets/gallery/treehouse.png',idea:'A floating treehouse library above the clouds, with bridges for birds.'},
 {id:'comic',title:'A comic',image:'/assets/gallery/comic.png',idea:'A cat plants a seed, waters it, then finds a strawberry bigger than itself.'}
];
export function CanvasStart({onCreate,onClose,onUpload,onDraw,hasWork}){
 const [idea,setIdea]=useState(''),[goal,setGoal]=useState('character'),[mode,setMode]=useState(null),[error,setError]=useState(''),[pending,setPending]=useState(false);
 function chooseMode(value){setMode(value);setGoal(value==='character'?'character':'idea');setError('')}
 function useStarter(text,nextGoal='character'){
  const known=[...START_CHOICES.map(c=>c.idea),...STARTERS.map(c=>c.prompt)];
  if(idea.trim()&&!known.includes(idea)){setError('Your words are kept. Clear the box first to use a different starting idea.');return}
  setIdea(text);setGoal(nextGoal);setMode(nextGoal==='character'?'character':'idea');setError('');
 }
 async function submit(e){e.preventDefault();setPending(true);setError('');try{await onCreate(idea,goal)}catch(e){setError(e.message)}finally{setPending(false)}}
 return <section className="canvas-start creation-start first-creation" aria-labelledby="canvas-start-title">
  <button className="start-close" aria-label="Close inspiration" onClick={onClose}><X size={20}/></button>
  <div className="start-welcome"><img src="/assets/moss.webp" alt="Moss"/><div><h1 id="canvas-start-title">{hasWork?'What’s joining your world?':'What will you make first?'}</h1></div></div>
  <div className={`first-mode-list ${mode?'has-choice':''}`} aria-label="Choose how to start">
   {[['character','Make a character',null],['drawing','Start with a drawing',Pencil],['idea','I have my own idea',Lightbulb]].map(([id,label,Icon])=><button key={id} aria-pressed={mode===id} onClick={()=>{if(id==='drawing')onDraw();else chooseMode(id)}}>{Icon?<span className={'first-symbol '+id}><Icon size={27}/></span>:<img src="/assets/gallery/jelly.png" alt=""/>}<span>{label}</span><ArrowRight size={19}/></button>)}
  </div>
  {mode==='drawing'?<div className="picture-start"><button className="make-button" onClick={onDraw}><Pencil size={20}/>Open drawing board<ArrowRight size={18}/></button><button className="upload-start" onClick={onUpload}><ImagePlus size={19}/>Use a picture I already have</button></div>:mode&&<form onSubmit={submit}>
   <label htmlFor="canvas-idea">{mode==='character'?'Who are you imagining?':'What would you like to make?'}</label><textarea autoFocus id="canvas-idea" placeholder={mode==='character'?'A dragon who’s afraid of toast…':'A city under the sea, a poster for a bug club…'} maxLength={500} value={idea} onChange={e=>{setIdea(e.target.value);setError('')}}/>
   <details className="interest-starters"><summary>Need a starting idea?</summary><div>{START_CHOICES.map(c=><button type="button" key={c.id} onClick={()=>useStarter(c.idea,c.id)}><img src={c.image} alt=""/><span>{c.title}</span></button>)}</div><div>{STARTERS.slice(0,3).map(c=><button type="button" key={c.id} onClick={()=>useStarter(c.prompt)}><span>{c.title}</span></button>)}</div><button type="button" className="twist-idea" onClick={()=>setIdea(current=>current&&!current.includes('What if everything')?(current+' What if everything went a little wrong?').slice(0,500):current)}>Add a what-if twist<ArrowRight size={15}/></button></details>
   <button className="make-button" disabled={pending||!idea.trim()}>{pending?'Starting…':'Make my picture'}<ArrowRight size={18}/></button>
  </form>}
  {error&&<p className="entry-error" role="alert">{error}</p>}
  <button className="upload-start" onClick={onUpload}><ImagePlus size={18}/>Use my own picture</button>
  <button className="explore-canvas" onClick={onClose}>I’ll explore the canvas</button>
 </section>;
}
export function ProjectDrawer({projects,currentId,onOpen,onNew,onClose,onDelete,onImport,onExport,error}){const file=useRef(null),ref=useRef(null);useEffect(()=>{ref.current?.querySelector('button')?.focus()},[]);return <aside ref={ref} className="project-drawer floating" aria-label="My canvases"><header><h2>My canvases</h2><button aria-label="Close canvases" onClick={onClose}><X size={20}/></button></header><button className="drawer-new" onClick={onNew}><Plus size={19}/>New canvas</button>{error&&<p className="entry-error" role="alert">{error}</p>}<div className="drawer-projects">{projects.length===0?<p>Your creations will be right here.</p>:projects.map(item=>{const b=item.board,n=b.nodes.find(n=>n.id===b.finishedId)||[...b.nodes].reverse().find(n=>n.image);return <article key={item.id} className={item.id===currentId?'current':''}><button className="drawer-open" onClick={()=>onOpen(b)}>{n?<img src={artwork(n)} alt=""/>:<span className="drawer-blank"><Sparkles size={24}/></span>}<span><strong>{b.name}</strong><small>{item.id===currentId?'On your canvas':b.finishedId?'Character card ready':'Keep creating'}</small></span><ArrowRight size={17}/></button><div className="drawer-item-actions">{b.presentation?.ids?.length>0&&<button onClick={()=>onOpen(b,'showcase')}>Present</button>}{b.finishedId&&<button onClick={()=>onOpen(b,'finish')}>View my card</button>}<button aria-label={`Delete ${b.name}`} onClick={()=>onDelete(item)}><Trash2 size={16}/></button></div></article>})}</div><footer><button onClick={()=>file.current.click()}><Upload size={16}/>Import canvas</button><button onClick={onExport}><Download size={16}/>Back up this canvas</button><input ref={file} type="file" hidden accept="application/json" onChange={onImport}/></footer></aside>}
