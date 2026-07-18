import { useMemo } from 'react';

import { injectSponsoredIntoFeed } from '../utils/injectSponsoredIntoFeed';

import { SPONSORED_SURFACE_CONFIG } from '../lib/commerce/sponsoredPlacementRegistry';

import { useSponsoredPlacementsForSurface } from './useSponsoredPlacementsForSurface';

import type { SponsoredPlacementSurface, SponsoredPlacementItem } from '../types/commerce/sponsoredPlacement';



export type SponsoredFeedEntry<T> =

  | { kind: 'item'; key: string; item: T }

  | { kind: 'sponsored'; key: string; sponsored: SponsoredPlacementItem };



/** Inject sponsored cards into organic feed — never consecutive sponsored */

export function useSponsoredFeedEntries<T>(

  surface: SponsoredPlacementSurface,

  items: T[],

  getItemKey: (item: T, index: number) => string,

  options?: { frequency?: number; maxPlacements?: number; enabled?: boolean },

): SponsoredFeedEntry<T>[] {

  const config = SPONSORED_SURFACE_CONFIG[surface];

  const sponsored = useSponsoredPlacementsForSurface(surface, {

    limit: options?.maxPlacements ?? config.maxPerPage,

  });



  const interval = options?.frequency ?? config.interval;

  const maxPlacements = options?.maxPlacements ?? config.maxPerPage;

  const enabled = options?.enabled ?? true;



  return useMemo(() => {

    if (!enabled || !items.length || !sponsored.length) {

      return items.map((item, index) => ({

        kind: 'item' as const,

        key: getItemKey(item, index),

        item,

      }));

    }



    const injected = injectSponsoredIntoFeed(

      items,

      getItemKey,

      sponsored,

      interval,

      maxPlacements,

    );



    let organicCount = 0;

    const result: SponsoredFeedEntry<T>[] = [];



    for (const entry of injected) {

      if (entry.kind === 'item') {

        organicCount += 1;

        result.push(entry);

        continue;

      }



      const minBefore = config.minOrganicBeforeFirst ?? 0;

      if (config.neverFirst && organicCount < minBefore) {

        continue;

      }



      const lastWasSponsored = result[result.length - 1]?.kind === 'sponsored';

      if (lastWasSponsored) continue;



      result.push(entry);

    }



    return result.length ? result : injected;

  }, [items, sponsored, getItemKey, interval, maxPlacements, enabled, config.minOrganicBeforeFirst, config.neverFirst]);

}


