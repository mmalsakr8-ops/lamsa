import { THEMES, BACKGROUNDS } from "./config.js";

function escapeHtml(value) {
  return String(value || "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

// =========================
// HOME PAGE
// =========================

function homePage() {
  return `
<!DOCTYPE html>
<html lang="ar" dir="rtl">

<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>LAMSA | أنشئ منيوك وموقعك</title>

<style>

*{
  box-sizing:border-box;
}

body{
  margin:0;
  font-family:Arial,sans-serif;
  background:#f7f3ed;
  color:#1d1d1d;
}

header{
  height:76px;
  padding:0 7%;
  background:rgba(255,255,255,.92);
  backdrop-filter:blur(12px);
  border-bottom:1px solid #eee;
  display:flex;
  align-items:center;
  justify-content:space-between;
}

.brand{
  display:flex;
  align-items:center;
  gap:10px;
}

.logo-mark{
  width:43px;
  height:43px;
  border-radius:14px;
  background:#1f1b17;
  color:#d9b06a;
  display:flex;
  align-items:center;
  justify-content:center;
  font-size:22px;
  font-weight:900;
  box-shadow:0 8px 25px rgba(0,0,0,.12);
}

.logo-text{
  font-size:25px;
  font-weight:900;
}

.logo-text small{
  display:block;
  direction:ltr;
  font-size:8px;
  letter-spacing:4px;
  color:#9a8b7b;
}

.login{
  background:#211d19;
  color:white;
  border:0;
  padding:12px 22px;
  border-radius:12px;
  font-weight:bold;
  cursor:pointer;
}

.hero{
  min-height:calc(100vh - 76px);
  display:flex;
  align-items:center;
  justify-content:center;
  text-align:center;
  padding:60px 20px;
  background:
    radial-gradient(circle at 20% 20%,rgba(210,170,105,.18),transparent 30%),
    radial-gradient(circle at 80% 70%,rgba(120,90,50,.1),transparent 30%);
}

.hero-box{
  max-width:900px;
}

.badge{
  display:inline-block;
  padding:10px 18px;
  border-radius:40px;
  background:#eee4d7;
  color:#76552f;
  font-weight:bold;
  margin-bottom:24px;
}

h1{
  font-size:clamp(45px,8vw,82px);
  line-height:1.08;
  margin:0;
  letter-spacing:-2px;
}

h1 span{
  color:#a87539;
}

.hero p{
  color:#6d6964;
  font-size:19px;
  line-height:1.9;
  max-width:700px;
  margin:25px auto;
}

.actions{
  display:flex;
  justify-content:center;
  gap:12px;
  flex-wrap:wrap;
  margin-top:32px;
}

.primary,
.secondary{
  padding:15px 30px;
  border-radius:13px;
  font-size:16px;
  font-weight:bold;
  cursor:pointer;
}

.primary{
  background:#211d19;
  color:white;
}

.secondary{
  background:white;
  color:#211d19;
  border:1px solid #ddd4ca;
}

.site-footer{padding:24px 16px;text-align:center;color:#888;font-size:12px;line-height:2;margin-top:35px;border-top:1px solid #eee}.site-footer span{color:#aaa}</style>
</head>

<body>

<header>

<div class="brand">

<div class="logo-mark">
L
</div>

<div class="logo-text">
LAMSA
</div>

</div>

<button
class="login"
onclick="location.href='/login'">
تسجيل الدخول
</button>

</header>

<section class="hero">

<div class="hero-box">

<div class="badge">
✨ منصتك الرقمية للمطاعم والكافيهات
</div>

<h1>
ابنِ موقعك<br>
<span>بلمسة واحدة</span>
</h1>

<p>
أنشئ موقع مطعمك ومنيوك الرقمية بسهولة،
واختار التصميم والخلفية والألوان التي تناسب علامتك.
</p>

<div class="actions">

<button
class="primary"
onclick="location.href='/register'">
ابدأ الآن
</button>

<button
class="secondary"
onclick="location.href='/login'">
لدي حساب بالفعل
</button>

</div>

</div>

</section>

<footer class="site-footer">© 2026 جميع الحقوق محفوظة — M/ Mohamed Abdalaziem<br><span>منيو وموقع مطعمك، بلمسة واحدة.</span></footer></body>
</html>
`;
}


// =========================
// AUTH PAGE
// =========================

function authPage() {
  return `
<!DOCTYPE html>
<html lang="ar" dir="rtl">

<head>

<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>الدخول | LAMSA</title>

<style>

*{
  box-sizing:border-box;
}

body{
  margin:0;
  min-height:100vh;
  font-family:Arial,sans-serif;
  background:
    radial-gradient(circle at top,#eee2d3,#f7f5f1 50%);
  display:flex;
  align-items:center;
  justify-content:center;
  padding:20px;
  color:#222;
}

.card{
  width:100%;
  max-width:460px;
  background:white;
  border:1px solid #eee;
  border-radius:25px;
  padding:32px;
  box-shadow:0 25px 70px rgba(0,0,0,.08);
}

.brand{
  text-align:center;
  margin-bottom:25px;
}

.mark{
  width:55px;
  height:55px;
  margin:auto;
  border-radius:18px;
  background:#211d19;
  color:#d8ad63;
  display:flex;
  align-items:center;
  justify-content:center;
  font-size:28px;
  font-weight:900;
}

.logo{
  margin-top:10px;
  font-size:32px;
  font-weight:900;
}

.subtitle{
  text-align:center;
  color:#777;
  margin-bottom:25px;
  line-height:1.7;
}

.tabs{
  display:grid;
  grid-template-columns:1fr 1fr;
  background:#f2efeb;
  padding:5px;
  border-radius:13px;
  margin-bottom:24px;
}

.tab{
  padding:12px;
  border:0;
  border-radius:9px;
  background:transparent;
  cursor:pointer;
  font-family:inherit;
}

.tab.active{
  background:#222;
  color:#fff;
}

label{
  display:block;
  margin:14px 0 7px;
  font-weight:bold;
}

input{
  width:100%;
  padding:14px;
  border:1px solid #ddd;
  border-radius:11px;
  font-size:16px;
  outline:none;
}

input:focus{
  border-color:#a87943;
}

.submit{
  width:100%;
  padding:15px;
  margin-top:22px;
  background:#222;
  color:#fff;
  border:0;
  border-radius:11px;
  font-size:16px;
  cursor:pointer;
}

.message{
  margin-top:16px;
  padding:12px;
  border-radius:10px;
  background:#f4f4f4;
  display:none;
  line-height:1.6;
}

.back{
  display:block;
  text-align:center;
  margin-top:20px;
  color:#777;
  text-decoration:none;
}

.hidden{
  display:none;
}

.site-footer{padding:24px 16px;text-align:center;color:#888;font-size:12px;line-height:2;margin-top:35px;border-top:1px solid #eee}.site-footer span{color:#aaa}</style>

</head>

<body>

<div class="card">

<div class="brand">

<div class="mark">
ل
</div>

<div class="logo">
لمسة
</div>

</div>

<div class="subtitle">
LAMSA — منصتك الرقمية للمطاعم والكافيهات
</div>

<div class="tabs">

<button
class="tab active"
id="loginTab"
onclick="showLogin()">
تسجيل الدخول
</button>

<button
class="tab"
id="registerTab"
onclick="showRegister()">
إنشاء حساب
</button>

</div>

<form id="loginForm">

<label>
البريد الإلكتروني أو رقم الهاتف
</label>

<input
id="loginIdentifier"
type="text"
required>

<label>
كلمة المرور
</label>

<input
id="loginPassword"
type="password"
required>

<button
class="submit"
type="submit">
تسجيل الدخول
</button>

</form>

<form
id="registerForm"
class="hidden">

<label>
الاسم
</label>

<input
id="registerName"
type="text"
required>

<label>
رقم الهاتف
</label>

<input
id="registerPhone"
type="tel"
required>

<label>
البريد الإلكتروني
</label>

<input
id="registerEmail"
type="email"
required>

<label>
كلمة المرور
</label>

<input
id="registerPassword"
type="password"
minlength="6"
required>

<button
class="submit"
type="submit">
إنشاء الحساب
</button>

</form>

<div
id="message"
class="message">
</div>

<a href="/" class="back">
← العودة للرئيسية
</a>

</div>

<script>

const loginForm =
document.getElementById("loginForm");

const registerForm =
document.getElementById("registerForm");

const loginTab =
document.getElementById("loginTab");

const registerTab =
document.getElementById("registerTab");

const message =
document.getElementById("message");

function showMessage(text){
  message.textContent = text;
  message.style.display = "block";
}

function showLogin(){

  loginForm.classList.remove("hidden");
  registerForm.classList.add("hidden");

  loginTab.classList.add("active");
  registerTab.classList.remove("active");

  message.style.display = "none";
}

function showRegister(){

  loginForm.classList.add("hidden");
  registerForm.classList.remove("hidden");

  loginTab.classList.remove("active");
  registerTab.classList.add("active");

  message.style.display = "none";
}

loginForm.addEventListener("submit",async function(e){

  e.preventDefault();

  const button =
    loginForm.querySelector("button[type=submit]");

  button.disabled = true;
  button.textContent = "جارٍ تسجيل الدخول...";

  try{

    const response =
      await fetch("/api/login",{
        method:"POST",
        headers:{
          "Content-Type":"application/json"
        },
        credentials:"same-origin",
        body:JSON.stringify({
          identifier:
            document.getElementById("loginIdentifier").value.trim(),
          password:
            document.getElementById("loginPassword").value
        })
      });

    const data =
      await response.json();

    if(!response.ok || !data.ok){
      throw new Error(
        data.error || "تعذر تسجيل الدخول"
      );
    }

    location.href="/dashboard";

  }catch(error){

    showMessage(error.message);

    button.disabled=false;
    button.textContent="تسجيل الدخول";
  }

});

registerForm.addEventListener("submit",async function(e){

  e.preventDefault();

  const button =
    registerForm.querySelector("button[type=submit]");

  button.disabled=true;
  button.textContent="جارٍ إنشاء الحساب...";

  try{

    const response =
      await fetch("/api/register",{
        method:"POST",
        headers:{
          "Content-Type":"application/json"
        },
        credentials:"same-origin",
        body:JSON.stringify({

          name:
            document.getElementById("registerName").value.trim(),

          phone:
            document.getElementById("registerPhone").value.trim(),

          email:
            document.getElementById("registerEmail").value.trim(),

          password:
            document.getElementById("registerPassword").value

        })
      });

    const data =
      await response.json();

    if(!response.ok || !data.ok){
      throw new Error(
        data.error || "تعذر إنشاء الحساب"
      );
    }

    location.href="/dashboard";

  }catch(error){

    showMessage(error.message);

    button.disabled=false;
    button.textContent="إنشاء الحساب";
  }

});

</script>

<footer class="site-footer">© 2026 جميع الحقوق محفوظة — M/ Mohamed Abdalaziem<br><span>منيو وموقع مطعمك، بلمسة واحدة.</span></footer></body>
</html>
`;
}


// =========================
// DASHBOARD
// =========================

function dashboardPage() {
  const themeCards =
    Object.entries(THEMES)
      .map(([key, theme]) => {

        return `
<div
class="theme-card"
data-theme="${key}"
onclick="selectTheme('${key}')">

<div
class="theme-preview"
style="background:${theme.background}">

<div class="preview-logo">
ل
</div>

<div class="preview-line"></div>
<div class="preview-line short"></div>

</div>

<div class="theme-name">
${theme.name}
</div>

<div
class="theme-check"
id="check-${key}">
✓
</div>

</div>
`;

      })
      .join("");

  return `
<!DOCTYPE html>
<html lang="ar" dir="rtl">

<head>

<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">

<title>Dashboard | LAMSA</title>

<style>

*{
  box-sizing:border-box;
}

body{
  margin:0;
  font-family:Arial,sans-serif;
  background:#f5f2ee;
  color:#202020;
}

header{
  background:rgba(255,255,255,.96);
  backdrop-filter:blur(15px);
  min-height:76px;
  border-bottom:1px solid #e8e3dc;
  padding:12px 5%;
  display:flex;
  align-items:center;
  justify-content:space-between;
  gap:15px;
  position:sticky;
  top:0;
  z-index:50;
}

.brand{
  display:flex;
  align-items:center;
  gap:10px;
}

.logo-mark{
  width:42px;
  height:42px;
  border-radius:13px;
  background:#211d19;
  color:#d9b06a;
  display:flex;
  align-items:center;
  justify-content:center;
  font-size:21px;
  font-weight:900;
}

.logo-text{
  font-size:24px;
  font-weight:900;
}

.logo-text small{
  display:block;
  direction:ltr;
  font-size:7px;
  letter-spacing:3px;
  color:#999;
}

.header-actions{
  display:flex;
  gap:8px;
  align-items:center;
}

.menu-toggle{
  width:44px;height:44px;border:0;border-radius:12px;
  background:#211d19;color:#fff;font-size:22px;cursor:pointer;
}

.sidebar{
  position:fixed;top:0;right:-330px;width:310px;max-width:86vw;height:100vh;
  background:#fff;z-index:100;box-shadow:-20px 0 50px rgba(0,0,0,.16);
  padding:22px;transition:.25s;overflow:auto;
}
.sidebar.open{right:0}
.sidebar-head{display:flex;align-items:center;justify-content:space-between;margin-bottom:18px}
.sidebar-head strong{font-size:20px}
.close-side{border:0;background:#f1eee9;border-radius:10px;width:38px;height:38px;font-size:20px;cursor:pointer}
.side-user{background:#211d19;color:#fff;border-radius:16px;padding:16px;margin-bottom:14px}
.side-user small{display:block;color:#ccc;margin-top:5px;word-break:break-word}
.side-link{width:100%;border:0;background:#f7f4ef;border-radius:12px;padding:14px;text-align:right;font:inherit;font-weight:bold;cursor:pointer;margin-top:8px}
.side-link:hover{background:#eee8df}
.side-overlay{position:fixed;inset:0;background:rgba(0,0,0,.35);z-index:90;display:none}
.side-overlay.show{display:block}
.profile-modal{position:fixed;inset:0;background:rgba(0,0,0,.45);z-index:120;display:none;align-items:center;justify-content:center;padding:18px}
.profile-modal.show{display:flex}
.profile-box{width:min(520px,100%);background:#fff;border-radius:22px;padding:22px;box-shadow:0 20px 60px rgba(0,0,0,.2)}
.profile-actions{display:flex;gap:8px;margin-top:14px}.profile-actions button{flex:1}
.status-bar{padding:12px 14px;border-radius:12px;margin-top:12px;font-size:13px;line-height:1.7}
.status-active{background:#e8f6ec;color:#246c38}.status-expired{background:#f9e8e8;color:#963333}


.preview-btn,
.logout{
  border:0;
  border-radius:11px;
  padding:11px 16px;
  cursor:pointer;
  font-family:inherit;
  font-weight:bold;
}

.preview-btn{
  background:#eee8df;
  color:#5e472e;
}

.logout{
  background:#211d19;
  color:white;
}

main{
  max-width:1200px;
  margin:auto;
  padding:28px 16px 60px;
}

.welcome{
  position:relative;
  overflow:hidden;
  background:
    radial-gradient(circle at 80% 20%,rgba(216,176,106,.35),transparent 30%),
    linear-gradient(135deg,#29231e,#151311);
  color:white;
  border-radius:24px;
  padding:30px;
  margin-bottom:20px;
  box-shadow:0 18px 45px rgba(0,0,0,.12);
}

.welcome:after{
  content:"ل";
  position:absolute;
  left:30px;
  top:-20px;
  font-size:180px;
  font-weight:900;
  color:rgba(255,255,255,.035);
}

.welcome h1{
  margin:0 0 9px;
  font-size:30px;
}

.welcome p{
  margin:0;
  color:#ddd;
  line-height:1.8;
}

.grid{
  display:grid;
  grid-template-columns:repeat(2,minmax(0,1fr));
  gap:16px;
}

.card{
  background:white;
  border:1px solid #e8e3dc;
  border-radius:20px;
  padding:22px;
  box-shadow:0 7px 25px rgba(0,0,0,.025);
}

.card h2{
  margin:0 0 16px;
  font-size:21px;
}

label{
  display:block;
  margin:14px 0 7px;
  font-weight:bold;
}

input,
textarea,
select{
  width:100%;
  padding:13px;
  border:1px solid #ddd7cf;
  border-radius:11px;
  font:inherit;
  outline:none;
  background:#fff;
}

input:focus,
textarea:focus,
select:focus{
  border-color:#b5864e;
}

textarea{
  min-height:90px;
  resize:vertical;
}

.save{
  margin-top:15px;
  width:100%;
  padding:13px;
  border:0;
  border-radius:11px;
  background:#211d19;
  color:white;
  font:inherit;
  font-weight:bold;
  cursor:pointer;
}

.message{
  margin-top:10px;
  min-height:20px;
  color:#53704d;
  font-size:13px;
}

.menu-link{
  display:block;
  background:#f6f2ec;
  color:#6d5133;
  padding:14px;
  border-radius:11px;
  margin-top:12px;
  word-break:break-all;
  text-decoration:none;
}

.menu-open{
  display:inline-block;
  margin-top:10px;
  background:#211d19;
  color:white;
  text-decoration:none;
  padding:11px 17px;
  border-radius:10px;
  font-weight:bold;
}

.full{
  grid-column:1/-1;
}

.category-row{
  display:flex;
  align-items:center;
  justify-content:space-between;
  gap:10px;
  border:1px solid #eee9e2;
  border-radius:12px;
  padding:12px;
  margin-top:9px;
  background:#fffdfa;
}

.add{
  background:#211d19;
  color:white;
  border:0;
  border-radius:10px;
  padding:11px 15px;
  margin-top:10px;
  cursor:pointer;
  font-family:inherit;
}

.danger{
  background:#f8eeee;
  color:#8d3030;
  border:0;
  border-radius:8px;
  padding:8px 11px;
  cursor:pointer;
  font-family:inherit;
}

.item-row{
  border:1px solid #eee9e2;
  border-radius:15px;
  padding:13px;
  margin-top:10px;
  display:flex;
  justify-content:space-between;
  gap:12px;
  align-items:center;
  background:#fff;
}

.item-main{
  display:flex;
  gap:12px;
  align-items:center;
  min-width:0;
}

.item-image{
  width:70px;
  height:70px;
  border-radius:12px;
  object-fit:cover;
  background:#eee;
  flex:none;
}

.item-info{
  min-width:0;
}

.item-name{
  font-weight:bold;
  font-size:17px;
}

.small{
  font-size:13px;
  color:#777;
  line-height:1.7;
}

.item-actions{
  display:flex;
  gap:7px;
  flex:none;
}

.section-title{
  display:flex;
  align-items:center;
  justify-content:space-between;
  gap:10px;
}

.themes{
  display:grid;
  grid-template-columns:repeat(5,1fr);
  gap:10px;
}

.theme-card{
  position:relative;
  border:2px solid transparent;
  border-radius:15px;
  padding:7px;
  background:#faf9f7;
  cursor:pointer;
  transition:.2s;
}

.theme-card:hover{
  transform:translateY(-2px);
}

.theme-card.selected{
  border-color:#b2834c;
}

.theme-preview{
  height:110px;
  border-radius:10px;
  padding:13px;
  overflow:hidden;
  position:relative;
}

.preview-logo{
  width:28px;
  height:28px;
  border-radius:9px;
  background:rgba(255,255,255,.18);
  color:#fff;
  display:flex;
  align-items:center;
  justify-content:center;
  font-weight:900;
  font-size:14px;
}

.preview-line{
  height:7px;
  width:70%;
  border-radius:20px;
  background:rgba(255,255,255,.45);
  margin-top:15px;
}

.preview-line.short{
  width:45%;
  margin-top:7px;
}

.theme-name{
  text-align:center;
  padding:9px 2px 4px;
  font-size:12px;
  font-weight:bold;
}

.theme-check{
  position:absolute;
  top:9px;
  left:9px;
  width:22px;
  height:22px;
  border-radius:50%;
  background:#b2834c;
  color:white;
  display:none;
  align-items:center;
  justify-content:center;
  font-size:12px;
}

.theme-card.selected .theme-check{
  display:flex;
}

.background-box{
  margin-top:18px;
  padding-top:18px;
  border-top:1px solid #eee9e2;
}

.backgrounds{
  display:flex;
  gap:9px;
  flex-wrap:wrap;
}

.bg-option{
  width:60px;
  height:60px;
  border-radius:13px;
  border:3px solid transparent;
  cursor:pointer;
}

.bg-option.selected{
  border-color:#b2834c;
}

.bg-1{
  background:linear-gradient(135deg,#201a15,#5b4127);
}

.bg-2{
  background:linear-gradient(135deg,#f4e7d5,#fffaf3);
}

.bg-3{
  background:linear-gradient(135deg,#dcebdc,#f8fff7);
}

.bg-4{
  background:linear-gradient(135deg,#222,#555);
}

.bg-5{
  background:linear-gradient(135deg,#efe1cf,#d3a66c,#6d4b2e);
}
.bg-dots{background:radial-gradient(circle at 2px 2px,#0002 1.5px,transparent 1.5px) 0 0/18px 18px,#faf7f2}
.bg-waves{background:radial-gradient(ellipse at 20% 20%,#fff8,transparent 40%),linear-gradient(135deg,#d9e9ff,#eef6ff)}
.bg-leaves{background:radial-gradient(circle at 15% 25%,#47825a24 0 8px,transparent 9px),radial-gradient(circle at 80% 70%,#47825a1f 0 11px,transparent 12px),#f4faf5}
.bg-paper{background:repeating-linear-gradient(0deg,#00000006 0 1px,transparent 1px 7px),#fffdf8}

.logo-preview{
  display:flex;
  gap:15px;
  align-items:center;
  padding:15px;
  background:#faf8f5;
  border-radius:14px;
  margin-top:12px;
}

.logo-preview img{
  width:65px;
  height:65px;
  object-fit:contain;
  border-radius:12px;
  background:white;
}

.no-logo{
  width:65px;
  height:65px;
  border-radius:12px;
  background:#211d19;
  color:#d9b06a;
  display:flex;
  align-items:center;
  justify-content:center;
  font-size:30px;
  font-weight:900;
}

@media(max-width:900px){

  .themes{
    grid-template-columns:repeat(3,1fr);
  }

}

.site-footer{
  margin-top:40px;
  padding:24px 16px;
  text-align:center;
  color:#888;
  font-size:12px;
  line-height:2;
  border-top:1px solid #e8e3dc;
}

@media(max-width:700px){

  header{
    padding:11px 14px;
  }

  .header-actions{
    gap:5px;
  }

  .preview-btn,
  .logout{
    padding:9px 10px;
    font-size:12px;
  }

  .grid{
    grid-template-columns:1fr;
  }

  .full{
    grid-column:auto;
  }

  .themes{
    grid-template-columns:repeat(2,1fr);
  }

  .item-row{
    align-items:flex-start;
  }

  .item-main{
    align-items:flex-start;
  }

  .item-actions{
    flex-direction:column;
  }

}

</style>

</head>

<body>

<header>

<div class="brand">

<div class="logo-mark">
L
</div>

<div class="logo-text">
LAMSA
</div>

</div>

<div class="header-actions">

<button class="menu-toggle" onclick="toggleSidebar()" aria-label="القائمة">☰</button>

<button
class="preview-btn"
onclick="openMenu()">
👀 معاينة المنيو
</button>

<button
class="logout"
onclick="logout()">
تسجيل الخروج
</button>

</div>

</header>

<div id="sideOverlay" class="side-overlay" onclick="closeSidebar()"></div>

<aside id="sidebar" class="sidebar">
  <div class="sidebar-head">
    <strong>LAMSA</strong>
    <button class="close-side" onclick="closeSidebar()">×</button>
  </div>
  <div class="side-user">
    <div id="sideUserName">حسابك</div>
    <small id="sideUserEmail"></small>
  </div>
  <button class="side-link" onclick="openProfile()">👤 الملف الشخصي</button>
  <button class="side-link" onclick="closeSidebar();document.getElementById('restaurantName').focus()">🏪 بيانات المطعم</button>
  <button class="side-link" onclick="closeSidebar();document.getElementById('categoryName').focus()">🍽️ تعديل المنيو</button>
  <button class="side-link" onclick="closeSidebar();document.querySelector('.theme-card')?.scrollIntoView({behavior:'smooth'})">🎨 التصميم والثيمات</button>
  <button class="side-link" onclick="openMenu()">👀 معاينة المنيو</button>
  <button class="side-link" onclick="location.href='/admin'" id="adminLink" style="display:none">⚙️ إدارة المنيوهات</button>
  <button class="side-link" onclick="logout()">🚪 تسجيل الخروج</button>
</aside>

<div id="profileModal" class="profile-modal">
  <div class="profile-box">
    <h2 style="margin-top:0">👤 الملف الشخصي</h2>
    <label>الاسم</label><input id="profileName">
    <label>البريد الإلكتروني</label><input id="profileEmail" type="email">
    <label>رقم الهاتف</label><input id="profilePhone">
    <div id="profileMessage" class="message"></div>
    <div class="profile-actions">
      <button class="save" onclick="saveProfile()">حفظ</button>
      <button class="danger" onclick="closeProfile()">إغلاق</button>
    </div>
  </div>
</div>

<main>

<section class="welcome">

<h1 id="welcome">
أهلاً بك 👋
</h1>

<p>
من هنا تقدر تدير مطعمك ومنيوك وتختار شكل المنيو بنفسك.
</p>
<div id="menuStatus" class="status-bar"></div>

</section>

<div class="grid">

<section class="card">

<h2>
🏪 بيانات المطعم
</h2>

<label>اسم المطعم</label>

<input id="restaurantName">

<label>الوصف</label>

<textarea id="restaurantDescription"></textarea>

<label>رقم الهاتف</label>

<input id="restaurantPhone">

<label>العنوان</label>

<input id="restaurantAddress">

<label>
🖼️ رابط شعار المطعم
</label>

<input
id="restaurantLogo"
placeholder="https://...">

<div class="logo-preview">

<div id="logoPreviewBox">
<div class="no-logo">ل</div>
</div>

<div class="small">
يفضل استخدام صورة PNG أو WEBP بخلفية شفافة.
</div>

</div>

<button
class="save"
onclick="saveRestaurant()">
حفظ بيانات المطعم
</button>

<div
id="restaurantMessage"
class="message">
</div>

</section>


<section class="card">

<h2>
🔗 رابط المنيو
</h2>

<p class="small">
ده الرابط الذي سيشاهده العملاء.
</p>

<a
id="menuLink"
class="menu-link"
target="_blank">
جاري التحميل...
</a>

<a
id="openMenuButton"
class="menu-open"
target="_blank">
فتح المنيو
</a>

</section>


<section class="card full">

<div class="section-title">

<h2>
🎨 تصميم المنيو
</h2>

<span class="small">
اختار الشكل المناسب لمطعمك
</span>

</div>

<div class="themes">

${themeCards}

</div>

<div class="background-box">

<h3>
🖼️ خلفية المنيو
</h3>

<p class="small">
اختار خلفية جاهزة الآن، وسنضيف خلفيات أكثر لاحقًا.
</p>

<div class="backgrounds">

<div
class="bg-option bg-1"
data-bg="bg1"
onclick="selectBackground('bg1')">
</div>

<div
class="bg-option bg-2"
data-bg="bg2"
onclick="selectBackground('bg2')">
</div>

<div
class="bg-option bg-3"
data-bg="bg3"
onclick="selectBackground('bg3')">
</div>

<div
class="bg-option bg-4"
data-bg="bg4"
onclick="selectBackground('bg4')">
</div>

<div class="bg-option bg-5" data-bg="bg5" onclick="selectBackground('bg5')"></div>
<div class="bg-option bg-dots" data-bg="dots" onclick="selectBackground('dots')"></div>
<div class="bg-option bg-waves" data-bg="waves" onclick="selectBackground('waves')"></div>
<div class="bg-option bg-leaves" data-bg="leaves" onclick="selectBackground('leaves')"></div>
<div class="bg-option bg-paper" data-bg="paper" onclick="selectBackground('paper')"></div>

</div>

</div>

<button
class="save"
onclick="saveDesign()">
حفظ تصميم المنيو
</button>

<div
id="designMessage"
class="message">
</div>

</section>


<section class="card">

<h2>
📂 أقسام المنيو
</h2>

<input
id="categoryName"
placeholder="مثال: المشروبات">

<button
class="add"
onclick="addCategory()">
+ إضافة قسم
</button>

<div id="categories"></div>

</section>


<section class="card">

<h2>
🍽️ إضافة صنف
</h2>

<label>اسم الصنف</label>

<input
id="itemName"
placeholder="مثال: برجر لحم">

<label>السعر</label>

<input
id="itemPrice"
type="number"
step="0.01"
placeholder="150">

<label>القسم</label>

<select id="itemCategory">

<option value="">
بدون قسم
</option>

</select>

<label>الوصف</label>

<textarea
id="itemDescription"
placeholder="وصف الصنف">
</textarea>

<label>رابط الصورة</label>

<input
id="itemImage"
placeholder="https://...">

<button
class="save"
onclick="addItem()">
إضافة الصنف
</button>

<div
id="itemMessage"
class="message">
</div>

</section>


<section class="card full">

<h2>
📋 أصناف المنيو
</h2>

<div id="items">
جاري التحميل...
</div>

</section>

</div>

</main>

<script>

let restaurant = null;
let categories = [];
let items = [];

let selectedTheme = "modern";
let selectedBackground = "";


async function api(url, options = {}){

  const response =
    await fetch(
      url,
      {
        ...options,
        credentials:"same-origin",
        headers:{
          "Content-Type":"application/json",
          ...(options.headers || {})
        }
      }
    );

  const data =
    await response.json();

  if(!response.ok || !data.ok){
    throw new Error(
      data.error || "حدث خطأ"
    );
  }

  return data;
}


async function load(){

  try{

    const me =
      await api("/api/me");

    document.getElementById(
      "welcome"
    ).textContent =
      "أهلاً بك يا " +
      me.user.name +
      " 👋";

    document.getElementById("sideUserName").textContent = me.user.name || "حسابك";
    document.getElementById("sideUserEmail").textContent = me.user.email || "";
    if(me.user.role === "admin") document.getElementById("adminLink").style.display = "block";
    window.currentMe = me.user;


    const restaurantData =
      await api("/api/restaurant");

    restaurant =
      restaurantData.restaurant;


    document.getElementById(
      "restaurantName"
    ).value =
      restaurant.name || "";


    document.getElementById(
      "restaurantDescription"
    ).value =
      restaurant.description || "";


    document.getElementById(
      "restaurantPhone"
    ).value =
      restaurant.phone || "";


    document.getElementById(
      "restaurantAddress"
    ).value =
      restaurant.address || "";


    document.getElementById(
      "restaurantLogo"
    ).value =
      restaurant.logo || "";


    selectedTheme =
      restaurant.theme || "modern";


    selectedBackground =
      restaurant.background || "";

    updateMenuStatus();

    updateThemeUI();
    updateBackgroundUI();
    updateLogoPreview();


    const link =
      location.origin +
      "/menu/" +
      restaurant.slug;


    document.getElementById(
      "menuLink"
    ).href = link;

    document.getElementById(
      "menuLink"
    ).textContent = link;

    document.getElementById(
      "openMenuButton"
    ).href = link;


    await loadCategories();
    await loadItems();

  }catch(error){

    location.href="/login";

  }

}


function updateMenuStatus(){
  const box=document.getElementById("menuStatus");
  if(!restaurant) return;
  const active=restaurant.menu_active;
  const expiry=restaurant.menu_expires_at ? new Date(restaurant.menu_expires_at).toLocaleString("ar-EG") : "-";
  box.className="status-bar "+(active?"status-active":"status-expired");
  box.innerHTML=active ? "🟢 المنيو نشطة حتى <strong>"+escapeHtml(expiry)+"</strong>" : "🔴 انتهت مدة المنيو. التعديل متوقف حتى تقوم الإدارة بتشغيلها مرة أخرى.";
  document.querySelectorAll("main input, main textarea, main select, main button.save, main button.add, main button.danger").forEach(el=>{
    if(el.closest('.welcome')) return;
    if(!active) el.disabled=true;
  });
}

function toggleSidebar(){document.getElementById("sidebar").classList.add("open");document.getElementById("sideOverlay").classList.add("show")}
function closeSidebar(){document.getElementById("sidebar").classList.remove("open");document.getElementById("sideOverlay").classList.remove("show")}
function openProfile(){
  closeSidebar();
  const u=window.currentMe||{};
  document.getElementById("profileName").value=u.name||"";
  document.getElementById("profileEmail").value=u.email||"";
  document.getElementById("profilePhone").value=u.phone||"";
  document.getElementById("profileMessage").textContent="";
  document.getElementById("profileModal").classList.add("show");
}
function closeProfile(){document.getElementById("profileModal").classList.remove("show")}
async function saveProfile(){
  try{
    const d=await api("/api/profile",{method:"PUT",body:JSON.stringify({name:document.getElementById("profileName").value,email:document.getElementById("profileEmail").value,phone:document.getElementById("profilePhone").value})});
    document.getElementById("profileMessage").textContent=d.message+" ✓";
    window.currentMe.name=document.getElementById("profileName").value;
    window.currentMe.email=document.getElementById("profileEmail").value;
    window.currentMe.phone=document.getElementById("profilePhone").value;
    document.getElementById("sideUserName").textContent=window.currentMe.name;
    document.getElementById("sideUserEmail").textContent=window.currentMe.email;
  }catch(e){document.getElementById("profileMessage").textContent=e.message}
}

function openMenu(){

  if(!restaurant){
    return;
  }

  window.open(
    "/menu/" + restaurant.slug,
    "_blank"
  );

}


function selectTheme(theme){

  selectedTheme = theme;

  updateThemeUI();

}


function updateThemeUI(){

  document
    .querySelectorAll(".theme-card")
    .forEach(card => {

      card.classList.toggle(
        "selected",
        card.dataset.theme === selectedTheme
      );

    });

}


function selectBackground(bg){

  selectedBackground = bg;

  updateBackgroundUI();

}


function updateBackgroundUI(){

  document
    .querySelectorAll(".bg-option")
    .forEach(option => {

      option.classList.toggle(
        "selected",
        option.dataset.bg === selectedBackground
      );

    });

}


async function saveDesign(){

  try{

    await saveRestaurantData();

    document.getElementById(
      "designMessage"
    ).textContent =
      "تم حفظ تصميم المنيو ✓";

  }catch(error){

    document.getElementById(
      "designMessage"
    ).textContent =
      error.message;

  }

}


async function saveRestaurant(){

  try{

    await saveRestaurantData();

    document.getElementById(
      "restaurantMessage"
    ).textContent =
      "تم حفظ بيانات المطعم ✓";

    updateLogoPreview();

  }catch(error){

    document.getElementById(
      "restaurantMessage"
    ).textContent =
      error.message;

  }

}


async function saveRestaurantData(){

  await api(
    "/api/restaurant",
    {
      method:"PUT",
      body:JSON.stringify({

        name:
          document.getElementById(
            "restaurantName"
          ).value,

        description:
          document.getElementById(
            "restaurantDescription"
          ).value,

        phone:
          document.getElementById(
            "restaurantPhone"
          ).value,

        address:
          document.getElementById(
            "restaurantAddress"
          ).value,

        logo:
          document.getElementById(
            "restaurantLogo"
          ).value,

        theme:
          selectedTheme,

        background:
          selectedBackground

      })
    }
  );

}


function updateLogoPreview(){

  const url =
    document.getElementById(
      "restaurantLogo"
    ).value.trim();

  const box =
    document.getElementById(
      "logoPreviewBox"
    );

  if(!url){

    box.innerHTML =
      '<div class="no-logo">ل</div>';

    return;
  }

  box.innerHTML =
    '<img ' +
    'src="' + escapeHtml(url) + '" ' +
    'alt="شعار المطعم" ' +
    'onerror="this.style.display=\\'none\\'">';

}


async function loadCategories(){

  const data =
    await api("/api/categories");

  categories =
    data.categories;

  renderCategories();

}


function renderCategories(){

  const box =
    document.getElementById("categories");

  const select =
    document.getElementById("itemCategory");

  box.innerHTML = "";

  select.innerHTML =
    '<option value="">بدون قسم</option>';


  categories.forEach(category => {

    const row =
      document.createElement("div");

    row.className =
      "category-row";

    row.innerHTML =
      '<strong>' +
      escapeHtml(category.name) +
      '</strong>' +

      '<button ' +
      'class="danger" ' +
      'onclick="removeCategory(\\'' +
      category.id +
      '\\')">' +
      'حذف' +
      '</button>';

    box.appendChild(row);


    const option =
      document.createElement("option");

    option.value =
      category.id;

    option.textContent =
      category.name;

    select.appendChild(option);

  });


  if(!categories.length){

    box.innerHTML =
      '<div class="small">' +
      'لم تتم إضافة أقسام بعد.' +
      '</div>';

  }

}


async function addCategory(){

  const name =
    document.getElementById(
      "categoryName"
    ).value.trim();

  if(!name){
    return;
  }

  try{

    await api(
      "/api/categories",
      {
        method:"POST",
        body:JSON.stringify({name})
      }
    );

    document.getElementById(
      "categoryName"
    ).value = "";

    await loadCategories();

  }catch(error){

    alert(error.message);

  }

}


async function removeCategory(id){

  if(!confirm("هل تريد حذف هذا القسم؟")){
    return;
  }

  try{

    await api(
      "/api/categories/" + id,
      {
        method:"DELETE"
      }
    );

    await loadCategories();
    await loadItems();

  }catch(error){

    alert(error.message);

  }

}


async function loadItems(){

  const data =
    await api("/api/items");

  items =
    data.items;

  renderItems();

}


function renderItems(){

  const box =
    document.getElementById("items");

  box.innerHTML = "";


  if(!items.length){

    box.innerHTML =
      '<div class="small">' +
      'لم تتم إضافة أصناف بعد.' +
      '</div>';

    return;
  }


  items.forEach(item => {

    const row =
      document.createElement("div");

    row.className =
      "item-row";


    let image =
      '<div class="no-logo">ل</div>';

    if(item.image){

      image =
        '<img ' +
        'class="item-image" ' +
        'src="' +
        escapeHtml(item.image) +
        '" ' +
        'alt="' +
        escapeHtml(item.name) +
        '">';
    }


    const categoryText =
      item.category_name
        ? " — " +
          escapeHtml(item.category_name)
        : "";


    row.innerHTML =
      '<div class="item-main">' +

        image +

        '<div class="item-info">' +

          '<div class="item-name">' +
            escapeHtml(item.name) +
          '</div>' +

          '<div class="small">' +
            Number(item.price).toFixed(2) +
            ' جنيه' +
            categoryText +
          '</div>' +

          '<div class="small">' +
            escapeHtml(item.description || "") +
          '</div>' +

        '</div>' +

      '</div>' +

      '<div class="item-actions">' +

        '<button ' +
        'class="danger" ' +
        'onclick="editItem(\\'' +
        item.id +
        '\\')">' +
        'تعديل' +
        '</button>' +

        '<button ' +
        'class="danger" ' +
        'onclick="removeItem(\\'' +
        item.id +
        '\\')">' +
        'حذف' +
        '</button>' +

      '</div>';


    box.appendChild(row);

  });

}


async function addItem(){

  try{

    const name =
      document.getElementById(
        "itemName"
      ).value.trim();

    const price =
      document.getElementById(
        "itemPrice"
      ).value;

    const category_id =
      document.getElementById(
        "itemCategory"
      ).value;

    const description =
      document.getElementById(
        "itemDescription"
      ).value;

    const image =
      document.getElementById(
        "itemImage"
      ).value;


    await api(
      "/api/items",
      {
        method:"POST",
        body:JSON.stringify({
          name,
          price,
          category_id,
          description,
          image
        })
      }
    );


    document.getElementById(
      "itemName"
    ).value = "";

    document.getElementById(
      "itemPrice"
    ).value = "";

    document.getElementById(
      "itemDescription"
    ).value = "";

    document.getElementById(
      "itemImage"
    ).value = "";

    document.getElementById(
      "itemMessage"
    ).textContent =
      "تم إضافة الصنف ✓";


    await loadItems();

  }catch(error){

    document.getElementById(
      "itemMessage"
    ).textContent =
      error.message;

  }

}


async function editItem(id){

  const item =
    items.find(x => x.id === id);

  if(!item){
    return;
  }


  const name =
    prompt(
      "اسم الصنف:",
      item.name
    );

  if(name === null){
    return;
  }


  const price =
    prompt(
      "السعر:",
      item.price
    );

  if(price === null){
    return;
  }


  const description =
    prompt(
      "الوصف:",
      item.description || ""
    );

  if(description === null){
    return;
  }


  const category =
    prompt(
      "اكتب اسم القسم أو اتركه كما هو:",
      item.category_name || ""
    );


  let categoryId =
    item.category_id || "";


  if(category !== null && category.trim()){

    const found =
      categories.find(
        x =>
          x.name.trim() ===
          category.trim()
      );

    if(found){
      categoryId = found.id;
    }

  }


  try{

    await api(
      "/api/items/" + id,
      {
        method:"PUT",
        body:JSON.stringify({

          name,
          price,
          description,

          category_id:
            categoryId,

          image:
            item.image || ""

        })
      }
    );

    await loadItems();

  }catch(error){

    alert(error.message);

  }

}


async function removeItem(id){

  if(!confirm("هل تريد حذف هذا الصنف؟")){
    return;
  }

  try{

    await api(
      "/api/items/" + id,
      {
        method:"DELETE"
      }
    );

    await loadItems();

  }catch(error){

    alert(error.message);

  }

}


async function logout(){

  await fetch(
    "/api/logout",
    {
      method:"POST",
      credentials:"same-origin"
    }
  );

  location.href="/";

}


function escapeHtml(value){

  return String(value || "")
    .replaceAll("&","&amp;")
    .replaceAll("<","&lt;")
    .replaceAll(">","&gt;")
    .replaceAll('"',"&quot;")
    .replaceAll("'","&#039;");

}


load();

</script>

<footer class="site-footer">
  <div>© 2026 جميع الحقوق محفوظة — M/ Mohamed Abdalaziem</div>
  <div>منيو وموقع مطعمك، بلمسة واحدة.</div>
</footer>

</body>

</html>
`;
}


// =========================
// PUBLIC MENU
// =========================

function publicMenuPage(
  restaurant,
  categories,
  items
) {

  const theme =
    THEMES[restaurant.theme]
      || THEMES.modern;

  let background =
    theme.background;

  const customBackground =
    restaurant.background || "";

  const customBackgrounds = {

    bg1:
      "linear-gradient(135deg,#201a15,#5b4127)",

    bg2:
      "linear-gradient(135deg,#f4e7d5,#fffaf3)",

    bg3:
      "linear-gradient(135deg,#dcebdc,#f8fff7)",

    bg4:
      "linear-gradient(135deg,#222,#555)",

    bg5:
      "linear-gradient(135deg,#efe1cf,#d3a66c,#6d4b2e)"

  };


  if(customBackgrounds[customBackground]){
    background =
      customBackgrounds[customBackground];
  }


  let sections = "";


  for(const category of categories){

    const categoryItems =
      items.filter(
        item =>
          item.category_id === category.id
      );

    if(!categoryItems.length){
      continue;
    }


    let itemHtml = "";


    for(const item of categoryItems){

      let imageHtml = "";

      if(item.image){

        imageHtml =
          '<img class="item-image" ' +
          'src="' +
          escapeHtml(item.image) +
          '" ' +
          'alt="' +
          escapeHtml(item.name) +
          '">';

      }


      let descriptionHtml = "";

      if(item.description){

        descriptionHtml =
          '<p>' +
          escapeHtml(item.description) +
          '</p>';

      }


      itemHtml +=
        '<article class="item">' +

          imageHtml +

          '<div class="item-info">' +

            '<div class="item-top">' +

              '<h3>' +
                escapeHtml(item.name) +
              '</h3>' +

              '<strong>' +
                Number(item.price).toFixed(2) +
                ' ج' +
              '</strong>' +

            '</div>' +

            descriptionHtml +

          '</div>' +

        '</article>';

    }


    sections +=
      '<section class="category">' +

        '<div class="category-title">' +

          '<span></span>' +

          '<h2>' +
            escapeHtml(category.name) +
          '</h2>' +

          '<span></span>' +

        '</div>' +

        '<div class="items">' +
          itemHtml +
        '</div>' +

      '</section>';

  }


  const uncategorized =
    items.filter(
      item =>
        !item.category_id
    );


  if(uncategorized.length){

    let otherItems = "";


    for(const item of uncategorized){

      let imageHtml = "";

      if(item.image){

        imageHtml =
          '<img class="item-image" ' +
          'src="' +
          escapeHtml(item.image) +
          '" ' +
          'alt="' +
          escapeHtml(item.name) +
          '">';

      }


      let descriptionHtml = "";

      if(item.description){

        descriptionHtml =
          '<p>' +
          escapeHtml(item.description) +
          '</p>';

      }


      otherItems +=
        '<article class="item">' +

          imageHtml +

          '<div class="item-info">' +

            '<div class="item-top">' +

              '<h3>' +
                escapeHtml(item.name) +
              '</h3>' +

              '<strong>' +
                Number(item.price).toFixed(2) +
                ' ج' +
              '</strong>' +

            '</div>' +

            descriptionHtml +

          '</div>' +

        '</article>';

    }


    sections +=
      '<section class="category">' +

        '<div class="category-title">' +

          '<span></span>' +

          '<h2>أصناف أخرى</h2>' +

          '<span></span>' +

        '</div>' +

        '<div class="items">' +
          otherItems +
        '</div>' +

      '</section>';

  }


  let restaurantDescription = "";

  if(restaurant.description){

    restaurantDescription =
      '<p class="restaurant-description">' +
      escapeHtml(restaurant.description) +
      '</p>';

  }


  let logoHtml =
    '<div class="logo-fallback">ل</div>';


  if(restaurant.logo){

    logoHtml =
      '<img class="restaurant-logo" ' +
      'src="' +
      escapeHtml(restaurant.logo) +
      '" ' +
      'alt="' +
      escapeHtml(restaurant.name) +
      '">';
  }


  return `
<!DOCTYPE html>
<html lang="ar" dir="rtl">

<head>

<meta charset="UTF-8">

<meta
name="viewport"
content="width=device-width,initial-scale=1">

<title>
${escapeHtml(restaurant.name)} | لمسة
</title>

<style>

*{
  box-sizing:border-box;
}

html{
  scroll-behavior:smooth;
}

body{
  margin:0;
  font-family:Arial,sans-serif;
  background:${background};
  color:${theme.text};
  min-height:100vh;
}

.page{
  min-height:100vh;
  background:
    radial-gradient(
      circle at 20% 10%,
      rgba(255,255,255,.12),
      transparent 30%
    );
}

.hero{
  padding:45px 18px 35px;
  text-align:center;
}

.restaurant-logo,
.logo-fallback{
  width:92px;
  height:92px;
  border-radius:28px;
  margin:0 auto 18px;
  object-fit:contain;
  background:rgba(255,255,255,.14);
  box-shadow:0 15px 45px rgba(0,0,0,.14);
}

.logo-fallback{
  display:flex;
  align-items:center;
  justify-content:center;
  font-size:45px;
  font-weight:900;
  color:${theme.accent};
}

.hero h1{
  margin:0;
  font-size:clamp(30px,7vw,52px);
  letter-spacing:-1px;
}

.restaurant-description{
  max-width:650px;
  margin:14px auto 0;
  line-height:1.9;
  opacity:.78;
}

.powered{
  display:inline-block;
  margin-top:18px;
  padding:7px 13px;
  border-radius:30px;
  background:rgba(255,255,255,.1);
  font-size:11px;
  opacity:.65;
}

.menu{
  max-width:900px;
  margin:auto;
  padding:15px 15px 60px;
}

.category{
  margin-bottom:40px;
}

.category-title{
  display:grid;
  grid-template-columns:1fr auto 1fr;
  align-items:center;
  gap:12px;
  margin-bottom:17px;
}

.category-title span{
  height:1px;
  background:${theme.accent};
  opacity:.35;
}

.category-title h2{
  margin:0;
  color:${theme.accent};
  font-size:25px;
  white-space:nowrap;
}

.items{
  display:grid;
  gap:12px;
}

.item{
  background:${theme.card};
  color:${theme.text};
  border:1px solid rgba(255,255,255,.09);
  border-radius:18px;
  padding:12px;
  display:flex;
  gap:14px;
  align-items:center;
  box-shadow:0 10px 35px rgba(0,0,0,.08);
}

.item-image{
  width:92px;
  height:92px;
  object-fit:cover;
  border-radius:14px;
  flex:none;
  background:#eee;
}

.item-info{
  flex:1;
  min-width:0;
}

.item-top{
  display:flex;
  align-items:flex-start;
  justify-content:space-between;
  gap:14px;
}

.item h3{
  margin:0;
  font-size:18px;
  line-height:1.5;
}

.item strong{
  color:${theme.accent};
  white-space:nowrap;
  font-size:17px;
}

.item p{
  margin:7px 0 0;
  opacity:.65;
  line-height:1.7;
  font-size:14px;
}

.footer{
  text-align:center;
  padding:25px 15px 35px;
  opacity:.55;
  font-size:12px;
}

@media(max-width:600px){

  .hero{
    padding-top:32px;
  }

  .restaurant-logo,
  .logo-fallback{
    width:78px;
    height:78px;
    border-radius:22px;
  }

  .item{
    align-items:flex-start;
  }

  .item-image{
    width:76px;
    height:76px;
  }

  .item-top{
    flex-direction:column;
    gap:3px;
  }

  .item strong{
    font-size:15px;
  }

  .category-title h2{
    font-size:21px;
  }

}

.site-footer{padding:24px 16px;text-align:center;color:#888;font-size:12px;line-height:2;margin-top:35px;border-top:1px solid #eee}.site-footer span{color:#aaa}</style>

</head>

<body>

<div class="page">

<header class="hero">

${logoHtml}

<h1>
${escapeHtml(restaurant.name)}
</h1>

${restaurantDescription}

<div class="powered">
LAMSA • لمسة
</div>

</header>

<main class="menu">

${sections}

</main>

<footer class="footer">
Powered by LAMSA — لمسة
</footer>

</div>

<footer class="site-footer">© 2026 جميع الحقوق محفوظة — M/ Mohamed Abdalaziem<br><span>منيو وموقع مطعمك، بلمسة واحدة.</span></footer></body>

</html>
`;
}


// =========================
// ERROR MENU
// =========================


function expiredMenuPage(restaurant) {
  return `
<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>المنيو متوقفة | LAMSA</title>
<style>
body{margin:0;min-height:100vh;display:grid;place-items:center;background:#f5f2ee;font-family:Arial,sans-serif;color:#222;padding:20px}
.box{max-width:520px;width:100%;background:#fff;border-radius:28px;padding:38px;text-align:center;box-shadow:0 20px 60px #0001}
.logo{font-size:34px;font-weight:900;letter-spacing:4px;margin-bottom:12px}
.icon{font-size:55px;margin:15px}
h1{margin:0 0 10px}.muted{color:#777;line-height:1.9}
.site-footer{padding:24px 16px;text-align:center;color:#888;font-size:12px;line-height:2;margin-top:35px;border-top:1px solid #eee}.site-footer span{color:#aaa}</style>
</head>
<body>
<div class="box">
<div class="logo">LAMSA</div>
<div class="icon">⏸️</div>
<h1>المنيو متوقفة مؤقتًا</h1>
<p class="muted">منيو ${escapeHtml(restaurant.name || "")} انتهت مدتها الحالية. يرجى التواصل مع صاحب المكان.</p>
</div>
<footer class="site-footer">© 2026 جميع الحقوق محفوظة — M/ Mohamed Abdalaziem<br><span>منيو وموقع مطعمك، بلمسة واحدة.</span></footer></body>
</html>`;
}

function adminPage() {
  return `
<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>إدارة LAMSA</title>
<style>
*{box-sizing:border-box}body{margin:0;font-family:Arial,sans-serif;background:#f4f2ef;color:#222}
header{background:#171411;color:#fff;padding:18px 5%;display:flex;justify-content:space-between;align-items:center;position:sticky;top:0;z-index:3}
.brand{font-size:25px;font-weight:900;letter-spacing:4px}.back{color:#fff;text-decoration:none;background:#ffffff18;padding:10px 14px;border-radius:10px}
main{max-width:1200px;margin:auto;padding:24px 16px}.card{background:#fff;border-radius:20px;padding:20px;margin-bottom:14px;box-shadow:0 8px 30px #00000008}
.row{display:flex;justify-content:space-between;gap:15px;align-items:center;border-bottom:1px solid #eee;padding:15px 0}.row:last-child{border:0}
.info h3{margin:0 0 7px}.muted{color:#777;font-size:13px;line-height:1.7}
.status{padding:7px 10px;border-radius:99px;font-size:12px;font-weight:bold}.on{background:#e7f6eb;color:#26723c}.off{background:#f9e7e7;color:#9a3030}
button{border:0;border-radius:10px;padding:10px 14px;background:#171411;color:#fff;cursor:pointer;font-weight:bold}
@media(max-width:650px){.row{align-items:flex-start;flex-direction:column}}
</style>
</head>
<body>
<header><div class="brand">LAMSA</div><a class="back" href="/dashboard">لوحة المطعم</a></header>
<main><div class="card"><h2>إدارة المنيوهات</h2><p class="muted">هذه الصفحة خاصة بالإدارة فقط. من هنا يتم تشغيل المنيو بعد انتهاء المدة.</p></div><div id="list" class="card">جاري التحميل...</div></main>
<script>
async function load(){
 const r=await fetch('/api/admin/restaurants',{credentials:'same-origin'});
 const d=await r.json();
 if(!r.ok||!d.ok){location.href='/dashboard';return}
 const box=document.getElementById('list');
 if(!d.restaurants.length){box.innerHTML='<p>لا توجد منيوهات.</p>';return}
 box.innerHTML=d.restaurants.map(x=>{
   const active=Number(x.menu_enabled)===1&&new Date(x.menu_expires_at).getTime()>Date.now();
   const date=x.menu_expires_at?new Date(x.menu_expires_at).toLocaleString('ar-EG'):'-';
   return '<div class="row"><div class="info"><h3>'+esc(x.name||'بدون اسم')+'</h3><div class="muted">المالك: '+esc(x.owner_name||'')+'<br>'+esc(x.owner_phone||'')+'<br>الانتهاء: '+esc(date)+'</div></div><div><span class="status '+(active?'on':'off')+'">'+(active?'نشطة':'متوقفة')+'</span><br><button style="margin-top:8px" onclick="renew(\\''+x.id+'\\')">تشغيل 30 يوم</button></div></div>'
 }).join('');
}
async function renew(id){
 const r=await fetch('/api/admin/restaurants/'+encodeURIComponent(id)+'/renew',{method:'POST',headers:{'Content-Type':'application/json'},credentials:'same-origin',body:JSON.stringify({days:30})});
 const d=await r.json(); alert(d.message||d.error||'تم'); if(d.ok) load();
}
function esc(v){return String(v||'').replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;').replaceAll("'","&#039;")}
load();
</script>
</body>
</html>`;
}

function errorMenuPage(message) {
  return `
<!DOCTYPE html>
<html lang="ar" dir="rtl">

<head>

<meta charset="UTF-8">

<meta
name="viewport"
content="width=device-width,initial-scale=1">

<title>لمسة</title>

<style>

body{
  margin:0;
  min-height:100vh;
  display:flex;
  align-items:center;
  justify-content:center;
  font-family:Arial,sans-serif;
  background:#f5f1eb;
  color:#222;
}

.box{
  text-align:center;
  padding:30px;
}

.logo{
  width:70px;
  height:70px;
  border-radius:22px;
  background:#211d19;
  color:#d9b06a;
  display:flex;
  align-items:center;
  justify-content:center;
  margin:0 auto 20px;
  font-size:34px;
  font-weight:900;
}

h1{
  margin:0;
}

</style>

</head>

<body>

<div class="box">

<div class="logo">
ل
</div>

<h1>
${escapeHtml(message)}
</h1>

</div>

</body>

</html>
`;
}
