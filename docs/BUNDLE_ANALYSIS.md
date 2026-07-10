# LE-003 — Bundle Analysis

**Date:** 2026-07-09

---

## Phase 1 Findings

### Root cause: monolithic main chunk (LE-002 baseline)

The 680 kB `index` chunk contained:

1. **Mock catalog data** — `PRODUCTS`, `BRANDS`, `BLOGS` imported synchronously in `GlobalStateContext` and `DashboardContext`
2. **Heavy page coupling** — `HomePage` imported `GuidesPage` for `ReelCard` / `HorizontalMediaCard`
3. **Eager heavy widgets** — `CompareEngine`, `EmiChatPanel`, `InfluencerReviews` bundled with route shells
4. **Unsplit vendors** — React, Motion, Router, Lucide in main chunk

### Duplicate / heavy libraries

| Package | Status | Notes |
|---------|--------|-------|
| `lucide-react` | Split to `vendor-lucide` | Curated imports (LE-002) + vendor chunk |
| `motion` | Split to `vendor-motion` | Used globally in App shell |
| `react` / `react-dom` | Split to `vendor-react` | |
| `@google/genai` | **Unused in src** | Dependency debt — not imported |
| `jspdf` / `xlsx` | Not in main path | Route-level only when used |

---

## Applied Splitting Strategy

### Vite `manualChunks` (`vite.config.ts`)

- `vendor-react` — react, react-dom
- `vendor-router` — react-router-dom
- `vendor-motion` — motion
- `vendor-lucide` — lucide-react

### Async data modules

| Module | Chunk | Trigger |
|--------|-------|---------|
| `data/mockProducts.ts` | `mockProducts-*.js` (~5.5 kB) | API fallback / dashboard seeds |
| `data/mockBlogs.ts` | `mockBlogs-*.js` (~3.3 kB) | Guide fallback |
| `data/mockBrands.ts` | Lazy via `loadMockCatalog` | Brand fallback |

### Route / component lazy loading

| Component | Parent | Chunk |
|-----------|--------|-------|
| `CompareEngine` | `ComparePage` | `CompareEngine-*.js` |
| `EmiChatPanel` | `EmiPage` | Bundled with Emi route |
| `InfluencerReviews` | `BrandDetailPage` | `InfluencerReviews-*.js` |
| `HomeGuideCarouselCard` | `HomePage` | `HomeGuideCarouselCard` + `GuideMediaCards` |
| All pages | `App.tsx` | Already lazy (unchanged) |

---

## Route Chunk Sizes (gzip)

| Route | gzip |
|-------|------|
| HomePage | 14.06 kB |
| GuidesPage | 8.51 kB |
| ComparePage shell | 0.54 kB (+ CompareEngine 14.84 kB) |
| SearchPage | 8.25 kB |
| ProductDetailPage | 18.34 kB |
| BrandDetailPage | 26.16 kB |

---

## Remaining Bundle Debt

1. `BrandDetailPage` still ~116 kB raw — monolith; safe split deferred
2. `FilterEngine` in main path via Navbar — shared filter drawer
3. `constants` re-export chain can still pull mock data into **route** chunks that import `PRODUCTS`
4. `@google/genai` in `package.json` — remove when confirmed unused server-side
