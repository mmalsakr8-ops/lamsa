const COOKIE = 'lamsa_session';
const SESSION_DAYS = 30;
const FREE_DAYS = 30;
const SUPPORT_PHONE = '011111369788';

const DESIGNS = Array.from({ length: 60 }, (_, i) => ({
  id: `design-${String(i + 1).padStart(2, '0')}`,
  name: `تصميم ${i + 1}`,
  tone: ['فاخر', 'عصري', 'هادئ', 'جريء'][i % 4]
}));

export default {
  async fetch(request, env) {
    try {
      const url = new URL(request.url);
      const path = url.pathname;

      if (request.method === 'OPTIONS') {
        return new Response(null, {
          status: 204,
          headers: corsHeaders()
        });
      }

      if (path === '/health') {
        return json({
          ok: true,
          service: 'LAMSA',
          time: new Date().toISOString()
        });
      }

      await initDB(env);

      if (path === '/api/register' && request.method === 'POST')
        return register(request, env);

      if (path === '/api/login' && request.method === 'POST')
        return login(request, env);

      if (path === '/api/logout' && request.method === 'POST')
        return logout(request, env);

      if (path === '/api/me' && request.method === 'GET')
        return me(request, env);

      if (path === '/api/site' && request.method === 'GET')
        return getSite(request, env);

      if (path === '/api/site' && request.method === 'POST')
        return createSite(request, env);

      if (path === '/api/site' && request.method === 'PUT')
        return updateSite(request, env);

      if (path === '/api/categories' && request.method === 'POST')
        return addCategory(request, env);

      if (path === '/api/categories' && request.method === 'DELETE')
        return deleteCategory(request, env);

      if (path === '/api/items' && request.method === 'POST')
        return addItem(request, env);

      if (path === '/api/items' && request.method === 'PUT')
        return updateItem(request, env);

      if (path === '/api/items' && request.method === 'DELETE')
        return deleteItem(request, env);

      if (path === '/api/admin/sites' && request.method === 'GET')
        return adminSites(request, env);

      if (path === '/api/admin/renew' && request.method === 'POST')
        return renew(request, env);

      if (path === '/auth' || path === '/login' || path === '/register')
        return html(authPage());

      if (path === '/dashboard')
        return html(dashboardPage());

      if (path.startsWith('/m/'))
        return publicMenu(request, env, path.slice(3));

      return html(home());

    } catch (error) {
      return json({
        error: 'حدث خطأ في النظام',
        detail: error?.message || String(error)
      }, 500);
    }
  }
};

function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type'
  };
}

function json(data, status = 200, extra = {}) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
      ...corsHeaders(),
      ...extra
    }
  });
}

function html(body, status = 200) {
  return new Response(body, {
    status,
    headers: {
      'Content-Type': 'text/html;charset=UTF-8',
      'Cache-Control': 'no-store'
    }
  });
}

function id() {
  return crypto.randomUUID();
}

function clean(value, max = 500) {
  return String(value ?? '').trim().slice(0, max);
}

function emailNorm(value) {
  return clean(value, 180).toLowerCase();
}

function phoneNorm(value) {
  return clean(value, 30).replace(/[^\d+]/g, '');
}

function slug(value) {
  const result = clean(value, 80)
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, '-')
    .replace(/^-+|-+$/g, '');

  return result || `lamsa-${Math.random().toString(36).slice(2, 8)}`;
}

