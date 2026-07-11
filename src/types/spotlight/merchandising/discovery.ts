/**
 * Merchandising discovery — ES-010 preparation, LE-005.4
 */

import type { SpotlightCampaignProductLink } from './productLink';

export interface SpotlightMerchandisingDiscoveryQuery {
  campaignId: string;
  surface?: string;
  limit?: number;
}

export interface SpotlightRankedMerchandiseItem {
  link: SpotlightCampaignProductLink;
  rank: number;
  boostScore?: number;
}

export interface SpotlightMerchandisingDiscoveryServiceContract {
  getFeaturedProducts(query: SpotlightMerchandisingDiscoveryQuery): Promise<SpotlightRankedMerchandiseItem[]>;
  getRecommendedProducts(query: SpotlightMerchandisingDiscoveryQuery): Promise<SpotlightRankedMerchandiseItem[]>;
  getTrendingProducts(query: SpotlightMerchandisingDiscoveryQuery): Promise<SpotlightRankedMerchandiseItem[]>;
  rankCampaignProducts(campaignId: string): Promise<SpotlightRankedMerchandiseItem[]>;
  rankCollection(collectionId: string): Promise<SpotlightRankedMerchandiseItem[]>;
}
