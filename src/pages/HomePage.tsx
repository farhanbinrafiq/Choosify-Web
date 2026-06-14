import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Search, ShoppingCart, MessageSquare, Bookmark, ChevronDown, ChevronRight, 
  ChevronLeft, Award, ShoppingBag, Check, ArrowUpRight, Heart, Eye, Share2, 
  Play, ShieldCheck, DollarSign, Star, AlertCircle, PenTool, Award as Trophy,
  Shirt, Smartphone, Gem, Gamepad2, Monitor, Utensils, Cpu, Tv, Home, Baby,
  Palette, Luggage,
  Flame, Sparkles, Send, Users, ShieldAlert, BadgeCheck, Zap, Clock, Book,
  Gift, Package
} from 'lucide-react';
import { ProductCard } from '../components/ProductCard';
import { CampaignBannerCarousel } from '../components/CampaignBannerCarousel';
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
  const [activeStickySection, setActiveStickySection] = useState('all');

  useEffect(() => {
    const handleScroll = () => {
      const sections = [
        { id: 'section-trending-brands', name: 'brands' },
        { id: 'section-popular-products', name: 'products' },
        { id: 'section-hot-deals', name: 'deals' },
        { id: 'section-recommendations', name: 'recommendations' },
        { id: 'section-categories', name: 'categories' },
        { id: 'section-customer-favorites', name: 'favorites' }
      ];
      
      const scrollPosition = window.scrollY + 220;
      let currentSection = 'all';
      
      for (const section of sections) {
        const el = document.getElementById(section.id);
        if (el) {
          const top = el.getBoundingClientRect().top + window.pageYOffset;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            currentSection = section.name;
          }
        }
      }
      setActiveStickySection(currentSection);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    if (id === 'all') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      setActiveStickySection('all');
    } else {
      const el = document.getElementById(id);
      if (el) {
        const offset = 180; // Offset for navbar + sticky selectors
        const elementPosition = el.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - offset;
        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
        
        const nameMap: { [key: string]: string } = {
          'section-trending-brands': 'brands',
          'section-popular-products': 'products',
          'section-hot-deals': 'deals',
          'section-recommendations': 'recommendations',
          'section-categories': 'categories',
          'section-customer-favorites': 'favorites'
        };
        if (nameMap[id]) {
          setActiveStickySection(nameMap[id]);
        }
      }
    }
  };

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

  // Spotlight Brands list (6-10 maximum, let's select 8)
  const spotlightBrands = React.useMemo(() => {
    return rightBrandsList.filter((b: any) => b.ratings >= 4.7 || b.featuredFlag || b.sponsoredFlag).slice(0, 8);
  }, [rightBrandsList]);

  // Products filters based on context & states
  const rightProductsList = allProducts && allProducts.length > 0 ? allProducts : PRODUCTS;

  const sponsoredDeals = React.useMemo(() => {
    const productsList = allProducts && allProducts.length > 0 ? allProducts : PRODUCTS;
    return productsList.filter((p: any) => {
      // Check direct product flags
      if (p.isSponsored || p.sponsored || p.sponsoredStatus || p.sponsoredFlag) return true;
      
      // Look up brand
      const brand = allBrands?.find((b: any) => b.id === p.brandId || b.name?.toLowerCase() === p.brand?.toLowerCase());
      if (brand && brand.sponsoredFlag) return true;
      
      // brandId or brand checks
      if (p.brandId === 1 || p.brandId === 2 || p.brandId === 10) return true;
      const bLower = p.brand?.toLowerCase();
      if (bLower === 'samsung' || bLower === 'apple' || bLower === 'aarong') return true;
      
      return false;
    });
  }, [allProducts, allBrands]);

  const styledSponsoredDeals = React.useMemo(() => {
    return sponsoredDeals.map((p: any, idx: number) => {
      let discountText = 'SPECIAL';
      const cleanPrice = typeof p.price === 'string' ? parseFloat(p.price.replace(/,/g, '')) : p.price;
      const originalPriceVal = p.originalPrice ? (typeof p.originalPrice === 'string' ? parseFloat(p.originalPrice.replace(/,/g, '')) : p.originalPrice) : null;
      
      if (originalPriceVal && originalPriceVal > cleanPrice) {
        const pct = Math.round(((originalPriceVal - cleanPrice) / originalPriceVal) * 100);
        discountText = `${pct}% OFF`;
      } else {
        const pct = 15 + ((idx * 7) % 21);
        discountText = `${pct}% OFF`;
      }
      
      return {
        ...p,
        discountText,
        badgeClass: "bg-[#E8500A] text-white"
      };
    });
  }, [sponsoredDeals]);

  const sponsoredBrandsList = React.useMemo(() => {
    const brandsList = allBrands && allBrands.length > 0 ? allBrands : [];
    return brandsList.filter((b: any) => b.sponsoredFlag);
  }, [allBrands]);

  const viralProductsList = React.useMemo(() => {
    return (allProducts && allProducts.length > 0 ? allProducts : PRODUCTS).map((p, idx) => {
      // Define a stable viral tag sequence based on ID
      let tag = '🔥 Viral';
      let tagColor = 'bg-[#E8500A]';
      let source = '⭐ Choosify Picks';
      
      const badgeType = idx % 5;
      if (badgeType === 0) {
        tag = '🔥 Viral';
        tagColor = 'bg-[#E8500A]';
        source = '⭐ Choosify Picks';
      } else if (badgeType === 1) {
        tag = '❤️ Customer Favorite';
        tagColor = 'bg-rose-500';
        source = '❤️ Customer Favorites';
      } else if (badgeType === 2) {
        tag = '⭐ Staff Pick';
        tagColor = 'bg-amber-500';
        source = '🏆 Editor Choice';
      } else if (badgeType === 3) {
        tag = '🏆 Editor Choice';
        tagColor = 'bg-indigo-600';
        source = '🏆 Editor Choice';
      } else if (badgeType === 4) {
        tag = '🚀 Trending';
        tagColor = 'bg-blue-600';
        source = '👥 Community Submitted';
      }

      return {
        ...p,
        tag,
        tagColor,
        source,
        viralScore: 90 + (idx * 3) % 10,
        viewsThisWeek: 450 + (idx * 112) % 1200,
        heartsCount: 120 + (idx * 56) % 800
      };
    });
  }, [allProducts]);

  const featuredDeals = React.useMemo(() => {
    return (allProducts && allProducts.length > 0 ? allProducts : PRODUCTS).map((p, idx) => {
      // Create curated, realistic discounts and original prices
      const discountPct = 15 + ((idx * 7) % 21); // 15% to 35% discount
      const originalPriceVal = Math.round(p.price / (1 - discountPct / 100));
      
      let tag = '🔥 HOT DEAL';
      let tagColor = 'bg-[#E8500A]';
      const type = idx % 4;
      if (type === 0) {
        tag = '⚡ FLASH DEAL';
        tagColor = 'bg-[#E8500A]';
      } else if (type === 1) {
        tag = '🏷️ LIMITED OFFER';
        tagColor = 'bg-[#FF5B00]';
      } else if (type === 2) {
        tag = '🔥 MEGA SAVING';
        tagColor = 'bg-rose-600';
      } else {
        tag = `${discountPct}% EXCLUSIVE`;
        tagColor = 'bg-[#CF4400]';
      }

      return {
        ...p,
        originalPrice: originalPriceVal.toLocaleString(),
        tag,
        tagColor,
        discountPercent: discountPct
      };
    }).slice(0, 8); // Curb at exactly 8 cards
  }, [allProducts]);

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
        className="hero-section hero-container relative hero-gradient text-white overflow-hidden py-4 px-6 shadow-inner-lg flex items-center justify-center"
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

      {/* FULL WIDTH CAMPAIGN SECTION */}
      <CampaignBannerCarousel />

      {/* GLOBAL STICKY NAVIGATION BAR */}
      <div className="sticky top-[80px] z-30 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm py-3.5">
         <div className="max-w-[1440px] mx-auto px-6">
            <div className="flex items-center justify-start md:justify-center gap-1.5 md:gap-3 overflow-x-auto no-scrollbar py-1 text-[10px] font-black uppercase tracking-wider">
               
               <button 
                 onClick={() => scrollToSection('all')}
                 className={cn(
                   "px-5 py-2.5 rounded-full transition-all shrink-0 cursor-pointer flex items-center gap-1.5",
                   activeStickySection === 'all' 
                     ? "bg-[#E8500A] text-white shadow-md shadow-[#E8500A]/10 italic" 
                     : "bg-gray-50 text-gray-400 hover:text-[#1A1D4E] hover:bg-gray-100"
                 )}
               >
                  All
               </button>
  
               {[
                 { id: 'section-trending-brands', name: 'brands', label: 'Trending Brands', icon: <Award size={13} /> },
                 { id: 'section-popular-products', name: 'products', label: 'Popular Products', icon: <Package size={13} /> },
                 { id: 'section-hot-deals', name: 'deals', label: 'Hot Deals', icon: <Zap size={13} /> },
                 { id: 'section-recommendations', name: 'recommendations', label: 'Recommendations', icon: <Sparkles size={13} /> },
                 { id: 'section-categories', name: 'categories', label: 'Popular Categories', icon: <ShoppingBag size={13} /> },
                 { id: 'section-customer-favorites', name: 'favorites', label: 'Customer Favorites', icon: <Flame size={13} /> }
               ].map(item => (
                 <button 
                   key={item.id}
                   onClick={() => scrollToSection(item.id)}
                   className={cn(
                     "px-5 py-2.5 rounded-full transition-all shrink-0 cursor-pointer flex items-center gap-1.5",
                     activeStickySection === item.name 
                       ? "bg-[#E8500A] text-white shadow-md shadow-[#E8500A]/10 italic" 
                       : "bg-gray-50 text-gray-400 hover:text-[#1A1D4E] hover:bg-gray-100"
                   )}
                 >
                    {item.icon}
                    <span>{item.label}</span>
                 </button>
               ))}
            </div>
         </div>
      </div>

      {/* SECTION 4 — THREE COLUMN GRID */}
      <main className="max-w-[1440px] mx-auto px-4 py-5 w-full grid grid-cols-1 lg:grid-cols-[240px_minmax(0,1fr)_260px] xl:grid-cols-[280px_minmax(0,1fr)_310px] gap-4 relative">
        
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

              {/* Customer Favorites Card */}
              <Link 
                to="/customer-favorite" 
                className="bg-white rounded-xl border border-[#e8edf2] p-4 flex items-center justify-between shadow-sm hover:border-[#E8500A]/25 transition-all duration-300 group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full border border-gray-100 flex items-center justify-center bg-white shadow-inner shrink-0 leading-none">
                    <Flame className="w-5 h-5 text-[#E8500A]" />
                  </div>
                  <span className="text-[11px] font-semibold text-[#1a1a2e] uppercase">
                    CUSTOMER FAVORITES
                  </span>
                </div>
                <span className="text-[11px] font-semibold text-[#E8500A] shrink-0">
                  HOT
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
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  {rightProductsList.slice(0, 4).map((p) => (
                    <ProductCard key={p.id} product={p} variant="compact" />
                  ))}
                </div>
              </div>

              {/* SPOTLIGHT BRANDS SECTION */}
              <div 
                id="section-spotlight-brands" 
                className="p-6 md:p-8 shadow-xl text-left relative overflow-hidden"
                style={{ borderRadius: '16px', backgroundColor: '#1C1410' }}
              >
                {/* 1. HEADER */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-black text-[#F97316] uppercase tracking-[0.25em]">Sponsored Brand</span>
                      <span className="px-1.5 py-0.5 text-[9px] font-black tracking-widest text-[#F97316]/90 border border-[#F97316]/30 uppercase bg-[#F97316]/10 rounded-full">AD</span>
                    </div>
                    <h2 className="text-xl md:text-2xl font-black text-white mt-1 italic tracking-tight">SPOTLIGHT BRAND</h2>
                    <p className="text-xs text-gray-400 mt-1">Discover curated exclusive collections directly from official certified channels.</p>
                  </div>
                  <div>
                    <span className="rounded-full px-2.5 py-1 text-[10px] font-extrabold tracking-wider bg-white/5 text-gray-300 border border-white/10 uppercase">
                      Sponsored AD
                    </span>
                  </div>
                </div>

                <div className="h-[1px] my-5" style={{ backgroundColor: 'rgba(255,255,255,0.08)' }} />

                {/* 2. BRAND IDENTITY ROW */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center bg-white/5 rounded-xl p-4.5 border border-white/5">
                  {/* Zone A: Logo block */}
                  <div className="flex items-center gap-4 cursor-pointer" onClick={() => navigate('/brands/3')}>
                    <div className="relative w-16 h-16 rounded-full bg-white flex items-center justify-center shadow-md border-2 border-[#F97316]/50 transition-transform hover:scale-105">
                      <span className="text-[#1C1410] font-black text-2xl tracking-tighter">S</span>
                      <span className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-white flex items-center justify-center shadow-sm">
                        <svg className="w-4 h-4 text-[#22C55E]" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
                        </svg>
                      </span>
                    </div>
                    <div className="text-left">
                      <span className="text-[10px] font-extrabold text-[#F97316] uppercase tracking-widest block mb-0.5">ESTABLISHED BRAND</span>
                      <span className="text-[11px] font-bold text-gray-400 hover:text-white transition-colors">VIEW PROFILE ➔</span>
                    </div>
                  </div>

                  {/* Zone B: Brand identity info */}
                  <div className="text-left md:border-l md:border-white/10 md:pl-6">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-xl font-bold text-white tracking-tight">Sailor</h3>
                      <span className="bg-[#22C55E]/15 text-[#22C55E] text-[10px] font-extrabold px-2 py-0.5 rounded-full border border-[#22C55E]/20">
                        VERIFIED STORE
                      </span>
                    </div>
                    <p className="text-xs text-gray-400 capitalize">Category: Fashion & Lifestyle</p>
                    <div className="flex items-center gap-2 mt-2 text-xs font-bold text-gray-300">
                      <span className="text-amber-400">4.8 ★★★★★</span>
                      <span className="text-white/40">•</span>
                      <span>450+ Products</span>
                      <span className="text-white/40">•</span>
                      <span>12K Followers</span>
                    </div>
                  </div>

                  {/* Zone C: Metrics block */}
                  <div className="flex flex-wrap md:flex-col lg:flex-row gap-2 justify-start md:justify-end md:border-l md:border-white/10 md:pl-6 w-full">
                    <span className="px-3 py-1.5 text-xs text-white/95 rounded-[5px] font-bold transition-all hover:bg-white/10 text-center" style={{ backgroundColor: 'rgba(255,255,255,0.06)' }}>
                      🛡️ 100% Authentic
                    </span>
                    <span className="px-3 py-1.5 text-xs text-white/95 rounded-[5px] font-bold transition-all hover:bg-white/10 text-center" style={{ backgroundColor: 'rgba(255,255,255,0.06)' }}>
                      ✨ Official Store Deal
                    </span>
                    <span className="px-3 py-1.5 text-xs text-white/95 rounded-[5px] font-bold transition-all hover:bg-white/10 text-center" style={{ backgroundColor: 'rgba(255,255,255,0.06)' }}>
                      ⚡ Express Delivery
                    </span>
                  </div>
                </div>

                {/* 3. PRODUCT GRID */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
                  {sailorProductList.map((product: any, idx: number) => {
                    const pKey = `p${idx + 1}`;
                    const pReact = spotlightProductStates[pKey] || { likes: 12000, views: 1200, shares: 450, liked: false };
                    
                    return (
                      <div 
                        key={product.id}
                        className="bg-white rounded-xl p-3 border border-white/10 hover:shadow-lg transition-all duration-300 flex flex-col justify-between group cursor-pointer text-left relative overflow-hidden"
                        onClick={() => navigate(`/products/${product.id}`)}
                      >
                        {/* Sponsored Badge overlay */}
                        <div className="absolute top-2 left-2 z-10 bg-black/70 text-white text-[9px] font-black tracking-widest uppercase px-2 py-0.5 rounded-full">
                          SPONSORED
                        </div>
                        
                        {/* Image block (clean aspect-square) */}
                        <div className="w-full aspect-square rounded-lg overflow-hidden bg-gray-50 flex items-center justify-center relative mb-3">
                          <img 
                            src={product.image || 'https://images.unsplash.com/photo-1445205170230-053b830c6050?w=400&fit=crop'} 
                            referrerPolicy="no-referrer"
                            alt={product.title}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                        </div>

                        {/* Brand line & Rating */}
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-[9px] font-black tracking-wider uppercase text-gray-400">
                            {product.brand || 'SAILOR OFFICIAL'}
                          </span>
                          <div className="flex items-center gap-0.5 text-amber-500 text-[10px] font-bold">
                            <span>{product.rating || 4.8}</span>
                            <span>★</span>
                          </div>
                        </div>

                        {/* Product title */}
                        <h4 className="text-xs font-bold text-[#1a1a2e] mb-2 truncate group-hover:text-[#F97316] transition-colors">
                          {product.title || product.name}
                        </h4>

                        {/* Price & CTA Button */}
                        <div className="flex items-center justify-between pb-2 border-b border-gray-100 min-h-[32px]">
                          <div className="text-left">
                            <span className="text-[10px] text-gray-400 block -mb-0.5">EXCLUSIVE DEAL</span>
                            <span className="text-sm font-black text-[#1a1a2e]">
                              ৳ {product.price || '1,850'}
                            </span>
                          </div>
                          <button 
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(`/products/${product.id}`);
                            }}
                            className="px-2.5 py-1 text-[10px] font-black uppercase text-white rounded-[5px] transition-all bg-[#F97316] hover:bg-[#E8500A] active:scale-95 shadow-sm"
                          >
                            GET DEAL
                          </button>
                        </div>

                        {/* Interactive Engagement Stats */}
                        <div className="flex items-center justify-between pt-2 text-[10px] text-gray-500" onClick={(e) => e.stopPropagation()}>
                          <button 
                            type="button"
                            onClick={() => handleSpotlightProductReact(pKey, 'likes')}
                            className={`flex items-center gap-1 hover:text-red-500 transition-colors ${pReact.liked ? 'text-red-500 font-extrabold' : 'font-medium'}`}
                          >
                            <span>❤️</span>
                            <span>{pReact.likes.toLocaleString()}</span>
                          </button>
                          
                          <button 
                            type="button"
                            onClick={() => handleSpotlightProductReact(pKey, 'views')}
                            className="flex items-center gap-1 hover:text-blue-500 transition-colors font-medium text-gray-400"
                          >
                            <span>👁️</span>
                            <span>{pReact.views.toLocaleString()}</span>
                          </button>

                          <button 
                            type="button"
                            onClick={() => handleSpotlightProductReact(pKey, 'shares')}
                            className="flex items-center gap-1 hover:text-[#F97316] transition-colors font-medium text-gray-400"
                          >
                            <span>🔗</span>
                            <span>{pReact.shares.toLocaleString()}</span>
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* 4. FOOTER */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6 pt-5 border-t border-white/10">
                  <div className="flex flex-wrap items-center gap-3 text-xs font-bold text-gray-400">
                    <span className="text-[10px] tracking-widest text-[#F97316] uppercase shrink-0">Brand Campaign Stats:</span>
                    <button 
                      type="button"
                      onClick={() => handleSpotlightAction('likes')}
                      className={`flex items-center gap-1 px-2.5 py-1 rounded bg-white/5 border border-white/10 hover:bg-white/10 transition-colors ${spotlightStates.liked ? 'text-red-400 border-red-500/30' : 'text-gray-300'}`}
                    >
                      <span>❤️ Loved:</span>
                      <span>{spotlightStates.likes.toLocaleString()}</span>
                    </button>
                    
                    <button 
                      type="button"
                      onClick={() => handleSpotlightAction('views')}
                      className="flex items-center gap-1 px-2.5 py-1 rounded bg-white/5 border border-white/10 hover:bg-white/10 text-gray-300 transition-colors"
                    >
                      <span>👁️ Views:</span>
                      <span>{spotlightStates.views.toLocaleString()}</span>
                    </button>

                    <button 
                      type="button"
                      onClick={() => handleSpotlightAction('shares')}
                      className="flex items-center gap-1 px-2.5 py-1 rounded bg-white/5 border border-white/10 hover:bg-white/10 text-gray-300 transition-colors"
                    >
                      <span>🔗 Copy Link:</span>
                      <span>{spotlightStates.shares.toLocaleString()}</span>
                    </button>
                  </div>

                  <div>
                    <Link 
                      to="/brands/3" 
                      className="inline-flex items-center gap-1.5 text-xs font-black tracking-widest text-[#F97316] hover:text-[#F97316]/85 hover:underline uppercase transition-all duration-300"
                    >
                      Browse All From Sailor Store ➔
                    </Link>
                  </div>
                </div>
              </div>

              {/* FEED SECTION C — FEATURED HOT DEALS */}
              <div id="section-hot-deals" className="bg-[#FFFFFF] border-t-2 border-[#E8500A] rounded-2xl border border-[#e8edf2] p-5 shadow-sm text-left mb-6">
                
                {/* Section Header */}
                <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between border-b border-gray-100 pb-3 mb-4 gap-4">
                  <div className="text-left">
                    <div className="flex items-center gap-1">
                      <span className="text-base font-semibold text-[#1a1a2e]">Hot</span>
                      <span className="text-base font-semibold text-[#E8500A]">Deals</span>
                    </div>
                    <p className="text-[12px] text-[#8a9bb0] mt-1 text-left">
                      Best ongoing deals, discounts and limited-time offers.
                    </p>
                  </div>

                  <Link 
                    to="/deals" 
                    className="inline-flex items-center gap-1.5 hover:bg-gray-50 text-[#E8500A] hover:text-[#CF4400] text-xs font-bold uppercase tracking-wider rounded-lg transition-all"
                  >
                    View All Deals <ChevronRight size={14} />
                  </Link>
                </div>

                {/* Hot Deals Grid of featured Products */}
                <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 text-left">
                  {featuredDeals.map((product) => (
                    <ProductCard key={product.id} product={product} variant="grid" />
                  ))}
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
                  id="section-guides"
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
              <div id="section-categories" className="bg-white rounded-[5px] border border-[#e8edf2] p-5 shadow-sm">
                
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
                        className="bg-white border border-[#e8edf2] rounded-[5px] p-4 flex flex-col items-start hover:border-gray-200/90 hover:scale-[1.01] transition-all duration-200 cursor-pointer group"
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

              {/* FEED SECTION H — CUSTOMER FAVORITES */}
              <div id="section-customer-favorites" className="bg-white rounded-[5px] border border-[#e8edf2] p-5 shadow-sm mt-6">
                {/* Section Title Header */}
                <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between border-b border-gray-100 pb-4 mb-5 gap-3">
                  <div className="text-left">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-base font-bold text-[#1a1a2e] uppercase tracking-tight">Customer</span>
                      <span className="text-base font-bold text-[#E8500A] uppercase tracking-tight">Favorites</span>
                      <span className="bg-rose-100 text-rose-600 text-[10px] font-semibold px-2 py-0.5 rounded-full uppercase tracking-wider font-mono">Loved</span>
                    </div>
                    <p className="text-[11px] text-[#8a9bb0] mt-1 text-left">
                      Trending products loved by Choosify editors and verified customers.
                    </p>
                  </div>

                  <Link 
                    to="/customer-favorite" 
                    className="inline-flex items-center gap-1.5 hover:bg-gray-50 text-[#E8500A] hover:text-[#CF4400] text-xs font-bold uppercase tracking-wider rounded-lg transition-all"
                  >
                    View All Customer Favorites <ChevronRight size={14} />
                  </Link>
                </div>

                {/* Customer Favorites Grid of featured Products with isGuideDetail={true} */}
                <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 text-left">
                  {viralProductsList.slice(0, 8).map((product) => (
                    <ProductCard key={product.id} product={product} variant="grid" isGuideDetail={true} />
                  ))}
                </div>
              </div>
            </>
          ) : (
            /* NON-FEED CATEGORY DISPLAY GRID */
            <div className="bg-white rounded-[5px] border border-[#e8edf2] p-5 shadow-sm min-h-[480px]">
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
          <div id="section-trust" className="bg-white rounded-[5px] border border-[#e8edf2] p-5 shadow-sm animate-fade-in">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 rounded-[5px] border border-[#e8edf2] p-5 bg-[#EEF1F8]/10 shadow-none">
              
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
          
          {/* Card 1 — Sponsored Deals */}
          <div className="bg-white rounded-[5px] border border-[#e8edf2] p-4.5 shadow-sm text-left">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-100">
              <h3 className="text-sm font-semibold tracking-tight text-[#1a1a2e]">
                Sponsored <span className="text-[#E8500A]">Deals</span>
              </h3>
              <Link 
                to="/deals" 
                className="text-[10px] font-semibold text-[#E8500A] uppercase tracking-wider hover:text-[#CF4400]"
              >
                SEE ALL
              </Link>
            </div>
            
            <div className="flex flex-col gap-4">
              {styledSponsoredDeals.length === 0 ? (
                <div className="text-center py-6 border border-dashed border-gray-200 rounded-lg">
                  <p className="text-xs text-gray-400 font-medium">Sponsored deals will appear here.</p>
                </div>
              ) : (
                styledSponsoredDeals.slice(0, 5).map((item, idx) => (
                  <div 
                    key={item.id || idx}
                    onClick={() => navigate(`/products/${item.id}`)}
                    className="flex gap-3 bg-white hover:bg-gray-50/50 p-1.5 rounded-[5px] transition-all duration-200 group text-left cursor-pointer"
                  >
                    <div className="w-16 h-16 rounded-lg overflow-hidden shrink-0 border border-[#e8edf2] flex items-center justify-center bg-gray-50 relative">
                      <img 
                        src={item.image} 
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
                          <span className="text-[8px] font-bold uppercase text-gray-400">{item.brand}</span>
                          <span className={cn("text-[7.2px] font-semibold uppercase px-1.5 py-0.5 rounded tracking-tight shrink-0", item.badgeClass)}>
                            {item.discountText}
                          </span>
                        </div>
                        <h4 className="text-[11px] font-medium text-[#1a1a2e] group-hover:text-[#E8500A] transition-colors line-clamp-1 leading-tight mt-1">
                          {item.title}
                        </h4>
                      </div>
                      
                      <div className="flex items-center justify-between mt-1">
                        <span className="text-[11px] font-mono font-semibold text-[#E8500A]">
                          BDT {typeof item.price === 'number' ? item.price.toLocaleString() : item.price}
                        </span>
                        <button 
                          type="button" 
                          onClick={(e) => { 
                            e.stopPropagation(); 
                            navigate(`/products/${item.id}`);
                          }} 
                          className="px-2 py-1 bg-[#E8500A] hover:bg-[#CF4400] text-white font-semibold rounded text-[8px] uppercase tracking-wide cursor-pointer transition-colors"
                          aria-label="Shop now"
                        >
                          SHOP NOW
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Card 2 — Sponsored Brands */}
          <div className="bg-white rounded-[5px] border border-[#e8edf2] p-4.5 shadow-sm text-left">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-100">
              <h3 className="text-sm font-semibold tracking-tight text-[#1a1a2e]">
                Sponsored <span className="text-[#E8500A]">Brands</span>
              </h3>
              <Link 
                to="/brands" 
                className="text-[10px] font-semibold text-[#E8500A] uppercase tracking-wider hover:text-[#CF4400]"
              >
                SEE ALL
              </Link>
            </div>

            <div className="flex flex-col gap-3">
              {sponsoredBrandsList.length === 0 ? (
                <div className="text-center py-6 border border-dashed border-gray-200 rounded-lg">
                  <p className="text-xs text-gray-400 font-medium">Sponsored brands will appear here.</p>
                </div>
              ) : (
                sponsoredBrandsList.map((brand: any, idx) => (
                  <div 
                    key={brand.id || idx} 
                    onClick={() => navigate(`/brands/${brand.id}`)}
                    className="flex gap-3 bg-white border border-[#e8edf2] rounded-[5px] p-2.5 hover:border-gray-200 transition-all duration-200 group cursor-pointer text-left animate-fade-in"
                  >
                    <div className="w-11 h-11 rounded-lg border border-[#e8edf2] flex items-center justify-center bg-[#E8500A]/5 text-[#E8500A] font-extrabold text-sm uppercase shrink-0">
                      {brand.logo}
                    </div>
                    <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5 text-left">
                      <h4 className="text-[11px] font-semibold text-[#1a1a2e] group-hover:text-[#E8500A] transition-colors line-clamp-1 leading-tight">
                        {brand.name}
                      </h4>
                      <div className="flex items-center justify-between mt-1">
                        <span className="text-[9.5px] text-gray-400 font-normal truncate max-w-[110px]">
                          {brand.category || 'Advertiser Brand'}
                        </span>
                        <span className="text-[9px] font-semibold text-[#E8500A] uppercase tracking-wider hover:text-[#CF4400] transition-colors whitespace-nowrap shrink-0 ml-auto">
                          VIEW BRAND
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              )}
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
            className="bg-white rounded-[5px] border border-[#e8edf2] p-5 shadow-sm relative overflow-hidden flex flex-col justify-between text-center shrink-0 mx-auto" 
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

            <div className="border border-dashed border-[#E8500A]/20 bg-gradient-to-b from-[#FFF0E8]/20 to-white rounded-[5px] p-4 text-center flex flex-col items-center justify-center my-2 flex-1">
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
          <div className="bg-white rounded-[5px] border border-[#e8edf2] p-5 shadow-sm text-left">
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