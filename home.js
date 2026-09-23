import { html } from '../utils.js';

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

.site-footer{
  margin-top:60px;
  padding:28px 16px 24px;
  text-align:center;
  border-top:1px solid #ddd4ca;
  color:#211d19;
}
.site-footer-brand{font-size:24px;font-weight:800;letter-spacing:2px;}
.site-footer-copy{margin-top:8px;font-size:13px;color:#777;}
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

<footer class="site-footer">
  <div class="site-footer-brand">LAMSA</div>
  <div class="site-footer-copy">الحقوق محفوظة بواسطة M/mohamed abdalaziem</div>
</footer>

</body>
</html>
`;
}


// =========================


export { homePage };
