import type { SpotlightMerchandisingRuleGroup } from './rules';

export type SpotlightCollectionType =
  | 'manual'
  | 'brand'
  | 'category'
  | 'campaign'
  | 'saved'
  | 'smart';

export interface SpotlightMerchandisingCollection {
  collectionId: string;
  name: string;
  collectionType: SpotlightCollectionType;
  productIds: string[];
  brandId?: string;
  categoryId?: string;
  campaignId?: string;
  /** Smart collection rules — architecture only, no auto-execution */
  smartRules?: SpotlightMerchandisingRuleGroup;
  displayOrder: number;
  createdAt: string;
  updatedAt: string;
}

/** Future smart collection — dynamic product inclusion */
export interface SpotlightSmartCollectionRule {
  collectionId: string;
  name: string;
  includeRules: SpotlightMerchandisingRuleGroup;
  excludeRules?: SpotlightMerchandisingRuleGroup;
  priorityRules?: SpotlightMerchandisingRuleGroup;
  aiRules?: SpotlightMerchandisingRuleGroup;
  enabled: boolean;
}
