import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowRight, ShoppingBag, ShieldCheck, Tag, Zap, Star, Search, Shirt, Sparkles, AlertCircle, ChevronRight } from 'lucide-react';
import { BRANDS } from '../constants';
import { cn } from '../lib/utils';
import { QuickAccessCard } from '../components/QuickAccessCard';

export function BrandDealsPage() {
  const navigate = useNavigate();
  const [selectedLetter, setSelectedLetter] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('All');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [verificationFilter, setVerificationFilter] = useState<'all' | 'verified' | 'unverified'>('all');
  const [popularityFilter, setPopularityFilter] = useState<'all' | 'high' | 'normal'>('all');

  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

  // Brand and deals filtering logic based on letter, category tab, and search query
  const filteredBrands = React.useMemo(() => {
    return BRANDS.filter(brand => {
      // 1. Alphabet Letter Initial
      const matchesLetter = selectedLetter === null || brand.name.toUpperCase().startsWith(selectedLetter);

      // 2. Category Tab Filter
      let matchesCategoryTab = true;
      if (activeTab === 'Tech') {
        matchesCategoryTab = brand.category === 'Tech' || brand.category === 'Electronics';
      } else if (activeTab === 'Fashion') {
        matchesCategoryTab = brand.category === 'Fashion' || brand.category === 'Sports';
      } else if (activeTab === 'Beauty') {
        matchesCategoryTab = brand.category === 'Beauty';
      } else if (activeTab === 'Ethnic') {
        matchesCategoryTab = brand.category === 'Ethnic';
      }

      // 3. Category Dropdown Filter
      const matchesCategoryDropdown = !selectedCategory || brand.category?.toLowerCase() === selectedCategory.toLowerCase();

      // 4. Verification Check
      let matchesVerification = true;
      if (verificationFilter === 'verified') {
        matchesVerification = brand.id % 2 === 0;
      } else if (verificationFilter === 'unverified') {
        matchesVerification = brand.id % 2 !== 0;
      }

      // 5. Popularity Check
      let matchesPopularity = true;
      if (popularityFilter === 'high') {
        matchesPopularity = brand.rating >= 4.7;
      } else if (popularityFilter === 'normal') {
        matchesPopularity = brand.rating < 4.7;
      }

      // 6. Search Query Filter (Page-level Scoped)
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch = !q || 
        brand.name.toLowerCase().includes(q) || 
        brand.category.toLowerCase().includes(q) ||
        `special exclusive limited discount offer save ${brand.name}`.toLowerCase().includes(q);

      return matchesLetter && matchesCategoryTab && matchesCategoryDropdown && matchesVerification && matchesPopularity && matchesSearch;
    });
  }, [selectedLetter, activeTab, selectedCategory, verificationFilter, popularityFilter, searchQuery]);

  const tabs = [
    { id: 'All', label: "All Offers", icon: <ShoppingBag size={13} /> },
    { id: 'Tech', label: "Tech & Electronics", icon: <Zap size={13} /> },
    { id: 'Fashion', label: "Fashion & Apparel", icon: <Shirt size={13} /> },
    { id: 'Beauty', label: "Health & Beauty", icon: <Sparkles size={13} /> },
    { id: 'Ethnic', label: "Heritage & Ethnic", icon: <Star size={13} /> }
  ];

  return (
    <div className="flex flex-col min-h-screen bg-[#F0F4F9]">
      {/* Hero Section */}
      <div className="w-full bg-[#0A0A1F] relative overflow-hidden shrink-0 border-b border-white/5">
        {/* Background Gradients */}
        <div className="absolute inset-0 hero-gradient opacity-95" />
        <div className="absolute top-0 right-0 w-1/3 h-full bg-orange-primary/5 blur-[120px] rounded-full translate-x-1/2 -translate-y-1/2 pointer-events-none" />
        
        <div className="max-w-[1914px] mx-auto w-full h-[120px] md:h-[130px] lg:h-[160.5px] px-6 flex items-center justify-center text-center relative z-10 animate-fade-in font-sans">
          <div className="w-full flex flex-col justify-center">
            {/* Breadcrumbs */}
            <div className="flex items-center justify-center gap-1.5 text-white/40 text-[9px] font-black uppercase tracking-widest mb-1 w-full">
              <Link to="/" className="hover:text-white transition-colors">Home</Link>
              <ChevronRight size={10} className="text-white/20" />
              <span className="text-white">Brand Deals</span>
            </div>

            <div className="flex items-center justify-center gap-4 flex-wrap">
              <div className="bg-orange-primary text-white text-[8px] font-black px-3 py-1 rounded-full mb-1 uppercase tracking-[0.2em] shadow-md shadow-orange-primary/30 italic inline-block w-fit">
                EXCLUSIVE PARTNER OFFERS
              </div>
              
              <h1 className="text-xl md:text-2xl lg:text-3xl font-black text-white italic uppercase tracking-tighter mb-1 leading-none text-center">
                BRAND WISE <span className="text-orange-primary">DEALS</span>
              </h1>
            </div>

            <p className="text-white/60 text-[9px] lg:text-[11px] max-w-2xl font-bold uppercase tracking-[0.15em] italic leading-relaxed mx-auto">
              Directly sourced offers from official brand outlets and authorized retailers.
            </p>
          </div>
        </div>
      </div>

      {/* GLOBAL STICKY NAVIGATION SYSTEM (MASTER REFERENCE COHESION) */}
      <div className="sticky top-[80px] z-30 bg-white/95 backdrop-blur-md border-b border-gray-150 shadow-sm py-4 transition-all duration-300 font-sans">
        <div className="max-w-[1440px] mx-auto px-6 flex flex-col gap-4 w-full">
          
          {/* 1. Page-Scoped Search Bar */}
          <div className="relative w-full max-w-2xl mx-auto bg-gray-50/50 p-1 rounded-full border border-gray-200/80 shadow-inner focus-within:border-[#E8500A]/30 transition-all duration-300">
            <div className="flex items-center bg-white rounded-full">
              <div className="pl-4 text-[#E8500A] shrink-0">
                <Search className="w-4 h-4" />
              </div>
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search brand deals, promo codes or specific brands..." 
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

          {/* 2. Category Tabs */}
          <div className="flex items-center justify-start md:justify-center gap-1.5 md:gap-3 overflow-x-auto no-scrollbar py-1 text-[10px] font-black uppercase tracking-wider w-full">
            {tabs.map((tab) => (
              <button
                key={tab.label}
                onClick={() => {
                  setActiveTab(tab.id);
                  const el = document.getElementById("brand-deals-main");
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

      {/* GLOBAL HORIZONTAL FILTERS BAR */}
      <div className="bg-[#f8fbfd] border-b border-[#E8EDF2] py-4 transition-all duration-300 font-sans">
        <div className="max-w-[1440px] mx-auto px-6 w-full">
          <div className="flex flex-col gap-2.5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black uppercase tracking-[0.15em] text-[#8a9bb0]">Brand Deals Filters</span>
              {(selectedLetter || selectedCategory || verificationFilter !== 'all' || popularityFilter !== 'all' || searchQuery || activeTab !== 'All') && (
                <button 
                  onClick={() => {
                    setSelectedLetter(null);
                    setSelectedCategory(null);
                    setVerificationFilter('all');
                    setPopularityFilter('all');
                    setSearchQuery('');
                    setActiveTab('All');
                  }}
                  className="text-[9px] font-semibold text-orange-primary uppercase tracking-wider hover:text-red-650 transition-colors cursor-pointer"
                >
                  Reset All Filters
                </button>
              )}
            </div>
            
            {/* Horizontal Scrolling wrapper for filters */}
            <div className="flex flex-row flex-wrap lg:flex-nowrap items-stretch gap-4 overflow-x-auto no-scrollbar pb-1">
              
              {/* Alphabet Index Filter Card */}
              <div className="bg-white rounded-[5px] p-4.5 border border-[#e8edf2] shadow-sm flex flex-col gap-4 text-left font-sans animate-fade-in min-w-[280px] flex-1">
                <div className="flex flex-col gap-1">
                  <h3 className="text-[11px] font-semibold text-[#8a9bb0] uppercase tracking-wider mb-2 leading-none">
                    Filter By <span className="text-orange-primary font-bold">Initial</span>
                  </h3>
                  <div className="w-full h-px bg-gray-155" />
                </div>

                <div className="grid grid-cols-6 gap-1 max-h-32 overflow-y-auto no-scrollbar">
                  <button 
                    onClick={() => setSelectedLetter(null)}
                    className={cn(
                      "col-span-6 py-1.5 rounded-[5px] text-[9px] font-black uppercase tracking-widest transition-all text-center cursor-pointer",
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
                        "h-6 rounded-[5px] text-[10px] font-black transition-all flex items-center justify-center uppercase cursor-pointer",
                        selectedLetter === letter ? "bg-orange-primary text-white shadow-md shadow-orange-primary/10" : "bg-gray-50 text-gray-400 hover:text-navy hover:bg-gray-100/70"
                      )}
                    >
                      {letter}
                    </button>
                  ))}
                </div>
              </div>

              {/* Category Filter Group */}
              <div className="bg-white rounded-[5px] p-4.5 border border-[#e8edf2] shadow-sm flex flex-col gap-3 text-left font-sans min-w-[220px] flex-1">
                <div className="flex items-center justify-between pb-2 mb-1 border-b border-[#e8edf2]">
                  <h3 className="text-[11px] font-semibold text-[#8a9bb0] uppercase tracking-wider">Categories</h3>
                  {selectedCategory && (
                    <span 
                      onClick={() => setSelectedCategory(null)}
                      className="text-[9px] font-semibold text-red-500 uppercase cursor-pointer tracking-wider hover:text-red-600 transition-colors"
                    >
                      Clear
                    </span>
                  )}
                </div>
                <div className="space-y-1.5">
                  {['Electronics', 'Tech', 'Fashion', 'Beauty', 'Sports', 'Ethnic'].map((cat) => {
                    const isActive = selectedCategory === cat;
                    return (
                      <button 
                        key={cat} 
                        onClick={() => setSelectedCategory(isActive ? null : cat)}
                        className={cn(
                          "w-full flex items-center justify-between text-left px-2 py-1 rounded-lg transition-colors group text-xs font-semibold cursor-pointer",
                          isActive ? "bg-orange-primary/10 text-orange-primary font-semibold" : "text-gray-500 hover:bg-gray-50 hover:text-navy"
                        )}
                      >
                        <span>{cat}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Verification status */}
              <div className="bg-white rounded-[5px] p-4.5 border border-[#e8edf2] shadow-sm flex flex-col gap-3 text-left font-sans min-w-[200px]">
                <div className="flex items-center justify-between pb-2 mb-1 border-b border-[#e8edf2]">
                  <h3 className="text-[11px] font-semibold text-[#8a9bb0] uppercase tracking-wider">Verification</h3>
                  {verificationFilter !== 'all' && (
                    <span 
                      onClick={() => setVerificationFilter('all')}
                      className="text-[9px] font-semibold text-red-500 uppercase cursor-pointer tracking-wider hover:text-red-650 transition-colors"
                    >
                      Clear
                    </span>
                  )}
                </div>
                <div className="space-y-1.5">
                  {[
                    { value: 'all', label: 'All Brands' },
                    { value: 'verified', label: 'Verified Partners' },
                    { value: 'unverified', label: 'Standard Outlets' }
                  ].map((item) => (
                    <button 
                      key={item.value} 
                      onClick={() => setVerificationFilter(item.value as any)}
                      className={cn(
                        "w-full flex items-center justify-between text-left px-2 py-1 rounded-lg transition-colors group text-xs font-semibold cursor-pointer",
                        verificationFilter === item.value ? "bg-orange-primary/10 text-orange-primary font-semibold" : "text-gray-500 hover:bg-gray-50 hover:text-navy"
                      )}
                    >
                      <span>{item.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Popularity option card */}
              <div className="bg-white rounded-[5px] p-4.5 border border-[#e8edf2] shadow-sm flex flex-col gap-3 text-left font-sans min-w-[200px]">
                <div className="flex items-center justify-between pb-2 mb-1 border-b border-[#e8edf2]">
                  <h3 className="text-[11px] font-semibold text-[#8a9bb0] uppercase tracking-wider">Popularity</h3>
                  {popularityFilter !== 'all' && (
                    <span 
                      onClick={() => setPopularityFilter('all')}
                      className="text-[9px] font-semibold text-red-500 uppercase cursor-pointer tracking-wider hover:text-red-650 transition-colors"
                    >
                      Clear
                    </span>
                  )}
                </div>
                <div className="space-y-1.5">
                  {[
                    { value: 'all', label: 'All Popularity' },
                    { value: 'high', label: 'Top-Rated (4.7+)' },
                    { value: 'normal', label: 'Regular' }
                  ].map((item) => (
                    <button 
                      key={item.value} 
                      onClick={() => setPopularityFilter(item.value as any)}
                      className={cn(
                        "w-full flex items-center justify-between text-left px-2 py-1 rounded-lg transition-colors group text-xs font-semibold cursor-pointer",
                        popularityFilter === item.value ? "bg-orange-primary/10 text-orange-primary font-semibold" : "text-gray-500 hover:bg-gray-50 hover:text-navy"
                      )}
                    >
                      <span>{item.label}</span>
                    </button>
                  ))}
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>

      {/* CORE THREE-COLUMN SYSTEM LAYOUT INTEGRATION */}
      <div className="w-full bg-[#F3F9FF]/30 min-h-screen py-8">
        <div id="brand-deals-main" className="scroll-mt-36 max-w-[1440px] mx-auto px-4 py-5 w-full grid grid-cols-1 lg:grid-cols-[240px_minmax(0,1fr)_260px] xl:grid-cols-[280px_minmax(0,1fr)_310px] gap-4 items-start relative">
          
          {/* Left Sidebar */}
          <aside className="hidden lg:flex flex-col gap-4 lg:sticky lg:top-24 pb-10 flex-shrink-0 animate-fade-in text-left">
            <QuickAccessCard />
            {/* Promo spotlight card */}
            <div className="bg-gradient-to-br from-[#0A0A1F] to-[#16163F] text-white rounded-[5px] border border-[#ff5b00]/10 p-5 shadow-lg relative overflow-hidden flex flex-col justify-between text-left shrink-0 w-full" style={{ height: '320px' }}>
              <div className="absolute top-0 right-0 w-28 h-28 bg-[#FF5B00]/10 rounded-full blur-2xl pointer-events-none" />
              
              <div>
                <span className="px-2.5 py-1 rounded-[5px] bg-[#FF5B00] text-white text-[8.5px] font-black uppercase tracking-widest italic leading-none">
                  SPOTLIGHT DEAL
                </span>
                <h3 className="font-sans text-lg font-black italic uppercase tracking-tight text-white leading-snug mt-4">
                  EXCLUSIVE S26 <span className="text-[#FF5B00]">BUNDLE PACKS</span>
                </h3>
                <p className="text-[11px] text-white/50 font-semibold mt-2 leading-relaxed">
                  Unlock dynamic distributor pricing structures on Samsung Mobile nodes and premium accessories under distributor backing.
                </p>
              </div>
              
              <button 
                onClick={() => navigate('/brands/1/products')}
                className="w-full py-3 bg-[#FF5B00] hover:bg-[#E8500A] text-white font-black rounded-[5px] text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 transition-all mt-4 italic shadow-md shadow-orange-primary/10 cursor-pointer border-0"
              >
                Explore S26 Deals <ArrowRight size={13} />
              </button>
            </div>

            {/* Platform Compliance Verified badge card */}
            <div className="bg-white rounded-[5px] border border-[#e8edf2] p-4.5 shadow-sm text-left font-sans">
              <h4 className="text-[11px] font-bold text-navy uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <ShieldCheck size={14} className="text-green-500 shrink-0" />
                Verified Sourcing
              </h4>
              <p className="text-[10px] text-gray-400 leading-relaxed font-semibold">
                Each listed discount slot is cross-verified against official brand inventories. No mock promotions, no user redirection loops, 100% direct checkouts.
              </p>
            </div>
          </aside>

          {/* B. MIDDLE COLUMN - BRAND WISE LISTINGS */}
          <main className="min-w-0 space-y-8 font-sans">
            
            {/* Header info bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#e8edf2]">
              <div>
                <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.25em] italic">
                  OFFICIAL STORES • ACTIVE COUPONS
                </h3>
                <h2 className="text-xl font-black text-navy italic uppercase tracking-tighter mt-1">
                  {activeTab === 'All' ? 'ALL BRANDS' : `${activeTab.toUpperCase()} EXTRA`} 
                  {searchQuery && ` SEARCH: "${searchQuery.toUpperCase()}"`}
                  <span className="text-orange-primary"> ({filteredBrands.length} FOUND)</span>
                </h2>
              </div>
              
              {(selectedLetter || searchQuery || activeTab !== 'All' || selectedCategory || verificationFilter !== 'all' || popularityFilter !== 'all') && (
                <button 
                  onClick={() => {
                    setSelectedLetter(null); 
                    setSearchQuery(''); 
                    setActiveTab('All');
                    setSelectedCategory(null);
                    setVerificationFilter('all');
                    setPopularityFilter('all');
                  }}
                  className="text-[9.5px] font-black text-orange-primary uppercase tracking-widest hover:underline flex items-center gap-1.5 transition-all bg-white border border-[#e8edf2] px-3.5 py-2 rounded-[5px] shadow-sm self-start sm:self-auto hover:text-[#CF4400]"
                >
                  Reset All Filters
                </button>
              )}
            </div>

            {/* Active Filter Chips */}
            {(selectedLetter || selectedCategory || verificationFilter !== 'all' || popularityFilter !== 'all') && (
              <div className="flex flex-wrap items-center gap-3">
                {selectedLetter && (
                  <div className="flex items-center gap-2 px-4 py-2 bg-white border border-[#e8edf2] rounded-[5px] text-[10px] font-black text-navy uppercase tracking-widest shadow-sm">
                    Letter: {selectedLetter} 
                    <span className="text-orange-primary cursor-pointer font-black ml-1 scale-110" onClick={() => setSelectedLetter(null)}>×</span>
                  </div>
                )}
                {selectedCategory && (
                  <div className="flex items-center gap-2 px-4 py-2 bg-white border border-[#e8edf2] rounded-[5px] text-[10px] font-black text-navy uppercase tracking-widest shadow-sm">
                    Category: {selectedCategory} 
                    <span className="text-orange-primary cursor-pointer font-black ml-1 scale-110" onClick={() => setSelectedCategory(null)}>×</span>
                  </div>
                )}
                {verificationFilter !== 'all' && (
                  <div className="flex items-center gap-2 px-4 py-2 bg-white border border-[#e8edf2] rounded-[5px] text-[10px] font-black text-navy uppercase tracking-widest shadow-sm">
                    Verification: {verificationFilter === 'verified' ? 'Verified' : 'Standard'} 
                    <span className="text-orange-primary cursor-pointer font-black ml-1 scale-110" onClick={() => setVerificationFilter('all')}>×</span>
                  </div>
                )}
                {popularityFilter !== 'all' && (
                  <div className="flex items-center gap-2 px-4 py-2 bg-white border border-[#e8edf2] rounded-[5px] text-[10px] font-black text-navy uppercase tracking-widest shadow-sm">
                    Popularity: {popularityFilter === 'high' ? 'Top-Rated' : 'Regular'} 
                    <span className="text-orange-primary cursor-pointer font-black ml-1 scale-110" onClick={() => setPopularityFilter('all')}>×</span>
                  </div>
                )}
              </div>
            )}

            {/* Brands listing block */}
            <div className="flex flex-col gap-14">
              {filteredBrands.length > 0 ? (
                filteredBrands.map((brand, idx) => (
                  <div key={brand.id} className="animate-in fade-in slide-in-from-bottom-5 duration-700" style={{ animationDelay: `${idx * 50}ms` }}>
                    {/* Brand header */}
                    <div className="flex items-center justify-between mb-6 pb-3 border-b border-gray-150">
                      <div className="flex items-center gap-4.5">
                        <div className="w-11 h-11 rounded-[5px] bg-white shadow-sm flex items-center justify-center text-navy font-black text-lg border border-gray-150">
                          {brand.logo}
                        </div>
                        <div>
                          <h2 className="text-lg font-black text-[#1A1D4E] uppercase tracking-tight">{brand.name} Deals</h2>
                          <div className="flex items-center gap-1.5 mt-0.5">
                             <ShieldCheck size={11} className="text-green-500" />
                             <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider italic">Authorized Partner Offer</span>
                          </div>
                        </div>
                      </div>
                      <button 
                        onClick={() => navigate(`/brands/${brand.id}/products`)}
                        className="flex items-center gap-1.5 text-orange-primary font-black uppercase text-[10px] tracking-widest hover:gap-2.5 transition-all bg-white border border-[#e8edf2] px-3 py-1.5 rounded-[5px] shadow-xs hover:border-orange-primary/30"
                      >
                        Brand Store <ArrowRight size={11} />
                      </button>
                    </div>

                    {/* Standardized cards grid inside main layout */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 justify-items-stretch">
                      {[1, 2, 3].map((deal) => (
                        <div 
                          key={deal} 
                          onClick={() => navigate(`/brands/${brand.id}/products`)}
                          className="bg-white rounded-[5px] p-6 flex flex-col items-center text-center gap-6 hover:shadow-lg hover:border-orange-primary/20 transition-all cursor-pointer border border-[#e8edf2] group relative overflow-hidden shadow-sm"
                        >
                          <div className="absolute top-0 right-0 w-32 h-32 bg-orange-primary/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl group-hover:scale-125 transition-transform duration-700" />
                          
                          <div className="w-16 h-16 rounded-full bg-[#F8FAFC] flex items-center justify-center text-[#1a1a2e] font-black text-2xl shadow-[inset_0_1px_4px_rgba(0,0,0,0.05)] border border-gray-100 group-hover:scale-105 transition-transform duration-500 relative z-10 shrink-0">
                            {brand.logo}
                          </div>
                          
                          <div className="flex flex-col items-center gap-2 relative z-10 w-full">
                            <h4 className="text-sm font-bold text-navy group-hover:text-orange-primary transition-colors uppercase tracking-tight leading-snug line-clamp-1 w-full">
                              {brand.name} {deal === 1 ? 'Special' : deal === 2 ? 'Exclusive' : 'Limited'}
                            </h4>
                            <div className="px-4 py-1.5 bg-orange-primary text-white rounded-full text-[9px] font-black uppercase tracking-widest shadow-sm shadow-orange-primary/10 group-hover:scale-105 transition-transform inline-block">
                              Up to {idx % 2 === 0 ? '40%' : '50%'} OFF
                            </div>
                          </div>

                          <div className="w-full h-px bg-gray-50 relative z-10" />

                          <div className="flex items-center gap-2 text-[10px] font-black text-navy uppercase tracking-widest italic group-hover:text-orange-primary transition-colors relative z-10">
                            Grab This Offer <ArrowRight size={13} className="-rotate-45 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))
              ) : (
                <div className="bg-white border border-[#e8edf2] rounded-[5px] p-12 text-center flex flex-col items-center gap-4">
                  <AlertCircle size={32} className="text-gray-300 animate-pulse" />
                  <h3 className="text-base font-black text-navy uppercase tracking-tight">No Brand Deals Found</h3>
                  <p className="text-xs text-gray-400 font-semibold max-w-sm">No partners match your selected criteria. Try resetting the search input or alphabet letter filter.</p>
                  <button 
                    onClick={() => {setSelectedLetter(null); setSearchQuery(''); setActiveTab('All');}}
                    className="px-5 py-2.5 bg-orange-primary hover:bg-[#CF4400] text-white text-[10px] font-black uppercase tracking-widest rounded-[5px] transition-all italic shadow-md"
                  >
                    Clear All Filters
                  </button>
                </div>
              )}
            </div>
          </main>

          {/* C. RIGHT COLUMN - OFFERS PROMOTIONS SIDEBAR */}
          <aside className="hidden lg:flex flex-col gap-4 lg:sticky lg:top-24 pb-10 pr-2 flex-shrink-0 animate-fade-in font-sans">
            
            {/* Offline Sourcing Request */}
            <div className="bg-white rounded-[5px] p-5 shadow-sm border border-[#e8edf2] text-left flex flex-col justify-between" style={{ height: '240px' }}>
              <div>
                <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">
                  PARTNER SOLUTIONS
                </span>
                <h4 className="text-xs font-semibold text-navy uppercase tracking-wide leading-none mt-2">
                  REQUEST COUPE TAGS
                </h4>
                <p className="text-[10px] text-gray-400 leading-relaxed font-semibold mt-2.5">
                  Are you managing a distribution node or seeking bulk slot discounts? Request verified platform onboarding tags seamlessly.
                </p>
              </div>
              
              <button 
                onClick={() => navigate('/post-offer')}
                className="w-full py-3 bg-white border-2 border-gray-150 hover:border-navy text-navy font-black rounded-[5px] text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 transition-all italic cursor-pointer"
              >
                Submit Partnership Query
              </button>
            </div>

          </aside>

        </div>
      </div>

      {/* CTA Section */}
      <section className="py-20 bg-navy px-4 md:px-8 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(255,91,0,0.1),transparent_70%)]" />
        <div className="max-w-4xl mx-auto text-center relative z-10 font-sans">
          <h2 className="text-3xl md:text-5xl font-black text-white italic uppercase tracking-tighter mb-8 leading-tight">
            NOT FINDING YOUR <span className="text-orange-primary">FAVORITE BRAND?</span>
          </h2>
          <p className="text-white/40 text-sm md:text-base font-bold uppercase tracking-[0.2em] italic mb-12">
            Suggest a brand or request an offer. We'll verify and bring it to you.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <button className="w-full sm:w-auto px-12 py-5 bg-white text-navy font-black text-[11px] uppercase tracking-widest italic rounded-[5px] hover:bg-orange-primary hover:text-white transition-all shadow-2xl">
              Request A Brand
            </button>
            <button className="w-full sm:w-auto px-12 py-5 bg-navy border-2 border-white/20 text-white font-black text-[11px] uppercase tracking-widest italic rounded-[5px] hover:border-white transition-all">
              Notify Me Of New Deals
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
