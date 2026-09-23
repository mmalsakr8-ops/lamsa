// LAMSA - Database & API
import { publicMenuPage, errorMenuPage } from "./pages/menu.js";

const COOKIE = "lamsa_session";
const SESSION_DAYS = 30;


const THEMES = {
  luxury: {
    name: "فاخر أسود وذهبي",
    background: "linear-gradient(135deg,#17120d,#302217 45%,#111)",
    accent: "#d7ad63",
    card: "#211b15",
    text: "#fffaf0"
  },

  cafe: {
    name: "كافيه مودرن",
    background: "linear-gradient(135deg,#f6efe5,#fffaf4)",
    accent: "#9b6b43",
    card: "#ffffff",
    text: "#2d241e"
  },

  fresh: {
    name: "أخضر طبيعي",
    background: "linear-gradient(135deg,#edf5ed,#f8fbf6)",
    accent: "#4f7b59",
    card: "#ffffff",
    text: "#203226"
  },

  modern: {
    name: "مودرن",
    background: "linear-gradient(135deg,#f2f2f2,#ffffff)",
    accent: "#222222",
    card: "#ffffff",
    text: "#171717"
  },

  dark: {
    name: "دارك",
    background: "linear-gradient(135deg,#080808,#1c1c1c)",
    accent: "#ffffff",
    card: "#151515",
    text: "#ffffff"
  }
};



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
        logo TEXT NOT NULL DEFAULT '',
        slug TEXT NOT NULL UNIQUE,
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

  const role =
    Number(count.total) === 0
      ? "admin"
      : "customer";

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
    (id, user_id, name, slug, theme, background)
    VALUES (?, ?, ?, ?, ?, ?)
  `).bind(
    crypto.randomUUID(),
    id,
    name,
    slug,
    "modern",
    ""
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
      error: "اسم المطعم مطلوب"
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
      logo = ?,
      theme = ?,
      background = ?
    WHERE user_id = ?
  `).bind(
    name,
    description,
    phone,
    address,
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
      (id, user_id, name, slug, theme, background)
      VALUES (?, ?, ?, ?, ?, ?)
    `).bind(
      id,
      userId,
      user?.name || "",
      slug,
      "modern",
      ""
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

export {
  initDB,
  ensureRestaurantColumn,
  register,
  login,
  createSession,
  sessionCookie,
  getCookie,
  currentUser,
  me,
  logout,
  getRestaurant,
  updateRestaurant,
  getCategories,
  createCategory,
  deleteCategory,
  getItems,
  createItem,
  updateItem,
  deleteItem,
  publicMenu,
  requireUser,
  getRestaurantByUser,
  uniqueSlug,
  unauthorized,
  clean,
  isEmail,
  escapeHtml,
  json,
  html,
  corsHeaders,
  hashPassword,
  verifyPassword,
  timingSafeEqual,
  bytesToBase64,
  base64ToBytes
};
