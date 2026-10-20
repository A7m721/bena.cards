/* Rendering: everything on screen is derived from the state S (+ local flags). */
let lastKey='',lastSet='',endV=-1,prevS=null,lvShown='',nKey='',tmKey='',tmStart=0,tmFired='',tmTick=-1,anT=null,rKey='';
const card=$('card'),nx=$('nx'),sk=$('sk');

/* ---- home screen controls ---- */
function buildChips(){
  const mk=(box,list,prefix,key)=>{const el=$(box);el.innerHTML='';list.forEach(id=>{const b=document.createElement('button');b.type='button';b.className='chip';b.dataset.id=id;b.textContent=T(prefix+id);b.onclick=()=>{if(!S.go&&!MS)act({[key]:id})};el.appendChild(b)})};
  mk('packs',PACKS,'pk_','pk');mk('intens',INTENS,'it_','it');
}
function syncChips(){
  [['packs','pk'],['intens','it']].forEach(([box,key])=>[...$(box).children].forEach(b=>{b.classList.toggle('on',b.dataset.id===S[key]);b.disabled=!!MS;b.setAttribute('aria-pressed',b.dataset.id===S[key])}));
}
function cqRender(){
  const box=$('cql');box.innerHTML='';
  S.cq.forEach((x,ix)=>{const d=document.createElement('div'),t=document.createElement('span'),b=document.createElement('button');t.textContent=T('lv'+x[1])+'  •  '+x[0];b.textContent='✕';b.setAttribute('aria-label',T('cqDel'));b.onclick=()=>{if(S.go)return;act({cq:S.cq.filter((_,j)=>j!==ix)})};d.append(t,b);box.appendChild(d)});
}
function addQ(){const t=$('cqi').value.trim().slice(0,140);if(!t||S.go||S.cq.length>=20)return;act({cq:[...S.cq,[t,+$('cqs').value]]});$('cqi').value=''}

/* ---- end screen pieces ---- */
function recap(){
  const box=$('recap');box.innerHTML='';
  Object.values(LOG).forEach(e=>{
    const d=document.createElement('div'),q=document.createElement('b'),a=document.createElement('span'),i=LANG==='en'?1:0;
    d.className='rc';q.textContent=e.q[i];
    a.textContent=e.sx?T('recSkip',e.who):e.f?T('recForfeit',e.who,e.f[i]):e.who+': '+(e.a||T('recVerbal'));
    d.append(q,a);box.appendChild(d);
  });
}
function recapText(){
  const i=LANG==='en'?1:0;
  return Object.values(LOG).map(e=>e.q[i]+'\n'+(e.sx?T('recSkip',e.who):e.f?T('recForfeitLbl')+e.f[i]:e.who+': '+(e.a||'—'))).join('\n\n');
}

