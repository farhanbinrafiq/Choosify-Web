/**
 * Publisher page sections — /publisher/{slug}
 */

import type { SpotlightContent } from '../experience/content';
import type { SpotlightPublisherProfile } from './profile';
import type { SpotlightCampaignContribution } from '../collaboration/campaign';
import type { SpotlightContentTimeline } from '../graph/timeline';

export type SpotlightPublisherPageSectionId =
  | 'overview'
  | 'spotlight'
  | 'campaigns'
  | 'live'
  | 'creator_collaborations'
  | 'recommendations'
  | 'buying_guides'
  | 'announcements'
  | 'events'
  | 'products'
  | 'services'
  | 'reviews'
  | 'followers'
  | 'about';

export interface SpotlightPublisherPageSection {
  id: SpotlightPublisherPageSectionId;
  title: string;
  items?: SpotlightContent[];
  contributions?: SpotlightCampaignContribution[];
  timeline?: SpotlightContentTimeline;
  productIds?: string[];
  serviceIds?: string[];
  hidden?: boolean;
}

export interface SpotlightPublisherPageModel {
  profile: SpotlightPublisherProfile;
  sections: SpotlightPublisherPageSection[];
  activeSectionId: SpotlightPublisherPageSectionId;
}

export const PUBLISHER_PAGE_SECTION_META: Record<
  SpotlightPublisherPageSectionId,
  { title: string; future?: boolean }
> = {
  overview: { title: 'Overview' },
  spotlight: { title: 'Spotlight' },
  campaigns: { title: 'Campaigns' },
  live: { title: 'Live' },
  creator_collaborations: { title: 'Creator Collaborations' },
  recommendations: { title: 'Recommendations' },
  buying_guides: { title: 'Buying Guides' },
  announcements: { title: 'Announcements' },
  events: { title: 'Events' },
  products: { title: 'Products' },
  services: { title: 'Services' },
  reviews: { title: 'Reviews' },
  followers: { title: 'Followers', future: true },
  about: { title: 'About' },
};
