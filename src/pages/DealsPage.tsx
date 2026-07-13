import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Home, ChevronRight, BadgePercent, Clock, Percent, ShoppingBag, Star, 
  Tags, Landmark, SlidersHorizontal, Heart, Bookmark, ShoppingCart, 
  ShieldCheck, Award, RotateCcw, Lock, Search, Mail, ArrowUpRight, Check
} from 'lucide-react';

// Import our beautiful custom generated hero banner image
// @ts-expect-error raw image asset import
import heroBannerImg from '../assets/images/deals_hero_banner_1783876480998.jpg';

// Type definitions for interactive states
interface Product {
  id: string;
  title: string;
  brand: string;
  image: string;
  price: number;
  originalPrice: number;
  discount: string;
  tag: 'HOT' | 'SALE' | 'NEW';
  likes: number;
  bookmarks: number;
  category: string;
}

// 1. Precise Mock Datasets reflecting the reference image items
const FEATURED_DEAL_DATA: Product = {
  id: 'feat-1',
  title: 'Samsung Galaxy S24 Ultra',
  brand: 'SAMSUNG',
  image: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=800&q=80', // High-res smartphone image
  price: 145000,
  originalPrice: 165000,
  discount: '15% OFF',
  tag: 'HOT',
  likes: 239,
  bookmarks: 157,
  category: 'Smartphones'
};

const TODAY_HOT_DEALS: Product[] = [
  {
    id: 'hot-1',
    title: 'Apple AirPods Pro (2nd Gen)',
    brand: 'APPLE',
    image: 'https://images.unsplash.com/photo-1588449668338-d15176090c44?w=400&q=80', // AirPods
    price: 25900,
    originalPrice: 30900,
    discount: '16% OFF',
    tag: 'SALE',
    likes: 312,
    bookmarks: 203,
    category: 'Audio'
  },
  {
    id: 'hot-2',
    title: 'Apple MacBook Air M3',
    brand: 'APPLE',
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&q=80', // MacBook
    price: 128000,
    originalPrice: 145000,
    discount: '12% OFF',
    tag: 'HOT',
    likes: 219,
    bookmarks: 143,
    category: 'Laptops'
  },
  {
    id: 'hot-3',
    title: 'Sony WH-1000XM5',
    brand: 'SONY',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&q=80', // Headphones
    price: 32990,
    originalPrice: 46900,
    discount: '30% OFF',
    tag: 'SALE',
    likes: 198,
    bookmarks: 114,
    category: 'Audio'
  },
  {
    id: 'hot-4',
    title: "Apex Men's Royal Loafer",
    brand: 'APEX',
    image: 'https://images.unsplash.com/photo-1533867617858-e7b97e060509?w=400&q=80', // Royal Loafer
    price: 3280,
    originalPrice: 4900,
    discount: '22% OFF',
    tag: 'SALE',
    likes: 188,
    bookmarks: 108,
    category: 'Fashion'
  }
];

const ALL_DEALS_GRID: Product[] = [
  {
    id: 'all-1',
    title: "Apex Men's Royal Loafer",
    brand: 'APEX',
    image: 'https://images.unsplash.com/photo-1533867617858-e7b97e060509?w=400&q=80',
    price: 3280,
    originalPrice: 4200,
    discount: '22% OFF',
    tag: 'SALE',
    likes: 188,
    bookmarks: 108,
    category: 'Fashion'
  },
  {
    id: 'all-2',
    title: 'Samsung Galaxy S24 Ultra',
    brand: 'SAMSUNG',
    image: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=400&q=80',
    price: 145000,
    originalPrice: 165000,
    discount: '15% OFF',
    tag: 'SALE',
    likes: 239,
    bookmarks: 157,
    category: 'Smartphones'
  },
  {
    id: 'all-3',
    title: 'MacBook Air M3',
    brand: 'APPLE',
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&q=80',
    price: 128000,
    originalPrice: 145000,
    discount: '13% OFF',
    tag: 'HOT',
    likes: 219,
    bookmarks: 143,
    category: 'Laptops'
  },
  {
    id: 'all-4',
    title: 'AirPods Pro (2nd Gen)',
    brand: 'APPLE',
    image: 'https://images.unsplash.com/photo-1588449668338-d15176090c44?w=400&q=80',
    price: 25900,
    originalPrice: 30900,
    discount: '15% OFF',
    tag: 'SALE',
    likes: 312,
    bookmarks: 203,
    category: 'Audio'
  }
];

