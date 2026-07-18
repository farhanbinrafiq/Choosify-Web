import React from 'react';
import { SponsoredSidebarSlot } from './SponsoredSidebarSlot';
import { AdSenseSlot } from './AdSenseSlot';
import type { PlacementKey } from '../lib/placements';
import type { SponsoredPlacementVariant } from './SponsoredPlacementCard';
import { cn } from '../lib/utils';

type ListingAdRailProps = {
  sponsoredPlacementKey: PlacementKey | string;
  sponsoredVariant?: SponsoredPlacementVariant;
  sponsoredDescription?: string;
  showAdSense?: boolean;
  adSenseFormat?: 'sidebar' | 'responsive';
  className?: string;
};

/** Right/left rail bundle: Choosify sponsored unit + optional Google AdSense below. */
export function ListingAdRail({
  sponsoredPlacementKey,
  sponsoredVariant = 'portrait',
  sponsoredDescription,
  showAdSense = true,
  adSenseFormat = 'sidebar',
  className,
}: ListingAdRailProps) {
  return (
    <div className={cn('flex flex-col gap-4 w-full', className)}>
      <SponsoredSidebarSlot
        placementKey={sponsoredPlacementKey}
        variant={sponsoredVariant}
        description={sponsoredDescription}
      />
      {showAdSense ? <AdSenseSlot format={adSenseFormat} /> : null}
    </div>
  );
}
