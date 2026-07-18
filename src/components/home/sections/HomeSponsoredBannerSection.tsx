import React from 'react';
import { ProductsSponsoredBanner } from '../../commerce/AdvertiseHereCard';
import { DcHomeBlock } from '../DcHomePanel';

/** Choosify.dc.html Home — full-width sponsored banner after Featured Products */
export function HomeSponsoredBannerSection() {
  return (
    <DcHomeBlock id="section-home-sponsored">
      <ProductsSponsoredBanner
        title="Walton WD Series — Now with 0% EMI"
        subtitle="Official Walton store · Free nationwide delivery"
        href="/advertise"
        className="mb-0 h-[200px]"
      />
    </DcHomeBlock>
  );
}
