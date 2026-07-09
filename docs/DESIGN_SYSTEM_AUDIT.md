# LE-001 — Design System Audit

**Date:** 2026-07-09  
**Constraint:** Do not redesign. Document tokens and consistency gaps only.

---

## Overview

Choosify uses **Tailwind CSS v4** with extensive custom CSS in `index.css` for each app. There is no shared component library (shadcn, Radix, etc.). Visual consistency is achieved through copy-paste Tailwind classes and CSS variables — effective but fragile at scale.

| App | Primary font | Accent | CSS size |
|-----|--------------|--------|----------|
| Storefront | Inter, DM Sans | `#FF5B00` (orange-primary) | ~925 lines |
| Admin | Plus Jakarta Sans | `#F97316` | ~1,306 lines |

**Brand divergence:** Accent oranges differ by hex between apps. Acceptable if intentional (storefront vs admin), but document as two tokens in a future shared spec.

---

## Design Tokens (Extracted)

### Storefront (`Choosify-Web/src/index.css`)

Recommend formalizing these as documented tokens (no visual change):

```css
/* Brand */
--color-orange-primary: #FF5B00;
--color-navy: /* navy backgrounds in App/layout */;

/* Typography */
--font-sans: 'Inter', system-ui, sans-serif;
--font-display: 'DM Sans', sans-serif;

/* Semantic (infer from usage) */
--radius-card: /* rounded-xl / 2xl patterns */;
--shadow-card: /* shadow-sm / md on cards */;
--spacing-section: /* py-12 / py-16 page sections */;
```

### Admin (`choosify-admin-4.0/src/index.css`)

```css
--accent: #F97316;
--font-primary: 'Plus Jakarta Sans', sans-serif;
/* Sidebar width, split pane handles, admin chrome */
```

### Recommended shared token file (future)

```
packages/design-tokens/
  colors.json      # brand, semantic, surface
  typography.json
  spacing.json
  radii.json
  shadows.json
```

Import into both Tailwind configs without changing rendered values.

---

## Component Patterns Audit

### Buttons

| Variant | Storefront | Admin | Consistent? |
|---------|------------|-------|-------------|
| Primary CTA | `bg-orange-primary text-white` | `bg-[#F97316]` / similar | ~80% |
| Secondary | `border border-white/10` | Gray bordered | Partial |
| Ghost | Text links in nav | Sidebar items | Partial |
| Disabled | Opacity-50 | Varies | ❌ |

**Issue:** No `<Button variant="primary" size="md">` primitive — 50+ inline implementations.

**Recommendation:** Extract `Button` with same class strings (zero visual change).

---

### Cards

| Type | Files | Pattern |
|------|-------|---------|
| Product | `ProductCard.tsx` | Image, badge, price, rating |
| Brand | `BrandCardDesign.tsx` | Logo, name, stats |
| Creator | `CreatorCardDesign.tsx` | Avatar, followers |
| Recommendation | `RecommendationCard.tsx` | Guide/blog card |
| Admin stat | Dashboard cards | Inline in pages |

**Consistency:** Good visual language on storefront; admin cards vary by page.

---

### Inputs

| Type | Storefront | Admin |
|------|------------|-------|
| Text | Native + Tailwind | Native + RHF |
| Search | `GlobalSearchBar`, `HeroSearchBar` | Admin search bars |
| Select | Native | Native |
| Textarea | Studio edit | Studio forms |

**Gaps:** No shared `Input` with consistent focus ring, error state, label spacing.

---

### Tables

- Admin: HTML tables in Orders, Inventory, Analytics — inconsistent header styles
- Storefront: CompareEngine uses table layout ✅

**Recommendation:** `DataTable` shell with sticky header, zebra optional (match existing look).

---

### Badges

- `ProductStatusBadge.tsx`, `eventBadges.ts`, inline `rounded-full px-2 py-0.5 text-[10px]`
- **Recommendation:** `Badge` component with `variant: success | warning | deal | neutral`

---

### Dialogs / Modals

