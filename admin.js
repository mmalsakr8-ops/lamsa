// =========================
// ADMIN LOGIN
// =========================

function adminLoginPage() {
  return `
<!DOCTYPE html><html lang="ar" dir="rtl"><head>
<meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>دخول الإدارة | LAMSA</title>
<style>
*{box-sizing:border-box}body{margin:0;min-height:100vh;font-family:Arial,sans-serif;background:linear-gradient(135deg,#17120d,#302217 55%,#111);display:flex;align-items:center;justify-content:center;color:#fff;padding:20px}.box{width:min(440px,100%);background:rgba(255,255,255,.08);backdrop-filter:blur(12px);border:1px solid rgba(255,255,255,.15);border-radius:24px;padding:30px;box-shadow:0 20px 60px rgba(0,0,0,.35)}.brand{text-align:center;font-size:32px;font-weight:900;letter-spacing:3px;direction:ltr;margin-bottom:8px}.sub{text-align:center;color:#ddd;margin-bottom:25px}label{display:block;margin:12px 0 7px;font-weight:bold}input{width:100%;padding:14px;border-radius:12px;border:1px solid #665544;background:#fff;color:#222;font-family:inherit;font-size:16px}button{width:100%;margin-top:18px;padding:14px;border:0;border-radius:12px;background:#d7ad63;color:#21170e;font-weight:900;font-family:inherit;font-size:16px;cursor:pointer}.msg{display:none;margin-top:15px;padding:12px;border-radius:10px;background:#6b2525;color:#fff}.back{display:block;text-align:center;margin-top:18px;color:#ddd;text-decoration:none;font-size:14px}
</style></head><body><div class="box"><div class="brand">LAMSA</div><div class="sub">دخول إدارة المنصة</div><form id="form"><label>البريد الإداري</label><input id="identifier" type="text" inputmode="email" autocomplete="username" placeholder="admin@lamsa.local" required><label>كلمة مرور الإدارة</label><input id="password" type="password" autocomplete="current-password" required><button type="submit">دخول الإدارة</button></form><div id="msg" class="msg"></div><a class="back" href="/login">العودة لدخول العملاء</a></div><script>
const form=document.getElementById('form'),msg=document.getElementById('msg');form.addEventListener('submit',async e=>{e.preventDefault();msg.style.display='none';try{const r=await fetch('/api/admin/login',{method:'POST',headers:{'Content-Type':'application/json'},credentials:'same-origin',body:JSON.stringify({identifier:document.getElementById('identifier').value,password:document.getElementById('password').value})});const d=await r.json();if(!r.ok||!d.ok)throw new Error(d.error||'تعذر تسجيل الدخول');location.href='/admin'}catch(err){msg.textContent=err.message;msg.style.display='block'}});</script></body></html>`;
}


// =========================
// ADMIN DASHBOARD
// =========================

