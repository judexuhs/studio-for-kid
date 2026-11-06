import React from 'react';
import waveform from './nova-waveform.json';
import './crew-preview.css';
const crew=[
 {id:'moss',name:'Moss',action:'Draw my character'},
 {id:'tavi',name:'Tavi',action:'Tell my story'},
 {id:'nix',name:'Nix',action:'Make my soundtrack'},
 {id:'pip',name:'Pip',action:'Make it move'},
];
export default function CrewPreview(){
 return <div className="crew-lineup" id="crew">
  <div className="lineup-people" aria-label="Four creative helpers and what kids can make with them">{crew.map(({id,name,action},index)=><article className={`lineup-person ${id}`} key={id}>
   <div className="lineup-portrait">
    <span className="lineup-sprite" aria-hidden="true" style={{'--position':`${index*100/3}%`}}/>
    {id==='moss'&&<div className="crew-result crew-picture"><img src="/assets/moon-fox.png" alt="An orange fox astronaut character"/></div>}
    {id==='tavi'&&<div className="crew-result crew-story"><strong>The sneezing moon</strong><p>One sneeze.<br/>A sky full<br/>of stars.</p></div>}
    {id==='nix'&&<div className="crew-result crew-sound"><div className="hero-sound-wave" aria-hidden="true">{waveform.filter((_,i)=>i%2===0).map((height,i)=><i key={i} style={{height:height+'%'}}/>)}</div><span>Star song</span></div>}
    {id==='pip'&&<div className="crew-result crew-motion"><img src="/assets/moon-fox.png" alt="Nova posed for a zero-gravity animation"/></div>}
   </div>
   <h3 className="lineup-action">{action}</h3><p className="lineup-name">with {name}</p>
  </article>)}</div>
 </div>
}
