function homePage() {
  return `
<!DOCTYPE html>
<html lang="ar" dir="rtl">

<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>لمسة | LAMSA</title>

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

</style>
</head>

<body>

<header>

<div class="brand">

<div class="logo-mark">
ل
</div>

<div class="logo-text">
لمسة
<small>LAMSA</small>
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


<footer class="lamsa-footer">
  <div>M / Mohamed abdalaziem</div>
  <div>جميع الحقوق محفوظة © 2026</div>
</footer>
<style>
.lamsa-footer{
  width:100%;
  padding:18px 16px;
  text-align:center;
  background:rgba(15,15,15,.96);
  color:#fff;
  border-top:1px solid rgba(255,255,255,.12);
  font-size:13px;
  line-height:1.8;
}
.lamsa-footer div:first-child{
  font-weight:700;
  letter-spacing:.2px;
}
.lamsa-footer div:last-child{
  opacity:.72;
}
</style>

</body>
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
<title>الدخول | لمسة</title>

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

</style>

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


<footer class="lamsa-footer">
  <div>M / Mohamed abdalaziem</div>
  <div>جميع الحقوق محفوظة © 2026</div>
</footer>
<style>
.lamsa-footer{
  width:100%;
  padding:18px 16px;
  text-align:center;
  background:rgba(15,15,15,.96);
  color:#fff;
  border-top:1px solid rgba(255,255,255,.12);
  font-size:13px;
  line-height:1.8;
}
.lamsa-footer div:first-child{
  font-weight:700;
  letter-spacing:.2px;
}
.lamsa-footer div:last-child{
  opacity:.72;
}
</style>

</body>
</html>
`;
}


// =========================
// DASHBOARD
// =========================


export { homePage, authPage };
