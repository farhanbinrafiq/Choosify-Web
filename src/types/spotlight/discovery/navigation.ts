/**
 * Discovery navigation — breadcrumbs, sticky nav, quick jump.
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
  id: 'home' | 'explore' | 'search' | 'calendar' | 'collections' | 'stories';
  label: string;
  href: string;
}

export const SPOTLIGHT_DISCOVERY_NAV: SpotlightDiscoveryNavItem[] = [
  { id: 'home', label: 'Discover', href: '/spotlight' },
  { id: 'explore', label: 'Explore', href: '/spotlight/explore' },
  { id: 'search', label: 'Search', href: '/spotlight/search' },
  { id: 'calendar', label: 'Calendar', href: '/spotlight/calendar' },
  { id: 'collections', label: 'Collections', href: '/spotlight/explore?tab=collections' },
  { id: 'stories', label: 'Stories', href: '/spotlight/stories' },
];
