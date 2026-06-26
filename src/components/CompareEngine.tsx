import React, { useState, useMemo } from 'react';
import { 
  Zap, Info, Star, ShieldCheck, ShoppingBag, 
  ChevronDown, ChevronUp, Plus, X, Sparkles,
  Trophy, Medal, Activity, Scale, CreditCard,
  Truck, ArrowRight, CheckCircle2, AlertCircle, 
  Share2, HelpCircle, Users, BookOpen, Layers
} from 'lucide-react';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'motion/react';
import { DragScrollContainer, QuickFilterBar, ActiveFilterChips, FullSidebarFilterPanel } from './FilterEngine';
import { useDashboard } from '../context/DashboardContext';
import { toast } from 'react-hot-toast';
import { Link } from 'react-router-dom';

// ==========================================
// TYPE & INTERFACE DEFINITIONS FOR ADVANCED COMPARISONS
// ==========================================
interface ComparisonItem {
  id: string;
  brand: string;
  name: string;
  image: string;
  tag: string;
  price?: number;
  rating: number;
  isWinner?: boolean;
  score?: number;
  highlightText?: string;
  specs: Record<string, any>;
}

interface MetricRow {
  label: string;
  subLabel?: string;
  key: string;
  type?: 'text' | 'rating' | 'score' | 'tag' | 'badge';
  highlight?: boolean;
}

interface CompareSection {
  title: string;
  icon: React.ReactNode;
  subtitle: string;
  metrics: MetricRow[];
}

// ==========================================
// MOCK DATASETS FOR DIFFERENT COMPARATIVE CONTEXTS
// ==========================================

// 1. PRODUCT COMPARISON BASE DATA
const PRODUCT_ITEMS: ComparisonItem[] = [
  {
    id: 'prod-1',
    brand: 'Sailor',
    name: 'Ultra Cotton Pro',
    image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=400&h=400&fit=crop',
    tag: 'Our Choice',
    price: 2800,
    rating: 4.8,
    isWinner: true,
    highlightText: 'Top Performance Materials',
    specs: {
      price: '৳2,800',
      value: 'Excellent',
      clearance: '15% OFF',
      rating: '4.8/5.0',
      influence: '95/100',
      build: 'Premium',
      durability: 'High (5 yrs)',
      experience: 'Supreme',
      sizes: 'S-3XL',
      material: 'Premium Cotton',
      waterproof: 'No',
      fit: 'Custom Fit',
      warranty: '1 Year',
      returns: '30 Days',
      availability: 'In Stock',
      deals: 'Yes',
      officialStore: 'Yes',
    }
  },
  {
    id: 'prod-2',
    brand: 'Yellow',
    name: 'Premium Ethnic',
    image: 'https://images.unsplash.com/photo-1598533341505-da5e5b3f272a?w=400&h=400&fit=crop',
    tag: 'Trending',
    price: 3200,
    rating: 4.5,
    isWinner: false,
    highlightText: 'Heritage & Traditional Grip',
    specs: {
      price: '৳3,200',
      value: 'Good',
      clearance: '10% OFF',
      rating: '4.5/5.0',
      influence: '88/100',
      build: 'High-End',
      durability: 'Robust (3 yrs)',
      experience: 'Comfort',
      sizes: 'M-XXL',
      material: 'Silk Blend',
      waterproof: 'Splash Proof',
      fit: 'Tailored',
      warranty: '6 Months',
      returns: '15 Days',
      availability: 'Limited',
      deals: 'Yes',
      officialStore: 'Yes',
    }
  },
  {
    id: 'prod-3',
    brand: 'Infinity',
    name: 'Modern Casual',
    image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400&h=400&fit=crop',
    tag: 'Budget',
    price: 1800,
    rating: 4.2,
    isWinner: false,
    highlightText: 'Best Cost-per-Wear',
    specs: {
      price: '৳1,800',
      value: 'Best',
      clearance: 'No Offer',
      rating: '4.2/5.0',
      influence: '82/100',
      build: 'Standard',
      durability: 'Standard (2 yrs)',
      experience: 'Basic',
      sizes: 'S-XL',
      material: 'Cotton Mix',
      waterproof: 'No',
      fit: 'Regular Fit',
      warranty: 'None',
      returns: '7 Days',
      availability: 'In Stock',
      deals: 'No',
      officialStore: 'No',
    }
  }
];

const PRODUCT_SECTIONS: CompareSection[] = [
  {
    title: 'Pricing',
    icon: <CreditCard size={16} />,
    subtitle: 'Market rates and budget parameters',
    metrics: [
      { label: 'Current Price', subLabel: 'VAT Included', key: 'price', highlight: true },
      { label: 'Value for Money', subLabel: 'Performance/Price index', key: 'value', type: 'badge' },
      { label: 'Clearance Rates', subLabel: 'Available discount coupons', key: 'clearance', type: 'tag' }
    ]
  },
  {
    title: 'Quality & Benchmarks',
    icon: <Star size={16} />,
    subtitle: 'Expert & customer decision factors',
    metrics: [
      { label: 'Customer Rating', subLabel: 'Market Consensus', key: 'rating', type: 'rating' },
      { label: 'Influencer Score', subLabel: 'Direct Reviewers', key: 'influence', type: 'score' },
      { label: 'Build Quality', key: 'build' },
      { label: 'Durability', key: 'durability' },
      { label: 'Grip & Comfort', key: 'experience' }
    ]
  },
  {
    title: 'Technical Attributes',
    icon: <Layers size={16} />,
    subtitle: 'Material values and sizing specifications',
    metrics: [
      { label: 'Available Sizes', key: 'sizes' },
      { label: 'Outer Fabric', key: 'material' },
      { label: 'Waterproof Rating', key: 'waterproof' },
      { label: 'Precision Fit', key: 'fit' }
    ]
  },
  {
    title: 'Logistics & Protections',
    icon: <Truck size={16} />,
    subtitle: 'Ownership security parameters',
    metrics: [
      { label: 'Warranty Duration', key: 'warranty' },
      { label: 'Defect Return Window', key: 'returns', highlight: true },
      { label: 'Stock Status', key: 'availability' }
    ]
  }
];

// 2. BRAND COMPARISON BASE DATA
const BRAND_ITEMS: ComparisonItem[] = [
  {
    id: 'brand-1',
    brand: 'Global Heritage',
    name: 'AARONG',
    image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=400&fit=crop',
    tag: 'Elite Local',
    rating: 4.9,
    isWinner: true,
    highlightText: 'Ecosystem Leader in Craftsmanship',
    specs: {
      trustScore: '98/100',
      reputation: 'Elite Class',
      growthRate: 'Stable (8% YoY)',
      rangeSize: 'Massive (5000+ items)',
      coverage: 'Full apparel, Home, Footwear',
      behaviorType: 'Legacy Brand',
      satisfaction: '97%',
      verification: 'Verified Official',
      country: 'Bangladesh',
    }
  },
  {
    id: 'brand-2',
    brand: 'High Fashion',
    name: 'YELLOW',
    image: 'https://images.unsplash.com/photo-1479064555552-3ef4979f8908?w=400&h=400&fit=crop',
    tag: 'Premium Trend',
    rating: 4.6,
    isWinner: false,
    highlightText: 'Fast Adapter to Western aesthetics',
    specs: {
      trustScore: '92/100',
      reputation: 'High Prestige',
      growthRate: 'High (22% YoY)',
      rangeSize: 'Wide (2000+ items)',
      coverage: 'Premium apparel, Loungewear',
      behaviorType: 'Global Appeal',
      satisfaction: '93%',
      verification: 'Verified Official',
      country: 'Bangladesh/Exports',
    }
  },
  {
    id: 'brand-3',
    brand: 'Footwear & Craft',
    name: 'APEX',
    image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=400&fit=crop',
    tag: 'Household Staple',
    rating: 4.7,
    isWinner: false,
    highlightText: 'Unmatched Leather Operations',
    specs: {
      trustScore: '95/100',
      reputation: 'Elite Class',
      growthRate: 'Moderate (11% YoY)',
      rangeSize: 'Massive (4000+ items)',
      coverage: 'Full footwear, leather gear',
      behaviorType: 'Legacy Brand',
      satisfaction: '95%',
      verification: 'Verified Official',
      country: 'Bangladesh',
    }
  }
];

