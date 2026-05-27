import React, { useState } from 'react';
import { ProductCard } from '../components/ProductCard';
import { Timer, Zap, ArrowRight, ShoppingBag, Bookmark, ExternalLink, ChevronDown, Shirt, Tablets as Gem, Smartphone, Eye, Gamepad2, Utensils, Monitor, Tv, Home, Star, Droplets, BookOpen, Heart, Smile, Car, Compass } from 'lucide-react';
import { PRODUCTS, BRANDS } from '../constants';
import { useNavigate } from 'react-router-dom';
import { cn } from '../lib/utils';

export function DealsPage() {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState('Fashion');

  const categoriesList = [
    { name: 'Fashion', icon: <Shirt size={16} className="stroke-[2.5]" />, count: 550 },
    { name: 'Gadgest', icon: <Smartphone size={16} className="stroke-[2.5]" />, count: 420 },
    { name: 'Perfume', icon: <Droplets size={16} className="stroke-[2.5]" />, count: 180 },
    { name: 'Electronics', icon: <Tv size={16} className="stroke-[2.5]" />, count: 350 },
    { name: 'Travel', icon: <Compass size={16} className="stroke-[2.5]" />, count: 156 },
    { name: 'Education', icon: <BookOpen size={16} className="stroke-[2.5]" />, count: 210 },
    { name: 'Parenting', icon: <Heart size={16} className="stroke-[2.5]" />, count: 95 },
    { name: 'Kids', icon: <Smile size={16} className="stroke-[2.5]" />, count: 240 },
    { name: 'Cars / Bike', icon: <Car size={16} className="stroke-[2.5]" />, count: 310 }
  ];
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <div className="w-full bg-[#0A0A1F] py-16 px-8 relative overflow-hidden">
        {/* Background Gradients matching other directory pages */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#4A1D1D] via-[#0A0A1F] to-[#0A0A1F] opacity-80" />
        <div className="absolute top-0 right-0 w-1/3 h-full bg-orange-primary/5 blur-[120px] rounded-full translate-x-1/2 -translate-y-1/2" />
        
        <div className="max-w-7xl mx-auto flex flex-col items-center text-center relative z-10">
          <div className="bg-orange-primary text-white text-[11px] font-black px-8 py-2.5 rounded-full mb-8 uppercase tracking-[0.2em] shadow-xl shadow-orange-primary/30 italic">
            FLASH SALE EVENT
          </div>
          
          <h1 className="text-6xl md:text-[80px] font-black text-white italic uppercase tracking-tighter mb-8 leading-none">
            HOTTEST <span className="text-orange-primary">DEALS</span> TODAY
          </h1>
          
          <div className="max-w-md w-full bg-white/5 backdrop-blur-xl border border-white/10 rounded-[24px] p-6 md:p-8 relative overflow-hidden shadow-[0_0_50px_rgba(255,91,0,0.1)]">
             <div className="relative z-10">
                <div className="flex items-center justify-center gap-2 mb-6">
                   <Zap size={14} className="text-orange-primary fill-orange-primary" />
                   <span className="text-[11px] font-black text-orange-primary uppercase tracking-[0.3em] italic">ENDS IN</span>
                </div>
                
                <div className="flex items-center justify-center gap-6">
                  {[
                    { val: '10', label: 'HRS' },
                    { val: '10', label: 'MIN' },
                    { val: '10', label: 'SEC' }
                  ].map((t, i, arr) => (
                    <React.Fragment key={i}>
                      <div className="flex flex-col items-center gap-2">
                        <div className="w-16 h-20 bg-[#000A24] border border-white/10 rounded-xl flex items-center justify-center shadow-inner group transition-all hover:border-orange-primary/30">
                           <span className="text-3xl font-black text-white font-mono leading-none tracking-tighter">{t.val}</span>
                        </div>
                        <span className="text-[9px] font-black text-gray-400 tracking-[0.2em] uppercase italic">{t.label}</span>
                      </div>
                      {i < arr.length - 1 && (
                        <div className="text-white/40 font-black text-xl pb-6">:</div>
                      )}
                    </React.Fragment>
                  ))}
                </div>
             </div>
          </div>

          <button 
            onClick={() => navigate('/post-offer')}
            className="mt-10 group flex items-center gap-4 px-10 py-4 bg-white rounded-full transition-all hover:scale-105 hover:shadow-[0_20px_60px_rgba(255,255,255,0.1)] active:scale-95"
          >
            <div className="w-10 h-10 rounded-full bg-orange-primary flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform">
               <ExternalLink size={20} />
            </div>
            <span className="text-[13px] font-black text-navy uppercase tracking-[0.2em] italic">Post Your Deals</span>
          </button>
        </div>
      </div>

      {/* Repeating Banner / Marquee - Orange Slide Through style */}
      <div className="w-full bg-orange-primary py-4 px-8 overflow-hidden relative z-20">
        <div className="flex items-center gap-12 animate-marquee whitespace-nowrap">
          {Array.from({ length: 12 }).map((_, i) => (
            <span key={i} className="text-white font-black uppercase text-[11px] tracking-[0.3em] italic flex items-center gap-6">
              FREE SHIPPING. EXTRA 15% OFF. LIMITED STOCK.
              <div className="w-1.5 h-1.5 bg-white rounded-full opacity-50" />
            </span>
          ))}
        </div>
      </div>

      <main className="w-full bg-[#F3F9FF]/30 min-h-screen">
        {/* Category & Filter Section */}
        <div className="w-full bg-white border-b border-gray-100 py-6 sticky top-0 z-40 shadow-sm px-8">
          <div className="max-w-[1440px] mx-auto flex flex-col gap-8">
            <div className="flex items-center justify-between gap-10">
              <div className="flex-1 overflow-x-auto no-scrollbar">
                <div className="flex items-center gap-4 whitespace-nowrap min-w-max">
                  {[
                    { name: 'Fashion & Lifestyle', icon: <Shirt size={16} /> },
                    { name: 'Jewelry & Accessories', icon: <Gem size={16} /> },
                    { name: 'Mobile & Wearable', icon: <Smartphone size={16} /> },
                    { name: 'Eye-wear & Fragrances', icon: <Eye size={16} /> },
                    { name: 'Gaming & Entertainment', icon: <Gamepad2 size={16} /> },
                    { name: 'Food & Restaurants', icon: <Utensils size={16} /> },
                    { name: 'Tech & electronics', icon: <Monitor size={16} /> },
                    { name: 'TV & appliances', icon: <Tv size={16} /> },
                    { name: 'Home & Kitchen', icon: <Home size={16} /> },
                  ].map((cat, i) => (
                    <button 
                      key={i} 
                      className={cn(
                        "flex items-center gap-3 px-6 py-2.5 rounded-full border text-[11px] font-bold uppercase tracking-wider transition-all hover:border-orange-primary hover:text-orange-primary",
                        i === 0 ? "bg-white border-[#1B5CFF] text-[#1B5CFF] shadow-sm" : "bg-white border-gray-100 text-gray-500"
                      )}
                    >
                      <span className={i === 0 ? "text-[#1B5CFF]" : "text-gray-400 group-hover:text-orange-primary"}>{cat.icon}</span>
                      {cat.name}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest italic">Sort:</span>
                <button className="flex items-center gap-3 px-6 py-2 bg-[#FF5B00] text-white rounded-full text-[11px] font-black uppercase tracking-widest italic shadow-lg shadow-orange-primary/20">
                  Most Popular <ChevronDown size={14} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Master Flex Column Structure below sticky bar */}
        <div className="max-w-[1700px] mx-auto py-12 px-6 w-full flex flex-col lg:flex-row gap-8 lg:gap-12 xl:gap-16 2xl:gap-24 relative items-start">
          
          {/* LEFT SIDEBAR: CATEGORIES CARD */}
          <aside className="w-full lg:w-64 xl:w-72 lg:sticky lg:top-24 lg:h-[calc(100vh-120px)] lg:overflow-y-auto pb-10 pr-2 no-scrollbar shrink-0">
            <div className="bg-white rounded-[32px] p-6 border border-gray-100 shadow-xl flex flex-col gap-5">
              <div className="flex flex-col gap-1">
                <h3 className="text-xl md:text-2xl font-black uppercase text-[#0A0B1E] italic tracking-tighter">
                  <span className="text-orange-primary">CATA</span>GORIES
                </h3>
                <div className="w-full h-px bg-gray-100 mt-2" />
              </div>

              <div className="flex flex-col gap-1.5">
                {categoriesList.map((cat, i) => {
                  const isActive = activeCategory === cat.name;
                  return (
                    <button 
                      key={i}
                      onClick={() => setActiveCategory(cat.name)}
                      className={cn(
                        "flex items-center gap-4 py-2 bg-transparent rounded-2xl w-full text-left group transition-all duration-300",
                        isActive 
                        ? "bg-orange-primary/[0.04] ring-1 ring-orange-primary/10" 
                        : "hover:bg-slate-50/80"
                      )}
                    >
                      {/* Circle Icon Container */}
                      <span className={cn(
                        "w-12 h-12 rounded-full flex items-center justify-center border transition-all duration-300 flex-shrink-0 relative",
                        isActive
                        ? "bg-gradient-to-r from-[#FF5B00] to-[#E8500A] text-white border-orange-primary shadow-lg shadow-orange-primary/20"
                        : "bg-white text-orange-primary border-gray-100 shadow-[0_4px_10px_rgba(0,0,0,0.04)] group-hover:scale-110 group-hover:border-orange-primary/20"
                      )}>
                        {cat.icon}
                      </span>

                      {/* Content Label */}
                      <span className="flex-1 min-w-0">
                        <span className={cn(
                          "text-[10.5px] md:text-xs font-black uppercase italic tracking-widest transition-colors duration-300 truncate block",
                          isActive ? "text-orange-primary" : "text-navy group-hover:text-orange-primary"
                        )}>
                          {cat.name}
                        </span>
                      </span>

                      {/* Count Badge */}
                      <span className={cn(
                        "px-2.5 py-1 rounded-[10px] text-[8.5px] font-mono font-black italic tracking-tighter shrink-0 transition-colors duration-300",
                        isActive
                        ? "bg-orange-primary text-white shadow-sm shadow-orange-primary/25"
                        : "bg-[#EAEFF4] text-navy/70"
                      )}>
                        {cat.count}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </aside>

          {/* LEFT MAIN AREA */}
          <div className="flex-1 min-w-0 w-full flex flex-col gap-16 lg:sticky lg:top-24 lg:h-[calc(100vh-120px)] lg:overflow-y-auto pb-10 pr-2">
            
            {/* Featured Deals Showcase Grid */}
            <section className="w-full">
              <div className="mb-12 border-l-4 border-orange-primary px-6 flex flex-col md:flex-row md:items-end justify-between gap-6 w-full">
                 <div>
                    <h2 className="text-4xl md:text-5xl font-black text-navy uppercase tracking-tighter italic leading-none mb-2">FEATURED <span className="text-orange-primary">DEALS</span></h2>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.4em] italic">Handpicked Top Offers • Limited Time Selection</p>
                 </div>
                 <div className="flex items-center gap-3 bg-[#F8FAFC] px-6 py-3 rounded-2xl border border-gray-100 shadow-sm">
                    <ShoppingBag size={16} className="text-navy" />
                    <span className="text-[11px] font-black text-navy uppercase tracking-widest italic">{PRODUCTS.length} ITEMS AVAILABLE</span>
                 </div>
              </div>
   
              <div className="flex flex-col gap-10 items-center w-full">
                 {/* Banner Card */}
                 <div className="w-full lg:h-[395px] flex-shrink-0">
                    <ProductCard 
                      product={{
                        ...PRODUCTS[0],
                        tag: "HOT",
                        tagColor: "bg-[#E93B3B]",
                        originalPrice: "3,500"
                      }} 
                      variant="featured" titleStyle={{ height: '100px', marginBottom: '11px' }}
                      showCountdown={true}
                    />
                 </div>
                 
                 {/* Small Cards Row */}
                 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-6 w-full justify-items-center">
                    {PRODUCTS.slice(1, 5).map((product, index) => (
                       <div key={product.id} className="w-full max-w-[300px] lg:h-[572px] flex-shrink-0">
                         <ProductCard 
                           product={{
                             ...product,
                             tag: "SALE",
                             tagColor: "bg-[#E98B8B]",
                           }} 
                           variant="compact"
                           showCountdown={index < 3} imageContainerStyle={{ height: '240px' }}
                         />
                       </div>
                    ))}
                 </div>
              </div>
            </section>

            {/* ALL DEALS Section Container */}
            <section id="all-deals" className="py-16 bg-[#F3F9FF]/20 px-6 rounded-[32px] border border-gray-100 text-center w-full">
              <div className="mb-12 border-l-4 border-orange-primary px-6 text-left">
                 <h2 className="text-4xl md:text-5xl font-black text-navy uppercase tracking-tighter italic leading-none mb-2">ALL <span className="text-orange-primary">DEALS</span></h2>
                 <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.4em] italic px-2 border-l-4 border-orange-primary">Browse All Handpicked Offers</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-y-10 gap-x-6 w-full place-items-center">
                {[...PRODUCTS, ...PRODUCTS.slice(0, 2)].slice(0, 12).map((product, idx) => (
                  <div key={`${product.id}-${idx}`} className="w-full max-w-[300px] lg:h-[572px] flex-shrink-0">
                    <ProductCard 
                      product={{
                        ...product,
                        tag: idx % 3 === 0 ? "HOT" : idx % 3 === 1 ? "SALE" : "NEW",
                        tagColor: idx % 3 === 0 ? "bg-[#E93B3B]" : idx % 3 === 1 ? "bg-[#E98B8B]" : "bg-[#7CD93B]",
                      }} 
                      variant="compact"
                      showCountdown={idx < 4} imageContainerStyle={{ height: '240px' }}
                    />
                  </div>
                ))}
              </div>

              <div className="mt-16 flex flex-col items-center gap-6">
                 <div className="flex gap-2">
                    {[1, 2, 3, '...', 12].map((p, i) => (
                      <button 
                        key={i} 
                        className={cn(
                          "w-12 h-12 rounded-xl flex items-center justify-center font-black text-[11px] uppercase italic transition-all",
                          p === 1 ? "bg-navy text-white shadow-xl" : "bg-white text-navy border border-gray-100 hover:bg-gray-50"
                        )}
                      >
                        {p}
                      </button>
                    ))}
                 </div>
                 <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] italic">Showing 12 of {PRODUCTS.length} deals available today</p>
              </div>
            </section>

          </div>

          {/* RIGHT SIDEBAR COLUMN */}
          <aside className="hidden lg:flex flex-col gap-6 lg:sticky lg:top-24 lg:h-[calc(100vh-120px)] lg:overflow-y-auto pb-10 pr-2 no-scrollbar flex-shrink-0 w-[280px]">
             {/* Redesigned For Business & Sellers Card */}
             <div 
               id="section-sellers-deals" 
               className="bg-white rounded-[24px] border border-gray-100 p-5 shadow-[0_10px_30px_rgba(26,29,78,0.02)] relative overflow-hidden flex flex-col justify-between text-center shrink-0 w-full" 
               style={{ height: '464px' }}
             >
               <div className="absolute top-0 right-0 w-36 h-36 bg-gradient-to-br from-[#E8500A]/5 to-[#1A1D4E]/5 rounded-full blur-2xl pointer-events-none" />
               
               <div className="flex flex-col items-center">
                 <div className="w-10 h-10 rounded-full bg-[#FFF0E8] text-[#E8500A] flex items-center justify-center mb-3 shrink-0 shadow-xs border border-[#FFF0E8]">
                   <Star className="w-4.5 h-4.5 fill-current" />
                 </div>
                 
                 <h3 className="font-space text-base font-black uppercase tracking-tight text-[#1A1D4E] leading-tight">
                   For Business <span className="text-[#E8500A] italic">& Sellers</span>
                 </h3>
                 
                 <p className="text-[10px] text-gray-400 font-bold mt-1.5 px-1 leading-relaxed max-w-[210px]">
                   Unlock exclusive tools, secure verified merchant badges, and scale your authentic local reach.
                 </p>
               </div>

               <div className="border border-dashed border-[#E8500A]/30 bg-gradient-to-b from-[#FFF5F0]/70 to-white/70 rounded-[20px] p-4 text-center flex flex-col items-center justify-center shadow-xs my-2 flex-1">
                 <h4 className="font-space font-black text-[#1A1D4E] text-[11px] uppercase tracking-widest mb-1">BOOST SALES TODAY</h4>
                 <p className="text-[9.5px] text-gray-500 mb-3.5 leading-relaxed max-w-[190px] font-semibold">
                   Gain entry to wholesale deals slots, exposure metrics, and buyer engagement streams.
                 </p>
                 
                 <button 
                   type="button"
                   onClick={() => navigate('/post-offer')}
                   className="w-full h-10 bg-[#E8500A] hover:bg-[#CF4400] text-white font-black rounded-full text-[9px] tracking-widest uppercase flex items-center justify-center gap-2 transition-all shadow-md hover:scale-[1.02] active:scale-[0.98] cursor-pointer border-0"
                 >
                   POST OFFER <ArrowRight className="w-3.5 h-3.5" />
                 </button>
               </div>

               <div className="flex items-center justify-center gap-1.5 text-[8.5px] font-black text-gray-400 uppercase font-mono tracking-widest shrink-0 mt-1">
                 <Star className="w-3.5 h-3.5 text-[#E8500A] fill-current" /> 100k+ shopper log Daily
               </div>
             </div>
          </aside>

        </div>

        {/* Featured Brand Deals Section */}
        <section className="py-20 bg-white px-8 relative overflow-hidden border-t border-gray-100">
          <div className="max-w-7xl mx-auto relative z-10">
             <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
                <div>
                   <h2 className="text-4xl md:text-5xl font-black text-navy uppercase tracking-tighter italic leading-none mb-3">Featured <span className="text-orange-primary">Brand Deals</span></h2>
                   <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.4em] italic mb-1 px-2 border-l-4 border-orange-primary">Curated Premium Partner Offers • Limited Time</p>
                </div>
             </div>
             
             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {[BRANDS[0], BRANDS[1], BRANDS[2], BRANDS[8]].map((brand, i) => {
                  return (
                    <div 
                      key={i} 
                      onClick={() => navigate(`/brands/${brand.id}/products`)}
                      className="bg-white rounded-[32px] p-10 flex flex-col items-center text-center gap-10 hover:shadow-[0_40px_100px_rgba(0,0,0,0.1)] transition-all cursor-pointer border border-gray-100 group relative overflow-hidden shadow-2xl shadow-gray-200/40"
                    >
                       <div className="absolute top-0 right-0 w-40 h-40 bg-orange-primary/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl group-hover:scale-150 transition-transform duration-700" />
                       
                       <div className="w-28 h-28 rounded-full bg-[#F8FAFC] flex items-center justify-center text-navy font-black text-4xl shadow-[inset_0_2px_10px_rgba(0,0,0,0.05)] border border-white group-hover:scale-110 transition-transform duration-500 relative z-10">
                          {brand.logo}
                       </div>
                       
                       <div className="flex flex-col items-center gap-3 relative z-10">
                          <h4 className="text-2xl font-black text-navy group-hover:text-orange-primary transition-colors italic uppercase tracking-tighter leading-tight">{brand.name}</h4>
                          <div className="px-6 py-2 bg-orange-primary text-white rounded-full text-[11px] font-black uppercase tracking-widest italic shadow-lg shadow-orange-primary/20 group-hover:scale-110 transition-transform">
                             Up to {i % 2 === 0 ? '40%' : '50%'} OFF
                          </div>
                       </div>

                       <div className="w-full h-px bg-gray-50 relative z-10" />

                       <div className="flex items-center gap-3 text-[11px] font-black text-navy uppercase tracking-widest italic group-hover:text-orange-primary transition-colors relative z-10">
                          Grab This Deal <ArrowRight size={18} className="-rotate-45 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                       </div>
                    </div>
                  );
                })}
             </div>
             
             <div className="mt-12 flex justify-center">
                <button 
                  onClick={() => navigate('/brand-deals')}
                  className="px-16 py-6 bg-navy text-white text-[13px] font-black uppercase tracking-[0.2em] rounded-full hover:bg-orange-primary hover:scale-105 active:scale-95 transition-all shadow-2xl italic"
                >
                   View All Brand Deals
                </button>
             </div>
          </div>
        </section>
      </main>

      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          display: inline-flex;
          animation: marquee 30s linear infinite;
        }
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-20px); }
        }
        .animate-float {
          animation: float 4s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
