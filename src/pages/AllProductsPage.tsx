import React, { useState, useEffect, useMemo } from 'react';
import { 
  Search, Check, Info, RotateCcw, 
  ShieldCheck, Tag, RefreshCw, Lock, PhoneCall, Heart, SlidersHorizontal,
  Sliders, ShoppingBag, Grid, List, CheckSquare, Square, Filter, ChevronDown
} from 'lucide-react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { toast } from 'react-hot-toast';
import { cn } from '../lib/utils';
import { ProductCard } from '../components/ProductCard';
import { useGlobalState } from '../context/GlobalStateContext';
import { DragScrollContainer, UniversalFilterRenderer, QuickFilterBar, ActiveFilterChips, CategorySmartFilters, FullSidebarFilterPanel, useRegisterPageFilters } from '../components/FilterEngine';
import { DcListingHero } from '../components/design/DcListingHero';
import { DcListingStickyFilters } from '../components/design/DcListingStickyFilters';
import { PaginationBar } from '../components/PaginationBar';
import {PRODUCT_CARD_GRID, PAGE_LISTING_SINGLE_SHELL } from "../lib/pageLayout";
import { useSectionScrollSpy } from '../hooks/useSectionScrollSpy';
import { ListingAdRail } from '../components/ListingAdRail';
import { AdSenseSlot } from '../components/AdSenseSlot';
import { ProductsSponsoredBanner } from '../components/commerce/AdvertiseHereCard';
import { useSponsoredFeedEntries } from '../hooks/useSponsoredFeedEntries';
import { PLACEMENT_KEYS } from '../lib/placements';

const SPONSORED_RECOMMENDATIONS = [
  {
    id: 1,
    title: 'Top 10 Smartphones to Buy in 2026',
    author: 'Farhan Rafiq',
    category: 'MOBILE',
    readTime: '15 MIN READ',
    image: 'https://images.unsplash.com/photo-1556656793-062ff9f1b74b?w=400&h=300&fit=crop',
    tagline: 'Titanium flagships to budget powerhouses'
  },
  {
    id: 3,
    title: 'Is S24 Ultra Still Worth It in Late 2026?',
    author: 'Sarah Jenkins',
    category: 'MOBILE',
    readTime: '12 MIN VIDEO',
    image: 'https://images.unsplash.com/photo-1707251759491-18d48607ea0c?w=400&h=300&fit=crop',
    tagline: 'Revisiting the titanium giant after 6 months'
  },
  {
    id: 5,
    title: 'Morning Skincare Routine for Dry Skin',
    author: 'Sarah Jenkins',
    category: 'BEAUTY',
    readTime: 'SHORTS',
    image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400&h=300&fit=crop',
    tagline: 'Deep hydration & barrier repair routine'
  }
];

