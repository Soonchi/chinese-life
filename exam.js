/* HSK 3.0 full-length mock exams. Original practice items; not copied from CTI papers. */
const HSK_EXAM_CONFIG={
 1:{listening:20,reading:20,writing:0,minutes:35,total:40,pass:60},
 2:{listening:35,reading:25,writing:0,minutes:55,total:60,pass:60},
 3:{listening:40,reading:30,writing:10,minutes:85,total:80,pass:60},
 4:{listening:45,reading:40,writing:15,minutes:100,total:100,pass:60},
 5:{listening:45,reading:45,writing:10,minutes:120,total:100,pass:60},
 6:{listening:50,reading:50,writing:1,minutes:135,total:101,pass:60}
};
let examQuestions=[],examIndex=0,examAnswers=[],examTimer=null,examSeconds=0,examFinished=false,examStartedAt=null;
function examShuffle(a){let b=[...a];for(let i=b.length-1;i>0;i--){let j=Math.floor(Math.random()*(i+1));[b[i],b[j]]=[b[j],b[i]]}return b}
function examPick(a,n){return examShuffle(a).slice(0,Math.min(n,a.length))}
function examUnique(a){return [...new Set(a.filter(x=>x!==undefined&&x!==null&&String(x).trim()!=="").map(String))]}
function examOptions(correct,others){
 let rest=examShuffle(examUnique(others).filter(x=>x!==String(correct))).slice(0,3);
 let opts=examShuffle([String(correct),...rest]);
 return opts;
}
function examChoice(section,prompt,answer,others,extra={}){
 return {type:"choice",section,prompt,answer:String(answer),options:examOptions(answer,others),...extra};
}
function examText(section,prompt,answer,extra={}){
 return {type:"text",section,prompt,answer:String(answer),...extra};
}
function examSelf(section,prompt,extra={}){
 return {type:"self",section,prompt,...extra};
}
function examLevelPool(n){
 return {
  words:VOCAB.filter(x=>Number(x[3])===n),
  grammar:GRAMMAR.filter(x=>Number(x[0])===n),
  phrases:PHRASES.filter(x=>Number(x[4])===n)
 };
}
function buildListeningExam(n,count,pool){
 let out=[],used=new Set(),phraseItems=examShuffle(pool.phrases);
 phraseItems.forEach(p=>{
  if(out.length>=count)return;
  if(used.has("p:"+p[0]))return;
  used.add("p:"+p[0]);
  out.push(examChoice("Nghe hiểu","Nghe câu tiếng Trung rồi chọn nghĩa phù hợp.",p[2],pool.phrases.map(x=>x[2]).concat(pool.words.map(x=>x[2])),{audio:p[0],subpart:"Nghe câu / hội thoại"}));
 });
 let words=examShuffle(pool.words);
 for(let i=0;out.length<count&&i<words.length;i++){
  let w=words[i];if(used.has("w:"+w[0]))continue;used.add("w:"+w[0]);
  out.push(examChoice("Nghe hiểu","Nghe từ tiếng Trung rồi chọn nghĩa đúng.",w[2],pool.words.map(x=>x[2]),{audio:w[0],subpart:"Nghe từ vựng"}));
 }
 while(out.length<count&&pool.words.length){
  let w=pool.words[out.length%pool.words.length];
  out.push(examChoice("Nghe hiểu","Nghe từ tiếng Trung rồi chọn nghĩa đúng.",w[2],pool.words.map(x=>x[2]),{audio:w[0],subpart:"Nghe từ vựng"}));
 }
 return examShuffle(out);
}
function buildReadingExam(n,count,pool){
 let out=[],bank=READING_BANK[n];
 if(bank&&bank.qs){
  examPick(bank.qs,Math.min(5,count)).forEach(x=>out.push(examChoice("Đọc hiểu",bank.text+"\n\n"+x[0],x[2],x[1],{subpart:"Đọc đoạn văn"})));
 }
 let words=examShuffle(pool.words),wi=0,grammar=examShuffle(pool.grammar),gi=0;
 while(out.length<count){
  if(wi<words.length&&(out.length%3!==2||gi>=grammar.length)){
   let w=words[wi++];
   out.push(examChoice("Đọc hiểu","Chọn chữ Hán có nghĩa tương ứng: "+w[2],w[0],pool.words.map(x=>x[0]),{subpart:"Từ vựng trong ngữ cảnh"}));
  }else if(gi<grammar.length){
   let g=grammar[gi++],example=String(g[5]||"").split(/\r?\n/).filter(Boolean)[0]||g[1];
   out.push(examChoice("Đọc hiểu","Đọc ví dụ và chọn cấu trúc phù hợp:\n"+example,g[1],pool.grammar.map(x=>x[1]),{subpart:"Ngữ pháp / điền từ"}));
  }else{
   let w=pool.words[out.length%Math.max(1,pool.words.length)];
   out.push(examChoice("Đọc hiểu","Chọn chữ Hán có nghĩa tương ứng: "+(w?.[2]||""),w?.[0]||"",pool.words.map(x=>x[0]),{subpart:"Từ vựng"}));
  }
 }
 return examShuffle(out);
}
function sentenceSource(n,pool){
 let rows=[];
 pool.phrases.forEach(p=>rows.push(String(p[0]||"").replace(/[。！？!?；;]+$/g,"")));
 pool.grammar.forEach(g=>String(g[5]||"").split(/\r?\n/).filter(Boolean).slice(0,2).forEach(s=>rows.push(s.replace(/[。！？!?；;]+$/g,""))));
 return examUnique(rows).filter(s=>Array.from(s).length>=7&&Array.from(s).length<=34);
}
function buildWritingExam(n,count,pool){
 if(!count)return [];
 let out=[],words=examShuffle(pool.words),sentences=examShuffle(sentenceSource(n,pool));
 if(n===3){
  for(let i=0;i<5&&out.length<count;i++){
   let s=sentences[i%Math.max(1,sentences.length)]||"我每天学习中文";
   let chars=Array.from(s),tokens=examShuffle(chars);
   out.push(examText("Viết","Sắp xếp các chữ sau thành câu hoàn chỉnh:\n"+tokens.join(" / "),s,{subpart:"Sắp xếp câu"}));
  }
  for(let i=0;i<5&&out.length<count;i++){
   let w=words[i%words.length];
   out.push(examText("Viết","Viết chữ Hán tương ứng với pinyin và nghĩa sau:\n"+w[1]+" — "+w[2],w[0],{subpart:"Viết chữ Hán"}));
  }
 }else if(n===4){
  for(let i=0;i<10&&out.length<count;i++){
   let s=sentences[i%Math.max(1,sentences.length)]||"我们应该认真学习中文";
   out.push(examText("Viết","Sắp xếp các chữ sau thành câu đúng:\n"+examShuffle(Array.from(s)).join(" / "),s,{subpart:"Sắp xếp câu"}));
  }
  const prompts=["请用中文写一段话，介绍你平时的工作或学习。","请用中文写一段话，说明你最喜欢的城市以及原因。","请用中文写一段话，描述一次难忘的经历。","请用中文写一段话，介绍你如何安排周末。","请用中文写一段话，谈谈健康生活的重要性。"];
  for(let i=0;i<5&&out.length<count;i++)out.push(examSelf("Viết",prompts[i],{subpart:"Viết đoạn ngắn",minChars:50}));
 }else if(n===5){
  for(let i=0;i<8&&out.length<count;i++){
   let s=sentences[i%Math.max(1,sentences.length)]||"我们应该提高工作效率";
   out.push(examText("Viết","Dùng các từ gợi ý để viết thành câu hoàn chỉnh:\n"+examShuffle(Array.from(s)).join(" / "),s,{subpart:"Hoàn thành câu"}));
  }
  out.push(examSelf("Viết","请根据“学习、机会、努力”三个词写一篇短文。建议写80字左右。",{subpart:"Viết đoạn văn",minChars:80}));
  out.push(examSelf("Viết","请根据“工作与生活的平衡”这个主题写一篇短文。建议写80字左右。",{subpart:"Viết đoạn văn",minChars:80}));
 }else if(n===6){
  const passage=READING_BANK[6]?.text||"在现代社会中，学习和合作非常重要。";
  out.push(examSelf("Viết","阅读下面的文章，然后用自己的话概括主要内容（建议200字左右）：\n"+passage,{subpart:"Tóm tắt văn bản",minChars:100}));
 }
 while(out.length<count){
  let w=words[out.length%Math.max(1,words.length)];
  out.push(examText("Viết","Viết chữ Hán tương ứng với pinyin và nghĩa sau:\n"+(w?.[1]||"") +" — "+(w?.[2]||""),w?.[0]||"",{subpart:"Viết từ"}));
 }
 return out.slice(0,count);
}
function buildExam(){
 let n=level,c=HSK_EXAM_CONFIG[n],pool=examLevelPool(n);
 let out=[...buildListeningExam(n,c.listening,pool),...buildReadingExam(n,c.reading,pool),...buildWritingExam(n,c.writing,pool)];
 return examShuffleBySection(out);
}
function examShuffleBySection(a){
 let l=a.filter(x=>x.section==="Nghe hiểu"),r=a.filter(x=>x.section==="Đọc hiểu"),w=a.filter(x=>x.section==="Viết");
 return [...l,...r,...w];
}
function startExam(){
 if(!levelReady(level)){toast("Bạn cần hoàn thành nội dung HSK "+level+" trước khi thi.");return}
 const cfg=HSK_EXAM_CONFIG[level];
 examQuestions=buildExam();examIndex=0;examAnswers=Array(examQuestions.length).fill(null);examFinished=false;examStartedAt=Date.now();examSeconds=cfg.minutes*60;
 openTab("exam");renderExamQuestion();startExamClock();
}
function startExamClock(){
 if(examTimer)clearInterval(examTimer);
 updateExamClock();
 examTimer=setInterval(()=>{examSeconds--;updateExamClock();if(examSeconds<=0){clearInterval(examTimer);examTimer=null;finishExam(true)}},1000);
}
function updateExamClock(){
 let el=document.getElementById("examClock");if(!el)return;
 let m=Math.floor(Math.max(0,examSeconds)/60),s=Math.max(0,examSeconds)%60;
 el.textContent=String(m).padStart(2,"0")+":"+String(s).padStart(2,"0");
 if(examSeconds<=300)el.classList.add("urgent");
}
function examSaveCurrent(){
 const q=examQuestions[examIndex];if(!q)return;
 if(q.type==="text"){
  const el=document.getElementById("examWrittenAnswer");
  if(el)examAnswers[examIndex]={chosen:el.value.trim(),ok:el.value.trim().replace(/\s/g,"")===q.answer.replace(/\s/g,""),manual:false};
 }
}
function renderExamQuestion(){
 const q=examQuestions[examIndex],total=examQuestions.length,done=examAnswers.filter(Boolean).length;
 const cfg=HSK_EXAM_CONFIG[level],saved=examAnswers[examIndex];
 const prompt=String(q.prompt||"").replace(/</g,"&lt;").replace(/>/g,"&gt;");
 let controls="";
 if(q.type==="choice"){
  controls='<div class="answer-grid exam-answers">'+q.options.map((o,i)=>'<button class="answer-option '+(saved?.chosen===o?"selected":"")+'" data-choice="'+i+'">'+esc(o)+'</button>').join("")+'</div>';
 }else if(q.type==="text"){
  controls='<textarea id="examWrittenAnswer" class="field exam-writing" rows="3" placeholder="Nhập câu trả lời bằng tiếng Trung...">'+esc(saved?.chosen||"")+'</textarea><p class="muted">Đáp án tự động đối chiếu. Cần nhập đúng chữ Hán; dấu câu và khoảng trắng được bỏ qua.</p>';
 }else{
  controls='<textarea id="examWrittenAnswer" class="field exam-writing" rows="6" placeholder="Viết câu trả lời bằng tiếng Trung...">'+esc(saved?.chosen||"")+'</textarea><p class="muted">Phần này cần tự đánh giá. Viết xong, chọn Đạt nếu bài đáp ứng yêu cầu; chọn Chưa đạt nếu cần luyện thêm.</p><div class="actions"><button class="btn green" id="examSelfPass">Tự đánh giá: Đạt</button><button class="btn red" id="examSelfFail">Chưa đạt</button></div>';
 }
 $("examBody").innerHTML='<div class="exam-topline"><span class="exam-chip">'+esc(q.section)+' · '+esc(q.subpart||"")+'</span><b id="examClock">--:--</b></div><div class="exam-meta"><span>Câu '+(examIndex+1)+' / '+total+'</span><span>Đã trả lời '+done+' / '+total+'</span></div><div class="progress"><span style="width:'+Math.round((examIndex+1)/total*100)+'%"></span></div><h3 class="exam-prompt">'+prompt+'</h3>'+(q.audio?'<button class="btn light" id="examAudio">🔊 Nghe lại</button>':"")+controls+'<div class="exam-footer"><button class="btn light" id="examPrev" '+(examIndex===0?"disabled":"")+'>← Câu trước</button><span class="muted">HSK '+level+' · Đề thi thử</span><button class="btn" id="examNext">'+(examIndex===total-1?"Nộp bài":"Câu tiếp →")+'</button></div><div class="exam-jump">'+examQuestions.map((x,i)=>'<button class="'+(i===examIndex?"current":"")+(examAnswers[i]?" answered":"")+'" data-jump="'+i+'" title="Câu '+(i+1)+'">'+(i+1)+'</button>').join("")+'</div>';
 if(q.audio&&$("examAudio"))$("examAudio").onclick=()=>speak(q.audio);
 $("examBody").querySelectorAll("[data-choice]").forEach(b=>b.onclick=()=>{
  let choice=q.options[+b.dataset.choice];examAnswers[examIndex]={chosen:choice,ok:choice===q.answer,manual:false};renderExamQuestion();
 });
 if(q.type==="self"){
  $("examSelfPass").onclick=()=>{let value=$("examWrittenAnswer").value.trim();if(!value){toast("Hãy viết câu trả lời trước.");return}examAnswers[examIndex]={chosen:value,ok:true,manual:true};renderExamQuestion()};
  $("examSelfFail").onclick=()=>{let value=$("examWrittenAnswer").value.trim();if(!value){toast("Hãy viết câu trả lời trước.");return}examAnswers[examIndex]={chosen:value,ok:false,manual:true};renderExamQuestion()};
 }
 $("examPrev").onclick=()=>{examSaveCurrent();if(examIndex>0){examIndex--;renderExamQuestion()}};
 $("examNext").onclick=()=>{examSaveCurrent();if(examIndex<total-1){examIndex++;renderExamQuestion()}else finishExam(false)};
 $("examBody").querySelectorAll("[data-jump]").forEach(b=>b.onclick=()=>{examSaveCurrent();examIndex=+b.dataset.jump;renderExamQuestion()});
 updateExamClock();
}
function finishExam(auto=false){
 if(examFinished)return;
 examSaveCurrent();examFinished=true;if(examTimer){clearInterval(examTimer);examTimer=null}
 let cfg=HSK_EXAM_CONFIG[level],sections=["Nghe hiểu","Đọc hiểu"];if(cfg.writing)sections.push("Viết");
 let stats=sections.map(section=>{let q=examQuestions.map((x,i)=>({x,a:examAnswers[i]})).filter(z=>z.x.section===section),correct=q.filter(z=>z.a?.ok).length;return{section,correct,total:q.length,score:Math.round(correct/Math.max(1,q.length)*100)}});
 let correct=examAnswers.filter(x=>x?.ok).length,total=examQuestions.length,score=Math.round(correct/Math.max(1,total)*100),passed=score>=cfg.pass;
 let scoreMax=cfg.writing?300:200,scoreRaw=Math.round(score/100*scoreMax),required=Math.round(cfg.pass/100*scoreMax);
 let previous=db.examResults?.[level],firstPass=passed&&!previous?.passed;
 db.examResults=db.examResults||{};db.examResults[level]={score,passed,date:new Date().toISOString(),stats,total,correct,scoreRaw,scoreMax,minutes:cfg.minutes};
 if(firstPass){db.examRewards=db.examRewards||{};if(!db.examRewards[level]){db.xp=(db.xp||0)+100;db.examRewards[level]=true;activity("exam")}}
 save();renderHome();
 $("examBody").innerHTML='<div class="exam-result"><div class="eyebrow">KẾT QUẢ THI THỬ HSK '+level+'</div><div class="exam-score">'+score+'%</div><h3>'+(passed?"ĐẠT MỐC ĐIỂM THI THỬ":"CHƯA ĐẠT · CẦN ÔN TẬP THÊM")+'</h3><p><b>'+correct+'/'+total+' câu / nhiệm vụ đạt.</b> Điểm mô phỏng: '+scoreRaw+'/'+scoreMax+' · Mốc mục tiêu: '+required+'/'+scoreMax+'. '+(auto?"Bài thi đã tự động nộp khi hết giờ.":"")+'</p><div class="exam-breakdown">'+stats.map(x=>'<div><span>'+x.section+'</span><b>'+x.correct+'/'+x.total+' · '+x.score+'%</b></div>').join("")+'</div><p class="muted">Đây là điểm luyện tập, không phải điểm CTI. Phần viết tự luận được tự đánh giá; bài viết chưa được AI/chuyên gia chấm.</p>'+(passed&&level<6?'<button class="btn" id="unlockNext">Mở khóa HSK '+(level+1)+' →</button>':'<button class="btn" id="retryExam">Thi lại →</button>')+'<button class="btn light" id="wrongAnswers">Xem đáp án / câu cần ôn</button></div>';
 $("unlockNext")?.addEventListener("click",()=>{setLevel(level+1);openTab("home")});
 $("retryExam")?.addEventListener("click",startExam);
 $("wrongAnswers")?.addEventListener("click",()=>{
  $("examBody").innerHTML='<h3>Đáp án và câu cần ôn</h3>'+examQuestions.map((q,i)=>{let a=examAnswers[i],good=a?.ok;return '<article class="grammar-item"><b>Câu '+(i+1)+' · '+esc(q.section)+' · '+(good?"Đạt":"Cần ôn")+'</b><p>'+esc(q.prompt).replace(/\n/g,"<br>")+'</p>'+(q.audio?'<p class="muted">Nội dung nghe: '+esc(q.audio)+'</p>':"")+(q.type==="choice"||q.type==="text"?'<p>Đáp án: <b>'+esc(q.answer)+'</b></p>':"")+(a?.chosen?'<p class="muted">Bài làm: '+esc(a.chosen)+'</p>':"")+'</article>'}).join("")+'<button class="btn" id="backExamResult">Quay lại kết quả</button>';
  $("backExamResult").onclick=()=>showExamResult(score,correct,total,passed,stats,scoreRaw,scoreMax,required,auto);
 });
}
function showExamResult(score,correct,total,passed,stats,scoreRaw,scoreMax,required,auto){
 $("examBody").innerHTML='<div class="exam-result"><div class="eyebrow">KẾT QUẢ THI THỬ HSK '+level+'</div><div class="exam-score">'+score+'%</div><h3>'+(passed?"ĐẠT MỐC ĐIỂM THI THỬ":"CHƯA ĐẠT · CẦN ÔN TẬP THÊM")+'</h3><p><b>'+correct+'/'+total+' câu / nhiệm vụ đạt.</b> Điểm mô phỏng: '+scoreRaw+'/'+scoreMax+' · Mốc mục tiêu: '+required+'/'+scoreMax+'.</p><div class="exam-breakdown">'+stats.map(x=>'<div><span>'+x.section+'</span><b>'+x.correct+'/'+x.total+' · '+x.score+'%</b></div>').join("")+'</div><p class="muted">Điểm luyện tập, không phải điểm CTI. Phần viết tự luận được tự đánh giá.</p>'+(passed&&level<6?'<button class="btn" id="unlockNext">Mở khóa HSK '+(level+1)+' →</button>':'<button class="btn" id="retryExam">Thi lại →</button>')+'<button class="btn light" id="wrongAnswers">Xem đáp án / câu cần ôn</button></div>';
 $("unlockNext")?.addEventListener("click",()=>{setLevel(level+1);openTab("home")});$("retryExam")?.addEventListener("click",startExam);
 $("wrongAnswers")?.addEventListener("click",()=>{examIndex=0;finishExamReview()});
}
function finishExamReview(){
 const list=examQuestions.map((q,i)=>{let a=examAnswers[i];return '<article class="grammar-item"><b>Câu '+(i+1)+' · '+esc(q.section)+' · '+(a?.ok?"Đạt":"Cần ôn")+'</b><p>'+esc(q.prompt).replace(/\n/g,"<br>")+'</p>'+(q.type!=="self"?'<p>Đáp án: <b>'+esc(q.answer)+'</b></p>':"")+(a?.chosen?'<p class="muted">Bài làm: '+esc(a.chosen)+'</p>':"")+'</article>'}).join("");
 $("examBody").innerHTML='<h3>Đáp án và câu cần ôn</h3>'+list+'<button class="btn" id="backExamResult">Quay lại kết quả</button>';
 $("backExamResult").onclick=()=>renderExamQuestionResult();
}
function renderExamQuestionResult(){
 const r=db.examResults?.[level];if(!r)return;
 showExamResult(r.score,r.correct,r.total,r.passed,r.stats,r.scoreRaw,r.scoreMax,Math.round(r.scoreMax*.6),false);
}
