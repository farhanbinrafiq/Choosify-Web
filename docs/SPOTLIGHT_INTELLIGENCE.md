# Spotlight Intelligence Platform — LE-005 Phase 5.2 + 5.4

The analytics brain of Choosify Spotlight. Every campaign, content experience, brand, creator, product, collection, series, and live event is measurable through one reusable intelligence platform.

**Location:** Dashboard → Marketing → Spotlight Intelligence (`/marketing/intelligence`)

**Default landing:** Mission Control (CTO upgrade — control room for Spotlight operators)

---

## Phase 5.4 Additions

| Feature | Route | Description |
|---------|-------|-------------|
| **Mission Control** | `/marketing/intelligence` | Control room — best performers, alerts, trending, live, commerce |
| Overview | `/marketing/intelligence/overview` | Executive KPI grid + content inventory |
| Executive | `/marketing/intelligence/executive` | Leadership summary |
| Content | `/marketing/intelligence/content` | Per-content intelligence |
| Live | `/marketing/intelligence/live` | Upcoming, live, replay metrics |
| Funnel | `/marketing/intelligence/funnel` | Impression → Buy with abandonment |
| Heatmaps | `/marketing/intelligence/heatmaps` | 6 heatmap types (architecture) |

New registries: `visualizationRegistry`, `exportRegistry`, `opportunityRegistry`, `INTELLIGENCE_DASHBOARD_REGISTRY`.

See also: [METRIC_REGISTRY.md](./METRIC_REGISTRY.md), [SCORE_REGISTRY.md](./SCORE_REGISTRY.md), [WIDGET_REGISTRY.md](./WIDGET_REGISTRY.md).

---

## Dashboard Architecture

```
MarketingLayout
├── Publisher Studio (/marketing/studio)
├── Spotlight Intelligence (/marketing/intelligence)
└── Spotlight Opportunity Center (/marketing/opportunity) — Phase 5.5
    ├── Mission Control (default)
    ├── Overview / Executive
    ├── Content / Campaigns / Brands / Creators / Products / Live
    ├── Discovery / Trust / Health
    ├── Funnel / Heatmaps
    ├── Leaderboards / Insights
    └── Drill-down (/marketing/intelligence/:section/:entityId)
```

### Layer stack

| Layer | Path | Purpose |
|-------|------|---------|
| Types | `src/types/spotlight/intelligence/` | Contracts for metrics, scores, widgets, filters |
| Registries | `src/lib/spotlight/intelligence/` | Metric, score, widget, insight, layout registries |
| Data | `src/utils/spotlightIntelligenceData.ts` | Client-side aggregation from catalog + campaigns |
| Benchmarking | `src/utils/spotlightIntelligenceBenchmark.ts` | Current, previous, platform avg, top performer |
| Hook | `src/hooks/useSpotlightIntelligence.ts` | Global filters + section data |
| Components | `src/components/spotlight/intelligence/` | Reusable dashboard UI |
| Page | `src/pages/marketing/SpotlightIntelligencePage.tsx` | Section routing + drill-down |

No backend API or Firestore schema changes. Data is derived from existing Spotlight campaign storage and catalog state (ES-007/008/009/010 contracts).

---

## Metric Registry

Centralized in `metricRegistry.ts`. Each metric defines:

- **ID**, **Title**, **Description**, **Formula**, **Owner**, **Category**, **Source**, **Unit**, **Refresh Interval**

Categories: reach, engagement, commerce, discovery, trust, health, growth, inventory.

KPI calculations are not duplicated — `buildOverviewSnapshot` and `buildCampaignIntelligence` call `metricValue()` which reads definitions from the registry.

---

## Score Registry

Centralized in `scoreRegistry.ts`:

| Score | Source |
|-------|--------|
| Discovery | `computeDiscoveryScore()` (ES-010) |
| Trust | Publisher trust / verification (ES-009) |
| Health | Campaign health + catalog readiness |
| Growth | Period-over-period momentum |
| Commerce | CTR + conversion composite (ES-008) |
| Engagement | Watch time + completion (ES-008) |
| AI Readiness | Metadata completeness placeholder (Phase 6) |