const BRAND_SECTIONS: CompareSection[] = [
  {
    title: 'Brand Credentials & Trust',
    icon: <ShieldCheck size={16} />,
    subtitle: 'Institutional scores and market security metrics',
    metrics: [
      { label: 'Trust Index Score', subLabel: 'Customer Assurance', key: 'trustScore', type: 'rating' },
      { label: 'Market Reputation', subLabel: 'Expert Category Grade', key: 'reputation', type: 'badge' },
      { label: 'Growth & Vitality', key: 'growthRate' },
      { label: 'Product Range Depth', key: 'rangeSize' }
    ]
  },
  {
    title: 'Behavior & Market Presence',
    icon: <Scale size={16} />,
    subtitle: 'Operational parameters and demographics coverage',
    metrics: [
      { label: 'Market Segment Class', key: 'behaviorType', type: 'badge' },
      { label: 'Customer Satisfaction Rate', key: 'satisfaction', type: 'score' },
      { label: 'Verification Status', key: 'verification', type: 'tag', highlight: true },
      { label: 'Country of Origin', key: 'country' }
    ]
  }
];

// 3. CREATOR COMPARISON BASE DATA
const CREATOR_ITEMS: ComparisonItem[] = [
  {
    id: 'creator-1',
    brand: 'Tech & Lifestyle',
    name: 'Nafis Anjum',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop',
    tag: 'Highly Trusted',
    rating: 4.9,
    isWinner: true,
    highlightText: 'Exceptional Performance Breakdown',
    specs: {
      engagement: '8.5%',
      followers: '520k Subscribers',
      growthRate: 'Rapid (+15% MoM)',
      influence: '94/100',
      audience: '18-35 Tech Buyers',
      platform: 'YouTube, Web',
      verification: 'Verified Creator',
      collaborations: 'Samsung, Daraz, Sailor',
      trustLevel: '95%',
    }
  },
  {
    id: 'creator-2',
    brand: 'Fashion & Aesthetic',
    name: 'Tasnim Sayed',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop',
    tag: 'Style Guru',
    rating: 4.7,
    isWinner: false,
    highlightText: 'Deep Connection with Elite Boutiques',
    specs: {
      engagement: '9.2%',
      followers: '340k Followers',
      growthRate: 'Steady (+5% MoM)',
      influence: '89/100',
      audience: '16-30 Fashion Lovers',
      platform: 'Instagram, TikTok',
      verification: 'Verified Creator',
      collaborations: 'Aarong, Yellow, Apex',
      trustLevel: '91%',
    }
  },
  {
    id: 'creator-3',
    brand: 'Lifestyle & Travel',
    name: 'Rifat Al-Mahi',
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop',
    tag: 'Viral Authority',
    rating: 4.5,
    isWinner: false,
    highlightText: 'Mass Market Conversions Champion',
    specs: {
      engagement: '6.8%',
      followers: '800k Followers',
      growthRate: 'Explosive (+28% MoM)',
      influence: '85/100',
      audience: 'Mass Market Bangladesh',
      platform: 'Facebook, YouTube',
      verification: 'Verified Creator',
      collaborations: 'Foodpanda, Pathao, Infinity',
      trustLevel: '86%',
    }
  }
];

const CREATOR_SECTIONS: CompareSection[] = [
  {
    title: 'Audience Metrics & Growth',
    icon: <Users size={16} />,
    subtitle: 'Direct engagement and reach statistics',
    metrics: [
      { label: 'Follower Base', key: 'followers', highlight: true },
      { label: 'Engagement Rate', key: 'engagement', type: 'badge' },
      { label: 'Influence Index Score', key: 'influence', type: 'score' },
      { label: 'Growth Momentum', key: 'growthRate' }
    ]
  },
  {
    title: 'Behavior & Professional Status',
    icon: <Activity size={16} />,
    subtitle: 'Content style, authority, and verification',
    metrics: [
      { label: 'Primary Platforms', key: 'platform' },
      { label: 'Audience Core Age', key: 'audience' },
      { label: 'Brand Collaborations', key: 'collaborations' },
      { label: 'Audience Trust Level', key: 'trustLevel', type: 'score' }
    ]
  }
];

// 4. BUYING GUIDE COMPARISON BASE DATA
const GUIDE_ITEMS: ComparisonItem[] = [
  {
    id: 'guide-1',
    brand: 'WARDROBE ANALYSIS',
    name: 'Smart Wardrobe Guidelines',
    image: 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=400&h=400&fit=crop',
    tag: 'Most Popular',
    rating: 4.8,
    isWinner: true,
    highlightText: 'Unlocks Complete Capsule Wardrobe Blueprint',
    specs: {
      budgetLevel: 'Mid to High Premium',
      category: 'Smart Casual / Western',
      difficulty: 'Beginner Friendly',
      useCase: 'Office & Semi-Formal',
      expertScore: '96/100',
      communityScore: '94/100',
      readingTime: '12 min read',
      templatesCount: '5 Checklist Templates',
      recommendationStrength: 'Extremely Strong',
    }
  },
  {
    id: 'guide-2',
    brand: 'SUMMER BRIEFING',
    name: 'Summer Styling Blueprint',
    image: 'https://images.unsplash.com/photo-1525507119028-ed4c629a60a3?w=400&h=400&fit=crop',
    tag: 'Hot Pick',
    rating: 4.6,
    isWinner: false,
    highlightText: 'Sweat-Optimized Fabric Selection Secrets',
    specs: {
      budgetLevel: 'All Budgets',
      category: 'Summer Wear / Essentials',
      difficulty: 'Beginner Friendly',
      useCase: 'Casual & Travel Outfitting',
      expertScore: '88/100',
      communityScore: '91/100',
      readingTime: '8 min read',
      templatesCount: '3 Fabric Charts',
      recommendationStrength: 'Strong Comfort Match',
    }
  },
  {
    id: 'guide-3',
    brand: 'HERITAGE TRADITION',
    name: 'Festive Handcraft Checklist',
    image: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=400&h=400&fit=crop',
    tag: 'Collector Choice',
    rating: 4.7,
    isWinner: false,
    highlightText: 'How to Detect Authentic Pure Thread Crafts',
    specs: {
      budgetLevel: 'Premium Exclusive',
      category: 'Traditional Festive',
      difficulty: 'Advanced Collector',
      useCase: 'Weddings & Royal Occasions',
      expertScore: '92/100',
      communityScore: '89/100',
      readingTime: '15 min read',
      templatesCount: '8 Thread-density Grids',
      recommendationStrength: 'Expert Grade Only',
    }
  }
];

const GUIDE_SECTIONS: CompareSection[] = [
  {
    title: 'Guide Core Focus',
    icon: <BookOpen size={16} />,
    subtitle: 'Prerequisites, targeted use cases, and complexity',
    metrics: [
      { label: 'Target Budget Level', key: 'budgetLevel', highlight: true },
      { label: 'Outfit Category focus', key: 'category' },
      { label: 'Difficulty / Collectibility', key: 'difficulty', type: 'badge' },
      { label: 'Core Tailored Use Case', key: 'useCase' }
    ]
  },
  {
    title: 'Content Value & Weighting',
    icon: <ShieldCheck size={16} />,
    subtitle: 'Analytical indexes and resource details',
    metrics: [
      { label: 'AI Recommendation Strength', key: 'recommendationStrength', type: 'badge' },
      { label: 'Expert Knowledge Score', key: 'expertScore', type: 'score' },
      { label: 'Community Acceptance', key: 'communityScore', type: 'rating' },
      { label: 'Reading Duration', key: 'readingTime' }
    ]
  }
];

