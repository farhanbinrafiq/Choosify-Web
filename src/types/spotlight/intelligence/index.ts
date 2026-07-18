/**
 * Spotlight Intelligence Platform — LE-005 Phase 5.2 + 5.4
 * Frontend-only contracts; aggregates ES-007/008/009/010/011/012 shapes without API changes.
 */

export type IntelligenceTimeRange =
  | 'today'
  | '7d'
  | '30d'
  | '90d'
  | '12m'
  | 'custom';

export type IntelligenceSectionId =
  | 'mission_control'
  | 'overview'
  | 'content'
  | 'campaigns'
  | 'brands'
  | 'creators'
  | 'products'
  | 'live'
  | 'discovery'
  | 'trust'
  | 'health'
  | 'funnel'
  | 'heatmaps'
  | 'leaderboards'
  | 'insights'
  | 'executive';

export type MetricCategory =
  | 'reach'
  | 'engagement'
  | 'commerce'
  | 'discovery'
  | 'trust'
  | 'health'
  | 'growth'
  | 'inventory';

export type MetricUnit = 'count' | 'percent' | 'score' | 'currency' | 'duration' | 'ratio';

export interface IntelligenceMetricDefinition {
  id: string;
  title: string;
  description: string;
  formula: string;
  owner: 'spotlight' | 'marketplace' | 'trust' | 'discovery' | 'commerce';
  category: MetricCategory;
  source: 'ES-008' | 'ES-007' | 'ES-009' | 'ES-010' | 'computed' | 'placeholder';
  unit: MetricUnit;
  refreshInterval: 'realtime' | 'hourly' | 'daily';
}

export type ScoreKind =
  | 'discovery'
  | 'trust'
  | 'health'
  | 'growth'
  | 'commerce'
  | 'engagement'
  | 'quality'
  | 'readiness'
  | 'ai';

export interface IntelligenceScoreDefinition {
  id: ScoreKind;
  title: string;
  description: string;
  formula: string;
  source: 'ES-009' | 'ES-010' | 'ES-008' | 'computed';
  maxValue: number;
}

export interface IntelligenceBenchmark {
  current: number;
  previousPeriod: number;
  platformAverage: number;
  topPerformer: number;
  changePercent: number;
  trend: 'up' | 'down' | 'flat';
}

export interface IntelligenceMetricValue {
  metricId: string;
  value: number;
  benchmark?: IntelligenceBenchmark;
  formatted?: string;
}

export interface IntelligenceWidgetDefinition {
  widgetId: string;
  title: string;
  description: string;
  roles: Array<'admin' | 'brand' | 'creator' | 'seller' | 'moderator'>;
  supportedFilters: string[];
  dependencies: string[];
  size: 'sm' | 'md' | 'lg' | 'full';
  refreshStrategy: 'static' | 'poll' | 'on-filter';
  section: IntelligenceSectionId;
}

export type InsightKind =
  | 'top_campaign'
  | 'top_brand'
  | 'top_creator'
  | 'top_product'
  | 'fastest_growing'
  | 'highest_ctr'
  | 'needs_attention'
  | 'lowest_engagement'
  | 'top_opportunity'
  | 'weak_content'
  | 'upcoming_trends'
  | 'live_active'
  | 'expiring_campaigns'
  | 'scheduled_7d'
  | 'ai_placeholder';

export interface IntelligenceInsightDefinition {
  id: InsightKind;
  title: string;
  description: string;
  drillDownSection: IntelligenceSectionId;
  drillDownEntityType?: 'campaign' | 'brand' | 'creator' | 'product';
}

export interface IntelligenceGlobalFilters {
  timeRange: IntelligenceTimeRange;
  contentType?: string;
  campaignId?: string;
  brandId?: string;
  creatorId?: string;
  publisherId?: string;
  categoryId?: string;
  collectionId?: string;
  seriesId?: string;
  status?: string;
}

export type HeatmapKind =
  | 'content'
  | 'commerce'
  | 'engagement'
  | 'category'
  | 'timeline'
  | 'live_interaction';

export interface IntelligenceHeatmapCell {
  row: string;
  col: string;
  value: number;
  label?: string;
}

export interface IntelligenceFunnelStep {
  id: string;
  label: string;
  value: number;
  dropoffPercent?: number;
}

export interface IntelligenceContentRow {
  contentId: string;
  title: string;
  contentType: string;
  status: string;
  views: IntelligenceMetricValue;
  reach: IntelligenceMetricValue;
  uniqueVisitors: IntelligenceMetricValue;
  avgReadTime: IntelligenceMetricValue;
  avgWatchTime: IntelligenceMetricValue;
  completionRate: IntelligenceMetricValue;
  ctr: IntelligenceMetricValue;
  productsClicked: IntelligenceMetricValue;
  wishlist: IntelligenceMetricValue;
  compare: IntelligenceMetricValue;
  shares: IntelligenceMetricValue;
  saves: IntelligenceMetricValue;
  engagementScore: number;
  discoveryScore: number;
  trustScore: number;
  healthScore: number;
  growthTrend: IntelligenceMetricValue;
  href?: string;
}

export interface IntelligenceLiveSnapshot {
  upcoming: number;
  live: number;
  replay: number;
  peakViewers: IntelligenceMetricValue;
  avgDuration: IntelligenceMetricValue;
  pinnedProductsClicked: IntelligenceMetricValue;
  timelineEngagement: IntelligenceMetricValue;
  replayViews: IntelligenceMetricValue;
  commerceClicks: IntelligenceMetricValue;
  activeEvents: { id: string; title: string; status: 'upcoming' | 'live' | 'replay'; href?: string }[];
}

export interface IntelligenceMissionControlSnapshot {
  bestPerforming: { label: string; value: string; href?: string; metric: string }[];
  needsAttention: { label: string; value: string; href?: string; severity: 'warn' | 'critical' }[];
  trendingNow: { label: string; score: number; href?: string }[];
  liveActive: { label: string; status: string; href?: string }[];
  commerceDrivers: { label: string; clicks: number; href?: string }[];
  topCreators: { label: string; impact: number; href?: string }[];
  topProducts: { label: string; exposure: number; href?: string }[];
  expiringSoon: { label: string; daysLeft: number; href?: string }[];
  scheduledNext7: { label: string; date: string; href?: string }[];
}

export type ExportFormatId = 'csv' | 'excel' | 'pdf' | 'snapshot' | 'powerpoint';

export interface IntelligenceTimeSeriesPoint {
  label: string;
  value: number;
}

export interface IntelligenceLeaderboardRow {
  rank: number;
  id: string;
  label: string;
  subtitle?: string;
  value: number;
  valueLabel: string;
  changePercent?: number;
  href?: string;
}

export interface IntelligenceOverviewSnapshot {
  totalContent: number;
  drafts: number;
  campaigns: { published: number; scheduled: number; live: number; upcoming: number };
  contentByType: { guides: number; reviews: number; videos: number; campaigns: number; live: number };
  collections: number;
  series: number;
  brands: number;
  creators: number;
  products: number;
  views: IntelligenceMetricValue;
  uniqueVisitors: IntelligenceMetricValue;
  clicks: IntelligenceMetricValue;
  ctr: IntelligenceMetricValue;
  growth: IntelligenceMetricValue;
  avgWatchTime: IntelligenceMetricValue;
  discoveryScore: IntelligenceMetricValue;
  trustScore: IntelligenceMetricValue;
  healthScore: IntelligenceMetricValue;
  commerceScore: IntelligenceMetricValue;
  revenue: IntelligenceMetricValue;
  viewsTrend: IntelligenceTimeSeriesPoint[];
}
