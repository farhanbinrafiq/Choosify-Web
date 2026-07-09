# LE-001 — Component Inventory

**Date:** 2026-07-09  
**Total audited:** 111 components + 104 pages across both applications

---

## Storefront Pages (40)

| Page | Est. lines | >300 | Notes |
|------|------------|------|-------|
| `HomePage.tsx` | ~1,896 | ✅ | CMS sections, carousels, feeds |
| `BrandDetailPage.tsx` | ~2,442 | ✅ | Largest page — tabs, products, posts |
| `GuidesPage.tsx` | ~900+ | ✅ | Editorial listing + filters |
| `GuideDetailPage.tsx` | ~400+ | ✅ | Article layout |
| `ProductDetailPage.tsx` | ~600+ | ✅ | Gallery, specs, compare |
| `SearchPage.tsx` | ~550+ | ✅ | Unified search results |
| `CategoriesPage.tsx` | ~700+ | ✅ | Category tree + products |
| `AllProductsPage.tsx` | ~550+ | ✅ | Filtered catalog |
| `BrandsPage.tsx` | ~400+ | ✅ | Brand directory |
| `CreatorsPage.tsx` | ~400+ | ✅ | Creator directory |
| `CreatorProfilePage.tsx` | ~350+ | ✅ | Profile + content |
| `DealsPage.tsx` | ~400+ | ✅ | Deals listing |
| `BrandDealsPage.tsx` | ~350+ | ✅ | Brand-scoped deals |
| `ComparePage.tsx` | ~200 | — | Thin wrapper for CompareEngine |
| `WhatsOnPage.tsx` | ~300+ | ✅ | Events feed |
| `BrandPostDetailPage.tsx` | ~350+ | ✅ | Editorial post |
| `GuideProductsPage.tsx` | ~250 | — | Guide product picks |
| `LoginSignUpPage.tsx` | ~300+ | ✅ | Auth forms |
| `PostOfferPage.tsx` | ~350+ | ✅ | Seller offer form |
| `DashboardPage.tsx` | ~400+ | ✅ | User dashboard |
| `CheckoutPage.tsx` | ~350+ | ✅ | Checkout flow |
| `RetailCartPage.tsx` | ~300+ | ✅ | Cart view |
| `OrderSuccessPage.tsx` | ~200 | — | Confirmation |
| `OrderTrackingPage.tsx` | ~250 | — | Tracking |
| `CustomerOrdersPage.tsx` | ~300+ | ✅ | Order history |
| `SellerIncomingOrdersPage.tsx` | ~350+ | ✅ | Seller orders |
| `SellerOrderDetailsPage.tsx` | ~300+ | ✅ | Order detail |
| `SellerCashbookPage.tsx` | ~300+ | ✅ | Seller ledger |
| `MessagesPage.tsx` | ~350+ | ✅ | Messaging |
| `EmiPage.tsx` | ~250 | — | AI chat page |
| `CmsStudioPage.tsx` | ~400+ | ✅ | Inline CMS edit |
| `SuggestBrandPage.tsx` | ~200 | — | Form |
| `PartnershipPage.tsx` | ~150 | — | Static |
| `AdvertisePage.tsx` | ~150 | — | Static |
| `AboutPage.tsx` | ~150 | — | Static |
| `ContactPage.tsx` | ~200 | — | Static |
| `FAQPage.tsx` | ~250 | — | FAQ accordion |
| `TermsPage.tsx` | ~150 | — | Static |
| `PrivacyPage.tsx` | ~150 | — | Static |
| `NotFoundPage.tsx` | ~80 | — | 404 |

**Summary:** ~22 pages exceed 300-line guideline.

---

## Storefront Components (63)

### Layout & Chrome
| Component | Lines (est.) | Responsibility |
|-----------|--------------|----------------|
| `Navbar.tsx` | ~400 | Main nav, search entry, mobile menu |
| `Footer.tsx` | ~300+ | Site footer, links |
| `PageBreadcrumbs.tsx` | ~150 | Breadcrumb bar |
| `ScrollToTop.tsx` | ~50 | Route scroll reset |
| `FloatingOverlays.tsx` | ~200 | Compare/cart FABs |
| `MobileActionHub.tsx` | ~200 | Mobile sticky actions |
| `LoadingFallback.tsx` | ~50 | Suspense fallback |
| `ErrorBoundary.tsx` | ~80 | Error UI |

### SEO & Analytics
| Component | Responsibility |
|-----------|----------------|
| `PageSeo.tsx` | Meta, OG, canonical, robots |
| `JsonLd.tsx` | Structured data script |
| `GoogleAnalyticsRouteTracker.tsx` | GA page views |

