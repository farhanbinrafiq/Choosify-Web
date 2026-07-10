# Design System Guide

Choosify design system inventory and standardization notes after LE-004. **No visual tokens were changed** in this sprint.

## Design Tokens (unchanged)

| Token | Value / pattern |
|-------|-----------------|
| Primary accent | `#E8500A` / `#E54D00` |
| Surface | `#F8FBFD`, white cards |
| Border | `#e8edf2` |
| Radius | `rounded-[5px]`, `rounded-full` for pills |
| Typography | Existing Tailwind scale — no font changes |

## Shared UI Inventory

### Buttons

| Component / pattern | Location | Notes |
|---------------------|----------|-------|
| Primary CTA | Inline Tailwind across pages | Orange fill, white text |
| `FollowButton` | `components/FollowButton.tsx` | Reusable follow action |
| Carousel nav | `PremiumCarousel`, `TrendingBrandsCarousel` | 32px circle buttons |

**Status:** No new button primitive added — patterns are consistent but not centralized. Future: `shared/Button.tsx` only if a third duplicate emerges.

### Cards

| Component | Location |
|-----------|----------|
| `ProductCard` | `components/ProductCard.tsx` |
| `BrandCardDesign` | `components/BrandCardDesign.tsx` |
| `CreatorCardDesign` | `components/CreatorCardDesign.tsx` |
| `PublicReviewCard` | `components/PublicReviewCard.tsx` |

### Badges & chips

| Component | Location |
|-----------|----------|
| `ActiveFilterChips` | `FilterEngine.tsx` |
| Tag badges | Inline on cards |

### Section headers

| Component | Location |
|-----------|----------|
| `PageHeroBanner` | `components/PageHeroBanner.tsx` |
| `PageHeroHeader` | `components/PageHeroHeader.tsx` |
| `StickySectionNav` | `components/StickySectionNav.tsx` |

### Loading & empty states

| Component | Location | Usage |
|-----------|----------|-------|
| `LoadingFallback` | `components/LoadingFallback.tsx` | Suspense boundaries |
| `Skeleton` | `components/Skeleton.tsx` | Guides, categories |
| `SkeletonLoader` | `components/SkeletonLoader.tsx` | Products listing |

**Tech debt (TD-203):** `Skeleton` and `SkeletonLoader` overlap. Consolidation deferred to avoid visual regression — markup/classes differ slightly per page.

### Dialogs & modals

| Component | Location |
|-----------|----------|
| `ReportModal` | `components/ReportModal.tsx` |
| `ClaimProfileModal` | `components/ClaimProfileModal.tsx` |
| `FloatingPanelShell` | `components/FloatingPanelShell.tsx` |

### Tables & lists

| Component | Location |
|-----------|----------|
| `PaginationBar` | `components/PaginationBar.tsx` |
| `DragScrollContainer` | `FilterEngine.tsx` |

## Filter System (standardized architecture)

```
filterProfiles.ts   →  static profile definitions (entity + filter defs)
FilterEngine.tsx    →  UI engine + hooks (useRegisterPageFilters, chips, sidebar)
Page                →  registers profile + passes filter state
```

Profiles extracted in LE-004:

- `PRODUCTS_PAGE_FILTER_PROFILE`
- `DEALS_PAGE_FILTER_PROFILE`
- `CREATORS_PAGE_FILTER_PROFILE`

## Search System (standardized architecture)

```
searchTypes.ts           →  SuggestionItem, matchers, keyword list
useSearchSuggestions.ts  →  grouped + flat suggestion derivation
GlobalSearchBar.tsx      →  input, dropdown portal, keyboard nav
```

## Compare System (standardized architecture)

```
compareData.tsx    →  mock items, sections, CompareMode type
CompareEngine.tsx  →  mode state, filter matrix, comparison UI
```

## When to Add a Shared Component

Add to `components/shared/` only when **all** are true:

1. Same markup appears in 2+ places today
2. Extraction does not change class names or structure
3. Props are stable across call sites

Do **not** add abstractions for one-off page sections.

## Studio / CMS Components (out of scope)

`StudioWrap`, `StudioEditContext`, and seller dashboard surfaces were not modified per sprint constraints.
