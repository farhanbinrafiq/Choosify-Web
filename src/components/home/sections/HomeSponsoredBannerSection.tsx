import React from 'react';
import { ProductsSponsoredBannerCarousel } from '../../commerce/AdvertiseHereCard';
import { DcHomeBlock } from '../DcHomePanel';
import { AdSlotBanner, useBannerAds } from '../../ads/AdSlot';
import { AD_SLOTS } from '../../../lib/ads/adSlots';

/**
 * One Ads Studio spot on the homepage (HOME_FOLLOW_BRANDS + an exact position). Renders nothing,
 * not even spacing, when no ad is booked for the spot.
 */
export function HomeAdSpot({ position, className }: { position: string; className?: string }) {
  const ads = useBannerAds(AD_SLOTS.HOME_BANNER, position);
  if (!ads.length) return null;
  return (
    <DcHomeBlock id={`home-ad-${position}`} className={className}>
      <AdSlotBanner slot={AD_SLOTS.HOME_BANNER} position={position} className="mb-4" />
    </DcHomeBlock>
  );
}

/** Choosify.dc.html Home — full-width sponsored banner carousel after Featured Products */
export function HomeSponsoredBannerSection() {
  return (
    <DcHomeBlock id="section-home-sponsored">
      {/* Ads Studio slot HOME_FOLLOW_BRANDS, default spot "after-popular-products" */}
      <AdSlotBanner slot={AD_SLOTS.HOME_BANNER} position="after-popular-products" className="mb-4" />
      <ProductsSponsoredBannerCarousel
        bannerClassName="mb-0 h-[200px]"
        className="mb-0"
        autoplay
      />
    </DcHomeBlock>
  );
}
