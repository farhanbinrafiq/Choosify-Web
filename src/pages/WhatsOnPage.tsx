import React, { useMemo, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { CalendarDays, ChevronRight, Search, Rocket, PartyPopper, Megaphone, Store } from 'lucide-react';
import { PageHeroBanner } from '../components/PageHeroBanner';
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
  { id: 'launch', label: 'Launches' },
  { id: 'festival', label: 'Festivals' },
  { id: 'campaign', label: 'Promotions' },
  { id: 'store_moment', label: 'Store Moments' },
];

type StatusFilter = 'all' | 'live' | 'scheduled';

export function WhatsOnPage() {
  const [query, setQuery] = useState('');
  const [activeKind, setActiveKind] = useState<BrandPostKind | 'all'>('all');
  const [selectedBrandId, setSelectedBrandId] = useState<number | null>(null);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');

  const brandOptions = useMemo(() => {
    const seen = new Map<number, string>();
    getAllBrandPosts().forEach((post) => {
      if (!seen.has(post.brandId)) seen.set(post.brandId, post.brandName);
    });
    return Array.from(seen.entries())
      .map(([id, name]) => ({ id, name }))
      .sort((a, b) => a.name.localeCompare(b.name));
  }, []);

  const posts = useMemo(() => {
    let result = filterBrandPosts({
      kind: activeKind,
      query,
      brandId: selectedBrandId ?? undefined,
    });
    if (statusFilter !== 'all') {
      result = result.filter((post) => post.status === statusFilter);
    }
    return result;
  }, [activeKind, query, selectedBrandId, statusFilter]);

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (query.trim()) count += 1;
    if (activeKind !== 'all') count += 1;
    if (selectedBrandId != null) count += 1;
    if (statusFilter !== 'all') count += 1;
    return count;
  }, [query, activeKind, selectedBrandId, statusFilter]);

  const handleClearAll = () => {
    setQuery('');
    setActiveKind('all');
    setSelectedBrandId(null);
    setStatusFilter('all');
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
      ].filter(Boolean) as Array<{ id: string; label: string; onRemove: () => void }>,
    [query, activeKind, selectedBrandId, statusFilter, brandOptions],
  );

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
              ],
            }}
            activeFilters={{
              kind: activeKind,
              brand: selectedBrandId != null ? String(selectedBrandId) : 'all',
              status: statusFilter,
            }}
            onFilterChange={(filterId, value) => {
              if (filterId === 'kind') {
                setActiveKind((value === 'all' || !value ? 'all' : value) as BrandPostKind | 'all');
              } else if (filterId === 'brand') {
                setSelectedBrandId(value === 'all' || !value ? null : Number(value));
              } else if (filterId === 'status') {
                setStatusFilter((value === 'all' || !value ? 'all' : value) as StatusFilter);
              }
            }}
          />
        </div>
      ),
      activeFilterCount,
      onClearAll: handleClearAll,
    },
    [query, activeKind, selectedBrandId, statusFilter, activeFilterCount, brandOptions],
  );

  const categoryNavItems = useMemo(
    () => [
      { id: 'event', label: 'Events', icon: <CalendarDays size={13} /> },
      { id: 'launch', label: 'Launches', icon: <Rocket size={13} /> },
      { id: 'festival', label: 'Festivals', icon: <PartyPopper size={13} /> },
      { id: 'campaign', label: 'Promotions', icon: <Megaphone size={13} /> },
      { id: 'store_moment', label: 'Store Moments', icon: <Store size={13} /> },
    ],
    [],
  );

  const handleCategoryNavigate = useCallback((id: string) => {
    setActiveKind(id === 'all' ? 'all' : (id as BrandPostKind));
    const el = document.getElementById('whats-on-feed');
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.pageYOffset - 200;
    window.scrollTo({ top: Math.max(0, top), behavior: 'smooth' });
  }, []);

  return (
    <div className="bg-choosify-feed min-h-screen pb-16">
      <PageHeroBanner pageKey="whats-on" />

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

        <section id="whats-on-feed" className="choosify-middle-feed flex flex-col gap-5 min-w-0 scroll-mt-36">
          {posts.length === 0 ? (
            <div className="bg-white rounded-[5px] border border-[#e8edf2] p-12 text-center">
              <CalendarDays className="w-10 h-10 text-gray-300 mx-auto mb-3" />
              <h2 className="text-sm font-black uppercase text-[#1A1D4E] mb-1">No posts found</h2>
              <p className="text-xs text-gray-400">Try another filter or search term.</p>
            </div>
          ) : (
            <div className={WHATS_ON_CARD_GRID}>
              {posts.map((post) => (
                <BrandPostCard key={post.id} post={post} compact />
              ))}
            </div>
          )}

          <p className="text-[10px] text-gray-400 font-semibold text-center uppercase tracking-wider">
            All listings marked Sponsored · Posted by verified brand partners
          </p>
        </section>

        <aside className="hidden 2xl:flex flex-col gap-4 lg:sticky lg:top-24 pb-10 flex-shrink-0 choosify-sidebar-right">
          <div className="bg-white rounded-[5px] border border-[#e8edf2] p-4 shadow-sm text-left">
            <h3 className="text-[11px] font-semibold text-[#8a9bb0] uppercase tracking-wider mb-3">For brands</h3>
            <p className="text-[11px] text-gray-500 leading-relaxed mb-3">
              Promote launches, festivals, and in-store moments to Choosify shoppers.
            </p>
            <Link
              to="/advertise"
              className="inline-flex items-center gap-1 text-[10px] font-black uppercase text-[#E8500A] hover:underline"
            >
              Advertise with us <ChevronRight size={12} />
            </Link>
          </div>
        </aside>
      </div>
    </div>
  );
}
