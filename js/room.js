/* Rooms over Firebase Realtime Database, using its REST API + server-sent events (no SDK).
   One stream per room delivers every change; the room holds:
     meta, seats/{0,1} (player id, name, gender, heartbeat), state (the shared game state),
     an/{seat} (answer being typed), rx/{seat} (last reaction).
   The same state rules as before apply: the higher version wins, and on a tie the server's copy wins. */
const RM={es:null,code:'',tree:{},off:0,hb:null,wd:null,lastEv:0,first:true,resume:false,create:false,lastRx:undefined,putT:null,hbSeen:0};
const RCODE_RE=/^[a-z0-9]{4,10}$/;
const fbUrl=(p,q)=>FIREBASE_DB_URL+'/'+ROOMS_PATH+'/'+p+'.json'+(q?'?'+q:'');
const rmsg=t=>{const e=$('rmsg');if(e)e.textContent=t};

async function fbReq(method,path,body,q){
  const r=await fetch(fbUrl(path,q),{method,headers:body!==undefined?{'Content-Type':'application/json'}:undefined,body:body!==undefined?JSON.stringify(body):undefined});
  if(r.status===401||r.status===403){const e=new Error('denied');e.denied=true;throw e}
  if(!r.ok)throw new Error('http '+r.status);
  return method==='GET'?r.json():null;
}
function roomErr(e,quiet){
  const msg=e&&e.denied?T('roomDenied'):T('roomFail');
  if(!quiet){rmsg(msg);const m=$('manual');if(m)m.open=true}
  else if(R&&R.mode==='fb')rmsg(T('roomWeak'));
}
const rcode=()=>{const a='abcdefghjkmnpqrstuvwxyz23456789';let c='';for(let i=0;i<5;i++)c+=a[Math.floor(Math.random()*a.length)];return c};

/* ---- create / join ---- */
async function fbCreate(){
  if(R)return;rmsg(T('roomMaking'));
  try{
    let code;for(let k=0;k<6;k++){code=rcode();if(!(await fbReq('GET',code+'/meta')))break}
    await fbReq('PUT',code,{meta:{created:{'.sv':'timestamp'}},seats:{0:{pid:PID,nm:myName(),gd:myG,ts:{'.sv':'timestamp'}}},state:S},'print=silent');
    await fbOpen(code,0,{create:true});
  }catch(e){roomErr(e)}
}
async function fbClaim(code,idx){
  await fbReq('PUT',code+'/seats/'+idx,{pid:PID,nm:myName(),gd:myG,ts:{'.sv':'timestamp'}},'print=silent');
  await new Promise(r=>setTimeout(r,400));
  const s=await fbReq('GET',code+'/seats/'+idx);
  return !!(s&&s.pid===PID);
}
async function fbJoin(code,resume){
  if(R)return;
  code=String(code||'').toLowerCase().replace(/[^a-z0-9]/g,'');
  if(!RCODE_RE.test(code)){rmsg(T('roomBad'));return}
  rmsg(T('roomJoining'));
  try{
    const room=await fbReq('GET',code);
    if(!room||!room.meta){rmsg(T('roomNone'));if(resume)try{localStorage.removeItem('bena_room')}catch(e){}return}
    const seats=room.seats||{};let order=[];
    if(seats[0]&&seats[0].pid===PID)order=[0];else if(seats[1]&&seats[1].pid===PID)order=[1];
    else order=[0,1].filter(i=>!seats[i]);
    let idx=-1;
    for(const i of order){if(await fbClaim(code,i)){idx=i;break}}
    if(idx<0){rmsg(T('roomFull'));return}
    await fbOpen(code,idx,{resume});
  }catch(e){roomErr(e)}
}
async function fbOpen(code,idx,o){
  fbClose();
  RM.code=code;RM.tree={};RM.first=true;RM.create=!!o.create;RM.resume=!!o.resume;RM.lastRx=null;RM.hbSeen=0;RM.lastEv=Date.now();
  R={mode:'fb',code,idx,open:false,nms:['',''],gd:['m','m'],role:idx};
  R.nms[idx]=myName();R.gd[idx]=myG;
  try{localStorage.setItem('bena_room',code)}catch(e){}
  fbStream();RM.hb=setInterval(fbHeartbeat,15000);RM.wd=setInterval(fbWatchdog,10000);
  rmsg('');roomUi();render();
}
function fbClose(){
  if(RM.es){try{RM.es.close()}catch(e){}RM.es=null}
  clearInterval(RM.hb);clearInterval(RM.wd);clearTimeout(RM.putT);RM.hb=RM.wd=null;
}
async function fbLeave(){
  const code=RM.code,idx=R&&R.mode==='fb'?R.idx:-1;
  fbClose();if(R&&R.mode==='fb')R=null;
  try{localStorage.removeItem('bena_room')}catch(e){}
  if(code&&idx>=0){try{await fbReq('DELETE',code+'/seats/'+idx,undefined,'print=silent')}catch(e){}}
  RM.code='';rmsg('');roomUi();render();
}

