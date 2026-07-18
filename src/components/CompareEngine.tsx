import React, { useState, useMemo, useRef, useEffect } from 'react';
import { 
  Zap, Info, Star, ShieldCheck, ShoppingBag, 
  ChevronDown, ChevronUp, Plus, X, Sparkles,
  Trophy, Medal, Activity, Scale, CreditCard,
  Truck, ArrowRight, CheckCircle2, AlertCircle, 
  Share2, HelpCircle, Users, BookOpen, Layers,
  Heart, Camera, Crown, Sliders, RefreshCw, Check,
  ChevronRight
} from 'lucide-react';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'motion/react';
import { DragScrollContainer, ActiveFilterChips, FullSidebarFilterPanel, useRegisterPageFilters, useDragScroll } from './FilterEngine';
import { EmiComparePanel } from './emi/EmiComparePanel';
import { EmiAiLogo } from './EmiAiLogo';
import { useDashboard } from '../context/DashboardContext';
import { useGlobalState } from '../context/GlobalStateContext';
import { toast } from 'react-hot-toast';
import { Link, useNavigate } from 'react-router-dom';
import { PRODUCTS } from '../constants';
import { SponsoredCompareRail } from './commerce/PlacementSlot';

// ==========================================
// TYPE & INTERFACE DEFINITIONS
// ==========================================
interface SmartphoneProduct {
  id: string;
  brand: string;
  name: string;
  image: string;
  price: number;
  rating: number;
  reviews: string;
  colors: string[];
  specs: Record<string, string>;
  verdict: {
    badge: string;
    text: string;
    score: string;
  };
}

// Default 3 Flagship Smartphones from Reference Image
const DEFAULT_SMARTPHONES: SmartphoneProduct[] = [
  {
    id: 'phone-1',
    brand: 'Apple',
    name: 'Apple iPhone 15 Pro Max (256GB)',
    image: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=400&h=400&fit=crop',
    price: 167500,
    rating: 4.8,
    reviews: '12.4K',
    colors: ['#3B3C36', '#8C92AC', '#D1D5DB', '#1E293B'], // Black, Titanium Gray, Silver, Blue
    specs: {
      // OVERVIEW
      bestPrice: '৳167,500',
      offersCount: '12',
      rating: '4.8',
      releaseDate: 'September 2023',
      // DISPLAY
      screenSize: '6.7 inches',
      displayType: 'Super Retina XDR OLED',
      refreshRate: '120Hz',
      resolution: '2796 x 1290',
      protection: 'Ceramic Shield',
      // PERFORMANCE
      chipset: 'A17 Pro (3nm)',
      ram: '8GB',
      performanceScore: '1,542,000',
      // CAMERA
      mainCamera: '48MP',
      ultraWide: '12MP',
      telephoto: '12MP (5x zoom)',
      videoRecording: '4K @ 60fps',
      // BATTERY
      batteryCapacity: '4,422 mAh',
      chargingWired: '27W',
      chargingWireless: '15W (MagSafe)',
    },
    verdict: {
      badge: 'PREMIUM CHOICE',
      text: 'Best overall premium experience',
      score: '8.7/10'
    }
  },
  {
    id: 'phone-2',
    brand: 'Samsung',
    name: 'Samsung Galaxy S24 Ultra (256GB)',
    image: 'https://images.unsplash.com/photo-1707251759491-18d48607ea0c?w=400&h=400&fit=crop',
    price: 145000,
    rating: 4.6,
    reviews: '8.2K',
    colors: ['#2E3033', '#DFD3C3', '#9CA3AF', '#2A3439'], // Titanium Black, Yellow, Gray, Violet
    specs: {
      // OVERVIEW
      bestPrice: '৳145,000',
      offersCount: '18',
      rating: '4.6',
      releaseDate: 'January 2024',
      // DISPLAY
      screenSize: '6.8 inches',
      displayType: 'Dynamic AMOLED 2X',
      refreshRate: '120Hz',
      resolution: '3120 x 1440',
      protection: 'Gorilla Glass Armor',
      // PERFORMANCE
      chipset: 'Snapdragon 8 Gen 3',
      ram: '12GB',
      performanceScore: '2,012,000',
      // CAMERA
      mainCamera: '200MP',
      ultraWide: '12MP',
      telephoto: '50MP (5x zoom)',
      videoRecording: '8K @ 30fps',
      // BATTERY
      batteryCapacity: '5,000 mAh',
      chargingWired: '45W',
      chargingWireless: '15W',
    },
    verdict: {
      badge: 'BEST ALL ROUNDER',
      text: 'Best balance of features & value',
      score: '9.2/10'
    }
  },
  {
    id: 'phone-3',
    brand: 'Google',
    name: 'Google Pixel 8 Pro (256GB)',
    image: 'https://images.unsplash.com/photo-1698301131105-0210e7b8f95c?w=400&h=400&fit=crop',
    price: 129990,
    rating: 4.5,
    reviews: '6.1K',
    colors: ['#2F3542', '#F1F2F6', '#70A1FF'], // Obsidian, Porcelain, Bay Blue
    specs: {
      // OVERVIEW
      bestPrice: '৳129,990',
      offersCount: '9',
      rating: '4.5',
      releaseDate: 'October 2023',
      // DISPLAY
      screenSize: '6.7 inches',
      displayType: 'LTPO OLED',
      refreshRate: '120Hz',
      resolution: '2992 x 1344',
      protection: 'Gorilla Glass Victus 2',
      // PERFORMANCE
      chipset: 'Google Tensor G3',
      ram: '12GB',
      performanceScore: '1,028,000',
      // CAMERA
      mainCamera: '50MP',
      ultraWide: '48MP',
      telephoto: '48MP (5x zoom)',
      videoRecording: '4K @ 60fps',
      // BATTERY
      batteryCapacity: '5,050 mAh',
      chargingWired: '30W',
      chargingWireless: '23W',
    },
    verdict: {
      badge: 'BEST CAMERA',
      text: 'Outstanding camera performance',
      score: '8.5/10'
    }
  }
];

// Definition of sections and row parameters
const COMPARE_SECTIONS = [
  {
    id: 'overview',
    title: 'OVERVIEW',
    rows: [
      { key: 'bestPrice', label: 'Best Price', hasOffers: true },
      { key: 'rating', label: 'Rating (Users)', isRating: true },
      { key: 'releaseDate', label: 'Release Date' },
    ]
  },
  {
    id: 'display',
    title: 'DISPLAY',
    rows: [
      { key: 'screenSize', label: 'Screen Size' },
      { key: 'displayType', label: 'Display Type' },
      { key: 'refreshRate', label: 'Refresh Rate' },
      { key: 'resolution', label: 'Resolution' },
      { key: 'protection', label: 'Protection' },
    ]
  },
  {
    id: 'performance',
    title: 'PERFORMANCE',
    rows: [
      { key: 'chipset', label: 'Chipset', hasIcon: true },
      { key: 'ram', label: 'RAM' },
      { key: 'performanceScore', label: 'Performance Score (AnTuTu)' },
    ]
  },
  {
    id: 'camera',
    title: 'CAMERA (REAR)',
    rows: [
      { key: 'mainCamera', label: 'Main Camera' },
      { key: 'ultraWide', label: 'Ultra Wide' },
      { key: 'telephoto', label: 'Telephoto' },
      { key: 'videoRecording', label: 'Video Recording' },
    ]
  },
  {
    id: 'battery',
    title: 'BATTERY',
    rows: [
      { key: 'batteryCapacity', label: 'Battery Capacity' },
      { key: 'chargingWired', label: 'Charging (Wired)' },
      { key: 'chargingWireless', label: 'Charging (Wireless)' },
    ]
  }
];

