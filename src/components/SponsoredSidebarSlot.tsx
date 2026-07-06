import React from 'react';
import type { PlacementKey } from '../lib/placements';
import { usePrimaryPlacement } from '../hooks/usePlacements';
import { SponsoredPlacementCard, type SponsoredPlacementVariant } from './SponsoredPlacementCard';

type SponsoredSidebarSlotProps = {
  placementKey: PlacementKey | string;
  variant?: SponsoredPlacementVariant;
  className?: string;
  description?: string;
};

export function SponsoredSidebarSlot({
  placementKey,
  variant = 'portrait',
  className,
  description,
}: SponsoredSidebarSlotProps) {
  const placement = usePrimaryPlacement(placementKey, {
    withFallback: true,
    fallbackVariant: variant === 'landscape' ? 'landscape' : 'portrait',
  });

  if (!placement) return null;

  return (
    <SponsoredPlacementCard
      placement={placement}
      variant={variant}
      className={className}
      description={description}
    />
  );
}
