/**
 * Homepage Spotlight types — LE-005.5
 */

import type { SpotlightCampaignRecord } from './cms';
import type { UniversalMedia } from '../../components/media/types/mediaModel';
import type { CatalogProduct } from '../catalog';

export type SpotlightRotationStrategy =
  | 'sponsored_first'
  | 'priority'
  | 'new_launch'
  | 'trending'
  | 'ai_recommended';

export interface SpotlightRotationConfig {
  strategies: SpotlightRotationStrategy[];
}

export const DEFAULT_SPOTLIGHT_ROTATION: SpotlightRotationConfig = {
  strategies: ['sponsored_first', 'priority', 'new_launch', 'trending', 'ai_recommended'],
};

export type SpotlightHomepageFilter =
  | 'all'
  | 'new_launches'
  | 'promotions'
  | 'featured'
  | 'brand_stories'
  | 'events'
  | 'buying_guides';

export type SpotlightHomepageSort =
  | 'priority'
  | 'newest'
  | 'trending'
  | 'ending_soon'
  | 'sponsored';

export type SpotlightCampaignBadgeType =
  | 'new_launch'
  | 'promotion'
  | 'sale'
  | 'limited_time'
  | 'sponsored'
  | 'editors_pick'
  | 'trending'
  | 'featured'
  | 'brand_story';

export type SpotlightSeasonalTheme =
  | 'eid'
  | 'ramadan'
  | 'christmas'
  | 'new_year'
  | 'summer_sale'
  | 'back_to_school'
  | 'none';

export type SpotlightImpressionEventType =
  | 'visible'
  | 'clicked'
  | 'preview_started'
  | 'preview_completed';

export interface SpotlightImpressionEvent {
  type: SpotlightImpressionEventType;
  campaignId: string;
  surface: 'homepage';
  timestamp: string;
  metadata?: Record<string, unknown>;
}

export interface SpotlightImpressionCallbacks {
  onVisible?: (campaignId: string) => void;
  onClicked?: (campaignId: string) => void;
  onPreviewStarted?: (campaignId: string) => void;
  onPreviewCompleted?: (campaignId: string) => void;
}

/** Resolved card data for homepage rendering */
export interface HomepageSpotlightCardModel {
  campaign: SpotlightCampaignRecord;
  media: UniversalMedia | null;
  primaryProduct?: CatalogProduct;
  extraProductCount: number;
  badges: SpotlightCampaignBadgeType[];
  ctaLabel: string;
  exploreLabel: string;
  seasonalTheme?: SpotlightSeasonalTheme;
  brandLogoUrl?: string;
}

/** Continue Watching — architecture placeholder (CTO) */
export interface SpotlightContinueWatchingPlaceholder {
  enabled: boolean;
  campaignIds: string[];
  lastViewedAt?: string;
}

export const SPOTLIGHT_CONTINUE_WATCHING_KEY = 'choosify_spotlight_continue_watching';

export const SPOTLIGHT_HOMEPAGE_FILTER_KEY = 'choosify_spotlight_home_filter';
