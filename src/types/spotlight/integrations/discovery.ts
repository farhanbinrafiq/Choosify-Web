/**
 * ES-010 Discovery contract — LE-005.3.2
 */

import type { SpotlightCampaignSummary } from '../campaign';
import type { SpotlightApiListResponse } from '../api/common';

export interface SpotlightDiscoveryQuery {
  surface?: 'homepage' | 'spotlight_feed' | 'brand_page' | 'category_page' | 'search';
  brandId?: string;
  categoryId?: string;
  userId?: string;
  limit?: number;
  cursor?: string;
}

export interface SpotlightCampaignRankingFactors {
  priority: number;
  boostScore?: number;
  healthScore?: number;
  sponsorshipWeight?: number;
  recencyScore?: number;
}

export interface SpotlightRankedCampaign {
  campaign: SpotlightCampaignSummary;
  rank: number;
  factors: SpotlightCampaignRankingFactors;
}

export interface SpotlightDiscoveryServiceContract {
  getFeatured(query: SpotlightDiscoveryQuery): Promise<SpotlightApiListResponse<SpotlightCampaignSummary>>;
  getTrending(query: SpotlightDiscoveryQuery): Promise<SpotlightApiListResponse<SpotlightCampaignSummary>>;
  getHomepageCampaigns(query: SpotlightDiscoveryQuery): Promise<SpotlightApiListResponse<SpotlightCampaignSummary>>;
  getBrandCampaigns(brandId: string, query?: SpotlightDiscoveryQuery): Promise<SpotlightApiListResponse<SpotlightCampaignSummary>>;
  getCategoryCampaigns(categoryId: string, query?: SpotlightDiscoveryQuery): Promise<SpotlightApiListResponse<SpotlightCampaignSummary>>;
  getRecommendations(userId: string, query?: SpotlightDiscoveryQuery): Promise<SpotlightApiListResponse<SpotlightCampaignSummary>>;
  search(q: string, query?: SpotlightDiscoveryQuery): Promise<SpotlightApiListResponse<SpotlightCampaignSummary>>;
  autocomplete(q: string, limit?: number): Promise<string[]>;
  rank(campaigns: SpotlightCampaignSummary[], context: SpotlightDiscoveryQuery): Promise<SpotlightRankedCampaign[]>;
}

/** @deprecated Use SpotlightDiscoveryServiceContract */
export interface SpotlightDiscoveryRef {
  campaignId: string;
  searchKeywords: string[];
  categoryTags: string[];
  boostScore?: number;
}
