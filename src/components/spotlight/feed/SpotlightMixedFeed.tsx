import React, { useEffect, useMemo, useRef, useState, useCallback } from 'react';

import { GUIDE_MEDIA_GRID } from '../../../lib/pageLayout';

import type { SpotlightContent } from '../../../types/spotlight/experience/content';

import type { CatalogProduct } from '../../../types/catalog';

import type { SpotlightImpressionCallbacks } from '../../../types/spotlight/homepage';

import {

  mixSpotlightFeedItems,

  primaryProductForContent,

  SPOTLIGHT_FEED_BATCH,

  SPOTLIGHT_FEED_SCROLL_KEY,

  SPOTLIGHT_FEED_VISIBLE_KEY,

} from '../../../utils/spotlightMixedFeed';

import {
  UniversalCommerceCard,
  spotlightToContentCardModel,
  resolveCommerceCardVariant,
} from '../../content';

import { cn } from '../../../lib/utils';
import { ChoosifySponsoredCard } from '../../commerce/ChoosifySponsoredCard';
import { useSponsoredFeedEntries } from '../../../hooks/useSponsoredFeedEntries';



interface SpotlightMixedFeedProps {

  items: SpotlightContent[];

  products: CatalogProduct[];

  impressionCallbacks?: SpotlightImpressionCallbacks;

  className?: string;

}



export function SpotlightMixedFeed({

  items,

  products,

  impressionCallbacks,

  className,

}: SpotlightMixedFeedProps) {

  const mixedItems = useMemo(() => mixSpotlightFeedItems(items), [items]);



  const [visibleCount, setVisibleCount] = useState(() => {

    try {

      const saved = sessionStorage.getItem(SPOTLIGHT_FEED_VISIBLE_KEY);

      return saved ? Math.min(Number(saved), mixedItems.length) : SPOTLIGHT_FEED_BATCH.initial;

    } catch {

      return SPOTLIGHT_FEED_BATCH.initial;

    }

  });



  const sentinelRef = useRef<HTMLDivElement>(null);

  const restoredScroll = useRef(false);



  useEffect(() => {

    setVisibleCount((c) =>

      Math.min(Math.max(SPOTLIGHT_FEED_BATCH.initial, c), mixedItems.length || SPOTLIGHT_FEED_BATCH.initial),

    );

  }, [mixedItems.length]);



  useEffect(() => {

    if (restoredScroll.current) return;

    restoredScroll.current = true;

    try {

      const y = sessionStorage.getItem(SPOTLIGHT_FEED_SCROLL_KEY);

      if (y) {

        requestAnimationFrame(() => window.scrollTo(0, Number(y)));

        sessionStorage.removeItem(SPOTLIGHT_FEED_SCROLL_KEY);

      }

    } catch {

      /* ignore */

    }

  }, []);



  useEffect(() => {

    try {

      sessionStorage.setItem(SPOTLIGHT_FEED_VISIBLE_KEY, String(visibleCount));

    } catch {

      /* ignore */

    }

  }, [visibleCount]);



  useEffect(() => {

    const node = sentinelRef.current;

    if (!node) return;

    const observer = new IntersectionObserver(

      ([entry]) => {

        if (entry.isIntersecting) {

          setVisibleCount((c) => Math.min(c + SPOTLIGHT_FEED_BATCH.loadMore, mixedItems.length));

        }

      },

      { rootMargin: '240px' },

    );

    observer.observe(node);

    return () => observer.disconnect();

  }, [mixedItems.length]);



  const onNavigate = useCallback(

    (content: SpotlightContent) => {

      try {

        sessionStorage.setItem(SPOTLIGHT_FEED_SCROLL_KEY, String(window.scrollY));

      } catch {

        /* ignore */

      }

      impressionCallbacks?.onClicked?.(content.sourceId);

    },

    [impressionCallbacks],

  );



  const visibleItems = mixedItems.slice(0, visibleCount);

  const spotlightFeedEntries = useSponsoredFeedEntries(
    'spotlight',
    visibleItems,
    (content) => content.contentId,
    { enabled: visibleItems.length > 0 },
  );

  return (

    <div className={cn('w-full', className)}>

      <div id="spotlight-feed" className={GUIDE_MEDIA_GRID} aria-label="Spotlight shopping feed">

        {spotlightFeedEntries.map((entry) => {
          if (entry.kind === 'sponsored') {
            return <ChoosifySponsoredCard key={entry.key} item={entry.sponsored} />;
          }

          const content = entry.item;
          const product = primaryProductForContent(content, products);
          const model = spotlightToContentCardModel(content, product);
          return (
            <UniversalCommerceCard
              key={entry.key}
              mode="commerce"
              variant={resolveCommerceCardVariant(model.layoutVariant, model.aspectRatio)}
              model={model}
              onNavigate={() => onNavigate(content)}
            />
          );
        })}

      </div>



      {visibleCount < mixedItems.length && (

        <div ref={sentinelRef} className="py-10 flex justify-center" aria-hidden>

          <div className="h-8 w-8 rounded-full border-2 border-[#EB4501]/30 border-t-[#EB4501] animate-spin" />

        </div>

      )}



      {visibleCount >= mixedItems.length && mixedItems.length > SPOTLIGHT_FEED_BATCH.initial && (

        <p className="text-center text-[10px] font-bold uppercase tracking-wider text-gray-400 py-8">

          You&apos;ve seen all Spotlight picks

        </p>

      )}

    </div>

  );

}

