import { initDB } from './db.js';
import { corsHeaders, json, html } from './utils.js';
import { register, login, logout, me } from './auth.js';
import { getRestaurant, updateRestaurant } from './restaurant.js';
import { getCategories, createCategory, deleteCategory } from './categories.js';
import { getItems, createItem, updateItem, deleteItem } from './items.js';
import { publicMenu } from './public-menu.js';
import { homePage } from './pages/home.js';
import { authPage } from './pages/auth.js';
import { dashboardPage } from './pages/dashboard.js';

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

      if (path === "/api/register" && request.method === "POST") return register(request, env);
      if (path === "/api/login" && request.method === "POST") return login(request, env);
      if (path === "/api/logout" && request.method === "POST") return logout(request, env);
      if (path === "/api/me" && request.method === "GET") return me(request, env);
      if (path === "/api/restaurant" && request.method === "GET") return getRestaurant(request, env);
      if (path === "/api/restaurant" && request.method === "PUT") return updateRestaurant(request, env);
      if (path === "/api/categories" && request.method === "GET") return getCategories(request, env);
      if (path === "/api/categories" && request.method === "POST") return createCategory(request, env);
      if (path.startsWith("/api/categories/") && request.method === "DELETE") return deleteCategory(request, env);
      if (path === "/api/items" && request.method === "GET") return getItems(request, env);
      if (path === "/api/items" && request.method === "POST") return createItem(request, env);
      if (path.startsWith("/api/items/") && request.method === "PUT") return updateItem(request, env);
      if (path.startsWith("/api/items/") && request.method === "DELETE") return deleteItem(request, env);
      if (path.startsWith("/menu/")) return publicMenu(request, env);
      if (path === "/login" || path === "/register" || path === "/auth") return html(authPage());
      if (path === "/dashboard") return html(dashboardPage());

      return html(homePage());
    } catch (error) {
      return json({ ok: false, error: "حدث خطأ في النظام", detail: error.message }, 500);
    }
  }
};
