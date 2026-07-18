/**
 * Universal Choosify media model — images, videos, reels, GIFs, live, future 360°
 */

import type { ReactNode } from 'react';

export type ChoosifyMediaKind =
  | 'image'
  | 'video'
  | 'portrait_video'
  | 'landscape_video'
  | 'square_video'
  | 'gif'
  | 'live'
  | 'carousel'
  | 'panorama360';

export type ChoosifyMediaAspect = '16/9' | '9/16' | '1/1' | '4/5' | '4/3' | '21/9' | 'auto';

export interface ChoosifyMediaItem {
  id: string;
  kind: ChoosifyMediaKind;
  url: string;
  posterUrl?: string;
  alt?: string;
  aspectRatio?: ChoosifyMediaAspect;
  /** Live / embed playback */
  embedUrl?: string;
  /** Nested slides when kind === 'carousel' */
  carouselItems?: ChoosifyMediaItem[];
  label?: string;
}

export type ChoosifyMediaGalleryLayout = 'theater' | 'compact';

export interface ChoosifyMediaGalleryProps {
  items: ChoosifyMediaItem[];
  /** Accessible label for the gallery region */
  ariaLabel?: string;
  /** Initial slide index */
  initialIndex?: number;
  /** Controlled index */
  activeIndex?: number;
  onActiveIndexChange?: (index: number) => void;
  layout?: ChoosifyMediaGalleryLayout;
  /** Max theater height on desktop */
  maxTheaterHeight?: number;
  className?: string;
  /** Optional overlay rendered over active slide (homepage hero marketing) */
  renderOverlay?: (item: ChoosifyMediaItem, index: number) => ReactNode;
}

export const ASPECT_CSS: Record<ChoosifyMediaAspect, string> = {
  '16/9': '16 / 9',
  '9/16': '9 / 16',
  '1/1': '1 / 1',
  '4/5': '4 / 5',
  '4/3': '4 / 3',
  '21/9': '21 / 9',
  auto: 'auto',
};

export function resolveItemAspect(item: ChoosifyMediaItem): ChoosifyMediaAspect {
  if (item.aspectRatio && item.aspectRatio !== 'auto') return item.aspectRatio;
  switch (item.kind) {
    case 'portrait_video':
      return '9/16';
    case 'square_video':
      return '1/1';
    case 'landscape_video':
    case 'video':
    case 'live':
      return '16/9';
    case 'gif':
    case 'image':
    default:
      return '4/3';
  }
}

export function isVideoKind(kind: ChoosifyMediaKind): boolean {
  return ['video', 'portrait_video', 'landscape_video', 'square_video', 'live', 'gif'].includes(kind);
}
