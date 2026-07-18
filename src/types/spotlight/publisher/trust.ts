/**
 * Trust badges — ES-009 preparation (Phase 2)
 */

export type SpotlightTrustBadgeType =
  | 'official_publisher'
  | 'official_brand'
  | 'official_creator'
  | 'official_distributor'
  | 'official_partner'
  | 'verified_seller'
  | 'verified_business'
  | 'verified_creator'
  | 'marketplace_verified'
  | 'editorial_verified';

export interface SpotlightTrustBadge {
  type: SpotlightTrustBadgeType;
  label: string;
  issuedAt?: string;
  expiresAt?: string;
}

export const SPOTLIGHT_TRUST_BADGE_LABELS: Record<SpotlightTrustBadgeType, string> = {
  official_publisher: 'Official Publisher',
  official_brand: 'Official Brand',
  official_creator: 'Official Creator',
  official_distributor: 'Official Distributor',
  official_partner: 'Official Partner',
  verified_seller: 'Verified Seller',
  verified_business: 'Verified Business',
  verified_creator: 'Verified Creator',
  marketplace_verified: 'Marketplace Verified',
  editorial_verified: 'Editorial Verified',
};

export interface SpotlightPublisherTrustProfile {
  publisherId: string;
  badges: SpotlightTrustBadge[];
  es009TrustScore?: number;
  moderationStatus: 'clear' | 'review' | 'restricted';
  lastReviewedAt?: string;
}
