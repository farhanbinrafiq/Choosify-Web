import React, { useState, useEffect, useRef } from 'react';
import { ProductCard } from '../components/ProductCard';
import { Star, ArrowRight, Search, CheckCircle, Smartphone, Tag, ShoppingBag, Globe, Users, Trophy, ExternalLink, Bookmark, ShieldCheck, Zap, Award, ChevronRight, ChevronLeft, Laptop, Heart, Bike, Car, Camera, Watch, Home, Gift, Shirt, Glasses, Utensils, Baby, GraduationCap, Youtube, Play, Package, Gamepad2, Tv } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { PRODUCTS, BLOGS, BRANDS, PLACEHOLDER_IMAGE } from '../constants';
import { useGlobalState } from '../context/GlobalStateContext';
import { Link, useNavigate } from 'react-router-dom';
import { cn } from '../lib/utils';

import { useCarousel } from '../hooks/useCarousel';

import { ModernCarousel } from '../components/ModernCarousel';

export function HomePage() {
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
  const navigate = useNavigate();
  const { allProducts, mode } = useGlobalState();
  const [activeBrandIndex, setActiveBrandIndex] = useState(1);
  const [activeSection, setActiveSection] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const dragStart = useRef<number | null>(null);
  const isDraggingRef = useRef(false);
  
  const brandCarousel = useCarousel(4, 3500);
  
  // Resize listener for responsive carousel count
  useEffect(() => {
    const handleResize = () => {
      // Small delay to debounce if needed
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (!element) return;
    const navbarHeight = 80;
    const top = element.getBoundingClientRect().top + window.scrollY - navbarHeight - 12;
    window.scrollTo({ top, behavior: 'smooth' });
  };

  useEffect(() => {
    const sections = ['trending-brands', 'popular-products', 'business', 'guides', 'categories'];
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { threshold: 0.4 }
    );
    sections.forEach(id => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    e.currentTarget.src = PLACEHOLDER_IMAGE;
  };

  const trendingBrands = [
    { name: "Apex", category: "Footwear & Lifestyle", img: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&h=600&fit=crop", id: 3 },
    { name: "La Reve", category: "Clothing & Lifestyle", img: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&h=600&fit=crop", id: 7 },
    { name: "Perfume World", category: "Best Fragrance", img: "https://images.unsplash.com/photo-1541643600914-78b084683601?w=800&h=600&fit=crop", id: 8 },
    { name: "Pickaboo", category: "Gadgets & Electronics", img: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&h=600&fit=crop", id: 9 }
  ];

  const categories = [
    { name: "Footwear & Shoes", count: "125 Brands", icon: <ShoppingBag className="text-blue-500" />, color: "from-blue-500/10 to-indigo-600/10", id: 'fashion' },
    { name: "Tools & Equipment", count: "89 Brands", icon: <Zap className="text-orange-500" />, color: "from-orange-500/10 to-amber-600/10", id: 'tech' },
    { name: "Books & Station", count: "210 Brands", icon: <Globe className="text-purple-500" />, color: "from-purple-500/10 to-violet-600/10", id: 'home' },
    { name: "Food & Grocery", count: "340 Brands", icon: <Tag className="text-red-500" />, color: "from-red-500/10 to-rose-600/10", id: 'food' },
    { name: "Smart Home Devices", count: "56 Brands", icon: <Home className="text-green-500" />, color: "from-green-500/10 to-emerald-600/10", id: 'tech' },
    { name: "Children & Toys", count: "112 Brands", icon: <Gift className="text-pink-500" />, color: "from-pink-500/10 to-rose-600/10", id: 'baby' },
    { name: "Travel & Backpack", count: "45 Brands", icon: <Bike className="text-indigo-500" />, color: "from-indigo-500/10 to-blue-600/10", id: 'fashion' },
    { name: "Social Entertainment", count: "78 Brands", icon: <Award className="text-yellow-500" />, color: "from-yellow-500/10 to-orange-600/10", id: 'gaming' },
    { name: "Beauty & Personal", count: "156 Brands", icon: <Heart className="text-rose-500" />, color: "from-rose-500/10 to-pink-600/10", id: 'jewelry' },
    { name: "Medical & Health", count: "92 Brands", icon: <ShieldCheck className="text-cyan-500" />, color: "from-cyan-500/10 to-teal-600/10", id: 'tech' },
    { name: "App & Appliances", count: "67 Brands", icon: <Smartphone className="text-slate-500" />, color: "from-slate-500/10 to-gray-600/10", id: 'mobile' },
    { name: "Watch & Jewelry", count: "43 Brands", icon: <Watch className="text-amber-500" />, color: "from-amber-500/10 to-yellow-600/10", id: 'jewelry' },
  ];

  return (
    <div className="flex flex-col bg-white">
      {/* Hero Section */}
      <section className="relative w-full min-h-[85vh] flex flex-col justify-center pt-24 pb-48 md:pb-32 overflow-hidden bg-[#0A0A1F]">
        {/* Background Gradients matching other directory pages */}
        {mode === 'wholesale' ? (
          <div className="absolute inset-0 bg-gradient-to-r from-[#FF5B00]/30 via-[#EB4501]/10 to-[#0A0A1F] opacity-90" />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-r from-[#4A1D1D] via-[#0A0A1F] to-[#0A0A1F] opacity-80" />
        )}
        <div className="absolute top-0 right-0 w-1/3 h-full bg-orange-primary/10 blur-[120px] rounded-full translate-x-1/2 -translate-y-1/2 opacity-50" />
        
        <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10 flex flex-col items-center text-center">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-10"
          >
            {mode === 'wholesale' ? (
              <div className="bg-gradient-to-r from-orange-primary to-orange-deep text-white text-[10px] md:text-[11px] font-black px-6 md:px-8 py-2.5 rounded-full uppercase tracking-[0.25em] italic shadow-2xl inline-block animate-pulse">
                B2B WHOLESALE MARKETPLACE
              </div>
            ) : (
              <div className="bg-orange-primary text-white text-[10px] md:text-[11px] font-black px-6 md:px-8 py-2.5 rounded-full uppercase tracking-[0.25em] italic shadow-2xl shadow-orange-primary/30 inline-block">
                Bangladesh's #1 Brand Discovery Platform
              </div>
            )}
          </motion.div>
 
          <motion.h1 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-4xl sm:text-6xl md:text-[88px] font-black text-white mb-6 tracking-tighter leading-[0.9] max-w-6xl uppercase italic px-4"
          >
            CHOOSE, VERIFY & <span className="text-orange-primary">BUY ORIGINAL</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-white/70 text-sm md:text-lg max-w-2xl mb-16 font-bold uppercase tracking-[0.2em] italic opacity-80 leading-relaxed"
          >
            {mode === 'wholesale' 
              ? "Choose, B2B & Wholesale" 
              : "Verifying 500+ Local & Global Brands To Protect Your Shopping Experience."}
          </motion.p>
          
          {/* Main Search Bar */}
          <motion.form 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            onSubmit={handleSearch}
            className="w-full max-w-4xl bg-white rounded-3xl md:rounded-full p-2 flex flex-col md:flex-row items-center shadow-[0_40px_100px_rgba(0,0,0,0.5)] mb-12 transition-all hover:scale-[1.01] relative z-20 group"
          >
            <div className="w-full flex-1 flex items-center px-4 md:px-6">
              <Search className="text-gray-300 group-focus-within:text-orange-primary transition-colors shrink-0" size={24} />
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search brands like Samsung or Apex..."
                className="w-full h-14 md:h-16 bg-transparent text-[#0A0A1F] font-bold px-4 focus:outline-none placeholder:text-gray-400 text-base md:text-lg italic"
              />
            </div>
            <button 
              type="submit"
              className="w-full md:w-auto h-14 md:h-16 px-12 orange-brand-gradient text-white font-black rounded-2xl md:rounded-full shadow-xl hover:brightness-110 transition-all text-sm uppercase tracking-widest flex items-center justify-center gap-3 italic"
            >
              Search
            </button>
          </motion.form>
 
          {/* Category Pills */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex flex-wrap justify-center gap-3 max-w-5xl relative z-10 pt-4"
          >
            {[
              { label: "Fashion & Lifestyle", icon: <Shirt size={14} /> },
              { label: "Mobile & Wearable", icon: <Smartphone size={14} /> },
              { label: "Eye-wear & Fragrances", icon: <Glasses size={14} /> },
              { label: "Food & Restaurants", icon: <Utensils size={14} /> },
              { label: "Family & Kids", icon: <Baby size={14} /> },
              { label: "Education & Learning", icon: <GraduationCap size={14} /> }
            ].map((cat, i) => (
              <Link 
                key={i}
                to="/categories"
                className="bg-[#0A0A1F]/60 backdrop-blur-md border border-white/10 px-6 py-3 rounded-full flex items-center gap-3 text-white hover:border-orange-primary/40 transition-all group shadow-xl"
              >
                <span className="text-orange-primary group-hover:scale-110 transition-transform">{cat.icon}</span>
                <span className="text-[10px] font-black uppercase tracking-widest italic">{cat.label}</span>
              </Link>
            ))}
          </motion.div>
        </div>

        {/* Stats Section on the bottom edge */}
        <div className="absolute bottom-0 left-0 w-full py-6 md:py-10 bg-white/5 backdrop-blur-md border-t border-white/10">
           <div className="max-w-7xl mx-auto px-4 md:px-8 grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 lg:gap-0">
              {[
                { label: "Brand Listed", val: "500+", color: "text-white" },
                { label: "Product Tracked", val: "12k+", color: "text-white" },
                { label: "Comparison Made", val: "3M+", color: "text-white" },
                { label: "User Satisfaction", val: "99%", color: "text-orange-primary" }
              ].map((stat, i) => (
                <div key={i} className="flex flex-col items-center lg:items-start lg:px-12 lg:border-r last:border-0 border-white/10">
                   <div className="flex items-end gap-1 mb-1">
                      <span className={cn("text-2xl sm:text-4xl font-black italic tracking-tighter leading-none", stat.color)}>{stat.val}</span>
                   </div>
                   <span className="text-[8px] md:text-[10px] font-black text-white/40 uppercase tracking-[0.3em] italic">{stat.label}</span>
                </div>
              ))}
           </div>
        </div>
      </section>

      {/* Trending Brands Carousel Section */}
      <section 
        id="trending-brands" 
        className="relative overflow-hidden"
      >
        <ModernCarousel />
      </section>

      {/* Popular Products */}
      <section 
        id="popular-products" 
        className="py-16 px-4 md:px-8 bg-white border-y border-gray-50 group/products"
      >
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl font-black text-navy uppercase tracking-tighter italic">Popular Products</h2>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.4em] italic mt-1">Trending now in Bangladesh</p>
            </div>
            <Link to="/products" className="text-orange-primary font-black uppercase tracking-widest text-[10px] flex items-center gap-2 hover:gap-3 transition-all mr-4">Browse All <ArrowRight size={14}/></Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {allProducts.slice(0, 8).map(product => (
              <div key={product.id}>
                <ProductCard product={product} variant="grid" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Business & Product Grid Section - Image 3 Style */}
      <section id="business" className="py-16 px-4 md:px-8 bg-[#F4F9FF] overflow-hidden relative border-t border-gray-100">
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-left mb-12">
            <h2 className="text-4xl font-black text-[#0D0D1A] italic uppercase tracking-tighter">For Business & Sellers</h2>
            <p className="text-[14px] font-bold text-gray-400 mt-2 uppercase tracking-wide">Approved Offers From Verified Merchants Setting Exclusive Items</p>
          </div>

          <div className="bg-white/60 backdrop-blur-sm rounded-[10px] p-24 border border-dashed border-[#FF5B00]/30 text-center mb-16 relative overflow-hidden shadow-sm">
             <div className="absolute top-0 right-0 w-32 h-32 bg-orange-primary/5 rounded-full -translate-y-1/2 translate-x-1/2" />
             <div className="absolute bottom-0 left-0 w-24 h-24 bg-orange-primary/5 rounded-full translate-y-1/2 -translate-x-1/2" />
             
             <h3 className="text-[28px] font-black text-[#FF5B00] mb-10 uppercase tracking-[0.2em] italic relative z-10">Boost Your Sales, Submit Your Offer</h3>
             <button 
               onClick={() => navigate('/post-offer')}
               className="px-16 py-5 bg-[#FF5B00] text-white font-black rounded-[10px] flex items-center gap-4 mx-auto shadow-2xl shadow-[#FF5B00]/40 hover:scale-105 active:scale-95 transition-all text-[14px] uppercase tracking-widest relative z-10 italic"
             >
                Post Offer <ExternalLink size={20} />
             </button>
             <p className="mt-10 text-[12px] font-bold text-gray-400 uppercase tracking-[0.3em] relative z-10">100,000+ Shoppers Log In Every Day</p>
          </div>
        </div>
      </section>

      {/* Flash Deals Section - Image 8 Marketplace Style */}
      <section 
        id="flash-deals" 
        className="py-20 px-4 md:px-8 bg-[#F8FAFC] border-t border-gray-100"
      >
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
            <div>
              <h2 className="text-3xl md:text-5xl font-black text-navy uppercase tracking-tighter italic leading-none mb-3">FLASH <span className="text-orange-primary">DEALS</span></h2>
              <div className="flex items-center gap-3">
                 <div className="flex items-center gap-2 bg-orange-primary/10 px-4 py-1.5 rounded-full border border-orange-primary/20">
                    <Zap size={14} className="text-orange-primary fill-orange-primary" />
                    <span className="text-[10px] font-black text-orange-primary uppercase tracking-widest italic">ENDS IN 10:10:10</span>
                 </div>
                 <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.4em] italic mb-1 px-2 border-l-4 border-orange-primary">Hottest Offers Today</p>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-4">
               <Link to="/deals" className="px-8 py-3.5 bg-orange-primary text-white font-black uppercase tracking-widest text-[10px] rounded-full hover:brightness-110 transition-all transform hover:scale-105 active:scale-95 italic shadow-xl shadow-orange-primary/20">View All Deals</Link>
            </div>
          </div>
          
          <div className="flex flex-col gap-10 items-center">
             {/* Banner Card */}
             {allProducts.length > 0 && (
               <div className="w-full lg:w-[1280px] lg:h-[395px] flex-shrink-0">
                  <ProductCard 
                    product={{
                      ...allProducts[0],
                      tag: "HOT",
                      tagColor: "bg-[#E93B3B]",
                    }} 
                    variant="featured"
                    showCountdown={true}
                  />
               </div>
             )}
             
             {/* Small Cards Row */}
             <div className="flex flex-col md:flex-row gap-6 lg:gap-0 lg:w-[1280px] lg:justify-between items-center w-full">
                {allProducts.slice(1, 5).map((product) => (
                   <div key={product.id} className="w-full max-w-[300px] lg:w-[300px] lg:h-[572px] flex-shrink-0">
                     <ProductCard 
                       product={{
                         ...product,
                         tag: "SALE",
                         tagColor: "bg-[#E98B8B]",
                       }} 
                       variant="compact"
                       showCountdown={true}
                     />
                   </div>
                ))}
             </div>
          </div>
        </div>
      </section>

      {/* Expert Guides & Recommendations Section */}
      <section id="guides" className="bg-white py-12 md:py-20 overflow-hidden relative">
         <div className="max-w-7xl mx-auto px-4 md:px-6">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 md:mb-16 gap-6">
               <div>
                  <h2 className="text-3xl sm:text-4xl md:text-[48px] font-black text-navy uppercase tracking-tighter italic leading-none mb-4">Expert <span className="text-orange-primary">Recommendations</span></h2>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.4em] italic mb-2 px-2 border-l-4 border-orange-primary">Curated Picks for you</p>
               </div>
               <Link to="/guides" className="w-fit px-8 md:px-10 py-3 md:py-4 bg-white border-2 border-navy text-navy font-black uppercase tracking-widest text-[10px] rounded-full hover:bg-navy hover:text-white transition-all transform hover:scale-105 active:scale-95 italic shadow-xl shadow-navy/5">View All Guides</Link>
            </div>

            {/* Main Featured Guide Card - Redesigned to match Overall Winner Style */}
            <div className="relative w-full min-h-[350px] md:h-[350px] rounded-[10px] overflow-hidden mb-12 md:mb-20 group shadow-[0_40px_120px_rgba(0,0,0,0.15)] border border-gray-100 flex flex-col">
               <img 
                 src="https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=1600&h=900&fit=crop" 
                 className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-[3s]" 
                 alt="Featured Guide"
               />
               <div className="absolute inset-0 bg-gradient-to-b md:bg-gradient-to-r from-[#0D0B33] via-[#0D0B33]/80 to-transparent" />
               
               <div className="relative z-10 p-8 md:p-12 flex flex-col justify-center items-start h-full mt-auto">
                  <div className="bg-[#FF5C38] text-white text-[10px] font-black px-6 md:px-8 py-2 md:py-3 rounded-xl mb-4 md:mb-6 uppercase tracking-[0.3em] italic shadow-lg shadow-orange-primary/30">
                    FEATURED 2026 GUIDE
                  </div>
                  
                  <h4 className="text-3xl md:text-5xl font-black text-white italic tracking-tighter leading-[0.9] mb-4 md:mb-6 max-w-4xl uppercase group-hover:tracking-normal transition-all duration-700">
                    THE DEFINITIVE SMARTPHONE BUYING GUIDE 2026
                  </h4>
                  
                  <div className="flex flex-col md:flex-row items-start md:items-center gap-6 md:gap-10">
                     <Link to="/guides/1" className="w-full md:w-auto bg-white text-navy px-8 py-4 rounded-[16px] text-[10px] md:text-[11px] font-black uppercase tracking-widest italic flex items-center justify-center gap-3 hover:bg-orange-primary hover:text-white hover:scale-105 active:scale-95 transition-all shadow-2xl">
                        READ FULL GUIDE <ArrowRight size={18} className="-rotate-45" />
                     </Link>
                     
                     <div className="flex items-center gap-4 md:gap-6">
                        <div className="w-10 h-10 md:w-12 h-12 rounded-full border-2 border-white/20 p-1 group/author cursor-pointer">
                           <img src="https://i.pravatar.cc/100?img=11" className="w-full h-full rounded-full object-cover group-hover:scale-110 transition-transform" alt="author" />
                        </div>
                        <div className="flex flex-col">
                           <div className="flex flex-col sm:flex-row sm:items-center gap-2 md:gap-3">
                              <span className="w-6 h-6 rounded-full bg-orange-primary flex items-center justify-center text-white text-[8px] font-black shrink-0">F</span>
                              <span className="text-white/40 text-[8px] md:text-[10px] font-black uppercase tracking-widest italic">Research by Farhan Bin Rafiq • May 12, 2026</span>
                           </div>
                        </div>
                     </div>
                  </div>
               </div>
            </div>

            {/* Secondary Guides (3 Small Cards Underneath) */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
               <Link to="/guides/1" className="group block">
                  <div className="relative aspect-[16/10] rounded-[10px] overflow-hidden mb-10 border border-gray-100 shadow-xl bg-gray-50">
                     <img 
                       src="https://images.unsplash.com/photo-1512428559083-a40516a3ee85?w=800&h=500&fit=crop" 
                       loading="lazy"
                       onError={handleImageError}
                       className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[1.5s]" 
                       alt="Guide" 
                     />
                     <div className="absolute top-8 left-8 w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30 text-white shadow-xl">
                        <Smartphone size={24} />
                     </div>
                  </div>
                  <h5 className="text-3xl font-black text-navy italic tracking-tighter leading-tight mb-5 group-hover:text-orange-primary transition-colors uppercase">TOP 10 SMARTPHONES TO BUY IN 2026</h5>
                  <p className="text-sm text-gray-400 font-bold leading-relaxed uppercase tracking-wider mb-10 italic line-clamp-2 opacity-80">
                     Looking for a new phone? We've compiled the best options available in the market right now for every budget and use case.
                  </p>
                  <div className="flex items-center justify-between pt-8 border-t border-gray-50 group-hover:border-orange-primary/20 transition-colors">
                     <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest italic">8 MIN READ</span>
                     <span className="text-[11px] font-black text-orange-primary uppercase tracking-widest italic flex items-center gap-3 group-hover:translate-x-2 transition-transform">
                        READ GUIDE <ArrowRight size={16} className="-rotate-45" />
                     </span>
                  </div>
               </Link>

               {/* Small Guide Card 2 */}
               <Link to="/guides/2" className="group block">
                  <div className="relative aspect-[16/10] rounded-[10px] overflow-hidden mb-10 border border-gray-100 shadow-xl bg-gray-50">
                     <img 
                       src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&h=500&fit=crop" 
                       loading="lazy"
                       onError={handleImageError}
                       className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[1.5s]" 
                       alt="Guide" 
                     />
                     <div className="absolute top-8 left-8 w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30 text-white shadow-xl">
                        <ShoppingBag size={24} />
                     </div>
                  </div>
                  <h5 className="text-3xl font-black text-navy italic tracking-tighter leading-tight mb-5 group-hover:text-orange-primary transition-colors uppercase">APEX VS BATA: THE ULTIMATE SPORTS SHOE BATTLE</h5>
                  <p className="text-sm text-gray-400 font-bold leading-relaxed uppercase tracking-wider mb-10 italic line-clamp-2 opacity-80">
                     We put the top two local giants against each other in this durability and comfort test to see which reigns supreme in 2026.
                  </p>
                  <div className="flex items-center justify-between pt-8 border-t border-gray-50 group-hover:border-orange-primary/20 transition-colors">
                     <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest italic">12 MIN READ</span>
                     <span className="text-[11px] font-black text-orange-primary uppercase tracking-widest italic flex items-center gap-3 group-hover:translate-x-2 transition-transform">
                        READ GUIDE <ArrowRight size={16} className="-rotate-45" />
                     </span>
                  </div>
               </Link>

               {/* Small Guide Card 3 */}
               <Link to="/guides/3" className="group block">
                  <div className="relative aspect-[16/10] rounded-[10px] overflow-hidden mb-10 border border-gray-100 shadow-xl bg-gray-50">
                     <img 
                       src="https://images.unsplash.com/photo-1491933382434-500287f9b54b?w=800&h=500&fit=crop" 
                       loading="lazy"
                       onError={handleImageError}
                       className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[1.5s]" 
                       alt="Guide" 
                     />
                     <div className="absolute top-8 left-8 w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30 text-white shadow-xl">
                        <Tag size={24} />
                     </div>
                  </div>
                  <h5 className="text-3xl font-black text-navy italic tracking-tighter leading-tight mb-5 group-hover:text-orange-primary transition-colors uppercase">EID COLLECTION 2026: WHAT'S TRENDING NOW</h5>
                  <p className="text-sm text-gray-400 font-bold leading-relaxed uppercase tracking-wider mb-10 italic line-clamp-2 opacity-80">
                     From traditional panjabis to modern fusion wear, discover the absolute best picks for this festive season in Bangladesh.
                  </p>
                  <div className="flex items-center justify-between pt-8 border-t border-gray-50 group-hover:border-orange-primary/20 transition-colors">
                     <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest italic">6 MIN READ</span>
                     <span className="text-[11px] font-black text-orange-primary uppercase tracking-widest italic flex items-center gap-3 group-hover:translate-x-2 transition-transform">
                        READ GUIDE <ArrowRight size={16} className="-rotate-45" />
                     </span>
                  </div>
               </Link>
            </div>

            {/* Recommendation Page Button */}
            <div className="mt-24 flex justify-center">
               <button 
                 onClick={() => navigate('/guides')}
                 className="group relative flex items-center gap-4 px-16 py-7 bg-navy rounded-[10px] shadow-2xl hover:shadow-orange-primary/20 transition-all overflow-hidden"
               >
                  <div className="absolute inset-0 bg-gradient-to-r from-orange-primary to-orange-600 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                  <span className="relative z-10 text-[12px] font-black text-white uppercase tracking-[0.4em] italic">Explore All Recommendations</span>
                  <div className="relative z-10 w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white group-hover:bg-white group-hover:text-navy transition-all">
                     <ArrowRight size={18} />
                  </div>
               </button>
            </div>
         </div>
      </section>

      {/* Partners / Banner Section */}
      <section className="py-12 bg-[#F8FAFC]">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
           <div className="dark-brand-gradient rounded-[15px] p-8 flex flex-col md:flex-row items-center justify-between gap-8 border border-white/5 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-64 h-full bg-purple-500/10 blur-[80px] -translate-x-1/2 translate-y-1/2" />
              <div className="flex items-center gap-8 relative z-10">
                 <div className="w-16 h-16 rounded-[15px] bg-[#7C3AED] flex items-center justify-center text-white font-black text-2xl shadow-xl">
                    ez
                 </div>
                 <div className="flex flex-col">
                    <h3 className="text-xl font-bold text-white mb-1">EZ-booking - Your Travel Solution</h3>
                    <p className="text-gray-400 text-sm">Best Travel Packages, Air tickets, Hotels in your budget under 1 day.</p>
                 </div>
              </div>
              <button className="px-10 py-3 bg-[#D97706] text-white text-xs font-black uppercase rounded-xl hover:bg-[#B45309] transition-all relative z-10">
                 Visit Now
              </button>
           </div>
        </div>
      </section>

      {/* Popular Product Categories */}
      <section id="categories" className="py-16 bg-[#EEF2F6] px-4 md:px-8">
        <div className="max-w-7xl mx-auto">
           <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
              <div>
                 <h2 className="text-3xl font-black text-navy uppercase tracking-tighter italic leading-none mb-4">Popular <span className="text-orange-primary">Categories</span></h2>
                 <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.4em] italic mb-2 px-2 border-l-4 border-orange-primary">Explore by Industry & Niche</p>
              </div>
              <Link to="/categories" className="px-10 py-4 bg-white border-2 border-navy text-navy font-black uppercase tracking-widest text-[10px] rounded-full hover:bg-navy hover:text-white transition-all transform hover:scale-105 active:scale-95 italic shadow-xl shadow-navy/5">Show All Category</Link>
           </div>
           
           <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-6">
              {categories.slice(0, 8).map((cat, i) => (
                 <motion.div 
                    key={i} 
                    whileHover={{ y: -10 }}
                    onClick={() => navigate((cat as any).path || '/categories')}
                    className="bg-white rounded-[15px] p-8 flex flex-col gap-5 hover:shadow-2xl transition-all cursor-pointer border border-gray-50 group relative overflow-hidden"
                 >
                    <div className={cn(
                      "absolute top-0 left-0 w-full h-1 bg-gradient-to-r opacity-0 group-hover:opacity-100 transition-opacity",
                      cat.color
                    )} />
                    <div className={cn(
                      "w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-300 shadow-sm group-hover:scale-110 group-hover:shadow-xl bg-white border border-gray-50",
                    )}>
                       {React.cloneElement(cat.icon as React.ReactElement<any>, { size: 24, className: (cat.icon as any).props.className })}
                    </div>
                    <div className="flex flex-col">
                       <h4 className="text-base font-black text-navy mb-1 group-hover:text-orange-primary transition-colors italic">{cat.name}</h4>
                       <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{cat.count}</span>
                    </div>
                 </motion.div>
              ))}
           </div>
        </div>
      </section>

      {/* Value Proposition */}
      <section className="py-20 bg-white px-4 md:px-8">
         <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-20">
            <div className="flex flex-col items-center text-center">
               <div className="w-20 h-20 rounded-[15px] bg-[#F8FAFC] border border-gray-100 shadow-sm flex items-center justify-center text-navy mb-8">
                  <ShieldCheck size={40} />
               </div>
               <h3 className="text-xl font-black text-navy mb-4 italic">Trust Worthy</h3>
               <p className="text-gray-400 text-sm font-medium leading-relaxed max-w-xs">
                  Bangladesh's First Product discovery platform for shopping quality items at market price. We ensure reliability and authenticity with our hand-picked merchant partnerships.
               </p>
            </div>
            <div className="flex flex-col items-center text-center">
               <div className="w-20 h-20 rounded-[15px] bg-[#F8FAFC] border border-gray-100 shadow-sm flex items-center justify-center text-navy mb-8">
                  <Zap size={40} />
               </div>
               <h3 className="text-xl font-black text-navy mb-4 italic">No Paid Promotion</h3>
               <p className="text-gray-400 text-sm font-medium leading-relaxed max-w-xs">
                  Every product listed is here because of its quality and value, not because of payment. Our goal is to guide you to the right choice with unbiased information.
               </p>
            </div>
            <div className="flex flex-col items-center text-center">
               <div className="w-20 h-20 rounded-[15px] bg-[#F8FAFC] border border-gray-100 shadow-sm flex items-center justify-center text-navy mb-8">
                  <Award size={40} />
               </div>
               <h3 className="text-xl font-black text-navy mb-4 italic">Curated Brands Only</h3>
               <p className="text-gray-400 text-sm font-medium leading-relaxed max-w-xs">
                  We maintain strict criteria for shops and brands on our platform. Only the best stores and authorized dealers are showcased for your shopping safety.
               </p>
            </div>
         </div>
      </section>
    </div>
  );
}
