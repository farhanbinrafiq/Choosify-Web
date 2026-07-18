# DS-2.0 Section Header Inventory

**Sprint:** ES-001

---

## Shared Components

| Component | Path | Features |
|-----------|------|----------|
| `HomeSectionHeader` | `src/components/home/sections/HomeSectionHeader.tsx` | Title, subtitle, ViewAllLink, light mode |
| `ViewAllLink` | `src/components/design/ViewAllLink.tsx` | Uppercase view-all with chevron |
| `PageHeroHeader` | `src/components/PageHeroHeader.tsx` | Compact page title bar |

---

## Homepage Consumers (`HomeSectionHeader`)

| Section | File |
|---------|------|
| Top Categories | `HomeTopCategoriesSection.tsx` |
| Spotlight Preview | `HomeSpotlightPreviewSection.tsx` |
| Featured Products | `HomeFeaturedProductsSection.tsx` |
| Today's Deals | `HomeTodaysDealsSection.tsx` |
| Compare | `HomeCompareSection.tsx` |
| Expert Guides | `HomeBuyingGuidesSection.tsx` |
| Featured Brands | `HomeFeaturedBrandsSection.tsx` |
| Popular Services | `HomePopularServicesSection.tsx` |
| Recently Viewed | `HomeRecentlyViewedSection.tsx` (partial — custom mini header) |

---

## Inline Section Headers (Duplicated Pattern)

Repeated markup: `<h2>` + optional subtitle + `<Link>View All</Link>`

| Surface | Files |
|---------|-------|
| Listing pages | `AllProductsPage`, `DealsPage`, `BrandsPage`, `CreatorsPage`, `GuidesPage`, `SearchPage` |
| Detail pages | `ProductDetailPage`, `BrandDetailPage`, `GuideDetailPage`, `CreatorProfilePage` |
| Spotlight | `SpotlightDiscoverPage`, `SpotlightContentPage`, `SpotlightIntegrationRail` |
| Categories | `CategoriesPage`, `CategorySubcategoryPanel` |
| Dashboard | `DashboardPage` (custom italic uppercase) |
| Compare | `CompareEngine` |
| Marketing CMS | `MarketingContentListShell`, intelligence pages |

---

## Spotlight / Publisher Headers

| Component | Path |
|-----------|------|
| `PublisherProfileHeader` | `src/components/spotlight/publisher/PublisherProfileHeader.tsx` |
| `LiveExperienceHeader` | `src/components/spotlight/interactive/LiveExperienceHeader.tsx` |
| Inline rails | `SpotlightIntegrationRail`, `SpotlightMissionControl` |

---

## Popular Search Header

| Component | Path |
|-----------|------|
| `PopularSearchKeywords` | `src/components/PopularSearchKeywords.tsx` | Includes own `<h2>` header |

---

## Duplication Summary

| Pattern | Count | Issue |
|---------|-------|-------|
| `HomeSectionHeader` | 9 sections | Good — homepage canonical |
| Inline h2 + View All | 30+ locations | Needs `SectionHeader` primitive |
| Uppercase tracking-widest labels | Widespread | Inconsistent sizing (9px–11px) |
| Orange accent spans | Widespread | `<span className="text-[#E8500A]">` repeated |

---

## Proposed DS-2.0 SectionHeader API

```tsx
<SectionHeader
  title="Featured Products"
  titleAccent="Products"        // optional orange span
  subtitle="Curated picks..."
  viewAllHref="/products"
  viewAllLabel="View all products"
  size="lg" | "md" | "sm"
  align="left" | "center"
  light={boolean}               // dark band sections
/>
```

**Target:** Extract from `HomeSectionHeader` + `ViewAllLink` in ES-002 foundation pass.

---

## Related Shell Components

| Component | Path | Role |
|-----------|------|------|
| `HomeSectionShell` | `src/components/home/sections/HomeSectionShell.tsx` | Wraps UniversalSection |
| `UniversalSection` | `src/components/design/UniversalSection.tsx` | Section background + padding |
| `StudioWrap` | `src/components/studio/StudioWrap.tsx` | CMS studio overlay |
