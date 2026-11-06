import React from 'react';
import waveform from './nova-waveform.json';
export const SHOWCASE_CREW=[{id:'moss',name:'Moss',role:'Pictures'},{id:'tavi',name:'Tavi',role:'Stories'},{id:'nix',name:'Nix',role:'Sounds'},{id:'pip',name:'Pip',role:'Motion'}];
export function ShowcaseAvatar({partner}){return <span className="showcase-avatar" aria-hidden="true" style={{backgroundPosition:`${SHOWCASE_CREW.findIndex(p=>p.id===partner)*100/3}% center`}}/>}
export function ShowcaseCrewCard({node}){return <>
 <div className="task-head"><ShowcaseAvatar partner={node.partner}/><div><strong>{SHOWCASE_CREW.find(p=>p.id===node.partner).name}</strong><span>{node.showcase.label}</span></div></div>
 <div className="showcase-output"><h3>{node.title}</h3>{node.format==='story'?<p>{node.text}</p>:<><div className="song-waveform" aria-hidden="true">{waveform.map((height,i)=><i key={i} style={{height:height+'%'}}/>)}</div><div className="song-caption"><span>A hello, made of music.</span><span>{node.duration}</span></div></>}</div>
 </>}
