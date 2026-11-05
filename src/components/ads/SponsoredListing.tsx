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
import { adAttrs } from '../../lib/ads/adEvents';

export type ListedItem<T> = { item: T; sponsored?: PublicAd };

/** Columns of a CSS grid (re-measured on resize) — so a sponsored card can start a row. */
export function useGridColumns<T extends HTMLElement>(): [React.RefObject<T>, number] {
  const ref = React.useRef<T>(null);
  const [cols, setCols] = React.useState(4);
  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const read = () => {
      const t = getComputedStyle(el).gridTemplateColumns;
      const n = t && t !== 'none' ? t.split(' ').filter(Boolean).length : 1;
      setCols((prev) => (prev === n ? prev : Math.max(1, n)));
    };
    read();
    if (typeof ResizeObserver === 'undefined') return;
    const ro = new ResizeObserver(read);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  return [ref, cols];
}

export function useSponsoredListings<T extends { id: string | number }>(
  slot: AdSlotId,
  items: T[],
  type: 'product' | 'brand',
  /** Where promoted items may come from (default: items). Paged lists pass the whole filtered list. */
  pool?: T[],
  /** Cards per row of the grid it is drawn in (useGridColumns). */
  columns = 4,
): ListedItem<T>[] {
  const ads = useAdSlot(slot);
  return React.useMemo(() => {
    const plain = items.map((item) => ({ item }));
    const promos = ads
      .filter((a) => a.entity?.type === type)
      .map((ad) => ({ ad, item: (pool ?? items).find((i) => String(i.id) === String(ad.entity!.id)) }))
      .filter((p): p is { ad: PublicAd; item: T } => Boolean(p.item));
    // one place per item even if two ads promote it; at most 2 per list
    const seen = new Set<string>();
    const unique = promos.filter((p) => (seen.has(String(p.item.id)) ? false : (seen.add(String(p.item.id)), true))).slice(0, 2);
    if (!unique.length) return plain;
    const promotedIds = new Set(unique.map((p) => String(p.item.id)));
    const organic = plain.filter((e) => !promotedIds.has(String(e.item.id)));
    // Nothing else in the list: keep the item as a plain card (a sponsor never empties a list).
    if (!organic.length) return plain;
    const cols = Math.max(1, columns);
    const lastRowStart = Math.floor(Math.max(0, organic.length - 1) / cols) * cols;
    // The sponsored card is the FIRST card of its chosen row (row 1 = very first card).
    const placed = unique
      .map((p, k) => {
        const row = Math.max(1, Number(p.ad.listRow) || 2);
        // a second sponsor of the same row goes one row lower
        const want = (row - 1 + k) * cols;
        return { ...p, at: Math.min(want, lastRowStart) };
      })
      .sort((a, b) => a.at - b.at);
    const out: ListedItem<T>[] = [];
    let o = 0;
    let q = 0;
    while (o < organic.length || q < placed.length) {
      if (q < placed.length && out.length >= placed[q].at) {
        out.push({ item: placed[q].item, sponsored: placed[q].ad });
        q++;
        continue;
      }
      if (o < organic.length) out.push(organic[o++]);
      else {
        out.push({ item: placed[q].item, sponsored: placed[q].ad });
        q++;
      }
    }
    return out;
  }, [ads, items, type, pool, columns]);
}

/** Wraps a normal card with the "Sponsored" label (top-left, above the card's own badges). */
export function SponsoredFrame({ ad, children }: { ad: PublicAd; children: React.ReactNode }) {
  return (
    <div className="relative h-full" data-testid={`sponsored-listing-${ad.slot}`} {...adAttrs(ad)}>
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
