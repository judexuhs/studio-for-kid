import math,wave,struct,json
from pathlib import Path
root=Path.cwd(); rate=24000; duration=8
notes=[(0.25,523.25),(0.85,659.25),(1.45,783.99),(2.25,1174.66),(3.1,1046.5),(4.05,783.99),(4.85,659.25),(5.6,523.25)]
samples=[]
for i in range(rate*duration):
 t=i/rate
 pad=sum(math.sin(2*math.pi*f*t) for f in [130.8128,195.9977,261.6256])*.035
 envelope=min(1,t/.4)*max(0,min(1,(duration-t)/1.5))
 bells=0
 for onset,f in notes:
  d=t-onset
  if d>=0:
   bells+=(math.sin(2*math.pi*f*d)+.2*math.sin(2*math.pi*2*f*d))*.19*math.exp(-1.5*d)*min(1,d/.012)
 samples.append((pad+bells)*envelope)
path=root/'public/assets/nova-star-song.wav'
with wave.open(str(path),'wb') as w:
 w.setparams((1,2,rate,0,'NONE','not compressed'));w.writeframes(b''.join(struct.pack('<h',round(s*32767)) for s in samples))
bins=[math.sqrt(sum(s*s for s in samples[i*len(samples)//40:(i+1)*len(samples)//40])/(len(samples)//40)) for i in range(40)]
(root/'src/nova-waveform.json').write_text(json.dumps([round(12+64*b/max(bins)) for b in bins]))
path.with_suffix('.wav.json').write_text(json.dumps({'source':'Original authored synthesis; no generative service','durationSeconds':8,'sampleRate':rate,'notesHz':notes,'description':'Pentatonic bell melody over a soft C/G pad, attack and release envelopes. Homepage sound sample only.'},indent=2))
