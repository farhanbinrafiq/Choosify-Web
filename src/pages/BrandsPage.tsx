import React, { useState, useEffect, useMemo } from 'react';
import { Search, Star, Filter, ArrowRight, ExternalLink, ChevronLeft, ChevronRight, CheckCircle2, ShoppingBag, Youtube, Twitter, Facebook, Instagram, Sparkles, PenTool, Users, Heart, Eye, Share2, Flame, Zap, Layers, Award, Gift, Copy, X, Store } from 'lucide-react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { cn } from '../lib/utils';
import { useGlobalState } from '../context/GlobalStateContext';
import { toast } from '../lib/notify';
import { DragScrollContainer, UniversalFilterRenderer, QuickFilterBar, ActiveFilterChips, FullSidebarFilterPanel, useRegisterPageFilters } from '../components/FilterEngine';
import { BrandCardDesign } from '../components/BrandCardDesign';
import { ListingBrowseControls } from '../components/design/ListingBrowseControls';
import { ListingFeedHeader } from '../components/design/ListingFeedHeader';
import { ListingFilterPills } from '../components/design/ListingFilterPills';
import { LISTING_PAGE_MAX_WIDTH } from '../lib/design/dcListingTokens';
import { useInfiniteListBatch } from '../hooks/useInfiniteListBatch';
import { ListingAdRail } from '../components/ListingAdRail';
import { AdSenseSlot } from '../components/AdSenseSlot';
import { AdvertiseHereCard } from '../components/commerce/AdvertiseHereCard';
import { usePlacements } from '../hooks/usePlacements';
import { PLACEMENT_KEYS, INFEED_INTERVAL, INFEED_MAX_PER_PAGE } from '../lib/placements';
import { injectPlacementsIntoFeed } from '../utils/injectFeedPlacements';
import {BRAND_CARD_GRID, PAGE_LISTING_SINGLE_SHELL } from "../lib/pageLayout";
import { useSectionScrollSpy } from '../hooks/useSectionScrollSpy';
import { rankBrands } from '../utils/listingRanking';
import { usePriorityClockMs } from '../hooks/usePriorityClockMs';

interface BrandDeal {
  id: string;
  name: string;
  dealHighlight: string;
  logo: string;
  bgClass: string;
}

const BRAND_DEALS: BrandDeal[] = [
  { id: 'aarong', name: "Aarong", dealHighlight: "Flat 15% OFF on Handicrafts", logo: "Aa", bgClass: "bg-orange-primary/95" },
  { id: 'apex', name: "Apex", dealHighlight: "Buy 1 Get 1 Free on Select Shoes", logo: "A", bgClass: "bg-navy" },
  { id: 'sailor', name: "Sailor", dealHighlight: "Flat 20% OFF on Casual Wear", logo: "S", bgClass: "bg-teal-700" },
  { id: 'adidas', name: "Adidas", dealHighlight: "Extra 10% OFF on Sportswear", logo: "Ad", bgClass: "bg-[#1A1D4E]" },
  { id: 'bay', name: "Bay Emporium", dealHighlight: "Up to 30% OFF on Leather Boots", logo: "B", bgClass: "bg-red-700" }
];

interface PromoCode {
  brandId: string;
  brandName: string;
  code: string;
  discount: string;
}

const PROMO_CODES: PromoCode[] = [
  { brandId: 'aarong', brandName: "Aarong", code: "AARONG15", discount: "Flat 15% OFF" },
  { brandId: 'apex', brandName: "Apex", code: "APEXFOOT26", discount: "BDT 500 FLAT" },
  { brandId: 'sailor', brandName: "Sailor", code: "SAILOREID", discount: "Flat 20% OFF" },
  { brandId: 'adidas', brandName: "Adidas", code: "ADIEXTRA10", discount: "10% FLAT OFF" }
];

interface Brand {
  id: string;
  name: string;
  description: string;
  logo: string;
  rating: number;
  reviews: number;
  bestFor: string;
  priceRange: string;
  recommended: string;
  category: string;
  isHot?: boolean;
  isFeatured?: boolean;
  createdAt?: string;
  updatedAt?: string;
  verifiedStatus?: boolean;
  followers?: number;
  sponsoredFlag?: boolean;
  featuredFlag?: boolean;
}

