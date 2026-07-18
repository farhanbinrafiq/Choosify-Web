# DS-2.0 Layout Audit

**Sprint:** ES-001

---

## Core Layout System

| File | Role |
|------|------|
| `src/lib/pageLayout.ts` | Breakpoints, shell classes, grid constants, page profiles |
| `src/index.css` | `.choosify-page-shell`, grid utilities, card CSS |
| `src/lib/design/homeTokens.ts` | Homepage section spacing |
| `src/lib/design/categoryTokens.ts` | Categories page spacing |
| `src/components/design/UniversalSection.tsx` | Section wrapper proto |

---

## Page Shell Classes

| Constant | Purpose |
|----------|---------|
| `PAGE_SHELL_WRAPPER` | Outer page container |
| `PAGE_LISTING_SINGLE_SHELL` | 3-column listing grid (left filter / center / right rail) |
| `LISTING_SINGLE_FEED` | Single-column feed |
| `CATEGORY_CARD_GRID` | Category grid (`.choosify-category-grid`) |
| Product/brand grids | `.choosify-product-grid`, `.choosify-brand-grid` |

---

## Layout Modes (from pageLayout.ts)

| Mode | Viewport | Columns |
|------|----------|---------|
| `stack` | < 1024px | 1 (+ drawer) |
| `browse` | 1024–1535px | 2 (left rail + feed) |
| `full` | ≥ 1536px | 3 (left + feed + right promo) |

---

## Page Layout Profiles

| Profile | Pages |
|---------|-------|
| `home` | `/` — full-width editorial (no sidebars) |
| `listing` | products, categories, deals, brands, guides, creators, search |
| `detail` | product, brand, guide, creator detail |
| `compare` | `/compare` — no right rail |

---

## Layout Components

| Component | Path | Role |
|-----------|------|------|
| `Navbar` | `src/components/Navbar.tsx` | Global header |
| `MobileBottomNav` | `src/components/MobileBottomNav.tsx` | Mobile nav |
| `Footer` | (in App layout) | Global footer |
| `StickySectionNav` | `src/components/StickySectionNav.tsx` | In-page section nav |
| `ListingAdRail` | `src/components/ListingAdRail.tsx` | Right promo column |
| `FilterEngine` sidebar | `src/components/FilterEngine.tsx` | Left filter column |
| `MarketingLayout` | `src/pages/marketing/MarketingLayout.tsx` | CMS admin sidebar layout |
| `InteractiveCommerceLayout` | `src/components/spotlight/interactive/InteractiveCommerceLayout.tsx` | Live commerce layout |
| `SpotlightMixedFeed` | `src/components/spotlight/feed/SpotlightMixedFeed.tsx` | Spotlight feed layout |

---

## Duplicated Layout Patterns

| Pattern | Occurrences |
|---------|-------------|
| `max-w-[1440px] mx-auto px-4 sm:px-5 lg:px-6` | 40+ pages |
| `lg:sticky lg:top-24` sidebar | Listing pages |
| `choosify-middle-feed scroll-mt-36` | Feed columns |
| `bg-choosify-feed min-h-screen` | Legacy page backgrounds |
| `bg-white min-h-screen` | New editorial pages (Home, Categories) |

---

## Grid Utilities (index.css)

| Class | Columns |
|-------|---------|
| `.choosify-product-grid` | 2 → 5 |
| `.choosify-category-grid` | 2 → 5 |
| `.choosify-brand-grid` | 1 → 4 |
| `.choosify-creator-grid` | 1 → 4 |
| `.choosify-guide-media-grid` | 1 → 4 |

---

## Homepage vs Listing Layout Split

| Aspect | Homepage (LE-007) | Listing Pages |
|--------|-------------------|---------------|
| Shell | Full-width sections | 3-column progressive |
| Hero | `HomeEditorialHero` | `PageHeroBanner` |
| Background | White + tonal sections | `bg-choosify-feed` |
| Spacing | 80–120px section rhythm | Compact card grids |

**Risk:** Two visual systems coexist until ES-002–ES-004 unify tokens.

---

## Proposed DS-2.0 Layout Primitives

```
PageShell (profile: home | listing | detail | compare)
├── PageContainer (max-width + padding)
├── PageGrid (sidebar + feed + rail)
├── Section (UniversalSection)
└── Feed (single column)
```

**Target:** ES-002 exports layout primitives; listing pages migrate in ES-004+

---

## Registry / Config

| File | Role |
|------|------|
| `src/lib/spotlight/feed/layoutRegistry.ts` | Spotlight feed layouts |
| `src/lib/spotlight/feed/feedRegistry.ts` | Feed composition |
| `src/lib/platform/dashboardRegistry.ts` | Dashboard layout sections |
