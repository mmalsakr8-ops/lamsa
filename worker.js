const COOKIE = "lamsa_session";
const SESSION_DAYS = 30;
const TRIAL_DAYS = 30;

export default {
  async fetch(request, env) {
    try {
      await initDB(env);

      const url = new URL(request.url);
      const path = url.pathname;

      if (request.method === "OPTIONS") {
        return new Response(null, {
          status: 204,
          headers: corsHeaders()
        });
      }

      // اختبار النظام
      if (path === "/health") {
        return json({
          ok: true,
          service: "LAMSA",
          message: "لمسة تعمل بنجاح"
        });
      }

      // API
      if (path === "/api/register" && request.method === "POST")
        return register(request, env);

      if (path === "/api/login" && request.method === "POST")
        return login(request, env);

      if (path === "/api/logout" && request.method === "POST")
        return logout(request, env);

      if (path === "/api/me" && request.method === "GET")
        return me(request, env);

      // الصفحات
      if (path === "/login" || path === "/register" || path === "/auth")
        return html(authPage());

      if (path === "/dashboard")
        return html(dashboardPage());

      return html(homePage());

    } catch (error) {
      return json({
        ok: false,
        error: "حدث خطأ في النظام",
        detail: error.message
      }, 500);
    }
  }
};


/* =========================
   DATABASE
========================= */

async function initDB(env) {
  await env.DB.batch([
    env.DB.prepare(`
      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE,
        phone TEXT NOT NULL UNIQUE,
        password_hash TEXT NOT NULL,
        role TEXT NOT NULL DEFAULT 'customer',
        created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
      )
    `),

    env.DB.prepare(`
      CREATE TABLE IF NOT EXISTS sessions (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        expires_at TEXT NOT NULL,
        created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `)
  ]);
}


/* =========================
   REGISTER
========================= */

async function register(request, env) {
  const body = await request.json();

  const name = clean(body.name);
  const email = clean(body.email).toLowerCase();
  const phone = clean(body.phone);
  const password = String(body.password || "");

  if (!name || !email || !phone || !password) {
    return json({
      ok: false,
      error: "من فضلك أكمل جميع البيانات"
    }, 400);
  }

  if (password.length < 6) {
    return json({
      ok: false,
      error: "كلمة المرور يجب أن تكون 6 أحرف على الأقل"
    }, 400);
  }

  if (!isEmail(email)) {
    return json({
      ok: false,
      error: "البريد الإلكتروني غير صحيح"
    }, 400);
  }

  const existing = await env.DB.prepare(`
    SELECT id, email, phone
    FROM users
    WHERE email = ? OR phone = ?
    LIMIT 1
  `).bind(email, phone).first();

  if (existing) {
    if (existing.email === email) {
      return json({
        ok: false,
        error: "البريد الإلكتروني مستخدم بالفعل"
      }, 409);
    }

    return json({
      ok: false,
      error: "رقم الهاتف مستخدم بالفعل"
    }, 409);
  }

  const count = await env.DB
    .prepare(`SELECT COUNT(*) AS total FROM users`)
    .first();

  // أول حساب = مدير النظام
  const role = Number(count.total) === 0 ? "admin" : "customer";

  const id = crypto.randomUUID();
  const passwordHash = await hashPassword(password);

  await env.DB.prepare(`
    INSERT INTO users
    (id, name, email, phone, password_hash, role)
    VALUES (?, ?, ?, ?, ?, ?)
  `).bind(
    id,
    name,
    email,
    phone,
    passwordHash,
    role
  ).run();

  const session = await createSession(env, id);

  return new Response(
    JSON.stringify({
      ok: true,
      message: "تم إنشاء الحساب بنجاح",
      user: {
        id,
        name,
        email,
        phone,
        role
      }
    }),
    {
      status: 201,
      headers: {
        ...corsHeaders(),
        "content-type": "application/json; charset=UTF-8",
        "set-cookie": sessionCookie(session)
      }
    }
  );
}


/* =========================
   LOGIN
========================= */

