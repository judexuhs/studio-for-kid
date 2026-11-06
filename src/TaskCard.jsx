import React,{useState} from 'react';
import {ArrowRight,ChevronDown,Check,Plus,StickyNote,Pencil,Download,Play,Pause,Maximize,BookOpen,Music,Star,Columns2} from 'lucide-react';
import {sourceNodes,CREATION_ACTIONS,taskIsComplete,characterProfile} from './model';
import {artwork} from './StudioViews';
import {CREW,downloadFile} from './world';
import {continuationSteps} from './creative-tools';
import {RegionPicture} from './PictureRevision';
import {ShowcaseAvatar} from './ShowcaseCrewCard';
import {MaterialOptions} from './WorkChoices';

export function ContinueActions({output,onContinue,onCombine,onHandoff,onCompose}){
 if(!output)return null;
 const suggestions=output.image?continuationSteps(output):[];
 return <div className="continuation-actions">
  {suggestions.map(s=><button key={s.id} onClick={()=>onContinue(s.id,output)}>{s.label}<ArrowRight size={15}/></button>)}
  {output.image&&<><button onClick={()=>onCompose('comic',output)}>Make a comic</button><button onClick={()=>onCompose('stickers',output)}>Make stickers</button></>}
  {!output.image&&output.partner!=='moss'&&<button onClick={()=>onHandoff('moss',output)}>Illustrate this</button>}
  {!output.image&&output.partner!=='tavi'&&<button onClick={()=>onHandoff('tavi',output)}>Tell a story</button>}
  {output.partner!=='nix'&&<button onClick={()=>onHandoff('nix',output)}>Make a soundtrack</button>}
  {output.image&&<><button onClick={()=>onHandoff('pip',output)}>Make it move</button><button onClick={()=>onCombine(output)}>Combine pictures</button></>}
 </div>;
}
export function TaskCard({node:n,board,expanded,onExpand,onChange,onStart,onSource,onBranch,output,versions=[],onVersion,onEdit,onGrow,onCombine,onKeep,onBeginBranch,onView,onCompare,onMain,onHandoff,onCard,onShow,onCompose,onRecover,onDraw,onContinue,onMarkedEdit,readOnlyOutput=false}){
 const [playing,setPlaying]=useState(()=>!matchMedia('(prefers-reduced-motion: reduce)').matches);
 const sources=sourceNodes(board,n),partner=CREW[n.partner];
 const title=output?.title||CREATION_ACTIONS[n.operation]?.label||n.title||(n.partner==='moss'?'Make a picture':n.partner==='tavi'?'Tell a story':n.partner==='nix'?'Make a song':'Make it move');
 const complete=taskIsComplete(board,n),busy=n.job?.status==='working';
 const main=board.nodes.find(a=>a.id===board.world?.characterId),hasWorld=!!(main||board.world?.setting);
 return <><div className="task-heading"><ShowcaseAvatar partner={n.partner}/><div><strong>{title}</strong><span>{output?.kind==='material'?'Your starting picture':output&&!expanded?'Made with '+partner:'Create with '+partner}</span></div></div>
 {output&&<div className={`unit-output ${expanded?'is-editing':''}`} data-combine={output.image?output.id:undefined}>
  {output.image?<div className="unit-art"><img draggable="false" src={artwork(output)} alt={output.title} className={output.move&&playing?'motion-'+output.move:''}/>{output.move&&<button aria-label={playing?'Pause animation':'Play animation'} onClick={()=>setPlaying(p=>!p)}>{playing?<Pause size={18}/>:<Play size={18}/>}</button>}{onView&&<button className="open-work" onClick={()=>onView(output)} aria-label="Open work"><Maximize size={18}/></button>}</div>:output.audio?<audio controls src={output.audio} aria-label={output.title}/>:<div className="unit-story"><p>{output.text}</p>{onView&&<button onClick={()=>onView(output)}>Read my story<ArrowRight size={16}/></button>}</div>}
  {versions.length>1&&<div className="version-strip" aria-label="Creation versions">{versions.map((v,i)=><button key={v.id} aria-label={`Version ${i+1}${v.accepted?', favorite':''}`} aria-pressed={v.id===output.id} onClick={()=>onVersion(v.id)}>{v.image?<img src={artwork(v)} alt=""/>:v.audio?<Music size={20}/>:<BookOpen size={20}/>}<span>{i+1}</span>{v.accepted&&<Star size={12}/>}</button>)}</div>}
  <div className="unit-version">{output.kind==='result'&&<button aria-pressed={!!output.accepted} onClick={()=>onKeep(output)}><Star size={16}/>Favorite</button>}{(versions.length>1||output.input?.image)&&<button onClick={()=>onCompare(output,versions)}><Columns2 size={16}/>Compare</button>}</div>
  <div className="result-actions">
   {output.image?<details className="work-menu" name={'work-actions-'+n.id+(onView?'-canvas':'-focus')} onToggle={e=>{if(e.currentTarget.open&&e.currentTarget.closest('.work-detail'))e.currentTarget.scrollIntoView({block:'nearest'})}}><summary><Pencil size={15}/>Edit</summary><div><button disabled={busy} onClick={()=>onEdit(output)}>Change this picture</button><button onClick={()=>onDraw(output)}>{output.drawing?'Continue my drawing':'Draw on a copy'}</button>{!readOnlyOutput&&<button disabled={busy} onClick={onExpand}>{expanded?'Close instructions':n.partner==='pip'?'Change movement':'Rework from starting material'}</button>}<button onClick={()=>onMain(output)}>{board.world?.characterId===output.id?'Character settings':'Use as main character'}</button></div></details>:!readOnlyOutput?<button onClick={onExpand}><Pencil size={15}/>{expanded?'Close':'Edit'}</button>:<button onClick={()=>onHandoff(n.partner,output)}><Pencil size={15}/>Edit</button>}
   <details className="work-menu" name={'work-actions-'+n.id+(onView?'-canvas':'-focus')} onToggle={e=>{if(e.currentTarget.open&&e.currentTarget.closest('.work-detail'))e.currentTarget.scrollIntoView({block:'nearest'})}}><summary>Continue<ArrowRight size={15}/></summary><ContinueActions {...{output,onContinue,onCombine,onHandoff,onCompose}}/></details>
   <details className="work-menu" name={'work-actions-'+n.id+(onView?'-canvas':'-focus')} onToggle={e=>{if(e.currentTarget.open&&e.currentTarget.closest('.work-detail'))e.currentTarget.scrollIntoView({block:'nearest'})}}><summary><Download size={15}/>Download</summary><div>{output.text&&!output.image&&!output.audio?<button onClick={()=>downloadFile(output.text,'my-pebli-story.txt','text/plain')}>Download story</button>:<a href={output.audio||artwork(output)} download={output.audio?'my-pebli-song.mp3':'my-pebli-picture.png'}>{output.audio?'Download MP3':'Download picture'}</a>}{output.image&&<button onClick={()=>onCard(output)}>{output.move?'Make a moving card':'Make a character card'}</button>}{!output.audio&&<button onClick={()=>onShow(output)}>Preview presentation</button>}</div></details>
  </div>
  {output.image&&onBeginBranch&&<button className="branch-shortcut" aria-label="Drag to continue from this picture" title="Drag to empty space to continue, or onto another picture to combine" onPointerDown={e=>onBeginBranch(e,output)} onClick={()=>onGrow(output)}><Plus size={14}/></button>}
 </div>}
 {!readOnlyOutput&&(!output||expanded||busy||n.job?.status==='failed')&&<div className="task-editor">
  {output&&expanded&&<p className="world-note">{n.partner==='pip'?'Choose a movement for a new version.':'This uses the starting material below. To change the finished picture, choose Edit → Change this picture.'}</p>}
  {sources.length>0&&<div className="task-sources">{sources.map(s=>s.image?<button key={s.id} className="task-source-image" onClick={()=>onSource(s)} title={s.title}><img src={artwork(s)} alt={s.title}/></button>:<details key={s.id} className="task-source-note"><summary><StickyNote size={16}/>{s.kind==='result'?'From your story':'From your idea'}<ChevronDown size={15}/></summary><p>{s.text||s.instruction||s.title}</p></details>)}{n.sources&&<button aria-label="Make another branch with these pictures" onClick={onBranch}><Plus size={18}/></button>}</div>}
  {n.editRegion&&sources[0]?.image&&<div className="marked-task-reference"><RegionPicture node={sources[0]} region={n.editRegion}/><button disabled={busy} onClick={()=>onMarkedEdit(sources[0],n)}>Change marked edit<Pencil size={15}/></button></div>}
  {n.partner!=='pip'&&<><label className="task-prompt-label" htmlFor={'prompt-'+n.id}>{sources.length?'Your direction':'Your idea'}</label><textarea id={'prompt-'+n.id} aria-label={`Instructions for ${n.partner}`} maxLength={500} value={n.text} placeholder={n.partner==='nix'?'A song for a very unusual adventure…':n.partner==='tavi'?'What happens when your character finds a secret door?':'A little character with a big idea…'} onChange={e=>onChange({text:e.target.value})}/></>}
  {n.preserve&&<p className="preserve-record"><strong>Keep:</strong> {n.preserve}</p>}
  {hasWorld&&n.partner!=='pip'&&<label className="bring-world"><input type="checkbox" checked={!!n.useWorld} onChange={e=>onChange({useWorld:e.target.checked})}/>{main&&<img src={artwork(main)} alt="Main character reference"/>}<span>Bring my world{characterProfile(board).name?' · '+characterProfile(board).name:''}</span></label>}
  {!n.sources&&<details className="task-material-settings" open={n.partner==='pip'&&!sources.some(s=>s.image)}><summary>{sources.length?'Change starting material':'Use something from my canvas'}</summary><select aria-label={`Material for ${n.id}`} value={n.source||''} onChange={e=>onChange({source:e.target.value||null,editRegion:null})}><option value="">{n.partner==='pip'?'Choose a picture':'Just my words'}</option><MaterialOptions board={board} node={n} filter={a=>a.id!==n.id&&(n.partner!=='pip'||a.image)}/></select></details>}
  {n.partner==='pip'&&<><div className="movement-choices" aria-label="Movement">{['float','hop','dance'].map(move=><button key={move} aria-pressed={(n.move||'float')===move} onClick={()=>onChange({move})}>{move[0].toUpperCase()+move.slice(1)}</button>)}</div>{sources[0]?.image&&<div className="movement-preview"><img src={artwork(sources[0])} alt="Movement preview" className={playing?'motion-'+(n.move||'float'):''}/><button aria-label={playing?'Pause movement preview':'Play movement preview'} onClick={()=>setPlaying(p=>!p)}>{playing?<Pause size={18}/>:<Play size={18}/>}</button></div>}</>}
  {n.partner==='tavi'&&<label className="task-movement">Make<select aria-label="Story format" value={n.storyFormat||'story'} onChange={e=>onChange({storyFormat:e.target.value})}><option value="story">A short story</option><option value="next-scene">The next scene</option><option value="comic">Three-panel comic outline</option></select></label>}
  {n.partner==='nix'&&<details className="music-options"><summary>Lyrics and singing</summary><label><input type="checkbox" checked={!!n.instrumental} onChange={e=>onChange({instrumental:e.target.checked})}/>Instrumental · no singing</label>{!n.instrumental&&<textarea aria-label="Your lyrics (optional)" placeholder="Your lyrics (optional)" maxLength={3500} value={n.lyrics||''} onChange={e=>onChange({lyrics:e.target.value})}/>}</details>}
  {['tavi','nix'].includes(n.partner)&&sources.some(s=>s.medium==='drawing'&&!s.text?.trim())&&<p className="world-note">Open your drawing and add a description first. {partner} works from your words. <button onClick={()=>onHandoff(n.partner,sources.find(s=>s.medium==='drawing'&&!s.text?.trim()))}>Describe my drawing</button></p>}
  {n.job?.status==='failed'&&<div className="job-error" role="alert"><p>{n.job.error}</p><button onClick={onRecover}>Check existing request</button></div>}
  {busy&&<p className="job-progress" role="status">{partner} is creating. You can keep exploring.</p>}
  <button className="make-button" disabled={busy||(n.partner!=='pip'&&!n.text.trim())||(n.partner==='pip'&&!sources.some(s=>s.image))} onClick={onStart}>{busy?'Creating…':n.job?.status==='failed'?'Start a new attempt':n.partner==='pip'?'Apply movement':complete?'Make another version':n.partner==='tavi'?'Write my story':n.partner==='nix'?'Make my song':'Make my picture'}{busy?<span className="spinner"/>:<ArrowRight size={18}/>}</button>
  {n.partner==='pip'&&!sources.some(s=>s.image)&&<p className="world-note">Upload, draw or choose a picture, then Pip is ready.</p>}
 </div>}
 </>;
}
