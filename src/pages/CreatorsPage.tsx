import React, { useState, useMemo } from 'react';
import { PAGE_LISTING_SINGLE_SHELL, CREATOR_CARD_GRID } from "../lib/pageLayout";
import { useSectionScrollSpy } from '../hooks/useSectionScrollSpy';
import { Search, Star, Filter, ArrowRight, ExternalLink, ChevronLeft, ChevronRight, CheckCircle2, ShoppingBag, Youtube, Twitter, Facebook, Instagram, Sparkles, PenTool, Users, Heart, Eye, Share2, Flame, Zap, Layers, Award, Gift, Copy } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '../lib/utils';
import { useGlobalState } from '../context/GlobalStateContext';
import { toast } from '../lib/notify';
import type { Creator } from '../data/creators';
import { DragScrollContainer, UniversalFilterRenderer, QuickFilterBar, ActiveFilterChips, FullSidebarFilterPanel, useRegisterPageFilters } from '../components/FilterEngine';
import { CreatorCardDesign } from '../components/CreatorCardDesign';
import { ListingBrowseControls } from '../components/design/ListingBrowseControls';
import { ListingFeedHeader } from '../components/design/ListingFeedHeader';
import { LISTING_PAGE_MAX_WIDTH } from '../lib/design/dcListingTokens';
import { useInfiniteListBatch } from '../hooks/useInfiniteListBatch';
import { ListingAdRail } from '../components/ListingAdRail';
import { AdSenseSlot } from '../components/AdSenseSlot';
import { AdvertiseHereCard } from '../components/commerce/AdvertiseHereCard';
import { usePlacements } from '../hooks/usePlacements';
import { PLACEMENT_KEYS, INFEED_INTERVAL, INFEED_MAX_PER_PAGE } from '../lib/placements';
import { injectPlacementsIntoFeed } from '../utils/injectFeedPlacements';
import { rankCreators } from '../utils/listingRanking';
import { usePriorityClockMs } from '../hooks/usePriorityClockMs';

interface CreatorCollab {
  id: string;
  name: string;
  highlight: string;
  avatar: string;
  bgClass: string;
}

