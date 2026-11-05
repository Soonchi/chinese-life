/* Chinese Life 3.2 - pixel world, multi-district exploration, NPC schedules and bonds */
(()=>{
"use strict";
const scene=document.getElementById("scene");
if(!scene||typeof state==="undefined")return;
const W=480,H=310,T=16;
const canvas=document.createElement("canvas");canvas.id="cl32World";canvas.width=W;canvas.height=H;
scene.appendChild(canvas);
const ctx=canvas.getContext("2d");ctx.imageSmoothingEnabled=false;
const old=[".sun",".cloud",".farhill",".ground",".road",".tree",".building","#npcs","#player",".loclabel",".scenehint"];
old.forEach(sel=>scene.querySelectorAll(sel).forEach(el=>el.style.display="none"));
document.getElementById("cl31Joy")?.remove();document.querySelector(".cl31-hud")?.remove();
const cssLink=document.createElement("link");cssLink.rel="stylesheet";cssLink.href="./v3.2.css";document.head.appendChild(cssLink);
const districts={
 street:{name:"Vân Hải · Khu phố",cn:"云海街道",sky:"#9ed8dc",grass:"#70aa68",path:"#d8bd87",wall:"#d99b69",roof:"#a94f46",accent:"#f3d27d",objects:[["house",65,72],["house",300,67],["tree",40,150],["tree",426,155],["lamp",235,105],["stall",180,62]],npcs:["wang"]},
 shop:{name:"Phố thương mại",cn:"商业街",sky:"#a9d8d9",grass:"#779c6a",path:"#d8bd87",wall:"#e5b47b",roof:"#bd6655",accent:"#ffe19a",objects:[["shop",68,72],["shop",305,72],["tree",30,165],["lamp",240,115],["crate",405,170]],npcs:["seller"]},
 food:{name:"Ngõ ẩm thực",cn:"美食巷",sky:"#edc6a0",grass:"#789c68",path:"#d7b47c",wall:"#df9672",roof:"#984b43",accent:"#ffe09a",objects:[["stall",70,74],["stall",300,70],["tree",34,160],["table",210,165],["lantern",420,90]],npcs:["mei"]},
 home:{name:"Khu nhà ấm áp",cn:"温馨家园",sky:"#a9d6e1",grass:"#78aa72",path:"#d8c18f",wall:"#d7b78b",roof:"#a45b4e",accent:"#ffe3a2",objects:[["house",72,74],["house",315,76],["tree",35,170],["tree",430,165],["bench",235,170]],npcs:["mom"]},
 park:{name:"Công viên hồ sen",cn:"莲花公园",sky:"#a5d9df",grass:"#65a76e",path:"#d9c99a",wall:"#a8c7a0",roof:"#4b8065",accent:"#f4d98b",objects:[["pond",310,120],["tree",45,65],["tree",100,170],["tree",430,65],["bench",190,190],["flower",255,95]],npcs:["friend"]},
 school:{name:"Học viện Vân Hải",cn:"云海学院",sky:"#b4dce1",grass:"#78aa70",path:"#d8c18d",wall:"#dfc18c",roof:"#a9554a",accent:"#f4dc9a",objects:[["school",145,58],["tree",40,165],["tree",430,165],["bench",330,180],["lamp",65,95]],npcs:["teacher"]},
 work:{name:"Trung tâm thương mại",cn:"国际商务中心",sky:"#b5d7df",grass:"#7b9e78",path:"#c8c2a0",wall:"#b7c6c9",roof:"#496b79",accent:"#f0d17d",objects:[["tower",80,38],["tower",300,42],["tree",35,180],["tree",435,180],["lamp",240,125]],npcs:["boss"]}
};
let zone=state.place in districts?state.place:"street";
let px=Math.max(36,Math.min(W-36,(state.x||48)/100*W)),py=H-72;
if(state.y)py-=state.y*2;
let face="down",walk=0,last=performance.now(),moving=false;
const held={};let joy={on:false,id:null,x:0,y:0,dx:0,dy:0};
const relationKey="chinese_life_32_relations";
let bonds={};try{bonds=JSON.parse(localStorage.getItem(relationKey)||"{}")||{}}catch{}
let minute=8*60,dayTick=0;
const npcs={};
function npcList(){return (people[zone]||[]).map((n,i)=>{if(!npcs[n.id])npcs[n.id]={x:W*(n.x||70)/100,y:H-75,phase:i*1.8,dir:1};return {...n,...npcs[n.id]}})}
function persist(){state.x=px/W*100;state.y=Math.max(-8,Math.min(15,(H-72-py)/2));try{save()}catch{}}
function relation(id){return bonds[id]||0}
function setRelation(id,n){bonds[id]=Math.min(100,(bonds[id]||0)+n);localStorage.setItem(relationKey,JSON.stringify(bonds))}
function tile(x,y,color){ctx.fillStyle=color;ctx.fillRect(x,y,T,T);ctx.fillStyle="#ffffff12";ctx.fillRect(x,y,2,2)}
function drawBase(z){
 ctx.fillStyle=z.sky;ctx.fillRect(0,0,W,H);
 ctx.fillStyle="#ffffff55";for(let i=0;i<4;i++){let x=(i*139+28)%W;ctx.fillRect(x,25,27,5);ctx.fillRect(x+7,19,18,6);ctx.fillRect(x+28,25,13,5)}
 ctx.fillStyle=z.grass;ctx.fillRect(0,90,W,H-90);
 for(let y=96;y<H;y+=T)for(let x=0;x<W;x+=T){if((x/T+y/T)%4===0)tile(x,y,z.grass);else if((x/T+y/T)%7===0){ctx.fillStyle="#ffffff14";ctx.fillRect(x+4,y+5,3,2)}}
 ctx.fillStyle=z.path;ctx.fillRect(0,216,W,44);ctx.fillRect(213,90,54,220);
 ctx.fillStyle="#ffffff35";for(let x=0;x<W;x+=32)ctx.fillRect(x,237,16,2);
 ctx.fillStyle="#b69b6b";ctx.fillRect(211,90,3,220);ctx.fillRect(266,90,3,220);
}
function drawTree(x,y){ctx.fillStyle="#79533b";ctx.fillRect(x+10,y+19,8,22);ctx.fillStyle="#326e4c";ctx.fillRect(x+2,y+3,25,22);ctx.fillStyle="#4d9157";ctx.fillRect(x+7,y-3,16,17);ctx.fillStyle="#75ae64";ctx.fillRect(x+9,y+2,6,5)}
function drawBuilding(o,z){
 let [type,x,y]=o;
 if(type==="tree"){drawTree(x,y);return}
 if(type==="pond"){ctx.fillStyle="#5caeb7";ctx.fillRect(x,y,125,58);ctx.fillStyle="#a5e0d8";ctx.fillRect(x+9,y+8,38,3);ctx.fillRect(x+72,y+29,30,3);ctx.fillStyle="#f4b6c5";ctx.fillRect(x+49,y+15,9,5);return}
 if(type==="flower"){for(let i=0;i<7;i++){ctx.fillStyle=i%2?"#e9a7bc":"#f6d67e";ctx.fillRect(x+i*12,y+(i%2)*8,5,5)}return}
 if(type==="bench"){ctx.fillStyle="#704d39";ctx.fillRect(x,y+13,40,6);ctx.fillRect(x+3,y+5,34,7);ctx.fillRect(x+5,y+19,4,9);ctx.fillRect(x+31,y+19,4,9);return}
 if(type==="lamp"||type==="lantern"){ctx.fillStyle="#514b43";ctx.fillRect(x+9,y,4,45);ctx.fillStyle=z.accent;ctx.fillRect(x+4,y-4,14,13);ctx.fillStyle="#fff3b3";ctx.fillRect(x+8,y,6,5);return}
 if(type==="table"||type==="crate"){ctx.fillStyle="#a66a43";ctx.fillRect(x,y+12,38,8);ctx.fillRect(x+4,y+20,5,12);ctx.fillRect(x+29,y+20,5,12);return}
 let w=type==="tower"?75:type==="school"?205:88,h=type==="tower"?166:type==="school"?104:82;
 ctx.fillStyle="#00000025";ctx.fillRect(x+6,y+h,w,h===166?4:5);
 ctx.fillStyle=z.wall;ctx.fillRect(x,y,w,h);
 ctx.fillStyle=z.roof;
 if(type==="tower"){ctx.fillRect(x-5,y-8,w+10,10);ctx.fillRect(x+12,y-20,w-24,12);ctx.fillStyle="#9fd4d9";for(let r=0;r<5;r++)for(let c=0;c<3;c++)ctx.fillRect(x+12+c*19,y+12+r*25,10,13)}
 else{ctx.fillRect(x-8,y-14,w+16,16);ctx.fillRect(x+8,y-21,w-16,8)}
 ctx.fillStyle="#91cbd0";for(let c=0;c<(type==="school"?5:2);c++){ctx.fillRect(x+10+c*(type==="school"?37:36),y+23,17,19);ctx.fillStyle="#fff2c4";ctx.fillRect(x+17+c*(type==="school"?37:36),y+23,3,19);ctx.fillStyle="#91cbd0"}
 ctx.fillStyle="#79513d";ctx.fillRect(x+w/2-8,y+h-27,16,27);
 ctx.fillStyle=z.accent;ctx.fillRect(x+w/2-16,y+5,32,12);
 ctx.fillStyle="#513b32";ctx.font="bold 8px monospace";ctx.textAlign="center";ctx.fillText(type==="school"?"学  院":type==="tower"?"云海":type==="stall"?"小吃店":type==="shop"?"便利店":"民  居",x+w/2,y+14);
}
function drawSprite(x,y,color,step,isPlayer=false,name=""){
 const bob=step?Math.sin(walk*10)*2:0;y+=bob;
 ctx.fillStyle="#00000035";ctx.fillRect(x-9,y+23,19,4);
 // feet
 ctx.fillStyle="#453c38";ctx.fillRect(x-6,y+18,5,7);ctx.fillRect(x+2,y+18,5,7);
 if(step){ctx.fillRect(x-7+(Math.sin(walk*10)>0?2:0),y+23,5,3)}
 // body
 ctx.fillStyle=color;ctx.fillRect(x-9,y+4,18,15);ctx.fillStyle="#ffffff";ctx.fillRect(x-6,y+7,4,3);
 // head, hair and face
 ctx.fillStyle="#edbd98";ctx.fillRect(x-7,y-9,14,14);
 ctx.fillStyle=isPlayer?"#49372f":"#3e3433";ctx.fillRect(x-8,y-11,16,6);ctx.fillRect(x-8,y-6,3,5);
 ctx.fillStyle="#273b42";ctx.fillRect(x+(face==="left"?-5:face==="right"?3:2),y-3,2,2);
 if(name){ctx.font="bold 9px monospace";ctx.textAlign="center";let width=ctx.measureText(name).width+10;ctx.fillStyle="#fff9e9";ctx.fillRect(x-width/2,y-29,width,13);ctx.strokeStyle="#294858";ctx.strokeRect(x-width/2,y-29,width,13);ctx.fillStyle="#294858";ctx.fillText(name,x,y-19)}
}
function drawHud(){
 ctx.fillStyle="#183342d9";ctx.fillRect(8,8,190,31);ctx.fillStyle="#fff";ctx.font="bold 11px monospace";ctx.textAlign="left";ctx.fillText(districts[zone].name,15,21);ctx.fillStyle="#d8c18d";ctx.font="10px monospace";ctx.fillText(districts[zone].cn,15,33);
 const list=npcList();if(list.length){let n=list[0],bond=relation(n.id);ctx.fillStyle="#183342d9";ctx.fillRect(W-143,8,135,34);ctx.fillStyle="#fff";ctx.font="bold 9px monospace";ctx.fillText("♥ "+n.name+"  "+bond+"/100",W-137,21);ctx.fillStyle="#d8c18d";ctx.fillText("NPC · "+scheduleLabel(n.id),W-137,33)}
}
function scheduleLabel(id){const h=Math.floor(minute/60);if(h<7)return"Đang nghỉ";if(h<11)return id==="mom"?"Ở nhà":"Buổi sáng";if(h<14)return id==="seller"||id==="mei"?"Đang làm việc":"Buổi trưa";if(h<18)return"Buổi chiều";return"Buổi tối"}
function render(){
 const z=districts[zone];drawBase(z);z.objects.forEach(o=>drawBuilding(o,z));
 // small decorative paving stones and flowers
 for(let i=0;i<14;i++){let x=(i*53+19)%W,y=278+(i%2)*10;ctx.fillStyle=i%3?"#b5a77d":"#d8cf9c";ctx.fillRect(x,y,5,3)}
 const list=npcList();list.forEach(n=>drawSprite(n.x,n.y,"#d47e69",true,false,n.name));
 drawSprite(px,py,"#4d83a0",moving,true,"");
 drawHud();
}
function nearest(){let list=npcList().sort((a,b)=>Math.hypot(a.x-px,a.y-py)-Math.hypot(b.x-px,b.y-py));return list[0]&&Math.hypot(list[0].x-px,list[0].y-py)<68?list[0]:null}
function interact(){
 const n=nearest();if(!n){if(typeof toast==="function")toast("Đi lại gần NPC hơn để trò chuyện.");return}
 state.x=70;state.y=0;setRelation(n.id,3);persist();
 try{talk(n.id)}catch(e){toast("NPC này chưa có hội thoại trong bản hiện tại.")}
 updateRelation();
}
function updateRelation(){const n=nearest();let h=document.getElementById("cl32Hint");if(h)h.textContent=n?"💬 Nhấn Tương tác: "+n.name:"🕹️ Khám phá bản đồ và tìm NPC"}
function switchZone(p){
 if(!districts[p])return;
 zone=p;state.place=p;px=235;py=H-72;state.x=49;state.y=0;
 if(!state.visited.includes(p))state.visited.push(p);
 if(typeof save==="function")save();
 document.querySelectorAll(".nav button").forEach(b=>b.classList.toggle("active",b.dataset.place===p));
 const label=document.getElementById("loclabel");if(label)label.textContent="📍 "+districts[p].name+" · "+districts[p].cn;
 updateRelation();render();
 if(typeof toast==="function")toast("Đã đến "+districts[p].name);
}
function openCity(){
 let html='<div class="cl32-city-head"><b>🧭 BẢN ĐỒ THÀNH PHỐ VÂN HẢI</b><small>Chọn khu vực để khám phá</small></div><div class="cl32-city-grid">';
 Object.entries(districts).forEach(([id,z])=>{html+='<button class="cl32-district" data-zone="'+id+'"><b>'+({street:"🏘️",shop:"🛒",food:"🍜",home:"🏠",park:"🌳",school:"🎓",work:"🏢"}[id])+" "+z.name+'</b><small>'+z.cn+'</small></button>'});
 html+='</div><button class="btn light" id="cl32CityClose" style="width:100%;margin-top:9px">Đóng bản đồ</button>';
 const back=document.getElementById("modalback"),modal=document.getElementById("modal");modal.innerHTML=html;back.classList.add("show");modal.querySelectorAll("[data-zone]").forEach(b=>b.onclick=()=>{back.classList.remove("show");switchZone(b.dataset.zone)});document.getElementById("cl32CityClose").onclick=()=>back.classList.remove("show");
}
function relationPanel(){
 const list=npcList();let n=list[0];if(!n){toast("Khu vực này không có NPC.");return}
 const value=relation(n.id),lvl=value>=75?"Thân thiết":value>=35?"Bạn bè":value>=10?"Quen biết":"Mới gặp";
 const modal=document.getElementById("modal"),back=document.getElementById("modalback");
 modal.innerHTML='<h2>🤝 Quan hệ nhân vật</h2><p><b>'+n.name+' · '+n.role+'</b></p><p>Mức độ: <b>'+lvl+'</b> · '+value+'/100 điểm thân thiết</p><div class="cl32-bondbar"><span style="width:'+value+'%"></span></div><p class="muted">Trò chuyện để tăng 3 điểm thân thiết. Tặng quà sẽ tăng thêm điểm nếu bạn có đủ tiền.</p><div class="cl32-gifts"><button class="btn gold" id="cl32GiftTea">🍵 Tặng trà · 8 元 (+8)</button><button class="btn light" id="cl32GiftBook">📚 Tặng sách · 15 元 (+15)</button></div><button class="btn light" id="cl32RelClose" style="width:100%;margin-top:10px">Đóng</button>';
 back.classList.add("show");
 document.getElementById("cl32RelClose").onclick=()=>back.classList.remove("show");
 document.getElementById("cl32GiftTea").onclick=()=>gift(n.id,8,8,back);
 document.getElementById("cl32GiftBook").onclick=()=>gift(n.id,15,15,back);
}
function gift(id,cost,points,back){if(state.coins<cost){toast("Bạn chưa đủ tiền mua quà.");return}state.coins-=cost;setRelation(id,points);if(typeof stats==="function")stats();if(typeof save==="function")save();relationPanel();toast("Tặng quà thành công! +"+points+" thân thiết.")}
function buildControls(){
 const joy=document.createElement("div");joy.className="cl32-joy";joy.id="cl32Joy";joy.innerHTML='<div class="cl32-joy-ring"></div><div class="cl32-joy-knob" id="cl32Knob"></div>';scene.appendChild(joy);
 const actions=document.createElement("div");actions.className="cl32-actions";actions.innerHTML='<button id="cl32Interact" class="cl32-action">💬</button><button id="cl32Relation" class="cl32-action secondary">♥</button>';scene.appendChild(actions);
 const hint=document.createElement("div");hint.id="cl32Hint";hint.className="cl32-hint";hint.textContent="🕹️ Kéo joystick để khám phá";scene.appendChild(hint);
 joy.addEventListener("pointerdown",e=>{e.preventDefault();joy.setPointerCapture(e.pointerId);joy.on=true;joy.pid=e.pointerId;joyMove(e)});
 joy.addEventListener("pointermove",e=>{if(joy.on&&e.pointerId===joy.pid)joyMove(e)});
 ["pointerup","pointercancel","lostpointercapture"].forEach(k=>joy.addEventListener(k,joyStop));
 document.getElementById("cl32Interact").onclick=interact;document.getElementById("cl32Relation").onclick=relationPanel;
 document.getElementById("interact").onclick=interact;
 document.getElementById("cityBtn").onclick=openCity;
}
function joyMove(e){const r=document.getElementById("cl32Joy").getBoundingClientRect();let dx=e.clientX-(r.left+r.width/2),dy=e.clientY-(r.top+r.height/2),max=r.width*.31,l=Math.hypot(dx,dy)||1;if(l>max){dx=dx/l*max;dy=dy/l*max}joy.dx=dx/max;joy.dy=dy/max;const k=document.getElementById("cl32Knob");k.style.transform="translate("+dx+"px,"+dy+"px)"}
function joyStop(){joy.on=false;joy.dx=joy.dy=0;const k=document.getElementById("cl32Knob");if(k)k.style.transform="translate(0,0)"}
function keyDown(e){const map={ArrowLeft:"left",a:"left",A:"left",ArrowRight:"right",d:"right",D:"right",ArrowUp:"up",w:"up",W:"up",ArrowDown:"down",s:"down",S:"down"};if(map[e.key]){held[map[e.key]]=true;e.preventDefault()}if(e.key===" "||e.key==="Enter"){if(!document.getElementById("modalback").classList.contains("show"))interact()}}
function keyUp(e){const map={ArrowLeft:"left",a:"left",A:"left",ArrowRight:"right",d:"right",D:"right",ArrowUp:"up",w:"up",W:"up",ArrowDown:"down",s:"down",S:"down"};if(map[e.key])held[map[e.key]]=false}
function update(dt){
 const speed=105;let x=(held.right?1:0)-(held.left?1:0)+joy.dx,y=(held.down?1:0)-(held.up?1:0)+joy.dy;let len=Math.hypot(x,y);if(len>1){x/=len;y/=len}
 moving=Math.abs(x)+Math.abs(y)>.08;
 if(moving){px=Math.max(18,Math.min(W-18,px+x*speed*dt));py=Math.max(104,Math.min(H-25,py+y*speed*dt));walk+=dt*8;face=Math.abs(x)>Math.abs(y)?(x<0?"left":"right"):(y<0?"up":"down");state.energy=Math.max(0,state.energy-dt*.16);state.x=px/W*100;state.y=Math.max(-8,Math.min(15,(H-72-py)/2))}
 // NPCs stroll around their home area, with small idle loops
 const arr=people[zone]||[];arr.forEach((n,i)=>{let a=npcs[n.id]||(npcs[n.id]={x:W*(n.x||70)/100,y:H-75,phase:i,dir:1});a.phase+=dt;a.x+=Math.sin(a.phase*.45)*dt*3;a.x=Math.max(45,Math.min(W-45,a.x));a.y=H-75+Math.sin(a.phase*.8)*2});
 minute=(minute+dt*2)%1440;dayTick+=dt;
 if(dayTick>2){dayTick=0;if(typeof save==="function")save()}
 updateRelation();
}
function loop(now){let dt=Math.min(.04,(now-last)/1000);last=now;update(dt);render();requestAnimationFrame(loop)}
// Keep existing navigation buttons, but make each one switch the pixel-art district.
document.querySelectorAll(".nav button").forEach(b=>b.onclick=()=>switchZone(b.dataset.place));
document.querySelectorAll("[data-move]").forEach(b=>{b.onclick=()=>{let d=b.dataset.move;held[d]=true;setTimeout(()=>held[d]=false,170)}});
document.addEventListener("keydown",keyDown);document.addEventListener("keyup",keyUp);
window.addEventListener("blur",()=>Object.keys(held).forEach(k=>held[k]=false));
buildControls();
switchZone(zone);
requestAnimationFrame(loop);
})();