const COOKIE = "lamsa_session";
const SESSION_DAYS = 30;

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

      if (path === "/api/logout" && request.method === "POST") {
        return logout(request, env);
      }

      if (path === "/api/me" && request.method === "GET") {
        return me(request, env);
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
    .prepare(`SELECT COUNT(*) AS total FROM users`)
    .first();

  const role =
    Number(count.total) === 0
      ? "admin"
      : "customer";

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

  const slug = await uniqueSlug(env, name);

  await env.DB.prepare(`
    INSERT INTO restaurants
    (id, user_id, name, slug)
    VALUES (?, ?, ?, ?)
  `).bind(
    crypto.randomUUID(),
    id,
    name,
    slug
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

  const user = await env.DB.prepare(`
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
      message:
        "تم تسجيل الدخول بنجاح"
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
    await currentUser(
      request,
      env
    );

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
      message:
        "تم تسجيل الخروج"
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
    await requireUser(
      request,
      env
    );

  if (!user) {
    return unauthorized();
  }

  const restaurant =
    await env.DB.prepare(`
      SELECT *
      FROM restaurants
      WHERE user_id = ?
      LIMIT 1
    `).bind(user.id).first();

  return json({
    ok: true,
    restaurant
  });
}


async function updateRestaurant(request, env) {
  const user =
    await requireUser(
      request,
      env
    );

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

  if (!name) {
    return json({
      ok: false,
      error: "اسم المطعم مطلوب"
    }, 400);
  }

  const restaurant =
    await env.DB.prepare(`
      SELECT *
      FROM restaurants
      WHERE user_id = ?
      LIMIT 1
    `).bind(user.id).first();

  if (!restaurant) {
    return json({
      ok: false,
      error: "المطعم غير موجود"
    }, 404);
  }

  await env.DB.prepare(`
    UPDATE restaurants
    SET
      name = ?,
      description = ?,
      phone = ?,
      address = ?,
      logo = ?
    WHERE user_id = ?
  `).bind(
    name,
    description,
    phone,
    address,
    logo,
    user.id
  ).run();

  return json({
    ok: true,
    message:
      "تم حفظ بيانات المطعم"
  });
}


// =========================
// CATEGORIES
// =========================

async function getCategories(request, env) {
  const user =
    await requireUser(
      request,
      env
    );

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
    await requireUser(
      request,
      env
    );

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
      error:
        "اسم القسم مطلوب"
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
    message:
      "تم إضافة القسم",
    category: {
      id,
      name
    }
  }, 201);
}


async function deleteCategory(request, env) {
  const user =
    await requireUser(
      request,
      env
    );

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
      error:
        "القسم غير موجود"
    }, 404);
  }

  await env.DB.prepare(`
    DELETE FROM categories
    WHERE id = ?
    AND restaurant_id = ?
  `).bind(
    id,
    restaurant.id
  ).run();

  await env.DB.prepare(`
    UPDATE items
    SET category_id = NULL
    WHERE category_id = ?
    AND restaurant_id = ?
  `).bind(
    id,
    restaurant.id
  ).run();

  return json({
    ok: true,
    message:
      "تم حذف القسم"
  });
}


// =========================
// ITEMS
// =========================

async function getItems(request, env) {
  const user =
    await requireUser(
      request,
      env
    );

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
    await requireUser(
      request,
      env
    );

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
      error:
        "اسم الصنف مطلوب"
    }, 400);
  }

  if (
    !Number.isFinite(price) ||
    price < 0
  ) {
    return json({
      ok: false,
      error:
        "السعر غير صحيح"
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
        error:
          "القسم غير صحيح"
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
    message:
      "تم إضافة الصنف",
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
    await requireUser(
      request,
      env
    );

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
      error:
        "اسم الصنف مطلوب"
    }, 400);
  }

  if (
    !Number.isFinite(price) ||
    price < 0
  ) {
    return json({
      ok: false,
      error:
        "السعر غير صحيح"
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
      error:
        "الصنف غير موجود"
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
        error:
          "القسم غير صحيح"
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
    message:
      "تم تعديل الصنف"
  });
}


async function deleteItem(request, env) {
  const user =
    await requireUser(
      request,
      env
    );

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

  const result =
    await env.DB.prepare(`
      DELETE FROM items
      WHERE id = ?
      AND restaurant_id = ?
    `).bind(
      id,
      restaurant.id
    ).run();

  if (!result.success) {
    return json({
      ok: false,
      error:
        "تعذر حذف الصنف"
    }, 400);
  }

  return json({
    ok: true,
    message:
      "تم حذف الصنف"
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
      '<h1 style="text-align:center;margin-top:80px">' +
      'المنيو غير موجود' +
      '</h1>',
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
      '<h1 style="text-align:center;margin-top:80px">' +
      'المنيو غير موجود' +
      '</h1>',
      404
    );
  }

  const categories =
    await env.DB.prepare(`
      SELECT *
      FROM categories
      WHERE restaurant_id = ?
      ORDER BY sort_order ASC
    `).bind(
      restaurant.id
    ).all();

  const items =
    await env.DB.prepare(`
      SELECT *
      FROM items
      WHERE restaurant_id = ?
      ORDER BY sort_order ASC
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
// HELPERS
// =========================

async function requireUser(request, env) {
  return currentUser(
    request,
    env
  );
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
      (id, user_id, name, slug)
      VALUES (?, ?, ?, ?)
    `).bind(
      id,
      userId,
      user?.name || "",
      slug
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


function unauthorized() {
  return json({
    ok: false,
    error:
      "يجب تسجيل الدخول أولاً"
  }, 401);
}


function clean(value) {
  return String(
    value || ""
  ).trim();
}


function isEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
    email
  );
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


async function verifyPassword(
  password,
  stored
) {
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
    result |=
      a[i] ^ b[i];
  }

  return result === 0;
}


function bytesToBase64(bytes) {
  let binary = "";

  for (const byte of bytes) {
    binary += String.fromCharCode(
      byte
    );
  }

  return btoa(binary);
}


function base64ToBytes(value) {
  const binary =
    atob(value);

  const bytes =
    new Uint8Array(
      binary.length
    );

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
// HOME
// =========================

function homePage() {
  return `
<!DOCTYPE html>
<html lang="ar" dir="rtl">

<head>

<meta charset="UTF-8">

<meta name="viewport"
content="width=device-width,initial-scale=1">

<title>لمسة | LAMSA</title>

<style>

*{
box-sizing:border-box
}

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

h1 span{
color:#a86c35;
}

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
أنشئ موقع مطعمك أو كافيهك ومنيوك الرقمية
بسهولة، وتحكم في بياناتك وأسعارك وأصنافك بنفسك.
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

</body>

</html>
`;
}


// =========================
// AUTH
// =========================

function authPage() {
  return `
<!DOCTYPE html>
<html lang="ar" dir="rtl">

<head>

<meta charset="UTF-8">

<meta name="viewport"
content="width=device-width,initial-scale=1">

<title>الدخول | لمسة</title>

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

.hidden{
display:none;
}

</style>

</head>

<body>

<div class="card">

<div class="logo">
لمسة
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

<a
href="/"
class="back">
← العودة للرئيسية
</a>

</div>

<script>

const loginForm =
document.getElementById(
  "loginForm"
);

const registerForm =
document.getElementById(
  "registerForm"
);

const loginTab =
document.getElementById(
  "loginTab"
);

const registerTab =
document.getElementById(
  "registerTab"
);

const message =
document.getElementById(
  "message"
);


function showMessage(text){
  message.textContent = text;
  message.style.display = "block";
}


function showLogin(){

  loginForm.classList.remove(
    "hidden"
  );

  registerForm.classList.add(
    "hidden"
  );

  loginTab.classList.add(
    "active"
  );

  registerTab.classList.remove(
    "active"
  );

  message.style.display =
    "none";
}


function showRegister(){

  loginForm.classList.add(
    "hidden"
  );

  registerForm.classList.remove(
    "hidden"
  );

  loginTab.classList.remove(
    "active"
  );

  registerTab.classList.add(
    "active"
  );

  message.style.display =
    "none";
}


loginForm.addEventListener(
  "submit",
  async function(e){

    e.preventDefault();

    const button =
      loginForm.querySelector(
        "button[type=submit]"
      );

    button.disabled = true;

    button.textContent =
      "جارٍ تسجيل الدخول...";

    try{

      const response =
        await fetch(
          "/api/login",
          {
            method:"POST",

            headers:{
              "Content-Type":
                "application/json"
            },

            credentials:
              "same-origin",

            body:
              JSON.stringify({

                identifier:
                  document.getElementById(
                    "loginIdentifier"
                  ).value.trim(),

                password:
                  document.getElementById(
                    "loginPassword"
                  ).value

              })
          }
        );

      const data =
        await response.json();

      if (
        !response.ok ||
        !data.ok
      ) {
        throw new Error(
          data.error ||
          "تعذر تسجيل الدخول"
        );
      }

      location.href =
        "/dashboard";

    }catch(error){

      showMessage(
        error.message
      );

      button.disabled = false;

      button.textContent =
        "تسجيل الدخول";
    }

  }
);


registerForm.addEventListener(
  "submit",
  async function(e){

    e.preventDefault();

    const button =
      registerForm.querySelector(
        "button[type=submit]"
      );

    button.disabled = true;

    button.textContent =
      "جارٍ إنشاء الحساب...";

    try{

      const response =
        await fetch(
          "/api/register",
          {
            method:"POST",

            headers:{
              "Content-Type":
                "application/json"
            },

            credentials:
              "same-origin",

            body:
              JSON.stringify({

                name:
                  document.getElementById(
                    "registerName"
                  ).value.trim(),

                phone:
                  document.getElementById(
                    "registerPhone"
                  ).value.trim(),

                email:
                  document.getElementById(
                    "registerEmail"
                  ).value.trim(),

                password:
                  document.getElementById(
                    "registerPassword"
                  ).value

              })
          }
        );

      const data =
        await response.json();

      if (
        !response.ok ||
        !data.ok
      ) {
        throw new Error(
          data.error ||
          "تعذر إنشاء الحساب"
        );
      }

      location.href =
        "/dashboard";

    }catch(error){

      showMessage(
        error.message
      );

      button.disabled = false;

      button.textContent =
        "إنشاء الحساب";
    }

  }
);

</script>

</body>

</html>
`;
}


// =========================
// DASHBOARD
// =========================

function dashboardPage() {
  return `
<!DOCTYPE html>
<html lang="ar" dir="rtl">

<head>

<meta charset="UTF-8">

<meta name="viewport"
content="width=device-width,initial-scale=1">

<title>لوحة التحكم | لمسة</title>

<style>

*{
box-sizing:border-box
}

body{
margin:0;
font-family:Arial,sans-serif;
background:#f6f4f0;
color:#222;
}

header{
background:white;
min-height:70px;
border-bottom:1px solid #eee;
padding:12px 6%;
display:flex;
align-items:center;
justify-content:space-between;
gap:15px;
}

.logo{
font-size:26px;
font-weight:900;
}

.logout{
background:#222;
color:white;
border:0;
border-radius:10px;
padding:11px 18px;
}

main{
max-width:1150px;
margin:auto;
padding:25px 18px 50px;
}

.welcome{
background:#222;
color:white;
border-radius:20px;
padding:28px;
margin-bottom:20px;
}

.welcome h1{
margin:0 0 8px;
}

.welcome p{
margin:0;
color:#ddd;
}

.grid{
display:grid;
grid-template-columns:
repeat(2,minmax(0,1fr));
gap:16px;
}

.card{
background:white;
border:1px solid #e8e5df;
border-radius:18px;
padding:22px;
}

.card h2{
margin-top:0;
}

input,textarea,select{
width:100%;
padding:13px;
border:1px solid #ddd;
border-radius:10px;
font:inherit;
margin-top:7px;
}

textarea{
min-height:90px;
resize:vertical;
}

label{
display:block;
margin-top:13px;
font-weight:bold;
}

.save{
margin-top:15px;
width:100%;
padding:13px;
border:0;
border-radius:10px;
background:#222;
color:white;
font:inherit;
}

.menu-link{
display:block;
background:#f4f1eb;
padding:14px;
border-radius:10px;
margin-top:12px;
word-break:break-all;
}

.category-row,
.item-row{
border:1px solid #eee;
border-radius:12px;
padding:13px;
margin-top:10px;
}

.item-row{
display:flex;
justify-content:space-between;
gap:10px;
align-items:center;
}

.small{
font-size:13px;
color:#777;
}

.danger{
background:#f2eeee;
color:#8b2525;
border:0;
border-radius:8px;
padding:8px 12px;
}

.add{
background:#222;
color:white;
border:0;
border-radius:9px;
padding:10px 15px;
margin-top:10px;
}

.full{
grid-column:1/-1;
}

@media(max-width:700px){

.grid{
grid-template-columns:1fr;
}

.full{
grid-column:auto;
}

.item-row{
align-items:flex-start;
}

}

</style>

</head>

<body>

<header>

<div class="logo">
لمسة
</div>

<button
class="logout"
onclick="logout()">
تسجيل الخروج
</button>

</header>

<main>

<section class="welcome">

<h1 id="welcome">
أهلاً بك 👋
</h1>

<p>
من هنا تقدر تدير موقع مطعمك ومنيوك.
</p>

</section>

<div class="grid">

<section class="card">

<h2>
🏪 بيانات المطعم
</h2>

<label>
اسم المطعم
</label>

<input
id="restaurantName">

<label>
الوصف
</label>

<textarea
id="restaurantDescription">
</textarea>

<label>
رقم الهاتف
</label>

<input
id="restaurantPhone">

<label>
العنوان
</label>

<input
id="restaurantAddress">

<button
class="save"
onclick="saveRestaurant()">
حفظ بيانات المطعم
</button>

<div
id="restaurantMessage"
class="small">
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

<div
id="categories">
</div>

</section>


<section class="card">

<h2>
🍽️ إضافة صنف
</h2>

<label>
اسم الصنف
</label>

<input
id="itemName"
placeholder="مثال: برجر لحم">

<label>
السعر
</label>

<input
id="itemPrice"
type="number"
step="0.01"
placeholder="150">

<label>
القسم
</label>

<select id="itemCategory">

<option value="">
بدون قسم
</option>

</select>

<label>
الوصف
</label>

<textarea
id="itemDescription"
placeholder="وصف الصنف">
</textarea>

<label>
رابط الصورة
</label>

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
class="small">
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


async function api(
  url,
  options = {}
){

  const response =
    await fetch(
      url,
      {
        ...options,

        credentials:
          "same-origin",

        headers:{
          "Content-Type":
            "application/json",

          ...(options.headers || {})
        }
      }
    );

  const data =
    await response.json();

  if (
    !response.ok ||
    !data.ok
  ) {
    throw new Error(
      data.error ||
      "حدث خطأ"
    );
  }

  return data;
}


async function load(){

  try{

    const me =
      await api(
        "/api/me"
      );

    document.getElementById(
      "welcome"
    ).textContent =
      "أهلاً بك يا " +
      me.user.name +
      " 👋";


    const restaurantData =
      await api(
        "/api/restaurant"
      );

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


    const link =
      location.origin +
      "/menu/" +
      restaurant.slug;


    const menuLink =
      document.getElementById(
        "menuLink"
      );

    menuLink.href = link;

    menuLink.textContent =
      link;


    await loadCategories();
    await loadItems();

  }catch(error){

    location.href =
      "/login";

  }

}


async function saveRestaurant(){

  try{

    await api(
      "/api/restaurant",
      {
        method:"PUT",

        body:
          JSON.stringify({

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
              ).value

          })
      }
    );

    document.getElementById(
      "restaurantMessage"
    ).textContent =
      "تم حفظ البيانات ✓";

  }catch(error){

    document.getElementById(
      "restaurantMessage"
    ).textContent =
      error.message;

  }

}


async function loadCategories(){

  const data =
    await api(
      "/api/categories"
    );

  categories =
    data.categories;

  renderCategories();

}


function renderCategories(){

  const box =
    document.getElementById(
      "categories"
    );

  const select =
    document.getElementById(
      "itemCategory"
    );

  box.innerHTML = "";

  select.innerHTML =
    '<option value="">بدون قسم</option>';


  categories.forEach(
    category => {

      const row =
        document.createElement(
          "div"
        );

      row.className =
        "category-row";


      row.innerHTML =
        '<strong>' +
        escapeHtml(
          category.name
        ) +
        '</strong>' +

        '<button ' +
        'class="danger" ' +
        'style="float:left" ' +
        'onclick="removeCategory(\'' +
        category.id +
        '\')">' +
        'حذف' +
        '</button>';


      box.appendChild(row);


      const option =
        document.createElement(
          "option"
        );

      option.value =
        category.id;

      option.textContent =
        category.name;

      select.appendChild(
        option
      );

    }
  );


  if (!categories.length) {

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

  if (!name) {
    return;
  }

  try{

    await api(
      "/api/categories",
      {
        method:"POST",

        body:
          JSON.stringify({
            name
          })
      }
    );

    document.getElementById(
      "categoryName"
    ).value = "";

    await loadCategories();

  }catch(error){

    alert(
      error.message
    );

  }

}


async function removeCategory(id){

  if (
    !confirm(
      "هل تريد حذف هذا القسم؟"
    )
  ) {
    return;
  }

  try{

    await api(
      "/api/categories/" +
      id,
      {
        method:"DELETE"
      }
    );

    await loadCategories();
    await loadItems();

  }catch(error){

    alert(
      error.message
    );

  }

}


async function loadItems(){

  const data =
    await api(
      "/api/items"
    );

  items =
    data.items;

  renderItems();

}


function renderItems(){

  const box =
    document.getElementById(
      "items"
    );

  box.innerHTML = "";


  if (!items.length) {

    box.innerHTML =
      '<div class="small">' +
      'لم تتم إضافة أصناف بعد.' +
      '</div>';

    return;
  }


  items.forEach(
    item => {

      const row =
        document.createElement(
          "div"
        );

      row.className =
        "item-row";


      const categoryText =
        item.category_name
          ? " — " +
            escapeHtml(
              item.category_name
            )
          : "";


      row.innerHTML =
        '<div>' +

          '<strong>' +
            escapeHtml(
              item.name
            ) +
          '</strong>' +

          '<div class="small">' +
            item.price +
            ' جنيه' +
            categoryText +
          '</div>' +

          '<div class="small">' +
            escapeHtml(
              item.description || ""
            ) +
          '</div>' +

        '</div>' +

        '<div>' +

          '<button ' +
          'class="danger" ' +
          'onclick="editItem(\'' +
          item.id +
          '\')">' +
          'تعديل' +
          '</button>' +

          '<button ' +
          'class="danger" ' +
          'onclick="removeItem(\'' +
          item.id +
          '\')">' +
          'حذف' +
          '</button>' +

        '</div>';


      box.appendChild(row);

    }
  );

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

        body:
          JSON.stringify({

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
    items.find(
      x => x.id === id
    );

  if (!item) {
    return;
  }


  const name =
    prompt(
      "اسم الصنف:",
      item.name
    );

  if (name === null) {
    return;
  }


  const price =
    prompt(
      "السعر:",
      item.price
    );

  if (price === null) {
    return;
  }


  const description =
    prompt(
      "الوصف:",
      item.description || ""
    );

  if (description === null) {
    return;
  }


  try{

    await api(
      "/api/items/" +
      id,
      {
        method:"PUT",

        body:
          JSON.stringify({

            name,
            price,
            description,

            category_id:
              item.category_id || "",

            image:
              item.image || ""

          })
      }
    );

    await loadItems();

  }catch(error){

    alert(
      error.message
    );

  }

}


async function removeItem(id){

  if (
    !confirm(
      "هل تريد حذف هذا الصنف؟"
    )
  ) {
    return;
  }

  try{

    await api(
      "/api/items/" +
      id,
      {
        method:"DELETE"
      }
    );

    await loadItems();

  }catch(error){

    alert(
      error.message
    );

  }

}


async function logout(){

  await fetch(
    "/api/logout",
    {
      method:"POST",
      credentials:
        "same-origin"
    }
  );

  location.href = "/";

}


function escapeHtml(value){

  return String(
    value || ""
  )
  .replaceAll(
    "&",
    "&amp;"
  )
  .replaceAll(
    "<",
    "&lt;"
  )
  .replaceAll(
    ">",
    "&gt;"
  )
  .replaceAll(
    '"',
    "&quot;"
  )
  .replaceAll(
    "'",
    "&#039;"
  );

}


load();

</script>

</body>

</html>
`;
}


// =========================
// PUBLIC MENU PAGE
// =========================

function publicMenuPage(
  restaurant,
  categories,
  items
) {

  let sections = "";


  for (
    const category of categories
  ) {

    const categoryItems =
      items.filter(
        item =>
          item.category_id ===
          category.id
      );


    if (!categoryItems.length) {
      continue;
    }


    let itemHtml = "";


    for (
      const item of categoryItems
    ) {

      let imageHtml = "";


      if (item.image) {

        imageHtml =
          '<img src="' +
          escapeHtml(
            item.image
          ) +
          '" alt="' +
          escapeHtml(
            item.name
          ) +
          '">';

      }


      let descriptionHtml = "";


      if (item.description) {

        descriptionHtml =
          '<p>' +
          escapeHtml(
            item.description
          ) +
          '</p>';

      }


      itemHtml +=
        '<article class="item">' +

          imageHtml +

          '<div class="item-info">' +

            '<div class="item-top">' +

              '<h3>' +
                escapeHtml(
                  item.name
                ) +
              '</h3>' +

              '<strong>' +
                Number(
                  item.price
                ).toFixed(2) +
                ' ج' +
              '</strong>' +

            '</div>' +

            descriptionHtml +

          '</div>' +

        '</article>';

    }


    sections +=
      '<section class="category">' +

        '<h2>' +
          escapeHtml(
            category.name
          ) +
        '</h2>' +

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


  if (uncategorized.length) {

    let otherItems = "";


    for (
      const item of uncategorized
    ) {

      let imageHtml = "";


      if (item.image) {

        imageHtml =
          '<img src="' +
          escapeHtml(
            item.image
          ) +
          '" alt="' +
          escapeHtml(
            item.name
          ) +
          '">';

      }


      let descriptionHtml = "";


      if (item.description) {

        descriptionHtml =
          '<p>' +
          escapeHtml(
            item.description
          ) +
          '</p>';

      }


      otherItems +=
        '<article class="item">' +

          imageHtml +

          '<div class="item-info">' +

            '<div class="item-top">' +

              '<h3>' +
                escapeHtml(
                  item.name
                ) +
              '</h3>' +

              '<strong>' +
                Number(
                  item.price
                ).toFixed(2) +
                ' ج' +
              '</strong>' +

            '</div>' +

            descriptionHtml +

          '</div>' +

        '</article>';

    }


    sections +=
      '<section class="category">' +

        '<h2>أصناف أخرى</h2>' +

        '<div class="items">' +
          otherItems +
        '</div>' +

      '</section>';

  }


  let restaurantDescription = "";


  if (restaurant.description) {

    restaurantDescription =
      '<p>' +
      escapeHtml(
        restaurant.description
      ) +
      '</p>';

  }


  return (

    '<!DOCTYPE html>' +

    '<html lang="ar" dir="rtl">' +

    '<head>' +

    '<meta charset="UTF-8">' +

    '<meta name="viewport" ' +
    'content="width=device-width,initial-scale=1">' +

    '<title>' +
      escapeHtml(
        restaurant.name
      ) +
      ' | لمسة' +
    '</title>' +

    '<style>' +

    '*{box-sizing:border-box}' +

    'body{' +
      'margin:0;' +
      'font-family:Arial,sans-serif;' +
      'background:#f7f5f1;' +
      'color:#222;' +
    '}' +

    '.hero{' +
      'background:#222;' +
      'color:white;' +
      'text-align:center;' +
      'padding:55px 20px;' +
    '}' +

    '.logo{' +
      'font-size:34px;' +
      'font-weight:900;' +
      'margin-bottom:15px;' +
    '}' +

    '.hero h1{' +
      'margin:0;' +
      'font-size:38px;' +
    '}' +

    '.hero p{' +
      'color:#ddd;' +
      'max-width:650px;' +
      'margin:15px auto 0;' +
      'line-height:1.8;' +
    '}' +

    '.menu{' +
      'max-width:900px;' +
      'margin:auto;' +
      'padding:25px 16px 60px;' +
    '}' +

    '.category{' +
      'margin-bottom:35px;' +
    '}' +

    '.category h2{' +
      'font-size:25px;' +
      'margin-bottom:15px;' +
    '}' +

    '.items{' +
      'display:grid;' +
      'gap:12px;' +
    '}' +

    '.item{' +
      'background:white;' +
      'border:1px solid #e9e5de;' +
      'border-radius:16px;' +
      'padding:15px;' +
      'display:flex;' +
      'gap:15px;' +
    '}' +

    '.item img{' +
      'width:90px;' +
      'height:90px;' +
      'object-fit:cover;' +
      'border-radius:12px;' +
    '}' +

    '.item-info{' +
      'flex:1;' +
    '}' +

    '.item-top{' +
      'display:flex;' +
      'align-items:flex-start;' +
      'justify-content:space-between;' +
      'gap:15px;' +
    '}' +

    '.item h3{' +
      'margin:0;' +
      'font-size:18px;' +
    '}' +

    '.item strong{' +
      'white-space:nowrap;' +
    '}' +

    '.item p{' +
      'color:#777;' +
      'line-height:1.6;' +
      'margin:8px 0 0;' +
    '}' +

    '.footer{' +
      'text-align:center;' +
      'padding:25px;' +
      'color:#888;' +
      'font-size:13px;' +
    '}' +

    '@media(max-width:600px){' +

      '.hero{' +
        'padding:40px 18px;' +
      '}' +

      '.hero h1{' +
        'font-size:30px;' +
      '}' +

      '.item img{' +
        'width:75px;' +
        'height:75px;' +
      '}' +

    '}' +

    '</style>' +

    '</head>' +

    '<body>' +

    '<header class="hero">' +

      '<div class="logo">' +
        'لمسة' +
      '</div>' +

      '<h1>' +
        escapeHtml(
          restaurant.name
        ) +
      '</h1>' +

      restaurantDescription +

    '</header>' +

    '<main class="menu">' +

      sections +

    '</main>' +

    '<div class="footer">' +
      'Powered by LAMSA — لمسة' +
    '</div>' +

    '</body>' +

    '</html>'

  );
}


// =========================
// END
// =========================
