/* Chinese Life 3.3 — compact controller HUD and click-to-open panels */
(()=>{"use strict";
const app=document.querySelector(".app"),scene=document.getElementById("scene");
if(!app||!scene)return;
const $=id=>document.getElementById(id);
const hud=document.createElement("div");hud.id="cl33Hud";
hud.innerHTML='<div class="cl33-playercard"><div class="cl33-playername">🏮 VÂN HẢI · NHÀ LỮ HÀNH</div><div class="cl33-meta">Cấp <b id="cl33Level">1</b> · ⭐ <b id="cl33Xp">0</b> EXP · 💰 <b id="cl33Coins">30</b> 元</div><div class="cl33-xp"><span id="cl33XpBar"></span></div></div><div class="cl33-zonecard" id="cl33Zone">📍 Đang khám phá Vân Hải</div>';
scene.appendChild(hud);
const drawer=document.createElement("section");drawer.id="cl33Drawer";drawer.setAttribute("aria-live","polite");scene.parentElement.appendChild(drawer);
const dock=document.createElement("nav");dock.id="cl33Dock";dock.setAttribute("aria-label","Bảng điều khiển");
const items=[
 ["menu","☰","MENU"],["quest","📜","NHIỆM VỤ"],["map","🗺️","BẢN ĐỒ"],["bag","🎒","TÚI ĐỒ"],["book","📖","HỌC TẬP"],["life","🏮","ĐỜI SỐNG"]
];
items.forEach(([id,icon,label])=>{const b=document.createElement("button");b.className="cl33-dockbtn";b.dataset.panel=id;b.innerHTML=icon+"<small>"+label+"</small>";b.onclick=()=>openPanel(id,b);dock.appendChild(b)});
app.appendChild(dock);
function click(id){const el=$(id);if(el)el.click();else if(typeof toast==="function")toast("Chức năng đang được hoàn thiện.")}
function close(){drawer.classList.remove("open");dock.querySelectorAll("button").forEach(b=>b.classList.remove("active"))}
function openPanel(id,button){
 if(drawer.classList.contains("open")&&drawer.dataset.panel===id){close();return}
 dock.querySelectorAll("button").forEach(b=>b.classList.toggle("active",b===button));
 drawer.dataset.panel=id;drawer.classList.add("open");
 const titles={menu:"BẢNG ĐIỀU KHIỂN",quest:"HÀNH TRÌNH & NHIỆM VỤ",map:"BẢN ĐỒ VÂN HẢI",bag:"HÀNH TRANG",book:"HỌC TẬP HSK 1–6",life:"ĐỜI SỐNG NHÂN VẬT"};
 let body="";
 if(id==="menu")body=grid([["🗺️","Bản đồ","cityBtn"],["📜","Chiến dịch HSK","cl31Launch"],["🎒","Túi đồ","bag"],["📖","Sổ tay từ vựng","journal"],["🤝","Quan hệ NPC","cl32Relation"],["💼","Đi làm","workBtn"],["🛍️","Cửa hàng","marketBtn"],["🛏️","Nghỉ ngơi","restBtn"]]);
 if(id==="quest")body='<div class="cl33-statrow"><div class="cl33-stat"><b id="cl33QuestLevel">HSK 1–6</b><small>Chiến dịch chính</small></div><div class="cl33-stat"><b>6</b><small>Chương truyện</small></div><div class="cl33-stat"><b>12</b><small>Thử thách khởi đầu</small></div></div>'+grid([["⚔️","Mở chiến dịch","cl31Launch"],["🗓️","Lịch sinh hoạt","day"]]);
 if(id==="map")body=grid([["🏘️","Khu phố","zone:street"],["🛒","Phố thương mại","zone:shop"],["🍜","Ngõ ẩm thực","zone:food"],["🏠","Khu nhà","zone:home"],["🌳","Công viên","zone:park"],["🎓","Học viện","zone:school"],["🏢","Trung tâm","zone:work"],["🧭","Bản đồ đầy đủ","cityBtn"]]);
 if(id==="bag")body=grid([["🎒","Mở túi đồ","bag"],["🛍️","Cửa hàng","marketBtn"]]);
 if(id==="book")body=grid([["📖","Sổ tay từ vựng","journal"],["⚔️","Luyện HSK 1–6","cl31Launch"]]);
 if(id==="life")body=grid([["🤝","Quan hệ NPC","cl32Relation"],["💼","Đi làm","workBtn"],["🛏️","Nghỉ ngơi","restBtn"],["📅","Lịch sinh hoạt","day"]]);
 drawer.innerHTML='<div class="cl33-drawerhead"><span>'+titles[id]+'</span><button class="cl33-close" aria-label="Đóng">×</button></div>'+body+'<div class="cl33-tip">Chạm một chức năng để mở. Chạm lại biểu tượng đang chọn hoặc nút × để thu gọn bảng điều khiển.</div>';
 drawer.querySelector(".cl33-close").onclick=close;
 drawer.querySelectorAll("[data-action]").forEach(b=>b.onclick=()=>runAction(b.dataset.action));
}
function grid(entries){return '<div class="cl33-grid">'+entries.map(([ic,label,act])=>'<button class="cl33-action" data-action="'+act+'">'+ic+'<span>'+label+'</span></button>').join("")+'</div>'}
function runAction(action){
 if(action.startsWith("zone:")){const z=action.split(":")[1];const nav=document.querySelector('.nav button[data-place="'+z+'"]');if(nav)nav.click();close();return}
 if(action==="day"){const d=$("day");if(d&&d.parentElement)d.parentElement.click();close();return}
 close();click(action);
}
function refresh(){
 const lv=$("level"),xp=$("xp"),coins=$("coins"),bar=$("xpbar");
 if($("cl33Level"))$("cl33Level").textContent=lv?lv.textContent.replace(/[^0-9]/g,"")||"1":"1";
 if($("cl33Xp"))$("cl33Xp").textContent=xp?xp.textContent:"0";
 if($("cl33Coins"))$("cl33Coins").textContent=coins?coins.textContent:"30";
 if($("cl33XpBar"))$("cl33XpBar").style.width=bar?getComputedStyle(bar).width:"0%";
 const z=$("loclabel");if($("cl33Zone")&&z)$("cl33Zone").textContent=z.textContent;
}
const oldModal=$("modalback");if(oldModal)oldModal.addEventListener("click",e=>{if(e.target===oldModal)close()});
document.addEventListener("keydown",e=>{if(e.key==="Escape")close()});
setInterval(refresh,700);refresh();
})();