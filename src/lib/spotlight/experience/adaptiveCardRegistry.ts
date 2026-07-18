/**
 * Adaptive Card Registry — LE-005 Phase 5.5.1
 * Cards adapt to content type; no single forced layout.
 */

import type { SpotlightContentType } from '../../../types/spotlight/experience/contentTypes';
import type { UniversalMediaType } from '../../../components/media/types/mediaModel';
import type { ContentDensity } from './contentDensityRegistry';

export type AdaptiveCardMode =
  | 'portrait_reel'
  | 'landscape_video'
  | 'square_post'
  | 'image_card'
  | 'carousel_card'
  | 'live_card'
  | 'story_card'
  | 'campaign_banner'
  | 'product_highlight'
  | 'service_highlight'
  | 'brand_feature'
  | 'collection_feature'
  | 'series_episode'
  | 'announcement'
  | 'product_launch'
  | 'offer_card'
  | 'guide_card'
  | 'review_card'
  | 'comparison_card'
  | 'default';

export interface AdaptiveCardDefinition {
  mode: AdaptiveCardMode;
  label: string;
  defaultDensity: ContentDensity;
  /** Product/service strip always visible when linked */
  commerceFirst: boolean;
  /** Prefer natural media orientation over forced crop */
  naturalMedia: boolean;
  primaryCta: 'shop_now' | 'product_details' | 'watch' | 'read' | 'explore';
}

const COMMERCE_DEFAULTS = {
  commerceFirst: true as const,
  naturalMedia: true as const,
  primaryCta: 'shop_now' as const,
};

export const ADAPTIVE_CARD_REGISTRY: Record<AdaptiveCardMode, AdaptiveCardDefinition> = {
  portrait_reel: { mode: 'portrait_reel', label: 'Portrait Reel', defaultDensity: 'compact', ...COMMERCE_DEFAULTS },
  landscape_video: { mode: 'landscape_video', label: 'Landscape Video', defaultDensity: 'standard', ...COMMERCE_DEFAULTS },
  square_post: { mode: 'square_post', label: 'Square Post', defaultDensity: 'compact', ...COMMERCE_DEFAULTS },
  image_card: { mode: 'image_card', label: 'Image Card', defaultDensity: 'standard', ...COMMERCE_DEFAULTS },
  carousel_card: { mode: 'carousel_card', label: 'Carousel', defaultDensity: 'standard', ...COMMERCE_DEFAULTS },
  live_card: { mode: 'live_card', label: 'Live', defaultDensity: 'featured', ...COMMERCE_DEFAULTS },
  story_card: { mode: 'story_card', label: 'Story', defaultDensity: 'compact', ...COMMERCE_DEFAULTS },
  campaign_banner: { mode: 'campaign_banner', label: 'Campaign', defaultDensity: 'featured', ...COMMERCE_DEFAULTS },
  product_highlight: { mode: 'product_highlight', label: 'Product Highlight', defaultDensity: 'standard', ...COMMERCE_DEFAULTS },
  service_highlight: { mode: 'service_highlight', label: 'Service Highlight', defaultDensity: 'standard', ...COMMERCE_DEFAULTS },
  brand_feature: { mode: 'brand_feature', label: 'Brand Feature', defaultDensity: 'standard', commerceFirst: true, naturalMedia: true, primaryCta: 'explore' },
  collection_feature: { mode: 'collection_feature', label: 'Collection', defaultDensity: 'standard', commerceFirst: true, naturalMedia: true, primaryCta: 'explore' },
  series_episode: { mode: 'series_episode', label: 'Series Episode', defaultDensity: 'compact', ...COMMERCE_DEFAULTS, primaryCta: 'watch' },
  announcement: { mode: 'announcement', label: 'Announcement', defaultDensity: 'compact', commerceFirst: true, naturalMedia: true, primaryCta: 'read' },
  product_launch: { mode: 'product_launch', label: 'Product Launch', defaultDensity: 'featured', ...COMMERCE_DEFAULTS },
  offer_card: { mode: 'offer_card', label: 'Offer', defaultDensity: 'compact', ...COMMERCE_DEFAULTS },
  guide_card: { mode: 'guide_card', label: 'Buying Guide', defaultDensity: 'standard', ...COMMERCE_DEFAULTS, primaryCta: 'read' },
  review_card: { mode: 'review_card', label: 'Review', defaultDensity: 'standard', ...COMMERCE_DEFAULTS, primaryCta: 'watch' },
  comparison_card: { mode: 'comparison_card', label: 'Comparison', defaultDensity: 'standard', ...COMMERCE_DEFAULTS, primaryCta: 'product_details' },
  default: { mode: 'default', label: 'Spotlight', defaultDensity: 'standard', ...COMMERCE_DEFAULTS },
};

const CONTENT_TYPE_CARD_MODE: Partial<Record<SpotlightContentType, AdaptiveCardMode>> = {
  campaign: 'campaign_banner',
  promotion: 'offer_card',
  new_launch: 'product_launch',
  live: 'live_card',
  livestream_replay: 'landscape_video',
  creator_review: 'review_card',
  product_review: 'review_card',
  buying_guide: 'guide_card',
  tutorial: 'guide_card',
  tips: 'guide_card',
  comparison: 'comparison_card',
  recommendation: 'product_highlight',
  announcement: 'announcement',
  brand_story: 'brand_feature',
  event: 'announcement',
  editorial: 'image_card',
  community_pick: 'product_highlight',
};

const MEDIA_TYPE_CARD_MODE: Partial<Record<UniversalMediaType, AdaptiveCardMode>> = {
  vertical_video: 'portrait_reel',
  landscape_video: 'landscape_video',
  square_video: 'square_post',
  portrait_image: 'portrait_reel',
  landscape_image: 'landscape_video',
  square_image: 'square_post',
  carousel: 'carousel_card',
  livestream: 'live_card',
};

export function resolveAdaptiveCardMode(
  contentType: SpotlightContentType,
  mediaType?: UniversalMediaType,
  hasProducts?: boolean,
  hasServices?: boolean,
): AdaptiveCardMode {
  if (hasProducts) return 'product_highlight';
  if (hasServices) return 'service_highlight';
  if (mediaType && MEDIA_TYPE_CARD_MODE[mediaType]) return MEDIA_TYPE_CARD_MODE[mediaType]!;
  return CONTENT_TYPE_CARD_MODE[contentType] ?? 'default';
}

export function resolveAdaptiveCardDefinition(
  contentType: SpotlightContentType,
  mediaType?: UniversalMediaType,
  hasProducts?: boolean,
  hasServices?: boolean,
): AdaptiveCardDefinition {
  const mode = resolveAdaptiveCardMode(contentType, mediaType, hasProducts, hasServices);
  return ADAPTIVE_CARD_REGISTRY[mode];
}
