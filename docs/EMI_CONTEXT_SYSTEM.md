# Emi Context System — Phase 5.6

How Emi knows where the user is and what to recommend.

---

## Context engine

`src/lib/emi/emiContextEngine.ts`

- `buildPageContext(pathname, partial)` — merges route + entity data
- `resolveAssistantId(context)` — maps page → assistant type
- `extractCommerceContext(context)` — commerce slice for recommendations

---

## Page registry

`pageRegistry.ts` — 17 page IDs with path patterns:

- Product, Brand, Compare, Spotlight, Spotlight Content
- Search, Category, Creator, Dashboard
- Publisher Studio, Opportunity Center, Marketing
- Collection, Series, Orders, Messages, Home

Each page defines:

- `sidecarEnabled` — show floating sidecar?
- `panelPlacement` — inline | aside | studio | none

---

## Context registry

`contextRegistry.ts` — required fields per page (entityId, productIds, query, etc.)

---

## Conversation context

Existing `useEmiChat` sends:

```json
{ "pathname": "/products/foo", "title": "..." }
```

Phase 5.6 adds `openEmiPanel(prompt)` via `choosify:open-emi` custom event for Copilot → chat handoff.

---

## Commerce context

| Field | Source |
|-------|--------|
| productTitle | Entity label / product |
| price, rating, brand | Product metadata |
| compareLabels | Compare engine |
| spotlightHeadline | Spotlight content |
| opportunityTitle | Opportunity Center |

---

## Shopping memory

`emiMemory.ts` — client-side localStorage:

- Viewed products
- Compare sets
- Recent search queries
- Viewed Spotlight content

Future: sync to backend for "Because you viewed" discovery.

---

## Page context flow

```
Route change
    ↓
resolveEmiPageId(pathname)
    ↓
Page component passes entity metadata
    ↓
useEmiAssistant(partialContext)
    ↓
buildEmiRecommendations()
    ↓
EmiContextPanel / Sidecar / Coach
```