async function login(request, env) {
  const body = await request.json();

  const identifier = clean(body.identifier).toLowerCase();
  const password = String(body.password || "");

  if (!identifier || !password) {
    return json({
      ok: false,
      error: "أدخل البريد أو رقم الهاتف وكلمة المرور"
    }, 400);
  }

  const user = await env.DB.prepare(`
    SELECT *
    FROM users
    WHERE LOWER(email) = ? OR phone = ?
    LIMIT 1
  `).bind(identifier, identifier).first();

  if (!user) {
    return json({
      ok: false,
      error: "بيانات الدخول غير صحيحة"
    }, 401);
  }

  const valid = await verifyPassword(
    password,
    user.password_hash
  );

  if (!valid) {
    return json({
      ok: false,
      error: "بيانات الدخول غير صحيحة"
    }, 401);
  }

  const session = await createSession(env, user.id);

  return new Response(
    JSON.stringify({
      ok: true,
      message: "تم تسجيل الدخول بنجاح",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role
      }
    }),
    {
      headers: {
        ...corsHeaders(),
        "content-type": "application/json; charset=UTF-8",
        "set-cookie": sessionCookie(session)
      }
    }
  );
}


/* =========================
   SESSION
========================= */

async function createSession(env, userId) {
  const id = crypto.randomUUID();

  const expires = new Date(
    Date.now() + SESSION_DAYS * 86400000
  ).toISOString();

  await env.DB.prepare(`
    INSERT INTO sessions
    (id, user_id, expires_at)
    VALUES (?, ?, ?)
  `).bind(
    id,
    userId,
    expires
  ).run();

  return {
    id,
    expires
  };
}

function sessionCookie(session) {
  return `${COOKIE}=${session.id}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=${SESSION_DAYS * 86400}`;
}

function getCookie(request, name) {
  const header = request.headers.get("Cookie") || "";

  for (const part of header.split(";")) {
    const [key, ...rest] = part.trim().split("=");

    if (key === name) {
      return rest.join("=");
    }
  }

  return null;
}

async function currentUser(request, env) {
  const sessionId = getCookie(request, COOKIE);

  if (!sessionId) return null;

  const session = await env.DB.prepare(`
    SELECT
      sessions.id,
      sessions.expires_at,
      users.id AS user_id,
      users.name,
      users.email,
      users.phone,
      users.role
    FROM sessions
    JOIN users ON users.id = sessions.user_id
    WHERE sessions.id = ?
    LIMIT 1
  `).bind(sessionId).first();

  if (!session) return null;

  if (new Date(session.expires_at).getTime() < Date.now()) {
    await env.DB.prepare(`
      DELETE FROM sessions WHERE id = ?
    `).bind(sessionId).run();

    return null;
  }

  return {
    id: session.user_id,
    name: session.name,
    email: session.email,
    phone: session.phone,
    role: session.role
  };
}


/* =========================
   ME
========================= */

async function me(request, env) {
  const user = await currentUser(request, env);

  if (!user) {
    return json({
      ok: false,
      authenticated: false
    }, 401);
  }

  return json({
    ok: true,
    authenticated: true,
    user
  });
}


/* =========================
   LOGOUT
========================= */

async function logout(request, env) {
  const sessionId = getCookie(request, COOKIE);

  if (sessionId) {
    await env.DB.prepare(`
      DELETE FROM sessions WHERE id = ?
    `).bind(sessionId).run();
  }

  return new Response(
    JSON.stringify({
      ok: true,
      message: "تم تسجيل الخروج"
    }),
    {
      headers: {
        ...corsHeaders(),
        "content-type": "application/json; charset=UTF-8",
        "set-cookie": `${COOKIE}=; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=0`
      }
    }
  );
}


/* =========================
   PASSWORD
========================= */

async function hashPassword(password) {
  const salt = crypto.getRandomValues(new Uint8Array(16));

  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(password),
    "PBKDF2",
    false,
    ["deriveBits"]
  );

  const bits = await crypto.subtle.deriveBits(
    {
      name: "PBKDF2",
      salt,
      iterations: 100000,
      hash: "SHA-256"
    },
    key,
    256
  );

  return `pbkdf2$100000$${bytesToBase64(salt)}$${bytesToBase64(new Uint8Array(bits))}`;
}

