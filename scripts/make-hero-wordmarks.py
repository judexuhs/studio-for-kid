"""Build three static, OFL-font-derived vector wordmarks. Requires fonttools and uharfbuzz."""
from pathlib import Path
import json
import uharfbuzz as hb
from fontTools.ttLib import TTFont
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.boundsPen import BoundsPen
from fontTools.pens.transformPen import TransformPen

ROOT=Path(__file__).resolve().parent.parent
OUT=ROOT/'public/assets/hero-type';OUT.mkdir(parents=True,exist_ok=True)

def outlines(fontpath):
 font=TTFont(fontpath);glyphs=font.getGlyphSet();data=Path(fontpath).read_bytes()
 face=hb.Face(data);hbfont=hb.Font(face);hbfont.scale=(face.upem,face.upem)
 buffer=hb.Buffer();buffer.add_str('create');buffer.guess_segment_properties();hb.shape(hbfont,buffer)
 positions=[];x=y=0;bounds=BoundsPen(glyphs)
 for info,pos in zip(buffer.glyph_infos,buffer.glyph_positions):
  name=font.getGlyphName(info.codepoint);matrix=(1,0,0,1,x+pos.x_offset,y+pos.y_offset)
  glyphs[name].draw(TransformPen(bounds,matrix));positions.append((name,x+pos.x_offset,y+pos.y_offset));x+=pos.x_advance;y+=pos.y_advance
 xmin,ymin,xmax,ymax=bounds.bounds;s=min(440/(xmax-xmin),116/(ymax-ymin));w=(xmax-xmin)*s;h=(ymax-ymin)*s;left=(480-w)/2;top=(150-h)/2
 paths=[]
 for name,x,y in positions:
  matrix=(s,0,0,-s,left+(x-xmin)*s,top+(ymax-y)*s)
  pen=SVGPathPen(glyphs);glyphs[name].draw(TransformPen(pen,matrix))
  b=BoundsPen(glyphs);glyphs[name].draw(TransformPen(b,matrix))
  paths.append((pen.getCommands(),b.bounds))
 return paths

def svg(body,desc):
 return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 480 150" role="img" aria-label="create"><title>create</title><desc>'+desc+'</desc>'+body+'</svg>\n'

paper=outlines(ROOT/'design/hero-type/LilitaOne-Regular.ttf')
colors=['#2499bd','#e268a0','#24a080','#339cbd','#23a080','#e268a0'];angles=[-4,0,0,3,0,-3]
parts=['<defs><filter id="paper-depth" x="-20%" y="-20%" width="140%" height="150%"><feDropShadow dx="0" dy="2" stdDeviation="1.3" flood-color="#274b52" flood-opacity=".13"/></filter></defs>']
for i,(path,b) in enumerate(paper):
 x0,y0,x1,y1=b;cx=(x0+x1)/2;cy=(y0+y1)/2
 parts.append(f'<g transform="rotate({angles[i]} {cx} {cy})" filter="url(#paper-depth)"><path d="{path}" fill="{colors[i]}"/>')
 if i in [0,3,5]:
  parts.append(f'<clipPath id="paper-{i}"><path d="{path}"/></clipPath><path clip-path="url(#paper-{i})" d="M {x1-18} {y0} L {x1+2} {y0} L {x1+2} {y0+23} Z" fill="#fff3b6" opacity=".8"/>')
 parts.append('</g>')
(OUT/'paper.svg').write_text(svg(''.join(parts),'Paper-cut lettering derived from Lilita One, with soft edge depth and small folded corners.'))

hand=outlines(ROOT/'design/hero-type/Pacifico-Regular.ttf');handpath=''.join(f'<path d="{d}"/>' for d,b in hand)
handbody='<defs><clipPath id="hand">'+handpath+'</clipPath></defs><g clip-path="url(#hand)"><path fill="#269bc1" d="M 0 0 H 480 V 150 H 0 Z"/><path fill="#e268a0" d="M 170 0 H 350 L 300 150 H 125 Z"/><path fill="#26a586" d="M 350 0 H 480 V 150 H 300 Z"/></g>'
(OUT/'handwritten.svg').write_text(svg(handbody,'Connected Pacifico brush lettering, colored in three broad static ink regions.'))

printed=outlines(ROOT/'public/assets/font-4.ttf');printpath=''.join(f'<path d="{d}"/>' for d,b in printed)
printbody='<defs><clipPath id="print">'+printpath+'</clipPath></defs><g clip-path="url(#print)" style="isolation:isolate"><path fill="#269bc1" d="M 0 0 H 480 V 150 H 0 Z"/><ellipse cx="148" cy="126" rx="180" ry="105" fill="#ef80b3" style="mix-blend-mode:multiply"/><path d="M 270 -20 L 450 -20 L 350 180 L 170 180 Z" fill="#78d2ae" style="mix-blend-mode:multiply"/><ellipse cx="455" cy="-4" rx="118" ry="103" fill="#f5d772" style="mix-blend-mode:multiply"/></g>'
(OUT/'overprint.svg').write_text(svg(printbody,'Gabarito ExtraBold outlines with large overlapping spot-color shapes, rather than individually colored letters.'))
(OUT/'provenance.json').write_text(json.dumps({'method':'Font-derived SVG outlines, shaped with HarfBuzz; deterministic vector typography, no raster model generation.','generator':'scripts/make-hero-wordmarks.py','word':'create','sources':{'paper':'Google Fonts / Lilita One, SIL OFL 1.1','handwritten':'Google Fonts / Pacifico, SIL OFL 1.1','overprint':'Existing Gabarito ExtraBold, public/assets/font-4.ttf'},'fontSources':'design/hero-type/','variants':['paper.svg','handwritten.svg','overprint.svg']},indent=2)+'\n')
print('Generated three vector wordmarks.')
