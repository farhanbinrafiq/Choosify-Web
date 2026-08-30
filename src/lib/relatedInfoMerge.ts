import type { RelatedStoreEntry } from '../types/catalog';

export type MergedRelatedStore = RelatedStoreEntry & {
  /** true ⇒ Choosify/admin-promoted; render a "Promoted / Sponsored" badge. */
  sponsored: boolean;
  promoLabel?: string;
};

const byPriority = (a: RelatedStoreEntry, b: RelatedStoreEntry): number => {
  const pa = typeof a.priority === 'number' ? a.priority : Number.POSITIVE_INFINITY;
  const pb = typeof b.priority === 'number' ? b.priority : Number.POSITIVE_INFINITY;
  return pa - pb;
};

/**
 * Deterministic storefront merge of the two independently-owned lists — must
 * match the admin repo's lib/vercel-catalog/relatedInfoMerge.ts.
 *
 * Order: prioritized admin rows → seller featured → remaining seller →
 * remaining admin. A seller reorder only reorders the seller array.
 */
export function mergeRelatedStores(
  sellerRows: RelatedStoreEntry[] | undefined | null,
  adminRows: RelatedStoreEntry[] | undefined | null,
): MergedRelatedStore[] {
  const seller: MergedRelatedStore[] = (sellerRows ?? [])
    .filter((r): r is RelatedStoreEntry => !!r && typeof r.storeName === 'string' && r.storeName.trim() !== '')
    .map((r) => ({ ...r, source: 'seller', sponsored: false }));

  const admin: MergedRelatedStore[] = (adminRows ?? [])
    .filter((r): r is RelatedStoreEntry => !!r && typeof r.storeName === 'string' && r.storeName.trim() !== '')
    .map((r) => ({
      ...r,
      source: 'admin',
      sponsored: true,
      promoLabel: (r.promoLabel && r.promoLabel.trim()) || 'Promoted by Choosify',
    }));

  const adminPrioritized = admin.filter((r) => typeof r.priority === 'number').sort(byPriority);
  const adminRest = admin.filter((r) => typeof r.priority !== 'number');
  const sellerFeatured = seller.filter((r) => r.isFeatured);
  const sellerRest = seller.filter((r) => !r.isFeatured);

  return [...adminPrioritized, ...sellerFeatured, ...sellerRest, ...adminRest];
}
