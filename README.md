# LAMSA | لمسة

Cloudflare Worker + D1 foundation for restaurant/cafe websites and digital menus.

Included:
- Arabic RTL responsive landing page
- 60 design presets
- Email/phone unique registration
- PBKDF2 password hashing
- Cookie sessions
- Owner dashboard
- Restaurant/cafe site creation
- Owner-only editing
- Categories and menu items
- Public site URLs
- 30-day trial logic
- Subscription expiry gate
- QR-ready stable public URLs (generate QR in a later UI step)
- D1 schema

Important: replace `REPLACE_WITH_LAMSA_DB_ID` in `wrangler.jsonc` with the real D1 database ID before using Wrangler to manage the binding. If the Worker already has a dashboard binding named `DB`, keep that binding in Cloudflare.

The support phone is currently a placeholder in `worker.js` (`APP.supportPhone`) and should be changed to the platform owner's real contact number before production.
