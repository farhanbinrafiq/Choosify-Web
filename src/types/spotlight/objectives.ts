/**
 * Campaign objectives — used for analytics segmentation (future ES-008).
 */

export type SpotlightCampaignObjective =
  | 'product_launch'
  | 'brand_awareness'
  | 'sales'
  | 'traffic'
  | 'promotion'
  | 'collection_launch'
  | 'seasonal_campaign'
  | 'festival_campaign'
  | 'event'
  | 'creator_campaign'
  | 'announcement'
  | 'lead_generation'
  | 'custom';

export interface SpotlightCampaignObjectiveMeta {
  label: string;
  description: string;
}

export const SPOTLIGHT_CAMPAIGN_OBJECTIVE_META: Record<
  Exclude<SpotlightCampaignObjective, 'custom'>,
  SpotlightCampaignObjectiveMeta
> = {
  product_launch: { label: 'Product Launch', description: 'New product introduction' },
  brand_awareness: { label: 'Brand Awareness', description: 'Increase brand visibility' },
  sales: { label: 'Sales', description: 'Drive purchases and conversions' },
  traffic: { label: 'Traffic', description: 'Increase site visits' },
  promotion: { label: 'Promotion', description: 'Limited-time offers and deals' },
  collection_launch: { label: 'Collection Launch', description: 'Multi-product collection debut' },
  seasonal_campaign: { label: 'Seasonal Campaign', description: 'Season-specific merchandising' },
  festival_campaign: { label: 'Festival Campaign', description: 'Festival and cultural events' },
  event: { label: 'Event', description: 'Live or scheduled events' },
  creator_campaign: { label: 'Creator Campaign', description: 'Influencer-led promotion' },
  announcement: { label: 'Announcement', description: 'Informational updates' },
  lead_generation: { label: 'Lead Generation', description: 'Capture leads and sign-ups' },
};
