import React from 'react';
import { cn } from '../../lib/utils';
import { SPONSORED_SURFACE_CONFIG } from '../../lib/commerce/sponsoredPlacementRegistry';
import { useSponsoredPlacementsForSurface } from '../../hooks/useSponsoredPlacementsForSurface';
import type { SponsoredPlacementSurface } from '../../types/commerce/sponsoredPlacement';
import { ChoosifySponsoredCard } from './ChoosifySponsoredCard';
import { SponsoredProductTile } from './AdvertiseHereCard';

export interface PlacementSlotProps {
  /** Surface key — home, products, categories, brands, deals, search, spotlight, compare */
  placement: SponsoredPlacementSurface;
  /** Override default interval config (used by feed injectors) */
  frequency?: number;
  /** Max sponsored items in this slot */
  limit?: number;
  className?: string;
}

/**
 * LE-006.3 — Declarative sponsored placement slot.
 * Consumes surface registry + demo/CMS fallback; renders universal sponsored card.
 */
export function PlacementSlot({
  placement,
  limit = 1,
  className,
}: PlacementSlotProps) {
  const config = SPONSORED_SURFACE_CONFIG[placement];
  const items = useSponsoredPlacementsForSurface(placement, {
    limit: limit ?? config.maxPerPage,
  });

  if (!items.length) return null;

  return (
    <>
      {items.slice(0, limit).map((item) => (
        <ChoosifySponsoredCard key={item.id} item={item} className={className} />
      ))}
    </>
  );
}

/** Compare page rail — sponsored recommendations below comparison matrix */
export function SponsoredCompareRail({ className }: { className?: string }) {
  const items = useSponsoredPlacementsForSurface('compare', { limit: 2 });
  if (!items.length) return null;

  return (
    <section
      className={cn('max-w-7xl mx-auto px-6 py-8', className)}
      aria-label="Sponsored recommendations"
    >
      <div className="mb-4">
        <h3 className="text-xs font-black uppercase tracking-widest text-[#1a1a2e]">
          Recommended Alternatives
        </h3>
        <p className="text-[10px] text-gray-400 mt-1">Sponsored picks based on your comparison</p>
      </div>
      <div className="choosify-product-grid w-full">
        {items.map((item) => (
          <SponsoredProductTile key={item.id} item={item} />
        ))}
      </div>
    </section>
  );
}
