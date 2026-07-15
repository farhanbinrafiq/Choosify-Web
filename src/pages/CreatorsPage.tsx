import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, Star, CheckCircle2, ChevronDown, ChevronLeft, ChevronRight, 
  Users, Laptop, Sparkles, Camera, Box, Tag, ArrowRight, Grid, List, 
  X, Check, FileText, Sparkle, HelpCircle, ShieldCheck
} from 'lucide-react';
import { CREATORS, Creator } from '../data/creators';
import { CreatorCard } from '../components/CreatorCard';
import { toast } from 'react-hot-toast';
import { useRegisterPageFilters, UniversalFilterRenderer } from '../components/FilterEngine';

export function CreatorsPage() {
  // State for active filters
  const [activeTab, setActiveTab] = useState('All Creators');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSort, setSelectedSort] = useState('Most Popular');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  
  // Dropdown states
  const [nicheDropdown, setNicheDropdown] = useState('All Niches');
  const [platformDropdown, setPlatformDropdown] = useState('Platform');
  const [countryDropdown, setCountryDropdown] = useState('Country');
  
  // Toggle states
  const [verifiedOnly, setVerifiedOnly] = useState(true);
  const [hasReviews, setHasReviews] = useState(true);

  // Dropdown open states for custom selectors
  const [isNicheOpen, setIsNicheOpen] = useState(false);
  const [isPlatformOpen, setIsPlatformOpen] = useState(false);
  const [isCountryOpen, setIsCountryOpen] = useState(false);
  const [isSortOpen, setIsSortOpen] = useState(false);

  useRegisterPageFilters({
    pageName: 'Creators',
    renderSearch: () => (
      <div className="relative">
        <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
          <Search size={13} className="text-[#FF5B00]" />
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search creators..."
          className="w-full h-9 pl-8 pr-3 bg-white border border-[#e8edf2] rounded-[5px] text-[11px] font-semibold text-[#1A1D4E] placeholder-gray-400 focus:outline-none focus:border-[#FF5B00]/50 transition-colors"
        />
      </div>
    ),
    renderFilters: () => (
      <div className="flex flex-col gap-4 mt-4">
        <UniversalFilterRenderer
          profile={{
            entity: 'creators',
            filters: [
              {
                id: 'expertise',
                name: 'Expertise',
                type: 'single_select',
                options: [
                  { value: 'all', label: 'All Expertise' },
                  { value: 'tech', label: 'Tech & Gadgets' },
                  { value: 'fashion', label: 'Fashion & Beauty' },
                  { value: 'lifestyle', label: 'Lifestyle' }
                ]
              },
              {
                id: 'platforms',
                name: 'Platforms',
                type: 'multi_select',
                options: [
                  { value: 'youtube', label: 'YouTube' },
                  { value: 'instagram', label: 'Instagram' },
                  { value: 'tiktok', label: 'TikTok' }
                ]
              },
              {
                id: 'followers',
                name: 'Followers',
                type: 'single_select',
                options: [
                  { value: '1M+', label: '1M+ Followers' },
                  { value: '500k+', label: '500k+ Followers' },
                  { value: '100k+', label: '100k+ Followers' }
                ]
              },
              {
                id: 'verified',
                name: 'Verified Status',
                type: 'single_select',
                options: [
                  { value: 'verified', label: 'Verified Only' },
                  { value: 'all', label: 'All Creators' }
                ]
              }
            ]
          }}
          activeFilters={{}}
          onFilterChange={() => {}}
        />
      </div>
    ),
    onClearAll: () => setSearchQuery('')
  }, [searchQuery]);

  // Categories with counts matching reference image perfectly
  const categories = [
    { name: 'All Creators', count: 2145, icon: Users },
    { name: 'Tech Reviewers', count: 568, icon: Laptop },
    { name: 'Fashion Creators', count: 423, icon: Sparkles },
    { name: 'Lifestyle Creators', count: 612, icon: Camera },
    { name: 'Unboxing Experts', count: 342, icon: Box },
    { name: 'Budget Finds', count: 357, icon: Tag },
  ];

  // Popular searches
  const popularSearches = [
    'Tech Reviewers', 'Fashion Creators', 'Unboxing Experts', 
    'Farhan Bin Rafiq', 'Sarah Jenkins', 'Budget Unboxings', 
    'Gadget Findings', 'Lifestyle Vloggers', 'Verified Creators'
  ];

  // Dynamic Filtering Logic
  const filteredCreators = useMemo(() => {
    let result = [...CREATORS];

    // 1. Category Tab Filter
    if (activeTab !== 'All Creators') {
      result = result.filter(c => c.bestFor === activeTab);
    }

    // 2. Niche Dropdown Filter
    if (nicheDropdown !== 'All Niches') {
      result = result.filter(c => c.bestFor === nicheDropdown);
    }

    // 3. Platform Dropdown Filter
    if (platformDropdown !== 'Platform') {
      result = result.filter(c => 
        c.platforms.map(p => p.toLowerCase()).includes(platformDropdown.toLowerCase())
      );
    }

    // 4. Country Dropdown Filter
    // In this mock, all creators are located in Bangladesh, so "Bangladesh" passes everyone, 
    // and other countries filter all.
    if (countryDropdown !== 'Country' && countryDropdown !== 'Bangladesh') {
      result = [];
    }

    // 5. Search query matching
    if (searchQuery.trim() !== '') {
      const query = searchQuery.toLowerCase().trim();
      result = result.filter(c => 
        c.name.toLowerCase().includes(query) ||
        c.handle.toLowerCase().includes(query) ||
        c.bestFor.toLowerCase().includes(query) ||
        c.bio.toLowerCase().includes(query) ||
        c.bestForTags.some(t => t.toLowerCase().includes(query))
      );
    }

    // 6. Verified check filter
    if (verifiedOnly) {
      // In this view, all 8 are verified. But we keep it as code safety
    }

    // 7. Has Reviews filter
    if (hasReviews) {
      result = result.filter(c => c.reviewsCount > 0);
    }

    // 8. Sorting
    if (selectedSort === 'Most Popular') {
      result.sort((a, b) => b.reviews - a.reviews);
    } else if (selectedSort === 'Top Rated') {
      result.sort((a, b) => b.rating - a.rating);
    } else if (selectedSort === 'High Engagement') {
      result.sort((a, b) => b.score - a.score);
    }

    return result;
  }, [activeTab, nicheDropdown, platformDropdown, countryDropdown, searchQuery, verifiedOnly, hasReviews, selectedSort]);

  // Handler to clear all filters
  const handleClearAll = () => {
    setActiveTab('All Creators');
    setSearchQuery('');
    setSelectedSort('Most Popular');
    setNicheDropdown('All Niches');
    setPlatformDropdown('Platform');
    setCountryDropdown('Country');
    setVerifiedOnly(false);
    setHasReviews(false);
    toast.success('All filters cleared successfully!');
  };

  const handleJoinAsCreator = () => {
    toast.success("Welcome aboard! Let's set up your brand portfolio together.", {
      icon: '🚀',
      duration: 4000
    });
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#F8F9FB] text-gray-800">
      
      {/* HEADER SECTION with Midnight Blue/Purple Gradient backdrop */}
      <header className="relative w-full bg-[#070719] py-10 px-4 md:px-8 overflow-hidden shrink-0 border-b border-white/5">
        {/* Subtle background glow bubbles */}
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-[#FF5B00]/5 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-[#5C2AFE]/10 rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-[1440px] mx-auto w-full relative z-10">
          
          {/* Breadcrumbs */}
          <nav className="text-[11px] font-medium text-gray-400 uppercase tracking-widest flex items-center gap-1.5 mb-5 select-none">
            <Link to="/" className="hover:text-white transition-colors">Home</Link>
            <span className="text-gray-600 font-bold font-sans">&gt;</span>
            <span className="text-white">Creators</span>
          </nav>

          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
            
            {/* Title & Description */}
            <div className="max-w-2xl text-left">
              <h1 className="text-3xl md:text-4xl lg:text-[44px] font-black tracking-tight text-white leading-tight">
                Creators
              </h1>
              <p className="text-[13px] md:text-sm text-gray-300 font-medium mt-3 leading-relaxed max-w-xl">
                Discover trusted creators who test, review and recommend the best products.
              </p>
            </div>

            {/* KPI metrics cards grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 lg:gap-4 shrink-0 max-w-full">
              
              {/* Card 1: Total Creators */}
              <div className="bg-white/[0.04] border border-white/10 rounded-xl p-4 flex items-center gap-3.5 backdrop-blur-md min-w-[145px]">
                <div className="w-10 h-10 rounded-lg bg-[#FF5B00]/10 flex items-center justify-center shrink-0">
                  <Users className="w-5 h-5 text-[#FF5B00]" />
                </div>
                <div className="text-left">
                  <div className="text-lg md:text-[20px] font-extrabold text-white leading-none">2,145</div>
                  <div className="text-[10px] font-semibold text-gray-400 mt-1 uppercase tracking-wider">Total Creators</div>
                </div>
              </div>

              {/* Card 2: Content Published */}
              <div className="bg-white/[0.04] border border-white/10 rounded-xl p-4 flex items-center gap-3.5 backdrop-blur-md min-w-[145px]">
                <div className="w-10 h-10 rounded-lg bg-orange-500/10 flex items-center justify-center shrink-0">
                  <FileText className="w-5 h-5 text-orange-450" />
                </div>
                <div className="text-left">
                  <div className="text-lg md:text-[20px] font-extrabold text-white leading-none">1.2M+</div>
                  <div className="text-[10px] font-semibold text-gray-400 mt-1 uppercase tracking-wider">Content Published</div>
                </div>
              </div>

              {/* Card 3: Verified Creators */}
              <div className="bg-white/[0.04] border border-white/10 rounded-xl p-4 flex items-center gap-3.5 backdrop-blur-md min-w-[145px]">
                <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-5 h-5 text-emerald-450" />
                </div>
                <div className="text-left">
                  <div className="text-lg md:text-[20px] font-extrabold text-white leading-none">98%</div>
                  <div className="text-[10px] font-semibold text-gray-400 mt-1 uppercase tracking-wider">Verified Creators</div>
                </div>
              </div>

              {/* Card 4: Avg rating */}
              <div className="bg-white/[0.04] border border-white/10 rounded-xl p-4 flex items-center gap-3.5 backdrop-blur-md min-w-[145px]">
                <div className="w-10 h-10 rounded-lg bg-yellow-500/10 flex items-center justify-center shrink-0">
                  <Star className="w-5 h-5 text-yellow-450 fill-yellow-450/25" />
                </div>
                <div className="text-left">
                  <div className="text-lg md:text-[20px] font-extrabold text-white leading-none">4.8/5</div>
                  <div className="text-[10px] font-semibold text-gray-400 mt-1 uppercase tracking-wider">Avg. Creator Rating</div>
                </div>
              </div>

            </div>

          </div>

        </div>
      </header>

      {/* MAIN CONTAINER */}
      <main className="max-w-[1440px] mx-auto w-full px-4 md:px-8 py-8 flex flex-col gap-6">

        {/* PILLS CATEGORY SELECTOR BAR */}
        <div className="w-full bg-white border border-gray-200/80 rounded-2xl p-2 shadow-sm overflow-x-auto no-scrollbar shrink-0">
          <div className="flex items-center justify-start lg:justify-between min-w-max md:min-w-0 gap-2">
            {categories.map((cat, idx) => {
              const IconComponent = cat.icon;
              const isActive = activeTab === cat.name;
              return (
                <button
                  key={idx}
                  onClick={() => {
                    setActiveTab(cat.name);
                    toast.success(`Showing ${cat.name}`);
                  }}
                  className={`flex items-center gap-2.5 px-5 py-3 rounded-xl transition-all font-sans text-xs font-bold uppercase tracking-wide cursor-pointer border-0 outline-none select-none shrink-0 ${
                    isActive 
                      ? 'bg-[#FF5B00]/10 text-[#FF5B00] border-b-2 border-[#FF5B00] rounded-b-none' 
                      : 'text-gray-500 hover:text-[#FF5B00] hover:bg-gray-50'
                  }`}
                >
                  <IconComponent className={`w-4 h-4 shrink-0 ${isActive ? 'text-[#FF5B00]' : 'text-gray-400'}`} />
                  <span>{cat.name}</span>
                  <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${isActive ? 'bg-[#FF5B00]/20 text-[#FF5B00]' : 'bg-gray-100 text-gray-400'}`}>
                    {cat.count.toLocaleString()}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* GREEN/TEAL VERIFIED INFORMATION BANNER */}
        <div className="w-full bg-[#0A162F] text-white rounded-2xl py-4.5 px-6 shadow-sm border border-white/5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 text-left relative overflow-hidden">
          {/* Accent decoration line */}
          <div className="absolute top-0 bottom-0 left-0 w-1.5 bg-[#22C55E]" />

          <div className="flex items-center gap-3.5">
            <div className="w-9 h-9 rounded-full bg-[#22C55E]/15 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-5 h-5 text-[#22C55E]" />
            </div>
            <div>
              <h4 className="font-bold text-[13px] tracking-wide text-white">Trusted & Verified</h4>
              <p className="text-xs text-gray-300 mt-0.5 font-medium">All creators are verified by Choosify for authenticity and quality.</p>
            </div>
          </div>

          <Link 
            to="/about" 
            className="text-xs font-bold text-white hover:text-gray-200 transition-colors shrink-0 flex items-center gap-1 group self-start sm:self-auto uppercase tracking-wider"
          >
            Learn more 
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* CONTROLS ROW 1: Search, Sort & Views */}
        <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between w-full shrink-0">
          
          {/* Real-time search inputs */}
          <div className="relative flex-1 max-w-full md:max-w-xl">
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
              <Search className="w-4 h-4 text-gray-400" />
            </div>
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search creators by name, niche, or keywords..." 
              className="w-full h-11 pl-11 pr-5 bg-white border border-gray-200 rounded-xl text-xs font-semibold text-[#0E0F23] placeholder-gray-400 focus:outline-none focus:border-[#FF5B00]/40 focus:ring-1 focus:ring-[#FF5B00]/20 transition-all shadow-sm"
            />
          </div>

          {/* Sort Selection & View Buttons */}
          <div className="flex items-center gap-3.5 justify-between md:justify-end shrink-0">
            
            {/* Sort Dropdown */}
            <div className="relative">
              <button 
                onClick={() => setIsSortOpen(!isSortOpen)}
                onBlur={() => setTimeout(() => setIsSortOpen(false), 200)}
                className="h-11 px-5 bg-white border border-gray-200 rounded-xl text-xs font-bold text-gray-700 flex items-center gap-2 shadow-sm cursor-pointer select-none border-0 outline-none"
              >
                <span className="text-gray-400">Sort by:</span>
                <span>{selectedSort}</span>
                <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
              </button>

              <AnimatePresence>
                {isSortOpen && (
                  <motion.div 
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 5 }}
                    className="absolute right-0 mt-1.5 w-44 bg-white border border-gray-200 rounded-xl shadow-lg py-1.5 z-40 text-left"
                  >
                    {['Most Popular', 'Top Rated', 'High Engagement'].map((sortOption) => (
                      <button
                        key={sortOption}
                        onClick={() => {
                          setSelectedSort(sortOption);
                          setIsSortOpen(false);
                        }}
                        className="w-full px-4 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50 hover:text-[#FF5B00] transition-colors text-left border-0 cursor-pointer block"
                      >
                        {sortOption}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Grid vs List Toggles */}
            <div className="flex items-center gap-1.5 p-1 bg-white border border-gray-200 rounded-xl shadow-sm">
              <button 
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-lg transition-colors cursor-pointer border-0 outline-none ${viewMode === 'grid' ? 'bg-[#FF5B00]/10 text-[#FF5B00]' : 'text-gray-400 hover:text-gray-600'}`}
                title="Grid view"
              >
                <Grid className="w-4 h-4" />
              </button>
              <button 
                onClick={() => {
                  setViewMode('list');
                  toast.success('List mode activated!');
                }}
                className={`p-1.5 rounded-lg transition-colors cursor-pointer border-0 outline-none ${viewMode === 'list' ? 'bg-[#FF5B00]/10 text-[#FF5B00]' : 'text-gray-400 hover:text-gray-600'}`}
                title="List view"
              >
                <List className="w-4 h-4" />
              </button>
            </div>

          </div>

        </div>

        {/* CONTROLS ROW 2: Custom Dropdowns, Toggles & Clear */}
        <div className="flex flex-col lg:flex-row gap-4 items-stretch lg:items-center justify-between w-full shrink-0">
          
          {/* Custom Selector Dropdowns */}
          <div className="flex flex-wrap items-center gap-3">
            
            {/* Niche Dropdown */}
            <div className="relative">
              <button 
                onClick={() => setIsNicheOpen(!isNicheOpen)}
                onBlur={() => setTimeout(() => setIsNicheOpen(false), 200)}
                className="h-10 px-4 bg-white border border-gray-200 rounded-xl text-xs font-bold text-gray-600 flex items-center gap-2 shadow-sm cursor-pointer select-none border-0 outline-none"
              >
                <span>{nicheDropdown}</span>
                <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
              </button>
              <AnimatePresence>
                {isNicheOpen && (
                  <motion.div 
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 5 }}
                    className="absolute left-0 mt-1.5 w-48 bg-white border border-gray-200 rounded-xl shadow-lg py-1.5 z-40 text-left max-h-56 overflow-y-auto"
                  >
                    {['All Niches', 'Tech Reviewers', 'Fashion Creators', 'Lifestyle Creators', 'Unboxing Experts', 'Budget Finds'].map((opt) => (
                      <button
                        key={opt}
                        onClick={() => {
                          setNicheDropdown(opt);
                          setIsNicheOpen(false);
                        }}
                        className="w-full px-4 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50 hover:text-[#FF5B00] transition-colors text-left border-0 cursor-pointer block"
                      >
                        {opt}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Platform Dropdown */}
            <div className="relative">
              <button 
                onClick={() => setIsPlatformOpen(!isPlatformOpen)}
                onBlur={() => setTimeout(() => setIsPlatformOpen(false), 200)}
                className="h-10 px-4 bg-white border border-gray-200 rounded-xl text-xs font-bold text-gray-600 flex items-center gap-2 shadow-sm cursor-pointer select-none border-0 outline-none"
              >
                <span>{platformDropdown}</span>
                <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
              </button>
              <AnimatePresence>
                {isPlatformOpen && (
                  <motion.div 
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 5 }}
                    className="absolute left-0 mt-1.5 w-44 bg-white border border-gray-200 rounded-xl shadow-lg py-1.5 z-40 text-left"
                  >
                    {['Platform', 'YouTube', 'Instagram', 'TikTok', 'Facebook'].map((opt) => (
                      <button
                        key={opt}
                        onClick={() => {
                          setPlatformDropdown(opt);
                          setIsPlatformOpen(false);
                        }}
                        className="w-full px-4 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50 hover:text-[#FF5B00] transition-colors text-left border-0 cursor-pointer block"
                      >
                        {opt === 'Platform' ? 'All Platforms' : opt}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Country Dropdown */}
            <div className="relative">
              <button 
                onClick={() => setIsCountryOpen(!isCountryOpen)}
                onBlur={() => setTimeout(() => setIsCountryOpen(false), 200)}
                className="h-10 px-4 bg-white border border-gray-200 rounded-xl text-xs font-bold text-gray-600 flex items-center gap-2 shadow-sm cursor-pointer select-none border-0 outline-none"
              >
                <span>{countryDropdown}</span>
                <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
              </button>
              <AnimatePresence>
                {isCountryOpen && (
                  <motion.div 
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 5 }}
                    className="absolute left-0 mt-1.5 w-44 bg-white border border-gray-200 rounded-xl shadow-lg py-1.5 z-40 text-left"
                  >
                    {['Country', 'Bangladesh'].map((opt) => (
                      <button
                        key={opt}
                        onClick={() => {
                          setCountryDropdown(opt);
                          setIsCountryOpen(false);
                        }}
                        className="w-full px-4 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50 hover:text-[#FF5B00] transition-colors text-left border-0 cursor-pointer block"
                      >
                        {opt === 'Country' ? 'All Countries' : opt}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Toggle verified with green badge */}
            <button
              onClick={() => setVerifiedOnly(!verifiedOnly)}
              className={`h-10 px-4 rounded-xl text-xs font-bold flex items-center gap-2 transition-all border shadow-sm cursor-pointer ${
                verifiedOnly 
                  ? 'bg-[#22C55E]/10 border-[#22C55E]/30 text-[#22C55E]' 
                  : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
              }`}
            >
              <Check className={`w-3.5 h-3.5 ${verifiedOnly ? 'text-[#22C55E]' : 'text-gray-400'}`} />
              Verified Only
            </button>

            {/* Toggle reviews with green badge */}
            <button
              onClick={() => setHasReviews(!hasReviews)}
              className={`h-10 px-4 rounded-xl text-xs font-bold flex items-center gap-2 transition-all border shadow-sm cursor-pointer ${
                hasReviews 
                  ? 'bg-[#22C55E]/10 border-[#22C55E]/30 text-[#22C55E]' 
                  : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
              }`}
            >
              <Check className={`w-3.5 h-3.5 ${hasReviews ? 'text-[#22C55E]' : 'text-gray-400'}`} />
              Has Reviews
            </button>

            {/* Clear All Filters Button */}
            {(activeTab !== 'All Creators' || searchQuery !== '' || nicheDropdown !== 'All Niches' || platformDropdown !== 'Platform' || countryDropdown !== 'Country' || verifiedOnly || hasReviews) && (
              <button
                onClick={handleClearAll}
                className="text-xs font-bold text-[#FF5B00] hover:text-[#EB4501] transition-colors ml-1 cursor-pointer"
              >
                Clear all
              </button>
            )}

          </div>

        </div>

        {/* FEED / CARDS GRID SECTION */}
        <div className="w-full">
          <AnimatePresence mode="popLayout">
            {filteredCreators.length === 0 ? (
              <motion.div 
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 15 }}
                className="py-16 text-center bg-white rounded-2xl border border-gray-200/80 shadow-sm"
              >
                <Search className="w-12 h-12 mx-auto text-gray-300 mb-4" />
                <h3 className="font-sans text-lg font-bold text-[#0E0F23]">No creators found</h3>
                <p className="text-xs text-gray-400 mt-2 max-w-sm mx-auto">Try refining your search queries or clearing active filters to see other results.</p>
                <button
                  onClick={handleClearAll}
                  className="mt-5 px-6 py-2.5 bg-[#FF5B00] text-white text-xs font-bold uppercase tracking-wider rounded-xl border-0 shadow-md hover:bg-[#FF5B00] transition-colors cursor-pointer"
                >
                  Clear All Filters
                </button>
              </motion.div>
            ) : (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className={
                  viewMode === 'grid' 
                    ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 w-full justify-center" 
                    : "flex flex-col gap-4 w-full"
                }
              >
                {filteredCreators.map((creator) => {
                  if (viewMode === 'grid') {
                    return <CreatorCard key={creator.id} creator={creator} />;
                  } else {
                    // Custom list-view row for high-craftsmanship list mode
                    return (
                      <Link 
                        to={`/creators/${creator.id}`}
                        key={creator.id}
                        className="flex flex-col md:flex-row items-center gap-5 bg-white p-5 rounded-2xl border border-gray-200/80 shadow-sm hover:shadow-md transition-all duration-200 text-left group"
                      >
                        <div className="w-20 h-20 rounded-full border-2 border-[#FF5B00]/10 overflow-hidden shrink-0 flex items-center justify-center bg-gray-50">
                          <img src={creator.avatar} className="w-full h-full object-cover" alt={creator.name} referrerPolicy="no-referrer" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5">
                            <h3 className="font-sans text-base font-bold text-[#0E0F23] group-hover:text-[#FF5B00] transition-colors">
                              {creator.name}
                            </h3>
                            <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0" />
                          </div>
                          <p className="text-xs text-gray-400 mt-0.5 font-semibold uppercase tracking-wider">{creator.bestFor}</p>
                          <p className="text-xs text-gray-500 mt-2 line-clamp-2 leading-relaxed max-w-2xl">{creator.bio}</p>
                        </div>
                        <div className="grid grid-cols-3 gap-6 shrink-0 text-center px-4 md:border-l border-gray-150">
                          <div>
                            <div className="text-sm font-extrabold text-[#0E0F23]">{creator.reviewsCount}</div>
                            <div className="text-[9px] font-semibold text-gray-400 uppercase">Reviews</div>
                          </div>
                          <div>
                            <div className="text-sm font-extrabold text-[#0E0F23]">{creator.followersCount}</div>
                            <div className="text-[9px] font-semibold text-gray-400 uppercase">Followers</div>
                          </div>
                          <div>
                            <div className="text-sm font-extrabold text-[#0E0F23]">{creator.trustScore}%</div>
                            <div className="text-[9px] font-semibold text-gray-400 uppercase">Trust Score</div>
                          </div>
                        </div>
                        <div className="shrink-0 flex items-center justify-center p-2.5">
                          <div className="w-10 h-10 rounded-full bg-gray-50 group-hover:bg-[#FF5B00]/10 group-hover:text-[#FF5B00] text-gray-400 flex items-center justify-center transition-all">
                            <ArrowRight className="w-4 h-4" />
                          </div>
                        </div>
                      </Link>
                    );
                  }
                })}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* PAGINATION ROW */}
        {filteredCreators.length > 0 && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-5 pt-8 border-t border-gray-200 mt-6 shrink-0 w-full">
            <span className="text-xs text-gray-500 font-semibold uppercase tracking-wider text-center sm:text-left">
              Showing 1-{filteredCreators.length} of {filteredCreators.length} creators
            </span>

            {/* Pagination Controls */}
            <div className="flex items-center gap-1.5">
              <button className="w-9 h-9 rounded-xl bg-white border border-gray-200 text-gray-400 hover:text-gray-600 flex items-center justify-center transition-colors cursor-pointer outline-none border-0 shadow-sm" disabled>
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button className="w-9 h-9 rounded-xl bg-[#FF5B00] text-white flex items-center justify-center text-xs font-bold cursor-pointer border-0 shadow-sm">
                1
              </button>
              <button className="w-9 h-9 rounded-xl bg-white border border-gray-200 text-gray-500 hover:text-gray-700 hover:border-gray-300 flex items-center justify-center text-xs font-bold cursor-pointer transition-colors outline-none border-0 shadow-sm">
                2
              </button>
              <button className="w-9 h-9 rounded-xl bg-white border border-gray-200 text-gray-500 hover:text-gray-700 hover:border-gray-300 flex items-center justify-center text-xs font-bold cursor-pointer transition-colors outline-none border-0 shadow-sm">
                3
              </button>
              <button className="w-9 h-9 rounded-xl bg-white border border-gray-200 text-gray-500 hover:text-gray-700 hover:border-gray-300 flex items-center justify-center text-xs font-bold cursor-pointer transition-colors outline-none border-0 shadow-sm">
                4
              </button>
              <span className="text-xs font-bold text-gray-400 px-1">...</span>
              <button className="w-9 h-9 rounded-xl bg-white border border-gray-200 text-gray-500 hover:text-gray-700 hover:border-gray-300 flex items-center justify-center text-xs font-bold cursor-pointer transition-colors outline-none border-0 shadow-sm">
                179
              </button>
              <button className="w-9 h-9 rounded-xl bg-white border border-gray-200 text-gray-500 hover:text-gray-700 flex items-center justify-center transition-colors cursor-pointer outline-none border-0 shadow-sm">
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Show per page dropdown */}
            <div className="relative">
              <button className="h-9 px-4 bg-white border border-gray-200 rounded-xl text-xs font-bold text-gray-600 flex items-center gap-1.5 shadow-sm select-none border-0 outline-none">
                <span className="text-gray-400">Show:</span>
                <span>12 per page</span>
                <ChevronDown className="w-3 h-3 text-gray-400" />
              </button>
            </div>
          </div>
        )}

        {/* POPULAR CREATOR SEARCHES */}
        <div className="w-full py-8 border-t border-gray-200 text-left mt-8 shrink-0">
          <h3 className="font-sans text-sm font-bold text-[#0E0F23] tracking-wide mb-4">
            Popular creator searches
          </h3>
          <div className="flex flex-wrap gap-2">
            {popularSearches.map((term, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setSearchQuery(term);
                  toast.success(`Filtering for: ${term}`);
                }}
                className="px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-[11px] font-bold text-gray-600 hover:text-[#FF5B00] hover:border-[#FF5B00]/40 hover:bg-[#FF5B00]/5 transition-all shadow-sm cursor-pointer select-none border-0"
              >
                🔍 &nbsp; {term}
              </button>
            ))}
          </div>
        </div>

        {/* LOWER CTA PROMO BANNER */}
        <div className="w-full bg-[#0A0A1F] text-white rounded-3xl p-8 md:p-12 shadow-xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8 text-left border border-white/5 mt-6 shrink-0">
          
          {/* Circular color spots behind */}
          <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-[#FF5B00]/10 rounded-full blur-[80px] pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-[200px] h-[200px] bg-[#5C2AFE]/10 rounded-full blur-[60px] pointer-events-none" />

          {/* Rocket graphics space illustration */}
          <div className="flex items-center gap-6 relative z-10 flex-1">
            <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-white/[0.05] border border-white/10 flex items-center justify-center shrink-0 shadow-lg text-4xl">
              🚀
            </div>
            <div className="max-w-xl">
              <h2 className="text-xl md:text-2xl font-black tracking-tight text-white">
                Are you a creator?
              </h2>
              <p className="text-xs md:text-[13px] text-gray-300 font-medium mt-2 leading-relaxed">
                Join Choosify and grow your audience by sharing honest reviews and helping people make better choices.
              </p>
            </div>
          </div>

          <div className="shrink-0 relative z-10 flex flex-col items-start md:items-end gap-2.5 w-full md:w-auto">
            <button 
              onClick={handleJoinAsCreator}
              className="px-8 py-3.5 bg-[#FF5B00] hover:bg-[#FF5B00] text-white text-xs font-black uppercase tracking-widest rounded-xl transition-all duration-200 shadow-lg hover:shadow-[#FF5B00]/25 hover:scale-[1.02] active:scale-[0.98] w-full md:w-auto text-center border-0 cursor-pointer"
            >
              Join as Creator
            </button>
            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider self-center md:self-auto italic">
              It's free and easy!
            </span>
          </div>

        </div>

      </main>

    </div>
  );
}
