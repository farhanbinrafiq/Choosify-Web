import React, { useState, useEffect } from 'react';
import { Search, ChevronDown, Star, Filter, Bookmark, Grid, List as ListIcon, X, SlidersHorizontal, Calculator, Layers } from 'lucide-react';
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

  // Trigger brief simulation of fetching state on filter change / refresh to boost perceived interaction response
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 600);
    return () => clearTimeout(timer);
  }, [mode, searchParams]);

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
  }, [allProducts, searchParams, selectedCategory, selectedBrand, mode, moqFilter, priceTierSlab, sortOption]);

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
      <div className="w-full bg-[#0A0B1E] pt-12 pb-16 px-4 md:px-8 relative overflow-hidden">
        {mode === 'wholesale' ? (
          <div className="absolute inset-0 bg-gradient-to-r from-[#FF5B00]/30 via-[#EB4501]/10 to-[#0A0A1F] opacity-90" />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-r from-[#4A1D1D] via-[#0A0A1F] to-[#0A0A1F] opacity-80" />
        )}
        <div className="max-w-7xl mx-auto relative z-10 flex flex-col md:flex-row justify-between md:items-end gap-6">
          <div className="flex flex-col flex-1">
            <div className="flex items-center gap-2 text-gray-400 text-[10px] font-black uppercase tracking-widest mb-4">
              <Link to="/" className="hover:text-white transition-colors">Home</Link>
              <div className="w-1 h-1 bg-gray-600 rounded-full mx-1"></div>
              <span className="text-white/40">Category Explorer</span>
              <div className="w-1 h-1 bg-gray-600 rounded-full mx-1"></div>
              <span className="text-white">{mode === 'retail' ? 'Retail Lineup' : 'B2B Slabs Wholesale'}</span>
            </div>
            
            <h1 className="text-4xl font-black text-white uppercase tracking-tighter italic mb-3">
              {mode === 'retail' ? 'All Retail Products' : 'B2B Wholesale Catalog'}
            </h1>
            {mode === 'wholesale' && (
              <div className="inline-block bg-gradient-to-r from-orange-primary/20 via-orange-deep/10 to-transparent border-l-4 border-orange-primary px-4 py-2 mb-4 self-start rounded-r-lg">
                <p className="text-orange-primary text-xs font-black uppercase tracking-widest italic">
                  Wholesale Bulk Products & Suppliers
                </p>
              </div>
            )}
            <p className="text-gray-400 text-sm font-medium mb-6">
              {mode === 'retail' 
                ? 'Discover & Compare standard retail items with Cash on Delivery support.' 
                : 'Direct brand inventory sourcing with customized quantity slabs & volume pricing.'}
            </p>
            
            <div className="max-w-xl relative group">
              <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none">
                <div className="flex gap-1 opacity-80">
                  <div className="w-5 h-5 rounded-full border-2 border-orange-primary/40 flex items-center justify-center">
                    <div className="w-2 h-2 bg-orange-primary rounded-full group-hover:scale-150 transition-transform" />
                  </div>
                </div>
              </div>
              <input 
                type="text" 
                value={sidebarSearch}
                onChange={(e) => setSidebarSearch(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && executeSearch(sidebarSearch)}
                placeholder={mode === 'retail' ? "Search Products by Name, Category..." : "Search bulk products, factory suppliers..."} 
                className="w-full h-16 pl-16 pr-24 rounded-full bg-gradient-to-r from-[#000A2A] to-[#0A0A1F] text-white border border-white/10 focus:outline-none focus:border-orange-primary/40 transition-all font-bold placeholder:text-white/20 shadow-3xl text-[13px] italic tracking-wide" 
              />
              <button 
                onClick={() => executeSearch(sidebarSearch)}
                className="absolute right-3 top-1/2 -translate-y-1/2 px-6 h-10 rounded-full bg-orange-primary text-white text-[10px] uppercase font-black tracking-widest italic hover:scale-105 active:scale-95 transition-all"
              >
                Search
              </button>
            </div>
          </div>
          
          <div className="text-orange-primary font-black text-2xl italic tracking-tighter shrink-0 bg-white/5 border border-white/10 backdrop-blur-md px-6 py-4 rounded-2xl">
            {filteredProducts.length} Listings Found
          </div>
        </div>
      </div>

      <div className="max-w-[1700px] mx-auto px-6 w-full flex flex-col lg:flex-row gap-10 lg:gap-12 xl:gap-16 2xl:gap-24 py-8 relative">
        
        {/* Sidebar Filters */}
        <aside className="w-full lg:w-64 flex-shrink-0 lg:sticky lg:top-24 lg:h-[calc(100vh-120px)] lg:overflow-y-auto pb-10 pr-2 no-scrollbar">
          <div className="space-y-8">
            
            {/* Quick Search Widget */}
            <div className="flex gap-2">
              <div className="relative flex-1">
                <input 
                  type="text" 
                  value={sidebarSearch}
                  onChange={(e) => setSidebarSearch(e.target.value)}
                  placeholder="Instant Keywords..." 
                  className="w-full h-12 px-4 bg-white rounded-xl text-xs font-bold border border-gray-100 focus:outline-none focus:border-orange-primary shadow-sm" 
                />
              </div>
              <button 
                onClick={() => executeSearch(sidebarSearch)}
                className="h-12 px-4 bg-orange-primary text-white rounded-xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-orange-primary/20"
              >
                Go
              </button>
            </div>

            {/* B2B Enforced MOQ Filters (Only shown in B2B Mode) */}
            {mode === 'wholesale' && (
              <div className="bg-navy text-white rounded-[20px] p-6 border border-white/5 shadow-xl space-y-4 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-orange-primary/10 rounded-full translate-x-1/3 -translate-y-1/3 blur-xl" />
                <div className="flex items-center gap-2 text-orange-primary">
                  <Calculator size={16} />
                  <h3 className="text-xs font-black uppercase tracking-widest italic">Wholesale Spec Filters</h3>
                </div>
                
                {/* MOQ Input/Slider */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-white/60">
                    <span>Vendor Max MOQ:</span>
                    <span className="text-white bg-white/10 px-2 py-0.5 rounded font-mono">{moqFilter === 0 ? 'Any MOQ' : `${moqFilter} Pcs`}</span>
                  </div>
                  <input 
                    type="range" 
                    min="0" 
                    max="150" 
                    step="10"
                    value={moqFilter} 
                    onChange={(e) => setMoqFilter(Number(e.target.value))}
                    className="w-full accent-orange-primary bg-white/10 h-1.5 rounded-lg cursor-pointer"
                  />
                  <div className="flex justify-between text-[8px] text-white/40 font-bold">
                    <span>Any</span>
                    <span>50</span>
                    <span>100</span>
                    <span>150+</span>
                  </div>
                </div>

                {/* Slabs Maximum Price Target selector */}
                <div className="space-y-2 pt-3 border-t border-white/10">
                  <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-white/60">
                    <span>Wholesale Unit Cap:</span>
                    <span className="text-orange-primary font-mono font-black">৳{priceTierSlab.toLocaleString()}</span>
                  </div>
                  <input 
                    type="range" 
                    min="100" 
                    max="15000" 
                    step="500"
                    value={priceTierSlab} 
                    onChange={(e) => setPriceTierSlab(Number(e.target.value))}
                    className="w-full accent-orange-primary bg-white/10 h-1.5 rounded-lg cursor-pointer"
                  />
                  <div className="flex justify-between text-[8px] text-white/40 font-bold">
                    <span>৳100</span>
                    <span>৳5k</span>
                    <span>৳10k</span>
                    <span>৳15k+</span>
                  </div>
                </div>
              </div>
            )}

            {/* Category Filter Group */}
            <div className="bg-white rounded-[10px] p-6 border border-gray-100 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xs font-black text-navy uppercase tracking-widest">Filter By Product</h3>
                {selectedCategory && (
                  <span 
                    onClick={() => setSelectedCategory(null)}
                    className="text-[9px] font-black text-red-500 uppercase cursor-pointer italic"
                  >
                    Clear Filter
                  </span>
                )}
              </div>
              <div className="space-y-2.5 max-h-60 overflow-y-auto no-scrollbar">
                {dynamicCategories.map((cat, i) => (
                  <button 
                    key={i} 
                    onClick={() => setSelectedCategory(selectedCategory === cat.name ? null : cat.name)}
                    className={cn(
                      "w-full flex items-center justify-between text-left px-2 py-1.5 rounded-lg transition-colors group text-xs font-bold",
                      cat.checked ? "bg-orange-primary/10 text-orange-primary font-black" : "text-gray-400 hover:bg-gray-50 hover:text-navy"
                    )}
                  >
                    <span className="truncate">{cat.name}</span>
                    <span className="text-[9px] font-black text-gray-300 group-hover:text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">{cat.count}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Brand Filter Group */}
            <div className="bg-white rounded-[10px] p-6 border border-gray-100 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xs font-black text-navy uppercase tracking-widest">Filter By Brand</h3>
                {selectedBrand && (
                  <span 
                    onClick={() => setSelectedBrand(null)}
                    className="text-[9px] font-black text-red-500 uppercase cursor-pointer italic"
                  >
                    Clear Filter
                  </span>
                )}
              </div>
              <div className="space-y-2.5 max-h-60 overflow-y-auto no-scrollbar">
                {dynamicBrands.map((b, i) => (
                  <button 
                    key={i} 
                    onClick={() => setSelectedBrand(selectedBrand === b.name ? null : b.name)}
                    className={cn(
                      "w-full flex items-center justify-between text-left px-2 py-1.5 rounded-lg transition-colors group text-xs font-bold",
                      b.checked ? "bg-orange-primary/10 text-orange-primary font-black" : "text-gray-400 hover:bg-gray-50 hover:text-navy"
                    )}
                  >
                    <span className="truncate">{b.name}</span>
                    <span className="text-[9px] font-black text-gray-300 group-hover:text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">{b.count}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-4">
              <button 
                onClick={handleResetFilters}
                className="w-full py-4 bg-white border border-gray-200 text-gray-400 rounded-2xl font-black text-[11px] uppercase tracking-widest hover:border-orange-primary/40 hover:text-orange-primary transition-all bg-[#F8FAFC]"
              >
                Reset All Filters
              </button>
            </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 min-w-0 lg:sticky lg:top-24 lg:h-[calc(100vh-120px)] lg:overflow-y-auto pb-10 pr-2">
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
        <aside className="hidden lg:flex flex-col gap-[32px] w-60 xl:w-64 flex-shrink-0 lg:sticky lg:top-24 lg:h-[calc(100vh-120px)] lg:overflow-y-auto pb-10 pr-2 no-scrollbar">
          <div className="w-full bg-[#060714] text-white rounded-[24px] p-5 border border-white/5 relative overflow-hidden shadow-2xl flex flex-col items-center">
            {/* Top Pill - Sponsored Ad */}
            <div className="border border-white/20 rounded-full px-3 py-1 text-[8.5px] font-space font-black tracking-[0.2em] text-[#A3A8DF]/80 uppercase mb-5 leading-none max-w-max">
              Sponsored Ad
            </div>

            {/* Premium Image Container */}
            <div className="w-full aspect-[4/5] rounded-[18px] overflow-hidden bg-[#1B1B36] relative shrink-0 border border-white/5 shadow-md mb-5">
              <img 
                src="https://images.unsplash.com/photo-1509631179647-0177331693ae?w=500&auto=format&fit=crop&q=80" 
                alt="Aarong Heritage Model" 
                className="w-full h-full object-cover object-top hover:scale-[1.03] transition-transform duration-500 ease-out"
                referrerPolicy="no-referrer"
              />
            </div>

            {/* Brand Title Lines */}
            <div className="flex flex-col items-center text-center gap-0.5 mb-3.5">
              <span className="font-space font-black text-[20px] tracking-tight text-white uppercase leading-none">
                AARONG
              </span>
              <span className="font-space font-black text-[20px] tracking-tight text-white uppercase leading-none">
                HERITAGE SHOPPING
              </span>
              <span className="font-space font-black text-[20px] tracking-tight text-white uppercase leading-none">
                BRAND
              </span>
            </div>

            {/* Description */}
            <p className="text-[10px] text-[#A3A8DF]/90 font-medium leading-relaxed max-w-[210px] text-center mb-5">
              New Collection Available. Free Delivery Overall Dhaka On Purchase Above BDT 1500
            </p>

            {/* CTA Button */}
            <Link 
              to="/brands"
              className="w-full inline-flex items-center justify-center py-2.5 bg-gradient-to-r from-[#D96B27] to-[#C94F1C] hover:from-[#ED7F3B] hover:to-[#DE5D28] text-white font-space font-black rounded-full text-[10px] tracking-widest uppercase transition-all shadow-lg hover:scale-[1.02] active:scale-[0.98] duration-200"
            >
              Shop Now
            </Link>
          </div>
        </aside>
      </div>
    </div>
  );
}
