import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Search, ShoppingCart, MessageSquare, Bookmark, ChevronDown, ChevronRight, 
  ChevronLeft, Award, Heart, Eye, Share2, Play, ShieldCheck, Star, Sparkles, 
  Plus, Check, Headphones, Shirt, Smartphone, Home, Dumbbell, Car, Utensils, 
  Building2, Compass, MoreHorizontal, RotateCcw, ShieldCheck as VerifiedIcon, 
  TrendingUp, CreditCard, Ticket, ShoppingBag, Gift, ArrowRightLeft, Camera, 
  Tv, Layers, Flame
} from 'lucide-react';
import { PRODUCTS, BRANDS } from '../constants';
import { useGlobalState } from '../context/GlobalStateContext';
import { useDashboard } from '../context/DashboardContext';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'motion/react';

// Categories matching reference image
const CATEGORY_ITEMS = [
  { name: 'Electronics', icon: Headphones, color: 'text-blue-500', bg: 'bg-blue-50' },
  { name: 'Fashion', icon: Shirt, color: 'text-purple-500', bg: 'bg-purple-50' },
  { name: 'Mobile & Accessories', icon: Smartphone, color: 'text-emerald-500', bg: 'bg-emerald-50' },
  { name: 'Home & Living', icon: Home, color: 'text-amber-500', bg: 'bg-amber-50' },
  { name: 'Beauty & Health', icon: Sparkles, color: 'text-pink-500', bg: 'bg-pink-50' },
  { name: 'Sports & Outdoors', icon: Dumbbell, color: 'text-cyan-500', bg: 'bg-cyan-50' },
  { name: 'Automotive', icon: Car, color: 'text-slate-600', bg: 'bg-slate-100' },
  { name: 'Restaurants', icon: Utensils, color: 'text-rose-500', bg: 'bg-rose-50' },
  { name: 'Hotels', icon: Building2, color: 'text-indigo-500', bg: 'bg-indigo-50' },
  { name: 'Travel & Tours', icon: Compass, color: 'text-teal-500', bg: 'bg-teal-50' },
  { name: 'Education', icon: Award, color: 'text-orange-500', bg: 'bg-orange-50' },
  { name: 'More', icon: MoreHorizontal, color: 'text-gray-500', bg: 'bg-gray-100' },
];

// Spotlight data matching reference image
const SPOTLIGHT_CARDS = [
  {
    id: 'spot-1',
    badge: 'LIVE',
    badgeBg: 'bg-red-500',
    title: 'Samsung Unpacked Watch Party',
    publisher: 'Samsung Bangladesh',
    avatar: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&h=100&fit=crop',
    cover: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=400&h=600&fit=crop',
  },
  {
    id: 'spot-2',
    badge: 'REEL',
    badgeBg: 'bg-amber-500',
    title: '5 Sneakers You Need This Summer',
    publisher: 'SneakerHead BD',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop',
    cover: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=600&fit=crop',
  },
  {
    id: 'spot-3',
    badge: 'GUIDE',
    badgeBg: 'bg-indigo-600',
    title: 'Best Smartphones Under 30K in BD',
    publisher: 'Choosify Guides',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
    cover: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=600&fit=crop',
  },
  {
    id: 'spot-4',
    badge: 'BRAND STORY',
    badgeBg: 'bg-yellow-600',
    title: "Aarong: Crafting Bangladesh's Heritage",
    publisher: 'Aarong Official',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
    cover: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=400&h=600&fit=crop',
  },
  {
    id: 'spot-5',
    badge: 'CAMPAIGN',
    badgeBg: 'bg-red-600',
    title: 'Eid Collection 2025 Now Live',
    publisher: 'Bata Bangladesh',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop',
    cover: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=400&h=600&fit=crop',
  },
  {
    id: 'spot-6',
    badge: 'CAROUSEL',
    badgeBg: 'bg-blue-600',
    title: 'Top 5 Beach Resorts For Your Next Trip',
    publisher: 'Travel With Tasin',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop',
    cover: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&h=600&fit=crop',
  }
];

