import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Search, ShoppingCart, MessageSquare, Bookmark, ChevronDown, ChevronRight, 
  ChevronLeft, Award, ShoppingBag, Check, ArrowUpRight, Heart, Eye, Share2, 
  Play, ShieldCheck, DollarSign, Star, AlertCircle, PenTool, Award as Trophy,
  Shirt, Smartphone, Gem, Gamepad2, Monitor, Utensils, Cpu, Tv, Home, Baby,
  Palette, Luggage,
  Flame, Sparkles, Send, Users, ShieldAlert, BadgeCheck, Zap, Clock
} from 'lucide-react';
import { ProductCard } from '../components/ProductCard';
import { PRODUCTS, BRANDS, BLOGS } from '../constants';
import { useGlobalState } from '../context/GlobalStateContext';
import { useDashboard } from '../context/DashboardContext';
import toast from 'react-hot-toast';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';

interface CarouselBrandMeta {
  id: number;
  name: string;
  category: string;
  image: string;
}

const CAROUSEL_BRANDS: CarouselBrandMeta[] = [
  {
    id: 3, // Apex
    name: "Apex",
    category: "Best Shoes",
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=1200&q=80"
  },
  {
    id: 7, // La Reve
    name: "Le Reve",
    category: "Clothing & Lifestyle",
    image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1200&q=80"
  },
  {
    id: 8, // Perfume World
    name: "Perfume World",
    category: "Best Perfume",
    image: "https://images.unsplash.com/photo-1541643600914-78b084683601?w=1200&q=80"
  },
  {
    id: 1, // Samsung
    name: "Samsung",
    category: "Mobile & Wearables",
    image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=1200&q=80"
  }
];

// Helper to map category names to Lucide icons
const getCategoryIcon = (category: string) => {
  const c = category.toLowerCase();
  if (c.includes('fashion') || c.includes('clothing')) return <Shirt className="w-5 h-5 text-[#E8500A]" />;
  if (c.includes('tech') || c.includes('electronic') || c.includes('cpu')) return <Cpu className="w-5 h-5 text-emerald-500" />;
  if (c.includes('mobile') || c.includes('phone') || c.includes('wearable')) return <Smartphone className="w-5 h-5 text-purple-500" />;
  if (c.includes('food') || c.includes('rest')) return <Utensils className="w-5 h-5 text-rose-500" />;
  if (c.includes('home') || c.includes('living')) return <Home className="w-5 h-5 text-sky-500" />;
  if (c.includes('baby') || c.includes('kid')) return <Baby className="w-5 h-5 text-pink-500" />;
  if (c.includes('gaming')) return <Gamepad2 className="w-5 h-5 text-cyan-500" />;
  return <ShoppingBag className="w-5 h-5 text-gray-500" />;
};