function escapeHTML(value) {
  return String(value ?? '').replace(/[&<>"']/g, char => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  }[char]));
}

function getCookie(request, name) {
  const cookies = request.headers.get('Cookie') || '';
  const match = cookies.match(
    new RegExp(`(?:^|;\\s*)${name}=([^;]+)`)
  );

  return match ? decodeURIComponent(match[1]) : null;
}

function sessionCookie(value, maxAge = SESSION_DAYS * 86400) {
  return `${COOKIE}=${encodeURIComponent(value)}; Max-Age=${maxAge}; Path=/; HttpOnly; Secure; SameSite=Lax`;
}

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
      CREATE TABLE IF NOT EXISTS sites (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        name TEXT NOT NULL,
        type TEXT NOT NULL DEFAULT 'restaurant',
        slug TEXT NOT NULL UNIQUE,
        design_id TEXT NOT NULL DEFAULT 'lux',
        phone TEXT,
        address TEXT,
        hours TEXT,
        logo_url TEXT,
        status TEXT NOT NULL DEFAULT 'active',
        trial_ends_at TEXT NOT NULL,
        subscription_ends_at TEXT,
        created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `),

    env.DB.prepare(`
      CREATE TABLE IF NOT EXISTS categories (
        id TEXT PRIMARY KEY,
        site_id TEXT NOT NULL,
        name TEXT NOT NULL,
        sort_order INTEGER NOT NULL DEFAULT 0,
        FOREIGN KEY (site_id) REFERENCES sites(id) ON DELETE CASCADE
      )
    `),

    env.DB.prepare(`
      CREATE TABLE IF NOT EXISTS items (
        id TEXT PRIMARY KEY,
        category_id TEXT NOT NULL,
        name TEXT NOT NULL,
        description TEXT,
        price REAL NOT NULL DEFAULT 0,
        image_url TEXT,
        available INTEGER NOT NULL DEFAULT 1,
        sort_order INTEGER NOT NULL DEFAULT 0,
        FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE
      )
    `)
  ]);
}

async function hashPassword(password, salt = null) {
  const saltBytes =
    salt || crypto.getRandomValues(new Uint8Array(16));

  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(password),
    { name: 'PBKDF2' },
    false,
    ['deriveBits']
  );

  const bits = await crypto.subtle.deriveBits(
    {
      name: 'PBKDF2',
      salt: saltBytes,
      iterations: 120000,
      hash: 'SHA-256'
    },
    key,
    256
  );

  return `${toHex(saltBytes)}:${toHex(new Uint8Array(bits))}`;
}

function toHex(bytes) {
  return [...bytes]
    .map(byte => byte.toString(16).padStart(2, '0'))
    .join('');
}

function fromHex(hex) {
  const bytes = new Uint8Array(hex.length / 2);

  for (let i = 0; i < bytes.length; i++) {
    bytes[i] = parseInt(hex.slice(i * 2, i * 2 + 2), 16);
  }

  return bytes;
}

async function verifyPassword(password, stored) {
  const [salt, expected] = String(stored || '').split(':');

  if (!salt || !expected) return false;

  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(password),
    { name: 'PBKDF2' },
    false,
    ['deriveBits']
  );

  const bits = await crypto.subtle.deriveBits(
    {
      name: 'PBKDF2',
      salt: fromHex(salt),
      iterations: 120000,
      hash: 'SHA-256'
    },
    key,
    256
  );

  return toHex(new Uint8Array(bits)) === expected;
}

async function createSession(env, userId) {
  const sessionId = id();

  const expires = new Date(
    Date.now() + SESSION_DAYS * 86400000
  ).toISOString();

  await env.DB
    .prepare(`
      INSERT INTO sessions(id,user_id,expires_at)
      VALUES(?,?,?)
    `)
    .bind(sessionId, userId, expires)
    .run();

  return sessionId;
}

async function currentUser(request, env) {
  const sessionId = getCookie(request, COOKIE);

  if (!sessionId) return null;

  return env.DB
    .prepare(`
      SELECT u.*
      FROM sessions s
      JOIN users u ON u.id = s.user_id
      WHERE s.id = ?
      AND s.expires_at > ?
    `)
    .bind(sessionId, new Date().toISOString())
    .first();
}

async function requireUser(request, env) {
  const user = await currentUser(request, env);

  if (!user) {
    throw new Error('يجب تسجيل الدخول أولاً');
  }

  return user;
}

async function register(request, env) {
  const body = await request.json();

  const name = clean(body.name, 100);
  const email = emailNorm(body.email);
  const phone = phoneNorm(body.phone);
  const password = String(body.password || '');

  if (name.length < 2)
    return json({ error: 'اكتب الاسم بشكل صحيح' }, 400);

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
    return json({ error: 'البريد الإلكتروني غير صحيح' }, 400);

  if (phone.length < 8)
    return json({ error: 'رقم الهاتف غير صحيح' }, 400);

  if (password.length < 6)
    return json({
      error: 'كلمة المرور يجب أن تكون 6 أحرف على الأقل'
    }, 400);

  const duplicate = await env.DB
    .prepare(`
      SELECT id
      FROM users
      WHERE email = ?
      OR phone = ?
    `)
    .bind(email, phone)
    .first();

  if (duplicate) {
    return json({
      error: 'البريد الإلكتروني أو رقم الهاتف مستخدم بالفعل'
    }, 409);
  }

  const count = await env.DB
    .prepare(`SELECT COUNT(*) AS total FROM users`)
    .first();

  const role =
    Number(count?.total || 0) === 0
      ? 'admin'
      : 'customer';

  const userId = id();
  const passwordHash = await hashPassword(password);

  await env.DB
    .prepare(`
      INSERT INTO users
      (id,name,email,phone,password_hash,role)
      VALUES(?,?,?,?,?,?)
    `)
    .bind(
      userId,
      name,
      email,
      phone,
      passwordHash,
      role
    )
    .run();

  const sessionId =
    await createSession(env, userId);

  return json(
    {
      ok: true,
      user: {
        id: userId,
        name,
        email,
        phone,
        role
      }
    },
    200,
    {
      'Set-Cookie': sessionCookie(sessionId)
    }
  );
}

async function login(request, env) {
  const body = await request.json();

  const identity = clean(
    body.identity ||
    body.email ||
    body.phone,
    180
  );

  const password = String(body.password || '');

  const user = await env.DB
    .prepare(`
      SELECT *
      FROM users
      WHERE email = ?
      OR phone = ?
    `)
    .bind(
      emailNorm(identity),
      phoneNorm(identity)
    )
    .first();

  if (
    !user ||
    !(await verifyPassword(
      password,
      user.password_hash
    ))
  ) {
    return json({
      error: 'بيانات الدخول غير صحيحة'
    }, 401);
  }

  const sessionId =
    await createSession(env, user.id);

  return json(
    {
      ok: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role
      }
    },
    200,
    {
      'Set-Cookie': sessionCookie(sessionId)
    }
  );
}

async function logout(request, env) {
  const sessionId =
    getCookie(request, COOKIE);

  if (sessionId) {
    await env.DB
      .prepare(`DELETE FROM sessions WHERE id=?`)
      .bind(sessionId)
      .run();
  }

  return json(
    { ok: true },
    200,
    {
      'Set-Cookie': sessionCookie('', 0)
    }
  );
}

async function me(request, env) {
  const user =
    await currentUser(request, env);

  if (!user)
    return json({ user: null });

  return json({
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role
    }
  });
}

function subscriptionInfo(site) {
  const now = Date.now();

  const subscriptionEnd =
    site.subscription_ends_at
      ? new Date(site.subscription_ends_at).getTime()
      : 0;

  const trialEnd =
    new Date(site.trial_ends_at).getTime();

  const subscribed =
    subscriptionEnd > now;

  const end =
    subscribed
      ? subscriptionEnd
      : trialEnd;

  return {
    end,
    days: Math.max(
      0,
      Math.ceil((end - now) / 86400000)
    ),
    expired: end <= now,
    trial: !subscribed,
    subscribed
  };
}

async function getOwnerSite(request, env) {
  const user =
    await requireUser(request, env);

  const site =
    await env.DB
      .prepare(`
        SELECT *
        FROM sites
        WHERE user_id=?
        ORDER BY created_at ASC
        LIMIT 1
      `)
      .bind(user.id)
      .first();

  return { user, site };
}

async function getSite(request, env) {
  const { user, site } =
    await getOwnerSite(request, env);

  if (!site) {
    return json({
      user,
      site: null
    });
  }

  const categories =
    await env.DB
      .prepare(`
        SELECT *
        FROM categories
        WHERE site_id=?
        ORDER BY sort_order,id
      `)
      .bind(site.id)
      .all();

  const items =
    await env.DB
      .prepare(`
        SELECT i.*
        FROM items i
        JOIN categories c
          ON c.id=i.category_id
        WHERE c.site_id=?
        ORDER BY i.sort_order,i.id
      `)
      .bind(site.id)
      .all();

  return json({
    user,
    site,
    categories: categories.results || [],
    items: items.results || [],
    dates: subscriptionInfo(site),
    designs: DESIGNS
  });
}

async function createSite(request, env) {
  const { user, site } =
    await getOwnerSite(request, env);

  if (site) {
    return json({
      error: 'لديك موقع بالفعل'
    }, 409);
  }

  const body = await request.json();

  const name =
    clean(body.name, 120);

  if (!name) {
    return json({
      error: 'اكتب اسم المطعم أو الكافيه'
    }, 400);
  }

  let siteSlug = slug(name);

  const exists =
    await env.DB
      .prepare(`SELECT id FROM sites WHERE slug=?`)
      .bind(siteSlug)
      .first();

  if (exists) {
    siteSlug =
      `${siteSlug}-${Math.random()
        .toString(36)
        .slice(2, 7)}`;
  }

  const siteId = id();

  const trialEnd =
    new Date(
      Date.now() + FREE_DAYS * 86400000
    ).toISOString();

  await env.DB
    .prepare(`
      INSERT INTO sites
      (
        id,
        user_id,
        name,
        type,
        slug,
        design_id,
        status,
        trial_ends_at,
        phone,
        address,
        hours,
        logo_url
      )
      VALUES(?,?,?,?,?,?,?,?,?,?,?,?)
    `)
    .bind(
      siteId,
      user.id,
      name,
      clean(body.type, 30) || 'restaurant',
      siteSlug,
      'design-01',
      'active',
      trialEnd,
      clean(body.phone, 30),
      clean(body.address, 250),
      clean(body.hours, 250),
      clean(body.logo_url, 500)
    )
    .run();

  await env.DB
    .prepare(`
      INSERT INTO categories
      (id,site_id,name,sort_order)
      VALUES(?,?,?,?)
    `)
    .bind(
      id(),
      siteId,
      'المنيو',
      0
    )
    .run();

  return getSite(request, env);
}

async function updateSite(request, env) {
  const { user, site } =
    await getOwnerSite(request, env);

  if (!site)
    return json({
      error: 'أنشئ الموقع أولاً'
    }, 404);

  const body =
    await request.json();

  let designId =
    clean(body.design_id, 60) ||
    site.design_id;

  const info =
    subscriptionInfo(site);

  const allowed =
    info.trial
      ? DESIGNS.slice(0, 5)
      : DESIGNS;

  if (!allowed.some(d => d.id === designId)) {
    designId = site.design_id;
  }

  await env.DB
    .prepare(`
      UPDATE sites
      SET
        name=?,
        type=?,
        design_id=?,
        phone=?,
        address=?,
        hours=?,
        logo_url=?
      WHERE id=?
      AND user_id=?
    `)
    .bind(
      clean(body.name, 120) || site.name,
      clean(body.type, 30) || site.type,
      designId,
      clean(body.phone, 30),
      clean(body.address, 250),
      clean(body.hours, 250),
      clean(body.logo_url, 500),
      site.id,
      user.id
    )
    .run();

  return getSite(request, env);
}

async function addCategory(request, env) {
  const { site } =
    await getOwnerSite(request, env);

  if (!site)
    return json({
      error: 'أنشئ الموقع أولاً'
    }, 404);

  const body =
    await request.json();

  const name =
    clean(body.name, 100);

  if (!name)
    return json({
      error: 'اكتب اسم القسم'
    }, 400);

  const max =
    await env.DB
      .prepare(`
        SELECT COALESCE(MAX(sort_order),-1) AS n
        FROM categories
        WHERE site_id=?
      `)
      .bind(site.id)
      .first();

  await env.DB
    .prepare(`
      INSERT INTO categories
      (id,site_id,name,sort_order)
      VALUES(?,?,?,?)
    `)
    .bind(
      id(),
      site.id,
      name,
      Number(max?.n || -1) + 1
    )
    .run();

  return getSite(request, env);
}

async function deleteCategory(request, env) {
  const { site } =
    await getOwnerSite(request, env);

  if (!site)
    return json({
      error: 'لا يوجد موقع'
    }, 404);

  const body =
    await request.json();

  const categoryId =
    clean(body.id, 100);

  const category =
    await env.DB
      .prepare(`
        SELECT id
        FROM categories
        WHERE id=?
        AND site_id=?
      `)
      .bind(categoryId, site.id)
      .first();

  if (!category)
    return json({
      error: 'القسم غير موجود'
    }, 404);

  await env.DB
    .prepare(`
      DELETE FROM categories
      WHERE id=?
    `)
    .bind(categoryId)
    .run();

  return getSite(request, env);
}

async function addItem(request, env) {
  const { site } =
    await getOwnerSite(request, env);

  if (!site)
    return json({
      error: 'لا يوجد موقع'
    }, 404);

  const body =
    await request.json();

  const categoryId =
    clean(body.category_id, 100);

  const name =
    clean(body.name, 120);

  const price =
    Number(body.price);

  if (!categoryId || !name)
    return json({
      error: 'اختر القسم واكتب اسم الصنف'
    }, 400);

  if (!Number.isFinite(price) || price < 0)
    return json({
      error: 'السعر غير صحيح'
    }, 400);

  const category =
    await env.DB
      .prepare(`
        SELECT id
        FROM categories
        WHERE id=?
        AND site_id=?
      `)
      .bind(categoryId, site.id)
      .first();

  if (!category)
    return json({
      error: 'القسم غير صحيح'
    }, 400);

  const max =
    await env.DB
      .prepare(`
        SELECT COALESCE(MAX(i.sort_order),-1) AS n
        FROM items i
        JOIN categories c
          ON c.id=i.category_id
        WHERE c.site_id=?
        AND i.category_id=?
      `)
      .bind(site.id, categoryId)
      .first();

  await env.DB
    .prepare(`
      INSERT INTO items
      (
        id,
        category_id,
        name,
        description,
        price,
        image_url,
        available,
        sort_order
      )
      VALUES(?,?,?,?,?,?,?,?)
    `)
    .bind(
      id(),
      categoryId,
      name,
      clean(body.description, 500),
      price,
      clean(body.image_url, 500),
      body.available === false ? 0 : 1,
      Number(max?.n || -1) + 1
    )
    .run();

  return getSite(request, env);
}

async function updateItem(request, env) {
  const { site } =
    await getOwnerSite(request, env);

  if (!site)
    return json({
      error: 'لا يوجد موقع'
    }, 404);

  const body =
    await request.json();

  const itemId =
    clean(body.id, 100);

  const categoryId =
    clean(body.category_id, 100);

  const name =
    clean(body.name, 120);

  const price =
    Number(body.price);

  if (!itemId || !categoryId || !name)
    return json({
      error: 'بيانات الصنف ناقصة'
    }, 400);

  if (!Number.isFinite(price) || price < 0)
    return json({
      error: 'السعر غير صحيح'
    }, 400);

  const category =
    await env.DB
      .prepare(`
        SELECT id
        FROM categories
        WHERE id=?
        AND site_id=?
      `)
      .bind(categoryId, site.id)
      .first();

  if (!category)
    return json({
      error: 'القسم غير صحيح'
    }, 400);

  const result =
    await env.DB
      .prepare(`
        UPDATE items
        SET
          category_id=?,
          name=?,
          description=?,
          price=?,
          image_url=?,
          available=?
        WHERE id=?
        AND category_id IN (
          SELECT id
          FROM categories
          WHERE site_id=?
        )
      `)
      .bind(
        categoryId,
        name,
        clean(body.description, 500),
        price,
        clean(body.image_url, 500),
        body.available === false ? 0 : 1,
        itemId,
        site.id
      )
      .run();

  if (!result.meta?.changes)
    return json({
      error: 'الصنف غير موجود'
    }, 404);

  return getSite(request, env);
}

async function deleteItem(request, env) {
  const { site } =
    await getOwnerSite(request, env);

  if (!site)
    return json({
      error: 'لا يوجد موقع'
    }, 404);

  const body =
    await request.json();

  const itemId =
    clean(body.id, 100);

  const result =
    await env.DB
      .prepare(`
        DELETE FROM items
        WHERE id=?
        AND category_id IN (
          SELECT id
          FROM categories
          WHERE site_id=?
        )
      `)
      .bind(itemId, site.id)
      .run();

  if (!result.meta?.changes)
    return json({
      error: 'الصنف غير موجود'
    }, 404);

  return getSite(request, env);
}

async function adminSites(request, env) {
  const user =
    await requireUser(request, env);

  if (user.role !== 'admin')
    return json({
      error: 'غير مصرح'
    }, 403);

  const result =
    await env.DB
      .prepare(`
        SELECT
          s.*,
          u.name AS owner_name,
          u.email AS owner_email,
          u.phone AS owner_phone
        FROM sites s
        JOIN users u
          ON u.id=s.user_id
        ORDER BY s.created_at DESC
      `)
      .all();

  return json({
    sites: (result.results || []).map(site => ({
      ...site,
      dates: subscriptionInfo(site)
    }))
  });
}

async function renew(request, env) {
  const user =
    await requireUser(request, env);

  if (user.role !== 'admin')
    return json({
      error: 'غير مصرح'
    }, 403);

  const body =
    await request.json();

  const siteId =
    clean(body.site_id, 100);

  const site =
    await env.DB
      .prepare(`SELECT * FROM sites WHERE id=?`)
      .bind(siteId)
      .first();

  if (!site)
    return json({
      error: 'الموقع غير موجود'
    }, 404);

  const oldEnd =
    site.subscription_ends_at
      ? new Date(site.subscription_ends_at).getTime()
      : 0;

  const start =
    Math.max(Date.now(), oldEnd);

  const end =
    new Date(
      start + 30 * 86400000
    ).toISOString();

  await env.DB
    .prepare(`
      UPDATE sites
      SET
        subscription_ends_at=?,
        status='active'
      WHERE id=?
    `)
    .bind(end, siteId)
    .run();

  return json({
    ok: true,
    subscription_ends_at: end
  });
}

async function publicMenu(request, env, siteSlug) {
  const site =
    await env.DB
      .prepare(`
        SELECT *
        FROM sites
        WHERE slug=?
      `)
      .bind(clean(siteSlug, 100))
      .first();

  if (!site) {
    return html(`
      <div style="font-family:Arial;text-align:center;padding:80px">
        <h1>المنيو غير موجودة</h1>
      </div>
    `, 404);
  }

  const info =
    subscriptionInfo(site);

  if (info.expired) {
    return html(`
      <div style="font-family:Arial;text-align:center;padding:80px">
        <h1>المنيو غير متاحة حالياً</h1>
        <p>انتهت مدة التجربة أو الاشتراك.</p>
      </div>
    `);
  }

  const categories =
    await env.DB
      .prepare(`
        SELECT *
        FROM categories
        WHERE site_id=?
        ORDER BY sort_order,id
      `)
      .bind(site.id)
      .all();

  const items =
    await env.DB
      .prepare(`
        SELECT i.*
        FROM items i
        JOIN categories c
          ON c.id=i.category_id
        WHERE c.site_id=?
        AND i.available=1
        ORDER BY i.sort_order,i.id
      `)
      .bind(site.id)
      .all();

  return html(menuPage(
    site,
    categories.results || [],
    items.results || []
  ));
}

function base(title, body) {
  return `<!doctype html>
<html lang="ar" dir="rtl">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${escapeHTML(title)}</title>
<style>
*{box-sizing:border-box}
body{
 margin:0;
 font-family:Arial,sans-serif;
 background:#f7f5f1;
 color:#222
}
a{text-decoration:none;color:inherit}
button,input,select,textarea{font:inherit}
.container{
 width:min(1100px,92%);
 margin:auto
}
.top{
 background:#171717;
 color:#fff;
 padding:12px;
 text-align:center
}
.nav{
 background:#fff;
 padding:18px 5%;
 display:flex;
 justify-content:space-between;
 align-items:center;
 border-bottom:1px solid #eee
}
.brand{
 font-size:28px;
 font-weight:900
}
.brand span{color:#b58a4a}
.btn{
 display:inline-block;
 border:0;
 border-radius:12px;
 padding:12px 20px;
 background:#171717;
 color:#fff;
 font-weight:bold;
 cursor:pointer
}
.gold{background:#b58a4a}
.light{
 background:#eee;
 color:#222
}
.hero{
 padding:80px 20px;
 text-align:center;
 background:#fff
}
.hero h1{
 font-size:clamp(38px,7vw,65px);
 margin:10px 0
}
.hero p{
 max-width:700px;
 margin:20px auto 30px;
 line-height:2;
 color:#666
}
.actions{
 display:flex;
 justify-content:center;
 gap:12px;
 flex-wrap:wrap
}
.section{padding:60px 0}
.section h2{text-align:center}
.cards{
 display:grid;
 grid-template-columns:repeat(auto-fit,minmax(180px,1fr));
 gap:15px
}
.card{
 background:#fff;
 padding:22px;
 border-radius:18px;
 border:1px solid #eee;
 margin-bottom:18px
}
.auth{
 min-height:100vh;
 display:grid;
 place-items:center;
 padding:20px
}
.authbox{
 width:min(460px,100%);
 background:#fff;
 padding:30px;
 border-radius:22px;
 box-shadow:0 20px 60px #0002
}
.tabs{
 display:flex;
 gap:5px;
 background:#eee;
 padding:5px;
 border-radius:12px;
 margin:20px 0
}
.tabs button{
 flex:1;
 border:0;
 padding:12px;
 border-radius:9px
}
.tabs .active{
 background:#171717;
 color:#fff
}
.field{margin:12px 0}
.field label{
 display:block;
 margin-bottom:6px;
 font-weight:bold
}
.field input,
.field select,
.field textarea{
 width:100%;
 padding:12px;
 border:1px solid #ddd;
 border-radius:10px
}
.field textarea{
 min-height:90px
}
.msg{
 display:none;
 padding:12px;
 background:#fff0c2;
 border-radius:10px;
 margin-top:12px
}
.dashhead{
 background:#171717;
 color:#fff;
 padding:18px
}
.dashbar{
 display:flex;
 justify-content:space-between;
 align-items:center
}
.hamb{
 border:0;
 background:none;
 color:#fff;
 font-size:28px
}
.side{
 position:fixed;
 top:0;
 right:0;
 bottom:0;
 width:min(330px,90%);
 background:#fff;
 z-index:10;
 padding:25px;
 transform:translateX(110%);
 transition:.25s;
 box-shadow:-10px 0 40px #0002
}
.side.open{transform:translateX(0)}
.side a,.side button{
 display:block;
 width:100%;
 padding:15px;
 border:0;
 background:none;
 text-align:right;
 border-bottom:1px solid #eee
}
.main{padding:30px 0}
.grid{
 display:grid;
 grid-template-columns:repeat(auto-fit,minmax(280px,1fr));
 gap:18px
}
.designs{
 display:grid;
 grid-template-columns:repeat(auto-fit,minmax(140px,1fr));
 gap:10px
}
.design{
 background:#fff;
 border:2px solid #eee;
 border-radius:14px;
 padding:16px;
 text-align:center
}
.design.selected{
 border-color:#b58a4a
}
.item{
 padding:15px 0;
 border-bottom:1px solid #eee
}
.row{
 display:flex;
 gap:8px;
 align-items:center;
 flex-wrap:wrap
}
.small{
 color:#777;
 font-size:13px
}
.public{
 min-height:100vh;
 padding-bottom:60px
}
.publichead{
 text-align:center;
 padding:50px 20px
}
.category{
 width:min(850px,92%);
 margin:20px auto;
 background:#fff;
 padding:20px;
 border-radius:20px
}
.food{
 display:flex;
 gap:15px;
 padding:15px 0;
 border-bottom:1px solid #eee
}
.food img{
 width:90px;
 height:90px;
 object-fit:cover;
 border-radius:12px
}
.foodmain{flex:1}
.price{font-weight:900}
.footer{
 text-align:center;
 color:#777;
 padding:30px
}
@media(max-width:600px){
 .nav a:not(.btn){display:none}
 .hero{padding:55px 15px}
}
</style>
</head>
<body>
${body}
</body>
</html>`;
}

function home() {
  return base(
    'لمسة | LAMSA',
    `
<div class="top">
✨ لمسة — ابنِ موقعك ومنيوك بنفسك
</div>

<header class="nav">
<a class="brand" href="/">
لم<span>س</span>ة
</a>

<div>
<a class="btn light" href="/auth">
تسجيل الدخول
</a>
</div>
</header>

<section class="hero">
<div class="container">

<div class="small">
للمطاعم والكافيهات
</div>

<h1>
ابني موقعك بنفسك<br>
وابني المنيو بنفسك
</h1>

<p>
أنشئ موقعك ومنيوك الرقمية بنفسك،
وعدّل الأسعار والأصناف والصور في أي وقت.
</p>

<div class="actions">
<a class="btn gold" href="/auth">
ابدأ الآن
</a>

<a class="btn" href="/auth">
أنشئ موقعك
</a>
</div>

</div>
</section>

<section class="section">
<div class="container">
<h2>لماذا لمسة؟</h2>

<div class="cards">

<div class="card">
<h3>🌐 موقع احترافي</h3>
<p>
أنشئ صفحة خاصة بمطعمك أو الكافيه.
</p>
</div>

<div class="card">
<h3>📋 منيو رقمية</h3>
<p>
أضف الأقسام والأصناف والأسعار والصور.
</p>
</div>

<div class="card">
<h3>📱 رابط خاص</h3>
<p>
رابط ثابت لمنيو مطعمك يمكن مشاركته.
</p>
</div>

<div class="card">
<h3>📲 QR</h3>
<p>
الرابط مناسب للاستخدام مع QR والطباعة.
</p>
</div>

</div>
</div>
</section>

<section class="section">
<div class="container">
<h2>ابدأ مجاناً</h2>

<p style="text-align:center">
30 يوم تجربة مجانية.
</p>

<div style="text-align:center">
<a class="btn gold" href="/auth">
إنشاء حساب
</a>
</div>

</div>
</section>

<div class="footer">
© ${new Date().getFullYear()} لمسة LAMSA
</div>
`
  );
}

function authPage() {
  return base(
    'تسجيل الدخول | لمسة',
    `
<div class="auth">

<div class="authbox">

<div style="text-align:center">
<div class="brand">
لم<span>س</span>ة
</div>

<p class="small">
تسجيل الدخول أو إنشاء حساب جديد
</p>
</div>

<div class="tabs">

<button id="loginTab"
class="active"
onclick="showTab('login')">
تسجيل الدخول
</button>

<button id="registerTab"
onclick="showTab('register')">
إنشاء حساب
</button>

</div>

<div id="loginForm">

<div class="field">
<label>
البريد الإلكتروني أو رقم الهاتف
</label>
<input id="loginIdentity">
</div>

<div class="field">
<label>كلمة المرور</label>
<input id="loginPassword" type="password">
</div>

<button class="btn gold"
style="width:100%"
onclick="doLogin()">
تسجيل الدخول
</button>

</div>

<div id="registerForm" style="display:none">

<div class="field">
<label>الاسم</label>
<input id="regName">
</div>

<div class="field">
<label>البريد الإلكتروني</label>
<input id="regEmail" type="email">
</div>

<div class="field">
<label>رقم الهاتف</label>
<input id="regPhone">
</div>

<div class="field">
<label>كلمة المرور</label>
<input id="regPassword" type="password">
</div>

<button class="btn gold"
style="width:100%"
onclick="doRegister()">
إنشاء الحساب
</button>

</div>

<div id="msg" class="msg"></div>

<p style="text-align:center;margin-top:20px">
<a href="/">العودة للرئيسية</a>
</p>

</div>
</div>

<script>
function showTab(type){

 loginForm.style.display =
   type==='login' ? 'block' : 'none';

 registerForm.style.display =
   type==='register' ? 'block' : 'none';

 loginTab.classList.toggle(
   'active',
   type==='login'
 );

 registerTab.classList.toggle(
   'active',
   type==='register'
 );

 msg.style.display='none';
}

function showError(text){
 msg.textContent=text;
 msg.style.display='block';
}

async function send(url,data){

 const response=await fetch(url,{
   method:'POST',
   headers:{
     'Content-Type':'application/json'
   },
   body:JSON.stringify(data)
 });

 const result=await response.json();

 if(!response.ok){
   throw new Error(
     result.error || 'حدث خطأ'
   );
 }

 return result;
}

async function doLogin(){

 try{

   await send('/api/login',{
     identity:loginIdentity.value,
     password:loginPassword.value
   });

   location.href='/dashboard';

 }catch(error){

   showError(error.message);

 }
}

async function doRegister(){

 try{

   await send('/api/register',{
     name:regName.value,
     email:regEmail.value,
     phone:regPhone.value,
     password:regPassword.value
   });

   location.href='/dashboard';

 }catch(error){

   showError(error.message);

 }
}
</script>
`
  );
}

function dashboardPage() {
  return base(
    'لوحة التحكم | لمسة',
    `
<div id="app"></div>

<script>
let state=null;

async function api(url,options={}){

 const response=await fetch(url,{
   ...options,
   headers:{
     'Content-Type':'application/json',
     ...(options.headers||{})
   }
 });

 const result=await response.json();

 if(!response.ok){
   throw new Error(
     result.error ||
     result.detail ||
     'حدث خطأ'
   );
 }

 return result;
}

function esc(v){
 return String(v??'')
 .replace(/[&<>"']/g,c=>({
   '&':'&amp;',
   '<':'&lt;',
   '>':'&gt;',
   '"':'&quot;',
   "'":'&#39;'
 }[c]));
}

function money(v){
 return Number(v||0)
 .toLocaleString('ar-EG',{
   maximumFractionDigits:2
 });
}

async function load(){

 try{

   state=await api('/api/site');

   render();

 }catch(error){

   document.getElementById('app').innerHTML=
   '<div class="container" style="padding-top:50px">'+
   '<div class="card">'+
   '<h2>حدث خطأ</h2>'+
   '<p>'+esc(error.message)+'</p>'+
   '</div></div>';

 }

}

function layout(content){

 return \`
 <header class="dashhead">

   <div class="container dashbar">

     <div>
       <b>لمسة</b>
       <div class="small" style="color:#ccc">
         لوحة التحكم
       </div>
     </div>

     <button class="hamb"
       onclick="openMenu()">
       ☰
     </button>

   </div>

 </header>

 <div id="shade"
 style="
 display:none;
 position:fixed;
 inset:0;
 background:#0006;
 z-index:9"
 onclick="closeMenu()">
 </div>

 <aside id="side" class="side">

   <div class="row"
   style="justify-content:space-between">

     <b>القائمة</b>

     <button onclick="closeMenu()">
       ×
     </button>

   </div>

   <a href="#" onclick="dashboard();closeMenu()">
     🏠 لوحة التحكم
   </a>

   <a href="#" onclick="siteData();closeMenu()">
     📋 البيانات
   </a>

   <a href="#" onclick="menuBuilder();closeMenu()">
     🍽️ إدارة المنيو
   </a>

   <a href="#" onclick="designs();closeMenu()">
     🎨 التصميم
   </a>

   <a href="#" onclick="support();closeMenu()">
     🆘 الدعم
   </a>

   ${
     state.user.role==='admin'
       ? '<a href="#" onclick="adminPanel();closeMenu()">🛡️ الإدارة</a>'
       : ''
   }

   <button onclick="logout()">
     🚪 تسجيل الخروج
   </button>

 </aside>

 <main class="main">
   <div class="container">
     ${content}
   </div>
 </main>
 \`;
}

function render(){

 if(!state.user){

   document.getElementById('app').innerHTML=`
   <div class="auth">
   <div class="authbox" style="text-align:center">
   <h2>يجب تسجيل الدخول</h2>
   <a class="btn gold" href="/auth">
   تسجيل الدخول / إنشاء حساب
   </a>
   </div>
   </div>`;

   return;
 }

 if(!state.site){

   document.getElementById('app').innerHTML=`
   <div class="main">
   <div class="container">

   <div class="card">

   <h1>
   أهلاً ${esc(state.user.name)}
   </h1>

   <p>
   ابدأ بإنشاء موقع مطعمك أو الكافيه.
   </p>

   <div class="field">
   <label>اسم المطعم أو الكافيه</label>
   <input id="newSiteName"
   placeholder="مثال: مطعم لمسة">
   </div>

   <div class="field">
   <label>نوع النشاط</label>

   <select id="newSiteType">
   <option value="restaurant">
   مطعم
   </option>

   <option value="cafe">
   كافيه
   </option>
   </select>

   </div>

   <button class="btn gold"
   onclick="createSite()">
   إنشاء الموقع
   </button>

   <div id="err" class="msg"></div>

   </div>

   </div>
   </div>`;

   return;
 }

 dashboard();
}

function dashboard(){

 const site=state.site;
 const d=state.dates;

 document.getElementById('app').innerHTML=
 layout(`

 <div class="grid">

 <div class="card">

 <div class="small">
 موقعك
 </div>

 <h1>
 ${esc(site.name)}
 </h1>

 <p>
 ${site.type==='cafe'?'كافيه':'مطعم'}
 </p>

 <div class="row">

 <a class="btn gold"
 target="_blank"
 href="/m/${encodeURIComponent(site.slug)}">
 مشاهدة المنيو
 </a>

 <button class="btn light"
 onclick="menuBuilder()">
 إدارة المنيو
 </button>

 </div>

 </div>

 <div class="card">

 <div class="small">
 الاشتراك
 </div>

 <h2>
 ${d.subscribed?'اشتراك نشط':'تجربة مجانية'}
 </h2>

 <p>
 متبقي
 <b>${d.days}</b>
 يوم
 </p>

 </div>

 </div>

 <div class="card">

 <h2>
 تصميم الموقع
 </h2>

 <p>
 ${d.trial
   ? 'متاح لك حالياً أول 5 تصميمات أثناء التجربة.'
   : 'جميع التصميمات متاحة.'}
 </p>

 <button class="btn gold"
 onclick="designs()">
 اختيار التصميم
 </button>

 </div>

 `);
}

function siteData(){

 const s=state.site;

 document.getElementById('app').innerHTML=
 layout(`

 <div class="card">

 <h2>
 بيانات المطعم / الكافيه
 </h2>

 <div class="field">
 <label>اسم النشاط</label>
 <input id="sn"
 value="${esc(s.name)}">
 </div>

 <div class="field">
 <label>النوع</label>

 <select id="st">

 <option value="restaurant"
 ${s.type==='restaurant'?'selected':''}>
 مطعم
 </option>

 <option value="cafe"
 ${s.type==='cafe'?'selected':''}>
 كافيه
 </option>

 </select>

 </div>

 <div class="field">
 <label>رقم الهاتف</label>
 <input id="sp"
 value="${esc(s.phone||'')}">
 </div>

 <div class="field">
 <label>العنوان</label>
 <textarea id="sa">${esc(s.address||'')}</textarea>
 </div>

 <div class="field">
 <label>مواعيد العمل</label>
 <textarea id="sh">${esc(s.hours||'')}</textarea>
 </div>

 <div class="field">
 <label>رابط الشعار</label>
 <input id="sl"
 value="${esc(s.logo_url||'')}">
 </div>

 <button class="btn gold"
 onclick="saveSite()">
 حفظ البيانات
 </button>

 <div id="err" class="msg"></div>

 </div>

 `);
}

function menuBuilder(){

 const cats=state.categories||[];
 const items=state.items||[];

 document.getElementById('app').innerHTML=
 layout(`

 <div class="card">

 <h2>
 إدارة المنيو
 </h2>

 <p class="small">
 يمكنك إضافة الأقسام والأصناف وتعديل الأسعار والوصف والصور.
 </p>

 <h3>
 إضافة قسم
 </h3>

 <div class="row">

 <input id="catName"
 placeholder="مثال: المشروبات"
 style="flex:1;padding:12px;border:1px solid #ddd;border-radius:10px">

 <button class="btn gold"
 onclick="addCategory()">
 إضافة
 </button>

 </div>

 </div>

 <div class="card">

 <h3>
 إضافة صنف
 </h3>

 ${
   cats.length
   ? `

 <div class="field">

 <label>القسم</label>

 <select id="itemCategory">

 ${
 cats.map(c=>`
 <option value="${c.id}">
 ${esc(c.name)}
 </option>
 `).join('')

 }

 </select>

 </div>

 <div class="field">
 <label>اسم الصنف</label>
 <input id="itemName">
 </div>

 <div class="field">
 <label>السعر</label>
 <input id="itemPrice"
 type="number"
 min="0"
 step="0.01">
 </div>

 <div class="field">
 <label>الوصف</label>
 <textarea id="itemDescription"></textarea>
 </div>

 <div class="field">
 <label>رابط الصورة</label>
 <input id="itemImage">
 </div>

 <button class="btn gold"
 onclick="addItem()">
 إضافة الصنف
 </button>

 `
   : '<p>أضف قسم أولاً.</p>'
 }

 </div>

 <div class="card">

 <h3>
 الأصناف الحالية
 </h3>

 ${
 cats.map(c=>{

   const list=
   items.filter(
     i=>i.category_id===c.id
   );

   return `

   <div style="margin-top:25px">

   <div class="row"
   style="justify-content:space-between">

   <h3>
   ${esc(c.name)}
   </h3>

   <button class="btn"
   style="background:#b42318"
   onclick="deleteCategory('${c.id}')">
   حذف القسم
   </button>

   </div>

   ${
     list.length
     ? list.map(i=>`

       <div class="item">

       <div class="row"
       style="justify-content:space-between">

       <div>

       <b>
       ${esc(i.name)}
       </b>

       <div class="price">
       ${money(i.price)} ج.م
       </div>

       <div class="small">
       ${esc(i.description||'')}
       </div>

       </div>

       <div class="row">

       <button class="btn light"
       onclick="editItem('${i.id}')">
       تعديل
       </button>

       <button class="btn"
       style="background:#b42318"
       onclick="deleteItem('${i.id}')">
       حذف
       </button>

       </div>

       </div>

       </div>

     `).join('')
     : '<p class="small">لا توجد أصناف.</p>'
   }

   </div>
   `;

 }).join('')
 }

 </div>

 `);
}

function editItem(itemId){

 const item=
 state.items.find(
   i=>i.id===itemId
 );

 const cats=
 state.categories||[];

 document.getElementById('app').innerHTML=
 layout(`

 <div class="card">

 <h2>
 تعديل الصنف
 </h2>

 <div class="field">
 <label>القسم</label>

 <select id="editCategory">

 ${
 cats.map(c=>`
 <option
 value="${c.id}"
 ${c.id===item.category_id?'selected':''}>
 ${esc(c.name)}
 </option>
 `).join('')
 }

 </select>

 </div>

 <div class="field">
 <label>اسم الصنف</label>
 <input id="editName"
 value="${esc(item.name)}">
 </div>

 <div class="field">
 <label>السعر</label>
 <input id="editPrice"
 type="number"
 min="0"
 step="0.01"
 value="${Number(item.price)}">
 </div>

 <div class="field">
 <label>الوصف</label>
 <textarea id="editDescription">${esc(item.description||'')}</textarea>
 </div>

 <div class="field">
 <label>رابط الصورة</label>
 <input id="editImage"
 value="${esc(item.image_url||'')}">
 </div>

 <label>
 <input id="editAvailable"
 type="checkbox"
 ${item.available?'checked':''}>
 متاح للطلب
 </label>

 <div class="row"
 style="margin-top:20px">

 <button class="btn gold"
 onclick="saveItem('${item.id}')">
 حفظ
 </button>

 <button class="btn light"
 onclick="menuBuilder()">
 إلغاء
 </button>

 </div>

 </div>

 `);
}

function designs(){

 const d=state.dates;
 const current=state.site.design_id;

 const available=
 d.trial
 ? state.designs.slice(0,5)
 : state.designs;

 document.getElementById('app').innerHTML=
 layout(`

 <div class="card">

 <h2>
 تصميم الموقع
 </h2>

 <p>
 ${
 d.trial
 ? 'أول 5 تصميمات متاحة في التجربة.'
 : 'كل التصميمات متاحة مع الاشتراك.'
 }
 </p>

 <div class="designs">

 ${
 state.designs.map((design,index)=>{

   const unlocked=
     available.some(
       d=>d.id===design.id
     );

   return `

   <button
   class="design ${current===design.id?'selected':''}"
   ${unlocked
     ? `onclick="selectDesign('${design.id}')"`
     : 'disabled'}
   >

   <b>
   ${esc(design.name)}
   </b>

   <div class="small">
   ${esc(design.tone)}
   </div>

   ${
     unlocked
     ? ''
     : '<div class="small">🔒</div>'
   }

   </button>

   `;

 }).join('')

 }

 </div>

 </div>

 `);
}

async function selectDesign(id){

 try{

   await api('/api/site',{
     method:'PUT',
     body:JSON.stringify({
       design_id:id
     })
   });

   await load();
   designs();

 }catch(error){

   alert(error.message);

 }
}

function support(){

 document.getElementById('app').innerHTML=
 layout(`

 <div class="card"
 style="text-align:center">

 <h2>
 الدعم
 </h2>

 <p>
 لو محتاج مساعدة في الموقع أو المنيو تواصل معنا.
 </p>

 <a class="btn gold"
 href="tel:${SUPPORT_PHONE}">
 📞 ${SUPPORT_PHONE}
 </a>

 </div>

 `);
}

async function adminPanel(){

 try{

   const result=
   await api('/api/admin/sites');

   document.getElementById('app').innerHTML=
   layout(`

   <div class="card">

   <h2>
   إدارة المنصة
   </h2>

   ${
     result.sites.map(site=>`

       <div class="item">

       <b>
       ${esc(site.name)}
       </b>

       <div class="small">
       صاحب الموقع:
       ${esc(site.owner_name)}
       </div>

       <p>
       ${
         site.dates.subscribed
         ? 'اشتراك نشط'
         : 'تجربة مجانية'
       }
       </p>

       <p>
       متبقي:
       ${site.dates.days}
       يوم
       </p>

       <button class="btn gold"
       onclick="renew('${site.id}')">
       تجديد 30 يوم
       </button>

       </div>

     `).join('')
   }

   </div>

   `);

 }catch(error){

   alert(error.message);

 }

}

async function createSite(){

 try{

   await api('/api/site',{
     method:'POST',
     body:JSON.stringify({
       name:newSiteName.value,
       type:newSiteType.value
     })
   });

   await load();

 }catch(error){

   err.textContent=error.message;
   err.style.display='block';

 }

}

async function saveSite(){

 try{

   await api('/api/site',{
     method:'PUT',
     body:JSON.stringify({
       name:sn.value,
       type:st.value,
       phone:sp.value,
       address:sa.value,
       hours:sh.value,
       logo_url:sl.value
     })
   });

   await load();
   siteData();

 }catch(error){

   err.textContent=error.message;
   err.style.display='block';

 }

}

async function addCategory(){

 try{

   await api('/api/categories',{
     method:'POST',
     body:JSON.stringify({
       name:catName.value
     })
   });

   await load();
   menuBuilder();

 }catch(error){

   alert(error.message);

 }

}

async function deleteCategory(id){

 if(!confirm(
   'حذف القسم وكل الأصناف الموجودة داخله؟'
 )) return;

 try{

   await api('/api/categories',{
     method:'DELETE',
     body:JSON.stringify({id})
   });

   await load();
   menuBuilder();

 }catch(error){

   alert(error.message);

 }

}

async function addItem(){

 try{

   await api('/api/items',{
     method:'POST',
     body:JSON.stringify({
       category_id:itemCategory.value,
       name:itemName.value,
       price:itemPrice.value,
       description:itemDescription.value,
       image_url:itemImage.value
     })
   });

   await load();
   menuBuilder();

 }catch(error){

   alert(error.message);

 }

}

async function saveItem(id){

 try{

   await api('/api/items',{
     method:'PUT',
     body:JSON.stringify({
       id,
       category_id:editCategory.value,
       name:editName.value,
       price:editPrice.value,
       description:editDescription.value,
       image_url:editImage.value,
       available:editAvailable.checked
     })
   });

   await load();
   menuBuilder();

 }catch(error){

   alert(error.message);

 }

}

async function deleteItem(id){

 if(!confirm('حذف الصنف؟')) return;

 try{

   await api('/api/items',{
     method:'DELETE',
     body:JSON.stringify({id})
   });

   await load();
   menuBuilder();

 }catch(error){

   alert(error.message);

 }

}

async function renew(siteId){

 try{

   await api('/api/admin/renew',{
     method:'POST',
     body:JSON.stringify({
       site_id:siteId
     })
   });

   alert('تم تجديد الموقع لمدة 30 يوم');

   adminPanel();

 }catch(error){

   alert(error.message);

 }

}

async function logout(){

 await api('/api/logout',{
   method:'POST'
 });

 location.href='/auth';

}

function openMenu(){

 side.classList.add('open');
 shade.style.display='block';

}

function closeMenu(){

 side.classList.remove('open');
 shade.style.display='none';

}

window.dashboard=dashboard;
window.siteData=siteData;
window.menuBuilder=menuBuilder;
window.editItem=editItem;
window.designs=designs;
window.selectDesign=selectDesign;
window.support=support;
window.adminPanel=adminPanel;
window.createSite=createSite;
window.saveSite=saveSite;
window.addCategory=addCategory;
window.deleteCategory=deleteCategory;
window.addItem=addItem;
window.saveItem=saveItem;
window.deleteItem=deleteItem;
window.renew=renew;
window.logout=logout;
window.openMenu=openMenu;
window.closeMenu=closeMenu;

load();
</script>
`
  );
}

function menuPage(site, categories, items) {

  const sections =
    categories.map(category => {

      const categoryItems =
        items.filter(
          item =>
            item.category_id === category.id
        );

      return `
<section class="category">

<h2>
${escapeHTML(category.name)}
</h2>

${
 categoryItems.length
 ? categoryItems.map(item => `

 <div class="food">

 ${
   item.image_url
   ? `
   <img
   src="${escapeHTML(item.image_url)}"
   alt="${escapeHTML(item.name)}">
   `
   : ''
 }

 <div class="foodmain">

 <div class="row"
 style="justify-content:space-between">

 <b>
 ${escapeHTML(item.name)}
 </b>

 <span class="price">
 ${Number(item.price || 0)
   .toLocaleString('ar-EG')}
 ج.م
 </span>

 </div>

 <div class="small">
 ${escapeHTML(item.description || '')}
 </div>

 </div>

 </div>

 `).join('')
 : '<p class="small">لا توجد أصناف حالياً.</p>'
}

</section>
`;

    }).join('');

  return base(
    site.name,
    `
<div class="public">

<div class="publichead">

<div class="brand">
لم<span>س</span>ة
</div>

${
 site.logo_url
 ? `
 <img
 src="${escapeHTML(site.logo_url)}"
 style="
 width:90px;
 height:90px;
 object-fit:cover;
 border-radius:50%;
 margin:15px">
 `
 : ''
}

<h1>
${escapeHTML(site.name)}
</h1>

<p>
${escapeHTML(site.address || '')}
</p>

<p class="small">
${escapeHTML(site.hours || '')}
</p>

</div>

${sections}

<div class="footer">
Powered by لمسة
</div>

</div>
`
  );
}
