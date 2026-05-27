import React, { useState, useEffect, useRef } from 'react';
import { Search, Youtube, Star, ChevronDown, CheckCircle2, Bookmark, ChevronLeft, ChevronRight, Zap, TrendingUp, HelpCircle, AlertCircle, Share2, MessageCircle, BarChart3, Users, Play, Smartphone, Gift, Shirt, Info, Package, DollarSign, ShieldCheck, ThumbsUp, Heart } from 'lucide-react';
import { BRANDS, PRODUCTS } from '../constants';
import { ProductCard } from '../components/ProductCard';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';
import { useNavigate, Link, useParams } from 'react-router-dom';
import { useCarousel } from '../hooks/useCarousel';
import { ReportModal } from '../components/ReportModal';
import { useGlobalState } from '../context/GlobalStateContext';
import { toast } from 'react-hot-toast';

interface CustomIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number;
}

// Safe inline SVG Social Icons to prevent lucide-react compilation errors across different environments
const FacebookIcon = ({ size = 16, ...props }: CustomIconProps) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor" {...props}>
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);

const InstagramIcon = ({ size = 16, ...props }: CustomIconProps) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
);

const TikTokIcon = ({ size = 16, ...props }: CustomIconProps) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor" {...props}>
    <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.17-2.81-.74-3.94-1.69-.14-.12-.29-.26-.4-.39-.01 2.3-.01 4.6-.01 6.91-.01 1.63-.44 3.25-1.31 4.58-1.57 2.39-4.42 3.79-7.3 3.47-3.41-.37-6.23-3.23-6.52-6.66-.41-4.75 3.51-8.91 8.26-8.5v4.13c-2.11-.27-4.11 1.17-4.59 3.23-.59 2.5 1.11 5.09 3.63 5.4 2.11.26 4.14-1.07 4.63-3.11.09-.37.11-.75.11-1.13V0h-3.8z" />
  </svg>
);

