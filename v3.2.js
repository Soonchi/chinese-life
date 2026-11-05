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
function drawTree(x,y){
 ctx.fillStyle="#00000020";ctx.fillRect(x+2,y+37,30,5);
 ctx.fillStyle="#76513a";ctx.fillRect(x+13,y+19,9,25);ctx.fillStyle="#9a6b45";ctx.fillRect(x+15,y+21,3,18);
 ctx.fillStyle="#315d43";ctx.fillRect(x+2,y+12,31,19);ctx.fillRect(x+7,y+4,23,18);ctx.fillRect(x+12,y-2,14,14);
 ctx.fillStyle="#427e50";ctx.fillRect(x+5,y+8,22,18);ctx.fillRect(x+10,y+1,17,17);ctx.fillRect(x+1,y+17,12,10);
 ctx.fillStyle="#6eaa60";ctx.fillRect(x+9,y+5,7,7);ctx.fillRect(x+20,y+11,7,6);ctx.fillRect(x+5,y+19,6,5);
 ctx.fillStyle="#a6c96d";ctx.fillRect(x+12,y+4,3,3);ctx.fillRect(x+23,y+13,3,3);
}
function drawBuilding(o,z){
 let [type,x,y]=o;
 if(type==="tree"){drawTree(x,y);return}
 if(type==="pond"){ctx.fillStyle="#00000025";ctx.fillRect(x+4,y+48,125,9);ctx.fillStyle="#397e8b";ctx.fillRect(x,y+5,125,54);ctx.fillStyle="#58aeb8";ctx.fillRect(x+3,y+2,119,48);ctx.fillStyle="#8bd4d1";ctx.fillRect(x+10,y+10,40,4);ctx.fillRect(x+72,y+29,37,3);ctx.fillStyle="#f4b6c5";ctx.fillRect(x+49,y+15,9,5);ctx.fillRect(x+52,y+12,3,3);ctx.fillStyle="#4c8f73";ctx.fillRect(x+47,y+22,13,2);return}
 if(type==="flower"){for(let i=0;i<7;i++){let fx=x+i*12,fy=y+(i%2)*8;ctx.fillStyle="#4f8b52";ctx.fillRect(fx+2,fy+5,2,9);ctx.fillStyle=i%2?"#e9a7bc":"#f6d67e";ctx.fillRect(fx,fy,6,5);ctx.fillRect(fx+2,fy-2,3,3);ctx.fillStyle="#f7edc0";ctx.fillRect(fx+2,fy+1,2,2)}return}
 if(type==="bench"){ctx.fillStyle="#00000022";ctx.fillRect(x+2,y+27,42,4);ctx.fillStyle="#64432f";ctx.fillRect(x+3,y+18,4,12);ctx.fillRect(x+34,y+18,4,12);ctx.fillStyle="#9d6740";ctx.fillRect(x,y+12,42,7);ctx.fillStyle="#c18a55";ctx.fillRect(x+2,y+5,38,8);ctx.fillStyle="#e0b477";ctx.fillRect(x+5,y+7,31,2);return}
 if(type==="lamp"||type==="lantern"){ctx.fillStyle="#514b43";ctx.fillRect(x+9,y+5,4,43);ctx.fillStyle="#342f2c";ctx.fillRect(x+4,y+1,14,4);ctx.fillStyle="#8c5540";ctx.fillRect(x+3,y-7,16,13);ctx.fillStyle=z.accent;ctx.fillRect(x+5,y-5,12,9);ctx.fillStyle="#fff5c8";ctx.fillRect(x+8,y-3,5,5);ctx.fillStyle="#d8ad55";ctx.fillRect(x+7,y+7,8,2);return}
 if(type==="table"||type==="crate"){ctx.fillStyle="#00000022";ctx.fillRect(x+2,y+27,40,4);ctx.fillStyle="#865638";ctx.fillRect(x+2,y+12,38,19);ctx.fillStyle="#b87a49";ctx.fillRect(x,y+8,42,7);ctx.fillStyle="#d59a5d";ctx.fillRect(x+3,y+10,35,3);ctx.fillStyle="#805136";ctx.fillRect(x+7,y+16,2,12);ctx.fillRect(x+31,y+16,2,12);return}
 let w=type==="tower"?75:type==="school"?205:type==="stall"?92:88;
 let h=type==="tower"?166:type==="school"?104:type==="stall"?72:82;
 ctx.fillStyle="#263c382c";ctx.fillRect(x+7,y+h,w,h===166?7:8);
 ctx.fillStyle="#8a6950";ctx.fillRect(x-3,y+h-8,w+6,9);
 ctx.fillStyle=z.wall;ctx.fillRect(x,y,w,h);
 ctx.fillStyle="#ffffff28";ctx.fillRect(x+3,y+3,5,h-12);ctx.fillStyle="#00000016";ctx.fillRect(x+w-6,y+4,6,h-12);
 ctx.fillStyle="#b88960";for(let yy=y+34;yy<y+h-8;yy+=22)ctx.fillRect(x+2,yy,w-4,2);
 ctx.fillStyle="#f0d4a5";ctx.fillRect(x+8,y+7,3,h-17);ctx.fillRect(x+w-11,y+7,3,h-17);
 ctx.fillStyle=z.roof;
 if(type==="tower"){ctx.fillRect(x-5,y-8,w+10,12);ctx.fillRect(x+10,y-20,w-20,14);ctx.fillRect(x+23,y-27,w-46,8);ctx.fillStyle="#e4a66e";for(let k=0;k<5;k++)ctx.fillRect(x-2+k*16,y-6,9,2)}
 else{ctx.fillRect(x-9,y-13,w+18,15);ctx.fillRect(x-5,y-17,w+10,5);ctx.fillStyle="#d98b61";for(let k=0;k<w;k+=13)ctx.fillRect(x+k,y-12,2,10)}
 const count=type==="school"?5:type==="tower"?3:2;
 for(let c=0;c<count;c++){let wx=x+(type==="school"?13+c*37:type==="tower"?12+c*20:10+c*37),wy=y+(type==="tower"?13:25);ctx.fillStyle="#775642";ctx.fillRect(wx-3,wy-3,23,26);ctx.fillStyle="#8ed1dc";ctx.fillRect(wx,wy,17,20);ctx.fillStyle="#d8f2e8";ctx.fillRect(wx+2,wy+2,5,5);ctx.fillStyle="#4e8290";ctx.fillRect(wx+8,wy,2,20);ctx.fillRect(wx,wy+9,17,2);ctx.fillStyle="#f4d7a2";ctx.fillRect(wx-4,wy+20,25,3)}
 ctx.fillStyle="#78503b";ctx.fillRect(x+w/2-10,y+h-31,20,31);ctx.fillStyle="#b77d50";ctx.fillRect(x+w/2-7,y+h-28,14,25);ctx.fillStyle="#46372f";ctx.fillRect(x+w/2-1,y+h-15,2,2);ctx.fillStyle="#e7c78d";ctx.fillRect(x+w/2-13,y+h-3,26,3);
 ctx.fillStyle=type==="tower"?"#d7e3e1":"#f7e1ae";ctx.fillRect(x+w/2-20,y+5,40,15);ctx.strokeStyle="#80533e";ctx.lineWidth=1;ctx.strokeRect(x+w/2-20,y+5,40,15);ctx.fillStyle="#513b32";ctx.font="bold 8px monospace";ctx.textAlign="center";ctx.fillText(type==="school"?"学 院":type==="tower"?"云海":type==="stall"?"小吃店":type==="shop"?"便利店":"民 居",x+w/2,y+16);
 if(type==="stall"){ctx.fillStyle="#f3d17d";ctx.fillRect(x-3,y+27,w+6,9);for(let k=0;k<7;k++){ctx.fillStyle=k%2?"#fff0c4":"#c95f4f";ctx.fillRect(x-3+k*14,y+27,14,9)}ctx.fillStyle="#80533e";ctx.fillRect(x+7,y+47,w-14,17);ctx.fillStyle="#f2c56f";ctx.fillRect(x+11,y+50,w-22,3)}
}
function drawSpriteBase(x,y,color,step,isPlayer=false,name="",npcId=""){
 const bob=step?Math.sin(walk*10)*1.8:0;y+=bob;
 const p=isPlayer?{skin:"#f1c49f",hair:"#342b2b",shirt:"#2d7892",coat:"#f0b85f",pants:"#344b5b",shoe:"#27343a",style:"traveler"}:({
 wang:{skin:"#f0bd98",hair:"#292b35",shirt:"#5c8fc0",coat:"#e5f0f5",pants:"#34485e",shoe:"#293541",style:"hood"},
 seller:{skin:"#e8b18e",hair:"#46342c",shirt:"#e8b95e",coat:"#4f856e",pants:"#46504a",shoe:"#343a36",style:"apron"},
 mei:{skin:"#f4c6a5",hair:"#633d4b",shirt:"#ef9db2",coat:"#f7d9df",pants:"#74536c",shoe:"#554253",style:"bow"},
 mom:{skin:"#e9b58f",hair:"#49332d",shirt:"#b96c63",coat:"#e6a28f",pants:"#5b5361",shoe:"#3b3942",style:"bun"},
 friend:{skin:"#e8b991",hair:"#302d2b",shirt:"#6b9b73",coat:"#dce9c7",pants:"#526b59",shoe:"#344438",style:"cap"},
 teacher:{skin:"#edc19e",hair:"#282b36",shirt:"#526f9a",coat:"#b8c8df",pants:"#39465d",shoe:"#303c4c",style:"glasses"},
 boss:{skin:"#dca984",hair:"#292a30",shirt:"#e7e9ec",coat:"#344d68",pants:"#303e51",shoe:"#252e39",style:"tie"}
 })[npcId]||{skin:"#edbd98",hair:"#3e3433",shirt:color,coat:"#e4c49a",pants:"#46505a",shoe:"#34383c",style:"plain"};
 const rect=(ox,oy,w,h,c)=>{ctx.fillStyle=c;ctx.fillRect(Math.round(x+ox),Math.round(y+oy),w,h)};
 ctx.fillStyle="#1e344044";ctx.fillRect(x-12,y+34,24,4);
 const stride=step?Math.round(Math.sin(walk*10)*2):0;
 rect(-8,27,6,8,p.pants);rect(2,27,6,8,p.pants);
 rect(-9+stride,33,8,4,p.shoe);rect(2-stride,33,8,4,p.shoe);
 rect(-10,12,20,17,p.coat);rect(-7,14,14,13,p.shirt);
 rect(-13,14,4,13,p.coat);rect(9,14,4,13,p.coat);
 rect(-12,24,4,5,p.skin);rect(9,24,4,5,p.skin);
 if(p.style==="apron"){rect(-8,15,16,12,"#f1d59c");rect(-6,19,12,2,"#bd8752");rect(-3,22,6,4,"#fff0c4")}
 else if(p.style==="tie"){rect(-2,14,4,12,"#b85a56");rect(-5,14,10,3,"#f8f3e7")}
 else if(p.style==="traveler"){rect(-10,13,20,5,"#e7a94e");rect(-2,16,4,9,"#f7e4b0");rect(5,19,3,5,"#d4e9e9")}
 else if(p.style==="hood"){rect(-10,11,20,5,"#dceaf2");rect(-3,17,6,2,"#f1d08a")}
 else if(p.style==="bow"){rect(-11,13,22,4,"#f5c2d1");rect(-2,15,4,10,"#fff0e8")}
 else if(p.style==="bun"){rect(-10,12,20,5,"#e8a18e");rect(-2,17,4,8,"#f4d9a8")}
 else if(p.style==="glasses"){rect(-10,12,20,5,"#d7e1ed");rect(-2,15,4,10,"#f0d18a")}
 else if(p.style==="cap"){rect(-10,11,20,5,"#e0e8cf");rect(-2,17,4,8,"#f3d99d")}
 rect(-3,7,6,7,p.skin);rect(-10,-8,20,17,p.skin);rect(-12,-3,3,6,p.skin);rect(9,-3,3,6,p.skin);
 rect(-11,-11,22,6,p.hair);rect(-11,-7,4,8,p.hair);
 if(p.style==="bun"){rect(-4,-16,9,7,p.hair);rect(2,-14,6,6,p.hair)}
 else if(p.style==="bow"){rect(-9,-13,18,5,p.hair);rect(6,-7,5,12,p.hair);rect(-14,-15,6,5,"#e77e9c");rect(-13,-16,4,4,"#ffe4a2")}
 else if(p.style==="cap"){rect(-12,-13,24,4,"#4f765c");rect(-8,-16,16,4,"#659b6c");rect(7,-11,7,3,"#d9bd71")}
 else if(p.style==="hood"){rect(-13,-11,26,4,p.coat);rect(-10,-7,3,8,p.hair);rect(7,-7,4,8,p.hair)}
 else {rect(-8,-14,16,4,p.hair);rect(5,-8,5,5,p.hair)}
 const eyeX=face==="left"?-6:face==="right"?4:face==="up"?-2:3;
 if(face!=="up"){rect(eyeX,-1,2,2,"#273b42");rect(eyeX+5,-1,2,2,"#273b42");rect(-2,4,4,1,"#b96e65")}
 if(p.style==="glasses"){rect(-9,-2,7,5,"#6a8393");rect(2,-2,7,5,"#6a8393");rect(-2,-1,4,1,"#6a8393")}
 if(p.style==="tie")rect(-2,18,4,8,"#b84e51");
 if(isPlayer){rect(-11,1,4,7,"#f0b85f");rect(7,1,4,7,"#f0b85f")}
 rect(-12,-8,2,13,"#382f31");rect(10,-8,2,13,"#382f31");
 if(name){ctx.font="bold 9px monospace";ctx.textAlign="center";const width=ctx.measureText(name).width+12;ctx.fillStyle="#fff9e9";ctx.fillRect(x-width/2,y-31,width,14);ctx.strokeStyle="#294858";ctx.lineWidth=1;ctx.strokeRect(x-width/2,y-31,width,14);ctx.fillStyle="#294858";ctx.fillText(name,x,y-21)}
}
function drawSprite(x,y,color,step,isPlayer=false,name="",npcId=""){
 ctx.save();ctx.translate(Math.round(x),Math.round(y));ctx.scale(1.32,1.32);
 drawSpriteBase(0,0,color,step,isPlayer,name,npcId);ctx.restore();
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
 const list=npcList();list.forEach(n=>drawSprite(n.x,n.y,"#d47e69",true,false,n.name,n.id));
 drawSprite(px,py,"#4d83a0",moving,true,"","player");
 drawHud();
}
function nearest(){let list=npcList().sort((a,b)=>Math.hypot(a.x-px,a.y-py)-Math.hypot(b.x-px,b.y-py));return list[0]&&Math.hypot(list[0].x-px,list[0].y-py)<68?list[0]:null}
function interact(){
 const n=nearest();if(!n){if(typeof toast==="function")toast("Đi lại gần NPC hơn để trò chuyện.");return}
 state.x=70;state.y=0;setRelation(n.id,3);persist();
 try{talk(n.id)}catch(e){toast("NPC này chưa có hội thoại trong bản hiện tại.")}
 updateRelation();
}
function updateRelation(){const n=nearest();let h=document.getElementById("cl32Hint");if(h){let v=n?"💬 Nhấn Tương tác: "+n.name:"🕹️ Khám phá bản đồ và tìm NPC";if(h.textContent!==v)h.textContent=v}}
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
function blocked(x,y){const z=districts[zone];for(const [type,bx,by] of z.objects){let w=type==="school"?205:type==="tower"?75:["tree","lamp","lantern"].includes(type)?28:["pond"].includes(type)?125:["bench","table","crate"].includes(type)?42:88;let h=type==="school"?104:type==="tower"?166:["tree","lamp","lantern"].includes(type)?42:type==="pond"?58:82;if(type==="flower")continue;if(x>bx-15&&x<bx+w+15&&y>by-12&&y<by+h+12)return true}return false}
function update(dt){
 const speed=105;let x=(held.right?1:0)-(held.left?1:0)+joy.dx,y=(held.down?1:0)-(held.up?1:0)+joy.dy;let len=Math.hypot(x,y);if(len>1){x/=len;y/=len}
 moving=Math.abs(x)+Math.abs(y)>.08;
 if(moving){let nx=Math.max(18,Math.min(W-18,px+x*speed*dt)),ny=Math.max(104,Math.min(H-25,py+y*speed*dt));if(!blocked(nx,py))px=nx;if(!blocked(px,ny))py=ny;walk+=dt*8;face=Math.abs(x)>Math.abs(y)?(x<0?"left":"right"):(y<0?"up":"down");state.energy=Math.max(0,state.energy-dt*.025);state.x=px/W*100;state.y=Math.max(-8,Math.min(15,(H-72-py)/2))}
 // NPCs stroll around their home area, with small idle loops
 const arr=people[zone]||[];arr.forEach((n,i)=>{let a=npcs[n.id]||(npcs[n.id]={x:W*(n.x||70)/100,y:H-75,phase:i,dir:1});a.phase+=dt;a.x+=Math.sin(a.phase*.45)*dt*3;a.x=Math.max(45,Math.min(W-45,a.x));a.y=H-75+Math.sin(a.phase*.8)*2});
 minute=(minute+dt*2)%1440;dayTick+=dt;
 if(dayTick>2){dayTick=0;const en=document.getElementById("energy");if(en)en.textContent=Math.floor(state.energy);if(typeof stats==="function")stats();if(typeof save==="function")save()}
 updateRelation();
}
function loop(now){let dt=Math.min(.04,(now-last)/1000);last=now;update(dt);render();requestAnimationFrame(loop)}
// Keep existing navigation buttons, but make each one switch the pixel-art district.
document.querySelectorAll(".nav button").forEach(b=>b.onclick=()=>switchZone(b.dataset.place));
document.querySelectorAll("[data-move]").forEach(b=>{b.onclick=()=>{let d=b.dataset.move;held[d]=true;setTimeout(()=>held[d]=false,170)}});
document.addEventListener("keydown",keyDown,true);document.addEventListener("keyup",keyUp,true);
window.addEventListener("blur",()=>Object.keys(held).forEach(k=>held[k]=false));
canvas.addEventListener("pointerdown",e=>{const r=canvas.getBoundingClientRect(),x=(e.clientX-r.left)/r.width*W,y=(e.clientY-r.top)/r.height*H;const n=npcList().sort((a,b)=>Math.hypot(a.x-x,a.y-y)-Math.hypot(b.x-x,b.y-y))[0];if(n&&Math.hypot(n.x-x,n.y-y)<34){px=n.x-20;py=n.y;interact()}});
buildControls();
switchZone(zone);
requestAnimationFrame(loop);
})();