// Featured products data matching reference image
const FEATURED_PRODUCTS_MOCK = [
  {
    id: 1,
    title: 'Samsung Galaxy S24 Ultra',
    price: '124,800',
    originalPrice: '139,900',
    rating: '4.8 (1.2k)',
    image: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=400&h=400&fit=crop',
    discount: '-10%',
    badge: 'FEATURED'
  },
  {
    id: 2,
    title: 'Sony WH-1000XM5',
    price: '32,999',
    originalPrice: '38,999',
    rating: '4.7 (890)',
    image: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=400&h=400&fit=crop',
    discount: '-15%',
    badge: 'BEST SELLER'
  },
  {
    id: 3,
    title: 'Amazfit GTR 4',
    price: '18,490',
    originalPrice: '22,999',
    rating: '4.6 (532)',
    image: 'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=400&h=400&fit=crop',
    discount: '-20%',
    badge: null
  },
  {
    id: 4,
    title: 'Apple AirPods Pro 2',
    price: '25,999',
    originalPrice: '29,499',
    rating: '4.9 (1.5k)',
    image: 'https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=400&h=400&fit=crop',
    discount: '-12%',
    badge: null
  },
  {
    id: 5,
    title: 'Nike Air Max Excee',
    price: '7,499',
    originalPrice: '9,999',
    rating: '4.6 (420)',
    image: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=400&h=400&fit=crop',
    discount: '-25%',
    badge: null
  },
  {
    id: 6,
    title: 'Xiaomi 14T Pro',
    price: '54,999',
    originalPrice: null,
    rating: '4.7 (210)',
    image: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=400&h=400&fit=crop',
    discount: null,
    badge: 'NEW',
    badgeColor: 'bg-emerald-500'
  }
];

// Buying guides matching reference image
const BUYING_GUIDES = [
  {
    id: 'g-1',
    title: 'Best Phones Under 30K in BD',
    desc: 'Updated May 2025',
    image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=260&fit=crop'
  },
  {
    id: 'g-2',
    title: "Best Hotels in Cox's Bazar",
    desc: 'Top 10 Picks',
    image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=400&h=260&fit=crop'
  },
  {
    id: 'g-3',
    title: 'Best Air Conditioners for Home',
    desc: 'Buying Guide',
    image: 'https://images.unsplash.com/photo-1585338107529-13afc5f02586?w=400&h=260&fit=crop'
  },
  {
    id: 'g-4',
    title: 'Best Running Shoes for Men',
    desc: 'Expert Reviewed',
    image: 'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=400&h=260&fit=crop'
  },
  {
    id: 'g-5',
    title: 'Best Laptops for Students',
    desc: 'Budget Friendly',
    image: 'https://images.unsplash.com/photo-1496181133227-f83bb023945d?w=400&h=260&fit=crop'
  },
  {
    id: 'g-6',
    title: 'How to Choose the Right Camera',
    desc: 'Complete Guide',
    image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=400&h=260&fit=crop'
  }
];

// Brand logos matching reference image
const BRAND_LOGOS = [
  { name: 'SAMSUNG', image: 'https://upload.wikimedia.org/wikipedia/commons/2/24/Samsung_Logo.svg' },
  { name: 'Apple', image: 'https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg' },
  { name: 'Xiaomi', image: 'https://upload.wikimedia.org/wikipedia/commons/a/ae/Xiaomi_logo_%282021-%29.svg' },
  { name: 'WALTON', text: 'WALTON', image: null, color: 'text-blue-800' },
  { name: 'AARONG', text: 'AARONG', image: null, color: 'text-amber-900' },
  { name: 'Bata', image: 'https://upload.wikimedia.org/wikipedia/commons/e/ec/Bata_logo.svg' },
  { name: 'PICKABOO', text: 'PICKABOO', image: null, color: 'text-red-600' },
  { name: 'Le Reve', text: 'Le Reve', image: null, color: 'text-purple-950' }
];

// Popular services matching reference image
const POPULAR_SERVICES = [
  { name: 'Hotels', icon: Building2, subtitle: 'Book now' },
  { name: 'Restaurants', icon: Utensils, subtitle: 'Find & Reserve' },
  { name: 'Travel & Tours', icon: Compass, subtitle: 'Plan your trip' },
  { name: 'Doctors', icon: VerifiedIcon, subtitle: 'Book appointment' },
  { name: 'Education', icon: Award, subtitle: 'Find courses' },
  { name: 'Beauty & Salon', icon: Sparkles, subtitle: 'Look your best' },
  { name: 'Real Estate', icon: Home, subtitle: 'Buy or Rent' },
  { name: 'More Services', icon: MoreHorizontal, subtitle: 'Explore all' }
];

// Recently viewed matching reference image
const RECENTLY_VIEWED = [
  'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=100&h=100&fit=crop',
  'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=100&h=100&fit=crop',
  'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=100&h=100&fit=crop',
  'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=100&h=100&fit=crop',
  'https://images.unsplash.com/photo-1496181133227-f83bb023945d?w=100&h=100&fit=crop',
  'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=100&h=100&fit=crop',
  'https://images.unsplash.com/photo-1512499617640-c74ae3a79d37?w=100&h=100&fit=crop',
  'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=100&h=100&fit=crop'
];

