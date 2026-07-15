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
import { FEATURED_PRODUCTS_MOCK } from '../data/homeData';
import { GENERATED_PRODUCTS } from '../data/categoriesData';
import { useRegisterPageFilters, useFloatingFilter, ActiveFilterChips } from '../components/FilterEngine';

export function AllProductsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { addToCart } = useGlobalState();
  
  const [isLoading, setIsLoading] = useState(false);
  const { setIsOpen: setGlobalFilterOpen } = useFloatingFilter();
  const [sortOption, setSortOption] = useState<'popularity' | 'price-asc' | 'price-desc'>('popularity');
  const [isSortDropdownOpen, setIsSortDropdownOpen] = useState(false);

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
    pageName: "All Products",
    renderSearch: null,
    onClearAll: null,
    renderFilters: () => (
      <div className="space-y-8 pb-6">
        {/* Reset Row */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Filter Controls</span>
          <button 
            onClick={handleResetFilters}
            className="flex items-center gap-1.5 px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-md text-[10px] font-black transition-colors uppercase tracking-wider"
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

        {/* Price Range */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-[10px] font-black text-slate-400 tracking-widest uppercase">Price Range</h4>
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
  }, [allProductsCombined, searchQuery, selectedCategories, selectedBrands, discountOnly, priceMin, priceMax, sortOption]);

  return (
    <div className="bg-[#F4F7F9] min-h-screen text-slate-800 antialiased font-sans pb-24">
      
      {/* Edge-to-Edge Minimal Header */}
      <section className="w-full bg-[#000435] py-16 text-white text-center relative overflow-hidden select-none mb-8">
        <div className="relative z-10 max-w-[1600px] mx-auto px-4 md:px-6 lg:px-8">
          <motion.h1 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl md:text-5xl font-black tracking-tight"
          >
            All Products
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mt-4 text-sm md:text-base text-blue-200/60 max-w-2xl mx-auto font-medium"
          >
            Explore our entire catalog. Premium brands, certified quality, and the best prices across {uniqueCategories.length} categories.
          </motion.p>
        </div>
      </section>

      {/* Main Content Layout */}
      <main className="max-w-[1600px] mx-auto w-full px-4 md:px-6 lg:px-8">
        
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
          </div>
          
          <div className="w-full sm:w-auto relative">
            <button 
              onClick={() => setIsSortDropdownOpen(!isSortDropdownOpen)}
              className="w-full sm:w-64 flex items-center justify-between bg-white px-5 py-3 rounded-full text-xs font-black text-[#000435] shadow-[0_8px_30px_rgb(0,0,0,0.06)] transition-all border-0 tracking-widest uppercase cursor-pointer"
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
            <div className="py-24 text-center bg-white rounded-[24px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex flex-col items-center justify-center gap-4">
              <Search size={48} className="stroke-[1.5px] text-slate-200" />
              <h3 className="text-sm font-black text-[#000435] uppercase tracking-widest">No match found</h3>
              <p className="text-xs text-slate-400 max-w-sm leading-relaxed px-4">
                We couldn't find any products matching your active search queries or filters.
              </p>
              <button 
                onClick={handleResetFilters} 
                className="mt-4 px-6 py-3 bg-[#FF5B00] hover:bg-[#EB4501] text-white text-[11px] font-black uppercase tracking-widest rounded-full transition-all border-0 cursor-pointer shadow-md"
              >
                Clear all filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 min-[400px]:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 min-[1200px]:grid-cols-5 min-[1600px]:grid-cols-6 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard 
                  key={product.id}
                  product={product}
                />
              ))}
            </div>
          )}
        </div>

        {/* Value Props Bottom Row */}
        <section className="bg-white rounded-[24px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-8 md:p-10 mt-16 border-0">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 text-left">
            {[
              { title: "100% Authentic", desc: "Verified products", color: "bg-blue-50 text-blue-600", icon: ShieldCheck },
              { title: "Best Price", desc: "Price match guarantee", color: "bg-orange-50 text-[#FF5B00]", icon: Tag },
              { title: "Easy Returns", desc: "7-day return policy", color: "bg-green-50 text-green-600", icon: RefreshCw },
              { title: "Secure Checkout", desc: "100% secure payments", color: "bg-purple-50 text-purple-600", icon: Lock },
              { title: "24/7 Support", desc: "Always here to help", color: "bg-[#000435]/5 text-[#000435]", icon: PhoneCall }
            ].map((item, idx) => {
              const IconComp = item.icon;
              return (
                <div key={idx} className="flex flex-col gap-4">
                  <div className={cn("w-12 h-12 rounded-full flex items-center justify-center shrink-0", item.color)}>
                    <IconComp size={20} strokeWidth={2.5} />
                  </div>
                  <div>
                    <h4 className="text-[11px] font-black text-[#000435] leading-tight uppercase tracking-widest">
                      {item.title}
                    </h4>
                    <p className="text-[11px] text-slate-400 mt-1.5 leading-relaxed font-semibold">
                      {item.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

      </main>
    </div>
  );
}
