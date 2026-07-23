import React from 'react';
import { ListingBrowseControls } from '../design/ListingBrowseControls';

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

/**
 * Category browse controls for the floating filter popup.
 * Category presets live under the page header as ListingFilterPills.
 */
export function CategoriesBrowseControls({
  onSearch,
  quickChips = ['Electronics', 'Fashion', 'Beauty', 'Home', 'Sports', 'Grocery'],
  showSearch = false,
  searchQuery,
  onSearchQueryChange,
}: CategoriesBrowseControlsProps) {
  return (
    <ListingBrowseControls
      showSearch={showSearch}
      searchPlaceholder="Search categories..."
      searchQuery={searchQuery}
      onSearchQueryChange={onSearchQueryChange}
      quickChips={quickChips}
      onSearch={onSearch}
      onChipClick={onSearch}
      items={[]}
    />
  );
}

/** @deprecated Prefer CategoriesBrowseControls inside the floating filter popup. */
export const CategoriesQuickNav = CategoriesBrowseControls;
