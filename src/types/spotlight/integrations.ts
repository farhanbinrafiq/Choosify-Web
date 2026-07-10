/**
 * Future integration hook interfaces — architecture only.
 */

import type { SpotlightCampaignAiMetadata } from './aiMetadata';
import type { SpotlightCampaignBudget } from './budget';

/** ES-008 Analytics */
export interface SpotlightAnalyticsRef {
  analyticsId: string;
  campaignId: string;
  impressionCount?: number;
  clickCount?: number;
  conversionCount?: number;
  lastAggregatedAt?: string;
}

export interface SpotlightAnalyticsEvent {
  eventType: 'impression' | 'click' | 'cta_click' | 'view' | 'share';
  campaignId: string;
  placementId?: string;
  surface?: string;
  productId?: string;
  sessionId?: string;
  timestamp: string;
}

/** ES-009 Moderation */
export interface SpotlightModerationRef {
  campaignId: string;
  status: 'pending' | 'approved' | 'rejected' | 'flagged';
  reviewerId?: string;
  notes?: string;
  reviewedAt?: string;
}

export interface SpotlightModerationEvent {
  eventId: string;
  campaignId: string;
  action: 'submit' | 'approve' | 'reject' | 'flag' | 'archive';
  actorId: string;
  reason?: string;
  createdAt: string;
}

/** ES-010 Discovery */
export interface SpotlightDiscoveryRef {
  campaignId: string;
  searchKeywords: string[];
  categoryTags: string[];
  boostScore?: number;
}

/** ES-011 Communication */
export interface SpotlightCommunicationRef {
  campaignId: string;
  notificationChannels: Array<'email' | 'push' | 'in_app'>;
  audienceSegmentId?: string;
}

/** ES-012 Emi AI — aligns with SpotlightCampaignAiMetadata */
export interface SpotlightAiRef extends SpotlightCampaignAiMetadata {
  campaignId: string;
  recommendedProductIds?: string[];
}

/** Monetization placeholder (future sprint) */
export interface SpotlightMonetizationRef {
  campaignId: string;
  isSponsored: boolean;
  budget?: SpotlightCampaignBudget;
  budgetId?: string;
  cpm?: number;
  cpc?: number;
  spendCap?: number;
}
