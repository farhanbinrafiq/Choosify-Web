import React, { useMemo } from 'react';
import { resolveListingRelatedInfoSection } from '../../../utils/listingRelatedInfo';
import type { ListingRelatedInfoProduct } from '../../../types/listingRelatedInfo';
import { BeforeYourVisitCard } from './BeforeYourVisitCard';
import { PriceAcrossStoresPanel } from './PriceAcrossStoresPanel';
import { WhatsNearbyCard } from './WhatsNearbyCard';

export interface ListingRelatedInfoPanelProps {
  product: ListingRelatedInfoProduct;
  fallbackPrice?: number;
  className?: string;
}

/**
 * Config-driven sidebar related-info slot (one section per listing).
 * Physical → Price Across Stores (seller-enabled).
 * Hotels / Real Estate → What's Nearby (mandatory).
 * Restaurants / Travel → What's Nearby (optional).
 * Doctors / Beauty → Before Your Visit (mandatory).
 * Education / Transport → Before Your Visit (optional).
 */
export function ListingRelatedInfoPanel({
  product,
  fallbackPrice,
  className,
}: ListingRelatedInfoPanelProps) {
  const resolved = useMemo(() => resolveListingRelatedInfoSection(product), [product]);

  if (!resolved) return null;

  if (resolved.kind === 'price_across_stores') {
    return (
      <PriceAcrossStoresPanel
        className={className}
        stores={resolved.storeComparisonList || []}
        fallbackPrice={fallbackPrice}
      />
    );
  }

  if (resolved.kind === 'whats_nearby') {
    return <WhatsNearbyCard className={className} data={resolved.whatsNearby} />;
  }

  if (resolved.kind === 'before_your_visit') {
    return (
      <BeforeYourVisitCard
        className={className}
        data={resolved.beforeYourVisit}
        fields={resolved.beforeVisitFields || []}
      />
    );
  }

  return null;
}
