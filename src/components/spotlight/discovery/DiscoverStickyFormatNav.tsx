import React, { useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import type { DcStickyFilterItem } from '../../design/DcListingStickyFilters';
import { ListingBrowseControls } from '../../design/ListingBrowseControls';
import type { SpotlightDiscoverFilters } from '../../../types/spotlight/experience/filters';
import type { SpotlightContentTabId } from '../../../types/spotlight/discovery/navigation';
import type { DiscoverQuickFilter } from './DiscoverStructuredFeed';

/** Same format list as before — now with Deals-style icon + name + sub */
const DISCOVER_FORMAT_TABS: Array<{
  id: string;
  label: string;
  filterId: string;
  icon: string;
  sub: string;
  bg: string;
}> = [
  { id: 'all', label: 'All', filterId: 'all', icon: '✦', sub: 'Everything', bg: '#FFF3EA' },
  { id: 'guides', label: 'Buying Guides', filterId: 'guides', icon: '📖', sub: 'In-depth help', bg: '#EAF1FD' },
  { id: 'videos', label: 'Videos', filterId: 'videos', icon: '▶', sub: 'Expert videos', bg: '#FDECEC' },
  { id: 'reviews', label: 'Creator Reviews', filterId: 'reviews', icon: '⭐', sub: 'Creator takes', bg: '#FEF3E2' },
  { id: 'collections', label: 'Collections', filterId: 'collections', icon: '📚', sub: 'Curated sets', bg: '#EFECFD' },
  { id: 'brands', label: 'Brand Stories', filterId: 'brands', icon: '🏷', sub: 'From brands', bg: '#E6F9EA' },
  { id: 'campaigns', label: 'Campaigns', filterId: 'campaigns', icon: '📢', sub: 'Live campaigns', bg: '#FFF3EA' },
  { id: 'blogs', label: 'Blogs', filterId: 'blogs', icon: '✍', sub: 'Written guides', bg: '#F1F1F3' },
  { id: 'offers', label: 'Deals', filterId: 'offers', icon: '🏷', sub: 'Offers & savings', bg: '#FDECEC' },
  { id: 'reels', label: 'Reels', filterId: 'reels', icon: '⏵', sub: 'Short videos', bg: '#EFECFD' },
  { id: 'live', label: 'Live', filterId: 'live', icon: '◉', sub: 'Watch live', bg: '#FDECEC' },
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
 * Discover browse controls for the floating filter popup
 * (search chips + format icon tabs formerly in the sticky bar).
 */
export function DiscoverBrowseControls({
  quickFilters,
  filters,
  activeTab,
  onQuerySubmit,
  showSearch = false,
}: DiscoverBrowseControlsProps) {
  const navigate = useNavigate();

  const filterById = useMemo(() => {
    const map = new Map(quickFilters.map((f) => [f.id, f]));
    return map;
  }, [quickFilters]);

  const activeFormatId = useMemo(() => {
    for (const tab of DISCOVER_FORMAT_TABS) {
      if (tab.id === 'all') continue;
      const qf = filterById.get(tab.filterId);
      if (qf?.active) return tab.id;
    }
    if (activeTab === 'featured' && !filters.contentTypes.length) return 'all';
    const byTab = DISCOVER_FORMAT_TABS.find((t) => t.id === activeTab);
    return byTab?.id ?? 'all';
  }, [filterById, activeTab, filters.contentTypes.length]);

  const triggerFilter = useCallback(
    (filterId: string) => {
      const qf = filterById.get(filterId);
      if (qf) {
        qf.onClick();
        return;
      }
      navigate(`/spotlight?tab=${filterId === 'all' ? 'featured' : filterId}`);
    },
    [filterById, navigate],
  );

  const items: DcStickyFilterItem[] = useMemo(
    () =>
      DISCOVER_FORMAT_TABS.map((tab) => {
        const active = tab.id === activeFormatId;
        return {
          id: tab.id,
          icon: tab.icon,
          name: tab.label,
          sub: tab.sub,
          bg: active ? '#FFF3EA' : tab.bg,
          active,
          onClick: () => triggerFilter(tab.filterId),
        };
      }),
    [activeFormatId, triggerFilter],
  );

  return (
    <ListingBrowseControls
      showSearch={showSearch}
      searchPlaceholder="Search guides, videos, reviews..."
      quickChips={DISCOVER_CHIPS}
      onSearch={onQuerySubmit}
      onChipClick={onQuerySubmit}
      items={items}
    />
  );
}

/** @deprecated Prefer DiscoverBrowseControls inside the floating filter popup. */
export const DiscoverStickyFormatNav = DiscoverBrowseControls;
