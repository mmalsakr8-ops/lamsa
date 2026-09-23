import { html } from '../utils.js';

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