export function CompareEngine() {
  const { comparedProducts = [], setComparedProducts } = useDashboard() || {};
  const { allProducts = [] } = useGlobalState() || {};

  // Local state for decision profile pill triggers
  const [activeProfile, setActiveProfile] = useState<string>('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeSection, setActiveSection] = useState('overview');

  // AI Recommendation Panel States
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiRecommendation, setAiRecommendation] = useState<string | null>(null);

  // Map compared products or fallback to default smartphones
  const displayItems = useMemo(() => {
    if (comparedProducts && comparedProducts.length > 0) {
      // Map custom user products into the uniform smartphone-like structure or fit clothing structures
      return comparedProducts.map((p, idx) => {
        const isClothing = !p.specs || (p.category && p.category.toLowerCase().includes('clothing')) || (p.specs && p.specs.material);
        
        if (isClothing) {
          return {
            id: String(p.id),
            brand: p.brand || 'Brand',
            name: p.name || p.title || 'Product',
            image: (p.images && p.images[0]) || p.image || 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=400&h=400&fit=crop',
            price: p.price || 0,
            rating: p.rating || 4.5,
            reviews: p.reviews ? String(p.reviews) : '240',
            colors: p.colors || ['#333', '#ccc'],
            specs: {
              bestPrice: `৳${(p.price || 0).toLocaleString()}`,
              offersCount: '3',
              rating: `${p.rating || 4.5}`,
              releaseDate: 'Spring 2024',
              screenSize: p.specs?.sizes || 'S, M, L, XL',
              displayType: p.specs?.material || 'Premium Cotton Fabric',
              refreshRate: p.specs?.fit || 'Custom Regular Fit',
              resolution: p.specs?.experience || 'Breathable Comfort Layer',
              protection: p.specs?.durability || 'Highly Durable (Double Stitch)',
              chipset: p.specs?.build || 'Exquisite Finishing',
              ram: 'N/A',
              performanceScore: p.specs?.influence || '94/100 Trust Score',
              mainCamera: 'N/A',
              ultraWide: 'N/A',
              telephoto: 'N/A',
              videoRecording: 'N/A',
              batteryCapacity: 'N/A',
              chargingWired: 'N/A',
              chargingWireless: 'N/A'
            },
            verdict: {
              badge: idx === 0 ? 'OUR PICK' : 'HIGH QUALITY',
              text: idx === 0 ? 'Best tailored comfort' : 'Excellent choice for segment',
              score: '8.8/10'
            }
          };
        } else {
          // Standard/Smartphone/Electronic item mapper
          return {
            id: String(p.id),
            brand: p.brand || 'Brand',
            name: p.name || p.title || 'Product',
            image: (p.images && p.images[0]) || p.image || 'https://images.unsplash.com/photo-1707251759491-18d48607ea0c?w=400&h=400&fit=crop',
            price: p.price || 0,
            rating: p.rating || 4.6,
            reviews: p.reviews ? String(p.reviews) : '1.2K',
            colors: p.colors || ['#555', '#ccc'],
            specs: {
              bestPrice: `৳${(p.price || 0).toLocaleString()}`,
              offersCount: '12',
              rating: `${p.rating || 4.6}`,
              releaseDate: p.specs?.releaseDate || 'January 2024',
              screenSize: p.specs?.screenSize || '6.7 inches',
              displayType: p.specs?.displayType || p.specs?.material || 'OLED display panel',
              refreshRate: p.specs?.refreshRate || '120Hz',
              resolution: p.specs?.resolution || 'FHD+ Display',
              protection: p.specs?.protection || 'Hardened Glass Core',
              chipset: p.specs?.chipset || p.specs?.build || 'Octa-core SoC',
              ram: p.specs?.ram || '8GB RAM',
              performanceScore: p.specs?.performanceScore || '1,200,000 AnTuTu',
              mainCamera: p.specs?.mainCamera || '50MP Sensor',
              ultraWide: p.specs?.ultraWide || '12MP Sensor',
              telephoto: p.specs?.telephoto || '12MP zoom',
              videoRecording: p.specs?.videoRecording || '4K recording',
              batteryCapacity: p.specs?.batteryCapacity || '4,500 mAh',
              chargingWired: p.specs?.chargingWired || '30W',
              chargingWireless: p.specs?.chargingWireless || '15W',
            },
            verdict: {
              badge: idx === 0 ? 'PREMIUM PICK' : 'STRONG CHOICE',
              text: p.description || 'Highly rated verified user balance',
              score: '8.9/10'
            }
          };
        }
      });
    }
    return DEFAULT_SMARTPHONES;
  }, [comparedProducts]);

  // Determine which cells should have the "Best / Highlights" badge based on current selection or maximum values
  const cellHighlights = useMemo(() => {
    const highlights: Record<string, Record<string, string>> = {};

  // Guide Filter States
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [selectedUseCase, setSelectedUseCase] = useState<string>('all');

  // AI Filter States
  const [selectedAIChoice, setSelectedAIChoice] = useState<string>('all');
  const [selectedRiskRating, setSelectedRiskRating] = useState<string>('all');

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showDifferencesOnly, setShowDifferencesOnly] = useState(false);
  const [isProductSearchOpen, setIsProductSearchOpen] = useState(false);
  const [productSearchQuery, setProductSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const { ref: stickyNavTrackRef, props: stickyNavTrackProps } = useDragScroll({ grabCursor: false });
  const userNavScrollUntilRef = useRef(0);
  const emiHelpRef = useRef<HTMLDivElement | null>(null);

  const STICKY_PILL_BASE =
    'shrink-0 px-4 py-2.5 sm:py-2 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all duration-200 flex items-center gap-1.5 cursor-pointer whitespace-nowrap touch-manipulation min-h-[40px] sm:min-h-0';
  const STICKY_PILL_ACTIVE =
    'bg-[#FF5B00] text-white border border-[#FF5B00]';
  const STICKY_PILL_INACTIVE =
    'bg-white text-[#1A1A2E] border border-[#E8EDF2] hover:border-[#FF5B00]/40 hover:text-[#FF5B00]';

  const compareModeOptions = [
    { id: 'product' as const, label: 'Product Compare', icon: <ShoppingBag size={13} /> },
    { id: 'brand' as const, label: 'Brand Compare', icon: <ShieldCheck size={13} /> },
    { id: 'creator' as const, label: 'Creator Intel', icon: <Users size={13} /> },
    { id: 'guide' as const, label: 'Buying Guides', icon: <BookOpen size={13} /> },
    { id: 'ai' as const, label: 'AI Smart Mode', icon: <Sparkles size={13} /> },
  ];

  const heroProductSlots = compareMode === 'product' ? Math.max(0, 4 - comparedProducts.length) : 0;
  const catalogProducts = allProducts.length > 0 ? allProducts : PRODUCTS;

  // Soft trigger for loading state when filters adjust
  const triggerSoftLoading = () => {
    setIsLoading(true);
    const timer = setTimeout(() => setIsLoading(false), 300);
    return () => clearTimeout(timer);
  };

  const handleClearAllFilters = () => {
    setSelectedBudget(5000);
    setSelectedAvailability('all');
    setDealsOnly(false);
    setOfficialStoreOnly(false);
    setSelectedBrandSpec('all');
    setSelectedBrandSegment('all');
    setSelectedBrandCountry('all');
    setSelectedCreatorPlatform('all');
    setSelectedCreatorEngagement('all');
    setSelectedDifficulty('all');
    setSelectedUseCase('all');
    setSelectedAIChoice('all');
    setSelectedRiskRating('all');
    triggerSoftLoading();
  };

  const toggleSection = (title: string) => {
    setOpenSections(prev => 
      prev.includes(title) ? prev.filter(t => t !== title) : [...prev, title]
    );
  };

  // ==========================================
  // PREPARE DYNAMIC DATA BASED ON MODE & FILTERS
  // ==========================================
  const { items, sections, titlePrefix } = useMemo(() => {
    switch (compareMode) {
      case 'brand':
        return { 
          items: BRAND_ITEMS, 
          sections: BRAND_SECTIONS, 
          titlePrefix: 'BRANDS' 
        };
      case 'creator':
        return { 
          items: CREATOR_ITEMS, 
          sections: CREATOR_SECTIONS, 
          titlePrefix: 'CREATORS' 
        };
      case 'guide':
        return { 
          items: GUIDE_ITEMS, 
          sections: GUIDE_SECTIONS, 
          titlePrefix: 'BUYING GUIDES' 
        };
      case 'ai':
        return { 
          items: AIS_ITEMS, 
          sections: AIS_SECTIONS, 
          titlePrefix: 'AI ANALYTICS' 
        };
      case 'product':
      default: {
        const mappedProducts = (comparedProducts || []).map((product: any) => ({
          id: String(product.id),
          brand: product.brand || 'Brand',
          name: product.name || product.title || 'Product',
          image: (product.images && product.images[0]) || product.image || 'https://images.unsplash.com/photo-1707251759491-18d48607ea0c?w=400&h=400&fit=crop',
          tag: product.tag || 'Popular',
          price: product.price || 0,
          rating: product.rating || 4.5,
          score: typeof product.score === 'number' ? product.score : undefined,
          category: product.category || product.categoryName || '',
          isWinner: product.isWinner || false,
          highlightText: product.description || 'Excellent quality decision match.',
          specs: {
            price: `৳${(product.price || 0).toLocaleString()}`,
            value: product.value || 'Excellent',
            clearance: product.discount ? `${product.discount}% OFF` : 'No Offer',
            rating: `${product.rating || 4.5}/5.0`,
            influence: product.influence || '90/100',
            build: product.build || 'Premium',
            durability: product.durability || 'High (3 yrs)',
            experience: product.experience || 'Supreme',
            sizes: product.sizes ? product.sizes.join(', ') : 'M-XXL',
            material: product.material || 'Premium Cotton',
            waterproof: product.waterproof || 'No',
            fit: product.fit || 'Custom Fit',
            warranty: product.warranty || '1 Year',
            returns: product.returns || '30 Days',
            availability: product.stock && product.stock > 0 ? 'In Stock' : 'In Stock',
            deals: product.discount ? 'Yes' : 'Yes',
            officialStore: 'Yes',
          }
        }));
        return {
          items: mappedProducts,
          sections: PRODUCT_SECTIONS,
          titlePrefix: 'PRODUCTS',
        };
      }
    }
  }, [compareMode, comparedProducts]);

  // Evaluate matching condition for decision highlight (Dimming non-matching options, highlighting optimal)
  const evaluatedMatchingColumns = useMemo(() => {
    return items.map(item => {
      let isMatch = true;

      if (compareMode === 'product') {
        const itemPrice = item.price || 0;
        if (itemPrice > selectedBudget) isMatch = false;
        if (selectedAvailability !== 'all' && item.specs.availability !== selectedAvailability) isMatch = false;
        if (dealsOnly && item.specs.deals !== 'Yes') isMatch = false;
        if (officialStoreOnly && item.specs.officialStore !== 'Yes') isMatch = false;
        if (selectedBrandSpec !== 'all' && item.brand !== selectedBrandSpec) isMatch = false;
        if (selectedCategory !== 'all' && item.category && item.category !== selectedCategory) isMatch = false;
      }
      else if (compareMode === 'brand') {
        if (selectedBrandSegment !== 'all') {
          if (selectedBrandSegment === 'legacy' && item.specs.behaviorType !== 'Legacy Brand') isMatch = false;
          if (selectedBrandSegment === 'global' && item.specs.behaviorType !== 'Global Appeal') isMatch = false;
        }
        if (selectedBrandCountry !== 'all') {
          if (selectedBrandCountry === 'local' && item.specs.country !== 'Bangladesh') isMatch = false;
        }
      }
      else if (compareMode === 'creator') {
        if (selectedCreatorPlatform !== 'all' && !item.specs.platform.includes(selectedCreatorPlatform)) isMatch = false;
        if (selectedCreatorEngagement !== 'all') {
          const engPercent = parseFloat(item.specs.engagement);
          if (selectedCreatorEngagement === 'high' && engPercent < 8.0) isMatch = false;
          if (selectedCreatorEngagement === 'rising' && engPercent >= 8.0) isMatch = false;
        }
      }
      else if (compareMode === 'guide') {
        if (selectedDifficulty !== 'all' && !item.specs.difficulty.includes(selectedDifficulty)) isMatch = false;
        if (selectedUseCase !== 'all') {
          if (selectedUseCase === 'office' && !item.specs.useCase.includes('Office')) isMatch = false;
          if (selectedUseCase === 'casual' && !item.specs.useCase.includes('Casual')) isMatch = false;
        }
      }
      else if (compareMode === 'ai') {
        if (selectedAIChoice !== 'all') {
          if (selectedAIChoice === 'best-value' && !item.highlightText.toLowerCase().includes('value')) isMatch = false;
          if (selectedAIChoice === 'long-term' && !item.highlightText.toLowerCase().includes('fade')) isMatch = false;
        }
        if (selectedRiskRating !== 'all' && !item.specs.riskRating.toLowerCase().includes(selectedRiskRating)) isMatch = false;
      }

      return {
        ...item,
        matchesCriteria: isMatch
      };
    });
  }, [
    compareMode, items, selectedBudget, selectedAvailability, dealsOnly, 
    officialStoreOnly, selectedBrandSpec, selectedCategory, selectedBrandSegment, selectedBrandCountry,
    selectedCreatorPlatform, selectedCreatorEngagement, selectedDifficulty, selectedUseCase,
    selectedAIChoice, selectedRiskRating
  ]);

    // Best Price highlights (Lowest price is best)
    let minPriceIdx = -1;
    let minPrice = Infinity;
    displayItems.forEach((item, idx) => {
      if (item.price > 0 && item.price < minPrice) {
        minPrice = item.price;
        minPriceIdx = idx;
      }
    });
    if (minPriceIdx !== -1) {
      highlights[displayItems[minPriceIdx].id]['bestPrice'] = 'Best Price';
    }

    // Screen Size highlights (Largest is best)
    let maxScreenIdx = -1;
    let maxScreen = 0;
    displayItems.forEach((item, idx) => {
      const sizeVal = parseFloat(item.specs.screenSize);
      if (!isNaN(sizeVal) && sizeVal > maxScreen) {
        maxScreen = sizeVal;
        maxScreenIdx = idx;
      }
    });
    if (maxScreenIdx !== -1) {
      highlights[displayItems[maxScreenIdx].id]['screenSize'] = 'Largest';
    }

    // Resolution highlights (S24 Ultra sharpest)
    displayItems.forEach(item => {
      if (item.specs.resolution.includes('3120')) {
        highlights[item.id]['resolution'] = 'Sharpest';
      }
    });

    // Performance Score highlights (Highest is best)
    let maxPerfIdx = -1;
    let maxPerf = 0;
    displayItems.forEach((item, idx) => {
      const perfVal = parseInt(item.specs.performanceScore.replace(/,/g, ''));
      if (!isNaN(perfVal) && perfVal > maxPerf) {
        maxPerf = perfVal;
        maxPerfIdx = idx;
      }
    });
    if (maxPerfIdx !== -1) {
      highlights[displayItems[maxPerfIdx].id]['performanceScore'] = 'Best';
    }

    // RAM highlights
    displayItems.forEach(item => {
      if (item.specs.ram.includes('12GB')) {
        highlights[item.id]['ram'] = 'More RAM';
      }
    });

    // Camera highlights (Samsung main camera 200MP is highest)
    displayItems.forEach(item => {
      if (item.specs.mainCamera.includes('200MP')) {
        highlights[item.id]['mainCamera'] = 'Best';
      }
      if (item.specs.ultraWide.includes('48MP')) {
        highlights[item.id]['ultraWide'] = 'Best';
      }
      if (item.specs.videoRecording.includes('8K')) {
        highlights[item.id]['videoRecording'] = 'Highest';
      }
    });

    // Battery Capacity highlights
    displayItems.forEach(item => {
      if (item.specs.batteryCapacity.includes('5,050') || item.specs.batteryCapacity.includes('5,000')) {
        highlights[item.id]['batteryCapacity'] = 'Best';
      }
      if (item.specs.chargingWired.includes('45W')) {
        highlights[item.id]['chargingWired'] = 'Fastest';
      }
      if (item.specs.chargingWireless.includes('23W')) {
        highlights[item.id]['chargingWireless'] = 'Fastest';
      }
    });

    return highlights;
  }, [displayItems]);

  // Remove a product from comparison
  const handleRemoveProduct = (productId: string) => {
    if (setComparedProducts) {
      setComparedProducts((prev: any[]) => prev.filter(p => String(p.id) !== productId));
      toast.success('Removed from comparison');
    }
  };

  // Scroll handler for tracking active section on sticky sidebar
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 350;
      for (const sec of COMPARE_SECTIONS) {
        const el = document.getElementById(`sec-${sec.id}`);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(sec.id);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Filter products for the add modal
  const filteredProductsToAdd = useMemo(() => {
    const term = searchQuery.toLowerCase();
    return allProducts.filter((p: any) => {
      const nameMatch = (p.name || p.title || '').toLowerCase().includes(term);
      const brandMatch = (p.brand || '').toLowerCase().includes(term);
      const isAlreadyAdded = displayItems.some(item => item.id === String(p.id));
      return (nameMatch || brandMatch) && !isAlreadyAdded;
    });
  }, [allProducts, searchQuery, displayItems]);

  const handleAddProduct = (product: any) => {
    if (displayItems.length >= 4) {
      toast.error('Maximum of 4 items can be compared.');
      return;
    }
    if (setComparedProducts) {
      setComparedProducts((prev: any[]) => [...prev, product]);
      toast.success(`${product.name || product.title} added to compare!`);
      setIsAddModalOpen(false);
      setSearchQuery('');
    }
  };

  const productCategoryOptions = useMemo(() => {
    const cats = new Set<string>();
    evaluatedMatchingColumns.forEach((item) => {
      if (item.category) cats.add(String(item.category));
    });
    catalogProducts.forEach((product: any) => {
      const cat = product.category || product.categoryName;
      if (cat) cats.add(String(cat));
    });
    return Array.from(cats).slice(0, 12);
  }, [evaluatedMatchingColumns, catalogProducts]);

  const productWinner = useMemo(() => {
    if (compareMode !== 'product' || evaluatedMatchingColumns.length === 0) return null;
    const matching = evaluatedMatchingColumns.filter((p) => p.matchesCriteria);
    const pool = matching.length > 0 ? matching : evaluatedMatchingColumns;
    return (
      pool.find((p) => p.isWinner) ||
      [...pool].sort((a, b) => (b.rating || 0) - (a.rating || 0))[0] ||
      null
    );
  }, [compareMode, evaluatedMatchingColumns]);

  const productScores = useMemo(() => {
    return evaluatedMatchingColumns.map((p) => {
      const raw =
        typeof p.score === 'number'
          ? p.score
          : Math.min(10, Math.round(((p.rating || 4.5) / 5) * 10 * 10) / 10);
      const score = Math.max(0, Math.min(10, Number(raw) || 0));
      return {
        id: p.id,
        name: p.name,
        image: p.image,
        score,
        pct: Math.round((score / 10) * 100),
      };
    });
  }, [evaluatedMatchingColumns]);

  const winnerSummaryPoints = useMemo(() => {
    if (!productWinner) return [] as string[];
    const points: string[] = [];
    if (productWinner.specs?.rating) points.push(`${productWinner.specs.rating} overall rating`);
    if (productWinner.specs?.build) points.push(`${productWinner.specs.build} build quality`);
    if (productWinner.specs?.durability) points.push(`Durability: ${productWinner.specs.durability}`);
    if (productWinner.specs?.warranty) points.push(`${productWinner.specs.warranty} warranty`);
    if (productWinner.specs?.value) points.push(`${productWinner.specs.value} value`);
    return points.slice(0, 4);
  }, [productWinner]);

  const removeComparedProduct = (id: string) => {
    if (!setComparedProducts) return;
    setComparedProducts((prev: any[]) => prev.filter((prod: any) => String(prod.id) !== String(id)));
  };

  const handleAskEmi = () => {
    toast.success('Ask Emi about this comparison — scroll down for AI help.');
    emiHelpRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const railCardClass = 'bg-white border border-[#E8EDF2] rounded-xl p-[18px]';
  const toggleSwitch = (on: boolean) =>
    cn(
      'relative w-[34px] h-[19px] rounded-[10px] shrink-0 transition-colors cursor-pointer',
      on ? 'bg-[#2323FF]' : 'bg-[#D1D5DB]',
    );

  useRegisterPageFilters(
    {
      pageName: 'Compare',
      renderSearch: null,
      sectionNav: {
        items: compareSectionNavItems,
        activeId: `mode-${compareMode}`,
        onNavigate: handleCompareSectionNavigate,
        allLabel: 'Decision profile',
        allId: 'all',
        profileLabel: 'Compare controls',
      },
      quickFilters: quickFiltersList,
      renderFilters: null, // full filters live in the compare sidebar
      activeFilterCount: activeChips.length,
      onClearAll: handleClearAllFilters,
    },
    [quickFiltersList, activeChips.length, compareMode, compareSectionNavItems],
  );

  const renderSpecMatrix = (opts?: { includeInlineVerdict?: boolean }) => {
    const includeInlineVerdict = opts?.includeInlineVerdict !== false;
    if (compareMode === 'product' && comparedProducts.length === 0) {
      return (
        <div className="bg-white border border-[#E8EDF2] rounded-xl p-12 text-center flex flex-col items-center justify-center min-h-[320px]">
          <div className="w-16 h-16 rounded-full bg-[#F4F7F9] border border-[#E8EDF2] flex items-center justify-center text-[#9AA0AC] mb-6">
            <Layers size={28} />
          </div>
          <h3 className="text-xl font-extrabold text-[#1A1A2E] tracking-tight mb-2">No products to compare</h3>
          <p className="text-[#9AA0AC] text-xs max-w-md mb-8 leading-relaxed">
            Add products to compare by clicking Add to Compare on any product, or use the add slot above.
          </p>
          <button
            type="button"
            onClick={() => setIsProductSearchOpen(true)}
            className="px-8 py-3 bg-[#2323FF] hover:bg-[#1a1acc] text-white text-xs font-bold rounded-lg transition-colors cursor-pointer border-none"
          >
            Add Products
          </button>
        </div>
      );
    }

    return (
      <div className="bg-white rounded-xl border border-[#E8EDF2] overflow-hidden">
        <div className="overflow-x-auto no-scrollbar">
          <div className="min-w-[700px] grid grid-cols-[1.5fr_2.5fr] gap-px bg-[#F4F7F9]">
            <div className="bg-[#FAFAFB] p-6 flex flex-col justify-center">
              <span className="text-[11px] font-bold text-[#9AA0AC] tracking-tight block leading-none mb-1.5">
                {titlePrefix} context
              </span>
              <h3 className="text-lg font-extrabold text-[#1A1A2E] tracking-tight leading-none">Decision matrix</h3>
              <p className="text-[12px] font-medium text-[#9AA0AC] mt-1.5 leading-normal">Side-by-side parameters</p>
            </div>
            <div
              className={cn(
                'bg-white grid divide-x divide-[#F4F7F9]',
                evaluatedMatchingColumns.length === 1 && 'grid-cols-1',
                evaluatedMatchingColumns.length === 2 && 'grid-cols-2',
                evaluatedMatchingColumns.length === 3 && 'grid-cols-3',
                evaluatedMatchingColumns.length >= 4 && 'grid-cols-4',
              )}
            >
              {evaluatedMatchingColumns.map((p) => (
                <div
                  key={p.id}
                  className={cn(
                    'px-4 py-3 flex flex-col items-center justify-center text-center relative transition-all duration-300 min-h-[72px]',
                    p.matchesCriteria
                      ? productWinner?.id === p.id
                        ? 'bg-[#2323FF]/5'
                        : 'bg-white'
                      : 'opacity-35 grayscale',
                  )}
                >
                  {p.matchesCriteria && productWinner?.id === p.id && (
                    <div className="absolute top-1.5 left-1/2 -translate-x-1/2 flex items-center gap-1 bg-[#10B981] text-white text-[7px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded-[3px] whitespace-nowrap">
                      <Trophy size={8} /> Winner
                    </div>
                  )}
                  <span className="text-[10px] font-semibold text-[#9AA0AC] tracking-tight leading-none mt-3">{p.brand}</span>
                  <h4 className="text-[12px] font-bold text-[#1A1A2E] tracking-tight leading-tight line-clamp-2">{p.name}</h4>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="divide-y divide-[#F4F7F9]">
          {sections.map((section) => {
            const visibleMetrics = showDifferencesOnly
              ? section.metrics.filter((metric) => metricValuesDiffer(metric.key))
              : section.metrics;
            if (visibleMetrics.length === 0) return null;

            return (
              <div key={section.title} className="bg-white">
                <button
                  type="button"
                  onClick={() => toggleSection(section.title)}
                  className="w-full px-[18px] py-3.5 flex items-center justify-between group hover:bg-[#FAFAFB] transition-colors border-b border-[#F1F1F3] bg-[#FAFAFB]"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-[#2323FF] shrink-0 text-[17px]">{section.icon}</span>
                    <div className="text-left">
                      <h4 className="text-[12.5px] font-extrabold text-[#1A1A2E] tracking-tight leading-none">
                        {section.title}
                      </h4>
                      <p className="text-[10px] text-[#9AA0AC] mt-0.5">
                        {visibleMetrics.length} comparison points
                      </p>
                    </div>
                  </div>
                  {openSections.includes(section.title) ? (
                    <ChevronUp size={16} className="text-[#9AA0AC]" />
                  ) : (
                    <ChevronDown size={16} className="text-[#9AA0AC]" />
                  )}
                </button>

                <AnimatePresence>
                  {openSections.includes(section.title) && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="divide-y divide-[#F4F7F9] overflow-x-auto no-scrollbar">
                        {visibleMetrics.map((metric, midx) => (
                          <div
                            key={midx}
                            className="min-w-[700px] grid grid-cols-[150px_1fr] gap-3 px-[18px] py-3.5 border-b border-[#F4F7F9] items-start"
                          >
                            <div>
                              <h5 className="text-[11.5px] font-bold text-[#1A1A2E] leading-tight">{metric.label}</h5>
                              {metric.subLabel && (
                                <p className="text-[10px] text-[#9AA0AC] mt-0.5">{metric.subLabel}</p>
                              )}
                            </div>
                            <div
                              className={cn(
                                'grid gap-3',
                                evaluatedMatchingColumns.length === 1 && 'grid-cols-1',
                                evaluatedMatchingColumns.length === 2 && 'grid-cols-2',
                                evaluatedMatchingColumns.length === 3 && 'grid-cols-3',
                                evaluatedMatchingColumns.length >= 4 && 'grid-cols-4',
                              )}
                            >
                              {evaluatedMatchingColumns.map((p, vidx) => {
                                const val = p.specs[metric.key] || 'N/A';
                                return (
                                  <div
                                    key={vidx}
                                    className={cn(
                                      'transition-all duration-300',
                                      p.matchesCriteria ? '' : 'opacity-35 grayscale',
                                    )}
                                  >
                                    {metric.type === 'rating' ? (
                                      <div>
                                        <div className="text-[12.5px] font-bold text-[#1A1A2E]">{val}</div>
                                        <div className="flex items-center gap-0.5 mt-1">
                                          {[1, 2, 3, 4, 5].map((s) => (
                                            <Star key={s} size={8} className="text-[#FFD700] fill-current" />
                                          ))}
                                        </div>
                                      </div>
                                    ) : metric.type === 'score' ? (
                                      <div>
                                        <div className="text-[12.5px] font-bold text-[#1A1A2E]">{val}</div>
                                        <div className="w-full max-w-[100px] h-1 bg-[#F1F1F3] rounded-full overflow-hidden mt-1.5">
                                          <div
                                            className="h-full bg-[#2323FF]"
                                            style={{ width: `${parseInt(val, 10) || 85}%` }}
                                          />
                                        </div>
                                      </div>
                                    ) : metric.type === 'badge' ? (
                                      <span
                                        className={cn(
                                          'inline-block px-2.5 py-1 rounded-md text-[11px] font-bold',
                                          [
                                            'Excellent',
                                            'Legacy Brand',
                                            'Best-Sited',
                                            'Smart Choice',
                                            'Beginner Friendly',
                                            'Verified Official',
                                          ].includes(val)
                                            ? 'bg-green-100 text-green-700'
                                            : 'bg-[#F4F7F9] text-[#4B5563]',
                                        )}
                                      >
                                        {val}
                                      </span>
                                    ) : metric.type === 'tag' ? (
                                      <span className="text-[12px] font-bold text-[#2323FF] underline underline-offset-2">
                                        {val}
                                      </span>
                                    ) : (
                                      <span
                                        className={cn(
                                          'text-[12.5px] font-semibold text-[#1A1A2E]',
                                          metric.highlight && 'font-extrabold text-[#2323FF]',
                                        )}
                                      >
                                        {val}
                                      </span>
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>

        {includeInlineVerdict && (
          <div className="bg-[#FAFAFB] p-6 md:p-8 text-center md:text-left flex flex-col md:flex-row items-center gap-6 md:gap-8 border-t border-[#E8EDF2]">
            <div className="w-12 h-12 rounded-full bg-[#2323FF]/10 flex items-center justify-center text-[#2323FF] shrink-0 border border-[#2323FF]/15">
              <Trophy size={20} />
            </div>
            <div className="flex-1">
              <h3 className="text-base font-extrabold text-[#1A1A2E] tracking-tight leading-none mb-2">
                Discovery Verdict
              </h3>
              <p className="text-[#9AA0AC] text-[11px] font-medium leading-relaxed max-w-xl">
                {compareMode === 'brand' &&
                  'Aarong demonstrates optimal ecosystem authority within Bangladesh metrics. Yellow targets fast adaptation to international fashion lines.'}
                {compareMode === 'creator' &&
                  'Nafis Anjum provides stable tech buyer credibility over extreme viral reaches. Tasnim stands as prime style matching authority.'}
                {compareMode === 'guide' &&
                  'Smart Wardrobe Guidelines covers extensive checklist architectures for professionals. Winter/Summer focuses on micro-seasons.'}
                {compareMode === 'ai' &&
                  'Optimal Value Package matches user search indices perfectly at high durability. Frugal provides zero upfront cash friction.'}
                {compareMode === 'product' &&
                  (productWinner
                    ? `${productWinner.name} secures the top choice based on rating, build, and value signals in this set.`
                    : 'Add products to generate a verdict.')}
              </p>
            </div>
            <div className="w-full md:w-auto bg-white border border-[#E8EDF2] rounded-xl p-4 flex flex-col items-center">
              <span className="text-[8px] font-extrabold text-[#9AA0AC] uppercase tracking-widest mb-1">
                Recommended
              </span>
              <span className="text-base font-extrabold text-[#2323FF] leading-none uppercase">
                {compareMode === 'product' && (productWinner?.name || '—')}
                {compareMode === 'brand' && 'AARONG'}
                {compareMode === 'creator' && 'NAFIS ANJUM'}
                {compareMode === 'guide' && 'SMART BIND'}
                {compareMode === 'ai' && 'OPTIMAL BUNDLE'}
              </span>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="w-full bg-transparent">
      {/* Decision profile sticky nav — all modes */}
      <section className="relative w-full overflow-hidden">
        <div className="relative z-10">
          {compareMode !== 'product' && evaluatedMatchingColumns.length > 0 && (
            <div className="pb-5">
              <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                <span className="text-[10px] font-extrabold uppercase tracking-[0.15em] text-[#9AA0AC]">
                  Matched columns
                </span>
              </div>
              <div
                className={cn(
                  'grid grid-cols-1 gap-3.5',
                  evaluatedMatchingColumns.length === 1 && 'md:grid-cols-1 max-w-md',
                  evaluatedMatchingColumns.length === 2 && 'md:grid-cols-2 max-w-3xl',
                  evaluatedMatchingColumns.length === 3 && 'md:grid-cols-3',
                  evaluatedMatchingColumns.length >= 4 && 'md:grid-cols-4',
                )}
              >
                {evaluatedMatchingColumns.map((p) => (
                  <div key={p.id} className="relative">
                    <div
                      className={cn(
                        'bg-white border rounded-xl p-5 text-left group transition-all duration-300 flex flex-col justify-between h-44 relative overflow-hidden',
                        p.matchesCriteria
                          ? p.isWinner
                            ? 'border-[#FF5B00] shadow-sm'
                            : 'border-[#E8EDF2] hover:border-[#FF5B00]/40'
                          : 'border-[#E8EDF2] opacity-40 grayscale',
                      )}
                    >
                      {p.isWinner && (
                        <div className="absolute -top-1.5 right-4 bg-[#FF5B00] text-white text-[8px] font-extrabold px-3 py-1 rounded-b-[4px] uppercase tracking-widest z-20">
                          AI Winner
                        </div>
                      )}
                      {!p.matchesCriteria && (
                        <div className="absolute top-2 right-2 bg-red-50 text-red-500 text-[8px] font-extrabold px-2 py-0.5 rounded-[3px] uppercase tracking-wider z-20">
                          Filtered Out
                        </div>
                      )}
                      <div className="flex items-center gap-4 mb-4">
                        <div className="w-14 h-14 rounded-lg overflow-hidden bg-[#F4F7F9] border border-[#E8EDF2] p-1 shrink-0 flex items-center justify-center">
                          <img src={p.image} className="w-full h-full object-cover rounded-[3px]" alt={p.name} />
                        </div>
                        <div className="min-w-0">
                          <span className="text-[#FF5B00] text-[8px] font-extrabold uppercase tracking-widest block leading-none mb-1">
                            {p.brand}
                          </span>
                          <h4 className="text-[#1A1A2E] text-xs font-bold line-clamp-2 leading-snug">{p.name}</h4>
                        </div>
                      </div>
                      <div>
                        <div className="w-full h-px bg-[#F4F7F9] my-2" />
                        <p className="text-[#9AA0AC] text-[10px] font-medium leading-none truncate">
                          {p.highlightText || 'Algorithmic assessment matched.'}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <p className="text-xs font-extrabold text-slate-400 group-hover:text-[#FF5B00] uppercase tracking-wider transition-colors">
                ADD PRODUCT
              </p>
            </div>
          )}

          <nav
            aria-label="Compare decision profile"
            className="choosify-sticky-section-nav sticky z-40 w-full bg-white border border-[#E8EDF2] rounded-xl mb-4"
          >
            <div className="px-4 sm:px-5 py-3">
              <div className="flex flex-col gap-2.5 md:flex-row md:items-center md:justify-between min-w-0">
                <div className="flex items-center gap-2 shrink-0 select-none">
                  <span className="text-[10px] font-extrabold uppercase tracking-[0.15em] text-[#9AA0AC] whitespace-nowrap">
                    Decision profile
                  </span>
                  <div className="w-2 h-2 rounded-full bg-[#FF5B00] animate-pulse shrink-0" />
                </div>

                <div className="relative min-w-0 w-full md:w-auto md:max-w-full">
                  <div
                    className="pointer-events-none absolute inset-y-0 left-0 w-5 bg-gradient-to-r from-white to-transparent z-10 md:hidden"
                    aria-hidden
                  />
                  <div
                    className="pointer-events-none absolute inset-y-0 right-0 w-5 bg-gradient-to-l from-white to-transparent z-10 md:hidden"
                    aria-hidden
                  />
                  <div
                    ref={stickyNavTrackRef}
                    {...stickyNavTrackProps}
                    onTouchStart={() => {
                      userNavScrollUntilRef.current = Date.now() + 1500;
                    }}
                    className="choosify-sticky-nav-track flex items-center gap-2 min-w-0 w-full md:w-auto"
                  >
                    {compareModeOptions.map((modeOpt) => {
                      const isActive = compareMode === modeOpt.id;
                      return (
                        <button
                          key={modeOpt.id}
                          type="button"
                          onClick={() => {
                            setCompareMode(modeOpt.id);
                            triggerSoftLoading();
                          }}
                          className={cn(STICKY_PILL_BASE, isActive ? STICKY_PILL_ACTIVE : STICKY_PILL_INACTIVE)}
                        >
                          {modeOpt.icon}
                          <span>{modeOpt.label}</span>
                        </button>
                      );
                    })}

                    {quickFiltersList.length > 0 && (
                      <>
                        <div className="w-px h-6 bg-[#E8EDF2] shrink-0 mx-0.5" aria-hidden />
                        {quickFiltersList.map((filter) => (
                          <button
                            key={filter.id}
                            type="button"
                            onClick={filter.onClick}
                            className={cn(STICKY_PILL_BASE, filter.active ? STICKY_PILL_ACTIVE : STICKY_PILL_INACTIVE)}
                          >
                            <span>{filter.label}</span>
                          </button>
                        ))}
                      </>
                    )}

                    <div className="w-px h-6 bg-[#E8EDF2] shrink-0 mx-0.5" aria-hidden />
                    <button
                      type="button"
                      onClick={() => setShowDifferencesOnly((v) => !v)}
                      className={cn(STICKY_PILL_BASE, showDifferencesOnly ? STICKY_PILL_ACTIVE : STICKY_PILL_INACTIVE)}
                    >
                      <Scale size={13} />
                      <span>Differences only</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Dynamic BDT Price Display */}
              <div className="mt-auto pt-2 border-t border-slate-50">
                <p className="text-base font-extrabold text-[#FF5B00]">
                  BDT {item.price > 0 ? item.price.toLocaleString() : 'N/A'}
                </p>
              </div>
            </div>
          ))}

      {compareMode === 'product' ? (
        <>
          <div className="grid grid-cols-1 xl:grid-cols-[260px_minmax(0,1fr)_260px] gap-5 items-start">
            {/* LEFT RAIL */}
            <aside className="flex flex-col gap-4 xl:sticky xl:top-28">
              <div className={railCardClass}>
                <div className="text-xs font-extrabold text-[#1A1A2E] tracking-[0.03em] mb-0.5">YOUR COMPARISON</div>
                <div className="text-[11px] text-[#9AA0AC] mb-3.5">
                  {comparedProducts.length} / 4 products
                </div>
                <div className="flex flex-col gap-3 mb-3.5">
                  {evaluatedMatchingColumns.map((p) => (
                    <div key={p.id} className="flex items-center gap-2.5">
                      <div className="w-10 h-10 rounded-lg overflow-hidden shrink-0 bg-[#F4F7F9]">
                        <img src={p.image} alt="" className="w-full h-full object-cover" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="text-xs font-bold text-[#1A1A2E] truncate">{p.name}</div>
                        <div className="text-[10.5px] text-[#9AA0AC]">{p.brand}</div>
                      </div>
                      {setComparedProducts && (
                        <button
                          type="button"
                          onClick={() => removeComparedProduct(p.id)}
                          className="text-sm text-[#9AA0AC] hover:text-[#FF000D] shrink-0 cursor-pointer bg-transparent border-none p-0"
                          aria-label={`Remove ${p.name}`}
                        >
                          ✕
                        </button>
                      )}
                    </div>
                  ))}
                  {evaluatedMatchingColumns.length === 0 && (
                    <p className="text-[11px] text-[#9AA0AC]">No products selected yet.</p>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => setIsProductSearchOpen(true)}
                  disabled={comparedProducts.length >= 4}
                  className="w-full bg-[#F4F7F9] border border-dashed border-[#D1D5DB] text-[#4B5563] py-2.5 rounded-lg text-[11.5px] font-bold cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  + Add Another Product
                </button>
              </div>

              <div className={railCardClass}>
                <div className="text-xs font-extrabold text-[#1A1A2E] tracking-[0.03em] mb-4">QUICK FILTERS</div>
                {productCategoryOptions.length > 0 && (
                  <>
                    <div className="text-[11px] font-bold text-[#4B5563] mb-1.5">Category</div>
                    <select
                      value={selectedCategory}
                      onChange={(e) => {
                        setSelectedCategory(e.target.value);
                        triggerSoftLoading();
                      }}
                      className="w-full border border-[#E5E7EB] rounded-md px-2.5 py-2 text-xs text-[#1A1A2E] mb-4 bg-white"
                    >
                      <option value="all">All categories</option>
                      {productCategoryOptions.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </>
                )}

                <div className="text-[11px] font-bold text-[#4B5563] mb-2.5">Price Range</div>
                <input
                  type="range"
                  min={1500}
                  max={5000}
                  step={100}
                  value={selectedBudget}
                  onChange={(e) => {
                    setSelectedBudget(Number(e.target.value));
                    triggerSoftLoading();
                  }}
                  className="w-full accent-[#2323FF] cursor-pointer mb-2"
                />
                <div className="flex justify-between text-[10.5px] text-[#9AA0AC] mb-5">
                  <span>৳ 1,500</span>
                  <span>৳ {selectedBudget.toLocaleString()}+</span>
                </div>

                {[
                  {
                    label: 'Show differences only',
                    on: showDifferencesOnly,
                    toggle: () => setShowDifferencesOnly((v) => !v),
                  },
                  {
                    label: 'Has live promo deal',
                    on: dealsOnly,
                    toggle: () => {
                      setDealsOnly(!dealsOnly);
                      triggerSoftLoading();
                    },
                  },
                  {
                    label: 'Official store only',
                    on: officialStoreOnly,
                    toggle: () => {
                      setOfficialStoreOnly(!officialStoreOnly);
                      triggerSoftLoading();
                    },
                  },
                ].map((tg) => (
                  <div key={tg.label} className="flex justify-between items-center mb-3.5">
                    <div className="text-[11.5px] font-semibold text-[#1A1A2E]">{tg.label}</div>
                    <button
                      type="button"
                      role="switch"
                      aria-checked={tg.on}
                      onClick={tg.toggle}
                      className={toggleSwitch(tg.on)}
                    >
                      <span
                        className={cn(
                          'absolute top-0.5 w-[15px] h-[15px] rounded-full bg-white transition-all',
                          tg.on ? 'right-0.5' : 'left-0.5',
                        )}
                      />
                    </button>
                  </div>
                ))}
              </div>
            </aside>

            {/* CENTER */}
            <div className="min-w-0 relative">
              {isLoading && (
                <div className="absolute inset-0 bg-white/70 z-50 flex items-center justify-center rounded-xl min-h-[200px]">
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-8 h-8 rounded-full border-2 border-[#2323FF] border-t-transparent animate-spin" />
                    <span className="text-[13px] font-semibold text-[#1A1A2E]">Recalculating…</span>
                  </div>
                </div>
              )}

              <div
                className={cn(
                  'grid grid-cols-1 sm:grid-cols-2 gap-3.5 mb-6',
                  comparedProducts.length + heroProductSlots >= 3 && 'lg:grid-cols-3',
                  comparedProducts.length + heroProductSlots >= 4 && 'xl:grid-cols-4',
                )}
              >
                {evaluatedMatchingColumns.map((p) => (
                  <div
                    key={p.id}
                    className={cn(
                      'bg-white rounded-xl border border-[#E8EDF2] p-4 relative',
                      !p.matchesCriteria && 'opacity-40 grayscale',
                    )}
                  >
                    <div className="flex justify-between items-start mb-2.5">
                      <span
                        className={cn(
                          'text-[10px] font-extrabold px-2.5 py-1 rounded-full',
                          productWinner?.id === p.id
                            ? 'bg-[#EEF0FF] text-[#2323FF]'
                            : 'bg-[#F4F7F9] text-[#4B5563]',
                        )}
                      >
                        {productWinner?.id === p.id ? '🏆 Best pick' : p.tag || 'Compared'}
                      </span>
                      {setComparedProducts && (
                        <button
                          type="button"
                          onClick={() => removeComparedProduct(p.id)}
                          className="text-sm text-[#9AA0AC] hover:text-[#FF000D] cursor-pointer bg-transparent border-none p-0"
                          aria-label={`Remove ${p.name}`}
                        >
                          ✕
                        </button>
                      )}
                    </div>
                    <div className="h-[150px] mb-3 rounded-lg overflow-hidden bg-[#F4F7F9]">
                      <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="text-[14.5px] font-extrabold text-[#1A1A2E] mb-0.5 line-clamp-2">{p.name}</div>
                    <div className="text-[11.5px] text-[#9AA0AC] mb-2.5">{p.brand}</div>
                    <div className="flex items-center gap-2 mb-3.5">
                      <div className="text-base font-extrabold text-[#2323FF]">
                        ৳ {(p.price || 0).toLocaleString()}
                      </div>
                      {p.specs?.officialStore === 'Yes' && (
                        <span className="text-[9.5px] font-bold text-[#4B5563] bg-[#F4F7F9] px-1.5 py-0.5 rounded">
                          Official Store
                        </span>
                      )}
                    </div>
                    <Link
                      to={`/products/${p.id}`}
                      className="block w-full text-center bg-[#2323FF] hover:bg-[#1a1acc] text-white py-2.5 rounded-lg text-xs font-bold no-underline"
                    >
                      View on Store
                    </Link>
                  </div>
                ))}
                {heroProductSlots > 0 && (
                  <button
                    type="button"
                    onClick={() => setIsProductSearchOpen(true)}
                    className="border-[1.5px] border-dashed border-[#D1D5DB] rounded-xl flex flex-col items-center justify-center gap-3 p-4 min-h-[290px] cursor-pointer bg-transparent hover:border-[#2323FF]/40 transition-colors"
                  >
                    <div className="w-[54px] h-[54px] rounded-full border-[1.5px] border-dashed border-[#D1D5DB] flex items-center justify-center text-[22px] text-[#9AA0AC]">
                      +
                    </div>
                    <div className="text-[13px] font-bold text-[#1A1A2E] text-center">Add Another Product</div>
                    <div className="text-[10.5px] text-[#9AA0AC] text-center">Compare up to 4 products</div>
                  </button>
                )}
              </div>

              {renderSpecMatrix({ includeInlineVerdict: false })}
            </div>

            {/* RIGHT RAIL */}
            <aside className="flex flex-col gap-4 xl:sticky xl:top-28">
              <div className={railCardClass}>
                <div className="text-[22px] mb-1.5">🏆</div>
                <div className="text-[11px] font-extrabold text-[#9AA0AC] tracking-[0.03em] mb-1">
                  COMPARISON SUMMARY
                </div>
                {productWinner ? (
                  <>
                    <div className="text-[15px] font-extrabold text-[#2323FF] mb-1">{productWinner.name}</div>
                    <div className="text-[11.5px] text-[#9AA0AC] mb-3.5">is the best overall choice</div>
                    <div className="flex flex-col gap-2 mb-4">
                      {winnerSummaryPoints.map((sp) => (
                        <div key={sp} className="text-[11.5px] text-[#1A1A2E] flex items-center gap-1.5">
                          <span className="text-[#07DD05]">✓</span>
                          {sp}
                        </div>
                      ))}
                    </div>
                    <Link
                      to={`/products/${productWinner.id}`}
                      className="block w-full text-center bg-[#2323FF] hover:bg-[#1a1acc] text-white py-2.5 rounded-lg text-xs font-bold no-underline"
                    >
                      View Full Review
                    </Link>
                  </>
                ) : (
                  <p className="text-[11.5px] text-[#9AA0AC]">Add products to see a summary.</p>
                )}
              </div>

              <div className={railCardClass}>
                <div className="text-[11px] font-extrabold text-[#1A1A2E] tracking-[0.03em] mb-0.5">
                  SCORE OVERVIEW
                </div>
                <div className="text-[10.5px] text-[#9AA0AC] mb-4">Our expert rating</div>
                <div className="flex flex-col gap-3.5">
                  {productScores.length > 0 ? (
                    productScores.map((sc) => (
                      <div key={sc.id}>
                        <div className="flex items-center gap-2 mb-1.5">
                          <div className="w-[22px] h-[22px] rounded-md overflow-hidden shrink-0 bg-[#F4F7F9]">
                            <img src={sc.image} alt="" className="w-full h-full object-cover" />
                          </div>
                          <div className="text-[11.5px] font-bold text-[#1A1A2E] flex-1 truncate">{sc.name}</div>
                          <div className="text-[11px] font-extrabold text-[#1A1A2E]">
                            {sc.score}
                            <span className="font-semibold text-[#9AA0AC]">/10</span>
                          </div>
                        </div>
                        <div className="h-[5px] rounded-[3px] bg-[#F1F1F3]">
                          <div
                            className="h-full rounded-[3px] bg-[#2323FF]"
                            style={{ width: `${sc.pct}%` }}
                          />
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-[11px] text-[#9AA0AC]">Scores appear once products are added.</p>
                  )}
                </div>
              </div>

              <div className={railCardClass}>
                <div className="text-xs font-extrabold text-[#1A1A2E] mb-0.5">NEED HELP DECIDING?</div>
                <div className="text-[11px] text-[#9AA0AC] mb-3.5">Let our AI assistant help you</div>
                <button
                  type="button"
                  onClick={handleAskEmi}
                  className="w-full bg-[#000435] hover:bg-[#0a0a5c] text-white py-2.5 rounded-lg text-xs font-bold cursor-pointer border-none flex items-center justify-center gap-2"
                >
                  <span className="w-5 h-5 rounded-full bg-white flex items-center justify-center overflow-hidden p-px">
                    <EmiAiLogo size={16} className="w-4 h-4" />
                  </span>
                  Ask Emi AI
                </button>
              </div>
            </aside>
          </div>

          {/* Full-width bands below grid */}
          <div className="bg-white rounded-xl border border-[#E8EDF2] px-6 py-[22px] mt-6">
            <div className="flex items-center gap-2.5 mb-1">
              <span className="text-lg">🎬</span>
              <div className="text-sm font-extrabold text-[#1A1A2E]">Influencer reviews</div>
            </div>
            <div className="text-[11.5px] text-[#9AA0AC] mb-5">
              Creator ratings that inform the influencer score
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
              {[
                {
                  name: 'Sabbir Ahmed',
                  role: 'Verified Buyer',
                  quote: 'The materials here hold unique premium density. Highly recommended long-term staple.',
                  avatar: 'https://i.pravatar.cc/150?u=sabbir',
                },
                {
                  name: 'Runa Laila',
                  role: 'Premium Critic',
                  quote: 'Stitching alignment is extremely responsive. Matches precise capsule styling charts.',
                  avatar: 'https://i.pravatar.cc/150?u=runa',
                },
                {
                  name: 'Anisul Hoque',
                  role: 'Comfort Enthusiast',
                  quote: 'Outstanding value-for-money parameter alignment. Bypasses premium markup entirely.',
                  avatar: 'https://i.pravatar.cc/150?u=anis',
                },
              ].map((verdict) => (
                <div key={verdict.name} className="border border-[#E8EDF2] rounded-[10px] p-4">
                  <div className="flex items-center gap-2.5 mb-2.5">
                    <div className="w-[34px] h-[34px] rounded-full overflow-hidden bg-[#F4F7F9] shrink-0">
                      <img src={verdict.avatar} alt="" className="w-full h-full object-cover" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-xs font-bold text-[#1A1A2E]">{verdict.name}</div>
                      <div className="text-[10px] text-[#9AA0AC]">{verdict.role}</div>
                    </div>
                  </div>
                  <p className="text-[11.5px] text-[#4B5563] leading-relaxed m-0 italic">"{verdict.quote}"</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-[#000435] rounded-xl px-7 py-6 mt-4 text-white flex flex-wrap justify-between items-center gap-6">
            <div className="flex-1 min-w-[280px]">
              <div className="text-[13px] font-extrabold mb-2">Choosify Verdict</div>
              <p className="text-xs text-white/70 leading-relaxed m-0">
                {productWinner
                  ? `${productWinner.name} leads this comparison on overall rating and build signals. Cross-check price and availability before you buy.`
                  : 'Add at least two products to generate a Choosify verdict.'}
              </p>
            </div>
            {productWinner && (
              <div className="bg-white/10 rounded-[10px] px-5 py-4 flex items-center gap-3.5 shrink-0">
                <div className="w-12 h-12 rounded-[10px] bg-white/10 flex items-center justify-center overflow-hidden">
                  <img src={productWinner.image} alt="" className="w-full h-full object-cover" />
                </div>
                <div>
                  <div className="text-[9.5px] font-extrabold text-[#FF5B00] tracking-[0.05em] mb-0.5">
                    BEST OVERALL
                  </div>
                  <div className="text-[9.5px] font-bold text-white/60">{productWinner.brand}</div>
                  <div className="text-[13px] font-extrabold mb-1.5">{productWinner.name}</div>
                  <Link to={`/products/${productWinner.id}`} className="text-[11px] font-bold text-[#FF9E5C] no-underline">
                    View product →
                  </Link>
                </div>
              </div>
            )}
          </div>

          <div ref={emiHelpRef} className="mt-4">
            <EmiComparePanel
              compareLabels={(comparedProducts || []).map((p: { title?: string; name?: string }) => p.title ?? p.name ?? 'Product')}
              compareMode={compareMode}
            />
          </div>

          <SponsoredCompareRail />
        </>
      ) : (
        <>
      {/* ACTIVE INTELLIGENT FILTER CHIPS */}
      <ActiveFilterChips
        chips={activeChips}
        onClearAll={handleClearAllFilters}
      />

      {/* CORE THREE-COLUMN PERFORMANCE LAYOUT */}
      <div className={`w-full py-2 ${PAGE_LISTING_SINGLE_SHELL}`}>
         
         {/* LEFT COLUMN: SYSTEM ADVANCED DECISION PANEL */}
         <aside className="lg:sticky lg:top-36 bg-transparent h-auto pb-10 flex flex-col gap-4">
           <FullSidebarFilterPanel
             title="Compare Scopes"
             onReset={handleClearAllFilters}
             advancedSection={
               <div className="flex flex-col gap-3">
                 <div className="bg-white border border-[#E8EDF2] rounded-xl p-4 text-left font-sans">
                   <h4 className="text-[10px] font-extrabold text-[#8a9bb0] uppercase tracking-wider pb-1.5 border-b border-[#e8edf2] mb-3">AI Decision Matrix Rules</h4>
                   <p className="text-[10.5px] text-gray-500 font-medium leading-relaxed">
                     This sidebar directly tweaks constraints inside our matrix calculator. Dimmed columns fail to meet your custom threshold weights.
                   </p>
                 </div>
               </div>
             }
           >
             {/* CONDITIONAL SIDEBAR OPTIONS BASED ON THE ACTIVE DECISION MODE */}
             {compareMode === 'brand' && (
               <div className="flex flex-col gap-4">
                 {/* BRAND SEGMENT */}
                 <div className="bg-white border border-[#E8EDF2] rounded-xl p-4.5 shadow-sm text-left font-sans">
                   <h3 className="text-[11px] font-semibold text-[#8a9bb0] uppercase tracking-wider pb-2 border-b border-[#e8edf2] mb-3">Reputation Tier</h3>
                   <div className="space-y-1">
                     {[
                       { value: 'all', label: 'All Segments' },
                       { value: 'legacy', label: 'Legacy Heritage Brands' },
                       { value: 'global', label: 'Global Sourced Aesthetics' }
                     ].map((opt) => (
                       <button
                         key={opt.value}
                         type="button"
                         onClick={() => { setSelectedBrandSegment(opt.value); triggerSoftLoading(); }}
                         className={cn(
                           "w-full flex items-center justify-between text-left px-2 py-1.5 rounded-[4px] transition-colors text-xs font-semibold cursor-pointer",
                           selectedBrandSegment === opt.value ? "bg-[#FFF0E8] text-orange-primary font-bold" : "text-gray-500 hover:bg-gray-50 hover:text-[#1A1D4E]"
                         )}
                       >
                         <span>{opt.label}</span>
                         {selectedBrandSegment === opt.value && <CheckCircle2 size={11} className="text-orange-primary mt-0.5" />}
                       </button>
                     ))}
                   </div>
                 </div>

                 {/* BRAND COUNTRY REGENCY */}
                 <div className="bg-white border border-[#E8EDF2] rounded-xl p-4.5 shadow-sm text-left font-sans">
                   <h3 className="text-[11px] font-semibold text-[#8a9bb0] uppercase tracking-wider pb-2 border-b border-[#e8edf2] mb-3">Country of Operation</h3>
                   <div className="space-y-1">
                     {[
                       { value: 'all', label: 'All Territories' },
                       { value: 'local', label: 'Domestic Exclusive (BD)' }
                     ].map((opt) => (
                       <button
                         key={opt.value}
                         type="button"
                         onClick={() => { setSelectedBrandCountry(opt.value); triggerSoftLoading(); }}
                         className={cn(
                           "w-full flex items-center justify-between text-left px-2 py-1.5 rounded-[4px] transition-colors text-xs font-semibold cursor-pointer",
                           selectedBrandCountry === opt.value ? "bg-[#FFF0E8] text-orange-primary font-bold" : "text-gray-500 hover:bg-gray-50 hover:text-[#1A1D4E]"
                         )}
                       >
                         <span>{opt.label}</span>
                         {selectedBrandCountry === opt.value && <CheckCircle2 size={11} className="text-orange-primary mt-0.5" />}
                       </button>
                     ))}
                   </div>
                 </div>
               </div>
             )}

             {compareMode === 'creator' && (
               <div className="flex flex-col gap-4">
                 {/* CREATOR PLATFORM */}
                 <div className="bg-white border border-[#E8EDF2] rounded-xl p-4.5 shadow-sm text-left font-sans">
                   <h3 className="text-[11px] font-semibold text-[#8a9bb0] uppercase tracking-wider pb-2 border-b border-[#e8edf2] mb-3">Platform Focus</h3>
                   <div className="space-y-1">
                     {['all', 'YouTube', 'Instagram', 'Facebook'].map((plat) => (
                       <button
                         key={plat}
                         type="button"
                         onClick={() => { setSelectedCreatorPlatform(plat); triggerSoftLoading(); }}
                         className={cn(
                           "w-full flex items-center justify-between text-left px-2 py-1.5 rounded-[4px] transition-colors text-xs font-semibold cursor-pointer",
                           selectedCreatorPlatform === plat ? "bg-[#FFF0E8] text-orange-primary font-bold" : "text-gray-500 hover:bg-gray-50 hover:text-[#1A1D4E]"
                         )}
                       >
                         <span>{plat === 'all' ? 'All Channels' : plat}</span>
                         {selectedCreatorPlatform === plat && <CheckCircle2 size={11} className="text-orange-primary" />}
                       </button>
                     ))}
                   </div>
                 </div>

                 {/* ENGAGEMENT WEIGHT */}
                 <div className="bg-white border border-[#E8EDF2] rounded-xl p-4.5 shadow-sm text-left font-sans">
                   <h3 className="text-[11px] font-semibold text-[#8a9bb0] uppercase tracking-wider pb-2 border-b border-[#e8edf2] mb-3">Engagement Threshold</h3>
                   <div className="space-y-1">
                     {[
                       { value: 'all', label: 'Standard Feed' },
                       { value: 'high', label: 'Premium Class (> 8.0%)' },
                       { value: 'rising', label: 'Broad Audience (< 8.0%)' }
                     ].map((opt) => (
                       <button
                         key={opt.value}
                         type="button"
                         onClick={() => { setSelectedCreatorEngagement(opt.value); triggerSoftLoading(); }}
                         className={cn(
                           "w-full flex items-center justify-between text-left px-2 py-1.5 rounded-[4px] transition-colors text-xs font-semibold cursor-pointer",
                           selectedCreatorEngagement === opt.value ? "bg-[#FFF0E8] text-orange-primary font-bold" : "text-gray-500 hover:bg-gray-50 hover:text-[#1A1D4E]"
                         )}
                       >
                         <span>{opt.label}</span>
                         {selectedCreatorEngagement === opt.value && <CheckCircle2 size={11} className="text-orange-primary mt-0.5" />}
                       </button>
                     ))}
                   </div>
                 </div>
               </div>
             )}

             {compareMode === 'guide' && (
               <div className="flex flex-col gap-4">
                 {/* DIFFICULTY */}
                 <div className="bg-white border border-[#E8EDF2] rounded-xl p-4.5 shadow-sm text-left font-sans">
                   <h3 className="text-[11px] font-semibold text-[#8a9bb0] uppercase tracking-wider pb-2 border-b border-[#e8edf2] mb-3">Difficulty Tier</h3>
                   <div className="space-y-1">
                     {['all', 'Beginner Friendly', 'Advanced Collector'].map((diff) => (
                       <button
                         key={diff}
                         type="button"
                         onClick={() => { setSelectedDifficulty(diff); triggerSoftLoading(); }}
                         className={cn(
                           "w-full flex items-center justify-between text-left px-2 py-1.5 rounded-[4px] transition-colors text-xs font-semibold cursor-pointer",
                           selectedDifficulty === diff ? "bg-[#FFF0E8] text-orange-primary font-bold" : "text-gray-500 hover:bg-gray-50 hover:text-[#1A1D4E]"
                         )}
                       >
                         <span>{diff === 'all' ? 'All Classes' : diff}</span>
                         {selectedDifficulty === diff && <CheckCircle2 size={11} className="text-orange-primary" />}
                       </button>
                     ))}
                   </div>
                 </div>

                 {/* USE CASE */}
                 <div className="bg-white border border-[#E8EDF2] rounded-xl p-4.5 shadow-sm text-left font-sans">
                   <h3 className="text-[11px] font-semibold text-[#8a9bb0] uppercase tracking-wider pb-2 border-b border-[#e8edf2] mb-3">Primary Use-Case</h3>
                   <div className="space-y-1">
                     {[
                       { value: 'all', label: 'All Use Cases' },
                       { value: 'office', label: 'Professional/Office' },
                       { value: 'casual', label: 'Festive/Traditional' }
                     ].map((opt) => (
                       <button
                         key={opt.value}
                         type="button"
                         onClick={() => { setSelectedUseCase(opt.value); triggerSoftLoading(); }}
                         className={cn(
                           "w-full flex items-center justify-between text-left px-2 py-1.5 rounded-[4px] transition-colors text-xs font-semibold cursor-pointer",
                           selectedUseCase === opt.value ? "bg-[#FFF0E8] text-orange-primary font-bold" : "text-gray-500 hover:bg-gray-50 hover:text-[#1A1D4E]"
                         )}
                       >
                         <span>{opt.label}</span>
                         {selectedUseCase === opt.value && <CheckCircle2 size={11} className="text-orange-primary mt-0.5" />}
                       </button>
                     ))}
                   </div>
                 </div>
               </div>
             )}

             {compareMode === 'ai' && (
               <div className="flex flex-col gap-4">
                 {/* AI SELECTION MODEL */}
                 <div className="bg-white border border-[#E8EDF2] rounded-xl p-4.5 shadow-sm text-left font-sans">
                   <h3 className="text-[11px] font-semibold text-[#8a9bb0] uppercase tracking-wider pb-2 border-b border-[#e8edf2] mb-3">Best-Suited Target</h3>
                   <div className="space-y-1">
                     {[
                       { value: 'all', label: 'Total Consensus' },
                       { value: 'best-value', label: 'Optimal Pricing Mix' },
                       { value: 'long-term', label: 'Fade Resistance Choice' }
                     ].map((opt) => (
                       <button
                         key={opt.value}
                         type="button"
                         onClick={() => { setSelectedAIChoice(opt.value); triggerSoftLoading(); }}
                         className={cn(
                           "w-full flex items-center justify-between text-left px-2 py-1.5 rounded-[4px] transition-colors text-xs font-semibold cursor-pointer",
                           selectedAIChoice === opt.value ? "bg-[#FFF0E8] text-orange-primary font-bold" : "text-gray-500 hover:bg-gray-50 hover:text-[#1A1D4E]"
                         )}
                       >
                         <span>{opt.label}</span>
                         {selectedAIChoice === opt.value && <CheckCircle2 size={11} className="text-orange-primary mt-0.5" />}
                       </button>
                     ))}
                   </div>
                 </div>

                 {/* RISK RATING */}
                 <div className="bg-white border border-[#E8EDF2] rounded-xl p-4.5 shadow-sm text-left font-sans">
                   <h3 className="text-[11px] font-semibold text-[#8a9bb0] uppercase tracking-wider pb-2 border-b border-[#e8edf2] mb-3">Calculated Risk Scope</h3>
                   <div className="space-y-1">
                     {[
                       { value: 'all', label: 'Show Overall Scores' },
                       { value: 'low', label: 'Strictly Lower Risk' }
                     ].map((opt) => (
                       <button
                         key={opt.value}
                         type="button"
                         onClick={() => { setSelectedRiskRating(opt.value); triggerSoftLoading(); }}
                         className={cn(
                           "w-full flex items-center justify-between text-left px-2 py-1.5 rounded-[4px] transition-colors text-xs font-semibold cursor-pointer",
                           selectedRiskRating === opt.value ? "bg-[#FFF0E8] text-orange-primary font-bold" : "text-gray-500 hover:bg-gray-50 hover:text-[#1A1D4E]"
                         )}
                       >
                         <span>{opt.label}</span>
                         {selectedRiskRating === opt.value && <CheckCircle2 size={11} className="text-orange-primary mt-0.5" />}
                       </button>
                     ))}
                   </div>
                 </div>
               </div>
             )}
           </FullSidebarFilterPanel>
         </aside>

         {/* MIDDLE COLUMN: COMPARATIVE CORE */}
         <div className="choosify-middle-feed space-y-6 relative min-w-0">
            {isLoading && (
              <div className="absolute inset-0 bg-white/70 backdrop-blur-[1px] z-50 flex items-center justify-center rounded-xl h-96">
                <div className="flex flex-col items-center gap-2">
                  <div className="w-8 h-8 rounded-full border-2 border-orange-primary border-t-transparent animate-spin" />
                  <span className="text-[13px] font-semibold text-[#1A1A2E] tracking-tight">Recalculating…</span>
                </div>
              </div>
            )}
            {renderSpecMatrix()}
         </div>

         {/* RIGHT COLUMN: DECISION INSIGHTS / AI ADVISOR */}
         <aside className="lg:sticky lg:top-36 flex flex-col gap-4">
            <EmiComparePanel
              compareLabels={(comparedProducts || []).map((p: { title?: string }) => p.title ?? 'Product')}
              compareMode={compareMode}
            />
            
            {/* 1. DECISION COGNITIVE ASSISTANT CARD */}
            <div className="bg-white rounded-xl border border-[#E8EDF2] p-5 text-left relative overflow-hidden">
              <div className="absolute top-0 right-0 p-3 text-[#FF5B00] opacity-25">
                <Sparkles size={18} />
              </div>
            ))}

               <div className="flex items-center gap-2 mb-3">
                  <Activity size={14} className="text-[#FF5B00]" />
                  <span className="text-[9.5px] font-extrabold text-[#FF5B00] uppercase tracking-widest">AI Tradeoff Engine</span>
               </div>
               
               <h4 className="text-xs font-extrabold text-[#1A1A2E] tracking-tight leading-snug mb-3">
                  {compareMode === 'brand' && 'Aarong vs Yellow Positioning'}
                  {compareMode === 'creator' && 'Nafis vs Tasnim Target Match'}
                  {compareMode === 'guide' && 'Capsule vs Traditional Use Cases'}
                  {compareMode === 'ai' && 'Value vs Longevity Cost Matrix'}
               </h4>

               <div className="space-y-3.5 text-[11px] text-[#4B5563] font-medium leading-relaxed font-sans">
                  {compareMode === 'brand' && (
                    <>
                      <div className="p-3 bg-[#F4F7F9] rounded-lg border border-[#E8EDF2]">
                        <span className="text-[#FF5B00] font-bold block mb-1">Trust index priority alignment:</span>
                        Aarong holds standard elite legacy prestige. Yellow covers rapid trend updates. Target Aarong for handloom authenticity, Yellow for formal contemporary models.
                      </div>
                    </>
                  )}

                  {compareMode === 'creator' && (
                    <>
                      <div className="p-3 bg-[#F4F7F9] rounded-lg border border-[#E8EDF2]">
                        <span className="text-[#FF5B00] font-bold block mb-1">Engagement vs Reach Ledger:</span>
                        Nafis holds stronger conversion indices on hardware specs, while Tasnim provides premier aesthetic context-matching options.
                      </div>
                    </>
                  )}

                  {compareMode === 'guide' && (
                    <>
                      <div className="p-3 bg-[#F4F7F9] rounded-lg border border-[#E8EDF2]">
                        <span className="text-[#FF5B00] font-bold block mb-1">Capsule Integration:</span>
                        Capsule guidelines save estimated ৳15k yearly on impulse buys by enforcing matching outfit formulas.
                      </div>
                    </>
                  )}

                  {compareMode === 'ai' && (
                    <>
                      <div className="p-3 bg-[#F4F7F9] rounded-lg border border-[#E8EDF2]">
                        <span className="text-[#FF5B00] font-bold block mb-1">Risk Optimization Ledger:</span>
                        Optimal value package optimizes upfront cost amortized over 12 months. Excellent low risk rating.
                      </div>
                    </>
                  )}
               </div>
            </div>

            {/* 2. SAVED COMPARISONS LOGS */}
            <div className="bg-white border border-[#E8EDF2] rounded-xl p-4.5 shadow-sm text-left">
              <div className="flex items-center justify-between pb-3 border-b border-[#e8edf2] mb-3">
                 <h4 className="text-[10px] font-black text-[#8a9bb0] uppercase tracking-wider">Related Decisions</h4>
                 <span className="text-[9px] font-bold text-orange-primary py-0.5 px-2 bg-orange-primary/15 rounded-full uppercase scale-95">3 Saved</span>
              </div>

              <div className="space-y-2.5">
                 {[
                   { label: 'Semi-Formal Cottons', date: 'Yesterday', count: '3 models' },
                   { label: 'Elite Traditional Brands', date: '3 days ago', count: '4 brands' },
                   { label: 'Daraz Delivery vs Outlets', date: 'Last week', count: '2 targets' }
                 ].map((comp, idx) => (
                    <div key={idx} className="flex justify-between items-center bg-gray-50/50 hover:bg-gray-50 p-2.5 rounded-[4px] border border-[#e8edf2]/60 cursor-pointer transition-colors group">
                       <div>
                          <span className="text-[13px] font-bold text-[#1A1A2E] tracking-tight group-hover:text-[#FF5B00] transition-colors block leading-tight">{comp.label}</span>
                          <span className="text-[11px] font-medium text-[#9AA0AC] mt-0.5 block">{comp.date}</span>
                       </div>
                       <span className="px-2 py-0.5 bg-[#D6E1EC]/30 text-navy/70 text-[8.5px] font-black rounded-full leading-none">{comp.count}</span>
                    </div>
                 ))}
              </div>
            </div>

            {/* 3. SHARE LINK GENERATION */}
            <div className="bg-white border border-[#E8EDF2] rounded-xl p-4.5 shadow-sm text-left font-sans">
               <h4 className="text-[10px] font-extrabold text-[#8a9bb0] uppercase tracking-wider leading-none mb-3">Share Comparison Matrix</h4>
               <p className="text-[10px] text-gray-400 font-medium leading-relaxed mb-3">
                 Export these active filters and parameters into a standalone share link.
               </p>
               <button className="w-full py-2.5 bg-[#FF5B00]/8 hover:bg-[#FF5B00]/15 border border-[#FF5B00]/25 text-[#FF5B00] rounded-lg text-[13px] font-bold tracking-tight flex items-center justify-center gap-1.5 transition-all cursor-pointer">
                  <Share2 size={13} /> Generate share link
               </button>
            </div>
         </aside>

      </div>


        </>
      )}

      {compareMode !== 'product' && (
        <>
          <SponsoredCompareRail />

          {/* Dynamic Community Verdict Accordion */}
          <div className="max-w-7xl mx-auto px-0 pb-16 mt-6">
            <div className="bg-white rounded-xl border border-[#E8EDF2] p-6 md:p-8 text-left">
              <h4 className="text-sm font-extrabold text-[#1A1A2E] tracking-tight mb-2">Community opinions</h4>
              <p className="text-[11.5px] text-[#9AA0AC] mb-6">What shoppers say about similar picks</p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  { name: 'Sabbir Ahmed', role: 'Verified Buyer', quote: 'The materials here hold unique premium density. Highly recommended long-term staple.', avatar: 'https://i.pravatar.cc/150?u=sabbir' },
                  { name: 'Runa Laila', role: 'Premium Critic', quote: 'Stitching alignment is extremely responsive. Matches precise capsule styling charts.', avatar: 'https://i.pravatar.cc/150?u=runa' },
                  { name: 'Anisul Hoque', role: 'Comfort Enthusiast', quote: 'Outstanding value-for-money parameter alignment. Bypasses premium markup entirely.', avatar: 'https://i.pravatar.cc/150?u=anis' }
                ].map((verdict, idx) => (
                  <div key={idx} className="border border-[#E8EDF2] rounded-[10px] p-5 relative">
                    <p className="text-[11.5px] font-medium text-[#4B5563] italic leading-relaxed mb-4">
                      "{verdict.quote}"
                    </p>
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-full bg-[#F4F7F9] overflow-hidden">
                        <img src={verdict.avatar} className="w-full h-full object-cover" alt="" />
                      </div>
                      <div>
                        <span className="text-[13px] font-bold text-[#1A1A2E] tracking-tight block leading-none">{verdict.name}</span>
                        <span className="text-[11px] font-medium text-[#9AA0AC] tracking-tight mt-0.5 block leading-none">{verdict.role}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}

      <AnimatePresence>
        {isProductSearchOpen && (
          <motion.div
            className="fixed inset-0 z-[260] bg-[#1A1A2E]/55 backdrop-blur-sm px-4 py-6 md:p-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="max-w-5xl mx-auto h-full flex flex-col">
              <motion.div
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 18 }}
                className="bg-white rounded-[15px] border border-[#e8edf2] shadow-2xl overflow-hidden flex flex-col min-h-0"
              >
                <div className="flex items-center justify-between gap-4 p-5 border-b border-[#e8edf2]">
                  <div>
                    <div className="text-[11px] font-semibold tracking-tight text-[#9AA0AC]">Compare builder</div>
                    <h3 className="text-base font-extrabold tracking-tight text-[#1A1A2E]">Search and add products</h3>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsProductSearchOpen(false)}
                    className="w-9 h-9 rounded-full border border-[#e8edf2] text-[#8a9bb0] hover:text-[#E8500A] hover:border-[#E8500A]/30 flex items-center justify-center cursor-pointer"
                  >
                    <X size={16} />
                  </button>
                </div>

                <div className="p-5 border-b border-[#e8edf2] bg-[#F8FBFD]">
                  <div className="relative">
                    <input
                      type="text"
                      value={productSearchQuery}
                      onChange={(e) => setProductSearchQuery(e.target.value)}
                      placeholder="Search products, brands, or categories..."
                      className="w-full h-11 rounded-[5px] border border-[#e8edf2] bg-white px-4 pr-28 text-sm font-semibold text-[#1A1D4E] placeholder:text-gray-400 focus:outline-none focus:border-[#E8500A]/40"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-black uppercase tracking-widest text-[#8a9bb0]">
                      {comparedProducts.length}/4 selected
                    </span>
                  </div>
                </div>

                <div className="flex-1 min-h-0 overflow-y-auto p-5 bg-[#F4F7F9]">
                  {searchableProducts.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                      {searchableProducts.map((product: any) => (
                        <div
                          key={product.id}
                          className="bg-white border border-[#e8edf2] rounded-[8px] p-4 flex flex-col gap-4 shadow-sm"
                        >
                          <button
                            type="button"
                            onClick={() => navigate(`/products/${product.id}`)}
                            className="text-left flex items-start gap-3 cursor-pointer"
                          >
                            <img
                              src={(product.images && product.images[0]) || product.image}
                              alt={product.title}
                              className="w-16 h-16 rounded-[6px] object-cover border border-[#e8edf2] shrink-0"
                            />
                            <div className="min-w-0">
                              <div className="text-[11px] font-bold tracking-tight text-[#FF5B00] mb-1">
                                {product.brand || product.brandName || 'Brand'}
                              </div>
                              <h4 className="text-sm font-bold text-[#1A1A2E] line-clamp-2 leading-snug">
                                {product.title || product.name}
                              </h4>
                              <p className="text-[11px] font-semibold text-gray-500 mt-1">
                                {(product.category || product.categoryName || 'Category')} {product.price ? `• ৳${Number(product.price).toLocaleString()}` : ''}
                              </p>
                            </div>
                          </button>
                          <div className="flex gap-2">
                            <button
                              type="button"
                              onClick={() => {
                                handleAddToCompare(product);
                                if ((comparedProducts?.length || 0) + 1 >= 4) {
                                  setIsProductSearchOpen(false);
                                }
                              }}
                              className="flex-1 py-2 rounded-[5px] bg-[#E8500A] hover:bg-orange-600 text-white text-[10px] font-black uppercase tracking-widest cursor-pointer"
                            >
                              Add to compare
                            </button>
                            <button
                              type="button"
                              onClick={() => navigate(`/products/${product.id}`)}
                              className="px-3 py-2 rounded-[5px] border border-[#e8edf2] text-[#1A1D4E] hover:border-[#E8500A]/30 hover:text-[#E8500A] text-[10px] font-black uppercase tracking-widest cursor-pointer"
                            >
                              View
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="min-h-[260px] flex flex-col items-center justify-center text-center gap-3">
                      <div className="w-14 h-14 rounded-full bg-white border border-[#e8edf2] flex items-center justify-center text-[#E8500A]">
                        <ShoppingBag size={22} />
                      </div>
                      <div>
                        <h4 className="text-sm font-extrabold tracking-tight text-[#1A1A2E]">No matching products</h4>
                        <p className="text-[13px] font-medium text-[#9AA0AC] mt-1">
                          Try another keyword or remove a compared product first.
                        </p>
                      </div>

                      <div className="mt-auto pt-3 border-t border-slate-100 flex items-center justify-between">
                        <div>
                          <span className="text-[9px] font-bold text-slate-400 block uppercase leading-none">Decision Score</span>
                          <span className="text-sm font-extrabold text-slate-800 mt-1 block">
                            {item.verdict.score}
                          </span>
                        </div>
                        <span className="text-[10px] font-bold text-[#FF5B00] hover:underline cursor-pointer">
                          View Full Review &gt;
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>

      {/* 5. AI Recommendation Footer Callout */}
      <div className="max-w-7xl mx-auto px-6 mb-12">
        <div className="bg-slate-900 rounded-3xl p-6 md:p-8 text-white relative overflow-hidden shadow-md flex flex-col lg:flex-row items-center justify-between gap-8">
          
          {/* Subtle background ambient glowing elements */}
          <div className="absolute -left-10 -bottom-10 w-44 h-44 bg-[#FF5B00]/10 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute right-0 top-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />

          {/* Left part: assist text */}
          <div className="flex items-center gap-4.5 max-w-2xl text-center lg:text-left">
            <div className="w-14 h-14 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center shrink-0 shadow-inner">
              <Sparkles size={26} className="text-[#FF5B00] animate-pulse" />
            </div>
            <div>
              <h4 className="text-base font-extrabold text-white">Not sure which one to choose?</h4>
              <p className="text-slate-400 text-xs md:text-sm font-normal mt-1 leading-relaxed">
                Let our AI assistant recommend the perfect product for your needs based on direct specifications and budget.
              </p>
              
              <button 
                onClick={triggerAiRecommendation}
                className="mt-4 px-6 py-2.5 bg-[#FF5B00] hover:bg-orange-600 active:scale-95 text-white rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-md shadow-orange-500/10 cursor-pointer border-none"
              >
                <span>GET PERSONALIZED RECOMMENDATION</span>
                <ArrowRight size={13} />
              </button>
            </div>
          </div>

          {/* Right part: AI key selling props */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 w-full lg:w-auto shrink-0 border-t lg:border-t-0 lg:border-l border-slate-800 pt-6 lg:pt-0 lg:pl-8 text-center sm:text-left">
            <div>
              <span className="text-[10px] font-bold text-[#FF5B00] uppercase tracking-wider">AI-POWERED</span>
              <p className="text-xs font-bold text-white mt-1">Smart recommendations</p>
            </div>
            <div>
              <span className="text-[10px] font-bold text-[#FF5B00] uppercase tracking-wider">PERSONALIZED</span>
              <p className="text-xs font-bold text-white mt-1">Based on your needs</p>
            </div>
            <div>
              <span className="text-[10px] font-bold text-[#FF5B00] uppercase tracking-wider">UNBIASED</span>
              <p className="text-xs font-bold text-white mt-1">100% objective advice</p>
            </div>
          </div>

        </div>

        {/* AI Recommendation Panel Stream block */}
        <AnimatePresence>
          {isAiLoading && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mt-4 bg-white border border-slate-100 p-6 rounded-2xl flex items-center justify-center gap-3 text-slate-600 text-xs font-bold"
            >
              <div className="w-5 h-5 border-2 border-[#FF5B00] border-t-transparent rounded-full animate-spin shrink-0" />
              <span>Analyzing specifications matrices and consumer reviews data sheets...</span>
            </motion.div>
          )}

          {aiRecommendation && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mt-4 bg-white border border-slate-100 p-6 rounded-3xl shadow-sm text-slate-700 relative text-sm leading-relaxed"
            >
              <button 
                onClick={() => setAiRecommendation(null)}
                className="absolute top-4 right-4 w-6 h-6 bg-slate-50 hover:bg-slate-100 text-slate-400 hover:text-slate-600 rounded-full flex items-center justify-center transition-colors cursor-pointer border-none"
              >
                <X size={14} />
              </button>
              
              <div className="flex items-center gap-2 mb-4 text-[#FF5B00] font-bold text-xs uppercase tracking-widest">
                <Sparkles size={14} />
                <span>CHOOSEIFY INTEL ADVISOR REPORT</span>
              </div>
              
              <div className="whitespace-pre-line font-medium text-slate-600">
                {aiRecommendation}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ==========================================
          ADD PRODUCT MODAL (HIGHLY POLISHED SCREEN)
          ========================================== */}
      <AnimatePresence>
        {isAddModalOpen && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[999] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-3xl w-full max-w-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
            >
              {/* Modal header */}
              <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50">
                <div>
                  <h3 className="text-lg font-extrabold text-slate-900">Add Product to Compare</h3>
                  <p className="text-slate-400 text-xs font-normal mt-0.5">
                    Select a product from the database catalog
                  </p>
                </div>
                <button 
                  onClick={() => setIsAddModalOpen(false)}
                  className="w-8 h-8 rounded-full bg-white border border-slate-200 hover:bg-slate-50 text-slate-500 hover:text-slate-700 flex items-center justify-center cursor-pointer transition-colors"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Search Bar Input */}
              <div className="p-4 border-b border-slate-100 flex items-center bg-white">
                <input 
                  type="text"
                  placeholder="Search products by brand, title, specs..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 focus:border-[#FF5B00] focus:ring-1 focus:ring-[#FF5B00] rounded-xl px-4 py-2.5 text-xs font-medium outline-none transition-all"
                  autoFocus
                />
              </div>

              {/* Products list scrollable */}
              <div className="flex-1 overflow-y-auto p-4 space-y-2 bg-slate-50/50 min-h-[300px]">
                {filteredProductsToAdd.length > 0 ? (
                  filteredProductsToAdd.map((p: any) => (
                    <div 
                      key={p.id}
                      onClick={() => handleAddProduct(p)}
                      className="bg-white border border-slate-100 hover:border-[#FF5B00] p-3.5 rounded-2xl flex items-center justify-between cursor-pointer hover:shadow-xs transition-all group"
                    >
                      <div className="flex items-center gap-3.5">
                        <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-100 p-1 shrink-0 flex items-center justify-center overflow-hidden">
                          <img 
                            src={(p.images && p.images[0]) || p.image || 'https://images.unsplash.com/photo-1707251759491-18d48607ea0c?w=100&h=100&fit=crop'} 
                            className="max-h-full max-w-full object-contain rounded-md" 
                            alt={p.name || p.title} 
                            referrerPolicy="no-referrer"
                          />
                        </div>
                        <div className="text-left">
                          <span className="text-[9px] font-extrabold text-[#FF5B00] uppercase tracking-widest leading-none block">
                            {p.brand || 'Premium Brand'}
                          </span>
                          <h4 className="text-xs font-bold text-slate-800 mt-1 group-hover:text-[#FF5B00] transition-colors leading-snug line-clamp-1">
                            {p.name || p.title}
                          </h4>
                          <span className="text-[10px] text-slate-400 mt-0.5 block font-semibold leading-none">
                            {p.category || 'Electronics'}
                          </span>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <p className="text-xs font-extrabold text-slate-900">
                          ৳{(p.price || 0).toLocaleString()}
                        </p>
                        <span className="text-[9px] text-[#FF5B00] font-bold uppercase tracking-widest mt-0.5 block opacity-0 group-hover:opacity-100 transition-opacity">
                          + ADD
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="flex flex-col items-center justify-center text-center py-14">
                    <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mb-3">
                      <Layers size={20} />
                    </div>
                    <p className="text-xs font-bold text-slate-500">No matching products found</p>
                    <p className="text-[11px] text-slate-400 mt-1 max-w-[240px]">
                      Try adjusting your keywords or adding products from the product catalog first.
                    </p>
                  </div>
                )}
              </div>

              {/* Modal footer */}
              <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-end">
                <button 
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-5 py-2 border border-slate-200 hover:bg-white text-slate-700 text-xs font-bold uppercase tracking-wider rounded-xl transition-colors cursor-pointer"
                >
                  Close
                </button>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
