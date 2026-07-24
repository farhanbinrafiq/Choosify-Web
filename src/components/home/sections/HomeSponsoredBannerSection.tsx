import React from 'react';
import { ProductsSponsoredBannerCarousel } from '../../commerce/AdvertiseHereCard';
import { DcHomeBlock } from '../DcHomePanel';

/** Choosify.dc.html Home — full-width sponsored banner carousel after Featured Products */
export function HomeSponsoredBannerSection() {
  return (
    <DcHomeBlock id="section-home-sponsored">
      <ProductsSponsoredBannerCarousel
        bannerClassName="mb-0 h-[200px]"
        className="mb-0"
        autoplay
      />
    </DcHomeBlock>
  );
}
