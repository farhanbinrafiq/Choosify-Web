import React, { useState, useEffect, useMemo } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { motion, AnimatePresence } from "motion/react";
import { 
  Star, Heart, Share2, MapPin, ShieldCheck, Award, RotateCcw, Lock, 
  ChevronLeft, ChevronRight, Check, ThumbsUp, ArrowUpRight, 
  Mail, Info, HelpCircle, ArrowLeftRight, ChevronDown, 
  ChevronUp, ShoppingBag, Plus, Minus, Eye, MessageSquare, Flame, Bookmark,
  Cpu, Battery, Camera as CameraIcon, Smartphone, Play, Image as ImageIcon,
  CheckCircle2, ShoppingCart, Tag, Users, TrendingUp, Shield, ArrowRight
} from "lucide-react";
import { useGlobalState } from "../context/GlobalStateContext";
import { useDashboard } from "../context/DashboardContext";
import { cn } from "../lib/utils";
import { CreatorReviewCard, CreatorReview } from "../components/CreatorReviewCard";
import { VideoModal } from "../components/VideoModal";

// Custom Apple Logo Icon
function AppleIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 4.17c.66-.81 1.11-1.93.99-3.06-.96.04-2.13.64-2.82 1.45-.6.69-1.12 1.83-.98 2.94.1.81.16 1.92.99 3.06" />
    </svg>
  );
}

function PlayIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M8 5v14l11-7z" />
    </svg>
  );
}

