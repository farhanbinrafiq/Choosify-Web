import type { UniversalMedia } from './mediaModel';

/**
 * Display profiles — pages pass profile key; renderer decides layout.
 * Avoids scattering placement-specific layout logic across the app.
 */
export type MediaDisplayProfileKey =
  | 'homepage_carousel'
  | 'spotlight_feed'
  | 'campaign_details'
  | 'product_embed'
  | 'brand_embed'
  | 'category_embed'
  | 'mini_card';

export interface MediaDisplayProfile {
  key: MediaDisplayProfileKey;
  label: string;
  autoplay: boolean;
  muted: boolean;
  loop: boolean;
  showControls: boolean;
  lazyVideo: boolean;
  lazyImages: boolean;
  priorityImage: boolean;
  enableCarouselGestures: boolean;
  showCarouselIndicators: boolean;
  aspectRatio?: string;
  maxHeight?: string;
  objectFit: 'cover' | 'contain' | 'fill';
  rounded: boolean;
  requireAltText: boolean;
}

export const MEDIA_DISPLAY_PROFILES: Record<MediaDisplayProfileKey, MediaDisplayProfile> = {
  homepage_carousel: {
    key: 'homepage_carousel',
    label: 'Homepage Spotlight Carousel',
    autoplay: true,
    muted: true,
    loop: true,
    showControls: false,
    lazyVideo: true,
    lazyImages: true,
    priorityImage: false,
    enableCarouselGestures: true,
    showCarouselIndicators: true,
    aspectRatio: '16 / 9',
    maxHeight: '420px',
    objectFit: 'cover',
    rounded: true,
    requireAltText: true,
  },
  spotlight_feed: {
    key: 'spotlight_feed',
    label: 'Spotlight Feed',
    autoplay: true,
    muted: true,
    loop: true,
    showControls: true,
    lazyVideo: true,
    lazyImages: true,
    priorityImage: false,
    enableCarouselGestures: true,
    showCarouselIndicators: true,
    aspectRatio: '9 / 16',
    maxHeight: '80vh',
    objectFit: 'cover',
    rounded: true,
    requireAltText: true,
  },
  campaign_details: {
    key: 'campaign_details',
    label: 'Campaign Details',
    autoplay: false,
    muted: false,
    loop: false,
    showControls: true,
    lazyVideo: false,
    lazyImages: false,
    priorityImage: true,
    enableCarouselGestures: true,
    showCarouselIndicators: true,
    objectFit: 'contain',
    rounded: true,
    requireAltText: true,
  },
  product_embed: {
    key: 'product_embed',
    label: 'Product Page Embed',
    autoplay: false,
    muted: true,
    loop: true,
    showControls: true,
    lazyVideo: true,
    lazyImages: true,
    priorityImage: false,
    enableCarouselGestures: true,
    showCarouselIndicators: true,
    aspectRatio: '1 / 1',
    maxHeight: '360px',
    objectFit: 'cover',
    rounded: true,
    requireAltText: true,
  },
  brand_embed: {
    key: 'brand_embed',
    label: 'Brand Page Embed',
    autoplay: false,
    muted: true,
    loop: true,
    showControls: false,
    lazyVideo: true,
    lazyImages: true,
    priorityImage: false,
    enableCarouselGestures: true,
    showCarouselIndicators: true,
    aspectRatio: '16 / 9',
    maxHeight: '320px',
    objectFit: 'cover',
    rounded: true,
    requireAltText: true,
  },
  category_embed: {
    key: 'category_embed',
    label: 'Category Page Embed',
    autoplay: false,
    muted: true,
    loop: false,
    showControls: false,
    lazyVideo: true,
    lazyImages: true,
    priorityImage: false,
    enableCarouselGestures: true,
    showCarouselIndicators: false,
    aspectRatio: '4 / 5',
    maxHeight: '280px',
    objectFit: 'cover',
    rounded: true,
    requireAltText: true,
  },
  mini_card: {
    key: 'mini_card',
    label: 'Widget / Recommendation Card',
    autoplay: false,
    muted: true,
    loop: true,
    showControls: false,
    lazyVideo: true,
    lazyImages: true,
    priorityImage: false,
    enableCarouselGestures: false,
    showCarouselIndicators: false,
    aspectRatio: '1 / 1',
    maxHeight: '120px',
    objectFit: 'cover',
    rounded: true,
    requireAltText: true,
  },
};

export function getDisplayProfile(key: MediaDisplayProfileKey): MediaDisplayProfile {
  return MEDIA_DISPLAY_PROFILES[key];
}

export function resolveProfileAspectRatio(
  profile: MediaDisplayProfile,
  media: UniversalMedia,
): string | undefined {
  if (profile.aspectRatio) return profile.aspectRatio;
  switch (media.aspectRatio) {
    case '9:16':
      return '9 / 16';
    case '16:9':
      return '16 / 9';
    case '1:1':
      return '1 / 1';
    case '4:5':
      return '4 / 5';
    case '4:3':
      return '4 / 3';
    case '21:9':
      return '21 / 9';
    default:
      return undefined;
  }
}
