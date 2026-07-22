import React from 'react';
import { DcListingHero } from '../design/DcListingHero';
import { CATEGORY_LISTING_MAX_WIDTH } from '../../lib/design/categoryTokens';
import type { CategoriesPageStats } from '../../utils/categoryStats';

interface CategoriesDiscoveryHeroProps {
  stats: CategoriesPageStats;
  className?: string;
  onSearch?: (query: string) => void;
  quickChips?: string[];
}

/** Choosify.dc.html Categories hero — title only; search lives in sticky chrome */
export function CategoriesDiscoveryHero({
  className,
}: CategoriesDiscoveryHeroProps) {
  return (
    <DcListingHero
      className={className}
      titleBefore="Shop by"
      titleHighlight="Categories"
      showSearch={false}
      maxWidthClass={CATEGORY_LISTING_MAX_WIDTH}
    />
  );
}
