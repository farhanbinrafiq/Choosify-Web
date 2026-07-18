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

/** Full filter set — LE-006 Phase 1 order (sticky bar + floating drawer share this) */
export const SPOTLIGHT_FLOATING_FILTERS: SpotlightFloatingFilter[] = [
  { id: 'all', label: 'All', group: 'discovery' },
  { id: 'reels', label: 'Reels', group: 'content' },
  { id: 'videos', label: 'Videos', group: 'content' },
  { id: 'guides', label: 'Guides', group: 'content' },
  { id: 'brands', label: 'Brands', group: 'commerce' },
  { id: 'collections', label: 'Collections', group: 'discovery' },
  { id: 'offers', label: 'Offers', group: 'commerce' },
  { id: 'campaigns', label: 'Campaigns', group: 'commerce' },
  { id: 'reviews', label: 'Reviews', group: 'content' },
  { id: 'blogs', label: 'Blogs', group: 'content' },
  { id: 'live', label: 'Live', group: 'content' },
  { id: 'services', label: 'Services', group: 'commerce' },
  { id: 'trending', label: 'Trending', group: 'discovery' },
  { id: 'following', label: 'Following', group: 'social' },
  { id: 'saved', label: 'Saved', group: 'social' },
  { id: 'nearby', label: 'Nearby', group: 'discovery' },
  { id: 'products', label: 'Products', group: 'commerce' },
  { id: 'shorts', label: 'Shorts', group: 'content' },
  { id: 'series', label: 'Series', group: 'discovery' },
];

/** LE-006 Phase 1 — chips shown in the sticky feed filter bar, in order */
export const SPOTLIGHT_STICKY_FILTER_IDS = [
  'all',
  'reels',
  'videos',
  'guides',
  'brands',
  'collections',
  'offers',
  'campaigns',
  'reviews',
  'blogs',
  'live',
  'services',
  'trending',
  'following',
  'saved',
  'nearby',
] as const;
