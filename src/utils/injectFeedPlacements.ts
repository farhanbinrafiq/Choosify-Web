import type { ResolvedPlacement } from './resolvePlacementContent';

export type FeedEntry<T> =
  | { kind: 'item'; key: string; item: T }
  | { kind: 'placement'; key: string; placement: ResolvedPlacement };

export function injectPlacementsIntoFeed<T>(
  items: T[],
  getItemKey: (item: T, index: number) => string,
  placements: ResolvedPlacement[],
  interval: number,
  maxPlacements: number = 2,
): FeedEntry<T>[] {
  if (!items.length || !placements.length || interval < 4) {
    return items.map((item, index) => ({
      kind: 'item' as const,
      key: getItemKey(item, index),
      item,
    }));
  }

  const result: FeedEntry<T>[] = [];
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
      placementIndex < placements.length &&
      position % interval === 0 &&
      position < items.length;

    if (shouldInsert) {
      const placement = placements[placementIndex++];
      result.push({
        kind: 'placement',
        key: placement.id,
        placement,
      });
      inserted += 1;
    }
  });

  return result;
}
