# AGENTS.md

## Cursor Cloud specific instructions

Choosify.bd is a **frontend-only** Vite + React 19 + TypeScript SPA/PWA (verified brand & product
discovery plus a retail cart/checkout flow). There is **no backend, database, or server code in this
repo**; all catalog data comes from local static/mock data (`src/constants.ts`, `src/data/*`) and app
state is persisted to the browser's `localStorage`.

Standard commands live in `package.json` (`dev`, `build`, `preview`, `lint`). Notable points:

- **Dev server:** `npm run dev` serves on port **3000** bound to `0.0.0.0` (see the `dev` script).
- **Lint = typecheck only:** `npm run lint` runs `tsc --noEmit` (no ESLint). There is **no test
  framework or test script** in this repo.
- **Optional backend is not required.** `VITE_API_BASE_URL` (see `.env.example`) points the optional
  catalog sync at an external API and defaults to `http://localhost:3000/api/v1`, which collides with
  the dev server's own port. When that API is unreachable the app logs a warning and silently falls
  back to static mock data, so the app is fully testable end to end with no `.env.local` and no
  backend running.
- **Checkout requires a "login", but it is client-side only** — any email/password is accepted and
  stored in `localStorage`; there is no real auth backend.
- **Order success has no confirmation page.** Placing an order clears the cart and shows a toast, then
  returns to the homepage; treat a cleared cart + success toast as the completed order.
