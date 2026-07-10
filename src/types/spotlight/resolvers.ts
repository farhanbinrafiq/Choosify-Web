import type { CatalogProduct } from '../catalog';
import type { SpotlightCampaign } from './campaign';
import type { SpotlightMedia } from './media';

/**
 * Campaign with catalog products resolved at runtime.
 * Products are always fetched from catalog — never stored on campaign docs.
 */
export interface SpotlightCampaignWithCatalog {
  campaign: SpotlightCampaign;
  primaryProduct?: CatalogProduct;
  linkedProducts: CatalogProduct[];
  resolvedMedia: SpotlightMedia[];
}

/**
 * Validates primary product is within linked set.
 * Pure helper — safe to call client- or server-side.
 */
export function resolvePrimaryProductId(campaign: SpotlightCampaign): string | undefined {
  if (!campaign.linkedProductIds.length) return undefined;
  if (campaign.primaryProductId) {
    return campaign.linkedProductIds.includes(campaign.primaryProductId)
      ? campaign.primaryProductId
      : campaign.linkedProductIds[0];
  }
  return campaign.linkedProductIds[0];
}

/**
 * Resolves catalog products for a campaign in display order.
 * Primary product is listed first when present.
 */
export function orderCampaignProducts(
  campaign: SpotlightCampaign,
  catalogProducts: CatalogProduct[],
): { primary?: CatalogProduct; others: CatalogProduct[] } {
  const byId = new Map(catalogProducts.map((p) => [p.id, p]));
  const primaryId = resolvePrimaryProductId(campaign);
  const primary = primaryId ? byId.get(primaryId) : undefined;
  const others = campaign.linkedProductIds
    .filter((id) => id !== primaryId)
    .map((id) => byId.get(id))
    .filter((p): p is CatalogProduct => Boolean(p));
  return { primary, others };
}
