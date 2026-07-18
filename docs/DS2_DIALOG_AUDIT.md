# DS-2.0 Dialog & Overlay Audit

**Sprint:** ES-001

---

## Modal Components

| Component | Path | Trigger | Backdrop |
|-----------|------|---------|----------|
| `SignInModal` | `src/components/SignInModal.tsx` | Navbar auth | Fixed overlay |
| `ClaimProfileModal` | `src/components/ClaimProfileModal.tsx` | Brand claim CTA | Fixed overlay |
| `ReportModal` | `src/components/ReportModal.tsx` | Report action | Fixed overlay |
| `SizeGuideModal` | `src/components/SizeGuideModal.tsx` | Product size guide | Fixed overlay |

---

## Drawer / Panel Overlays

| Component | Path | Type |
|-----------|------|------|
| `FilterEngine` mobile drawer | `src/components/FilterEngine.tsx` | Left slide drawer |
| `CategoriesPage` mobile drawer | `src/pages/CategoriesPage.tsx` | Left slide drawer (duplicate of FilterEngine pattern) |
| `FloatingOverlays` | `src/components/FloatingOverlays.tsx` | Cart, compare, EMI panels |
| `CartPreviewPanel` | `src/components/CartPreviewPanel.tsx` | Slide/floating cart |
| `MessagesPreviewPanel` | `src/components/MessagesPreviewPanel.tsx` | Messages preview |
| `EmiChatPanel` | `src/components/EmiChatPanel.tsx` | EMI sidecar chat |
| `FloatingPanelShell` | `src/components/FloatingPanelShell.ts` | Shell utility |

---

## Inline Page Modals (Not Extracted)

| Page | Pattern |
|------|---------|
| `MessagesPage.tsx` | Product card modal, order modal (inline JSX ~780+) |
| `DashboardPage.tsx` | Confirmation overlays |
| `ProductDetailPage.tsx` | Size guide trigger → SizeGuideModal |
| Marketing CMS pages | Editor side panels |

---

## Recurring Overlay Patterns

### Modal Shell

```
fixed inset-0 z-50 bg-black/60
+ centered white rounded-3xl shadow-2xl p-6 md:p-8
+ animate-in zoom-in-95
```

### Drawer Shell

```
fixed top-0 left-0 bottom-0 w-4/5 max-w-xs z-50
+ motion slide x: -100% → 0
+ backdrop fixed inset-0 bg-black/60 z-50
```

### Close Button

```
w-8 h-9 rounded-full border hover:text-[#E8500A]
```

---

## Z-Index Usage (Observed)

| Layer | Typical z-index |
|-------|-----------------|
| Sticky nav | z-30 |
| Dropdowns | z-20–40 |
| Drawer backdrop | z-50 |
| Drawer panel | z-50 |
| Modals | z-50–60 |
| Toasts | react-hot-toast default |

**Canonical:** `design-system/tokens/zIndex.ts`

---

## Duplication Issues

1. **Drawer logic duplicated** — FilterEngine vs CategoriesPage vs other listing pages
2. **No shared `Dialog` primitive** — 4 modals + inline copies
3. **Focus trap inconsistent** — not all modals trap focus
4. **Escape key handling** ad hoc

---

## Proposed DS-2.0 Overlay API

```
Dialog
├── DialogTrigger
├── DialogContent
├── DialogHeader / DialogTitle / DialogDescription
├── DialogFooter
└── DialogClose

Drawer (mobile filters)
├── DrawerTrigger
├── DrawerContent (side: left | right | bottom)
└── DrawerClose
```

**Target sprint:** ES-015 (filter drawer unification), ES-014 (messaging modals)

---

## Accessibility Checklist (Future)

- [ ] Focus trap in all modals
- [ ] `aria-modal="true"` on dialog content
- [ ] Escape to close
- [ ] Return focus to trigger on close
- [ ] `prefers-reduced-motion` for slide animations
