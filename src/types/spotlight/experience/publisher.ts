/**
 * Publisher model — owner of every Spotlight content (architecture only)
 */

export type SpotlightPublisherType =
  | 'brand'
  | 'creator'
  | 'influencer'
  | 'verified_seller'
  | 'retailer'
  | 'official_distributor'
  | 'service_provider'
  | 'organization'
  | 'ngo'
  | 'editorial_team'
  | 'marketplace_admin'
  | 'hotel'
  | 'restaurant'
  | 'travel_agency'
  | 'education'
  | 'healthcare'
  | 'business';

export interface SpotlightPublisher {
  publisherId: string;
  name: string;
  logoUrl?: string;
  publisherType: SpotlightPublisherType;
  isVerified: boolean;
  badges: string[];
  /** Future social graph */
  followers?: number;
  /** 0–100 trust signal */
  reputation?: number;
  /** 0–100 marketplace trust */
  trustScore?: number;
  profileHref?: string;
}

export const SPOTLIGHT_PUBLISHER_TYPE_LABELS: Record<SpotlightPublisherType, string> = {
  brand: 'Brand',
  creator: 'Creator',
  influencer: 'Influencer',
  verified_seller: 'Verified Seller',
  retailer: 'Retailer',
  official_distributor: 'Official Distributor',
  service_provider: 'Service Provider',
  organization: 'Organization',
  ngo: 'NGO',
  editorial_team: 'Editorial Team',
  marketplace_admin: 'Choosify',
  hotel: 'Hotel',
  restaurant: 'Restaurant',
  travel_agency: 'Travel Agency',
  education: 'Education',
  healthcare: 'Healthcare',
  business: 'Business',
};
