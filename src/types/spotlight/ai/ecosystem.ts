/**
 * AI preparation — ES-012 extension (no implementation)
 */

export type SpotlightAiMatchingKind =
  | 'creator_recommendation'
  | 'campaign_matching'
  | 'brand_matching'
  | 'publisher_matching'
  | 'related_content'
  | 'suggested_products'
  | 'campaign_quality';

export interface SpotlightAiMatchSuggestion {
  kind: SpotlightAiMatchingKind;
  sourceId: string;
  targetId: string;
  score: number;
  reason?: string;
}

export interface SpotlightAiEcosystemContract {
  suggestCreatorsForCampaign(campaignId: string): Promise<SpotlightAiMatchSuggestion[]>;
  suggestBrandsForCreator(creatorPublisherId: string): Promise<SpotlightAiMatchSuggestion[]>;
  scoreCampaignQuality(campaignId: string): Promise<number>;
  suggestRelatedContent(contentId: string): Promise<SpotlightAiMatchSuggestion[]>;
}