/* ---- stream ---- */
function fbStream(){
  if(RM.es){try{RM.es.close()}catch(e){}}
  const es=new EventSource(fbUrl(RM.code));RM.es=es;RM.lastEv=Date.now();
  es.addEventListener('put',e=>fbEvent('put',e.data));
  es.addEventListener('patch',e=>fbEvent('patch',e.data));
  es.addEventListener('keep-alive',()=>{RM.lastEv=Date.now()});
  es.addEventListener('cancel',()=>{rmsg(T('roomDenied'));$('manual').open=true});
  es.addEventListener('auth_revoked',()=>{rmsg(T('roomDenied'))});
  es.onerror=()=>{if(es.readyState===2&&RM.es===es)setTimeout(()=>{if(R&&R.mode==='fb'&&RM.es===es)fbStream()},3000)};
}
function fbSet(path,val){
  const parts=path.split('/').filter(Boolean);
  if(!parts.length){RM.tree=(val&&typeof val==='object')?val:{};return}
  let o=RM.tree;for(let i=0;i<parts.length-1;i++){if(!o[parts[i]]||typeof o[parts[i]]!=='object')o[parts[i]]={};o=o[parts[i]]}
  const k=parts[parts.length-1];if(val===null||val===undefined)delete o[k];else o[k]=val;
}
function fbEvent(type,raw){
  RM.lastEv=Date.now();let m;try{m=JSON.parse(raw)}catch(e){return}if(!m||!R||R.mode!=='fb')return;
  const path=m.path||'/';
  if(type==='put')fbSet(path,m.data);
  else if(m.data&&typeof m.data==='object')Object.keys(m.data).forEach(k=>fbSet((path==='/'?'':path)+'/'+k,m.data[k]));
  fbSync();
}
const sameS=(a,b)=>JSON.stringify(clean(a))===JSON.stringify(clean(b));
function fbSync(){
  if(!R||R.mode!=='fb')return;
  const t=RM.tree||{},seats=t.seats||{},me=seats[R.idx],pe=seats[1-R.idx];let changed=false;
  if(me&&typeof me.ts==='number'&&RM.hbSeen!==me.ts){RM.hbSeen=me.ts;RM.off=me.ts-Date.now()}
  const alive=!!(pe&&pe.pid&&typeof pe.ts==='number'&&(Date.now()+RM.off-pe.ts)<45000),was=R.open;
  if(pe){R.nms[1-R.idx]=String(pe.nm||'').slice(0,24)||T('player');R.gd[1-R.idx]=pe.gd==='f'?'f':'m'}
  R.nms[R.idx]=myName();R.gd[R.idx]=myG;R.open=alive;
  /* shared game state */
  if(t.state&&typeof t.state==='object'){
    const c=clean(t.state);
    if(RM.first&&!RM.create&&!RM.resume){S=c;changed=true}
    else if(c.v>S.v||(c.v===S.v&&!sameS(c,S))){S=c;changed=true}
    else if(c.v<S.v)fbPutState();
  }else if(RM.first||t.meta)fbPutState();
  /* answer being typed by the other player */
  const an=t.an&&t.an[1-R.idx];
  if(an&&typeof an==='object'&&an.k===lastKey&&S.turn!==R.idx&&typeof an.a==='string'&&AN!==an.a.slice(0,400)){AN=an.a.slice(0,400);changed=true}
  /* reactions from the other player (not replayed when joining) */
  const rx=t.rx&&t.rx[1-R.idx];
  if(RM.first)RM.lastRx=(rx&&typeof rx==='object')?rx.n:null;
  else if(rx&&typeof rx==='object'&&RM.lastRx!==rx.n){RM.lastRx=rx.n;if(RX.includes(rx.e)){RXC[1-R.idx]++;floatE(rx.e);play('pop')}}
  RM.first=false;
  if(alive&&!was){rmsg(T('sConnected'))}
  if(changed||was!==R.open)render();
  roomUi();
}
function fbWrite(method,sub,body){
  if(!R||R.mode!=='fb')return Promise.resolve();
  return fbReq(method,RM.code+'/'+sub,body,'print=silent').catch(e=>roomErr(e,true));
}
function fbPutState(){if(!R||R.mode!=='fb')return;clearTimeout(RM.putT);RM.putT=setTimeout(()=>fbWrite('PUT','state',S),0)}
function fbSend(m){
  if(!R||R.mode!=='fb')return;
  if(m.t==='st')fbPutState();
  else if(m.t==='an')fbWrite('PUT','an/'+R.idx,{k:String(m.k).slice(0,40),a:String(m.a||'').slice(0,400)});
  else if(m.t==='rx')fbWrite('PUT','rx/'+R.idx,{e:m.e,n:Date.now()});
  else if(m.t==='nm')fbWrite('PATCH','seats/'+R.idx,{nm:String(m.nm||'').slice(0,24),gd:m.gd==='f'?'f':'m'});
}
function fbHeartbeat(){if(R&&R.mode==='fb')fbWrite('PATCH','seats/'+R.idx,{ts:{'.sv':'timestamp'},nm:myName(),gd:myG})}
function fbWatchdog(){
  if(!R||R.mode!=='fb')return;
  if(Date.now()-RM.lastEv>75000||!RM.es||RM.es.readyState===2)fbStream();
  fbSync();   /* re-evaluate "is the other player still here" even when nothing arrives */
}

