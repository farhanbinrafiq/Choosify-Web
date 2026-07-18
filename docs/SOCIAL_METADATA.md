# Social metadata & Open Graph (Choosify)

Choosify is a **Vite + React SPA**, not Next.js. The Next.js App Router Metadata API and `next/og` ImageResponse are not available in this repo. This project implements the production-equivalent stack for Vercel:

## Architecture

1. **`index.html`** — Global default `<title>`, description, Open Graph, Twitter Card, theme-color, icons, and canonical. Used for first paint and as a fallback.
2. **`src/components/PageSeo.tsx`** — Client-side per-route metadata (title, OG, Twitter, canonical, robots, JSON-LD) for in-app navigation.
3. **`api/og.jsx`** — Vercel Edge function using `@vercel/og` `ImageResponse` to generate **1200×630** branded cards (products, brands, categories, deals, articles, creators).
4. **`api/share.js`** — Server-rendered HTML with complete social meta for crawlers that do not execute SPA JavaScript.
5. **`middleware.js`** — Detects Facebook, LinkedIn, X/Twitter, WhatsApp, Slack, Discord, Telegram, etc., and rewrites them to `/api/share`.
6. **`lib/seoShared.ts`** — Shared constants (`SITE_URL`, theme color, OG size, `buildOgImageUrl`, crawler UA pattern).
7. **`public/og/default.png`** — Static default share image (also used when Edge OG is cold or blocked).

## Important limitation (SPA)

Client-updated meta tags alone **fail** Facebook Sharing Debugger / LinkedIn Post Inspector for many URLs. The **middleware + `/api/share`** path is required so bots receive HTML with `og:*` tags without running React.

## Replacing the default OG image

1. Export a **1200×630** PNG branded asset.
2. Replace `public/og/default.png`.
3. Optionally update `DEFAULT_OG_IMAGE_PATH` in `lib/seoShared.ts` if you change the filename.
4. Bump cache-busting query params on OG tags in `index.html` if CDNs cache aggressively.
5. Re-run validators (Facebook / LinkedIn / X) after deploy.

To regenerate the current programmatic default:

```bash
node scripts/generate-og-assets.mjs
```

## Dynamic OG URL pattern

```
https://www.choosify.bd/api/og?title=...&description=...&type=product&image=...&brand=...
```

Types: `default` | `product` | `brand` | `category` | `deal` | `article` | `creator`

## Icons

| Asset | Path |
|-------|------|
| Favicon ICO | `/favicon.ico` |
| Favicon SVG | `/favicon.svg` |
| 16×16 | `/favicon-16x16.png` |
| 32×32 | `/favicon-32x32.png` |
| Apple Touch | `/apple-touch-icon.png` |
| Android / PWA | `/icons/icon-*.png` + VitePWA manifest |

## Validation checklist (post-deploy)

1. [Facebook Sharing Debugger](https://developers.facebook.com/tools/debug/) — scrape homepage, a product, a brand.
2. [LinkedIn Post Inspector](https://www.linkedin.com/post-inspector/) — same URLs.
3. [Twitter Card Validator](https://cards-dev.twitter.com/validator) (or open a tweet compose preview).
4. Confirm `/api/og?...` returns a PNG and `/api/share?path=/products/...` returns HTML with `og:image`.

## Files touched

- Modified: `index.html`, `vercel.json`, `lib/seoShared.ts`, `src/lib/seoConfig.ts`, `src/lib/seoHelpers.ts`, `src/components/PageSeo.tsx`, `middleware.ts` (new), `api/og.tsx` (new), `api/share.ts` (new), `scripts/generate-og-assets.mjs` (new), `public/og/default.png`, favicon assets, `docs/SOCIAL_METADATA.md` (this file).
