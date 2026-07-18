import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';
import { cn } from '../lib/utils';
import { useRegisterPageFilters } from '../components/FilterEngine';
import type { SpotlightDiscoverFilters } from '../types/spotlight/experience/filters';
import { contentTypesForTab } from '../lib/spotlight/content/contentTypeRegistry';
import type { SpotlightContentTabId } from '../types/spotlight/discovery/navigation';
import { SPOTLIGHT_FLOATING_FILTERS } from '../lib/spotlight/feed/feedRegistry';
import { SPOTLIGHT_CONTENT_TYPE_META } from '../types/spotlight/experience/contentTypes';
import type { SpotlightContentType } from '../types/spotlight/experience/contentTypes';

interface UseSpotlightFloatingFiltersOptions {
  filters: SpotlightDiscoverFilters;
  setFilters: (next: SpotlightDiscoverFilters) => void;
  activeTab: SpotlightContentTabId;
  onReplayToggle?: () => void;
  onUpcomingToggle?: () => void;
  replayOnly?: boolean;
  upcomingOnly?: boolean;
}

const COLLECTION_QUERY = '__collection__';

const FILTERABLE_TYPES = Object.entries(SPOTLIGHT_CONTENT_TYPE_META)
  .filter(([, meta]) => meta.group !== 'future')
  .map(([id]) => id as SpotlightContentType);

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
    if (filters.query && filters.query !== COLLECTION_QUERY) count += 1;
    if (filters.query === COLLECTION_QUERY) count += 1;
    if (filters.publisherTypes.length) count += 1;
    if (filters.promotionsOnly) count += 1;
    if (replayOnly) count += 1;
    if (upcomingOnly) count += 1;
    return count;
  }, [filters, replayOnly, upcomingOnly]);

  const goTab = (tab: SpotlightContentTabId) => navigate(`/spotlight?tab=${tab}`);

  const clearFilters = () => {
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
  };

  const quickFilters = useMemo(() => {
    const isActive = (id: string): boolean => {
      switch (id) {
        case 'all':
          return activeTab === 'featured' && !filters.contentTypes.length && !filters.trendingOnly && !filters.promotionsOnly && !filters.query;
        case 'products':
          return activeTab === 'campaigns' || activeTab === 'launches';
        case 'services':
          return filters.publisherTypes.some((t) =>
            ['service_provider', 'travel_agency', 'hotel', 'restaurant'].includes(t),
          );
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
        case 'campaigns':
          return activeTab === 'campaigns';
        case 'blogs':
          return activeTab === 'blogs';
        case 'collections':
          return filters.query === COLLECTION_QUERY;
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
          clearFilters();
          break;
        case 'products':
          goTab('campaigns');
          break;
        case 'services':
          setFilters({
            ...filters,
            publisherTypes: filters.publisherTypes.includes('service_provider')
              ? []
              : ['service_provider', 'travel_agency', 'hotel', 'restaurant'],
            contentTypes: [],
            query: '',
          });
          goTab('featured');
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
        case 'campaigns':
          goTab('campaigns');
          break;
        case 'blogs':
          goTab('blogs');
          break;
        case 'brands':
          setFilters({
            ...filters,
            publisherTypes: filters.publisherTypes.includes('brand') ? [] : ['brand'],
            query: '',
          });
          goTab('featured');
          break;
        case 'offers':
          setFilters({
            ...filters,
            promotionsOnly: !filters.promotionsOnly,
            contentTypes: contentTypesForTab('campaigns'),
            query: '',
          });
          goTab('featured');
          break;
        case 'collections':
          goTab('featured');
          setFilters({
            ...filters,
            contentTypes: [],
            query: filters.query === COLLECTION_QUERY ? '' : COLLECTION_QUERY,
            promotionsOnly: false,
          });
          break;
        case 'series':
          navigate('/spotlight/explore?tab=series');
          break;
        case 'nearby':
          toastPlaceholder();
          break;
        case 'trending':
          setFilters({ ...filters, trendingOnly: !filters.trendingOnly, query: '' });
          goTab('featured');
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
      onClearAll: clearFilters,
      renderSearch: () => (
        <div className="relative">
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
            <Search size={13} className="text-[#E8500A]" />
          </div>
          <input
            type="text"
            value={filters.query === COLLECTION_QUERY ? '' : (filters.query ?? '')}
            onChange={(e) =>
              setFilters({
                ...filters,
                query: e.target.value,
              })
            }
            placeholder="Search Spotlight, brands, creators..."
            className="w-full h-9 pl-8 pr-3 bg-white border border-[#e8edf2] rounded-[5px] text-[11px] font-semibold text-[#1A1D4E] placeholder-gray-400 focus:outline-none focus:border-[#E8500A]/50 transition-colors"
          />
        </div>
      ),
      renderFilters: () => (
        <div className="flex flex-col gap-4">
          <div className="bg-white border border-[#e8edf2] rounded-[5px] p-4 shadow-sm text-left">
            <h3 className="text-[11px] font-semibold text-[#8a9bb0] uppercase tracking-wider pb-2 border-b border-[#e8edf2] mb-3">
              Content Type
            </h3>
            <div className="flex flex-wrap gap-2">
              {FILTERABLE_TYPES.slice(0, 14).map((type) => {
                const active = filters.contentTypes.includes(type);
                return (
                  <button
                    key={type}
                    type="button"
                    onClick={() => {
                      const next = active
                        ? filters.contentTypes.filter((t) => t !== type)
                        : [...filters.contentTypes, type];
                      setFilters({ ...filters, contentTypes: next, query: '' });
                    }}
                    className={cn(
                      'px-3 py-1.5 rounded-full text-[9px] font-bold uppercase tracking-wide border transition-colors cursor-pointer',
                      active
                        ? 'bg-[#E8500A] text-white border-transparent'
                        : 'bg-white border-[#e8edf2] text-gray-500 hover:border-[#E8500A]/30',
                    )}
                  >
                    {SPOTLIGHT_CONTENT_TYPE_META[type].label}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="bg-white border border-[#e8edf2] rounded-[5px] p-4 shadow-sm text-left">
            <h3 className="text-[11px] font-semibold text-[#8a9bb0] uppercase tracking-wider pb-2 border-b border-[#e8edf2] mb-3">
              Discovery
            </h3>
            <div className="flex flex-wrap gap-2">
              {[
                { id: 'trending', label: 'Trending', active: filters.trendingOnly, toggle: () => setFilters({ ...filters, trendingOnly: !filters.trendingOnly }) },
                { id: 'sponsored', label: 'Sponsored', active: filters.sponsoredOnly, toggle: () => setFilters({ ...filters, sponsoredOnly: !filters.sponsoredOnly }) },
                { id: 'live', label: 'Live Only', active: filters.liveOnly, toggle: () => setFilters({ ...filters, liveOnly: !filters.liveOnly }) },
                { id: 'offers', label: 'Offers', active: filters.promotionsOnly, toggle: () => setFilters({ ...filters, promotionsOnly: !filters.promotionsOnly, contentTypes: contentTypesForTab('campaigns') }) },
              ].map((chip) => (
                <button
                  key={chip.id}
                  type="button"
                  onClick={chip.toggle}
                  className={cn(
                    'px-3 py-1.5 rounded-full text-[9px] font-bold uppercase tracking-wide border transition-colors cursor-pointer',
                    chip.active
                      ? 'bg-[#E8500A] text-white border-transparent'
                      : 'bg-white border-[#e8edf2] text-gray-500 hover:border-[#E8500A]/30',
                  )}
                >
                  {chip.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      ),
      quickFilters,
    },
    [filters, activeTab, activeFilterCount, replayOnly, upcomingOnly, quickFilters],
  );

  return { quickFilters, activeFilterCount };
}

function toastPlaceholder() {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('choosify:toast', { detail: { message: 'Nearby discovery coming soon' } }));
  }
}
