# Admin Artifact Audit — Choosify-Web vs choosify-admin-4.0

**Date:** 2026-07-09  
**Scope:** Every admin-related page, component, hook, utility, and service inside `Choosify-Web`  
**Action:** Classification only — **no files deleted** (awaiting ChatGPT approval)

---

## Classification Key

| Label | Meaning |
|-------|---------|
| **KEEP** | Required by the storefront (consumer UX, public CMS consumption, or intentional seller/community flows) |
| **MOVE** | Belongs only in `choosify-admin-4.0` — duplicate or misplaced admin console functionality |
| **DELETE** | Dead code, dev artifact, or accidental duplicate with no production route or callers |

---

## Executive Summary

Choosify-Web contains **no `src/pages/admin/` tree** and no admin console shell. Instead, admin-adjacent functionality appears in three clusters:

1. **Consumer account hub** (`/dashboard`, messages, orders) — legitimate storefront scope → **KEEP**
2. **Mirror CMS studios** (`/dashboard/studio/*`, `StudioWrap` stack) — overlaps admin `WebsiteCMSStudio` / `ProductStudio` / `BrandEditStudio` → **MOVE** studio routes; **KEEP** inline section wrappers on public pages
3. **Seller ops lite** (`/seller/*`) — overlaps admin `Orders`, `CashBookHub`, seller dashboard → **MOVE**
4. **Dead admin UI remnants** (removed dashboard tabs, unused context mutators, dev Overview route) → **DELETE**

**Counts**

| Classification | Items |
|----------------|-------|
| KEEP | 28 |
| MOVE | 8 |
| DELETE | 5 |
| KEEP (partial) | 2 |

---

## Pages

| File | Routes | Admin 4.0 counterpart | Verdict | Rationale |
|------|--------|---------------------|---------|-----------|
| `pages/DashboardPage.tsx` | `/dashboard` | `DashboardRouter`, role dashboards | **KEEP** | Consumer account hub (saved items, messages entry, settings). Not the admin console. |
| ↳ `CmsStudiosSection` (inline) | tab `cms-studios` | `WebsiteCMSStudio`, `ProductStudio`, `BrandEditStudio`, `GuideEditStudio` | **MOVE** | CMS authoring UI belongs in admin app. Storefront should consume published CMS via API. |
| `pages/CmsStudioPage.tsx` | `/dashboard/studio/*` | `WebsiteCMSStudio`, `ProductStudio`, `BrandEditStudio` | **MOVE** | Full-page mirror studios duplicate admin editors. Admin can preview via iframe/deep-link instead. |
| `pages/SellerIncomingOrdersPage.tsx` | `/seller/orders` | `Orders.tsx`, `SellerDashboard` | **MOVE** | Merchant order queue is platform ops — admin has full implementation; storefront uses mock `GlobalStateContext` orders. |
| `pages/SellerOrderDetailsPage.tsx` | `/seller/orders/:id` | `Orders.tsx`, `InvoiceView` | **MOVE** | Invoice/waybill view for sellers — admin superset exists. |
| `pages/SellerCashbookPage.tsx` | `/seller/cashbook` | `CashBookHub.tsx` | **MOVE** | Static `CASHBOOK_ROWS` mock ledger; admin `CashBookHub` (2,386 lines) is canonical. |
| `pages/PostOfferPage.tsx` | `/post-offer` | `SellerOffers.tsx` | **KEEP** | Public seller/community offer **submission** flow via `operationsApi.submitSellerOffer`. Admin reviews offers — correct split. |
| `pages/CustomerOrdersPage.tsx` | `/profile/orders` | — | **KEEP** | Buyer order history — consumer storefront feature, not admin. |
| `pages/MessagesPage.tsx` | `/messages`, `/messages/:threadId` | `Messages.tsx` | **KEEP** | Buyer/seller messaging on public site. Admin `Messages.tsx` is operator console (different scope). |
| `pages/LoginSignUpPage.tsx` | `/login` | `LoginPage.tsx` | **KEEP** | Consumer auth — separate from admin login. |
| `App.tsx` → `Overview` | `/overview` | — | **DELETE** | 13-screen design-stack dev shell; not production UX. |

---

## Components

