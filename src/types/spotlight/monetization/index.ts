/**
 * Monetization preparation — no billing implementation
 */

export type SpotlightMonetizationFeature =
  | 'featured_publisher'
  | 'featured_creator'
  | 'sponsored_campaign'
  | 'sponsored_live'
  | 'premium_placement'
  | 'premium_analytics'
  | 'creator_marketplace'
  | 'brand_collaboration';

export interface SpotlightMonetizationTier {
  tierId: string;
  name: string;
  features: SpotlightMonetizationFeature[];
  monthlyPrice?: number;
  currency?: string;
}

export interface SpotlightMonetizationPlacement {
  placementId: string;
  feature: SpotlightMonetizationFeature;
  publisherId?: string;
  campaignId?: string;
  contentId?: string;
  startAt: string;
  endAt: string;
  priority: number;
}

export interface SpotlightMonetizationContract {
  listTiers(): Promise<SpotlightMonetizationTier[]>;
  getActivePlacements(surface: string): Promise<SpotlightMonetizationPlacement[]>;
}

export const MONETIZATION_FEATURE_LABELS: Record<SpotlightMonetizationFeature, string> = {
  featured_publisher: 'Featured Publisher',
  featured_creator: 'Featured Creator',
  sponsored_campaign: 'Sponsored Campaign',
  sponsored_live: 'Sponsored Live',
  premium_placement: 'Premium Placement',
  premium_analytics: 'Premium Analytics',
  creator_marketplace: 'Creator Marketplace',
  brand_collaboration: 'Brand Collaboration',
};
