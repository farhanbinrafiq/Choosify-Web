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
  /** Coarse preset/default hint — used only when real `width`/`height` are unavailable. */
  aspectRatio?: ChoosifyMediaAspect;
  /**
   * Real, authoritative pixel dimensions when known (e.g. stored catalog
   * image dimensions, or measured client-side after an image/video loads).
   * Always takes priority over `aspectRatio` in `resolveItemAspectCss` —
   * this is the one canonical source real geometry flows through; the two
   * fields don't compete, they're different confidence tiers of the same
   * question.
   */
  width?: number;
  height?: number;
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

/**
 * The single place a CSS `aspect-ratio` value is decided for a media item.
 * Priority: real measured/stored pixel dimensions (`measured` param, e.g.
 * from an `<img>`'s `naturalWidth`/`naturalHeight` once loaded, or a
 * `<video>`'s `videoWidth`/`videoHeight` once its metadata loads) > the
 * item's own stored `width`/`height` (e.g. catalog-provided dimensions) >
 * the coarse `aspectRatio`/`kind` preset from `resolveItemAspect`. Provider
 * identity is never consulted here directly — by the time an item reaches
 * this function, any provider-based judgment has already been reduced to
 * either real dimensions or a preset fallback upstream.
 */
export function resolveItemAspectCss(
  item: ChoosifyMediaItem,
  measured?: { width: number; height: number } | null,
): string {
  if (measured && measured.width > 0 && measured.height > 0) {
    return `${measured.width} / ${measured.height}`;
  }
  if (item.width && item.height && item.width > 0 && item.height > 0) {
    return `${item.width} / ${item.height}`;
  }
  return ASPECT_CSS[resolveItemAspect(item)];
}

const ASPECT_RATIO_NUMERIC: Record<ChoosifyMediaAspect, number> = {
  '16/9': 16 / 9,
  '9/16': 9 / 16,
  '1/1': 1,
  '4/5': 4 / 5,
  '4/3': 4 / 3,
  '21/9': 21 / 9,
  auto: 16 / 9,
};

/**
 * Same priority order as `resolveItemAspectCss` (measured > stored > preset)
 * but as a plain `width / height` number, for callers that need to do their
 * own explicit pixel-fit arithmetic (see `containFit` in
 * `DetailSliverMediaGallery.tsx`) rather than hand the ratio to CSS
 * `aspect-ratio` and hope the browser's auto-sizing algorithm resolves a
 * box with no in-flow content the way a replaced element would.
 */
export function resolveItemAspectRatio(
  item: ChoosifyMediaItem,
  measured?: { width: number; height: number } | null,
): number {
  if (measured && measured.width > 0 && measured.height > 0) {
    return measured.width / measured.height;
  }
  if (item.width && item.height && item.width > 0 && item.height > 0) {
    return item.width / item.height;
  }
  return ASPECT_RATIO_NUMERIC[resolveItemAspect(item)];
}