/* ---- room panel ---- */
function roomUi(){
  const inRoom=!!(R&&R.mode==='fb');
  if($('roomOut'))$('roomOut').hidden=inRoom;
  if($('roomIn'))$('roomIn').hidden=!inRoom;
  if(inRoom){$('roomst').textContent=T('roomIn',R.code,R.open);$('lbx').classList.add('on');$('onl').setAttribute('aria-expanded','true')}
}
const roomLink=()=>location.origin+location.pathname+'?room='+(R&&R.mode==='fb'?R.code:'');
async function inviteRoom(){
  if(!R||R.mode!=='fb')return;
  const url=roomLink(),text=T('roomInviteText',R.code);
  if(navigator.share){try{await navigator.share({title:T('shareTitle'),text,url});return}catch(e){if(e&&e.name==='AbortError')return}}
  toast((await copyText(text+' '+url))?T('linkCopied'):T('copyFail'));
}
function bindRoom(){
  $('rnew').addEventListener('click',fbCreate);
  $('rjoin').addEventListener('click',()=>fbJoin($('rcode').value));
  $('rcode').addEventListener('keydown',e=>{if(e.key==='Enter'){e.preventDefault();fbJoin($('rcode').value)}});
  $('rinv').addEventListener('click',inviteRoom);
  $('rleave').addEventListener('click',fbLeave);
  if(document.addEventListener)document.addEventListener('visibilitychange',()=>{if(!document.hidden&&R&&R.mode==='fb'){fbHeartbeat();if(!RM.es||RM.es.readyState===2)fbStream()}});
}
/* called once at start-up: ?room=CODE in the link, or the room this browser was in before */
function roomAutoJoin(){
  let code='';
  try{code=(new URLSearchParams(location.search).get('room')||'').toLowerCase().replace(/[^a-z0-9]/g,'')}catch(e){}
  if(code){try{history.replaceState(null,'',location.pathname)}catch(e){}
    $('lbx').classList.add('on');$('rcode').value=code;
    let same='';try{same=localStorage.getItem('bena_room')||''}catch(e){}
    fbJoin(code,same===code);return}
  let saved='';try{saved=localStorage.getItem('bena_room')||''}catch(e){}
  if(saved)fbJoin(saved,true);
}
