/**
 * Campaign merchandising slots — CTO addition, LE-005.4
 * Landing page renderer displays products by slot, not hard-coded positions.
 */

export type SpotlightMerchandisingSlotType =
  | 'hero'
  | 'featured'
  | 'recommended'
  | 'accessories'
  | 'bundles'
  | 'alternatives'
  | 'recently_viewed'
  | 'ai_picks';

export interface SpotlightMerchandisingSlot {
  slotId: string;
  slotType: SpotlightMerchandisingSlotType;
  label: string;
  displayOrder: number;
  maxItems?: number;
  enabled: boolean;
}

export const SPOTLIGHT_DEFAULT_MERCHANDISING_SLOTS: SpotlightMerchandisingSlot[] = [
  { slotId: 'slot-hero', slotType: 'hero', label: 'Hero Product', displayOrder: 0, maxItems: 1, enabled: true },
  { slotId: 'slot-featured', slotType: 'featured', label: 'Featured Products', displayOrder: 1, maxItems: 12, enabled: true },
  { slotId: 'slot-recommended', slotType: 'recommended', label: 'Recommended Products', displayOrder: 2, maxItems: 24, enabled: true },
  { slotId: 'slot-accessories', slotType: 'accessories', label: 'Accessories', displayOrder: 3, maxItems: 12, enabled: true },
  { slotId: 'slot-bundles', slotType: 'bundles', label: 'Bundles', displayOrder: 4, maxItems: 6, enabled: true },
  { slotId: 'slot-alternatives', slotType: 'alternatives', label: 'Alternatives', displayOrder: 5, maxItems: 8, enabled: true },
  { slotId: 'slot-recently-viewed', slotType: 'recently_viewed', label: 'Recently Viewed', displayOrder: 6, maxItems: 8, enabled: false },
  { slotId: 'slot-ai-picks', slotType: 'ai_picks', label: 'AI Picks', displayOrder: 7, maxItems: 12, enabled: false },
];
