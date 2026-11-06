import React,{useState} from 'react';
import {ArrowLeft,ArrowRight,ArrowUp,ArrowDown,Check,X,Download,Image,Music,BookOpen,Star,Play} from 'lucide-react';
import {artwork} from './StudioViews';
import {creativeJourney,presentationItems,prepareWorldExport,downloadFile} from './world';

export function WorldPanel({board,onChange,onCharacter,onClose,onShow,onFocus}){
 const world=board.world||{},pictures=board.nodes.filter(n=>n.image),character=pictures.find(n=>n.id===world.characterId);
 return <aside className="world-panel floating" aria-label="My world"><header><h2>My world</h2><button onClick={onClose} aria-label="Close my world"><X size={20}/></button></header>
 <label>World name<input value={board.name} maxLength={60} onChange={e=>onChange({name:e.target.value})}/></label>
 <label>A little about this world<textarea value={world.setting||''} maxLength={400} placeholder="A moon made of marshmallow. Everyone travels by balloon…" onChange={e=>onChange({world:{...world,setting:e.target.value}})}/></label>
 <h3>My main character</h3>{character?<div className="world-character"><button onClick={()=>onFocus(character)}><img src={artwork(character)} alt={character.title}/></button><label>Character name<input maxLength={40} placeholder="A fictional name" value={world.characterName||''} onChange={e=>onChange({world:{...world,characterName:e.target.value}})}/></label></div>:<p>Choose a picture from this canvas to bring into your next creations.</p>}
 <div className="world-picture-picks">{pictures.map(n=><button key={n.id} aria-label={`Set ${n.title} as main character`} aria-pressed={world.characterId===n.id} onClick={()=>onCharacter(n)}><img src={artwork(n)} alt=""/>{world.characterId===n.id&&<Check size={18}/>}</button>)}</div>
 {character&&<button className="quiet-action" onClick={()=>onChange({world:{...world,characterId:null}})}>Remove main character</button>}
 <p className="world-note">Choose “Bring my world” in a task to use this character and setting. Your earlier versions stay as they were.</p>
 <button className="make-button" onClick={onShow}>Show my world<ArrowRight size={18}/></button>
 </aside>;
}
export function Journey({board}){
 const journey=creativeJourney(board);
 return <section className="creative-journey"><h2>My creative journey</h2>{journey.length?journey.map((n,i)=><article key={n.id}><div className="journey-step">{i+1}</div><div><h3>{n.title}</h3><blockquote>{n.instruction}</blockquote>{n.preserve&&<p><strong>I wanted to keep:</strong> {n.preserve}</p>}<p>{n.fromDrawing?'I started with my drawing. ':''}{n.partner} helped make this.{n.kept?' I chose to keep this version.':''}</p></div></article>):<p>Your ideas and decisions will appear here as you make things.</p>}</section>;
}
function Work({node}){return node.image?<img src={artwork(node)} alt={node.title}/>:<div className="presentation-story"><BookOpen size={25}/><p>{node.text}</p></div>}
export function WorldShowcase({board,onChange,onBack}){
 const [preview,setPreview]=useState(false),[error,setError]=useState(''),[exporting,setExporting]=useState(false);
 const config=board.presentation||{ids:[],includeJourney:false},items=presentationItems(board);
 const choices=board.nodes.filter(n=>n.image||n.kind==='result'&&n.text),songs=board.nodes.filter(n=>n.audio);
 const cover=items.find(n=>n.id===config.coverId)||items[0],music=songs.find(n=>n.id===config.musicId);
 function update(patch){onChange({presentation:{...config,...patch}})}
 function toggle(id){setError('');const ids=items.map(n=>n.id);if(ids.includes(id)){update({ids:ids.filter(a=>a!==id)});return}if(ids.length===5){setError('Choose up to five works. Remove one to add another.');return}update({ids:[...ids,id]})}
 function move(id,offset){const ids=items.map(n=>n.id),i=ids.indexOf(id),j=i+offset;if(j<0||j>=ids.length)return;[ids[i],ids[j]]=[ids[j],ids[i]];update({ids})}
 async function exportWorld(){setError('');setExporting(true);try{downloadFile(await prepareWorldExport(board),'my-pebli-world.html','text/html')}catch(e){setError(e.message||'Your world could not download. Please try again.')}finally{setExporting(false)}}
 return <div className={`world-showcase ${preview?'is-preview':''}`}><header className="world-showcase-toolbar"><button onClick={preview?()=>setPreview(false):onBack}><ArrowLeft size={19}/>{preview?'Edit selection':'Back to canvas'}</button><strong>{preview?board.name:'Show my world'}</strong><div><button disabled={!items.length} onClick={()=>setPreview(p=>!p)}>{preview?'Edit':'Preview'}<Play size={16}/></button><button disabled={!items.length||exporting} className="showcase-download" onClick={exportWorld}><Download size={17}/>{exporting?'Preparing…':'Download'}</button></div></header>
 {error&&<p className="world-error" role="alert">{error}</p>}
 {!preview?<main className="showcase-editor"><section className="showcase-selection"><h1>A little world.<br/>Entirely yours.</h1><p>Pick up to five works, put them in order, and add a soundtrack if you like.</p>{choices.length?<div className="showcase-work-grid">{choices.map(n=><button key={n.id} aria-pressed={config.ids.includes(n.id)} onClick={()=>toggle(n.id)}><div>{n.image?<img src={artwork(n)} alt=""/>:<><BookOpen/><p>{n.text?.slice(0,110)}</p></>}</div><span>{n.title}</span>{config.ids.includes(n.id)&&<span className="selection-check"><Check size={16}/></span>}</button>)}</div>:<div className="showcase-empty"><Image size={32}/><h2>Make something to show.</h2><p>Your pictures, drawings and stories will be here.</p><button className="make-button" onClick={onBack}>Back to creating<ArrowRight size={18}/></button></div>}</section>
 <aside className="showcase-settings"><h2>Your selection <span>{items.length}/5</span></h2>{items.length?items.map((n,i)=><div className="showcase-order" key={n.id}>{n.image?<img src={artwork(n)} alt=""/>:<BookOpen/>}<strong>{n.title}</strong><button aria-label={`Move ${n.title} earlier`} disabled={i===0} onClick={()=>move(n.id,-1)}><ArrowUp size={16}/></button><button aria-label={`Move ${n.title} later`} disabled={i===items.length-1} onClick={()=>move(n.id,1)}><ArrowDown size={16}/></button><button aria-label={`Remove ${n.title}`} onClick={()=>toggle(n.id)}><X size={16}/></button></div>):<p>Select the works you want to show.</p>}
 <label>Cover<select value={cover?.id||''} onChange={e=>update({coverId:e.target.value})}><option value="" disabled>Choose a work</option>{items.map(n=><option key={n.id} value={n.id}>{n.title}</option>)}</select></label>
 <label>Soundtrack<select value={music?.id||''} onChange={e=>update({musicId:e.target.value||null})}><option value="">No soundtrack</option>{songs.map(n=><option key={n.id} value={n.id}>{n.title}</option>)}</select></label>
 <label className="journey-choice"><input type="checkbox" checked={!!config.includeJourney} onChange={e=>update({includeJourney:e.target.checked})}/><span>Include my creative journey</span></label><p>Your original directions, changes and choices. Only included when you choose.</p>
 <button className="make-button" disabled={!items.length} onClick={()=>setPreview(true)}>See my world<ArrowRight size={18}/></button><p className="world-note">Saved on this device. Download an offline page to keep or show to your family.</p>
 </aside>{config.includeJourney&&<Journey board={board}/>}</main>:<main className="world-presentation"><header><h1>{board.name}</h1>{board.world?.setting&&<p>{board.world.setting}</p>}{cover?.image&&<div className="presentation-cover"><Work node={cover}/></div>}{music&&<div className="presentation-music"><Music size={20}/><span>{music.title}</span><audio key={music.id} controls src={music.audio} aria-label={music.title}/></div>}</header><div className="presentation-works">{items.map(n=><figure key={n.id}><Work node={n}/><figcaption>{n.title}</figcaption></figure>)}</div>{config.includeJourney&&<Journey board={board}/>}<footer>My ideas, with a little help from my crew.</footer></main>}
 </div>;
}
