import React from 'react';
import { DcListingHero } from '../../design/DcListingHero';
import { LISTING_PAGE_MAX_WIDTH } from '../../../lib/design/dcListingTokens';

interface DiscoverHeroProps {
  className?: string;
  query?: string;
  onQuerySubmit?: (query: string) => void;
}

/** Choosify.dc.html Discover hero — title only; search lives in sticky chrome */
export function DiscoverHero({ className }: DiscoverHeroProps) {
  return (
    <DcListingHero
      className={className}
      eyebrow="DISCOVER."
      titleBefore="Simplify Your Shopping"
      titleHighlight="Discovery"
      showSearch={false}
      maxWidthClass={LISTING_PAGE_MAX_WIDTH}
    />
  );
}
