import React from 'react';
import {
  CreditCard,
  Star,
  Layers,
  Truck,
  ShieldCheck,
  Scale,
  Users,
  Activity,
  BookOpen,
  Sparkles,
} from 'lucide-react';

// ==========================================
// TYPE & INTERFACE DEFINITIONS FOR ADVANCED COMPARISONS
// ==========================================
export interface ComparisonItem {
  id: string;
  brand: string;
  name: string;
  image: string;
  tag: string;
  price?: number;
  rating: number;
  isWinner?: boolean;
  score?: number;
  category?: string;
  highlightText?: string;
  specs: Record<string, any>;
}

export interface MetricRow {
  label: string;
  subLabel?: string;
  key: string;
  type?: 'text' | 'rating' | 'score' | 'tag' | 'badge';
  highlight?: boolean;
}

export interface CompareSection {
  title: string;
  icon: React.ReactNode;
  subtitle: string;
  metrics: MetricRow[];
}

// ==========================================
// MOCK DATASETS FOR DIFFERENT COMPARATIVE CONTEXTS
// ==========================================

// 1. PRODUCT COMPARISON BASE DATA
export const PRODUCT_ITEMS: ComparisonItem[] = [
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

export const PRODUCT_SECTIONS: CompareSection[] = [
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
export const BRAND_ITEMS: ComparisonItem[] = [
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

export const BRAND_SECTIONS: CompareSection[] = [
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
export const CREATOR_ITEMS: ComparisonItem[] = [
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

export const CREATOR_SECTIONS: CompareSection[] = [
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
export const GUIDE_ITEMS: ComparisonItem[] = [
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

export const GUIDE_SECTIONS: CompareSection[] = [
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
export const AIS_ITEMS: ComparisonItem[] = [
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

export const AIS_SECTIONS: CompareSection[] = [
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

export type CompareMode = 'product' | 'brand' | 'creator' | 'guide' | 'ai';
