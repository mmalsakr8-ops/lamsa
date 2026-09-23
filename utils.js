// Shared server utilities extracted unchanged from worker(9).js

function unauthorized() {
  return json({
    ok: false,
    error: "يجب تسجيل الدخول أولاً"
  }, 401);
}


function clean(value) {
  return String(value || "").trim();
}


function isEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}


function escapeHtml(value) {
  return String(value || "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}


function json(data, status = 200) {
  return new Response(
    JSON.stringify(data),
    {
      status,
      headers: {
        ...corsHeaders(),
        "content-type":
          "application/json; charset=UTF-8"
      }
    }
  );
}


function html(content, status = 200) {
  return new Response(
    content,
    {
      status,
      headers: {
        "content-type":
          "text/html; charset=UTF-8"
      }
    }
  );
}


function corsHeaders() {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods":
      "GET,POST,PUT,DELETE,OPTIONS",
    "Access-Control-Allow-Headers":
      "Content-Type"
  };
}


// =========================


export { unauthorized, clean, isEmail, escapeHtml, json, html, corsHeaders };
