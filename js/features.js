/* Extras: themes, language switch, drawer, intro, share, install, awards, memory card, notifications. */
const RX=['😂','😮','💖','👏'];
const THEMES=['classic','dark','light'],THEME_COLOR={classic:'#3b5bfd',dark:'#0f1030',light:'#eceeff'};
let THEME='classic',rxT=0,MEMO_BLOB=null,MEMO_URL='';

/* ---- theme & language ---- */
function applyTheme(){
  const de=document.documentElement;if(THEME==='classic')delete de.dataset.theme;else de.dataset.theme=THEME;
  const m=document.querySelector('meta[name="theme-color"]');if(m)m.setAttribute('content',THEME_COLOR[THEME]);
}
function cycleTheme(){THEME=THEMES[(THEMES.indexOf(THEME)+1)%THEMES.length];try{localStorage.setItem('bena_theme',THEME)}catch(e){}applyTheme();render()}
function setLang(l){LANG=l;try{localStorage.setItem('bena_lang',l)}catch(e){}applyLang();buildChips();render()}

/* ---- drawer & modals ---- */
function openD(){$('drawer').hidden=false;$('scrim').hidden=false;$('menu').setAttribute('aria-expanded','true');if($('dx').focus)$('dx').focus()}
function closeD(){$('drawer').hidden=true;$('scrim').hidden=true;$('menu').setAttribute('aria-expanded','false')}
function showIntro(){$('intro').hidden=false;if($('ix').focus)$('ix').focus()}
function closeIntro(){$('intro').hidden=true;try{localStorage.setItem('bena_intro','1')}catch(e){}}

/* ---- "your turn" notification (two-place play) ---- */
function ping(){play('bell');try{if(navigator.vibrate)navigator.vibrate([150,80,150])}catch(e){}if(document.hidden)document.title=T('turnTitle')}

/* ---- share / invite ---- */
async function shareInvite(){
  const url=location.href.split('#')[0],text=T('shareText');
  if(navigator.share){try{await navigator.share({title:T('shareTitle'),text,url});return}catch(e){if(e&&e.name==='AbortError')return}}
  toast((await copyText(text+' '+url))?T('linkCopied'):T('copyFail'));
}

/* ---- light achievements (no scores) ---- */
function awardsList(){
  const nm=names().map(plain),st=[0,1].map(()=>({talk:0,fo:0,sx:0,to:0})),out=[];
  Object.values(LOG).forEach(e=>{const s=e.seat===1?1:0;if(e.sx)st[s].sx++;else if(e.f){st[s].fo++;if(e.tf)st[s].to++}else st[s].talk+=(e.a||'').length});
  const lead=(a,b,min,title)=>{if(a===b||Math.max(a,b)<min)return;out.push(title+': '+(a>b?nm[0]:nm[1]))};
  lead(st[0].talk,st[1].talk,20,T('aw_talk'));lead(st[0].fo,st[1].fo,1,T('aw_forfeit'));lead(st[0].sx,st[1].sx,1,T('aw_skip'));lead(st[0].to,st[1].to,1,T('aw_timeout'));
  lead(RXC[0],RXC[1],3,T('aw_react'));
  if(!out.length)out.push(T('aw_none'));
  return out;
}
function renderAwards(){const box=$('awlist');box.innerHTML='';awardsList().forEach(t=>{const d=document.createElement('div');d.className='aw';d.textContent=t;box.appendChild(d)})}

