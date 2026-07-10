# Component Architecture

Choosify storefront component organization after LE-004 modularization.

## Principles

- **Zero visual change** — extractions preserve markup, classes, and behavior.
- **Single responsibility** — presentation components render; hooks own derived state; services/utils own transforms.
- **Colocation by domain** — page-specific UI lives under `components/<domain>/`.
- **Backward-compatible exports** — `FilterEngine` re-exports filter profiles so existing imports keep working.

## Folder Layout

```
src/
├── components/
│   ├── brand/          # Brand detail presentation
│   ├── compare/        # Compare engine data + future UI slices
│   ├── filter/         # Filter profile definitions
│   ├── home/           # Homepage carousels
│   ├── search/         # Search types and shared search UI
│   ├── guide/          # Guide carousel cards (LE-003)
│   └── shared/         # Reserved for cross-page primitives (future)
├── hooks/
│   └── useSearchSuggestions.ts
├── pages/              # Route-level orchestration only
├── services/           # API / data orchestration (existing)
└── utils/              # Pure helpers (existing)
```

## Priority Pages — Decomposition Status

| Page / Component | Before (lines) | After (lines) | Extracted modules |
|------------------|----------------|---------------|-------------------|
| `HomePage` | 1,900 | 1,526 | `TrendingBrandsCarousel`, `PremiumCarousel` |
| `BrandDetailPage` | 2,449 | 2,422 | `TikTokIcon`, `BrandInfluencerReviewsSection` |
| `CompareEngine` | 1,921 | 1,475 | `compare/compareData.tsx` |
| `FilterEngine` | 1,541 | 1,590* | `filter/filterProfiles.ts` |
| `GlobalSearchBar` | 908 | 797 | `useSearchSuggestions`, `search/searchTypes` |

\*FilterEngine line count includes re-export shim; profile definitions moved to `filterProfiles.ts` (93 lines).

## Component Layers

### 1. Pages (`src/pages/`)

Route entry points. Responsibilities:

- Wire context and hooks
- Compose domain components
- Register page filters via `useRegisterPageFilters`

Pages should not contain large inline mock datasets or carousel implementations.

### 2. Domain Components (`src/components/<domain>/`)

| Module | Responsibility |
|--------|----------------|
| `home/TrendingBrandsCarousel` | Trending brands horizontal carousel with touch/drag |
| `home/PremiumCarousel` | Generic premium carousel shell (products, guides, creators) |
| `brand/TikTokIcon` | TikTok SVG icon |
| `brand/BrandInfluencerReviewsSection` | Lazy-loaded influencer reviews block for brand pages |
| `compare/compareData` | Compare mock items, sections, and types |
| `filter/filterProfiles` | CMS-style filter profile configs |

### 3. Hooks (`src/hooks/`)

| Hook | Responsibility |
|------|----------------|
| `useSearchSuggestions` | Builds grouped + flat autocomplete suggestion lists |
| `useSectionScrollSpy` | Sticky section nav (existing) |
| `useCarousel` | Carousel index state (existing) |

### 4. Engine Components (retained in place)

`FilterEngine.tsx` remains the filter UI engine (chips, sidebar, drag scroll, registration). Profile **data** is externalized; rendering logic stays centralized to avoid breaking `UniversalFilterRenderer` consumers.

## Import Conventions

```tsx
// Page imports domain component
import { PremiumCarousel } from '../components/home/PremiumCarousel';

// Engine re-exports profiles (backward compatible)
import { PRODUCTS_PAGE_FILTER_PROFILE } from '../components/FilterEngine';

// Or direct profile import
import { PRODUCTS_PAGE_FILTER_PROFILE } from '../components/filter/filterProfiles';
```

## Remaining Decomposition Targets

1. **BrandDetailPage** (~2,422 lines) — hero, sidebar, product grid, stats sections
2. **ProductDetailPage** (~1,849 lines) — gallery, specs, reviews tabs
3. **CompareEngine** (~1,475 lines) — comparison row, mode selector, filter panel UI
4. **GuidesPage** (~1,359 lines) — section cards, filter bar

## Performance Guardrails (LE-004)

- No new React contexts
- No duplicated state between page and extracted child
- `React.memo` only where already beneficial (`ProductCard` from LE-003)
- Lazy boundaries preserved (`BrandInfluencerReviewsSection`, `HomeGuideCarouselCard`)

## Related Docs

- [DESIGN_SYSTEM_GUIDE.md](./DESIGN_SYSTEM_GUIDE.md)
- [REFACTOR_REPORT.md](./REFACTOR_REPORT.md)