export function DealsPage() {
  // State for search and filtering
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('Deals & Offers');
  const [subFilter, setSubFilter] = useState('ALL DEALS');
  const [likedProducts, setLikedProducts] = useState<string[]>([]);
  const [bookmarkedProducts, setBookmarkedProducts] = useState<string[]>([]);
  
  // Newsletter signup state
  const [newsletterEmail, setNewsletterEmail] = useState('');

  // Ticking countdown timer state starting at "71:46:28"
  const [hours, setHours] = useState(71);
  const [minutes, setMinutes] = useState(46);
  const [seconds, setSeconds] = useState(28);

  useEffect(() => {
    const timer = setInterval(() => {
      setSeconds(prev => {
        if (prev > 0) return prev - 1;
        setMinutes(m => {
          if (m > 0) return m - 1;
          setHours(h => (h > 0 ? h - 1 : 71));
          return 59;
        });
        return 59;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formattedTime = `${String(hours).padStart(2, '0')} : ${String(minutes).padStart(2, '0')} : ${String(seconds).padStart(2, '0')}`;

  // Interactive callbacks
  const handleLike = (id: string, name: string) => {
    const isLiked = likedProducts.includes(id);
    if (isLiked) {
      setLikedProducts(prev => prev.filter(item => item !== id));
      toast.success(`Removed like from ${name}`);
    } else {
      setLikedProducts(prev => [...prev, id]);
      toast.success(`Liked ${name}!`, { icon: '❤️' });
    }
  };

  const handleBookmark = (id: string, name: string) => {
    const isBookmarked = bookmarkedProducts.includes(id);
    if (isBookmarked) {
      setBookmarkedProducts(prev => prev.filter(item => item !== id));
      toast.success(`Removed bookmark from ${name}`);
    } else {
      setBookmarkedProducts(prev => [...prev, id]);
      toast.success(`Bookmarked ${name}!`, { icon: '🔖' });
    }
  };

  const handleAddToCart = (name: string) => {
    toast.success(`Added ${name} to cart!`, {
      icon: '🛒',
      style: {
        background: '#10B981',
        color: '#fff'
      }
    });
  };

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail.trim() || !newsletterEmail.includes('@')) {
      toast.error('Please enter a valid email address.');
      return;
    }
    toast.success(`Subscribed successfully with: ${newsletterEmail}!`, { icon: '🎉' });
    setNewsletterEmail('');
  };

  // Popular search tags callback
  const handlePopularSearch = (term: string) => {
    setSearchQuery(term);
    toast.success(`Searching deals for "${term}"`, { icon: '🔍' });
  };

  // Filter products based on search input & tabs
  const filteredAllDeals = useMemo(() => {
    return ALL_DEALS_GRID.filter(p => {
      const matchSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          p.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.category.toLowerCase().includes(searchQuery.toLowerCase());
      
      if (!matchSearch) return false;

      // Filter by sub-filter pills
      if (subFilter === 'FEATURED DEALS') {
        return p.id === 'all-2' || p.id === 'all-3'; // Mock featured items
      }
      if (subFilter === 'TOP RATED') {
        return p.likes > 200;
      }
      if (subFilter === 'TRENDING') {
        return p.bookmarks > 150;
      }
      return true;
    });
  }, [searchQuery, subFilter]);

  // Main UI categories / tabs row configuration
  const dealsMainTabs = [
    { id: 'flash', label: 'Flash Deals', sub: 'Ending Soon', icon: Clock },
    { id: 'offers', label: 'Deals & Offers', sub: 'Top Discounts', icon: Percent },
    { id: 'brand', label: 'Brand Deals', sub: 'Exclusive Offers', icon: ShoppingBag },
    { id: 'discount', label: 'Extra 15% Off', sub: 'This Week', icon: BadgePercent },
    { id: 'new', label: 'New Deals', sub: 'Just Added', icon: Star },
    { id: 'clearance', label: 'Clearance Sale', sub: 'Huge Savings', icon: Tags },
    { id: 'bank', label: 'Bank Offers', sub: 'Extra Discounts', icon: Landmark }
  ];

  return (
    <div className="flex flex-col min-h-screen bg-[#F8F9FB] text-gray-800 pb-20 select-none font-sans">
      
      {/* 1. BREADCRUMB */}
      <div className="w-full max-w-[1440px] mx-auto px-6 md:px-10 py-4 text-left select-none shrink-0">
        <nav className="text-xs font-semibold text-gray-400 flex items-center gap-1.5 uppercase tracking-wider">
          <Link to="/" className="hover:text-[#FF5B00] transition-colors">Home</Link>
          <span className="text-gray-300 font-bold">&gt;</span>
          <span className="text-gray-800 font-bold">Deals</span>
        </nav>
      </div>

      {/* 2. Sleek Dark 3D-Glow Hero Section */}
      <section className="max-w-[1440px] mx-auto w-full px-4 md:px-10 mb-6 shrink-0">
        <div className="bg-gradient-to-r from-[#030312] via-[#090A22] to-[#121338] rounded-3xl p-8 md:p-12 relative overflow-hidden flex flex-col md:flex-row items-center justify-between border border-white/5 shadow-xl min-h-[260px] md:min-h-[280px]">
          
          {/* Glowing Ambient Light Spots */}
          <div className="absolute top-0 left-1/4 w-[350px] h-[350px] bg-[#FF5B00]/10 rounded-full blur-[100px] pointer-events-none" />
          <div className="absolute bottom-0 right-1/4 w-[300px] h-[300px] bg-[#5C2AFE]/15 rounded-full blur-[90px] pointer-events-none" />

          {/* Left Text Block */}
          <div className="max-w-xl text-left relative z-10 flex-1">
            <div className="flex items-center gap-3.5">
              <h1 className="text-4xl md:text-5xl lg:text-[56px] font-black tracking-tight text-white leading-none uppercase">
                Deals
              </h1>
              {/* Gear-style Badge Outline with percentage */}
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-gradient-to-br from-[#FF5B00]/20 to-[#E8500A]/30 border border-[#FF5B00]/40 flex items-center justify-center text-[#FF5B00] text-xl font-black shadow-md shadow-[#FF5B00]/10 animate-pulse">
                %
              </div>
            </div>
            <p className="text-[13px] md:text-sm text-gray-300 font-medium mt-4 leading-relaxed max-w-md">
              Limited-time discounts from verified sellers.
            </p>
          </div>

          {/* Right Product Image Collage - Blending our custom generated 3D visual */}
          <div className="absolute right-0 top-0 bottom-0 w-full md:w-[45%] lg:w-[50%] h-full hidden md:block z-0 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-[#030312] via-[#090A22]/40 to-transparent z-10" />
            <img 
              src={heroBannerImg} 
              alt="Promo background" 
              className="w-full h-full object-cover object-right"
              referrerPolicy="no-referrer"
            />
          </div>

        </div>
      </section>

      {/* 3. Horizontal Promo Categories Tabs Container (White bar with shadow) */}
      <section className="max-w-[1440px] mx-auto w-full px-4 md:px-10 mb-8 shrink-0">
        <div className="bg-white border border-gray-150 rounded-2xl p-2 shadow-sm overflow-x-auto no-scrollbar">
          <div className="flex items-center justify-between gap-2 min-w-[1100px]">
            {dealsMainTabs.map((tab) => {
              const TabIcon = tab.icon;
              const isActive = activeTab === tab.label;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.label);
                    toast.success(`Viewing ${tab.label}`);
                  }}
                  className={`flex-1 flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-200 border text-left cursor-pointer outline-none ${
                    isActive 
                      ? 'border-[#FF5B00]/40 bg-[#FF5B00]/5 shadow-sm text-[#FF5B00]' 
                      : 'border-transparent bg-white text-gray-600 hover:bg-gray-50 hover:text-[#FF5B00]'
                  }`}
                >
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 transition-colors ${
                    isActive ? 'bg-[#FF5B00] text-white' : 'bg-gray-100 text-gray-400 group-hover:bg-[#FF5B00]/15'
                  }`}>
                    <TabIcon className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-[12px] font-black tracking-tight leading-none">
                      {tab.label}
                    </h4>
                    <p className={`text-[10px] font-medium mt-1 leading-none ${isActive ? 'text-[#FF5B00]/70' : 'text-gray-400'}`}>
                      {tab.sub}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* 4. Sub-Filter Pills Row */}
      <section className="max-w-[1440px] mx-auto w-full px-4 md:px-10 mb-8 shrink-0 text-left">
        <div className="flex items-center justify-between gap-4 border-b border-gray-100 pb-3">
          <div className="flex items-center gap-2">
            {[
              'ALL DEALS',
              'FEATURED DEALS',
              'TOP RATED',
              'TRENDING'
            ].map((pill) => {
              const isSelected = subFilter === pill;
              return (
                <button
                  key={pill}
                  onClick={() => {
                    setSubFilter(pill);
                    toast.success(`Filter applied: ${pill.toLowerCase()}`);
                  }}
                  className={`h-9 px-5 rounded-full text-xs font-black uppercase tracking-wider transition-all duration-200 cursor-pointer ${
                    isSelected 
                      ? 'bg-[#FF5B00] text-white shadow-sm shadow-[#FF5B00]/20' 
                      : 'bg-[#ECEFF4] hover:bg-[#E2E7EE] text-gray-500 hover:text-gray-800'
                  }`}
                >
                  {pill}
                </button>
              );
            })}
          </div>

          <button 
            onClick={() => toast.success('Standard filter options drawer opened')}
            className="h-9 px-4 bg-white border border-gray-200 rounded-xl text-xs font-black text-gray-600 flex items-center gap-2 hover:bg-gray-50 shadow-xs cursor-pointer"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-gray-400" />
            <span>FILTER</span>
          </button>
        </div>
      </section>

      {/* 5. Main Split Section (Featured Deals + Sidebars) */}
      <section className="max-w-[1440px] mx-auto w-full px-4 md:px-10 mb-10 text-left">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column (approx 75% width): Featured Deal and All Deals Grid */}
          <div className="lg:col-span-9 flex flex-col gap-10">
            
            {/* Featured Deals module */}
            <div>
              <div className="flex items-center justify-between mb-5 border-b border-gray-100 pb-3">
                <div>
                  <h3 className="text-xl font-black text-[#0E0F23] uppercase tracking-tight">
                    Featured Deals
                  </h3>
                  <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">
                    Handpicked offers &bull; Limited time only
                  </p>
                </div>
                <Link 
                  to="/products" 
                  className="text-xs font-black text-[#FF5B00] hover:text-[#E8500A] transition-colors uppercase tracking-widest flex items-center gap-1.5 group"
                >
                  View all featured 
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </Link>
              </div>

              {/* Mega Horizontal Featured Card */}
              <div className="bg-white rounded-3xl border border-gray-200/80 shadow-md hover:shadow-lg transition-all duration-300 p-6 flex flex-col md:flex-row gap-8 items-stretch relative overflow-hidden group">
                
                {/* Image side with floating badges */}
                <div className="w-full md:w-[42%] min-h-[220px] md:min-h-[260px] bg-gray-50 rounded-2xl overflow-hidden relative flex-shrink-0 flex items-center justify-center">
                  <img 
                    src={FEATURED_DEAL_DATA.image} 
                    alt={FEATURED_DEAL_DATA.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    referrerPolicy="no-referrer"
                  />
                  
                  {/* Overlaid Pill Badges */}
                  <div className="absolute top-4 left-4 flex flex-col gap-1.5 z-10">
                    <span className="bg-[#FF5900] text-white text-[9px] font-black tracking-widest px-3 py-1 rounded uppercase shadow-xs">
                      HOT
                    </span>
                    <span className="bg-[#10B981] text-white text-[9px] font-black tracking-widest px-3 py-1 rounded uppercase shadow-xs">
                      NEW
                    </span>
                    <span className="bg-[#FF3B30] text-white text-[9px] font-black tracking-widest px-3 py-1 rounded uppercase shadow-xs">
                      15% OFF
                    </span>
                  </div>
                </div>

                {/* Content Details side */}
                <div className="flex-1 flex flex-col justify-between py-1 text-left relative">
                  
                  {/* Brand & Ends In Countdown Row */}
                  <div className="flex items-center justify-between gap-4 mb-2.5">
                    <span className="text-xs font-black tracking-wider text-blue-600 uppercase">
                      {FEATURED_DEAL_DATA.brand}
                    </span>
                    <div className="flex items-center gap-1.5 px-3 py-1 bg-orange-50 border border-orange-100 rounded-full text-[10px] font-black text-[#FF5B00]">
                      <Clock className="w-3.5 h-3.5" />
                      <span>Ends in {formattedTime}</span>
                    </div>
                  </div>

                  {/* Title */}
                  <div>
                    <h2 className="text-2xl md:text-3xl font-black text-[#0E0F23] tracking-tight leading-tight hover:text-[#FF5B00] transition-colors">
                      {FEATURED_DEAL_DATA.title}
                    </h2>
                    
                    {/* Status progress Claim row */}
                    <div className="mt-4 max-w-sm">
                      <div className="flex justify-between items-center text-[11px] font-black text-gray-400 mb-1.5">
                        <span className="text-purple-600 flex items-center gap-1">
                          ⚡ FEATURED
                        </span>
                        <span>82% Claimed</span>
                      </div>
                      <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-[#FF5B00] to-red-600 rounded-full" style={{ width: '82%' }}></div>
                      </div>
                    </div>
                  </div>

                  {/* Pricing details block */}
                  <div className="mt-6 border-t border-gray-100 pt-5">
                    <span className="text-[10px] font-black uppercase text-gray-400 tracking-wider block">
                      Special Price
                    </span>
                    <div className="flex items-baseline gap-3 mt-1.5 flex-wrap">
                      <span className="text-3xl md:text-4xl font-black text-[#FF5B00]">
                        BDT {FEATURED_DEAL_DATA.price.toLocaleString()}
                      </span>
                      <span className="text-sm font-semibold text-gray-400 line-through">
                        BDT {FEATURED_DEAL_DATA.originalPrice.toLocaleString()}
                      </span>
                      <span className="bg-[#EAFBF3] border border-[#C6F6DF] px-2.5 py-1 rounded text-[11px] font-black text-[#10B981] uppercase tracking-wide">
                        Save BDT {(FEATURED_DEAL_DATA.originalPrice - FEATURED_DEAL_DATA.price).toLocaleString()} (12%)
                      </span>
                    </div>
                  </div>

                  {/* Bottom counters & Add to cart button */}
                  <div className="flex items-center justify-between gap-4 mt-6 pt-5 border-t border-gray-100">
                    <div className="flex items-center gap-2.5">
                      {/* Heart Like counter button */}
                      <button
                        onClick={() => handleLike(FEATURED_DEAL_DATA.id, FEATURED_DEAL_DATA.title)}
                        className={`h-9 px-4 rounded-xl border flex items-center gap-1.5 transition-all text-xs font-black cursor-pointer ${
                          likedProducts.includes(FEATURED_DEAL_DATA.id)
                            ? 'bg-red-50 border-red-200 text-red-500'
                            : 'bg-white border-gray-200 text-gray-400 hover:text-red-500'
                        }`}
                      >
                        <Heart className={`w-4 h-4 ${likedProducts.includes(FEATURED_DEAL_DATA.id) ? 'fill-current' : ''}`} />
                        <span>{FEATURED_DEAL_DATA.likes + (likedProducts.includes(FEATURED_DEAL_DATA.id) ? 1 : 0)}</span>
                      </button>

                      {/* Bookmark Save counter button */}
                      <button
                        onClick={() => handleBookmark(FEATURED_DEAL_DATA.id, FEATURED_DEAL_DATA.title)}
                        className={`h-9 px-4 rounded-xl border flex items-center gap-1.5 transition-all text-xs font-black cursor-pointer ${
                          bookmarkedProducts.includes(FEATURED_DEAL_DATA.id)
                            ? 'bg-[#FF5B00]/5 border-[#FF5B00]/20 text-[#FF5B00]'
                            : 'bg-white border-gray-200 text-gray-400 hover:text-[#FF5B00]'
                        }`}
                      >
                        <Bookmark className={`w-4 h-4 ${bookmarkedProducts.includes(FEATURED_DEAL_DATA.id) ? 'fill-current' : ''}`} />
                        <span>{FEATURED_DEAL_DATA.bookmarks + (bookmarkedProducts.includes(FEATURED_DEAL_DATA.id) ? 1 : 0)}</span>
                      </button>
                    </div>

                    {/* Circular big orange cart button */}
                    <button
                      onClick={() => handleAddToCart(FEATURED_DEAL_DATA.title)}
                      className="w-11 h-11 rounded-full bg-[#FF5B00] hover:bg-[#E8500A] text-white flex items-center justify-center transition-all shadow-md hover:scale-105 active:scale-95 cursor-pointer border-0"
                    >
                      <ShoppingCart className="w-5 h-5 shrink-0" />
                    </button>
                  </div>

                </div>

              </div>
            </div>

            {/* All Deals Module */}
            <div>
              <div className="flex items-center justify-between mb-5 border-b border-gray-100 pb-3">
                <div>
                  <h3 className="text-xl font-black text-[#0E0F23] uppercase tracking-tight">
                    All Deals
                  </h3>
                  <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">
                    Browse all active offers
                  </p>
                </div>
                <Link 
                  to="/products" 
                  className="text-xs font-black text-[#FF5B00] hover:text-[#E8500A] transition-colors uppercase tracking-widest flex items-center gap-1.5 group"
                >
                  View all deals 
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </Link>
              </div>

              {/* 4-Column Grid for All Deals */}
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 w-full">
                <AnimatePresence mode="popLayout">
                  {filteredAllDeals.length === 0 ? (
                    <div className="col-span-full py-12 text-center bg-white rounded-2xl border border-gray-200/80 shadow-sm">
                      <Search className="w-10 h-10 mx-auto text-gray-300 mb-3" />
                      <h4 className="font-bold text-[#0E0F23] text-sm">No deals found</h4>
                      <p className="text-xs text-gray-400 mt-1">Try refining your search keyword or active sub-filters</p>
                    </div>
                  ) : (
                    filteredAllDeals.map((deal) => {
                      const isLiked = likedProducts.includes(deal.id);
                      const isBookmarked = bookmarkedProducts.includes(deal.id);
                      return (
                        <motion.div
                          key={deal.id}
                          layout
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                          className="bg-white rounded-2xl border border-gray-200/80 shadow-xs hover:shadow-md transition-all duration-300 flex flex-col justify-between overflow-hidden group h-[380px]"
                        >
                          {/* Image box */}
                          <div className="relative h-[160px] bg-gray-50 overflow-hidden shrink-0">
                            <img 
                              src={deal.image} 
                              alt={deal.title} 
                              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                              referrerPolicy="no-referrer"
                            />
                            
                            {/* Tags overlay */}
                            <div className="absolute top-3 left-3 flex flex-col gap-1 z-10">
                              <span className="bg-[#FF3B30] text-white text-[8px] font-black tracking-widest px-2 py-0.5 rounded uppercase">
                                {deal.tag}
                              </span>
                              <span className="bg-[#10B981] text-white text-[8px] font-black tracking-widest px-2 py-0.5 rounded uppercase">
                                {deal.discount}
                              </span>
                            </div>
                          </div>

                          {/* Content block */}
                          <div className="p-4 flex-1 flex flex-col justify-between text-left">
                            <div>
                              <span className="text-[10px] font-black text-gray-400 uppercase tracking-wider block">
                                {deal.brand}
                              </span>
                              <h4 className="font-sans text-[13px] font-black text-[#0E0F23] tracking-tight leading-snug group-hover:text-[#FF5B00] transition-colors line-clamp-2 mt-1">
                                {deal.title}
                              </h4>
                            </div>

                            {/* Price details block */}
                            <div>
                              <div className="flex items-baseline gap-2 flex-wrap">
                                <span className="text-base font-black text-[#FF5B00]">
                                  BDT {deal.price.toLocaleString()}
                                </span>
                                <span className="text-xs font-semibold text-gray-400 line-through">
                                  BDT {deal.originalPrice.toLocaleString()}
                                </span>
                              </div>
                            </div>

                            {/* Footer interactions bar */}
                            <div className="flex items-center justify-between gap-2.5 pt-3 border-t border-gray-100 mt-1">
                              <div className="flex items-center gap-1.5">
                                {/* Heart button */}
                                <button
                                  onClick={() => handleLike(deal.id, deal.title)}
                                  className={`w-7 h-7 rounded-lg border flex items-center justify-center transition-all ${
                                    isLiked 
                                      ? 'border-red-200 text-red-500 bg-red-50' 
                                      : 'border-gray-200 text-gray-400 hover:text-red-500 hover:bg-gray-50'
                                  } cursor-pointer`}
                                >
                                  <Heart className={`w-3.5 h-3.5 ${isLiked ? 'fill-current' : ''}`} />
                                </button>
                                <span className="text-[10px] font-bold text-gray-500 select-none">
                                  {deal.likes + (isLiked ? 1 : 0)}
                                </span>

                                {/* Bookmark button */}
                                <button
                                  onClick={() => handleBookmark(deal.id, deal.title)}
                                  className={`w-7 h-7 rounded-lg border flex items-center justify-center transition-all ml-1 ${
                                    isBookmarked 
                                      ? 'border-[#FF5B00]/30 text-[#FF5B00] bg-[#FF5B00]/5' 
                                      : 'border-gray-200 text-gray-400 hover:text-[#FF5B00] hover:bg-gray-50'
                                  } cursor-pointer`}
                                >
                                  <Bookmark className={`w-3.5 h-3.5 ${isBookmarked ? 'fill-current' : ''}`} />
                                </button>
                                <span className="text-[10px] font-bold text-gray-500 select-none">
                                  {deal.bookmarks + (isBookmarked ? 1 : 0)}
                                </span>
                              </div>

                              {/* Cart button */}
                              <button
                                onClick={() => handleAddToCart(deal.title)}
                                className="w-8 h-8 rounded-full bg-[#FF5B00] hover:bg-[#E8500A] text-white flex items-center justify-center transition-all shadow-xs hover:scale-105 cursor-pointer border-0"
                              >
                                <ShoppingCart className="w-3.5 h-3.5 shrink-0" />
                              </button>
                            </div>
                          </div>
                        </motion.div>
                      );
                    })
                  )}
                </AnimatePresence>
              </div>
            </div>

          </div>

          {/* Right Column (approx 25% width): Today's Hot Deals sidebar list */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-3xl border border-gray-200/80 p-5 shadow-sm text-left">
              <h3 className="text-base font-black text-[#0E0F23] uppercase tracking-tight pb-3 border-b border-gray-150">
                Today's Hot Deals
              </h3>
              
              {/* Hot List Container */}
              <div className="flex flex-col gap-4.5 mt-4">
                {TODAY_HOT_DEALS.map((hotItem) => {
                  return (
                    <div 
                      key={hotItem.id}
                      className="flex gap-3 items-center group cursor-pointer"
                      onClick={() => {
                        setSearchQuery(hotItem.title);
                        toast.success(`Filtering deals by: ${hotItem.brand}`);
                      }}
                    >
                      {/* Left side thumb */}
                      <div className="w-14 h-14 bg-gray-50 border border-gray-150 rounded-xl overflow-hidden shrink-0 flex items-center justify-center">
                        <img 
                          src={hotItem.image} 
                          alt={hotItem.title} 
                          className="w-full h-full object-cover transition-transform group-hover:scale-105"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                      
                      {/* Right side specifications */}
                      <div className="min-w-0 flex-1">
                        <h4 className="text-[12px] font-black text-[#0E0F23] tracking-tight leading-snug line-clamp-1 group-hover:text-[#FF5B00] transition-colors">
                          {hotItem.title}
                        </h4>
                        
                        {/* Pricing details in orange / grey */}
                        <div className="flex items-baseline gap-1.5 mt-1">
                          <span className="text-[12px] font-black text-[#FF5B00]">
                            BDT {hotItem.price.toLocaleString()}
                          </span>
                          <span className="text-[10px] text-gray-400 line-through">
                            BDT {hotItem.originalPrice.toLocaleString()}
                          </span>
                        </div>

                        {/* Percent badge */}
                        <span className="text-[9px] font-black text-[#FF5B00] bg-orange-50 border border-orange-100 px-1.5 py-0.5 rounded uppercase mt-1 inline-block">
                          {hotItem.discount}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* VIEW ALL HOT DEALS Button */}
              <button 
                onClick={() => {
                  setSearchQuery('');
                  setSubFilter('ALL DEALS');
                  toast.success('Viewing all today\'s hot deals!');
                }}
                className="w-full mt-6 py-3 bg-[#0B0C23] hover:bg-[#FF5B00] text-white font-black rounded-xl text-[11px] uppercase tracking-widest transition-all duration-300 shadow-sm cursor-pointer border-0"
              >
                VIEW ALL HOT DEALS
              </button>

            </div>
          </div>

        </div>
      </section>

      {/* 6. Trust Badges Row */}
      <section className="max-w-[1440px] mx-auto w-full px-4 md:px-10 mb-10 shrink-0">
        <div className="bg-white border border-gray-200/80 rounded-2xl py-5 px-6 shadow-xs">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6 items-center divide-y md:divide-y-0 md:divide-x divide-gray-100">
            {[
              { title: '100% Authentic', sub: 'Verified products & sellers', icon: ShieldCheck, color: 'text-blue-500 bg-blue-50' },
              { title: 'Best Price Guarantee', sub: 'We beat any lower price', icon: Award, color: 'text-[#FF5B00] bg-orange-50' },
              { title: 'Easy Returns', sub: '7-day return policy', icon: RotateCcw, color: 'text-teal-500 bg-teal-50' },
              { title: 'Secure Payments', sub: '100% secure checkout', icon: Lock, color: 'text-purple-500 bg-purple-50' },
              { title: '24/7 Support', sub: "We're here to help", icon: Clock, color: 'text-rose-500 bg-rose-50' }
            ].map((guarantee, idx) => {
              const GuaranteeIcon = guarantee.icon;
              return (
                <div key={idx} className="flex items-center gap-3.5 px-4 first:pl-0 last:pr-0 pt-4 md:pt-0">
                  <div className={`w-9 h-9 rounded-full ${guarantee.color} flex items-center justify-center shrink-0`}>
                    <GuaranteeIcon className="w-4.5 h-4.5" />
                  </div>
                  <div className="text-left min-w-0">
                    <h4 className="text-xs font-black text-[#0E0F23] tracking-tight leading-none">
                      {guarantee.title}
                    </h4>
                    <p className="text-[10px] text-gray-400 font-semibold mt-1 leading-tight truncate">
                      {guarantee.sub}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 7. Popular Deal Searches Row */}
      <section className="max-w-[1440px] mx-auto w-full px-4 md:px-10 mb-10 shrink-0 text-left">
        <h4 className="text-sm font-black text-[#0E0F23] uppercase tracking-wider mb-4">
          Popular deal searches
        </h4>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-2.5">
            {[
              'Samsung',
              'iPhone 15',
              'MacBook Air M3',
              'Sony Headphones',
              'Running Shoes',
              'Smart Watch',
              'Walton Fridge',
              'Best Deals'
            ].map((term) => (
              <button
                key={term}
                onClick={() => handlePopularSearch(term)}
                className="h-9 px-4.5 bg-white hover:bg-[#FF5B00]/5 border border-gray-200 hover:border-[#FF5B00]/30 rounded-full text-xs font-bold text-gray-600 hover:text-[#FF5B00] flex items-center gap-2 transition-all cursor-pointer shadow-2xs"
              >
                <Search className="w-3.5 h-3.5 text-gray-400" />
                <span>{term}</span>
              </button>
            ))}
          </div>

          <button 
            onClick={() => {
              setSearchQuery('');
              toast.success('Viewing all available deal search categories!');
            }}
            className="text-xs font-black text-[#FF5B00] hover:text-[#E8500A] transition-colors uppercase tracking-widest flex items-center gap-1.5"
          >
            <span>View all</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </section>

      {/* 8. Split Bottom Row: Featured Brand Deals & Newsletter signup */}
      <section className="max-w-[1440px] mx-auto w-full px-4 md:px-10 mb-10 text-left">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Column A: Featured Brand Deals */}
          <div className="lg:col-span-8 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-5 border-b border-gray-100 pb-3">
                <div>
                  <h3 className="text-xl font-black text-[#0E0F23] uppercase tracking-tight">
                    Featured Brand Deals
                  </h3>
                  <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">
                    Curated premium partner offers &bull; Limited time
                  </p>
                </div>
              </div>

              {/* Grid of 3 brand deal cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                {[
                  { name: 'SAMSUNG', logoText: 'S', discount: 'Up to 40% off' },
                  { name: 'APPLE', logoText: 'A', discount: 'Up to 30% off' },
                  { name: 'APEX', logoText: 'Ap', discount: 'Up to 40% off' }
                ].map((brand, idx) => (
                  <div
                    key={idx}
                    onClick={() => {
                      setSearchQuery(brand.name);
                      toast.success(`Highlighting Brand Partner: ${brand.name}`);
                    }}
                    className="bg-white rounded-2xl border border-gray-200/80 p-6 flex flex-col items-center justify-center text-center gap-4 hover:shadow-md hover:border-[#FF5B00]/30 transition-all duration-300 cursor-pointer group relative overflow-hidden"
                  >
                    {/* Glowing effect inside brand card */}
                    <div className="absolute top-0 right-0 w-28 h-28 bg-[#FF5B00]/3 rounded-full -translate-y-1/2 translate-x-1/2 blur-xl group-hover:scale-125 transition-transform duration-500" />

                    {/* Logo Avatar Icon inside Circle */}
                    <div className="w-16 h-16 rounded-full bg-gray-50 flex items-center justify-center text-[#0E0F23] font-black text-xl border border-gray-150 shrink-0 relative z-10">
                      {brand.logoText}
                    </div>

                    <div className="flex flex-col items-center gap-1.5 relative z-10">
                      <h4 className="text-sm font-black text-[#0E0F23] uppercase tracking-wider group-hover:text-[#FF5B00] transition-colors">
                        {brand.name}
                      </h4>
                      <span className="bg-[#FF5B00] text-white text-[9px] font-black tracking-widest px-2.5 py-1 rounded uppercase">
                        {brand.discount}
                      </span>
                    </div>

                    {/* Horizontal Divider */}
                    <div className="w-full h-px bg-gray-100 my-2 relative z-10" />

                    {/* CTA Link */}
                    <span className="flex items-center gap-1.5 text-[10px] font-black text-[#0E0F23] uppercase tracking-widest group-hover:text-[#FF5B00] transition-all relative z-10">
                      GRAB THIS DEAL 
                      <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Column B: Newsletter signup */}
          <div className="lg:col-span-4 flex">
            <div className="bg-[#100A2E] bg-gradient-to-br from-[#100A2E] to-[#1F0C42] border border-white/5 rounded-3xl p-6 flex flex-col justify-between w-full h-full relative overflow-hidden text-left shadow-lg">
              
              {/* Background accent spot */}
              <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-[#FF5B00]/15 rounded-full blur-2xl pointer-events-none" />

              <div>
                <h3 className="text-2xl font-black text-white leading-none uppercase tracking-tight">
                  Never miss a deal!
                </h3>
                <p className="text-[12px] text-gray-300 font-medium mt-3 leading-relaxed">
                  Subscribe and get top deals straight to your inbox.
                </p>

                {/* Newsletter Input */}
                <form onSubmit={handleNewsletterSubmit} className="mt-6">
                  <div className="relative w-full">
                    <input 
                      type="email" 
                      value={newsletterEmail}
                      onChange={(e) => setNewsletterEmail(e.target.value)}
                      placeholder="Enter your email" 
                      className="w-full h-11 pl-4 pr-28 bg-white/5 border border-white/10 rounded-xl text-xs font-bold text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-[#FF5B00]/50 transition-all"
                    />
                    <button 
                      type="submit"
                      className="absolute right-1 top-1 bottom-1 px-4.5 bg-[#FF5B00] hover:bg-[#E8500A] text-white text-[10px] font-black uppercase tracking-wider rounded-lg flex items-center justify-center transition-colors cursor-pointer border-0"
                    >
                      SUBSCRIBE
                    </button>
                  </div>
                </form>
              </div>

              {/* Sub-footer detail */}
              <div className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest mt-6 border-t border-white/5 pt-4">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                <span>Join 20,000+ smart shoppers</span>
              </div>

            </div>
          </div>

        </div>
      </section>

    </div>
  );
}
