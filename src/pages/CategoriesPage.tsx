import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { CATEGORIES } from '../constants';
import * as LucideIcons from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';
import { QuickAccessCard } from '../components/QuickAccessCard';
import { useGlobalState } from '../context/GlobalStateContext';
import { CategoryCardSkeleton } from '../components/Skeleton';
import { DragScrollContainer, QuickFilterBar, ActiveFilterChips, FullSidebarFilterPanel, useRegisterPageFilters } from '../components/FilterEngine';

interface Subcategory {
  name: string;
  count: number;
  brands: number;
  icon: string;
}

interface CategoryItem {
  name: string;
  icon: string;
  count: number;
  color: string;
  subcategories: Subcategory[];
}

// Custom high-fidelity category icon helper with colors matching Homepage Popular Categories reference
const getCategoryIconComponent = (catName: string, iconName: string) => {
  const IconComponent = (LucideIcons as any)[iconName] || LucideIcons.Package;
  const name = catName.toLowerCase();
  
  let colorClass = "text-gray-500";
  if (name.includes('fashion')) colorClass = "text-blue-600";
  else if (name.includes('tech') || name.includes('electronics')) colorClass = "text-[#1A73E8]";
  else if (name.includes('family') || name.includes('kids')) colorClass = "text-blue-500";
  else if (name.includes('jewelry') || name.includes('accessories')) colorClass = "text-yellow-500";
  else if (name.includes('hobby') || name.includes('creativity') || name.includes('hobbies')) colorClass = "text-orange-500";
  else if (name.includes('travel') || name.includes('hospitality')) colorClass = "text-rose-500";
  else if (name.includes('beauty') || name.includes('personal care')) colorClass = "text-pink-500";
  else if (name.includes('eyewear') || name.includes('fragrance')) colorClass = "text-sky-500";
  else if (name.includes('mobile') || name.includes('wearable')) colorClass = "text-emerald-500";
  else if (name.includes('tv') || name.includes('appliance')) colorClass = "text-red-500";
  else if (name.includes('gaming') || name.includes('entertainment')) colorClass = "text-purple-500";
  else if (name.includes('home') || name.includes('living')) colorClass = "text-slate-500";
  else if (name.includes('vehicle') || name.includes('automotive')) colorClass = "text-blue-500";
  else if (name.includes('food') || name.includes('essential')) colorClass = "text-green-600";
  else if (name.includes('health') || name.includes('wellness')) colorClass = "text-emerald-500";
  else if (name.includes('education') || name.includes('learning')) colorClass = "text-indigo-600";
  
  return <IconComponent className={cn("w-5 h-5 stroke-[2]", colorClass)} />;
};

