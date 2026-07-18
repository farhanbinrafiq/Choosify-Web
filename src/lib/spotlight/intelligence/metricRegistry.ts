import type { IntelligenceMetricDefinition } from '../../../types/spotlight/intelligence';

/** Central metric registry — single source for KPI definitions (Phase 5.2 + 5.4) */
export const METRIC_REGISTRY: IntelligenceMetricDefinition[] = [
  // Reach
  { id: 'views', title: 'Views', description: 'Total Spotlight content views', formula: 'SUM(campaign_view)', owner: 'spotlight', category: 'reach', source: 'ES-008', unit: 'count', refreshInterval: 'hourly' },
  { id: 'unique_visitors', title: 'Unique Visitors', description: 'Distinct sessions viewing Spotlight', formula: 'COUNT(DISTINCT session_id)', owner: 'marketplace', category: 'reach', source: 'ES-008', unit: 'count', refreshInterval: 'hourly' },
  { id: 'campaign_reach', title: 'Campaign Reach', description: 'Unique users per campaign', formula: 'COUNT(DISTINCT user) per campaign', owner: 'spotlight', category: 'reach', source: 'ES-008', unit: 'count', refreshInterval: 'hourly' },
  { id: 'creator_reach', title: 'Creator Reach', description: 'Audience exposed to creator content', formula: 'SUM creator impressions', owner: 'discovery', category: 'reach', source: 'ES-010', unit: 'count', refreshInterval: 'daily' },
  { id: 'spotlight_exposure', title: 'Spotlight Exposure', description: 'Product impressions via Spotlight surfaces', formula: 'SUM(product_impression)', owner: 'commerce', category: 'reach', source: 'ES-008', unit: 'count', refreshInterval: 'hourly' },
  { id: 'content_reach', title: 'Content Reach', description: 'Unique viewers per content item', formula: 'COUNT(DISTINCT viewer) per content', owner: 'spotlight', category: 'reach', source: 'ES-008', unit: 'count', refreshInterval: 'hourly' },
  // Engagement
  { id: 'clicks', title: 'Clicks', description: 'Shop now and product detail clicks', formula: 'SUM(shop_now + product_details)', owner: 'commerce', category: 'engagement', source: 'ES-008', unit: 'count', refreshInterval: 'hourly' },
  { id: 'ctr', title: 'CTR', description: 'Click-through rate', formula: 'clicks / impressions * 100', owner: 'spotlight', category: 'engagement', source: 'ES-008', unit: 'percent', refreshInterval: 'hourly' },
  { id: 'avg_watch_time', title: 'Avg Watch Time', description: 'Mean engaged watch duration', formula: 'AVG(view_10s duration)', owner: 'spotlight', category: 'engagement', source: 'ES-008', unit: 'duration', refreshInterval: 'hourly' },
  { id: 'avg_read_time', title: 'Avg Read Time', description: 'Mean scroll depth read duration', formula: 'AVG(read_duration)', owner: 'spotlight', category: 'engagement', source: 'ES-008', unit: 'duration', refreshInterval: 'hourly' },
  { id: 'completion_rate', title: 'Completion Rate', description: 'Content watched or read to completion', formula: 'completion / views * 100', owner: 'spotlight', category: 'engagement', source: 'ES-008', unit: 'percent', refreshInterval: 'hourly' },
  { id: 'engagement_score', title: 'Engagement Score', description: 'Composite engagement index', formula: 'weighted(watch, completion, shares)', owner: 'spotlight', category: 'engagement', source: 'computed', unit: 'score', refreshInterval: 'hourly' },
  { id: 'shares', title: 'Shares', description: 'Social and native shares', formula: 'SUM(share)', owner: 'spotlight', category: 'engagement', source: 'ES-008', unit: 'count', refreshInterval: 'hourly' },
  { id: 'saves', title: 'Saves', description: 'Content saved for later', formula: 'SUM(save)', owner: 'spotlight', category: 'engagement', source: 'ES-008', unit: 'count', refreshInterval: 'hourly' },
  // Commerce
  { id: 'revenue', title: 'Revenue', description: 'Attributed campaign revenue', formula: 'SUM(campaign_revenue)', owner: 'commerce', category: 'commerce', source: 'ES-008', unit: 'currency', refreshInterval: 'hourly' },
  { id: 'wishlist', title: 'Wishlist Adds', description: 'Products saved from Spotlight', formula: 'SUM(wishlist)', owner: 'commerce', category: 'commerce', source: 'ES-008', unit: 'count', refreshInterval: 'hourly' },
  { id: 'compare', title: 'Compare Actions', description: 'Compare initiated from Spotlight', formula: 'SUM(compare)', owner: 'commerce', category: 'commerce', source: 'ES-008', unit: 'count', refreshInterval: 'hourly' },
  { id: 'buy_clicks', title: 'Buy Clicks', description: 'Buy now funnel clicks', formula: 'SUM(buy_now)', owner: 'commerce', category: 'commerce', source: 'ES-008', unit: 'count', refreshInterval: 'hourly' },
  { id: 'services_clicked', title: 'Services Clicked', description: 'Service card clicks', formula: 'SUM(service_click)', owner: 'commerce', category: 'commerce', source: 'ES-008', unit: 'count', refreshInterval: 'hourly' },
  { id: 'conversion_funnel', title: 'Conversion Funnel', description: 'Impression to buy rate', formula: 'buy / impressions * 100', owner: 'commerce', category: 'commerce', source: 'placeholder', unit: 'percent', refreshInterval: 'daily' },
  // Discovery
  { id: 'discovery_score', title: 'Discovery Score', description: 'Composite discovery ranking', formula: 'computeDiscoveryScore()', owner: 'discovery', category: 'discovery', source: 'ES-010', unit: 'score', refreshInterval: 'daily' },
  { id: 'trending_score', title: 'Trending Score', description: 'Velocity of discovery momentum', formula: 'growth * engagement weight', owner: 'discovery', category: 'discovery', source: 'ES-010', unit: 'score', refreshInterval: 'hourly' },
  // Trust
  { id: 'trust_score', title: 'Trust Score', description: 'Publisher and brand trust composite', formula: 'trust platform aggregate', owner: 'trust', category: 'trust', source: 'ES-009', unit: 'score', refreshInterval: 'daily' },
  // Health
  { id: 'health_score', title: 'Health Score', description: 'Campaign and catalog readiness', formula: 'assessProductHealth + quality', owner: 'spotlight', category: 'health', source: 'computed', unit: 'score', refreshInterval: 'daily' },
  { id: 'quality_score', title: 'Quality Score', description: 'Content quality composite', formula: 'media + SEO + completeness', owner: 'spotlight', category: 'health', source: 'computed', unit: 'score', refreshInterval: 'daily' },
  { id: 'readiness_score', title: 'Readiness Score', description: 'Publishing and AI readiness', formula: 'metadata + blocks + merchandising', owner: 'spotlight', category: 'health', source: 'computed', unit: 'score', refreshInterval: 'daily' },
  // Growth
  { id: 'growth_pct', title: 'Growth', description: 'Period-over-period change', formula: '(current - previous) / previous * 100', owner: 'marketplace', category: 'growth', source: 'computed', unit: 'percent', refreshInterval: 'daily' },
  // Inventory / ES-007
  { id: 'campaign_exposure', title: 'Campaign Exposure', description: 'Product appearances in campaigns', formula: 'COUNT product in campaign links', owner: 'spotlight', category: 'inventory', source: 'computed', unit: 'count', refreshInterval: 'daily' },
  { id: 'guide_mentions', title: 'Guide Mentions', description: 'Product mentions in guides', formula: 'COUNT guide product links', owner: 'spotlight', category: 'inventory', source: 'ES-007', unit: 'count', refreshInterval: 'daily' },
  { id: 'review_mentions', title: 'Review Mentions', description: 'Product mentions in reviews', formula: 'COUNT review product links', owner: 'spotlight', category: 'inventory', source: 'ES-007', unit: 'count', refreshInterval: 'daily' },
  { id: 'live_mentions', title: 'Live Mentions', description: 'Products pinned in live events', formula: 'COUNT live pin clicks', owner: 'spotlight', category: 'inventory', source: 'ES-008', unit: 'count', refreshInterval: 'hourly' },
  { id: 'peak_viewers', title: 'Peak Viewers', description: 'Max concurrent live viewers', formula: 'MAX(concurrent_viewers)', owner: 'spotlight', category: 'reach', source: 'placeholder', unit: 'count', refreshInterval: 'realtime' },
  { id: 'replay_views', title: 'Replay Views', description: 'Live replay watch count', formula: 'SUM(replay_view)', owner: 'spotlight', category: 'reach', source: 'ES-008', unit: 'count', refreshInterval: 'hourly' },
];

export function getMetricDefinition(id: string): IntelligenceMetricDefinition | undefined {
  return METRIC_REGISTRY.find((m) => m.id === id);
}

export function metricsByCategory(category: IntelligenceMetricDefinition['category']): IntelligenceMetricDefinition[] {
  return METRIC_REGISTRY.filter((m) => m.category === category);
}

export const METRIC_COUNT = METRIC_REGISTRY.length;