### Catalog & Discovery
| Component | Lines (est.) | >300 |
|-----------|--------------|------|
| `ProductCard.tsx` | ~250 | — |
| `FilterEngine.tsx` | ~1,541 | ✅ |
| `CompareEngine.tsx` | ~1,921 | ✅ |
| `GlobalSearchBar.tsx` | ~400+ | ✅ |
| `HeroSearchBar.tsx` | ~200 | — |
| `AlphabetFilterStrip.tsx` | ~150 | — |
| `PaginationBar.tsx` | ~150 | — |
| `PopularSearchKeywords.tsx` | ~100 | — |
| `CategoryPhotoCard.tsx` | ~150 | — |
| `CategorySubcategoryPanel.tsx` | ~200 | — |

### Brand & Creator
| Component | Responsibility |
|-----------|----------------|
| `BrandCardDesign.tsx` | Brand grid card |
| `CreatorCardDesign.tsx` | Creator card |
| `BrandOverviewSection.tsx` | Brand detail section |
| `BrandPostCard.tsx` | Editorial card |
| `BrandPostCarouselSection.tsx` | Post carousel |
| `BrandPostBannerGallery.tsx` | Banner gallery |
| `FollowButton.tsx` | Follow toggle |
| `ClaimProfileModal.tsx` | Brand claim flow |

### Product Detail
| Component | Responsibility |
|-----------|----------------|
| `ProductMediaGallery.tsx` | Image gallery |
| `ProductSpecsOverview.tsx` | Spec table |
| `ProductStatusBadge.tsx` | Stock/deal badge |
| `SizeGuideModal.tsx` | Size chart |
| `DetailHeroSummaryBar.tsx` | PDP summary strip |
| `InfluencerReviews.tsx` | Review section |
| `RecommendationMediaGallery.tsx` | Guide media |

### Guides & Recommendations
| Component | Responsibility |
|-----------|----------------|
| `RecommendationCard.tsx` | Guide card |
| `PageHeroBanner.tsx` | CMS hero |
| `PageHeroHeader.tsx` | Simple hero title |
| `StaticPageHero.tsx` | Static page hero |
| `HeroMarqueeTicker.tsx` | Ticker strip |
| `CampaignBannerCarousel.tsx` | Promo carousel |
| `ModernCarousel.tsx` | Generic carousel |
| `StickySectionNav.tsx` | In-page nav |

### Commerce
| Component | Responsibility |
|-----------|----------------|
| `CartDrawer.tsx` | Slide-out cart |
| `CartPreviewPanel.tsx` | Cart preview |
| `CardEngagementStrip.tsx` | Save/share/compare |
| `ListingAdRail.tsx` | Ad placement rail |
| `SponsoredPlacementCard.tsx` | Sponsored card |
| `SponsoredSidebarSlot.tsx` | Sidebar ad |
| `AdSenseSlot.tsx` | AdSense container |

### Studio / CMS
| Component | Responsibility |
|-----------|----------------|
| `studio/StudioWrap.tsx` | Studio layout |
| `studio/StudioEditPanel.tsx` | Inline edit panel |
| `studio/StudioSectionShell.tsx` | Section wrapper |

### AI & Messaging
| Component | Responsibility |
|-----------|----------------|
| `EmiChatPanel.tsx` | Emi AI chat UI |
| `MessagesPreviewPanel.tsx` | Message preview |

### Misc
| Component | Responsibility |
|-----------|----------------|
| `ChoosifyIconLogo.tsx` | Logo SVG |
| `SignInModal.tsx` | Auth modal |
| `ReportModal.tsx` | Report content |
| `VideoLightbox.tsx` | Video overlay |
| `PublicReviewCard.tsx` | Review card |
| `Skeleton.tsx` | Loading skeleton |
| `SkeletonLoader.tsx` | Alt skeleton ⚠️ duplicate |

---

## Storefront Hooks (6)

| Hook | Purpose |
|------|---------|
| `useBreadcrumbItems.ts` | Breadcrumb data |
| `useCardEngagement.ts` | Save/compare/local engagement |
| `useCarousel.ts` | Carousel state |
| `useEmiChat.ts` | AI chat session |
| `usePlacements.ts` | Ad/content placements |
| `useSectionScrollSpy.ts` | Sticky nav spy |

---

## Storefront Services (4)

| Service | Purpose |
|---------|---------|
| `catalogApi.ts` | Products, brands, categories API |
| `operationsApi.ts` | Orders, cart, seller ops |
| `emiApi.ts` | AI chat API |
| `notificationApi.ts` | User notifications |

---

## Storefront Utils (12)

| Util | Purpose |
|------|---------|
| `catalogMatch.ts` | Product matching |
| `categoryDisplay.ts` | Category labels ⚠️ large bundle |
| `categoryPopularSearches.ts` | Category SEO keywords |
| `editorialMappers.ts` | Guide/media mapping |
| `eventBadges.ts` | Event badge logic |
| `heroTickers.ts` | Hero ticker content |
| `homepageCms.ts` | Homepage CMS helpers |
| `injectFeedPlacements.ts` | Ad injection |
| `overviewRegistry.ts` | Overview screen registry |
| `pagePopularSearches.ts` | Page-level popular searches |
| `productBadges.ts` | Product badge rules |
| `resolvePlacementContent.ts` | Placement resolver |