export function HomePage() {
  const navigate = useNavigate();
  const { allProducts, allBrands, mode, addToCart } = useGlobalState();
  const { savedProducts, setSavedProducts, addToCompare } = useDashboard();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('FEED');
  const [carouselIndex, setCarouselIndex] = useState(1);
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [showAllFollowed, setShowAllFollowed] = useState(false);

  // Recommendations Reactions State
  const [recommendationStates, setRecommendationStates] = useState({
    featured: { liked: false, likes: 12000, views: 1200, shares: 450, bookmarked: false },
    card1: { liked: false, likes: 12000, views: 1200, shares: 480, bookmarked: false },
    card2: { liked: false, likes: 12000, views: 1200, shares: 450, bookmarked: false },
    card3: { liked: false, likes: 12000, views: 1200, shares: 480, bookmarked: false },
  });

  const handleRecLike = (cardId: 'featured' | 'card1' | 'card2' | 'card3') => {
    setRecommendationStates(prev => {
      const card = prev[cardId];
      const nextLiked = !card.liked;
      return {
        ...prev,
        [cardId]: {
          ...card,
          liked: nextLiked,
          likes: nextLiked ? card.likes + 1 : card.likes - 1
        }
      };
    });
    toast.success(recommendationStates[cardId].liked ? "Removed love rating" : "Loved recommendation!");
  };

  const handleRecBookmark = (cardId: 'featured' | 'card1' | 'card2' | 'card3') => {
    setRecommendationStates(prev => {
      const card = prev[cardId];
      const nextBookmarked = !card.bookmarked;
      return {
        ...prev,
        [cardId]: {
          ...card,
          bookmarked: nextBookmarked
        }
      };
    });
    toast.success(recommendationStates[cardId].bookmarked ? "Removed from saved items" : "Added to saved items!");
  };

  const handleRecView = (cardId: 'featured' | 'card1' | 'card2' | 'card3') => {
    setRecommendationStates(prev => {
      const card = prev[cardId];
      return {
        ...prev,
        [cardId]: {
          ...card,
          views: card.views + 1
        }
      };
    });
    toast.success("Article recommendation marked as read!");
  };

  const handleRecShare = (cardId: 'featured' | 'card1' | 'card2' | 'card3') => {
    setRecommendationStates(prev => {
      const card = prev[cardId];
      return {
        ...prev,
        [cardId]: {
          ...card,
          shares: card.shares + 1
        }
      };
    });
    toast.success("Link copied to clipboard!");
  };

  // Spotlight Reactions State
  const [spotlightStates, setSpotlightStates] = useState({
    liked: false,
    likes: 12000,
    views: 1200,
    shares: 450
  });

  const handleSpotlightAction = (type: 'likes' | 'views' | 'shares') => {
    setSpotlightStates(prev => {
      if (type === 'likes') {
        const nextLiked = !prev.liked;
        return {
          ...prev,
          liked: nextLiked,
          likes: nextLiked ? prev.likes + 1 : prev.likes - 1
        };
      } else if (type === 'views') {
        return {
          ...prev,
          views: prev.views + 1
        };
      } else {
        return {
          ...prev,
          shares: prev.shares + 1
        };
      }
    });
    if (type === 'likes') {
      toast.success(spotlightStates.liked ? "Removed brand love" : "Loved brand spotlight!");
    } else if (type === 'views') {
      toast.success("Spotlight brand flagged as viewed!");
    } else {
      toast.success("Spotlight copied to clipboard!");
    }
  };

  // Spotlight Product reactions states for the 4 products inside Spotlight Brand
  const [spotlightProductStates, setSpotlightProductStates] = useState<Record<string, { likes: number, views: number, shares: number, liked: boolean }>>({
    'p1': { likes: 12000, views: 1200, shares: 450, liked: false },
    'p2': { likes: 12000, views: 1200, shares: 450, liked: false },
    'p3': { likes: 12000, views: 1200, shares: 450, liked: false },
    'p4': { likes: 12000, views: 1200, shares: 450, liked: false },
  });

  const handleSpotlightProductReact = (pId: string, type: 'likes' | 'views' | 'shares') => {
    setSpotlightProductStates(prev => {
      const current = prev[pId] || { likes: 12000, views: 1200, shares: 450, liked: false };
      if (type === 'likes') {
        const nextLiked = !current.liked;
        return {
          ...prev,
          [pId]: {
            ...current,
            liked: nextLiked,
            likes: nextLiked ? current.likes + 1 : current.likes - 1
          }
        };
      } else if (type === 'views') {
        return {
          ...prev,
          [pId]: {
            ...current,
            views: current.views + 1
          }
        };
      } else {
        return {
          ...prev,
          [pId]: {
            ...current,
            shares: current.shares + 1
          }
        };
      }
    });
    toast.success(type === 'likes' ? "Added love rating to product!" : type === 'views' ? "Product view logged!" : "Product link copied!");
  };

  // Categories definitions
  const categoryTabs = [
    { id: 'FEED', emoji: '🏠', label: 'FEED' },
    { id: 'Fashion & Lifestyle', emoji: '👗', label: 'FASHION & LIFESTYLE' },
    { id: 'Mobile & Phones', emoji: '📱', label: 'MOBILE & WEARABLES' },
    { id: 'Jewelry & Accessories', emoji: '👁', label: 'EYE WEAR & FRAGRANCES' },
    { id: 'Food & Restaurants', emoji: '🍔', label: 'FOOD & RESTAURANTS' },
    { id: 'Baby & Maternity', emoji: '👨‍👩‍👧', label: 'FAMILY & KIDS' },
  ];

  // Followed Brands initial data-mock
  const initialFollowedBrands = [
    { name: 'Aarong', desc: 'Traditional Handcrafted Products', avatar: 'AA', bg: 'bg-[#5B2E15]', brandId: 10 },
    { name: 'Adidas', desc: 'Premium Athletic Wear', avatar: 'AD', bg: 'bg-[#000000]', brandId: 4 },
    { name: 'Coca-Cola', desc: 'Refreshing Quality Beverages', avatar: 'CC', bg: 'bg-[#E61C24]', brandId: 2 },
    { name: 'Starbucks', desc: 'Premium Coffee Blends', avatar: 'SB', bg: 'bg-[#006241]', brandId: 1 },
    { name: 'Yellow', desc: 'Modern Apparel & Fashion', avatar: 'YL', bg: 'bg-[#F2CD13]', brandId: 11 },
    { name: 'Bata Shoes', desc: 'Premium Class Footwear', avatar: 'BT', bg: 'bg-[#D2141F]', brandId: 4 }
  ];

  const visibleFollowedBrands = showAllFollowed 
    ? initialFollowedBrands 
    : initialFollowedBrands.slice(0, 3);

  // Search Submission
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      toast.error('Please specify what brand/type you seek!');
      return;
    }
    toast.success(`Scouting verified stores for: "${searchQuery}"`);
    navigate(`/products?q=${encodeURIComponent(searchQuery)}`);
  };

  // Newsletter subscription
  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail.trim()) {
      toast.error('Please specify your email!');
      return;
    }
    toast.success('Your subscription is complete! Welcome to Choosify.bd newsletter.');
    setNewsletterEmail('');
  };

  // Trending brands slider helper
  const rightBrandsList = allBrands && allBrands.length > 0 ? allBrands : BRANDS;
  const popularBrands = rightBrandsList.slice(0, 6);

  // Products filters based on context & states
  const rightProductsList = allProducts && allProducts.length > 0 ? allProducts : PRODUCTS;
  const filteredProducts = activeTab === 'FEED' 
    ? rightProductsList 
    : rightProductsList.filter((p: any) => p.category?.toLowerCase() === activeTab.toLowerCase());

  // Sailor is the Spotlight Brand (Brand ID: default or 3)
  const sailorProductList = rightProductsList.filter((p: any) => p.brand?.toLowerCase() === 'sailor' || p.category?.toLowerCase() === 'fashion & lifestyle').slice(0, 4);

  // Deals Sidebar calculations (with discount tags)
  const dealsProducts = rightProductsList.filter((p: any) => p.originalPrice || p.discount).slice(0, 4);

  // Blog list for recommendations
  const featuredBlog = BLOGS.find(b => b.id === 2) || BLOGS[1];
  const sideGuides = BLOGS.filter(b => b.id !== 2).slice(0, 3);

  // Quick categories
  const popularCategoriesMock = [
    { name: "Fashion & Lifestyle", count: "50 Products . 10 Brands", id: 'Fashion & Lifestyle' },
    { name: "Tech & Electronics", count: "50 Products . 10 Brands", id: 'Mobile & Phones' },
    { name: "Family & Kids", count: "50 Products . 10 Brands", id: 'Fashion & Lifestyle' },
    { name: "Jewelry & Accessories", count: "50 Products . 10 Brands", id: 'Jewelry & Accessories' },
    { name: "Hobbies & Creativity", count: "50 Products . 10 Brands", id: 'Jewelry & Accessories' },
    { name: "Travel & Hospitality", count: "50 Products . 10 Brands", id: 'Food & Restaurants' },
  ];

  return (
    <div className="bg-[#EEF1F8] min-h-screen text-[#1A1D4E] antialiased pb-16 font-sans overflow-x-clip">
      
      {/* SECTION 2 — HERO BANNER */}
      <section className="relative bg-gradient-to-br from-[#0B0D26] via-[#10133A] to-[#1F1746] text-white overflow-hidden py-24 px-6 shadow-inner-lg">
        {/* Luminous dynamic background accents */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(232,80,10,0.18)_0%,_transparent_55%)] pointer-events-none" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#EEF1F8]/10 to-transparent pointer-events-none" />
        
        {/* Subtle grid pattern helper */}
        <div className="absolute inset-0 opacity-5 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '24px 24px' }} />

        <div className="max-w-5xl mx-auto text-center relative z-10 flex flex-col items-center">
          
          {/* Tagline Badge */}
          <div className="inline-flex items-center gap-2.5 px-4.5 py-2 bg-white/5 backdrop-blur-md border border-white/10 rounded-full text-[10.5px] tracking-widest text-[#E8500A] font-extrabold uppercase mb-8 shadow-glow hover:border-white/25 transition-all duration-300">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
            <span className="font-space">Bangladesh's #1 Premium Brand Discovery Shield</span>
          </div>

          {/* Main Typography Header Section */}
          <h1 className="font-space font-extrabold text-[#FFFFFF] text-5xl sm:text-6xl md:text-7xl leading-[1] tracking-tight uppercase mb-6 max-w-4xl max-w-none">
            Choose, Verify & Shop <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF5B00] via-[#E8500A] to-[#FF8C3A] italic font-black">
              100% Original
            </span> Brands
          </h1>

          {/* Supporting Text */}
          <p className="text-sm sm:text-base text-gray-300 max-w-2xl mx-auto font-medium mb-12 leading-relaxed opacity-95">
            Weary of online counter-feiting and merchant fraud? Choosify.bd empowers your daily shopping with state-of-the-art independent brand verification systems in Bangladesh.
          </p>

          {/* Glassmorphic Search Container */}
          <form onSubmit={handleSearchSubmit} className="relative w-full max-w-3xl mx-auto bg-white/10 backdrop-blur-md p-2 rounded-full border border-white/10 shadow-[0_30px_60px_rgba(11,13,38,0.5)] focus-within:border-white/20 transition-all duration-300 mb-6">
            <div className="flex items-center">
              <div className="pl-6 text-[#E8500A] shrink-0">
                <Search className="w-5 h-5" />
              </div>
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search authentic Fashion hubs, Smart Gadgets & verified outlets..." 
                className="w-full h-14 bg-transparent outline-none pl-4 pr-32 text-white text-base font-semibold placeholder-gray-400 focus:outline-none focus:ring-0 border-none" 
              />
              <button 
                type="submit"
                className="absolute right-2 top-2 bottom-2 px-8 rounded-full bg-gradient-to-r from-[#FF5B00] to-[#E8500A] hover:from-[#E8500A] hover:to-[#CF4400] text-white text-xs font-black tracking-widest uppercase flex items-center gap-2 shadow-lg hover:scale-[1.03] active:scale-[0.98] transition-all duration-200"
              >
                DISCOVER NOW
              </button>
            </div>
          </form>

          {/* Quick Shortcuts / Suggested */}
          <div className="flex flex-wrap items-center justify-center gap-3 text-xs text-gray-400 font-semibold mb-12">
            <span className="font-mono text-gray-500 uppercase tracking-wider text-[10px]">Hot Targets:</span>
            {['Sailor', 'Aarong', 'Yellow', 'Apex', 'Bata'].map((term) => (
              <button
                key={term}
                type="button"
                onClick={() => {
                  setSearchQuery(term);
                  toast.success(`Scouting verified stores for: "${term}"`);
                  navigate(`/products?q=${encodeURIComponent(term)}`);
                }}
                className="px-3 py-1 bg-white/5 hover:bg-white/10 text-gray-300 rounded-full border border-white/5 hover:border-white/10 transition-all cursor-pointer text-[11px]"
              >
                #{term}
              </button>
            ))}
          </div>

          {/* Majestic Metrics Deck */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 w-full max-w-4xl border-t border-white/10 pt-10">
            {[
              { label: 'Verified Brands', val: '500+', desc: 'Strict Quality Shield' },
              { label: 'Authentic Products', val: '14K+', desc: 'Direct Warranty Lines' },
              { label: 'Decisive Matches', val: '3M+', desc: 'Anti-Scam Shopping' },
              { label: 'Protection Rating', val: '99%', desc: 'Verified Outlets Status' },
            ].map((stat, sidx) => (
              <div key={sidx} className="flex flex-col items-center">
                <span className="font-space text-3xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-100 to-[#FF8C3A] leading-none tracking-tight">
                  {stat.val}
                </span>
                <span className="font-space text-[10px] font-extrabold text-[#E8500A] uppercase tracking-widest mt-2">{stat.label}</span>
                <span className="text-[9px] text-gray-500 font-mono mt-0.5">{stat.desc}</span>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* SECTION 3 — MARQUEE BANNER */}
      <div className="relative z-20 bg-gradient-to-r from-[#E8500A] via-[#FF5B00] to-[#E8500A] text-white py-4.5 overflow-hidden border-y border-[#CF4400]/40 shadow-lg font-space text-[11.5px] font-black tracking-[0.2em] uppercase leading-none">
        <div className="flex w-max animate-marquee whitespace-nowrap gap-16">
          <span>🛡️ 100% ORIGINAL PRODUCTS ONLY • VERIFIED SHOPS IN BANGLADESH • CHOOSE WISELY 🛡️</span>
          <span>💎 AUTHENTIC OUTLETS DIRECTORY • NO MORE ONLINE SCAMS • SHOP WITH CONFIDENCE 💎</span>
          <span>🛡️ 100% ORIGINAL PRODUCTS ONLY • VERIFIED SHOPS IN BANGLADESH • CHOOSE WISELY 🛡️</span>
        </div>
      </div>

      {/* SECTION 4 — THREE COLUMN GRID */}
      <main className="max-w-[1440px] mx-auto px-6 py-10 w-full grid grid-cols-1 lg:grid-cols-[280px_minmax(0,1fr)] xl:grid-cols-[280px_minmax(0,1fr)_310px] gap-8 relative">
        
        {/* LEFT STICKY SIDEBAR */}
        <aside className="hidden lg:flex flex-col gap-6 sticky top-24 h-[calc(100vh-120px)] overflow-y-auto no-scrollbar pb-6 flex-shrink-0">
          
          {/* USER PROFILE */}
          <div className="flex flex-col gap-4 mb-2">
            <h2 className="text-xl font-black italic tracking-wide text-left uppercase">
              <span className="text-[#1A1D4E]">YOUR</span> <span className="text-[#E8500A]">PROFILE</span>
            </h2>

            <div className="space-y-3.5">
              {/* Profile Card */}
              <div className="bg-white rounded-[20px] border border-gray-100 p-5 flex items-center gap-4.5 shadow-[0_8px_30px_rgba(26,29,78,0.02)]">
                <img 
                  src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&h=120&fit=crop" 
                  className="w-14 h-14 rounded-full border border-gray-100 object-cover shrink-0 shadow-sm" 
                  alt="Farhan Bin Rafiq" 
                />
                <h3 className="font-space font-black italic text-[#1A1D4E] uppercase tracking-tight text-[15px] leading-tight">
                  FARHAN BIN RAFIQ
                </h3>
              </div>

              {/* My Orders Card */}
              <Link 
                to="/dashboard" 
                className="bg-white rounded-[20px] border border-gray-100 p-4 px-5 flex items-center justify-between shadow-[0_8px_30px_rgba(26,29,78,0.02)] hover:border-[#E8500A]/25 hover:shadow-[0_12px_40px_rgba(26,29,78,0.05)] transition-all duration-300 group"
              >
                <div className="flex items-center gap-4.5">
                  <div className="w-12 h-12 rounded-full border border-gray-100 flex items-center justify-center bg-white shadow-inner shrink-0 leading-none">
                    <ShoppingCart className="w-5 h-5 text-[#E8500A] group-hover:scale-110 transition-transform" />
                  </div>
                  <span className="font-space font-black italic text-[#1A1D4E] uppercase tracking-wider text-xs">
                    MY ORDERS
                  </span>
                </div>
                <span className="bg-[#EEF1F8] text-[#1A1D4E]/80 font-mono text-[10px] font-bold px-3 py-1 rounded-full shrink-0 shadow-sm">
                  35
                </span>
              </Link>

              {/* Messages Card */}
              <Link 
                to="/messages" 
                className="bg-white rounded-[20px] border border-gray-100 p-4 px-5 flex items-center justify-between shadow-[0_8px_30px_rgba(26,29,78,0.02)] hover:border-[#E8500A]/25 hover:shadow-[0_12px_40px_rgba(26,29,78,0.05)] transition-all duration-300 group"
              >
                <div className="flex items-center gap-4.5">
                  <div className="w-12 h-12 rounded-full border border-gray-100 flex items-center justify-center bg-white shadow-inner shrink-0 leading-none">
                    <MessageSquare className="w-5 h-5 text-[#E8500A] group-hover:scale-110 transition-transform" />
                  </div>
                  <span className="font-space font-black italic text-[#1A1D4E] uppercase tracking-wider text-xs">
                    MESSAGES
                  </span>
                </div>
                <span className="bg-[#EEF1F8] text-[#1A1D4E]/80 font-mono text-[10px] font-bold px-3 py-1 rounded-full shrink-0 shadow-sm">
                  20
                </span>
              </Link>

              {/* Saved Items Card */}
              <Link 
                to="/dashboard" 
                className="bg-white rounded-[20px] border border-gray-100 p-4 px-5 flex items-center justify-between shadow-[0_8px_30px_rgba(26,29,78,0.02)] hover:border-[#E8500A]/25 hover:shadow-[0_12px_40px_rgba(26,29,78,0.05)] transition-all duration-300 group"
              >
                <div className="flex items-center gap-4.5">
                  <div className="w-12 h-12 rounded-full border border-gray-100 flex items-center justify-center bg-white shadow-inner shrink-0 leading-none">
                    <Bookmark className="w-5 h-5 text-[#E8500A] group-hover:scale-110 transition-transform" />
                  </div>
                  <span className="font-space font-black italic text-[#1A1D4E] uppercase tracking-wider text-xs">
                    SAVED ITEMS
                  </span>
                </div>
                <span className="bg-[#EEF1F8] text-[#1A1D4E]/80 font-mono text-[10px] font-bold px-3 py-1 rounded-full shrink-0 shadow-sm">
                  550
                </span>
              </Link>

              {/* Recently Viewed Card */}
              <Link 
                to="/dashboard" 
                className="bg-white rounded-[20px] border border-gray-100 p-4 px-5 flex items-center justify-between shadow-[0_8px_30px_rgba(26,29,78,0.02)] hover:border-[#E8500A]/25 hover:shadow-[0_12px_40px_rgba(26,29,78,0.05)] transition-all duration-300 group"
              >
                <div className="flex items-center gap-4.5">
                  <div className="w-12 h-12 rounded-full border border-gray-100 flex items-center justify-center bg-white shadow-inner shrink-0 leading-none">
                    <Clock className="w-5 h-5 text-[#E8500A] group-hover:scale-110 transition-transform" />
                  </div>
                  <span className="font-space font-black italic text-[#1A1D4E] uppercase tracking-wider text-xs">
                    RECENTLY VIEWED
                  </span>
                </div>
                <span className="bg-[#EEF1F8] text-[#1A1D4E]/80 font-mono text-[10px] font-bold px-3 py-1 rounded-full shrink-0 shadow-sm">
                  15
                </span>
              </Link>
            </div>
          </div>

          {/* QUICK ACCESS */}
          <div className="bg-white rounded-[24px] border border-gray-100/95 p-5.5 shadow-[0_10px_30px_rgba(26,29,78,0.02)]">
            <h3 className="text-[9.5px] font-black tracking-widest text-[#1A1D4E]/30 uppercase mb-4.5 italic text-left">QUICK HIGHWAYS</h3>
            <div className="space-y-1.5 font-bold text-xs text-[#1A1D4E] text-left">
              {[
                { to: '/products', icon: <Award className="w-4 h-4 text-[#E8500A]" />, label: 'ALL PRODUCTS' },
                { to: '/brands', icon: <Trophy className="w-4 h-4 text-[#E8500A]" />, label: 'ALL BRANDS' },
                { to: '/guides', icon: <MessageSquare className="w-4 h-4 text-[#E8500A]" />, label: 'RECOMMENDATIONS' },
                { to: '/compare', icon: <Award className="w-4 h-4 text-[#E8500A]" />, label: 'COMPARE PORTAL' },
                { to: '/deals', icon: <Award className="w-4 h-4 text-[#E8500A]" />, label: 'LIVE DEALS' },
              ].map((link, lidx) => (
                <Link 
                  key={lidx} 
                  to={link.to} 
                  className="flex items-center gap-3 p-3 rounded-xl hover:bg-[#FFF0E8] hover:text-[#CF4400] border border-transparent hover:border-[#E8500A]/10 transition-all duration-200"
                >
                  {link.icon}
                  <span className="font-space font-extrabold tracking-wider">{link.label}</span>
                </Link>
              ))}
            </div>
          </div>

          {/* BRANDS FOLLOWED */}
          <div className="bg-white rounded-[24px] border border-gray-100 p-5.5 shadow-[0_10px_30px_rgba(26,29,78,0.02)]">
            <div className="flex items-center justify-between mb-4.5">
              <h3 className="text-[9.5px] font-black tracking-widest text-[#1A1D4E]/30 uppercase italic text-left">Brands You Follow</h3>
              <span className="text-[8.5px] font-black text-[#E8500A] uppercase italic tracking-wider bg-[#FFF0E8] px-2.5 py-1 rounded-full leading-none shadow-sm">{initialFollowedBrands.length} Active</span>
            </div>
            
            <div className="space-y-3">
              {visibleFollowedBrands.map((b, i) => (
                <div 
                  key={i} 
                  onClick={() => navigate(`/brands/${b.brandId}`)}
                  className="flex items-center gap-3.5 p-2 rounded-xl hover:bg-gray-50 border border-transparent hover:border-gray-100 transition-all duration-300 cursor-pointer text-left"
                >
                  <div className={`w-9 h-9 rounded-full ${b.bg} text-white font-black flex items-center justify-center text-xs shadow-md border-2 border-white outline outline-1 outline-gray-200 shrink-0`}>
                    {b.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-black text-[#1A1D4E] truncate leading-tight uppercase italic tracking-tight">{b.name}</p>
                    <p className="text-[9.5px] text-gray-400 font-bold truncate mt-0.5">{b.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <button 
              onClick={() => setShowAllFollowed(!showAllFollowed)} 
              className="w-full text-center text-[10px] font-black text-[#E8500A] hover:text-[#CF4400] uppercase tracking-widest mt-5.5 flex items-center justify-center gap-1.5 leading-none hover:scale-[1.02] transition-transform"
            >
              {showAllFollowed ? 'Collapse List' : 'Expand All'} 
              <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-300 ${showAllFollowed ? 'rotate-180' : ''}`} />
            </button>
          </div>

        </aside>

        {/* CENTER FEED */}
        <section className="flex flex-col gap-8 w-full min-w-0">
          
          {/* Categories Tab Bar */}
          <div className="bg-white/80 backdrop-blur-md rounded-2xl border border-gray-100/80 p-3 shadow-[0_8px_30px_rgba(26,29,78,0.02)] select-none relative z-40 sticky top-20">
            <div className="flex items-center gap-3 overflow-x-auto no-scrollbar scroll-smooth">
              {categoryTabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id);
                    toast.success(`Loading verification grid for: ${tab.id}`);
                  }}
                  className={`flex items-center gap-2 px-5 py-3 rounded-full text-[10.5px] font-black tracking-widest whitespace-nowrap uppercase leading-none border transition-all duration-300 ${
                    activeTab === tab.id 
                      ? 'bg-gradient-to-r from-[#FF5B00] to-[#E8500A] border-[#E8500A] text-white shadow-lg shadow-orange-primary/10' 
                      : 'bg-gray-50/50 border-gray-100 text-[#1A1D4E]/80 hover:bg-[#EEF1F8]/80 hover:text-[#1A1D4E]'
                  }`}
                >
                  <span className="text-sm leading-none">{tab.emoji}</span> {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* MAIN FEED CONTENT PORTAL */}
          {activeTab === 'FEED' ? (
            <>
              {/* FEED SECTION A — TRENDING BRANDS */}
              <div id="section-trending-brands" className="bg-white rounded-3xl border border-gray-100/90 p-6 md:p-8 shadow-[0_15px_40px_rgba(26,29,78,0.02)]">
                <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between border-b border-gray-100 pb-5 mb-6 gap-4">
                  <div className="text-left">
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="font-space text-xl sm:text-2xl font-black uppercase tracking-tight text-[#1A1D4E]">Trending</span>
                      <span className="font-space text-xl sm:text-2xl font-black uppercase tracking-tight text-[#E8500A] italic">Brands</span>
                    </div>
                    <p className="text-xs text-gray-400 font-semibold pl-3 border-l-2 border-[#E8500A] leading-tight">
                      Connect with thousands of authentic shopper tests and verify brand credentials today.
                    </p>
                  </div>
                  <Link to="/brands" className="text-[10px] font-black text-[#E8500A] hover:text-[#CF4400] uppercase tracking-widest shrink-0 flex items-center gap-1.5 leading-none bg-[#FFF0E8] px-4.5 py-2.5 rounded-full border border-[#E8500A]/10 hover:border-[#E8500A]/30 hover:scale-105 transition-all">
                    View All Brands <Search className="w-3.5 h-3.5" />
                  </Link>
                </div>

                {/* Interactive Brands sliding carousel */}
                <div className="flex items-center justify-center gap-3 md:gap-4 overflow-hidden" style={{ height: '458.656px' }}>
                  {CAROUSEL_BRANDS.map((brand, i) => {
                    const isActive = i === carouselIndex;
                    
                    return (
                      <motion.div
                        key={brand.id}
                        onClick={() => {
                          if (isActive) {
                            navigate(`/brands/${brand.id}`);
                          } else {
                            setCarouselIndex(i);
                          }
                        }}
                        initial={false}
                        animate={{
                          width: isActive ? '55%' : '15%',
                          flex: isActive ? 5 : 1,
                          opacity: isActive ? 1 : 0.8,
                        }}
                        transition={{
                          type: "spring",
                          stiffness: 100,
                          damping: 18
                        }}
                        style={{ height: '458.656px' }}
                        className={cn(
                          "relative w-full rounded-[22px] overflow-hidden cursor-pointer group select-none border border-gray-100",
                          !isActive && "hidden md:block" // Hide side cards on mobile to focus on active
                        )}
                      >
                        {/* Background Image */}
                        <img 
                          src={brand.image} 
                          className="w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-105"
                          alt={brand.name}
                        />
                        <div className={cn(
                           "absolute inset-0 transition-opacity duration-700",
                           isActive ? "bg-gradient-to-t from-black/85 via-black/30 to-transparent" : "bg-black/30"
                        )} />

                        {/* Content for Inactive (Horizontal matching label at bottom) */}
                        {!isActive && (
                           <div className="absolute inset-x-0 bottom-4 flex justify-center text-center px-2">
                              <span className="text-white/95 text-[9.5px] font-black uppercase tracking-wider bg-black/45 backdrop-blur-md px-3 py-1.5 rounded-full truncate max-w-full italic font-space border border-white/5">
                                 {brand.name} | {brand.category.substring(0, 10)}...
                              </span>
                           </div>
                        )}

                        {/* Content for Active Card */}
                        {isActive && (
                          <motion.div 
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.15 }}
                            className="absolute inset-0 p-5 md:p-7 flex flex-col justify-end items-start text-left"
                          >
                            <div className="flex items-center gap-1.5 mb-3 bg-black/45 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10">
                               <div className="w-5 h-5 rounded-full bg-[#E8500A] flex items-center justify-center text-white shadow-md">
                                  <Flame size={10} className="fill-current text-white" />
                               </div>
                               <span className="text-[8.5px] font-black text-white uppercase tracking-wider font-space">TOP VERIFIED</span>
                            </div>

                            <h3 className="text-xl md:text-3xl font-black text-white italic tracking-tighter uppercase mb-1 leading-none font-space">
                              {brand.name}
                            </h3>
                            
                            <p className="text-white/80 text-[10px] md:text-xs font-bold uppercase tracking-widest italic mb-4">
                              {brand.category}
                            </p>
                            
                            <button 
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                navigate(`/brands/${brand.id}`);
                              }}
                              className="flex items-center gap-2 px-5 py-2.5 bg-white/15 hover:bg-white text-white hover:text-[#E8500A] backdrop-blur-sm border border-white/20 hover:border-white transition-all rounded-full group/btn"
                            >
                              <span className="text-[9px] font-black uppercase tracking-widest">EXPLORE BRAND</span>
                              <ArrowUpRight size={12} className="group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
                            </button>
                          </motion.div>
                        )}
                      </motion.div>
                    );
                  })}
                </div>

                {/* Sliding Carousel Controls & Navigation */}
                <div className="mt-5 flex items-center justify-center gap-10 border-t border-gray-100 pt-4 select-none">
                   <div className="flex gap-2">
                     {CAROUSEL_BRANDS.map((_, i) => (
                       <button
                         key={i}
                         type="button"
                         onClick={() => setCarouselIndex(i)}
                         className={cn(
                           "h-1 transition-all duration-500 rounded-full",
                           carouselIndex === i ? "w-10 bg-[#E8500A]" : "w-2.5 bg-gray-200 hover:bg-gray-300"
                         )}
                         aria-label={`Go to brand slide ${i + 1}`}
                       />
                     ))}
                   </div>
                   
                   <div className="flex gap-3">
                      <button 
                        type="button"
                        onClick={() => setCarouselIndex((prev) => (prev - 1 + CAROUSEL_BRANDS.length) % CAROUSEL_BRANDS.length)} 
                        className="w-8 h-8 rounded-full border border-gray-100 flex items-center justify-center hover:bg-gray-50 hover:border-[#E8500A]/30 transition-all active:scale-90"
                        title="Previous Brand"
                      >
                         <ChevronLeft size={16} />
                      </button>
                      <button 
                        type="button"
                        onClick={() => setCarouselIndex((prev) => (prev + 1) % CAROUSEL_BRANDS.length)} 
                        className="w-8 h-8 rounded-full border border-gray-100 flex items-center justify-center hover:bg-gray-50 hover:border-[#E8500A]/30 transition-all active:scale-90"
                        title="Next Brand"
                      >
                         <ChevronRight size={16} />
                      </button>
                   </div>
                </div>
              </div>

              {/* FEED SECTION B — POPULAR PRODUCTS */}
              <div id="section-popular-products" className="bg-white rounded-3xl border border-gray-100/90 p-6 md:p-8 shadow-[0_15px_40px_rgba(26,29,78,0.02)]">
                <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between border-b border-gray-100 pb-5 mb-6 gap-4">
                  <div className="text-left">
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="font-space text-xl sm:text-2xl font-black uppercase tracking-tight text-[#1A1D4E]">Popular</span>
                      <span className="font-space text-xl sm:text-2xl font-black uppercase tracking-tight text-[#E8500A] italic">Products</span>
                    </div>
                    <p className="text-xs text-gray-400 font-semibold pl-3 border-l-2 border-[#E8500A] leading-tight">
                      Handpicked, verified, and community tested luxury catalog direct from approved vendors.
                    </p>
                  </div>
                  <Link to="/products" className="text-[10px] font-black text-[#E8500A] hover:text-[#CF4400] uppercase tracking-widest shrink-0 flex items-center gap-1.5 leading-none bg-[#FFF0E8] px-4.5 py-2.5 rounded-full border border-[#E8500A]/10 hover:border-[#E8500A]/30 hover:scale-105 transition-all">
                    BROWSE ALL <Search className="w-3.5 h-3.5" />
                  </Link>
                </div>

                {/* Popular Product list in visual cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                  {rightProductsList.slice(0, 4).map((p) => (
                    <ProductCard key={p.id} product={p} variant="compact" />
                  ))}
                </div>
              </div>

              {/* FEED SECTION C — SPOTLIGHT BRAND (Sponsored) */}
              <div className="flex flex-col md:flex-row md:items-end justify-between mb-5 mt-12 gap-3">
                <div className="text-left">
                  <h2 className="font-space text-3xl font-black italic tracking-tight uppercase leading-none">
                    <span className="text-[#E8500A]">SPOTLIGHT</span> <span className="text-[#1A1D4E]">BRAND</span>
                  </h2>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="shrink-0 w-1 h-[14px] bg-[#E8500A] rounded-full inline-block" />
                    <p className="text-[11px] text-[#1A1D4E] font-bold tracking-wide leading-none uppercase">
                      Connect with millions of shoppers and boost your brand visibility today.
                    </p>
                  </div>
                </div>
                <div className="flex shrink-0">
                  <span className="border border-[#E8500A]/40 text-[#E8500A] text-[9.5px] font-black uppercase tracking-wider px-3.5 py-1.5 rounded-full leading-none font-mono">
                    SPONSORED AD
                  </span>
                </div>
              </div>

              <div id="section-spotlight-brand" className="relative overflow-hidden rounded-[20px] bg-[#2E171C] text-white p-6 md:p-8 shadow-2xl leading-relaxed mb-12">
                {/* Spotlight Main Header */}
                <div className="grid grid-cols-1 md:grid-cols-[auto_1fr_auto] gap-7 items-center pb-6 border-b border-white/10 relative z-10">
                  
                  {/* Left Logo and View Brand link */}
                  <div className="flex flex-col items-center gap-2.5 shrink-0">
                    <div className="w-[115px] h-[115px] bg-[#1a1c3a] border border-[#2d2f5a] rounded-xl flex flex-col items-center justify-center p-3 relative group transition-transform duration-300 hover:scale-[1.03] shadow-[inset_0_2px_8px_rgba(0,0,0,0.5)]">
                      <span className="absolute -top-1.5 -right-1.5 w-6 h-6 bg-[#E8500A] text-white rounded-full flex items-center justify-center border-2 border-[#1a1c3a] shadow-lg">
                        <Check className="w-3.5 h-3.5 font-black stroke-[3]" />
                      </span>
                      <div className="text-center font-space font-black text-white text-2xl uppercase leading-none italic tracking-tighter">
                        sailor
                        <div className="text-[7.5px] font-sans tracking-[0.25em] mt-1.5 uppercase font-medium text-gray-400">BY EPLLYION</div>
                      </div>
                    </div>
                    <Link to="/brands/3" className="text-[10px] font-bold text-white/95 hover:text-[#E8500A] tracking-wider uppercase underline transition-colors">
                      VIEW BRAND PROFILE
                    </Link>
                  </div>

                  {/* Middle brand descriptive block */}
                  <div className="flex flex-col gap-2.5 text-left md:pl-2">
                    <div className="flex flex-wrap items-center gap-3">
                      <h3 className="font-space font-black text-4xl text-white uppercase italic tracking-tight leading-none">
                        Sailor
                      </h3>
                      <span className="bg-[#00D03C] text-white text-[9.5px] font-black px-3 py-1 rounded-full uppercase tracking-wider leading-none font-mono">
                        VERIFIED BRAND
                      </span>
                    </div>
                    <div>
                      <p className="text-[10.5px] text-white/80 font-black uppercase tracking-widest leading-none font-sans">
                        FASHION & CLOTHING
                      </p>
                      <div className="h-[1px] bg-white/20 w-36 mt-1.5" />
                    </div>
                    
                    <div className="flex flex-col gap-2 mt-1">
                      <span className="text-[11px] text-white font-extrabold flex items-center gap-2 tracking-wide uppercase font-mono animate-pulse">
                        <span className="text-rose-500 text-sm">❤️</span> 50,000 SHOPPERS LOVES THE BRANDS
                      </span>
                      <span className="text-[11px] text-white font-extrabold flex items-center gap-2 tracking-wide uppercase font-mono">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="w-[18px] h-[18px] text-[#00D03C]">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.94" />
                        </svg>
                        SCORE: 92/100
                      </span>
                    </div>
                  </div>

                  {/* Right Stats Block */}
                  <div className="grid grid-cols-3 gap-5 md:gap-7 bg-white/5 border border-white/10 rounded-2xl p-4.5 mt-2 md:mt-0">
                    <div className="flex flex-col text-left">
                      <span className="text-[#00D03C] text-[10.5px] font-black tracking-widest uppercase font-mono leading-none">BEST FOR</span>
                      <span className="text-white text-[11.5px] font-black uppercase tracking-wider mt-1.5 leading-none">HANDICRAFTS</span>
                    </div>
                    <div className="flex flex-col text-left border-l border-white/10 pl-5">
                      <span className="text-[#00D03C] text-[10.5px] font-black tracking-widest uppercase font-mono leading-none">BDT 500</span>
                      <span className="text-white text-[11.5px] font-black uppercase tracking-wider mt-1.5 leading-none font-sans">PRICE RANGE</span>
                    </div>
                    <div className="flex flex-col text-[#00D03C] text-left border-l border-white/10 pl-5">
                      <span className="text-[#00D03C] text-[10.5px] font-black tracking-widest uppercase font-mono leading-none">95%</span>
                      <span className="text-white text-[11.5px] font-black uppercase tracking-wider mt-1.5 leading-none font-sans">RECOMMENDED</span>
                    </div>
                  </div>

                </div>

                {/* Sub-list of 4 spotlight products in pristine mockup cards */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4.5 pt-6 relative z-10 text-[#1A1D4E]">
                  {[...sailorProductList, ...rightProductsList].slice(0, 4).map((product, idx) => {
                    const mockImages = [
                      "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=400&h=400&fit=crop",
                      "https://images.unsplash.com/photo-1587314168485-3236d6710814?w=400&h=400&fit=crop",
                      "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=400&h=400&fit=crop",
                      "https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?w=400&h=400&fit=crop"
                    ];
                    const pKey = `p${idx + 1}`;
                    const pState = spotlightProductStates[pKey] || { likes: 12000, views: 1200, shares: 450, liked: false };
                    
                    return (
                      <div 
                        key={product.id || idx}
                        onClick={() => {
                          handleSpotlightProductReact(pKey, 'views');
                          navigate(`/products/${product.id}`);
                        }}
                        className="bg-white border border-gray-100 hover:border-[#E8500A]/30 rounded-2xl p-4 shadow-md hover:shadow-xl hover:scale-[1.03] transition-all duration-300 cursor-pointer flex flex-col gap-3 group"
                      >
                        <div className="w-full aspect-square bg-[#ECEFF1] rounded-xl overflow-hidden relative border border-gray-100 shrink-0">
                          <img 
                            src={mockImages[idx]} 
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                            alt={product.title || "Product"} 
                          />
                        </div>
                        <div className="flex flex-col gap-2 flex-1">
                          <h5 className="font-sans font-bold text-[#1A1D4E] text-[11px] leading-snug text-left line-clamp-3">
                            QCY PB10C 10000mAh 38W PD Fast Charging Mini Power Bank.
                          </h5>
                          
                          {/* Mini Reaction Toolbar for all product cards */}
                          <div className="flex items-center justify-between border-t border-gray-100 pt-3 mt-auto select-none">
                            <div className="flex items-center gap-2.5 text-[10px] font-mono font-bold text-gray-450">
                              <button 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleSpotlightProductReact(pKey, 'likes');
                                }}
                                className={cn(
                                  "flex items-center gap-0.5 transition-colors",
                                  pState.liked ? "text-rose-500 font-black" : "hover:text-rose-500"
                                )}
                              >
                                <Heart className={cn("w-3.5 h-3.5", pState.liked ? "fill-current text-rose-500" : "")} />
                                <span>{pState.liked ? "12.1k" : "12k"}</span>
                              </button>
                              
                              <button 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleSpotlightProductReact(pKey, 'views');
                                }}
                                className="flex items-center gap-0.5 hover:text-[#E8500A]"
                              >
                                <Eye className="w-3.5 h-3.5" />
                                <span>{(pState.views / 1000).toFixed(1)}k</span>
                              </button>

                              <button 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleSpotlightProductReact(pKey, 'shares');
                                }}
                                className="flex items-center gap-0.5 hover:text-[#E8500A]"
                              >
                                <Share2 className="w-3.5 h-3.5" />
                                <span>{pState.shares}</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Footer Reactions Toolbar & Browse Brand Link */}
                <div className="flex items-center justify-between border-t border-white/10 pt-5 mt-6 pb-2">
                  <div className="flex items-center gap-6 text-[11px] font-black text-gray-300 uppercase font-mono select-none">
                    
                    {/* Main Container React Button */}
                    <button 
                      onClick={(e) => { e.stopPropagation(); handleSpotlightAction('likes'); }}
                      className={cn(
                        "flex items-center gap-1.5 transition-all text-[11px] cursor-pointer transform active:scale-95",
                        spotlightStates.liked ? "text-rose-500 font-extrabold" : "hover:text-rose-400 text-gray-300"
                      )}
                    >
                      <Heart className={cn("w-4.5 h-4.5", spotlightStates.liked ? "fill-current text-rose-500 scale-110" : "")} />
                      <span>{spotlightStates.liked ? "12.1k" : "12k"}</span>
                    </button>

                    {/* Main Container Viewed Button */}
                    <button 
                      onClick={(e) => { e.stopPropagation(); handleSpotlightAction('views'); }}
                      className="flex items-center gap-1.5 hover:text-[#E8500A] text-gray-300 transition-colors cursor-pointer"
                    >
                      <Eye className="w-4.5 h-4.5" />
                      <span>{(spotlightStates.views / 1000).toFixed(1)}k</span>
                    </button>

                    {/* Main Container Share Button */}
                    <button 
                      onClick={(e) => { e.stopPropagation(); handleSpotlightAction('shares'); }}
                      className="flex items-center gap-1.5 hover:text-[#E8500A] text-gray-300 transition-colors cursor-pointer"
                    >
                      <Share2 className="w-4.5 h-4.5" />
                      <span>{spotlightStates.shares}</span>
                    </button>
                  </div>

                  <Link 
                    to="/brands/3" 
                    className="text-[11.5px] font-black text-white hover:text-[#E8500A] uppercase tracking-wider italic flex items-center gap-1 transition-colors font-sans"
                  >
                    BROWSE ALL FROM THIS BRAND
                  </Link>
                </div>
              </div>

              {/* FEED SECTION D — FOR BUSINESS & SELLERS */}
              <div id="section-sellers" className="bg-white rounded-3xl border border-gray-100 p-6 md:p-10 shadow-[0_15px_40px_rgba(26,29,78,0.02)] relative overflow-hidden">
                <div className="absolute top-0 right-0 w-44 h-44 bg-gradient-to-br from-[#E8500A]/5 to-[#1A1D4E]/5 rounded-full blur-3xl pointer-events-none" />
                
                <div className="text-center mb-8">
                  <span className="font-space text-xl sm:text-2xl font-black uppercase tracking-tight text-[#1A1D4E]">For Business &</span>
                  <span className="font-space text-xl sm:text-2xl font-black uppercase tracking-tight text-[#E8500A] italic"> Sellers</span>
                  <p className="text-xs text-gray-400 font-semibold mt-1.5">Are you a merchant? Gain elite verification badges, unlock listing slots, and grow authentic shopper followings.</p>
                </div>

                <div className="border border-dashed border-[#E8500A]/20 bg-gradient-to-b from-[#FFF0E8]/40 to-white rounded-[24px] p-8 md:p-10 text-center flex flex-col items-center max-w-[620px] mx-auto shadow-sm">
                  <div className="w-12 h-12 rounded-full bg-[#E8500A]/10 text-[#E8500A] flex items-center justify-center mb-4 border border-[#E8500A]/5">
                    <Sparkles className="w-6 h-6" />
                  </div>
                  <h4 className="font-space font-extrabold text-[#1A1D4E] text-base uppercase tracking-tight mb-2">Boost Your Sales • Submit Your Exclusive Offer</h4>
                  <p className="text-xs text-gray-500 max-w-sm mb-6 leading-relaxed">
                    Access premium exposure metrics, reach verified local shopper lists, and establish uncompromised consumer confidence.
                  </p>
                  
                  <Link 
                    to="/post-offer" 
                    className="mb-4 h-12 min-w-[200px] px-8 bg-gradient-to-r from-[#FF5B00] to-[#E8500A] hover:from-[#E8500A] hover:to-[#CF4400] text-white font-black rounded-full text-xs tracking-widest uppercase flex items-center justify-center gap-2.5 transition-all shadow-lg hover:scale-105"
                  >
                    Post Business Offer <PenTool className="w-4 h-4" />
                  </Link>
                  <div className="flex items-center gap-1.5 text-[9px] font-bold text-gray-400 uppercase font-mono tracking-widest">
                    <Users className="w-3.5 h-3.5 text-gray-400" /> Over 100,000 Verified shoppers login Daily
                  </div>
                </div>
              </div>

              {/* FEED SECTION E — FEATURED RECOMMENDATIONS */}
              <div id="section-recommendations" className="bg-white rounded-[32px] border border-gray-100 p-6 md:p-10 shadow-[0_15px_40px_rgba(26,29,78,0.02)]">
                
                {/* Section Header */}
                <div className="text-center mb-10 flex flex-col items-center">
                  <h2 className="font-space text-3xl font-black italic tracking-tight text-center uppercase leading-none">
                    <span className="text-[#1A1D4E]">FEATURED</span> <span className="text-[#E8500A]">RECOMMENDATIONS</span>
                  </h2>
                  <div className="flex items-center gap-2.5 mt-2.5 justify-center max-w-[620px]">
                    <span className="shrink-0 w-1 h-5 bg-[#E8500A] rounded-full inline-block" />
                    <p className="text-xs text-[#1A1D4E]/90 font-bold tracking-wide text-left uppercase">
                      Connect with millions of shoppers and boost your brand visibility today.
                    </p>
                  </div>
                </div>

                {/* Main Featured Buying Guide banner blog layout */}
                <div className="border border-gray-100 rounded-[28px] overflow-hidden shadow-md hover:shadow-xl hover:border-gray-200/80 transition-all duration-300 mb-9 bg-white flex flex-col group">
                  <div 
                    onClick={() => {
                      handleRecView('featured');
                      navigate(`/guides/${featuredBlog.id}`);
                    }}
                    className="aspect-[1.9/1] w-full bg-slate-950 relative overflow-hidden cursor-pointer"
                  >
                    <img 
                      src="https://images.unsplash.com/photo-1531538606174-0f90ff5dce83?w=1200&h=675&fit=crop" 
                      className="w-full h-full object-cover opacity-85 group-hover:scale-[1.03] transition-transform duration-700" 
                      alt="Featured recommendation" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/25 pointer-events-none" />
                    
                    {/* Top-Left Featured Badge */}
                    <span className="absolute top-5 left-5 inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-[#E8500A] text-white text-[9.5px] font-black uppercase tracking-wider rounded-lg shadow-md font-mono">
                      ★ FEATURED
                    </span>

                    {/* Top-Right YouTube Badge */}
                    <div className="absolute top-5 right-5 flex flex-col items-center">
                      <div className="w-9 h-9 bg-black/40 backdrop-blur-md border border-white/10 rounded-full flex items-center justify-center text-white hover:bg-[#E8500A] transition-colors shadow-md">
                        <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                          <path d="M23.498 6.163a3.003 3.003 0 0 0-2.11-2.11C19.517 3.545 12 3.545 12 3.545s-7.516 0-9.387.507A3.003 3.003 0 0 0 .503 6.163C0 8.044 0 12 0 12s0 3.956.503 5.837a3.003 3.003 0 0 0 2.11 2.11c1.871.507 9.387.507 9.387.507s7.517 0 9.387-.507a3.003 3.003 0 0 0 2.11-2.11C24 15.956 24 12 24 12s0-3.956-.502-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                        </svg>
                      </div>
                      <span className="text-[8px] font-bold text-white tracking-widest uppercase mt-1 drop-shadow-sm font-mono leading-none">Youtube</span>
                    </div>

                    {/* Large Red Circular Play Button Center Override */}
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <div className="w-16 h-16 bg-red-600 hover:bg-red-700 text-white rounded-full flex items-center justify-center shadow-2xl scale-100 group-hover:scale-110 transition-transform duration-300 border border-white/10">
                        <Play className="w-7 h-7 fill-current ml-1 text-white" />
                      </div>
                    </div>

                    {/* Lower Image Info text overlays */}
                    <div className="absolute bottom-5 left-5 pr-24 text-left pointer-events-none">
                      <h3 className="font-space font-black text-white text-xl uppercase tracking-tight leading-tight mb-2 pr-12">
                        TOP 10 SMARTPHONES TO BUY IN 2026
                      </h3>
                      <p className="text-[10px] text-white/80 font-semibold line-clamp-1 italic max-w-2xl pr-8">
                        Top 10 Smartphones to Buy in 2026. Find the best phone deals Top 10 Smartphones to Buy in 2026. Find the best phone dealsTop 10 Smartphones to Buy in 2026. Find the best phone deals................
                      </p>
                    </div>

                    {/* Length Ticker pill of video element */}
                    <span className="absolute bottom-5 right-5 bg-black/75 backdrop-blur-md text-white text-[9px] font-mono font-black tracking-widest px-2.5 py-1 rounded-md border border-white/10 shadow-lg">
                      8:10
                    </span>
                  </div>

                  {/* Featured Card lower body block */}
                  <div className="p-6 md:p-8 text-left bg-white">
                    <h4 
                      onClick={() => {
                        handleRecView('featured');
                        navigate(`/guides/${featuredBlog.id}`);
                      }}
                      className="font-space font-black text-xl lg:text-2xl uppercase text-[#1A1D4E] leading-snug hover:text-[#E8500A] transition-colors cursor-pointer mb-2"
                    >
                      TOP 10 SMARTPHONES TO BUY IN 2026
                    </h4>
                    <p className="text-xs text-[#6B7280] leading-relaxed mb-6 font-semibold max-w-4xl">
                      Top 10 Smartphones to Buy in 2026. Find the best phone deals. Complete shopping guidelines containing direct warranty verifications and merchant scoring formulas based on real user trials.
                    </p>

                    {/* Active dynamic interactive toolbar aligned to template */}
                    <div className="flex items-center justify-between border-t border-gray-100 pt-5 mt-auto">
                      <div className="flex items-center gap-6 text-[10.5px] font-black text-gray-400 uppercase font-mono select-none">
                        
                        {/* React/Love Button */}
                        <button 
                          onClick={(e) => { e.stopPropagation(); handleRecLike('featured'); }}
                          className={cn(
                            "flex items-center gap-1.5 transition-all duration-250 cursor-pointer transform active:scale-90 hover:scale-[1.05]",
                            recommendationStates.featured.liked ? "text-rose-500 font-extrabold" : "hover:text-[#E8500A] text-gray-500"
                          )}
                        >
                          <Heart className={cn("w-4.5 h-4.5", recommendationStates.featured.liked ? "fill-current text-rose-500 scale-110" : "")} /> 
                          <span>{recommendationStates.featured.liked ? "12.1k" : "12k"}</span>
                        </button>

                        {/* Viewed Button */}
                        <button 
                          onClick={(e) => { e.stopPropagation(); handleRecView('featured'); }}
                          className="flex items-center gap-1.5 hover:text-[#E8500A] text-gray-500 transition-colors cursor-pointer"
                        >
                          <Eye className="w-4.5 h-4.5" /> 
                          <span>{(recommendationStates.featured.views / 1000).toFixed(1)}k</span>
                        </button>

                        {/* Share Button */}
                        <button 
                          onClick={(e) => { e.stopPropagation(); handleRecShare('featured'); }}
                          className="flex items-center gap-1.5 hover:text-[#E8500A] text-gray-500 transition-colors cursor-pointer"
                        >
                          <Share2 className="w-4.5 h-4.5" /> 
                          <span>{recommendationStates.featured.shares}</span>
                        </button>
                      </div>

                      {/* Bookmark Icon Button on far-right */}
                      <button 
                        onClick={(e) => { e.stopPropagation(); handleRecBookmark('featured'); }}
                        className={cn(
                          "w-11 h-11 rounded-full border border-gray-100 flex items-center justify-center transition-all bg-white hover:shadow-md transform active:scale-95 cursor-pointer",
                          recommendationStates.featured.bookmarked ? "border-[#E8500A]/30 bg-[#FFF0E8]/40" : "hover:border-gray-200"
                        )}
                      >
                        <Bookmark className={cn(
                          "w-5 h-5 stroke-[2] transition-colors duration-200", 
                          recommendationStates.featured.bookmarked ? "fill-[#E8500A] text-[#E8500A]" : "text-amber-700/85"
                        )} />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Sub Guides Grid matching elements visually */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6.5 mb-10">
                  
                  {/* CARD 1: Reels Card 1 (Vertical Aspect Video) */}
                  <div className="bg-white border border-gray-100 rounded-[24px] overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col group">
                    <div 
                      onClick={() => handleRecView('card1')}
                      className="relative h-[320px] bg-slate-950 overflow-hidden cursor-pointer"
                    >
                      <img 
                        src="https://images.unsplash.com/photo-1541643600914-78b084683601?w=600&h=1000&fit=crop" 
                        className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-700" 
                        alt="Reel 1 Bottle" 
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-black/30 pointer-events-none" />
                      
                      {/* Top-Left Reel Badge */}
                      <span className="absolute top-4 left-4 inline-flex items-center px-3 py-1 bg-white hover:bg-gray-100 text-black text-[9px] font-black uppercase tracking-wider rounded-lg shadow-sm border border-gray-100">
                        REEL
                      </span>

                      {/* Top-Right Instagram Badge */}
                      <div className="absolute top-4 right-4 flex flex-col items-center">
                        <div className="w-8 h-8 bg-black/40 backdrop-blur-md rounded-full border border-white/10 flex items-center justify-center text-white">
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 text-white">
                            <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                            <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                            <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                          </svg>
                        </div>
                        <span className="text-[7.5px] font-bold text-white uppercase mt-0.5 tracking-wider font-mono">Instagram</span>
                      </div>

                      {/* Small Center Play Button */}
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <div className="w-11 h-11 bg-red-600 rounded-full flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform">
                          <Play className="w-5 h-5 fill-current ml-0.5 text-white" />
                        </div>
                      </div>

                      {/* Bottom title overlays on image */}
                      <div className="absolute bottom-4 left-4 pr-12 text-left pointer-events-none">
                        <h4 className="font-space font-black text-white text-sm uppercase tracking-tight leading-tight mb-1">
                          TOP 10 SMARTPHONES TO BUY IN 2026
                        </h4>
                        <p className="text-[9px] text-white/80 font-medium line-clamp-1 italic">
                          Top 10 Smartphones to Buy in 2026. Find the best phone deals.........
                        </p>
                      </div>

                      {/* Video length badge inside image */}
                      <span className="absolute bottom-4 right-4 bg-black/75 backdrop-blur-md text-white text-[8px] font-mono font-black px-2 py-0.5 rounded border border-white/10">
                        8:10
                      </span>
                    </div>

                    {/* Card Footer bar actions */}
                    <div className="p-4.5 bg-white border-t border-gray-50 flex items-center justify-between text-left">
                      <div className="flex items-center gap-4 text-[10px] font-black text-gray-450 uppercase font-mono select-none">
                        <button 
                          onClick={(e) => { e.stopPropagation(); handleRecLike('card1'); }}
                          className={cn(
                            "flex items-center gap-1 shrink-0 transition-transform active:scale-95 cursor-pointer",
                            recommendationStates.card1.liked ? "text-rose-500 font-extrabold" : "hover:text-[#E8500A] text-gray-500"
                          )}
                        >
                          <Heart className={cn("w-4 h-4", recommendationStates.card1.liked ? "fill-current text-rose-500 scale-110" : "")} />
                          <span>{recommendationStates.card1.liked ? "12.1k" : "12k"}</span>
                        </button>

                        <button 
                          onClick={(e) => { e.stopPropagation(); handleRecView('card1'); }}
                          className="flex items-center gap-1 hover:text-[#E8500A] text-gray-500 transition-colors cursor-pointer"
                        >
                          <Eye className="w-4 h-4" />
                          <span>1.2k</span>
                        </button>

                        <button 
                          onClick={(e) => { e.stopPropagation(); handleRecShare('card1'); }}
                          className="flex items-center gap-1 hover:text-[#E8500A] text-gray-500 transition-colors cursor-pointer"
                        >
                          <Share2 className="w-4 h-4" />
                          <span>{recommendationStates.card1.shares}</span>
                        </button>
                      </div>

                      {/* Bookmark Button */}
                      <button 
                        onClick={(e) => { e.stopPropagation(); handleRecBookmark('card1'); }}
                        className={cn(
                          "w-9 h-9 rounded-full border border-gray-100 flex items-center justify-center bg-white transition-all transform active:scale-95 cursor-pointer",
                          recommendationStates.card1.bookmarked ? "bg-[#FFF0E8]/40 border-[#E8500A]/30 text-[#E8500A]" : "hover:border-gray-200"
                        )}
                      >
                        <Bookmark className={cn("w-4 h-4 stroke-[2]", recommendationStates.card1.bookmarked ? "fill-[#E8500A] text-[#E8500A]" : "text-amber-700/80")} />
                      </button>
                    </div>
                  </div>

                  {/* CARD 2: Blog Text Card 2 (Wide Landscape image & Body) */}
                  <div className="bg-white border border-gray-100 rounded-[24px] overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col group text-left">
                    <div 
                      onClick={() => handleRecView('card2')}
                      className="relative h-44 bg-slate-900 overflow-hidden cursor-pointer"
                    >
                      <img 
                        src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800&h=500&fit=crop" 
                        className="w-full h-full object-cover opacity-90 group-hover:scale-105 transition-transform duration-700" 
                        alt="Blog Dress" 
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent pointer-events-none" />
                      
                      {/* Top-Left Read Time Badge */}
                      <span className="absolute top-4 left-4 inline-flex items-center px-3 py-1 bg-white text-black text-[9px] font-black uppercase tracking-wider rounded-lg shadow-sm border border-gray-100 font-mono">
                        8 MIN READ
                      </span>

                      {/* Top-Right Blog badge */}
                      <div className="absolute top-4 right-4 flex flex-col items-center">
                        <div className="w-8 h-8 bg-black/40 backdrop-blur-md rounded-full border border-white/10 flex items-center justify-center text-white">
                          <PenTool className="w-4 h-4 text-white" />
                        </div>
                        <span className="text-[7.5px] font-bold text-white uppercase mt-0.5 tracking-wider font-mono">Blog</span>
                      </div>
                    </div>

                    {/* Card Content body with heading and excerpt */}
                    <div className="p-4.5 flex-1 flex flex-col justify-between">
                      <div className="mb-4">
                        <h4 className="font-space font-black text-xs uppercase text-[#1A1D4E] group-hover:text-[#E8500A] leading-snug mb-1.5 transition-colors line-clamp-2">
                          TOP 10 SMARTPHONES TO BUY IN 2026
                        </h4>
                        <p className="text-[10px] text-gray-450 font-medium line-clamp-2 leading-relaxed">
                          Top 10 Smartphones to Buy in 2026. Find the best phone deals.........
                        </p>
                      </div>

                      {/* Card actions row */}
                      <div className="border-t border-gray-50 pt-4 mt-auto flex items-center justify-between">
                        <div className="flex items-center gap-4 text-[10px] font-black text-gray-450 uppercase font-mono select-none">
                          <button 
                            onClick={(e) => { e.stopPropagation(); handleRecLike('card2'); }}
                            className={cn(
                              "flex items-center gap-1 transition-transform active:scale-95 cursor-pointer",
                              recommendationStates.card2.liked ? "text-rose-500 font-extrabold" : "hover:text-[#E8500A] text-gray-500"
                            )}
                          >
                            <Heart className={cn("w-4 h-4", recommendationStates.card2.liked ? "fill-current text-rose-500 scale-110" : "")} />
                            <span>{recommendationStates.card2.liked ? "12.1k" : "12k"}</span>
                          </button>

                          <button 
                            onClick={(e) => { e.stopPropagation(); handleRecView('card2'); }}
                            className="flex items-center gap-1 hover:text-[#E8500A] text-gray-500 transition-colors cursor-pointer"
                          >
                            <Eye className="w-4 h-4" />
                            <span>1.2k</span>
                          </button>

                          <button 
                            onClick={(e) => { e.stopPropagation(); handleRecShare('card2'); }}
                            className="flex items-center gap-1 hover:text-[#E8500A] text-gray-500 transition-colors cursor-pointer"
                          >
                            <Share2 className="w-4 h-4" />
                            <span>{recommendationStates.card2.shares}</span>
                          </button>
                        </div>

                        {/* Bookmark Button */}
                        <button 
                          onClick={(e) => { e.stopPropagation(); handleRecBookmark('card2'); }}
                          className={cn(
                            "w-9 h-9 rounded-full border border-gray-100 flex items-center justify-center bg-white transition-all transform active:scale-95 cursor-pointer",
                            recommendationStates.card2.bookmarked ? "bg-[#FFF0E8]/40 border-[#E8500A]/30 text-[#E8500A]" : "hover:border-gray-200"
                          )}
                        >
                          <Bookmark className={cn("w-4 h-4 stroke-[2]", recommendationStates.card2.bookmarked ? "fill-[#E8500A] text-[#E8500A]" : "text-amber-700/80")} />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* CARD 3: Reels Card 3 (Vertical Aspect Video) */}
                  <div className="bg-white border border-gray-100 rounded-[24px] overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col group">
                    <div 
                      onClick={() => handleRecView('card3')}
                      className="relative h-[320px] bg-slate-950 overflow-hidden cursor-pointer"
                    >
                      <img 
                        src="https://images.unsplash.com/photo-1541643600914-78b084683601?w=600&h=1000&fit=crop" 
                        className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-700" 
                        alt="Reel 3 Bottle duplicated" 
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-black/30 pointer-events-none" />
                      
                      {/* Top-Left Reel Badge */}
                      <span className="absolute top-4 left-4 inline-flex items-center px-3 py-1 bg-white hover:bg-gray-100 text-black text-[9px] font-black uppercase tracking-wider rounded-lg shadow-sm border border-gray-100">
                        REEL
                      </span>

                      {/* Top-Right Instagram Badge */}
                      <div className="absolute top-4 right-4 flex flex-col items-center">
                        <div className="w-8 h-8 bg-black/40 backdrop-blur-md rounded-full border border-white/10 flex items-center justify-center text-white">
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 text-white">
                            <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                            <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                            <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                          </svg>
                        </div>
                        <span className="text-[7.5px] font-bold text-white uppercase mt-0.5 tracking-wider font-mono">Instagram</span>
                      </div>

                      {/* Small Center Play Button */}
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <div className="w-11 h-11 bg-red-600 rounded-full flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform">
                          <Play className="w-5 h-5 fill-current ml-0.5 text-white" />
                        </div>
                      </div>

                      {/* Bottom title overlays on image */}
                      <div className="absolute bottom-4 left-4 pr-12 text-left pointer-events-none">
                        <h4 className="font-space font-black text-white text-sm uppercase tracking-tight leading-tight mb-1">
                          TOP 10 SMARTPHONES TO BUY IN 2026
                        </h4>
                        <p className="text-[9px] text-white/80 font-medium line-clamp-1 italic">
                          Top 10 Smartphones to Buy in 2026. Find the best phone deals.........
                        </p>
                      </div>

                      {/* Video length badge inside image */}
                      <span className="absolute bottom-4 right-4 bg-black/75 backdrop-blur-md text-white text-[8px] font-mono font-black px-2 py-0.5 rounded border border-white/10">
                        8:10
                      </span>
                    </div>

                    {/* Card Footer bar actions */}
                    <div className="p-4.5 bg-white border-t border-gray-50 flex items-center justify-between text-left">
                      <div className="flex items-center gap-4 text-[10px] font-black text-gray-450 uppercase font-mono select-none">
                        <button 
                          onClick={(e) => { e.stopPropagation(); handleRecLike('card3'); }}
                          className={cn(
                            "flex items-center gap-1 transition-transform active:scale-95 cursor-pointer",
                            recommendationStates.card3.liked ? "text-rose-500 font-extrabold" : "hover:text-[#E8500A] text-gray-500"
                          )}
                        >
                          <Heart className={cn("w-4 h-4", recommendationStates.card3.liked ? "fill-current text-rose-500 scale-110" : "")} />
                          <span>{recommendationStates.card3.liked ? "12.1k" : "12k"}</span>
                        </button>

                        <button 
                          onClick={(e) => { e.stopPropagation(); handleRecView('card3'); }}
                          className="flex items-center gap-1 hover:text-[#E8500A] text-gray-500 transition-colors cursor-pointer"
                        >
                          <Eye className="w-4 h-4" />
                          <span>1.2k</span>
                        </button>

                        <button 
                          onClick={(e) => { e.stopPropagation(); handleRecShare('card3'); }}
                          className="flex items-center gap-1 hover:text-[#E8500A] text-gray-500 transition-colors cursor-pointer"
                        >
                          <Share2 className="w-4 h-4" />
                          <span>{recommendationStates.card3.shares}</span>
                        </button>
                      </div>

                      {/* Bookmark Button */}
                      <button 
                        onClick={(e) => { e.stopPropagation(); handleRecBookmark('card3'); }}
                        className={cn(
                          "w-9 h-9 rounded-full border border-gray-100 flex items-center justify-center bg-white transition-all transform active:scale-95 cursor-pointer",
                          recommendationStates.card3.bookmarked ? "bg-[#FFF0E8]/40 border-[#E8500A]/30 text-[#E8500A]" : "hover:border-gray-200"
                        )}
                      >
                        <Bookmark className={cn("w-4 h-4 stroke-[2]", recommendationStates.card3.bookmarked ? "fill-[#E8500A] text-[#E8500A]" : "text-amber-700/80")} />
                      </button>
                    </div>
                  </div>

                </div>

                {/* Explore all Recommendations bottom action button */}
                <div className="text-center">
                  <Link 
                    to="/guides" 
                    className="inline-flex items-center gap-2.5 px-9 py-3.5 bg-[#E8500A] hover:bg-[#CF4400] font-black text-white text-[11px] tracking-widest uppercase rounded-full shadow-lg hover:shadow-xl duration-300 hover:scale-105 active:scale-95 transition-all"
                  >
                    <span>EXPLORE ALL RECOMMENDATION</span>
                    <span className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-white text-xs">
                      →
                    </span>
                  </Link>
                </div>
              </div>

              {/* FEED SECTION F — POPULAR CATEGORIES */}
              <div id="section-categories" className="bg-white rounded-[32px] border border-gray-100 p-6 md:p-10 shadow-[0_15px_40px_rgba(26,29,78,0.02)]">
                
                {/* Section Header */}
                <div className="flex items-center justify-between mb-8 pb-4 border-b border-gray-100/60">
                  <div className="text-left">
                    <h2 className="font-space text-3xl font-black italic tracking-tight uppercase leading-none">
                      <span className="text-[#1A1D4E]">POPULAR</span> <span className="text-[#E8500A]">CATEGORIES</span>
                    </h2>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="shrink-0 w-1 h-[14px] bg-[#E8500A] rounded-full inline-block" />
                      <p className="text-[11px] text-[#1A1D4E] font-bold tracking-wide leading-none uppercase">
                        EXPLORE BY INDUSTRY & NICHE
                      </p>
                    </div>
                  </div>
                  
                  {/* Show All Category Button on right */}
                  <div className="flex shrink-0">
                    <Link 
                      to="/categories" 
                      className="border border-gray-200/90 hover:border-[#E8500A]/30 text-[#1A1D4E] hover:text-[#E8500A] font-space text-[10px] font-black tracking-widest uppercase rounded-full px-5 py-2.5 flex items-center gap-2 bg-white shadow-sm transition-all hover:scale-105 active:scale-95"
                    >
                      <span>SHOW ALL CATEGORY</span>
                      <Search className="w-3.5 h-3.5 text-[#1A1D4E] stroke-[3]" />
                    </Link>
                  </div>
                </div>

                {/* Categories Grid - 6 beautiful cards exactly matching screenshot */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6.5 text-left">
                  {popularCategoriesMock.map((cat, idx) => {
                    // Custom high-fidelity category icon picker helper
                    const getCategoryMockIcon = (catName: string) => {
                      const name = catName.toLowerCase();
                      if (name.includes('fashion')) return <Shirt className="w-[21px] h-[21px] text-blue-600 stroke-[2.5]" />;
                      if (name.includes('tech') || name.includes('electronics')) return <Cpu className="w-[21px] h-[21px] text-[#1A73E8] stroke-[2.5]" />;
                      if (name.includes('family') || name.includes('kids')) return <Baby className="w-[21px] h-[21px] text-blue-500 stroke-[2.5]" />;
                      if (name.includes('jewelry') || name.includes('accessories')) return <Gem className="w-[21px] h-[21px] text-yellow-500 stroke-[2.5]" />;
                      if (name.includes('hobby') || name.includes('creativity') || name.includes('hobbies')) return <Palette className="w-[21px] h-[21px] text-orange-500 stroke-[2.5]" />;
                      if (name.includes('travel') || name.includes('hospitality')) return <Luggage className="w-[21px] h-[21px] text-rose-500 stroke-[2.5]" />;
                      return <ShoppingBag className="w-[21px] h-[21px] text-gray-500 stroke-[2.5]" />;
                    };

                    return (
                      <div 
                        key={idx}
                        onClick={() => {
                          setActiveTab(cat.id);
                          toast.success(`Active Category: ${cat.id}`);
                        }}
                        className="bg-white border border-gray-100 rounded-[20px] p-6 flex flex-col items-start shadow-[0_4px_20px_rgba(0,0,0,0.01)] hover:shadow-lg hover:border-gray-200/90 transition-all duration-300 cursor-pointer group"
                      >
                        {/* Perfect white circle around the icon styled like mockup */}
                        <div className="w-11 h-11 bg-white border border-slate-100/90 rounded-full flex items-center justify-center shadow-sm mb-5 group-hover:scale-105 transition-transform duration-250 shrink-0">
                          {getCategoryMockIcon(cat.name)}
                        </div>
                        
                        <div className="w-full">
                          <h4 className="font-sans font-bold text-sm text-[#1A1D4E] group-hover:text-[#E8500A] transition-colors leading-tight mb-1.5 uppercase tracking-tight">
                            {cat.name}
                          </h4>
                          <p className="text-[11px] text-red-500 font-bold leading-none uppercase font-mono tracking-tight">
                            {cat.count}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </>
          ) : (
            /* NON-FEED CATEGORY DISPLAY GRID */
            <div className="bg-white rounded-[32px] border border-gray-100 p-6 md:p-8 shadow-[0_15px_40px_rgba(26,29,78,0.02)] min-h-[480px]">
              <div className="flex items-center justify-between border-b border-gray-100 pb-5 mb-8 text-left">
                <div>
                  <h3 className="font-space font-black text-2xl uppercase text-[#1A1D4E] flex items-center gap-2.5 leading-none">
                    <span className="text-3xl leading-none">{categoryTabs.find(t=>t.id===activeTab)?.emoji}</span> {activeTab}
                  </h3>
                  <p className="text-[10.5px] text-gray-400 mt-1.5 uppercase tracking-wider font-mono">BROWSING SECURED ORIGINAL PRODUCTS CATALOG</p>
                </div>
                <button 
                  onClick={() => setActiveTab('FEED')}
                  className="px-5 py-2.5 bg-gray-100 hover:bg-gray-200 hover:scale-105 rounded-full text-[10px] font-black uppercase tracking-widest transition-all"
                >
                  Return to Feed
                </button>
              </div>

              {filteredProducts.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredProducts.map((p: any) => (
                    <ProductCard key={p.id} product={p} variant="compact" />
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                  <div className="w-14 h-14 rounded-full bg-slate-150 text-slate-300 flex items-center justify-center mb-4">
                    <AlertCircle className="w-8 h-8" />
                  </div>
                  <h4 className="font-space font-extrabold text-[#1A1D4E] uppercase tracking-wide mb-1.5">No original items cataloged</h4>
                  <p className="text-xs text-gray-400 max-w-sm leading-relaxed">
                    We are currently executing strict brand quality assays on outlets in this category. New products update weekly!
                  </p>
                </div>
              )}
            </div>
          )}

          {/* FEED SECTION G — TRUST BADGES */}
          <div id="section-trust" className="bg-white rounded-3xl border border-gray-100/90 p-6 md:p-8 shadow-[0_15px_40px_rgba(26,29,78,0.02)]">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 rounded-[24px] border border-[#CFD4E6] p-7 lg:p-10 bg-gradient-to-b from-[#EEF1F8]/10 to-white/40 shadow-sm">
              
              <div className="text-center flex flex-col items-center gap-3.5 text-left md:text-center">
                <div className="w-12 h-12 rounded-full bg-[#E8500A]/10 flex items-center justify-center text-[#E54D00] shadow-sm shrink-0 border border-[#E8500A]/5">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-space font-black text-sm text-[#1A1D4E] uppercase tracking-wider mb-2 leading-none">CONSUMER ADVOCACY</h4>
                  <p className="text-[10.5px] text-gray-500 leading-relaxed font-semibold max-w-xs mx-auto">
                    Choosify lists merchant networks complying strictly with independent shopper audits. Our sole intention is safety-oriented purchasing.
                  </p>
                </div>
              </div>

              <div className="text-center flex flex-col items-center gap-3.5 border-t md:border-t-0 md:border-x border-[#CFD4E6]/50 pt-7 md:pt-0">
                <div className="w-12 h-12 rounded-full bg-[#E8500A]/10 flex items-center justify-center text-[#E54D00] shadow-sm shrink-0 border border-[#E8500A]/5">
                  <DollarSign className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-space font-black text-sm text-[#1A1D4E] uppercase tracking-wider mb-2 leading-none">NO PAID PROMOTION</h4>
                  <p className="text-[10.5px] text-gray-500 leading-relaxed font-semibold max-w-xs mx-auto">
                    We refuse merchant sponsorship commissions directly. Brands appear based purely on inventory availability and client satisfaction ratings.
                  </p>
                </div>
              </div>

              <div className="text-center flex flex-col items-center gap-3.5 border-t md:border-t-0 pt-7 md:pt-0">
                <div className="w-12 h-12 rounded-full bg-[#E8500A]/10 flex items-center justify-center text-[#E54D00] shadow-sm shrink-0 border border-[#E8500A]/5">
                  <Star className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-space font-black text-sm text-[#1A1D4E] uppercase tracking-wider mb-2 leading-none">CURATED EXCELLENCE</h4>
                  <p className="text-[10.5px] text-gray-500 leading-relaxed font-semibold max-w-xs mx-auto">
                    All listed retail lots feature solid distributor warranties and standard brand authenticity stamps, guaranteed.
                  </p>
                </div>
              </div>

            </div>
          </div>

        </section>

        {/* RIGHT SIDEBAR */}
        <aside className="hidden xl:flex flex-col gap-6 sticky top-24 h-[calc(100vh-120px)] overflow-y-auto no-scrollbar pb-6 flex-shrink-0">
          
          {/* Card 1 — TRENDING DEALS */}
          <div className="bg-white rounded-[24px] border border-gray-100 p-5.5 shadow-[0_10px_30px_rgba(26,29,78,0.02)] text-left">
            <div className="flex items-center justify-between mb-4.5">
              <h3 className="text-[9.5px] font-black tracking-widest text-[#1A1D4E]/30 uppercase italic">Trending Deals</h3>
              <span className="flex items-center gap-1 bg-red-500 text-white text-[7.5px] font-black px-2 py-0.5 rounded-full uppercase italic leading-none shadow-sm animate-pulse-slow">
                <Flame className="w-2.5 h-2.5" /> FLASH SALE
              </span>
            </div>
            
            <div className="space-y-3.5 max-h-[420px] overflow-y-auto pr-1 no-scrollbar">
              {dealsProducts.map((p: any, idx) => (
                <div 
                  key={idx}
                  onClick={() => navigate(`/products/${p.id}`)}
                  className="flex items-center justify-between gap-3 bg-white hover:bg-[#FFF0E8]/40 border border-gray-150/50 hover:border-[#E8500A]/20 p-2.5 rounded-xl hover:shadow-md transition-all duration-300 cursor-pointer"
                >
                  <div className="w-15 h-15 bg-white rounded-lg flex-shrink-0 overflow-hidden relative border border-gray-100 p-1.5 flex items-center justify-center">
                    <img src={p.image} className="w-full h-full object-contain" alt={p.title} />
                    <div className="absolute -bottom-1 -left-1 w-5 h-5 bg-white shadow-md border border-gray-150 rounded-full flex items-center justify-center z-10 select-none">
                       <Bookmark className="w-2.5 h-2.5 text-[#E8500A] fill-current" />
                    </div>
                    {p.discount && (
                      <span className="absolute top-0.5 right-0.5 bg-red-500 text-white text-[6.5px] font-black px-1 py-0.5 rounded leading-none z-10">
                        {p.discount} OFF
                      </span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0 flex flex-col justify-center text-left pl-1">
                    <span className="text-[8px] font-black uppercase text-gray-400 tracking-wider leading-none mb-0.5 block">{p.brand || 'APEX'}</span>
                    <h4 className="font-space font-extrabold text-[11px] text-[#1A1D4E] uppercase truncate w-full mb-0.5 italic leading-snug">{p.title}</h4>
                    <div className="flex items-baseline gap-1.5 mt-0.5">
                      <span className="text-[12px] font-mono font-black text-[#E8500A] leading-none">৳{p.price.toLocaleString()}</span>
                      {p.originalPrice && (
                        <span className="text-[9px] font-mono text-gray-400 line-through leading-none">৳{p.originalPrice}</span>
                      )}
                    </div>
                  </div>
                  <button 
                    type="button" 
                    onClick={(e) => { 
                      e.stopPropagation(); 
                      addToCart(p, 1); 
                      toast.success(`Successfully added ${p.title} to your verification basket!`);
                    }} 
                    className="w-9 h-9 rounded-full bg-gradient-to-r from-[#FF5B00] to-[#E8500A] text-white flex flex-col items-center justify-center shrink-0 hover:scale-[1.05] active:scale-[0.96] transition-transform shadow-md border-0 cursor-pointer"
                    aria-label="Add to cart"
                  >
                     <span className="text-[7.2px] font-black uppercase font-space tracking-tight leading-none">Add To</span>
                     <span className="text-[7.2px] font-black uppercase font-space tracking-tight leading-none mt-0.5">Cart</span>
                  </button>
                </div>
              ))}
            </div>

            <button 
              onClick={() => toast.success('Loading more exclusive active discount slabs!')} 
              className="w-full text-center text-[10px] font-black text-[#E8500A] hover:text-[#CF4400] uppercase tracking-widest mt-5 flex items-center justify-center gap-1 hover:scale-[1.02] transition-transform"
            >
              Load More Slots <ChevronDown className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Card 2 — POPULAR RECOMMENDATIONS */}
          <div className="bg-white rounded-[24px] border border-gray-100 p-5.5 shadow-[0_10px_30px_rgba(26,29,78,0.02)] text-left">
            <div className="flex items-center justify-between mb-4.5">
              <h3 className="text-[9.5px] font-black tracking-widest text-[#1A1D4E]/30 uppercase italic">Popular Guides</h3>
              <span className="text-[8.5px] font-black bg-[#FFF0E8] text-[#E8500A] px-2.5 py-1 rounded-full leading-none shadow-sm font-mono tracking-widest uppercase text-center">CURATED</span>
            </div>

            <div className="space-y-4">
              {BLOGS.slice(0, 3).map((g) => (
                <div 
                  key={g.id}
                  onClick={() => navigate(`/guides/${g.id}`)}
                  className="group cursor-pointer border-b border-gray-50 pb-3 last:border-b-0 last:pb-0 hover:border-[#E8500A]/30 transition-all duration-300 text-left"
                >
                  <h4 className="font-space font-extrabold text-[11.5px] uppercase text-[#1A1D4E] group-hover:text-[#E8500A] transition-colors line-clamp-2 leading-snug mb-1.5 tracking-tight italic">
                    {g.title}
                  </h4>
                  <div className="flex items-center gap-3 text-[9px] font-mono font-black text-gray-400 uppercase leading-none">
                    <span>👥 {g.views || '120k'} REVIEWS</span>
                    <span>📤 {g.shares || '1k'} RE-SAVES</span>
                  </div>
                </div>
              ))}
            </div>

            <button 
              onClick={() => navigate('/guides')} 
              className="w-full text-center text-[10px] font-black text-[#E8500A] hover:text-[#CF4400] uppercase tracking-widest mt-5 flex items-center justify-center gap-1.5 hover:scale-[1.02] transition-transform"
            >
              Examine More Guides <ChevronDown className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Card 3 — NEWSLETTER */}
          <div className="bg-white rounded-[24px] border border-gray-100 p-5.5 shadow-[0_10px_30px_rgba(26,29,78,0.02)] text-left">
            <div className="mb-4">
              <h3 className="text-[9.5px] font-black tracking-widest text-[#1A1D4E]/30 uppercase mb-1.5 italic">NEWS DISPATCH</h3>
              <p className="text-[11.5px] text-gray-500 font-semibold leading-relaxed">
                Receive newly verified outlet approvals, scam alerts, and business wholesale deals weekly.
              </p>
            </div>
            
            <form onSubmit={handleNewsletterSubmit} className="flex flex-col gap-3">
              <div className="relative">
                <input 
                  type="email" 
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  placeholder="Enter your email address..." 
                  className="w-full h-11 px-4.5 bg-gray-50 border border-gray-150 hover:bg-gray-100 rounded-xl text-xs font-semibold text-[#1A1D4E] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#E8500A]/20 transition-all text-left" 
                />
              </div>
              <button 
                type="submit" 
                className="w-full h-11 bg-[#E8500A] hover:bg-[#CF4400] rounded-xl text-xs font-black text-white tracking-widest uppercase transition-all shadow-md active:scale-95 text-center flex items-center justify-center gap-2 hover:scale-[1.02]"
              >
                SUBSCRIBE NOW <Send className="w-3.5 h-3.5 text-white" />
              </button>
            </form>
          </div>

        </aside>

      </main>

    </div>
  );
}
