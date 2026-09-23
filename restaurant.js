import { json } from './utils.js';
import { requireUser, getRestaurantByUser, uniqueSlug } from './restaurant-auth.js';

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


export { getRestaurant, updateRestaurant };
