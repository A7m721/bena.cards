/* Sound engine. Every sound is synthesised with Web Audio (no audio files needed).
   Layered tones, filtered noise and a master compressor make them softer than plain beeps. */
let AC=null,MST=null,SND=true,NB=null;
function ac(){
  try{
    if(!AC){AC=new (window.AudioContext||window.webkitAudioContext)();MST=AC.createGain();MST.gain.value=.9;
      const cmp=AC.createDynamicsCompressor();MST.connect(cmp);cmp.connect(AC.destination)}
    if(AC.state==='suspended')AC.resume();
  }catch(e){}
  return AC;
}
if(document.addEventListener)['pointerdown','keydown'].forEach(ev=>document.addEventListener(ev,()=>{if(SND)ac()}));

function tone(f,t0,d,type,vol,f2,a){
  const c=AC;if(!c||!MST)return;const n=c.currentTime+t0,o=c.createOscillator(),g=c.createGain();a=a||.006;
  o.type=type||'sine';o.frequency.setValueAtTime(f,n);if(f2)o.frequency.exponentialRampToValueAtTime(f2,n+d);
  g.gain.setValueAtTime(.0001,n);g.gain.exponentialRampToValueAtTime(vol||.1,n+a);g.gain.exponentialRampToValueAtTime(.0001,n+a+d);
  o.connect(g);g.connect(MST);o.start(n);o.stop(n+a+d+.05);
}
function noise(t0,d,vol,type,f,f2,q){
  const c=AC;if(!c||!MST)return;
  if(!NB){NB=c.createBuffer(1,c.sampleRate,c.sampleRate);const a=NB.getChannelData(0);for(let i=0;i<a.length;i++)a[i]=Math.random()*2-1}
  const n=c.currentTime+t0,s=c.createBufferSource(),fl=c.createBiquadFilter(),g=c.createGain();
  s.buffer=NB;s.loop=true;fl.type=type||'bandpass';fl.Q.value=q||1;fl.frequency.setValueAtTime(f||2000,n);if(f2)fl.frequency.exponentialRampToValueAtTime(f2,n+d);
  g.gain.setValueAtTime(.0001,n);g.gain.exponentialRampToValueAtTime(vol||.1,n+.01);g.gain.exponentialRampToValueAtTime(.0001,n+d);
  s.connect(fl);fl.connect(g);g.connect(MST);s.start(n);s.stop(n+d+.05);
}
const SOUNDS={
  flip:()=>{noise(0,.16,.16,'bandpass',700,4200,.8);tone(380,0,.1,'triangle',.05,760)},
  clap:()=>{for(let i=0;i<18;i++)noise(i*.055+Math.random()*.035,.07,.07,'bandpass',1800+Math.random()*2400,0,1.2);noise(.2,.7,.035,'lowpass',2500,600)},
  drum:()=>{tone(140,0,.32,'sine',.5,40);tone(200,.3,.26,'sine',.38,85);noise(.3,.2,.22,'bandpass',1800,0,.7);noise(.55,.45,.07,'highpass',5000)},
  bell:()=>{tone(1046,0,.55,'sine',.1);tone(2093,0,.35,'sine',.03);tone(1318,.15,.65,'sine',.09);tone(2637,.15,.4,'sine',.03)},
  magic:()=>{[523,659,784,1047,1319,1568].forEach((f,i)=>{tone(f,i*.07,.32,'triangle',.06);tone(f*2,i*.07+.02,.18,'sine',.02)})},
  pop:()=>tone(520,0,.12,'sine',.1,1040),
  level:()=>{[[523,659,784],[659,784,1047],[784,1047,1319]].forEach((ch,i)=>ch.forEach(f=>{tone(f,i*.18,.34,'triangle',.05);tone(f/2,i*.18,.34,'sine',.04)}))},
  tick:()=>tone(1800,0,.04,'square',.035),
  buzz:()=>tone(110,0,.35,'sawtooth',.07),
  ding:()=>{tone(880,0,.25,'sine',.08);tone(1320,.08,.3,'sine',.06)}
};
const play=n=>{if(SND&&AC&&SOUNDS[n]){try{SOUNDS[n]()}catch(e){}}};
