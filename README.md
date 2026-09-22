# LAMSA | لمسة — ready build

Cloudflare Worker + D1 package for restaurant/café digital sites and menus.

## Included
- Login, registration and logout.
- One account per normalized email/phone.
- PBKDF2 password hashing and HttpOnly cookie sessions.
- Restaurant/café site creation and owner-only editing.
- Categories and menu items with prices/descriptions/images.
- 60 design presets; the full design library unlocks after renewal.
- 30-day free trial.
- Warning on the owner dashboard during the last 7 days.
- Public menu becomes unavailable after expiry.
- Admin activation/reactivation button with 30/365-day renewal.
- Stable public menu URL with QR-ready URL.
- Print/PDF-ready menu view: public customers cannot edit the menu.
- Arabic RTL responsive interface.

## Cloudflare
The D1 database ID is already set to:
`10c497dd-e35c-4797-8b3d-acbc6b52012e`

The Worker binding is `DB` and database name is `lamsa-db`.

### First admin
For the initial private setup, the first account can claim platform admin status from the dashboard if no admin exists. After the owner account is established, do not expose the claim route in a production-hardening pass.

## Important PDF note
The public menu has a dedicated print layout and a "تحميل/طباعة PDF" action. On iPhone, Safari's print sheet can save that rendered menu as a PDF. This keeps the menu read-only to customers and avoids editable form controls on the public page.