---

## Storefront Contexts (4)

| Context | Persistence |
|---------|-------------|
| `GlobalStateContext` | localStorage heavy |
| `DashboardContext` | localStorage heavy |
| `BreadcrumbContext` | Memory |
| `StudioEditContext` | localStorage partial |

---

## Admin Pages (64) — Selected Inventory

### Monoliths (>1,000 lines) — **Decompose required**

| Page | Lines | Domain |
|------|-------|--------|
| `ProductStudio.tsx` | 4,424 | Product CMS |
| `WebsiteCMSStudio.tsx` | 4,403 | Site CMS |
| `UnifiedProfileShell.tsx` | 3,225 | Profiles |
| `Orders.tsx` | 2,506 | Order management |
| `CashBookHub.tsx` | 2,386 | Accounting |
| `Messages.tsx` | 2,309 | Messaging |
| `Moderation.tsx` | 2,165 | Moderation |
| `Sellers.tsx` | 1,890 | Seller admin |
| `GuideEditStudio.tsx` | 1,764 | Guide editor |
| `DisputeCenter.tsx` | 1,762 | Disputes |
| `BrandEditStudio.tsx` | 1,730 | Brand editor |
| `OrdersOverview.tsx` | 1,505 | Orders dashboard |
| `LeftEditorPanel.tsx` | 1,372 | ⚠️ Orphan? |
| `Deals.tsx` | 1,217 | Deals admin |
| `CreatorEarnings.tsx` | 1,196 | Creator payouts |

### Orphan / Dead candidates
- `Home.tsx`
- `CMS.tsx`
- `RightPreviewPanel.tsx`
- `ConsumerDashboard.tsx`
- `LeftEditorPanel.tsx` (if studio refactored)

### Dashboard routes
- `DashboardRouter.tsx` → role-based lazy dashboards
- `SellerDashboard`, `CreatorDashboard`, `RoleOpsDashboard`, `SuperAdminDashboard`

### Logistics (5 pages)
- `CourierProviders`, `ShipmentConsole`, `TrackingCenter`, `ShippingLabels`, `CourierAnalytics`

---

## Admin Components (48) — Key items

| Component | Responsibility |
|-----------|----------------|
| `AdminLayout.tsx` | Shell, sidebar, nav |
| `Layout/Splitter.tsx` | Resizable split |
| `Layout/SplitLayout.tsx` | Split pane layout |
| `Layout/ResizableSidebar.tsx` | Sidebar persistence |
| `admin/BrandIntelligenceCenter.tsx` | Brand analytics |
| `admin/AddProductModal.tsx` | Quick add product |
| `CMSAddItemModal.tsx` | CMS item add |
| `profile/GuideStudioCMS.tsx` | Guide CMS section |

---

## Admin Hooks (3) — **Understaffed**

| Hook | Purpose |
|------|---------|
| `useLayoutPreferences.ts` | Panel layout persistence |
| `useSellerDashboard.ts` | Seller dashboard data |
| `useShipmentOperations.ts` | Shipment actions |

---

## Admin Services (16)

Includes: `catalogApi`, `mediaUpload`, `logistics/*` (adapters for Pathao, Redx, Steadfast, etc.), notification services.

---

## Admin Contexts (18)

`AuthContext`, `RbacContext`, `OrdersContext`, `InventoryContext`, `ShipmentContext`, `ReturnsContext`, `LogisticsContext`, `TrustContext`, `ReviewModeration`, `CouponsContext`, `DisputeContext`, `CreatorContext`, `ContactInteractionContext`, `CMSDataContext`, `CashBookContext`, `BrandProfilesContext`, `AdsContext`, (+ others nested in App)

---

## Cross-App Duplication

| Artifact | Storefront | Admin |
|----------|------------|-------|
| `catalogApi.ts` | ✅ | ✅ |
| Lucide icons | ✅ | ✅ |
| Motion animations | ✅ | ✅ |
| Toast | react-hot-toast | react-hot-toast |
| Product card patterns | ProductCard | AddProductModal / inline |

---

## Component Health Matrix

| Health | Criteria | Count |
|--------|----------|-------|
| 🟢 Good | <300 lines, single responsibility | ~40 |
| 🟡 Watch | 300–800 lines | ~35 |
| 🔴 Critical | >800 lines | ~36 |

---

## Recommended Extractions (Next Sprint)

### Storefront
1. `ProductCard` → `ProductCardImage`, `ProductCardPrice`, `ProductCardActions`
2. `FilterEngine` → 4 subcomponents + `useFilterState` hook
3. `CompareEngine` → `CompareHeader`, `CompareBody`, `useCompareProducts`

### Admin
1. `StudioEditorShell` shared by Product/Website/Guide studios
2. `OrderRow` + `OrderDetailPanel` from Orders.tsx
3. `DataTable` + `TablePagination` for admin lists
