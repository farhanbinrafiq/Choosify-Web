import React from 'react';
import type { PlacementKey } from '../lib/placements';
import { usePlacements } from '../hooks/usePlacements';
import type { SponsoredPlacementVariant } from './SponsoredPlacementCard';
import { SponsoredVerticalAdCarousel } from './commerce/SponsoredVerticalAdCarousel';

type SponsoredSidebarSlotProps = {
  placementKey: PlacementKey | string;
  variant?: SponsoredPlacementVariant;
  className?: string;
  description?: string;
};

/** Portrait/landscape rail — multi-ad stacked carousel (autoplay + swipe). */
export function SponsoredSidebarSlot({
  placementKey,
  variant = 'portrait',
  className,
  description,
}: SponsoredSidebarSlotProps) {
  const placements = usePlacements(placementKey, {
    limit: 5,
    withFallback: true,
    fallbackVariant: variant === 'landscape' ? 'landscape' : 'portrait',
  });

  return (
    <SponsoredVerticalAdCarousel
      placements={placements}
      variant={variant}
      className={className}
      description={description}
      autoplay
      withDemoFallback
    />
  );
}
