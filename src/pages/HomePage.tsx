import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  ChevronLeft, ChevronRight, Search, 
  Flame, CreditCard, Ticket, ShoppingBag,
  ShieldCheck as VerifiedIcon
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { ProductCard } from '../components/ProductCard';
import {
  CATEGORY_ITEMS,
  SPOTLIGHT_CARDS,
  FEATURED_PRODUCTS_MOCK,
  BUYING_GUIDES,
  BRAND_LOGOS,
  POPULAR_SERVICES,
  RECENTLY_VIEWED
} from '../data/homeData';

const HERO_SLIDES = [
  {
    title: "Choose, Compare &",
    highlight: "Decide Wisely.",
    subtitle: "Bangladesh's most trusted product discovery platform. Compare prices, read verified guides, and spot authentic deals.",
    cta1: "EXPLORE NOW",
    cta2: "HOW IT WORKS",
    imageLeft: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=500&q=80",
    imageRight: "https://images.unsplash.com/photo-1695048133031-698f1f5068cf?w=500&q=80"
  },
  {
    title: "Compare Smartly,",
    highlight: "Save Instantly.",
    subtitle: "Find the absolute best deals, certified guides, and store prices.",
    cta1: "EXPLORE DEALS",
    cta2: "POPULAR SEARCH",
    imageLeft: "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=500&q=80",
    imageRight: "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=500&q=80"
  }
];

const DEALS_MOCK = [
  {
    type: 'flash',
    bg: 'bg-gradient-to-br from-[#FF5B00] to-[#EB4501]',
    label: 'FLASH SALE',
    title: 'Up to 60% Off',
    subtitle: 'On selected items',
    icon: Flame,
    cta: 'SHOP NOW'
  },
  {
    type: 'bank',
    bg: 'bg-[#3B82F6]',
    label: 'BANK OFFER',
    title: 'Up to 20% Cashback',
    subtitle: 'With selected cards',
    icon: CreditCard,
    cta: 'SHOP NOW'
  },
  {
    type: 'coupon',
    bg: 'bg-[#10B981]',
    label: 'COUPONS',
    title: 'Extra 10% Off',
    subtitle: 'On orders over 5,000',
    icon: Ticket,
    code: 'CHOOSEFY10COP'
  },
  {
    type: 'sponsor',
    bg: 'bg-[#EC4899]',
    label: 'SPONSORED',
    title: 'Pickaboo Mega Deals',
    subtitle: 'Best prices on electronics',
    icon: ShoppingBag,
    cta: 'EXPLORE NOW'
  }
];

