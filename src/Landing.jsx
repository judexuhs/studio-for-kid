import React,{useState} from 'react';
import {ArrowRight,Play,Pause,X,Menu,Check,Pencil,ChevronDown,MousePointer2,Plus,Undo2,Paintbrush} from 'lucide-react';
import './landing.css';
import './product-story.css';
import CrewPreview from './CrewPreview';
import {ProductCanvas,CreationGallery,CreationGoals} from './ProductShowcase';
import './home-refresh.css';
const Start=({children='Start creating'})=><a className="home-cta" href="/studio?new=1">{children}<ArrowRight size={19}/></a>;
function Logo(){return <a className="home-logo" href="/" aria-label="Pebli home"><span className="brand-mark"><span/><span/><span/></span>Pebli</a>}
const faqs=[
 ['Who is Pebli for?','Pebli is made for curious creators aged 10–12. Children direct AI partners, explore their own ideas, and decide what to keep.'],
 ['Do we need an account?','No. Open a canvas and start creating.'],
 ['How does AI take part?','Moss makes and revises pictures, Tavi writes stories, Nix makes music, and Pip adds playful movements. The child chooses the idea, asks for changes, and keeps the result.'],
 ['Can we keep our creations?','Yes. Download pictures, stories, a character card, an MP3 song, a world page or a canvas backup. Canvases are saved in this browser on this device.'],
 ['Where do ideas and pictures go?','Canvases stay in this browser. Instructions, reference pictures and lyrics go through our server to the generation provider when you create. Server copies expire after seven days. Keep personal information out of your creations.']
];
export default function Landing({heroWordmark}={}){
 const [menu,setMenu]=useState(false);
 return <div className="pebli-home"><a className="home-skip" href="#possibilities">Skip to what you can make</a><header className="home-nav"><Logo/><nav className={menu?'is-open':''} aria-label="Main navigation" id="home-navigation">{[['/how-it-works','How it works'],['/crew','Meet the crew'],['/ideas','Things to make'],['/for-parents','For parents']].map(([href,label])=><a key={href} href={href} onClick={()=>setMenu(false)}>{label}</a>)}</nav><Start>Let’s create</Start><button className="mobile-nav-toggle" aria-expanded={menu} aria-controls="home-navigation" aria-label={menu?'Close menu':'Open menu'} onClick={()=>setMenu(!menu)}>{menu?<X/>:<Menu/>}</button></header><main>
 <section className="home-hero"><div className="hero-copy"><h1 aria-label="Where kids learn to create with AI.">Where kids learn to<br/>{heroWordmark?<img className="hero-wordmark" src={heroWordmark} alt="" aria-hidden="true"/>:<span className="hero-create"><span>c</span><span>r</span><span>e</span><span>a</span><span>t</span><span>e</span></span>} with AI.</h1><h2 className="hero-purpose">A safe AI studio that keeps kids thinking.</h2><div className="hero-actions"><Start/></div></div><CrewPreview/></section>
 <ProductCanvas/><CreationGallery/><CreationGoals/>
 <section className="family-notes" id="grown-ups"><div className="family-intro"><h2>A little space<br/>to grow big ideas.</h2><p>Designed for kids aged 10–12. They bring the ideas, make the choices, and decide what’s worth keeping.</p></div><div className="family-questions"><h3>A few things for grown-ups</h3>{faqs.map(([q,a])=><details key={q}><summary>{q}<Plus size={18}/></summary><p>{a}</p></details>)}</div></section>
 </main><footer className="home-footer"><div><Logo/><p>A little space for big imaginations.</p></div><nav aria-label="Footer navigation"><a href="/ideas">Things to make</a><a href="/how-it-works">How it works</a><a href="/crew">Meet the crew</a><a href="/for-parents">For parents</a><a href="/help">Help</a></nav><span>Made for the what-if kids.</span></footer></div>
}
