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
import { useRegisterPageFilters, useFloatingFilter, ActiveFilterChips } from '../components/FilterEngine';

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
  const navigate = useNavigate();
  const { mode } = useGlobalState();
  const { setIsOpen: setGlobalFilterOpen } = useFloatingFilter();

  // Search input state
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

  // Register page specific filters
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
          onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
          className="w-full h-10 pl-9 pr-4 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-850 placeholder-slate-400 focus:outline-none focus:border-[#FF5B00]/40 transition-all font-sans"
        />
      </div>
    ),
    renderFilters: () => (
      <div className="space-y-6 select-none font-sans">
        {/* Category Selector */}
        <div className="space-y-3">
          <h4 className="text-[10px] font-black text-slate-400 tracking-widest uppercase">Category</h4>
          <div className="relative">
            <select
              value={selectedCategory}
              onChange={(e) => { setSelectedCategory(e.target.value); setCurrentPage(1); }}
              className="w-full h-10 px-3 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-800 focus:outline-none focus:border-[#FF5B00]/40 font-sans pr-8 cursor-pointer"
            >
              <option value="All Categories">All Categories</option>
              <option value="Electronics">Electronics</option>
              <option value="Tech">Tech</option>
              <option value="Fashion">Fashion</option>
              <option value="Home Appliances">Home Appliances</option>
              <option value="Beauty & Personal Care">Beauty & Personal Care</option>
              <option value="Sports & Outdoors">Sports & Outdoors</option>
            </select>
            <ChevronDown size={14} className="absolute right-3 top-3.5 text-slate-400 pointer-events-none" />
          </div>
        </div>

        {/* Brand Type */}
        <div className="space-y-3">
          <h4 className="text-[10px] font-black text-slate-400 tracking-widest uppercase">Brand Type</h4>
          <div className="space-y-2">
            {[
              { label: 'Global Brands', checked: brandTypeGlobal, setter: setBrandTypeGlobal },
              { label: 'Local Brands', checked: brandTypeLocal, setter: setBrandTypeLocal },
              { label: 'Official Stores', checked: brandTypeOfficial, setter: setBrandTypeOfficial },
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
 
              {/* Layout Toggles */}
              <div className="flex items-center bg-gray-100 rounded-lg p-1 border border-gray-200">
                <button
                  onClick={() => setViewMode('grid')}
                  className={cn(
                    "p-1.5 rounded-md transition-all",
                    viewMode === 'grid' ? "bg-white text-orange-primary shadow-xs" : "text-gray-500 hover:text-navy"
                  )}
                  title="Grid View"
                >
                  <LayoutGrid size={15} />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={cn(
                    "p-1.5 rounded-md transition-all",
                    viewMode === 'list' ? "bg-white text-orange-primary shadow-xs" : "text-gray-500 hover:text-navy"
                  )}
                  title="List View"
                >
                  <List size={15} />
                </button>
              </div>
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
          ) : viewMode === 'grid' ? (
            /* Grid View */
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 min-[1200px]:grid-cols-4 min-[1400px]:grid-cols-5 min-[1600px]:grid-cols-6 gap-6">
              {paginatedBrands.map((brand) => (
                <Link
                  key={brand.id}
                  to={`/brands/${brand.id}`}
                  className="bg-white rounded-xl border border-[#E3E8EE] overflow-hidden shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col group text-left cursor-pointer"
                >
                  {/* Top Image Card Banner */}
                  <div className={cn("h-36 relative flex items-center justify-center p-4 transition-transform overflow-hidden", brand.bannerClass)}>
                    
                    {/* Centered official brand logo or fallback */}
                    {brand.logoUrl ? (
                      <img 
                        src={brand.logoUrl} 
                        alt={`${brand.name} Logo`} 
                        className="h-10 max-h-[50%] w-auto max-w-[80%] object-contain brightness-0 invert opacity-90 group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <span className="text-white text-2xl font-sans font-black uppercase tracking-widest opacity-80 group-hover:scale-105 transition-transform duration-500 text-center px-4">
                        {brand.brandText}
                      </span>
                    )}

                    {/* Top right verified shield badge */}
                    {brand.isVerified && (
                      <div className="absolute top-3.5 right-3.5 bg-[#0DDE78] text-white font-sans text-[8px] font-black uppercase tracking-wider px-2 py-1 rounded-full flex items-center gap-1.5 shadow-sm">
                        <Check size={9} strokeWidth={4} /> Verified
                      </div>
                    )}

                    {/* Bottom left monogram circular monogram avatar badge - increased by 27% and optimized transition */}
                    <div className="absolute bottom-[-26px] left-5 w-14 h-14 bg-white rounded-full shadow-md border-2 border-white flex items-center justify-center text-center font-sans font-black text-navy text-lg z-10">
                      {brand.logo}
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-5 pt-9 flex-1 flex flex-col text-left">
                    <h4 className="text-base font-black text-navy uppercase tracking-tight group-hover:text-orange-primary transition-colors">
                      {brand.name}
                    </h4>
                    <p className="text-gray-500 text-xs mt-1.5 line-clamp-1">
                      {brand.description}
                    </p>

                    {/* Ratings row */}
                    <div className="flex items-center gap-1.5 mt-3 text-xs">
                      <div className="flex items-center gap-0.5 text-orange-primary">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            size={12}
                            fill={i < Math.floor(brand.rating) ? "currentColor" : "none"}
                            className="shrink-0"
                          />
                        ))}
                      </div>
                      <span className="font-bold text-navy text-[11px]">{brand.rating}</span>
                      <span className="text-gray-400 text-[10px]">({brand.reviewsCount} reviews)</span>
                    </div>

                    {/* Separator line */}
                    <div className="w-full h-px bg-[#F1F5F9] my-4" />

                    {/* Statistics Horizontal Row */}
                    <div className="grid grid-cols-3 gap-1.5 text-center text-xs font-sans mb-5">
                      <div>
                        <span className="text-[10px] font-semibold text-gray-400 block uppercase mb-0.5">Products</span>
                        <span className="font-black text-navy">{brand.productsCount}</span>
                      </div>
                      <div className="border-x border-gray-100">
                        <span className="text-[10px] font-semibold text-gray-400 block uppercase mb-0.5">Categories</span>
                        <span className="font-black text-navy">{brand.categoriesCount}</span>
                      </div>
                      <div>
                        <span className="text-[10px] font-semibold text-gray-400 block uppercase mb-0.5">Followers</span>
                        <span className="font-black text-navy">{brand.followersCount}</span>
                      </div>
                    </div>

                    {/* View Button */}
                    <div
                      className="w-full mt-auto py-2.5 bg-[#050C24] group-hover:bg-[#FF5B00] text-white text-xs font-black uppercase tracking-wider rounded-lg flex items-center justify-center gap-2 shadow-sm transition-all duration-200"
                    >
                      View Brand <ArrowRight size={13} />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            /* List View */
            <div className="space-y-4">
              {paginatedBrands.map((brand) => (
                <Link
                  key={brand.id}
                  to={`/brands/${brand.id}`}
                  className="bg-white rounded-xl border border-[#E3E8EE] overflow-hidden shadow-xs hover:shadow-md transition-all duration-300 flex flex-col md:flex-row group text-left cursor-pointer"
                >
                  {/* Left banner strip */}
                  <div className={cn("w-full md:w-48 h-32 md:h-auto relative flex items-center justify-center p-4 shrink-0 overflow-hidden", brand.bannerClass)}>
                    {/* Centered official brand logo or fallback */}
                    {brand.logoUrl ? (
                      <img 
                        src={brand.logoUrl} 
                        alt={`${brand.name} Logo`} 
                        className="h-8 w-auto max-w-[85%] object-contain brightness-0 invert opacity-85 group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <span className="text-white text-xl font-sans font-black uppercase tracking-wider opacity-85 group-hover:scale-105 transition-transform duration-500 text-center px-4">
                        {brand.brandText}
                      </span>
                    )}
                    {brand.isVerified && (
                      <div className="absolute top-3 right-3 bg-[#0DDE78] text-white font-sans text-[8px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full flex items-center gap-1">
                        <Check size={8} strokeWidth={4} /> Verified
                      </div>
                    )}
                  </div>

                  {/* Body Content */}
                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="w-8 h-8 bg-gray-50 border border-gray-100 rounded flex items-center justify-center font-sans font-black text-navy text-xs shrink-0">
                            {brand.logo}
                          </span>
                          <h4 className="text-base font-black text-navy uppercase tracking-tight group-hover:text-orange-primary transition-colors">
                            {brand.name}
                          </h4>
                        </div>
                        <p className="text-gray-500 text-xs mt-1">
                          {brand.description}
                        </p>
                      </div>

                      {/* Ratings */}
                      <div className="flex items-center gap-1 text-xs">
                        <Star size={12} fill="currentColor" className="text-orange-primary" />
                        <span className="font-bold text-navy">{brand.rating}</span>
                        <span className="text-gray-400 text-[10px]">({brand.reviewsCount})</span>
                      </div>
                    </div>

                    {/* Stats & button bottom section */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mt-4 pt-4 border-t border-gray-100">
                      {/* Stats */}
                      <div className="flex items-center gap-6 text-xs text-left">
                        <div>
                          <span className="text-[9px] font-semibold text-gray-400 block uppercase">Products</span>
                          <span className="font-black text-navy">{brand.productsCount}</span>
                        </div>
                        <div>
                          <span className="text-[9px] font-semibold text-gray-400 block uppercase">Categories</span>
                          <span className="font-black text-navy">{brand.categoriesCount}</span>
                        </div>
                        <div>
                          <span className="text-[9px] font-semibold text-gray-400 block uppercase">Followers</span>
                          <span className="font-black text-navy">{brand.followersCount}</span>
                        </div>
                      </div>

                      {/* Button */}
                      <div
                        className="py-2 px-5 bg-[#050C24] group-hover:bg-[#FF5B00] text-white text-xs font-black uppercase tracking-wider rounded-lg flex items-center justify-center gap-1.5 transition-colors self-start md:self-auto"
                      >
                        View Brand <ArrowRight size={13} />
                      </div>
                    </div>
                  </div>
                </Link>
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

      {/* Exclusive Brand Deals Banner Section */}
      <div className="w-full py-10 px-6 bg-[#F4F7FA]">
        <div className="max-w-[1400px] mx-auto">
          <div className="w-full bg-gradient-to-r from-[#E6F0FA] to-[#ECE9FC] border border-[#D5DFEE] rounded-2xl p-8 md:p-10 flex flex-col lg:flex-row items-center justify-between gap-8 relative overflow-hidden text-left shadow-xs">
            <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />
            
            {/* Banner Left Details */}
            <div className="flex-1 space-y-4">
              <h3 className="text-xl md:text-2xl font-sans font-black text-navy tracking-tight">
                Want exclusive brand deals?
              </h3>
              <p className="text-gray-600 text-xs md:text-sm max-w-lg leading-relaxed font-semibold">
                Follow your favorite brands and get notified about deals, new arrivals and exclusive offers.
              </p>
              <button 
                onClick={() => {
                  toast.success('Feature coming soon! Following brands is in progress.');
                }}
                className="px-6 py-3 bg-[#FF5B00] hover:bg-orange-dark text-white rounded-lg text-xs font-black uppercase tracking-wider shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
              >
                Follow Brands
              </button>
            </div>

            {/* Banner Right Visual Elements */}
            <div className="flex flex-col items-center gap-6 shrink-0 w-full lg:w-auto">
              
              {/* Overlapping small circular floating brand logos */}
              <div className="flex flex-wrap justify-center items-center gap-3.5">
                {['', '✔️', 'S', 'mi', 'Ap', 'W'].map((logo, idx) => (
                  <div
                    key={`floating-logo-${logo}-${idx}`}
                    className="w-11 h-11 bg-white border border-gray-100 rounded-xl shadow-sm flex items-center justify-center font-sans font-black text-navy text-xs"
                  >
                    {logo}
                  </div>
                ))}
              </div>

              {/* Shoppers overlay */}
              <div className="flex items-center gap-3">
                <div className="flex -space-x-3">
                  <img
                    src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=50&h=50&fit=crop"
                    className="w-8 h-8 rounded-full border-2 border-white object-cover shrink-0"
                    alt=""
                  />
                  <img
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50&h=50&fit=crop"
                    className="w-8 h-8 rounded-full border-2 border-white object-cover shrink-0"
                    alt=""
                  />
                  <img
                    src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=50&h=50&fit=crop"
                    className="w-8 h-8 rounded-full border-2 border-white object-cover shrink-0"
                    alt=""
                  />
                  <img
                    src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=50&h=50&fit=crop"
                    className="w-8 h-8 rounded-full border-2 border-white object-cover shrink-0"
                    alt=""
                  />
                </div>
                <span className="text-xs font-bold text-[#475569]">
                  Join <span className="text-navy font-black">250K+</span> smart shoppers
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Core Guarantees Row (Bottom-most banner) */}
      <div className="w-full bg-white border-t border-gray-200 py-10 px-6">
        <div className="max-w-[1400px] mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 text-center lg:text-left">
          
          {/* Item 1 */}
          <div className="flex flex-col lg:flex-row items-center gap-4 p-3 hover:bg-gray-50 rounded-xl transition-all">
            <div className="w-12 h-12 bg-orange-primary/10 rounded-full flex items-center justify-center text-orange-primary shrink-0">
              <ShieldCheck size={22} />
            </div>
            <div>
              <h5 className="font-sans text-[13px] font-black text-navy uppercase tracking-wider">
                100% Authentic
              </h5>
              <p className="text-gray-400 text-[11px] font-semibold mt-0.5">
                Verified brands & products
              </p>
            </div>
          </div>

          {/* Item 2 */}
          <div className="flex flex-col lg:flex-row items-center gap-4 p-3 hover:bg-gray-50 rounded-xl transition-all">
            <div className="w-12 h-12 bg-blue-500/10 rounded-full flex items-center justify-center text-blue-500 shrink-0">
              <ArrowLeftRight size={20} />
            </div>
            <div>
              <h5 className="font-sans text-[13px] font-black text-navy uppercase tracking-wider">
                Best Price
              </h5>
              <p className="text-gray-400 text-[11px] font-semibold mt-0.5">
                We beat any lower price
              </p>
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
