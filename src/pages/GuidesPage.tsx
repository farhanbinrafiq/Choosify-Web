import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, Bookmark, Eye, Play, ArrowRight, Star, CheckCircle2, ChevronRight, ChevronLeft, 
  Smartphone, Laptop, Headphones, Camera, Gamepad, Tv, Shirt, MoreHorizontal,
  PlaySquare, BookOpen, Scale, ListOrdered, Lightbulb, Bot, Check, Sparkles, Users,
  Heart, Calendar, Flame, ShieldCheck, Zap, LayoutGrid, MessageSquare
} from 'lucide-react';
import { toast } from 'react-hot-toast';

// ==========================================
// DATA STRUCTURES
// ==========================================

interface Story {
  id: string;
  type: 'BUYING GUIDE' | 'CREATOR REVIEW' | 'COLLECTION' | 'BRAND STORY';
  title: string;
  image: string;
  readTime: string;
  category: string;
  subCategory: string;
  isVideo?: boolean;
  author: {
    name: string;
    avatar: string;
    badge: string;
  };
}

interface TrendingItem {
  id: string;
  title: string;
  image: string;
  badge: 'TRENDING' | 'NEW LAUNCH' | 'DEAL ALERT';
  readTime: string;
  views: string;
  category: string;
  isVideo?: boolean;
}

interface EditorsPickItem {
  id: string;
  index: number;
  title: string;
  readTime: string;
  views: string;
  image: string;
}

interface Creator {
  id: string;
  name: string;
  avatar: string;
  badge: string;
  guidesCount: number;
  followersCount: string;
}

// ==========================================
// STATIC REALISTIC DATASETS
// ==========================================

const STORIES_DATA: Story[] = [
  {
    id: 'story-1',
    type: 'BUYING GUIDE',
    title: 'Best Running Shoes for 2026',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80',
    readTime: '12 min read',
    category: 'Buying Guides',
    subCategory: 'Expert Guide',
    author: {
      name: 'Tanvir Hossain',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&q=80',
      badge: 'Verified Expert'
    }
  },
  {
    id: 'story-2',
    type: 'CREATOR REVIEW',
    title: '30 Day Review: Samsung S24 Ultra',
    image: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=600&q=80',
    readTime: '18 min video',
    category: 'Videos',
    subCategory: '2 days ago',
    isVideo: true,
    author: {
      name: 'Nusrat Jahan',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&q=80',
      badge: 'Tech Creator'
    }
  },
  {
    id: 'story-3',
    type: 'COLLECTION',
    title: 'Minimal Desk Setup Ideas for 2025',
    image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=600&q=80',
    readTime: '8 items',
    category: 'Collections',
    subCategory: 'Home & Office',
    author: {
      name: 'Productivity Lab',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&q=80',
      badge: 'Official Creator'
    }
  },
  {
    id: 'story-4',
    type: 'BRAND STORY',
    title: "Behind Aarong's Summer Collection",
    image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=600&q=80',
    readTime: '10 min read',
    category: 'Brand Stories',
    subCategory: 'Brand Story',
    author: {
      name: 'Aarong Official',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&q=80',
      badge: 'Verified Brand'
    }
  }
];

const TRENDING_DATA: TrendingItem[] = [
  {
    id: 'trend-1',
    title: 'Best Laptop for Students in 2025',
    image: 'https://images.unsplash.com/photo-1496181130204-755241544e35?w=600&q=80',
    badge: 'TRENDING',
    readTime: '10 min read',
    views: '15.2K',
    category: 'Buying Guides'
  },
  {
    id: 'trend-2',
    title: 'Best Smartwatches Under BDT 10,000',
    image: 'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=600&q=80',
    badge: 'TRENDING',
    readTime: '8 min read',
    views: '12.8K',
    category: 'Buying Guides'
  },
  {
    id: 'trend-3',
    title: 'Top 5 ANC Earbuds Compared',
    image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=600&q=80',
    badge: 'TRENDING',
    readTime: '7 min read',
    views: '9.6K',
    category: 'Deals'
  },
  {
    id: 'trend-4',
    title: 'iPhone 15 vs Samsung S24: Which is Better?',
    image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&q=80',
    badge: 'TRENDING',
    readTime: '12 min read',
    views: '18.4K',
    category: 'Blogs'
  },
  {
    id: 'trend-5',
    title: 'DJI Mini 4 Pro - Full Review',
    image: 'https://images.unsplash.com/photo-1508614589041-895b88991e3e?w=600&q=80',
    badge: 'NEW LAUNCH',
    readTime: '15 min video',
    views: '8.1K',
    category: 'Videos',
    isVideo: true
  }
];

const EDITORS_LIST_DATA: EditorsPickItem[] = [
  {
    id: 'ed-1',
    index: 1,
    title: 'Best 4K TVs for Home Theater in 2025',
    readTime: '9 min read',
    views: '12.6K',
    image: 'https://images.unsplash.com/photo-1593305841991-05c297ba4575?w=200&q=80'
  },
  {
    id: 'ed-2',
    index: 2,
    title: 'Camera Settings Every Beginner Should Know',
    readTime: '7 min read',
    views: '8.9K',
    image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=200&q=80'
  },
  {
    id: 'ed-3',
    index: 3,
    title: 'How to Choose the Right Gaming Monitor',
    readTime: '6 min read',
    views: '7.4K',
    image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=200&q=80'
  }
];

