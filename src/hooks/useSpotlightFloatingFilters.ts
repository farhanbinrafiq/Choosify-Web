import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRegisterPageFilters } from '../components/FilterEngine';
import type { SpotlightDiscoverFilters } from '../types/spotlight/experience/filters';
import { contentTypesForTab } from '../lib/spotlight/content/contentTypeRegistry';
import type { SpotlightContentTabId } from '../types/spotlight/discovery/navigation';
import { SPOTLIGHT_FLOATING_FILTERS } from '../lib/spotlight/feed/feedRegistry';

interface UseSpotlightFloatingFiltersOptions {
  filters: SpotlightDiscoverFilters;
  setFilters: (next: SpotlightDiscoverFilters) => void;
  activeTab: SpotlightContentTabId;
  onReplayToggle?: () => void;
  onUpcomingToggle?: () => void;
  replayOnly?: boolean;
  upcomingOnly?: boolean;
}

export function useSpotlightFloatingFilters({
  filters,
  setFilters,
  activeTab,
  onReplayToggle,
  onUpcomingToggle,
  replayOnly,
  upcomingOnly,
}: UseSpotlightFloatingFiltersOptions) {
  const navigate = useNavigate();

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filters.contentTypes.length) count += 1;
    if (filters.liveOnly) count += 1;
    if (filters.trendingOnly) count += 1;
    if (filters.sponsoredOnly) count += 1;
    if (filters.query) count += 1;
    if (filters.publisherTypes.length) count += 1;
    if (replayOnly) count += 1;
    if (upcomingOnly) count += 1;
    return count;
  }, [filters, replayOnly, upcomingOnly]);

  const goTab = (tab: SpotlightContentTabId) => navigate(`/spotlight?tab=${tab}`);

  const quickFilters = useMemo(() => {
    const isActive = (id: string): boolean => {
      switch (id) {
        case 'all':
          return activeTab === 'featured' && !filters.contentTypes.length && !filters.trendingOnly && !filters.promotionsOnly;
        case 'products':
          return activeTab === 'campaigns' || activeTab === 'launches';
        case 'services':
          return filters.publisherTypes.includes('service_provider');
        case 'videos':
          return activeTab === 'videos';
        case 'reels':
        case 'shorts':
          return activeTab === 'reels';
        case 'live':
          return activeTab === 'live' || filters.liveOnly;
        case 'reviews':
          return activeTab === 'reviews';
        case 'guides':
          return activeTab === 'guides';
        case 'brands':
          return filters.publisherTypes.includes('brand');
        case 'offers':
          return filters.promotionsOnly;
        case 'trending':
          return filters.trendingOnly;
        case 'saved':
          return activeTab === 'saved';
        case 'following':
          return activeTab === 'following';
        default:
          return false;
      }
    };

    const onFilterClick = (id: string) => {
      switch (id) {
        case 'all':
          goTab('featured');
          setFilters({ ...filters, contentTypes: [], trendingOnly: false, promotionsOnly: false, publisherTypes: [], liveOnly: false });
          break;
        case 'products':
          goTab('campaigns');
          break;
        case 'services':
          setFilters({
            ...filters,
            publisherTypes: filters.publisherTypes.includes('service_provider') ? [] : ['service_provider'],
            contentTypes: [],
          });
          break;
        case 'videos':
          goTab('videos');
          break;
        case 'reels':
        case 'shorts':
          goTab('reels');
          break;
        case 'live':
          goTab('live');
          break;
        case 'reviews':
          goTab('reviews');
          break;
        case 'guides':
          goTab('guides');
          break;
        case 'brands':
          setFilters({ ...filters, publisherTypes: filters.publisherTypes.includes('brand') ? [] : ['brand'] });
          break;
        case 'offers':
          setFilters({
            ...filters,
            promotionsOnly: !filters.promotionsOnly,
            contentTypes: contentTypesForTab('campaigns'),
          });
          break;
        case 'collections':
          navigate('/spotlight/explore?tab=collections');
          break;
        case 'series':
          navigate('/spotlight/explore?tab=series');
          break;
        case 'nearby':
          toastPlaceholder();
          break;
        case 'trending':
          setFilters({ ...filters, trendingOnly: !filters.trendingOnly });
          break;
        case 'saved':
          goTab('saved');
          break;
        case 'following':
          goTab('following');
          break;
        default:
          break;
      }
    };

    return SPOTLIGHT_FLOATING_FILTERS.map((f) => ({
      id: f.id,
      label: f.label,
      active: isActive(f.id),
      onClick: () => onFilterClick(f.id),
    }));
  // eslint-disable-next-line react-hooks/exhaustive-deps -- navigate stable
  }, [filters, activeTab, replayOnly, upcomingOnly]);

  useRegisterPageFilters(
    {
      pageName: 'Spotlight',
      scrollTargetId: 'spotlight-feed',
      activeFilterCount,
      onClearAll: () => {
        setFilters({
          ...filters,
          contentTypes: [],
          query: '',
          liveOnly: false,
          sponsoredOnly: false,
          verifiedOnly: false,
          trendingOnly: false,
          promotionsOnly: false,
          publisherTypes: [],
        });
        onReplayToggle?.();
        onUpcomingToggle?.();
      },
      renderFilters: null,
      renderSearch: null,
      quickFilters,
    },
    [filters, activeTab, activeFilterCount, replayOnly, upcomingOnly, quickFilters],
  );
}

function toastPlaceholder() {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('choosify:toast', { detail: { message: 'Nearby discovery coming soon' } }));
  }
}
