/**
 * Publisher analytics preparation — ES-008 extension (no implementation)
 */

export type SpotlightPublisherAnalyticsMetric =
  | 'publisher_views'
  | 'creator_views'
  | 'campaign_views'
  | 'live_views'
  | 'ctr'
  | 'product_clicks'
  | 'revenue'
  | 'creator_revenue'
  | 'campaign_revenue'
  | 'collaboration_metrics';

export interface SpotlightPublisherAnalyticsSnapshot {
  publisherId: string;
  periodStart: string;
  periodEnd: string;
  metrics: Partial<Record<SpotlightPublisherAnalyticsMetric, number>>;
  collaborationBreakdown?: Record<string, number>;
}

export interface SpotlightCollaborationAnalytics {
  campaignId: string;
  totalContributors: number;
  creatorContributions: number;
  brandContributions: number;
  attributedRevenue: number;
  topContributorPublisherId?: string;
}

export interface SpotlightPublisherAnalyticsContract {
  getPublisherSnapshot(publisherId: string, from: string, to: string): Promise<SpotlightPublisherAnalyticsSnapshot>;
  getCollaborationMetrics(campaignId: string): Promise<SpotlightCollaborationAnalytics>;
}
