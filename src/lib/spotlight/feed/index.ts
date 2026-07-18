/**
 * Spotlight Feed — master registry index (LE-005 UX-02)
 */

export * from './cardRegistry';
export * from './mediaRegistry';
export * from './layoutRegistry';
export * from './feedRegistry';
export * from './sectionRegistry';
export * from './contentRendererRegistry';

import { SPOTLIGHT_SHOPPING_FEED } from './feedRegistry';
import { SPOTLIGHT_SECTION_REGISTRY } from './sectionRegistry';
import { SPOTLIGHT_CARD_REGISTRY } from './cardRegistry';
import { SPOTLIGHT_LAYOUT_REGISTRY } from './layoutRegistry';

export const SPOTLIGHT_FEED_MASTER_REGISTRY = {
  feed: SPOTLIGHT_SHOPPING_FEED,
  sections: SPOTLIGHT_SECTION_REGISTRY,
  cards: SPOTLIGHT_CARD_REGISTRY,
  layouts: SPOTLIGHT_LAYOUT_REGISTRY,
  version: 'UX-02',
  philosophy: SPOTLIGHT_SHOPPING_FEED.philosophy,
} as const;
