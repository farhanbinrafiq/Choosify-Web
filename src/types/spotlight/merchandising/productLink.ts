import type { SpotlightProductMerchandisingRole } from './roles';

/** Campaign-scoped product reference — catalog data resolved at render time */
export interface SpotlightCampaignProductLink {
  productId: string;
  role: SpotlightProductMerchandisingRole;
  displayOrder: number;
  pinned?: boolean;
  priority?: number;
  slotId?: string;
  bundleId?: string;
  collectionId?: string;
  addedAt?: string;
}

export type SpotlightProductAttachMode =
  | 'single_product'
  | 'multi_product'
  | 'brand'
  | 'category'
  | 'saved_collection'
  | 'dynamic_collection';
