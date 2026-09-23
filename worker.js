const COOKIE = "lamsa_session";
const SESSION_DAYS = 30;
const OWNER_EMAIL = "admin@lamsa.local";
const OWNER_NAME = "LAMSA Owner";
const OWNER_PHONE = "__LAMSA_OWNER__";
const OWNER_PASSWORD_HASH = "pbkdf2$100000$6lSer6pmljTCjbnbWeqSMQ==$GcwPonJEDF8QepmW+2egBPbgzwCvqF17IPqy7sPazFQ=";

const THEMES = {
  luxury: { name: "فاخر أسود وذهبي", background: "linear-gradient(135deg,#17120d,#302217 45%,#111)", accent: "#d7ad63", card: "#211b15", text: "#fffaf0" },
  cafe: { name: "كافيه مودرن", background: "linear-gradient(135deg,#f6efe5,#fffaf4)", accent: "#9b6b43", card: "#ffffff", text: "#2d241e" },
  fresh: { name: "أخضر طبيعي", background: "linear-gradient(135deg,#edf5ed,#f8fbf6)", accent: "#4f7b59", card: "#ffffff", text: "#203226" },
  modern: { name: "مودرن أبيض", background: "linear-gradient(135deg,#f2f2f2,#ffffff)", accent: "#222222", card: "#ffffff", text: "#171717" },
  dark: { name: "دارك فاخر", background: "linear-gradient(135deg,#080808,#1c1c1c)", accent: "#ffffff", card: "#151515", text: "#ffffff" },
  royal: { name: "رويال أزرق", background: "linear-gradient(135deg,#0b1730,#1d3d70)", accent: "#e8c66a", card: "rgba(255,255,255,.10)", text: "#fff" },
  rose: { name: "روز ناعم", background: "linear-gradient(135deg,#fff1f5,#f8d8e3)", accent: "#a84f6b", card: "rgba(255,255,255,.88)", text: "#3c2029" },
  ocean: { name: "أوشن", background: "linear-gradient(135deg,#062d3e,#0b687a)", accent: "#9de7e2", card: "rgba(255,255,255,.10)", text: "#f7ffff" },
  coffee: { name: "قهوة", background: "linear-gradient(135deg,#2a1b14,#7a4f32)", accent: "#f0c38a", card: "rgba(255,248,235,.10)", text: "#fff8ee" },
  olive: { name: "زيتوني", background: "linear-gradient(135deg,#20281b,#65734a)", accent: "#e4d79b", card: "rgba(255,255,255,.10)", text: "#fbfff4" },
  sunset: { name: "غروب", background: "linear-gradient(135deg,#4b1e3f,#d56a3b 55%,#f3b45b)", accent: "#fff0c2", card: "rgba(255,255,255,.12)", text: "#fff" },
  minimal: { name: "مينيمال", background: "linear-gradient(135deg,#fafafa,#ececec)", accent: "#555", card: "#fff", text: "#222" }
};

const BACKGROUNDS = {
  plain: "linear-gradient(135deg,#fffaf4,#f2e9dc)",
  dark: "linear-gradient(135deg,#14110f,#33251b)",
  dots: "radial-gradient(circle at 12px 12px,rgba(126,86,45,.22) 2px,transparent 2.5px),linear-gradient(135deg,#fffaf4,#f0e5d6)",
  lines: "repeating-linear-gradient(135deg,rgba(154,107,67,.10) 0,rgba(154,107,67,.10) 2px,transparent 2px,transparent 13px),linear-gradient(135deg,#fff,#f5eee6)",
  leaves: "radial-gradient(ellipse at 15% 20%,rgba(79,123,89,.22) 0 7%,transparent 8%),radial-gradient(ellipse at 88% 70%,rgba(79,123,89,.18) 0 8%,transparent 9%),linear-gradient(135deg,#f3f8f0,#fff)",
  gold: "radial-gradient(circle at 20% 20%,rgba(215,173,99,.30),transparent 20%),radial-gradient(circle at 80% 80%,rgba(215,173,99,.22),transparent 24%),linear-gradient(135deg,#1a1510,#4a3420)",
  waves: "repeating-radial-gradient(ellipse at 0% 100%,rgba(70,150,160,.16) 0 8px,transparent 9px 22px),linear-gradient(135deg,#eefbfb,#d8eeee)",
  marble: "radial-gradient(circle at 30% 20%,rgba(0,0,0,.06),transparent 25%),repeating-linear-gradient(120deg,transparent 0 35px,rgba(0,0,0,.045) 36px,transparent 38px),linear-gradient(135deg,#fafafa,#e9e9e9)",
  rose: "radial-gradient(circle at 15% 85%,rgba(190,75,115,.16) 0 12%,transparent 13%),radial-gradient(circle at 85% 15%,rgba(190,75,115,.12) 0 10%,transparent 11%),linear-gradient(135deg,#fff6f8,#f6dfe7)",
  geometric: "linear-gradient(45deg,rgba(110,80,170,.12) 25%,transparent 25%,transparent 75%,rgba(110,80,170,.12) 75%),linear-gradient(45deg,rgba(110,80,170,.08) 25%,transparent 25%,transparent 75%,rgba(110,80,170,.08) 75%),linear-gradient(135deg,#faf8ff,#eee9fa)",
  coffee: "radial-gradient(circle at 20% 30%,rgba(240,195,138,.20) 0 8%,transparent 9%),radial-gradient(circle at 80% 75%,rgba(240,195,138,.15) 0 10%,transparent 11%),linear-gradient(135deg,#241711,#68442d)",
  stars: "radial-gradient(circle at 10% 20%,#fff 0 1px,transparent 2px),radial-gradient(circle at 70% 30%,#fff 0 1px,transparent 2px),radial-gradient(circle at 40% 80%,#fff 0 1px,transparent 2px),linear-gradient(135deg,#080c18,#202a48)",
  terracotta: "radial-gradient(circle at 90% 15%,rgba(224,128,85,.22) 0 13%,transparent 14%),radial-gradient(circle at 10% 85%,rgba(224,128,85,.18) 0 15%,transparent 16%),linear-gradient(135deg,#fff5ed,#f2d4c3)"
};


