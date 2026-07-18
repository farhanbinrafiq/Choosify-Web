import type { SpotlightCampaignProductLink, SpotlightProductAttachMode } from './productLink';
import type { SpotlightMerchandisingSlot } from './slots';
import type { SpotlightMerchandisingCollection, SpotlightSmartCollectionRule } from './collections';
import type { SpotlightCampaignBundle } from './bundles';
import type { SpotlightConditionalMerchandisingRule } from './conditional';
import type { SpotlightCampaignQualityScore } from './quality';

/**
 * Root merchandising document on a campaign.
 * Product data always resolved from catalog — never duplicated.
 */
export interface SpotlightCampaignMerchandising {
  productLinks: SpotlightCampaignProductLink[];
  slots: SpotlightMerchandisingSlot[];
  collections: SpotlightMerchandisingCollection[];
  bundles: SpotlightCampaignBundle[];
  smartCollections?: SpotlightSmartCollectionRule[];
  conditionalRules?: SpotlightConditionalMerchandisingRule[];
  attachMode?: SpotlightProductAttachMode;
  /** Campaign completeness score 0–100 (CTO) */
  qualityScore?: SpotlightCampaignQualityScore;
}

export function createDefaultMerchandising(): SpotlightCampaignMerchandising {
  return {
    productLinks: [],
    slots: [],
    collections: [],
    bundles: [],
    smartCollections: [],
    conditionalRules: [],
    attachMode: 'multi_product',
  };
}
