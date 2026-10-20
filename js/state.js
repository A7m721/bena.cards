/* Game state S (the part that is synced between two players), storage, and the deck builder. */
const SK='bena_cards_v6',PK='bena_pid';
const PACKS=['gen','friends','couples','family','work','quick'];
const INTENS=['light','grad','bold'];
const LVCOL=['#2fd18b','#ffd93d','#ff6b6b'];
const CATCOL={f:'#ff9f43',m:'#a78bfa',d:'#2fd18b',h:'#ff6fb1',c:'#ffd93d',u:'#6ee7ff'};

const Z0=()=>({tk:[0,0],sw:[0,0],dbl:false});                 /* per-game extras (tokens, double turn) */
const FR=()=>({fl:false,fo:null,dn:false,sx:false,tf:false});   /* per-card flags */
/* v=version, i=card index, turn=seat, fc=forfeit counter, tm=timer on, go=game started, pk=pack, it=intensity,
   cq=custom questions, pl=player ids per seat, fl=flipped, fo=forfeit index, dn=done, sx=skipped, tf=timeout forfeit, sd=shuffle seed */
let S={v:0,i:0,turn:0,fc:0,tm:true,go:false,pk:'gen',it:'grad',cq:[],pl:['',''],...FR(),...Z0(),sd:rnd()};
let R=null,MS='',LOG={},AN='';
let GD=['m','m'],GM=[false,false],myG='m',myGM=false,RXC=[0,0];
let PID='';try{PID=localStorage.getItem(PK)||'';if(!PID){PID=Math.random().toString(36).slice(2,10);localStorage.setItem(PK,PID)}}catch(e){PID=Math.random().toString(36).slice(2,10)}

const plain=n=>String(n).replace(' (أنت)','').replace(' (you)','');
const myName=()=>($('myn').value.trim()||T('player')).slice(0,24);
function names(){
  if(!R)return[$('n0').value.trim()||T('p1'),$('n1').value.trim()||T('p2')];
  return R.nms.map((n,i)=>(n||'...')+(i===R.idx&&n?T('you'):''));
}
const canAct=()=>!R||(R.open&&S.turn===R.idx);
const canOther=()=>!R||(R.open&&S.turn!==R.idx);

/* Validate any state that comes from storage or from the other player. */
function clean(o){
  const n=x=>Number.isFinite(x)?Math.max(0,Math.floor(x)):0;
  const arr=(a,len)=>Array.from({length:len},(_,i)=>n(Array.isArray(a)?a[i]:0));
  return{v:n(o.v),i:n(o.i),turn:o.turn===1?1:0,fc:n(o.fc),tm:o.tm!==false,go:o.go===true,
    pk:PACKS.includes(o.pk)?o.pk:'gen',it:INTENS.includes(o.it)?o.it:'grad',
    fl:o.fl===true,fo:o.fo==null?null:n(o.fo),dn:o.dn===true,sx:o.sx===true,tf:o.tf===true,
    tk:arr(o.tk,2),sw:arr(o.sw,2),dbl:o.dbl===true,
    pl:[0,1].map(i=>Array.isArray(o.pl)&&typeof o.pl[i]==='string'?o.pl[i].slice(0,12):''),
    sd:n(o.sd),
    cq:(Array.isArray(o.cq)?o.cq.slice(0,20):[]).map(x=>Array.isArray(x)&&typeof x[0]==='string'&&x[0].trim()?[x[0].slice(0,140),[0,1,2].includes(x[1])?x[1]:1]:null).filter(Boolean)};
}
function act(p){S={...S,...p,v:S.v+1};render();send({t:'st',st:S})}
/* sd = series*1000 + game number. A new game keeps the series (same shuffle of the bank) and moves to the next game number,
   so it takes the next slice of questions instead of a random overlap. Still a plain number, so nothing else changes. */
const newSd=()=>Math.floor(S.sd/1000)*1000+(S.sd%1000+1)%1000;

