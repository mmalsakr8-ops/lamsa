export default {
  async fetch(request) {
    const url = new URL(request.url);

    if (url.pathname === "/health") {
      return new Response(
        JSON.stringify({
          ok: true,
          service: "LAMSA",
          message: "لمسة تعمل بنجاح"
        }),
        {
          headers: {
            "content-type": "application/json; charset=UTF-8"
          }
        }
      );
    }

    return new Response(
      `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">

  <title>لمسة | LAMSA</title>

  <style>
    * {
      box-sizing: border-box;
    }

    body {
      margin: 0;
      font-family: Arial, sans-serif;
      background: #f8f7f4;
      color: #222;
    }

    header {
      height: 80px;
      padding: 0 7%;
      display: flex;
      align-items: center;
      justify-content: space-between;
      background: #fff;
      border-bottom: 1px solid #eee;
    }

    .logo {
      font-size: 28px;
      font-weight: 800;
    }

    .logo small {
      display: block;
      font-size: 11px;
      color: #777;
      letter-spacing: 2px;
      direction: ltr;
      text-align: right;
    }

    button {
      border: 0;
      cursor: pointer;
      font-size: 15px;
      border-radius: 10px;
    }

    .login {
      padding: 12px 22px;
      background: #222;
      color: #fff;
    }

    main {
      min-height: calc(100vh - 80px);
      display: flex;
      align-items: center;
      justify-content: center;
      text-align: center;
      padding: 40px 20px;
    }

    .hero {
      width: 100%;
      max-width: 850px;
    }

    .badge {
      display: inline-block;
      padding: 9px 18px;
      border-radius: 30px;
      background: #eee7dd;
      color: #79552f;
      margin-bottom: 22px;
    }

    h1 {
      margin: 0;
      font-size: clamp(42px, 8vw, 76px);
      line-height: 1.15;
    }

    h1 span {
      color: #a66a35;
    }

    .hero p {
      max-width: 650px;
      margin: 25px auto 0;
      color: #666;
      font-size: 19px;
      line-height: 1.9;
    }

    .buttons {
      margin-top: 32px;
      display: flex;
      justify-content: center;
      gap: 12px;
      flex-wrap: wrap;
    }

    .primary {
      padding: 15px 30px;
      background: #222;
      color: #fff;
    }

    .secondary {
      padding: 15px 30px;
      background: #fff;
      color: #222;
      border: 1px solid #ddd;
    }

    @media (max-width: 600px) {
      header {
        padding: 0 20px;
      }

      .logo {
        font-size: 24px;
      }

      .login {
        padding: 10px 15px;
        font-size: 14px;
      }

      .hero p {
        font-size: 17px;
      }
    }
  </style>
</head>

<body>

<header>
  <div class="logo">
    لمسة
    <small>LAMSA</small>
  </div>

  <button class="login" onclick="goLogin()">
    تسجيل الدخول
  </button>
</header>

<main>
  <section class="hero">

    <div class="badge">
      ✨ منصتك لبناء موقعك ومنيوك
    </div>

    <h1>
      ابنِ موقعك<br>
      <span>بلمسة واحدة</span>
    </h1>

    <p>
      أنشئ موقعك ومنيو مطعمك أو كافيهك بسهولة،
      واختر التصميم المناسب لك وتحكم في كل تفاصيله.
    </p>

    <div class="buttons">
      <button class="primary" onclick="goLogin()">
        ابدأ الآن
      </button>

      <button class="secondary" onclick="goLogin()">
        تسجيل الدخول
      </button>
    </div>

  </section>
</main>

<script>
  function goLogin() {
    window.location.href = "/login";
  }
</script>

</body>
</html>`,
      {
        headers: {
          "content-type": "text/html; charset=UTF-8"
        }
      }
    );
  }
};
