/* Chinese Life 3.1: HSK campaign + voice-gated progression + mobile joystick */
(()=>{
"use strict";
const KEY="chinese_life_31_campaign";
const chapters=[
 {h:1,name:"Khởi đầu tại Vân Hải",place:"street",icon:"🏮",seal:"Con dấu Khởi Nguyên",story:"Bạn đến Vân Hải với một bức thư cuối cùng của người anh mất tích: “Sáu con dấu sẽ dẫn em đến sự thật. Đừng chỉ học ngôn ngữ — hãy dùng nó để sống.”",tasks:[
  {npc:"小王 · Hàng xóm",q:"你好！你叫什么名字？",py:"Nǐ hǎo! Nǐ jiào shénme míngzi?",vi:"Xin chào! Bạn tên là gì?",answers:["我叫安。","我叫小明。"],hint:"Giới thiệu bản thân bằng 我叫…",reward:"Bạn đã có người bạn đầu tiên ở Vân Hải."},
  {npc:"老板 · Chủ cửa hàng",q:"你想买什么？",py:"Nǐ xiǎng mǎi shénme?",vi:"Bạn muốn mua gì?",answers:["我要买一瓶水。","我想买一个苹果。"],hint:"Nói món đồ bạn muốn mua bằng 我要买…",reward:"Trong hóa đơn có ký hiệu đầu tiên của bức thư."}
 ]},
 {h:2,name:"Thành phố không ngủ",place:"shop",icon:"🚉",seal:"Con dấu Hành Trình",story:"Một tấm vé tàu cũ xuất hiện trong ngăn kéo. Điểm đến đã bị xóa. Người bán vé nói chỉ có thể giúp bạn nếu bạn tự hỏi đường và giải thích mình cần đến đâu.",tasks:[
  {npc:"司机 · Bác tài",q:"你要去哪里？",py:"Nǐ yào qù nǎlǐ?",vi:"Bạn muốn đi đâu?",answers:["我要去火车站。","我想去学校。"],hint:"Dùng 我要去… hoặc 我想去…",reward:"Bạn tìm được tuyến tàu dẫn đến học viện."},
  {npc:"售票员 · Nhân viên bán vé",q:"你想买几点的票？",py:"Nǐ xiǎng mǎi jǐ diǎn de piào?",vi:"Bạn muốn mua vé chuyến mấy giờ?",answers:["我想买下午三点的票。","我要买早上八点的票。"],hint:"Trả lời bằng thời gian + 的票.",reward:"Mặt sau vé có tên người anh."}
 ]},
 {h:3,name:"Bí mật học viện",place:"school",icon:"🎓",seal:"Con dấu Tri Thức",story:"Tại học viện, một giáo sư nhận ra nét chữ trong thư. Ông giữ trang nhật ký cuối cùng của anh bạn, nhưng muốn kiểm tra khả năng giải thích và nêu lý do trước khi giao nó.",tasks:[
  {npc:"老师 · Giáo viên",q:"你为什么想学习中文？",py:"Nǐ wèishénme xiǎng xuéxí Zhōngwén?",vi:"Tại sao bạn muốn học tiếng Trung?",answers:["因为我想了解中国文化。","因为中文对我的工作很有帮助。"],hint:"Nêu lý do bằng 因为…",reward:"Giáo sư trao lại trang nhật ký."},
  {npc:"同学 · Bạn học",q:"你觉得学习语言最重要的是什么？",py:"Nǐ juéde xuéxí yǔyán zuì zhòngyào de shì shénme?",vi:"Bạn nghĩ điều quan trọng nhất khi học ngôn ngữ là gì?",answers:["我觉得坚持练习和大胆交流最重要。","我认为听说读写都需要认真练习。"],hint:"Nêu ý kiến bằng 我觉得… hoặc 我认为…",reward:"Một mật mã dẫn đến khu thương mại."}
 ]},
 {h:4,name:"Thương trường",place:"work",icon:"🏙️",seal:"Con dấu Bản Lĩnh",story:"Dấu vết đưa bạn đến một công ty quốc tế. Người anh từng làm ở đây. Muốn xem hồ sơ mật, bạn phải tham gia cuộc họp và bảo vệ đề xuất của mình.",tasks:[
  {npc:"经理 · Quản lý",q:"你认为这个方案怎么样？",py:"Nǐ rènwéi zhège fāng'àn zěnmeyàng?",vi:"Bạn đánh giá phương án này thế nào?",answers:["我认为这个方案比较合适。","我建议我们先分析风险，再决定。"],hint:"Đưa quan điểm hoặc đề xuất bằng 我认为… / 我建议…",reward:"Bạn được quyền truy cập hồ sơ dự án."},
  {npc:"同事 · Đồng nghiệp",q:"如果客户不同意，我们应该怎么办？",py:"Rúguǒ kèhù bù tóngyì, wǒmen yīnggāi zěnme bàn?",vi:"Nếu khách hàng không đồng ý, chúng ta nên làm gì?",answers:["我们应该先了解客户的需求，再提出解决办法。","我会耐心沟通，并寻找双方都能接受的方案。"],hint:"Trả lời có trình tự, dùng 先…再… hoặc 并…",reward:"Hồ sơ hé lộ địa chỉ một khu di tích."}
 ]},
 {h:5,name:"Bí cảnh cổ đại",place:"park",icon:"🏯",seal:"Con dấu Minh Triết",story:"Trong khu di tích, bạn tìm thấy bản ghi chép về một cuộc khảo cổ. Các ký tự cổ được giải thích bằng một tài liệu dài. Bạn phải tóm tắt quan điểm và phân tích bằng lập luận rõ ràng.",tasks:[
  {npc:"研究员 · Nhà nghiên cứu",q:"这份资料主要讨论什么问题？",py:"Zhè fèn zīliào zhǔyào tǎolùn shénme wèntí?",vi:"Tài liệu này chủ yếu bàn về vấn đề gì?",answers:["这份资料主要讨论城市发展与文化遗产保护之间的关系。","作者重点分析了环境变化对当地居民生活的影响。"],hint:"Tóm tắt nội dung chính bằng 这份资料主要讨论…",reward:"Bạn giải mã được ký hiệu thứ năm."},
  {npc:"考古学家 · Nhà khảo cổ",q:"你如何看待保护历史遗产与发展经济之间的关系？",py:"Nǐ rúhé kàndài bǎohù lìshǐ yíchǎn yǔ fāzhǎn jīngjì zhījiān de guānxì?",vi:"Bạn nhìn nhận mối quan hệ giữa bảo tồn di sản và phát triển kinh tế thế nào?",answers:["我认为两者并不矛盾，关键是制定合理的规划并兼顾长远利益。","在我看来，应该在尊重历史价值的基础上，寻找可持续发展的方式。"],hint:"Trình bày quan điểm, lý do và giải pháp; dùng 关键是、在…基础上…",reward:"Cánh cổng cuối cùng đã hiện ra."}
 ]},
 {h:6,name:"Chân tướng cuối cùng",place:"work",icon:"🐉",seal:"Con dấu Chân Tướng",story:"Sáu con dấu đưa bạn đến căn phòng cuối cùng. Người anh không mất tích — anh đã để lại một thử thách cuối để bạn tự chứng minh mình có thể hiểu, trình bày và bảo vệ suy nghĩ bằng tiếng Trung.",tasks:[
  {npc:"守门人 · Người gác cổng",q:"面对误解与冲突，你会如何说服对方？",py:"Miànduì wùjiě yǔ chōngtū, nǐ huì rúhé shuōfú duìfāng?",vi:"Đối mặt với hiểu lầm và xung đột, bạn sẽ thuyết phục đối phương thế nào?",answers:["我会先倾听对方的观点，再用事实和理由说明自己的立场。","我认为沟通的关键在于尊重差异，并寻找双方都能接受的解决办法。"],hint:"Dùng lập luận nhiều vế: 首先、其次、因此、总之。",reward:"Người gác cổng trao lại lá thư cuối cùng."},
  {npc:"哥哥 · Người anh",q:"如果你能给正在学习中文的人一个建议，你会说什么？",py:"Rúguǒ nǐ néng gěi zhèngzài xuéxí Zhōngwén de rén yí ge jiànyì, nǐ huì shuō shénme?",vi:"Nếu có thể đưa một lời khuyên cho người đang học tiếng Trung, bạn sẽ nói gì?",answers:["不要害怕犯错，语言只有在真实交流中不断使用，才能真正成为自己的能力。","我建议大家制定长期目标，坚持积累词汇，并主动创造机会与别人交流。"],hint:"Đưa lời khuyên có lý do và kết luận rõ ràng.",reward:"Bạn đã tìm ra sự thật và hoàn thành hành trình."}
 ]}
];
let p;try{p=JSON.parse(localStorage.getItem(KEY)||"null")||{done:[],unlocked:1}}catch{p={done:[],unlocked:1}}
const total=chapters.reduce((n,c)=>n+c.tasks.length,0);
const norm=s=>(s||"").normalize("NFKC").toLowerCase().replace(/[，。！？、,.!?;；:：\s'"“”]/g,"");
function persist(){p.unlocked=Math.max(p.unlocked,1,...chapters.map((c,i)=>c.tasks.every(t=>p.done.includes(i+"-"+t.q))?i+2:1));localStorage.setItem(KEY,JSON.stringify(p));if(typeof save==="function")save()}
function doneCount(){return p.done.length}
function chapterDone(i){return chapters[i].tasks.every(t=>p.done.includes(i+"-"+t.q))}
function canOpen(i){return i===0||chapterDone(i-1)}
function ensureUI(){
 const content=document.querySelector(".content"),scene=document.querySelector(".scene");
 if(!content||!scene)return;
 const launch=document.createElement("button");launch.className="cl31-launch";launch.id="cl31Launch";launch.innerHTML='<span>⚔️ HÀNH TRÌNH CHINH PHỤC HSK 1–6<small id="cl31Summary">Sáu bí cảnh · Sáu con dấu · Một sự thật</small></span><span class="cl31-badge" id="cl31Count">0/'+total+'</span>';const quest=document.querySelector(".quest");quest?.after(launch);launch.onclick=showCampaign;
 const joy=document.createElement("div");joy.className="cl31-joystick";joy.id="cl31Joy";joy.innerHTML='<div class="cl31-stick" id="cl31Stick"></div>';scene.appendChild(joy);
 const hud=document.createElement("div");hud.className="cl31-hud";hud.innerHTML="🕹️ Joystick cảm ứng<br>Giữ và kéo để di chuyển";scene.appendChild(hud);
 const overlay=document.createElement("div");overlay.className="cl31-overlay";overlay.id="cl31Overlay";overlay.innerHTML='<div class="cl31-window" id="cl31Window"></div>';document.body.appendChild(overlay);
 overlay.addEventListener("click",e=>{if(e.target===overlay)close()});
 setupJoystick();refreshLaunch();
}
function refreshLaunch(){let el=document.getElementById("cl31Count");if(el)el.textContent=doneCount()+"/"+total;let s=document.getElementById("cl31Summary");if(s)s.textContent=doneCount()===total?"Đã hoàn thành toàn bộ chiến dịch!":"Sáu bí cảnh · Sáu con dấu · Một sự thật"}
function open(html){const o=document.getElementById("cl31Overlay");document.getElementById("cl31Window").innerHTML=html;o.classList.add("open")}
function close(){document.getElementById("cl31Overlay")?.classList.remove("open")}
function header(k,title){return '<div class="cl31-head"><div><div class="cl31-kicker">'+k+'</div><div class="cl31-title">'+title+'</div></div><button class="cl31-close" id="cl31Close">✕</button></div>'}
function bindClose(){document.getElementById("cl31Close")?.addEventListener("click",close)}
function showCampaign(){
 let cards=chapters.map((c,i)=>{let d=c.tasks.filter(t=>p.done.includes(i+"-"+t.q)).length,un=canOpen(i),done=chapterDone(i);return '<button class="cl31-chapter '+(done?'done':un?'active':'locked')+'" data-ch="'+i+'" '+(!un?'disabled':'')+'><span>'+c.icon+' HSK '+(i+1)+' '+(done?'✓':un?'':'🔒')+'</span><strong>'+c.name+'</strong><small>'+d+'/2 thử thách · '+c.seal+'</small><div class="cl31-progress"><span style="width:'+(d/2*100)+'%"></span></div></button>'}).join("");
 open(header("CHIẾN DỊCH CỐT TRUYỆN","Sáu bí cảnh Vân Hải")+'<div class="cl31-story"><b>📜 Lời nhắn cuối cùng</b><p>“Hãy tìm sáu con dấu. Mỗi con dấu chỉ mở ra với người thật sự hiểu và sử dụng được ngôn ngữ của vùng đất này.”</p></div><p style="font-size:12px">Hoàn thành đủ hai thử thách giao tiếp ở mỗi cấp để mở chương tiếp theo. Câu trả lời phải được nhận diện từ micro và đạt yêu cầu mới được tính.</p><div class="cl31-chapters">'+cards+'</div><p class="cl31-note">Tiến độ chiến dịch: '+doneCount()+'/'+total+' thử thách. Mỗi thử thách đúng nhận 30 EXP và 10 元.</p>');
 bindClose();document.querySelectorAll("[data-ch]").forEach(b=>b.onclick=()=>showChapter(+b.dataset.ch));
}
function showChapter(i){
 if(!canOpen(i)){open(header("BÍ CẢNH ĐANG KHÓA","Chưa thể tiến vào")+'<p>Hãy hoàn thành toàn bộ thử thách HSK '+i+' trước.</p><button class="cl31-btn gold" id="cl31Back">Quay lại</button>');bindClose();document.getElementById("cl31Back").onclick=showCampaign;return}
 const c=chapters[i],d=c.tasks.filter(t=>p.done.includes(i+"-"+t.q)).length;
 open(header("CHƯƠNG "+(i+1)+" · HSK "+(i+1),c.name)+'<div class="cl31-story"><b>'+c.icon+' '+c.seal+'</b><p>'+c.story+'</p></div><p style="font-size:12px">Tiến độ chương: '+d+'/2 thử thách</p>'+c.tasks.map((t,j)=>'<button class="cl31-chapter '+(p.done.includes(i+"-"+t.q)?'done':'active')+'" style="width:100%;margin-bottom:8px" data-task="'+j+'"><span>'+(p.done.includes(i+"-"+t.q)?'✓ ĐÃ HOÀN THÀNH':'THỬ THÁCH '+(j+1))+'</span><strong>'+t.npc+'</strong><small>'+t.vi+'</small></button>').join("")+'<button class="cl31-btn soft" id="cl31Back">← Danh sách chương</button>');
 bindClose();document.querySelectorAll("[data-task]").forEach(b=>b.onclick=()=>showTask(i,+b.dataset.task));document.getElementById("cl31Back").onclick=showCampaign;
}
function showTask(i,j){
 const c=chapters[i],t=c.tasks[j],key=i+"-"+t.q,already=p.done.includes(key);
 open(header("HSK "+(i+1)+" · THỬ THÁCH "+(j+1),t.npc)+'<div class="cl31-story"><b>🎯 Nhiệm vụ</b><p>'+t.vi+'</p></div><div class="cl31-question">'+t.q+'</div><div class="cl31-pinyin">'+t.py+'</div><div class="cl31-translation">Hãy trả lời bằng tiếng Trung. Chỉ hoàn thành khi micro nhận diện được câu trả lời đạt yêu cầu.</div><div class="cl31-saybox"><label>🎙️ KẾT QUẢ NHẬN DIỆN GIỌNG NÓI</label><div class="cl31-transcript" id="cl31Transcript">Chưa ghi nhận câu trả lời</div><div class="cl31-actions"><button class="cl31-btn" id="cl31Mic">🎙️ BẮT ĐẦU NÓI</button><button class="cl31-btn gold" id="cl31Listen">🔊 NGHE CÂU HỎI</button></div><div class="cl31-result" id="cl31Result">'+(already?'Bạn đã hoàn thành thử thách này. Có thể luyện lại để ôn tập.':'Hãy nói rõ câu trả lời bằng tiếng Trung. Nếu sai, bạn cần nói lại.')+'</div></div><div class="cl31-note">Gợi ý luyện tập: '+t.hint+'<br>Câu trả lời mẫu sẽ chỉ hiện sau khi bạn thử nói, để tránh học vẹt.</div><div class="cl31-actions"><button class="cl31-btn soft" id="cl31Example">Hiện câu mẫu</button><button class="cl31-btn soft" id="cl31Back">← Quay lại</button></div>');
 bindClose();const mic=document.getElementById("cl31Mic"),res=document.getElementById("cl31Result"),trans=document.getElementById("cl31Transcript");
 document.getElementById("cl31Back").onclick=()=>showChapter(i);
 document.getElementById("cl31Listen").onclick=()=>say(t.q);
 document.getElementById("cl31Example").onclick=()=>{res.textContent="Câu mẫu: "+t.answers[0];res.className="cl31-result"};
 mic.onclick=()=>{
  const SR=window.SpeechRecognition||window.webkitSpeechRecognition;
  if(!SR){res.textContent="Trình duyệt không hỗ trợ nhận diện giọng nói. Hãy mở bằng Chrome/Edge hỗ trợ Speech Recognition. Bạn vẫn có thể nghe câu mẫu để luyện tập.";res.className="cl31-result bad";return}
  const r=new SR();r.lang="zh-CN";r.interimResults=false;r.maxAlternatives=5;mic.disabled=true;mic.textContent="ĐANG NGHE…";res.textContent="Đang nghe. Hãy nói trọn câu bằng tiếng Trung…";res.className="cl31-result";
  r.onresult=e=>{const alternatives=Array.from(e.results[0]).map(x=>x.transcript);const best=alternatives[0]||"";trans.textContent=best;const matched=alternatives.find(x=>matches(x,t.answers));if(matched){if(!already){p.done.push(key);p.unlocked=Math.max(p.unlocked,i+1);if(typeof state!=="undefined"){state.xp=(state.xp||0)+30;state.coins=(state.coins||0)+10;if(typeof stats==="function")stats();if(typeof save==="function")save()}persist();refreshLaunch();res.textContent="✓ Chính xác! "+t.reward+" Bạn nhận +30 EXP và +10 元. Thử thách đã hoàn thành.";res.className="cl31-result good";mic.textContent="✓ ĐÃ ĐẠT";mic.disabled=true;setTimeout(()=>{if(chapterDone(i)){open(header("CON DẤU ĐÃ ĐƯỢC MỞ",""+c.seal+" ✨")+'<div class="cl31-story"><b>'+c.name+'</b><p>'+t.reward+'</p></div><p>Chương '+(i+1)+' đã hoàn thành. '+(i<5?'Bí cảnh tiếp theo đã mở khóa!':'Bạn đã chinh phục cả sáu bí cảnh và tìm ra chân tướng!')+'</p><button class="cl31-btn gold" id="cl31Next">Tiếp tục</button>');bindClose();document.getElementById("cl31Next").onclick=()=>i<5?showCampaign():showEnding()}else showChapter(i)},950)}else{res.textContent="✓ Câu trả lời đúng! Bạn đã luyện lại một thử thách đã hoàn thành.";res.className="cl31-result good"}}
  else{res.textContent="Chưa đạt. Hệ thống nhận diện: “"+best+"”. Gợi ý: "+t.hint+" Hãy nghe mẫu và nói lại. Chưa mở khóa nhiệm vụ tiếp theo.";res.className="cl31-result bad";mic.textContent="🎙️ THỬ LẠI";mic.disabled=false}
  };
  r.onerror=e=>{res.textContent="Không nhận diện được giọng nói ("+e.error+"). Kiểm tra quyền microphone, kết nối mạng và thử lại.";res.className="cl31-result bad";mic.textContent="🎙️ THỬ LẠI";mic.disabled=false};
  r.onend=()=>{if(!mic.textContent.includes("ĐÃ ĐẠT")){mic.disabled=false;if(mic.textContent==="ĐANG NGHE…")mic.textContent="🎙️ THỬ LẠI"}};
  try{r.start()}catch(e){mic.disabled=false;mic.textContent="🎙️ THỬ LẠI";res.textContent="Không thể khởi động micro. Hãy kiểm tra quyền truy cập."}
 };
}
function matches(spoken,answers){const a=norm(spoken);return answers.some(x=>{const b=norm(x);if(a===b)return true;return similarity(a,b)>=.91&&Math.min(a.length,b.length)/Math.max(a.length,b.length)>.88})}
function similarity(a,b){let prev=Array.from({length:b.length+1},(_,i)=>i);for(let i=1;i<=a.length;i++){let cur=[i];for(let j=1;j<=b.length;j++)cur[j]=Math.min(cur[j-1]+1,prev[j]+1,prev[j-1]+(a[i-1]===b[j-1]?0:1));prev=cur}return 1-prev[b.length]/Math.max(a.length,b.length,1)}
function say(s){if(!("speechSynthesis"in window))return;const u=new SpeechSynthesisUtterance(s);u.lang="zh-CN";u.rate=.82;speechSynthesis.cancel();speechSynthesis.speak(u)}
function showEnding(){open(header("KẾT THÚC CHIẾN DỊCH","Bức thư cuối cùng")+'<div class="cl31-story"><b>哥哥 · Người anh</b><p>“Em đã làm được. Sáu con dấu không phải chìa khóa của một kho báu. Chúng là bằng chứng rằng em đã đủ tự tin để sống, kết nối và tự viết con đường của mình bằng ngôn ngữ mới.”</p></div><p>🏆 Danh hiệu: Người chinh phục Vân Hải</p><p>Hoàn thành '+total+'/'+total+' thử thách giao tiếp. Hành trình tiếp theo là tiếp tục sử dụng tiếng Trung trong cuộc sống mỗi ngày.</p><button class="cl31-btn gold" id="cl31Done">Xem lại sáu chương</button>');bindClose();document.getElementById("cl31Done").onclick=showCampaign}
function setupJoystick(){
 const pad=document.getElementById("cl31Joy"),knob=document.getElementById("cl31Stick");if(!pad||!knob)return;let active=false,pid=null,dx=0,dy=0,timer=null;
 function position(e){const r=pad.getBoundingClientRect(),cx=r.left+r.width/2,cy=r.top+r.height/2;dx=e.clientX-cx;dy=e.clientY-cy;const max=r.width*.31,len=Math.hypot(dx,dy)||1;if(len>max){dx=dx/len*max;dy=dy/len*max}knob.style.transform="translate("+dx+"px,"+dy+"px)"}
 function start(e){e.preventDefault();active=true;pid=e.pointerId;pad.setPointerCapture(pid);position(e);timer=setInterval(()=>{if(!active)return;let ax=Math.abs(dx),ay=Math.abs(dy);if(Math.max(ax,ay)<9)return;let dir=ax>ay?(dx<0?"left":"right"):(dy<0?"up":"down");if(typeof move==="function")move(dir)},165)}
 function stop(e){if(!active)return;active=false;clearInterval(timer);dx=dy=0;knob.style.transform="translate(0,0)";try{if(pid!==null)pad.releasePointerCapture(pid)}catch{}}
 pad.addEventListener("pointerdown",start);pad.addEventListener("pointermove",e=>{if(active&&e.pointerId===pid)position(e)});["pointerup","pointercancel","lostpointercapture"].forEach(n=>pad.addEventListener(n,stop));
}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",ensureUI);else ensureUI();
})();
