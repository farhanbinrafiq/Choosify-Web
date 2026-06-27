import React, { useState } from 'react';
import { Search, Star, Filter, ArrowRight, ExternalLink, ChevronLeft, ChevronRight, CheckCircle2, ShoppingBag, Youtube, Twitter, Facebook, Instagram, Sparkles, PenTool, Users, Heart, Eye, Share2, Flame, Zap, Layers, Award, Gift, Copy } from 'lucide-react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { cn } from '../lib/utils';
import { QuickAccessCard } from '../components/QuickAccessCard';
import { useGlobalState } from '../context/GlobalStateContext';
import { toast } from 'react-hot-toast';
import { CREATORS, Creator } from '../data/creators';
import { DragScrollContainer, UniversalFilterRenderer, QuickFilterBar, ActiveFilterChips, FullSidebarFilterPanel, useRegisterPageFilters } from '../components/FilterEngine';

interface CreatorCollab {
  id: string;
  name: string;
  highlight: string;
  avatar: string;
  bgClass: string;
}

const CREATOR_COLLABS: CreatorCollab[] = [
  { id: 'creator-farhan', name: "Farhan Bin Rafiq", highlight: "PC Build Masterclass Sponsor", avatar: "https://res.cloudinary.com/djdyqr8yd/image/upload/v1781880900/FBR_n3eycm.png", bgClass: "bg-orange-primary/95" },
  { id: 'creator-sarah', name: "Sarah Jenkins", highlight: "Sustainable Monsoons Drop", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&h=300&q=80", bgClass: "bg-navy" },
  { id: 'creator-mily', name: "Mily Rahman", highlight: "Youth Budgeting Workshop", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&h=300&q=80", bgClass: "bg-teal-700" }
];

interface CreatorPromo {
  creatorId: string;
  creatorName: string;
  code: string;
  discount: string;
}

const CREATOR_PROMOS: CreatorPromo[] = [
  { creatorId: 'creator-farhan', creatorName: "Farhan Bin Rafiq", code: "FARHANTECH", discount: "15% OFF Gadgets" },
  { creatorId: 'creator-sarah', creatorName: "Sarah Jenkins", code: "SARAHSTYLE", discount: "10% OFF sustainable wear" },
  { creatorId: 'creator-mily', creatorName: "Mily Rahman", code: "MILYSAVE", discount: "Free personal template" }
];

export function CreatorsPage() {
  const { mode, getCreatorClaimStatus, creatorClaimStatuses } = useGlobalState();
  const [selectedLetter, setSelectedLetter] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('All Creators');
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [verificationFilter, setVerificationFilter] = useState<'all' | 'verified' | 'unverified'>('all');
  const [popularityFilter, setPopularityFilter] = useState<'all' | 'high' | 'normal'>('all');

  // Restore state from sessionStorage on mount
  React.useEffect(() => {
    try {
      const saved = sessionStorage.getItem('choosify_creators_filters');
      if (saved) {
        const filters = JSON.parse(saved);
        if (filters.selectedCategory) setSelectedCategory(filters.selectedCategory);
        if (filters.selectedLetter) setSelectedLetter(filters.selectedLetter);
        if (filters.verificationFilter) setVerificationFilter(filters.verificationFilter);
        if (filters.popularityFilter) setPopularityFilter(filters.popularityFilter);
        if (filters.activeTab) setActiveTab(filters.activeTab);
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  // Save state on updates
  React.useEffect(() => {
    const filters = {
      selectedCategory,
      selectedLetter,
      verificationFilter,
      popularityFilter,
      activeTab
    };
    sessionStorage.setItem('choosify_creators_filters', JSON.stringify(filters));
  }, [selectedCategory, selectedLetter, verificationFilter, popularityFilter, activeTab]);

  // Model-level augmentation matching BrandsPage visual cards rating, reviews structure
  const mappedCreators = React.useMemo(() => {
    return CREATORS.map(c => {
      let rating = 4.7;
      let reviews = 85;
      let isHot = false;
      let isFeatured = false;

      if (c.id === 'creator-farhan') {
        rating = 4.9;
        reviews = 240;
        isHot = true;
      } else if (c.id === 'creator-sarah') {
        rating = 4.8;
        reviews = 190;
        isFeatured = true;
      } else if (c.id === 'creator-mily') {
        rating = 4.9;
        reviews = 150;
        isHot = true;
      } else if (c.id === 'creator-imtiaz') {
        rating = 4.7;
        reviews = 80;
      } else if (c.id === 'creator-shakib') {
        rating = 4.6;
        reviews = 70;
      }

      return {
        ...c,
        rating,
        reviews,
        isHot,
        isFeatured
      };
    });
  }, []);

  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

  // Core reactive filtering logic for creator list
  const filteredCreators = React.useMemo(() => {
    let result = [...mappedCreators];

    // 1. Filter by Active Tab selection
    if (activeTab === 'Trending Creators') {
      result = result.filter(c => c.isHot || c.rating >= 4.7);
    } else if (activeTab === 'Featured Creators') {
      result = result.filter(c => c.isFeatured || c.rating >= 4.8);
    } else if (activeTab === 'Hot Deals Creators') {
      result = result.filter(c => c.isHot);
    } else if (activeTab === 'Top Rated Creators') {
      result = result.filter(c => c.rating >= 4.8);
    }

    // 2. Filter by search query across Name, bestFor, handle, or bio
    const q = searchQuery.toLowerCase().trim();
    if (q) {
      result = result.filter(c => 
        c.name.toLowerCase().includes(q) ||
        (c.bestFor || '').toLowerCase().includes(q) ||
        (c.handle || '').toLowerCase().includes(q) ||
        (c.bio || '').toLowerCase().includes(q)
      );
    }

    // 3. Filter by Selected Letter
    if (selectedLetter) {
      result = result.filter(c => c.name.toUpperCase().startsWith(selectedLetter));
    }

    // 4. Filter by Category
    if (selectedCategory) {
      result = result.filter(c => (c as any).category?.toLowerCase() === selectedCategory.toLowerCase() || (c as any).bestFor?.toLowerCase().includes(selectedCategory.toLowerCase()));
    }

    // 5. Filter by Verification
    if (verificationFilter === 'verified') {
      result = result.filter(c => c.id === 'creator-farhan' || c.id === 'creator-sarah' || c.id === 'creator-mily');
    } else if (verificationFilter === 'unverified') {
      result = result.filter(c => c.id !== 'creator-farhan' && c.id !== 'creator-sarah' && c.id !== 'creator-mily');
    }

    // 6. Filter by Popularity
    if (popularityFilter === 'high') {
      result = result.filter(c => c.rating >= 4.8);
    } else if (popularityFilter === 'normal') {
      result = result.filter(c => c.rating < 4.8);
    }

    return result;
  }, [mappedCreators, searchQuery, selectedLetter, activeTab, selectedCategory, verificationFilter, popularityFilter]);

  const originalFeaturedCreators = React.useMemo(() => [mappedCreators[0], mappedCreators[1], mappedCreators[3]].filter(Boolean), [mappedCreators]);

  const filteredFeaturedCreators = React.useMemo(() => {
    let result = [...originalFeaturedCreators];

    // 1. Filter by Active Tab selection
    if (activeTab === 'Trending Creators') {
      result = result.filter(c => c.isHot || c.rating >= 4.7);
    } else if (activeTab === 'Featured Creators') {
      result = result.filter(c => c.isFeatured || c.rating >= 4.8);
    } else if (activeTab === 'Hot Deals Creators') {
      result = result.filter(c => c.isHot);
    } else if (activeTab === 'Top Rated Creators') {
      result = result.filter(c => c.rating >= 4.8);
    }

    // 2. Filter by search query across Name, bestFor, handle, or bio
    const q = searchQuery.toLowerCase().trim();
    if (q) {
      result = result.filter(c => 
        c.name.toLowerCase().includes(q) ||
        (c.bestFor || '').toLowerCase().includes(q) ||
        (c.handle || '').toLowerCase().includes(q) ||
        (c.bio || '').toLowerCase().includes(q)
      );
    }

    // 3. Filter by Selected Letter
    if (selectedLetter) {
      result = result.filter(c => c.name.toUpperCase().startsWith(selectedLetter));
    }

    // 4. Filter by Category
    if (selectedCategory) {
      result = result.filter(c => (c as any).category?.toLowerCase() === selectedCategory.toLowerCase() || (c as any).bestFor?.toLowerCase().includes(selectedCategory.toLowerCase()));
    }

    // 5. Filter by Verification
    if (verificationFilter === 'verified') {
      result = result.filter(c => c.id === 'creator-farhan' || c.id === 'creator-sarah' || c.id === 'creator-mily');
    } else if (verificationFilter === 'unverified') {
      result = result.filter(c => c.id !== 'creator-farhan' && c.id !== 'creator-sarah' && c.id !== 'creator-mily');
    }

    // 6. Filter by Popularity
    if (popularityFilter === 'high') {
      result = result.filter(c => c.rating >= 4.8);
    } else if (popularityFilter === 'normal') {
      result = result.filter(c => c.rating < 4.8);
    }

    return result;
  }, [originalFeaturedCreators, searchQuery, selectedLetter, activeTab, selectedCategory, verificationFilter, popularityFilter]);

  const groupedCreators = letters.reduce((acc, letter) => {
    const filtered = filteredCreators.filter(c => c.name.toUpperCase().startsWith(letter));
    if (filtered.length > 0) {
      acc[letter] = filtered;
    }
    return acc;
  }, {} as Record<string, typeof filteredCreators[0][]>);

  useRegisterPageFilters({
    pageName: 'Creators',
    renderSearch: () => (
      <div className="relative">
        <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
          <Search size={13} className="text-[#E8500A]" />
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search creators..."
          className="w-full h-9 pl-8 pr-3 bg-white border border-[#e8edf2] rounded-[5px] text-[11px] font-semibold text-[#1A1D4E] placeholder-gray-400 focus:outline-none focus:border-[#E8500A]/50 transition-colors"
        />
      </div>
    ),
    quickFilters: [
      { id: 'verified', label: '✓ Verified Expert', active: verificationFilter === 'verified', onClick: () => setVerificationFilter(verificationFilter === 'verified' ? 'all' : 'verified') },
      { id: 'high-eng', label: '🔥 High Engagement (4.8+)', active: popularityFilter === 'high', onClick: () => setPopularityFilter(popularityFilter === 'high' ? 'all' : 'high') },
      { id: 'tech', label: '💻 Tech Niches', active: selectedCategory === 'Tech & Gaming', onClick: () => setSelectedCategory(selectedCategory === 'Tech & Gaming' ? null : 'Tech & Gaming') },
      { id: 'fashion', label: '👗 Fashion Influencer', active: selectedCategory === 'Fashion & Beauty', onClick: () => setSelectedCategory(selectedCategory === 'Fashion & Beauty' ? null : 'Fashion & Beauty') }
    ],
    renderFilters: () => (
      <div className="flex flex-col gap-4">
        <UniversalFilterRenderer
          profile={{
            entity: 'creators',
            filters: [
              {
                id: 'niche',
                name: 'Creator Niche Mode',
                type: 'single_select',
                options: [
                  { value: 'all', label: 'All Niches' },
                  ...['Tech & Gaming', 'Fashion & Beauty', 'Food & Lifestyle', 'Sustainable Wear', 'Youth Budgeting', 'Creative Writing'].map(cat => ({ value: cat, label: cat }))
                ]
              },
              {
                id: 'verification',
                name: 'Expert verification',
                type: 'single_select',
                options: [
                  { value: 'all', label: 'All Claim Statuses' },
                  { value: 'verified', label: 'Verified Experts Only' },
                  { value: 'unverified', label: 'Independent' }
                ]
              },
              {
                id: 'engagement',
                name: 'Engagement Flow',
                type: 'single_select',
                options: [
                  { value: 'all', label: 'All Engagements' },
                  { value: 'high', label: 'Top Engagement (4.8+)' },
                  { value: 'normal', label: 'Standard Tier' }
                ]
              }
            ]
          }}
          activeFilters={{
            niche: selectedCategory || 'all',
            verification: verificationFilter,
            engagement: popularityFilter
          }}
          onFilterChange={(filterId, value) => {
            if (filterId === 'niche') {
              setSelectedCategory(value === 'all' || !value ? null : value);
            } else if (filterId === 'verification') {
              setVerificationFilter(value as any);
            } else if (filterId === 'engagement') {
              setPopularityFilter(value as any);
            }
          }}
        />

        {/* Alpha Search (A-Z) */}
        <div className="bg-white rounded-[5px] p-4.5 border border-[#e8edf2] shadow-sm flex flex-col gap-2">
          <h3 className="text-[11px] font-black text-[#8a9bb0] uppercase tracking-wider mb-2">Alpha Search (A-Z)</h3>
          <div className="grid grid-cols-5 gap-1.5 max-h-32 overflow-y-auto no-scrollbar">
            <button 
              onClick={() => setSelectedLetter(null)}
              className={cn(
                "col-span-5 py-1.5 rounded-[5px] text-[8.5px] font-bold uppercase transition-all text-center cursor-pointer",
                selectedLetter === null ? "bg-orange-primary text-white" : "bg-gray-50 text-gray-400 hover:bg-gray-100"
              )}
            >
              All Initials
            </button>
            {'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').map((letter) => (
              <button 
                key={letter} 
                onClick={() => setSelectedLetter(letter)}
                className={cn(
                  "h-5.5 rounded-[5px] text-[9.5px] font-black transition-all flex items-center justify-center uppercase cursor-pointer",
                  selectedLetter === letter ? "bg-orange-primary text-white" : "bg-gray-50 text-gray-400 hover:bg-gray-100"
                )}
              >
                {letter}
              </button>
            ))}
          </div>
        </div>
      </div>
    ),
    activeFilterCount: (selectedCategory ? 1 : 0) +
      (selectedLetter ? 1 : 0) +
      (verificationFilter !== 'all' ? 1 : 0) +
      (popularityFilter !== 'all' ? 1 : 0) +
      (searchQuery ? 1 : 0),
    onClearAll: () => {
      setSelectedLetter(null); 
      setSearchQuery(''); 
      setActiveTab('All Creators');
      setSelectedCategory(null);
      setVerificationFilter('all');
      setPopularityFilter('all');
    },
  }, [selectedLetter, searchQuery, activeTab, selectedCategory, verificationFilter, popularityFilter]);

  return (
    <div className="flex flex-col min-h-screen bg-choosify-feed">
      {/* Hero Section */}
      <div className="w-full bg-[#0A0A1F] relative overflow-hidden shrink-0 border-b border-white/5">
        {/* Background Gradients */}
        <div className="absolute inset-0 hero-gradient opacity-95" />
        <div className="absolute top-0 right-0 w-1/3 h-full bg-orange-primary/5 blur-[120px] rounded-full translate-x-1/2 -translate-y-1/2 pointer-events-none" />
        
        <div className="max-w-[1914px] mx-auto w-full h-[120px] md:h-[130px] lg:h-[160.5px] px-6 flex items-center justify-center text-center relative z-10 animate-fade-in">
          <div className="w-full flex flex-col justify-center">
            {mode === 'wholesale' ? (
              <h1 className="text-[20px] md:text-[24px] lg:text-[28px] font-black italic uppercase tracking-tighter mb-1 leading-none">
                <span className="text-[#FF5B00]">B2B CREATORS</span> <span className="text-white">DIRECTORY</span>
              </h1>
            ) : (
              <h1 className="text-[20px] md:text-[24px] lg:text-[28px] font-black italic uppercase tracking-tighter mb-1 leading-none">
                <span className="text-orange-primary">CREATORS</span> <span className="text-white">DIRECTORY</span>
              </h1>
            )}
            
            {/* Text-only Carousel (PRD Requirement) */}
            <div className="w-full overflow-hidden mb-1.5 py-0.5 border-y border-white/5 relative">
              <motion.div 
                 animate={{ x: [0, -1000] }}
                 transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
                 className="flex whitespace-nowrap gap-8"
              >
                 {['Farhan Bin Rafiq', 'Sarah Jenkins', 'Imtiaz Ahmed', 'Mily Rahman', 'Shakib Al-Mridha', 'Farhan Bin Rafiq', 'Sarah Jenkins', 'Imtiaz Ahmed', 'Mily Rahman', 'Shakib Al-Mridha'].map((name, i) => (
                   <span key={i} className="text-base lg:text-xl font-black text-white/5 italic uppercase tracking-tighter hover:text-orange-primary transition-all cursor-default">
                      {name}
                   </span>
                 ))}
                 {['Farhan Bin Rafiq', 'Sarah Jenkins', 'Imtiaz Ahmed', 'Mily Rahman', 'Shakib Al-Mridha', 'Farhan Bin Rafiq', 'Sarah Jenkins', 'Imtiaz Ahmed', 'Mily Rahman', 'Shakib Al-Mridha'].map((name, i) => (
                   <span key={i} className="text-base lg:text-xl font-black text-white/5 italic uppercase tracking-tighter hover:text-orange-primary transition-all cursor-default">
                      {name}
                   </span>
                 ))}
              </motion.div>
            </div>

            <p className="text-white/70 max-w-2xl mx-auto font-bold italic text-[8px] lg:text-[9.5px] mb-0 uppercase tracking-wide opacity-80 leading-tight">
              Discover verified local experts & digital curators in Bangladesh. Send structured briefs directly—no platform middleman.
            </p>
          </div>
        </div>
      </div>

      {/* GLOBAL STICKY NAVIGATION SYSTEM */}
      <div className="relative z-10 bg-white/95 border-b border-gray-150 shadow-sm py-4 transition-all duration-300">
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
                placeholder="Search creators..." 
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
              { id: 'All Creators', label: "All Creators", icon: <Layers size={13} /> },
              { id: 'Trending Creators', label: "Trending Creators", icon: <Flame size={13} /> },
              { id: 'Featured Creators', label: "Featured Creators", icon: <Sparkles size={13} /> },
              { id: 'Hot Deals Creators', label: "Hot Deals Creators", icon: <Zap size={13} /> },
              { id: 'Top Rated Creators', label: "Top Rated Creators", icon: <Star size={13} /> }
            ].map((tab) => (
              <button
                key={tab.label}
                onClick={() => {
                  setActiveTab(tab.id);
                  const el = document.getElementById("creators-main-display");
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
      </div>      {/* LAYER 1: QUICK FILTER BAR */}
      <QuickFilterBar
        title="Creators Quick Specs"
        onOpenFullFilters={() => {
          const el = document.getElementById("creators-sidebar-filters");
          if (el) {
            el.scrollIntoView({ behavior: 'smooth', block: 'center' });
            el.classList.add("ring-2", "ring-orange-primary/50");
            setTimeout(() => el.classList.remove("ring-2", "ring-orange-primary/50"), 1500);
          }
        }}
        filters={[
          { id: 'verified', label: '✓ Verified Expert', active: verificationFilter === 'verified', onClick: () => setVerificationFilter(verificationFilter === 'verified' ? 'all' : 'verified') },
          { id: 'high-eng', label: '🔥 High Engagement (4.8+)', active: popularityFilter === 'high', onClick: () => setPopularityFilter(popularityFilter === 'high' ? 'all' : 'high') },
          { id: 'tech', label: '💻 Tech Niches', active: selectedCategory === 'Tech & Gaming', onClick: () => setSelectedCategory(selectedCategory === 'Tech & Gaming' ? null : 'Tech & Gaming') },
          { id: 'fashion', label: '👗 Fashion Influencer', active: selectedCategory === 'Fashion & Beauty', onClick: () => setSelectedCategory(selectedCategory === 'Fashion & Beauty' ? null : 'Fashion & Beauty') }
        ]}
      />

      {/* ACTIVE FILTER CHIPS ROW */}
      <ActiveFilterChips
        chips={[
          selectedCategory ? { id: 'category', label: `Niche: ${selectedCategory}`, onRemove: () => setSelectedCategory(null) } : null,
          selectedLetter ? { id: 'letter', label: `Starts with: ${selectedLetter}`, onRemove: () => setSelectedLetter(null) } : null,
          verificationFilter !== 'all' ? { id: 'verification', label: `Verification: ${verificationFilter}`, onRemove: () => setVerificationFilter('all') } : null,
          popularityFilter !== 'all' ? { id: 'engagement', label: `Engagement: ${popularityFilter}`, onRemove: () => setPopularityFilter('all') } : null
        ].filter(Boolean) as any[]}
        onClearAll={() => {
          setSelectedLetter(null); 
          setSearchQuery(''); 
          setActiveTab('All Creators');
          setSelectedCategory(null);
          setVerificationFilter('all');
          setPopularityFilter('all');
        }}
      />

      <div className="max-w-[1440px] mx-auto px-4 py-5 w-full grid grid-cols-1 lg:grid-cols-[240px_minmax(0,1fr)_260px] xl:grid-cols-[280px_minmax(0,1fr)_310px] gap-4 relative">
        
        {/* Left Sidebar */}
        <aside className="hidden lg:flex flex-col gap-4 lg:sticky lg:top-24 pb-10 flex-shrink-0 animate-fade-in text-left">
          {/* LEFT COLUMN SEARCH BAR */}
          <div className="relative">
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
              <Search size={13} className="text-[#E8500A]" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search creators..."
              className="w-full h-9 pl-8 pr-3 bg-white border border-[#e8edf2] rounded-[5px] text-[11px] font-semibold text-[#1A1D4E] placeholder-gray-400 focus:outline-none focus:border-[#E8500A]/50 transition-colors shadow-sm"
            />
          </div>

          <QuickAccessCard />

          {/* LAYER 2: FULL SIDEBAR FILTER PANEL */}
          <div id="creators-sidebar-filters" className="transition-all duration-300 rounded-[5px] w-full">
            <FullSidebarFilterPanel
              title="Filter Creators"
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              searchPlaceholder="Search creators, niche, handle or bio..."
              quickFilters={
                <QuickFilterBar
                  title="Creators Quick Specs"
                  onOpenFullFilters={() => {}}
                  filters={[
                    { id: 'verified', label: '✓ Verified Expert', active: verificationFilter === 'verified', onClick: () => setVerificationFilter(verificationFilter === 'verified' ? 'all' : 'verified') },
                    { id: 'high-eng', label: '🔥 High Engagement (4.8+)', active: popularityFilter === 'high', onClick: () => setPopularityFilter(popularityFilter === 'high' ? 'all' : 'high') },
                    { id: 'tech', label: '💻 Tech Niches', active: selectedCategory === 'Tech & Gaming', onClick: () => setSelectedCategory(selectedCategory === 'Tech & Gaming' ? null : 'Tech & Gaming') },
                    { id: 'fashion', label: '👗 Fashion Influencer', active: selectedCategory === 'Fashion & Beauty', onClick: () => setSelectedCategory(selectedCategory === 'Fashion & Beauty' ? null : 'Fashion & Beauty') }
                  ]}
                />
              }
              activeChips={
                <ActiveFilterChips
                  chips={[
                    selectedCategory ? { id: 'category', label: `Niche: ${selectedCategory}`, onRemove: () => setSelectedCategory(null) } : null,
                    selectedLetter ? { id: 'letter', label: `Starts with: ${selectedLetter}`, onRemove: () => setSelectedLetter(null) } : null,
                    verificationFilter !== 'all' ? { id: 'verification', label: `Verification: ${verificationFilter}`, onRemove: () => setVerificationFilter('all') } : null,
                    popularityFilter !== 'all' ? { id: 'engagement', label: `Engagement: ${popularityFilter}`, onRemove: () => setPopularityFilter('all') } : null
                  ].filter(Boolean) as any[]}
                  onClearAll={() => {
                    setSelectedLetter(null); 
                    setSearchQuery(''); 
                    setActiveTab('All Creators');
                    setSelectedCategory(null);
                    setVerificationFilter('all');
                    setPopularityFilter('all');
                  }}
                />
              }
              onReset={() => {
                setSelectedLetter(null); 
                setSearchQuery(''); 
                setActiveTab('All Creators');
                setSelectedCategory(null);
                setVerificationFilter('all');
                setPopularityFilter('all');
              }}
              advancedSection={
                <div className="flex flex-col gap-4">
                  {/* Initial Index selection A-Z */}
                  <div className="bg-white rounded-[5px] p-4.5 border border-[#e8edf2] shadow-sm flex flex-col gap-2">
                    <h3 className="text-[11px] font-black text-[#8a9bb0] uppercase tracking-wider mb-2">Alpha Search (A-Z)</h3>
                    <div className="grid grid-cols-5 gap-1.5 max-h-32 overflow-y-auto no-scrollbar">
                      <button 
                        onClick={() => setSelectedLetter(null)}
                        className={cn(
                          "col-span-5 py-1.5 rounded-[5px] text-[8.5px] font-bold uppercase transition-all text-center cursor-pointer",
                          selectedLetter === null ? "bg-orange-primary text-white" : "bg-gray-50 text-gray-400 hover:bg-gray-100"
                        )}
                      >
                        All Initials
                      </button>
                      {'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').map((letter) => (
                        <button 
                          key={letter} 
                          onClick={() => setSelectedLetter(letter)}
                          className={cn(
                            "h-5.5 rounded-[5px] text-[9.5px] font-black transition-all flex items-center justify-center uppercase cursor-pointer",
                            selectedLetter === letter ? "bg-orange-primary text-white" : "bg-gray-50 text-gray-400 hover:bg-gray-100"
                          )}
                        >
                          {letter}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              }
            >
              <UniversalFilterRenderer
                profile={{
                  entity: 'creators',
                  filters: [
                    {
                      id: 'niche',
                      name: 'Creator Niche Mode',
                      type: 'single_select',
                      options: [
                        { value: 'all', label: 'All Niches' },
                        ...['Tech & Gaming', 'Fashion & Beauty', 'Food & Lifestyle', 'Sustainable Wear', 'Youth Budgeting', 'Creative Writing'].map(cat => ({ value: cat, label: cat }))
                      ]
                    },
                    {
                      id: 'verification',
                      name: 'Expert verification',
                      type: 'single_select',
                      options: [
                        { value: 'all', label: 'All Claim Statuses' },
                        { value: 'verified', label: 'Verified Experts Only' },
                        { value: 'unverified', label: 'Independent' }
                      ]
                    },
                    {
                      id: 'engagement',
                      name: 'Engagement Flow',
                      type: 'single_select',
                      options: [
                        { value: 'all', label: 'All Engagements' },
                        { value: 'high', label: 'Top Engagement (4.8+)' },
                        { value: 'normal', label: 'Standard Tier' }
                      ]
                    }
                  ]
                }}
                activeFilters={{
                  niche: selectedCategory || 'all',
                  verification: verificationFilter,
                  engagement: popularityFilter
                }}
                onFilterChange={(filterId, value) => {
                  if (filterId === 'niche') {
                    setSelectedCategory(value === 'all' || !value ? null : value);
                  } else if (filterId === 'verification') {
                    setVerificationFilter(value as any);
                  } else if (filterId === 'engagement') {
                    setPopularityFilter(value as any);
                  }
                }}
              />
            </FullSidebarFilterPanel>
          </div>
          {/* BUSINESS SELLERS INFO CARD */}
          <div 
            id="section-sellers-brands" 
            className="w-full bg-white rounded-[5px] border border-[#e8edf2] p-5 shadow-sm relative overflow-hidden flex flex-col justify-between text-center shrink-0 mx-auto" 
            style={{ height: '410px' }}
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#E8500A]/5 to-[#1A1D4E]/5 rounded-full blur-2xl pointer-events-none" />
            
            <div className="flex flex-col items-center">
              <div className="w-10 h-10 rounded-full bg-[#E8500A]/10 text-[#E8500A] flex items-center justify-center mb-3 border border-[#E8500A]/5 shrink-0 shadow-sm">
                <Sparkles className="w-5 h-5" />
              </div>
              
              <h3 className="font-sans text-sm font-semibold uppercase tracking-tight text-[#1A1D4E] leading-snug">
                For Brands <span className="text-[#E8500A] italic">& Agencies</span>
              </h3>
              
              <p className="text-[11px] text-gray-400 font-semibold mt-2 px-1 leading-relaxed max-w-[220px]">
                Unlock seamless campaign briefs, secure direct responses, and target key influencers in Bangladesh.
              </p>
            </div>

            <div className="border border-dashed border-[#E8500A]/20 bg-gradient-to-b from-[#FFF0E8]/20 to-white rounded-[5px] p-4 text-center flex flex-col items-center justify-center my-2 flex-1">
              <h4 className="font-sans font-semibold text-gray-900 text-xs uppercase tracking-wider mb-1 leading-none">POST CAMPAIGN BRIEFS</h4>
              <p className="text-[10px] text-gray-500 mb-4 leading-relaxed max-w-[210px] font-semibold">
                Submit campaign details to top ranking tech, fashion, lifestyle, and financial creators.
              </p>
              
              <Link 
                to="/post-offer" 
                className="w-full py-2.5 bg-[#E8500A] hover:bg-[#CF4400] text-white font-semibold rounded-lg text-[10px] uppercase tracking-wider flex items-center justify-center gap-2 transition-colors shadow-sm"
              >
                POST BRIEF <PenTool className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="flex items-center justify-center gap-1 text-[8.5px] font-semibold text-gray-400 uppercase font-mono tracking-widest shrink-0">
              <Users className="w-3.5 h-3.5 text-gray-400" /> 100k+ shoppers daily
            </div>
          </div>

          {/* SPONSOR AD IMAGE CARD */}
          <div className="bg-white rounded-[5px] border border-[#e8edf2] p-4 shadow-sm text-[#1a1a2e] text-center relative overflow-hidden w-full">
             <div className="relative z-10 flex flex-col">
                <div className="flex items-center justify-between pb-2 mb-3 border-b border-[#e8edf2] px-1">
                  <h3 className="text-[10px] font-semibold text-[#8a9bb0] uppercase tracking-wider">Sponsored Ad</h3>
                </div>
                
                <div className="w-full aspect-video rounded-[5px] overflow-hidden mb-3 border border-[#e8edf2] shadow-inner shrink-0">
                   <img 
                      src="https://images.unsplash.com/photo-1542751371-adc38448a05e?w=620&h=350&fit=crop" 
                      alt="Sponsor AD" 
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-[2s]"
                      referrerPolicy="no-referrer"
                   />
                </div>
                
                <h4 className="font-sans text-[11.5px] font-semibold text-[#1a1a2e] uppercase tracking-wider mb-0.5">CREATORS MASTERCLASS</h4>
                <p className="text-[9.5px] font-semibold text-gray-400 uppercase tracking-wide mb-3">Scale Your Digital Influence</p>
                
                <button className="w-full py-2 bg-[#E8500A] hover:bg-[#CF4400] text-white font-semibold rounded-lg text-[10px] uppercase tracking-wider flex items-center justify-center gap-2 transition-colors shadow-sm cursor-pointer border-0">
                   Register Now
                </button>
             </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <main id="creators-main-display" className="scroll-mt-36 min-w-0 pb-10 space-y-6">
          {/* Header info bar (Unified list view) */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#e8edf2] font-sans">
            <div>
              <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.25em] italic leading-none">
                OUR PARTNERS • CREATOR DIRECTORY
              </h3>
              <h2 className="text-xl font-black text-[#1A1D4E] italic uppercase tracking-tighter mt-2 leading-none">
                {activeTab === 'All Creators' ? 'ALL CREATORS' : activeTab.toUpperCase()}
                {selectedLetter && ` • STARTING WITH "${selectedLetter}"`}
                {searchQuery && ` • SEARCH: "${searchQuery.toUpperCase()}"`}
                <span className="text-orange-primary"> ({filteredCreators.length} FOUND)</span>
              </h2>
            </div>
            
            {(selectedLetter || searchQuery || activeTab !== 'All Creators' || selectedCategory || verificationFilter !== 'all' || popularityFilter !== 'all') && (
              <button 
                onClick={() => {
                  setSelectedLetter(null); 
                  setSearchQuery(''); 
                  setActiveTab('All Creators');
                  setSelectedCategory(null);
                  setVerificationFilter('all');
                  setPopularityFilter('all');
                }}
                className="text-[9.5px] font-black text-orange-primary uppercase tracking-widest hover:underline flex items-center gap-1.5 transition-all bg-white border border-[#e8edf2] px-3.5 py-2 rounded-[5px] shadow-sm self-start sm:self-auto hover:text-[#CF4400] cursor-pointer"
              >
                Reset All Filters
              </button>
            )}
          </div>

          {/* Active Filter Chips */}
          {(selectedLetter || selectedCategory || verificationFilter !== 'all' || popularityFilter !== 'all') && (
            <div className="flex flex-wrap items-center gap-3 font-sans">
              {selectedLetter && (
                <div className="flex items-center gap-2 px-4 py-2 bg-white border border-[#e8edf2] rounded-[5px] text-[10px] font-black text-navy uppercase tracking-widest shadow-sm">
                  Letter: {selectedLetter} 
                  <span className="text-orange-primary cursor-pointer font-black ml-1 scale-110" onClick={() => setSelectedLetter(null)}>×</span>
                </div>
              )}
              {selectedCategory && (
                <div className="flex items-center gap-2 px-4 py-2 bg-white border border-[#e8edf2] rounded-[5px] text-[10px] font-black text-navy uppercase tracking-widest shadow-sm">
                  Niche: {selectedCategory} 
                  <span className="text-orange-primary cursor-pointer font-black ml-1 scale-110" onClick={() => setSelectedCategory(null)}>×</span>
                </div>
              )}
              {verificationFilter !== 'all' && (
                <div className="flex items-center gap-2 px-4 py-2 bg-white border border-[#e8edf2] rounded-[5px] text-[10px] font-black text-navy uppercase tracking-widest shadow-sm">
                  Verification: {verificationFilter === 'verified' ? 'Verified Experts' : 'Independent'} 
                  <span className="text-orange-primary cursor-pointer font-black ml-1 scale-110" onClick={() => setVerificationFilter('all')}>×</span>
                </div>
              )}
              {popularityFilter !== 'all' && (
                <div className="flex items-center gap-2 px-4 py-2 bg-white border border-[#e8edf2] rounded-[5px] text-[10px] font-black text-navy uppercase tracking-widest shadow-sm">
                  Engagement: {popularityFilter === 'high' ? 'Top Engagement' : 'Regular'} 
                  <span className="text-orange-primary cursor-pointer font-black ml-1 scale-110" onClick={() => setPopularityFilter('all')}>×</span>
                </div>
              )}
            </div>
          )}

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
                    All Creators
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
          {filteredFeaturedCreators.length > 0 && (
            <div className="mb-12">
              <div className="flex items-center gap-4 mb-8 overflow-hidden">
                <div className="flex items-center gap-3 choosify-dark-gradient px-5 py-2.5 rounded-full shadow-lg shadow-orange-primary/10 flex-shrink-0 border border-white/10">
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
                <span className="text-[10px] font-black text-[#5C2AFE] uppercase tracking-widest whitespace-nowrap">
                  {filteredFeaturedCreators.length} Creator{filteredFeaturedCreators.length !== 1 ? 's' : ''}
                </span>
                <div className="flex-1 h-px bg-orange-primary/20" />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 justify-items-center justify-center w-full">
                {filteredFeaturedCreators.map((creator, i) => (
                  <motion.div 
                    layout
                    key={creator.id} 
                    className="bg-white rounded-[5px] p-5 border border-[#e8edf2] hover:border-orange-primary/30 hover:scale-[1.01] transition-all duration-300 relative group flex flex-col justify-between overflow-hidden mx-auto shadow-xs"
                    style={{ width: '100%', maxWidth: '250px', height: '280px' }}
                  >
                    {creator.isHot && (
                      <div className="absolute top-5 right-5 bg-red-500 text-white text-[8px] font-black px-2.5 py-1 rounded-full uppercase tracking-[0.2em] shadow-xl z-20 italic font-sansLabel">HOT</div>
                    )}
                    {creator.isFeatured && (
                      <div className="absolute top-5 right-5 bg-orange-primary text-white text-[8px] font-black px-2.5 py-1 rounded-full uppercase tracking-[0.2em] shadow-xl z-20 italic font-sansLabel">FEATURED</div>
                    )}

                    {/* Horizontal Header System */}
                    <div className="flex gap-3 items-start relative z-10 text-left w-full">
                      <div className="w-14 h-14 rounded-lg bg-gray-50 flex items-center justify-center overflow-hidden flex-shrink-0 border border-gray-100 p-0 shadow-xs relative object-cover">
                         <img src={creator.avatar} className="w-full h-full object-cover relative z-10" alt={creator.name} referrerPolicy="no-referrer" />
                      </div>
                      <div className={cn("flex flex-col min-w-0 flex-1", (creator.isHot || creator.isFeatured) && "pr-10")}>
                        <h3 className="text-sm font-black text-navy leading-tight mb-0.5 group-hover:text-orange-primary transition-colors italic uppercase tracking-tighter truncate">{creator.name}</h3>
                        <div className="flex items-center gap-1 mb-1.5 flex-wrap">
                          {getCreatorClaimStatus(creator.id) === 'verified' && (
                            <span className="inline-flex items-center px-1.5 py-0.5 bg-green-50 text-[7px] font-black text-green-700 rounded-xs uppercase tracking-wider scale-90 origin-left border border-green-200/50">✓ Verified Creator</span>
                          )}
                          {getCreatorClaimStatus(creator.id) === 'pending' && (
                            <span className="inline-flex items-center px-1.5 py-0.5 bg-amber-50 text-[7px] font-black text-amber-700 rounded-xs uppercase tracking-wider scale-90 origin-left border border-amber-200/50 animate-pulse">● Pending Claim</span>
                          )}
                          {getCreatorClaimStatus(creator.id) === 'community' && (
                            <span className="inline-flex items-center px-1.5 py-0.5 bg-gray-50 text-[7px] font-black text-gray-500 rounded-xs uppercase tracking-wider scale-90 origin-left border border-gray-200/50 border-dashed">Community Creator</span>
                          )}
                        </div>
                        <p className="text-[9px] font-bold text-gray-400 mb-1.5 truncate uppercase tracking-wide opacity-80 leading-relaxed">{creator.handle}</p>
                        <div className="flex items-center gap-1">
                          <div className="flex gap-0.5">
                            {[1, 2, 3, 4, 5].map(s => (
                              <Star key={s} size={8} className={cn("fill-orange-primary stroke-orange-primary", s > Math.floor(creator.rating) && "fill-gray-200 stroke-gray-200")} />
                            ))}
                          </div>
                          <span className="text-[9px] font-black text-navy italic ml-0.5">{creator.rating}</span>
                          <span className="text-[8px] font-bold text-gray-300 ml-0.5">({creator.reviews})</span>
                        </div>
                      </div>
                    </div>

                    {/* Content Spacer */}
                    <div className="flex-1" />

                    <div className="w-full h-[1px] bg-gray-50 my-3 mt-auto" />

                    {/* Adapted Grid Content */}
                    <div className="grid grid-cols-3 gap-2">
                      <div className="text-center bg-gray-50/50 py-1.5 rounded-lg border border-gray-100/50 min-w-0">
                        <span className="block text-[7px] font-black text-navy mb-0.5 uppercase tracking-tighter opacity-60">Best For</span>
                        <span className="block text-[8px] font-bold text-red-500 italic uppercase truncate px-0.5">{creator.bestFor}</span>
                      </div>
                      <div className="text-center bg-gray-50/50 py-1.5 rounded-lg border border-gray-100/50 min-w-0">
                        <div className="flex flex-col items-center">
                          <span className="text-base font-black text-[#5C2AFE] leading-none mb-0.5 italic tracking-tighter">{creator.score}</span>
                          <span className="text-[7px] font-black text-gray-400 uppercase tracking-widest opacity-60">Score</span>
                        </div>
                      </div>
                      <div className="text-center bg-[#E1F5FE]/80 py-1.5 rounded-lg border border-blue-100 min-w-0">
                        <span className="block text-[8px] font-black text-blue-600 truncate uppercase mt-0.5">{creator.platforms[0]}</span>
                        <span className="block text-[7px] font-black text-navy uppercase tracking-widest opacity-60 font-medium">Popular At</span>
                      </div>
                    </div>

                    <div className="w-full h-[1px] bg-transparent my-1" />

                    <Link to={`/creators/${creator.id}`} className="w-full py-2 bg-navy text-white text-[9px] font-black rounded-lg shadow-md hover:bg-[#E84E0F] active:scale-95 transition-all flex items-center justify-center gap-1.5 uppercase tracking-widest text-center italic group/btn z-10 shrink-0">
                      View Profile <ArrowRight size={12} className="group-hover:translate-x-0.5 transition-transform" />
                    </Link>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {Object.entries(groupedCreators).map(([letter, letterCreators]) => (
            <div key={letter} className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-navy text-white flex items-center justify-center text-xl font-black">{letter}</div>
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{letterCreators.length} Creators</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 justify-items-center justify-center w-full">
                {letterCreators.map(creator => (
                  <motion.div 
                    layout
                    key={creator.id} 
                    className="bg-white rounded-[5px] p-5 border border-[#e8edf2] hover:border-orange-primary/30 hover:scale-[1.01] transition-all duration-300 relative group flex flex-col justify-between overflow-hidden mx-auto shadow-xs"
                    style={{ width: '100%', maxWidth: '250px', height: '280px' }}
                  >
                    {creator.isHot && (
                      <div className="absolute top-5 right-5 bg-red-500 text-white text-[8px] font-black px-2.5 py-1 rounded-full uppercase tracking-[0.2em] shadow-xl z-20 italic font-sansLabel">HOT</div>
                    )}
                    {creator.isFeatured && (
                      <div className="absolute top-5 right-5 bg-orange-primary text-white text-[8px] font-black px-2.5 py-1 rounded-full uppercase tracking-[0.2em] shadow-xl z-20 italic font-sansLabel">FEATURED</div>
                    )}

                    {/* Horizontal Header System */}
                    <div className="flex gap-3 items-start relative z-10 text-left w-full">
                      <div className="w-14 h-14 rounded-lg bg-gray-50 flex items-center justify-center overflow-hidden flex-shrink-0 border border-gray-100 p-0 shadow-xs relative object-cover">
                         <img src={creator.avatar} className="w-full h-full object-cover relative z-10" alt={creator.name} referrerPolicy="no-referrer" />
                      </div>
                      <div className={cn("flex flex-col min-w-0 flex-1", (creator.isHot || creator.isFeatured) && "pr-10")}>
                        <h3 className="text-sm font-black text-navy leading-tight mb-0.5 group-hover:text-orange-primary transition-colors italic uppercase tracking-tighter truncate">{creator.name}</h3>
                        <div className="flex items-center gap-1 mb-1.5 flex-wrap">
                          {getCreatorClaimStatus(creator.id) === 'verified' && (
                            <span className="inline-flex items-center px-1.5 py-0.5 bg-green-50 text-[7px] font-black text-green-700 rounded-xs uppercase tracking-wider scale-90 origin-left border border-green-200/50">✓ Verified Creator</span>
                          )}
                          {getCreatorClaimStatus(creator.id) === 'pending' && (
                            <span className="inline-flex items-center px-1.5 py-0.5 bg-amber-50 text-[7px] font-black text-amber-700 rounded-xs uppercase tracking-wider scale-90 origin-left border border-amber-200/50 animate-pulse">● Pending Claim</span>
                          )}
                          {getCreatorClaimStatus(creator.id) === 'community' && (
                            <span className="inline-flex items-center px-1.5 py-0.5 bg-gray-50 text-[7px] font-black text-gray-500 rounded-xs uppercase tracking-wider scale-90 origin-left border border-gray-200/50 border-dashed">Community Creator</span>
                          )}
                        </div>
                        <p className="text-[9px] font-bold text-gray-400 mb-1.5 truncate uppercase tracking-wide opacity-80 leading-relaxed">{creator.handle}</p>
                        <div className="flex items-center gap-1">
                          <div className="flex gap-0.5">
                            {[1, 2, 3, 4, 5].map(s => (
                              <Star key={s} size={8} className={cn("fill-orange-primary stroke-orange-primary", s > Math.floor(creator.rating) && "fill-gray-200 stroke-gray-200")} />
                            ))}
                          </div>
                          <span className="text-[9px] font-black text-navy italic ml-0.5">{creator.rating}</span>
                          <span className="text-[8px] font-bold text-gray-300 ml-0.5">({creator.reviews})</span>
                        </div>
                      </div>
                    </div>

                    {/* Content Spacer */}
                    <div className="flex-1" />

                    <div className="w-full h-[1px] bg-gray-50 my-3 mt-auto" />

                    {/* Adapted Grid Content */}
                    <div className="grid grid-cols-3 gap-2">
                      <div className="text-center bg-gray-50/50 py-1.5 rounded-lg border border-gray-100/50 min-w-0">
                        <span className="block text-[7px] font-black text-navy mb-0.5 uppercase tracking-tighter opacity-60">Best For</span>
                        <span className="block text-[8px] font-bold text-red-500 italic uppercase truncate px-0.5">{creator.bestFor}</span>
                      </div>
                      <div className="text-center bg-gray-50/50 py-1.5 rounded-lg border border-gray-100/50 min-w-0">
                        <div className="flex flex-col items-center">
                          <span className="text-base font-black text-[#5C2AFE] leading-none mb-0.5 italic tracking-tighter">{creator.score}</span>
                          <span className="text-[7px] font-black text-gray-400 uppercase tracking-widest opacity-60">Score</span>
                        </div>
                      </div>
                      <div className="text-center bg-[#E1F5FE]/80 py-1.5 rounded-lg border border-blue-100 min-w-0">
                        <span className="block text-[8px] font-black text-blue-600 truncate uppercase mt-0.5">{creator.platforms[0]}</span>
                        <span className="block text-[7px] font-black text-navy uppercase tracking-widest opacity-60 font-medium">Popular At</span>
                      </div>
                    </div>

                    <div className="w-full h-[1px] bg-transparent my-1" />

                    <Link to={`/creators/${creator.id}`} className="w-full py-2 bg-navy text-white text-[9px] font-black rounded-lg shadow-md hover:bg-[#E84E0F] active:scale-95 transition-all flex items-center justify-center gap-1.5 uppercase tracking-widest text-center italic group/btn z-10 shrink-0">
                      View Profile <ArrowRight size={12} className="group-hover:translate-x-0.5 transition-transform" />
                    </Link>
                  </motion.div>
                ))}
              </div>
            </div>
          ))}

          {/* Standard Redesigned Pagination matching global standard */}
          <div className="mt-16 pt-12 border-t border-gray-100 flex flex-col items-center gap-8">
            <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 max-w-full px-2">
              <button className="w-11 h-11 md:w-12 md:h-12 min-w-[44px] min-h-[44px] shrink-0 rounded-[5px] flex items-center justify-center bg-white border border-[#e8edf2] text-navy hover:bg-[#E8500A] hover:text-white hover:border-[#E8500A] transition-all shadow-none group">
                <ArrowRight size={18} className="rotate-180 group-hover:-translate-x-1 transition-transform" />
              </button>
              {[1, 2, 3, '...', 12].map((page, i) => (
                <button 
                  key={i} 
                  className={cn(
                    "w-11 h-11 md:w-12 md:h-12 min-w-[44px] min-h-[44px] shrink-0 rounded-[5px] flex items-center justify-center text-[11px] font-black transition-all italic",
                    page === 1 
                    ? "bg-[#E8500A] text-white border border-[#E8500A] shadow-none" 
                    : "bg-white border border-[#e8edf2] text-navy hover:border-[#E8500A] hover:text-[#E8500A] shadow-none"
                  )}
                >
                  {page}
                </button>
              ))}
              <button className="w-11 h-11 md:w-12 md:h-12 min-w-[44px] min-h-[44px] shrink-0 rounded-[5px] flex items-center justify-center bg-white border border-[#e8edf2] text-[#1A1D4E] hover:bg-[#E8500A] hover:text-white hover:border-[#E8500A] transition-all shadow-none group">
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
            
            <p className="text-[10px] font-black text-gray-300 uppercase tracking-[0.2em] italic">
              Showing {filteredCreators.length} Of {mappedCreators.length} Results
            </p>
          </div>

          {filteredCreators.length === 0 && (
             <div className="py-20 text-center">
                <Search size={48} className="mx-auto text-gray-300 mb-4" />
                <h3 className="text-2xl font-black text-navy uppercase tracking-tight mb-2 italic">No Creators Found</h3>
                <p className="text-gray-400 font-medium">Try searching for a different creator name or clear filters.</p>
                <button 
                  onClick={() => {setSearchQuery(''); setSelectedLetter(null);}}
                  className="mt-6 px-8 py-3 bg-navy text-white text-xs font-black uppercase rounded-xl shadow-lg animate-none"
                >
                  Clear All Filters
                </button>
             </div>
          )}
        </main>

        {/* RIGHT SIDEBAR WITH SPONSOR & SELLERS CARD */}
        <aside className="hidden lg:flex flex-col gap-4 lg:sticky lg:top-24 pb-10 pr-2 flex-shrink-0 animate-fade-in">
          {/* FEATURED CREATOR DEALS SECTION */}
          <div className="bg-white rounded-[5px] border border-[#e8edf2] p-4.5 shadow-sm w-full text-left animate-fade-in">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#e8edf2] px-1">
              <h3 className="text-[11px] font-semibold text-[#8a9bb0] uppercase tracking-wider">
                Featured Campaigns
              </h3>
              <Link 
                to="/creators" 
                className="text-[10px] font-bold text-orange-primary hover:underline flex items-center gap-1"
              >
                See All →
              </Link>
            </div>

            <div className="flex flex-col gap-2.5">
              {CREATOR_COLLABS.map((item) => (
                <Link 
                  to={`/creators/${item.id}`}
                  key={item.id} 
                  className="flex items-center gap-3 bg-white border border-[#e8edf2]/60 rounded-[5px] p-2 hover:shadow-soft hover:border-[#E8500A]/10 transition-all duration-300 group cursor-pointer"
                >
                  <div className={cn("w-9 h-9 rounded-lg overflow-hidden shrink-0 border border-transparent flex items-center justify-center text-white font-semibold text-xs shadow-sm")}>
                    <img src={item.avatar} className="w-full h-full object-cover" alt={item.name} referrerPolicy="no-referrer" />
                  </div>
                  <div className="flex-1 min-w-0 flex flex-col justify-center text-left">
                    <h4 className="font-sans text-xs font-semibold uppercase tracking-tight text-[#1A1D4E] group-hover:text-[#E8500A] transition-colors truncate">
                      {item.name}
                    </h4>
                    <p className="text-[9px] font-semibold text-gray-400 mt-0.5 truncate uppercase">
                      {item.highlight}
                    </p>
                  </div>
                  <span className="text-[8px] font-bold text-[#E8500A] uppercase tracking-wider shrink-0 whitespace-nowrap group-hover:-translate-x-0.5 transition-transform">
                    View
                  </span>
                </Link>
              ))}
            </div>
          </div>

          {/* FEATURED PROMOCODES SECTION */}
          <div className="bg-white rounded-[5px] border border-[#e8edf2] p-4.5 shadow-sm w-full text-left animate-fade-in">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#e8edf2] px-1">
              <h3 className="text-[11px] font-semibold text-[#8a9bb0] uppercase tracking-wider">
                Creator Promo Codes
              </h3>
            </div>

            <div className="flex flex-col gap-2.5">
              {CREATOR_PROMOS.map((item, idx) => (
                <Link 
                  to={`/creators/${item.creatorId}`}
                  key={idx} 
                  className="bg-white border border-[#e8edf2]/65 hover:border-[#E8500A]/15 rounded-[5px] p-2.5 hover:shadow-soft transition-all duration-300 group cursor-pointer flex flex-col gap-2 text-left"
                >
                  {/* Header row with brand details */}
                  <div className="flex items-center justify-between gap-2">
                    <div className="min-w-0">
                      <h4 className="font-sans text-xs font-semibold uppercase tracking-tight text-[#1A1D4E] group-hover:text-[#E8500A] transition-colors truncate">
                        {item.creatorName}
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
              ))}
            </div>
          </div>





        </aside>
      </div>
    </div>
  );
}
