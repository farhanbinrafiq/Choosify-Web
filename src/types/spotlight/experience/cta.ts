/**
 * Contextual CTA labels — no generic buttons
 */

import type { SpotlightContentType } from './contentTypes';

const CTA_MAP: Record<SpotlightContentType, string> = {
  campaign: 'Explore Campaign',
  promotion: 'View Promotion',
  new_launch: 'Discover Launch',
  brand_story: 'See Brand Story',
  announcement: 'Read Announcement',
  event: 'View Event',
  whats_on: "See What's On",
  live: 'Watch Live',
  creator_review: 'Watch Review',
  product_review: 'Read Review',
  buying_guide: 'Read Guide',
  tutorial: 'Watch Tutorial',
  tips: 'View Tips',
  comparison: 'Compare Now',
  recommendation: 'View Recommendation',
  editorial: 'Read Story',
  community_pick: 'Explore Pick',
  ai_content: 'Explore',
  podcast: 'Listen Now',
  webinar: 'Join Webinar',
  livestream_replay: 'Watch Replay',
};

export function getSpotlightContentCtaLabel(type: SpotlightContentType): string {
  return CTA_MAP[type] ?? 'Explore';
}

export function getSpotlightProductCtaLabel(): string {
  return 'Product Details';
}

export function getSpotlightBrandCtaLabel(): string {
  return 'Explore Brand';
}

export function getSpotlightShopCtaLabel(): string {
  return 'Shop Now';
}
