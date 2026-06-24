import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Search, Youtube, Star, ChevronDown, CheckCircle2, Bookmark, ChevronLeft, ChevronRight, Zap, TrendingUp, HelpCircle, AlertCircle, Share2, MessageCircle, BarChart3, Users, Play, Smartphone, Gift, Shirt, Info, Package, DollarSign, ShieldCheck, ThumbsUp, Heart, X, ArrowRight, Lock, Sparkles, Clock, Facebook, Instagram } from 'lucide-react';
import { BRANDS, PRODUCTS } from '../constants';
import { ProductCard } from '../components/ProductCard';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';
import { QuickAccessCard } from '../components/QuickAccessCard';
import { useNavigate, Link, useParams } from 'react-router-dom';
import { useCarousel } from '../hooks/useCarousel';
import { ReportModal } from '../components/ReportModal';
import { useGlobalState } from '../context/GlobalStateContext';
import { toast } from 'react-hot-toast';
import { BrandOverviewSection } from '../components/BrandOverviewSection';
import { FollowButton } from '../components/FollowButton';
import { ClaimProfileModal } from '../components/ClaimProfileModal';
import { DragScrollContainer, UniversalFilterRenderer, QuickFilterBar, ActiveFilterChips, FullSidebarFilterPanel, FilterProfile, CategorySmartFilters } from '../components/FilterEngine';

