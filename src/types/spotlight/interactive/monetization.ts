/**
 * Monetization preparation — interactive commerce (no billing)
 */

export type SpotlightInteractiveMonetizationSlot =
  | 'featured_live'
  | 'homepage_live'
  | 'premium_replay'
  | 'sponsored_chapter'
  | 'pinned_offer'
  | 'pinned_product'
  | 'creator_sponsorship'
  | 'brand_sponsorship'
  | 'premium_analytics';

export interface SpotlightInteractiveMonetizationConfig {
  eventId: string;
  slots: SpotlightInteractiveMonetizationSlot[];
  sponsoredChapterIds?: string[];
  featuredUntil?: string;
}

export const INTERACTIVE_MONETIZATION_LABELS: Record<SpotlightInteractiveMonetizationSlot, string> = {
  featured_live: 'Featured Live',
  homepage_live: 'Homepage Live',
  premium_replay: 'Premium Replay',
  sponsored_chapter: 'Sponsored Chapter',
  pinned_offer: 'Pinned Offer',
  pinned_product: 'Pinned Product',
  creator_sponsorship: 'Creator Sponsorship',
  brand_sponsorship: 'Brand Sponsorship',
  premium_analytics: 'Premium Analytics',
};
