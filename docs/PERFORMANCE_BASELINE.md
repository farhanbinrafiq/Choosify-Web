# LE-003 — Performance Baseline

**Date:** 2026-07-09  
**Scope:** Choosify-Web storefront  
**Status:** Post LE-003 (uncommitted — awaiting review)

---

## Build Metrics (Production)

| Metric | LE-002 (pre LE-003) | LE-003 (after) | Change |
|--------|---------------------|----------------|--------|
| Main `index` chunk | 680.53 kB (208.04 kB gzip) | **295.23 kB (84.61 kB gzip)** | **−57% raw / −59% gzip** |
| `categoryDisplay` chunk | 15.58 kB (5.66 kB gzip) | 12.02 kB (4.58 kB gzip) | −23% raw |
| PWA precache entries | 138 (1998 KiB) | 106 (1998 KiB) | Fewer entry files, similar total |
| Largest route chunk | BrandDetailPage 118 kB | BrandDetailPage 116 kB | ~stable |

---

## Largest Chunks (Post LE-003)

| Chunk | Size (gzip) | Role |
|-------|-------------|------|
| `index` | 84.61 kB | App shell, contexts, router bootstrap |
| `vendor-react` | 60.55 kB | React + ReactDOM |
| `vendor-motion` | 42.02 kB | Motion library |
| `vendor-router` | 13.74 kB | React Router |
| `vendor-lucide` | 11.92 kB | Shared Lucide icons |
| `CompareEngine` | 14.84 kB | Compare matrix (lazy) |
| `BrandDetailPage` | 26.16 kB | Brand profile route |
| `mockProducts` | 2.12 kB | Legacy catalog fallback (async) |

---

## Core Web Vitals Estimate

| Metric | Before | After (est.) | Notes |
|--------|--------|--------------|-------|
| **LCP** | Moderate risk (208 kB main parse) | Improved | ~124 kB less JS to parse on first load |
| **INP** | Moderate | Slightly improved | `ProductCard` memo reduces list re-renders |
| **CLS** | Low | Unchanged | No layout changes |
| **TBT** | High on mobile | Reduced | Vendor split + smaller main chunk |
| **TTFB** | Unchanged | Unchanged | No backend changes |

---

## Lighthouse Estimate

| Category | Before (est.) | After (est.) |
|----------|---------------|--------------|
| Performance | 55–65 | **65–75** |
| Accessibility | Unchanged | Unchanged |
| Best Practices | Unchanged | Unchanged |
| SEO | Unchanged | Unchanged |

*Run Lighthouse on `/`, `/products`, `/brands/:id` for confirmed scores.*

---

## Tooling

- `npm run build` — PASS
- `npm run lint` (`tsc --noEmit`) — PASS (0 errors)
- Dev instrumentation: `src/utils/performanceDev.ts` (console only, no telemetry)