const CREATORS_DATA: Creator[] = [
  {
    id: 'creator-1',
    name: 'Tech World BD',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&q=80',
    badge: 'Verified Expert',
    guidesCount: 128,
    followersCount: '452K'
  },
  {
    id: 'creator-2',
    name: 'Gadget & Gear',
    avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&q=80',
    badge: 'Tech Creator',
    guidesCount: 98,
    followersCount: '312K'
  },
  {
    id: 'creator-3',
    name: 'Style With Me',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&q=80',
    badge: 'Fashion Creator',
    guidesCount: 76,
    followersCount: '245K'
  },
  {
    id: 'creator-4',
    name: 'Productivity Lab',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&q=80',
    badge: 'Lifestyle Creator',
    guidesCount: 64,
    followersCount: '198K'
  }
];

export function GuidesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('All');
  const [selectedSort, setSelectedSort] = useState('Newest');
  const [savedStories, setSavedStories] = useState<string[]>([]);
  const [followedCreators, setFollowedCreators] = useState<string[]>([]);
  const [activeFilters, setActiveFilters] = useState<string[]>([]);

  const navigationTabs = [
    { name: 'All', icon: LayoutGrid },
    { name: 'Buying Guides', icon: BookOpen },
    { name: 'Videos', icon: PlaySquare },
    { name: 'Creator Reviews', icon: Star },
    { name: 'Collections', icon: Flame },
    { name: 'Brand Stories', icon: ShieldCheck },
    { name: 'Campaigns', icon: Zap },
    { name: 'Blogs', icon: Sparkles },
    { name: 'Deals', icon: Heart },
    { name: 'Reels', icon: Smartphone },
    { name: 'Live', icon: Users },
  ];

  const quickFilters = ['Trending', 'Most Viewed', 'Most Helpful', 'Expert Picks', 'Official', 'Verified'];

  const handleTrendingSearchClick = (term: string) => {
    setSearchQuery(term);
    toast.success(`Searching for "${term}"`, { icon: '🔍' });
  };

  const toggleSaveStory = (storyId: string) => {
    setSavedStories(prev => {
      const isSaved = prev.includes(storyId);
      if (isSaved) {
        toast.success('Removed from saved stories');
        return prev.filter(id => id !== storyId);
      } else {
        toast.success('Saved to your dashboard!');
        return [...prev, storyId];
      }
    });
  };

  const toggleFollowCreator = (creatorId: string, name: string) => {
    setFollowedCreators(prev => {
      const isFollowing = prev.includes(creatorId);
      if (isFollowing) {
        toast.success(`Unfollowed ${name}`);
        return prev.filter(id => id !== creatorId);
      } else {
        toast.success(`Now following ${name}!`, { icon: '🙌' });
        return [...prev, creatorId];
      }
    });
  };

  const handleToggleFilter = (filter: string) => {
    setActiveFilters(prev => {
      const exists = prev.includes(filter);
      if (exists) {
        return prev.filter(f => f !== filter);
      } else {
        return [...prev, filter];
      }
    });
  };

  // Filtered Featured stories
  const filteredStories = useMemo(() => {
    let result = [...STORIES_DATA];
    if (activeTab !== 'All') {
      result = result.filter(story => story.category === activeTab);
    }
    if (searchQuery.trim() !== '') {
      const query = searchQuery.toLowerCase().trim();
      result = result.filter(story => 
        story.title.toLowerCase().includes(query) ||
        story.type.toLowerCase().includes(query) ||
        story.author.name.toLowerCase().includes(query)
      );
    }
    return result;
  }, [activeTab, searchQuery]);

  return (
    <div className="flex flex-col min-h-screen bg-[#F8F9FC] text-gray-800 pb-16 font-sans">
      
      {/* Top Breadcrumb Navigation */}
      <div className="w-full max-w-7xl mx-auto px-6 md:px-10 py-4 text-left">
        <nav className="text-xs font-semibold text-gray-400 flex items-center gap-1.5 uppercase tracking-wider">
          <Link to="/" className="hover:text-[#FF5B00] transition-colors">Home</Link>
          <span className="text-gray-300 font-bold">&gt;</span>
          <span className="text-[#FF5B00] font-bold">Discover</span>
        </nav>
      </div>

      {/* 1. HERO SECTION */}
      <section className="max-w-7xl mx-auto w-full px-6 md:px-10 mb-8">
        <div className="bg-gradient-to-br from-[#050616] via-[#0A0C24] to-[#121538] rounded-3xl p-8 md:p-12 relative overflow-hidden flex flex-col lg:flex-row items-center justify-between gap-10 border border-slate-800 shadow-xl min-h-[440px]">
          
          {/* Glowing Ambient Light Effects */}
          <div className="absolute top-0 left-1/4 w-[450px] h-[450px] bg-[#FF5B00]/8 rounded-full blur-[120px] pointer-events-none" />
          <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none" />

          {/* Left Text Block */}
          <div className="max-w-xl text-left relative z-10 flex-1">
            <span className="text-xs font-black tracking-widest text-[#FF5B00] uppercase block mb-3">
              DISCOVER.
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-[54px] font-black tracking-tight text-white leading-tight uppercase font-sans">
              Smarter Choices,<br />
              Better <span className="text-[#FF5B00]">Decisions.</span>
            </h1>
            <p className="text-sm text-slate-300 font-medium mt-4 leading-relaxed max-w-lg">
              Explore expert guides, creator reviews, videos, collections, brand stories and real experiences.
            </p>

            {/* INTEGRATED SEARCH BAR */}
            <div className="relative w-full max-w-lg mt-8">
              <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none z-20">
                <Search className="w-4 h-4 text-slate-400" />
              </div>
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search Discover..." 
                className="w-full h-13 pl-11 pr-28 bg-white/10 backdrop-blur-md border border-white/15 focus:border-[#FF5B00]/50 rounded-2xl text-xs font-bold text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-[#FF5B00]/40 transition-all shadow-lg"
              />
              <button 
                onClick={() => toast.success(`Searching for "${searchQuery}"`)}
                className="absolute right-1.5 top-1.5 bottom-1.5 px-6 bg-[#FF5B00] hover:bg-orange-600 active:scale-95 text-white text-[11px] font-black uppercase tracking-widest rounded-xl flex items-center justify-center transition-all shadow-md cursor-pointer border-none"
              >
                Search
              </button>
            </div>

            {/* Trending Searches Row */}
            <div className="flex flex-wrap items-center gap-2 mt-5 text-[11px] font-bold text-slate-400">
              <span className="font-semibold uppercase tracking-wider text-slate-500">Trending searches:</span>
              {['iPhone 15 Pro Max', 'Best Laptops 2025', 'Running Shoes', 'Smartwatches', 'Air Fryer'].map((term) => (
                <button
                  key={term}
                  onClick={() => handleTrendingSearchClick(term)}
                  className="hover:text-white transition-colors cursor-pointer text-slate-400 font-bold border-none bg-transparent p-0"
                >
                  {term},
                </button>
              ))}
            </div>
          </div>

          {/* Right Product Image Collage */}
          <div className="relative w-full max-w-[500px] h-[320px] hidden lg:block shrink-0">
            {/* Background Laptop screen */}
            <div className="absolute top-4 right-10 w-[360px] h-[240px] rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
              <img 
                src="https://images.unsplash.com/photo-1496181130204-755241544e35?w=500&q=80" 
                className="w-full h-full object-cover grayscale opacity-30"
                alt="Laptop Backdrop"
              />
            </div>

            {/* Canon Camera overlay */}
            <div className="absolute top-2 right-0 w-[170px] h-[130px] rounded-xl overflow-hidden border border-white/15 shadow-xl transform rotate-3 bg-[#0A0B22]">
              <img 
                src="https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=300&q=80" 
                className="w-full h-full object-cover"
                alt="Canon Camera"
              />
            </div>

            {/* Headphones overlay */}
            <div className="absolute -bottom-2 right-[180px] w-[170px] h-[140px] rounded-xl overflow-hidden border border-white/15 shadow-2xl transform -rotate-6 bg-[#0A0B22]">
              <img 
                src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&q=80" 
                className="w-full h-full object-cover"
                alt="Headphones"
              />
            </div>

            {/* Red running shoe overlay */}
            <div className="absolute bottom-6 left-2 w-[150px] h-[110px] rounded-xl overflow-hidden border border-white/15 shadow-xl transform rotate-12 bg-[#0A0B22]">
              <img 
                src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300&q=80" 
                className="w-full h-full object-cover"
                alt="Red shoe"
              />
            </div>

            {/* EDITOR'S PICK INTERACTIVE BANNER */}
            <div className="absolute bottom-4 right-2 bg-[#08081A]/95 border border-white/15 rounded-2xl p-4 shadow-2xl text-left w-[240px] backdrop-blur-md">
              <div className="flex items-center justify-between">
                <span className="text-[9px] font-black tracking-widest text-[#FF5B00] uppercase bg-[#FF5B00]/10 px-2 py-0.5 rounded">
                  Editor's Pick
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#FF5B00] animate-pulse" />
              </div>
              <h4 className="text-xs font-black text-white mt-2 leading-snug">
                Best Tech of Summer 2025
              </h4>
              <p className="text-[10px] text-slate-400 mt-1">
                12 min read
              </p>
              <div className="flex items-center justify-end mt-2">
                <div 
                  onClick={() => handleTrendingSearchClick('Best Tech of Summer 2025')}
                  className="w-7 h-7 rounded-full bg-[#FF5B00]/10 text-[#FF5B00] hover:bg-[#FF5B00] hover:text-white flex items-center justify-center transition-colors cursor-pointer"
                >
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* 2. PRIMARY HORIZONTAL NAVIGATION BAR */}
      <section className="max-w-7xl mx-auto w-full px-6 md:px-10 mb-6">
        <div className="bg-white border border-slate-200/80 rounded-2xl p-2 shadow-sm overflow-x-auto no-scrollbar">
          <div className="flex items-center gap-1 min-w-max">
            {navigationTabs.map((tab) => {
              const TabIcon = tab.icon;
              const isActive = activeTab === tab.name;
              return (
                <button
                  key={tab.name}
                  onClick={() => {
                    setActiveTab(tab.name);
                    toast.success(`Category set to: ${tab.name}`);
                  }}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-xl transition-all font-sans text-xs font-bold uppercase tracking-wide cursor-pointer border-none outline-none select-none shrink-0 ${
                    isActive 
                      ? 'bg-[#FF5B00]/10 text-[#FF5B00] border-b-2 border-[#FF5B00] rounded-b-none' 
                      : 'text-slate-500 hover:text-[#FF5B00] hover:bg-slate-50'
                  }`}
                >
                  <TabIcon className="w-3.5 h-3.5" />
                  <span>{tab.name}</span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* 3. SUB-FILTERS ROW */}
      <section className="max-w-7xl mx-auto w-full px-6 md:px-10 mb-8">
        <div className="flex flex-col lg:flex-row gap-4 items-center justify-between w-full">
          
          <div className="flex flex-wrap items-center gap-2.5 w-full lg:w-auto">
            <button 
              onClick={() => toast.success('Filters drawers settings triggered')}
              className="h-10 px-5 bg-white border border-slate-200 hover:bg-slate-50 rounded-xl text-xs font-bold text-slate-700 flex items-center gap-2 shadow-sm cursor-pointer border-none outline-none"
            >
              <MoreHorizontal className="w-4 h-4 text-slate-400" />
              <span>FILTERS</span>
            </button>

            <select 
              value={selectedSort}
              onChange={(e) => {
                setSelectedSort(e.target.value);
                toast.success(`Sorting by: ${e.target.value}`);
              }}
              className="h-10 px-4 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-600 shadow-sm outline-none focus:border-[#FF5B00]/40"
            >
              <option value="Newest">Newest</option>
              <option value="Most Viewed">Most Viewed</option>
              <option value="Highest Rating">Highest Rating</option>
            </select>

            {quickFilters.map((filterName) => {
              const isSelected = activeFilters.includes(filterName);
              return (
                <button
                  key={filterName}
                  onClick={() => handleToggleFilter(filterName)}
                  className={`h-10 px-4 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all border shadow-sm cursor-pointer ${
                    isSelected 
                      ? 'bg-[#FF5B00]/10 border-[#FF5B00]/30 text-[#FF5B00]' 
                      : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {isSelected && <Check className="w-3 h-3 text-[#FF5B00]" />}
                  {filterName}
                </button>
              );
            })}
          </div>

          <button 
            onClick={() => {
              setSearchQuery('Smartphones under 30k with best battery');
              toast.success('AI Engine scanning best matching products for you!', { icon: '🔮' });
            }}
            className="h-10 px-5 bg-white border border-pink-200 hover:border-pink-300 rounded-xl text-xs font-bold text-pink-600 flex items-center gap-2 shadow-sm cursor-pointer transition-all hover:bg-pink-50/50 outline-none w-full lg:w-auto justify-center"
          >
            <Bot className="w-4 h-4 text-pink-500" />
            <span>AI DISCOVER</span>
            <Sparkles className="w-3.5 h-3.5 text-pink-500 animate-pulse" />
          </button>

        </div>
      </section>

      {/* 4. FEATURED DISCOVER STORIES */}
      <section className="max-w-7xl mx-auto w-full px-6 md:px-10 mb-12 text-left">
        <div className="flex items-center justify-between mb-6 border-b border-slate-200/60 pb-3">
          <div>
            <span className="text-[10px] font-bold text-[#FF5B00] uppercase tracking-widest leading-none">FEATURED</span>
            <h3 className="text-xl md:text-2xl font-extrabold text-slate-900 mt-1 uppercase tracking-tight">
              Featured Discover Stories
            </h3>
          </div>
          <Link 
            to="/guides" 
            className="text-xs font-bold text-[#FF5B00] hover:text-orange-600 transition-colors uppercase tracking-wider flex items-center gap-1 group"
          >
            View all featured 
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
          <AnimatePresence mode="popLayout">
            {filteredStories.map((story) => {
              const isSaved = savedStories.includes(story.id);
              const badgeColors: Record<string, string> = {
                'BUYING GUIDE': 'bg-[#FF5B00] text-white',
                'CREATOR REVIEW': 'bg-purple-600 text-white',
                'COLLECTION': 'bg-blue-600 text-white',
                'BRAND STORY': 'bg-amber-700 text-white'
              };

              return (
                <motion.div
                  key={story.id}
                  layout
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 15 }}
                  className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col overflow-hidden group h-[380px]"
                >
                  {/* Card Image Area with overlays */}
                  <div className="relative flex-1 overflow-hidden shrink-0 bg-slate-900">
                    <img 
                      src={story.image} 
                      alt={story.title} 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-85"
                      referrerPolicy="no-referrer"
                    />
                    
                    {/* Dark gradient overlay at bottom of image for readability */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />

                    {/* Category Label badge at top left */}
                    <div className="absolute top-4 left-4 z-10">
                      <span className={`${badgeColors[story.type] || 'bg-black text-white'} text-[9px] font-black tracking-widest px-3 py-1 rounded uppercase`}>
                        {story.type}
                      </span>
                    </div>

                    {/* Video play icon overlay */}
                    {story.isVideo && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/10">
                        <div className="w-12 h-12 rounded-full bg-red-600 flex items-center justify-center border border-white/20 shadow-md">
                          <Play className="text-white fill-white ml-0.5 w-5 h-5" />
                        </div>
                      </div>
                    )}

                    {/* Title and readtime overlaid at bottom of image */}
                    <div className="absolute bottom-4 left-4 right-4 text-left z-10">
                      <h4 className="font-sans text-[16px] font-black text-white tracking-tight leading-snug group-hover:text-[#FF5B00] transition-colors line-clamp-2">
                        {story.title}
                      </h4>
                      <p className="text-[10px] text-slate-300 font-bold uppercase tracking-wider mt-1.5">
                        {story.readTime} &bull; {story.subCategory}
                      </p>
                    </div>
                  </div>

                  {/* Card Footer with Author info */}
                  <div className="p-4 bg-white flex items-center justify-between border-t border-slate-100 shrink-0">
                    <div className="flex items-center gap-2.5 text-left">
                      <div className="w-8 h-8 rounded-full overflow-hidden border border-slate-200 shrink-0">
                        <img src={story.author.avatar} alt={story.author.name} className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <div className="text-[11px] font-bold text-slate-900 flex items-center gap-1 leading-none">
                          {story.author.name}
                          <CheckCircle2 className="w-3 h-3 text-[#FF5B00] fill-current" />
                        </div>
                        <div className="text-[9px] font-semibold text-slate-400 mt-0.5 uppercase tracking-wide leading-none">
                          {story.author.badge}
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => toggleSaveStory(story.id)}
                      className={`w-8 h-8 rounded-full flex items-center justify-center border transition-all ${
                        isSaved 
                          ? 'border-[#FF5B00]/40 text-[#FF5B00] bg-[#FF5B00]/5' 
                          : 'border-slate-200 text-slate-400 hover:text-[#FF5B00] hover:border-[#FF5B00]/20'
                      } cursor-pointer`}
                    >
                      <Bookmark className={`w-3.5 h-3.5 ${isSaved ? 'fill-current' : ''}`} />
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </section>

      {/* 5. TRENDING NOW & BROWSE BY FORMAT SECTION (TWO-COLUMN SPLIT) */}
      <section className="max-w-7xl mx-auto w-full px-6 md:px-10 mb-12 text-left">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Column A (Col Span 9): TRENDING NOW */}
          <div className="lg:col-span-9">
            <div className="flex items-center justify-between mb-6 border-b border-slate-200/60 pb-3">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">TRENDING NOW</span>
                <h3 className="text-xl font-extrabold text-slate-900 mt-1 uppercase tracking-tight">
                  What's hot on Choosify right now
                </h3>
              </div>
              <Link 
                to="/guides" 
                className="text-xs font-bold text-[#FF5B00] hover:text-orange-600 transition-colors uppercase tracking-wider flex items-center gap-1 group"
              >
                View all 
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>

            {/* 5 columns grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4">
              {TRENDING_DATA.map((item) => (
                <div 
                  key={item.id}
                  onClick={() => handleTrendingSearchClick(item.title)}
                  className="bg-white border border-slate-200/80 rounded-2xl overflow-hidden shadow-xs hover:shadow-md transition-all duration-300 flex flex-col justify-between h-[270px] group cursor-pointer"
                >
                  <div className="relative h-[110px] bg-slate-100 overflow-hidden shrink-0">
                    <img 
                      src={item.image} 
                      alt={item.title} 
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute top-2 left-2 z-10">
                      <span className={`bg-[#FF5B00] text-white text-[8px] font-black tracking-wider px-2 py-0.5 rounded uppercase`}>
                        {item.badge}
                      </span>
                    </div>
                  </div>

                  <div className="p-3 flex-1 flex flex-col justify-between">
                    <h4 className="text-[12px] font-bold text-slate-800 leading-snug group-hover:text-[#FF5B00] transition-colors line-clamp-3">
                      {item.title}
                    </h4>
                    
                    <div className="flex items-center justify-between text-[10px] font-bold text-slate-400 uppercase border-t border-slate-100 pt-2.5 mt-2">
                      <span>{item.readTime}</span>
                      <span className="flex items-center gap-1">
                        <Eye className="w-3.5 h-3.5 text-slate-400" />
                        {item.views}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Column B (Col Span 3): BROWSE BY FORMAT */}
          <div className="lg:col-span-3">
            <div className="flex items-center justify-between mb-6 border-b border-slate-200/60 pb-3">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">FORMATS</span>
                <h3 className="text-xl font-extrabold text-slate-900 mt-1 uppercase tracking-tight">
                  Browse by Format
                </h3>
              </div>
            </div>

            <div className="space-y-3">
              {[
                { name: 'Videos', desc: 'Watch expert videos', color: 'bg-rose-50 text-rose-500 border-rose-100', icon: PlaySquare },
                { name: 'Buying Guides', desc: 'In-depth buying help', color: 'bg-blue-50 text-blue-500 border-blue-100', icon: BookOpen },
                { name: 'Reviews', desc: 'Honest product reviews', color: 'bg-amber-50 text-amber-500 border-amber-100', icon: Star },
                { name: 'Comparisons', desc: 'Compare products', color: 'bg-purple-50 text-purple-500 border-purple-100', icon: Scale },
                { name: 'Lists & Rankings', desc: 'Top picks & rankings', color: 'bg-indigo-50 text-indigo-500 border-indigo-100', icon: ListOrdered },
                { name: 'How-To & Tips', desc: 'Learn & improve', color: 'bg-teal-50 text-teal-500 border-teal-100', icon: Lightbulb }
              ].map((format, idx) => {
                const FormatIcon = format.icon;
                return (
                  <div
                    key={idx}
                    onClick={() => {
                      setSearchQuery(format.name === 'Reviews' ? 'Review' : format.name);
                      toast.success(`Format selected: ${format.name}`);
                    }}
                    className="flex items-center gap-3 p-3 bg-white border border-slate-200/85 hover:border-[#FF5B00]/30 hover:bg-[#FF5B00]/2 rounded-xl shadow-xs transition-all duration-200 cursor-pointer group text-left"
                  >
                    <div className={`w-9 h-9 rounded-full ${format.color} flex items-center justify-center border shrink-0`}>
                      <FormatIcon className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-black text-slate-800 tracking-tight group-hover:text-[#FF5B00] transition-colors leading-none">
                        {format.name}
                      </h4>
                      <p className="text-[10px] text-slate-400 font-semibold mt-1">
                        {format.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      </section>

      {/* 6. GUIDES BY PRODUCT TYPE */}
      <section className="max-w-7xl mx-auto w-full px-6 md:px-10 mb-12 text-left">
        <div className="flex items-center justify-between mb-6 border-b border-slate-200/60 pb-3">
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">PRODUCT TYPE</span>
            <h3 className="text-xl md:text-2xl font-extrabold text-slate-900 mt-1 uppercase tracking-tight">
              Guides by Product Type
            </h3>
            <p className="text-xs text-slate-400 mt-1">Explore our comprehensive buying guides</p>
          </div>
          <Link 
            to="/categories" 
            className="text-xs font-bold text-[#FF5B00] hover:text-orange-600 transition-colors uppercase tracking-wider flex items-center gap-1 group"
          >
            View all categories 
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
          {[
            {
              title: 'Smartphones',
              bullets: [
                'Best Phones Under 20,000',
                'Flagship Phones Comparison',
                'Camera Phones Guide',
                'Battery Life Comparison'
              ],
              count: 128,
              image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=300&q=80'
            },
            {
              title: 'Laptops',
              bullets: [
                'Best Laptops for Students',
                'Gaming Laptops Guide',
                'MacBooks vs Windows',
                'Budget Laptops'
              ],
              count: 96,
              image: 'https://images.unsplash.com/photo-1496181130204-755241544e35?w=300&q=80'
            },
            {
              title: 'Audio',
              bullets: [
                'Headphones Buying Guide',
                'Wireless Earbuds Guide',
                'Speakers Comparison',
                'Soundbars Guide'
              ],
              count: 76,
              image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&q=80'
            },
            {
              title: 'Cameras',
              bullets: [
                'DSLR vs Mirrorless',
                'Best Cameras for Beginners',
                'Videography Cameras',
                'Lens Buying Guide'
              ],
              count: 55,
              image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=300&q=80'
            },
            {
              title: 'Gaming',
              bullets: [
                'Gaming PC Build Guide',
                'Gaming Accessories',
                'Monitor Buying Guide',
                'Console Comparison'
              ],
              count: 32,
              image: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=300&q=80'
            },
            {
              title: 'Home Appliances',
              bullets: [
                'Refrigerator Guide',
                'Washing Machine Guide',
                'Air Conditioner Guide',
                'Kitchen Appliances'
              ],
              count: 60,
              image: 'https://images.unsplash.com/photo-1571175432247-52382a4ac931?w=300&q=80'
            }
          ].map((cat, idx) => (
            <div 
              key={idx}
              className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs hover:shadow-md transition-all duration-300 flex justify-between gap-4 h-[200px]"
            >
              <div className="flex-1 flex flex-col justify-between text-left">
                <div>
                  <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest leading-none mb-3">
                    {cat.title}
                  </h4>
                  <ul className="space-y-1 text-[11px] font-semibold text-slate-600 list-disc list-inside">
                    {cat.bullets.map((b, bidx) => (
                      <li key={bidx} className="line-clamp-1 hover:text-[#FF5B00] cursor-pointer" onClick={() => handleTrendingSearchClick(b)}>
                        {b}
                      </li>
                    ))}
                  </ul>
                </div>

                <div 
                  onClick={() => handleTrendingSearchClick(cat.title)}
                  className="text-[10px] font-extrabold text-[#FF5B00] hover:underline uppercase tracking-wider cursor-pointer flex items-center gap-1 shrink-0 mt-3"
                >
                  <span>VIEW ALL ({cat.count})</span>
                  <ArrowRight size={10} />
                </div>
              </div>

              <div className="w-24 h-full bg-slate-50 rounded-xl overflow-hidden flex items-center justify-center p-1.5 shrink-0">
                <img 
                  src={cat.image} 
                  alt={cat.title} 
                  className="max-h-full max-w-full object-contain rounded-lg shadow-sm"
                  referrerPolicy="no-referrer"
                />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 7. EXPERT'S PICKS & TOP CREATORS (SPLIT COLUMNS) */}
      <section className="max-w-7xl mx-auto w-full px-6 md:px-10 mb-12 text-left">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          
          {/* Column A: Expert's Picks */}
          <div>
            <div className="flex items-center justify-between mb-6 border-b border-slate-200/60 pb-3">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">EXPERT HANDPICKED</span>
                <h3 className="text-xl font-extrabold text-slate-900 mt-1 uppercase tracking-tight">
                  Expert's Picks
                </h3>
              </div>
              <Link 
                to="/guides" 
                className="text-xs font-bold text-[#FF5B00] hover:text-orange-600 transition-colors uppercase tracking-wider flex items-center gap-1 group"
              >
                View all 
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-stretch h-auto md:h-[290px]">
              
              {/* Left Side: Vertical list of 3 items */}
              <div className="md:col-span-7 flex flex-col justify-between gap-3 h-full">
                {EDITORS_LIST_DATA.map((item) => (
                  <div 
                    key={item.id}
                    onClick={() => handleTrendingSearchClick(item.title)}
                    className="flex items-center gap-3 p-3 bg-white border border-slate-200/80 rounded-xl hover:border-slate-300 transition-colors cursor-pointer"
                  >
                    <div className="w-6 h-6 rounded-full bg-[#FF5B00]/10 text-[#FF5B00] text-xs font-black flex items-center justify-center shrink-0">
                      {item.index}
                    </div>
                    
                    <div className="w-12 h-12 rounded-lg bg-slate-50 border border-slate-200 overflow-hidden shrink-0">
                      <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                    </div>

                    <div className="min-w-0">
                      <h4 className="text-[11.5px] font-bold text-slate-800 line-clamp-2 leading-tight">
                        {item.title}
                      </h4>
                      <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider mt-1.5 flex items-center gap-2">
                        <span>{item.readTime}</span>
                        <span>&bull;</span>
                        <span className="flex items-center gap-0.5">
                          <Eye size={10} />
                          {item.views}
                        </span>
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Right Side: Big Highlight Card */}
              <div className="md:col-span-5 h-full">
                <div 
                  onClick={() => handleTrendingSearchClick('Best Noise Cancelling Headphones in 2025')}
                  className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between h-full group relative cursor-pointer"
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/60 to-transparent z-10" />
                  <img 
                    src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80" 
                    alt="Noise Cancelling Headphones"
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-60"
                  />

                  {/* Top tag */}
                  <div className="p-4 relative z-20 text-left">
                    <span className="bg-[#FF5B00] text-white text-[8px] font-black tracking-widest px-2.5 py-0.5 rounded uppercase">
                      EDITOR'S PICK
                    </span>
                  </div>

                  {/* Bottom title & author */}
                  <div className="p-4 relative z-20 text-left">
                    <h4 className="text-xs font-black text-white leading-snug group-hover:text-[#FF5B00] transition-colors">
                      Best Noise Cancelling Headphones in 2025
                    </h4>
                    <p className="text-[9px] text-slate-300 font-bold uppercase tracking-wider mt-1">
                      10 min read
                    </p>

                    <div className="flex items-center gap-2 pt-2.5 border-t border-white/10 mt-2.5">
                      <div className="w-6 h-6 rounded-full overflow-hidden bg-white/20 shrink-0">
                        <img src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&q=80" alt="Headphone Zone" className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <div className="text-[10px] font-bold text-white leading-none">
                          Headphone Zone
                        </div>
                        <div className="text-[8px] font-semibold text-slate-400 mt-0.5 uppercase tracking-wider leading-none">
                          Official Review
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* Column B: Top Creators */}
          <div>
            <div className="flex items-center justify-between mb-6 border-b border-slate-200/60 pb-3">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">DISCOVER VOICES</span>
                <h3 className="text-xl font-extrabold text-slate-900 mt-1 uppercase tracking-tight">
                  Top Creators
                </h3>
              </div>
              <Link 
                to="/creators" 
                className="text-xs font-bold text-[#FF5B00] hover:text-orange-600 transition-colors uppercase tracking-wider flex items-center gap-1 group"
              >
                View all creators 
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>

            <div className="flex flex-col gap-3 h-auto md:h-[290px] justify-between">
              {CREATORS_DATA.map((creator) => {
                const isFollowing = followedCreators.includes(creator.id);
                return (
                  <div 
                    key={creator.id}
                    className="flex items-center justify-between bg-white p-3 border border-slate-200/80 rounded-xl hover:border-slate-300 transition-colors"
                  >
                    <div className="flex items-center gap-3 text-left">
                      <div className="w-10 h-10 rounded-full overflow-hidden border border-[#FF5B00]/10 shrink-0 bg-slate-50">
                        <img src={creator.avatar} alt={creator.name} className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <div className="flex items-center gap-1">
                          <h4 className="text-xs font-extrabold text-slate-900 tracking-tight leading-none">
                            {creator.name}
                          </h4>
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#FF5B00] fill-current" />
                        </div>
                        <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">
                          {creator.badge}
                        </p>
                        <p className="text-[9px] font-semibold text-slate-500 mt-1 leading-none">
                          {creator.guidesCount} Guides &bull; {creator.followersCount} Followers
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => toggleFollowCreator(creator.id, creator.name)}
                      className={`h-8 px-4 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer border-none ${
                        isFollowing 
                          ? 'bg-slate-100 text-slate-500 hover:bg-slate-200' 
                          : 'bg-white text-slate-800 border border-slate-300 hover:border-[#FF5B00] hover:text-[#FF5B00]'
                      }`}
                    >
                      {isFollowing ? 'Following' : 'Follow'}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      </section>

      {/* 8. FROM OUR COMMUNITY (SPLIT RATING SYSTEM BLOCK) */}
      <section className="max-w-7xl mx-auto w-full px-6 md:px-10 mb-12 text-left">
        <div className="flex flex-col items-start mb-6 border-b border-slate-200/60 pb-3">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">USER REVIEWS</span>
          <h3 className="text-xl md:text-2xl font-extrabold text-slate-900 mt-1 uppercase tracking-tight">
            From Our Community
          </h3>
          <p className="text-xs text-slate-400 mt-1">Real experiences from verified users</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Left Blockquote Column: Tanvir's feedback */}
          <div className="lg:col-span-4 bg-white border border-slate-200 rounded-2xl p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 rounded-full overflow-hidden bg-slate-50 shrink-0">
                    <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&q=80" alt="Tanvir" className="w-full h-full object-cover" />
                  </div>
                  <div className="text-left">
                    <p className="text-xs font-black text-slate-900 leading-none">Tanvir Hossain</p>
                    <p className="text-[9px] text-[#FF5B00] font-bold uppercase tracking-wider mt-0.5">Verified Expert</p>
                  </div>
                </div>
                <div className="flex items-center gap-0.5">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star key={s} size={11} className="text-amber-400 fill-current" />
                  ))}
                </div>
              </div>
              <p className="text-xs font-semibold text-slate-600 italic leading-relaxed">
                "I have been using Samsung products for years and they never disappoint. Excellent build quality and amazing performance on the Samsung Galaxy S24 Ultra."
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-[10px] font-bold">
              <span className="text-[#FF5B00] uppercase tracking-wide">Samsung Galaxy S24 Ultra &bull; 2 days ago</span>
              <button onClick={() => toast.success('Voted helpful!')} className="text-slate-400 hover:text-[#FF5B00] flex items-center gap-1 cursor-pointer bg-transparent border-none">
                <MessageSquare size={11} />
                <span>HELPFUL (124)</span>
              </button>
            </div>
          </div>

          {/* Center Rating Summary Breakdown column */}
          <div className="lg:col-span-4 bg-white border border-slate-200 rounded-2xl p-6 flex flex-col items-center justify-center text-center">
            <span className="text-4xl md:text-5xl font-black text-slate-900 leading-none">4.8</span>
            <div className="flex items-center gap-1 mt-2 mb-1">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star key={s} size={16} className="text-amber-400 fill-current" />
              ))}
            </div>
            <span className="text-[11px] text-slate-400 font-extrabold uppercase tracking-wider">(12.4K Reviews)</span>
            
            <div className="w-full space-y-2 mt-6">
              {[
                { star: 5, pct: 75, val: '9.6K' },
                { star: 4, pct: 16, val: '2.1K' },
                { star: 3, pct: 4, val: '524' },
                { star: 2, pct: 1, val: '123' },
                { star: 1, pct: 1, val: '58' }
              ].map((row) => (
                <div key={row.star} className="flex items-center gap-2 w-full text-[10px] font-bold text-slate-600">
                  <span className="w-3 text-right">{row.star}★</span>
                  <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-[#FF5B00] rounded-full" 
                      style={{ width: `${row.pct}%` }}
                    />
                  </div>
                  <span className="w-10 text-right text-slate-400">{row.val}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right Blockquote Column: Nusrat's feedback */}
          <div className="lg:col-span-4 bg-white border border-slate-200 rounded-2xl p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 rounded-full overflow-hidden bg-slate-50 shrink-0">
                    <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&q=80" alt="Nusrat" className="w-full h-full object-cover" />
                  </div>
                  <div className="text-left">
                    <p className="text-xs font-black text-slate-900 leading-none">Nusrat Jahan</p>
                    <p className="text-[9px] text-[#FF5B00] font-bold uppercase tracking-wider mt-0.5">Verified Buyer</p>
                  </div>
                </div>
                <div className="flex items-center gap-0.5">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star key={s} size={11} className="text-amber-400 fill-current" />
                  ))}
                </div>
              </div>
              <p className="text-xs font-semibold text-slate-600 italic leading-relaxed">
                "The Bespoke refrigerator is perfect for our home. Stylish design and super efficient cooling. I highly recommend it."
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-[10px] font-bold">
              <span className="text-[#FF5B00] uppercase tracking-wide">Samsung Bespoke 4-Door &bull; 6 days ago</span>
              <button onClick={() => toast.success('Voted helpful!')} className="text-slate-400 hover:text-[#FF5B00] flex items-center gap-1 cursor-pointer bg-transparent border-none">
                <MessageSquare size={11} />
                <span>HELPFUL (60)</span>
              </button>
            </div>
          </div>

        </div>
      </section>

      {/* 9. TRUST BADGES ROW */}
      <section className="max-w-7xl mx-auto w-full px-6 md:px-10 mb-10 select-none">
        <div className="grid grid-cols-1 sm:grid-cols-5 gap-4 w-full">
          {[
            { title: 'Expert & Verified', desc: 'Content by experts and verified creators.', icon: CheckCircle2 },
            { title: '100% Independent', desc: 'Unbiased guides you can trust.', icon: ShieldCheck },
            { title: 'Regularly Updated', desc: 'Latest trends and recommendations.', icon: Calendar },
            { title: 'Real Experiences', desc: 'From real users and customers.', icon: Sparkles },
            { title: 'Smart & Helpful', desc: 'AI powered discovery just for you.', icon: Bot }
          ].map((item, idx) => {
            const IconComponent = item.icon;
            return (
              <div 
                key={idx}
                className="bg-white border border-slate-200/70 rounded-2xl p-4 flex flex-col items-center text-center hover:shadow-md transition-shadow duration-200"
              >
                <div className="w-9 h-9 rounded-full bg-[#FF5B00]/10 text-[#FF5B00] flex items-center justify-center shrink-0">
                  <IconComponent size={18} />
                </div>
                <h4 className="text-[11.5px] font-black text-slate-800 mt-3 tracking-tight leading-none uppercase">
                  {item.title}
                </h4>
                <p className="text-[10px] text-slate-400 font-semibold mt-1.5 leading-snug">
                  {item.desc}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* 10. CHOOSIFY.BD TRUST STATEMENT FOOTER CALLOUT */}
      <section className="max-w-7xl mx-auto w-full px-6 md:px-10">
        <div className="bg-[#050616] border border-slate-800 rounded-3xl p-8 text-center relative overflow-hidden shadow-lg flex flex-col items-center justify-center min-h-[160px]">
          <div className="absolute top-0 right-0 w-[150px] h-[150px] bg-[#FF5B00]/5 rounded-full blur-[50px] pointer-events-none" />
          
          <span className="text-[10px] font-black tracking-[0.25em] text-[#FF5B00] uppercase mb-2 block">
            CHOOSIFY.BD TRUST STATEMENT
          </span>
          <p className="text-xs md:text-sm text-slate-300 font-semibold max-w-2xl leading-relaxed italic">
            "Only verified sellers and completely unbiased, authentic brand experiences are list on Choosify."
          </p>
          
          <div className="w-12 h-1 bg-[#FF5B00]/40 rounded-full mt-4" />
        </div>
      </section>

    </div>
  );
}