/* ---- main render ---- */
function render(){
  const d=itemsOf(),nm=names(),end=S.go&&S.i>=d.length;
  if(String(S.sd)!==lastSet){lastSet=String(S.sd);LOG={}}
  const key=S.sd+':'+S.i;if(key!==lastKey){lastKey=key;AN='';$('at').value=''}

  /* screens, and where the settings block lives (home screen before the game, drawer after) */
  $('app').classList.toggle('ingame',S.go);
  $('home').hidden=S.go;$('gamescr').hidden=!S.go;$('tagline').hidden=S.go;
  const hostEl=S.go?$('dbody'):$('ctlHome');if($('ctl').parentNode!==hostEl)hostEl.appendChild($('ctl'));
  $('menu').hidden=false;$('rst').hidden=!S.go;$('menu').textContent=T('menu')+(R&&R.open?' 🟢':'');

  /* players */
  $('players').classList.toggle('idle',!S.go);
  $('p0').classList.toggle('turn',S.go&&!end&&S.turn===0);$('p1').classList.toggle('turn',S.go&&!end&&S.turn===1);
  if(R){$('n0').value=nm[0];$('n1').value=nm[1];$('n0').readOnly=$('n1').readOnly=true}else{$('n0').readOnly=$('n1').readOnly=false}
  [0,1].forEach(x=>{$('a'+x).textContent=gen(x)==='f'?'👧':'👦';$('s'+x).textContent=((S.tk[x]?'🛡️'+S.tk[x]+' ':'')+(S.sw[x]?'🔄'+S.sw[x]:'')).trim()});

  /* settings controls */
  $('tm').checked=S.tm;$('tm').disabled=S.go&&S.fl&&!end;
  $('snd').textContent=SND?T('sndOn'):T('sndOff');$('langb').textContent=T('langBtn');$('themeb').textContent=T('theme_'+THEME);

  /* ---- home screen ---- */
  if(!S.go){
    $('cqp').hidden=!!MS;cqRender();syncChips();
    $('pdesc').textContent=T('pd_'+pkE());$('start').disabled=!!R&&!R.open;
    
    $('tmw').hidden=true;tmKey='';prevS=null;save();return;
  }

  /* ---- finished ---- */
  $('game').hidden=end;$('end').classList.toggle('on',end);
  if(end){
    $('cnt').textContent='';$('lvl').hidden=true;$('tmw').hidden=true;tmKey='';
    renderAwards();recap();
    if(endV!==S.v){endV=S.v;rain();play('clap')}
    prevS=null;save();return;
  }

  /* ---- a card is on the table ---- */
  const it=d[S.i],isJ=it.j!==undefined,Lv=it.L,ph=phase(),isA=canAct(),isBn=canOther(),wait=R&&!R.open;
  const who=plain(nm[S.turn]),gname=plain(nm[1-S.turn]);
  const lb=$('lvl');lb.hidden=false;lb.textContent=(LANG==='en'?'Level ':'المستوى ')+(Lv+1)+' • '+T('lv'+Lv);lb.style.background=LVCOL[Lv];
  $('cnt').textContent=LANG==='en'?'Card '+(S.i+1)+' of '+d.length:'الكارت '+(S.i+1)+' من '+d.length;
  const newLv=S.i>0&&d[S.i-1].L!==Lv&&!S.fl;
  if(newLv&&lvShown!==key){lvShown=key;rain();play('level')}
  const myTurnNow=!!(R&&R.open&&S.turn===R.idx&&!S.fl),nkey=key+':'+S.turn;
  if(myTurnNow&&nKey!==nkey){nKey=nkey;ping()}
  const readNow=!!(R&&R.open&&rdFlow(it)&&S.dn&&S.turn!==R.idx),rkey=key+':rd';
  if(readNow&&rKey!==rkey){rKey=rkey;ping('readTitle')}

  card.classList.toggle('flip',S.fl);
  const tg=$('tg');let fArEn=null;
  if(isJ){$('q').textContent=T('jk'+it.j)+'\n'+TX.jtext(it.j,S.turn,1-S.turn);tg.textContent=T('tagJoker');tg.style.background='#ffd93d'}
  else if(S.fo!=null){const p=fpick(Lv,S.fo);fArEn=[gen(S.turn)==='f'?fem(p[0]):p[0],p[1]];$('q').textContent=LANG==='en'?p[1]:fArEn[0];tg.textContent=T('tagForfeit');tg.style.background='#ff6b6b'}
  else{const qq=QA()[it.k];$('q').textContent=qq.c==='u'?qq.ar:fq(txt(qq));tg.textContent=T('cat_'+qq.c);tg.style.background=CATCOL[qq.c]}
  $('wh').textContent=(isJ?T('whoCard'):S.fo!=null?T('whoForfeit'):T('whoTurn'))+nm[S.turn];
  $('ft').textContent=wait?T('waitOther'):TX.front({newLv,lvName:T('lv'+Lv),isA,name:nm[S.turn],a:S.turn,b:1-S.turn});
  card.disabled=S.fl||!isA;

  const qOpen=!isJ&&S.fl&&!S.dn&&!S.sx;
  sk.disabled=!(qOpen&&S.fo==null&&isA);sk.textContent=TX.sk(S.turn);
  const rd=rdFlow(it),rdNow=rd&&ph==='next';
  nx.hidden=rdNow&&isA&&!!R;   /* online: the writer waits, the reader taps "read" */
  nx.disabled=!(ph==='next'&&(rd?isBn:isA));nx.textContent=rdNow?T('readDone'):(S.i>=d.length-1?T('nxEnd'):T('nx'));
  $('tk').hidden=!(qOpen&&isA&&S.tk[S.turn]>0);$('tk').textContent=TX.tk(S.turn);
  $('sw').hidden=!(qOpen&&isA&&S.sw[S.turn]>0&&S.fo==null);$('sw').textContent=TX.sw(S.turn,1-S.turn);
  $('tkr').hidden=$('tk').hidden&&$('sw').hidden;

  const showA=!isJ&&S.fl&&S.fo==null&&!S.sx;
  $('ans').hidden=!showA;
  if(showA){const a=$('at');a.readOnly=!isA||S.dn;$('al').textContent=TX.ansLabel(isA,who);if(!isA)a.value=AN}
  if(S.fl&&!isJ){const qq=QA()[it.k];LOG[key]={q:[qq.c==='u'||gen(S.turn)!=='f'?qq.ar:fem(qq.ar),qq.en],who,seat:S.turn,a:AN,f:fArEn,sx:S.sx,tf:S.tf}}

  const dnb=$('dn');dnb.hidden=!(ph==='answer'&&isA);dnb.textContent=TX.dn(isJ,it.j,S.fo);dnb.disabled=!!R&&!isJ&&S.fo==null&&!AN.trim();

  /* timer */
  const tOn=S.tm&&ph==='answer'&&!isJ&&S.fo==null,tkn=key+':'+S.turn;
  $('tmw').hidden=!tOn;if(tOn){if(tmKey!==tkn){tmKey=tkn;tmStart=Date.now();tmTick=-1;tick()}}else tmKey='';

  /* sounds on state changes (so the other player hears them too) */
  const cs={i:S.i,fl:S.fl,fo:S.fo,dn:S.dn,sx:S.sx};
  if(prevS&&prevS.i===cs.i){
    if(!prevS.fl&&cs.fl)play(isJ?'magic':'flip');
    if(prevS.fo==null&&cs.fo!=null)play('drum');
    if(!prevS.dn&&cs.dn&&!isJ&&cs.fo==null&&!cs.sx)play('clap');
  }
  prevS=cs;

  $('hint').textContent=S.fl?TX.hint({ph,isJ,isA,isBn,fo:S.fo,tm:S.tm,sx:S.sx,who,a:S.turn,b:1-S.turn,dnLabel:dnb.textContent,rd}):'';
  save();
}

function tick(){
  if(tmKey==='')return;
  const mx=tmax(),left=Math.max(0,mx-Math.floor((Date.now()-tmStart)/1000));
  $('tmn').textContent=left;$('tmb').style.width=(left/mx*100)+'%';
  if(left>0&&left<=5&&tmTick!==left){tmTick=left;play('tick')}
  if(left<=0&&canAct()&&tmFired!==tmKey&&phase()==='answer'&&S.fo==null&&!S.dn){tmFired=tmKey;play('buzz');act({fo:S.fc,fc:S.fc+1,tf:true})}
}
