/**
 * Product merchandising roles — LE-005.4
 * Only ONE hero product allowed per campaign.
 */

export type SpotlightProductMerchandisingRole =
  | 'hero'
  | 'featured'
  | 'accessory'
  | 'bundle'
  | 'recommended'
  | 'alternative'
  | 'upsell'
  | 'cross_sell'
  | 'limited_offer'
  | 'ai_recommended';

export interface SpotlightProductRoleMeta {
  label: string;
  description: string;
  slotType: string;
}

export const SPOTLIGHT_PRODUCT_ROLE_META: Record<
  SpotlightProductMerchandisingRole,
  SpotlightProductRoleMeta
> = {
  hero: { label: 'Hero Product', description: 'Primary campaign product — only one allowed', slotType: 'hero' },
  featured: { label: 'Featured', description: 'Highlighted in featured section', slotType: 'featured' },
  accessory: { label: 'Accessory', description: 'Complementary add-on', slotType: 'accessories' },
  bundle: { label: 'Bundle Product', description: 'Part of a campaign bundle', slotType: 'bundles' },
  recommended: { label: 'Recommended', description: 'Suggested for shoppers', slotType: 'recommended' },
  alternative: { label: 'Alternative', description: 'Substitute when hero unavailable', slotType: 'alternatives' },
  upsell: { label: 'Upsell', description: 'Higher-value upgrade', slotType: 'featured' },
  cross_sell: { label: 'Cross-sell', description: 'Related purchase', slotType: 'recommended' },
  limited_offer: { label: 'Limited Offer', description: 'Time-limited promotion', slotType: 'featured' },
  ai_recommended: { label: 'AI Recommended', description: 'Future AI suggestion', slotType: 'ai_picks' },
};