// 5. AI SMART COMPARE BASE DATA
const AIS_ITEMS: ComparisonItem[] = [
  {
    id: 'ais-1',
    brand: 'OPTIMIZATION ENGINE',
    name: 'Optimal Value Package',
    image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=400&h=400&fit=crop',
    tag: 'AI Recommendation',
    rating: 4.9,
    isWinner: true,
    highlightText: 'Optimal Compromise of Cost and Premium Fabric',
    specs: {
      alignmentScore: '98%',
      fitScore: '95/100',
      consensus: 'Outstanding (4.9/5.0)',
      suitedFor: 'High Utility Professional Wear',
      keyAdvantage: 'High Resiliency Cotton Blend',
      costSavings: '৳4,500 Saved over 1 Yr',
      riskRating: 'Very Low Risk',
      overallGrade: 'Grade A+ Value',
    }
  },
  {
    id: 'ais-2',
    brand: 'LONGEVITY ENGINE',
    name: 'Premium Longevity Setup',
    image: 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=400&h=400&fit=crop',
    tag: 'Legacy Investment',
    rating: 4.7,
    isWinner: false,
    highlightText: 'Maximum Resiliency to Fade & Heavy Washing Loops',
    specs: {
      alignmentScore: '91%',
      fitScore: '89/100',
      consensus: 'Highly Reliable (4.7/5.0)',
      suitedFor: 'Severe Heavy Use conditions',
      keyAdvantage: 'Pure Organic Giza Fiber Structure',
      costSavings: '৳1,200 Saved (Premium Pricing)',
      riskRating: 'Zero Risk (Lifetime Warranty equivalent)',
      overallGrade: 'Grade A Durability',
    }
  },
  {
    id: 'ais-3',
    brand: 'FRUGAL SAVER',
    name: 'Ultra Budget Bundle',
    image: 'https://images.unsplash.com/photo-1534452285544-14eb58f33e2b?w=400&h=400&fit=crop',
    tag: 'Budget Optimized',
    rating: 4.3,
    isWinner: false,
    highlightText: 'Absolute Lowest Immediate Capital Investment',
    specs: {
      alignmentScore: '85%',
      fitScore: '82/100',
      consensus: 'Frugal Favorite (4.3/5.0)',
      suitedFor: 'Temporary Event casual use',
      keyAdvantage: 'Low Entry Cost, light blend',
      costSavings: 'Immediate ৳2,000 Upfront Cash Savings',
      riskRating: 'Medium Risk (Average Wear-tear)',
      overallGrade: 'Grade B Economy',
    }
  }
];

const AIS_SECTIONS: CompareSection[] = [
  {
    title: 'AI Decision Analytics',
    icon: <Sparkles size={16} />,
    subtitle: 'Calculated algorithmic metrics from expert clusters',
    metrics: [
      { label: 'Decision Alignment Index', key: 'alignmentScore', type: 'rating', highlight: true },
      { label: 'Physical Fit Score', key: 'fitScore', type: 'score' },
      { label: 'Target Audience Profile', key: 'suitedFor' },
      { label: 'Overall Quality Class Grade', key: 'overallGrade', type: 'badge' }
    ]
  },
  {
    title: 'Tradeoff & Utility Ledger',
    icon: <Scale size={16} />,
    subtitle: 'Projected financial parameters and risk models',
    metrics: [
      { label: 'Long-Term Cost Savings', key: 'costSavings', type: 'tag' },
      { label: 'Calculated Risk Rating', key: 'riskRating', type: 'badge' },
      { label: 'Core Technical Advantage', key: 'keyAdvantage' },
      { label: 'Market Consensus Consensus', key: 'consensus' }
    ]
  }
];

type CompareMode = 'product' | 'brand' | 'creator' | 'guide' | 'ai';