| Modal | Storefront | Focus trap |
|-------|------------|------------|
| `SignInModal` | ✅ | Unknown |
| `SizeGuideModal` | ✅ | Unknown |
| `ClaimProfileModal` | ✅ | Unknown |
| `ReportModal` | ✅ | Unknown |
| Admin modals | Many inline | Unknown |

**Pattern:** Fixed overlay + centered panel + `motion` animations — consistent visually.

---

### Icons

- **Library:** `lucide-react` v0.546 (both apps) ✅
- **Issue:** Storefront build splits per-icon chunks (good); avoid barrel imports
- **Custom:** `ChoosifyIconLogo.tsx`

---

### Shadows & Border Radius

| Element | Typical classes |
|---------|-----------------|
| Cards | `rounded-xl` / `rounded-2xl`, `shadow-sm` |
| Modals | `rounded-2xl`, `shadow-2xl` |
| Buttons | `rounded-lg` / `rounded-full` (pills) |
| Inputs | `rounded-lg` |

**Consistent enough** on storefront; admin studios use mixed radii.

---

### Animation & Transitions

| Library | Usage |
|---------|-------|
| `motion` (Framer Motion successor) | Page transitions in `App.tsx`, modals, carousels |
| CSS transitions | Hover states, `transition-all` |

**Recommendation:** Document standard durations:
- Micro: 150ms (hover)
- Panel: 200–300ms (drawers)
- Page: 300ms (`AnimatePresence`)

Respect `prefers-reduced-motion` globally (extend existing CSS).

---

## Spacing & Typography

### Storefront typography scale (observed)

| Use | Classes |
|-----|---------|
| Page title | `text-2xl` – `text-4xl` font-bold |
| Section title | `text-xl` font-semibold |
| Card title | `text-sm` – `text-base` font-semibold |
| Meta/caption | `text-[10px]` – `text-xs` uppercase tracking-widest |

### Admin typography
- Denser UI, smaller labels (`text-[10px] uppercase tracking-widest`)
- Studio pages mix preview + form typography

**Issue:** Magic numbers (`text-[10px]`, `text-[11px]`) — map to token scale `text-caption`, `text-label`.

---

## Layout Patterns

| Pattern | Storefront | Admin |
|---------|------------|-------|
| Max width container | `max-w-7xl mx-auto` | Full width |
| Page hero | `PageHeroBanner`, `StaticPageHero` | Admin page headers |
| Sticky nav | `StickySectionNav` | Sidebar fixed |
| Grid | `grid-cols-2 md:grid-cols-4` | Varies |

---

## Duplicated Styling (DRY opportunities)

1. **Hero sections** — `PageHeroBanner`, `PageHeroHeader`, `StaticPageHero` overlap
2. **Skeleton loaders** — two components, similar animations
3. **Empty states** — inline per page, no `EmptyState` component
4. **Filter chips** — duplicated in FilterEngine + listing pages
5. **Orange CTA button** — 100+ copies of same class string

---

## Design System Maturity Score

| Dimension | Score (1–5) | Notes |
|-----------|-------------|-------|
| Color tokens | 3 | CSS vars exist, not fully systematic |
| Typography | 3 | Consistent feel, magic numbers |
| Components | 2 | Few primitives, many one-offs |
| Documentation | 1 | This audit is first formal doc |
| Cross-app parity | 2 | Different fonts/accents |

---

## Recommendations (No Visual Change)

1. **Document tokens** in `DESIGN_TOKENS.md` mirroring current CSS exactly
2. **Extract 5 primitives:** Button, Input, Badge, Card shell, Modal shell — copy existing classes verbatim
3. **Unify skeleton** into one component
4. **Create `EmptyState` and `ErrorState`** matching existing empty page designs
5. **Shared tailwind preset** (`@choosify/tailwind-config`) for both apps
6. **Do not** change `#FF5B00` / `#F97316` without brand approval

---

## Storefront Design System Preview Route

`App.tsx` contains an `Overview` route rendering a "Design System v1.0" / "13-Screen Stack" sidebar. This is a **dev/design artifact**, not production UX.

**Recommendation:** Gate with `import.meta.env.DEV` or remove from production bundle.
