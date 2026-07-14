import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { 
  MapPin, Calendar, Globe, Heart, Share2, Check, Star, ShieldCheck, 
  Award, Lock, Headset, ChevronRight, ChevronLeft, HelpCircle, 
  ThumbsUp, Flag, Eye, ShoppingCart, ArrowRight
} from 'lucide-react';
import { useGlobalState } from '../context/GlobalStateContext';
import { cn } from '../lib/utils';

import { ProductCard } from '../components/ProductCard';
import { CreatorReviewCard, CreatorReview } from '../components/CreatorReviewCard';
import { VideoModal } from '../components/VideoModal';

export function BrandDetailPage() {
  const navigate = useNavigate();
  const { addToCart } = useGlobalState();
  const [activeTab, setActiveTab] = useState('Overview');
  const [selectedReview, setSelectedReview] = useState<CreatorReview | null>(null);
  const [isFollowed, setIsFollowed] = useState(false);
  const [wishlist, setWishlist] = useState<Record<string, boolean>>({});
  const [helpfulCount, setHelpfulCount] = useState<Record<string, number>>({ 'tahsin': 128, 'nusrat': 96 });
  const [votedHelpful, setVotedHelpful] = useState<Record<string, boolean>>({});

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success('Brand comparison link copied to clipboard!');
  };

  const toggleFollow = () => {
    setIsFollowed(!isFollowed);
    if (!isFollowed) {
      toast.success('Following Apple for exclusive drops!');
    } else {
      toast.success('Unfollowed Apple');
    }
  };

  const toggleWishlist = (id: string, name: string) => {
    setWishlist(prev => {
      const updated = { ...prev, [id]: !prev[id] };
      if (updated[id]) {
        toast.success('Saved to vault');
      } else {
        toast.success('Removed from vault');
      }
      return updated;
    });
  };

  const handleHelpful = (reviewId: string) => {
    if (votedHelpful[reviewId]) {
      toast('Already voted as helpful!');
      return;
    }
    setHelpfulCount(prev => ({
      ...prev,
      [reviewId]: prev[reviewId] + 1
    }));
    setVotedHelpful(prev => ({
      ...prev,
      [reviewId]: true
    }));
    toast.success('Marked as helpful!');
  };

  return (
    <>
      <VideoModal review={selectedReview} onClose={() => setSelectedReview(null)} />
      <div className="bg-[#F5F8FD] min-h-screen text-[#050B2C] pb-20 font-sans antialiased">
      
      {/* 1 & 2. EDGE-TO-EDGE EDITORIAL BRAND HERO WITH INTEGRATED BREADCRUMBS */}
      <section className="w-full bg-gradient-to-br from-[#050B2C] via-[#09103C] to-[#120935] py-12 md:py-16 relative overflow-hidden text-white shrink-0">
        {/* Ambient light glow */}
        <div className="absolute top-0 right-0 w-[450px] h-[450px] bg-[#FF5B00]/10 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none" />

        {/* Constrained Content Container */}
        <div className="max-w-[1440px] mx-auto w-full px-6 md:px-12 relative z-10">
          
          {/* Breadcrumbs inside the hero section */}
          <nav className="flex items-center gap-1.5 text-xs text-gray-400 font-semibold mb-8 select-none">
            <Link to="/" className="hover:text-[#FF5B00] transition-colors">Home</Link>
            <ChevronRight size={12} className="text-gray-500" />
            <Link to="/brands" className="hover:text-[#FF5B00] transition-colors">Brands</Link>
            <ChevronRight size={12} className="text-gray-500" />
            <span className="text-white font-bold">Apple</span>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* LEFT HERO: Brand Logo Card */}
            <div className="lg:col-span-3 flex flex-col items-center lg:items-start text-center lg:text-left">
              <div className="w-32 h-32 bg-white rounded-2xl flex items-center justify-center p-6 shadow-2xl mb-6 border border-[#EEF2F7]">
                <img 
                  src="https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg" 
                  alt="Apple Logo" 
                  className="w-16 h-16 object-contain"
                />
              </div>
              
              {/* Metadata strip below logo */}
              <div className="space-y-3 text-xs font-semibold text-gray-300 w-full">
                <div className="flex items-center gap-2 justify-center lg:justify-start">
                  <MapPin size={14} className="text-[#FF5B00]" />
                  <span>California, USA</span>
                </div>
                <div className="flex items-center gap-2 justify-center lg:justify-start">
                  <Calendar size={14} className="text-[#FF5B00]" />
                  <span>1976</span>
                </div>
                <div className="flex items-center gap-2 justify-center lg:justify-start">
                  <Globe size={14} className="text-[#FF5B00]" />
                  <a href="https://apple.com" target="_blank" rel="noopener noreferrer" className="hover:text-[#FF5B00] transition-colors">apple.com</a>
                </div>
                
                {/* Social icons */}
                <div className="flex items-center gap-3 pt-2 justify-center lg:justify-start">
                  <a href="#" className="w-7 h-7 rounded-full bg-white/10 hover:bg-[#FF5B00] transition-all flex items-center justify-center text-white" aria-label="Facebook">
                    <span className="text-[10px] font-black uppercase tracking-tight">FB</span>
                  </a>
                  <a href="#" className="w-7 h-7 rounded-full bg-white/10 hover:bg-[#FF5B00] transition-all flex items-center justify-center text-white" aria-label="Instagram">
                    <span className="text-[10px] font-black uppercase tracking-tight">IG</span>
                  </a>
                  <a href="#" className="w-7 h-7 rounded-full bg-white/10 hover:bg-[#FF5B00] transition-all flex items-center justify-center text-white" aria-label="TikTok">
                    <span className="text-[10px] font-black uppercase tracking-tight">TK</span>
                  </a>
                  <a href="#" className="w-7 h-7 rounded-full bg-white/10 hover:bg-[#FF5B00] transition-all flex items-center justify-center text-white" aria-label="X">
                    <span className="text-[10px] font-black uppercase tracking-tight">X</span>
                  </a>
                </div>
              </div>
            </div>

            {/* CENTER HERO: Brand Name & Slogan */}
            <div className="lg:col-span-5 text-center lg:text-left space-y-6">
              <div className="space-y-4">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#10B981]/15 border border-[#10B981]/30 rounded-full text-[10px] font-black text-[#10B981] uppercase tracking-wider">
                  <Check size={12} className="stroke-[3px]" />
                  <span>Verified Brand</span>
                </div>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white tracking-tight leading-none">
                  Apple
                </h1>
                <p className="text-sm md:text-base text-gray-300 leading-relaxed max-w-md font-medium">
                  Apple Inc. designs and manufactures innovative products that empower people around the world. Built on privacy, security, and seamless experience.
                </p>
              </div>

              {/* Actions Row */}
              <div className="flex flex-wrap items-center gap-3 justify-center lg:justify-start pt-2">
                <button 
                  onClick={toggleFollow}
                  className={cn(
                    "px-6 py-3.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all duration-300 flex items-center gap-2 border-0 cursor-pointer shadow-lg",
                    isFollowed 
                      ? "bg-white text-gray-900" 
                      : "bg-[#FF5B00] text-white hover:bg-[#E04F00] hover:shadow-[#FF5B00]/25"
                  )}
                >
                  <Heart size={14} className={isFollowed ? "fill-red-500 text-red-500" : ""} />
                  <span>{isFollowed ? "Following" : "Follow Brand"}</span>
                </button>

                <a 
                  href="https://apple.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="px-6 py-3.5 rounded-xl text-xs font-black uppercase tracking-widest bg-white text-[#050B2C] hover:bg-gray-100 transition-all flex items-center gap-2 cursor-pointer shadow-lg border border-gray-100 decoration-0"
                >
                  <Globe size={14} />
                  <span>Visit Website</span>
                </a>

                <button 
                  onClick={handleShare}
                  className="px-6 py-3.5 rounded-xl text-xs font-black uppercase tracking-widest bg-transparent text-white hover:bg-white/5 transition-all flex items-center gap-2 cursor-pointer border border-white/20 shadow-lg"
                >
                  <Share2 size={14} />
                  <span>Share</span>
                </button>
              </div>
            </div>

            {/* RIGHT HERO: Brand Score Card */}
            <div className="lg:col-span-4 bg-white/5 border border-white/10 rounded-[24px] p-6 text-left backdrop-blur-md shadow-2xl">
              <div className="flex items-center justify-between">
                <div className="text-[11px] font-black uppercase tracking-widest text-gray-400">Brand Score</div>
                <button className="text-gray-400 hover:text-white transition-colors border-0 bg-transparent cursor-pointer" title="Score explanations">
                  <HelpCircle size={14} />
                </button>
              </div>

              <div className="flex items-baseline gap-2 mt-4">
                <div className="text-4xl md:text-5xl font-black text-white tracking-tight leading-none">4.3</div>
                <div className="text-lg text-gray-400 font-bold">/5</div>
                <div className="ml-2">
                  <div className="flex items-center gap-0.5 text-[#FF9F00]">
                    <Star size={13} className="fill-current" />
                    <Star size={13} className="fill-current" />
                    <Star size={13} className="fill-current" />
                    <Star size={13} className="fill-current" />
                    <Star size={13} className="fill-current opacity-40" />
                  </div>
                  <div className="text-[10px] text-gray-400 font-bold mt-1">(2,486 reviews)</div>
                </div>
              </div>

              {/* Progress attributes list */}
              <div className="space-y-2 mt-5 border-t border-white/5 pt-4">
                {[
                  { label: "Quality", val: "4.5", pct: "90%" },
                  { label: "Value", val: "4.1", pct: "82%" },
                  { label: "Durability", val: "4.2", pct: "84%" },
                  { label: "Design", val: "4.6", pct: "92%" },
                  { label: "Support", val: "4.0", pct: "80%" }
                ].map((bar, i) => (
                  <div key={i} className="flex items-center justify-between text-[11px] font-semibold text-gray-300">
                    <span className="w-16">{bar.label}</span>
                    <div className="flex-1 mx-3 h-1.5 bg-white/10 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-[#FF5B00] to-[#FF9F00] rounded-full" style={{ width: bar.pct }} />
                    </div>
                    <span className="w-6 text-right font-black text-white">{bar.val}</span>
                  </div>
                ))}
              </div>

              {/* Recommendation percent box */}
              <div className="text-center mt-5 pt-4 border-t border-white/5 space-y-1">
                <div className="text-3xl font-black text-emerald-400 leading-none">85%</div>
                <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">of customers recommend Apple</div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 3. TRUST BENEFITS STRIP */}
      <section className="w-full max-w-[1600px] mx-auto px-4 sm:px-6 md:px-8 mb-8">
        <div className="bg-[#050B2C] border border-white/10 rounded-2xl p-5 md:py-6 md:px-8 text-white shadow-xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
          {[
            { title: "100% Original Products", sub: "Official & authentic products", icon: ShieldCheck },
            { title: "1 Year Warranty", sub: "Standard brand warranty", icon: Award },
            { title: "Secure Purchase", sub: "Safe & secure shopping", icon: Lock },
            { title: "Global Brand", sub: "Trusted worldwide", icon: Globe },
            { title: "Premium Support", sub: "Dedicated customer care", icon: Headset }
          ].map((item, i) => {
            const Icon = item.icon;
            return (
              <div key={i} className="flex items-center gap-3.5 text-left">
                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white shrink-0">
                  <Icon size={18} className="text-white" />
                </div>
                <div>
                  <h4 className="text-[12.5px] font-black text-white leading-tight uppercase tracking-wider">{item.title}</h4>
                  <p className="text-[10px] text-gray-400 font-semibold mt-1 leading-none">{item.sub}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 4. STICKY BRAND NAVIGATION TABS */}
      <section className="w-full max-w-[1600px] mx-auto px-4 sm:px-6 md:px-8 mb-8 sticky top-0 z-40 bg-[#F5F8FD]/95 backdrop-blur-md py-3">
        <div className="bg-white border border-[#EEF2F7] rounded-2xl p-1.5 shadow-sm flex items-center justify-between gap-1 overflow-x-auto no-scrollbar">
          {[
            { name: "Overview", count: null, badge: null },
            { name: "Products", count: null, badge: null },
            { name: "Deals", count: null, badge: "HOT" },
            { name: "Reviews", count: "2.4K", badge: null },
            { name: "Brand Info", count: null, badge: null },
            { name: "Compare", count: null, badge: null }
          ].map((tab) => {
            const isActive = activeTab === tab.name;
            return (
              <button
                key={tab.name}
                onClick={() => {
                  setActiveTab(tab.name);
                  toast.success(`Switched tab to ${tab.name}`);
                  const targetId = tab.name.toLowerCase().replace(" ", "-");
                  const element = document.getElementById(targetId);
                  if (element) {
                    element.scrollIntoView({ behavior: 'smooth', block: 'center' });
                  }
                }}
                className={cn(
                  "flex-1 py-3 px-4 text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2 rounded-xl transition-all cursor-pointer whitespace-nowrap border-0 relative outline-none",
                  isActive 
                    ? "bg-[#FF5B00]/10 text-[#FF5B00]" 
                    : "text-[#6B7280] hover:text-[#050B2C] hover:bg-gray-50"
                )}
              >
                <span>{tab.name}</span>
                
                {tab.badge && (
                  <span className="bg-[#FF5B00] text-white text-[8px] font-black px-1.5 py-0.5 rounded leading-none">
                    {tab.badge}
                  </span>
                )}
                
                {tab.count && (
                  <span className={cn(
                    "text-[9px] font-black px-1.5 py-0.5 rounded-full leading-none",
                    isActive ? "bg-[#FF5B00] text-white" : "bg-gray-100 text-[#6B7280]"
                  )}>
                    {tab.count}
                  </span>
                )}

                {isActive && (
                  <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-8 h-1 bg-[#FF5B00] rounded-full" />
                )}
              </button>
            );
          })}
        </div>
      </section>

      {/* 5. TOP DEALS ON BRAND */}
      <section id="deals" className="w-full max-w-[1600px] mx-auto px-4 sm:px-6 md:px-8 mb-12 scroll-mt-24">
        <div className="flex items-end justify-between mb-6 border-b border-[#EEF2F7] pb-4">
          <div className="text-left">
            <h2 className="text-2xl font-black text-[#050B2C] uppercase tracking-tight">
              Top Deals on Apple
            </h2>
            <p className="text-xs font-bold text-[#6B7280] mt-1.5">
              Limited-time offers on Apple products
            </p>
          </div>
          <button 
            onClick={() => {
              setActiveTab("Deals");
              toast.success("Opening premium Apple Deals stream...");
            }}
            className="px-4 py-2 bg-white border border-[#EEF2F7] hover:border-[#FF5B00] hover:text-[#FF5B00] transition-all text-xs font-bold text-[#050B2C] rounded-xl shadow-sm cursor-pointer"
          >
            VIEW ALL DEALS
          </button>
        </div>

        {/* 4 Premium Product Cards Grid */}
        <div className="grid grid-cols-1 min-[400px]:grid-cols-2 min-[992px]:grid-cols-3 min-[1200px]:grid-cols-4 gap-x-6 gap-y-8">
          {[
            {
              id: "apple-iphone-15",
              title: "Apple iPhone 15 (128GB)",
              price: 114999,
              oldPrice: 134999,
              saving: "15% OFF",
              hot: true,
              badge: "15% OFF",
              likes: "1.2K",
              views: "856",
              image: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=400&q=80"
            },
            {
              id: "apple-macbook-air",
              title: "Apple MacBook Air M2 (2024)",
              price: 128000,
              oldPrice: 142000,
              saving: "10% OFF",
              sale: true,
              badge: "10% OFF",
              likes: "932",
              views: "614",
              image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&q=80"
            },
            {
              id: "apple-airpods-pro",
              title: "Apple AirPods Pro (2nd Gen)",
              price: 25999,
              oldPrice: 29999,
              saving: "13% OFF",
              new: true,
              badge: "13% OFF",
              likes: "1.1K",
              views: "723",
              image: "https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=400&q=80"
            },
            {
              id: "apple-watch-9",
              title: "Apple Watch Series 9",
              price: 45999,
              oldPrice: 57999,
              saving: "20% OFF",
              sale: true,
              badge: "20% OFF",
              likes: "789",
              views: "488",
              image: "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=400&q=80"
            }
          ].map((prod) => {
            const formattedProd = {
              id: prod.id,
              title: prod.title,
              price: prod.price,
              originalPrice: prod.oldPrice,
              image: prod.image,
              brand: 'Apple',
              discount: prod.saving,
              badge: prod.hot ? 'HOT' : (prod.new ? 'NEW' : (prod.sale ? 'SALE' : null)),
              rating: '4.9',
              reviews: prod.likes,
            };
            return (
              <ProductCard key={prod.id} product={formattedProd} />
            );
          })}
        </div>
      </section>

      {/* 6. BRAND PRODUCT CATEGORIES */}
      <section id="products" className="w-full max-w-[1600px] mx-auto px-4 sm:px-6 md:px-8 mb-12 scroll-mt-24">
        <div className="flex items-end justify-between mb-6 border-b border-[#EEF2F7] pb-4">
          <div className="text-left">
            <h2 className="text-2xl font-black text-[#050B2C] uppercase tracking-tight">
              Apple Products
            </h2>
            <p className="text-xs font-bold text-[#6B7280] mt-1.5">
              Explore all products from Apple
            </p>
          </div>
          <button 
            onClick={() => {
              setActiveTab("Products");
              toast.success("Loading all Apple catalog filters...");
            }}
            className="px-4 py-2 bg-white border border-[#EEF2F7] hover:border-[#FF5B00] hover:text-[#FF5B00] transition-all text-xs font-bold text-[#050B2C] rounded-xl shadow-sm cursor-pointer"
          >
            VIEW ALL PRODUCTS
          </button>
        </div>

        {/* 6 Grid items of Apple Product Category Collections */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {[
            { name: "iPhone", count: "24 Products", img: "https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=200&q=80" },
            { name: "Mac", count: "15 Products", img: "https://images.unsplash.com/photo-1496181130204-7552cc1524e2?w=200&q=80" },
            { name: "iPad", count: "18 Products", img: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=200&q=80" },
            { name: "Watch", count: "12 Products", img: "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=200&q=80" },
            { name: "AirPods", count: "8 Products", img: "https://images.unsplash.com/photo-1588449668365-d15e397f6787?w=200&q=80" },
            { name: "Accessories", count: "32 Products", img: "https://images.unsplash.com/photo-1608156639585-b3a032ef9689?w=200&q=80" }
          ].map((cat, i) => (
            <div 
              key={i}
              onClick={() => {
                toast.success(`Loading ${cat.name} Collection from Apple`);
                navigate(`/products?brand=Apple&category=${cat.name}`);
              }}
              className="bg-white rounded-2xl p-5 shadow-sm hover:shadow-lg hover:border-[#FF5B00]/20 border border-transparent transition-all duration-300 cursor-pointer text-center flex flex-col justify-between"
            >
              <div className="h-24 flex items-center justify-center mb-4">
                <img 
                  src={cat.img} 
                  alt={cat.name} 
                  className="max-h-full max-w-[85%] object-contain"
                />
              </div>
              <div className="text-center">
                <h4 className="text-sm font-black text-[#050B2C]">{cat.name}</h4>
                <p className="text-[11px] text-gray-400 font-bold mt-1">{cat.count}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CREATOR REVIEWS */}
      <section className="w-full max-w-[1600px] mx-auto px-4 sm:px-6 md:px-8 mb-12">
        <div className="flex items-center justify-between mb-8 border-b border-[#EEF2F7] pb-4">
          <div>
            <h2 className="text-2xl font-extrabold text-[#000435] uppercase tracking-wider mb-2">CREATOR REVIEWS</h2>
            <p className="text-slate-400 font-bold text-sm uppercase tracking-widest">WATCH TRUSTED CREATOR REVIEWS BEFORE MAKING YOUR BUYING DECISION</p>
          </div>
          <button className="text-xs font-bold text-[#FF5B00] uppercase tracking-wider flex items-center gap-1 hover:text-[#EB4501] group">
            VIEW ALL REVIEWS <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
        
        <div className="flex gap-6 overflow-x-auto pb-6 snap-x scrollbar-hide">
          {[
            {
              id: "1",
              cover: "https://images.unsplash.com/photo-1616348436168-de43ad0db179?q=80&w=600&auto=format&fit=crop",
              title: "iPhone 15 Pro Max 30 Days Later - The Truth!",
              creator: { name: "Marques Brownlee", avatar: "https://i.pravatar.cc/150?u=mb", verified: true },
              duration: "14:20",
              views: "1.2M",
              date: "2 weeks ago",
              category: "Long Term Review",
              categoryColor: "bg-blue-600",
              platform: "youtube" as const
            },
            {
              id: "2",
              cover: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=600&auto=format&fit=crop",
              title: "iPhone 15 Pro Camera Test vs S24 Ultra",
              creator: { name: "Mrwhosetheboss", avatar: "https://i.pravatar.cc/150?u=mr", verified: true },
              duration: "18:45",
              views: "850K",
              date: "1 month ago",
              category: "Camera Test",
              categoryColor: "bg-purple-600",
              platform: "youtube" as const
            },
            {
              id: "3",
              cover: "https://images.unsplash.com/photo-1574944985070-8f3ebc6b79d2?q=80&w=600&auto=format&fit=crop",
              title: "Is the Titanium actually better? Drop Test!",
              creator: { name: "JerryRigEverything", avatar: "https://i.pravatar.cc/150?u=jr", verified: true },
              duration: "08:12",
              views: "2.1M",
              date: "3 weeks ago",
              category: "Durability Test",
              categoryColor: "bg-red-600",
              platform: "youtube" as const
            },
            {
              id: "4",
              cover: "https://images.unsplash.com/photo-1605236453806-6ff368536b8e?q=80&w=600&auto=format&fit=crop",
              title: "Top 10 Hidden Features in iOS 17 & iPhone 15 Pro",
              creator: { name: "iJustine", avatar: "https://i.pravatar.cc/150?u=ij", verified: true },
              duration: "12:05",
              views: "450K",
              date: "5 days ago",
              category: "Tips & Tricks",
              categoryColor: "bg-emerald-600",
              platform: "instagram" as const
            },
            {
              id: "5",
              cover: "https://images.unsplash.com/photo-1556656793-08538906a9f8?q=80&w=600&auto=format&fit=crop",
              title: "Gaming on A17 Pro - Console Level Quality?",
              creator: { name: "Dave2D", avatar: "https://i.pravatar.cc/150?u=d2d", verified: true },
              duration: "10:30",
              views: "320K",
              date: "1 week ago",
              category: "Gaming Test",
              categoryColor: "bg-amber-600",
              platform: "youtube" as const,
              sponsor: "Sponsored"
            }
          ].map((review) => (
            <CreatorReviewCard key={review.id} review={review} onClick={() => setSelectedReview(review)} />
          ))}
        </div>
      </section>

      {/* 7. CUSTOMER REVIEWS */}
      <section id="reviews" className="w-full max-w-[1600px] mx-auto px-4 sm:px-6 md:px-8 mb-12 scroll-mt-24">
        <div className="flex items-end justify-between mb-6 border-b border-[#EEF2F7] pb-4">
          <div className="text-left">
            <h2 className="text-2xl font-black text-[#050B2C] uppercase tracking-tight">
              What Customers Say
            </h2>
            <p className="text-xs font-bold text-[#6B7280] mt-1.5">
              Real reviews from verified buyers
            </p>
          </div>
          <button 
            onClick={() => toast.success("Showing custom reviews dynamic streams!")}
            className="px-4 py-2 bg-white border border-[#EEF2F7] hover:border-[#FF5B00] hover:text-[#FF5B00] transition-all text-xs font-bold text-[#050B2C] rounded-xl shadow-sm cursor-pointer"
          >
            VIEW ALL REVIEWS
          </button>
        </div>

        {/* Reviews Horizontal Container with Navigation Arrows outside */}
        <div className="relative px-2">
          {/* Slider Arrow Left */}
          <button 
            onClick={() => toast.success("Previous reviews")}
            className="absolute left-[-20px] top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white border border-gray-150 shadow-md flex items-center justify-center text-[#050B2C] hover:text-[#FF5B00] transition-all cursor-pointer z-10"
            aria-label="Previous Review"
          >
            <ChevronLeft size={18} />
          </button>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Review 1: Tahsin Ahmed */}
            <div className="bg-white border border-[#EEF2F7] rounded-3xl p-6 md:p-8 shadow-sm text-left flex flex-col justify-between">
              <div>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3.5">
                    <img 
                      src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&q=80" 
                      alt="Tahsin Ahmed" 
                      className="w-12 h-12 rounded-full object-cover border border-gray-100"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-black text-[#050B2C]">Tahsin Ahmed</h4>
                        <span className="px-2 py-0.5 bg-emerald-50 border border-emerald-100 text-emerald-600 rounded text-[9px] font-extrabold uppercase tracking-wide">
                          Verified Buyer
                        </span>
                      </div>
                      
                      {/* Rating details */}
                      <div className="flex items-center gap-2 mt-1">
                        <div className="flex text-[#FF9F00]">
                          {[...Array(5)].map((_, i) => <Star key={i} size={11} className="fill-current" />)}
                        </div>
                        <span className="text-xs text-[#050B2C] font-black">5.0</span>
                      </div>
                    </div>
                  </div>
                  <span className="text-[11px] text-gray-400 font-semibold">18 Apr 2025</span>
                </div>

                <p className="text-sm text-[#6B7280] font-medium leading-relaxed mt-5">
                  The build quality is fantastic. iPhone 15 Pro exceeds my expectations. Battery life is excellent and the camera is simply amazing!
                </p>

                {/* Tags row */}
                <div className="flex flex-wrap gap-1.5 mt-5">
                  {["Quality", "Value", "Performance", "Design"].map((tag, idx) => (
                    <span key={idx} className="bg-[#F5F8FD] text-[#050B2C] text-[10px] font-bold px-3 py-1 rounded-full">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action helpful buttons */}
              <div className="flex items-center gap-4 border-t border-gray-50 pt-4 mt-6">
                <button 
                  onClick={() => handleHelpful('tahsin')}
                  className="flex items-center gap-1.5 text-xs font-bold text-[#6B7280] hover:text-[#FF5B00] transition-colors border-0 bg-transparent cursor-pointer"
                >
                  <ThumbsUp size={13} />
                  <span>Helpful ({helpfulCount['tahsin']})</span>
                </button>
                <button 
                  onClick={() => toast.success("Report registered successfully.")}
                  className="flex items-center gap-1.5 text-xs font-bold text-[#6B7280] hover:text-red-500 transition-colors border-0 bg-transparent cursor-pointer ml-auto"
                >
                  <Flag size={13} />
                  <span>Report</span>
                </button>
              </div>
            </div>

            {/* Review 2: Nusrat Jahan */}
            <div className="bg-white border border-[#EEF2F7] rounded-3xl p-6 md:p-8 shadow-sm text-left flex flex-col justify-between">
              <div>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3.5">
                    <img 
                      src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80" 
                      alt="Nusrat Jahan" 
                      className="w-12 h-12 rounded-full object-cover border border-gray-100"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-black text-[#050B2C]">Nusrat Jahan</h4>
                        <span className="px-2 py-0.5 bg-emerald-50 border border-emerald-100 text-emerald-600 rounded text-[9px] font-extrabold uppercase tracking-wide">
                          Verified Buyer
                        </span>
                      </div>
                      
                      {/* Rating details */}
                      <div className="flex items-center gap-2 mt-1">
                        <div className="flex text-[#FF9F00]">
                          {[...Array(4)].map((_, i) => <Star key={i} size={11} className="fill-current" />)}
                          <Star size={11} className="text-gray-200" />
                        </div>
                        <span className="text-xs text-[#050B2C] font-black">4.0</span>
                      </div>
                    </div>
                  </div>
                  <span className="text-[11px] text-gray-400 font-semibold">12 Apr 2025</span>
                </div>

                <p className="text-sm text-[#6B7280] font-medium leading-relaxed mt-5">
                  MacBook Air M2 is super fast and lightweight. Perfect for productivity on the go. Totally worth it!
                </p>

                {/* Tags row */}
                <div className="flex flex-wrap gap-1.5 mt-5">
                  {["Quality", "Performance", "Portability", "Battery"].map((tag, idx) => (
                    <span key={idx} className="bg-[#F5F8FD] text-[#050B2C] text-[10px] font-bold px-3 py-1 rounded-full">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action helpful buttons */}
              <div className="flex items-center gap-4 border-t border-gray-50 pt-4 mt-6">
                <button 
                  onClick={() => handleHelpful('nusrat')}
                  className="flex items-center gap-1.5 text-xs font-bold text-[#6B7280] hover:text-[#FF5B00] transition-colors border-0 bg-transparent cursor-pointer"
                >
                  <ThumbsUp size={13} />
                  <span>Helpful ({helpfulCount['nusrat']})</span>
                </button>
                <button 
                  onClick={() => toast.success("Report registered successfully.")}
                  className="flex items-center gap-1.5 text-xs font-bold text-[#6B7280] hover:text-red-500 transition-colors border-0 bg-transparent cursor-pointer ml-auto"
                >
                  <Flag size={13} />
                  <span>Report</span>
                </button>
              </div>
            </div>

          </div>

          {/* Slider Arrow Right */}
          <button 
            onClick={() => toast.success("Next reviews")}
            className="absolute right-[-20px] top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white border border-gray-150 shadow-md flex items-center justify-center text-[#050B2C] hover:text-[#FF5B00] transition-all cursor-pointer z-10"
            aria-label="Next Review"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </section>

      {/* 8. BRAND OVERVIEW */}
      <section id="brand-info" className="w-full max-w-[1600px] mx-auto px-4 sm:px-6 md:px-8 mb-12 scroll-mt-24">
        <h2 className="text-xl font-black text-[#050B2C] uppercase tracking-tight mb-6 text-left">
          Brand Overview
        </h2>

        {/* 4 Equal Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          
          {/* Card 1: About Apple */}
          <div className="bg-white border border-[#EEF2F7] rounded-3xl p-6 shadow-sm text-left flex flex-col justify-between">
            <div className="space-y-4">
              <h3 className="text-sm font-black text-[#050B2C] uppercase tracking-wider pb-3 border-b border-gray-100">
                About Apple
              </h3>
              <p className="text-xs text-[#6B7280] leading-relaxed font-medium">
                Apple Inc. is an American multinational technology company that specializes in consumer electronics, software, and online services.
              </p>
              <p className="text-xs text-[#6B7280] leading-relaxed font-medium">
                Founded in 1976 by Steve Jobs, Steve Wozniak, and Ronald Wayne.
              </p>
            </div>
            <button 
              onClick={() => toast.success("Loading the complete Apple Wiki...")}
              className="mt-6 flex items-center gap-1.5 text-xs font-black text-[#FF5B00] hover:text-[#E04F00] uppercase tracking-wider border-0 bg-transparent cursor-pointer text-left self-start"
            >
              <span>Read More</span>
              <ChevronRight size={13} />
            </button>
          </div>

          {/* Card 2: Key Highlights */}
          <div className="bg-white border border-[#EEF2F7] rounded-3xl p-6 shadow-sm text-left">
            <h3 className="text-sm font-black text-[#050B2C] uppercase tracking-wider pb-3 border-b border-gray-100 mb-4">
              Key Highlights
            </h3>
            <ul className="space-y-3.5">
              {[
                "Innovation leader in technology",
                "Premium quality products",
                "Focus on privacy & security",
                "Seamless ecosystem"
              ].map((highlight, idx) => (
                <li key={idx} className="flex items-start gap-2.5 text-xs text-[#6B7280] font-medium leading-tight">
                  <Check size={14} className="text-[#10B981] stroke-[3.5px] mt-0.5 shrink-0" />
                  <span>{highlight}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Card 3: Popular Categories */}
          <div className="bg-white border border-[#EEF2F7] rounded-3xl p-6 shadow-sm text-left">
            <h3 className="text-sm font-black text-[#050B2C] uppercase tracking-wider pb-3 border-b border-gray-100 mb-4">
              Popular Categories
            </h3>
            <div className="flex flex-wrap gap-2.5">
              {["iPhone", "Mac", "iPad", "Watch", "AirPods"].map((cat, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    toast.success(`Loading ${cat} Collection`);
                    navigate(`/products?brand=Apple&category=${cat}`);
                  }}
                  className="bg-[#F5F8FD] hover:bg-[#FF5B00]/10 hover:text-[#FF5B00] text-[#050B2C] text-xs font-bold px-4 py-2 rounded-full border-0 transition-colors cursor-pointer"
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Card 4: Support */}
          <div className="bg-white border border-[#EEF2F7] rounded-3xl p-6 shadow-sm text-left">
            <h3 className="text-sm font-black text-[#050B2C] uppercase tracking-wider pb-3 border-b border-gray-100 mb-4">
              Support
            </h3>
            <ul className="space-y-3.5">
              {[
                { title: "Official Apple Support", icon: Headset },
                { title: "1 Year Standard Warranty", icon: Award },
                { title: "Apple Care+ Available", icon: ShieldCheck },
                { title: "Global Service Centers", icon: Globe }
              ].map((item, idx) => {
                const SupportIcon = item.icon;
                return (
                  <li key={idx} className="flex items-center gap-2.5 text-xs text-[#6B7280] font-medium">
                    <SupportIcon size={14} className="text-[#FF5B00]" />
                    <span>{item.title}</span>
                  </li>
                );
              })}
            </ul>
          </div>

        </div>
      </section>

      {/* 9. BRAND TRUST STATEMENT BANNER */}
      <section className="w-full max-w-[1600px] mx-auto px-4 sm:px-6 md:px-8 mb-12">
        <div className="bg-gradient-to-r from-[#050B2C] to-[#0A1961] border border-white/5 rounded-3xl py-10 px-8 text-white text-center shadow-xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-indigo-900/10 via-transparent to-transparent pointer-events-none" />
          
          <div className="relative z-10 max-w-2xl mx-auto space-y-3 mb-8">
            <div className="flex items-center justify-center gap-2">
              <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white shrink-0">
                <ShieldCheck size={16} className="text-white" />
              </div>
              <h3 className="text-lg md:text-xl font-black uppercase tracking-widest text-white leading-none">
                CHOSEN BY MILLIONS. TRUSTED WORLDWIDE.
              </h3>
            </div>
            <p className="text-xs md:text-sm text-gray-300 font-medium leading-relaxed">
              100% authentic products, official warranty & dedicated support from Apple.
            </p>
          </div>

          {/* Stats matrix */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 relative z-10 max-w-4xl mx-auto border-t border-white/10 pt-8">
            {[
              { val: "1M+", lbl: "Happy Customers" },
              { val: "50+", lbl: "Countries" },
              { val: "2.4K+", lbl: "Reviews" },
              { val: "4.3/5", lbl: "Brand Score" }
            ].map((stat, idx) => (
              <div key={idx} className="space-y-1">
                <div className="text-3xl md:text-4xl font-black text-white leading-none tracking-tight">
                  {stat.val}
                </div>
                <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                  {stat.lbl}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 10. BRAND COMPARISON TABLE */}
      <section id="compare" className="w-full max-w-[1600px] mx-auto px-4 sm:px-6 md:px-8 mb-12 scroll-mt-24">
        <h2 className="text-xl font-black text-[#050B2C] uppercase tracking-tight mb-6 text-left">
          Compare Apple With Other Brands
        </h2>

        {/* Clean responsive table */}
        <div className="bg-white border border-[#EEF2F7] rounded-3xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#FAFBFD] border-b border-[#EEF2F7]">
                  <th className="py-4.5 px-6 text-xs font-black text-[#050B2C] uppercase tracking-wider">Brand</th>
                  <th className="py-4.5 px-6 text-xs font-black text-[#050B2C] uppercase tracking-wider">Overall Score</th>
                  <th className="py-4.5 px-6 text-xs font-black text-[#050B2C] uppercase tracking-wider">Quality</th>
                  <th className="py-4.5 px-6 text-xs font-black text-[#050B2C] uppercase tracking-wider">Value</th>
                  <th className="py-4.5 px-6 text-xs font-black text-[#050B2C] uppercase tracking-wider">Support</th>
                  <th className="py-4.5 px-6 text-xs font-black text-[#050B2C] uppercase tracking-wider">Popular Products</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EEF2F7]">
                {[
                  {
                    name: "Apple",
                    logo: "https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg",
                    score: "4.3/5",
                    stars: 4.3,
                    quality: "4.5/5",
                    value: "4.1/5",
                    support: "4.0/5",
                    extras: "+12",
                    thumbs: [
                      "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=100&q=80",
                      "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=100&q=80",
                      "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=100&q=80"
                    ]
                  },
                  {
                    name: "Samsung",
                    logo: "https://upload.wikimedia.org/wikipedia/commons/2/24/Samsung_Logo.svg",
                    score: "4.1/5",
                    stars: 4.1,
                    quality: "4.2/5",
                    value: "4.0/5",
                    support: "3.9/5",
                    extras: "+18",
                    thumbs: [
                      "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=100&q=80",
                      "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=100&q=80",
                      "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=100&q=80"
                    ]
                  },
                  {
                    name: "Sony",
                    logo: "https://upload.wikimedia.org/wikipedia/commons/c/ca/Sony_logo.svg",
                    score: "4.0/5",
                    stars: 4.0,
                    quality: "4.1/5",
                    value: "3.8/5",
                    support: "4.2/5",
                    extras: "+15",
                    thumbs: [
                      "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=100&q=80",
                      "https://images.unsplash.com/photo-1588449668365-d15e397f6787?w=100&q=80",
                      "https://images.unsplash.com/photo-1608156639585-b3a032ef9689?w=100&q=80"
                    ]
                  },
                  {
                    name: "Xiaomi",
                    logo: "https://upload.wikimedia.org/wikipedia/commons/a/ae/Xiaomi_logo_%282021-%29.svg",
                    score: "3.9/5",
                    stars: 3.9,
                    quality: "3.9/5",
                    value: "4.2/5",
                    support: "3.6/5",
                    extras: "+20",
                    thumbs: [
                      "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=100&q=80",
                      "https://images.unsplash.com/photo-1542496658-e33a6d0d50f6?w=100&q=80",
                      "https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?w=100&q=80"
                    ]
                  }
                ].map((row, idx) => (
                  <tr key={idx} className="hover:bg-gray-50/50 transition-colors">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-[#F5F8FD] p-2 flex items-center justify-center border border-[#EEF2F7]">
                          <img src={row.logo} alt={row.name} className="max-h-full max-w-full object-contain" />
                        </div>
                        <span className="font-black text-[#050B2C] text-sm">{row.name}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="space-y-1">
                        <span className="text-sm font-black text-[#050B2C]">{row.score}</span>
                        <div className="flex items-center gap-0.5 text-[#FF9F00]">
                          {[...Array(5)].map((_, i) => {
                            const diff = row.stars - i;
                            if (diff >= 1) {
                              return <Star key={i} size={11} className="fill-current" />;
                            } else if (diff > 0) {
                              return <Star key={i} size={11} className="fill-current opacity-70" />;
                            } else {
                              return <Star key={i} size={11} className="text-gray-200" />;
                            }
                          })}
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className="text-xs font-bold text-gray-500">{row.quality}</span>
                    </td>
                    <td className="py-4 px-6">
                      <span className="text-xs font-bold text-gray-500">{row.value}</span>
                    </td>
                    <td className="py-4 px-6">
                      <span className="text-xs font-bold text-gray-500">{row.support}</span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-1.5">
                        {row.thumbs.map((thumb, thumbIdx) => (
                          <div key={thumbIdx} className="w-8 h-8 rounded-full overflow-hidden border-2 border-white bg-gray-50 shadow-sm shrink-0">
                            <img src={thumb} alt="Product thumb" className="w-full h-full object-cover" />
                          </div>
                        ))}
                        <span className="text-[10px] font-black text-[#6B7280] bg-gray-100 px-1.5 py-0.5 rounded-full">
                          {row.extras}
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Table Centered CTA */}
          <div className="py-6 bg-[#FAFBFD] border-t border-[#EEF2F7] flex items-center justify-center">
            <button 
              onClick={() => {
                navigate("/compare");
                toast.success("Opening comparison matrix platform...");
              }}
              className="px-6 py-3 bg-[#050B2C] hover:bg-[#FF5B00] text-white font-black text-xs uppercase tracking-widest rounded-xl transition-all shadow-md cursor-pointer border-0"
            >
              COMPARE MORE BRANDS
            </button>
          </div>
        </div>
      </section>

    </div>
    </>
  );
}
