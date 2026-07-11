# Platform Architecture Audit — LE-005 Phase 5.1

## Mandatory verification

```
npm run lint   — run after changes
npm run build  — run after changes
```

## Files created

| File | Purpose |
|------|---------|
| `src/lib/platform/roles.ts` | Platform role mapping + access helpers |
| `src/lib/platform/roleVisibilityRegistry.ts` | Feature visibility matrix |
| `src/lib/platform/routeRegistry.ts` | Route classification |
| `src/lib/platform/navigationRegistry.ts` | Nav order + Discover UI constants |
| `src/lib/platform/dashboardRegistry.ts` | Role-based dashboard nav |
| `src/lib/platform/contentRegistry.ts` | Content-first routing |
| `src/lib/platform/ownershipRegistry.ts` | Module ownership |
| `src/lib/platform/index.ts` | Barrel export |
| `src/components/auth/RequireRole.tsx` | Route/feature role guard |
| `src/pages/ReviewDetailPage.tsx` | `/reviews/:slug` content destination |

## Files modified

| File | Change |
|------|--------|
| `src/types/schemas.ts` | Added `brand`, `moderator` roles |
| `src/utils/spotlightCampaignPermissions.ts` | Fixed customer→seller bug; explicit actor mapping |
| `src/App.tsx` | RequireRole on `/marketing/*`, `/reviews/:slug`, legacy `/recommendations` redirects |
| `src/pages/DashboardPage.tsx` | Role-based sidebar; removed buyer Campaign Manager link |
| `src/context/StudioEditContext.tsx` | Admin-only studio edit mode |
| `src/pages/ProductDetailPage.tsx` | Product Studio bar brand/admin only |
| `src/utils/spotlightContentResolver.ts` | Content-first hrefs (reviews, guides) |
| `src/lib/navigation.ts` | Discover & Learn hero title |
| `src/lib/seoConfig.ts`, `lib/seoHelpers.ts`, `lib/seoShared.ts` | Discover branding, noindex `/marketing` |
| `src/components/Footer.tsx` | Discover & Learn footer link |
| `src/pages/GuidesPage.tsx` | Discover & Learn section nav labels |
| `src/pages/SearchPage.tsx`, `SpotlightSearchPage.tsx`, `SpotlightSearchPanel.tsx` | Discover copy |
| `src/pages/marketing/SpotlightCampaignEditorPage.tsx` | Null-safe actor |

## Routes

| Change | Detail |
|--------|--------|
| **Added** | `/reviews/:slug` — Review Details |
| **Redirect** | `/recommendations` → `/guides` |
| **Redirect** | `/recommendations/:id` → `/guides/:id` |
| **Gated** | `/marketing/*` → brand, admin |

## Navigation changes

- Primary nav unchanged in order; **Discover** label on `/guides` (no "Recommendations" in nav)
- Footer: Guides → **Discover & Learn**
- Search UI: **Discover** page title, placeholder, breadcrumbs

## Dashboard changes

- Buyers: no Spotlight Campaigns link
- Sellers: Spotlight Requests workspace (not CMS)
- Brands/Admin: Spotlight Campaigns → marketing hub
- Creators/Moderators: role workspace placeholders

## Branding changes

- `/guides` SEO: **Discover & Learn**
- `/search` SEO: **Discover**
- Spotlight search H1: **Discover Spotlight**
- Breadcrumbs: Search → **Discover**

## Role separation summary

Binary login replaced with **role-aware** guards at marketing routes, studio edit, and dashboard nav. Campaign permissions no longer treat buyers as sellers.

## Content navigation fixes

- Creator picks → `/reviews/creator-{id}` (not creator profile first)
- Creator/product reviews → `/reviews/{slug}`
- Recommendations/guides → `/guides/{slug}`

## Performance impact

Minimal — registry lookups are static; no new network calls.

## Accessibility impact

Review page uses semantic headings; Discover search retains `role="search"`.

## Technical debt remaining

- Seller/Creator/Moderator workspace tabs are placeholders pending dedicated shells
- `brand` / `moderator` roles not yet assigned at login (only `customer` default)
- Separate Brand vs Seller dashboard routes (`/dashboard/brand`) deferred to Phase 5.2
- Intelligence Dashboard not implemented (Phase 5.2)

## Breaking changes

**None for public URLs** — `/recommendations` redirects to `/guides` (301-style client redirect). API/service names unchanged.

**DO NOT COMMIT** — await ChatGPT review.
