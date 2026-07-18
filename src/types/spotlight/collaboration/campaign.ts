/**
 * Campaign collaboration — multiple brands, creators, sellers per campaign
 */

import type { SpotlightCollaborationRole } from './engine';

export type SpotlightContributionType =
  | 'campaign_owner'
  | 'brand_partner'
  | 'creator_review'
  | 'creator_live'
  | 'creator_tutorial'
  | 'product_feature'
  | 'service_feature'
  | 'media_asset'
  | 'sponsor'
  | 'distribution'
  | 'retail_listing'
  | 'editorial_curation';

export interface SpotlightCampaignContribution {
  contributionId: string;
  campaignId: string;
  publisherId: string;
  publisherName: string;
  publisherLogoUrl?: string;
  role: SpotlightCollaborationRole;
  contributionType: SpotlightContributionType;
  isVerified: boolean;
  headline?: string;
  contentId?: string;
  productIds: string[];
  serviceIds: string[];
  sortOrder: number;
  createdAt: string;
}

export interface SpotlightCampaignCollaborationGraph {
  campaignId: string;
  ownerPublisherId: string;
  brandPublisherIds: string[];
  creatorPublisherIds: string[];
  sellerPublisherIds: string[];
  partnerPublisherIds: string[];
  contributions: SpotlightCampaignContribution[];
}

export const CONTRIBUTION_TYPE_LABELS: Record<SpotlightContributionType, string> = {
  campaign_owner: 'Campaign Owner',
  brand_partner: 'Brand Partner',
  creator_review: 'Creator Review',
  creator_live: 'Creator Live',
  creator_tutorial: 'Creator Tutorial',
  product_feature: 'Product Feature',
  service_feature: 'Service Feature',
  media_asset: 'Media',
  sponsor: 'Sponsor',
  distribution: 'Distribution',
  retail_listing: 'Retail Listing',
  editorial_curation: 'Editorial',
};
