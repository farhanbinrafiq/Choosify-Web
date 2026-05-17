import React from 'react';
import { ProductCard } from '../components/ProductCard';
import { Timer, Zap, ArrowRight, ShoppingBag, Bookmark, ExternalLink, ChevronDown, Shirt, Tablets as Gem, Smartphone, Eye, Gamepad2, Utensils, Monitor, Tv, Home, Star } from 'lucide-react';
import { PRODUCTS, BRANDS } from '../constants';
import { useNavigate } from 'react-router-dom';
import { cn } from '../lib/utils';

export function DealsPage() {
  const navigate = useNavigate();
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

        {/* Featured Deals Section */}
        <section className="py-12 border-b border-gray-100 px-8">
          <div className="max-w-7xl mx-auto">
            <div className="mb-8 border-l-4 border-orange-primary px-6">
               <h2 className="text-4xl md:text-5xl font-black text-navy uppercase tracking-tighter italic leading-none mb-1">Featured <span className="text-orange-primary">Deals</span></h2>
               <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.4em] italic">Handpicked Top Offers • Selected for You</p>
            </div>
 
            {/* Image 6 Style (Large Featured + 4 Stacked Grid + 2 Bottom Grid) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">
               {/* Left: Large Featured Card + 2 Small Cards beneath it */}
               <div className="lg:col-span-8 flex flex-col gap-6">
                  <div className="h-fit">
                    <ProductCard 
                      product={{
                        ...PRODUCTS[0],
                        title: "Apex Running Pro Series X1 - Limited Edition",
                        discount: "20%"
                      }} 
                      variant="featured" 
                    />
                  </div>
                  
                  {/* Two small cards underneath the big card */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
                    {PRODUCTS.slice(1, 3).map((product, i) => (
                      <ProductCard 
                        key={i} 
                        product={{
                          ...product,
                          tag: "HOT DEAL",
                          tagColor: "bg-[#E93B3B]"
                        }} 
                        variant="grid" 
                      />
                    ))}
                  </div>
               </div>
               
               {/* Right: 4 Small Horizontal Cards Stacked - Matches the total height */}
               <div className="lg:col-span-4 flex flex-col gap-6">
                  {PRODUCTS.slice(3, 7).map((product, i) => (
                    <div key={i} className="flex-1">
                      <ProductCard 
                        product={{
                          ...product,
                          tag: i === 0 ? "TOP" : "DEAL",
                          tagColor: i === 0 ? "bg-[#1B5CFF]" : "bg-orange-primary"
                        }} 
                        variant="compact" 
                      />
                    </div>
                  ))}
               </div>
            </div>
          </div>
        </section>

        {/* Post Your Deal CTA */}
        <section className="py-16 px-8 bg-[#F4F9FF] overflow-hidden relative border-y border-gray-100">
          <div className="max-w-7xl mx-auto relative z-10">
            <div className="text-left mb-8">
              <h2 className="text-4xl font-black text-[#0D0D1A] italic uppercase tracking-tighter">For Business & Sellers</h2>
              <p className="text-[14px] font-bold text-gray-400 mt-2 uppercase tracking-wide">Approved Offers From Verified Merchants Setting Exclusive Items</p>
            </div>
            
            <div className="bg-white/60 backdrop-blur-sm rounded-[10px] p-12 md:p-16 border border-dashed border-[#FF5B00]/30 text-center relative overflow-hidden shadow-sm">
               <div className="absolute top-0 right-0 w-32 h-32 bg-orange-primary/5 rounded-full -translate-y-1/2 translate-x-1/2" />
               <div className="absolute bottom-0 left-0 w-24 h-24 bg-orange-primary/5 rounded-full translate-y-1/2 -translate-x-1/2" />
               
               <h3 className="text-2xl font-black text-[#FF5B00] mb-8 uppercase tracking-[0.2em] italic relative z-10">Boost Your Sales, Submit Your Offer</h3>
               <button 
                 onClick={() => navigate('/post-offer')}
                 className="px-12 py-4 bg-[#FF5B00] text-white font-black rounded-[10px] flex items-center gap-4 mx-auto shadow-2xl shadow-[#FF5B00]/40 hover:scale-105 active:scale-95 transition-all text-[13px] uppercase tracking-widest relative z-10 italic"
               >
                  Post Offer <ExternalLink size={18} />
               </button>
               <p className="mt-8 text-[11px] font-bold text-gray-400 uppercase tracking-[0.3em] relative z-10">100,000+ Shoppers Log In Every Day</p>
            </div>
          </div>
        </section>

        {/* All Deals Section */}
        <section className="py-16 px-8 bg-white/50">
          <div className="max-w-7xl mx-auto">
            <div className="mb-12 border-l-4 border-navy px-6">
               <h2 className="text-4xl md:text-5xl font-black text-navy uppercase tracking-tighter italic leading-none mb-2">All <span className="text-[#1B5CFF]">Deals</span></h2>
               <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.4em] italic">Explore Our Complete Collection of Offers</p>
            </div>

            {/* 3x3 Grid of Products */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
              {PRODUCTS.slice(0, 9).map((product, i) => (
                <ProductCard 
                  key={product.id} 
                  product={{
                    ...product,
                    tag: i % 3 === 0 ? "HOT" : i % 3 === 1 ? "SALE" : "NEW",
                    tagColor: i % 3 === 0 ? "bg-[#E93B3B]" : i % 3 === 1 ? "bg-[#E98B8B]" : "bg-[#7CD93B]",
                    originalPrice: "3,500"
                  }} 
                  showCountdown={true}
                />
              ))}
            </div>

            {/* Ad Banner */}
            <div className="bg-[#050626] rounded-[10px] p-10 flex flex-col md:flex-row items-center justify-between gap-8 border border-white/5 relative overflow-hidden group mb-16 shadow-2xl">
               <div className="absolute top-0 right-0 w-80 h-full bg-purple-500/15 blur-[100px] -translate-x-1/2 translate-y-1/2" />
               <div className="flex items-center gap-12 relative z-10 w-full md:w-auto">
                  <div className="w-24 h-24 rounded-[10px] bg-[#7C3AED] flex items-center justify-center text-white font-black text-3xl shadow-2xl flex-shrink-0 animate-pulse">
                     ezbooking
                  </div>
                  <div className="flex flex-col">
                     <h3 className="text-3xl font-black text-white mb-3 italic uppercase tracking-tighter">Ezbooking - Your Travel Solution</h3>
                     <div className="flex items-center gap-5 text-gray-400 text-[12px] font-bold uppercase tracking-[0.2em]">
                        <span>New Collection Available</span>
                        <div className="w-1.5 h-1.5 bg-gray-600 rounded-full" />
                        <span>Free Delivery Overall Dhaka City Purchase Above BDT 1000</span>
                     </div>
                  </div>
               </div>
               
               <div className="flex items-center gap-8 relative z-10">
                  <div className="flex items-center gap-2">
                     <div className="w-2 h-2 bg-gray-600 rounded-full" />
                     <div className="w-2 h-2 bg-gray-600 rounded-full" />
                     <div className="w-8 h-8 rounded-full border border-gray-600 flex items-center justify-center text-gray-500">
                        <span className="text-[11px] font-black">ad</span>
                     </div>
                  </div>
                  <button className="px-16 py-5 bg-[#FF5B00] text-white text-[15px] font-black uppercase rounded-[10px] hover:bg-orange-600 transition-all shadow-2xl shadow-orange-primary/20 italic tracking-widest whitespace-nowrap">
                     Visit Now
                  </button>
               </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
               {PRODUCTS.map(product => (
                 <ProductCard key={product.id} product={product} variant="grid" />
               ))}
            </div>
          </div>
        </section>


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
                <button className="px-16 py-6 bg-navy text-white text-[13px] font-black uppercase tracking-[0.2em] rounded-full hover:bg-orange-primary hover:scale-105 active:scale-95 transition-all shadow-2xl italic">
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
