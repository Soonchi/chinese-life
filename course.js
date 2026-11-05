function initCourse(){
 db.grammarDone=db.grammarDone||{};db.phraseDone=db.phraseDone||{};db.examResults=db.examResults||{};
 const max=maxUnlockedLevel();level=Math.min(Math.max(1,Number(db.level)||1),max,6);db.level=level;save();
 $("levelSelect").innerHTML=[1,2,3,4,5,6].map(n=>'<option value="'+n+'">'+n+'</option>').join("");$("levelSelect").value=level;
 renderHome();renderGrammar();renderPhrases();
 $("examStart")?.addEventListener("click",startExam);
 $("courseProgress")?.addEventListener("click",e=>{if(e.target.closest("[data-start-exam]"))startExam()});
}
function maxUnlockedLevel(){let n=1;for(let i=1;i<=6;i++){if(db.examResults?.[i]?.passed)n=i+1;else break}return Math.min(6,n)}
function levelProgress(n){
 const w=VOCAB.filter(x=>x[3]===n),g=GRAMMAR.map((x,i)=>({x,i})).filter(x=>x.x[0]===n),p=PHRASES.map((x,i)=>({x,i})).filter(x=>x.x[4]===n);
 return{words:w.filter(x=>db.words[x[0]]?.status==="known").length,wordTotal:w.length,grammar:g.filter(x=>db.grammarDone[x.i]).length,grammarTotal:g.length,phrases:p.filter(x=>db.phraseDone[x.i]).length,phraseTotal:p.length}
}
function levelReady(n){let p=levelProgress(n);return p.wordTotal>0&&p.words===p.wordTotal&&p.grammar===p.grammarTotal&&p.phrases===p.phraseTotal}
function setLevel(n){if(n<1||n>maxUnlockedLevel()||n>6){toast("Hoàn thành HSK trước để mở cấp tiếp theo.");$("levelSelect").value=level;return}level=n;db.level=n;wi=0;save();$("levelSelect").value=n;renderWords();renderGrammar();renderPhrases();renderHome()}
function renderHome(){
 const unlocked=maxUnlockedLevel();
 $("levelGrid").innerHTML=Array.from({length:6},(_,i)=>{let n=i+1,p=levelProgress(n),all=p.wordTotal+p.grammarTotal+p.phraseTotal,done=p.words+p.grammar+p.phrases,pct=Math.round(done/Math.max(1,all)*100),passed=!!db.examResults?.[n]?.passed,locked=n>unlocked;return '<button class="level-tile '+(level===n?"active":"")+(locked?" locked":"")+'" data-level="'+n+'" '+(locked?"disabled":"")+'><b>'+(locked?"🔒 ":"")+'HSK '+n+(passed?" ✓":"")+'</b><span>'+pct+'% hoàn thành</span></button>'}).join("");
 $("levelGrid").querySelectorAll("[data-level]").forEach(b=>b.onclick=()=>setLevel(+b.dataset.level));
 let p=levelProgress(level),all=p.wordTotal+p.grammarTotal+p.phraseTotal,done=p.words+p.grammar+p.phrases,pct=Math.round(done/Math.max(1,all)*100);
 $("courseProgress").innerHTML='<h3>Tiến độ HSK '+level+'</h3><div class="course-breakdown"><div><b>'+p.words+'/'+p.wordTotal+'</b><small>Từ vựng</small></div><div><b>'+p.grammar+'/'+p.grammarTotal+'</b><small>Ngữ pháp</small></div><div><b>'+p.phrases+'/'+p.phraseTotal+'</b><small>Mẫu câu</small></div></div><div class="progress"><span style="width:'+pct+'%"></span></div><p class="muted">'+pct+'% nội dung hoàn thành</p>'+(levelReady(level)?'<button class="btn" data-start-exam>Đủ điều kiện · Thi tổng kết HSK '+level+' →</button>':'<p class="muted">Đánh dấu đã nhớ toàn bộ từ vựng, đã học toàn bộ ngữ pháp và mẫu câu để mở bài thi.</p>')+(db.examResults?.[level]?.passed?'<p class="evaluation ok">Đã vượt qua cấp này: '+db.examResults[level].score+'%</p>':'');
 let a=Object.values(db.words);$("statKnown").textContent=a.filter(x=>x.status==="known").length;$("statReview").textContent=due().length;$("statWords").textContent=a.length;$("statXp").textContent=db.xp;$("vocabTotal").textContent=VOCAB.filter(x=>x[3]<=6).length.toLocaleString("vi-VN");$("grammarTotal").textContent=GRAMMAR.filter(x=>x[0]<=6).length;
 let tasks=db.activities?.[new Date().toISOString().slice(0,10)]||{},count=Object.values(tasks).filter(Boolean).length;$("todayCount").textContent=count+"/4";$("todayBar").style.width=count*25+"%";
}
function renderGrammar(){
 let q=norm($("grammarSearch").value),a=GRAMMAR.map((g,i)=>({g,i})).filter(x=>x.g[0]<=level&&(!q||norm(x.g.slice(1).join(" ")).includes(q)));
 $("grammarCount").textContent=a.length+" điểm ngữ pháp";
 $("grammarList").innerHTML=a.map(({g,i})=>'<article class="grammar-item"><div class="meta">HSK '+g[0]+' · '+esc(g[2])+' · '+esc(g[3])+'</div><h3>'+esc(g[1])+'</h3>'+(g[4]?'<p class="muted">'+esc(g[4])+'</p>':"")+'<div class="examples">'+String(g[5]||"").split(/\r?\n/).filter(Boolean).slice(0,5).map(x=>'<p>'+esc(x)+'</p>').join("")+'</div>'+(g[0]===level?'<button class="btn '+(db.grammarDone[i]?"green":"light")+'" data-grammar="'+i+'">'+(db.grammarDone[i]?"✓ Đã học":"Đánh dấu đã học")+'</button>':'<small class="muted">Cấp trước</small>')+'</article>').join("")||'<div class="empty">Không tìm thấy ngữ pháp.</div>';
 $("grammarList").querySelectorAll("[data-grammar]").forEach(b=>b.onclick=()=>{db.grammarDone[b.dataset.grammar]=!db.grammarDone[b.dataset.grammar];save();renderGrammar();renderHome()});
}
function renderPhrases(){
 let q=norm($("phraseSearch").value),topic=$("phraseTopic").value,a=PHRASES.map((p,i)=>({p,i})).filter(x=>x.p[4]<=level&&(!q||norm(x.p.join(" ")).includes(q))&&(topic==="all"||x.p[3]===topic));
 $("phraseList").innerHTML=a.map(({p,i})=>'<article class="phrase"><div class="meta">HSK '+p[4]+' · '+esc(p[3])+'</div><h3>'+esc(p[0])+'</h3><p class="pinyin">'+esc(p[1])+'</p><p>'+esc(p[2])+'</p><div class="actions"><button class="btn light" data-say="'+esc(p[0])+'">🔊 Nghe câu</button>'+(p[4]===level?'<button class="btn '+(db.phraseDone[i]?"green":"light")+'" data-phrase="'+i+'">'+(db.phraseDone[i]?"✓ Đã học":"Đánh dấu đã học")+'</button>':'<small class="muted">Cấp trước</small>')+'</div></article>').join("");
 $("phraseList").querySelectorAll("[data-say]").forEach(b=>b.onclick=()=>speak(b.dataset.say));
 $("phraseList").querySelectorAll("[data-phrase]").forEach(b=>b.onclick=()=>{db.phraseDone[b.dataset.phrase]=!db.phraseDone[b.dataset.phrase];save();renderPhrases();renderHome()});
}
const READING_BANK={
1:{text:"我叫小明，今年十岁。我家有三口人：爸爸、妈妈和我。每天早上七点，我吃早饭，然后去学校。星期天我和爸爸去公园。",qs:[["小明今年几岁？",["八岁","十岁","十二岁","十五岁"],"十岁"],["小明家有几口人？",["两口人","三口人","四口人","五口人"],"三口人"],["小明几点吃早饭？",["六点","七点","八点","九点"],"七点"],["小明每天早上去哪儿？",["学校","医院","商店","公园"],"学校"],["星期天小明和谁去公园？",["妈妈","朋友","爸爸","老师"],"爸爸"]]},
2:{text:"今天是星期六，天气很好。小丽上午和朋友去商店买水果，买了苹果和香蕉。下午她在家做作业，晚上看了一会儿电视。",qs:[["今天星期几？",["星期五","星期六","星期日","星期一"],"星期六"],["天气怎么样？",["很冷","下雨","很好","刮风"],"很好"],["小丽上午去哪儿？",["学校","商店","医院","公园"],"商店"],["她买了什么？",["米饭和菜","苹果和香蕉","茶和咖啡","书和笔"],"苹果和香蕉"],["小丽晚上做什么？",["做作业","看电视","去商店","运动"],"看电视"]]},
3:{text:"王明在一家工厂工作。他每天八点上班，先检查机器，再和同事一起生产产品。中午十二点休息一个小时。下班以后，他常常学习中文。",qs:[["王明在哪里工作？",["学校","医院","工厂","银行"],"工厂"],["他几点上班？",["七点","八点","九点","十点"],"八点"],["上班以后先做什么？",["吃饭","检查机器","开会","学习中文"],"检查机器"],["中午休息多长时间？",["半小时","一个小时","两个小时","三小时"],"一个小时"],["下班以后他常常做什么？",["看电影","学习中文","打篮球","购物"],"学习中文"]]},
4:{text:"公司最近调整了生产计划。由于一台设备出现故障，维修人员需要先检查原因，再制定维修方案。经理要求各部门及时沟通，避免影响交货时间。",qs:[["公司为什么调整生产计划？",["订单减少","设备出现故障","员工放假","天气变化"],"设备出现故障"],["谁需要检查设备？",["客户","维修人员","司机","销售人员"],"维修人员"],["维修人员先做什么？",["更换产品","检查原因","联系客户","停止工作"],"检查原因"],["经理要求各部门做什么？",["减少沟通","及时沟通","改变地址","增加价格"],"及时沟通"],["这样做主要为了避免什么？",["影响交货时间","员工迟到","机器变旧","成本下降"],"影响交货时间"]]},
5:{text:"随着市场竞争不断加剧，企业必须持续优化管理流程。一方面要提高生产效率，另一方面也要重视产品质量。只有建立有效的质量管理体系，才能减少浪费并增强客户信任。",qs:[["企业为什么要优化管理流程？",["市场竞争加剧","员工人数增加","天气变冷","厂房搬迁"],"市场竞争加剧"],["企业需要同时重视什么？",["速度和价格","效率和质量","销售和广告","规模和地点"],"效率和质量"],["建立质量管理体系有什么作用？",["增加浪费","减少浪费","延长交货","减少沟通"],"减少浪费"],["有效的质量管理有助于增强谁的信任？",["员工","供应商","客户","竞争对手"],"客户"],["文章主要讨论什么？",["企业流程和质量管理","员工旅游","市场广告","设备购买"],"企业流程和质量管理"]]},
6:{text:"在全球产业链持续调整的背景下，企业面临的不仅是成本压力，还有技术升级与人才培养等多重挑战。管理者需要结合长期战略与实际数据，评估改革措施的可行性，并通过跨部门协作及时发现执行过程中的问题。",qs:[["企业目前面临哪些挑战？",["只有成本压力","技术升级和人才培养等多重挑战","只需扩大厂房","员工休假安排"],"技术升级和人才培养等多重挑战"],["管理者评估改革措施时应结合什么？",["个人感觉","长期战略与实际数据","竞争对手的广告","短期情绪"],"长期战略与实际数据"],["改革措施需要评估什么？",["可行性","颜色","员工年龄","办公地点"],"可行性"],["跨部门协作有什么作用？",["增加流程","及时发现执行问题","减少信息","推迟改革"],"及时发现执行问题"],["文章强调企业应如何应对挑战？",["依靠单一部门","结合战略、数据和协作","停止技术升级","只关注成本"],"结合战略、数据和协作"]]}
};
let examQuestions=[],examIndex=0,examAnswers=[];
function mix(a){return [...a].sort(()=>Math.random()-.5)}
function choose(a,n){let s=mix(a);return Array.from({length:n},(_,i)=>s[i%s.length])}
function answerOptions(correct,others){return mix([correct,...mix([...new Set(others.filter(x=>x!==correct))]).slice(0,3)])}
function buildExam(){
 let n=level,w=VOCAB.filter(x=>x[3]===n),g=GRAMMAR.filter(x=>x[0]===n),p=PHRASES.filter(x=>x[4]===n),out=[];
 choose(w,5).forEach(x=>out.push({part:"Từ vựng",prompt:"Chọn pinyin đúng của từ: "+x[0],answer:x[1],options:answerOptions(x[1],w.map(y=>y[1]))}));
 choose(g,5).forEach(x=>{let example=String(x[5]||"").split(/\r?\n/).filter(Boolean)[0]||x[1];out.push({part:"Ngữ pháp",prompt:"Cấu trúc ngữ pháp phù hợp với ví dụ sau là gì?\n"+example,answer:x[1],options:answerOptions(x[1],g.map(y=>y[1]))})});
 choose(p,5).forEach(x=>out.push({part:"Nghe hiểu",prompt:"Nghe câu tiếng Trung rồi chọn nghĩa đúng.",audio:x[0],answer:x[2],options:answerOptions(x[2],PHRASES.map(y=>y[2]))}));
 choose(READING_BANK[n].qs,5).forEach(x=>out.push({part:"Đọc hiểu",prompt:READING_BANK[n].text+"\n\n"+x[0],answer:x[2],options:mix(x[1])}));
 choose(p,5).forEach(x=>out.push({part:"Hiểu & vận dụng",prompt:"Bạn muốn diễn đạt ý sau bằng tiếng Trung:\n"+x[2],answer:x[0],options:answerOptions(x[0],PHRASES.map(y=>y[0]))}));
 return out;
}
function startExam(){if(!levelReady(level)){toast("Bạn cần hoàn thành nội dung HSK "+level+" trước khi thi.");return}examQuestions=buildExam();examIndex=0;examAnswers=[];openTab("exam");renderExamQuestion()}
function renderExamQuestion(){
 let q=examQuestions[examIndex];$("examBody").innerHTML='<div class="exam-meta"><b>'+q.part+'</b><span>Câu '+(examIndex+1)+'/25</span></div><div class="progress"><span style="width:'+examIndex*4+'%"></span></div><h3>'+esc(q.prompt).replace(/\n/g,"<br>")+'</h3>'+(q.audio?'<button class="btn light" id="examAudio">🔊 Nghe lại</button>':'')+'<div class="answer-grid">'+q.options.map((o,i)=>'<button class="answer-option" data-choice="'+i+'">'+esc(o)+'</button>').join("")+'</div>';
 $("examBody").querySelectorAll("[data-choice]").forEach(b=>b.onclick=()=>{examAnswers.push({q,chosen:q.options[+b.dataset.choice],ok:q.options[+b.dataset.choice]===q.answer});examIndex++;if(examIndex<examQuestions.length)renderExamQuestion();else finishExam()});
 if($("examAudio"))$("examAudio").onclick=()=>speak(q.audio);
}
function finishExam(){
 let total=examAnswers.length,correct=examAnswers.filter(x=>x.ok).length,score=Math.round(correct/total*100),parts=["Từ vựng","Ngữ pháp","Nghe hiểu","Đọc hiểu","Hiểu & vận dụng"],stats=parts.map(part=>{let a=examAnswers.filter(x=>x.q.part===part),c=a.filter(x=>x.ok).length;return{part,c,total:a.length,score:Math.round(c/a.length*100)}}),passed=score>=80&&stats.every(x=>x.score>=60);
 db.examResults[level]={score,passed,date:new Date().toISOString(),stats};if(passed){db.xp+=100;activity("exam")}save();renderHome();
 $("examBody").innerHTML='<div class="exam-result"><div class="eyebrow">KẾT QUẢ HSK '+level+'</div><div class="exam-score">'+score+'%</div><h3>'+(passed?"Chúc mừng! Bạn đã vượt qua HSK "+level:"Chưa đạt yêu cầu · hãy ôn tập và thi lại")+'</h3><p>'+correct+'/25 câu đúng. Điều kiện: tổng điểm từ 80% và mỗi phần ít nhất 60%.</p><div class="exam-breakdown">'+stats.map(x=>'<div><span>'+x.part+'</span><b>'+x.c+'/'+x.total+' · '+x.score+'%</b></div>').join("")+'</div>'+(passed&&level<6?'<button class="btn" id="unlockNext">Mở khóa HSK '+(level+1)+' →</button>':'<button class="btn" id="retryExam">Thi lại →</button>')+'<button class="btn light" id="wrongAnswers">Xem câu sai</button></div>';
 $("unlockNext")?.addEventListener("click",()=>{setLevel(level+1);openTab("home")});$("retryExam")?.addEventListener("click",startExam);
 $("wrongAnswers")?.addEventListener("click",()=>{$("examBody").innerHTML='<h3>Câu cần ôn lại</h3>'+examAnswers.filter(x=>!x.ok).map(x=>'<article class="grammar-item"><b>'+x.q.part+'</b><p>'+esc(x.q.prompt)+'</p><p class="muted">Bạn chọn: '+esc(x.chosen)+'</p><p class="evaluation ok">Đáp án: '+esc(x.q.answer)+'</p></article>').join("")+'<button class="btn" id="backExamResult">Quay lại kết quả</button>'; $("backExamResult").onclick=finishExam});
}
function openTab(id){
 document.querySelectorAll(".view").forEach(v=>v.classList.toggle("active",v.id===id));document.querySelectorAll("[data-tab]").forEach(b=>b.classList.toggle("active",b.dataset.tab===id));
 $("pageTitle").textContent=({home:"Tổng quan",vocab:"Từ vựng HSK "+level,grammar:"Ngữ pháp HSK "+level,phrases:"Mẫu câu giao tiếp",listening:"Luyện nghe hiểu",speaking:"Luyện nói & phản xạ",review:"Ôn tập thông minh",exam:"Thi tổng kết HSK "+level})[id]||"Chinese Daily";if(id==="review")renderReview();window.scrollTo({top:0,behavior:"smooth"});
}
