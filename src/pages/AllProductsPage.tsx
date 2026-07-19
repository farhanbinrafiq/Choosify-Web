import React, { useState, useEffect, useMemo } from 'react';
import { Search, ChevronDown, ChevronRight, Star, Filter, Bookmark, Grid, List as ListIcon, X, SlidersHorizontal, Layers, Award, Flame, Clock, Sparkles, ArrowRight, Package } from 'lucide-react';
import { useSearchParams, Link } from 'react-router-dom';
import { cn } from '../lib/utils';
import { motion } from 'motion/react';
import { ProductCard } from '../components/ProductCard';
import { ProductCardSkeleton } from '../components/Skeleton';
import { useGlobalState } from '../context/GlobalStateContext';
import { DragScrollContainer, UniversalFilterRenderer, QuickFilterBar, ActiveFilterChips, CategorySmartFilters, FullSidebarFilterPanel, useRegisterPageFilters } from '../components/FilterEngine';
import { DcListingHero } from '../components/design/DcListingHero';
import { DcListingStickyFilters } from '../components/design/DcListingStickyFilters';
import { LISTING_PAGE_MAX_WIDTH } from '../lib/design/dcListingTokens';
import { PaginationBar } from '../components/PaginationBar';
import {PRODUCT_CARD_GRID, PAGE_LISTING_SINGLE_SHELL } from "../lib/pageLayout";
import { useSectionScrollSpy } from '../hooks/useSectionScrollSpy';
import { ListingAdRail } from '../components/ListingAdRail';
import { AdSenseSlot } from '../components/AdSenseSlot';
import { ProductsSponsoredBanner } from '../components/commerce/AdvertiseHereCard';
import { useSponsoredFeedEntries } from '../hooks/useSponsoredFeedEntries';
import { PLACEMENT_KEYS } from '../lib/placements';
import { resolveServiceKeywords } from '../lib/home/popularServices';

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
  const { allCatalogProducts, allBrands } = useGlobalState();
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
  const [ratingFilter, setRatingFilter] = useState<number | null>(null);
  const [availabilityFilter, setAvailabilityFilter] = useState<'all' | 'in-stock' | 'out-of-stock'>('all');
  const [retailPriceLimit, setRetailPriceLimit] = useState<number>(30000);
  const [minPrice, setMinPrice] = useState<string>('');
  const [maxPrice, setMaxPrice] = useState<string>('');
  const [priceError, setPriceError] = useState<string>('');
  const [sortOption, setSortOption] = useState<'popular' | 'price-asc' | 'price-desc'>('popular');
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
  }, [selectedCategory, selectedBrand, ratingFilter, availabilityFilter, retailPriceLimit, minPrice, maxPrice, sortOption, activeTab, activeSpecs, priceMin, priceMax]);

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

  // Category / filter links often keep pathname /products — scroll to top on query change
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
    document.documentElement.scrollTo(0, 0);
    document.body.scrollTo(0, 0);
  }, [searchParams.toString()]);

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

  const sectionNavItems = [{ id: 'all-products-display', label: 'Catalog', icon: <Package size={13} /> }];
  const { activeId: activeSectionId, scrollToSection } = useSectionScrollSpy(sectionNavItems);

  // Dynamically group categories & brands from the product catalog
  const dynamicCategories = React.useMemo(() => {
    const counts: { [name: string]: number } = {};
    allCatalogProducts.forEach(p => {
      const cat = p.categoryName || 'Other';
      counts[cat] = (counts[cat] || 0) + 1;
    });
    return Object.entries(counts).map(([name, count]) => ({
      name,
      count,
      checked: selectedCategory === name
    }));
  }, [allCatalogProducts, selectedCategory]);

  const dynamicBrands = React.useMemo(() => {
    const counts: { [name: string]: number } = {};
    allCatalogProducts.forEach(p => {
      const bName = p.brandName || 'Apex';
      counts[bName] = (counts[bName] || 0) + 1;
    });
    return Object.entries(counts).map(([name, count]) => ({
      name,
      count,
      checked: selectedBrand === name
    }));
  }, [allCatalogProducts, allBrands, selectedBrand]);

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
    let result = [...allCatalogProducts];

    // 0. Tab Selection Filtering
    if (activeTab === 'New Arrivals' || activeTab === 'Newest') {
      const arrivals = result.filter(p => p.isNewArrival === true);
      if (arrivals.length === 0) {
        result = [...result].sort((a, b) => b.createdAt.localeCompare(a.createdAt)).slice(0, 8);
      } else {
        result = arrivals;
      }
    } else if (activeTab === 'Bestsellers' || activeTab === 'Trending') {
      const best = result.filter(p => p.isBestseller === true);
      if (best.length === 0) {
        result = result.filter(p => p.featuredFlag || p.isBestseller);
      } else {
        result = best;
      }
    } else if (activeTab === 'Flash Deals' || activeTab === 'Featured' || activeTab === 'Popular') {
      const deals = result.filter(p => p.isDeal === true && p.dealType === 'flash');
      if (deals.length === 0) {
        result = result.filter((_, idx) => idx % 2 === 0);
      } else {
        result = deals;
      }
    } else if (activeTab === 'COD Ready' || activeTab === 'Top Rated') {
      result = result.filter(p => (p.stock || 0) > 0);
    }

    // 1. Text / service search — services & products share the same product cards
    const textQuery = (searchParams.get('q') || '').toLowerCase().trim();
    const serviceKeywords = resolveServiceKeywords(searchParams.get('service'));
    if (serviceKeywords?.length) {
      result = result.filter((p) => {
        const brandObj = allBrands.find(b => String(b.id) === String(p.brandId) || b.name === p.brandName);
        const bName = brandObj ? brandObj.name : p.brandName;
        const haystack = `${p.title} ${p.description || ''} ${bName || ''} ${p.categoryName || ''} ${(p as any).tagline || ''}`.toLowerCase();
        return serviceKeywords.some((keyword) => haystack.includes(keyword));
      });
    } else if (textQuery) {
      result = result.filter(p => {
        const brandObj = allBrands.find(b => String(b.id) === String(p.brandId) || b.name === p.brandName);
        const bName = brandObj ? brandObj.name : p.brandName;
        return (
          p.title.toLowerCase().includes(textQuery) ||
          (p.description || '').toLowerCase().includes(textQuery) ||
          bName.toLowerCase().includes(textQuery) ||
          (p.categoryName || '').toLowerCase().includes(textQuery)
        );
      });
    }

    // 2. Class/Category Selection
    if (selectedCategory) {
      result = result.filter(p => p.categoryName === selectedCategory);
    }

    // 3. Brand Selection
    if (selectedBrand) {
      result = result.filter(p => {
        const brandObj = allBrands.find(b => String(b.id) === String(p.brandId) || b.name === p.brandName);
        return brandObj && brandObj.name === selectedBrand;
      });
    }

    // 4. Price Target limits
    const minVal = minPrice !== '' ? parseFloat(minPrice) : 0;
    const maxVal = maxPrice !== '' ? parseFloat(maxPrice) : Infinity;
    if (minVal > 0 || maxVal < Infinity) {
      result = result.filter(p => p.price >= minVal && p.price <= maxVal);
    } else if (retailPriceLimit < 30000) {
      result = result.filter(p => p.price <= retailPriceLimit);
    }

    // Rating limit filter
    if (ratingFilter !== null) {
      result = result.filter(p => p.featuredFlag || p.isBestseller);
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
          const text = `${p.title} ${p.categoryName || ''} ${(p as any).tagline || ''} ${p.description || ''}`.toLowerCase();
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
        maxWidthClass={LISTING_PAGE_MAX_WIDTH}
      />

      <DcListingStickyFilters
        overlapHero
        maxWidthClass={LISTING_PAGE_MAX_WIDTH}
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

      <div className={`${LISTING_PAGE_MAX_WIDTH} mx-auto px-4 sm:px-5 lg:px-6 py-6 md:py-10 w-full ${PAGE_LISTING_SINGLE_SHELL}`}>
        
        {/* Left Sidebar */}
        <aside className="hidden lg:flex flex-col gap-4 lg:sticky lg:top-24 pb-10 flex-shrink-0 min-w-0 w-full max-w-full animate-fade-in text-left">
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

          <ListingAdRail
            sponsoredPlacementKey={PLACEMENT_KEYS.SIDEBAR_PORTRAIT}
            sponsoredVariant="portrait"
            sponsoredDescription="New collection highlights from verified Choosify partners."
            showAdSense={false}
          />
        </aside>

        {/* Main Content Area */}
        <main id="all-products-display" className="choosify-middle-feed scroll-mt-36 min-w-0 pb-10">
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
            <div className={cn(
              "mb-20 w-full",
              viewMode === 'grid' 
                ? PRODUCT_CARD_GRID
                : "flex flex-col gap-6"
            )}>
              {Array.from({ length: 8 }).map((_, i) => (
                <ProductCardSkeleton key={i} variant={viewMode === 'list' ? 'list' : 'grid'} />
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

          <AdSenseSlot format="sidebar" />
        </aside>
      </div>
    </div>
  );
}