// =========================
// MAIN FETCH
// =========================

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

      if (path === "/health") {
        return json({
          ok: true,
          service: "LAMSA",
          message: "لمسة تعمل بنجاح"
        });
      }

      if (path === "/api/register" && request.method === "POST") {
        return register(request, env);
      }

      if (path === "/api/login" && request.method === "POST") {
        return login(request, env);
      }

      if (path === "/api/admin/login" && request.method === "POST") {
        return adminLogin(request, env);
      }

      if (path === "/api/logout" && request.method === "POST") {
        return logout(request, env);
      }

      if (path === "/api/me" && request.method === "GET") {
        return me(request, env);
      }

      if (path === "/api/admin/restaurants" && request.method === "GET") {
        return adminRestaurants(request, env);
      }

      if (path === "/api/admin/menu/activate" && request.method === "POST") {
        return adminActivateMenu(request, env);
      }

      if (path === "/api/admin/menu/disable" && request.method === "POST") {
        return adminDisableMenu(request, env);
      }

      if (path === "/api/restaurant" && request.method === "GET") {
        return getRestaurant(request, env);
      }

      if (path === "/api/restaurant" && request.method === "PUT") {
        return updateRestaurant(request, env);
      }

      if (path === "/api/categories" && request.method === "GET") {
        return getCategories(request, env);
      }

      if (path === "/api/categories" && request.method === "POST") {
        return createCategory(request, env);
      }

      if (
        path.startsWith("/api/categories/") &&
        request.method === "DELETE"
      ) {
        return deleteCategory(request, env);
      }

      if (path === "/api/items" && request.method === "GET") {
        return getItems(request, env);
      }

      if (path === "/api/items" && request.method === "POST") {
        return createItem(request, env);
      }

      if (
        path.startsWith("/api/items/") &&
        request.method === "PUT"
      ) {
        return updateItem(request, env);
      }

      if (
        path.startsWith("/api/items/") &&
        request.method === "DELETE"
      ) {
        return deleteItem(request, env);
      }

      if (path.startsWith("/menu/")) {
        return publicMenu(request, env);
      }

      if (
        path === "/login" ||
        path === "/register" ||
        path === "/auth"
      ) {
        return html(authPage());
      }

      if (path === "/dashboard") {
        return html(dashboardPage());
      }

      if (path === "/admin/login") {
        return html(adminLoginPage());
      }

      if (path === "/admin") {
        return html(adminPage());
      }

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


