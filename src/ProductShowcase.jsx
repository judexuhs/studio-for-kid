import React,{useState,useRef,useEffect} from 'react';
import {ArrowRight,Play,Pause,Check,RotateCcw,MousePointer2,Pencil,Image,MoveUpRight,ArrowUpRight,Plus,Minus,ArrowLeft,Orbit} from 'lucide-react';
import {CREATION_GOALS,GALLERY_WORKS,GOAL_ACTIONS} from './creation-content';
import './creation-exhibition.css';
import './product-showcase.css';
import './invitation-canvas.css';
import './universe-showcase.css';
import {ProjectSymbol} from './ProjectSymbol';
export function ProductCanvas(){
 const frame=useRef(null),audio=useRef(null),[scale,setScale]=useState(1),[listening,setListening]=useState(false),[audioError,setAudioError]=useState(false);
 async function toggleSound(){if(!audio.current.paused){audio.current.pause();return}setAudioError(false);try{await audio.current.play()}catch{setAudioError(true)}}
 useEffect(()=>{
  const observer=new ResizeObserver(([entry])=>setScale(Math.max(.56,entry.contentRect.width/1440)));
  observer.observe(frame.current);return()=>observer.disconnect();
 },[]);
 useEffect(()=>{if(frame.current.clientWidth<760)frame.current.scrollLeft=580*scale-16},[scale]);
 const browse=direction=>frame.current.scrollBy({left:direction*frame.current.clientWidth*.8,behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});
 return <section className="showcase-section real-canvas-showcase" id="how-it-works">
  <div className="universe-heading"><h2>One idea.<br/><span>So many ways to make it.</span></h2><p>Give your crew a job. Branch out. Try a new format. <br/>Your ideas and everything they become, together on one canvas.</p></div>
  <div className="real-canvas-scroll" ref={frame} tabIndex={0} role="region" aria-label="Product canvas: Moss draws Nova and a singing space whale; Tavi tells their story; Nix makes a star song; Pip makes Nova float. Scroll sideways on a small screen.">
   <div className="real-canvas-size" style={{width:1440*scale,height:720*scale}}>
    <iframe src="/canvas-showcase" title="Pebli canvas: one adventure, four creative partners" tabIndex={-1} aria-hidden="true" loading="lazy" style={{width:1440,height:720,transform:'scale('+scale+')'}}/>
   </div>
  </div>
  <div className="canvas-browse"><button aria-label="Explore the left side of the canvas" onClick={()=>browse(-1)}><ArrowLeft size={18}/></button><button aria-label="Explore the right side of the canvas" onClick={()=>browse(1)}><ArrowRight size={18}/></button></div>
  <div className="universe-after"><div className="canvas-audio"><audio ref={audio} src="/assets/nova-star-song.wav" preload="none" onPlay={()=>setListening(true)} onPause={()=>setListening(false)} onEnded={()=>setListening(false)} onError={()=>{setListening(false);setAudioError(true)}}/><button onClick={toggleSound} aria-pressed={listening}>{listening?<Pause size={16}/>:<Play size={16}/>} {listening?"Pause Nix’s song":"Hear Nix’s star song"}</button>{audioError&&<span role="status">Couldn’t play. Try again.</span>}</div><a href="/studio?new=1">Start your own canvas <ArrowUpRight size={19}/></a></div>
 </section>
}
export function CreationGallery(){
 const [opened,setOpened]=useState(null),[playing,setPlaying]=useState(false);
 const rail=useRef(null);
 const [edges,setEdges]=useState({start:true,end:false});
 useEffect(()=>{
  const el=rail.current;
  const update=()=>setEdges({start:el.scrollLeft<2,end:el.scrollLeft+el.clientWidth>=el.scrollWidth-2});
  const observer=new ResizeObserver(update);
  observer.observe(el);el.addEventListener('scroll',update,{passive:true});update();
  return ()=>{observer.disconnect();el.removeEventListener('scroll',update)};
 },[]);
 function browse(direction){
  const el=rail.current;
  el.scrollBy({left:direction*el.clientWidth*.8,behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});
 }
 return <section className="portfolio-exhibition" id="possibilities">
  <div className="exhibition-heading"><h2>Small ideas.<br/><span>Wildly different creations.</span></h2><div className="exhibition-intro"><p>Big worlds, tiny characters, and everything in between.</p><div className="gallery-navigation"><button aria-label="Previous creations" aria-controls="creation-rail" disabled={edges.start} onClick={()=>browse(-1)}><ArrowLeft size={20}/></button><button aria-label="Next creations" aria-controls="creation-rail" disabled={edges.end} onClick={()=>browse(1)}><ArrowRight size={20}/></button></div></div></div>
  <div className="exhibition-wall" id="creation-rail" ref={rail} tabIndex={0} role="region" aria-label="Creations gallery, scroll to explore" onKeyDown={e=>{if(e.target===e.currentTarget&&['ArrowLeft','ArrowRight'].includes(e.key)){e.preventDefault();browse(e.key==='ArrowLeft'?-1:1)}}}>{GALLERY_WORKS.map(s=><article className={'exhibition-work work-'+s.id} key={s.id} style={{'--art-ratio':s.ratio}}>
   <div className="exhibition-art">
    <button className="art-discover" aria-label={'See the idea behind '+s.title} aria-expanded={opened===s.id} aria-controls={'idea-'+s.id} onClick={()=>setOpened(opened===s.id?null:s.id)}><img src={s.image} alt={s.title} loading="lazy" className={s.motion&&playing?'motion-float':''}/><span className="art-peek">{opened===s.id?<Minus size={16}/>:<Plus size={16}/>} The idea</span></button>
    {s.motion&&<button className="art-play" aria-label={playing?'Pause character movement':'Play character movement'} aria-pressed={playing} onClick={()=>setPlaying(!playing)}>{playing?<Pause size={16}/>:<Play size={16}/>}</button>}
   </div>
   <div className="portfolio-caption"><h3>{s.title}</h3><span>{s.kind}</span></div>
   <div className="work-idea" id={'idea-'+s.id} hidden={opened!==s.id}><p>“{s.prompt}”</p><a href={s.href||'/studio?create='+s.goal}>Make your own <ArrowUpRight size={16}/></a></div>
  </article>)}</div>
 </section>
}
export function CreationGoals(){return <section className="make-start" id="start">
 <div className="make-heading"><div><h2>Ready? Let’s make <span>your first creation.</span></h2><p>Choose what sounds fun. Your crew is ready.</p></div><a href="/studio?new=1" className="make-own">I have my own idea <ArrowUpRight size={19}/></a></div>
 <div className="make-projects icon-projects">{CREATION_GOALS.map(g=>{return <a key={g.id} href={'/studio?create='+g.id} className={'make-project make-'+g.id}>
  <div className="make-project-heading"><ProjectSymbol kind={g.id}/><h3>{g.title}</h3></div>
  <div className="make-copy"><p>{g.text}</p><span className="make-action">{GOAL_ACTIONS[g.id]}<ArrowRight size={18}/></span></div>
 </a>})}</div>
 <p className="make-note">No perfect idea needed.</p>
 </section>}
