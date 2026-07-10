/**
 * Campaign hierarchy — parent/child relationships and collections.
 * No recursive UI in LE-005.3.1.
 */

export interface SpotlightCampaignRelationships {
  /** Parent campaign ID (e.g. "Samsung Launch") */
  parentCampaignId?: string;
  /** Direct child campaign IDs (e.g. Galaxy Phone, Watch, Buds) */
  childCampaignIds?: string[];
  /** Named collection this campaign belongs to */
  collectionId?: string;
  collectionName?: string;
  /** Related campaigns for cross-promotion (siblings, sequels) */
  relatedCampaignIds?: string[];
  /** Display order within parent or collection */
  sortOrder?: number;
}

/** Campaign collection document — `spotlight_campaign_collections` */
export interface SpotlightCampaignCollection {
  collectionId: string;
  name: string;
  description?: string;
  campaignIds: string[];
  parentCollectionId?: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}
