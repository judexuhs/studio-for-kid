export const IMAGE_STYLES = {
 illustration: {label:'Illustration · default',description:'A clean matte 2D illustration with confident hand-drawn shapes, a limited balanced color palette, subtle paper texture and soft flat shading. Expressive, playful character design; simple intentional backgrounds. No glossy plastic surfaces, airbrushed skin, cinematic glow or 3D rendering.'},
 pencil: {label:'Colored pencil',description:'Colored-pencil illustration on warm white paper. Visible pencil strokes, light layered colors, lively imperfect outlines and plenty of breathing room. Flat hand-drawn forms, no glossy highlights or 3D rendering.'},
 paper: {label:'Paper cutout',description:'Hand-cut colored paper collage, bold simple silhouettes, a small harmonious palette and lightly textured matte paper. Slight paper-layer shadows, playful irregular edges, uncluttered composition. No plastic sheen or photorealistic characters.'},
 pixel: {label:'Pixel art',description:'Crisp pixel art with a small deliberate color palette, clear silhouettes, expressive simple features and a clean background. Hard pixel edges and restrained shading, no blur, glow or smooth 3D rendering.'},
 reference: {label:'Keep original style',description:'Preserve the reference picture’s visual style, materials, linework and palette.'},
};
export function imageStyleSettings(node={},hasReference=false){
 const imageStyle=Object.hasOwn(IMAGE_STYLES,node.imageStyle)?node.imageStyle:hasReference?'reference':'illustration';
 return {imageStyle,styleDescription:typeof node.styleDescription==='string'?node.styleDescription:IMAGE_STYLES[imageStyle].description};
}
