import React, { useMemo } from 'react';
import { AdvertiseHereCard } from '../../commerce/AdvertiseHereCard';
import { ProductCard } from '../../ProductCard';
import { PremiumCarousel } from '../PremiumCarousel';
import { DcHomePanel } from '../DcHomePanel';
import { ViewAllLink } from '../../design/ViewAllLink';
import type { SponsoredInjectedEntry } from '../../../utils/injectSponsoredIntoFeed';

interface HomeFeaturedProductsSectionProps {
  feed: SponsoredInjectedEntry<any>[];
}

/** Match All Products grid track width (~5 cols @ 1280 / gap 16). */
const FEATURED_CARD_WIDTH = 220;
const FEATURED_CARD_GAP = 16;

type FeaturedSlide =
  | { key: string; kind: 'product'; product: any }
  | { key: string; kind: 'ad' };

/** Featured Products — product-list-sized cards in a horizontal carousel */
export function HomeFeaturedProductsSection({ feed }: HomeFeaturedProductsSectionProps) {
  const slides = useMemo<FeaturedSlide[]>(() => {
    const products = feed
      .filter((e): e is Extract<SponsoredInjectedEntry<any>, { kind: 'item' }> => e.kind === 'item')
      .slice(0, 12)
      .map((entry) => ({
        key: entry.key,
        kind: 'product' as const,
        product: entry.item,
      }));

    if (!products.length) return [];
    return [...products, { key: 'featured-advertise', kind: 'ad' as const }];
  }, [feed]);

  if (!slides.length) return null;

  return (
    <DcHomePanel id="section-featured-products">
      <div className="flex items-baseline justify-between gap-3 mb-1">
        <h2
          id="section-featured-products-heading"
          className="text-[19px] font-extrabold text-[#1A1A2E]"
        >
          Featured Products
        </h2>
        <ViewAllLink href="/products" label="VIEW ALL ›" />
      </div>
      <p className="text-[12.5px] text-[#9AA0AC] m-0 mb-4">Handpicked deals you&apos;ll love</p>
      <div className="mb-6">
        <PremiumCarousel
          items={slides}
          itemWidth={FEATURED_CARD_WIDTH}
          gap={FEATURED_CARD_GAP}
          renderCard={(slide) => (
            <div className="w-full h-full min-h-[320px] flex">
              {slide.kind === 'product' ? (
                <ProductCard product={slide.product} variant="grid" />
              ) : (
                <AdvertiseHereCard variant="product-tile" className="w-full h-full" />
              )}
            </div>
          )}
        />
      </div>
    </DcHomePanel>
  );
}
