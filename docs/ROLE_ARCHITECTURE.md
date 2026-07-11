# Role Architecture — LE-005 Phase 5.1

## Platform roles

| Role | Internal `UserRole` | Purpose |
|------|---------------------|---------|
| Buyer | `customer` | Consumer storefront experience |
| Seller | `seller` | Product catalog, orders, Spotlight **requests** |
| Brand | `brand` | Marketing hub, Spotlight campaigns (own brand) |
| Creator | `creator` | Creator studio, collaborations, content |
| Moderator | `moderator` | Trust, approvals, moderation queues |
| Administrator | `admin` | Full platform + CMS Studio |

Mapping: `src/lib/platform/roles.ts` → `toPlatformRole()`.

## Registries (CTO)

| Registry | File | Purpose |
|----------|------|---------|
| Role visibility | `roleVisibilityRegistry.ts` | Feature → allowed roles |
| Routes | `routeRegistry.ts` | Public vs auth vs role-gated routes |
| Navigation | `navigationRegistry.ts` | Storefront nav order + Discover UI copy |
| Dashboard | `dashboardRegistry.ts` | Sidebar tabs per role |
| Content | `contentRegistry.ts` | Content-first Spotlight href rules |
| Ownership | `ownershipRegistry.ts` | Module ownership for Phase 5.2+ |

## Route guards

- `ProtectedRoute` — login required
- `RequireRole` — `src/components/auth/RequireRole.tsx`
- `/marketing/*` — **brand**, **admin** only
- `?studioEdit=1` — **admin** only (`StudioEditContext`)

## Dashboard ownership

| Surface | Buyer | Seller | Brand | Creator | Moderator | Admin |
|---------|-------|--------|-------|---------|-----------|-------|
| `/dashboard` consumer tabs | ✓ | partial | partial | partial | partial | ✓ |
| `/marketing/spotlight` | ✗ | ✗ | ✓ | ✗ | ✗ | ✓ |
| CMS Studio | ✗ | ✗ | ✗ | ✗ | ✗ | ✓ |

Sellers submit **Spotlight Requests** from dashboard — they do not access the global Campaign Manager.

## Content-first navigation

Spotlight cards route to content destinations (`/reviews/:slug`, `/guides/:slug`, `/spotlight/:slug`) before profile pages. See `contentRegistry.ts`.

## Future (Phase 5.2)

- Spotlight Intelligence Dashboard → `spotlight.intelligence` module
- Monetization → `admin` only until launch
