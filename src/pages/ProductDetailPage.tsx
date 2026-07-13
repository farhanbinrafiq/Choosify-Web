import React, { useState, useEffect, useMemo } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { motion, AnimatePresence } from "motion/react";
import { 
  Star, Heart, Share2, MapPin, ShieldCheck, Award, RotateCcw, Lock, 
  ChevronLeft, ChevronRight, Check, ThumbsUp, ArrowUpRight, 
  Mail, Info, HelpCircle, ArrowLeftRight, ChevronDown, 
  ChevronUp, ShoppingBag, Plus, Minus, Eye, MessageSquare, Flame, Bookmark
} from "lucide-react";
import { useGlobalState } from "../context/GlobalStateContext";
import { useDashboard } from "../context/DashboardContext";
import { cn } from "../lib/utils";

// Custom Apple Logo Icon
function AppleIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 4.17c.66-.81 1.11-1.93.99-3.06-.96.04-2.13.64-2.82 1.45-.6.69-1.12 1.83-.98 2.94.1.81.16 1.92.99 3.06" />
    </svg>
  );
}

// Custom Play Icon for video thumbnails
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

  // Global Context Hook bindings
  const { 
    allProducts, 
    addToCart: globalAddToCart, 
  } = useGlobalState();
  
  const { 
    addRecentlyViewed, 
    addToRecentlyViewed, 
    comparedProducts, 
    setComparedProducts 
  } = useDashboard();

  // Find target product or default to generic iPhone 15 Pro Max config
  const product = useMemo<any>(() => {
    const found = allProducts.find((p: any) => p.id === Number(id)) || {
      id: 1,
      title: "Apple iPhone 15 Pro Max (256GB)",
      price: "167,500",
      reviews: "12,4K",
      rating: 4.8
    };
    return found;
  }, [id, allProducts]);

  // Sync to recently viewed list on mount
  useEffect(() => {
    if (product) {
      addRecentlyViewed(product);
      addToRecentlyViewed(product);
    }
  }, [product, addRecentlyViewed, addToRecentlyViewed]);

  // Interactive configurations
  const [selectedStorage, setSelectedStorage] = useState("256GB");
  const [selectedColor, setSelectedColor] = useState("Titanium Black");
  const [activeTab, setActiveTab] = useState("PRODUCT");
  const [isExplainOpen, setIsExplainOpen] = useState(true);
  const [isLiked, setIsLiked] = useState(false);
  const [quantity, setQuantity] = useState(1);

  // Review states
  const [userRating, setUserRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");
  const [reviewsList, setReviewsList] = useState([
    {
      id: "rev-1",
      author: "Tanvir Hossain",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&q=80",
      rating: 5,
      date: "May 18, 2026",
      comment: "Absolutely incredible device! The camera quality is mind blowing and the performance is next level. Battery life is phenomenal.",
      images: [
        "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=300&q=80",
        "https://images.unsplash.com/photo-1695048133031-7e8845bc7903?w=300&q=80",
        "https://images.unsplash.com/photo-1695048132717-3932e604ecda?w=300&q=80"
      ],
      helpfulCount: 123
    },
    {
      id: "rev-2",
      author: "Nusrat Jahan",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&q=80",
      rating: 5,
      date: "May 16, 2026",
      comment: "Upgraded from iPhone 12 Pro Max and the difference is incredible. Worth every penny.",
      images: [
        "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=300&q=80",
        "https://images.unsplash.com/photo-1695048133031-7e8845bc7903?w=300&q=80",
        "https://images.unsplash.com/photo-1695048132717-3932e604ecda?w=300&q=80"
      ],
      helpfulCount: 98
    }
  ]);

  // Gallery image assets
  const galleryImages = [
    "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800&q=80", // Natural Titanium front & back
    "https://images.unsplash.com/photo-1695048133031-7e8845bc7903?w=800&q=80", // Dual-lens closeup
    "https://images.unsplash.com/photo-1695048132717-3932e604ecda?w=800&q=80", // Titanium side finish
    "https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=800&q=80"  // Lifestyle phone look
  ];
  const [activeImgIdx, setActiveImgIdx] = useState(0);

  // CTA Click handlers
  const handleAddToCart = () => {
    const cartProduct = {
      ...product,
      title: `${product.title} (${selectedStorage}, ${selectedColor})`,
      price: product.price
    };
    globalAddToCart(cartProduct, quantity);
    toast.success(`Added ${quantity}x ${product.title} (${selectedStorage}) to Cart!`, { icon: "🛒" });
  };

  const handleBuyNow = () => {
    handleAddToCart();
    navigate("/cart");
  };

  const handleBuyWithEmi = () => {
    toast.success("EMI plan selected! Proceeding to checkout configuration.", { icon: "💳" });
    handleAddToCart();
    navigate("/checkout?emi=true");
  };

  const handleToggleLike = () => {
    setIsLiked(!isLiked);
    if (!isLiked) {
      toast.success("Added to Wishlist!", { icon: "❤️" });
    } else {
      toast.success("Removed from Wishlist");
    }
  };

  const handleAddToCompare = () => {
    if (comparedProducts.some((p: any) => p.id === product.id)) {
      toast.error("This product is already in the comparison stack.");
      return;
    }
    setComparedProducts((prev: any[]) => [...prev, product]);
    toast.success("Added to Compare stack!", { icon: "🔄" });
    navigate("/compare");
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success("Product share link copied to clipboard!", { icon: "🔗" });
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewComment.trim()) {
      toast.error("Please enter review details first");
      return;
    }
    const newRev = {
      id: `rev-${Date.now()}`,
      author: "Farhan Ahmed",
      avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&q=80",
      rating: userRating,
      date: "Today",
      comment: reviewComment,
      images: [
        "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=300&q=80"
      ],
      helpfulCount: 0
    };
    setReviewsList([newRev, ...reviewsList]);
    setReviewComment("");
    toast.success("Your review was posted to our community center!", { icon: "🌟" });
  };

  const handleHelpfulIncrement = (revId: string) => {
    setReviewsList(prev => prev.map(r => {
      if (r.id === revId) {
        return { ...r, helpfulCount: r.helpfulCount + 1 };
      }
      return r;
    }));
    toast.success("Marked review as helpful!");
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#F4F6FA] text-slate-800 pb-16 font-sans select-none">
      
      {/* ==========================================
          DARK NAVY MAIN HEADER & DISPLAY REGION
          ========================================== */}
      <div className="w-full bg-gradient-to-b from-[#03040C] to-[#0A0C22] text-left shrink-0 pb-12 pt-4">
        
        {/* Breadcrumb line */}
        <div className="max-w-7xl mx-auto px-6 md:px-10 mb-8">
          <nav className="text-xs font-semibold text-slate-400 flex items-center gap-1.5 uppercase tracking-wider">
            <Link to="/" className="hover:text-[#FF5B00] transition-colors">Home</Link>
            <span className="text-slate-600 font-bold">&gt;</span>
            <Link to="/products" className="hover:text-[#FF5B00] transition-colors">Products</Link>
            <span className="text-slate-600 font-bold">&gt;</span>
            <span className="text-slate-400">Electronics</span>
            <span className="text-slate-600 font-bold">&gt;</span>
            <span className="text-slate-400">Smartphones</span>
            <span className="text-slate-600 font-bold">&gt;</span>
            <span className="text-white font-extrabold">{product.title || "Apple iPhone 15 Pro Max (256GB)"}</span>
          </nav>
        </div>

        {/* Top Split Columns (Gallery + Details Container) */}
        <div className="max-w-7xl mx-auto px-6 md:px-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* LEFT 6-COL: PREMIUM GALLERY BOX */}
          <div className="lg:col-span-6 flex flex-col md:flex-row gap-4 items-stretch">
            
            {/* Vertical thumbnails bar (Left side) */}
            <div className="flex flex-row md:flex-col gap-2.5 shrink-0 order-2 md:order-1 justify-center md:justify-start">
              {/* Play video preview thumbnail */}
              <button 
                onClick={() => {
                  setActiveImgIdx(0);
                  toast.success("Playing high-definition product preview...", { icon: "🎬" });
                }}
                className="w-16 h-16 rounded-2xl border-2 border-slate-800 hover:border-[#FF5B00] transition-all bg-slate-900/40 flex items-center justify-center relative overflow-hidden group shrink-0"
              >
                <img 
                  src="https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=100&q=80" 
                  alt="video thumb" 
                  className="w-full h-full object-cover opacity-50"
                />
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <div className="w-7 h-7 rounded-full bg-[#FF5B00] flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform">
                    <PlayIcon className="w-3.5 h-3.5 fill-current" />
                  </div>
                </div>
              </button>

              {/* Static thumbnails list */}
              {galleryImages.map((imgUrl, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImgIdx(idx)}
                  className={cn(
                    "w-16 h-16 rounded-2xl border-2 transition-all overflow-hidden shrink-0 bg-[#0B0D23]",
                    idx === activeImgIdx ? "border-[#FF5B00] shadow-md scale-105" : "border-slate-800 hover:border-slate-600"
                  )}
                >
                  <img 
                    src={imgUrl} 
                    alt={`thumbnail ${idx}`} 
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}

              {/* +6 styled indicator */}
              <button 
                onClick={() => toast.success("Opening high-res image grid viewer (12 angles)", { icon: "🖼️" })}
                className="w-16 h-16 rounded-2xl border border-slate-800 bg-[#0A0C22] flex items-center justify-center text-xs font-black text-slate-400 hover:text-[#FF5B00] hover:border-[#FF5B00]/40 transition-all shrink-0 cursor-pointer"
              >
                +6
              </button>
            </div>

            {/* Central White Main Image block */}
            <div className="flex-1 bg-white rounded-[32px] p-6 flex flex-col justify-between items-stretch shadow-xl order-1 md:order-2 relative min-h-[500px] border border-white/5">
              
              {/* Carousel left/right navigation arrows */}
              <button 
                onClick={() => setActiveImgIdx(prev => (prev - 1 + galleryImages.length) % galleryImages.length)}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-slate-50 hover:bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-600 hover:text-black transition-colors z-10 shadow-md cursor-pointer"
              >
                <ChevronLeft className="w-5 h-5 stroke-[2.5px]" />
              </button>
              
              <button 
                onClick={() => setActiveImgIdx(prev => (prev + 1) % galleryImages.length)}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-slate-50 hover:bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-600 hover:text-black transition-colors z-10 shadow-md cursor-pointer"
              >
                <ChevronRight className="w-5 h-5 stroke-[2.5px]" />
              </button>

              {/* Large Image display area */}
              <div className="flex-1 flex items-center justify-center py-6">
                <img 
                  src={galleryImages[activeImgIdx]} 
                  alt="Main Display Product" 
                  className="max-h-[380px] max-w-full object-contain transition-all duration-500 hover:scale-[1.03]"
                  referrerPolicy="no-referrer"
                />
              </div>

              {/* Bottom Trust badges row */}
              <div className="border-t border-slate-100 pt-4 mt-2 grid grid-cols-4 gap-1.5 text-center">
                {[
                  { label: "100% Authentic", icon: ShieldCheck, colorClass: "text-emerald-500" },
                  { label: "Official Warranty", icon: Award, colorClass: "text-blue-500" },
                  { label: "7 Days Easy Return", icon: RotateCcw, colorClass: "text-orange-500" },
                  { label: "Secure Packaging", icon: Lock, colorClass: "text-[#FF5B00]" }
                ].map((item, idx) => {
                  const Icon = item.icon;
                  return (
                    <div key={idx} className="flex flex-col items-center justify-center">
                      <div className={cn("w-6 h-6 rounded-full flex items-center justify-center mb-1 bg-slate-50", item.colorClass)}>
                        <Icon className="w-3.5 h-3.5 stroke-[2.5px]" />
                      </div>
                      <span className="text-[9px] font-black text-slate-500 tracking-tight leading-none text-center">
                        {item.label}
                      </span>
                    </div>
                  );
                })}
              </div>

            </div>

          </div>

          {/* RIGHT 6-COL: WHITE DETAIL PRICING & CONFIG CARD */}
          <div className="lg:col-span-6">
            <div className="bg-white rounded-[32px] p-6 md:p-8 shadow-2xl text-left border border-white/5 flex flex-col justify-between h-full">
              
              <div>
                {/* Badge and Reseller logo row */}
                <div className="flex flex-wrap items-center justify-between gap-4 mb-5">
                  <div className="flex items-center gap-1.5">
                    <span className="px-2.5 py-1 bg-[#FF5B00] text-white text-[9px] font-black tracking-wider rounded-lg uppercase">
                      Featured
                    </span>
                    <span className="px-2.5 py-1 bg-emerald-500 text-white text-[9px] font-black tracking-wider rounded-lg uppercase">
                      Trending
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 px-3 py-1 bg-slate-50 border border-slate-200/60 rounded-full">
                    <AppleIcon className="w-3.5 h-3.5 text-black" />
                    <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest leading-none">
                      Apple <span className="font-black text-black">Authorized Reseller</span>
                    </span>
                  </div>
                </div>

                {/* Main Title and Brand config */}
                <h1 className="text-2xl md:text-[28px] font-black text-slate-900 tracking-tight leading-tight uppercase font-sans">
                  {product.title || "Apple iPhone 15 Pro Max (256GB)"}
                </h1>
                <p className="text-xs font-extrabold text-slate-400 uppercase tracking-wider mt-1.5">
                  Titanium Black
                </p>

                {/* Ratings block */}
                <div className="flex items-center gap-2 mt-4 pb-4 border-b border-slate-100">
                  <div className="flex items-center text-amber-500 gap-0.5">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} className="w-4 h-4 fill-current text-amber-400" />
                    ))}
                  </div>
                  <span className="text-xs font-black text-slate-800 leading-none">
                    4.8 <span className="text-slate-400 font-bold ml-1">({product.reviews || "12.4K"} reviews)</span>
                  </span>
                  <div className="w-px h-3.5 bg-slate-200" />
                  <span className="text-xs font-black text-[#FF5B00] uppercase tracking-widest leading-none">
                    25K+ Sold
                  </span>
                </div>

                {/* Price Display Block */}
                <div className="bg-slate-50/50 border border-slate-200/60 rounded-2xl p-4.5 my-5 flex flex-col gap-2">
                  <div className="flex flex-wrap items-baseline gap-3">
                    <span className="text-3xl font-black text-[#FF5B00] tracking-tight leading-none italic uppercase">
                      BDT {product.price || "167,500"}
                    </span>
                    <span className="text-sm font-bold text-slate-400 line-through leading-none">
                      BDT 185,000
                    </span>
                    <span className="px-2 py-0.5 bg-emerald-50 border border-emerald-100 text-emerald-600 font-extrabold text-[10px] rounded-md tracking-wider leading-none uppercase">
                      Save BDT 17,500 (9%)
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-500 mt-1">
                    <Info className="w-4 h-4 text-[#FF5B00] stroke-[2.5px]" />
                    <span>EMI starts from BDT 5,280/month</span>
                    <HelpCircle className="w-3.5 h-3.5 text-slate-400 hover:text-[#FF5B00] cursor-pointer" onClick={() => toast.success("EMI payment available with 12 major local banks in Bangladesh!")} />
                  </div>
                </div>

                {/* Storage selection row */}
                <div className="mb-5 text-left">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">
                    Storage: {selectedStorage}
                  </span>
                  <div className="flex flex-wrap gap-2.5">
                    {["256GB", "512GB", "1TB"].map((storage) => {
                      const isSelected = storage === selectedStorage;
                      return (
                        <button
                          key={storage}
                          onClick={() => {
                            setSelectedStorage(storage);
                            toast.success(`Storage set to: ${storage}`);
                          }}
                          className={cn(
                            "px-5 h-11 rounded-xl text-xs font-black tracking-widest border transition-all cursor-pointer uppercase select-none outline-none",
                            isSelected 
                              ? "border-[#FF5B00] bg-[#FF5B00]/5 text-[#FF5B00] shadow-xs" 
                              : "border-slate-200 bg-white text-slate-500 hover:border-slate-400 hover:text-slate-800"
                          )}
                        >
                          {storage}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Color circular dots swatches */}
                <div className="mb-6 text-left">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">
                    Color: {selectedColor}
                  </span>
                  <div className="flex items-center gap-3">
                    {[
                      { name: "Titanium Black", colorClass: "bg-slate-900" },
                      { name: "Titanium Gray", colorClass: "bg-slate-400" },
                      { name: "Titanium Silver", colorClass: "bg-slate-200 border border-slate-300" },
                      { name: "Titanium Blue", colorClass: "bg-sky-950" }
                    ].map((col, idx) => {
                      const isSelected = col.name === selectedColor;
                      return (
                        <button
                          key={idx}
                          onClick={() => {
                            setSelectedColor(col.name);
                            toast.success(`Color: ${col.name}`);
                          }}
                          className={cn(
                            "w-10 h-10 rounded-full flex items-center justify-center transition-all cursor-pointer",
                            isSelected ? "ring-2 ring-[#FF5B00] ring-offset-2 scale-110 shadow-sm" : "hover:scale-105"
                          )}
                          title={col.name}
                        >
                          <span className={cn("w-7 h-7 rounded-full block shadow-inner", col.colorClass)} />
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Delivery options row card */}
                <div className="bg-slate-50 border border-slate-200/60 rounded-2xl p-4 mb-6 flex items-start gap-4">
                  <div className="w-10 h-10 bg-[#FF5B00]/10 rounded-xl flex items-center justify-center text-[#FF5B00] shrink-0">
                    <MapPin className="w-5 h-5 stroke-[2.5px]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-[9px] font-black text-[#FF5B00] uppercase tracking-widest block mb-0.5 leading-none">
                      Delivery in Bangladesh
                    </span>
                    <h5 className="text-xs font-black text-slate-900 leading-none mt-1">
                      Dhaka, Bangladesh - 20 - 22 May
                    </h5>
                    <div className="flex items-center gap-1 mt-1 text-[10px] font-bold text-slate-500">
                      <Check className="w-3.5 h-3.5 text-emerald-500 stroke-[3.5px]" />
                      <span>Standard Delivery Available</span>
                    </div>
                  </div>
                  <button 
                    onClick={() => toast.success("Postcode selector prompted")}
                    className="text-xs font-black text-[#FF5B00] hover:text-orange-600 uppercase tracking-widest shrink-0 self-center border-none bg-transparent cursor-pointer"
                  >
                    Change
                  </button>
                </div>

              </div>

              {/* ACTION CALLS CTAs BLOCK */}
              <div>
                <button 
                  onClick={handleAddToCart}
                  className="w-full h-13 bg-[#FF5B00] hover:bg-orange-600 text-white font-black text-xs uppercase tracking-widest rounded-xl transition-all shadow-md hover:shadow-orange-500/10 flex items-center justify-center gap-2 cursor-pointer border-none active:scale-98"
                >
                  <ShoppingBag className="w-4 h-4 fill-current text-white" />
                  <span>ADD TO CART</span>
                </button>

                <div className="grid grid-cols-2 gap-3 mt-3">
                  <button 
                    onClick={handleBuyNow}
                    className="h-11 bg-white border-2 border-slate-900 text-slate-900 hover:bg-slate-50 font-black text-xs uppercase tracking-widest rounded-xl transition-all cursor-pointer active:scale-98"
                  >
                    BUY NOW
                  </button>

                  <button 
                    onClick={handleBuyWithEmi}
                    className="h-11 bg-[#0A0C22] hover:bg-[#121538] text-white font-black text-xs uppercase tracking-widest rounded-xl transition-all cursor-pointer active:scale-98 shadow-xs"
                  >
                    BUY WITH EMI
                  </button>
                </div>

                {/* Sub row links */}
                <div className="flex items-center justify-between gap-4 mt-5 pt-4.5 border-t border-slate-100">
                  <button 
                    onClick={handleToggleLike}
                    className="flex items-center gap-2 text-xs font-black text-slate-400 hover:text-red-500 transition-colors border-none bg-transparent cursor-pointer"
                  >
                    <Heart className={cn("w-4 h-4 transition-all", isLiked ? "fill-red-500 text-red-500" : "")} />
                    <span>Add to Wishlist</span>
                  </button>

                  <button 
                    onClick={handleAddToCompare}
                    className="flex items-center gap-2 text-xs font-black text-slate-400 hover:text-blue-500 transition-colors border-none bg-transparent cursor-pointer"
                  >
                    <ArrowLeftRight className="w-4 h-4" />
                    <span>Compare</span>
                  </button>

                  <button 
                    onClick={handleShare}
                    className="flex items-center gap-2 text-xs font-black text-slate-400 hover:text-[#FF5B00] transition-colors border-none bg-transparent cursor-pointer"
                  >
                    <Share2 className="w-4 h-4" />
                    <span>Share</span>
                  </button>
                </div>
              </div>

            </div>
          </div>

        </div>

        {/* METRICS HORIZONTAL HIGHLIGHT STRIP */}
        <div className="max-w-7xl mx-auto px-6 md:px-10 mt-8">
          <div className="bg-[#0B0C23]/60 border border-white/5 rounded-2xl p-5 shadow-2xl">
            <div className="grid grid-cols-2 md:grid-cols-5 gap-6 divide-y md:divide-y-0 md:divide-x divide-white/10 items-center text-white">
              {[
                { label: "Love Reacts", value: "329", icon: Heart, iconColor: "text-red-500" },
                { label: "Items Saved", value: "167", icon: Bookmark, iconColor: "text-blue-400" },
                { label: "Deals Found", value: "12", icon: Flame, iconColor: "text-orange-500" },
                { label: "Verified Orders", value: "864", icon: ShieldCheck, iconColor: "text-emerald-500" },
                { label: "Product Views", value: "3,268", icon: Eye, iconColor: "text-pink-500", badge: "Trending" }
              ].map((m, idx) => {
                const Icon = m.icon;
                return (
                  <div key={idx} className="flex flex-col items-center md:items-start px-4 first:pl-0 last:pr-0 pt-4 md:pt-0 text-left">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-2 flex items-center gap-1.5">
                      <Icon className={cn("w-3.5 h-3.5", m.iconColor)} />
                      <span>{m.label}</span>
                      {m.badge && (
                        <span className="px-1.5 py-0.5 bg-green-500/15 border border-green-500/30 text-green-400 rounded text-[7px] font-black uppercase tracking-wider animate-pulse">
                          {m.badge}
                        </span>
                      )}
                    </span>
                    <div className="flex items-baseline gap-1.5">
                      <h4 className="text-xl md:text-2xl font-black text-white italic leading-none">
                        {m.value}
                      </h4>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

      </div>

      {/* ==========================================
          SECONDARY NAV BAR (TABS SECTIONS ROUTING)
          ========================================== */}
      <div className="w-full bg-white border-b border-slate-200 sticky top-[72px] z-30 shadow-xs text-left">
        <div className="max-w-7xl mx-auto px-6 md:px-10 flex items-center gap-6 overflow-x-auto no-scrollbar">
          {[
            "PRODUCT",
            "SPECS",
            "CREATOR REVIEWS",
            "PUBLIC REVIEWS",
            "PRODUCT OVERVIEW",
            "BUYING GUIDE",
            "FILTER"
          ].map((tab) => {
            const isSelected = activeTab === tab;
            return (
              <button
                key={tab}
                onClick={() => {
                  setActiveTab(tab);
                  toast.success(`Focused ${tab} module`);
                  const targetIdMap: Record<string, string> = {
                    "PRODUCT": "explain-section",
                    "SPECS": "specs-section",
                    "CREATOR REVIEWS": "specs-section",
                    "PUBLIC REVIEWS": "public-reviews-section",
                    "PRODUCT OVERVIEW": "overview-section",
                    "BUYING GUIDE": "explain-section",
                    "FILTER": "specs-section"
                  };
                  const targetEl = document.getElementById(targetIdMap[tab]);
                  if (targetEl) {
                    targetEl.scrollIntoView({ behavior: "smooth", block: "start" });
                  }
                }}
                className={cn(
                  "py-4.5 px-1 text-xs font-black tracking-widest border-b-[3px] transition-all cursor-pointer relative uppercase whitespace-nowrap outline-none",
                  isSelected 
                    ? "border-[#FF5B00] text-[#FF5B00]" 
                    : "border-transparent text-slate-500 hover:text-slate-800"
                )}
              >
                {tab}
              </button>
            );
          })}
        </div>
      </div>

      {/* ==========================================
          BOTTOM LIGHT GREY CONTENT REGIONS
          ========================================== */}
      <div className="max-w-7xl mx-auto w-full px-6 md:px-10 mt-8 space-y-10">
        
        {/* EXPLAIN THIS PRODUCT SECTION */}
        <section id="explain-section" className="text-left scroll-mt-32">
          <div className="bg-white border border-slate-200/80 rounded-2xl shadow-xs overflow-hidden">
            
            <button
              onClick={() => setIsExplainOpen(!isExplainOpen)}
              className="w-full p-4 flex items-center justify-between bg-slate-50 border-b border-slate-150 cursor-pointer text-left font-black"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-2.5 h-2.5 rounded-full bg-[#FF5B00]" />
                <span className="text-xs font-black text-slate-900 uppercase tracking-widest">
                  EXPLAIN THIS PRODUCT
                </span>
              </div>
              {isExplainOpen ? <ChevronUp className="w-4 h-4 text-slate-500" /> : <ChevronDown className="w-4 h-4 text-slate-500" />}
            </button>

            <AnimatePresence initial={false}>
              {isExplainOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <div className="p-5 flex flex-col gap-4.5 text-xs text-left">
                    <div>
                      <div className="inline-flex items-center gap-1 text-[9px] font-black text-[#FF5B00] bg-[#FF5B00]/10 px-2.5 py-0.5 rounded-md uppercase tracking-wider mb-2">
                        VERIFIED CHOOSIFY EXPLAINER
                      </div>
                      <h4 className="font-black text-slate-950 text-sm mb-1.5 uppercase tracking-tight">
                        Product at a glance
                      </h4>
                      <p className="text-slate-500 font-semibold leading-relaxed">
                        The Apple iPhone 15 Pro Max (256GB) features a 6.7-inch Super Retina XDR display, A17 Pro chip, and Pro camera system with custom 5x optical zoom lens capability. Built from premium aerospace-grade titanium alloy with textured matte glass back design.
                      </p>
                    </div>

                    <div className="border-t border-slate-100 pt-4">
                      <div className="inline-flex items-center gap-1 text-[9px] font-black text-green-600 bg-green-500/10 px-2.5 py-0.5 rounded-md uppercase tracking-wider mb-2">
                        WHAT CHOOSIFY RECOMMENDS
                      </div>
                      <h4 className="font-black text-slate-950 text-sm mb-1.5 uppercase tracking-tight">
                        Buying tip
                      </h4>
                      <p className="text-slate-500 font-semibold leading-relaxed">
                        Best for power users, professional content creators, tech enthusiasts, and consumers seeking the absolute peak of display craftsmanship, processing performance, and professional-grade optical zoom capabilities.
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

          </div>
        </section>

        {/* TECHNICAL DETAILS OF APPLE IPHONE 15 PRO MAX */}
        <section id="specs-section" className="scroll-mt-32 text-left">
          <div className="bg-white border border-slate-200/80 rounded-[28px] p-6 md:p-8 shadow-xs">
            
            <div className="text-center mb-8 border-b border-slate-100 pb-5">
              <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight leading-none">
                PRODUCT SPECIFICATIONS
              </h3>
              <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mt-2">
                TECHNICAL DETAILS OF APPLE IPHONE 15 PRO MAX
              </p>
            </div>

            {/* 8-Element Specs Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: "BRAND", value: "Apple", category: "BRAND" },
                { label: "CATEGORY", value: "Smartphones", category: "CATEGORY" },
                { label: "DISPLAY", value: '6.7" Super Retina XDR', category: "DISPLAY" },
                { label: "STORAGE", value: "256GB / 512GB / 1TB", category: "STORAGE" },
                { label: "CHIPSET", value: "A17 Pro Chip", category: "CHIPSET" },
                { label: "CAMERA", value: "48MP Main + 12MP Ultra Wide", category: "CAMERA" },
                { label: "BATTERY", value: "Up to 29 Hours", category: "BATTERY" },
                { label: "RATING", value: "4.8 / 5", category: "RATING" }
              ].map((spec, idx) => (
                <div key={idx} className="bg-slate-50/50 border border-slate-200/60 rounded-2xl p-4 text-left flex flex-col justify-between h-28 hover:border-slate-300 transition-colors">
                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider">
                    {spec.category}
                  </span>
                  <div>
                    <h4 className="text-xs font-black text-slate-900 uppercase mt-2 leading-none">
                      {spec.label}
                    </h4>
                    <p className="text-xs text-slate-500 font-bold mt-1.5 leading-tight">
                      {spec.value}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Spotlight Banner row */}
            <div className="mt-6 pt-5 border-t border-slate-150 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
                <Mail className="w-4 h-4 text-[#FF5B00]" />
                <span>Creator reviews coming soon. Sign up to get instantly notified.</span>
              </div>
              <button 
                onClick={() => {
                  toast.success("Redirecting to Spotlight reviews center...");
                  navigate("/creators");
                }}
                className="text-xs font-black text-[#FF5B00] hover:text-orange-600 uppercase tracking-wider flex items-center gap-1 group border-none bg-transparent cursor-pointer"
              >
                <span>BROWSE SPOTLIGHT REVIEWS</span>
                <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </button>
            </div>

          </div>
        </section>

        {/* PUBLIC REVIEWS */}
        <section id="public-reviews-section" className="scroll-mt-32 text-left">
          <div className="bg-white border border-slate-200/80 rounded-[28px] p-6 md:p-8 shadow-xs">
            
            <div className="text-center mb-8 border-b border-slate-100 pb-5">
              <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight">
                PUBLIC REVIEWS
              </h3>
              <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mt-2">
                SHARING CUSTOMER EXPERIENCES
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* Write Customer Review Form */}
              <div className="lg:col-span-4 bg-slate-50/50 border border-slate-200/60 rounded-2xl p-5 text-left">
                <h4 className="text-xs font-black text-slate-950 uppercase tracking-wider mb-4 border-b border-slate-150 pb-2">
                  WRITE A CUSTOMER REVIEW
                </h4>

                <form onSubmit={handleReviewSubmit} className="space-y-4">
                  {/* Rating Selector */}
                  <div>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">
                      YOUR RATING
                    </span>
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setUserRating(star)}
                          className="p-1 hover:scale-110 transition-transform cursor-pointer border-none bg-transparent"
                        >
                          <Star className={cn("w-6 h-6", star <= userRating ? "fill-current text-amber-400" : "text-slate-300")} />
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Comment Details */}
                  <div>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">
                      REVIEW DETAILS
                    </span>
                    <textarea
                      rows={4}
                      value={reviewComment}
                      onChange={(e) => setReviewComment(e.target.value)}
                      placeholder="Write your review here..."
                      className="w-full bg-white border border-slate-200 rounded-xl p-3 text-xs font-bold text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-[#FF5B00] focus:border-[#FF5B00] transition-all"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 bg-[#FF5B00] hover:bg-orange-600 text-white font-black text-xs uppercase tracking-widest rounded-xl transition-colors cursor-pointer border-none shadow-sm"
                  >
                    SUBMIT CUSTOMER REVIEW
                  </button>
                </form>
              </div>

              {/* Reviews List */}
              <div className="lg:col-span-8 flex flex-col gap-5">
                {reviewsList.map((rev) => (
                  <div key={rev.id} className="bg-white border border-slate-200/80 rounded-2xl p-5 text-left flex flex-col sm:flex-row gap-4 items-start hover:shadow-xs transition-shadow">
                    
                    {/* User Avatars Column */}
                    <div className="flex items-center sm:items-start gap-3 shrink-0">
                      <div className="w-11 h-11 rounded-full overflow-hidden border border-slate-200">
                        <img src={rev.avatar} alt={rev.author} className="w-full h-full object-cover" />
                      </div>
                      <div className="text-left">
                        <h5 className="text-xs font-black text-slate-900 leading-none">
                          {rev.author}
                        </h5>
                        <div className="inline-flex items-center gap-1 px-1.5 py-0.5 bg-emerald-50 border border-emerald-100 text-emerald-600 rounded text-[7px] font-black uppercase tracking-wider mt-1.5 leading-none">
                          Verified Buyer
                        </div>
                      </div>
                    </div>

                    {/* Review content box */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between flex-wrap gap-2">
                        <div className="flex text-amber-500 gap-0.5">
                          {Array.from({ length: rev.rating }).map((_, i) => (
                            <Star key={i} className="w-3.5 h-3.5 fill-current text-amber-400" />
                          ))}
                        </div>
                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                          {rev.date}
                        </span>
                      </div>

                      <p className="text-xs text-slate-500 font-semibold leading-relaxed mt-2.5">
                        {rev.comment}
                      </p>

                      {/* Attached review photos */}
                      {rev.images && rev.images.length > 0 && (
                        <div className="flex gap-2 mt-3.5 flex-wrap">
                          {rev.images.map((img, index) => (
                            <div 
                              key={index} 
                              onClick={() => toast.success("Enlarged review photo popped!", { icon: "🔍" })}
                              className="w-14 h-14 bg-slate-50 border border-slate-200 rounded-lg overflow-hidden cursor-pointer hover:opacity-80 transition-opacity"
                            >
                              <img src={img} alt="review attachment" className="w-full h-full object-cover" />
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Helpful CTA button */}
                      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-end">
                        <button 
                          onClick={() => handleHelpfulIncrement(rev.id)}
                          className="px-3.5 h-8 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-500 hover:text-slate-800 text-[10px] font-black flex items-center gap-1.5 cursor-pointer bg-white select-none transition-colors"
                        >
                          <ThumbsUp className="w-3.5 h-3.5 text-slate-400" />
                          <span>Helpful ({rev.helpfulCount})</span>
                        </button>
                      </div>

                    </div>

                  </div>
                ))}

                <button 
                  onClick={() => toast.success("All verified reviews loaded.")}
                  className="w-full py-3.5 bg-slate-50 hover:bg-slate-100 text-slate-500 hover:text-slate-800 font-black rounded-xl text-[10px] uppercase tracking-widest border border-slate-200 transition-colors text-center cursor-pointer mt-2 select-none"
                >
                  LOAD MORE REVIEWS
                </button>
              </div>

            </div>

          </div>
        </section>

        {/* PRODUCT OVERVIEW SECTION */}
        <section id="overview-section" className="scroll-mt-32 text-left">
          <div className="bg-white border border-slate-200/80 rounded-[28px] p-6 md:p-8 shadow-xs">
            
            <div className="text-center mb-8 pb-5 border-b border-slate-100">
              <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight">
                PRODUCT OVERVIEW
              </h3>
              <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mt-2">
                EVERYTHING YOU NEED TO KNOW
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              
              {/* Col 1 */}
              <div className="bg-slate-50/50 border border-slate-200/60 rounded-2xl p-5">
                <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider border-b border-slate-200/60 pb-2 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#FF5B00] stroke-[2.5px]" />
                  <span>QUALITY & MATERIALS</span>
                </h4>
                <ul className="space-y-3 mt-4 text-xs font-semibold text-slate-500 list-none">
                  {[
                    "Titanium Design",
                    "Ceramic Shield Front",
                    "Surgical-grade Stainless Steel",
                    "IP68 Water & Dust Resistant"
                  ].map((bullet, i) => (
                    <li key={i} className="flex items-start gap-1.5">
                      <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5 stroke-[3px]" />
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Col 2 */}
              <div className="bg-slate-50/50 border border-slate-200/60 rounded-2xl p-5">
                <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider border-b border-slate-200/60 pb-2 flex items-center gap-2">
                  <Award className="w-4 h-4 text-blue-500 stroke-[2.5px]" />
                  <span>FEATURES & BENEFITS</span>
                </h4>
                <ul className="space-y-3 mt-4 text-xs font-semibold text-slate-500 list-none">
                  {[
                    "A17 Pro Chip with 6-core GPU",
                    "Pro Camera System (48MP Main)",
                    "Action Button Option",
                    "USB-C with USB 3 speeds"
                  ].map((bullet, i) => (
                    <li key={i} className="flex items-start gap-1.5">
                      <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5 stroke-[3px]" />
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Col 3 */}
              <div className="bg-slate-50/50 border border-slate-200/60 rounded-2xl p-5">
                <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider border-b border-slate-200/60 pb-2 flex items-center gap-2">
                  <RotateCcw className="w-4 h-4 text-purple-500 stroke-[2.5px]" />
                  <span>PERFORMANCE</span>
                </h4>
                <ul className="space-y-3 mt-4 text-xs font-semibold text-slate-500 list-none">
                  {[
                    "Up to 29 hours video playback",
                    "Fast charging support",
                    "iOS 17 optimized",
                    "Smooth gaming performance"
                  ].map((bullet, i) => (
                    <li key={i} className="flex items-start gap-1.5">
                      <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5 stroke-[3px]" />
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Col 4 */}
              <div className="bg-slate-50/50 border border-slate-200/60 rounded-2xl p-5">
                <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider border-b border-slate-200/60 pb-2 flex items-center gap-2">
                  <Lock className="w-4 h-4 text-teal-500 stroke-[2.5px]" />
                  <span>WARRANTY & SUPPORT</span>
                </h4>
                <ul className="space-y-3 mt-4 text-xs font-semibold text-slate-500 list-none">
                  {[
                    "1 Year Official Warranty",
                    "Authorized Service Centers",
                    "Apple Care+ Available",
                    "24/7 Customer Support"
                  ].map((bullet, i) => (
                    <li key={i} className="flex items-start gap-1.5">
                      <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5 stroke-[3px]" />
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>
              </div>

            </div>

            {/* Best For Tags row */}
            <div className="pt-5 border-t border-slate-100 flex flex-wrap items-center gap-2.5">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mr-1">
                BEST FOR
              </span>
              {[
                "Photography", "Gaming", "Content Creation", "Business", "Travel", "Premium Users"
              ].map((tag) => (
                <span key={tag} className="px-3.5 py-1.5 bg-slate-100 border border-slate-200 text-slate-600 font-extrabold text-[10px] tracking-widest rounded-lg uppercase">
                  {tag}
                </span>
              ))}
            </div>

          </div>
        </section>

        {/* 4-COLUMN SPECS/BOXES/STORES PANELS */}
        <section className="text-left">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-stretch">
            
            {/* Panel 1: Box Content */}
            <div className="bg-white border border-slate-200/80 rounded-2xl p-6 flex flex-col justify-between shadow-xs">
              <div>
                <h4 className="text-xs font-black text-slate-400 uppercase tracking-wider border-b border-slate-100 pb-3 mb-4">
                  BOX CONTENT
                </h4>
                <ul className="space-y-3.5 text-xs font-semibold text-slate-600">
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-500 stroke-[3px] shrink-0" />
                    <span>iPhone 15 Pro Max</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-500 stroke-[3px] shrink-0" />
                    <span>USB-C Charge Cable</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-500 stroke-[3px] shrink-0" />
                    <span>Documentation</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-500 stroke-[3px] shrink-0" />
                    <span>IP68 Ejector Tool</span>
                  </li>
                </ul>
              </div>
              <button 
                onClick={() => toast.success("Chargers/headphones excluded globally for Apple eco-friendly initiatives.")}
                className="mt-6 w-full py-3 bg-slate-50 border border-slate-200 hover:bg-slate-100 text-slate-500 hover:text-slate-800 font-black rounded-xl text-[10px] uppercase tracking-widest transition-colors cursor-pointer text-center select-none"
              >
                Learn More
              </button>
            </div>

            {/* Panel 2: Physical Specs */}
            <div className="bg-white border border-slate-200/80 rounded-2xl p-6 flex flex-col justify-between shadow-xs">
              <div>
                <h4 className="text-xs font-black text-slate-400 uppercase tracking-wider border-b border-slate-100 pb-3 mb-4">
                  PHYSICAL SPECS
                </h4>
                <ul className="space-y-3.5 text-xs font-semibold text-slate-600">
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-500 stroke-[3px] shrink-0" />
                    <span>Dimensions: 159.9 x 76.7 x 8.25 mm</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-500 stroke-[3px] shrink-0" />
                    <span>Weight: 221 g</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-500 stroke-[3px] shrink-0" />
                    <span>Display: 6.7" Super Retina XDR</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-500 stroke-[3px] shrink-0" />
                    <span>Build: Titanium and Textured Glass</span>
                  </li>
                </ul>
              </div>
              <button 
                onClick={() => toast.success("Detailed dimensions spec-sheet popped")}
                className="mt-6 w-full py-3 bg-slate-50 border border-slate-200 hover:bg-slate-100 text-slate-500 hover:text-slate-800 font-black rounded-xl text-[10px] uppercase tracking-widest transition-colors cursor-pointer text-center select-none"
              >
                Full Dimensions
              </button>
            </div>

            {/* Panel 3: Apple Store details */}
            <div className="bg-white border border-slate-200/80 rounded-2xl p-6 flex flex-col justify-between shadow-xs text-center">
              <div className="flex flex-col items-center">
                <div className="w-14 h-14 rounded-full bg-slate-950 flex items-center justify-center text-white mb-3 shadow-md">
                  <AppleIcon className="w-7 h-7 fill-current" />
                </div>
                <h4 className="text-sm font-black text-slate-900 uppercase tracking-tight">
                  APPLE
                </h4>
                <p className="text-[10px] font-black text-[#FF5B00] uppercase tracking-widest mt-0.5">
                  Official Brand Store
                </p>

                <div className="flex items-center gap-1 text-xs font-bold text-amber-500 mt-2">
                  <Star className="w-3.5 h-3.5 fill-current text-amber-500" />
                  <span className="text-slate-900 font-black">4.8</span>
                  <span className="text-slate-400 font-bold lowercase">(12.4K reviews)</span>
                </div>
              </div>

              <div className="space-y-2 mt-6">
                <button 
                  onClick={() => {
                    toast.success("Redirecting to Apple Official Brand page...");
                    navigate("/brands");
                  }}
                  className="w-full py-2 bg-white border border-slate-300 hover:border-slate-500 text-slate-700 hover:text-slate-900 font-black rounded-lg text-[9px] uppercase tracking-widest transition-colors cursor-pointer select-none"
                >
                  VISIT APPLE STORE
                </button>

                <button 
                  onClick={() => toast.success("You are now following Apple Brand updates!", { icon: "🙌" })}
                  className="w-full py-2 bg-white border border-slate-200 hover:border-slate-400 text-slate-500 hover:text-slate-800 font-black rounded-lg text-[9px] uppercase tracking-widest transition-colors cursor-pointer select-none"
                >
                  FOLLOW BRAND
                </button>

                <button 
                  onClick={() => {
                    toast.success("Directing to Apple detailed brand showcase profile...");
                    navigate("/brands");
                  }}
                  className="w-full py-2 bg-[#FF5B00] hover:bg-orange-600 text-white font-black rounded-lg text-[9px] uppercase tracking-widest transition-colors cursor-pointer select-none border-none"
                >
                  VIEW BRAND PROFILE
                </button>
              </div>
            </div>

            {/* Panel 4: Price Across Stores list */}
            <div className="bg-white border border-slate-200/80 rounded-2xl p-6 flex flex-col justify-between shadow-xs">
              <div>
                <h4 className="text-xs font-black text-slate-400 uppercase tracking-wider border-b border-slate-100 pb-3 mb-4 flex items-center gap-1">
                  <ArrowLeftRight className="w-3.5 h-3.5 text-[#FF5B00]" />
                  <span>PRICE ACROSS STORES</span>
                </h4>

                <div className="space-y-3">
                  {[
                    { name: "Choosify", price: "BDT 167,500", highlight: true },
                    { name: "Daraz", price: "BDT 168,999" },
                    { name: "Pickaboo", price: "BDT 168,500" },
                    { name: "Star Tech", price: "BDT 170,000" }
                  ].map((store, idx) => (
                    <div key={idx} className="flex items-center justify-between text-xs font-semibold py-1 border-b border-slate-50 last:border-0">
                      <span className={cn("text-slate-500", store.highlight ? "font-black text-slate-950" : "")}>
                        {store.name}
                      </span>
                      <span className={cn("text-slate-900 font-extrabold", store.highlight ? "text-[#FF5B00] font-black" : "")}>
                        {store.price}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <button 
                onClick={() => toast.success("Retrieving price maps for 15 local bangladeshi shops...", { icon: "📈" })}
                className="mt-6 w-full py-3 bg-slate-50 border border-slate-200 hover:bg-slate-100 text-[#FF5B00] font-black rounded-xl text-[10px] uppercase tracking-widest transition-all cursor-pointer text-center select-none"
              >
                View more stores &gt;
              </button>
            </div>

          </div>
        </section>

        {/* UPGRADE TO PRIME BANNER */}
        <section className="text-left">
          <div className="bg-gradient-to-r from-[#03040E] via-[#0E102F] to-[#16184E] rounded-2xl p-6 border border-white/5 flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl relative overflow-hidden">
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />
            
            <div className="flex items-center gap-4 text-left">
              <div className="w-12 h-12 bg-amber-400/10 rounded-xl flex items-center justify-center text-amber-400 shrink-0 border border-amber-400/20">
                <span className="text-xl font-bold">👑</span>
              </div>
              <div className="min-w-0">
                <h4 className="text-sm font-black text-white uppercase tracking-wider">
                  Upgrade to Choosify Prime
                </h4>
                <p className="text-xs text-slate-400 font-semibold leading-normal mt-0.5">
                  Get 2% instant discount, exclusive deals & early access to top brand launches.
                </p>
              </div>
            </div>

            <button 
              onClick={() => toast.success("Choosify Prime application waitlisted! We'll reach out.", { icon: "👑" })}
              className="px-6 py-3 bg-[#FF5B00] hover:bg-orange-600 text-white font-black text-[10px] uppercase tracking-widest rounded-xl transition-all shadow-md cursor-pointer border-none shrink-0 select-none active:scale-95"
            >
              UPGRADE NOW
            </button>
          </div>
        </section>

        {/* TRUST STATEMENT FOOTER BAR */}
        <section className="pb-10">
          <div className="bg-white border border-slate-200/80 rounded-2xl py-5 px-6 flex items-center justify-center gap-3 shadow-xs">
            <ShieldCheck className="w-5 h-5 text-emerald-500 shrink-0 stroke-[2.5px]" />
            <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider leading-relaxed text-center sm:text-left">
              <span className="font-black text-slate-900">CHOOSIFY.BD TRUST STATEMENT:</span> Only verified sellers and completely unbiased, authentic brand experiences are listed on Choosify.
            </p>
          </div>
        </section>

      </div>

    </div>
  );
}
