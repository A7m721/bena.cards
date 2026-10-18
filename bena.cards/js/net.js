/* Play from two places: a direct browser-to-browser connection (WebRTC data channel), no server.
   The two players exchange two codes once. Seats are remembered through a per-browser id (PID),
   so after a drop the same people get the same seat back. */
let pc=null,fbT=null;
const ICE={iceServers:[{urls:'stun:stun.l.google.com:19302'},{urls:'stun:stun1.l.google.com:19302'}]};
const say=t=>{$('st').textContent=t};

function send(m){if(R&&R.open){try{R.dc.send(JSON.stringify(m))}catch(e){}}}

async function enc(t){
  try{if(window.CompressionStream){const cs=new CompressionStream('deflate'),w=cs.writable.getWriter();w.write(new TextEncoder().encode(t));w.close();const u=new Uint8Array(await new Response(cs.readable).arrayBuffer());let b='';u.forEach(x=>b+=String.fromCharCode(x));return 'z'+btoa(b)}}catch(e){}
  return 'r'+btoa(unescape(encodeURIComponent(t)));
}
async function dec(t){
  t=t.trim().replace(/\s+/g,'');const b=atob(t.slice(1));
  if(t[0]==='z'){const u=Uint8Array.from(b,c=>c.charCodeAt(0)),ds=new DecompressionStream('deflate'),w=ds.writable.getWriter();w.write(u);w.close();return new TextDecoder().decode(await new Response(ds.readable).arrayBuffer())}
  return decodeURIComponent(escape(b));
}
const gathered=p=>new Promise(res=>{if(p.iceGatheringState==='complete')return res();const f=()=>{if(p.iceGatheringState==='complete'){p.removeEventListener('icegatheringstatechange',f);res()}};p.addEventListener('icegatheringstatechange',f);setTimeout(res,5000)});

function wire(ch,role){
  ch.onopen=()=>{R={dc:ch,idx:role,open:false,nms:['',''],gd:['m','m'],role};try{ch.send(JSON.stringify({t:'hi',pid:PID,nm:myName(),gd:myG}))}catch(e){}};
  ch.onmessage=e=>{
    let m;try{m=JSON.parse(e.data)}catch(x){return}if(!m||!R)return;
    if(m.t==='hi'){
      const pp=String(m.pid||'').slice(0,12),pl=S.pl;let my=R.role;
      if(pl[0]&&pl[1]){const mi=pl.indexOf(PID),pi=pl.indexOf(pp);if(mi>-1)my=mi;else if(pi>-1)my=1-pi}
      R.idx=my;R.nms[my]=myName();R.nms[1-my]=String(m.nm||'').slice(0,24)||T('player');
      R.gd[my]=myG;R.gd[1-my]=m.gd==='f'?'f':'m';R.open=true;clearTimeout(fbT);
      const npl=[...pl];npl[my]=PID;npl[1-my]=pp;
      if(JSON.stringify(npl)!==JSON.stringify(pl))S={...S,pl:npl,v:S.v+1};
      send({t:'st',st:S});$('hp').hidden=true;$('gp').hidden=true;say(T('sConnected'));render();
    }
    else if(!R.open)return;
    else if(m.t==='nm'){R.nms[1-R.idx]=String(m.nm||'').slice(0,24)||T('player');R.gd[1-R.idx]=m.gd==='f'?'f':'m';render()}
    else if(m.t==='rx'){if(RX.includes(m.e)){RXC[1-R.idx]++;floatE(m.e);play('pop')}}
    else if(m.t==='an'){if(m.k===lastKey&&S.turn!==R.idx){AN=String(m.a||'').slice(0,400);render()}}
    else if(m.t==='st'&&m.st&&typeof m.st==='object'){
      const c=clean(m.st);
      if(c.v>S.v||(c.v===S.v&&R.role===1&&JSON.stringify(c)!==JSON.stringify(S))){S=c;render()}
    }
  };
  ch.onclose=()=>{if(R&&R.dc===ch){$('n0').value=plain(R.nms[0]||$('n0').value);$('n1').value=plain(R.nms[1]||$('n1').value);R=null;say(T('sDropped'));render()}};
  if(ch.readyState==='open')ch.onopen();
}

function newPc(){
  if(typeof RTCPeerConnection==='undefined'){showFb(T('sNoRtc'));return null}
  if(pc){try{pc.close()}catch(e){}}
  pc=new RTCPeerConnection(ICE);
  pc.onconnectionstatechange=()=>{if(pc&&pc.connectionState==='failed')showFb(T('sFailed'))};
  return pc;
}
async function copyFrom(id){const t=$(id);t.select();say((await copyText(t.value))?T('sCopied'):T('sCopyManual'))}

/* Shown only when the direct connection fails: same shared code => same cards on both phones. */
function showFb(msg){$('fb').hidden=false;if(msg)say(msg);$('lbx').classList.add('on');$('onl').setAttribute('aria-expanded','true')}
function armFb(){clearTimeout(fbT);fbT=setTimeout(()=>{if(!(R&&R.open))showFb(T('sSlow'))},25000)}

function bindNet(){
  $('onl').addEventListener('click',()=>{const o=$('lbx').classList.toggle('on');$('onl').setAttribute('aria-expanded',o)});
  $('myn').addEventListener('input',()=>{if(!myGM)myG=gGuess($('myn').value);if(R){R.nms[R.idx]=myName();R.gd[R.idx]=myG;send({t:'nm',nm:myName(),gd:myG});render()}});

  $('bh').addEventListener('click',async()=>{
    if(R)return;const p=newPc();if(!p)return;$('gp').hidden=true;$('hp').hidden=false;say(T('sPrep'));
    const ch=p.createDataChannel('g');wire(ch,0);
    await p.setLocalDescription(await p.createOffer());await gathered(p);
    $('hc').value=await enc(JSON.stringify(p.localDescription));say(T('sCopySend'));
  });
  $('ch').addEventListener('click',()=>copyFrom('hc'));
  $('cn').addEventListener('click',async()=>{
    try{await pc.setRemoteDescription(JSON.parse(await dec($('ha').value)));say(T('sConnecting'));armFb()}catch(e){say(T('sBad'))}
  });
  $('bg').addEventListener('click',()=>{if(R)return;$('hp').hidden=true;$('gp').hidden=false;say('')});
  $('mkr').addEventListener('click',async()=>{
    const p=newPc();if(!p)return;say(T('sReplyPrep'));
    p.ondatachannel=e=>wire(e.channel,1);
    try{await p.setRemoteDescription(JSON.parse(await dec($('gi').value)));await p.setLocalDescription(await p.createAnswer());await gathered(p);
      $('gv').value=await enc(JSON.stringify(p.localDescription));say(T('sReplyReady'));armFb()}
    catch(e){say(T('sBad'))}
  });
  $('cg').addEventListener('click',()=>copyFrom('gv'));

  $('fbg').addEventListener('click',()=>{
    const c=$('fbc').value.toLowerCase().replace(/[^a-z0-9]/g,'').slice(0,10);
    if(c.length<3){say(T('fbShort'));return}
    MS=c;act({i:0,turn:0,...FR(),...Z0(),sd:hash(c),pk:'gen',it:'grad'});say(T('fbOn',c));
  });
  $('fbm').addEventListener('click',()=>{if(!MS)return;const n=Math.max(1,Math.floor(+$('fbn').value||1)),i=Math.min(n-1,itemsOf().length);act({i,turn:i%2,...FR()})});
}
