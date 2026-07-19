import React, { useState, useMemo } from 'react';
import { PAGE_LISTING_SINGLE_SHELL, PRODUCT_CARD_GRID } from "../lib/pageLayout";
import { StickySectionNav } from '../components/StickySectionNav';
import { useSectionScrollSpy } from '../hooks/useSectionScrollSpy';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowRight, ShoppingBag, ShieldCheck, Tag, Zap, Star, Search, Shirt, Sparkles, AlertCircle, ChevronRight, Filter, X } from 'lucide-react';
import { BRANDS } from '../constants';
import { cn } from '../lib/utils';
import { DragScrollContainer, UniversalFilterRenderer, QuickFilterBar, ActiveFilterChips, FullSidebarFilterPanel, useRegisterPageFilters } from '../components/FilterEngine';
import { DcListingHero } from '../components/design/DcListingHero';
import { DcListingStickyFilters } from '../components/design/DcListingStickyFilters';
import { LISTING_PAGE_MAX_WIDTH } from '../lib/design/dcListingTokens';

export function BrandDealsPage() {
  const navigate = useNavigate();
  const [selectedLetter, setSelectedLetter] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('All');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [verificationFilter, setVerificationFilter] = useState<'all' | 'verified' | 'unverified'>('all');
  const [popularityFilter, setPopularityFilter] = useState<'all' | 'high' | 'normal'>('all');
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

  const dynamicCategories = React.useMemo(() => {
    const counts: { [name: string]: number } = {};
    BRANDS.forEach(b => {
      const cat = b.category || 'Other';
      counts[cat] = (counts[cat] || 0) + 1;
    });
    return Object.entries(counts).map(([name, count]) => ({
      name,
      count
    }));
  }, []);

  // Brand and deals filtering logic based on letter, category tab, and search query
  const filteredBrands = React.useMemo(() => {
    return BRANDS.filter(brand => {
      // 1. Alphabet Letter Initial
      const matchesLetter = selectedLetter === null || brand.name.toUpperCase().startsWith(selectedLetter);

      // 2. Category Tab Filter
      let matchesCategoryTab = true;
      if (activeTab === 'Tech') {
        matchesCategoryTab = brand.category === 'Tech' || brand.category === 'Electronics';
      } else if (activeTab === 'Fashion') {
        matchesCategoryTab = brand.category === 'Fashion' || brand.category === 'Sports';
      } else if (activeTab === 'Beauty') {
        matchesCategoryTab = brand.category === 'Beauty';
      } else if (activeTab === 'Ethnic') {
        matchesCategoryTab = brand.category === 'Ethnic';
      }

      // 3. Category Dropdown Filter
      const matchesCategoryDropdown = !selectedCategory || brand.category?.toLowerCase() === selectedCategory.toLowerCase();

      // 4. Verification Check
      let matchesVerification = true;
      if (verificationFilter === 'verified') {
        matchesVerification = brand.id % 2 === 0;
      } else if (verificationFilter === 'unverified') {
        matchesVerification = brand.id % 2 !== 0;
      }

      // 5. Popularity Check
      let matchesPopularity = true;
      if (popularityFilter === 'high') {
        matchesPopularity = brand.rating >= 4.7;
      } else if (popularityFilter === 'normal') {
        matchesPopularity = brand.rating < 4.7;
      }

      // 6. Search Query Filter (Page-level Scoped)
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch = !q || 
        brand.name.toLowerCase().includes(q) || 
        brand.category.toLowerCase().includes(q) ||
        `special exclusive limited discount offer save ${brand.name}`.toLowerCase().includes(q);

      return matchesLetter && matchesCategoryTab && matchesCategoryDropdown && matchesVerification && matchesPopularity && matchesSearch;
    });
  }, [selectedLetter, activeTab, selectedCategory, verificationFilter, popularityFilter, searchQuery]);

  const tabs = [
    { id: 'All', label: "All Offers", icon: <ShoppingBag size={13} /> },
    { id: 'Tech', label: "Tech & Electronics", icon: <Zap size={13} /> },
    { id: 'Fashion', label: "Fashion & Apparel", icon: <Shirt size={13} /> },
    { id: 'Beauty', label: "Health & Beauty", icon: <Sparkles size={13} /> },
    { id: 'Ethnic', label: "Heritage & Ethnic", icon: <Star size={13} /> }
  ];

  const sectionNavItems = useMemo(
    () => [{ id: 'brand-deals-main', label: 'Deals', icon: <Tag size={13} /> }],
    [],
  );
  const { activeId: activeSectionId, scrollToSection } = useSectionScrollSpy(sectionNavItems);

  useRegisterPageFilters({
    pageName: 'Brand Deals',
    renderSearch: () => (
      <div className="relative">
        <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
          <Search size={13} className="text-[#E8500A]" />
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search brand deals, promo codes or specific brands..."
          className="w-full h-9 pl-8 pr-3 bg-white border border-[#e8edf2] rounded-[5px] text-[11px] font-semibold text-[#1A1D4E] placeholder-gray-400 focus:outline-none focus:border-[#E8500A]/50 transition-colors"
        />
      </div>
    ),
    quickFilters: [
      { id: 'verified', label: '✓ Verified Partners Only', active: verificationFilter === 'verified', onClick: () => setVerificationFilter(verificationFilter === 'verified' ? 'all' : 'verified') },
      { id: 'top-rated', label: '⭐ Top Rated (4.7+)', active: popularityFilter === 'high', onClick: () => setPopularityFilter(popularityFilter === 'high' ? 'all' : 'high') },
      { id: 'cat-fashion', label: '👗 Fashion Channel', active: selectedCategory === 'Fashion', onClick: () => setSelectedCategory(selectedCategory === 'Fashion' ? null : 'Fashion') },
      { id: 'cat-electronics', label: '💻 Electronics Channel', active: selectedCategory === 'Electronics', onClick: () => setSelectedCategory(selectedCategory === 'Electronics' ? null : 'Electronics') },
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
                  { value: 'high', label: '⭐ Top Rated (4.7+)' },
                  { value: 'normal', label: 'Regular Deals' }
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
        <div className="bg-white rounded-[5px] p-4.5 border border-[#e8edf2] shadow-sm flex flex-col gap-2">
          <h3 className="text-[11px] font-black text-[#8a9bb0] uppercase tracking-wider mb-2">Alpha search (A-Z)</h3>
          <div className="grid grid-cols-5 gap-1.5 max-h-32 overflow-y-auto no-scrollbar">
            <button 
              onClick={() => setSelectedLetter(null)}
              className={cn(
                "col-span-5 py-1.5 rounded-[5px] text-[8.5px] font-bold uppercase transition-all text-center cursor-pointer",
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
                  "h-5.5 rounded-[5px] text-[9.5px] font-black transition-all flex items-center justify-center uppercase cursor-pointer",
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
    activeFilterCount: (selectedCategory ? 1 : 0) +
      (selectedLetter ? 1 : 0) +
      (verificationFilter !== 'all' ? 1 : 0) +
      (popularityFilter !== 'all' ? 1 : 0) +
      (searchQuery ? 1 : 0),
    onClearAll: () => {
      setSelectedLetter(null);
      setSelectedCategory(null);
      setVerificationFilter('all');
      setPopularityFilter('all');
      setSearchQuery('');
      setActiveTab('All');
    },
    sectionNav: {
      items: sectionNavItems,
      activeId: activeSectionId,
      onNavigate: scrollToSection,
      allLabel: 'Deals',
      profileLabel: 'Brand deals',
    },
  }, [selectedLetter, searchQuery, activeTab, selectedCategory, verificationFilter, popularityFilter, sectionNavItems, activeSectionId, scrollToSection]);

  return (
    <div className="flex flex-col min-h-screen bg-[#F4F7F9]">
      <DcListingHero
        titleBefore="Brand"
        titleHighlight="Deals"
        searchPlaceholder="Search brand deals..."
        quickChips={['Flash', 'Verified', 'Fashion', 'Electronics', 'Beauty', 'Home']}
        onSearch={(q) => setSearchQuery(q)}
        onChipClick={(q) => setSearchQuery(q)}
        maxWidthClass={LISTING_PAGE_MAX_WIDTH}
      />

      <DcListingStickyFilters
        overlapHero
        maxWidthClass={LISTING_PAGE_MAX_WIDTH}
        items={[
          {
            id: 'verified',
            icon: '🛡',
            name: 'Verified Brands',
            sub: 'Trusted only',
            bg: '#FFF3EA',
            active: verificationFilter === 'verified',
            onClick: () => setVerificationFilter(verificationFilter === 'verified' ? 'all' : 'verified'),
          },
          {
            id: 'top',
            icon: '🏆',
            name: 'Top Rated',
            sub: '4.5+ stars',
            bg: '#FEF3E2',
            active: popularityFilter === 'high',
            onClick: () => setPopularityFilter(popularityFilter === 'high' ? 'all' : 'high'),
          },
          {
            id: 'flash',
            icon: '⚡',
            name: 'Flash Deals',
            sub: 'Ending soon',
            bg: '#FDECEC',
            active: activeTab === 'Flash',
            onClick: () => setActiveTab(activeTab === 'Flash' ? 'All' : 'Flash'),
          },
          {
            id: 'fashion',
            icon: '👗',
            name: 'Fashion',
            sub: 'Apparel & more',
            bg: '#EFECFD',
            active: selectedCategory === 'Fashion',
            onClick: () => setSelectedCategory(selectedCategory === 'Fashion' ? null : 'Fashion'),
          },
          {
            id: 'electronics',
            icon: '💻',
            name: 'Electronics',
            sub: 'Tech deals',
            bg: '#EAF1FD',
            active: selectedCategory === 'Electronics',
            onClick: () => setSelectedCategory(selectedCategory === 'Electronics' ? null : 'Electronics'),
          },
        ]}
      />

      {/* ACTIVE FILTER CHIPS ROW */}
      <ActiveFilterChips
        chips={[
          selectedLetter ? { id: 'letter', label: `Starts with: ${selectedLetter}`, onRemove: () => setSelectedLetter(null) } : null,
          selectedCategory ? { id: 'category', label: `Category: ${selectedCategory}`, onRemove: () => setSelectedCategory(null) } : null,
          verificationFilter !== 'all' ? { id: 'verification', label: `Verification: ${verificationFilter === 'verified' ? 'Verified Only' : 'Unverified Only'}`, onRemove: () => setVerificationFilter('all') } : null,
          popularityFilter !== 'all' ? { id: 'popularity', label: `Popularity: ${popularityFilter === 'high' ? 'Top-Rated' : 'Regular'}`, onRemove: () => setPopularityFilter('all') } : null,
          searchQuery ? { id: 'search', label: `Query: ${searchQuery}`, onRemove: () => setSearchQuery('') } : null
        ].filter(Boolean) as any[]}
        onClearAll={() => {
          setSelectedLetter(null);
          setSelectedCategory(null);
          setVerificationFilter('all');
          setPopularityFilter('all');
          setSearchQuery('');
          setActiveTab('All');
        }}
      />

      <StickySectionNav
        sections={sectionNavItems}
        activeId={activeSectionId}
        onNavigate={scrollToSection}
        allLabel="Brand Deals"
        profileLabel="Brand deal hub"
      />

      {/* CORE THREE-COLUMN SYSTEM LAYOUT INTEGRATION */}
      <div className="w-full bg-[#F4F7F9] min-h-screen py-8">
        <div id="brand-deals-main" className={`scroll-mt-36 ${LISTING_PAGE_MAX_WIDTH} mx-auto px-4 sm:px-5 lg:px-6 py-5 w-full ${PAGE_LISTING_SINGLE_SHELL}`}>
          
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
                placeholder="Search brand deals, promo codes or specific brands..."
                className="w-full h-9 pl-8 pr-3 bg-white border border-[#e8edf2] rounded-[5px] text-[11px] font-semibold text-[#1A1D4E] placeholder-gray-400 focus:outline-none focus:border-[#E8500A]/50 transition-colors shadow-sm"
              />
            </div>

            {/* LAYER 2: FULL SIDEBAR FILTER PANEL */}
            <div id="brand-deals-sidebar-filters" className="transition-all duration-300 rounded-[5px] w-full">
              <FullSidebarFilterPanel
                title="Filter Brand Deals"
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                searchPlaceholder="Search active brand deals..."
                quickFilters={
                  <QuickFilterBar
                    title="Brand Deals Quick Specs"
                    onOpenFullFilters={() => {}}
                    filters={[
                      { id: 'verified', label: '✓ Verified Partners Only', active: verificationFilter === 'verified', onClick: () => setVerificationFilter(verificationFilter === 'verified' ? 'all' : 'verified') },
                      { id: 'top-rated', label: '⭐ Top Rated (4.7+)', active: popularityFilter === 'high', onClick: () => setPopularityFilter(popularityFilter === 'high' ? 'all' : 'high') },
                      { id: 'cat-fashion', label: '👗 Fashion Channel', active: selectedCategory === 'Fashion', onClick: () => setSelectedCategory(selectedCategory === 'Fashion' ? null : 'Fashion') },
                      { id: 'cat-electronics', label: '💻 Electronics Channel', active: selectedCategory === 'Electronics', onClick: () => setSelectedCategory(selectedCategory === 'Electronics' ? null : 'Electronics') },
                    ]}
                  />
                }
                activeChips={
                  <ActiveFilterChips
                    chips={[
                      selectedLetter ? { id: 'letter', label: `Starts with: ${selectedLetter}`, onRemove: () => setSelectedLetter(null) } : null,
                      selectedCategory ? { id: 'category', label: `Category: ${selectedCategory}`, onRemove: () => setSelectedCategory(null) } : null,
                      verificationFilter !== 'all' ? { id: 'verification', label: `Verification: ${verificationFilter === 'verified' ? 'Verified Only' : 'Unverified Only'}`, onRemove: () => setVerificationFilter('all') } : null,
                      popularityFilter !== 'all' ? { id: 'popularity', label: `Popularity: ${popularityFilter === 'high' ? 'Top-Rated' : 'Regular'}`, onRemove: () => setPopularityFilter('all') } : null,
                      searchQuery ? { id: 'search', label: `Query: ${searchQuery}`, onRemove: () => setSearchQuery('') } : null
                    ].filter(Boolean) as any[]}
                    onClearAll={() => {
                      setSelectedLetter(null);
                      setSelectedCategory(null);
                      setVerificationFilter('all');
                      setPopularityFilter('all');
                      setSearchQuery('');
                      setActiveTab('All');
                    }}
                  />
                }
                onReset={() => {
                  setSelectedLetter(null);
                  setSelectedCategory(null);
                  setVerificationFilter('all');
                  setPopularityFilter('all');
                  setSearchQuery('');
                  setActiveTab('All');
                }}
                advancedSection={
                  <div className="flex flex-col gap-4">
                    {/* Initial Index selection A-Z */}
                    <div className="bg-white rounded-[5px] p-4.5 border border-[#e8edf2] shadow-sm flex flex-col gap-2">
                      <h3 className="text-[11px] font-black text-[#8a9bb0] uppercase tracking-wider mb-2">Alpha search (A-Z)</h3>
                      <div className="grid grid-cols-5 gap-1.5 max-h-32 overflow-y-auto no-scrollbar">
                        <button 
                          onClick={() => setSelectedLetter(null)}
                          className={cn(
                            "col-span-5 py-1.5 rounded-[5px] text-[8.5px] font-bold uppercase transition-all text-center cursor-pointer",
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
                              "h-5.5 rounded-[5px] text-[9.5px] font-black transition-all flex items-center justify-center uppercase cursor-pointer",
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
                          { value: 'high', label: '⭐ Top Rated (4.7+)' },
                          { value: 'normal', label: 'Regular Deals' }
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

            {/* Promo spotlight card */}
            <div className="choosify-dark-surface text-white rounded-xl border border-[#E8EDF2]/10 p-5 shadow-sm relative overflow-hidden flex flex-col justify-between text-left shrink-0 w-full" style={{ height: '320px' }}>
              <div className="absolute top-0 right-0 w-28 h-28 bg-[#FF5B00]/10 rounded-full blur-2xl pointer-events-none" />
              
              <div>
                <span className="px-2.5 py-1 rounded-md bg-[#FF5B00] text-white text-[11px] font-bold tracking-tight leading-none">
                  Spotlight deal
                </span>
                <h3 className="font-sans text-lg font-extrabold tracking-tight text-white text-left leading-snug mt-4">
                  Exclusive S26 <span className="text-[#FF5B00]">bundle packs</span>
                </h3>
                <p className="text-[13px] text-white/55 font-medium mt-2 leading-relaxed">
                  Unlock dynamic distributor pricing on Samsung Mobile and premium accessories.
                </p>
              </div>
              
              <button 
                onClick={() => navigate('/brands/1/products')}
                className="w-full py-3 bg-[#FF5B00] hover:brightness-110 text-white font-bold rounded-lg text-[13px] tracking-tight flex items-center justify-center gap-2 transition-all mt-4 shadow-sm cursor-pointer border-0"
              >
                Explore S26 Deals <ArrowRight size={13} />
              </button>
            </div>

            {/* Platform Compliance Verified badge card */}
            <div className="bg-white rounded-[5px] border border-[#e8edf2] p-4.5 shadow-sm text-left font-sans">
              <h4 className="text-[11px] font-bold text-navy uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <ShieldCheck size={14} className="text-green-500 shrink-0" />
                Verified Sourcing
              </h4>
              <p className="text-[10px] text-gray-400 leading-relaxed font-semibold">
                Each listed discount slot is cross-verified against official brand inventories. No mock promotions, no user redirection loops, 100% direct checkouts.
              </p>
            </div>
          </aside>

          {/* B. MIDDLE COLUMN - BRAND WISE LISTINGS */}
          <main className="choosify-middle-feed min-w-0 space-y-8 font-sans">
            
            {/* Tablet/Mobile Collapsible Filter Card */}
            <div id="brand-deals-mobile-filters" className="lg:hidden bg-white rounded-[5px] p-4 border border-[#e8edf2] shadow-sm mb-6 font-sans">
              <div 
                className="flex items-center justify-between cursor-pointer" 
                onClick={() => setIsMobileFilterOpen(!isMobileFilterOpen)}
              >
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-1.5 leading-none">
                    <Filter size={11} className="text-[#E8500A]" />
                    ADVANCED FILTER PANEL:
                  </span>
                  <span className="px-2 py-0.5 bg-[#E8500A]/10 text-[#E8500A] text-[9px] font-black uppercase rounded-[3px] leading-none">
                    {selectedCategory || verificationFilter !== 'all' || popularityFilter !== 'all' || selectedLetter ? 'Active Filters' : 'None'}
                  </span>
                </div>
                <span className="text-[9.5px] font-black text-[#E8500A] uppercase tracking-widest">
                  {isMobileFilterOpen ? 'Hide Filters ▲' : 'Show Filters ▼'}
                </span>
              </div>
              
              {isMobileFilterOpen && (
                <div className="mt-4 pt-4 border-t border-gray-100/80 flex flex-col gap-4">
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
                            { value: 'high', label: '⭐ Top Rated (4.7+)' },
                            { value: 'normal', label: 'Regular Deals' }
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

                  {/* Alphabet Selection in Mobile View */}
                  <div className="bg-[#f8fbfd] rounded-[5px] p-4.5 border border-[#e8edf2] shadow-sm flex flex-col gap-2 mt-2">
                    <h3 className="text-[11px] font-black text-[#8a9bb0] uppercase tracking-wider mb-2">Alpha Search (A-Z)</h3>
                    <div className="grid grid-cols-6 sm:grid-cols-9 gap-1.5 max-h-32 overflow-y-auto no-scrollbar">
                      <button 
                        onClick={() => setSelectedLetter(null)}
                        className={cn(
                          "col-span-6 sm:col-span-9 py-2 rounded-[5px] text-[10px] font-black uppercase tracking-widest transition-all text-center cursor-pointer",
                          selectedLetter === null ? "bg-orange-primary text-white shadow-lg shadow-orange-primary/10" : "bg-gray-50 text-gray-400 hover:bg-gray-100"
                        )}
                      >
                        All Brands
                      </button>
                      {letters.map((letter) => (
                        <button 
                          key={letter} 
                          onClick={() => setSelectedLetter(letter)}
                          className={cn(
                            "h-8 rounded-[5px] text-[10px] font-black transition-all flex items-center justify-center uppercase cursor-pointer",
                            selectedLetter === letter ? "bg-orange-primary text-white shadow-md shadow-orange-primary/10" : "bg-gray-50 text-gray-400 hover:text-navy hover:bg-gray-100/70"
                          )}
                        >
                          {letter}
                        </button>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setSelectedLetter(null);
                      setSelectedCategory(null);
                      setVerificationFilter('all');
                      setPopularityFilter('all');
                      setSearchQuery('');
                      setActiveTab('All');
                      setIsMobileFilterOpen(false);
                    }}
                    className="w-full py-3 bg-[#F4F7F9] hover:bg-[#E8EDF2] text-[#1A1A2E] font-bold rounded-lg text-[13px] tracking-tight transition-all border-0"
                  >
                    Reset All Filters
                  </button>
                </div>
              )}
            </div>
            
            {/* Header info bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#e8edf2]">
              <div>
                <h3 className="text-[12px] font-semibold text-[#9AA0AC] tracking-tight">
                  OFFICIAL STORES • ACTIVE COUPONS
                </h3>
                <h2 className="text-xl font-extrabold text-navy tracking-tight mt-1">
                  {activeTab === 'All' ? 'ALL BRANDS' : `${activeTab.toUpperCase()} EXTRA`} 
                  {searchQuery && ` SEARCH: "${searchQuery.toUpperCase()}"`}
                  <span className="text-orange-primary"> ({filteredBrands.length} FOUND)</span>
                </h2>
              </div>
              
              {(selectedLetter || searchQuery || activeTab !== 'All' || selectedCategory || verificationFilter !== 'all' || popularityFilter !== 'all') && (
                <button 
                  onClick={() => {
                    setSelectedLetter(null); 
                    setSearchQuery(''); 
                    setActiveTab('All');
                    setSelectedCategory(null);
                    setVerificationFilter('all');
                    setPopularityFilter('all');
                  }}
                  className="text-[9.5px] font-black text-orange-primary uppercase tracking-widest hover:underline flex items-center gap-1.5 transition-all bg-white border border-[#e8edf2] px-3.5 py-2 rounded-[5px] shadow-sm self-start sm:self-auto hover:text-[#CF4400]"
                >
                  Reset All Filters
                </button>
              )}
            </div>


            {/* Brands listing block */}
            <div className="flex flex-col gap-14">
              {filteredBrands.length > 0 ? (
                filteredBrands.map((brand, idx) => (
                  <div key={brand.id} className="animate-in fade-in slide-in-from-bottom-5 duration-700" style={{ animationDelay: `${idx * 50}ms` }}>
                    {/* Brand header */}
                    <div className="flex items-center justify-between mb-6 pb-3 border-b border-gray-150">
                      <div className="flex items-center gap-4.5">
                        <div className="w-11 h-11 rounded-[5px] bg-white shadow-sm flex items-center justify-center text-navy font-black text-lg border border-gray-150 overflow-hidden">
                          {brand.logo && (brand.logo.startsWith('http') || brand.logo.startsWith('/')) ? (
                            <img src={brand.logo} className="w-full h-full object-cover p-1" alt={brand.name} referrerPolicy="no-referrer" />
                          ) : (
                            brand.logo
                          )}
                        </div>
                        <div>
                          <h2 className="text-lg font-black text-[#1A1D4E] uppercase tracking-tight">{brand.name} Deals</h2>
                          <div className="flex items-center gap-1.5 mt-0.5">
                             <ShieldCheck size={11} className="text-green-500" />
                             <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider italic">Authorized Partner Offer</span>
                          </div>
                        </div>
                      </div>
                      <button 
                        onClick={() => navigate(`/brands/${brand.id}/products`)}
                        className="flex items-center gap-1.5 text-orange-primary font-black uppercase text-[10px] tracking-widest hover:gap-2.5 transition-all bg-white border border-[#e8edf2] px-3 py-1.5 rounded-[5px] shadow-xs hover:border-orange-primary/30"
                      >
                        Brand Store <ArrowRight size={11} />
                      </button>
                    </div>

                    {/* Standardized cards grid inside main layout */}
                    <div className={PRODUCT_CARD_GRID}>
                      {[1, 2, 3, 4, 5].map((deal) => (
                        <div 
                          key={deal} 
                          onClick={() => navigate(`/brands/${brand.id}/products`)}
                          className="bg-white rounded-[5px] p-6 flex flex-col items-center text-center gap-6 hover:shadow-lg hover:border-orange-primary/20 transition-all cursor-pointer border border-[#e8edf2] group relative overflow-hidden shadow-sm"
                        >
                          <div className="absolute top-0 right-0 w-32 h-32 bg-orange-primary/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl group-hover:scale-125 transition-transform duration-700" />
                          
                          <div className="w-16 h-16 rounded-full bg-[#F8FAFC] flex items-center justify-center text-[#1a1a2e] font-black text-2xl shadow-[inset_0_1px_4px_rgba(0,0,0,0.05)] border border-gray-100 group-hover:scale-105 transition-transform duration-500 relative z-10 shrink-0 overflow-hidden">
                            {brand.logo && (brand.logo.startsWith('http') || brand.logo.startsWith('/')) ? (
                              <img src={brand.logo} className="w-full h-full object-cover p-1.5" alt={brand.name} referrerPolicy="no-referrer" />
                            ) : (
                              brand.logo
                            )}
                          </div>
                          
                          <div className="flex flex-col items-center gap-2 relative z-10 w-full">
                            <h4 className="text-sm font-bold text-navy group-hover:text-orange-primary transition-colors uppercase tracking-tight leading-snug line-clamp-1 w-full">
                              {brand.name} {deal === 1 ? 'Special' : deal === 2 ? 'Exclusive' : 'Limited'}
                            </h4>
                            <div className="px-4 py-1.5 bg-orange-primary text-white rounded-full text-[9px] font-black uppercase tracking-widest shadow-sm shadow-orange-primary/10 group-hover:scale-105 transition-transform inline-block">
                              Up to {idx % 2 === 0 ? '40%' : '50%'} OFF
                            </div>
                          </div>

                          <div className="w-full h-px bg-gray-50 relative z-10" />

                          <div className="flex items-center gap-2 text-[13px] font-bold text-[#1A1A2E] tracking-tight group-hover:text-[#FF5B00] transition-colors relative z-10">
                            Grab This Offer <ArrowRight size={13} className="-rotate-45 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))
              ) : (
                <div className="bg-white border border-[#e8edf2] rounded-[5px] p-12 text-center flex flex-col items-center gap-4">
                  <AlertCircle size={32} className="text-gray-300 animate-pulse" />
                  <h3 className="text-base font-black text-navy uppercase tracking-tight">No Brand Deals Found</h3>
                  <p className="text-xs text-gray-400 font-semibold max-w-sm">No partners match your selected criteria. Try resetting the search input or alphabet letter filter.</p>
                  <button 
                    onClick={() => {setSelectedLetter(null); setSearchQuery(''); setActiveTab('All');}}
                    className="px-5 py-2.5 bg-[#FF5B00] hover:brightness-110 text-white text-[13px] font-bold tracking-tight rounded-lg transition-all shadow-sm"
                  >
                    Clear All Filters
                  </button>
                </div>
              )}
            </div>
          </main>

          {/* C. RIGHT COLUMN - OFFERS PROMOTIONS SIDEBAR */}
          <aside className="hidden lg:flex flex-col gap-4 lg:sticky lg:top-24 pb-10 pr-2 flex-shrink-0 animate-fade-in font-sans">
            
            {/* Offline Sourcing Request */}
            <div className="bg-white rounded-[5px] p-5 shadow-sm border border-[#e8edf2] text-left flex flex-col justify-between" style={{ height: '240px' }}>
              <div>
                <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">
                  PARTNER SOLUTIONS
                </span>
                <h4 className="text-xs font-semibold text-navy uppercase tracking-wide leading-none mt-2">
                  REQUEST COUPE TAGS
                </h4>
                <p className="text-[10px] text-gray-400 leading-relaxed font-semibold mt-2.5">
                  Are you managing a distribution node or seeking bulk slot discounts? Request verified platform onboarding tags seamlessly.
                </p>
              </div>
              
              <button 
                onClick={() => navigate('/post-offer')}
                className="w-full py-3 bg-white border border-[#E8EDF2] hover:border-[#000435] text-[#1A1A2E] font-bold rounded-lg text-[13px] tracking-tight flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                Submit Partnership Query
              </button>
            </div>

          </aside>

        </div>
      </div>

      <section className="py-16 choosify-dark-surface px-5 sm:px-8 relative overflow-hidden">
        <div className="max-w-3xl mx-auto text-center relative z-10">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mb-3 leading-tight">
            Not finding your favorite brand?
          </h2>
          <p className="text-white/55 text-[13px] font-medium mb-8">
            Suggest a brand or request an offer — we&apos;ll verify and bring it to you.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => navigate('/about#suggest-brand')}
              className="w-full sm:w-auto px-7 py-3 bg-white text-[#1A1A2E] font-bold text-[12.5px] rounded-lg hover:bg-[#FF5B00] hover:text-white transition-colors cursor-pointer border-0"
            >
              Request a brand
            </button>
            <button
              type="button"
              onClick={() => navigate('/deals')}
              className="w-full sm:w-auto px-7 py-3 bg-transparent border border-white/25 text-white font-bold text-[12.5px] rounded-lg hover:border-white transition-colors cursor-pointer"
            >
              Notify me of new deals
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
