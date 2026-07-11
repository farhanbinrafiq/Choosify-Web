/**
 * Unified Spotlight content document — single rendering architecture
 */

import type { UniversalMedia } from '../../../components/media/types/mediaModel';
import type { SpotlightContentType, SpotlightContentSourceKind } from './contentTypes';
import type { SpotlightPublisher } from './publisher';
import type { SpotlightCollaborator } from './collaboration';
import type { SpotlightContentConnections } from './connections';
import type { SpotlightContentGraph } from './contentGraph';
import type { SpotlightCommerceOverlay } from './commerceOverlay';
import type { SpotlightLiveConfig } from './live';
import type { SpotlightDiscoveryScore } from '../discovery/discoveryScore';

export interface SpotlightContent {
  contentId: string;
  slug: string;
  contentType: SpotlightContentType;
  sourceKind: SpotlightContentSourceKind;
  sourceId: string;

  publisher: SpotlightPublisher;
  collaborators?: SpotlightCollaborator[];

  headline: string;
  description?: string;
  media: UniversalMedia | null;

  connections: SpotlightContentConnections;
  graph: SpotlightContentGraph;
  commerce: SpotlightCommerceOverlay;
  live?: SpotlightLiveConfig;

  badges: string[];
  isSponsored: boolean;
  isLive: boolean;
  isVerified: boolean;

  ctaLabel: string;
  href: string;

  publishedAt: string;
  endsAt?: string;
  popularityScore?: number;
  /** Future AI personalization */
  aiScore?: number;
  /** Universal discovery ranking (Phase 4) */
  discoveryScore?: SpotlightDiscoveryScore;

  extraProductCount?: number;
  seasonalTheme?: string;
}

export interface SpotlightDiscoverSection {
  id: SpotlightDiscoverSectionId;
  title: string;
  subtitle?: string;
  items: SpotlightContent[];
  layout: 'carousel' | 'grid' | 'hero' | 'list' | 'collection_row';
  maxItems?: number;
  viewAllHref?: string;
  /** Collection IDs for collection_row layout */
  collectionIds?: string[];
}

export type SpotlightDiscoverSectionId =
  | 'featured_today'
  | 'trending_now'
  | 'editors_picks'
  | 'recommended_for_you'
  | 'continue_browsing'
  | 'continue_watching'
  | 'live_now'
  | 'upcoming'
  | 'ending_soon'
  | 'recently_added'
  | 'popular_this_week'
  | 'popular_this_month'
  | 'top_campaigns'
  | 'top_creators'
  | 'top_brands'
  | 'top_services'
  | 'buying_guides'
  | 'creator_reviews'
  | 'brand_stories'
  | 'announcements'
  | 'whats_on'
  | 'collections'
  | 'series'
  | 'trending'
  | 'new_launches'
  | 'campaigns'
  | 'creator_picks'
  | 'recommendations'
  | 'events'
  | 'latest_reviews'
  | 'latest_videos'
  | 'latest_announcements';

export const SPOTLIGHT_DISCOVER_SECTION_META: Record<
  SpotlightDiscoverSectionId,
  { title: string; subtitle?: string; layout: SpotlightDiscoverSection['layout'] }
> = {
  featured_today: { title: 'Featured Today', subtitle: 'Hand-picked experience', layout: 'hero' },
  trending_now: { title: 'Trending Now', subtitle: 'What shoppers are exploring right now', layout: 'carousel' },
  editors_picks: { title: "Editor's Picks", subtitle: 'Curated by Choosify editorial', layout: 'carousel' },
  recommended_for_you: { title: 'Recommended For You', subtitle: 'Personalization coming soon', layout: 'carousel' },
  continue_browsing: { title: 'Continue Browsing', subtitle: 'Pick up where you left off', layout: 'carousel' },
  continue_watching: { title: 'Continue Watching', subtitle: 'Resume live and video experiences', layout: 'carousel' },
  live_now: { title: 'Live Now', subtitle: 'Watch live sessions', layout: 'carousel' },
  upcoming: { title: 'Upcoming', subtitle: 'Coming soon', layout: 'carousel' },
  ending_soon: { title: 'Ending Soon', subtitle: "Don't miss out", layout: 'carousel' },
  recently_added: { title: 'Recently Added', subtitle: 'Fresh on Spotlight', layout: 'carousel' },
  popular_this_week: { title: 'Popular This Week', subtitle: 'Top experiences this week', layout: 'carousel' },
  popular_this_month: { title: 'Popular This Month', subtitle: 'Monthly highlights', layout: 'carousel' },
  top_campaigns: { title: 'Top Campaigns', subtitle: 'Highest engagement campaigns', layout: 'carousel' },
  top_creators: { title: 'Top Creators', subtitle: 'Creators shoppers trust', layout: 'carousel' },
  top_brands: { title: 'Top Brands', subtitle: 'Leading brand experiences', layout: 'carousel' },
  top_services: { title: 'Top Services', subtitle: 'Services worth exploring', layout: 'carousel' },
  buying_guides: { title: 'Buying Guides', subtitle: 'Make confident decisions', layout: 'grid' },
  creator_reviews: { title: 'Creator Reviews', subtitle: 'Honest creator takes', layout: 'grid' },
  brand_stories: { title: 'Brand Stories', subtitle: 'Behind the brands you love', layout: 'carousel' },
  announcements: { title: 'Announcements', subtitle: 'News from brands', layout: 'list' },
  whats_on: { title: "What's On", subtitle: 'Events & moments', layout: 'carousel' },
  collections: { title: 'Collections', subtitle: 'Seasonal & editorial picks', layout: 'collection_row' },
  series: { title: 'Series', subtitle: 'Episodic experiences', layout: 'carousel' },
  trending: { title: 'Trending', subtitle: 'What shoppers are exploring', layout: 'carousel' },
  new_launches: { title: 'New Launches', subtitle: 'Fresh product stories', layout: 'carousel' },
  campaigns: { title: 'Campaigns', subtitle: 'Brand campaigns & collections', layout: 'carousel' },
  creator_picks: { title: 'Creator Picks', subtitle: 'Trusted creator experiences', layout: 'carousel' },
  recommendations: { title: 'Recommendations', subtitle: 'Curated buying advice', layout: 'carousel' },
  events: { title: 'Events', subtitle: 'Festivals, launches & more', layout: 'carousel' },
  latest_reviews: { title: 'Latest Reviews', subtitle: 'Honest product takes', layout: 'grid' },
  latest_videos: { title: 'Latest Videos', subtitle: 'Guides & reels', layout: 'carousel' },
  latest_announcements: { title: 'Announcements', subtitle: 'News from brands', layout: 'list' },
};
