import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, Bookmark, Eye, Play, ArrowRight, Star, Check, Sparkles, Users, 
  HelpCircle, ChevronDown, ChevronRight, X, Send, Mail, CheckCircle2, 
  ShieldCheck, Calendar, Bot, Share2, PlaySquare, BookOpen, Scale, 
  ListOrdered, Lightbulb, Heart, Flame, LayoutGrid, MessageSquare
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useRegisterPageFilters } from '../components/FilterEngine';

// Inline TikTok icon component for footer
function TikTokIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.02 1.73 4.1 1.12 1.09 2.62 1.7 4.18 1.8v3.91c-1.85-.01-3.61-.68-5.07-1.82V14.5c.04 3.39-2.14 6.55-5.4 7.63-3.25 1.08-6.9-.32-8.56-3.32C1.65 15.82 2.45 11.9 5.31 9.87c1.78-1.27 4.14-1.55 6.16-.72.01-.16.02-.32.02-.48V4.83c-1.41-.35-2.88-.16-4.16.54-2.1 1.15-3.35 3.51-3.14 5.92.21 2.42 2.01 4.54 4.38 5.17 2.37.64 4.96-.2 6.09-2.26.47-.86.7-1.84.66-2.82V.02Z" />
    </svg>
  );
}

export function GuidesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [activeFilter, setActiveFilter] = useState('Trending');
  const [savedArticles, setSavedArticles] = useState<string[]>([]);
  const [followedCreators, setFollowedCreators] = useState<string[]>(['Tech World BD']);

  // Support responsive pagination/scroll on featured grid
  const [featuredIndex, setFeaturedIndex] = useState(0);

  // Register with FilterEngine so floating bar works if triggered
  useRegisterPageFilters({
    pageName: 'Discover & Guides',
    renderSearch: () => (
      <div className="relative">
        <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
          <Search size={13} className="text-[#FF5B00]" />
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search guides, reviews, articles..."
          className="w-full h-9 pl-8 pr-3 bg-white border border-[#e8edf2] rounded-[5px] text-[11px] font-semibold text-[#1A1D4E] placeholder-gray-400 focus:outline-none focus:border-[#FF5B00]/50 transition-colors"
        />
      </div>
    ),
    renderFilters: () => (
      <div className="flex gap-2">
        {['All', 'Buying Guides', 'Videos', 'Creator Reviews', 'Collections'].map((f) => (
          <button
            key={f}
            onClick={() => setActiveCategory(f)}
            className={`px-3 py-1.5 rounded text-[10px] font-bold ${activeCategory === f ? 'bg-[#FF5B00] text-white' : 'bg-slate-100 text-slate-600'}`}
          >
            {f}
          </button>
        ))}
      </div>
    ),
    onClearAll: () => {
      setSearchQuery('');
      setActiveCategory('All');
      setActiveFilter('Trending');
    }
  }, [searchQuery, activeCategory, activeFilter]);

  // Handle saving items
  const toggleSaveArticle = (title: string) => {
    if (savedArticles.includes(title)) {
      setSavedArticles(prev => prev.filter(t => t !== title));
      toast.success('Removed from saved collection');
    } else {
      setSavedArticles(prev => [...prev, title]);
      toast.success('Saved to your collection!');
    }
  };

  const toggleFollowCreator = (creatorName: string) => {
    if (followedCreators.includes(creatorName)) {
      setFollowedCreators(prev => prev.filter(n => n !== creatorName));
      toast.success(`Unfollowed ${creatorName}`);
    } else {
      setFollowedCreators(prev => [...prev, creatorName]);
      toast.success(`Following ${creatorName}`);
    }
  };

  const handleShare = (title: string) => {
    if (navigator.share) {
      navigator.share({
        title,
        text: `Check out this amazing article on Choosify: ${title}`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(`${window.location.origin}/discover?share=${encodeURIComponent(title)}`);
      toast.success('Link copied to clipboard!');
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col bg-[#F4F7F9] text-[#1A1A2E]" id="discover-root">
      
      {/* 1. HERO SECTION (Dark Navy Theme #000435) */}
      <section className="bg-[#000435] text-white relative pt-8 pb-14 px-6 md:px-10 lg:px-12 overflow-hidden" id="discover-hero">
        {/* Soft grid lines or glow circles */}
        <div className="absolute top-0 right-0 w-[500px] h-[400px] bg-[#FF5B00]/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-[400px] h-[400px] bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none" />
        
        <div className="max-w-7xl mx-auto w-full relative z-10 flex flex-col">
          {/* Breadcrumbs */}
          <div className="flex items-center gap-1.5 text-[10px] font-black text-white/50 uppercase tracking-widest mb-6">
            <Link to="/" className="hover:text-white transition-colors">Home</Link>
            <ChevronRight size={10} />
            <span className="text-white/80">Discover</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            
            {/* Left Column: Headline and Input */}
            <div className="lg:col-span-7 flex flex-col text-left space-y-5">
              <span className="text-xs font-black text-[#FF5B00] uppercase tracking-[0.2em]">DISCOVER.</span>
              <h2 className="text-3xl sm:text-[46px] lg:text-[52px] font-black tracking-tight leading-none text-white uppercase font-sans">
                Smarter Choices,<br />
                Better <span className="text-[#FF5B00]">Decisions.</span>
              </h2>
              <p className="text-xs sm:text-sm text-white/70 max-w-lg font-bold leading-relaxed">
                Explore expert guides, creator reviews, videos, collections, brand stories and real experiences.
              </p>

              {/* Input container matches reference search layout */}
              <div className="relative max-w-xl w-full pt-2">
                <div className="absolute left-4.5 top-1/2 -translate-y-1/2 flex items-center pointer-events-none text-white/50">
                  <Search size={18} />
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search Discover..."
                  className="w-full bg-white/10 backdrop-blur-md h-13 pl-12 pr-28 rounded-2xl text-white placeholder-white/50 font-bold text-xs outline-none focus:ring-2 focus:ring-[#FF5B00]/30 transition-all border border-white/10 focus:bg-white/15"
                />
                <button 
                  onClick={() => toast.success(`Searching for "${searchQuery || 'everything'}"...`)}
                  className="absolute right-1.5 top-1/2 -translate-y-1/2 bg-[#FF5B00] hover:bg-[#EB4501] text-white text-[10px] font-black tracking-wider uppercase px-5 py-2.5 rounded-xl transition-all cursor-pointer"
                >
                  Search
                </button>
              </div>

              {/* Trending searches */}
              <div className="flex flex-wrap items-center gap-2.5 text-[10.5px] font-black pt-2">
                <span className="text-white/40">Trending searches:</span>
                {[
                  'iPhone 15 Pro Max',
                  'Best Laptops 2025',
                  'Running Shoes',
                  'Smartwatches',
                  'Air Fryer'
                ].map((item, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setSearchQuery(item);
                      toast.success(`Filtering by: ${item}`);
                    }}
                    className="bg-white/5 hover:bg-white/10 border border-white/10 px-3 py-1.5 rounded-lg text-white/85 hover:text-white transition-all cursor-pointer"
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>

            {/* Right Column: Hero Collage & Editor's Pick Box */}
            <div className="lg:col-span-5 relative flex justify-center items-center">
              <div className="relative w-full max-w-[440px] aspect-[4/3] rounded-3xl overflow-hidden bg-slate-900/50 border border-white/10 shadow-2xl flex items-center justify-center">
                
                {/* Simulated Collage containing Shoe, Laptop, Headphones, Camera */}
                <img 
                  src="https://images.unsplash.com/photo-1542751371-adc38448a05e?w=600&q=80" 
                  alt="Tech & Lifestyle Collage" 
                  className="w-full h-full object-cover opacity-75"
                  referrerPolicy="no-referrer"
                />

                {/* Collage Overlays */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#000435]/90 via-transparent to-transparent" />
                
                {/* Share Button on top-right */}
                <button 
                  onClick={() => handleShare("Choosify Discover Platform")}
                  className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/10 backdrop-blur-md border border-white/10 hover:bg-white/20 text-white flex items-center justify-center cursor-pointer transition-all active:scale-95"
                >
                  <Share2 size={15} />
                </button>

                {/* Editor's Pick Floating Widget */}
                <div className="absolute bottom-4 left-4 right-4 bg-slate-950/80 backdrop-blur-md border border-white/10 p-3.5 rounded-2xl text-left flex items-center gap-3 shadow-xl hover:scale-[1.01] transition-transform">
                  <div className="w-10 h-10 rounded-xl bg-[#FF5B00]/15 flex items-center justify-center text-[#FF5B00] shrink-0 border border-[#FF5B00]/25">
                    <Sparkles size={18} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-[8px] font-black text-[#FF5B00] tracking-widest uppercase block leading-none mb-1">EDITOR'S PICK</span>
                    <h4 className="text-xs font-black text-white leading-tight truncate">
                      Best Tech of Summer 2025
                    </h4>
                    <span className="text-[9px] text-white/50 font-bold block mt-0.5">12 min read</span>
                  </div>
                  <button 
                    onClick={() => toast.success('Opening Editor\'s Pick!')}
                    className="w-7 h-7 rounded-lg bg-[#FF5B00] hover:bg-[#EB4501] text-white flex items-center justify-center shrink-0 transition-colors"
                  >
                    <ArrowRight size={13} />
                  </button>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 2. CATEGORY NAVIGATION (Full viewport wide horizontal scroll) */}
      <section className="bg-white border-b border-slate-200/60 sticky top-0 z-30 shadow-sm" id="category-nav-bar">
        <div className="max-w-7xl mx-auto w-full px-6 md:px-10 flex items-center justify-between overflow-x-auto no-scrollbar">
          <div className="flex items-center space-x-1 sm:space-x-2 py-3.5 shrink-0">
            {[
              { label: 'All', icon: Sparkles },
              { label: 'Buying Guides', icon: BookOpen },
              { label: 'Videos', icon: PlaySquare },
              { label: 'Creator Reviews', icon: Users },
              { label: 'Collections', icon: LayoutGrid },
              { label: 'Brand Stories', icon: Lightbulb },
              { label: 'Campaigns', icon: Flame },
              { label: 'Blogs', icon: MessageSquare },
              { label: 'Deals', icon: Scale },
              { label: 'Reels', icon: PlaySquare },
              { label: 'Live', icon: Bot }
            ].map((cat) => {
              const Icon = cat.icon;
              const isSelected = activeCategory === cat.label;
              return (
                <button
                  key={cat.label}
                  onClick={() => {
                    setActiveCategory(cat.label);
                    toast.success(`Viewing format: ${cat.label}`);
                  }}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-extrabold transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                    isSelected 
                      ? 'bg-[#FF5B00]/10 text-[#FF5B00] border border-[#FF5B00]/25' 
                      : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50 border border-transparent'
                  }`}
                >
                  <Icon size={12} className={isSelected ? 'text-[#FF5B00]' : 'text-slate-400'} />
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* 3. FILTER BAR ROW */}
      <section className="bg-slate-50 border-b border-slate-200/50 py-3 px-6 md:px-10" id="filter-bar">
        <div className="max-w-7xl mx-auto w-full flex flex-col sm:flex-row gap-3 justify-between items-stretch sm:items-center">
          
          {/* Filter pills group */}
          <div className="flex flex-wrap items-center gap-1.5">
            <button 
              onClick={() => toast.success('Opening extended filter sheet...')}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg border border-slate-200 bg-white text-slate-700 text-[11px] font-black uppercase tracking-wider hover:bg-slate-50 transition-colors"
            >
              <LayoutGrid size={11} className="text-slate-400" />
              <span>Filters</span>
            </button>
            
            <div className="w-px bg-slate-200 h-5 mx-1.5 hidden sm:block" />

            {[
              { id: 'Newest', label: 'Newest' },
              { id: 'Trending', label: 'Trending' },
              { id: 'Most Viewed', label: 'Most Viewed' },
              { id: 'Most Helpful', label: 'Most Helpful' },
              { id: 'Expert Picks', label: 'Expert Picks' },
              { id: 'Official', label: 'Official' },
              { id: 'Verified', label: 'Verified' }
            ].map((f) => {
              const isSelected = activeFilter === f.id;
              return (
                <button
                  key={f.id}
                  onClick={() => {
                    setActiveFilter(f.id);
                    toast.success(`Sorting by: ${f.label}`);
                  }}
                  className={`px-3 py-1.5 rounded-lg text-[10.5px] font-extrabold transition-all cursor-pointer whitespace-nowrap border ${
                    isSelected 
                      ? 'bg-white border-[#FF5B00]/30 text-[#FF5B00] shadow-sm font-black' 
                      : 'bg-white border-slate-200 text-slate-500 hover:text-slate-800'
                  }`}
                >
                  {f.label}
                </button>
              );
            })}
          </div>

          {/* AI Discover Button on the right */}
          <button
            onClick={() => toast.success('Initializing intelligent AI discovery recommendations...')}
            className="bg-white hover:bg-indigo-50/50 border border-indigo-200 px-4 py-1.5 rounded-full text-indigo-700 text-[10px] font-black uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all shadow-sm shrink-0"
          >
            <Bot size={13} className="text-indigo-500 animate-bounce" />
            <span>AI Discover</span>
            <Sparkles size={11} className="text-pink-500" />
          </button>

        </div>
      </section>

      {/* 4. MAIN CONTENT AREA */}
      <main className="max-w-7xl mx-auto w-full px-6 md:px-10 py-8 flex-1 flex flex-col space-y-12 text-left" id="discover-main-content">
        
        {/* SECTION 4.1: FEATURED DISCOVER STORIES (As shown in screenshot) */}
        <section id="featured-discover-stories">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="text-base font-black text-[#000435] uppercase tracking-tight">FEATURED DISCOVER STORIES</h3>
              <p className="text-[10px] text-slate-400 font-bold">Top curated content from our editorial expert team</p>
            </div>
            <button 
              onClick={() => toast.success('Loading all featured content...')}
              className="text-[11px] font-black text-[#FF5B00] hover:text-[#EB4501] uppercase tracking-wider flex items-center gap-1"
            >
              <span>View all featured</span>
              <ArrowRight size={12} />
            </button>
          </div>

          {/* Grid Layout containing 4 large high-contrast visual cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* CARD 1: BUYING GUIDE */}
            <div className="bg-white border border-slate-200/80 rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-shadow group flex flex-col h-full justify-between">
              <div className="relative">
                {/* Aspect ratio layout image */}
                <div className="aspect-[4/3] w-full bg-slate-100 overflow-hidden relative">
                  <img 
                    src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&q=80" 
                    alt="Best Running Shoes" 
                    className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-3 left-3 bg-blue-500 text-white px-2.5 py-0.5 rounded text-[8px] font-black uppercase tracking-wider">
                    BUYING GUIDE
                  </div>
                  <button 
                    onClick={() => toggleSaveArticle("Best Running Shoes for 2026")}
                    className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/80 backdrop-blur-sm text-slate-600 hover:text-[#FF5B00] flex items-center justify-center transition-all shadow"
                  >
                    <Bookmark size={13} fill={savedArticles.includes("Best Running Shoes for 2026") ? "#FF5B00" : "none"} />
                  </button>
                </div>

                <div className="p-5">
                  <h4 className="text-sm font-black text-[#000435] leading-snug group-hover:text-[#FF5B00] transition-colors uppercase tracking-tight">
                    Best Running Shoes for 2026
                  </h4>
                  <div className="flex items-center gap-2 mt-2 text-[10px] text-slate-400 font-bold font-mono">
                    <span>12 min read</span>
                    <span>•</span>
                    <span className="text-[#FF5B00]">Expert Guide</span>
                  </div>
                </div>
              </div>

              {/* Bottom author info matches reference screenshot */}
              <div className="p-4 border-t border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <img 
                    src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&q=80" 
                    alt="Tanvir Hossain" 
                    className="w-7.5 h-7.5 rounded-full border border-slate-200"
                  />
                  <div className="text-left">
                    <p className="text-[10px] font-black text-slate-800 leading-tight">Tanvir Hossain</p>
                    <span className="text-[8px] font-bold text-emerald-600 uppercase tracking-widest block">Verified Expert</span>
                  </div>
                </div>
              </div>
            </div>

            {/* CARD 2: CREATOR REVIEW */}
            <div className="bg-white border border-slate-200/80 rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-shadow group flex flex-col h-full justify-between">
              <div className="relative">
                <div className="aspect-[4/3] w-full bg-slate-100 overflow-hidden relative">
                  <img 
                    src="https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=400&q=80" 
                    alt="Samsung S24 Ultra" 
                    className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-3 left-3 bg-indigo-600 text-white px-2.5 py-0.5 rounded text-[8px] font-black uppercase tracking-wider">
                    CREATOR REVIEW
                  </div>
                  {/* Play circle icon overlay */}
                  <div className="absolute inset-0 bg-black/10 flex items-center justify-center pointer-events-none">
                    <div className="w-10 h-10 rounded-full bg-[#FF5B00] text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                      <Play size={16} fill="currentColor" className="ml-0.5" />
                    </div>
                  </div>
                  <button 
                    onClick={() => toggleSaveArticle("30 Day Review: Samsung S24 Ultra")}
                    className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/80 backdrop-blur-sm text-slate-600 hover:text-[#FF5B00] flex items-center justify-center transition-all shadow"
                  >
                    <Bookmark size={13} fill={savedArticles.includes("30 Day Review: Samsung S24 Ultra") ? "#FF5B00" : "none"} />
                  </button>
                </div>

                <div className="p-5">
                  <h4 className="text-sm font-black text-[#000435] leading-snug group-hover:text-[#FF5B00] transition-colors uppercase tracking-tight">
                    30 Day Review: Samsung S24 Ultra
                  </h4>
                  <div className="flex items-center gap-2 mt-2 text-[10px] text-slate-400 font-bold font-mono">
                    <span>18 min video</span>
                    <span>•</span>
                    <span>2 days ago</span>
                  </div>
                </div>
              </div>

              <div className="p-4 border-t border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <img 
                    src="https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&q=80" 
                    alt="Nusrat Jahan" 
                    className="w-7.5 h-7.5 rounded-full border border-slate-200"
                  />
                  <div className="text-left">
                    <p className="text-[10px] font-black text-slate-800 leading-tight">Nusrat Jahan</p>
                    <span className="text-[8px] font-bold text-indigo-600 uppercase tracking-widest block">Tech Creator</span>
                  </div>
                </div>
              </div>
            </div>

            {/* CARD 3: COLLECTION */}
            <div className="bg-white border border-slate-200/80 rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-shadow group flex flex-col h-full justify-between">
              <div className="relative">
                <div className="aspect-[4/3] w-full bg-slate-100 overflow-hidden relative">
                  <img 
                    src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&q=80" 
                    alt="Minimal Desk Setup" 
                    className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-3 left-3 bg-purple-600 text-white px-2.5 py-0.5 rounded text-[8px] font-black uppercase tracking-wider">
                    COLLECTION
                  </div>
                  <button 
                    onClick={() => toggleSaveArticle("Minimal Desk Setup Ideas for 2025")}
                    className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/80 backdrop-blur-sm text-slate-600 hover:text-[#FF5B00] flex items-center justify-center transition-all shadow"
                  >
                    <Bookmark size={13} fill={savedArticles.includes("Minimal Desk Setup Ideas for 2025") ? "#FF5B00" : "none"} />
                  </button>
                </div>

                <div className="p-5">
                  <h4 className="text-sm font-black text-[#000435] leading-snug group-hover:text-[#FF5B00] transition-colors uppercase tracking-tight">
                    Minimal Desk Setup Ideas for 2025
                  </h4>
                  <div className="flex items-center gap-2 mt-2 text-[10px] text-slate-400 font-bold font-mono">
                    <span>8 Items</span>
                    <span>•</span>
                    <span>Home & Office</span>
                  </div>
                </div>
              </div>

              <div className="p-4 border-t border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <img 
                    src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&q=80" 
                    alt="Productivity Lab" 
                    className="w-7.5 h-7.5 rounded-full border border-slate-200"
                  />
                  <div className="text-left">
                    <p className="text-[10px] font-black text-slate-800 leading-tight">Productivity Lab</p>
                    <span className="text-[8px] font-bold text-purple-600 uppercase tracking-widest block">Official Creator</span>
                  </div>
                </div>
              </div>
            </div>

            {/* CARD 4: BRAND STORY */}
            <div className="bg-white border border-slate-200/80 rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-shadow group flex flex-col h-full justify-between">
              <div className="relative">
                <div className="aspect-[4/3] w-full bg-slate-100 overflow-hidden relative">
                  <img 
                    src="https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=400&q=80" 
                    alt="Behind Aarong's" 
                    className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-3 left-3 bg-[#FF5B00] text-white px-2.5 py-0.5 rounded text-[8px] font-black uppercase tracking-wider">
                    BRAND STORY
                  </div>
                  <button 
                    onClick={() => toggleSaveArticle("Behind Aarong's Summer Collection")}
                    className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/80 backdrop-blur-sm text-slate-600 hover:text-[#FF5B00] flex items-center justify-center transition-all shadow"
                  >
                    <Bookmark size={13} fill={savedArticles.includes("Behind Aarong's Summer Collection") ? "#FF5B00" : "none"} />
                  </button>
                </div>

                <div className="p-5">
                  <h4 className="text-sm font-black text-[#000435] leading-snug group-hover:text-[#FF5B00] transition-colors uppercase tracking-tight">
                    Behind Aarong's Summer Collection
                  </h4>
                  <div className="flex items-center gap-2 mt-2 text-[10px] text-slate-400 font-bold font-mono">
                    <span>10 min read</span>
                    <span>•</span>
                    <span>Brand Story</span>
                  </div>
                </div>
              </div>

              <div className="p-4 border-t border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <img 
                    src="https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=100&q=80" 
                    alt="Aarong Official" 
                    className="w-7.5 h-7.5 rounded-full border border-slate-200"
                  />
                  <div className="text-left">
                    <p className="text-[10px] font-black text-slate-800 leading-tight">Aarong Official</p>
                    <span className="text-[8px] font-bold text-[#FF5B00] uppercase tracking-widest block">Verified Brand</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* SECTION 4.2: TRENDING NOW + BROWSE BY FORMAT */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start" id="trending-and-formats">
          
          {/* Left Block: Trending Now List */}
          <div className="lg:col-span-8 flex flex-col space-y-4">
            <div className="flex flex-col text-left">
              <h3 className="text-sm font-black text-[#000435] uppercase tracking-tight">TRENDING NOW</h3>
              <p className="text-[10px] text-slate-400 font-bold">What's hot on Choosify right now</p>
            </div>

            {/* Horizontal scrolling or grid of trending items */}
            <div className="grid grid-cols-1 sm:grid-cols-5 gap-4">
              {[
                { 
                  title: 'Best Laptop for Students in 2025', 
                  image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=150&q=80',
                  badge: 'TRENDING',
                  badgeColor: 'bg-[#FF5B00]/15 text-[#FF5B00]',
                  readTime: '10 min read', 
                  views: '15.2K',
                  type: 'read'
                },
                { 
                  title: 'Best Smartwatches Under BDT 10,000', 
                  image: 'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=150&q=80',
                  badge: 'TRENDING',
                  badgeColor: 'bg-[#FF5B00]/15 text-[#FF5B00]',
                  readTime: '8 min read', 
                  views: '12.8K',
                  type: 'read'
                },
                { 
                  title: 'Top 5 ANC Earbuds Compared', 
                  image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=150&q=80',
                  badge: 'TRENDING',
                  badgeColor: 'bg-[#FF5B00]/15 text-[#FF5B00]',
                  readTime: '7 min read', 
                  views: '9.6K',
                  type: 'read'
                },
                { 
                  title: 'iPhone 15 vs Samsung S24: Which is Better?', 
                  image: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=150&q=80',
                  badge: 'TRENDING',
                  badgeColor: 'bg-[#FF5B00]/15 text-[#FF5B00]',
                  readTime: '12 min read', 
                  views: '18.4K',
                  type: 'read'
                },
                { 
                  title: 'DJI Mini 4 Pro - Full Review', 
                  image: 'https://images.unsplash.com/photo-1527977966376-1c8408f9f108?w=150&q=80',
                  badge: 'NEW LAUNCH',
                  badgeColor: 'bg-emerald-500/15 text-emerald-600',
                  readTime: '15 min video', 
                  views: '18.1K',
                  type: 'video'
                }
              ].map((item, idx) => (
                <div 
                  key={idx} 
                  onClick={() => toast.success(`Opening: ${item.title}`)}
                  className="bg-white border border-slate-200/60 rounded-2xl p-3 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between h-[210px] text-left group"
                >
                  <div className="relative aspect-video w-full rounded-xl overflow-hidden bg-slate-50 mb-2">
                    <img 
                      src={item.image} 
                      alt={item.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      referrerPolicy="no-referrer"
                    />
                    
                    {/* Badge */}
                    <span className={`absolute top-1.5 left-1.5 text-[7px] font-black tracking-wider uppercase px-1.5 py-0.5 rounded ${item.badgeColor}`}>
                      {item.badge}
                    </span>

                    {/* Video play icon indicator overlay if video */}
                    {item.type === 'video' && (
                      <div className="absolute inset-0 bg-black/10 flex items-center justify-center">
                        <div className="w-6 h-6 rounded-full bg-white text-[#FF5B00] flex items-center justify-center shadow">
                          <Play size={10} fill="currentColor" className="ml-0.5" />
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col justify-between flex-1">
                    <h5 className="text-[10.5px] font-black text-[#000435] leading-snug line-clamp-3 group-hover:text-[#FF5B00] transition-colors uppercase tracking-tight">
                      {item.title}
                    </h5>
                    
                    <div className="flex items-center justify-between mt-1 pt-1.5 border-t border-slate-100 text-[8.5px] text-slate-400 font-bold font-mono">
                      <span>{item.readTime}</span>
                      <span className="flex items-center gap-0.5 text-slate-500 font-extrabold shrink-0">
                        <Flame size={9} className="text-[#FF5B00]" />
                        {item.views}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Block: Browse by Format List */}
          <div className="lg:col-span-4 flex flex-col space-y-4">
            <div className="flex justify-between items-end">
              <div className="text-left">
                <h3 className="text-sm font-black text-[#000435] uppercase tracking-tight">BROWSE BY FORMAT</h3>
                <p className="text-[10px] text-slate-400 font-bold">Choose how you want to discover</p>
              </div>
              <button 
                onClick={() => toast.success('Loading format overview...')}
                className="text-[10px] font-black text-[#FF5B00] hover:text-[#EB4501] uppercase tracking-widest block shrink-0"
              >
                View all formats &rarr;
              </button>
            </div>

            <div className="bg-white border border-slate-200/80 rounded-3xl p-5.5 space-y-3.5 shadow-sm">
              {[
                { label: 'Videos', desc: 'Watch expert videos', color: 'bg-red-50 text-red-500 border-red-100', icon: PlaySquare },
                { label: 'Buying Guides', desc: 'In-depth buying help', color: 'bg-blue-50 text-blue-600 border-blue-100', icon: BookOpen },
                { label: 'Reviews', desc: 'Honest product reviews', color: 'bg-emerald-50 text-emerald-600 border-emerald-100', icon: CheckCircle2 },
                { label: 'Comparisons', desc: 'Compare products side-by-side', color: 'bg-indigo-50 text-indigo-600 border-indigo-100', icon: Scale },
                { label: 'Lists & Rankings', desc: 'Top picks & rankings', color: 'bg-purple-50 text-purple-600 border-purple-100', icon: ListOrdered },
                { label: 'How-To & Tips', desc: 'Learn & improve your device usage', color: 'bg-orange-50 text-[#FF5B00] border-orange-100', icon: Lightbulb }
              ].map((format, idx) => {
                const IconComponent = format.icon;
                return (
                  <button
                    key={idx}
                    onClick={() => {
                      setActiveCategory(format.label);
                      toast.success(`Active Format: ${format.label}`);
                    }}
                    className="w-full flex items-center justify-between p-2.5 rounded-2xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100 text-left cursor-pointer group"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border ${format.color}`}>
                        <IconComponent size={16} />
                      </div>
                      <div>
                        <p className="text-[11.5px] font-extrabold text-[#000435] leading-none mb-1 group-hover:text-[#FF5B00] transition-colors">{format.label}</p>
                        <p className="text-[9.5px] text-slate-400 font-semibold leading-none">{format.desc}</p>
                      </div>
                    </div>
                    <ChevronRight size={13} className="text-slate-300 group-hover:text-[#FF5B00] transition-colors" />
                  </button>
                );
              })}
            </div>
          </div>

        </section>

        {/* SECTION 4.3: GUIDES BY PRODUCT TYPE */}
        <section id="guides-by-product-type">
          <div className="flex justify-between items-end mb-5">
            <div className="text-left">
              <h3 className="text-sm font-black text-[#000435] uppercase tracking-tight">GUIDES BY PRODUCT TYPE</h3>
              <p className="text-[10px] text-slate-400 font-bold">Explore our comprehensive buying guides</p>
            </div>
            <button 
              onClick={() => toast.success('Loading all categories...')}
              className="text-[11px] font-black text-[#FF5B00] hover:text-[#EB4501] uppercase tracking-wider block shrink-0"
            >
              View all categories &rarr;
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* CATEGORY 1: SMARTPHONES */}
            <div className="bg-white border border-slate-200/80 rounded-3xl p-6 flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow">
              <div>
                <h4 className="text-xs font-black text-[#000435] uppercase tracking-wider mb-4 pb-1.5 border-b border-slate-100 flex justify-between items-center">
                  <span>Smartphones</span>
                  <span className="text-[9px] text-[#FF5B00] bg-[#FF5B00]/5 px-2 py-0.5 rounded-full font-bold">Category</span>
                </h4>
                
                <ul className="space-y-3">
                  {[
                    'Best Phones Under 20,000',
                    'Flagship Phones Comparison',
                    'Camera Phones Guide',
                    'Battery Life Comparison'
                  ].map((guide, idx) => (
                    <li key={idx}>
                      <button 
                        onClick={() => toast.success(`Opening: ${guide}`)}
                        className="text-slate-600 hover:text-[#FF5B00] text-xs font-bold leading-tight flex items-center gap-1.5 text-left"
                      >
                        <span className="text-[#FF5B00]">•</span>
                        <span>{guide}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex items-center justify-between mt-6 pt-4 border-t border-slate-100">
                <button 
                  onClick={() => toast.success('Viewing 128 smartphone guides...')}
                  className="text-[9.5px] font-black text-slate-400 hover:text-[#FF5B00] uppercase tracking-wider flex items-center gap-1 transition-colors"
                >
                  <span>View All (128)</span>
                  <ArrowRight size={10} />
                </button>
                <img 
                  src="https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=100&q=80" 
                  alt="Phone" 
                  className="w-10 h-10 object-contain rounded-lg bg-slate-50 p-1 shrink-0"
                  referrerPolicy="no-referrer"
                />
              </div>
            </div>

            {/* CATEGORY 2: LAPTOPS */}
            <div className="bg-white border border-slate-200/80 rounded-3xl p-6 flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow">
              <div>
                <h4 className="text-xs font-black text-[#000435] uppercase tracking-wider mb-4 pb-1.5 border-b border-slate-100 flex justify-between items-center">
                  <span>Laptops</span>
                  <span className="text-[9px] text-[#FF5B00] bg-[#FF5B00]/5 px-2 py-0.5 rounded-full font-bold">Category</span>
                </h4>
                
                <ul className="space-y-3">
                  {[
                    'Best Laptops for Students',
                    'Gaming Laptops Guide',
                    'MacBooks vs Windows',
                    'Budget Laptops'
                  ].map((guide, idx) => (
                    <li key={idx}>
                      <button 
                        onClick={() => toast.success(`Opening: ${guide}`)}
                        className="text-slate-600 hover:text-[#FF5B00] text-xs font-bold leading-tight flex items-center gap-1.5 text-left"
                      >
                        <span className="text-[#FF5B00]">•</span>
                        <span>{guide}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex items-center justify-between mt-6 pt-4 border-t border-slate-100">
                <button 
                  onClick={() => toast.success('Viewing 98 laptop guides...')}
                  className="text-[9.5px] font-black text-slate-400 hover:text-[#FF5B00] uppercase tracking-wider flex items-center gap-1 transition-colors"
                >
                  <span>View All (98)</span>
                  <ArrowRight size={10} />
                </button>
                <img 
                  src="https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=100&q=80" 
                  alt="Laptop" 
                  className="w-10 h-10 object-contain rounded-lg bg-slate-50 p-1 shrink-0"
                  referrerPolicy="no-referrer"
                />
              </div>
            </div>

            {/* CATEGORY 3: AUDIO */}
            <div className="bg-white border border-slate-200/80 rounded-3xl p-6 flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow">
              <div>
                <h4 className="text-xs font-black text-[#000435] uppercase tracking-wider mb-4 pb-1.5 border-b border-slate-100 flex justify-between items-center">
                  <span>Audio</span>
                  <span className="text-[9px] text-[#FF5B00] bg-[#FF5B00]/5 px-2 py-0.5 rounded-full font-bold">Category</span>
                </h4>
                
                <ul className="space-y-3">
                  {[
                    'Headphones Buying Guide',
                    'Wireless Earbuds Guide',
                    'Speakers Comparison',
                    'Soundbars Guide'
                  ].map((guide, idx) => (
                    <li key={idx}>
                      <button 
                        onClick={() => toast.success(`Opening: ${guide}`)}
                        className="text-slate-600 hover:text-[#FF5B00] text-xs font-bold leading-tight flex items-center gap-1.5 text-left"
                      >
                        <span className="text-[#FF5B00]">•</span>
                        <span>{guide}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex items-center justify-between mt-6 pt-4 border-t border-slate-100">
                <button 
                  onClick={() => toast.success('Viewing 76 audio guides...')}
                  className="text-[9.5px] font-black text-slate-400 hover:text-[#FF5B00] uppercase tracking-wider flex items-center gap-1 transition-colors"
                >
                  <span>View All (76)</span>
                  <ArrowRight size={10} />
                </button>
                <img 
                  src="https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=100&q=80" 
                  alt="Headphones" 
                  className="w-10 h-10 object-contain rounded-lg bg-slate-50 p-1 shrink-0"
                  referrerPolicy="no-referrer"
                />
              </div>
            </div>

            {/* CATEGORY 4: CAMERAS */}
            <div className="bg-white border border-slate-200/80 rounded-3xl p-6 flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow">
              <div>
                <h4 className="text-xs font-black text-[#000435] uppercase tracking-wider mb-4 pb-1.5 border-b border-slate-100 flex justify-between items-center">
                  <span>Cameras</span>
                  <span className="text-[9px] text-[#FF5B00] bg-[#FF5B00]/5 px-2 py-0.5 rounded-full font-bold">Category</span>
                </h4>
                
                <ul className="space-y-3">
                  {[
                    'DSLR vs Mirrorless',
                    'Best Cameras for Beginners',
                    'Videography Cameras',
                    'Lens Buying Guide'
                  ].map((guide, idx) => (
                    <li key={idx}>
                      <button 
                        onClick={() => toast.success(`Opening: ${guide}`)}
                        className="text-slate-600 hover:text-[#FF5B00] text-xs font-bold leading-tight flex items-center gap-1.5 text-left"
                      >
                        <span className="text-[#FF5B00]">•</span>
                        <span>{guide}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex items-center justify-between mt-6 pt-4 border-t border-slate-100">
                <button 
                  onClick={() => toast.success('Viewing 55 camera guides...')}
                  className="text-[9.5px] font-black text-slate-400 hover:text-[#FF5B00] uppercase tracking-wider flex items-center gap-1 transition-colors"
                >
                  <span>View All (55)</span>
                  <ArrowRight size={10} />
                </button>
                <img 
                  src="https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=100&q=80" 
                  alt="Camera" 
                  className="w-10 h-10 object-contain rounded-lg bg-slate-50 p-1 shrink-0"
                  referrerPolicy="no-referrer"
                />
              </div>
            </div>

            {/* CATEGORY 5: GAMING */}
            <div className="bg-white border border-slate-200/80 rounded-3xl p-6 flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow">
              <div>
                <h4 className="text-xs font-black text-[#000435] uppercase tracking-wider mb-4 pb-1.5 border-b border-slate-100 flex justify-between items-center">
                  <span>Gaming</span>
                  <span className="text-[9px] text-[#FF5B00] bg-[#FF5B00]/5 px-2 py-0.5 rounded-full font-bold">Category</span>
                </h4>
                
                <ul className="space-y-3">
                  {[
                    'Gaming PC Build Guide',
                    'Gaming Accessories',
                    'Monitor Buying Guide',
                    'Console Comparison'
                  ].map((guide, idx) => (
                    <li key={idx}>
                      <button 
                        onClick={() => toast.success(`Opening: ${guide}`)}
                        className="text-slate-600 hover:text-[#FF5B00] text-xs font-bold leading-tight flex items-center gap-1.5 text-left"
                      >
                        <span className="text-[#FF5B00]">•</span>
                        <span>{guide}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex items-center justify-between mt-6 pt-4 border-t border-slate-100">
                <button 
                  onClick={() => toast.success('Viewing 32 gaming guides...')}
                  className="text-[9.5px] font-black text-slate-400 hover:text-[#FF5B00] uppercase tracking-wider flex items-center gap-1 transition-colors"
                >
                  <span>View All (32)</span>
                  <ArrowRight size={10} />
                </button>
                <img 
                  src="https://images.unsplash.com/photo-1527977966376-1c8408f9f108?w=100&q=80" 
                  alt="Gaming" 
                  className="w-10 h-10 object-contain rounded-lg bg-slate-50 p-1 shrink-0"
                  referrerPolicy="no-referrer"
                />
              </div>
            </div>

            {/* CATEGORY 6: HOME APPLIANCES */}
            <div className="bg-white border border-slate-200/80 rounded-3xl p-6 flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow">
              <div>
                <h4 className="text-xs font-black text-[#000435] uppercase tracking-wider mb-4 pb-1.5 border-b border-slate-100 flex justify-between items-center">
                  <span>Home Appliances</span>
                  <span className="text-[9px] text-[#FF5B00] bg-[#FF5B00]/5 px-2 py-0.5 rounded-full font-bold">Category</span>
                </h4>
                
                <ul className="space-y-3">
                  {[
                    'Refrigerator Guide',
                    'Washing Machine Guide',
                    'Air Conditioner Guide',
                    'Kitchen Appliances'
                  ].map((guide, idx) => (
                    <li key={idx}>
                      <button 
                        onClick={() => toast.success(`Opening: ${guide}`)}
                        className="text-slate-600 hover:text-[#FF5B00] text-xs font-bold leading-tight flex items-center gap-1.5 text-left"
                      >
                        <span className="text-[#FF5B00]">•</span>
                        <span>{guide}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex items-center justify-between mt-6 pt-4 border-t border-slate-100">
                <button 
                  onClick={() => toast.success('Viewing 60 home appliances guides...')}
                  className="text-[9.5px] font-black text-slate-400 hover:text-[#FF5B00] uppercase tracking-wider flex items-center gap-1 transition-colors"
                >
                  <span>View All (60)</span>
                  <ArrowRight size={10} />
                </button>
                <img 
                  src="https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=100&q=80" 
                  alt="Home Appliances" 
                  className="w-10 h-10 object-contain rounded-lg bg-slate-50 p-1 shrink-0"
                  referrerPolicy="no-referrer"
                />
              </div>
            </div>

          </div>
        </section>

        {/* SECTION 4.4: EXPERT'S PICKS & TOP CREATORS */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start" id="experts-and-creators">
          
          {/* Left Block: Expert's Picks */}
          <div className="lg:col-span-7 flex flex-col space-y-4">
            <div className="flex justify-between items-end">
              <div className="text-left">
                <h3 className="text-sm font-black text-[#000435] uppercase tracking-tight">EXPERT'S PICKS</h3>
                <p className="text-[10px] text-slate-400 font-bold">Handpicked by our expert team</p>
              </div>
              <button 
                onClick={() => toast.success('Loading all expert picks...')}
                className="text-[10px] font-black text-[#FF5B00] hover:text-[#EB4501] uppercase tracking-widest block shrink-0"
              >
                View all picks &rarr;
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 items-stretch">
              {/* 3 list items on the left */}
              <div className="sm:col-span-5 space-y-3.5 flex flex-col justify-between">
                {[
                  {
                    num: '1',
                    title: 'Best 4K TVs for Home Theater in 2025',
                    image: 'https://images.unsplash.com/photo-1593305841991-05c297ba4575?w=80&q=80',
                    readTime: '9 min read',
                    views: '12.6K'
                  },
                  {
                    num: '2',
                    title: 'Camera Settings Every Beginner Should Know',
                    image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=80&q=80',
                    readTime: '7 min read',
                    views: '8.9K'
                  },
                  {
                    num: '3',
                    title: 'How to Choose the Right Gaming Monitor',
                    image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=80&q=80',
                    readTime: '6 min read',
                    views: '7.4K'
                  }
                ].map((pick) => (
                  <div 
                    key={pick.num}
                    onClick={() => toast.success(`Opening: ${pick.title}`)}
                    className="bg-white border border-slate-200/60 p-3.5 rounded-2xl flex items-start gap-3 hover:shadow-sm transition-all cursor-pointer group text-left flex-1"
                  >
                    <span className="text-sm font-black text-indigo-600 shrink-0 mt-0.5">{pick.num}</span>
                    <div className="w-12 h-12 rounded-lg bg-slate-50 border border-slate-100 overflow-hidden shrink-0">
                      <img src={pick.image} alt={pick.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" referrerPolicy="no-referrer" />
                    </div>
                    <div className="min-w-0 flex-1 flex flex-col justify-between">
                      <h5 className="text-[10.5px] font-extrabold text-[#000435] leading-snug line-clamp-2 uppercase tracking-tight group-hover:text-[#FF5B00] transition-colors">{pick.title}</h5>
                      <div className="flex items-center justify-between text-[8px] text-slate-400 font-bold font-mono mt-1">
                        <span>{pick.readTime}</span>
                        <span className="flex items-center gap-0.5 text-slate-500">
                          <Flame size={8} className="text-[#FF5B00]" />
                          {pick.views}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Huge editor's pick on the right */}
              <div 
                onClick={() => toast.success('Opening: Best Noise Cancelling Headphones in 2025')}
                className="sm:col-span-7 bg-white border border-slate-200/80 rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between group cursor-pointer text-left"
              >
                <div className="relative aspect-[16/10] bg-slate-100 w-full overflow-hidden">
                  <img 
                    src="https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=400&q=80" 
                    alt="Best Noise Cancelling Headphones" 
                    className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-3 left-3 bg-[#FF5B00] text-white px-2.5 py-0.5 rounded text-[8px] font-black uppercase tracking-wider">
                    EDITOR'S PICK
                  </div>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleSaveArticle("Best Noise Cancelling Headphones in 2025");
                    }}
                    className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/80 backdrop-blur-sm text-slate-600 hover:text-[#FF5B00] flex items-center justify-center transition-all shadow"
                  >
                    <Bookmark size={13} fill={savedArticles.includes("Best Noise Cancelling Headphones in 2025") ? "#FF5B00" : "none"} />
                  </button>
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <h4 className="text-sm font-black text-[#000435] leading-snug group-hover:text-[#FF5B00] transition-colors uppercase tracking-tight">
                      Best Noise Cancelling Headphones in 2025
                    </h4>
                    <span className="text-[10px] text-slate-400 font-bold font-mono mt-1.5 block">10 min read</span>
                  </div>

                  <div className="flex items-center gap-2.5 pt-4 border-t border-slate-100 mt-5">
                    <img 
                      src="https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=100&q=80" 
                      alt="Headphone Zone" 
                      className="w-7 h-7 rounded-full border border-slate-200"
                    />
                    <div className="text-left">
                      <p className="text-[9.5px] font-black text-slate-800 leading-none mb-0.5">Headphone Zone</p>
                      <span className="text-[7.5px] font-bold text-[#FF5B00] uppercase tracking-wider block">Official Review</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Block: Top Creators */}
          <div className="lg:col-span-5 flex flex-col space-y-4">
            <div className="flex justify-between items-end">
              <div className="text-left">
                <h3 className="text-sm font-black text-[#000435] uppercase tracking-tight">TOP CREATORS</h3>
                <p className="text-[10px] text-slate-400 font-bold">Discover trusted voices</p>
              </div>
              <button 
                onClick={() => toast.success('Loading creators directory...')}
                className="text-[10px] font-black text-[#FF5B00] hover:text-[#EB4501] uppercase tracking-widest block shrink-0"
              >
                View all creators &rarr;
              </button>
            </div>

            <div className="bg-white border border-slate-200/80 rounded-3xl p-5.5 space-y-4 shadow-sm">
              {[
                {
                  name: 'Tech World BD',
                  badge: 'Verified Expert',
                  badgeColor: 'text-emerald-600 bg-emerald-50 border-emerald-100',
                  avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&q=80',
                  guides: '128 Guides',
                  followers: '452K Followers'
                },
                {
                  name: 'Gadget & Gear',
                  badge: 'Tech Creator',
                  badgeColor: 'text-indigo-600 bg-indigo-50 border-indigo-100',
                  avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=120&q=80',
                  guides: '98 Guides',
                  followers: '312K Followers'
                },
                {
                  name: 'Style With Me',
                  badge: 'Fashion Creator',
                  badgeColor: 'text-pink-600 bg-pink-50 border-pink-100',
                  avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=120&q=80',
                  guides: '76 Guides',
                  followers: '245K Followers'
                },
                {
                  name: 'Productivity Lab',
                  badge: 'Lifestyle Creator',
                  badgeColor: 'text-purple-600 bg-purple-50 border-purple-100',
                  avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=120&q=80',
                  guides: '64 Guides',
                  followers: '198K Followers'
                }
              ].map((creator) => {
                const isFollowing = followedCreators.includes(creator.name);
                return (
                  <div 
                    key={creator.name}
                    className="flex items-center justify-between p-1 text-left"
                  >
                    <div className="flex items-center gap-3">
                      <div className="relative w-10 h-10 rounded-full border border-slate-200/80 overflow-hidden bg-slate-50 shrink-0">
                        <img src={creator.avatar} alt={creator.name} className="w-full h-full object-cover" />
                        <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full border border-white" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-[11px] font-black text-[#000435] leading-none">{creator.name}</h4>
                          <span className={`text-[7px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded border shrink-0 ${creator.badgeColor}`}>
                            {creator.badge}
                          </span>
                        </div>
                        <p className="text-[9px] text-slate-400 font-bold font-mono mt-1 leading-none">{creator.guides} • {creator.followers}</p>
                      </div>
                    </div>

                    <button
                      onClick={() => toggleFollowCreator(creator.name)}
                      className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-wider border cursor-pointer transition-all ${
                        isFollowing 
                          ? 'bg-slate-50 border-slate-200 text-slate-400 hover:text-red-500 hover:bg-red-50/50 hover:border-red-100' 
                          : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700'
                      }`}
                    >
                      {isFollowing ? 'Following' : 'Follow'}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

        </section>

        {/* SECTION 4.5: FROM OUR COMMUNITY */}
        <section id="community-reviews">
          <div className="flex justify-between items-end mb-6">
            <div className="text-left">
              <h3 className="text-sm font-black text-[#000435] uppercase tracking-tight">FROM OUR COMMUNITY</h3>
              <p className="text-[10px] text-slate-400 font-bold">Real experiences from verified users</p>
            </div>
            <button 
              onClick={() => toast.success('Loading all community reviews...')}
              className="text-[11px] font-black text-[#FF5B00] hover:text-[#EB4501] uppercase tracking-wider block shrink-0"
            >
              View all reviews &rarr;
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            
            {/* Left Community Review */}
            <div className="lg:col-span-4 bg-white border border-slate-200/80 rounded-3xl p-6.5 flex flex-col justify-between text-left shadow-sm">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <img 
                    src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&q=80" 
                    alt="Tanvir Hossain" 
                    className="w-10 h-10 rounded-full border border-slate-200 shrink-0"
                  />
                  <div>
                    <h5 className="text-[11px] font-black text-slate-800 leading-none mb-1">Tanvir Hossain</h5>
                    <span className="text-[8px] font-bold text-emerald-600 uppercase tracking-widest block leading-none">Verified Expert</span>
                  </div>
                </div>

                {/* Rating Stars */}
                <div className="flex gap-1 text-amber-400 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={11} fill="currentColor" />
                  ))}
                  <span className="text-slate-800 text-[10px] font-black ml-1.5 font-mono">5/5</span>
                </div>

                <p className="text-xs text-slate-500 font-semibold leading-relaxed">
                  "I have been using Samsung products for years and they never disappoint. Excellent build quality and amazing performance."
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-[9.5px]">
                <div className="text-left leading-tight">
                  <p className="text-[8px] text-slate-400 font-bold uppercase">Target Product</p>
                  <p className="font-extrabold text-[#000435] mt-0.5">Samsung Galaxy S24 Ultra</p>
                  <span className="text-[8.5px] text-slate-400 font-bold font-mono">2 days ago</span>
                </div>
                <button 
                  onClick={() => toast.success('You found this review helpful!')}
                  className="bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-500 hover:text-slate-800 px-3 py-1.5 rounded-lg font-black uppercase tracking-wider text-[8px] cursor-pointer"
                >
                  Helpful (124)
                </button>
              </div>
            </div>

            {/* Center average score breakdown */}
            <div className="lg:col-span-4 bg-white border border-slate-200/80 rounded-3xl p-6.5 flex flex-col justify-center items-center text-center shadow-sm">
              <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1.5">AVERAGE RATING</span>
              <h2 className="text-5xl font-black text-[#000435] leading-none tracking-tight">4.8</h2>
              
              <div className="flex gap-1 text-amber-400 mt-2.5 mb-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={13} fill="currentColor" />
                ))}
              </div>
              <span className="text-[10px] text-slate-400 font-bold font-mono mb-6">(12.4K Reviews)</span>

              {/* Progress bars */}
              <div className="w-full space-y-1.5 text-[10px] font-bold text-slate-500">
                {[
                  { stars: '5', count: '9.6K', percentage: '80%' },
                  { stars: '4', count: '2.1K', percentage: '15%' },
                  { stars: '3', count: '524', percentage: '4%' },
                  { stars: '2', count: '123', percentage: '1%' },
                  { stars: '1', count: '58', percentage: '0%' }
                ].map((stat) => (
                  <div key={stat.stars} className="flex items-center gap-3">
                    <span className="w-3 text-right shrink-0">{stat.stars}</span>
                    <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-amber-400 rounded-full" style={{ width: stat.percentage }} />
                    </div>
                    <span className="w-8 text-right font-mono text-slate-400 shrink-0">{stat.count}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Community Review */}
            <div className="lg:col-span-4 bg-white border border-slate-200/80 rounded-3xl p-6.5 flex flex-col justify-between text-left shadow-sm">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <img 
                    src="https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&q=80" 
                    alt="Nusrat Jahan" 
                    className="w-10 h-10 rounded-full border border-slate-200 shrink-0"
                  />
                  <div>
                    <h5 className="text-[11px] font-black text-slate-800 leading-none mb-1">Nusrat Jahan</h5>
                    <span className="text-[8px] font-bold text-indigo-600 uppercase tracking-widest block leading-none">Verified Buyer</span>
                  </div>
                </div>

                <div className="flex gap-1 text-amber-400 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={11} fill={i < 4 ? "currentColor" : "none"} className={i >= 4 ? "text-slate-200" : ""} />
                  ))}
                  <span className="text-slate-800 text-[10px] font-black ml-1.5 font-mono">4.8/5</span>
                </div>

                <p className="text-xs text-slate-500 font-semibold leading-relaxed">
                  "The Bespoke refrigerator is perfect for our home. Stylish design and super efficient cooling."
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-[9.5px]">
                <div className="text-left leading-tight">
                  <p className="text-[8px] text-slate-400 font-bold uppercase">Target Product</p>
                  <p className="font-extrabold text-[#000435] mt-0.5">Samsung Bespoke 4-Door Refrigerator</p>
                  <span className="text-[8.5px] text-slate-400 font-bold font-mono">6 days ago</span>
                </div>
                <button 
                  onClick={() => toast.success('You found this review helpful!')}
                  className="bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-500 hover:text-slate-800 px-3 py-1.5 rounded-lg font-black uppercase tracking-wider text-[8px] cursor-pointer"
                >
                  Helpful (60)
                </button>
              </div>
            </div>

          </div>
        </section>

      </main>

      {/* 5. Bottom Trust Badges Section */}
      <section className="bg-white border-t border-slate-200/50 py-10 px-6 md:px-10" id="trust-strip">
        <div className="max-w-7xl mx-auto w-full grid grid-cols-2 md:grid-cols-5 gap-6 select-none text-left">
          {[
            { title: 'Expert & Verified', desc: 'Content by experts and verified creators.', icon: CheckCircle2 },
            { title: '100% Independent', desc: 'Unbiased guides you can trust completely.', icon: ShieldCheck },
            { title: 'Regularly Updated', desc: 'Latest shopping trends and pricing guides.', icon: Calendar },
            { title: 'Real Experiences', desc: 'From real customers and verified buyers.', icon: Sparkles },
            { title: 'Smart & Helpful', desc: 'AI assisted discovery just for you.', icon: Bot }
          ].map((item, idx) => {
            const Icon = item.icon;
            return (
              <div 
                key={idx} 
                className={`flex flex-col items-start space-y-2.5 p-4 bg-[#F4F7F9]/50 rounded-2xl border border-slate-200/40 hover:bg-[#F4F7F9] transition-all ${
                  idx === 4 ? 'col-span-2 md:col-span-1' : ''
                }`}
              >
                <div className="w-9 h-9 rounded-full bg-[#FF5B00]/10 text-[#FF5B00] flex items-center justify-center shrink-0">
                  <Icon size={18} />
                </div>
                <h4 className="text-[11.5px] font-black text-[#000435] uppercase tracking-tight leading-none">
                  {item.title}
                </h4>
                <p className="text-[10px] text-slate-400 font-semibold leading-normal">
                  {item.desc}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* 6. CHOOSIFY.BD TRUST STATEMENT STATEMENT CALLOUT */}
      <section className="bg-[#000435] border-t border-white/5 text-white py-12 px-6 md:px-10" id="discover-trust-statement">
        <div className="max-w-4xl mx-auto text-center flex flex-col items-center justify-center">
          <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-1.5 rounded-full text-[9.5px] font-black tracking-[0.25em] text-[#FF5B00] uppercase mb-3">
            <ShieldCheck size={13} className="text-[#FF5B00]" />
            <span>CHOOSIFY.BD TRUST STATEMENT</span>
          </div>
          <p className="text-xs md:text-sm text-slate-300 font-bold leading-relaxed max-w-2xl italic">
            "Only verified sellers and completely unbiased, authentic brand experiences are listed on Choosify."
          </p>
          <div className="w-12 h-[3px] bg-[#FF5B00] rounded-full mt-4" />
        </div>
      </section>

      {/* 7. FOOTER SECTION */}
      <footer className="bg-[#050616] text-white/50 border-t border-white/5 py-12 px-6 md:px-10 text-left" id="discover-footer">
        <div className="max-w-7xl mx-auto w-full grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          
          {/* Logo & Description */}
          <div className="md:col-span-4 space-y-4">
            <svg viewBox="0 0 2585.84 505.4" className="h-6.5 w-auto text-white" xmlns="http://www.w3.org/2000/svg">
              <g>
                <g>
                  <path fill="#FF5B00" d="M921.65,303.09c0-47.35-38.42-85.71-85.76-85.71s-85.76,38.36-85.76,85.71,38.42,85.76,85.76,85.76c8.22,0,16.14-1.17,23.65-3.3-3.3-5.38-5.23-11.77-5.23-18.57,0-19.74,15.99-35.73,35.68-35.73,8.93,0,17.1,3.3,23.34,8.68,5.33-11.16,8.32-23.65,8.32-36.84Z"/>
                  <path fill="#FF5B00" d="M356.15,303.09c0-47.35-38.42-85.71-85.76-85.71s-85.76,38.36-85.76,85.71c0,47.35,38.42,85.76,85.76,85.76,8.22,0,16.14-1.17,23.65-3.3-3.3-5.38-5.23-11.77-5.23-18.57,0-19.74,15.99-35.73,35.68-35.73,8.93,0,17.1,3.3,23.34,8.68,5.33-11.16,8.32-23.65,8.32-36.84Z"/>
                  <path fill="#FF5B00" d="M252.7,505.4C113.36,505.4,0,392.04,0,252.7S113.36,0,252.7,0s252.7,113.36,252.7,252.7-113.36,252.7-252.7,252.7ZM252.7,57.74c-107.5,0-194.96,87.46-194.96,194.96s87.46,194.96,194.96,194.96,194.96-87.46,194.96-194.96S360.2,57.74,252.7,57.74Z"/>
                  <path fill="#FF5B00" d="M779.18,505.4c-139.34,0-252.7-113.36-252.7-252.7S639.84,0,779.18,0s252.7,113.36,252.7,252.7-113.36,252.7-252.7,252.7ZM779.18,57.74c-107.5,0-194.96,87.46-194.96,194.96s87.46,194.96,194.96,194.96,194.96-87.46,194.96-194.96-87.46-194.96-194.96-194.96Z"/>
                </g>
                <g>
                  <path fill="#fff" d="M1094.27,260.83c0-54.18,36.9-95.48,93.45-95.48,48.09,0,77.9,27.43,84.31,66.7h-51.45c-3.72-16.59-14.55-27.09-32.15-27.09-26.77,0-40.3,22.01-40.3,55.88s13.53,55.19,40.3,55.19c19.62,0,31.48-11.85,33.85-32.51h51.13c-1.7,40.97-34.21,72.8-84.31,72.8-57.58,0-94.83-41.64-94.83-95.48Z"/>
                  <path fill="#fff" d="M1351.4,350.56h-53.18V98.64h53.18v69.42c0,1.68,0,16.25-.35,28.1h1.03c10.84-19.3,29.11-30.81,54.18-30.81,39.59,0,62.64,26.4,62.64,66.7v118.52h-52.83v-108.36c0-19.64-10.48-32.84-30.13-32.84-20.65,0-34.53,16.59-34.53,39.62v101.58Z"/>
                  <path fill="#fff" d="M1494.41,260.83c0-54.18,37.92-95.48,95.5-95.48s94.8,41.31,94.8,95.48-37.57,95.48-94.8,95.48-95.5-41.64-95.5-95.48ZM1630.88,260.83c0-34.21-14.91-57.56-41.32-57.56s-41.29,23.35-41.29,57.56,14.2,56.89,41.29,56.89,41.32-23.03,41.32-56.89Z"/>
                  <path fill="#fff" d="M1703.14,260.83c0-54.18,37.92-95.48,95.5-95.48s94.8,41.31,94.8,95.48-37.57,95.48-94.8,95.48-95.5-41.64-95.5-95.48ZM1839.61,260.83c0-34.21-14.91-57.56-41.32-57.56s-41.29,23.35-41.29,57.56,14.2,56.89,41.29,56.89,41.32-23.03,41.32-56.89Z"/>
                  <path fill="#fff" d="M1908.8,295.02h50.11c3.05,16.94,15.93,26.42,36.58,26.42,18.98,0,29.81-7.79,29.81-20.65,0-16.25-21.35-18.29-46.39-23.03-32.19-6.09-64.69-14.22-64.69-56.21,0-36.9,33.53-56.2,75.85-56.2,50.11,0,75.18,21.67,79.92,53.15h-49.43c-3.4-12.86-13.56-19.3-30.49-19.3s-26.74,6.78-26.74,18.29c0,13.54,19.62,15.58,44.34,19.97,32.19,5.75,68.76,14.22,68.76,59.6,0,38.95-34.56,59.26-81.27,59.26-52.16,0-83.64-25.05-86.36-61.29Z"/>
                  <rect fill="#fff" x="2102.94" y="170.41" width="53.18" height="180.15"/>
                  <path fill="#fff" d="M2260.83,204.96v145.61h-53.18v-145.61h-27.09v-34.54h27.09v-15.23c0-19.3,4.74-32.84,15.26-42.33,11.83-10.5,30.46-14.55,53.47-14.22,7.12,0,14.59.34,22.02,1.35v37.92c-26.74-1.01-37.57.69-37.57,21v11.51h37.57v34.54h-37.57Z"/>
                  <path fill="#fff" d="M2335.71,410.16v-41.64h2.72c.67.34,15.9.34,17.28.34,16.57,0,24.72-6.09,25.71-18.29,0-6.09-3.05-19.97-9.46-36.23l-55.88-143.92h55.88l23.02,69.09c8.11,24.38,14.91,62.64,14.91,62.64h.67s8.11-38.6,15.9-62.64l22.02-69.09h52.83l-64.34,184.56c-14.59,41.64-31.16,55.86-65.69,55.86-1.7,0-34.56-.34-35.58-.67Z"/>
                  <path fill="#FF5B00" d="M2129.7,152.15c15.9,0,28.78-12.9,28.78-28.8,0-15.9-12.88-28.8-28.78-28.8-15.9,0-28.8,12.9-28.8,28.8,0,2.76.39,5.42,1.11,7.94,1.81-1.11,3.95-1.76,6.24-1.76,6.63,0,12,5.37,12,11.98,0,3-1.11,5.74-2.91,7.84,3.75,1.79,7.94,2.79,12.37,2.79Z"/>
                </g>
              </g>
            </svg>
            <p className="text-xs leading-relaxed max-w-sm text-slate-400 font-bold">
              Bangladesh's smartest product discovery platform. Find the best brands, compare prices and shop with confidence.
            </p>
            
            {/* Social media links */}
            <div className="flex gap-4.5 pt-2">
              {[
                { icon: 'https://cdn-icons-png.flaticon.com/512/124/124010.png', label: 'Facebook', url: 'https://facebook.com' },
                { icon: 'https://cdn-icons-png.flaticon.com/512/174/174855.png', label: 'Instagram', url: 'https://instagram.com' },
                { icon: 'tiktok', label: 'TikTok', url: 'https://tiktok.com' },
                { icon: 'https://cdn-icons-png.flaticon.com/512/174/174883.png', label: 'YouTube', url: 'https://youtube.com' }
              ].map((social, idx) => (
                <a 
                  key={idx}
                  href={social.url}
                  target="_blank"
                  rel="noreferrer"
                  className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 hover:text-[#FF5B00] text-white/75 transition-all shadow"
                >
                  {social.icon === 'tiktok' ? (
                    <TikTokIcon size={14} />
                  ) : (
                    <img src={social.icon} alt={social.label} className="w-3.5 h-3.5 object-contain opacity-75 group-hover:opacity-100" />
                  )}
                </a>
              ))}
            </div>
          </div>

          {/* Footer menu columns */}
          <div className="md:col-span-8 grid grid-cols-2 sm:grid-cols-4 gap-6 text-xs font-bold uppercase tracking-wider text-slate-300">
            <div>
              <h5 className="text-[10px] font-black text-white uppercase tracking-widest mb-3.5">DISCOVER</h5>
              <ul className="space-y-2 text-[11px] font-bold text-slate-400">
                <li><button onClick={() => { setActiveCategory('Buying Guides'); toast.success('Guides Loaded'); }} className="hover:text-white transition-colors">Top Guides</button></li>
                <li><button onClick={() => { setActiveCategory('Videos'); toast.success('Videos Loaded'); }} className="hover:text-white transition-colors">Videos</button></li>
                <li><button onClick={() => { setActiveCategory('Creator Reviews'); toast.success('Reviews Loaded'); }} className="hover:text-white transition-colors">Reviews</button></li>
                <li><button onClick={() => { setActiveCategory('Comparisons'); toast.success('Comparisons Loaded'); }} className="hover:text-white transition-colors">Comparisons</button></li>
                <li><button onClick={() => { setActiveCategory('Brand Stories'); toast.success('Brand Stories Loaded'); }} className="hover:text-white transition-colors">Brand Stories</button></li>
                <li><button onClick={() => { setActiveCategory('Deals'); toast.success('Deals Loaded'); }} className="hover:text-white transition-colors">Deals</button></li>
              </ul>
            </div>
            
            <div>
              <h5 className="text-[10px] font-black text-white uppercase tracking-widest mb-3.5">COMPANY</h5>
              <ul className="space-y-2 text-[11px] font-bold text-slate-400">
                <li><button onClick={() => toast.success('About page coming soon!')} className="hover:text-white transition-colors">About Us</button></li>
                <li><button onClick={() => toast.success('Careers list coming soon!')} className="hover:text-white transition-colors">Careers</button></li>
                <li><button onClick={() => toast.success('Partnerships details coming soon!')} className="hover:text-white transition-colors">Partnership</button></li>
                <li><button onClick={() => toast.success('Advertise guidelines coming soon!')} className="hover:text-white transition-colors">Advertise</button></li>
                <li><button onClick={() => toast.success('Press releases coming soon!')} className="hover:text-white transition-colors">Press</button></li>
              </ul>
            </div>

            <div>
              <h5 className="text-[10px] font-black text-white uppercase tracking-widest mb-3.5">SUPPORT</h5>
              <ul className="space-y-2 text-[11px] font-bold text-slate-400">
                <li><button onClick={() => toast.success('Opening Help Center...')} className="hover:text-white transition-colors">Help Center</button></li>
                <li><button onClick={() => toast.success('Returning guidelines...')} className="hover:text-white transition-colors">Returns</button></li>
                <li><button onClick={() => toast.success('Shipping tracker...')} className="hover:text-white transition-colors">Shipping</button></li>
                <li><button onClick={() => toast.success('Contact support...')} className="hover:text-white transition-colors">Contact Us</button></li>
                <li><button onClick={() => toast.success('Tracking order...')} className="hover:text-white transition-colors">Track Order</button></li>
              </ul>
            </div>

            <div>
              <h5 className="text-[10px] font-black text-white uppercase tracking-widest mb-3.5">LEGAL</h5>
              <ul className="space-y-2 text-[11px] font-bold text-slate-400">
                <li><button onClick={() => toast.success('Terms of service...')} className="hover:text-white transition-colors">Terms & Conditions</button></li>
                <li><button onClick={() => toast.success('Privacy policy...')} className="hover:text-white transition-colors">Privacy Policy</button></li>
                <li><button onClick={() => toast.success('Cookie settings...')} className="hover:text-white transition-colors">Cookie Policy</button></li>
                <li><button onClick={() => toast.success('Disclaimers...')} className="hover:text-white transition-colors">Disclaimer</button></li>
              </ul>
            </div>
          </div>

        </div>

        {/* Bottom copyright & region selector bar */}
        <div className="max-w-7xl mx-auto w-full border-t border-white/5 mt-10 pt-6.5 flex flex-col sm:flex-row gap-4 items-center justify-between text-[11px] text-slate-500 font-extrabold uppercase">
          <p>&copy; 2025 Choosify. All rights reserved.</p>
          
          <div className="flex flex-wrap items-center gap-6">
            <span className="text-slate-400">Choose Easy. Compare & Decide <span className="text-[#FF5B00]">Wisely.</span></span>
            
            <button 
              onClick={() => toast.success('Opening regional selector...')}
              className="flex items-center gap-1.5 bg-white/5 border border-white/10 px-3 py-1.5 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            >
              <span className="w-4 h-3 bg-red-600 rounded-sm relative overflow-hidden flex shrink-0">
                <span className="absolute left-0 top-0 bottom-0 right-1/2 bg-green-700" />
                <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-red-600 rounded-full" />
              </span>
              <span>Bangladesh | BDT</span>
              <ChevronDown size={11} className="text-slate-400" />
            </button>
          </div>
        </div>
      </footer>

    </div>
  );
}
