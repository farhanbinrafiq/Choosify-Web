# LE-001 — Frontend Architecture & UI Audit

**Sprint:** LE-001  
**Date:** 2026-07-09  
**Scope:** Choosify storefront (`Choosify-Web`) + Admin console (`choosify-admin-4.0`)  
**Constraint:** Audit and documentation only — no redesign, no branding changes, no feature removal.

---

## Executive Summary

Choosify ships two React 19 + Vite 6 + Tailwind 4 frontends that share conceptual domain models but diverge in architecture maturity. The **storefront** has stronger SEO, better accessibility coverage, and route-level code splitting. The **admin** has extensive lazy routing but suffers from monolithic studio pages (4k+ lines), heavy `localStorage` persistence, and 18 nested context providers.

Both apps **build successfully**. TypeScript strict checks (**`npm run lint`**) fail on the storefront (40+ errors, mostly `Product` vs `CatalogProduct` drift) and on admin (1 error in `WebsiteCMSStudio.tsx`).

| Metric | Storefront | Admin |
|--------|------------|-------|
| Pages | 40 | 64 |
| Components | 63 | 48 |
| Hooks | 6 | 3 |
| Services | 4 | 16 |
| Utils / lib | 12 | 9 (`lib/`) |
| Contexts | 4 | 18 |
| Lazy routes | Yes (40 pages) | Yes (60+ chunks) |
| `React.memo` usage | 0 | Minimal |
| `aria-*` usages | ~90+ (40 files) | ~8 (3 files) |
| `localStorage` refs | ~70 (13 files) | ~200+ (35+ files) |

---

## Part 1 — Architecture Audit

### Storefront (`Choosify-Web/src`)

**Strengths**
- Clear separation: `pages/`, `components/`, `hooks/`, `services/`, `utils/`, `types/`, `context/`, `lib/`
- All routes lazy-loaded with `Suspense` + `LoadingFallback`
- Top-level `ErrorBoundary` in `App.tsx`
- Dedicated SEO layer (`PageSeo`, `lib/seoConfig`, `lib/structuredData`, sitemap generator)
- API services centralized in `services/` (`catalogApi`, `operationsApi`, `emiApi`, `notificationApi`)

**Issues**

| Category | Finding |
|----------|---------|
| **Oversized components** | 22/40 pages exceed 300 lines; largest: `BrandDetailPage` (~2,442), `CompareEngine` (~1,921), `HomePage` (~1,896), `FilterEngine` (~1,541) |
| **Duplicate code** | `Skeleton.tsx` + `SkeletonLoader.tsx`; hero/search/filter patterns repeated across listing pages |
| **Type drift** | Legacy mock `Product` type coexists with `CatalogProduct`; causes widespread TS errors |
| **Dead / dev-only code** | `Overview` shell in `App.tsx` (13-screen design stack) — not production routing |
| **Missing abstractions** | No shared `useCatalogQuery` / `useAsyncResource` hook; each page reimplements fetch + loading |
| **Repeated styling** | Page heroes, card grids, and filter drawers copy-pasted with minor variants |
| **Circular deps** | None detected at audit time |

### Admin (`choosify-admin-4.0/src`)

**Strengths**
- Comprehensive domain contexts (orders, inventory, logistics, trust, CMS, etc.)
- Lazy-loaded admin routes reduce initial bundle
- `react-hook-form` + `zod` on forms where adopted
- Split layout primitives (`Splitter`, `SplitLayout`, `ResizableSidebar`)

**Issues**

