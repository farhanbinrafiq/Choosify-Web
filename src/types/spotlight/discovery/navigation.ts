/**
 * Spotlight navigation — LE-005 Phase 5.2 Content Unification
 * Discover module retired; Spotlight is the single discovery destination.
 */

export interface SpotlightBreadcrumb {
  label: string;
  href?: string;
}

export type SpotlightHubSectionId =
  | 'overview'
  | 'live'
  | 'replay'
  | 'products'
  | 'guides'
  | 'reviews'
  | 'creator_content'
  | 'recommendations'
  | 'related_campaigns'
  | 'announcements'
  | 'events';

export interface SpotlightHubNavItem {
  id: SpotlightHubSectionId;
  label: string;
  href: string;
  isActive?: boolean;
}

export interface SpotlightDiscoveryNavItem {
  id: string;
  label: string;
  href: string;
}

/** Primary Spotlight hub navigation */
export const SPOTLIGHT_DISCOVERY_NAV: SpotlightDiscoveryNavItem[] = [
  { id: 'featured', label: 'Featured', href: '/spotlight' },
  { id: 'explore', label: 'Explore', href: '/spotlight/explore' },
  { id: 'search', label: 'Search', href: '/spotlight/search' },
  { id: 'calendar', label: 'Calendar', href: '/spotlight/calendar' },
  { id: 'collections', label: 'Collections', href: '/spotlight/explore?tab=collections' },
  { id: 'stories', label: 'Stories', href: '/spotlight/stories' },
];

/** Content-type tabs — filter via ?tab= on /spotlight */
export const SPOTLIGHT_CONTENT_TABS: SpotlightDiscoveryNavItem[] = [
  { id: 'featured', label: 'Featured', href: '/spotlight' },
  { id: 'campaigns', label: 'Campaigns', href: '/spotlight?tab=campaigns' },
  { id: 'live', label: 'Live', href: '/spotlight?tab=live' },
  { id: 'reviews', label: 'Reviews', href: '/spotlight?tab=reviews' },
  { id: 'guides', label: 'Guides', href: '/spotlight?tab=guides' },
  { id: 'recommendations', label: 'Recommendations', href: '/spotlight?tab=recommendations' },
  { id: 'videos', label: 'Videos', href: '/spotlight?tab=videos' },
  { id: 'reels', label: 'Reels', href: '/spotlight?tab=reels' },
  { id: 'blogs', label: 'Blogs', href: '/spotlight?tab=blogs' },
  { id: 'collections', label: 'Collections', href: '/spotlight/explore?tab=collections' },
  { id: 'series', label: 'Series', href: '/spotlight/explore?tab=series' },
  { id: 'announcements', label: 'Announcements', href: '/spotlight?tab=announcements' },
  { id: 'launches', label: 'Launches', href: '/spotlight?tab=launches' },
  { id: 'following', label: 'Following', href: '/spotlight?tab=following' },
  { id: 'saved', label: 'Saved', href: '/spotlight?tab=saved' },
];

export type SpotlightContentTabId =
  | 'featured'
  | 'campaigns'
  | 'live'
  | 'reviews'
  | 'guides'
  | 'recommendations'
  | 'videos'
  | 'reels'
  | 'blogs'
  | 'announcements'
  | 'launches'
  | 'following'
  | 'saved';
