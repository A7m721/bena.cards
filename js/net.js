/* Sending and the room panel's two small handlers. Rooms themselves live in room.js (Firebase). */
function send(m){if(R&&R.mode==='fb')fbSend(m)}

function bindNet(){
  $('onl').addEventListener('click',()=>{const o=$('lbx').classList.toggle('on');$('onl').setAttribute('aria-expanded',o)});
  $('myn').addEventListener('input',()=>{if(!myGM)myG=gGuess($('myn').value);if(R){R.nms[R.idx]=myName();R.gd[R.idx]=myG;send({t:'nm',nm:myName(),gd:myG});render()}});
}
