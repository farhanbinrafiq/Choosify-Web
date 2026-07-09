# LE-001 / LE-002 — Technical Debt Register

**Date:** 2026-07-09  
**LE-001 Status:** Audit complete  
**LE-002 Status:** Implemented — awaiting ChatGPT review  
**Do not commit** until approved.

---

## LE-002 Resolved (2026-07-09)

| ID | Item | Resolution |
|----|------|------------|
| TD-001 | Storefront TS errors (~40) | **RESOLVED** — canonical `CatalogProduct` via `types/product.ts`; `CommerceProduct` for cart; `allCatalogProducts` in context |
| TD-003 | 815 kB `categoryDisplay` chunk | **RESOLVED** — replaced `import * as LucideIcons` with curated icon map; chunk **816 kB → 15.6 kB** (−98%) |
| TD-204 | Overview dev shell in App.tsx | **RESOLVED** — route and component removed |
| TD-201 (partial) | Storefront admin artifact pages | **RESOLVED** — CmsStudio, Seller orders/cashbook pages and routes removed |
| TD-008 (partial) | Seller routes without guard | **MITIGATED** — seller admin routes removed from storefront (admin owns these in choosify-admin-4.0) |

---

## Debt Summary (post LE-002)

| Severity | Count | Theme |
|----------|-------|-------|
| 🔴 Critical | 5 | Admin bundle, security, persistence |
| 🟠 High | 12 | Monolith components, state architecture |
| 🟡 Medium | 13 | Consistency, a11y, dead code |
| 🟢 Low | 10 | DX, docs, cleanup |

---

## 🔴 Critical (P0)

### TD-001 — Storefront TypeScript errors block CI
**Status:** ✅ Resolved in LE-002  
**Was:** ~40 errors from `Product` vs `CatalogProduct` drift  
**Fix applied:** `types/product.ts`, `utils/productNormalize.ts`, context `allCatalogProducts` / `allCatalogBrands` / `allCatalogGuides` / `allCatalogCreators`

### TD-002 — Admin WebsiteCMSStudio missing snapshot label
**Impact:** `npm run lint` fails (admin repo only)  
**File:** `WebsiteCMSStudio.tsx:361`  
**Fix:** Add `label` to `CmsVersionSnapshot` save payload  
**Effort:** 1 hour

### TD-003 — 815 kB categoryDisplay bundle chunk
**Status:** ✅ Resolved in LE-002  
**Root cause:** `import * as LucideIcons from 'lucide-react'` in `categoryIcons.tsx`, `CategoriesPage`, `CategorySubcategoryPanel`  
**Result:** `categoryDisplay` chunk **15.58 kB** gzip **5.66 kB** (was 816.99 kB / 155.77 kB gzip)

### TD-004 — Admin 1.14 MB main JS chunk
**Impact:** Slow first load for admin users  
**Fix:** `manualChunks`, lazy firebase/recharts/socket.io  
**Effort:** 2 days

### TD-005 — Auth token in localStorage
**Impact:** XSS → account takeover  
**File:** `AuthContext.tsx` (`choosify_auth_token`)  
**Fix:** httpOnly cookie + CSRF; short-lived access token  
**Effort:** 1 sprint (full-stack)

### TD-006 — @google/genai in storefront dependencies
**Impact:** Risk of API key exposure in client bundle  
**Fix:** Verify keys only in server/Express; remove client import if present  
**Effort:** 4 hours

### TD-007 — localStorage as primary data store (admin)
**Impact:** Data loss, cross-tab inconsistency, no backup  
**Files:** 35+ files, 200+ references  
**Fix:** API persistence + TanStack Query cache  
**Effort:** Multi-sprint migration map

### TD-008 — No route-level auth guard (storefront seller routes)
**Status:** Partially mitigated — seller admin pages/routes removed from storefront in LE-002  
**Remaining:** Consumer dashboard still public; full `ProtectedRoute` deferred to LE-008  
**Effort:** 1 day

