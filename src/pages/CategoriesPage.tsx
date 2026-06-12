import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { CATEGORIES } from '../constants';
import * as LucideIcons from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';
import { useGlobalState } from '../context/GlobalStateContext';
import { CategoryCardSkeleton } from '../components/Skeleton';

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

  // Simulated content refresh loader
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 600);
    return () => clearTimeout(timer);
  }, [mode, searchQuery]);

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

  const handleCategoryClick = (catName: string) => {
    setExpandedCategory(expandedCategory === catName ? null : catName);
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#F0F4F9]">
      <div className="w-full bg-[#0A0A1F] px-6 py-10 md:py-12 relative overflow-hidden flex items-center justify-center">
        {/* Background Gradients */}
        <div className="absolute inset-0 hero-gradient opacity-95" />
        <div className="absolute top-0 right-0 w-1/3 h-full bg-orange-primary/5 blur-[120px] rounded-full translate-x-1/2 -translate-y-1/2" />
        
        <div className="max-w-7xl mx-auto text-center relative z-10 w-full">
          {mode === 'wholesale' ? (
            <h1 className="text-[28px] md:text-[36px] font-black uppercase tracking-tighter mb-2 leading-none">
              <span className="text-white not-italic">B2B Product Category</span> <span className="text-[#FF5B00] not-italic">HUB</span>
            </h1>
          ) : (
            <h1 className="text-[28px] md:text-[36px] font-black uppercase tracking-tighter mb-2 leading-none">
              <span className="text-white not-italic">EXPLORATION</span> <span className="text-orange-primary not-italic">HUB</span>
            </h1>
          )}
 
          {/* Product Name Marquee */}
          <div className="w-full overflow-hidden mb-3 py-1.5 border-y border-white/5 relative">
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
                     "text-2xl font-black italic uppercase tracking-tighter transition-all duration-500 cursor-default",
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
                     "text-2xl font-black italic uppercase tracking-tighter transition-all duration-500 cursor-default",
                     "text-white/10",
                     "hover:text-orange-primary hover:scale-110"
                   )}
                 >
                    {name}
                 </span>
               ))}
            </motion.div>
          </div>
 
          <p className="text-white/70 max-w-2xl mx-auto font-bold italic text-[9px] md:text-[10.5px] mb-1 uppercase tracking-[0.2em] opacity-80 leading-relaxed">
            DISCOVER PREMIUM PRODUCTS, OFFICIAL STORES, AND BEST DEALS ACROSS BANGLADESH.
          </p>
        </div>
      </div>

      {/* GLOBAL STICKY NAVIGATION SYSTEM */}
      <div className="sticky top-[80px] z-30 bg-white/95 backdrop-blur-md border-b border-gray-150 shadow-sm py-4 transition-all duration-300">
        <div className="max-w-[1440px] mx-auto px-6 flex flex-col gap-4">
          
          {/* 1. Search Bar inside Sticky Container */}
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

          {/* 2. Navigation Tabs */}
          <div className="flex items-center justify-start md:justify-center gap-1.5 md:gap-3 overflow-x-auto no-scrollbar py-1 text-[10px] font-black uppercase tracking-wider">
            {[
              { label: "All Categories", icon: <LucideIcons.Layers size={13} /> },
              { label: "Popular", icon: <LucideIcons.Flame size={13} /> },
              { label: "Trending", icon: <LucideIcons.TrendingUp size={13} /> },
              { label: "New Arrivals", icon: <LucideIcons.Clock size={13} /> },
              { label: "Top Rated", icon: <LucideIcons.Award size={13} /> }
            ].map((tab) => (
              <button
                key={tab.label}
                onClick={() => {
                  setActiveCategoryTab(tab.label);
                  const resultsDiv = document.getElementById("categories-main-display");
                  if (resultsDiv) {
                    const offset = 220; // top header offset
                    const elementPosition = resultsDiv.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - offset;
                    window.scrollTo({
                      top: offsetPosition,
                      behavior: "smooth"
                    });
                  }
                }}
                className={cn(
                  "px-5 py-2.5 rounded-full transition-all shrink-0 cursor-pointer flex items-center gap-1.5 font-black uppercase tracking-wider text-[10px] border",
                  activeCategoryTab === tab.label
                    ? "bg-[#E8500A] border-transparent text-white shadow-md shadow-[#E8500A]/10 italic"
                    : "bg-white border-gray-200 text-gray-400 hover:text-navy hover:bg-gray-50"
                )}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            ))}
          </div>

        </div>
      </div>


      <div className="max-w-[1440px] mx-auto px-6 py-10 w-full flex flex-col lg:flex-row gap-10 lg:gap-12 xl:gap-16 2xl:gap-24 relative">
        {/* LEFT COLUMN: QUICK HIGHWAYS ASIDE COLUMN */}
        <aside className="hidden lg:flex flex-col gap-4 w-[300px] flex-shrink-0 sticky top-24 h-[calc(100vh-120px)] overflow-y-auto pb-10 pr-2 no-scrollbar">
          {/* QUICK ACCESS CARD */}
          <div 
            className="bg-white rounded-2xl border border-[#e8edf2] p-4.5 shadow-sm w-full"
          >
            <div className="flex items-center gap-1 pb-3 mb-4 border-b border-[#e8edf2] px-1">
              <h3 className="text-[11px] font-semibold text-[#8a9bb0] uppercase tracking-wider">
                QUICK ACCESS
              </h3>
            </div>
            <div className="space-y-3.5 text-left">
              {[
                { 
                  to: '/products', 
                  icon: (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-[18px] h-[18px] transform transition-transform group-hover:scale-105">
                      <path d="M12 4.5L6.5 12.5H17.5L12 4.5Z" fill="#FF5B00" />
                      <rect x="6" y="14" width="5.5" height="5.5" rx="0.5" fill="#FF5B00" />
                      <circle cx="15.5" cy="16.7" r="2.8" fill="#FF5B00" />
                    </svg>
                  ), 
                  label: 'ALL PRODUCT' 
                },
                { 
                  to: '/categories', 
                  icon: (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-[18px] h-[18px] transform transition-transform group-hover:scale-105">
                      <rect x="5" y="5" width="6" height="6" rx="1.5" fill="#FF5B00" />
                      <rect x="13" y="5" width="6" height="6" rx="1.5" fill="#FF5B00" />
                      <rect x="5" y="13" width="6" height="6" rx="1.5" fill="#FF5B00" />
                      <rect x="13" y="13" width="6" height="6" rx="1.5" fill="#FF5B00" />
                    </svg>
                  ), 
                  label: 'CATEGORIES' 
                },
                { 
                  to: '/brands', 
                  icon: (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-[18px] h-[18px] transform transition-transform group-hover:scale-105">
                      <circle cx="8.5" cy="12" r="4.2" stroke="#FF5B00" strokeWidth="2.5" fill="none" />
                      <circle cx="8.5" cy="12" r="1.2" fill="#000435" />
                      <circle cx="15.5" cy="12" r="4.2" stroke="#FF5B00" strokeWidth="2.5" fill="none" />
                      <circle cx="15.5" cy="12" r="1.2" fill="#000435" />
                    </svg>
                  ), 
                  label: 'ALL BRANDS' 
                },
                { 
                  to: '/guides', 
                  icon: (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-[18px] h-[18px] transform transition-transform group-hover:scale-105">
                      <rect x="4" y="6" width="16" height="11" rx="1.5" stroke="#FF5B00" strokeWidth="2.2" fill="none" />
                      <line x1="4" y1="11.5" x2="20" y2="11.5" stroke="#FF5B00" strokeWidth="2" />
                      <line x1="12" y1="6" x2="12" y2="17" stroke="#FF5B00" strokeWidth="2" />
                      <rect x="6" y="8" width="4" height="2" fill="#FF5B00" rx="0.5" />
                      <path d="M10 17L9 20H15L14 17" stroke="#FF5B00" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  ), 
                  label: 'RECOMMENDATIONS' 
                },
                { 
                  to: '/compare', 
                  icon: (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-[18px] h-[18px] transform transition-transform group-hover:scale-105">
                      <rect x="5.5" y="5.5" width="5.5" height="5.5" rx="1.2" fill="#FF5B00" />
                      <circle cx="16.5" cy="16.5" r="3" fill="#FF5B00" />
                      <path d="M16.5 11.5V7.5H12.5" stroke="#FF5B00" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                      <path d="M14.5 9.5L12.5 7.5L14.5 5.5" stroke="#FF5B00" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                      <path d="M7.5 12.5V16.5H11.5" stroke="#FF5B00" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                      <path d="M9.5 14.5L11.5 16.5L9.5 18.5" stroke="#FF5B00" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                    </svg>
                  ), 
                  label: 'COMPARE' 
                },
                { 
                  to: '/deals', 
                  icon: (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-[18px] h-[18px] transform transition-transform group-hover:scale-105">
                      <path d="M12.5 4.5H18.5C19.1 4.5 19.5 4.9 19.5 5.5V11.5C19.5 11.8 19.4 12.0 19.2 12.2L11.7 19.7C11.3 20.1 10.7 20.1 10.3 19.7L5.3 14.7C4.9 14.3 4.9 13.7 5.3 13.3L12.8 5.8C13.0 5.6 13.2 5.5 13.5 5.5" stroke="#FF5B00" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="#FF5B00" />
                      <circle cx="15.5" cy="8.5" r="1.5" fill="white" />
                    </svg>
                  ), 
                  label: 'DEALS' 
                },
              ].map((link, lidx) => (
                <Link 
                  key={lidx} 
                  to={link.to} 
                  className="flex items-center justify-between py-1 group transition-all duration-300"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full border border-[#e8edf2] flex items-center justify-center bg-white shadow-inner group-hover:scale-105 group-hover:border-orange-primary/20 transition-all duration-300 shrink-0">
                      {link.icon}
                    </div>
                    <span className="font-sans text-xs text-navy uppercase tracking-wide group-hover:text-orange-primary transition-colors duration-300 font-semibold">{link.label}</span>
                  </div>
                  <span className="px-2.5 py-0.5 bg-[#D6E1EC]/30 text-navy/70 text-[9px] font-mono font-semibold rounded-full leading-none">550</span>
                </Link>
              ))}
            </div>
          </div>

          {/* BRANDS YOU FOLLOW CARD */}
          <div className="bg-white rounded-2xl border border-[#e8edf2] p-4.5 shadow-sm w-full">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#e8edf2] px-1">
              <h3 className="text-[11px] font-semibold text-[#8a9bb0] uppercase tracking-wider">BRANDS YOU FOLLOW</h3>
              <span className="px-2 py-0.5 bg-orange-primary/10 rounded-full text-[#E8500A] font-semibold text-[9px] tracking-wide uppercase">
                 6 active
              </span>
            </div>

            <div className="space-y-3.5">
              {(isBrandsCollapsed ? brandsYouFollow.slice(0, 3) : brandsYouFollow).map((brand, bidx) => (
                <div key={bidx} className="flex items-center gap-3 text-left">
                  <div className={cn("w-9 h-9 rounded-full flex items-center justify-center text-white font-semibold text-xs shrink-0 shadow-sm border border-black/5 uppercase", brand.bg)}>
                    {brand.init}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h4 className="font-sans text-xs font-semibold text-[#1A1D4E] uppercase truncate leading-tight">{brand.name}</h4>
                    <p className="text-[10px] text-gray-400 font-sans tracking-tight truncate leading-normal">{brand.sub}</p>
                  </div>
                </div>
              ))}
            </div>

            <button 
              onClick={() => setIsBrandsCollapsed(!isBrandsCollapsed)}
              className="w-full flex items-center justify-center gap-1.5 mt-4 pt-3 border-t border-gray-100 text-[10px] font-semibold uppercase tracking-wider text-[#E8500A] hover:text-[#CF4400] transition-colors cursor-pointer"
            >
              {isBrandsCollapsed ? "Expand List" : "Collapse List"}
              {isBrandsCollapsed ? <LucideIcons.ChevronDown className="w-3.5 h-3.5" /> : <LucideIcons.ChevronUp className="w-3.5 h-3.5" />}
            </button>
          </div>
        </aside>

        <div id="categories-main-display" className="scroll-mt-36 flex-1 min-w-0 lg:sticky lg:top-24 lg:h-[calc(100vh-120px)] lg:overflow-y-auto pb-10 pr-2">
          {isLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-[repeat(auto-fill,237.328px)] xl:grid-cols-[repeat(auto-fill,237.328px)] gap-4 justify-start">
              {Array.from({ length: 12 }).map((_, idx) => (
                <CategoryCardSkeleton key={idx} />
              ))}
            </div>
          ) : (
            <motion.div layout className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-[repeat(auto-fill,237.328px)] xl:grid-cols-[repeat(auto-fill,237.328px)] gap-4 justify-start">
              {categoriesList.map((cat, i) => {
                const IconComponent = (LucideIcons as any)[cat.icon] || LucideIcons.Package;
                const isExpanded = expandedCategory === cat.name;
                
                return (
                  <React.Fragment key={cat.name}>
                    <motion.div 
                      layout="position"
                      onClick={() => handleCategoryClick(cat.name)}
                      className={cn(
                        "bg-white border rounded-xl p-4 flex flex-col items-start transition-all duration-200 cursor-pointer group relative overflow-hidden w-full lg:w-[237.328px]",
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
                        className="col-span-2 md:col-span-3 lg:col-span-full xl:col-span-full bg-white shadow-md rounded-2xl p-6 md:p-8 border border-[#e8edf2] overflow-hidden z-10 text-left"
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
                                  className="bg-white border border-[#e8edf2] rounded-xl p-4 flex flex-col items-start hover:border-gray-200/90 hover:scale-[1.01] transition-all duration-200 cursor-pointer group text-left"
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
        <aside className="hidden lg:flex flex-col gap-4 w-[280px] flex-shrink-0 sticky top-24 h-[calc(100vh-120px)] overflow-y-auto pb-10 pr-2 no-scrollbar">
          <div 
            id="section-sellers" 
            className="bg-white rounded-2xl border border-[#e8edf2] p-5 relative overflow-hidden flex flex-col justify-between text-center shrink-0 w-full shadow-sm" 
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

            <div className="border border-dashed border-[#E8500A]/20 bg-gradient-to-b from-[#FFF0E8]/20 to-white rounded-xl p-4 text-center flex flex-col items-center justify-center my-2 flex-1">
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
          <div className="bg-white rounded-2xl border border-[#e8edf2] p-4.5 shadow-sm text-[#1a1a2e] text-center relative overflow-hidden w-full">
             <div className="relative z-10 flex flex-col">
                <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#e8edf2] px-1">
                  <h3 className="text-[11px] font-semibold text-[#8a9bb0] uppercase tracking-wider">Sponsored Ad</h3>
                </div>
                
                <div className="w-full aspect-video rounded-xl overflow-hidden mb-4 border border-[#e8edf2] shadow-inner shrink-0">
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
    </div>
  );
}
