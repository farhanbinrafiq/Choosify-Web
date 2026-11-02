import React, { useMemo } from 'react';
import { ProductCard } from '../../ProductCard';
import { PremiumCarousel } from '../PremiumCarousel';
import { DcHomePanel } from '../DcHomePanel';
import { ViewAllLink } from '../../design/ViewAllLink';
import type { SponsoredInjectedEntry } from '../../../utils/injectSponsoredIntoFeed';
import { HomeEmptyNote } from './HomeEmptyNote';

interface HomeFeaturedProductsSectionProps {
  feed: SponsoredInjectedEntry<any>[];
}

/** Match All Products grid track width (~5 cols @ 1280 / gap 16). */
const FEATURED_CARD_WIDTH = 220;
const FEATURED_CARD_GAP = 16;

type FeaturedSlide = { key: string; product: any };

/** Popular Products — product-list-sized cards in a horizontal carousel */
export function HomeFeaturedProductsSection({ feed }: HomeFeaturedProductsSectionProps) {
  const slides = useMemo<FeaturedSlide[]>(() => {
    const products = feed
      .filter((e): e is Extract<SponsoredInjectedEntry<any>, { kind: 'item' }> => e.kind === 'item')
      .slice(0, 12)
      .map((entry) => ({ key: entry.key, product: entry.item }));

    // Real products only — no "Advertise your product here" filler tile.
    return products;
  }, [feed]);

  return (
    <DcHomePanel id="section-featured-products">
      <div className="flex items-baseline justify-between gap-3 mb-1">
        <h2
          id="section-featured-products-heading"
          className="text-[19px] font-extrabold text-[#1A1A2E]"
        >
          Popular Products
        </h2>
        <ViewAllLink href="/products" label="VIEW ALL ›" />
      </div>
      <p className="text-[12.5px] text-[#9AA0AC] m-0 mb-4">Handpicked deals you&apos;ll love</p>
      {slides.length === 0 && <HomeEmptyNote text="No products listed yet." />}
      {slides.length > 0 && (
      <div className="mb-4">
        <PremiumCarousel
          items={slides}
          itemWidth={FEATURED_CARD_WIDTH}
          gap={FEATURED_CARD_GAP}
          renderCard={(slide) => (
            <div className="w-full h-full min-h-[320px] flex">
              <ProductCard product={slide.product} variant="grid" />
            </div>
          )}
        />
      </div>
      )}
    </DcHomePanel>
  );
}
