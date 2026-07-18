/**
 * Feed Registry — shopping discovery feed configuration
 */

import type { ContentDensity } from './contentDensityRegistry';

export interface FeedRegistryConfig {
  id: 'spotlight_discover';
  label: string;
  philosophy: string;
  initialVisibleSections: number;
  sectionGap: string;
  enableFloatingFilters: boolean;
  enableLazySections: boolean;
  defaultCardDensity: ContentDensity;
  mixedDensityCarousel: boolean;
}

export const SPOTLIGHT_FEED_REGISTRY: FeedRegistryConfig = {
  id: 'spotlight_discover',
  label: 'Spotlight Shopping Discovery',
  philosophy: 'Browse products and services through engaging content — not another social feed.',
  initialVisibleSections: 6,
  sectionGap: '2.5rem',
  enableFloatingFilters: true,
  enableLazySections: true,
  defaultCardDensity: 'standard',
  mixedDensityCarousel: true,
};

export const SPOTLIGHT_FLOATING_FILTER_IDS = [
  { id: 'all', label: 'All' },
  { id: 'products', label: 'Products' },
  { id: 'services', label: 'Services' },
  { id: 'videos', label: 'Videos' },
  { id: 'reels', label: 'Reels' },
  { id: 'live', label: 'Live' },
  { id: 'reviews', label: 'Reviews' },
  { id: 'guides', label: 'Guides' },
  { id: 'brands', label: 'Brands' },
  { id: 'creators', label: 'Creators' },
  { id: 'collections', label: 'Collections' },
  { id: 'series', label: 'Series' },
  { id: 'offers', label: 'Offers' },
  { id: 'trending', label: 'Trending' },
  { id: 'saved', label: 'Saved' },
  { id: 'following', label: 'Following' },
] as const;
