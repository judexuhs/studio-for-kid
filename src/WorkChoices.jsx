import React from 'react';
import {Check,BookOpen,Music} from 'lucide-react';
import {materialChoices} from './model';
import {artwork} from './StudioViews';
export function workLabel(board,node){
 const versions=board.nodes.filter(n=>n.kind==='result'&&n.source===node.source);
 return (node.title||node.text?.slice(0,25)||'Creation')+(node.kind==='result'&&versions.length>1?` · v${versions.findIndex(n=>n.id===node.id)+1}`:'');
}
export function WorkChoices({board,selectedIds=[],filter,onSelect,label='Choose a work'}){
 const current=materialChoices(board,{selectedIds}).filter(filter),ids=new Set(current.map(n=>n.id));
 const older=materialChoices(board,{includeHistory:true}).filter(n=>filter(n)&&!ids.has(n.id));
 function choices(items){return <div className="work-choice-grid">{items.map(n=><button key={n.id} aria-label={workLabel(board,n)} aria-pressed={selectedIds.includes(n.id)} onClick={()=>onSelect(n)}>{n.image?<img src={artwork(n)} alt=""/>:n.audio?<Music/>:<BookOpen/>}<span>{workLabel(board,n)}</span>{selectedIds.includes(n.id)&&<Check className="choice-check" size={18}/>}</button>)}</div>}
 return <div className="work-choices" aria-label={label}>{choices(current)}{older.length>0&&<details className="older-versions"><summary>Earlier versions ({older.length})</summary>{choices(older)}</details>}</div>;
}
export function MaterialOptions({board,node,filter}){
 const current=materialChoices(board,{selectedIds:[node.source]}).filter(filter),ids=new Set(current.map(n=>n.id));
 const older=materialChoices(board,{includeHistory:true}).filter(n=>filter(n)&&!ids.has(n.id));
 const options=items=>items.map(n=><option key={n.id} value={n.id}>{workLabel(board,n)}</option>);
 return <><optgroup label="Current works">{options(current)}</optgroup>{older.length>0&&<optgroup label="Earlier versions">{options(older)}</optgroup>}</>;
}
