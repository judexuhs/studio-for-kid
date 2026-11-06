export function renderStrokes(context,strokes,width=800,height=520){
 context.clearRect(0,0,width,height);
 for(const stroke of strokes){
  context.save();context.globalCompositeOperation=stroke.tool==='eraser'?'destination-out':'source-over';
  context.strokeStyle=stroke.color;context.fillStyle=stroke.color;context.lineWidth=stroke.width;context.lineCap='round';context.lineJoin='round';
  const first=stroke.points[0];context.beginPath();
  if(stroke.points.length===1){context.arc(first.x*width,first.y*height,stroke.width/2,0,Math.PI*2);context.fill()}
  else{context.moveTo(first.x*width,first.y*height);for(const point of stroke.points.slice(1))context.lineTo(point.x*width,point.y*height);context.stroke()}
  context.restore();
 }
}
function loadImage(source){return new Promise((resolve,reject)=>{const image=new Image();image.onload=()=>resolve(image);image.onerror=()=>reject(Error('This picture could not open. Try again.'));image.src=source==='asset:fox'?'/assets/moon-fox.png':source})}
export async function exportDrawing(layer,drawing){
 const frozen=document.createElement('canvas');frozen.width=800;frozen.height=520;frozen.getContext('2d').drawImage(layer,0,0);
 const canvas=document.createElement('canvas');canvas.width=800;canvas.height=520;const ctx=canvas.getContext('2d');
 ctx.fillStyle='#ffffff';ctx.fillRect(0,0,800,520);
 if(drawing.baseImage){const image=await loadImage(drawing.baseImage),scale=Math.min(800/image.width,520/image.height);ctx.drawImage(image,(800-image.width*scale)/2,(520-image.height*scale)/2,image.width*scale,image.height*scale)}
 ctx.drawImage(frozen,0,0);return canvas.toDataURL('image/png');
}
export async function createEditGuide(source,region){
 const image=await loadImage(source),scale=Math.min(1,768/image.width,768/image.height),canvas=document.createElement('canvas');
 canvas.width=Math.round(image.width*scale);canvas.height=Math.round(image.height*scale);const ctx=canvas.getContext('2d');ctx.drawImage(image,0,0,canvas.width,canvas.height);
 const cx=(region.x+region.width/2)*canvas.width,cy=(region.y+region.height/2)*canvas.height;
 for(const [color,width] of [['#ffffff',8],['#cb334e',4]]){ctx.beginPath();ctx.ellipse(cx,cy,region.width*canvas.width/2,region.height*canvas.height/2,0,0,Math.PI*2);ctx.strokeStyle=color;ctx.lineWidth=width;ctx.stroke()}
 return canvas.toDataURL('image/png');
}
export function trapDialogKeys(event,onClose){
 if(event.key==='Escape'){event.preventDefault();event.stopPropagation();onClose();return}
 if(event.key!=='Tab')return;
 const controls=[...event.currentTarget.querySelectorAll('button:not(:disabled),input:not(:disabled),textarea:not(:disabled),select:not(:disabled),summary,a[href],audio[controls],[tabindex="0"]')].filter(el=>el.getClientRects().length&&!el.closest('[inert]'));
 const first=controls[0],last=controls.at(-1);if(!first)return;
 if(event.shiftKey&&document.activeElement===first){event.preventDefault();last.focus()}else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first.focus()}
}
