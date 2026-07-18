import React, { useMemo, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { CalendarDays, ChevronRight, Search, Rocket, PartyPopper, Megaphone, Store } from 'lucide-react';
import { DcListingHero } from '../components/design/DcListingHero';
import { DcListingStickyFilters } from '../components/design/DcListingStickyFilters';
import { BrandPostCard } from '../components/BrandPostCard';
import {
  ActiveFilterChips,
  UniversalFilterRenderer,
  useRegisterPageFilters,
} from '../components/FilterEngine';
import { filterBrandPosts, getAllBrandPosts } from '../lib/brandPosts';
import { BRAND_POST_KIND_LABELS, type BrandPostKind } from '../types/brandPost';
import { PAGE_SHELL_WRAPPER, PAGE_LISTING_SINGLE_SHELL, WHATS_ON_CARD_GRID } from '../lib/pageLayout';
import { StickySectionNav } from '../components/StickySectionNav';
import { cn } from '../lib/utils';

const KIND_TABS: Array<{ id: BrandPostKind | 'all'; label: string }> = [
  { id: 'all', label: 'All' },
  { id: 'event', label: 'Events' },
  { id: 'announcement', label: 'Announcements' },
  { id: 'launch', label: 'Launches' },
  { id: 'festival', label: 'Festivals' },
  { id: 'carnival', label: 'Carnivals' },
  { id: 'campaign', label: 'Promotions' },
  { id: 'store_moment', label: 'Store Moments' },
];

const KIND_STICKY_META: Record<
  BrandPostKind,
  { icon: string; name: string; sub: string; bg: string }
> = {
  event: { icon: '📅', name: 'Events', sub: 'Brand happenings', bg: '#EAF1FD' },
  announcement: { icon: '📣', name: 'Announcements', sub: 'Brand news', bg: '#EFECFD' },
  launch: { icon: '🚀', name: 'Launches', sub: 'New drops', bg: '#FFF3EA' },
  festival: { icon: '🎉', name: 'Festivals', sub: 'Seasonal moments', bg: '#FEF3E2' },
  carnival: { icon: '🎡', name: 'Carnivals', sub: 'Pop-up energy', bg: '#FDECEC' },
  campaign: { icon: '📢', name: 'Campaigns', sub: 'Promotions', bg: '#E6F9EA' },
  store_moment: { icon: '🏪', name: 'Store Moments', sub: 'In-store posts', bg: '#F4F7F9' },
};

type StatusFilter = 'all' | 'live' | 'scheduled';
type DateRangeFilter = 'all' | 'this_month' | 'next_30';

export function WhatsOnPage() {
  const [query, setQuery] = useState('');
  const [activeKind, setActiveKind] = useState<BrandPostKind | 'all'>('all');
  const [selectedBrandId, setSelectedBrandId] = useState<number | null>(null);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [locationFilter, setLocationFilter] = useState('');
  const [sponsoredOnly, setSponsoredOnly] = useState(false);
  const [dateRange, setDateRange] = useState<DateRangeFilter>('all');

  const allPosts = useMemo(() => getAllBrandPosts(), []);

  const brandOptions = useMemo(() => {
    const seen = new Map<number, string>();
    allPosts.forEach((post) => {
      if (!seen.has(post.brandId)) seen.set(post.brandId, post.brandName);
    });
    return Array.from(seen.entries())
      .map(([id, name]) => ({ id, name }))
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [allPosts]);

  const locationOptions = useMemo(() => {
    const seen = new Set<string>();
    allPosts.forEach((post) => {
      if (post.location?.trim()) seen.add(post.location.trim());
    });
    return Array.from(seen).sort();
  }, [allPosts]);

  const posts = useMemo(() => {
    let result = filterBrandPosts({
      kind: activeKind,
      query,
      brandId: selectedBrandId ?? undefined,
      location: locationFilter || undefined,
      sponsoredOnly,
      dateRange,
    });
    if (statusFilter !== 'all') {
      result = result.filter((post) => post.status === statusFilter);
    }
    return result;
  }, [activeKind, query, selectedBrandId, statusFilter, locationFilter, sponsoredOnly, dateRange]);

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (query.trim()) count += 1;
    if (activeKind !== 'all') count += 1;
    if (selectedBrandId != null) count += 1;
    if (statusFilter !== 'all') count += 1;
    if (locationFilter.trim()) count += 1;
    if (sponsoredOnly) count += 1;
    if (dateRange !== 'all') count += 1;
    return count;
  }, [query, activeKind, selectedBrandId, statusFilter, locationFilter, sponsoredOnly, dateRange]);

  const handleClearAll = () => {
    setQuery('');
    setActiveKind('all');
    setSelectedBrandId(null);
    setStatusFilter('all');
    setLocationFilter('');
    setSponsoredOnly(false);
    setDateRange('all');
  };

  const activeChips = useMemo(
    () =>
      [
        query.trim()
          ? { id: 'query', label: `Search: "${query.trim()}"`, onRemove: () => setQuery('') }
          : null,
        activeKind !== 'all'
          ? {
              id: 'kind',
              label: `Type: ${BRAND_POST_KIND_LABELS[activeKind]}`,
              onRemove: () => setActiveKind('all'),
            }
          : null,
        selectedBrandId != null
          ? {
              id: 'brand',
              label: `Brand: ${brandOptions.find((b) => b.id === selectedBrandId)?.name ?? 'Selected'}`,
              onRemove: () => setSelectedBrandId(null),
            }
          : null,
        statusFilter !== 'all'
          ? {
              id: 'status',
              label: `Status: ${statusFilter === 'live' ? 'Live now' : 'Upcoming'}`,
              onRemove: () => setStatusFilter('all'),
            }
          : null,
        locationFilter.trim()
          ? { id: 'location', label: `Location: ${locationFilter}`, onRemove: () => setLocationFilter('') }
          : null,
        sponsoredOnly
          ? { id: 'sponsored', label: 'Sponsored only', onRemove: () => setSponsoredOnly(false) }
          : null,
        dateRange !== 'all'
          ? {
              id: 'date',
              label: `Date: ${dateRange === 'this_month' ? 'This month' : 'Next 30 days'}`,
              onRemove: () => setDateRange('all'),
            }
          : null,
      ].filter(Boolean) as Array<{ id: string; label: string; onRemove: () => void }>,
    [query, activeKind, selectedBrandId, statusFilter, brandOptions, locationFilter, sponsoredOnly, dateRange],
  );

  const categoryNavItems = useMemo(
    () => [
      { id: 'event', label: 'Events', icon: <CalendarDays size={13} /> },
      { id: 'announcement', label: 'Announcements', icon: <Megaphone size={13} /> },
      { id: 'launch', label: 'Launches', icon: <Rocket size={13} /> },
      { id: 'festival', label: 'Festivals', icon: <PartyPopper size={13} /> },
      { id: 'carnival', label: 'Carnivals', icon: <PartyPopper size={13} /> },
      { id: 'campaign', label: 'Promotions', icon: <Megaphone size={13} /> },
      { id: 'store_moment', label: 'Store Moments', icon: <Store size={13} /> },
    ],
    [],
  );

  const stickyFilterItems = useMemo(() => {
    const liveCount = allPosts.filter((p) => p.status === 'live').length;
    const kindItems = (Object.keys(KIND_STICKY_META) as BrandPostKind[]).map((kind) => {
      const meta = KIND_STICKY_META[kind];
      const count = allPosts.filter((p) => p.kind === kind).length;
      return {
        id: kind,
        icon: meta.icon,
        name: meta.name,
        sub: count > 0 ? `${count} posts` : meta.sub,
        bg: meta.bg,
        active: activeKind === kind,
        onClick: () => {
          setActiveKind(activeKind === kind ? 'all' : kind);
          setStatusFilter('all');
        },
      };
    });

    return [
      {
        id: 'live',
        icon: '🔴',
        name: 'Live',
        sub: liveCount > 0 ? `${liveCount} now` : 'Happening now',
        bg: '#FFF3EA',
        active: statusFilter === 'live',
        onClick: () => {
          setStatusFilter(statusFilter === 'live' ? 'all' : 'live');
          setActiveKind('all');
        },
      },
      ...kindItems,
    ];
  }, [allPosts, activeKind, statusFilter]);

  const handleCategoryNavigate = useCallback((id: string) => {
    setActiveKind(id === 'all' ? 'all' : (id as BrandPostKind));
    const el = document.getElementById('whats-on-feed');
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.pageYOffset - 200;
    window.scrollTo({ top: Math.max(0, top), behavior: 'smooth' });
  }, []);

  useRegisterPageFilters(
    {
      pageName: 'Events',
      renderSearch: () => (
        <div className="relative">
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
            <Search size={13} className="text-[#E8500A]" />
          </div>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search events, brands, or locations..."
            className="w-full h-9 pl-8 pr-3 bg-white border border-[#e8edf2] rounded-[5px] text-[11px] font-semibold text-[#1A1D4E] placeholder-gray-400 focus:outline-none focus:border-[#E8500A]/50 transition-colors"
          />
        </div>
      ),
      quickFilters: [],
      renderFilters: () => (
        <div className="flex flex-col gap-4">
          <UniversalFilterRenderer
            profile={{
              entity: 'whats-on',
              filters: [
                {
                  id: 'kind',
                  name: 'Post type',
                  type: 'single_select',
                  options: [
                    { value: 'all', label: 'All types' },
                    ...KIND_TABS.filter((tab) => tab.id !== 'all').map((tab) => ({
                      value: tab.id,
                      label: tab.label,
                    })),
                  ],
                },
                {
                  id: 'brand',
                  name: 'Brand partner',
                  type: 'single_select',
                  options: [
                    { value: 'all', label: 'All brands' },
                    ...brandOptions.map((brand) => ({
                      value: String(brand.id),
                      label: brand.name,
                    })),
                  ],
                },
                {
                  id: 'status',
                  name: 'Availability',
                  type: 'single_select',
                  options: [
                    { value: 'all', label: 'All statuses' },
                    { value: 'live', label: 'Live now' },
                    { value: 'scheduled', label: 'Upcoming / scheduled' },
                  ],
                },
                {
                  id: 'location',
                  name: 'Location',
                  type: 'single_select',
                  options: [
                    { value: 'all', label: 'All locations' },
                    ...locationOptions.map((loc) => ({ value: loc, label: loc })),
                  ],
                },
                {
                  id: 'date',
                  name: 'Date range',
                  type: 'single_select',
                  options: [
                    { value: 'all', label: 'Any date' },
                    { value: 'this_month', label: 'This month' },
                    { value: 'next_30', label: 'Next 30 days' },
                  ],
                },
                {
                  id: 'sponsored',
                  name: 'Sponsorship',
                  type: 'single_select',
                  options: [
                    { value: 'all', label: 'All posts' },
                    { value: 'sponsored', label: 'Sponsored only' },
                  ],
                },
              ],
            }}
            activeFilters={{
              kind: activeKind,
              brand: selectedBrandId != null ? String(selectedBrandId) : 'all',
              status: statusFilter,
              location: locationFilter || 'all',
              date: dateRange,
              sponsored: sponsoredOnly ? 'sponsored' : 'all',
            }}
            onFilterChange={(filterId, value) => {
              if (filterId === 'kind') {
                setActiveKind((value === 'all' || !value ? 'all' : value) as BrandPostKind | 'all');
              } else if (filterId === 'brand') {
                setSelectedBrandId(value === 'all' || !value ? null : Number(value));
              } else if (filterId === 'status') {
                setStatusFilter((value === 'all' || !value ? 'all' : value) as StatusFilter);
              } else if (filterId === 'location') {
                setLocationFilter(value === 'all' || !value ? '' : value);
              } else if (filterId === 'date') {
                setDateRange((value === 'all' || !value ? 'all' : value) as DateRangeFilter);
              } else if (filterId === 'sponsored') {
                setSponsoredOnly(value === 'sponsored');
              }
            }}
          />
        </div>
      ),
      activeFilterCount,
      onClearAll: handleClearAll,
      sectionNav: {
        items: categoryNavItems,
        activeId: activeKind,
        onNavigate: handleCategoryNavigate,
        allLabel: 'All',
        allId: 'all',
        profileLabel: 'Event feed',
      },
    },
    [query, activeKind, selectedBrandId, statusFilter, activeFilterCount, brandOptions, locationFilter, sponsoredOnly, dateRange, locationOptions, categoryNavItems, handleCategoryNavigate],
  );

  return (
    <div className="flex flex-col min-h-screen bg-[#F4F7F9] pb-16">
      <DcListingHero
        titleBefore="What's"
        titleHighlight="On"
        searchPlaceholder="Search events, posts, brands..."
        quickChips={['Events', 'Launches', 'Festivals', 'Live', 'Campaigns', 'Store Moments']}
        onSearch={(q) => setQuery(q)}
        onChipClick={(chip) => {
          if (chip === 'Live') {
            setStatusFilter('live');
            setActiveKind('all');
            setQuery('');
            return;
          }
          const kindMap: Record<string, BrandPostKind> = {
            Events: 'event',
            Launches: 'launch',
            Festivals: 'festival',
            Campaigns: 'campaign',
            'Store Moments': 'store_moment',
          };
          const kind = kindMap[chip];
          if (kind) {
            setActiveKind(kind);
            setStatusFilter('all');
            setQuery('');
            return;
          }
          setQuery(chip);
        }}
      />

      <DcListingStickyFilters overlapHero items={stickyFilterItems} />

      <ActiveFilterChips chips={activeChips} onClearAll={handleClearAll} />

      <StickySectionNav
        sections={categoryNavItems}
        activeId={activeKind}
        onNavigate={handleCategoryNavigate}
        allLabel="All"
        allId="all"
        profileLabel="Event feed"
      />

      <div className={cn(PAGE_SHELL_WRAPPER, PAGE_LISTING_SINGLE_SHELL)}>
        <aside className="hidden lg:flex flex-col gap-4 lg:sticky lg:top-24 pb-10 flex-shrink-0 min-w-0 w-full max-w-full">
          <div className="bg-white rounded-[5px] border border-[#e8edf2] p-4 shadow-sm text-left">
            <h3 className="text-[10px] font-black uppercase tracking-widest text-[#8a9bb0] mb-3">About this feed</h3>
            <p className="text-[11px] text-gray-500 leading-relaxed font-semibold">
              Sponsored awareness posts published directly by verified brands. Editorial guides remain separate under Recommendations.
            </p>
          </div>
        </aside>

        <main id="whats-on-feed" className="scroll-mt-36 min-w-0 flex flex-col gap-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-extrabold text-[#1A1D4E]">What&apos;s On</h2>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">
                {posts.length} live brand moments
              </p>
            </div>
            <Link
              to="/brands"
              className="text-[10px] font-black uppercase tracking-wider text-[#E8500A] hover:underline flex items-center gap-1"
            >
              Browse brands <ChevronRight size={12} />
            </Link>
          </div>

          {posts.length === 0 ? (
            <div className="bg-white rounded-[5px] border border-dashed border-[#e8edf2] p-10 text-center">
              <p className="text-sm font-semibold text-gray-400">No events match your filters.</p>
              <button
                type="button"
                onClick={handleClearAll}
                className="mt-3 text-[10px] font-black uppercase tracking-wider text-[#E8500A] hover:underline"
              >
                Clear filters
              </button>
            </div>
          ) : (
            <div className={WHATS_ON_CARD_GRID}>
              {posts.map((post) => (
                <BrandPostCard key={post.id} post={post} />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
