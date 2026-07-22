import React from 'react';
import { DcListingStickyFilters } from '../design/DcListingStickyFilters';
import { cn } from '../../lib/utils';
import {
  CATEGORY_LISTING_MAX_WIDTH,
  CATEGORY_QUICK_NAV_ITEMS,
} from '../../lib/design/categoryTokens';

interface CategoriesQuickNavProps {
  activeId: string;
  onSelect: (id: string, filterType: string | null) => void;
  className?: string;
  onSearch?: (query: string) => void;
  quickChips?: string[];
}

/** Choosify.dc.html Categories sticky — merged search + letter quick nav */
export function CategoriesQuickNav({
  activeId,
  onSelect,
  className,
  onSearch,
  quickChips = ['Electronics', 'Fashion', 'Beauty', 'Home', 'Sports', 'Grocery'],
}: CategoriesQuickNavProps) {
  const scrollToGrid = () => {
    document.getElementById('categories-main-display')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <DcListingStickyFilters
      className={cn('mt-5', className)}
      maxWidthClass={CATEGORY_LISTING_MAX_WIDTH}
      searchPlaceholder="Search categories..."
      quickChips={quickChips}
      onSearch={onSearch}
      onChipClick={onSearch}
      items={CATEGORY_QUICK_NAV_ITEMS.map((item) => ({
        id: item.id,
        icon: item.letter,
        name: item.label,
        sub: item.sub,
        bg: activeId === item.id ? '#FFF3EA' : item.bg,
        active: activeId === item.id,
        onClick: () => {
          onSelect(item.id, item.filterType);
          scrollToGrid();
        },
      }))}
    />
  );
}
