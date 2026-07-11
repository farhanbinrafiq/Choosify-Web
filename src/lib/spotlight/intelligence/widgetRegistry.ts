import type { IntelligenceWidgetDefinition } from '../../../types/spotlight/intelligence';

export const WIDGET_REGISTRY: IntelligenceWidgetDefinition[] = [
  // Mission Control
  { widgetId: 'mission-control-grid', title: 'Mission Control', description: 'Control room overview — CTO upgrade', roles: ['admin', 'brand', 'moderator'], supportedFilters: ['timeRange'], dependencies: ['opportunityRegistry'], size: 'full', refreshStrategy: 'on-filter', section: 'mission_control' },
  // Overview / Executive
  { widgetId: 'kpi-overview-grid', title: 'Overview KPI Grid', description: 'Executive KPI cards', roles: ['admin', 'brand'], supportedFilters: ['timeRange'], dependencies: ['metricRegistry'], size: 'full', refreshStrategy: 'on-filter', section: 'overview' },
  { widgetId: 'executive-summary', title: 'Executive Summary', description: 'Platform health cards', roles: ['admin', 'brand'], supportedFilters: ['timeRange'], dependencies: ['scoreRegistry'], size: 'full', refreshStrategy: 'on-filter', section: 'executive' },
  { widgetId: 'views-trend-chart', title: 'Views Trend', description: 'Area chart of views over time', roles: ['admin', 'brand', 'creator'], supportedFilters: ['timeRange', 'campaignId'], dependencies: ['views'], size: 'lg', refreshStrategy: 'on-filter', section: 'overview' },
  // Content
  { widgetId: 'content-intelligence-table', title: 'Content Intelligence', description: 'Per-content metrics grid', roles: ['admin', 'brand', 'creator'], supportedFilters: ['timeRange', 'contentType', 'status'], dependencies: ['content_reach', 'engagement_score'], size: 'full', refreshStrategy: 'on-filter', section: 'content' },
  // Campaigns
  { widgetId: 'campaign-performance-table', title: 'Campaign Performance', description: 'Campaign metrics table', roles: ['admin', 'brand'], supportedFilters: ['timeRange', 'status'], dependencies: ['campaign_reach', 'ctr'], size: 'full', refreshStrategy: 'on-filter', section: 'campaigns' },
  { widgetId: 'campaign-leaderboard', title: 'Campaign Leaderboard', description: 'Top campaigns ranking', roles: ['admin', 'brand'], supportedFilters: ['timeRange'], dependencies: ['views'], size: 'lg', refreshStrategy: 'on-filter', section: 'leaderboards' },
  // Brands / Creators / Products
  { widgetId: 'brand-score-cards', title: 'Brand Score Cards', description: 'Brand trust and engagement', roles: ['admin', 'brand'], supportedFilters: ['timeRange', 'brandId'], dependencies: ['trust_score'], size: 'full', refreshStrategy: 'on-filter', section: 'brands' },
  { widgetId: 'creator-leaderboard', title: 'Creator Leaderboard', description: 'Top creators by reach', roles: ['admin', 'brand', 'creator'], supportedFilters: ['timeRange', 'creatorId'], dependencies: ['creator_reach'], size: 'lg', refreshStrategy: 'on-filter', section: 'creators' },
  { widgetId: 'product-exposure-grid', title: 'Product Exposure', description: 'Product Spotlight visibility', roles: ['admin', 'brand', 'seller'], supportedFilters: ['timeRange'], dependencies: ['spotlight_exposure', 'buy_clicks'], size: 'full', refreshStrategy: 'on-filter', section: 'products' },
  // Live
  { widgetId: 'live-intelligence-panel', title: 'Live Intelligence', description: 'Upcoming, live, replay metrics', roles: ['admin', 'brand'], supportedFilters: ['timeRange'], dependencies: ['peak_viewers', 'replay_views'], size: 'full', refreshStrategy: 'poll', section: 'live' },
  // Discovery
  { widgetId: 'discovery-timeline', title: 'Discovery Timeline', description: 'Trending over time', roles: ['admin', 'brand'], supportedFilters: ['timeRange'], dependencies: ['discovery_score', 'trending_score'], size: 'lg', refreshStrategy: 'on-filter', section: 'discovery' },
  { widgetId: 'trending-lists', title: 'Trending Lists', description: 'Trending content, products, brands', roles: ['admin', 'brand'], supportedFilters: ['timeRange'], dependencies: ['trending_score'], size: 'full', refreshStrategy: 'on-filter', section: 'discovery' },
  // Trust / Health
  { widgetId: 'trust-health-panel', title: 'Trust & Health', description: 'Score breakdown cards', roles: ['admin', 'brand', 'moderator'], supportedFilters: ['timeRange'], dependencies: ['trust_score', 'health_score'], size: 'full', refreshStrategy: 'on-filter', section: 'trust' },
  { widgetId: 'health-center', title: 'Health Center', description: 'Quality, SEO, accessibility factors', roles: ['admin', 'brand', 'moderator'], supportedFilters: ['timeRange'], dependencies: ['quality_score', 'readiness_score'], size: 'full', refreshStrategy: 'on-filter', section: 'health' },
  // Funnel / Heatmaps
  { widgetId: 'funnel-analytics', title: 'Funnel Analytics', description: 'Impression to buy journey', roles: ['admin', 'brand'], supportedFilters: ['timeRange', 'campaignId'], dependencies: ['conversion_funnel'], size: 'full', refreshStrategy: 'on-filter', section: 'funnel' },
  { widgetId: 'heatmap-grid', title: 'Heatmap Grid', description: 'Engagement heatmap architecture', roles: ['admin', 'brand'], supportedFilters: ['timeRange'], dependencies: ['visualizationRegistry'], size: 'full', refreshStrategy: 'static', section: 'heatmaps' },
  // Leaderboards / Insights
  { widgetId: 'leaderboard-grid', title: 'Leaderboard Grid', description: 'All leaderboards combined', roles: ['admin', 'brand'], supportedFilters: ['timeRange'], dependencies: ['metricRegistry'], size: 'full', refreshStrategy: 'on-filter', section: 'leaderboards' },
  { widgetId: 'insight-panels', title: 'Insight Panels', description: 'Top performers and alerts', roles: ['admin', 'brand'], supportedFilters: ['timeRange'], dependencies: ['insightRegistry'], size: 'full', refreshStrategy: 'on-filter', section: 'insights' },
];

export function widgetsForSection(section: IntelligenceWidgetDefinition['section']): IntelligenceWidgetDefinition[] {
  return WIDGET_REGISTRY.filter((w) => w.section === section);
}

export function widgetsForRole(role: IntelligenceWidgetDefinition['roles'][number]): IntelligenceWidgetDefinition[] {
  return WIDGET_REGISTRY.filter((w) => w.roles.includes(role));
}

export function getWidgetDefinition(widgetId: string): IntelligenceWidgetDefinition | undefined {
  return WIDGET_REGISTRY.find((w) => w.widgetId === widgetId);
}

export const WIDGET_COUNT = WIDGET_REGISTRY.length;
