import React, { useState, useEffect } from 'react';
import { Search, ChevronDown, ChevronRight, Star, Filter, Bookmark, Grid, List as ListIcon, X, SlidersHorizontal, Layers, Award, Flame, Clock, Sparkles, ArrowRight } from 'lucide-react';
import { useSearchParams, Link } from 'react-router-dom';
import { cn } from '../lib/utils';
import { QuickAccessCard } from '../components/QuickAccessCard';
import { motion } from 'motion/react';
import { ProductCard } from '../components/ProductCard';
import { ProductCardSkeleton } from '../components/Skeleton';
import { useGlobalState } from '../context/GlobalStateContext';
import { DragScrollContainer, UniversalFilterRenderer, QuickFilterBar, ActiveFilterChips, CategorySmartFilters, FullSidebarFilterPanel, useRegisterPageFilters } from '../components/FilterEngine';

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
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchParams, setSearchParams] = useSearchParams();
  const { allProducts, allBrands } = useGlobalState();
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('All Products');

  // Trigger brief simulation of fetching state on filter change / refresh to boost perceived interaction response
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 600);
    return () => clearTimeout(timer);
  }, [searchParams, activeTab]);

  // Active query parameters / search inputs
  const rawQuery = searchParams.get('q') || '';
  const [sidebarSearch, setSidebarSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(searchParams.get('category') || null);
  const [selectedBrand, setSelectedBrand] = useState<string | null>(null);
  const [moqFilter, setMoqFilter] = useState<number>(0);
  const [priceTierSlab, setPriceTierSlab] = useState<number>(100000);
  const [ratingFilter, setRatingFilter] = useState<number | null>(null);
  const [availabilityFilter, setAvailabilityFilter] = useState<'all' | 'in-stock' | 'out-of-stock'>('all');
  const [retailPriceLimit, setRetailPriceLimit] = useState<number>(30000);
  const [minPrice, setMinPrice] = useState<string>('');
  const [maxPrice, setMaxPrice] = useState<string>('');
  const [priceError, setPriceError] = useState<string>('');
  const [sortOption, setSortOption] = useState<'popular' | 'price-asc' | 'price-desc' | 'moq-asc'>('popular');
  const [activeSpecs, setActiveSpecs] = useState<Record<string, string>>({});
  const [priceMin, setPriceMin] = useState<number>(0);
  const [priceMax, setPriceMax] = useState<number>(999999);

  // Restore state from sessionStorage on mount
  useEffect(() => {
    try {
      const saved = sessionStorage.getItem('choosify_products_filters');
      if (saved) {
        const filters = JSON.parse(saved);
        if (filters.selectedCategory) setSelectedCategory(filters.selectedCategory);
        if (filters.selectedBrand) setSelectedBrand(filters.selectedBrand);
        if (filters.moqFilter) setMoqFilter(filters.moqFilter);
        if (filters.priceTierSlab) setPriceTierSlab(filters.priceTierSlab);
        if (filters.ratingFilter) setRatingFilter(filters.ratingFilter);
        if (filters.availabilityFilter) setAvailabilityFilter(filters.availabilityFilter);
        if (filters.retailPriceLimit) setRetailPriceLimit(filters.retailPriceLimit);
        if (filters.minPrice) setMinPrice(filters.minPrice);
        if (filters.maxPrice) setMaxPrice(filters.maxPrice);
        if (filters.sortOption) setSortOption(filters.sortOption);
        if (filters.activeTab) setActiveTab(filters.activeTab);
        if (filters.activeSpecs) setActiveSpecs(filters.activeSpecs);
        if (filters.priceMin !== undefined) setPriceMin(filters.priceMin);
        if (filters.priceMax !== undefined) setPriceMax(filters.priceMax);
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  // Save to sessionStorage on updates
  useEffect(() => {
    const filters = {
      selectedCategory,
      selectedBrand,
      moqFilter,
      priceTierSlab,
      ratingFilter,
      availabilityFilter,
      retailPriceLimit,
      minPrice,
      maxPrice,
      sortOption,
      activeTab,
      activeSpecs,
      priceMin,
      priceMax
    };
    sessionStorage.setItem('choosify_products_filters', JSON.stringify(filters));
  }, [selectedCategory, selectedBrand, moqFilter, priceTierSlab, ratingFilter, availabilityFilter, retailPriceLimit, minPrice, maxPrice, sortOption, activeTab, activeSpecs, priceMin, priceMax]);

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
  function executeSearch(term: string) {
    const updated = new URLSearchParams(searchParams);
    if (term.trim()) {
      updated.set('q', term);
    } else {
      updated.delete('q');
    }
    setSearchParams(updated);
  }

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

  useRegisterPageFilters({
    pageName: 'Products',
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
          placeholder="Search retail products, brands or details..."
          className="w-full h-9 pl-8 pr-3 bg-white border border-[#e8edf2] rounded-[5px] text-[11px] font-semibold text-[#1A1D4E] placeholder-gray-400 focus:outline-none focus:border-[#E8500A]/50 transition-colors"
        />
      </div>
    ),
    quickFilters: [
      { id: 'in-stock', label: 'In Stock Only', active: availabilityFilter === 'in-stock', onClick: () => setAvailabilityFilter(availabilityFilter === 'in-stock' ? 'all' : 'in-stock') },
      { id: 'trending', label: '🔥 Trending', active: activeTab === 'Bestsellers', onClick: () => setActiveTab(activeTab === 'Bestsellers' ? 'All Products' : 'Bestsellers') },
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
            className="w-full h-10 px-3 bg-[#F4F8FA] border border-[#e8edf2] rounded-[5px] text-xs font-semibold text-navy outline-none focus:border-orange-primary/30"
          >
            <option value="featured">Featured / Recommended</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="rating-desc">Rating: High to Low</option>
          </select>
        </div>

        <UniversalFilterRenderer
          profile={{
            entity: 'products',
            filters: [
              {
                id: 'category',
                name: 'Categories',
                type: 'single_select',
                options: [
                  { value: 'all', label: 'All Categories' },
                  ...dynamicCategories.map(cat => ({ value: cat.name, label: cat.name, count: cat.count }))
                ]
              },
              {
                id: 'brand',
                name: 'Featured Brands',
                type: 'single_select',
                options: [
                  { value: 'all', label: 'All Brands' },
                  ...dynamicBrands.map(b => ({ value: b.name, label: b.name, count: b.count }))
                ]
              },
              {
                id: 'price_custom',
                name: 'Price Target (BDT)',
                type: 'price_custom'
              }
            ]
          }}
          activeFilters={{
            category: selectedCategory || 'all',
            brand: selectedBrand || 'all'
          }}
          customPriceInputs={{ min: minPrice, max: maxPrice }}
          setCustomPriceInputs={(inputs) => {
            setMinPrice(inputs.min);
            setMaxPrice(inputs.max);
          }}
          onCustomPriceApply={(min, max) => {
            setMinPrice(min > 0 ? min.toString() : '');
            setMaxPrice(max !== null ? max.toString() : '');
          }}
          onFilterChange={(filterId, value) => {
            if (filterId === 'category') {
              setSelectedCategory(value === 'all' || !value ? null : value);
            } else if (filterId === 'brand') {
              setSelectedBrand(value === 'all' || !value ? null : value);
            }
          }}
        />

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

        <div className="bg-white rounded-[5px] p-4.5 border border-[#e8edf2] shadow-sm space-y-4 text-left">
          <div className="flex items-center justify-between pb-2 border-b border-[#e8edf2]">
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
    ),
    activeFilterCount: (selectedCategory ? 1 : 0) +
      (selectedBrand ? 1 : 0) +
      (ratingFilter ? 1 : 0) +
      (availabilityFilter !== 'all' ? 1 : 0) +
      ((minPrice || maxPrice) ? 1 : 0) +
      ((priceMin > 0 || priceMax < 999999) ? 1 : 0) +
      (sidebarSearch ? 1 : 0) +
      Object.values(activeSpecs).filter(Boolean).length,
    onClearAll: handleResetFilters,
  }, [
    sidebarSearch,
    activeTab,
    selectedCategory,
    selectedBrand,
    moqFilter,
    priceTierSlab,
    ratingFilter,
    availabilityFilter,
    retailPriceLimit,
    minPrice,
    maxPrice,
    sortOption,
    activeSpecs,
    priceMin,
    priceMax
  ]);

  // Core reactive filtering logic
  const filteredProducts = React.useMemo(() => {
    let result = [...allProducts];

    // 0. Tab Selection Filtering
    if (activeTab === 'New Arrivals' || activeTab === 'Newest') {
      const arrivals = result.filter(p => p.isNewArrival === true);
      if (arrivals.length === 0) {
        result = [...result].sort((a, b) => b.id - a.id).slice(0, 8);
      } else {
        result = arrivals;
      }
    } else if (activeTab === 'Bestsellers' || activeTab === 'Trending') {
      const best = result.filter(p => p.isBestseller === true);
      if (best.length === 0) {
        result = result.filter(p => p.rating && p.rating >= 4.5);
      } else {
        result = best;
      }
    } else if (activeTab === 'Flash Deals' || activeTab === 'Featured' || activeTab === 'Popular') {
      const deals = result.filter(p => p.isDeal === true && p.dealType === 'flash');
      if (deals.length === 0) {
        result = result.filter(p => !p.id || p.id % 2 === 0);
      } else {
        result = deals;
      }
    } else if (activeTab === 'COD Ready' || activeTab === 'Top Rated') {
      result = result.filter(p => p.codSupport === true);
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

    // 4. Price target limits
    const minVal = minPrice !== '' ? parseFloat(minPrice) : 0;
    const maxVal = maxPrice !== '' ? parseFloat(maxPrice) : Infinity;
    if (minVal > 0 || maxVal < Infinity) {
      result = result.filter(p => p.price >= minVal && p.price <= maxVal);
    } else {
      if (retailPriceLimit < 30000) {
        result = result.filter(p => p.price <= retailPriceLimit);
      }
    }

    // Rating limit filter
    if (ratingFilter !== null) {
      result = result.filter(p => (p.rating || 4.5) >= ratingFilter);
    }

    // Availability filter
    if (availabilityFilter === 'in-stock') {
      result = result.filter(p => (p.stock || 0) > 0);
    } else if (availabilityFilter === 'out-of-stock') {
      result = result.filter(p => (p.stock || 0) === 0);
    }

    // Filter by category smart custom specifications
    if (Object.keys(activeSpecs).length > 0) {
      result = result.filter(p => {
        return Object.entries(activeSpecs).every(([key, value]) => {
          if (!value) return true;
          const text = `${p.title} ${p.category || ''} ${(p as any).tagline || ''} ${p.description || ''}`.toLowerCase();
          if (key === 'ram') return text.includes(value.toLowerCase());
          if (key === 'storage') return text.includes(value.toLowerCase());
          if (key === 'processor') return text.includes(value.toLowerCase());
          if (key === 'battery') return text.includes(value.replace('-', '').toLowerCase()) || text.includes('battery');
          if (key === 'size') return p.title.toLowerCase().includes(` ${value.toLowerCase()} `) || text.includes(`size ${value.toLowerCase()}`) || text.includes(value.toLowerCase());
          if (key === 'gender') return text.includes(value.toLowerCase());
          if (key === 'season') return text.includes(value.toLowerCase());
          if (key === 'frame_shape') return text.includes(value.toLowerCase());
          if (key === 'lens_type') return text.includes(value.toLowerCase());
          return true;
        });
      });
    }

    // Price range filtering (Fix 2)
    result = result.filter(p => p.price >= priceMin && p.price <= priceMax);

    // 6. Sorting logic
    if (sortOption === 'price-asc') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortOption === 'price-desc') {
      result.sort((a, b) => b.price - a.price);
    }

    return result;
  }, [allProducts, searchParams, selectedCategory, selectedBrand, ratingFilter, availabilityFilter, retailPriceLimit, minPrice, maxPrice, sortOption, activeTab, activeSpecs, priceMin, priceMax]);

  function handleResetFilters() {
    setSelectedCategory(null);
    setSelectedBrand(null);
    setMoqFilter(0);
    setPriceTierSlab(100000);
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

  return (
    <div className="flex flex-col min-h-screen bg-choosify-feed">
       {/* Header / Hero Section (Unified Design System) */}
      <div className="w-full choosify-dark-gradient relative overflow-hidden shrink-0 border-b border-white/5">
        <div className="absolute inset-0 bg-gradient-to-r from-[#4A1D1D] via-[#0A0A1F] to-[#0A0A1F] opacity-80" />
        <div className="max-w-[1914px] mx-auto w-full h-[303px] px-6 flex items-center justify-center text-center relative z-10 animate-fade-in">
          <div className="w-full flex flex-col justify-center">
            {/* Breadcrumbs */}
            <div className="flex items-center justify-center gap-1.5 text-white/40 text-[9px] font-black uppercase tracking-widest mb-1 w-full">
              <Link to="/" className="hover:text-white transition-colors">Home</Link>
              <ChevronRight size={10} className="text-white/20" />
              <span className="text-white">Products</span>
              <ChevronRight size={10} className="text-white/20" />
              <span className="text-white">Retail Lineup</span>
            </div>

            <h1 className="text-xl md:text-2xl lg:text-3xl font-black text-white italic uppercase tracking-tighter mb-1 leading-none text-center">
              All Retail Products
            </h1>

            <p className="text-gray-400 text-[9px] lg:text-[11px] font-medium leading-normal mb-1.5 max-w-2xl text-center mx-auto">
              Discover & compare standard retail items with Cash on Delivery support.
            </p>

            <div className="text-orange-primary font-black text-[8px] lg:text-[9.5px] uppercase tracking-widest shrink-0 bg-white/5 border border-white/10 backdrop-blur-md px-3 py-1 rounded-full italic mx-auto w-fit mb-4">
              {filteredProducts.length} Listings Found
            </div>

            {/* SEARCH BAR — placed inside hero section at bottom */}
            <div className="relative w-full max-w-2xl mx-auto mt-2">
              <div className="relative w-full bg-gray-50/50 p-1 rounded-full border border-gray-200/80 shadow-inner focus-within:border-[#E8500A]/30 transition-all duration-300">
                <div className="flex items-center bg-white rounded-full">
                  <div className="pl-4 text-[#E8500A] shrink-0">
                    <Search className="w-4 h-4" />
                  </div>
                  <input 
                    type="text" 
                    value={sidebarSearch}
                    onChange={(e) => setSidebarSearch(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && executeSearch(sidebarSearch)}
                    placeholder="Search retail products, brands or details..." 
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
            </div>
          </div>
        </div>
      </div>

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

      <div className="max-w-[1440px] mx-auto px-4 py-5 w-full grid grid-cols-1 lg:grid-cols-[240px_minmax(0,1fr)_260px] xl:grid-cols-[280px_minmax(0,1fr)_310px] gap-4 relative">
        
        {/* Left Sidebar */}
        <aside className="hidden lg:flex flex-col gap-4 lg:sticky lg:top-24 pb-10 flex-shrink-0 animate-fade-in text-left">
          {/* LEFT COLUMN SEARCH BAR */}
          <div className="relative">
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
              <Search size={13} className="text-[#E8500A]" />
            </div>
            <input
              type="text"
              value={sidebarSearch}
              onChange={(e) => setSidebarSearch(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && executeSearch(sidebarSearch)}
              placeholder="Search retail products, brands or details..."
              className="w-full h-9 pl-8 pr-3 bg-white border border-[#e8edf2] rounded-[5px] text-[11px] font-semibold text-[#1A1D4E] placeholder-gray-400 focus:outline-none focus:border-[#E8500A]/50 transition-colors shadow-sm"
            />
          </div>
          
          <QuickAccessCard />

          {/* LAYER 2: FULL SIDEBAR FILTER PANEL */}
          <div id="global-sidebar-filters" className="transition-all duration-300 rounded-[5px]">
            <FullSidebarFilterPanel
              title="Filter Catalog"
              onReset={handleResetFilters}
              searchQuery={sidebarSearch}
              setSearchQuery={setSidebarSearch}
              onSearchSubmit={executeSearch}
              searchPlaceholder="Search retail products, brands or details..."
              quickFilters={
                <QuickFilterBar
                  title="Products Quick Specs"
                  onOpenFullFilters={() => {}}
                  filters={[
                    { id: 'in-stock', label: 'In Stock Only', active: availabilityFilter === 'in-stock', onClick: () => setAvailabilityFilter(availabilityFilter === 'in-stock' ? 'all' : 'in-stock') },
                    { id: 'trending', label: '🔥 Trending', active: activeTab === 'Bestsellers', onClick: () => setActiveTab(activeTab === 'Bestsellers' ? 'All Products' : 'Bestsellers') },
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
                    className="w-full h-10 px-3 bg-[#F4F8FA] border border-[#e8edf2] rounded-[5px] text-xs font-semibold text-navy outline-none focus:border-orange-primary/30"
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
                  <div className="bg-white rounded-[5px] p-4.5 border border-[#e8edf2] shadow-sm space-y-4 text-left">
                    <div className="flex items-center justify-between pb-2 border-b border-[#e8edf2]">
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
              <UniversalFilterRenderer
                profile={{
                  entity: 'products',
                  filters: [
                    {
                      id: 'category',
                      name: 'Categories',
                      type: 'single_select',
                      options: [
                        { value: 'all', label: 'All Categories' },
                        ...dynamicCategories.map(cat => ({ value: cat.name, label: cat.name, count: cat.count }))
                      ]
                    },
                    {
                      id: 'brand',
                      name: 'Featured Brands',
                      type: 'single_select',
                      options: [
                        { value: 'all', label: 'All Brands' },
                        ...dynamicBrands.map(b => ({ value: b.name, label: b.name, count: b.count }))
                      ]
                    },
                    {
                      id: 'price_custom',
                      name: 'Price Target (BDT)',
                      type: 'price_custom'
                    }
                  ]
                }}
                activeFilters={{
                  category: selectedCategory || 'all',
                  brand: selectedBrand || 'all'
                }}
                customPriceInputs={{ min: minPrice, max: maxPrice }}
                setCustomPriceInputs={(inputs) => {
                  setMinPrice(inputs.min);
                  setMaxPrice(inputs.max);
                }}
                onCustomPriceApply={(min, max) => {
                  setMinPrice(min > 0 ? min.toString() : '');
                  setMaxPrice(max !== null ? max.toString() : '');
                }}
                onFilterChange={(filterId, value) => {
                  if (filterId === 'category') {
                    setSelectedCategory(value === 'all' || !value ? null : value);
                  } else if (filterId === 'brand') {
                    setSelectedBrand(value === 'all' || !value ? null : value);
                  }
                }}
              />
            </FullSidebarFilterPanel>
          </div>

          {/* Sponsored Ad */}
          <div className="bg-white rounded-[5px] border border-[#e8edf2] p-4.5 shadow-sm text-[#1a1a2e] text-center relative overflow-hidden w-full flex flex-col items-center">
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

        {/* Main Content Area */}
        <main id="all-products-display" className="scroll-mt-36 min-w-0 pb-10">
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
                {retailPriceLimit < 30000 && (
                  <div className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-150 rounded-xl text-[10px] font-black text-navy uppercase tracking-widest shadow-sm">
                    Max Price: ৳{retailPriceLimit} 
                    <X size={12} className="text-orange-primary cursor-pointer" onClick={() => setRetailPriceLimit(30000)} />
                  </div>
                )}
                {ratingFilter !== null && (
                  <div className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-150 rounded-xl text-[10px] font-black text-navy uppercase tracking-widest shadow-sm">
                    Rating: {ratingFilter}.0+ Stars 
                    <X size={12} className="text-orange-primary cursor-pointer" onClick={() => setRatingFilter(null)} />
                  </div>
                )}
                {availabilityFilter !== 'all' && (
                  <div className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-150 rounded-xl text-[10px] font-black text-navy uppercase tracking-widest shadow-sm">
                    Status: {availabilityFilter === 'in-stock' ? 'In Stock' : 'Out of Stock'} 
                    <X size={12} className="text-orange-primary cursor-pointer" onClick={() => setAvailabilityFilter('all')} />
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
                ? "grid grid-cols-2 lg:grid-cols-4 justify-items-center justify-center gap-4 xl:gap-5" 
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
                ? "grid grid-cols-2 lg:grid-cols-4 justify-items-center justify-center gap-4 xl:gap-5" 
                : "flex flex-col gap-6"
            )}>
              {filteredProducts.map((product, i) => (
                <ProductCard key={product.id} product={product} variant={viewMode === 'list' ? 'list' : 'grid'} />
              ))}
            </div>
          )}

          {/* Static Pagination (Styled Perfectly matching global canonical standard) */}
          <div className="mt-16 pt-12 border-t border-gray-100 flex flex-col items-center gap-8">
            <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 max-w-full px-2">
              <button className="w-11 h-11 md:w-12 md:h-12 min-w-[44px] min-h-[44px] shrink-0 rounded-[5px] flex items-center justify-center bg-white border border-[#e8edf2] text-navy hover:bg-[#E8500A] hover:text-white hover:border-[#E8500A] transition-all shadow-none group">
                <ArrowRight size={18} className="rotate-180 group-hover:-translate-x-1 transition-transform" />
              </button>
              {[1, 2, 3, '...', 12].map((page, i) => (
                <button 
                  key={i} 
                  className={cn(
                    "w-11 h-11 md:w-12 md:h-12 min-w-[44px] min-h-[44px] shrink-0 rounded-[5px] flex items-center justify-center text-[11px] font-black transition-all italic",
                    page === 1 
                    ? "bg-[#E8500A] text-white border border-[#E8500A] shadow-none" 
                    : "bg-white border border-[#e8edf2] text-navy hover:border-[#E8500A] hover:text-[#E8500A] shadow-none"
                  )}
                >
                  {page}
                </button>
              ))}
              <button className="w-11 h-11 md:w-12 md:h-12 min-w-[44px] min-h-[44px] shrink-0 rounded-[5px] flex items-center justify-center bg-white border border-[#e8edf2] text-navy hover:bg-[#E8500A] hover:text-white hover:border-[#E8500A] transition-all shadow-none group">
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
            
            <p className="text-[10px] font-black text-gray-300 uppercase tracking-[0.2em] italic">
              Showing <span className="text-navy">{filteredProducts.length}</span> Of <span className="text-navy">{filteredProducts.length}</span> Results
            </p>
          </div>
        </main>

        {/* RIGHT SIDEBAR WITH PREMIUM AARONG AD BANNER */}
        <aside className="hidden lg:flex flex-col gap-4 lg:sticky lg:top-24 pb-10 pr-2 flex-shrink-0 animate-fade-in">
          {/* Sponsored Recommendations Card */}
          <div className="bg-white rounded-[5px] border border-[#e8edf2] p-4.5 shadow-sm text-left relative overflow-hidden w-full flex flex-col">
             <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#e8edf2] px-1">
                <h3 className="text-[11px] font-semibold text-[#8a9bb0] uppercase tracking-wider">
                   👉 Sponsored Recommendations
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
                   <div className="text-center py-6 border border-dashed border-gray-200 rounded-[5px]">
                      <p className="text-xs text-gray-400 font-medium px-2">Sponsored recommendations will appear here.</p>
                   </div>
                ) : (
                   SPONSORED_RECOMMENDATIONS.map((item) => (
                      <Link 
                         to={`/recommendations/${item.id}`}
                         key={item.id} 
                         className="flex items-start gap-3 bg-white border border-[#e8edf2]/60 rounded-[5px] p-2 hover:shadow-soft hover:border-[#E8500A]/10 transition-all duration-300 group cursor-pointer"
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
                               {item.readTime} · BY {item.author}
                            </p>
                          </div>
                      </Link>
                   ))
                )}
             </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
