// Public, authored content only. Never hydrate this board from browser projects.
export function showcaseBoard(){
 return {schema:2,id:'homepage-space-club',name:'Nova’s space adventure',unlocked:true,view:{x:100,y:16,z:1},nodes:[
  {id:'idea',kind:'note',x:0,y:150,showcase:{width:185,anchor:85},title:'My what-if',text:'What if a fox\nheard a whale\nsing in space?'},
  {id:'character-task',kind:'task',partner:'moss',source:'idea',x:210,y:0,showcase:{width:220,height:76,anchor:38,label:'Draw my explorer'},text:'A tiny fox astronaut with a golden flag.'},
  {id:'nova',kind:'result',source:'character-task',x:210,y:100,showcase:{width:220,height:245,anchor:123,vertical:true},title:'Meet Nova',image:'/assets/moon-fox.png',accepted:true,live:true,format:'character'},
  {id:'world-task',kind:'task',partner:'moss',source:'nova',x:480,y:0,showcase:{width:420,height:76,anchor:38,label:'Imagine their world'},text:'Keep Nova. Add a friendly space whale with a song that makes stars glow.'},
  {id:'world',kind:'result',source:'world-task',x:480,y:100,showcase:{width:420,height:323,anchor:160,vertical:true},title:'The whale’s hello',image:'/assets/nova-song-world.png',accepted:true,live:true,format:'world'},
  {id:'story',kind:'showcase-story',partner:'tavi',source:'world',x:960,y:0,showcase:{width:280,anchor:100,label:'Tell their story'},format:'story',title:'A song in the stars',text:'Nova thought space was silent. Then a whale sang a note that made the stars glow. “You found my song,” it whispered.'},
  {id:'sound',kind:'showcase-sound',partner:'nix',source:'world',x:960,y:280,showcase:{width:280,anchor:95,label:'Give it a sound'},format:'sound',title:'The star song',audio:'/assets/nova-star-song.wav',duration:'0:08'},
  {id:'motion-task',kind:'task',partner:'pip',source:'nova',x:210,y:395,showcase:{width:220,height:76,anchor:38,vertical:true,label:'Make Nova float'},text:'Give Nova a gentle zero-gravity float.',move:'float'},
  {id:'moving',kind:'result',source:'motion-task',x:480,y:455,showcase:{width:420,anchor:70},title:'A little moon dance',image:'/assets/moon-fox.png',accepted:true,live:true,move:'float',format:'motion'}
 ]};
}
