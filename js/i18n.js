/* Languages: Arabic (default, RTL) and English (LTR).
   STR  = static strings, TX = dynamic strings that depend on game context.
   Arabic text is gender-aware through G() (see util.js). */
let LANG='ar';
try{const l=localStorage.getItem('bena_lang');if(l==='en'||l==='ar')LANG=l}catch(e){}

const STR={
ar:{
 docTitle:'كروت بينا 💬',title:'كروت بينا 💬',tagline:'أسئلة وتحديات تقرّبكم من بعض وتضحّككم',
 p1:'اللاعب الأول',p2:'اللاعب التاني',phName:'اكتب الاسم',you:' (أنت)',player:'لاعب',waitOther:'بنستنى اللاعب التاني',avatarAria:'تبديل الشخصية (ولد/بنت)',
 packsT:'اختاروا نوع اللعبة',intensT:'مستوى الجرأة',
 pk_gen:'🎲 عام',pk_friends:'👫 أصحاب',pk_couples:'💑 أزواج',pk_family:'👨‍👩‍👧   عائلة',pk_work:'💼 زملاء',pk_quick:'⚡ سريعة',
 pd_gen:'مزيج من كل حاجة',pd_friends:'ذكريات وضحك بين الأصحاب',pd_couples:'أسئلة تقرّبكم من بعض',pd_family:'عن البيت والعيلة',pd_work:'عن الشغل والدراسة',pd_quick:'٢٠ كارت وعدّاد ١٥ ثانية',
 it_light:'🙂 خفيف',it_grad:'🔥 متدرّج',it_bold:'🌶️ جريء',
 start:'ابدأ اللعب 🎴',onl:'🌍 العبوا من مكانين مختلفين',share:'📤 مشاركة ودعوة',how:'❓ طريقة اللعب',
 timerOpt:'⏱️ عدّاد الوقت للإجابة',sndOn:'🔊 الصوت شغال',sndOff:'🔇 الصوت مقفول',langBtn:'🌐 English',
 theme_classic:'🎨 الشكل: كلاسيك',theme_dark:'🎨 الشكل: داكن',theme_light:'🎨 الشكل: فاتح',
 inst:'📲 ثبّت اللعبة',iosHelp:'على الآيفون: اضغط زرار المشاركة ⬆️ في Safari، وبعدين "إضافة إلى الشاشة الرئيسية".',
 cqSum:'➕ أضيفوا أسئلتكم للّعبة',cqPh:'اكتب سؤالك...',cqAdd:'إضافة',cqDel:'احذف السؤال',cqAria:'سؤالك',cqLvAria:'مستوى السؤال',
 menu:'☰ الإعدادات',settings:'⚙️ الإعدادات',close:'إغلاق',rst:'🔄 ابدأ من جديد',rstSure:'متأكد؟ اضغط تاني للتأكيد',
 lv0:'تسخين 😄',lv1:'قرّبنا 💭',lv2:'جريء 🔥',
 cat_f:'طريف 😂',cat_m:'ذكريات 🕰️',cat_d:'أحلام ✨',cat_h:'أعمق شوية 💭',cat_c:'تحدي ⚡',cat_u:'أسئلتكم 💬',tagJoker:'كارت سحري 🃏',tagForfeit:'حكم 😈',
 whoTurn:'الدور على: ',whoForfeit:'الحكم على: ',whoCard:'الكارت على: ',
 jk0:'🛡️ حصانة',jk1:'🔄 تبديل',jk2:'🎤 اسأل التاني',jk3:'⚡ الدور مرتين',
 nx:'الدور اللي بعده',nxEnd:'النهاية 🎉',ansWrite:'اكتب إجابتك (اختياري)',ansPh:'اكتب هنا...',
 rx_f:'ضحك',rx_s:'مفاجأة',rx_l:'حب',rx_c:'تصفيق',rxGroup:'ردود فعل',
 endT:'خلّصتوا كل الكروت! 🎉',endP:'أكيد عرفتوا عن بعض حاجات جديدة. اللي بيحكي بصدق بيقرّب أكتر.',
 awardsT:'🏆 لمسات اللعبة',aw_talk:'🗣️ الأكتر كلامًا',aw_forfeit:'😈 صاحب الأحكام',aw_skip:'🛡️ سيّد الحصانة',aw_timeout:'⏱️ سبقه الوقت',aw_react:'🎉 المشجّع الأكبر',aw_none:'🎉 كمّلتوا اللعبة للآخر، وده إنجاز!',
 memoBtn:'🖼️ كارت الذكرى',copyAns:'📋 نسخ الإجابات',copied:'اتنسخ ✔',copyFail:'مقدرناش ننسخ',again:'نلعب تاني',
 recSkip:(w)=>`🛡️ ${w} اتخطى السؤال`,recForfeit:(w,f)=>`😈 ${w} نفّذ حكم: ${f}`,recVerbal:'(جاوب شفوي)',recForfeitLbl:'حكم: ',
 memoT:'كارت الذكرى 💌',memoSave:'⬇️ تحميل الصورة',memoShare:'📤 مشاركة',memoName:'كروت بينا',memoCards:'كروت اتلعبت',memoAns:'إجابات',memoFor:'أحكام',memoMagic:'كروت سحرية',memoMade:'اتعمل بالحب في كروت بينا',memoFail:'مقدرناش نعمل الصورة',
 shareTitle:'كروت بينا',shareText:'تعالى نلعب "كروت بينا" 🎴 أسئلة وتحديات تقرّبنا من بعض وتضحّكنا:',linkCopied:'اتنسخ رابط اللعبة ✔',
 turnTitle:'🔔 دورك! — كروت بينا',
 // lobby
 roomNote:'اعملوا غرفة وابعتوا الكود أو الرابط لصاحبك. ده كل اللي محتاجينه.',roomNew:'➕ غرفة جديدة',roomCodePh:'كود الغرفة',roomJoin:'دخول',
 roomIn:(c,o)=>`🟢 الغرفة ${c.toUpperCase()} • ${o?'الاتنين موجودين':'بنستنى اللاعب التاني'}`,roomInvite:'📤 ابعت الدعوة',roomLeave:'خروج من الغرفة',
 roomInviteText:(c)=>`تعالى نلعب "كروت بينا" 🎴 كود الغرفة: ${c.toUpperCase()}`,roomMaking:'بنعمل الغرفة...',roomJoining:'بندخل الغرفة...',
 roomNone:'مفيش غرفة بالكود ده. اتأكد من الكود.',roomFull:'الغرفة فيها لاعبين اتنين بالفعل.',
 roomFail:'مقدرناش نوصل لسيرفر الغرفة. اتأكد من الإنترنت، أو جرّبوا الطريقة اليدوية تحت.',roomDenied:'سيرفر الغرفة رفض الطلب (قواعد Firebase). جرّبوا الطريقة اليدوية تحت.',
 roomBad:'الكود لازم يكون من ٤ لـ ١٠ حروف إنجليزي أو أرقام.',roomWeak:'الاتصال ضعيف... بنحاول نرجع.',manualSum:'الطريقة اليدوية (لو الغرفة مش شغالة)',
 lobNote:'من غير أي حسابات. هتبعتوا لبعض كودين بس مرة واحدة على واتساب.',myName:'اسمك',bh:'أنا هبدأ',bg:'صاحبي بعتلي كود',
 hStep1:'١) انسخ الكود وابعته لصاحبك:',copyCode:'نسخ الكود',hStep2:'٢) لما يرجعلك كود الرد، الصقه هنا:',connect:'اتصل',
 gStep1:'١) الصق الكود اللي صاحبك بعته:',mkr:'اعمل كود الرد',gStep2:'٢) انسخ كود الرد وابعته له:',codeAria:'الكود',replyAria:'كود الرد',
 sPrep:'بنجهّز الكود...',sCopySend:'انسخ الكود وابعته لصاحبك.',sConnecting:'بنوصّل...',sBad:'الكود مش مظبوط. اتأكد إنك لصقته كامل.',sReplyPrep:'بنجهّز كود الرد...',
 sReplyReady:'انسخ كود الرد وابعته لصاحبك، وهو هيضغط "اتصل".',sConnected:'🟢 متصلين! اللعب بقى لايف بينكم الاتنين.',sDropped:'الاتصال اتقطع. اللعب هيكمل من مكانه لما تعملوا ربط جديد.',
 sCopied:'اتنسخ ✔ ابعته لصاحبك.',sCopyManual:'اضغط مطولًا على الكود وانسخه.',sNoRtc:'المتصفح ده مش بيدعم الربط المباشر.',sFailed:'معرفناش نوصّل. ممكن الشبكة مانعة الربط المباشر.',sSlow:'الربط اتأخر أكتر من اللازم. ممكن الشبكة مانعاه.',
 fbText:'⚠️ الربط المباشر مش شغال على شبكتكم. جرّبوا شبكة تانية، أو العبوا بكود مشترك وانتم على مكالمة صوتية: الاتنين يكتبوا نفس الكود فيظهرلكم نفس الكروت بنفس الترتيب، وتدوسوا "الدور اللي بعده" مع بعض.',
 fbPh:'كود مشترك',fbGo:'ابدأ بالكود',fbNum:'رقم الكارت',fbJump:'روح للكارت',fbShort:'اكتب كود من ٣ حروف أو أرقام على الأقل.',fbOn:(c)=>`✅ وضع الكود المشترك شغال بالكود: ${c}. اتأكدوا إن الاتنين كاتبين نفس الكود.`,
 introT:'طريقة اللعب 🎴',
 introBody:`<h3>طريقة اللعب</h3><ol><li>كل واحد بدوره يسحب كارت ويجاوب بصدق، أو يختار حكم وينفّذه.</li><li>فيه عدّاد وقت للإجابة، ولو خلص بينزل حكم تلقائي ⏱️</li><li>كروت سحرية بتظهر كل شوية: حصانة، تبديل، سؤال، ودور مرتين 🃏</li><li>اللعبة بتسخن على ٣ مستويات 🔥</li></ol>
<h3>طريقة الاستخدام 📝</h3><ol><li>اختاروا نوع اللعبة ومستوى الجرأة، واكتبوا اسم كل لاعب. الشخصية 👦👧 بتتحدد من الاسم، وتضغط عليها لو عاوز تغيّرها.</li><li>تقدروا تضيفوا أسئلة من عندكم من "➕ أضيفوا أسئلتكم" قبل ما تبدأوا.</li><li>اضغطوا <b>"ابدأ اللعب"</b> وبعدين على الكارت.</li><li>على موبايل واحد؟ اتبادلوا الدور وجاوبوا بصوتكم.</li></ol>
<h3>اللعب من مكانين 🌍</h3><ol><li>الاتنين يضغطوا "العبوا من مكانين مختلفين" ويكتبوا اسمهم.</li><li>واحد يضغط <b>"غرفة جديدة"</b> ويبعت الكود أو الرابط للتاني.</li><li>التاني يفتح الرابط (أو يكتب الكود ويضغط <b>"دخول"</b>).</li><li>لما يظهر "الاتنين موجودين" 🟢 ابدأوا اللعب.</li><li>لو حد خرج، لما يفتح الرابط تاني يرجع لنفس الغرفة واللعبة تكمل من مكانها.</li></ol>`,
 // buttons that do not depend on gender
 skEn:'',dnAns:'جاوبت ✅',dnFo:'نفّذت الحكم ✅',dnJ:'تمام ✅',dnJ2:'خلّصنا ✅'
},
en:{
 docTitle:'Cards Between Us 💬',title:'Cards Between Us 💬',tagline:'Questions and dares that bring you closer and make you laugh',
 p1:'Player 1',p2:'Player 2',phName:'Type a name',you:' (you)',player:'Player',waitOther:'Waiting for the other player',avatarAria:'Switch character (boy/girl)',
 packsT:'Choose a pack',intensT:'Intensity',
 pk_gen:'🎲 General',pk_friends:'👫 Friends',pk_couples:'💑 Couples',pk_family:'👨‍👩‍👧 Family',pk_work:'💼 Colleagues',pk_quick:'⚡ Quick',
 pd_gen:'A bit of everything',pd_friends:'Memories and laughs between friends',pd_couples:'Questions that bring you closer',pd_family:'About home and family',pd_work:'About work and study',pd_quick:'20 cards with a 15-second timer',
 it_light:'🙂 Light',it_grad:'🔥 Gradual',it_bold:'🌶️ Bold',
 start:'Start playing 🎴',onl:'🌍 Play from two places',share:'📤 Share & invite',how:'❓ How to play',
 timerOpt:'⏱️ Answer timer',sndOn:'🔊 Sound on',sndOff:'🔇 Sound off',langBtn:'🌐 عربي',
 theme_classic:'🎨 Theme: Classic',theme_dark:'🎨 Theme: Dark',theme_light:'🎨 Theme: Light',
 inst:'📲 Install the game',iosHelp:'On iPhone: tap the Share button ⬆️ in Safari, then "Add to Home Screen".',
 cqSum:'➕ Add your own questions',cqPh:'Write your question...',cqAdd:'Add',cqDel:'Delete question',cqAria:'Your question',cqLvAria:'Question level',
 menu:'☰ Settings',settings:'⚙️ Settings',close:'Close',rst:'🔄 Start over',rstSure:'Sure? Tap again to confirm',
 lv0:'Warm-up 😄',lv1:'Closer 💭',lv2:'Bold 🔥',
 cat_f:'Funny 😂',cat_m:'Memories 🕰️',cat_d:'Dreams ✨',cat_h:'Deeper 💭',cat_c:'Dare ⚡',cat_u:'Yours 💬',tagJoker:'Magic card 🃏',tagForfeit:'Forfeit 😈',
 whoTurn:'Turn: ',whoForfeit:'Forfeit for: ',whoCard:'Card for: ',
 jk0:'🛡️ Immunity',jk1:'🔄 Swap',jk2:'🎤 Ask away',jk3:'⚡ Double turn',
 nx:'Next turn',nxEnd:'Finish 🎉',ansWrite:'Write your answer (optional)',ansPh:'Type here...',
 rx_f:'Laugh',rx_s:'Surprise',rx_l:'Love',rx_c:'Applause',rxGroup:'Reactions',
 endT:'You finished all the cards! 🎉',endP:'You surely learned new things about each other. Honest talk brings people closer.',
 awardsT:'🏆 Game highlights',aw_talk:'🗣️ Chatterbox',aw_forfeit:'😈 Forfeit magnet',aw_skip:'🛡️ Immunity master',aw_timeout:'⏱️ Beaten by the clock',aw_react:'🎉 Biggest cheerleader',aw_none:'🎉 You made it to the end, and that is an achievement!',
 memoBtn:'🖼️ Memory card',copyAns:'📋 Copy answers',copied:'Copied ✔',copyFail:'Could not copy',again:'Play again',
 recSkip:(w)=>`🛡️ ${w} skipped the question`,recForfeit:(w,f)=>`😈 ${w} did a forfeit: ${f}`,recVerbal:'(answered out loud)',recForfeitLbl:'Forfeit: ',
 memoT:'Memory card 💌',memoSave:'⬇️ Download image',memoShare:'📤 Share',memoName:'Cards Between Us',memoCards:'cards played',memoAns:'answers',memoFor:'forfeits',memoMagic:'magic cards',memoMade:'Made with love in Cards Between Us',memoFail:'Could not create the image',
 shareTitle:'Cards Between Us',shareText:'Come play "Cards Between Us" 🎴 questions and dares that bring us closer and make us laugh:',linkCopied:'Game link copied ✔',
 turnTitle:'🔔 Your turn! — Cards Between Us',
 roomNote:'Create a room and send the code or link to your friend. That is all you need.',roomNew:'➕ New room',roomCodePh:'Room code',roomJoin:'Join',
 roomIn:(c,o)=>`🟢 Room ${c.toUpperCase()} • ${o?'both players here':'waiting for the other player'}`,roomInvite:'📤 Send invite',roomLeave:'Leave room',
 roomInviteText:(c)=>`Come play "Cards Between Us" 🎴 Room code: ${c.toUpperCase()}`,roomMaking:'Creating the room...',roomJoining:'Joining the room...',
 roomNone:'There is no room with this code. Check the code.',roomFull:'This room already has two players.',
 roomFail:'Could not reach the room server. Check your internet, or try the manual method below.',roomDenied:'The room server refused the request (Firebase rules). Try the manual method below.',
 roomBad:'The code must be 4 to 10 letters or numbers.',roomWeak:'The connection is weak... trying to recover.',manualSum:'Manual method (if rooms do not work)',
 lobNote:'No accounts needed. You will send each other two codes once, for example on WhatsApp.',myName:'Your name',bh:'I will start',bg:'My friend sent me a code',
 hStep1:'1) Copy the code and send it to your friend:',copyCode:'Copy code',hStep2:'2) When you get the reply code back, paste it here:',connect:'Connect',
 gStep1:'1) Paste the code your friend sent:',mkr:'Create reply code',gStep2:'2) Copy the reply code and send it back:',codeAria:'Code',replyAria:'Reply code',
 sPrep:'Preparing the code...',sCopySend:'Copy the code and send it to your friend.',sConnecting:'Connecting...',sBad:'The code is not valid. Make sure you pasted all of it.',sReplyPrep:'Preparing the reply code...',
 sReplyReady:'Copy the reply code and send it back. Your friend will tap "Connect".',sConnected:'🟢 Connected! The game is now live between you.',sDropped:'The connection dropped. The game continues from where you left off once you reconnect.',
 sCopied:'Copied ✔ Send it to your friend.',sCopyManual:'Long-press the code and copy it.',sNoRtc:'This browser does not support direct connections.',sFailed:'Could not connect. Your network may block direct connections.',sSlow:'Connecting is taking too long. Your network may be blocking it.',
 fbText:'⚠️ Direct connection does not work on your network. Try another network, or play with a shared code while on a voice call: both type the same code to get the same cards in the same order, and tap "Next turn" together.',
 fbPh:'Shared code',fbGo:'Start with code',fbNum:'Card number',fbJump:'Go to card',fbShort:'Enter a code with at least 3 letters or numbers.',fbOn:(c)=>`✅ Shared-code mode is on with code: ${c}. Make sure you both typed the same code.`,
 introT:'How to play 🎴',
 introBody:`<h3>How to play</h3><ol><li>Take turns drawing a card and answering honestly, or pick a forfeit and do it.</li><li>There is an answer timer. If it runs out, a forfeit drops automatically ⏱️</li><li>Magic cards appear now and then: immunity, swap, ask away and double turn 🃏</li><li>The game heats up across 3 levels 🔥</li></ol>
<h3>How to use it 📝</h3><ol><li>Choose a pack and an intensity, and type each player's name. The character 👦👧 is picked from the name; tap it to change it.</li><li>You can add your own questions under "➕ Add your own questions" before you start.</li><li>Tap <b>"Start playing"</b>, then tap the card.</li><li>On one phone? Pass it around and answer out loud.</li></ol>
<h3>Play from two places 🌍</h3><ol><li>Both tap "Play from two places" and type your names.</li><li>One taps <b>"New room"</b> and sends the code or link to the other.</li><li>The other opens the link (or types the code and taps <b>"Join"</b>).</li><li>When you see "both players here" 🟢, start playing.</li><li>If someone leaves, opening the link again brings them back to the same room and the game continues.</li></ol>`,
 dnAns:'I answered ✅',dnFo:'Forfeit done ✅',dnJ:'Got it ✅',dnJ2:'Done ✅',
 sk:'Pick a forfeit 😈',tk:'🛡️ Use immunity',sw:'🔄 Let the other player answer'
}};

