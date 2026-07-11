import React, { useState, useEffect, useMemo, lazy, Suspense } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Search, ShoppingCart, MessageSquare, Bookmark, ChevronDown, ChevronRight, 
  ChevronLeft, Award, ShoppingBag, Check, ArrowUpRight, Heart, Eye, Share2, 
  Play, ShieldCheck, DollarSign, Star, AlertCircle, PenTool, Award as Trophy,
  Shirt, Smartphone, Gamepad2, Monitor, Utensils, Cpu, Tv, Home, Baby,
  Flame, Sparkles, Send, Users, ShieldAlert, BadgeCheck, Zap, Clock,
  Gift, Package, BookOpen, Store, LayoutGrid, Megaphone
} from 'lucide-react';
import { ProductCard } from '../components/ProductCard';
import { PageHeroBanner } from '../components/PageHeroBanner';
import { HeroMarqueeTicker } from '../components/HeroMarqueeTicker';
import { BRANDS, CATEGORIES } from '../constants';
import { LoadingFallback } from '../components/LoadingFallback';

const HomeGuideCarouselCard = lazy(() =>
  import('../components/guide/HomeGuideCarouselCard').then((module) => ({
    default: module.HomeGuideCarouselCard,
  })),
);
import { useGlobalState } from '../context/GlobalStateContext';
import { useDashboard } from '../context/DashboardContext';
import { useRegisterPageFilters, UniversalFilterRenderer } from '../components/FilterEngine';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';
import { BrandCardDesign, mapBrandToCardDesign } from '../components/BrandCardDesign';
import { BrandPostCarouselSection } from '../components/BrandPostCarouselSection';
import { CategoryPhotoCard } from '../components/CategoryPhotoCard';
import {PRODUCT_CARD_GRID, PAGE_LISTING_SINGLE_SHELL, HOME_POPULAR_CATEGORY_GRID } from "../lib/pageLayout";
import { StickySectionNav } from '../components/StickySectionNav';
import { useSectionScrollSpy } from '../hooks/useSectionScrollSpy';
import { getAllBrandPosts } from '../lib/brandPosts';
import { getSectionItemIds, isHomeSectionVisible } from '../utils/homepageCms';
import { pickByCatalogIds, orderByCatalogIds } from '../utils/catalogMatch';
import { isPlacementActive } from '../utils/editorialMappers';
import { CreatorCardDesign } from '../components/CreatorCardDesign';
import { PopularSearchKeywords } from '../components/PopularSearchKeywords';
import { CategorySubcategoryPanel } from '../components/CategorySubcategoryPanel';
import { buildCategoryDisplayList } from '../utils/categoryDisplay';
import { buildPagePopularSearchTerms } from '../utils/pagePopularSearches';
import { SpotlightHeroCarousel } from '../components/home/SpotlightHeroCarousel';
import { FeaturedBrandsTabsSection } from '../components/home/FeaturedBrandsTabsSection';
import { PremiumCarousel } from '../components/home/PremiumCarousel';
import { StudioWrap } from '../components/studio/StudioWrap';
import { buildSpotlightHeroCarouselItems } from '../utils/spotlightHeroCarousel';

type HomeGuideCarouselKind = 'youtube' | 'reels' | 'blog';

type HomeGuideCarouselSlide = {
  guide: any;
  kind: HomeGuideCarouselKind;
};

function getHomeGuideKind(guide: any): HomeGuideCarouselKind {
  if (guide?.type === 'reels' || guide?.type === 'shorts') return 'reels';
  if (guide?.type === 'video') return 'youtube';
  return 'blog';
}

function renderHomeGuideCarouselCard(slide: HomeGuideCarouselSlide) {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <HomeGuideCarouselCard slide={slide} />
    </Suspense>
  );
}

const BRAND_IMAGES: Record<string, string> = {
  "Samsung": "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=1200&q=80",
  "Apple": "https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=1200&q=80",
  "Apex": "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=1200&q=80",
  "Bata": "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=1200&q=80",
  "Sony": "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=1200&q=80",
  "Lotto": "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=1200&q=80",
  "La Reve": "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1200&q=80",
  "Le Reve": "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1200&q=80",
  "Perfume World": "https://images.unsplash.com/photo-1541643600914-78b084683601?w=1200&q=80",
  "Pickaboo": "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=1200&q=80",
  "Aarong": "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=1200&q=80",
  "Yellow": "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1200&q=80",
  "Sailor": "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=1200&q=80",
  "Ecstasy": "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=1200&q=80",
  "Richman": "https://images.unsplash.com/photo-1488161628813-04466f872be2?w=1200&q=80",
  "Star Tech": "https://images.unsplash.com/photo-1587831990711-23ca6441447b?w=1200&q=80",
  "Choosify": "https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=1200&q=80",
  "FFF Sourcing Ltd": "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=1200&q=80"
};

const CATEGORY_IMAGES: Record<string, string> = {
  "Fashion": "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1200&q=80",
  "Tech": "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=1200&q=80",
  "Electronics": "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=1200&q=80",
  "Beauty": "https://images.unsplash.com/photo-1541643600914-78b084683601?w=1200&q=80",
  "Sports": "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=1200&q=80",
};

// Helper to map category names to Lucide icons
const getCategoryIcon = (category: string) => {
  const c = category.toLowerCase();
  if (c.includes('fashion') || c.includes('clothing')) return <Shirt className="w-5 h-5 text-[#E8500A]" />;
  if (c.includes('tech') || c.includes('electronic') || c.includes('cpu')) return <Cpu className="w-5 h-5 text-emerald-500" />;
  if (c.includes('mobile') || c.includes('phone') || c.includes('wearable')) return <Smartphone className="w-5 h-5 text-purple-500" />;
  if (c.includes('food') || c.includes('rest')) return <Utensils className="w-5 h-5 text-rose-500" />;
  if (c.includes('home') || c.includes('living')) return <Home className="w-5 h-5 text-sky-500" />;
  if (c.includes('baby') || c.includes('kid')) return <Baby className="w-5 h-5 text-pink-500" />;
  if (c.includes('gaming')) return <Gamepad2 className="w-5 h-5 text-cyan-500" />;
  return <ShoppingBag className="w-5 h-5 text-gray-500" />;
};

