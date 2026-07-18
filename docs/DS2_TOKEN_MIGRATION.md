# DS-2.0 Token Migration Inventory

**Sprint:** ES-001  
**Status:** Inventory only — **do not replace values until assigned sprint**

Counts are repository-wide (`src/`, `.tsx/.ts/.css`) as of audit date.

| Value Class | Approx. Occurrences | Canonical Token |
|-------------|---------------------|-----------------|
| `#E8500A` | 208 | `colors.brand.orange.legacy` → migrate to `colors.brand.orange.primary` |
| `#1A1D4E` | 65+ | `colors.brand.navy.heading` |
| `#e8edf2` | 167+ | `colors.border.DEFAULT` |
| `rounded-[5px]` | 97+ | `radius.md` / `radiusClass.legacyCard` |
| `rounded-[20px]` | Growing | `radius['2xl']` / `radiusClass.editorialCard` |
| `max-w-[1440px]` | 40+ | `spacing.contentWidth.shell` |
| `shadow-sm` | Widespread | `shadowClass.card` |
| `duration-300` | Widespread | `motion.duration.slow` |
| `py-16 md:py-20` | Homepage sections | `sectionSpacing.md` |

---

## Sample Migration Rows (Representative)

| File | Line | Current Value | Recommended Token |
|------|------|---------------|-------------------|
| `src/pages/DashboardPage.tsx` | 55 | `#E8500A` | `colors.brand.orange.legacy` |
| `src/pages/DashboardPage.tsx` | 95 | `border-[#e8edf2] rounded-[5px] shadow-sm` | `colors.border.DEFAULT`, `radius.md`, `shadowClass.card` |
| `src/pages/DashboardPage.tsx` | 257 | `bg-[#E8500A]` | `colors.brand.orange.legacy` |
| `src/components/ProductCard.tsx` | 326 | `rounded-[5px] border-[#e8edf2] duration-300` | `radius.md`, `colors.border.DEFAULT`, `motion.duration.slow` |
| `src/components/ProductCard.tsx` | 499 | `rounded-[5px] border-[#e8edf2]` | `radius.md`, `colors.border.DEFAULT` |
| `src/components/Navbar.tsx` | various | `#E8500A`, `#1A1D4E` | `colors.brand.orange.*`, `colors.brand.navy.heading` |
| `src/components/GlobalSearchBar.tsx` | various | `#E8500A` focus rings | `colors.brand.orange.primary` |
| `src/components/CompareEngine.tsx` | 88-92 | CTA pill classes | DS Button `variant="primary"` (future) |
| `src/components/FilterEngine.tsx` | various | `rounded-[5px]`, `#FFF0E8` | `radius.md`, `colors.surface.selected` |
| `src/pages/BrandDetailPage.tsx` | various | 37× `#E8500A` | Bulk migrate in ES-008 |
| `src/pages/SearchPage.tsx` | various | 35× `#E8500A` | Bulk migrate in ES-013 |
| `src/pages/ProductDetailPage.tsx` | various | 31× `#E8500A` | Bulk migrate in ES-009 |
| `src/pages/CategoriesPage.tsx` | various | `#E8500A`, `rounded-[5px]` | ES-003 (post-bootstrap) |
| `src/components/home/HomeEditorialHero.tsx` | various | `#E8500A`, `#FF6B00` | `colors.brand.orange.*` |
| `src/lib/design/homeTokens.ts` | 11-15 | `#F7F8FA`, `#F4F8FC` | `colors.surface.muted`, `colors.surface.softBlue` |
| `src/lib/design/categoryTokens.ts` | 7-8 | hover transition classes | `motionClass.hoverLift` |
| `src/index.css` | 18-26 | `@theme` color defs | **Source of truth** — `design-system/tokens/colors.ts` mirrors these |
| `src/index.css` | 86-98 | `.card-primary` shadow/border | `shadows.md`, `colors.border.DEFAULT` |

---

## Top Files by `#E8500A` Usage (Priority Migration)

| File | Count | Target Sprint |
|------|-------|---------------|
| `src/pages/DashboardPage.tsx` | 68 | ES-010 |
| `src/pages/BrandDetailPage.tsx` | 37 | ES-008 |
| `src/pages/SearchPage.tsx` | 35 | ES-013 |
| `src/pages/ProductDetailPage.tsx` | 31 | ES-009 |
| `src/components/InfluencerReviews.tsx` | 27 | ES-006 |
| `src/components/GlobalSearchBar.tsx` | 24 | ES-013 |
| `src/pages/CreatorProfilePage.tsx` | 24 | ES-006 |
| `src/pages/DealsPage.tsx` | 20 | ES-005 |
| `src/pages/BrandsPage.tsx` | 20 | ES-007 |
| `src/pages/CreatorsPage.tsx` | 20 | ES-006 |

---

## CSS Theme vs JSX Drift

| CSS `@theme` | Common JSX | Action |
|--------------|------------|--------|
| `--color-orange-primary: #FF5B00` | `#E8500A`, `#FF6B00` | Unify under `colors.brand.orange` |
| `--color-heading: #1A1D4E` | `#1a1a2e`, `#1A1D4E` | Unify under `colors.text.*` |
| `--color-choosify-feed: #F0F8FF` | `bg-choosify-feed`, `bg-white` | Document page background tokens |

---

## Migration Rules (ES-002+)

1. **Never change values** during token swap — map equivalent colors only
2. Replace **page-by-page** in assigned ES sprint, not globally
3. Prefer Tailwind theme extension over raw hex once tokens are wired
4. Deprecate `src/lib/design/*` after homepage/categories consume `design-system`
5. Keep `index.css @theme` as runtime source until Tailwind v4 token pipeline is unified

---

## Automated Re-scan Command

```bash
rg -c "#E8500A|#1A1D4E|#e8edf2|rounded-\[5px\]" --glob "*.{tsx,ts,css}" src
```
