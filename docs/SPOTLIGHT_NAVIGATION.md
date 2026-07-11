# Spotlight Navigation — Phase 4

Discovery navigation layer — breadcrumbs, sticky nav, hub jumps, and cross-page wayfinding.

## Discovery Navigation

**Component:** `SpotlightDiscoveryNav`

Sticky horizontal nav on all Spotlight discovery surfaces:

| Tab | Route |
|-----|-------|
| Discover | `/spotlight` |
| Explore | `/spotlight/explore` |
| Search | `/spotlight/search` |
| Calendar | `/spotlight/calendar` |
| Collections | `/spotlight/explore?tab=collections` |
| Stories | `/spotlight/stories` |

Config: `SPOTLIGHT_DISCOVERY_NAV` in `discovery/navigation.ts`

## Breadcrumbs

**Component:** `SpotlightBreadcrumbs`

Hierarchy examples:

```
Spotlight → Samsung → Galaxy Launch
Spotlight → Collections → Eid Mega Sale
Spotlight → Series → Photography Masterclass
Spotlight → Publisher → Campaign → Live
```

Used on: campaign public pages, collection pages, series pages, interactive commerce (via hub breadcrumbs).

## Campaign Hub Navigation (CTO)

**Component:** `SpotlightHubNav`

Sticky quick-jump within a campaign hub:

Overview · Live · Replay · Products · Guides · Reviews · Creator Content · Recommendations · Related Campaigns · Announcements · Events

Built by `buildSpotlightHub()` — sections link to routes or in-page anchors.

## Campaign Journey Strip (CTO)

**Component:** `SpotlightCampaignJourneyStrip`

Visual lifecycle: Announcement → Coming Soon → Launch → Live → Offer → Winner → Replay → Archive

Active stage highlighted. Completed stages shown in green.

## Route Order

Specific routes **before** `:slug` catch-all:

```
/spotlight
/spotlight/explore
/spotlight/search
/spotlight/calendar
/spotlight/stories
/spotlight/collections/:slug
/spotlight/series/:slug
/spotlight/live/:slug
/spotlight/:slug
```

## Back Navigation

- Collection pages: Back to Collections (`/spotlight/explore?tab=collections`)
- Series pages: Back to Series (`/spotlight/explore?tab=series`)
- Campaign pages: Hub breadcrumbs + discovery nav
- Interactive commerce: `← Campaign` link to `/spotlight/:slug`

## Quick Jump Patterns

| From | To | Mechanism |
|------|-----|-----------|
| Discover section | View All | `viewAllHref` on section |
| Collection card | Collection page | `/spotlight/collections/:slug` |
| Series card | Series page | `/spotlight/series/:slug` |
| Search result | Entity page | Result `href` |
| Calendar event | Campaign/live | Event `href` |
| Story CTA | Product/campaign | Slide `href` |

## Mobile Navigation

- Horizontal scroll discovery tabs (no wrap)
- Sticky nav below main navbar
- Hub nav sticky below discovery nav
- Story mode: full-screen overlay with safe-area padding
- Touch targets ≥ 44px on all nav buttons

## Accessibility

- `aria-current="page"` on active discovery tab
- Breadcrumb `nav` with `aria-label="Breadcrumb"`
- Hub nav `aria-label="Campaign hub navigation"`
- Calendar view tabs with `role="tab"` and `aria-selected`
- Keyboard focus rings on all links and buttons

## Future

- Deep-link section anchors (`/spotlight#live_now`)
- Notification-driven nav to upcoming calendar events
- AI-suggested next destination after hub exit
- Offline history sync when save system backend ships
