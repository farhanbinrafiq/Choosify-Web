/**
 * Spotlight Card Registry — LE-005 UX-02
 * Canonical card mode definitions for the shopping discovery feed.
 * Reuses Phase 5.5.1 adaptive card logic; extended for vertical-specific types.
 */

export {
  ADAPTIVE_CARD_REGISTRY as SPOTLIGHT_CARD_REGISTRY,
  resolveAdaptiveCardMode as resolveSpotlightCardMode,
  resolveAdaptiveCardDefinition as resolveSpotlightCardDefinition,
  type AdaptiveCardMode as SpotlightCardMode,
  type AdaptiveCardDefinition as SpotlightCardDefinition,
} from '../experience/adaptiveCardRegistry';

import type { SpotlightContentType } from '../../../types/spotlight/experience/contentTypes';
import type { UniversalMediaType } from '../../../components/media/types/mediaModel';
import {
  resolveAdaptiveCardMode,
  resolveAdaptiveCardDefinition,
  type AdaptiveCardMode,
} from '../experience/adaptiveCardRegistry';

/** Vertical industry highlight cards — commerce context preserved */
export const VERTICAL_CARD_MODES = [
  'restaurant',
  'hotel',
  'travel',
  'healthcare',
  'education',
  'real_estate',
  'automotive',
  'fashion',
  'electronics',
] as const;

export type VerticalCardMode = (typeof VERTICAL_CARD_MODES)[number];

const VERTICAL_CATEGORY_HINTS: Partial<Record<VerticalCardMode, string[]>> = {
  restaurant: ['restaurant', 'food', 'dining'],
  hotel: ['hotel', 'hospitality', 'stay'],
  travel: ['travel', 'trip', 'tour'],
  healthcare: ['health', 'medical', 'clinic'],
  education: ['education', 'course', 'learning'],
  real_estate: ['real estate', 'property', 'home'],
  automotive: ['auto', 'car', 'vehicle'],
  fashion: ['fashion', 'apparel', 'wear'],
  electronics: ['electronics', 'gadget', 'tech'],
};

export function resolveVerticalCardMode(
  categoryIds: string[],
  headline: string,
): VerticalCardMode | null {
  const hay = `${categoryIds.join(' ')} ${headline}`.toLowerCase();
  for (const mode of VERTICAL_CARD_MODES) {
    const hints = VERTICAL_CATEGORY_HINTS[mode];
    if (hints?.some((h) => hay.includes(h))) return mode;
  }
  return null;
}

export function resolveSpotlightCardForContent(input: {
  contentType: SpotlightContentType;
  mediaType?: UniversalMediaType;
  hasProducts?: boolean;
  hasServices?: boolean;
  categoryIds?: string[];
  headline?: string;
}): { mode: AdaptiveCardMode; vertical?: VerticalCardMode | null } {
  const mode = resolveAdaptiveCardMode(
    input.contentType,
    input.mediaType,
    input.hasProducts,
    input.hasServices,
  );
  const vertical = resolveVerticalCardMode(input.categoryIds ?? [], input.headline ?? '');
  return { mode, vertical };
}

export function spotlightCardDefinition(
  contentType: SpotlightContentType,
  mediaType?: UniversalMediaType,
  hasProducts?: boolean,
  hasServices?: boolean,
) {
  return resolveAdaptiveCardDefinition(contentType, mediaType, hasProducts, hasServices);
}