async function verifyPassword(password, stored) {
  try {
    const parts = stored.split("$");

    if (parts.length !== 4) return false;

    const iterations = Number(parts[1]);
    const salt = base64ToBytes(parts[2]);
    const expected = base64ToBytes(parts[3]);

    const key = await crypto.subtle.importKey(
      "raw",
      new TextEncoder().encode(password),
      "PBKDF2",
      false,
      ["deriveBits"]
    );

    const bits = await crypto.subtle.deriveBits(
      {
        name: "PBKDF2",
        salt,
        iterations,
        hash: "SHA-256"
      },
      key,
      256
    );

    return timingSafeEqual(
      expected,
      new Uint8Array(bits)
    );
  } catch {
    return false;
  }
}

function timingSafeEqual(a, b) {
  if (a.length !== b.length) return false;

  let result = 0;

  for (let i = 0; i < a.length; i++) {
    result |= a[i] ^ b[i];
  }

  return result === 0;
}

function bytesToBase64(bytes) {
  let binary = "";

  for (const byte of bytes) {
    binary += String.fromCharCode(byte);
  }

  return btoa(binary);
}

function base64ToBytes(value) {
  const binary = atob(value);
  const bytes = new Uint8Array(binary.length);

  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }

  return bytes;
}


/* =========================
   HOME PAGE
========================= */

function homePage() {
  return `
<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>لمسة | LAMSA</title>

<style>
*{box-sizing:border-box}
body{
 margin:0;
 font-family:Arial,sans-serif;
 background:#f8f6f2;
 color:#202020;
}
header{
 height:76px;
 padding:0 7%;
 background:#fff;
 border-bottom:1px solid #eee;
 display:flex;
 align-items:center;
 justify-content:space-between;
}
.logo{
 font-size:28px;
 font-weight:900;
}
.logo small{
 display:block;
 font-size:10px;
 letter-spacing:4px;
 color:#999;
 direction:ltr;
}
button{
 cursor:pointer;
 border:0;
 font-family:inherit;
}
.login{
 background:#202020;
 color:white;
 padding:12px 22px;
 border-radius:10px;
}
.hero{
 min-height:calc(100vh - 76px);
 display:flex;
 align-items:center;
 justify-content:center;
 text-align:center;
 padding:50px 20px;
}
.hero-box{
 max-width:850px;
}
.badge{
 display:inline-block;
 background:#eee5da;
 color:#79512e;
 padding:9px 18px;
 border-radius:30px;
 margin-bottom:25px;
}
h1{
 font-size:clamp(42px,8vw,78px);
 line-height:1.15;
 margin:0;
}
h1 span{color:#a86c35}
.hero p{
 color:#666;
 font-size:19px;
 line-height:1.9;
 max-width:680px;
 margin:25px auto;
}
.actions{
 display:flex;
 justify-content:center;
 gap:12px;
 flex-wrap:wrap;
 margin-top:30px;
}
.primary,.secondary{
 padding:15px 30px;
 border-radius:12px;
 font-size:16px;
}
.primary{
 background:#202020;
 color:white;
}
.secondary{
 background:white;
 border:1px solid #ddd;
}
</style>
</head>

<body>

<header>
 <div class="logo">
  لمسة
  <small>LAMSA</small>
 </div>

 <button class="login" onclick="location.href='/login'">
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
   أنشئ موقع مطعمك أو كافيهك ومنيوك الرقمية
   بسهولة، واختر التصميم المناسب لك وتحكم
   في بياناتك وأسعارك ومنيوك بنفسك.
  </p>

  <div class="actions">
   <button class="primary" onclick="location.href='/register'">
    ابدأ الآن
   </button>

   <button class="secondary" onclick="location.href='/login'">
    لدي حساب بالفعل
   </button>
  </div>

 </div>
</section>

</body>
</html>
`;
}


/* =========================
   AUTH PAGE
========================= */

