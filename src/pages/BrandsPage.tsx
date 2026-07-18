import React, { useState, useEffect, useMemo } from 'react';
import { 
  Search, Star, Filter, ArrowRight, ChevronDown, Check, X,
  LayoutGrid, List, ShieldCheck, Tag, Layers, Award,
  HelpCircle, CreditCard, RotateCcw, Headphones, ArrowLeftRight, CheckSquare, SlidersHorizontal
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { cn } from '../lib/utils';
import { useGlobalState } from '../context/GlobalStateContext';
import { toast } from 'react-hot-toast';
import { DragScrollContainer, UniversalFilterRenderer, QuickFilterBar, ActiveFilterChips, FullSidebarFilterPanel, useRegisterPageFilters } from '../components/FilterEngine';
import { BrandCardDesign } from '../components/BrandCardDesign';
import { DcListingHero } from '../components/design/DcListingHero';
import { DcListingStickyFilters } from '../components/design/DcListingStickyFilters';
import { useInfiniteListBatch } from '../hooks/useInfiniteListBatch';
import { ListingAdRail } from '../components/ListingAdRail';
import { AdSenseSlot } from '../components/AdSenseSlot';
import { AdvertiseHereCard } from '../components/commerce/AdvertiseHereCard';
import { usePlacements } from '../hooks/usePlacements';
import { PLACEMENT_KEYS, INFEED_INTERVAL, INFEED_MAX_PER_PAGE } from '../lib/placements';
import { injectPlacementsIntoFeed } from '../utils/injectFeedPlacements';
import {BRAND_CARD_GRID, PAGE_LISTING_SINGLE_SHELL } from "../lib/pageLayout";
import { useSectionScrollSpy } from '../hooks/useSectionScrollSpy';

interface BrandDeal {
  id: string;
  name: string;
  dealHighlight: string;
  logo: string;
  bgClass: string;
}

const BRAND_DEALS: BrandDeal[] = [
  { id: 'aarong', name: "Aarong", dealHighlight: "Flat 15% OFF on Handicrafts", logo: "Aa", bgClass: "bg-orange-primary/95" },
  { id: 'apex', name: "Apex", dealHighlight: "Buy 1 Get 1 Free on Select Shoes", logo: "A", bgClass: "bg-navy" },
  { id: 'sailor', name: "Sailor", dealHighlight: "Flat 20% OFF on Casual Wear", logo: "S", bgClass: "bg-teal-700" },
  { id: 'adidas', name: "Adidas", dealHighlight: "Extra 10% OFF on Sportswear", logo: "Ad", bgClass: "bg-[#1A1D4E]" },
  { id: 'bay', name: "Bay Emporium", dealHighlight: "Up to 30% OFF on Leather Boots", logo: "B", bgClass: "bg-red-700" }
];

interface PromoCode {
  brandId: string;
  brandName: string;
  code: string;
  discount: string;
}

const PROMO_CODES: PromoCode[] = [
  { brandId: 'aarong', brandName: "Aarong", code: "AARONG15", discount: "Flat 15% OFF" },
  { brandId: 'apex', brandName: "Apex", code: "APEXFOOT26", discount: "BDT 500 FLAT" },
  { brandId: 'sailor', brandName: "Sailor", code: "SAILOREID", discount: "Flat 20% OFF" },
  { brandId: 'adidas', brandName: "Adidas", code: "ADIEXTRA10", discount: "10% FLAT OFF" }
];

interface Brand {
  id: string;
  name: string;
  description: string;
  logo: string; // The monogram monogram, e.g. "S", "A", "Ap"
  logoUrl?: string; // Optional logo URL
  rating: number;
  reviewsCount: string; // e.g., "12.4k reviews"
  productsCount: string; // e.g., "1,240"
  categoriesCount: number; // e.g., 18
  followersCount: string; // e.g., "128K"
  category: string;
  isVerified: boolean;
  type: 'global' | 'local';
  shopType: 'official' | 'dealer' | 'marketplace';
  bannerClass: string; // background colors
  brandText: string; // brand wordmark/logo text
}

const ALL_BRANDS_DATA: Brand[] = [
  {
    id: 'samsung',
    name: 'Samsung',
    description: 'Global Electronics Brand',
    logo: 'S',
    logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/2/24/Samsung_Logo.svg',
    rating: 4.9,
    reviewsCount: '12.4k',
    productsCount: '1,240',
    categoriesCount: 18,
    followersCount: '128K',
    category: 'Electronics',
    isVerified: true,
    type: 'global',
    shopType: 'official',
    bannerClass: 'bg-gradient-to-r from-[#074A9B] to-[#011B40]',
    brandText: 'SAMSUNG'
  },
  {
    id: 'apple',
    name: 'Apple',
    description: 'Global Technology Brand',
    logo: 'A',
    logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/3/31/Apple_logo_white.svg',
    rating: 4.9,
    reviewsCount: '8.7k',
    productsCount: '856',
    categoriesCount: 16,
    followersCount: '95K',
    category: 'Tech',
    isVerified: true,
    type: 'global',
    shopType: 'official',
    bannerClass: 'bg-gradient-to-r from-[#1C1C1E] to-[#000000]',
    brandText: ' Apple'
  },
  {
    id: 'apex',
    name: 'Apex',
    description: 'Leading Fashion Brand',
    logo: 'Ap',
    rating: 4.6,
    reviewsCount: '5.2k',
    productsCount: '620',
    categoriesCount: 12,
    followersCount: '68K',
    category: 'Fashion',
    isVerified: true,
    type: 'local',
    shopType: 'official',
    bannerClass: 'bg-gradient-to-r from-[#C91B24] to-[#7A060C]',
    brandText: 'Apex'
  },
  {
    id: 'nike',
    name: 'Nike',
    description: 'Global Sports Brand',
    logo: 'N',
    logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/a/a6/Logo_NIKE.svg',
    rating: 4.7,
    reviewsCount: '9.1k',
    productsCount: '540',
    categoriesCount: 10,
    followersCount: '54K',
    category: 'Sports & Outdoors',
    isVerified: true,
    type: 'global',
    shopType: 'official',
    bannerClass: 'bg-gradient-to-r from-[#151515] to-[#2B2B2B]',
    brandText: 'NIKE'
  },
  {
    id: 'walton',
    name: 'Walton',
    description: 'Trusted Electronics Brand',
    logo: 'W',
    rating: 4.5,
    reviewsCount: '4.3k',
    productsCount: '480',
    categoriesCount: 15,
    followersCount: '47K',
    category: 'Electronics',
    isVerified: true,
    type: 'local',
    shopType: 'official',
    bannerClass: 'bg-gradient-to-r from-[#004A8F] to-[#00264D]',
    brandText: 'WALTON'
  },
  {
    id: 'xiaomi',
    name: 'Xiaomi',
    description: 'Innovative Technology Brand',
    logo: 'mi',
    logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/a/ae/Xiaomi_logo_%282021-%29.svg',
    rating: 4.6,
    reviewsCount: '3.8k',
    productsCount: '410',
    categoriesCount: 14,
    followersCount: '42K',
    category: 'Tech',
    isVerified: true,
    type: 'global',
    shopType: 'official',
    bannerClass: 'bg-gradient-to-r from-[#FF6700] to-[#CC5200]',
    brandText: 'mi'
  },
  {
    id: 'philips',
    name: 'Philips',
    description: 'Health & Lifestyle Brand',
    logo: 'P',
    logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/d/df/Philips_logo_new.svg',
    rating: 4.6,
    reviewsCount: '2.9k',
    productsCount: '330',
    categoriesCount: 11,
    followersCount: '36K',
    category: 'Home Appliances',
    isVerified: true,
    type: 'global',
    shopType: 'official',
    bannerClass: 'bg-gradient-to-r from-[#0F5B9B] to-[#09355B]',
    brandText: 'PHILIPS'
  },
  {
    id: 'adidas',
    name: 'Adidas',
    description: 'Global Sportswear Brand',
    logo: 'Ad',
    logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/2/20/Adidas_Logo.svg',
    rating: 4.6,
    reviewsCount: '3.2k',
    productsCount: '330',
    categoriesCount: 9,
    followersCount: '31K',
    category: 'Sports & Outdoors',
    isVerified: true,
    type: 'global',
    shopType: 'official',
    bannerClass: 'bg-gradient-to-r from-[#000000] to-[#222222]',
    brandText: 'adidas'
  },
  {
    id: 'infinix',
    name: 'Infinix',
    description: 'Smartphone Brand',
    logo: 'In',
    rating: 4.4,
    reviewsCount: '2.6k',
    productsCount: '290',
    categoriesCount: 8,
    followersCount: '28K',
    category: 'Tech',
    isVerified: true,
    type: 'global',
    shopType: 'official',
    bannerClass: 'bg-gradient-to-r from-[#0A0A0A] to-[#1F1F1F]',
    brandText: 'Infinix'
  },
  {
    id: 'aarong',
    name: 'Aarong',
    description: 'Traditional Handcrafted Fashion',
    logo: 'Aa',
    rating: 4.8,
    reviewsCount: '15.2k',
    productsCount: '1,450',
    categoriesCount: 22,
    followersCount: '190K',
    category: 'Fashion',
    isVerified: true,
    type: 'local',
    shopType: 'official',
    bannerClass: 'bg-gradient-to-r from-[#D97706] to-[#78350F]',
    brandText: 'Aarong'
  },
  {
    id: 'sailor',
    name: 'Sailor',
    description: 'Contemporary Lifestyle Wear',
    logo: 'Sa',
    rating: 4.7,
    reviewsCount: '6.4k',
    productsCount: '820',
    categoriesCount: 14,
    followersCount: '78K',
    category: 'Fashion',
    isVerified: true,
    type: 'local',
    shopType: 'official',
    bannerClass: 'bg-gradient-to-r from-[#0F766E] to-[#115E59]',
    brandText: 'Sailor'
  },
  {
    id: 'yellow',
    name: 'Yellow',
    description: 'Trendy Clothing and Apparel',
    logo: 'Y',
    rating: 4.5,
    reviewsCount: '7.8k',
    productsCount: '750',
    categoriesCount: 13,
    followersCount: '84K',
    category: 'Fashion',
    isVerified: false,
    type: 'local',
    shopType: 'marketplace',
    bannerClass: 'bg-gradient-to-r from-[#CA8A04] to-[#854D0E]',
    brandText: 'YELLOW'
  },
  {
    id: 'bata',
    name: 'Bata',
    description: 'Legacy Footwear Brand',
    logo: 'B',
    logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/e/e8/Bata_logo.svg',
    rating: 4.6,
    reviewsCount: '11.0k',
    productsCount: '950',
    categoriesCount: 8,
    followersCount: '110K',
    category: 'Fashion',
    isVerified: true,
    type: 'global',
    shopType: 'dealer',
    bannerClass: 'bg-gradient-to-r from-[#DC2626] to-[#991B1B]',
    brandText: 'Bata'
  },
  {
    id: 'beauty-co',
    name: 'Beauty & Co',
    description: 'Premium Skincare & Cosmetics',
    logo: 'BC',
    rating: 4.7,
    reviewsCount: '1.8k',
    productsCount: '240',
    categoriesCount: 5,
    followersCount: '15K',
    category: 'Beauty & Personal Care',
    isVerified: true,
    type: 'local',
    shopType: 'marketplace',
    bannerClass: 'bg-gradient-to-r from-[#EC4899] to-[#BE185D]',
    brandText: 'BEAUTY & CO'
  },
  {
    id: 'home-lux',
    name: 'HomeLux',
    description: 'Modern Home & Kitchen Appliances',
    logo: 'HL',
    rating: 4.3,
    reviewsCount: '950',
    productsCount: '180',
    categoriesCount: 6,
    followersCount: '12K',
    category: 'Home Appliances',
    isVerified: false,
    type: 'local',
    shopType: 'dealer',
    bannerClass: 'bg-gradient-to-r from-[#4B5563] to-[#1F2937]',
    brandText: 'HomeLux'
  }
];

export function BrandsPage() {
  const { allBrands: globalBrands, getBrandClaimStatus } = useGlobalState();
  const [selectedLetter, setSelectedLetter] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sidebarSearch, setSidebarSearch] = useState('');

  // Dropdown filter state
  const [selectedCategory, setSelectedCategory] = useState('All Categories');

  // Brand Type checkbox states
  const [brandTypeGlobal, setBrandTypeGlobal] = useState(false);
  const [brandTypeLocal, setBrandTypeLocal] = useState(false);
  const [brandTypeOfficial, setBrandTypeOfficial] = useState(false);

  // Verification states
  const [verifiedChecked, setVerifiedChecked] = useState(false);
  const [unverifiedChecked, setUnverifiedChecked] = useState(false);

  // Shop Type checkbox states
  const [shopTypeOfficial, setShopTypeOfficial] = useState(false);
  const [shopTypeDealer, setShopTypeDealer] = useState(false);
  const [shopTypeMarketplace, setShopTypeMarketplace] = useState(false);

  // Popular Categories checkbox states
  const [catElectronics, setCatElectronics] = useState(false);
  const [catFashion, setCatFashion] = useState(false);
  const [catHome, setCatHome] = useState(false);
  const [catBeauty, setCatBeauty] = useState(false);
  const [catSports, setCatSports] = useState(false);

  // Show more categories toggle state
  const [showMoreCategories, setShowMoreCategories] = useState(false);

  // Layout Grid / List state
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Active Tab state
  const [activeTab, setActiveTab] = useState<'all' | 'popular' | 'new' | 'verified' | 'featured'>('all');

  // Sorting
  const [sortBy, setSortBy] = useState<'popularity' | 'rating' | 'products'>('popularity');

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(24);

  // Reset all filters function
  const handleResetFilters = () => {
    setSearchQuery('');
    setSidebarSearch('');
    setSelectedCategory('All Categories');
    setBrandTypeGlobal(false);
    setBrandTypeLocal(false);
    setBrandTypeOfficial(false);
    setVerifiedChecked(false);
    setUnverifiedChecked(false);
    setShopTypeOfficial(false);
    setShopTypeDealer(false);
    setShopTypeMarketplace(false);
    setCatElectronics(false);
    setCatFashion(false);
    setCatHome(false);
    setCatBeauty(false);
    setCatSports(false);
    setActiveTab('all');
    setSortBy('popularity');
    setCurrentPage(1);
    toast.success('All filters have been reset.');
  };

  // Synchronize category checkboxes with the single select category
  const togglePopularCategoryCheckbox = (catName: string, currentState: boolean, setter: (val: boolean) => void) => {
    setter(!currentState);
    if (!currentState) {
      setSelectedCategory(catName);
    } else {
      setSelectedCategory('All Categories');
    }
    setCurrentPage(1);
  };

  // Reactive brand filter calculations
  const filteredBrandsList = useMemo(() => {
    return ALL_BRANDS_DATA.filter((brand) => {
      // 1. Horizontal Tabs filters
      if (activeTab === 'popular' && brand.rating < 4.6) return false;
      if (activeTab === 'new' && !['infinix', 'beauty-co', 'home-lux'].includes(brand.id)) return false;
      if (activeTab === 'verified' && !brand.isVerified) return false;
      if (activeTab === 'featured' && brand.rating < 4.7) return false;

      // 2. Global search bar filter (top)
      if (searchQuery.trim() !== '') {
        const q = searchQuery.toLowerCase();
        const matchesName = brand.name.toLowerCase().includes(q);
        const matchesCategory = brand.category.toLowerCase().includes(q);
        const matchesDesc = brand.description.toLowerCase().includes(q);
        if (!matchesName && !matchesCategory && !matchesDesc) return false;
      }

      // 3. Sidebar search bar filter
      if (sidebarSearch.trim() !== '') {
        const q = sidebarSearch.toLowerCase();
        const matchesName = brand.name.toLowerCase().includes(q);
        if (!matchesName) return false;
      }

      // 4. Category dropdown filter
      if (selectedCategory !== 'All Categories') {
        if (brand.category.toLowerCase() !== selectedCategory.toLowerCase()) return false;
      }

      // 5. Brand Type check filter
      const anyBrandTypeChecked = brandTypeGlobal || brandTypeLocal || brandTypeOfficial;
      if (anyBrandTypeChecked) {
        let matches = false;
        if (brandTypeGlobal && brand.type === 'global') matches = true;
        if (brandTypeLocal && brand.type === 'local') matches = true;
        if (brandTypeOfficial && brand.shopType === 'official') matches = true;
        if (!matches) return false;
      }

      // 6. Verification check filter
      const anyVerificationChecked = verifiedChecked || unverifiedChecked;
      if (anyVerificationChecked) {
        let matches = false;
        if (verifiedChecked && brand.isVerified) matches = true;
        if (unverifiedChecked && !brand.isVerified) matches = true;
        if (!matches) return false;
      }

      // 7. Shop Type check filter
      const anyShopTypeChecked = shopTypeOfficial || shopTypeDealer || shopTypeMarketplace;
      if (anyShopTypeChecked) {
        let matches = false;
        if (shopTypeOfficial && brand.shopType === 'official') matches = true;
        if (shopTypeDealer && brand.shopType === 'dealer') matches = true;
        if (shopTypeMarketplace && brand.shopType === 'marketplace') matches = true;
        if (!matches) return false;
      }

      // 8. Popular Categories check filter
      const anyPopularCategoryChecked = catElectronics || catFashion || catHome || catBeauty || catSports;
      if (anyPopularCategoryChecked) {
        let matches = false;
        if (catElectronics && brand.category === 'Electronics') matches = true;
        if (catFashion && brand.category === 'Fashion') matches = true;
        if (catHome && brand.category === 'Home Appliances') matches = true;
        if (catBeauty && brand.category === 'Beauty & Personal Care') matches = true;
        if (catSports && brand.category === 'Sports & Outdoors') matches = true;
        if (!matches) return false;
      }

      return true;
    }).sort((a, b) => {
      // Sorting
      if (sortBy === 'rating') {
        return b.rating - a.rating;
      }
      if (sortBy === 'products') {
        const parseProducts = (val: string) => parseInt(val.replace(/[^0-9]/g, '')) || 0;
        return parseProducts(b.productsCount) - parseProducts(a.productsCount);
      }
      // Default: popularity by review count / followers
      const parseFollowers = (val: string) => {
        let mul = 1;
        if (val.endsWith('K')) mul = 1000;
        return parseFloat(val) * mul;
      };
      return parseFollowers(b.followersCount) - parseFollowers(a.followersCount);
    });
  }, [
    activeTab, searchQuery, sidebarSearch, selectedCategory,
    brandTypeGlobal, brandTypeLocal, brandTypeOfficial,
    verifiedChecked, unverifiedChecked,
    shopTypeOfficial, shopTypeDealer, shopTypeMarketplace,
    catElectronics, catFashion, catHome, catBeauty, catSports,
    sortBy
  ]);

  // Paginated brands for rendering
  const paginatedBrands = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredBrandsList.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredBrandsList, currentPage, itemsPerPage]);

  const totalPages = Math.max(1, Math.ceil(filteredBrandsList.length / itemsPerPage));

  // Count active filters for chip visual representation
  const activeChipsList = useMemo(() => {
    const chips: Array<{ label: string; onClear: () => void }> = [];
    if (selectedCategory !== 'All Categories') {
      chips.push({ label: `Category: ${selectedCategory}`, onClear: () => setSelectedCategory('All Categories') });
    }
    if (brandTypeGlobal) chips.push({ label: 'Global Brands', onClear: () => setBrandTypeGlobal(false) });
    if (brandTypeLocal) chips.push({ label: 'Local Brands', onClear: () => setBrandTypeLocal(false) });
    if (brandTypeOfficial) chips.push({ label: 'Official Stores', onClear: () => setBrandTypeOfficial(false) });
    if (verifiedChecked) chips.push({ label: 'Verified', onClear: () => setVerifiedChecked(false) });
    if (unverifiedChecked) chips.push({ label: 'Unverified', onClear: () => setUnverifiedChecked(false) });
    if (shopTypeOfficial) chips.push({ label: 'Official Store Type', onClear: () => setShopTypeOfficial(false) });
    if (shopTypeDealer) chips.push({ label: 'Authorized Dealer', onClear: () => setShopTypeDealer(false) });
    if (shopTypeMarketplace) chips.push({ label: 'Marketplace Seller', onClear: () => setShopTypeMarketplace(false) });
    if (catElectronics) chips.push({ label: 'Electronics Category', onClear: () => setCatElectronics(false) });
    if (catFashion) chips.push({ label: 'Fashion Category', onClear: () => setCatFashion(false) });
    if (catHome) chips.push({ label: 'Home Category', onClear: () => setCatHome(false) });
    if (catBeauty) chips.push({ label: 'Beauty Category', onClear: () => setCatBeauty(false) });
    if (catSports) chips.push({ label: 'Sports Category', onClear: () => setCatSports(false) });
    if (searchQuery) chips.push({ label: `Search: "${searchQuery}"`, onClear: () => setSearchQuery('') });
    return chips;
  }, [
    selectedCategory, brandTypeGlobal, brandTypeLocal, brandTypeOfficial,
    verifiedChecked, unverifiedChecked, shopTypeOfficial, shopTypeDealer,
    shopTypeMarketplace, catElectronics, catFashion, catHome, catBeauty, catSports,
    searchQuery
  ]);

    // 2. Filter by search query across Name, bestFor, category, or description
    const q = searchQuery.toLowerCase().trim();
    if (q) {
      result = result.filter(b => 
        b.name.toLowerCase().includes(q) ||
        (b.bestFor || '').toLowerCase().includes(q) ||
        (b.category || '').toLowerCase().includes(q) ||
        (b.description || '').toLowerCase().includes(q)
      );
    }

    // 3. Filter by Selected Letter
    if (selectedLetter) {
      result = result.filter(b => b.name.toUpperCase().startsWith(selectedLetter));
    }

    // 4. Filter by Category
    if (selectedCategory) {
      result = result.filter(b => b.category?.toLowerCase() === selectedCategory.toLowerCase());
    }

    // 5. Filter by Verification Status
    if (verificationFilter === 'verified') {
      result = result.filter(b => getBrandClaimStatus(b.id) === 'verified');
    } else if (verificationFilter === 'unverified') {
      result = result.filter(b => getBrandClaimStatus(b.id) !== 'verified');
    }

    // 6. Filter by Popularity Status
    if (popularityFilter === 'hot') {
      result = result.filter(b => b.isHot);
    } else if (popularityFilter === 'featured') {
      result = result.filter(b => b.isFeatured);
    } else if (popularityFilter === 'top-rated') {
      result = result.filter(b => b.rating >= 4.8);
    }

    return result;
  }, [brands, searchQuery, selectedLetter, activeTab, selectedCategory, verificationFilter, popularityFilter, getBrandClaimStatus]);

  const infeedPlacements = usePlacements(PLACEMENT_KEYS.INFEED_BRAND, {
    limit: INFEED_MAX_PER_PAGE,
  });

  const brandFeed = useMemo(
    () =>
      injectPlacementsIntoFeed(
        filteredBrands,
        (brand) => `brand-${brand.id}`,
        infeedPlacements,
        INFEED_INTERVAL.brand,
        3,
      ),
    [filteredBrands, infeedPlacements],
  );

  const {
    visibleItems: visibleBrandFeed,
    sentinelRef,
    hasMore,
    visibleCount,
    totalCount,
  } = useInfiniteListBatch(brandFeed, {
    initial: 24,
    loadMore: 12,
    resetKey: searchQuery + (selectedLetter ?? ''),
  });

  const sectionNavItems = useMemo(
    () => [{ id: 'brands-main-display', label: 'Directory', icon: <Store size={13} /> }],
    [],
  );
  const { activeId: activeSectionId, scrollToSection } = useSectionScrollSpy(sectionNavItems);

  useRegisterPageFilters({
    pageName: "Brands",
    activeFilterCount: activeChipsList.length,
    onClearAll: handleResetFilters,
    quickFilters: [
      { id: 'verified', label: 'Verified Only', active: verifiedChecked, onClick: () => setVerifiedChecked(!verifiedChecked) },
      { id: 'global', label: 'Global Brands', active: brandTypeGlobal, onClick: () => setBrandTypeGlobal(!brandTypeGlobal) },
      { id: 'local', label: 'Local Brands', active: brandTypeLocal, onClick: () => setBrandTypeLocal(!brandTypeLocal) },
    ],
    renderSearch: () => (
      <div className="relative w-full">
        <span className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
          <Search size={14} className="text-slate-400" />
        </span>
        <input
          type="text"
          placeholder="Search brands..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by Brand Name or Category..."
          className="w-full h-9 pl-8 pr-3 bg-white border border-[#eef2f6] rounded-2xl text-[11px] font-semibold text-[#1A1D4E] placeholder-gray-400 focus:outline-none focus:border-[#E8500A]/50 transition-colors"
        />
      </div>
    ),
    quickFilters: [
      { id: 'verified', label: '✓ Verified Claims', active: verificationFilter === 'verified', onClick: () => setVerificationFilter(verificationFilter === 'verified' ? 'all' : 'verified') },
      { id: 'hot', label: 'ðŸ”¥ Hot Brands', active: popularityFilter === 'hot', onClick: () => setPopularityFilter(popularityFilter === 'hot' ? 'all' : 'hot') },
      { id: 'top-rated', label: '⭐ Top Rated', active: popularityFilter === 'top-rated', onClick: () => setPopularityFilter(popularityFilter === 'top-rated' ? 'all' : 'top-rated') },
      { id: 'fashion', label: 'ðŸ‘— Fashion Brands', active: selectedCategory === 'Fashion', onClick: () => setSelectedCategory(selectedCategory === 'Fashion' ? null : 'Fashion') },
      { id: 'tech', label: 'ðŸ’» Tech Devices', active: selectedCategory === 'Tech', onClick: () => setSelectedCategory(selectedCategory === 'Tech' ? null : 'Tech') }
    ],
    renderFilters: () => (
      <div className="flex flex-col gap-4">
        <UniversalFilterRenderer
          profile={{
            entity: 'brands',
            filters: [
              {
                id: 'category',
                name: 'Category Hub',
                type: 'single_select',
                options: [
                  { value: 'all', label: 'All Categories' },
                  ...dynamicCategories.map(cat => ({ value: cat.name, label: cat.name, count: cat.count }))
                ]
              },
              {
                id: 'verification',
                name: 'Verification Channel',
                type: 'single_select',
                options: [
                  { value: 'all', label: 'All Claim Statuses' },
                  { value: 'verified', label: 'Verified Claims Only' },
                  { value: 'unverified', label: 'Unverified Channels' }
                ]
              },
              {
                id: 'popularity',
                name: 'Popularity Tier',
                type: 'single_select',
                options: [
                  { value: 'all', label: 'All Tiers' },
                  { value: 'hot', label: 'ðŸ”¥ Hot Brands' },
                  { value: 'featured', label: '⭐ Featured' },
                  { value: 'top-rated', label: '✨ Top Rated (4.8+)' }
                ]
              }
            ]
          }}
          activeFilters={{
            category: selectedCategory || 'all',
            verification: verificationFilter,
            popularity: popularityFilter
          }}
          onFilterChange={(filterId, value) => {
            if (filterId === 'category') {
              setSelectedCategory(value === 'all' || !value ? null : value);
            } else if (filterId === 'verification') {
              setVerificationFilter(value as any);
            } else if (filterId === 'popularity') {
              setPopularityFilter(value as any);
            }
          }}
        />

        {/* Alpha search (A-Z) */}
        <div className="bg-white rounded-2xl p-4.5 border border-[#eef2f6] shadow-sm flex flex-col gap-2">
          <h3 className="text-[11px] font-black text-[#8a9bb0] uppercase tracking-wider mb-2">Alpha search (A-Z)</h3>
          <div className="grid grid-cols-5 gap-1.5 max-h-32 overflow-y-auto no-scrollbar">
            <button 
              onClick={() => setSelectedLetter(null)}
              className={cn(
                "col-span-5 py-1.5 rounded-2xl text-[8.5px] font-bold uppercase transition-all text-center cursor-pointer",
                selectedLetter === null ? "bg-orange-primary text-white" : "bg-gray-50 text-gray-400 hover:bg-gray-100"
              )}
            >
              All Initials
            </button>
            {letters.map((letter) => (
              <button 
                key={letter} 
                onClick={() => setSelectedLetter(letter)}
                className={cn(
                  "h-5.5 rounded-2xl text-[9.5px] font-black transition-all flex items-center justify-center uppercase cursor-pointer",
                  selectedLetter === letter ? "bg-orange-primary text-white" : "bg-gray-50 text-gray-400 hover:bg-gray-100"
                )}
              >
                <div className={cn(
                  "w-4.5 h-4.5 rounded-md border flex items-center justify-center transition-all bg-white",
                  item.checked ? "border-[#FF5B00] bg-[#FF5B00] text-white" : "border-slate-200"
                )}>
                  {item.checked && <Check size={11} strokeWidth={3} className="text-white" />}
                </div>
                <span className={cn("text-xs font-bold uppercase tracking-wider", item.checked ? "text-[#FF5B00]" : "text-slate-600")}>
                  {item.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Verification */}
        <div className="space-y-3">
          <h4 className="text-[10px] font-black text-slate-400 tracking-widest uppercase">Verification</h4>
          <div className="space-y-2">
            {[
              { label: 'Verified Only', checked: verifiedChecked, setter: setVerifiedChecked },
              { label: 'Unverified', checked: unverifiedChecked, setter: setUnverifiedChecked },
            ].map((item, idx) => (
              <div
                key={idx}
                onClick={() => { item.setter(!item.checked); setCurrentPage(1); }}
                className="flex items-center gap-2.5 py-1 cursor-pointer"
              >
                <div className={cn(
                  "w-4.5 h-4.5 rounded-md border flex items-center justify-center transition-all bg-white",
                  item.checked ? "border-[#FF5B00] bg-[#FF5B00] text-white" : "border-slate-200"
                )}>
                  {item.checked && <Check size={11} strokeWidth={3} className="text-white" />}
                </div>
                <span className={cn("text-xs font-bold uppercase tracking-wider", item.checked ? "text-[#FF5B00]" : "text-slate-600")}>
                  {item.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Shop Type */}
        <div className="space-y-3">
          <h4 className="text-[10px] font-black text-slate-400 tracking-widest uppercase">Shop Type</h4>
          <div className="space-y-2">
            {[
              { label: 'Official Store', checked: shopTypeOfficial, setter: setShopTypeOfficial },
              { label: 'Authorized Dealer', checked: shopTypeDealer, setter: setShopTypeDealer },
              { label: 'Marketplace Seller', checked: shopTypeMarketplace, setter: setShopTypeMarketplace },
            ].map((item, idx) => (
              <div
                key={idx}
                onClick={() => { item.setter(!item.checked); setCurrentPage(1); }}
                className="flex items-center gap-2.5 py-1 cursor-pointer"
              >
                <div className={cn(
                  "w-4.5 h-4.5 rounded-md border flex items-center justify-center transition-all bg-white",
                  item.checked ? "border-[#FF5B00] bg-[#FF5B00] text-white" : "border-slate-200"
                )}>
                  {item.checked && <Check size={11} strokeWidth={3} className="text-white" />}
                </div>
                <span className={cn("text-xs font-bold uppercase tracking-wider", item.checked ? "text-[#FF5B00]" : "text-slate-600")}>
                  {item.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }, [
    verifiedChecked, brandTypeGlobal, brandTypeLocal, brandTypeOfficial,
    searchQuery, selectedCategory, unverifiedChecked, shopTypeOfficial,
    shopTypeDealer, shopTypeMarketplace, activeChipsList
  ]);

  return (
    <div className="flex flex-col min-h-screen bg-[#F4F7FA] text-left">
      {/* Breadcrumbs Sub-Header */}
      <div className="w-full bg-[#020D26] py-3.5 px-6 border-b border-white/5">
        <div className="max-w-[1400px] mx-auto flex items-center justify-between text-xs font-sans">
          <div className="flex items-center gap-2 text-gray-400">
            <Link to="/" className="hover:text-white transition-colors">Home</Link>
            <span className="text-gray-600">/</span>
            <span className="text-white font-medium">Brands</span>
          </div>
          <div className="text-[10px] font-bold text-orange-primary uppercase tracking-widest hidden sm:block">
            AUTHENTIC DISCOVERY HUB
          </div>
        </div>
      </div>

      {/* Main Page Hero Banner (Deep Dark Navy) */}
      <div className="w-full bg-[#010B24] py-14 px-6 relative overflow-hidden">
        {/* Glow Effects */}
        <div className="absolute top-[-50%] right-[-10%] w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-[-50%] left-[-10%] w-[400px] h-[400px] bg-orange-600/5 rounded-full blur-[100px] pointer-events-none" />

        <div className="max-w-[1400px] mx-auto flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8 relative z-10">
          {/* Hero Left Info */}
          <div className="flex-1 max-w-2xl">
            <div className="flex items-center gap-3 mb-3">
              <h1 className="text-3xl md:text-4xl font-sans font-black text-white tracking-tight flex items-center gap-2">
                All Brands
              </h1>
              <span className="p-1.5 bg-[#0D1E42] text-orange-primary border border-white/10 rounded-lg">
                <LayoutGrid size={18} />
              </span>
            </div>
            <p className="text-gray-300 font-sans text-sm md:text-base leading-relaxed mb-4">
              Discover, compare and shop from authentic Bangladeshi and global brands.
            </p>
            <div className="flex items-center gap-2 text-xs font-bold text-orange-primary tracking-wide bg-[#FF5B00]/10 border border-[#FF5B00]/20 px-3.5 py-2 rounded-full w-fit">
              <span>🚀</span> 1,248 brands available on Choosify
            </div>
          </div>

          {/* Hero Right Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 w-full lg:w-auto">
            {/* Stat Box 1 */}
            <div className="bg-[#0B1530] border border-[#1E294B] rounded-xl p-4 min-w-[150px] flex flex-col justify-center">
              <div className="flex items-center gap-2.5 mb-1.5">
                <span className="p-1.5 bg-orange-primary/10 rounded-lg text-orange-primary">
                  <Tag size={16} />
                </span>
                <span className="text-xl md:text-2xl font-black text-white tracking-tight">1,248</span>
              </div>
              <span className="text-[10px] font-black text-[#8A9BB0] uppercase tracking-wider">Total Brands</span>
            </div>

            {/* Stat Box 2 */}
            <div className="bg-[#0B1530] border border-[#1E294B] rounded-xl p-4 min-w-[150px] flex flex-col justify-center">
              <div className="flex items-center gap-2.5 mb-1.5">
                <span className="p-1.5 bg-blue-500/10 rounded-lg text-blue-400">
                  <ShieldCheck size={16} />
                </span>
                <span className="text-xl md:text-2xl font-black text-white tracking-tight">623</span>
              </div>
              <span className="text-[10px] font-black text-[#8A9BB0] uppercase tracking-wider">Verified Brands</span>
            </div>

            {/* Stat Box 3 */}
            <div className="bg-[#0B1530] border border-[#1E294B] rounded-xl p-4 min-w-[150px] flex flex-col justify-center">
              <div className="flex items-center gap-2.5 mb-1.5">
                <span className="p-1.5 bg-purple-500/10 rounded-lg text-purple-400">
                  <Layers size={16} />
                </span>
                <span className="text-xl md:text-2xl font-black text-white tracking-tight">120+</span>
              </div>
              <span className="text-[10px] font-black text-[#8A9BB0] uppercase tracking-wider">Categories</span>
            </div>

            {/* Stat Box 4 */}
            <div className="bg-[#0B1530] border border-[#1E294B] rounded-xl p-4 min-w-[150px] flex flex-col justify-center">
              <div className="flex items-center gap-2.5 mb-1.5">
                <span className="p-1.5 bg-green-500/10 rounded-lg text-green-400">
                  <Award size={16} />
                </span>
                <span className="text-xl md:text-2xl font-black text-white tracking-tight">98%</span>
              </div>
              <span className="text-[10px] font-black text-[#8A9BB0] uppercase tracking-wider">Authentic</span>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Segment Horizontal Tabs Bar */}
      <div className="w-full bg-[#F4F7FA] py-4 px-6 relative z-20 mt-[-20px]">
        <div className="max-w-[1400px] mx-auto bg-white border border-[#E3E8EE] rounded-xl p-1.5 shadow-md flex items-center justify-between gap-1 overflow-x-auto no-scrollbar">
          {/* Tab 1: All Brands */}
          <button
            onClick={() => { setActiveTab('all'); setCurrentPage(1); }}
            className={cn(
              "flex-1 min-w-[180px] px-5 py-3 rounded-lg flex items-center gap-3 transition-all text-left",
              activeTab === 'all' 
                ? "bg-gradient-to-r from-[#FFF5F0] to-white border border-[#FDE1D3] border-b-2 border-b-orange-primary" 
                : "hover:bg-gray-50 border border-transparent"
            )}
          >
            <div className={cn(
              "p-2 rounded-lg shrink-0",
              activeTab === 'all' ? "bg-orange-primary/10 text-orange-primary" : "bg-gray-100 text-gray-500"
            )}>
              <LayoutGrid size={16} />
            </div>
            <div className="flex flex-col justify-center">
              <span className={cn("text-xs font-black uppercase tracking-wider", activeTab === 'all' ? "text-orange-primary" : "text-navy")}>
                All Brands
              </span>
              <span className="text-[9px] font-semibold text-gray-400 uppercase">1,248 Brands</span>
            </div>
          </button>

          {/* Tab 2: Popular Brands */}
          <button
            onClick={() => { setActiveTab('popular'); setCurrentPage(1); }}
            className={cn(
              "flex-1 min-w-[180px] px-5 py-3 rounded-lg flex items-center gap-3 transition-all text-left",
              activeTab === 'popular' 
                ? "bg-gradient-to-r from-[#FFF5F0] to-white border border-[#FDE1D3] border-b-2 border-b-orange-primary" 
                : "hover:bg-gray-50 border border-transparent"
            )}
          >
            <div className={cn(
              "p-2 rounded-lg shrink-0",
              activeTab === 'popular' ? "bg-orange-primary/10 text-orange-primary" : "bg-gray-100 text-gray-500"
            )}>
              <Star size={16} />
            </div>
            <div className="flex flex-col justify-center">
              <span className={cn("text-xs font-black uppercase tracking-wider", activeTab === 'popular' ? "text-orange-primary" : "text-navy")}>
                Popular Brands
              </span>
              <span className="text-[9px] font-semibold text-gray-400 uppercase">Top rated brands</span>
            </div>
          </button>

          {/* Tab 3: New Brands */}
          <button
            onClick={() => { setActiveTab('new'); setCurrentPage(1); }}
            className={cn(
              "flex-1 min-w-[180px] px-5 py-3 rounded-lg flex items-center gap-3 transition-all text-left",
              activeTab === 'new' 
                ? "bg-gradient-to-r from-[#FFF5F0] to-white border border-[#FDE1D3] border-b-2 border-b-orange-primary" 
                : "hover:bg-gray-50 border border-transparent"
            )}
          >
            <div className={cn(
              "p-2 rounded-lg shrink-0",
              activeTab === 'new' ? "bg-orange-primary/10 text-orange-primary" : "bg-gray-100 text-gray-500"
            )}>
              <Layers size={16} />
            </div>
            <div className="flex flex-col justify-center">
              <span className={cn("text-xs font-black uppercase tracking-wider", activeTab === 'new' ? "text-orange-primary" : "text-navy")}>
                New Brands
              </span>
              <span className="text-[9px] font-semibold text-gray-400 uppercase">Recently added</span>
            </div>
          </button>

          {/* Tab 4: Verified Brands */}
          <button
            onClick={() => { setActiveTab('verified'); setCurrentPage(1); }}
            className={cn(
              "flex-1 min-w-[180px] px-5 py-3 rounded-lg flex items-center gap-3 transition-all text-left",
              activeTab === 'verified' 
                ? "bg-gradient-to-r from-[#FFF5F0] to-white border border-[#FDE1D3] border-b-2 border-b-orange-primary" 
                : "hover:bg-gray-50 border border-transparent"
            )}
          >
            <div className={cn(
              "p-2 rounded-lg shrink-0",
              activeTab === 'verified' ? "bg-orange-primary/10 text-orange-primary" : "bg-gray-100 text-gray-500"
            )}>
              <ShieldCheck size={16} />
            </div>
            <div className="flex flex-col justify-center">
              <span className={cn("text-xs font-black uppercase tracking-wider", activeTab === 'verified' ? "text-orange-primary" : "text-navy")}>
                Verified Brands
              </span>
              <span className="text-[9px] font-semibold text-gray-400 uppercase">Authentic sellers</span>
            </div>
          </button>

          {/* Tab 5: Featured Brands */}
          <button
            onClick={() => { setActiveTab('featured'); setCurrentPage(1); }}
            className={cn(
              "flex-1 min-w-[180px] px-5 py-3 rounded-lg flex items-center gap-3 transition-all text-left",
              activeTab === 'featured' 
                ? "bg-gradient-to-r from-[#FFF5F0] to-white border border-[#FDE1D3] border-b-2 border-b-orange-primary" 
                : "hover:bg-gray-50 border border-transparent"
            )}
          >
            <div className={cn(
              "p-2 rounded-lg shrink-0",
              activeTab === 'featured' ? "bg-orange-primary/10 text-orange-primary" : "bg-gray-100 text-gray-500"
            )}>
              <Award size={16} />
            </div>
            <div className="flex flex-col justify-center">
              <span className={cn("text-xs font-black uppercase tracking-wider", activeTab === 'featured' ? "text-orange-primary" : "text-navy")}>
                Featured Brands
              </span>
              <span className="text-[9px] font-semibold text-gray-400 uppercase">Editor&apos;s picks</span>
            </div>
          </button>
        </div>
      </div>

      {/* Centered Single-Feed Directory Workspace */}
      <div className="max-w-[1400px] min-[1600px]:max-w-[1600px] mx-auto px-6 py-6 w-full">
        
        {/* Main Brand Listings Workspace */}
        <main className="space-y-6">
          
          {/* Controls Bar */}
          <div className="bg-white border border-[#E3E8EE] rounded-xl p-4 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
            
            {/* Search Input on the Right Block */}
            <div className="relative flex-1 max-w-md">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                placeholder="Search brands..."
                className="w-full h-11 pl-10 pr-4 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-xs font-semibold text-navy placeholder-gray-400 focus:outline-none focus:border-orange-primary/50 focus:bg-white transition-all shadow-inner"
              />
              <Search size={15} className="absolute left-3.5 top-3.5 text-gray-400" />
            </div>

            {/* Results count label */}
            <div className="text-[11px] font-black text-gray-400 uppercase tracking-wider text-left">
              Showing {filteredBrandsList.length > 0 ? `${((currentPage - 1) * itemsPerPage) + 1}-${Math.min(filteredBrandsList.length, currentPage * itemsPerPage)}` : '0'} of {filteredBrandsList.length} brands
            </div>

            {/* Sort & Grid/List Controls */}
            <div className="flex items-center gap-3 self-end md:self-auto shrink-0">
              
              {/* Sort Dropdown */}
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black text-[#8A9BB0] uppercase tracking-wider whitespace-nowrap">Sort by:</span>
                <div className="relative">
                  <select
                    value={sortBy}
                    onChange={(e) => { setSortBy(e.target.value as any); setCurrentPage(1); }}
                    className="h-9 pl-3 pr-7 bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg text-xs font-bold text-navy appearance-none focus:outline-none focus:border-orange-primary/50 focus:bg-white cursor-pointer transition-all min-w-[120px]"
                  >
                    <option value="popularity">Popularity</option>
                    <option value="rating">Rating</option>
                    <option value="products">Products Count</option>
                  </select>
                  <ChevronDown size={12} className="absolute right-2.5 top-3 text-gray-400 pointer-events-none" />
                </div>
              </div>

              {/* Filter Drawer Toggle Trigger */}
              <button
                type="button"
                onClick={() => setGlobalFilterOpen(true)}
                className="flex items-center gap-2 h-9 px-4 bg-[#FFF0E8] hover:bg-[#FFE5D6] border border-[#FF5B00]/30 text-[#FF5B00] rounded-lg text-xs font-black uppercase tracking-wider transition-all cursor-pointer font-sans shrink-0"
              >
                <SlidersHorizontal size={14} />
                <span>Filters</span>
              </button>
            </div>
          </div>

          {/* Active Chips Row */}
          {activeChipsList.length > 0 && (
            <div className="mb-4">
              <ActiveFilterChips 
                chips={activeChipsList.map((c, i) => ({ id: `brand-${i}`, label: c.label, onRemove: c.onClear }))}
                onClearAll={handleResetFilters}
              />
            </div>
          )}

          {/* Brand Grid Workspace */}
          {filteredBrandsList.length === 0 ? (
            <div className="bg-white rounded-xl border border-[#E3E8EE] py-16 px-6 text-center shadow-xs">
              <div className="w-14 h-14 bg-orange-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 text-orange-primary">
                <Search size={24} />
              </div>
              <h4 className="text-lg font-black text-navy uppercase tracking-tight mb-1.5">No Brands Match Your Filters</h4>
              <p className="text-gray-500 text-sm max-w-md mx-auto mb-6">
                Try loosening your refinements or search query. We could not find any active partners corresponding to your active filter settings.
              </p>
              <button
                onClick={handleResetFilters}
                className="px-6 py-2.5 bg-orange-primary hover:bg-orange-dark text-white rounded-lg text-xs font-black uppercase tracking-wider transition-all cursor-pointer"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="grid gap-5 w-full justify-center max-w-[1400px] mx-auto" style={{ gridTemplateColumns: 'repeat(auto-fill, 335px)' }}>
              {paginatedBrands.map((brand) => (
                <BrandCard
                  key={brand.id}
                  brand={{
                    id: brand.id,
                    name: brand.name,
                    logo: brand.logoUrl || brand.brandText || brand.name.charAt(0),
                    rating: brand.rating,
                    reviewCount: brand.reviewsCount,
                    isVerified: brand.isVerified,
                    description: brand.description,
                    category: 'Technology',
                    isFeatured: brand.isVerified,
                    coverImage: brand.bannerClass === 'bg-gradient-to-r from-blue-600 to-indigo-700' ? 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&q=80' : undefined
                  }}
                />
              ))}
            </div>
          )}

          {/* Simple worked pagination block */}
          {totalPages > 1 && (
            <div className="mt-12 pt-8 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-6">
              
              {/* Pagination indicators */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className="w-10 h-10 rounded-lg bg-white border border-[#CBD5E1] flex items-center justify-center text-navy hover:bg-[#FFF5F0] hover:text-orange-primary hover:border-[#FDE1D3] disabled:opacity-40 disabled:hover:bg-white disabled:hover:text-navy disabled:hover:border-[#CBD5E1] transition-all"
                >
                  ‹
                </button>
                {[...Array(totalPages)].map((_, idx) => {
                  const pNum = idx + 1;
                  return (
                    <button
                      key={pNum}
                      onClick={() => setCurrentPage(pNum)}
                      className={cn(
                        "w-10 h-10 rounded-lg text-xs font-black uppercase tracking-wider transition-all",
                        currentPage === pNum 
                          ? "bg-orange-primary text-white border border-orange-primary shadow-sm shadow-orange-primary/10" 
                          : "bg-white border border-[#CBD5E1] text-navy hover:border-[#FDE1D3] hover:text-orange-primary hover:bg-[#FFF5F0]"
                      )}
                    >
                      {pNum}
                    </button>
                  );
                })}
                <button
                  onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                  className="w-10 h-10 rounded-lg bg-white border border-[#CBD5E1] flex items-center justify-center text-navy hover:bg-[#FFF5F0] hover:text-orange-primary hover:border-[#FDE1D3] disabled:opacity-40 disabled:hover:bg-white disabled:hover:text-navy disabled:hover:border-[#CBD5E1] transition-all"
                >
                  ›
                </button>
              </div>

              {/* Items per page selector dropdown */}
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black text-[#8A9BB0] uppercase tracking-wider whitespace-nowrap">Show:</span>
                <div className="relative">
                  <select
                    value={itemsPerPage}
                    onChange={(e) => { setItemsPerPage(parseInt(e.target.value)); setCurrentPage(1); }}
                    className="h-9 pl-3 pr-7 bg-white border border-[#CBD5E1] rounded-lg text-xs font-bold text-navy appearance-none focus:outline-none focus:border-orange-primary cursor-pointer transition-all min-w-[120px]"
                  >
                    <option value={9}>9 per page</option>
                    <option value={15}>15 per page</option>
                    <option value={24}>24 per page</option>
                  </select>
                  <ChevronDown size={11} className="absolute right-2.5 top-3.5 text-gray-400 pointer-events-none" />
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Popular Brand Searches Row */}
      <div className="w-full bg-white border-y border-gray-200 py-10 px-6 mt-12">
        <div className="max-w-[1400px] mx-auto text-left">
          <h4 className="text-[11px] font-black text-navy uppercase tracking-[0.18em] mb-4">
            Popular brand searches
          </h4>
          <div className="flex flex-wrap items-center gap-2.5">
            {[
              'Samsung', 'Apple', 'Apex', 'Walton', 'Nike',
              'Xiaomi', 'Adidas', 'Philips', 'Infinix', 'Realme'
            ].map((term) => (
              <button
                key={term}
                onClick={() => {
                  setSearchQuery(term);
                  setCurrentPage(1);
                  toast.success(`Active filter set to "${term}"`);
                }}
                className="flex items-center gap-2 px-4 py-2.5 bg-[#F8FAFC] hover:bg-orange-primary/5 hover:text-orange-primary hover:border-[#FDE1D3] border border-[#E2E8F0] rounded-xl text-xs font-bold text-gray-600 transition-all cursor-pointer"
              >
                <Search size={12} className="text-gray-400 shrink-0" />
                <span>{term}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

  return (
    <div className="flex flex-col min-h-screen bg-[#F4F7F9]">
      <DcListingHero
        titleBefore="Discover Verified"
        titleHighlight="Brands"
        searchPlaceholder="Search brands..."
        quickChips={['Fashion', 'Electronics', 'Beauty', 'Home', 'Sports', 'Food']}
        onSearch={(q) => setSearchQuery(q)}
        onChipClick={(q) => setSearchQuery(q)}
      />

      <DcListingStickyFilters
        overlapHero
        items={[
          {
            id: 'top-rated',
            icon: '🏆',
            name: 'Top Rated',
            sub: '4.5+ stars',
            bg: '#FFF3EA',
            active: popularityFilter === 'top-rated',
            onClick: () => setPopularityFilter(popularityFilter === 'top-rated' ? 'all' : 'top-rated'),
          },
          {
            id: 'new-brands',
            icon: '✨',
            name: 'New Brands',
            sub: 'This week',
            bg: '#EFECFD',
            active: activeTab === 'Trending Brands',
            onClick: () => setActiveTab(activeTab === 'Trending Brands' ? 'All Brands' : 'Trending Brands'),
          },
          {
            id: 'featured',
            icon: '⭐',
            name: 'Featured',
            sub: 'Handpicked',
            bg: '#FEF3E2',
            active: popularityFilter === 'featured',
            onClick: () => setPopularityFilter(popularityFilter === 'featured' ? 'all' : 'featured'),
          },
          {
            id: 'most-reviewed',
            icon: '💬',
            name: 'Most Reviewed',
            sub: '10K+ reviews',
            bg: '#EAF1FD',
            active: activeTab === 'Top Rated Brands',
            onClick: () => setActiveTab(activeTab === 'Top Rated Brands' ? 'All Brands' : 'Top Rated Brands'),
          },
          {
            id: 'budget',
            icon: '💰',
            name: 'Budget Friendly',
            sub: 'Under ৳5K',
            bg: '#E6F9EA',
            active: activeTab === 'Hot Deals Brands',
            onClick: () => setActiveTab(activeTab === 'Hot Deals Brands' ? 'All Brands' : 'Hot Deals Brands'),
          },
          {
            id: 'premium',
            icon: '👑',
            name: 'Premium',
            sub: 'Exclusive',
            bg: '#FDECEC',
            active: verificationFilter === 'verified',
            onClick: () => setVerificationFilter(verificationFilter === 'verified' ? 'all' : 'verified'),
          },
        ]}
      />

      {/* ACTIVE FILTER CHIPS ROW */}
      <ActiveFilterChips
        chips={[
          selectedCategory ? { id: 'category', label: `Category: ${selectedCategory}`, onRemove: () => setSelectedCategory(null) } : null,
          selectedLetter ? { id: 'letter', label: `Starts with: ${selectedLetter}`, onRemove: () => setSelectedLetter(null) } : null,
          verificationFilter !== 'all' ? { id: 'verification', label: `Verification: ${verificationFilter}`, onRemove: () => setVerificationFilter('all') } : null,
          popularityFilter !== 'all' ? { id: 'popularity', label: `Status: ${popularityFilter}`, onRemove: () => setPopularityFilter('all') } : null
        ].filter(Boolean) as any[]}
        onClearAll={() => {
          setSelectedLetter(null); 
          setSearchQuery(''); 
          setActiveTab('All Brands');
          setSelectedCategory(null);
          setVerificationFilter('all');
          setPopularityFilter('all');
        }}
      />

      <div className={`max-w-[1680px] mx-auto px-4 sm:px-5 lg:px-6 xl:px-8 py-10 md:py-12 w-full ${PAGE_LISTING_SINGLE_SHELL}`}>
        
        {/* Left Sidebar */}
        <aside className="hidden lg:flex flex-col gap-4 lg:sticky lg:top-24 pb-10 flex-shrink-0 animate-fade-in text-left">
          {/* LEFT COLUMN SEARCH BAR */}
          <div className="relative">
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
              <Search size={13} className="text-[#E8500A]" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by Brand Name or Category..."
              className="w-full h-9 pl-8 pr-3 bg-white border border-[#eef2f6] rounded-2xl text-[11px] font-semibold text-[#1A1D4E] placeholder-gray-400 focus:outline-none focus:border-[#E8500A]/50 transition-colors shadow-sm"
            />
          </div>

          {/* LAYER 2: FULL SIDEBAR FILTER PANEL */}
          <div id="brands-sidebar-filters" className="transition-all duration-300 rounded-2xl">
            <FullSidebarFilterPanel
              title="Filter Brands"
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              searchPlaceholder="Search brands, category or best for..."
              quickFilters={
                <QuickFilterBar
                  title="Brands Quick Specs"
                  onOpenFullFilters={() => {}}
                  filters={[
                    { id: 'verified', label: '✓ Verified Claims', active: verificationFilter === 'verified', onClick: () => setVerificationFilter(verificationFilter === 'verified' ? 'all' : 'verified') },
                    { id: 'hot', label: 'ðŸ”¥ Hot Brands', active: popularityFilter === 'hot', onClick: () => setPopularityFilter(popularityFilter === 'hot' ? 'all' : 'hot') },
                    { id: 'top-rated', label: '⭐ Top Rated', active: popularityFilter === 'top-rated', onClick: () => setPopularityFilter(popularityFilter === 'top-rated' ? 'all' : 'top-rated') },
                    { id: 'fashion', label: 'ðŸ‘— Fashion Brands', active: selectedCategory === 'Fashion', onClick: () => setSelectedCategory(selectedCategory === 'Fashion' ? null : 'Fashion') },
                    { id: 'tech', label: 'ðŸ’» Tech Devices', active: selectedCategory === 'Tech', onClick: () => setSelectedCategory(selectedCategory === 'Tech' ? null : 'Tech') }
                  ]}
                />
              }
              activeChips={
                <ActiveFilterChips
                  chips={[
                    selectedCategory ? { id: 'category', label: `Category: ${selectedCategory}`, onRemove: () => setSelectedCategory(null) } : null,
                    selectedLetter ? { id: 'letter', label: `Starts with: ${selectedLetter}`, onRemove: () => setSelectedLetter(null) } : null,
                    verificationFilter !== 'all' ? { id: 'verification', label: `Verification: ${verificationFilter}`, onRemove: () => setVerificationFilter('all') } : null,
                    popularityFilter !== 'all' ? { id: 'popularity', label: `Status: ${popularityFilter}`, onRemove: () => setPopularityFilter('all') } : null
                  ].filter(Boolean) as any[]}
                  onClearAll={() => {
                    setSelectedLetter(null); 
                    setSearchQuery(''); 
                    setActiveTab('All Brands');
                    setSelectedCategory(null);
                    setVerificationFilter('all');
                    setPopularityFilter('all');
                  }}
                />
              }
              onReset={() => {
                setSelectedLetter(null); 
                setSearchQuery(''); 
                setActiveTab('All Brands');
                setSelectedCategory(null);
                setVerificationFilter('all');
                setPopularityFilter('all');
              }}
              advancedSection={
                <div className="flex flex-col gap-4">
                  {/* Initial Index selection A-Z */}
                  <div className="bg-white rounded-2xl p-4.5 border border-[#eef2f6] shadow-sm flex flex-col gap-2">
                    <h3 className="text-[11px] font-black text-[#8a9bb0] uppercase tracking-wider mb-2">Alpha search (A-Z)</h3>
                    <div className="grid grid-cols-5 gap-1.5 max-h-32 overflow-y-auto no-scrollbar">
                      <button 
                        onClick={() => setSelectedLetter(null)}
                        className={cn(
                          "col-span-5 py-1.5 rounded-2xl text-[8.5px] font-bold uppercase transition-all text-center cursor-pointer",
                          selectedLetter === null ? "bg-orange-primary text-white" : "bg-gray-50 text-gray-400 hover:bg-gray-100"
                        )}
                      >
                        All Initials
                      </button>
                      {letters.map((letter) => (
                        <button 
                          key={letter} 
                          onClick={() => setSelectedLetter(letter)}
                          className={cn(
                            "h-5.5 rounded-2xl text-[9.5px] font-black transition-all flex items-center justify-center uppercase cursor-pointer",
                            selectedLetter === letter ? "bg-orange-primary text-white" : "bg-gray-50 text-gray-400 hover:bg-gray-100"
                          )}
                        >
                          {letter}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              }
            >
              <UniversalFilterRenderer
                profile={{
                  entity: 'brands',
                  filters: [
                    {
                      id: 'category',
                      name: 'Category Hub',
                      type: 'single_select',
                      options: [
                        { value: 'all', label: 'All Categories' },
                        ...dynamicCategories.map(cat => ({ value: cat.name, label: cat.name, count: cat.count }))
                      ]
                    },
                    {
                      id: 'verification',
                      name: 'Verification Channel',
                      type: 'single_select',
                      options: [
                        { value: 'all', label: 'All Claim Statuses' },
                        { value: 'verified', label: 'Verified Claims Only' },
                        { value: 'unverified', label: 'Unverified Channels' }
                      ]
                    },
                    {
                      id: 'popularity',
                      name: 'Popularity Tier',
                      type: 'single_select',
                      options: [
                        { value: 'all', label: 'All Tiers' },
                        { value: 'hot', label: 'ðŸ”¥ Hot Brands' },
                        { value: 'featured', label: '⭐ Featured' },
                        { value: 'top-rated', label: '✨ Top Rated (4.8+)' }
                      ]
                    }
                  ]
                }}
                activeFilters={{
                  category: selectedCategory || 'all',
                  verification: verificationFilter,
                  popularity: popularityFilter
                }}
                onFilterChange={(filterId, value) => {
                  if (filterId === 'category') {
                    setSelectedCategory(value === 'all' || !value ? null : value);
                  } else if (filterId === 'verification') {
                    setVerificationFilter(value as any);
                  } else if (filterId === 'popularity') {
                    setPopularityFilter(value as any);
                  }
                }}
              />
            </FullSidebarFilterPanel>
          </div>
          {/* BUSINESS SELLERS INFO CARD */}
          <div 
            id="section-sellers-brands" 
            className="w-full bg-white rounded-2xl border border-[#eef2f6] p-5 shadow-sm relative overflow-hidden flex flex-col justify-between text-center shrink-0 mx-auto" 
            style={{ height: '410px' }}
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#E8500A]/5 to-[#1A1D4E]/5 rounded-full blur-2xl pointer-events-none" />
            
            {/* Banner Left Details */}
            <div className="flex-1 space-y-4">
              <h3 className="text-xl md:text-2xl font-sans font-black text-navy tracking-tight">
                Want exclusive brand deals?
              </h3>
              <p className="text-gray-600 text-xs md:text-sm max-w-lg leading-relaxed font-semibold">
                Follow your favorite brands and get notified about deals, new arrivals and exclusive offers.
              </p>
            </div>

            <div className="border border-dashed border-[#E8500A]/20 bg-gradient-to-b from-[#FFF0E8]/20 to-white rounded-2xl p-4 text-center flex flex-col items-center justify-center my-2 flex-1">
              <h4 className="font-sans font-semibold text-gray-900 text-xs uppercase tracking-wider mb-1 leading-none">BOOST SALES</h4>
              <p className="text-[10px] text-gray-500 mb-4 leading-relaxed max-w-[210px] font-semibold">
                Gain entry to featured deal slots, exposure metrics, and buyer engagement streams.
              </p>
              
              <Link 
                to="/post-offer" 
                className="w-full py-2.5 bg-[#E8500A] hover:bg-[#CF4400] text-white font-semibold rounded-lg text-[10px] uppercase tracking-wider flex items-center justify-center gap-2 transition-colors shadow-sm"
              >
                POST OFFER <PenTool className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="flex items-center justify-center gap-1 text-[8.5px] font-semibold text-gray-400 uppercase font-mono tracking-widest shrink-0">
              <Users className="w-3.5 h-3.5 text-gray-400" /> 100k+ shopper log Daily
            </div>
          </div>

          {/* SPONSOR AD */}
          <ListingAdRail
            sponsoredPlacementKey={PLACEMENT_KEYS.SIDEBAR_PORTRAIT}
            sponsoredVariant="portrait"
            showAdSense={false}
          />
        </aside>

        {/* Main Content Area */}
        <main id="brands-main-display" className="choosify-middle-feed scroll-mt-36 min-w-0 pb-10 space-y-6">
          {/* Header info bar (Unified with Brand Deals layout cohesion) */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#eef2f6] font-sans">
            <div>
              <h3 className="text-[10px] font-bold text-[#8a9bb0] uppercase tracking-[0.2em] leading-none">
                Our partners • Brands
              </h3>
              <h2 className="text-xl font-black text-[#1A1D4E] tracking-tight mt-2 leading-none">
                {activeTab === 'All Brands' ? 'All Brands' : activeTab}
                {selectedLetter && ` · Starting with “${selectedLetter}”`}
                {searchQuery && ` · “${searchQuery}”`}
                <span className="text-[#8a9bb0] font-semibold"> ({filteredBrands.length})</span>
              </h2>
            </div>
            
            {(selectedLetter || searchQuery || activeTab !== 'All Brands' || selectedCategory || verificationFilter !== 'all' || popularityFilter !== 'all') && (
              <button 
                onClick={() => {
                  toast.success('Feature coming soon! Following brands is in progress.');
                }}
                className="text-[9.5px] font-black text-orange-primary uppercase tracking-widest hover:underline flex items-center gap-1.5 transition-all bg-white border border-[#eef2f6] px-3.5 py-2 rounded-2xl shadow-sm self-start sm:self-auto hover:text-[#CF4400] cursor-pointer"
              >
                Follow Brands
              </button>
            )}
          </div>

          {/* Active Filter Chips */}
          {(selectedCategory || verificationFilter !== 'all' || popularityFilter !== 'all' || selectedLetter) && (
            <div className="flex flex-wrap items-center gap-3">
              {selectedLetter && (
                <div className="flex items-center gap-2 px-4 py-2 bg-white border border-[#eef2f6] rounded-full text-[10px] font-black text-navy uppercase tracking-widest shadow-sm">
                  Letter: {selectedLetter} 
                  <X size={12} className="text-orange-primary cursor-pointer" onClick={() => setSelectedLetter(null)} />
                </div>
              )}
              {selectedCategory && (
                <div className="flex items-center gap-2 px-4 py-2 bg-white border border-[#eef2f6] rounded-full text-[10px] font-black text-navy uppercase tracking-widest shadow-sm">
                  Category: {selectedCategory} 
                  <X size={12} className="text-orange-primary cursor-pointer" onClick={() => setSelectedCategory(null)} />
                </div>
              )}
              {verificationFilter !== 'all' && (
                <div className="flex items-center gap-2 px-4 py-2 bg-white border border-[#eef2f6] rounded-full text-[10px] font-black text-navy uppercase tracking-widest shadow-sm">
                  Verification: {verificationFilter === 'verified' ? 'Verified' : 'Unverified'} 
                  <X size={12} className="text-orange-primary cursor-pointer" onClick={() => setVerificationFilter('all')} />
                </div>
              )}
              {popularityFilter !== 'all' && (
                <div className="flex items-center gap-2 px-4 py-2 bg-white border border-[#eef2f6] rounded-full text-[10px] font-black text-navy uppercase tracking-widest shadow-sm">
                  Popularity: {popularityFilter.toUpperCase()} 
                  <X size={12} className="text-orange-primary cursor-pointer" onClick={() => setPopularityFilter('all')} />
                </div>
              )}
            </div>

          {/* Tablet/Mobile Collapsible A-Z Filter Card */}
          <div className="lg:hidden bg-white rounded-2xl p-4 border border-[#eef2f6] shadow-sm mb-6 font-sans">
            <div 
              className="flex items-center justify-between cursor-pointer" 
              onClick={() => setIsMobileFilterOpen(!isMobileFilterOpen)}
            >
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-1.5 leading-none">
                  <Filter size={11} className="text-[#E8500A]" />
                  FILTER BY INITIAL:
                </span>
                <span className="px-2 py-0.5 bg-[#E8500A]/10 text-[#E8500A] text-[9px] font-black uppercase rounded-[3px] leading-none">
                  {selectedLetter === null ? 'All' : selectedLetter}
                </span>
              </div>
            </div>
            
            {isMobileFilterOpen && (
              <div className="mt-4 pt-4 border-t border-gray-100/80">
                <div className="grid grid-cols-6 sm:grid-cols-9 gap-1.5">
                  <button 
                    onClick={() => {
                      setSelectedLetter(null);
                      setIsMobileFilterOpen(false);
                    }}
                    className={cn(
                      "col-span-6 sm:col-span-9 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all text-center cursor-pointer",
                      selectedLetter === null ? "bg-orange-primary text-white shadow-lg shadow-orange-primary/10" : "bg-gray-50 text-gray-400 hover:bg-gray-100"
                    )}
                  >
                    All Brands
                  </button>
                  {letters.map((letter) => (
                    <button 
                      key={letter} 
                      onClick={() => {
                        setSelectedLetter(letter);
                        setIsMobileFilterOpen(false);
                      }}
                      className={cn(
                        "h-8 rounded-2xl text-[10px] font-black transition-all flex items-center justify-center uppercase cursor-pointer",
                        selectedLetter === letter ? "bg-orange-primary text-white shadow-md shadow-orange-primary/10" : "bg-gray-50 text-gray-400 hover:text-navy hover:bg-gray-100/70"
                      )}
                    >
                      {letter}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

          {filteredBrands.length > 0 ? (
            <>
              <p className="text-[12.5px] text-[#9AA0AC] font-semibold mb-4">
                Showing 1–{visibleCount} of {totalCount} brands
              </p>
              <div className={cn(BRAND_CARD_GRID, 'mb-8')}>
                {visibleBrandFeed.map((entry) =>
                  entry.kind === 'placement' ? (
                    <AdvertiseHereCard key={entry.key} variant="brand" />
                  ) : (
                    <BrandCardDesign key={entry.key} brand={entry.item} />
                  ),
                )}
                {infeedPlacements.length === 0 && <AdvertiseHereCard variant="brand" />}
              </div>
              <div ref={sentinelRef} className="h-8" aria-hidden />
              {hasMore && (
                <p className="text-center text-[12px] text-[#9AA0AC] font-semibold py-4">Loading more…</p>
              )}
            </>
          ) : null}

          <div className="bg-[#000435] rounded-xl px-7 py-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-white mb-8">
            <div>
              <div className="text-[15px] font-bold mb-1">Want exclusive brand deals?</div>
              <div className="text-[12px] text-white/55">
                Follow your favorite brands and get notified about deals & new arrivals.
              </div>
            </div>
            <Link
              to="/brands"
              className="bg-[#FF5B00] text-white px-[22px] py-3 rounded-lg text-[12px] font-bold no-underline hover:brightness-110 shrink-0"
            >
              FOLLOW BRANDS
            </Link>
          </div>

          <AdSenseSlot format="infeed" className="mt-6" />

          {filteredBrands.length === 0 && (
             <div className="py-20 text-center">
                <Search size={48} className="mx-auto text-gray-300 mb-4" />
                <h3 className="text-xl font-extrabold text-[#1A1A2E] tracking-tight mb-2">No brands found</h3>
                <p className="text-gray-400 font-medium">Try searching for a different brand name or clear filters.</p>
                <button 
                  onClick={() => {setSearchQuery(''); setSelectedLetter(null);}}
                  className="mt-6 px-8 py-3 bg-navy text-white text-xs font-black uppercase rounded-xl shadow-lg"
                >
                  Clear All Filters
                </button>
             </div>
          )}
        </main>

        {/* RIGHT SIDEBAR WITH SPONSOR & SELLERS CARD */}
        <aside className="hidden lg:flex flex-col gap-4 lg:sticky lg:top-24 pb-10 pr-2 flex-shrink-0 animate-fade-in">
          {/* FEATURED BRAND DEALS SECTION */}
          <div className="bg-white rounded-2xl border border-[#eef2f6] p-4.5 shadow-sm w-full text-left animate-fade-in">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#eef2f6] px-1">
              <h3 className="text-[11px] font-semibold text-[#8a9bb0] uppercase tracking-wider">
                Featured Brand Deals
              </h3>
              <Link 
                to="/brand-deals" 
                className="text-[10px] font-bold text-orange-primary hover:underline flex items-center gap-1"
              >
                See All →
              </Link>
            </div>

            <div className="flex flex-col gap-2.5">
              {BRAND_DEALS.length === 0 ? (
                <div className="text-center py-6 border border-dashed border-gray-200 rounded-2xl">
                  <p className="text-xs text-gray-400 font-medium">Featured brand deals will appear here.</p>
                </div>
              ) : (
                BRAND_DEALS.map((item) => (
                  <Link 
                    to={`/brands/${item.id}`}
                    key={item.id} 
                    className="flex items-center gap-3 bg-white border border-[#eef2f6]/60 rounded-2xl p-2 hover:shadow-soft hover:border-[#E8500A]/10 transition-all duration-300 group cursor-pointer"
                  >
                    <div className={cn("w-9 h-9 rounded-lg overflow-hidden shrink-0 border border-transparent flex items-center justify-center text-white font-semibold text-xs shadow-sm", item.bgClass)}>
                      {item.logo}
                    </div>
                    <div className="flex-1 min-w-0 flex flex-col justify-center text-left">
                      <h4 className="font-sans text-xs font-semibold uppercase tracking-tight text-[#1A1D4E] group-hover:text-[#E8500A] transition-colors truncate">
                        {item.name}
                      </h4>
                      <p className="text-[9px] font-semibold text-gray-400 mt-0.5 truncate uppercase">
                        {item.dealHighlight}
                      </p>
                    </div>
                    <span className="text-[8px] font-bold text-[#E8500A] uppercase tracking-wider shrink-0 whitespace-nowrap group-hover:-translate-x-0.5 transition-transform">
                      View Deal
                    </span>
                  </Link>
                ))
              )}
            </div>
          </div>

          {/* FEATURED PROMOCODES SECTION */}
          <div className="bg-white rounded-2xl border border-[#eef2f6] p-4.5 shadow-sm w-full text-left animate-fade-in">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#eef2f6] px-1">
              <h3 className="text-[11px] font-semibold text-[#8a9bb0] uppercase tracking-wider">
                Featured Promocodes
              </h3>
            </div>

            <div className="flex flex-col gap-2.5">
              {PROMO_CODES.length === 0 ? (
                <div className="text-center py-6 border border-dashed border-gray-200 rounded-2xl">
                  <p className="text-xs text-gray-400 font-medium">No active promo codes available right now.</p>
                </div>
              ) : (
                PROMO_CODES.map((item, idx) => (
                  <Link 
                    to={`/brands/${item.brandId}`}
                    key={idx} 
                    className="bg-white border border-[#eef2f6]/65 hover:border-[#E8500A]/15 rounded-2xl p-2.5 hover:shadow-soft transition-all duration-300 group cursor-pointer flex flex-col gap-2 text-left"
                  >
                    {/* Header row with brand details */}
                    <div className="flex items-center justify-between gap-2">
                      <div className="min-w-0">
                        <h4 className="font-sans text-xs font-semibold uppercase tracking-tight text-[#1A1D4E] group-hover:text-[#E8500A] transition-colors truncate">
                          {item.brandName}
                        </h4>
                        <span className="text-[9px] font-bold text-[#E8500A] uppercase tracking-wide">
                          {item.discount}
                        </span>
                      </div>
                      
                      {/* Copy button */}
                      <button 
                        onClick={(e) => {
                          e.preventDefault(); // prevent follow Link navigation
                          e.stopPropagation(); // prevent card container click handler
                          navigator.clipboard.writeText(item.code);
                          toast.success(`Coupon code "${item.code}" copied to clipboard!`);
                        }}
                        className="px-2.5 py-1 bg-[#E8500A]/10 hover:bg-[#E8500A] text-[#E8500A] hover:text-white transition-all cursor-pointer rounded-2xl text-[8px] font-bold uppercase tracking-wider flex items-center gap-1 shrink-0"
                      >
                        <Copy className="w-2.5 h-2.5" />
                        Copy
                      </button>
                    </div>
                    
                    {/* Code display window */}
                    <div className="bg-gray-50 border border-dashed border-[#eef2f6] rounded-2xl px-2.5 py-1.5 flex items-center justify-between font-mono text-[9.5px] font-semibold text-gray-650 tracking-wider">
                      <span>{item.code}</span>
                      <span className="text-[7.5px] font-sans font-semibold text-gray-400 uppercase">ACTIVE</span>
                    </div>
                  </Link>
                ))
              )}
            </div>
          </div>

          {/* Item 3 */}
          <div className="flex flex-col lg:flex-row items-center gap-4 p-3 hover:bg-gray-50 rounded-xl transition-all">
            <div className="w-12 h-12 bg-green-500/10 rounded-full flex items-center justify-center text-green-500 shrink-0">
              <RotateCcw size={20} />
            </div>
            <div>
              <h5 className="font-sans text-[13px] font-black text-navy uppercase tracking-wider">
                Easy Returns
              </h5>
              <p className="text-gray-400 text-[11px] font-semibold mt-0.5">
                7-day return policy
              </p>
            </div>
          </div>

          {/* Item 4 */}
          <div className="flex flex-col lg:flex-row items-center gap-4 p-3 hover:bg-gray-50 rounded-xl transition-all">
            <div className="w-12 h-12 bg-purple-500/10 rounded-full flex items-center justify-center text-purple-500 shrink-0">
              <CreditCard size={20} />
            </div>
            <div>
              <h5 className="font-sans text-[13px] font-black text-navy uppercase tracking-wider">
                Secure Payments
              </h5>
              <p className="text-gray-400 text-[11px] font-semibold mt-0.5">
                100% secure checkout
              </p>
            </div>
          </div>

          {/* Item 5 */}
          <div className="flex flex-col lg:flex-row items-center gap-4 p-3 hover:bg-gray-50 rounded-xl transition-all">
            <div className="w-12 h-12 bg-pink-500/10 rounded-full flex items-center justify-center text-pink-500 shrink-0">
              <Headphones size={20} />
            </div>
            <div>
              <h5 className="font-sans text-[13px] font-black text-navy uppercase tracking-wider">
                24/7 Support
              </h5>
              <p className="text-gray-400 text-[11px] font-semibold mt-0.5">
                We are here to help you
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
