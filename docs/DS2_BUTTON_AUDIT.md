# DS-2.0 Button Audit

**Sprint:** ES-001  
**Finding:** No shared `Button` primitive. All buttons are inline `<button>` / `<Link>` with duplicated Tailwind classes.

---

## Named Button Components

| Component | Path | Variants |
|-----------|------|----------|
| `FollowButton` | `src/components/FollowButton.tsx` | Follow / following states |
| `EmiActionButton` | `src/components/emi/EmiActionButton.tsx` | EMI assistant actions |
| `CreateSpotlightCampaignButton` | `src/components/spotlight/cms/CreateSpotlightCampaignButton.tsx` | CMS create CTA |

---

## Recurring Inline Patterns

### Primary CTA (Orange)

```
bg-[#E8500A] hover:bg-[#CF4400] text-white font-black uppercase tracking-wider rounded-xl|rounded-full
```

**Heavy usage:** DashboardPage, HomeEditorialHero, HomeCompareSection, CategoriesPage, CheckoutPage, OrderSuccessPage, CompareEngine, FilterEngine pills (active state)

### Secondary / Outline

```
border border-[#e8edf2] hover:border-[#E8500A]/30 text-[#1A1D4E] rounded-xl|rounded-full
```

**Heavy usage:** HomeEditorialHero secondary CTA, category chips, filter panels

### Filter / Nav Pills

```
px-3 py-2 rounded-full text-[10px] font-bold uppercase
active: bg-[#1A1D4E] text-white | bg-[#E8500A] text-white
inactive: bg-white border-[#e8edf2] text-gray-500
```

**Heavy usage:** FilterEngine, StickySectionNav, CategoriesQuickNav, SpotlightHubNav, CompareEngine tabs

### Icon Circle Buttons

```
w-8|w-9|w-10 h-8|h-9|h-10 rounded-full border shadow-sm flex items-center justify-center
```

**Heavy usage:** ProductCard, Navbar, carousels, modals close buttons

### Destructive / Ghost

```
text-red-* border-red-* bg-transparent
```

**Heavy usage:** CompareEngine remove, dashboard delete actions

---

## Top Files by Button Pattern Density

| File | Notes |
|------|-------|
| `FilterEngine.tsx` | Filter toggles, drawer triggers, reset |
| `Navbar.tsx` | Auth, cart, compare, mobile menu |
| `CompareEngine.tsx` | Compare tabs, add product, CTA |
| `DashboardPage.tsx` | Vault actions, browse CTAs |
| `MessagesPage.tsx` | Send, modal actions |
| `GlobalSearchBar.tsx` | Search submit, filter chips |
| `ClaimProfileModal.tsx` | Form actions |
| `SignInModal.tsx` | Auth submit |

---

## Accessibility Gaps

| Issue | Locations |
|-------|-----------|
| Inconsistent `min-h-[44px]` touch targets | Older 32–36px buttons |
| Missing `type="button"` on non-submit buttons | Various |
| Focus rings inconsistent | Some use `focus-visible:ring-[#E8500A]`, many omit |
| Icon-only buttons sometimes missing `aria-label` | Carousel arrows, card actions |

---

## Proposed DS-2.0 Button Variants

| Variant | Use |
|---------|-----|
| `primary` | Orange filled CTA |
| `secondary` | Outline / ghost |
| `navy` | Dark filled (compare, hero) |
| `pill` | Filter / nav pills |
| `icon` | Circle icon button |
| `link` | Text link styled as button |
| `destructive` | Remove / delete |

**Sizes:** `sm`, `md`, `lg`  
**Target sprint:** ES-002 foundation (primitives only, no page migration)

---

## Consolidation Plan

1. Create `src/design-system/components/Button.tsx` (ES-002 prep)
2. Migrate homepage CTAs first (ES-002)
3. Migrate FilterEngine pills via shared `PillButton` (ES-015)
4. Do **not** global find-replace — page-by-page only
