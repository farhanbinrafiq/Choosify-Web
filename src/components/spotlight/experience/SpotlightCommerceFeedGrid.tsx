import React from 'react';
import type { SpotlightContent } from '../../../types/spotlight/experience/content';
import type { SpotlightImpressionCallbacks } from '../../../types/spotlight/homepage';
import { SpotlightCardRenderer } from './SpotlightCardRenderer';
import {
  resolveSpotlightCardForContent,
} from '../../../lib/spotlight/feed/cardRegistry';
import {
  DESKTOP_COMMERCE_GRID_CLASS,
  MOBILE_VERTICAL_FEED_CLASS,
  gridCellClassName,
  resolveGridCellPlacement,
} from '../../../lib/spotlight/feed/layoutRegistry';
import { cn } from '../../../lib/utils';

export interface SpotlightCommerceFeedGridProps {
  items: SpotlightContent[];
  impressionCallbacks?: SpotlightImpressionCallbacks;
  cardVariant?: 'default' | 'compact' | 'hero';
  sectionLayout?: string;
  className?: string;
}

/**
 * UX-02 adaptive feed layout:
 * - Mobile: vertical scroll, native aspect ratios
 * - Desktop: structured 4-column commerce grid (NOT masonry)
 */
export function SpotlightCommerceFeedGrid({
  items,
  impressionCallbacks,
  cardVariant = 'default',
  sectionLayout = 'grid',
  className,
}: SpotlightCommerceFeedGridProps) {
  return (
    <div className={cn('w-full', className)} data-layout="commerce_feed">
      {/* Mobile — vertical native-ratio feed */}
      <div className={MOBILE_VERTICAL_FEED_CLASS} aria-label="Spotlight mobile feed">
        {items.map((item) => (
          <SpotlightCardRenderer
            key={item.contentId}
            content={item}
            impressionCallbacks={impressionCallbacks}
            variant={cardVariant}
            sectionLayout={sectionLayout}
            feedMode="mobile_feed"
          />
        ))}
      </div>

      {/* Desktop — structured commerce grid */}
      <div className={DESKTOP_COMMERCE_GRID_CLASS} aria-label="Spotlight commerce grid">
        {items.map((item) => {
          const hasProduct = item.commerce.featuredProductIds.length > 0 || item.connections.productIds.length > 0;
          const hasService = item.commerce.featuredServiceIds.length > 0 || item.connections.serviceIds.length > 0;
          const { mode } = resolveSpotlightCardForContent({
            contentType: item.contentType,
            mediaType: item.media?.mediaType,
            hasProducts: hasProduct,
            hasServices: hasService,
            categoryIds: item.connections.categoryIds,
            headline: item.headline,
          });
          const placement = resolveGridCellPlacement(mode, item.media);

          return (
            <div
              key={item.contentId}
              className={gridCellClassName(placement)}
              data-grid-placement={placement.placement}
            >
              <SpotlightCardRenderer
                content={item}
                impressionCallbacks={impressionCallbacks}
                variant={cardVariant}
                sectionLayout={sectionLayout}
                feedMode="grid"
                className="h-full"
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
