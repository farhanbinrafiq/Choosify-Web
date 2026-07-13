import React, { useState, useEffect, useMemo } from "react";
import { useNavigate, Link, useParams } from "react-router-dom";
import { toast } from "react-hot-toast";
import { motion, AnimatePresence } from "motion/react";
import { 
  Home, ChevronRight, Star, Heart, Share2, Calendar, MapPin, 
  Globe, Package, ShieldCheck, Award, RotateCcw, Lock, Clock,
  Search, ChevronLeft, Check, ThumbsUp, ExternalLink, ArrowUpRight,
  Bookmark, Mail, Info, HelpCircle, BadgePercent, Sparkles
} from "lucide-react";

// Import our custom-generated premium Samsung products illustration collage
// @ts-expect-error raw image asset import
import samsungHeroImg from "../assets/images/samsung_hero_products_1783877011850.jpg";

// TikTok Icon Custom SVG
function TikTokIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.02 1.73 4.1 1.12 1.09 2.62 1.7 4.18 1.8v3.91c-1.85-.01-3.61-.68-5.07-1.82V14.5c.04 3.39-2.14 6.55-5.4 7.63-3.25 1.08-6.9-.32-8.56-3.32C1.65 15.82 2.45 11.9 5.31 9.87c1.78-1.27 4.14-1.55 6.16-.72.01-.16.02-.32.02-.48V4.83c-1.41-.35-2.88-.16-4.16.54-2.1 1.15-3.35 3.51-3.14 5.92.21 2.42 2.01 4.54 4.38 5.17 2.37.64 4.96-.2 6.09-2.26.47-.86.7-1.84.66-2.82V.02Z" />
    </svg>
  );
}

// Brand Detail Interfaces
interface ProductCardData {
  id: string;
  title: string;
  price: number;
  originalPrice?: number;
  discountBadge?: string;
  customBadge?: { text: string; type: "seller" | "new" };
  rating: number;
  reviewCount: number;
  image: string;
}

interface CreatorReview {
  author: string;
  role: string;
  avatar: string;
  rating: number;
  timeAgo: string;
  comment: string;
}

