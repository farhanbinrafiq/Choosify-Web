import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, Bookmark, Eye, Play, ArrowRight, Star, CheckCircle2, ChevronRight, ChevronLeft, 
  Smartphone, Laptop, Headphones, Camera, Gamepad, Tv, Shirt, MoreHorizontal,
  PlaySquare, BookOpen, Scale, ListOrdered, Lightbulb, Bot, Check, HelpCircle, Sparkles, User, Users,
  Heart, Calendar, Flame, ShieldCheck, Zap, LayoutGrid
} from 'lucide-react';
import { toast } from 'react-hot-toast';

// 1. Data Structures matching the high-fidelity reference image

interface Story {
  id: string;
  type: string; // 'BUYING GUIDE' | 'CREATOR REVIEW' | 'COLLECTION' | 'BRAND STORY'
  title: string;
  image: string;
  readTime: string;
  category: string; // "Buying Guides" | "Videos" | "Creator Reviews" | "Collections" | "Brand Stories" | "Blogs" | "Deals" | "Reels"
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
  category: string; // "Buying Guides" | "Videos" | "Creator Reviews" | "Collections" | "Brand Stories" | "Blogs" | "Deals" | "Reels"
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
  isFollowing?: boolean;
}

// 2. High Quality Realistic Datasets
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
  },
  {
    id: 'trend-6',
    title: 'Best Air Fryer Deals Right Now',
    image: 'https://images.unsplash.com/photo-1621972750749-0fbb1abb7736?w=600&q=80',
    badge: 'DEAL ALERT',
    readTime: '5 min read',
    views: '6.3K',
    category: 'Deals'
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
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [activeFilters, setActiveFilters] = useState<string[]>([]);

  // Category tags inside standard navigation
  const navigationTabs = [
    { name: 'All', count: null },
    { name: 'Buying Guides', count: null },
    { name: 'Videos', count: null },
    { name: 'Creator Reviews', count: null },
    { name: 'Collections', count: null },
    { name: 'Brand Stories', count: null },
    { name: 'Campaigns', count: null },
    { name: 'Blogs', count: null },
    { name: 'Deals', count: null },
    { name: 'Reels', count: null },
    { name: 'Live', count: null },
  ];

  // Quick Filter Options
  const quickFilters = ['Trending', 'Most Viewed', 'Most Helpful', 'Expert Picks', 'Official', 'Verified'];

  // Handle Search Input from Trending Searches
  const handleTrendingSearchClick = (term: string) => {
    setSearchQuery(term);
    toast.success(`Searching for "${term}"`, { icon: '🔍' });
  };

  // Toggle saving / bookmarking
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

  // Toggle following creator
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

  // Helper filter logic
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

    // Filter by active tab (Category)
    if (activeTab !== 'All') {
      result = result.filter(story => story.category === activeTab);
    }

    // Filter by search query
    if (searchQuery.trim() !== '') {
      const query = searchQuery.toLowerCase().trim();
      result = result.filter(story => 
        story.title.toLowerCase().includes(query) ||
        story.type.toLowerCase().includes(query) ||
        story.author.name.toLowerCase().includes(query)
      );
    }

    // Filter by active quick filters
    activeFilters.forEach(filter => {
      if (filter === 'Verified') {
        result = result.filter(story => story.author.badge.includes('Verified') || story.author.badge.includes('Official'));
      }
      if (filter === 'Expert Picks') {
        result = result.filter(story => story.author.badge === 'Verified Expert');
      }
    });

    return result;
  }, [activeTab, searchQuery, activeFilters]);

  // Filtered Trending items
  const filteredTrending = useMemo(() => {
    let result = [...TRENDING_DATA];

    // Filter by active tab (Category)
    if (activeTab !== 'All') {
      result = result.filter(item => item.category === activeTab);
    }

    // Filter by search query
    if (searchQuery.trim() !== '') {
      const query = searchQuery.toLowerCase().trim();
      result = result.filter(item => 
        item.title.toLowerCase().includes(query) ||
        item.badge.toLowerCase().includes(query)
      );
    }

    // Filter by active quick filters
    activeFilters.forEach(filter => {
      if (filter === 'Trending') {
        result = result.filter(item => item.badge === 'TRENDING');
      }
      if (filter === 'Newest') {
        result = result.filter(item => item.badge === 'NEW LAUNCH');
      }
    });

    return result;
  }, [activeTab, searchQuery, activeFilters]);

  return (
    <div className="flex flex-col min-h-screen bg-[#F8F9FB] text-gray-800 pb-20 select-none">
      
      {/* Top Breadcrumb Navigation */}
      <div className="w-full max-w-[1440px] mx-auto px-6 md:px-10 py-4 text-left select-none shrink-0">
        <nav className="text-xs font-semibold text-gray-400 flex items-center gap-1.5 uppercase tracking-wider">
          <Link to="/" className="hover:text-[#FF5B00] transition-colors">Home</Link>
          <span className="text-gray-300 font-bold">&gt;</span>
          <span className="text-gray-800 font-bold">Discover</span>
        </nav>
      </div>

      {/* 1. HERO SECTION WITH RICH BACKDROP AND PRODUCTS COMPOSITE */}
      <section className="max-w-[1440px] mx-auto w-full px-4 md:px-10 mb-8 shrink-0">
        <div className="bg-gradient-to-r from-[#030312] via-[#090A22] to-[#121338] rounded-3xl p-6 md:p-10 lg:p-12 relative overflow-hidden flex flex-col lg:flex-row items-center justify-between gap-8 border border-white/5 shadow-xl min-h-[380px]">
          
          {/* Glowing Ambient Light Spots */}
          <div className="absolute top-0 left-1/4 w-[400px] h-[400px] bg-[#FF5B00]/10 rounded-full blur-[120px] pointer-events-none" />
          <div className="absolute bottom-0 right-1/4 w-[350px] h-[350px] bg-[#5C2AFE]/15 rounded-full blur-[100px] pointer-events-none" />

          {/* Left Text Block */}
          <div className="max-w-2xl text-left relative z-10 flex-1">
            <h1 className="text-4xl md:text-5xl lg:text-[60px] font-black tracking-tight text-white leading-none uppercase">
              Discover
            </h1>
            <p className="text-[13px] md:text-sm text-gray-300 font-medium mt-4 leading-relaxed max-w-xl">
              Explore products, expert buying guides, creator reviews, videos, collections, brand stories and real experiences.
            </p>

            {/* INTEGRATED SEARCH BAR */}
            <div className="relative w-full max-w-lg mt-8">
              <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none z-20">
                <Search className="w-4 h-4 text-gray-400" />
              </div>
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search Discover..." 
                className="w-full h-12 pl-11 pr-24 bg-white border border-gray-200/25 rounded-xl text-xs font-bold text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#FF5B00]/30 transition-all shadow-md"
              />
              <button 
                className="absolute right-1.5 top-1.5 bottom-1.5 px-6 bg-[#FF5B00] hover:bg-[#E8500A] text-white text-[11px] font-black uppercase tracking-widest rounded-lg flex items-center justify-center transition-colors shadow-sm cursor-pointer border-0"
              >
                Search
              </button>
            </div>

            {/* Trending Searches Row */}
            <div className="flex flex-wrap items-center gap-2 mt-4 text-[11px] font-bold text-gray-400">
              <span className="font-semibold uppercase tracking-wider text-gray-500">Trending searches:</span>
              {[
                'iPhone 15 Pro Max',
                'Best Laptops 2025',
                'Running Shoes',
                'Smartwatches',
                'Air Fryer'
              ].map((term) => (
                <button
                  key={term}
                  onClick={() => handleTrendingSearchClick(term)}
                  className="hover:text-white hover:underline transition-colors cursor-pointer text-gray-400 font-bold border-0 bg-transparent p-0"
                >
                  {term},
                </button>
              ))}
            </div>
          </div>

          {/* Right Product Image Collage with Editor's Pick overlay */}
          <div className="relative w-full max-w-[500px] h-[300px] hidden lg:block flex-shrink-0">
            {/* Background Laptop image */}
            <div className="absolute top-4 right-10 w-[380px] h-[250px] rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
              <img 
                src="https://images.unsplash.com/photo-1496181130204-755241544e35?w=500&q=80" 
                className="w-full h-full object-cover grayscale opacity-40 group-hover:scale-105 transition-transform"
                alt="Laptop Backdrop"
              />
            </div>

            {/* Canon Camera overlay */}
            <div className="absolute top-2 right-0 w-[180px] h-[140px] rounded-xl overflow-hidden border border-white/10 shadow-xl transform rotate-3 bg-[#0A0B1A]">
              <img 
                src="https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=300&q=80" 
                className="w-full h-full object-cover"
                alt="Canon Camera"
              />
            </div>

            {/* Headphones overlay */}
            <div className="absolute -bottom-2 right-[190px] w-[180px] h-[150px] rounded-xl overflow-hidden border border-white/10 shadow-2xl transform -rotate-6 bg-[#0A0B1A]">
              <img 
                src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&q=80" 
                className="w-full h-full object-cover"
                alt="Headphones"
              />
            </div>

            {/* Red running shoe overlay */}
            <div className="absolute bottom-6 left-2 w-[160px] h-[120px] rounded-xl overflow-hidden border border-white/10 shadow-xl transform rotate-12 bg-[#0A0B1A]">
              <img 
                src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300&q=80" 
                className="w-full h-full object-cover"
                alt="Red shoe"
              />
            </div>

            {/* EDITOR'S PICK INTERACTIVE BANNER */}
            <div className="absolute bottom-4 right-2 bg-[#08081A]/95 border border-white/15 rounded-2xl p-4 shadow-2xl text-left w-[240px] backdrop-blur-md animate-fade-in">
              <div className="flex items-center justify-between">
                <span className="text-[9px] font-black tracking-widest text-[#FF5B00] uppercase">
                  Editor's Pick
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#FF5B00] animate-ping" />
              </div>
              <h4 className="text-xs font-black text-white mt-1 leading-snug">
                Best Tech of Summer 2025
              </h4>
              <p className="text-[10px] text-gray-400 mt-1 leading-none">
                12 min read
              </p>
              <div className="flex items-center justify-end mt-2">
                <div className="w-7 h-7 rounded-full bg-[#FF5B00]/10 text-[#FF5B00] flex items-center justify-center hover:bg-[#FF5B00] hover:text-white transition-colors cursor-pointer">
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* 2. PRIMARY HORIZONTAL NAVIGATION BAR */}
      <section className="max-w-[1440px] mx-auto w-full px-4 md:px-10 mb-5 shrink-0">
        <div className="bg-white border border-gray-200/80 rounded-2xl p-2 shadow-sm overflow-x-auto no-scrollbar">
          <div className="flex items-center gap-1 min-w-max">
            {navigationTabs.map((tab) => {
              const isActive = activeTab === tab.name;
              return (
                <button
                  key={tab.name}
                  onClick={() => {
                    setActiveTab(tab.name);
                    toast.success(`Category set to: ${tab.name}`);
                  }}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-xl transition-all font-sans text-xs font-bold uppercase tracking-wide cursor-pointer border-0 outline-none select-none shrink-0 ${
                    isActive 
                      ? 'bg-[#FF5B00]/10 text-[#FF5B00] border-b-2 border-[#FF5B00] rounded-b-none' 
                      : 'text-gray-500 hover:text-[#FF5B00] hover:bg-gray-50'
                  }`}
                >
                  {tab.name === 'All' && <LayoutGrid className="w-3.5 h-3.5" />}
                  {tab.name === 'Buying Guides' && <BookOpen className="w-3.5 h-3.5" />}
                  {tab.name === 'Videos' && <PlaySquare className="w-3.5 h-3.5" />}
                  {tab.name === 'Creator Reviews' && <Star className="w-3.5 h-3.5" />}
                  {tab.name === 'Collections' && <Flame className="w-3.5 h-3.5" />}
                  {tab.name === 'Brand Stories' && <ShieldCheck className="w-3.5 h-3.5" />}
                  {tab.name === 'Campaigns' && <Zap className="w-3.5 h-3.5" />}
                  {tab.name === 'Blogs' && <Sparkles className="w-3.5 h-3.5" />}
                  {tab.name === 'Deals' && <Heart className="w-3.5 h-3.5" />}
                  {tab.name === 'Reels' && <Smartphone className="w-3.5 h-3.5" />}
                  {tab.name === 'Live' && <Users className="w-3.5 h-3.5" />}
                  <span>{tab.name}</span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* 3. SUB-FILTERS ROW */}
      <section className="max-w-[1440px] mx-auto w-full px-4 md:px-10 mb-8 shrink-0">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between w-full">
          
          {/* Filter Action Indicators */}
          <div className="flex flex-wrap items-center gap-2.5">
            <button 
              onClick={() => {
                setIsFilterOpen(!isFilterOpen);
                toast.success('Filters settings drawer toggled');
              }}
              className="h-10 px-5 bg-white border border-gray-200 rounded-xl text-xs font-bold text-gray-700 flex items-center gap-2 shadow-sm cursor-pointer select-none border-0 outline-none"
            >
              <MoreHorizontal className="w-4 h-4 text-gray-400" />
              <span>FILTERS</span>
            </button>

            {/* Sort Selection indicator */}
            <div className="relative">
              <select 
                value={selectedSort}
                onChange={(e) => {
                  setSelectedSort(e.target.value);
                  toast.success(`Sorting by: ${e.target.value}`);
                }}
                className="h-10 px-4 bg-white border border-gray-200 rounded-xl text-xs font-bold text-gray-600 flex items-center shadow-sm select-none outline-none focus:border-[#FF5B00]/40"
              >
                <option value="Newest">Newest</option>
                <option value="Most Viewed">Most Viewed</option>
                <option value="Highest Rating">Highest Rating</option>
              </select>
            </div>

            {/* Dynamic Interactive Pills */}
            {quickFilters.map((filterName) => {
              const isSelected = activeFilters.includes(filterName);
              return (
                <button
                  key={filterName}
                  onClick={() => handleToggleFilter(filterName)}
                  className={`h-10 px-4 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all border shadow-sm cursor-pointer ${
                    isSelected 
                      ? 'bg-[#FF5B00]/10 border-[#FF5B00]/30 text-[#FF5B00]' 
                      : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  {isSelected && <Check className="w-3 h-3 text-[#FF5B00]" />}
                  {filterName}
                </button>
              );
            })}
          </div>

          {/* AI Discover Glowing Button */}
          <button 
            onClick={() => {
              setSearchQuery('Smartphones under 15k with best camera');
              toast.success('AI Engine: Analyzing best device recommendations for you!', { icon: '🧠' });
            }}
            className="h-10 px-5 bg-white border border-pink-200 hover:border-pink-300 rounded-xl text-xs font-bold text-pink-600 flex items-center gap-2 shadow-sm cursor-pointer select-none transition-all hover:bg-pink-50/50 outline-none"
          >
            <Bot className="w-4 h-4 text-pink-500" />
            <span>AI DISCOVER</span>
            <Sparkles className="w-3.5 h-3.5 text-pink-500" />
          </button>

        </div>
      </section>

      {/* 4. FEATURED DISCOVER STORIES SECTION */}
      <section className="max-w-[1440px] mx-auto w-full px-4 md:px-10 mb-10 text-left">
        <div className="flex items-center justify-between mb-5 border-b border-gray-100 pb-3">
          <div>
            <h2 className="text-sm font-black uppercase tracking-widest text-gray-400">Featured</h2>
            <h3 className="text-xl md:text-2xl font-black text-[#0E0F23] mt-0.5 uppercase tracking-tight">
              Featured Discover Stories
            </h3>
          </div>
          <Link 
            to="/guides" 
            className="text-xs font-bold text-[#FF5B00] hover:text-[#E8500A] transition-colors uppercase tracking-wider flex items-center gap-1 group"
          >
            View all featured 
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        {/* 4-Card Responsive Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
          <AnimatePresence mode="popLayout">
            {filteredStories.length === 0 ? (
              <div className="col-span-full py-12 text-center bg-white rounded-2xl border border-gray-200/80 shadow-sm">
                <Search className="w-10 h-10 mx-auto text-gray-300 mb-3" />
                <h4 className="font-bold text-[#0E0F23] text-sm">No featured stories found</h4>
                <p className="text-xs text-gray-400 mt-1">Try resetting categories or search terms</p>
              </div>
            ) : (
              filteredStories.map((story) => {
                const isSaved = savedStories.includes(story.id);
                // Badge color strategy
                const badgeColors: Record<string, string> = {
                  'BUYING GUIDE': 'bg-[#FF5B00] text-white',
                  'CREATOR REVIEW': 'bg-[#8B5CF6] text-white',
                  'COLLECTION': 'bg-[#3B82F6] text-white',
                  'BRAND STORY': 'bg-[#854D0E] text-white'
                };

                return (
                  <motion.div
                    key={story.id}
                    layout
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 15 }}
                    className="bg-white rounded-2xl border border-gray-200/75 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col justify-between overflow-hidden group text-left h-[420px]"
                  >
                    {/* Upper Image Section */}
                    <div className="relative h-[200px] overflow-hidden shrink-0">
                      <img 
                        src={story.image} 
                        alt={story.title} 
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        referrerPolicy="no-referrer"
                      />
                      {/* Floating Badge Tag */}
                      <div className="absolute top-3 left-3 z-10">
                        <span className={`${badgeColors[story.type] || 'bg-black text-white'} text-[9px] font-black tracking-widest px-2.5 py-1 rounded uppercase shadow-sm`}>
                          {story.type}
                        </span>
                      </div>

                      {/* Video indicator overlay */}
                      {story.isVideo && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/10">
                          <div className="w-12 h-12 rounded-full bg-red-600 flex items-center justify-center border border-white/20 shadow-md">
                            <Play className="text-white fill-white ml-0.5 w-5 h-5" />
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Middle Title Details */}
                    <div className="p-5 flex-1 flex flex-col justify-between">
                      <div>
                        <h4 className="font-sans text-[15px] font-black text-[#0E0F23] tracking-tight leading-snug group-hover:text-[#FF5B00] transition-colors line-clamp-2">
                          {story.title}
                        </h4>
                        <p className="text-[11px] text-gray-400 font-bold uppercase tracking-wider mt-2">
                          {story.readTime} &bull; {story.subCategory}
                        </p>
                      </div>

                      {/* Author Row */}
                      <div className="flex items-center justify-between pt-4 border-t border-gray-100 mt-4">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full overflow-hidden border border-gray-200 bg-gray-50 shrink-0">
                            <img src={story.author.avatar} alt={story.author.name} className="w-full h-full object-cover" />
                          </div>
                          <div>
                            <div className="text-[11px] font-bold text-[#0E0F23] flex items-center gap-1">
                              {story.author.name}
                              <CheckCircle2 className="w-3 h-3 text-[#FF5B00] fill-[#FF5B00]/5" />
                            </div>
                            <div className="text-[9px] font-semibold text-gray-400 uppercase tracking-wide">
                              {story.author.badge}
                            </div>
                          </div>
                        </div>

                        {/* Save Bookmark button */}
                        <button
                          onClick={() => toggleSaveStory(story.id)}
                          className={`w-7 h-7 rounded-full flex items-center justify-center border transition-all ${
                            isSaved 
                              ? 'border-[#FF5B00]/40 text-[#FF5B00] bg-[#FF5B00]/5' 
                              : 'border-gray-200 text-gray-400 hover:text-[#FF5B00] hover:border-[#FF5B00]/20'
                          } cursor-pointer`}
                        >
                          <Bookmark className={`w-3.5 h-3.5 ${isSaved ? 'fill-current' : ''}`} />
                        </button>
                      </div>
                    </div>

                  </motion.div>
                );
              })
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* 5. EXPLORE BY CATEGORY SECTION */}
      <section className="max-w-[1440px] mx-auto w-full px-4 md:px-10 mb-10 text-left">
        <div className="flex items-center justify-between mb-5 border-b border-gray-100 pb-3">
          <div>
            <h2 className="text-sm font-black uppercase tracking-widest text-gray-400">Discover</h2>
            <h3 className="text-xl md:text-2xl font-black text-[#0E0F23] mt-0.5 uppercase tracking-tight">
              Explore by Category
            </h3>
          </div>
          <Link 
            to="/categories" 
            className="text-xs font-bold text-[#FF5B00] hover:text-[#E8500A] transition-colors uppercase tracking-wider flex items-center gap-1 group"
          >
            View all categories 
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        {/* 8 Grid Tile Blocks */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4 w-full">
          {[
            { name: 'Smartphones', count: 128, icon: Smartphone },
            { name: 'Laptops', count: 96, icon: Laptop },
            { name: 'Audio', count: 78, icon: Headphones },
            { name: 'Cameras', count: 64, icon: Camera },
            { name: 'Gaming', count: 52, icon: Gamepad },
            { name: 'Home Appliances', count: 58, icon: Tv },
            { name: 'Fashion', count: 112, icon: Shirt },
            { name: 'More', count: 'All Categories', icon: MoreHorizontal }
          ].map((cat, idx) => {
            const IconComp = cat.icon;
            return (
              <div
                key={idx}
                onClick={() => {
                  setSearchQuery(cat.name === 'More' ? '' : cat.name);
                  toast.success(`Filtering category: ${cat.name}`);
                }}
                className="bg-white border border-gray-200/70 hover:border-[#FF5B00]/30 hover:shadow-md transition-all duration-200 rounded-2xl p-4 flex flex-col items-center justify-center text-center cursor-pointer group"
              >
                <div className="w-10 h-10 rounded-full bg-gray-50 text-gray-500 group-hover:bg-[#FF5B00]/10 group-hover:text-[#FF5B00] flex items-center justify-center transition-colors">
                  <IconComp className="w-5 h-5 shrink-0" />
                </div>
                <h4 className="text-xs font-black text-[#0E0F23] mt-2.5 tracking-tight group-hover:text-[#FF5B00] transition-colors">
                  {cat.name}
                </h4>
                <p className="text-[10px] text-gray-400 font-semibold mt-1">
                  {typeof cat.count === 'number' ? `${cat.count} Guides` : cat.count}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* 6. TRENDING NOW SECTION WITH CHEVRONS */}
      <section className="max-w-[1440px] mx-auto w-full px-4 md:px-10 mb-10 text-left">
        <div className="flex items-center justify-between mb-5 border-b border-gray-100 pb-3">
          <div>
            <h2 className="text-sm font-black uppercase tracking-widest text-gray-400">What's hot on Choosify right now</h2>
            <h3 className="text-xl md:text-2xl font-black text-[#0E0F23] mt-0.5 uppercase tracking-tight">
              Trending Now
            </h3>
          </div>
          <div className="flex items-center gap-4">
            <Link 
              to="/recommendations" 
              className="text-xs font-bold text-[#FF5B00] hover:text-[#E8500A] transition-colors uppercase tracking-wider flex items-center gap-1 group"
            >
              View all trending 
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </Link>
            
            {/* Scroll indicator buttons */}
            <div className="flex items-center gap-1.5 hidden sm:flex">
              <button 
                onClick={() => toast.success('Scrolled left')}
                className="w-8 h-8 rounded-full border border-gray-200 bg-white text-gray-400 hover:text-gray-800 flex items-center justify-center hover:shadow transition-all cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button 
                onClick={() => toast.success('Scrolled right')}
                className="w-8 h-8 rounded-full border border-gray-200 bg-white text-gray-400 hover:text-gray-800 flex items-center justify-center hover:shadow transition-all cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* 6 Column Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-6 gap-5 w-full">
          <AnimatePresence mode="popLayout">
            {filteredTrending.length === 0 ? (
              <div className="col-span-full py-12 text-center bg-white rounded-2xl border border-gray-200/80 shadow-sm">
                <Search className="w-10 h-10 mx-auto text-gray-300 mb-3" />
                <h4 className="font-bold text-[#0E0F23] text-sm">No trending guides found</h4>
                <p className="text-xs text-gray-400 mt-1">Refine filters to see other results</p>
              </div>
            ) : (
              filteredTrending.map((item) => {
                const badgeStyles: Record<string, string> = {
                  'TRENDING': 'bg-[#FF5B00] text-white',
                  'NEW LAUNCH': 'bg-[#10B981] text-white',
                  'DEAL ALERT': 'bg-[#F59E0B] text-white'
                };

                return (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="bg-white rounded-2xl border border-gray-200/60 shadow-xs hover:shadow-md transition-all duration-300 flex flex-col justify-between overflow-hidden group text-left h-[290px]"
                  >
                    {/* Media content */}
                    <div className="relative h-[130px] overflow-hidden shrink-0 bg-gray-50">
                      <img 
                        src={item.image} 
                        alt={item.title} 
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute top-2.5 left-2.5 z-10">
                        <span className={`${badgeStyles[item.badge] || 'bg-black text-white'} text-[8px] font-black tracking-wider px-2 py-0.5 rounded uppercase`}>
                          {item.badge}
                        </span>
                      </div>
                      
                      {item.isVideo && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/10">
                          <Play className="text-white fill-white w-6 h-6" />
                        </div>
                      )}
                    </div>

                    {/* Content text description */}
                    <div className="p-4 flex-1 flex flex-col justify-between">
                      <h4 className="font-sans text-[12.5px] font-black text-[#0E0F23] tracking-tight leading-snug group-hover:text-[#FF5B00] transition-colors line-clamp-3">
                        {item.title}
                      </h4>

                      <div className="flex items-center justify-between text-[10px] font-bold text-gray-400 uppercase tracking-wide border-t border-gray-100 pt-3 mt-3">
                        <span>{item.readTime}</span>
                        <span className="flex items-center gap-1">
                          <Eye className="w-3.5 h-3.5 text-gray-400" />
                          {item.views}
                        </span>
                      </div>
                    </div>

                  </motion.div>
                );
              })
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* 7. BROWSE BY FORMAT SECTION */}
      <section className="max-w-[1440px] mx-auto w-full px-4 md:px-10 mb-10 text-left">
        <div className="flex items-center justify-between mb-5 border-b border-gray-100 pb-3">
          <div>
            <h2 className="text-sm font-black uppercase tracking-widest text-gray-400">Choose how you want to discover</h2>
            <h3 className="text-xl md:text-2xl font-black text-[#0E0F23] mt-0.5 uppercase tracking-tight">
              Browse by Format
            </h3>
          </div>
          <Link 
            to="/recommendations" 
            className="text-xs font-bold text-[#FF5B00] hover:text-[#E8500A] transition-colors uppercase tracking-wider flex items-center gap-1 group"
          >
            View all formats 
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        {/* 6 wide format cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 w-full">
          {[
            { name: 'Videos', desc: 'Watch expert videos', color: 'bg-rose-50 text-rose-500', icon: PlaySquare },
            { name: 'Buying Guides', desc: 'In-depth buying help', color: 'bg-blue-50 text-blue-500', icon: BookOpen },
            { name: 'Reviews', desc: 'Honest product reviews', color: 'bg-amber-50 text-amber-500', icon: Star },
            { name: 'Comparisons', desc: 'Compare products', color: 'bg-purple-50 text-purple-500', icon: Scale },
            { name: 'Lists & Rankings', desc: 'Top picks & rankings', color: 'bg-indigo-50 text-indigo-500', icon: ListOrdered },
            { name: 'How-To & Tips', desc: 'Learn & improve', color: 'bg-teal-50 text-teal-500', icon: Lightbulb }
          ].map((format, idx) => {
            const IconComponent = format.icon;
            return (
              <div
                key={idx}
                onClick={() => {
                  setSearchQuery(format.name === 'Reviews' ? 'Review' : format.name);
                  toast.success(`Format selected: ${format.name}`);
                }}
                className="bg-white border border-gray-200/80 hover:border-[#FF5B00]/30 hover:shadow-md transition-all duration-200 rounded-2xl p-4 flex flex-col items-start text-left cursor-pointer group"
              >
                <div className={`w-9 h-9 rounded-full ${format.color} flex items-center justify-center shrink-0`}>
                  <IconComponent className="w-4 h-4" />
                </div>
                <h4 className="text-xs font-black text-[#0E0F23] mt-3 tracking-tight group-hover:text-[#FF5B00] transition-colors">
                  {format.name}
                </h4>
                <p className="text-[10px] text-gray-400 font-semibold mt-1 leading-tight">
                  {format.desc}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* 8. SPLIT SECTION: EDITOR'S PICKS & TOP CREATORS */}
      <section className="max-w-[1440px] mx-auto w-full px-4 md:px-10 mb-10 text-left">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 w-full">
          
          {/* Column A: Editor's Picks */}
          <div className="flex flex-col">
            <div className="flex items-center justify-between mb-5 border-b border-gray-100 pb-3">
              <div>
                <h2 className="text-sm font-black uppercase tracking-widest text-gray-400">Handpicked by our expert team</h2>
                <h3 className="text-xl font-black text-[#0E0F23] mt-0.5 uppercase tracking-tight">
                  Editor's Picks
                </h3>
              </div>
              <Link 
                to="/guides" 
                className="text-xs font-bold text-[#FF5B00] hover:text-[#E8500A] transition-colors uppercase tracking-wider flex items-center gap-1 group"
              >
                View all picks 
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>

            {/* Split layout inside Editor's Picks: 3 Rows on Left, 1 Big Card on Right */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-5 w-full items-stretch">
              
              {/* Left hand list side (7 cols) */}
              <div className="md:col-span-7 flex flex-col gap-3 justify-between">
                {EDITORS_LIST_DATA.map((item) => (
                  <div
                    key={item.id}
                    className="flex gap-4 bg-white p-3.5 rounded-2xl border border-gray-200/70 hover:border-gray-300 transition-all cursor-pointer items-center"
                    onClick={() => {
                      setSearchQuery(item.title);
                      toast.success(`Highlighting Pick: ${item.title}`);
                    }}
                  >
                    {/* Index Circle Indicator */}
                    <div className="w-7 h-7 rounded-full bg-[#FF5B00]/5 text-[#FF5B00] text-xs font-black flex items-center justify-center shrink-0">
                      {item.index}
                    </div>

                    {/* Image Thumbnail */}
                    <div className="w-14 h-14 rounded-lg bg-gray-50 border border-gray-200 overflow-hidden shrink-0">
                      <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                    </div>

                    {/* Details */}
                    <div className="min-w-0">
                      <h4 className="text-[12px] font-black text-[#0E0F23] tracking-tight leading-snug line-clamp-2 hover:text-[#FF5B00] transition-colors">
                        {item.title}
                      </h4>
                      <div className="flex items-center gap-2 text-[10px] text-gray-400 font-bold uppercase tracking-wider mt-1.5">
                        <span>{item.readTime}</span>
                        <span>&bull;</span>
                        <span className="flex items-center gap-1">
                          <Eye className="w-3 h-3 text-gray-400" />
                          {item.views}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Right hand Highlight card (5 cols) */}
              <div className="md:col-span-5 flex">
                <div className="bg-white border border-gray-200/80 rounded-2xl overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between w-full h-full group">
                  <div className="relative h-[150px] overflow-hidden bg-gray-100 shrink-0">
                    <img 
                      src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80" 
                      alt="Headphones" 
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute top-3 left-3">
                      <span className="bg-[#FF5B00] text-white text-[8px] font-black tracking-widest px-2 py-0.5 rounded uppercase">
                        Editor's Pick
                      </span>
                    </div>
                  </div>

                  <div className="p-4 flex-1 flex flex-col justify-between">
                    <div>
                      <h4 className="font-sans text-xs font-black text-[#0E0F23] tracking-tight leading-snug group-hover:text-[#FF5B00] transition-colors">
                        Best Noise Cancelling Headphones in 2025
                      </h4>
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mt-1">
                        10 min read
                      </p>
                    </div>

                    {/* Footer head author */}
                    <div className="flex items-center gap-2 pt-3 border-t border-gray-150 mt-3">
                      <div className="w-6 h-6 rounded-full overflow-hidden bg-gray-100 border border-gray-200 shrink-0">
                        <img src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&q=80" alt="Headphone Zone" />
                      </div>
                      <div>
                        <div className="text-[10px] font-black text-[#0E0F23]">
                          Headphone Zone
                        </div>
                        <div className="text-[8px] font-semibold text-gray-400 uppercase tracking-wide">
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
          <div className="flex flex-col">
            <div className="flex items-center justify-between mb-5 border-b border-gray-100 pb-3">
              <div>
                <h2 className="text-sm font-black uppercase tracking-widest text-gray-400">Discover trusted voices</h2>
                <h3 className="text-xl font-black text-[#0E0F23] mt-0.5 uppercase tracking-tight">
                  Top Creators
                </h3>
              </div>
              <Link 
                to="/creators" 
                className="text-xs font-bold text-[#FF5B00] hover:text-[#E8500A] transition-colors uppercase tracking-wider flex items-center gap-1 group"
              >
                View all creators 
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>

            {/* List of 4 creators with Follow CTA buttons */}
            <div className="flex flex-col gap-3.5 w-full flex-1 justify-between">
              {CREATORS_DATA.map((creator) => {
                const isFollowing = followedCreators.includes(creator.id);
                return (
                  <div
                    key={creator.id}
                    className="flex items-center justify-between bg-white p-3.5 rounded-2xl border border-gray-200/70 hover:border-gray-300 transition-all"
                  >
                    {/* User profile left */}
                    <div className="flex items-center gap-3.5">
                      <div className="w-12 h-12 rounded-full overflow-hidden border border-[#FF5B00]/10 shrink-0">
                        <img src={creator.avatar} alt={creator.name} className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <h4 className="text-sm font-black text-[#0E0F23] tracking-tight">
                            {creator.name}
                          </h4>
                          <span className="text-[#22C55E]">
                            <CheckCircle2 className="w-3.5 h-3.5 fill-[#22C55E]/10" />
                          </span>
                        </div>
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mt-0.5">
                          {creator.badge}
                        </p>
                        <p className="text-[10px] font-semibold text-gray-500 mt-1">
                          {creator.guidesCount} Guides &bull; {creator.followersCount} Followers
                        </p>
                      </div>
                    </div>

                    {/* Follow CTA Button */}
                    <button
                      onClick={() => toggleFollowCreator(creator.id, creator.name)}
                      className={`h-9 px-5 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer border-0 ${
                        isFollowing 
                          ? 'bg-gray-100 text-gray-500 hover:bg-gray-200' 
                          : 'bg-white text-[#0E0F23] border border-gray-300 hover:border-[#FF5B00] hover:text-[#FF5B00]'
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

      {/* 9. AI ASSISTANT PROMO BANNER (DISCOVER WITH EMI) */}
      <section className="max-w-[1440px] mx-auto w-full px-4 md:px-10 mb-10 text-left">
        <div className="bg-[#050516] rounded-3xl p-6 md:p-8 border border-white/5 shadow-xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="absolute top-0 right-0 w-[200px] h-[200px] bg-[#FF5B00]/10 rounded-full blur-[60px] pointer-events-none" />
          
          <div className="flex items-center gap-5 relative z-10">
            {/* Robot Icon Avatar Backdrop */}
            <div className="w-16 h-16 rounded-2xl bg-white/[0.04] border border-white/10 flex items-center justify-center shrink-0 shadow-lg text-4xl">
              🤖
            </div>
            <div>
              <h3 className="text-white font-black text-lg tracking-tight">
                DISCOVER WITH EMI
              </h3>
              <p className="text-gray-400 text-xs font-semibold uppercase tracking-wider mt-1">
                Your AI shopping assistant
              </p>
            </div>
          </div>

          {/* Quick interactive tags inside Middle Column */}
          <div className="flex-1 max-w-xl text-left relative z-10 md:px-6">
            <h4 className="text-gray-300 text-xs font-black uppercase tracking-wider mb-2.5">
              What are you looking for today?
            </h4>
            <div className="flex flex-wrap gap-2">
              {[
                'Best laptop under 80,000',
                'Noise cancelling headphones',
                'Winter jackets for men',
                'Vlogging camera'
              ].map((tag) => (
                <button
                  key={tag}
                  onClick={() => {
                    setSearchQuery(tag);
                    toast.success(`Emi searching for: "${tag}"`, { icon: '🤖' });
                  }}
                  className="px-3 py-1.5 bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-white rounded-lg text-[10px] font-bold tracking-tight transition-colors cursor-pointer"
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          {/* Action ask button right */}
          <button
            onClick={() => {
              if (searchQuery.trim() === '') {
                toast.error('Type something first or select a recommendation query tag!');
              } else {
                toast.success(`Emi is analyzing: "${searchQuery}"`, { icon: '🤖' });
              }
            }}
            className="px-7 py-3 bg-[#FF5B00] hover:bg-[#E8500A] text-white text-xs font-black uppercase tracking-widest rounded-xl transition-all shadow-md hover:scale-[1.02] active:scale-[0.98] shrink-0 w-full md:w-auto text-center border-0 cursor-pointer"
          >
            ASK EMI &nbsp; &rarr;
          </button>
        </div>
      </section>

      {/* 10. WHY TRUST CHOOSIFY DISCOVER SECTION */}
      <section className="max-w-[1440px] mx-auto w-full px-4 md:px-10 text-center select-none">
        <h3 className="font-sans text-[11px] font-black text-gray-400 uppercase tracking-[0.25em] mb-6">
          Why Trust Choosify Discover?
        </h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-5 gap-4 w-full">
          {[
            { title: 'Expert & Verified', desc: 'Content by experts and verified creators.', icon: CheckCircle2 },
            { title: '100% Independent', desc: 'Unbiased guides you can trust.', icon: ShieldCheck },
            { title: 'Regularly Updated', desc: 'Latest trends and recommendations.', icon: Calendar },
            { title: 'Real Experiences', desc: 'From real users and customers.', icon: Sparkles },
            { title: 'Smart & Helpful', desc: 'AI powered discovery just for you.', icon: Bot }
          ].map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="bg-white border border-gray-200/70 rounded-2xl p-4 text-center hover:shadow transition-all duration-200 flex flex-col items-center justify-center"
              >
                <div className="w-9 h-9 rounded-full bg-[#FF5B00]/5 text-[#FF5B00] flex items-center justify-center shrink-0">
                  <Icon className="w-4.5 h-4.5" />
                </div>
                <h4 className="text-[11.5px] font-black text-[#0E0F23] mt-3 tracking-tight">
                  {item.title}
                </h4>
                <p className="text-[10px] text-gray-400 font-semibold mt-1 leading-snug">
                  {item.desc}
                </p>
              </div>
            );
          })}
        </div>
      </section>

    </div>
  );
}
