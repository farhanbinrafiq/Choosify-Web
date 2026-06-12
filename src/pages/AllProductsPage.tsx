import React, { useState, useEffect } from 'react';
import { Search, ChevronDown, ChevronRight, Star, Filter, Bookmark, Grid, List as ListIcon, X, SlidersHorizontal, Calculator, Layers, Award, Flame, Clock, Sparkles } from 'lucide-react';
import { useSearchParams, Link } from 'react-router-dom';
import { cn } from '../lib/utils';
import { motion } from 'motion/react';
import { ProductCard } from '../components/ProductCard';
import { ProductCardSkeleton } from '../components/Skeleton';
import { useGlobalState } from '../context/GlobalStateContext';

export function AllProductsPage() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchParams, setSearchParams] = useSearchParams();
  const { allProducts, allBrands, mode } = useGlobalState();
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('All Products');

  // Trigger brief simulation of fetching state on filter change / refresh to boost perceived interaction response
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 600);
    return () => clearTimeout(timer);
  }, [mode, searchParams, activeTab]);

  // Active query parameters / search inputs
  const rawQuery = searchParams.get('q') || '';
  const [sidebarSearch, setSidebarSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(searchParams.get('category') || null);
  const [selectedBrand, setSelectedBrand] = useState<string | null>(null);
  const [moqFilter, setMoqFilter] = useState<number>(0);
  const [priceTierSlab, setPriceTierSlab] = useState<number>(100000);
  const [sortOption, setSortOption] = useState<'popular' | 'price-asc' | 'price-desc' | 'moq-asc'>('popular');

  // Sync internal state with URL query parameters initially and on changes
  useEffect(() => {
    if (rawQuery) {
      setSidebarSearch(rawQuery);
    }
    const categoryParam = searchParams.get('category');
    if (categoryParam) {
      setSelectedCategory(categoryParam);
    }
  }, [rawQuery, searchParams]);

  // Handle local text search execute
  const executeSearch = (term: string) => {
    const updated = new URLSearchParams(searchParams);
    if (term.trim()) {
      updated.set('q', term);
    } else {
      updated.delete('q');
    }
    setSearchParams(updated);
  };

  // Dynamically group categories & brands from active mode's actual dataset to respect data isolation
  const dynamicCategories = React.useMemo(() => {
    const counts: { [name: string]: number } = {};
    allProducts.forEach(p => {
      const cat = p.category || 'Other';
      counts[cat] = (counts[cat] || 0) + 1;
    });
    return Object.entries(counts).map(([name, count]) => ({
      name,
      count,
      checked: selectedCategory === name
    }));
  }, [allProducts, selectedCategory]);

  const dynamicBrands = React.useMemo(() => {
    const counts: { [name: string]: number } = {};
    allProducts.forEach(p => {
      const brandObj = allBrands.find(b => b.id === p.brandId);
      const bName = brandObj ? brandObj.name : 'Apex';
      counts[bName] = (counts[bName] || 0) + 1;
    });
    return Object.entries(counts).map(([name, count]) => ({
      name,
      count,
      checked: selectedBrand === name
    }));
  }, [allProducts, allBrands, selectedBrand]);

  // Core reactive filtering logic
  const filteredProducts = React.useMemo(() => {
    let result = [...allProducts];

    // 0. Tab Selection Filtering
    if (activeTab === 'Trending') {
      result = result.filter(p => p.stock && p.stock > 100);
    } else if (activeTab === 'Popular') {
      result = result.filter(p => !p.id || p.id % 2 === 0);
    } else if (activeTab === 'Newest') {
      result = [...result].reverse();
    } else if (activeTab === 'Top Rated') {
      result = result.filter(p => p.codSupport);
    } else if (activeTab === 'Featured') {
      result = result.filter(p => p.id && Math.floor(p.id) % 3 === 0);
    }

    // 1. Text Search across Title, Description, Brand, and Category
    const textQuery = (searchParams.get('q') || '').toLowerCase().trim();
    if (textQuery) {
      result = result.filter(p => {
        const brandObj = allBrands.find(b => b.id === p.brandId);
        const bName = brandObj ? brandObj.name : '';
        return (
          p.title.toLowerCase().includes(textQuery) ||
          (p.description || '').toLowerCase().includes(textQuery) ||
          bName.toLowerCase().includes(textQuery) ||
          (p.category || '').toLowerCase().includes(textQuery)
        );
      });
    }

    // 2. Class/Category Selection
    if (selectedCategory) {
      result = result.filter(p => p.category === selectedCategory);
    }

    // 3. Brand Selection
    if (selectedBrand) {
      result = result.filter(p => {
        const brandObj = allBrands.find(b => b.id === p.brandId);
        return brandObj && brandObj.name === selectedBrand;
      });
    }

    // 4. B2B Specific: Filters by maximum MOQ allowed (e.g. Show items with MOQ <= user preferred MOQ)
    if (mode === 'wholesale' && moqFilter > 0) {
      result = result.filter(p => (p.moq || 0) <= moqFilter);
    }

    // 5. B2B Specific: Price Slab target limits
    if (priceTierSlab < 100000) {
      result = result.filter(p => p.price <= priceTierSlab);
    }

    // 6. Sorting logic
    if (sortOption === 'price-asc') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortOption === 'price-desc') {
      result.sort((a, b) => b.price - a.price);
    } else if (sortOption === 'moq-asc') {
      result.sort((a, b) => (a.moq || 0) - (b.moq || 0));
    }

    return result;
  }, [allProducts, searchParams, selectedCategory, selectedBrand, mode, moqFilter, priceTierSlab, sortOption, activeTab]);

  const handleResetFilters = () => {
    setSelectedCategory(null);
    setSelectedBrand(null);
    setMoqFilter(0);
    setPriceTierSlab(100000);
    setSidebarSearch('');
    setSearchParams(new URLSearchParams());
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#F8FAFC]">
       {/* Header / Hero Section (Locked Visual Design) */}
      <div className="w-full bg-[#0A0B1E] pt-8 pb-10 px-4 md:px-8 relative overflow-hidden">
        {mode === 'wholesale' ? (
          <div className="absolute inset-0 bg-gradient-to-r from-[#FF5B00]/30 via-[#EB4501]/10 to-[#0A0A1F] opacity-90" />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-r from-[#4A1D1D] via-[#0A0A1F] to-[#0A0A1F] opacity-80" />
        )}
        <div className="max-w-4xl mx-auto relative z-10 flex flex-col items-center justify-center text-center">
          {/* Breadcrumbs */}
          <div className="flex items-center justify-center gap-1.5 text-white/40 text-[9px] font-black uppercase tracking-widest mb-3 w-full">
            <Link to="/" className="hover:text-white transition-colors">Home</Link>
            <ChevronRight size={10} className="text-white/20" />
            <span className="text-white">Products</span>
            <ChevronRight size={10} className="text-white/20" />
            <span className="text-white">{mode === 'retail' ? 'Retail Lineup' : 'B2B Slabs'}</span>
          </div>

          <h1 className="text-3xl md:text-5xl font-black text-white italic uppercase tracking-tighter mb-4 leading-none text-center">
            {mode === 'retail' ? 'All Retail Products' : 'B2B Wholesale Catalog'}
          </h1>

          {mode === 'wholesale' && (
            <div className="inline-block bg-gradient-to-r from-orange-primary/20 via-orange-deep/10 to-transparent border-l-4 border-orange-primary px-4 py-1.5 mb-4 rounded-r-lg">
              <p className="text-orange-primary text-[10px] font-black uppercase tracking-widest italic leading-none">
                Wholesale Bulk Products & Suppliers
              </p>
            </div>
          )}

          <p className="text-gray-400 text-xs md:text-sm font-medium leading-relaxed mb-4 max-w-2xl text-center">
            {mode === 'retail' 
              ? 'Discover & Compare standard retail items with Cash on Delivery support.' 
              : 'Direct brand inventory sourcing with customized quantity slabs & volume pricing.'}
          </p>

          <div className="text-orange-primary font-black text-xs uppercase tracking-widest shrink-0 bg-white/5 border border-white/10 backdrop-blur-md px-6 py-2.5 rounded-full italic mb-2">
            {filteredProducts.length} Listings Found
          </div>
        </div>
      </div>

      {/* GLOBAL STICKY NAVIGATION SYSTEM */}
      <div className="sticky top-[80px] z-30 bg-white/95 backdrop-blur-md border-b border-gray-150 shadow-sm py-4 transition-all duration-300">
        <div className="max-w-[1440px] mx-auto px-6 flex flex-col gap-4 w-full">
          
          {/* 1. Search Bar inside Sticky Container */}
          <div className="relative w-full max-w-2xl mx-auto bg-gray-50/50 p-1 rounded-full border border-gray-200/80 shadow-inner focus-within:border-[#E8500A]/30 transition-all duration-300">
            <div className="flex items-center bg-white rounded-full">
              <div className="pl-4 text-[#E8500A] shrink-0">
                <Search className="w-4 h-4" />
              </div>
              <input 
                type="text" 
                value={sidebarSearch}
                onChange={(e) => setSidebarSearch(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && executeSearch(sidebarSearch)}
                placeholder={mode === 'retail' ? "Search retail products, brands or details..." : "Search wholesale factory suppliers, bulk slots..."} 
                className="w-full h-10 bg-transparent outline-none pl-3 pr-24 text-navy text-xs font-semibold placeholder-gray-500 focus:outline-none focus:ring-0 border-none animate-none" 
              />
              <button 
                onClick={() => executeSearch(sidebarSearch)}
                className="absolute right-1.5 top-1.5 bottom-1.5 px-5 rounded-full bg-gradient-to-r from-[#FF5B00] to-[#E8500A] hover:from-[#E8500A] hover:to-[#CF4400] text-white text-[9px] font-black tracking-widest uppercase flex items-center gap-1.5 shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 cursor-pointer border-0"
              >
                Search
              </button>
            </div>
          </div>

          {/* 2. Navigation Tabs */}
          <div className="flex items-center justify-start md:justify-center gap-1.5 md:gap-3 overflow-x-auto no-scrollbar py-1 text-[10px] font-black uppercase tracking-wider w-full">
            {[
              { id: 'All Products', label: "All Products", icon: <Layers size={13} /> },
              { id: 'Trending', label: "Trending", icon: <Flame size={13} /> },
              { id: 'Popular', label: "Popular", icon: <Star size={13} /> },
              { id: 'Newest', label: "Newest", icon: <Clock size={13} /> },
              { id: 'Top Rated', label: "Top Rated", icon: <Award size={13} /> },
              { id: 'Featured', label: "Featured", icon: <Sparkles size={13} /> }
            ].map((tab) => (
              <button
                key={tab.label}
                onClick={() => {
                  setActiveTab(tab.id);
                  const el = document.getElementById("all-products-display");
                  if (el) {
                    const offset = 220; // safe header + sticky offset
                    const elementPosition = el.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - offset;
                    window.scrollTo({
                      top: offsetPosition,
                      behavior: 'smooth'
                    });
                  }
                }}
                className={cn(
                  "px-5 py-2.5 rounded-full transition-all shrink-0 cursor-pointer flex items-center gap-1.5 font-black uppercase tracking-wider text-[10px] border",
                  activeTab === tab.id
                    ? "bg-[#E8500A] border-transparent text-white shadow-md shadow-[#E8500A]/10 italic"
                    : "bg-white border-gray-250 text-gray-400 hover:text-navy hover:bg-gray-50/80"
                )}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            ))}
          </div>

        </div>
      </div>

      <div className="max-w-[1440px] mx-auto px-6 w-full flex flex-col lg:flex-row gap-10 lg:gap-12 xl:gap-16 2xl:gap-24 py-8 relative">
        
        {/* Sidebar Filters */}
        <aside className="w-full lg:w-64 flex-shrink-0 lg:sticky lg:top-24 lg:h-[calc(100vh-120px)] lg:overflow-y-auto pb-10 pr-2 no-scrollbar">
          <div className="space-y-4">
            
            {/* Quick Search Widget */}
            <div className="flex gap-2">
              <div className="relative flex-1">
                <input 
                  type="text" 
                  value={sidebarSearch}
                  onChange={(e) => setSidebarSearch(e.target.value)}
                  placeholder="Instant Keywords..." 
                  className="w-full h-10 px-4 bg-white rounded-lg text-xs font-semibold border border-[#e8edf2] focus:outline-none focus:border-orange-primary shadow-inner" 
                />
              </div>
              <button 
                onClick={() => executeSearch(sidebarSearch)}
                className="h-10 px-4 bg-[#E8500A] text-white rounded-lg font-semibold text-[10px] uppercase tracking-wider transition-colors hover:bg-[#CF4400] border-0"
              >
                Go
              </button>
            </div>

            {/* B2B Enforced MOQ Filters (Only shown in B2B Mode) */}
            {mode === 'wholesale' && (
              <div className="bg-white rounded-2xl p-4.5 border border-[#e8edf2] shadow-sm space-y-4 relative overflow-hidden">
                <div className="flex items-center gap-1.5 pb-3 border-b border-[#e8edf2]">
                  <Calculator size={14} className="text-orange-primary" />
                  <h3 className="text-[11px] font-semibold text-[#8a9bb0] uppercase tracking-wider">Wholesale Spec Filters</h3>
                </div>
                
                {/* MOQ Input/Slider */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-[10px] font-semibold uppercase tracking-wider text-gray-400">
                    <span>Vendor Max MOQ:</span>
                    <span className="text-navy bg-[#D6E1EC]/30 px-2 py-0.5 rounded font-mono text-[10px] font-semibold">{moqFilter === 0 ? 'Any MOQ' : `${moqFilter} Pcs`}</span>
                  </div>
                  <input 
                    type="range" 
                    min="0" 
                    max="150" 
                    step="10"
                    value={moqFilter} 
                    onChange={(e) => setMoqFilter(Number(e.target.value))}
                    className="w-full accent-orange-primary bg-[#D6E1EC]/20 h-1 rounded-lg cursor-pointer"
                  />
                  <div className="flex justify-between text-[8px] text-gray-400 font-bold">
                    <span>Any</span>
                    <span>50</span>
                    <span>100</span>
                    <span>150+</span>
                  </div>
                </div>

                {/* Slabs Maximum Price Target selector */}
                <div className="space-y-2 pt-3 border-t border-[#e8edf2]">
                  <div className="flex justify-between items-center text-[10px] font-semibold uppercase tracking-wider text-gray-400">
                    <span>Wholesale Unit Cap:</span>
                    <span className="text-orange-primary font-mono font-semibold">৳{priceTierSlab.toLocaleString()}</span>
                  </div>
                  <input 
                    type="range" 
                    min="100" 
                    max="15000" 
                    step="500"
                    value={priceTierSlab} 
                    onChange={(e) => setPriceTierSlab(Number(e.target.value))}
                    className="w-full accent-orange-primary bg-[#D6E1EC]/20 h-1 rounded-lg cursor-pointer"
                  />
                  <div className="flex justify-between text-[8px] text-gray-400 font-bold">
                    <span>৳100</span>
                    <span>৳5k</span>
                    <span>৳10k</span>
                    <span>৳15k+</span>
                  </div>
                </div>
              </div>
            )}

            {/* Category Filter Group */}
            <div className="bg-white rounded-2xl p-4.5 border border-[#e8edf2] shadow-sm">
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#e8edf2] px-0.5">
                <h3 className="text-[11px] font-semibold text-[#8a9bb0] uppercase tracking-wider">Filter By Product</h3>
                {selectedCategory && (
                  <span 
                    onClick={() => setSelectedCategory(null)}
                    className="text-[9px] font-semibold text-red-500 uppercase cursor-pointer tracking-wider hover:text-red-600 transition-colors"
                  >
                    Clear Filter
                  </span>
                )}
              </div>
              <div className="space-y-1.5 max-h-60 overflow-y-auto no-scrollbar pt-1">
                {dynamicCategories.map((cat, i) => (
                  <button 
                    key={i} 
                    onClick={() => setSelectedCategory(selectedCategory === cat.name ? null : cat.name)}
                    className={cn(
                      "w-full flex items-center justify-between text-left px-2 py-1.5 rounded-lg transition-colors group text-xs font-semibold",
                      cat.checked ? "bg-orange-primary/10 text-orange-primary font-semibold" : "text-gray-500 hover:bg-gray-50 hover:text-navy"
                    )}
                  >
                    <span className="truncate">{cat.name}</span>
                    <span className="text-[9px] font-semibold text-navy bg-[#D6E1EC]/20 px-2 py-0.5 rounded-full font-mono">{cat.count}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Brand Filter Group */}
            <div className="bg-white rounded-2xl p-4.5 border border-[#e8edf2] shadow-sm">
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#e8edf2] px-0.5">
                <h3 className="text-[11px] font-semibold text-[#8a9bb0] uppercase tracking-wider">Filter By Brand</h3>
                {selectedBrand && (
                  <span 
                    onClick={() => setSelectedBrand(null)}
                    className="text-[9px] font-semibold text-red-500 uppercase cursor-pointer tracking-wider hover:text-red-600 transition-colors"
                  >
                    Clear Filter
                  </span>
                )}
              </div>
              <div className="space-y-1.5 max-h-60 overflow-y-auto no-scrollbar pt-1">
                {dynamicBrands.map((b, i) => (
                  <button 
                    key={i} 
                    onClick={() => setSelectedBrand(selectedBrand === b.name ? null : b.name)}
                    className={cn(
                      "w-full flex items-center justify-between text-left px-2 py-1.5 rounded-lg transition-colors group text-xs font-semibold",
                      b.checked ? "bg-orange-primary/10 text-orange-primary font-semibold" : "text-gray-500 hover:bg-gray-50 hover:text-navy"
                    )}
                  >
                    <span className="truncate">{b.name}</span>
                    <span className="text-[9px] font-semibold text-navy bg-[#D6E1EC]/20 px-2 py-0.5 rounded-full font-mono">{b.count}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col pt-1">
              <button 
                onClick={handleResetFilters}
                className="w-full py-2.5 bg-white border border-[#e8edf2] text-gray-400 rounded-lg font-semibold text-[10px] uppercase tracking-wider hover:border-orange-primary/40 hover:text-orange-primary transition-colors cursor-pointer"
              >
                Reset All Filters
              </button>
            </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <main id="all-products-display" className="scroll-mt-36 flex-1 min-w-0 lg:sticky lg:top-24 lg:h-[calc(100vh-120px)] lg:overflow-y-auto pb-10 pr-2">
          {/* Top Bar / Sorting */}
          <div className="flex flex-col gap-6 mb-8">
            <div className="flex flex-wrap items-center justify-between gap-4">
              {/* Active Chip Overviews */}
              <div className="flex flex-wrap items-center gap-3">
                {selectedCategory && (
                  <div className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-150 rounded-xl text-[10px] font-black text-navy uppercase tracking-widest shadow-sm">
                    Cat: {selectedCategory} 
                    <X size={12} className="text-orange-primary cursor-pointer" onClick={() => setSelectedCategory(null)} />
                  </div>
                )}
                {selectedBrand && (
                  <div className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-150 rounded-xl text-[10px] font-black text-navy uppercase tracking-widest shadow-sm">
                    Brand: {selectedBrand} 
                    <X size={12} className="text-orange-primary cursor-pointer" onClick={() => setSelectedBrand(null)} />
                  </div>
                )}
                {mode === 'wholesale' && moqFilter > 0 && (
                  <div className="flex items-center gap-2 px-4 py-2 bg-navy text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-sm">
                    Max MOQ: {moqFilter} Units 
                    <X size={12} className="text-orange-primary cursor-pointer" onClick={() => setMoqFilter(0)} />
                  </div>
                )}
              </div>

              {/* Grid Toggle & Sort Trigger */}
              <div className="flex items-center gap-4 ml-auto">
                <div className="flex items-center gap-2 text-navy text-[10px] font-black uppercase tracking-widest">
                  Sort:
                  <div className="relative">
                    <select 
                      value={sortOption}
                      onChange={(e) => setSortOption(e.target.value as any)}
                      className="appearance-none bg-white border border-gray-200 rounded-xl px-4 py-2 pr-10 text-xs font-bold text-navy focus:outline-none focus:border-orange-primary shadow-sm hover:bg-gray-50 cursor-pointer"
                    >
                      <option value="popular">Popularity</option>
                      <option value="price-asc">Price: Low to High</option>
                      <option value="price-desc">Price: High to Low</option>
                      {mode === 'wholesale' && <option value="moq-asc">MOQ: Smallest Load</option>}
                    </select>
                    <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-navy" />
                  </div>
                </div>

                {/* View Mode Switcher */}
                <div className="flex bg-white border border-gray-200 rounded-lg p-0.5 shadow-sm">
                  <button 
                    onClick={() => setViewMode('grid')}
                    className={cn("p-1.5 rounded-md", viewMode === 'grid' ? "bg-gray-100 text-navy" : "text-gray-400 hover:text-navy")}
                  >
                    <Grid size={15} />
                  </button>
                  <button 
                    onClick={() => setViewMode('list')}
                    className={cn("p-1.5 rounded-md", viewMode === 'list' ? "bg-gray-100 text-navy" : "text-gray-400 hover:text-navy")}
                  >
                    <ListIcon size={15} />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Product Grid */}
          {isLoading ? (
            <div className={cn(
              "mb-20",
              viewMode === 'grid' 
                ? "grid grid-cols-[repeat(auto-fill,minmax(188px,1fr))] justify-items-center justify-center gap-5" 
                : "flex flex-col gap-6"
            )}>
              {Array.from({ length: 8 }).map((_, i) => (
                <ProductCardSkeleton key={i} variant={viewMode === 'list' ? 'list' : 'grid'} />
              ))}
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="py-24 text-center bg-white rounded-3xl border border-gray-100 shadow-sm flex flex-col items-center justify-center gap-4 text-gray-400">
              <SlidersHorizontal size={40} className="stroke-1 text-gray-300" />
              <div className="text-xs font-black uppercase tracking-widest italic text-navy">No products matched active filters.</div>
              <p className="text-[10px] max-w-sm leading-relaxed font-bold">Try lowering your minimum order quantity filter or clearing search queries to explore the full authorized selection.</p>
              <button onClick={handleResetFilters} className="px-6 py-2.5 bg-orange-primary text-white text-[9px] font-black uppercase tracking-widest italic rounded-full shadow-lg">Clear Filters</button>
            </div>
          ) : (
            <div className={cn(
              "mb-20",
              viewMode === 'grid' 
                ? "grid grid-cols-[repeat(auto-fill,minmax(188px,1fr))] justify-items-center justify-center gap-5" 
                : "flex flex-col gap-6"
            )}>
              {filteredProducts.map((product, i) => (
                <ProductCard key={product.id} product={product} variant={viewMode === 'list' ? 'list' : 'grid'} />
              ))}
            </div>
          )}

          {/* Static Pagination (Styled Perfectly matching template) */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 pt-6 border-t border-gray-100">
            <div className="flex items-center gap-4 bg-white px-8 py-3 rounded-full border border-gray-150 shadow-sm overflow-x-auto no-scrollbar max-w-full">
              <button className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest hover:text-navy transition-colors whitespace-nowrap">
                <ChevronDown size={14} className="rotate-90" /> Previous
              </button>
              <div className="flex items-center gap-4">
                <button className="w-8 h-8 rounded-full text-xs font-black bg-orange-primary text-white shadow-lg flex-shrink-0 flex items-center justify-center">1</button>
              </div>
              <button className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest hover:text-navy transition-colors whitespace-nowrap">
                Next <ChevronDown size={14} className="-rotate-90" />
              </button>
            </div>
            <div className="text-[10px] font-black text-gray-300 uppercase tracking-widest">
              Showing <span className="text-navy">{filteredProducts.length}</span> Of <span className="text-navy">{filteredProducts.length}</span> Results
            </div>
          </div>
        </main>

        {/* RIGHT SIDEBAR WITH PREMIUM AARONG AD BANNER */}
        <aside className="hidden lg:flex flex-col gap-4 w-60 xl:w-64 flex-shrink-0 lg:sticky lg:top-24 lg:h-[calc(100vh-120px)] lg:overflow-y-auto pb-10 pr-2 no-scrollbar">
          <div className="bg-white rounded-2xl border border-[#e8edf2] p-4.5 shadow-sm text-[#1a1a2e] text-center relative overflow-hidden w-full flex flex-col items-center">
             <div className="relative z-10 w-full flex flex-col">
                <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#e8edf2] px-1">
                  <h3 className="text-[11px] font-semibold text-[#8a9bb0] uppercase tracking-wider">Sponsored Ad</h3>
                </div>
                
                <div className="w-full aspect-[4/5] rounded-xl overflow-hidden mb-4 border border-[#e8edf2] shadow-inner shrink-0">
                   <img 
                      src="https://images.unsplash.com/photo-1509631179647-0177331693ae?w=500&auto=format&fit=crop&q=80" 
                      alt="Aarong Heritage Model" 
                      className="w-full h-full object-cover object-top hover:scale-105 transition-transform duration-[2s]"
                      referrerPolicy="no-referrer"
                   />
                </div>
                
                <h4 className="font-sans text-xs font-semibold text-[#1a1a2e] uppercase tracking-wider mb-0.5">AARONG</h4>
                <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide mb-3">Heritage Shopping Brand</p>
                
                <p className="text-[11px] text-gray-500 font-medium leading-relaxed mb-4 px-1 text-center">
                   New Collection Available. Free Delivery Overall Dhaka On Purchase Above BDT 1500
                </p>
                
                <Link 
                  to="/brands"
                  className="w-full py-2.5 bg-[#E8500A] hover:bg-[#CF4400] text-white font-semibold rounded-lg text-[10px] uppercase tracking-wider flex items-center justify-center gap-2 transition-colors shadow-sm cursor-pointer border-0"
                >
                   Shop Now
                </Link>
             </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
