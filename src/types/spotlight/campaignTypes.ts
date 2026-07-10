/**
 * Supported campaign types for Spotlight.
 * Future types are included in the union for forward compatibility.
 */
export type SpotlightCampaignType =
  | 'single_product'
  | 'multi_product'
  | 'brand_campaign'
  | 'category_campaign'
  | 'seasonal_campaign'
  | 'festival_campaign'
  | 'promotion'
  | 'discount'
  | 'new_launch'
  | 'announcement'
  | 'buying_guide'
  | 'brand_story'
  | 'editors_pick'
  | 'creator_review'
  | 'creator_campaign'
  | 'livestream';

/** Maps campaign type to expected primary entity emphasis */
export type SpotlightCampaignEntityFocus =
  | 'product'
  | 'products'
  | 'brand'
  | 'category'
  | 'guide'
  | 'mixed';

export const SPOTLIGHT_CAMPAIGN_TYPE_META: Record<
  SpotlightCampaignType,
  { label: string; entityFocus: SpotlightCampaignEntityFocus }
> = {
  single_product: { label: 'Single Product', entityFocus: 'product' },
  multi_product: { label: 'Multi Product', entityFocus: 'products' },
  brand_campaign: { label: 'Brand Campaign', entityFocus: 'brand' },
  category_campaign: { label: 'Category Campaign', entityFocus: 'category' },
  seasonal_campaign: { label: 'Seasonal Campaign', entityFocus: 'mixed' },
  festival_campaign: { label: 'Festival Campaign', entityFocus: 'mixed' },
  promotion: { label: 'Promotion', entityFocus: 'products' },
  discount: { label: 'Discount', entityFocus: 'products' },
  new_launch: { label: 'New Launch', entityFocus: 'product' },
  announcement: { label: 'Announcement', entityFocus: 'mixed' },
  buying_guide: { label: 'Buying Guide', entityFocus: 'guide' },
  brand_story: { label: 'Brand Story', entityFocus: 'brand' },
  editors_pick: { label: "Editor's Pick", entityFocus: 'products' },
  creator_review: { label: 'Creator Review', entityFocus: 'mixed' },
  creator_campaign: { label: 'Creator Campaign', entityFocus: 'mixed' },
  livestream: { label: 'Livestream', entityFocus: 'mixed' },
};
