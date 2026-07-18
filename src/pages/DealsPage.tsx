import React, { useState, useEffect, useMemo } from 'react';
import { ProductCard } from '../components/ProductCard';
import { FlashDealCard, DealOfTheDayCard } from '../components/deals/FlashDealCard';
import { Timer, Zap, ArrowRight, ShoppingBag, Bookmark, ChevronDown, Shirt, Tablets as Gem, Smartphone, Eye, Gamepad2, Utensils, Monitor, Tv, Home, Star, Droplets, BookOpen, Heart, Smile, Car, Compass, Search, ChevronRight, Package, Gift, Award, CalendarDays, XCircle, ShieldCheck, Flame } from 'lucide-react';
import { PRODUCTS, BRANDS } from '../constants';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { cn } from '../lib/utils';
import { DragScrollContainer, UniversalFilterRenderer, QuickFilterBar, ActiveFilterChips, FullSidebarFilterPanel, useRegisterPageFilters } from '../components/FilterEngine';
import { useGlobalState } from '../context/GlobalStateContext';
import { DcListingHero } from '../components/design/DcListingHero';
import { DcListingStickyFilters } from '../components/design/DcListingStickyFilters';
import { PaginationBar } from '../components/PaginationBar';
import {PRODUCT_CARD_GRID, PAGE_LISTING_SINGLE_SHELL } from "../lib/pageLayout";
import { useSectionScrollSpy } from '../hooks/useSectionScrollSpy';
import { ListingAdRail } from '../components/ListingAdRail';
import { AdSenseSlot } from '../components/AdSenseSlot';
import { usePlacements } from '../hooks/usePlacements';
import { PLACEMENT_KEYS, INFEED_INTERVAL, INFEED_MAX_PER_PAGE } from '../lib/placements';
import { injectPlacementsIntoFeed } from '../utils/injectFeedPlacements';
import { ProductsSponsoredBanner, AdvertiseHereCard } from '../components/commerce/AdvertiseHereCard';
import {
  DealsAuthenticationStrip,
  DealsBrandDealsCard,
  DealsPopularCategoriesCard,
  DealsSubscribeBanner,
  DealsTopCouponsCard,
  DealsVerticalSponsoredCard,
} from '../components/deals/DealsLowerSections';

const PROMO_CODES = [
  { brandId: 'aarong', brandName: "Aarong", code: "AARONG15", discount: "Flat 15% OFF" },
  { brandId: 'apex', brandName: "Apex", code: "APEXFOOT26", discount: "BDT 500 FLAT" },
  { brandId: 'sailor', brandName: "Sailor", code: "SAILOREID", discount: "Flat 20% OFF" },
  { brandId: 'adidas', brandName: "Adidas", code: "ADIEXTRA10", discount: "10% FLAT OFF" }
];