function authPage() {
  return `
<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">

<title>تسجيل الدخول | لمسة</title>

<style>
*{box-sizing:border-box}

body{
 margin:0;
 min-height:100vh;
 font-family:Arial,sans-serif;
 background:#f7f5f1;
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
 border-radius:22px;
 padding:32px;
 box-shadow:0 15px 50px rgba(0,0,0,.06);
}

.logo{
 text-align:center;
 font-size:32px;
 font-weight:900;
 margin-bottom:8px;
}

.subtitle{
 text-align:center;
 color:#777;
 margin-bottom:28px;
}

.tabs{
 display:grid;
 grid-template-columns:1fr 1fr;
 background:#f3f1ed;
 padding:5px;
 border-radius:12px;
 margin-bottom:24px;
}

.tab{
 padding:12px;
 border-radius:9px;
 background:transparent;
}

.tab.active{
 background:#222;
 color:#fff;
}

label{
 display:block;
 margin:14px 0 7px;
 font-weight:700;
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
 border-color:#999;
}

.submit{
 width:100%;
 padding:15px;
 margin-top:22px;
 background:#222;
 color:#fff;
 border-radius:11px;
 font-size:16px;
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

.hidden{display:none}
</style>
</head>

<body>

<div class="card">

 <div class="logo">لمسة</div>

 <div class="subtitle">
  LAMSA — منصتك الرقمية
 </div>

 <div class="tabs">
  <button class="tab active" id="loginTab" onclick="showLogin()">
   تسجيل الدخول
  </button>

  <button class="tab" id="registerTab" onclick="showRegister()">
   إنشاء حساب
  </button>
 </div>


 <!-- LOGIN -->

 <form id="loginForm">

  <label>البريد الإلكتروني أو رقم الهاتف</label>

  <input
   id="loginIdentifier"
   type="text"
   placeholder="example@email.com"
   autocomplete="username"
   required
  >

  <label>كلمة المرور</label>

  <input
   id="loginPassword"
   type="password"
   placeholder="كلمة المرور"
   autocomplete="current-password"
   required
  >

  <button class="submit" type="submit">
   تسجيل الدخول
  </button>

 </form>


 <!-- REGISTER -->

 <form id="registerForm" class="hidden">

  <label>الاسم</label>

  <input
   id="registerName"
   type="text"
   placeholder="اسمك"
   required
  >

  <label>رقم الهاتف</label>

  <input
   id="registerPhone"
   type="tel"
   placeholder="01xxxxxxxxx"
   required
  >

  <label>البريد الإلكتروني</label>

  <input
   id="registerEmail"
   type="email"
   placeholder="example@email.com"
   required
  >

  <label>كلمة المرور</label>

  <input
   id="registerPassword"
   type="password"
   placeholder="6 أحرف على الأقل"
   minlength="6"
   required
  >

  <button class="submit" type="submit">
   إنشاء الحساب
  </button>

 </form>

 <div id="message" class="message"></div>

 <a href="/" class="back">
  ← العودة إلى الرئيسية
 </a>

</div>


<script>

const loginForm = document.getElementById("loginForm");
const registerForm = document.getElementById("registerForm");
const loginTab = document.getElementById("loginTab");
const registerTab = document.getElementById("registerTab");
const message = document.getElementById("message");

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

loginForm.addEventListener("submit", async function(e){
 e.preventDefault();

 const button = loginForm.querySelector("button[type=submit]");
 button.disabled = true;
 button.textContent = "جارٍ تسجيل الدخول...";

 try{

  const response = await fetch("/api/login",{
   method:"POST",
   headers:{
    "Content-Type":"application/json"
   },
   credentials:"same-origin",
   body:JSON.stringify({
    identifier:document.getElementById("loginIdentifier").value.trim(),
    password:document.getElementById("loginPassword").value
   })
  });

  const data = await response.json();

  if(!response.ok || !data.ok){
   throw new Error(data.error || "تعذر تسجيل الدخول");
  }

  location.href="/dashboard";

 }catch(error){

  showMessage(error.message);

  button.disabled = false;
  button.textContent = "تسجيل الدخول";
 }
});


registerForm.addEventListener("submit", async function(e){
 e.preventDefault();

 const button = registerForm.querySelector("button[type=submit]");
 button.disabled = true;
 button.textContent = "جارٍ إنشاء الحساب...";

 try{

  const response = await fetch("/api/register",{
   method:"POST",
   headers:{
    "Content-Type":"application/json"
   },
   credentials:"same-origin",
   body:JSON.stringify({

    name:document.getElementById("registerName").value.trim(),

    phone:document.getElementById("registerPhone").value.trim(),

    email:document.getElementById("registerEmail").value.trim(),

    password:document.getElementById("registerPassword").value
   })
  });

  const data = await response.json();

  if(!response.ok || !data.ok){
   throw new Error(data.error || "تعذر إنشاء الحساب");
  }

  location.href="/dashboard";

 }catch(error){

  showMessage(error.message);

  button.disabled = false;
  button.textContent = "إنشاء الحساب";
 }
});

</script>

</body>
</html>
`;
}


