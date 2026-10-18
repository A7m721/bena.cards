/* Small helpers: DOM, seeded random, gender helpers, toast, clipboard. */
const $=id=>document.getElementById(id);
const rng=a=>()=>{a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296};
const sh=(n,sd)=>{const a=[...Array(n).keys()],r=rng(sd);for(let k=n-1;k>0;k--){const j=Math.floor(r()*(k+1));[a[k],a[j]]=[a[j],a[k]]}return a};
const hash=s=>{let h=7;for(const ch of s)h=(h*31+ch.charCodeAt(0))|0;return Math.abs(h)};
const rnd=()=>Math.floor(Math.random()*1e9);

/* ---- Arabic name -> boy/girl guess, and feminine forms of questions ---- */
const nz=w=>w.replace(/[\u064B-\u0652]/g,'').replace(/[أإآ]/g,'ا').replace(/ة/g,'ه').replace(/ى/g,'ي').trim();
const FS=new Set(FN.map(nz)),MSET=new Set(MN.map(nz));
const FSEN=new Set(FN_EN.filter(x=>x!=='sam'));
function gGuess(n){const raw=String(n||'').trim().split(/\s+/)[0]||'';if(/^[A-Za-z]+$/.test(raw))return FSEN.has(raw.toLowerCase())?'f':'m';const w=nz(raw);if(!w)return'm';if(FS.has(w))return'f';if(MSET.has(w))return'm';return w.endsWith('ه')?'f':'m'}
const gen=i=>R?(R.gd&&R.gd[i]==='f'?'f':'m'):(GD[i]==='f'?'f':'m');
const G=(i,m,f)=>gen(i)==='f'?f:m;
function fem(t){FP.forEach(([a,b])=>{t=t.split(a).join(b)});return t.split(/([^\u0621-\u0652]+)/).map(w=>FM[w]||w).join('')}
const fq=t=>(LANG==='ar'&&gen(S.turn)==='f')?fem(t):t;
const txt=o=>LANG==='en'?o.en:o.ar;          /* pick the text of a bilingual item */

function toast(msg){const t=document.createElement('div');t.className='toast';t.textContent=msg;t.setAttribute('role','status');document.body.appendChild(t);setTimeout(()=>t.remove(),2600)}
async function copyText(t){try{await navigator.clipboard.writeText(t);return true}catch(e){try{const ta=document.createElement('textarea');ta.value=t;document.body.appendChild(ta);ta.select();const ok=document.execCommand('copy');ta.remove();return !!ok}catch(x){return false}}}
function rain(){for(let k=0;k<32;k++){const b=document.createElement('span');b.className='bit';b.textContent=['🎉','💙','⭐','🩷','✨'][k%5];b.style.left=Math.random()*100+'%';b.style.animationDuration=(3+Math.random()*3)+'s';b.style.animationDelay=Math.random()*1.5+'s';document.body.appendChild(b);setTimeout(()=>b.remove(),8000)}}
function floatE(e){const s=document.createElement('span');s.className='fl';s.textContent=e;s.style.left=(15+Math.random()*70)+'%';document.body.appendChild(s);setTimeout(()=>s.remove(),2200)}
