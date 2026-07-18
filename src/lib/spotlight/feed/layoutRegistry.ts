/**
 * Spotlight Layout Registry — LE-005 UX-02
 * Structured commerce grid (NOT masonry). Mobile vertical feed.
 */

import type { AdaptiveCardMode } from '../experience/adaptiveCardRegistry';
import { spotlightMediaOrientation } from './mediaRegistry';
import type { UniversalMedia } from '../../../components/media/types/mediaModel';

export type SpotlightFeedLayoutMode =
  | 'mobile_vertical'
  | 'desktop_commerce_grid'
  | 'carousel'
  | 'hero'
  | 'list'
  | 'collection_row';

export interface GridCellPlacement {
  /** Tailwind col-span class suffix (1–2 on desktop) */
  colSpan: 1 | 2;
  /** Optional row span for portrait cards in structured grid */
  rowSpan: 1 | 2;
  /** Layout hint for debugging / future AI */
  placement: 'portrait_slot' | 'landscape_slot' | 'square_slot' | 'feature_slot' | 'default_slot';
}

export interface FeedLayoutDefinition {
  mode: SpotlightFeedLayoutMode;
  label: string;
  description: string;
  /** Use CSS grid — never masonry columns */
  usesStructuredGrid: boolean;
}

export const SPOTLIGHT_LAYOUT_REGISTRY: Record<SpotlightFeedLayoutMode, FeedLayoutDefinition> = {
  mobile_vertical: {
    mode: 'mobile_vertical',
    label: 'Mobile Feed',
    description: 'Vertical scroll; each card keeps native aspect ratio',
    usesStructuredGrid: false,
  },
  desktop_commerce_grid: {
    mode: 'desktop_commerce_grid',
    label: 'Commerce Grid',
    description: 'Responsive structured grid mixing portrait, landscape, and feature cards',
    usesStructuredGrid: true,
  },
  carousel: {
    mode: 'carousel',
    label: 'Carousel',
    description: 'Horizontal scroll row with mixed card widths',
    usesStructuredGrid: false,
  },
  hero: {
    mode: 'hero',
    label: 'Featured Hero',
    description: 'Single featured commerce card',
    usesStructuredGrid: false,
  },
  list: {
    mode: 'list',
    label: 'List',
    description: 'Compact list rows for announcements',
    usesStructuredGrid: false,
  },
  collection_row: {
    mode: 'collection_row',
    label: 'Collections',
    description: 'Collection chips row',
    usesStructuredGrid: false,
  },
};

const CARD_MODE_PLACEMENT: Partial<Record<AdaptiveCardMode, GridCellPlacement>> = {
  portrait_reel: { colSpan: 1, rowSpan: 2, placement: 'portrait_slot' },
  story_card: { colSpan: 1, rowSpan: 2, placement: 'portrait_slot' },
  landscape_video: { colSpan: 2, rowSpan: 1, placement: 'landscape_slot' },
  live_card: { colSpan: 2, rowSpan: 1, placement: 'landscape_slot' },
  campaign_banner: { colSpan: 2, rowSpan: 1, placement: 'feature_slot' },
  product_launch: { colSpan: 2, rowSpan: 1, placement: 'feature_slot' },
  square_post: { colSpan: 1, rowSpan: 1, placement: 'square_slot' },
  image_card: { colSpan: 1, rowSpan: 1, placement: 'default_slot' },
  carousel_card: { colSpan: 2, rowSpan: 1, placement: 'landscape_slot' },
};

const DEFAULT_PLACEMENT: GridCellPlacement = {
  colSpan: 1,
  rowSpan: 1,
  placement: 'default_slot',
};

export function resolveGridCellPlacement(
  cardMode: AdaptiveCardMode,
  media?: UniversalMedia | null,
): GridCellPlacement {
  const byMode = CARD_MODE_PLACEMENT[cardMode];
  if (byMode) return byMode;

  const orientation = spotlightMediaOrientation(media);
  if (orientation === 'portrait') {
    return { colSpan: 1, rowSpan: 2, placement: 'portrait_slot' };
  }
  if (orientation === 'landscape') {
    return { colSpan: 2, rowSpan: 1, placement: 'landscape_slot' };
  }
  if (orientation === 'square') {
    return { colSpan: 1, rowSpan: 1, placement: 'square_slot' };
  }
  return DEFAULT_PLACEMENT;
}

/** Tailwind classes for structured grid cell */
export function gridCellClassName(placement: GridCellPlacement): string {
  const col = placement.colSpan === 2 ? 'md:col-span-2' : 'md:col-span-1';
  const row = placement.rowSpan === 2 ? 'md:row-span-2' : 'md:row-span-1';
  return `${col} ${row}`;
}

/** Desktop commerce grid container classes — 4-column structured, NOT masonry */
export const DESKTOP_COMMERCE_GRID_CLASS =
  'hidden md:grid md:grid-cols-4 md:auto-rows-min md:gap-4 md:items-start';

/** Mobile vertical feed container */
export const MOBILE_VERTICAL_FEED_CLASS = 'flex flex-col gap-4 md:hidden';
