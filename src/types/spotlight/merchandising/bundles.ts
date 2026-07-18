/**
 * Campaign bundles — campaign-only, never modifies catalog.
 */

export interface SpotlightCampaignBundle {
  bundleId: string;
  name: string;
  description?: string;
  /** Hero product for this bundle */
  heroProductId: string;
  accessoryProductIds: string[];
  recommendedProductIds: string[];
  upsellProductIds: string[];
  displayOrder: number;
  bundlePrice?: number;
  currency?: string;
  createdAt: string;
  updatedAt: string;
}
