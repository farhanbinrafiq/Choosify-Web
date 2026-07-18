# DS-2.0 Implementation Roadmap

**Sprint:** ES-001 (this document)  
**Baseline:** Repository normalized, tokens bootstrapped, inventories complete  
**Rule:** One experience sprint at a time. No page redesign until its ES sprint begins.

---

## Phase 0 — Foundation (Complete: ES-001)

- [x] Repository audit
- [x] `src/design-system/tokens/*`
- [x] Component/hero/carousel/header/button/form/dialog/layout inventories
- [x] Token migration inventory (no replacements)
- [x] This roadmap

---

## ES-002 — Homepage

**Goal:** Canonical DS-2.0 homepage using shared primitives.

| Task | Details |
|------|---------|
| Extract `SectionHeader` from `HomeSectionHeader` | Move to `design-system/components` |
| Merge `PremiumCarousel` → `UniversalCarousel` | Single carousel primitive |
| Wire homepage to `design-system/tokens` | Replace `homeTokens` imports gradually |
| Document homepage section registry | Align with CMS section IDs |
| **Do not** change data/CMS/routes | Presentation + primitives only |

**Key files:** `HomePage.tsx`, `src/components/home/**`, `src/lib/design/homeTokens.ts`

---

## ES-003 — Categories

**Goal:** Align categories with DS-2.0 tokens (DS-V2.1 layout already shipped).

| Task | Details |
|------|---------|
| Migrate `categoryTokens` → `design-system` | Token import swap |
| Unify `CategoryPremiumCard` styling with tokens | No layout change |
| Consolidate mobile filter drawer with FilterEngine drawer | Shared `Drawer` primitive |
| Inline expansion panel token migration | |

**Key files:** `CategoriesPage.tsx`, `CategorySubcategoryPanel.tsx`, `CategoryPremiumCard.tsx`

---

## ES-004 — Products

**Goal:** Product listing + `ProductCard` DS-2.0 variants.

| Task | Details |
|------|---------|
| `ProductCard` variant system via tokens | grid / list / featured |
| Listing shell token migration | `AllProductsPage` |
| Unify with `UniversalCommerceCard` adapter | Reduce duplication |
| Product grid spacing from `design-system` | |

---

## ES-005 — Deals

**Goal:** Campaign-first deals experience.

| Task | Details |
|------|---------|
| Deals hero → shared Hero primitive | |
| Campaign tiles (mirror homepage deals section) | |
| Token migration | `DealsPage.tsx` |

---

## ES-006 — Discover (Spotlight / Creators / Guides)

**Goal:** Unified editorial discovery.

| Task | Details |
|------|---------|
| `SpotlightDiscoverPage` layout tokens | |
| Creator/guide directory cards → shared directory card | |
| Spotlight feed card consolidation | |
| `InfluencerReviews` token migration (27× orange) | |

---

## ES-007 — Brand Directory

**Goal:** Premium brand directory.

| Task | Details |
|------|---------|
| `BrandsPage` layout + hero | |
| `BrandCardDesign` → directory card primitive | |
| Logo wall pattern from homepage brands | |

---

## ES-008 — Brand Details

**Goal:** Brand detail editorial experience.

| Task | Details |
|------|---------|
| `BrandDetailPage` (37× `#E8500A`) token migration | |
| Hero + tab system | |
| Brand post carousel unification | |

---

## ES-009 — Product Details

**Goal:** Premium PDP.

| Task | Details |
|------|---------|
| `ProductDetailPage` token migration | |
| Media gallery → shared carousel | |
| `DetailHeroSummaryBar` → Hero primitive | |
| `SizeGuideModal` → Dialog primitive | |

---

## ES-010 — Dashboard

**Goal:** User dashboard DS-2.0 (68× `#E8500A` — highest debt).

| Task | Details |
|------|---------|
| Dashboard layout sections | |
| Vault cards | |
| Button primitive migration | |
| Sidebar nav tokens | |

---

## ES-011 — Checkout

**Goal:** Checkout flow polish.

| Task | Details |
|------|---------|
| Form primitives (`Input`, `FormField`) | |
| Step indicator | |
| `CheckoutPage` + `RetailCartPage` tokens | |

---

## ES-012 — Order Success

**Goal:** Confirmation experience.

| Task | Details |
|------|---------|
| Success hero | |
| Order summary cards | |
| Cross-sell carousel | |

---

## ES-013 — Search

**Goal:** Omni search experience (35× `#E8500A`).

| Task | Details |
|------|---------|
| `GlobalSearchBar` → `SearchInput` primitive | |
| `SearchPage` results layout | |
| Filter integration (ES-015 dependency) | |

---

## ES-014 — Messaging

**Goal:** Messages inbox DS-2.0.

| Task | Details |
|------|---------|
| Extract inline modals from `MessagesPage` | |
| Message bubble tokens | |
| Product card in chat → shared mini card | |

---

## ES-015 — Universal Filters

**Goal:** Single filter system.

| Task | Details |
|------|---------|
| `FilterEngine` refactor | |
| Shared `Drawer`, `PillButton`, `FilterCheckboxRow` | |
| `useRegisterPageFilters` unchanged API | |
| Migrate all listing pages | |

---

## ES-016 — Motion

**Goal:** Unified motion language.

| Task | Details |
|------|---------|
| `motion.ts` → CSS variables / Framer presets | |
| `prefers-reduced-motion` global support | |
| Carousel + expansion animation standards | |
| Optional `ThemeProvider` / motion context | |

---

## ES-017 — Mobile

**Goal:** Mobile editorial hierarchy (not generic card lists).

| Task | Details |
|------|---------|
| Bottom nav token alignment | |
| Touch target audit (44px minimum) | |
| Horizontal scroll patterns | |
| Mobile filter drawer UX | |

---

## ES-018 — Final Polish

**Goal:** Cross-surface consistency pass.

| Task | Details |
|------|---------|
| Remaining `#E8500A` → token migration | |
| Deprecate `src/lib/design/*` proto tokens | |
| Remove unused legacy components (`CategoryPhotoCard`, `ModernCarousel`, etc.) | |
| Lighthouse + a11y audit | |
| Design QA vs reference mocks | |

---

## Dependency Graph

```
ES-001 (Foundation)
  └── ES-002 (Homepage) ──┬── ES-003 (Categories)
                          ├── ES-004 (Products) ── ES-009 (PDP)
                          ├── ES-005 (Deals)
                          └── ES-006 (Discover)

ES-015 (Filters) ── blocks ── ES-004, ES-005, ES-007, ES-013
ES-016 (Motion) ── parallel after ES-002
ES-017 (Mobile) ── after ES-002 + ES-003
ES-018 (Polish) ── last
```

---

## Success Criteria (Program-Level)

- [ ] Single token source: `src/design-system/tokens`
- [ ] Shared primitives: Button, Input, SectionHeader, Carousel, Hero, Dialog, Section
- [ ] No new hardcoded `#E8500A` in migrated pages
- [ ] All pages feel like one premium product company
- [ ] Zero regressions to CMS, APIs, routing, auth, business logic

---

## Explicit Stop Point

**ES-001 ends here.** Do not begin ES-002 until approved.
