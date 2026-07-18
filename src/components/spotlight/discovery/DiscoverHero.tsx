import React from 'react';
import { DcListingHero } from '../../design/DcListingHero';

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

/** Choosify.dc.html Discover hero */
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
    />
  );
}
