# LE-005 Phase 4.1 — Spotlight Platform Integration

Integration sprint: Spotlight as Choosify's dynamic discovery layer across the storefront. No new Spotlight features; reorganization and wiring only.

## Homepage hierarchy

```
Hero Banner → Top Categories → Spotlight Carousel → Featured Products → Discover & Learn → Featured Brands
```

| Section | Component | Notes |
|---------|-----------|-------|
| Hero | `PageHeroBanner` | Unchanged — campaigns, seasonal, promotions |
| Categories | `StudioWrap` + `CategoryPhotoCard` | Primary marketplace entry |
| Spotlight | `SpotlightHeroCarousel` | Refactored from Trending Brand Carousel |
| Products | `ProductCard` grid | Curated featured products |
| Discover & Learn | `DiscoverAndLearnSection` | Tabs: Guides, Recommendations, Creator Picks |
| Brands | `FeaturedBrandsTabsSection` | Tabs: Featured, Trending, Verified, New |

## CTO upgrade: SpotlightHeroCarousel

- **File:** `src/components/home/SpotlightHeroCarousel.tsx`
- **Data:** `src/utils/spotlightHeroCarousel.ts` — `buildSpotlightHeroCarouselItems()`
- **Priority:** Live → Launches → Campaigns → Sponsored → Creator Picks → Announcements → Collections
- **Backward compat:** `TrendingBrandsCarousel` re-export alias (deprecated)

## Navigation

### Primary nav (`src/lib/navigation.ts`)

Home → Categories → Spotlight → Products → Brands → Discover → Compare → Deals → Creators

### Mobile bottom nav (`src/components/MobileBottomNav.tsx`)

Home → Categories → Spotlight → Discover (`/search`) → Profile

### Footer (`src/components/Footer.tsx`)

DISCOVER column: Spotlight, Collections, Live, Guides, Top Brands, Best Deals

## Cross-page Spotlight rails

`SpotlightIntegrationRail` (`src/components/spotlight/SpotlightIntegrationRail.tsx`):

| Page | Filter | Source |
|------|--------|--------|
| Brand detail | `brandId` | `brand` |
| Product detail | `productIds` | `product` |
| Categories | `categoryName` | `category` |
| Creator profile | `creatorId` | `creator` |

## Discovery search

- **Placeholder:** "Discover products, brands, campaigns, guides..." (`Navbar`, `GlobalSearchBar`, `SearchPage`)
- **Discovery panel:** On search focus (empty query) — Trending Searches, Spotlight Campaigns, New Launches, Popular Guides, Featured Creators, Trending Brands, Popular Products, Top Categories
- **Unified results:** `SearchPage` includes Spotlight campaigns, collections, series, live, guides via `searchSpotlightContent()`

Backend route names remain `/search`; UI copy uses "Discover" where appropriate.

## SEO

Sitemap (`scripts/generate-sitemap.mjs`) includes:

- `/spotlight`, `/spotlight/explore`, `/spotlight/search`, `/spotlight/calendar`, `/spotlight/stories`
- `/spotlight/collections`, `/spotlight/series`

## Analytics (ES-008 prep)

`src/utils/spotlightPlatformAnalytics.ts` — dev-only event stubs for Homepage → Spotlight, Brand → Spotlight, Product → Spotlight, Search → Spotlight, etc.

## Verification

```
npm run lint   ✅ pass
npm run build  ✅ pass
```

## Files changed (Phase 4.1)

| Area | Files |
|------|-------|
| Homepage | `HomePage.tsx`, `SpotlightHeroCarousel.tsx`, `DiscoverAndLearnSection.tsx`, `FeaturedBrandsTabsSection.tsx`, `spotlightHeroCarousel.ts` |
| Nav / shell | `navigation.ts`, `Navbar.tsx`, `MobileBottomNav.tsx`, `Footer.tsx`, `App.tsx` |
| Integration | `SpotlightIntegrationRail.tsx`, `BrandDetailPage.tsx`, `ProductDetailPage.tsx`, `CategoriesPage.tsx`, `CreatorProfilePage.tsx` |
| Search | `GlobalSearchBar.tsx`, `SearchPage.tsx`, `searchTypes.ts` |
| SEO / analytics | `generate-sitemap.mjs`, `spotlightPlatformAnalytics.ts` |

**Not committed** — awaiting review per sprint instructions.
