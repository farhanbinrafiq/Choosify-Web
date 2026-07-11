/**
 * Spotlight Feed Registry — LE-005 UX-02
 * Shopping discovery feed configuration.
 */

export {
  SPOTLIGHT_FEED_REGISTRY,
  SPOTLIGHT_FLOATING_FILTER_IDS,
  type FeedRegistryConfig as SpotlightFeedConfig,
} from '../experience/feedRegistry';

import { SPOTLIGHT_FEED_REGISTRY } from '../experience/feedRegistry';

export const SPOTLIGHT_SHOPPING_FEED = {
  ...SPOTLIGHT_FEED_REGISTRY,
  version: 'UX-02',
  philosophy:
    'Discover products and services through shoppable content — a commerce feed, not a social video platform.',
  desktopLayout: 'structured_commerce_grid' as const,
  mobileLayout: 'vertical_native_ratio' as const,
  /** Explicitly NOT masonry */
  masonryEnabled: false,
  maxSectionItems: 10,
  minSectionItems: 6,
} as const;

export interface SpotlightFloatingFilter {
  id: string;
  label: string;
  group?: 'content' | 'commerce' | 'social' | 'discovery';
}

/** Full UX-02 floating filter set */
export const SPOTLIGHT_FLOATING_FILTERS: SpotlightFloatingFilter[] = [
  { id: 'all', label: 'All', group: 'discovery' },
  { id: 'products', label: 'Products', group: 'commerce' },
  { id: 'services', label: 'Services', group: 'commerce' },
  { id: 'videos', label: 'Videos', group: 'content' },
  { id: 'reels', label: 'Reels', group: 'content' },
  { id: 'shorts', label: 'Shorts', group: 'content' },
  { id: 'live', label: 'Live', group: 'content' },
  { id: 'reviews', label: 'Reviews', group: 'content' },
  { id: 'guides', label: 'Guides', group: 'content' },
  { id: 'brands', label: 'Brands', group: 'commerce' },
  { id: 'offers', label: 'Offers', group: 'commerce' },
  { id: 'collections', label: 'Collections', group: 'discovery' },
  { id: 'series', label: 'Series', group: 'discovery' },
  { id: 'nearby', label: 'Nearby', group: 'discovery' },
  { id: 'trending', label: 'Trending', group: 'discovery' },
  { id: 'saved', label: 'Saved', group: 'social' },
  { id: 'following', label: 'Following', group: 'social' },
];