export function HomePage() {
  const navigate = useNavigate();
  const { addToCart } = useGlobalState();
  const { toggleSaved, savedProducts } = (useDashboard() as any) || { toggleSaved: () => {}, savedProducts: [] };

  // Local state for search & compare
  const [heroSearch, setHeroSearch] = useState('');
  const [compareFirst, setCompareFirst] = useState('');
  const [compareSecond, setCompareSecond] = useState('');
  
  // Carousel states
  const [currentSlide, setCurrentSlide] = useState(0);
  const [wishlist, setWishlist] = useState<Record<number, boolean>>({});

  // Carousel auto slider
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % 3);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const handleHeroSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!heroSearch.trim()) return;
    toast.success(`Searching for ${heroSearch}`);
    navigate(`/search?q=${encodeURIComponent(heroSearch)}`);
  };

  const handleCompareSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!compareFirst.trim() || !compareSecond.trim()) {
      toast.error('Please enter both products to compare');
      return;
    }
    toast.success(`Comparing ${compareFirst} VS ${compareSecond}`);
    navigate(`/compare?p1=${encodeURIComponent(compareFirst)}&p2=${encodeURIComponent(compareSecond)}`);
  };

  const selectComparison = (p1: string, p2: string) => {
    setCompareFirst(p1);
    setCompareSecond(p2);
    toast.success(`Preset loaded: ${p1} vs ${p2}. Click Compare!`);
  };

  const toggleWish = (id: number) => {
    setWishlist(prev => {
      const next = { ...prev, [id]: !prev[id] };
      if (next[id]) {
        toast.success('Added to your favorite vault!');
      } else {
        toast.success('Removed from your favorite vault!');
      }
      return next;
    });
  };

  const handleCategoryClick = (name: string) => {
    toast.success(`Exploring ${name} category`);
    navigate(`/products?category=${encodeURIComponent(name)}`);
  };

  return (
    <div className="bg-[#FAFBFD] min-h-screen text-[#04061A] antialiased pb-20 font-sans">
      
      {/* ── HERO BANNER SLIDER ── */}
      <section className="relative overflow-hidden bg-gradient-to-r from-[#030415] via-[#0D0B2E] to-[#040212] py-16 px-4 md:px-8 xl:px-16 min-h-[460px] flex items-center">
        {/* Ambient background particles & glows */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-600/10 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute bottom-0 left-10 w-[300px] h-[300px] bg-blue-600/10 blur-[100px] rounded-full pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(232,80,10,0.05)_0%,transparent_50%)] pointer-events-none" />

        <div className="max-w-[1360px] mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
          
          {/* Left Text Column */}
          <div className="lg:col-span-7 text-left flex flex-col justify-center">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="font-sans font-extrabold text-white text-4xl sm:text-5xl md:text-[56px] leading-[1.1] tracking-tight">
                Choose, Compare &<br />
                Decide <span className="text-[#FF5B00] inline-block relative">Wisely.</span>
              </h1>
              <p className="text-gray-400 text-sm sm:text-base md:text-lg mt-4 max-w-xl font-medium leading-relaxed">
                Bangladesh's most trusted product discovery platform. Compare prices, read verified guides, and spot authentic deals.
              </p>
            </motion.div>

            {/* Action Buttons */}
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="flex flex-wrap gap-4 mt-8"
            >
              <Link 
                to="/products"
                className="px-8 py-3 bg-[#FF5B00] hover:bg-[#E04E00] text-white text-xs font-bold uppercase tracking-wider rounded-md shadow-lg shadow-[#FF5B00]/20 transition-all active:scale-95 duration-200"
              >
                Explore Now
              </Link>
              <Link 
                to="/guides"
                className="px-8 py-3 bg-transparent hover:bg-white/5 border border-white/20 hover:border-white/40 text-white text-xs font-bold uppercase tracking-wider rounded-md transition-all duration-200"
              >
                How It Works
              </Link>
            </motion.div>

            {/* Slider Dots */}
            <div className="flex items-center gap-2.5 mt-12">
              {[0, 1, 2].map((slide) => (
                <button
                  key={slide}
                  onClick={() => setCurrentSlide(slide)}
                  className={`h-2.5 rounded-full transition-all duration-300 border-none cursor-pointer ${
                    currentSlide === slide ? 'w-8 bg-[#FF5B00]' : 'w-2.5 bg-white/30 hover:bg-white/50'
                  }`}
                  aria-label={`Go to slide ${slide + 1}`}
                />
              ))}
            </div>
          </div>

          {/* Right Imagery Column */}
          <div className="lg:col-span-5 flex justify-center lg:justify-end relative">
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0, scale: 0.92, x: 20 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.92, x: -20 }}
              transition={{ duration: 0.6 }}
              className="relative w-[340px] h-[340px] md:w-[400px] md:h-[400px]"
            >
              {/* Overlapping sleek black phones representing modern high-tech device comparator */}
              <div className="absolute right-4 top-4 w-[240px] h-[320px] md:w-[280px] md:h-[360px] rounded-3xl bg-[#11132C]/80 border-4 border-[#33375A] shadow-2xl overflow-hidden flex items-center justify-center transform rotate-6 hover:rotate-3 transition-transform duration-500">
                <img 
                  src="https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=450&q=80" 
                  alt="Phone mockup back side" 
                  className="w-full h-full object-cover select-none pointer-events-none opacity-90"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="absolute left-4 bottom-4 w-[240px] h-[320px] md:w-[280px] md:h-[360px] rounded-3xl bg-[#090A1A]/95 border-4 border-[#222442] shadow-2xl overflow-hidden flex items-center justify-center transform -rotate-12 hover:-rotate-6 transition-transform duration-500 z-10">
                <img 
                  src="https://images.unsplash.com/photo-1695048133031-698f1f5068cf?w=450&q=80" 
                  alt="Phone mockup front side screen" 
                  className="w-full h-full object-cover select-none pointer-events-none"
                  referrerPolicy="no-referrer"
                />
              </div>
            </motion.div>
          </div>
        </div>

        {/* Floating absolute navigation arrows */}
        <button 
          onClick={() => setCurrentSlide((prev) => (prev - 1 + 3) % 3)}
          className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 border-0 flex items-center justify-center text-white cursor-pointer z-20 backdrop-blur-md"
        >
          <ChevronLeft size={20} />
        </button>
        <button 
          onClick={() => setCurrentSlide((prev) => (prev + 1) % 3)}
          className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 border-0 flex items-center justify-center text-white cursor-pointer z-20 backdrop-blur-md"
        >
          <ChevronRight size={20} />
        </button>
      </section>


      {/* ── CORE GRID LAYOUT CONTAINER ── */}
      <main className="max-w-[1360px] mx-auto px-4 md:px-6 mt-12 flex flex-col gap-12">
        
        {/* ── TOP CATEGORIES SECTION ── */}
        <section className="text-left w-full">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl md:text-2xl font-extrabold text-[#04061A]">Top Categories</h2>
            </div>
            <Link 
              to="/categories" 
              className="text-xs font-bold text-[#FF5B00] hover:text-[#E04E00] flex items-center gap-1 uppercase tracking-wider"
            >
              View all categories <ChevronRight size={14} />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {CATEGORY_ITEMS.map((cat, idx) => (
              <div 
                key={idx}
                onClick={() => handleCategoryClick(cat.name)}
                className="bg-white rounded-xl border border-gray-100 p-5 flex flex-col items-center justify-center cursor-pointer transition-all duration-300 hover:shadow-md hover:border-gray-200 hover:-translate-y-1 group"
              >
                <div className={`w-12 h-12 rounded-full ${cat.bg} flex items-center justify-center mb-3 transition-transform duration-300 group-hover:scale-110`}>
                  <cat.icon className={`w-6 h-6 ${cat.color}`} />
                </div>
                <span className="text-xs font-semibold text-[#04061A] group-hover:text-[#FF5B00] transition-colors text-center truncate w-full">
                  {cat.name}
                </span>
              </div>
            ))}
          </div>
        </section>


        {/* ── TRENDING IN SPOTLIGHT SECTION ── */}
        <section className="text-left w-full">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-xl md:text-2xl font-extrabold text-[#04061A] flex items-center gap-2">
                🔥 Trending in Spotlight
              </h2>
              <span className="text-xs text-gray-400 font-medium">Powered by Choosify Spotlight</span>
            </div>
            <Link 
              to="/guides" 
              className="text-xs font-bold text-[#FF5B00] hover:text-[#E04E00] flex items-center gap-1 uppercase tracking-wider"
            >
              View all spotlight <ChevronRight size={14} />
            </Link>
          </div>

          {/* Staggered beautiful vertical card layouts */}
          <div className="relative group/carousel">
            <div className="flex gap-4 overflow-x-auto pb-4 pt-1 snap-x scroll-smooth no-scrollbar">
              {SPOTLIGHT_CARDS.map((spot) => (
                <div 
                  key={spot.id}
                  onClick={() => {
                    toast.success(`Opening spotlight: ${spot.title}`);
                    navigate('/guides');
                  }}
                  className="flex-shrink-0 w-[240px] h-[340px] rounded-2xl overflow-hidden relative shadow-sm border border-gray-100 cursor-pointer snap-start transition-all duration-500 hover:shadow-xl hover:-translate-y-1.5 group"
                >
                  {/* Background Image with dark vignette overlay */}
                  <img 
                    src={spot.cover} 
                    alt={spot.title} 
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-black/40 z-10" />

                  {/* Absolute Top elements */}
                  <div className="absolute top-3 left-3 z-20">
                    <span className={`text-[10px] font-black tracking-widest text-white px-2.5 py-1.5 rounded-md ${spot.badgeBg}`}>
                      {spot.badge}
                    </span>
                  </div>

                  {/* Absolute Bottom elements */}
                  <div className="absolute bottom-0 left-0 right-0 p-4 z-20 flex flex-col gap-3">
                    <h3 className="text-sm font-bold text-white leading-snug tracking-wide group-hover:text-[#FF5B00] transition-colors line-clamp-2">
                      {spot.title}
                    </h3>
                    
                    {/* User Profile bar */}
                    <div className="flex items-center gap-2 pt-1 border-t border-white/10">
                      <img 
                        src={spot.avatar} 
                        alt={spot.publisher} 
                        className="w-5 h-5 rounded-full object-cover border border-white/20"
                        referrerPolicy="no-referrer"
                      />
                      <span className="text-[10px] font-medium text-gray-300 truncate flex-1">
                        {spot.publisher}
                      </span>
                      <VerifiedIcon className="w-3.5 h-3.5 text-blue-400 shrink-0 fill-blue-400" />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Simulated scroll buttons */}
            <button className="absolute -left-4 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white shadow-md border border-gray-100 flex items-center justify-center text-gray-600 hover:text-[#FF5B00] cursor-pointer opacity-0 group-hover/carousel:opacity-100 transition-opacity duration-300 z-10">
              <ChevronLeft size={18} />
            </button>
            <button className="absolute -right-4 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white shadow-md border border-gray-100 flex items-center justify-center text-gray-600 hover:text-[#FF5B00] cursor-pointer opacity-0 group-hover/carousel:opacity-100 transition-opacity duration-300 z-10">
              <ChevronRight size={18} />
            </button>
          </div>
        </section>


        {/* ── FEATURED PRODUCTS SECTION ── */}
        <section className="text-left w-full">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-6 gap-4">
            <div>
              <h2 className="text-xl md:text-2xl font-extrabold text-[#04061A]">Featured Products</h2>
              <p className="text-xs text-gray-400 mt-1">Handpicked deals you'll love</p>
            </div>
            <Link 
              to="/products" 
              className="text-xs font-bold text-[#FF5B00] hover:text-[#E04E00] flex items-center gap-1 uppercase tracking-wider shrink-0"
            >
              View all products <ChevronRight size={14} />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {FEATURED_PRODUCTS_MOCK.map((product) => (
              <div 
                key={product.id}
                className="bg-white rounded-xl border border-gray-100 overflow-hidden flex flex-col justify-between hover:shadow-lg hover:border-gray-200 transition-all duration-300 relative group"
              >
                {/* Image Section */}
                <div 
                  onClick={() => navigate(`/products/${product.id}`)}
                  className="w-full aspect-square bg-[#F9FAFC] relative overflow-hidden flex items-center justify-center cursor-pointer"
                >
                  <img 
                    src={product.image} 
                    alt={product.title} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    referrerPolicy="no-referrer"
                  />

                  {/* Absolute Corner Tags */}
                  <div className="absolute top-2 left-2 flex flex-col gap-1 z-10">
                    {product.discount && (
                      <span className="text-[10px] font-black text-white bg-red-500 px-2 py-0.5 rounded-md">
                        {product.discount}
                      </span>
                    )}
                    {product.badge && (
                      <span className={`text-[8px] font-black tracking-widest text-white px-2 py-0.5 rounded-md ${product.badgeColor || 'bg-blue-600'}`}>
                        {product.badge}
                      </span>
                    )}
                  </div>

                  {/* Wishlist Heart Icon */}
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleWish(product.id);
                    }}
                    className="absolute top-2 right-2 w-7 h-7 rounded-full bg-white/85 hover:bg-white border-0 flex items-center justify-center shadow-xs text-gray-400 hover:text-red-500 cursor-pointer transition-colors z-10"
                  >
                    <Heart 
                      size={15} 
                      className={`transition-all ${wishlist[product.id] ? 'fill-red-500 text-red-500' : ''}`} 
                    />
                  </button>
                </div>

                {/* Info Section */}
                <div className="p-3 flex flex-col flex-1 justify-between">
                  <div 
                    onClick={() => navigate(`/products/${product.id}`)}
                    className="cursor-pointer"
                  >
                    <h3 className="text-xs font-bold text-[#04061A] line-clamp-2 tracking-tight group-hover:text-[#FF5B00] transition-colors leading-snug">
                      {product.title}
                    </h3>
                  </div>

                  <div className="mt-2 pt-2 border-t border-gray-50 flex flex-col gap-1">
                    {/* Price Tag */}
                    <div className="flex items-baseline gap-1.5 flex-wrap">
                      <span className="text-xs font-black text-[#FF5B00]">
                        ৳{product.price}
                      </span>
                      {product.originalPrice && (
                        <span className="text-[10px] text-gray-400 line-through font-medium">
                          ৳{product.originalPrice}
                        </span>
                      )}
                    </div>

                    {/* Rating info */}
                    <div className="flex items-center gap-1 mt-1 text-[10px] text-gray-500">
                      <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                      <span className="font-semibold">{product.rating}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>


        {/* ── TODAY'S DEALS SECTION ── */}
        <section className="text-left w-full">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-6 gap-4">
            <div>
              <h2 className="text-xl md:text-2xl font-extrabold text-[#04061A]">Today's Deals</h2>
              <p className="text-xs text-gray-400 mt-1">Limited time offers - don't miss out!</p>
            </div>
            <Link 
              to="/deals" 
              className="text-xs font-bold text-[#FF5B00] hover:text-[#E04E00] flex items-center gap-1 uppercase tracking-wider shrink-0"
            >
              View all deals <ChevronRight size={14} />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
            
            {/* Card 1: Flash Sale */}
            <div 
              onClick={() => navigate('/deals')}
              className="bg-gradient-to-br from-rose-500 to-orange-500 rounded-xl p-5 text-white flex justify-between items-center cursor-pointer hover:shadow-lg transition-shadow relative overflow-hidden group"
            >
              <div className="flex flex-col items-start gap-1 z-10 max-w-[65%]">
                <span className="text-[9px] font-black uppercase tracking-[0.2em] bg-white/20 px-2.5 py-1 rounded-md mb-2">
                  Flash Sale
                </span>
                <h3 className="text-lg font-black tracking-tight leading-none">
                  Up to 60% Off
                </h3>
                <p className="text-[10px] text-white/80 font-medium">
                  On selected items
                </p>
                <span className="text-[10px] font-bold uppercase tracking-wider mt-4 flex items-center gap-1">
                  SHOP NOW <ChevronRight size={12} className="group-hover:translate-x-1 transition-transform" />
                </span>
              </div>
              <div className="relative text-white/10 group-hover:scale-110 group-hover:rotate-12 transition-transform duration-500">
                <Flame size={70} className="stroke-[1.5] text-white opacity-40" />
              </div>
            </div>

            {/* Card 2: Bank Offer */}
            <div 
              onClick={() => navigate('/deals')}
              className="bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl p-5 text-white flex justify-between items-center cursor-pointer hover:shadow-lg transition-shadow relative overflow-hidden group"
            >
              <div className="flex flex-col items-start gap-1 z-10 max-w-[65%]">
                <span className="text-[9px] font-black uppercase tracking-[0.2em] bg-white/20 px-2.5 py-1 rounded-md mb-2">
                  Bank Offer
                </span>
                <h3 className="text-lg font-black tracking-tight leading-none">
                  Up to 20% Cashback
                </h3>
                <p className="text-[10px] text-white/80 font-medium">
                  With selected cards
                </p>
                <span className="text-[10px] font-bold uppercase tracking-wider mt-4 flex items-center gap-1">
                  SHOP NOW <ChevronRight size={12} className="group-hover:translate-x-1 transition-transform" />
                </span>
              </div>
              <div className="relative text-white/10 group-hover:scale-110 group-hover:rotate-12 transition-transform duration-500">
                <CreditCard size={70} className="stroke-[1.5] text-white opacity-40" />
              </div>
            </div>

            {/* Card 3: Coupons */}
            <div 
              onClick={() => {
                navigator.clipboard.writeText('CHOOSIFY10COP');
                toast.success('Coupon copied to clipboard!');
              }}
              className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl p-5 text-white flex justify-between items-center cursor-pointer hover:shadow-lg transition-shadow relative overflow-hidden group"
            >
              <div className="flex flex-col items-start gap-1 z-10 max-w-[65%]">
                <span className="text-[9px] font-black uppercase tracking-[0.2em] bg-white/20 px-2.5 py-1 rounded-md mb-2">
                  Coupons
                </span>
                <h3 className="text-lg font-black tracking-tight leading-none">
                  Extra 10% Off
                </h3>
                <p className="text-[10px] text-white/80 font-medium">
                  On orders over ৳5,000
                </p>
                <span className="text-[10px] font-mono font-black uppercase tracking-wider bg-black/10 px-2 py-1 rounded-md mt-4 flex items-center gap-1.5">
                  CHOOSIFY10COP <Ticket size={12} />
                </span>
              </div>
              <div className="relative text-white/10 group-hover:scale-110 group-hover:rotate-12 transition-transform duration-500">
                <Ticket size={70} className="stroke-[1.5] text-white opacity-40" />
              </div>
            </div>

            {/* Card 4: Sponsored (Pickaboo) */}
            <div 
              onClick={() => navigate('/search?q=electronics')}
              className="bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl p-5 text-white flex justify-between items-center cursor-pointer hover:shadow-lg transition-shadow relative overflow-hidden group"
            >
              <div className="flex flex-col items-start gap-1 z-10 max-w-[65%]">
                <span className="text-[9px] font-black uppercase tracking-[0.2em] bg-white/20 px-2.5 py-1 rounded-md mb-2">
                  Sponsored
                </span>
                <h3 className="text-lg font-black tracking-tight leading-none">
                  Pickaboo Mega Deals
                </h3>
                <p className="text-[10px] text-white/80 font-medium">
                  Best prices on electronics
                </p>
                <span className="text-[10px] font-bold uppercase tracking-wider mt-4 flex items-center gap-1">
                  EXPLORE NOW <ChevronRight size={12} className="group-hover:translate-x-1 transition-transform" />
                </span>
              </div>
              <div className="relative text-white/10 group-hover:scale-110 group-hover:rotate-12 transition-transform duration-500">
                <ShoppingBag size={70} className="stroke-[1.5] text-white opacity-40" />
              </div>
            </div>

          </div>
        </section>


        {/* ── COMPARE ANYTHING SECTION ── */}
        <section className="text-left w-full bg-white rounded-2xl border border-gray-100 p-6 md:p-8 shadow-xs">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
            <div>
              <h2 className="text-xl md:text-2xl font-extrabold text-[#04061A]">Compare Anything</h2>
              <p className="text-xs text-gray-400 mt-1">Find the best by comparing side by side</p>
            </div>
            <Link 
              to="/compare" 
              className="text-xs font-bold text-[#FF5B00] hover:text-[#E04E00] flex items-center gap-1 uppercase tracking-wider"
            >
              View all comparisons <ChevronRight size={14} />
            </Link>
          </div>

          {/* Form */}
          <form onSubmit={handleCompareSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
            
            {/* Input 1 */}
            <div className="lg:col-span-5 relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input 
                type="text" 
                placeholder="Search for first product" 
                value={compareFirst}
                onChange={(e) => setCompareFirst(e.target.value)}
                className="w-full h-11 pl-10 pr-4 rounded-lg bg-gray-50 border border-gray-200 text-xs font-medium focus:bg-white focus:outline-none focus:border-[#FF5B00] transition-all"
              />
            </div>

            {/* VS Divider */}
            <div className="lg:col-span-1 flex justify-center text-xs font-extrabold text-gray-400 tracking-wider">
              VS
            </div>

            {/* Input 2 */}
            <div className="lg:col-span-4 relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input 
                type="text" 
                placeholder="Search for second product" 
                value={compareSecond}
                onChange={(e) => setCompareSecond(e.target.value)}
                className="w-full h-11 pl-10 pr-4 rounded-lg bg-gray-50 border border-gray-200 text-xs font-medium focus:bg-white focus:outline-none focus:border-[#FF5B00] transition-all"
              />
            </div>

            {/* Submit Button */}
            <div className="lg:col-span-2">
              <button 
                type="submit"
                className="w-full h-11 bg-[#0A0D28] hover:bg-[#12163E] text-white text-xs font-black uppercase tracking-widest rounded-lg cursor-pointer transition-colors"
              >
                Compare
              </button>
            </div>

          </form>

          {/* Popular comparisons pills */}
          <div className="mt-6">
            <h4 className="text-[10px] font-black uppercase tracking-wider text-gray-400 mb-3">
              Popular Comparisons
            </h4>
            <div className="flex flex-wrap gap-2">
              {[
                { p1: 'Samsung S24 Ultra', p2: 'iPhone 15 Pro Max' },
                { p1: 'Sony WH-1000XM5', p2: 'Bose QC Ultra' },
                { p1: 'Sea Pearl Resort', p2: 'Radisson Blu' },
                { p1: 'MacBook Air M3', p2: 'Dell XPS 13' },
                { p1: 'PS5 Slim', p2: 'Xbox Series X' }
              ].map((comp, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => selectComparison(comp.p1, comp.p2)}
                  className="px-3.5 py-2 bg-gray-50 hover:bg-gray-100 border border-gray-100 rounded-lg text-xs font-semibold text-gray-600 cursor-pointer transition-colors"
                >
                  {comp.p1} <span className="text-[#FF5B00] font-black px-1">vs</span> {comp.p2}
                </button>
              ))}
            </div>
          </div>
        </section>


        {/* ── TOP BUYING GUIDES SECTION ── */}
        <section className="text-left w-full">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-6 gap-4">
            <div>
              <h2 className="text-xl md:text-2xl font-extrabold text-[#04061A]">Top Buying Guides</h2>
              <p className="text-xs text-gray-400 mt-1">Expert guides to help you decide</p>
            </div>
            <Link 
              to="/guides" 
              className="text-xs font-bold text-[#FF5B00] hover:text-[#E04E00] flex items-center gap-1 uppercase tracking-wider shrink-0"
            >
              View all guides <ChevronRight size={14} />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
            {BUYING_GUIDES.map((guide) => (
              <div 
                key={guide.id}
                onClick={() => navigate('/guides')}
                className="bg-white rounded-xl border border-gray-100 overflow-hidden cursor-pointer hover:shadow-lg transition-all hover:-translate-y-1 group"
              >
                <div className="w-full aspect-[4/3] relative overflow-hidden bg-gray-50">
                  <img 
                    src={guide.image} 
                    alt={guide.title} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="p-3">
                  <h3 className="text-xs font-bold text-[#04061A] line-clamp-2 tracking-tight group-hover:text-[#FF5B00] transition-colors leading-snug">
                    {guide.title}
                  </h3>
                  <span className="text-[10px] text-gray-400 mt-2 block font-medium">
                    {guide.desc}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>


        {/* ── FEATURED BRANDS SECTION ── */}
        <section className="text-left w-full">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-6 gap-4">
            <div>
              <h2 className="text-xl md:text-2xl font-extrabold text-[#04061A]">Featured Brands</h2>
              <p className="text-xs text-gray-400 mt-1">Trusted brands, verified sellers</p>
            </div>
            <Link 
              to="/brands" 
              className="text-xs font-bold text-[#FF5B00] hover:text-[#E04E00] flex items-center gap-1 uppercase tracking-wider shrink-0"
            >
              View all brands <ChevronRight size={14} />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4">
            {BRAND_LOGOS.map((brand, idx) => (
              <div 
                key={idx}
                onClick={() => {
                  toast.success(`Opening ${brand.name} collection`);
                  navigate('/brands');
                }}
                className="bg-white rounded-xl border border-gray-100 h-16 flex items-center justify-center p-4 cursor-pointer hover:shadow-md hover:border-[#FF5B00]/30 transition-all group"
              >
                {brand.image ? (
                  <img 
                    src={brand.image} 
                    alt={brand.name} 
                    className="max-h-7 max-w-full object-contain filter grayscale opacity-70 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-300"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <span className={`text-xs font-black uppercase tracking-widest leading-none ${brand.color} group-hover:scale-105 transition-transform`}>
                    {brand.text}
                  </span>
                )}
              </div>
            ))}
          </div>
        </section>


        {/* ── POPULAR SERVICES SECTION ── */}
        <section className="text-left w-full">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-6 gap-4">
            <div>
              <h2 className="text-xl md:text-2xl font-extrabold text-[#04061A]">Popular Services</h2>
              <p className="text-xs text-gray-400 mt-1">Book, reserve & more</p>
            </div>
            <span className="text-xs font-bold text-[#FF5B00] hover:text-[#E04E00] cursor-pointer flex items-center gap-1 uppercase tracking-wider shrink-0">
              View all services <ChevronRight size={14} />
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4">
            {POPULAR_SERVICES.map((service, idx) => (
              <div 
                key={idx}
                onClick={() => toast.success(`${service.name} Sourcing is coming soon!`)}
                className="bg-white rounded-xl border border-gray-100 p-4 flex flex-col items-center justify-center cursor-pointer hover:shadow-md hover:border-gray-200 transition-all"
              >
                <div className="w-10 h-10 rounded-full bg-[#FF5B00]/5 flex items-center justify-center text-[#FF5B00] mb-2.5">
                  <service.icon size={18} />
                </div>
                <h3 className="text-xs font-bold text-[#04061A] text-center truncate w-full">
                  {service.name}
                </h3>
                <span className="text-[9px] text-gray-400 mt-0.5 font-semibold text-center truncate w-full">
                  {service.subtitle}
                </span>
              </div>
            ))}
          </div>
        </section>


        {/* ── RECENTLY VIEWED SECTION ── */}
        <section className="text-left w-full border-t border-gray-100 pt-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-black text-[#04061A]">Recently Viewed</h2>
              <p className="text-xs text-gray-400 mt-0.5 font-medium">Continue where you left off</p>
            </div>
            <button className="w-8 h-8 rounded-full border border-gray-200 hover:border-gray-300 flex items-center justify-center text-gray-500 cursor-pointer hover:text-[#FF5B00] transition-colors">
              <ChevronRight size={16} />
            </button>
          </div>

          <div className="flex gap-4 overflow-x-auto pb-4 pt-1 snap-x scroll-smooth no-scrollbar">
            {RECENTLY_VIEWED.map((img, idx) => (
              <div 
                key={idx}
                className="flex-shrink-0 w-16 h-16 rounded-xl border border-gray-100 overflow-hidden bg-white hover:border-[#FF5B00]/40 transition-colors cursor-pointer flex items-center justify-center shadow-xs"
              >
                <img 
                  src={img} 
                  alt="Recent item thumbnail" 
                  className="w-12 h-12 object-cover rounded-lg"
                  referrerPolicy="no-referrer"
                />
              </div>
            ))}
          </div>
        </section>

      </main>

    </div>
  );
}