| Category | Finding |
|----------|---------|
| **Oversized components** | 48/64 pages exceed 300 lines; `ProductStudio` (4,424), `WebsiteCMSStudio` (4,403), `UnifiedProfileShell` (3,225), `Orders` (2,506) |
| **Context overuse** | 18 providers nested in `App.tsx` — any update can cascade re-renders |
| **localStorage as DB** | CMS, auth token, orders, trust, brand profiles, logistics — not synchronized across tabs reliably |
| **Dead / orphan files** | `Home.tsx`, `CMS.tsx`, `LeftEditorPanel.tsx`, `RightPreviewPanel.tsx`, `ConsumerDashboard.tsx`; unused `OrdersOverview` import in `App.tsx` |
| **Duplicate logic** | Studio editors (Product, Brand, Guide, Website CMS) share preview/save/version patterns without shared hooks |
| **Duplicate API clients** | `catalogApi` / operations patterns mirror storefront |
| **Minimal a11y** | Almost no ARIA outside `AdminLayout` and layout splitters |

---

## Part 2 — Component Audit

### Decomposition recommendations (>300 lines)

**Storefront — prioritize**
1. `BrandDetailPage` → `BrandHero`, `BrandProductGrid`, `BrandPostsSection`, `BrandClaimPanel`, `BrandReviewsTab`
2. `HomePage` → section components per CMS block (already partial; extract data hooks)
3. `CompareEngine` → `CompareTable`, `CompareRow`, `CompareSpecMatrix`, `CompareActions`
4. `FilterEngine` → `FilterDrawer`, `FilterChips`, `PriceRangeFilter`, `CategoryTreeFilter`
5. `GuidesPage` → `GuideFilters`, `GuideGrid`, `GuideEditorialRail`

**Admin — prioritize**
1. `ProductStudio` / `WebsiteCMSStudio` → shared `StudioShell`, `VersionHistoryPanel`, `PreviewFrame`, per-section editors
2. `UnifiedProfileShell` → tab router + one file per profile section
3. `Orders` → `OrderList`, `OrderDetailDrawer`, `OrderFilters`, `BulkActionsBar`
4. `Messages` → thread list, message pane, compose bar
5. `CashBookHub` → ledger table, entry form, summary cards

### Reusability gaps
- No shared `Button`, `Input`, `Badge`, `Dialog` primitives — all inline Tailwind
- Two skeleton implementations on storefront
- Admin lacks equivalent to storefront `PageSeo` (acceptable for authenticated app)

---

## Part 3 — Folder Structure

### Storefront (current — acceptable)

```
src/
  pages/          # Route-level screens (40)
  components/     # Shared UI (63)
  components/studio/
  hooks/          # 6 custom hooks
  services/       # API clients (4)
  utils/          # Pure helpers (12)
  types/          # TS contracts (8)
  context/        # 4 providers
  lib/            # SEO, data, brand posts
  data/           # Static seed / FAQ
```

**Recommendations (no moves unless refactoring)**
- Add `src/components/ui/` for extracted primitives (Button, Card, Badge) when decomposing
- Add `src/hooks/useAsyncResource.ts` for shared loading/error/retry
- Consolidate `Skeleton.tsx` + `SkeletonLoader.tsx` → single `Skeleton/`
- Move mock data imports behind `services/` adapters

### Admin (current — needs discipline)

```
src/
  pages/admin/    # 64 screens (many monoliths)
  pages/dashboards/
  components/     # Shared (48)
  contexts/       # 18 providers
  hooks/          # Only 3 — underpowered for codebase size
  services/       # 16
  lib/            # CMS versions, firebase, layout
```

**Recommendations**
- Add `src/features/<domain>/` when splitting studios (product, cms, orders)
- Add `src/hooks/` for `useLocalStorageSync`, `useStudioVersions`, `useAdminFetch`
- Archive or delete confirmed orphan pages under `pages/_deprecated/`
- Split `contexts/` into `contexts/` (UI state) vs `stores/` (persisted domain) for clarity

---

## Part 4 — React Performance

| Area | Storefront | Admin |
|------|------------|-------|
| Lazy loading | ✅ All pages | ✅ All admin routes |
| Suspense | ✅ `LoadingFallback` | ✅ Present |
| `useMemo` / `useCallback` | ~35 files | ~30 files |
| `React.memo` | ❌ None | ❌ Rare |
| Context perf | `GlobalStateContext` + `DashboardContext` — large value objects | 18 nested providers — high rerender risk |
| State duplication | Cart/compare in context + `localStorage` | Orders/inventory in context + `localStorage` |
| Large renders | Home, Brand detail, Compare — full tree on filter change | Studio pages render entire form trees |
| Code splitting | Good per-route; **815 kB** `categoryDisplay` chunk is abnormal | Main chunk **1,144 kB**; Recharts **325 kB** |