export function BrandDetailPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  
  // States
  const [activeTab, setActiveTab] = useState("OVERVIEW");
  const [isFollowed, setIsFollowed] = useState(false);
  const [likedProducts, setLikedProducts] = useState<string[]>([]);
  const [currentCreatorReviewIdx, setCurrentCreatorReviewIdx] = useState(0);
  const [creatorReviewLikes, setCreatorReviewLikes] = useState<Record<number, number>>({});
  const [publicReviewLikes, setPublicReviewLikes] = useState<Record<string, number>>({});
  const [votedPublicReviews, setVotedPublicReviews] = useState<string[]>([]);
  
  // Auto-slide Creator Reviews
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentCreatorReviewIdx((prev) => (prev + 1) % CREATOR_REVIEWS.length);
    }, 8000);
    return () => clearInterval(timer);
  }, []);

  // Handle Liking a Product
  const toggleLikeProduct = (productId: string, productTitle: string) => {
    if (likedProducts.includes(productId)) {
      setLikedProducts(prev => prev.filter(x => x !== productId));
      toast.success(`Removed ${productTitle} from wishlist`);
    } else {
      setLikedProducts(prev => [...prev, productId]);
      toast.success(`Added ${productTitle} to wishlist!`, { icon: "❤️" });
    }
  };

  // Follow Brand trigger
  const handleFollowBrand = () => {
    setIsFollowed(!isFollowed);
    if (!isFollowed) {
      toast.success("You are now following Samsung! Get instant notifications on new deals.", { icon: "🔔" });
    } else {
      toast.success("Unfollowed Samsung");
    }
  };

  // Explore Products action
  const handleExploreProducts = () => {
    toast.success("Scrolling to Top Products...");
    const element = document.getElementById("top-products-section");
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  // Share brand trigger
  const handleShareBrand = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success("Samsung Brand Page Link copied to clipboard!", { icon: "🔗" });
  };

  // DATASETS (Reflecting Samsung exactly as shown in the reference image)
  
  const STATS_ITEMS = [
    { label: "Founded", value: "1937", icon: Calendar, color: "text-blue-500 bg-blue-50" },
    { label: "Headquarters", value: "South Korea", icon: MapPin, color: "text-indigo-500 bg-indigo-50" },
    { label: "Countries", value: "200+", icon: Globe, color: "text-teal-500 bg-teal-50" },
    { label: "Products Sold", value: "1,000,000+", icon: Package, color: "text-purple-500 bg-purple-50" },
    { label: "Verified Reviews", value: "12.4K", icon: Star, color: "text-amber-500 bg-amber-50 animate-pulse" },
    { label: "Buyer Protection", value: "98%", icon: ShieldCheck, color: "text-emerald-500 bg-emerald-50" }
  ];

  const FEATURED_COLLECTIONS = [
    {
      title: "Galaxy S Series",
      subtitle: "Smartphones",
      count: "24 Products",
      image: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=400&q=80"
    },
    {
      title: "QLED 8K Series",
      subtitle: "Televisions",
      count: "18 Products",
      image: "https://images.unsplash.com/photo-1593305841991-05c297ba4575?w=400&q=80"
    },
    {
      title: "Bespoke Collection",
      subtitle: "Home Appliances",
      count: "32 Products",
      image: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=400&q=80"
    },
    {
      title: "Galaxy Watch Series",
      subtitle: "Wearables",
      count: "12 Products",
      image: "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=400&q=80"
    },
    {
      title: "Galaxy Buds Series",
      subtitle: "Audio",
      count: "16 Products",
      image: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=400&q=80"
    }
  ];

  const TOP_PRODUCTS: ProductCardData[] = [
    {
      id: "samsung-s24",
      title: "Samsung Galaxy S24 Ultra",
      price: 124900,
      originalPrice: 146900,
      discountBadge: "-15%",
      rating: 4.8,
      reviewCount: 1200,
      image: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=400&q=80"
    },
    {
      id: "samsung-qled-55",
      title: 'Samsung 55" QLED 4K TV',
      price: 89900,
      originalPrice: 104000,
      customBadge: { text: "BEST SELLER", type: "seller" },
      rating: 4.7,
      reviewCount: 980,
      image: "https://images.unsplash.com/photo-1593305841991-05c297ba4575?w=400&q=80"
    },
    {
      id: "samsung-refrig",
      title: "Samsung Bespoke 4-Door Refrigerator",
      price: 152900,
      originalPrice: 189900,
      discountBadge: "-20%",
      rating: 4.8,
      reviewCount: 532,
      image: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=400&q=80"
    },
    {
      id: "samsung-watch-6",
      title: "Samsung Galaxy Watch6 Classic 47mm",
      price: 32900,
      originalPrice: 37400,
      discountBadge: "-12%",
      rating: 4.7,
      reviewCount: 713,
      image: "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=400&q=80"
    },
    {
      id: "samsung-buds-2",
      title: "Samsung Galaxy Buds2 Pro",
      price: 15900,
      originalPrice: 19400,
      discountBadge: "-18%",
      rating: 4.6,
      reviewCount: 421,
      image: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=400&q=80"
    },
    {
      id: "samsung-frame-65",
      title: 'Samsung The Frame 65" QLED TV',
      price: 159900,
      customBadge: { text: "NEW", type: "new" },
      rating: 4.8,
      reviewCount: 215,
      image: "https://images.unsplash.com/photo-1461151304267-38535e780c79?w=400&q=80"
    }
  ];

  const TRUST_ITEMS = [
    {
      title: "Official Warranty",
      desc: "100% authentic products with official warranty",
      linkText: "LEARN MORE",
      icon: Award,
      color: "text-blue-600 bg-blue-50 border border-blue-100"
    },
    {
      title: "Exclusive Offers",
      desc: "Special discounts and bank offers",
      linkText: "EXPLORE DEALS",
      icon: BadgePercent,
      color: "text-orange-600 bg-orange-50 border border-orange-100"
    },
    {
      title: "Easy Returns",
      desc: "7-day easy returns on eligible products",
      linkText: "RETURN POLICY",
      icon: RotateCcw,
      color: "text-teal-600 bg-teal-50 border border-teal-100"
    },
    {
      title: "Secure Payments",
      desc: "100% secure payments protected by SSL",
      linkText: "PAYMENT INFO",
      icon: Lock,
      color: "text-indigo-600 bg-indigo-50 border border-indigo-100"
    }
  ];

  const CREATOR_REVIEWS: CreatorReview[] = [
    {
      author: "Ashraful Islam",
      role: "Verified Buyer",
      avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&q=80",
      rating: 5,
      timeAgo: "2 days ago",
      comment: "Best smartphone experience ever! The camera, performance and design are just outstanding. The integration with One UI is super smooth and battery lasts easily over a day."
    },
    {
      author: "Samia Rahman",
      role: "Tech Influencer",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80",
      rating: 5,
      timeAgo: "1 week ago",
      comment: "The Bespoke TV collection and The Frame is an absolute masterpiece. It blends into my living room like real art. Picture quality of QLED is unmatched in this price range."
    },
    {
      author: "Zeeshan Khan",
      role: "Verified Professional",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80",
      rating: 4,
      timeAgo: "3 days ago",
      comment: "Highly recommend Galaxy Buds2 Pro for audiophiles. Active Noise Canceling is amazing, blocks Dhaka's traffic sounds completely during my daily commute."
    }
  ];

  const NEWS_STORIES = [
    {
      title: "Samsung Unveils Next Generation AI-Powered TV Lineup",
      date: "May 10, 2025",
      category: "News",
      image: "https://images.unsplash.com/photo-1593305841991-05c297ba4575?w=200&q=80"
    },
    {
      title: "Galaxy S24 Series One UI 7 Update Rollout Begins",
      date: "May 08, 2025",
      category: "Updates",
      image: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=200&q=80"
    },
    {
      title: "Samsung Expands Bespoke Home Solutions in Bangladesh",
      date: "May 05, 2025",
      category: "Stories",
      image: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=200&q=80"
    }
  ];

  const PUBLIC_REVIEWS = [
    {
      id: "pub-1",
      author: "Tanvir Hasan",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&q=80",
      product: "Samsung Galaxy S24 Ultra",
      timeAgo: "2 days ago",
      helpfulCount: 124,
      rating: 5,
      comment: "I have been using Samsung products for years and they never disappoint. Excellent build quality, stellar display, and amazing camera performance."
    },
    {
      id: "pub-2",
      author: "Nusrat Jahan",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&q=80",
      product: "Samsung Bespoke 4-Door Refrigerator",
      timeAgo: "5 days ago",
      helpfulCount: 80,
      rating: 5,
      comment: "The Bespoke refrigerator is perfect for our home. Stylish modern design, super efficient cooling, and customizable door panels are awesome!"
    }
  ];

  const SIMILAR_BRANDS = [
    { name: "Apple", identity: "Premium", quality: "PREMIUM", price: "High (৳৳৳৳)", rating: 4.6 },
    { name: "Xiaomi", identity: "High", quality: "HIGH", price: "Mid (৳৳)", rating: 4.5 },
    { name: "OnePlus", identity: "High", quality: "HIGH", price: "Mid-High (৳৳৳)", rating: 4.4 },
    { name: "Google", identity: "Premium", quality: "PREMIUM", price: "High (৳৳৳৳)", rating: 4.3 }
  ];

  // Rating details distribution values
  const ratingDistribution = [
    { stars: 5, count: "9.6K", percent: 77 },
    { stars: 4, count: "2.1K", percent: 17 },
    { stars: 3, count: "524", percent: 4 },
    { stars: 2, count: "123", percent: 1 },
    { stars: 1, count: "58", percent: 1 }
  ];

  // Helpful clicks handler
  const handleReviewHelpful = (id: string, isCreator = false) => {
    if (isCreator) {
      setCreatorReviewLikes(prev => ({
        ...prev,
        [currentCreatorReviewIdx]: (prev[currentCreatorReviewIdx] || 0) + 1
      }));
      toast.success("Marked creator review as helpful!");
    } else {
      if (votedPublicReviews.includes(id)) {
        toast.error("You have already voted this review as helpful.");
        return;
      }
      setVotedPublicReviews(prev => [...prev, id]);
      setPublicReviewLikes(prev => ({
        ...prev,
        [id]: (prev[id] || 0) + 1
      }));
      toast.success("Marked review as helpful!");
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#F8F9FC] text-gray-800 pb-20 select-none font-sans">
      
      {/* 1. BREADCRUMB */}
      <div className="w-full max-w-[1440px] mx-auto px-6 md:px-10 py-4 text-left select-none shrink-0">
        <nav className="text-xs font-semibold text-gray-400 flex items-center gap-1.5 uppercase tracking-wider">
          <Link to="/" className="hover:text-[#FF5B00] transition-colors">Home</Link>
          <span className="text-gray-300 font-bold">&gt;</span>
          <Link to="/brands" className="hover:text-[#FF5B00] transition-colors">Brands</Link>
          <span className="text-gray-300 font-bold">&gt;</span>
          <span className="text-gray-800 font-bold">Samsung</span>
        </nav>
      </div>

      {/* 2. Brand Hero Section */}
      <section className="max-w-[1440px] mx-auto w-full px-4 md:px-10 mb-6 shrink-0">
        <div className="bg-gradient-to-r from-[#030312] via-[#090A22] to-[#121338] rounded-3xl relative overflow-hidden flex flex-col md:flex-row items-stretch border border-white/5 shadow-2xl min-h-[460px]">
          
          {/* Glowing Ambient Light Spots */}
          <div className="absolute top-0 left-1/4 w-[400px] h-[400px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />
          <div className="absolute bottom-0 right-1/4 w-[350px] h-[350px] bg-[#FF5B00]/10 rounded-full blur-[100px] pointer-events-none" />

          {/* Left Block (Text and Logo) */}
          <div className="flex-1 p-8 md:p-12 text-left relative z-10 flex flex-col justify-between">
            
            {/* Solder / Logo and Slogan Header Row */}
            <div className="flex flex-col sm:flex-row items-start gap-6 mb-6">
              {/* Samsung Authentic White Logo Container */}
              <div className="w-24 h-24 sm:w-28 sm:h-28 bg-white rounded-2xl flex items-center justify-center shadow-lg shrink-0 border border-gray-150 p-3">
                <img 
                  src="https://upload.wikimedia.org/wikipedia/commons/2/24/Samsung_Logo.svg" 
                  alt="Samsung Logo" 
                  className="w-full object-contain"
                />
              </div>

              <div className="flex-1">
                {/* Brand status badge */}
                <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-500/10 border border-blue-400/20 rounded-full text-[10px] font-black text-blue-400 uppercase tracking-widest mb-2.5">
                  <Check className="w-3 h-3 text-blue-400 stroke-[3px]" />
                  <span>Verified Brand</span>
                </div>

                <h1 className="text-4xl md:text-[52px] font-black tracking-tight text-white leading-none">
                  Samsung
                </h1>
                <p className="text-lg md:text-xl font-bold text-gray-300 mt-2 tracking-tight">
                  Innovation that inspires the world
                </p>
              </div>
            </div>

            {/* Ratings & Slogan block */}
            <div className="mb-6">
              {/* Stars and metrics row */}
              <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs font-bold text-gray-300 tracking-wide uppercase mb-4 border-b border-white/5 pb-4">
                <div className="flex items-center gap-1 text-amber-400">
                  <Star className="w-4 h-4 fill-current text-amber-400" />
                  <span className="text-white">4.8/5</span>
                  <span className="text-gray-400 font-medium lowercase">(12.4K reviews)</span>
                </div>
                <div className="h-4 w-px bg-white/10 hidden sm:block"></div>
                <div>
                  <span className="text-emerald-400">98%</span> Positive Feedback
                </div>
                <div className="h-4 w-px bg-white/10 hidden sm:block"></div>
                <div className="text-purple-400 font-extrabold">
                  #1 Most Trusted Brand
                </div>
              </div>

              <p className="text-sm text-gray-400 leading-relaxed max-w-xl">
                Discover the latest smartphones, TVs, home appliances and more from Samsung – a global leader in technology and innovation.
              </p>
            </div>

            {/* Actions Row */}
            <div className="flex flex-wrap items-center gap-4 pt-4 border-t border-white/5">
              <button 
                onClick={handleExploreProducts}
                className="px-6 py-3.5 bg-[#FF5B00] hover:bg-[#E8500A] text-white font-black text-xs uppercase tracking-widest rounded-xl transition-all shadow-lg hover:shadow-[#FF5B00]/20 flex items-center gap-2 cursor-pointer border-0 active:scale-95"
              >
                <span>Explore Products</span>
                <ArrowUpRight className="w-4 h-4" />
              </button>

              <button 
                onClick={handleFollowBrand}
                className={`px-6 py-3.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all cursor-pointer border flex items-center gap-2 ${
                  isFollowed 
                    ? "bg-white text-gray-900 border-white" 
                    : "bg-transparent text-white border-white/20 hover:border-white hover:bg-white/5"
                }`}
              >
                <Heart className={`w-4 h-4 ${isFollowed ? "fill-red-500 text-red-500" : ""}`} />
                <span>{isFollowed ? "Following Brand" : "Follow Brand"}</span>
              </button>

              {/* Share Circular Button */}
              <button 
                onClick={handleShareBrand}
                className="w-11 h-11 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white flex items-center justify-center transition-all cursor-pointer"
                title="Share Brand"
              >
                <Share2 className="w-4 h-4" />
              </button>
            </div>

            {/* Social Media List Row */}
            <div className="mt-8 flex flex-col sm:flex-row sm:items-center gap-3 pt-4 border-t border-white/5">
              <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Find Us On</span>
              <div className="flex flex-wrap items-center gap-3">
                {[
                  { label: "Facebook", link: "https://facebook.com/samsung", icon: FacebookIcon },
                  { label: "Instagram", link: "https://instagram.com/samsung", icon: InstagramIcon },
                  { label: "TikTok", link: "https://tiktok.com/@samsung", icon: TikTokIcon },
                  { label: "YouTube", link: "https://youtube.com/samsung", icon: YoutubeIcon },
                  { label: "Website", link: "https://samsung.com", icon: Globe }
                ].map((social, idx) => {
                  const IconComp = social.icon;
                  return (
                    <a 
                      key={idx}
                      href={social.link} 
                      target="_blank" 
                      rel="noreferrer"
                      className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/5 text-gray-300 hover:text-white transition-all text-[11px] font-bold"
                    >
                      <IconComp className="w-3.5 h-3.5" />
                      <span>{social.label}</span>
                    </a>
                  );
                })}
              </div>
            </div>

          </div>

          {/* Right Product Image Collage (Visualizing beautiful modern Samsung collage) */}
          <div className="w-full md:w-[45%] lg:w-[50%] min-h-[300px] md:min-h-full relative overflow-hidden shrink-0">
            {/* Absolute gradients blending edge to dark */}
            <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-[#030312] via-transparent to-transparent z-10 pointer-events-none" />
            <img 
              src={samsungHeroImg} 
              alt="Samsung Tech Collage Banner" 
              className="w-full h-full object-cover object-center scale-100 md:scale-105 transition-transform duration-1000"
              referrerPolicy="no-referrer"
            />
          </div>

        </div>
      </section>

      {/* 3. Stats Summary Row Grid Bar (Clean White Box below the hero) */}
      <section className="max-w-[1440px] mx-auto w-full px-4 md:px-10 mb-8 shrink-0">
        <div className="bg-white border border-gray-150 rounded-2xl py-6 px-4 md:px-8 shadow-sm">
          <div className="grid grid-cols-2 md:grid-cols-6 gap-6 items-center divide-y md:divide-y-0 md:divide-x divide-gray-100">
            {STATS_ITEMS.map((stat, idx) => {
              const StatIcon = stat.icon;
              return (
                <div key={idx} className="flex items-center gap-4 px-4 first:pl-0 last:pr-0 pt-4 md:pt-0">
                  <div className={`w-11 h-11 rounded-full ${stat.color} flex items-center justify-center shrink-0 shadow-xs`}>
                    <StatIcon className="w-5 h-5" />
                  </div>
                  <div className="text-left min-w-0">
                    <p className="text-[11px] font-extrabold text-gray-400 uppercase tracking-wider leading-none">
                      {stat.label}
                    </p>
                    <h4 className="text-base font-black text-gray-900 mt-1.5 leading-none truncate">
                      {stat.value}
                    </h4>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 4. Horizontal Navigation Tab Strip */}
      <section className="max-w-[1440px] mx-auto w-full px-4 md:px-10 mb-8 shrink-0">
        <div className="border-b border-gray-200">
          <div className="flex items-center gap-8 overflow-x-auto no-scrollbar">
            {[
              "OVERVIEW",
              "PRODUCTS",
              "COLLECTIONS",
              "DEALS",
              "REVIEWS",
              "GUIDES",
              "NEWS & STORIES"
            ].map((tab) => {
              const isActive = activeTab === tab;
              return (
                <button
                  key={tab}
                  onClick={() => {
                    setActiveTab(tab);
                    toast.success(`Navigating to ${tab}`);
                    const targetEl = document.getElementById(`${tab.toLowerCase().replace(" & ", "-")}-section`);
                    if (targetEl) {
                      targetEl.scrollIntoView({ behavior: "smooth", block: "start" });
                    }
                  }}
                  className={`py-4 px-1 text-xs font-black tracking-widest border-b-[3px] transition-all cursor-pointer relative uppercase whitespace-nowrap outline-none ${
                    isActive 
                      ? "border-[#FF5B00] text-[#FF5B00]" 
                      : "border-transparent text-gray-500 hover:text-gray-900"
                  }`}
                >
                  {tab}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* 5. OVERVIEW / FEATURED COLLECTIONS SECTION */}
      <section id="overview-section" className="max-w-[1440px] mx-auto w-full px-4 md:px-10 mb-10 text-left">
        <div className="flex items-center justify-between mb-6 border-b border-gray-150 pb-3.5">
          <div>
            <h3 className="text-xl font-black text-gray-900 uppercase tracking-tight">
              Featured Collections
            </h3>
            <p className="text-[11px] font-extrabold text-gray-400 uppercase tracking-widest mt-1">
              Curated product series &bull; Designed for brilliance
            </p>
          </div>
          <button 
            onClick={() => toast.success("Redirecting to all collections...")}
            className="text-xs font-black text-[#FF5B00] hover:text-[#E8500A] transition-colors uppercase tracking-widest flex items-center gap-1 group"
          >
            <span>View all collections</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>

        {/* Collections Horizontal List Layout */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-5">
          {FEATURED_COLLECTIONS.map((col, idx) => (
            <div 
              key={idx}
              onClick={() => toast.success(`Viewing ${col.title} collection!`)}
              className="bg-white rounded-2xl border border-gray-200/80 p-4 hover:shadow-lg hover:border-blue-500/20 transition-all duration-300 cursor-pointer group"
            >
              {/* Product illustration image with wrapper border */}
              <div className="aspect-square bg-gray-50 rounded-xl overflow-hidden mb-4 border border-gray-100 flex items-center justify-center">
                <img 
                  src={col.image} 
                  alt={col.title} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
              </div>

              <div>
                <h4 className="text-sm font-black text-gray-900 group-hover:text-[#FF5B00] transition-colors leading-tight">
                  {col.title}
                </h4>
                <p className="text-[11px] text-gray-400 font-bold mt-1 uppercase tracking-wider leading-none">
                  {col.subtitle}
                </p>
                <div className="mt-3.5 pt-2.5 border-t border-gray-100 flex items-center justify-between">
                  <span className="text-[11px] font-bold text-gray-500">
                    {col.count}
                  </span>
                  <div className="w-5 h-5 rounded-full bg-gray-50 group-hover:bg-[#FF5B00] group-hover:text-white flex items-center justify-center text-gray-400 transition-colors">
                    <ChevronRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 6. TOP PRODUCTS GRID SECTION */}
      <section id="products-section" className="max-w-[1440px] mx-auto w-full px-4 md:px-10 mb-10 text-left scroll-mt-24">
        <div id="top-products-section" className="flex items-center justify-between mb-6 border-b border-gray-150 pb-3.5">
          <div>
            <h3 className="text-xl font-black text-gray-900 uppercase tracking-tight">
              Top Products
            </h3>
            <p className="text-[11px] font-extrabold text-gray-400 uppercase tracking-widest mt-1">
              Top-selling Samsung devices in Bangladesh
            </p>
          </div>
          <button 
            onClick={() => toast.success("Redirecting to all products...")}
            className="text-xs font-black text-[#FF5B00] hover:text-[#E8500A] transition-colors uppercase tracking-widest flex items-center gap-1 group"
          >
            <span>View all products</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>

        {/* Six Column Products Responsive Grid */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-5">
          {TOP_PRODUCTS.map((prod) => {
            const isLiked = likedProducts.includes(prod.id);
            return (
              <div 
                key={prod.id}
                className="bg-white rounded-2xl border border-gray-200/80 hover:shadow-lg transition-all duration-300 flex flex-col justify-between overflow-hidden group h-[340px]"
              >
                {/* Thumb Box */}
                <div className="relative aspect-square bg-gray-50 overflow-hidden shrink-0 p-3 flex items-center justify-center border-b border-gray-100">
                  <img 
                    src={prod.image} 
                    alt={prod.title} 
                    className="max-w-full max-h-full object-contain transition-transform duration-500 group-hover:scale-105"
                    referrerPolicy="no-referrer"
                  />

                  {/* Ribbon badges floating */}
                  {prod.discountBadge && (
                    <span className="absolute top-2.5 left-2.5 bg-red-500 text-white text-[9px] font-black tracking-widest px-2 py-0.5 rounded shadow-xs uppercase">
                      {prod.discountBadge}
                    </span>
                  )}
                  {prod.customBadge && (
                    <span className={`absolute top-2.5 left-2.5 text-white text-[8px] font-extrabold tracking-widest px-2 py-0.5 rounded shadow-xs uppercase ${
                      prod.customBadge.type === "seller" ? "bg-amber-500" : "bg-teal-500"
                    }`}>
                      {prod.customBadge.text}
                    </span>
                  )}
                </div>

                {/* Content Box */}
                <div className="p-3 flex-1 flex flex-col justify-between text-left">
                  
                  {/* Title and stats */}
                  <div>
                    <h4 className="text-[12px] font-black text-gray-900 tracking-tight leading-snug line-clamp-2 group-hover:text-[#FF5B00] transition-colors">
                      {prod.title}
                    </h4>
                    
                    {/* Stars ratings */}
                    <div className="flex items-center gap-1 text-[10px] text-amber-500 font-extrabold mt-1.5">
                      <Star className="w-3 h-3 fill-current" />
                      <span>{prod.rating}</span>
                      <span className="text-gray-400 font-bold">({prod.reviewCount})</span>
                    </div>
                  </div>

                  {/* Prices & Actions Footer Row */}
                  <div className="mt-3.5 pt-3.5 border-t border-gray-100 flex items-center justify-between">
                    <div>
                      <div className="text-[13px] font-black text-orange-600 leading-none">
                        ৳{prod.price.toLocaleString()}
                      </div>
                      {prod.originalPrice && (
                        <div className="text-[10px] text-gray-400 line-through font-semibold mt-1">
                          ৳{prod.originalPrice.toLocaleString()}
                        </div>
                      )}
                    </div>

                    {/* Wishlist Heart Toggle button */}
                    <button
                      onClick={() => toggleLikeProduct(prod.id, prod.title)}
                      className={`w-8 h-8 rounded-full border flex items-center justify-center transition-all cursor-pointer ${
                        isLiked 
                          ? "bg-red-50 border-red-200 text-red-500" 
                          : "bg-gray-50 border-gray-100 text-gray-400 hover:text-red-500 hover:bg-red-50"
                      }`}
                    >
                      <Heart className={`w-3.5 h-3.5 ${isLiked ? "fill-current" : ""}`} />
                    </button>
                  </div>

                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 7. TRUST BADGES / GUARANTEE ROW */}
      <section className="max-w-[1440px] mx-auto w-full px-4 md:px-10 mb-10 shrink-0">
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-5">
          {TRUST_ITEMS.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div 
                key={idx}
                className="bg-white border border-gray-150 rounded-2xl p-5 flex items-start gap-4 hover:shadow-md transition-all duration-300 text-left cursor-pointer"
                onClick={() => toast.success(`Viewing policy details of: ${item.title}`)}
              >
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${item.color}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <h4 className="text-sm font-black text-gray-900 leading-tight">
                    {item.title}
                  </h4>
                  <p className="text-[11px] text-gray-400 font-bold leading-normal mt-1">
                    {item.desc}
                  </p>
                  <span className="inline-flex items-center gap-0.5 text-[10px] font-extrabold text-[#FF5B00] hover:text-[#E8500A] uppercase tracking-wider mt-2.5">
                    <span>{item.linkText}</span>
                    <ChevronRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 8. GRID OF THREE PANELS (Why Samsung? / Creator reviews / News & Stories) */}
      <section id="reviews-section" className="max-w-[1440px] mx-auto w-full px-4 md:px-10 mb-10 text-left">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          
          {/* Panel 1: Why Choose Samsung */}
          <div className="lg:col-span-3 bg-white border border-gray-150 rounded-3xl p-6 flex flex-col justify-between shadow-sm">
            <div>
              <h3 className="text-base font-black text-gray-900 uppercase tracking-tight pb-3 border-b border-gray-150">
                Why Choose Samsung?
              </h3>

              <div className="flex flex-col gap-5 mt-5">
                {[
                  { title: "Global Technology Leader", desc: "Pioneering innovation across mobile, TV, home appliances and more.", icon: Sparkles, iconCol: "text-blue-500 bg-blue-50" },
                  { title: "Trusted by Millions", desc: "#1 most trusted brand in Bangladesh and worldwide.", icon: Award, iconCol: "text-[#FF5B00] bg-orange-50" },
                  { title: "Built for the Future", desc: "Sustainable innovation for a better tomorrow.", icon: ShieldCheck, iconCol: "text-emerald-500 bg-emerald-50" }
                ].map((item, idx) => {
                  const ItemIcon = item.icon;
                  return (
                    <div key={idx} className="flex gap-3.5">
                      <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${item.iconCol}`}>
                        <ItemIcon className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-xs font-black text-gray-900 leading-tight">
                          {item.title}
                        </h4>
                        <p className="text-[10px] text-gray-400 font-bold mt-1 leading-normal">
                          {item.desc}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <button 
              onClick={() => toast.success("Opening Samsung Global Info...")}
              className="w-full py-3.5 bg-gray-50 border border-gray-100 hover:bg-gray-100 hover:border-gray-200 text-[#FF5B00] font-black rounded-xl text-[10px] uppercase tracking-widest transition-all duration-200 cursor-pointer text-center"
            >
              Discover Samsung
            </button>
          </div>

          {/* Panel 2: Creator Reviews (Interactive sliding panel) */}
          <div className="lg:col-span-5 bg-white border border-gray-150 rounded-3xl p-6 flex flex-col justify-between shadow-sm relative overflow-hidden">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-gray-150">
                <h3 className="text-base font-black text-gray-900 uppercase tracking-tight">
                  Creator Reviews
                </h3>
                <button 
                  onClick={() => toast.success("Opening reviews analytics panel...")}
                  className="text-[10px] font-black text-[#FF5B00] hover:text-[#E8500A] uppercase tracking-wider"
                >
                  View All Reviews &gt;
                </button>
              </div>

              {/* Big Score Header */}
              <div className="flex gap-6 items-start mt-4 mb-5 pb-5 border-b border-gray-100">
                <div className="text-left">
                  <div className="text-4xl font-black text-gray-900 tracking-tight leading-none">4.8</div>
                  <div className="flex items-center gap-0.5 text-amber-400 mt-2">
                    <Star className="w-3.5 h-3.5 fill-current" />
                    <Star className="w-3.5 h-3.5 fill-current" />
                    <Star className="w-3.5 h-3.5 fill-current" />
                    <Star className="w-3.5 h-3.5 fill-current" />
                    <Star className="w-3.5 h-3.5 fill-current" />
                  </div>
                  <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mt-2">
                    12.4K Reviews
                  </div>
                </div>

                {/* Vertical Divider */}
                <div className="w-px h-16 bg-gray-150"></div>

                {/* Small Rating Bars */}
                <div className="flex-1 flex flex-col gap-1.5">
                  {ratingDistribution.map((r, index) => (
                    <div key={index} className="flex items-center gap-2 text-[10px] font-bold text-gray-400">
                      <span className="w-2 text-right">{r.stars}</span>
                      <Star className="w-2.5 h-2.5 fill-current text-amber-400" />
                      <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full bg-amber-400" style={{ width: `${r.percent}%` }}></div>
                      </div>
                      <span className="w-7 text-right">{r.count}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* active Creator review box */}
              <div className="min-h-[140px]">
                <AnimatePresence mode="wait">
                  <motion.div 
                    key={currentCreatorReviewIdx}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="text-left"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full overflow-hidden border border-gray-100 bg-gray-50">
                        <img 
                          src={CREATOR_REVIEWS[currentCreatorReviewIdx].avatar} 
                          alt={CREATOR_REVIEWS[currentCreatorReviewIdx].author} 
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-xs font-black text-gray-900">
                            {CREATOR_REVIEWS[currentCreatorReviewIdx].author}
                          </h4>
                          <span className="px-1.5 py-0.5 bg-emerald-500/10 text-emerald-600 rounded text-[8px] font-extrabold uppercase tracking-wide">
                            {CREATOR_REVIEWS[currentCreatorReviewIdx].role}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <div className="flex text-amber-400">
                            {Array.from({ length: CREATOR_REVIEWS[currentCreatorReviewIdx].rating }).map((_, i) => (
                              <Star key={i} className="w-2.5 h-2.5 fill-current" />
                            ))}
                          </div>
                          <span className="text-[10px] text-gray-400 font-bold">{CREATOR_REVIEWS[currentCreatorReviewIdx].timeAgo}</span>
                        </div>
                      </div>
                    </div>

                    <p className="text-[11.5px] text-gray-500 font-medium leading-relaxed italic mt-3">
                      "{CREATOR_REVIEWS[currentCreatorReviewIdx].comment}"
                    </p>
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>

            {/* Slider navigation controls */}
            <div className="flex items-center justify-between border-t border-gray-100 pt-4 mt-4">
              <div className="flex gap-1.5">
                {CREATOR_REVIEWS.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentCreatorReviewIdx(i)}
                    className={`h-2 rounded-full transition-all cursor-pointer ${
                      i === currentCreatorReviewIdx ? "w-5 bg-[#FF5B00]" : "w-2 bg-gray-200"
                    }`}
                  />
                ))}
              </div>

              <div className="flex items-center gap-1.5">
                <button 
                  onClick={() => handleReviewHelpful(String(currentCreatorReviewIdx), true)}
                  className="px-3 py-1.5 rounded-lg border border-gray-150 bg-gray-50 hover:bg-gray-100 text-gray-500 hover:text-gray-800 text-[10px] font-bold flex items-center gap-1 cursor-pointer"
                >
                  <ThumbsUp className="w-3 h-3" />
                  <span>Helpful ({creatorReviewLikes[currentCreatorReviewIdx] || 0})</span>
                </button>

                <div className="flex gap-1">
                  <button 
                    onClick={() => setCurrentCreatorReviewIdx(prev => (prev - 1 + CREATOR_REVIEWS.length) % CREATOR_REVIEWS.length)}
                    className="w-7 h-7 rounded-lg border border-gray-150 bg-white hover:bg-gray-50 flex items-center justify-center text-gray-400 hover:text-gray-800 cursor-pointer"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => setCurrentCreatorReviewIdx(prev => (prev + 1) % CREATOR_REVIEWS.length)}
                    className="w-7 h-7 rounded-lg border border-gray-150 bg-white hover:bg-gray-50 flex items-center justify-center text-gray-400 hover:text-gray-800 cursor-pointer"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

          </div>

          {/* Panel 3: News & Stories */}
          <div id="news-stories-section" className="lg:col-span-4 bg-white border border-gray-150 rounded-3xl p-6 flex flex-col justify-between shadow-sm">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-gray-150">
                <h3 className="text-base font-black text-gray-900 uppercase tracking-tight">
                  Latest News & Stories
                </h3>
                <button 
                  onClick={() => toast.success("Redirecting to blog/stories section...")}
                  className="text-[10px] font-black text-[#FF5B00] hover:text-[#E8500A] uppercase tracking-wider"
                >
                  View All &gt;
                </button>
              </div>

              {/* News Rows list */}
              <div className="flex flex-col gap-4 mt-4">
                {NEWS_STORIES.map((news, idx) => (
                  <div 
                    key={idx}
                    onClick={() => toast.success(`Opening news article: ${news.title}`)}
                    className="flex gap-3.5 items-center group cursor-pointer border-b border-gray-100 last:border-b-0 pb-4 last:pb-0"
                  >
                    {/* Left side preview */}
                    <div className="w-16 h-16 bg-gray-50 border border-gray-100 rounded-xl overflow-hidden shrink-0 flex items-center justify-center relative">
                      <img 
                        src={news.image} 
                        alt="News thumb" 
                        className="w-full h-full object-cover transition-transform group-hover:scale-105"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    
                    {/* Right side content */}
                    <div className="min-w-0 flex-1 text-left">
                      <span className="text-[8px] font-extrabold text-[#FF5B00] bg-orange-50 border border-orange-100 px-2 py-0.5 rounded uppercase tracking-wider">
                        {news.category}
                      </span>
                      <h4 className="text-xs font-black text-gray-900 tracking-tight leading-snug line-clamp-2 mt-1.5 group-hover:text-[#FF5B00] transition-colors">
                        {news.title}
                      </h4>
                      <p className="text-[10px] text-gray-400 font-semibold mt-1">
                        {news.date}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <button 
              onClick={() => toast.success("Subscribing to newsletter feeds...")}
              className="w-full py-3.5 bg-[#0B0C23] hover:bg-[#FF5B00] text-white font-black rounded-xl text-[10px] uppercase tracking-widest transition-all duration-300 shadow-sm cursor-pointer border-0 mt-5"
            >
              Subscribe To News Updates
            </button>
          </div>

        </div>
      </section>

      {/* 9. BRAND OVERVIEW DETAILS GRID PANEL */}
      <section id="guides-section" className="max-w-[1440px] mx-auto w-full px-4 md:px-10 mb-10 text-left">
        <div className="bg-white border border-gray-150 rounded-3xl p-6 md:p-8 shadow-sm">
          <h3 className="text-lg font-black text-gray-900 uppercase tracking-tight pb-3.5 border-b border-gray-150 mb-6">
            Brand Overview
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-6">
            
            {/* Box A: About Samsung */}
            <div className="flex flex-col justify-between">
              <div>
                <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-3">
                  About Samsung
                </h4>
                <p className="text-[13px] text-gray-500 font-bold leading-relaxed mb-4">
                  Samsung inspires the world and shapes the future with transformative ideas and technologies. From smartphones and TVs to home appliances and semiconductors, Samsung is committed to creating a better world through innovation and sustainability.
                </p>
              </div>
              <button 
                onClick={() => toast.success("Loading full Samsung brand history...")}
                className="inline-flex items-center gap-1.5 text-xs font-black text-[#FF5B00] hover:text-[#E8500A] uppercase tracking-wider mt-2 cursor-pointer self-start"
              >
                <span>Learn More About Samsung</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Box B: Contact information */}
            <div className="flex flex-col gap-4 bg-gray-50/50 p-5 rounded-2xl border border-gray-100">
              <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none border-b border-gray-200/60 pb-2.5 flex items-center gap-2">
                <Globe className="w-3.5 h-3.5" />
                <span>Contact Information</span>
              </h4>

              <div className="flex flex-col gap-3.5 text-xs font-bold text-gray-600 mt-1">
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Email</span>
                  <a href="mailto:support@samsung.com" className="text-gray-900 hover:text-[#FF5B00] transition-colors font-extrabold">
                    support@samsung.com
                  </a>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Website</span>
                  <a href="https://www.samsung.com" target="_blank" rel="noreferrer" className="text-gray-900 hover:text-[#FF5B00] transition-colors font-extrabold flex items-center gap-1">
                    <span>www.samsung.com</span>
                    <ExternalLink className="w-3 h-3 text-gray-400" />
                  </a>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Phone</span>
                  <span className="text-gray-900 font-extrabold">09613-726726</span>
                </div>
              </div>
            </div>

            {/* Box C: Price & Audience Info */}
            <div className="flex flex-col gap-4 bg-gray-50/50 p-5 rounded-2xl border border-gray-100">
              <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none border-b border-gray-200/60 pb-2.5 flex items-center gap-2">
                <Award className="w-3.5 h-3.5" />
                <span>Price & Audience</span>
              </h4>

              <div className="flex flex-col gap-3 text-xs font-bold text-gray-600 mt-1">
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Brand Level</span>
                  <div className="flex text-amber-500 gap-0.5">
                    <Star className="w-3.5 h-3.5 fill-current" />
                    <Star className="w-3.5 h-3.5 fill-current" />
                    <Star className="w-3.5 h-3.5 fill-current" />
                    <Star className="w-3.5 h-3.5 fill-current" />
                    <Star className="w-3.5 h-3.5 fill-current" />
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Price Range</span>
                  <span className="text-gray-900 font-extrabold">BDT 5,000 - 199,000</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Audience Focus</span>
                  <span className="text-gray-900 font-extrabold">All Demographics</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Focus Segments</span>
                  <span className="text-gray-900 font-extrabold uppercase text-[10px]">Tech Enthusiasts, Professionals</span>
                </div>
              </div>
            </div>

          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-6 border-t border-gray-150">
            
            {/* Box D: Shop Address & Links */}
            <div className="flex flex-col gap-3">
              <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-[#FF5B00]" />
                <span>Shop Address & Links</span>
              </h4>
              <p className="text-[12px] text-gray-600 font-bold leading-relaxed mt-1">
                Samsung Electronics Bangladesh, Level 12, Bashundhara R/A, Dhaka 1229 Bangladesh.
              </p>
              <button 
                onClick={() => toast.success("Opening shop address map guide...")}
                className="inline-flex items-center gap-1.5 text-xs font-black text-[#FF5B00] hover:text-[#E8500A] uppercase tracking-wider mt-2 cursor-pointer self-start"
              >
                <span>View On Map</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Box E: Services & Specialties */}
            <div className="flex flex-col gap-3">
              <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none flex items-center gap-2">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                <span>Services & Specialties</span>
              </h4>
              <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-[11px] font-extrabold text-gray-600 mt-2">
                {[
                  "1 Year Brand Warranty",
                  "Official Product Warranty",
                  "Genuine Product Guarantee",
                  "After Sales Support",
                  "Doorstep Service",
                  "Easy EMI & Bank Installments"
                ].map((serv, i) => (
                  <div key={i} className="flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-emerald-500 stroke-[3px] shrink-0" />
                    <span>{serv}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Box F: Best For category pills */}
            <div className="flex flex-col gap-3">
              <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none flex items-center gap-2">
                <Star className="w-3.5 h-3.5 text-amber-500" />
                <span>Best For</span>
              </h4>
              <div className="flex flex-wrap gap-2 mt-2">
                {[
                  "Smartphones",
                  "Televisions",
                  "Home Appliances",
                  "Wearables",
                  "Audio",
                  "Accessories",
                  "Gaming",
                  "Home Entertainment"
                ].map((tag, idx) => (
                  <span 
                    key={idx}
                    className="px-3 py-1.5 bg-gray-50 hover:bg-gray-100 border border-gray-150 rounded-lg text-[9px] font-black text-gray-500 hover:text-[#FF5B00] transition-colors uppercase tracking-wider cursor-pointer"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

          </div>

          {/* Bottom verified sourcing row */}
          <div className="mt-8 pt-5 border-t border-gray-100 flex items-center gap-3 bg-emerald-500/5 rounded-2xl p-4 border border-emerald-500/10 text-left">
            <div className="w-7 h-7 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0 shadow-xs">
              <Check className="w-4 h-4 stroke-[3px]" />
            </div>
            <div>
              <h4 className="text-xs font-black text-emerald-800 uppercase tracking-tight">Verified Sourcing</h4>
              <p className="text-[11px] text-emerald-600 font-bold mt-1">
                Each Samsung product is verified against official brand catalogs. Real assurance, checked & re-verified for authenticity, safety, and quality.
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* 10. PUBLIC REVIEWS ROW (Tanvir Hasan & Nusrat Jahan) */}
      <section className="max-w-[1440px] mx-auto w-full px-4 md:px-10 mb-10 text-left">
        <div className="flex items-center justify-between mb-6 border-b border-gray-150 pb-3.5">
          <div>
            <h3 className="text-xl font-black text-gray-900 uppercase tracking-tight">
              Public Reviews
            </h3>
            <p className="text-[11px] font-extrabold text-gray-400 uppercase tracking-widest mt-1">
              Feedback from certified Samsung device owners
            </p>
          </div>
          <button 
            onClick={() => toast.success("Opening public reviews catalog...")}
            className="text-xs font-black text-[#FF5B00] hover:text-[#E8500A] transition-colors uppercase tracking-widest flex items-center gap-1 group"
          >
            <span>View all reviews</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>

        {/* Double Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {PUBLIC_REVIEWS.map((review) => (
            <div 
              key={review.id}
              className="bg-white border border-gray-150 rounded-3xl p-6 hover:shadow-md transition-all duration-300 text-left flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between border-b border-gray-100 pb-4 mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-full overflow-hidden border border-gray-150 bg-gray-50">
                      <img 
                        src={review.avatar} 
                        alt={review.author} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <h4 className="text-xs font-black text-gray-900 leading-none">
                          {review.author}
                        </h4>
                        <span className="px-1.5 py-0.5 bg-blue-500/10 text-blue-600 rounded text-[8px] font-extrabold uppercase tracking-wide">
                          Verified Buyer
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 mt-1">
                        <span className="text-[10px] font-bold text-[#FF5B00] uppercase tracking-wide">Reviewing:</span>
                        <span className="text-[10px] text-gray-500 font-extrabold truncate max-w-[150px]">{review.product}</span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="flex text-amber-400 gap-0.5">
                      {Array.from({ length: review.rating }).map((_, i) => (
                        <Star key={i} className="w-3 h-3 fill-current" />
                      ))}
                    </div>
                    <span className="text-[10px] text-gray-400 font-bold mt-1.5 block">
                      {review.timeAgo}
                    </span>
                  </div>
                </div>

                <p className="text-[12px] text-gray-500 font-bold leading-relaxed italic">
                  "{review.comment}"
                </p>
              </div>

              {/* Helpful footer */}
              <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between">
                <button 
                  onClick={() => handleReviewHelpful(review.id)}
                  className={`px-4 py-1.5 rounded-lg border text-[11px] font-black uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer ${
                    votedPublicReviews.includes(review.id)
                      ? "bg-[#FF5B00]/5 border-[#FF5B00]/20 text-[#FF5B00]"
                      : "bg-gray-50 border-gray-200 text-gray-400 hover:text-gray-800"
                  }`}
                >
                  <ThumbsUp className="w-3.5 h-3.5" />
                  <span>Helpful ({review.helpfulCount + (publicReviewLikes[review.id] || 0)})</span>
                </button>

                <span className="text-[10px] font-bold text-gray-400 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Purchase Verified</span>
                </span>
              </div>

            </div>
          ))}
        </div>
      </section>

      {/* 11. TRUST STATEMENT STATEMENT BANNER */}
      <section className="max-w-[1440px] mx-auto w-full px-4 md:px-10 mb-10 shrink-0">
        <div className="bg-[#0D0B26] border border-white/5 rounded-2xl py-6 px-8 flex flex-col sm:flex-row items-center justify-center gap-4 text-center sm:text-left shadow-lg">
          <div className="w-10 h-10 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0 shadow-lg shadow-emerald-500/20">
            <ShieldCheck className="w-5 h-5 stroke-[2.5px]" />
          </div>
          <div>
            <h4 className="text-sm font-black text-white uppercase tracking-wider">
              Choosify.bd Trust Statement
            </h4>
            <p className="text-xs text-gray-400 italic mt-1 font-semibold">
              "Only verified sellers and completely unbiased, authentic brand experiences are list on Choosify."
            </p>
          </div>
        </div>
      </section>

      {/* 12. SIMILAR BRANDS COMPARISON TABLE */}
      <section className="max-w-[1440px] mx-auto w-full px-4 md:px-10 mb-10 text-left">
        <h3 className="text-lg font-black text-gray-900 uppercase tracking-tight pb-3.5 border-b border-gray-150 mb-6">
          Similar Brands Comparison
        </h3>

        <div className="bg-white border border-gray-150 rounded-3xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-150 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                  <th className="py-4 px-6">Brand Identity</th>
                  <th className="py-4 px-6">Quality</th>
                  <th className="py-4 px-6">Price Range</th>
                  <th className="py-4 px-6">Rating</th>
                  <th className="py-4 px-6 text-right">Compare</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-xs font-bold text-gray-600">
                {SIMILAR_BRANDS.map((brand, idx) => (
                  <tr key={idx} className="hover:bg-gray-50/50 transition-colors">
                    <td className="py-4 px-6 flex items-center gap-3">
                      {/* Circle letter icon */}
                      <div className="w-8 h-8 rounded-full bg-gray-50 border border-gray-150 flex items-center justify-center text-gray-900 font-black">
                        {brand.name.substring(0, 1)}
                      </div>
                      <span className="text-sm font-black text-gray-900">{brand.name}</span>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`px-2 py-1.5 text-[9px] font-black rounded-lg uppercase tracking-wider ${
                        brand.quality === "PREMIUM" 
                          ? "bg-purple-50 text-purple-600 border border-purple-100" 
                          : "bg-blue-50 text-blue-600 border border-blue-100"
                      }`}>
                        {brand.quality}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <span className="text-gray-900 font-extrabold">{brand.price}</span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-1 font-extrabold text-amber-500">
                        <Star className="w-3.5 h-3.5 fill-current" />
                        <span>{brand.rating}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <button 
                        onClick={() => toast.success(`Comparing Samsung with ${brand.name}...`)}
                        className="px-4.5 py-2 bg-gray-50 hover:bg-[#FF5B00] hover:text-white border border-gray-150 hover:border-[#FF5B00] text-gray-500 font-black rounded-lg text-[10px] uppercase tracking-wider transition-all cursor-pointer"
                      >
                        Compare
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

    </div>
  );
}

// Simple Icon Fallbacks for Facebook/Instagram/Youtube
function FacebookIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  );
}

function InstagramIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  );
}

function YoutubeIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z" />
      <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" fill="currentColor" />
    </svg>
  );
}
