import React, { useState } from 'react';
import { ProductCard } from '../components/ProductCard';
import { Timer, Zap, ArrowRight, ShoppingBag, Bookmark, ExternalLink, ChevronDown, Shirt, Tablets as Gem, Smartphone, Eye, Gamepad2, Utensils, Monitor, Tv, Home, Star, Droplets, BookOpen, Heart, Smile, Car, Compass, Search, ChevronRight, Package, Gift, Award, CalendarDays, XCircle } from 'lucide-react';
import { PRODUCTS, BRANDS } from '../constants';
import { useNavigate, Link } from 'react-router-dom';
import { cn } from '../lib/utils';

export function DealsPage() {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState('Fashion');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('All Deals');

  // ScrollSpy Active section detection for DealsPage major sections
  React.useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 220; // Safe position matching offsets
      
      const brandDealsEl = document.getElementById('featured-brand-deals-section');
      if (brandDealsEl) {
        const top = brandDealsEl.getBoundingClientRect().top + window.pageYOffset;
        const height = brandDealsEl.offsetHeight;
        if (scrollPosition >= top && scrollPosition < top + height) {
          setActiveTab('Brand Deals');
          return;
        }
      }

      const allDealsEl = document.getElementById('all-deals');
      if (allDealsEl) {
        const top = allDealsEl.getBoundingClientRect().top + window.pageYOffset;
        const height = allDealsEl.offsetHeight;
        if (scrollPosition >= top && scrollPosition < top + height) {
          // If we scroll back up into all-deals, fallback to "All Deals" if user is currently on Brand Deals
          setActiveTab(prev => prev === 'Brand Deals' ? 'All Deals' : prev);
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const filteredProducts = React.useMemo(() => {
    let result = [...PRODUCTS];

    if (activeTab === 'Flash Deals') {
      result = result.filter(p => p.id % 2 === 0);
    } else if (activeTab === 'Promo Codes') {
      result = result.filter(p => p.id % 3 === 0);
    } else if (activeTab === 'Brand Deals') {
      result = result.filter(p => p.brand);
    } else if (activeTab === 'Seasonal Campaigns') {
      result = result.filter(p => p.id % 5 === 0);
    } else if (activeTab === 'Expired Deals') {
      result = result.filter(p => p.id % 4 === 1);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(p => 
        p.title.toLowerCase().includes(q) || 
        (p.brand || '').toLowerCase().includes(q) ||
        (p.category || '').toLowerCase().includes(q) ||
        (p.description || '').toLowerCase().includes(q)
      );
    }
    return result;
  }, [searchQuery, activeTab]);

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
      {/* Hero Section - Standardized Centered Alignment */}
      <div className="w-full bg-[#0A0A1F] py-5 md:py-6 px-6 relative overflow-hidden flex flex-col items-center justify-center">
        {/* Background Gradients matching other directory pages */}
        <div className="absolute inset-0 hero-gradient opacity-95" />
        <div className="absolute top-0 right-0 w-1/3 h-full bg-orange-primary/5 blur-[120px] rounded-full translate-x-1/2 -translate-y-1/2" />
        
        <div className="max-w-3xl mx-auto flex flex-col items-center text-center relative z-10 w-full">
          {/* Breadcrumbs */}
          <div className="flex items-center justify-center gap-1.5 text-white/40 text-[9px] font-black uppercase tracking-widest mb-2 w-full">
            <Link to="/" className="hover:text-white transition-colors">Home</Link>
            <ChevronRight size={10} className="text-white/20" />
            <span className="text-white">Deals & Promotions</span>
          </div>

          <div className="bg-orange-primary text-white text-[8px] font-black px-3 py-1 rounded-full mb-1.5 uppercase tracking-[0.2em] shadow-md shadow-orange-primary/30 italic inline-block w-fit">
            FLASH SALE EVENT
          </div>
          
          <h1 className="text-2xl md:text-3.5xl font-black text-white italic uppercase tracking-tighter mb-1.5 leading-none text-center">
            HOTTEST <span className="text-orange-primary">DEALS</span> TODAY
          </h1>

          <p className="text-gray-400 text-[11px] md:text-xs font-medium leading-relaxed mb-2.5 max-w-2xl text-center">
            Discover verified limited-time promotions, exclusive seller invoice discounts, and real-time flash sales happening right now across Bangladesh.
          </p>

          {/* Statistics/Timer Row - Centered inside Hero container */}
          <div className="flex flex-row items-center justify-center gap-4 md:gap-6 w-full mt-1">
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-[12px] py-1.5 px-3 flex items-center gap-3 shadow-lg shrink-0">
              <div className="flex flex-col items-center gap-0.5 shrink-0">
                <Zap size={10} className="text-orange-primary fill-orange-primary" />
                <span className="text-[7px] font-black text-orange-primary uppercase tracking-[0.15em] italic">ENDS IN</span>
              </div>
              <div className="flex items-center gap-1.5">
                {[
                  { val: '10', label: 'HRS' },
                  { val: '10', label: 'MIN' },
                  { val: '10', label: 'SEC' }
                ].map((t, i, arr) => (
                  <React.Fragment key={i}>
                    <div className="flex flex-col items-center gap-0.5">
                      <div className="w-8 h-8 bg-[#000A24] border border-white/15 rounded-md flex items-center justify-center shadow-inner group transition-all hover:border-orange-primary/30">
                        <span className="text-xs font-black text-white font-mono leading-none tracking-tighter">{t.val}</span>
                      </div>
                      <span className="text-[6.5px] font-black text-gray-400 tracking-[0.1em] uppercase italic">{t.label}</span>
                    </div>
                    {i < arr.length - 1 && (
                      <div className="text-white/40 font-black text-xs pb-2">:</div>
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>

            <button 
              onClick={() => navigate('/post-offer')}
              className="group flex items-center gap-2 px-4 py-2.5 bg-white rounded-full transition-all hover:scale-105 hover:shadow-lg active:scale-95 text-navy cursor-pointer"
            >
              <div className="w-6 h-6 rounded-full bg-orange-primary flex items-center justify-center text-white shadow-md group-hover:scale-110 transition-transform">
                <ExternalLink size={11} />
              </div>
              <span className="text-[8.5px] font-black text-navy uppercase tracking-[0.12em] italic">Post Your Deals</span>
            </button>
          </div>
        </div>
      </div>

      {/* Repeating Banner / Marquee - Orange Slide Through style */}
      <div className="w-full bg-orange-primary py-2.5 px-6 overflow-hidden relative z-20">
        <div className="flex items-center gap-12 animate-marquee whitespace-nowrap">
          {Array.from({ length: 12 }).map((_, i) => (
            <span key={i} className="text-white font-black uppercase text-[11px] tracking-[0.3em] italic flex items-center gap-6">
              FREE SHIPPING. EXTRA 15% OFF. LIMITED STOCK.
              <div className="w-1.5 h-1.5 bg-white rounded-full opacity-50" />
            </span>
          ))}
        </div>
      </div>

      {/* GLOBAL STICKY NAVIGATION SYSTEM */}
      <div className="sticky top-[80px] z-30 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm py-4 transition-all duration-300">
        <div className="max-w-[1440px] mx-auto px-6 flex flex-col gap-4">
          
          {/* 1. Search Bar inside Sticky Navigation */}
          <div className="relative w-full max-w-2xl mx-auto bg-gray-50/50 p-1 rounded-full border border-gray-200/80 shadow-inner focus-within:border-[#E8500A]/30 transition-all duration-300">
            <div className="flex items-center bg-white rounded-full">
              <div className="pl-4 text-[#E8500A] shrink-0">
                <Search className="w-4 h-4" />
              </div>
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search deals, brands, categories..." 
                className="w-full h-10 bg-transparent outline-none pl-3 pr-24 text-navy text-xs font-semibold placeholder-gray-500 focus:outline-none focus:ring-0 border-none" 
              />
              <button 
                onClick={() => setSearchQuery(searchQuery)}
                className="absolute right-1.5 top-1.5 bottom-1.5 px-5 rounded-full bg-gradient-to-r from-[#FF5B00] to-[#E8500A] hover:from-[#E8500A] hover:to-[#CF4400] text-white text-[9px] font-black tracking-widest uppercase flex items-center gap-1.5 shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 cursor-pointer border-0"
              >
                Search
              </button>
            </div>
          </div>

          {/* 2. Page Specific Navigation Tabs */}
          <div className="flex items-center justify-start md:justify-center gap-1.5 md:gap-3 overflow-x-auto no-scrollbar py-1 text-[10px] font-black uppercase tracking-wider">
            {[
              { id: 'all-deals', label: "All Deals", icon: <Package size={13} /> },
              { id: 'all-deals', label: "Flash Deals", icon: <Zap size={13} /> },
              { id: 'all-deals', label: "Promo Codes", icon: <Gift size={13} /> },
              { id: 'featured-brand-deals-section', label: "Brand Deals", icon: <Award size={13} /> },
              { id: 'all-deals', label: "Seasonal Campaigns", icon: <CalendarDays size={13} /> },
              { id: 'all-deals', label: "Expired Deals", icon: <XCircle size={13} /> }
            ].map((tab) => (
              <button
                key={tab.label}
                onClick={() => {
                  setActiveTab(tab.label);
                  setTimeout(() => {
                    const el = document.getElementById(tab.id);
                    if (el) {
                      const offset = 220; // safe offset for header + sticky nav
                      const elementPosition = el.getBoundingClientRect().top;
                      const offsetPosition = elementPosition + window.pageYOffset - offset;
                      window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                      });
                    }
                  }, 50);
                }}
                className={cn(
                  "px-5 py-2.5 rounded-full transition-all shrink-0 cursor-pointer flex items-center gap-1.5 font-black uppercase tracking-wider text-[10px]",
                  activeTab === tab.label
                    ? "bg-[#E8500A] text-white shadow-md shadow-[#E8500A]/10 italic border border-transparent"
                    : "bg-white border border-gray-200/85 text-gray-400 hover:text-[#1A1D4E] hover:bg-gray-50/80"
                )}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            ))}
          </div>

        </div>
      </div>

      <main className="w-full bg-[#F3F9FF]/30 min-h-screen">


        {/* Master Flex Column Structure below sticky bar */}
        <div className="max-w-[1440px] mx-auto px-4 py-5 w-full grid grid-cols-1 lg:grid-cols-[240px_minmax(0,1fr)_260px] xl:grid-cols-[280px_minmax(0,1fr)_310px] gap-4 relative">
          
          {/* LEFT SIDEBAR: CATEGORIES CARD */}
          <aside className="hidden lg:flex flex-col gap-4 lg:sticky lg:top-24 pb-10 pr-2 flex-shrink-0 animate-fade-in">
            <div className="bg-white rounded-[5px] p-4.5 border border-[#e8edf2] shadow-sm flex flex-col gap-4">
              <div className="flex flex-col gap-1">
                <h3 className="text-[11px] font-semibold text-[#8a9bb0] uppercase tracking-wider mb-2">
                  <span className="text-orange-primary">CATA</span>GORIES
                </h3>
                <div className="w-full h-px bg-gray-100" />
              </div>

              <div className="flex flex-col gap-1.5">
                {categoriesList.map((cat, i) => {
                  const isActive = activeCategory === cat.name;
                  return (
                    <button 
                      key={i}
                      onClick={() => setActiveCategory(cat.name)}
                      className={cn(
                        "flex items-center gap-4 py-2 bg-transparent rounded-xl w-full text-left group transition-all duration-300",
                        isActive 
                        ? "bg-orange-primary/[0.04] ring-1 ring-orange-primary/10" 
                        : "hover:bg-slate-50/80"
                      )}
                    >
                      {/* Circle Icon Container */}
                      <span className={cn(
                        "w-10 h-10 rounded-full flex items-center justify-center border transition-all duration-300 flex-shrink-0 relative",
                        isActive
                        ? "bg-gradient-to-r from-[#FF5B00] to-[#E8500A] text-white border-orange-primary shadow-sm"
                        : "bg-white text-orange-primary border-gray-100 shadow-inner group-hover:scale-110 group-hover:border-orange-primary/20"
                      )}>
                        {cat.icon}
                      </span>

                      {/* Content Label */}
                      <span className="flex-1 min-w-0">
                        <span className={cn(
                          "text-[11px] font-semibold uppercase tracking-wider transition-colors duration-300 truncate block",
                          isActive ? "text-orange-primary" : "text-navy group-hover:text-orange-primary"
                        )}>
                          {cat.name}
                        </span>
                      </span>

                      {/* Count Badge */}
                      <span className={cn(
                        "px-2.5 py-0.5 rounded-full text-[9px] font-mono font-semibold shrink-0 transition-colors duration-300",
                        isActive
                        ? "bg-orange-primary text-white shadow-sm"
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
          <div className="scroll-mt-36 min-w-0 pb-10 flex flex-col gap-16">
            
            {/* Featured Deals Showcase Grid */}
            <section className="w-full">
              <div className="mb-12 border-l-4 border-orange-primary px-6 flex flex-col md:flex-row md:items-end justify-between gap-6 w-full">
                 <div>
                    <h2 className="text-4xl md:text-5xl font-black text-navy uppercase tracking-tighter italic leading-none mb-2">FEATURED <span className="text-orange-primary">DEALS</span></h2>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.4em] italic">Handpicked Top Offers • Limited Time Selection</p>
                 </div>
                 <div className="flex items-center gap-3 bg-[#F8FAFC] px-6 py-3 rounded-[5px] border border-gray-100 shadow-sm">
                    <ShoppingBag size={16} className="text-navy" />
                    <span className="text-[11px] font-black text-navy uppercase tracking-widest italic">{filteredProducts.length} ITEMS AVAILABLE</span>
                 </div>
              </div>
   
              <div className="flex flex-col gap-10 items-center w-full">
                 {/* Banner Card */}
                 <div className="w-full lg:min-h-[395px] lg:h-auto flex-shrink-0">
                    <ProductCard 
                      product={{
                        ...filteredProducts[0] || PRODUCTS[0],
                        tag: "HOT",
                        tagColor: "bg-[#E93B3B]",
                        originalPrice: "3,500"
                      }} 
                      variant="featured" titleStyle={{ minHeight: '60px', marginBottom: '11px' }}
                      showCountdown={true}
                    />
                 </div>
                 
                 {/* Small Cards Row */}
                 <div className="grid grid-cols-2 md:grid-cols-2 xl:grid-cols-4 gap-6 w-full justify-items-center">
                    {(filteredProducts.length > 1 ? filteredProducts : PRODUCTS).slice(1, 5).map((product, index) => (
                       <div key={product.id} className="w-full max-w-[300px] flex flex-col">
                         <ProductCard 
                           product={{
                             ...product,
                             tag: "SALE",
                             tagColor: "bg-[#E98B8B]",
                           }} 
                           variant="compact"
                           showCountdown={index < 3}
                         />
                       </div>
                    ))}
                 </div>
              </div>
            </section>

            {/* ALL DEALS Section Container */}
            <section id="all-deals" className="py-16 bg-[#F3F9FF]/20 px-6 rounded-[5px] border border-gray-100 text-center w-full">
              <div className="mb-12 border-l-4 border-orange-primary px-6 text-left">
                 <h2 className="text-4xl md:text-5xl font-black text-navy uppercase tracking-tighter italic leading-none mb-2">ALL <span className="text-orange-primary">DEALS</span></h2>
                 <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.4em] italic px-2 border-l-4 border-orange-primary">Browse All Handpicked Offers</p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-y-10 gap-x-6 w-full place-items-center">
                {(filteredProducts.length > 0 ? filteredProducts : PRODUCTS).slice(0, 12).map((product, idx) => (
                  <div key={`${product.id}-${idx}`} className="w-full max-w-[300px] flex flex-col">
                    <ProductCard 
                      product={{
                        ...product,
                        tag: idx % 3 === 0 ? "HOT" : idx % 3 === 1 ? "SALE" : "NEW",
                        tagColor: idx % 3 === 0 ? "bg-[#E93B3B]" : idx % 3 === 1 ? "bg-[#E98B8B]" : "bg-[#7CD93B]",
                      }} 
                      variant="compact"
                      showCountdown={idx < 4}
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
                 <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] italic">Showing {Math.min(12, filteredProducts.length)} of {filteredProducts.length} deals available today</p>
              </div>
            </section>

          </div>

          {/* RIGHT SIDEBAR COLUMN */}
          <aside className="hidden lg:flex flex-col gap-4 lg:sticky lg:top-24 pb-10 pr-2 flex-shrink-0 animate-fade-in">
             {/* Redesigned For Business & Sellers Card */}
             <div 
               id="section-sellers-deals" 
               className="bg-white rounded-[5px] border border-[#e8edf2] p-5 relative overflow-hidden flex flex-col justify-between text-center shrink-0 w-full shadow-sm" 
               style={{ height: '464px' }}
             >
               <div className="absolute top-0 right-0 w-36 h-36 bg-gradient-to-br from-[#E8500A]/5 to-[#1A1D4E]/5 rounded-full blur-2xl pointer-events-none" />
               
               <div className="flex flex-col items-center">
                 <div className="w-10 h-10 rounded-full bg-[#E8500A]/10 text-[#E8500A] flex items-center justify-center mb-3 border border-[#E8500A]/5 shrink-0 shadow-sm">
                   <Star className="w-4 h-4 fill-current" />
                 </div>
                 
                 <h3 className="font-sans text-sm font-semibold uppercase tracking-tight text-[#1A1D4E] leading-snug">
                   For Business <span className="text-[#E8500A]">& Sellers</span>
                 </h3>
                 
                 <p className="text-[11px] text-gray-400 font-semibold mt-2 px-1 leading-relaxed max-w-[220px]">
                   Unlock exclusive tools, secure verified merchant badges, and scale your authentic local reach.
                 </p>
               </div>

               <div className="border border-dashed border-[#E8500A]/20 bg-gradient-to-b from-[#FFF0E8]/20 to-white rounded-[5px] p-4 text-center flex flex-col items-center justify-center my-2 flex-1">
                 <h4 className="font-sans font-semibold text-gray-900 text-xs uppercase tracking-wider mb-1 leading-none">BOOST SALES TODAY</h4>
                 <p className="text-[10px] text-gray-500 mb-4 leading-relaxed max-w-[210px] font-semibold">
                   Gain entry to wholesale deals slots, exposure metrics, and buyer engagement streams.
                 </p>
                 
                 <button 
                   type="button"
                   onClick={() => navigate('/post-offer')}
                   className="w-full py-2.5 bg-[#E8500A] hover:bg-[#CF4400] text-white font-semibold rounded-lg text-[10px] uppercase tracking-wider flex items-center justify-center gap-2 transition-colors shadow-sm cursor-pointer border-0"
                 >
                   POST OFFER <ArrowRight className="w-3.5 h-3.5" />
                 </button>
               </div>

               <div className="flex items-center justify-center gap-1.5 text-[8.5px] font-semibold text-[#8a9bb0] uppercase font-mono tracking-widest shrink-0">
                 <Star className="w-3.5 h-3.5 text-[#E8500A] fill-current" /> 100k+ shopper log Daily
               </div>
             </div>
          </aside>

        </div>

        {/* Featured Brand Deals Section */}
        <section id="featured-brand-deals-section" className="py-20 bg-white px-8 relative overflow-hidden border-t border-gray-100 scroll-mt-36">
          <div className="max-w-7xl mx-auto relative z-10">
             <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
                <div>
                   <h2 className="text-3xl font-semibold text-[#1a1a2e] uppercase tracking-tight leading-none mb-3">Featured <span className="text-[#E8500A]">Brand Deals</span></h2>
                   <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest mb-1 px-2 border-l-4 border-orange-primary">Curated Premium Partner Offers • Limited Time</p>
                </div>
             </div>
             
             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {[BRANDS[0], BRANDS[1], BRANDS[2], BRANDS[8]].map((brand, i) => {
                  return (
                    <div 
                      key={i} 
                      onClick={() => navigate(`/brands/${brand.id}/products`)}
                      className="bg-white rounded-[5px] p-8 flex flex-col items-center text-center gap-6 hover:border-[#E8500A]/30 hover:scale-[1.01] transition-all duration-300 cursor-pointer border border-[#e8edf2] group relative overflow-hidden shadow-none"
                    >
                       <div className="absolute top-0 right-0 w-40 h-40 bg-orange-primary/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl group-hover:scale-125 transition-transform duration-500" />
                       
                       <div className="w-20 h-20 rounded-full bg-gray-50 flex items-center justify-center text-[#1a1a2e] font-semibold text-2xl border border-[#e8edf2] relative z-10">
                          {brand.logo}
                       </div>
                       
                       <div className="flex flex-col items-center gap-2 relative z-10">
                          <h4 className="text-xl font-semibold text-[#1a1a2e] group-hover:text-[#E8500A] transition-colors uppercase tracking-tight leading-tight">{brand.name}</h4>
                          <div className="px-4 py-1.5 bg-[#E8500A] text-white rounded text-[10px] font-semibold uppercase tracking-wider shadow-none">
                             Up to {i % 2 === 0 ? '40%' : '50%'} OFF
                          </div>
                       </div>

                       <div className="w-full h-px bg-gray-50 relative z-10" />

                       <div className="flex items-center gap-3 text-[11px] font-semibold text-[#1a1a2e] uppercase tracking-widest group-hover:text-[#E8500A] transition-colors relative z-10">
                          Grab This Deal <ArrowRight size={16} className="-rotate-45 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                       </div>
                    </div>
                  );
                })}
             </div>
             
             <div className="mt-12 flex justify-center">
                <button 
                  onClick={() => navigate('/brand-deals')}
                  className="px-8 py-3 bg-[#1A1D4E] hover:bg-[#E8500A] text-white text-xs font-semibold uppercase tracking-wider rounded transition-colors shadow-none"
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
