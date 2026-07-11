# Widget Registry

LE-005 Phase 5.4 — Pluggable intelligence widgets for reusable dashboards.

## Location

`src/lib/spotlight/intelligence/widgetRegistry.ts`

## Widgets (19)

| Widget ID | Section | Size | Roles |
|-----------|---------|------|-------|
| mission-control-grid | mission_control | full | admin, brand, moderator |
| kpi-overview-grid | overview | full | admin, brand |
| executive-summary | executive | full | admin, brand |
| views-trend-chart | overview | lg | admin, brand, creator |
| content-intelligence-table | content | full | admin, brand, creator |
| campaign-performance-table | campaigns | full | admin, brand |
| campaign-leaderboard | leaderboards | lg | admin, brand |
| brand-score-cards | brands | full | admin, brand |
| creator-leaderboard | creators | lg | admin, brand, creator |
| product-exposure-grid | products | full | admin, brand, seller |
| live-intelligence-panel | live | full | admin, brand |
| discovery-timeline | discovery | lg | admin, brand |
| trending-lists | discovery | full | admin, brand |
| trust-health-panel | trust | full | admin, brand, moderator |
| health-center | health | full | admin, brand, moderator |
| funnel-analytics | funnel | full | admin, brand |
| heatmap-grid | heatmaps | full | admin, brand |
| leaderboard-grid | leaderboards | full | admin, brand |
| insight-panels | insights | full | admin, brand |

## Layout Mapping

`INTELLIGENCE_LAYOUT_REGISTRY` in `layoutRegistry.ts` maps each section to its default widget set.

## Widget Renderer

`SpotlightWidgetRenderer` assembles dashboards dynamically from registries instead of hardcoded JSX.

## Cross-Dashboard Reuse

Widgets are designed for reuse in:

- Spotlight Intelligence (`/marketing/intelligence`)
- Executive Dashboard (`/marketing/intelligence/executive`)
- Brand Dashboard (future — via `INTELLIGENCE_DASHBOARD_REGISTRY`)
- Creator Dashboard
- Seller Dashboard
- Admin Dashboard
- Partner Portal (future)

## API

```typescript
import { widgetsForSection, widgetsForRole, getWidgetDefinition, WIDGET_COUNT } from '@/lib/spotlight/intelligence';

const overviewWidgets = widgetsForSection('overview');
const brandWidgets = widgetsForRole('brand');
```

## Adding a Widget

1. Register in `WIDGET_REGISTRY`
2. Add to `INTELLIGENCE_LAYOUT_REGISTRY` for target section(s)
3. Implement render branch in `SpotlightWidgetRenderer.tsx` (if dynamic)
4. No page-level changes required
