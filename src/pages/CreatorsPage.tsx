import React, { useState, useMemo } from 'react';
import { PAGE_LISTING_SINGLE_SHELL, CREATOR_CARD_GRID } from "../lib/pageLayout";
import { useSectionScrollSpy } from '../hooks/useSectionScrollSpy';
import { Search, Star, Filter, ArrowRight, ExternalLink, ChevronLeft, ChevronRight, CheckCircle2, ShoppingBag, Youtube, Twitter, Facebook, Instagram, Sparkles, PenTool, Users, Heart, Eye, Share2, Flame, Zap, Layers, Award, Gift, Copy } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, Star, CheckCircle2, ChevronDown, ChevronLeft, ChevronRight, 
  Users, Laptop, Sparkles, Camera, Box, Tag, ArrowRight, Grid, List, 
  X, Check, FileText, Sparkle, HelpCircle, ShieldCheck
} from 'lucide-react';
import { CREATORS, Creator } from '../data/creators';
import { CreatorCard } from '../components/CreatorCard';
import { toast } from 'react-hot-toast';
import type { Creator } from '../data/creators';
import { DragScrollContainer, UniversalFilterRenderer, QuickFilterBar, ActiveFilterChips, FullSidebarFilterPanel, useRegisterPageFilters } from '../components/FilterEngine';
import { CreatorCardDesign } from '../components/CreatorCardDesign';
import { DcListingHero } from '../components/design/DcListingHero';
import { DcListingStickyFilters } from '../components/design/DcListingStickyFilters';
import { useInfiniteListBatch } from '../hooks/useInfiniteListBatch';
import { ListingAdRail } from '../components/ListingAdRail';
import { AdSenseSlot } from '../components/AdSenseSlot';
import { AdvertiseHereCard } from '../components/commerce/AdvertiseHereCard';
import { usePlacements } from '../hooks/usePlacements';
import { PLACEMENT_KEYS, INFEED_INTERVAL, INFEED_MAX_PER_PAGE } from '../lib/placements';
import { injectPlacementsIntoFeed } from '../utils/injectFeedPlacements';

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
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSort, setSelectedSort] = useState('Most Popular');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  
  // Dropdown states
  const [nicheDropdown, setNicheDropdown] = useState('All Niches');
  const [platformDropdown, setPlatformDropdown] = useState('Platform');
  const [countryDropdown, setCountryDropdown] = useState('Country');
  
  // Toggle states
  const [verifiedOnly, setVerifiedOnly] = useState(true);
  const [hasReviews, setHasReviews] = useState(true);

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
      let isHot = c.score >= 95;
      let isFeatured = c.score >= 90;

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
        isFeatured
      };
    });
  }, [allCreators]);

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

    return result;
  }, [mappedCreators, searchQuery, selectedLetter, activeTab, selectedCategory, verificationFilter, popularityFilter]);

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
          <Search size={13} className="text-[#FF5B00]" />
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search creators..."
          className="w-full h-9 pl-8 pr-3 bg-white border border-[#eef2f6] rounded-2xl text-[11px] font-semibold text-[#1A1D4E] placeholder-gray-400 focus:outline-none focus:border-[#E8500A]/50 transition-colors"
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
      <div className="flex flex-col gap-4 mt-4">
        <UniversalFilterRenderer
          profile={{
            entity: 'creators',
            filters: [
              {
                id: 'expertise',
                name: 'Expertise',
                type: 'single_select',
                options: [
                  { value: 'all', label: 'All Expertise' },
                  { value: 'tech', label: 'Tech & Gadgets' },
                  { value: 'fashion', label: 'Fashion & Beauty' },
                  { value: 'lifestyle', label: 'Lifestyle' }
                ]
              },
              {
                id: 'platforms',
                name: 'Platforms',
                type: 'multi_select',
                options: [
                  { value: 'youtube', label: 'YouTube' },
                  { value: 'instagram', label: 'Instagram' },
                  { value: 'tiktok', label: 'TikTok' }
                ]
              },
              {
                id: 'followers',
                name: 'Followers',
                type: 'single_select',
                options: [
                  { value: '1M+', label: '1M+ Followers' },
                  { value: '500k+', label: '500k+ Followers' },
                  { value: '100k+', label: '100k+ Followers' }
                ]
              },
              {
                id: 'verified',
                name: 'Verified Status',
                type: 'single_select',
                options: [
                  { value: 'verified', label: 'Verified Only' },
                  { value: 'all', label: 'All Creators' }
                ]
              }
            ]
          }}
          activeFilters={{}}
          onFilterChange={() => {}}
        />
      </div>
    ),
    onClearAll: () => setSearchQuery('')
  }, [searchQuery]);

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
                <span className="text-gray-400">Sort by:</span>
                <span>{selectedSort}</span>
                <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
              </button>

              <AnimatePresence>
                {isSortOpen && (
                  <motion.div 
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 5 }}
                    className="absolute right-0 mt-1.5 w-44 bg-white border border-gray-200 rounded-xl shadow-lg py-1.5 z-40 text-left"
                  >
                    {['Most Popular', 'Top Rated', 'High Engagement'].map((sortOption) => (
                      <button
                        key={sortOption}
                        onClick={() => {
                          setSelectedSort(sortOption);
                          setIsSortOpen(false);
                        }}
                        className="w-full px-4 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50 hover:text-[#FF5B00] transition-colors text-left border-0 cursor-pointer block"
                      >
                        {sortOption}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Grid vs List Toggles */}
            <div className="flex items-center gap-1.5 p-1 bg-white border border-gray-200 rounded-xl shadow-sm">
              <button 
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-lg transition-colors cursor-pointer border-0 outline-none ${viewMode === 'grid' ? 'bg-[#FF5B00]/10 text-[#FF5B00]' : 'text-gray-400 hover:text-gray-600'}`}
                title="Grid view"
              >
                <Grid className="w-4 h-4" />
              </button>
              <button 
                onClick={() => {
                  setViewMode('list');
                  toast.success('List mode activated!');
                }}
                className={`p-1.5 rounded-lg transition-colors cursor-pointer border-0 outline-none ${viewMode === 'list' ? 'bg-[#FF5B00]/10 text-[#FF5B00]' : 'text-gray-400 hover:text-gray-600'}`}
                title="List view"
              >
                <List className="w-4 h-4" />
              </button>
            </div>

          </div>

        </div>

        {/* CONTROLS ROW 2: Custom Dropdowns, Toggles & Clear */}
        <div className="flex flex-col lg:flex-row gap-4 items-stretch lg:items-center justify-between w-full shrink-0">
          
          {/* Custom Selector Dropdowns */}
          <div className="flex flex-wrap items-center gap-3">
            
            {/* Niche Dropdown */}
            <div className="relative">
              <button 
                onClick={() => setIsNicheOpen(!isNicheOpen)}
                onBlur={() => setTimeout(() => setIsNicheOpen(false), 200)}
                className="h-10 px-4 bg-white border border-gray-200 rounded-xl text-xs font-bold text-gray-600 flex items-center gap-2 shadow-sm cursor-pointer select-none border-0 outline-none"
              >
                <span>{nicheDropdown}</span>
                <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
              </button>
              <AnimatePresence>
                {isNicheOpen && (
                  <motion.div 
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 5 }}
                    className="absolute left-0 mt-1.5 w-48 bg-white border border-gray-200 rounded-xl shadow-lg py-1.5 z-40 text-left max-h-56 overflow-y-auto"
                  >
                    {['All Niches', 'Tech Reviewers', 'Fashion Creators', 'Lifestyle Creators', 'Unboxing Experts', 'Budget Finds'].map((opt) => (
                      <button
                        key={opt}
                        onClick={() => {
                          setNicheDropdown(opt);
                          setIsNicheOpen(false);
                        }}
                        className="w-full px-4 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50 hover:text-[#FF5B00] transition-colors text-left border-0 cursor-pointer block"
                      >
                        {opt}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Platform Dropdown */}
            <div className="relative">
              <button 
                onClick={() => setIsPlatformOpen(!isPlatformOpen)}
                onBlur={() => setTimeout(() => setIsPlatformOpen(false), 200)}
                className="h-10 px-4 bg-white border border-gray-200 rounded-xl text-xs font-bold text-gray-600 flex items-center gap-2 shadow-sm cursor-pointer select-none border-0 outline-none"
              >
                <span>{platformDropdown}</span>
                <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
              </button>
              <AnimatePresence>
                {isPlatformOpen && (
                  <motion.div 
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 5 }}
                    className="absolute left-0 mt-1.5 w-44 bg-white border border-gray-200 rounded-xl shadow-lg py-1.5 z-40 text-left"
                  >
                    {['Platform', 'YouTube', 'Instagram', 'TikTok', 'Facebook'].map((opt) => (
                      <button
                        key={opt}
                        onClick={() => {
                          setPlatformDropdown(opt);
                          setIsPlatformOpen(false);
                        }}
                        className="w-full px-4 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50 hover:text-[#FF5B00] transition-colors text-left border-0 cursor-pointer block"
                      >
                        {opt === 'Platform' ? 'All Platforms' : opt}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Country Dropdown */}
            <div className="relative">
              <button 
                onClick={() => setIsCountryOpen(!isCountryOpen)}
                onBlur={() => setTimeout(() => setIsCountryOpen(false), 200)}
                className="h-10 px-4 bg-white border border-gray-200 rounded-xl text-xs font-bold text-gray-600 flex items-center gap-2 shadow-sm cursor-pointer select-none border-0 outline-none"
              >
                <span>{countryDropdown}</span>
                <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
              </button>
              <AnimatePresence>
                {isCountryOpen && (
                  <motion.div 
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 5 }}
                    className="absolute left-0 mt-1.5 w-44 bg-white border border-gray-200 rounded-xl shadow-lg py-1.5 z-40 text-left"
                  >
                    {['Country', 'Bangladesh'].map((opt) => (
                      <button
                        key={opt}
                        onClick={() => {
                          setCountryDropdown(opt);
                          setIsCountryOpen(false);
                        }}
                        className="w-full px-4 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50 hover:text-[#FF5B00] transition-colors text-left border-0 cursor-pointer block"
                      >
                        {opt === 'Country' ? 'All Countries' : opt}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Toggle verified with green badge */}
            <button
              onClick={() => setVerifiedOnly(!verifiedOnly)}
              className={`h-10 px-4 rounded-xl text-xs font-bold flex items-center gap-2 transition-all border shadow-sm cursor-pointer ${
                verifiedOnly 
                  ? 'bg-[#22C55E]/10 border-[#22C55E]/30 text-[#22C55E]' 
                  : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
              }`}
            >
              <Check className={`w-3.5 h-3.5 ${verifiedOnly ? 'text-[#22C55E]' : 'text-gray-400'}`} />
              Verified Only
            </button>

            {/* Toggle reviews with green badge */}
            <button
              onClick={() => setHasReviews(!hasReviews)}
              className={`h-10 px-4 rounded-xl text-xs font-bold flex items-center gap-2 transition-all border shadow-sm cursor-pointer ${
                hasReviews 
                  ? 'bg-[#22C55E]/10 border-[#22C55E]/30 text-[#22C55E]' 
                  : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
              }`}
            >
              <Check className={`w-3.5 h-3.5 ${hasReviews ? 'text-[#22C55E]' : 'text-gray-400'}`} />
              Has Reviews
            </button>

            {/* Clear All Filters Button */}
            {(activeTab !== 'All Creators' || searchQuery !== '' || nicheDropdown !== 'All Niches' || platformDropdown !== 'Platform' || countryDropdown !== 'Country' || verifiedOnly || hasReviews) && (
              <button
                onClick={handleClearAll}
                className="text-xs font-bold text-[#FF5B00] hover:text-[#EB4501] transition-colors ml-1 cursor-pointer"
              >
                Clear all
              </button>
            )}

          </div>

        </div>

        {/* FEED / CARDS GRID SECTION */}
        <div className="w-full">
          <AnimatePresence mode="popLayout">
            {filteredCreators.length === 0 ? (
              <motion.div 
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 15 }}
                className="py-16 text-center bg-white rounded-2xl border border-gray-200/80 shadow-sm"
              >
                <Search className="w-12 h-12 mx-auto text-gray-300 mb-4" />
                <h3 className="font-sans text-lg font-bold text-[#0E0F23]">No creators found</h3>
                <p className="text-xs text-gray-400 mt-2 max-w-sm mx-auto">Try refining your search queries or clearing active filters to see other results.</p>
                <button
                  onClick={handleClearAll}
                  className="mt-5 px-6 py-2.5 bg-[#FF5B00] text-white text-xs font-bold uppercase tracking-wider rounded-xl border-0 shadow-md hover:bg-[#FF5B00] transition-colors cursor-pointer"
                >
                  Clear All Filters
                </button>
              </motion.div>
            ) : (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className={
                  viewMode === 'grid' 
                    ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 w-full justify-center" 
                    : "flex flex-col gap-4 w-full"
                }
              >
                {filteredCreators.map((creator) => {
                  if (viewMode === 'grid') {
                    return <CreatorCard key={creator.id} creator={creator} />;
                  } else {
                    // Custom list-view row for high-craftsmanship list mode
                    return (
                      <Link 
                        to={`/creators/${creator.id}`}
                        key={creator.id}
                        className="flex flex-col md:flex-row items-center gap-5 bg-white p-5 rounded-2xl border border-gray-200/80 shadow-sm hover:shadow-md transition-all duration-200 text-left group"
                      >
                        <div className="w-20 h-20 rounded-full border-2 border-[#FF5B00]/10 overflow-hidden shrink-0 flex items-center justify-center bg-gray-50">
                          <img src={creator.avatar} className="w-full h-full object-cover" alt={creator.name} referrerPolicy="no-referrer" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5">
                            <h3 className="font-sans text-base font-bold text-[#0E0F23] group-hover:text-[#FF5B00] transition-colors">
                              {creator.name}
                            </h3>
                            <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0" />
                          </div>
                          <p className="text-xs text-gray-400 mt-0.5 font-semibold uppercase tracking-wider">{creator.bestFor}</p>
                          <p className="text-xs text-gray-500 mt-2 line-clamp-2 leading-relaxed max-w-2xl">{creator.bio}</p>
                        </div>
                        <div className="grid grid-cols-3 gap-6 shrink-0 text-center px-4 md:border-l border-gray-150">
                          <div>
                            <div className="text-sm font-extrabold text-[#0E0F23]">{creator.reviewsCount}</div>
                            <div className="text-[9px] font-semibold text-gray-400 uppercase">Reviews</div>
                          </div>
                          <div>
                            <div className="text-sm font-extrabold text-[#0E0F23]">{creator.followersCount}</div>
                            <div className="text-[9px] font-semibold text-gray-400 uppercase">Followers</div>
                          </div>
                          <div>
                            <div className="text-sm font-extrabold text-[#0E0F23]">{creator.trustScore}%</div>
                            <div className="text-[9px] font-semibold text-gray-400 uppercase">Trust Score</div>
                          </div>
                        </div>
                        <div className="shrink-0 flex items-center justify-center p-2.5">
                          <div className="w-10 h-10 rounded-full bg-gray-50 group-hover:bg-[#FF5B00]/10 group-hover:text-[#FF5B00] text-gray-400 flex items-center justify-center transition-all">
                            <ArrowRight className="w-4 h-4" />
                          </div>
                        </div>
                      </Link>
                    );
                  }
                })}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* PAGINATION ROW */}
        {filteredCreators.length > 0 && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-5 pt-8 border-t border-gray-200 mt-6 shrink-0 w-full">
            <span className="text-xs text-gray-500 font-semibold uppercase tracking-wider text-center sm:text-left">
              Showing 1-{filteredCreators.length} of {filteredCreators.length} creators
            </span>

            {/* Pagination Controls */}
            <div className="flex items-center gap-1.5">
              <button className="w-9 h-9 rounded-xl bg-white border border-gray-200 text-gray-400 hover:text-gray-600 flex items-center justify-center transition-colors cursor-pointer outline-none border-0 shadow-sm" disabled>
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button className="w-9 h-9 rounded-xl bg-[#FF5B00] text-white flex items-center justify-center text-xs font-bold cursor-pointer border-0 shadow-sm">
                1
              </button>
              <button className="w-9 h-9 rounded-xl bg-white border border-gray-200 text-gray-500 hover:text-gray-700 hover:border-gray-300 flex items-center justify-center text-xs font-bold cursor-pointer transition-colors outline-none border-0 shadow-sm">
                2
              </button>
              <button className="w-9 h-9 rounded-xl bg-white border border-gray-200 text-gray-500 hover:text-gray-700 hover:border-gray-300 flex items-center justify-center text-xs font-bold cursor-pointer transition-colors outline-none border-0 shadow-sm">
                3
              </button>
              <button className="w-9 h-9 rounded-xl bg-white border border-gray-200 text-gray-500 hover:text-gray-700 hover:border-gray-300 flex items-center justify-center text-xs font-bold cursor-pointer transition-colors outline-none border-0 shadow-sm">
                4
              </button>
              <span className="text-xs font-bold text-gray-400 px-1">...</span>
              <button className="w-9 h-9 rounded-xl bg-white border border-gray-200 text-gray-500 hover:text-gray-700 hover:border-gray-300 flex items-center justify-center text-xs font-bold cursor-pointer transition-colors outline-none border-0 shadow-sm">
                179
              </button>
              <button className="w-9 h-9 rounded-xl bg-white border border-gray-200 text-gray-500 hover:text-gray-700 flex items-center justify-center transition-colors cursor-pointer outline-none border-0 shadow-sm">
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Show per page dropdown */}
            <div className="relative">
              <button className="h-9 px-4 bg-white border border-gray-200 rounded-xl text-xs font-bold text-gray-600 flex items-center gap-1.5 shadow-sm select-none border-0 outline-none">
                <span className="text-gray-400">Show:</span>
                <span>12 per page</span>
                <ChevronDown className="w-3 h-3 text-gray-400" />
              </button>
            </div>
          </div>
        )}

        {/* POPULAR CREATOR SEARCHES */}
        <div className="w-full py-8 border-t border-gray-200 text-left mt-8 shrink-0">
          <h3 className="font-sans text-sm font-bold text-[#0E0F23] tracking-wide mb-4">
            Popular creator searches
          </h3>
          <div className="flex flex-wrap gap-2">
            {popularSearches.map((term, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setSearchQuery(term);
                  toast.success(`Filtering for: ${term}`);
                }}
                className="px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-[11px] font-bold text-gray-600 hover:text-[#FF5B00] hover:border-[#FF5B00]/40 hover:bg-[#FF5B00]/5 transition-all shadow-sm cursor-pointer select-none border-0"
              >
                🔍 &nbsp; {term}
              </button>
            ))}
          </div>
        </div>

  return (
    <div className="flex flex-col min-h-screen bg-[#F4F7F9]">
      <DcListingHero
        titleBefore="Follow Trusted"
        titleHighlight="Creators"
        searchPlaceholder="Search creators..."
        quickChips={['Tech', 'Fashion', 'Beauty', 'Food', 'Lifestyle', 'Gaming']}
        onSearch={(q) => setSearchQuery(q)}
        onChipClick={(q) => setSearchQuery(q)}
      />

      <DcListingStickyFilters
        overlapHero
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

      {/* ACTIVE FILTER CHIPS ROW */}
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

      <div className={`max-w-[1680px] mx-auto px-4 sm:px-5 lg:px-6 xl:px-8 py-10 md:py-12 w-full ${PAGE_LISTING_SINGLE_SHELL}`}>
        
        {/* Left Sidebar */}
        <aside className="hidden lg:flex flex-col gap-4 lg:sticky lg:top-24 pb-10 flex-shrink-0 animate-fade-in text-left">
          {/* LEFT COLUMN SEARCH BAR */}
          <div className="relative">
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
              <Search size={13} className="text-[#E8500A]" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search creators..."
              className="w-full h-9 pl-8 pr-3 bg-white border border-[#eef2f6] rounded-2xl text-[11px] font-semibold text-[#1A1D4E] placeholder-gray-400 focus:outline-none focus:border-[#E8500A]/50 transition-colors shadow-sm"
            />
          </div>

          {/* LAYER 2: FULL SIDEBAR FILTER PANEL */}
          <div id="creators-sidebar-filters" className="transition-all duration-300 rounded-2xl w-full">
            <FullSidebarFilterPanel
              title="Filter Creators"
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              searchPlaceholder="Search creators, niche, handle or bio..."
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
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#E8500A]/5 to-[#1A1D4E]/5 rounded-full blur-2xl pointer-events-none" />
            
            <div className="flex flex-col items-center">
              <div className="w-10 h-10 rounded-full bg-[#E8500A]/10 text-[#E8500A] flex items-center justify-center mb-3 border border-[#E8500A]/5 shrink-0 shadow-sm">
                <Sparkles className="w-5 h-5" />
              </div>
              
              <h3 className="font-sans text-sm font-semibold uppercase tracking-tight text-[#1A1D4E] leading-snug">
                For Brands <span className="text-[#E8500A] italic">& Agencies</span>
              </h3>
              
              <p className="text-[11px] text-gray-400 font-semibold mt-2 px-1 leading-relaxed max-w-[220px]">
                Unlock seamless campaign briefs, secure direct responses, and target key influencers in Bangladesh.
              </p>
            </div>

            <div className="border border-dashed border-[#E8500A]/20 bg-gradient-to-b from-[#FFF0E8]/20 to-white rounded-2xl p-4 text-center flex flex-col items-center justify-center my-2 flex-1">
              <h4 className="font-sans font-semibold text-gray-900 text-xs uppercase tracking-wider mb-1 leading-none">POST CAMPAIGN BRIEFS</h4>
              <p className="text-[10px] text-gray-500 mb-4 leading-relaxed max-w-[210px] font-semibold">
                Submit campaign details to top ranking tech, fashion, lifestyle, and financial creators.
              </p>
              
              <Link 
                to="/post-offer" 
                className="w-full py-2.5 bg-[#E8500A] hover:bg-[#CF4400] text-white font-semibold rounded-lg text-[10px] uppercase tracking-wider flex items-center justify-center gap-2 transition-colors shadow-sm"
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
          {/* Header info bar (Unified list view) */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#eef2f6] font-sans">
            <div>
              <h3 className="text-[10px] font-bold text-[#8a9bb0] uppercase tracking-[0.2em] leading-none">
                Our partners • Creator directory
              </h3>
              <h2 className="text-xl font-black text-[#1A1D4E] tracking-tight mt-2 leading-none">
                {activeTab === 'All Creators' ? 'All Creators' : activeTab}
                {selectedLetter && ` · Starting with “${selectedLetter}”`}
                {searchQuery && ` · “${searchQuery}”`}
                <span className="text-[#8a9bb0] font-semibold"> ({filteredCreators.length})</span>
              </h2>
              <p className="text-xs md:text-[13px] text-gray-300 font-medium mt-2 leading-relaxed">
                Join Choosify and grow your audience by sharing honest reviews and helping people make better choices.
              </p>
            </div>
            
            {(selectedLetter || searchQuery || activeTab !== 'All Creators' || selectedCategory || verificationFilter !== 'all' || popularityFilter !== 'all') && (
              <button 
                onClick={() => {
                  setSelectedLetter(null); 
                  setSearchQuery(''); 
                  setActiveTab('All Creators');
                  setSelectedCategory(null);
                  setVerificationFilter('all');
                  setPopularityFilter('all');
                }}
                className="text-[9.5px] font-black text-orange-primary uppercase tracking-widest hover:underline flex items-center gap-1.5 transition-all bg-white border border-[#eef2f6] px-3.5 py-2 rounded-2xl shadow-sm self-start sm:self-auto hover:text-[#CF4400] cursor-pointer"
              >
                Reset All Filters
              </button>
            )}
          </div>

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
                  <Filter size={11} className="text-[#E8500A]" />
                  FILTER BY INITIAL:
                </span>
                <span className="px-2 py-0.5 bg-[#E8500A]/10 text-[#E8500A] text-[9px] font-black uppercase rounded-[3px] leading-none">
                  {selectedLetter === null ? 'All' : selectedLetter}
                </span>
              </div>
              <span className="text-[9.5px] font-black text-[#E8500A] uppercase tracking-widest">
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

          <div className="bg-[#000435] rounded-xl px-7 py-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-white mb-8">
            <div>
              <div className="text-[15px] font-bold mb-1">Are you a creator?</div>
              <div className="text-[12px] text-white/55">
                Join Choosify and grow your audience by sharing honest reviews.
              </div>
            </div>
            <Link
              to="/advertise"
              className="bg-[#FF5B00] text-white px-[22px] py-3 rounded-lg text-[12px] font-bold no-underline hover:brightness-110 shrink-0"
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
                  className="flex items-center gap-3 bg-white border border-[#eef2f6]/60 rounded-2xl p-2 hover:shadow-soft hover:border-[#E8500A]/10 transition-all duration-300 group cursor-pointer"
                >
                  <div className={cn("w-9 h-9 rounded-lg overflow-hidden shrink-0 border border-transparent flex items-center justify-center text-white font-semibold text-xs shadow-sm")}>
                    <img src={item.avatar} className="w-full h-full object-cover" alt={item.name} referrerPolicy="no-referrer" />
                  </div>
                  <div className="flex-1 min-w-0 flex flex-col justify-center text-left">
                    <h4 className="font-sans text-xs font-semibold uppercase tracking-tight text-[#1A1D4E] group-hover:text-[#E8500A] transition-colors truncate">
                      {item.name}
                    </h4>
                    <p className="text-[9px] font-semibold text-gray-400 mt-0.5 truncate uppercase">
                      {item.highlight}
                    </p>
                  </div>
                  <span className="text-[8px] font-bold text-[#E8500A] uppercase tracking-wider shrink-0 whitespace-nowrap group-hover:-translate-x-0.5 transition-transform">
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
                  className="bg-white border border-[#eef2f6]/65 hover:border-[#E8500A]/15 rounded-2xl p-2.5 hover:shadow-soft transition-all duration-300 group cursor-pointer flex flex-col gap-2 text-left"
                >
                  {/* Header row with brand details */}
                  <div className="flex items-center justify-between gap-2">
                    <div className="min-w-0">
                      <h4 className="font-sans text-xs font-semibold uppercase tracking-tight text-[#1A1D4E] group-hover:text-[#E8500A] transition-colors truncate">
                        {item.creatorName}
                      </h4>
                      <span className="text-[9px] font-bold text-[#E8500A] uppercase tracking-wide">
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
                      className="px-2.5 py-1 bg-[#E8500A]/10 hover:bg-[#E8500A] text-[#E8500A] hover:text-white transition-all cursor-pointer rounded-2xl text-[8px] font-bold uppercase tracking-wider flex items-center gap-1 shrink-0"
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