/* =========================
   DASHBOARD
========================= */

function dashboardPage() {
  return `
<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">

<title>لوحة التحكم | لمسة</title>

<style>
*{box-sizing:border-box}

body{
 margin:0;
 font-family:Arial,sans-serif;
 background:#f7f5f1;
 color:#222;
}

header{
 background:white;
 height:70px;
 border-bottom:1px solid #eee;
 padding:0 6%;
 display:flex;
 align-items:center;
 justify-content:space-between;
}

.logo{
 font-size:25px;
 font-weight:900;
}

.logout{
 background:#222;
 color:#fff;
 border:0;
 border-radius:10px;
 padding:11px 18px;
}

main{
 max-width:1100px;
 margin:auto;
 padding:35px 20px;
}

.welcome{
 background:#222;
 color:white;
 border-radius:20px;
 padding:30px;
 margin-bottom:25px;
}

.welcome h1{
 margin:0 0 10px;
}

.welcome p{
 margin:0;
 color:#ddd;
}

.grid{
 display:grid;
 grid-template-columns:repeat(2,1fr);
 gap:15px;
}

.card{
 background:white;
 border:1px solid #eee;
 border-radius:18px;
 padding:25px;
}

.card h2{
 margin-top:0;
}

.card p{
 color:#777;
 line-height:1.7;
}

@media(max-width:650px){
 .grid{
  grid-template-columns:1fr;
 }
}
</style>
</head>

<body>

<header>
 <div class="logo">لمسة</div>

 <button class="logout" onclick="logout()">
  تسجيل الخروج
 </button>
</header>

<main>

 <section class="welcome">
  <h1 id="welcome">أهلاً بك 👋</h1>
  <p>
   دي لوحة التحكم الخاصة بك في منصة لمسة.
  </p>
 </section>

 <section class="grid">

  <div class="card">
   <h2>🏪 إنشاء موقعك</h2>
   <p>
    قريبًا ستتمكن من إنشاء موقع مطعمك أو كافيهك
    واختيار التصميم المناسب.
   </p>
  </div>

  <div class="card">
   <h2>🍽️ إدارة المنيو</h2>
   <p>
    إضافة الأقسام والأصناف وتعديل الأسعار
    والوصف والصور.
   </p>
  </div>

  <div class="card">
   <h2>🎨 التصميمات</h2>
   <p>
    اختر التصميم المناسب لموقعك ومنيوك.
   </p>
  </div>

  <div class="card">
   <h2>💬 الدعم</h2>
   <p>
    تواصل مع فريق لمسة عند الحاجة.
   </p>
  </div>

 </section>

</main>

<script>

async function loadUser(){

 const response = await fetch("/api/me",{
  credentials:"same-origin"
 });

 if(!response.ok){
  location.href="/login";
  return;
 }

 const data = await response.json();

 if(!data.ok){
  location.href="/login";
  return;
 }

 document.getElementById("welcome").textContent =
  "أهلاً بك يا " + data.user.name + " 👋";
}

async function logout(){

 await fetch("/api/logout",{
  method:"POST",
  credentials:"same-origin"
 });

 location.href="/";
}

loadUser();

</script>

</body>
</html>
`;
}


/* =========================
   HELPERS
========================= */

function clean(value) {
  return String(value || "").trim();
}

function isEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function json(data, status = 200) {
  return new Response(
    JSON.stringify(data),
    {
      status,
      headers:{
        ...corsHeaders(),
        "content-type":"application/json; charset=UTF-8"
      }
    }
  );
}

function html(content) {
  return new Response(content,{
    headers:{
      "content-type":"text/html; charset=UTF-8"
    }
  });
}

function corsHeaders() {
  return {
    "Access-Control-Allow-Origin":"*",
    "Access-Control-Allow-Methods":"GET,POST,PUT,DELETE,OPTIONS",
    "Access-Control-Allow-Headers":"Content-Type"
  };
}
