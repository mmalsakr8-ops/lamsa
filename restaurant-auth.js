import { currentUser } from './auth.js';
import { json } from './utils.js';

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


export { requireUser, getRestaurantByUser, uniqueSlug };