export function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { allProducts, addToCart: globalAddToCart } = useGlobalState();
  const { addRecentlyViewed, addToRecentlyViewed, comparedProducts, setComparedProducts } = useDashboard();

  const [activeImage, setActiveImage] = useState(0);
  const [selectedReview, setSelectedReview] = useState<CreatorReview | null>(null);
  const [selectedStorage, setSelectedStorage] = useState("256GB");
  const [selectedColor, setSelectedColor] = useState("Titanium Black");
  const [isExplainOpen, setIsExplainOpen] = useState(true);
  const [ratingHover, setRatingHover] = useState(0);
  const [userRating, setUserRating] = useState(0);

  const product = useMemo<any>(() => {
    const found = allProducts.find((p: any) => p.id === Number(id)) || {
      id: 1,
      title: "Apple iPhone 15 Pro Max (256GB)",
      price: "167,500",
      reviews: "12.4K",
      rating: 4.8
    };
    return found;
  }, [id, allProducts]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  const images = [
    "https://images.unsplash.com/photo-1695048133142-1a20484d2569?q=80&w=2000&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1695048133142-1a20484d2569?q=80&w=2000&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1695048133142-1a20484d2569?q=80&w=2000&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1695048133142-1a20484d2569?q=80&w=2000&auto=format&fit=crop",
  ];

  const colors = [
    { name: "Titanium Black", code: "bg-[#2d2d2d]", hex: "#2d2d2d" },
    { name: "Titanium Blue", code: "bg-[#2c3d4a]", hex: "#2c3d4a" },
    { name: "Titanium Natural", code: "bg-[#959187]", hex: "#959187" },
    { name: "Titanium White", code: "bg-[#e3e4e5]", hex: "#e3e4e5" }
  ];

  const handleAddToCart = () => {
    globalAddToCart({
      id: product.id,
      title: product.title,
      price: product.price,
      image: images[0],
      store: "Apple Store"
    }, 1);
    toast.success("Added to Cart!");
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#F4F7F9] text-slate-800 font-sans pb-24 selection:bg-[#FF5B00] selection:text-white">
      
      {/* 1. PRODUCT HERO (Dark Cinematic) */}
      <div className="relative w-full overflow-hidden bg-[#000000]">
        {/* Background Image & Overlay */}
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1544383835-bda2bc66a55d?q=80&w=2500&auto=format&fit=crop" 
            className="w-full h-full object-cover opacity-20 filter blur-md"
            alt="" 
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-transparent to-black/80"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/60"></div>
        </div>

        <div className="relative z-10 max-w-[1600px] mx-auto px-6 md:px-10 pt-6 pb-12">
          
          {/* Breadcrumbs */}
          <nav className="text-xs font-semibold text-slate-400 flex flex-wrap items-center gap-1.5 uppercase tracking-wider mb-8">
            <Link to="/" className="hover:text-white transition-colors">Home</Link>
            <span className="text-slate-600 font-bold">&gt;</span>
            <Link to="/products" className="hover:text-white transition-colors">Products</Link>
            <span className="text-slate-600 font-bold">&gt;</span>
            <span className="hover:text-white transition-colors cursor-pointer">Electronics</span>
            <span className="text-slate-600 font-bold">&gt;</span>
            <span className="hover:text-white transition-colors cursor-pointer">Smartphones</span>
            <span className="text-slate-600 font-bold">&gt;</span>
            <span className="text-white font-extrabold">{product.title}</span>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-stretch">
            
            {/* LEFT: GALLERY & MAIN IMAGE */}
            <div className="lg:col-span-8 flex flex-col md:flex-row gap-6 relative">
              
              {/* Thumbnails (Left side vertical on desktop) */}
              <div className="flex flex-row md:flex-col gap-3 order-2 md:order-1 overflow-x-auto md:overflow-visible pb-2 md:pb-0 no-scrollbar">
                
                {/* Video Thumbnail */}
                <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl border border-slate-800 bg-[#0A0C22] flex items-center justify-center cursor-pointer shrink-0 overflow-hidden relative group hover:border-[#FF5B00]/50 transition-colors">
                  <img src={images[0]} className="w-full h-full object-cover opacity-50" alt="" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                      <PlayIcon className="w-4 h-4 text-white ml-0.5" />
                    </div>
                  </div>
                </div>

                {images.map((img, idx) => (
                  <div 
                    key={idx}
                    onClick={() => setActiveImage(idx)}
                    className={cn(
                      "w-16 h-16 md:w-20 md:h-20 rounded-2xl border overflow-hidden cursor-pointer transition-all duration-300 shrink-0 relative bg-[#0A0C22]",
                      activeImage === idx 
                        ? "border-[#FF5B00] shadow-[0_0_15px_rgba(255,91,0,0.3)] ring-2 ring-[#FF5B00]/20" 
                        : "border-slate-800 hover:border-slate-600"
                    )}
                  >
                    <img src={img} alt="" className={cn("w-full h-full object-cover transition-transform duration-500", activeImage === idx ? "scale-110" : "opacity-80 hover:opacity-100")} />
                  </div>
                ))}
                
                {/* +6 More */}
                <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl border border-slate-800 bg-[#0A0C22] flex items-center justify-center text-sm font-bold text-white hover:border-[#FF5B00]/50 hover:text-[#FF5B00] transition-colors cursor-pointer shrink-0">
                  +6
                </div>
              </div>

              {/* Main Image */}
              <div className="flex-1 relative order-1 md:order-2 flex items-center justify-center h-[400px] md:h-[600px] bg-transparent">
                <button className="absolute left-0 md:left-4 z-20 w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg hover:bg-slate-100 transition-colors hidden md:flex">
                  <ChevronLeft className="w-6 h-6 text-slate-800" />
                </button>
                
                <AnimatePresence mode="wait">
                  <motion.img
                    key={activeImage}
                    src={images[activeImage]}
                    alt={product.title}
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.4 }}
                    className="w-full h-full object-contain filter drop-shadow-[0_20px_50px_rgba(0,0,0,0.5)] z-10 max-h-[550px]"
                  />
                </AnimatePresence>

                <button className="absolute right-0 md:right-4 z-20 w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg hover:bg-slate-100 transition-colors hidden md:flex">
                  <ChevronRight className="w-6 h-6 text-slate-800" />
                </button>

              </div>
              
            </div>

            {/* RIGHT: PRODUCT INFO CARD (Premium Glass) */}
            <div className="lg:col-span-4 z-20">
              <div className="bg-[#111822]/40 backdrop-blur-xl rounded-[32px] p-8 md:p-10 border border-white/5 shadow-2xl h-full flex flex-col relative overflow-hidden">
                {/* Very subtle glow */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-[80px] pointer-events-none"></div>

                <div className="flex justify-between items-start mb-4 relative z-10">
                  <div className="flex items-center gap-2">
                    <span className="bg-[#FF5B00] text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">Featured</span>
                    <span className="bg-emerald-500/20 text-emerald-400 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider border border-emerald-500/20">Trending</span>
                  </div>
                  <div className="flex flex-col items-end">
                    <div className="flex items-center gap-1.5 text-white font-bold text-lg">
                      <AppleIcon className="w-5 h-5" />
                      <span>Apple</span>
                    </div>
                    <span className="text-[10px] text-slate-400 font-semibold uppercase">Authorized Reseller</span>
                  </div>
                </div>

                <h1 className="text-3xl md:text-4xl font-bold text-white mb-2 leading-tight tracking-tight relative z-10">
                  {product.title}
                </h1>
                <p className="text-slate-300 font-medium text-sm mb-4 relative z-10">Titanium Black</p>

                {/* Rating & Sold */}
                <div className="flex items-center gap-3 mb-8 relative z-10">
                  <div className="flex text-[#FF5B00]">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star key={s} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                  <div className="text-sm font-bold text-white">4.8 <span className="text-slate-400 font-normal">({product.reviews} reviews)</span> <span className="text-slate-500 mx-1">·</span> 25K+ sold</div>
                </div>

                {/* Pricing */}
                <div className="mb-8 relative z-10">
                  <div className="flex items-end gap-3 mb-1">
                    <span className="text-4xl font-extrabold text-[#FF5B00] tracking-tight">BDT 167,500</span>
                    <span className="text-lg text-slate-400 line-through font-medium mb-1">BDT 185,000</span>
                    <span className="text-emerald-400 font-bold text-sm mb-1.5">Save BDT 17,500 (9%)</span>
                  </div>
                  <div className="text-sm font-medium text-slate-300 flex items-center gap-1.5">
                    EMI starts from BDT 5,280/month
                    <Info className="w-4 h-4 text-slate-400 cursor-pointer hover:text-white transition-colors" />
                  </div>
                </div>

                {/* Storage */}
                <div className="mb-6 relative z-10">
                  <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
                    STORAGE: <span className="text-white ml-1">{selectedStorage}</span>
                  </div>
                  <div className="flex gap-3">
                    {["256GB", "512GB", "1TB"].map((storage) => (
                      <button
                        key={storage}
                        onClick={() => setSelectedStorage(storage)}
                        className={cn(
                          "flex-1 py-3 rounded-xl font-bold text-sm transition-all duration-200 border",
                          selectedStorage === storage
                            ? "bg-white/10 text-white border-[#FF5B00]"
                            : "bg-black/20 text-slate-300 border-white/10 hover:bg-black/40 hover:border-white/20"
                        )}
                      >
                        {storage}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Color */}
                <div className="mb-8 relative z-10">
                  <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
                    COLOR: <span className="text-white ml-1 uppercase">{selectedColor}</span>
                  </div>
                  <div className="flex gap-3">
                    {colors.map((color) => (
                      <button
                        key={color.name}
                        onClick={() => setSelectedColor(color.name)}
                        className={cn(
                          "w-10 h-10 rounded-full border-2 transition-all relative",
                          selectedColor === color.name ? "border-[#FF5B00] scale-110" : "border-transparent hover:scale-105"
                        )}
                        title={color.name}
                      >
                        <div className={cn("absolute inset-0.5 rounded-full border border-black/20", color.code)}></div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Delivery Box */}
                <div className="bg-black/20 rounded-2xl p-4 border border-white/5 mb-8 flex items-start gap-4 relative z-10">
                  <div className="bg-[#FF5B00]/10 p-2.5 rounded-xl text-[#FF5B00]">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-xs font-semibold text-slate-400">Delivery in Bangladesh</p>
                      <button className="text-sm font-bold text-blue-400 hover:text-blue-300 transition-colors">Change</button>
                    </div>
                    <div className="text-sm font-semibold text-white mb-1.5 flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 bg-slate-500 rounded-full"></span>
                      Dhaka, Bangladesh · 20 - 22 May
                    </div>
                    <div className="text-sm font-semibold text-emerald-400 flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4" />
                      Standard Delivery Available
                    </div>
                  </div>
                </div>

                <div className="mt-auto relative z-10">
                  {/* Subtle actions */}
                  <div className="flex items-center justify-between gap-4 mb-6">
                    <button className="flex items-center gap-2 text-slate-300 hover:text-white font-semibold text-sm transition-colors group">
                      <Heart className="w-5 h-5 group-hover:text-red-400 transition-colors" /> Add to Wishlist
                    </button>
                    <button className="flex items-center gap-2 text-slate-300 hover:text-white font-semibold text-sm transition-colors group">
                      <ArrowLeftRight className="w-5 h-5 group-hover:text-blue-400 transition-colors" /> Compare
                    </button>
                    <button className="flex items-center gap-2 text-slate-300 hover:text-white font-semibold text-sm transition-colors group">
                      <Share2 className="w-5 h-5 group-hover:text-emerald-400 transition-colors" /> Share
                    </button>
                  </div>
                  
                  {/* Main CTA */}
                  <button 
                    onClick={handleAddToCart}
                    className="w-full h-[60px] bg-[#FF5B00] hover:bg-[#E05000] text-white rounded-2xl font-bold text-lg flex items-center justify-center gap-3 transition-all duration-200 shadow-[0_4px_14px_0_rgba(255,91,0,0.39)] hover:shadow-[0_6px_20px_rgba(255,91,0,0.23)] transform hover:-translate-y-0.5"
                  >
                    <ShoppingCart className="w-6 h-6" />
                    Add to Cart
                  </button>
                </div>

              </div>
            </div>

          </div>
        </div>
      </div>

      {/* 2. SOCIAL METRICS BAR */}
      <div className="bg-[#0B0F19] border-y border-white/5 py-6">
        <div className="max-w-[1600px] mx-auto px-6 md:px-10 flex flex-wrap items-center justify-between gap-6 md:gap-0 divide-x divide-white/5">
          {[
            { icon: Heart, val: "329", label: "LOVE REACTS", color: "text-red-400" },
            { icon: Bookmark, val: "167", label: "ITEMS SAVED", color: "text-[#FF5B00]" },
            { icon: Tag, val: "12", label: "DEALS FOUND", color: "text-blue-400" },
            { icon: Users, val: "864", label: "VERIFIED ORDERS", color: "text-amber-400" },
            { icon: Eye, val: "3,268", label: "PRODUCT VIEWS", color: "text-emerald-400", badge: "TRENDING" }
          ].map((stat, i) => (
            <div key={i} className="flex-1 flex flex-col items-center justify-center min-w-[120px] text-center px-4">
              <stat.icon className={cn("w-6 h-6 mb-2", stat.color)} />
              <div className="flex items-center gap-2">
                <span className="text-xl md:text-2xl font-bold text-white">{stat.val}</span>
                {stat.badge && (
                  <span className="bg-emerald-500/20 text-emerald-400 text-[9px] font-bold px-2 py-0.5 rounded-full tracking-wider border border-emerald-500/20">
                    {stat.badge}
                  </span>
                )}
              </div>
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">{stat.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 3. STICKY PAGE NAVIGATION */}
      <div className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-[1600px] mx-auto px-6 md:px-10 flex items-center gap-8 overflow-x-auto no-scrollbar">
          {[
            { id: "product", label: "PRODUCT", icon: ShoppingBag, active: true },
            { id: "specs", label: "SPECS", icon: Cpu },
            { id: "creator-reviews", label: "CREATOR REVIEWS", icon: Award },
            { id: "public-reviews", label: "PUBLIC REVIEWS", icon: CameraIcon },
            { id: "overview", label: "PRODUCT OVERVIEW", icon: ImageIcon },
            { id: "buying-guide", label: "BUYING GUIDE", icon: ShoppingCart },
            { id: "filter", label: "FILTER", icon: Lock }, 
          ].map((nav) => (
            <button 
              key={nav.id}
              className={cn(
                "flex items-center gap-2 py-5 border-b-2 font-bold text-sm whitespace-nowrap transition-colors",
                nav.active ? "border-[#FF5B00] text-[#FF5B00]" : "border-transparent text-slate-500 hover:text-slate-800"
              )}
            >
              {nav.icon && <nav.icon className="w-4 h-4" />}
              {nav.label}
            </button>
          ))}
        </div>
      </div>

      {/* 4. CONTENT AREA */}
      <div className="max-w-[1600px] mx-auto px-6 md:px-10 pt-12 flex flex-col gap-12">
        
        {/* EXPLAIN THIS PRODUCT */}
        <div className="bg-white rounded-[24px] border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden">
          <button 
            onClick={() => setIsExplainOpen(!isExplainOpen)}
            className="w-full flex items-center justify-between p-6 md:p-8 bg-white hover:bg-slate-50 transition-colors"
          >
            <div className="flex items-center gap-3 text-[#FF5B00] font-bold text-xl uppercase tracking-wider">
              <ShoppingBag className="w-6 h-6" />
              EXPLAIN THIS PRODUCT
            </div>
            {isExplainOpen ? <ChevronUp className="w-6 h-6 text-slate-400" /> : <ChevronDown className="w-6 h-6 text-slate-400" />}
          </button>
          <AnimatePresence>
            {isExplainOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="p-6 md:p-8 pt-0 flex flex-col gap-8">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="text-[#000435] font-extrabold text-lg">Product at a glance</h4>
                      <span className="bg-amber-100 text-amber-700 text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">Verified Choosify Explainer</span>
                    </div>
                    <p className="text-slate-500 font-medium leading-relaxed">The Apple iPhone 15 Pro Max (256GB) features a 6.7-inch Super Retina XDR display, A17 Pro chip, and Pro camera system.</p>
                  </div>
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="text-[#000435] font-extrabold text-lg">Buying tip</h4>
                      <span className="bg-amber-100 text-amber-700 text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">What Choosify Recommends</span>
                    </div>
                    <p className="text-slate-500 font-medium leading-relaxed">Best for power users, content creators, and those who want the best iPhone experience.</p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* PRODUCT SPECIFICATIONS */}
        <div className="text-center mb-4 pt-4">
          <h2 className="text-2xl font-extrabold text-[#000435] uppercase tracking-wider mb-2">PRODUCT SPECIFICATIONS</h2>
          <p className="text-slate-400 font-bold text-sm uppercase tracking-widest">TECHNICAL DETAILS OF APPLE IPHONE 15 PRO MAX</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { icon: Award, label: "BRAND", value: "Apple", color: "text-[#FF5B00]", bg: "bg-[#FF5B00]/10" },
            { icon: Smartphone, label: "CATEGORY", value: "Smartphones", color: "text-[#FF5B00]", bg: "bg-[#FF5B00]/10" },
            { icon: Eye, label: "DISPLAY", value: '6.7" Super Retina XDR', color: "text-[#FF5B00]", bg: "bg-[#FF5B00]/10" },
            { icon: Cpu, label: "STORAGE", value: "256GB", color: "text-[#FF5B00]", bg: "bg-[#FF5B00]/10" },
            { icon: ShieldCheck, label: "CHIPSET", value: "A17 Pro Chip", color: "text-[#FF5B00]", bg: "bg-[#FF5B00]/10" },
            { icon: CameraIcon, label: "CAMERA", value: "48MP Main + 12MP Ultra Wide", color: "text-[#FF5B00]", bg: "bg-[#FF5B00]/10" },
            { icon: Battery, label: "BATTERY", value: "Up to 29 Hours", color: "text-[#FF5B00]", bg: "bg-[#FF5B00]/10" },
            { icon: Star, label: "RATING", value: "4.8 / 5", color: "text-[#FF5B00]", bg: "bg-[#FF5B00]/10" },
          ].map((spec, i) => (
            <div key={i} className="bg-white rounded-[24px] p-6 border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex items-center gap-5 hover:-translate-y-1 transition-transform duration-300">
              <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center shrink-0", spec.bg)}>
                <spec.icon className={cn("w-6 h-6", spec.color)} />
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">{spec.label}</p>
                <p className="text-base font-extrabold text-[#000435]">{spec.value}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="flex justify-center -mt-4 mb-4">
          <button className="text-[#FF5B00] font-bold uppercase tracking-wider text-sm flex items-center gap-2 hover:bg-[#FF5B00]/5 px-6 py-3 rounded-full transition-colors">
            BROWSE SPOTLIGHT REVIEWS <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>

        {/* CREATOR REVIEWS */}
        <div className="pt-4">
          <div className="flex items-center justify-between mb-8">
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
        </div>

        {/* PUBLIC REVIEWS */}
        <div className="pt-4">
          <h2 className="text-2xl font-extrabold text-[#000435] uppercase tracking-wider mb-2">PUBLIC REVIEWS</h2>
          <p className="text-slate-400 font-bold text-sm uppercase tracking-widest mb-8">SHARING GENUINE EXPERIENCES</p>
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Write Review Form */}
            <div className="lg:col-span-4 bg-white rounded-[32px] p-8 md:p-10 border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] sticky top-32">
              <h3 className="text-lg font-extrabold text-[#000435] uppercase tracking-wider mb-8">WRITE A CUSTOMER REVIEW</h3>
              
              <div className="flex items-center justify-between mb-8">
                <span className="text-sm font-bold text-[#000435] uppercase tracking-widest">YOUR RATING</span>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star 
                      key={star} 
                      className={cn(
                        "w-7 h-7 cursor-pointer transition-colors", 
                        (ratingHover || userRating) >= star ? "fill-[#FF5B00] text-[#FF5B00]" : "text-slate-200"
                      )}
                      onMouseEnter={() => setRatingHover(star)}
                      onMouseLeave={() => setRatingHover(0)}
                      onClick={() => setUserRating(star)}
                    />
                  ))}
                </div>
              </div>

              <div className="mb-8">
                <span className="text-sm font-bold text-[#000435] uppercase tracking-widest block mb-4">REVIEW DETAILS</span>
                <textarea 
                  placeholder="Write your review here..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-5 min-h-[160px] focus:outline-none focus:border-[#FF5B00] focus:ring-1 focus:ring-[#FF5B00] transition-colors resize-none text-slate-700 font-medium"
                ></textarea>
              </div>

              <button className="w-full h-[56px] bg-[#FF5B00] hover:bg-[#E05000] text-white rounded-2xl font-bold uppercase tracking-wider transition-colors shadow-lg shadow-[#FF5B00]/20 text-sm">
                SUBMIT CUSTOMER REVIEW
              </button>
            </div>

            {/* Review Cards */}
            <div className="lg:col-span-8 flex flex-col gap-6">
              {[
                {
                  name: "Tawhid Hossain",
                  days: "2 days ago",
                  text: "Absolutely incredible device! The camera quality is mind-blowing and the performance is next level. Battery life is also exceptional.",
                  helpful: 123,
                  images: [1,2,3]
                },
                {
                  name: "Nusrat Jahan",
                  days: "5 days ago",
                  text: "Upgraded from iPhone 12 Pro Max and the difference is incredible. Worth every penny.",
                  helpful: 96,
                  images: [1,2,3]
                }
              ].map((review, i) => (
                <div key={i} className="bg-white rounded-[32px] p-8 md:p-10 border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 bg-slate-200 rounded-full overflow-hidden border-2 border-white shadow-sm">
                        <img src={`https://i.pravatar.cc/150?u=${i + 10}`} alt={review.name} className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-extrabold text-[#000435] text-lg">{review.name}</h4>
                          <span className="bg-emerald-50 text-emerald-600 text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">Verified Buyer</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="flex text-[#FF5B00] gap-0.5">
                            {[1, 2, 3, 4, 5].map((s) => (
                              <Star key={s} className="w-4 h-4 fill-current" />
                            ))}
                          </div>
                          <span className="text-sm text-slate-400 font-semibold">{review.days}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <p className="text-slate-600 font-medium leading-relaxed mb-8 text-base">{review.text}</p>
                  
                  {/* Attached images mock */}
                  <div className="flex gap-4 mb-8">
                    {review.images.map(img => (
                      <div key={img} className="w-24 h-24 rounded-2xl bg-slate-100 border border-slate-200 overflow-hidden cursor-pointer hover:opacity-80 transition-opacity">
                         <img src={`https://images.unsplash.com/photo-1695048133142-1a20484d2569?q=80&w=200&auto=format&fit=crop`} className="w-full h-full object-cover opacity-90" alt="Review attached" />
                      </div>
                    ))}
                  </div>

                  <div className="flex justify-end pt-6 border-t border-slate-100">
                    <button className="flex items-center gap-2 text-slate-500 hover:text-[#000435] font-bold text-sm transition-colors uppercase tracking-wider">
                      Helpful ({review.helpful}) <ThumbsUp className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
              
              <button className="w-full py-5 bg-slate-50 hover:bg-slate-100 text-slate-500 font-bold uppercase tracking-wider rounded-[32px] transition-colors border border-slate-200 mt-2 text-sm">
                LOAD MORE REVIEWS
              </button>
            </div>
          </div>
        </div>

        {/* PRODUCT OVERVIEW */}
        <div className="pt-4">
          <h2 className="text-2xl font-extrabold text-[#FF5B00] uppercase tracking-wider mb-2 flex items-center gap-2">
            PRODUCT <span className="text-[#000435]">OVERVIEW</span>
          </h2>
          <p className="text-slate-400 font-bold text-sm uppercase tracking-widest mb-8">EVERYTHING YOU NEED TO KNOW</p>
          
          <div className="bg-white rounded-[32px] p-8 md:p-12 border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
              {/* Col 1 */}
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  </div>
                  <h4 className="font-extrabold text-[#000435] text-sm uppercase tracking-wider">QUALITY & MATERIALS</h4>
                </div>
                <ul className="space-y-4">
                  {["Titanium Design", "Ceramic Shield Front", "Surgical-grade Stainless Steel", "IP68 Water & Dust Resistant"].map((item, i) => (
                    <li key={i} className="flex items-start gap-3 text-slate-600 font-medium text-sm">
                      <Check className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              
              {/* Col 2 */}
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-8 h-8 rounded-full bg-[#FF5B00]/10 flex items-center justify-center">
                    <CheckCircle2 className="w-4 h-4 text-[#FF5B00]" />
                  </div>
                  <h4 className="font-extrabold text-[#000435] text-sm uppercase tracking-wider">FEATURES & BENEFITS</h4>
                </div>
                <ul className="space-y-4">
                  {["A17 Pro Chip with 6-core GPU", "Pro Camera System (48MP Main)", "Action Button", "USB-C with USB 3 speeds"].map((item, i) => (
                    <li key={i} className="flex items-start gap-3 text-slate-600 font-medium text-sm">
                      <Check className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Col 3 */}
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  </div>
                  <h4 className="font-extrabold text-[#000435] text-sm uppercase tracking-wider">PERFORMANCE</h4>
                </div>
                <ul className="space-y-4">
                  {["Up to 20% faster GPU performance", "Fast charging support", "iOS 17 optimized", "Smooth gaming performance"].map((item, i) => (
                    <li key={i} className="flex items-start gap-3 text-slate-600 font-medium text-sm">
                      <Check className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Col 4 */}
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  </div>
                  <h4 className="font-extrabold text-[#000435] text-sm uppercase tracking-wider">WARRANTY & SUPPORT</h4>
                </div>
                <ul className="space-y-4">
                  {["1 Year Official Warranty", "Authorized Service Centers", "Apple Care+ Available", "24/7 Customer Support"].map((item, i) => (
                    <li key={i} className="flex items-start gap-3 text-slate-600 font-medium text-sm">
                      <Check className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Best For Tags */}
            <div className="mt-10 pt-8 border-t border-slate-100 flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-3 mr-4 bg-slate-50 py-2 px-4 rounded-xl border border-slate-100">
                <div className="w-6 h-6 bg-slate-200 rounded-full flex items-center justify-center">
                  <ShoppingBag className="w-3 h-3 text-slate-600" />
                </div>
                <span className="text-sm font-extrabold text-[#000435] uppercase tracking-wider">BEST FOR</span>
              </div>
              {["Photography", "Gaming", "Content Creation", "Business", "Travel", "Premium Users"].map((tag, i) => (
                <span key={i} className="text-sm font-bold text-[#FF5B00] hover:text-white transition-colors cursor-pointer hover:bg-[#FF5B00] bg-white border border-[#FF5B00]/20 px-5 py-2.5 rounded-full shadow-sm">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* BOTTOM INFO CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 pt-4">
          {/* Box Content */}
          <div className="bg-white rounded-[32px] p-8 md:p-10 border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
            <h4 className="text-sm font-extrabold text-[#000435] uppercase tracking-wider mb-6">BOX CONTENT</h4>
            <ul className="space-y-4">
              {["iPhone 15 Pro Max", "USB-C Charge Cable", "Documentation", "SIM Ejector Tool"].map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-slate-600 font-medium text-sm">
                  <Check className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Physical Specs */}
          <div className="bg-white rounded-[32px] p-8 md:p-10 border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
            <h4 className="text-sm font-extrabold text-[#000435] uppercase tracking-wider mb-6">PHYSICAL SPECS</h4>
            <ul className="space-y-4">
              {[
                "Dimensions: 159.9 x 76.7 x 8.25 mm",
                "Weight: 221 g",
                'Display: 6.7" Super Retina XDR',
                "Build: Titanium with Textured Matte Glass"
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-slate-600 font-medium text-sm">
                  <Check className="w-4 h-4 text-[#FF5B00] mt-0.5 shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Apple Official Store Card */}
          <div className="bg-[#0B0F19] rounded-[32px] p-8 md:p-10 border border-white/5 shadow-2xl flex flex-col justify-center items-center text-center relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-48 h-48 bg-white/5 rounded-full blur-[50px] pointer-events-none group-hover:bg-white/10 transition-colors"></div>
            
            <div className="w-16 h-16 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center mb-4 relative z-10 border border-white/10 shadow-lg">
              <AppleIcon className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-extrabold text-white uppercase tracking-widest relative z-10 mb-1">APPLE</h3>
            <p className="text-xs text-slate-400 font-medium mb-3 relative z-10">Official Brand Store</p>
            <div className="flex items-center justify-center gap-1.5 text-slate-300 text-xs font-bold mb-8 relative z-10 bg-white/10 px-3 py-1.5 rounded-full">
               <Star className="w-3.5 h-3.5 fill-current text-amber-400" /> 4.8 (12.4K reviews)
            </div>
            
            <div className="w-full flex flex-col gap-3 relative z-10">
              <button className="w-full h-11 bg-white/10 hover:bg-white/20 text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-colors border border-white/10">
                VISIT APPLE STORE
              </button>
              <button className="w-full h-11 bg-white text-[#0B0F19] hover:bg-slate-200 text-xs font-extrabold uppercase tracking-wider rounded-xl transition-colors shadow-lg">
                FOLLOW BRAND
              </button>
              <button className="w-full h-11 bg-[#FF5B00] hover:bg-[#E05000] text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-colors shadow-lg shadow-[#FF5B00]/20">
                VIEW BRAND PROFILE
              </button>
            </div>
          </div>

          {/* Price Across Stores */}
          <div className="bg-white rounded-[32px] p-8 md:p-10 border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex flex-col">
            <h4 className="text-sm font-extrabold text-[#000435] uppercase tracking-wider mb-8">PRICE ACROSS STORES</h4>
            <div className="flex flex-col gap-5 flex-1">
              {[
                { store: "Choosify", price: "BDT 167,500", highlight: true },
                { store: "Daraz", price: "BDT 168,999" },
                { store: "Pickaboo", price: "BDT 168,900" },
                { store: "Star Tech", price: "BDT 170,000" }
              ].map((item, i) => (
                <div key={i} className="flex justify-between items-center text-sm font-bold border-b border-slate-50 pb-3 last:border-0 last:pb-0">
                  <span className={cn(item.highlight ? "text-[#FF5B00]" : "text-slate-600")}>{item.store}</span>
                  <span className={cn(item.highlight ? "text-[#FF5B00] text-base" : "text-[#000435]")}>{item.price}</span>
                </div>
              ))}
            </div>
            <button className="mt-8 flex items-center justify-between text-xs font-bold text-[#000435] uppercase tracking-wider group hover:text-[#FF5B00] transition-colors bg-slate-50 p-4 rounded-2xl border border-slate-100">
              View more stores
              <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>

        {/* TRUST STATEMENT AND FOOTER PROMO */}
        <div className="mt-12 mb-4">
          <div className="bg-white rounded-t-[32px] border-t border-x border-slate-100 p-8 flex flex-col md:flex-row items-center justify-center gap-6 shadow-[0_-10px_30px_rgb(0,0,0,0.02)] max-w-5xl mx-auto -mb-6 relative z-10">
            <div className="w-14 h-14 bg-emerald-50 rounded-full flex items-center justify-center shrink-0">
              <ShieldCheck className="w-7 h-7 text-emerald-500" />
            </div>
            <div className="text-center md:text-left">
              <h3 className="text-xl font-extrabold text-[#000435] uppercase tracking-wider mb-2">CHOOSIFY.BD TRUST STATEMENT</h3>
              <p className="text-base text-slate-500 font-medium">We only partner with verified sellers to ensure genuine products and the best experience as in Choosify.</p>
            </div>
          </div>
          
          <div className="bg-[#0B0F19] rounded-[32px] p-8 md:p-10 flex flex-col md:flex-row items-center justify-between text-white shadow-2xl relative z-0 border border-white/5 overflow-hidden">
             <div className="absolute top-0 right-0 w-64 h-64 bg-[#FF5B00]/10 rounded-full blur-[80px] pointer-events-none"></div>
             
             <div className="flex-1 relative z-10 text-center md:text-left mb-6 md:mb-0">
               <h4 className="font-extrabold text-xl md:text-2xl uppercase tracking-wider mb-2">UPGRADE TO CHOOSIFY PRIME</h4>
               <p className="text-sm md:text-base text-slate-400 font-medium">Get premium deals, exclusive offers & early access to top launches.</p>
               <button className="text-[#FF5B00] text-sm font-bold uppercase tracking-wider mt-4 hover:text-white transition-colors">UPGRADE NOW</button>
             </div>
             
             <div className="shrink-0 relative z-10">
                <Award className="w-20 h-20 text-amber-400 drop-shadow-[0_0_20px_rgba(251,191,36,0.3)]" />
             </div>
          </div>
        </div>

      </div>
    </div>
  );
}
