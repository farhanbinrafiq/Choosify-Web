import React, { useState, useEffect, useRef } from 'react';
import { Search, Youtube, Star, ChevronDown, CheckCircle2, Bookmark, ChevronLeft, ChevronRight, Zap, TrendingUp, HelpCircle, AlertCircle, Share2, MessageCircle, BarChart3, Users, Play, Smartphone, Gift, Shirt, Info, Package, DollarSign, ShieldCheck, ThumbsUp, Heart, X, ArrowRight } from 'lucide-react';
import { BRANDS, PRODUCTS } from '../constants';
import { ProductCard } from '../components/ProductCard';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';
import { useNavigate, Link, useParams } from 'react-router-dom';
import { useCarousel } from '../hooks/useCarousel';
import { ReportModal } from '../components/ReportModal';
import { useGlobalState } from '../context/GlobalStateContext';
import { toast } from 'react-hot-toast';
import { BrandOverviewSection } from '../components/BrandOverviewSection';
import { FollowButton } from '../components/FollowButton';

interface CustomIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number;
}

// Inline Social SVG Icons matching design guidelines
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

import { InfluencerReviews } from '../components/InfluencerReviews';
import { PublicReviewCard } from '../components/PublicReviewCard';

function WithInfluencerReviews({ brandName, brandLogo }: { brandName: string; brandLogo?: string }) {
  const featuredReview = {
    image: "https://images.unsplash.com/photo-1511119253457-36e78921865c?w=1200&h=800&fit=crop",
    title: `${brandName} Collaborative Campaign`,
    excerpt: `Dive deep into the fabric, longevity, and brand heritage of ${brandName}. Real-world creators share their personal daily style experiences.`,
    authorName: brandName === 'Apex' ? 'TECH REVIEW BD' : `${brandName.toUpperCase()} TALK BD`,
    authorSub: "Dhaka Headquarters",
    authorLogo: brandLogo || brandName.substring(0, 2),
    badgeText: "BRAND PARTNERSHIP"
  };

  const reviews = [
    {
      id: 1,
      image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&h=800&fit=crop",
      category: brandName === 'Apex' ? 'FOOTWEAR' : 'FASHION VIBES',
      title: `${brandName} Style & Creators Showcase`,
      authorName: "Style Maven",
      authorHandle: "@stylemaven • 12m",
      authorAvatar: "https://i.pravatar.cc/100?u=style",
    },
    {
      id: 2,
      image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&h=800&fit=crop",
      category: brandName === 'Apex' ? 'FOOTWEAR' : 'CASUAL WEAR',
      title: `${brandName} Seasonal Collection Review`,
      authorName: "BB Fashion Talk",
      authorHandle: "@bbtalk • 15h",
      authorAvatar: "https://i.pravatar.cc/100?u=bbtech",
      badgeBg: "bg-blue-600/95"
    },
    {
      id: 3,
      image: "https://images.unsplash.com/photo-1541643600914-78b084683601?w=600&h=800&fit=crop",
      category: "CREATOR OPINION",
      title: `Is ${brandName} the Best Local Brand in 2024?`,
      authorName: "Avishek Mojumder",
      authorHandle: "@avishek • 1d",
      authorAvatar: "https://i.pravatar.cc/100?u=avishek",
      badgeBg: "bg-purple-600/95"
    }
  ];

  return (
    <InfluencerReviews 
      title="BRAND CAMPAIGN & INFLUENCERS"
      subtitle={`CREATOR EXPERIENCES WITH ${brandName.toUpperCase()}`}
      featuredReview={featuredReview}
      reviews={reviews}
    />
  );
}

