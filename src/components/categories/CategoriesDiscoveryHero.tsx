import React from 'react';
import { DcListingHero } from '../design/DcListingHero';
import type { CategoriesPageStats } from '../../utils/categoryStats';

interface CategoriesDiscoveryHeroProps {
  stats: CategoriesPageStats;
  className?: string;
  onSearch?: (query: string) => void;
  quickChips?: string[];
}

/** Choosify.dc.html Categories hero */
export function CategoriesDiscoveryHero({
  className,
  onSearch,
  quickChips = ['Electronics', 'Fashion', 'Beauty', 'Home', 'Sports', 'Grocery'],
}: CategoriesDiscoveryHeroProps) {
  return (
    <DcListingHero
      className={className}
      titleBefore="Shop by"
      titleHighlight="Categories"
      searchPlaceholder="Search categories..."
      quickChips={quickChips}
      onSearch={onSearch}
      onChipClick={onSearch}
    />
  );
}
