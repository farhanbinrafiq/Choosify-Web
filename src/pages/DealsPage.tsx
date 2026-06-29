import React, { useState, useEffect } from 'react';
import { ProductCard } from '../components/ProductCard';
import { Timer, Zap, ArrowRight, ShoppingBag, Bookmark, ExternalLink, ChevronDown, Shirt, Tablets as Gem, Smartphone, Eye, Gamepad2, Utensils, Monitor, Tv, Home, Star, Droplets, BookOpen, Heart, Smile, Car, Compass, Search, ChevronRight, Package, Gift, Award, CalendarDays, XCircle, ShieldCheck } from 'lucide-react';
import { PRODUCTS, BRANDS } from '../constants';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { cn } from '../lib/utils';
import { QuickAccessCard } from '../components/QuickAccessCard';
import { DragScrollContainer, UniversalFilterRenderer, QuickFilterBar, ActiveFilterChips, FullSidebarFilterPanel, useRegisterPageFilters } from '../components/FilterEngine';

const PROMO_CODES = [
  { brandId: 'aarong', brandName: "Aarong", code: "AARONG15", discount: "Flat 15% OFF" },
  { brandId: 'apex', brandName: "Apex", code: "APEXFOOT26", discount: "BDT 500 FLAT" },
  { brandId: 'sailor', brandName: "Sailor", code: "SAILOREID", discount: "Flat 20% OFF" },
  { brandId: 'adidas', brandName: "Adidas", code: "ADIEXTRA10", discount: "10% FLAT OFF" }
];