export function HomePage() {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [compareFirst, setCompareFirst] = useState('');
  const [compareSecond, setCompareSecond] = useState('');

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 8000);
    return () => clearInterval(timer);
  }, []);

  const handleCompareSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (compareFirst && compareSecond) {
      navigate(`/compare?p1=${encodeURIComponent(compareFirst)}&p2=${encodeURIComponent(compareSecond)}`);
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F7F9] font-sans pb-20">
      {/* 1. HERO SECTION (Edge-to-edge) */}
      <section className="relative w-full h-[760px] bg-[#000435] overflow-hidden flex items-center">
        {/* Subtle gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#000435] via-[#000435]/90 to-transparent z-10" />
        
        {/* Navigation Arrows */}
        <button 
          onClick={() => setCurrentSlide(s => s === 0 ? HERO_SLIDES.length - 1 : s - 1)}
          className="absolute left-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/50 hover:text-white transition-all z-30"
        >
          <ChevronLeft size={24} />
        </button>
        <button 
          onClick={() => setCurrentSlide(s => (s + 1) % HERO_SLIDES.length)}
          className="absolute right-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/50 hover:text-white transition-all z-30"
        >
          <ChevronRight size={24} />
        </button>

        <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-6 md:px-8 relative z-20 flex items-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="grid lg:grid-cols-2 gap-12 items-center w-full"
            >
              <div className="max-w-2xl">
                <h1 className="text-5xl md:text-7xl font-black text-white leading-[1.1] tracking-tight mb-6">
                  {HERO_SLIDES[currentSlide].title} <br/>
                  <span className="text-[#FF5B00]">{HERO_SLIDES[currentSlide].highlight}</span>
                </h1>
                <p className="text-lg text-white/70 font-medium leading-relaxed mb-10 max-w-xl">
                  {HERO_SLIDES[currentSlide].subtitle}
                </p>
                <div className="flex flex-wrap items-center gap-4">
                  <button onClick={() => navigate('/discover')} className="px-8 py-4 bg-[#FF5B00] hover:bg-[#EB4501] text-white rounded-xl font-bold uppercase tracking-wider text-sm transition-all shadow-[0_0_20px_rgba(255,91,0,0.3)]">
                    {HERO_SLIDES[currentSlide].cta1}
                  </button>
                  <button onClick={() => navigate('/about')} className="px-8 py-4 bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-xl font-bold uppercase tracking-wider text-sm transition-all">
                    {HERO_SLIDES[currentSlide].cta2}
                  </button>
                </div>
              </div>
              
              <div className="hidden lg:flex justify-end relative h-[500px]">
                {/* Simulated floating images */}
                <motion.div 
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2, duration: 0.8 }}
                  className="absolute right-[20%] top-0 w-[300px] h-[400px] rounded-3xl overflow-hidden shadow-2xl border border-white/10 rotate-[-5deg]"
                >
                  <img src={HERO_SLIDES[currentSlide].imageLeft} className="w-full h-full object-cover" alt="" />
                </motion.div>
                <motion.div 
                  initial={{ y: 40, opacity: 0 }}
                  animate={{ y: 20, opacity: 1 }}
                  transition={{ delay: 0.4, duration: 0.8 }}
                  className="absolute right-0 top-[10%] w-[280px] h-[380px] rounded-3xl overflow-hidden shadow-2xl border border-white/10 rotate-[5deg]"
                >
                  <img src={HERO_SLIDES[currentSlide].imageRight} className="w-full h-full object-cover" alt="" />
                </motion.div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Carousel Indicators */}
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex items-center gap-3 z-30">
          {HERO_SLIDES.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentSlide(i)}
              className={`h-2 rounded-full transition-all duration-300 ${i === currentSlide ? 'w-8 bg-[#FF5B00]' : 'w-2 bg-white/30 hover:bg-white/50'}`}
            />
          ))}
        </div>
      </section>

      <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-6 md:px-8 space-y-16 py-16">
        
        {/* 2. TOP CATEGORIES */}
        <section>
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">Top Categories</h2>
            <Link to="/categories" className="text-xs font-bold text-[#FF5B00] uppercase tracking-wider flex items-center gap-1 hover:text-[#EB4501]">
              VIEW ALL CATEGORIES <ChevronRight size={14} />
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
            {CATEGORY_ITEMS.map((cat) => (
              <div 
                key={cat.id} 
                onClick={() => navigate('/categories')}
                className="bg-white rounded-3xl p-6 flex flex-col items-center justify-center gap-4 cursor-pointer hover:-translate-y-1 hover:shadow-[0_12px_40px_rgb(0,0,0,0.06)] shadow-[0_4px_20px_rgb(0,0,0,0.02)] transition-all duration-300 border border-transparent"
              >
                <div className="w-14 h-14 rounded-full bg-slate-50 flex items-center justify-center text-2xl">
                  {cat.emoji}
                </div>
                <span className="text-sm font-bold text-slate-700 text-center">{cat.name}</span>
              </div>
            ))}
          </div>
        </section>

        {/* 3. TRENDING IN SPOTLIGHT */}
        <section>
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🔥</span>
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">Trending in Spotlight</h2>
              <span className="text-xs font-semibold text-slate-400 ml-2">Powered by Choosify Spotlight</span>
            </div>
            <Link to="/discover" className="text-xs font-bold text-[#FF5B00] uppercase tracking-wider flex items-center gap-1 hover:text-[#EB4501]">
              VIEW ALL SPOTLIGHT <ChevronRight size={14} />
            </Link>
          </div>
          <div className="flex gap-6 overflow-x-auto pb-6 snap-x scrollbar-hide">
            {SPOTLIGHT_CARDS.map((card) => (
              <div 
                key={card.id}
                onClick={() => navigate(`/discover/${card.id}`)}
                className="relative min-w-[280px] lg:min-w-[320px] h-[400px] rounded-3xl overflow-hidden cursor-pointer group shadow-[0_4px_20px_rgb(0,0,0,0.04)] snap-start shrink-0 border border-transparent"
              >
                <img src={card.cover} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" alt="" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                
                <div className="absolute top-4 left-4">
                  <span className={`text-[10px] font-bold text-white px-3 py-1 rounded-full tracking-wider shadow-md uppercase ${card.badgeBg}`}>
                    {card.badge}
                  </span>
                </div>
                
                <div className="absolute bottom-6 left-6 right-6 text-white">
                  <h3 className="text-xl font-bold leading-tight mb-4 drop-shadow-md">{card.title}</h3>
                  <div className="flex items-center gap-3">
                    <img src={card.avatar} className="w-6 h-6 rounded-full border border-white/20" alt="" />
                    <span className="text-xs font-bold text-white/90">{card.publisher}</span>
                    <VerifiedIcon size={14} className="text-blue-400 ml-auto" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 4. FEATURED PRODUCTS */}
        <section>
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">Featured Products</h2>
              <p className="text-sm text-slate-400 font-medium mt-1">Handpicked deals you'll love</p>
            </div>
            <Link to="/products" className="text-xs font-bold text-[#FF5B00] uppercase tracking-wider flex items-center gap-1 hover:text-[#EB4501]">
              VIEW ALL PRODUCTS <ChevronRight size={14} />
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {FEATURED_PRODUCTS_MOCK.slice(0, 5).map(prod => (
              <ProductCard key={prod.id} product={prod} />
            ))}
          </div>
        </section>

        {/* 5. TODAY'S DEALS */}
        <section>
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">Today's Deals</h2>
              <p className="text-sm text-slate-400 font-medium mt-1">Limited time offers — don't miss out!</p>
            </div>
            <Link to="/deals" className="text-xs font-bold text-[#FF5B00] uppercase tracking-wider flex items-center gap-1 hover:text-[#EB4501]">
              VIEW ALL DEALS <ChevronRight size={14} />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {DEALS_MOCK.map((deal, idx) => (
              <div 
                key={idx}
                className={`${deal.bg} rounded-3xl p-8 text-white relative overflow-hidden cursor-pointer hover:-translate-y-1 transition-all duration-300 shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-transparent`}
              >
                <div className="relative z-10 flex flex-col h-full">
                  <span className="text-[10px] font-black uppercase tracking-widest bg-white/20 w-fit px-2 py-1 rounded mb-4">
                    {deal.label}
                  </span>
                  <h3 className="text-2xl font-black leading-tight mb-2">{deal.title}</h3>
                  <p className="text-sm font-medium text-white/80 mb-6">{deal.subtitle}</p>
                  
                  <div className="mt-auto">
                    {deal.code ? (
                      <div className="bg-white/20 rounded-xl px-4 py-3 flex items-center justify-center border border-white/20 border-dashed">
                        <span className="font-mono font-bold tracking-wider">{deal.code}</span>
                      </div>
                    ) : (
                      <span className="text-xs font-bold uppercase tracking-wider flex items-center gap-2">
                        {deal.cta} <ChevronRight size={14} />
                      </span>
                    )}
                  </div>
                </div>
                <deal.icon className="absolute -right-4 -bottom-4 w-32 h-32 text-white/10" />
              </div>
            ))}
          </div>
        </section>

        {/* 6. COMPARE ANYTHING */}
        <section>
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">Compare Anything</h2>
              <p className="text-sm text-slate-400 font-medium mt-1">Find the best by comparing side by side</p>
            </div>
            <Link to="/compare" className="text-xs font-bold text-[#FF5B00] uppercase tracking-wider flex items-center gap-1 hover:text-[#EB4501]">
              VIEW ALL COMPARISONS <ChevronRight size={14} />
            </Link>
          </div>
          <div className="bg-white rounded-3xl p-8 shadow-[0_4px_20px_rgb(0,0,0,0.02)] border border-transparent">
            <form onSubmit={handleCompareSubmit} className="flex flex-col md:flex-row items-center gap-6">
              <div className="relative flex-1 w-full">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                <input 
                  type="text" 
                  value={compareFirst}
                  onChange={(e) => setCompareFirst(e.target.value)}
                  placeholder="Search for first product" 
                  className="w-full h-14 pl-12 pr-4 rounded-2xl bg-slate-50 text-sm font-bold text-slate-900 border-none focus:ring-2 focus:ring-[#FF5B00] outline-none"
                />
              </div>
              <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center font-black text-slate-400 shrink-0 uppercase text-xs">
                VS
              </div>
              <div className="relative flex-1 w-full">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                <input 
                  type="text" 
                  value={compareSecond}
                  onChange={(e) => setCompareSecond(e.target.value)}
                  placeholder="Search for second product" 
                  className="w-full h-14 pl-12 pr-4 rounded-2xl bg-slate-50 text-sm font-bold text-slate-900 border-none focus:ring-2 focus:ring-[#FF5B00] outline-none"
                />
              </div>
              <button type="submit" className="h-14 px-10 rounded-2xl bg-[#000435] text-white font-black uppercase tracking-wider text-sm hover:bg-[#FF5B00] transition-colors w-full md:w-auto shrink-0 shadow-md">
                Compare
              </button>
            </form>
            <div className="mt-8">
              <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4">Popular Comparisons</h4>
              <div className="flex flex-wrap gap-3">
                {[
                  { p1: 'Samsung S24 Ultra', p2: 'iPhone 15 Pro Max' },
                  { p1: 'Sony WH-1000XM5', p2: 'Bose QC Ultra' },
                  { p1: 'Sea Pearl Resort', p2: 'Radisson Blu' },
                  { p1: 'MacBook Air M3', p2: 'Dell XPS 13' },
                  { p1: 'PS5 Slim', p2: 'Xbox Series X' }
                ].map((comp, idx) => (
                  <button
                    key={idx}
                    onClick={() => { setCompareFirst(comp.p1); setCompareSecond(comp.p2); }}
                    className="px-4 py-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-xs font-bold text-slate-600 transition-colors flex items-center gap-2 border border-slate-100/50"
                  >
                    <span>{comp.p1}</span>
                    <span className="text-[#FF5B00]">vs</span>
                    <span>{comp.p2}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* 7. TOP BUYING GUIDES */}
        <section>
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">Top Buying Guides</h2>
              <p className="text-sm text-slate-400 font-medium mt-1">Expert guides to help you decide</p>
            </div>
            <Link to="/guides" className="text-xs font-bold text-[#FF5B00] uppercase tracking-wider flex items-center gap-1 hover:text-[#EB4501]">
              VIEW ALL GUIDES <ChevronRight size={14} />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
            {BUYING_GUIDES.map((guide) => (
              <div 
                key={guide.id}
                onClick={() => navigate(`/discover/${guide.id}`)}
                className="bg-white rounded-2xl overflow-hidden cursor-pointer group hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] shadow-[0_4px_20px_rgb(0,0,0,0.02)] transition-all duration-300 border border-transparent"
              >
                <div className="w-full aspect-[16/10] overflow-hidden">
                  <img src={guide.image} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" alt="" />
                </div>
                <div className="p-4">
                  <h3 className="text-sm font-bold text-slate-900 leading-snug tracking-tight mb-2 group-hover:text-[#FF5B00] transition-colors line-clamp-2">
                    {guide.title}
                  </h3>
                  <span className="text-[11px] font-semibold text-slate-400">
                    {guide.desc}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 8. FEATURED BRANDS */}
        <section>
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">Featured Brands</h2>
              <p className="text-sm text-slate-400 font-medium mt-1">Trusted brands, verified sellers</p>
            </div>
            <Link to="/brands" className="text-xs font-bold text-[#FF5B00] uppercase tracking-wider flex items-center gap-1 hover:text-[#EB4501]">
              VIEW ALL BRANDS <ChevronRight size={14} />
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
            {BRAND_LOGOS.map((brand, idx) => {
              const getBrandSlug = (brandId: string) => {
                if (brandId === 'brand-logo-samsung') return 'samsung';
                if (brandId === 'brand-logo-apple') return 'apple';
                if (brandId === 'brand-logo-xiaomi') return 'xiaomi';
                if (brandId === 'brand-logo-walton') return 'walton';
                if (brandId === 'brand-logo-aarong') return 'aarong';
                if (brandId === 'brand-logo-bata') return 'bata';
                return '';
              };
              const slug = getBrandSlug(brand.id);
              return (
                <div 
                  key={idx}
                  onClick={() => {
                    if (slug) {
                      navigate(`/brands/${slug}`);
                    } else {
                      navigate('/brands');
                    }
                  }}
                  className="h-20 bg-white rounded-2xl flex items-center justify-center p-4 cursor-pointer hover:-translate-y-1 hover:shadow-[0_8px_20px_rgb(0,0,0,0.04)] shadow-[0_2px_10px_rgb(0,0,0,0.02)] transition-all duration-300 border border-transparent group"
                >
                  {brand.image ? (
                    <img src={brand.image} alt={brand.name} className="max-h-8 max-w-[80%] object-contain opacity-50 grayscale group-hover:opacity-100 group-hover:grayscale-0 transition-all duration-300" />
                  ) : (
                    <span className={`text-sm font-black uppercase tracking-wider ${brand.color} opacity-60 group-hover:opacity-100 transition-all duration-300`}>
                      {brand.text}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* 9. POPULAR SERVICES */}
        <section>
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">Popular Services</h2>
              <p className="text-sm text-slate-400 font-medium mt-1">Book, reserve & more</p>
            </div>
            <Link to="/categories" className="text-xs font-bold text-[#FF5B00] uppercase tracking-wider flex items-center gap-1 hover:text-[#EB4501]">
              VIEW ALL SERVICES <ChevronRight size={14} />
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-6">
            {POPULAR_SERVICES.map((srv) => (
              <div 
                key={srv.id}
                className="flex flex-col items-center justify-center gap-3 cursor-pointer group"
              >
                <div className={`w-16 h-16 rounded-full ${srv.bg} flex items-center justify-center group-hover:scale-105 transition-transform duration-300 shadow-sm border border-transparent`}>
                  <srv.icon className={`w-6 h-6 ${srv.color}`} />
                </div>
                <div className="text-center">
                  <h4 className="text-xs font-bold text-slate-900">{srv.name}</h4>
                  <span className="text-[10px] font-semibold text-slate-400">{srv.subtitle}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 10. RECENTLY VIEWED */}
        <section className="pt-12 border-t border-slate-200/60">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-black text-slate-900 tracking-tight">Recently Viewed</h2>
              <p className="text-xs text-slate-400 font-medium mt-1">Continue where you left off</p>
            </div>
            <button className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center text-slate-400 hover:border-[#FF5B00] hover:text-[#FF5B00] transition-colors">
              <ChevronRight size={16} />
            </button>
          </div>
          <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide snap-x">
            {RECENTLY_VIEWED.map((item) => (
              <div key={item.id} className="w-16 h-16 rounded-2xl overflow-hidden shrink-0 snap-start border border-transparent shadow-[0_2px_10px_rgb(0,0,0,0.03)] cursor-pointer hover:border-[#FF5B00] transition-colors bg-white">
                <img src={item.image} className="w-full h-full object-cover" alt="" />
              </div>
            ))}
          </div>
        </section>

      </div>
    </div>
  );
}
