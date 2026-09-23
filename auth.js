import { html } from '../utils.js';

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

</body>
</html>
`;
}


// =========================


export { authPage };