export function BrandsPage() {
  const { allBrands: globalBrands, getBrandClaimStatus } = useGlobalState();
  const [selectedLetter, setSelectedLetter] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('All Brands');
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [verificationFilter, setVerificationFilter] = useState<'all' | 'verified' | 'unverified'>('all');
  const [popularityFilter, setPopularityFilter] = useState<'all' | 'hot' | 'featured' | 'top-rated'>('all');
  const priorityNowMs = usePriorityClockMs();

  // Restore state from sessionStorage on mount
  useEffect(() => {
    try {
      const saved = sessionStorage.getItem('choosify_brands_filters');
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
  useEffect(() => {
    const filters = {
      selectedCategory,
      selectedLetter,
      verificationFilter,
      popularityFilter,
      activeTab
    };
    sessionStorage.setItem('choosify_brands_filters', JSON.stringify(filters));
  }, [selectedCategory, selectedLetter, verificationFilter, popularityFilter, activeTab]);

  const fallbackBrands: Brand[] = [
    {
      id: 'samsung',
      name: 'Samsung',
      description: 'Global Electronics and Mobile Leader',
      logo: 'S',
      rating: 4.8,
      reviews: 950,
      bestFor: 'Mobile & Gear',
      priceRange: '৳15000',
      recommended: '94%',
      category: 'Electronics',
      isHot: true
    },
    {
      id: 'apple',
      name: 'Apple',
      description: 'Premium Tech and Computing Systems',
      logo: 'A',
      rating: 4.9,
      reviews: 1450,
      bestFor: 'MacBook & iPhone',
      priceRange: '৳45000',
      recommended: '97%',
      category: 'Tech',
      isFeatured: true
    },
    {
      id: 'apex',
      name: 'Apex',
      description: 'Premium Footwear & Accessories',
      logo: 'Ap',
      rating: 4.7,
      reviews: 1250,
      bestFor: 'Footwear',
      priceRange: '৳1200',
      recommended: '92%',
      category: 'Fashion',
      isHot: true
    },
    {
      id: 'bata',
      name: 'Bata',
      description: 'Legacy Reliable Footwear for Generations',
      logo: 'B',
      rating: 4.6,
      reviews: 1100,
      bestFor: 'Casual Shoes',
      priceRange: '৳800',
      recommended: '89%',
      category: 'Fashion'
    },
    {
      id: 'sony',
      name: 'Sony',
      description: 'Elite Audio and Entertainment Systems',
      logo: 'So',
      rating: 4.7,
      reviews: 86,
      bestFor: 'Elite Audio',
      priceRange: '৳35000',
      recommended: '91%',
      category: 'Electronics',
      isFeatured: true
    },
    {
      id: 'sailor',
      name: 'Sailor',
      description: 'Contemporary Lifestyle & Ethnic Wear',
      logo: 'Sa',
      rating: 4.8,
      reviews: 640,
      bestFor: 'Casual Wear',
      priceRange: '৳800',
      recommended: '90%',
      category: 'Fashion',
      isFeatured: true
    },
    {
      id: 'yellow',
      name: 'Yellow',
      description: 'Trendy Contemporary High Fashion',
      logo: 'Y',
      rating: 4.5,
      reviews: 800,
      bestFor: 'Modern Apparel',
      priceRange: '৳1200',
      recommended: '88%',
      category: 'Fashion'
    },
    {
      id: 'pickaboo',
      name: 'Pickaboo',
      description: 'Tech Hub and Gadget Aggregator',
      logo: 'P',
      rating: 4.7,
      reviews: 540,
      bestFor: 'Gadgets',
      priceRange: '৳2000',
      recommended: '90%',
      category: 'Tech'
    },
    {
      id: 'ecstasy',
      name: 'Ecstasy',
      description: 'Urban Streetwear and Designer Clothing',
      logo: 'Ec',
      rating: 4.4,
      reviews: 210,
      bestFor: 'Streetwear',
      priceRange: '৳1500',
      recommended: '84%',
      category: 'Fashion'
    },
    {
      id: 'richman',
      name: 'Richman',
      description: 'Elite Gents Grooming Wear & Panjabis',
      logo: 'R',
      rating: 4.6,
      reviews: 310,
      bestFor: 'Mens Formalwear',
      priceRange: '৳2000',
      recommended: '88%',
      category: 'Fashion'
    },
    {
      id: 'star-tech',
      name: 'Star Tech',
      description: 'The Ultimate Tech Retail Outlet in Bangladesh',
      logo: 'ST',
      rating: 4.8,
      reviews: 1950,
      bestFor: 'PC Components',
      priceRange: '৳1500',
      recommended: '95%',
      category: 'Tech',
      isHot: true
    },
    {
      id: 'aarong',
      name: 'Aarong',
      description: 'Traditional Handcrafted Products',
      logo: 'Aa',
      rating: 4.9,
      reviews: 840,
      bestFor: 'Handcrafts',
      priceRange: '৳500',
      recommended: '95%',
      category: 'Fashion',
      isHot: true
    },
    {
      id: 'choosify',
      name: 'Choosify',
      description: 'Transparent Consumer Discovery & Marketplace Platform',
      logo: 'https://res.cloudinary.com/djdyqr8yd/image/upload/v1782468737/717067140_122103081177325182_5170626542063953926_n_fiefp6.jpg',
      rating: 5.0,
      reviews: 24,
      bestFor: 'Brand Discovery & Recommendations',
      priceRange: '৳0',
      recommended: '100%',
      category: 'Marketplace',
      isFeatured: true
    },
    {
      id: 'fff-sourcing-ltd',
      name: 'FFF Sourcing Ltd',
      description: 'Bangladesh Apparel Sourcing, Buying House & Compliance Management',
      logo: 'FFF',
      rating: 4.9,
      reviews: 15,
      bestFor: 'Garment Sourcing & Buying House',
      priceRange: 'Custom quotes',
      recommended: '98%',
      category: 'Sourcing',
      isHot: true
    }
  ];

  const brands: Brand[] = React.useMemo(() => {
    if (globalBrands && globalBrands.length > 0) {
      return globalBrands.map((brand) => ({
        id: String(brand.id),
        name: brand.name,
        description: `${brand.name} official listing on Choosify`,
        logo: typeof brand.logo === 'string' ? brand.logo : brand.name.slice(0, 2).toUpperCase(),
        rating: brand.ratings || 0,
        reviews: brand.followers || 0,
        followers: brand.followers || 0,
        bestFor: brand.category || 'General',
        priceRange: '৳500',
        recommended: `${Math.min(99, Math.max(70, Math.round((brand.ratings || 4) * 20)))}%`,
        category: brand.category || 'General',
        isHot: brand.sponsoredFlag,
        isFeatured: brand.featuredFlag,
        sponsoredFlag: brand.sponsoredFlag,
        featuredFlag: brand.featuredFlag,
        verifiedStatus: brand.verifiedStatus,
        createdAt: brand.createdAt,
        updatedAt: brand.updatedAt,
      }));
    }
    return fallbackBrands;
  }, [globalBrands]);

  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

  const dynamicCategories = React.useMemo(() => {
    const counts: { [name: string]: number } = {};
    brands.forEach(b => {
      const cat = b.category || 'Other';
      counts[cat] = (counts[cat] || 0) + 1;
    });
    return Object.entries(counts).map(([name, count]) => ({
      name,
      count
    }));
  }, [brands]);

  // Core reactive filtering logic for brand listing
  const filteredBrands = React.useMemo(() => {
    let result = [...brands];

    // 1. Filter by Active Tab selection
    if (activeTab === 'Trending Brands') {
      result = result.filter(b => b.isHot || b.rating >= 4.7);
    } else if (activeTab === 'Featured Brands') {
      result = result.filter(b => b.isFeatured || b.rating >= 4.8);
    } else if (activeTab === 'Hot Deals Brands') {
      result = result.filter(b => b.isHot);
    } else if (activeTab === 'Top Rated Brands') {
      result = result.filter(b => b.rating >= 4.8);
    }

    // 2. Filter by search query across Name, bestFor, category, or description
    const q = searchQuery.toLowerCase().trim();
    if (q) {
      result = result.filter(b => 
        b.name.toLowerCase().includes(q) ||
        (b.bestFor || '').toLowerCase().includes(q) ||
        (b.category || '').toLowerCase().includes(q) ||
        (b.description || '').toLowerCase().includes(q)
      );
    }

    // 3. Filter by Selected Letter
    if (selectedLetter) {
      result = result.filter(b => b.name.toUpperCase().startsWith(selectedLetter));
    }

    // 4. Filter by Category
    if (selectedCategory) {
      result = result.filter(b => b.category?.toLowerCase() === selectedCategory.toLowerCase());
    }

    // 5. Filter by Verification Status
    if (verificationFilter === 'verified') {
      result = result.filter(b => getBrandClaimStatus(b.id) === 'verified');
    } else if (verificationFilter === 'unverified') {
      result = result.filter(b => getBrandClaimStatus(b.id) !== 'verified');
    }

    // 6. Filter by Popularity Status
    if (popularityFilter === 'hot') {
      result = result.filter(b => b.isHot);
    } else if (popularityFilter === 'featured') {
      result = result.filter(b => b.isFeatured);
    } else if (popularityFilter === 'top-rated') {
      result = result.filter(b => b.rating >= 4.8);
    }

    return rankBrands(result, priorityNowMs);
  }, [brands, searchQuery, selectedLetter, activeTab, selectedCategory, verificationFilter, popularityFilter, getBrandClaimStatus, priorityNowMs]);

  const infeedPlacements = usePlacements(PLACEMENT_KEYS.INFEED_BRAND, {
    limit: INFEED_MAX_PER_PAGE,
  });

  const brandFeed = useMemo(
    () =>
      injectPlacementsIntoFeed(
        filteredBrands,
        (brand) => `brand-${brand.id}`,
        infeedPlacements,
        INFEED_INTERVAL.brand,
        3,
      ),
    [filteredBrands, infeedPlacements],
  );

  const {
    visibleItems: visibleBrandFeed,
    sentinelRef,
    hasMore,
    visibleCount,
  } = useInfiniteListBatch(brandFeed, {
    initial: 24,
    loadMore: 12,
    resetKey: searchQuery + (selectedLetter ?? ''),
  });

  const sectionNavItems = useMemo(
    () => [{ id: 'brands-main-display', label: 'Directory', icon: <Store size={13} /> }],
    [],
  );
  const { activeId: activeSectionId, scrollToSection } = useSectionScrollSpy(sectionNavItems);

  useRegisterPageFilters({
    pageName: 'Brands',
    renderSearch: () => (
      <div className="relative">
        <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
          <Search size={13} className="text-[#EB4501]" />
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by Brand Name or Category..."
          className="w-full h-9 pl-8 pr-3 bg-white border border-[#eef2f6] rounded-2xl text-[11px] font-semibold text-[#1A1D4E] placeholder-gray-400 focus:outline-none focus:border-[#EB4501]/50 transition-colors"
        />
      </div>
    ),
    quickFilters: [
      { id: 'verified', label: '✓ Verified Claims', active: verificationFilter === 'verified', onClick: () => setVerificationFilter(verificationFilter === 'verified' ? 'all' : 'verified') },
      { id: 'hot', label: 'ðŸ”¥ Hot Brands', active: popularityFilter === 'hot', onClick: () => setPopularityFilter(popularityFilter === 'hot' ? 'all' : 'hot') },
      { id: 'top-rated', label: '⭐ Top Rated', active: popularityFilter === 'top-rated', onClick: () => setPopularityFilter(popularityFilter === 'top-rated' ? 'all' : 'top-rated') },
      { id: 'fashion', label: 'ðŸ‘— Fashion Brands', active: selectedCategory === 'Fashion', onClick: () => setSelectedCategory(selectedCategory === 'Fashion' ? null : 'Fashion') },
      { id: 'tech', label: 'ðŸ’» Tech Devices', active: selectedCategory === 'Tech', onClick: () => setSelectedCategory(selectedCategory === 'Tech' ? null : 'Tech') }
    ],
    renderFilters: () => (
      <div className="flex flex-col gap-4">
        <UniversalFilterRenderer
          profile={{
            entity: 'brands',
            filters: [
              {
                id: 'category',
                name: 'Category Hub',
                type: 'single_select',
                options: [
                  { value: 'all', label: 'All Categories' },
                  ...dynamicCategories.map(cat => ({ value: cat.name, label: cat.name, count: cat.count }))
                ]
              },
              {
                id: 'verification',
                name: 'Verification Channel',
                type: 'single_select',
                options: [
                  { value: 'all', label: 'All Claim Statuses' },
                  { value: 'verified', label: 'Verified Claims Only' },
                  { value: 'unverified', label: 'Unverified Channels' }
                ]
              },
              {
                id: 'popularity',
                name: 'Popularity Tier',
                type: 'single_select',
                options: [
                  { value: 'all', label: 'All Tiers' },
                  { value: 'hot', label: 'ðŸ”¥ Hot Brands' },
                  { value: 'featured', label: '⭐ Featured' },
                  { value: 'top-rated', label: '✨ Top Rated (4.8+)' }
                ]
              }
            ]
          }}
          activeFilters={{
            category: selectedCategory || 'all',
            verification: verificationFilter,
            popularity: popularityFilter
          }}
          onFilterChange={(filterId, value) => {
            if (filterId === 'category') {
              setSelectedCategory(value === 'all' || !value ? null : value);
            } else if (filterId === 'verification') {
              setVerificationFilter(value as any);
            } else if (filterId === 'popularity') {
              setPopularityFilter(value as any);
            }
          }}
        />

        {/* Alpha search (A-Z) */}
        <div className="bg-white rounded-2xl p-4.5 border border-[#eef2f6] shadow-sm flex flex-col gap-2">
          <h3 className="text-[11px] font-black text-[#8a9bb0] uppercase tracking-wider mb-2">Alpha search (A-Z)</h3>
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
            {letters.map((letter) => (
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
    scrollTargetId: 'brands-main-display',
    activeFilterCount: (selectedCategory ? 1 : 0) +
      (selectedLetter ? 1 : 0) +
      (verificationFilter !== 'all' ? 1 : 0) +
      (popularityFilter !== 'all' ? 1 : 0) +
      (searchQuery ? 1 : 0),
    onClearAll: () => {
      setSelectedLetter(null); 
      setSearchQuery(''); 
      setActiveTab('All Brands');
      setSelectedCategory(null);
      setVerificationFilter('all');
      setPopularityFilter('all');
    },
    sectionNav: {
      items: sectionNavItems,
      activeId: activeSectionId,
      onNavigate: scrollToSection,
      allLabel: 'Brands',
      profileLabel: 'Brand directory',
    },
  }, [selectedLetter, searchQuery, activeTab, selectedCategory, verificationFilter, popularityFilter, sectionNavItems, activeSectionId, scrollToSection]);

  const brandsBrowseItems = [
        {
          id: 'top-rated',
          icon: '🏆',
          name: 'Top Rated',
          sub: '4.5+ stars',
          bg: '#FFF3EA',
          active: popularityFilter === 'top-rated',
          onClick: () => setPopularityFilter(popularityFilter === 'top-rated' ? 'all' : 'top-rated'),
        },
        {
          id: 'new-brands',
          icon: '✨',
          name: 'New Brands',
          sub: 'This week',
          bg: '#EFECFD',
          active: activeTab === 'Trending Brands',
          onClick: () => setActiveTab(activeTab === 'Trending Brands' ? 'All Brands' : 'Trending Brands'),
        },
        {
          id: 'featured',
          icon: '⭐',
          name: 'Featured',
          sub: 'Handpicked',
          bg: '#FEF3E2',
          active: popularityFilter === 'featured',
          onClick: () => setPopularityFilter(popularityFilter === 'featured' ? 'all' : 'featured'),
        },
        {
          id: 'most-reviewed',
          icon: '💬',
          name: 'Most Reviewed',
          sub: '10K+ reviews',
          bg: '#EAF1FD',
          active: activeTab === 'Top Rated Brands',
          onClick: () => setActiveTab(activeTab === 'Top Rated Brands' ? 'All Brands' : 'Top Rated Brands'),
        },
        {
          id: 'budget',
          icon: '💰',
          name: 'Budget Friendly',
          sub: 'Under ৳5K',
          bg: '#E6F9EA',
          active: activeTab === 'Hot Deals Brands',
          onClick: () => setActiveTab(activeTab === 'Hot Deals Brands' ? 'All Brands' : 'Hot Deals Brands'),
        },
        {
          id: 'premium',
          icon: '👑',
          name: 'Premium',
          sub: 'Exclusive',
          bg: '#FDECEC',
          active: verificationFilter === 'verified',
          onClick: () => setVerificationFilter(verificationFilter === 'verified' ? 'all' : 'verified'),
        },
      ];

  const brandsBrowseControls = (
    <ListingBrowseControls
      showSearch={false}
      quickChips={['Fashion', 'Electronics', 'Beauty', 'Home', 'Sports', 'Food']}
      onSearch={(q) => setSearchQuery(q)}
      onChipClick={(q) => setSearchQuery(q)}
      items={[]}
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
              placeholder="Search by Brand Name or Category..."
              className="w-full h-9 pl-8 pr-3 bg-white border border-[#eef2f6] rounded-2xl text-[11px] font-semibold text-[#1A1D4E] placeholder-gray-400 focus:outline-none focus:border-[#EB4501]/50 transition-colors shadow-sm"
            />
          </div>

          {/* LAYER 2: FULL SIDEBAR FILTER PANEL */}
          <div id="brands-sidebar-filters" className="transition-all duration-300 rounded-2xl">
            <FullSidebarFilterPanel
              title="Filter Brands"
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              searchPlaceholder="Search brands, category or best for..."
              browseControls={brandsBrowseControls}
              browseDockItems={brandsBrowseItems}
              quickFilters={
                <QuickFilterBar
                  title="Brands Quick Specs"
                  onOpenFullFilters={() => {}}
                  filters={[
                    { id: 'verified', label: '✓ Verified Claims', active: verificationFilter === 'verified', onClick: () => setVerificationFilter(verificationFilter === 'verified' ? 'all' : 'verified') },
                    { id: 'hot', label: 'ðŸ”¥ Hot Brands', active: popularityFilter === 'hot', onClick: () => setPopularityFilter(popularityFilter === 'hot' ? 'all' : 'hot') },
                    { id: 'top-rated', label: '⭐ Top Rated', active: popularityFilter === 'top-rated', onClick: () => setPopularityFilter(popularityFilter === 'top-rated' ? 'all' : 'top-rated') },
                    { id: 'fashion', label: 'ðŸ‘— Fashion Brands', active: selectedCategory === 'Fashion', onClick: () => setSelectedCategory(selectedCategory === 'Fashion' ? null : 'Fashion') },
                    { id: 'tech', label: 'ðŸ’» Tech Devices', active: selectedCategory === 'Tech', onClick: () => setSelectedCategory(selectedCategory === 'Tech' ? null : 'Tech') }
                  ]}
                />
              }
              activeChips={
                <ActiveFilterChips
                  chips={[
                    selectedCategory ? { id: 'category', label: `Category: ${selectedCategory}`, onRemove: () => setSelectedCategory(null) } : null,
                    selectedLetter ? { id: 'letter', label: `Starts with: ${selectedLetter}`, onRemove: () => setSelectedLetter(null) } : null,
                    verificationFilter !== 'all' ? { id: 'verification', label: `Verification: ${verificationFilter}`, onRemove: () => setVerificationFilter('all') } : null,
                    popularityFilter !== 'all' ? { id: 'popularity', label: `Status: ${popularityFilter}`, onRemove: () => setPopularityFilter('all') } : null
                  ].filter(Boolean) as any[]}
                  onClearAll={() => {
                    setSelectedLetter(null); 
                    setSearchQuery(''); 
                    setActiveTab('All Brands');
                    setSelectedCategory(null);
                    setVerificationFilter('all');
                    setPopularityFilter('all');
                  }}
                />
              }
              onReset={() => {
                setSelectedLetter(null); 
                setSearchQuery(''); 
                setActiveTab('All Brands');
                setSelectedCategory(null);
                setVerificationFilter('all');
                setPopularityFilter('all');
              }}
              advancedSection={
                <div className="flex flex-col gap-4">
                  {/* Initial Index selection A-Z */}
                  <div className="bg-white rounded-2xl p-4.5 border border-[#eef2f6] shadow-sm flex flex-col gap-2">
                    <h3 className="text-[11px] font-black text-[#8a9bb0] uppercase tracking-wider mb-2">Alpha search (A-Z)</h3>
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
                      {letters.map((letter) => (
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
                  entity: 'brands',
                  filters: [
                    {
                      id: 'category',
                      name: 'Category Hub',
                      type: 'single_select',
                      options: [
                        { value: 'all', label: 'All Categories' },
                        ...dynamicCategories.map(cat => ({ value: cat.name, label: cat.name, count: cat.count }))
                      ]
                    },
                    {
                      id: 'verification',
                      name: 'Verification Channel',
                      type: 'single_select',
                      options: [
                        { value: 'all', label: 'All Claim Statuses' },
                        { value: 'verified', label: 'Verified Claims Only' },
                        { value: 'unverified', label: 'Unverified Channels' }
                      ]
                    },
                    {
                      id: 'popularity',
                      name: 'Popularity Tier',
                      type: 'single_select',
                      options: [
                        { value: 'all', label: 'All Tiers' },
                        { value: 'hot', label: 'ðŸ”¥ Hot Brands' },
                        { value: 'featured', label: '⭐ Featured' },
                        { value: 'top-rated', label: '✨ Top Rated (4.8+)' }
                      ]
                    }
                  ]
                }}
                activeFilters={{
                  category: selectedCategory || 'all',
                  verification: verificationFilter,
                  popularity: popularityFilter
                }}
                onFilterChange={(filterId, value) => {
                  if (filterId === 'category') {
                    setSelectedCategory(value === 'all' || !value ? null : value);
                  } else if (filterId === 'verification') {
                    setVerificationFilter(value as any);
                  } else if (filterId === 'popularity') {
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
                For Business <span className="text-[#EB4501] italic">& Sellers</span>
              </h3>
              
              <p className="text-[11px] text-gray-400 font-semibold mt-2 px-1 leading-relaxed max-w-[220px]">
                Unlock exclusive tools, secure verified merchant badges, and scale your reach.
              </p>
            </div>

            <div className="border border-dashed border-[#EB4501]/20 bg-gradient-to-b from-[#FFF0E8]/20 to-white rounded-2xl p-4 text-center flex flex-col items-center justify-center my-2 flex-1">
              <h4 className="font-sans font-semibold text-gray-900 text-xs uppercase tracking-wider mb-1 leading-none">BOOST SALES</h4>
              <p className="text-[10px] text-gray-500 mb-4 leading-relaxed max-w-[210px] font-semibold">
                Gain entry to featured deal slots, exposure metrics, and buyer engagement streams.
              </p>
              
              <Link 
                to="/post-offer" 
                className="w-full py-2.5 bg-[#EB4501] hover:bg-[#CF4400] text-white font-semibold rounded-lg text-[10px] uppercase tracking-wider flex items-center justify-center gap-2 transition-colors shadow-sm"
              >
                POST OFFER <PenTool className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="flex items-center justify-center gap-1 text-[8.5px] font-semibold text-gray-400 uppercase font-mono tracking-widest shrink-0">
              <Users className="w-3.5 h-3.5 text-gray-400" /> 100k+ shopper log Daily
            </div>
          </div>

          {/* SPONSOR AD */}
          <ListingAdRail
            sponsoredPlacementKey={PLACEMENT_KEYS.SIDEBAR_PORTRAIT}
            sponsoredVariant="portrait"
            showAdSense={false}
          />
        </aside>

        {/* Main Content Area */}
        <main id="brands-main-display" className="choosify-middle-feed scroll-mt-36 min-w-0 pb-10 space-y-6">
          <ListingFeedHeader
            eyebrow="Our partners • Brands"
            title={
              `${activeTab === 'All Brands' ? 'All Brands' : activeTab}` +
              (selectedLetter ? ` · Starting with “${selectedLetter}”` : '') +
              (searchQuery ? ` · “${searchQuery}”` : '')
            }
            count={filteredBrands.length}
            showingFrom={filteredBrands.length > 0 ? 1 : 0}
            showingTo={Math.min(visibleCount, filteredBrands.length)}
            itemLabel="brands"
            actions={
              (selectedLetter || searchQuery || activeTab !== 'All Brands' || selectedCategory || verificationFilter !== 'all' || popularityFilter !== 'all') ? (
                <button
                  type="button"
                  onClick={() => {
                    setSelectedLetter(null);
                    setSearchQuery('');
                    setActiveTab('All Brands');
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

          <ListingFilterPills
            pills={brandsBrowseItems.map((item) => ({
              id: item.id,
              label: item.name,
              active: Boolean(item.active),
              onClick: () => item.onClick?.(),
            }))}
            hasActiveFilters={Boolean(
              selectedLetter ||
                searchQuery ||
                activeTab !== 'All Brands' ||
                selectedCategory ||
                verificationFilter !== 'all' ||
                popularityFilter !== 'all',
            )}
            onClearFilters={() => {
              setSelectedLetter(null);
              setSearchQuery('');
              setActiveTab('All Brands');
              setSelectedCategory(null);
              setVerificationFilter('all');
              setPopularityFilter('all');
            }}
            aiDiscoverPrompt="Help me find brands on Choosify"
          />

          {/* Active Filter Chips */}
          {(selectedCategory || verificationFilter !== 'all' || popularityFilter !== 'all' || selectedLetter) && (
            <div className="flex flex-wrap items-center gap-3">
              {selectedLetter && (
                <div className="flex items-center gap-2 px-4 py-2 bg-white border border-[#eef2f6] rounded-full text-[10px] font-black text-navy uppercase tracking-widest shadow-sm">
                  Letter: {selectedLetter} 
                  <X size={12} className="text-orange-primary cursor-pointer" onClick={() => setSelectedLetter(null)} />
                </div>
              )}
              {selectedCategory && (
                <div className="flex items-center gap-2 px-4 py-2 bg-white border border-[#eef2f6] rounded-full text-[10px] font-black text-navy uppercase tracking-widest shadow-sm">
                  Category: {selectedCategory} 
                  <X size={12} className="text-orange-primary cursor-pointer" onClick={() => setSelectedCategory(null)} />
                </div>
              )}
              {verificationFilter !== 'all' && (
                <div className="flex items-center gap-2 px-4 py-2 bg-white border border-[#eef2f6] rounded-full text-[10px] font-black text-navy uppercase tracking-widest shadow-sm">
                  Verification: {verificationFilter === 'verified' ? 'Verified' : 'Unverified'} 
                  <X size={12} className="text-orange-primary cursor-pointer" onClick={() => setVerificationFilter('all')} />
                </div>
              )}
              {popularityFilter !== 'all' && (
                <div className="flex items-center gap-2 px-4 py-2 bg-white border border-[#eef2f6] rounded-full text-[10px] font-black text-navy uppercase tracking-widest shadow-sm">
                  Popularity: {popularityFilter.toUpperCase()} 
                  <X size={12} className="text-orange-primary cursor-pointer" onClick={() => setPopularityFilter('all')} />
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
                    All Brands
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

          {filteredBrands.length > 0 ? (
            <>
              <div className={cn(BRAND_CARD_GRID, 'mb-8')}>
                {visibleBrandFeed.map((entry) =>
                  entry.kind === 'placement' ? (
                    <AdvertiseHereCard key={entry.key} variant="brand" />
                  ) : (
                    <BrandCardDesign key={entry.key} brand={entry.item} />
                  ),
                )}
                {infeedPlacements.length === 0 && <AdvertiseHereCard variant="brand" />}
              </div>
              <div ref={sentinelRef} className="h-8" aria-hidden />
              {hasMore && (
                <p className="text-center text-[12px] text-[#9AA0AC] font-semibold py-4">Loading more…</p>
              )}
            </>
          ) : null}

          <div className="choosify-dark-surface rounded-xl px-7 py-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-white mb-8">
            <div>
              <div className="text-[15px] font-bold mb-1">Want exclusive brand deals?</div>
              <div className="text-[12px] text-white/55">
                Follow your favorite brands and get notified about deals & new arrivals.
              </div>
            </div>
            <Link
              to="/brands"
              className="bg-[#EB4501] text-white px-[22px] py-3 rounded-lg text-[12px] font-bold no-underline hover:brightness-110 shrink-0"
            >
              FOLLOW BRANDS
            </Link>
          </div>

          <AdSenseSlot format="infeed" className="mt-6" />

          {filteredBrands.length === 0 && (
             <div className="py-20 text-center">
                <Search size={48} className="mx-auto text-gray-300 mb-4" />
                <h3 className="text-xl font-extrabold text-[#1A1A2E] tracking-tight mb-2">No brands found</h3>
                <p className="text-gray-400 font-medium">Try searching for a different brand name or clear filters.</p>
                <button 
                  onClick={() => {setSearchQuery(''); setSelectedLetter(null);}}
                  className="mt-6 px-8 py-3 bg-navy text-white text-xs font-black uppercase rounded-xl shadow-lg"
                >
                  Clear All Filters
                </button>
             </div>
          )}
        </main>

        {/* RIGHT SIDEBAR WITH SPONSOR & SELLERS CARD */}
        <aside className="hidden lg:flex flex-col gap-4 lg:sticky lg:top-24 pb-10 pr-2 flex-shrink-0 animate-fade-in">
          {/* FEATURED BRAND DEALS SECTION */}
          <div className="bg-white rounded-2xl border border-[#eef2f6] p-4.5 shadow-sm w-full text-left animate-fade-in">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#eef2f6] px-1">
              <h3 className="text-[11px] font-semibold text-[#8a9bb0] uppercase tracking-wider">
                Featured Brand Deals
              </h3>
              <Link 
                to="/brand-deals" 
                className="text-[10px] font-bold text-orange-primary hover:underline flex items-center gap-1"
              >
                See All →
              </Link>
            </div>

            <div className="flex flex-col gap-2.5">
              {BRAND_DEALS.length === 0 ? (
                <div className="text-center py-6 border border-dashed border-gray-200 rounded-2xl">
                  <p className="text-xs text-gray-400 font-medium">Featured brand deals will appear here.</p>
                </div>
              ) : (
                BRAND_DEALS.map((item) => (
                  <Link 
                    to={`/brands/${item.id}`}
                    key={item.id} 
                    className="flex items-center gap-3 bg-white border border-[#eef2f6]/60 rounded-2xl p-2 hover:shadow-soft hover:border-[#EB4501]/10 transition-all duration-300 group cursor-pointer"
                  >
                    <div className={cn("w-9 h-9 rounded-lg overflow-hidden shrink-0 border border-transparent flex items-center justify-center text-white font-semibold text-xs shadow-sm", item.bgClass)}>
                      {item.logo}
                    </div>
                    <div className="flex-1 min-w-0 flex flex-col justify-center text-left">
                      <h4 className="font-sans text-xs font-semibold uppercase tracking-tight text-[#1A1D4E] group-hover:text-[#CF4400] transition-colors truncate">
                        {item.name}
                      </h4>
                      <p className="text-[9px] font-semibold text-gray-400 mt-0.5 truncate uppercase">
                        {item.dealHighlight}
                      </p>
                    </div>
                    <span className="text-[8px] font-bold text-[#EB4501] uppercase tracking-wider shrink-0 whitespace-nowrap group-hover:-translate-x-0.5 transition-transform">
                      View Deal
                    </span>
                  </Link>
                ))
              )}
            </div>
          </div>

          {/* FEATURED PROMOCODES SECTION */}
          <div className="bg-white rounded-2xl border border-[#eef2f6] p-4.5 shadow-sm w-full text-left animate-fade-in">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#eef2f6] px-1">
              <h3 className="text-[11px] font-semibold text-[#8a9bb0] uppercase tracking-wider">
                Featured Promocodes
              </h3>
            </div>

            <div className="flex flex-col gap-2.5">
              {PROMO_CODES.length === 0 ? (
                <div className="text-center py-6 border border-dashed border-gray-200 rounded-2xl">
                  <p className="text-xs text-gray-400 font-medium">No active promo codes available right now.</p>
                </div>
              ) : (
                PROMO_CODES.map((item, idx) => (
                  <Link 
                    to={`/brands/${item.brandId}`}
                    key={idx} 
                    className="bg-white border border-[#eef2f6]/65 hover:border-[#EB4501]/15 rounded-2xl p-2.5 hover:shadow-soft transition-all duration-300 group cursor-pointer flex flex-col gap-2 text-left"
                  >
                    {/* Header row with brand details */}
                    <div className="flex items-center justify-between gap-2">
                      <div className="min-w-0">
                        <h4 className="font-sans text-xs font-semibold uppercase tracking-tight text-[#1A1D4E] group-hover:text-[#CF4400] transition-colors truncate">
                          {item.brandName}
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
                ))
              )}
            </div>
          </div>

          <AdSenseSlot format="sidebar" />

         </aside>
      </div>
    </div>
  );
}
