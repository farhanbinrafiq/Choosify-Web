import React from 'react';
import { ListingBrowseControls } from '../design/ListingBrowseControls';
import {
  CATEGORY_QUICK_NAV_ITEMS,
} from '../../lib/design/categoryTokens';

interface CategoriesBrowseControlsProps {
  activeId: string;
  onSelect: (id: string, filterType: string | null) => void;
  onSearch?: (query: string) => void;
  quickChips?: string[];
  /** Hide search when the host drawer already renders Page Search. */
  showSearch?: boolean;
  searchQuery?: string;
  onSearchQueryChange?: (value: string) => void;
}

/** Category browse controls for the floating filter popup. */
export function CategoriesBrowseControls({
  activeId,
  onSelect,
  onSearch,
  quickChips = ['Electronics', 'Fashion', 'Beauty', 'Home', 'Sports', 'Grocery'],
  showSearch = false,
  searchQuery,
  onSearchQueryChange,
}: CategoriesBrowseControlsProps) {
  const scrollToGrid = () => {
    document.getElementById('categories-main-display')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <ListingBrowseControls
      showSearch={showSearch}
      searchPlaceholder="Search categories..."
      searchQuery={searchQuery}
      onSearchQueryChange={onSearchQueryChange}
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

/** @deprecated Prefer CategoriesBrowseControls inside the floating filter popup. */
export const CategoriesQuickNav = CategoriesBrowseControls;
