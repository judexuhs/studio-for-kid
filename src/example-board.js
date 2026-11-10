// Authored sample. Loading never sends a generation request or touches saved work.
export function exampleBoard(assets,id=crypto.randomUUID()){
 const board={schema:2,id,name:'Nova & the star song',example:true,unlocked:true,view:{x:40,y:100,z:.65},nodes:[{id:'idea',kind:'note',title:'What if…',text:'A tiny fox heard a whale singing in space?\n\nAn example by Pebli. Make it your own!',x:40,y:80}]};
 function work(key,partner,source,title,text,payload,x,y,extra={}){
  const task={id:key+'-task',kind:'task',inline:true,partner,source,title,text,x,y,activeResultId:key,...extra};
  const input=board.nodes.find(n=>n.id===source);
  const result={...(input&&['moss','pip'].includes(partner)?{input:{id:input.id,kind:input.kind,title:input.title,...(input.image?{image:input.image}:{}),...(input.text?{text:input.text}:{})}}:{}),id:key,kind:'result',source:task.id,title,instruction:text,x,y,live:true,accepted:true,partner,...payload};
  board.nodes.push(task,result);return result;
 }
 work('nova','moss','idea','Meet Nova','A tiny orange fox astronaut with a cream and sage spacesuit, bubble helmet and golden flag.',{image:assets.character,creationType:'character'},440,80);
 work('world','moss','nova','A whale-sized hello','Nova meets Bloop, a friendly blue space whale whose song lights the stars above a lavender moon.',{image:assets.world,creationType:'world'},840,80);
 const scene=board.nodes.find(n=>n.id==='world');
 const firstScene={...scene,id:'world-first',title:'A quiet space hello',image:assets.firstWorld,instruction:'Nova meets a friendly whale among the stars.',accepted:false};
 board.nodes.splice(board.nodes.indexOf(scene),0,firstScene);
 scene.input={id:firstScene.id,kind:'result',title:firstScene.title,image:firstScene.image};
 scene.preserve='Keep Nova, the whale and the lavender moon. Add golden star-notes between them.';
 work('story','tavi','world','The missing note','Tell a warm, funny story about Nova helping Bloop find the last note of the star song.',{text:assets.story,storyFormat:'story'},1240,80,{storyFormat:'story'});
 work('stickers','moss','nova','Pocket-sized adventures','Make six adorable stickers of Nova and Bloop: waving, hugging, star cocoa, floating, sleeping and dancing.',{image:assets.stickers,creationType:'stickers'},440,800,{operation:'stickers'});
 work('music','nix','world','Bloop’s star song','A playful, cozy space soundtrack with celesta, marimba, pizzicato strings and sparkling bells.',{audio:assets.audio,instrumental:true,lyrics:''},840,800,{instrumental:true,lyrics:''});
 work('motion','pip','nova','A little moon dance','Give Nova a gentle zero-gravity float.',{image:assets.character,move:'float'},1240,800,{move:'float'});
 work('comic','moss','story','The tiniest big adventure','Tell the missing-note story as a three-panel comic: meeting Bloop, finding the squeak, sharing star cocoa. No text.',{image:assets.comic,creationType:'comic'},1640,80);
 board.world={characterId:'nova',characterName:'Nova',characterBio:'A pocket-sized explorer with a big heart and a very squeaky singing voice.',setting:'Lavender moons, warm star cocoa and friendly space whales whose songs light the stars.'};
 board.finishedId='motion';
 board.presentation={ids:['world','story','comic','stickers','motion'],coverId:'world',musicId:'music',includeJourney:true};
 return board;
}
async function embeddedMedia(url){
 const response=await fetch(url);if(!response.ok)throw Error('The example could not load. Please try again.');
 const blob=await response.blob();
 return new Promise((resolve,reject)=>{const reader=new FileReader();reader.onload=()=>resolve(reader.result);reader.onerror=()=>reject(Error('The example could not load.'));reader.readAsDataURL(blob)});
}
export async function loadExample(){
 const [character,world,stickers,audio,comic,firstWorld,response]=await Promise.all([
  embeddedMedia('/assets/moon-fox.png'),embeddedMedia('/assets/nova-song-world.png'),embeddedMedia('/assets/example/nova-stickers.webp'),embeddedMedia('/assets/example/nova-star-song.mp3'),embeddedMedia('/assets/example/nova-comic.webp'),embeddedMedia('/assets/nova-world.png'),fetch('/assets/example/nova-story.json')
 ]);
 if(!response.ok)throw Error('The example story could not load. Please try again.');
 const {text:story}=await response.json();
 return exampleBoard({character,world,stickers,audio,story,comic,firstWorld});
}

export function exampleView(width,height){
 if(width<600){const z=Math.min(.9,(width-40)/320);return {z,x:width/2-600*z,y:110-80*z}}
 const z=Math.max(.15,Math.min(.7,(width-80)/1960,(height-160)/1320));
 return {z,x:(width-1960*z)/2-40*z,y:80-80*z};
}
