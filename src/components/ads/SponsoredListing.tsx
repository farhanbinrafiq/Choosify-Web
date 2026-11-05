/**
 * Sponsored Listings (Ads Studio format "sponsored_listing"): a real product / brand promoted
 * inside a list, drawn as its NORMAL card with a "Sponsored" label.
 *
 * Rules: only items that are already in the current (filtered) list are promoted — a sponsor never
 * shows a product that doesn't match what the shopper is looking at; the promoted item moves to the
 * sponsored position (never first) and its organic copy is removed, so nothing shows twice.
 */
import React from 'react';
import { useAdSlot, type AdSlotId, type PublicAd } from '../../lib/ads/adSlots';

export type ListedItem<T> = { item: T; sponsored?: PublicAd };

export function useSponsoredListings<T extends { id: string | number }>(
  slot: AdSlotId,
  items: T[],
  type: 'product' | 'brand',
  /** Where promoted items may come from (default: items). Paged lists pass the whole filtered list. */
  pool?: T[],
): ListedItem<T>[] {
  const ads = useAdSlot(slot);
  return React.useMemo(() => {
    const plain = items.map((item) => ({ item }));
    const promos = ads
      .filter((a) => a.entity?.type === type)
      .map((ad) => ({ ad, item: (pool ?? items).find((i) => String(i.id) === String(ad.entity!.id)) }))
      .filter((p): p is { ad: PublicAd; item: T } => Boolean(p.item));
    // one slot per item even if two ads promote it
    const seen = new Set<string>();
    const unique = promos.filter((p) => (seen.has(String(p.item.id)) ? false : (seen.add(String(p.item.id)), true)));
    if (!unique.length) return plain;
    const promotedIds = new Set(unique.map((p) => String(p.item.id)));
    const organic = plain.filter((e) => !promotedIds.has(String(e.item.id)));
    // Nothing else in the list: keep the item as a plain card (a sponsor never empties a list).
    if (!organic.length) return plain;
    const steps = unique.map((p) => (Number(p.ad.gridEvery) > 0 ? Number(p.ad.gridEvery) : 5));
    const every = Math.max(2, Math.min(...steps));
    const out: ListedItem<T>[] = [];
    let k = 0;
    organic.forEach((e, i) => {
      out.push(e);
      if ((i + 1) % every === 0 && k < unique.length && k < 2) {
        out.push({ item: unique[k].item, sponsored: unique[k].ad });
        k++;
      }
    });
    // short lists: still show (after the organic items), never as the only first card
    while (k < unique.length && organic.length > 0 && k < 2) {
      out.push({ item: unique[k].item, sponsored: unique[k].ad });
      k++;
    }
    return out;
  }, [ads, items, type, pool]);
}

/** Wraps a normal card with the "Sponsored" label (top-left, above the card's own badges). */
export function SponsoredFrame({ ad, children }: { ad: PublicAd; children: React.ReactNode }) {
  return (
    <div className="relative h-full" data-testid={`sponsored-listing-${ad.slot}`} data-ad-id={ad.id}>
      {children}
      <span
        className="pointer-events-none absolute left-1/2 top-2 z-20 -translate-x-1/2 rounded-full bg-black/70 px-2 py-0.5 text-[9.5px] font-extrabold uppercase tracking-wide text-white backdrop-blur-sm"
        data-testid="sponsored-chip"
      >
        Sponsored
      </span>
    </div>
  );
}
