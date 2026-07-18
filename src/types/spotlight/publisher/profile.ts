/**
 * Full Publisher Profile — Phase 2 Publisher Ecosystem
 */

import type { SpotlightPublisherType } from '../experience/publisher';

export type { SpotlightPublisherType };

/** Extended publisher types for Phase 2 */
export type SpotlightPublisherProfileType =
  | SpotlightPublisherType
  | 'retail_store'
  | 'marketplace'
  | 'influencer';

export interface SpotlightPublisherSocialLink {
  platform: 'website' | 'facebook' | 'instagram' | 'youtube' | 'twitter' | 'linkedin' | 'tiktok';
  url: string;
  label?: string;
}

export interface SpotlightPublisherStats {
  campaignCount: number;
  liveCount: number;
  reviewCount: number;
  contentCount: number;
  collaborationCount: number;
  productCount: number;
}

export interface SpotlightPublisherProfile {
  publisherId: string;
  slug: string;
  name: string;
  publisherType: SpotlightPublisherProfileType;
  logoUrl?: string;
  coverUrl?: string;
  description?: string;
  tagline?: string;
  isVerified: boolean;
  officialWebsite?: string;
  socialLinks: SpotlightPublisherSocialLink[];
  badges: string[];
  trustScore: number;
  reputation: number;
  stats: SpotlightPublisherStats;
  /** Future follow graph */
  followers?: number;
  following?: number;
  /** Source entity for resolution */
  sourceKind: 'brand' | 'creator' | 'seller' | 'editorial' | 'organization';
  sourceId: string;
  createdAt?: string;
  updatedAt?: string;
}

export const SPOTLIGHT_PUBLISHER_PROFILE_TYPE_LABELS: Record<SpotlightPublisherProfileType, string> = {
  brand: 'Brand',
  creator: 'Creator',
  influencer: 'Influencer',
  verified_seller: 'Verified Seller',
  retailer: 'Retailer',
  retail_store: 'Retail Store',
  official_distributor: 'Official Distributor',
  service_provider: 'Service Provider',
  organization: 'Organization',
  ngo: 'NGO',
  editorial_team: 'Editorial Team',
  marketplace_admin: 'Marketplace',
  marketplace: 'Marketplace',
  hotel: 'Hotel',
  restaurant: 'Restaurant',
  travel_agency: 'Travel Agency',
  education: 'Education',
  healthcare: 'Healthcare',
  business: 'Business',
};
