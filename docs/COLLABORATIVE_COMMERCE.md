# Collaborative Commerce — Phase 2

Commerce revolves around Spotlight content — not the opposite.

## Commerce Layer

```
SpotlightContent
    └── SpotlightCommerceOverlayV2
            ├── featuredProductIds / featuredServiceIds
            ├── bundles, offers, coupons
            ├── pinned products (live)
            └── actions: compare | wishlist | buy | share | contact
```

`enrichCommerceOverlay()` adds action flags without duplicating `ProductCard` / dashboard wishlist / compare logic.

## Unified Renderer

`SpotlightContentCard` handles all commerce actions via existing:

- `useDashboard()` — wishlist, compare
- Product routes — buy, product details
- `navigator.share` — share

## Creator Commerce Flow

1. Creator publishes review / live / guide / recommendation / campaign
2. Products attached by ID only (`SpotlightCreatorPublishingRequest`)
3. Same commerce overlay as brand campaigns
4. Attribution events reserved (`SpotlightCreatorAttributionEvent`)

Publishable types: `CREATOR_PUBLISHABLE_TYPES` in `collaboration/creator.ts`

## Brand Collaboration Flow

1. Brand owns campaign (`publisher` role)
2. Invites creators (`SpotlightCollaborationInvite`)
3. Creators contribute content (`SpotlightCampaignContribution`)
4. Brand approves (`SpotlightCollaborationApproval`)
5. Featured creator content surfaces on campaign + publisher pages

Policy: `SpotlightBrandCollaborationPolicy`

## Campaign Collaboration

One campaign supports:

- Multiple brands, creators, sellers, products, services
- Each contribution shows publisher, verification, role, contribution type

Graph: `SpotlightCampaignCollaborationGraph`

## Live Commerce

`SpotlightLiveCommerceSession` extends live config with:

- Official / Creator / Partner live kinds
- Facebook + YouTube embed (Phase 1 media)
- Pinned products, services, coupons, offers
- Timeline + notify-me placeholders
- Future: TikTok, Instagram, Vimeo, Zoom webinar

## Live Content Types

| Kind | Use case |
|------|----------|
| `official_live` | Brand-hosted stream |
| `creator_live` | Creator stream within campaign |
| `partner_live` | Distributor/retailer stream |
| `launch_event` | Product launch |
| `winner_announcement` | Contest results |
| `replay` | Post-live VOD |

## Content → Commerce Rules

1. Never duplicate product data on content documents
2. Resolve products from catalog at render time
3. Commerce overlay is optional — editorial content may have zero products
4. Pinned items override featured list during live sessions (future)

## Future Monetization Hooks

- Sponsored live / campaign flags on `SpotlightMonetizationPlacement`
- Creator marketplace revenue share via attribution metrics
- Premium analytics for publishers with collaboration breakdown

## Performance

- Commerce resolution is O(n) on linked product IDs per card
- Publisher page products filtered from existing `allCatalogProducts`
- No additional API calls in Phase 2

## Scalability

- Overlay schema versioned via `SpotlightCommerceOverlayV2`
- Live session IDs link to graph for cross-surface merchandising
- Attribution contract swappable when ES-008 ships