---

## 🟠 High (P1)

### TD-101 — ProductStudio monolith (4,424 lines)
**Fix:** Extract `useProductStudioState`, section editors, preview panel  
**Effort:** 1 sprint

### TD-102 — WebsiteCMSStudio monolith (4,403 lines)
**Fix:** Shared studio shell + per-section modules  
**Effort:** 1 sprint

### TD-103 — UnifiedProfileShell (3,225 lines)
**Fix:** Tab-based code split, one component per profile tab  
**Effort:** 1 sprint

### TD-104 — BrandDetailPage monolith (2,442 lines)
**Fix:** Tab sections as lazy sub-routes or components  
**Effort:** 3–5 days

### TD-105 — CompareEngine monolith (1,921 lines)
**Fix:** Extract matrix, hooks, memoize rows  
**Effort:** 3 days

### TD-106 — FilterEngine monolith (1,541 lines)
**Fix:** Split drawer vs chip bar vs filter state hook  
**Effort:** 3 days

### TD-107 — 18 nested React contexts (admin)
**Fix:** Combine related contexts; memoize values; consider Zustand for UI state  
**Effort:** 1 sprint

### TD-108 — Duplicate catalogApi between apps
**Fix:** `@choosify/api-client` workspace package  
**Effort:** 3 days

### TD-109 — No server state library
**Fix:** TanStack Query for both apps  
**Effort:** 1 sprint rollout

### TD-110 — Admin accessibility gap (~8 aria usages)
**Fix:** jsx-a11y lint + modal/table pass  
**Effort:** 2 sprints

### TD-111 — Orders.tsx monolith (2,506 lines)
**Fix:** List/detail split, virtualization  
**Effort:** 1 sprint

### TD-112 — HomePage monolith (1,896 lines)
**Fix:** CMS section map + lazy section components  
**Effort:** 5 days

---

## 🟡 Medium (P2)

### TD-201 — Dead/orphan admin files
`Home.tsx`, `CMS.tsx`, `LeftEditorPanel.tsx`, `RightPreviewPanel.tsx`, `ConsumerDashboard.tsx`  
**Fix:** Verify no imports → delete or move to `_deprecated/`  
**Effort:** 4 hours

### TD-202 — Unused OrdersOverview import in App.tsx
**Fix:** Remove import or wire route  
**Effort:** 30 min

### TD-203 — Duplicate Skeleton components
`Skeleton.tsx` + `SkeletonLoader.tsx`  
**Fix:** Merge  
**Effort:** 2 hours

### TD-204 — Storefront Overview dev shell in App.tsx
**Status:** ✅ Resolved in LE-002

### TD-205 — No shared Button/Input primitives
**Fix:** Extract without visual change  
**Effort:** 3 days

### TD-206 — Inconsistent loading/empty/error UX
**Fix:** `<AsyncBoundary>` pattern  
**Effort:** 1 sprint

### TD-207 — Admin no 404 page
**Fix:** Add NotFoundPage + route  
**Effort:** 2 hours

### TD-208 — Console.log in production paths
Storefront ~15, Admin ~100+ (incl. logistics test files)  
**Fix:** Strip in build or replace with logger  
**Effort:** 1 day

### TD-209 — InvoiceView dangerouslySetInnerHTML
**Fix:** Sanitize or use CSS modules  
**Effort:** 4 hours

### TD-210 — Editorial type ID mismatch (string vs number)
**File:** `editorialMappers.ts`  
**Fix:** Align `MediaItem.associatedGuideId` type  
**Effort:** 2 hours

### TD-211 — Missing React.memo on list cards
**Fix:** Memo ProductCard, BrandCardDesign  
**Effort:** 4 hours

### TD-212 — No list virtualization
**Fix:** @tanstack/react-virtual on catalog grids  
**Effort:** 3 days