export function adminPage() {
  return `
<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>إدارة المنيوهات | LAMSA</title>
<style>
*{box-sizing:border-box}
body{margin:0;font-family:Arial,sans-serif;background:#f5f2ee;color:#211d19}
header{background:#211d19;color:#fff;padding:16px 5%;display:flex;align-items:center;justify-content:space-between;gap:12px;position:sticky;top:0;z-index:5}
.brand{font-size:24px;font-weight:900;letter-spacing:2px;direction:ltr}
.back{border:0;border-radius:10px;padding:10px 15px;background:#d9b06a;color:#211d19;font-weight:bold;cursor:pointer;font-family:inherit}
main{max-width:1200px;margin:auto;padding:28px 16px 80px}
.hero{background:linear-gradient(135deg,#29231e,#151311);color:#fff;border-radius:22px;padding:25px;margin-bottom:20px}
.hero h1{margin:0 0 8px;font-size:28px}.hero p{margin:0;color:#ddd}
.message{display:none;padding:12px;border-radius:10px;background:#fff;margin-bottom:16px}
.grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(290px,1fr));gap:16px}
.card{background:#fff;border:1px solid #e6dfd7;border-radius:18px;padding:18px;box-shadow:0 8px 25px rgba(0,0,0,.05)}
.name{font-size:20px;font-weight:900;margin-bottom:6px}.meta{color:#777;font-size:13px;line-height:1.8}
.status{display:inline-block;padding:6px 10px;border-radius:999px;font-weight:bold;font-size:12px;margin:10px 0}
.active{background:#e3f3e3;color:#2f7132}.expired{background:#fde7e7;color:#a52e2e}.disabled{background:#eee;color:#555}
.actions{display:flex;gap:8px;flex-wrap:wrap;margin-top:12px}
.actions button{border:0;border-radius:10px;padding:11px 14px;font-family:inherit;font-weight:bold;cursor:pointer}
.renew{background:#211d19;color:#fff}.stop{background:#f0e3d8;color:#6b4020}.open{background:#eee;color:#222}
.empty{text-align:center;padding:35px;background:#fff;border-radius:18px;color:#777}
footer{text-align:center;color:#777;padding:25px 15px 35px;font-size:13px}footer strong{display:block;color:#211d19;font-size:18px;direction:ltr;margin-bottom:5px}
@media(max-width:650px){header{padding:14px 16px}.brand{font-size:20px}.hero h1{font-size:23px}}
</style>
</head>
<body>
<header><div class="brand">LAMSA</div><button class="back" onclick="location.href='/dashboard'">العودة للوحة التحكم</button></header>
<main>
<section class="hero"><h1>إدارة المنيوهات</h1><p>من هنا فقط يمكنك تشغيل أو إيقاف أو تجديد منيوهات العملاء.</p></section>
<div id="message" class="message"></div>
<div id="list" class="grid"><div class="empty">جاري تحميل المنيوهات...</div></div>
</main>
<footer><strong>LAMSA</strong>الحقوق محفوظة بواسطة M/mohamed abdalaziem</footer>
<script>
function esc(v){return String(v||'').replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;').replaceAll("'",'&#039;')}
function fmt(v){if(!v)return 'غير محدد';const d=new Date(v.replace(' ','T')+'Z');if(Number.isNaN(d.getTime()))return v;return d.toLocaleString('ar-EG',{dateStyle:'medium',timeStyle:'short'})}
function typeLabel(v){return v==='cafe'?'☕ كافيه':v==='both'?'🍽️☕ مطعم وكافيه':'🍽️ مطعم'}
function state(r){if(Number(r.menu_enabled)!==1)return ['disabled','متوقفة يدويًا'];if(r.menu_expires_at&&new Date(r.menu_expires_at.replace(' ','T')+'Z').getTime()<=Date.now())return ['expired','منتهية'];return ['active','نشطة']}
async function call(url,body){const res=await fetch(url,{method:'POST',headers:{'Content-Type':'application/json'},credentials:'same-origin',body:JSON.stringify(body)});const d=await res.json();if(!res.ok||!d.ok)throw new Error(d.error||'حدث خطأ');return d}
function show(msg){const el=document.getElementById('message');el.textContent=msg;el.style.display='block';setTimeout(()=>el.style.display='none',2500)}
async function load(){
 try{
  const meRes=await fetch('/api/me',{credentials:'same-origin'});const me=await meRes.json();
  if(!me.ok||!me.user||me.user.role!=='owner'){location.href='/admin/login';return}
  const res=await fetch('/api/admin/restaurants',{credentials:'same-origin'});const data=await res.json();if(!res.ok||!data.ok)throw new Error(data.error||'تعذر تحميل البيانات');
  const list=document.getElementById('list');
  if(!data.restaurants.length){list.innerHTML='<div class="empty">لا توجد منيوهات حتى الآن.</div>';return}
  list.innerHTML=data.restaurants.map(r=>{const [cls,label]=state(r);const card='<article class="card"><div class="name">'+esc(r.name||'بدون اسم')+'</div><div class="meta"><b>العميل:</b> '+esc(r.customer_name||'غير محدد')+'<br><b>الهاتف:</b> '+esc(r.customer_phone||'غير محدد')+'<br><b>الإيميل:</b> '+esc(r.customer_email||'غير محدد')+'<br><b>نوع النشاط:</b> '+typeLabel(r.business_type)+'<br><b>الرابط:</b> /menu/'+esc(r.slug||'')+'<br><b>تاريخ التسجيل:</b> '+fmt(r.customer_created_at||r.created_at)+'<br><b>بداية الفترة المجانية:</b> '+fmt(r.customer_created_at||r.created_at)+'<br><b>تاريخ الانتهاء:</b> '+fmt(r.menu_expires_at)+'</div><span class="status '+cls+'">'+label+'</span><div class="actions"><button class="renew" onclick="renew(\''+esc(r.id)+'\')">▶️ تشغيل / تجديد 30 يوم</button><button class="stop" onclick="disableMenu(\''+esc(r.id)+'\')">⏹️ إيقاف</button><button class="open" onclick="window.open(\'/menu/'+encodeURIComponent(r.slug||'')+'\',\'_blank\')">👀 فتح المنيو</button></div></article>';return card}).join('')
 }catch(e){document.getElementById('list').innerHTML='<div class="empty">'+esc(e.message)+'</div>'}
}
async function renew(id){if(!confirm('تشغيل أو تجديد هذه المنيو لمدة 30 يوم؟'))return;try{await call('/api/admin/menu/activate',{restaurant_id:id,days:30});show('تم تشغيل/تجديد المنيو لمدة 30 يوم ✓');load()}catch(e){alert(e.message)}}
async function disableMenu(id){if(!confirm('هل تريد إيقاف هذه المنيو الآن؟'))return;try{await call('/api/admin/menu/disable',{restaurant_id:id});show('تم إيقاف المنيو ✓');load()}catch(e){alert(e.message)}}
load();
</script>
</body>
</html>`;
}

