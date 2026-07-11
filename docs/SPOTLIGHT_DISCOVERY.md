# Spotlight Discovery — Phase 4 → 5.2 Content Unification

> **Phase 5.2:** The standalone Discover module is **retired**. `/guides` redirects to Spotlight. All editorial content (guides, reviews, recommendations, videos, blogs) is unified as `SpotlightContent`. See [SPOTLIGHT_CONTENT_MODEL.md](./SPOTLIGHT_CONTENT_MODEL.md).

Choosify Spotlight is the **single discovery destination** — an immersive browsing experience where users never feel lost.

## Vision

Users always have another campaign, creator, live, guide, or recommendation to discover. Every experience connects to commerce through the unified Spotlight Hub.

## Architecture

```
/spotlight (Discovery Home)
    ├── Modular sections (30+ buckets)
    ├── Story rail + personalized rails
    ├── Universal filters + DiscoveryScore ranking
    └── Sticky discovery navigation

/spotlight/explore — Browse by dimension
/spotlight/search — Dedicated Spotlight search
/spotlight/calendar — Launches, events, lives
/spotlight/collections/:slug — Seasonal/editorial collections
/spotlight/series/:slug — Episodic content
/spotlight/stories — Full-screen story mode
```

## Discovery Home Sections

Featured Today · Trending Now · Editor's Picks · Recommended For You (placeholder) · Continue Browsing · Continue Watching · Live Now · Upcoming · Ending Soon · Recently Added · Popular This Week/Month · Top Campaigns/Creators/Brands/Services · Buying Guides · Creator Reviews · Brand Stories · Announcements · What's On · Collections · Series

Builder: `buildSpotlightDiscoverSections()` in `spotlightDiscoverSections.ts`

Hook: `useSpotlightExperience()` / `useSpotlightDiscovery()`

## DiscoveryScore (CTO)

Universal ranking on every `SpotlightContent`:

| Factor | Weight |
|--------|--------|
| Freshness | 20% |
| Engagement | 25% |
| Trust | 15% |
| Quality | 15% |
| Editorial priority | 10% |
| AI relevance | 15% |
| Sponsored boost | +15 (labeled) |

Utils: `spotlightDiscoveryScore.ts` — `computeDiscoveryScore()`, `enrichContentWithDiscoveryScore()`

## Collections (CTO)

`SpotlightCollection` — seasonal, editorial, event, brand, creator, community kinds.

Demo collections: Eid Mega Sale, Back To School, Tech Festival, Travel Deals, AI Products, Smart Home, etc.

Contains: campaigns, products, creators, guides, live, recommendations, reviews, announcements.

Utils: `spotlightCollections.ts`

## Series (CTO)

`SpotlightSeries` → episodes → campaigns/guides → products.

Episode order, season support, continue watching (architecture).

Demo: Photography Masterclass, Samsung AI Series, Creator Weekly Picks, Travel Diaries, Cooking Series.

Utils: `spotlightSeries.ts`

## Calendar

Views: Today · Tomorrow · This Week · This Month · Upcoming · Past

Filters: Launches · Events · Lives · Announcements · Campaigns · Winner Announcements

Utils: `spotlightCalendar.ts` — `buildCalendarEvents()`, `filterCalendarEvents()`, `groupCalendarByDay()`

## Story Mode (Architecture)

Instagram-like full-screen stories:

- Tap left/right navigation
- Progress bars per slide
- Slide kinds: image, video, product, offer, guide, recommendation, CTA, replay, live

Components: `SpotlightStoryRail`, `SpotlightStoryViewer`

Utils: `spotlightStory.ts`

## Search

Dedicated `/spotlight/search` — campaigns, creators, publishers, brands, series, collections, events, guides, reviews, announcements, live.

Recent · Popular · Trending · Suggested searches (localStorage recent).

Utils: `spotlightSearch.ts` — Hook: `useSpotlightSearch()`

## Filters

Universal filters extend Phase 1 panel:

- Media type (image, video, live)
- Replay / Upcoming toggles
- Collection / series IDs (architecture)
- All Phase 1 content type + boolean flags

Component: `SpotlightUniversalFiltersPanel`

## Follow / Save / History (Architecture)

LocalStorage contracts — no backend:

| System | Key | Hook |
|--------|-----|------|
| Follow | `choosify_spotlight_follows` | `useSpotlightFollow()` |
| Save | `choosify_spotlight_saves` | `useSpotlightSave()` |
| History | `choosify_spotlight_history` | `useSpotlightHistory()` |

History drives: Continue Browsing · Continue Watching · Continue Reading · Recently Viewed

## Related Experience (Enhanced)

Personalized rails:

- Because you viewed
- Because you follow
- Because you saved
- Trending near you (placeholder)
- Editor's picks
- Popular among creators/brands

Utils: `spotlightPersonalizedRails.ts`

## Spotlight Hub (CTO)

Every campaign is a hub:

Overview → Live → Replay → Products → Guides → Reviews → Creator Content → Recommendations → Related Campaigns → Announcements → Events

Utils: `spotlightHub.ts` — `buildSpotlightHub()`, `inferCampaignJourney()`

## Campaign Journey (CTO)

Announcement → Coming Soon → Launch → Live → Offer → Winner → Replay → Archive

Component: `SpotlightCampaignJourneyStrip`

## Mobile Experience

- Sticky discovery nav with horizontal scroll
- Story mode mobile-first full screen
- 44px minimum touch targets
- Large CTA buttons on campaign pages
- Responsive card grids and carousels
- Mini player placeholder reserved (Phase 4 architecture)

## Accessibility

- `role="search"`, `aria-label` on filters and search
- Breadcrumb `aria-label`
- Story dialog `aria-modal`
- Focus-visible rings on interactive elements
- `motion-reduce` on story progress animations
- Semantic section headings with `aria-labelledby`
- Screen reader labels on story nav buttons

## Future AI

DiscoveryScore AI relevance factor ready for ES-012 personalization. Recommended For You section is placeholder. Trending Near You rail is placeholder.

## Future Monetization

Sponsored boost in DiscoveryScore (clearly separated from organic). Featured collections flag. No billing in Phase 4.

## File Map

```
src/types/spotlight/discovery/
src/utils/spotlightDiscoveryScore.ts
src/utils/spotlightCollections.ts
src/utils/spotlightSeries.ts
src/utils/spotlightCalendar.ts
src/utils/spotlightSearch.ts
src/utils/spotlightExplore.ts
src/utils/spotlightHub.ts
src/utils/spotlightUserSignals.ts
src/utils/spotlightPersonalizedRails.ts
src/utils/spotlightStory.ts
src/hooks/useSpotlightSearch.ts
src/hooks/useSpotlightFollow.ts
src/hooks/useSpotlightSave.ts
src/hooks/useSpotlightHistory.ts
src/components/spotlight/discovery/
src/pages/SpotlightExplorePage.tsx
src/pages/SpotlightSearchPage.tsx
src/pages/SpotlightCalendarPage.tsx
src/pages/SpotlightCollectionPage.tsx
src/pages/SpotlightSeriesPage.tsx
src/pages/SpotlightStoryPage.tsx
docs/SPOTLIGHT_NAVIGATION.md
```