**Recommendations**
1. Memoize heavy list items (`ProductCard`, `BrandCardDesign`, order rows)
2. Split `GlobalStateContext` — separate `SiteConfigContext` from ephemeral UI state
3. Admin: compose contexts with `useMemo` on provider values (many already partial)
4. Virtualize long product/order lists (`@tanstack/react-virtual`)
5. Dynamic import `jspdf`, `xlsx`, `recharts` only on export/chart routes
6. Investigate why `categoryDisplay` bundles 815 kB — likely static JSON inlined

---

## Part 5 — State Management

### Storefront
| Layer | Usage |
|-------|-------|
| `GlobalStateContext` | Site config, compare list, cart, user prefs — **15 localStorage calls** |
| `DashboardContext` | Seller dashboard — **31 localStorage calls** |
| `BreadcrumbContext` | Navigation crumbs |
| `StudioEditContext` | CMS inline edit mode |
| Server state | `catalogApi` / `operationsApi` — mostly ad-hoc `useEffect` |

**Issues:** Duplicate derived state (filtered products computed in page + utils); no React Query / SWR cache.

### Admin
| Layer | Usage |
|-------|-------|
| 18 contexts | Auth, RBAC, Orders, Inventory, Shipments, Trust, CMS, Brands, etc. |
| `AuthContext` | JWT in `localStorage` (`choosify_auth_token`) |
| Persistence | Most contexts write through to `localStorage` on every mutation |

**Issues:** No single source of truth vs API; stale cross-tab data; memory growth in long sessions.

**Recommendations**
1. Introduce TanStack Query for server state (both apps)
2. Keep UI-only state in context; migrate persisted domain to API + cache
3. `sessionStorage` for auth token; httpOnly cookie long-term
4. Document `choosify_*` key registry to avoid collisions between apps on same origin

---

## Part 6 — Routing

### Storefront
- Nested providers wrap `<Routes>` — acceptable
- 404: `NotFoundPage` ✅
- Error boundary: root level ✅
- Protected routes: dashboard/seller routes check auth in-page (no centralized `ProtectedRoute`)
- Dev route: `/overview` design stack — remove or gate behind `import.meta.env.DEV`

### Admin
- Role-based dashboard via `DashboardRouter` ✅
- Login lazy route ✅
- No dedicated 404 page found — falls through or blank
- `OrdersOverview` imported but routing unclear — dead import
- Redirect-only lazy imports add noise

**Recommendations**
1. Add `ProtectedRoute` / `RoleRoute` wrapper components (both apps)
2. Admin: add `NotFoundPage` + route-level error boundaries on studio routes
3. Remove unused imports and orphan pages

---

## Part 7 — Loading UX

| State | Storefront | Admin |
|-------|------------|-------|
| Loading | `LoadingFallback`, route Suspense | Route Suspense |
| Skeleton | `Skeleton`, `SkeletonLoader`, page-specific | Sparse |
| Empty | Partial (varies by page) | Partial |
| Error | `ErrorBoundary` (root) | Limited |
| Retry | Rare — manual refresh | Rare |
| Offline | PWA (`vite-plugin-pwa`) configured | None |

**Gaps:** Most pages lack consistent empty/error/retry UI patterns. Recommend shared `<AsyncBoundary>` component.

---

## Parts 8–14 — Cross-References

