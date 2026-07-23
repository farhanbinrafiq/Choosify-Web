import React from 'react';
import { ListingBrowseControls } from '../../design/ListingBrowseControls';
import type { SpotlightDiscoverFilters } from '../../../types/spotlight/experience/filters';
import type { SpotlightContentTabId } from '../../../types/spotlight/discovery/navigation';
import type { DiscoverQuickFilter } from './DiscoverStructuredFeed';

/** Discover under-header + mobile left-dock pills (keep this list lean). */
export const DISCOVER_FORMAT_TABS: Array<{
  id: string;
  label: string;
  filterId: string;
  icon: string;
  sub: string;
  bg: string;
}> = [
  { id: 'all', label: 'All', filterId: 'all', icon: '✦', sub: 'Everything', bg: '#FFF3EA' },
  { id: 'guides', label: 'Buying Guides', filterId: 'guides', icon: '📖', sub: 'In-depth help', bg: '#EAF1FD' },
  { id: 'reels', label: 'Reels', filterId: 'reels', icon: '⏵', sub: 'Short videos', bg: '#EFECFD' },
  { id: 'live', label: 'LIVE', filterId: 'live', icon: '◉', sub: 'Watch live', bg: '#FDECEC' },
  { id: 'videos', label: 'YouTube', filterId: 'videos', icon: '▶', sub: 'Expert videos', bg: '#FDECEC' },
  { id: 'blogs', label: 'Blogs', filterId: 'blogs', icon: '✍', sub: 'Written guides', bg: '#F1F1F3' },
];

const DISCOVER_CHIPS = [
  'iPhone vs Samsung',
  'Best AC 2026',
  'Eid Gift Guide',
  'Budget Laptops',
  'Creator Reviews',
];

interface DiscoverBrowseControlsProps {
  quickFilters: DiscoverQuickFilter[];
  filters: SpotlightDiscoverFilters;
  activeTab: SpotlightContentTabId;
  onQuerySubmit?: (query: string) => void;
  /** Hide search when the host drawer already renders Page Search. */
  showSearch?: boolean;
}

/**
 * Discover browse controls for the floating filter popup.
 * Format categories live under the page header as ListingFilterPills.
 */
export function DiscoverBrowseControls({
  onQuerySubmit,
  showSearch = false,
}: DiscoverBrowseControlsProps) {
  return (
    <ListingBrowseControls
      showSearch={showSearch}
      searchPlaceholder="Search guides, videos, reviews..."
      quickChips={DISCOVER_CHIPS}
      onSearch={onQuerySubmit}
      onChipClick={onQuerySubmit}
      items={[]}
    />
  );
}

/** @deprecated Prefer DiscoverBrowseControls inside the floating filter popup. */
export const DiscoverStickyFormatNav = DiscoverBrowseControls;
