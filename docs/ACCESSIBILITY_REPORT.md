# LE-001 — Accessibility Report (WCAG 2.2 AA Target)

**Date:** 2026-07-09  
**Standard:** WCAG 2.2 Level AA (target)  
**Method:** Static code audit — not a substitute for automated axe/Lighthouse + manual screen reader testing.

---

## Summary

| App | `aria-*` usage | Focus management | Labels | Keyboard | Est. compliance |
|-----|----------------|------------------|--------|----------|-----------------|
| **Storefront** | ~90+ across 40 files | Partial | Partial | Good on nav/search | **~60–70% AA** |
| **Admin** | ~8 across 3 files | Minimal | Poor | Unknown | **~30–40% AA** |

The storefront has meaningful accessibility work (navbar, search, carousels, modals). The admin console requires a dedicated accessibility sprint before claiming AA compliance.

---

## Storefront — Strengths

| Component / Area | Implementation |
|------------------|----------------|
| `Navbar.tsx` | Multiple `aria-label`, menu toggle |
| `GlobalSearchBar.tsx` | Combobox patterns, `aria-expanded` |
| `PageHeroBanner.tsx` | Decorative vs informative roles |
| `CompareEngine.tsx` | Table semantics, comparison labels |
| `VideoLightbox.tsx` | Focus trap patterns (verify) |
| `PaginationBar.tsx` | Nav labels |
| `CartDrawer.tsx` | Drawer accessibility partial |
| `PageBreadcrumbs.tsx` | `nav` + `aria-current` |
| `StickySectionNav.tsx` | Section navigation |
| `index.css` | `prefers-reduced-motion` consideration (verify full coverage) |

---

## Storefront — Gaps

### 1. Perceivable (WCAG 1.x)

| Issue | Location | WCAG | Fix |
|-------|----------|------|-----|
| Color contrast unverified | Orange `#FF5B00` on white/navy | 1.4.3 | Run contrast audit on badges, links |
| Missing alt text patterns | Product cards, brand logos | 1.1.1 | Enforce `alt={product.title}` |
| Carousel auto-play | `CampaignBannerCarousel`, `ModernCarousel` | 2.2.2 | Pause control + respect reduced motion |
| No skip link | `App.tsx` layout | 2.4.1 | Add "Skip to main content" |

### 2. Operable (WCAG 2.x)

| Issue | Location | WCAG | Fix |
|-------|----------|------|-----|
| Modal focus trap incomplete | `SignInModal`, `SizeGuideModal`, `ClaimProfileModal` | 2.4.3 | Use focus-trap library or Radix Dialog |
| Keyboard grid navigation | Product grids | 2.1.1 | Roving tabindex on cards |
| Touch targets <44px | Mobile action chips | 2.5.8 | Increase hit areas |
| Filter drawer | `FilterEngine` | 2.4.3 | Trap focus, Esc to close, return focus |

### 3. Understandable (WCAG 3.x)

| Issue | Location | WCAG | Fix |
|-------|----------|------|-----|
| Form errors not linked | `LoginSignUpPage`, `CheckoutPage` | 3.3.1 | `aria-invalid` + `aria-describedby` |
| Language attribute | `index.html` | 3.1.1 | Verify `lang="en"` or `bn` |
| Consistent navigation | Global | 3.2.3 | ✅ Navbar consistent |

### 4. Robust (WCAG 4.x)

| Issue | Location | WCAG | Fix |
|-------|----------|------|-----|
| Custom components without roles | Various cards | 4.1.2 | Add semantic HTML (`article`, `button`) |
| Live regions for toasts | `react-hot-toast` | 4.1.3 | Configure `aria-live` politeness |

---

## Admin — Critical Gaps

Almost no ARIA outside:
- `AdminLayout.tsx` (4 usages)
- `Splitter.tsx` (1)
- `index.css` (3)

### High-risk areas
| Area | Risk |
|------|------|
| `ProductStudio` / `WebsiteCMSStudio` | Thousands of form fields without systematic labels |
| `Messages.tsx` | Chat UI — needs live regions, message list semantics |
| `Orders.tsx` | Data tables — need `<th scope>`, caption, sort announcements |
| Modals across admin | Focus trap, Esc handling unknown |
| `InvoiceView.tsx` | Print view — ensure heading hierarchy |
| Charts (`recharts`) | SVG charts need text alternatives / data tables |

---

## Keyboard Navigation Checklist

| Pattern | Storefront | Admin |
|---------|------------|-------|
| Tab order logical | Partial | Unknown |
| Visible focus ring | Tailwind — verify not removed | Often `outline-none` risk |
| Esc closes overlays | Partial | Unknown |
| Arrow keys in menus | Search autocomplete partial | Unknown |
| Enter submits forms | Yes | Yes |

---

## Screen Reader Testing (Recommended)

Manual pass with NVDA (Windows) / VoiceOver (macOS):

1. Homepage — hero, search, product grid
2. Product detail — gallery, add to compare, tabs
3. Checkout flow
4. Admin login → Orders list → open detail
5. CMS studio — save version announcement

---

## Color Contrast Notes

**Do not change brand colors per LE-001.** If contrast fails:
- Use darker orange only for **text** via token (e.g. `--accent-text`) while keeping `--accent-brand` for fills
- Add non-color indicators (icons, underlines) for states

| Token | Value | Usage |
|-------|-------|-------|
| Storefront accent | `#FF5B00` | CTAs, links |
| Admin accent | `#F97316` | CTAs |
| Navy backgrounds | Various | Verify white text contrast |

---

## Remediation Roadmap

### Phase 1 (P0) — 1 sprint
- [ ] Skip navigation link (storefront)
- [ ] Modal focus traps (top 5 modals both apps)
- [ ] Form field wrapper: `<Label>` + error `id` + `aria-describedby`
- [ ] Image `alt` audit on `ProductCard`, `BrandCardDesign`

### Phase 2 (P1) — 2 sprints
- [ ] Admin data tables — semantic table markup
- [ ] Carousel pause controls
- [ ] `aria-live` for async loading states
- [ ] axe-core in CI on key routes

### Phase 3 (P2) — ongoing
- [ ] Full admin studio a11y review
- [ ] Chart accessible summaries
- [ ] WCAG 2.2 AAA aspirational items (target size, dragging alternatives)

---

## Tooling Recommendations

```bash
# Add to CI (both apps)
npm install -D @axe-core/cli eslint-plugin-jsx-a11y
npx axe https://choosify.bd --tags wcag2aa
```

ESLint `eslint-plugin-jsx-a11y` rules:
- `label-has-associated-control`
- `click-events-have-key-events`
- `no-autofocus`
- `aria-props`
- `aria-role`

---

## Compliance Statement

**This audit does not certify WCAG 2.2 AA compliance.** It documents gaps and a remediation path. Formal VPAT/ACR requires third-party testing after fixes.
