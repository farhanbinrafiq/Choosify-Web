import React, { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Home, ChevronRight, BadgePercent, Clock, Percent, ShoppingBag, Star, 
  Tags, Landmark, SlidersHorizontal, Heart, Bookmark, ShoppingCart, 
  ShieldCheck, Award, RotateCcw, Lock, Search, Mail, ArrowUpRight, Check,
  Sparkles, ChevronLeft, Ticket, Tag, Flame, Gift, ArrowRight, Laptop, Smartphone,
  Headphones, Watch, Tv, Gamepad, Cable, Camera, HelpCircle
} from 'lucide-react';
import { ProductCard } from '../components/ProductCard';
import { useRegisterPageFilters, UniversalFilterRenderer } from '../components/FilterEngine';

// Import custom generated hero banner image
// @ts-expect-error raw image asset import
import heroBannerImg from '../assets/images/deals_hero_banner_1783876480998.jpg';

interface Product {
  id: string;
  title: string;
  brand: string;
  image: string;
  price: number;
  originalPrice: number;
  discount: string;
  tag?: 'HOT' | 'SALE' | 'NEW';
  likes: number;
  rating: number;
  reviewsText: string;
  category: string;
  claimedPercent: number;
}

export function DealsPage() {
  const navigate = useNavigate();

  // Active filters and interactions
  const [activeTab, setActiveTab] = useState('All Deals');
  const [selectedCategory, setSelectedCategory] = useState('All Deals');
  const [sortOption, setSortOption] = useState('Most Popular');
  const [searchQuery, setSearchQuery] = useState('');
  const [likedProducts, setLikedProducts] = useState<string[]>([]);
  const [cartCount, setCartCount] = useState<number>(0);
  const [newsletterEmail, setNewsletterEmail] = useState('');

  // 12:45:32 Countdown Timer for Flash Deals
  const [flashHours, setFlashHours] = useState(12);
  const [flashMinutes, setFlashMinutes] = useState(45);
  const [flashSeconds, setFlashSeconds] = useState(32);

  // 08:12:45 Countdown Timer for Deal of the Day
  const [dealHours, setDealHours] = useState(8);
  const [dealMinutes, setDealMinutes] = useState(12);
  const [dealSeconds, setDealSeconds] = useState(45);

  // Countdown clock effect
  useEffect(() => {
    const timer = setInterval(() => {
      // Flash Deals Countdown
      setFlashSeconds(prev => {
        if (prev > 0) return prev - 1;
        setFlashMinutes(m => {
          if (m > 0) return m - 1;
          setFlashHours(h => (h > 0 ? h - 1 : 12));
          return 59;
        });
        return 59;
      });

      // Deal of the Day Countdown
      setDealSeconds(prev => {
        if (prev > 0) return prev - 1;
        setDealMinutes(m => {
          if (m > 0) return m - 1;
          setDealHours(h => (h > 0 ? h - 1 : 8));
          return 59;
        });
        return 59;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Format double digit helper
  const formatTimeNum = (num: number) => String(num).padStart(2, '0');

  // Likes toggle callback
  const handleLike = (id: string, name: string, e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    const isLiked = likedProducts.includes(id);
    if (isLiked) {
      setLikedProducts(prev => prev.filter(item => item !== id));
      toast.success(`Removed like from ${name}`);
    } else {
      setLikedProducts(prev => [...prev, id]);
      toast.success(`Added ${name} to wishlist!`, { icon: '❤️' });
    }
  };

  useRegisterPageFilters({
    pageName: 'Deals',
    renderSearch: () => (
      <div className="relative">
        <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
          <Search size={13} className="text-[#FF5B00]" />
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search active deals..."
          className="w-full h-9 pl-8 pr-3 bg-white border border-[#e8edf2] rounded-[5px] text-[11px] font-semibold text-[#1A1D4E] placeholder-gray-400 focus:outline-none focus:border-[#FF5B00]/50 transition-colors"
        />
      </div>
    ),
    renderFilters: () => (
      <div className="flex flex-col gap-4 mt-4">
        <UniversalFilterRenderer
          profile={{
            entity: 'deals',
            filters: [
              {
                id: 'deal-type',
                name: 'Deal Type',
                type: 'multi_select',
                options: [
                  { value: 'flash-deals', label: 'Flash Deals' },
                  { value: 'clearance', label: 'Clearance' },
                  { value: 'year-end', label: 'Year-End Sale' },
                  { value: 'coupons', label: 'Coupons' }
                ]
              },
              {
                id: 'discount',
                name: 'Discount %',
                type: 'single_select',
                options: [
                  { value: '10+', label: '10% Off or more' },
                  { value: '25+', label: '25% Off or more' },
                  { value: '50+', label: '50% Off or more' },
                  { value: '70+', label: '70% Off or more' }
                ]
              },
              {
                id: 'bank-offers',
                name: 'Bank Offers',
                type: 'multi_select',
                options: [
                  { value: 'city-bank', label: 'City Bank Amex' },
                  { value: 'brac-bank', label: 'BRAC Bank' },
                  { value: 'ebl', label: 'EBL Cards' }
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

  const handleAddToCart = (name: string, e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setCartCount(prev => prev + 1);
    toast.success(`Added ${name} to your cart!`, {
      icon: '🛒',
      style: {
        background: '#FF5B00',
        color: '#fff',
        fontWeight: 'bold',
      }
    });
  };

  const handleCopyCoupon = (code: string) => {
    navigator.clipboard.writeText(code);
    toast.success(`Coupon code "${code}" copied!`, {
      icon: '✂️',
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
    toast.success(`Thank you for subscribing, ${newsletterEmail}!`, { icon: '🎉' });
    setNewsletterEmail('');
  };

  // Dataset mapping 100% exactly to screenshot items
  const FLASH_DEAL_CARDS: Product[] = [
    {
      id: 'fd-1',
      title: 'Samsung Galaxy S24 Ultra',
      brand: 'SAMSUNG',
      price: 145000,
      originalPrice: 165000,
      discount: '-12% OFF',
      tag: 'HOT',
      likes: 239,
      rating: 4.8,
      reviewsText: '1.2K',
      category: 'Smartphones',
      claimedPercent: 82,
      image: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=400&q=80'
    },
    {
      id: 'fd-2',
      title: 'AirPods Pro (2nd Gen)',
      brand: 'APPLE',
      price: 25900,
      originalPrice: 30900,
      discount: '-16% OFF',
      tag: 'HOT',
      likes: 157,
      rating: 4.8,
      reviewsText: '2.1K',
      category: 'Audio',
      claimedPercent: 65,
      image: 'https://images.unsplash.com/photo-1588449668338-d15176090c44?w=400&q=80'
    },
    {
      id: 'fd-3',
      title: 'MacBook Air M3',
      brand: 'APPLE',
      price: 128000,
      originalPrice: 145000,
      discount: '-20% OFF',
      tag: 'HOT',
      likes: 219,
      rating: 4.7,
      reviewsText: '860',
      category: 'Laptops',
      claimedPercent: 74,
      image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&q=80'
    }
  ];

  const TOP_DEALS_DATA = [
    {
      id: 'top-1',
      title: "Apex Men's Royal Loafer",
      brand: 'APEX',
      price: 3280,
      originalPrice: 4200,
      discount: '23% OFF',
      tag: 'SALE',
      likes: 188,
      rating: 4.6,
      reviewsText: '321',
      category: 'Fashion',
      image: 'https://images.unsplash.com/photo-1533867617858-e7b97e060509?w=400&q=80'
    },
    {
      id: 'top-2',
      title: "Galaxy S24 Ultra",
      brand: 'SAMSUNG',
      price: 145000,
      originalPrice: 165000,
      discount: '12% OFF',
      likes: 239,
      rating: 4.8,
      reviewsText: '1.2K',
      category: 'Smartphones',
      image: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=400&q=80'
    },
    {
      id: 'top-3',
      title: "MacBook Air M3",
      brand: 'APPLE',
      price: 128000,
      originalPrice: 145000,
      discount: '12% OFF',
      likes: 219,
      rating: 4.7,
      reviewsText: '860',
      category: 'Laptops',
      image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&q=80'
    },
    {
      id: 'top-4',
      title: "WH-1000XM5",
      brand: 'SONY',
      price: 32900,
      originalPrice: 41900,
      discount: '30% OFF',
      likes: 198,
      rating: 4.8,
      reviewsText: '1.1K',
      category: 'Audio',
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&q=80'
    },
    {
      id: 'top-5',
      title: "14T Pro",
      brand: 'XIAOMI',
      price: 54990,
      originalPrice: 66900,
      discount: '17% OFF',
      likes: 278,
      rating: 4.7,
      reviewsText: '701',
      category: 'Smartphones',
      image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&q=80'
    }
  ];

  const COUPONS_DATA = [
    { code: 'CHOOSIFY10', discount: '10% OFF', minSpend: 'BDT 5,000' },
    { code: 'SAVE15', discount: '15% OFF', minSpend: 'BDT 10,000' },
    { code: 'EMIS', discount: '5% OFF', minSpend: 'BDT 3,000' }
  ];

  const NAV_ITEMS = [
    { label: 'All Deals', sub: '12,468 Deals', icon: Percent },
    { label: 'Coupons', sub: '2,345 Offers', icon: Ticket },
    { label: 'Product Deals', sub: '8,942 Items', icon: Tag },
    { label: 'Brand Deals', sub: '356 Brands', icon: ShoppingBag },
    { label: 'Bank Offers', sub: '128 Offers', icon: Landmark },
    { label: 'Sale', sub: 'Seasonal Sales', icon: Flame },
    { label: 'Clearance Sale', sub: 'Big Savings', icon: Tags },
    { label: 'Year End Sale', sub: 'Special Prices', icon: Gift }
  ];

  return (
    <div className="flex flex-col min-h-screen bg-[#F5F8FD] text-gray-800 pb-20 select-none font-sans">
      
      {/* 1 & 2. EDGE-TO-EDGE HERO SECTION WITH INTEGRATED BREADCRUMBS */}
      <section className="w-full bg-gradient-to-r from-[#03061C] via-[#050B2C] to-[#14062B] py-12 md:py-16 relative overflow-hidden shrink-0">
        
        {/* Ambient Lighting */}
        <div className="absolute top-0 left-1/4 w-[350px] h-[350px] bg-[#FF5B00]/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-[300px] h-[300px] bg-[#8B5CF6]/10 rounded-full blur-[100px] pointer-events-none" />

        {/* Constrained Content Container */}
        <div className="max-w-[1600px] mx-auto w-full px-6 md:px-10 relative z-10">
          
          {/* Breadcrumb row inside the hero */}
          <nav className="text-xs font-semibold text-gray-400 flex items-center gap-1.5 uppercase tracking-wider mb-8 select-none">
            <Link to="/" className="hover:text-[#FF5B00] transition-colors">Home</Link>
            <span className="text-gray-500 font-bold">&gt;</span>
            <span className="text-white font-bold">Deals</span>
          </nav>

          <div className="flex flex-col md:flex-row items-center justify-between gap-10">
            
            {/* Left Text details */}
            <div className="max-w-xl text-left flex-1">
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white leading-tight uppercase font-sans">
                DEALS THAT MAKE <br />
                <span className="text-[#FF5B00]">SMART SHOPPERS SMILE.</span>
              </h1>
              <p className="text-sm md:text-base text-gray-300 mt-4 leading-relaxed max-w-md font-medium">
                Limited-time offers, exclusive coupons, and unbeatable prices from trusted brands.
              </p>

              {/* Feature row inside hero */}
              <div className="grid grid-cols-2 gap-y-4 gap-x-6 mt-8 pt-6 border-t border-white/10 max-w-lg">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-[#FF5B00] shrink-0">
                    <Star className="w-4 h-4 fill-current text-[#FF5B00]" />
                  </div>
                  <div className="text-left">
                    <h4 className="text-xs font-bold text-white leading-none">100% Authentic</h4>
                    <p className="text-[10px] text-gray-400 mt-1">Verified Deals</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-[#FF5B00] shrink-0">
                    <Award className="w-4 h-4 text-[#FF5B00]" />
                  </div>
                  <div className="text-left">
                    <h4 className="text-xs font-bold text-white leading-none">Best Price Guarantee</h4>
                    <p className="text-[10px] text-gray-400 mt-1">We beat any lower price</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-[#FF5B00] shrink-0">
                    <Lock className="w-4 h-4 text-[#FF5B00]" />
                  </div>
                  <div className="text-left">
                    <h4 className="text-xs font-bold text-white leading-none">Secure Payments</h4>
                    <p className="text-[10px] text-gray-400 mt-1">100% secure checkout</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-[#FF5B00] shrink-0">
                    <RotateCcw className="w-4 h-4 text-[#FF5B00]" />
                  </div>
                  <div className="text-left">
                    <h4 className="text-xs font-bold text-white leading-none">Easy Returns</h4>
                    <p className="text-[10px] text-gray-400 mt-1">7-day return policy</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right illustration backdrop */}
            <div className="relative w-full md:w-[45%] h-[320px] hidden md:block shrink-0 overflow-hidden rounded-2xl border border-white/10">
              <div className="absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-[#03061C] to-transparent z-10" />
              <img 
                src={heroBannerImg} 
                alt="Promotional Bag, gifts, clock and discount tags illustration" 
                className="w-full h-full object-cover object-right"
                referrerPolicy="no-referrer"
              />
            </div>

          </div>

        </div>
      </section>

      {/* 3. DEALS CATEGORY NAVIGATION (Floating White Card) */}
      <section className="max-w-[1600px] mx-auto w-full px-6 md:px-10 mb-8 shrink-0">
        <div className="bg-white rounded-3xl p-3 shadow-md border border-[#EEF2F7] overflow-x-auto no-scrollbar">
          <div className="flex items-center justify-between gap-1 min-w-[1000px]">
            {NAV_ITEMS.map((item, idx) => {
              const IconComp = item.icon;
              const isActive = item.label === 'All Deals';
              return (
                <button
                  key={idx}
                  onClick={() => {
                    setSelectedCategory(item.label);
                    toast.success(`Category: ${item.label}`);
                  }}
                  className={`flex-1 flex flex-col items-center justify-center text-center py-4 px-2 rounded-2xl transition-all duration-300 border border-transparent ${
                    isActive 
                      ? 'bg-orange-50/40 text-[#FF5B00]' 
                      : 'hover:bg-gray-50 text-gray-700'
                  }`}
                >
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-3 transition-colors ${
                    isActive ? 'bg-[#FF5B00] text-white' : 'bg-gray-100 text-gray-500'
                  }`}>
                    <IconComp className="w-5 h-5" />
                  </div>
                  <h4 className={`text-xs font-bold leading-none tracking-tight ${isActive ? 'text-[#FF5B00]' : 'text-gray-800'}`}>
                    {item.label}
                  </h4>
                  <p className={`text-[10px] mt-1.5 leading-none font-semibold ${isActive ? 'text-[#FF5B00]/70' : 'text-gray-400'}`}>
                    {item.sub}
                  </p>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* 4. FILTER BAR */}
      <section className="max-w-[1600px] mx-auto w-full px-6 md:px-10 mb-8 shrink-0 text-left">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-[#EEF2F7] pb-4">
          
          {/* Left pill buttons */}
          <div className="flex flex-wrap items-center gap-2">
            {['All Deals', 'Featured', 'Top Rated', 'Expiring Soon', 'Trending'].map((pill) => {
              const isSelected = activeTab === pill;
              return (
                <button
                  key={pill}
                  onClick={() => {
                    setActiveTab(pill);
                    toast.success(`Viewing ${pill}`);
                  }}
                  className={`h-9 px-5 rounded-full text-xs font-bold tracking-wide transition-all duration-200 cursor-pointer ${
                    isSelected 
                      ? 'bg-[#FF5B00] text-white shadow-sm shadow-[#FF5B00]/20' 
                      : 'bg-white border border-[#EEF2F7] hover:border-gray-300 text-gray-600 hover:text-gray-800'
                  }`}
                >
                  {pill}
                </button>
              );
            })}
          </div>

          {/* Right controls */}
          <div className="flex items-center gap-3 self-end sm:self-auto">
            <div className="flex items-center gap-2 bg-white border border-[#EEF2F7] rounded-xl px-3 py-1.5 text-xs font-bold text-gray-600">
              <span className="text-gray-400">Sort by:</span>
              <select 
                value={sortOption} 
                onChange={(e) => {
                  setSortOption(e.target.value);
                  toast.success(`Sorted by: ${e.target.value}`);
                }}
                className="bg-transparent border-none outline-none text-gray-800 cursor-pointer font-bold focus:ring-0"
              >
                <option value="Most Popular">Most Popular</option>
                <option value="Price: Low to High">Price: Low to High</option>
                <option value="Price: High to Low">Price: High to Low</option>
                <option value="Newest Deals">Newest Deals</option>
              </select>
            </div>
          </div>

        </div>
      </section>

      {/* 5. FLASH DEALS TITLE row with Ends In */}
      <section className="max-w-[1600px] mx-auto w-full px-6 md:px-10 mb-6 shrink-0">
        <div className="flex items-end justify-between border-b border-[#EEF2F7] pb-3 text-left">
          <div>
            <h3 className="text-xl font-black text-[#050B2C] flex items-center gap-1 uppercase tracking-tight font-sans">
              <span className="text-[#FF5B00]">⚡</span> FLASH DEALS
            </h3>
            <p className="text-xs text-gray-400 mt-1 font-semibold">
              Limited time offers - Grab before it's gone!
            </p>
          </div>

          {/* Countdown boxes */}
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wide">Ends in</span>
            <div className="flex items-center gap-1.5">
              <div className="flex flex-col items-center">
                <div className="w-9 h-9 bg-white border border-[#EEF2F7] rounded-lg shadow-xs flex items-center justify-center text-sm font-black text-[#050B2C]">
                  {formatTimeNum(flashHours)}
                </div>
                <span className="text-[8px] font-black text-gray-400 mt-1 uppercase">HRS</span>
              </div>
              <span className="text-gray-400 font-bold -mt-4">:</span>
              <div className="flex flex-col items-center">
                <div className="w-9 h-9 bg-white border border-[#EEF2F7] rounded-lg shadow-xs flex items-center justify-center text-sm font-black text-[#050B2C]">
                  {formatTimeNum(flashMinutes)}
                </div>
                <span className="text-[8px] font-black text-gray-400 mt-1 uppercase">MINS</span>
              </div>
              <span className="text-gray-400 font-bold -mt-4">:</span>
              <div className="flex flex-col items-center">
                <div className="w-9 h-9 bg-white border border-[#EEF2F7] rounded-lg shadow-xs flex items-center justify-center text-sm font-black text-[#050B2C]">
                  {formatTimeNum(flashSeconds)}
                </div>
                <span className="text-[8px] font-black text-gray-400 mt-1 uppercase">SECS</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. FLASH DEAL CARDS + DEAL OF THE DAY GRID */}
      <section className="max-w-[1600px] mx-auto w-full px-6 md:px-10 mb-10 text-left">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
          
          {/* Flash Deal Cards (3/4 width column block) */}
          <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-6">
            {FLASH_DEAL_CARDS.map((product) => {
              const isLiked = likedProducts.includes(product.id);
              return (
                <div 
                  key={product.id}
                  onClick={() => navigate(`/products/${product.id}`)}
                  className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between overflow-hidden group cursor-pointer h-[380px]"
                >
                  {/* Image wrapper */}
                  <div className="relative h-[180px] bg-gray-50 flex items-center justify-center overflow-hidden shrink-0">
                    <img 
                      src={product.image} 
                      alt={product.title} 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      referrerPolicy="no-referrer"
                    />
                    
                    {/* Floating badges on top-left */}
                    <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10 text-left">
                      <span className="bg-[#EF4444] text-white text-[9px] font-black tracking-wider px-2 py-0.5 rounded uppercase shadow-xs">
                        {product.discount}
                      </span>
                      <span className="bg-[#FF5B00] text-white text-[9px] font-black tracking-wider px-2 py-0.5 rounded uppercase shadow-xs">
                        FLASH DEAL
                      </span>
                    </div>

                    {/* Brand indicator tag on top-right */}
                    <span className="absolute top-3 right-3 text-[9px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded uppercase">
                      {product.brand}
                    </span>
                  </div>

                  {/* Info contents */}
                  <div className="p-4 flex-1 flex flex-col justify-between">
                    <div>
                      <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest block">
                        {product.brand}
                      </span>
                      <h4 className="font-bold text-[13px] text-[#050B2C] tracking-tight leading-snug group-hover:text-[#FF5B00] transition-colors line-clamp-2 mt-1">
                        {product.title}
                      </h4>
                    </div>

                    {/* Pricing, progress claimed */}
                    <div>
                      <div className="flex items-baseline gap-2">
                        <span className="text-base font-black text-[#FF5B00]">
                          BDT {product.price.toLocaleString()}
                        </span>
                        <span className="text-xs font-bold text-gray-400 line-through">
                          BDT {product.originalPrice.toLocaleString()}
                        </span>
                      </div>

                      <div className="flex items-center gap-1 mt-1.5 select-none">
                        <Star className="w-3.5 h-3.5 fill-[#FF5B00] text-[#FF5B00]" />
                        <span className="text-xs font-bold text-gray-800">{product.rating}</span>
                        <span className="text-xs font-medium text-gray-400">({product.reviewsText})</span>
                      </div>

                      {/* Progress Claimed */}
                      <div className="mt-3.5">
                        <div className="flex justify-between items-center text-[10px] font-bold text-gray-500 mb-1">
                          <span className="text-[#FF5B00] font-black">{product.claimedPercent}% Claimed</span>
                        </div>
                        <div className="w-full h-1.5 bg-gray-150 rounded-full overflow-hidden">
                          <div className="h-full bg-gradient-to-r from-[#FF5B00] to-[#FF5B00] rounded-full" style={{ width: `${product.claimedPercent}%` }}></div>
                        </div>
                      </div>
                    </div>

                    {/* Footer interactions bar */}
                    <div className="flex items-center justify-between gap-2.5 pt-3 border-t border-gray-100 mt-2">
                      <button
                        onClick={(e) => handleLike(product.id, product.title, e)}
                        className={`h-8 px-3 rounded-lg border flex items-center gap-1 text-[11px] font-bold transition-all cursor-pointer ${
                          isLiked 
                            ? 'border-red-200 text-red-500 bg-red-50' 
                            : 'border-gray-200 text-gray-400 hover:text-red-500 hover:bg-gray-50'
                        }`}
                      >
                        <Heart className={`w-3.5 h-3.5 ${isLiked ? 'fill-current' : ''}`} />
                        <span>{product.likes + (isLiked ? 1 : 0)}</span>
                      </button>

                      <button
                        onClick={(e) => handleAddToCart(product.title, e)}
                        className="w-8 h-8 rounded-full bg-[#FF5B00] hover:bg-[#E04F00] text-white flex items-center justify-center transition-all shadow-xs hover:scale-105 cursor-pointer border-0 p-0"
                      >
                        <ShoppingCart className="w-4 h-4 shrink-0" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Deal of the Day Column Block */}
          <div className="lg:col-span-1 flex flex-col">
            
            {/* Title header for Deal of the Day */}
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-black text-[#FF5B00] flex items-center gap-1 uppercase tracking-wider font-sans">
                🎯 DEAL OF THE DAY
              </span>
              <span className="text-[10px] font-bold text-gray-400 uppercase">
                New deal in {formatTimeNum(dealHours)}:{formatTimeNum(dealMinutes)}:{formatTimeNum(dealSeconds)}
              </span>
            </div>

            {/* Vertical Large Featured Card */}
            <div 
              onClick={() => navigate('/products/smartwatch-deal')}
              className="bg-white rounded-2xl border border-orange-500/20 shadow-sm p-5 flex flex-col justify-between h-[380px] cursor-pointer group"
            >
              <div className="relative h-[160px] bg-gray-50 rounded-xl overflow-hidden flex items-center justify-center shrink-0">
                <img 
                  src="https://images.unsplash.com/photo-1542496658-e33a6d0d50f6?w=400&q=80" 
                  alt="boAt Wave Call 2 Smartwatch" 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  referrerPolicy="no-referrer"
                />
                
                {/* Promo discount tag overlay */}
                <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 z-10">
                  <span className="bg-[#EF4444] text-white text-[9px] font-black tracking-widest px-2.5 py-0.5 rounded uppercase">
                    -42% OFF
                  </span>
                  <span className="bg-[#FF5B00] text-white text-[9px] font-black tracking-widest px-2.5 py-0.5 rounded uppercase">
                    DEAL OF THE DAY
                  </span>
                </div>
              </div>

              {/* Specs side */}
              <div className="flex-1 flex flex-col justify-between mt-3 text-left">
                <div>
                  <h4 className="font-bold text-sm text-[#050B2C] tracking-tight leading-snug group-hover:text-[#FF5B00] transition-colors line-clamp-1">
                    boAt Wave Call 2 Smartwatch
                  </h4>
                  
                  <div className="flex items-center justify-between gap-2 mt-1.5 flex-wrap">
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-base font-black text-[#FF5B00]">
                        BDT 3,490
                      </span>
                      <span className="text-xs font-semibold text-gray-400 line-through">
                        BDT 5,990
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 mt-2 select-none text-[11px]">
                    <div className="flex items-center gap-0.5">
                      <Star className="w-3.5 h-3.5 fill-[#FF5B00] text-[#FF5B00]" />
                      <span className="font-bold text-gray-800">4.6</span>
                    </div>
                    <span className="text-gray-300">|</span>
                    <span className="text-gray-500 font-semibold">1,245 Sold</span>
                  </div>
                </div>

                {/* Progress bar and view deal cta */}
                <div className="mt-3">
                  <div className="w-full h-1.5 bg-gray-150 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-[#FF5B00] to-[#FF5B00] rounded-full" style={{ width: '68%' }}></div>
                  </div>
                  <div className="flex justify-between items-center text-[9px] font-bold text-gray-400 mt-1 leading-none">
                    <span>68% Claimed</span>
                  </div>
                </div>

                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate('/products/smartwatch-deal');
                  }}
                  className="w-full mt-3.5 py-2.5 bg-[#050B2C] hover:bg-[#FF5B00] text-white text-xs font-black uppercase tracking-wider rounded-xl transition-all duration-300 border-0 cursor-pointer"
                >
                  VIEW DEAL
                </button>
              </div>
            </div>

          </div>

        </div>

        {/* View all flash deals arrow trigger */}
        <div className="w-full flex justify-center mt-6">
          <button 
            onClick={() => toast.success('Navigating to full Flash Deals directory')}
            className="text-xs font-black text-[#FF5B00] hover:text-[#E04F00] transition-colors uppercase tracking-widest flex items-center gap-1.5 hover:underline"
          >
            <span>VIEW ALL FLASH DEALS</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>

      {/* 7. TOP DEALS SECTION + TOP COUPONS */}
      <section className="max-w-[1600px] mx-auto w-full px-6 md:px-10 mb-10 text-left">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
          
          {/* Top Deals List */}
          <div className="lg:col-span-3 flex flex-col">
            <div className="flex items-center justify-between border-b border-[#EEF2F7] pb-3 mb-5">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-orange-50 flex items-center justify-center text-[#FF5B00]">
                  <Star className="w-4 h-4 fill-current text-[#FF5B00]" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-[#050B2C] uppercase tracking-tight font-sans">
                    TOP DEALS
                  </h3>
                  <p className="text-[10px] font-semibold text-gray-400 uppercase">
                    Handpicked best offers for you
                  </p>
                </div>
              </div>

              <button 
                onClick={() => toast.success('Navigating to All Deals')}
                className="text-xs font-black text-[#FF5B00] hover:text-[#E04F00] transition-colors uppercase tracking-widest flex items-center gap-1 hover:underline"
              >
                <span>VIEW ALL DEALS</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Grid of standard reusable Product Cards with custom BDT currency */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {TOP_DEALS_DATA.map((product) => (
                <ProductCard 
                  key={product.id} 
                  product={product} 
                  currency="BDT"
                />
              ))}
            </div>
          </div>

          {/* Top Coupons Column */}
          <div className="lg:col-span-1 flex flex-col h-full">
            <div className="flex items-center justify-between border-b border-[#EEF2F7] pb-3 mb-5">
              <h3 className="text-lg font-black text-[#050B2C] flex items-center gap-1.5 uppercase tracking-tight font-sans">
                <Ticket className="w-4 h-4 text-[#FF5B00]" /> TOP COUPONS
              </h3>
              <button 
                onClick={() => toast.success('Opening Coupon Vault')}
                className="text-xs font-black text-[#FF5B00] hover:text-[#E04F00] transition-colors uppercase tracking-widest hover:underline flex items-center gap-0.5"
              >
                <span>VIEW ALL</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Coupons Card Container */}
            <div className="bg-white rounded-2xl border border-[#EEF2F7] p-5 shadow-sm flex-1 flex flex-col justify-between">
              <div className="flex flex-col gap-4">
                {COUPONS_DATA.map((coupon, idx) => (
                  <div 
                    key={idx} 
                    className="border border-[#EEF2F7] rounded-xl p-3 flex items-center justify-between bg-gray-50/50 hover:bg-gray-50 transition-all group/coupon"
                  >
                    {/* Left discount */}
                    <div className="text-left shrink-0">
                      <span className="text-lg font-black text-[#050B2C] block leading-none">
                        {coupon.discount}
                      </span>
                      <span className="text-[9px] font-bold text-gray-400 uppercase mt-1 block">
                        OFF
                      </span>
                    </div>

                    {/* Middle specs */}
                    <div className="text-left flex-1 px-4 min-w-0">
                      <span className="text-xs font-bold text-gray-800 block truncate font-mono">
                        Use Code: <span className="text-[#FF5B00] font-black">{coupon.code}</span>
                      </span>
                      <span className="text-[10px] text-gray-400 font-semibold block mt-1 leading-none">
                        Min. Spend {coupon.minSpend}
                      </span>
                    </div>

                    {/* Right action button */}
                    <button
                      onClick={() => handleCopyCoupon(coupon.code)}
                      className="text-[10px] font-black text-gray-600 bg-white hover:bg-[#FF5B00] hover:text-white border border-[#EEF2F7] hover:border-[#FF5B00] px-2.5 py-1.5 rounded-lg transition-all duration-300 shadow-2xs"
                    >
                      COPY
                    </button>
                  </div>
                ))}
              </div>

              {/* Bottom show more action */}
              <button
                onClick={() => toast.success('More coupons loaded')}
                className="w-full mt-6 py-2.5 bg-gray-50 hover:bg-[#FF5B00]/5 border border-[#EEF2F7] hover:border-[#FF5B00]/20 rounded-xl text-xs font-black text-gray-700 hover:text-[#FF5B00] uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-1"
              >
                <span>MORE COUPONS</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

        </div>
      </section>

      {/* 8. TRUST BENEFITS STRIP */}
      <section className="max-w-[1600px] mx-auto w-full px-6 md:px-10 mb-10 shrink-0">
        <div className="bg-white border border-[#EEF2F7] rounded-2xl py-6 px-4 shadow-xs">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6 items-center divide-y md:divide-y-0 md:divide-x divide-[#EEF2F7]">
            {[
              { title: '100% Authentic', sub: 'Verified products & sellers', icon: ShieldCheck, color: 'text-blue-500 bg-blue-50' },
              { title: 'Best Price Guarantee', sub: 'We beat any lower price', icon: Award, color: 'text-[#FF5B00] bg-orange-50' },
              { title: 'Easy Returns', sub: '7-day return policy', icon: RotateCcw, color: 'text-teal-500 bg-teal-50' },
              { title: 'Secure Payments', sub: '100% secure checkout', icon: Lock, color: 'text-purple-500 bg-purple-50' },
              { title: '24/7 Support', sub: "We're here to help", icon: Clock, color: 'text-rose-500 bg-rose-50' }
            ].map((guarantee, idx) => {
              const GuaranteeIcon = guarantee.icon;
              return (
                <div key={idx} className="flex items-center gap-3.5 px-4 first:pl-0 last:pr-0 pt-4 md:pt-0 border-none md:border-solid">
                  <div className={`w-10 h-10 rounded-full ${guarantee.color} flex items-center justify-center shrink-0`}>
                    <GuaranteeIcon className="w-5 h-5" />
                  </div>
                  <div className="text-left min-w-0">
                    <h4 className="text-xs font-black text-[#050B2C] tracking-tight leading-none">
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

      {/* 9. POPULAR DEAL CATEGORIES */}
      <section className="max-w-[1600px] mx-auto w-full px-6 md:px-10 mb-10 shrink-0 text-left">
        <div className="bg-white border border-[#EEF2F7] rounded-3xl p-6 shadow-sm">
          
          {/* Header row */}
          <div className="flex items-center justify-between mb-5 border-b border-[#EEF2F7] pb-3">
            <h4 className="text-sm font-black text-[#050B2C] uppercase tracking-wider font-sans">
              Popular Deal Categories
            </h4>
            <button 
              onClick={() => toast.success('Viewing All Categories')}
              className="text-xs font-black text-[#FF5B00] hover:text-[#E04F00] transition-colors uppercase tracking-widest flex items-center gap-1 hover:underline"
            >
              <span>VIEW ALL</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Chips list */}
          <div className="flex flex-wrap items-center gap-2.5">
            {[
              { name: 'Smartphones', icon: Smartphone },
              { name: 'Laptops', icon: Laptop },
              { name: 'Audio', icon: Headphones },
              { name: 'Smart Watches', icon: Watch },
              { name: 'Home Appliances', icon: Tv },
              { name: 'Gaming', icon: Gamepad },
              { name: 'Accessories', icon: Cable },
              { name: 'Cameras', icon: Camera }
            ].map((chip, idx) => {
              const ChipIcon = chip.icon;
              return (
                <button
                  key={idx}
                  onClick={() => {
                    setSearchQuery(chip.name);
                    toast.success(`Category: ${chip.name}`);
                  }}
                  className="h-9 px-4.5 bg-white hover:bg-[#FF5B00]/5 border border-gray-200 hover:border-[#FF5B00]/30 rounded-full text-xs font-bold text-gray-600 hover:text-[#FF5B00] flex items-center gap-2 transition-all cursor-pointer shadow-2xs"
                >
                  <ChipIcon className="w-3.5 h-3.5 text-gray-400 group-hover:text-[#FF5B00]" />
                  <span>{chip.name}</span>
                </button>
              );
            })}
          </div>

        </div>
      </section>

      {/* 10. BRAND DEALS */}
      <section className="max-w-[1600px] mx-auto w-full px-6 md:px-10 mb-10 text-left">
        <div className="flex items-center justify-between border-b border-[#EEF2F7] pb-3 mb-5">
          <h3 className="text-lg font-black text-[#050B2C] uppercase tracking-tight font-sans">
            Brand Deals
          </h3>
          <button 
            onClick={() => toast.success('Opening Brands directory')}
            className="text-xs font-black text-[#FF5B00] hover:text-[#E04F00] transition-colors uppercase tracking-widest hover:underline flex items-center gap-0.5"
          >
            <span>VIEW ALL BRANDS</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Carousel brand container row with left/right arrows */}
        <div className="relative w-full">
          
          {/* Arrow navigation handles */}
          <button 
            onClick={() => toast.success('Scrolling left brand deals')}
            className="absolute left-[-18px] top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white border border-[#EEF2F7] shadow-sm flex items-center justify-center text-gray-400 hover:text-gray-800 hover:shadow-md transition-all z-20"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <button 
            onClick={() => toast.success('Scrolling right brand deals')}
            className="absolute right-[-18px] top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white border border-[#EEF2F7] shadow-sm flex items-center justify-center text-gray-400 hover:text-gray-800 hover:shadow-md transition-all z-20"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          {/* Grid list of brands */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-5 px-1">
            {[
              { name: 'SAMSUNG', desc: 'Up to 20% Off', style: 'text-[#0A54A6] tracking-tight font-black text-lg' },
              { name: 'APPLE', desc: 'Up to 15% Off', style: 'text-black font-semibold text-lg' },
              { name: 'XIAOMI', desc: 'Up to 18% Off', style: 'text-[#FF6900] tracking-wider font-extrabold text-base' },
              { name: 'SONY', desc: 'Up to 25% Off', style: 'text-gray-800 tracking-widest font-serif text-lg font-bold' },
              { name: 'DELL', desc: 'Up to 20% Off', style: 'text-[#0076C0] font-black tracking-normal italic text-lg' },
              { name: 'ASUS', desc: 'Up to 20% Off', style: 'text-black font-extrabold tracking-widest text-base italic' }
            ].map((brand, idx) => (
              <div
                key={idx}
                onClick={() => {
                  toast.success(`Browsing ${brand.name} Deals!`);
                }}
                className="bg-white rounded-2xl border border-gray-150 p-6 flex flex-col items-center justify-center text-center gap-4 hover:shadow-md hover:border-[#FF5B00]/30 transition-all duration-300 cursor-pointer group relative overflow-hidden"
              >
                {/* Brand stylized logo representation */}
                <div className="w-full h-12 flex items-center justify-center shrink-0">
                  {brand.name === 'XIAOMI' ? (
                    <div className="bg-[#FF6900] text-white w-9 h-9 rounded-lg flex items-center justify-center font-bold text-xs select-none">
                      mi
                    </div>
                  ) : brand.name === 'APPLE' ? (
                    <div className="flex items-center gap-1 font-semibold text-gray-800 text-sm uppercase font-sans">
                       <span className="text-xs font-black">Apple</span>
                    </div>
                  ) : (
                    <span className={brand.style}>{brand.name}</span>
                  )}
                </div>

                {/* Offer detail text */}
                <div className="flex flex-col items-center gap-1 mt-1">
                  <span className="text-[10px] font-black text-[#FF5B00] bg-orange-50 border border-orange-100 px-2.5 py-1 rounded-full uppercase tracking-wider">
                    {brand.desc}
                  </span>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 11. NEWSLETTER BANNER */}
      <section className="max-w-[1600px] mx-auto w-full px-6 md:px-10 mb-10 text-left shrink-0">
        <div className="bg-gradient-to-r from-[#03061C] to-[#1E0B3C] border border-white/5 rounded-3xl p-8 md:p-12 flex flex-col md:flex-row items-center justify-between relative overflow-hidden shadow-lg">
          
          {/* Background orange spot */}
          <div className="absolute -bottom-10 -right-10 w-44 h-44 bg-[#FF5B00]/15 rounded-full blur-3xl pointer-events-none" />

          {/* Left illustration & content wrapper */}
          <div className="flex flex-col md:flex-row items-center gap-8 z-10 flex-1">
            
            {/* Gift Box animation or clean vector render */}
            <div className="w-20 h-20 bg-white/5 rounded-2xl flex items-center justify-center shrink-0 border border-white/10 shadow-inner relative animate-bounce duration-1000">
              <Gift className="w-10 h-10 text-[#FF5B00]" />
              <div className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-red-500 rounded-full animate-ping" />
            </div>

            <div className="text-center md:text-left">
              <h3 className="text-xl sm:text-2xl md:text-3xl font-black text-white leading-none uppercase tracking-tight font-sans">
                NEVER MISS A DEAL!
              </h3>
              <p className="text-xs sm:text-sm text-gray-300 font-medium mt-3 leading-relaxed">
                Subscribe and get top deals straight to your inbox.
              </p>
            </div>
          </div>

          {/* Right form input column */}
          <div className="mt-6 md:mt-0 w-full md:w-[45%] lg:w-[38%] z-10 text-center md:text-left">
            <form onSubmit={handleNewsletterSubmit} className="relative w-full flex items-center">
              <input 
                type="email" 
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                placeholder="Enter your email" 
                className="w-full h-11 pl-4 pr-32 bg-white/5 border border-white/15 rounded-xl text-xs font-bold text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-[#FF5B00]/50 transition-all"
              />
              <button 
                type="submit"
                className="absolute right-1 top-1 bottom-1 px-5 bg-[#FF5B00] hover:bg-[#E04F00] text-white text-[10px] font-black uppercase tracking-wider rounded-lg flex items-center justify-center transition-colors cursor-pointer border-0"
              >
                SUBSCRIBE
              </button>
            </form>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mt-3.5 block">
              Join 20,000+ smart shoppers
            </p>
          </div>

        </div>
      </section>

    </div>
  );
}
