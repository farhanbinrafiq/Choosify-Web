import React, { useState, useEffect, useMemo } from 'react';
import { 
  Search, ChevronDown, ChevronRight, Star, Filter, Grid, 
  List as ListIcon, X, SlidersHorizontal, ShieldCheck, 
  Clock, RotateCcw, Check, Percent, ArrowLeftRight
} from 'lucide-react';
import { useSearchParams, Link } from 'react-router-dom';
import { cn } from '../lib/utils';
import { ProductCard } from '../components/ProductCard';
import { ProductCardSkeleton } from '../components/Skeleton';
import { useGlobalState } from '../context/GlobalStateContext';
import { useRegisterPageFilters } from '../components/FilterEngine';

export function AllProductsPage() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchParams, setSearchParams] = useSearchParams();
  const { allProducts, allBrands, mode } = useGlobalState();
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('All Products');

  // Sidebar brand search query
  const [brandSearch, setBrandSearch] = useState('');

  // Local filter states matching the reference design
  const [selectedCategory, setSelectedCategory] = useState<string | null>(searchParams.get('category') || null);
  const [selectedBrand, setSelectedBrand] = useState<string | null>(null);
  const [ratingFilter, setRatingFilter] = useState<number | null>(null);
  const [availabilityFilter, setAvailabilityFilter] = useState<'all' | 'in-stock' | 'out-of-stock'>('all');
  const [fastDeliveryOnly, setFastDeliveryOnly] = useState(false);
  const [priceMin, setPriceMin] = useState<number>(0);
  const [priceMax, setPriceMax] = useState<number>(500000);
  const [sortOption, setSortOption] = useState<'popular' | 'price-asc' | 'price-desc' | 'rating-desc'>('popular');

  // Reference Image compliant Products array
  const mockReferenceProducts = useMemo(() => {
    return [
      {
        id: 1,
        title: "Samsung Galaxy S24 Ultra",
        category: "Mobile & Phones",
        categoryLabel: "MOBILE",
        brand: "Samsung",
        brandId: 1,
        rating: 4.8,
        reviews: 1200,
        price: 124800,
        originalPrice: 139900,
        hearts: 1433,
        bookmarks: 451,
        image: "https://images.unsplash.com/photo-1707251759491-18d48607ea0c?w=500&q=80",
        badges: [
          { text: "FEATURED", type: "featured" },
          { text: "-10%", type: "discount" }
        ],
        stock: 58,
        fastDelivery: true,
        codSupport: true
      },
      {
        id: 2,
        title: "Sony WH-1000XM5",
        category: "Tech & Electronics",
        categoryLabel: "AUDIO",
        brand: "Sony",
        brandId: 5,
        rating: 4.7,
        reviews: 890,
        price: 32999,
        originalPrice: 38999,
        hearts: 982,
        bookmarks: 128,
        image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80",
        badges: [
          { text: "BEST SELLER", type: "bestseller" },
          { text: "-15%", type: "discount" }
        ],
        stock: 42,
        fastDelivery: true,
        codSupport: true
      },
      {
        id: 3,
        title: "Amazfit GTR 4",
        category: "Tech & Electronics",
        categoryLabel: "WEARABLE",
        brand: "Amazfit",
        brandId: 18,
        rating: 4.6,
        reviews: 532,
        price: 18490,
        originalPrice: 22999,
        hearts: 612,
        bookmarks: 89,
        image: "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=500&q=80",
        badges: [
          { text: "-20%", type: "discount" }
        ],
        stock: 15,
        fastDelivery: false,
        codSupport: true
      },
      {
        id: 4,
        title: "Apple AirPods Pro 2",
        category: "Tech & Electronics",
        categoryLabel: "AUDIO",
        brand: "Apple",
        brandId: 2,
        rating: 4.9,
        reviews: 1500,
        price: 25999,
        originalPrice: 29499,
        hearts: 1320,
        bookmarks: 210,
        image: "https://images.unsplash.com/photo-1588449668338-d13417f16fd0?w=500&q=80",
        badges: [
          { text: "-12%", type: "discount" }
        ],
        stock: 67,
        fastDelivery: true,
        codSupport: true
      },
      {
        id: 5,
        title: "Nike Air Max Excee",
        category: "Fashion & Lifestyle",
        categoryLabel: "SHOES",
        brand: "Nike",
        brandId: 19,
        rating: 4.6,
        reviews: 420,
        price: 7499,
        originalPrice: 9999,
        hearts: 745,
        bookmarks: 96,
        image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&q=80",
        badges: [
          { text: "-25%", type: "discount" }
        ],
        stock: 8,
        fastDelivery: false,
        codSupport: true
      },
      {
        id: 6,
        title: "Xiaomi 14T Pro",
        category: "Mobile & Phones",
        categoryLabel: "MOBILE",
        brand: "Xiaomi",
        brandId: 8,
        rating: 4.7,
        reviews: 210,
        price: 54999,
        originalPrice: null,
        hearts: 478,
        bookmarks: 64,
        image: "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=500&q=80",
        badges: [
          { text: "NEW", type: "new" }
        ],
        stock: 25,
        fastDelivery: true,
        codSupport: true
      },
      {
        id: 7,
        title: "Dell XPS 13 Plus",
        category: "Tech & Electronics",
        categoryLabel: "LAPTOP",
        brand: "Dell",
        brandId: 20,
        rating: 4.6,
        reviews: 612,
        price: 178500,
        originalPrice: 188900,
        hearts: 612,
        bookmarks: 89,
        image: "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=500&q=80",
        badges: [
          { text: "FEATURED", type: "featured" }
        ],
        stock: 12,
        fastDelivery: true,
        codSupport: true
      },
      {
        id: 8,
        title: "Walton Refrigerator WNV-3A5",
        category: "TV & Appliances",
        categoryLabel: "HOME APPLIANCES",
        brand: "Walton",
        brandId: 21,
        rating: 4.5,
        reviews: 478,
        price: 34990,
        originalPrice: 38500,
        hearts: 478,
        bookmarks: 64,
        image: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=500&q=80",
        badges: [
          { text: "BEST DEAL", type: "bestdeal" }
        ],
        stock: 18,
        fastDelivery: false,
        codSupport: true
      },
      {
        id: 9,
        title: "Canon EOS R50",
        category: "Tech & Electronics",
        categoryLabel: "CAMERA",
        brand: "Canon",
        brandId: 22,
        rating: 4.7,
        reviews: 156,
        price: 89999,
        originalPrice: 109999,
        hearts: 312,
        bookmarks: 45,
        image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=500&q=80",
        badges: [
          { text: "-18%", type: "discount" }
        ],
        stock: 14,
        fastDelivery: true,
        codSupport: true
      },
      {
        id: 10,
        title: "Samsung 55\" QLED 4K",
        category: "TV & Appliances",
        categoryLabel: "TV & DISPLAY",
        brand: "Samsung",
        brandId: 1,
        rating: 4.8,
        reviews: 322,
        price: 74900,
        originalPrice: 106900,
        hearts: 298,
        bookmarks: 37,
        image: "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=500&q=80",
        badges: [
          { text: "-30%", type: "discount" }
        ],
        stock: 22,
        fastDelivery: true,
        codSupport: true
      },
      {
        id: 11,
        title: "Apple Watch Series 9",
        category: "Tech & Electronics",
        categoryLabel: "WEARABLE",
        brand: "Apple",
        brandId: 2,
        rating: 4.7,
        reviews: 892,
        price: 54900,
        originalPrice: null,
        hearts: 982,
        bookmarks: 128,
        image: "https://images.unsplash.com/photo-1434494878577-86c23bcb06b9?w=500&q=80",
        badges: [
          { text: "NEW", type: "new" }
        ],
        stock: 35,
        fastDelivery: true,
        codSupport: true
      },
      {
        id: 12,
        title: "Dior Sauvage EDP",
        category: "Fashion & Lifestyle",
        categoryLabel: "BEAUTY",
        brand: "Dior",
        brandId: 23,
        rating: 4.6,
        reviews: 320,
        price: 8490,
        originalPrice: 10900,
        hearts: 210,
        bookmarks: 28,
        image: "https://images.unsplash.com/photo-1594035910387-fea47794261f?w=500&q=80",
        badges: [
          { text: "-22%", type: "discount" }
        ],
        stock: 19,
        fastDelivery: false,
        codSupport: true
      }
    ];
  }, []);

  // Merged products list to guarantee absolute fidelity while supporting any dynamic ones
  const productsSource = useMemo<any[]>(() => {
    const refTitles = new Set(mockReferenceProducts.map(p => p.title.toLowerCase()));
    const otherProducts = allProducts.filter(p => !refTitles.has(p.title.toLowerCase()));
    return [...mockReferenceProducts, ...otherProducts];
  }, [allProducts, mockReferenceProducts]);

  // Trigger brief skeleton simulation on filter change or tab shift
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 450);
    return () => clearTimeout(timer);
  }, [selectedCategory, selectedBrand, ratingFilter, availabilityFilter, fastDeliveryOnly, priceMin, priceMax, sortOption, activeTab, mode]);

  // Restore filters from sessionStorage on mount
  useEffect(() => {
    try {
      const saved = sessionStorage.getItem('choosify_products_filters');
      if (saved) {
        const filters = JSON.parse(saved);
        if (filters.selectedCategory) setSelectedCategory(filters.selectedCategory);
        if (filters.selectedBrand) setSelectedBrand(filters.selectedBrand);
        if (filters.ratingFilter) setRatingFilter(filters.ratingFilter);
        if (filters.availabilityFilter) setAvailabilityFilter(filters.availabilityFilter);
        if (filters.fastDeliveryOnly !== undefined) setFastDeliveryOnly(filters.fastDeliveryOnly);
        if (filters.priceMin !== undefined) setPriceMin(filters.priceMin);
        if (filters.priceMax !== undefined) setPriceMax(filters.priceMax);
        if (filters.sortOption) setSortOption(filters.sortOption);
        if (filters.activeTab) setActiveTab(filters.activeTab);
      }
    } catch (e) {
      console.error('Error loading filters from sessionStorage', e);
    }
  }, []);

  // Save filters to sessionStorage on change
  useEffect(() => {
    const filters = {
      selectedCategory,
      selectedBrand,
      ratingFilter,
      availabilityFilter,
      fastDeliveryOnly,
      priceMin,
      priceMax,
      sortOption,
      activeTab
    };
    sessionStorage.setItem('choosify_products_filters', JSON.stringify(filters));
  }, [selectedCategory, selectedBrand, ratingFilter, availabilityFilter, fastDeliveryOnly, priceMin, priceMax, sortOption, activeTab]);

  // Handle URL query parameters syncing
  useEffect(() => {
    const categoryParam = searchParams.get('category');
    if (categoryParam) {
      setSelectedCategory(categoryParam);
    }
    const qParam = searchParams.get('q');
    if (qParam) {
      setActiveTab('All Products');
    }
  }, [searchParams]);

  // Reset filters
  const handleResetFilters = () => {
    setSelectedCategory(null);
    setSelectedBrand(null);
    setRatingFilter(null);
    setAvailabilityFilter('all');
    setFastDeliveryOnly(false);
    setPriceMin(0);
    setPriceMax(500000);
    setSortOption('popular');
    setActiveTab('All Products');
    setSearchParams(new URLSearchParams());
  };

  // Dynamically calculate counts based on actual dataset
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    productsSource.forEach(p => {
      const cat = p.category || 'Other';
      counts[cat] = (counts[cat] || 0) + 1;
    });
    return counts;
  }, [productsSource]);

  const brandCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    productsSource.forEach(p => {
      const bObj = allBrands.find(b => b.id === p.brandId);
      const bName = bObj ? bObj.name : p.brand || 'Apex';
      counts[bName] = (counts[bName] || 0) + 1;
    });
    return counts;
  }, [productsSource, allBrands]);

  // Filter list of brands in the sidebar based on search query
  const filteredBrandsList = useMemo(() => {
    const uniqueBrands = Array.from(new Set(productsSource.map(p => {
      const bObj = allBrands.find(b => b.id === p.brandId);
      return bObj ? bObj.name : p.brand || 'Apex';
    })));

    return uniqueBrands
      .filter(b => b.toLowerCase().includes(brandSearch.toLowerCase()))
      .map(b => ({
        name: b,
        count: brandCounts[b] || 0
      }))
      .sort((a, b) => b.count - a.count);
  }, [productsSource, allBrands, brandSearch, brandCounts]);

  // Register filters with FilterEngine
  useRegisterPageFilters({
    pageName: 'Products',
    renderSearch: () => null,
    quickFilters: [],
    renderFilters: () => null,
    activeFilterCount: (selectedCategory ? 1 : 0) + (selectedBrand ? 1 : 0) + (ratingFilter ? 1 : 0) + (availabilityFilter !== 'all' ? 1 : 0) + (fastDeliveryOnly ? 1 : 0),
    onClearAll: handleResetFilters,
  }, [selectedCategory, selectedBrand, ratingFilter, availabilityFilter, fastDeliveryOnly]);

  // Main Filtering and Sorting Logic
  const filteredProducts = useMemo(() => {
    let result = [...productsSource];

    // Filter by Active Tab / Pills selection
    if (activeTab === 'Verified Products' || activeTab === 'All Products') {
      // Show verified products or all
    } else if (activeTab === 'Real Reviews') {
      result = result.filter(p => (p.rating || 0) >= 4.7);
    } else if (activeTab === 'Top deals & offers') {
      result = result.filter(p => p.originalPrice && p.price);
    } else if (activeTab === 'New arrivals') {
      result = result.filter(p => p.id === 6 || p.id === 11 || p.tag === 'NEW');
    } else if (activeTab === 'Popular picks') {
      result = result.filter(p => (p.rating || 0) >= 4.6 && p.reviews && p.reviews > 400);
    }

    // Search query parameter from URL
    const searchWord = (searchParams.get('q') || '').toLowerCase().trim();
    if (searchWord) {
      result = result.filter(p => {
        const bObj = allBrands.find(b => b.id === p.brandId);
        const bName = bObj ? bObj.name : p.brand || '';
        return (
          p.title.toLowerCase().includes(searchWord) ||
          (p.category || '').toLowerCase().includes(searchWord) ||
          bName.toLowerCase().includes(searchWord)
        );
      });
    }

    // Category Filter
    if (selectedCategory) {
      result = result.filter(p => p.category === selectedCategory);
    }

    // Brand Filter
    if (selectedBrand) {
      result = result.filter(p => {
        const bObj = allBrands.find(b => b.id === p.brandId);
        const bName = bObj ? bObj.name : p.brand || '';
        return bName === selectedBrand;
      });
    }

    // Price Filter
    result = result.filter(p => {
      const priceVal = typeof p.price === 'string' ? parseFloat(String(p.price).replace(/,/g, '')) : p.price;
      return priceVal >= priceMin && priceVal <= priceMax;
    });

    // Rating Filter
    if (ratingFilter !== null) {
      result = result.filter(p => (p.rating || 4.5) >= ratingFilter);
    }

    // Availability Filter
    if (availabilityFilter === 'in-stock') {
      result = result.filter(p => (p.stock || 0) > 0);
    } else if (availabilityFilter === 'out-of-stock') {
      result = result.filter(p => (p.stock || 0) === 0);
    }

    // Fast Delivery / COD Filter
    if (fastDeliveryOnly) {
      result = result.filter(p => p.fastDelivery === true || p.codSupport === true);
    }

    // Sorting logic
    if (sortOption === 'price-asc') {
      result.sort((a, b) => {
        const pA = typeof a.price === 'string' ? parseFloat(String(a.price).replace(/,/g, '')) : a.price;
        const pB = typeof b.price === 'string' ? parseFloat(String(b.price).replace(/,/g, '')) : b.price;
        return pA - pB;
      });
    } else if (sortOption === 'price-desc') {
      result.sort((a, b) => {
        const pA = typeof a.price === 'string' ? parseFloat(String(a.price).replace(/,/g, '')) : a.price;
        const pB = typeof b.price === 'string' ? parseFloat(String(b.price).replace(/,/g, '')) : b.price;
        return pB - pA;
      });
    } else if (sortOption === 'rating-desc') {
      result.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    } else {
      // Popularity (Default): sort by rating and reviews count
      result.sort((a, b) => (((b as any).reviews || 0) * (b.rating || 0)) - (((a as any).reviews || 0) * (a.rating || 0)));
    }

    return result;
  }, [productsSource, allBrands, searchParams, selectedCategory, selectedBrand, priceMin, priceMax, ratingFilter, availabilityFilter, fastDeliveryOnly, sortOption, activeTab]);

  return (
    <div className="min-h-screen bg-[#F9FAFB] text-gray-800 font-sans" id="all-products-page">
      {/* 1. Header / Breadcrumbs & Title Section */}
      <header className="bg-white border-b border-gray-150 py-8 px-6 sm:px-8">
        <div className="max-w-[1440px] mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          {/* Left side: Breadcrumbs & Headings */}
          <div className="space-y-2 flex-1 text-left">
            <nav className="flex items-center gap-1.5 text-xs text-gray-400 font-medium tracking-wide">
              <Link to="/" className="hover:text-[#FF5B00] transition-colors">Home</Link>
              <ChevronRight size={12} className="text-gray-300" />
              <span className="text-gray-600 font-semibold">Products</span>
            </nav>
            <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight leading-none">
              Products
            </h1>
            <p className="text-sm text-gray-500 max-w-xl">
              Explore {productsSource.length.toLocaleString()}+ verified products from trusted brands in Bangladesh.
            </p>
          </div>

          {/* Right side: Trust Badges */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 w-full md:w-auto shrink-0">
            <div className="flex items-center gap-2 px-3 py-2.5 bg-[#F4F9FF] border border-[#D0E5FF] rounded-xl shadow-none">
              <ShieldCheck className="w-8 h-8 text-blue-600 shrink-0" />
              <div className="text-left">
                <p className="text-[10px] font-extrabold text-blue-800 uppercase tracking-wider leading-none">100% Verified</p>
                <p className="text-[9px] text-blue-600 mt-0.5 leading-tight font-medium">Authentic products</p>
              </div>
            </div>

            <div className="flex items-center gap-2 px-3 py-2.5 bg-[#FFF6F3] border border-[#FFE1D5] rounded-xl shadow-none">
              <Percent className="w-8 h-8 text-[#FF5B00] shrink-0" />
              <div className="text-left">
                <p className="text-[10px] font-extrabold text-orange-800 uppercase tracking-wider leading-none">Best Price</p>
                <p className="text-[9px] text-[#FF5B00] mt-0.5 leading-tight font-medium">Compare & save more</p>
              </div>
            </div>

            <div className="flex items-center gap-2 px-3 py-2.5 bg-[#F5FFF9] border border-[#D5FFE3] rounded-xl shadow-none">
              <Clock className="w-8 h-8 text-green-600 shrink-0" />
              <div className="text-left">
                <p className="text-[10px] font-extrabold text-green-800 uppercase tracking-wider leading-none">Easy Returns</p>
                <p className="text-[9px] text-green-600 mt-0.5 leading-tight font-medium">7-day return policy</p>
              </div>
            </div>

            <div className="flex items-center gap-2 px-3 py-2.5 bg-[#FCF5FF] border border-[#F2D9FF] rounded-xl shadow-none">
              <ArrowLeftRight className="w-8 h-8 text-purple-600 shrink-0" />
              <div className="text-left">
                <p className="text-[10px] font-extrabold text-purple-800 uppercase tracking-wider leading-none">Secure Payments</p>
                <p className="text-[9px] text-purple-600 mt-0.5 leading-tight font-medium">SSL protected</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* 2. Browse Category Row & Toggles */}
      <section className="bg-white border-b border-gray-200 py-4 px-6 sm:px-8 sticky top-20 z-20">
        <div className="max-w-[1440px] mx-auto flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          
          {/* Browse pills */}
          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
            <span className="text-xs font-black text-gray-400 uppercase tracking-wider mr-1">Browse:</span>
            {[
              { id: 'All Products', label: 'VERIFIED PRODUCTS' },
              { id: 'Real Reviews', label: 'REAL REVIEWS' },
              { id: 'divider', label: '·' },
              { id: 'Top deals & offers', label: 'Top deals & offers' },
              { id: 'New arrivals', label: 'New arrivals' },
              { id: 'Popular picks', label: 'Popular picks' }
            ].map((pill, i) => {
              if (pill.id === 'divider') {
                return <span key={i} className="text-gray-300 font-bold px-1">{pill.label}</span>;
              }
              const isActive = activeTab === pill.id;
              return (
                <button
                  key={i}
                  onClick={() => setActiveTab(pill.id)}
                  className={cn(
                    "px-4 py-2 rounded-full text-xs font-extrabold uppercase tracking-wider transition-all border shrink-0 cursor-pointer",
                    isActive 
                      ? "bg-white text-[#FF5B00] border-2 border-[#FF5B00] shadow-sm" 
                      : "bg-white text-gray-500 border-gray-200 hover:bg-gray-50 hover:text-gray-900"
                  )}
                >
                  {pill.label}
                </button>
              );
            })}
          </div>

          {/* Right actions: Sorting & Toggle Mode */}
          <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end ml-auto shrink-0">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-gray-500 whitespace-nowrap">Sort by:</span>
              <div className="relative">
                <select
                  value={sortOption}
                  onChange={(e) => setSortOption(e.target.value as any)}
                  className="appearance-none bg-white border border-gray-200 rounded-lg px-3 py-1.5 pr-8 text-xs font-semibold text-gray-700 focus:outline-none focus:border-[#FF5B00] hover:bg-gray-50 cursor-pointer shadow-sm"
                >
                  <option value="popular">Popularity</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="rating-desc">Rating: High to Low</option>
                </select>
                <ChevronDown size={14} className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400" />
              </div>
            </div>

            <div className="flex bg-gray-100 p-1 rounded-lg border border-gray-200">
              <button 
                onClick={() => setViewMode('grid')}
                className={cn(
                  "p-1.5 rounded-md transition-all cursor-pointer",
                  viewMode === 'grid' ? "bg-[#FF5B00] text-white shadow-sm" : "text-gray-400 hover:text-gray-700"
                )}
                title="Grid view"
              >
                <Grid size={15} />
              </button>
              <button 
                onClick={() => setViewMode('list')}
                className={cn(
                  "p-1.5 rounded-md transition-all cursor-pointer",
                  viewMode === 'list' ? "bg-[#FF5B00] text-white shadow-sm" : "text-gray-400 hover:text-gray-700"
                )}
                title="List view"
              >
                <ListIcon size={15} />
              </button>
            </div>
          </div>

        </div>
      </section>

      {/* 3. Main Two-Column Layout */}
      <main className="max-w-[1440px] mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* LEFT SIDEBAR: FILTERS */}
          <aside className="col-span-1 lg:col-span-3 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-extrabold text-gray-900 flex items-center gap-2">
                <SlidersHorizontal size={18} className="text-gray-500" />
                Filters
              </h2>
              <button 
                onClick={handleResetFilters}
                className="text-xs font-extrabold text-[#FF5B00] hover:underline flex items-center gap-1 cursor-pointer bg-transparent border-0"
              >
                <RotateCcw size={12} />
                Clear all
              </button>
            </div>

            {/* Filter Card */}
            <div className="bg-white border border-gray-200 rounded-xl p-5 space-y-6 shadow-sm divide-y divide-gray-100 text-left">
              
              {/* Filter 1: Category dropdown */}
              <div className="space-y-2.5 text-left">
                <label className="block text-[10.5px] font-black uppercase tracking-wider text-gray-400">Category</label>
                <div className="relative">
                  <select
                    value={selectedCategory || ''}
                    onChange={(e) => setSelectedCategory(e.target.value === '' ? null : e.target.value)}
                    className="w-full h-10 px-3 bg-[#F9FAFB] border border-gray-200 rounded-lg text-xs font-semibold text-gray-700 outline-none focus:border-[#FF5B00]/50 cursor-pointer appearance-none"
                  >
                    <option value="">Select category &gt;</option>
                    {Object.keys(categoryCounts).map(catName => (
                      <option key={catName} value={catName}>
                        {catName} ({categoryCounts[catName]})
                      </option>
                    ))}
                  </select>
                  <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400" />
                </div>
              </div>

              {/* Filter 2: Brand Checklist with local search */}
              <div className="pt-5 space-y-3 text-left">
                <label className="block text-[10.5px] font-black uppercase tracking-wider text-gray-400">Brand</label>
                
                {/* Brand Search input */}
                <div className="relative">
                  <span className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                    <Search size={13} className="text-gray-400" />
                  </span>
                  <input
                    type="text"
                    value={brandSearch}
                    onChange={(e) => setBrandSearch(e.target.value)}
                    placeholder="Search brand"
                    className="w-full h-9 pl-8 pr-3 bg-[#F9FAFB] border border-gray-200 rounded-lg text-xs font-semibold text-gray-700 placeholder-gray-400 focus:outline-none focus:border-[#FF5B00]/40 transition-colors"
                  />
                </div>

                {/* Brand Checkbox List */}
                <div className="space-y-2 max-h-48 overflow-y-auto pr-1 no-scrollbar text-left">
                  {filteredBrandsList.length === 0 ? (
                    <p className="text-[11px] text-gray-400 italic">No brands found</p>
                  ) : (
                    filteredBrandsList.map((brand) => {
                      const isChecked = selectedBrand === brand.name;
                      return (
                        <label 
                          key={brand.name} 
                          className="flex items-center justify-between text-xs font-bold text-gray-600 hover:text-gray-900 cursor-pointer select-none group py-0.5"
                        >
                          <div className="flex items-center gap-2">
                            <input 
                              type="checkbox"
                              checked={isChecked}
                              onChange={() => setSelectedBrand(isChecked ? null : brand.name)}
                              className="w-4 h-4 rounded text-[#FF5B00] focus:ring-[#FF5B00]/30 border-gray-300 accent-[#FF5B00] cursor-pointer"
                            />
                            <span className={cn("transition-colors", isChecked ? "text-[#FF5B00] font-extrabold" : "")}>{brand.name}</span>
                          </div>
                          <span className="text-[10px] text-gray-400 font-semibold group-hover:text-gray-500">({brand.count})</span>
                        </label>
                      );
                    })
                  )}
                </div>
              </div>

              {/* Filter 3: Price Range (BDT) */}
              <div className="pt-5 space-y-3 text-left">
                <label className="block text-[10.5px] font-black uppercase tracking-wider text-gray-400">Price Range (BDT)</label>
                
                {/* Price range dual-input styling */}
                <div className="flex items-center gap-2">
                  <div className="relative flex-1">
                    <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[10px] font-bold text-gray-400">৳</span>
                    <input
                      type="number"
                      placeholder="Min"
                      value={priceMin || ''}
                      onChange={(e) => {
                        const val = Math.max(0, Number(e.target.value) || 0);
                        setPriceMin(Math.min(val, priceMax - 1));
                      }}
                      className="w-full h-8 pl-5 pr-1 bg-[#F9FAFB] border border-gray-200 rounded-lg text-xs font-bold text-gray-700 outline-none focus:border-[#FF5B00]"
                    />
                  </div>
                  <span className="text-gray-400 text-[10px] font-bold">to</span>
                  <div className="relative flex-1">
                    <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[10px] font-bold text-gray-400">৳</span>
                    <input
                      type="number"
                      placeholder="Max"
                      value={priceMax || ''}
                      onChange={(e) => {
                        const val = Math.max(1, Number(e.target.value) || 500000);
                        setPriceMax(Math.max(val, priceMin + 1));
                      }}
                      className="w-full h-8 pl-5 pr-1 bg-[#F9FAFB] border border-gray-200 rounded-lg text-xs font-bold text-gray-700 outline-none focus:border-[#FF5B00]"
                    />
                  </div>
                </div>

                {/* Built-in high fidelity double price slider */}
                <div className="relative pt-4 pb-2">
                  <div className="h-1 bg-gray-200 rounded-full w-full relative">
                    <div 
                      className="absolute h-full bg-[#FF5B00] rounded-full"
                      style={{
                        left: `${(priceMin / 500000) * 100}%`,
                        right: `${100 - (priceMax / 500000) * 100}%`
                      }}
                    />
                  </div>
                  <div className="relative w-full">
                    <input 
                      type="range"
                      min="0"
                      max="500000"
                      step="1000"
                      value={priceMin}
                      onChange={(e) => {
                        const val = Number(e.target.value);
                        setPriceMin(Math.min(val, priceMax - 1000));
                      }}
                      className="absolute pointer-events-auto h-1 w-full opacity-0 cursor-pointer top-[-6px]"
                    />
                    <input 
                      type="range"
                      min="0"
                      max="500000"
                      step="1000"
                      value={priceMax}
                      onChange={(e) => {
                        const val = Number(e.target.value);
                        setPriceMax(Math.max(val, priceMin + 1000));
                      }}
                      className="absolute pointer-events-auto h-1 w-full opacity-0 cursor-pointer top-[-6px]"
                    />
                  </div>
                  {/* Visual Handles */}
                  <div className="absolute inset-x-0 top-3 pointer-events-none h-4">
                    <div 
                      className="absolute w-4.5 h-4.5 rounded-full bg-[#FF5B00] border-2 border-white shadow-md transform -translate-x-1/2 -translate-y-1/2"
                      style={{ left: `${(priceMin / 500000) * 100}%` }}
                    />
                    <div 
                      className="absolute w-4.5 h-4.5 rounded-full bg-[#FF5B00] border-2 border-white shadow-md transform -translate-x-1/2 -translate-y-1/2"
                      style={{ left: `${(priceMax / 500000) * 100}%` }}
                    />
                  </div>
                </div>

                {/* Nice Range display text */}
                <div className="flex justify-between items-center text-[10px] font-black text-gray-400 uppercase tracking-wider">
                  <span>৳{priceMin.toLocaleString()}</span>
                  <span>৳{priceMax.toLocaleString()}+</span>
                </div>

                {/* Built-in styled price quick selectors */}
                <div className="flex flex-wrap gap-1.5 pt-1 text-left">
                  {[
                    { label: 'Under ৳5k', min: 0, max: 5000 },
                    { label: '৳5k - ৳25k', min: 5000, max: 25000 },
                    { label: '৳25k - ৳100k', min: 25000, max: 100000 },
                    { label: '৳100k+', min: 100000, max: 500000 }
                  ].map((preset, i) => {
                    const isSelected = priceMin === preset.min && priceMax === preset.max;
                    return (
                      <button
                        key={i}
                        type="button"
                        onClick={() => {
                          setPriceMin(preset.min);
                          setPriceMax(preset.max);
                        }}
                        className={cn(
                          "px-2.5 py-1 rounded text-[9px] font-bold transition-all border cursor-pointer",
                          isSelected 
                            ? "bg-[#FF5B00]/10 border-[#FF5B00] text-[#FF5B00]" 
                            : "bg-white border-gray-200 text-gray-500 hover:border-gray-300"
                        )}
                      >
                        {preset.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Filter 4: Availability */}
              <div className="pt-5 space-y-2.5 text-left">
                <label className="block text-[10.5px] font-black uppercase tracking-wider text-gray-400">Availability</label>
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-xs font-bold text-gray-600 hover:text-gray-900 cursor-pointer select-none">
                    <input 
                      type="checkbox"
                      checked={availabilityFilter === 'in-stock'}
                      onChange={() => setAvailabilityFilter(availabilityFilter === 'in-stock' ? 'all' : 'in-stock')}
                      className="w-4 h-4 rounded text-[#FF5B00] focus:ring-[#FF5B00]/30 border-gray-300 accent-[#FF5B00] cursor-pointer"
                    />
                    <span>In Stock ({productsSource.filter(p => (p.stock || 0) > 0).length})</span>
                  </label>
                  <label className="flex items-center gap-2 text-xs font-bold text-gray-600 hover:text-gray-900 cursor-pointer select-none">
                    <input 
                      type="checkbox"
                      checked={fastDeliveryOnly}
                      onChange={() => setFastDeliveryOnly(!fastDeliveryOnly)}
                      className="w-4 h-4 rounded text-[#FF5B00] focus:ring-[#FF5B00]/30 border-gray-300 accent-[#FF5B00] cursor-pointer"
                    />
                    <span>Fast Delivery ({productsSource.filter(p => p.fastDelivery === true || p.codSupport === true).length})</span>
                  </label>
                </div>
              </div>

              {/* Filter 5: Ratings Checklist */}
              <div className="pt-5 space-y-2.5 text-left">
                <label className="block text-[10.5px] font-black uppercase tracking-wider text-gray-400">Ratings</label>
                <div className="space-y-2">
                  {[5, 4, 3].map((stars) => {
                    const isChecked = ratingFilter === stars;
                    return (
                      <label 
                        key={stars}
                        className="flex items-center justify-between text-xs font-bold text-gray-600 hover:text-gray-900 cursor-pointer select-none group"
                      >
                        <div className="flex items-center gap-2">
                          <input 
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => setRatingFilter(isChecked ? null : stars)}
                            className="w-4 h-4 rounded text-[#FF5B00] focus:ring-[#FF5B00]/30 border-gray-300 accent-[#FF5B00] cursor-pointer"
                          />
                          <div className="flex items-center gap-0.5">
                            {Array.from({ length: 5 }).map((_, idx) => (
                              <Star 
                                key={idx} 
                                size={12} 
                                className={cn(
                                  idx < stars ? "fill-[#F97316] text-[#F97316]" : "text-gray-200 fill-gray-200"
                                )} 
                              />
                            ))}
                            {stars < 5 && <span className="text-[10px] text-gray-400 font-semibold ml-1">& up</span>}
                          </div>
                        </div>
                        <span className="text-[10px] text-gray-400 font-semibold">
                          ({productsSource.filter(p => (p.rating || 4.5) >= stars).length})
                        </span>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Apply Filters CTA Button */}
              <div className="pt-5">
                <button
                  onClick={() => setIsLoading(true)}
                  className="w-full py-3.5 bg-gray-950 hover:bg-[#FF5B00] text-white font-extrabold rounded-lg text-xs uppercase tracking-widest transition-all shadow-sm flex items-center justify-center gap-2 border-0 cursor-pointer"
                >
                  <Filter size={13} />
                  Apply Filters
                </button>
              </div>

            </div>
          </aside>

          {/* RIGHT SIDEBAR: PRODUCT LISTS / GRID */}
          <section className="col-span-1 lg:col-span-9 space-y-6 text-left">
            
            {/* Filter tags feedback */}
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-2 text-sm text-gray-500 font-semibold">
                <span className="text-gray-900 font-bold">
                  {filteredProducts.length}
                </span>{' '}
                verified items found
              </div>

              {/* Active Chip Overviews */}
              <div className="flex flex-wrap items-center gap-2">
                {selectedCategory && (
                  <div className="flex items-center gap-1 px-2.5 py-1 bg-gray-100 rounded-md text-[10px] font-bold text-gray-600 border border-gray-200 uppercase tracking-wider">
                    Category: {selectedCategory}
                    <X size={12} className="text-gray-400 hover:text-[#FF5B00] cursor-pointer ml-1" onClick={() => setSelectedCategory(null)} />
                  </div>
                )}
                {selectedBrand && (
                  <div className="flex items-center gap-1 px-2.5 py-1 bg-gray-100 rounded-md text-[10px] font-bold text-gray-600 border border-gray-200 uppercase tracking-wider">
                    Brand: {selectedBrand}
                    <X size={12} className="text-gray-400 hover:text-[#FF5B00] cursor-pointer ml-1" onClick={() => setSelectedBrand(null)} />
                  </div>
                )}
                {ratingFilter !== null && (
                  <div className="flex items-center gap-1 px-2.5 py-1 bg-gray-100 rounded-md text-[10px] font-bold text-gray-600 border border-gray-200 uppercase tracking-wider">
                    {ratingFilter}★ & Up
                    <X size={12} className="text-gray-400 hover:text-[#FF5B00] cursor-pointer ml-1" onClick={() => setRatingFilter(null)} />
                  </div>
                )}
                {availabilityFilter !== 'all' && (
                  <div className="flex items-center gap-1 px-2.5 py-1 bg-gray-100 rounded-md text-[10px] font-bold text-gray-600 border border-gray-200 uppercase tracking-wider">
                    In Stock Only
                    <X size={12} className="text-gray-400 hover:text-[#FF5B00] cursor-pointer ml-1" onClick={() => setAvailabilityFilter('all')} />
                  </div>
                )}
                {fastDeliveryOnly && (
                  <div className="flex items-center gap-1 px-2.5 py-1 bg-gray-100 rounded-md text-[10px] font-bold text-gray-600 border border-gray-200 uppercase tracking-wider">
                    Fast Delivery
                    <X size={12} className="text-gray-400 hover:text-[#FF5B00] cursor-pointer ml-1" onClick={() => setFastDeliveryOnly(false)} />
                  </div>
                )}
                {(priceMin > 0 || priceMax < 500000) && (
                  <div className="flex items-center gap-1 px-2.5 py-1 bg-gray-100 rounded-md text-[10px] font-bold text-gray-600 border border-gray-200 uppercase tracking-wider">
                    ৳{priceMin.toLocaleString()} - ৳{priceMax.toLocaleString()}
                    <X size={12} className="text-gray-400 hover:text-[#FF5B00] cursor-pointer ml-1" onClick={() => { setPriceMin(0); setPriceMax(500000); }} />
                  </div>
                )}
              </div>
            </div>

            {/* Grid display - Fluid layout supporting 6 columns */}
            {isLoading ? (
              <div className={cn(
                "grid gap-4",
                viewMode === 'grid' 
                  ? "grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6" 
                  : "grid-cols-1"
              )}>
                {Array.from({ length: 12 }).map((_, i) => (
                  <ProductCardSkeleton key={i} variant={viewMode === 'list' ? 'list' : 'grid'} />
                ))}
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="py-20 text-center bg-white rounded-xl border border-gray-200 shadow-sm flex flex-col items-center justify-center gap-3">
                <SlidersHorizontal size={40} className="stroke-1 text-gray-300" />
                <h3 className="text-sm font-black text-gray-900 uppercase tracking-wider">No matching products found</h3>
                <p className="text-xs text-gray-400 max-w-sm leading-relaxed px-4">
                  We couldn't find any products matching your specific combinations. Try clearing some filters or searching for alternative key terms.
                </p>
                <button 
                  onClick={handleResetFilters} 
                  className="px-5 py-2.5 bg-[#FF5B00] hover:bg-[#E04F00] text-white text-xs font-bold uppercase tracking-wider rounded-lg shadow transition-all border-0 cursor-pointer mt-2"
                >
                  Reset all filters
                </button>
              </div>
            ) : (
              <div className={cn(
                "grid gap-4 transition-all duration-300",
                viewMode === 'grid' 
                  ? "grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6" 
                  : "grid-cols-1"
              )}>
                {filteredProducts.map((product) => (
                  <ProductCard 
                    key={product.id} 
                    product={product} 
                    variant={viewMode === 'list' ? 'list' : 'grid'} 
                  />
                ))}
              </div>
            )}

            {/* 4. Elegant Pagination Section */}
            <div className="pt-12 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-6">
              
              {/* Pagination controls */}
              <div className="flex items-center gap-1.5 max-w-full overflow-x-auto no-scrollbar">
                <button 
                  disabled 
                  className="w-10 h-10 rounded-lg flex items-center justify-center bg-white border border-gray-200 text-gray-400 cursor-not-allowed transition-all hover:bg-gray-50 shrink-0"
                >
                  &lt;
                </button>
                {[1, 2, 3, '...', 520].map((page, idx) => (
                  <button
                    key={idx}
                    className={cn(
                      "w-10 h-10 rounded-lg flex items-center justify-center text-xs font-bold transition-all shrink-0 cursor-pointer",
                      page === 1 
                        ? "bg-[#FF5B00] text-white border border-[#FF5B00] shadow-sm shadow-[#FF5B00]/10" 
                        : page === '...' 
                          ? "bg-transparent text-gray-400 cursor-default" 
                          : "bg-white border border-gray-200 text-gray-700 hover:border-[#FF5B00] hover:text-[#FF5B00]"
                    )}
                  >
                    {page}
                  </button>
                ))}
                <button 
                  className="w-10 h-10 rounded-lg flex items-center justify-center bg-white border border-gray-200 text-gray-700 transition-all hover:border-[#FF5B00] hover:text-[#FF5B00] shrink-0 cursor-pointer"
                >
                  &gt;
                </button>
              </div>

              {/* Pagination limit control & stats */}
              <div className="flex items-center gap-4 text-xs font-semibold text-gray-500 shrink-0">
                <div className="flex items-center gap-1.5">
                  <span>Show:</span>
                  <select 
                    className="bg-white border border-gray-200 rounded-lg px-2.5 py-1 text-xs font-bold text-gray-700 outline-none focus:border-[#FF5B00] shadow-sm cursor-pointer"
                    defaultValue="24"
                  >
                    <option value="12">12 per page</option>
                    <option value="24">24 per page</option>
                    <option value="48">48 per page</option>
                  </select>
                </div>
                <span>
                  Showing <span className="text-gray-900 font-bold">{filteredProducts.length}</span> of <span className="text-gray-900 font-bold">{filteredProducts.length}</span> results
                </span>
              </div>

            </div>

          </section>

        </div>
      </main>
    </div>
  );
}