export function HomePage() {
  const navigate = useNavigate();
  const { allCatalogProducts, allCatalogBrands, allBrands, allDeals, allCategories, allGuides, allCatalogGuides, allPlacements, allCreators, homepageConfig, siteConfig, addToCart } = useGlobalState();
  const { savedProducts, setSavedProducts, addToCompare } = useDashboard();
  
  const [activeTab, setActiveTab] = useState('FEED');
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  const [carouselIndex, setCarouselIndex] = useState(1);

  const sectionVisible = React.useCallback(
    (sectionId: string) => isHomeSectionVisible(homepageConfig, sectionId),
    [homepageConfig],
  );

  // Trending brands slider helper
  const rightBrandsList = allCatalogBrands.length > 0 ? allCatalogBrands : (allBrands.length > 0 ? allBrands : BRANDS);
  const carouselBrands = React.useMemo(() => {
    return rightBrandsList.map((brand: any) => {
      const img = BRAND_IMAGES[brand.name] || CATEGORY_IMAGES[brand.category] || "https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=1200&q=80";
      return {
        id: brand.id,
        name: brand.name,
        category: brand.category,
        image: img
      };
    });
  }, [rightBrandsList]);

  const CAROUSEL_BRANDS = carouselBrands;
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [showAllFollowed, setShowAllFollowed] = useState(false);
  const [activeBrandsTab, setActiveBrandsTab] = useState<'brands' | 'products'>('brands');
  const [homeCategoryFilter, setHomeCategoryFilter] = useState<string>('all');
  const [homeBrandFilter, setHomeBrandFilter] = useState<string>('all');
  const [homePriceBand, setHomePriceBand] = useState<string>('all');

  const jumpToHomeSection = (id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.pageYOffset - 200;
    window.scrollTo({ top: Math.max(0, top), behavior: 'smooth' });
  };

  const homeFilterCount = useMemo(() => {
    let count = 0;
    if (homeCategoryFilter !== 'all') count += 1;
    if (homeBrandFilter !== 'all') count += 1;
    if (homePriceBand !== 'all') count += 1;
    return count;
  }, [homeCategoryFilter, homeBrandFilter, homePriceBand]);

  const whatsOnPosts = React.useMemo(() => getAllBrandPosts().slice(0, 8), []);

  const [isMobile, setIsMobile] = useState(false);
  const [dragStartX, setDragStartX] = useState<number | null>(null);
  const [dragOffset, setDragOffset] = useState(0);
  const lastWheelTime = React.useRef(0);
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(800);
  const carouselBrandsRef = React.useRef<any[]>([]);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    
    // Keyboard arrows support for accessibility & premium experience
    const handleKeyDown = (e: KeyboardEvent) => {
      if (document.activeElement?.tagName === 'INPUT' || document.activeElement?.tagName === 'TEXTAREA') {
        return;
      }
      const len = carouselBrandsRef.current.length || 1;
      if (e.key === 'ArrowLeft') {
        setCarouselIndex((prev) => (prev - 1 + len) % len);
      } else if (e.key === 'ArrowRight') {
        setCarouselIndex((prev) => (prev + 1) % len);
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new ResizeObserver((entries) => {
      for (let entry of entries) {
        setContainerWidth(entry.contentRect.width);
      }
    });
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);


  const handleTouchStart = (e: React.TouchEvent) => {
    setDragStartX(e.touches[0].clientX);
    setDragOffset(0);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (dragStartX === null) return;
    const diff = dragStartX - e.touches[0].clientX;
    setDragOffset(diff);
  };

  const handleTouchEnd = () => {
    if (dragStartX === null) return;
    const len = carouselBrandsRef.current.length || 1;
    if (dragOffset > 60) {
      setCarouselIndex((prev) => (prev + 1) % len);
    } else if (dragOffset < -60) {
      setCarouselIndex((prev) => (prev - 1 + len) % len);
    }
    setDragStartX(null);
    setDragOffset(0);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setDragStartX(e.clientX);
    setDragOffset(0);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (dragStartX === null) return;
    const diff = dragStartX - e.clientX;
    setDragOffset(diff);
  };

  const handleMouseUpOrLeave = () => {
    if (dragStartX === null) return;
    const len = carouselBrandsRef.current.length || 1;
    if (dragOffset > 60) {
      setCarouselIndex((prev) => (prev + 1) % len);
    } else if (dragOffset < -60) {
      setCarouselIndex((prev) => (prev - 1 + len) % len);
    }
    setDragStartX(null);
    setDragOffset(0);
  };

  const handleWheel = (e: React.WheelEvent) => {
    const now = Date.now();
    if (now - lastWheelTime.current < 600) return;
    
    const len = carouselBrandsRef.current.length || 1;
    if (Math.abs(e.deltaX) > 30 || Math.abs(e.deltaY) > 50) {
      if (e.deltaX > 30 || e.deltaY > 50) {
        setCarouselIndex((prev) => (prev + 1) % len);
      } else {
        setCarouselIndex((prev) => (prev - 1 + len) % len);
      }
      lastWheelTime.current = now;
      e.preventDefault();
    }
  };

  // Recommendations Reactions State
  const [recommendationStates, setRecommendationStates] = useState({
    featured: { liked: false, likes: 12000, views: 1200, shares: 450, bookmarked: false },
    card1: { liked: false, likes: 12000, views: 1200, shares: 480, bookmarked: false },
    card2: { liked: false, likes: 12000, views: 1200, shares: 450, bookmarked: false },
    card3: { liked: false, likes: 12000, views: 1200, shares: 480, bookmarked: false },
  });

  const handleRecLike = (cardId: 'featured' | 'card1' | 'card2' | 'card3') => {
    setRecommendationStates(prev => {
      const card = prev[cardId];
      const nextLiked = !card.liked;
      return {
        ...prev,
        [cardId]: {
          ...card,
          liked: nextLiked,
          likes: nextLiked ? card.likes + 1 : card.likes - 1
        }
      };
    });
    toast.success(recommendationStates[cardId].liked ? "Removed love rating" : "Loved recommendation!");
  };

  const handleRecBookmark = (cardId: 'featured' | 'card1' | 'card2' | 'card3') => {
    setRecommendationStates(prev => {
      const card = prev[cardId];
      const nextBookmarked = !card.bookmarked;
      return {
        ...prev,
        [cardId]: {
          ...card,
          bookmarked: nextBookmarked
        }
      };
    });
    toast.success(recommendationStates[cardId].bookmarked ? "Removed from saved items" : "Added to saved items!");
  };

  const handleRecView = (cardId: 'featured' | 'card1' | 'card2' | 'card3') => {
    setRecommendationStates(prev => {
      const card = prev[cardId];
      return {
        ...prev,
        [cardId]: {
          ...card,
          views: card.views + 1
        }
      };
    });
    toast.success("Article recommendation marked as read!");
  };

  const handleRecShare = (cardId: 'featured' | 'card1' | 'card2' | 'card3') => {
    setRecommendationStates(prev => {
      const card = prev[cardId];
      return {
        ...prev,
        [cardId]: {
          ...card,
          shares: card.shares + 1
        }
      };
    });
    toast.success("Link copied to clipboard!");
  };

  // Spotlight Reactions State
  const [spotlightStates, setSpotlightStates] = useState({
    liked: false,
    likes: 12000,
    views: 1200,
    shares: 450
  });

  const handleSpotlightAction = (type: 'likes' | 'views' | 'shares') => {
    setSpotlightStates(prev => {
      if (type === 'likes') {
        const nextLiked = !prev.liked;
        return {
          ...prev,
          liked: nextLiked,
          likes: nextLiked ? prev.likes + 1 : prev.likes - 1
        };
      } else if (type === 'views') {
        return {
          ...prev,
          views: prev.views + 1
        };
      } else {
        return {
          ...prev,
          shares: prev.shares + 1
        };
      }
    });
    if (type === 'likes') {
      toast.success(spotlightStates.liked ? "Removed brand love" : "Loved brand spotlight!");
    } else if (type === 'views') {
      toast.success("Spotlight brand flagged as viewed!");
    } else {
      toast.success("Spotlight copied to clipboard!");
    }
  };

  // Spotlight Product reactions states for the 4 products inside Spotlight Brand
  const [spotlightProductStates, setSpotlightProductStates] = useState<Record<string, { likes: number, views: number, shares: number, liked: boolean }>>({
    'p1': { likes: 12000, views: 1200, shares: 450, liked: false },
    'p2': { likes: 12000, views: 1200, shares: 450, liked: false },
    'p3': { likes: 12000, views: 1200, shares: 450, liked: false },
    'p4': { likes: 12000, views: 1200, shares: 450, liked: false },
  });

  const handleSpotlightProductReact = (pId: string, type: 'likes' | 'views' | 'shares') => {
    setSpotlightProductStates(prev => {
      const current = prev[pId] || { likes: 12000, views: 1200, shares: 450, liked: false };
      if (type === 'likes') {
        const nextLiked = !current.liked;
        return {
          ...prev,
          [pId]: {
            ...current,
            liked: nextLiked,
            likes: nextLiked ? current.likes + 1 : current.likes - 1
          }
        };
      } else if (type === 'views') {
        return {
          ...prev,
          [pId]: {
            ...current,
            views: current.views + 1
          }
        };
      } else {
        return {
          ...prev,
          [pId]: {
            ...current,
            shares: current.shares + 1
          }
        };
      }
    });
    toast.success(type === 'likes' ? "Added love rating to product!" : type === 'views' ? "Product view logged!" : "Product link copied!");
  };

  // Categories definitions
  const categoryTabs = [
    { id: 'FEED', emoji: '🏠', label: 'FEED' },
    { id: 'Fashion & Lifestyle', emoji: '👗', label: 'FASHION & LIFESTYLE' },
    { id: 'Mobile & Phones', emoji: '📱', label: 'MOBILE & WEARABLES' },
    { id: 'Jewelry & Accessories', emoji: '👁', label: 'EYE WEAR & FRAGRANCES' },
    { id: 'Food & Restaurants', emoji: '🍔', label: 'FOOD & RESTAURANTS' },
    { id: 'Baby & Maternity', emoji: '👨‍👩‍👧', label: 'FAMILY & KIDS' },
  ];

  // Followed Brands initial data-mock
  const initialFollowedBrands = [
    { name: 'Aarong', desc: 'Traditional Handcrafted Products', avatar: 'AA', bg: 'bg-[#5B2E15]', brandId: 10 },
    { name: 'Adidas', desc: 'Premium Athletic Wear', avatar: 'AD', bg: 'bg-[#000000]', brandId: 4 },
    { name: 'Coca-Cola', desc: 'Refreshing Quality Beverages', avatar: 'CC', bg: 'bg-[#E61C24]', brandId: 2 },
    { name: 'Starbucks', desc: 'Premium Coffee Blends', avatar: 'SB', bg: 'bg-[#006241]', brandId: 1 },
    { name: 'Yellow', desc: 'Modern Apparel & Fashion', avatar: 'YL', bg: 'bg-[#F2CD13]', brandId: 11 },
    { name: 'Bata Shoes', desc: 'Premium Class Footwear', avatar: 'BT', bg: 'bg-[#D2141F]', brandId: 4 }
  ];

  const visibleFollowedBrands = showAllFollowed 
    ? initialFollowedBrands 
    : initialFollowedBrands.slice(0, 3);

  // Newsletter subscription
  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail.trim()) {
      toast.error('Please specify your email!');
      return;
    }
    toast.success('Your subscription is complete! Welcome to Choosify.bd newsletter.');
    setNewsletterEmail('');
  };

  // Sync ref
  carouselBrandsRef.current = carouselBrands;

  const popularBrands = rightBrandsList.slice(0, 6);

  const isMobileSize = containerWidth < 768;
  const activeWidth = isMobileSize ? 260 : containerWidth * 0.58;
  const inactiveWidth = isMobileSize ? 260 : containerWidth * 0.21;
  const gap = 16; // gap-4
  const translateX = (containerWidth / 2) - (carouselIndex * (inactiveWidth + gap) + (activeWidth / 2)) - dragOffset;

  const spotlightBrands = React.useMemo(() => {
    const placementBrands = allPlacements
      .filter((placement) => isPlacementActive(placement) && placement.placement === 'spotlight_section' && placement.entityType === 'brand')
      .map((placement) => rightBrandsList.find((b: any) => String(b.id) === placement.entityId))
      .filter(Boolean);
    if (placementBrands.length) return placementBrands.slice(0, 8);

    const featuredIds = homepageConfig?.featuredBrandIds?.length
      ? homepageConfig.featuredBrandIds
      : getSectionItemIds(homepageConfig, 'featured-brands');
    if (featuredIds.length) {
      const brandSource = allCatalogBrands.length > 0 ? allCatalogBrands : rightBrandsList;
      const picked = pickByCatalogIds(
        brandSource as Array<{ catalogId?: string; id?: string | number }>,
        featuredIds,
      );
      if (picked.length) return picked.slice(0, 8);
    }
    return rightBrandsList.filter((b: any) => b.ratings >= 4.7 || b.featuredFlag || b.sponsoredFlag).slice(0, 8);
  }, [rightBrandsList, homepageConfig, allPlacements]);

  const rightProductsList = React.useMemo(() => {
    const source = allCatalogProducts;
    const placementProducts = allPlacements
      .filter((placement) => isPlacementActive(placement) && placement.placement === 'trending_section' && placement.entityType === 'product')
      .map((placement) => source.find((p) => String(p.id) === placement.entityId))
      .filter(Boolean);
    if (placementProducts.length) return placementProducts as typeof source;

    const featuredIds = homepageConfig?.featuredProductIds?.length
      ? homepageConfig.featuredProductIds
      : getSectionItemIds(homepageConfig, 'trending');
    if (!featuredIds.length) return source;
    return orderByCatalogIds(source, featuredIds);
  }, [allCatalogProducts, homepageConfig, allPlacements]);

  const sponsoredDeals = React.useMemo(() => {
    const placementProducts = allPlacements
      .filter((placement) => isPlacementActive(placement) && placement.placement === 'deals_section')
      .map((placement) => allCatalogProducts.find((p: any) => String(p.catalogId || p.id) === placement.entityId))
      .filter(Boolean);
    if (placementProducts.length > 0) return placementProducts;

    const productsList = allCatalogProducts;
    return productsList.filter((p) => {
      // Check direct product flags
      if (p.isDeal) return true;
      
      // Look up brand
      const brand = allCatalogBrands.find((b) => b.id === p.brandId || b.name?.toLowerCase() === p.brandName?.toLowerCase())
        ?? allBrands?.find((b) => String(b.id) === String(p.brandId) || b.name?.toLowerCase() === p.brandName?.toLowerCase());
      if (brand && brand.sponsoredFlag) return true;
      
      const bLower = p.brandName?.toLowerCase();
      if (bLower === 'samsung' || bLower === 'apple' || bLower === 'aarong') return true;
      
      return false;
    });
  }, [allCatalogProducts, allCatalogBrands, allBrands, allPlacements]);

  const styledSponsoredDeals = React.useMemo(() => {
    return sponsoredDeals.map((p: any, idx: number) => {
      let discountText = 'SPECIAL';
      const cleanPrice = typeof p.price === 'string' ? parseFloat(p.price.replace(/,/g, '')) : p.price;
      const originalPriceVal = p.originalPrice ? (typeof p.originalPrice === 'string' ? parseFloat(p.originalPrice.replace(/,/g, '')) : p.originalPrice) : null;
      
      if (originalPriceVal && originalPriceVal > cleanPrice) {
        const pct = Math.round(((originalPriceVal - cleanPrice) / originalPriceVal) * 100);
        discountText = `${pct}% OFF`;
      } else {
        const pct = 15 + ((idx * 7) % 21);
        discountText = `${pct}% OFF`;
      }
      
      return {
        ...p,
        discountText,
        badgeClass: "bg-[#E8500A] text-white"
      };
    });
  }, [sponsoredDeals]);

  const sponsoredBrandsList = React.useMemo(() => {
    const brandsList = allBrands && allBrands.length > 0 ? allBrands : [];
    return brandsList.filter((b: any) => b.sponsoredFlag);
  }, [allBrands]);

  const viralProductsList = React.useMemo(() => {
    return allCatalogProducts.map((p, idx) => {
      // Define a stable viral tag sequence based on ID
      let tag = '🔥 Viral';
      let tagColor = 'bg-[#E8500A]';
      let source = '⭐ Choosify Picks';
      
      const badgeType = idx % 5;
      if (badgeType === 0) {
        tag = '🔥 Viral';
        tagColor = 'bg-[#E8500A]';
        source = '⭐ Choosify Picks';
      } else if (badgeType === 1) {
        tag = '❤️ Customer Favorite';
        tagColor = 'bg-rose-500';
        source = '❤️ Customer Favorites';
      } else if (badgeType === 2) {
        tag = '⭐ Staff Pick';
        tagColor = 'bg-amber-500';
        source = '🏆 Editor Choice';
      } else if (badgeType === 3) {
        tag = '🏆 Editor Choice';
        tagColor = 'bg-indigo-600';
        source = '🏆 Editor Choice';
      } else if (badgeType === 4) {
        tag = '🚀 Trending';
        tagColor = 'bg-blue-600';
        source = '👥 Community Submitted';
      }

      return {
        ...p,
        tag,
        tagColor,
        source,
        viralScore: 90 + (idx * 3) % 10,
        viewsThisWeek: 450 + (idx * 112) % 1200,
        heartsCount: 120 + (idx * 56) % 800
      };
    });
  }, [allCatalogProducts]);

  const featuredDeals = React.useMemo(() => {
    return allCatalogProducts.map((p, idx) => {
      // Create curated, realistic discounts and original prices
      const discountPct = 15 + ((idx * 7) % 21); // 15% to 35% discount
      const originalPriceVal = Math.round(p.price / (1 - discountPct / 100));
      
      let tag = '🔥 HOT DEAL';
      let tagColor = 'bg-[#E8500A]';
      const type = idx % 4;
      if (type === 0) {
        tag = '⚡ FLASH DEAL';
        tagColor = 'bg-[#E8500A]';
      } else if (type === 1) {
        tag = '🏷️ LIMITED OFFER';
        tagColor = 'bg-[#FF5B00]';
      } else if (type === 2) {
        tag = '🔥 MEGA SAVING';
        tagColor = 'bg-rose-600';
      } else {
        tag = `${discountPct}% EXCLUSIVE`;
        tagColor = 'bg-[#CF4400]';
      }

      return {
        ...p,
        originalPrice: originalPriceVal.toLocaleString(),
        tag,
        tagColor,
        discountPercent: discountPct
      };
    }).slice(0, 8); // Curb at exactly 8 cards
  }, [allCatalogProducts]);

  const filteredProducts = activeTab === 'FEED' 
    ? rightProductsList 
    : rightProductsList.filter((p) => p.categoryName?.toLowerCase() === activeTab.toLowerCase());

  // Sailor is the Spotlight Brand (Brand ID: default or 3)
  const sailorProductList = rightProductsList.filter((p) => p.brandName?.toLowerCase() === 'sailor' || p.categoryName?.toLowerCase() === 'fashion & lifestyle').slice(0, 4);

  // Deals Sidebar calculations (with discount tags)
  const dealsProducts = React.useMemo(() => {
    const featuredDealIds = homepageConfig?.featuredDealIds?.length
      ? homepageConfig.featuredDealIds
      : getSectionItemIds(homepageConfig, 'deals');
    if (featuredDealIds.length) {
      const picked = pickByCatalogIds(rightProductsList, featuredDealIds);
      if (picked.length) return picked.slice(0, 4);
    }
    const dealBackedProducts = rightProductsList.filter((p: any) => p.originalPrice || p.discount || p.isDeal);
    if (dealBackedProducts.length > 0) return dealBackedProducts.slice(0, 4);
    if (allDeals.length > 0) return rightProductsList.slice(0, 4);
    return rightProductsList.filter((p: any) => p.originalPrice || p.discount).slice(0, 4);
  }, [allDeals, homepageConfig, rightProductsList]);

  const featuredCreators = React.useMemo(() => {
    const featuredIds = homepageConfig?.featuredCreatorIds?.length
      ? homepageConfig.featuredCreatorIds
      : getSectionItemIds(homepageConfig, 'creators');
    if (featuredIds.length) {
      const picked = pickByCatalogIds(allCreators, featuredIds);
      if (picked.length) return picked.slice(0, 8);
    }
    return allCreators.filter((creator: any) => creator.isFeatured || creator.featuredFlag).slice(0, 8);
  }, [allCreators, homepageConfig]);

  const homepageGuides = React.useMemo(() => {
    const featuredIds = homepageConfig?.featuredGuideIds?.length
      ? homepageConfig.featuredGuideIds
      : getSectionItemIds(homepageConfig, 'recommended');
    if (featuredIds.length) {
      const picked = pickByCatalogIds(allGuides, featuredIds);
      if (picked.length) return picked;
    }
    return allGuides;
  }, [allGuides, homepageConfig]);

  const homeFeaturedGuideSlides = useMemo(() => {
    const youtube = homepageGuides.filter((g: any) => g?.type === 'video');
    const reels = homepageGuides.filter(
      (g: any) => g?.type === 'reels' || g?.type === 'shorts',
    );
    const blogs = homepageGuides.filter(
      (g: any) => g?.type === 'article' || !g?.type,
    );

    const lanes: Array<{ list: any[]; kind: HomeGuideCarouselKind }> = [
      { list: youtube, kind: 'youtube' },
      { list: reels, kind: 'reels' },
      { list: blogs, kind: 'blog' },
    ];

    const seen = new Set<string | number>();
    const slides: HomeGuideCarouselSlide[] = [];
    const maxRounds = Math.max(...lanes.map((lane) => lane.list.length), 0);

    for (let round = 0; round < maxRounds && slides.length < 12; round += 1) {
      for (const lane of lanes) {
        const guide = lane.list[round];
        if (!guide?.id || seen.has(guide.id)) continue;
        seen.add(guide.id);
        slides.push({ guide, kind: lane.kind });
        if (slides.length >= 12) break;
      }
    }

    if (slides.length === 0) {
      homepageGuides.slice(0, 8).forEach((guide: any) => {
        if (!guide?.id || seen.has(guide.id)) return;
        slides.push({ guide, kind: getHomeGuideKind(guide) });
      });
    }

    return slides;
  }, [homepageGuides]);

  const hasSpotlightCampaigns = useMemo(() => {
    const items = buildSpotlightHeroCarouselItems({
      catalog: allCatalogProducts,
      guides: allCatalogGuides,
      creators: allCreators,
      brandPosts: getAllBrandPosts(),
      brandLogos: BRAND_IMAGES,
    });
    return items.length > 0;
  }, [allCatalogProducts, allCatalogGuides, allCreators]);

  const spotlightHeroItems = useMemo(
    () =>
      buildSpotlightHeroCarouselItems({
        catalog: allCatalogProducts,
        guides: allCatalogGuides,
        creators: allCreators,
        brandPosts: getAllBrandPosts(),
        brandLogos: BRAND_IMAGES,
      }),
    [allCatalogProducts, allCatalogGuides, allCreators],
  );

  const trendingBrandTab = useMemo(
    () => [...rightBrandsList].sort((a: any, b: any) => (b.ratings ?? 0) - (a.ratings ?? 0)).slice(0, 8),
    [rightBrandsList],
  );

  const verifiedBrandTab = useMemo(
    () => rightBrandsList.filter((b: any) => b.isVerified || (b.ratings ?? 0) >= 4.5).slice(0, 8),
    [rightBrandsList],
  );

  const newBrandTab = useMemo(
    () => [...rightBrandsList].sort((a: any, b: any) => String(b.id).localeCompare(String(a.id))).slice(0, 8),
    [rightBrandsList],
  );

  const carouselLength = spotlightHeroItems.length || CAROUSEL_BRANDS.length;

  useEffect(() => {
    if (carouselLength <= 1) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') setCarouselIndex((prev) => (prev + 1) % carouselLength);
      if (e.key === 'ArrowLeft') setCarouselIndex((prev) => (prev - 1 + carouselLength) % carouselLength);
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [carouselLength]);

  useEffect(() => {
    if (carouselLength <= 1) return;
    const timer = setInterval(() => {
      setCarouselIndex((prev) => (prev + 1) % carouselLength);
    }, 5000);
    return () => clearInterval(timer);
  }, [carouselLength]);

  const homeSectionNavItems = useMemo(
    () => [
      { id: 'section-categories', label: 'Categories', icon: <LayoutGrid size={13} />, hidden: !sectionVisible('categories') },
      { id: 'section-spotlight-carousel', label: 'Spotlight', icon: <Flame size={13} />, hidden: !hasSpotlightCampaigns },
      { id: 'section-new-on-choosify', label: 'Products', icon: <ShoppingBag size={13} />, hidden: !sectionVisible('trending') },
      { id: 'section-featured-brands', label: 'Brands', icon: <Store size={13} />, hidden: !sectionVisible('featured-brands') },
    ],
    [hasSpotlightCampaigns, sectionVisible],
  );
  const { activeId: homeActiveSectionId, scrollToSection: scrollToHomeSection } =
    useSectionScrollSpy(homeSectionNavItems);

  useRegisterPageFilters({
    pageName: 'Home',
    renderSearch: null,
    sectionNav: {
      items: homeSectionNavItems,
      activeId: homeActiveSectionId,
      onNavigate: scrollToHomeSection,
      allLabel: 'Home',
      profileLabel: 'Home feed',
    },
    quickFilters: [
      { id: 'home-categories', label: '📂 Categories', active: false, onClick: () => jumpToHomeSection('section-categories') },
      { id: 'home-spotlight', label: '🔥 Spotlight', active: false, onClick: () => jumpToHomeSection('section-spotlight-carousel') },
      { id: 'home-products', label: '🛍 Products', active: false, onClick: () => jumpToHomeSection('section-new-on-choosify') },
      { id: 'home-brands', label: '🏷 Brands', active: false, onClick: () => jumpToHomeSection('section-featured-brands') },
    ],
    renderFilters: () => (
      <UniversalFilterRenderer
        profile={{
          entity: 'products',
          filters: [
            {
              id: 'category',
              name: 'Category',
              type: 'single_select',
              options: [
                { value: 'all', label: 'All categories' },
                ...((allCategories ?? []).slice(0, 10).map((c) => ({ value: c.name, label: c.name }))),
              ],
            },
            {
              id: 'brand',
              name: 'Brand',
              type: 'single_select',
              options: [
                { value: 'all', label: 'All brands' },
                ...rightBrandsList.slice(0, 10).map((b: any) => ({ value: b.name, label: b.name })),
              ],
            },
            {
              id: 'price',
              name: 'Price band',
              type: 'single_select',
              options: [
                { value: 'all', label: 'Any price' },
                { value: '5000', label: 'Under BDT 5,000' },
                { value: '15000', label: 'Under BDT 15,000' },
                { value: '50000', label: 'Under BDT 50,000' },
              ],
            },
          ],
        }}
        activeFilters={{
          category: homeCategoryFilter,
          brand: homeBrandFilter,
          price: homePriceBand,
        }}
        onFilterChange={(filterId, value) => {
          if (filterId === 'category') setHomeCategoryFilter(value || 'all');
          if (filterId === 'brand') setHomeBrandFilter(value || 'all');
          if (filterId === 'price') setHomePriceBand(value || 'all');
        }}
      />
    ),
    activeFilterCount: homeFilterCount,
    onClearAll: () => {
      setHomeCategoryFilter('all');
      setHomeBrandFilter('all');
      setHomePriceBand('all');
    },
  }, [
    homeCategoryFilter,
    homeBrandFilter,
    homePriceBand,
    homeFilterCount,
    allCategories,
    rightBrandsList,
    homeSectionNavItems,
    homeActiveSectionId,
    scrollToHomeSection,
    featuredCreators.length,
    homeFeaturedGuideSlides.length,
  ]);

  const popularCategoriesList = React.useMemo(() => {
    return buildCategoryDisplayList(allCategories ?? [], allCatalogProducts ?? []).slice(0, 5);
  }, [allCategories, allCatalogProducts]);

  const homePopularSearchTerms = useMemo(
    () =>
      buildPagePopularSearchTerms({
        cmsTerms: siteConfig?.popularSearches,
        products: allCatalogProducts ?? [],
        categoryNames: popularCategoriesList.map((cat) => cat.name),
        brandNames: allBrands?.slice(0, 10).map((b) => b.name),
        limit: 24,
      }),
    [siteConfig?.popularSearches, allCatalogProducts, popularCategoriesList, allBrands],
  );

  const CAROUSEL_BG_COLORS = [
    '#0f2b2b', '#0a1e30', '#271808', '#16112b',
    '#0b2318', '#26102a', '#102333', '#22200a',
  ];

  return (
    <div className="bg-choosify-feed min-h-screen text-[#1A1D4E] antialiased pb-16 font-sans overflow-x-clip">
      
      {sectionVisible('hero') && (
        <PageHeroBanner pageKey="home" />
      )}

      <HeroMarqueeTicker pageKey="home" siteConfig={siteConfig} />

      <StickySectionNav
        sections={homeSectionNavItems}
        activeId={homeActiveSectionId}
        onNavigate={scrollToHomeSection}
        allLabel="Home"
        profileLabel="Home feed"
      />

      {/* SECTION 4 — THREE COLUMN GRID */}
      <main className="max-w-[1440px] mx-auto px-4 py-5 w-full flex flex-col gap-6 relative">
        <div className={`${PAGE_LISTING_SINGLE_SHELL}`}>
        
        {/* LEFT STICKY SIDEBAR */}
        <aside 
          className="hidden lg:flex flex-col gap-3 lg:sticky lg:top-24 pb-0 flex-shrink-0 min-w-0 w-full max-w-full"
          style={{ paddingLeft: '0px', paddingRight: '0px', paddingBottom: '0px' }}
        >
          
          {/* BRANDS FOLLOWED */}
          <div className="bg-white rounded-[5px] border border-[#e8edf2] p-4 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-[11px] font-semibold text-[#1a1a2e] uppercase text-left">Brands You Follow</h3>
              <span className="text-[10px] font-medium text-[#E8500A] uppercase tracking-wider bg-[#FFF0E8] px-2.5 py-0.5 rounded-full leading-none">{initialFollowedBrands.length} Active</span>
            </div>
            
            <div className="space-y-2">
              {visibleFollowedBrands.map((b, i) => (
                <div 
                  key={i} 
                  onClick={() => navigate(`/brands/${b.brandId}`)}
                  className="flex items-center gap-3 p-2 rounded-xl hover:bg-gray-50 border border-transparent hover:border-gray-100 transition-all duration-300 cursor-pointer text-left"
                >
                  <div className={`w-9 h-9 rounded-full ${b.bg} text-white font-black flex items-center justify-center text-xs shadow border-2 border-white outline outline-1 outline-gray-200 shrink-0`}>
                    {b.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[12px] font-medium text-[#1A1D4E] truncate leading-tight uppercase">{b.name}</p>
                    <p className="text-[11px] text-gray-400 font-normal truncate mt-0.5">{b.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <button 
              onClick={() => setShowAllFollowed(!showAllFollowed)} 
              className="w-full text-center text-[10px] font-semibold text-[#E8500A] hover:text-[#CF4400] uppercase tracking-widest mt-3 flex items-center justify-center gap-1.5 leading-none transition-transform"
            >
              {showAllFollowed ? 'Collapse List' : 'Expand All'} 
              <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-300 ${showAllFollowed ? 'rotate-180' : ''}`} />
            </button>
          </div>

        </aside>

        {/* CENTER FEED */}
        <section 
          className="choosify-middle-feed flex flex-col gap-5 w-full min-w-0"
          style={{ paddingTop: '0px', paddingLeft: '0px', paddingRight: '0px', paddingBottom: '8px' }}
        >
          


          {/* MAIN FEED CONTENT PORTAL */}
          {activeTab === 'FEED' ? (
            <>
              {sectionVisible('categories') && (
              <div id="section-categories">
              <StudioWrap sectionId="home-categories" className="bg-white rounded-[5px] border border-[#e8edf2] p-5 shadow-sm">
                <div className="flex items-center justify-between mb-5 pb-3 border-b border-gray-100">
                  <div className="text-left">
                    <h2 className="text-base font-semibold text-[#1a1a2e]">
                      Top <span className="text-[#E8500A]">Categories</span>
                    </h2>
                    <p className="text-[12px] text-[#8a9bb0] mt-1 text-left">Explore by industry and niche</p>
                  </div>
                  <Link to="/categories" className="border border-[#e8edf2] hover:border-[#E8500A]/30 text-[#1a1a2e] hover:text-[#E8500A] text-[10px] font-medium uppercase tracking-wider rounded-lg px-4 py-2 bg-white transition-all shrink-0">
                    Show All
                  </Link>
                </div>
                <div className={cn(HOME_POPULAR_CATEGORY_GRID, 'text-left')}>
                  {popularCategoriesList.map((cat) => {
                    const isExpanded = expandedCategory === cat.name;
                    return (
                      <React.Fragment key={cat.id || cat.name}>
                        <CategoryPhotoCard name={cat.name} productCount={cat.count} image={cat.image} onClick={() => setExpandedCategory(isExpanded ? null : cat.name)} isExpanded={isExpanded} />
                        <AnimatePresence mode="sync">
                          {isExpanded ? (
                            <CategorySubcategoryPanel category={cat} onClose={() => setExpandedCategory(null)} products={allCatalogProducts ?? []} cmsTerms={siteConfig?.popularSearches} />
                          ) : null}
                        </AnimatePresence>
                      </React.Fragment>
                    );
                  })}
                </div>
              </StudioWrap>
              </div>
              )}

              {hasSpotlightCampaigns && (
              <div id="section-spotlight-carousel">
              <StudioWrap
                sectionId="home-spotlight-carousel"
                className="rounded-[5px] border border-white/10 p-3 sm:p-5 shadow-sm overflow-hidden"
                style={{
                  backgroundColor: CAROUSEL_BG_COLORS[carouselIndex % CAROUSEL_BG_COLORS.length],
                  transition: 'background-color 0.75s ease',
                }}
              >
                <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between border-b border-white/10 pb-3 mb-4 gap-4">
                  <div className="text-left">
                    <div className="flex items-center gap-1">
                      <span className="text-base font-semibold text-white">Spotlight</span>
                    </div>
                    <p className="text-[12px] text-white/50 mt-1">Live events, launches, campaigns, and creator picks.</p>
                  </div>
                  <Link to="/spotlight" className="text-[12px] font-medium text-white/65 hover:text-white shrink-0 hover:underline">
                    Explore Spotlight
                  </Link>
                </div>
                <SpotlightHeroCarousel items={spotlightHeroItems} carouselIndex={carouselIndex} setCarouselIndex={setCarouselIndex} />
              </StudioWrap>
              </div>
              )}

              {sectionVisible('trending') && (
              <div id="section-new-on-choosify">
              <StudioWrap sectionId="home-new-products" className="bg-white rounded-[5px] border border-[#e8edf2] p-5 shadow-sm">
                <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between border-b border-gray-100 pb-3 mb-4 gap-4">
                  <div className="text-left">
                    <div className="flex items-center gap-1">
                      <span className="text-base font-semibold text-[#1a1a2e]">Featured</span>
                      <span className="text-base font-semibold text-[#E8500A]">Products</span>
                    </div>
                    <p className="text-[12px] text-[#8a9bb0] mt-1">Curated picks to shop with confidence.</p>
                  </div>
                  <Link to="/products" className="text-[12px] font-medium text-[#FF5B00] shrink-0 hover:underline">View All Products</Link>
                </div>
                <div className={PRODUCT_CARD_GRID}>
                  {allCatalogProducts
                    .filter((p) => p.isNewArrival || Number.parseInt(String(p.id).replace(/\D/g, ''), 10) % 3 === 0)
                    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
                    .slice(0, 8)
                    .map((product) => (
                      <ProductCard key={product.id} product={product} variant="grid" />
                    ))}
                </div>
              </StudioWrap>
              </div>
              )}


              {sectionVisible('featured-brands') && (
                <FeaturedBrandsTabsSection
                  featuredBrands={spotlightBrands}
                  trendingBrands={trendingBrandTab}
                  verifiedBrands={verifiedBrandTab}
                  newBrands={newBrandTab}
                  brandFallback={BRANDS}
                />
              )}
            </>
          ) : (
            /* NON-FEED CATEGORY DISPLAY GRID */
            <div className="bg-white rounded-[5px] border border-[#e8edf2] p-5 shadow-sm min-h-[480px]">
              <div className="flex items-center justify-between border-b border-gray-100 pb-4 mb-6 text-left">
                <div>
                  <h3 className="font-semibold text-base uppercase text-[#1a1a2e] flex items-center gap-2 leading-none">
                    <span className="text-lg leading-none">{categoryTabs.find(t=>t.id===activeTab)?.emoji}</span> {activeTab}
                  </h3>
                  <p className="text-[10px] text-gray-400 mt-1 uppercase tracking-wider font-mono">BROWSING SECURED ORIGINAL PRODUCTS CATALOG</p>
                </div>
                <button 
                  onClick={() => setActiveTab('FEED')}
                  className="px-4 py-2 bg-gray-50 hover:bg-gray-100 rounded-lg text-[10px] uppercase tracking-wider transition-all border border-[#e8edf2]"
                >
                  Return to Feed
                </button>
              </div>

              {filteredProducts.length > 0 ? (
                <div className={PRODUCT_CARD_GRID}>
                  {filteredProducts.map((p: any) => (
                    <ProductCard key={p.id} product={p} variant="grid" />
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                  <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-350 flex items-center justify-center mb-3">
                    <AlertCircle className="w-6 h-6" />
                  </div>
                  <h4 className="font-medium text-[#1a1a2e] uppercase tracking-wide mb-1">No original items cataloged</h4>
                  <p className="text-xs text-gray-400 max-w-sm leading-relaxed">
                    We are currently executing strict brand quality assays on outlets in this category. New products update weekly!
                  </p>
                </div>
              )}
            </div>
          )}

        </section>

        {/* RIGHT SIDEBAR */}
        <aside 
          className="hidden lg:flex flex-col gap-5 lg:sticky lg:top-24 mr-0 pl-[2px] pb-0 w-full min-w-0 max-w-full xl:max-w-[310px] flex-shrink-0 animate-fade-in"
          style={{ paddingLeft: '0px', paddingBottom: '0px' }}
        >
          
          {/* Card 1 — Sponsored Deals */}
          <div className="bg-white rounded-[5px] border border-[#e8edf2] p-4.5 shadow-sm text-left">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-100">
              <h3 className="text-sm font-semibold tracking-tight text-[#1a1a2e]">
                Sponsored <span className="text-[#E8500A]">Deals</span>
              </h3>
              <Link 
                to="/deals" 
                className="text-[10px] font-semibold text-[#E8500A] uppercase tracking-wider hover:text-[#CF4400]"
              >
                SEE ALL
              </Link>
            </div>
            
            <div className="flex flex-col gap-4">
              {styledSponsoredDeals.length === 0 ? (
                <div className="text-center py-6 border border-dashed border-gray-200 rounded-lg">
                  <p className="text-xs text-gray-400 font-medium">Sponsored deals will appear here.</p>
                </div>
              ) : (
                styledSponsoredDeals.slice(0, 5).map((item, idx) => (
                  <div 
                    key={item.id || idx}
                    onClick={() => navigate(`/products/${item.id}`)}
                    className="flex gap-3 bg-white hover:bg-gray-50/50 p-1.5 rounded-[5px] transition-all duration-200 group text-left cursor-pointer"
                  >
                    <div className="w-16 h-16 rounded-lg overflow-hidden shrink-0 border border-[#e8edf2] flex items-center justify-center bg-gray-50 relative">
                      <img 
                        src={item.image} 
                        alt={item.title} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        referrerPolicy="no-referrer"
                      />
                      <div 
                        onClick={(e) => {
                          e.stopPropagation();
                          toast.success('Added to saved items!');
                        }}
                        className="absolute top-1 left-1 w-5 h-5 bg-white rounded-full flex items-center justify-center shadow-sm border border-gray-100 cursor-pointer hover:scale-110 active:scale-90 transition-transform z-10"
                      >
                        <Bookmark className="w-3 h-3 text-[#E8500A]" />
                      </div>
                    </div>

                    <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5 text-left">
                      <div>
                        <div className="flex items-center justify-between gap-1">
                          <span className="text-[8px] font-bold uppercase text-gray-400">{item.brand}</span>
                          <span className={cn("text-[7.2px] font-semibold uppercase px-1.5 py-0.5 rounded tracking-tight shrink-0", item.badgeClass)}>
                            {item.discountText}
                          </span>
                        </div>
                        <h4 className="text-[11px] font-medium text-[#1a1a2e] group-hover:text-[#E8500A] transition-colors line-clamp-1 leading-tight mt-1">
                          {item.title}
                        </h4>
                      </div>
                      
                      <div className="flex items-center justify-between mt-1">
                        <span className="text-[11px] font-mono font-semibold text-[#E8500A]">
                          BDT {typeof item.price === 'number' ? item.price.toLocaleString() : item.price}
                        </span>
                        <button 
                          type="button" 
                          onClick={(e) => { 
                            e.stopPropagation(); 
                            const qty = 1;
                            addToCart(item, qty);
                            toast.success(`Successfully added ${item.title} to your cart!`);
                          }} 
                          className="w-8 h-8 rounded-full hover:bg-[#CF4400] text-white bg-[#E8500A] cursor-pointer transition-all duration-200 shrink-0 border-0 flex items-center justify-center shadow-md hover:scale-[1.05] active:scale-95"
                          aria-label="Add to cart"
                          title="Add to cart"
                        >
                          <ShoppingCart size={13} className="stroke-[2.5]" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Card 2 — Sponsored Brands */}
          <div className="bg-white rounded-[5px] border border-[#e8edf2] p-4.5 shadow-sm text-left">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-100">
              <h3 className="text-sm font-semibold tracking-tight text-[#1a1a2e]">
                Sponsored <span className="text-[#E8500A]">Brands</span>
              </h3>
              <Link 
                to="/brands" 
                className="text-[10px] font-semibold text-[#E8500A] uppercase tracking-wider hover:text-[#CF4400]"
              >
                SEE ALL
              </Link>
            </div>

            <div className="flex flex-col gap-3">
              {sponsoredBrandsList.length === 0 ? (
                <div className="text-center py-6 border border-dashed border-gray-200 rounded-lg">
                  <p className="text-xs text-gray-400 font-medium">Sponsored brands will appear here.</p>
                </div>
              ) : (
                sponsoredBrandsList.map((brand: any, idx) => (
                  <div 
                    key={brand.id || idx} 
                    onClick={() => navigate(`/brands/${brand.id}`)}
                    className="flex gap-3 bg-white border border-[#e8edf2] rounded-[5px] p-2.5 hover:border-gray-200 transition-all duration-200 group cursor-pointer text-left animate-fade-in"
                  >
                    <div className="w-11 h-11 rounded-lg border border-[#e8edf2] flex items-center justify-center bg-[#E8500A]/5 text-[#E8500A] font-extrabold text-sm uppercase shrink-0 overflow-hidden">
                      {brand.logo && (brand.logo.startsWith('http') || brand.logo.startsWith('/')) ? (
                        <img src={brand.logo} className="w-full h-full object-cover p-1" alt={brand.name} referrerPolicy="no-referrer" />
                      ) : (
                        brand.logo
                      )}
                    </div>
                    <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5 text-left">
                      <h4 className="text-[11px] font-semibold text-[#1a1a2e] group-hover:text-[#E8500A] transition-colors line-clamp-1 leading-tight">
                        {brand.name}
                      </h4>
                      <div className="flex items-center justify-between mt-1">
                        <span className="text-[9.5px] text-gray-400 font-normal truncate max-w-[110px]">
                          {brand.category || 'Advertiser Brand'}
                        </span>
                        <span className="text-[9px] font-semibold text-[#E8500A] uppercase tracking-wider hover:text-[#CF4400] transition-colors whitespace-nowrap shrink-0 ml-auto">
                          VIEW BRAND
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="mt-4 pt-3 border-t border-gray-100">
              <button 
                onClick={() => navigate('/brands')}
                className="w-full py-2 bg-gray-50 hover:bg-gray-100 text-gray-600 rounded-lg text-[10px] font-semibold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors border border-[#e8edf2] cursor-pointer"
              >
                SEE ALL BRANDS <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Card — FOR BUSINESS & SELLERS (REPOSITIONED & EXACT DIMENSIONS) */}
          <div 
            id="section-sellers" 
            className="bg-white rounded-[5px] border border-[#e8edf2] p-5 shadow-sm relative overflow-hidden flex flex-col justify-between text-center shrink-0 mx-auto" 
            style={{ width: '282px', height: '464px' }}
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#E8500A]/5 to-[#1c1c3c]/5 rounded-full blur-2xl pointer-events-none" />
            
            <div className="flex flex-col items-center">
              <div className="w-10 h-10 rounded-full bg-[#E8500A]/10 text-[#E8500A] flex items-center justify-center mb-3 border border-[#E8500A]/5 shrink-0 shadow-sm">
                <Sparkles className="w-5 h-5" />
              </div>
              
              <h3 className="text-sm font-semibold uppercase tracking-tight text-[#1a1a2e] leading-snug">
                For Business <span className="text-[#E8500A] italic">& Sellers</span>
              </h3>
              
              <p className="text-[11px] text-gray-400 font-medium mt-2 px-1 leading-relaxed">
                Unlock exclusive tools, secure verified merchant badges, and scale your authentic local reach.
              </p>
            </div>

            <div className="border border-dashed border-[#E8500A]/20 bg-gradient-to-b from-[#FFF0E8]/20 to-white rounded-[5px] p-4 text-center flex flex-col items-center justify-center my-2 flex-1">
              <h4 className="font-semibold text-gray-900 text-xs uppercase tracking-wider mb-1 leading-none">Boost Sales Today</h4>
              <p className="text-[10px] text-gray-500 mb-4 leading-relaxed max-w-[210px]">
                Gain entry to featured deal slots, exposure metrics, and buyer engagement streams.
              </p>
              
              <Link 
                to="/post-offer" 
                className="w-full py-2.5 bg-[#E8500A] hover:bg-[#CF4400] text-white font-semibold rounded-lg text-[10px] uppercase tracking-wider flex items-center justify-center gap-2 transition-colors shadow-sm"
              >
                Post Offer <PenTool className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="flex items-center justify-center gap-1 text-[8.5px] font-semibold text-gray-400 uppercase font-mono tracking-widest shrink-0">
              <Users className="w-3.5 h-3.5" /> 100k+ shopper log Daily
            </div>
          </div>

          {/* Card 3 — NEWSLETTER */}
          <div className="bg-white rounded-[5px] border border-[#e8edf2] p-5 shadow-sm text-left">
            <div className="mb-4">
              <h3 className="text-[9px] font-bold tracking-widest text-[#1a1a2e]/40 uppercase mb-1">NEWS DISPATCH</h3>
              <p className="text-[11px] text-gray-500 leading-relaxed">
                Receive newly verified outlet approvals, scam alerts, and retail deals weekly.
              </p>
            </div>
            
            <form onSubmit={handleNewsletterSubmit} className="flex flex-col gap-3">
              <div className="relative">
                <input 
                  type="email" 
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  placeholder="Enter your email address..." 
                  className="w-full h-10 px-4 bg-gray-50 border border-[#e8edf2] hover:bg-gray-100 rounded-lg text-xs font-medium text-[#1a1a2e] placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-[#E8500A]/30 transition-all text-left" 
                />
              </div>
              <button 
                type="submit" 
                className="w-full py-2.5 bg-[#E8500A] hover:bg-[#CF4400] rounded-lg text-[10.5px] font-semibold text-white tracking-wider uppercase transition-colors shadow-sm text-center flex items-center justify-center gap-2"
              >
                SUBSCRIBE NOW <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>

        </aside>

      </div> {/* Closes three-column grid */}

      {/* FEED SECTION G — TRUST BADGES */}
      <div id="section-trust" className="mt-10 bg-white rounded-[5px] border border-[#e8edf2] p-6 md:p-8 shadow-sm animate-fade-in w-full text-left font-sans">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
          
          <div className="text-center flex flex-col items-center gap-3.5">
            <div className="w-11 h-11 rounded-full bg-[#E8500A]/10 flex items-center justify-center text-[#E54D00] shrink-0 border border-[#E8500A]/5">
              <ShieldCheck className="w-5.5 h-5.5" />
            </div>
            <div>
              <h4 className="text-xs font-semibold text-[#1a1a2e] uppercase tracking-wide mb-1 leading-none">CONSUMER ADVOCACY</h4>
              <p className="text-[10.5px] text-gray-500 leading-relaxed max-w-xs mx-auto">
                Choosify lists merchant networks complying strictly with independent shopper audits. Our sole intention is safety-oriented purchasing.
              </p>
            </div>
          </div>

          <div className="text-center flex flex-col items-center gap-3.5 border-t md:border-t-0 md:border-x border-[#e8edf2] pt-5 md:pt-0 px-4">
            <div className="w-11 h-11 rounded-full bg-[#E8500A]/10 flex items-center justify-center text-[#E54D00] shrink-0 border border-[#E8500A]/5">
              <DollarSign className="w-5.5 h-5.5" />
            </div>
            <div>
              <h4 className="text-xs font-semibold text-[#1a1a2e] uppercase tracking-wide mb-1 leading-none">NO PAID PROMOTION</h4>
              <p className="text-[10.5px] text-gray-500 leading-relaxed max-w-xs mx-auto">
                We refuse merchant sponsorship commissions directly. Brands appear based purely on inventory availability and client satisfaction ratings.
              </p>
            </div>
          </div>

          <div className="text-center flex flex-col items-center gap-3.5 border-t md:border-t-0 pt-5 md:pt-0">
            <div className="w-11 h-11 rounded-full bg-[#E8500A]/10 flex items-center justify-center text-[#E54D00] shrink-0 border border-[#E8500A]/5">
              <Star className="w-5.5 h-5.5" />
            </div>
            <div>
              <h4 className="text-xs font-semibold text-[#1a1a2e] uppercase tracking-wide mb-1 leading-none">CURATED EXCELLENCE</h4>
              <p className="text-[10.5px] text-gray-500 leading-relaxed max-w-xs mx-auto">
                All listed retail lots feature solid distributor warranties and standard brand authenticity stamps, guaranteed.
              </p>
            </div>
          </div>

        </div>
      </div>

    </main>

    </div>
  );
}
