/**
 * Interactive commerce CTA labels
 */

import type { SpotlightInteractiveCommerceEvent } from './event';

export type SpotlightInteractiveCtaAction =
  | 'watch_live'
  | 'watch_replay'
  | 'notify_me'
  | 'explore_campaign'
  | 'buy'
  | 'compare'
  | 'wishlist'
  | 'contact_seller'
  | 'view_brand'
  | 'read_guide';

const CTA_LABELS: Record<SpotlightInteractiveCtaAction, string> = {
  watch_live: 'Watch Live',
  watch_replay: 'Watch Replay',
  notify_me: 'Notify Me',
  explore_campaign: 'Explore Campaign',
  buy: 'Buy Now',
  compare: 'Compare',
  wishlist: 'Wishlist',
  contact_seller: 'Contact Seller',
  view_brand: 'View Brand',
  read_guide: 'Read Guide',
};

export function getInteractiveCtaLabel(action: SpotlightInteractiveCtaAction): string {
  return CTA_LABELS[action];
}

export function resolvePrimaryInteractiveCta(event: SpotlightInteractiveCommerceEvent): SpotlightInteractiveCtaAction {
  if (event.status === 'upcoming') return 'notify_me';
  if (event.status === 'replay' || event.status === 'ended') return 'watch_replay';
  if (event.status === 'live') return 'watch_live';
  return 'explore_campaign';
}

export function resolvePrimaryInteractiveCtaLabel(event: SpotlightInteractiveCommerceEvent): string {
  return getInteractiveCtaLabel(resolvePrimaryInteractiveCta(event));
}
