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

export function CategoriesPage() {
  const { mode } = useGlobalState();
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
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
      <div className="w-full bg-[#0A0A1F] px-8 relative overflow-hidden flex items-center justify-center" style={{ height: '303px' }}>
        {/* Background Gradients */}
        {mode === 'wholesale' ? (
          <div className="absolute inset-0 bg-gradient-to-r from-[#FF5B00]/30 via-[#EB4501]/10 to-[#0A0A1F] opacity-90" />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-r from-[#4A1D1D] via-[#0A0A1F] to-[#0A0A1F] opacity-80" />
        )}
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
 
          <p className="text-white/70 max-w-2xl mx-auto font-bold italic text-[9px] md:text-[10.5px] mb-3 uppercase tracking-[0.2em] opacity-80 leading-relaxed">
            DISCOVER PREMIUM PRODUCTS, OFFICIAL STORES, AND BEST DEALS ACROSS BANGLADESH.
          </p>
 
          <div className="max-w-md mx-auto relative group">
             <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                <div className="flex gap-1 opacity-80">
                   <div className="w-4 h-4 rounded-full border-2 border-orange-primary/40 flex items-center justify-center">
                     <div className="w-1.5 h-1.5 bg-orange-primary rounded-full group-hover:scale-150 transition-transform" />
                   </div>
                   <div className="w-4 h-4 rounded-full border-2 border-orange-primary/40 flex items-center justify-center">
                     <div className="w-1.5 h-1.5 bg-orange-primary rounded-full group-hover:scale-150 transition-transform" />
                   </div>
                </div>
             </div>
             <input 
              type="text" 
              placeholder="Search by Brand Name or Category..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-11 pl-18 pr-6 rounded-full bg-gradient-to-r from-[#000A2A] to-[#0A0A1F] text-white border border-white/10 focus:outline-none focus:border-orange-primary/40 transition-all font-bold placeholder:text-white/20 shadow-3xl text-[11px] italic tracking-wide" 
             />
          </div>
        </div>
      </div>


      <div className="max-w-[1440px] mx-auto px-6 py-10 w-full flex flex-col lg:flex-row gap-10 lg:gap-12 xl:gap-16 2xl:gap-24 relative">
        {/* LEFT COLUMN: QUICK HIGHWAYS ASIDE COLUMN */}
        <aside className="hidden lg:flex flex-col gap-6 w-[300px] flex-shrink-0 sticky top-24 h-[calc(100vh-120px)] overflow-y-auto pb-10 pr-2 no-scrollbar">
          {/* QUICK ACCESS CARD */}
          <div 
            className="bg-white rounded-[24px] border border-gray-100 p-6 shadow-[0_10px_30px_rgba(26,29,78,0.02)] w-full"
          >
            <div className="flex items-center gap-1.5 pb-4 mb-5 border-b border-gray-100 px-1">
              <span className="text-xl font-black tracking-wider text-orange-primary uppercase font-sans">QUICK</span>
              <span className="text-xl font-black tracking-wider text-navy uppercase font-sans">ACCESS</span>
            </div>
            <div className="space-y-4 text-left">
              {[
                { 
                  to: '/products', 
                  icon: (
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-[22px] h-[22px] transform transition-transform group-hover:scale-105">
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
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-[22px] h-[22px] transform transition-transform group-hover:scale-105">
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
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-[22px] h-[22px] transform transition-transform group-hover:scale-105">
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
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-[22px] h-[22px] transform transition-transform group-hover:scale-105">
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
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-[22px] h-[22px] transform transition-transform group-hover:scale-105">
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
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-[22px] h-[22px] transform transition-transform group-hover:scale-105">
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
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-full border border-gray-100 flex items-center justify-center bg-white shadow-soft group-hover:scale-105 group-hover:border-orange-primary/30 transition-all duration-300 shrink-0">
                      {link.icon}
                    </div>
                    <span className={cn(
                      "font-sans text-xs text-navy uppercase tracking-wide group-hover:text-orange-primary transition-colors duration-300",
                      lidx === 2 ? "font-bold" : "font-extrabold"
                    )}>{link.label}</span>
                  </div>
                  <span className="px-2.5 py-1 bg-[#D6E1EC]/60 text-navy/90 text-[10px] font-black rounded-full font-mono leading-none tracking-tight">550</span>
                </Link>
              ))}
            </div>
          </div>

          {/* BRANDS YOU FOLLOW CARD */}
          <div className="bg-white rounded-[24px] border border-gray-100 p-6 shadow-[0_10px_30px_rgba(26,29,78,0.02)] w-full">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-[9.5px] font-black tracking-widest text-[#1A1D4E]/30 uppercase italic text-left">BRANDS YOU FOLLOW</h3>
              <span className="px-2.5 py-1 bg-[#FFF0E8] rounded-full text-[#E8500A] font-extrabold text-[8px] tracking-wider uppercase shadow-xs">
                 6 active
              </span>
            </div>

            <div className="space-y-4">
              {(isBrandsCollapsed ? brandsYouFollow.slice(0, 3) : brandsYouFollow).map((brand, bidx) => (
                <div key={bidx} className="flex items-center gap-3.5 text-left">
                  <div className={cn("w-10 h-10 rounded-full flex items-center justify-center text-white font-black text-xs shrink-0 shadow-sm border border-black/5 uppercase", brand.bg)}>
                    {brand.init}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h4 className="font-space text-xs font-black tracking-wider text-[#1A1D4E] uppercase truncate">{brand.name}</h4>
                    <p className="text-[9.5px] font-bold text-gray-400 font-sans tracking-tight truncate leading-normal">{brand.sub}</p>
                  </div>
                </div>
              ))}
            </div>

            <button 
              onClick={() => setIsBrandsCollapsed(!isBrandsCollapsed)}
              className="w-full flex items-center justify-center gap-2 mt-6 pt-3 border-t border-gray-50 text-[9.5px] font-black uppercase tracking-widest text-[#E8500A] hover:text-[#CF4400] transition-colors cursor-pointer"
            >
              {isBrandsCollapsed ? "Expand List" : "Collapse List"}
              {isBrandsCollapsed ? <LucideIcons.ChevronDown className="w-3.5 h-3.5" /> : <LucideIcons.ChevronUp className="w-3.5 h-3.5" />}
            </button>
          </div>
        </aside>

        {/* CENTER COLUMN: MAIN CATEGORIES STREAM */}
        <div className="flex-1 min-w-0 lg:sticky lg:top-24 lg:h-[calc(100vh-120px)] lg:overflow-y-auto pb-10 pr-2">
          {isLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {Array.from({ length: 12 }).map((_, idx) => (
                <CategoryCardSkeleton key={idx} />
              ))}
            </div>
          ) : (
            <motion.div layout className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {categoriesList.map((cat, i) => {
                const IconComponent = (LucideIcons as any)[cat.icon] || LucideIcons.Package;
                const isExpanded = expandedCategory === cat.name;
                
                return (
                  <React.Fragment key={cat.name}>
                    <motion.div 
                      layout="position"
                      onClick={() => handleCategoryClick(cat.name)}
                      className={cn(
                        "bg-white rounded-2xl p-6 flex flex-col items-center text-center shadow-soft hover:shadow-xl transition-all cursor-pointer group border-2 relative overflow-hidden",
                        isExpanded ? "border-navy ring-4 ring-navy/5 z-20" : "border-transparent hover:border-navy/10"
                      )}
                    >
                      {/* Colorful Background Accent */}
                      <div className={cn(
                        "absolute top-0 left-0 w-full h-1 bg-gradient-to-r transition-opacity duration-500",
                        cat.color,
                        isExpanded ? "opacity-100" : "opacity-0 group-hover:opacity-40"
                      )} />

                      <div className={cn(
                        "w-16 h-16 rounded-2xl flex items-center justify-center mb-4 transition-all duration-500 bg-white shadow-lg border border-gray-100",
                        isExpanded ? "scale-110 shadow-xl" : "group-hover:scale-110 shadow-gray-200/50"
                      )}>
                        <IconComponent size={28} className={cn("transition-colors duration-500", isExpanded ? "text-navy" : "text-gray-400 group-hover:text-navy")} />
                        <div className={cn("absolute inset-0 opacity-10 rounded-2xl transition-opacity", cat.color)} />
                      </div>
                      <h3 className="text-sm font-black text-navy uppercase tracking-tight mb-1 group-hover:text-orange-primary transition-colors">{cat.name}</h3>
                      <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">{cat.count} Products</span>
                    
                    {isExpanded && (
                      <motion.div 
                        layoutId="arrow"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-4 h-4 bg-white rotate-45 border-r border-b border-navy/10"
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
                        className="col-span-2 md:col-span-3 lg:col-span-3 xl:col-span-4 bg-white shadow-2xl rounded-3xl p-8 border border-gray-100 overflow-hidden z-10"
                      >
                        <motion.div 
                          initial={{ y: 20, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          transition={{ delay: 0.1 }}
                          className="flex items-center gap-4 mb-8"
                        >
                          <div className={cn("w-12 h-12 rounded-xl text-white flex items-center justify-center shadow-lg bg-gradient-to-br", cat.color)}>
                            <IconComponent size={24} />
                          </div>
                          <div>
                            <h2 className="text-2xl font-black text-navy tracking-tight uppercase italic">{cat.name}</h2>
                            <p className="text-[10px] font-bold text-orange-primary uppercase tracking-[0.3em]">
                              {cat.count} Products Across {Math.floor(cat.count/15)} Brands - Updated Today
                            </p>
                          </div>
                        </motion.div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                          {cat.subcategories.length > 0 ? (
                            cat.subcategories.map((sub, j) => {
                              const SubIcon = (LucideIcons as any)[sub.icon] || LucideIcons.Package;
                              return (
                                <motion.div
                                  initial={{ opacity: 0, scale: 0.95 }}
                                  animate={{ opacity: 1, scale: 1 }}
                                  transition={{ delay: 0.1 + (j * 0.03), duration: 0.3 }}
                                  key={sub.name}
                                  className="bg-white rounded-2xl p-6 hover:shadow-2xl transition-all cursor-pointer group border border-gray-50 hover:border-navy/10"
                                >
                                  <div className={cn(
                                    "w-12 h-12 rounded-xl flex items-center justify-center mb-4 shadow-lg transition-transform group-hover:scale-110 bg-gradient-to-br",
                                    cat.color
                                  )}>
                                    <SubIcon size={20} className="text-white" />
                                  </div>
                                  <h4 className="text-sm font-black text-navy mb-1 group-hover:text-orange-primary transition-colors">{sub.name}</h4>
                                  <div className="flex items-center gap-1.5">
                                     <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{sub.brands} Brands Verified</span>
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
        <aside className="hidden lg:flex flex-col gap-8 w-[280px] flex-shrink-0 sticky top-24 h-[calc(100vh-120px)] overflow-y-auto pb-10 pr-2 no-scrollbar">
          <div 
            id="section-sellers" 
            className="bg-white rounded-[32px] border border-gray-100 p-6 shadow-[0_15px_35px_rgba(26,29,78,0.03)] relative overflow-hidden flex flex-col justify-between text-center shrink-0 w-full" 
            style={{ height: '480px' }}
          >
            <div className="absolute top-0 right-0 w-36 h-36 bg-gradient-to-br from-[#E8500A]/5 to-[#1A1D4E]/5 rounded-full blur-2xl pointer-events-none" />
            
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 rounded-full bg-[#FFF0E8] text-[#E8500A] flex items-center justify-center mb-4 shrink-0 shadow-sm border border-[#FFF0E8]">
                <LucideIcons.Sparkles className="w-6 h-6" />
              </div>
              
              <h3 className="font-space text-lg font-black uppercase tracking-tight text-[#1A1D4E] leading-tight">
                For Business <span className="text-[#E8500A] italic">& Sellers</span>
              </h3>
              
              <p className="text-[11px] text-gray-400 font-bold mt-2 px-1 leading-relaxed max-w-[220px]">
                Unlock exclusive tools, secure verified merchant badges, and scale your authentic local reach.
              </p>
            </div>

            <div className="border border-dashed border-[#E8500A]/30 bg-gradient-to-b from-[#FFF5F0]/70 to-white/70 rounded-[24px] p-5 text-center flex flex-col items-center justify-center shadow-xs my-3 flex-1">
              <h4 className="font-space font-black text-[#1A1D4E] text-xs uppercase tracking-widest mb-2">BOOST SALES TODAY</h4>
              <p className="text-[10px] text-gray-500 mb-4 leading-relaxed max-w-[210px] font-semibold">
                Gain entry to wholesale deals slots, exposure metrics, and buyer engagement streams.
              </p>
              
              <Link 
                to="/post-offer" 
                className="w-full h-11 bg-gradient-to-r from-[#FF5B00] to-[#E8500A] hover:bg-gradient-to-r hover:from-[#E8500A] hover:to-[#CF4400] text-white font-black rounded-full text-[10px] tracking-widest uppercase flex items-center justify-center gap-2 transition-all shadow-md hover:scale-[1.02] active:scale-[0.98]"
              >
                POST OFFER <LucideIcons.PenTool className="w-4 h-4" />
              </Link>
            </div>

            <div className="flex items-center justify-center gap-2 text-[9px] font-black text-gray-400 uppercase font-mono tracking-widest shrink-0 mt-2">
              <LucideIcons.Users className="w-4 h-4 text-gray-400/80" /> 100k+ shopper log Daily
            </div>
          </div>

          {/* Sponsored Ad Section */}
          <div className="bg-[#100D2B] rounded-[32px] p-6 text-white text-center relative overflow-hidden shadow-md w-full">
             <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/40" />
             <div className="relative z-10">
                <span className="px-3 py-1 bg-white/10 backdrop-blur-md rounded-full border border-white/10 text-[8px] font-black uppercase tracking-widest block w-fit mx-auto mb-4">
                   Sponsored Ad
                </span>
                
                <div className="w-full aspect-square rounded-2xl overflow-hidden mb-5 border border-white/10 shadow-lg">
                   <img 
                      src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&h=600&fit=crop" 
                      alt="Sponsor AD" 
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-[2s]"
                   />
                </div>
                
                <h4 className="font-serif text-lg font-bold tracking-widest uppercase mb-1">AARONG</h4>
                <p className="text-[9px] font-black text-white/50 tracking-wider uppercase mb-3">Heritage Shopping Brand</p>
                
                <p className="text-[11px] text-white/70 font-medium leading-relaxed mb-6 px-1">
                   New Collection Available. Free Delivery Overall Dhaka On Purchase Above BDT 1500
                </p>
                
                <button className="w-full bg-[#E8500A] hover:bg-[#ff5d14] text-white text-[10px] font-black uppercase tracking-widest py-3 rounded-full shadow-lg hover:shadow-[#E8500A]/20 transition-all cursor-pointer">
                   Shop Now
                </button>
             </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
