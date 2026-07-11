/**
 * Brand experience architecture — brand pages consume Spotlight (future)
 */

import type { SpotlightDiscoverSectionId } from './content';

export type SpotlightBrandExperienceSection =
  | 'campaigns'
  | 'live'
  | 'recommendations'
  | 'guides'
  | 'reviews'
  | 'announcements'
  | 'events';

export interface SpotlightBrandExperienceConfig {
  brandId: string;
  enabledSections: SpotlightBrandExperienceSection[];
  /** Maps brand sections to discover section builders */
  sectionOrder: SpotlightBrandExperienceSection[];
  spotlightSurfaceKey: string;
}

export const DEFAULT_BRAND_EXPERIENCE_SECTIONS: SpotlightBrandExperienceSection[] = [
  'campaigns',
  'live',
  'recommendations',
  'guides',
  'reviews',
  'announcements',
  'events',
];

export const BRAND_SECTION_TO_DISCOVER: Partial<Record<SpotlightBrandExperienceSection, SpotlightDiscoverSectionId>> = {
  campaigns: 'campaigns',
  live: 'live_now',
  recommendations: 'recommendations',
  guides: 'buying_guides',
  reviews: 'latest_reviews',
  announcements: 'latest_announcements',
  events: 'events',
};
