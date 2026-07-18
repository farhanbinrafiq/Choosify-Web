/**
 * Spotlight Experience Registry — master index for Phase 5.5.1 UX layer
 */

export * from './adaptiveCardRegistry';
export * from './contentDensityRegistry';
export * from './mediaPresentationRegistry';
export * from './commerceCtaRegistry';
export * from './sectionRegistry';
export * from './feedRegistry';

import { SPOTLIGHT_FEED_REGISTRY } from './feedRegistry';
import { FEED_SECTION_REGISTRY } from './sectionRegistry';
import { ADAPTIVE_CARD_REGISTRY } from './adaptiveCardRegistry';
import { CONTENT_DENSITY_REGISTRY } from './contentDensityRegistry';
import { COMMERCE_ACTION_REGISTRY } from './commerceCtaRegistry';

export const SPOTLIGHT_EXPERIENCE_REGISTRY = {
  feed: SPOTLIGHT_FEED_REGISTRY,
  sections: FEED_SECTION_REGISTRY,
  adaptiveCards: ADAPTIVE_CARD_REGISTRY,
  densities: CONTENT_DENSITY_REGISTRY,
  commerceActions: COMMERCE_ACTION_REGISTRY,
  version: 'UX-02',
  philosophy: 'Commerce-first shopping discovery powered by rich content.',
} as const;
