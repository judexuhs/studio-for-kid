import React,{useState} from 'react';
import Landing from './Landing';
import './hero-options.css';
const variants=[
 {id:'paper',name:'1 · 彩色剪纸',image:'/assets/hero-type/paper.svg'},
 {id:'handwritten',name:'2 · 彩色手写',image:'/assets/hero-type/handwritten.svg'},
 {id:'overprint',name:'3 · 印刷叠色',image:'/assets/hero-type/overprint.svg'}
];
export default function HeroOptions(){
 const [selected,setSelected]=useState(()=>variants.find(v=>v.id===new URLSearchParams(location.search).get('v'))||variants[0]);
 function choose(variant){setSelected(variant);history.replaceState(null,'','/hero-options?v='+variant.id)}
 return <div className="hero-options-page"><aside className="hero-compare" aria-label="对比三个 create 设计方案"><div className="hero-compare-caption"><span>对比 create 的设计</span><a href="/">查看原首页</a></div><div className="hero-compare-choices">{variants.map(v=><button key={v.id} type="button" aria-pressed={selected.id===v.id} onClick={()=>choose(v)}><img src={v.image} alt=""/><span>{v.name}</span></button>)}</div></aside><Landing heroWordmark={selected.image}/></div>
}
