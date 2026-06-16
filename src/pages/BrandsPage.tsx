import React, { useState } from 'react';
import { Search, Star, Filter, ArrowRight, ExternalLink, ChevronLeft, ChevronRight, CheckCircle2, ShoppingBag, Youtube, Twitter, Facebook, Instagram, Sparkles, PenTool, Users, Heart, Eye, Share2, Flame, Zap, Layers, Award, Gift, Copy } from 'lucide-react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { cn } from '../lib/utils';
import { useGlobalState } from '../context/GlobalStateContext';
import { toast } from 'react-hot-toast';

interface BrandDeal {
  id: string;
  name: string;
  dealHighlight: string;
  logo: string;
  bgClass: string;
}

const BRAND_DEALS: BrandDeal[] = [
  { id: 'aarong', name: "Aarong", dealHighlight: "Flat 15% OFF on Handicrafts", logo: "Aa", bgClass: "bg-orange-primary/95" },
  { id: 'apex', name: "Apex", dealHighlight: "Buy 1 Get 1 Free on Select Shoes", logo: "A", bgClass: "bg-navy" },
  { id: 'sailor', name: "Sailor", dealHighlight: "Flat 20% OFF on Casual Wear", logo: "S", bgClass: "bg-teal-700" },
  { id: 'adidas', name: "Adidas", dealHighlight: "Extra 10% OFF on Sportswear", logo: "Ad", bgClass: "bg-[#1A1D4E]" },
  { id: 'bay', name: "Bay Emporium", dealHighlight: "Up to 30% OFF on Leather Boots", logo: "B", bgClass: "bg-red-700" }
];

interface PromoCode {
  brandId: string;
  brandName: string;
  code: string;
  discount: string;
}

