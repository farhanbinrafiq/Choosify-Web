# Metric Registry

LE-005 Phase 5.4 — Centralized KPI definitions for Spotlight Intelligence.

## Location

`src/lib/spotlight/intelligence/metricRegistry.ts`

## Contract

Every metric includes:

| Field | Description |
|-------|-------------|
| `id` | Unique metric identifier |
| `title` | Display label |
| `description` | Human-readable explanation |
| `formula` | Calculation reference |
| `owner` | spotlight, marketplace, trust, discovery, commerce |
| `category` | reach, engagement, commerce, discovery, trust, health, growth, inventory |
| `source` | ES-007, ES-008, ES-009, ES-010, computed, placeholder |
| `unit` | count, percent, score, currency, duration, ratio |
| `refreshInterval` | realtime, hourly, daily |

## Metrics (35)

### Reach (6)
views, unique_visitors, campaign_reach, creator_reach, spotlight_exposure, content_reach, peak_viewers, replay_views

### Engagement (7)
clicks, ctr, avg_watch_time, avg_read_time, completion_rate, engagement_score, shares, saves

### Commerce (6)
revenue, wishlist, compare, buy_clicks, services_clicked, conversion_funnel

### Discovery (2)
discovery_score, trending_score

### Trust (1)
trust_score

### Health (3)
health_score, quality_score, readiness_score

### Growth (1)
growth_pct

### Inventory (4)
campaign_exposure, guide_mentions, review_mentions, live_mentions

## Usage

```typescript
import { getMetricDefinition, metricsByCategory, METRIC_COUNT } from '@/lib/spotlight/intelligence';

const def = getMetricDefinition('ctr');
const engagement = metricsByCategory('engagement');
```

## Data Sources

- **ES-008** — Primary analytics (views, clicks, CTR, revenue)
- **ES-009** — Trust score
- **ES-010** — Discovery score, creator reach
- **ES-007** — Catalog mentions (guides, reviews)
- **computed** — Derived scores and growth
- **placeholder** — Peak viewers, conversion funnel (Phase 5.6)

## Rule

Never duplicate metric calculations. All KPI cards, leaderboards, and widgets resolve values through `spotlightIntelligenceData.ts` using metric IDs from this registry.
