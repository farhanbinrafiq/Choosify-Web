/**
 * Brands page default ("Featured / Recommended") order:
 *   1. promoted — Super Admin pins (Storefront Curation, in the curated order),
 *      then brands flagged Sponsored / Featured;
 *   2. verified brands (verified owner);
 *   3. everyone else.
 * Alphabetical (A–Z) inside each group except the pins, which keep their order.
 * Shoppers can still pick another sort; this is only the default.
 */
export type RecommendedOrderBrand = {
  id: string | number;
  catalogId?: string;
  name: string;
  sponsoredFlag?: boolean;
  featuredFlag?: boolean;
  verifiedStatus?: boolean;
  ownership?: { state?: string } | null;
};

/** Same rule as the card's "Verified Brand" badge (BrandCardDesign), so the order matches what shoppers see. */
export function isVerifiedBrand(b: RecommendedOrderBrand): boolean {
  const state = b.ownership?.state;
  return state ? state === 'owned_verified' : b.verifiedStatus !== false;
}

/** Alphabetical key: case/accent-insensitive, ignoring leading symbols ("-Suchi Shoili" sorts under S). */
const brandNameKey = (name: string) => name.replace(/^[^\p{L}\p{N}]+/u, '').trim() || name;

export function recommendedBrandOrder<T extends RecommendedOrderBrand>(list: T[], pinnedIds: string[]): T[] {
  const rank = new Map(pinnedIds.map((id, i) => [id, i]));
  const pinOf = (b: T) => rank.get(String(b.catalogId ?? b.id)) ?? rank.get(String(b.id));
  const tier = (b: T) => (pinOf(b) !== undefined ? 0 : b.sponsoredFlag || b.featuredFlag ? 1 : isVerifiedBrand(b) ? 2 : 3);
  return [...list].sort((a, b) => {
    const ta = tier(a);
    const tb = tier(b);
    if (ta !== tb) return ta - tb;
    if (ta === 0) return (pinOf(a) as number) - (pinOf(b) as number);
    return brandNameKey(a.name).localeCompare(brandNameKey(b.name), undefined, { sensitivity: 'base', numeric: true });
  });
}
