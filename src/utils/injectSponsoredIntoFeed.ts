import type { SponsoredPlacementItem } from '../types/commerce/sponsoredPlacement';

export type SponsoredInjectedEntry<T> =
  | { kind: 'item'; key: string; item: T }
  | { kind: 'sponsored'; key: string; sponsored: SponsoredPlacementItem };

/** Inject sponsored items into an organic feed at fixed intervals */
export function injectSponsoredIntoFeed<T>(
  items: T[],
  getItemKey: (item: T, index: number) => string,
  sponsored: SponsoredPlacementItem[],
  interval: number,
  maxPlacements: number = 2,
): SponsoredInjectedEntry<T>[] {
  if (!items.length || !sponsored.length || interval < 4) {
    return items.map((item, index) => ({
      kind: 'item' as const,
      key: getItemKey(item, index),
      item,
    }));
  }

  const result: SponsoredInjectedEntry<T>[] = [];
  let placementIndex = 0;
  let inserted = 0;

  items.forEach((item, index) => {
    result.push({
      kind: 'item',
      key: getItemKey(item, index),
      item,
    });

    const position = index + 1;
    const shouldInsert =
      inserted < maxPlacements &&
      placementIndex < sponsored.length &&
      position % interval === 0 &&
      position < items.length;

    if (shouldInsert) {
      const sponsoredItem = sponsored[placementIndex++];
      result.push({
        kind: 'sponsored',
        key: `sponsored-${sponsoredItem.id}`,
        sponsored: sponsoredItem,
      });
      inserted += 1;
    }
  });

  return result;
}
