import React from 'react';
import { AdvertiseHereCard } from '../../commerce/AdvertiseHereCard';
import { ProductCard } from '../../ProductCard';
import { DcHomePanel } from '../DcHomePanel';
import { ViewAllLink } from '../../design/ViewAllLink';
import type { SponsoredInjectedEntry } from '../../../utils/injectSponsoredIntoFeed';

interface HomeFeaturedProductsSectionProps {
  feed: SponsoredInjectedEntry<any>[];
}

/** Choosify.dc.html — Featured Products 6-col grid inside white panel */
export function HomeFeaturedProductsSection({ feed }: HomeFeaturedProductsSectionProps) {
  if (!feed.length) return null;

  const items = feed.filter((e) => e.kind !== 'sponsored').slice(0, 6);

  return (
    <DcHomePanel id="section-featured-products">
      <div className="flex items-baseline justify-between gap-3 mb-1">
        <h2
          id="section-featured-products-heading"
          className="text-[19px] font-extrabold text-[#1A1A2E]"
        >
          Featured Products
        </h2>
        <ViewAllLink href="/products" label="VIEW ALL PRODUCTS ›" />
      </div>
      <p className="text-[12.5px] text-[#9AA0AC] m-0 mb-4">Handpicked deals you&apos;ll love</p>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-[14px] mb-8">
        {items.map((entry) =>
          entry.kind === 'item' ? (
            <ProductCard key={entry.key} product={entry.item} variant="grid" />
          ) : null,
        )}
        <AdvertiseHereCard variant="product-tile" />
      </div>
    </DcHomePanel>
  );
}
