import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Check, PenTool, Search, Sparkles, Users, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ChevronRight, 
  Search, 
  Smartphone, 
  Laptop, 
  Headphones, 
  Camera, 
  Watch, 
  Speaker, 
  Gamepad, 
  Tv,
  ArrowRight,
  TrendingUp,
  Award
} from 'lucide-react';
import { cn } from '../lib/utils';
import { useGlobalState } from '../context/GlobalStateContext';
import { CategoryCardSkeleton } from '../components/Skeleton';
import { CategoryPremiumCard } from '../components/categories/CategoryPremiumCard';
import { CategoriesDiscoveryHero } from '../components/categories/CategoriesDiscoveryHero';
import { CategoriesQuickNav } from '../components/categories/CategoriesQuickNav';
import { buildCategoryDisplayList, type CategoryDisplayItem } from '../utils/categoryDisplay';
import { buildCategoriesPageStats, getCategoryStatBlock } from '../utils/categoryStats';
import { ActiveFilterChips, FullSidebarFilterPanel, useRegisterPageFilters } from '../components/FilterEngine';
import { PAGE_LISTING_SINGLE_SHELL, CATEGORY_CARD_GRID } from "../lib/pageLayout";
import { CATEGORY_CONTENT_MAX } from '../lib/design/categoryTokens';
import { ListingAdRail } from '../components/ListingAdRail';
import { PLACEMENT_KEYS } from '../lib/placements';
import { SponsoredFeedInjector } from '../components/commerce/SponsoredFeedInjector';
import { ChoosifySponsoredCard } from '../components/commerce/ChoosifySponsoredCard';

// ==========================================
// MOCK DATA
// ==========================================

const CATEGORIES = [
  {
    id: 'electronics',
    name: 'Electronics',
    icon: Smartphone,
    color: 'bg-blue-500/10 text-blue-600',
    itemCount: 12450,
    subcategories: [
      'Smartphones', 'Laptops', 'Tablets', 'Wearables', 'Audio', 'Cameras'
    ],
    featuredBrand: 'Apple',
    image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?q=80&w=2000&auto=format&fit=crop'
  },
  {
    id: 'fashion',
    name: 'Fashion & Apparel',
    icon: Watch,
    color: 'bg-pink-500/10 text-pink-600',
    itemCount: 45200,
    subcategories: [
      'Men\'s Clothing', 'Women\'s Clothing', 'Shoes', 'Accessories', 'Jewelry'
    ],
    featuredBrand: 'Nike',
    image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?q=80&w=2000&auto=format&fit=crop'
  },
  {
    id: 'home',
    name: 'Home & Living',
    icon: Tv,
    color: 'bg-amber-500/10 text-amber-600',
    itemCount: 32100,
    subcategories: [
      'Furniture', 'Decor', 'Kitchen', 'Bedding', 'Bath', 'Lighting'
    ],
    featuredBrand: 'IKEA',
    image: 'https://images.unsplash.com/photo-1484101403633-562f891dc89a?q=80&w=2000&auto=format&fit=crop'
  },
  {
    id: 'beauty',
    name: 'Health & Beauty',
    icon: Award,
    color: 'bg-emerald-500/10 text-emerald-600',
    itemCount: 18900,
    subcategories: [
      'Skincare', 'Makeup', 'Haircare', 'Fragrance', 'Personal Care'
    ],
    featuredBrand: 'Sephora',
    image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?q=80&w=2000&auto=format&fit=crop'
  },
  {
    id: 'sports',
    name: 'Sports & Outdoors',
    icon: TrendingUp,
    color: 'bg-orange-500/10 text-orange-600',
    itemCount: 15400,
    subcategories: [
      'Exercise Equipment', 'Outdoor Gear', 'Athletic Clothing', 'Cycling'
    ],
    featuredBrand: 'Patagonia',
    image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=2000&auto=format&fit=crop'
  },
  {
    id: 'gaming',
    name: 'Gaming',
    icon: Gamepad,
    color: 'bg-purple-500/10 text-purple-600',
    itemCount: 8700,
    subcategories: [
      'Consoles', 'Video Games', 'Accessories', 'PC Gaming', 'VR'
    ],
    featuredBrand: 'PlayStation',
    image: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=2000&auto=format&fit=crop'
  }
];

const TRENDING_SEARCHES = [
  "iPhone 15 Pro Max",
  "Nike Air Force 1",
  "Sony WH-1000XM5",
  "Dyson Airwrap",
  "PlayStation 5",
  "Herman Miller"
];

// ==========================================
// MAIN COMPONENT
// ==========================================

