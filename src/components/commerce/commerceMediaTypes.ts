/**
 * Commerce Media Gallery — detail-page media model (Product, Spotlight, future verticals).
 * Shared item shape with adapters in media/choosifyMediaAdapters.ts.
 */

import type { ChoosifyMediaItem } from '../media/choosifyMediaTypes';

export type CommerceMediaItem = ChoosifyMediaItem;

export interface ChoosifyCommerceMediaGalleryProps {
  items: CommerceMediaItem[];
  ariaLabel?: string;
  initialIndex?: number;
  activeIndex?: number;
  onActiveIndexChange?: (index: number) => void;
  /** Max theater height on desktop (matches Product Details hero) */
  maxTheaterHeight?: number;
  className?: string;
}