### TD-213 — jspdf/xlsx not dynamically imported
**Fix:** `import()` on export action  
**Effort:** 2 hours

### TD-214 — recharts loaded in admin main path
**Fix:** Lazy load on analytics routes only  
**Effort:** 4 hours

### TD-215 — choosify_* localStorage key collision risk
**Fix:** Document key registry; namespace by app  
**Effort:** 4 hours

---

## 🟢 Low (P3)

### TD-301 — No `typecheck` script (lint = tsc)
**Fix:** Add explicit `"typecheck": "tsc --noEmit"` alias  
**Effort:** 5 min

### TD-302 — Duplicate vite in package.json dependencies
**Fix:** devDependencies only  
**Effort:** 5 min

### TD-303 — No ESLint — only TypeScript
**Fix:** Add eslint + jsx-a11y  
**Effort:** 1 day

### TD-304 — No component Storybook
**Fix:** Storybook for primitives  
**Effort:** 2 days

### TD-305 — No file-size CI budget
**Fix:** danger.js or size-limit on PRs  
**Effort:** 4 hours

### TD-306 — Admin missing noindex meta
**Fix:** Global robots noindex in AdminLayout  
**Effort:** 30 min

### TD-307 — Sitemap churn on every build
**Fix:** Stable lastmod or git-ignore if generated  
**Effort:** 1 hour

### TD-308 — Design tokens undocumented (pre-LE-001)
**Fix:** ✅ DESIGN_SYSTEM_AUDIT.md created  
**Effort:** Done

### TD-309 — logistics test-logistics.ts console noise
**Fix:** Move to `scripts/` or test folder  
**Effort:** 1 hour

### TD-310 — Hooks understaffed in admin (3 for 64 pages)
**Fix:** Extract hooks during studio decomposition  
**Effort:** Ongoing

---

## Migration Map: localStorage → API

| Key domain | Current | Target API |
|------------|---------|------------|
| Auth token | localStorage | httpOnly cookie |
| Cart | GlobalStateContext | `/api/cart` |
| Compare list | GlobalStateContext | `/api/compare` or session |
| CMS drafts | WebsiteCMSStudio LS | `/api/admin/cms/versions` |
| Orders (admin) | OrdersContext LS | `/api/admin/orders` |
| Trust/moderation | TrustContext LS | `/api/admin/moderation` |
| Layout prefs | layoutPersistence | `/api/user/preferences` |

---

## Suggested Sprint Allocation

| Sprint | Focus | Debt IDs |
|--------|-------|----------|
| LE-002 | Type safety + lint green | TD-001, TD-002, TD-210 |
| LE-003 | Bundle performance | TD-003, TD-004, TD-213, TD-214 |
| LE-004 | Studio decomposition (admin) | TD-101, TD-102 |
| LE-005 | Storefront page splits | TD-104, TD-112, TD-105, TD-106 |
| LE-006 | State + API migration start | TD-007, TD-109, TD-108 |
| LE-007 | Accessibility | TD-110 |
| LE-008 | Security hardening | TD-005, TD-006, TD-209 |

---

## Definition of Done (Debt Paydown)

- [x] `npm run build` passes storefront (LE-002)
- [x] `npm run lint` passes storefront — 0 errors (LE-002)
- [ ] `npm run build` passes admin
- [ ] `npm run lint` passes admin (TD-002 blocks)
- [ ] No component >800 lines without approved exception
- [ ] Main chunk <400 kB gzip (storefront index still ~208 kB gzip — TD-004 scope)
- [ ] axe-core 0 critical violations on top 10 routes
- [ ] Auth token not in localStorage
- [x] Storefront admin artifact dead code removed (LE-002)

---

## Changelog

| Date | Action |
|------|--------|
| 2026-07-09 | Initial register from LE-001 audit |
| 2026-07-09 | LE-002: TD-001, TD-003, TD-204 resolved; storefront lint/build green |
