# Role Visibility Matrix — LE-005 Phase 5.1

Source of truth: `src/lib/platform/roleVisibilityRegistry.ts`

## Buyer (`customer`)

| Feature | Visible |
|---------|---------|
| Dashboard overview, saved products/brands, following, browsing history | ✓ |
| Saved Spotlight, orders, messages, my reviews, settings | ✓ |
| Campaign Manager / Marketing CMS / Product Studio | ✗ |

## Seller

| Feature | Visible |
|---------|---------|
| My Products, Orders, Spotlight Requests, Performance (workspace placeholders) | ✓ |
| Messages, settings | ✓ |
| Campaign Manager, global Spotlight CMS | ✗ |

## Brand

| Feature | Visible |
|---------|---------|
| Spotlight Campaigns, Campaign Analytics → `/marketing/spotlight` | ✓ |
| Marketing hub (collections, launches, live — via CMS) | ✓ |
| Buyer-only saved tabs | ✗ |

## Creator

| Feature | Visible |
|---------|---------|
| Creator Studio, Collaborations, Creator Spotlight (workspace placeholders) | ✓ |
| Messages, settings | ✓ |
| Campaign Manager | ✗ |

## Moderator

| Feature | Visible |
|---------|---------|
| Moderation Queues, Approvals (workspace placeholders) | ✓ |
| Campaign publish (via actor `moderator` in permissions) | ✓ |
| CMS Studio | ✗ |

## Administrator

| Feature | Visible |
|---------|---------|
| All modules | ✓ |
| CMS Studio (`?studioEdit=1`) | ✓ |
| Marketing administration | ✓ |

## Public storefront (all roles)

Home, Categories, Spotlight, Products, Brands, **Discover** (`/guides`), Compare, Deals, Creators, Discover search (`/search`).
