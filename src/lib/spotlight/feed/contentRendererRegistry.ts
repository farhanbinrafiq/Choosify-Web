/**
 * Spotlight Content Renderer Registry — LE-005 UX-02
 * Type-adaptive hero layouts for the universal Spotlight Content Page.
 */

import type { SpotlightContentType } from '../../../types/spotlight/experience/contentTypes';
import type { UniversalMedia } from '../../../components/media/types/mediaModel';
import { resolveContentPageHeroAspect } from './mediaRegistry';
import { resolveRendererId } from '../content/rendererRegistry';

export type SpotlightContentHeroVariant =
  | 'portrait_player'
  | 'landscape_player'
  | 'square_player'
  | 'carousel'
  | 'live_player'
  | 'replay_player'
  | 'article_hero';

export interface SpotlightContentHeroDefinition {
  variant: SpotlightContentHeroVariant;
  aspectRatio: string;
  objectFit: 'cover' | 'contain';
  maxHeight: string;
  showPlayOverlay: boolean;
  label: string;
}

const CONTENT_TYPE_HERO: Partial<Record<SpotlightContentType, SpotlightContentHeroVariant>> = {
  live: 'live_player',
  livestream_replay: 'replay_player',
  creator_review: 'landscape_player',
  product_review: 'landscape_player',
  buying_guide: 'article_hero',
  tutorial: 'article_hero',
  editorial: 'article_hero',
  recommendation: 'portrait_player',
  campaign: 'landscape_player',
  new_launch: 'landscape_player',
  promotion: 'square_player',
  announcement: 'article_hero',
};

export function resolveContentHeroDefinition(
  contentType: SpotlightContentType,
  media: UniversalMedia | null | undefined,
  isLive?: boolean,
): SpotlightContentHeroDefinition {
  const mediaHero = resolveContentPageHeroAspect(media);
  let variant = CONTENT_TYPE_HERO[contentType] ?? mediaHero.variant;

  if (isLive && contentType === 'live') variant = 'live_player';
  if (contentType === 'livestream_replay') variant = 'replay_player';

  const labels: Record<SpotlightContentHeroVariant, string> = {
    portrait_player: 'Portrait Reel',
    landscape_player: 'Video',
    square_player: 'Square Video',
    carousel: 'Gallery',
    live_player: 'Live',
    replay_player: 'Live Replay',
    article_hero: 'Featured Image',
  };

  return {
    variant,
    aspectRatio: mediaHero.aspectRatio,
    objectFit: mediaHero.objectFit,
    maxHeight: mediaHero.maxHeight,
    showPlayOverlay: ['portrait_player', 'landscape_player', 'square_player', 'replay_player'].includes(variant),
    label: labels[variant],
  };
}

export function contentPageUsesGuideLayout(contentType: SpotlightContentType): boolean {
  return resolveRendererId(contentType).reusesGuideDetail === true;
}

/** Universal content page section order */
export const SPOTLIGHT_CONTENT_PAGE_SECTIONS = [
  'hero_media',
  'title',
  'brand_card',
  'creator',
  'description',
  'associated_products',
  'associated_services',
  'offers',
  'compare',
  'wishlist',
  'related_spotlight',
  'brand_profile',
  'creator_profile',
  'comments_future',
  'related_content',
] as const;

export type SpotlightContentPageSection = (typeof SPOTLIGHT_CONTENT_PAGE_SECTIONS)[number];
