import React, { useState } from 'react';
import { Search, Star, Filter, ArrowRight, ExternalLink, ChevronLeft, ChevronRight, CheckCircle2, ShoppingBag, Youtube, Twitter, Facebook, Instagram } from 'lucide-react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { cn } from '../lib/utils';

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
      <div className="w-full bg-[#0A0A1F] py-16 px-8 relative overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#4A1D1D] via-[#0A0A1F] to-[#0A0A1F] opacity-80" />
        <div className="absolute top-0 right-0 w-1/3 h-full bg-orange-primary/5 blur-[120px] rounded-full translate-x-1/2 -translate-y-1/2" />
        
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <h1 className="text-[54px] md:text-[64px] font-black italic uppercase tracking-tighter mb-4 leading-none">
            <span className="text-orange-primary">BRAND</span> <span className="text-white">DIRECTORY</span>
          </h1>
          
          {/* Text-only Carousel (PRD Requirement) */}
          <div className="w-full overflow-hidden mb-12 py-4 border-y border-white/5 relative">
            <motion.div 
               animate={{ x: [0, -1000] }}
               transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
               className="flex whitespace-nowrap gap-12"
            >
               {['Aarong', 'Yellow', 'Sailor', 'Apex', 'Ecstasy', 'Richman', 'Lubnan', 'Apex', 'Bata', 'Lotto', 'Le Reve', 'Noir', 'Cats Eye'].map((name, i) => (
                 <span key={i} className="text-6xl font-black text-white/5 italic uppercase tracking-tighter hover:text-orange-primary transition-all cursor-default">
                    {name}
                 </span>
               ))}
               {['Aarong', 'Yellow', 'Sailor', 'Apex', 'Ecstasy', 'Richman', 'Lubnan', 'Apex', 'Bata', 'Lotto', 'Le Reve', 'Noir', 'Cats Eye'].map((name, i) => (
                 <span key={i} className="text-6xl font-black text-white/5 italic uppercase tracking-tighter hover:text-orange-primary transition-all cursor-default">
                    {name}
                 </span>
               ))}
            </motion.div>
          </div>

          <p className="text-white/70 max-w-2xl mx-auto font-bold italic text-sm md:text-base mb-12 uppercase tracking-wide opacity-80">
            Discover official stores, authorized dealers, and independent brands across Bangladesh.
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


      {/* Sticky Alphabet Filter Bar */}
      <div className="sticky top-[64px] z-30 w-full bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-sm py-4">
        <div className="max-w-7xl mx-auto px-8">
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

      <div className="max-w-7xl mx-auto px-8 w-full pt-8">
        {/* Choosify Recommends Section */}
        <div className="mb-12">
          <div className="flex items-center gap-4 mb-8 overflow-hidden">
            <div className="flex items-center gap-3 bg-orange-primary px-5 py-2.5 rounded-full shadow-lg shadow-orange-primary/20 flex-shrink-0">
               <span className="text-[10px] font-black text-white uppercase tracking-widest">Choosify Recommends</span>
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

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {[brands[0], brands[2], brands[0]].map((brand, i) => (
              <div key={i} className="bg-white rounded-[24px] p-10 shadow-high-density border border-gray-50 flex flex-col h-full hover:shadow-2xl transition-all">
                <div className="flex gap-8 mb-10">
                  <div className="w-24 h-24 rounded-[20px] bg-navy flex items-center justify-center p-4 flex-shrink-0 overflow-hidden shadow-2xl relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent" />
                    {brand.logo.length > 2 ? (
                       <img src={brand.logo} className="w-full h-full object-contain relative z-10" />
                    ) : (
                      <span className="text-4xl font-black text-white relative z-10">{brand.logo}</span>
                    )}
                  </div>
                  <div className="flex flex-col justify-center flex-1">
                    <h3 className="text-2xl font-black text-navy leading-none mb-3 italic tracking-tight">{brand.name}</h3>
                    <p className="text-[11px] font-bold text-gray-400 mb-4 line-clamp-2 uppercase tracking-wide opacity-80">{brand.description}</p>
                    <div className="flex items-center gap-2.5">
                      <div className="flex gap-0.5">
                        {[1, 2, 3, 4, 5].map(s => (
                          <Star key={s} size={12} className={cn("fill-orange-primary stroke-orange-primary", s > 4 && "fill-gray-200 stroke-gray-200")} />
                        ))}
                      </div>
                      <span className="text-[11px] font-black text-navy ml-1">4.9</span>
                      <span className="text-[11px] font-bold text-gray-300 ml-1">({brand.reviews})</span>
                    </div>
                  </div>
                </div>

                <div className="w-full h-px bg-gray-100 mb-10 mt-auto" />

                <div className="grid grid-cols-3 gap-6 mb-12">
                  <div className="flex flex-col items-center">
                    <span className="text-[11px] font-black text-navy mb-2 uppercase tracking-tight">Best For</span>
                    <span className="text-[10px] font-bold text-red-500 italic uppercase">Handcrafts</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="flex flex-col items-center">
                      <span className="text-2xl font-black text-[#5C2AFE] leading-none mb-1.5 italic tracking-tighter">৳500</span>
                      <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest opacity-60">Price Range</span>
                    </div>
                  </div>
                  <div className="flex flex-col items-center">
                    <span className="text-2xl font-black text-[#10B981] leading-none mb-1.5 italic tracking-tighter">95%</span>
                    <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest opacity-60">Recommended</span>
                  </div>
                </div>

                <Link to={`/brands/${brand.id}`} className="w-full py-5 bg-[#4F10F2] text-white text-[12px] font-black uppercase rounded-2xl shadow-2xl shadow-blue-500/30 hover:bg-[#3D0CCF] hover:translate-y-[-2px] transition-all text-center tracking-widest italic">
                   Visit Brand Details
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-8 w-full pb-16 flex gap-8">
        {/* Sidebar Filters */}
        <aside className="w-64 flex-shrink-0 hidden lg:flex flex-col gap-8">
          {/* Filter By Brand */}
          <div className="bg-white rounded-[10px] p-6 shadow-soft border border-gray-100">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xs font-black text-navy uppercase tracking-widest">FILTER BY BRAND TYPE</h3>
              <button className="text-[9px] font-bold text-orange-primary uppercase hover:underline">Clear all</button>
            </div>
            <div className="space-y-3">
              {['Electronics', 'Fashion clothing', 'Accessories', 'Education'].map(brand => (
                <label key={brand} className="flex items-center gap-3 cursor-pointer group">
                  <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-orange-primary focus:ring-orange-primary" />
                  <span className="text-xs font-bold text-gray-500 group-hover:text-navy transition-colors">{brand}</span>
                </label>
              ))}
            </div>
            <button className="mt-6 text-[10px] font-black text-orange-primary uppercase hover:underline">Show All 150 Brands</button>
          </div>

          {/* Sponsored Ad */}
          <div className="bg-navy rounded-[10px] p-8 text-center relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
            <span className="text-[8px] font-black text-white/40 uppercase tracking-[0.2em] mb-4 block">Sponsored</span>
            <h4 className="text-lg font-black text-white leading-tight mb-4 tracking-tight">List Your Brand On Choosify</h4>
            <p className="text-[10px] text-white/60 mb-6 leading-relaxed">Reach 100 Million Shoppers<br />Email: ads@choosify.com</p>
            <button className="w-full py-3 bg-orange-primary text-white text-[10px] font-black uppercase rounded-xl shadow-lg hover:translate-y-[-2px] transition-all">Partner With Us</button>
          </div>

          {/* Ad Slot */}
          <div className="rounded-[10px] border-2 border-dashed border-gray-300 p-8 text-center flex flex-col items-center">
             <h5 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Your Ad Here</h5>
             <p className="text-[9px] text-gray-400 mb-6">Reach 50,000+ Monthly Shoppers<br />Side Bar Placement</p>
             <button className="flex items-center gap-2 px-4 py-2 bg-navy text-white text-[9px] font-black uppercase rounded-lg">
                Advertise <ExternalLink size={10} />
             </button>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 space-y-12">
          {Object.entries(groupedBrands).map(([letter, letterBrands]) => (
            <div key={letter} className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-navy text-white flex items-center justify-center text-xl font-black">{letter}</div>
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{letterBrands.length} Brands</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {letterBrands.map(brand => (
                  <motion.div 
                    layout
                    key={brand.id} 
                    className="bg-white rounded-[32px] p-10 shadow-high-density hover:shadow-3xl transition-all border border-transparent hover:border-orange-primary/10 relative group flex flex-col h-full overflow-hidden"
                  >
                    {brand.isHot && (
                      <div className="absolute top-6 right-6 bg-red-500 text-white text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-[0.2em] shadow-xl z-20 italic">HOT</div>
                    )}
                    {brand.isFeatured && (
                      <div className="absolute top-6 right-6 bg-orange-primary text-white text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-[0.2em] shadow-xl z-20 italic">FEATURED</div>
                    )}

                    <div className="flex gap-8 mb-10 relative z-10">
                      <div className="w-24 h-24 rounded-[20px] bg-[#0F0F0F] flex items-center justify-center overflow-hidden flex-shrink-0 shadow-2xl border border-white/5">
                        {brand.logo.length > 2 ? (
                           <div className="w-20 h-20 bg-orange-primary/90 p-2 flex items-center justify-center text-navy font-black text-center leading-none text-sm italic tracking-tighter">
                              LOGO
                           </div>
                        ) : (
                          <span className="text-4xl font-black text-white">{brand.logo}</span>
                        )}
                      </div>
                      <div className="flex flex-col justify-center flex-1">
                        <h3 className="text-2xl font-black text-navy leading-tight mb-2 group-hover:text-orange-primary transition-colors italic uppercase tracking-tighter">{brand.name}</h3>
                        <p className="text-[11px] font-bold text-gray-400 mb-4 line-clamp-2 uppercase tracking-wide opacity-80">{brand.description}</p>
                        <div className="flex items-center gap-2">
                          <div className="flex gap-0.5">
                            {[1, 2, 3, 4, 5].map(s => (
                              <Star key={s} size={12} className={cn("fill-orange-primary stroke-orange-primary", s > Math.floor(brand.rating) && "fill-gray-200 stroke-gray-200")} />
                            ))}
                          </div>
                          <span className="text-[11px] font-black text-navy ml-2 italic">{brand.rating}</span>
                          <span className="text-[11px] font-bold text-gray-300 ml-2">({brand.reviews})</span>
                        </div>
                      </div>
                    </div>

                    <div className="w-full h-[1px] bg-gray-50 mb-10 mt-auto" />

                    <div className="grid grid-cols-3 gap-6 mb-12">
                      <div className="text-center">
                        <span className="block text-[12px] font-black text-navy mb-1 uppercase tracking-tighter">Best For</span>
                        <span className="block text-[11px] font-bold text-red-500 italic uppercase">{brand.bestFor}</span>
                      </div>
                      <div className="text-center">
                        <div className="flex flex-col items-center">
                          <span className="text-2xl font-black text-[#5C2AFE] leading-none mb-1 italic tracking-tighter">{brand.priceRange}</span>
                          <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest opacity-60">Price Range</span>
                        </div>
                      </div>
                      <div className="text-center">
                        <span className="block text-2xl font-black text-[#3FD54F] leading-none mb-1 italic tracking-tighter">{brand.recommended}</span>
                        <span className="block text-[9px] font-black text-navy uppercase tracking-widest opacity-60">Recommended</span>
                      </div>
                    </div>

                    <Link to={`/brands/${brand.id}`} className="w-full py-5 bg-[#4F10F2] text-white text-[12px] font-black rounded-[18px] shadow-2xl shadow-[#4A1DDF]/30 hover:translate-y-[-2px] active:scale-95 transition-all flex items-center justify-center gap-2 hover:bg-[#3D0CCF] uppercase tracking-widest text-center italic">
                      Visit Brand Hub <ArrowRight size={16} className="-rotate-45" />
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
      </div>
    </div>
  );
}