export function AllProductsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { allCatalogProducts, allBrands } = useGlobalState();
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('All Products');

  // Search filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [priceMin, setPriceMin] = useState<number>(0);
  const [priceMax, setPriceMax] = useState<number>(200000);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [discountOnly, setDiscountOnly] = useState<boolean>(false);

  const handleResetFilters = () => {
    setSearchQuery('');
    setPriceMin(0);
    setPriceMax(200000);
    setSelectedCategories([]);
    setSelectedBrands([]);
    setDiscountOnly(false);
    setSortOption('popularity');
    setSearchParams(new URLSearchParams());
    toast.success('All filters reset successfully');
  };

  const handleCategoryToggle = (catName: string) => {
    setSelectedCategories(prev => 
      prev.includes(catName) ? prev.filter(c => c !== catName) : [...prev, catName]
    );
  };

  const handleBrandToggle = (brandName: string) => {
    setSelectedBrands(prev => 
      prev.includes(brandName) ? prev.filter(b => b !== brandName) : [...prev, brandName]
    );
  };

  useEffect(() => {
    const q = searchParams.get('q');
    const cat = searchParams.get('category');
    const brand = searchParams.get('brand');
    
    if (q) setSearchQuery(q);
    if (cat) setSelectedCategories([cat]);
    if (brand) setSelectedBrands([brand]);
    
    // Simulate loading on mount
    setIsLoading(true);
    const t = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(t);
  }, [searchParams]);

  // Combine products
  const allProductsCombined = useMemo(() => {
    const combined = [...FEATURED_PRODUCTS_MOCK, ...GENERATED_PRODUCTS];
    const uniqueMap = new Map();
    combined.forEach(p => {
      if (!uniqueMap.has(p.id)) {
        uniqueMap.set(p.id, p);
      }
    });
    return Array.from(uniqueMap.values());
  }, []);

  const uniqueCategories = useMemo(() => {
    const cats = new Set(allProductsCombined.map(p => p.category).filter(Boolean));
    return Array.from(cats).sort();
  }, [allProductsCombined]);

  const uniqueBrands = useMemo(() => {
    const brands = new Set(allProductsCombined.map(p => p.brand).filter(Boolean));
    return Array.from(brands).sort();
  }, [allProductsCombined]);

  const parsePrice = (priceStr: string | number): number => {
    if (typeof priceStr === 'number') return priceStr;
    if (!priceStr) return 0;
    return Number(priceStr.replace(/[^0-9.-]+/g, ''));
  };

  // Register filters
  useRegisterPageFilters({
    pageName: 'Products',
    scrollTargetId: 'all-products-display',
    sectionNav: {
      items: sectionNavItems,
      activeId: activeSectionId,
      onNavigate: scrollToSection,
      allLabel: 'Products',
      profileLabel: 'Product catalog',
    },
    renderSearch: () => (
      <div className="relative">
        <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
          <Search size={13} className="text-[#E8500A]" />
        </div>
        <input
          type="text"
          value={sidebarSearch}
          onChange={(e) => setSidebarSearch(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && executeSearch(sidebarSearch)}
          placeholder="Search products, brands or details..."
          className="w-full h-9 pl-8 pr-3 bg-white border border-[#eef2f6] rounded-2xl text-[11px] font-semibold text-[#1A1D4E] placeholder-gray-400 focus:outline-none focus:border-[#E8500A]/50 transition-colors"
        />
      </div>
    ),
    quickFilters: [
      { id: 'in-stock', label: 'In Stock Only', active: availabilityFilter === 'in-stock', onClick: () => setAvailabilityFilter(availabilityFilter === 'in-stock' ? 'all' : 'in-stock') },
      { id: 'trending', label: 'ðŸ”¥ Trending', active: activeTab === 'Bestsellers', onClick: () => setActiveTab(activeTab === 'Bestsellers' ? 'All Products' : 'Bestsellers') },
      { id: 'top-rated', label: '⭐ Top Rated', active: activeTab === 'COD Ready', onClick: () => setActiveTab(activeTab === 'COD Ready' ? 'All Products' : 'COD Ready') },
      { id: 'price-low', label: 'Under ৳5,000', active: maxPrice === '5000', onClick: () => { setMinPrice(''); setMaxPrice(maxPrice === '5000' ? '' : '5000'); } }
    ],
    renderFilters: () => (
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5 font-sans">
          <label className="text-[10px] font-black text-[#8a9bb0] uppercase tracking-wider">Sort Listings By</label>
          <select
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value as any)}
            className="w-full h-10 px-3 bg-[#F4F8FA] border border-[#eef2f6] rounded-2xl text-xs font-semibold text-navy outline-none focus:border-orange-primary/30"
          >
            <RotateCcw size={10} strokeWidth={3} />
            Reset
          </button>
        </div>

        {/* Search */}
        <div className="space-y-3">
          <h4 className="text-[10px] font-black text-slate-400 tracking-widest uppercase">Search Query</h4>
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search items..."
              className="w-full h-10 pl-9 pr-4 bg-slate-50 border-0 rounded-lg text-xs font-bold text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#FF5B00]/20 transition-all font-sans"
            />
          </div>
        </div>

        {/* Special Filters */}
        <div className="space-y-3">
           <h4 className="text-[10px] font-black text-slate-400 tracking-widest uppercase">Quick Filters</h4>
           <div 
             onClick={() => setDiscountOnly(!discountOnly)}
             className="flex items-center gap-2.5 py-1.5 group cursor-pointer text-left"
           >
             <div className={cn(
               "w-4.5 h-4.5 rounded-md border flex items-center justify-center transition-all shrink-0 bg-white",
               discountOnly ? "border-transparent bg-[#FF5B00] text-white shadow-md shadow-[#FF5B00]/20" : "border-slate-200 group-hover:border-slate-300"
             )}>
               {discountOnly && <Check size={11} strokeWidth={3} className="text-white" />}
             </div>
             <span className={cn(
               "text-xs font-bold transition-colors uppercase tracking-wider",
               discountOnly ? "text-[#FF5B00] font-black" : "text-slate-600 group-hover:text-slate-900"
             )}>
               Discounts Only
             </span>
           </div>
        </div>

        <div className="bg-white rounded-2xl p-4.5 border border-[#eef2f6] shadow-sm space-y-4 text-left">
          <div className="flex items-center justify-between pb-2 border-b border-[#eef2f6]">
            <h3 className="text-[10px] font-black uppercase tracking-widest text-[#8a9bb0]">
              Price Range
            </h3>
            {(priceMin > 0 || priceMax < 999999) && (
              <button
                onClick={() => { setPriceMin(0); setPriceMax(999999); }}
                className="text-[9px] font-black text-app-text-secondary hover:text-orange-primary underline ml-auto"
              >
                Reset
              </button>
            )}
          </div>
          <div className="flex items-center gap-3">
            <div>
              <span className="text-[9px] font-bold text-slate-400 uppercase">Min Price</span>
              <input
                type="number"
                value={priceMin}
                onChange={(e) => setPriceMin(Number(e.target.value))}
                className="w-full h-10 px-3 bg-slate-50 border-0 rounded-lg text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#FF5B00]/20 font-sans mt-1"
              />
            </div>
            <div>
              <span className="text-[9px] font-bold text-slate-400 uppercase">Max Price</span>
              <input
                type="number"
                value={priceMax}
                onChange={(e) => setPriceMax(Number(e.target.value))}
                className="w-full h-10 px-3 bg-slate-50 border-0 rounded-lg text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#FF5B00]/20 font-sans mt-1"
              />
            </div>
          </div>
        </div>

        {/* Categories Section */}
        <div className="space-y-3">
          <h4 className="text-[10px] font-black text-slate-400 tracking-widest uppercase">Collections</h4>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {uniqueCategories.map((cat) => {
              const isChecked = selectedCategories.includes(cat);
              return (
                <div
                  key={cat}
                  onClick={() => handleCategoryToggle(cat)}
                  className="flex items-center gap-2.5 py-1.5 group cursor-pointer text-left"
                >
                  <div className={cn(
                    "w-4.5 h-4.5 rounded-md border flex items-center justify-center transition-all shrink-0 bg-white",
                    isChecked ? "border-transparent bg-[#FF5B00] text-white shadow-md shadow-[#FF5B00]/20" : "border-slate-200 group-hover:border-slate-300"
                  )}>
                    {isChecked && <Check size={11} strokeWidth={3} className="text-white" />}
                  </div>
                  <span className={cn(
                    "text-xs font-bold transition-colors uppercase tracking-wider",
                    isChecked ? "text-[#FF5B00] font-black" : "text-slate-600 group-hover:text-slate-900"
                  )}>
                    {cat}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Brands Section */}
        <div className="space-y-3">
          <h4 className="text-[10px] font-black text-slate-400 tracking-widest uppercase">Brands</h4>
          <div className="space-y-2 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
            {uniqueBrands.map((brand) => {
              const isChecked = selectedBrands.includes(brand);
              return (
                <div
                  key={brand}
                  onClick={() => handleBrandToggle(brand)}
                  className="flex items-center gap-2.5 py-1.5 group cursor-pointer text-left"
                >
                  <div className={cn(
                    "w-4.5 h-4.5 rounded-md border flex items-center justify-center transition-all shrink-0 bg-white",
                    isChecked ? "border-transparent bg-[#FF5B00] text-white shadow-md shadow-[#FF5B00]/20" : "border-slate-200 group-hover:border-slate-300"
                  )}>
                    {isChecked && <Check size={11} strokeWidth={3} className="text-white" />}
                  </div>
                  <span className={cn(
                    "text-xs font-bold transition-colors uppercase tracking-wider",
                    isChecked ? "text-[#FF5B00] font-black" : "text-slate-600 group-hover:text-slate-900"
                  )}>
                    {brand}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    )
  }, [selectedCategories, selectedBrands, discountOnly, priceMin, priceMax, searchQuery, uniqueCategories, uniqueBrands]);

  // Main Filtering Engine
  const filteredProducts = useMemo(() => {
    let result = allProductsCombined.filter(product => {
      // 1. Search Query Match
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const titleMatch = product.title?.toLowerCase().includes(query);
        const brandMatch = product.brand?.toLowerCase().includes(query);
        const catMatch = product.category?.toLowerCase().includes(query);
        
        if (!titleMatch && !brandMatch && !catMatch) {
          return false;
        }
      }

      // 2. Category Filter
      if (selectedCategories.length > 0) {
        if (!selectedCategories.includes(product.category)) {
          return false;
        }
      }

      // 3. Brand Filter
      if (selectedBrands.length > 0) {
        if (!selectedBrands.includes(product.brand)) {
          return false;
        }
      }

      // 4. Discount Filter
      if (discountOnly) {
        if (!product.discount) {
          return false;
        }
      }

      // 5. Price Range Filter
      const productPrice = parsePrice(product.price);
      if (productPrice < priceMin || productPrice > priceMax) {
        return false;
      }

      return true;
    });

    // 6. Sort Processing
    if (sortOption === 'price-asc') {
      result.sort((a, b) => parsePrice(a.price) - parsePrice(b.price));
    } else if (sortOption === 'price-desc') {
      result.sort((a, b) => parsePrice(b.price) - parsePrice(a.price));
    } else if (sortOption === 'popularity') {
      // Sort by rating desc
      result.sort((a, b) => {
        const ratingA = typeof a.rating === 'number' ? a.rating : 4.5;
        const ratingB = typeof b.rating === 'number' ? b.rating : 4.5;
        return ratingB - ratingA;
      });
    }

    return result;
  }, [allCatalogProducts, searchParams, selectedCategory, selectedBrand, ratingFilter, availabilityFilter, retailPriceLimit, minPrice, maxPrice, sortOption, activeTab, activeSpecs, priceMin, priceMax, allBrands]);

  function handleResetFilters() {
    setSelectedCategory(null);
    setSelectedBrand(null);
    setRatingFilter(null);
    setAvailabilityFilter('all');
    setRetailPriceLimit(30000);
    setMinPrice('');
    setMaxPrice('');
    setPriceError('');
    setSidebarSearch('');
    setActiveSpecs({});
    setPriceMin(0);
    setPriceMax(999999);
    setSearchParams(new URLSearchParams());
  }

  const productFeed = useSponsoredFeedEntries(
    'products',
    filteredProducts,
    (product) => `product-${product.id}`,
    { enabled: viewMode === 'grid' },
  );

  const productsSponsoredBanner = useMemo(() => {
    const entry = productFeed.find((e) => e.kind === 'sponsored');
    if (!entry || entry.kind !== 'sponsored') return null;
    return entry.sponsored;
  }, [productFeed]);

  return (
    <div className="flex flex-col min-h-screen bg-[#F4F7F9]">
      <DcListingHero
        titleBefore="Explore Every"
        titleHighlight="Product"
        searchPlaceholder="Search products..."
        quickChips={['Smartphones', 'Laptops', 'AC', 'TV', 'Fashion', 'Beauty']}
        onSearch={(q) => executeSearch(q)}
        onChipClick={(q) => executeSearch(q)}
      />

      <DcListingStickyFilters
        overlapHero
        items={[
          {
            id: 'verified',
            icon: '🛡',
            name: 'Verified Products',
            sub: 'Trusted only',
            bg: '#FFF3EA',
            active: availabilityFilter === 'in-stock',
            onClick: () => setAvailabilityFilter(availabilityFilter === 'in-stock' ? 'all' : 'in-stock'),
          },
          {
            id: 'reviews',
            icon: '★',
            name: 'Real Reviews',
            sub: 'User verified',
            bg: '#FFF3EA',
            active: ratingFilter === 4.5,
            onClick: () => setRatingFilter(ratingFilter === 4.5 ? null : 4.5),
          },
          {
            id: 'deals',
            icon: '🔥',
            name: 'Top Deals & Offers',
            sub: 'Save more',
            bg: '#FDECEC',
            active: activeTab === 'Flash Deals',
            onClick: () => setActiveTab(activeTab === 'Flash Deals' ? 'All Products' : 'Flash Deals'),
          },
          {
            id: 'new',
            icon: '✨',
            name: 'New Arrivals',
            sub: 'Just launched',
            bg: '#EFECFD',
            active: activeTab === 'New Arrivals',
            onClick: () => setActiveTab(activeTab === 'New Arrivals' ? 'All Products' : 'New Arrivals'),
          },
          {
            id: 'popular',
            icon: '⭐',
            name: 'Popular Picks',
            sub: 'Trending now',
            bg: '#FEF3E2',
            active: activeTab === 'Bestsellers',
            onClick: () => setActiveTab(activeTab === 'Bestsellers' ? 'All Products' : 'Bestsellers'),
          },
        ]}
      />

      {/* ACTIVE FILTER CHIPS ROW */}
      <ActiveFilterChips
        chips={[
          selectedCategory ? { id: 'category', label: `Cat: ${selectedCategory}`, onRemove: () => setSelectedCategory(null) } : null,
          selectedBrand ? { id: 'brand', label: `Brand: ${selectedBrand}`, onRemove: () => setSelectedBrand(null) } : null,
          ratingFilter ? { id: 'rating', label: `Rating: ${ratingFilter}★ +`, onRemove: () => setRatingFilter(null) } : null,
          availabilityFilter !== 'all' ? { id: 'availability', label: `Status: ${availabilityFilter}`, onRemove: () => setAvailabilityFilter('all') } : null,
          (minPrice || maxPrice) ? { id: 'price', label: `Price: ৳${minPrice || '0'} - ${maxPrice || 'Any'}`, onRemove: () => { setMinPrice(''); setMaxPrice(''); } } : null,
          (priceMin > 0 || priceMax < 999999) ? { id: 'priceRange', label: `Range: ৳${priceMin.toLocaleString()} - ৳${priceMax.toLocaleString()}`, onRemove: () => { setPriceMin(0); setPriceMax(999999); } } : null,
          ...Object.entries(activeSpecs).map(([key, value]) => {
            if (!value) return null;
            return { id: `spec-${key}`, label: `${key.toUpperCase()}: ${value}`, onRemove: () => setActiveSpecs(prev => ({ ...prev, [key]: '' })) };
          })
        ].filter(Boolean) as any[]}
        onClearAll={handleResetFilters}
      />

      <div className={`max-w-[1440px] mx-auto px-4 sm:px-5 lg:px-6 py-6 md:py-10 w-full ${PAGE_LISTING_SINGLE_SHELL}`}>
        
        {/* Controls Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button 
              onClick={() => setGlobalFilterOpen(true)}
              className="flex items-center gap-2 bg-white px-5 py-3 rounded-full text-xs font-black text-[#000435] shadow-[0_8px_30px_rgb(0,0,0,0.06)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.1)] transition-all border-0 tracking-widest uppercase cursor-pointer shrink-0"
            >
              <SlidersHorizontal size={14} className="text-[#FF5B00]" />
              Filters
            </button>
            <div className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">
              {filteredProducts.length} Results
            </div>
            <input
              type="text"
              value={sidebarSearch}
              onChange={(e) => setSidebarSearch(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && executeSearch(sidebarSearch)}
              placeholder="Search products, brands or details..."
              className="w-full h-9 pl-8 pr-3 bg-white border border-[#eef2f6] rounded-2xl text-[11px] font-semibold text-[#1A1D4E] placeholder-gray-400 focus:outline-none focus:border-[#E8500A]/50 transition-colors shadow-sm"
            />
          </div>
          
          {/* LAYER 2: FULL SIDEBAR FILTER PANEL */}
          <div id="global-sidebar-filters" className="transition-all duration-300 rounded-2xl">
            <FullSidebarFilterPanel
              title="Filter Catalog"
              onReset={handleResetFilters}
              searchQuery={sidebarSearch}
              setSearchQuery={setSidebarSearch}
              onSearchSubmit={executeSearch}
              searchPlaceholder="Search products, brands or details..."
              quickFilters={
                <QuickFilterBar
                  title="Products Quick Specs"
                  onOpenFullFilters={() => {}}
                  filters={[
                    { id: 'in-stock', label: 'In Stock Only', active: availabilityFilter === 'in-stock', onClick: () => setAvailabilityFilter(availabilityFilter === 'in-stock' ? 'all' : 'in-stock') },
                    { id: 'trending', label: 'ðŸ”¥ Trending', active: activeTab === 'Bestsellers', onClick: () => setActiveTab(activeTab === 'Bestsellers' ? 'All Products' : 'Bestsellers') },
                    { id: 'top-rated', label: '⭐ Top Rated', active: activeTab === 'COD Ready', onClick: () => setActiveTab(activeTab === 'COD Ready' ? 'All Products' : 'COD Ready') },
                    { id: 'price-low', label: 'Under ৳5,000', active: maxPrice === '5000', onClick: () => { setMinPrice(''); setMaxPrice(maxPrice === '5000' ? '' : '5000'); } }
                  ]}
                />
              }
              activeChips={
                <ActiveFilterChips
                  chips={[
                    selectedCategory ? { id: 'category', label: `Cat: ${selectedCategory}`, onRemove: () => setSelectedCategory(null) } : null,
                    selectedBrand ? { id: 'brand', label: `Brand: ${selectedBrand}`, onRemove: () => setSelectedBrand(null) } : null,
                    ratingFilter ? { id: 'rating', label: `Rating: ${ratingFilter}★ +`, onRemove: () => setRatingFilter(null) } : null,
                    availabilityFilter !== 'all' ? { id: 'availability', label: `Status: ${availabilityFilter}`, onRemove: () => setAvailabilityFilter('all') } : null,
                    (minPrice || maxPrice) ? { id: 'price', label: `Price: ৳${minPrice || '0'} - ${maxPrice || 'Any'}`, onRemove: () => { setMinPrice(''); setMaxPrice(''); } } : null,
                    (priceMin > 0 || priceMax < 999999) ? { id: 'priceRange', label: `Range: ৳${priceMin.toLocaleString()} - ৳${priceMax.toLocaleString()}`, onRemove: () => { setPriceMin(0); setPriceMax(999999); } } : null,
                    ...Object.entries(activeSpecs).map(([key, value]) => {
                      if (!value) return null;
                      return { id: `spec-${key}`, label: `${key.toUpperCase()}: ${value}`, onRemove: () => setActiveSpecs(prev => ({ ...prev, [key]: '' })) };
                    })
                  ].filter(Boolean) as any[]}
                  onClearAll={handleResetFilters}
                />
              }
              sorting={
                <div className="flex flex-col gap-1.5 font-sans">
                  <label className="text-[10px] font-black text-[#8a9bb0] uppercase tracking-wider">Sort Listings By</label>
                  <select
                    value={sortOption}
                    onChange={(e) => setSortOption(e.target.value as any)}
                    className="w-full h-10 px-3 bg-[#F4F8FA] border border-[#eef2f6] rounded-2xl text-xs font-semibold text-navy outline-none focus:border-orange-primary/30"
                  >
                    <option value="featured">Featured / Recommended</option>
                    <option value="price-asc">Price: Low to High</option>
                    <option value="price-desc">Price: High to Low</option>
                    <option value="rating-desc">Rating: High to Low</option>
                  </select>
                </div>
              }
              advancedSection={
                <div className="flex flex-col gap-4">
                  <UniversalFilterRenderer
                    profile={{
                      entity: 'products',
                      filters: [
                        {
                          id: 'rating',
                          name: 'Rating Score',
                          type: 'single_select',
                          options: [
                            { value: 'all', label: 'All Ratings' },
                            { value: '4.8', label: '4.8★ & Up' },
                            { value: '4.5', label: '4.5★ & Up' },
                            { value: '4.0', label: '4.0★ & Up' }
                          ]
                        },
                        {
                          id: 'availability',
                          name: 'Availability',
                          type: 'single_select',
                          options: [
                            { value: 'all', label: 'All Items' },
                            { value: 'in-stock', label: 'In Stock Only' },
                            { value: 'out-of-stock', label: 'Out of Stock' }
                          ]
                        }
                      ]
                    }}
                    activeFilters={{
                      rating: ratingFilter ? ratingFilter.toString() : 'all',
                      availability: availabilityFilter
                    }}
                    onFilterChange={(filterId, value) => {
                      if (filterId === 'rating') {
                        setRatingFilter(value === 'all' || !value ? null : parseFloat(value));
                      } else if (filterId === 'availability') {
                        setAvailabilityFilter(value || 'all');
                      }
                    }}
                  />

                  {/* Price Range Section (Fix 2) */}
                  <div className="bg-white rounded-2xl p-4.5 border border-[#eef2f6] shadow-sm space-y-4 text-left">
                    <div className="flex items-center justify-between pb-2 border-b border-[#eef2f6]">
                      <h3 className="text-[10px] font-black uppercase tracking-widest text-[#8a9bb0]">
                        Price Range
                      </h3>
                      {(priceMin > 0 || priceMax < 999999) && (
                        <button
                          onClick={() => { setPriceMin(0); setPriceMax(999999); }}
                          className="text-[9px] font-black text-app-text-secondary hover:text-orange-primary underline ml-auto"
                        >
                          Reset
                        </button>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <div className="flex-1">
                        <input
                          type="number"
                          placeholder="Min"
                          value={priceMin === 0 ? '' : priceMin}
                          onChange={e => {
                            const val = Math.max(0, Number(e.target.value) || 0);
                            setPriceMin(Math.min(val, priceMax - 1));
                          }}
                          className="h-9 px-3 rounded-lg bg-gray-50 border border-gray-200 text-[11px] font-bold w-full focus:outline-none focus:border-orange-primary"
                        />
                      </div>
                      <span className="text-gray-400 text-xs text-center font-bold px-1">to</span>
                      <div className="flex-1">
                        <input
                          type="number"
                          placeholder="Max"
                          value={priceMax === 999999 ? '' : priceMax}
                          onChange={e => {
                            const val = Math.max(1, Number(e.target.value) || 999999);
                            setPriceMax(Math.max(val, priceMin + 1));
                          }}
                          className="h-9 px-3 rounded-lg bg-gray-50 border border-gray-200 text-[11px] font-bold w-full focus:outline-none focus:border-orange-primary"
                        />
                      </div>
                    </div>

                    {priceMin >= priceMax && (
                      <p className="text-[9px] text-red-500 font-bold mt-1">
                        Min price must be less than max price
                      </p>
                    )}

                    <div className="text-[10.5px] font-bold text-navy uppercase tracking-wider">
                      ৳{priceMin.toLocaleString()} — ৳{priceMax.toLocaleString()}
                    </div>
                  </div>

                  <CategorySmartFilters
                    category={selectedCategory}
                    activeSpecs={activeSpecs}
                    onSpecChange={(key, value) => {
                      setActiveSpecs(prev => ({ ...prev, [key]: value || '' }));
                    }}
                  />
                </div>
              }
            >
              <span>
                Sort: {sortOption === 'popularity' ? 'Popularity' : sortOption === 'price-asc' ? 'Lowest Price' : 'Highest Price'}
              </span>
              <ChevronDown size={14} className={cn("transition-transform duration-300", isSortDropdownOpen && "rotate-180")} />
            </button>
            
            <AnimatePresence>
              {isSortDropdownOpen && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute right-0 top-[115%] w-full sm:w-64 bg-white rounded-[24px] shadow-[0_20px_40px_rgba(0,0,0,0.12)] p-2 z-50 overflow-hidden"
                >
                  <div className="flex flex-col">
                    <button 
                      onClick={() => { setSortOption('popularity'); setIsSortDropdownOpen(false); }}
                      className={cn("px-4 py-3 text-left text-xs font-black uppercase tracking-widest rounded-xl transition-colors border-0 cursor-pointer", sortOption === 'popularity' ? "bg-slate-50 text-[#FF5B00]" : "bg-transparent text-[#000435] hover:bg-slate-50")}
                    >
                      Popularity
                    </button>
                    <button 
                      onClick={() => { setSortOption('price-asc'); setIsSortDropdownOpen(false); }}
                      className={cn("px-4 py-3 text-left text-xs font-black uppercase tracking-widest rounded-xl transition-colors border-0 cursor-pointer", sortOption === 'price-asc' ? "bg-slate-50 text-[#FF5B00]" : "bg-transparent text-[#000435] hover:bg-slate-50")}
                    >
                      Lowest Price
                    </button>
                    <button 
                      onClick={() => { setSortOption('price-desc'); setIsSortDropdownOpen(false); }}
                      className={cn("px-4 py-3 text-left text-xs font-black uppercase tracking-widest rounded-xl transition-colors border-0 cursor-pointer", sortOption === 'price-desc' ? "bg-slate-50 text-[#FF5B00]" : "bg-transparent text-[#000435] hover:bg-slate-50")}
                    >
                      Highest Price
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Product Grid Area */}
        <div className="w-full">
          <ActiveFilterChips 
            onClearAll={handleResetFilters}
            chips={[...(searchQuery ? [{ id: Math.random().toString(), label: `Search: ${searchQuery}`, onRemove: () => setSearchQuery('') }] : []),
              ...(discountOnly ? [{ id: Math.random().toString(), label: 'Discounts Only', onRemove: () => setDiscountOnly(false) }] : []),
              ...selectedCategories.map(c => ({ id: Math.random().toString(), label: c, onRemove: () => handleCategoryToggle(c) })),
              ...selectedBrands.map(b => ({ id: Math.random().toString(), label: b, onRemove: () => handleBrandToggle(b) })),
              ...(priceMin > 0 ? [{ id: Math.random().toString(), label: `Min $${priceMin}`, onRemove: () => setPriceMin(0) }] : []),
              ...(priceMax < 200000 ? [{ id: Math.random().toString(), label: `Max $${priceMax}`, onRemove: () => setPriceMax(200000) }] : [])]}
          />

          {/* Choosify.dc.html — full-width sponsored banner above grid */}
          {!isLoading && filteredProducts.length > 0 && (
            <ProductsSponsoredBanner
              title={productsSponsoredBanner?.title || undefined}
              subtitle={
                productsSponsoredBanner?.subtitle ||
                productsSponsoredBanner?.sponsorName ||
                undefined
              }
              href={productsSponsoredBanner?.href || '/advertise'}
              imageUrl={productsSponsoredBanner?.image || undefined}
              ctaLabel={productsSponsoredBanner?.ctaLabel || 'Shop Now →'}
            />
          )}

          {/* Product Grid */}
          {isLoading ? (
            <div className="grid grid-cols-1 min-[400px]:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 min-[1200px]:grid-cols-5 min-[1600px]:grid-cols-6 gap-6">
              {Array.from({ length: 10 }).map((_, idx) => (
                <div key={idx} className="bg-white rounded-2xl p-5 h-[380px] animate-pulse border-0 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
                  <div className="w-full aspect-[4/3] bg-slate-100 rounded-xl mb-6" />
                  <div className="h-4 bg-slate-100 rounded w-2/3 mb-3" />
                  <div className="h-3 bg-slate-100 rounded w-1/2" />
                </div>
              ))}
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="py-24 text-center bg-white rounded-3xl border border-gray-100 shadow-sm flex flex-col items-center justify-center gap-4 text-gray-400">
              <SlidersHorizontal size={40} className="stroke-1 text-gray-300" />
              <div className="text-sm font-semibold tracking-tight text-[#1A1A2E]">No products matched active filters.</div>
              <p className="text-[10px] max-w-sm leading-relaxed font-bold">Try lowering your minimum order quantity filter or clearing search queries to explore the full authorized selection.</p>
              <button onClick={handleResetFilters} className="px-5 py-2.5 bg-[#FF5B00] text-white text-[13px] font-bold tracking-tight rounded-lg shadow-sm hover:brightness-110">Clear Filters</button>
            </div>
          ) : (
            <div className={cn(
              "mb-20 w-full",
              viewMode === 'grid' 
                ? PRODUCT_CARD_GRID
                : "flex flex-col gap-6"
            )}>
              {productFeed.map((entry) =>
                entry.kind === 'sponsored' ? null : viewMode === 'list' ? (
                  <ProductCard
                    key={entry.key}
                    product={entry.item}
                    variant="list"
                  />
                ) : (
                  <ProductCard
                    key={entry.key}
                    product={entry.item}
                    variant="grid"
                  />
                ),
              )}
            </div>
          )}
        </div>

          <PaginationBar
            showingCount={filteredProducts.length}
            totalCount={filteredProducts.length}
          />

          <AdSenseSlot format="infeed" className="mt-6" />
        </main>

        {/* RIGHT SIDEBAR WITH PREMIUM AARONG AD BANNER */}
        <aside className="hidden lg:flex flex-col gap-4 lg:sticky lg:top-24 pb-10 pr-2 flex-shrink-0 animate-fade-in">
          {/* Sponsored Recommendations Card */}
          <div className="bg-white rounded-2xl border border-[#eef2f6] p-4.5 shadow-sm text-left relative overflow-hidden w-full flex flex-col">
             <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#eef2f6] px-1">
                <h3 className="text-[11px] font-semibold text-[#8a9bb0] uppercase tracking-wider">
                   ðŸ‘‰ Sponsored Recommendations
                </h3>
                <Link 
                   to="/recommendations" 
                   className="text-[10px] font-bold text-orange-primary hover:underline flex items-center gap-1 shrink-0"
                >
                   See All →
                </Link>
             </div>

             <div className="flex flex-col gap-3">
                {SPONSORED_RECOMMENDATIONS.length === 0 ? (
                   <div className="text-center py-6 border border-dashed border-gray-200 rounded-2xl">
                      <p className="text-xs text-gray-400 font-medium px-2">Sponsored recommendations will appear here.</p>
                   </div>
                ) : (
                   SPONSORED_RECOMMENDATIONS.map((item) => (
                      <Link 
                         to={`/recommendations/${item.id}`}
                         key={item.id} 
                         className="flex items-start gap-3 bg-white border border-[#eef2f6]/60 rounded-2xl p-2 hover:shadow-soft hover:border-[#E8500A]/10 transition-all duration-300 group cursor-pointer"
                      >
                         <div className="w-12 h-12 rounded-lg overflow-hidden shrink-0 border border-gray-100 bg-gray-50 flex items-center justify-center relative">
                            <img 
                               src={item.image} 
                               alt={item.title} 
                               className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                               referrerPolicy="no-referrer"
                            />
                            <span className="absolute bottom-0 right-0 bg-[#E8500A]/90 text-white text-[6px] font-black px-1 py-0.5 rounded-tl-md tracking-wider">AD</span>
                         </div>
                         <div className="flex-1 min-w-0 flex flex-col justify-center text-left">
                            <span className="text-[7.5px] font-black text-[#E8500A] uppercase tracking-widest leading-none block mb-0.5">{item.category}</span>
                            <h4 className="font-sans text-[11px] font-bold tracking-tight text-[#1A1D4E] group-hover:text-[#E8500A] transition-colors line-clamp-2 leading-tight">
                               {item.title}
                            </h4>
                            <p className="text-[8px] font-bold text-gray-450 truncate mt-0.5 uppercase tracking-wide">
                               {item.readTime} Â· BY {item.author}
                            </p>
                          </div>
                      </Link>
                   ))
                )}
             </div>
          </div>
        </section>

      </main>
    </div>
  );
}
