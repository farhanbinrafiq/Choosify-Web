import type {
  MediaClassificationResult,
  MediaProbeInput,
  UniversalMedia,
  UniversalMediaOrientation,
  UniversalMediaSlide,
  UniversalMediaType,
} from '../types/mediaModel';
import { classifyAspectRatio } from './aspectRatio';
import type { MediaRendererKind } from '../types/playback';

const VIDEO_MIME_PREFIX = 'video/';
const IMAGE_MIME_PREFIX = 'image/';

export function isVideoMimeType(mimeType?: string): boolean {
  return Boolean(mimeType?.startsWith(VIDEO_MIME_PREFIX));
}

export function isImageMimeType(mimeType?: string): boolean {
  return Boolean(mimeType?.startsWith(IMAGE_MIME_PREFIX));
}

export function classifyOrientation(
  width: number,
  height: number,
): UniversalMediaOrientation {
  if (width === height) return 'square';
  if (width / height > 2.2) return 'panorama';
  return width > height ? 'landscape' : 'portrait';
}

/**
 * Automatically classify uploaded media from probe metadata.
 * Admin may override fields on the saved UniversalMedia document.
 */
export function classifyMedia(input: MediaProbeInput): MediaClassificationResult {
  const { width, height, duration, mimeType, imageCount = 0, hasVideo } = input;
  const orientation = classifyOrientation(width, height);
  const aspectRatio = classifyAspectRatio(width, height);
  const isVideo = hasVideo || isVideoMimeType(mimeType) || (duration ?? 0) > 0;
  const isImage = isImageMimeType(mimeType);
  const count = imageCount || (isImage ? 1 : 0);

  let mediaType: UniversalMediaType;
  let dominantFormat: 'video' | 'image' | 'mixed';

  if (count > 1 && isVideo) {
    mediaType = 'mixed_media';
    dominantFormat = 'mixed';
  } else if (count > 1) {
    mediaType = 'carousel';
    dominantFormat = 'image';
  } else if (isVideo) {
    if (orientation === 'square') mediaType = 'square_video';
    else if (orientation === 'landscape') mediaType = 'landscape_video';
    else mediaType = 'vertical_video';
    dominantFormat = 'video';
  } else {
    if (orientation === 'square') mediaType = 'square_image';
    else if (orientation === 'landscape') mediaType = 'landscape_image';
    else mediaType = 'portrait_image';
    dominantFormat = 'image';
  }

  const recommendedProfileHints: string[] = [];
  if (mediaType === 'vertical_video') recommendedProfileHints.push('spotlight_feed');
  if (mediaType === 'landscape_video') {
    recommendedProfileHints.push('homepage_carousel', 'brand_embed');
  }
  if (mediaType === 'carousel' || mediaType === 'mixed_media') {
    recommendedProfileHints.push('campaign_details');
  }
  if (mediaType.includes('square')) {
    recommendedProfileHints.push('product_embed', 'mini_card');
  }

  return {
    mediaType,
    orientation,
    aspectRatio,
    resolution: { width, height },
    duration,
    imageCount: count,
    dominantFormat,
    recommendedProfileHints,
  };
}

/** Map stored media to renderer kind — metadata-driven, not page-specific */
export function resolveRendererKind(media: UniversalMedia): MediaRendererKind {
  switch (media.mediaType) {
    case 'vertical_video':
    case 'landscape_video':
    case 'square_video':
    case 'livestream':
      return 'video';
    case 'portrait_image':
    case 'landscape_image':
    case 'square_image':
      return 'image';
    case 'carousel':
      return 'carousel';
    case 'mixed_media':
    case 'creator_review':
    case 'three_sixty':
    case 'ar':
    case 'interactive_demo':
      return 'mixed';
    default:
      return media.videoUrl ? 'video' : media.imageUrls.length > 1 ? 'carousel' : 'image';
  }
}

/** Build ordered slides for carousel / mixed renderers */
export function buildMediaSlides(media: UniversalMedia): UniversalMediaSlide[] {
  const slides: UniversalMediaSlide[] = [];

  if (media.videoUrl) {
    slides.push({
      id: `${media.mediaId}-video`,
      kind: 'video',
      url: media.videoUrl,
      posterImage: media.posterImage ?? media.poster,
      altText: media.altText,
      mimeType: media.mimeType,
      duration: media.duration,
      displayOrder: 0,
    });
  }

  media.imageUrls.forEach((url, index) => {
    slides.push({
      id: `${media.mediaId}-img-${index}`,
      kind: 'image',
      url,
      altText: media.altText,
      displayOrder: media.videoUrl ? index + 1 : index,
    });
  });

  return slides.sort((a, b) => a.displayOrder - b.displayOrder);
}

/** Bridge SpotlightMedia → UniversalMedia */
export function toUniversalMedia(
  media: import('../../../types/spotlight/media').SpotlightMedia,
): UniversalMedia {
  return {
    ...media,
    mediaType: media.mediaType as UniversalMedia['mediaType'],
    orientation: media.orientation as UniversalMedia['orientation'],
    aspectRatio: media.aspectRatio as UniversalMedia['aspectRatio'],
    posterImage: media.poster,
    previewImage: media.preview,
  };
}
