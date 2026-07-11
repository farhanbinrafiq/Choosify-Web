# Publisher Ecosystem — Phase 2

Spotlight Phase 2 establishes every experience as publisher-owned collaborative commerce.

## Publisher Graph

```
Publisher Profile (brand / creator / seller / org)
    ├── Spotlight Content (campaigns, guides, live, events)
    ├── Collaborations (invites, approvals, contributions)
    ├── Commerce Overlay (products, bundles, offers)
    ├── Trust & Reputation (unified ES-009 prep)
    └── Analytics & Attribution (ES-008 prep)
```

## Publisher Profile

`SpotlightPublisherProfile` — full profile at `/publisher/{slug}`:

- Identity: logo, cover, type, description, social links, website
- Stats: campaigns, live, reviews, content, collaborations
- **Unified Reputation** (`SpotlightUnifiedReputation`) — one score model for brands, creators, sellers, organizations
- **Trust Badges** — Official Brand, Official Creator, Verified Seller, etc.

Resolvers: `spotlightPublisherProfile.ts`

## Publisher Page Sections

Overview · Spotlight · Campaigns · Live · Creator Collaborations · Recommendations · Buying Guides · Announcements · Events · Products · Services · Reviews · About

Hook: `usePublisherProfile(slug)` → `buildPublisherPageModel()`

## Collaboration Engine

`src/types/spotlight/collaboration/`:

| Module | Purpose |
|--------|---------|
| `engine.ts` | Roles, invites, approvals, permissions |
| `campaign.ts` | Multi-brand/creator/seller contributions |
| `creator.ts` | Creator publishable types + commerce profile |
| `brand.ts` | Brand invite/approve/feature flows |

**Brand × Creator Collaboration (CTO):** `SpotlightBrandCreatorCollaboration` — Samsung launch + Creator A/B/C perspectives in one campaign destination.

Utils: `spotlightCollaborationEngine.ts`

## Content Graph

Extended `SpotlightContentRelationshipGraph` — publisher, announcement, and related content edges on top of Phase 1 connections.

## Event Timeline (CTO)

`SpotlightContentTimeline` — launch announced → live started → product revealed → offer activated → campaign ended.

Builder: `spotlightContentTimeline.ts` — rendered on campaign public pages.

## Creator Attribution (CTO)

`SpotlightCreatorAttributionMetrics` — views, product clicks, wishlist, compare, purchases, revenue influenced. Contract-only for creator marketplace.

## Related Experience

`resolveRelatedExperience()` — campaigns, creators, products, guides, live, recommendations, announcements, events.

## Trust (ES-009)

`SpotlightPublisherTrustProfile` + badge types. Reuses moderation contract from LE-005.3.2.

## Analytics (ES-008)

`SpotlightPublisherAnalyticsSnapshot` — publisher views, live views, CTR, revenue, collaboration metrics.

## AI (ES-012)

`SpotlightAiEcosystemContract` — creator/campaign/brand/publisher matching, related content, campaign quality.

## Monetization

`SpotlightMonetizationFeature` — featured publisher/creator, sponsored campaign/live, premium placement, creator marketplace. No billing.

## Integration Points

- Campaign resolver attaches collaborators + enriched commerce overlay
- `SpotlightCampaignCard` → universal `SpotlightContentCard` (unchanged adapter)
- Publisher links on cards → `/publisher/{slug}`
- Products on publisher page reuse `ProductCard` (no duplicate commerce)

## Future Work

- Backend for invites/approvals
- Live commerce player + notify-me
- Full related experience UI rails
- Creator attribution pipeline
- Brand page Spotlight consumption
