import React, { useState } from 'react';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';
import { ChevronLeft, ChevronRight, ArrowUpRight, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';

interface BrandItem {
  id: number;
  name: string;
  category: string;
  image: string;
}

const BRANDS_LIST: BrandItem[] = [
  {
    id: 1,
    name: "Apex",
    category: "Fashion Sneaker",
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=1200&q=80"
  },
  {
    id: 2,
    name: "La Reve",
    category: "Clothing & Lifestyle",
    image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1200&q=80"
  },
  {
    id: 3,
    name: "Perfume World",
    category: "Fragrances & Cosmetics",
    image: "https://images.unsplash.com/photo-1541643600914-78b084683601?w=1200&q=80"
  },
  {
    id: 4,
    name: "Pickaboo",
    category: "Mobiles & Gadgets",
    image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=1200&q=80"
  }
];

export const ModernCarousel: React.FC = () => {
  const [index, setIndex] = useState(1);

  const handleNext = () => setIndex((prev) => (prev + 1) % BRANDS_LIST.length);
  const handlePrev = () => setIndex((prev) => (prev - 1 + BRANDS_LIST.length) % BRANDS_LIST.length);

  return (
    <div className="w-full py-16 bg-white overflow-hidden">
      {/* Header matching Reference */}
      <div className="max-w-7xl mx-auto px-8 mb-16 relative">
        <div className="flex items-center justify-between">
           <div>
              <h2 className="text-5xl md:text-6xl font-black text-[#0A0A1F] italic tracking-tight uppercase leading-none mb-4">
                 TRENDING <span className="text-[#E65100]">BRANDS</span>
              </h2>
              <div className="flex items-center gap-2">
                 <div className="w-0.5 h-4 bg-[#E65100]" />
                 <p className="text-[10px] font-black text-[#0A0A1F]/60 uppercase tracking-[0.3em] italic">
                    CURATED PREMIUM SELECTION 2024
                 </p>
              </div>
           </div>
           
           <Link to="/brands" className="hidden md:flex items-center gap-2 px-8 py-3.5 bg-white border border-[#0A0A1F]/10 rounded-full text-[#0A0A1F] text-[10px] font-black uppercase tracking-widest italic hover:bg-[#0A0A1F] hover:text-white transition-all shadow-sm">
             VIEW ALL BRANDS
             <ArrowUpRight size={14} className="text-[#6B4BFF]" />
           </Link>
        </div>
      </div>

      {/* Grid-like Carousel with Flex width animation */}
      <div className="max-w-[1440px] mx-auto px-4 md:px-8">
        <div className="flex items-center justify-center gap-3 md:gap-5 h-[400px] md:h-[580px]">
          {BRANDS_LIST.map((brand, i) => {
            const isActive = i === index;
            
            return (
              <motion.div
                key={brand.id}
                onClick={() => setIndex(i)}
                initial={false}
                animate={{
                  width: isActive ? (window.innerWidth < 768 ? '100%' : '55%') : (window.innerWidth < 768 ? '0%' : '15%'),
                  flex: isActive ? 6 : 1,
                  opacity: isActive ? 1 : 0.7,
                }}
                transition={{
                  type: "spring",
                  stiffness: 100,
                  damping: 20
                }}
                className={cn(
                  "relative h-full rounded-[24px] md:rounded-[32px] overflow-hidden cursor-pointer group",
                  !isActive && "hidden md:block" // Hide side cards on mobile to focus on active
                )}
              >
                {/* Background Image */}
                <img 
                  src={brand.image} 
                  className="w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-110"
                  alt={brand.name}
                />
                <div className={cn(
                   "absolute inset-0 transition-opacity duration-700",
                   isActive ? "bg-gradient-to-t from-black/80 via-black/20 to-transparent" : "bg-black/30"
                )} />

                {/* Content for Inactive (Vertical Text) */}
                {!isActive && (
                   <div className="absolute inset-x-0 bottom-12 flex justify-center translate-y-10 group-hover:translate-y-0 transition-transform">
                      <span className="text-white/80 text-[11px] font-black uppercase tracking-[0.5em] italic origin-center rotate-[-90deg] whitespace-nowrap">
                         {brand.name}
                      </span>
                   </div>
                )}

                {/* Content for Active Card */}
                {isActive && (
                  <motion.div 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                    className="absolute inset-0 p-8 md:p-16 flex flex-col justify-end items-start"
                  >
                    <div className="flex items-center gap-4 mb-8 bg-black/20 backdrop-blur-md px-5 py-2.5 rounded-full border border-white/10">
                       <div className="w-8 h-8 rounded-full bg-[#E65100] flex items-center justify-center text-white shadow-xl">
                          <Zap size={18} className="fill-current" />
                       </div>
                       <span className="text-[11px] font-black text-white uppercase tracking-[0.2em] italic">TOP VERIFIED</span>
                    </div>

                    <h3 className="text-6xl md:text-[92px] font-black text-white italic tracking-tighter uppercase mb-6 leading-none">
                      {brand.name}
                    </h3>
                    
                    <div className="flex flex-col md:flex-row md:items-center gap-8 md:gap-12 w-full">
                       <p className="text-white/80 text-sm md:text-xl font-bold uppercase tracking-[0.2em] italic">
                          {brand.category}
                       </p>
                       
                       <button className="flex items-center gap-4 px-10 py-4 bg-white/5 backdrop-blur-sm border-2 border-white/20 hover:border-white transition-all rounded-full group/btn">
                          <span className="text-[12px] font-black text-white uppercase tracking-[0.3em] italic">EXPLORE BRAND</span>
                          <ArrowUpRight size={20} className="text-white group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform" />
                       </button>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Navigation Indicators */}
      <div className="mt-16 flex items-center justify-center gap-12">
         <div className="flex gap-4">
           {BRANDS_LIST.map((_, i) => (
             <button
               key={i}
               onClick={() => setIndex(i)}
               className={cn(
                 "h-1.5 transition-all duration-500 rounded-full",
                 index === i ? "w-20 bg-[#E65100]" : "w-3 bg-gray-200 hover:bg-gray-300"
               )}
             />
           ))}
         </div>
         
         <div className="flex gap-6">
            <button onClick={handlePrev} className="w-14 h-14 rounded-full border border-gray-100 flex items-center justify-center hover:bg-gray-50 transition-all active:scale-90 shadow-sm">
               <ChevronLeft size={24} />
            </button>
            <button onClick={handleNext} className="w-14 h-14 rounded-full border border-gray-100 flex items-center justify-center hover:bg-gray-50 transition-all active:scale-90 shadow-sm">
               <ChevronRight size={24} />
            </button>
         </div>
      </div>
    </div>
  );
};