export function CategoriesPage() {
  const {
    allCategories,
    allCatalogProducts,
    allCatalogBrands,
    allBrands,
    allDeals,
    allGuides,
    allCreators,
  } = useGlobalState();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategoryTab, setActiveCategoryTab] = useState('All Categories');
  const [quickNavId, setQuickNavId] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // V2 Discovery Filter States
  const [selectedCategoryType, setSelectedCategoryType] = useState<string | null>(null);
  const [selectedCategoryStatus, setSelectedCategoryStatus] = useState<string | null>(null);
  const [selectedAlphabetical, setSelectedAlphabetical] = useState<string | null>(null);
  const [selectedAvailability, setSelectedAvailability] = useState<string | null>(null);
  const [selectedContent, setSelectedContent] = useState<string | null>(null);
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);

  // Simulated content refresh loader that reacts to any discovery filter parameter change
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 400);
    return () => clearTimeout(timer);
  }, [
    searchQuery, activeCategoryTab, 
    selectedCategoryType, selectedCategoryStatus, 
    selectedAlphabetical, selectedAvailability, selectedContent
  ]);

  const handleClearAllFilters = () => {
    setSelectedCategoryType(null);
    setSelectedCategoryStatus(null);
    setSelectedAlphabetical(null);
    setSelectedAvailability(null);
    setSelectedContent(null);
    setSearchQuery('');
    setActiveCategoryTab('All Categories');
    setQuickNavId('');
  };

  const handleQuickNavSelect = (id: string, filterType: string | null) => {
    setQuickNavId(id);
    if (id === 'more') {
      setSelectedCategoryType(null);
      return;
    }
    if (filterType) {
      setSelectedCategoryType(filterType);
    }
  };

  const pageStats = useMemo(
    () =>
      buildCategoriesPageStats({
        products: allCatalogProducts ?? [],
        brands: allCatalogBrands.length ? allCatalogBrands : allBrands,
        deals: allDeals,
        guides: allGuides,
        creators: allCreators,
      }),
    [allCatalogProducts, allCatalogBrands, allBrands, allDeals, allGuides, allCreators],
  );

  const matchCategoryType = (catName: string, type: string) => {
    const name = catName.toLowerCase();
    const t = type.toLowerCase();
    if (t === 'electronics') {
      return name.includes('tech') || name.includes('electronic') || name.includes('mobile') || name.includes('tv') || name.includes('wearable') || name.includes('gaming');
    }
    if (t === 'fashion') {
      return name.includes('fashion') || name.includes('jewelry') || name.includes('accessories') || name.includes('eyewear') || name.includes('fragrance') || name.includes('beauty');
    }
    if (t === 'beauty') {
      return name.includes('beauty') || name.includes('personal care') || name.includes('fragrance');
    }
    if (t === 'home & living') {
      return name.includes('home') || name.includes('living') || name.includes('appliance');
    }
    if (t === 'grocery') {
      return name.includes('food') || name.includes('essential');
    }
    if (t === 'sports') {
      return name.includes('activewear') || name.includes('fitness') || name.includes('wearable');
    }
    if (t === 'automotive') {
      return name.includes('vehicle') || name.includes('automotive');
    }
    if (t === 'books') {
      return name.includes('education') || name.includes('learning') || name.includes('book');
    }
    if (t === 'kids') {
      return name.includes('family') || name.includes('kids') || name.includes('baby');
    }
    if (t === 'health') {
      return name.includes('health') || name.includes('wellness') || name.includes('activity');
    }
    if (t === 'lifestyle') {
      return name.includes('travel') || name.includes('hospitality') || name.includes('hobby') || name.includes('creativity') || name.includes('fashion');
    }
    if (t === 'services') {
      return name.includes('education') || name.includes('travel') || name.includes('learning');
    }
    return false;
  };

  const matchCategoryStatus = (cat: CategoryItem, status: string) => {
    const normStatus = status.toLowerCase();
    const name = cat.name.toLowerCase();
    if (normStatus === 'featured') {
      return name.includes('fashion') || name.includes('tech') || name.includes('mobile') || name.includes('food');
    }
    if (normStatus === 'trending') {
      return name.includes('mobile') || name.includes('tech') || name.includes('jewelry') || name.includes('gaming');
    }
    if (normStatus === 'editors-picks') {
      return name.includes('travel') || name.includes('hobbies') || name.includes('eyewear') || name.includes('beauty');
    }
    if (normStatus === 'newly-added') {
      return name.includes('vehicle') || name.includes('education') || name.includes('health') || name.includes('family');
    }
    if (normStatus === 'popular') {
      return cat.count > 500;
    }
    return true;
  };

  const matchCategoryAvailability = (cat: CategoryItem, avail: string) => {
    const norm = avail.toLowerCase();
    if (norm === 'products') {
      return cat.count > 0;
    }
    if (norm === 'brands') {
      return cat.subcategories && cat.subcategories.length > 0;
    }
    if (norm === 'deals') {
      return cat.count > 300;
    }
    if (norm === 'guides') {
      const name = cat.name.toLowerCase();
      return name.includes('fashion') || name.includes('tech') || name.includes('mobile') || name.includes('beauty');
    }
    return true;
  };

  const renderFilterPanel = () => {
    return (
      <FullSidebarFilterPanel
        title="Category Discovery"
        onReset={handleClearAllFilters}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        searchPlaceholder="Search categories, subcategories..."
        activeChips={
          <ActiveFilterChips
            chips={[
              selectedCategoryType ? { id: 'categoryType', label: `Type: ${selectedCategoryType}`, onRemove: () => setSelectedCategoryType(null) } : null,
              selectedCategoryStatus ? { id: 'status', label: `Status: ${selectedCategoryStatus}`, onRemove: () => setSelectedCategoryStatus(null) } : null,
              selectedAlphabetical ? { id: 'alphabetical', label: `Alphabetical: ${selectedAlphabetical}`, onRemove: () => setSelectedAlphabetical(null) } : null,
              selectedAvailability ? { id: 'availability', label: `Availability: ${selectedAvailability}`, onRemove: () => setSelectedAvailability(null) } : null,
              selectedContent ? { id: 'content', label: `Content: ${selectedContent}`, onRemove: () => setSelectedContent(null) } : null,
              activeCategoryTab !== 'All Categories' ? { id: 'tab', label: `Tab: ${activeCategoryTab}`, onRemove: () => setActiveCategoryTab('All Categories') } : null,
            ].filter(Boolean) as any[]}
            onClearAll={handleClearAllFilters}
          />
        }
        advancedSection={
          <div className="flex flex-col gap-4">
            <div className="bg-white border border-[#eef2f6] rounded-2xl p-4.5 shadow-sm text-left font-sans">
              <h3 className="text-[11px] font-semibold text-[#8a9bb0] uppercase tracking-wider pb-2 border-b border-[#eef2f6] mb-3">Availability</h3>
              <div className="space-y-1">
                {[
                  { value: 'products', label: 'Categories with Products' },
                  { value: 'brands', label: 'Categories with Brands' },
                  { value: 'deals', label: 'Categories with Deals' },
                  { value: 'guides', label: 'Categories with Buying Guides' }
                ].map(opt => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setSelectedAvailability(selectedAvailability === opt.value ? null : opt.value)}
                    className={cn(
                      "w-full flex items-center justify-between text-left px-2 py-1 rounded-[4px] transition-colors text-xs font-semibold cursor-pointer",
                      selectedAvailability === opt.value ? "bg-[#FFF0E8] text-orange-primary font-bold" : "text-gray-500 hover:bg-gray-50 hover:text-[#1A1D4E]"
                    )}
                  >
                    <span>{opt.label}</span>
                    {selectedAvailability === opt.value && <Check size={11} className="text-orange-primary shrink-0" />}
                  </button>
                ))}
              </div>

              <h3 className="text-[11px] font-semibold text-[#8a9bb0] uppercase tracking-wider pb-2 border-b border-[#eef2f6] mt-4 mb-3">Content Availability</h3>
              <div className="space-y-1">
                {[
                  { value: 'brands', label: 'Has Brands' },
                  { value: 'creators', label: 'Has Creators' },
                  { value: 'recs', label: 'Has Recommendations' },
                  { value: 'whats-on', label: 'Has Events' }
                ].map(opt => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setSelectedContent(selectedContent === opt.value ? null : opt.value)}
                    className={cn(
                      "w-full flex items-center justify-between text-left px-2 py-1 rounded-[4px] transition-colors text-xs font-semibold cursor-pointer",
                      selectedContent === opt.value ? "bg-[#FFF0E8] text-orange-primary font-bold" : "text-gray-500 hover:bg-gray-50 hover:text-[#1A1D4E]"
                    )}
                  >
                    <span>{opt.label}</span>
                    {selectedContent === opt.value && <Check size={11} className="text-orange-primary shrink-0" />}
                  </button>
                ))}
              </div>
            </div>
          </div>
        }
      >
        <div className="bg-white border border-[#eef2f6] rounded-2xl p-4.5 shadow-sm text-left">
          <h3 className="text-[11px] font-semibold text-[#8a9bb0] uppercase tracking-wider pb-2 border-b border-[#eef2f6] mb-3">Category Type</h3>
          <div className="space-y-1 max-h-56 overflow-y-auto no-scrollbar">
            {[
              { value: 'Electronics', label: 'Electronics Catalog' },
              { value: 'Fashion', label: 'Fashion & Apparel' },
              { value: 'Beauty', label: 'Beauty & Skincare' },
              { value: 'Home & Living', label: 'Home & Living' },
              { value: 'Grocery', label: 'Grocery & Essentials' },
              { value: 'Sports', label: 'Sports & Activewear' },
              { value: 'Automotive', label: 'Vehicles & Motoring' },
              { value: 'Books', label: 'Books & Education' },
              { value: 'Kids', label: 'Kids & Family' },
              { value: 'Health', label: 'Health & Wellness' },
              { value: 'Lifestyle', label: 'Travel & Lifestyle' },
              { value: 'Services', label: 'Learning & Services' }
            ].map(opt => (
              <button
                key={opt.value}
                type="button"
                onClick={() => setSelectedCategoryType(selectedCategoryType === opt.value ? null : opt.value)}
                className={cn(
                  "w-full flex items-center justify-between text-left px-2 py-1 rounded-[4px] transition-colors text-xs font-semibold cursor-pointer",
                  selectedCategoryType === opt.value ? "bg-[#FFF0E8] text-orange-primary font-bold" : "text-gray-500 hover:bg-gray-50 hover:text-[#1A1D4E]"
                )}
              >
                <span>{opt.label}</span>
                {selectedCategoryType === opt.value && <Check size={11} className="text-orange-primary shrink-0" />}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-white border border-[#eef2f6] rounded-2xl p-4.5 shadow-sm text-left">
          <h3 className="text-[11px] font-semibold text-[#8a9bb0] uppercase tracking-wider pb-2 border-b border-[#eef2f6] mb-3">Category Status</h3>
          <div className="space-y-1">
            {[
              { value: 'featured', label: 'Featured Categories' },
              { value: 'trending', label: 'Trending Categories' },
              { value: 'editors-picks', label: "Editor's Picks" },
              { value: 'newly-added', label: 'Newly Added' },
              { value: 'popular', label: 'Popular' }
            ].map(opt => (
              <button
                key={opt.value}
                type="button"
                onClick={() => setSelectedCategoryStatus(selectedCategoryStatus === opt.value ? null : opt.value)}
                className={cn(
                  "w-full flex items-center justify-between text-left px-2 py-1 rounded-[4px] transition-colors text-xs font-semibold cursor-pointer",
                  selectedCategoryStatus === opt.value ? "bg-[#FFF0E8] text-orange-primary font-bold" : "text-gray-500 hover:bg-gray-50 hover:text-[#1A1D4E]"
                )}
              >
                <span>{opt.label}</span>
                {selectedCategoryStatus === opt.value && <Check size={11} className="text-orange-primary shrink-0" />}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-white border border-[#eef2f6] rounded-2xl p-4.5 shadow-sm text-left">
          <h3 className="text-[11px] font-semibold text-[#8a9bb0] uppercase tracking-wider pb-2 border-b border-[#eef2f6] mb-3">Alphabetical</h3>
          <div className="space-y-1">
            {[
              { value: 'a-z', label: 'Alphabetical: A–Z' },
              { value: 'z-a', label: 'Alphabetical: Z–A' }
            ].map(opt => (
              <button
                key={opt.value}
                type="button"
                onClick={() => setSelectedAlphabetical(selectedAlphabetical === opt.value ? null : opt.value)}
                className={cn(
                  "w-full flex items-center justify-between text-left px-2 py-1 rounded-[4px] transition-colors text-xs font-semibold cursor-pointer",
                  selectedAlphabetical === opt.value ? "bg-[#FFF0E8] text-orange-primary font-bold" : "text-gray-500 hover:bg-gray-50 hover:text-[#1A1D4E]"
                )}
              >
                <span>{opt.label}</span>
                {selectedAlphabetical === opt.value && <Check size={11} className="text-orange-primary shrink-0" />}
              </button>
            ))}
          </div>
        </div>
      </FullSidebarFilterPanel>
    );
  };

  const categoriesList = React.useMemo(
    () => buildCategoryDisplayList(allCategories ?? [], allCatalogProducts ?? []),
    [allCategories, allCatalogProducts],
  );

  // Dynamic filter supporting the page search system and discovery state criteria
  const filteredCategoriesList = React.useMemo(() => {
    let result = [...categoriesList];

    // 1. Filter by Search Query (dedicated category page search searches ONLY categories)
    const q = searchQuery.toLowerCase().trim();
    if (q) {
      result = result.filter(cat => {
        const nameMatch = cat.name.toLowerCase().includes(q);
        const subcategoryMatch = cat.subcategories?.some(sub => sub.name.toLowerCase().includes(q)) || false;
        return nameMatch || subcategoryMatch;
      });
    }

    // 2. Filter by Category Tab (All Categories / Popular / Trending / New Arrivals / Top Rated)
    if (activeCategoryTab === 'Popular') {
      result = result.filter(cat => cat.count > 500);
    } else if (activeCategoryTab === 'Trending') {
      result = result.filter(cat => cat.name.includes('Mobile') || cat.name.includes('Tech') || cat.name.includes('Jewelry') || cat.name.includes('Gaming') || cat.name.includes('Fashion'));
    } else if (activeCategoryTab === 'New Arrivals') {
      result = result.filter(cat => cat.name.includes('Vehicle') || cat.name.includes('Education') || cat.name.includes('Health') || cat.name.includes('Family'));
    } else if (activeCategoryTab === 'Top Rated') {
      result = result.filter(cat => cat.name.includes('Fashion') || cat.name.includes('Tech') || cat.name.includes('Beauty') || cat.name.includes('Mobile') || cat.name.includes('Food'));
    }

    // 3. Filter by Category Type from Left Sidebar Panel
    if (selectedCategoryType) {
      result = result.filter(cat => matchCategoryType(cat.name, selectedCategoryType));
    }

    // 4. Filter by Category Status from Left Sidebar Panel
    if (selectedCategoryStatus) {
      result = result.filter(cat => matchCategoryStatus(cat, selectedCategoryStatus));
    }

    // 5. Filter by Availability from Sidebar
    if (selectedAvailability) {
      result = result.filter(cat => matchCategoryAvailability(cat, selectedAvailability));
    }

    // 6. Filter by Content Availability from Sidebar
    if (selectedContent) {
      result = result.filter(cat => {
        const norm = selectedContent.toLowerCase();
        if (norm === 'brands') {
          return cat.subcategories && cat.subcategories.some(sub => sub.brands > 0);
        }
        if (norm === 'creators') {
          return cat.name.includes('Fashion') || cat.name.includes('Tech') || cat.name.includes('Beauty') || cat.name.includes('Mobile');
        }
        if (norm === 'recs') {
          return cat.count > 200;
        }
        if (norm === 'whats-on') {
          return cat.count > 500;
        }
        return true;
      });
    }

    // 7. Alphabetical sorting
    if (selectedAlphabetical === 'a-z' || selectedAlphabetical === 'A–Z') {
      result.sort((a, b) => a.name.localeCompare(b.name));
    } else if (selectedAlphabetical === 'z-a' || selectedAlphabetical === 'Z–A') {
      result.sort((a, b) => b.name.localeCompare(a.name));
    }

    return result;
  }, [searchQuery, activeCategoryTab, selectedCategoryType, selectedCategoryStatus, selectedAvailability, selectedContent, selectedAlphabetical, categoriesList]);

  useRegisterPageFilters({
    pageName: 'Categories',
    scrollTargetId: 'categories-main-display',
    renderSearch: () => (
      <div className="relative">
        <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
          <Search size={13} className="text-[#E8500A]" />
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search categories, subcategories..."
          className="w-full h-9 pl-8 pr-3 bg-white border border-[#eef2f6] rounded-2xl text-[11px] font-semibold text-[#1A1D4E] placeholder-gray-400 focus:outline-none focus:border-[#E8500A]/50 transition-colors"
        />
      </div>
    ),
    quickFilters: [
      {
        id: 'all-categories',
        label: 'All Categories',
        active: !selectedCategoryStatus && !selectedCategoryType && !selectedAlphabetical && activeCategoryTab === 'All Categories',
        onClick: handleClearAllFilters
      },
      {
        id: 'trending-pill',
        label: 'ðŸ”¥ Trending',
        active: selectedCategoryStatus === 'trending' || activeCategoryTab === 'Trending',
        onClick: () => {
          setSelectedCategoryStatus(selectedCategoryStatus === 'trending' ? null : 'trending');
          setActiveCategoryTab(activeCategoryTab === 'Trending' ? 'All Categories' : 'Trending');
        }
      },
      {
        id: 'featured-pill',
        label: '★ Featured',
        active: selectedCategoryStatus === 'featured',
        onClick: () => {
          setSelectedCategoryStatus(selectedCategoryStatus === 'featured' ? null : 'featured');
        }
      },
      {
        id: 'popular-pill',
        label: 'ðŸ’Ž Popular',
        active: selectedCategoryStatus === 'popular' || activeCategoryTab === 'Popular',
        onClick: () => {
          setSelectedCategoryStatus(selectedCategoryStatus === 'popular' ? null : 'popular');
          setActiveCategoryTab(activeCategoryTab === 'Popular' ? 'All Categories' : 'Popular');
        }
      },
      {
        id: 'new-pill',
        label: 'ðŸ“… New Arrivals',
        active: selectedCategoryStatus === 'newly-added' || activeCategoryTab === 'New Arrivals',
        onClick: () => {
          setSelectedCategoryStatus(selectedCategoryStatus === 'newly-added' ? null : 'newly-added');
          setActiveCategoryTab(activeCategoryTab === 'New Arrivals' ? 'All Categories' : 'New Arrivals');
        }
      }
    ],
    renderFilters: () => (
      <div className="flex flex-col gap-4">
        {/* Availability */}
        <div className="bg-white border border-[#eef2f6] rounded-2xl p-4.5 shadow-sm text-left font-sans">
          <h3 className="text-[11px] font-semibold text-[#8a9bb0] uppercase tracking-wider pb-2 border-b border-[#eef2f6] mb-3">Availability</h3>
          <div className="space-y-1">
            {[
              { value: 'products', label: 'Categories with Products' },
              { value: 'brands', label: 'Categories with Brands' },
              { value: 'deals', label: 'Categories with Deals' },
              { value: 'guides', label: 'Categories with Buying Guides' }
            ].map(opt => (
              <button
                key={opt.value}
                type="button"
                onClick={() => setSelectedAvailability(selectedAvailability === opt.value ? null : opt.value)}
                className={cn(
                  "w-full flex items-center justify-between text-left px-2 py-1 rounded-[4px] transition-colors text-xs font-semibold cursor-pointer",
                  selectedAvailability === opt.value ? "bg-[#FFF0E8] text-orange-primary font-bold" : "text-gray-500 hover:bg-gray-50 hover:text-[#1A1D4E]"
                )}
              >
                <span>{opt.label}</span>
                {selectedAvailability === opt.value && <Check size={11} className="text-orange-primary shrink-0" />}
              </button>
            ))}
          </div>

          <h3 className="text-[11px] font-semibold text-[#8a9bb0] uppercase tracking-wider pb-2 border-b border-[#eef2f6] mt-4 mb-3">Content Availability</h3>
          <div className="space-y-1">
            {[
              { value: 'brands', label: 'Has Brands' },
              { value: 'creators', label: 'Has Creators' },
              { value: 'recs', label: 'Has Recommendations' },
              { value: 'whats-on', label: 'Has Events' }
            ].map(opt => (
              <button
                key={opt.value}
                type="button"
                onClick={() => setSelectedContent(selectedContent === opt.value ? null : opt.value)}
                className={cn(
                  "w-full flex items-center justify-between text-left px-2 py-1 rounded-[4px] transition-colors text-xs font-semibold cursor-pointer",
                  selectedContent === opt.value ? "bg-[#FFF0E8] text-orange-primary font-bold" : "text-gray-500 hover:bg-gray-50 hover:text-[#1A1D4E]"
                )}
              >
                <span>{opt.label}</span>
                {selectedContent === opt.value && <Check size={11} className="text-orange-primary shrink-0" />}
              </button>
            ))}
          </div>
        </div>

        {/* Category Type */}
        <div className="bg-white border border-[#eef2f6] rounded-2xl p-4.5 shadow-sm text-left">
          <h3 className="text-[11px] font-semibold text-[#8a9bb0] uppercase tracking-wider pb-2 border-b border-[#eef2f6] mb-3">Category Type</h3>
          <div className="space-y-1 max-h-56 overflow-y-auto no-scrollbar">
            {[
              { value: 'Electronics', label: 'Electronics Catalog' },
              { value: 'Fashion', label: 'Fashion & Apparel' },
              { value: 'Beauty', label: 'Beauty & Skincare' },
              { value: 'Home & Living', label: 'Home & Living' },
              { value: 'Grocery', label: 'Grocery & Essentials' },
              { value: 'Sports', label: 'Sports & Activewear' },
              { value: 'Automotive', label: 'Vehicles & Motoring' },
              { value: 'Books', label: 'Books & Education' },
              { value: 'Kids', label: 'Kids & Family' },
              { value: 'Health', label: 'Health & Wellness' },
              { value: 'Lifestyle', label: 'Travel & Lifestyle' },
              { value: 'Services', label: 'Learning & Services' }
            ].map(opt => (
              <button
                key={opt.value}
                type="button"
                onClick={() => setSelectedCategoryType(selectedCategoryType === opt.value ? null : opt.value)}
                className={cn(
                  "w-full flex items-center justify-between text-left px-2 py-1 rounded-[4px] transition-colors text-xs font-semibold cursor-pointer",
                  selectedCategoryType === opt.value ? "bg-[#FFF0E8] text-orange-primary font-bold" : "text-gray-500 hover:bg-gray-50 hover:text-[#1A1D4E]"
                )}
              >
                <span>{opt.label}</span>
                {selectedCategoryType === opt.value && <Check size={11} className="text-orange-primary shrink-0" />}
              </button>
            ))}
          </div>
        </div>

        {/* Category Status */}
        <div className="bg-white border border-[#eef2f6] rounded-2xl p-4.5 shadow-sm text-left">
          <h3 className="text-[11px] font-semibold text-[#8a9bb0] uppercase tracking-wider pb-2 border-b border-[#eef2f6] mb-3">Category Status</h3>
          <div className="space-y-1">
            {[
              { value: 'featured', label: 'Featured Categories' },
              { value: 'trending', label: 'Trending Categories' },
              { value: 'editors-picks', label: "Editor's Picks" },
              { value: 'newly-added', label: 'Newly Added' },
              { value: 'popular', label: 'Popular' }
            ].map(opt => (
              <button
                key={opt.value}
                type="button"
                onClick={() => setSelectedCategoryStatus(selectedCategoryStatus === opt.value ? null : opt.value)}
                className={cn(
                  "w-full flex items-center justify-between text-left px-2 py-1 rounded-[4px] transition-colors text-xs font-semibold cursor-pointer",
                  selectedCategoryStatus === opt.value ? "bg-[#FFF0E8] text-orange-primary font-bold" : "text-gray-500 hover:bg-gray-50 hover:text-[#1A1D4E]"
                )}
              >
                <span>{opt.label}</span>
                {selectedCategoryStatus === opt.value && <Check size={11} className="text-orange-primary shrink-0" />}
              </button>
            ))}
          </div>
        </div>

        {/* Alphabetical */}
        <div className="bg-white border border-[#eef2f6] rounded-2xl p-4.5 shadow-sm text-left">
          <h3 className="text-[11px] font-semibold text-[#8a9bb0] uppercase tracking-wider pb-2 border-b border-[#eef2f6] mb-3">Alphabetical</h3>
          <div className="space-y-1">
            {[
              { value: 'a-z', label: 'Alphabetical: A–Z' },
              { value: 'z-a', label: 'Alphabetical: Z–A' }
            ].map(opt => (
              <button
                key={opt.value}
                type="button"
                onClick={() => setSelectedAlphabetical(selectedAlphabetical === opt.value ? null : opt.value)}
                className={cn(
                  "w-full flex items-center justify-between text-left px-2 py-1 rounded-[4px] transition-colors text-xs font-semibold cursor-pointer",
                  selectedAlphabetical === opt.value ? "bg-[#FFF0E8] text-orange-primary font-bold" : "text-gray-500 hover:bg-gray-50 hover:text-[#1A1D4E]"
                )}
              >
                <span>{opt.label}</span>
                {selectedAlphabetical === opt.value && <Check size={11} className="text-orange-primary shrink-0" />}
              </button>
            ))}
          </div>
        </div>
      </div>
    ),
    activeFilterCount: (selectedCategoryType ? 1 : 0) +
      (selectedCategoryStatus ? 1 : 0) +
      (selectedAlphabetical ? 1 : 0) +
      (selectedAvailability ? 1 : 0) +
      (selectedContent ? 1 : 0) +
      (activeCategoryTab !== 'All Categories' ? 1 : 0) +
      (searchQuery ? 1 : 0),
    onClearAll: handleClearAllFilters,
  }, [
    searchQuery,
    activeCategoryTab,
    selectedCategoryType,
    selectedCategoryStatus,
    selectedAlphabetical,
    selectedAvailability,
    selectedContent,
  ]);

  return (
    <div className="flex flex-col min-h-screen bg-[#F4F7F9]">
      <CategoriesDiscoveryHero
        stats={pageStats}
        onSearch={(q) => setSearchQuery(q)}
      />
      <CategoriesQuickNav activeId={quickNavId} onSelect={handleQuickNavSelect} />

      <div className={cn(CATEGORY_CONTENT_MAX, 'py-4')}>
        <ActiveFilterChips
          chips={[
            selectedCategoryType ? { id: 'categoryType', label: `Type: ${selectedCategoryType}`, onRemove: () => { setSelectedCategoryType(null); setQuickNavId(''); } } : null,
            selectedCategoryStatus ? { id: 'status', label: `Status: ${selectedCategoryStatus}`, onRemove: () => setSelectedCategoryStatus(null) } : null,
            selectedAlphabetical ? { id: 'alphabetical', label: `Alphabetical: ${selectedAlphabetical}`, onRemove: () => setSelectedAlphabetical(null) } : null,
            selectedAvailability ? { id: 'availability', label: `Availability: ${selectedAvailability}`, onRemove: () => setSelectedAvailability(null) } : null,
            selectedContent ? { id: 'content', label: `Content: ${selectedContent}`, onRemove: () => setSelectedContent(null) } : null,
            activeCategoryTab !== 'All Categories' ? { id: 'tab', label: `Tab: ${activeCategoryTab}`, onRemove: () => setActiveCategoryTab('All Categories') } : null,
          ].filter(Boolean) as any[]}
          onClearAll={handleClearAllFilters}
        />
      </div>

      <div className={`max-w-[1440px] mx-auto px-4 sm:px-5 lg:px-6 py-5 w-full ${PAGE_LISTING_SINGLE_SHELL}`}>
        {/* LEFT COLUMN: FULL FILTER PANEL */}
        <aside className="hidden lg:flex flex-col gap-4 lg:sticky lg:top-28 pb-10 pr-2 flex-shrink-0 animate-fade-in">
          {/* LEFT COLUMN SEARCH BAR */}
          <div className="relative">
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
              <Search size={13} className="text-[#E8500A]" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search categories, subcategories..."
              className="w-full h-9 pl-8 pr-3 bg-white border border-[#eef2f6] rounded-2xl text-[11px] font-semibold text-[#1A1D4E] placeholder-gray-400 focus:outline-none focus:border-[#E8500A]/50 transition-colors shadow-sm"
            />
          </div>

          <div id="categories-sidebar-filters" className="transition-all duration-300 rounded-2xl w-full">
            {renderFilterPanel()}
          </div>
        </aside>

        <div id="categories-main-display" className="choosify-middle-feed scroll-mt-40 min-w-0 pb-10">
          {isLoading ? (
            <div className={CATEGORY_CARD_GRID}>
              {Array.from({ length: 12 }).map((_, idx) => (
                <CategoryCardSkeleton key={idx} />
              ))}
            </div>
          ) : (
            <div className={CATEGORY_CARD_GRID}>
            <SponsoredFeedInjector
              surface="categories"
              items={filteredCategoriesList}
              getItemKey={(cat) => cat.name}
            >
              {(entries) =>
                entries.map((entry) => {
                  if (entry.kind === 'sponsored') {
                    return <ChoosifySponsoredCard key={entry.key} item={entry.sponsored} />;
                  }

                  const cat = entry.item;

                  return (
                    <CategoryPremiumCard
                      key={entry.key}
                      name={cat.name}
                      stats={getCategoryStatBlock(cat, allCatalogProducts ?? [])}
                      icon={cat.icon}
                      image={cat.image}
                      subcategories={cat.subcategories}
                      featuredBrand={
                        (allCatalogProducts ?? []).find(
                          (p) =>
                            String(p.categoryName ?? '')
                              .toLowerCase()
                              .includes(cat.name.toLowerCase().split(/\s+/)[0] ?? '') &&
                            p.brandName,
                        )?.brandName
                      }
                    />
                  );
                })
              }
            </SponsoredFeedInjector>
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: FOR BUSINESS & SELLERS CARD & SPONSORED AD */}
        <aside className="hidden lg:flex flex-col gap-4 lg:sticky lg:top-28 pb-10 pr-2 flex-shrink-0 animate-fade-in">
          <div 
            id="section-sellers" 
            className="bg-white rounded-2xl border border-[#eef2f6] p-5 relative overflow-hidden flex flex-col justify-between text-center shrink-0 w-full shadow-sm" 
            style={{ height: '464px' }}
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#E8500A]/5 to-[#1A1D4E]/5 rounded-full blur-2xl pointer-events-none" />
            
            <div className="flex flex-col items-center">
              <div className="w-10 h-10 rounded-full bg-[#E8500A]/10 text-[#E8500A] flex items-center justify-center mb-3 border border-[#E8500A]/5 shrink-0 shadow-sm">
                <Sparkles className="w-5 h-5" />
              </div>
              
              <h3 className="font-sans text-sm font-semibold uppercase tracking-tight text-[#1A1D4E] leading-snug">
                For Business <span className="text-[#E8500A] italic">& Sellers</span>
              </h3>
              
              <p className="text-[11px] text-gray-400 font-semibold mt-2 px-1 leading-relaxed max-w-[220px]">
                Unlock exclusive tools, secure verified merchant badges, and scale your authentic local reach.
              </p>
            </div>

            <div className="border border-dashed border-[#E8500A]/20 bg-gradient-to-b from-[#FFF0E8]/20 to-white rounded-2xl p-4 text-center flex flex-col items-center justify-center my-2 flex-1">
              <h4 className="font-sans font-semibold text-gray-900 text-xs uppercase tracking-wider mb-1 leading-none">BOOST SALES TODAY</h4>
              <p className="text-[10px] text-gray-500 mb-4 leading-relaxed max-w-[210px] font-semibold">
                Gain entry to featured deal slots, exposure metrics, and buyer engagement streams.
              </p>
              
              <Link 
                to="/post-offer" 
                className="w-full py-2.5 bg-[#E8500A] hover:bg-[#CF4400] text-white font-semibold rounded-lg text-[10px] uppercase tracking-wider flex items-center justify-center gap-2 transition-colors shadow-sm cursor-pointer border-0"
              >
                POST OFFER <PenTool className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="flex items-center justify-center gap-1.5 text-[8.5px] font-semibold text-[#8a9bb0] uppercase font-mono tracking-widest shrink-0">
               <Users className="w-3.5 h-3.5 text-gray-400" /> 100k+ shopper log Daily
            </div>
          </div>

          {/* Sponsored Ad Section */}
          <ListingAdRail
            sponsoredPlacementKey={PLACEMENT_KEYS.SIDEBAR_PORTRAIT}
            sponsoredVariant="portrait"
            sponsoredDescription="New collection available from verified partners."
            showAdSense
            adSenseFormat="sidebar"
          />
        </aside>
      </div>

      {/* MAIN GRID */}
      <div className="max-w-[1600px] mx-auto px-6 md:px-10 mt-12 w-full">
        {filteredCategories.length === 0 ? (
          <div className="text-center py-24 bg-white rounded-[32px] border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <Search className="w-8 h-8 text-slate-300" />
            </div>
            <h3 className="text-2xl font-bold text-[#000435] mb-2">No categories found</h3>
            <p className="text-slate-500 font-medium">Try adjusting your search terms or browse all categories.</p>
            <button 
              onClick={() => setSearchQuery("")}
              className="mt-8 px-8 py-3 bg-[#000435] text-white rounded-xl font-bold hover:bg-[#FF5B00] transition-colors"
            >
              Clear Search
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <AnimatePresence>
              {filteredCategories.map((category, idx) => (
                <CategoryCard
                  key={category.id}
                  id={category.id}
                  title={category.name}
                  image={category.image}
                  count={category.itemCount}
                  items={category.subcategories}
                />
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* BOTTOM CTA */}
      <div className="max-w-[1600px] mx-auto px-6 md:px-10 mt-16">
        <div className="bg-[#000435] rounded-[32px] p-8 md:p-12 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#FF5B00]/20 rounded-full blur-[100px] transform translate-x-1/3 -translate-y-1/3" />
          
          <div className="relative z-10 max-w-2xl">
            <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-4">
              Can't find what you're looking for?
            </h2>
            <p className="text-slate-300 font-medium text-lg">
              Our complete catalog includes millions of items. Use our advanced search or browse all products.
            </p>
          </div>
          
          <div className="relative z-10 shrink-0">
            <Link 
              to="/products"
              className="inline-flex items-center justify-center px-8 py-4 bg-[#FF5B00] text-white rounded-2xl font-bold text-lg hover:bg-[#EB4501] transition-colors shadow-lg hover:shadow-xl hover:-translate-y-1 transform duration-200"
            >
              Browse All Products
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
