import React, { useState } from 'react';
import { Search, Star, Filter, ArrowRight, ExternalLink, ChevronLeft, ChevronRight, CheckCircle2, ShoppingBag, Youtube, Twitter, Facebook, Instagram, Sparkles, PenTool, Users, Heart, Eye, Share2 } from 'lucide-react';
import { motion } from 'motion/react';
import { Link, useNavigate } from 'react-router-dom';
import { cn } from '../../lib/utils';
import { useGlobalState } from '../../context/GlobalStateContext';
import toast from 'react-hot-toast';

interface SupplierBrand {
  id: string;
  name: string;
  description: string;
  logo: string;
  rating: number;
  reviews: number;
  moq: string;              // Replaces bestFor
  categoryTag: string;      // Category tag: e.g. "Best for Denim"
  priceRange: string;       // Bulk pricing indicators
  reliabilityScore: string; // Replaces recommended
  category: string;
  isHot?: boolean;
  isFeatured?: boolean;
  slug: string;
}

export function B2BSuppliersPage() {
  const { mode } = useGlobalState();
  const navigate = useNavigate();
  const [selectedLetter, setSelectedLetter] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const suppliers: SupplierBrand[] = [
    {
      id: 'sailor-denim',
      name: 'Sailor Denim Mills Ltd.',
      description: 'Sustainable Indigo Weaves & Direct Fabricators',
      logo: 'SD',
      rating: 4.9,
      reviews: 38,
      moq: 'MOQ: 500 Yds',
      categoryTag: 'Best for Denim',
      priceRange: 'BDT 1.5L+',
      reliabilityScore: '98% Trust',
      category: 'Textiles',
      isHot: true,
      slug: 'sailor-denim-mills'
    },
    {
      id: 'epyllion-trade',
      name: 'Epyllion Trade Syndicate',
      description: 'Mass Ready-Made Knitwear Cotton Distributors',
      logo: 'EG',
      rating: 4.8,
      reviews: 104,
      moq: 'MOQ: 1,000 Pcs',
      categoryTag: 'Best for Activewear',
      priceRange: 'BDT 2.0L+',
      reliabilityScore: '96% Trust',
      category: 'Apparel',
      isFeatured: true,
      slug: 'epyllion-trade-syndicate'
    },
    {
      id: 'apex-wholesale',
      name: 'Apex Wholesale Industrial',
      description: 'Footwear Lots & Bulk Material Exporters',
      logo: 'AW',
      rating: 4.7,
      reviews: 46,
      moq: 'MOQ: 200 Pairs',
      categoryTag: 'Best for Leather',
      priceRange: 'BDT 1.0L+',
      reliabilityScore: '94% Trust',
      category: 'Footwear',
      isHot: true,
      slug: 'apex-wholesale'
    },
    {
      id: 'dhaka-apparel',
      name: 'Dhaka Apparel Conglomerate',
      description: 'Organic Combed Cotton Garments Sourcing',
      logo: 'DA',
      rating: 4.9,
      reviews: 142,
      moq: 'MOQ: 2,000 Pcs',
      categoryTag: 'Best for Garments',
      priceRange: 'BDT 5.0L+',
      reliabilityScore: '99% Trust',
      category: 'Apparel',
      isFeatured: true,
      slug: 'dhaka-apparel-conglomerate'
    },
    {
      id: 'bengal-packaging',
      name: 'Bengal Smart Packaging Ltd.',
      description: 'Corrugated Cartons & Heavy Kraft Kraft',
      logo: 'BS',
      rating: 4.6,
      reviews: 78,
      moq: 'MOQ: 5,000 Ctn',
      categoryTag: 'Best for Packaging',
      priceRange: 'BDT 80k+',
      reliabilityScore: '95% Trust',
      category: 'Packaging',
      slug: 'bengal-smart-packaging'
    },
    {
      id: 'sylhet-gems',
      name: 'Sylhet Artisanal Gems & Pearl Co.',
      description: 'Wetland Pink Pearls & Silver Craft Lines',
      logo: 'SG',
      rating: 4.4,
      reviews: 12,
      moq: 'MOQ: 50 Lots',
      categoryTag: 'Best for Pearls',
      priceRange: 'BDT 50k+',
      reliabilityScore: '91% Trust',
      category: 'Artisanal',
      slug: 'sylhet-artisanal-gems'
    }
  ];

  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

  const filteredSuppliersList = suppliers.filter(s => {
    const matchesSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          s.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          s.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesLetter = selectedLetter ? s.name.toLowerCase().startsWith(selectedLetter.toLowerCase()) : true;
    return matchesSearch && matchesLetter;
  });

  const groupedSuppliers = letters.reduce((acc, letter) => {
    const filtered = filteredSuppliersList.filter(s => s.name.toLowerCase().startsWith(letter.toLowerCase()));
    if (filtered.length > 0) {
      acc[letter] = filtered;
    }
    return acc;
  }, {} as Record<string, SupplierBrand[]>);

  return (
    <div className="flex flex-col min-h-screen bg-[#F0F4F9]" id="b2b-suppliers-portal">
      {/* Hero Section */}
      <div className="w-full bg-[#081120] py-16 px-4 md:px-8 relative overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#FF0038]/30 via-[#FF0038]/10 to-[#081120] opacity-90" />
        <div className="absolute top-0 right-0 w-1/3 h-full bg-[#FF0038]/5 blur-[120px] rounded-full translate-x-1/2 -translate-y-1/2" />
        
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <h1 className="text-[54px] md:text-[64px] font-black italic uppercase tracking-tighter mb-4 leading-none text-white">
            <span className="text-[#FF0038]">B2B SUPPLIER</span> <span className="text-white">DIRECTORY</span>
          </h1>
          
          {/* Text-only Carousel */}
          <div className="w-full overflow-hidden mb-12 py-4 border-y border-white/5 relative">
            <motion.div 
               animate={{ x: [0, -1000] }}
               transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
               className="flex whitespace-nowrap gap-12"
            >
               {['Sailor Denim', 'Epyllion Trade', 'Apex Wholesale', 'Sylhet Gems', 'Dhaka Apparel', 'Bengal packaging'].map((name, i) => (
                 <span key={i} className="text-6xl font-black text-white/5 italic uppercase tracking-tighter hover:text-[#FF0038] transition-all cursor-default">
                    {name}
                 </span>
               ))}
               {['Sailor Denim', 'Epyllion Trade', 'Apex Wholesale', 'Sylhet Gems', 'Dhaka Apparel', 'Bengal packaging'].map((name, i) => (
                 <span key={i} className="text-6xl font-black text-white/5 italic uppercase tracking-tighter hover:text-[#FF0038] transition-all cursor-default">
                    {name}
                 </span>
               ))}
            </motion.div>
          </div>

          <p className="text-white/70 max-w-2xl mx-auto font-bold italic text-sm md:text-base mb-12 uppercase tracking-wide opacity-80">
            Browse verified Bangladeshi RMG factories, textile dyers, custom leather tanneries, and high-volume wholesale sellers.
          </p>

          <div className="max-w-xl mx-auto relative group">
             <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none">
                <div className="flex gap-1 opacity-80">
                   <div className="w-5 h-5 rounded-full border-2 border-[#FF0038]/40 flex items-center justify-center">
                     <div className="w-2 h-2 bg-[#FF0038] rounded-full group-hover:scale-150 transition-transform" />
                   </div>
                   <div className="w-5 h-5 rounded-full border-2 border-[#FF0038]/40 flex items-center justify-center">
                     <div className="w-2 h-2 bg-[#FF0038] rounded-full group-hover:scale-150 transition-transform" />
                   </div>
                </div>
             </div>
             <input 
              type="text" 
              placeholder="Search by Sourcing Supplier Name or Category..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-16 pl-24 pr-8 rounded-full bg-gradient-to-r from-[#000A2A] to-[#0A0A1F] text-white border border-white/10 focus:outline-none focus:border-[#FF0038]/40 transition-all font-bold placeholder:text-white/20 shadow-3xl text-[13px] italic tracking-wide" 
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
                  selectedLetter === null ? "bg-[#FF0038] text-white shadow-[#FF0038]/20" : "bg-gray-100 text-gray-400 hover:bg-gray-200"
                )}
              >
                All Suppliers
              </button>
              <div className="w-px h-6 bg-gray-100 mx-2 flex-shrink-0" />
              {letters.map((letter) => (
                <button 
                  key={letter} 
                  onClick={() => {
                    setSelectedLetter(letter);
                    toast.success(`Jumping directly to suppliers starting with ${letter}`);
                  }}
                  className={cn(
                    "w-8 h-8 rounded-xl text-[10px] font-black transition-all flex items-center justify-center flex-shrink-0 uppercase",
                    selectedLetter === letter ? "bg-[#FF0038] text-white shadow-lg shadow-[#FF0038]/20" : "text-gray-400 hover:text-navy hover:bg-gray-50"
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
                  className="text-[10px] font-black text-[#FF0038] uppercase tracking-widest hover:underline flex items-center gap-2 transition-all"
                >
                  Clear Selection
                </button>
              )}
              <div className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                Direct Supplier Jump
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-[1700px] mx-auto px-6 w-full pt-8 pb-16 flex flex-col lg:flex-row gap-10 lg:gap-12 xl:gap-16 2xl:gap-24 relative">
        {/* Sidebar Filters */}
        <aside className="w-full lg:w-64 flex-shrink-0 hidden lg:flex flex-col gap-8 lg:sticky lg:top-24 lg:h-[calc(100vh-120px)] lg:overflow-y-auto pb-10 pr-2 no-scrollbar">
          {/* Filter By Supplier Type Checklist */}
          <div className="bg-white rounded-[24px] p-6 shadow-soft border border-gray-100/80 text-left">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xs font-black text-navy uppercase tracking-widest">FILTER BY PLANT TYPE</h3>
              <button 
                onClick={() => toast.success("Filters cleared.")}
                className="text-[9px] font-bold text-[#FF0038] uppercase hover:underline"
              >
                Clear all
              </button>
            </div>
            <div className="space-y-3">
              {[
                { name: 'Denim Mills', checked: true },
                { name: 'Knitwear Plants', checked: false },
                { name: 'Spinning Mills', checked: false },
                { name: 'Leather Tanneries', checked: true },
                { name: 'Carton Packaging', checked: false },
                { name: 'Artisanal Guilds', checked: false }
              ].map(item => (
                <label key={item.name} className="flex items-center gap-3 cursor-pointer group">
                  <input 
                    type="checkbox" 
                    defaultChecked={item.checked}
                    className="w-4 h-4 rounded border-gray-300 text-[#FF0038] focus:ring-[#FF0038] accent-[#FF0038] cursor-pointer" 
                  />
                  <span className="text-xs font-bold text-gray-500 group-hover:text-navy transition-colors">{item.name}</span>
                </label>
              ))}
            </div>
            <button className="mt-6 text-[10px] font-black text-[#FF0038] uppercase hover:underline text-left">Show All Filters</button>
          </div>

          {/* BUSINESS SELLERS INFO CARD */}
          <div 
            id="section-sellers-brands" 
            className="w-full bg-white rounded-[32px] border border-gray-100 p-6 shadow-[0_15px_35px_rgba(26,29,78,0.03)] relative overflow-hidden flex flex-col justify-between text-center shrink-0 mx-auto" 
            style={{ height: '480px' }}
          >
            <div className="absolute top-0 right-0 w-36 h-36 bg-gradient-to-br from-[#FF0038]/5 to-[#081120]/5 rounded-full blur-2xl pointer-events-none" />
            
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 rounded-full bg-[#FFF0F2] text-[#FF0038] flex items-center justify-center mb-4 shrink-0 shadow-sm border border-[#FFF0F2]">
                <Sparkles className="w-6 h-6 z-10" />
              </div>
              
              <h3 className="font-sans text-lg font-black uppercase tracking-tight text-[#081120] leading-tight">
                For Factories <span className="text-[#FF0038] italic">& Mills</span>
              </h3>
              
              <p className="text-[11px] text-gray-400 font-bold mt-2 px-1 leading-relaxed max-w-[220px]">
                Unlock corporate tools, request physical onsite plant inspection badges, and receive verified bulk RFQs.
              </p>
            </div>

            <div className="border border-dashed border-[#FF0038]/30 bg-gradient-to-b from-[#FFF5F6]/70 to-white/70 rounded-[24px] p-5 text-center flex flex-col items-center justify-center shadow-xs my-3 flex-1">
              <h4 className="font-sans font-black text-[#081120] text-xs uppercase tracking-widest mb-1 pb-1">BOOST BULK LEADS</h4>
              <p className="text-[10px] text-gray-500 mb-4 leading-relaxed max-w-[210px] font-semibold">
                Gain entry to premier bulk procurement streams, capacity indexes, and institutional trade auctions.
              </p>
              
              <Link 
                to="/post-offer" 
                className="w-full h-11 bg-[#FF0038] hover:bg-[#D6002F] text-white font-black rounded-full text-[10px] tracking-widest uppercase flex items-center justify-center gap-2 transition-all shadow-md hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
              >
                POST CAPACITY <PenTool className="w-4 h-4" />
              </Link>
            </div>

            <div className="flex items-center justify-center gap-2 text-[9px] font-black text-gray-400 uppercase font-mono tracking-widest shrink-0 mt-2">
              <Users className="w-4 h-4 text-gray-400/80" /> 10k+ verified buyers Daily
            </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 space-y-12 min-w-0 lg:sticky lg:top-24 lg:h-[calc(100vh-120px)] lg:overflow-y-auto pb-10 pr-2">
          {/* Choosify Recommends Section */}
          <div className="mb-12">
            <div className="flex items-center gap-4 mb-8 overflow-hidden">
              <div className="flex items-center gap-3 bg-[#FF0038] px-5 py-2.5 rounded-full shadow-lg shadow-[#FF0038]/20 flex-shrink-0">
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
              <span className="text-[10px] font-black text-navy uppercase tracking-widest whitespace-nowrap">3 Sourcing Mills</span>
              <div className="flex-1 h-px bg-[#FF0038]/25" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8 justify-items-center justify-center w-full">
              {[suppliers[0], suppliers[1], suppliers[2]].map((brand, i) => (
                <div 
                  key={i} 
                  className="bg-white rounded-[32px] p-6 shadow-high-density border border-gray-100 flex flex-col hover:shadow-2xl transition-all relative group overflow-hidden mx-auto justify-between"
                  style={{ width: '100%', maxWidth: '350px', height: '350px' }}
                >
                  <div className="absolute top-0 right-0 w-24 h-24 bg-[#FF0038]/5 blur-3xl rounded-full" />
                  
                  {/* Horizontal Header Info */}
                  <div className="flex gap-4 items-start relative z-10 text-left w-full">
                    <div className="w-16 h-16 rounded-[18px] bg-[#081120] flex items-center justify-center p-3 flex-shrink-0 overflow-hidden shadow-xl relative border border-white/10">
                      <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent" />
                      {brand.logo.length > 2 ? (
                         <img src={brand.logo} className="w-full h-full object-contain relative z-10" alt={brand.name} referrerPolicy="no-referrer" />
                      ) : (
                         <span className="text-3xl font-black text-white relative z-10">{brand.logo}</span>
                      )}
                    </div>
                    <div className="flex flex-col min-w-0 flex-1">
                      <h3 className="text-lg font-black text-[#081120] leading-tight mb-0.5 italic tracking-tight uppercase truncate group-hover:text-[#FF0038] transition-colors">{brand.name}</h3>
                      <p className="text-[10px] font-bold text-gray-400 mb-1 truncate uppercase tracking-wide opacity-80 leading-relaxed">{brand.description}</p>
                      
                      {/* Added Category tag under description */}
                      <span className="text-[8.5px] font-bold text-[#FF0038] uppercase tracking-wider block mt-1 bg-[#FF0038]/5 px-2 py-0.5 rounded-md w-max italic font-mono border border-[#FF0038]/15">
                        {brand.categoryTag}
                      </span>
                      
                      <div className="flex items-center gap-1.5 mt-2">
                        <div className="flex gap-0.5">
                          {[1, 2, 3, 4, 5].map(s => (
                            <Star key={s} size={10} className={cn("fill-[#FF0038] stroke-[#FF0038]", s > Math.floor(brand.rating) && "fill-gray-200 stroke-gray-200")} />
                          ))}
                        </div>
                        <span className="text-[10px] font-black text-[#081120] italic">{brand.rating}</span>
                        <span className="text-[9px] font-bold text-gray-300">({brand.reviews})</span>
                      </div>
                    </div>
                  </div>

                  {/* Content Spacer */}
                  <div className="flex-1" />
                  
                  <div className="w-full h-[1px] bg-gray-150 my-4" />

                  <div className="grid grid-cols-3 gap-3">
                    <div className="text-center bg-gray-50/50 py-2.5 rounded-xl border border-gray-100/50 min-w-0">
                      <span className="text-[8px] font-black text-navy mb-1 uppercase tracking-tight block opacity-40">MOQ</span>
                      <span className="text-[9px] font-bold text-[#FF0038] italic uppercase truncate px-1 block">{brand.moq}</span>
                    </div>
                    <div className="text-center bg-gray-50/50 py-2.5 rounded-xl border border-gray-100/50 min-w-0">
                      <div className="flex flex-col items-center">
                        <span className="text-md sm:text-lg font-black text-[#5C2AFE] leading-none mb-1 italic tracking-tighter truncate px-0.5 w-full block">{brand.priceRange}</span>
                        <span className="text-[7px] font-black text-gray-400 uppercase tracking-widest opacity-60">Price</span>
                      </div>
                    </div>
                    <div className="text-center bg-[#E6F4EA]/80 py-2.5 rounded-xl border border-green-100 min-w-0">
                      <span className="text-md sm:text-lg font-black text-[#10B981] leading-none mb-1 italic tracking-tighter block truncate px-0.5">{brand.reliabilityScore}</span>
                      <span className="text-[7px] font-black text-[#081120] uppercase tracking-widest opacity-60 block">Trust</span>
                    </div>
                  </div>

                  <div className="w-full h-[1px] bg-transparent my-1" />

                  <Link to={`/b2b/supplier/${brand.slug}`} className="w-full py-3 bg-navy text-white text-[9px] font-black uppercase rounded-xl shadow-xl hover:bg-[#FF0038] active:scale-95 transition-all text-center tracking-widest italic flex items-center justify-center gap-2 group/btn z-10 shrink-0">
                     Visit Supplier Hub <ArrowRight size={14} className="-rotate-45 group-hover/btn:translate-x-1 transition-transform" />
                  </Link>
                </div>
              ))}
            </div>
          </div>
          
          {Object.entries(groupedSuppliers).map(([letter, letterBrands]) => (
            <div key={letter} className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-navy text-white flex items-center justify-center text-xl font-black">{letter}</div>
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{letterBrands.length} Suppliers</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 justify-items-center justify-center w-full">
                {letterBrands.map(brand => (
                  <motion.div 
                    layout
                    key={brand.id} 
                    className="bg-white rounded-[24px] p-5 shadow-high-density hover:shadow-3xl transition-all border border-transparent hover:border-[#FF0038]/10 relative group flex flex-col justify-between overflow-hidden mx-auto"
                    style={{ width: '100%', maxWidth: '250px', height: '350px' }}
                  >
                    {brand.isHot && (
                      <div className="absolute top-5 right-5 bg-[#FF0038] text-white text-[8px] font-black px-2.5 py-1 rounded-full uppercase tracking-[0.2em] shadow-xl z-20 italic font-sansLabel">HOT</div>
                    )}
                    {brand.isFeatured && (
                      <div className="absolute top-5 right-5 bg-[#081120] text-white text-[8px] font-black px-2.5 py-1 rounded-full uppercase tracking-[0.2em] shadow-xl z-20 italic font-sansLabel">FEATURED</div>
                    )}

                    {/* Horizontal Header System */}
                    <div className="flex gap-3 items-start relative z-10 text-left w-full">
                      <div className="w-14 h-14 rounded-[14px] bg-[#081120] flex items-center justify-center overflow-hidden flex-shrink-0 shadow-xl border border-white/5">
                        {brand.logo.length > 2 ? (
                           <img src={brand.logo} className="w-full h-full object-contain p-2 relative z-10" alt={brand.name} referrerPolicy="no-referrer" />
                        ) : (
                          <span className="text-2xl font-black text-white">{brand.logo}</span>
                        )}
                      </div>
                      <div className={cn("flex flex-col min-w-0 flex-1", (brand.isHot || brand.isFeatured) && "pr-10")}>
                        <h3 className="text-sm font-black text-navy leading-tight mb-0.5 group-hover:text-[#FF0038] transition-colors italic uppercase tracking-tighter truncate">{brand.name}</h3>
                        <p className="text-[9px] font-bold text-gray-400 mb-1 truncate uppercase tracking-wide opacity-80 leading-relaxed">{brand.description}</p>
                        
                        {/* Category text Tag */}
                        <span className="text-[8px] font-bold text-[#FF0038] uppercase tracking-wider block mt-0.5 bg-[#FF0038]/5 px-1.5 py-0.5 rounded-md w-max italic font-mono border border-[#FF0038]/15">
                          {brand.categoryTag}
                        </span>

                        <div className="flex items-center gap-1 mt-1.5">
                          <div className="flex gap-0.5">
                            {[1, 2, 3, 4, 5].map(s => (
                              <Star key={s} size={8} className={cn("fill-[#FF0038] stroke-[#FF0038]", s > Math.floor(brand.rating) && "fill-gray-200 stroke-gray-200")} />
                            ))}
                          </div>
                          <span className="text-[9px] font-black text-[#081120] italic ml-0.5">{brand.rating}</span>
                          <span className="text-[8px] font-bold text-gray-300 ml-0.5">({brand.reviews})</span>
                        </div>
                      </div>
                    </div>

                    {/* Content Spacer */}
                    <div className="flex-1" />

                    <div className="w-full h-[1px] bg-gray-50 my-3 mt-auto" />

                    <div className="grid grid-cols-3 gap-2">
                      <div className="text-center bg-gray-50/50 py-1.5 rounded-lg border border-gray-100/50 min-w-0">
                        <span className="block text-[7px] font-black text-navy mb-0.5 uppercase tracking-tighter opacity-60">MOQ</span>
                        <span className="block text-[8px] font-bold text-[#FF0038] italic uppercase truncate px-0.5">{brand.moq}</span>
                      </div>
                      <div className="text-center bg-gray-50/50 py-1.5 rounded-lg border border-gray-100/50 min-w-0">
                        <div className="flex flex-col items-center">
                          <span className="text-xs sm:text-sm font-black text-[#5C2AFE] leading-none mb-0.5 italic tracking-tighter truncate w-full block">{brand.priceRange}</span>
                          <span className="text-[7px] font-black text-gray-400 uppercase tracking-widest opacity-60">Price</span>
                        </div>
                      </div>
                      <div className="text-center bg-[#E6F4EA]/80 py-1.5 rounded-lg border border-green-100 min-w-0">
                        <span className="block text-xs sm:text-sm font-black text-[#10B981] leading-none mb-0.5 italic tracking-tighter truncate w-full">{brand.reliabilityScore}</span>
                        <span className="block text-[7px] font-black text-navy uppercase tracking-widest opacity-60 font-black">Trust</span>
                      </div>
                    </div>

                    <div className="w-full h-[1px] bg-transparent my-1" />

                    <Link to={`/b2b/supplier/${brand.slug}`} className="w-full py-2 bg-navy text-white text-[9px] font-black rounded-lg shadow-md hover:bg-[#FF0038] active:scale-95 transition-all flex items-center justify-center gap-1.5 uppercase tracking-widest text-center italic group/btn z-10 shrink-0">
                      Visit Hub <ArrowRight size={12} className="group-hover:translate-x-0.5 transition-transform" />
                    </Link>
                  </motion.div>
                ))}
              </div>
            </div>
          ))}

          {/* New Redesigned Pagination */}
          <div className="mt-16 bg-white rounded-full px-8 py-5 flex items-center justify-between shadow-soft border border-gray-50 flex-wrap gap-6 text-left">
            <div className="flex items-center gap-10">
               <button 
                  onClick={() => toast.success("Returning to top page.")}
                  className="flex items-center gap-2 text-xs font-black text-[#FF0038] uppercase tracking-widest group"
               >
                  <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> 
                  Previous
               </button>
               <div className="flex items-center gap-2">
                  <button className="w-8 h-8 rounded-full text-xs font-bold text-gray-400 hover:bg-gray-50">1</button>
                  <button className="w-8 h-8 rounded-full text-xs font-bold text-gray-400 hover:bg-gray-50">2</button>
                  <button className="w-10 h-10 rounded-full text-xs font-black bg-[#FF0038] text-white shadow-lg shadow-[#FF0038]/30 scale-110">3</button>
                  <button className="w-8 h-8 rounded-full text-xs font-bold text-gray-400 hover:bg-gray-50">5</button>
                  <button className="w-8 h-8 rounded-full text-xs font-bold text-gray-400 hover:bg-gray-50">6</button>
                  <span className="text-xs text-gray-300 font-bold px-1">....</span>
                  <button className="w-8 h-8 rounded-full text-xs font-bold text-gray-400 hover:bg-gray-50">12</button>
               </div>
               <button 
                  onClick={() => toast.success("Accessing next direct results.")}
                  className="flex items-center gap-2 text-xs font-black text-[#FF0038] uppercase tracking-widest group"
               >
                  Next 
                  <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
               </button>
            </div>
            <div className="text-[11px] font-black text-[#081120] uppercase tracking-widest opacity-80">
               Showing {filteredSuppliersList.length} of {suppliers.length} Results
            </div>
          </div>

          {filteredSuppliersList.length === 0 && (
             <div className="py-20 text-center">
                <Search size={48} className="mx-auto text-gray-300 mb-4" />
                <h3 className="text-2xl font-black text-navy uppercase tracking-tight mb-2 italic">No Suppliers Found</h3>
                <p className="text-gray-400 font-medium">Try searching or clearing letter filters.</p>
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
          {/* TRENDING SOURCING MILLS */}
          <div className="bg-white rounded-[24px] border border-gray-100 p-5 shadow-[0_10px_30px_rgba(26,29,78,0.02)] w-full text-left">
            <h3 className="font-sans font-black text-[12px] tracking-widest text-[#081120] uppercase text-left mb-5 pb-4 border-b border-gray-50">
              TRENDING <span className="text-[#FF0038]">MILLS</span>
            </h3>

            <div className="flex flex-col gap-3.5">
              {[
                { name: "Sailor Denim", desc: "Premium Indigo Dry Weaves", logo: "SD", bg: "bg-[#081120]", slug: "sailor-denim-mills" },
                { name: "Epyllion Trade", desc: "Activewear Knits & Sourcing", logo: "EG", bg: "bg-indigo-900", slug: "epyllion-trade-syndicate" },
                { name: "Apex Wholesale", desc: "Mass Leather Lots Export", logo: "AW", bg: "bg-red-700", slug: "apex-wholesale" },
                { name: "Dhaka Apparel", desc: "BSCI-Certified Cotton Mills", logo: "DA", bg: "bg-teal-900", slug: "dhaka-apparel-conglomerate" },
                { name: "Bengal Smart Box", desc: "Carton Packaging & Heavy Kraft", logo: "BS", bg: "bg-emerald-950", slug: "bengal-smart-packaging" },
                { name: "Sylhet Gems", desc: "Pink Pearls Wetland Cooperative", logo: "SG", bg: "bg-amber-950", slug: "sylhet-artisanal-gems" }
              ].map((item, idx) => (
                <div 
                  key={idx} 
                  onClick={() => navigate(`/b2b/supplier/${item.slug}`)}
                  className="flex items-center gap-3 bg-white border border-gray-100/80 rounded-[16px] p-2.5 hover:shadow-[0_8px_20px_rgba(26,29,78,0.03)] hover:border-[#FF0038]/10 transition-all duration-300 group cursor-pointer"
                >
                  <div className={cn("w-10 h-10 rounded-[11px] overflow-hidden shrink-0 border border-transparent flex items-center justify-center text-white font-black text-xs italic shadow-md", item.bg)}>
                    {item.logo}
                  </div>
                  <div className="flex-1 min-w-0 flex flex-col justify-center text-left">
                    <h4 className="font-sans text-xs font-black uppercase tracking-tight text-[#081120] group-hover:text-[#FF0038] transition-colors truncate">
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
              <button 
                onClick={() => toast.success("Sourcing mills list fully indexed")}
                className="text-[9px] font-black text-[#FF0038] uppercase tracking-widest hover:underline whitespace-nowrap"
              >
                Show All
              </button>
            </div>
          </div>

          {/* SPONSOR AD IMAGE CARD */}
          <div className="bg-[#050514] rounded-[32px] overflow-hidden text-center flex flex-col justify-between w-full h-[500px] shrink-0 mx-auto relative group shadow-2xl border border-white/5">
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent z-10" />
            <img 
              src="https://images.unsplash.com/photo-1558449028-b53a39d100fc?w=320&h=600&fit=crop" 
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
                  Sailor Raw <span className="text-[#FF0038]">Denim</span>
                </h4>
                <p className="text-[10px] text-white/85 font-semibold mb-4 leading-relaxed max-w-[210px] uppercase tracking-wide">
                  Grade A-Indigo Cargo Ready. Complete clearance within BDT 1.5L bulk MOQ target.
                </p>
                <button 
                  onClick={() => navigate('/b2b/supplier/sailor-denim-mills')}
                  className="w-full h-11 bg-[#FF0038] hover:bg-[#D6002F] text-white font-black rounded-full text-[10px] tracking-widest uppercase flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer"
                >
                  SOURCE NOW <ExternalLink className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
