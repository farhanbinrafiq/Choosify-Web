# LE-001 — Performance Audit

**Date:** 2026-07-09  
**Apps:** Choosify-Web (storefront) · choosify-admin-4.0 (admin)

---

## Build Output Summary

### Storefront (`npm run build`)

| Asset | Size | Gzip |
|-------|------|------|
| `index.css` | 203 kB | 29.5 kB |
| `index-*.js` (main) | **688 kB** | **210 kB** |
| `categoryDisplay-*.js` | **815 kB** | **156 kB** |
| `BrandDetailPage-*.js` | 116 kB | 26 kB |
| PWA manifest + SW | ✅ Generated |

**Warning:** Vite reported chunks >500 kB after minification.

### Admin (`npm run build`)

| Asset | Size | Gzip |
|-------|------|------|
| `index.css` | 285 kB | 36 kB |
| `index-*.js` (main) | **1,144 kB** | **315 kB** |
| `CartesianChart-*.js` (Recharts) | 325 kB | 100 kB |
| `UnifiedProfileShell-*.js` | 199 kB | 39 kB |
| `WebsiteCMSStudio-*.js` | 134 kB | 28 kB |
| `Products-*.js` | 129 kB | 36 kB |
| `ProductStudio-*.js` | 121 kB | 25 kB |
| `Messages-*.js` | 121 kB | 30 kB |
| `Orders-*.js` | 103 kB | 21 kB |
| `server.cjs` | 421 kB | — |

---

## Lighthouse / Core Web Vitals (Estimated)

> Formal Lighthouse CI not run in this audit. Findings are static-analysis based.

| Metric | Storefront Risk | Admin Risk | Notes |
|--------|-----------------|------------|-------|
| **LCP** | Medium | Low (auth app) | Large JS before hero paint; optimize main chunk |
| **INP** | Medium | High | Heavy product grids, studio forms without virtualization |
| **CLS** | Low–Medium | Medium | Carousels, lazy images — verify dimensions |
| **TTFB** | Depends on hosting | Depends on API | Express SSR minimal on storefront |

---

## Bundle Analysis (Part 10)

### Dependencies — Storefront

| Package | Concern | Recommendation |
|---------|---------|----------------|
| `lucide-react` | Per-icon chunks created ✅ but many icons | Audit icon imports; use named imports |
| `motion` | Animation library in main path | Lazy load off critical routes |
| `jspdf` | Heavy; export-only | `import()` in export handler |
| `xlsx` | Heavy; export-only | Dynamic import |
| `@google/genai` | **Critical** — server-only? | Verify not bundled client-side |
| `vite-plugin-pwa` | Service worker cache | Review cache strategy for API responses |
| `express` | Server dep | Ensure tree-shaken from client (verify) |

### Dependencies — Admin

| Package | Concern | Recommendation |
|---------|---------|----------------|
| `recharts` | 325 kB chunk | Lazy load on Analytics/CourierAnalytics only |
| `firebase` + `firebase-admin` | Large | Admin-only; verify client bundle scope |
| `socket.io-client` | Persistent connection | Load on Messages route only |
| `react-hook-form` + `zod` | Acceptable | Keep |
| Duplicate `vite` in deps/devDeps | Minor | Clean package.json |

### Duplicate libraries across apps
- `lucide-react`, `motion`, `react-hot-toast`, `clsx`, `tailwind-merge`, `@google/genai`, `express`

**Recommendation:** Shared design-system package or monorepo workspace — do not duplicate API types.

### Tree shaking issues
- **`categoryDisplay-*.js` (815 kB)** — likely large static category map or JSON embedded in `utils/categoryDisplay.ts`. **Investigate immediately.**
- Main `index` bundles context providers + mock data + motion

---

## React Render Performance

### Missing optimizations
| Technique | Storefront | Admin |
|-----------|------------|-------|
| `React.memo` on list items | ❌ | ❌ |
| `useMemo` for filtered lists | Partial | Partial |
| Virtualized lists | ❌ | ❌ |
| Debounced search | Partial (`GlobalSearchBar`) | Varies |
| Context value memoization | Partial | Needed on 18 providers |

### Large render surfaces
1. **HomePage** — multiple carousels, CMS sections, all mount together
2. **BrandDetailPage** — 2,442 lines; tab switches may remount heavy subtrees
3. **CompareEngine** — matrix re-renders on every spec toggle
4. **ProductStudio / WebsiteCMSStudio** — entire form state in one component

### Recommendations
```text
1. React.memo(ProductCard, BrandCardDesign, OrderRow)
2. useDeferredValue for search/filter inputs
3. @tanstack/react-virtual for grids >50 items
4. Split contexts to reduce subscriber count
5. useTransition for tab switches on detail pages
6. manualChunks in vite.config: vendor, charts, export-tools
```

---

## Image Loading

- Product images: verify `loading="lazy"` and explicit `width`/`height`
- `sharp` in devDeps — used at build for logo generation ✅
- OG image via `DEFAULT_OG_IMAGE` in seoConfig
- **Action:** Audit hero banners for oversized source files in `public/`

---

## Caching

### Storefront PWA
- `vite-plugin-pwa` generates SW
- Ensure API routes are **network-first** to avoid stale catalog
- CMS-driven content should invalidate on deploy or version hash

### Admin
- No PWA — relies on browser cache
- Heavy `localStorage` caching can serve stale data offline without user awareness

---

## Code Splitting Assessment

| App | Route splitting | Component splitting | Vendor splitting |
|-----|-----------------|---------------------|------------------|
| Storefront | ✅ Excellent | ❌ Compare/Filter in shared chunks | ❌ Needs manualChunks |
| Admin | ✅ Excellent | ❌ Studios load as single chunk | ❌ Recharts in shared path |

### Suggested `vite.config` manualChunks
```js
manualChunks: {
  'vendor-react': ['react', 'react-dom', 'react-router-dom'],
  'vendor-motion': ['motion'],
  'vendor-charts': ['recharts'],        // admin only
  'vendor-export': ['jspdf', 'xlsx'], // dynamic preferred
}
```

---

## Network / API

- Storefront `catalogApi` — batch requests where possible
- No request deduplication layer
- **TanStack Query** would provide: stale-while-revalidate, dedupe, retry

---

## Performance Test Plan (Post-fix)

1. Run Lighthouse on `/`, `/products`, `/brand/:slug` (mobile + desktop)
2. Webpack/Vite bundle analyzer on both apps
3. React Profiler on HomePage filter interaction
4. Measure LCP element (hero image vs text)
5. Target: main chunk <300 kB gzip, LCP <2.5s on 4G

---

## Priority Actions

| Priority | Action | Impact |
|----------|--------|--------|
| P0 | Investigate 815 kB `categoryDisplay` chunk | High — likely accidental data bundling |
| P0 | Reduce admin 1.1 MB main chunk | High |
| P1 | Dynamic import jspdf, xlsx, recharts | Medium |
| P1 | Virtualize product/order lists | Medium |
| P1 | Memoize card components | Medium |
| P2 | Split GlobalStateContext | Medium |
| P2 | Image CDN + responsive srcset | Medium |
| P3 | Lighthouse CI in GitHub Actions | Ongoing |