| File | Used by | Admin 4.0 counterpart | Verdict | Rationale |
|------|---------|----------------------|---------|-----------|
| `components/studio/StudioWrap.tsx` | `HomePage`, `ProductDetailPage`, `BrandDetailPage`, `CreatorProfilePage`, `BrandPostDetailPage` | — | **KEEP** | Section anchor + optional edit affordance on **public** pages. Enables `?studioEdit=1` deep links from admin preview. |
| `components/studio/StudioSectionShell.tsx` | `StudioWrap` | — | **KEEP** | Presentation wrapper for public sections. |
| `components/studio/StudioEditPanel.tsx` | `App.tsx`, `CmsStudioPage` | Left/Right editor panels in admin studios | **KEEP** | Inline draft editor drawer. Needed for public-page edit mode even if `CmsStudioPage` moves. |
| `components/CampaignBannerCarousel.tsx` | Public pages | `AdsSponsors`, `AdsContext` | **KEEP** | **Reads** `choosify_campaigns` from shared localStorage — storefront render path. |
| `components/PageHeroBanner.tsx` | Public pages | CMS hero config in admin | **KEEP** | Renders homepage/CMS heroes + campaign slides for visitors. |
| `components/MessagesPreviewPanel.tsx` | `FloatingOverlays` | — | **KEEP** | Consumer message preview. |
| `components/ClaimProfileModal.tsx` | `BrandDetailPage` | `BrandVerification` | **KEEP** | Public brand-claim request — intake on storefront, review in admin. |
| `components/BrandOverviewSection.tsx` | `BrandDetailPage` | — | **KEEP** | Renders brand overview; consumes `customOverviews` data. |

---

## Contexts

| File | Admin overlap | Verdict | Rationale |
|------|---------------|---------|-----------|
| `context/DashboardContext.tsx` | Shares `choosify_campaigns`, `choosify_custom_overviews` keys with admin | **KEEP (partial)** | Core consumer state: saved products/brands, threads, notifications, recently viewed. |
| ↳ `campaigns` state (read) | `AdsContext`, `AdsSponsors` write | **KEEP** | Storefront displays campaigns on `PageHeroBanner`, `CampaignBannerCarousel`. |
| ↳ `addCampaign`, `updateCampaign`, `deleteCampaign` | `AdsContext` | **DELETE** | UI removed (`admin-campaigns` tab in `REMOVED_TABS`); **zero callers** outside context. Mutations belong in admin only. |
| ↳ `customOverviews` state (read) | Admin CMS / brand tooling | **KEEP** | Public search (`GlobalSearchBar`, `SearchPage`) and PDP/brand pages read merged overview content. |
| ↳ `addCustomOverview`, `deleteCustomOverview` | Admin CMS | **DELETE** | UI removed (`admin-overviews` tab); **zero callers**. Mutations belong in admin only. |
| `context/StudioEditContext.tsx` | Draft keys `choosify_studio_draft_*` | **KEEP** | Powers inline section editing on public routes and `StudioEditPanel`. |

---

## Hooks

| File | Admin 4.0 counterpart | Verdict | Rationale |
|------|----------------------|---------|-----------|
| `hooks/usePlacements.ts` | `catalogApi.listPlacements` in admin | **KEEP** | Fetches sponsored placement slots for **public** listing pages. |

*No other admin-specific hooks exist in Choosify-Web.* (Admin has `useLayoutPreferences`, `useSellerDashboard`, `useShipmentOperations` — not duplicated in storefront.)

---

## Services

| File | Admin 4.0 counterpart | Verdict | Rationale |
|------|----------------------|---------|-----------|
| `services/operationsApi.ts` | Partial overlap (orders, leads, offers APIs) | **KEEP** | All methods are **public/storefront** endpoints: checkout, reviews, leads, seller-offer submission, shipment tracking, feature flags. Not an admin console client. |
| `services/catalogApi.ts` | Identical file in admin | **KEEP** | Storefront must fetch public catalog. Duplication across repos is a **monorepo concern**, not a MOVE/DELETE of the storefront copy. |
| `services/emiApi.ts` | `server/ai` (backend) | **KEEP** | Consumer Emi assistant. |
| `services/notificationApi.ts` | Admin notification APIs | **KEEP** | User-facing notifications. |

---

## Utilities & Data