function TikTokIcon({ size = 20 }: { size?: number }) {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="currentColor"
    >
      <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.02 1.73 4.1 1.12 1.09 2.62 1.7 4.18 1.8v3.91c-1.85-.01-3.61-.68-5.07-1.82V14.5c.04 3.39-2.14 6.55-5.4 7.63-3.25 1.08-6.9-.32-8.56-3.32C1.65 15.82 2.45 11.9 5.31 9.87c1.78-1.27 4.14-1.55 6.16-.72.01-.16.02-.32.02-.48V4.83c-1.41-.35-2.88-.16-4.16.54-2.1 1.15-3.35 3.51-3.14 5.92.21 2.42 2.01 4.54 4.38 5.17 2.37.64 4.96-.2 6.09-2.26.47-.86.7-1.84.66-2.82V.02Z" />
    </svg>
  );
}

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
  const { allBrands, allProducts, getBrandClaimStatus, updateBrandClaimStatus, brandClaimStatuses } = useGlobalState();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [isReportOpen, setIsReportOpen] = useState(false);
  const [isLoved, setIsLoved] = useState(false);
  const [isFollowed, setIsFollowed] = useState(false);
  const [isClaimModalOpen, setIsClaimModalOpen] = useState(false);

  // Filter States (from Brand Products page)
  const [activeFilter, setActiveFilter] = useState('Full Experience'); // Show Component View Selector
  const [searchFilter, setSearchFilter] = useState('');
  const [currentSearchInput, setCurrentSearchInput] = useState('');
  const [activeSection, setActiveSection] = useState('all');

  // New Filter V2 States
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [priceRangeV2, setPriceRangeV2] = useState<[number, number | null]>([0, null]);
  const [customPriceInputs, setCustomPriceInputs] = useState({ min: '', max: '' });
  const [availabilityFilter, setAvailabilityFilter] = useState<string | null>(null);
  const [ratingFilter, setRatingFilter] = useState<string | null>(null);
  const [votesFilter, setVotesFilter] = useState<string | null>(null);
  const [warrantyFilter, setWarrantyFilter] = useState<string | null>(null);
  const [deliveryFilter, setDeliveryFilter] = useState<string | null>(null);

  // Deal filters
  const [discountFilter, setDiscountFilter] = useState<string | null>(null);
  const [couponFilter, setCouponFilter] = useState<string | null>(null);
  const [expiryFilter, setExpiryFilter] = useState<string | null>(null);

  // Brand filters
  const [productLineFilter, setProductLineFilter] = useState<string | null>(null);
  const [featuredCollectionFilter, setFeaturedCollectionFilter] = useState<string | null>(null);
  const [officialStoreFilter, setOfficialStoreFilter] = useState<string | null>(null);
  const [countryFilter, setCountryFilter] = useState<string | null>(null);

  // Quick action filters managed at core
  const [dealsOnlyFilter, setDealsOnlyFilter] = useState(false);
  const [couponsOnlyFilter, setCouponsOnlyFilter] = useState(false);
  const [verifiedOnlyFilter, setVerifiedOnlyFilter] = useState(false);
  const [inStockOnlyFilter, setInStockOnlyFilter] = useState(false);
  const [featuredOnlyFilter, setFeaturedOnlyFilter] = useState(false);

  // Sort State
  const [sortOption, setSortOption] = useState<string>('default');

  // Smart filters specs State
  const [smartSpecs, setSmartSpecs] = useState<Record<string, string>>({});

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Dynamically resolve brand or fallback to Sailor/fashion-oriented layout
  const brand = allBrands.find(b => 
    String(b.id) === id || 
    b.name.toLowerCase().replace(/\s+/g, '-') === String(id).toLowerCase() || 
    b.name.toLowerCase() === String(id).toLowerCase()
  ) || allBrands.find(b => b.name === 'Sailor') || allBrands[2];

  const [localClaimStatus, setLocalClaimStatus] = useState<'verified' | 'pending' | 'community'>(() => getBrandClaimStatus(brand.id));

  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 8;

  useEffect(() => {
    setCurrentPage(1);
  }, [
    activeFilter, searchFilter, selectedCategory, priceRangeV2, availabilityFilter,
    ratingFilter, votesFilter, warrantyFilter, deliveryFilter, discountFilter,
    couponFilter, expiryFilter, productLineFilter, featuredCollectionFilter,
    officialStoreFilter, countryFilter, dealsOnlyFilter, couponsOnlyFilter,
    verifiedOnlyFilter, inStockOnlyFilter, featuredOnlyFilter, smartSpecs
  ]);

  useEffect(() => {
    setLocalClaimStatus(getBrandClaimStatus(brand.id));
  }, [brand, brandClaimStatuses]);
  
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

  // Filters Engine Implementation V2
  const filteredProducts = useMemo(() => {
    return brandProducts.filter((p: any) => {
      // 1. Search Box
      if (searchFilter && !p.title.toLowerCase().includes(searchFilter.toLowerCase())) {
        return false;
      }

      // 2. Category
      if (selectedCategory && p.category !== selectedCategory) {
        return false;
      }

      // 3. Price Scope (V2 Range)
      const priceNum = typeof p.price === 'number' 
        ? p.price 
        : parseInt(String(p.price).replace(/[^0-9]/g, '')) || 0;
      if (priceNum < priceRangeV2[0]) {
        return false;
      }
      if (priceRangeV2[1] !== null && priceNum > priceRangeV2[1]) {
        return false;
      }

      // 4. Availability
      if (availabilityFilter === 'in-stock' && p.inStock === false) return false;
      if (availabilityFilter === 'out-of-stock' && p.inStock !== false) return false;
      if (inStockOnlyFilter && p.inStock === false) return false;

      // 5. Avg Rating
      const ratingVal = p.rating || 4.2;
      if (ratingFilter && ratingFilter !== 'all') {
        if (ratingVal < parseFloat(ratingFilter)) return false;
      }

      // 6. Votes / Reviews
      const reviewVal = p.reviews || 0;
      if (votesFilter && votesFilter !== 'all') {
        if (reviewVal < parseInt(votesFilter)) return false;
      }

      // 7. Warranty Filter (mock check)
      if (warrantyFilter) {
        const mappedWarranty = (p.id % 3 === 0) ? 'standard' : (p.id % 3 === 1) ? 'extended' : 'none';
        if (mappedWarranty !== warrantyFilter) return false;
      }

      // 8. Delivery Filter
      if (deliveryFilter) {
        let mappedDelivery = 'paid';
        if (p.id % 3 === 0) mappedDelivery = 'free';
        else if (p.id % 3 === 1) mappedDelivery = 'express';
        if (mappedDelivery !== deliveryFilter) return false;
      }

      // 9. Discount Filter (min discount %)
      const discPercent = p.discount || (p.originalPrice ? Math.round(((parseInt(String(p.originalPrice).replace(/[^0-9]/g, '')) - priceNum) / parseInt(String(p.originalPrice).replace(/[^0-9]/g, ''))) * 100) : 0);
      if (discountFilter) {
        if (discPercent < parseInt(discountFilter)) return false;
      }

      // 10. Coupon Available Filter
      if (couponFilter === 'yes' && p.id % 2 !== 0) return false;
      if (couponFilter === 'no' && p.id % 2 === 0) return false;

      // 11. Expiry Filter
      if (expiryFilter === 'active' && p.id % 6 === 5) return false;
      if (expiryFilter === 'expired' && p.id % 6 !== 5) return false;

      // 12. Country of Origin
      if (countryFilter) {
        const mappedOrigin = (p.id % 4 === 0) ? 'Bangladesh' : (p.id % 4 === 1) ? 'China' : (p.id % 4 === 2) ? 'Vietnam' : 'India';
        if (mappedOrigin !== countryFilter) return false;
      }

      // 13. Brand Product Line / Featured Collections
      if (productLineFilter) {
        const mappedLine = (p.id % 3 === 0) ? 'premium' : (p.id % 3 === 1) ? 'standard' : 'budget';
        if (mappedLine !== productLineFilter) return false;
      }
      if (featuredCollectionFilter) {
        const mappedColl = (p.id % 3 === 0) ? 'summer' : (p.id % 3 === 1) ? 'winter' : 'festive';
        if (mappedColl !== featuredCollectionFilter) return false;
      }
      if (officialStoreFilter === 'yes' && p.id % 3 === 2) return false;
      if (officialStoreFilter === 'no' && p.id % 3 !== 2) return false;

      // Quick Toolbar triggers
      if (dealsOnlyFilter && !p.discount && !p.originalPrice && p.tag !== 'SALE') return false;
      if (couponsOnlyFilter && p.id % 2 !== 0) return false;
      if (verifiedOnlyFilter && localClaimStatus !== 'verified') return false;
      if (featuredOnlyFilter && !p.tag) return false;

      // 14. Smart Specs (Category smart filters)
      for (const [specKey, specVal] of Object.entries(smartSpecs)) {
        if (specVal) {
          const valHash = ((p.id || 0) + specKey.length) % 3;
          if (specKey === 'size') {
            const sizeVal = (p.id % 3 === 0) ? 'm' : (p.id % 3 === 1) ? 'l' : 'xl';
            if (sizeVal !== specVal) return false;
          } else if (specKey === 'gender') {
            const genderVal = (p.id % 3 === 0) ? 'men' : (p.id % 3 === 1) ? 'women' : 'unisex';
            if (genderVal !== specVal) return false;
          } else if (specKey === 'ram') {
            const ramVal = (p.id % 3 === 0) ? '8gb' : (p.id % 3 === 1) ? '12gb' : '16gb';
            if (ramVal !== specVal) return false;
          } else if (specKey === 'storage') {
            const storageVal = (p.id % 3 === 0) ? '128gb' : (p.id % 3 === 1) ? '256gb' : '512gb';
            if (storageVal !== specVal) return false;
          } else if (specKey === 'battery') {
            const battVal = (p.id % 3 === 0) ? '4500-5000' : '5000plus';
            if (battVal !== specVal) return false;
          } else {
            if (valHash !== 0) return false;
          }
        }
      }

      return true;
    });
  }, [brandProducts, searchFilter, selectedCategory, priceRangeV2, availabilityFilter, ratingFilter, votesFilter, warrantyFilter, deliveryFilter, discountFilter, couponFilter, expiryFilter, productLineFilter, featuredCollectionFilter, officialStoreFilter, countryFilter, dealsOnlyFilter, couponsOnlyFilter, verifiedOnlyFilter, inStockOnlyFilter, featuredOnlyFilter, smartSpecs, localClaimStatus]);

  // Dynamic Sorting Engine
  const sortedProducts = useMemo(() => {
    const list = [...filteredProducts] as any[];
    if (sortOption === 'price-asc') {
      return list.sort((a, b) => {
        const prA = typeof a.price === 'number' ? a.price : parseInt(String(a.price).replace(/[^0-9]/g, '')) || 0;
        const prB = typeof b.price === 'number' ? b.price : parseInt(String(b.price).replace(/[^0-9]/g, '')) || 0;
        return prA - prB;
      });
    }
    if (sortOption === 'price-desc') {
      return list.sort((a, b) => {
        const prA = typeof a.price === 'number' ? a.price : parseInt(String(a.price).replace(/[^0-9]/g, '')) || 0;
        const prB = typeof b.price === 'number' ? b.price : parseInt(String(b.price).replace(/[^0-9]/g, '')) || 0;
        return prB - prA;
      });
    }
    if (sortOption === 'rating-desc') {
      return list.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    }
    if (sortOption === 'discount-desc') {
      return list.sort((a, b) => {
        const discA = a.discount || 0;
        const discB = b.discount || 0;
        return discB - discA;
      });
    }
    return list;
  }, [filteredProducts, sortOption]);

  const totalPages = Math.ceil(sortedProducts.length / productsPerPage);
  const paginatedProducts = sortedProducts.slice((currentPage - 1) * productsPerPage, currentPage * productsPerPage);

  // Extract deals (with specific tags or Sale flags)
  const filteredDeals = sortedProducts.filter((p: any) => 
    p.tag === 'SALE' || p.tag === 'HOT' || p.tag === 'NEW' || p.discount
  );
  // Guarantee always active deals fallback
  const finalDeals = filteredDeals.length > 0 ? filteredDeals : sortedProducts.slice(0, 3);
  
  // Counts
  const totalDealsFound = finalDeals.length;
  const totalProductsFound = sortedProducts.length || brandProducts.length;

  const clearAllFilters = () => {
    setSelectedCategory(null);
    setPriceRangeV2([0, null]);
    setCustomPriceInputs({ min: '', max: '' });
    setAvailabilityFilter(null);
    setRatingFilter(null);
    setVotesFilter(null);
    setWarrantyFilter(null);
    setDeliveryFilter(null);
    setDiscountFilter(null);
    setCouponFilter(null);
    setExpiryFilter(null);
    setProductLineFilter(null);
    setFeaturedCollectionFilter(null);
    setOfficialStoreFilter(null);
    setCountryFilter(null);
    setDealsOnlyFilter(false);
    setCouponsOnlyFilter(false);
    setVerifiedOnlyFilter(false);
    setInStockOnlyFilter(false);
    setFeaturedOnlyFilter(false);
    setSortOption('default');
    setSmartSpecs({});
    setSearchFilter('');
    setCurrentSearchInput('');
  };



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
    <div className="flex flex-col min-h-screen bg-choosify-feed">
      
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
                       {localClaimStatus === 'verified' && (
                          <div className="absolute -top-1.5 -right-1.5 w-7 h-7 bg-[#E8500A] rounded-full flex items-center justify-center text-white border-2 border-[#10133A] shadow-lg">
                             <CheckCircle2 size={13} fill="currentColor" className="text-white stroke-[#E8500A]" />
                          </div>
                       )}
                    </div>

                    <div className="w-full flex-1 flex flex-col items-center lg:items-start">
                       <div className="flex flex-col sm:flex-row items-center gap-3 mb-2 flex-wrap justify-center lg:justify-start">
                          <h1 className="text-3xl md:text-5xl font-black text-white italic tracking-tighter leading-none text-center lg:text-left">{brand.name}</h1>
                          {localClaimStatus === 'verified' && (
                             <div className="bg-[#4DBC15] px-3 py-1 rounded-full flex items-center gap-2 shadow-md">
                                <ShieldCheck size={11} className="text-white" />
                                <span className="text-[9px] font-black text-white uppercase tracking-widest italic whitespace-nowrap">Verified Brand Owner</span>
                             </div>
                          )}
                          {localClaimStatus === 'pending' && (
                             <div className="bg-amber-500/80 backdrop-blur-sm px-3 py-1 rounded-full flex items-center gap-2 shadow-md border border-white/10">
                                <HelpCircle size={11} className="text-white" />
                                <span className="text-[9px] font-black text-white uppercase tracking-widest italic whitespace-nowrap">Ownership Verification Pending</span>
                             </div>
                          )}
                          {localClaimStatus === 'community' && (
                             <div className="bg-white/10 backdrop-blur-sm px-3 py-1 rounded-full flex items-center gap-2 shadow-sm border border-white/5">
                                <Users size={11} className="text-white/70" />
                                <span className="text-[9px] font-black text-white/90 uppercase tracking-widest italic whitespace-nowrap">Community Brand Profile</span>
                             </div>
                          )}
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

                        {localClaimStatus === 'community' && (
                           <button 
                             onClick={() => {
                                setIsClaimModalOpen(true); return;
                                setTimeout(() => {
                                   updateBrandClaimStatus(brand.id, 'pending');
                                   toast.success("Claim submitted successfully! Status changed to Pending Review.", { duration: 5000 });
                                }, 1500);
                             }}
                             className="text-[10px] md:text-[11px] font-black uppercase px-6 md:px-8 py-3.5 md:py-4.5 rounded-full tracking-wider shadow-xl transition-all transform hover:scale-105 active:scale-95 italic border cursor-pointer bg-white text-navy border-white hover:bg-gray-100 flex items-center gap-1.5"
                           >
                              <ShieldCheck size={14} className="shrink-0" />
                              <span>Claim Ownership</span>
                           </button>
                        )}

                        {localClaimStatus === 'pending' && (
                           <div className="text-[10px] md:text-[11px] font-black uppercase px-6 md:px-8 py-3.5 md:py-4.5 rounded-full tracking-wider shadow-md bg-amber-500 text-white border border-amber-500/35 italic flex items-center gap-1.5 select-none hover:cursor-default">
                              <Clock size={14} className="shrink-0" />
                              <span>Verification Pending</span>
                           </div>
                        )}

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
                      <a href="#" className="group flex flex-col items-center gap-1.5 focus:outline-none">
                         <div className="w-11 h-11 rounded-full flex items-center justify-center bg-white/5 border border-white/10 text-white hover:border-[#F97316] hover:text-[#F97316] hover:bg-[#F97316]/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F97316] transition-all duration-300 active:scale-95 shadow-md">
                           <Facebook size={20} />
                         </div>
                         <span className="text-[14px] text-white/50 group-hover:text-[#F97316] font-normal transition-colors">Facebook</span>
                      </a>
                      <a href="#" className="group flex flex-col items-center gap-1.5 focus:outline-none">
                         <div className="w-11 h-11 rounded-full flex items-center justify-center bg-white/5 border border-white/10 text-white hover:border-[#F97316] hover:text-[#F97316] hover:bg-[#F97316]/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F97316] transition-all duration-300 active:scale-95 shadow-md">
                           <Instagram size={20} />
                         </div>
                         <span className="text-[14px] text-white/50 group-hover:text-[#F97316] font-normal transition-colors">Instagram</span>
                      </a>
                      <a href="#" className="group flex flex-col items-center gap-1.5 focus:outline-none">
                         <div className="w-11 h-11 rounded-full flex items-center justify-center bg-white/5 border border-white/10 text-white hover:border-[#F97316] hover:text-[#F97316] hover:bg-[#F97316]/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F97316] transition-all duration-300 active:scale-95 shadow-md">
                           <TikTokIcon size={20} />
                         </div>
                         <span className="text-[14px] text-white/50 group-hover:text-[#F97316] font-normal transition-colors">TikTok</span>
                      </a>
                      <a href="#" className="group flex flex-col items-center gap-1.5 focus:outline-none">
                         <div className="w-11 h-11 rounded-full flex items-center justify-center bg-white/5 border border-white/10 text-white hover:border-[#F97316] hover:text-[#F97316] hover:bg-[#F97316]/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F97316] transition-all duration-300 active:scale-95 shadow-md">
                           <Youtube size={20} />
                         </div>
                         <span className="text-[14px] text-white/50 group-hover:text-[#F97316] font-normal transition-colors">YouTube</span>
                      </a>
                    </div>
                 </div>
              </div>

              {/* Right Side: Score card */}
              <div className="w-full lg:w-full max-w-md relative order-3 lg:order-none flex flex-col justify-between h-auto lg:h-full mx-auto lg:mx-0 gap-5 lg:gap-4">
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
                 <div className="relative flex flex-wrap items-center justify-center lg:justify-end gap-3 z-20 mt-5 lg:mt-4 lg:pt-2.5 w-full">
                    <button 
                      onClick={() => {
                        navigator.clipboard.writeText(window.location.href);
                        toast.success("Page link copied to clipboard!");
                      }}
                      className="w-11 h-11 min-w-[44px] min-h-[44px] shrink-0 rounded-full bg-white text-[#1A1D4E] shadow-xl border border-gray-100 flex items-center justify-center hover:scale-110 active:scale-95 transition-all cursor-pointer hover:bg-gray-50 text-navy"
                    >
                       <Share2 size={16} />
                    </button>
                    <button 
                      onClick={() => toast.success(`${brand.name} saved to your bookmarks!`)}
                      className="w-11 h-11 min-w-[44px] min-h-[44px] shrink-0 rounded-full bg-white text-[#1A1D4E] shadow-xl border border-gray-100 flex items-center justify-center hover:scale-110 active:scale-95 transition-all cursor-pointer hover:bg-gray-50 text-navy"
                    >
                       <Bookmark size={15} />
                    </button>
                 </div>
              </div>

              {/* Mobile Social links */}
              <div className="flex lg:hidden items-center gap-4 mt-8 flex-wrap justify-center order-5 w-full">
                 <span className="text-white text-[10px] font-black uppercase tracking-widest border-b-2 border-[#E8500A] pb-1 italic">Find Us On</span>
                 <div className="flex items-center gap-6 justify-center">
                   {/* Facebook */}
                   <div className="flex flex-col items-center gap-2 group cursor-pointer">
                     <a 
                       href="#" 
                       className="w-11 h-11 rounded-full flex items-center justify-center bg-white/5 border border-white/10 text-white hover:border-[#F97316] hover:text-[#F97316] hover:bg-[#F97316]/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F97316] transition-all duration-300 active:scale-95"
                       aria-label="Facebook"
                     >
                       <Facebook size={20} />
                     </a>
                     <span className="text-[14px] text-white/50 group-hover:text-[#F97316] font-normal transition-colors">
                       Facebook
                     </span>
                   </div>

                   {/* Instagram */}
                   <div className="flex flex-col items-center gap-2 group cursor-pointer">
                     <a 
                       href="#" 
                       className="w-11 h-11 rounded-full flex items-center justify-center bg-white/5 border border-white/10 text-white hover:border-[#F97316] hover:text-[#F97316] hover:bg-[#F97316]/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F97316] transition-all duration-300 active:scale-95"
                       aria-label="Instagram"
                     >
                       <Instagram size={20} />
                     </a>
                     <span className="text-[14px] text-white/50 group-hover:text-[#F97316] font-normal transition-colors">
                       Instagram
                     </span>
                   </div>

                   {/* TikTok */}
                   <div className="flex flex-col items-center gap-2 group cursor-pointer">
                     <a 
                       href="#" 
                       className="w-11 h-11 rounded-full flex items-center justify-center bg-white/5 border border-white/10 text-white hover:border-[#F97316] hover:text-[#F97316] hover:bg-[#F97316]/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F97316] transition-all duration-300 active:scale-95"
                       aria-label="TikTok"
                     >
                       <TikTokIcon size={20} />
                     </a>
                     <span className="text-[14px] text-white/50 group-hover:text-[#F97316] font-normal transition-colors">
                       TikTok
                     </span>
                   </div>

                   {/* YouTube */}
                   <div className="flex flex-col items-center gap-2 group cursor-pointer">
                     <a 
                       href="#" 
                       className="w-11 h-11 rounded-full flex items-center justify-center bg-white/5 border border-white/10 text-white hover:border-[#F97316] hover:text-[#F97316] hover:bg-[#F97316]/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F97316] transition-all duration-300 active:scale-95"
                       aria-label="YouTube"
                     >
                       <Youtube size={20} />
                     </a>
                     <span className="text-[14px] text-white/50 group-hover:text-[#F97316] font-normal transition-colors">
                       YouTube
                     </span>
                   </div>
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

      {/* QUICK FILTER BAR & ACTIVE FILTER CHIPS (V2 Architecture) */}
      <QuickFilterBar
        title="Brand Catalog Quick Specs"
        onOpenFullFilters={() => {
          const el = document.getElementById("brand-sidebar-filters");
          if (el) {
            el.scrollIntoView({ behavior: 'smooth', block: 'center' });
            el.classList.add("ring-2", "ring-orange-primary/50");
            setTimeout(() => el.classList.remove("ring-2", "ring-orange-primary/50"), 1500);
          }
        }}
        filters={[
          {
            id: 'all-products',
            label: 'All Products',
            active: !dealsOnlyFilter && !couponsOnlyFilter && !verifiedOnlyFilter && !inStockOnlyFilter && !featuredOnlyFilter,
            onClick: () => {
              setDealsOnlyFilter(false);
              setCouponsOnlyFilter(false);
              setVerifiedOnlyFilter(false);
              setInStockOnlyFilter(false);
              setFeaturedOnlyFilter(false);
            }
          },
          {
            id: 'deals-only',
            label: 'Deals',
            active: dealsOnlyFilter,
            onClick: () => setDealsOnlyFilter(!dealsOnlyFilter)
          },
          {
            id: 'coupons-only',
            label: 'Coupons Available',
            active: couponsOnlyFilter,
            onClick: () => setCouponsOnlyFilter(!couponsOnlyFilter)
          },
          {
            id: 'verified',
            label: 'Verified Store',
            active: verifiedOnlyFilter,
            onClick: () => setVerifiedOnlyFilter(!verifiedOnlyFilter)
          },
          {
            id: 'in-stock',
            label: 'In Stock',
            active: inStockOnlyFilter,
            onClick: () => setInStockOnlyFilter(!inStockOnlyFilter)
          },
          {
            id: 'featured',
            label: 'Featured',
            active: featuredOnlyFilter,
            onClick: () => setFeaturedOnlyFilter(!featuredOnlyFilter)
          },
          {
            id: 'sort',
            label: sortOption === 'default' ? 'Sort Selection' : `Sort: ${
              sortOption === 'price-asc' ? '৳ Low to High' :
              sortOption === 'price-desc' ? '৳ High to Low' :
              sortOption === 'rating-desc' ? 'Top Rating' : 'Best Discount'
            }`,
            active: sortOption !== 'default',
            onClick: () => {
              // Cycle through sort options
              setSortOption(prev => {
                if (prev === 'default') return 'price-asc';
                if (prev === 'price-asc') return 'price-desc';
                if (prev === 'price-desc') return 'rating-desc';
                if (prev === 'rating-desc') return 'discount-desc';
                return 'default';
              });
            }
          }
        ]}
      />

      {/* ACTIVE FILTER CHIPS ROW */}
      <ActiveFilterChips
        chips={[
          selectedCategory ? { id: 'category', label: `Category: ${selectedCategory}`, onRemove: () => setSelectedCategory(null) } : null,
          (priceRangeV2[0] > 0 || priceRangeV2[1] !== null) ? {
            id: 'price',
            label: `Price: ৳${priceRangeV2[0].toLocaleString()}–${priceRangeV2[1] !== null ? `৳${priceRangeV2[1].toLocaleString()}` : 'Max'}`,
            onRemove: () => {
              setCustomPriceInputs({ min: '', max: '' });
              setPriceRangeV2([0, null]);
            }
          } : null,
          availabilityFilter ? { id: 'availability', label: `Stock: ${availabilityFilter}`, onRemove: () => setAvailabilityFilter(null) } : null,
          ratingFilter ? { id: 'rating', label: `Min Rating: ${ratingFilter}★`, onRemove: () => setRatingFilter(null) } : null,
          votesFilter ? { id: 'votes', label: `Min Votes: ${votesFilter}♥`, onRemove: () => setVotesFilter(null) } : null,
          warrantyFilter ? { id: 'warranty', label: `Warranty: ${warrantyFilter}`, onRemove: () => setWarrantyFilter(null) } : null,
          deliveryFilter ? { id: 'delivery', label: `Delivery: ${deliveryFilter}`, onRemove: () => setDeliveryFilter(null) } : null,
          discountFilter ? { id: 'discount', label: `Min Discount: ${discountFilter}%`, onRemove: () => setDiscountFilter(null) } : null,
          couponFilter ? { id: 'coupon', label: `Coupons: ${couponFilter}`, onRemove: () => setCouponFilter(null) } : null,
          expiryFilter ? { id: 'expiry', label: `Expiry: ${expiryFilter}`, onRemove: () => setExpiryFilter(null) } : null,
          productLineFilter ? { id: 'product_line', label: `Line: ${productLineFilter}`, onRemove: () => setProductLineFilter(null) } : null,
          featuredCollectionFilter ? { id: 'featured_collection', label: `Collection: ${featuredCollectionFilter}`, onRemove: () => setFeaturedCollectionFilter(null) } : null,
          officialStoreFilter ? { id: 'official_store', label: `Official: ${officialStoreFilter}`, onRemove: () => setOfficialStoreFilter(null) } : null,
          countryFilter ? { id: 'country', label: `Origin: ${countryFilter}`, onRemove: () => setCountryFilter(null) } : null,
          dealsOnlyFilter ? { id: 'deals_only', label: 'Deals Only', onRemove: () => setDealsOnlyFilter(false) } : null,
          couponsOnlyFilter ? { id: 'coupons_only', label: 'Coupons Only', onRemove: () => setCouponsOnlyFilter(false) } : null,
          verifiedOnlyFilter ? { id: 'verified_only', label: 'Verified Only', onRemove: () => setVerifiedOnlyFilter(false) } : null,
          inStockOnlyFilter ? { id: 'instock_only', label: 'In Stock Only', onRemove: () => setInStockOnlyFilter(false) } : null,
          featuredOnlyFilter ? { id: 'featured_only', label: 'Featured Only', onRemove: () => setFeaturedOnlyFilter(false) } : null,
          ...Object.entries(smartSpecs).map(([key, val]) => val ? {
            id: `smart-${key}`,
            label: `${key.toUpperCase()}: ${val}`,
            onRemove: () => setSmartSpecs(prev => ({ ...prev, [key]: null as any }))
          } : null)
        ].filter(Boolean) as any[]}
        onClearAll={clearAllFilters}
      />

      {/* 4. Unified Scrollable Body Wrapper */}
      <div className="max-w-[1440px] mx-auto px-4 py-5 w-full flex flex-col gap-16">
         
         {/* EXCLUSIVE DEALS & PRODUCT CATALOG THREE COLUMN SPLIT GRID */}
         <div className="grid grid-cols-1 lg:grid-cols-[240px_minmax(0,1fr)_260px] xl:grid-cols-[280px_minmax(0,1fr)_310px] gap-4 items-start w-full relative">
            
            {/* COLUMN 1: LEFT COLUMN */}
            <aside className="hidden lg:flex flex-col gap-4 lg:sticky lg:top-24 pb-10 flex-shrink-0 animate-fade-in text-left">
               <QuickAccessCard />
               <div id="brand-sidebar-filters" className="transition-all duration-300 rounded-[5px] w-full">
                  <FullSidebarFilterPanel
                    title="Filter Catalog"
                    onReset={clearAllFilters}
                    advancedSection={
                      <div className="flex flex-col gap-4">
                        {/* Dynamic Smart Filters depending on the brand category */}
                        <CategorySmartFilters
                          category={brand.category || 'Fashion & Clothing'}
                          activeSpecs={smartSpecs}
                          onSpecChange={(specKey, val) => {
                            setSmartSpecs(prev => ({ ...prev, [specKey]: val || '' }));
                          }}
                        />

                        {/* Rendering Advanced Deal and Brand filters */}
                        <UniversalFilterRenderer
                          profile={{
                            entity: 'products',
                            filters: [
                              {
                                id: 'warranty',
                                name: 'Warranty Scope',
                                type: 'single_select',
                                options: [
                                  { value: 'all', label: 'Any Warranty' },
                                  { value: 'standard', label: 'Standard Brand Warranty' },
                                  { value: 'extended', label: 'Extended Merchant Warranty' },
                                  { value: 'none', label: 'No Warranty' }
                                ]
                              },
                              {
                                id: 'delivery',
                                name: 'Delivery Channel',
                                type: 'single_select',
                                options: [
                                  { value: 'all', label: 'All Delivery options' },
                                  { value: 'free', label: 'Free Delivery' },
                                  { value: 'paid', label: 'Standard Delivery' },
                                  { value: 'express', label: 'Express (Dhaka Metro)' }
                                ]
                              },
                              {
                                id: 'discount',
                                name: 'Minimum Discount',
                                type: 'single_select',
                                options: [
                                  { value: 'all', label: 'Any Discount' },
                                  { value: '10', label: '10% Off or More' },
                                  { value: '25', label: '25% Off or More' },
                                  { value: '55', label: '55% Off or More' }
                                ]
                              },
                              {
                                id: 'coupon',
                                name: 'Coupon Available',
                                type: 'single_select',
                                options: [
                                  { value: 'all', label: 'Display All' },
                                  { value: 'yes', label: 'Coupons Available' },
                                  { value: 'no', label: 'No Coupons' }
                                ]
                              },
                              {
                                id: 'expiry',
                                name: 'Deal Expiry Status',
                                type: 'single_select',
                                options: [
                                  { value: 'all', label: 'All Statuses' },
                                  { value: 'active', label: 'Active Deals Only' },
                                  { value: 'expired', label: 'Expired Deals' }
                                ]
                              },
                              {
                                id: 'product_line',
                                name: 'Product Line Type',
                                type: 'single_select',
                                options: [
                                  { value: 'all', label: 'All Lines' },
                                  { value: 'premium', label: 'Premium Class' },
                                  { value: 'standard', label: 'Standard Class' },
                                  { value: 'budget', label: 'Budget/Crucial' }
                                ]
                              },
                              {
                                id: 'featured_collection',
                                name: 'Featured Collections',
                                type: 'single_select',
                                options: [
                                  { value: 'all', label: 'All Collections' },
                                  { value: 'summer', label: 'Summer Air' },
                                  { value: 'winter', label: 'Winter Cozy' },
                                  { value: 'festive', label: 'Festive / Eid Special' }
                                ]
                              },
                              {
                                id: 'official_store',
                                name: 'Official Outlet Sourced',
                                type: 'single_select',
                                options: [
                                  { value: 'all', label: 'All Stores' },
                                  { value: 'yes', label: 'Official Store Only' },
                                  { value: 'no', label: 'Third-party Retailer' }
                                ]
                              },
                              {
                                id: 'country',
                                name: 'Country of Origin',
                                type: 'single_select',
                                options: [
                                  { value: 'all', label: 'All Countries' },
                                  { value: 'Bangladesh', label: 'Bangladesh' },
                                  { value: 'China', label: 'China' },
                                  { value: 'Vietnam', label: 'Vietnam' },
                                  { value: 'India', label: 'India' }
                                ]
                              }
                            ]
                          }}
                          activeFilters={{
                            warranty: warrantyFilter,
                            delivery: deliveryFilter,
                            discount: discountFilter,
                            coupon: couponFilter,
                            expiry: expiryFilter,
                            product_line: productLineFilter,
                            featured_collection: featuredCollectionFilter,
                            official_store: officialStoreFilter,
                            country: countryFilter
                          }}
                          onFilterChange={(filterId, val) => {
                            const cleanVal = val === 'all' ? null : val;
                            if (filterId === 'warranty') setWarrantyFilter(cleanVal);
                            if (filterId === 'delivery') setDeliveryFilter(cleanVal);
                            if (filterId === 'discount') setDiscountFilter(cleanVal);
                            if (filterId === 'coupon') setCouponFilter(cleanVal);
                            if (filterId === 'expiry') setExpiryFilter(cleanVal);
                            if (filterId === 'product_line') setProductLineFilter(cleanVal);
                            if (filterId === 'featured_collection') setFeaturedCollectionFilter(cleanVal);
                            if (filterId === 'official_store') setOfficialStoreFilter(cleanVal);
                            if (filterId === 'country') setCountryFilter(cleanVal);
                          }}
                        />
                      </div>
                    }
                  >
                     <UniversalFilterRenderer
                       profile={{
                         entity: 'products',
                         filters: [
                           {
                             id: 'price_custom',
                             name: 'Price Scope (BDT)',
                             type: 'price_custom',
                           },
                           {
                             id: 'category',
                             name: 'Categories',
                             type: 'single_select',
                             options: [
                               { value: 'all', label: 'All Categories' },
                               ...finalCategoriesList.map(cat => ({ value: cat.name, label: cat.name, count: cat.count }))
                             ]
                           },
                           {
                             id: 'availability',
                             name: 'Availability',
                             type: 'single_select',
                             options: [
                               { value: 'all', label: 'All Items' },
                               { value: 'in-stock', label: 'In Stock' },
                               { value: 'out-of-stock', label: 'Out of Stock' }
                             ]
                           },
                           {
                             id: 'rating',
                             name: 'Average Rating',
                             type: 'single_select',
                             options: [
                               { value: 'all', label: 'All Ratings' },
                               { value: '4.8', label: '4.8★ & Up' },
                               { value: '4.5', label: '4.5★ & Up' },
                               { value: '4.0', label: '4.0★ & Up' }
                             ]
                           },
                           {
                             id: 'votes',
                             name: 'Audience Votes',
                             type: 'single_select',
                             options: [
                               { value: 'all', label: 'Any Vote Count' },
                               { value: '500', label: '500+ Votes' },
                               { value: '300', label: '300+ Votes' },
                               { value: '100', label: '100+ Votes' }
                             ]
                           }
                         ]
                       }}
                       activeFilters={{
                         price_custom: true,
                         category: selectedCategory,
                         availability: availabilityFilter,
                         rating: ratingFilter,
                         votes: votesFilter
                       }}
                       onFilterChange={(filterId, val) => {
                         const cleanVal = val === 'all' ? null : val;
                         if (filterId === 'category') setSelectedCategory(cleanVal);
                         if (filterId === 'availability') setAvailabilityFilter(cleanVal);
                         if (filterId === 'rating') setRatingFilter(cleanVal);
                         if (filterId === 'votes') setVotesFilter(cleanVal);
                       }}
                       customPriceInputs={customPriceInputs}
                       setCustomPriceInputs={setCustomPriceInputs}
                       onCustomPriceApply={(min, max) => {
                         setPriceRangeV2([min, max]);
                       }}
                     />
                  </FullSidebarFilterPanel>
               </div>
            </aside>

            {/* COLUMN 2: EXCLUSIVE DEALS & PRODUCTS CATALOG (Center scroll) */}
            <main className="scroll-mt-36 min-w-0 pb-10 flex flex-col gap-12">
               
               {/* Brand Claim Acquisition Card (Part 6) */}
               {(localClaimStatus === 'community' || localClaimStatus === 'pending') && (
                  <div className="bg-gradient-to-r from-[#FFF0E8]/50 to-[#FFE5D9]/30 border-2 border-[#FFE5D9] rounded-[5px] p-6 md:p-8 shadow-xs flex flex-col md:flex-row items-center gap-6 text-left animate-fade-in relative overflow-hidden mb-6">
                     <div className="absolute top-0 right-0 w-24 h-24 bg-[#E8500A]/5 blur-xl rounded-full" />
                     <div className="w-12 h-12 rounded-full bg-[#E8500A]/10 flex items-center justify-center shrink-0 font-bold text-[#E8500A]">
                        <ShieldCheck className="w-6 h-6 text-[#E8500A]" />
                     </div>
                     <div className="flex-1 space-y-2">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[8px] font-black uppercase tracking-wider bg-[#FFF0E8] text-[#E8500A] border border-[#FFE5D9]">
                           {localClaimStatus === 'pending' ? 'Verification Pending Review' : 'Claim Acquisition Panel'}
                        </span>
                        <h4 className="text-sm font-black text-navy uppercase tracking-tight leading-none mb-1 font-space">
                           {localClaimStatus === 'pending' ? 'Ownership Claim Under Active Review' : 'Are you an authorized representative of this brand?'}
                        </h4>
                        <p className="text-xs text-gray-600 font-semibold leading-relaxed">
                           {localClaimStatus === 'pending' 
                             ? 'Our moderators are actively processing your submitted credentials relative to this brand representative request. Complete access will be unlocked shortly.'
                             : 'This community brand profile contains curated information from public web indexes. Claim ownership to configure your premium merchant storefront, sync inventory, and unlock the seller suite.'}
                        </p>
                        
                        {/* Benefits Grid */}
                        <div className="pt-2">
                           <p className="text-[10px] font-black text-[#1A1D4E] uppercase tracking-widest mb-2 font-mono">Claim ownership to:</p>
                           <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-gray-700 font-bold text-left">
                              <div className="flex items-center gap-1.5">
                                 <CheckCircle2 className="w-3.5 h-3.5 text-[#4DBC15] shrink-0" />
                                 <span>Add products</span>
                              </div>
                              <div className="flex items-center gap-1.5">
                                 <CheckCircle2 className="w-3.5 h-3.5 text-[#4DBC15] shrink-0" />
                                 <span>Launch promotions</span>
                              </div>
                              <div className="flex items-center gap-1.5">
                                 <CheckCircle2 className="w-3.5 h-3.5 text-[#4DBC15] shrink-0" />
                                 <span>Publish coupons</span>
                              </div>
                              <div className="flex items-center gap-1.5">
                                 <CheckCircle2 className="w-3.5 h-3.5 text-[#4DBC15] shrink-0" />
                                 <span>Collaborate with creators</span>
                              </div>
                              <div className="flex items-center gap-1.5 sm:col-span-2">
                                 <CheckCircle2 className="w-3.5 h-3.5 text-[#4DBC15] shrink-0" />
                                 <span>Access business insights & store diagnostics</span>
                              </div>
                           </div>
                        </div>
                     </div>
                     <div className="shrink-0 w-full md:w-auto self-stretch flex items-center justify-center">
                        {localClaimStatus === 'community' ? (
                          <button 
                             onClick={() => {
                                toast.loading("Initiating secure brand ownership verification link...", { duration: 1500 });
                                setTimeout(() => {
                                   updateBrandClaimStatus(brand.id, 'pending');
                                   toast.success("Verification link generated! Ready for credential matching review.");
                                }, 1500);
                             }}
                             className="w-full md:w-auto px-6 py-4 bg-[#E8500A] hover:bg-[#ff5d14] text-white font-black uppercase text-[10px] tracking-widest italic rounded-full shadow-lg hover:shadow-[#E8500A]/30 active:scale-95 transition-all text-center cursor-pointer border-none"
                          >
                             Claim Ownership
                          </button>
                        ) : (
                          <div className="px-5 py-3.5 bg-amber-500/10 border border-amber-500/30 rounded-[5px] flex flex-col items-center gap-1 text-center shrink-0">
                            <span className="text-[8px] font-black text-amber-700 uppercase tracking-wider">● Verification Active</span>
                            <span className="text-[10px] font-black text-navy uppercase italic">Under Review</span>
                          </div>
                        )}
                     </div>
                  </div>
               )}
               
               {/* A. DEALS SECTION */}
               {(activeFilter === 'Full Experience' || activeFilter === 'Exclusive Deals Only') && (
                  <div id="deals-section" className="scroll-mt-36">
                     <div className="mb-6 text-left">
                        <h2 className="text-2xl font-black text-[#1A1D4E] italic tracking-tighter uppercase mb-0.5">Exclusive Deals</h2>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.3em] italic">Deals found matching current selections</p>
                     </div>
                     
                     {localClaimStatus !== 'verified' ? (
                        <div className="bg-gray-50/60 border border-dashed border-gray-200 rounded-3xl p-8 text-center flex flex-col items-center justify-center gap-3 w-full shadow-inner py-10">
                           <div className="w-12 h-12 rounded-full bg-[#E8500A]/10 flex items-center justify-center text-[#E8500A]">
                              <Lock className="w-5 h-5" />
                           </div>
                           <h3 className="text-sm font-black text-[#1A1D4E] uppercase tracking-tight">Active Exclusive Deals Locked</h3>
                           <p className="text-xs text-gray-500 font-bold max-w-sm">
                              Merchant-published coupons, flash discounts, and promotional banners are locked until ownership is verified.
                           </p>
                           {localClaimStatus === 'community' && (
                              <button 
                                onClick={() => {
                                   toast.loading("Initiating secure brand verification link...", { duration: 1500 });
                                   setTimeout(() => {
                                      updateBrandClaimStatus(brand.id, 'pending');
                                      toast.success("Verification submission parsed! Your status is now Pending Review.");
                                   }, 1500);
                                }}
                                className="bg-[#E8500A] hover:bg-[#ff5d14] text-white py-2 px-6 rounded-full text-[10px] font-black uppercase tracking-wider italic mt-2 cursor-pointer transition-all border-none"
                              >
                                Claim Brand Ownership
                              </button>
                           )}
                           {localClaimStatus === 'pending' && (
                              <div className="text-[10px] font-black text-amber-600 uppercase italic tracking-widest mt-2">
                                 Ownership Verification Under Review
                              </div>
                           )}
                        </div>
                     ) : finalDeals.length > 0 ? (
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

                     {localClaimStatus !== 'verified' ? (
                        <div className="bg-gray-50/60 border border-dashed border-gray-200 rounded-3xl p-8 text-center flex flex-col items-center justify-center gap-3 w-full shadow-inner py-12">
                           <div className="w-12 h-12 rounded-full bg-[#E8500A]/10 flex items-center justify-center text-[#E8500A]">
                              <Lock className="w-5 h-5" />
                           </div>
                           <h3 className="text-sm font-black text-[#1A1D4E] uppercase tracking-tight">Authorized Product Catalog Locked</h3>
                           <p className="text-xs text-gray-500 font-bold max-w-sm">
                              The full catalog, price list sync, inventory metrics, and product grids are locked. Currently unclaimed profiles are restricted from showing merchant content.
                           </p>
                           {localClaimStatus === 'community' && (
                              <button 
                                onClick={() => {
                                   toast.loading("Initiating secure brand verification link...", { duration: 1500 });
                                   setTimeout(() => {
                                      updateBrandClaimStatus(brand.id, 'pending');
                                      toast.success("Verification submission parsed! Your status is now Pending Review.");
                                   }, 1500);
                                }}
                                className="bg-[#E8500A] hover:bg-[#ff5d14] text-white py-2 px-6 rounded-full text-[10px] font-black uppercase tracking-wider italic mt-2 cursor-pointer transition-all border-none"
                              >
                                Claim Brand Ownership
                              </button>
                           )}
                           {localClaimStatus === 'pending' && (
                              <div className="text-[10px] font-black text-amber-600 uppercase italic tracking-widest mt-2">
                                 Verification Pending Review
                              </div>
                           )}
                        </div>
                     ) : filteredProducts.length > 0 ? (
                        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-5 justify-items-center">
                           {paginatedProducts.map((product: any, i: number) => (
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
                     {localClaimStatus === 'verified' && totalPages > 1 && (
                         <div className="mt-16 pt-12 border-t border-gray-100 flex flex-col items-center gap-8">
                        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 max-w-full px-2">
                           <button 
                              disabled={currentPage === 1}
                              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                              className="w-11 h-11 md:w-12 md:h-12 min-w-[44px] min-h-[44px] shrink-0 rounded-[5px] flex items-center justify-center bg-white border border-[#e8edf2] text-navy hover:bg-[#E8500A] hover:text-white hover:border-[#E8500A] disabled:opacity-45 disabled:hover:bg-white disabled:hover:text-navy disabled:hover:border-[#e8edf2] transition-all shadow-none group cursor-pointer"
                            >
                               <ArrowRight size={18} className="rotate-180 group-hover:-translate-x-1 transition-transform" />
                            </button>
                           {Array.from({ length: totalPages }, (_, idx) => idx + 1).map((p) => (
                               <button
                                 key={p}
                                 onClick={() => setCurrentPage(p)}
                                 className={cn(
                                  "w-11 h-11 md:w-12 md:h-12 min-w-[44px] min-h-[44px] shrink-0 rounded-[5px] flex items-center justify-center text-[11px] font-black transition-all italic",
                                  p === currentPage 
                                  ? "bg-[#E8500A] text-white border border-[#E8500A] shadow-none" 
                                  : "bg-white border border-[#e8edf2] text-navy hover:border-[#E8500A] hover:text-[#E8500A] shadow-none"
                                )}
                              >
                                {p}
                              </button>
                           ))}
                           <button 
                              disabled={currentPage === totalPages}
                              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                              className="w-11 h-11 md:w-12 md:h-12 min-w-[44px] min-h-[44px] shrink-0 rounded-[5px] flex items-center justify-center bg-white border border-[#e8edf2] text-navy hover:bg-[#E8500A] hover:text-white hover:border-[#E8500A] disabled:opacity-45 disabled:hover:bg-white disabled:hover:text-navy disabled:hover:border-[#e8edf2] transition-all shadow-none group cursor-pointer"
                            >
                               <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                            </button>
                        </div>
                        <p className="text-[10px] font-black text-gray-300 uppercase tracking-[0.2em] italic">
                           Authorized Distribution • Showing {paginatedProducts.length} of {filteredProducts.length} items (Page {currentPage} of {totalPages})
                        </p>
                     </div>
                      )}
                  </div>
               )}
            </main>

            {/* COLUMN 3: PROMO CODES & ADS (Right column) */}
            <aside className="hidden lg:flex flex-col gap-4 lg:sticky lg:top-24 pb-10 pr-2 flex-shrink-0 animate-fade-in">
               <div className="flex flex-col gap-6">

                  {/* Promo Coupons Cards list */}
                  {localClaimStatus === 'verified' && (
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
                  )}

                  {localClaimStatus !== 'verified' && (
                     <div className="bg-white rounded-[5px] p-6 border border-[#e8edf2] shadow-sm text-center flex flex-col items-center justify-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-[#E8500A]/10 flex items-center justify-center text-[#E8500A]">
                           <Lock size={16} />
                        </div>
                        <h4 className="text-[11px] font-black text-navy uppercase tracking-tight">Promo Codes Locked</h4>
                        <p className="text-[10px] text-gray-500 font-bold leading-normal">
                           Official merchant promotions and exclusive coupons are hidden for unclaimed brand profiles.
                        </p>
                        {localClaimStatus === 'community' && (
                           <button 
                             onClick={() => {
                                toast.loading("Initiating secure brand verification link...", { duration: 1500 });
                                setTimeout(() => {
                                   updateBrandClaimStatus(brand.id, 'pending');
                                   toast.success("Verification submission parsed! Ready for credential matching review.");
                                }, 1500);
                             }}
                             className="text-[9px] bg-[#E8500A] hover:bg-[#ff5d14] text-white py-2 px-5 rounded-full font-black uppercase tracking-wider italic mt-1 cursor-pointer border-none shadow-md"
                           >
                             Claim Brand
                           </button>
                        )}
                        {localClaimStatus === 'pending' && (
                           <div className="text-[9px] font-black text-amber-600 uppercase italic tracking-widest mt-1">
                              Verification Under Review
                           </div>
                        )}
                     </div>
                  )}

                   {/* Platform Compliance Verified Sourcing badge card */}
                   <div className="bg-white rounded-[5px] border border-[#e8edf2] p-5 shadow-sm text-left font-sans">
                      <h4 className="text-[11px] font-black text-[#1A1D4E] uppercase tracking-wider mb-2 flex items-center gap-1.5">
                         <ShieldCheck size={14} className="text-green-500 shrink-0" />
                         Verified Sourcing
                      </h4>
                      <p className="text-[10px] text-gray-400 leading-relaxed font-semibold">
                         Each listed bargain point is validated against native brand catalogs. Rest assured, checkout is immediate, safe, and transparent.
                      </p>
                   </div>

               </div>
            </aside>

         </div>

         {/* FULL WIDTH INFLUENCER REVIEWS SECTION */}
         <div id="influencer-reviews-section" className="scroll-mt-36 w-full">
            {localClaimStatus !== 'verified' ? (
                <div className="bg-white rounded-[5px] p-8 text-center flex flex-col items-center justify-center gap-3 w-full shadow-sm border border-gray-100/80 py-12">
                   <div className="w-12 h-12 rounded-full bg-[#E8500A]/10 flex items-center justify-center text-[#E8500A]">
                      <Lock className="w-5 h-5" />
                   </div>
                   <h3 className="text-sm font-black text-navy uppercase tracking-tight">Creator Collaborations & Reviews Locked</h3>
                   <p className="text-xs text-gray-500 font-bold max-w-sm mb-1">
                      Professional influencer reviews, creator campaign collaborations, and brand ambassadorship metrics are locked until ownership is verified.
                   </p>
                </div>
             ) : (
                <WithInfluencerReviews brandName={brand.name} brandLogo={brand.logo} />
             )}
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
         <BrandOverviewSection brandName={brand.name} overviewData={overviewData} claimStatus={brand.claimStatus} />

         {/* TRUST STATEMENT BACKGROUND BANNER */}
         <div className="w-full hero-gradient rounded-[5px] p-8 md:p-12 text-center text-white relative overflow-hidden shadow-lg border border-white/5">

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

            <div className="overflow-x-auto no-scrollbar rounded-[5px] border border-gray-100">
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

      <ClaimProfileModal
        isOpen={isClaimModalOpen}
        onClose={() => setIsClaimModalOpen(false)}
        targetType="brand"
        targetId={brand.id}
        targetName={brand.name}
        onClaimSubmitted={() => {
          setLocalClaimStatus('pending');
        }}
      />

    </div>
  );
}
