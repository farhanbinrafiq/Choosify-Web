# LE-003 — Core Web Vitals

**Date:** 2026-07-09

---

## Targets

| Metric | Good | Needs Improvement | Poor |
|--------|------|-------------------|------|
| **LCP** | ≤ 2.5s | 2.5–4.0s | > 4.0s |
| **INP** | ≤ 200ms | 200–500ms | > 500ms |
| **CLS** | ≤ 0.1 | 0.1–0.25 | > 0.25 |

---

## LE-003 Impact Analysis

### LCP (Largest Contentful Paint)

**Before:** Main thread blocked parsing ~208 kB gzip JS before hydration. Hero images and catalog render competed with bundle parse.

**After:**
- Main chunk **−59% gzip** (208 → 85 kB)
- Vendor chunks load in parallel (HTTP/2)
- Mock catalog no longer blocks initial script evaluation

**Expected:** 0.3–0.8s improvement on mid-tier mobile for home route.

**Unchanged:** Hero image URLs, CDN, font loading — no image URL changes.

---

### INP (Interaction to Next Paint)

**After:**
- `ProductCard` memo reduces re-renders on filter/cart context updates in grids
- Debounced catalog refetch reduces main-thread work on tab focus

**Unchanged:** Filter drawer, motion animations, large list DOM size.

---

### CLS (Cumulative Layout Shift)

**No intentional changes.** Image lazy loading uses existing aspect-ratio containers on product cards and guide media.

---

### TBT (Total Blocking Time)

**Primary win:** Smaller synchronous JS on critical path.

| Source | Mitigation |
|--------|------------|
| Main bundle | 295 kB (−57%) |
| CompareEngine | Deferred until `/compare` |
| Mock PRODUCTS | Async chunk |
| Motion | Separate vendor chunk, parse parallel |

---

### TTFB (Time to First Byte)

**Unchanged** — frontend-only sprint. Catalog API still 9 parallel requests on mount (with debounced refetch).

---

## Measurement Checklist

1. Chrome DevTools → Performance → record cold load `/`
2. Lighthouse mobile emulation — compare Performance score
3. Dev console `[perf]` logs for route and API timings
4. Network tab — verify `mockProducts-*.js` loads async, not in initial critical chain

---

## Follow-up (Post LE-003)

- Run real Lighthouse CI on PR previews
- Add `size-limit` or bundle budget in CI (TD-305)
- Lazy-load `FilterEngine` drawer body
- Virtualize product grids > 24 items