export function CompareEngine() {
  const { comparedProducts = [], setComparedProducts, addToCompare } = useDashboard() || {};

  // Guard for 4-product comparison limit on any nested compare triggers
  const handleAddToCompare = (product: any) => {
    if (comparedProducts.length >= 4) {
      toast.error('You can compare up to 4 products at a time. Remove one to add another.');
      return;
    }
    if (addToCompare) {
      addToCompare(product);
    }
  };

  // ==========================================
  // STATE DEFINITIONS FOR THE COMPARE MATRIX
  // ==========================================
  const [compareMode, setCompareMode] = useState<CompareMode>('product');
  const [openSections, setOpenSections] = useState<string[]>(['Pricing', 'Brand Credentials & Trust', 'Audience Metrics & Growth', 'Guide Core Focus', 'AI Decision Analytics']);
  
  // Advanced Filter Sidebar States
  const [selectedBudget, setSelectedBudget] = useState<number>(5000);
  const [selectedAvailability, setSelectedAvailability] = useState<string>('all');
  const [dealsOnly, setDealsOnly] = useState<boolean>(false);
  const [officialStoreOnly, setOfficialStoreOnly] = useState<boolean>(false);
  const [selectedBrandSpec, setSelectedBrandSpec] = useState<string>('all');
  
  // Brand Filter States
  const [selectedBrandSegment, setSelectedBrandSegment] = useState<string>('all');
  const [selectedBrandCountry, setSelectedBrandCountry] = useState<string>('all');
  
  // Creator Filter States
  const [selectedCreatorPlatform, setSelectedCreatorPlatform] = useState<string>('all');
  const [selectedCreatorEngagement, setSelectedCreatorEngagement] = useState<string>('all');

  // Guide Filter States
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [selectedUseCase, setSelectedUseCase] = useState<string>('all');

  // AI Filter States
  const [selectedAIChoice, setSelectedAIChoice] = useState<string>('all');
  const [selectedRiskRating, setSelectedRiskRating] = useState<string>('all');

  const [isLoading, setIsLoading] = useState<boolean>(false);

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
          name: product.name || 'Product',
          image: (product.images && product.images[0]) || product.image || 'https://images.unsplash.com/photo-1707251759491-18d48607ea0c?w=400&h=400&fit=crop',
          tag: product.tag || 'Popular',
          price: product.price || 0,
          rating: product.rating || 4.5,
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
          items: mappedProducts.length > 0 ? mappedProducts : PRODUCT_ITEMS, 
          sections: PRODUCT_SECTIONS, 
          titlePrefix: 'PRODUCTS' 
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
    officialStoreOnly, selectedBrandSpec, selectedBrandSegment, selectedBrandCountry,
    selectedCreatorPlatform, selectedCreatorEngagement, selectedDifficulty, selectedUseCase,
    selectedAIChoice, selectedRiskRating
  ]);

  // Build the list of active chips dynamically
  const activeChips = useMemo(() => {
    const list: any[] = [];
    if (compareMode === 'product') {
      if (selectedBudget < 5000) {
        list.push({ id: 'budget', label: `Max Price: ৳${selectedBudget}`, onRemove: () => { setSelectedBudget(5000); triggerSoftLoading(); } });
      }
      if (selectedAvailability !== 'all') {
        list.push({ id: 'avail', label: `Availability: ${selectedAvailability}`, onRemove: () => { setSelectedAvailability('all'); triggerSoftLoading(); } });
      }
      if (dealsOnly) {
        list.push({ id: 'deals', label: `Has Deals`, onRemove: () => { setDealsOnly(false); triggerSoftLoading(); } });
      }
      if (officialStoreOnly) {
        list.push({ id: 'official', label: `Official Store Only`, onRemove: () => { setOfficialStoreOnly(false); triggerSoftLoading(); } });
      }
      if (selectedBrandSpec !== 'all') {
        list.push({ id: 'brandSpec', label: `Brand: ${selectedBrandSpec}`, onRemove: () => { setSelectedBrandSpec('all'); triggerSoftLoading(); } });
      }
    } else if (compareMode === 'brand') {
      if (selectedBrandSegment !== 'all') {
        list.push({ id: 'segment', label: `Segment: ${selectedBrandSegment}`, onRemove: () => { setSelectedBrandSegment('all'); triggerSoftLoading(); } });
      }
      if (selectedBrandCountry !== 'all') {
        list.push({ id: 'country', label: `Category Scope: ${selectedBrandCountry}`, onRemove: () => { setSelectedBrandCountry('all'); triggerSoftLoading(); } });
      }
    } else if (compareMode === 'creator') {
      if (selectedCreatorPlatform !== 'all') {
        list.push({ id: 'platform', label: `Platform: ${selectedCreatorPlatform}`, onRemove: () => { setSelectedCreatorPlatform('all'); triggerSoftLoading(); } });
      }
      if (selectedCreatorEngagement !== 'all') {
        list.push({ id: 'eng', label: `Engagement: ${selectedCreatorEngagement}`, onRemove: () => { setSelectedCreatorEngagement('all'); triggerSoftLoading(); } });
      }
    } else if (compareMode === 'guide') {
      if (selectedDifficulty !== 'all') {
        list.push({ id: 'diff', label: `Difficulty: ${selectedDifficulty}`, onRemove: () => { setSelectedDifficulty('all'); triggerSoftLoading(); } });
      }
      if (selectedUseCase !== 'all') {
        list.push({ id: 'usecase', label: `Use Case: ${selectedUseCase}`, onRemove: () => { setSelectedUseCase('all'); triggerSoftLoading(); } });
      }
    } else if (compareMode === 'ai') {
      if (selectedAIChoice !== 'all') {
        list.push({ id: 'aichoice', label: `AI Target: ${selectedAIChoice}`, onRemove: () => { setSelectedAIChoice('all'); triggerSoftLoading(); } });
      }
      if (selectedRiskRating !== 'all') {
        list.push({ id: 'risk', label: `Risk Rating: ${selectedRiskRating}`, onRemove: () => { setSelectedRiskRating('all'); triggerSoftLoading(); } });
      }
    }
    return list;
  }, [
    compareMode, selectedBudget, selectedAvailability, dealsOnly, 
    officialStoreOnly, selectedBrandSpec, selectedBrandSegment, selectedBrandCountry,
    selectedCreatorPlatform, selectedCreatorEngagement, selectedDifficulty, selectedUseCase,
    selectedAIChoice, selectedRiskRating
  ]);

  // Quick Filter Row dynamically generated based on current MODE selection
  const quickFiltersList = useMemo(() => {
    if (compareMode === 'product') {
      return [
        { id: 'best-val', label: 'Best Value', active: selectedBudget === 3000, onClick: () => { setSelectedBudget(3000); triggerSoftLoading(); } },
        { id: 'best-bud', label: 'Best Budget', active: selectedBudget === 2000, onClick: () => { setSelectedBudget(2000); triggerSoftLoading(); } },
        { id: 'premium-p', label: 'Best Premium', active: selectedBudget === 5000, onClick: () => { setSelectedBudget(5000); triggerSoftLoading(); } },
        { id: 'instock', label: 'Most Popular', active: selectedAvailability === 'In Stock', onClick: () => { setSelectedAvailability('In Stock'); triggerSoftLoading(); } },
        { id: 'deals-p', label: 'Deals Available', active: dealsOnly, onClick: () => { setDealsOnly(!dealsOnly); triggerSoftLoading(); } },
      ];
    } else if (compareMode === 'brand') {
      return [
        { id: 'top-b', label: 'Top Brands', active: selectedBrandSegment === 'legacy', onClick: () => { setSelectedBrandSegment('legacy'); triggerSoftLoading(); } },
        { id: 'fast-g', label: 'Fastest Growing', active: selectedBrandSegment === 'global', onClick: () => { setSelectedBrandSegment('global'); triggerSoftLoading(); } },
        { id: 'local-b', label: 'Verified Only', active: selectedBrandCountry === 'local', onClick: () => { setSelectedBrandCountry('local'); triggerSoftLoading(); } },
      ];
    } else if (compareMode === 'creator') {
      return [
        { id: 'trend-c', label: 'Trending Creators', active: selectedCreatorPlatform === 'Instagram', onClick: () => { setSelectedCreatorPlatform('Instagram'); triggerSoftLoading(); } },
        { id: 'verify-c', label: 'High Engagement', active: selectedCreatorEngagement === 'high', onClick: () => { setSelectedCreatorEngagement('high'); triggerSoftLoading(); } },
        { id: 'rise-c', label: 'Rising Creators', active: selectedCreatorEngagement === 'rising', onClick: () => { setSelectedCreatorEngagement('rising'); triggerSoftLoading(); } },
      ];
    } else if (compareMode === 'guide') {
      return [
        { id: 'beg-g', label: 'Beginner Friendly', active: selectedDifficulty === 'Beginner Friendly', onClick: () => { setSelectedDifficulty('Beginner Friendly'); triggerSoftLoading(); } },
        { id: 'adv-g', label: 'Expert Choices', active: selectedDifficulty === 'Advanced Collector', onClick: () => { setSelectedDifficulty('Advanced Collector'); triggerSoftLoading(); } },
        { id: 'office-g', label: 'Office Outfitting', active: selectedUseCase === 'office', onClick: () => { setSelectedUseCase('office'); triggerSoftLoading(); } },
      ];
    } else {
      return [
        { id: 'ai-rec', label: 'AI Recommended', active: selectedAIChoice === 'best-value', onClick: () => { setSelectedAIChoice('best-value'); triggerSoftLoading(); } },
        { id: 'long-term', label: 'Long-Term Value', active: selectedAIChoice === 'long-term', onClick: () => { setSelectedAIChoice('long-term'); triggerSoftLoading(); } },
        { id: 'low-risk', label: 'Risk-Free Picks', active: selectedRiskRating === 'low', onClick: () => { setSelectedRiskRating('low'); triggerSoftLoading(); } },
      ];
    }
  }, [
    compareMode, selectedBudget, selectedAvailability, dealsOnly, 
    selectedBrandSegment, selectedBrandCountry, selectedCreatorPlatform, 
    selectedCreatorEngagement, selectedDifficulty, selectedUseCase, 
    selectedAIChoice, selectedRiskRating
  ]);

  return (
    <div className="w-full bg-[#F8FAFC]">
      {/* Compare Engine Elegant Hero Section */}
      <div className="choosify-dark-gradient px-6 relative overflow-hidden text-center flex flex-col justify-center items-center py-16" style={{ minHeight: '440px' }}>
         <div className="absolute inset-0 bg-gradient-to-b from-blue-600/5 to-transparent pointer-events-none" />
         
         <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative z-10 w-full max-w-7xl"
          >
            <div className="flex items-center justify-center gap-2 mb-4">
              <span className="px-3 py-1 bg-orange-primary/10 border border-orange-primary/20 text-orange-primary text-[10px] font-black uppercase tracking-widest rounded-full flex items-center gap-1.5 animate-pulse">
                <Sparkles size={12} /> Decision-Intelligence V2 Active
              </span>
            </div>

            <h2 className="text-3xl md:text-5xl lg:text-6xl font-black text-white italic uppercase tracking-tighter leading-none mb-4">
               COMPARE <span className="text-orange-primary">ENGINE</span>
            </h2>
            <p className="text-white/40 text-[9.5px] font-black uppercase tracking-[0.25em] italic max-w-2xl mx-auto mb-10">
               State-of-the-art multi-dimensional matrix. Pivot parameters, analyze risk models, and compare verified choices.
            </p>

            {/* Smart Reactive Columns Display */}
            <div className={cn("grid grid-cols-1 gap-6 max-w-5xl mx-auto",
              evaluatedMatchingColumns.length === 1 && "md:grid-cols-1 max-w-md",
              evaluatedMatchingColumns.length === 2 && "md:grid-cols-2 max-w-3xl",
              evaluatedMatchingColumns.length === 3 && "md:grid-cols-3",
              evaluatedMatchingColumns.length >= 4 && "md:grid-cols-4 max-w-7xl"
            )}>
               {evaluatedMatchingColumns.map((p, idx) => (
                  <div key={p.id} className="relative">
                     <div className={cn(
                       "bg-[#0A0A26] border rounded-[5px] p-6 text-left group transition-all duration-300 flex flex-col justify-between h-44 relative overflow-hidden",
                       p.matchesCriteria 
                        ? p.isWinner 
                          ? "border-orange-primary shadow-lg shadow-orange-primary/10" 
                          : "border-white/10 hover:border-orange-primary/30"
                        : "border-white/5 opacity-40 grayscale"
                     )}>
                        {p.isWinner && (
                           <div className="absolute -top-1.5 right-4 bg-orange-primary text-white text-[8px] font-black px-3 py-1 rounded-b-[4px] uppercase tracking-widest z-20 shadow-md">
                              AI Winner
                           </div>
                        )}
                        {!p.matchesCriteria && (
                           <div className="absolute top-2 right-2 bg-red-500/20 text-red-400 text-[8px] font-black px-2 py-0.5 rounded-[3px] uppercase tracking-wider z-20">
                              Filtered Out
                           </div>
                        )}
                        
                        <div className="flex items-center gap-4 mb-4">
                           <div className="w-14 h-14 rounded overflow-hidden bg-white/5 border border-white/10 p-1 shrink-0 flex items-center justify-center">
                              <img src={p.image} className="w-full h-full object-cover rounded-[3px]" alt={p.name} />
                           </div>
                           <div className="min-w-0">
                              <span className="text-orange-primary text-[8px] font-black uppercase italic tracking-widest block leading-none mb-1">{p.brand}</span>
                              <h4 className="text-white text-xs font-bold italic line-clamp-2 leading-snug">{p.name}</h4>
                           </div>
                        </div>

                        <div>
                          <div className="w-full h-px bg-white/5 my-2" />
                          <p className="text-white/60 text-[10px] font-medium leading-none truncate italic">
                            💡 {p.highlightText || 'Algorithmic assessment matched.'}
                          </p>
                        </div>
                     </div>
                  </div>
               ))}
            </div>
         </motion.div>
      </div>

      {/* ==========================================
          LAYER 1: DECISION FILTER CONTROL BAR (NEW CORE LAYER)
          ========================================== */}
      <div className="w-full bg-[#05051A] border-y border-white/5 sticky top-16 z-40 select-none">
        <div className="max-w-[1440px] mx-auto px-6 py-3 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 whitespace-nowrap">DECISION PROFILE:</span>
            <div className="w-2 h-2 rounded-full bg-orange-primary animate-pulse" />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {[
              { id: 'product', label: 'Product Compare', icon: <ShoppingBag size={13} /> },
              { id: 'brand', label: 'Brand Compare', icon: <ShieldCheck size={13} /> },
              { id: 'creator', label: 'Creator Intel', icon: <Users size={13} /> },
              { id: 'guide', label: 'Buying Guides', icon: <BookOpen size={13} /> },
              { id: 'ai', label: 'AI Smart Mode', icon: <Sparkles size={13} /> }
            ].map(modeOpt => {
              const isActive = compareMode === modeOpt.id;
              return (
                <button
                  key={modeOpt.id}
                  onClick={() => {
                    setCompareMode(modeOpt.id as CompareMode);
                    triggerSoftLoading();
                  }}
                  className={cn(
                    "px-4 py-2 rounded-[5px] text-[10px] font-black uppercase tracking-wider transition-all duration-200 flex items-center gap-1.5 cursor-pointer",
                    isActive 
                      ? "bg-orange-primary text-white shadow-md shadow-orange-primary/20 scale-105" 
                      : "bg-white/5 text-white/60 border border-white/10 hover:bg-white/10 hover:text-white"
                  )}
                >
                  {modeOpt.icon}
                  <span>{modeOpt.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* QUICK FILTER BAR Short-cuts */}
      <QuickFilterBar
        title="Comparison Trait Shortcuts"
        filters={quickFiltersList}
      />

      {/* ACTIVE INTELLIGENT FILTER CHIPS */}
      <ActiveFilterChips
        chips={activeChips}
        onClearAll={handleClearAllFilters}
      />

      {/* CORE THREE-COLUMN PERFORMANCE LAYOUT */}
      <div className="max-w-[1440px] mx-auto px-6 py-8 w-full grid grid-cols-1 lg:grid-cols-[260px_minmax(0,1fr)_285px] xl:grid-cols-[300px_minmax(0,1fr)_320px] gap-6 items-start relative">
         
         {/* LEFT COLUMN: SYSTEM ADVANCED DECISION PANEL */}
         <aside className="lg:sticky lg:top-36 bg-transparent h-auto pb-10 flex flex-col gap-4">
           <FullSidebarFilterPanel
             title="Compare Scopes"
             onReset={handleClearAllFilters}
             advancedSection={
               <div className="flex flex-col gap-3">
                 <div className="bg-white border border-[#e8edf2] rounded-[5px] p-4 text-left font-sans">
                   <h4 className="text-[10px] font-extrabold text-[#8a9bb0] uppercase tracking-wider pb-1.5 border-b border-[#e8edf2] mb-3">AI Decision Matrix Rules</h4>
                   <p className="text-[10.5px] text-gray-500 font-medium leading-relaxed">
                     This sidebar directly tweaks constraints inside our matrix calculator. Dimmed columns fail to meet your custom threshold weights.
                   </p>
                 </div>
               </div>
             }
           >
             {/* CONDITIONAL SIDEBAR OPTIONS BASED ON THE ACTIVE DECISION MODE */}
             {compareMode === 'product' && (
               <div className="flex flex-col gap-4">
                 {/* 1. PRICE SLIDER */}
                 <div className="bg-white border border-[#e8edf2] rounded-[5px] p-4.5 shadow-sm text-left font-sans">
                   <div className="flex justify-between items-center mb-2">
                     <span className="text-[11px] font-semibold text-[#8a9bb0] uppercase tracking-wider">Max Budget</span>
                     <span className="text-xs font-bold text-orange-primary">৳{selectedBudget.toLocaleString()}</span>
                   </div>
                   <input
                     type="range"
                     min="1500"
                     max="5000"
                     step="100"
                     value={selectedBudget}
                     onChange={(e) => { setSelectedBudget(Number(e.target.value)); triggerSoftLoading(); }}
                     className="w-full accent-orange-primary cursor-pointer"
                   />
                   <div className="flex justify-between text-[9px] text-gray-400 font-bold mt-1">
                     <span>৳1,500</span>
                     <span>৳5,000</span>
                   </div>
                 </div>

                 {/* 2. AVAILABILITY SWITCH */}
                 <div className="bg-white border border-[#e8edf2] rounded-[5px] p-4.5 shadow-sm text-left font-sans">
                   <h3 className="text-[11px] font-semibold text-[#8a9bb0] uppercase tracking-wider pb-2 border-b border-[#e8edf2] mb-3">Availability</h3>
                   <div className="space-y-1">
                     {['all', 'In Stock', 'Limited'].map((opt) => (
                       <button
                         key={opt}
                         type="button"
                         onClick={() => { setSelectedAvailability(opt); triggerSoftLoading(); }}
                         className={cn(
                           "w-full flex items-center justify-between text-left px-2 py-1 rounded-[4px] transition-colors text-xs font-semibold cursor-pointer",
                           selectedAvailability === opt ? "bg-[#FFF0E8] text-orange-primary font-bold" : "text-gray-500 hover:bg-gray-50 hover:text-[#1A1D4E]"
                         )}
                       >
                         <span className="capitalize">{opt === 'all' ? 'Show All Stocks' : opt}</span>
                         {selectedAvailability === opt && <CheckCircle2 size={11} className="text-orange-primary shrink-0" />}
                       </button>
                     ))}
                   </div>
                 </div>

                 {/* 3. VERIFIED BOOTSTRAPS */}
                 <div className="bg-white border border-[#e8edf2] rounded-[5px] p-4.5 shadow-sm text-left font-sans">
                   <h3 className="text-[11px] font-semibold text-[#8a9bb0] uppercase tracking-wider pb-2 border-b border-[#e8edf2] mb-3">Direct Outlets</h3>
                   <div className="space-y-3.5 mt-2">
                     <label className="flex items-center gap-2.5 text-xs text-navy font-semibold cursor-pointer select-none">
                       <input
                         type="checkbox"
                         checked={dealsOnly}
                         onChange={(e) => { setDealsOnly(e.target.checked); triggerSoftLoading(); }}
                         className="rounded text-orange-primary accent-orange-primary w-4 h-4"
                       />
                       <span>Has Live Promo Deal</span>
                     </label>

                     <label className="flex items-center gap-2.5 text-xs text-navy font-semibold cursor-pointer select-none">
                       <input
                         type="checkbox"
                         checked={officialStoreOnly}
                         onChange={(e) => { setOfficialStoreOnly(e.target.checked); triggerSoftLoading(); }}
                         className="rounded text-orange-primary accent-orange-primary w-4 h-4"
                       />
                       <span>Official Store Agent</span>
                     </label>
                   </div>
                 </div>

                 {/* 4. SPECIFIC BRAND MATCHING */}
                 <div className="bg-white border border-[#e8edf2] rounded-[5px] p-4.5 shadow-sm text-left font-sans">
                   <h3 className="text-[11px] font-semibold text-[#8a9bb0] uppercase tracking-wider pb-2 border-b border-[#e8edf2] mb-3">Origin Manufacturer</h3>
                   <div className="space-y-1">
                     {['all', 'Sailor', 'Yellow', 'Infinity'].map((br) => (
                       <button
                         key={br}
                         type="button"
                         onClick={() => { setSelectedBrandSpec(br); triggerSoftLoading(); }}
                         className={cn(
                           "w-full flex items-center justify-between text-left px-2 py-1 rounded-[4px] transition-colors text-xs font-semibold cursor-pointer",
                           selectedBrandSpec === br ? "bg-[#FFF0E8] text-orange-primary font-bold" : "text-gray-500 hover:bg-gray-50 hover:text-[#1A1D4E]"
                         )}
                       >
                         <span>{br === 'all' ? 'All Brands' : br}</span>
                         {selectedBrandSpec === br && <CheckCircle2 size={11} className="text-orange-primary shrink-0" />}
                       </button>
                     ))}
                   </div>
                 </div>
               </div>
             )}

             {compareMode === 'brand' && (
               <div className="flex flex-col gap-4">
                 {/* BRAND SEGMENT */}
                 <div className="bg-white border border-[#e8edf2] rounded-[5px] p-4.5 shadow-sm text-left font-sans">
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
                 <div className="bg-white border border-[#e8edf2] rounded-[5px] p-4.5 shadow-sm text-left font-sans">
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
                 <div className="bg-white border border-[#e8edf2] rounded-[5px] p-4.5 shadow-sm text-left font-sans">
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
                 <div className="bg-white border border-[#e8edf2] rounded-[5px] p-4.5 shadow-sm text-left font-sans">
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
                 <div className="bg-white border border-[#e8edf2] rounded-[5px] p-4.5 shadow-sm text-left font-sans">
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
                 <div className="bg-white border border-[#e8edf2] rounded-[5px] p-4.5 shadow-sm text-left font-sans">
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
                 <div className="bg-white border border-[#e8edf2] rounded-[5px] p-4.5 shadow-sm text-left font-sans">
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
                 <div className="bg-white border border-[#e8edf2] rounded-[5px] p-4.5 shadow-sm text-left font-sans">
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

         {/* MIDDLE COLUMN: COMPARATIVE CORE (Side-by-side matrices table) */}
         <div className="space-y-6 relative">
            
            {isLoading && (
              <div className="absolute inset-0 bg-white/70 backdrop-blur-[1px] z-50 flex items-center justify-center rounded-[32px] h-96">
                <div className="flex flex-col items-center gap-2">
                  <div className="w-8 h-8 rounded-full border-2 border-orange-primary border-t-transparent animate-spin" />
                  <span className="text-xs font-black text-navy uppercase tracking-wider italic">Re-calculating Tradeoffs...</span>
                </div>
              </div>
            )}

            {compareMode === 'product' && comparedProducts.length === 0 ? (
               <div className="choosify-dark-gradient border border-white/10 rounded-[15px] p-12 text-center flex flex-col items-center justify-center min-h-[400px] shadow-2xl relative overflow-hidden">
                 <div className="relative z-10 flex flex-col items-center">
                   <div className="w-16 h-16 rounded-full bg-orange-primary/15 border border-orange-primary/25 flex items-center justify-center text-orange-primary mb-6 animate-pulse">
                     <Layers size={32} />
                   </div>
                   <h3 className="text-2xl font-black text-white uppercase tracking-tight italic mb-2">No products to compare</h3>
                   <p className="text-white/60 text-xs max-w-md mb-8 leading-relaxed font-sans">
                     Add products to compare by clicking 'Add to Compare' on any product
                   </p>
                   <Link 
                     to="/products"
                     className="px-8 py-3 bg-orange-primary hover:bg-orange-600 text-white text-xs font-black uppercase tracking-widest rounded-full transition-all duration-300 shadow-lg shadow-orange-primary/20 hover:scale-[1.03] active:scale-95 cursor-pointer leading-none inline-block border-none animate-bounce"
                   >
                     Browse Products
                   </Link>
                 </div>
               </div>
            ) : (
            <div className="bg-white rounded-[15px] shadow-[0_10px_40px_rgba(0,0,0,0.03)] border border-gray-100 overflow-hidden">
               
               {/* Metadata Header with active columns */}
               <div className="overflow-x-auto no-scrollbar">
                  <div className="min-w-[700px] grid grid-cols-[1.5fr_2.5fr] gap-px bg-gray-100">
                     <div className="bg-[#FAF9F5]/70 p-6 flex flex-col justify-center relative">
                        <span className="text-[10px] font-black text-orange-primary uppercase tracking-widest block leading-none mb-1.5">{titlePrefix} CONTEXT</span>
                        <div className="flex items-center justify-between">
                           <h3 className="text-lg font-black text-navy italic uppercase leading-none">Decision Matrix</h3>
                           {compareMode === 'product' && comparedProducts.length > 0 && setComparedProducts && (
                              <button 
                                onClick={() => setComparedProducts([])}
                                className="text-[10px] font-black uppercase tracking-wider text-red-400 hover:text-red-600 border border-red-200 hover:border-red-400 px-3 py-1.5 rounded-lg transition-colors cursor-pointer border bg-transparent"
                              >
                                Clear All
                              </button>
                           )}
                           {(compareMode === 'creator' || compareMode === 'guide') && setComparedProducts && (
                              <button
                                onClick={() => setComparedProducts([])}
                                className="text-[10px] font-black uppercase tracking-wider text-red-400 hover:text-red-600 border border-red-200 hover:border-red-400 px-3 py-1.5 rounded-lg transition-colors"
                              >
                                Clear All
                              </button>
                           )}
                        </div>
                        <p className="text-[8.5px] font-bold text-gray-400 uppercase tracking-widest italic mt-1 leading-normal">Side-by-side parameters breakdown</p>
                     </div>
                     
                     <div className={cn("bg-white grid divide-x divide-gray-100",
                        evaluatedMatchingColumns.length === 1 && "grid-cols-1",
                        evaluatedMatchingColumns.length === 2 && "grid-cols-2",
                        evaluatedMatchingColumns.length === 3 && "grid-cols-3",
                        evaluatedMatchingColumns.length >= 4 && "grid-cols-4"
                     )}>
                        {evaluatedMatchingColumns.map((p) => (
                           <div 
                             key={p.id} 
                             className={cn(
                               "p-5 flex flex-col items-center text-center relative transition-all duration-300",
                               p.matchesCriteria 
                                ? p.isWinner 
                                  ? "bg-orange-primary/5 shadow-inner" 
                                  : "bg-white" 
                                : "opacity-35 grayscale scale-95"
                             )}
                           >
                              {/* Add Remove button for product mode */}
                              {compareMode === 'product' && setComparedProducts && (
                                <button
                                  onClick={() => setComparedProducts((prev: any[]) => prev.filter((prod: any) => String(prod.id) !== String(p.id)))}
                                  className="absolute top-2 right-2 w-5 h-5 bg-red-100 text-red-500 rounded-full flex items-center justify-center text-[10px] font-black hover:bg-red-500 hover:text-white transition-colors cursor-pointer border-none"
                                >
                                  ×
                                </button>
                              )}
                              {(compareMode === 'creator' || compareMode === 'guide') && setComparedProducts && (
                                <button
                                  onClick={() => setComparedProducts((prev: any[]) => prev.filter((item: any) => String(item.id) !== String(p.id)))}
                                  className="absolute top-2 right-2 w-5 h-5 bg-red-100 text-red-500 rounded-full flex items-center justify-center text-[10px] font-black hover:bg-red-500 hover:text-white transition-colors cursor-pointer"
                                >
                                  ×
                                </button>
                              )}
                              {p.matchesCriteria && p.isWinner && (
                                <div className="absolute top-2 left-2 flex items-center gap-1 bg-[#10B981] text-white text-[7px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded-[3px] shadow-xs">
                                  <Trophy size={8} /> Selected Option
                                </div>
                              )}
                              
                              <div className="w-10 h-10 mb-3 rounded shadow-xs overflow-hidden border border-gray-100 p-0.5 bg-white">
                                 <img src={p.image} className="w-full h-full object-cover rounded" alt={p.name} />
                              </div>
                              <span className="text-[7.5px] font-black text-gray-300 uppercase tracking-widest italic mb-0.5 leading-none">Category Target</span>
                              <h4 className="text-[11px] font-black text-navy italic uppercase leading-tight line-clamp-1 mb-2">{p.name}</h4>
                              
                              <div className="flex items-center gap-1 mb-3">
                                 <div className="flex items-center gap-0.5">
                                    {[1, 2, 3, 4, 5].map(s => (
                                       <Star key={s} size={9} className={s <= Math.floor(p.rating) ? "text-[#FFD700] fill-current" : "text-gray-100"} />
                                    ))}
                                 </div>
                                 <span className="text-[9px] font-black text-navy italic leading-none">{p.rating}</span>
                              </div>

                              <button className={cn(
                                 "w-full py-1.5 rounded-[5px] text-[8.5px] font-black uppercase tracking-widest italic transition-all",
                                 p.matchesCriteria 
                                   ? p.isWinner 
                                     ? "bg-[#059669] text-white hover:bg-[#047857]" 
                                     : "bg-orange-primary text-white hover:bg-orange-600"
                                   : "bg-gray-100 text-gray-400 cursor-not-allowed"
                              )}>
                                 Explore <ArrowRight size={10} className="inline ml-1" />
                              </button>
                           </div>
                        ))}
                     </div>
                  </div>
               </div>

               {/* Sections Accordion Matrices Row */}
               <div className="divide-y divide-gray-100">
                  {sections.map((section) => (
                     <div key={section.title} className="bg-white">
                        <button 
                          onClick={() => toggleSection(section.title)}
                          className="w-full px-6 py-5 flex items-center justify-between group hover:bg-gray-50/50 transition-colors"
                        >
                           <div className="flex items-center gap-4">
                              <span className="text-orange-primary group-hover:scale-105 transition-transform shrink-0">
                                 {section.icon}
                              </span>
                              <div className="text-left">
                                 <h4 className="text-sm font-black text-navy uppercase italic tracking-tighter leading-none">{section.title}</h4>
                                 <p className="text-[9px] font-bold text-gray-400 italic mt-0.5">{section.subtitle}</p>
                              </div>
                           </div>
                           {openSections.includes(section.title) ? <ChevronUp size={16} className="text-gray-300" /> : <ChevronDown size={16} className="text-gray-300" />}
                        </button>

                        <AnimatePresence>
                           {openSections.includes(section.title) && (
                              <motion.div 
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                className="overflow-hidden bg-[#FAF9F5]/20"
                              >
                                 <div className="divide-y divide-gray-100 overflow-x-auto no-scrollbar">
                                    {section.metrics.map((metric, midx) => (
                                       <div key={midx} className="min-w-[700px] grid grid-cols-[1.5fr_2.5fr] gap-px bg-gray-100">
                                          <div className="bg-white p-6 flex flex-col justify-center">
                                             <h5 className="text-[11px] font-black text-navy uppercase italic tracking-tighter leading-tight">{metric.label}</h5>
                                             {metric.subLabel && <p className="text-[8.5px] font-bold text-gray-400 italic mt-0.5 leading-relaxed">{metric.subLabel}</p>}
                                          </div>
                                          
                                          <div className={cn("bg-white grid divide-x divide-gray-100",
                                             evaluatedMatchingColumns.length === 1 && "grid-cols-1",
                                             evaluatedMatchingColumns.length === 2 && "grid-cols-2",
                                             evaluatedMatchingColumns.length === 3 && "grid-cols-3",
                                             evaluatedMatchingColumns.length >= 4 && "grid-cols-4"
                                          )}>
                                             {evaluatedMatchingColumns.map((p, vidx) => {
                                                const val = p.specs[metric.key] || 'N/A';
                                                
                                                return (
                                                  <div 
                                                    key={vidx} 
                                                    className={cn(
                                                      "p-6 flex items-center justify-center text-center transition-all duration-300",
                                                      p.matchesCriteria ? "" : "opacity-35 grayscale"
                                                    )}
                                                  >
                                                     {metric.type === 'rating' ? (
                                                        <div className="flex flex-col items-center gap-1">
                                                           <span className="text-xs font-black text-navy italic">{val}</span>
                                                           <div className="flex items-center gap-0.5">
                                                              {[1, 2, 3, 4, 5].map(s => (
                                                                 <Star key={s} size={8} className="text-[#FFD700] fill-current" />
                                                              ))}
                                                           </div>
                                                        </div>
                                                     ) : metric.type === 'score' ? (
                                                        <div className="flex flex-col items-center gap-1.5 w-full max-w-[100px]">
                                                           <span className="text-xs font-black text-navy italic">{val}</span>
                                                           <div className="w-full h-1 bg-gray-150 rounded-full overflow-hidden">
                                                              <div className="h-full bg-[#10B981]" style={{ width: `${parseInt(val) || 85}%` }} />
                                                           </div>
                                                        </div>
                                                     ) : metric.type === 'badge' ? (
                                                        <span className={cn(
                                                           "px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest italic",
                                                           ['Excellent', 'Legacy Brand', 'Best-Sited', 'Smart Choice', 'Beginner Friendly', 'Verified Official'].includes(val)
                                                             ? "bg-green-100 text-green-700" 
                                                             : "bg-orange-100 text-[#E8500A]"
                                                        )}>
                                                           {val}
                                                        </span>
                                                     ) : metric.type === 'tag' ? (
                                                        <span className="text-[9px] font-black text-orange-primary uppercase italic underline decoration-1.5 underline-offset-3">
                                                           {val}
                                                        </span>
                                                     ) : (
                                                        <span className={cn(
                                                           "text-xs font-bold text-navy italic opacity-85",
                                                           metric.highlight && "text-sm font-black opacity-100 text-orange-primary"
                                                        )}>
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
                  ))}
               </div>

               {/* Dynamic Global Verdict Section */}
               <div className="choosify-dark-gradient p-6 md:p-8 text-center md:text-left flex flex-col md:flex-row items-center gap-6 md:gap-8 border-t border-white/5">
                   <div className="w-12 h-12 rounded-full bg-orange-primary/15 flex items-center justify-center text-orange-primary shrink-0 border border-orange-primary/20">
                      <Trophy size={20} />
                   </div>
                   <div className="flex-1">
                      <h3 className="text-base font-black text-white italic uppercase tracking-tighter leading-none mb-2">Discovery Verdict</h3>
                      <p className="text-white/40 text-[11px] font-medium italic leading-relaxed max-w-xl">
                         {compareMode === 'product' && "Sailor Ultra Cotton Pro secures the top choice on premium fabric longevity. Infinity leads purely on entry-level budget segments."}
                         {compareMode === 'brand' && "Aarong demonstrates optimal ecosystem authority within Bangladesh metrics. Yellow targets fast adaptation to international fashion lines."}
                         {compareMode === 'creator' && "Nafis Anjum provides stable tech buyer credibility over extreme viral reaches. Tasnim stands as prime style matching authority."}
                         {compareMode === 'guide' && "Smart Wardrobe Guidelines covers extensive checklist architectures for professionals. Winter/Summer focuses on micro-seasons."}
                         {compareMode === 'ai' && "Optimal Value Package matches user search indices perfectly at high durability. Frugal provides zero upfront cash friction."}
                      </p>
                   </div>
                   <div className="w-full md:w-auto bg-white/5 border border-white/10 rounded-[5px] p-4 flex flex-col items-center">
                      <span className="text-[8px] font-black text-white/40 uppercase tracking-widest italic mb-1">Recommended Index</span>
                      <span className="text-base font-black text-orange-primary italic leading-none uppercase">
                         {compareMode === 'product' && "SAILOR COTTON"}
                         {compareMode === 'brand' && "AARONG"}
                         {compareMode === 'creator' && "NAFIS ANJUM"}
                         {compareMode === 'guide' && "スマート BIND"}
                         {compareMode === 'ai' && "OPTIMAL BUNDLE"}
                      </span>
                   </div>
               </div>
            </div>
         )}
         </div>

         {/* RIGHT COLUMN: DECISION INSIGHTS / AI ADVISOR */}
         <aside className="lg:sticky lg:top-36 flex flex-col gap-4">
            
            {/* 1. DECISION COGNITIVE ASSISTANT CARD */}
            <div className="choosify-dark-gradient rounded-[5px] border border-white/5 p-5 text-left relative overflow-hidden shadow-md">
              <div className="absolute top-0 right-0 p-3 text-orange-primary opacity-25">
                <Sparkles size={18} />
              </div>

               <div className="flex items-center gap-2 mb-3">
                  <Activity size={14} className="text-orange-primary" />
                  <span className="text-[9.5px] font-black text-orange-primary uppercase tracking-widest italic">AI Tradeoff Engine</span>
               </div>
               
               <h4 className="text-xs font-black text-white uppercase italic tracking-tighter leading-snug mb-3">
                  {compareMode === 'product' && 'Sailor vs Yellow Ecosystem'}
                  {compareMode === 'brand' && 'Aarong vs Yellow Positioning'}
                  {compareMode === 'creator' && 'Nafis vs Tasnim Target Match'}
                  {compareMode === 'guide' && 'Capsule vs Traditional Use Cases'}
                  {compareMode === 'ai' && 'Value vs Longevity Cost Matrix'}
               </h4>

               <div className="space-y-3.5 text-[11px] text-white/70 font-medium leading-relaxed font-sans">
                  {compareMode === 'product' && (
                    <>
                      <div className="p-3 bg-white/5 rounded border border-white/5">
                        <span className="text-orange-primary font-bold block mb-1">💡 Ecosystem alignment suggestion:</span>
                        We detected matching price tiers between Sailor and Yellow. We advise focusing on material resiliency index.
                      </div>
                      <p className="text-white/40 text-[9.5px]">
                        *Calculated using 520 recent local verified merchant data sheets.
                      </p>
                    </>
                  )}

                  {compareMode === 'brand' && (
                    <>
                      <div className="p-3 bg-white/5 rounded border border-white/5">
                        <span className="text-orange-primary font-bold block mb-1">💡 Trust index priority alignment:</span>
                        Aarong holds standard elite legacy prestige. Yellow covers rapid trend updates. Target Aarong for handloom authenticity, Yellow for formal contemporary models.
                      </div>
                    </>
                  )}

                  {compareMode === 'creator' && (
                    <>
                      <div className="p-3 bg-white/5 rounded border border-white/5">
                        <span className="text-orange-primary font-bold block mb-1">💡 Engagement vs Reach Ledger:</span>
                        Nafis holds stronger conversion indices on hardware specs, while Tasnim provides premier aesthetic context-matching options.
                      </div>
                    </>
                  )}

                  {compareMode === 'guide' && (
                    <>
                      <div className="p-3 bg-white/5 rounded border border-white/5">
                        <span className="text-orange-primary font-bold block mb-1">💡 Capsule Integration:</span>
                        Capsule guidelines save estimated ৳15k yearly on impulse buys by enforcing matching outfit formulas.
                      </div>
                    </>
                  )}

                  {compareMode === 'ai' && (
                    <>
                      <div className="p-3 bg-white/5 rounded border border-white/5">
                        <span className="text-orange-primary font-bold block mb-1">💡 Risk Optimization Ledger:</span>
                        Optimal value package optimizes upfront cost amortized over 12 months. Excellent low risk rating.
                      </div>
                    </>
                  )}
               </div>
            </div>

            {/* 2. SAVED COMPARISONS LOGS */}
            <div className="bg-white border border-[#e8edf2] rounded-[5px] p-4.5 shadow-sm text-left">
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
                          <span className="text-xs font-black text-navy uppercase italic group-hover:text-orange-primary transition-colors block leading-tight">{comp.label}</span>
                          <span className="text-[8.5px] font-bold text-gray-400 uppercase italic mt-0.5 block">{comp.date}</span>
                       </div>
                       <span className="px-2 py-0.5 bg-[#D6E1EC]/30 text-navy/70 text-[8.5px] font-black rounded-full leading-none">{comp.count}</span>
                    </div>
                 ))}
              </div>
            </div>

            {/* 3. SHARE LINK GENERATION */}
            <div className="bg-white border border-[#e8edf2] rounded-[5px] p-4.5 shadow-sm text-left font-sans">
               <h4 className="text-[10px] font-extrabold text-[#8a9bb0] uppercase tracking-wider leading-none mb-3">Share Comparison Matrix</h4>
               <p className="text-[10px] text-gray-400 font-medium leading-relaxed mb-3">
                 Export these active filters and parameters into a standalone share link.
               </p>
               <button className="w-full py-2 bg-orange-primary/5 hover:bg-orange-primary/10 border border-orange-primary/20 text-orange-primary rounded-[4px] text-[10px] font-black uppercase tracking-widest italic flex items-center justify-center gap-1.5 transition-all cursor-pointer">
                  <Share2 size={11} /> Generate Shareable Slug
               </button>
            </div>
         </aside>

      </div>

      {/* Dynamic Community Verdict Accordion */}
      <div className="max-w-7xl mx-auto px-6 pb-24">
        <div className="bg-white rounded-[15px] border border-gray-150 p-6 md:p-8 text-left shadow-xs">
           <h4 className="text-xs font-black text-navy uppercase italic tracking-widest mb-6 block border-b border-gray-100 pb-3">Community Opinion & Verified Buyer Consensus</h4>
           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { name: 'Sabbir Ahmed', role: 'Verified Buyer', quote: 'The materials here hold unique premium density. Highly recommended long-term staple.', avatar: 'https://i.pravatar.cc/150?u=sabbir' },
                { name: 'Runa Laila', role: 'Premium Critic', quote: 'Stitching alignment is extremely responsive. Matches precise capsule styling charts.', avatar: 'https://i.pravatar.cc/150?u=runa' },
                { name: 'Anisul Hoque', role: 'Comfort Enthusiast', quote: 'Outstanding value-for-money parameter alignment. Bypasses premium markup entirely.', avatar: 'https://i.pravatar.cc/150?u=anis' }
              ].map((verdict, idx) => (
                <div key={idx} className="bg-gray-50/50 p-5 rounded-[5px] border border-gray-150 relative">
                   <p className="text-[11.5px] font-semibold text-navy italic leading-relaxed opacity-80 mb-4">
                      "{verdict.quote}"
                   </p>
                   <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-full bg-gray-100 overflow-hidden">
                         <img src={verdict.avatar} className="w-full h-full object-cover" alt="Avatar" />
                      </div>
                      <div>
                         <span className="text-[9.5px] font-black text-navy uppercase italic block leading-none">{verdict.name}</span>
                         <span className="text-[7.5px] font-bold text-[#E8500A] uppercase tracking-tighter italic mt-0.5 block leading-none">{verdict.role}</span>
                      </div>
                   </div>
                </div>
              ))}
           </div>
        </div>
      </div>
    </div>
  );
}