---

## Widget Registry

`widgetRegistry.ts` registers every dashboard widget:

- Widget ID, title, description
- Roles (admin, brand, creator, seller, moderator)
- Supported filters, dependencies
- Size (sm/md/lg/full), refresh strategy, section

Widgets are reusable across Admin, Brand, Creator, Seller, Marketing, and future Executive dashboards.

---

## Insight Registry

`insightRegistry.ts` defines insight panels:

- Top Campaign / Brand / Creator / Product
- Fastest Growing, Highest CTR
- Needs Attention, Lowest Engagement
- AI Placeholder (no generation — Phase 6)

---

## Layout & Role Presets

`layoutRegistry.ts`:

- **INTELLIGENCE_NAV** — section navigation with role filtering
- **INTELLIGENCE_LAYOUT_REGISTRY** — widget sets per section
- **ROLE_DASHBOARD_PRESETS** — default sections per platform role

Future: Widget Marketplace, dashboard personalization, Executive Dashboard reuse.

---

## Benchmarking System (CTO Upgrade)

Every KPI card optionally displays via `IntelligenceBenchmark`:

```
Current value
Previous period
Platform average
Top performer
Percentage change + trend (↑ ↓ →)
```

Implemented in `SpotlightMetricCard` and `buildBenchmark()`.

---

## Drill-down Architecture

All KPI cards, charts, leaderboards, and insights support navigation:

| Source | Target |
|--------|--------|
| Campaign KPI | `/marketing/intelligence/campaigns/:campaignId` |
| Creator KPI | `/marketing/intelligence/creators/:creatorId` |
| Product KPI | `/marketing/intelligence/products/:productId` |
| Brand KPI | `/marketing/intelligence/brands/:brandId` |
| Section nav | `/marketing/intelligence/:section` |

Entity drill-down banner shows context with back link.

---

## Reusable Components

| Component | Purpose |
|-----------|---------|
| `SpotlightMetricCard` | KPI + benchmarking + drill-down |
| `SpotlightScoreCard` | Score with progress bar |
| `SpotlightChartCard` | Area/line/bar/pie/donut wrapper |
| `SpotlightTrendCard` | Sparkline + change % |
| `SpotlightLeaderboard` | Ranking tables |
| `SpotlightDashboardSection` | Section layout |
| `SpotlightInsightCard` | Insight panels |
| `SpotlightHealthCard` | Health factor breakdown |
| `SpotlightLoadingState` / `SpotlightEmptyState` | UX states |
| `SpotlightIntelligenceNav` | Section navigation |
| `SpotlightIntelligenceFilters` | Global filters |
| `SpotlightMiniChart` | SVG charts (no external chart library) |

---

## Global Filters

- **Time:** Today, 7d, 30d, 90d, 12m, Custom
- **Entity:** Campaign, Brand, Creator, Publisher, Collection, Series, Status

Filters apply globally via `useSpotlightIntelligence`.

---

## Backend Integration (Future)

When ES-008 analytics endpoints are live:

1. Replace `spotlightIntelligenceData.ts` mock aggregators with API clients
2. Keep registries and component contracts unchanged
3. Map API responses to `IntelligenceMetricValue` + `IntelligenceBenchmark`

No schema changes required — types already align with ES-008 `SpotlightAnalyticsRef`.

---

## Future AI Integration (Phase 6)

- `ai_placeholder` insight panel and `ai` score in score registry
- Insight registry architecture ready for Emi AI recommendations
- No AI generation in Phase 5.2

---

## Future Monetization (Phase 7)

- Revenue KPI is placeholder only
- Benchmarking and widget registry support premium analytics tiers
- Widget Marketplace architecture noted in layout registry

---

## Platform Integration

Updated registries:

- `dashboardRegistry.ts` — brand-analytics → `/marketing/intelligence`
- `routeRegistry.ts` — intelligence routes
- `ownershipRegistry.ts` — spotlight.intelligence dashboardHome
- `roleVisibilityRegistry.ts` — brand.campaign-analytics, marketing.intelligence
