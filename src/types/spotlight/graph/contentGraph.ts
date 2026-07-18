/**
 * Extended Content Relationship Graph — Phase 2
 */

import type { SpotlightContentConnections } from '../experience/connections';
import type { SpotlightContentGraph } from '../experience/contentGraph';

export interface SpotlightContentRelationshipGraph extends SpotlightContentConnections, SpotlightContentGraph {
  publisherIds: string[];
  announcementIds: string[];
}

export const EMPTY_RELATIONSHIP_GRAPH: SpotlightContentRelationshipGraph = {
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
  publisherIds: [],
  announcementIds: [],
  relatedProductIds: [],
  relatedBrandIds: [],
  relatedCreatorIds: [],
  relatedCategoryIds: [],
  relatedGuideIds: [],
  relatedCampaignIds: [],
  relatedLiveSessionIds: [],
  relatedContentIds: [],
};

export function mergeRelationshipGraph(
  connections: SpotlightContentConnections,
  graph: SpotlightContentGraph,
  extra?: Partial<Pick<SpotlightContentRelationshipGraph, 'publisherIds' | 'announcementIds'>>,
): SpotlightContentRelationshipGraph {
  return {
    ...connections,
    ...graph,
    publisherIds: extra?.publisherIds ?? [],
    announcementIds: extra?.announcementIds ?? [],
    relatedContentIds: [
      ...new Set([...connections.spotlightContentIds, ...graph.relatedContentIds]),
    ],
  };
}