const CREATOR_COLLABS: CreatorCollab[] = [
  { id: 'creator-farhan', name: "Farhan Bin Rafiq", highlight: "PC Build Masterclass Sponsor", avatar: "https://res.cloudinary.com/djdyqr8yd/image/upload/v1781880900/FBR_n3eycm.png", bgClass: "bg-orange-primary/95" },
  { id: 'creator-sarah', name: "Sarah Jenkins", highlight: "Sustainable Monsoons Drop", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&h=300&q=80", bgClass: "bg-navy" },
  { id: 'creator-mily', name: "Mily Rahman", highlight: "Youth Budgeting Workshop", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&h=300&q=80", bgClass: "bg-teal-700" }
];

interface CreatorPromo {
  creatorId: string;
  creatorName: string;
  code: string;
  discount: string;
}

const CREATOR_PROMOS: CreatorPromo[] = [
  { creatorId: 'creator-farhan', creatorName: "Farhan Bin Rafiq", code: "FARHANTECH", discount: "15% OFF Gadgets" },
  { creatorId: 'creator-sarah', creatorName: "Sarah Jenkins", code: "SARAHSTYLE", discount: "10% OFF sustainable wear" },
  { creatorId: 'creator-mily', creatorName: "Mily Rahman", code: "MILYSAVE", discount: "Free personal template" }
];

export function CreatorsPage() {
  const { getCreatorClaimStatus, creatorClaimStatuses, allCreators } = useGlobalState();
  const [selectedLetter, setSelectedLetter] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('All Creators');
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [verificationFilter, setVerificationFilter] = useState<'all' | 'verified' | 'unverified'>('all');
  const [popularityFilter, setPopularityFilter] = useState<'all' | 'high' | 'normal'>('all');

  // Restore state from sessionStorage on mount
  React.useEffect(() => {
    try {
      const saved = sessionStorage.getItem('choosify_creators_filters');
      if (saved) {
        const filters = JSON.parse(saved);
        if (filters.selectedCategory) setSelectedCategory(filters.selectedCategory);
        if (filters.selectedLetter) setSelectedLetter(filters.selectedLetter);
        if (filters.verificationFilter) setVerificationFilter(filters.verificationFilter);
        if (filters.popularityFilter) setPopularityFilter(filters.popularityFilter);
        if (filters.activeTab) setActiveTab(filters.activeTab);
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  // Save state on updates
  React.useEffect(() => {
    const filters = {
      selectedCategory,
      selectedLetter,
      verificationFilter,
      popularityFilter,
      activeTab
    };
    sessionStorage.setItem('choosify_creators_filters', JSON.stringify(filters));
  }, [selectedCategory, selectedLetter, verificationFilter, popularityFilter, activeTab]);

  // Model-level augmentation matching BrandsPage visual cards rating, reviews structure
  const mappedCreators = React.useMemo(() => {
    return allCreators.map(c => {
      let rating = 4.7;
      let reviews = 85;
      let isHot = Boolean(c.featuredFlag) || c.score >= 95;
      let isFeatured = Boolean(c.featuredFlag) || c.score >= 90;

      if (c.score >= 96) {
        rating = 4.9;
        reviews = 240;
        isHot = true;
      } else if (c.score >= 92) {
        rating = 4.8;
        reviews = 190;
        isFeatured = true;
      }

      return {
        ...c,
        rating,
        reviews,
        isHot,
        isFeatured,
        featuredFlag: c.featuredFlag ?? isFeatured,
        verifiedStatus: c.verifiedStatus,
      };
    });
  }, [allCreators]);

  const priorityNowMs = usePriorityClockMs();

  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

  // Core reactive filtering logic for creator list
  const filteredCreators = React.useMemo(() => {
    let result = [...mappedCreators];

    // 1. Filter by Active Tab selection
    if (activeTab === 'Trending Creators') {
      result = result.filter(c => c.isHot || c.rating >= 4.7);
    } else if (activeTab === 'Featured Creators') {
      result = result.filter(c => c.isFeatured || c.rating >= 4.8);
    } else if (activeTab === 'Hot Deals Creators') {
      result = result.filter(c => c.isHot);
    } else if (activeTab === 'Top Rated Creators') {
      result = result.filter(c => c.rating >= 4.8);
    }

    // 2. Filter by search query across Name, bestFor, handle, or bio
    const q = searchQuery.toLowerCase().trim();
    if (q) {
      result = result.filter(c => 
        c.name.toLowerCase().includes(q) ||
        (c.bestFor || '').toLowerCase().includes(q) ||
        (c.handle || '').toLowerCase().includes(q) ||
        (c.bio || '').toLowerCase().includes(q)
      );
    }

    // 3. Filter by Selected Letter
    if (selectedLetter) {
      result = result.filter(c => c.name.toUpperCase().startsWith(selectedLetter));
    }

    // 4. Filter by Category
    if (selectedCategory) {
      result = result.filter(c => (c as any).category?.toLowerCase() === selectedCategory.toLowerCase() || (c as any).bestFor?.toLowerCase().includes(selectedCategory.toLowerCase()));
    }

    // 5. Filter by Verification
    if (verificationFilter === 'verified') {
      result = result.filter(c => c.id === 'creator-farhan' || c.id === 'creator-sarah' || c.id === 'creator-mily');
    } else if (verificationFilter === 'unverified') {
      result = result.filter(c => c.id !== 'creator-farhan' && c.id !== 'creator-sarah' && c.id !== 'creator-mily');
    }

    // 6. Filter by Popularity
    if (popularityFilter === 'high') {
      result = result.filter(c => c.rating >= 4.8);
    } else if (popularityFilter === 'normal') {
      result = result.filter(c => c.rating < 4.8);
    }

    return rankCreators(result, priorityNowMs);
  }, [mappedCreators, searchQuery, selectedLetter, activeTab, selectedCategory, verificationFilter, popularityFilter, priorityNowMs]);

  const infeedPlacements = usePlacements(PLACEMENT_KEYS.INFEED_CREATOR, {
    limit: INFEED_MAX_PER_PAGE,
    entityType: 'creator',
  });

  const creatorFeed = useMemo(
    () =>
      injectPlacementsIntoFeed(
        filteredCreators,
        (creator) => `creator-${creator.id}`,
        infeedPlacements,
        INFEED_INTERVAL.creator,
        3,
      ),
    [filteredCreators, infeedPlacements],
  );

  const {
    visibleItems: visibleCreatorFeed,
    sentinelRef,
    hasMore,
    visibleCount,
  } = useInfiniteListBatch(creatorFeed, {
    initial: 24,
    loadMore: 12,
    resetKey: searchQuery + (selectedLetter ?? ''),
  });

  const sectionNavItems = useMemo(
    () => [{ id: 'creators-main-display', label: 'Creators', icon: <Users size={13} /> }],
    [],
  );
  const { activeId: activeSectionId, scrollToSection } = useSectionScrollSpy(sectionNavItems);

  useRegisterPageFilters({
    pageName: 'Creators',
    renderSearch: () => (
      <div className="relative">
        <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
          <Search size={13} className="text-[#EB4501]" />
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search creators..."
          className="w-full h-9 pl-8 pr-3 bg-white border border-[#eef2f6] rounded-2xl text-[11px] font-semibold text-[#1A1D4E] placeholder-gray-400 focus:outline-none focus:border-[#EB4501]/50 transition-colors"
        />
      </div>
    ),
    quickFilters: [
      { id: 'verified', label: '✓ Verified Expert', active: verificationFilter === 'verified', onClick: () => setVerificationFilter(verificationFilter === 'verified' ? 'all' : 'verified') },
      { id: 'high-eng', label: 'ðŸ”¥ High Engagement (4.8+)', active: popularityFilter === 'high', onClick: () => setPopularityFilter(popularityFilter === 'high' ? 'all' : 'high') },
      { id: 'tech', label: 'ðŸ’» Tech Niches', active: selectedCategory === 'Tech & Gaming', onClick: () => setSelectedCategory(selectedCategory === 'Tech & Gaming' ? null : 'Tech & Gaming') },
      { id: 'fashion', label: 'ðŸ‘— Fashion Influencer', active: selectedCategory === 'Fashion & Beauty', onClick: () => setSelectedCategory(selectedCategory === 'Fashion & Beauty' ? null : 'Fashion & Beauty') }
    ],
    renderFilters: () => (
      <div className="flex flex-col gap-4">
        <UniversalFilterRenderer
          profile={{
            entity: 'creators',
            filters: [
              {
                id: 'niche',
                name: 'Creator Niche Mode',
                type: 'single_select',
                options: [
                  { value: 'all', label: 'All Niches' },
                  ...['Tech & Gaming', 'Fashion & Beauty', 'Food & Lifestyle', 'Sustainable Wear', 'Youth Budgeting', 'Creative Writing'].map(cat => ({ value: cat, label: cat }))
                ]
              },
              {
                id: 'verification',
                name: 'Expert verification',
                type: 'single_select',
                options: [
                  { value: 'all', label: 'All Claim Statuses' },
                  { value: 'verified', label: 'Verified Experts Only' },
                  { value: 'unverified', label: 'Independent' }
                ]
              },
              {
                id: 'engagement',
                name: 'Engagement Flow',
                type: 'single_select',
                options: [
                  { value: 'all', label: 'All Engagements' },
                  { value: 'high', label: 'Top Engagement (4.8+)' },
                  { value: 'normal', label: 'Standard Tier' }
                ]
              }
            ]
          }}
          activeFilters={{
            niche: selectedCategory || 'all',
            verification: verificationFilter,
            engagement: popularityFilter
          }}
          onFilterChange={(filterId, value) => {
            if (filterId === 'niche') {
              setSelectedCategory(value === 'all' || !value ? null : value);
            } else if (filterId === 'verification') {
              setVerificationFilter(value as any);
            } else if (filterId === 'engagement') {
              setPopularityFilter(value as any);
            }
          }}
        />

        {/* Alpha Search (A-Z) */}
        <div className="bg-white rounded-2xl p-4.5 border border-[#eef2f6] shadow-sm flex flex-col gap-2">
          <h3 className="text-[11px] font-black text-[#8a9bb0] uppercase tracking-wider mb-2">Alpha Search (A-Z)</h3>
          <div className="grid grid-cols-5 gap-1.5 max-h-32 overflow-y-auto no-scrollbar">
            <button 
              onClick={() => setSelectedLetter(null)}
              className={cn(
                "col-span-5 py-1.5 rounded-2xl text-[8.5px] font-bold uppercase transition-all text-center cursor-pointer",
                selectedLetter === null ? "bg-orange-primary text-white" : "bg-gray-50 text-gray-400 hover:bg-gray-100"
              )}
            >
              All Initials
            </button>
            {'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').map((letter) => (
              <button 
                key={letter} 
                onClick={() => setSelectedLetter(letter)}
                className={cn(
                  "h-5.5 rounded-2xl text-[9.5px] font-black transition-all flex items-center justify-center uppercase cursor-pointer",
                  selectedLetter === letter ? "bg-orange-primary text-white" : "bg-gray-50 text-gray-400 hover:bg-gray-100"
                )}
              >
                {letter}
              </button>
            ))}
          </div>
        </div>
      </div>
    ),
    alphabetFilter: { activeLetter: selectedLetter, onLetterChange: setSelectedLetter },
    scrollTargetId: 'creators-main-display',
    activeFilterCount: (selectedCategory ? 1 : 0) +
      (selectedLetter ? 1 : 0) +
      (verificationFilter !== 'all' ? 1 : 0) +
      (popularityFilter !== 'all' ? 1 : 0) +
      (searchQuery ? 1 : 0),
    onClearAll: () => {
      setSelectedLetter(null); 
      setSearchQuery(''); 
      setActiveTab('All Creators');
      setSelectedCategory(null);
      setVerificationFilter('all');
      setPopularityFilter('all');
    },
    sectionNav: {
      items: sectionNavItems,
      activeId: activeSectionId,
      onNavigate: scrollToSection,
      allLabel: 'Creators',
      profileLabel: 'Creator hub',
    },
  }, [selectedLetter, searchQuery, activeTab, selectedCategory, verificationFilter, popularityFilter, sectionNavItems, activeSectionId, scrollToSection]);

  const creatorsBrowseControls = (
    <ListingBrowseControls
      showSearch={false}
      quickChips={['Tech', 'Fashion', 'Beauty', 'Food', 'Lifestyle', 'Gaming']}
      onSearch={(q) => setSearchQuery(q)}
      onChipClick={(q) => setSearchQuery(q)}
      items={[
        {
          id: 'tech',
          icon: '💻',
          name: 'Tech Reviewers',
          sub: '320 creators',
          bg: '#EAF1FD',
          active: selectedCategory === 'Tech Reviewers',
          onClick: () => setSelectedCategory(selectedCategory === 'Tech Reviewers' ? null : 'Tech Reviewers'),
        },
        {
          id: 'beauty',
          icon: '💄',
          name: 'Beauty & Lifestyle',
          sub: '210 creators',
          bg: '#FDECEC',
          active: selectedCategory === 'Beauty & Lifestyle',
          onClick: () => setSelectedCategory(selectedCategory === 'Beauty & Lifestyle' ? null : 'Beauty & Lifestyle'),
        },
        {
          id: 'fashion',
          icon: '👗',
          name: 'Fashion',
          sub: '180 creators',
          bg: '#EFECFD',
          active: selectedCategory === 'Fashion',
          onClick: () => setSelectedCategory(selectedCategory === 'Fashion' ? null : 'Fashion'),
        },
        {
          id: 'fitness',
          icon: '💪',
          name: 'Fitness & Health',
          sub: '140 creators',
          bg: '#E6F9EA',
          active: selectedCategory === 'Fitness & Health',
          onClick: () => setSelectedCategory(selectedCategory === 'Fitness & Health' ? null : 'Fitness & Health'),
        },
        {
          id: 'food',
          icon: '🍳',
          name: 'Food & Cooking',
          sub: '95 creators',
          bg: '#FEF3E2',
          active: selectedCategory === 'Food & Cooking',
          onClick: () => setSelectedCategory(selectedCategory === 'Food & Cooking' ? null : 'Food & Cooking'),
        },
        {
          id: 'home',
          icon: '🏠',
          name: 'Home & Living',
          sub: '110 creators',
          bg: '#EAF1FD',
          active: selectedCategory === 'Home & Living',
          onClick: () => setSelectedCategory(selectedCategory === 'Home & Living' ? null : 'Home & Living'),
        },
      ]}
    />
  );

  return (
    <div className="flex flex-col min-h-screen bg-choosify-feed">
      <div className={`${LISTING_PAGE_MAX_WIDTH} mx-auto px-4 sm:px-5 lg:px-6 xl:px-8 py-10 md:py-12 w-full ${PAGE_LISTING_SINGLE_SHELL}`}>
        
        {/* Left Sidebar */}
        <aside className="hidden lg:flex flex-col gap-4 lg:sticky lg:top-24 pb-10 flex-shrink-0 animate-fade-in text-left">
          {/* LEFT COLUMN SEARCH BAR */}
          <div className="relative">
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
              <Search size={13} className="text-[#EB4501]" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search creators..."
              className="w-full h-9 pl-8 pr-3 bg-white border border-[#eef2f6] rounded-2xl text-[11px] font-semibold text-[#1A1D4E] placeholder-gray-400 focus:outline-none focus:border-[#EB4501]/50 transition-colors shadow-sm"
            />
          </div>

          {/* LAYER 2: FULL SIDEBAR FILTER PANEL */}
          <div id="creators-sidebar-filters" className="transition-all duration-300 rounded-2xl w-full">
            <FullSidebarFilterPanel
              title="Filter Creators"
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              searchPlaceholder="Search creators, niche, handle or bio..."
              browseControls={creatorsBrowseControls}
              activeChips={
                <ActiveFilterChips
                  chips={[
                    selectedCategory ? { id: 'category', label: `Niche: ${selectedCategory}`, onRemove: () => setSelectedCategory(null) } : null,
                    selectedLetter ? { id: 'letter', label: `Starts with: ${selectedLetter}`, onRemove: () => setSelectedLetter(null) } : null,
                    verificationFilter !== 'all' ? { id: 'verification', label: `Verification: ${verificationFilter}`, onRemove: () => setVerificationFilter('all') } : null,
                    popularityFilter !== 'all' ? { id: 'engagement', label: `Engagement: ${popularityFilter}`, onRemove: () => setPopularityFilter('all') } : null
                  ].filter(Boolean) as any[]}
                  onClearAll={() => {
                    setSelectedLetter(null); 
                    setSearchQuery(''); 
                    setActiveTab('All Creators');
                    setSelectedCategory(null);
                    setVerificationFilter('all');
                    setPopularityFilter('all');
                  }}
                />
              }
              onReset={() => {
                setSelectedLetter(null); 
                setSearchQuery(''); 
                setActiveTab('All Creators');
                setSelectedCategory(null);
                setVerificationFilter('all');
                setPopularityFilter('all');
              }}
              advancedSection={
                <div className="flex flex-col gap-4">
                  {/* Initial Index selection A-Z */}
                  <div className="bg-white rounded-2xl p-4.5 border border-[#eef2f6] shadow-sm flex flex-col gap-2">
                    <h3 className="text-[11px] font-black text-[#8a9bb0] uppercase tracking-wider mb-2">Alpha Search (A-Z)</h3>
                    <div className="grid grid-cols-5 gap-1.5 max-h-32 overflow-y-auto no-scrollbar">
                      <button 
                        onClick={() => setSelectedLetter(null)}
                        className={cn(
                          "col-span-5 py-1.5 rounded-2xl text-[8.5px] font-bold uppercase transition-all text-center cursor-pointer",
                          selectedLetter === null ? "bg-orange-primary text-white" : "bg-gray-50 text-gray-400 hover:bg-gray-100"
                        )}
                      >
                        All Initials
                      </button>
                      {'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').map((letter) => (
                        <button 
                          key={letter} 
                          onClick={() => setSelectedLetter(letter)}
                          className={cn(
                            "h-5.5 rounded-2xl text-[9.5px] font-black transition-all flex items-center justify-center uppercase cursor-pointer",
                            selectedLetter === letter ? "bg-orange-primary text-white" : "bg-gray-50 text-gray-400 hover:bg-gray-100"
                          )}
                        >
                          {letter}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              }
            >
              <UniversalFilterRenderer
                profile={{
                  entity: 'creators',
                  filters: [
                    {
                      id: 'niche',
                      name: 'Creator Niche Mode',
                      type: 'single_select',
                      options: [
                        { value: 'all', label: 'All Niches' },
                        ...['Tech & Gaming', 'Fashion & Beauty', 'Food & Lifestyle', 'Sustainable Wear', 'Youth Budgeting', 'Creative Writing'].map(cat => ({ value: cat, label: cat }))
                      ]
                    },
                    {
                      id: 'verification',
                      name: 'Expert verification',
                      type: 'single_select',
                      options: [
                        { value: 'all', label: 'All Claim Statuses' },
                        { value: 'verified', label: 'Verified Experts Only' },
                        { value: 'unverified', label: 'Independent' }
                      ]
                    },
                    {
                      id: 'engagement',
                      name: 'Engagement Flow',
                      type: 'single_select',
                      options: [
                        { value: 'all', label: 'All Engagements' },
                        { value: 'high', label: 'Top Engagement (4.8+)' },
                        { value: 'normal', label: 'Standard Tier' }
                      ]
                    }
                  ]
                }}
                activeFilters={{
                  niche: selectedCategory || 'all',
                  verification: verificationFilter,
                  engagement: popularityFilter
                }}
                onFilterChange={(filterId, value) => {
                  if (filterId === 'niche') {
                    setSelectedCategory(value === 'all' || !value ? null : value);
                  } else if (filterId === 'verification') {
                    setVerificationFilter(value as any);
                  } else if (filterId === 'engagement') {
                    setPopularityFilter(value as any);
                  }
                }}
              />
            </FullSidebarFilterPanel>
          </div>
          {/* BUSINESS SELLERS INFO CARD */}
          <div 
            id="section-sellers-brands" 
            className="w-full bg-white rounded-2xl border border-[#eef2f6] p-5 shadow-sm relative overflow-hidden flex flex-col justify-between text-center shrink-0 mx-auto" 
            style={{ height: '410px' }}
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#EB4501]/5 to-[#1A1D4E]/5 rounded-full blur-2xl pointer-events-none" />
            
            <div className="flex flex-col items-center">
              <div className="w-10 h-10 rounded-full bg-[#EB4501]/10 text-[#EB4501] flex items-center justify-center mb-3 border border-[#EB4501]/5 shrink-0 shadow-sm">
                <Sparkles className="w-5 h-5" />
              </div>
              
              <h3 className="font-sans text-sm font-semibold uppercase tracking-tight text-[#1A1D4E] leading-snug">
                For Brands <span className="text-[#EB4501] italic">& Agencies</span>
              </h3>
              
              <p className="text-[11px] text-gray-400 font-semibold mt-2 px-1 leading-relaxed max-w-[220px]">
                Unlock seamless campaign briefs, secure direct responses, and target key influencers in Bangladesh.
              </p>
            </div>

            <div className="border border-dashed border-[#EB4501]/20 bg-gradient-to-b from-[#FFF0E8]/20 to-white rounded-2xl p-4 text-center flex flex-col items-center justify-center my-2 flex-1">
              <h4 className="font-sans font-semibold text-gray-900 text-xs uppercase tracking-wider mb-1 leading-none">POST CAMPAIGN BRIEFS</h4>
              <p className="text-[10px] text-gray-500 mb-4 leading-relaxed max-w-[210px] font-semibold">
                Submit campaign details to top ranking tech, fashion, lifestyle, and financial creators.
              </p>
              
              <Link 
                to="/post-offer" 
                className="w-full py-2.5 bg-[#EB4501] hover:bg-[#CF4400] text-white font-semibold rounded-lg text-[10px] uppercase tracking-wider flex items-center justify-center gap-2 transition-colors shadow-sm"
              >
                POST BRIEF <PenTool className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="flex items-center justify-center gap-1 text-[8.5px] font-semibold text-gray-400 uppercase font-mono tracking-widest shrink-0">
              <Users className="w-3.5 h-3.5 text-gray-400" /> 100k+ shoppers daily
            </div>
          </div>

          <ListingAdRail
            sponsoredPlacementKey={PLACEMENT_KEYS.SIDEBAR_PORTRAIT}
            sponsoredVariant="portrait"
            showAdSense={false}
          />
        </aside>

        {/* Main Content Area */}
        <main id="creators-main-display" className="choosify-middle-feed scroll-mt-36 min-w-0 pb-10 space-y-6">
          <ListingFeedHeader
            eyebrow="Our partners • Creator directory"
            title={
              `${activeTab === 'All Creators' ? 'All Creators' : activeTab}` +
              (selectedLetter ? ` · Starting with “${selectedLetter}”` : '') +
              (searchQuery ? ` · “${searchQuery}”` : '')
            }
            count={filteredCreators.length}
            showingFrom={filteredCreators.length > 0 ? 1 : 0}
            showingTo={Math.min(visibleCount, filteredCreators.length)}
            itemLabel="creators"
            actions={
              (selectedLetter || searchQuery || activeTab !== 'All Creators' || selectedCategory || verificationFilter !== 'all' || popularityFilter !== 'all') ? (
                <button
                  type="button"
                  onClick={() => {
                    setSelectedLetter(null);
                    setSearchQuery('');
                    setActiveTab('All Creators');
                    setSelectedCategory(null);
                    setVerificationFilter('all');
                    setPopularityFilter('all');
                  }}
                  className="text-[9.5px] font-black text-orange-primary uppercase tracking-widest hover:underline flex items-center gap-1.5 transition-all bg-white border border-[#eef2f6] px-3.5 py-2 rounded-2xl shadow-sm hover:text-[#CF4400] cursor-pointer"
                >
                  Reset All Filters
                </button>
              ) : null
            }
          />

          {/* Active Filter Chips */}
          {(selectedLetter || selectedCategory || verificationFilter !== 'all' || popularityFilter !== 'all') && (
            <div className="flex flex-wrap items-center gap-3 font-sans">
              {selectedLetter && (
                <div className="flex items-center gap-2 px-4 py-2 bg-white border border-[#eef2f6] rounded-2xl text-[10px] font-black text-navy uppercase tracking-widest shadow-sm">
                  Letter: {selectedLetter} 
                  <span className="text-orange-primary cursor-pointer font-black ml-1 scale-110" onClick={() => setSelectedLetter(null)}>Ã—</span>
                </div>
              )}
              {selectedCategory && (
                <div className="flex items-center gap-2 px-4 py-2 bg-white border border-[#eef2f6] rounded-2xl text-[10px] font-black text-navy uppercase tracking-widest shadow-sm">
                  Niche: {selectedCategory} 
                  <span className="text-orange-primary cursor-pointer font-black ml-1 scale-110" onClick={() => setSelectedCategory(null)}>Ã—</span>
                </div>
              )}
              {verificationFilter !== 'all' && (
                <div className="flex items-center gap-2 px-4 py-2 bg-white border border-[#eef2f6] rounded-2xl text-[10px] font-black text-navy uppercase tracking-widest shadow-sm">
                  Verification: {verificationFilter === 'verified' ? 'Verified Experts' : 'Independent'} 
                  <span className="text-orange-primary cursor-pointer font-black ml-1 scale-110" onClick={() => setVerificationFilter('all')}>Ã—</span>
                </div>
              )}
              {popularityFilter !== 'all' && (
                <div className="flex items-center gap-2 px-4 py-2 bg-white border border-[#eef2f6] rounded-2xl text-[10px] font-black text-navy uppercase tracking-widest shadow-sm">
                  Engagement: {popularityFilter === 'high' ? 'Top Engagement' : 'Regular'} 
                  <span className="text-orange-primary cursor-pointer font-black ml-1 scale-110" onClick={() => setPopularityFilter('all')}>Ã—</span>
                </div>
              )}
            </div>
          )}

          {/* Tablet/Mobile Collapsible A-Z Filter Card */}
          <div className="lg:hidden bg-white rounded-2xl p-4 border border-[#eef2f6] shadow-sm mb-6 font-sans">
            <div 
              className="flex items-center justify-between cursor-pointer" 
              onClick={() => setIsMobileFilterOpen(!isMobileFilterOpen)}
            >
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-1.5 leading-none">
                  <Filter size={11} className="text-[#EB4501]" />
                  FILTER BY INITIAL:
                </span>
                <span className="px-2 py-0.5 bg-[#EB4501]/10 text-[#EB4501] text-[9px] font-black uppercase rounded-[3px] leading-none">
                  {selectedLetter === null ? 'All' : selectedLetter}
                </span>
              </div>
              <span className="text-[9.5px] font-black text-[#EB4501] uppercase tracking-widest">
                {isMobileFilterOpen ? 'Hide' : 'Show A-Z'}
              </span>
            </div>
            
            {isMobileFilterOpen && (
              <div className="mt-4 pt-4 border-t border-gray-100/80">
                <div className="grid grid-cols-6 sm:grid-cols-9 gap-1.5">
                  <button 
                    onClick={() => {
                      setSelectedLetter(null);
                      setIsMobileFilterOpen(false);
                    }}
                    className={cn(
                      "col-span-6 sm:col-span-9 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all text-center cursor-pointer",
                      selectedLetter === null ? "bg-orange-primary text-white shadow-lg shadow-orange-primary/10" : "bg-gray-50 text-gray-400 hover:bg-gray-100"
                    )}
                  >
                    All Creators
                  </button>
                  {letters.map((letter) => (
                    <button 
                      key={letter} 
                      onClick={() => {
                        setSelectedLetter(letter);
                        setIsMobileFilterOpen(false);
                      }}
                      className={cn(
                        "h-8 rounded-2xl text-[10px] font-black transition-all flex items-center justify-center uppercase cursor-pointer",
                        selectedLetter === letter ? "bg-orange-primary text-white shadow-md shadow-orange-primary/10" : "bg-gray-50 text-gray-400 hover:text-navy hover:bg-gray-100/70"
                      )}
                    >
                      {letter}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="bg-[#DCFCE7] text-[#166534] rounded-lg px-[18px] py-3 text-[12.5px] font-semibold mb-5">
            ✓ Trusted & Verified — All creators are verified by Choosify for authenticity and quality.
          </div>

          {filteredCreators.length > 0 ? (
            <>
              <div className={cn(CREATOR_CARD_GRID, 'mb-8')}>
                {visibleCreatorFeed.map((entry) =>
                  entry.kind === 'placement' ? (
                    <AdvertiseHereCard key={entry.key} variant="creator" />
                  ) : (
                    <CreatorCardDesign key={entry.key} creator={entry.item} />
                  ),
                )}
                {infeedPlacements.length === 0 && <AdvertiseHereCard variant="creator" />}
              </div>
              <div ref={sentinelRef} className="h-8" aria-hidden />
              {hasMore && (
                <p className="text-center text-[12px] text-[#9AA0AC] font-semibold py-4">Loading more…</p>
              )}
            </>
          ) : null}

          <div className="choosify-dark-surface rounded-xl px-7 py-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-white mb-8">
            <div>
              <div className="text-[15px] font-bold mb-1">Are you a creator?</div>
              <div className="text-[12px] text-white/55">
                Join Choosify and grow your audience by sharing honest reviews.
              </div>
            </div>
            <Link
              to="/advertise"
              className="bg-[#EB4501] text-white px-[22px] py-3 rounded-lg text-[12px] font-bold no-underline hover:brightness-110 shrink-0"
            >
              JOIN AS CREATOR
            </Link>
          </div>

          <AdSenseSlot format="infeed" className="mt-6" />

          {filteredCreators.length === 0 && (
             <div className="py-20 text-center">
                <Search size={48} className="mx-auto text-gray-300 mb-4" />
                <h3 className="text-xl font-extrabold text-[#1A1A2E] tracking-tight mb-2">No creators found</h3>
                <p className="text-gray-400 font-medium">Try searching for a different creator name or clear filters.</p>
                <button 
                  onClick={() => {setSearchQuery(''); setSelectedLetter(null);}}
                  className="mt-6 px-8 py-3 bg-navy text-white text-xs font-black uppercase rounded-xl shadow-lg animate-none"
                >
                  Clear All Filters
                </button>
             </div>
          )}
        </main>

        {/* RIGHT SIDEBAR WITH SPONSOR & SELLERS CARD */}
        <aside className="hidden lg:flex flex-col gap-4 lg:sticky lg:top-24 pb-10 pr-2 flex-shrink-0 animate-fade-in">
          {/* FEATURED CREATOR DEALS SECTION */}
          <div className="bg-white rounded-2xl border border-[#eef2f6] p-4.5 shadow-sm w-full text-left animate-fade-in">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#eef2f6] px-1">
              <h3 className="text-[11px] font-semibold text-[#8a9bb0] uppercase tracking-wider">
                Featured Campaigns
              </h3>
              <Link 
                to="/creators" 
                className="text-[10px] font-bold text-orange-primary hover:underline flex items-center gap-1"
              >
                See All →
              </Link>
            </div>

            <div className="flex flex-col gap-2.5">
              {CREATOR_COLLABS.map((item) => (
                <Link 
                  to={`/creators/${item.id}`}
                  key={item.id} 
                  className="flex items-center gap-3 bg-white border border-[#eef2f6]/60 rounded-2xl p-2 hover:shadow-soft hover:border-[#EB4501]/10 transition-all duration-300 group cursor-pointer"
                >
                  <div className={cn("w-9 h-9 rounded-lg overflow-hidden shrink-0 border border-transparent flex items-center justify-center text-white font-semibold text-xs shadow-sm")}>
                    <img src={item.avatar} className="w-full h-full object-cover" alt={item.name} referrerPolicy="no-referrer" />
                  </div>
                  <div className="flex-1 min-w-0 flex flex-col justify-center text-left">
                    <h4 className="font-sans text-xs font-semibold uppercase tracking-tight text-[#1A1D4E] group-hover:text-[#CF4400] transition-colors truncate">
                      {item.name}
                    </h4>
                    <p className="text-[9px] font-semibold text-gray-400 mt-0.5 truncate uppercase">
                      {item.highlight}
                    </p>
                  </div>
                  <span className="text-[8px] font-bold text-[#EB4501] uppercase tracking-wider shrink-0 whitespace-nowrap group-hover:-translate-x-0.5 transition-transform">
                    View
                  </span>
                </Link>
              ))}
            </div>
          </div>

          {/* FEATURED PROMOCODES SECTION */}
          <div className="bg-white rounded-2xl border border-[#eef2f6] p-4.5 shadow-sm w-full text-left animate-fade-in">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#eef2f6] px-1">
              <h3 className="text-[11px] font-semibold text-[#8a9bb0] uppercase tracking-wider">
                Creator Promo Codes
              </h3>
            </div>

            <div className="flex flex-col gap-2.5">
              {CREATOR_PROMOS.map((item, idx) => (
                <Link 
                  to={`/creators/${item.creatorId}`}
                  key={idx} 
                  className="bg-white border border-[#eef2f6]/65 hover:border-[#EB4501]/15 rounded-2xl p-2.5 hover:shadow-soft transition-all duration-300 group cursor-pointer flex flex-col gap-2 text-left"
                >
                  {/* Header row with brand details */}
                  <div className="flex items-center justify-between gap-2">
                    <div className="min-w-0">
                      <h4 className="font-sans text-xs font-semibold uppercase tracking-tight text-[#1A1D4E] group-hover:text-[#CF4400] transition-colors truncate">
                        {item.creatorName}
                      </h4>
                      <span className="text-[9px] font-bold text-[#EB4501] uppercase tracking-wide">
                        {item.discount}
                      </span>
                    </div>
                    
                    {/* Copy button */}
                    <button 
                      onClick={(e) => {
                        e.preventDefault(); // prevent follow Link navigation
                        e.stopPropagation(); // prevent card container click handler
                        navigator.clipboard.writeText(item.code);
                        toast.success(`Coupon code "${item.code}" copied to clipboard!`);
                      }}
                      className="px-2.5 py-1 bg-[#EB4501]/10 hover:bg-[#CF4400] text-[#EB4501] hover:text-white transition-all cursor-pointer rounded-2xl text-[8px] font-bold uppercase tracking-wider flex items-center gap-1 shrink-0"
                    >
                      <Copy className="w-2.5 h-2.5" />
                      Copy
                    </button>
                  </div>
                  
                  {/* Code display window */}
                  <div className="bg-gray-50 border border-dashed border-[#eef2f6] rounded-2xl px-2.5 py-1.5 flex items-center justify-between font-mono text-[9.5px] font-semibold text-gray-650 tracking-wider">
                    <span>{item.code}</span>
                    <span className="text-[7.5px] font-sans font-semibold text-gray-400 uppercase">ACTIVE</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          <AdSenseSlot format="sidebar" />

        </aside>
      </div>
    </div>
  );
}