function T(k,...a){const v=(STR[LANG]&&STR[LANG][k]!==undefined)?STR[LANG][k]:STR.ar[k];return typeof v==='function'?v(...a):(v===undefined?k:v)}

/* Dynamic, context-dependent text. c = {a:answerer seat, b:other seat, name, who, gname, ...} */
const TX={
 sk(a){return LANG==='en'?T('sk'):G(a,'اختار الحكم 😈','اختاري الحكم 😈')},
 tk(a){return LANG==='en'?T('tk'):G(a,'🛡️ استخدم الحصانة','🛡️ استخدمي الحصانة')},
 sw(a,b){return LANG==='en'?T('sw'):G(b,'🔄 خلّي التاني يجاوب','🔄 خلّي التانية تجاوب')},
 front(c){
  if(LANG==='en')return (c.newLv?'🔥 New level: '+c.lvName+'. ':'')+(c.isA?c.name+', tap to draw a card':c.name+"'s turn, hang tight");
  return (c.newLv?'🔥 مستوى جديد: '+c.lvName+'. ':'')+(c.isA?c.name+'، '+G(c.a,'اضغط عشان تسحب','اضغطي عشان تسحبي'):'دور '+c.name+'، '+G(c.b,'استنى','استني')+' شوية')},
 jtext(j,a,b){
  if(LANG==='en')return ['You have immunity! Skip any question once with no forfeit. The button will appear on any question.','Once, you can let the other player answer for you on any question. The button appears on any question.','Ask the other player any question of your own. They must answer honestly, no dodging.','It is your turn twice in a row!'][j];
  const o=G(b,'التاني','التانية');
  if(j===0)return G(a,'معاك حصانة! تتخطى','معاكي حصانة! تتخطي')+' أي سؤال مرة واحدة من غير حكم. الزرار هيظهرلك على أي سؤال.';
  if(j===1)return G(a,'تقدر','تقدري')+' مرة واحدة تخلّي '+o+' '+G(b,'يجاوب','تجاوب')+' بدالك على أي سؤال. الزرار هيظهرلك على أي سؤال.';
  if(j===2)return G(a,'اسأل','اسألي')+' '+o+' أي سؤال من عندك، و'+G(b,'هو لازم يجاوب','هي لازم تجاوب')+' بصدق وبدون ما '+G(b,'يتهرّب','تتهرّب')+'.';
  return 'الدور عليك مرتين ورا بعض!'},
 dn(isJ,j,fo){return isJ?(j===2?T('dnJ2'):T('dnJ')):fo!=null?T('dnFo'):T('dnAns')},
 ansLabel(isA,who){return isA?T('ansWrite'):(LANG==='en'?who+"'s answer:":'إجابة '+who+':')},
 hint(c){ // c:{ph,isJ,isA,isBn,fo,tm,sx,who,a,b,dnLabel}
  const h=[];
  if(LANG==='en'){
   if(c.ph==='answer')h.push(c.isJ?(c.isA?'Read the card, then tap "'+c.dnLabel+'".':'Waiting for '+c.who+'...'):c.isA?(c.fo!=null?'Do the forfeit first, then tap "Forfeit done".':(c.tm?'Answer before the time runs out ⏱️ (or pick a forfeit).':'Answer the question or pick a forfeit to continue.')):'Waiting for '+c.who+' to answer or do the forfeit...');
   else if(c.ph==='next'){if(c.sx)h.push('🛡️ '+c.who+' used immunity and skipped the question.');h.push(c.isA?'Nice! Tap "Next turn" ✔':'Waiting for '+c.who+' to continue...')}
   return h.join('  •  ')}
  const a=c.a,up=G(c.b,'استنى','استني');
  if(c.ph==='answer')h.push(c.isJ?(c.isA?G(a,'اقرا','اقري')+' الكارت وبعدين '+G(a,'دوس','دوسي')+' "'+c.dnLabel.replace(' ✅','')+'".':up+' '+c.who+'...'):c.isA?(c.fo!=null?G(a,'نفّذ','نفّذي')+' الحكم الأول وبعدين '+G(a,'دوس','دوسي')+' "نفّذت الحكم".':(c.tm?G(a,'جاوب','جاوبي')+' قبل ما الوقت يخلص ⏱️ (أو '+G(a,'اختار','اختاري')+' الحكم).':G(a,'جاوب','جاوبي')+' على السؤال أو '+G(a,'اختار','اختاري')+' الحكم عشان '+G(a,'تكمل','تكملي')+'.')):up+' '+c.who+' '+G(a,'يجاوب','تجاوب')+' أو '+G(a,'ينفّذ','تنفّذ')+' الحكم...');
  else if(c.ph==='next'){if(c.sx)h.push('🛡️ '+c.who+' '+G(a,'استخدم','استخدمت')+' الحصانة و'+G(a,'تخطّى','تخطّت')+' السؤال.');h.push(c.isA?'تمام! '+G(a,'دوس','دوسي')+' "الدور اللي بعده" ✔':up+' '+c.who+' '+G(a,'يكمل','تكمل')+'...')}
  return h.join('  •  ')}
};

/* Apply the current language to the static DOM (anything marked with data-i18n*). */
function applyLang(){
  const de=document.documentElement;de.lang=LANG;de.dir=LANG==='ar'?'rtl':'ltr';
  document.title=T('docTitle');
  document.querySelectorAll('[data-i18n]').forEach(e=>{e.textContent=T(e.dataset.i18n)});
  document.querySelectorAll('[data-i18n-html]').forEach(e=>{e.innerHTML=T(e.dataset.i18nHtml)});
  document.querySelectorAll('[data-i18n-ph]').forEach(e=>{e.placeholder=T(e.dataset.i18nPh)});
  document.querySelectorAll('[data-i18n-aria]').forEach(e=>{e.setAttribute('aria-label',T(e.dataset.i18nAria))});
}