export function BrandDetailPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { allBrands, allProducts, mode } = useGlobalState();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [isReportOpen, setIsReportOpen] = useState(false);
  const [isLoved, setIsLoved] = useState(false);
  const [isFollowed, setIsFollowed] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Dynamically resolve brand or fallback to Sailor/fashion-oriented layout
  // Check if find brand with id, otherwise look for Yellow, Aarong, Sailor, or use Apex (allBrands[2])
  const brand = allBrands.find(b => String(b.id) === id) || allBrands.find(b => b.name === 'Sailor') || allBrands[2];
  
  const brandProducts = allProducts.filter((p: any) => p.brandId === brand.id);
  const displaySuggestedProducts = brandProducts.length > 0 ? brandProducts.slice(0, 4) : allProducts.slice(0, 4);

  const [activeAccordionIndex, setActiveAccordionIndex] = useState(1);
  const [productLineIndex, setProductLineIndex] = useState(1);
  const [suggestedIndex, setSuggestedIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const isDraggingRef = useRef(false);

  const carouselItems = [
    { name: "Premium Comfort", category: "Classic Collection", img: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=1200&h=800&fit=crop" },
    { name: `${brand.name} Eid Collection`, category: "Modern Fit", img: "https://images.unsplash.com/photo-1512314889357-e157c22f938d?w=1200&h=800&fit=crop" },
    { name: "Royal Edition", category: "Luxury Series", img: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=1200&h=800&fit=crop" },
    { name: "Festive Spirit", category: "Seasonal Wear", img: "https://images.unsplash.com/photo-1511741454500-ddbf7ef33554?w=1200&h=800&fit=crop" }
  ];

  const productLineCarousel = useCarousel(carouselItems.length, 3500);
  const suggestedCarousel = useCarousel(3, 3000);

  const handleProductLineNext = () => setProductLineIndex((prev) => (prev + 1) % carouselItems.length);
  const handleProductLinePrev = () => setProductLineIndex((prev) => (prev - 1 + carouselItems.length) % carouselItems.length);

  const handleSuggestedNext = () => setSuggestedIndex((prev) => (prev + 1) % 4);
  const handleSuggestedPrev = () => setSuggestedIndex((prev) => (prev - 1 + 4) % 4);

  const dragStart = useRef<number | null>(null);
  
  const handleSuggestedPointerDown = (e: React.PointerEvent) => {
    dragStart.current = e.clientX;
    suggestedCarousel.pause();
  };
  
  const handleSuggestedPointerMove = (e: React.PointerEvent) => {
    if (dragStart.current !== null) {
      if (Math.abs(e.clientX - dragStart.current) > 5) {
        isDraggingRef.current = true;
        setIsDragging(true);
      }
    }
  };

  const handleSuggestedPointerUp = (e: React.PointerEvent) => {
    if (dragStart.current !== null) {
      const diff = e.clientX - dragStart.current;
      if (diff > 50) suggestedCarousel.prev();
      else if (diff < -50) suggestedCarousel.next();
    }
    dragStart.current = null;
    isDraggingRef.current = false;
    setIsDragging(false);
    suggestedCarousel.resume();
  };

  // Dynamic high-fidelity Brand Overview Resolver
  const getBrandOverviews = (brandName: string) => {
    const name = brandName.toLowerCase();
    
    if (name.includes('sailor') || name.includes('la reve') || name.includes('yellow') || name.includes('aarong') || name.includes('ethnic') || name.includes('fashion') || name.includes('apex') || name.includes('bata') || name.includes('lotto')) {
       return {
          address: "GRAND SHOPPING MALL, HOUSE 2, ROAD 2, SECTOR 92. 1500 - DHAKA BANGLADESH.",
          website: "www.website.com",
          map: "https://https://www.google.com/maps",
          email: "fashion@gmail.com",
          phone: "01234456789",
          priceRange: "BDT - 500",
          ageRange: "AGE: 12 - 40",
          audience: "MALE, FEMALE, YOUTH & KIDS",
          services: [
             "90 DAYS RETURN WITH REFUDN POLICY",
             "FULL COD ENTIRE BANGLADESH",
             "6 MONTHS WARRANTY ALL PRODUCT",
             "CUSTOM GIFT BOX AVAILABLE",
             "3 HOURS DELIVERY INSIDE DHAKA METRO",
             "ONLINE & OFFLINE ORDER FACILITIES."
          ],
          tags: ["#premium buyers", "#quality driven", "#ethnic wear", "#fashion", "#eid collection", "#trend setter", "#old money", "#summer collection", "#beach wear"]
       };
    }
    
    // Tech brand overview resolver for Samsung/Apple/Sony etc.
    return {
       address: "JAMUNA FUTURE PARK, LEVEL 4, SHOP 22B, DHAKA BANGLADESH.",
       website: `www.${name}.com.bd`,
       map: "https://www.google.com/maps",
       email: `support@${name}.com`,
       phone: "09612345678",
       priceRange: "BDT 5,000 - 150,000",
       ageRange: "AGE: 18 - 60",
       audience: "TECH ENTHUSIASTS, PROFESSIONALS",
       services: [
          "7 DAYS REPLACEMENT WARRANTY",
          "100% ORIGINAL PRODUCT GUARANTEE",
          "OFFICIAL BRAND WARRANTY",
          "EMI AVAILABLE UP TO 24 MONTHS",
          "EXPRESS HOME DELIVERY",
          "SECURE CARD & MOBILE PAYMENTS"
       ],
       tags: ["#tech", "#gadgets", "#original", "#official warranty", "#smart choice", "#power user", "#premium build", "#trending tech"]
    };
  };

  const overviewData = getBrandOverviews(brand.name);

  // Dynamic Popular Categories Previews mapping (Panjabi, Western, Suit or shoes/tech equivalent)
  const getPopularCategoryPreviews = () => {
    const cat = (brand.category || '').toLowerCase();
    const name = brand.name.toLowerCase();
    if (name.includes('sailor') || name.includes('la reve') || name.includes('yellow') || name.includes('aarong') || cat.includes('fashion') || cat.includes('lifestyle') || cat.includes('clothing') || cat.includes('ethnic')) {
      return [
        { label: 'PANJABI', img: 'https://images.unsplash.com/photo-1621184455862-c163dfb30e0f?w=400&h=600&fit=crop' },
        { label: 'SUIT', img: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=400&h=600&fit=crop' },
        { label: 'WESTERN', img: 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=400&h=600&fit=crop' }
      ];
    }
    if (cat.includes('shoe') || cat.includes('footwear') || name.includes('bata') || name.includes('apex') || name.includes('lotto')) {
      return [
        { label: 'CASUAL', img: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=600&fit=crop' },
        { label: 'SNEAKERS', img: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=400&h=600&fit=crop' },
        { label: 'FORMAL', img: 'https://images.unsplash.com/photo-1533867617858-e7b97e060509?w=400&h=600&fit=crop' }
      ];
    }
    // Tech & gadgets placeholder
    return [
      { label: 'MOBILES', img: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=600&fit=crop' },
      { label: 'GEAR', img: 'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=400&h=600&fit=crop' },
      { label: 'WEARABLES', img: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=400&h=600&fit=crop' }
    ];
  };

  const popularCats = getPopularCategoryPreviews();

  // Dynamic mappers for Brand Logo Graphics to look extremely premium and identical to physical look
  const renderBrandLogo = (brandObj: any) => {
    const term = brandObj.name.toLowerCase();
    if (term.includes('sailor')) {
      return (
        <div className="flex flex-col items-center justify-center h-full text-center bg-[#17192C] w-full text-white px-2 py-3 select-none">
          <span className="font-serif tracking-widest text-[24px] font-bold leading-none uppercase">sailor</span>
          <span className="text-[6px] tracking-[0.25em] font-mono text-gray-400 font-bold uppercase mt-1.5">by epyllion</span>
        </div>
      );
    }
    if (term.includes('apex')) {
      return (
        <div className="flex items-center justify-center h-full text-center bg-[#EB1C24] w-full text-white font-black italic tracking-tighter text-3xl select-none">
          apex
        </div>
      );
    }
    if (term.includes('bata')) {
      return (
        <div className="flex items-center justify-center h-full text-center bg-[#E60012] w-full text-white font-black text-4xl select-none">
          Bata
        </div>
      );
    }
    if (term.includes('aarong')) {
       return (
        <div className="flex flex-col items-center justify-center h-full text-center bg-[#AC1F24] w-full text-white px-2 py-2 select-none">
          <span className="font-serif tracking-widest text-[22px] font-extrabold leading-none uppercase">aarong</span>
        </div>
      );
    }
    if (term.includes('yellow')) {
       return (
        <div className="flex items-center justify-center h-full text-center bg-[#FFF100] w-full text-navy font-black text-3xl select-none">
          YELLOW
        </div>
      );
    }
    
    // Fallback standard render
    return (
      <div className="w-full h-full bg-gradient-to-br from-navy to-[#2A2E6B] flex items-center justify-center text-4xl font-extrabold text-white">
        {brandObj.logo || brandObj.name.substring(0, 2)}
      </div>
    );
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#EEF1F8]">
      
      {/* 1. Brand Hero Section */}
      <motion.section 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        style={{
          background: 'linear-gradient(135deg, #170E1A 0%, #11133A 50%, #191535 100%)'
        }}
        className="relative pt-10 pb-12 overflow-hidden border-b border-white/5"
      >
        <div className="absolute top-0 right-0 w-1/2 h-full opacity-10 blur-3xl pointer-events-none">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-orange-primary rounded-full translate-x-1/2 -translate-y-1/2" />
        </div>

        {/* Global Breadcrumbs in Hero Area */}
        <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10 w-full mb-6">
          <div className="flex items-center gap-1.5 text-white/40 text-[9px] font-black uppercase tracking-widest">
            <Link to="/" className="hover:text-white transition-colors">Home</Link>
            <ChevronRight size={10} className="text-white/20" />
            <Link to="/brands" className="hover:text-white transition-colors">Brands</Link>
            <ChevronRight size={10} className="text-white/20" />
            <span className="text-white">{brand.name}</span>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10 w-full">
            <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-center lg:items-start">
              
              {/* Left Side: Brand Profile Details */}
              <div className="flex-1 w-full text-center lg:text-left">
                 <div className="flex flex-col sm:flex-row items-center gap-6 mb-8 text-center sm:text-left">
                    
                    {/* Brand avatar container styled matching Sailor logo mockup */}
                    <div className="w-28 h-28 md:w-36 md:h-36 rounded-2xl bg-white overflow-hidden flex items-center justify-center shadow-2xl border-4 border-white relative shrink-0">
                       {renderBrandLogo(brand)}
                       <div className="absolute -top-1.5 -right-1.5 w-7 h-7 bg-[#E8500A] rounded-full flex items-center justify-center text-white border-2 border-[#10133A] shadow-lg">
                          <CheckCircle2 size={13} fill="currentColor" className="text-white stroke-[#E8500A]" />
                       </div>
                    </div>

                    <div className="flex-1">
                       <div className="flex flex-col sm:flex-row items-center gap-3 mb-2 flex-wrap justify-center sm:justify-start">
                          <h1 className="text-3xl md:text-5xl font-black text-white italic tracking-tighter leading-none">{brand.name}</h1>
                          <div className="bg-[#4DBC15] px-3 py-1 rounded-full flex items-center gap-2 shadow-md">
                             <ShieldCheck size={11} className="text-white" />
                             <span className="text-[9px] font-black text-white uppercase tracking-widest italic whitespace-nowrap">Verified Brand</span>
                          </div>
                       </div>
                       
                       <p className="text-[10px] md:text-[11px] font-extrabold text-[#E8500A]/90 uppercase tracking-[0.2em] mb-4">
                         {brand.category || 'Fashion & Clothing'}
                       </p>

                       <div className="flex items-center gap-5 flex-wrap justify-center sm:justify-start">
                          <div className="flex items-center gap-2">
                             <Heart size={14} className="text-[#E8500A] fill-current" />
                             <span className="text-white font-extrabold text-[10px] uppercase tracking-widest italic">50,000 Shoppers Loves The Brands</span>
                          </div>
                          <div className="h-4 w-px bg-white/10 hidden sm:block" />
                          <div className="flex items-center gap-2">
                             <TrendingUp size={14} className="text-green-accent" />
                             <span className="text-white font-extrabold text-[10px] uppercase tracking-widest italic">Score: 92/100</span>
                          </div>
                       </div>
                    </div>
                 </div>

                 {/* Action buttons inside landing board */}
                 <div className="flex flex-wrap gap-3.5 mb-8 justify-center sm:justify-start text-white">
                    <button 
                      onClick={() => setIsLoved(!isLoved)}
                      className={cn(
                        "text-[10px] md:text-[11px] font-black uppercase px-6 md:px-8 py-3.5 md:py-4.5 rounded-full tracking-wider shadow-xl transition-all transform hover:scale-105 active:scale-95 italic border flex items-center gap-2 cursor-pointer",
                        isLoved 
                          ? "bg-white text-[#E8500A] border-white shadow-white/5" 
                          : "bg-[#E8500A] text-white border-[#E8500A]/30 hover:bg-[#ff5d14]"
                      )}
                    >
                       <Heart size={14} className={cn("transition-colors", isLoved && "fill-current text-[#E8500A]")} />
                       {isLoved ? "Loved" : "Love Brand"}
                    </button>
                    
                    <button 
                      onClick={() => {
                        setIsFollowed(!isFollowed);
                        toast.success(isFollowed ? `Unfollowed ${brand.name}` : `Following ${brand.name} for exclusive drops!`);
                      }}
                      className={cn(
                        "text-[10px] md:text-[11px] font-black uppercase px-6 md:px-8 py-3.5 md:py-4.5 rounded-full tracking-wider transition-all transform hover:scale-105 active:scale-95 italic border cursor-pointer",
                        isFollowed
                          ? "bg-[#4DBC15] text-white border-[#4DBC15]" 
                          : "bg-white text-[#1A1D4E] border-white hover:bg-gray-50"
                      )}
                    >
                       {isFollowed ? "Following" : "Follow the Brand"}
                    </button>

                    <button 
                      onClick={() => {
                        const reviewSec = document.getElementById('public-reviews-section');
                        if (reviewSec) reviewSec.scrollIntoView({ behavior: 'smooth' });
                      }}
                      className="bg-transparent text-white border border-white/20 hover:bg-white/10 hover:border-white/40 text-[10px] md:text-[11px] font-black uppercase px-6 md:px-8 py-3.5 md:py-4.5 rounded-full tracking-wider transition-all italic"
                    >
                       Write a Review
                    </button>
                 </div>
                 
                 {/* Social Find Us On Container with customized logo buttons */}
                 <div className="flex items-center gap-4 mt-8 flex-wrap justify-center sm:justify-start">
                    <span className="text-white text-[10px] font-black uppercase tracking-widest border-b-2 border-[#E8500A] pb-1 italic">Find Us On</span>
                    <div className="flex items-center gap-5">
                      <a href="#" className="group flex flex-col items-center gap-1">
                         <div className="w-10 h-10 rounded-full border border-white/10 hover:border-white bg-white/5 group-hover:bg-[#1877F2] flex items-center justify-center text-white transition-all shadow-md">
                           <FacebookIcon size={15} />
                         </div>
                         <span className="text-[8px] font-bold text-gray-400 group-hover:text-white transition-colors tracking-wide">Facebook</span>
                      </a>
                      <a href="#" className="group flex flex-col items-center gap-1">
                         <div className="w-10 h-10 rounded-full border border-white/10 hover:border-white bg-white/5 group-hover:bg-[#C13584] flex items-center justify-center text-white transition-all shadow-md">
                           <InstagramIcon size={15} />
                         </div>
                         <span className="text-[8px] font-bold text-gray-400 group-hover:text-white transition-colors tracking-wide">Instagram</span>
                      </a>
                      <a href="#" className="group flex flex-col items-center gap-1">
                         <div className="w-10 h-10 rounded-full border border-white/10 hover:border-white bg-white/5 group-hover:bg-black flex items-center justify-center text-white transition-all shadow-md">
                           <TikTokIcon size={14} />
                         </div>
                         <span className="text-[8px] font-bold text-gray-400 group-hover:text-white transition-colors tracking-wide">TikTok</span>
                      </a>
                      <a href="#" className="group flex flex-col items-center gap-1">
                         <div className="w-10 h-10 rounded-full border border-white/10 hover:border-white bg-white/5 group-hover:bg-[#FF0000] flex items-center justify-center text-white transition-all shadow-md">
                           <Youtube size={15} />
                         </div>
                         <span className="text-[8px] font-bold text-gray-400 group-hover:text-white transition-colors tracking-wide">Youtube</span>
                      </a>
                    </div>
                 </div>
              </div>

              {/* Right Side: Score card and rating bars sidebar panel */}
              <div className="w-full lg:w-[420px] relative">
                 <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 text-white relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-[#E8500A]/10 blur-2xl rounded-full translate-x-1/3 -translate-y-1/3" />
                    
                    <div className="flex justify-between items-start mb-6">
                       <div>
                          <div className="text-[9px] font-black uppercase text-[#4DBC15] tracking-widest mb-0.5">Choosify Score</div>
                          <div className="text-5xl font-black italic">4.3 <span className="text-xl text-white/55">/5</span></div>
                       </div>
                       <div className="text-right">
                          <div className="flex gap-0.5 justify-end mb-1">
                             {[1, 2, 3, 4].map(i => <Star key={i} size={13} className="fill-[#E8500A] text-[#E8500A]" />)}
                             <Star size={13} className="text-white/20 fill-white/20" />
                          </div>
                          <div className="text-[9px] font-bold text-white/40 uppercase tracking-wider">Based on 500+ Reviews</div>
                       </div>
                    </div>

                    {/* Progress sliders matching mockup */}
                    <div className="space-y-3.5 mb-6">
                       {[
                          { label: "Quality", value: 85, color: "bg-[#E8500A]" },
                          { label: "Service", value: 90, color: "bg-[#4DBC15]" },
                          { label: "Value", value: 81, color: "bg-[#E8500A]" },
                          { label: "Delivery", value: 90, color: "bg-[#4DBC15]" },
                          { label: "Packaging", value: 75, color: "bg-[#4DBC15]" }
                       ].map((m, i) => (
                          <div key={i} className="flex items-center gap-3">
                             <div className="w-16 text-[9px] font-bold uppercase tracking-wider text-white/60">{m.label}</div>
                             <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
                                <motion.div 
                                  initial={{ width: 0 }}
                                  animate={{ width: `${m.value}%` }}
                                  transition={{ delay: 0.3, duration: 0.8 }}
                                  className={cn("h-full rounded-full", m.color)} 
                                />
                             </div>
                             <div className="w-8 text-[9px] font-black text-right text-white/80">{m.value}%</div>
                          </div>
                       ))}
                    </div>

                    {/* Recommend buyers board */}
                    <div className="flex items-center justify-between pt-5 border-t border-white/10">
                       <div className="text-center w-full">
                          <div className="text-4xl font-black text-[#50DC17] leading-none mb-1">85%</div>
                          <div className="text-[9px] font-black text-white/50 uppercase tracking-widest">Of Buyers Recommend This Brand</div>
                       </div>
                    </div>
                 </div>

                 {/* Floating Save/Share controls on bottom right */}
                 <div className="absolute -bottom-6 right-4 flex items-center gap-3 z-20">
                    <button 
                      onClick={() => {
                        navigator.clipboard.writeText(window.location.href);
                        toast.success("Page link copied to clipboard!");
                      }}
                      className="w-11 h-11 rounded-full bg-white text-[#1A1D4E] shadow-xl border border-gray-100 flex items-center justify-center hover:scale-110 active:scale-95 transition-all cursor-pointer hover:bg-gray-50"
                    >
                       <Share2 size={16} />
                    </button>
                    <button 
                      onClick={() => toast.success(`${brand.name} saved to your bookmarks!`)}
                      className="w-11 h-11 rounded-full bg-white text-[#1A1D4E] shadow-xl border border-gray-100 flex items-center justify-center hover:scale-110 active:scale-95 transition-all cursor-pointer hover:bg-gray-50"
                    >
                       <Bookmark size={15} />
                    </button>
                 </div>
              </div>

            </div>
        </div>
      </motion.section>

      {/* 2. Main 3-Column Layout */}
      <div className="max-w-[1700px] mx-auto px-6 py-10 w-full">
         <div className="grid grid-cols-1 lg:grid-cols-[250px_minmax(0,1fr)_250px] xl:grid-cols-[300px_minmax(0,1fr)_280px] gap-10 lg:gap-12 xl:gap-16 2xl:gap-24 items-start w-full">
            
            {/* LEFT COLUMN: BRAND OVERVIEW, POPULAR PRODUCTS */}
            <div className="flex flex-col gap-8 w-full lg:sticky lg:top-24 lg:h-[calc(100vh-120px)] lg:overflow-y-auto pb-10 pr-2 no-scrollbar">
               
               {/* A. Brand Overview Section */}
               <div id="brand-overview-panel" className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100/80">
                  <h3 className="text-lg font-black text-[#1A1D4E] tracking-tight uppercase border-b border-gray-100 pb-3 mb-5 flex items-center gap-2">
                     <span className="w-1.5 h-4 bg-[#E8500A] rounded-full inline-block" />
                     Brand Overview
                  </h3>

                  <div className="space-y-6">
                     {/* Address */}
                     <div className="group">
                        <div className="flex items-center gap-2.5 mb-1.5">
                           <div className="w-6 h-6 rounded-lg bg-[#E8500A]/10 text-[#E8500A] flex items-center justify-center">
                              <CheckCircle2 size={13} fill="currentColor" className="text-[#E8500A] stroke-white" />
                           </div>
                           <h4 className="text-[11px] font-black text-[#1A1D4E] uppercase tracking-wider">Shop Address & Links</h4>
                        </div>
                        <div className="pl-8 text-xs text-gray-500 font-bold leading-relaxed space-y-1.5">
                           <p className="uppercase">{overviewData.address}</p>
                           <div>
                              <span className="text-[#E8500A] font-black">WEBSITE:</span>{' '}
                              <a href={`https://${overviewData.website}`} target="_blank" rel="noopener noreferrer" className="hover:underline text-[#1A1D4E]">
                                 {overviewData.website}
                              </a>
                           </div>
                           <div>
                              <span className="text-[#E8500A] font-black">MAP:</span>{' '}
                              <a href={overviewData.map} target="_blank" rel="noopener noreferrer" className="hover:underline text-[#1A1D4E] truncate block max-w-full">
                                 {overviewData.map}
                              </a>
                           </div>
                        </div>
                     </div>

                     {/* Contact */}
                     <div className="group">
                        <div className="flex items-center gap-2.5 mb-1.5">
                           <div className="w-6 h-6 rounded-lg bg-[#E8500A]/10 text-[#E8500A] flex items-center justify-center">
                              <CheckCircle2 size={13} fill="currentColor" className="text-[#E8500A] stroke-white" />
                           </div>
                           <h4 className="text-[11px] font-black text-[#1A1D4E] uppercase tracking-wider">Contact Informations</h4>
                        </div>
                        <div className="pl-8 text-xs text-gray-500 font-bold space-y-1">
                           <p className="truncate"><span className="text-[#1A1D4E] font-black">EMAIL:</span> {overviewData.email}</p>
                           <p><span className="text-[#1A1D4E] font-black">PHONE:</span> {overviewData.phone}</p>
                        </div>
                     </div>

                     {/* Price & Audience */}
                     <div className="group">
                        <div className="flex items-center gap-2.5 mb-1.5">
                           <div className="w-6 h-6 rounded-lg bg-[#E8500A]/10 text-[#E8500A] flex items-center justify-center">
                              <CheckCircle2 size={13} fill="currentColor" className="text-[#E8500A] stroke-white" />
                           </div>
                           <h4 className="text-[11px] font-black text-[#1A1D4E] uppercase tracking-wider">Price Range & Audience</h4>
                        </div>
                        <div className="pl-8 text-xs text-gray-500 font-bold space-y-1">
                           <p><span className="text-[#1A1D4E] font-black">BDT</span> - {overviewData.priceRange.replace('BDT - ', '')}</p>
                           <p>{overviewData.ageRange}</p>
                           <p className="uppercase">{overviewData.audience}</p>
                        </div>
                     </div>

                     {/* Services & Specialties */}
                     <div className="group">
                        <div className="flex items-center gap-2.5 mb-1.5">
                           <div className="w-6 h-6 rounded-lg bg-[#E8500A]/10 text-[#E8500A] flex items-center justify-center">
                              <CheckCircle2 size={13} fill="currentColor" className="text-[#E8500A] stroke-white" />
                           </div>
                           <h4 className="text-[11px] font-black text-[#1A1D4E] uppercase tracking-wider">Services & Specialties</h4>
                        </div>
                        <ul className="pl-8 space-y-1.5">
                           {overviewData.services.map((srv, idx) => (
                              <li key={idx} className="text-[10px] text-gray-500 font-bold uppercase tracking-wide flex items-start gap-1.5">
                                 <span className="text-[#E8500A] text-xs leading-none">•</span>
                                 <span>{srv}</span>
                              </li>
                           ))}
                        </ul>
                     </div>

                     {/* Tags */}
                     <div className="group">
                        <div className="flex items-center gap-2.5 mb-2.5">
                           <div className="w-6 h-6 rounded-lg bg-[#E8500A]/10 text-[#E8500A] flex items-center justify-center">
                              <CheckCircle2 size={13} fill="currentColor" className="text-[#E8500A] stroke-white" />
                           </div>
                           <h4 className="text-[11px] font-black text-[#1A1D4E] uppercase tracking-wider">Best For #Tags</h4>
                        </div>
                        <div className="pl-8 flex flex-wrap gap-1.5">
                           {overviewData.tags.map((tag, idx) => (
                              <span key={idx} className="text-[9px] font-black text-[#E8500A] bg-[#FFF0E8] px-2.5 py-1 rounded-full uppercase tracking-wider border border-[#E8500A]/5 select-none">
                                 {tag}
                              </span>
                           ))}
                        </div>
                     </div>
                  </div>
               </div>

               {/* B. Popular Products Section */}
               <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100/80">
                  <div className="flex justify-between items-center mb-5 border-b border-gray-100 pb-3">
                     <h3 className="text-sm font-black text-[#1A1D4E] uppercase tracking-tight flex items-center gap-2">
                        <span className="w-1.5 h-4 bg-[#E8500A] rounded-full inline-block" />
                        Popular Products
                     </h3>
                     <Link to="/products" className="text-[9px] font-black text-[#E8500A] uppercase tracking-wider hover:underline">See All</Link>
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                     {popularCats.map((cat, idx) => (
                        <div key={idx} className="flex flex-col items-center group cursor-pointer" onClick={() => navigate('/products')}>
                           <div className="w-full aspect-[2/3] rounded-xl overflow-hidden relative border border-gray-100 shadow-sm mb-2 group-hover:shadow-md transition-all">
                              <img src={cat.img} alt={cat.label} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                              <div className="absolute inset-0 bg-navy/10 group-hover:bg-transparent transition-colors" />
                           </div>
                           <span className="text-[9px] font-black text-[#1A1D4E] tracking-wider uppercase text-center group-hover:text-[#E8500A] transition-colors">
                              {cat.label}
                           </span>
                        </div>
                     ))}
                  </div>
               </div>

            </div>

            {/* CENTER Feed: PRODUCTS, REVIEW CARDS, COMPARISON TABLE */}
            <div className="flex flex-col gap-8 w-full min-w-0 lg:sticky lg:top-24 lg:h-[calc(100vh-120px)] lg:overflow-y-auto pb-10 pr-2">
               
               {/* A. Product Line Carousel Grid (Accordion style preserved) */}
               <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-gray-100/80">
                  <div className="flex justify-between items-center mb-6">
                     <div>
                        <h2 className="text-xl md:text-2xl font-black text-[#1A1D4E] tracking-tight uppercase flex items-center gap-2">
                           <span className="w-1.5 h-5 bg-[#E8500A] rounded-full inline-block" />
                           Product Line
                        </h2>
                     </div>
                     <Link to={`/brands/${brand.id}/products`} className="text-[10px] font-black text-[#E8500A] hover:underline uppercase tracking-wider">Browse All Product</Link>
                  </div>

                  {/* Interactive accordions section */}
                  <div className="flex flex-col md:flex-row gap-3.5 h-[340px] md:h-[460px] overflow-hidden w-full">
                     {carouselItems.map((item, idx) => {
                        const isActive = idx === productLineIndex;
                        return (
                           <motion.div
                             key={idx}
                             onClick={() => setProductLineIndex(idx)}
                             initial={false}
                             animate={{
                               width: isActive ? (isMobile ? '100%' : '60%') : (isMobile ? '0%' : '13%'),
                               flex: isActive ? 10 : 1,
                               opacity: isActive ? 1 : 0.75,
                             }}
                             transition={{
                               type: "spring",
                               stiffness: 85,
                               damping: 17
                             }}
                             className={cn(
                               "relative h-full rounded-2xl overflow-hidden cursor-pointer group",
                               !isActive && "hidden md:block"
                             )}
                           >
                             <img src={item.img} alt={item.name} className="w-full h-full object-cover transition-transform duration-[3s] group-hover:scale-105" />
                             <div className={cn(
                                "absolute inset-0 transition-opacity duration-700",
                                isActive ? "bg-gradient-to-t from-black/85 via-black/25 to-transparent" : "bg-black/35"
                             )} />

                             {/* Sideway labels for collapsed panels */}
                             {!isActive && (
                                <div className="absolute inset-x-0 bottom-12 flex justify-center translate-y-10 group-hover:translate-y-0 transition-transform">
                                   <span className="text-white/80 text-[10px] font-black uppercase tracking-[0.4em] italic origin-center rotate-[-90deg] whitespace-nowrap">
                                      {item.name}
                                   </span>
                                </div>
                             )}

                             {/* Full Title on active panels */}
                             {isActive && (
                                <motion.div 
                                  initial={{ opacity: 0, y: 15 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  transition={{ delay: 0.2 }}
                                  className="absolute inset-0 p-8 flex flex-col justify-end items-start"
                                >
                                   <span className="text-[8px] font-black text-white/60 uppercase tracking-[0.3em] mb-1 italic">{item.category}</span>
                                   <h3 className="text-3xl md:text-4xl font-black text-white italic tracking-tighter uppercase leading-none">
                                      {item.name}
                                   </h3>
                                </motion.div>
                             )}
                           </motion.div>
                        );
                     })}
                  </div>

                  {/* Accordion Carousel buttons and paginations */}
                  <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                     <div className="flex gap-2.5">
                        {carouselItems.map((_, idx) => (
                           <button
                             key={idx}
                             onClick={() => setProductLineIndex(idx)}
                             className={cn(
                               "h-1.5 transition-all duration-300 rounded-full",
                               productLineIndex === idx ? "w-10 bg-[#E8500A]" : "w-2 bg-gray-200 hover:bg-gray-300"
                             )}
                           />
                        ))}
                     </div>
                     
                     <div className="flex gap-3">
                        <button onClick={handleProductLinePrev} className="w-10 h-10 rounded-full border border-gray-100 flex items-center justify-center hover:bg-gray-50 bg-white transition-all active:scale-95 shadow-sm cursor-pointer">
                           <ChevronLeft size={18} className="text-[#1A1D4E]" />
                        </button>
                        <button onClick={handleProductLineNext} className="w-10 h-10 rounded-full border border-gray-100 flex items-center justify-center hover:bg-gray-50 bg-white transition-all active:scale-95 shadow-sm cursor-pointer">
                           <ChevronRight size={18} className="text-[#1A1D4E]" />
                        </button>
                     </div>
                  </div>

                  {/* Primary browse all button below */}
                  <div className="mt-8 border-t border-gray-50 pt-6 flex justify-center">
                     <Link 
                       to={`/brands/${brand.id}/products`}
                       className="bg-[#E8500A] hover:bg-[#ff5d14] text-white text-xs font-black uppercase tracking-[0.2em] px-8 py-4 rounded-full shadow-lg transition-transform transform hover:scale-[1.03] active:scale-[0.97] italic inline-flex items-center gap-2"
                     >
                        Browse All Product
                     </Link>
                  </div>
               </div>

               {/* B. Influencer & YouTuber Reviews section */}
               <div className="bg-[#0C0C16] rounded-3xl p-6 md:p-8 text-white relative overflow-hidden border border-white/5">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-[#E8500A]/5 blur-3xl pointer-events-none" />
                  
                  <div className="flex items-center gap-2 mb-4 bg-white/5 border border-white/10 rounded-full px-3 py-1 w-fit">
                     <Users size={12} className="text-[#E8500A]" />
                     <span className="text-[8px] font-black uppercase tracking-widest italic text-white/70">Creator Community</span>
                  </div>

                  <div className="mb-8">
                     <h3 className="text-xl md:text-2xl font-black italic uppercase tracking-tight mb-2">
                        Influencer & Youtuber Reviews
                     </h3>
                     <p className="text-[10px] uppercase tracking-[0.3em] font-black text-white/30 italic">
                        Trusted Experts Breaking Down {brand.name}
                     </p>
                  </div>

                  {/* Main YouTube Feature block */}
                  <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] rounded-2xl overflow-hidden border border-white/10 bg-white/5 backdrop-blur-md mb-8">
                     <div className="relative aspect-video lg:aspect-auto lg:h-[300px] group overflow-hidden">
                        <img 
                          src="https://images.unsplash.com/photo-1511119253457-36e78921865c?w=800&h=600&fit=crop" 
                          alt="Main Review" 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
                        />
                        <div className="absolute inset-0 bg-black/30" />
                        
                        <div className="absolute top-4 left-4">
                           <span className="bg-[#E8500A] text-white text-[8px] font-black px-3 py-1 rounded-full uppercase tracking-wider italic flex items-center gap-1.5 shadow-md">
                              <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" /> TRENDING NOW
                           </span>
                        </div>
                        
                        <button 
                          onClick={() => toast.success("Opening Video Review stream...")}
                          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full bg-red-600 flex items-center justify-center text-white shadow-2xl transform scale-100 group-hover:scale-110 transition-transform duration-300 cursor-pointer"
                        >
                           <Play size={20} className="fill-current ml-1" />
                        </button>
                        
                        <div className="absolute bottom-4 left-4 right-4 text-white">
                           <span className="text-[8px] tracking-widest uppercase text-white/50 block font-black mb-1">Creator Spotlight</span>
                           <h4 className="text-lg md:text-xl font-black italic tracking-tight">{brand.name} Special Edition</h4>
                        </div>
                     </div>

                     <div className="p-6 md:p-8 flex flex-col justify-center bg-white/5 backdrop-blur-md">
                        <span className="text-[9px] font-black text-[#E8500A] tracking-widest block uppercase mb-3 italic">IN-DEPTH REVIEW</span>
                        <h4 className="text-base md:text-lg font-black italic tracking-tight leading-snug mb-3">
                           Why {brand.name} remains a Top Choice in 2024!
                        </h4>
                        <p className="text-xs text-white/60 font-medium leading-relaxed mb-6">
                           Watch as we dive deep into the performance and build quality of {brand.name}'s latest collection. From real-world testing to expert material analysis.
                        </p>
                        
                        <div className="w-full h-px bg-white/10 mb-5" />
                        
                        <div className="flex items-center justify-between flex-wrap gap-4">
                           <div>
                              <div className="text-[10px] font-black text-white italic">{brand.name === 'Apex' ? 'Tech Review BD' : 'Style Talk BD'}</div>
                              <div className="text-[8px] font-black text-white/40 tracking-wider uppercase">Live from Dhaka</div>
                           </div>
                           <span className="text-[10px] font-black uppercase text-[#E8500A] tracking-widest bg-white/5 px-3 py-1.5 rounded border border-white/5 select-none">CHOOSIFY APPROVED</span>
                        </div>
                     </div>
                  </div>

                  {/* Reels & Other Reviews Container */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                     
                     {/* Reel Card */}
                     <div className="bg-white/5 rounded-2xl overflow-hidden border border-white/10 h-[280px] relative flex flex-col group">
                        <div className="absolute inset-0">
                           <img src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&h=800&fit=crop" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt="Style Reel" />
                           <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
                        </div>
                        
                        <div className="absolute top-3 left-3 bg-white/20 backdrop-blur-md rounded-full w-7 h-7 flex items-center justify-center text-white font-extrabold border border-white/10">
                           <Smartphone size={13} />
                        </div>
                        <div className="absolute top-3 right-3 bg-[#E8500A]/90 backdrop-blur-md rounded-full text-[7px] font-black px-2.5 py-1 uppercase tracking-wider text-white">
                           Product Reel
                        </div>

                        <div className="absolute top-[40%] left-1/2 -translate-x-1/2 w-10 h-10 rounded-full bg-red-600 shadow-xl opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transform scale-90 group-hover:scale-100 transition-all cursor-pointer">
                           <Play size={14} className="fill-current ml-0.5" />
                        </div>

                        <div className="mt-auto p-4 relative z-10">
                           <h5 className="text-sm font-black italic tracking-tight text-white mb-2 leading-tight">
                              {brand.name} Style Showcase
                           </h5>
                           <div className="flex items-center gap-2 justify-between border-t border-white/10 pt-2 text-[9px]">
                              <span className="text-white/60 font-black tracking-wider uppercase">@stylemaven</span>
                              <span className="text-white/40 font-bold">12K Views</span>
                           </div>
                        </div>
                     </div>

                     {/* Second Review Card */}
                     <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden flex flex-col group text-white">
                        <div className="relative h-28 overflow-hidden bg-black">
                           <img src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=300&fit=crop" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt="Apex Showcase" />
                           <div className="absolute inset-0 bg-black/10" />
                           <div className="absolute top-2.5 right-2.5 bg-black/40 backdrop-blur-md rounded-full w-7 h-7 flex items-center justify-center border border-white/10">
                              <Youtube size={14} className="text-red-600" />
                           </div>
                        </div>
                        <div className="p-4 flex-1 flex flex-col text-white">
                           <div className="flex items-center justify-between mb-2">
                              <div className="flex gap-0.5">
                                 {[1,2,3,4,5].map(i => <Star key={i} size={8} className="fill-[#E8500A] text-[#E8500A]" />)}
                              </div>
                              <span className="text-[7px] text-white/40 tracking-wider font-extrabold uppercase">AUTHENTIC</span>
                           </div>
                           <h5 className="text-xs font-black italic tracking-tight uppercase leading-snug mb-1.5">{brand.name} Collection review</h5>
                           <p className="text-[10px] text-white/50 leading-relaxed font-semibold italic mb-4">Testing durability and comfort on first wear of latest releases.</p>
                           
                           <div className="mt-auto pt-3 border-t border-white/5 flex items-center justify-between text-[9px] text-white/60">
                              <span className="font-extrabold">BD Tech Guys</span>
                              <span className="text-white/30">420K • 5.0</span>
                           </div>
                        </div>
                     </div>

                     {/* Third Review Card */}
                     <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden flex flex-col group text-white">
                        <div className="relative h-28 overflow-hidden bg-black">
                           <img src="https://images.unsplash.com/photo-1541643600914-78b084683601?w=400&h=300&fit=crop" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt="Perfume Showcase" />
                           <div className="absolute inset-0 bg-black/10" />
                           <div className="absolute top-2.5 right-2.5 bg-black/40 backdrop-blur-md rounded-full w-7 h-7 flex items-center justify-center border border-white/10">
                              <Youtube size={14} className="text-red-600" />
                           </div>
                        </div>
                        <div className="p-4 flex-1 flex flex-col text-white">
                           <div className="flex items-center justify-between mb-2">
                              <div className="flex gap-0.5">
                                 {[1,2,3,4].map(i => <Star key={i} size={8} className="fill-[#E8500A] text-[#E8500A]" />)}
                              </div>
                              <span className="text-[7px] text-white/40 tracking-wider font-extrabold uppercase">DEEP DIVE</span>
                           </div>
                           <h5 className="text-xs font-black italic tracking-tight uppercase leading-snug mb-1.5">Finding perfection in {brand.name}</h5>
                           <p className="text-[10px] text-white/50 leading-relaxed font-semibold italic mb-4">Exploring luxury and comfort and how to verify original tags.</p>
                           
                           <div className="mt-auto pt-3 border-t border-white/5 flex items-center justify-between text-[9px] text-white/60">
                              <span className="font-extrabold">Auntie Mirpur</span>
                              <span className="text-white/30">150K • 4.5</span>
                           </div>
                        </div>
                     </div>

                  </div>
               </div>

               {/* C. Public Reviews Customer Dashboard (ID matched to CTA) */}
               <div id="public-reviews-section" className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-gray-100/80">
                  <div className="text-center mb-8 border-b border-gray-100 pb-5">
                     <h3 className="text-xl md:text-2xl font-black text-[#1A1D4E] tracking-tight uppercase mb-2">
                        Public Reviews
                     </h3>
                     <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest italic bg-gray-50 border border-gray-100 rounded-full px-4 py-1.5 w-fit mx-auto">
                        Verified Customer Experiences
                     </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     {[
                        {
                           name: "Tanvir Hasan",
                           date: "2 weeks ago",
                           purchaseDate: "April 2024",
                           comment: `The material quality of the new ${brand.name} collection is absolutely top-notch. I was skeptical about the price but after wearing it once, I can say it's worth every taka. The fit is perfect.`,
                           rating: 5,
                           verified: true,
                           productImages: [
                              "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop",
                              "https://images.unsplash.com/photo-1541643600914-78b084683601?w=400&h=400&fit=crop"
                           ],
                           dp: "https://i.pravatar.cc/150?u=tanvir",
                           helpful: 124
                        },
                        {
                           name: "Nusrat Jahan",
                           date: "1 month ago",
                           purchaseDate: "March 2024",
                           comment: "Beautiful designs! I bought three different items and all of them were delivered on time. The online sizing chart was very accurate which was a relief. Highly recommend the collection.",
                           rating: 4.8,
                           verified: true,
                           productImages: [
                              "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400&h=400&fit=crop"
                           ],
                           dp: "https://i.pravatar.cc/150?u=nusrat",
                           helpful: 89
                        }
                     ].map((review, i) => (
                        <div key={i} className="bg-gray-50 border border-gray-100/50 rounded-2xl p-6 flex flex-col group hover:shadow-md transition-shadow duration-300">
                           <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
                              <div className="flex items-center gap-3">
                                 <div className="w-12 h-12 rounded-xl overflow-hidden border-2 border-[#E8500A] p-0.5">
                                    <img src={review.dp} className="w-full h-full object-cover rounded-lg" alt={review.name} />
                                 </div>
                                 <div>
                                    <div className="flex items-center gap-1.5 flex-wrap">
                                       <span className="font-extrabold text-[#1A1D4E] text-sm italic">{review.name}</span>
                                       {review.verified && (
                                          <span className="bg-[#4DBC15]/10 text-[#4DBC15] text-[7px] font-black uppercase px-1.5 py-0.5 rounded flex items-center gap-0.5">
                                             <CheckCircle2 size={8} className="text-[#4DBC15]" /> Verfied
                                          </span>
                                       )}
                                    </div>
                                    <span className="text-[8px] font-bold text-gray-400 uppercase tracking-wider block mt-0.5">Posted {review.date}</span>
                                 </div>
                              </div>
                              <div className="text-right">
                                 <div className="flex gap-0.5 justify-end">
                                    {[1, 2, 3, 4, 5].map(star => (
                                       <Star key={star} size={10} className={cn("fill-current", star <= review.rating ? "text-[#E8500A]" : "text-gray-200")} />
                                    ))}
                                 </div>
                                 <div className="text-sm font-black text-[#1A1D4E] mt-0.5 italic">{review.rating} <span className="text-[8px] text-gray-300 font-sans">/ 5</span></div>
                              </div>
                           </div>

                           {/* Media Files */}
                           <div className="flex gap-2 mb-4">
                              {review.productImages.map((img, j) => (
                                 <div key={j} className="w-16 h-16 rounded-xl overflow-hidden border border-gray-200 cursor-zoom-in">
                                    <img src={img} className="w-full h-full object-cover hover:scale-110 transition-transform duration-500" alt="review attachments" />
                                 </div>
                              ))}
                           </div>

                           <div className="p-4 bg-white border border-gray-100 rounded-xl mb-4 relative flex-1">
                              <p className="text-xs text-navy/80 font-bold leading-relaxed italic">
                                 "{review.comment}"
                              </p>
                           </div>

                           <div className="flex items-center justify-between mt-auto pt-3 border-t border-gray-100/50">
                              <div className="flex flex-col">
                                 <span className="text-[7px] font-black text-gray-400 uppercase tracking-widest italic mb-0.5">Purchase Date</span>
                                 <span className="text-[9px] font-black text-[#1A1D4E] uppercase tracking-wider italic">{review.purchaseDate}</span>
                              </div>
                              
                              <div className="flex items-center gap-2">
                                 <button 
                                   onClick={() => toast.success("Marked as helpful!")}
                                   className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white border border-gray-100 hover:border-navy text-[#1A1D4E] font-black text-[9px] uppercase tracking-widest italic transition-colors cursor-pointer"
                                 >
                                    <ThumbsUp size={10} /> Helpful ({review.helpful})
                                 </button>
                              </div>
                           </div>
                        </div>
                     ))}
                  </div>

                  <div className="mt-8 flex justify-center">
                     <button onClick={() => toast.success("Loading all customer reviews...")} className="px-10 py-3.5 border border-[#1A1D4E] text-[#1A1D4E] hover:bg-[#1A1D4E] hover:text-white transition-all text-[9.5px] font-black uppercase tracking-widest rounded-full italic cursor-pointer">
                        Load More Reviews
                     </button>
                  </div>
               </div>

               {/* D. Similar/Related Brands Column Block */}
               <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-gray-100/80">
                  <h3 className="text-xl md:text-2xl font-black text-[#1A1D4E] tracking-tight uppercase mb-8 text-center italic">
                     Similar Brands Comparison
                  </h3>

                  <div className="overflow-x-auto no-scrollbar rounded-2xl border border-gray-100">
                     <table className="w-full text-left border-collapse">
                        <thead>
                           <tr className="bg-gray-50 border-b border-gray-100 text-[10px] font-black text-gray-400 uppercase tracking-wider italic">
                              <th className="py-4.5 px-6">Brand Identity</th>
                              <th className="py-4.5 px-6 text-center">Quality</th>
                              <th className="py-4.5 px-6 text-center">Price Range</th>
                              <th className="py-4.5 px-6 text-center">Rating</th>
                              <th className="py-4.5 px-6 text-right">Action</th>
                           </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50 text-xs">
                           {[
                              { name: "Apex Shoes", id: 3, logo: "Ap", quality: "Premium", price: "High (৳৳৳)", score: "4.8" },
                              { name: "Aarong Brand", id: 10, logo: "Aa", quality: "Elite", price: "Mid (৳৳)", score: "4.7" },
                              { name: "Lotto Wear", id: 6, logo: "L", quality: "Basic", price: "Economy (৳)", score: "4.2" },
                              { name: "Yellow Shop", id: 11, logo: "Y", quality: "Fashion", price: "Premium (৳৳৳)", score: "4.5" }
                           ].map((item, idx) => (
                              <tr key={idx} className="hover:bg-gray-50/50 transition-colors">
                                 <td className="py-4.5 px-6">
                                    <div className="flex items-center gap-3">
                                       <div className="w-8 h-8 rounded-lg bg-[#1A1D4E] text-white font-extrabold flex items-center justify-center text-[10px]">
                                          {item.logo}
                                       </div>
                                       <span className="font-extrabold text-[#1A1D4E] italic">{item.name}</span>
                                    </div>
                                 </td>
                                 <td className="py-4.5 px-6 text-center">
                                    <span className="px-2.5 py-0.5 bg-[#4DBC15]/10 text-[#4DBC15] text-[8px] font-black uppercase rounded tracking-wider italic">
                                       {item.quality}
                                    </span>
                                 </td>
                                 <td className="py-4.5 px-6 text-center text-[10px] font-semibold text-gray-500 italic">{item.price}</td>
                                 <td className="py-4.5 px-6 text-center">
                                    <div className="flex items-center justify-center gap-1 text-[11px] font-extrabold text-navy italic">
                                       <Star size={10} className="fill-[#E8500A] text-[#E8500A]" />
                                       <span>{item.score}</span>
                                    </div>
                                 </td>
                                 <td className="py-4.5 px-6 text-right">
                                    <Link to={`/brands/${item.id}`} className="px-4 py-1.5 border border-[#1A1D4E] hover:bg-[#1A1D4E] hover:text-white text-[#1A1D4E] font-black text-[9px] uppercase tracking-wider rounded-full italic transition-all inline-block">
                                       Visit
                                    </Link>
                                 </td>
                              </tr>
                           ))}
                        </tbody>
                     </table>
                  </div>
               </div>

            </div>

            {/* RIGHT COLUMN: PROMO CODES & SPONSORED ADS */}
            <div className="flex flex-col gap-8 w-full lg:max-w-[250px] xl:max-w-[280px] flex-shrink-0 lg:sticky lg:top-24 lg:h-[calc(100vh-120px)] lg:overflow-y-auto pb-10 pr-2 no-scrollbar">
               
               {/* C. Exclusive Promo Codes Section */}
               <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100/80">
                  <div className="flex justify-between items-center mb-5 border-b border-gray-100 pb-3">
                     <h3 className="text-sm font-black text-[#1A1D4E] uppercase tracking-tight flex items-center gap-2">
                        <span className="w-1.5 h-4 bg-[#E8500A] rounded-full inline-block" />
                        Promo Codes
                     </h3>
                     <Link to="/deals" className="text-[9px] font-black text-[#E8500A] uppercase tracking-wider hover:underline">See All</Link>
                  </div>

                  <div className="space-y-4">
                     {[
                        { title: "First Purchase Offer", discount: "BDT 500 FLAT", code: "EID26", expiry: "Valid till June 30" },
                        { title: "First Purchase Offer", discount: "BDT 500 FLAT", code: `${brand.name.toUpperCase()}500`, expiry: "For New Users Only" },
                        { title: "First Purchase Offer", discount: "BDT 500 FLAT", code: `${brand.name.toUpperCase()}20`, expiry: "Valid till June 30" }
                     ].map((promo, idx) => (
                        <div key={idx} className="bg-gray-50 border border-gray-100 p-4 rounded-2xl flex flex-col items-center text-center relative overflow-hidden group">
                           <div className="w-8 h-8 rounded-full bg-[#FFF0E8] text-[#E8500A] flex items-center justify-center mb-2 shadow-sm shrink-0">
                              <Gift size={15} />
                           </div>
                           <h4 className="text-[10px] font-black text-[#1A1D4E] uppercase tracking-wider mb-0.5">{promo.title}</h4>
                           <div className="text-sm font-black text-[#E8500A] italic uppercase mb-3 leading-none">{promo.discount}</div>
                           
                           <button 
                             onClick={() => {
                               navigator.clipboard.writeText(promo.code);
                               toast.success(`Code ${promo.code} copied!`);
                             }}
                             className="w-full py-2 bg-white rounded-xl border border-dashed border-gray-200 hover:border-[#E8500A] font-mono text-[11px] font-extrabold text-[#1A1D4E] tracking-widest uppercase transition-colors flex flex-col items-center justify-center cursor-pointer"
                           >
                              <span className="text-[7px] text-gray-400 font-sans tracking-wide uppercase font-black">PROMO CODE</span>
                              <span>{promo.code}</span>
                           </button>
                           
                           <span className="text-[8px] font-bold text-gray-400 uppercase tracking-widest mt-2">{promo.expiry}</span>
                        </div>
                     ))}
                  </div>
               </div>

               {/* D. Sponsored Ad Section */}
               <div className="bg-[#100D2B] rounded-3xl p-6 text-white text-center relative overflow-hidden shadow-md">
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/40" />
                  <div className="relative z-10">
                     <span className="px-3 py-1 bg-white/10 backdrop-blur-md rounded-full border border-white/10 text-[8px] font-black uppercase tracking-widest block w-fit mx-auto mb-4">
                        Sponsored Ad
                     </span>
                     
                     <div className="w-full aspect-square rounded-2xl overflow-hidden mb-5 border border-white/10 shadow-lg">
                        <img 
                           src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&h=600&fit=crop" 
                           alt="Sponsor AD" 
                           className="w-full h-full object-cover hover:scale-105 transition-transform duration-[2s]"
                        />
                     </div>
                     
                     <h4 className="font-serif text-lg font-bold tracking-widest uppercase mb-1">AARONG</h4>
                     <p className="text-[9px] font-black text-white/50 tracking-wider uppercase mb-3">Heritage Shopping Brand</p>
                     
                     <p className="text-[11px] text-white/70 font-medium leading-relaxed mb-6 px-1">
                        New Collection Available. Free Delivery Overall Dhaka On Purchase Above BDT 1500
                     </p>
                     
                     <button className="w-full bg-[#E8500A] hover:bg-[#ff5d14] text-white text-[10px] font-black uppercase tracking-widest py-3 rounded-full shadow-lg hover:shadow-[#E8500A]/20 transition-all cursor-pointer">
                        Shop Now
                     </button>
                  </div>
               </div>

            </div>

         </div>
      </div>

      {/* Small Small small Report Modal portal trigger */}
      <ReportModal 
        isOpen={isReportOpen}
        onClose={() => setIsReportOpen(false)}
        type="brand"
        targetId={String(brand.id)}
        targetName={brand.name}
      />

    </div>
  );
}