/* ---- deck builder: same state => same deck on both devices ---- */
const pkE=()=>MS?'gen':S.pk, itE=()=>MS?'grad':S.it;
function drawFor(){
  let g=pkE()==='quick'?[8,7,5]:pkE()==='gen'?[20,22,22]:[14,16,16];
  if(itE()==='light')g=[g[0]+Math.ceil(g[2]/2),g[1]+Math.floor(g[2]/2),0];
  else if(itE()==='bold')g=[0,g[1]+Math.ceil(g[0]/2),g[2]+Math.floor(g[0]/2)];
  return g;
}
/* two places (room, manual link or shared code): hide dares that need acting, drawing or singing */
const olE=()=>!!(R||MS);
const ACT_RE=/^(قلّد|ارسم|اعمل|اختار أغنية|اخترعوا|اتكلم بصوت|مثّل|غنّي)/;
const QA=()=>[...QB.filter(q=>(!q.p||q.p===pkE())&&!(olE()&&q.c==='c'&&ACT_RE.test(q.ar))),...(MS?[]:S.cq.map(x=>({c:'u',l:x[1],p:'',ar:x[0],en:x[0]})))];
function itemsOf(){
  const QQ=QA(),draw=drawFor(),pk=pkE(),en=[0,1,2].filter(x=>draw[x]>0),jp=sh(4,S.sd+99);
  const SS=Math.floor(S.sd/1000),GN=S.sd%1000;   /* series seed, game number */
  const part=(arr,n)=>{n=Math.min(n,arr.length);return Array.from({length:n},(_,i)=>arr[(GN*n+i)%arr.length])};   /* game GN takes the GN-th slice, wrapping around */
  const lvOf=q=>en.includes(q.l)?q.l:en.reduce((b,x)=>Math.abs(x-q.l)<Math.abs(b-q.l)?x:b,en[0]);
  const qs=en.flatMap(x=>{
    const packK=pk==='gen'||pk==='quick'?[]:sh(QQ.length,SS+x*11).filter(k=>QQ[k].p===pk&&QQ[k].l===x);
    const baseK=sh(QQ.length,SS+x*13).filter(k=>!QQ[k].p&&QQ[k].c!=='u'&&QQ[k].l===x);
    const cu=QQ.map((q,k)=>q.c==='u'&&lvOf(q)===x?k:-1).filter(k=>k>=0);
    const pp=part(packK,packK.length?Math.max(1,Math.min(Math.ceil(draw[x]/2),Math.floor(packK.length/2))):0);   /* pack questions: up to half of the level (and at most half of the pack's pool, so two games in a row do not overlap); the rest comes from the general bank */
    const mix=[...pp,...part(baseK,Math.max(0,draw[x]-pp.length)),...cu];
    return sh(mix.length,S.sd+x*17).map(i=>mix[i]);
  });
  const out=[];let n=0;
  qs.forEach((k,idx)=>{const x=lvOf(QQ[k]);out.push({k,L:x});if((idx+1)%6===0&&idx<qs.length-1){out.push({j:jp[n%4],L:x});n++}});
  return out;
}
const cur=()=>itemsOf()[S.i];
const fpick=(Lv,fo)=>{const p=olE()?[...FL[Lv].filter(i=>!FB_ACT.has(i)),...FB_ON[Lv]]:FL[Lv];return FB[p[sh(p.length,S.sd+7)[fo%p.length]]]};  /* -> [arabic, english] */
const tmax=()=>(pkE()==='quick'?15:30)*(R?3:1);
/* online question answered in writing: after the answer is done, the OTHER player taps "read" and the turn passes to them */
const rdFlow=it=>!!R&&!!it&&it.j===undefined&&S.fo==null&&!S.sx;
function phase(){if(!S.fl)return'flip';if(!S.dn)return'answer';return'next'}

/* ---- persistence (this browser only) ---- */
function save(){try{localStorage.setItem(SK,JSON.stringify({S,LOG,n:[plain($('n0').value),plain($('n1').value)],my:$('myn').value,snd:SND,at:AN,gd:GD,gm:GM,mg:myG,mgm:myGM,ms:MS,rx:RXC}))}catch(e){}}
function load(){
  try{
    const o=JSON.parse(localStorage.getItem(SK)||'null');if(!o||!o.S)return;
    S=clean(o.S);
    LOG={};if(o.LOG&&typeof o.LOG==='object')Object.keys(o.LOG).forEach(k=>{const e=o.LOG[k];if(e&&Array.isArray(e.q))LOG[k]={q:[String(e.q[0]||'').slice(0,200),String(e.q[1]||'').slice(0,200)],who:String(e.who||'').slice(0,30),seat:e.seat===1?1:0,a:String(e.a||'').slice(0,400),f:Array.isArray(e.f)?[String(e.f[0]||'').slice(0,200),String(e.f[1]||'').slice(0,200)]:null,sx:e.sx===true,tf:e.tf===true}});
    if(Array.isArray(o.n)){$('n0').value=String(o.n[0]||'').slice(0,24);$('n1').value=String(o.n[1]||'').slice(0,24)}
    if(typeof o.my==='string')$('myn').value=o.my.slice(0,24);
    SND=o.snd!==false;
    if(Array.isArray(o.gd))GD=[o.gd[0]==='f'?'f':'m',o.gd[1]==='f'?'f':'m'];
    if(Array.isArray(o.gm))GM=[o.gm[0]===true,o.gm[1]===true];
    myG=o.mg==='f'?'f':'m';myGM=o.mgm===true;
    MS='';   /* the shared-code way was removed; ignore anything saved by older versions */
    if(Array.isArray(o.rx))RXC=[Math.max(0,+o.rx[0]||0),Math.max(0,+o.rx[1]||0)];
    if(!GM[0])GD[0]=gGuess($('n0').value);if(!GM[1])GD[1]=gGuess($('n1').value);if(!myGM)myG=gGuess($('myn').value);
    AN=typeof o.at==='string'?o.at.slice(0,400):'';$('at').value=AN;
    lastKey=S.sd+':'+S.i;lastSet=String(S.sd);
  }catch(e){}
}
