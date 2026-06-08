import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Search, ShoppingCart, MessageSquare, Bookmark, ChevronDown, ChevronRight, 
  ChevronLeft, Award, ShoppingBag, Check, ArrowUpRight, Heart, Eye, Share2, 
  Play, ShieldCheck, DollarSign, Star, AlertCircle, PenTool, Award as Trophy,
  Shirt, Smartphone, Gem, Gamepad2, Monitor, Utensils, Cpu, Tv, Home, Baby,
  Palette, Luggage,
  Flame, Sparkles, Send, Users, ShieldAlert, BadgeCheck, Zap, Clock, Book
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
      <section 
        className="hero-section hero-container relative bg-gradient-to-br from-[#0B0D26] via-[#10133A] to-[#1F1746] text-white overflow-hidden py-4 px-6 shadow-inner-lg flex items-center justify-center"
        style={{ height: '303px' }}
      >
        {/* Luminous dynamic background accents */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(232,80,10,0.18)_0%,_transparent_55%)] pointer-events-none" />
        <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[#EEF1F8]/10 to-transparent pointer-events-none" />
        
        {/* Subtle grid pattern helper */}
        <div className="absolute inset-0 opacity-5 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '16px 16px' }} />

        <div 
          className="hero-content max-w-5xl mx-auto text-center relative z-10 flex flex-col items-center justify-center w-full"
        >
          
          {/* Tagline Badge */}
          <div 
            className="inline-flex items-center gap-2 px-3 py-1 bg-white/5 backdrop-blur-md border border-white/10 rounded-full text-[9px] tracking-widest text-[#E8500A] font-extrabold uppercase mb-2 shadow-glow hover:border-white/25 transition-all duration-300"
            style={{ marginBottom: '6px', paddingLeft: '14px', paddingRight: '14px', paddingBottom: '3px', paddingTop: '3px' }}
          >
            <span className="flex h-1.5 w-1.5 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-green-500"></span>
            </span>
            <span className="font-space">Bangladesh's #1 Premium Brand Discovery Shield</span>
          </div>

          {/* Main Typography Header Section */}
          <h1 
            className="font-space font-extrabold text-[#FFFFFF] text-3xl sm:text-4xl md:text-5xl leading-none tracking-tight mb-2 max-w-none"
            style={{ marginBottom: '2px', paddingBottom: '2px', paddingRight: '0px', paddingTop: '2px' }}
          >
            buy <span className="text-orange-primary italic font-black">ORIGINAL</span>
          </h1>

          {/* Supporting Text */}
          <p 
            className="text-xs text-gray-300 max-w-2xl mx-auto font-medium mb-3 leading-relaxed opacity-95"
            style={{ marginBottom: '4px', paddingBottom: '2px', paddingTop: '2px' }}
          >
            Weary of online counterfeiting and merchant fraud? Choosify.bd empowers your shopping with independent brand verification systems in Bangladesh.
          </p>

          {/* Glassmorphic Search Container */}
          <form 
            onSubmit={handleSearchSubmit} 
            className="relative w-full max-w-2xl mx-auto bg-white/10 backdrop-blur-md p-1 rounded-full border border-white/10 shadow-lg focus-within:border-white/20 transition-all duration-300 mb-3"
            style={{ width: '100%', maxWidth: '640px' }}
          >
            <div className="flex items-center bg-white rounded-full">
              <div className="pl-4 text-[#E8500A] shrink-0">
                <Search className="w-4 h-4" />
              </div>
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search authentic Fashion hubs, Smart Gadgets & verified outlets..." 
                className="w-full h-10 bg-transparent outline-none pl-3 pr-24 text-navy text-xs font-semibold placeholder-gray-500 focus:outline-none focus:ring-0 border-none" 
              />
              <button 
                type="submit"
                className="absolute right-1.5 top-1.5 bottom-1.5 px-5 rounded-full bg-gradient-to-r from-[#FF5B00] to-[#E8500A] hover:from-[#E8500A] hover:to-[#CF4400] text-white text-[9px] font-black tracking-widest uppercase flex items-center gap-1.5 shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
              >
                DISCOVER
              </button>
            </div>
          </form>

          {/* Quick Shortcuts / Suggested */}
          <div 
            className="flex flex-wrap items-center justify-center gap-2 text-[10px] text-gray-400 font-semibold mb-0"
            style={{ paddingBottom: '2px', paddingTop: '2px' }}
          >
            <span className="font-mono text-gray-500 uppercase tracking-wider text-[9px]">Hot Targets:</span>
            {['Sailor', 'Aarong', 'Yellow', 'Apex', 'Bata'].map((term) => (
              <button
                key={term}
                type="button"
                onClick={() => {
                  setSearchQuery(term);
                  toast.success(`Scouting verified stores for: "${term}"`);
                  navigate(`/products?q=${encodeURIComponent(term)}`);
                }}
                className="px-2 py-0.5 bg-white/5 hover:bg-white/10 text-gray-300 rounded-full border border-white/5 hover:border-white/10 transition-all cursor-pointer text-[10px]"
              >
                #{term}
              </button>
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
      <main className="max-w-[1700px] mx-auto px-4 py-5 w-full grid grid-cols-1 lg:grid-cols-[240px_minmax(0,1fr)_260px] xl:grid-cols-[280px_minmax(0,1fr)_310px] gap-4 relative">
        
        {/* LEFT STICKY SIDEBAR */}
        <aside 
          className="hidden lg:flex flex-col gap-3 sticky top-24 h-[calc(100vh-120px)] overflow-y-auto no-scrollbar pb-0 flex-shrink-0"
          style={{ paddingLeft: '0px', paddingRight: '0px', paddingBottom: '0px' }}
        >
          
          {/* USER PROFILE */}
          <div className="flex flex-col gap-3 mb-2">
            <h2 className="text-base font-semibold text-[#1a1a2e] text-left">
              YOUR <span className="text-[#E8500A]">PROFILE</span>
            </h2>

            <div className="space-y-3">
              {/* Profile Card */}
              <div className="bg-white rounded-xl border border-[#e8edf2] p-4 flex items-center gap-4.5 shadow-sm">
                <img 
                  src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&h=120&fit=crop" 
                  className="w-10 h-10 rounded-full border border-gray-100 object-cover shrink-0 shadow-sm" 
                  alt="Farhan Bin Rafiq" 
                />
                <h3 className="text-sm font-semibold text-[#1a1a2e]">
                  FARHAN BIN RAFIQ
                </h3>
              </div>

              {/* My Orders Card */}
              <Link 
                to="/dashboard" 
                className="bg-white rounded-xl border border-[#e8edf2] p-4 flex items-center justify-between shadow-sm hover:border-[#E8500A]/25 transition-all duration-300 group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full border border-gray-100 flex items-center justify-center bg-white shadow-inner shrink-0 leading-none">
                    <ShoppingCart className="w-5 h-5 text-[#E8500A]" />
                  </div>
                  <span className="text-[11px] font-semibold text-[#1a1a2e] uppercase">
                    MY ORDERS
                  </span>
                </div>
                <span className="text-[11px] font-medium text-[#8a9bb0] shrink-0">
                  35
                </span>
              </Link>

              {/* Messages Card */}
              <Link 
                to="/messages" 
                className="bg-white rounded-xl border border-[#e8edf2] p-4 flex items-center justify-between shadow-sm hover:border-[#E8500A]/25 transition-all duration-300 group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full border border-gray-100 flex items-center justify-center bg-white shadow-inner shrink-0 leading-none">
                    <MessageSquare className="w-5 h-5 text-[#E8500A]" />
                  </div>
                  <span className="text-[11px] font-semibold text-[#1a1a2e] uppercase">
                    MESSAGES
                  </span>
                </div>
                <span className="text-[11px] font-medium text-[#8a9bb0] shrink-0">
                  20
                </span>
              </Link>

              {/* Saved Items Card */}
              <Link 
                to="/dashboard" 
                className="bg-white rounded-xl border border-[#e8edf2] p-4 flex items-center justify-between shadow-sm hover:border-[#E8500A]/25 transition-all duration-300 group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full border border-gray-100 flex items-center justify-center bg-white shadow-inner shrink-0 leading-none">
                    <Bookmark className="w-5 h-5 text-[#E8500A]" />
                  </div>
                  <span className="text-[11px] font-semibold text-[#1a1a2e] uppercase">
                    SAVED ITEMS
                  </span>
                </div>
                <span className="text-[11px] font-medium text-[#8a9bb0] shrink-0">
                  550
                </span>
              </Link>

              {/* Recently Viewed Card */}
              <Link 
                to="/dashboard" 
                className="bg-white rounded-xl border border-[#e8edf2] p-4 flex items-center justify-between shadow-sm hover:border-[#E8500A]/25 transition-all duration-300 group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full border border-gray-100 flex items-center justify-center bg-white shadow-inner shrink-0 leading-none">
                    <Clock className="w-5 h-5 text-[#E8500A]" />
                  </div>
                  <span className="text-[11px] font-semibold text-[#1a1a2e] uppercase">
                    RECENTLY VIEWED
                  </span>
                </div>
                <span className="text-[11px] font-medium text-[#8a9bb0] shrink-0">
                  15
                </span>
              </Link>

              {/* My Cashbook Card */}
              <Link 
                to="/cashbook" 
                className="bg-white rounded-xl border border-[#e8edf2] p-4 flex items-center justify-between shadow-sm hover:border-[#E8500A]/25 transition-all duration-300 group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full border border-gray-100 flex items-center justify-center bg-white shadow-inner shrink-0 leading-none">
                    <Book className="w-5 h-5 text-[#E8500A]" />
                  </div>
                  <span className="text-[11px] font-semibold text-[#1a1a2e] uppercase">
                    MY CASHBOOK
                  </span>
                </div>
                <span className="text-[11px] font-semibold text-[#E8500A] shrink-0">
                  NEW
                </span>
              </Link>
            </div>
          </div>

          {/* QUICK ACCESS */}
          <div className="bg-white rounded-xl border border-[#e8edf2] p-4 shadow-sm">
            <h3 className="text-[11px] font-semibold text-[#8a9bb0] uppercase mb-3 text-left">QUICK HIGHWAYS</h3>
            <div className="space-y-1 text-xs text-[#1A1D4E] text-left">
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
                  className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-[#FFF0E8] hover:text-[#CF4400] border border-transparent hover:border-[#E8500A]/10 transition-all duration-200"
                >
                  {link.icon}
                  <span className="font-medium text-[12px]">{link.label}</span>
                </Link>
              ))}
            </div>
          </div>

          {/* BRANDS FOLLOWED */}
          <div className="bg-white rounded-xl border border-[#e8edf2] p-4 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-[11px] font-semibold text-[#1a1a2e] uppercase text-left">Brands You Follow</h3>
              <span className="text-[10px] font-medium text-[#E8500A] uppercase tracking-wider bg-[#FFF0E8] px-2.5 py-0.5 rounded-full leading-none">{initialFollowedBrands.length} Active</span>
            </div>
            
            <div className="space-y-2">
              {visibleFollowedBrands.map((b, i) => (
                <div 
                  key={i} 
                  onClick={() => navigate(`/brands/${b.brandId}`)}
                  className="flex items-center gap-3 p-2 rounded-xl hover:bg-gray-50 border border-transparent hover:border-gray-100 transition-all duration-300 cursor-pointer text-left"
                >
                  <div className={`w-9 h-9 rounded-full ${b.bg} text-white font-black flex items-center justify-center text-xs shadow border-2 border-white outline outline-1 outline-gray-200 shrink-0`}>
                    {b.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[12px] font-medium text-[#1A1D4E] truncate leading-tight uppercase">{b.name}</p>
                    <p className="text-[11px] text-gray-400 font-normal truncate mt-0.5">{b.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <button 
              onClick={() => setShowAllFollowed(!showAllFollowed)} 
              className="w-full text-center text-[10px] font-semibold text-[#E8500A] hover:text-[#CF4400] uppercase tracking-widest mt-3 flex items-center justify-center gap-1.5 leading-none transition-transform"
            >
              {showAllFollowed ? 'Collapse List' : 'Expand All'} 
              <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-300 ${showAllFollowed ? 'rotate-180' : ''}`} />
            </button>
          </div>

        </aside>

        {/* CENTER FEED */}
        <section 
          className="flex flex-col gap-4 w-full min-w-0"
          style={{ paddingTop: '0px', paddingLeft: '0px', paddingRight: '0px' }}
        >
          
          {/* Categories Tab Bar */}
          <div 
            className="bg-white/80 backdrop-blur-md rounded-2xl border border-[#e8edf2] p-2.5 shadow-sm select-none relative z-40 sticky top-20"
            style={{ paddingRight: '10px' }}
          >
            <div className="flex items-center gap-3 overflow-x-auto no-scrollbar scroll-smooth">
              {categoryTabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id);
                    toast.success(`Loading verification grid for: ${tab.id}`);
                  }}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full text-[11px] font-medium whitespace-nowrap uppercase leading-none border transition-all duration-300 ${
                    activeTab === tab.id 
                      ? 'bg-[#E8500A] border-[#E8500A] text-white' 
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
              <div id="section-trending-brands" className="bg-white rounded-2xl border border-[#e8edf2] p-5 shadow-sm">
                <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between border-b border-gray-100 pb-3 mb-4 gap-4">
                  <div className="text-left">
                    <div className="flex items-center gap-1">
                      <span className="text-base font-semibold text-[#1a1a2e]">Trending</span>
                      <span className="text-base font-semibold text-[#E8500A]">Brands</span>
                    </div>
                    <p className="text-[12px] text-[#8a9bb0] mt-1 text-left">
                      Connect with thousands of authentic shopper tests and verify brand credentials today.
                    </p>
                  </div>
                  <Link to="/brands" className="text-[12px] font-medium text-[#FF5B00] shrink-0 hover:underline">
                    View All Brands
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
              <div id="section-popular-products" className="bg-white rounded-2xl border border-[#e8edf2] p-5 shadow-sm">
                <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between border-b border-gray-100 pb-3 mb-4 gap-4">
                  <div className="text-left">
                    <div className="flex items-center gap-1">
                      <span className="text-base font-semibold text-[#1a1a2e]">Popular</span>
                      <span className="text-base font-semibold text-[#E8500A]">Products</span>
                    </div>
                    <p className="text-[12px] text-[#8a9bb0] mt-1 text-left">
                      Handpicked, verified, and community tested luxury catalog direct from approved vendors.
                    </p>
                  </div>
                  <Link to="/products" className="text-[12px] font-medium text-[#FF5B00] shrink-0 hover:underline">
                    BROWSE ALL
                  </Link>
                </div>

                {/* Popular Product list in visual cards */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {rightProductsList.slice(0, 4).map((p) => (
                    <ProductCard key={p.id} product={p} variant="compact" />
                  ))}
                </div>
              </div>

              {/* FEED SECTION C — SPOTLIGHT BRAND (Sponsored) */}
              <div id="section-spotlight-brand" className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#2E171C] to-[#1E1114] text-white p-5 md:p-6 border border-[#E8500A]/20 shadow-xl leading-relaxed mb-6">
                
                {/* Embedded Sponsored Spotlight Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between pb-5 mb-5 border-b border-white/10 text-left gap-3 relative z-10">
                  <div className="text-left">
                    <span className="text-[9px] font-mono font-black tracking-[0.25em] text-[#E8500A] uppercase block mb-1">SPONSORED PLATFORM SPOTLIGHT</span>
                    <h2 className="font-space text-2xl font-black italic tracking-tight uppercase leading-none text-white">
                      SPOTLIGHT <span className="text-[#E8500A]">BRAND</span>
                    </h2>
                    <p className="text-[11px] text-zinc-300 font-medium tracking-wide mt-1.5 text-left leading-none">
                      Connect with millions of shoppers and boost your brand visibility today.
                    </p>
                  </div>
                  <div className="flex shrink-0">
                    <span className="border border-[#E8500A]/40 text-[#E8500A] bg-[#E8500A]/10 text-[9.5px] font-black uppercase tracking-wider px-3.5 py-1.5 rounded-full leading-none font-mono">
                      SPONSORED AD
                    </span>
                  </div>
                </div>

                {/* Spotlight Main Header */}
                <div className="grid grid-cols-1 md:grid-cols-[auto_1fr_auto] gap-5 items-center pb-5 border-b border-white/10 relative z-10">
                  
                  {/* Left Logo and View Brand link */}
                  <div className="flex flex-col items-center gap-2 shrink-0">
                    <div className="w-[100px] h-[100px] bg-[#1a1c3a] border border-[#2d2f5a] rounded-xl flex flex-col items-center justify-center p-3 relative group transition-transform duration-300 hover:scale-[1.02] shadow-[inset_0_2px_8px_rgba(0,0,0,0.5)]">
                      <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-[#E8500A] text-white rounded-full flex items-center justify-center border-2 border-[#1a1c3a] shadow">
                        <Check className="w-3 h-3 font-black stroke-[3]" />
                      </span>
                      <div className="text-center font-space font-black text-white text-xl uppercase leading-none italic tracking-tighter">
                        sailor
                        <div className="text-[7px] font-sans tracking-[0.2em] mt-1 uppercase font-medium text-gray-400">BY EPLLYION</div>
                      </div>
                    </div>
                    <Link to="/brands/3" className="text-[10px] font-medium text-white/90 hover:text-[#E8500A] tracking-wider uppercase underline transition-colors">
                      VIEW PROFILE
                    </Link>
                  </div>

                  {/* Middle brand descriptive block */}
                  <div className="flex flex-col gap-2 text-left md:pl-2">
                    <div className="flex flex-wrap items-center gap-3">
                      <h3 className="text-xl font-bold text-white uppercase italic">
                        Sailor
                      </h3>
                      <span className="bg-[#00D03C] text-white text-[9.5px] font-semibold px-2 py-0.5 rounded uppercase tracking-wider leading-none font-mono">
                        VERIFIED BRAND
                      </span>
                    </div>
                    <div>
                      <p className="text-[10px] text-white/70 font-medium tracking-wider uppercase leading-none">
                        FASHION & CLOTHING
                      </p>
                    </div>
                    
                    <div className="flex flex-col gap-1.5 mt-1">
                      <span className="text-[11px] text-white font-normal flex items-center gap-2 tracking-wide uppercase font-mono">
                        <span className="text-rose-500 text-sm">❤️</span> 50,000 SHOPPERS LOVES THE BRANDS
                      </span>
                      <span className="text-[11px] text-white font-normal flex items-center gap-2 tracking-wide uppercase font-mono">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="w-[14px] h-[14px] text-[#00D03C]">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.94" />
                        </svg>
                        SCORE: 92/100
                      </span>
                    </div>
                  </div>

                  {/* Right Stats Block */}
                  <div className="grid grid-cols-3 gap-4 bg-white/5 border border-white/10 rounded-xl p-3.5 mt-2 md:mt-0">
                    <div className="flex flex-col text-left">
                      <span className="text-[#00D03C] text-[10px] font-semibold tracking-wider uppercase font-mono leading-none">BEST FOR</span>
                      <span className="text-white text-[11px] font-semibold uppercase tracking-wider mt-1 leading-none">HANDICRAFTS</span>
                    </div>
                    <div className="flex flex-col text-left border-l border-white/10 pl-4">
                      <span className="text-[#00D03C] text-[10px] font-semibold tracking-wider uppercase font-mono leading-none">BDT 500</span>
                      <span className="text-white text-[11px] font-semibold uppercase tracking-wider mt-1 leading-none">PRICE RANGE</span>
                    </div>
                    <div className="flex flex-col text-[#00D03C] text-left border-l border-white/10 pl-4">
                      <span className="text-[#00D03C] text-[10.5px] font-black tracking-wider uppercase font-mono leading-none">95%</span>
                      <span className="text-white text-[11px] font-semibold uppercase tracking-wider mt-1 leading-none">RECOMMENDED</span>
                    </div>
                  </div>

                </div>

                {/* Sub-list of 4 spotlight products in pristine rollup cards */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-5 relative z-10 text-[#1a1a2e]">
                  {[...sailorProductList, ...rightProductsList].slice(0, 4).map((product: any, idx) => {
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
                        className="bg-white border border-[#e8edf2] hover:border-[#E8500A]/30 rounded-xl p-3 shadow-md hover:scale-[1.01] transition-all duration-300 cursor-pointer flex flex-col gap-2.5 group relative"
                      >
                        {/* Sponsored Badge overlay */}
                        <div className="absolute top-2 left-2 z-10">
                          <span className="bg-orange-primary/15 text-[#E8500A] text-[7.5px] font-extrabold px-1.5 py-0.5 rounded uppercase tracking-wider leading-none">
                            SPONSORED
                          </span>
                        </div>

                        {/* Product Image */}
                        <div className="w-full aspect-square bg-gray-50 rounded-lg overflow-hidden relative border border-gray-100 shrink-0">
                          <img 
                            src={product.image || mockImages[idx]} 
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                            alt={product.title || "Product"} 
                          />
                        </div>

                        <div className="flex flex-col gap-1.5 flex-1 text-left min-h-0">
                          {/* Brand & Rating row */}
                          <div className="flex items-center justify-between gap-1 w-full">
                            <span className="text-[8px] font-bold text-gray-400 uppercase tracking-wider truncate max-w-[80px]">
                              {product.brand || 'SAILOR'}
                            </span>
                            <div className="flex items-center gap-0.5 shrink-0 ml-auto bg-gray-50 px-1 py-0.5 rounded">
                              <Star size={7.5} className="fill-orange-primary text-orange-primary" />
                              <span className="text-[8px] font-semibold text-gray-500">{product.rating || '4.8'}</span>
                            </div>
                          </div>

                          {/* Product Title */}
                          <h4 className="text-[11px] font-medium text-[#1a1a2e] leading-snug line-clamp-2 h-[34px] group-hover:text-orange-primary transition-colors">
                            {product.title}
                          </h4>
                          
                          {/* Pricing and primary CTA row */}
                          <div className="flex items-center justify-between gap-2 mt-auto pt-2 border-t border-gray-100 w-full select-none">
                            <div className="flex flex-col text-left justify-center min-w-0">
                              <span className="text-[11px] font-mono font-semibold text-[#E8500A] tracking-tight">
                                BDT {(product.price || 1200).toLocaleString()}
                              </span>
                              {product.originalPrice && (
                                <span className="text-[8px] font-mono text-gray-400 line-through mt-0.5">
                                  ৳{product.originalPrice}
                                </span>
                              )}
                            </div>
                            
                            <button 
                              type="button" 
                              onClick={(e) => { 
                                e.stopPropagation(); 
                                addToCart(product, 1); 
                                toast.success(`Successfully added ${product.title} to your verification basket!`);
                              }} 
                              className="px-2 py-1 bg-[#E8500A] hover:bg-[#CF4400] text-white text-[8px] font-black rounded uppercase tracking-wider cursor-pointer transition-colors leading-none"
                              aria-label="Add to cart"
                            >
                              ADD
                            </button>
                          </div>

                          {/* Mini Reaction Toolbar for secondary social values */}
                          <div className="flex items-center justify-between border-t border-gray-100 pt-2 mt-2 select-none">
                            <div className="flex items-center gap-2 text-[10px] font-mono text-gray-400">
                              <button 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleSpotlightProductReact(pKey, 'likes');
                                }}
                                className={cn(
                                  "flex items-center gap-0.5 transition-colors",
                                  pState.liked ? "text-rose-500 font-semibold" : "hover:text-rose-500"
                                )}
                              >
                                <Heart className={cn("w-3 h-3", pState.liked ? "fill-current text-rose-500" : "")} />
                                <span>{pState.liked ? "12.1k" : "12k"}</span>
                              </button>
                              
                              <button 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleSpotlightProductReact(pKey, 'views');
                                }}
                                className="flex items-center gap-0.5 hover:text-[#E8500A]"
                              >
                                <Eye className="w-3 h-3" />
                                <span>{(pState.views / 1000).toFixed(1)}k</span>
                              </button>

                              <button 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleSpotlightProductReact(pKey, 'shares');
                                }}
                                className="flex items-center gap-0.5 hover:text-[#E8500A]"
                              >
                                <Share2 className="w-3 h-3" />
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
                <div className="flex items-center justify-between border-t border-white/10 pt-4 mt-5 pb-1">
                  <div className="flex items-center gap-5 text-[11px] text-gray-300 font-mono select-none">
                    
                    {/* Main Container React Button */}
                    <button 
                      onClick={(e) => { e.stopPropagation(); handleSpotlightAction('likes'); }}
                      className={cn(
                        "flex items-center gap-1.5 transition-all text-[11px] cursor-pointer transform active:scale-95",
                        spotlightStates.liked ? "text-rose-500 font-semibold" : "hover:text-rose-455 text-gray-300"
                      )}
                    >
                      <Heart className={cn("w-4 h-4", spotlightStates.liked ? "fill-current text-rose-500 scale-105" : "")} />
                      <span>{spotlightStates.liked ? "12.1k" : "12k"}</span>
                    </button>

                    {/* Main Container Viewed Button */}
                    <button 
                      onClick={(e) => { e.stopPropagation(); handleSpotlightAction('views'); }}
                      className="flex items-center gap-1.5 hover:text-[#E8500A] text-gray-300 transition-colors cursor-pointer"
                    >
                      <Eye className="w-4 h-4" />
                      <span>{(spotlightStates.views / 1000).toFixed(1)}k</span>
                    </button>

                    {/* Main Container Share Button */}
                    <button 
                      onClick={(e) => { e.stopPropagation(); handleSpotlightAction('shares'); }}
                      className="flex items-center gap-1.5 hover:text-[#E8500A] text-gray-300 transition-colors cursor-pointer"
                    >
                      <Share2 className="w-4 h-4" />
                      <span>{spotlightStates.shares}</span>
                    </button>
                  </div>

                  <Link 
                    to="/brands/3" 
                    className="text-[11px] font-medium text-white hover:text-[#E8500A] uppercase tracking-wider flex items-center gap-1 transition-colors"
                  >
                    BROWSE ALL FROM THIS BRAND
                  </Link>
                </div>
              </div>

              {/* FEED SECTION E — FEATURED RECOMMENDATIONS */}
              <div id="section-recommendations" className="bg-white rounded-2xl border border-[#e8edf2] p-5 shadow-sm">
                
                {/* Section Header */}
                <div className="text-left mb-6">
                  <h2 className="text-base font-semibold text-[#1a1a2e]">
                    FEATURED <span className="text-[#E8500A]">RECOMMENDATIONS</span>
                  </h2>
                  <p className="text-[12px] text-[#8a9bb0] mt-1 text-left">
                    Connect with millions of shoppers and boost your brand visibility today.
                  </p>
                </div>

                {/* Main Featured Buying Guide banner blog layout */}
                <div className="border border-[#e8edf2] rounded-xl overflow-hidden shadow-sm hover:border-gray-200/80 transition-all duration-300 mb-6 bg-white flex flex-col group">
                  <div 
                    onClick={() => {
                      handleRecView('featured');
                      navigate(`/guides/${featuredBlog.id}`);
                    }}
                    className="aspect-[1.9/1] w-full bg-slate-950 relative overflow-hidden cursor-pointer"
                  >
                    <img 
                      src="https://images.unsplash.com/photo-1531538606174-0f90ff5dce83?w=1200&h=675&fit=crop" 
                      className="w-full h-full object-cover opacity-85 group-hover:scale-[1.02] transition-transform duration-700" 
                      alt="Featured recommendation" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/25 pointer-events-none" />
                    
                    {/* Top-Left Featured Badge */}
                    <span className="absolute top-4 left-4 inline-flex items-center gap-1 px-2 py-1 bg-[#E8500A] text-white text-[9px] font-semibold uppercase tracking-wider rounded shadow pointer-events-none">
                      ★ FEATURED
                    </span>

                    {/* Top-Right YouTube Badge */}
                    <div className="absolute top-4 right-4 flex flex-col items-center">
                      <div className="w-8 h-8 bg-black/40 backdrop-blur-md border border-white/10 rounded-full flex items-center justify-center text-white hover:bg-[#E8500A] transition-colors shadow">
                        <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                          <path d="M23.498 6.163a3.003 3.003 0 0 0-2.11-2.11C19.517 3.545 12 3.545 12 3.545s-7.516 0-9.387.507A3.003 3.003 0 0 0 .503 6.163C0 8.044 0 12 0 12s0 3.956.503 5.837a3.003 3.003 0 0 0 2.11 2.11c1.871.507 9.387.507 9.387.507s7.517 0 9.387-.507a3.003 3.003 0 0 0 2.11-2.11C24 15.956 24 12 24 12s0-3.956-.502-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                        </svg>
                      </div>
                      <span className="text-[7.5px] font-medium text-white tracking-wider uppercase mt-0.5">Youtube</span>
                    </div>

                    {/* Large Red Circular Play Button Center Override */}
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <div className="w-14 h-14 bg-red-600 hover:bg-red-700 text-white rounded-full flex items-center justify-center shadow scale-100 group-hover:scale-105 transition-transform duration-300 border border-white/10">
                        <Play className="w-6 h-6 fill-current ml-1 text-white" />
                      </div>
                    </div>

                    {/* Lower Image Info text overlays */}
                    <div className="absolute bottom-4 left-4 pr-24 text-left pointer-events-none">
                      <h3 className="text-lg font-bold text-white uppercase tracking-tight leading-tight mb-1">
                        TOP 10 SMARTPHONES TO BUY IN 2026
                      </h3>
                      <p className="text-[10px] text-white/70 font-normal line-clamp-1 italic max-w-2xl">
                        Top 10 Smartphones to Buy in 2026. Find the best phone deals...
                      </p>
                    </div>

                    {/* Length Ticker pill of video element */}
                    <span className="absolute bottom-4 right-4 bg-black/75 backdrop-blur-md text-white text-[9px] font-mono px-2 py-0.5 rounded">
                      8:10
                    </span>
                  </div>

                  {/* Featured Card lower body block */}
                  <div className="p-5 text-left bg-white">
                    <h4 
                      onClick={() => {
                        handleRecView('featured');
                        navigate(`/guides/${featuredBlog.id}`);
                      }}
                      className="text-base font-semibold uppercase text-[#1a1a2e] leading-snug hover:text-[#E8500A] transition-colors cursor-pointer mb-2"
                    >
                      TOP 10 SMARTPHONES TO BUY IN 2026
                    </h4>
                    <p className="text-xs text-[#6B7280] leading-relaxed mb-4">
                      Top 10 Smartphones to Buy in 2026. Find the best phone deals. Complete shopping guidelines containing direct warranty verifications and merchant scoring formulas based on real user trials.
                    </p>

                    {/* Active dynamic interactive toolbar aligned to template */}
                    <div className="flex items-center justify-between border-t border-gray-100 pt-4 mt-auto">
                      <div className="flex items-center gap-5 text-[10.5px] text-gray-400 font-mono select-none">
                        
                        {/* React/Love Button */}
                        <button 
                          onClick={(e) => { e.stopPropagation(); handleRecLike('featured'); }}
                          className={cn(
                            "flex items-center gap-1.5 transition-all duration-250 cursor-pointer",
                            recommendationStates.featured.liked ? "text-rose-500 font-semibold" : "hover:text-[#E8500A]"
                          )}
                        >
                          <Heart className={cn("w-4 h-4", recommendationStates.featured.liked ? "fill-current text-rose-500 scale-105" : "")} /> 
                          <span>{recommendationStates.featured.liked ? "12.1k" : "12k"}</span>
                        </button>

                        {/* Viewed Button */}
                        <button 
                          onClick={(e) => { e.stopPropagation(); handleRecView('featured'); }}
                          className="flex items-center gap-1.5 hover:text-[#E8500A] transition-colors cursor-pointer"
                        >
                          <Eye className="w-4 h-4" /> 
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
                          "w-9 h-9 rounded-full border border-gray-100 flex items-center justify-center bg-white transition-all hover:shadow-sm cursor-pointer",
                          recommendationStates.featured.bookmarked ? "border-[#E8500A]/30 bg-[#FFF0E8]/40" : "hover:border-gray-200"
                        )}
                      >
                        <Bookmark className={cn(
                          "w-4 h-4 transition-colors duration-200", 
                          recommendationStates.featured.bookmarked ? "fill-[#E8500A] text-[#E8505A]" : "text-gray-400"
                        )} />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Sub Guides Grid matching elements visually */}
                <div 
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-8"
                  style={{ paddingTop: '0px', paddingBottom: '0px' }}
                >
                  
                  {/* CARD 1: Reels Card 1 (Vertical Aspect Video) */}
                  <div className="bg-white border border-[#e8edf2] rounded-xl overflow-hidden shadow-sm hover:scale-[1.01] transition-all duration-350 flex flex-col group">
                    <div 
                      onClick={() => handleRecView('card1')}
                      className="relative h-[240px] bg-slate-950 overflow-hidden cursor-pointer"
                    >
                      <img 
                        src="https://images.unsplash.com/photo-1541643600914-78b084683601?w=600&h=1000&fit=crop" 
                        className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-700" 
                        alt="Reel 1 Bottle" 
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-black/30 pointer-events-none" />
                      
                      {/* Top-Left Reel Badge */}
                      <span className="absolute top-3 left-3 inline-flex items-center px-2 py-0.5 bg-white text-black text-[8.5px] font-semibold uppercase tracking-wider rounded border border-gray-100">
                        REEL
                      </span>

                      {/* Top-Right Instagram Badge */}
                      <div className="absolute top-3 right-3 flex flex-col items-center">
                        <div className="w-7 h-7 bg-black/40 backdrop-blur-md rounded-full border border-white/10 flex items-center justify-center text-white">
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5 text-white">
                            <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                            <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                            <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                          </svg>
                        </div>
                      </div>

                      {/* Small Center Play Button */}
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <div className="w-9 h-9 bg-red-600 rounded-full flex items-center justify-center shadow">
                          <Play className="w-4 h-4 fill-current ml-0.5 text-white" />
                        </div>
                      </div>

                      {/* Bottom title overlays on image */}
                      <div className="absolute bottom-3 left-3 pr-12 text-left pointer-events-none">
                        <h4 className="text-sm font-semibold text-white tracking-tight leading-tight">
                          TOP 10 SMARTPHONES TO BUY IN 2026
                        </h4>
                      </div>

                      {/* Video length badge inside image */}
                      <span className="absolute bottom-3 right-3 bg-black/75 backdrop-blur-md text-white text-[8px] font-mono px-1.5 py-0.5 rounded">
                        8:10
                      </span>
                    </div>

                    {/* Card Footer bar actions */}
                    <div className="p-3 bg-white border-t border-gray-100 flex items-center justify-between text-left">
                      <div className="flex items-center gap-3 text-[10px] font-mono text-gray-400 select-none">
                        <button 
                          onClick={(e) => { e.stopPropagation(); handleRecLike('card1'); }}
                          className={cn(
                            "flex items-center gap-1 shrink-0 transition-colors cursor-pointer",
                            recommendationStates.card1.liked ? "text-rose-500 font-semibold" : "hover:text-[#E8500A]"
                          )}
                        >
                          <Heart className={cn("w-3.5 h-3.5", recommendationStates.card1.liked ? "fill-current text-rose-500" : "")} />
                          <span>{recommendationStates.card1.liked ? "12.1k" : "12k"}</span>
                        </button>

                        <button 
                          onClick={(e) => { e.stopPropagation(); handleRecView('card1'); }}
                          className="flex items-center gap-1 hover:text-[#E8500A] transition-colors cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>1.2k</span>
                        </button>

                        <button 
                          onClick={(e) => { e.stopPropagation(); handleRecShare('card1'); }}
                          className="flex items-center gap-1 hover:text-[#E8500A] transition-colors cursor-pointer"
                        >
                          <Share2 className="w-3.5 h-3.5" />
                          <span>{recommendationStates.card1.shares}</span>
                        </button>
                      </div>

                      {/* Bookmark Button */}
                      <button 
                        onClick={(e) => { e.stopPropagation(); handleRecBookmark('card1'); }}
                        className={cn(
                          "w-8 h-8 rounded-full border border-gray-100 flex items-center justify-center bg-white transition-all hover:shadow cursor-pointer",
                          recommendationStates.card1.bookmarked ? "bg-[#FFF0E8]/40 border-[#E8500A]/30 text-[#E8500A]" : "hover:border-gray-200"
                        )}
                      >
                        <Bookmark className={cn("w-3.5 h-3.5", recommendationStates.card1.bookmarked ? "fill-[#E8505A] text-[#E8505A]" : "text-gray-400")} />
                      </button>
                    </div>
                  </div>

                  {/* CARD 2: Blog Text Card 2 (Wide Landscape image & Body) */}
                  <div className="bg-white border border-[#e8edf2] rounded-xl overflow-hidden shadow-sm hover:scale-[1.01] transition-all duration-350 flex flex-col group text-left">
                    <div 
                      onClick={() => handleRecView('card2')}
                      className="relative h-28 bg-slate-900 overflow-hidden cursor-pointer"
                    >
                      <img 
                        src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800&h=500&fit=crop" 
                        className="w-full h-full object-cover opacity-90 group-hover:scale-105 transition-transform duration-700" 
                        alt="Blog Dress" 
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent pointer-events-none" />
                      
                      {/* Top-Left Read Time Badge */}
                      <span className="absolute top-3 left-3 inline-flex items-center px-2 py-0.5 bg-white text-black text-[8.5px] font-semibold uppercase tracking-wider rounded border border-gray-100 font-mono">
                        8 MIN READ
                      </span>

                      {/* Top-Right Blog badge */}
                      <div className="absolute top-3 right-3 flex flex-col items-center">
                        <div className="w-7 h-7 bg-black/40 backdrop-blur-md rounded-full border border-white/10 flex items-center justify-center text-white">
                          <PenTool className="w-3.5 h-3.5 text-white" />
                        </div>
                      </div>
                    </div>

                    {/* Card Content body with heading and excerpt */}
                    <div className="p-3 flex-1 flex flex-col justify-between">
                      <div className="mb-2">
                        <h4 className="text-xs font-semibold uppercase text-[#1a1a2e] group-hover:text-[#E8500A] leading-snug mb-1 transition-colors line-clamp-2">
                          TOP 10 SMARTPHONES TO BUY IN 2026
                        </h4>
                        <p className="text-[11px] text-gray-450 line-clamp-2 leading-relaxed">
                          Top 10 Smartphones to Buy in 2026. Find the best phone deals...
                        </p>
                      </div>

                      {/* Card actions row */}
                      <div className="border-t border-gray-100 pt-3 mt-auto flex items-center justify-between">
                        <div className="flex items-center gap-3 text-[10px] font-mono text-gray-400 select-none">
                          <button 
                            onClick={(e) => { e.stopPropagation(); handleRecLike('card2'); }}
                            className={cn(
                              "flex items-center gap-1 transition-colors cursor-pointer",
                              recommendationStates.card2.liked ? "text-rose-500 font-semibold" : "hover:text-[#E8500A]"
                            )}
                          >
                            <Heart className={cn("w-3.5 h-3.5", recommendationStates.card2.liked ? "fill-current text-rose-500" : "")} />
                            <span>{recommendationStates.card2.liked ? "12.1k" : "12k"}</span>
                          </button>

                          <button 
                            onClick={(e) => { e.stopPropagation(); handleRecView('card2'); }}
                            className="flex items-center gap-1 hover:text-[#E8500A] transition-colors cursor-pointer"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>1.2k</span>
                          </button>

                          <button 
                            onClick={(e) => { e.stopPropagation(); handleRecShare('card2'); }}
                            className="flex items-center gap-1 hover:text-[#E8500A] transition-colors cursor-pointer"
                          >
                            <Share2 className="w-3.5 h-3.5" />
                            <span>{recommendationStates.card2.shares}</span>
                          </button>
                        </div>

                        {/* Bookmark Button */}
                        <button 
                          onClick={(e) => { e.stopPropagation(); handleRecBookmark('card2'); }}
                          className={cn(
                            "w-8 h-8 rounded-full border border-gray-100 flex items-center justify-center bg-white transition-all hover:shadow cursor-pointer",
                            recommendationStates.card2.bookmarked ? "bg-[#FFF0E8]/40 border-[#E8500A]/30 text-[#E8500A]" : "hover:border-gray-200"
                          )}
                        >
                          <Bookmark className={cn("w-3.5 h-3.5", recommendationStates.card2.bookmarked ? "fill-[#E8500A] text-[#E8500A]" : "text-gray-400")} />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* CARD 3: Reels Card 3 (Vertical Aspect Video) */}
                  <div className="bg-white border border-[#e8edf2] rounded-xl overflow-hidden shadow-sm hover:scale-[1.01] transition-all duration-350 flex flex-col group">
                    <div 
                      onClick={() => handleRecView('card3')}
                      className="relative h-[240px] bg-slate-950 overflow-hidden cursor-pointer"
                    >
                      <img 
                        src="https://images.unsplash.com/photo-1541643600914-78b084683601?w=600&h=1000&fit=crop" 
                        className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-700" 
                        alt="Reel 3 Bottle duplicated" 
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-black/30 pointer-events-none" />
                      
                      {/* Top-Left Reel Badge */}
                      <span className="absolute top-3 left-3 inline-flex items-center px-2 py-0.5 bg-white text-black text-[8.5px] font-semibold uppercase tracking-wider rounded border border-gray-100">
                        REEL
                      </span>

                      {/* Top-Right Instagram Badge */}
                      <div className="absolute top-3 right-3 flex flex-col items-center">
                        <div className="w-7 h-7 bg-black/40 backdrop-blur-md rounded-full border border-white/10 flex items-center justify-center text-white">
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5 text-white">
                            <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                            <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                            <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                          </svg>
                        </div>
                      </div>

                      {/* Small Center Play Button */}
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <div className="w-9 h-9 bg-red-600 rounded-full flex items-center justify-center shadow">
                          <Play className="w-4 h-4 fill-current ml-0.5 text-white" />
                        </div>
                      </div>

                      {/* Bottom title overlays on image */}
                      <div className="absolute bottom-3 left-3 pr-12 text-left pointer-events-none">
                        <h4 className="text-sm font-semibold text-white tracking-tight leading-tight">
                          TOP 10 SMARTPHONES TO BUY IN 2026
                        </h4>
                      </div>

                      {/* Video length badge inside image */}
                      <span className="absolute bottom-3 right-3 bg-black/75 backdrop-blur-md text-white text-[8px] font-mono px-1.5 py-0.5 rounded">
                        8:10
                      </span>
                    </div>

                    {/* Card Footer bar actions */}
                    <div className="p-3 bg-white border-t border-gray-100 flex items-center justify-between text-left">
                      <div className="flex items-center gap-3 text-[10px] font-mono text-gray-400 select-none">
                        <button 
                          onClick={(e) => { e.stopPropagation(); handleRecLike('card3'); }}
                          className={cn(
                            "flex items-center gap-1 shrink-0 transition-colors cursor-pointer",
                            recommendationStates.card3.liked ? "text-rose-500 font-semibold" : "hover:text-[#E8500A]"
                          )}
                        >
                          <Heart className={cn("w-3.5 h-3.5", recommendationStates.card3.liked ? "fill-current text-rose-500" : "")} />
                          <span>{recommendationStates.card3.liked ? "12.1k" : "12k"}</span>
                        </button>

                        <button 
                          onClick={(e) => { e.stopPropagation(); handleRecView('card3'); }}
                          className="flex items-center gap-1 hover:text-[#E8500A] transition-colors cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>1.2k</span>
                        </button>

                        <button 
                          onClick={(e) => { e.stopPropagation(); handleRecShare('card3'); }}
                          className="flex items-center gap-1 hover:text-[#E8500A] transition-colors cursor-pointer"
                        >
                          <Share2 className="w-3.5 h-3.5" />
                          <span>{recommendationStates.card3.shares}</span>
                        </button>
                      </div>

                      {/* Bookmark Button */}
                      <button 
                        onClick={(e) => { e.stopPropagation(); handleRecBookmark('card3'); }}
                        className={cn(
                          "w-8 h-8 rounded-full border border-gray-100 flex items-center justify-center bg-white transition-all hover:shadow cursor-pointer",
                          recommendationStates.card3.bookmarked ? "bg-[#FFF0E8]/40 border-[#E8500A]/30 text-[#E8500A]" : "hover:border-gray-200"
                        )}
                      >
                        <Bookmark className={cn("w-3.5 h-3.5", recommendationStates.card3.bookmarked ? "fill-[#E8505A] text-[#E8505A]" : "text-gray-400")} />
                      </button>
                    </div>
                  </div>

                </div>

                {/* Explore all Recommendations bottom action button */}
                <div className="text-center">
                  <Link 
                    to="/guides" 
                    className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#E8500A] hover:bg-[#CF4400] text-white text-[11px] uppercase rounded-full shadow-sm hover:scale-[1.02] active:scale-95 transition-all font-medium"
                  >
                    <span>EXPLORE ALL RECOMMENDATIONS</span>
                  </Link>
                </div>
              </div>

              {/* FEED SECTION F — POPULAR CATEGORIES */}
              <div id="section-categories" className="bg-white rounded-2xl border border-[#e8edf2] p-5 shadow-sm">
                
                {/* Section Header */}
                <div className="flex items-center justify-between mb-5 pb-3 border-b border-gray-100">
                  <div className="text-left">
                    <h2 className="text-base font-semibold text-[#1a1a2e]">
                      POPULAR <span className="text-[#E8500A]">CATEGORIES</span>
                    </h2>
                    <p className="text-[12px] text-[#8a9bb0] mt-1 text-left">
                      EXPLORE BY INDUSTRY & NICHE
                    </p>
                  </div>
                  
                  {/* Show All Category Button on right */}
                  <div className="flex shrink-0">
                    <Link 
                      to="/categories" 
                      className="border border-[#e8edf2] hover:border-[#E8500A]/30 text-[#1a1a2e] hover:text-[#E8500A] text-[10px] font-medium uppercase tracking-wider rounded-lg px-4 py-2 bg-white transition-all hover:scale-[1.01] active:scale-95"
                    >
                      SHOW ALL CATEGORIES
                    </Link>
                  </div>
                </div>

                {/* Categories Grid - 6 beautiful cards exactly matching screenshot */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-left">
                  {popularCategoriesMock.map((cat, idx) => {
                    // Custom high-fidelity category icon picker helper
                    const getCategoryMockIcon = (catName: string) => {
                      const name = catName.toLowerCase();
                      if (name.includes('fashion')) return <Shirt className="w-5 h-5 text-blue-600 stroke-[2]" />;
                      if (name.includes('tech') || name.includes('electronics')) return <Cpu className="w-5 h-5 text-[#1A73E8] stroke-[2]" />;
                      if (name.includes('family') || name.includes('kids')) return <Baby className="w-5 h-5 text-blue-500 stroke-[2]" />;
                      if (name.includes('jewelry') || name.includes('accessories')) return <Gem className="w-5 h-5 text-yellow-500 stroke-[2]" />;
                      if (name.includes('hobby') || name.includes('creativity') || name.includes('hobbies')) return <Palette className="w-5 h-5 text-orange-500 stroke-[2]" />;
                      if (name.includes('travel') || name.includes('hospitality')) return <Luggage className="w-5 h-5 text-rose-500 stroke-[2]" />;
                      return <ShoppingBag className="w-5 h-5 text-gray-500 stroke-[2]" />;
                    };

                    return (
                      <div 
                        key={idx}
                        onClick={() => {
                          setActiveTab(cat.id);
                          toast.success(`Active Category: ${cat.id}`);
                        }}
                        className="bg-white border border-[#e8edf2] rounded-xl p-4 flex flex-col items-start hover:border-gray-200/90 hover:scale-[1.01] transition-all duration-200 cursor-pointer group"
                      >
                        {/* Perfect white circle around the icon styled like mockup */}
                        <div className="w-9 h-9 bg-gray-50 rounded-full flex items-center justify-center mb-4 shrink-0">
                          {getCategoryMockIcon(cat.name)}
                        </div>
                        
                        <div className="w-full">
                          <h4 className="font-medium text-xs text-[#1a1a2e] group-hover:text-[#E8500A] transition-colors leading-tight mb-1 uppercase tracking-tight">
                            {cat.name}
                          </h4>
                          <p className="text-[10px] text-red-500 font-semibold leading-none uppercase font-mono">
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
            <div className="bg-white rounded-2xl border border-[#e8edf2] p-5 shadow-sm min-h-[480px]">
              <div className="flex items-center justify-between border-b border-gray-100 pb-4 mb-6 text-left">
                <div>
                  <h3 className="font-semibold text-base uppercase text-[#1a1a2e] flex items-center gap-2 leading-none">
                    <span className="text-lg leading-none">{categoryTabs.find(t=>t.id===activeTab)?.emoji}</span> {activeTab}
                  </h3>
                  <p className="text-[10px] text-gray-400 mt-1 uppercase tracking-wider font-mono">BROWSING SECURED ORIGINAL PRODUCTS CATALOG</p>
                </div>
                <button 
                  onClick={() => setActiveTab('FEED')}
                  className="px-4 py-2 bg-gray-50 hover:bg-gray-100 rounded-lg text-[10px] uppercase tracking-wider transition-all border border-[#e8edf2]"
                >
                  Return to Feed
                </button>
              </div>

              {filteredProducts.length > 0 ? (
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredProducts.map((p: any) => (
                    <ProductCard key={p.id} product={p} variant="compact" />
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                  <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-350 flex items-center justify-center mb-3">
                    <AlertCircle className="w-6 h-6" />
                  </div>
                  <h4 className="font-medium text-[#1a1a2e] uppercase tracking-wide mb-1">No original items cataloged</h4>
                  <p className="text-xs text-gray-400 max-w-sm leading-relaxed">
                    We are currently executing strict brand quality assays on outlets in this category. New products update weekly!
                  </p>
                </div>
              )}
            </div>
          )}

          {/* FEED SECTION G — TRUST BADGES */}
          <div id="section-trust" className="bg-white rounded-2xl border border-[#e8edf2] p-5 shadow-sm animate-fade-in">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 rounded-xl border border-[#e8edf2] p-5 bg-[#EEF1F8]/10 shadow-none">
              
              <div className="text-center flex flex-col items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#E8500A]/10 flex items-center justify-center text-[#E54D00] shrink-0 border border-[#E8500A]/5">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-[#1a1a2e] uppercase tracking-wide mb-1 leading-none">CONSUMER ADVOCACY</h4>
                  <p className="text-[10.5px] text-gray-500 leading-relaxed max-w-xs mx-auto">
                    Choosify lists merchant networks complying strictly with independent shopper audits. Our sole intention is safety-oriented purchasing.
                  </p>
                </div>
              </div>

              <div className="text-center flex flex-col items-center gap-3 border-t md:border-t-0 md:border-x border-[#CFD4E6]/40 pt-5 md:pt-0">
                <div className="w-10 h-10 rounded-full bg-[#E8500A]/10 flex items-center justify-center text-[#E54D00] shrink-0 border border-[#E8500A]/5">
                  <DollarSign className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-[#1a1a2e] uppercase tracking-wide mb-1 leading-none">NO PAID PROMOTION</h4>
                  <p className="text-[10.5px] text-gray-500 leading-relaxed max-w-xs mx-auto">
                    We refuse merchant sponsorship commissions directly. Brands appear based purely on inventory availability and client satisfaction ratings.
                  </p>
                </div>
              </div>

              <div className="text-center flex flex-col items-center gap-3 border-t md:border-t-0 pt-5 md:pt-0">
                <div className="w-10 h-10 rounded-full bg-[#E8500A]/10 flex items-center justify-center text-[#E54D00] shrink-0 border border-[#E8500A]/5">
                  <Star className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-[#1a1a2e] uppercase tracking-wide mb-1 leading-none">CURATED EXCELLENCE</h4>
                  <p className="text-[10.5px] text-gray-500 leading-relaxed max-w-xs mx-auto">
                    All listed retail lots feature solid distributor warranties and standard brand authenticity stamps, guaranteed.
                  </p>
                </div>
              </div>

            </div>
          </div>

        </section>

        {/* RIGHT SIDEBAR */}
        <aside 
          className="hidden lg:flex flex-col gap-5 sticky top-24 h-[calc(100vh-120px)] overflow-y-auto no-scrollbar mr-0 pl-[2px] pb-0 w-full max-w-[260px] xl:max-w-[310px] flex-shrink-0 animate-fade-in"
          style={{ paddingLeft: '0px', paddingBottom: '0px' }}
        >
          
          {/* Card 1 — TRENDING DEALS */}
          <div className="bg-white rounded-2xl border border-[#e8edf2] p-4.5 shadow-sm text-left">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-100">
              <h3 className="text-sm font-semibold tracking-tight text-[#1a1a2e]">
                TRENDING <span className="text-[#E8500A]">DEALS</span>
              </h3>
              <Link 
                to="/deals" 
                className="text-[10px] font-semibold text-[#E8500A] uppercase tracking-wider hover:text-[#CF4400]"
              >
                SEE ALL
              </Link>
            </div>
            
            <div className="flex flex-col gap-4">
              {[
                {
                  id: 1,
                  title: "Apex Shoes Running Shoes Apex Shoes Running.",
                  img: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=240&h=240&fit=crop",
                  badge: "BEST VALUE",
                  badgeClass: "bg-blue-600 text-white",
                  price: "BDT 2,500"
                },
                {
                  id: 2,
                  title: "Apex Shoes Running Shoes Apex Shoes Running.",
                  img: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=240&h=240&fit=crop",
                  badge: "HOT",
                  badgeClass: "bg-rose-600 text-white",
                  price: "BDT 2,500"
                },
                {
                  id: 3,
                  title: "Apex Shoes Running Shoes Apex Shoes Running.",
                  img: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=240&h=240&fit=crop",
                  badge: "NEW",
                  badgeClass: "bg-emerald-600 text-white",
                  price: "BDT 2,500"
                },
                {
                  id: 4,
                  title: "Apex Shoes Running Shoes Apex Shoes Running.",
                  img: "https://images.unsplash.com/photo-1616683693504-3ea7e9ad6fec?w=240&h=240&fit=crop",
                  badge: "SALE",
                  badgeClass: "bg-gray-900 text-white",
                  price: "BDT 2,500"
                },
                {
                  id: 5,
                  title: "Apex Shoes Running Shoes Apex Shoes Running.",
                  img: "https://images.unsplash.com/photo-1608248597481-496100c80836?w=240&h=240&fit=crop",
                  badge: "SALE",
                  badgeClass: "bg-gray-900 text-white",
                  price: "BDT 2,500"
                }
              ].map((item, idx) => (
                <div 
                  key={idx}
                  className="flex gap-3 bg-white hover:bg-gray-50/50 p-1.5 rounded-xl transition-all duration-200 group text-left"
                >
                  <div className="w-16 h-16 rounded-lg overflow-hidden shrink-0 border border-[#e8edf2] flex items-center justify-center bg-gray-50 relative">
                    <img 
                      src={item.img} 
                      alt={item.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      referrerPolicy="no-referrer"
                    />
                    <div 
                      onClick={(e) => {
                        e.stopPropagation();
                        toast.success('Added to saved items!');
                      }}
                      className="absolute top-1 left-1 w-5 h-5 bg-white rounded-full flex items-center justify-center shadow-sm border border-gray-100 cursor-pointer hover:scale-110 active:scale-90 transition-transform z-10"
                    >
                      <Bookmark className="w-3 h-3 text-[#E8500A]" />
                    </div>
                  </div>

                  <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5 text-left">
                    <div>
                      <div className="flex items-center justify-between gap-1">
                        <span className="text-[8px] font-bold uppercase text-gray-400">APEX</span>
                        <span className={cn("text-[7.2px] font-semibold uppercase px-1.5 py-0.5 rounded tracking-tight shrink-0", item.badgeClass)}>
                          {item.badge}
                        </span>
                      </div>
                      <h4 className="text-[11px] font-medium text-[#1a1a2e] group-hover:text-[#E8500A] transition-colors line-clamp-1 leading-tight mt-1">
                        {item.title}
                      </h4>
                    </div>
                    
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-[11px] font-mono font-semibold text-[#E8500A]">
                        {item.price}
                      </span>
                      <button 
                        type="button" 
                        onClick={(e) => { 
                          e.stopPropagation(); 
                          addToCart({
                            id: `apex-promo-${item.id}`,
                            title: item.title,
                            price: 2500,
                            image: item.img,
                            brand: 'APEX'
                          }, 1); 
                          toast.success(`Successfully added ${item.title} to your verification basket!`);
                        }} 
                        className="px-2 py-1 bg-[#E8500A] hover:bg-[#CF4400] text-white font-semibold rounded text-[8px] uppercase tracking-wide cursor-pointer transition-colors"
                        aria-label="Add to cart"
                      >
                        ADD TO BASKET
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Card 2 — TRENDING BRANDS */}
          <div className="bg-white rounded-2xl border border-[#e8edf2] p-4.5 shadow-sm text-left">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-100">
              <h3 className="text-sm font-semibold tracking-tight text-[#1a1a2e]">
                TRENDING <span className="text-[#E8500A]">BRANDS</span>
              </h3>
              <Link 
                to="/brands" 
                className="text-[10px] font-semibold text-[#E8500A] uppercase tracking-wider hover:text-[#CF4400]"
              >
                SEE ALL
              </Link>
            </div>

            <div className="flex flex-col gap-3">
              {[
                {
                  title: "TOP 10 SMARTPHONES TO BUY IN 2026",
                  img: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=160&h=160&fit=crop",
                  likes: "12k",
                  views: "1.2k",
                  shares: "450"
                },
                {
                  title: "IS THE S24 ULTRA STILL WORTH IT IN LATE 2026?",
                  img: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=160&h=160&fit=crop",
                  likes: "12k",
                  views: "1.2k",
                  shares: "450"
                },
                {
                  title: "IS THE S24 ULTRA STILL WORTH IT IN LATE 2026?",
                  img: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=160&h=160&fit=crop",
                  likes: "12k",
                  views: "1.2k",
                  shares: "450"
                },
                {
                  title: "IS THE S24 ULTRA STILL WORTH IT IN LATE 2026?",
                  img: "https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=160&h=160&fit=crop",
                  likes: "12k",
                  views: "1.2k",
                  shares: "450"
                },
                {
                  title: "IS THE S24 ULTRA STILL WORTH IT IN LATE 2026?",
                  img: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=160&h=160&fit=crop",
                  likes: "12k",
                  views: "1.2k",
                  shares: "450"
                },
                {
                  title: "IS THE S24 ULTRA STILL WORTH IT IN LATE 2026?",
                  img: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=160&h=160&fit=crop",
                  likes: "12k",
                  views: "1.2k",
                  shares: "450"
                }
              ].map((item, idx) => (
                <div 
                  key={idx} 
                  onClick={() => navigate('/guides')}
                  className="flex gap-3 bg-white border border-[#e8edf2] rounded-xl p-2.5 hover:border-gray-200 transition-all duration-200 group cursor-pointer"
                >
                  <div className="w-11 h-11 rounded-lg overflow-hidden shrink-0 border border-[#e8edf2] flex items-center justify-center bg-gray-50">
                    <img 
                      src={item.img} 
                      alt={item.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5 text-left">
                    <h4 className="text-[11px] font-medium text-[#1a1a2e] group-hover:text-[#E8500A] transition-colors line-clamp-1 leading-tight">
                      {item.title}
                    </h4>
                    <div className="flex items-center gap-2.5 text-gray-400 font-mono text-[9px] mt-1">
                      <div className="flex items-center gap-1">
                        <Heart className="w-3 h-3 text-rose-500 fill-rose-50" />
                        <span>{item.likes}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Eye className="w-3 h-3 text-gray-400" />
                        <span>{item.views}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Share2 className="w-3 h-3 text-gray-400" />
                        <span>{item.shares}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 pt-3 border-t border-gray-100">
              <button 
                onClick={() => navigate('/brands')}
                className="w-full py-2 bg-gray-50 hover:bg-gray-100 text-gray-600 rounded-lg text-[10px] font-semibold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors border border-[#e8edf2] cursor-pointer"
              >
                SEE ALL BRANDS <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Card — FOR BUSINESS & SELLERS (REPOSITIONED & EXACT DIMENSIONS) */}
          <div 
            id="section-sellers" 
            className="bg-white rounded-2xl border border-[#e8edf2] p-5 shadow-sm relative overflow-hidden flex flex-col justify-between text-center shrink-0 mx-auto" 
            style={{ width: '282px', height: '464px' }}
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#E8500A]/5 to-[#1c1c3c]/5 rounded-full blur-2xl pointer-events-none" />
            
            <div className="flex flex-col items-center">
              <div className="w-10 h-10 rounded-full bg-[#E8500A]/10 text-[#E8500A] flex items-center justify-center mb-3 border border-[#E8500A]/5 shrink-0 shadow-sm">
                <Sparkles className="w-5 h-5" />
              </div>
              
              <h3 className="text-sm font-semibold uppercase tracking-tight text-[#1a1a2e] leading-snug">
                For Business <span className="text-[#E8500A] italic">& Sellers</span>
              </h3>
              
              <p className="text-[11px] text-gray-400 font-medium mt-2 px-1 leading-relaxed">
                Unlock exclusive tools, secure verified merchant badges, and scale your authentic local reach.
              </p>
            </div>

            <div className="border border-dashed border-[#E8500A]/20 bg-gradient-to-b from-[#FFF0E8]/20 to-white rounded-xl p-4 text-center flex flex-col items-center justify-center my-2 flex-1">
              <h4 className="font-semibold text-gray-900 text-xs uppercase tracking-wider mb-1 leading-none">Boost Sales Today</h4>
              <p className="text-[10px] text-gray-500 mb-4 leading-relaxed max-w-[210px]">
                Gain entry to wholesale deals slots, exposure metrics, and buyer engagement streams.
              </p>
              
              <Link 
                to="/post-offer" 
                className="w-full py-2.5 bg-[#E8500A] hover:bg-[#CF4400] text-white font-semibold rounded-lg text-[10px] uppercase tracking-wider flex items-center justify-center gap-2 transition-colors shadow-sm"
              >
                Post Offer <PenTool className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="flex items-center justify-center gap-1 text-[8.5px] font-semibold text-gray-400 uppercase font-mono tracking-widest shrink-0">
              <Users className="w-3.5 h-3.5" /> 100k+ shopper log Daily
            </div>
          </div>

          {/* Card 3 — NEWSLETTER */}
          <div className="bg-white rounded-2xl border border-[#e8edf2] p-5 shadow-sm text-left">
            <div className="mb-4">
              <h3 className="text-[9px] font-bold tracking-widest text-[#1a1a2e]/40 uppercase mb-1">NEWS DISPATCH</h3>
              <p className="text-[11px] text-gray-500 leading-relaxed">
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
                  className="w-full h-10 px-4 bg-gray-50 border border-[#e8edf2] hover:bg-gray-100 rounded-lg text-xs font-medium text-[#1a1a2e] placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-[#E8500A]/30 transition-all text-left" 
                />
              </div>
              <button 
                type="submit" 
                className="w-full py-2.5 bg-[#E8500A] hover:bg-[#CF4400] rounded-lg text-[10.5px] font-semibold text-white tracking-wider uppercase transition-colors shadow-sm text-center flex items-center justify-center gap-2"
              >
                SUBSCRIBE NOW <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>

        </aside>

      </main>

    </div>
  );
}