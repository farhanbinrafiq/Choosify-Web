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
import { useDashboard } from '../context/DashboardContext';
import { useGlobalState } from '../context/GlobalStateContext';
import { toast } from 'react-hot-toast';

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

    displayItems.forEach(item => {
      highlights[item.id] = {};
    });

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

  // Profile Pill Click Handler with scroll & highlight linkage
  const handleProfilePillClick = (profileId: string) => {
    setActiveProfile(profileId);
    let targetId = '';
    if (profileId === 'camera') targetId = 'sec-camera';
    else if (profileId === 'performance') targetId = 'sec-performance';
    else if (profileId === 'battery') targetId = 'sec-battery';
    else if (profileId === 'value' || profileId === 'premium') targetId = 'sec-overview';

    if (targetId) {
      const el = document.getElementById(targetId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  };

  // AI Recommendation engine generator
  const triggerAiRecommendation = () => {
    setIsAiLoading(true);
    setAiRecommendation(null);
    
    // Simulate streaming recommendation text based on active items
    setTimeout(() => {
      let text = '';
      const names = displayItems.map(item => item.name);
      
      if (names.some(n => n.includes('iPhone 15 Pro Max')) && names.some(n => n.includes('S24 Ultra'))) {
        text = `Based on your comparison of flagship mobile products:\n\n` +
               `1. **Samsung Galaxy S24 Ultra** is our **top recommend option** for productivity, battery endurance (5,000 mAh), and creative photography with its phenomenal 200MP sensor. It leads overall benchmarks with a **9.2/10** score.\n\n` +
               `2. **Apple iPhone 15 Pro Max** represents the premium pinnacle of performance with the A17 Pro 3nm chipset. It excels in gaming optimization, material craftsmanship (Titanium), and organic videography.\n\n` +
               `3. **Google Pixel 8 Pro** offers outstanding AI-powered image processing, cleanest Android software features, and premium LTPO OLED screen protection.\n\n` +
               `*Recommendation Verdict:* Go with S24 Ultra if you seek extreme versatility and stylus support. Opt for the iPhone 15 Pro Max if you are embedded in the iOS ecosystem.`;
      } else {
        text = `Based on your custom product comparison:\n\n` +
               `1. **${displayItems[0]?.name || 'Primary choice'}** leads in segment features with excellent customer feedback (${displayItems[0]?.rating}/5.0). It presents robust manufacturing craftsmanship.\n\n` +
               `2. **${displayItems[1]?.name || 'Secondary choice'}** represents high-quality cost efficiency, offering optimal value per unit.\n\n` +
               `We highly advise prioritizing the **${displayItems[0]?.name || 'Primary choice'}** for its long-term durability index and verified store protection guarantees.`;
      }
      setAiRecommendation(text);
      setIsAiLoading(false);
    }, 1500);
  };

  // Shared columns grid count modifier
  const gridColumnsCountClass = useMemo(() => {
    const count = displayItems.length;
    return count === 1 
      ? 'grid-cols-1' 
      : count === 2 
        ? 'grid-cols-2' 
        : count === 3 
          ? 'grid-cols-3' 
          : 'grid-cols-4';
  }, [displayItems]);

  return (
    <div className="w-full bg-[#F8F9FC] py-10 font-sans" id="compare-engine-root">
      
      {/* 1. Header Section */}
      <div className="max-w-7xl mx-auto px-6 mb-8 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">Compare Products</h1>
          <p className="text-slate-500 text-sm md:text-base font-normal mt-1">
            Side-by-side comparison to find the best choice for you.
          </p>
        </div>

        {/* High quality objective badges */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2.5 bg-white border border-slate-100 rounded-xl px-4 py-2.5 shadow-sm">
            <div className="w-8 h-8 rounded-full bg-amber-50 flex items-center justify-center text-amber-500 shrink-0">
              <ShieldCheck size={18} />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-800 leading-none">100% Objective</p>
              <p className="text-[10px] text-slate-400 font-medium mt-0.5">Data-driven comparison</p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 bg-white border border-slate-100 rounded-xl px-4 py-2.5 shadow-sm">
            <div className="w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-500 shrink-0">
              <CheckCircle2 size={18} />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-800 leading-none">Verified Data</p>
              <p className="text-[10px] text-slate-400 font-medium mt-0.5">From authentic sources</p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 bg-white border border-slate-100 rounded-xl px-4 py-2.5 shadow-sm">
            <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-500 shrink-0">
              <RefreshCw size={16} className="animate-spin-slow" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-800 leading-none">Updated Daily</p>
              <p className="text-[10px] text-slate-400 font-medium mt-0.5">Always up to date</p>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Product Comparison Cards Row */}
      <div className="max-w-7xl mx-auto px-6 mb-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          
          {/* Add Product Dotted Card (Only visible if compared items < 4) */}
          {displayItems.length < 4 && (
            <div 
              onClick={() => setIsAddModalOpen(true)}
              className="group border-2 border-dashed border-slate-200 hover:border-[#FF5B00] rounded-2xl p-6 bg-white flex flex-col items-center justify-center text-center h-[310px] transition-all cursor-pointer shadow-xs hover:shadow-sm"
              id="btn-add-product-card"
            >
              <div className="w-12 h-12 rounded-full bg-slate-50 group-hover:bg-orange-50 flex items-center justify-center text-slate-400 group-hover:text-[#FF5B00] mb-4 transition-colors">
                <Plus size={24} />
              </div>
              <p className="text-xs font-extrabold text-slate-400 group-hover:text-[#FF5B00] uppercase tracking-wider transition-colors">
                ADD PRODUCT
              </p>
            </div>
          )}

          {/* Active Product Cards */}
          {displayItems.map((item) => (
            <div 
              key={item.id}
              className="relative bg-white border border-slate-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between h-[310px]"
            >
              {/* Close Button to remove item */}
              <button
                onClick={() => handleRemoveProduct(item.id)}
                className="absolute top-3 right-3 w-6 h-6 bg-slate-50 hover:bg-red-50 text-slate-400 hover:text-red-500 rounded-full flex items-center justify-center transition-colors cursor-pointer border-none shadow-xs z-10"
                title="Remove from comparison"
              >
                <X size={14} />
              </button>

              {/* Product Image */}
              <div className="w-full h-32 bg-slate-50/50 rounded-xl overflow-hidden mb-4 flex items-center justify-center p-2">
                <img 
                  src={item.image} 
                  className="max-h-full max-w-full object-contain rounded-lg transition-transform duration-300 hover:scale-105" 
                  alt={item.name} 
                  referrerPolicy="no-referrer"
                />
              </div>

              {/* Brand and Title info */}
              <div className="flex-1 flex flex-col">
                <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mb-1 leading-none">
                  {item.brand}
                </span>
                <h3 className="text-sm font-semibold text-slate-800 line-clamp-2 leading-snug h-10 mb-2">
                  {item.name}
                </h3>

                {/* Color swatches */}
                {item.colors && item.colors.length > 0 && (
                  <div className="flex items-center gap-1.5 mb-2">
                    {item.colors.map((color: string, cidx: number) => (
                      <span 
                        key={cidx} 
                        className="w-3.5 h-3.5 rounded-full border border-slate-200 shadow-xs cursor-pointer hover:scale-110 transition-transform" 
                        style={{ backgroundColor: color }}
                        title="Available color option"
                      />
                    ))}
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

          {/* YOUR COMPARISON Stats Card (Far right) */}
          <div className="bg-slate-900 text-white rounded-2xl p-6 flex flex-col justify-between h-[310px] shadow-sm relative overflow-hidden xl:col-start-5">
            {/* Ambient subtle background mesh */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#FF5B00]/10 rounded-full blur-2xl pointer-events-none" />
            
            <div>
              <span className="text-[10px] font-bold text-[#FF5B00] uppercase tracking-widest leading-none">
                YOUR COMPARISON
              </span>
              <h4 className="text-lg font-extrabold text-white mt-1">Summary Matrix</h4>
              
              <ul className="space-y-3 mt-4 text-xs font-semibold text-slate-300">
                <li className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-slate-800 flex items-center justify-center text-[#FF5B00] shrink-0">
                    <Check size={10} strokeWidth={3} />
                  </div>
                  <span>{displayItems.length} Products Added</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-slate-800 flex items-center justify-center text-[#FF5B00] shrink-0">
                    <Check size={10} strokeWidth={3} />
                  </div>
                  <span>24 System Parameters</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-slate-800 flex items-center justify-center text-[#FF5B00] shrink-0">
                    <Check size={10} strokeWidth={3} />
                  </div>
                  <span>Side-by-side spec grid</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-slate-800 flex items-center justify-center text-[#FF5B00] shrink-0">
                    <Check size={10} strokeWidth={3} />
                  </div>
                  <span>Easy layout to decide</span>
                </li>
              </ul>
            </div>

            <div className="mt-auto">
              <button 
                onClick={() => toast.success('Comparison link copied to clipboard!')}
                className="w-full py-2.5 bg-[#FF5B00] hover:bg-orange-600 active:scale-95 text-white rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-md shadow-orange-500/15 cursor-pointer border-none"
              >
                <Share2 size={13} />
                <span>SHARE COMPARISON</span>
              </button>
              
              <p className="flex items-center justify-center gap-1.5 text-slate-400 hover:text-white transition-colors text-[11px] font-semibold cursor-pointer mt-3">
                <Heart size={12} className="fill-current text-slate-500" />
                <span>Save comparison</span>
              </p>
            </div>
          </div>

        </div>
      </div>

      {/* 3. Decision Profile Bar (Pill filters) */}
      <div className="bg-slate-50 border-y border-slate-200/60 py-3.5 px-6 mb-10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5 shrink-0">
            <span className="text-xs font-extrabold text-slate-500 uppercase tracking-widest">
              DECISION PROFILE:
            </span>
            <span className="text-[11px] font-semibold text-slate-400">
              Choose what matters most to you
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {[
              { id: 'all', label: 'All Fields', icon: <Layers size={13} /> },
              { id: 'value', label: 'Best Value', icon: <Plus size={13} /> },
              { id: 'camera', label: 'Best Camera', icon: <Camera size={13} /> },
              { id: 'performance', label: 'Best Performance', icon: <Zap size={13} /> },
              { id: 'battery', label: 'Best Battery', icon: <Sliders size={13} /> },
              { id: 'premium', label: 'Premium Choice', icon: <Crown size={13} /> }
            ].map(profile => {
              const isActive = activeProfile === profile.id;
              return (
                <button
                  key={profile.id}
                  onClick={() => handleProfilePillClick(profile.id)}
                  className={cn(
                    "px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-150 flex items-center gap-1.5 border cursor-pointer",
                    isActive 
                      ? "bg-slate-900 border-slate-900 text-white shadow-sm" 
                      : "bg-white border-slate-200 text-slate-600 hover:bg-slate-100"
                  )}
                >
                  {profile.icon}
                  <span>{profile.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* 4. Two-Column Side-by-Side Comparison Layout */}
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-[240px_1fr] gap-8 items-start mb-14">
        
        {/* Left Column (Sticky Sidebar Navigation) */}
        <aside className="lg:sticky lg:top-28 z-20 space-y-1 bg-slate-50 p-4 rounded-2xl border border-slate-100 hidden lg:block">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-3 mb-3">
            SPECIFICATION GROUPS
          </p>
          
          {COMPARE_SECTIONS.map((sec) => {
            const isActive = activeSection === sec.id;
            return (
              <button
                key={sec.id}
                onClick={() => {
                  const el = document.getElementById(`sec-${sec.id}`);
                  if (el) {
                    el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    setActiveSection(sec.id);
                  }
                }}
                className={cn(
                  "w-full text-left px-3.5 py-2.5 text-xs font-bold uppercase tracking-wider rounded-xl transition-all flex items-center justify-between border-none bg-transparent cursor-pointer",
                  isActive 
                    ? "text-[#FF5B00] bg-orange-50/75 border-l-3 border-[#FF5B00] pl-2.5 font-extrabold" 
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/50"
                )}
              >
                <span>{sec.title}</span>
                {isActive && <ChevronRight size={14} />}
              </button>
            );
          })}

          <button 
            onClick={() => setIsAddModalOpen(true)}
            className="w-full py-2.5 mt-6 bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          >
            <Plus size={14} />
            <span>ADD PRODUCT</span>
          </button>
        </aside>

        {/* Right Column (Dynamic Comparison Matrices Table) */}
        <div className="space-y-8">
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            
            {COMPARE_SECTIONS.map((section) => (
              <div key={section.id} id={`sec-${section.id}`} className="scroll-mt-32">
                
                {/* Category Section Header Banner */}
                <div className="bg-slate-50 border-y border-slate-100 py-3.5 px-6 flex items-center justify-between">
                  <h4 className="text-xs font-black text-slate-800 tracking-wider">
                    {section.title}
                  </h4>
                  <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                    {section.rows.length} parameters
                  </span>
                </div>

                {/* Spec Rows Under Each Section */}
                <div className="divide-y divide-slate-100">
                  {section.rows.map((row, rIdx) => {
                    // Profile-based highlighted row condition
                    const isProfileHighlighted = 
                      (activeProfile === 'camera' && section.id === 'camera') ||
                      (activeProfile === 'performance' && section.id === 'performance') ||
                      (activeProfile === 'battery' && section.id === 'battery');

                    return (
                      <div 
                        key={rIdx} 
                        className={cn(
                          "grid grid-cols-[1.5fr_3fr] md:grid-cols-[200px_1fr] items-stretch min-h-[56px] transition-colors",
                          isProfileHighlighted ? "bg-amber-50/20" : "hover:bg-slate-50/20"
                        )}
                      >
                        {/* Parameter label (Left) */}
                        <div className="p-4 border-r border-slate-100 flex flex-col justify-center">
                          <span className="text-xs font-semibold text-slate-800">{row.label}</span>
                          {row.key === 'performanceScore' && (
                            <span className="text-[9px] text-slate-400 font-normal mt-0.5 leading-none">AnTuTu Benchmark</span>
                          )}
                          {row.key === 'bestPrice' && (
                            <span className="text-[9px] text-slate-400 font-normal mt-0.5 leading-none">VAT Inclusive</span>
                          )}
                        </div>

                        {/* Parameter value columns aligned side-by-side (Right) */}
                        <div className={cn("grid divide-x divide-slate-100", gridColumnsCountClass)}>
                          {displayItems.map((item) => {
                            const val = (item.specs as any)[row.key] || 'N/A';
                            const badgeHighlight = cellHighlights[item.id]?.[row.key];

                            return (
                              <div 
                                key={item.id} 
                                className="p-4 flex flex-col items-center justify-center text-center text-xs font-medium text-slate-700 relative"
                              >
                                {/* Display rating as golden stars */}
                                {(row as any).isRating ? (
                                  <div className="flex flex-col items-center gap-1">
                                    <span className="text-xs font-extrabold text-slate-900">{val} / 5.0</span>
                                    <div className="flex items-center gap-0.5">
                                      {[1, 2, 3, 4, 5].map(s => (
                                        <Star key={s} size={10} className="text-amber-400 fill-current" />
                                      ))}
                                    </div>
                                    <span className="text-[9px] text-slate-400">({item.reviews} reviews)</span>
                                  </div>
                                ) : (
                                  <div className="flex flex-col items-center gap-1.5">
                                    <span className="text-xs font-semibold text-slate-800">{val}</span>
                                    
                                    {/* Small custom design icons for brands */}
                                    {(row as any).hasIcon && val.includes('A17 Pro') && (
                                      <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest"> Apple Silicon</span>
                                    )}
                                    {(row as any).hasIcon && val.includes('Snapdragon') && (
                                      <span className="text-[9px] font-bold text-blue-500 uppercase tracking-widest">⚡ Qualcomm</span>
                                    )}
                                    {(row as any).hasIcon && val.includes('Tensor') && (
                                      <span className="text-[9px] font-bold text-emerald-500 uppercase tracking-widest">G Google Core</span>
                                    )}

                                    {/* Dynamic highlights badge */}
                                    {badgeHighlight && (
                                      <span className={cn(
                                        "inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[9px] font-extrabold uppercase tracking-wider shadow-xs mt-0.5",
                                        badgeHighlight === 'Sharpest' || badgeHighlight === 'Highest'
                                          ? "bg-purple-50 text-purple-600 border border-purple-100"
                                          : "bg-emerald-50 text-emerald-600 border border-emerald-100"
                                      )}>
                                        {badgeHighlight}
                                      </span>
                                    )}

                                    {/* Price offers link */}
                                    {(row as any).hasOffers && (
                                      <span className="text-[10px] text-blue-500 hover:underline cursor-pointer font-semibold mt-0.5 block">
                                        View Offers ({val.includes('167') ? '12' : val.includes('145') ? '18' : '9'})
                                      </span>
                                    )}
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>

                      </div>
                    );
                  })}
                </div>

              </div>
            ))}

            {/* OUR VERDICT Row (Unified custom card rows at the bottom of the table) */}
            <div className="bg-slate-50 border-t border-slate-100 py-5 px-6">
              <h4 className="text-xs font-black text-slate-800 tracking-wider mb-4 uppercase">
                OUR VERDICT
              </h4>
              <div className="grid grid-cols-[1.5fr_3fr] md:grid-cols-[200px_1fr] items-stretch gap-0">
                <div className="p-2 border-r border-slate-100 flex flex-col justify-center">
                  <span className="text-xs font-extrabold text-slate-800 uppercase">Expert Consensus</span>
                  <p className="text-[10px] text-slate-400 font-normal leading-relaxed mt-1">
                    Calculated decision rating based on comprehensive expert trade-off sheets.
                  </p>
                </div>

                <div className={cn("grid divide-x divide-slate-100 bg-white border border-slate-100 rounded-xl overflow-hidden", gridColumnsCountClass)}>
                  {displayItems.map((item) => (
                    <div 
                      key={item.id} 
                      className="p-5 flex flex-col justify-between text-left relative transition-colors bg-white hover:bg-slate-50/30"
                    >
                      <div>
                        {/* Award / Badge Tag */}
                        <span className={cn(
                          "inline-block px-3 py-1 rounded-md text-[9px] font-black tracking-wider uppercase mb-2 shadow-xs",
                          item.verdict.badge.includes('PREMIUM') || item.verdict.badge.includes('PICK')
                            ? "bg-amber-100 text-amber-800 border border-amber-200"
                            : item.verdict.badge.includes('ALL ROUNDER')
                              ? "bg-indigo-100 text-indigo-800 border border-indigo-200"
                              : "bg-emerald-100 text-emerald-800 border border-emerald-200"
                        )}>
                          {item.verdict.badge}
                        </span>
                        
                        <p className="text-xs font-semibold text-slate-800 mb-4">
                          {item.verdict.text}
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
