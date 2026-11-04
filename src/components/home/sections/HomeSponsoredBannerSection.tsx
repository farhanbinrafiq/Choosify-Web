import React from 'react';
import { ProductsSponsoredBannerCarousel } from '../../commerce/AdvertiseHereCard';
import { DcHomeBlock } from '../DcHomePanel';
import { AdSlotBanner } from '../../ads/AdSlot';
import { AD_SLOTS } from '../../../lib/ads/adSlots';

/** Choosify.dc.html Home — full-width sponsored banner carousel after Featured Products */
export function HomeSponsoredBannerSection() {
  return (
    <DcHomeBlock id="section-home-sponsored">
      {/* Ads Studio slot HOME_FOLLOW_BRANDS ("Homepage sponsored banner") */}
      <AdSlotBanner slot={AD_SLOTS.HOME_BANNER} className="mb-4" />
      <ProductsSponsoredBannerCarousel
        bannerClassName="mb-0 h-[200px]"
        className="mb-0"
        autoplay
      />
    </DcHomeBlock>
  );
}