function FlashDealCountdown({ validUntil }: { validUntil?: string }) {
  const [parts, setParts] = useState({ h: '12', m: '00', s: '00' });
  useEffect(() => {
    const target = validUntil ? new Date(validUntil) : new Date(Date.now() + 12 * 60 * 60 * 1000);
    const tick = () => {
      const diff = target.getTime() - Date.now();
      if (diff <= 0) {
        setParts({ h: '00', m: '00', s: '00' });
        return;
      }
      const h = Math.floor(diff / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      const s = Math.floor((diff % 60000) / 1000);
      setParts({
        h: String(h).padStart(2, '0'),
        m: String(m).padStart(2, '0'),
        s: String(s).padStart(2, '0'),
      });
    };
    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [validUntil]);

  return (
    <div className="flex gap-1">
      {(
        [
          { value: parts.h, label: 'HRS' },
          { value: parts.m, label: 'MIN' },
          { value: parts.s, label: 'SEC' },
        ] as const
      ).map((cd) => (
        <div
          key={cd.label}
          className="bg-[#1A1A2E] text-white rounded-md px-2 py-1 text-[12px] font-extrabold min-w-[30px] text-center"
        >
          {cd.value}
          <div className="text-[7px] font-semibold text-white/50">{cd.label}</div>
        </div>
      ))}
    </div>
  );
}

export function DealsPage() {
  const navigate = useNavigate();
  const { allProducts, allBrands, allDeals } = useGlobalState();
  const [searchParams, setSearchParams] = useSearchParams();
  const getInitialTab = () => {
    const t = searchParams.get('tab');
    if (t === 'flash') return 'Flash Deals';
    if (t === 'promo' || t === 'promo_codes') return 'Promo Codes';
    if (t === 'brand') return 'Brand Deals';
    if (t === 'seasonal') return 'Seasonal Campaigns';
    if (t === 'expired') return 'Expired Deals';
    if (t === 'all') return 'All Deals';
    return 'Flash Deals'; // default
  };

  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState(getInitialTab);
  const [minDiscount, setMinDiscount] = useState<number>(0);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const productSource: any[] = allProducts.length > 0 ? allProducts : PRODUCTS;
  const brandSource: any[] =
    allBrands.length > 0
      ? allBrands.map((brand) => ({ ...brand, rating: brand.ratings, products: brand.followers || 0 }))
      : BRANDS;
  const promoCodes = React.useMemo(
    () =>
      allDeals.length > 0
        ? allDeals
            .filter((deal) => !!deal.promoCode)
            .map((deal) => ({
              brandId: deal.brandId || 'brand-generic',
              brandName: deal.seller || 'Brand',
              code: deal.promoCode || '',
              discount: deal.discountType === 'flat' ? `Flat ৳${deal.discountValue} OFF` : `${deal.discountValue}% OFF`,
            }))
        : PROMO_CODES,
    [allDeals]
  );

  const TAB_TO_URL: Record<string, string> = {
    'Flash Deals': 'flash',
    'Promo Codes': 'promo',
    'Brand Deals': 'brand',
    'Seasonal Campaigns': 'seasonal',
    'Expired Deals': 'expired',
    'All Deals': 'all',
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    const urlKey = TAB_TO_URL[tab] || tab.toLowerCase().replace(/\s+/g, '_');
    setSearchParams({ tab: urlKey });
  };

  useEffect(() => {
    const t = searchParams.get('tab');
    if (t) {
      if (t === 'flash') setActiveTab('Flash Deals');
      else if (t === 'promo' || t === 'promo_codes') setActiveTab('Promo Codes');
      else if (t === 'brand') setActiveTab('Brand Deals');
      else if (t === 'seasonal') setActiveTab('Seasonal Campaigns');
      else if (t === 'expired') setActiveTab('Expired Deals');
      else if (t === 'all') setActiveTab('All Deals');
    }
  }, [searchParams]);

  // Restore state from sessionStorage on mount
  React.useEffect(() => {
    try {
      const saved = sessionStorage.getItem('choosify_deals_filters');
      if (saved) {
        const filters = JSON.parse(saved);
        if (filters.selectedCategory) setSelectedCategory(filters.selectedCategory);
        if (filters.minDiscount !== undefined) setMinDiscount(filters.minDiscount);
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
      minDiscount,
      activeTab
    };
    sessionStorage.setItem('choosify_deals_filters', JSON.stringify(filters));
  }, [selectedCategory, minDiscount, activeTab]);

  // Section navigation registered via useRegisterPageFilters / useSectionScrollSpy

  const filteredProducts = React.useMemo(() => {
    let result = [...productSource];

    if (activeTab === 'Flash Deals') {
      const deals = result.filter(p => (p as any).isDeal === true && (p as any).dealType === 'flash');
      result = deals.length > 0 ? deals : result.filter(p => p.id % 2 === 0);
    } else if (activeTab === 'Promo Codes') {
      const promos = result.filter(p => (p as any).isDeal === true && (p as any).promoCode != null);
      result = promos.length > 0 ? promos : result.filter(p => p.id % 3 === 0);
    } else if (activeTab === 'Brand Deals') {
      const brands = result.filter(p => (p as any).isDeal === true && (p as any).dealType === 'brand');
      result = brands.length > 0 ? brands : result.filter(p => p.brand);
    } else if (activeTab === 'Seasonal Campaigns' || activeTab === 'Seasonal') {
      const seasonal = result.filter(p => (p as any).isDeal === true && (p as any).dealType === 'seasonal');
      result = seasonal.length > 0 ? seasonal : result.filter(p => p.id % 5 === 0);
    } else if (activeTab === 'Expired Deals' || activeTab === 'Expired') {
      const expired = result.filter(p => (p as any).isDeal === true && (p as any).dealType === 'clearance');
      result = expired.length > 0 ? expired : result.filter(p => p.id % 4 === 1);
    }

    if (selectedCategory) {
      result = result.filter(p => p.category?.toLowerCase() === selectedCategory.toLowerCase());
    }

    if (minDiscount > 0) {
      result = result.filter(p => {
        const pct = (p.id % 4) * 15 + 10;
        return pct >= minDiscount;
      });
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(p => 
        p.title.toLowerCase().includes(q) || 
        (p.brand || '').toLowerCase().includes(q) ||
        (p.category || '').toLowerCase().includes(q) ||
        (p.description || '').toLowerCase().includes(q)
      );
    }
    return result;
  }, [searchQuery, activeTab, selectedCategory, minDiscount, productSource]);

  const infeedPlacements = usePlacements(PLACEMENT_KEYS.INFEED_DEAL, {
    limit: INFEED_MAX_PER_PAGE,
  });

  const dealFeed = React.useMemo(
    () =>
      injectPlacementsIntoFeed(
        filteredProducts,
        (product) => `deal-${product.id}`,
        infeedPlacements,
        INFEED_INTERVAL.deal,
        INFEED_MAX_PER_PAGE,
      ),
    [filteredProducts, infeedPlacements],
  );

  const categoriesList = [
    { name: 'Fashion', icon: <Shirt size={16} className="stroke-[2.5]" />, count: 550 },
    { name: 'Gadgest', icon: <Smartphone size={16} className="stroke-[2.5]" />, count: 420 },
    { name: 'Perfume', icon: <Droplets size={16} className="stroke-[2.5]" />, count: 180 },
    { name: 'Electronics', icon: <Tv size={16} className="stroke-[2.5]" />, count: 350 },
    { name: 'Travel', icon: <Compass size={16} className="stroke-[2.5]" />, count: 156 },
    { name: 'Education', icon: <BookOpen size={16} className="stroke-[2.5]" />, count: 210 },
    { name: 'Parenting', icon: <Heart size={16} className="stroke-[2.5]" />, count: 95 },
    { name: 'Kids', icon: <Smile size={16} className="stroke-[2.5]" />, count: 240 },
    { name: 'Cars / Bike', icon: <Car size={16} className="stroke-[2.5]" />, count: 310 }
  ];

  const dealsSectionNavItems = useMemo(
    () => [
      { id: 'all-deals', label: 'All Deals', icon: <Flame size={13} /> },
      { id: 'featured-brand-deals-section', label: 'Brand Deals', icon: <Award size={13} /> },
    ],
    [],
  );
  const { activeId: activeSectionId, scrollToSection } = useSectionScrollSpy(dealsSectionNavItems);

  useRegisterPageFilters({
    pageName: 'Deals',
    renderSearch: () => (
      <div className="relative">
        <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
          <Search size={13} className="text-[#E8500A]" />
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search brand deals..."
          className="w-full h-9 pl-8 pr-3 bg-white border border-[#eef2f6] rounded-2xl text-[11px] font-semibold text-[#1A1D4E] placeholder-gray-400 focus:outline-none focus:border-[#E8500A]/50 transition-colors"
        />
      </div>
    ),
    quickFilters: [
      { id: 'all-deals', label: 'All Deals', active: activeTab === 'All Deals', onClick: () => setActiveTab('All Deals') },
      { id: 'fashion-pill', label: 'ðŸ‘— Fashion Deals', active: selectedCategory === 'Fashion', onClick: () => setSelectedCategory(selectedCategory === 'Fashion' ? null : 'Fashion') },
      { id: 'discount-25', label: 'ðŸ”¥ 25% Off +', active: minDiscount === 25, onClick: () => setMinDiscount(minDiscount === 25 ? 0 : 25) }
    ],
    renderFilters: () => (
      <div className="flex flex-col gap-4">
        <UniversalFilterRenderer
          profile={{
            entity: 'deals',
            filters: [
              {
                id: 'category',
                name: 'Product Categories',
                type: 'single_select',
                options: [
                  { value: 'all', label: 'All Categories' },
                  ...categoriesList.map(cat => ({ value: cat.name, label: cat.name, count: cat.count }))
                ]
              }
            ]
          }}
          activeFilters={{
            category: selectedCategory,
          }}
          onFilterChange={(filterId, value) => {
            if (filterId === 'category') {
              setSelectedCategory(value === 'all' || !value ? null : value);
            }
          }}
        />

        <UniversalFilterRenderer
          profile={{
            entity: 'deals',
            filters: [
              {
                id: 'discount_range2',
                name: 'Minimum Discount',
                type: 'single_select',
                options: [
                  { value: 'all', label: 'Any Savings' },
                  { value: '10', label: '10% Savings & Up' },
                  { value: '25', label: '25% Savings & Up' },
                  { value: '40', label: '40% Savings & Up' },
                  { value: '60', label: '60% Savings & Up' }
                ]
              }
            ]
          }}
          activeFilters={{
            discount_range2: minDiscount === 0 ? 'all' : minDiscount.toString()
          }}
          onFilterChange={(filterId, value) => {
            if (filterId === 'discount_range2') {
              setMinDiscount(value === 'all' || !value ? 0 : Number(value));
            }
          }}
        />
      </div>
    ),
    activeFilterCount: (selectedCategory ? 1 : 0) +
      (minDiscount > 0 ? 1 : 0) +
      (searchQuery ? 1 : 0),
    onClearAll: () => {
      setSelectedCategory(null);
      setMinDiscount(0);
      setSearchQuery('');
      setActiveTab('All Deals');
    },
    sectionNav: {
      items: dealsSectionNavItems,
      activeId: activeSectionId,
      onNavigate: scrollToSection,
      allLabel: 'Deals',
      profileLabel: 'Deal hub',
    },
  }, [searchQuery, activeTab, selectedCategory, minDiscount, activeSectionId, dealsSectionNavItems, scrollToSection]);

  return (
    <div className="flex flex-col min-h-screen bg-[#F4F7F9]">
      <DcListingHero
        titleBefore="Grab Today's Best"
        titleHighlight="Deals"
        searchPlaceholder="Search deals..."
        quickChips={['Flash Sale', 'Bank Offer', 'Cashback', 'Coupons', 'Weekend', 'Clearance']}
        onSearch={(q) => setSearchQuery(q)}
        onChipClick={(q) => setSearchQuery(q)}
      />

      <DcListingStickyFilters
        overlapHero
        items={[
          {
            id: 'flash',
            icon: '⚡',
            name: 'Flash Sale',
            sub: 'Limited time',
            bg: '#FFF3EA',
            active: activeTab === 'Flash Deals',
            onClick: () => handleTabChange(activeTab === 'Flash Deals' ? 'All Deals' : 'Flash Deals'),
          },
          {
            id: 'coupons',
            icon: '🎟',
            name: 'Coupons',
            sub: 'Promo codes',
            bg: '#EFECFD',
            active: activeTab === 'Promo Codes',
            onClick: () => handleTabChange(activeTab === 'Promo Codes' ? 'All Deals' : 'Promo Codes'),
          },
          {
            id: 'brand',
            icon: '📷',
            name: 'Brand Deals',
            sub: 'Partner offers',
            bg: '#FEF3E2',
            active: activeTab === 'Brand Deals',
            onClick: () => handleTabChange(activeTab === 'Brand Deals' ? 'All Deals' : 'Brand Deals'),
          },
          {
            id: 'weekend',
            icon: '🏷',
            name: 'Weekend',
            sub: 'Seasonal sales',
            bg: '#E6F9EA',
            active: activeTab === 'Seasonal Campaigns',
            onClick: () => handleTabChange(activeTab === 'Seasonal Campaigns' ? 'All Deals' : 'Seasonal Campaigns'),
          },
          {
            id: 'clearance',
            icon: '🏬',
            name: 'Clearance',
            sub: 'Big savings',
            bg: '#FDECEC',
            active: activeTab === 'Expired Deals',
            onClick: () => handleTabChange(activeTab === 'Expired Deals' ? 'All Deals' : 'Expired Deals'),
          },
          {
            id: 'electronics',
            icon: '📺',
            name: 'Electronics',
            sub: '350 deals',
            bg: '#EAF1FD',
            active: selectedCategory === 'Electronics',
            onClick: () => setSelectedCategory(selectedCategory === 'Electronics' ? null : 'Electronics'),
          },
          {
            id: 'fashion',
            icon: '👗',
            name: 'Fashion',
            sub: '550 deals',
            bg: '#FFF3EA',
            active: selectedCategory === 'Fashion',
            onClick: () => setSelectedCategory(selectedCategory === 'Fashion' ? null : 'Fashion'),
          },
          {
            id: 'bank',
            icon: '🏦',
            name: 'Bank Offer',
            sub: 'Card savings',
            bg: '#F1F1F3',
            active: activeTab === 'All Deals' && minDiscount === 25,
            onClick: () => {
              handleTabChange('All Deals');
              setMinDiscount(minDiscount === 25 ? 0 : 25);
            },
          },
        ]}
      />

      <main className="w-full bg-[#F7F8FA] min-h-screen">

        {/* ACTIVE FILTER CHIPS ROW */}
        <ActiveFilterChips
          chips={[
            selectedCategory ? { id: 'category', label: `Category: ${selectedCategory}`, onRemove: () => setSelectedCategory(null) } : null,
            minDiscount > 0 ? { id: 'discount_range', label: `Savings: ${minDiscount}%+`, onRemove: () => setMinDiscount(0) } : null
          ].filter(Boolean) as any[]}
          onClearAll={() => {
            setSelectedCategory(null);
            setMinDiscount(0);
            setSearchQuery('');
            setActiveTab('All Deals');
          }}
        />

        {/* Master Flex Column Structure below sticky bar */}
        <div className={`max-w-[1440px] mx-auto px-4 sm:px-5 lg:px-6 py-10 md:py-12 w-full ${PAGE_LISTING_SINGLE_SHELL}`}>
          
          {/* Left Sidebar */}
          <aside className="hidden lg:flex flex-col gap-4 lg:sticky lg:top-24 pb-10 flex-shrink-0 animate-fade-in text-left">
             {/* LEFT COLUMN SEARCH BAR */}
             <div className="relative mb-2">
               <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                 <Search size={13} className="text-[#E8500A]" />
               </div>
               <input
                 type="text"
                 value={searchQuery}
                 onChange={(e) => setSearchQuery(e.target.value)}
                 placeholder="Search brand deals..."
                 className="w-full h-9 pl-8 pr-3 bg-white border border-[#eef2f6] rounded-2xl text-[11px] font-semibold text-[#1A1D4E] placeholder-gray-400 focus:outline-none focus:border-[#E8500A]/50 transition-colors shadow-sm"
               />
             </div>
             
             {/* LAYER 2: FULL SIDEBAR FILTER PANEL */}
             <div id="deals-sidebar-filters" className="transition-all duration-300 rounded-2xl w-full">
               <FullSidebarFilterPanel
                 title="Filter Deals"
                  searchQuery={searchQuery}
                  setSearchQuery={setSearchQuery}
                  searchPlaceholder="Search active deals and promos..."
                  quickFilters={
                    <QuickFilterBar
                      title="Deals Quick Specs"
                      onOpenFullFilters={() => {}}
                      filters={[
                        { id: 'savings-20', label: 'ðŸ”¥ 20%+ Off', active: minDiscount === 20, onClick: () => setMinDiscount(minDiscount === 20 ? 0 : 20) },
                        { id: 'savings-45', label: 'ðŸ’¥ 45%+ Off', active: minDiscount === 45, onClick: () => setMinDiscount(minDiscount === 45 ? 0 : 45) }
                      ]}
                    />
                  }
                  activeChips={
                    <ActiveFilterChips
                      chips={[
                        selectedCategory ? { id: 'category', label: `Category: ${selectedCategory}`, onRemove: () => setSelectedCategory(null) } : null,
                        minDiscount > 0 ? { id: 'discount_range', label: `Savings: ${minDiscount}%+`, onRemove: () => setMinDiscount(0) } : null
                      ].filter(Boolean) as any[]}
                      onClearAll={() => {
                        setSelectedCategory(null);
                        setMinDiscount(0);
                        setSearchQuery('');
                        setActiveTab('All Deals');
                      }}
                    />
                  }
                 onReset={() => {
                   setSelectedCategory(null);
                   setMinDiscount(0);
                   setSearchQuery('');
                   setActiveTab('All Deals');
                 }}
                 advancedSection={
                   <UniversalFilterRenderer
                     profile={{
                       entity: 'deals',
                       filters: [
                         {
                           id: 'discount_range2',
                           name: 'Minimum Discount',
                           type: 'single_select',
                           options: [
                             { value: 'all', label: 'Any Savings' },
                             { value: '10', label: '10% Savings & Up' },
                             { value: '25', label: '25% Savings & Up' },
                             { value: '40', label: '40% Savings & Up' },
                             { value: '60', label: '60% Savings & Up' }
                           ]
                         }
                       ]
                     }}
                     activeFilters={{
                       discount_range2: minDiscount === 0 ? 'all' : minDiscount.toString()
                     }}
                     onFilterChange={(filterId, value) => {
                       if (filterId === 'discount_range2') {
                         setMinDiscount(value === 'all' || !value ? 0 : Number(value));
                       }
                     }}
                   />
                 }
               >
                 <UniversalFilterRenderer
                   profile={{
                     entity: 'deals',
                     filters: [
                       {
                         id: 'category',
                         name: 'Product Categories',
                         type: 'single_select',
                         options: [
                           { value: 'all', label: 'All Categories' },
                           ...categoriesList.map(cat => ({ value: cat.name, label: cat.name, count: cat.count }))
                         ]
                       }
                     ]
                   }}
                   activeFilters={{
                     category: selectedCategory || 'all',
                   }}
                   onFilterChange={(filterId, value) => {
                     if (filterId === 'category') {
                       setSelectedCategory(value === 'all' || !value ? null : value);
                     }
                   }}
                 />
               </FullSidebarFilterPanel>
             </div>

             {/* Redesigned For Business & Sellers Card */}
             <div 
               id="section-sellers-deals-left" 
               className="bg-white rounded-2xl border border-[#eef2f6] p-5 relative overflow-hidden flex flex-col justify-between text-center shrink-0 w-full shadow-sm" 
               style={{ height: '410px' }}
             >
               <div className="absolute top-0 right-0 w-36 h-36 bg-gradient-to-br from-[#E8500A]/5 to-[#1A1D4E]/5 rounded-full blur-2xl pointer-events-none" />
               
               <div className="flex flex-col items-center">
                 <div className="w-10 h-10 rounded-full bg-[#E8500A]/10 text-[#E8500A] flex items-center justify-center mb-3 border border-[#E8500A]/5 shrink-0 shadow-sm">
                   <Star className="w-4 h-4 fill-current" />
                 </div>
                 
                 <h3 className="font-sans text-sm font-semibold uppercase tracking-tight text-[#1A1D4E] leading-snug">
                   For Business <span className="text-[#E8500A]">& Sellers</span>
                 </h3>
                 
                 <p className="text-[11px] text-gray-400 font-semibold mt-2 px-1 leading-relaxed max-w-[220px]">
                   Unlock exclusive tools, secure verified merchant badges, and scale your reach.
                 </p>
               </div>

               <div className="border border-dashed border-[#E8500A]/20 bg-gradient-to-b from-[#FFF0E8]/20 to-white rounded-2xl p-4 text-center flex flex-col items-center justify-center my-2 flex-1">
                 <h4 className="font-sans font-semibold text-gray-900 text-xs uppercase tracking-wider mb-1 leading-none">BOOST SALES TODAY</h4>
                 <p className="text-[10px] text-gray-500 mb-4 leading-relaxed max-w-[210px] font-semibold">
                   Gain entry to featured deal slots, exposure metrics, and buyer engagement streams.
                 </p>
                 
                 <button 
                   type="button"
                   onClick={() => navigate('/post-offer')}
                   className="w-full py-2.5 bg-[#E8500A] hover:bg-[#CF4400] text-white font-semibold rounded-lg text-[10px] uppercase tracking-wider flex items-center justify-center gap-2 transition-colors shadow-sm cursor-pointer border-0"
                 >
                   POST OFFER <ArrowRight className="w-3.5 h-3.5" />
                 </button>
               </div>

               <div className="flex items-center justify-center gap-1.5 text-[8.5px] font-semibold text-[#8a9bb0] uppercase font-mono tracking-widest shrink-0">
                 <Star className="w-3.5 h-3.5 text-[#E8500A] fill-current" /> 100k+ shopper log Daily
               </div>
             </div>
          </aside>

          {/* LEFT MAIN AREA */}
          <div className="choosify-middle-feed scroll-mt-36 min-w-0 pb-10 flex flex-col gap-10">
            
            {/* FLASH DEALS + DEAL OF THE DAY — Choosify.dc.html */}
            <section className="w-full">
              <div className="grid grid-cols-1 lg:grid-cols-[2.6fr_1fr] gap-5 mb-9">
                <div className="bg-white rounded-xl border border-[#E8EDF2] p-[22px]">
                  <div className="flex justify-between items-center mb-4 flex-wrap gap-3">
                    <div className="text-[15px] font-extrabold text-[#1A1A2E] flex items-center gap-1.5">
                      ⚡ FLASH DEALS
                    </div>
                    <div className="flex items-center gap-2.5">
                      <span className="text-[11px] text-[#9AA0AC]">Ends in</span>
                      <FlashDealCountdown />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5 mb-3.5">
                    {(filteredProducts.length > 0 ? filteredProducts : productSource)
                      .slice(0, 3)
                      .map((product: any, idx: number) => {
                        const orig =
                          typeof product.originalPrice === 'number'
                            ? product.originalPrice
                            : product.originalPrice
                              ? Number(String(product.originalPrice).replace(/[^\d]/g, ''))
                              : undefined;
                        const price =
                          typeof product.price === 'number'
                            ? product.price
                            : Number(String(product.price ?? 0).replace(/[^\d]/g, '')) || 0;
                        const pct =
                          orig && orig > price
                            ? Math.round(((orig - price) / orig) * 100)
                            : 15 + idx * 5;
                        return (
                          <FlashDealCard
                            key={product.id}
                            id={product.id}
                            name={product.title || product.name}
                            image={product.image}
                            category={product.categoryName || product.category || 'Deals'}
                            price={price}
                            originalPrice={orig}
                            badge={`${pct}% OFF`}
                            claimedPct={55 + idx * 12}
                            likes={product.likes || `${(1.1 + idx * 0.3).toFixed(1)}K`}
                          />
                        );
                      })}
                  </div>
                  <button
                    type="button"
                    onClick={() => handleTabChange('Flash Deals')}
                    className="block w-full text-center text-[12px] font-bold text-[#1A1A2E] border-0 bg-transparent cursor-pointer hover:text-[#FF5B00]"
                  >
                    VIEW ALL FLASH DEALS ›
                  </button>
                </div>

                {(() => {
                  const dotd =
                    (filteredProducts.length > 0 ? filteredProducts : productSource)[0] || productSource[0];
                  if (!dotd) return null;
                  const orig =
                    typeof dotd.originalPrice === 'number'
                      ? dotd.originalPrice
                      : Number(String(dotd.originalPrice ?? '').replace(/[^\d]/g, '')) || undefined;
                  const price =
                    typeof dotd.price === 'number'
                      ? dotd.price
                      : Number(String(dotd.price ?? 0).replace(/[^\d]/g, '')) || 0;
                  const pct =
                    orig && orig > price ? Math.round(((orig - price) / orig) * 100) : 55;
                  return (
                    <DealOfTheDayCard
                      id={dotd.id}
                      name={dotd.title || dotd.name}
                      image={dotd.image}
                      price={price}
                      originalPrice={orig}
                      badge={`${pct}% OFF`}
                      rating={dotd.rating || 4.8}
                      reviews={dotd.reviewCount || 214}
                      sold="1.2K"
                      claimedPct={72}
                    />
                  );
                })()}
              </div>
            </section>

            {/* Choosify.dc.html — horizontal sponsored banner */}
            <ProductsSponsoredBanner
              title="Xiaomi Mega Sale — Up to 40% off"
              subtitle="Official Xiaomi store · Limited stock"
              href="/advertise"
              className="mb-9"
            />

            {/* TOP DEALS + TOP COUPONS */}
            <section id="all-deals" className="w-full mb-9">
              <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,2.6fr)_minmax(0,1fr)] gap-5">
                <div>
                  <div className="mb-4 flex items-baseline justify-between gap-3">
                    <div>
                      <h2 className="text-[15px] font-extrabold text-[#1A1A2E] tracking-tight mb-1 flex items-center gap-1.5">
                        🛡 TOP DEALS
                      </h2>
                      <p className="text-[12px] text-[#9AA0AC] m-0">
                        Handpicked best offers for you
                      </p>
                    </div>
                    <span className="text-[11px] font-bold text-[#9AA0AC]">
                      {filteredProducts.length} available
                    </span>
                  </div>

                  <div className={cn(PRODUCT_CARD_GRID, 'text-left')}>
                    {activeTab === 'Promo Codes' ? (
                      promoCodes.map((promo) => (
                        <div
                          key={promo.code}
                          className="bg-white border border-gray-150 rounded-2xl p-5 flex flex-col justify-between min-h-[180px] relative overflow-hidden shadow-sm group hover:border-[#E8500A]/30 transition-all duration-300"
                        >
                          <div className="absolute top-0 right-0 w-20 h-20 bg-[#E8500A]/[0.04] rounded-full -translate-y-1/2 translate-x-1/2 blur-md" />
                          <div>
                            <div className="flex items-center gap-1.5 mb-2">
                              <Gift size={13} className="text-[#E8500A]" />
                              <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">
                                {promo.brandName}
                              </span>
                            </div>
                            <h4 className="text-sm font-extrabold text-[#1A1A2E] tracking-tight mb-2 leading-tight">
                              {promo.discount}
                            </h4>
                          </div>
                          <div className="mt-4">
                            <div className="bg-gray-50 border border-gray-150 rounded-lg p-1.5 flex items-center justify-between gap-2">
                              <code className="font-mono font-black text-[11px] text-navy tracking-wider px-1.5">
                                {promo.code}
                              </code>
                              <button
                                type="button"
                                onClick={() => {
                                  navigator.clipboard.writeText(promo.code);
                                  setCopiedCode(promo.code);
                                  setTimeout(() => setCopiedCode(null), 2000);
                                }}
                                className="px-3 py-1.5 bg-[#FF5B00] hover:brightness-110 text-white text-[12px] font-bold tracking-tight rounded-md cursor-pointer transition-colors border-none font-sans"
                              >
                                {copiedCode === promo.code ? 'Copied' : 'Copy'}
                              </button>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <>
                        {dealFeed.map((entry) =>
                          entry.kind === 'placement' ? (
                            <AdvertiseHereCard key={entry.key} variant="product-tile" />
                          ) : (
                            <div key={entry.key} className="w-full h-full">
                              <ProductCard
                                product={{
                                  ...entry.item,
                                  tag: 'SALE',
                                  tagColor: 'bg-[#E98B8B]',
                                }}
                                variant="grid"
                              />
                            </div>
                          ),
                        )}
                        <AdvertiseHereCard variant="product-tile" />
                      </>
                    )}
                  </div>

                  <PaginationBar
                    showingCount={Math.min(12, filteredProducts.length)}
                    totalCount={filteredProducts.length}
                  />
                </div>

                <DealsTopCouponsCard className="self-start lg:sticky lg:top-28" />
              </div>
            </section>

            {/* Choosify authentication / trust */}
            <DealsAuthenticationStrip className="mb-6" />

            {/* Popular categories + Brand deals */}
            <div className="grid grid-cols-1 md:grid-cols-[1fr_1.4fr] gap-4 mb-6">
              <DealsPopularCategoriesCard
                onCategoryClick={(name) => {
                  setSelectedCategory(name);
                  document.getElementById('all-deals')?.scrollIntoView({ behavior: 'smooth' });
                }}
              />
              <DealsBrandDealsCard />
            </div>

            <DealsSubscribeBanner className="mb-8" />

            <AdSenseSlot format="infeed" className="mt-6" />

          </div>

          {/* RIGHT SIDEBAR — vertical sponsored + listing rail */}
          <aside className="hidden lg:flex flex-col gap-4 lg:sticky lg:top-24 pb-10 pr-2 flex-shrink-0 animate-fade-in">
             <DealsVerticalSponsoredCard />

             <ListingAdRail
               sponsoredPlacementKey={PLACEMENT_KEYS.SIDEBAR_PORTRAIT}
               sponsoredVariant="portrait"
               showAdSense
               adSenseFormat="sidebar"
             />
          </aside>

        </div>
      </main>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-20px); }
        }
        .animate-float {
          animation: float 4s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
