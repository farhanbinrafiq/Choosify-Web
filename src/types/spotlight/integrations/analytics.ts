/**
 * ES-008 Analytics contract — LE-005.3.2
 */

export type SpotlightAnalyticsEventType =
  | 'campaign_impression'
  | 'campaign_view'
  | 'view_3s'
  | 'view_10s'
  | 'completion'
  | 'pause'
  | 'replay'
  | 'share'
  | 'compare'
  | 'wishlist'
  | 'product_details'
  | 'shop_now'
  | 'purchase'
  | 'campaign_conversion'
  | 'campaign_revenue';

export interface SpotlightAnalyticsContext {
  campaignId: string;
  placementId?: string;
  surface?: string;
  productId?: string;
  sessionId?: string;
  userId?: string;
  locale?: string;
}

export interface SpotlightAnalyticsTrackRequest {
  eventType: SpotlightAnalyticsEventType;
  context: SpotlightAnalyticsContext;
  timestamp: string;
  value?: number;
  currency?: string;
  metadata?: Record<string, unknown>;
}

export interface SpotlightAnalyticsRef {
  analyticsId: string;
  campaignId: string;
  impressionCount?: number;
  clickCount?: number;
  conversionCount?: number;
  revenueTotal?: number;
  lastAggregatedAt?: string;
}

export interface SpotlightAnalyticsServiceContract {
  track(req: SpotlightAnalyticsTrackRequest): Promise<void>;
  getCampaignMetrics(campaignId: string, from: string, to: string): Promise<SpotlightAnalyticsRef>;
  exportMetrics(campaignId: string, format: 'csv' | 'json'): Promise<{ exportId: string }>;
}
