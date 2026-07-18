/**
 * Content connections — references to existing Choosify entities (no duplication)
 */

export interface SpotlightContentConnections {
  productIds: string[];
  brandIds: string[];
  serviceIds: string[];
  categoryIds: string[];
  creatorIds: string[];
  guideIds: string[];
  comparisonIds: string[];
  recommendationIds: string[];
  offerIds: string[];
  bundleIds: string[];
  couponIds: string[];
  campaignIds: string[];
  eventIds: string[];
  liveSessionIds: string[];
  /** Other Spotlight content nodes — content graph edges */
  spotlightContentIds: string[];
}

export const EMPTY_SPOTLIGHT_CONNECTIONS: SpotlightContentConnections = {
  productIds: [],
  brandIds: [],
  serviceIds: [],
  categoryIds: [],
  creatorIds: [],
  guideIds: [],
  comparisonIds: [],
  recommendationIds: [],
  offerIds: [],
  bundleIds: [],
  couponIds: [],
  campaignIds: [],
  eventIds: [],
  liveSessionIds: [],
  spotlightContentIds: [],
};
