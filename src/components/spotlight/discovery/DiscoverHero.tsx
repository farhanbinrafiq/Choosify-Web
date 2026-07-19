import React from 'react';
import { DcListingHero } from '../../design/DcListingHero';
import { LISTING_PAGE_MAX_WIDTH } from '../../../lib/design/dcListingTokens';

interface DiscoverHeroProps {
  className?: string;
  query?: string;
  onQuerySubmit?: (query: string) => void;
}

const DISCOVER_CHIPS = [
  'iPhone vs Samsung',
  'Best AC 2026',
  'Eid Gift Guide',
  'Budget Laptops',
  'Creator Reviews',
];

/** Choosify.dc.html Discover hero — same listing silhouette as Deals */
export function DiscoverHero({ className, onQuerySubmit }: DiscoverHeroProps) {
  return (
    <DcListingHero
      className={className}
      eyebrow="DISCOVER."
      titleBefore="Simplify Your Shopping"
      titleHighlight="Discovery"
      searchPlaceholder="Search guides, videos, reviews..."
      quickChips={DISCOVER_CHIPS}
      onSearch={(q) => onQuerySubmit?.(q)}
      onChipClick={(chip) => onQuerySubmit?.(chip)}
      maxWidthClass={LISTING_PAGE_MAX_WIDTH}
    />
  );
}