function FlashDealCountdown({ validUntil }: { validUntil?: string }) {
  const [timeLeft, setTimeLeft] = useState('');
  useEffect(() => {
    const target = validUntil ? new Date(validUntil) : new Date(Date.now() + 12 * 60 * 60 * 1000);
    const interval = setInterval(() => {
      const diff = target.getTime() - Date.now();
      if (diff <= 0) { setTimeLeft('EXPIRED'); clearInterval(interval); return; }
      const h = Math.floor(diff / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      const s = Math.floor((diff % 60000) / 1000);
      setTimeLeft(`${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`);
    }, 1000);
    return () => clearInterval(interval);
  }, [validUntil]);
  return <span className="font-mono font-black text-orange-primary text-[11px]">{timeLeft || '12:00:00'}</span>;
}

export function DealsPage() {
  const navigate = useNavigate();
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
  const [dealType, setDealType] = useState<'all' | 'retail' | 'wholesale'>('all');
  const [minDiscount, setMinDiscount] = useState<number>(0);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

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
        if (filters.dealType) setDealType(filters.dealType);
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
      dealType,
      minDiscount,
      activeTab
    };
    sessionStorage.setItem('choosify_deals_filters', JSON.stringify(filters));
  }, [selectedCategory, dealType, minDiscount, activeTab]);

  // ScrollSpy Active section detection for DealsPage major sections
  React.useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 220; // Safe position matching offsets
      
      const brandDealsEl = document.getElementById('featured-brand-deals-section');
      if (brandDealsEl) {
        const top = brandDealsEl.getBoundingClientRect().top + window.pageYOffset;
        const height = brandDealsEl.offsetHeight;
        if (scrollPosition >= top && scrollPosition < top + height) {
          setActiveTab('Brand Deals');
          return;
        }
      }

      const allDealsEl = document.getElementById('all-deals');
      if (allDealsEl) {
        const top = allDealsEl.getBoundingClientRect().top + window.pageYOffset;
        const height = allDealsEl.offsetHeight;
        if (scrollPosition >= top && scrollPosition < top + height) {
          // If we scroll back up into all-deals, fallback to "All Deals" if user is currently on Brand Deals
          setActiveTab(prev => prev === 'Brand Deals' ? 'All Deals' : prev);
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const filteredProducts = React.useMemo(() => {
    let result = [...PRODUCTS];

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

    if (dealType === 'retail') {
      result = result.filter(p => (p as any).mode_type === 'retail');
    } else if (dealType === 'wholesale') {
      result = result.filter(p => (p as any).mode_type === 'wholesale');
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
  }, [searchQuery, activeTab, selectedCategory, dealType, minDiscount]);

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
          placeholder="Search brand deals..."
          className="w-full h-9 pl-8 pr-3 bg-white border border-[#e8edf2] rounded-[5px] text-[11px] font-semibold text-[#1A1D4E] placeholder-gray-400 focus:outline-none focus:border-[#E8500A]/50 transition-colors"
        />
      </div>
    ),
    quickFilters: [
      { id: 'all-deals', label: 'All Deals', active: activeTab === 'All Deals', onClick: () => setActiveTab('All Deals') },
      { id: 'fashion-pill', label: '👗 Fashion Deals', active: selectedCategory === 'Fashion', onClick: () => setSelectedCategory(selectedCategory === 'Fashion' ? null : 'Fashion') },
      { id: 'retail-pill', label: '🛍️ Retail', active: dealType === 'retail', onClick: () => setDealType(dealType === 'retail' ? 'all' : 'retail') },
      { id: 'wholesale-pill', label: '📦 Wholesale', active: dealType === 'wholesale', onClick: () => setDealType(dealType === 'wholesale' ? 'all' : 'wholesale') },
      { id: 'discount-25', label: '🔥 25% Off +', active: minDiscount === 25, onClick: () => setMinDiscount(minDiscount === 25 ? 0 : 25) }
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
              },
              {
                id: 'deal_channel',
                name: 'Sellers Channels',
                type: 'single_select',
                options: [
                  { value: 'all', label: 'All Channels' },
                  { value: 'retail', label: 'Retail Sales' },
                  { value: 'wholesale', label: 'Wholesale Only' }
                ]
              }
            ]
          }}
          activeFilters={{
            category: selectedCategory,
            deal_channel: dealType
          }}
          onFilterChange={(filterId, value) => {
            if (filterId === 'category') {
              setSelectedCategory(value === 'all' || !value ? null : value);
            }
            if (filterId === 'deal_channel') {
              setDealType(value === 'all' || !value ? 'all' : value as any);
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
      (dealType !== 'all' ? 1 : 0) +
      (minDiscount > 0 ? 1 : 0) +
      (searchQuery ? 1 : 0),
    onClearAll: () => {
      setSelectedCategory(null);
      setDealType('all');
      setMinDiscount(0);
      setSearchQuery('');
      setActiveTab('All Deals');
    },
  }, [searchQuery, activeTab, selectedCategory, dealType, minDiscount]);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section - Standardized Centered Alignment */}
      <div className="w-full relative overflow-hidden shrink-0 border-b border-white/5">
        {/* Background Gradients matching other directory pages */}
        <div className="absolute inset-0 hero-gradient" />
        
        <div className="max-w-[1914px] mx-auto w-full h-[303px] px-6 flex items-center justify-center text-center relative z-10 animate-fade-in">
          <div className="w-full flex flex-col justify-center">
            {/* Breadcrumbs */}
            <div className="flex items-center justify-center gap-1.5 text-white/40 text-[9px] font-black uppercase tracking-widest mb-1 w-full">
              <Link to="/" className="hover:text-white transition-colors">Home</Link>
              <ChevronRight size={10} className="text-white/20" />
              <span className="text-white">Deals & Promotions</span>
            </div>

            <div className="flex items-center justify-center gap-4 flex-wrap">
              <div className="bg-orange-primary text-white text-[8px] font-black px-3 py-1 rounded-full mb-1 uppercase tracking-[0.2em] shadow-md shadow-orange-primary/30 italic inline-block w-fit">
                FLASH SALE EVENT
              </div>
              
              <h1 className="text-xl md:text-2xl lg:text-3xl font-black text-white italic uppercase tracking-tighter mb-1 leading-none text-center">
                HOTTEST <span className="text-orange-primary">DEALS</span> TODAY
              </h1>
            </div>

            <p className="text-gray-400 text-[9px] lg:text-[11px] font-medium leading-normal mb-1.5 max-w-2xl text-center mx-auto">
              Discover verified limited-time promotions, exclusive seller invoice discounts, and real-time flash sales happening right now across Bangladesh.
            </p>

            {/* Statistics/Timer Row - Centered inside Hero container */}
            <div className="flex flex-row items-center justify-center gap-4 md:gap-6 w-full mt-0.5">
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-[12px] py-1 px-2.5 flex items-center gap-3.5 shadow-lg shrink-0">
                <div className="flex items-center gap-1.5">
                  <Zap size={10} className="text-orange-primary fill-orange-primary animate-pulse" />
                  <span className="text-[7px] font-black text-orange-primary uppercase tracking-[0.15em] italic">ENDS IN</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <FlashDealCountdown validUntil={(filteredProducts[0] as any)?.dealValidUntil} />
                </div>
              </div>

              <button 
                onClick={() => navigate('/post-offer')}
                className="group flex items-center gap-1.5 px-3 py-1 bg-white rounded-full transition-all hover:scale-105 hover:shadow-md active:scale-95 text-navy cursor-pointer"
              >
                <div className="w-4 h-4 rounded-full bg-orange-primary flex items-center justify-center text-white shadow-md group-hover:scale-110 transition-transform">
                  <ExternalLink size={8} />
                </div>
                <span className="text-[8px] font-black text-navy uppercase tracking-[0.12em] italic">Post Your Deals</span>
              </button>
            </div>

            {/* SEARCH BAR — placed inside hero section at bottom */}
            <div className="relative w-full max-w-2xl mx-auto mt-6">
              <div className="relative w-full bg-gray-50/50 p-1 rounded-full border border-gray-200/80 shadow-inner focus-within:border-[#E8500A]/30 transition-all duration-300">
                <div className="flex items-center bg-white rounded-full">
                  <div className="pl-4 text-[#E8500A] shrink-0">
                    <Search className="w-4 h-4" />
                  </div>
                  <input 
                    type="text" 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search deals, brands, categories..." 
                    className="w-full h-10 bg-transparent outline-none pl-3 pr-24 text-navy text-xs font-semibold placeholder-gray-500 focus:outline-none focus:ring-0 border-none animate-none" 
                  />
                  <button 
                    onClick={() => setSearchQuery(searchQuery)}
                    className="absolute right-1.5 top-1.5 bottom-1.5 px-5 rounded-full bg-gradient-to-r from-[#FF5B00] to-[#E8500A] hover:from-[#E8500A] hover:to-[#CF4400] text-white text-[9px] font-black tracking-widest uppercase flex items-center gap-1.5 shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 cursor-pointer border-0"
                  >
                    Search
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Repeating Banner / Marquee - Orange Slide Through style */}
      <div className="w-full bg-orange-primary py-2.5 px-6 overflow-hidden relative z-20">
        <div className="flex items-center gap-12 animate-marquee whitespace-nowrap">
          {Array.from({ length: 12 }).map((_, i) => (
            <span key={i} className="text-white font-black uppercase text-[11px] tracking-[0.3em] italic flex items-center gap-6">
              FREE SHIPPING. EXTRA 15% OFF. LIMITED STOCK.
              <div className="w-1.5 h-1.5 bg-white rounded-full opacity-50" />
            </span>
          ))}
        </div>
      </div>

      <main className="w-full bg-choosify-feed min-h-screen">

        {/* ACTIVE FILTER CHIPS ROW */}
        <ActiveFilterChips
          chips={[
            selectedCategory ? { id: 'category', label: `Category: ${selectedCategory}`, onRemove: () => setSelectedCategory(null) } : null,
            dealType !== 'all' ? { id: 'deal_channel', label: `Channel: ${dealType}`, onRemove: () => setDealType('all') } : null,
            minDiscount > 0 ? { id: 'discount_range', label: `Savings: ${minDiscount}%+`, onRemove: () => setMinDiscount(0) } : null
          ].filter(Boolean) as any[]}
          onClearAll={() => {
            setSelectedCategory(null);
            setDealType('all');
            setMinDiscount(0);
            setSearchQuery('');
            setActiveTab('All Deals');
          }}
        />

        {/* Master Flex Column Structure below sticky bar */}
        <div className="max-w-[1440px] mx-auto px-4 py-5 w-full grid grid-cols-1 lg:grid-cols-[240px_minmax(0,1fr)_260px] xl:grid-cols-[280px_minmax(0,1fr)_310px] gap-4 relative">
          
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
                 className="w-full h-9 pl-8 pr-3 bg-white border border-[#e8edf2] rounded-[5px] text-[11px] font-semibold text-[#1A1D4E] placeholder-gray-400 focus:outline-none focus:border-[#E8500A]/50 transition-colors shadow-sm"
               />
             </div>
             
             <QuickAccessCard />

             {/* LAYER 2: FULL SIDEBAR FILTER PANEL */}
             <div id="deals-sidebar-filters" className="transition-all duration-300 rounded-[5px] w-full">
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
                        { id: 'all-retail', label: 'Retail Only', active: dealType === 'retail', onClick: () => setDealType(dealType === 'retail' ? 'all' : 'retail') },
                        { id: 'all-wholesale', label: 'Wholesale Only', active: dealType === 'wholesale', onClick: () => setDealType(dealType === 'wholesale' ? 'all' : 'wholesale') },
                        { id: 'savings-20', label: '🔥 20%+ Off', active: minDiscount === 20, onClick: () => setMinDiscount(minDiscount === 20 ? 0 : 20) },
                        { id: 'savings-45', label: '💥 45%+ Off', active: minDiscount === 45, onClick: () => setMinDiscount(minDiscount === 45 ? 0 : 45) }
                      ]}
                    />
                  }
                  activeChips={
                    <ActiveFilterChips
                      chips={[
                        selectedCategory ? { id: 'category', label: `Category: ${selectedCategory}`, onRemove: () => setSelectedCategory(null) } : null,
                        dealType !== 'all' ? { id: 'deal_channel', label: `Channel: ${dealType}`, onRemove: () => setDealType('all') } : null,
                        minDiscount > 0 ? { id: 'discount_range', label: `Savings: ${minDiscount}%+`, onRemove: () => setMinDiscount(0) } : null
                      ].filter(Boolean) as any[]}
                      onClearAll={() => {
                        setSelectedCategory(null);
                        setDealType('all');
                        setMinDiscount(0);
                        setSearchQuery('');
                        setActiveTab('All Deals');
                      }}
                    />
                  }
                 onReset={() => {
                   setSelectedCategory(null);
                   setDealType('all');
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
                       },
                       {
                         id: 'deal_channel',
                         name: 'Sellers Channels',
                         type: 'single_select',
                         options: [
                           { value: 'all', label: 'All Channels' },
                           { value: 'retail', label: 'Retail Sales' },
                           { value: 'wholesale', label: 'Wholesale Only' }
                         ]
                       }
                     ]
                   }}
                   activeFilters={{
                     category: selectedCategory || 'all',
                     deal_channel: dealType
                   }}
                   onFilterChange={(filterId, value) => {
                     if (filterId === 'category') {
                       setSelectedCategory(value === 'all' || !value ? null : value);
                     } else if (filterId === 'deal_channel') {
                       setDealType(value || 'all');
                     }
                   }}
                 />
               </FullSidebarFilterPanel>
             </div>

             {/* Redesigned For Business & Sellers Card */}
             <div 
               id="section-sellers-deals-left" 
               className="bg-white rounded-[5px] border border-[#e8edf2] p-5 relative overflow-hidden flex flex-col justify-between text-center shrink-0 w-full shadow-sm" 
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

               <div className="border border-dashed border-[#E8500A]/20 bg-gradient-to-b from-[#FFF0E8]/20 to-white rounded-[5px] p-4 text-center flex flex-col items-center justify-center my-2 flex-1">
                 <h4 className="font-sans font-semibold text-gray-900 text-xs uppercase tracking-wider mb-1 leading-none">BOOST SALES TODAY</h4>
                 <p className="text-[10px] text-gray-500 mb-4 leading-relaxed max-w-[210px] font-semibold">
                   Gain entry to wholesale deals slots, exposure metrics, and buyer engagement streams.
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
          <div className="scroll-mt-36 min-w-0 pb-10 flex flex-col gap-10">
            
            {/* Featured Deals Showcase Grid */}
            <section className="w-full">
              <div className="mb-12 border-l-4 border-orange-primary px-6 flex flex-col md:flex-row md:items-end justify-between gap-6 w-full">
                 <div>
                    <h2 className="text-4xl md:text-5xl font-black text-navy uppercase tracking-tighter italic leading-none mb-2">FEATURED <span className="text-orange-primary">DEALS</span></h2>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.4em] italic">Handpicked Top Offers • Limited Time Selection</p>
                 </div>
                 <div className="flex items-center gap-3 bg-[#F8FAFC] px-6 py-3 rounded-[5px] border border-gray-100 shadow-sm">
                    <ShoppingBag size={16} className="text-navy" />
                    <span className="text-[11px] font-black text-navy uppercase tracking-widest italic">{filteredProducts.length} ITEMS AVAILABLE</span>
                 </div>
              </div>
   
              <div className="flex flex-col gap-6 items-center w-full">
                 {/* Banner Card */}
                 <div className="w-full lg:min-h-[395px] lg:h-auto flex-shrink-0 relative">
                    <ProductCard 
                      product={{
                        ...filteredProducts[0] || PRODUCTS[0],
                        tag: "HOT",
                        tagColor: "bg-[#E93B3B]",
                        originalPrice: "3,500"
                      }} 
                      variant="featured" titleStyle={{ minHeight: '60px', marginBottom: '11px' }}
                      showCountdown={true}
                    />
                    <div className="absolute top-4 right-16 z-30 bg-white/95 px-3 py-1.5 rounded-full border border-orange-primary/20 shadow-sm flex items-center gap-1.5">
                      <Zap size={11} className="text-orange-primary fill-orange-primary animate-pulse" />
                      <span className="text-[8px] font-black text-navy uppercase tracking-widest">ENDS IN:</span>
                      <FlashDealCountdown validUntil={(filteredProducts[0] as any)?.dealValidUntil} />
                    </div>
                 </div>
                 
                 {/* Small Cards Row */}
                 <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 w-full text-left">
                    {(filteredProducts.length > 1 ? filteredProducts : PRODUCTS).slice(1, 5).map((product) => (
                       <div key={product.id} className="w-full max-w-sm flex flex-col min-h-[270px] h-full">
                         <ProductCard 
                           product={{
                             ...product,
                             tag: "SALE",
                             tagColor: "bg-[#E98B8B]",
                           }} 
                           variant="compact"
                         />
                       </div>
                    ))}
                 </div>
              </div>
            </section>

            {/* ALL DEALS Section Container */}
            <section id="all-deals" className="w-full">
              <div className="mb-12 border-l-4 border-orange-primary px-6 text-left">
                 <h2 className="text-4xl md:text-5xl font-black text-navy uppercase tracking-tighter italic leading-none mb-2">ALL <span className="text-orange-primary">DEALS</span></h2>
                 <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.4em] italic px-2 border-l-4 border-orange-primary">Browse All Handpicked Offers</p>
              </div>

              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 w-full text-left">
                {activeTab === 'Promo Codes' ? (
                  PROMO_CODES.map((promo) => (
                    <div key={promo.code} className="bg-white border border-gray-150 rounded-[5px] p-5 flex flex-col justify-between min-h-[180px] relative overflow-hidden shadow-sm group hover:border-[#E8500A]/30 transition-all duration-300">
                      <div className="absolute top-0 right-0 w-20 h-20 bg-[#E8500A]/[0.04] rounded-full -translate-y-1/2 translate-x-1/2 blur-md" />
                      <div>
                        <div className="flex items-center gap-1.5 mb-2">
                          <Gift size={13} className="text-[#E8500A]" />
                          <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">{promo.brandName}</span>
                        </div>
                        <h4 className="text-sm font-black text-navy uppercase tracking-tight italic mb-2 leading-tight">
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
                            className="px-3 py-1 bg-[#E8500A] hover:bg-[#CF4400] text-white text-[9px] font-black uppercase tracking-wider italic rounded cursor-pointer transition-colors border-none font-sans"
                          >
                            {copiedCode === promo.code ? 'Copied' : 'Copy'}
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  (filteredProducts.length > 0 ? filteredProducts : PRODUCTS).slice(0, 12).map((product, idx) => (
                    <div key={`${product.id}-${idx}`} className="w-full max-w-sm flex flex-col min-h-[270px] h-full">
                      <ProductCard 
                        product={{
                          ...product,
                          tag: idx % 3 === 0 ? "HOT" : idx % 3 === 1 ? "SALE" : "NEW",
                          tagColor: idx % 3 === 0 ? "bg-[#E93B3B]" : idx % 3 === 1 ? "bg-[#E98B8B]" : "bg-[#7CD93B]",
                        }} 
                        variant="compact"
                      />
                    </div>
                  ))
                )}
              </div>

              <div className="mt-16 pt-12 border-t border-gray-100 flex flex-col items-center gap-8">
                <div className="flex items-center gap-3">
                  <button className="w-12 h-12 rounded-[5px] flex items-center justify-center bg-white border border-[#e8edf2] text-navy hover:bg-[#E8500A] hover:text-white hover:border-[#E8500A] transition-all shadow-none group">
                    <ArrowRight size={18} className="rotate-180 group-hover:-translate-x-1 transition-transform" />
                  </button>
                  {[1, 2, 3, '...', 12].map((p, i) => (
                    <button 
                      key={i} 
                      className={cn(
                        "w-12 h-12 rounded-[5px] flex items-center justify-center text-[11px] font-black transition-all italic",
                        p === 1 
                        ? "bg-[#E8500A] text-white border border-[#E8500A] shadow-none" 
                        : "bg-white border border-[#e8edf2] text-navy hover:border-[#E8500A] hover:text-[#E8500A] shadow-none"
                      )}
                    >
                      {p}
                    </button>
                  ))}
                  <button className="w-12 h-12 rounded-[5px] flex items-center justify-center bg-white border border-[#e8edf2] text-navy hover:bg-[#E8500A] hover:text-white hover:border-[#E8500A] transition-all shadow-none group">
                    <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
                
                <p className="text-[10px] font-black text-gray-300 uppercase tracking-[0.2em] italic">
                  Showing {Math.min(12, filteredProducts.length)} of {filteredProducts.length} deals available today
                </p>
              </div>
            </section>

          </div>

          {/* RIGHT SIDEBAR COLUMN */}
          <aside className="hidden lg:flex flex-col gap-4 lg:sticky lg:top-24 pb-10 pr-2 flex-shrink-0 animate-fade-in">
             {/* Sourcing Badge card to fill the right sidebar slot beautifully */}
             <div className="bg-white rounded-[5px] border border-[#e8edf2] p-5 shadow-sm text-left font-sans">
                <h4 className="text-[11px] font-black text-navy uppercase tracking-wider mb-2 flex items-center gap-1.5">
                   <ShieldCheck size={14} className="text-green-500 shrink-0" />
                   Verified Sourcing
                </h4>
                <p className="text-[10px] text-gray-400 leading-relaxed font-semibold">
                   Each listed bargain point is validated against native brand catalogs. Rest assured, checkout is immediate, safe, and transparent.
                </p>
             </div>
          </aside>

        </div>

        {/* Featured Brand Deals Section */}
        <section id="featured-brand-deals-section" className="py-20 bg-white px-8 relative overflow-hidden border-t border-gray-100 scroll-mt-36">
          <div className="max-w-7xl mx-auto relative z-10">
             <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
                <div>
                   <h2 className="text-3xl font-semibold text-[#1a1a2e] uppercase tracking-tight leading-none mb-3">Featured <span className="text-[#E8500A]">Brand Deals</span></h2>
                   <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest mb-1 px-2 border-l-4 border-orange-primary">Curated Premium Partner Offers • Limited Time</p>
                </div>
             </div>
             
             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {[BRANDS[0], BRANDS[1], BRANDS[2], BRANDS[8]].map((brand, i) => {
                  return (
                    <div 
                      key={i} 
                      onClick={() => navigate(`/brands/${brand.id}/products`)}
                      className="bg-white rounded-[5px] p-8 flex flex-col items-center text-center gap-6 hover:border-[#E8500A]/30 hover:scale-[1.01] transition-all duration-300 cursor-pointer border border-[#e8edf2] group relative overflow-hidden shadow-none"
                    >
                       <div className="absolute top-0 right-0 w-40 h-40 bg-orange-primary/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl group-hover:scale-125 transition-transform duration-500" />
                       
                       <div className="w-20 h-20 rounded-full bg-gray-50 flex items-center justify-center text-[#1a1a2e] font-semibold text-2xl border border-[#e8edf2] relative z-10">
                          {brand.logo}
                       </div>
                       
                       <div className="flex flex-col items-center gap-2 relative z-10">
                          <h4 className="text-xl font-semibold text-[#1a1a2e] group-hover:text-[#E8500A] transition-colors uppercase tracking-tight leading-tight">{brand.name}</h4>
                          <div className="px-4 py-1.5 bg-[#E8500A] text-white rounded text-[10px] font-semibold uppercase tracking-wider shadow-none">
                             Up to {i % 2 === 0 ? '40%' : '50%'} OFF
                          </div>
                       </div>

                       <div className="w-full h-px bg-gray-50 relative z-10" />

                       <div className="flex items-center gap-3 text-[11px] font-semibold text-[#1a1a2e] uppercase tracking-widest group-hover:text-[#E8500A] transition-colors relative z-10">
                          Grab This Deal <ArrowRight size={16} className="-rotate-45 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                       </div>
                    </div>
                  );
                })}
             </div>
             
             <div className="mt-12 flex justify-center">
                <button 
                  onClick={() => navigate('/brand-deals')}
                  className="px-8 py-3 bg-[#1A1D4E] hover:bg-[#E8500A] text-white text-xs font-semibold uppercase tracking-wider rounded transition-colors shadow-none"
                >
                   View All Brand Deals
                </button>
             </div>
          </div>
        </section>
      </main>

      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          display: inline-flex;
          animation: marquee 30s linear infinite;
        }
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