| Topic | Document |
|-------|----------|
| Design tokens & consistency | [DESIGN_SYSTEM_AUDIT.md](./DESIGN_SYSTEM_AUDIT.md) |
| Accessibility (WCAG 2.2 AA) | [ACCESSIBILITY_REPORT.md](./ACCESSIBILITY_REPORT.md) |
| Bundle & runtime performance | [PERFORMANCE_AUDIT.md](./PERFORMANCE_AUDIT.md) |
| Component inventory | [COMPONENT_INVENTORY.md](./COMPONENT_INVENTORY.md) |
| Prioritized backlog | [TECH_DEBT.md](./TECH_DEBT.md) |

### Forms (Part 12)
- Storefront: login/checkout — basic HTML validation; limited `aria-invalid`
- Admin: `react-hook-form` + `zod` where used; inconsistent across 64 pages
- **Action:** Standardize form field component with label, error, `aria-describedby`

### SEO (Part 13) — Storefront strong
- `PageSeo` sets title, description, canonical, robots, OG, Twitter
- JSON-LD: Organization, Product, Brand, Breadcrumb, FAQ, Article
- `public/sitemap.xml` generated at build (60 URLs)
- `shouldNoIndex` for dashboard/auth routes

### SEO — Admin weak (expected)
- No `PageSeo` equivalent; should use `noindex` on all authenticated routes via `index.html` or layout meta

### Security (Part 14)
- No `dangerouslySetInnerHTML` on storefront
- Admin: `InvoiceView.tsx` uses inline `<style dangerouslySetInnerHTML>` — audit content source
- Auth token in `localStorage` — XSS exposure risk
- ~15 `console.log` on storefront; ~100+ on admin (including logistics test files)
- `@google/genai` in storefront dependencies — ensure API keys never ship to client bundle

---

## Mandatory Build Report

Executed 2026-07-09:

| Command | Storefront | Admin |
|---------|------------|-------|
| `npm run build` | ✅ PASS | ✅ PASS |
| `npm run lint` (`tsc --noEmit`) | ❌ FAIL (~40 errors) | ❌ FAIL (1 error) |
| `npm run typecheck` | N/A — not defined; `lint` = typecheck | N/A |

### Storefront lint themes
- `Product` vs `CatalogProduct` incompatibility (`HomePage`, `AllProductsPage`, `SearchPage`, etc.)
- Missing types: `CategoryItem`, `CatalogProductSizeGuide`
- Editorial mapper ID type mismatch (`string` vs `number`)
- Lucide icon typing in `AllProductsPage`

### Admin lint
- `WebsiteCMSStudio.tsx:361` — `CmsVersionSnapshot` missing required `label` property

### Bundle warnings
- Storefront: chunks >500 kB (`index` 688 kB, `categoryDisplay` 815 kB)
- Admin: chunks >500 kB (`index` 1,144 kB, `CartesianChart` 325 kB)

### Git diff note
- `public/sitemap.xml` modified by build script (timestamp URL churn) — not an intentional code change
- Audit docs added under `docs/` — **not committed** per LE-001 instructions

---

## Audit Counts Summary

| Audited | Storefront | Admin | Total |
|---------|------------|-------|-------|
| Pages | 40 | 64 | 104 |
| Components | 63 | 48 | 111 |
| Hooks | 6 | 3 | 9 |
| Services | 4 | 16 | 20 |
| Utilities | 12 | 9 | 21 |
| Contexts | 4 | 18 | 22 |

---

## Top Recommendations (Priority Order)

1. **P0 — Fix TypeScript errors** (storefront catalog type unification)
2. **P0 — Fix admin `WebsiteCMSStudio` snapshot `label`**
3. **P1 — Decompose 4k-line studio pages** (maintain behavior, extract hooks)
4. **P1 — Split 815 kB / 1,144 kB main chunks** (dynamic imports, manual chunks)
5. **P1 — Introduce TanStack Query** for server state
6. **P2 — Shared `@choosify/api-client` package** (dedupe catalog/operations)
7. **P2 — Admin accessibility pass** (ARIA, focus traps in modals)
8. **P2 — Remove dead code** (orphan admin pages, storefront Overview shell)
9. **P3 — Design token extraction** to shared CSS variables / tailwind theme
10. **P3 — `React.memo` on list cards** + list virtualization