export function CategoriesPage() {
  const { mode } = useGlobalState();
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategoryTab, setActiveCategoryTab] = useState('All Categories');
  const [isBrandsCollapsed, setIsBrandsCollapsed] = useState(false);
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
    mode, searchQuery, activeCategoryTab, 
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
  };

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
        quickFilters={
          <QuickFilterBar
            title="Category Spec Discovery"
            onOpenFullFilters={() => {}}
            filters={[
              {
                id: 'all-categories',
                label: 'All Categories',
                active: !selectedCategoryStatus && !selectedCategoryType && !selectedAlphabetical && activeCategoryTab === 'All Categories',
                onClick: handleClearAllFilters
              },
              {
                id: 'trending-pill',
                label: '🔥 Trending',
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
                label: '💎 Popular',
                active: selectedCategoryStatus === 'popular' || activeCategoryTab === 'Popular',
                onClick: () => {
                  setSelectedCategoryStatus(selectedCategoryStatus === 'popular' ? null : 'popular');
                  setActiveCategoryTab(activeCategoryTab === 'Popular' ? 'All Categories' : 'Popular');
                }
              },
              {
                id: 'new-pill',
                label: '📅 New Arrivals',
                active: selectedCategoryStatus === 'newly-added' || activeCategoryTab === 'New Arrivals',
                onClick: () => {
                  setSelectedCategoryStatus(selectedCategoryStatus === 'newly-added' ? null : 'newly-added');
                  setActiveCategoryTab(activeCategoryTab === 'New Arrivals' ? 'All Categories' : 'New Arrivals');
                }
              },
              {
                id: 'a-z-pill',
                label: '🔤 Sort: A–Z',
                active: selectedAlphabetical === 'a-z',
                onClick: () => {
                  setSelectedAlphabetical(selectedAlphabetical === 'a-z' ? null : 'a-z');
                }
              },
              {
                id: 'z-a-pill',
                label: '🔤 Sort: Z–A',
                active: selectedAlphabetical === 'z-a',
                onClick: () => {
                  setSelectedAlphabetical(selectedAlphabetical === 'z-a' ? null : 'z-a');
                }
              }
            ]}
          />
        }
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
            <div className="bg-white border border-[#e8edf2] rounded-[5px] p-4.5 shadow-sm text-left font-sans">
              <h3 className="text-[11px] font-semibold text-[#8a9bb0] uppercase tracking-wider pb-2 border-b border-[#e8edf2] mb-3">Availability</h3>
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
                    {selectedAvailability === opt.value && <LucideIcons.Check size={11} className="text-orange-primary shrink-0" />}
                  </button>
                ))}
              </div>

              <h3 className="text-[11px] font-semibold text-[#8a9bb0] uppercase tracking-wider pb-2 border-b border-[#e8edf2] mt-4 mb-3">Content Availability</h3>
              <div className="space-y-1">
                {[
                  { value: 'brands', label: 'Has Brands' },
                  { value: 'creators', label: 'Has Creators' },
                  { value: 'recs', label: 'Has Recommendations' },
                  { value: 'favorites', label: 'Has Customer Favorites' }
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
                    {selectedContent === opt.value && <LucideIcons.Check size={11} className="text-orange-primary shrink-0" />}
                  </button>
                ))}
              </div>
            </div>
          </div>
        }
      >
        <div className="bg-white border border-[#e8edf2] rounded-[5px] p-4.5 shadow-sm text-left">
          <h3 className="text-[11px] font-semibold text-[#8a9bb0] uppercase tracking-wider pb-2 border-b border-[#e8edf2] mb-3">Category Type</h3>
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
                {selectedCategoryType === opt.value && <LucideIcons.Check size={11} className="text-orange-primary shrink-0" />}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-white border border-[#e8edf2] rounded-[5px] p-4.5 shadow-sm text-left">
          <h3 className="text-[11px] font-semibold text-[#8a9bb0] uppercase tracking-wider pb-2 border-b border-[#e8edf2] mb-3">Category Status</h3>
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
                {selectedCategoryStatus === opt.value && <LucideIcons.Check size={11} className="text-orange-primary shrink-0" />}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-white border border-[#e8edf2] rounded-[5px] p-4.5 shadow-sm text-left">
          <h3 className="text-[11px] font-semibold text-[#8a9bb0] uppercase tracking-wider pb-2 border-b border-[#e8edf2] mb-3">Alphabetical</h3>
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
                {selectedAlphabetical === opt.value && <LucideIcons.Check size={11} className="text-orange-primary shrink-0" />}
              </button>
            ))}
          </div>
        </div>
      </FullSidebarFilterPanel>
    );
  };

  const brandsYouFollow = [
    { name: "AARONG", sub: "Traditional Handcrafted Products", init: "AA", bg: "bg-[#452a1b]" },
    { name: "ADIDAS", sub: "Premium Athletic Wear", init: "AD", bg: "bg-black" },
    { name: "COCA-COLA", sub: "Refreshing Quality Beverages", init: "CC", bg: "bg-[#E31B23]" },
    { name: "STARBUCKS", sub: "Premium Coffee Blends", init: "SB", bg: "bg-[#00704A]" },
    { name: "YELLOW", sub: "Modern Apparel & Fashion", init: "YL", bg: "bg-[#E9C400]" },
    { name: "BATA SHOES", sub: "Premium Class Footwear", init: "BT", bg: "bg-[#C8102E]" }
  ];

  const categoriesList: CategoryItem[] = [
    { 
      name: 'Fashion & Lifestyle', 
      icon: 'Shirt', 
      count: 1240,
      color: 'from-orange-500 to-rose-500',
      subcategories: [
        { name: "Men's Fashion", count: 840, brands: 42, icon: 'Shirt' },
        { name: "Women's Fashion", count: 920, brands: 56, icon: 'ShoppingBag' },
        { name: "Kid's Wear", count: 320, brands: 24, icon: 'Baby' },
        { name: "Activewear", count: 410, brands: 18, icon: 'Dumbbell' },
        { name: "Footwear", count: 650, brands: 35, icon: 'Footprints' },
        { name: "Bags & Wallets", count: 280, brands: 15, icon: 'Briefcase' }
      ]
    },
    { 
      name: 'Jewelry & Accessories', 
      icon: 'Gem', 
      count: 270,
      color: 'from-amber-400 to-yellow-600',
      subcategories: [
        { name: "Necklaces", count: 120, brands: 10, icon: 'Gem' },
        { name: "Earrings", count: 80, brands: 8, icon: 'Gem' },
        { name: "Watches", count: 150, brands: 12, icon: 'Watch' }
      ]
    },
    { 
      name: 'Eyewear & Fragrances', 
      icon: 'Eye', 
      count: 180,
      color: 'from-sky-400 to-blue-600',
      subcategories: [
        { name: "Sunglasses", count: 100, brands: 8, icon: 'Glasses' },
        { name: "Perfumes", count: 80, brands: 6, icon: 'Wind' }
      ]
    },
    { 
      name: 'Beauty & Personal Care', 
      icon: 'Sparkles', 
      count: 920,
      color: 'from-pink-400 to-rose-600',
      subcategories: [
        { name: "Skin Care", count: 320, brands: 40, icon: 'Sparkles' },
        { name: "Hair Care", count: 210, brands: 25, icon: 'Sparkles' },
        { name: "Makeup", count: 450, brands: 30, icon: 'Sparkles' }
      ]
    },
    { 
      name: 'Tech & Electronics', 
      icon: 'Cpu', 
      count: 1100,
      color: 'from-indigo-500 to-violet-600',
      subcategories: [
        { name: "Computers", count: 450, brands: 20, icon: 'Laptop' },
        { name: "Audio", count: 320, brands: 15, icon: 'Headphones' },
        { name: "Cameras", count: 180, brands: 10, icon: 'Camera' }
      ]
    },
    { 
      name: 'Mobile & Wearable', 
      icon: 'Smartphone', 
      count: 850,
      color: 'from-emerald-500 to-teal-600',
      subcategories: [
        { name: "Smartphones", count: 540, brands: 15, icon: 'Smartphone' },
        { name: "Smartwatches", count: 210, brands: 10, icon: 'Watch' },
        { name: "Tablets", count: 100, brands: 8, icon: 'Tablet' }
      ]
    },
    { name: 'TV & Appliances', icon: 'Tv', count: 390, color: 'from-red-500 to-rose-700', subcategories: [] },
    { name: 'Gaming & Entertainment', icon: 'Gamepad2', count: 560, color: 'from-purple-500 to-indigo-700', subcategories: [] },
    { name: 'Home & Living', icon: 'Home', count: 640, color: 'from-slate-400 to-gray-600', subcategories: [] },
    { name: 'Vehicles & Automotive', icon: 'Car', count: 150, color: 'from-blue-500 to-cyan-700', subcategories: [] },
    { name: 'Family & Kids', icon: 'Baby', count: 320, color: 'from-pink-500 to-rose-400', subcategories: [] },
    { name: 'Food & Essentials', icon: 'ShoppingBasket', count: 1400, color: 'from-green-500 to-lime-600', subcategories: [] },
    { name: 'Travel & Hospitality', icon: 'Plane', count: 210, color: 'from-cyan-400 to-sky-600', subcategories: [] },
    { name: 'Hobbies & Creativity', icon: 'Palette', count: 190, color: 'from-amber-500 to-orange-700', subcategories: [] },
    { name: 'Health & Wellness', icon: 'Activity', count: 480, color: 'from-emerald-400 to-green-600', subcategories: [] },
    { name: 'Education & Learning', icon: 'BookOpen', count: 120, color: 'from-indigo-600 to-blue-700', subcategories: [] },
  ];

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
        if (norm === 'favorites') {
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

  const handleCategoryClick = (catName: string) => {
    setExpandedCategory(expandedCategory === catName ? null : catName);
  };

  useRegisterPageFilters({
    pageName: 'Categories',
    renderSearch: () => (
      <div className="relative">
        <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
          <LucideIcons.Search size={13} className="text-[#E8500A]" />
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search categories, subcategories..."
          className="w-full h-9 pl-8 pr-3 bg-white border border-[#e8edf2] rounded-[5px] text-[11px] font-semibold text-[#1A1D4E] placeholder-gray-400 focus:outline-none focus:border-[#E8500A]/50 transition-colors"
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
        label: '🔥 Trending',
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
        label: '💎 Popular',
        active: selectedCategoryStatus === 'popular' || activeCategoryTab === 'Popular',
        onClick: () => {
          setSelectedCategoryStatus(selectedCategoryStatus === 'popular' ? null : 'popular');
          setActiveCategoryTab(activeCategoryTab === 'Popular' ? 'All Categories' : 'Popular');
        }
      },
      {
        id: 'new-pill',
        label: '📅 New Arrivals',
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
        <div className="bg-white border border-[#e8edf2] rounded-[5px] p-4.5 shadow-sm text-left font-sans">
          <h3 className="text-[11px] font-semibold text-[#8a9bb0] uppercase tracking-wider pb-2 border-b border-[#e8edf2] mb-3">Availability</h3>
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
                {selectedAvailability === opt.value && <LucideIcons.Check size={11} className="text-orange-primary shrink-0" />}
              </button>
            ))}
          </div>

          <h3 className="text-[11px] font-semibold text-[#8a9bb0] uppercase tracking-wider pb-2 border-b border-[#e8edf2] mt-4 mb-3">Content Availability</h3>
          <div className="space-y-1">
            {[
              { value: 'brands', label: 'Has Brands' },
              { value: 'creators', label: 'Has Creators' },
              { value: 'recs', label: 'Has Recommendations' },
              { value: 'favorites', label: 'Has Customer Favorites' }
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
                {selectedContent === opt.value && <LucideIcons.Check size={11} className="text-orange-primary shrink-0" />}
              </button>
            ))}
          </div>
        </div>

        {/* Category Type */}
        <div className="bg-white border border-[#e8edf2] rounded-[5px] p-4.5 shadow-sm text-left">
          <h3 className="text-[11px] font-semibold text-[#8a9bb0] uppercase tracking-wider pb-2 border-b border-[#e8edf2] mb-3">Category Type</h3>
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
                {selectedCategoryType === opt.value && <LucideIcons.Check size={11} className="text-orange-primary shrink-0" />}
              </button>
            ))}
          </div>
        </div>

        {/* Category Status */}
        <div className="bg-white border border-[#e8edf2] rounded-[5px] p-4.5 shadow-sm text-left">
          <h3 className="text-[11px] font-semibold text-[#8a9bb0] uppercase tracking-wider pb-2 border-b border-[#e8edf2] mb-3">Category Status</h3>
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
                {selectedCategoryStatus === opt.value && <LucideIcons.Check size={11} className="text-orange-primary shrink-0" />}
              </button>
            ))}
          </div>
        </div>

        {/* Alphabetical */}
        <div className="bg-white border border-[#e8edf2] rounded-[5px] p-4.5 shadow-sm text-left">
          <h3 className="text-[11px] font-semibold text-[#8a9bb0] uppercase tracking-wider pb-2 border-b border-[#e8edf2] mb-3">Alphabetical</h3>
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
                {selectedAlphabetical === opt.value && <LucideIcons.Check size={11} className="text-orange-primary shrink-0" />}
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
    selectedContent
  ]);

  return (
    <div className="flex flex-col min-h-screen bg-choosify-feed">
      <div className="w-full relative overflow-hidden shrink-0 border-b border-white/5">
        {/* Background Gradients */}
        <div className="absolute inset-0 hero-gradient" />
        
        <div className="max-w-[1914px] mx-auto w-full h-[120px] md:h-[130px] lg:h-[160.5px] px-6 flex items-center justify-center text-center relative z-10 animate-fade-in">
          <div className="w-full flex flex-col justify-center">
            {mode === 'wholesale' ? (
              <h1 className="text-[20px] md:text-[24px] lg:text-[28px] font-black uppercase tracking-tighter mb-1.5 leading-none">
                <span className="text-white not-italic">B2B Product Category</span> <span className="text-[#FF5B00] not-italic">HUB</span>
              </h1>
            ) : (
              <h1 className="text-[20px] md:text-[24px] lg:text-[28px] font-black uppercase tracking-tighter mb-1.5 leading-none">
                <span className="text-white not-italic">EXPLORATION</span> <span className="text-orange-primary not-italic">HUB</span>
              </h1>
            )}
   
            {/* Product Name Marquee */}
            <div className="w-full overflow-hidden mb-1.5 py-0.5 border-y border-white/5 relative">
              <motion.div 
                 animate={{ x: [0, -1500] }}
                 transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
                 className="flex whitespace-nowrap gap-8"
              >
                 {[
                   'Wireless Earbuds', 'Smart Watch', 'Gaming Laptop', 'Noise Cancelling Headphones', 
                   '4K Drone', 'Mechanical Keyboard', 'DSLR Camera', 'Portable Speaker', 
                   'Fitness Tracker', 'Power Bank'
                 ].map((name, i) => (
                   <span 
                     key={i} 
                     className={cn(
                       "text-base lg:text-xl font-black italic uppercase tracking-tighter transition-all duration-500 cursor-default",
                       "text-white/10",
                       "hover:text-orange-primary hover:scale-110"
                     )}
                   >
                      {name}
                   </span>
                 ))}
                 {/* Loop Duplicate */}
                 {[
                   'Wireless Earbuds', 'Smart Watch', 'Gaming Laptop', 'Noise Cancelling Headphones', 
                   '4K Drone', 'Mechanical Keyboard', 'DSLR Camera', 'Portable Speaker', 
                   'Fitness Tracker', 'Power Bank'
                 ].map((name, i) => (
                   <span 
                     key={`dup-${i}`} 
                     className={cn(
                       "text-base lg:text-xl font-black italic uppercase tracking-tighter transition-all duration-500 cursor-default",
                       "text-white/10",
                       "hover:text-orange-primary hover:scale-110"
                     )}
                   >
                      {name}
                   </span>
                 ))}
              </motion.div>
            </div>
   
            <p className="text-white/70 max-w-2xl mx-auto font-bold italic text-[8px] lg:text-[9.5px] mb-0 uppercase tracking-[0.2em] opacity-80 leading-normal">
              DISCOVER PREMIUM PRODUCTS, OFFICIAL STORES, AND BEST DEALS ACROSS BANGLADESH.
            </p>
          </div>
        </div>
      </div>

      {/* PAGE SEARCH BAR — static, not sticky */}
      <div className="w-full bg-white border-b border-[#E8EDF2] py-3">
        <div className="max-w-[1440px] mx-auto px-6">
          <div className="relative w-full max-w-2xl mx-auto bg-gray-50/50 p-1 rounded-full border border-gray-200/80 shadow-inner focus-within:border-[#E8500A]/30 transition-all duration-300">
            <div className="flex items-center bg-white rounded-full">
              <div className="pl-4 text-[#E8500A] shrink-0">
                <LucideIcons.Search className="w-4 h-4" />
              </div>
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by Brand Name or Category..." 
                className="w-full h-10 bg-transparent outline-none pl-3 pr-24 text-navy text-xs font-semibold placeholder-gray-500 focus:outline-none focus:ring-0 border-none animate-none" 
              />
              <button 
                onClick={() => setSearchQuery(searchQuery)}
                className="absolute right-1.5 top-1.5 bottom-1.5 px-5 rounded-full bg-gradient-to-r from-[#FF5B00] to-[#E8500A] hover:from-[#E8500A] hover:to-[#CF4400] text-white text-[9px] font-black tracking-widest uppercase flex items-center gap-1.5 shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 cursor-pointer border-0"
              >
                Search
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ACTIVE FILTER CHIPS ROW */}
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

      <div className="max-w-[1440px] mx-auto px-4 py-5 w-full grid grid-cols-1 lg:grid-cols-[240px_minmax(0,1fr)_260px] xl:grid-cols-[280px_minmax(0,1fr)_310px] gap-4 relative">
        {/* LEFT COLUMN: FULL FILTER PANEL */}
        <aside className="hidden lg:flex flex-col gap-4 lg:sticky lg:top-24 pb-10 pr-2 flex-shrink-0 animate-fade-in">
          {/* LEFT COLUMN SEARCH BAR */}
          <div className="relative">
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
              <LucideIcons.Search size={13} className="text-[#E8500A]" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search categories, subcategories..."
              className="w-full h-9 pl-8 pr-3 bg-white border border-[#e8edf2] rounded-[5px] text-[11px] font-semibold text-[#1A1D4E] placeholder-gray-400 focus:outline-none focus:border-[#E8500A]/50 transition-colors shadow-sm"
            />
          </div>

          <QuickAccessCard />
          <div id="categories-sidebar-filters" className="transition-all duration-300 rounded-[5px] w-full">
            {renderFilterPanel()}
          </div>
        </aside>

        <div id="categories-main-display" className="scroll-mt-36 min-w-0 pb-10">
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 justify-items-center justify-center w-full">
              {Array.from({ length: 12 }).map((_, idx) => (
                <CategoryCardSkeleton key={idx} />
              ))}
            </div>
          ) : (
            <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 justify-items-center justify-center w-full">
              {filteredCategoriesList.map((cat, i) => {
                const IconComponent = (LucideIcons as any)[cat.icon] || LucideIcons.Package;
                const isExpanded = expandedCategory === cat.name;
                
                return (
                  <React.Fragment key={cat.name}>
                    <motion.div 
                      layout="position"
                      onClick={() => handleCategoryClick(cat.name)}
                      className={cn(
                        "bg-white border rounded-[5px] p-4 flex flex-col items-start transition-all duration-200 cursor-pointer group relative overflow-hidden w-full lg:w-[237.328px]",
                        isExpanded 
                          ? "border-[#E8500A] ring-4 ring-[#E8500A]/5 z-20 shadow-sm" 
                          : "border-[#e8edf2] hover:border-gray-200/90 hover:scale-[1.01]"
                      )}
                    >
                      {/* Perfect white circle around the icon styled like mockup */}
                      <div className="w-9 h-9 bg-gray-50 rounded-full flex items-center justify-center mb-4 shrink-0">
                        {getCategoryIconComponent(cat.name, cat.icon)}
                      </div>
                      
                      <div className="w-full text-left">
                        <h4 className="font-medium text-xs text-[#1a1a2e] group-hover:text-[#E8500A] transition-colors leading-tight mb-1 uppercase tracking-tight">
                          {cat.name}
                        </h4>
                        <p className="text-[10px] text-red-500 font-semibold leading-none uppercase font-mono">
                          {cat.count} Products
                        </p>
                      </div>
                    
                    {isExpanded && (
                      <motion.div 
                        layoutId="arrow"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-4 h-4 bg-white rotate-45 border-r border-b border-[#e8edf2]"
                      />
                    )}
                  </motion.div>

                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        layout
                        initial={{ opacity: 0, height: 0, marginTop: 0 }}
                        animate={{ opacity: 1, height: 'auto', marginTop: 16 }}
                        exit={{ opacity: 0, height: 0, marginTop: 0 }}
                        transition={{ 
                          height: { duration: 0.4, ease: [0.04, 0.62, 0.23, 0.98] },
                          opacity: { duration: 0.3 }
                        }}
                        className="col-span-1 sm:col-span-2 lg:col-span-full xl:col-span-full bg-white shadow-md rounded-[5px] p-6 md:p-8 border border-[#e8edf2] overflow-hidden z-10 text-left"
                      >
                        <motion.div 
                          initial={{ y: 20, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          transition={{ delay: 0.1 }}
                          className="flex items-center justify-between pb-4 mb-6 border-b border-gray-100"
                        >
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center shrink-0">
                              {getCategoryIconComponent(cat.name, cat.icon)}
                            </div>
                            <div className="text-left">
                              <h2 className="text-base font-semibold text-[#1a1a2e] uppercase tracking-tight">
                                {cat.name} <span className="text-[#E8500A]">SUBCATEGORIES</span>
                              </h2>
                              <p className="text-[10px] text-[#8a9bb0] font-semibold uppercase tracking-[0.2em] mt-1">
                                {cat.count} Products Across {Math.floor(cat.count/15)} Brands - Curated Recommendations
                              </p>
                            </div>
                          </div>
                          
                          {/* Easy closing interactive trigger */}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setExpandedCategory(null);
                            }}
                            className="w-8 h-8 rounded-full border border-[#e8edf2] hover:border-[#E8500A]/30 flex items-center justify-center text-gray-400 hover:text-[#E8500A] transition-all hover:scale-105 active:scale-95 cursor-pointer bg-white"
                            aria-label="Close subcategories"
                          >
                            <LucideIcons.X className="w-4 h-4" />
                          </button>
                        </motion.div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                          {cat.subcategories.length > 0 ? (
                            cat.subcategories.map((sub, j) => {
                              return (
                                <motion.div
                                  initial={{ opacity: 0, scale: 0.95 }}
                                  animate={{ opacity: 1, scale: 1 }}
                                  transition={{ delay: 0.1 + (j * 0.03), duration: 0.3 }}
                                  key={sub.name}
                                  className="bg-white border border-[#e8edf2] rounded-[5px] p-4 flex flex-col items-start hover:border-gray-200/90 hover:scale-[1.01] transition-all duration-200 cursor-pointer group text-left"
                                >
                                  {/* Redesigned to use identical radius, borders, and rounded circular icons as popular categories */}
                                  <div className="w-9 h-9 bg-gray-50 rounded-full flex items-center justify-center mb-4 shrink-0">
                                    {getCategoryIconComponent(sub.name, sub.icon)}
                                  </div>
                                  
                                  <div className="w-full text-left">
                                    <h4 className="font-medium text-xs text-[#1a1a2e] group-hover:text-[#E8500A] transition-colors leading-tight mb-1 uppercase tracking-tight">
                                      {sub.name}
                                    </h4>
                                    <p className="text-[10px] text-red-500 font-semibold leading-none uppercase font-mono mt-1">
                                      {sub.count} Products • {sub.brands} Brands
                                    </p>
                                    <p className="text-[9px] text-[#8a9bb0] font-medium leading-none uppercase mt-1.5">
                                      Verified Options
                                    </p>
                                  </div>
                                </motion.div>
                              );
                            })
                          ) : (
                            <div className="col-span-full py-12 text-center">
                              <LucideIcons.Construction className="mx-auto text-gray-200 mb-4" size={48} />
                              <p className="text-gray-400 font-bold uppercase text-[10px] tracking-[0.4em]">Subcategories coming soon</p>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </React.Fragment>
              );
            })}
          </motion.div>
        )}
        </div>

        {/* RIGHT COLUMN: FOR BUSINESS & SELLERS CARD & SPONSORED AD */}
        <aside className="hidden lg:flex flex-col gap-4 lg:sticky lg:top-24 pb-10 pr-2 flex-shrink-0 animate-fade-in">
          <div 
            id="section-sellers" 
            className="bg-white rounded-[5px] border border-[#e8edf2] p-5 relative overflow-hidden flex flex-col justify-between text-center shrink-0 w-full shadow-sm" 
            style={{ height: '464px' }}
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#E8500A]/5 to-[#1A1D4E]/5 rounded-full blur-2xl pointer-events-none" />
            
            <div className="flex flex-col items-center">
              <div className="w-10 h-10 rounded-full bg-[#E8500A]/10 text-[#E8500A] flex items-center justify-center mb-3 border border-[#E8500A]/5 shrink-0 shadow-sm">
                <LucideIcons.Sparkles className="w-5 h-5" />
              </div>
              
              <h3 className="font-sans text-sm font-semibold uppercase tracking-tight text-[#1A1D4E] leading-snug">
                For Business <span className="text-[#E8500A] italic">& Sellers</span>
              </h3>
              
              <p className="text-[11px] text-gray-400 font-semibold mt-2 px-1 leading-relaxed max-w-[220px]">
                Unlock exclusive tools, secure verified merchant badges, and scale your authentic local reach.
              </p>
            </div>

            <div className="border border-dashed border-[#E8500A]/20 bg-gradient-to-b from-[#FFF0E8]/20 to-white rounded-[5px] p-4 text-center flex flex-col items-center justify-center my-2 flex-1">
              <h4 className="font-sans font-semibold text-gray-900 text-xs uppercase tracking-wider mb-1 leading-none">BOOST SALES TODAY</h4>
              <p className="text-[10px] text-gray-500 mb-4 leading-relaxed max-w-[210px] font-semibold">
                Gain entry to wholesale deals slots, exposure metrics, and buyer engagement streams.
              </p>
              
              <Link 
                to="/post-offer" 
                className="w-full py-2.5 bg-[#E8500A] hover:bg-[#CF4400] text-white font-semibold rounded-lg text-[10px] uppercase tracking-wider flex items-center justify-center gap-2 transition-colors shadow-sm cursor-pointer border-0"
              >
                POST OFFER <LucideIcons.PenTool className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="flex items-center justify-center gap-1.5 text-[8.5px] font-semibold text-[#8a9bb0] uppercase font-mono tracking-widest shrink-0">
               <LucideIcons.Users className="w-3.5 h-3.5 text-gray-400" /> 100k+ shopper log Daily
            </div>
          </div>

          {/* Sponsored Ad Section */}
          <div className="bg-white rounded-[5px] border border-[#e8edf2] p-4.5 shadow-sm text-[#1a1a2e] text-center relative overflow-hidden w-full">
             <div className="relative z-10 flex flex-col">
                <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#e8edf2] px-1">
                  <h3 className="text-[11px] font-semibold text-[#8a9bb0] uppercase tracking-wider">Sponsored Ad</h3>
                </div>
                
                <div className="w-full aspect-video rounded-[5px] overflow-hidden mb-4 border border-[#e8edf2] shadow-inner shrink-0">
                   <img 
                      src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&h=350&fit=crop" 
                      alt="Sponsor AD" 
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-[2s]"
                   />
                </div>
                
                <h4 className="font-sans text-xs font-semibold text-[#1a1a2e] uppercase tracking-wider mb-0.5">AARONG</h4>
                <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide mb-3">Heritage Shopping Brand</p>
                
                <p className="text-[11px] text-gray-500 font-medium leading-relaxed mb-4 px-1">
                   New Collection Available. Free Delivery Overall Dhaka On Purchase Above BDT 1500
                </p>
                
                <button className="w-full py-2.5 bg-[#E8500A] hover:bg-[#CF4400] text-white font-semibold rounded-lg text-[10px] uppercase tracking-wider flex items-center justify-center gap-2 transition-colors shadow-sm cursor-pointer border-0">
                   Shop Now
                </button>
             </div>
          </div>
        </aside>
      </div>

      {/* Mobile / Tablet Filter Drawer */}
      <AnimatePresence>
        {isMobileDrawerOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileDrawerOpen(false)}
              className="fixed inset-0 bg-black/60 z-50 lg:hidden"
            />
            {/* Drawer Panel */}
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 left-0 bottom-0 w-4/5 max-w-xs bg-[#F0F4F9] z-50 p-5 overflow-y-auto lg:hidden shadow-2xl flex flex-col gap-4 text-left font-sans"
            >
              <div className="flex items-center justify-between pb-3 border-b border-gray-200">
                <span className="text-[11px] font-black uppercase tracking-wider text-navy">Discovery Filters</span>
                <button
                  type="button"
                  onClick={() => setIsMobileDrawerOpen(false)}
                  className="w-8 h-8 rounded-full border border-gray-200 hover:border-orange-primary flex items-center justify-center text-gray-400 hover:text-orange-primary bg-white cursor-pointer"
                >
                  <LucideIcons.X className="w-4 h-4" />
                </button>
              </div>
              <div className="flex-1 pb-10">
                {renderFilterPanel()}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