/* ---- memory card (an image players can save or share) ---- */
function rrect(x,px,py,w,h,r){x.beginPath();x.moveTo(px+r,py);x.arcTo(px+w,py,px+w,py+h,r);x.arcTo(px+w,py+h,px,py+h,r);x.arcTo(px,py+h,px,py,r);x.arcTo(px,py,px+w,py,r);x.closePath()}
function wrapLines(x,t,maxW){const words=t.split(' '),lines=[];let l='';for(const w of words){const test=l?l+' '+w:w;if(x.measureText(test).width>maxW&&l){lines.push(l);l=w}else l=test}if(l)lines.push(l);return lines}
function fitText(x,t,maxW){if(x.measureText(t).width<=maxW)return t;while(t.length>1&&x.measureText(t+'…').width>maxW)t=t.slice(0,-1);return t+'…'}
async function makeMemoCanvas(){
  const W=1080,H=1350,cx=W/2-10,c=document.createElement('canvas');c.width=W;c.height=H;const x=c.getContext('2d'),ink='#14143a';
  try{await Promise.all([document.fonts.load('400 80px Lalezar'),document.fonts.load('700 40px Tajawal')])}catch(e){}
  x.direction=LANG==='ar'?'rtl':'ltr';x.textAlign='center';x.textBaseline='middle';
  x.fillStyle='#3b5bfd';x.fillRect(0,0,W,H);x.fillStyle='rgba(255,255,255,.14)';
  for(let yy=20;yy<H;yy+=40)for(let xx=20;xx<W;xx+=40){x.beginPath();x.arc(xx,yy,3,0,6.3);x.fill()}
  rrect(x,90,120,W-160,H-210,56);x.fillStyle=ink;x.fill();
  rrect(x,70,100,W-160,H-210,56);x.fillStyle='#fffdf5';x.fill();x.lineWidth=8;x.strokeStyle=ink;x.stroke();
  x.fillStyle=ink;x.font='400 96px Lalezar, Tajawal, sans-serif';x.fillText(T('memoName'),cx,225);
  x.font='700 34px Tajawal, sans-serif';x.fillStyle='#55557a';
  x.fillText(new Date().toLocaleDateString(LANG==='ar'?'ar-EG':'en-GB',{day:'numeric',month:'long',year:'numeric'}),cx,300);
  const nm=names().map(plain);x.fillStyle=ink;
  [[0,cx-230],[1,cx+230]].forEach(([s,px])=>{
    x.font='130px "Segoe UI Emoji","Apple Color Emoji","Noto Color Emoji",sans-serif';x.fillText(gen(s)==='f'?'👧':'👦',px,430);
    x.font='700 50px Tajawal, sans-serif';x.fillText(fitText(x,nm[s],380),px,545);
  });
  x.font='80px "Segoe UI Emoji","Apple Color Emoji","Noto Color Emoji",sans-serif';x.fillText('💙',cx,440);
  const it=itemsOf().slice(0,S.i),jk=it.filter(i=>i.j!==undefined).length,ent=Object.values(LOG);
  const stats=[[it.length-jk,T('memoCards')],[ent.filter(e=>!e.f&&!e.sx).length,T('memoAns')],[ent.filter(e=>e.f).length,T('memoFor')],[jk,T('memoMagic')]];
  stats.forEach(([n,l],k)=>{const px=cx+(k%2?215:-215),py=700+Math.floor(k/2)*150;
    rrect(x,px-190,py-60,380,120,28);x.fillStyle='#ffd93d';x.fill();x.lineWidth=5;x.strokeStyle=ink;x.stroke();
    x.fillStyle=ink;x.font='400 64px Lalezar, Tajawal, sans-serif';x.fillText(String(n),px,py-12);x.font='700 28px Tajawal, sans-serif';x.fillText(l,px,py+34)});
  x.font='400 40px Lalezar, Tajawal, sans-serif';x.fillText(T('awardsT'),cx,1020);
  x.font='700 34px Tajawal, sans-serif';let y=1075;
  awardsList().slice(0,3).forEach(t=>{wrapLines(x,t,820).slice(0,2).forEach(l=>{x.fillText(l,cx,y);y+=46})});
  x.font='700 26px Tajawal, sans-serif';x.fillStyle='#55557a';x.fillText(T('memoMade'),cx,1210);
  return c;
}
async function openMemo(){
  try{
    const cv=await makeMemoCanvas();
    const blob=await new Promise(r=>cv.toBlob(r,'image/png'));if(!blob)throw 0;
    if(MEMO_URL)URL.revokeObjectURL(MEMO_URL);MEMO_BLOB=blob;MEMO_URL=URL.createObjectURL(blob);
    $('memoimg').src=MEMO_URL;$('memo').hidden=false;
  }catch(e){toast(T('memoFail'))}
}
function downloadMemo(){const a=document.createElement('a');a.href=MEMO_URL;a.download='cards-between-us.png';document.body.appendChild(a);a.click();a.remove()}
async function shareMemo(){
  if(!MEMO_BLOB)return;const f=new File([MEMO_BLOB],'cards-between-us.png',{type:'image/png'});
  if(navigator.canShare&&navigator.canShare({files:[f]})){try{await navigator.share({files:[f],title:T('shareTitle'),text:T('shareText')});return}catch(e){return}}
  downloadMemo();
}

/* ---- install as an app ---- */
function setupInstall(){
  let DP=null;const standalone=(window.matchMedia&&window.matchMedia('(display-mode: standalone)').matches)||navigator.standalone;
  if(!standalone){
    if(window.addEventListener)window.addEventListener('beforeinstallprompt',e=>{e.preventDefault();DP=e;$('inst').hidden=false});
    if(/iphone|ipad|ipod/i.test(navigator.userAgent||''))$('inst').hidden=false;
  }
  $('inst').addEventListener('click',async()=>{if(DP){DP.prompt();try{await DP.userChoice}catch(x){}DP=null;$('inst').hidden=true}else $('ihelp').hidden=!$('ihelp').hidden});
}
