/**
 * Media Presentation Registry — natural orientation, no unnecessary crop
 */

import type { UniversalAspectRatio, UniversalMedia, UniversalMediaType } from '../../../components/media/types/mediaModel';

export interface MediaPresentationDefinition {
  aspectRatio: string;
  objectFit: 'cover' | 'contain';
  maxHeight?: string;
  orientation: 'portrait' | 'landscape' | 'square';
}

const RATIO_CSS: Record<UniversalAspectRatio, string> = {
  '9:16': '9 / 16',
  '16:9': '16 / 9',
  '1:1': '1 / 1',
  '4:5': '4 / 5',
  '4:3': '4 / 3',
  '21:9': '21 / 9',
};

const MEDIA_TYPE_PRESENTATION: Partial<Record<UniversalMediaType, MediaPresentationDefinition>> = {
  vertical_video: { aspectRatio: '9 / 16', objectFit: 'contain', maxHeight: '480px', orientation: 'portrait' },
  landscape_video: { aspectRatio: '16 / 9', objectFit: 'contain', maxHeight: '360px', orientation: 'landscape' },
  square_video: { aspectRatio: '1 / 1', objectFit: 'contain', maxHeight: '360px', orientation: 'square' },
  portrait_image: { aspectRatio: '4 / 5', objectFit: 'contain', maxHeight: '420px', orientation: 'portrait' },
  landscape_image: { aspectRatio: '16 / 9', objectFit: 'contain', maxHeight: '320px', orientation: 'landscape' },
  square_image: { aspectRatio: '1 / 1', objectFit: 'contain', maxHeight: '320px', orientation: 'square' },
  carousel: { aspectRatio: '4 / 3', objectFit: 'cover', maxHeight: '320px', orientation: 'landscape' },
  livestream: { aspectRatio: '16 / 9', objectFit: 'contain', maxHeight: '360px', orientation: 'landscape' },
};

const DEFAULT_PRESENTATION: MediaPresentationDefinition = {
  aspectRatio: '16 / 9',
  objectFit: 'contain',
  maxHeight: '360px',
  orientation: 'landscape',
};

export function resolveMediaPresentation(media: UniversalMedia | null | undefined): MediaPresentationDefinition {
  if (!media) return DEFAULT_PRESENTATION;
  const byType = MEDIA_TYPE_PRESENTATION[media.mediaType];
  if (byType) return byType;
  const ratio = RATIO_CSS[media.aspectRatio];
  if (ratio) {
    return {
      aspectRatio: ratio,
      objectFit: 'contain',
      maxHeight: media.orientation === 'portrait' ? '480px' : '360px',
      orientation: media.orientation === 'panorama' ? 'landscape' : media.orientation,
    };
  }
  return DEFAULT_PRESENTATION;
}

/** Card-width hint for mixed-density carousels */
export function carouselItemWidthForMedia(media: UniversalMedia | null | undefined): number {
  const p = resolveMediaPresentation(media);
  if (p.orientation === 'portrait') return 220;
  if (p.orientation === 'square') return 260;
  return 300;
}
