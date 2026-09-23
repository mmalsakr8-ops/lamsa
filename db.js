// Database schema and migrations extracted unchanged from worker(9).js

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




export { initDB, ensureRestaurantColumn };