| File | Admin 4.0 counterpart | Verdict | Rationale |
|------|----------------------|---------|-----------|
| `utils/homepageCms.ts` | `WebsiteCMSStudio`, `CMSDataContext` | **KEEP** | Read-only helpers for **rendering** homepage CMS on public `HomePage`. |
| `utils/overviewRegistry.ts` | Brand/product CMS in admin | **KEEP** | Merges default + `customOverviews` for public brand/product pages and search. |
| `utils/injectFeedPlacements.ts` | `AdsSponsors`, placements API | **KEEP** | Injects sponsored cards into public feeds. |
| `utils/resolvePlacementContent.ts` | Admin placement config | **KEEP** | Resolves placement payload for public render. |
| `utils/pagePopularSearches.ts` | CMS popular searches in admin | **KEEP** | Public page SEO/search chips. |
| `utils/productBadges.ts` | Admin product badges CMS | **KEEP** | Public badge display logic. |
| `data/studioSections.ts` | Section registry in admin studios | **KEEP** | Shared contract between public `StudioWrap` anchors and edit panel field map. Admin should import this package later, not duplicate. |
| `types/studio.ts` | — | **KEEP** | Types for studio section registry. |
| `lib/placements.ts` | Placement keys in admin CMS | **KEEP** | Slot key constants for public placement components. |
| `lib/announcements.ts` | — | **KEEP** | Choosify announcements thread formatting for consumer messages. |
| `lib/featureFlags.ts` | Admin settings | **KEEP** | Reads flags via `operationsApi` for public feature gating. |

---

## App.tsx Wiring

| Artifact | Verdict | Rationale |
|----------|---------|-----------|
| `ProtectedRoute` | **KEEP** | Consumer auth guard. |
| `DashboardProvider` | **KEEP** | Consumer dashboard state. |
| `StudioEditProvider` + global `StudioEditPanel` | **KEEP** | Enables `?studioEdit=1` on public pages. |
| Routes `/dashboard/studio/*` | **MOVE** | Remove from storefront when `CmsStudioPage` moves to admin. |
| Routes `/seller/*` | **MOVE** | Seller ops routes belong in admin seller dashboard. |
| Route `/overview` + `Overview` component | **DELETE** | Dev-only design stack. |
| Redirect `/cashbook/*` → `/seller/cashbook` | **MOVE** | Remove with seller cashbook. |

---

## Cross-Repo Duplication Map

| Storefront artifact | Admin 4.0 artifact | Relationship |
|--------------------|--------------------|----------------|
| `CmsStudioPage` | `WebsiteCMSStudio`, `ProductStudio`, `BrandEditStudio` | **Competing CMS UIs** — admin is canonical |
| `SellerIncomingOrdersPage` | `Orders`, `SellerDashboard` | Storefront is mock/lite duplicate |
| `SellerCashbookPage` | `CashBookHub` | Storefront is static mock |
| `PostOfferPage` | `SellerOffers` | **Correct split** (submit vs review) |
| `catalogApi.ts` | `catalogApi.ts` | Identical — extract to shared package later |
| `choosify_campaigns` LS key | `AdsContext`, `AdsSponsors` | Admin writes, storefront reads |
| `choosify_custom_overviews` LS key | Admin brand/product CMS | Admin writes, storefront reads |
| `StudioWrap` + `studioSections` | Admin studio section editors | Storefront = render + inline affordance; admin = full editor |

---

## Recommended Execution Order (Post-Approval)

### Phase 1 — DELETE (safe, no UX loss)
1. Remove `App.tsx` `Overview` component and `/overview` route
2. Remove dead mutators from `DashboardContext`: `addCampaign`, `updateCampaign`, `deleteCampaign`, `addCustomOverview`, `deleteCustomOverview`
3. Remove `REMOVED_TABS` references to `admin-campaigns`, `admin-overviews` (cleanup only)

### Phase 2 — MOVE (redirect users to admin)
1. Remove `/dashboard/studio/*` routes and `CmsStudioPage.tsx` — link `DashboardPage` CMS tab to admin URLs instead
2. Remove `/seller/orders`, `/seller/orders/:id`, `/seller/cashbook` and seller pages — expose via admin `SellerDashboard`
3. Remove `CmsStudiosSection` from `DashboardPage` or replace with "Open in Admin Console" deep links

### Phase 3 — KEEP & consolidate
1. Retain `StudioWrap` stack on public pages for admin preview deep links
2. Migrate `studioSections.ts` + `types/studio.ts` to shared `@choosify/cms-contracts` package consumed by both apps
3. Replace shared localStorage campaign/overview sync with API + TanStack Query

---

## Items Explicitly NOT in Choosify-Web (admin-only, no action)

These exist only in `choosify-admin-4.0` and were **not** found in the storefront:

- `pages/admin/*` (64 pages)
- `contexts/*` (18 providers)
- `WebsiteCMSStudio`, `ProductStudio`, `Moderation`, `Analytics`, `TrustCenter`, etc.
- Admin `AuthContext`, RBAC, logistics, inventory contexts
- `recharts`, `firebase-admin`, `socket.io` admin console stack

---

## Approval Gate

**Do not delete or move files until ChatGPT review approves this classification.**

After approval, type-safety fixes (LE-002) should proceed **after** DELETE/MOVE cleanup to avoid fixing code that will be removed.
