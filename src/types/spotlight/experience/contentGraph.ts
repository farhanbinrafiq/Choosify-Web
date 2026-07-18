/**
 * Content Graph (CTO) — navigable references between Spotlight experiences
 */

export interface SpotlightContentGraph {
  relatedContentIds: string[];
  relatedProductIds: string[];
  relatedBrandIds: string[];
  relatedCreatorIds: string[];
  relatedCategoryIds: string[];
  relatedGuideIds: string[];
  relatedCampaignIds: string[];
  relatedLiveSessionIds: string[];
}

export const EMPTY_SPOTLIGHT_GRAPH: SpotlightContentGraph = {
  relatedContentIds: [],
  relatedProductIds: [],
  relatedBrandIds: [],
  relatedCreatorIds: [],
  relatedCategoryIds: [],
  relatedGuideIds: [],
  relatedCampaignIds: [],
  relatedLiveSessionIds: [],
};