const PROMO_CODES: PromoCode[] = [
  { brandId: 'aarong', brandName: "Aarong", code: "AARONG15", discount: "Flat 15% OFF" },
  { brandId: 'apex', brandName: "Apex", code: "APEXFOOT26", discount: "BDT 500 FLAT" },
  { brandId: 'sailor', brandName: "Sailor", code: "SAILOREID", discount: "Flat 20% OFF" },
  { brandId: 'adidas', brandName: "Adidas", code: "ADIEXTRA10", discount: "10% FLAT OFF" }
];

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
  const [activeTab, setActiveTab] = useState('All Brands');
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

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

  // Core reactive filtering logic for brand listing
  const filteredBrands = React.useMemo(() => {
    let result = [...brands];

    // 1. Filter by Active Tab selection
    if (activeTab === 'Trending Brands') {
      result = result.filter(b => b.isHot || b.rating >= 4.7);
    } else if (activeTab === 'Featured Brands') {
      result = result.filter(b => b.isFeatured || b.rating >= 4.8);
    } else if (activeTab === 'Hot Deals Brands') {
      result = result.filter(b => b.isHot);
    } else if (activeTab === 'Top Rated Brands') {
      result = result.filter(b => b.rating >= 4.8);
    }

    // 2. Filter by search query across Name, bestFor, category, or description
    const q = searchQuery.toLowerCase().trim();
    if (q) {
      result = result.filter(b => 
        b.name.toLowerCase().includes(q) ||
        (b.bestFor || '').toLowerCase().includes(q) ||
        (b.category || '').toLowerCase().includes(q) ||
        (b.description || '').toLowerCase().includes(q)
      );
    }

    // 3. Filter by Selected Letter
    if (selectedLetter) {
      result = result.filter(b => b.name.toUpperCase().startsWith(selectedLetter));
    }

    return result;
  }, [searchQuery, selectedLetter, activeTab]);

  const groupedBrands = letters.reduce((acc, letter) => {
    const filtered = filteredBrands.filter(b => b.name.toUpperCase().startsWith(letter));
    if (filtered.length > 0) {
      acc[letter] = filtered;
    }
    return acc;
  }, {} as Record<string, Brand[]>);

  return (
    <div className="flex flex-col min-h-screen bg-[#F0F4F9]">
      {/* Hero Section */}
      <div className="w-full bg-[#0A0A1F] px-4 md:px-8 py-5 md:py-6 relative overflow-hidden flex items-center justify-center">
        {/* Background Gradients */}
        <div className="absolute inset-0 hero-gradient opacity-95" />
        <div className="absolute top-0 right-0 w-1/3 h-full bg-orange-primary/5 blur-[120px] rounded-full translate-x-1/2 -translate-y-1/2" />
        
        <div className="max-w-7xl mx-auto text-center relative z-10 w-full animate-fade-in">
          {mode === 'wholesale' ? (
            <h1 className="text-[22px] md:text-[28px] font-black italic uppercase tracking-tighter mb-1.5 leading-none">
              <span className="text-[#FF5B00]">B2B BRAND</span> <span className="text-white">DIRECTORY</span>
            </h1>
          ) : (
            <h1 className="text-[22px] md:text-[28px] font-black italic uppercase tracking-tighter mb-1.5 leading-none">
              <span className="text-orange-primary">BRAND</span> <span className="text-white">DIRECTORY</span>
            </h1>
          )}
          
          {/* Text-only Carousel (PRD Requirement) */}
          <div className="w-full overflow-hidden mb-2 py-1 border-y border-white/5 relative">
            <motion.div 
               animate={{ x: [0, -1000] }}
               transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
               className="flex whitespace-nowrap gap-8"
            >
               {['Aarong', 'Yellow', 'Sailor', 'Apex', 'Ecstasy', 'Richman', 'Lubnan', 'Apex', 'Bata', 'Lotto', 'Le Reve', 'Noir', 'Cats Eye'].map((name, i) => (
                 <span key={i} className="text-xl font-black text-white/5 italic uppercase tracking-tighter hover:text-orange-primary transition-all cursor-default">
                    {name}
                 </span>
               ))}
               {['Aarong', 'Yellow', 'Sailor', 'Apex', 'Ecstasy', 'Richman', 'Lubnan', 'Apex', 'Bata', 'Lotto', 'Le Reve', 'Noir', 'Cats Eye'].map((name, i) => (
                 <span key={i} className="text-xl font-black text-white/5 italic uppercase tracking-tighter hover:text-orange-primary transition-all cursor-default">
                    {name}
                 </span>
               ))}
            </motion.div>
          </div>

          <p className="text-white/70 max-w-2xl mx-auto font-bold italic text-[8.5px] md:text-[9.5px] mb-1 uppercase tracking-wide opacity-80">
            Discover official stores, authorized dealers, and independent brands across Bangladesh.
          </p>
        </div>
      </div>

      {/* GLOBAL STICKY NAVIGATION SYSTEM */}
      <div className="sticky top-[80px] z-30 bg-white/95 backdrop-blur-md border-b border-gray-150 shadow-sm py-4 transition-all duration-300">
        <div className="max-w-[1440px] mx-auto px-6 flex flex-col gap-4 w-full">
          
          {/* 1. Search Bar inside Sticky Container */}
          <div className="relative w-full max-w-2xl mx-auto bg-gray-50/50 p-1 rounded-full border border-gray-200/80 shadow-inner focus-within:border-[#E8500A]/30 transition-all duration-300">
            <div className="flex items-center bg-white rounded-full">
              <div className="pl-4 text-[#E8500A] shrink-0">
                <Search className="w-4 h-4" />
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
          <div className="flex items-center justify-start md:justify-center gap-1.5 md:gap-3 overflow-x-auto no-scrollbar py-1 text-[10px] font-black uppercase tracking-wider w-full">
            {[
              { id: 'All Brands', label: "All Brands", icon: <Layers size={13} /> },
              { id: 'Trending Brands', label: "Trending Brands", icon: <Flame size={13} /> },
              { id: 'Featured Brands', label: "Featured Brands", icon: <Sparkles size={13} /> },
              { id: 'Hot Deals Brands', label: "Hot Deals Brands", icon: <Zap size={13} /> },
              { id: 'Top Rated Brands', label: "Top Rated Brands", icon: <Star size={13} /> }
            ].map((tab) => (
              <button
                key={tab.label}
                onClick={() => {
                  setActiveTab(tab.id);
                  const el = document.getElementById("brands-main-display");
                  if (el) {
                    const offset = 220; // safe header + sticky offset
                    const elementPosition = el.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - offset;
                    window.scrollTo({
                      top: offsetPosition,
                      behavior: 'smooth'
                    });
                  }
                }}
                className={cn(
                  "px-5 py-2.5 rounded-full transition-all shrink-0 cursor-pointer flex items-center gap-1.5 font-black uppercase tracking-wider text-[10px] border",
                  activeTab === tab.id
                    ? "bg-[#E8500A] border-transparent text-white shadow-md shadow-[#E8500A]/10 italic"
                    : "bg-white border-gray-250 text-gray-400 hover:text-navy hover:bg-gray-50/80"
                )}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            ))}
          </div>

        </div>
      </div>



      <div className="max-w-[1440px] mx-auto px-4 py-5 w-full grid grid-cols-1 lg:grid-cols-[240px_minmax(0,1fr)_260px] xl:grid-cols-[280px_minmax(0,1fr)_310px] gap-4 relative">
        {/* Sidebar Filters */}
        <aside className="hidden lg:flex flex-col gap-4 lg:sticky lg:top-24 pb-10 pr-2 flex-shrink-0 animate-fade-in">
          {/* Alphabet Index Filter Card */}
          <div className="bg-white rounded-[5px] p-4.5 border border-[#e8edf2] shadow-sm flex flex-col gap-4 text-left font-sans animate-fade-in">
            <div className="flex flex-col gap-1">
              <h3 className="text-[11px] font-semibold text-[#8a9bb0] uppercase tracking-wider mb-2 leading-none">
                FILTER BY <span className="text-orange-primary font-bold">INITIAL</span>
              </h3>
              <div className="w-full h-px bg-gray-105" />
            </div>

            <div className="grid grid-cols-4 gap-1.5">
              <button 
                onClick={() => setSelectedLetter(null)}
                className={cn(
                  "col-span-4 py-2 rounded-[5px] text-[10px] font-black uppercase tracking-widest transition-all text-center cursor-pointer",
                  selectedLetter === null ? "bg-orange-primary text-white shadow-lg shadow-orange-primary/10" : "bg-gray-50 text-gray-400 hover:bg-gray-100"
                )}
              >
                All Brands
              </button>
              {letters.map((letter) => (
                <button 
                  key={letter} 
                  onClick={() => setSelectedLetter(letter)}
                  className={cn(
                    "h-8 rounded-[5px] text-[10px] font-black transition-all flex items-center justify-center uppercase cursor-pointer",
                    selectedLetter === letter ? "bg-orange-primary text-white shadow-md shadow-orange-primary/10" : "bg-gray-50 text-gray-400 hover:text-navy hover:bg-gray-100/70"
                  )}
                >
                  {letter}
                </button>
              ))}
            </div>
          </div>

          {/* BUSINESS SELLERS INFO CARD */}
          <div 
            id="section-sellers-brands" 
            className="w-full bg-white rounded-2xl border border-[#e8edf2] p-5 shadow-sm relative overflow-hidden flex flex-col justify-between text-center shrink-0 mx-auto" 
            style={{ height: '464px' }}
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#E8500A]/5 to-[#1A1D4E]/5 rounded-full blur-2xl pointer-events-none" />
            
            <div className="flex flex-col items-center">
              <div className="w-10 h-10 rounded-full bg-[#E8500A]/10 text-[#E8500A] flex items-center justify-center mb-3 border border-[#E8500A]/5 shrink-0 shadow-sm">
                <Sparkles className="w-5 h-5" />
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
                className="w-full py-2.5 bg-[#E8500A] hover:bg-[#CF4400] text-white font-semibold rounded-lg text-[10px] uppercase tracking-wider flex items-center justify-center gap-2 transition-colors shadow-sm"
              >
                POST OFFER <PenTool className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="flex items-center justify-center gap-1 text-[8.5px] font-semibold text-gray-400 uppercase font-mono tracking-widest shrink-0">
              <Users className="w-3.5 h-3.5 text-gray-400" /> 100k+ shopper log Daily
            </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <main id="brands-main-display" className="scroll-mt-36 min-w-0 pb-10 space-y-6">
          {/* Header info bar (Unified with Brand Deals layout cohesion) */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#e8edf2] font-sans">
            <div>
              <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.25em] italic leading-none">
                OUR PARTNERS • BRAND DIRECTORY
              </h3>
              <h2 className="text-xl font-black text-[#1A1D4E] italic uppercase tracking-tighter mt-2 leading-none">
                {activeTab === 'All Brands' ? 'ALL BRANDS' : activeTab.toUpperCase()}
                {selectedLetter && ` • STARTING WITH "${selectedLetter}"`}
                {searchQuery && ` • SEARCH: "${searchQuery.toUpperCase()}"`}
                <span className="text-orange-primary"> ({filteredBrands.length} FOUND)</span>
              </h2>
            </div>
            
            {(selectedLetter || searchQuery || activeTab !== 'All Brands') && (
              <button 
                onClick={() => {setSelectedLetter(null); setSearchQuery(''); setActiveTab('All Brands');}}
                className="text-[9.5px] font-black text-orange-primary uppercase tracking-widest hover:underline flex items-center gap-1.5 transition-all bg-white border border-[#e8edf2] px-3.5 py-2 rounded-[5px] shadow-sm self-start sm:self-auto hover:text-[#CF4400] cursor-pointer"
              >
                Reset All Filters
              </button>
            )}
          </div>

          {/* Tablet/Mobile Collapsible A-Z Filter Card */}
          <div className="lg:hidden bg-white rounded-[5px] p-4 border border-[#e8edf2] shadow-sm mb-6 font-sans">
            <div 
              className="flex items-center justify-between cursor-pointer" 
              onClick={() => setIsMobileFilterOpen(!isMobileFilterOpen)}
            >
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-1.5 leading-none">
                  <Filter size={11} className="text-[#E8500A]" />
                  FILTER BY INITIAL:
                </span>
                <span className="px-2 py-0.5 bg-[#E8500A]/10 text-[#E8500A] text-[9px] font-black uppercase rounded-[3px] leading-none">
                  {selectedLetter === null ? 'All' : selectedLetter}
                </span>
              </div>
              <span className="text-[9.5px] font-black text-[#E8500A] uppercase tracking-widest">
                {isMobileFilterOpen ? 'Hide' : 'Show A-Z'}
              </span>
            </div>
            
            {isMobileFilterOpen && (
              <div className="mt-4 pt-4 border-t border-gray-100/80">
                <div className="grid grid-cols-6 sm:grid-cols-9 gap-1.5">
                  <button 
                    onClick={() => {
                      setSelectedLetter(null);
                      setIsMobileFilterOpen(false);
                    }}
                    className={cn(
                      "col-span-6 sm:col-span-9 py-2 rounded-[5px] text-[10px] font-black uppercase tracking-widest transition-all text-center cursor-pointer",
                      selectedLetter === null ? "bg-orange-primary text-white shadow-lg shadow-orange-primary/10" : "bg-gray-50 text-gray-400 hover:bg-gray-100"
                    )}
                  >
                    All Brands
                  </button>
                  {letters.map((letter) => (
                    <button 
                      key={letter} 
                      onClick={() => {
                        setSelectedLetter(letter);
                        setIsMobileFilterOpen(false);
                      }}
                      className={cn(
                        "h-8 rounded-[5px] text-[10px] font-black transition-all flex items-center justify-center uppercase cursor-pointer",
                        selectedLetter === letter ? "bg-orange-primary text-white shadow-md shadow-orange-primary/10" : "bg-gray-50 text-gray-400 hover:text-navy hover:bg-gray-100/70"
                      )}
                    >
                      {letter}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Choosify Recommends Section */}
          <div className="mb-12">
            <div className="flex items-center gap-4 mb-8 overflow-hidden">
              <div className="flex items-center gap-3 bg-gradient-to-r from-[#FF6B35] to-[#0A0B1A] px-5 py-2.5 rounded-full shadow-lg shadow-orange-primary/10 flex-shrink-0 border border-[#FF6B35]/20">
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

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 justify-items-center justify-center w-full">
              {[brands[0], brands[1], brands[2]].map((brand, i) => (
                <motion.div 
                  layout
                  key={brand.id} 
                  className="bg-white rounded-xl p-5 border border-[#e8edf2] hover:border-orange-primary/30 hover:scale-[1.01] transition-all duration-300 relative group flex flex-col justify-between overflow-hidden mx-auto shadow-xs"
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
                    <div className="w-14 h-14 rounded-lg bg-gray-50 flex items-center justify-center overflow-hidden flex-shrink-0 border border-gray-100 p-2 shadow-xs">
                      {brand.logo.length > 2 ? (
                         <img src={brand.logo} className="w-full h-full object-contain p-2 relative z-10" alt={brand.name} referrerPolicy="no-referrer" />
                      ) : (
                        <span className="text-2xl font-black text-navy">{brand.logo}</span>
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

                  <Link to={`/brands/${brand.id}`} className="w-full py-2 bg-navy text-white text-[9px] font-black rounded-lg shadow-md hover:bg-[#E84E0F] active:scale-95 transition-all flex items-center justify-center gap-1.5 uppercase tracking-widest text-center italic group/btn z-10 shrink-0">
                    Visit Brand <ArrowRight size={12} className="group-hover:translate-x-0.5 transition-transform" />
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
          {Object.entries(groupedBrands).map(([letter, letterBrands]) => (
            <div key={letter} className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-navy text-white flex items-center justify-center text-xl font-black">{letter}</div>
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{letterBrands.length} Brands</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 justify-items-center justify-center w-full">
                {letterBrands.map(brand => (
                  <motion.div 
                    layout
                    key={brand.id} 
                    className="bg-white rounded-xl p-5 border border-[#e8edf2] hover:border-orange-primary/30 hover:scale-[1.01] transition-all duration-300 relative group flex flex-col justify-between overflow-hidden mx-auto shadow-xs"
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
                      <div className="w-14 h-14 rounded-lg bg-gray-50 flex items-center justify-center overflow-hidden flex-shrink-0 border border-gray-100 p-2 shadow-xs">
                        {brand.logo.length > 2 ? (
                           <img src={brand.logo} className="w-full h-full object-contain p-2 relative z-10" alt={brand.name} referrerPolicy="no-referrer" />
                        ) : (
                          <span className="text-2xl font-black text-navy">{brand.logo}</span>
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

                    <Link to={`/brands/${brand.id}`} className="w-full py-2 bg-navy text-white text-[9px] font-black rounded-lg shadow-md hover:bg-[#E84E0F] active:scale-95 transition-all flex items-center justify-center gap-1.5 uppercase tracking-widest text-center italic group/btn z-10 shrink-0">
                      Visit Brand <ArrowRight size={12} className="group-hover:translate-x-0.5 transition-transform" />
                    </Link>
                  </motion.div>
                ))}
              </div>
            </div>
          ))}

          {/* Standard Redesigned Pagination matching global standard */}
          <div className="mt-16 pt-12 border-t border-gray-100 flex flex-col items-center gap-8">
            <div className="flex items-center gap-3">
              <button className="w-12 h-12 rounded-[5px] flex items-center justify-center bg-white border border-[#e8edf2] text-navy hover:bg-[#E8500A] hover:text-white hover:border-[#E8500A] transition-all shadow-none group">
                <ArrowRight size={18} className="rotate-180 group-hover:-translate-x-1 transition-transform" />
              </button>
              {[1, 2, 3, '...', 12].map((page, i) => (
                <button 
                  key={i} 
                  className={cn(
                    "w-12 h-12 rounded-[5px] flex items-center justify-center text-[11px] font-black transition-all italic",
                    page === 1 
                    ? "bg-[#E8500A] text-white border border-[#E8500A] shadow-none" 
                    : "bg-white border border-[#e8edf2] text-navy hover:border-[#E8500A] hover:text-[#E8500A] shadow-none"
                  )}
                >
                  {page}
                </button>
              ))}
              <button className="w-12 h-12 rounded-[5px] flex items-center justify-center bg-white border border-[#e8edf2] text-navy hover:bg-[#E8500A] hover:text-white hover:border-[#E8500A] transition-all shadow-none group">
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
            
            <p className="text-[10px] font-black text-gray-300 uppercase tracking-[0.2em] italic">
              Showing 100 Of 150 Results
            </p>
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
        <aside className="hidden lg:flex flex-col gap-4 lg:sticky lg:top-24 pb-10 pr-2 flex-shrink-0 animate-fade-in">
          {/* FEATURED BRAND DEALS SECTION */}
          <div className="bg-white rounded-[5px] border border-[#e8edf2] p-4.5 shadow-sm w-full text-left animate-fade-in">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#e8edf2] px-1">
              <h3 className="text-[11px] font-semibold text-[#8a9bb0] uppercase tracking-wider">
                Featured Brand Deals
              </h3>
              <Link 
                to="/brand-deals" 
                className="text-[10px] font-bold text-orange-primary hover:underline flex items-center gap-1"
              >
                See All →
              </Link>
            </div>

            <div className="flex flex-col gap-2.5">
              {BRAND_DEALS.length === 0 ? (
                <div className="text-center py-6 border border-dashed border-gray-200 rounded-[5px]">
                  <p className="text-xs text-gray-400 font-medium">Featured brand deals will appear here.</p>
                </div>
              ) : (
                BRAND_DEALS.map((item) => (
                  <Link 
                    to={`/brands/${item.id}`}
                    key={item.id} 
                    className="flex items-center gap-3 bg-white border border-[#e8edf2]/60 rounded-[5px] p-2 hover:shadow-soft hover:border-[#E8500A]/10 transition-all duration-300 group cursor-pointer"
                  >
                    <div className={cn("w-9 h-9 rounded-lg overflow-hidden shrink-0 border border-transparent flex items-center justify-center text-white font-semibold text-xs shadow-sm", item.bgClass)}>
                      {item.logo}
                    </div>
                    <div className="flex-1 min-w-0 flex flex-col justify-center text-left">
                      <h4 className="font-sans text-xs font-semibold uppercase tracking-tight text-[#1A1D4E] group-hover:text-[#E8500A] transition-colors truncate">
                        {item.name}
                      </h4>
                      <p className="text-[9px] font-semibold text-gray-400 mt-0.5 truncate uppercase">
                        {item.dealHighlight}
                      </p>
                    </div>
                    <span className="text-[8px] font-bold text-[#E8500A] uppercase tracking-wider shrink-0 whitespace-nowrap group-hover:-translate-x-0.5 transition-transform">
                      View Deal
                    </span>
                  </Link>
                ))
              )}
            </div>
          </div>

          {/* FEATURED PROMOCODES SECTION */}
          <div className="bg-white rounded-[5px] border border-[#e8edf2] p-4.5 shadow-sm w-full text-left animate-fade-in">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#e8edf2] px-1">
              <h3 className="text-[11px] font-semibold text-[#8a9bb0] uppercase tracking-wider">
                Featured Promocodes
              </h3>
            </div>

            <div className="flex flex-col gap-2.5">
              {PROMO_CODES.length === 0 ? (
                <div className="text-center py-6 border border-dashed border-gray-200 rounded-[5px]">
                  <p className="text-xs text-gray-400 font-medium">No active promo codes available right now.</p>
                </div>
              ) : (
                PROMO_CODES.map((item, idx) => (
                  <Link 
                    to={`/brands/${item.brandId}`}
                    key={idx} 
                    className="bg-white border border-[#e8edf2]/65 hover:border-[#E8500A]/15 rounded-[5px] p-2.5 hover:shadow-soft transition-all duration-300 group cursor-pointer flex flex-col gap-2 text-left"
                  >
                    {/* Header row with brand details */}
                    <div className="flex items-center justify-between gap-2">
                      <div className="min-w-0">
                        <h4 className="font-sans text-xs font-semibold uppercase tracking-tight text-[#1A1D4E] group-hover:text-[#E8500A] transition-colors truncate">
                          {item.brandName}
                        </h4>
                        <span className="text-[9px] font-bold text-[#E8500A] uppercase tracking-wide">
                          {item.discount}
                        </span>
                      </div>
                      
                      {/* Copy button */}
                      <button 
                        onClick={(e) => {
                          e.preventDefault(); // prevent follow Link navigation
                          e.stopPropagation(); // prevent card container click handler
                          navigator.clipboard.writeText(item.code);
                          toast.success(`Coupon code "${item.code}" copied to clipboard!`);
                        }}
                        className="px-2.5 py-1 bg-[#E8500A]/10 hover:bg-[#E8500A] text-[#E8500A] hover:text-white transition-all cursor-pointer rounded-[5px] text-[8px] font-bold uppercase tracking-wider flex items-center gap-1 shrink-0"
                      >
                        <Copy className="w-2.5 h-2.5" />
                        Copy
                      </button>
                    </div>
                    
                    {/* Code display window */}
                    <div className="bg-gray-50 border border-dashed border-[#e8edf2] rounded-[5px] px-2.5 py-1.5 flex items-center justify-between font-mono text-[9.5px] font-semibold text-gray-650 tracking-wider">
                      <span>{item.code}</span>
                      <span className="text-[7.5px] font-sans font-semibold text-gray-400 uppercase">ACTIVE</span>
                    </div>
                  </Link>
                ))
              )}
            </div>
          </div>

          {/* SPONSOR AD IMAGE CARD */}
          <div className="bg-white rounded-[5px] border border-[#e8edf2] p-4.5 shadow-sm text-[#1a1a2e] text-center relative overflow-hidden w-full">
             <div className="relative z-10 flex flex-col">
                <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#e8edf2] px-1">
                  <h3 className="text-[11px] font-semibold text-[#8a9bb0] uppercase tracking-wider">Sponsored Ad</h3>
                </div>
                
                <div className="w-full aspect-video rounded-[5px] overflow-hidden mb-4 border border-[#e8edf2] shadow-inner shrink-0">
                   <img 
                      src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=620&h=350&fit=crop" 
                      alt="Sponsor AD" 
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-[2s]"
                      referrerPolicy="no-referrer"
                   />
                </div>
                
                <h4 className="font-sans text-xs font-semibold text-[#1a1a2e] uppercase tracking-wider mb-0.5">AARONG HERITAGE</h4>
                <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide mb-3">Traditional Handcrafted Brand</p>
                
                <p className="text-[11px] text-gray-500 font-medium leading-relaxed mb-4 px-1 text-center">
                   New Collection Available. Free Delivery overall Dhaka on purchase above BDT 1,500.
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
