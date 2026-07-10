# LE-003 — Performance Improvements

**Date:** 2026-07-09  
**Sprint:** LE-003 Performance Engineering

---

## Summary

Storefront JavaScript reduced **~57%** on the main bundle without UI, layout, branding, API, or business logic changes.

---

## Changes by Phase

### Phase 2 — Code Splitting

- **CompareEngine** — lazy loaded from `ComparePage` with `Suspense`
- **EmiChatPanel** — lazy loaded from `EmiPage`
- **InfluencerReviews** — lazy loaded in `BrandDetailPage` (`WithInfluencerReviews`)
- **Guide media cards** — extracted to `components/guide/GuideMediaCards.tsx`; `HomePage` lazy loads `HomeGuideCarouselCard` (decouples from `GuidesPage`)

### Phase 3 — Large Dataset Optimization

- Split `PRODUCTS`, `BRANDS`, `BLOGS` into `src/data/mockProducts.ts`, `mockBrands.ts`, `mockBlogs.ts`
- `loadMockCatalog.ts` — single async loader with promise cache
- `GlobalStateContext` — dynamic mock hydration via `mockCatalogHydration.ts` (no sync `constants` import)
- `DashboardContext` — removed sync `PRODUCTS`/`BRANDS`; seeds from `loadMockCatalog` when localStorage empty

### Phase 4 — Rendering Optimization

- **ProductCard** — wrapped with `React.memo`
- **BrandCardDesign** — already memoized (LE-002)

### Phase 5 — Images

- Product card carousel images: `loading="lazy"` + `decoding="async"`
- New `OptimizedImage` component for future list/hero tuning (no above-fold behavior change)

### Phase 6 — Network Optimization

- Catalog hydrate: **30s debounce** on window focus refetch
- Interval refetch skips when `document.visibilityState !== 'visible'`
- `perfApiCall` wrapper logs API duration in dev

### Phase 7–8 — Vendors & Dependencies

- Vite `manualChunks` for react, router, motion, lucide
- Identified unused `@google/genai` in dependencies (not removed — out of scope)

### Phase 9 — Instrumentation

- `src/utils/performanceDev.ts` — route transition, API, image timing (dev-only, console)
- `App.tsx` — `perfRouteTransition` on pathname change

---

## Files Added

- `src/data/loadMockCatalog.ts`
- `src/data/mockProducts.ts`, `mockBrands.ts`, `mockBlogs.ts`
- `src/utils/mockCatalogHydration.ts`
- `src/utils/performanceDev.ts`
- `src/components/OptimizedImage.tsx`
- `src/components/guide/GuideMediaCards.tsx`
- `src/components/guide/HomeGuideCarouselCard.tsx`
- `scripts/split-mock-catalog.mjs`, `scripts/extract-guide-cards.mjs`

---

## Performance Risks

| Risk | Mitigation |
|------|------------|
| Brief empty catalog before mock load | API data preferred; mock loads in parallel on mount |
| Dashboard empty seeds until mock loads | Only when localStorage empty; same as cold API |
| Extra Suspense fallbacks | Uses existing `LoadingFallback` — no UX redesign |
| Search brand suggestions empty until context hydrates | `allBrands` populates from API or async mock |

---

## Remaining Technical Debt

- `BrandDetailPage` monolith (~116 kB)
- `FilterEngine` on critical path
- Remove `@google/genai` from storefront deps if unused
- Dynamic `jspdf`/`xlsx` on export actions
- List virtualization for large product grids
