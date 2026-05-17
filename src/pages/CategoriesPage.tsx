import React, { useState } from 'react';
import { CATEGORIES } from '../constants';
import * as LucideIcons from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';

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
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

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
      <div className="w-full bg-[#0A0A1F] py-16 px-8 relative overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#4A1D1D] via-[#0A0A1F] to-[#0A0A1F] opacity-80" />
        <div className="absolute top-0 right-0 w-1/3 h-full bg-orange-primary/5 blur-[120px] rounded-full translate-x-1/2 -translate-y-1/2" />
        
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <h1 className="text-[54px] md:text-[64px] font-black italic uppercase tracking-tighter mb-4 leading-none">
            <span className="text-white">EXPLORATION</span> <span className="text-orange-primary">HUB</span>
          </h1>

          {/* Product Name Marquee */}
          <div className="w-full overflow-hidden mb-12 py-4 border-y border-white/5 relative">
            <motion.div 
               animate={{ x: [0, -1500] }}
               transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
               className="flex whitespace-nowrap gap-12"
            >
               {[
                 'Wireless Earbuds', 'Smart Watch', 'Gaming Laptop', 'Noise Cancelling Headphones', 
                 '4K Drone', 'Mechanical Keyboard', 'DSLR Camera', 'Portable Speaker', 
                 'Fitness Tracker', 'Power Bank'
               ].map((name, i) => (
                 <span 
                   key={i} 
                   className={cn(
                     "text-6xl font-black italic uppercase tracking-tighter transition-all duration-500 cursor-default",
                     "text-white/10",
                     "hover:text-orange-primary hover:scale-110 hover:drop-shadow-[0_0_20px_rgba(255,122,0,0.6)]"
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
                     "text-6xl font-black italic uppercase tracking-tighter transition-all duration-500 cursor-default",
                     "text-white/10",
                     "hover:text-orange-primary hover:scale-110 hover:drop-shadow-[0_0_20px_rgba(255,122,0,0.6)]"
                   )}
                 >
                    {name}
                 </span>
               ))}
            </motion.div>
          </div>

          <p className="text-white/70 max-w-2xl mx-auto font-bold italic text-[11px] md:text-[13px] mb-12 uppercase tracking-[0.2em] opacity-80 leading-relaxed">
            DISCOVER PREMIUM PRODUCTS, OFFICIAL STORES, AND BEST DEALS ACROSS BANGLADESH.
          </p>

          <div className="max-w-xl mx-auto relative group">
             <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none">
                <div className="flex gap-1 opacity-80">
                   <div className="w-5 h-5 rounded-full border-2 border-orange-primary/40 flex items-center justify-center">
                     <div className="w-2 h-2 bg-orange-primary rounded-full group-hover:scale-150 transition-transform" />
                   </div>
                   <div className="w-5 h-5 rounded-full border-2 border-orange-primary/40 flex items-center justify-center">
                     <div className="w-2 h-2 bg-orange-primary rounded-full group-hover:scale-150 transition-transform" />
                   </div>
                </div>
             </div>
             <input 
              type="text" 
              placeholder="Search by Brand Name or Category..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-16 pl-24 pr-8 rounded-full bg-gradient-to-r from-[#000A2A] to-[#0A0A1F] text-white border border-white/10 focus:outline-none focus:border-orange-primary/40 transition-all font-bold placeholder:text-white/20 shadow-3xl text-[13px] italic tracking-wide" 
             />
          </div>
        </div>
      </div>


      <div className="max-w-7xl mx-auto px-8 w-full py-10">
        <motion.div layout className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
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
                      className="col-span-2 md:col-span-3 lg:col-span-4 bg-white shadow-2xl rounded-3xl p-8 border border-gray-100 overflow-hidden z-10"
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
      </div>
    </div>
  );
}
