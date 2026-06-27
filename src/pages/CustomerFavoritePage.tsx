import React, { useState, useEffect, useMemo } from 'react';
import { 
  Search, Star, CheckCircle2, Heart, Zap, HelpCircle, Info, Package, 
  ShieldCheck, Bookmark, Plus, X, ListFilter, Flame, Award, Users, 
  ChevronRight, ArrowUpRight, Check, Send, AlertTriangle, Eye, Smartphone, Shirt
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { cn } from '../lib/utils';
import { QuickAccessCard } from '../components/QuickAccessCard';
import { motion, AnimatePresence } from 'motion/react';
import { useGlobalState } from '../context/GlobalStateContext';
import { ProductCard } from '../components/ProductCard';
import { CATEGORIES } from '../constants';
import { toast } from 'react-hot-toast';
import { DragScrollContainer, UniversalFilterRenderer, QuickFilterBar, ActiveFilterChips, FullSidebarFilterPanel, FilterProfile, useRegisterPageFilters } from '../components/FilterEngine';

const FAVORITES_PAGE_FILTER_PROFILE: FilterProfile = {
  entity: 'products',
  filters: [
    {
      id: 'price_custom',
      name: 'Price Range (BDT)',
      type: 'price_custom'
    },
    {
      id: 'category',
      name: 'Category List',
      type: 'single_select',
      options: [
        { value: 'all', label: 'All Categories' },
        { value: 'Mobile & Phones', label: 'Mobiles & Phones' },
        { value: 'Tech & Electronics', label: 'Tech & Electronics' },
        { value: 'Jewelry & Accessories', label: 'Jewelry & Accessories' },
        { value: 'Fashion & Lifestyle', label: 'Fashion & Lifestyle' },
        { value: 'Beauty', label: 'Beauty & Skincare' },
        { value: 'Home & Living', label: 'Home & Living' }
      ]
    },
    {
      id: 'brand',
      name: 'Brands',
      type: 'single_select',
      options: [
        { value: 'all', label: 'All Brands' },
        { value: 'Sony', label: 'Sony' },
        { value: 'Samsung', label: 'Samsung' },
        { value: 'Bata', label: 'Bata' },
        { value: 'Apex', label: 'Apex' },
        { value: 'Aarong', label: 'Aarong' },
        { value: 'Sailor', label: 'Sailor' }
      ]
    },
    {
      id: 'rating',
      name: 'Customer Rating',
      type: 'single_select',
      options: [
        { value: 'all', label: 'All Ratings' },
        { value: '4.8', label: '4.8 Stars & Up' },
        { value: '4.5', label: '4.5 Stars & Up' },
        { value: '4.0', label: '4.0 Stars & Up' }
      ]
    },
    {
      id: 'votes',
      name: 'Votes (Most Loved)',
      type: 'single_select',
      options: [
        { value: 'all', label: 'Any Vote Count' },
        { value: '500', label: '500+ Saved Votes' },
        { value: '300', label: '300+ Saved Votes' },
        { value: '100', label: '100+ Saved Votes' }
      ]
    },
    {
      id: 'availability',
      name: 'Stock Status',
      type: 'single_select',
      options: [
        { value: 'all', label: 'All Items' },
        { value: 'in-stock', label: 'In Stock Only' },
        { value: 'out-of-stock', label: 'Out of Stock' }
      ]
    },
    {
      id: 'verified',
      name: 'Verified Seller Status',
      type: 'single_select',
      options: [
        { value: 'all', label: 'All Statuses' },
        { value: 'verified', label: 'Verified Seller Only' },
        { value: 'community', label: 'Community Vetted Only' }
      ]
    },
    {
      id: 'delivery',
      name: 'Delivery Channel',
      type: 'single_select',
      options: [
        { value: 'all', label: 'All Deliveries' },
        { value: 'free', label: 'Free Delivery Only' },
        { value: 'express', label: 'Express Dhaka Delivery' }
      ]
    },
    {
      id: 'discount',
      name: 'Super Savings',
      type: 'single_select',
      options: [
        { value: 'all', label: 'Any Discount' },
        { value: '10', label: '10% OFF & Up' },
        { value: '25', label: '25% OFF & Up' },
        { value: '40', label: '40% OFF & Up' }
      ]
    },
    {
      id: 'country',
      name: 'Manufacturer Country',
      type: 'single_select',
      options: [
        { value: 'all', label: 'All Origins' },
        { value: 'local', label: 'Made in Bangladesh 🇧🇩' },
        { value: 'imported', label: 'International Imported 🌐' }
      ]
    }
  ]
};

export function CustomerFavoritePage() {
  const navigate = useNavigate();
  const { allProducts, allBrands, mode, addToCart, isLoggedIn, setIsLoggedIn, getBrandClaimStatus } = useGlobalState();

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, []);

  // PAGE STATES
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('All Products'); // Sticky categories
  const [trendingFilter, setTrendingFilter] = useState('🔥 Trending Today'); // Keep for backward compatibility or quick filter sync

  // NEW V2 STATE VARIABLES
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedBrand, setSelectedBrand] = useState<string | null>(null);
  const [customPriceInputs, setCustomPriceInputs] = useState<{ min: string; max: string }>({ min: '', max: '' });
  const [priceRangeV2, setPriceRangeV2] = useState<[number, number | null]>([0, null]);
  const [ratingFilter, setRatingFilter] = useState<string | null>(null);
  const [votesFilter, setVotesFilter] = useState<string | null>(null);
  const [availabilityFilter, setAvailabilityFilter] = useState<string | null>(null);
  const [verifiedBrandFilter, setVerifiedBrandFilter] = useState<string | null>(null);
  const [deliveryFilter, setDeliveryFilter] = useState<string | null>(null);
  const [discountFilter, setDiscountFilter] = useState<string | null>(null);
  const [countryFilter, setCountryFilter] = useState<string | null>(null);
  const [sortOption, setSortOption] = useState<string>('default'); // default, rating-desc, price-asc, price-desc, views-desc

  // Restore state from sessionStorage on mount
  useEffect(() => {
    try {
      const saved = sessionStorage.getItem('choosify_favorites_filters');
      if (saved) {
        const filters = JSON.parse(saved);
        if (filters.selectedCategory) setSelectedCategory(filters.selectedCategory);
        if (filters.selectedBrand) setSelectedBrand(filters.selectedBrand);
        if (filters.customPriceInputs) setCustomPriceInputs(filters.customPriceInputs);
        if (filters.priceRangeV2) setPriceRangeV2(filters.priceRangeV2);
        if (filters.ratingFilter) setRatingFilter(filters.ratingFilter);
        if (filters.votesFilter) setVotesFilter(filters.votesFilter);
        if (filters.availabilityFilter) setAvailabilityFilter(filters.availabilityFilter);
        if (filters.verifiedBrandFilter) setVerifiedBrandFilter(filters.verifiedBrandFilter);
        if (filters.deliveryFilter) setDeliveryFilter(filters.deliveryFilter);
        if (filters.discountFilter) setDiscountFilter(filters.discountFilter);
        if (filters.countryFilter) setCountryFilter(filters.countryFilter);
        if (filters.trendingFilter) setTrendingFilter(filters.trendingFilter);
        if (filters.sortOption) setSortOption(filters.sortOption);
        if (filters.activeTab) setActiveTab(filters.activeTab);
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  // Save state on updates
  useEffect(() => {
    const filters = {
      selectedCategory,
      selectedBrand,
      customPriceInputs,
      priceRangeV2,
      ratingFilter,
      votesFilter,
      availabilityFilter,
      verifiedBrandFilter,
      deliveryFilter,
      discountFilter,
      countryFilter,
      trendingFilter,
      sortOption,
      activeTab
    };
    sessionStorage.setItem('choosify_favorites_filters', JSON.stringify(filters));
  }, [
    selectedCategory, selectedBrand, customPriceInputs, priceRangeV2, 
    ratingFilter, votesFilter, availabilityFilter, verifiedBrandFilter, 
    deliveryFilter, discountFilter, countryFilter, trendingFilter, sortOption, activeTab
  ]);
  
  // Submit modal state
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  
  // Custom submitted products database with 1 pre-seeded pending item
  const [customSubmittedProducts, setCustomSubmittedProducts] = useState<any[]>([
    {
      id: 99001,
      title: "Handcrafted Premium Jamdani Silk Panjabi",
      brand: "Dhaka Heritage Weaves",
      category: "Fashion & Lifestyle",
      description: "Sourced from a viral Facebook Live group highlighting local weavers. BSTI certified quality and verified hand-loom craft.",
      price: 6500,
      originalPrice: 8500,
      discount: "23% OFF",
      image: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=400&h=400&fit=crop",
      mode_type: "retail",
      status: "pending", // pending / approved / rejected
      submittedAt: "2 mins ago",
      productType: "deal",
      promoCode: "JAMDANI25",
      validUntil: "2026-06-30",
      socialProof: "Viral Live feed with over 45k comments & pre-orders"
    }
  ]);

  // Dynamic Form Field States
  const [productType, setProductType] = useState<'standard' | 'deal' | 'creator'>('standard');
  const [isSubmitSuccess, setIsSubmitSuccess] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [uploadedFileName, setUploadedFileName] = useState<string>('');
  const [uploadedFilePreview, setUploadedFilePreview] = useState<string>('');

  // Category mapping helper
  const mapTabToCategory = (tab: string) => {
    if (tab === 'All Products') return null;
    if (tab === 'Gadgets') return ['Mobile & Phones', 'Tech & Electronics', 'TV & Appliances'];
    if (tab === 'Jewelry') return ['Jewelry & Accessories'];
    if (tab === 'Clothing') return ['Fashion & Lifestyle'];
    if (tab === 'Belts') return ['Fashion & Lifestyle'];
    if (tab === 'Eyewear') return ['Jewelry & Accessories'];
    if (tab === 'Footwear') return ['Fashion & Lifestyle'];
    if (tab === 'Accessories') return ['Jewelry & Accessories'];
    if (tab === 'Beauty') return ['Beauty'];
    if (tab === 'Home & Living') return ['Home & Living'];
    return null;
  };

  // We tag standard products dynamically with Viral badges
  const viralProductsList = useMemo(() => {
    const standardTagged = allProducts.map((p, idx) => {
      // Define a stable viral tag sequence based on ID
      let tag = '🔥 Viral';
      let tagColor = 'bg-[#E8500A]';
      let source = '⭐ Choosify Picks';
      
      const badgeType = idx % 5;
      if (badgeType === 0) {
        tag = '🔥 Viral';
        tagColor = 'bg-[#E8500A]';
        source = '⭐ Choosify Picks';
      } else if (badgeType === 1) {
        tag = '❤️ Customer Favorite';
        tagColor = 'bg-rose-500';
        source = '❤️ Customer Favorites';
      } else if (badgeType === 2) {
        tag = '⭐ Staff Pick';
        tagColor = 'bg-amber-500';
        source = '🏆 Editor Choice';
      } else if (badgeType === 3) {
        tag = '🏆 Editor Choice';
        tagColor = 'bg-indigo-600';
        source = '🏆 Editor Choice';
      } else if (badgeType === 4) {
        tag = '🚀 Trending';
        tagColor = 'bg-blue-600';
        source = '👥 Community Submitted';
      }

      return {
        ...p,
        tag,
        tagColor,
        source,
        viralScore: 90 + (idx * 3) % 10,
        viewsThisWeek: 450 + (idx * 112) % 1200,
        heartsCount: 120 + (idx * 56) % 800
      };
    });

    const approvedSubmissions = customSubmittedProducts
      .filter((p: any) => p.status === 'approved')
      .map((p: any) => {
        return {
          ...p,
          viralScore: p.viralScore || 95,
          viewsThisWeek: p.viewsThisWeek || 680,
          heartsCount: p.heartsCount || 220,
          tag: p.tag || '👥 Approved Trend',
          tagColor: p.tagColor || 'bg-emerald-600',
          source: p.source || '👥 Community Submitted'
        };
      });

    return [...approvedSubmissions, ...standardTagged];
  }, [allProducts, customSubmittedProducts]);

  // CATEGORY STICKY BAR LIST ITEMS (Dynamically constructed from existing category database)
  const navigationItems = useMemo(() => {
    const dbGadgets = CATEGORIES.find(c => c.id === 'mobile') ? 'Gadgets' : '';
    const dbJewelry = CATEGORIES.find(c => c.id === 'jewelry') ? 'Jewelry' : '';
    const dbClothing = CATEGORIES.find(c => c.id === 'fashion') ? 'Clothing' : '';
    const dbHome = CATEGORIES.find(c => c.id === 'home') ? 'Home & Living' : '';

    return [
      'All Products',
      dbGadgets,
      dbJewelry,
      dbClothing,
      'Belts',
      'Eyewear',
      dbHome
    ].filter(Boolean);
  }, []);

  // LEADERBOARD (Top 5 products by views/viralScore)
  const viralLeaderboard = useMemo(() => {
    return [...viralProductsList]
      .sort((a, b) => b.viralScore - a.viralScore)
      .slice(0, 5);
  }, [viralProductsList]);

  // MOST LOVED LIST (compact cards)
  const mostLovedProducts = useMemo(() => {
    return [...viralProductsList]
      .sort((a, b) => b.heartsCount - a.heartsCount)
      .slice(0, 4);
  }, [viralProductsList]);

  // SPONSORED SINGLE PRODUCT (Sony WH-1000XM5 or custom placeholder)
  const sponsoredProduct = useMemo(() => {
    return viralProductsList.find(p => p.id === 2 || p.id === 1002) || viralProductsList[0];
  }, [viralProductsList]);

  // CORE FILTER ENGINE: CENTRES MAIN LIST ITEMS IN V2 ARCHITECTURE
  const filteredProducts = useMemo(() => {
    let result = [...viralProductsList];

    // 1. Sticky Category Tab Filtration (syncing with top navigation)
    const targetCategories = mapTabToCategory(activeTab);
    if (targetCategories) {
      result = result.filter(p => p.category && targetCategories.includes(p.category));

      // Extra fine-filtering matching specific labels for narrow tags like Belts or Footwear
      if (activeTab === 'Belts') {
        result = result.filter(p => p.title.toLowerCase().includes('belt'));
      } else if (activeTab === 'Footwear') {
        result = result.filter(p => 
          p.title.toLowerCase().includes('runner') || 
          p.title.toLowerCase().includes('shoe') || 
          p.title.toLowerCase().includes('sneaker') ||
          p.title.toLowerCase().includes('sandal')
        );
      } else if (activeTab === 'Eyewear') {
        result = result.filter(p => 
          p.title.toLowerCase().includes('glass') || 
          p.title.toLowerCase().includes('sun') || 
          p.title.toLowerCase().includes('eyewear')
        );
      }
    }

    // 2. Search Query filter (matches original query)
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(p => 
        p.title.toLowerCase().includes(q) || 
        (p.category || '').toLowerCase().includes(q) || 
        (p.brand || '').toLowerCase().includes(q)
      );
    }

    // 3. Category V2 Filter
    if (selectedCategory) {
      result = result.filter(p => p.category === selectedCategory);
    }

    // 4. Brand V2 Filter
    if (selectedBrand) {
      result = result.filter(p => p.brand?.toLowerCase() === selectedBrand.toLowerCase());
    }

    // 5. Custom Price V2 Filter
    if (priceRangeV2[0] > 0 || priceRangeV2[1] !== null) {
      const [min, max] = priceRangeV2;
      result = result.filter(p => {
        const val = p.price;
        if (val < min) return false;
        if (max !== null && val > max) return false;
        return true;
      });
    }

    // 6. Rating V2 Filter (rating score minimum)
    if (ratingFilter) {
      const minRate = parseFloat(ratingFilter);
      result = result.filter(p => {
        const rate = p.rating || 4.5; // fallback
        return rate >= minRate;
      });
    }

    // 7. Votes V2 Filter (heartsCount minimum)
    if (votesFilter) {
      const minVotes = parseInt(votesFilter, 10);
      result = result.filter(p => p.heartsCount >= minVotes);
    }

    // 8. Availability V2 Filter
    if (availabilityFilter) {
      if (availabilityFilter === 'in-stock') {
        result = result.filter(p => p.inStock !== false && p.id % 12 !== 0); // dynamic simulation/checking
      } else if (availabilityFilter === 'out-of-stock') {
        result = result.filter(p => p.inStock === false || p.id % 12 === 0);
      }
    }

    // 9. Verified Seller Filter (checks brand claims status or verified tag)
    if (verifiedBrandFilter) {
      result = result.filter(p => {
        const status = getBrandClaimStatus(p.brand);
        if (verifiedBrandFilter === 'verified') return status === 'verified';
        if (verifiedBrandFilter === 'community') return status === 'community' || status === 'pending';
        return true;
      });
    }

    // 10. Delivery Channel V2 Filter
    if (deliveryFilter) {
      if (deliveryFilter === 'free') {
        result = result.filter(p => p.id % 3 === 0); // simulated free shipping
      } else if (deliveryFilter === 'express') {
        result = result.filter(p => p.id % 5 === 0); // simulated express shipping
      }
    }

    // 11. Discount V2 Filter
    if (discountFilter) {
      const minDisc = parseInt(discountFilter, 10);
      result = result.filter(p => {
        // extract discount percentage from discount string e.g. "23% OFF"
        const pctStr = (p.discount || '0%').replace(/[^0-9]/g, '');
        const pct = parseInt(pctStr, 10) || 0;
        return pct >= minDisc;
      });
    }

    // 12. Country V2 Filter
    if (countryFilter) {
      if (countryFilter === 'local') {
        const localBrands = ['aarong', 'sailor', 'dhaka heritage weaves', 'bata bangladesh', 'apex'];
        result = result.filter(p => {
          const br = (p.brand || '').toLowerCase();
          return localBrands.some(lb => br.includes(lb)) || p.id % 2 === 0;
        });
      } else if (countryFilter === 'imported') {
        const localBrands = ['aarong', 'sailor', 'dhaka heritage weaves', 'bata bangladesh', 'apex'];
        result = result.filter(p => {
          const br = (p.brand || '').toLowerCase();
          return !localBrands.some(lb => br.includes(lb)) && p.id % 2 !== 0;
        });
      }
    }

    // 13. Dynamic Trending and Quick Sweeps Filter (Trending today, Trending this week, Rising, Most Loved, Staff Picks, etc.)
    if (trendingFilter === '❤️ Most Loved') {
      result.sort((a, b) => b.heartsCount - a.heartsCount);
    } else if (trendingFilter === '🚀 Rising Products') {
      result.sort((a, b) => b.viewsThisWeek - a.viewsThisWeek);
    } else if (trendingFilter === '🛒 Most Purchased') {
      result.sort((a, b) => b.id - a.id);
    } else if (trendingFilter === '⭐ Staff Picks') {
      result = result.filter(p => p.tag === '⭐ Staff Pick');
    } else {
      // Default trending sorting
      result.sort((a, b) => b.viralScore - a.viralScore);
    }

    // 14. Sort Options (V2 specification)
    if (sortOption === 'rating-desc') {
      result.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    } else if (sortOption === 'price-asc') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortOption === 'price-desc') {
      result.sort((a, b) => b.price - a.price);
    } else if (sortOption === 'views-desc') {
      result.sort((a, b) => b.viewsThisWeek - a.viewsThisWeek);
    }

    return result;
  }, [
    viralProductsList, activeTab, searchQuery, selectedCategory, selectedBrand, 
    priceRangeV2, ratingFilter, votesFilter, availabilityFilter, verifiedBrandFilter, 
    deliveryFilter, discountFilter, countryFilter, trendingFilter, sortOption, getBrandClaimStatus
  ]);

  // FEATURED: Top 3 items based on views count in filtered list (using `ProductCard` with variant="featured")
  const featuredViralProducts = useMemo(() => {
    return [...filteredProducts]
      .sort((a, b) => b.viewsThisWeek - a.viewsThisWeek)
      .slice(0, 5);
  }, [filteredProducts]);

  useRegisterPageFilters({
    pageName: 'Customer Favorites',
    renderSearch: () => (
      <div className="relative">
        <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
          <Search size={13} className="text-[#E8500A]" />
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search products..."
          className="w-full h-9 pl-8 pr-3 bg-white border border-[#e8edf2] rounded-[5px] text-[11px] font-semibold text-[#1A1D4E] placeholder-gray-400 focus:outline-none focus:border-[#E8500A]/50 transition-colors"
        />
      </div>
    ),
    quickFilters: [
      { id: 'bdt-under-1k', label: '💸 BDT Under 1,000', active: priceRangeV2[1] === 1000, onClick: () => { if (priceRangeV2[1] === 1000) { setPriceRangeV2([0, null]); setCustomPriceInputs({ min: '', max: '' }); } else { setPriceRangeV2([0, 1000]); setCustomPriceInputs({ min: '0', max: '1000' }); } } },
      { id: 'rating-4-5', label: '⭐ Rating 4.5+', active: ratingFilter === '4.5', onClick: () => setRatingFilter(ratingFilter === '4.5' ? null : '4.5') },
      { id: 'trending-today', label: '🔥 Trending Today', active: trendingFilter === '🔥 Trending Today', onClick: () => setTrendingFilter(trendingFilter === '🔥 Trending Today' ? 'all' : '🔥 Trending Today') },
      { id: 'instock', label: '✓ In Stock', active: availabilityFilter === 'instock', onClick: () => setAvailabilityFilter(availabilityFilter === 'instock' ? null : 'instock') }
    ],
    renderFilters: () => (
      <div className="flex flex-col gap-4">
        <UniversalFilterRenderer
          profile={{
            entity: 'products',
            filters: FAVORITES_PAGE_FILTER_PROFILE.filters.slice(0, 5) // Price Scope, Categories, Brands, Customer Rating, Votes
          }}
          activeFilters={{
            price_custom: true, // Custom priced elements
            category: selectedCategory,
            brand: selectedBrand,
            rating: ratingFilter,
            votes: votesFilter
          }}
          onFilterChange={(filterId, value) => {
            if (filterId === 'category') setSelectedCategory(value === 'all' ? null : value);
            if (filterId === 'brand') setSelectedBrand(value === 'all' ? null : value);
            if (filterId === 'rating') setRatingFilter(value === 'all' ? null : value);
            if (filterId === 'votes') setVotesFilter(value === 'all' ? null : value);
          }}
          customPriceInputs={customPriceInputs}
          setCustomPriceInputs={setCustomPriceInputs}
          onCustomPriceApply={(min, max) => {
            setPriceRangeV2([min, max]);
          }}
        />

        <UniversalFilterRenderer
          profile={{
            entity: 'products',
            filters: FAVORITES_PAGE_FILTER_PROFILE.filters.slice(5) // Availability, Verified Seller, Delivery, Discount, Country
          }}
          activeFilters={{
            availability: availabilityFilter,
            verified: verifiedBrandFilter,
            delivery: deliveryFilter,
            discount: discountFilter,
            country: countryFilter
          }}
          onFilterChange={(filterId, value) => {
            if (filterId === 'availability') setAvailabilityFilter(value === 'all' ? null : value);
            if (filterId === 'verified') setVerifiedBrandFilter(value === 'all' ? null : value);
            if (filterId === 'delivery') setDeliveryFilter(value === 'all' ? null : value);
            if (filterId === 'discount') setDiscountFilter(value === 'all' ? null : value);
            if (filterId === 'country') setCountryFilter(value === 'all' ? null : value);
          }}
        />
      </div>
    ),
    activeFilterCount: (selectedCategory ? 1 : 0) +
      (selectedBrand ? 1 : 0) +
      (priceRangeV2[0] !== 0 || priceRangeV2[1] !== null ? 1 : 0) +
      (ratingFilter ? 1 : 0) +
      (votesFilter ? 1 : 0) +
      (availabilityFilter ? 1 : 0) +
      (verifiedBrandFilter ? 1 : 0) +
      (deliveryFilter ? 1 : 0) +
      (discountFilter ? 1 : 0) +
      (countryFilter ? 1 : 0) +
      (searchQuery ? 1 : 0),
    onClearAll: () => {
      setSelectedCategory(null);
      setSelectedBrand(null);
      setCustomPriceInputs({ min: '', max: '' });
      setPriceRangeV2([0, null]);
      setRatingFilter(null);
      setVotesFilter(null);
      setAvailabilityFilter(null);
      setVerifiedBrandFilter(null);
      setDeliveryFilter(null);
      setDiscountFilter(null);
      setCountryFilter(null);
      setTrendingFilter('🔥 Trending Today');
      setSortOption('default');
      setSearchQuery('');
      setActiveTab('All Products');
    },
  }, [
    searchQuery,
    activeTab,
    trendingFilter,
    selectedCategory,
    selectedBrand,
    customPriceInputs,
    priceRangeV2,
    ratingFilter,
    votesFilter,
    availabilityFilter,
    verifiedBrandFilter,
    deliveryFilter,
    discountFilter,
    countryFilter,
    sortOption
  ]);

  return (
    <div className="flex flex-col min-h-screen bg-choosify-feed">
      
      {/* ================================================= */}
      {/* 1. HERO SECTION (Standardized centered alignment) */}
      {/* ================================================= */}
      <section className="relative pt-4 pb-5 choosify-dark-gradient text-white overflow-hidden border-b border-white/5">
        <div className="absolute inset-0 bg-gradient-to-r from-[#FF5B00]/20 via-[#EB4501]/5 to-[#0A0A1F] opacity-90" />
        <div className="absolute top-0 right-0 w-1/3 h-full opacity-10 bg-radial-gradient from-orange-primary/30 to-transparent blur-3xl pointer-events-none" />
        
        <div className="max-w-[1440px] mx-auto px-6 relative z-10 w-full flex flex-col items-center">
          {/* Breadcrumbs */}
          <div className="flex items-center justify-center gap-1.5 text-white/40 text-[9px] font-black uppercase tracking-widest mb-2 w-full">
            <Link to="/" className="hover:text-white transition-colors">Home</Link>
            <ChevronRight size={10} className="text-white/20" />
            <span className="text-white">Customer Favorite</span>
          </div>

          <div className="max-w-3xl text-center flex flex-col items-center">
            <span className="inline-block bg-[#E8500A]/10 text-orange-primary text-[8px] font-black uppercase tracking-[0.25em] px-3 py-1 rounded-full border border-orange-primary/10 mb-1.5 font-mono">
              CHOOSIFY CURATED
            </span>
            <h1 className="text-2xl md:text-3.5xl font-black text-white uppercase tracking-tighter italic mb-1.5 leading-none text-center">
              Customer Favorite Products
            </h1>
            <p className="text-gray-400 text-[11px] md:text-xs font-medium leading-relaxed mb-2.5 max-w-2xl text-center">
              Discover trending, community-recommended and editor-approved products loved by real customers. Verified pricing and seller transparency included.
            </p>

            {/* STATISTICS ROW (Visually centered inside the hero container) */}
            <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 uppercase font-mono tracking-[0.12em] text-[9px] md:text-[10px] text-white pb-1">
              <div className="flex items-center gap-2">
                <span className="text-sm leading-none flex items-center">🔥</span>
                <div className="text-left font-sans">
                  <p className="text-orange-primary font-black text-xs md:text-sm leading-none italic">2,540</p>
                  <p className="text-white/50 text-[7px] font-bold mt-0.5 leading-none">Trending Products</p>
                </div>
              </div>
              <div className="h-5 w-px bg-white/10 hidden sm:block" />
              <div className="flex items-center gap-2">
                <span className="text-sm leading-none flex items-center">❤️</span>
                <div className="text-left font-sans">
                  <p className="text-rose-500 font-black text-xs md:text-sm leading-none italic">18,200</p>
                  <p className="text-white/50 text-[7px] font-bold mt-0.5 leading-none">Community Votes</p>
                </div>
              </div>
              <div className="h-5 w-px bg-white/10 hidden sm:block" />
              <div className="flex items-center gap-2">
                <span className="text-sm leading-none flex items-center">⭐</span>
                <div className="text-left font-sans">
                  <p className="text-amber-400 font-black text-xs md:text-sm leading-none italic">1,120</p>
                  <p className="text-white/50 text-[7px] font-bold mt-0.5 leading-none">Editor Picks</p>
                </div>
              </div>
              <div className="h-5 w-px bg-white/10 hidden sm:block" />
              <button 
                onClick={() => setIsSubmitModalOpen(true)}
                className="flex items-center gap-1.5 cursor-pointer bg-white/5 border border-white/10 hover:border-orange-primary/30 hover:bg-white/10 px-3 py-1.5 rounded-lg transition-all"
              >
                <span className="text-xs">⚡</span>
                <span className="text-[8px] font-black text-white uppercase italic tracking-wider">Suggest Sourcing</span>
              </button>
            </div>

          </div>
        </div>
      </section>

      {/* ================================================= */}
      {/* 2. ANIMATED MOVING TICKER (Directly below hero content) */}
      {/* ================================================= */}
      <div className="relative z-20 bg-gradient-to-r from-[#E8500A] via-[#FF5B00] to-[#E8500A] text-white py-4 overflow-hidden border-y border-[#CF4400]/40 shadow-lg font-space text-[10.5px] font-black tracking-[0.2em] uppercase leading-none">
        <div className="flex w-max animate-marquee whitespace-nowrap gap-16">
          <span>🛡️ 100% ORIGINAL PRODUCTS ONLY • VERIFIED SHOPS IN BANGLADESH • CHOOSE WISELY 🛡️</span>
          <span>💎 AUTHENTIC OUTLETS DIRECTORY • NO MORE ONLINE SCAMS • SHOP WITH CONFIDENCE 💎</span>
          <span>🛡️ 100% ORIGINAL PRODUCTS ONLY • VERIFIED SHOPS IN BANGLADESH • CHOOSE WISELY 🛡️</span>
          <span>💎 AUTHENTIC OUTLETS DIRECTORY • NO MORE ONLINE SCAMS • SHOP WITH CONFIDENCE 💎</span>
        </div>
      </div>

      {/* ================================================= */}
      {/* 3. STICKY SUB-NAVIGATION BAR (Directly below hero) */}
      {/* ================================================= */}
      <div className="relative z-10 bg-white/95 border-b border-gray-150 shadow-sm py-4">
        <div className="max-w-[1440px] mx-auto px-6 flex flex-col gap-4">
          
          {/* A. Search Bar inside Sticky Container */}
          <div className="relative w-full max-w-2xl mx-auto bg-gray-50/50 p-1 rounded-full border border-gray-200/80 shadow-inner focus-within:border-[#E8500A]/30 transition-all duration-300">
            <div className="flex items-center bg-white rounded-full">
              <div className="pl-4 text-[#E8500A] shrink-0">
                <Search className="w-4 h-4" />
              </div>
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search customer-recommended products..." 
                className="w-full h-10 bg-transparent outline-none pl-3 pr-24 text-navy text-xs font-semibold placeholder-gray-500 focus:outline-none focus:ring-0 border-none" 
              />
              <button 
                onClick={() => setSearchQuery(searchQuery)}
                className="absolute right-1.5 top-1.5 bottom-1.5 px-5 rounded-full bg-gradient-to-r from-[#FF5B00] to-[#E8500A] hover:from-[#E8500A] hover:to-[#CF4400] text-white text-[9px] font-black tracking-widest uppercase flex items-center gap-1.5 shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 cursor-pointer border-0"
              >
                Search
              </button>
            </div>
          </div>

          {/* B. Dynamic Navigation Tabs with icons */}
          <div className="flex items-center justify-start md:justify-center gap-1.5 md:gap-3 overflow-x-auto no-scrollbar py-1 text-[10px] font-black uppercase tracking-wider">
            {navigationItems.map(item => {
              // Micro icon associations matching requirements
              let icon = <Package size={13} />;
              if (item === 'Gadgets') icon = <Smartphone size={13} />;
              if (item === 'Jewelry') icon = <Star size={13} />;
              if (item === 'Clothing') icon = <Shirt size={13} />;
              if (item === 'Belts') icon = <Award size={13} />;
              if (item === 'Eyewear') icon = <Eye size={13} />;

              return (
                <button 
                  key={item}
                  onClick={() => {
                    setActiveTab(item);
                    window.scrollTo({ top: 320, behavior: 'smooth' });
                  }}
                  className={cn(
                    "px-5 py-2.5 rounded-full transition-all shrink-0 cursor-pointer flex items-center gap-1.5 font-black uppercase tracking-wider text-[10px] border",
                    activeTab === item 
                      ? "bg-[#E8500A] border-transparent text-white shadow-md shadow-[#E8500A]/10 italic" 
                      : "bg-white border-gray-200 text-gray-400 hover:text-navy hover:bg-gray-50"
                  )}
                >
                  {icon}
                  <span>{item}</span>
                </button>
              );
            })}
          </div>

        </div>
      </div>

      {/* ================================================= */}
      {/* LAYER 1: QUICK FILTER BAR */}
      {/* ================================================= */}
      <QuickFilterBar
        title="Favorites Quick Specs"
        onOpenFullFilters={() => {
          const el = document.getElementById("favorites-sidebar-filters");
          if (el) {
            el.scrollIntoView({ behavior: 'smooth', block: 'center' });
            el.classList.add("ring-2", "ring-orange-primary/50");
            setTimeout(() => el.classList.remove("ring-2", "ring-orange-primary/50"), 1500);
          }
        }}
        filters={[
          {
            id: 'trending-today',
            label: '🔥 Trending Today',
            active: trendingFilter === '🔥 Trending Today',
            onClick: () => setTrendingFilter(trendingFilter === '🔥 Trending Today' ? 'All' : '🔥 Trending Today')
          },
          {
            id: 'most-loved',
            label: '❤️ Most Loved',
            active: trendingFilter === '❤️ Most Loved',
            onClick: () => setTrendingFilter(trendingFilter === '❤️ Most Loved' ? 'All' : '❤️ Most Loved')
          },
          {
            id: 'highest-rated',
            label: '⭐ Highest Rated (4.8+)',
            active: ratingFilter === '4.8',
            onClick: () => setRatingFilter(ratingFilter === '4.8' ? null : '4.8')
          },
          {
            id: 'recently-added',
            label: '⏰ Recently Added',
            active: sortOption === 'views-desc',
            onClick: () => setSortOption(sortOption === 'views-desc' ? 'default' : 'views-desc')
          },
          {
            id: 'verified-brands',
            label: '✓ Verified Brands',
            active: verifiedBrandFilter === 'verified',
            onClick: () => setVerifiedBrandFilter(verifiedBrandFilter === 'verified' ? null : 'verified')
          },
          {
            id: 'shop-now',
            label: '🛒 Shop Now (In Stock)',
            active: availabilityFilter === 'in-stock',
            onClick: () => setAvailabilityFilter(availabilityFilter === 'in-stock' ? null : 'in-stock')
          },
          {
            id: 'cycle-sort',
            label: sortOption === 'default' ? 'Sort' : `Sort: ${sortOption === 'price-asc' ? '৳ Low' : sortOption === 'price-desc' ? '৳ High' : sortOption === 'rating-desc' ? 'Rating' : 'Views'}`,
            active: sortOption !== 'default',
            onClick: () => {
              const next: Record<string, string> = {
                'default': 'price-asc',
                'price-asc': 'price-desc',
                'price-desc': 'rating-desc',
                'rating-desc': 'default'
              };
              setSortOption(next[sortOption] || 'default');
            }
          }
        ]}
      />

      {/* ACTIVE FILTER CHIPS ROW */}
      <ActiveFilterChips
        chips={[
          selectedCategory ? { id: 'category', label: `Category: ${selectedCategory}`, onRemove: () => setSelectedCategory(null) } : null,
          selectedBrand ? { id: 'brand', label: `Brand: ${selectedBrand}`, onRemove: () => setSelectedBrand(null) } : null,
          (priceRangeV2[0] > 0 || priceRangeV2[1] !== null) ? {
            id: 'price',
            label: `Price: ৳${priceRangeV2[0]}–${priceRangeV2[1] !== null ? `৳${priceRangeV2[1]}` : 'Max'}`,
            onRemove: () => {
              setCustomPriceInputs({ min: '', max: '' });
              setPriceRangeV2([0, null]);
            }
          } : null,
          ratingFilter ? { id: 'rating', label: `Min Rating: ${ratingFilter}★`, onRemove: () => setRatingFilter(null) } : null,
          votesFilter ? { id: 'votes', label: `Min Votes: ${votesFilter}♥`, onRemove: () => setVotesFilter(null) } : null,
          availabilityFilter ? { id: 'availability', label: `Stock: ${availabilityFilter}`, onRemove: () => setAvailabilityFilter(null) } : null,
          verifiedBrandFilter ? { id: 'verified', label: `Seller verification: ${verifiedBrandFilter}`, onRemove: () => setVerifiedBrandFilter(null) } : null,
          deliveryFilter ? { id: 'delivery', label: `Delivery: ${deliveryFilter}`, onRemove: () => setDeliveryFilter(null) } : null,
          discountFilter ? { id: 'discount', label: `Min Discount: ${discountFilter}%`, onRemove: () => setDiscountFilter(null) } : null,
          countryFilter ? { id: 'country', label: `Origin: ${countryFilter}`, onRemove: () => setCountryFilter(null) } : null,
          (trendingFilter !== '🔥 Trending Today' && trendingFilter !== 'All') ? { id: 'trending', label: `Trend: ${trendingFilter}`, onRemove: () => setTrendingFilter('🔥 Trending Today') } : null,
          sortOption !== 'default' ? { id: 'sort', label: `Sorted: ${sortOption}`, onRemove: () => setSortOption('default') } : null
        ].filter(Boolean) as any[]}
        onClearAll={() => {
          setSelectedCategory(null);
          setSelectedBrand(null);
          setCustomPriceInputs({ min: '', max: '' });
          setPriceRangeV2([0, null]);
          setRatingFilter(null);
          setVotesFilter(null);
          setAvailabilityFilter(null);
          setVerifiedBrandFilter(null);
          setDeliveryFilter(null);
          setDiscountFilter(null);
          setCountryFilter(null);
          setTrendingFilter('🔥 Trending Today');
          setSortOption('default');
          setSearchQuery('');
          setActiveTab('All Products');
        }}
      />

      {/* ================================================= */}
      {/* 4. MAIN THREE-COLUMN CONTAINER (Desktop 3-columns) */}
      {/* ================================================= */}
      <div className="max-w-[1440px] mx-auto px-4 py-5 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-[240px_minmax(0,1fr)_260px] xl:grid-cols-[280px_minmax(0,1fr)_310px] gap-4 items-start relative w-full">

          {/* ================================================= */}
          {/* A. LEFT SIDEBAR (STICKY) */}
          {/* ================================================= */}
          <aside className="hidden lg:flex flex-col gap-4 lg:sticky lg:top-24 pb-8 space-y-4 text-left animate-fade-in flex-shrink-0">
             {/* LEFT COLUMN SEARCH BAR */}
             <div className="relative">
               <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                 <Search size={13} className="text-[#E8500A]" />
               </div>
               <input
                 type="text"
                 value={searchQuery}
                 onChange={(e) => setSearchQuery(e.target.value)}
                 placeholder="Search products..."
                 className="w-full h-9 pl-8 pr-3 bg-white border border-[#e8edf2] rounded-[5px] text-[11px] font-semibold text-[#1A1D4E] placeholder-gray-400 focus:outline-none focus:border-[#E8500A]/50 transition-colors shadow-sm"
               />
             </div>
             
             <QuickAccessCard />
            
            {/* LAYER 2: FULL SIDEBAR FILTER PANEL */}
            <div id="favorites-sidebar-filters" className="transition-all duration-300 rounded-[5px] w-full">
              <FullSidebarFilterPanel
                title="Filter Favorites"
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                searchPlaceholder="Search favorite products..."
                quickFilters={
                  <QuickFilterBar
                    title="Favorites Quick Specs"
                    onOpenFullFilters={() => {}}
                    filters={[
                      {
                        id: 'trending-today',
                        label: '🔥 Trending Today',
                        active: trendingFilter === '🔥 Trending Today',
                        onClick: () => setTrendingFilter(trendingFilter === '🔥 Trending Today' ? 'All' : '🔥 Trending Today')
                      },
                      {
                        id: 'most-loved',
                        label: '❤️ Most Loved',
                        active: trendingFilter === '❤️ Most Loved',
                        onClick: () => setTrendingFilter(trendingFilter === '❤️ Most Loved' ? 'All' : '❤️ Most Loved')
                      },
                      {
                        id: 'highest-rated',
                        label: '⭐ Highest Rated (4.8+)',
                        active: ratingFilter === '4.8',
                        onClick: () => setRatingFilter(ratingFilter === '4.8' ? null : '4.8')
                      },
                      {
                        id: 'recently-added',
                        label: '⏰ Recently Added',
                        active: sortOption === 'views-desc',
                        onClick: () => setSortOption(sortOption === 'views-desc' ? 'default' : 'views-desc')
                      },
                      {
                        id: 'verified-brands',
                        label: '✓ Verified Brands',
                        active: verifiedBrandFilter === 'verified',
                        onClick: () => setVerifiedBrandFilter(verifiedBrandFilter === 'verified' ? null : 'verified')
                      },
                      {
                        id: 'shop-now',
                        label: '🛒 Shop Now (In Stock)',
                        active: availabilityFilter === 'in-stock',
                        onClick: () => setAvailabilityFilter(availabilityFilter === 'in-stock' ? null : 'in-stock')
                      }
                    ]}
                  />
                }
                activeChips={
                  <ActiveFilterChips
                    chips={[
                      selectedCategory ? { id: 'category', label: `Category: ${selectedCategory}`, onRemove: () => setSelectedCategory(null) } : null,
                      selectedBrand ? { id: 'brand', label: `Brand: ${selectedBrand}`, onRemove: () => setSelectedBrand(null) } : null,
                      (priceRangeV2[0] > 0 || priceRangeV2[1] !== null) ? {
                        id: 'price',
                        label: `Price: ৳${priceRangeV2[0]}–${priceRangeV2[1] !== null ? `৳${priceRangeV2[1]}` : 'Max'}`,
                        onRemove: () => {
                          setCustomPriceInputs({ min: '', max: '' });
                          setPriceRangeV2([0, null]);
                        }
                      } : null,
                      ratingFilter ? { id: 'rating', label: `Min Rating: ${ratingFilter}★`, onRemove: () => setRatingFilter(null) } : null,
                      votesFilter ? { id: 'votes', label: `Min Votes: ${votesFilter}♥`, onRemove: () => setVotesFilter(null) } : null,
                      availabilityFilter ? { id: 'availability', label: `Stock: ${availabilityFilter}`, onRemove: () => setAvailabilityFilter(null) } : null,
                      verifiedBrandFilter ? { id: 'verified', label: `Seller verification: ${verifiedBrandFilter}`, onRemove: () => setVerifiedBrandFilter(null) } : null,
                      deliveryFilter ? { id: 'delivery', label: `Delivery: ${deliveryFilter}`, onRemove: () => setDeliveryFilter(null) } : null,
                      discountFilter ? { id: 'discount', label: `Min Discount: ${discountFilter}%`, onRemove: () => setDiscountFilter(null) } : null,
                      countryFilter ? { id: 'country', label: `Origin: ${countryFilter}`, onRemove: () => setCountryFilter(null) } : null,
                      (trendingFilter !== '🔥 Trending Today' && trendingFilter !== 'All') ? { id: 'trending', label: `Trend: ${trendingFilter}`, onRemove: () => setTrendingFilter('🔥 Trending Today') } : null,
                      sortOption !== 'default' ? { id: 'sort', label: `Sorted: ${sortOption}`, onRemove: () => setSortOption('default') } : null
                    ].filter(Boolean) as any[]}
                    onClearAll={() => {
                      setSelectedCategory(null);
                      setSelectedBrand(null);
                      setCustomPriceInputs({ min: '', max: '' });
                      setPriceRangeV2([0, null]);
                      setRatingFilter(null);
                      setVotesFilter(null);
                      setAvailabilityFilter(null);
                      setVerifiedBrandFilter(null);
                      setDeliveryFilter(null);
                      setDiscountFilter(null);
                      setCountryFilter(null);
                      setTrendingFilter('🔥 Trending Today');
                      setSortOption('default');
                      setSearchQuery('');
                      setActiveTab('All Products');
                    }}
                  />
                }
                onReset={() => {
                  setSelectedCategory(null);
                  setSelectedBrand(null);
                  setCustomPriceInputs({ min: '', max: '' });
                  setPriceRangeV2([0, null]);
                  setRatingFilter(null);
                  setVotesFilter(null);
                  setAvailabilityFilter(null);
                  setVerifiedBrandFilter(null);
                  setDeliveryFilter(null);
                  setDiscountFilter(null);
                  setCountryFilter(null);
                  setTrendingFilter('🔥 Trending Today');
                  setSortOption('default');
                }}
                advancedSection={
                  <UniversalFilterRenderer
                    profile={{
                      entity: 'products',
                      filters: FAVORITES_PAGE_FILTER_PROFILE.filters.slice(5) // Availability, Verified Seller, Delivery, Discount, Country
                    }}
                    activeFilters={{
                      availability: availabilityFilter,
                      verified: verifiedBrandFilter,
                      delivery: deliveryFilter,
                      discount: discountFilter,
                      country: countryFilter
                    }}
                    onFilterChange={(filterId, value) => {
                      if (filterId === 'availability') setAvailabilityFilter(value === 'all' ? null : value);
                      if (filterId === 'verified') setVerifiedBrandFilter(value === 'all' ? null : value);
                      if (filterId === 'delivery') setDeliveryFilter(value === 'all' ? null : value);
                      if (filterId === 'discount') setDiscountFilter(value === 'all' ? null : value);
                      if (filterId === 'country') setCountryFilter(value === 'all' ? null : value);
                    }}
                  />
                }
              >
                <UniversalFilterRenderer
                  profile={{
                    entity: 'products',
                    filters: FAVORITES_PAGE_FILTER_PROFILE.filters.slice(0, 5) // Price Scope, Categories, Brands, Customer Rating, Votes
                  }}
                  activeFilters={{
                    price_custom: true, // Custom priced elements
                    category: selectedCategory,
                    brand: selectedBrand,
                    rating: ratingFilter,
                    votes: votesFilter
                  }}
                  onFilterChange={(filterId, value) => {
                    if (filterId === 'category') setSelectedCategory(value === 'all' ? null : value);
                    if (filterId === 'brand') setSelectedBrand(value === 'all' ? null : value);
                    if (filterId === 'rating') setRatingFilter(value === 'all' ? null : value);
                    if (filterId === 'votes') setVotesFilter(value === 'all' ? null : value);
                  }}
                  customPriceInputs={customPriceInputs}
                  setCustomPriceInputs={setCustomPriceInputs}
                  onCustomPriceApply={(min, max) => {
                    setPriceRangeV2([min, max]);
                  }}
                />
              </FullSidebarFilterPanel>
            </div>

            {/* SECTION 3: SPONSORED PRODUCT */}
            <div className="bg-white rounded-[5px] border border-[#e8edf2] p-4.5 shadow-sm text-[#1a1a2e] text-center relative overflow-hidden w-full">
               <div className="relative z-10 w-full flex flex-col items-center">
                 <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#e8edf2] px-1 w-full text-left">
                   <h3 className="text-[11px] font-semibold text-[#8a9bb0] uppercase tracking-wider">Sponsored Spotlight</h3>
                 </div>
                 
                 <div onClick={() => navigate(`/products/${sponsoredProduct.id}`)} className="w-full aspect-square rounded-[5px] overflow-hidden mb-4 border border-[#e8edf2] shadow-inner bg-slate-50 relative shrink-0 p-4 flex items-center justify-center cursor-pointer hover:scale-105 transition-transform duration-[2s]">
                   <img 
                     src={sponsoredProduct.image} 
                     alt={sponsoredProduct.title} 
                     className="max-w-full max-h-full object-contain"
                   />
                 </div>
                 
                 <h4 className="font-sans text-xs font-semibold text-[#1a1a2e] uppercase tracking-wider mb-0.5">{sponsoredProduct.brand}</h4>
                 <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide mb-3 line-clamp-1">{sponsoredProduct.title}</p>
                 
                 <p className="text-[11px] text-gray-500 font-medium leading-relaxed mb-4 px-1 text-center">
                   Premium durability backed by verified seller warrants. Instant Dhaka delivery options available.
                 </p>
                 
                 <button 
                   onClick={() => navigate(`/products/${sponsoredProduct.id}`)}
                   className="w-full py-2.5 bg-[#E8500A] hover:bg-[#CF4400] text-white font-semibold rounded-lg text-[10px] uppercase tracking-wider flex items-center justify-center gap-2 transition-colors shadow-sm cursor-pointer border-0"
                 >
                   Inquire Deal Spec
                 </button>
               </div>
            </div>

            {/* SECTION 4: SUBMIT A PRODUCT */}
            <div className="bg-white rounded-[5px] p-4.5 border border-[#e8edf2] shadow-sm text-left relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-orange-primary/5 rounded-full translate-x-1/3 -translate-y-1/3 blur-xl pointer-events-none" />
              
              <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#e8edf2] px-1">
                <h3 className="text-[11px] font-semibold text-[#8a9bb0] uppercase tracking-wider flex items-center gap-1.5 leading-none">
                  👥 Submit A Product
                </h3>
              </div>
              
              <p className="text-[11px] text-gray-500 leading-relaxed font-semibold mb-4 px-1">
                Sourced a trending product from TikTok, Facebook groups or Instagram reels recently? Suggest it to our vetting desk today!
              </p>

              <button 
                onClick={() => setIsSubmitModalOpen(true)}
                className="w-full py-2.5 bg-[#050514] hover:bg-[#E8500A] text-white rounded-lg text-[10px] font-semibold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors cursor-pointer border-0 shadow-sm"
              >
                <span>Submit Product</span> <Plus size={12} className="stroke-[3px]" />
              </button>
            </div>
          </aside>

          {/* ================================================= */}
          {/* B. CENTER FEED (PRIMARY CONTENT FEED) */}
          {/* ================================================= */}
          <main className="flex-1 space-y-10 min-w-0">
            
            {/* SECTION A: FEATURED VIRAL PRODUCTS (Grid Layout - Top 5) */}
            {activeTab === 'All Products' && !searchQuery && featuredViralProducts.length > 0 && (
              <section className="space-y-4">
                <div className="flex items-center gap-2">
                  <span className="text-[#E8500A] text-lg font-space font-black animate-pulse">✦</span>
                  <h2 className="text-sm font-black text-navy uppercase tracking-widest italic">
                    Spotlight Featured Customer Favorite Listings
                  </h2>
                </div>
                
                <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 justify-items-center justify-center gap-5">
                  {featuredViralProducts.map((p, idx) => (
                    <ProductCard
                      key={`featured-viral-${p.id}-${idx}`}
                      product={p}
                      variant="grid"
                      isGuideDetail={true}
                    />
                  ))}
                </div>
              </section>
            )}

            {/* SECTION B: ALL VIRAL PRODUCTS (Grid Layout) */}
            <section className="space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-150 pb-4">
                <div className="flex items-center gap-2 text-navy text-xs font-black uppercase tracking-widest italic">
                  <ListFilter size={16} className="text-orange-primary" />
                  <span>
                    {activeTab} Selection ({filteredProducts.length} Items Found)
                  </span>
                </div>
                
                {/* Active selectors clearing */}
                {(selectedCategory || selectedBrand || priceRangeV2[0] > 0 || priceRangeV2[1] !== null || ratingFilter || votesFilter || availabilityFilter || verifiedBrandFilter || deliveryFilter || discountFilter || countryFilter || trendingFilter !== '🔥 Trending Today' || searchQuery) && (
                  <button 
                    onClick={() => {
                      setSelectedCategory(null);
                      setSelectedBrand(null);
                      setCustomPriceInputs({ min: '', max: '' });
                      setPriceRangeV2([0, null]);
                      setRatingFilter(null);
                      setVotesFilter(null);
                      setAvailabilityFilter(null);
                      setVerifiedBrandFilter(null);
                      setDeliveryFilter(null);
                      setDiscountFilter(null);
                      setCountryFilter(null);
                      setTrendingFilter('🔥 Trending Today');
                      setSortOption('default');
                      setSearchQuery('');
                      setActiveTab('All Products');
                      toast.success('Sweeps reset to normal listing queues!');
                    }}
                    className="text-[9px] font-black uppercase text-[#E8500A] hover:text-[#b03900] tracking-wider italic flex items-center gap-1 shrink-0 cursor-pointer border-0 bg-transparent"
                  >
                    Clear Filter Overwrites
                  </button>
                )}
              </div>

              {filteredProducts.length === 0 ? (
                <div className="text-center py-20 bg-white border border-gray-150 rounded-[5px] p-8 max-w-lg mx-auto flex flex-col items-center gap-4">
                  <AlertTriangle size={36} className="text-orange-primary stroke-1" />
                  <p className="text-[11px] font-black uppercase tracking-widest text-navy italic">No products matched active filters.</p>
                  <p className="text-[10px] text-gray-500 leading-relaxed font-bold max-w-sm">
                    Try resetting your sidebar pricing metrics, community tags or search query to inspect normal listings.
                  </p>
                  <button 
                    onClick={() => {
                      setSelectedCategory(null);
                      setSelectedBrand(null);
                      setCustomPriceInputs({ min: '', max: '' });
                      setPriceRangeV2([0, null]);
                      setRatingFilter(null);
                      setVotesFilter(null);
                      setAvailabilityFilter(null);
                      setVerifiedBrandFilter(null);
                      setDeliveryFilter(null);
                      setDiscountFilter(null);
                      setCountryFilter(null);
                      setTrendingFilter('🔥 Trending Today');
                      setSortOption('default');
                      setSearchQuery('');
                      setActiveTab('All Products');
                    }}
                    className="px-5 py-2 rounded-full bg-orange-primary text-white text-[9.5px] font-black uppercase tracking-wider italic cursor-pointer"
                  >
                    Load Catalog
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 justify-items-center justify-center gap-5">
                  {filteredProducts.map((p, idx) => (
                    <ProductCard 
                      key={`viral-col-${p.id}-${idx}`} 
                      product={p} 
                      variant="grid" 
                      isGuideDetail={true}
                    />
                  ))}
                </div>
              )}
            </section>
            
          </main>

          {/* ================================================= */}
          {/* C. RIGHT SIDEBAR (STICKY) */}
          {/* ================================================= */}
          <aside className="lg:sticky lg:top-44 overflow-visible pb-8 space-y-4">
            
            {/* SECTION 1: VIRAL LEADERBOARD (Top 5 this week) */}
            <div className="bg-white rounded-[5px] p-4.5 border border-[#e8edf2] shadow-sm text-left">
              <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#e8edf2] px-1">
                <h3 className="text-[#8a9bb0] uppercase tracking-wider flex items-center gap-1.5 leading-none text-[11px] font-semibold">
                  <Award size={15} className="text-amber-500" /> Customer Favorite Leaderboard
                </h3>
              </div>
              <div className="space-y-2.5">
                {viralLeaderboard.map((item, idx) => (
                  <div 
                    key={`leaderboard-${item.id}-${idx}`} 
                    onClick={() => navigate(`/products/${item.id}`)}
                    className="flex items-center gap-3 bg-white border border-[#e8edf2]/60 rounded-[5px] p-2 hover:shadow-soft hover:border-[#E8500A]/10 transition-all duration-300 group cursor-pointer"
                  >
                    <span className="font-sans font-semibold text-sm text-gray-400 leading-none w-5">
                      {String(idx + 1).padStart(2, '0')}
                    </span>
                    <div className="w-9 h-9 bg-gray-50 rounded-lg overflow-hidden shrink-0 border border-[#e8edf2] p-0.5 flex items-center justify-center">
                      <img src={item.image} alt="" className="max-w-full max-h-full object-contain" />
                    </div>
                    <div className="min-w-0 flex-1 leading-tight">
                      <h4 className="text-xs font-semibold text-navy truncate group-hover:text-orange-primary transition-colors">
                        {item.title}
                      </h4>
                      <p className="text-[9px] font-semibold text-gray-400 uppercase tracking-wider mt-0.5">
                        {item.brand} • {item.viewsThisWeek} Views
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* SECTION 2: MOST LOVED (Products this month) */}
            <div className="bg-white rounded-[5px] p-4.5 border border-[#e8edf2] shadow-sm text-left">
              <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#e8edf2] px-1">
                <h3 className="text.[11px] font-semibold text-[#8a9bb0] uppercase tracking-wider flex items-center gap-1.5 leading-none">
                  <Heart size={14} className="text-rose-500 fill-rose-500" /> Most Loved Products
                </h3>
              </div>
              <div className="space-y-2.5">
                {mostLovedProducts.map((item, idx) => (
                  <div 
                    key={`mostlived-${item.id}-${idx}`} 
                    onClick={() => navigate(`/products/${item.id}`)}
                    className="flex items-center gap-3 bg-white border border-[#e8edf2]/60 rounded-[5px] p-2 hover:shadow-soft hover:border-[#E8500A]/10 transition-all duration-300 group cursor-pointer"
                  >
                    <div className="w-9 h-9 bg-gray-50 rounded-lg overflow-hidden shrink-0 border border-[#e8edf2] p-0.5 flex items-center justify-center">
                      <img src={item.image} alt="" className="max-w-full max-h-full object-contain" />
                    </div>
                    <div className="min-w-0 flex-1 leading-tight">
                      <h4 className="text-xs font-semibold uppercase text-navy truncate group-hover:text-orange-primary transition-colors">
                        {item.title}
                      </h4>
                      <div className="flex gap-4 items-center mt-0.5">
                        <span className="text-[10px] font-semibold text-orange-primary whitespace-nowrap leading-none">
                          ৳{item.price.toLocaleString()}
                        </span>
                        <span className="text-[9px] font-semibold text-gray-400 uppercase tracking-wide flex items-center gap-0.5 shrink-0 leading-none">
                          ❤️ {item.heartsCount}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </aside>

        </div>
      </div>

      {/* ================================================= */}
      {/* 5. GORGEOUS STICKY COMMUNITY SUBMISSION MODAL */}
      {/* ================================================= */}
      <AnimatePresence>
        {isSubmitModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 overflow-y-auto">
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => {
                setIsSubmitModalOpen(false);
                setIsSubmitSuccess(false);
                setUploadedFileName('');
                setUploadedFilePreview('');
                setProductType('standard');
              }}
              className="fixed inset-0 bg-black/60 backdrop-blur-xs"
            />
            
            {/* Modal Body */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="bg-white rounded-[5px] w-full max-w-lg p-6 relative z-50 shadow-3xl text-left border border-gray-100 overflow-hidden my-8"
            >
              {/* Abs decoration blob */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-orange-primary/5 rounded-full translate-x-1/3 -translate-y-1/3 blur-2xl pointer-events-none" />
              
              <div className="flex items-center justify-between border-b pb-4 mb-4">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-orange-primary/10 border border-orange-primary/20 flex items-center justify-center text-xs leading-none">👥</span>
                  <h3 className="text-xs font-black uppercase tracking-widest text-[#1a1a2e] italic">Community Submission Desk</h3>
                </div>
                <button 
                  onClick={() => {
                    setIsSubmitModalOpen(false);
                    setIsSubmitSuccess(false);
                    setUploadedFileName('');
                    setUploadedFilePreview('');
                    setProductType('standard');
                  }}
                  className="p-1.5 hover:bg-gray-100 rounded-full transition-colors border-0 bg-transparent text-gray-400 hover:text-navy cursor-pointer"
                >
                  <X size={16} />
                </button>
              </div>

              {!isLoggedIn ? (
                /* Guest prompt screen */
                <div className="py-6 text-center space-y-4 animate-scale-up">
                  <div className="w-12 h-12 rounded-full bg-orange-primary/10 text-orange-primary flex items-center justify-center mx-auto text-xl font-bold">
                    🔑
                  </div>
                  <h3 className="font-bold text-base text-[#1a1a2e] uppercase tracking-wide">
                    Login Required
                  </h3>
                  <p className="text-xs text-slate-500 leading-relaxed max-w-sm mx-auto font-medium">
                    Please log in to submit a product to Customer Favorites.
                  </p>
                  <div className="flex flex-col sm:flex-row justify-center gap-3 pt-4 max-w-xs mx-auto">
                    <button
                      type="button"
                      onClick={() => {
                        setIsLoggedIn(true);
                        toast.success("Successfully logged in!");
                      }}
                      className="w-full sm:w-1/2 px-4 py-2.5 bg-orange-primary hover:bg-[#ff5a0c] text-white rounded-xl text-[10px] font-bold uppercase tracking-wider italic cursor-pointer shadow-md shadow-orange-primary/10 border-0"
                    >
                      Login
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setIsSubmitModalOpen(false);
                        navigate('/login');
                      }}
                      className="w-full sm:w-1/2 px-4 py-2.5 border border-gray-200 rounded-xl hover:bg-gray-50 text-[10px] font-bold uppercase tracking-wider italic cursor-pointer bg-white text-slate-700"
                    >
                      Create Account
                    </button>
                  </div>
                </div>
              ) : isSubmitSuccess ? (
                /* Success screen */
                <div className="py-6 text-center space-y-4 animate-scale-up">
                  <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto text-xl font-bold animate-pulse">
                    ✓
                  </div>
                  <h3 className="font-bold text-base text-[#1a1a2e] uppercase tracking-wide">
                    Listing Successfully Sourced!
                  </h3>
                  <p className="text-xs text-gray-500 leading-relaxed max-w-sm mx-auto font-medium">
                    Your suggested product was successfully submitted for vetting. Our editor desk will review and verify your request within 24 hours!
                  </p>
                  <div className="flex justify-center gap-3 pt-4">
                    <button
                      onClick={() => {
                        setIsSubmitSuccess(false);
                        setUploadedFileName('');
                        setUploadedFilePreview('');
                      }}
                      className="px-4 py-2 border rounded-xl hover:bg-gray-50 text-[10px] font-bold uppercase tracking-wider italic cursor-pointer bg-white"
                    >
                      Suggest Another
                    </button>
                    <button
                      onClick={() => {
                        setIsSubmitModalOpen(false);
                        setIsSubmitSuccess(false);
                        setUploadedFileName('');
                        setUploadedFilePreview('');
                        setProductType('standard');
                      }}
                      className="px-5 py-2 bg-orange-primary hover:bg-[#ff5a0c] text-white rounded-xl text-[10px] font-bold uppercase tracking-wider italic cursor-pointer shadow-md shadow-orange-primary/10 border-0"
                    >
                      Browse Catalog
                    </button>
                  </div>
                </div>
              ) : (
                /* Interactive dynamic form */
                <form onSubmit={(e) => {
                  e.preventDefault();
                  const form = e.currentTarget;
                  const fd = new FormData(form);
                  const title = fd.get('prodTitle') as string;
                  const brand = fd.get('prodBrand') as string;
                  const category = fd.get('prodCategory') as string;
                  const desc = fd.get('prodReason') as string;

                  if (!title || !desc) {
                    toast.error('Mandatory fields are missing!');
                    return;
                  }

                  // Fallback images based on category
                  const getFallbackImage = (cat: string) => {
                    const c = cat.toLowerCase();
                    if (c.includes('phone') || c.includes('gadget') || c.includes('tech')) return 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400';
                    if (c.includes('jewel') || c.includes('access')) return 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=400';
                    if (c.includes('fashion') || c.includes('clothing') || c.includes('wear')) return 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=400';
                    if (c.includes('home') || c.includes('living')) return 'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?w=400';
                    return 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400';
                  };

                  let priceVal = 1200;
                  let originalPriceVal = null;
                  let discountPill = null;
                  let promoPill = null;
                  let dateVal = null;
                  let metricVal = null;

                  if (productType === 'standard') {
                    const rawPrice = fd.get('prodPrice') as string;
                    priceVal = rawPrice ? parseFloat(rawPrice) : 1500;
                  } else if (productType === 'deal') {
                    const rawOrigPrice = fd.get('prodOrigPrice') as string;
                    const discountPercent = fd.get('prodDiscount') as string;
                    originalPriceVal = rawOrigPrice ? parseFloat(rawOrigPrice) : 3000;
                    const discDouble = discountPercent ? parseFloat(discountPercent) : 10;
                    priceVal = originalPriceVal * (1 - discDouble / 100);
                    discountPill = `${discDouble}% OFF`;
                    promoPill = (fd.get('prodPromo') as string) || null;
                    dateVal = (fd.get('prodValidity') as string) || null;
                  } else if (productType === 'creator') {
                    metricVal = (fd.get('prodMetrics') as string) || "1M+ Views";
                  }

                  const customItem = {
                    id: Date.now(),
                    title,
                    brand: brand || (productType === 'creator' ? (fd.get('prodCreator') as string) || "Creator Showcase" : "Local Verified Sourced"),
                    category,
                    description: desc,
                    price: priceVal,
                    originalPrice: originalPriceVal,
                    discount: discountPill,
                    image: uploadedFilePreview || getFallbackImage(category),
                    mode_type: mode,
                    status: "pending",
                    submittedAt: "Just now",
                    productType,
                    promoCode: promoPill,
                    validUntil: dateVal,
                    socialProof: metricVal
                  };

                  setCustomSubmittedProducts(prev => [customItem, ...prev]);
                  setIsSubmitSuccess(true);
                  toast.success(`"${title}" registered in pending verification list!`);
                }} className="space-y-4">
                  
                  {/* Category Type selector tabs */}
                  <div className="space-y-1.5 text-left">
                    <label className="text-[9px] font-black text-navy uppercase tracking-widest block font-sans">
                      Submission Product Type
                    </label>
                    <div className="grid grid-cols-3 gap-2 p-1 bg-gray-50 rounded-xl border border-gray-150">
                      {[
                        { id: 'standard', label: 'Standard Item', icon: '🎁' },
                        { id: 'deal', label: 'Deal / Offer', icon: '🏷️' },
                        { id: 'creator', label: 'Creator Trend', icon: '📱' }
                      ].map((t) => (
                        <button
                          key={t.id}
                          type="button"
                          onClick={() => setProductType(t.id as any)}
                          className={cn(
                            "py-2 rounded-lg text-[9.5px] font-bold uppercase transition-all flex items-center justify-center gap-1.5 border-0 cursor-pointer",
                            productType === t.id 
                              ? "bg-navy text-white shadow-sm" 
                              : "text-gray-400 hover:text-navy hover:bg-gray-100"
                          )}
                        >
                          <span>{t.icon}</span>
                          <span>{t.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* FIELD SET 1 (Mandatory core attributes) */}
                  <div className="space-y-4">
                    <div className="space-y-1.5 text-left">
                      <label className="text-[9px] font-black text-navy uppercase tracking-widest block font-sans">
                        Product Title / Trend Title *
                      </label>
                      <input 
                        type="text" 
                        name="prodTitle"
                        required
                        placeholder={productType === 'creator' ? "e.g. Viral Velvet Ribbed Hair Clips combo" : "e.g. Vintage Leather Messenger Bag"} 
                        className="w-full h-11 px-4 rounded-xl border border-gray-150 text-xs focus:outline-none focus:border-orange-primary bg-gray-50 focus:bg-white transition-colors"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      {productType !== 'creator' ? (
                        <div className="space-y-1.5 text-left">
                          <label className="text-[9px] font-black text-navy uppercase tracking-widest block font-sans">
                            Brand Name *
                          </label>
                          <input 
                            type="text" 
                            name="prodBrand"
                            required
                            placeholder="e.g. Apex, Huawei, local boutique" 
                            className="w-full h-11 px-4 rounded-xl border border-gray-150 text-xs focus:outline-none focus:border-orange-primary bg-gray-50 focus:bg-white transition-colors"
                          />
                        </div>
                      ) : (
                        <div className="space-y-1.5 text-left">
                          <label className="text-[9px] font-black text-navy uppercase tracking-widest block font-sans">
                            Creator Name (Optional)
                          </label>
                          <input 
                            type="text" 
                            name="prodCreator"
                            placeholder="e.g. Rafsan, Mumtahan, TikToker" 
                            className="w-full h-11 px-4 rounded-xl border border-gray-150 text-xs focus:outline-none focus:border-orange-primary bg-gray-50 focus:bg-white transition-colors"
                          />
                        </div>
                      )}

                      <div className="space-y-1.5 text-left">
                        <label className="text-[9px] font-black text-navy uppercase tracking-widest block font-sans">
                          Primary Category
                        </label>
                        <select 
                          name="prodCategory"
                          className="w-full h-11 px-3 rounded-xl border border-gray-150 text-xs focus:outline-none focus:border-orange-primary bg-gray-50 focus:bg-white transition-colors"
                        >
                          <option value="Fashion & Lifestyle">Fashion & Lifestyle</option>
                          <option value="Jewelry & Accessories">Jewelry & Accessories</option>
                          <option value="Mobile & Phones">Mobile & Phones</option>
                          <option value="Tech & Electronics">Tech & Electronics</option>
                          <option value="Home & Living">Home & Living</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* FIELD SET 2 (Dynamic fields based on type) */}
                  {productType === 'standard' && (
                    <div className="space-y-1.5 text-left animate-fade-in">
                      <label className="text-[9px] font-black text-navy uppercase tracking-widest block font-sans">
                        Market Sourcing Price (BDT) *
                      </label>
                      <input 
                        type="number" 
                        name="prodPrice"
                        required
                        placeholder="e.g. 2450" 
                        className="w-full h-11 px-4 rounded-xl border border-gray-150 text-xs focus:outline-none focus:border-orange-primary bg-gray-50 focus:bg-white transition-colors"
                      />
                    </div>
                  )}

                  {productType === 'deal' && (
                    <div className="grid grid-cols-2 gap-4 animate-fade-in">
                      <div className="space-y-1.5 text-left">
                        <label className="text-[9px] font-black text-navy uppercase tracking-widest block font-sans">
                          Original Price (BDT) *
                        </label>
                        <input 
                          type="number" 
                          name="prodOrigPrice"
                          required
                          placeholder="e.g. 5000" 
                          className="w-full h-11 px-4 rounded-xl border border-gray-150 text-xs focus:outline-none focus:border-orange-primary bg-gray-50 focus:bg-white transition-colors"
                        />
                      </div>
                      <div className="space-y-1.5 text-left">
                        <label className="text-[9px] font-black text-navy uppercase tracking-widest block font-sans">
                          Discount Percentage (%) *
                        </label>
                        <input 
                          type="number" 
                          name="prodDiscount"
                          required
                          max="99"
                          min="1"
                          placeholder="e.g. 25" 
                          className="w-full h-11 px-4 rounded-xl border border-gray-150 text-xs focus:outline-none focus:border-orange-primary bg-gray-50 focus:bg-white transition-colors"
                        />
                      </div>
                      <div className="space-y-1.5 text-left">
                        <label className="text-[9px] font-black text-navy uppercase tracking-widest block font-sans">
                          Promo Code (Optional)
                        </label>
                        <input 
                          type="text" 
                          name="prodPromo"
                          placeholder="e.g. EXTRA20" 
                          className="w-full h-11 px-4 rounded-xl border border-gray-150 text-xs focus:outline-none focus:border-orange-primary bg-gray-50 focus:bg-white transition-colors"
                        />
                      </div>
                      <div className="space-y-1.5 text-left">
                        <label className="text-[9px] font-black text-navy uppercase tracking-widest block font-sans">
                          Offer Validity Date *
                        </label>
                        <input 
                          type="date" 
                          name="prodValidity"
                          required
                          className="w-full h-11 px-4 rounded-xl border border-gray-150 text-xs focus:outline-none focus:border-orange-primary bg-gray-50 focus:bg-white transition-colors"
                        />
                      </div>
                    </div>
                  )}

                  {productType === 'creator' && (
                    <div className="grid grid-cols-2 gap-4 animate-fade-in">
                      <div className="space-y-1.5 text-left">
                        <label className="text-[9px] font-black text-navy uppercase tracking-widest block font-sans">
                          Social Proof Link / Reference *
                        </label>
                        <input 
                          type="url" 
                          name="prodSourceLink"
                          required
                          placeholder="e.g. Facebook Reel / TikTok link" 
                          className="w-full h-11 px-4 rounded-xl border border-gray-150 text-xs focus:outline-none focus:border-orange-primary bg-gray-50 focus:bg-white transition-colors"
                        />
                      </div>
                      <div className="space-y-1.5 text-left">
                        <label className="text-[9px] font-black text-navy uppercase tracking-widest block font-sans">
                          Engagement Metrics Summary *
                        </label>
                        <input 
                          type="text" 
                          name="prodMetrics"
                          required
                          placeholder="e.g. 50k views / 12k likes" 
                          className="w-full h-11 px-4 rounded-xl border border-gray-150 text-xs focus:outline-none focus:border-orange-primary bg-gray-50 focus:bg-white transition-colors"
                        />
                      </div>
                    </div>
                  )}

                  {/* Drag-and-drop Image Upload block */}
                  <div className="space-y-1.5 text-left">
                    <label className="text-[9px] font-black text-navy uppercase tracking-widest block font-sans">
                      {productType === 'creator' ? 'Media Upload (Reel / Photo) *' : 'Product Photo/Preview *'}
                    </label>
                    <div 
                      onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
                      onDragLeave={() => setDragActive(false)}
                      onDrop={(e) => {
                        e.preventDefault();
                        setDragActive(false);
                        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                          const file = e.dataTransfer.files[0];
                          setUploadedFileName(file.name);
                          const reader = new FileReader();
                          reader.onloadend = () => {
                            setUploadedFilePreview(reader.result as string);
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                      className={cn(
                        "border-2 border-dashed rounded-xl p-4 flex flex-col items-center justify-center text-center cursor-pointer transition-colors h-28 relative overflow-hidden",
                        dragActive ? "border-[#E8500A] bg-orange-primary/5" : "border-gray-200 bg-gray-50 hover:bg-gray-100/50"
                      )}
                    >
                      <input 
                        type="file" 
                        accept="image/*,video/*" 
                        id="file-upload"
                        className="hidden" 
                        onChange={(e) => {
                          if (e.target.files && e.target.files[0]) {
                            const file = e.target.files[0];
                            setUploadedFileName(file.name);
                            const reader = new FileReader();
                            reader.onloadend = () => {
                              setUploadedFilePreview(reader.result as string);
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                      />
                      <label htmlFor="file-upload" className="w-full h-full flex flex-col items-center justify-center cursor-pointer">
                        {uploadedFilePreview ? (
                          <div className="absolute inset-0 flex items-center justify-center bg-black/5 z-0">
                            <img src={uploadedFilePreview} alt="Preview" className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center text-white p-2">
                              <p className="text-[10px] font-bold truncate max-w-[150px]">{uploadedFileName}</p>
                              <p className="text-[8px] opacity-75">Click or drag to replace</p>
                            </div>
                          </div>
                        ) : (
                          <>
                            <span className="text-lg mb-1 leading-none">📂</span>
                            <p className="text-[10px] font-bold text-navy leading-tight">Drag and drop file here, or click to browse</p>
                            <p className="text-[8px] text-gray-400 mt-0.5 uppercase tracking-wider font-mono">Supports JPG, PNG (Max 5MB)</p>
                          </>
                        )}
                      </label>
                    </div>
                  </div>

                  {/* Description / Sourcing reason */}
                  <div className="space-y-1.5 text-left">
                    <label className="text-[9px] font-black text-navy uppercase tracking-widest block font-sans">
                      Describe Sourcing Authenticity & Scent *
                    </label>
                    <textarea 
                      name="prodReason"
                      required
                      placeholder="e.g. Highlight store location, live order proofs, or reasons why this selection meets Choosify standards." 
                      rows={3}
                      className="w-full p-4 rounded-xl border border-gray-150 text-xs focus:outline-none focus:border-orange-primary bg-gray-50 focus:bg-white transition-colors resize-none"
                    />
                  </div>

                  <div className="bg-gray-50/50 p-3.5 rounded-xl border border-dashed flex gap-3 text-gray-500 leading-normal">
                    <Info size={16} className="text-orange-primary shrink-0 mt-0.5" />
                    <p className="text-[9.5px] font-semibold leading-relaxed">
                      Sourced items are added directly to the local Sourcing Desk at the top of the page. You can review, approve, and launch them instantly!
                    </p>
                  </div>

                  {/* Dialog Controls */}
                  <div className="flex justify-end gap-3 pt-2">
                    <button 
                      type="button" 
                      onClick={() => {
                        setIsSubmitModalOpen(false);
                        setIsSubmitSuccess(false);
                        setUploadedFileName('');
                        setUploadedFilePreview('');
                        setProductType('standard');
                      }}
                      className="px-5 py-2.5 rounded-xl border hover:bg-gray-50 text-[10px] font-black uppercase tracking-wider italic cursor-pointer bg-white"
                    >
                      Cancel
                    </button>
                    <button 
                      type="submit" 
                      className="px-6 py-2.5 bg-orange-primary hover:bg-[#ff5a0c] text-white rounded-xl text-[10px] font-black uppercase tracking-wider italic cursor-pointer shadow-lg shadow-orange-primary/20 border-0 flex items-center gap-1.5"
                    >
                      Submit Sourcing <Send size={11} className="stroke-[3px]" />
                    </button>
                  </div>

                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
