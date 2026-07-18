# DS-2.0 Repository Audit

**Sprint:** ES-001 — Repository Normalization & DS-2.0 Bootstrap  
**Date:** 2026-07-12  
**Scope:** Audit only — no page redesigns in this sprint

---

## Executive Summary

Choosify-Web has grown through multiple layout sprints (LE-007 homepage, DS-V2.1 categories) alongside a large Spotlight/marketing CMS surface. Visual patterns are **partially centralized** in `src/index.css` and `src/lib/pageLayout.ts`, but **most UI still uses inline Tailwind with hardcoded hex values**.

A parallel “proto design system” exists under `src/components/design/` and `src/lib/design/` but is **not yet canonical**. ES-001 establishes `src/design-system/` as the single future source of truth.

---

## Duplicated UI Components

| Pattern | Implementations | Notes |
|---------|-----------------|-------|
| Product cards | `ProductCard`, `HomeProductCard`, `UniversalCommerceCard`, `RecommendationCard` | Catalog vs homepage vs editorial adapters |
| Category cards | `CategoryPhotoCard`, `CategoryPremiumCard`, `CategoryPhotoCard` (home) | Categories page vs homepage shortcuts |
| Brand cards | `BrandCardDesign`, `SpotlightBrandMiniCard`, brand logo pills (inline) | Multiple visual treatments |
| Sponsored cards | `ChoosifySponsoredCard`, `SponsoredPlacementCard` | Near-duplicate paths (`commerce/` vs root) |
| Spotlight cards | `SpotlightContentCard`, `SpotlightCampaignCard`, `HomeSpotlightEditorialCard`, `SpotlightShoppingFeedCard` | Adapter layers over same content model |
| Guide/media cards | `GuideMediaCards` (deprecated), `HomeGuideCarouselCard`, `UniversalContentCard` | Migration in progress |
| Intelligence cards | 8+ `Spotlight*Card` under `spotlight/intelligence/` | Admin-only, consistent internally |

---

## Duplicated Hero Sections

| Component | Used By | Role |
|-----------|---------|------|
| `PageHeroBanner` | Most listing pages (products, deals, brands, etc.) | CMS + campaign carousel |
| `HomeEditorialHero` | Homepage only | LE-007 editorial hero |
| `CategoriesDiscoveryHero` | Categories only | DS-V2.1 discovery hero |
| `StaticPageHero` | About, legal, static pages | Compact static header |
| `PageHeroHeader` | Detail/listing sub-headers | Text-only compact hero |
| `DetailHeroSummaryBar` | Product/brand detail | Summary strip |
| `SpotlightContentHero` | Spotlight feed/content | Media-first hero |
| `HeroMarqueeTicker` | Legacy listing pages | Ticker below hero |
| `HeroSearchBar` | Search-adjacent surfaces | Search-focused hero |

**Risk:** Three distinct hero architectures (banner carousel, editorial split, stat hero) with no shared primitive.

---

## Duplicated Section Headers

| Component | Consumers |
|-----------|-----------|
| `HomeSectionHeader` | 10+ homepage sections |
| Inline `<h2>` + View All links | Categories, Deals, Products, Spotlight, Dashboard |
| `ViewAllLink` | New shared primitive (`components/design/`) |
| Spotlight publisher/intelligence headers | Inline duplicated markup |

---

## Duplicated Carousels

| Component | Purpose |
|-----------|---------|
| `PremiumCarousel` | Homepage, Spotlight integration |
| `UniversalCarousel` | New DS proto (`components/design/`) |
| `ModernCarousel` | Legacy generic |
| `SpotlightCarousel` | Homepage spotlight |
| `SpotlightHeroCarousel` | Legacy home spotlight |
| `CampaignBannerCarousel` | Campaign banners |
| `BrandPostCarouselSection` | Brand posts |
| `TrendingBrandsCarousel` | Home brands |
| `CarouselRenderer` | Universal media engine |
| `useCarousel` / `useMediaCarousel` | Hooks — overlapping behavior |

---

## Duplicated Spacing & Layout

| Source | Purpose |
|--------|---------|
| `src/lib/pageLayout.ts` | Shell constants, grid classes, breakpoints |
| `src/lib/design/homeTokens.ts` | Homepage section rhythm |
| `src/lib/design/categoryTokens.ts` | Categories page rhythm |
| `src/index.css` | `.choosify-page-shell`, grid utilities |
| Inline `max-w-[1440px] mx-auto px-*` | Repeated ~40+ pages |

---

## Duplicated Shadows & Borders

| Pattern | Occurrences (approx.) |
|---------|----------------------|
| `border-[#e8edf2]` | 167+ files |
| `rounded-[5px]` | 97+ files |
| `shadow-sm` | Widespread |
| `.card-primary` / `.card-secondary` | CSS utilities — underused vs inline |

---

## Duplicated Buttons

No shared `Button` component. Patterns repeated:

- Primary CTA: `bg-[#E8500A] text-white rounded-full/xl uppercase font-black`
- Secondary: `border border-[#e8edf2] hover:border-[#E8500A]/30`
- Filter pills: `rounded-full px-3 py-2 text-[10px] font-bold uppercase`
- Icon circles: `w-9 h-9 rounded-full border shadow-sm`

Dedicated button files: `FollowButton`, `EmiActionButton`, `CreateSpotlightCampaignButton` only.

---

## Proto Design System (Pre-ES-001)

Already present but **not canonical**:

```
src/components/design/UniversalSection.tsx
src/components/design/UniversalCarousel.tsx
src/components/design/ViewAllLink.tsx
src/lib/design/homeTokens.ts
src/lib/design/categoryTokens.ts
```

**Recommendation:** Merge into `src/design-system/` during ES-002+ without breaking imports.

---

## Repository Risks

1. **Color drift:** `#E8500A` (legacy JSX) vs `#FF5B00` (`--color-orange-primary` in CSS theme)
2. **Radius drift:** `rounded-[5px]` (legacy) vs `rounded-2xl` / `rounded-[20px]` (editorial)
3. **Hero fragmentation:** Each major page type has its own hero implementation
4. **Card sprawl:** 35+ card components with overlapping responsibilities
5. **Parallel token files:** `homeTokens`, `categoryTokens`, `index.css @theme`, new `design-system/tokens`
6. **No Button/Input primitives:** Highest duplication surface area

---

## ES-001 Deliverables Completed

- [x] This audit document
- [x] `src/design-system/` bootstrap with token files
- [x] Component, hero, carousel, header, button, form, dialog, layout inventories
- [x] Token migration inventory (no replacements yet)
- [x] Implementation roadmap ES-002 through ES-018

---

## Out of Scope (Confirmed)

No changes to: Homepage layout, Categories layout, Products, Deals, Discover, Dashboard, Checkout, Firestore, APIs, CMS contracts, routing, auth, or business logic.
