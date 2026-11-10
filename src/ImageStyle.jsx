import React,{useId} from 'react';
import {IMAGE_STYLES,imageStyleSettings} from './image-styles';
export function ImageStyle({node,hasReference=false,onChange}){
 const id=useId(),value=imageStyleSettings(node,hasReference);
 return <div className="image-style"><label htmlFor={id}>Style</label><select id={id} aria-label="Picture style" value={value.imageStyle} onChange={e=>onChange({imageStyle:e.target.value,styleDescription:IMAGE_STYLES[e.target.value].description})}>{Object.entries(IMAGE_STYLES).filter(([key])=>hasReference||key!=='reference').map(([key,style])=><option key={key} value={key}>{style.label}</option>)}</select><details><summary>Adjust style</summary><textarea aria-label="Style description" maxLength={500} value={value.styleDescription} onChange={e=>onChange({...value,styleDescription:e.target.value})}/></details></div>;
}
