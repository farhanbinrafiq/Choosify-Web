# DS-2.0 Form & Input Audit

**Sprint:** ES-001

---

## Modal / Form Components

| Component | Path | Inputs |
|-----------|------|--------|
| `SignInModal` | `src/components/SignInModal.tsx` | Email, password, OAuth |
| `ClaimProfileModal` | `src/components/ClaimProfileModal.tsx` | Brand claim form |
| `ReportModal` | `src/components/ReportModal.tsx` | Report reason, details |
| `SizeGuideModal` | `src/components/SizeGuideModal.tsx` | Read-only table |
| `AddressBookManager` | `src/components/address/AddressBookManager.tsx` | Address fields |
| `GlobalSearchBar` | `src/components/GlobalSearchBar.tsx` | Omni search input |
| `HeroSearchBar` | `src/components/HeroSearchBar.tsx` | Hero search |
| `FilterEngine` | `src/components/FilterEngine.tsx` | Search + filter sidebar inputs |

---

## Recurring Input Patterns

### Standard Text Input

```
h-9|h-11 pl-8|pl-11 pr-3 bg-white border border-[#e8edf2] rounded-[5px]|rounded-xl|rounded-2xl
text-[11px]|text-sm font-semibold focus:outline-none focus:border-[#E8500A]/40|/50
```

**Used in:** FilterEngine, CategoriesPage, CompareEngine, SearchPage, marketing CMS editors

### Large Compare / Hero Input

```
h-14 pl-11 rounded-2xl bg-[#F8FBFD] focus:bg-white
```

**Used in:** HomeCompareSection, CategoriesDiscoveryHero (N/A), CompareEngine

### Search with Icon

```
relative + absolute left-3 Search icon + input pl-8
```

**Duplicated in:** FilterEngine, CategoriesPage sidebar, GlobalSearchBar, HomeCompareSection, 15+ pages

### Select / Dropdown

No shared Select component — native `<select>` and custom dropdowns inline.

---

## Checkbox / Radio / Toggle Patterns

| Pattern | Location |
|---------|----------|
| Filter sidebar toggles | `FilterEngine`, `FullSidebarFilterPanel` |
| Custom checkbox rows | `CompareEngine`, product filters |
| Toggle switches | Dashboard settings (inline) |
| Active filter chips | `ActiveFilterChips` |

---

## Form Layout Issues

| Issue | Details |
|-------|---------|
| **5+ border-radius variants** on inputs (`rounded-[5px]`, `xl`, `2xl`, `full`) |
| **Inconsistent heights** — h-9, h-11, h-14 for similar fields |
| **Placeholder styling** duplicated | `placeholder-gray-400` |
| **No shared Label** component | `text-[10px] font-bold uppercase text-gray-400` repeated |
| **No shared FormField** wrapper | Error states ad hoc |

---

## Page Forms (Inline)

| Page | Form Type |
|------|-----------|
| `CheckoutPage.tsx` | Checkout address + payment |
| `LoginSignUpPage.tsx` | Auth registration |
| `ContactPage.tsx` | Contact form |
| `SuggestBrandPage.tsx` | Brand suggestion |
| `PostOfferPage.tsx` | Seller offer posting |
| `MarketingContentEditorPage.tsx` | CMS content editor |
| `SpotlightCampaignEditorPage.tsx` | Campaign wizard |

---

## Proposed DS-2.0 Form Primitives

| Component | Purpose |
|-----------|---------|
| `Input` | Text, search, password |
| `Textarea` | Multi-line |
| `Select` | Styled select |
| `Label` | Accessible label |
| `FormField` | Label + input + error |
| `Checkbox` / `Radio` | Filter controls |
| `SearchInput` | Icon-prefixed search |

**Target:** ES-015 Universal Filters (FilterEngine migration) + ES-011 Checkout

---

## Migration Priority

1. `SearchInput` — highest duplication (GlobalSearchBar, FilterEngine, Compare)
2. `FilterCheckboxRow` — sidebar filters
3. Checkout form fields — ES-011
4. CMS editors — lower priority (admin)
