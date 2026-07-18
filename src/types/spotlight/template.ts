import type { SpotlightCampaignType } from './campaignTypes';
import type { SpotlightPlacementSurface } from './placement';
import type { SpotlightMediaType } from './media';

/**
 * Reusable campaign templates — architecture only (no CMS implementation).
 * Stored in `spotlight_templates`.
 */
export type SpotlightTemplateType =
  | 'new_launch'
  | 'flash_sale'
  | 'mega_sale'
  | 'weekend_offer'
  | 'festival_campaign'
  | 'ramadan'
  | 'eid'
  | 'winter_collection'
  | 'summer_collection'
  | 'brand_anniversary'
  | 'limited_offer'
  | 'clearance_sale';

export interface SpotlightCampaignTemplate {
  templateId: string;
  templateType: SpotlightTemplateType;
  name: string;
  description: string;
  /** Default campaign type when instantiated */
  defaultCampaignType: SpotlightCampaignType;
  /** Suggested placement surfaces */
  defaultSurfaces: SpotlightPlacementSurface[];
  /** Default headline / CTA copy patterns */
  defaultHeadline?: string;
  defaultSubHeadline?: string;
  defaultCtaLabel?: string;
  /** Media layout hints */
  preferredMediaTypes: SpotlightMediaType[];
  isActive: boolean;
  displayOrder: number;
  createdAt: string;
  updatedAt: string;
}

export const SPOTLIGHT_TEMPLATE_LABELS: Record<SpotlightTemplateType, string> = {
  new_launch: 'New Launch',
  flash_sale: 'Flash Sale',
  mega_sale: 'Mega Sale',
  weekend_offer: 'Weekend Offer',
  festival_campaign: 'Festival Campaign',
  ramadan: 'Ramadan',
  eid: 'Eid',
  winter_collection: 'Winter Collection',
  summer_collection: 'Summer Collection',
  brand_anniversary: 'Brand Anniversary',
  limited_offer: 'Limited Offer',
  clearance_sale: 'Clearance Sale',
};
