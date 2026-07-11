/**
 * Spotlight Media Registry — LE-005 UX-02
 * Natural media presentation; never force a single orientation.
 */

export {
  resolveMediaPresentation as resolveSpotlightMediaPresentation,
  carouselItemWidthForMedia as spotlightCarouselItemWidth,
  type MediaPresentationDefinition as SpotlightMediaPresentation,
} from '../experience/mediaPresentationRegistry';

import type { UniversalMedia } from '../../../components/media/types/mediaModel';
import { resolveMediaPresentation } from '../experience/mediaPresentationRegistry';

export const SPOTLIGHT_SUPPORTED_RATIOS = ['9:16', '16:9', '1:1', '4:5', '4:3', '3:4', '21:9'] as const;

export type SpotlightMediaOrientation = 'portrait' | 'landscape' | 'square';

export function spotlightMediaOrientation(media: UniversalMedia | null | undefined): SpotlightMediaOrientation {
  const p = resolveMediaPresentation(media);
  return p.orientation;
}

/** Content page hero aspect — type-adaptive, no crop */
export function resolveContentPageHeroAspect(media: UniversalMedia | null | undefined): {
  aspectRatio: string;
  objectFit: 'cover' | 'contain';
  maxHeight: string;
  variant: 'portrait_player' | 'landscape_player' | 'square_player' | 'carousel' | 'article_hero' | 'live_player';
} {
  const p = resolveMediaPresentation(media);
  if (!media) {
    return { aspectRatio: '16 / 9', objectFit: 'contain', maxHeight: '480px', variant: 'article_hero' };
  }
  if (media.mediaType === 'carousel') {
    return { aspectRatio: '4 / 3', objectFit: 'cover', maxHeight: '520px', variant: 'carousel' };
  }
  if (media.mediaType === 'livestream' || media.mediaType === 'landscape_video') {
    return { aspectRatio: p.aspectRatio, objectFit: 'contain', maxHeight: '540px', variant: 'landscape_player' };
  }
  if (media.mediaType === 'vertical_video' || media.orientation === 'portrait') {
    return { aspectRatio: p.aspectRatio, objectFit: 'contain', maxHeight: '640px', variant: 'portrait_player' };
  }
  if (media.mediaType === 'square_video' || media.mediaType === 'square_image') {
    return { aspectRatio: '1 / 1', objectFit: 'contain', maxHeight: '480px', variant: 'square_player' };
  }
  return { aspectRatio: p.aspectRatio, objectFit: 'contain', maxHeight: '480px', variant: 'article_hero' };
}