export function BrandDetailPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { allBrands, allProducts } = useGlobalState();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [isReportOpen, setIsReportOpen] = useState(false);
  const [isLoved, setIsLoved] = useState(false);
  const [isFollowed, setIsFollowed] = useState(false);

  // Filter States (from Brand Products page)
  const [activeFilter, setActiveFilter] = useState('Full Experience'); // Show Component View Selector
  const [searchFilter, setSearchFilter] = useState('');
  const [currentSearchInput, setCurrentSearchInput] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedProductTypes, setSelectedProductTypes] = useState<string[]>([]);
  const [selectedPriceLimit, setSelectedPriceLimit] = useState<number>(100000);
  const [activeSection, setActiveSection] = useState('all');

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Dynamically resolve brand or fallback to Sailor/fashion-oriented layout
  const brand = allBrands.find(b => String(b.id) === id) || allBrands.find(b => b.name === 'Sailor') || allBrands[2];
  
  // Resolve products listed under this brand
  const brandNameLower = brand.name.toLowerCase();
  const brandProducts = allProducts.filter((p: any) => 
    p.brandId === brand.id || 
    (p.brand && p.brand.toLowerCase() === brandNameLower)
  );

  // Dynamic Categories options
  const dynamicCategories = Array.from(new Set(brandProducts.map((p: any) => p.category).filter(Boolean))).map((catName: any) => {
    const count = brandProducts.filter((p: any) => p.category === catName).length;
    return { name: catName, count: count };
  });
  const defaultCats = [
    { name: "Mobile", count: 12 },
    { name: "Headphone", count: 8 },
    { name: "Chargers & Batteries", count: 5 },
    { name: "Accessories", count: 7 }
  ];
  const finalCategoriesList = dynamicCategories.length > 0 ? dynamicCategories : defaultCats;

  const productTypes = [
    "Drives", "Flash", "Ram", "Batteries", "SSD", "Keyboard", "Monitors", "Mouse", "Cases", "Fans", "Software", "CPU"
  ];

  // Filters Engine Implementation
  const filteredProducts = brandProducts.filter((p: any) => {
    // 1. Search Box
    if (searchFilter && !p.title.toLowerCase().includes(searchFilter.toLowerCase())) {
      return false;
    }
    // 2. Categories
    if (selectedCategories.length > 0) {
      if (!p.category || !selectedCategories.includes(p.category)) {
        return false;
      }
    }
    // 3. Price Limit
    if (p.price) {
      const priceNum = typeof p.price === 'number' 
        ? p.price 
        : parseInt(String(p.price).replace(/[^0-9]/g, '')) || 0;
      if (priceNum > selectedPriceLimit) {
        return false;
      }
    }
    return true;
  });

  // Extract deals (with specific tags or Sale flags)
  const filteredDeals = filteredProducts.filter((p: any) => 
    p.tag === 'SALE' || p.tag === 'HOT' || p.tag === 'NEW' || p.discount
  );
  // Guarantee always active deals fallback
  const finalDeals = filteredDeals.length > 0 ? filteredDeals : filteredProducts.slice(0, 3);
  
  // Counts
  const totalDealsFound = finalDeals.length;
  const totalProductsFound = filteredProducts.length || brandProducts.length;

  const handleCategoryToggle = (catName: string) => {
    setSelectedCategories(prev => 
      prev.includes(catName) ? prev.filter(c => c !== catName) : [...prev, catName]
    );
  };

  const handleProductTypeToggle = (type: string) => {
    setSelectedProductTypes(prev => 
      prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
    );
  };

  const clearAllFilters = () => {
    setSearchFilter('');
    setCurrentSearchInput('');
    setSelectedCategories([]);
    setSelectedProductTypes([]);
    setSelectedPriceLimit(100000);
    setActiveFilter('Full Experience');
  };

  const activeChips = [];
  if (searchFilter) activeChips.push({ type: 'search', label: `Search: ${searchFilter}` });
  selectedCategories.forEach(cat => activeChips.push({ type: 'category', label: cat }));
  selectedProductTypes.forEach(type => activeChips.push({ type: 'type', label: type }));
  if (selectedPriceLimit < 100000) activeChips.push({ type: 'price', label: `Under ৳${selectedPriceLimit.toLocaleString()}` });

  // ScrollSpy Active Section Detection
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 220; // safe offset matching navbar + sticky selectors

      const sections = [
        { id: 'deals-section', name: 'deals' },
        { id: 'products-section', name: 'products' },
        { id: 'influencer-reviews-section', name: 'influencer' },
        { id: 'public-reviews-section', name: 'public' },
        { id: 'brand-overview-section', name: 'overview' }
      ];

      if (window.scrollY < 200) {
        setActiveSection('all');
        return;
      }

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
      setActiveSection(currentSection);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    if (id === 'all') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      setActiveSection('all');
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
          'deals-section': 'deals',
          'products-section': 'products',
          'influencer-reviews-section': 'influencer',
          'public-reviews-section': 'public',
          'brand-overview-section': 'overview'
        };
        setActiveSection(nameMap[id] || 'all');
      }
    }
  };

  const [productLineIndex, setProductLineIndex] = useState(1);

  const carouselItems = [
    { name: "Premium Comfort", category: "Classic Collection", img: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=1200&h=800&fit=crop" },
    { name: `${brand.name} Eid Collection`, category: "Modern Fit", img: "https://images.unsplash.com/photo-1512314889357-e157c22f938d?w=1200&h=800&fit=crop" },
    { name: "Royal Edition", category: "Luxury Series", img: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=1200&h=800&fit=crop" },
    { name: "Festive Spirit", category: "Seasonal Wear", img: "https://images.unsplash.com/photo-1511741454500-ddbf7ef33554?w=1200&h=800&fit=crop" }
  ];

  const handleProductLineNext = () => setProductLineIndex((prev) => (prev + 1) % carouselItems.length);
  const handleProductLinePrev = () => setProductLineIndex((prev) => (prev - 1 + carouselItems.length) % carouselItems.length);

  const getBrandOverviews = (brandName: string) => {
    const name = brandName.toLowerCase();
    if (name.includes('sailor') || name.includes('la reve') || name.includes('yellow') || name.includes('aarong') || name.includes('ethnic') || name.includes('fashion') || name.includes('apex') || name.includes('bata') || name.includes('lotto')) {
       return {
          address: "GRAND SHOPPING MALL, HOUSE 2, ROAD 2, SECTOR 92. 1500 - DHAKA BANGLADESH.",
          website: "www.website.com",
          map: "https://www.google.com/maps",
          email: "fashion@gmail.com",
          phone: "01234456789",
          priceRange: "BDT - 500",
          ageRange: "AGE: 12 - 40",
          audience: "MALE, FEMALE, YOUTH & KIDS",
          services: [
             "90 DAYS RETURN WITH REFUND POLICY",
             "FULL COD ENTIRE BANGLADESH",
             "6 MONTHS WARRANTY ALL PRODUCT",
             "CUSTOM GIFT BOX AVAILABLE",
             "3 HOURS DELIVERY INSIDE DHAKA METRO",
             "ONLINE & OFFLINE ORDER FACILITIES."
          ],
          tags: ["#premium buyers", "#quality driven", "#ethnic wear", "#fashion", "#eid collection", "#trend setter", "#old money", "#summer collection", "#beach wear"]
       };
    }
    
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
    return [
      { label: 'MOBILES', img: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=600&fit=crop' },
      { label: 'GEAR', img: 'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=400&h=600&fit=crop' },
      { label: 'WEARABLES', img: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=400&h=600&fit=crop' }
    ];
  };

  const popularCats = getPopularCategoryPreviews();

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
    return (
      <div className="w-full h-full bg-gradient-to-br from-navy to-[#2A2E6B] flex items-center justify-center text-4xl font-extrabold text-white">
        {brandObj.logo || brandObj.name.substring(0, 2)}
      </div>
    );
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#F8FAFC]">
      
      {/* 1. Brand Hero Section */}
      <motion.section 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="hero-gradient relative pt-10 pb-12 overflow-hidden border-b border-white/5"
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
            <div className="flex flex-col lg:grid lg:grid-cols-[1.5fr_1fr] xl:grid-cols-[1.6fr_1fr] gap-8 xl:gap-12 lg:items-stretch w-full">
              
              {/* Left Side: Brand Profile Details & Info */}
              <div className="w-full flex flex-col items-center lg:items-start text-center lg:text-left gap-6 order-1 lg:order-none lg:justify-between lg:h-full">
                 <div className="w-full flex-1 flex flex-col items-center lg:items-start gap-6">
                    <div className="w-28 h-28 md:w-36 md:h-36 rounded-2xl bg-white overflow-hidden flex items-center justify-center shadow-2xl border-4 border-white relative shrink-0 mx-auto lg:mx-0">
                       {renderBrandLogo(brand)}
                       <div className="absolute -top-1.5 -right-1.5 w-7 h-7 bg-[#E8500A] rounded-full flex items-center justify-center text-white border-2 border-[#10133A] shadow-lg">
                          <CheckCircle2 size={13} fill="currentColor" className="text-white stroke-[#E8500A]" />
                       </div>
                    </div>

                    <div className="w-full flex-1 flex flex-col items-center lg:items-start">
                       <div className="flex flex-col sm:flex-row items-center gap-3 mb-2 flex-wrap justify-center lg:justify-start">
                          <h1 className="text-3xl md:text-5xl font-black text-white italic tracking-tighter leading-none text-center lg:text-left">{brand.name}</h1>
                          <div className="bg-[#4DBC15] px-3 py-1 rounded-full flex items-center gap-2 shadow-md">
                             <ShieldCheck size={11} className="text-white" />
                             <span className="text-[9px] font-black text-white uppercase tracking-widest italic whitespace-nowrap">Verified Brand</span>
                          </div>
                       </div>
                       
                       <p className="text-[10px] md:text-[11px] font-extrabold text-[#E8500A]/90 uppercase tracking-[0.2em] mb-3 text-center lg:text-left">
                         {brand.category || 'Fashion & Clothing'} • Premium Showcase
                       </p>

                       <p className="text-xs md:text-sm font-medium text-white/70 max-w-md mb-4 text-center lg:text-left leading-relaxed">
                         Experience the perfect balance of elite-tier product selections, verified customer rankings, and high-quality local trust.
                       </p>

                       <div className="flex items-center gap-4 flex-wrap justify-center lg:justify-start">
                          <div className="flex items-center gap-2">
                             <Heart size={14} className="text-[#E8500A] fill-current" />
                             <span className="text-white font-extrabold text-[9px] md:text-[10px] uppercase tracking-widest italic whitespace-nowrap">50,000 Love This Brand</span>
                          </div>
                          <div className="h-4 w-px bg-white/15 hidden sm:block" />
                          <div className="flex items-center gap-2">
                             <TrendingUp size={14} className="text-green-accent" />
                             <span className="text-white font-extrabold text-[9px] md:text-[10px] uppercase tracking-widest italic whitespace-nowrap">Score: 92/100</span>
                          </div>
                       </div>
                    </div>

                    {/* Action buttons */}
                    <div className="flex flex-wrap gap-3.5 justify-center lg:justify-start text-white w-full">
                       {/*
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
                       */}
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

                       <FollowButton 
                         id={String(brand.id)}
                         name={brand.name}
                         type="brand"
                         className="px-6 md:px-8 py-3.5 md:py-4.5 rounded-full"                       />

                       <button 
                         onClick={() => scrollToSection('public-reviews-section')}
                         className="bg-transparent text-white border border-white/20 hover:bg-white/10 hover:border-white/40 text-[10px] md:text-[11px] font-black uppercase px-6 md:px-8 py-3.5 md:py-4.5 rounded-full tracking-wider transition-all italic cursor-pointer"
                       >
                          Write a Review
                       </button>
                    </div>
                 </div>

                 {/* Desktop Social links */}
                 <div className="hidden lg:flex items-center gap-4 mt-2 flex-wrap justify-start">
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

              {/* Right Side: Score card */}
              <div className="w-full lg:w-full max-w-md relative order-3 lg:order-none lg:flex lg:flex-col lg:justify-between lg:h-full">
                 <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 text-white relative overflow-hidden group mb-auto">
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

                    <div className="flex items-center justify-between pt-5 border-t border-white/10">
                       <div className="text-center w-full">
                          <div className="text-4xl font-black text-[#50DC17] leading-none mb-1">85%</div>
                          <div className="text-[9px] font-black text-white/50 uppercase tracking-widest">Of Buyers Recommend This Brand</div>
                       </div>
                    </div>
                 </div>

                 {/* Save share controls */}
                 <div className="absolute lg:relative -bottom-6 lg:bottom-auto right-4 lg:right-auto flex items-center lg:justify-end gap-3 z-20 mt-4 lg:mt-0 lg:pt-2.5">
                    <button 
                      onClick={() => {
                        navigator.clipboard.writeText(window.location.href);
                        toast.success("Page link copied to clipboard!");
                      }}
                      className="w-11 h-11 rounded-full bg-white text-[#1A1D4E] shadow-xl border border-gray-100 flex items-center justify-center hover:scale-110 active:scale-95 transition-all cursor-pointer hover:bg-gray-50 text-navy"
                    >
                       <Share2 size={16} />
                    </button>
                    <button 
                      onClick={() => toast.success(`${brand.name} saved to your bookmarks!`)}
                      className="w-11 h-11 rounded-full bg-white text-[#1A1D4E] shadow-xl border border-gray-100 flex items-center justify-center hover:scale-110 active:scale-95 transition-all cursor-pointer hover:bg-gray-50 text-navy"
                    >
                       <Bookmark size={15} />
                    </button>
                 </div>
              </div>

              {/* Mobile Social links */}
              <div className="flex lg:hidden items-center gap-4 mt-8 flex-wrap justify-center order-5 w-full">
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
        </div>
      </motion.section>

      {/* 2. SECTION SUMMARY BAR */}
      <div className="w-full hero-gradient text-white py-4.5 border-y border-white/5 font-space font-black italic uppercase tracking-[0.2em] text-[11px] md:text-xs">
         <div className="max-w-[1440px] mx-auto px-6 flex flex-wrap justify-center sm:justify-around items-center gap-y-4 gap-x-12 text-center">
            <div className="flex items-center gap-2">
               <span className="text-[#E8500A] text-lg font-space font-black">★</span>
               <span>{totalDealsFound} Deals Found</span>
            </div>
            <div className="hidden sm:block h-4 w-px bg-white/20" />
            <div className="flex items-center gap-2">
               <span className="text-[#E8500A] text-lg font-space font-black">✦</span>
               <span>{totalProductsFound} Products Found</span>
            </div>
            <div className="hidden sm:block h-4 w-px bg-white/20" />
            <div className="flex items-center gap-2">
               <span className="text-[#E8500A] text-lg font-space font-black">🎁</span>
               <span>3 Promo Codes Found</span>
            </div>
         </div>
      </div>

      {/* 3. STICKY SECTION NAVIGATION */}
      <div className="sticky top-[80px] z-30 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm py-3.5">
         <div className="max-w-[1440px] mx-auto px-6 flex flex-col gap-3.5">
            
            {/* Search Bar */}
            <div 
               className="relative w-full max-w-2xl mx-auto bg-gray-50 p-1 rounded-full border border-gray-200/50 shadow-sm focus-within:border-gray-200/90 transition-all duration-300"
               style={{ width: '100%', maxWidth: '640px' }}
            >
               <div className="flex items-center bg-white rounded-full">
                  <div className="pl-4 text-[#E8500A] shrink-0">
                     <Search className="w-4 h-4" />
                  </div>
                  <input 
                     type="text" 
                     placeholder="Search products of this brand..." 
                     value={currentSearchInput}
                     onChange={(e) => setCurrentSearchInput(e.target.value)}
                     onKeyDown={(e) => {
                        if (e.key === 'Enter') setSearchFilter(currentSearchInput);
                     }}
                     className="w-full h-10 bg-transparent outline-none pl-3 pr-24 text-navy text-xs font-semibold placeholder-gray-500 focus:outline-none focus:ring-0 border-none text-left" 
                  />
                  <button 
                     onClick={() => setSearchFilter(currentSearchInput)}
                     className="absolute right-1.5 top-1.5 bottom-1.5 px-5 rounded-full bg-gradient-to-r from-[#FF5B00] to-[#E8500A] hover:from-[#E8500A] hover:to-[#CF4400] text-white text-[9px] font-black tracking-widest uppercase flex items-center gap-1.5 shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 cursor-pointer border-0"
                  >
                     Search
                  </button>
               </div>
            </div>

            <div className="flex items-center justify-start md:justify-center gap-1.5 md:gap-3 overflow-x-auto no-scrollbar py-1 text-[10px] font-black uppercase tracking-wider">
               
               <button 
                 onClick={() => scrollToSection('all')}
                 className={cn(
                   "px-6 py-2.5 rounded-full transition-all shrink-0 cursor-pointer flex items-center gap-1.5",
                   activeSection === 'all' 
                     ? "bg-[#E8500A] text-white shadow-md shadow-[#E8500A]/10 italic border border-transparent" 
                     : "bg-white border border-gray-200/85 text-gray-400 hover:text-[#1A1D4E] hover:bg-gray-50/80"
                 )}
               >
                  All
               </button>

               {[
                 { id: 'deals-section', name: 'deals', label: 'Deals', icon: <Gift size={13} /> },
                 { id: 'products-section', name: 'products', label: 'Products', icon: <Package size={13} /> },
                 { id: 'influencer-reviews-section', name: 'influencer', label: 'Influencer Reviews', icon: <Play size={13} /> },
                 { id: 'public-reviews-section', name: 'public', label: 'Public Reviews', icon: <Star size={13} /> },
                 { id: 'brand-overview-section', name: 'overview', label: 'Brand Overview', icon: <Info size={13} /> }
               ].map(item => (
                 <button 
                   key={item.id}
                   onClick={() => scrollToSection(item.id)}
                   className={cn(
                     "px-5 py-2.5 rounded-full transition-all shrink-0 cursor-pointer flex items-center gap-1.5",
                     activeSection === item.name 
                       ? "bg-[#E8500A] text-white shadow-md shadow-[#E8500A]/10 italic border border-transparent" 
                       : "bg-white border border-gray-200/85 text-gray-400 hover:text-[#1A1D4E] hover:bg-gray-50/80"
                   )}
                 >
                    {item.icon}
                    <span>{item.label}</span>
                 </button>
               ))}
            </div>
         </div>
      </div>

      {/* 4. Unified Scrollable Body Wrapper */}
      <div className="max-w-[1440px] mx-auto px-4 py-5 w-full flex flex-col gap-16">
         
         {/* EXCLUSIVE DEALS & PRODUCT CATALOG THREE COLUMN SPLIT GRID */}
         <div className="grid grid-cols-1 lg:grid-cols-[240px_minmax(0,1fr)_260px] xl:grid-cols-[280px_minmax(0,1fr)_310px] gap-4 items-start w-full relative">
            
            {/* COLUMN 1: SIDEBAR FILTERS (from Brand Wise Products page) */}
            <aside className="hidden lg:flex flex-col gap-4 lg:sticky lg:top-24 pb-10 pr-2 flex-shrink-0 animate-fade-in">
               <div className="flex flex-col gap-6">
                  
                  {/* Active Selection Chips */}
                  {activeChips.length > 0 && (
                     <div className="bg-white rounded-[5px] p-4.5 shadow-sm border border-[#e8edf2] text-left">
                        <h3 className="text-[11px] font-semibold text-[#8a9bb0] uppercase tracking-wider mb-4 flex items-center justify-between">
                           Selection
                           <button onClick={clearAllFilters} className="text-[#E8500A] cursor-pointer hover:underline text-[9px] font-black uppercase">Clear</button>
                        </h3>
                        <div className="flex flex-wrap gap-1.5">
                           {activeChips.map((chip, i) => (
                             <div 
                               key={i} 
                               className="flex items-center gap-1.5 px-2.5 py-1.5 bg-gray-50 border border-[#e8edf2] rounded-lg text-[10px] font-semibold text-gray-600 uppercase tracking-wide hover:bg-gray-100 transition-all cursor-pointer"
                               onClick={() => {
                                 if (chip.type === 'search') { setSearchFilter(''); setCurrentSearchInput(''); }
                                 else if (chip.type === 'category') handleCategoryToggle(chip.label);
                                 else if (chip.type === 'type') handleProductTypeToggle(chip.label);
                                 else if (chip.type === 'price') setSelectedPriceLimit(100000);
                               }}
                             >
                               <span>{chip.label}</span>
                               <X size={10} className="text-[#E8500A]" />
                             </div>
                           ))}
                        </div>
                     </div>
                  )}

                  {/* Filter by Product Name Search box */}
                  <div className="flex flex-col gap-2 text-left">
                     <span className="text-[10px] font-black text-[#1A1D4E] uppercase tracking-widest">Filter By Product Name</span>
                     <div className="flex gap-2">
                        <div className="relative flex-1">
                           <input 
                              type="text" 
                              placeholder="Search brand products..." 
                              value={currentSearchInput}
                              onChange={(e) => setCurrentSearchInput(e.target.value)}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') setSearchFilter(currentSearchInput);
                              }}
                              className="w-full h-11 px-4 bg-white rounded-xl text-xs font-bold border border-gray-100 focus:outline-none focus:border-[#E8500A] shadow-sm text-left" 
                           />
                        </div>
                        <button 
                          onClick={() => setSearchFilter(currentSearchInput)}
                          className="h-11 px-4 bg-[#E8500A] text-white rounded-xl font-black text-[10px] uppercase tracking-widest cursor-pointer transition-colors"
                        >
                           Search
                        </button>
                     </div>
                  </div>

                  {/* Filter By Category list */}
                  <div className="bg-white rounded-[5px] p-6 border border-gray-100 shadow-sm relative overflow-hidden text-left">
                     <div className="absolute top-0 right-0 w-2.5 h-full bg-[#E8500A]/5" />
                     <div className="flex items-center justify-between mb-4">
                        <h3 className="text-[10px] font-black text-[#1A1D4E] uppercase tracking-widest">By Category</h3>
                        <button onClick={() => setSelectedCategories([])} className="text-[9px] font-black text-[#E8500A] uppercase cursor-pointer hover:underline">Reset</button>
                     </div>
                     <div className="space-y-2.5 max-h-[180px] overflow-y-auto pr-1 no-scrollbar">
                       {finalCategoriesList.map((cat, i) => {
                         const isChecked = selectedCategories.includes(cat.name);
                         return (
                           <label key={i} className="flex items-center justify-between group cursor-pointer select-none">
                             <div className="flex items-center gap-2.5">
                                <input 
                                  type="checkbox"
                                  checked={isChecked}
                                  onChange={() => handleCategoryToggle(cat.name)}
                                  className="rounded border-gray-200 text-[#E8500A] focus:ring-[#E8500A] w-3.5 h-3.5 cursor-pointer"
                                />
                                <span className={cn("text-[11px] font-bold transition-colors uppercase tracking-wide", isChecked ? "text-[#1A1D4E]" : "text-gray-400 group-hover:text-navy")}>
                                  {cat.name}
                                </span>
                             </div>
                             <span className="text-[9px] font-mono text-gray-300 font-bold">({cat.count})</span>
                           </label>
                         );
                       })}
                     </div>
                  </div>

                  {/* Filter By Popular Product Type tags */}
                  <div className="bg-white rounded-[5px] p-6 border border-gray-100 shadow-sm text-left">
                     <div className="flex items-center justify-between mb-4">
                        <h3 className="text-[10px] font-black text-[#1A1D4E] uppercase tracking-widest">Product Type</h3>
                        <button onClick={() => setSelectedProductTypes([])} className="text-[9px] font-black text-[#E8500A] uppercase cursor-pointer hover:underline">Reset</button>
                     </div>
                     <div className="flex flex-wrap gap-1.5">
                       {productTypes.slice(0, 10).map((type, i) => {
                         const isSelected = selectedProductTypes.includes(type);
                         return (
                           <button 
                             key={i} 
                             onClick={() => handleProductTypeToggle(type)}
                             className={cn(
                               "px-2.5 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all cursor-pointer", 
                               isSelected 
                                 ? "bg-[#E8500A] text-white shadow-sm" 
                                 : "bg-gray-50 text-gray-400 hover:bg-gray-100"
                             )}
                           >
                              {type}
                           </button>
                         );
                       })}
                     </div>
                  </div>

                  {/* Price limit selection */}
                  <div className="bg-white rounded-[5px] p-6 border border-gray-100 shadow-sm text-left">
                     <div className="flex items-center justify-between mb-4">
                        <h3 className="text-[10px] font-black text-[#1A1D4E] uppercase tracking-widest">Price Limit</h3>
                        <button onClick={() => setSelectedPriceLimit(100000)} className="text-[9px] font-black text-[#E8500A] uppercase cursor-pointer hover:underline">Clear</button>
                     </div>
                     <div className="space-y-4">
                        <input 
                          type="range" 
                          min="500" 
                          max="100000" 
                          step="500"
                          value={selectedPriceLimit}
                          onChange={(e) => setSelectedPriceLimit(parseInt(e.target.value))}
                          className="w-full accent-[#E8500A] cursor-ew-resize"
                        />
                        <div className="flex items-center justify-between text-xs font-bold text-[#1A1D4E]">
                           <span>৳500</span>
                           <span className="bg-[#FFF0E8] text-[#E8500A] font-extrabold px-3 py-1 rounded-full text-[10px]">
                              Max: ৳{selectedPriceLimit.toLocaleString()}
                           </span>
                        </div>
                     </div>
                  </div>

               </div>
            </aside>

            {/* COLUMN 2: EXCLUSIVE DEALS & PRODUCTS CATALOG (Center scroll) */}
            <main className="scroll-mt-36 min-w-0 pb-10 flex flex-col gap-12">
               
               {/* A. DEALS SECTION */}
               {(activeFilter === 'Full Experience' || activeFilter === 'Exclusive Deals Only') && (
                  <div id="deals-section" className="scroll-mt-36">
                     <div className="mb-6 text-left">
                        <h2 className="text-2xl font-black text-[#1A1D4E] italic tracking-tighter uppercase mb-0.5">Exclusive Deals</h2>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.3em] italic">Deals found matching current selections</p>
                     </div>
                     
                     {finalDeals.length > 0 ? (
                        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-5 justify-items-center">
                           {finalDeals.map((product: any, i: number) => (
                              <ProductCard key={product.id || i} product={product} variant="grid" />
                           ))}
                        </div>
                     ) : (
                        <div className="p-10 text-center bg-white border border-gray-100 rounded-3xl text-gray-400 text-xs font-black uppercase">
                           No Active Deals Found Match Current Filters.
                        </div>
                     )}
                  </div>
               )}

               {/* B. PRODUCTS SECTION */}
               {(activeFilter === 'Full Experience' || activeFilter === 'Product Catalogs Only') && (
                  <div id="products-section" className="scroll-mt-36">
                     <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 text-left">
                        <div>
                           <h2 className="text-2xl font-black text-[#1A1D4E] italic tracking-tighter uppercase mb-0.5">Product Catalog</h2>
                           <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.3em] italic">Full authorized selection available</p>
                        </div>
                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest italic font-mono bg-white border border-gray-150 rounded-full px-4 py-2">
                           Showing <span className="text-[#1A1D4E] font-black">{filteredProducts.length}</span> items
                        </span>
                     </div>

                     {filteredProducts.length > 0 ? (
                        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-5 justify-items-center">
                           {filteredProducts.map((product: any, i: number) => (
                              <ProductCard key={product.id || i} product={product} variant="grid" />
                           ))}
                        </div>
                     ) : (
                        <div className="p-16 text-center bg-white border border-gray-150 rounded-3xl text-gray-400 text-xs font-black uppercase space-y-2">
                           <p>No Products Match Chosen Criteria.</p>
                           <button onClick={clearAllFilters} className="text-[#E8500A] underline hover:text-[#ff5d14] text-[10px]">Clear Selections</button>
                        </div>
                     )}

                     {/* Pagination footer (from Brand Wise Products page - standardized to global canonical style) */}
                     <div className="mt-16 pt-12 border-t border-gray-100 flex flex-col items-center gap-8">
                        <div className="flex items-center gap-3">
                           <button className="w-12 h-12 rounded-[5px] flex items-center justify-center bg-white border border-[#e8edf2] text-navy hover:bg-[#E8500A] hover:text-white hover:border-[#E8500A] transition-all shadow-none group">
                              <ArrowRight size={18} className="rotate-180 group-hover:-translate-x-1 transition-transform" />
                           </button>
                           {[1, 2, 3, "...", 15].map((p, idx) => (
                              <button 
                                key={idx} 
                                className={cn(
                                  "w-12 h-12 rounded-[5px] flex items-center justify-center text-[11px] font-black transition-all italic",
                                  p === 1 
                                  ? "bg-[#E8500A] text-white border border-[#E8500A] shadow-none" 
                                  : "bg-white border border-[#e8edf2] text-navy hover:border-[#E8500A] hover:text-[#E8500A] shadow-none"
                                )}
                              >
                                {p}
                              </button>
                           ))}
                           <button onClick={() => toast.success('Loading Page 2...')} className="w-12 h-12 rounded-[5px] flex items-center justify-center bg-white border border-[#e8edf2] text-navy hover:bg-[#E8500A] hover:text-white hover:border-[#E8500A] transition-all shadow-none group">
                              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                           </button>
                        </div>
                        <p className="text-[10px] font-black text-gray-300 uppercase tracking-[0.2em] italic">
                           Authorized Distribution • Showing {filteredProducts.length} items
                        </p>
                     </div>
                  </div>
               )}
            </main>

            {/* COLUMN 3: PROMO CODES & ADS (Right column) */}
            <aside className="hidden lg:flex flex-col gap-4 lg:sticky lg:top-24 pb-10 pr-2 flex-shrink-0 animate-fade-in">
               <div className="flex flex-col gap-6">

                  {/* Promo Coupons Cards list */}
                  <div className="bg-white rounded-[5px] p-4.5 border border-[#e8edf2] shadow-sm">
                     <div className="flex justify-between items-center pb-3 mb-4 border-b border-[#e8edf2] px-0.5 text-left">
                        <h3 className="text-[11px] font-semibold text-[#8a9bb0] uppercase tracking-wider flex items-center gap-1.5">
                           <span className="w-1.5 h-3 bg-[#E8500A] rounded-full inline-block" />
                           Promo Codes
                        </h3>
                        <span className="text-[9px] font-semibold text-[#8a9bb0]">3 Verified</span>
                     </div>

                     <div className="space-y-4 text-left">
                        {[
                           { title: "First Order Gift", discount: "BDT 500 FLAT", code: `${brand.name.toUpperCase()}500`, expiry: "Valid till June 30" },
                           { title: "Eid Celebration Offer", discount: "BDT 1,000 FLAT", code: "EID26", expiry: "Minimum purchase BDT 4,000" },
                           { title: "Limited VIP Discount", discount: "20% FLAT OFF", code: `${brand.name.toUpperCase()}20`, expiry: "For New Registries" }
                        ].map((promo, idx) => (
                           <div key={idx} className="bg-white border border-[#e8edf2] p-3.5 rounded-[5px] flex flex-col items-center text-center relative overflow-hidden group hover:border-[#E8500A]/30 transition-all">
                              <div className="w-7 h-7 rounded-lg bg-[#FFF0E8] text-[#E8500A] flex items-center justify-center mb-2 shadow-sm shrink-0">
                                 <Gift size={14} />
                              </div>
                              <h4 className="text-xs font-semibold text-[#1A1D4E] uppercase tracking-wider mb-0.5">{promo.title}</h4>
                              <div className="text-sm font-semibold text-[#E8500A] uppercase mb-3 leading-none">{promo.discount}</div>
                              
                              <button 
                                onClick={() => {
                                  navigator.clipboard.writeText(promo.code);
                                  toast.success(`Promo Code "${promo.code}" copied to clipboard!`);
                                }}
                                className="w-full py-2 bg-white rounded-lg border border-dashed border-[#e8edf2] hover:border-[#E8500A] font-mono text-xs font-semibold text-[#1A1D4E] tracking-wider uppercase transition-colors flex flex-col items-center justify-center cursor-pointer shadow-xs"
                              >
                                 <span className="text-[8px] text-gray-400 font-sans tracking-wide uppercase font-semibold">PROMO CODE</span>
                                 <span>{promo.code}</span>
                              </button>
                              
                              <span className="text-[8px] font-bold text-gray-400 uppercase tracking-widest mt-2 block">{promo.expiry}</span>
                           </div>
                        ))}
                     </div>
                  </div>

                  {/* Sponsored Ad space block */}
                  <div className="bg-white border border-[#e8edf2] rounded-[5px] p-4.5 shadow-sm text-[#1a1a2e] text-center relative overflow-hidden">
                     <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/40" />
                     <div className="relative z-10 text-center">
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
                        <h4 className="font-serif text-base font-bold tracking-widest uppercase mb-1">AARONG</h4>
                        <p className="text-[9px] font-black text-white/50 tracking-wider uppercase mb-3">Heritage Shopping Brand</p>
                        <p className="text-[10px] text-white/70 font-medium leading-relaxed mb-5 px-1 uppercase">
                           New Collection Available. Free Delivery Overall Dhaka On Purchase Above BDT 1500
                        </p>
                        <button className="w-full bg-[#E8500A] hover:bg-[#ff5d14] text-white text-[10px] font-black uppercase tracking-widest py-3 rounded-full shadow-lg hover:shadow-[#E8500A]/20 transition-all cursor-pointer">
                           Shop Now
                        </button>
                     </div>
                  </div>

               </div>
            </aside>

         </div>

         {/* FULL WIDTH INFLUENCER REVIEWS SECTION */}
         <div id="influencer-reviews-section" className="scroll-mt-36 w-full">
            <WithInfluencerReviews brandName={brand.name} brandLogo={brand.logo} />
         </div>

         {/* FULL WIDTH PUBLIC REVIEWS SECTION */}
         <div id="public-reviews-section" className="scroll-mt-36 w-full bg-white rounded-[5px] p-6 md:p-8 shadow-sm border border-gray-100/80">
            <div className="text-center mb-8 border-b border-gray-100 pb-5">
               <h3 className="text-xl md:text-2xl font-black text-[#1A1D4E] tracking-tight uppercase mb-2">
                  Public Reviews
               </h3>
               <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest italic bg-gray-50 border border-gray-100 rounded-full px-4 py-1.5 w-fit mx-auto">
                  Verified Customer Experiences
               </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
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
                  <PublicReviewCard
                     key={i}
                     review={review}
                     onHelpfulClick={() => toast.success("Marked as helpful!")}
                  />
               ))}
            </div>

            <div className="mt-8 flex justify-center">
               <button onClick={() => toast.success("Loading all customer reviews...")} className="px-10 py-3.5 border border-[#1A1D4E] text-[#1A1D4E] hover:bg-[#1A1D4E] hover:text-white transition-all text-[9.5px] font-black uppercase tracking-widest rounded-full italic cursor-pointer">
                  Load More Reviews
               </button>
            </div>
         </div>

         {/* FULL WIDTH BRAND OVERVIEW SECTION */}
         <BrandOverviewSection brandName={brand.name} overviewData={overviewData} />

         {/* TRUST STATEMENT BACKGROUND BANNER */}
         <div className="w-full hero-gradient rounded-[5px] p-8 md:p-12 text-center text-white relative overflow-hidden shadow-lg border border-white/5">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-orange-primary/10 blur-[120px] rounded-full pointer-events-none" />
            <div className="relative z-10 space-y-4">
               <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center mx-auto text-[#4DBC15] border border-white/10">
                  <ShieldCheck size={24} />
               </div>
               <h3 className="font-space font-black italic text-2xl tracking-tight uppercase">CHOOSIFY.BD TRUST STATEMENT</h3>
               <p className="text-sm text-gray-300 font-semibold leading-relaxed max-w-2xl mx-auto italic">
                  "Only verified sellers and completely unbiased, authentic brand experiences are list on Choosify."
               </p>
            </div>
         </div>

         {/* Similar Brands Comparison Table */}
         <div className="bg-white rounded-[5px] p-6 md:p-8 shadow-sm border border-gray-100/80">
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
                        <th className="py-2.5 px-6 text-right">Action</th>
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
                           <td className="py-4.5 px-6 text-left">
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
                              <button onClick={() => navigate(`/brands/${item.id}`)} className="px-4 py-1.5 border border-[#1A1D4E] hover:bg-[#1A1D4E] hover:text-white text-[#1A1D4E] font-black text-[9px] uppercase tracking-wider rounded-full italic transition-all inline-block cursor-pointer">
                                 Visit
                              </button>
                           </td>
                        </tr>
                     ))}
                  </tbody>
               </table>
            </div>
         </div>

      </div>

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