// =========================
// DATABASE
// =========================

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
    `),

    env.DB.prepare(`
      CREATE TABLE IF NOT EXISTS restaurants (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL UNIQUE,
        name TEXT NOT NULL DEFAULT '',
        description TEXT NOT NULL DEFAULT '',
        phone TEXT NOT NULL DEFAULT '',
        address TEXT NOT NULL DEFAULT '',
        hours TEXT NOT NULL DEFAULT '',
        business_type TEXT NOT NULL DEFAULT 'restaurant',
        logo TEXT NOT NULL DEFAULT '',
        slug TEXT NOT NULL UNIQUE,
        menu_enabled INTEGER NOT NULL DEFAULT 1,
        menu_expires_at TEXT,
        created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `),

    env.DB.prepare(`
      CREATE TABLE IF NOT EXISTS categories (
        id TEXT PRIMARY KEY,
        restaurant_id TEXT NOT NULL,
        name TEXT NOT NULL,
        sort_order INTEGER NOT NULL DEFAULT 0,
        created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (restaurant_id) REFERENCES restaurants(id) ON DELETE CASCADE
      )
    `),

    env.DB.prepare(`
      CREATE TABLE IF NOT EXISTS items (
        id TEXT PRIMARY KEY,
        restaurant_id TEXT NOT NULL,
        category_id TEXT,
        name TEXT NOT NULL,
        description TEXT NOT NULL DEFAULT '',
        price REAL NOT NULL DEFAULT 0,
        image TEXT NOT NULL DEFAULT '',
        sort_order INTEGER NOT NULL DEFAULT 0,
        created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (restaurant_id) REFERENCES restaurants(id) ON DELETE CASCADE,
        FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL
      )
    `)
  ]);

  await ensureRestaurantColumn(
    env,
    "theme",
    "TEXT NOT NULL DEFAULT 'modern'"
  );

  await ensureRestaurantColumn(
    env,
    "background",
    "TEXT NOT NULL DEFAULT ''"
  );

  await ensureRestaurantColumn(env, "hours", "TEXT NOT NULL DEFAULT ''");
  await ensureRestaurantColumn(env, "business_type", "TEXT NOT NULL DEFAULT 'restaurant'");
  await ensureRestaurantColumn(env, "menu_enabled", "INTEGER NOT NULL DEFAULT 1");
  await ensureRestaurantColumn(env, "menu_expires_at", "TEXT");

  await env.DB.prepare(`
    UPDATE restaurants
    SET menu_expires_at = datetime(created_at, '+30 days')
    WHERE menu_expires_at IS NULL
  `).run();

  await env.DB.prepare(`
    INSERT OR IGNORE INTO users
      (id, name, email, phone, password_hash, role)
    VALUES (?, ?, ?, ?, ?, ?)
  `).bind(
    "lamsa-owner-account",
    OWNER_NAME,
    OWNER_EMAIL,
    OWNER_PHONE,
    OWNER_PASSWORD_HASH,
    "owner"
  ).run();

  await env.DB.prepare(`
    UPDATE users SET role = "customer"
    WHERE role = "admin" AND email <> ?
  `).bind(OWNER_EMAIL).run();
}


async function ensureRestaurantColumn(env, column, definition) {
  const result = await env.DB.prepare(
    "PRAGMA table_info(restaurants)"
  ).all();

  const exists = (result.results || []).some(
    row => row.name === column
  );

  if (!exists) {
    await env.DB.prepare(
      `ALTER TABLE restaurants ADD COLUMN ${column} ${definition}`
    ).run();
  }
}


// =========================
// AUTH
// =========================

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
    .prepare(`
      SELECT COUNT(*) AS total
      FROM users
    `)
    .first();

  const role = "customer";
  const id = crypto.randomUUID();

  const passwordHash =
    await hashPassword(password);

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

  const slug =
    await uniqueSlug(env, name);

  await env.DB.prepare(`
    INSERT INTO restaurants
    (id, user_id, name, slug, theme, background, business_type, menu_enabled, menu_expires_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, 1, datetime('now', '+30 days'))
  `).bind(
    crypto.randomUUID(),
    id,
    name,
    slug,
    "modern",
    "",
    "restaurant"
  ).run();

  const session =
    await createSession(env, id);

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
        "content-type":
          "application/json; charset=UTF-8",
        "set-cookie":
          sessionCookie(session)
      }
    }
  );
}


async function login(request, env) {
  const body = await request.json();

  const identifier =
    clean(body.identifier).toLowerCase();

  const password =
    String(body.password || "");

  if (!identifier || !password) {
    return json({
      ok: false,
      error:
        "أدخل البريد أو رقم الهاتف وكلمة المرور"
    }, 400);
  }

  const user =
    await env.DB.prepare(`
      SELECT *
      FROM users
      WHERE LOWER(email) = ? OR phone = ?
      LIMIT 1
    `).bind(
      identifier,
      identifier
    ).first();

  if (!user) {
    return json({
      ok: false,
      error: "بيانات الدخول غير صحيحة"
    }, 401);
  }

  const valid =
    await verifyPassword(
      password,
      user.password_hash
    );

  if (!valid) {
    return json({
      ok: false,
      error: "بيانات الدخول غير صحيحة"
    }, 401);
  }

  if (user.role === "owner") {
    return json({
      ok: false,
      error: "هذا حساب إدارة. استخدم دخول الإدارة."
    }, 403);
  }

  const session =
    await createSession(
      env,
      user.id
    );

  return new Response(
    JSON.stringify({
      ok: true,
      message: "تم تسجيل الدخول بنجاح"
    }),
    {
      headers: {
        ...corsHeaders(),
        "content-type":
          "application/json; charset=UTF-8",
        "set-cookie":
          sessionCookie(session)
      }
    }
  );
}


async function adminLogin(request, env) {
  const body = await request.json().catch(() => ({}));
  const identifier = clean(body.identifier).toLowerCase();
  const password = String(body.password || "");
  if (!identifier || !password) return json({ ok:false, error:"أدخل بيانات دخول الإدارة" },400);
  const user = await env.DB.prepare(`SELECT * FROM users WHERE LOWER(email) = ? AND role = "owner" LIMIT 1`).bind(identifier).first();
  if (!user || !(await verifyPassword(password, user.password_hash))) return json({ ok:false, error:"بيانات دخول الإدارة غير صحيحة" },401);
  const session = await createSession(env, user.id);
  return new Response(JSON.stringify({ok:true,message:"تم تسجيل دخول الإدارة بنجاح"}),{headers:{...corsHeaders(),"content-type":"application/json; charset=UTF-8","set-cookie":sessionCookie(session)}});
}


async function createSession(env, userId) {
  const id =
    crypto.randomUUID();

  const expires =
    new Date(
      Date.now() +
      SESSION_DAYS * 86400000
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
  return (
    `${COOKIE}=${session.id}; ` +
    `Path=/; HttpOnly; Secure; ` +
    `SameSite=Lax; ` +
    `Max-Age=${SESSION_DAYS * 86400}`
  );
}


function getCookie(request, name) {
  const header =
    request.headers.get("Cookie") || "";

  for (const part of header.split(";")) {
    const [key, ...rest] =
      part.trim().split("=");

    if (key === name) {
      return rest.join("=");
    }
  }

  return null;
}


async function currentUser(request, env) {
  const sessionId =
    getCookie(request, COOKIE);

  if (!sessionId) {
    return null;
  }

  const session =
    await env.DB.prepare(`
      SELECT
        sessions.id,
        sessions.expires_at,
        users.id AS user_id,
        users.name,
        users.email,
        users.phone,
        users.role
      FROM sessions
      JOIN users
        ON users.id = sessions.user_id
      WHERE sessions.id = ?
      LIMIT 1
    `).bind(sessionId).first();

  if (!session) {
    return null;
  }

  if (
    new Date(session.expires_at).getTime() <
    Date.now()
  ) {
    await env.DB.prepare(`
      DELETE FROM sessions
      WHERE id = ?
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


async function me(request, env) {
  const user =
    await currentUser(request, env);

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


async function logout(request, env) {
  const sessionId =
    getCookie(request, COOKIE);

  if (sessionId) {
    await env.DB.prepare(`
      DELETE FROM sessions
      WHERE id = ?
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
        "content-type":
          "application/json; charset=UTF-8",
        "set-cookie":
          `${COOKIE}=; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=0`
      }
    }
  );
}


// =========================
// RESTAURANT
// =========================

async function getRestaurant(request, env) {
  const user =
    await requireUser(request, env);

  if (!user) {
    return unauthorized();
  }

  const restaurant =
    await getRestaurantByUser(
      env,
      user.id
    );

  return json({
    ok: true,
    restaurant
  });
}


async function updateRestaurant(request, env) {
  const user =
    await requireUser(request, env);

  if (!user) {
    return unauthorized();
  }

  const body =
    await request.json();

  const name =
    clean(body.name);

  const description =
    clean(body.description);

  const phone =
    clean(body.phone);

  const address =
    clean(body.address);

  const hours =
    clean(body.hours);

  const businessType =
    ["restaurant", "cafe", "both"].includes(body.business_type)
      ? body.business_type
      : "restaurant";

  const logo =
    clean(body.logo);

  const theme =
    THEMES[body.theme]
      ? body.theme
      : "modern";

  const background =
    clean(body.background);

  if (!name) {
    return json({
      ok: false,
      error: "اسم المطعم أو الكافيه مطلوب"
    }, 400);
  }

  await getRestaurantByUser(
    env,
    user.id
  );

  await env.DB.prepare(`
    UPDATE restaurants
    SET
      name = ?,
      description = ?,
      phone = ?,
      address = ?,
      hours = ?,
      business_type = ?,
      logo = ?,
      theme = ?,
      background = ?
    WHERE user_id = ?
  `).bind(
    name,
    description,
    phone,
    address,
    hours,
    businessType,
    logo,
    theme,
    background,
    user.id
  ).run();

  return json({
    ok: true,
    message: "تم حفظ بيانات المطعم"
  });
}


// =========================
// CATEGORIES
// =========================

async function getCategories(request, env) {
  const user =
    await requireUser(request, env);

  if (!user) {
    return unauthorized();
  }

  const restaurant =
    await getRestaurantByUser(
      env,
      user.id
    );

  const result =
    await env.DB.prepare(`
      SELECT *
      FROM categories
      WHERE restaurant_id = ?
      ORDER BY sort_order ASC, created_at ASC
    `).bind(
      restaurant.id
    ).all();

  return json({
    ok: true,
    categories:
      result.results || []
  });
}


async function createCategory(request, env) {
  const user =
    await requireUser(request, env);

  if (!user) {
    return unauthorized();
  }

  const restaurant =
    await getRestaurantByUser(
      env,
      user.id
    );

  const body =
    await request.json();

  const name =
    clean(body.name);

  if (!name) {
    return json({
      ok: false,
      error: "اسم القسم مطلوب"
    }, 400);
  }

  const count =
    await env.DB.prepare(`
      SELECT COUNT(*) AS total
      FROM categories
      WHERE restaurant_id = ?
    `).bind(
      restaurant.id
    ).first();

  const id =
    crypto.randomUUID();

  await env.DB.prepare(`
    INSERT INTO categories
    (id, restaurant_id, name, sort_order)
    VALUES (?, ?, ?, ?)
  `).bind(
    id,
    restaurant.id,
    name,
    Number(count.total || 0)
  ).run();

  return json({
    ok: true,
    message: "تم إضافة القسم",
    category: {
      id,
      name
    }
  }, 201);
}


async function deleteCategory(request, env) {
  const user =
    await requireUser(request, env);

  if (!user) {
    return unauthorized();
  }

  const restaurant =
    await getRestaurantByUser(
      env,
      user.id
    );

  const id =
    decodeURIComponent(
      request.url.split(
        "/api/categories/"
      )[1]
    );

  const category =
    await env.DB.prepare(`
      SELECT id
      FROM categories
      WHERE id = ?
      AND restaurant_id = ?
      LIMIT 1
    `).bind(
      id,
      restaurant.id
    ).first();

  if (!category) {
    return json({
      ok: false,
      error: "القسم غير موجود"
    }, 404);
  }

  await env.DB.prepare(`
    UPDATE items
    SET category_id = NULL
    WHERE category_id = ?
    AND restaurant_id = ?
  `).bind(
    id,
    restaurant.id
  ).run();

  await env.DB.prepare(`
    DELETE FROM categories
    WHERE id = ?
    AND restaurant_id = ?
  `).bind(
    id,
    restaurant.id
  ).run();

  return json({
    ok: true,
    message: "تم حذف القسم"
  });
}


// =========================
// ITEMS
// =========================

async function getItems(request, env) {
  const user =
    await requireUser(request, env);

  if (!user) {
    return unauthorized();
  }

  const restaurant =
    await getRestaurantByUser(
      env,
      user.id
    );

  const result =
    await env.DB.prepare(`
      SELECT
        items.*,
        categories.name AS category_name
      FROM items
      LEFT JOIN categories
        ON categories.id = items.category_id
      WHERE items.restaurant_id = ?
      ORDER BY items.sort_order ASC, items.created_at ASC
    `).bind(
      restaurant.id
    ).all();

  return json({
    ok: true,
    items:
      result.results || []
  });
}


async function createItem(request, env) {
  const user =
    await requireUser(request, env);

  if (!user) {
    return unauthorized();
  }

  const restaurant =
    await getRestaurantByUser(
      env,
      user.id
    );

  const body =
    await request.json();

  const name =
    clean(body.name);

  const description =
    clean(body.description);

  const price =
    Number(body.price || 0);

  const image =
    clean(body.image);

  const categoryId =
    clean(body.category_id);

  if (!name) {
    return json({
      ok: false,
      error: "اسم الصنف مطلوب"
    }, 400);
  }

  if (
    !Number.isFinite(price) ||
    price < 0
  ) {
    return json({
      ok: false,
      error: "السعر غير صحيح"
    }, 400);
  }

  if (categoryId) {
    const category =
      await env.DB.prepare(`
        SELECT id
        FROM categories
        WHERE id = ?
        AND restaurant_id = ?
        LIMIT 1
      `).bind(
        categoryId,
        restaurant.id
      ).first();

    if (!category) {
      return json({
        ok: false,
        error: "القسم غير صحيح"
      }, 400);
    }
  }

  const count =
    await env.DB.prepare(`
      SELECT COUNT(*) AS total
      FROM items
      WHERE restaurant_id = ?
    `).bind(
      restaurant.id
    ).first();

  const id =
    crypto.randomUUID();

  await env.DB.prepare(`
    INSERT INTO items
    (
      id,
      restaurant_id,
      category_id,
      name,
      description,
      price,
      image,
      sort_order
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `).bind(
    id,
    restaurant.id,
    categoryId || null,
    name,
    description,
    price,
    image,
    Number(count.total || 0)
  ).run();

  return json({
    ok: true,
    message: "تم إضافة الصنف",
    item: {
      id,
      name,
      description,
      price,
      image,
      category_id:
        categoryId || null
    }
  }, 201);
}


async function updateItem(request, env) {
  const user =
    await requireUser(request, env);

  if (!user) {
    return unauthorized();
  }

  const restaurant =
    await getRestaurantByUser(
      env,
      user.id
    );

  const id =
    decodeURIComponent(
      request.url.split(
        "/api/items/"
      )[1]
    );

  const body =
    await request.json();

  const name =
    clean(body.name);

  const description =
    clean(body.description);

  const price =
    Number(body.price || 0);

  const image =
    clean(body.image);

  const categoryId =
    clean(body.category_id);

  if (!name) {
    return json({
      ok: false,
      error: "اسم الصنف مطلوب"
    }, 400);
  }

  if (
    !Number.isFinite(price) ||
    price < 0
  ) {
    return json({
      ok: false,
      error: "السعر غير صحيح"
    }, 400);
  }

  const item =
    await env.DB.prepare(`
      SELECT id
      FROM items
      WHERE id = ?
      AND restaurant_id = ?
      LIMIT 1
    `).bind(
      id,
      restaurant.id
    ).first();

  if (!item) {
    return json({
      ok: false,
      error: "الصنف غير موجود"
    }, 404);
  }

  if (categoryId) {
    const category =
      await env.DB.prepare(`
        SELECT id
        FROM categories
        WHERE id = ?
        AND restaurant_id = ?
        LIMIT 1
      `).bind(
        categoryId,
        restaurant.id
      ).first();

    if (!category) {
      return json({
        ok: false,
        error: "القسم غير صحيح"
      }, 400);
    }
  }

  await env.DB.prepare(`
    UPDATE items
    SET
      category_id = ?,
      name = ?,
      description = ?,
      price = ?,
      image = ?
    WHERE id = ?
    AND restaurant_id = ?
  `).bind(
    categoryId || null,
    name,
    description,
    price,
    image,
    id,
    restaurant.id
  ).run();

  return json({
    ok: true,
    message: "تم تعديل الصنف"
  });
}


async function deleteItem(request, env) {
  const user =
    await requireUser(request, env);

  if (!user) {
    return unauthorized();
  }

  const restaurant =
    await getRestaurantByUser(
      env,
      user.id
    );

  const id =
    decodeURIComponent(
      request.url.split(
        "/api/items/"
      )[1]
    );

  await env.DB.prepare(`
    DELETE FROM items
    WHERE id = ?
    AND restaurant_id = ?
  `).bind(
    id,
    restaurant.id
  ).run();

  return json({
    ok: true,
    message: "تم حذف الصنف"
  });
}


// =========================
// ADMIN MENU CONTROL
// =========================

async function requireAdmin(request, env) {
  const user = await currentUser(request, env);
  if (!user || user.role !== "owner") return null;
  return user;
}

async function adminRestaurants(request, env) {
  const user = await requireAdmin(request, env);
  if (!user) return json({ ok: false, error: "غير مصرح" }, 403);
  const result = await env.DB.prepare(`
    SELECT
      restaurants.id,
      restaurants.user_id,
      restaurants.name,
      restaurants.slug,
      restaurants.business_type,
      restaurants.menu_enabled,
      restaurants.menu_expires_at,
      restaurants.created_at,
      users.name AS customer_name,
      users.email AS customer_email,
      users.phone AS customer_phone,
      users.created_at AS customer_created_at
    FROM restaurants
    JOIN users ON users.id = restaurants.user_id
    ORDER BY users.created_at DESC
  `).all();
  return json({ ok: true, restaurants: result.results || [] });
}

async function adminActivateMenu(request, env) {
  const user = await requireAdmin(request, env);
  if (!user) return json({ ok: false, error: "غير مصرح" }, 403);
  const body = await request.json().catch(() => ({}));
  const restaurantId = clean(body.restaurant_id);
  const days = Math.min(3650, Math.max(1, Math.floor(Number(body.days || 30))));
  if (!restaurantId) return json({ ok: false, error: "restaurant_id مطلوب" }, 400);
  const result = await env.DB.prepare(`
    UPDATE restaurants
    SET
      menu_enabled = 1,
      menu_expires_at = CASE
        WHEN menu_expires_at IS NOT NULL AND menu_expires_at > datetime('now')
          THEN datetime(menu_expires_at, '+' || ? || ' days')
        ELSE datetime('now', '+' || ? || ' days')
      END
    WHERE id = ?
  `).bind(days, days, restaurantId).run();
  if (!result.meta || result.meta.changes !== 1) return json({ ok: false, error: "المطعم غير موجود" }, 404);
  return json({ ok: true, message: "تم تشغيل المنيو", days });
}

async function adminDisableMenu(request, env) {
  const user = await requireAdmin(request, env);
  if (!user) return json({ ok: false, error: "غير مصرح" }, 403);
  const body = await request.json().catch(() => ({}));
  const restaurantId = clean(body.restaurant_id);
  if (!restaurantId) return json({ ok: false, error: "restaurant_id مطلوب" }, 400);
  const result = await env.DB.prepare(`UPDATE restaurants SET menu_enabled = 0 WHERE id = ?`).bind(restaurantId).run();
  if (!result.meta || result.meta.changes !== 1) return json({ ok: false, error: "المطعم غير موجود" }, 404);
  return json({ ok: true, message: "تم إيقاف المنيو" });
}


// =========================
// PUBLIC MENU
// =========================

async function publicMenu(request, env) {
  const slug =
    decodeURIComponent(
      new URL(request.url)
        .pathname
        .replace("/menu/", "")
    );

  if (!slug) {
    return html(
      errorMenuPage("المنيو غير موجود"),
      404
    );
  }

  const restaurant =
    await env.DB.prepare(`
      SELECT *
      FROM restaurants
      WHERE slug = ?
      LIMIT 1
    `).bind(slug).first();

  if (!restaurant) {
    return html(
      errorMenuPage("المنيو غير موجود"),
      404
    );
  }

  const expired =
    Number(restaurant.menu_enabled) !== 1 ||
    (restaurant.menu_expires_at &&
      new Date(String(restaurant.menu_expires_at).replace(' ', 'T') + 'Z').getTime() <= Date.now());

  if (expired) {
    return html(
      errorMenuPage("خطأ — فترة صيانة", "نعتذر عن الانتظار، المنيو غير متاحة حاليًا. يرجى المحاولة مرة أخرى لاحقًا."),
      403
    );
  }

  const categories =
    await env.DB.prepare(`
      SELECT *
      FROM categories
      WHERE restaurant_id = ?
      ORDER BY sort_order ASC, created_at ASC
    `).bind(
      restaurant.id
    ).all();

  const items =
    await env.DB.prepare(`
      SELECT *
      FROM items
      WHERE restaurant_id = ?
      ORDER BY sort_order ASC, created_at ASC
    `).bind(
      restaurant.id
    ).all();

  return html(
    publicMenuPage(
      restaurant,
      categories.results || [],
      items.results || []
    )
  );
}


// =========================
// RESTAURANT HELPERS
// =========================

async function requireUser(request, env) {
  return currentUser(request, env);
}


async function getRestaurantByUser(env, userId) {
  let restaurant =
    await env.DB.prepare(`
      SELECT *
      FROM restaurants
      WHERE user_id = ?
      LIMIT 1
    `).bind(userId).first();

  if (!restaurant) {
    const user =
      await env.DB.prepare(`
        SELECT name
        FROM users
        WHERE id = ?
        LIMIT 1
      `).bind(userId).first();

    const slug =
      await uniqueSlug(
        env,
        user?.name || "restaurant"
      );

    const id =
      crypto.randomUUID();

    await env.DB.prepare(`
      INSERT INTO restaurants
      (id, user_id, name, slug, theme, background, business_type, menu_enabled, menu_expires_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, 1, datetime('now', '+30 days'))
    `).bind(
      id,
      userId,
      user?.name || "",
      slug,
      "modern",
      "",
      "restaurant"
    ).run();

    restaurant =
      await env.DB.prepare(`
        SELECT *
        FROM restaurants
        WHERE id = ?
        LIMIT 1
      `).bind(id).first();
  }

  return restaurant;
}


async function uniqueSlug(env, name) {
  let base =
    String(name || "restaurant")
      .toLowerCase()
      .trim()
      .replace(
        /[^a-z0-9\u0600-\u06ff]+/g,
        "-"
      )
      .replace(
        /^-+|-+$/g,
        ""
      );

  if (!base) {
    base = "restaurant";
  }

  let slug = base;
  let number = 1;

  while (true) {
    const exists =
      await env.DB.prepare(`
        SELECT id
        FROM restaurants
        WHERE slug = ?
        LIMIT 1
      `).bind(slug).first();

    if (!exists) {
      return slug;
    }

    number++;

    slug =
      `${base}-${number}`;
  }
}


// =========================
// GENERAL HELPERS
// =========================

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
// PASSWORD
// =========================

async function hashPassword(password) {
  const salt =
    crypto.getRandomValues(
      new Uint8Array(16)
    );

  const key =
    await crypto.subtle.importKey(
      "raw",
      new TextEncoder().encode(password),
      "PBKDF2",
      false,
      ["deriveBits"]
    );

  const bits =
    await crypto.subtle.deriveBits(
      {
        name: "PBKDF2",
        salt,
        iterations: 100000,
        hash: "SHA-256"
      },
      key,
      256
    );

  return (
    `pbkdf2$100000$` +
    `${bytesToBase64(salt)}$` +
    `${bytesToBase64(
      new Uint8Array(bits)
    )}`
  );
}


async function verifyPassword(password, stored) {
  try {
    const parts =
      stored.split("$");

    if (parts.length !== 4) {
      return false;
    }

    const iterations =
      Number(parts[1]);

    const salt =
      base64ToBytes(parts[2]);

    const expected =
      base64ToBytes(parts[3]);

    const key =
      await crypto.subtle.importKey(
        "raw",
        new TextEncoder().encode(password),
        "PBKDF2",
        false,
        ["deriveBits"]
      );

    const bits =
      await crypto.subtle.deriveBits(
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
  if (a.length !== b.length) {
    return false;
  }

  let result = 0;

  for (
    let i = 0;
    i < a.length;
    i++
  ) {
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
  const binary =
    atob(value);

  const bytes =
    new Uint8Array(binary.length);

  for (
    let i = 0;
    i < binary.length;
    i++
  ) {
    bytes[i] =
      binary.charCodeAt(i);
  }

  return bytes;
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
<title>LAMSA | منصتك الرقمية</title>

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
أنشئ موقع مطعمك أو كافيهك ومنيوك الرقمية بسهولة،
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

<footer class="footer" style="text-align:center;padding:28px 20px 22px;margin-top:30px;border-top:1px solid #e7dfd5;color:#777;line-height:1.8;">
  <div style="font-size:14px;font-weight:900;letter-spacing:1px;color:#211d19;margin-bottom:5px;">LAMSA</div>
  <div style="font-size:13px;">الحقوق محفوظة بواسطة M/mohamed abdalaziem</div>
</footer>

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

</style>

</head>

<body>

<div class="card">

<div class="brand">

<div class="mark">
ل
</div>

<div class="logo">
LAMSA
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
// ADMIN LOGIN
// =========================

function adminLoginPage() {
  return `
<!DOCTYPE html><html lang="ar" dir="rtl"><head>
<meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>دخول الإدارة | LAMSA</title>
<style>
*{box-sizing:border-box}body{margin:0;min-height:100vh;font-family:Arial,sans-serif;background:linear-gradient(135deg,#17120d,#302217 55%,#111);display:flex;align-items:center;justify-content:center;color:#fff;padding:20px}.box{width:min(440px,100%);background:rgba(255,255,255,.08);backdrop-filter:blur(12px);border:1px solid rgba(255,255,255,.15);border-radius:24px;padding:30px;box-shadow:0 20px 60px rgba(0,0,0,.35)}.brand{text-align:center;font-size:32px;font-weight:900;letter-spacing:3px;direction:ltr;margin-bottom:8px}.sub{text-align:center;color:#ddd;margin-bottom:25px}label{display:block;margin:12px 0 7px;font-weight:bold}input{width:100%;padding:14px;border-radius:12px;border:1px solid #665544;background:#fff;color:#222;font-family:inherit;font-size:16px}button{width:100%;margin-top:18px;padding:14px;border:0;border-radius:12px;background:#d7ad63;color:#21170e;font-weight:900;font-family:inherit;font-size:16px;cursor:pointer}.msg{display:none;margin-top:15px;padding:12px;border-radius:10px;background:#6b2525;color:#fff}.back{display:block;text-align:center;margin-top:18px;color:#ddd;text-decoration:none;font-size:14px}
</style></head><body><div class="box"><div class="brand">LAMSA</div><div class="sub">دخول إدارة المنصة</div><form id="form"><label>البريد الإداري</label><input id="identifier" type="email" autocomplete="username" required><label>كلمة مرور الإدارة</label><input id="password" type="password" autocomplete="current-password" required><button type="submit">دخول الإدارة</button></form><div id="msg" class="msg"></div><a class="back" href="/login">العودة لدخول العملاء</a></div><script>
const form=document.getElementById('form'),msg=document.getElementById('msg');form.addEventListener('submit',async e=>{e.preventDefault();msg.style.display='none';try{const r=await fetch('/api/admin/login',{method:'POST',headers:{'Content-Type':'application/json'},credentials:'same-origin',body:JSON.stringify({identifier:document.getElementById('identifier').value,password:document.getElementById('password').value})});const d=await r.json();if(!r.ok||!d.ok)throw new Error(d.error||'تعذر تسجيل الدخول');location.href='/admin'}catch(err){msg.textContent=err.message;msg.style.display='block'}});</script></body></html>`;
}


// =========================
// ADMIN DASHBOARD
// =========================

function adminPage() {
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

<title>لوحة التحكم | LAMSA</title>

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

.admin-btn{
  border:0;
  border-radius:11px;
  padding:11px 16px;
  cursor:pointer;
  font-family:inherit;
  font-weight:bold;
  background:#d9b06a;
  color:#211d19;
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


.trial-card{
  background:#fff;
  border:1px solid #e8e3dc;
  border-radius:20px;
  padding:20px;
  margin-bottom:16px;
  box-shadow:0 7px 25px rgba(0,0,0,.025);
}
.trial-head{display:flex;align-items:center;justify-content:space-between;gap:12px}
.trial-title{font-size:19px;font-weight:900}.trial-sub{font-size:13px;color:#888;margin-top:5px}
.trial-badge{padding:8px 12px;border-radius:999px;font-size:12px;font-weight:900;background:#f1eee9;color:#665}
.trial-badge.active{background:#e3f3e3;color:#2f7132}.trial-badge.expired{background:#fde7e7;color:#a52e2e}.trial-badge.disabled{background:#eee;color:#555}
.trial-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:12px;margin-top:15px}
.trial-grid>div{background:#faf8f5;border-radius:12px;padding:12px}.trial-grid small{display:block;color:#888;margin-bottom:5px}.trial-grid strong{font-size:14px}
@media(max-width:650px){.trial-head{align-items:flex-start;flex-direction:column}.trial-grid{grid-template-columns:1fr}}

.business-type-title{
  margin:8px 0 10px;
  font-weight:900;
  color:#4a4037;
}

.business-types{
  display:grid;
  grid-template-columns:repeat(3,1fr);
  gap:12px;
  margin-bottom:20px;
}

.business-type{
  border:2px solid #eee7df;
  background:#fff;
  border-radius:18px;
  padding:16px 10px;
  cursor:pointer;
  font-family:inherit;
  color:#2a241f;
  transition:.2s;
  display:flex;
  flex-direction:column;
  align-items:center;
  gap:5px;
}

.business-type:hover{
  transform:translateY(-2px);
  border-color:#c69b64;
}

.business-type.selected{
  border-color:#b2834c;
  background:linear-gradient(135deg,#fffaf3,#f4e6d4);
  box-shadow:0 8px 25px rgba(178,131,76,.15);
}

.business-icon{font-size:30px;line-height:1.2;}
.business-type b{font-size:16px;}
.business-type small{font-size:11px;color:#888;}

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
  display:grid;
  grid-template-columns:repeat(6,1fr);
  gap:10px;
}

.qr-box{
  width:220px;
  min-height:220px;
  margin:16px auto;
  padding:10px;
  border-radius:18px;
  background:#fff;
  display:flex;
  align-items:center;
  justify-content:center;
  box-shadow:0 12px 35px rgba(0,0,0,.08);
}

.qr-box img{
  width:200px;
  height:200px;
  display:block;
}

.qr-card{text-align:center;}

.bg-option{
  width:100%;
  aspect-ratio:1;
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

  .backgrounds{
    grid-template-columns:repeat(4,1fr);
  }

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

  .business-types{
    grid-template-columns:1fr;
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

  .backgrounds{
    grid-template-columns:repeat(3,1fr);
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
ل
</div>

<div class="logo-text">
LAMSA
</div>

</div>

<div class="header-actions">

<button
class="preview-btn"
onclick="openMenu()">
👀 معاينة المنيو
</button>

<button
class="admin-btn"
id="adminLink"
style="display:none"
onclick="location.href='/admin'">
⚙️ إدارة المنيوهات
</button>

<button
class="logout"
onclick="logout()">
تسجيل الخروج
</button>

</div>

</header>

<main>

<section class="welcome">

<h1 id="welcome">
أهلاً بك 👋
</h1>

<p>
من هنا تقدر تدير مطعمك أو كافيهك ومنيوك وتختار شكل الموقع بنفسك.
</p>

</section>

<section class="trial-card" id="trialCard">
  <div class="trial-head">
    <div>
      <div class="trial-title">🕒 فترة تشغيل المنيو</div>
      <div class="trial-sub">30 يوم مجانية لكل حساب جديد</div>
    </div>
    <span class="trial-badge" id="trialBadge">جاري التحميل...</span>
  </div>
  <div class="trial-grid">
    <div><small>بداية الفترة</small><strong id="trialStart">—</strong></div>
    <div><small>تاريخ الانتهاء</small><strong id="trialEnd">—</strong></div>
  </div>
</section>

<div class="grid">

<section class="card">

<h2>
🏪 نوع النشاط وبياناته
</h2>

<div class="business-type-title">اختار نوع المكان</div>
<div class="business-types" id="businessTypes">
  <button type="button" class="business-type" data-type="restaurant" onclick="selectBusinessType('restaurant')">
    <span class="business-icon">🍽️</span>
    <b>مطعم</b>
    <small>مطعم فقط</small>
  </button>
  <button type="button" class="business-type" data-type="cafe" onclick="selectBusinessType('cafe')">
    <span class="business-icon">☕</span>
    <b>كافيه</b>
    <small>كافيه فقط</small>
  </button>
  <button type="button" class="business-type" data-type="both" onclick="selectBusinessType('both')">
    <span class="business-icon">🍽️☕</span>
    <b>مطعم وكافيه</b>
    <small>الاثنين معًا</small>
  </button>
</div>

<label>اسم المطعم / الكافيه</label>

<input id="restaurantName">

<label>الوصف</label>

<textarea id="restaurantDescription"></textarea>

<label>رقم الهاتف</label>

<input id="restaurantPhone">

<label>العنوان</label>

<input id="restaurantAddress">

<label>🕒 مواعيد العمل</label>

<input id="restaurantHours" placeholder="مثال: يومياً من 10 صباحاً إلى 12 منتصف الليل">

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


<section class="card qr-card">

<h2>📱 باركود المنيو</h2>

<p class="small">امسح الباركود بالكاميرا لفتح المنيو مباشرة.</p>

<div id="qrBox" class="qr-box">
  <span>جاري إنشاء الباركود...</span>
</div>

<button class="menu-open" type="button" onclick="downloadQr()">حفظ الباركود</button>

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
اختار خلفية من الخلفيات المزخرفة أو الهادئة.
</p>

<div class="backgrounds">
${Object.entries(BACKGROUNDS).map(([key,value]) => `
<div class="bg-option" data-bg="${key}" style="background:${value}" onclick="selectBackground('${key}')" title="${key}"></div>
`).join("")}
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

<footer class="footer" style="text-align:center;padding:28px 20px 22px;margin-top:30px;border-top:1px solid #e7dfd5;color:#777;line-height:1.8;">
  <div style="font-size:14px;font-weight:900;letter-spacing:1px;color:#211d19;margin-bottom:5px;">LAMSA</div>
  <div style="font-size:13px;">الحقوق محفوظة بواسطة M/mohamed abdalaziem</div>
</footer>

<script>

let restaurant = null;
let categories = [];
let items = [];

let selectedTheme = "modern";
let selectedBackground = "";
let selectedBusinessType = "restaurant";


function renderTrialStatus(r){
  const badge=document.getElementById("trialBadge");
  const start=document.getElementById("trialStart");
  const end=document.getElementById("trialEnd");
  if(!badge||!start||!end)return;
  const fmtDate=v=>{if(!v)return "غير محدد";const d=new Date(String(v).replace(" ","T")+"Z");return Number.isNaN(d.getTime())?v:d.toLocaleDateString("ar-EG",{dateStyle:"medium"})};
  start.textContent=fmtDate(r.created_at);
  end.textContent=fmtDate(r.menu_expires_at);
  const expired=Number(r.menu_enabled)!==1 || (r.menu_expires_at && new Date(String(r.menu_expires_at).replace(" ","T")+"Z").getTime()<=Date.now());
  if(Number(r.menu_enabled)!==1){badge.textContent="متوقفة";badge.className="trial-badge disabled";}
  else if(expired){badge.textContent="انتهت الفترة";badge.className="trial-badge expired";}
  else {badge.textContent="نشطة";badge.className="trial-badge active";}
}

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

    if (me.user.role === "owner") {
      const adminLink = document.getElementById("adminLink");
      if (adminLink) adminLink.style.display = "inline-block";
    }


    const restaurantData =
      await api("/api/restaurant");

    restaurant =
      restaurantData.restaurant;

    renderTrialStatus(restaurant);


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
      "restaurantHours"
    ).value =
      restaurant.hours || "";


    document.getElementById(
      "restaurantLogo"
    ).value =
      restaurant.logo || "";


    selectedTheme =
      restaurant.theme || "modern";


    selectedBackground =
      restaurant.background || "";

    selectedBusinessType =
      restaurant.business_type || "restaurant";

    updateBusinessTypeUI();
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

    updateQr(link);


    await loadCategories();
    await loadItems();

  }catch(error){

    location.href="/login";

  }

}


function updateQr(link){
  const box = document.getElementById("qrBox");
  if(!box || !link) return;
  const qrUrl = "https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=" + encodeURIComponent(link);
  box.innerHTML = '<img id="qrImage" src="' + qrUrl + '" alt="QR Code للمنيو" crossorigin="anonymous">';
}

function downloadQr(){
  const img = document.getElementById("qrImage");
  if(!img) return;
  const link = document.createElement("a");
  link.href = img.src;
  link.target = "_blank";
  link.rel = "noopener";
  link.click();
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


function selectBusinessType(type){
  selectedBusinessType = ["restaurant","cafe","both"].includes(type) ? type : "restaurant";
  updateBusinessTypeUI();
}

function updateBusinessTypeUI(){
  document.querySelectorAll(".business-type").forEach(btn => {
    btn.classList.toggle("selected", btn.dataset.type === selectedBusinessType);
  });
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
      "تم حفظ بيانات المكان ✓";

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

        hours:
          document.getElementById(
            "restaurantHours"
          ).value,

        logo:
          document.getElementById(
            "restaurantLogo"
          ).value,

        theme:
          selectedTheme,

        background:
          selectedBackground,

        business_type:
          selectedBusinessType

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

  const businessType = restaurant.business_type || "restaurant";
  const businessTypeLabel =
    businessType === "cafe" ? "كافيه" :
    businessType === "both" ? "مطعم وكافيه" :
    "مطعم";

  let background =
    theme.background;

  const customBackground =
    restaurant.background || "";

  const customBackgrounds = BACKGROUNDS;


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
${escapeHtml(restaurant.name)} | LAMSA
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

.business-badge{
  display:inline-flex;
  align-items:center;
  gap:6px;
  margin:0 auto 10px;
  padding:7px 13px;
  border-radius:999px;
  background:rgba(255,255,255,.12);
  border:1px solid rgba(255,255,255,.12);
  color:${theme.accent};
  font-size:13px;
  font-weight:900;
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

.site-nav{
  max-width:900px;
  margin:24px auto 0;
  display:flex;
  justify-content:center;
  gap:10px;
  flex-wrap:wrap;
}

.site-nav a,.contact-actions a,.contact-actions span{
  color:inherit;
  text-decoration:none;
  padding:9px 13px;
  border-radius:999px;
  background:rgba(255,255,255,.12);
  border:1px solid rgba(255,255,255,.10);
  font-size:13px;
}

.site-info{
  max-width:900px;
  margin:10px auto 0;
  padding:26px 15px 10px;
  display:grid;
  grid-template-columns:1fr 1fr;
  gap:16px;
}

.site-info > div{
  background:${theme.card};
  color:${theme.text};
  border-radius:20px;
  padding:20px;
  box-shadow:0 10px 35px rgba(0,0,0,.08);
}

.site-info h2{margin:0 0 10px;color:${theme.accent};font-size:20px;}
.site-info p{margin:0;line-height:1.9;opacity:.75;}
.contact-actions{display:flex;flex-wrap:wrap;gap:8px;}

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

  .site-info{
    grid-template-columns:1fr;
  }

}

</style>

</head>

<body>

<div class="page">

<header class="hero">

${logoHtml}

<div class="business-badge">${businessType === "cafe" ? "☕" : businessType === "both" ? "🍽️ ☕" : "🍽️"} ${businessTypeLabel}</div>

<h1>
${escapeHtml(restaurant.name)}
</h1>

${restaurantDescription}

<div class="powered">
LAMSA
</div>

<nav class="site-nav">
  <a href="#menu">المنيو</a>
  <a href="#about">عن المكان</a>
  <a href="#contact">التواصل</a>
</nav>

</header>

<main class="menu" id="menu">

${sections}

</main>

<section class="site-info" id="about">
  ${restaurant.description ? `<div><h2>عن المكان</h2><p>${escapeHtml(restaurant.description)}</p></div>` : ""}
  <div id="contact">
    <h2>تواصل معنا</h2>
    <div class="contact-actions">
      ${restaurant.phone ? `<a href="tel:${escapeHtml(restaurant.phone)}">📞 اتصال</a>` : ""}
      ${restaurant.phone ? `<a href="https://wa.me/${escapeHtml(String(restaurant.phone).replace(/[^0-9]/g,""))}" target="_blank" rel="noopener">💬 واتساب</a>` : ""}
      ${restaurant.address ? `<span>📍 ${escapeHtml(restaurant.address)}</span>` : ""}
      ${restaurant.hours ? `<span>🕒 ${escapeHtml(restaurant.hours)}</span>` : ""}
    </div>
  </div>
</section>

<footer class="footer">
  <div style="font-size:14px;font-weight:800;letter-spacing:.5px;margin-bottom:8px;">LAMSA</div>
  <div>الحقوق محفوظة بواسطة M/mohamed abdalaziem</div>
</footer>

</div>

</body>

</html>
`;
}


// =========================
// ERROR MENU
// =========================

function errorMenuPage(title, message) {
  return `
<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>LAMSA</title>
<style>
body{margin:0;min-height:100vh;display:flex;flex-direction:column;align-items:center;justify-content:center;font-family:Arial,sans-serif;background:#f5f1eb;color:#222;text-align:center;padding:20px;box-sizing:border-box}
.box{max-width:560px;padding:38px 26px;background:rgba(255,255,255,.86);border:1px solid #e7dfd5;border-radius:24px;box-shadow:0 15px 45px rgba(0,0,0,.07)}
.logo{width:70px;height:70px;border-radius:22px;background:#211d19;color:#d9b06a;display:flex;align-items:center;justify-content:center;margin:0 auto 20px;font-size:34px;font-weight:900}
h1{margin:0 0 14px;font-size:27px}p{margin:0;color:#777;line-height:1.9;font-size:16px}.footer{margin-top:22px;color:#777;font-size:13px;line-height:1.8}.footer strong{display:block;color:#211d19;font-size:16px;letter-spacing:1px;direction:ltr}
</style>
</head>
<body>
<div class="box"><div class="logo">ل</div><h1>${escapeHtml(title)}</h1><p>${escapeHtml(message)}</p></div>
<div class="footer"><strong>LAMSA</strong>الحقوق محفوظة بواسطة M/mohamed abdalaziem</div>
</body>
</html>`;
}
