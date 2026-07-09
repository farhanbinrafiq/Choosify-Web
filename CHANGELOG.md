# Changelog

All notable changes to the Choosify storefront (`Choosify-Web`).

## [Unreleased] — LE-002 Frontend Stabilization & Type Safety (2026-07-09)

**Status:** Implemented locally — not committed; awaiting ChatGPT approval.

### Removed

**Files deleted:**
- `src/pages/CmsStudioPage.tsx`
- `src/pages/SellerIncomingOrdersPage.tsx`
- `src/pages/SellerOrderDetailsPage.tsx`
- `src/pages/SellerCashbookPage.tsx`

**Routes removed (`App.tsx`):**
- `/overview` (dev Overview shell)
- `/seller/orders`, `/seller/orders/:id`, `/seller/cashbook`
- `/dashboard/studio/*` (5 CMS studio routes)
- `/cashbook/*` → `/seller/cashbook` redirect

**Context mutators removed (`DashboardContext.tsx`):**
- `addCampaign`, `updateCampaign`, `deleteCampaign`
- `addCustomOverview`, `deleteCustomOverview`

**Dashboard UI trimmed (`DashboardPage.tsx`):**
- `CmsStudiosSection` and seller-cashbook menu entry removed
- Consumer dashboard preserved

### Added

- `src/types/product.ts` — canonical `Product` = `CatalogProduct`
- `src/utils/productNormalize.ts` — commerce/mock → catalog adapters
- `src/data/categories.ts` — static categories isolated from product mocks
- `src/vite-env.d.ts` — `import.meta.env` typings
- `GlobalStateContext.allCatalogCreators` — for placement resolution

### Changed

- `types/schemas.ts`: legacy `Product` renamed to `CommerceProduct`
- Storefront pages migrated to `allCatalogProducts` / `brandName` / `categoryName`
- `categoryIcons.tsx`: curated Lucide map (replaces full library import)
- `CategoriesPage`, `CategorySubcategoryPanel`: named Lucide imports only

### TypeScript

- **Before:** ~40 errors (`npm run lint` failed)
- **After:** **0 errors** (`npm run lint` passes)

### Build

- **Before:** `categoryDisplay` chunk ~816 kB (155 kB gzip)
- **After:** `categoryDisplay` chunk **15.58 kB** (5.66 kB gzip) — **−98%**
- `npm run build`: **PASS**
- Main `index` chunk: ~681 kB (208 kB gzip) — unchanged; mock `PRODUCTS` still in `GlobalStateContext` fallback path

### Remaining debt

- Admin `WebsiteCMSStudio.tsx:361` lint error (choosify-admin-4.0, out of LE-002 scope)
- Storefront main bundle still large (~208 kB gzip) — mock data in `constants.ts` / `GlobalStateContext`
- Monolith pages: `HomePage`, `BrandDetailPage`, `CompareEngine`, `FilterEngine`
- Auth token in localStorage (TD-005)
- No ESLint beyond `tsc --noEmit`
