import React, { useState } from 'react';
import { Search, Star, Filter, ArrowRight, ExternalLink, ChevronLeft, ChevronRight, CheckCircle2, ShoppingBag, Youtube, Twitter, Facebook, Instagram, Sparkles, PenTool, Users, Heart, Eye, Share2 } from 'lucide-react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { cn } from '../lib/utils';
import { useGlobalState } from '../context/GlobalStateContext';

interface Brand {
  id: string;
  name: string;
  description: string;
  logo: string;
  rating: number;
  reviews: number;
  bestFor: string;
  priceRange: string;
  recommended: string;
  category: string;
  isHot?: boolean;
  isFeatured?: boolean;
}

export function BrandsPage() {
  const { mode } = useGlobalState();
  const [selectedLetter, setSelectedLetter] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const brands: Brand[] = [
    {
      id: 'aarong',
      name: 'Aarong',
      description: 'Traditional Handcrafted Products',
      logo: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR6_A6l_A6l_A6l_A6l_A6l_A6l_A6l_A6l_A', // Placeholder logo
      rating: 4.9,
      reviews: 840,
      bestFor: 'Handcrafts',
      priceRange: '৳500',
      recommended: '95%',
      category: 'Fashion',
      isHot: true
    },
    {
      id: 'apex',
      name: 'Apex',
      description: 'Premium Footwear & Accessories',
      logo: 'A',
      rating: 4.7,
      reviews: 1250,
      bestFor: 'Footwear',
      priceRange: '৳1200',
      recommended: '92%',
      category: 'Fashion',
      isHot: true
    },
    {
      id: 'sailor',
      name: 'Sailor',
      description: 'Contemporary Lifestyle Brand',
      logo: 'S',
      rating: 4.8,
      reviews: 640,
      bestFor: 'Casual Wear',
      priceRange: '৳800',
      recommended: '90%',
      category: 'Fashion',
      isFeatured: true
    },
    {
      id: 'adidas',
      name: 'Adidas',
      description: 'Impossible is Nothing',
      logo: 'Ad',
      rating: 4.9,
      reviews: 3500,
      bestFor: 'Sportswear',
      priceRange: '৳2500',
      recommended: '98%',
      category: 'Sports'
    },
    {
      id: 'bay',
      name: 'Bay Emporium',
      description: 'Quality Leather Footwear',
      logo: 'B',
      rating: 4.5,
      reviews: 450,
      bestFor: 'Leather Goods',
      priceRange: '৳1500',
      recommended: '88%',
      category: 'Fashion'
    },
    {
      id: 'estilo',
      name: 'Estilo',
      description: 'Modern Fashion Statements',
      logo: 'E',
      rating: 4.6,
      reviews: 320,
      bestFor: 'Western Wear',
      priceRange: '৳1000',
      recommended: '85%',
      category: 'Fashion'
    },
  ];

  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

  const groupedBrands = letters.reduce((acc, letter) => {
    const filtered = brands.filter(b => b.name.startsWith(letter));
    if (filtered.length > 0) {
      acc[letter] = filtered;
    }
    return acc;
  }, {} as Record<string, Brand[]>);

  return (
    <div className="flex flex-col min-h-screen bg-[#F0F4F9]">
      {/* Hero Section */}
      <div className="w-full bg-[#0A0A1F] px-4 md:px-8 relative overflow-hidden flex items-center justify-center" style={{ height: '303px' }}>
        {/* Background Gradients */}
        {mode === 'wholesale' ? (
          <div className="absolute inset-0 bg-gradient-to-r from-[#FF5B00]/30 via-[#EB4501]/10 to-[#0A0A1F] opacity-90" />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-r from-[#4A1D1D] via-[#0A0A1F] to-[#0A0A1F] opacity-80" />
        )}
        <div className="absolute top-0 right-0 w-1/3 h-full bg-orange-primary/5 blur-[120px] rounded-full translate-x-1/2 -translate-y-1/2" />
        
        <div className="max-w-7xl mx-auto text-center relative z-10 w-full animate-fade-in">
          {mode === 'wholesale' ? (
            <h1 className="text-[28px] md:text-[36px] font-black italic uppercase tracking-tighter mb-2 leading-none">
              <span className="text-[#FF5B00]">B2B BRAND</span> <span className="text-white">DIRECTORY</span>
            </h1>
          ) : (
            <h1 className="text-[28px] md:text-[36px] font-black italic uppercase tracking-tighter mb-2 leading-none">
              <span className="text-orange-primary">BRAND</span> <span className="text-white">DIRECTORY</span>
            </h1>
          )}
          
          {/* Text-only Carousel (PRD Requirement) */}
          <div className="w-full overflow-hidden mb-3 py-1.5 border-y border-white/5 relative">
            <motion.div 
               animate={{ x: [0, -1000] }}
               transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
               className="flex whitespace-nowrap gap-8"
            >
               {['Aarong', 'Yellow', 'Sailor', 'Apex', 'Ecstasy', 'Richman', 'Lubnan', 'Apex', 'Bata', 'Lotto', 'Le Reve', 'Noir', 'Cats Eye'].map((name, i) => (
                 <span key={i} className="text-2xl font-black text-white/5 italic uppercase tracking-tighter hover:text-orange-primary transition-all cursor-default">
                    {name}
                 </span>
               ))}
               {['Aarong', 'Yellow', 'Sailor', 'Apex', 'Ecstasy', 'Richman', 'Lubnan', 'Apex', 'Bata', 'Lotto', 'Le Reve', 'Noir', 'Cats Eye'].map((name, i) => (
                 <span key={i} className="text-2xl font-black text-white/5 italic uppercase tracking-tighter hover:text-orange-primary transition-all cursor-default">
                    {name}
                 </span>
               ))}
            </motion.div>
          </div>

          <p className="text-white/70 max-w-2xl mx-auto font-bold italic text-[10px] md:text-[11px] mb-3 uppercase tracking-wide opacity-80">
            Discover official stores, authorized dealers, and independent brands across Bangladesh.
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
              className="w-full h-11 pl-18 pr-6 rounded-full bg-gradient-to-r from-[#000A2A] to-[#0A0A1F] text-white border border-white/10 focus:outline-none focus:border-orange-primary/40 transition-all font-bold placeholder:text-white/20 shadow-xl text-[11px] italic tracking-wide" 
             />
          </div>
        </div>
      </div>


      {/* Sticky Alphabet Filter Bar */}
      <div className="sticky top-[64px] z-30 w-full bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-sm py-4">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="flex items-center justify-between gap-6 overflow-x-auto no-scrollbar">
            <div className="flex items-center gap-1">
              <button 
                onClick={() => setSelectedLetter(null)}
                className={cn(
                  "px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-lg flex-shrink-0",
                  selectedLetter === null ? "bg-orange-primary text-white shadow-orange-primary/20" : "bg-gray-100 text-gray-400 hover:bg-gray-200"
                )}
              >
                All Brands
              </button>
              <div className="w-px h-6 bg-gray-100 mx-2 flex-shrink-0" />
              {letters.map((letter) => (
                <button 
                  key={letter} 
                  onClick={() => setSelectedLetter(letter)}
                  className={cn(
                    "w-8 h-8 rounded-xl text-[10px] font-black transition-all flex items-center justify-center flex-shrink-0 uppercase",
                    selectedLetter === letter ? "bg-orange-primary text-white shadow-lg shadow-orange-primary/20" : "text-gray-400 hover:text-navy hover:bg-gray-50"
                  )}
                >
                  {letter}
                </button>
              ))}
              <button className="w-8 h-8 rounded-xl text-[10px] font-black text-gray-400 hover:text-navy hover:bg-gray-50 flex items-center justify-center flex-shrink-0 transition-all uppercase">#</button>
            </div>
            <div className="flex items-center gap-6 whitespace-nowrap">
              {(selectedLetter || searchQuery) && (
                <button 
                  onClick={() => {setSelectedLetter(null); setSearchQuery('');}}
                  className="text-[10px] font-black text-orange-primary uppercase tracking-widest hover:underline flex items-center gap-2 transition-all"
                >
                  Clear Selection
                </button>
              )}
              <div className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                Direct Brand Jump
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-[1700px] mx-auto px-6 w-full pt-8 pb-16 flex flex-col lg:flex-row gap-10 lg:gap-12 xl:gap-16 2xl:gap-24 relative">
        {/* Sidebar Filters */}
        <aside className="w-full lg:w-64 flex-shrink-0 hidden lg:flex flex-col gap-8 lg:sticky lg:top-24 lg:h-[calc(100vh-120px)] lg:overflow-y-auto pb-10 pr-2 no-scrollbar">
          {/* Filter By Brand */}
          <div className="bg-white rounded-[24px] p-6 shadow-soft border border-gray-100/80 text-left">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xs font-black text-navy uppercase tracking-widest">FILTER BY BRAND TYPE</h3>
              <button className="text-[9px] font-bold text-orange-primary uppercase hover:underline">Clear all</button>
            </div>
            <div className="space-y-3">
              {[
                { name: 'Apex', checked: true },
                { name: 'Gadget & Gear', checked: false },
                { name: 'Nike', checked: false },
                { name: 'Adidas', checked: true },
                { name: 'Bay', checked: false },
                { name: 'Dhaka Boot Barn', checked: false },
                { name: 'Estilo', checked: false },
                { name: 'Arlin Shoes', checked: false },
                { name: 'Eco & Para', checked: false },
                { name: 'Masco', checked: false }
              ].map(item => (
                <label key={item.name} className="flex items-center gap-3 cursor-pointer group">
                  <input 
                    type="checkbox" 
                    defaultChecked={item.checked}
                    className="w-4 h-4 rounded border-gray-300 text-orange-primary focus:ring-orange-primary accent-orange-primary cursor-pointer" 
                  />
                  <span className="text-xs font-bold text-gray-500 group-hover:text-navy transition-colors">{item.name}</span>
                </label>
              ))}
            </div>
            <button className="mt-6 text-[10px] font-black text-orange-primary uppercase hover:underline text-left">Show All Filters</button>
          </div>

          {/* BUSINESS SELLERS INFO CARD */}
          <div 
            id="section-sellers-brands" 
            className="w-full bg-white rounded-[32px] border border-gray-100 p-6 shadow-[0_15px_35px_rgba(26,29,78,0.03)] relative overflow-hidden flex flex-col justify-between text-center shrink-0 mx-auto" 
            style={{ height: '480px' }}
          >
            <div className="absolute top-0 right-0 w-36 h-36 bg-gradient-to-br from-[#E8500A]/5 to-[#1A1D4E]/5 rounded-full blur-2xl pointer-events-none" />
            
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 rounded-full bg-[#FFF0E8] text-[#E8500A] flex items-center justify-center mb-4 shrink-0 shadow-sm border border-[#FFF0E8]">
                <Sparkles className="w-6 h-6 z-10" />
              </div>
              
              <h3 className="font-sans text-lg font-black uppercase tracking-tight text-[#1A1D4E] leading-tight">
                For Business <span className="text-[#E8500A] italic">& Sellers</span>
              </h3>
              
              <p className="text-[11px] text-gray-400 font-bold mt-2 px-1 leading-relaxed max-w-[220px]">
                Unlock exclusive tools, secure verified merchant badges, and scale your authentic local reach.
              </p>
            </div>

            <div className="border border-dashed border-[#E8500A]/30 bg-gradient-to-b from-[#FFF5F0]/70 to-white/70 rounded-[24px] p-5 text-center flex flex-col items-center justify-center shadow-xs my-3 flex-1">
              <h4 className="font-sans font-black text-[#1A1D4E] text-xs uppercase tracking-widest mb-1 pb-1">BOOST SALES TODAY</h4>
              <p className="text-[10px] text-gray-500 mb-4 leading-relaxed max-w-[210px] font-semibold">
                Gain entry to wholesale deals slots, exposure metrics, and buyer engagement streams.
              </p>
              
              <Link 
                to="/post-offer" 
                className="w-full h-11 bg-[#E8500A] hover:bg-[#CF4400] text-white font-black rounded-full text-[10px] tracking-widest uppercase flex items-center justify-center gap-2 transition-all shadow-md hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
              >
                POST OFFER <PenTool className="w-4 h-4" />
              </Link>
            </div>

            <div className="flex items-center justify-center gap-2 text-[9px] font-black text-gray-400 uppercase font-mono tracking-widest shrink-0 mt-2">
              <Users className="w-4 h-4 text-gray-400/80" /> 100k+ shopper log Daily
            </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 space-y-12 min-w-0 lg:sticky lg:top-24 lg:h-[calc(100vh-120px)] lg:overflow-y-auto pb-10 pr-2">
          {/* Choosify Recommends Section */}
          <div className="mb-12">
            <div className="flex items-center gap-4 mb-8 overflow-hidden">
              <div className="flex items-center gap-3 bg-orange-primary px-5 py-2.5 rounded-full shadow-lg shadow-orange-primary/20 flex-shrink-0">
                 <span className="text-[10px] font-black text-white uppercase tracking-widest">Choosify.bd Recommends</span>
                 <div className="flex gap-0.5">
                    <div className="w-4 h-4 rounded-full bg-white/20 flex items-center justify-center">
                      <div className="w-1.5 h-1.5 rounded-full bg-white" />
                    </div>
                    <div className="w-4 h-4 rounded-full bg-white/20 flex items-center justify-center">
                      <div className="w-1.5 h-1.5 rounded-full bg-white" />
                    </div>
                 </div>
              </div>
              <span className="text-[10px] font-black text-[#5C2AFE] uppercase tracking-widest whitespace-nowrap">3 Brands</span>
              <div className="flex-1 h-px bg-orange-primary/20" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8 justify-items-center justify-center w-full">
              {[brands[0], brands[1], brands[2]].map((brand, i) => (
                <div 
                  key={i} 
                  className="bg-white rounded-[32px] p-6 shadow-high-density border border-gray-100 flex flex-col hover:shadow-2xl transition-all relative group overflow-hidden mx-auto justify-between"
                  style={{ width: '100%', maxWidth: '350px', height: '350px' }}
                >
                  <div className="absolute top-0 right-0 w-24 h-24 bg-orange-primary/5 blur-3xl rounded-full" />
                  
                  {/* Horizontal Header Info */}
                  <div className="flex gap-4 items-start relative z-10 text-left w-full">
                    <div className="w-16 h-16 rounded-[18px] bg-[#0A0A1F] flex items-center justify-center p-3 flex-shrink-0 overflow-hidden shadow-xl relative border border-white/10">
                      <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent" />
                      {brand.logo.length > 2 ? (
                         <img src={brand.logo} className="w-full h-full object-contain relative z-10" alt={brand.name} referrerPolicy="no-referrer" />
                      ) : (
                         <span className="text-3xl font-black text-white relative z-10">{brand.logo}</span>
                      )}
                    </div>
                    <div className="flex flex-col min-w-0 flex-1">
                      <h3 className="text-lg font-black text-navy leading-tight mb-0.5 italic tracking-tight uppercase truncate group-hover:text-orange-primary transition-colors">{brand.name}</h3>
                      <p className="text-[10px] font-bold text-gray-400 mb-1.5 truncate uppercase tracking-wide opacity-80 leading-relaxed">{brand.description}</p>
                      <div className="flex items-center gap-1.5">
                        <div className="flex gap-0.5">
                          {[1, 2, 3, 4, 5].map(s => (
                            <Star key={s} size={10} className={cn("fill-orange-primary stroke-orange-primary", s > Math.floor(brand.rating) && "fill-gray-200 stroke-gray-200")} />
                          ))}
                        </div>
                        <span className="text-[10px] font-black text-navy italic">{brand.rating}</span>
                        <span className="text-[9px] font-bold text-gray-300">({brand.reviews})</span>
                      </div>
                    </div>
                  </div>

                  {/* Content Spacer */}
                  <div className="flex-1" />
                  
                  <div className="w-full h-[1px] bg-gray-150 my-4" />

                  <div className="grid grid-cols-3 gap-3">
                    <div className="text-center bg-gray-50/50 py-2.5 rounded-xl border border-gray-100/50 min-w-0">
                      <span className="text-[8px] font-black text-navy mb-1 uppercase tracking-tight block opacity-40">Best For</span>
                      <span className="text-[9px] font-bold text-red-500 italic uppercase truncate px-1 block">{brand.bestFor}</span>
                    </div>
                    <div className="text-center bg-gray-50/50 py-2.5 rounded-xl border border-gray-100/50 min-w-0">
                      <div className="flex flex-col items-center">
                        <span className="text-lg font-black text-[#6366f1] leading-none mb-1 italic tracking-tighter">{brand.priceRange}</span>
                        <span className="text-[7px] font-black text-gray-400 uppercase tracking-widest opacity-60">Price</span>
                      </div>
                    </div>
                    <div className="text-center bg-[#E6F4EA]/80 py-2.5 rounded-xl border border-green-100 min-w-0">
                      <span className="text-lg font-black text-[#10B981] leading-none mb-1 italic tracking-tighter">{brand.recommended}</span>
                      <span className="text-[7px] font-black text-navy uppercase tracking-widest opacity-60">Success</span>
                    </div>
                  </div>

                  <div className="w-full h-[1px] bg-transparent my-1" />

                  <Link to={`/brands/${brand.id}`} className="w-full py-3 bg-navy text-white text-[9px] font-black uppercase rounded-xl shadow-xl hover:bg-orange-primary active:scale-95 transition-all text-center tracking-widest italic flex items-center justify-center gap-2 group/btn z-10 shrink-0">
                     Visit Brand Hub <ArrowRight size={14} className="-rotate-45 group-hover/btn:translate-x-1 transition-transform" />
                  </Link>
                </div>
              ))}
            </div>
          </div>
          {Object.entries(groupedBrands).map(([letter, letterBrands]) => (
            <div key={letter} className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-navy text-white flex items-center justify-center text-xl font-black">{letter}</div>
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{letterBrands.length} Brands</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 justify-items-center justify-center w-full">
                {letterBrands.map(brand => (
                  <motion.div 
                    layout
                    key={brand.id} 
                    className="bg-white rounded-[24px] p-5 shadow-high-density hover:shadow-3xl transition-all border border-transparent hover:border-orange-primary/10 relative group flex flex-col justify-between overflow-hidden mx-auto"
                    style={{ width: '100%', maxWidth: '250px', height: '350px' }}
                  >
                    {brand.isHot && (
                      <div className="absolute top-5 right-5 bg-red-500 text-white text-[8px] font-black px-2.5 py-1 rounded-full uppercase tracking-[0.2em] shadow-xl z-20 italic font-sansLabel">HOT</div>
                    )}
                    {brand.isFeatured && (
                      <div className="absolute top-5 right-5 bg-orange-primary text-white text-[8px] font-black px-2.5 py-1 rounded-full uppercase tracking-[0.2em] shadow-xl z-20 italic font-sansLabel">FEATURED</div>
                    )}

                    {/* Horizontal Header System */}
                    <div className="flex gap-3 items-start relative z-10 text-left w-full">
                      <div className="w-14 h-14 rounded-[14px] bg-[#0F0F0F] flex items-center justify-center overflow-hidden flex-shrink-0 shadow-xl border border-white/5">
                        {brand.logo.length > 2 ? (
                           <img src={brand.logo} className="w-full h-full object-contain p-2 relative z-10" alt={brand.name} referrerPolicy="no-referrer" />
                        ) : (
                          <span className="text-2xl font-black text-white">{brand.logo}</span>
                        )}
                      </div>
                      <div className={cn("flex flex-col min-w-0 flex-1", (brand.isHot || brand.isFeatured) && "pr-10")}>
                        <h3 className="text-sm font-black text-navy leading-tight mb-0.5 group-hover:text-orange-primary transition-colors italic uppercase tracking-tighter truncate">{brand.name}</h3>
                        <p className="text-[9px] font-bold text-gray-400 mb-1.5 truncate uppercase tracking-wide opacity-80 leading-relaxed">{brand.description}</p>
                        <div className="flex items-center gap-1">
                          <div className="flex gap-0.5">
                            {[1, 2, 3, 4, 5].map(s => (
                              <Star key={s} size={8} className={cn("fill-orange-primary stroke-orange-primary", s > Math.floor(brand.rating) && "fill-gray-200 stroke-gray-200")} />
                            ))}
                          </div>
                          <span className="text-[9px] font-black text-navy italic ml-0.5">{brand.rating}</span>
                          <span className="text-[8px] font-bold text-gray-300 ml-0.5">({brand.reviews})</span>
                        </div>
                      </div>
                    </div>

                    {/* Content Spacer */}
                    <div className="flex-1" />

                    <div className="w-full h-[1px] bg-gray-50 my-3 mt-auto" />

                    <div className="grid grid-cols-3 gap-2">
                      <div className="text-center bg-gray-50/50 py-1.5 rounded-lg border border-gray-100/50 min-w-0">
                        <span className="block text-[7px] font-black text-navy mb-0.5 uppercase tracking-tighter opacity-60">Best For</span>
                        <span className="block text-[8px] font-bold text-red-500 italic uppercase truncate px-0.5">{brand.bestFor}</span>
                      </div>
                      <div className="text-center bg-gray-50/50 py-1.5 rounded-lg border border-gray-100/50 min-w-0">
                        <div className="flex flex-col items-center">
                          <span className="text-base font-black text-[#5C2AFE] leading-none mb-0.5 italic tracking-tighter">{brand.priceRange}</span>
                          <span className="text-[7px] font-black text-gray-400 uppercase tracking-widest opacity-60">Price</span>
                        </div>
                      </div>
                      <div className="text-center bg-[#E6F4EA]/80 py-1.5 rounded-lg border border-green-100 min-w-0">
                        <span className="block text-base font-black text-[#10B981] leading-none mb-0.5 italic tracking-tighter">{brand.recommended}</span>
                        <span className="block text-[7px] font-black text-navy uppercase tracking-widest opacity-60 font-medium">Success</span>
                      </div>
                    </div>

                    <div className="w-full h-[1px] bg-transparent my-1" />

                    <Link to={`/brands/${brand.id}`} className="w-full py-2 bg-navy text-white text-[9px] font-black rounded-lg shadow-md hover:bg-orange-primary active:scale-95 transition-all flex items-center justify-center gap-1.5 uppercase tracking-widest text-center italic group/btn z-10 shrink-0">
                      Visit Hub <ArrowRight size={12} className="group-hover:translate-x-0.5 transition-transform" />
                    </Link>
                  </motion.div>
                ))}
              </div>
            </div>
          ))}

          {/* New Redesigned Pagination */}
          <div className="mt-16 bg-white rounded-full px-8 py-5 flex items-center justify-between shadow-soft border border-gray-50 flex-wrap gap-6">
            <div className="flex items-center gap-10">
               <button className="flex items-center gap-2 text-xs font-black text-orange-primary uppercase tracking-widest group">
                  <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> 
                  Previous
               </button>
               <div className="flex items-center gap-2">
                  <button className="w-8 h-8 rounded-full text-xs font-bold text-gray-400 hover:bg-gray-50">1</button>
                  <button className="w-8 h-8 rounded-full text-xs font-bold text-gray-400 hover:bg-gray-50">2</button>
                  <button className="w-10 h-10 rounded-full text-xs font-black bg-orange-primary text-white shadow-lg shadow-orange-primary/30 scale-110">3</button>
                  <button className="w-8 h-8 rounded-full text-xs font-bold text-gray-400 hover:bg-gray-50">5</button>
                  <button className="w-8 h-8 rounded-full text-xs font-bold text-gray-400 hover:bg-gray-50">6</button>
                  <button className="w-8 h-8 rounded-full text-xs font-bold text-gray-400 hover:bg-gray-50">7</button>
                  <button className="w-8 h-8 rounded-full text-xs font-bold text-gray-400 hover:bg-gray-50">8</button>
                  <span className="text-xs text-gray-300 font-bold px-1">....</span>
                  <button className="w-8 h-8 rounded-full text-xs font-bold text-gray-400 hover:bg-gray-50">32</button>
               </div>
               <button className="flex items-center gap-2 text-xs font-black text-orange-primary uppercase tracking-widest group">
                  Next 
                  <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
               </button>
            </div>
            <div className="text-[11px] font-black text-navy uppercase tracking-widest opacity-80">
               Showing 100 Of 150 Results
            </div>
          </div>

          {Object.keys(groupedBrands).length === 0 && (
             <div className="py-20 text-center">
                <Search size={48} className="mx-auto text-gray-300 mb-4" />
                <h3 className="text-2xl font-black text-navy uppercase tracking-tight mb-2 italic">No Brands Found</h3>
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
        <aside className="hidden xl:flex flex-col gap-8 w-[280px] flex-shrink-0 lg:sticky lg:top-24 lg:h-[calc(100vh-120px)] lg:overflow-y-auto pb-10 pr-2 no-scrollbar">
          {/* TRENDING BRANDS SECTION */}
          <div className="bg-white rounded-[24px] border border-gray-100 p-5 shadow-[0_10px_30px_rgba(26,29,78,0.02)] w-full text-left">
            <h3 className="font-sans font-black text-[12px] tracking-widest text-[#1A1D4E] uppercase text-left mb-5 pb-4 border-b border-gray-50">
              TRENDING <span className="text-[#E8500A]">BRANDS</span>
            </h3>

            <div className="flex flex-col gap-3.5">
              {[
                { name: "Aarong", desc: "Traditional Handcrafted Products", logo: "Aa", bg: "bg-orange-primary/95" },
                { name: "Adidas", desc: "Premium Accessories & Sportswear", logo: "Ad", bg: "bg-navy" },
                { name: "Coca-Cola", desc: "Global Beverage & Refreshments", logo: "Cc", bg: "bg-red-600" },
                { name: "Starbucks", desc: "Premium Coffee & Brewing", logo: "Sb", bg: "bg-green-800" },
                { name: "Yellow", desc: "Contemporary Lifestyle Clothing", logo: "Ye", bg: "bg-yellow-500" },
                { name: "Bata", desc: "Global Footwear & Quality Leather", logo: "Ba", bg: "bg-red-700" }
              ].map((item, idx) => (
                <div 
                  key={idx} 
                  className="flex items-center gap-3 bg-white border border-gray-100/80 rounded-[16px] p-2.5 hover:shadow-[0_8px_20px_rgba(26,29,78,0.03)] hover:border-[#E8500A]/10 transition-all duration-300 group cursor-pointer"
                >
                  <div className={cn("w-10 h-10 rounded-[11px] overflow-hidden shrink-0 border border-transparent flex items-center justify-center text-white font-black text-xs italic shadow-md", item.bg)}>
                    {item.logo}
                  </div>
                  <div className="flex-1 min-w-0 flex flex-col justify-center text-left">
                    <h4 className="font-sans text-xs font-black uppercase tracking-tight text-[#1A1D4E] group-hover:text-[#E8500A] transition-colors truncate">
                      {item.name}
                    </h4>
                    <p className="text-[9px] font-bold text-gray-400 mt-0.5 truncate uppercase">
                      {item.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="text-center mt-5">
              <button className="text-[9px] font-black text-orange-primary uppercase tracking-widest hover:underline">
                Show All
              </button>
            </div>
          </div>

          {/* SPONSOR AD IMAGE CARD */}
          <div className="bg-[#050514] rounded-[32px] overflow-hidden text-center flex flex-col justify-between w-full h-[500px] shrink-0 mx-auto relative group shadow-2xl border border-white/5">
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent z-10" />
            <img 
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=320&h=600&fit=crop" 
              alt="Sponsor Ad" 
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000 opacity-60 pointer-events-none"
              referrerPolicy="no-referrer"
            />
            
            <div className="p-5 relative z-20 flex flex-col justify-between h-full">
              <span className="text-[9px] font-black tracking-[0.2em] text-white/70 bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-full uppercase self-center italic">
                SPONSOR AD
              </span>
              
              <div className="flex flex-col items-center mt-auto text-left">
                <h4 className="font-sans text-xl font-black text-white italic tracking-tighter uppercase leading-tight mb-2">
                  Aarong <span className="text-[#E8500A]">Heritage</span>
                </h4>
                <p className="text-[10px] text-white/85 font-semibold mb-4 leading-relaxed max-w-[210px] uppercase tracking-wide">
                  New Collection Available. Free Delivery overall Dhaka on purchase above BDT 1,500.
                </p>
                <button className="w-full h-11 bg-orange-primary hover:bg-[#CF4400] text-white font-black rounded-full text-[10px] tracking-widest uppercase flex items-center justify-center gap-2 transition-all shadow-md">
                  SHOP NOW <ExternalLink className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
