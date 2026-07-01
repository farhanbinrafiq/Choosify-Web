import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Search, ShoppingCart, MessageSquare, Bookmark, ChevronDown, ChevronRight, 
  ChevronLeft, Award, ShoppingBag, Check, ArrowUpRight, Heart, Eye, Share2, 
  Play, ShieldCheck, DollarSign, Star, AlertCircle, PenTool, Award as Trophy,
  Shirt, Smartphone, Gem, Gamepad2, Monitor, Utensils, Cpu, Tv, Home, Baby,
  Palette, Luggage,
  Flame, Sparkles, Send, Users, ShieldAlert, BadgeCheck, Zap, Clock,
  Gift, Package
} from 'lucide-react';
import { ProductCard } from '../components/ProductCard';
import { CampaignBannerCarousel } from '../components/CampaignBannerCarousel';
import { GlobalSearchBar } from '../components/GlobalSearchBar';
import { PRODUCTS, BRANDS, BLOGS } from '../constants';
import { FeaturedCard, ReelCard, HorizontalMediaCard } from './GuidesPage';
import { useGlobalState } from '../context/GlobalStateContext';
import { useDashboard } from '../context/DashboardContext';
import { useRegisterPageFilters } from '../components/FilterEngine';
import { CREATORS } from '../data/creators';
import { FollowButton } from '../components/FollowButton';
import toast from 'react-hot-toast';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';
import { QuickAccessCard } from '../components/QuickAccessCard';
import { BrandCardDesign } from '../components/BrandCardDesign';
import { CreatorCardDesign } from '../components/CreatorCardDesign';
import { getActiveHeroBanner, getSectionItemIds, isHomeSectionVisible } from '../utils/homepageCms';
import { orderByCatalogIds, pickByCatalogIds } from '../utils/catalogMatch';

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
  const { allProducts, allBrands, allDeals, allCategories, homepageConfig, siteConfig, mode, addToCart, getCreatorClaimStatus } = useGlobalState();
  const { savedProducts, setSavedProducts, addToCompare } = useDashboard();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('FEED');
  const [carouselIndex, setCarouselIndex] = useState(1);

  const activeHero = React.useMemo(() => getActiveHeroBanner(homepageConfig), [homepageConfig]);
  const heroHeadline = activeHero?.headline || "buy ORIGINAL";
  const heroSubtitle =
    activeHero?.subtitle ||
    'Weary of online counterfeiting and merchant fraud? Choosify.bd empowers your shopping with independent brand verification systems in Bangladesh.';
  const heroSearchTerms = React.useMemo(() => {
    const terms = (siteConfig?.popularSearches || [])
      .filter((item) => item.isActive)
      .sort((a, b) => a.order - b.order)
      .map((item) => item.term)
      .filter(Boolean);
    return terms.length ? terms : ['Sailor', 'Aarong', 'Samsung', 'Apex'];
  }, [siteConfig]);
  const sectionVisible = React.useCallback(
    (sectionId: string) => isHomeSectionVisible(homepageConfig, sectionId),
    [homepageConfig],
  );

  // Trending brands slider helper
  const rightBrandsList = allBrands && allBrands.length > 0 ? allBrands : BRANDS;
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
  const [activeStickySection, setActiveStickySection] = useState('all');
  const [activeRecsTab, setActiveRecsTab] = useState<'guides' | 'creators'>('guides');
  const [activeBrandsTab, setActiveBrandsTab] = useState<'brands' | 'products'>('brands');

  useRegisterPageFilters({
    pageName: 'Home',
    renderSearch: null, // home has its own hero search
    quickFilters: [], // no quick filters on homepage
    renderFilters: null, // no sidebar filters on homepage
    activeFilterCount: 0,
    onClearAll: null,
  });

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

  // Keyboard nav for brand carousel
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') setCarouselIndex(prev => (prev + 1) % CAROUSEL_BRANDS.length);
      if (e.key === 'ArrowLeft') setCarouselIndex(prev => (prev - 1 + CAROUSEL_BRANDS.length) % CAROUSEL_BRANDS.length);
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [CAROUSEL_BRANDS.length]);

  // Auto-advance carousel every 5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCarouselIndex(prev => (prev + 1) % CAROUSEL_BRANDS.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [CAROUSEL_BRANDS.length]);

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

  useEffect(() => {
    const handleScroll = () => {
      const sections = [
        { id: 'section-trending-brands', name: 'brands' },
        { id: 'section-popular-products', name: 'products' },
        { id: 'section-hot-deals', name: 'deals' },
        { id: 'section-recommendations', name: 'recommendations' },
        { id: 'section-categories', name: 'categories' },
        { id: 'section-customer-favorites', name: 'favorites' }
      ];
      
      const scrollPosition = window.scrollY + 220;
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
      setActiveStickySection(currentSection);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    if (id === 'all') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      setActiveStickySection('all');
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
          'section-trending-brands': 'brands',
          'section-popular-products': 'products',
          'section-hot-deals': 'deals',
          'section-recommendations': 'recommendations',
          'section-categories': 'categories',
          'section-customer-favorites': 'favorites'
        };
        if (nameMap[id]) {
          setActiveStickySection(nameMap[id]);
        }
      }
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

  // Search Submission
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      toast.error('Please specify what brand/type you seek!');
      return;
    }
    toast.success(`Scouting verified stores for: "${searchQuery}"`);
    navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
  };

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
    const featuredIds = homepageConfig?.featuredBrandIds?.length
      ? homepageConfig.featuredBrandIds
      : getSectionItemIds(homepageConfig, 'featured-brands');
    if (featuredIds.length) {
      const picked = pickByCatalogIds(rightBrandsList, featuredIds);
      if (picked.length) return picked.slice(0, 8);
    }
    return rightBrandsList.filter((b: any) => b.ratings >= 4.7 || b.featuredFlag || b.sponsoredFlag).slice(0, 8);
  }, [rightBrandsList, homepageConfig]);

  // Spotlight Creators list (5-8 maximum)
  const spotlightCreators = React.useMemo(() => {
    return CREATORS.map(c => {
      let rating = 4.7;
      let reviews = 85;
      let isHot = false;
      let isFeatured = false;

      if (c.id === 'creator-farhan') {
        rating = 4.9;
        reviews = 240;
        isHot = true;
      } else if (c.id === 'creator-sarah') {
        rating = 4.8;
        reviews = 190;
        isFeatured = true;
      } else if (c.id === 'creator-mily') {
        rating = 4.9;
        reviews = 150;
        isHot = true;
      } else if (c.id === 'creator-imtiaz') {
        rating = 4.7;
        reviews = 80;
      } else if (c.id === 'creator-shakib') {
        rating = 4.6;
        reviews = 70;
      }

      return {
        ...c,
        rating,
        reviews,
        isHot,
        isFeatured
      };
    }).slice(0, 8);
  }, []);

  const rightProductsList = React.useMemo(() => {
    const source = allProducts && allProducts.length > 0 ? allProducts : PRODUCTS;
    const featuredIds = homepageConfig?.featuredProductIds?.length
      ? homepageConfig.featuredProductIds
      : getSectionItemIds(homepageConfig, 'trending');
    if (!featuredIds.length) return source;
    return orderByCatalogIds(source, featuredIds);
  }, [allProducts, homepageConfig]);

  const sponsoredDeals = React.useMemo(() => {
    const productsList = allProducts && allProducts.length > 0 ? allProducts : PRODUCTS;
    return productsList.filter((p: any) => {
      // Check direct product flags
      if (p.isSponsored || p.sponsored || p.sponsoredStatus || p.sponsoredFlag) return true;
      
      // Look up brand
      const brand = allBrands?.find((b: any) => b.id === p.brandId || b.name?.toLowerCase() === p.brand?.toLowerCase());
      if (brand && brand.sponsoredFlag) return true;
      
      // brandId or brand checks
      if (p.brandId === 1 || p.brandId === 2 || p.brandId === 10) return true;
      const bLower = p.brand?.toLowerCase();
      if (bLower === 'samsung' || bLower === 'apple' || bLower === 'aarong') return true;
      
      return false;
    });
  }, [allProducts, allBrands]);

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
    return (allProducts && allProducts.length > 0 ? allProducts : PRODUCTS).map((p, idx) => {
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
  }, [allProducts]);

  const featuredDeals = React.useMemo(() => {
    return (allProducts && allProducts.length > 0 ? allProducts : PRODUCTS).map((p, idx) => {
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
  }, [allProducts]);

  const filteredProducts = activeTab === 'FEED' 
    ? rightProductsList 
    : rightProductsList.filter((p: any) => p.category?.toLowerCase() === activeTab.toLowerCase());

  // Sailor is the Spotlight Brand (Brand ID: default or 3)
  const sailorProductList = rightProductsList.filter((p: any) => p.brand?.toLowerCase() === 'sailor' || p.category?.toLowerCase() === 'fashion & lifestyle').slice(0, 4);

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

  // Blog list for recommendations
  const featuredBlog = BLOGS.find(b => b.id === 2) || BLOGS[1];
  const sideGuides = BLOGS.filter(b => b.id !== 2).slice(0, 3);

  const popularCategoriesMock = [
    { name: "Fashion & Lifestyle", count: "50 Products . 10 Brands", id: 'Fashion & Lifestyle' },
    { name: "Tech & Electronics", count: "50 Products . 10 Brands", id: 'Mobile & Phones' },
    { name: "Family & Kids", count: "50 Products . 10 Brands", id: 'Fashion & Lifestyle' },
    { name: "Jewelry & Accessories", count: "50 Products . 10 Brands", id: 'Jewelry & Accessories' },
    { name: "Hobbies & Creativity", count: "50 Products . 10 Brands", id: 'Jewelry & Accessories' },
    { name: "Travel & Hospitality", count: "50 Products . 10 Brands", id: 'Food & Restaurants' },
  ];

  const popularCategoriesList = React.useMemo(() => {
    if (allCategories?.length) {
      return [...allCategories]
        .filter((category) => category.enabled)
        .sort((a, b) => a.displayOrder - b.displayOrder)
        .slice(0, 6)
        .map((category) => {
          const productCount = (allProducts || []).filter(
            (product: any) => product.category === category.name,
          ).length;
          const brandCount = (allBrands || []).filter((brand: any) => brand.category === category.name).length;
          return {
            name: category.name,
            count: `${productCount || 0} Products · ${brandCount || 0} Brands`,
            id: category.slug || category.id,
          };
        });
    }
    return popularCategoriesMock;
  }, [allCategories, allProducts, allBrands]);

  const CAROUSEL_BG_COLORS = [
    '#0f2b2b', '#0a1e30', '#271808', '#16112b',
    '#0b2318', '#26102a', '#102333', '#22200a',
  ];

  return (
    <div className="bg-choosify-feed min-h-screen text-[#1A1D4E] antialiased pb-16 font-sans overflow-x-clip">
      
      {sectionVisible('hero') && (
      <section 
        className="hero-section hero-container relative hero-gradient text-white overflow-hidden py-4 px-6 shadow-inner-lg flex items-center justify-center"
        style={{
          height: '303px',
          ...(activeHero?.backgroundImage
            ? { backgroundImage: `url(${activeHero.backgroundImage})`, backgroundSize: 'cover', backgroundPosition: 'center' }
            : {}),
        }}
      >
        {/* Luminous dynamic background accents */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(232,80,10,0.18)_0%,_transparent_55%)] pointer-events-none" />
        <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[#EEF1F8]/10 to-transparent pointer-events-none" />
        
        {/* Subtle grid pattern helper */}
        <div className="absolute inset-0 opacity-5 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '16px 16px' }} />

        <div 
          className="hero-content max-w-5xl mx-auto text-center relative z-10 flex flex-col items-center justify-center w-full"
        >
          
          {/* Tagline Badge */}
          <div 
            className="inline-flex items-center gap-2 px-3 py-1 bg-white/5 backdrop-blur-md border border-white/10 rounded-full text-[9px] tracking-widest text-[#E8500A] font-extrabold uppercase mb-2 shadow-glow hover:border-white/25 transition-all duration-300"
            style={{ marginBottom: '6px', paddingLeft: '14px', paddingRight: '14px', paddingBottom: '3px', paddingTop: '3px' }}
          >
            <span className="flex h-1.5 w-1.5 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-green-500"></span>
            </span>
            <span className="font-space">Bangladesh's #1 Premium Brand Discovery Shield</span>
          </div>

          {/* Main Typography Header Section */}
          <h1 
            className="font-space font-extrabold text-[#FFFFFF] text-3xl sm:text-4xl md:text-5xl leading-none tracking-tight mb-2 max-w-none"
            style={{ marginBottom: '2px', paddingBottom: '2px', paddingRight: '0px', paddingTop: '2px' }}
          >
            {activeHero?.headline ? (
              activeHero.headline
            ) : (
              <>buy <span className="text-orange-primary italic font-black">ORIGINAL</span></>
            )}
          </h1>

          {/* Supporting Text */}
          <p 
            className="text-xs text-gray-300 max-w-2xl mx-auto font-medium mb-3 leading-relaxed opacity-95"
            style={{ marginBottom: '4px', paddingBottom: '2px', paddingTop: '2px' }}
          >
            {heroSubtitle}
          </p>

          {/* Glassmorphic Search Container */}
          <div className="relative w-full max-w-2xl mx-auto mb-3" style={{ width: '100%', maxWidth: '640px' }}>
            <GlobalSearchBar 
              placeholder="Search authentic Fashion hubs, Smart Gadgets & verified outlets..." 
              onSubmit={(val) => {
                setSearchQuery(val);
                navigate(`/search?q=${encodeURIComponent(val)}`);
              }}
            />
          </div>

          {/* Quick Shortcuts / Suggested */}
          <div 
            className="flex flex-wrap items-center justify-center gap-2 text-[10px] text-gray-400 font-semibold mb-0"
            style={{ paddingBottom: '2px', paddingTop: '2px' }}
          >
            <span className="font-mono text-gray-500 uppercase tracking-wider text-[9px]">Hot Targets:</span>
            {heroSearchTerms.map((term) => (
              <button
                key={term}
                type="button"
                onClick={() => {
                  setSearchQuery(term);
                  toast.success(`Scouting verified stores for: "${term}"`);
                  navigate(`/products?q=${encodeURIComponent(term)}`);
                }}
                className="px-2 py-0.5 bg-white/5 hover:bg-white/10 text-gray-300 rounded-full border border-white/5 hover:border-white/10 transition-all cursor-pointer text-[10px]"
              >
                #{term}
              </button>
            ))}
          </div>
        </div>
      </section>
      )}

      {/* SECTION 3 — MARQUEE BANNER */}
      <div className="relative z-20 bg-gradient-to-r from-[#E8500A] via-[#FF5B00] to-[#E8500A] text-white py-4.5 overflow-hidden border-y border-[#CF4400]/40 shadow-lg font-space text-[11.5px] font-black tracking-[0.2em] uppercase leading-none">
        <div className="flex w-max animate-marquee whitespace-nowrap gap-16">
          <span>🛡️ 100% ORIGINAL PRODUCTS ONLY • VERIFIED SHOPS IN BANGLADESH • CHOOSE WISELY 🛡️</span>
          <span>💎 AUTHENTIC OUTLETS DIRECTORY • NO MORE ONLINE SCAMS • SHOP WITH CONFIDENCE 💎</span>
          <span>🛡️ 100% ORIGINAL PRODUCTS ONLY • VERIFIED SHOPS IN BANGLADESH • CHOOSE WISELY 🛡️</span>
          <span>💎 AUTHENTIC OUTLETS DIRECTORY • NO MORE ONLINE SCAMS • SHOP WITH CONFIDENCE 💎</span>
        </div>
      </div>

      {/* SECTION 4 — THREE COLUMN GRID */}
      <main className="max-w-[1440px] mx-auto px-4 py-5 w-full flex flex-col gap-6 relative">
        <div className="grid grid-cols-1 lg:grid-cols-[240px_minmax(0,1fr)_260px] xl:grid-cols-[280px_minmax(0,1fr)_310px] gap-4 items-start w-full relative">
        
        {/* LEFT STICKY SIDEBAR */}
        <aside 
          className="hidden lg:flex flex-col gap-3 lg:sticky lg:top-24 pb-0 flex-shrink-0"
          style={{ paddingLeft: '0px', paddingRight: '0px', paddingBottom: '0px' }}
        >
          
          <QuickAccessCard />

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
          className="flex flex-col gap-5 w-full min-w-0"
          style={{ paddingTop: '0px', paddingLeft: '0px', paddingRight: '0px', paddingBottom: '8px' }}
        >
          


          {/* MAIN FEED CONTENT PORTAL */}
          {activeTab === 'FEED' ? (
            <>
              {sectionVisible('trending') && (
              <div
                id="section-trending-brands"
                className="rounded-[5px] border border-white/10 p-3 sm:p-5 shadow-sm overflow-hidden"
                style={{
                  backgroundColor: CAROUSEL_BG_COLORS[carouselIndex % CAROUSEL_BG_COLORS.length],
                  transition: 'background-color 0.75s ease',
                }}
              >
                <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between border-b border-white/10 pb-3 mb-4 gap-4">
                  <div className="text-left">
                    <div className="flex items-center gap-1">
                      <span className="text-base font-semibold text-white">Trending</span>
                      <span className="text-base font-semibold text-[#ff7c45]">Brands</span>
                    </div>
                    <p className="text-[12px] text-white/50 mt-1 text-left">
                      Connect with thousands of authentic shopper tests and verify brand credentials today.
                    </p>
                  </div>
                  <Link to="/brands" className="text-[12px] font-medium text-white/65 hover:text-white shrink-0 hover:underline">
                    View All Brands
                  </Link>
                </div>

                {/* ── PREMIUM EXPANDING BRAND CAROUSEL ──────────────────────── */}
                <TrendingBrandsCarousel
                  carouselBrands={carouselBrands}
                  carouselIndex={carouselIndex}
                  setCarouselIndex={setCarouselIndex}
                  navigate={navigate}
                  handleTouchStart={handleTouchStart}
                  handleTouchEnd={handleTouchEnd}
                  handleMouseDown={handleMouseDown}
                  handleMouseUpOrLeave={handleMouseUpOrLeave}
                />
              </div>
              )}

              {sectionVisible('trending') && (
              <div id="section-new-on-choosify" className="bg-white rounded-[5px] border border-[#e8edf2] p-5 shadow-sm">
                <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between border-b border-gray-100 pb-3 mb-4 gap-4">
                  <div className="text-left">
                    <div className="flex items-center gap-1">
                      <span className="text-base font-semibold text-[#1a1a2e]">New on</span>
                      <span className="text-base font-semibold text-[#E8500A]">Choosify</span>
                    </div>
                    <p className="text-[12px] text-[#8a9bb0] mt-1 text-left">
                      Fresh arrivals, latest reviews, and newly verified buying options in Bangladesh.
                    </p>
                  </div>
                  <Link to="/products" className="text-[12px] font-medium text-[#FF5B00] shrink-0 hover:underline">
                    View All Products
                  </Link>
                </div>

                {/* 4-column, 2-row Product Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {((allProducts.length > 0 ? allProducts : PRODUCTS) as any[])
                    .filter((p: any) => p.isNewArrival || p.id % 3 === 0)
                    .sort((a: any, b: any) => b.id - a.id)
                    .slice(0, 8)
                    .map((product) => (
                      <ProductCard key={product.id} product={product} variant="grid" />
                    ))}
                </div>

                {/* Bottom CTA Button */}
                <div className="text-center mt-6 pt-4 border-t border-gray-50">
                  <Link 
                    to="/products" 
                    className="inline-flex items-center gap-1.5 text-sm font-black text-[#E8500A] hover:text-[#CF4400] transition-colors uppercase tracking-wider"
                  >
                    <span>Browse All Products</span>
                    <ChevronRight size={16} />
                  </Link>
                </div>
              </div>
              )}

              {sectionVisible('featured-brands') && (
              <div 
                id="section-spotlight-brands" 
                className="p-6 md:p-8 shadow-sm text-left bg-white rounded-[5px] border border-[#e8edf2] mt-6"
              >
                {/* Header */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-gray-100 pb-3 mb-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-black text-[#E8500A] uppercase tracking-[0.25em]">Sponsored Brands Spotlight</span>
                      <span className="px-1.5 py-0.5 text-[9px] font-black tracking-widest text-[#E8500A]/90 border border-[#E8500A]/30 uppercase bg-[#E8500A]/10 rounded-full">AD</span>
                    </div>
                    <h2 className="text-base font-semibold text-[#1a1a2e] mt-1">SPOTLIGHT <span className="text-[#E8500A]">BRANDS</span></h2>
                    <p className="text-xs text-gray-400 mt-1">Discover curated exclusive collections directly from official certified channels.</p>
                  </div>
                  <div>
                    <span className="rounded-full px-2.5 py-1 text-[10px] font-extrabold tracking-wider bg-[#E8500A]/5 text-[#E8500A] border border-[#E8500A]/15 uppercase">
                      Sponsored AD
                    </span>
                  </div>
                </div>

                {/* Premium Horizontal Carousel */}
                <PremiumCarousel
                  items={spotlightBrands}
                  itemWidth={335}
                  gap={20}
                  renderCard={(brand) => {
                    const originalBrand = BRANDS.find(b => b.id === brand.id) || {};
                    const bestFor = (originalBrand as any).category === 'Fashion' ? 'Footwear' : 'Electronics';
                    const priceRange = (originalBrand as any).category === 'Fashion' ? '৳1200' : '৳15000';
                    const recommended = '94';

                    const cardBrand = {
                      id: brand.id,
                      name: brand.name,
                      logo: brand.logo,
                      category: brand.category || (originalBrand as any).category || 'Fashion',
                      bestFor: bestFor,
                      priceRange: priceRange,
                      rating: brand.rating || brand.ratings || 4.8,
                      reviewCount: Math.floor((brand.followers || 8400) * 0.1) || 840,
                      isFeatured: !!brand.featuredFlag,
                      successScore: parseInt(recommended) || 94,
                      tagline: (originalBrand as any).description || 'Traditional & contemporary clothing'
                    };

                    return (
                      <div className="shrink-0">
                        <BrandCardDesign brand={cardBrand} />
                      </div>
                    );
                  }}
                />
              </div>
              )}

              {sectionVisible('deals') && (
              <div id="section-hot-deals" className="bg-[#FFFFFF] border-t-2 border-[#E8500A] rounded-[5px] border border-[#e8edf2] p-5 shadow-sm text-left mb-6">
                
                {/* Section Header */}
                <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between border-b border-gray-100 pb-3 mb-4 gap-4">
                  <div className="text-left">
                    <div className="flex items-center gap-1">
                      <span className="text-base font-semibold text-[#1a1a2e]">Hot</span>
                      <span className="text-base font-semibold text-[#E8500A]">Deals</span>
                    </div>
                    <p className="text-[12px] text-[#8a9bb0] mt-1 text-left">
                      Best ongoing deals, discounts and limited-time offers.
                    </p>
                  </div>

                  <Link 
                    to="/deals" 
                    className="inline-flex items-center gap-1.5 hover:bg-gray-50 text-[#E8500A] hover:text-[#CF4400] text-xs font-bold uppercase tracking-wider rounded-lg transition-all"
                  >
                    View All Deals <ChevronRight size={14} />
                  </Link>
                </div>

                {/* Hot Deals Carousel of featured Products */}
                <PremiumCarousel
                  items={featuredDeals}
                  itemWidth={210}
                  gap={16}
                  renderCard={(product) => (
                    <div className="w-[210px] shrink-0 flex flex-col min-h-[270px] h-full">
                      <ProductCard product={product} variant="compact" />
                    </div>
                  )}
                />
              </div>
              )}

              {sectionVisible('creators') && (
              <div id="section-creator-spotlights" className="bg-white rounded-[5px] border border-[#e8edf2] p-5 shadow-sm text-left mb-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-gray-100 pb-3 mb-6 gap-4">
                  <div className="text-left">
                    <div className="flex items-center gap-2">
                      <span className="text-base font-semibold text-[#1a1a2e]">CREATOR</span>
                      <span className="text-base font-semibold text-[#E8500A]">SPOTLIGHT</span>
                    </div>
                    <p className="text-[12px] text-[#8a9bb0] mt-1 text-left">
                      Discover verified, featured, and sponsored creators producing trusted reviews, recommendations, and buying insights.
                    </p>
                  </div>
                  <Link to="/creators" className="text-[12px] font-medium text-[#FF5B00] shrink-0 hover:underline">
                    View All Creators
                  </Link>
                </div>

                {/* Premium Horizontal Carousel */}
                <PremiumCarousel
                  items={spotlightCreators}
                  itemWidth={335}
                  gap={20}
                  renderCard={(creator: any) => {
                    // Map the spotlightCreators data shape to what CreatorCardDesign expects
                    const cardCreator = {
                      id: creator.id,
                      name: creator.name,
                      handle: creator.handle,
                      avatar: creator.avatar,
                      score: creator.score ?? Math.round((creator.rating || 4.5) * 20),
                      bestFor: creator.bestFor || creator.category || 'Lifestyle',
                      platforms: creator.platforms || ['YouTube'],
                      rating: creator.rating || 4.8,
                      reviews: creator.reviews || 0,
                      isHot: creator.isHot,
                      isFeatured: creator.isFeatured,
                      coverImage: creator.coverImage,
                      bio: creator.bio,
                    };
                    return <CreatorCardDesign key={creator.id} creator={cardCreator} />;
                  }}
                />

                {/* Bottom CTA to Creators */}
                <div className="text-center mt-6 pt-4 border-t border-gray-50">
                  <Link 
                    to="/creators" 
                    className="inline-flex items-center gap-1.5 text-sm font-black text-[#E8500A] hover:text-[#CF4400] transition-colors uppercase tracking-wider"
                  >
                    <span>Browse All Creators</span>
                    <ChevronRight size={16} />
                  </Link>
                </div>
              </div>
              )}

              {sectionVisible('recommended') && (
              <div id="section-recommendations" className="bg-white rounded-[5px] border border-[#e8edf2] p-5 shadow-sm mt-6">
                
                {/* Section Header */}
                <div className="text-left mb-6">
                  <h2 className="text-base font-semibold text-[#1a1a2e]">
                    FEATURED <span className="text-[#E8500A]">RECOMMENDATIONS</span>
                  </h2>
                  <p className="text-[12px] text-[#8a9bb0] mt-1 text-left">
                    Connect with millions of shoppers and boost your brand visibility today.
                  </p>
                </div>

                {/* Main Featured Buying Guide banner blog layout */}
                <div className="mb-6">
                  <FeaturedCard guide={BLOGS[0]} />
                </div>

                {/* Sub Guides Grid matching elements visually */}
                <div 
                  id="section-guides"
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-8"
                  style={{ paddingTop: '0px', paddingBottom: '0px' }}
                >
                  <ReelCard guide={BLOGS[1]} />
                  <HorizontalMediaCard guide={BLOGS[2]} badgeType="youtube" />
                  <HorizontalMediaCard guide={BLOGS[3]} badgeType="blog" />
                </div>

                {/* Explore all Recommendations bottom action button */}
                <div className="text-center">
                  <Link 
                    to="/guides" 
                    className="inline-flex items-center gap-1.5 text-sm font-black text-[#E8500A] hover:text-[#CF4400] transition-colors uppercase tracking-wider"
                  >
                    <span>Explore All Recommendations</span>
                    <ChevronRight size={16} />
                  </Link>
                </div>
              </div>
              )}

              {sectionVisible('categories') && (
              <div id="section-categories" className="bg-white rounded-[5px] border border-[#e8edf2] p-5 shadow-sm">
                
                {/* Section Header */}
                <div className="flex items-center justify-between mb-5 pb-3 border-b border-gray-100">
                  <div className="text-left">
                    <h2 className="text-base font-semibold text-[#1a1a2e]">
                      POPULAR <span className="text-[#E8500A]">CATEGORIES</span>
                    </h2>
                    <p className="text-[12px] text-[#8a9bb0] mt-1 text-left">
                      EXPLORE BY INDUSTRY & NICHE
                    </p>
                  </div>
                  
                  {/* Show All Category Button on right */}
                  <div className="flex shrink-0">
                    <Link 
                      to="/categories" 
                      className="border border-[#e8edf2] hover:border-[#E8500A]/30 text-[#1a1a2e] hover:text-[#E8500A] text-[10px] font-medium uppercase tracking-wider rounded-lg px-4 py-2 bg-white transition-all hover:scale-[1.01] active:scale-95"
                    >
                      SHOW ALL CATEGORIES
                    </Link>
                  </div>
                </div>

                {/* Categories Grid - 6 beautiful cards exactly matching screenshot */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-left">
                  {popularCategoriesList.map((cat, idx) => {
                    // Custom high-fidelity category icon picker helper
                    const getCategoryMockIcon = (catName: string) => {
                      const name = catName.toLowerCase();
                      if (name.includes('fashion')) return <Shirt className="w-5 h-5 text-blue-600 stroke-[2]" />;
                      if (name.includes('tech') || name.includes('electronics')) return <Cpu className="w-5 h-5 text-[#1A73E8] stroke-[2]" />;
                      if (name.includes('family') || name.includes('kids')) return <Baby className="w-5 h-5 text-blue-500 stroke-[2]" />;
                      if (name.includes('jewelry') || name.includes('accessories')) return <Gem className="w-5 h-5 text-yellow-500 stroke-[2]" />;
                      if (name.includes('hobby') || name.includes('creativity') || name.includes('hobbies')) return <Palette className="w-5 h-5 text-orange-500 stroke-[2]" />;
                      if (name.includes('travel') || name.includes('hospitality')) return <Luggage className="w-5 h-5 text-rose-500 stroke-[2]" />;
                      return <ShoppingBag className="w-5 h-5 text-gray-500 stroke-[2]" />;
                    };

                    return (
                      <div 
                        key={idx}
                        onClick={() => {
                          setActiveTab(cat.id);
                          toast.success(`Active Category: ${cat.id}`);
                        }}
                        className="bg-white border border-[#e8edf2] rounded-[5px] p-4 flex flex-col items-start hover:border-gray-200/90 hover:scale-[1.01] transition-all duration-200 cursor-pointer group"
                      >
                        {/* Perfect white circle around the icon styled like mockup */}
                        <div className="w-9 h-9 bg-gray-50 rounded-full flex items-center justify-center mb-4 shrink-0">
                          {getCategoryMockIcon(cat.name)}
                        </div>
                        
                        <div className="w-full">
                          <h4 className="font-medium text-xs text-[#1a1a2e] group-hover:text-[#E8500A] transition-colors leading-tight mb-1 uppercase tracking-tight">
                            {cat.name}
                          </h4>
                          <p className="text-[10px] text-red-500 font-semibold leading-none uppercase font-mono">
                            {cat.count}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
              )}

              {/* FEED SECTION H — CUSTOMER FAVORITES */}
              <div id="section-customer-favorites" className="bg-white rounded-[5px] border border-[#e8edf2] p-5 shadow-sm mt-6">
                {/* Section Title Header */}
                <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between border-b border-gray-100 pb-4 mb-5 gap-3">
                  <div className="text-left">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-base font-bold text-[#1a1a2e] uppercase tracking-tight">Customer</span>
                      <span className="text-base font-bold text-[#E8500A] uppercase tracking-tight">Favorites</span>
                      <span className="bg-rose-100 text-rose-600 text-[10px] font-semibold px-2 py-0.5 rounded-full uppercase tracking-wider font-mono">Loved</span>
                    </div>
                    <p className="text-[11px] text-[#8a9bb0] mt-1 text-left">
                      Trending products loved by Choosify editors and verified customers.
                    </p>
                  </div>

                  <Link 
                    to="/customer-favorite" 
                    className="inline-flex items-center gap-1.5 hover:bg-gray-50 text-[#E8500A] hover:text-[#CF4400] text-xs font-bold uppercase tracking-wider rounded-lg transition-all"
                  >
                    View All Customer Favorites <ChevronRight size={14} />
                  </Link>
                </div>

                {/* Customer Favorites Grid of featured Products with isGuideDetail={true} */}
                <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 text-left">
                  {viralProductsList.slice(0, 8).map((product) => (
                    <ProductCard key={product.id} product={product} variant="grid" isGuideDetail={true} />
                  ))}
                </div>
              </div>
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
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredProducts.map((p: any) => (
                    <ProductCard key={p.id} product={p} variant="compact" />
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
          className="hidden lg:flex flex-col gap-5 lg:sticky lg:top-24 mr-0 pl-[2px] pb-0 w-full max-w-[260px] xl:max-w-[310px] flex-shrink-0 animate-fade-in"
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
                Gain entry to wholesale deals slots, exposure metrics, and buyer engagement streams.
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
                Receive newly verified outlet approvals, scam alerts, and business wholesale deals weekly.
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

interface TrendingBrandsCarouselProps {
  carouselBrands: { id: number; name: string; category: string; image: string }[];
  carouselIndex: number;
  setCarouselIndex: React.Dispatch<React.SetStateAction<number>>;
  navigate: ReturnType<typeof useNavigate>;
  handleTouchStart: (e: React.TouchEvent) => void;
  handleTouchEnd: () => void;
  handleMouseDown: (e: React.MouseEvent) => void;
  handleMouseUpOrLeave: () => void;
}

function TrendingBrandsCarousel({
  carouselBrands,
  carouselIndex,
  setCarouselIndex,
  navigate,
  handleTouchStart,
  handleTouchEnd,
  handleMouseDown,
  handleMouseUpOrLeave,
}: TrendingBrandsCarouselProps) {
  const [viewportSize, setViewportSize] = useState<'mobile' | 'tablet' | 'desktop'>('desktop');

  useEffect(() => {
    const update = () => {
      const w = window.innerWidth;
      if (w < 640) setViewportSize('mobile');
      else if (w < 1024) setViewportSize('tablet');
      else setViewportSize('desktop');
    };
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  const TOTAL = carouselBrands.length;

  const getIdx = (offset: number) =>
    (carouselIndex + offset + TOTAL * 10) % TOTAL;

  type SlotPosition = 'farPrev' | 'prev' | 'active' | 'next' | 'farNext';

  const slots: { brand: typeof carouselBrands[0]; position: SlotPosition }[] =
    viewportSize === 'mobile'
      ? [{ brand: carouselBrands[getIdx(0)], position: 'active' }]
      : viewportSize === 'tablet'
      ? [
          { brand: carouselBrands[getIdx(-1)], position: 'prev' },
          { brand: carouselBrands[getIdx( 0)], position: 'active' },
          { brand: carouselBrands[getIdx( 1)], position: 'next' },
        ]
      : [
          { brand: carouselBrands[getIdx(-2)], position: 'farPrev' },
          { brand: carouselBrands[getIdx(-1)], position: 'prev' },
          { brand: carouselBrands[getIdx( 0)], position: 'active' },
          { brand: carouselBrands[getIdx( 1)], position: 'next' },
          { brand: carouselBrands[getIdx( 2)], position: 'farNext' },
        ];

  const flexMap: Record<SlotPosition, number> =
    viewportSize === 'tablet'
      ? { farPrev: 0, prev: 1.4, active: 6, next: 1.4, farNext: 0 }
      : { farPrev: 0.9, prev: 2.2, active: 8, next: 2.2, farNext: 0.9 };

  const opacityMap: Record<SlotPosition, number> =
    viewportSize === 'tablet'
      ? { farPrev: 0, prev: 0.75, active: 1, next: 0.75, farNext: 0 }
      : { farPrev: 0.5, prev: 0.78, active: 1, next: 0.78, farNext: 0.5 };

  const trackHeight =
    viewportSize === 'mobile' ? '360px'
    : viewportSize === 'tablet' ? '440px'
    : '500px';

  const goNext = () => setCarouselIndex((prev) => (prev + 1) % TOTAL);
  const goPrev = () => setCarouselIndex((prev) => (prev - 1 + TOTAL) % TOTAL);

  const [localDragStart, setLocalDragStart] = useState<number | null>(null);

  const handleLocalTouchStart = (e: React.TouchEvent) => {
    setLocalDragStart(e.touches[0].clientX);
  };

  const handleLocalTouchEnd = (e: React.TouchEvent) => {
    if (localDragStart === null) return;
    const diff = localDragStart - e.changedTouches[0].clientX;
    const threshold = viewportSize === 'mobile' ? 35 : 60;
    if (diff > threshold) goNext();
    else if (diff < -threshold) goPrev();
    setLocalDragStart(null);
  };

  return (
    <>
      {/* CAROUSEL TRACK */}
      <div
        className="relative w-full overflow-hidden select-none"
        style={{ height: trackHeight }}
        onTouchStart={handleLocalTouchStart}
        onTouchEnd={handleLocalTouchEnd}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUpOrLeave}
      >
        <div className={`flex items-stretch h-full w-full ${viewportSize === 'mobile' ? '' : 'gap-2.5'}`}>
          {slots.map(({ brand, position }) => {
            const isActive = position === 'active';

            if (viewportSize === 'mobile') {
              return (
                <motion.div
                  key={`mobile-${brand.id}-${carouselIndex}`}
                  initial={{ opacity: 0, x: 40 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -40 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  onClick={() => navigate(`/brands/${brand.id}`)}
                  className="relative overflow-hidden cursor-pointer group w-full h-full"
                  style={{ borderRadius: '16px', flexShrink: 0 }}
                >
                  {/* a) Background image */}
                  <img
                    src={brand.image}
                    alt={brand.name}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-[2000ms] group-hover:scale-105"
                    draggable={false}
                  />

                  {/* b) Gradient overlay */}
                  <div
                    className="absolute inset-0 transition-opacity duration-500"
                    style={{
                      background: 'linear-gradient(to top, rgba(0,0,0,0.84) 0%, rgba(0,0,0,0.26) 52%, rgba(0,0,0,0.03) 100%)',
                    }}
                  />

                  {/* c) Category badge */}
                  <div className="absolute top-4 left-4 z-10">
                    <span
                      className="text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full text-white"
                      style={{ background: '#E8500A' }}
                    >
                      {brand.category}
                    </span>
                  </div>

                  {/* d) Active card — bottom content */}
                  <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15, duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
                    className="absolute inset-x-0 bottom-0 p-6 flex flex-col items-start gap-2.5 z-10"
                  >
                    <h3 className="text-xl sm:text-2xl lg:text-3xl font-black text-white uppercase leading-none tracking-tight italic">
                      {brand.name}
                    </h3>
                    <p className="text-white/55 text-[10px] font-bold uppercase tracking-widest">
                      Verified Brand on Choosify
                    </p>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/brands/${brand.id}`);
                      }}
                      className="mt-1 flex items-center gap-2 text-white text-[10px] font-black uppercase tracking-widest"
                    >
                      <div className="w-5 h-5 rounded-full border-2 border-white flex items-center justify-center">
                        <ArrowUpRight size={9} />
                      </div>
                      Explore Brand
                    </button>
                  </motion.div>
                </motion.div>
              );
            }

            const flexVal = flexMap[position];
            const opacityVal = opacityMap[position];
            const showBadge = isActive || (position === 'prev' || position === 'next');
            const showNamePill = !isActive && (position === 'prev' || position === 'next');

            return (
              <motion.div
                key={`${position}-${brand.id}`}
                initial={false}
                animate={{
                  flex: flexVal,
                  opacity: opacityVal,
                }}
                transition={{ type: 'spring', stiffness: 220, damping: 26, mass: 0.85 }}
                onClick={() => {
                  if (position === 'farPrev' || position === 'prev') goPrev();
                  else if (position === 'farNext' || position === 'next') goNext();
                  else navigate(`/brands/${brand.id}`);
                }}
                className="relative overflow-hidden cursor-pointer group"
                style={{ borderRadius: '20px', minWidth: 0, flexShrink: 0 }}
              >
                {/* a) Background image */}
                <img
                  src={brand.image}
                  alt={brand.name}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-[2000ms] group-hover:scale-105"
                  draggable={false}
                />

                {/* b) Gradient overlay */}
                <div
                  className="absolute inset-0 transition-opacity duration-500"
                  style={{
                    background: isActive
                      ? 'linear-gradient(to top, rgba(0,0,0,0.84) 0%, rgba(0,0,0,0.26) 52%, rgba(0,0,0,0.03) 100%)'
                      : 'linear-gradient(to top, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0.48) 100%)',
                  }}
                />

                {/* c) Category badge */}
                {showBadge && (
                  <div className="absolute top-4 left-4 z-10">
                    <span
                      className="text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full text-white"
                      style={{ background: '#E8500A' }}
                    >
                      {brand.category}
                    </span>
                  </div>
                )}

                {/* d) Active card — bottom content */}
                {isActive && (
                  <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15, duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
                    className="absolute inset-x-0 bottom-0 p-6 flex flex-col items-start gap-2.5 z-10"
                  >
                    <h3 className="text-xl sm:text-2xl lg:text-3xl font-black text-white uppercase leading-none tracking-tight italic">
                      {brand.name}
                    </h3>
                    <p className="text-white/55 text-[10px] font-bold uppercase tracking-widest">
                      Verified Brand on Choosify
                    </p>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/brands/${brand.id}`);
                      }}
                      className="mt-1 flex items-center gap-2 text-white text-[10px] font-black uppercase tracking-widest"
                    >
                      <div className="w-5 h-5 rounded-full border-2 border-white flex items-center justify-center">
                        <ArrowUpRight size={9} />
                      </div>
                      Explore Brand
                    </button>
                  </motion.div>
                )}

                {/* e) Inactive card — name pill bottom */}
                {showNamePill && (
                  <div className="absolute inset-x-0 bottom-4 flex justify-center px-2 z-10">
                    <span
                      className="text-[9px] font-black uppercase tracking-wide text-white px-3 py-1.5 rounded-full truncate max-w-full border border-white/10"
                      style={{ background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(8px)' }}
                    >
                      {brand.name}
                    </span>
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* NAVIGATION CONTROLS */}
      <div className="mt-5 flex items-center justify-between border-t border-white/10 pt-4 select-none px-1">
        {/* Dot indicators */}
        <div className="flex items-center gap-2">
          {carouselBrands.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setCarouselIndex(i)}
              className={`transition-all duration-500 rounded-full border-0 cursor-pointer p-0 ${
                viewportSize === 'mobile' ? 'h-2' : 'h-1.5'
              }`}
              style={{
                width: carouselIndex === i
                  ? (viewportSize === 'mobile' ? '28px' : '36px')
                  : (viewportSize === 'mobile' ? '10px' : '8px'),
                background: carouselIndex === i ? '#E8500A' : 'rgba(255,255,255,0.22)',
              }}
              aria-label={`Go to brand ${i + 1}`}
            />
          ))}
        </div>

        {/* Slide counter */}
        <span className="text-[10px] font-black text-white/45 uppercase tracking-widest tabular-nums">
          {String(carouselIndex + 1).padStart(2, '0')} / {String(TOTAL).padStart(2, '0')}
        </span>

        {/* Arrow buttons */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={goPrev}
            className={`rounded-full border border-white/20 bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all active:scale-90 cursor-pointer ${
              viewportSize === 'mobile' ? 'w-10 h-10' : 'w-9 h-9'
            }`}
            title="Previous Brand"
          >
            <ChevronLeft size={16} />
          </button>
          <button
            type="button"
            onClick={goNext}
            className={`rounded-full border border-white/20 bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all active:scale-90 cursor-pointer ${
              viewportSize === 'mobile' ? 'w-10 h-10' : 'w-9 h-9'
            }`}
            title="Next Brand"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </>
  );
}

// PREMIUM CAROUSEL HELPER
function PremiumCarousel({ 
  items, 
  renderCard, 
  itemWidth = 280, 
  gap = 16 
}: {
  items: any[];
  renderCard: (item: any, index: number, isActive: boolean) => React.ReactNode;
  itemWidth?: number;
  gap?: number;
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(800);
  const [dragStartX, setDragStartX] = useState<number | null>(null);
  const [dragOffset, setDragOffset] = useState(0);
  const lastWheelTime = React.useRef(0);

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

  const totalItems = items.length;

  const next = () => {
    setCurrentIndex((prev) => (prev + 1) % totalItems);
  };

  const prev = () => {
    setCurrentIndex((prev) => (prev - 1 + totalItems) % totalItems);
  };

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
    if (dragOffset > 50) {
      next();
    } else if (dragOffset < -50) {
      prev();
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
    setDragOffset(dragStartX - e.clientX);
  };

  const handleMouseUpOrLeave = () => {
    if (dragStartX === null) return;
    if (dragOffset > 50) {
      next();
    } else if (dragOffset < -50) {
      prev();
    }
    setDragStartX(null);
    setDragOffset(0);
  };

  const handleWheel = (e: React.WheelEvent) => {
    const now = Date.now();
    if (now - lastWheelTime.current < 400) return;
    if (Math.abs(e.deltaX) > 20 || Math.abs(e.deltaY) > 30) {
      if (e.deltaX > 20 || e.deltaY > 30) {
        next();
      } else {
        prev();
      }
      lastWheelTime.current = now;
      e.preventDefault();
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (document.activeElement?.tagName === 'INPUT' || document.activeElement?.tagName === 'TEXTAREA') {
        return;
      }
      if (e.key === 'ArrowLeft') {
        prev();
      } else if (e.key === 'ArrowRight') {
        next();
      }
    };

    const container = containerRef.current;
    let isHovered = false;
    const onEnter = () => { isHovered = true; };
    const onLeave = () => { isHovered = false; };

    const handleKeyGlobal = (e: KeyboardEvent) => {
      if (isHovered) {
        handleKeyDown(e);
      }
    };

    if (container) {
      container.addEventListener('mouseenter', onEnter);
      container.addEventListener('mouseleave', onLeave);
      window.addEventListener('keydown', handleKeyGlobal);
    }

    return () => {
      if (container) {
        container.removeEventListener('mouseenter', onEnter);
        container.removeEventListener('mouseleave', onLeave);
      }
      window.removeEventListener('keydown', handleKeyGlobal);
    };
  }, [totalItems]);

  const translateX = -(currentIndex * (itemWidth + gap)) - dragOffset;

  return (
    <div className="relative w-full overflow-hidden select-none animate-fade-in" ref={containerRef}>
      <div 
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUpOrLeave}
        onMouseLeave={handleMouseUpOrLeave}
        onWheel={handleWheel}
        className="w-full active:cursor-grabbing overflow-hidden"
      >
        <motion.div
          animate={{ x: translateX }}
          transition={{ type: "spring", stiffness: 120, damping: 20 }}
          className="flex gap-4 items-stretch w-max h-full py-2"
        >
          {items.map((item, idx) => (
            <div 
              key={idx} 
              style={{ width: `${itemWidth}px` }} 
              className="shrink-0 h-full flex"
            >
              {renderCard(item, idx, idx === currentIndex)}
            </div>
          ))}
        </motion.div>
      </div>

      <div className="flex items-center justify-between mt-2 select-none">
        <div className="flex gap-1.5">
          {items.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setCurrentIndex(i)}
              className={cn(
                "h-1.5 rounded-full transition-all duration-300",
                i === currentIndex ? "w-5 bg-[#E8500A]" : "w-1.5 bg-gray-200 hover:bg-gray-300"
              )}
              title={`Go to slide ${i + 1}`}
            />
          ))}
        </div>

        <div className="flex gap-2">
           <button 
             type="button"
             onClick={prev} 
             className="w-8 h-8 rounded-full border border-gray-100 bg-white flex items-center justify-center hover:bg-[#E8500A] hover:text-white hover:border-[#E8500A]/30 transition-all active:scale-90 shadow-xs cursor-pointer"
             title="Previous Slide"
           >
              <ChevronLeft size={16} />
           </button>
           <button 
             type="button"
             onClick={next} 
             className="w-8 h-8 rounded-full border border-gray-100 bg-white flex items-center justify-center hover:bg-[#E8500A] hover:text-white hover:border-[#E8500A]/30 transition-all active:scale-90 shadow-xs cursor-pointer"
             title="Next Slide"
           >
              <ChevronRight size={16} />
           </button>
        </div>
      </div>
    </div>
  );
}