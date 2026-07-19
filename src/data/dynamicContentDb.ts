import { PRODUCTS } from '../constants';
import { 
  Smartphone, Cpu, Camera, ShieldCheck, TrendingUp, 
  Flame, Zap, Shield, Sparkles, Clock, Award, Headphones
} from 'lucide-react';

export interface EditorialContent {
  id: string;
  type: string;
  badgeBg: string;
  title: string;
  subtitle: string;
  coverImage: string;
  author: {
    name: string;
    avatar: string;
    verified: boolean;
    role: string;
    bio: string;
  };
  date: string;
  readTime: string;
  views: string;
  rating: number;
  reviews: string;
  videoUrl?: string;
  duration?: string;
  overallWinner?: {
    product: string;
    badge: string;
    image: string;
    rating: number;
    reviewsCount: string;
    score: number;
    scoreLabel: string;
    highlights: string[];
  };
  takeaways: { icon: any; text: string }[];
  verdict: {
    buyIf: string;
    considerIf: string;
    notForYouIf: string;
    overall: string;
    summary: string;
    chips: string[];
  };
  evaluations: {
    id: string;
    title: string;
    score: number;
    content: string;
  }[];
  faqs: {
    question: string;
    answer: string;
  }[];
  relatedProducts?: typeof PRODUCTS;
  relatedGuides: {
    id: string;
    cover: string;
    title: string;
    category: string;
    readTime: string;
    views: string;
    badgeClass: string;
  }[];
  tags: string[];
  campaignBlock?: {
    sponsorName: string;
    sponsorLogo?: string;
    discountAmount: string;
    voucherCode: string;
    durationDays: number;
    ctaLink: string;
    ctaText: string;
  };
  creatorReview?: {
    score: number;
    scoreLabel: string;
    pros: string[];
    cons: string[];
    verdict: string;
  };
  comparisonGuide?: {
    productA: {
      name: string;
      image: string;
      score: number;
      price: string;
      specs: string[];
    };
    productB: {
      name: string;
      image: string;
      score: number;
      price: string;
      specs: string[];
    };
    comparisonVerdict: string;
  };
  videoChapters?: {
    time: string;
    title: string;
    description: string;
  }[];
  priceStores?: Array<{
    name: string;
    price: string;
    delivery: string;
    isBest?: boolean;
    rating: number;
    link: string;
  }>;
  isLiveShopping?: boolean;
  liveState?: 'LIVE NOW' | 'UPCOMING' | 'REPLAY';
  platform?: string;
  viewerCount?: number;
  brand?: string;
  scheduledDate?: string;
  scheduledTime?: string;
  topicsCovered?: string[];
  productsMentioned?: typeof PRODUCTS;
}

export const DYNAMIC_CONTENT_DB: Record<string, EditorialContent> = {
  // Guide 1: Top 10 Smartphones to Buy in 2026 (MOBILE)
  '1': {
    id: '1',
    type: 'BUYING GUIDE',
    badgeBg: 'bg-[#EB4501]',
    title: 'Top 10 Smartphones to Buy in 2026',
    subtitle: 'Find the absolute best value-for-money and powerhouse smartphones currently available in the Bangladeshi market, from high-end titanium giants to midrange budget-friendly kings.',
    coverImage: 'https://images.unsplash.com/photo-1556656793-062ff9f1b74b?w=1200&h=800&fit=crop',
    author: {
      name: 'Farhan Rafiq',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop',
      verified: true,
      role: 'Chief Tech Editor',
      bio: 'Over a decade of hands-on experience reviewing smartphones and gadgets. Dedicated to helping tech buyers in Bangladesh make smart purchasing decisions.'
    },
    date: 'May 12, 2026',
    readTime: '15 MIN READ',
    views: '125K',
    rating: 4.8,
    reviews: '24K',
    overallWinner: {
      product: 'Samsung Galaxy S24 Ultra',
      badge: 'BEST FLAGSHIP PHONE',
      image: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=400&h=400&fit=crop',
      rating: 4.8,
      reviewsCount: '13.4K reviews',
      score: 9.4,
      scoreLabel: 'EXCELLENT',
      highlights: [
        'Premium Anti-Reflective Display',
        'Top Tier Snapdragon 8 Gen 3 for Galaxy',
        '200MP Quad-Camera Suite with 5x Optical',
        '7 Years of Promised Software Support'
      ]
    },
    takeaways: [
      { icon: Smartphone, text: 'Anti-reflective display technology remains a unique, unmatched feature in direct outdoor viewing.' },
      { icon: Cpu, text: 'Day-to-day multitasking and high-frame rate gaming are handled flawlessly without heating.' },
      { icon: Camera, text: 'Highly optimized zoom cameras offer professional-level photo versatility from 1x to 100x.' },
      { icon: ShieldCheck, text: 'Samsung’s 7-year update guarantee ensures long-term security and exceptional resale value.' },
      { icon: TrendingUp, text: 'Recent local price drops make it an outstanding value compared to other premium flagships.' }
    ],
    verdict: {
      buyIf: 'You want a flat-screen powerhouse device with a built-in stylus, elite battery, and superior outdoor viewability.',
      considerIf: 'You can source a verified brand-new box unit at local market discounts.',
      notForYouIf: 'You have smaller hands, prefer ultra-lightweight devices, or require 100W+ flash charging.',
      overall: 'The Galaxy S24 Ultra is the smartest hardware and software investment in 2026.',
      summary: 'Samsung’s flagship has matured beautifully. Price adjustments have made its professional titanium build, robust battery endurance, and spectacular screen clarity accessible to discerning shoppers in Bangladesh.',
      chips: ['Gorilla Glass Armor', 'Built-in S-Pen', 'Superb Zoom range', '2-Day Battery Life', 'High Resale Value']
    },
    evaluations: [
      { id: 'screen', title: 'Anti-Reflective display & viewing contrast', score: 9.8, content: 'Outdoor viewing is incredible. Gorilla Armor glass cuts glare and reflections by up to 75%, making the contrast outdoors look sharp like ink on paper.' },
      { id: 'performance', title: 'Processor & Sustained Gaming Frame Rates', score: 9.5, content: 'The Snapdragon 8 Gen 3 runs at absolute maximum frame rates in demanding titles like Warzone Mobile. Thermal dissipation is managed extremely well.' },
      { id: 'battery', title: 'Battery Life & 45W Charging Efficiency', score: 9.2, content: 'Under dual-SIM 4G/5G usage, the 5000mAh battery easily sails past 8 hours of active screen time, leaving over 30% battery by bedtime.' }
    ],
    faqs: [
      { question: 'Is the S24 Ultra still worth buying in late 2026?', answer: 'Yes, because of its 7-year update cycle and premium build, combined with significant price reductions from its launch MSRP.' },
      { question: 'Does putting a tempered glass ruin the anti-reflection?', answer: 'Yes. Putting a generic glossy tempered glass will negate the anti-reflective coating. Use official anti-reflection films instead.' }
    ],
    relatedProducts: PRODUCTS.slice(0, 3),
    relatedGuides: [
      { id: '3', cover: 'https://images.unsplash.com/photo-1707251759491-18d48607ea0c?w=1200&h=675&fit=crop', title: 'Is the S24 Ultra Still Worth It in Late 2026?', category: 'MOBILE', readTime: '12 MIN VIDEO', views: '540K', badgeClass: 'bg-[#EB4501]' },
      { id: '6', cover: 'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=800&h=450&fit=crop', title: 'Playstation 5 Pro Review: Worth the upgrade?', category: 'GAMING', readTime: '15 MIN VIDEO', views: '1.2M', badgeClass: 'bg-[#EB4501]' }
    ],
    tags: ['Best flagships BD', 'S24 Ultra local price', 'Top smartphones 2026', 'Samsung vs iPhone Dhaka'],
    priceStores: [
      { name: 'Daraz BD', price: '৳143,500', delivery: 'Free · 2-3 Days', isBest: true, rating: 4.8, link: 'https://daraz.com.bd' },
      { name: 'Pickaboo', price: '৳145,000', delivery: '৳150 · 1-2 Days', rating: 4.9, link: 'https://pickaboo.com' },
      { name: 'Gadget & Gear', price: '৳148,000', delivery: 'Free · Instant Store Pickup', rating: 5.0, link: 'https://gadgetandgear.com' }
    ]
  },

  // Guide 2: TOP 10 SMARTPHONES TO BUY IN 2026 (REELS) - MOBILE
  '2': {
    id: '2',
    type: 'REELS',
    badgeBg: 'bg-[#10B981]',
    title: 'TOP 10 SMARTPHONES TO BUY IN 2026',
    subtitle: 'Nusrat reviews the top 10 phones to buy in 2026 in a quick, highly interactive short video format, discussing price to performance kings.',
    coverImage: 'https://images.unsplash.com/photo-1556656793-062ff9f1b74b?w=600&h=1000&fit=crop',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-young-man-wearing-virtual-reality-glasses-4384-large.mp4',
    duration: '8:10',
    author: {
      name: 'Farhan Bin Rafiq',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop',
      verified: true,
      role: 'Tech & Lifestyle Vlogger',
      bio: 'Dhaka-based tech creator specializing in quick vertical reviews and buying tips for local shoppers.'
    },
    date: 'May 17, 2026',
    readTime: 'REELS VIDEO',
    views: '4.2M',
    rating: 4.9,
    reviews: '250K',
    overallWinner: {
      product: 'Samsung Galaxy S24 Ultra',
      badge: 'BEST HIGH-END OPTION',
      image: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=400&h=400&fit=crop',
      rating: 4.8,
      reviewsCount: '4.2M views',
      score: 9.4,
      scoreLabel: 'EXCELLENT',
      highlights: [
        'Gorgeous Titanium Build',
        'Industry Leading Anti-Reflection Screen',
        'Built-in Multi-purpose Stylus S-Pen',
        '200MP Triple Camera System'
      ]
    },
    takeaways: [
      { icon: Flame, text: 'S24 Ultra is currently the absolute king of high-end premium smartphones in Bangladesh.' },
      { icon: Zap, text: 'Xiaomi Redmi Note 13 Pro takes the crown for best midrange powerhouse under 32K.' },
      { icon: Shield, text: 'Realme 12 Pro+ is a great alternative if you love telephoto portrait cameras.' },
      { icon: Clock, text: 'Prices are fluctuating weekly; always compare physical store offers before buying.' },
      { icon: Sparkles, text: 'Samsung AI features are very handy for quick photo edits and language translations.' }
    ],
    verdict: {
      buyIf: 'You want maximum prestige, the ultimate display clarity, and useful built-in S-Pen controls.',
      considerIf: 'You prefer premium hardware and want a phone that will easily last you 5+ years.',
      notForYouIf: 'You are on a tight budget or want a small, pocketable phone.',
      overall: 'Samsung S24 Ultra remains a bulletproof investment for premium smartphone buyers.',
      summary: 'In this viral reel, we breakdown why S24 Ultra continues to beat newer options. The anti-reflective screen panel and long battery cycles make it a powerhouse daily driver.',
      chips: ['Best Flagship', 'Great Camera Zoom', 'Long Battery', 'Titanium Frame', 'Prestige Buy']
    },
    evaluations: [
      { id: 'video_value', title: 'Price to Feature Ratio', score: 9.3, content: 'At current market pricing, the S24 Ultra delivers outstanding value, offering a beautiful professional stylus and top hardware specs.' },
      { id: 'video_design', title: 'Ergonomics & Practical Feel', score: 8.8, content: 'While heavy at 232g, the premium titanium grip provides an extremely durable feel, though two-handed use is highly recommended.' }
    ],
    faqs: [
      { question: 'Where can I find the lowest price in Dhaka?', answer: 'Check Daraz BD and authorized Pickaboo outlets for exclusive discount campaigns.' },
      { question: 'Is official warranty provided?', answer: 'Yes, authorized retailers provide 1-year brand warranty services.' }
    ],
    relatedProducts: PRODUCTS.slice(6, 10),
    relatedGuides: [
      { id: '1', cover: 'https://images.unsplash.com/photo-1556656793-062ff9f1b74b?w=1200&h=800&fit=crop', title: 'Top 10 Smartphones to Buy in 2026', category: 'MOBILE', readTime: '15 MIN READ', views: '125K', badgeClass: 'bg-[#EB4501]' },
      { id: '3', cover: 'https://images.unsplash.com/photo-1707251759491-18d48607ea0c?w=1200&h=675&fit=crop', title: 'Is the S24 Ultra Still Worth It in Late 2026?', category: 'MOBILE', readTime: '12 MIN VIDEO', views: '540K', badgeClass: 'bg-[#EB4501]' }
    ],
    tags: ['Smartphones 2026', 'Dhaka mobile reviews', 'Reels tech', 'S24 Ultra vs Redmi'],
    priceStores: [
      { name: 'Daraz BD', price: '৳143,500', delivery: 'Free · 2-3 Days', isBest: true, rating: 4.8, link: 'https://daraz.com.bd' },
      { name: 'Pickaboo', price: '৳145,000', delivery: '৳150 · 1-2 Days', rating: 4.9, link: 'https://pickaboo.com' }
    ]
  },

  // Guide 3: Is the S24 Ultra Still Worth It in Late 2026? (MOBILE)
  '3': {
    id: '3',
    type: 'VIDEO REVIEW',
    badgeBg: 'bg-[#3B82F6]',
    title: 'Is the S24 Ultra Still Worth It in Late 2026?',
    subtitle: 'Sarah Jenkins revisits Samsung’s flat-screen titanium giant after six months of intense real-world usage to evaluate if it holds up.',
    coverImage: 'https://images.unsplash.com/photo-1707251759491-18d48607ea0c?w=1200&h=675&fit=crop',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-taking-photos-with-a-smartphone-34356-large.mp4',
    duration: '12:45',
    author: {
      name: 'Sarah Jenkins',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop',
      verified: true,
      role: 'Lead Tech Presenter',
      bio: 'Senior hardware analyst and video creator. Over 8 years producing highly objective, detail-oriented device reviews.'
    },
    date: 'May 14, 2026',
    readTime: '12 MIN VIDEO',
    views: '540K',
    rating: 4.8,
    reviews: '45K',
    overallWinner: {
      product: 'Samsung Galaxy S24 Ultra',
      badge: 'STILL THE SUPREME KING',
      image: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=400&h=400&fit=crop',
      rating: 4.8,
      reviewsCount: '13.4K reviews',
      score: 9.4,
      scoreLabel: 'EXCELLENT',
      highlights: [
        'Gorilla Glass Armor Reflection Cut',
        '2-Day Outstanding Battery Endurance',
        'Built-In Precision Stylus S-Pen',
        'Robust Titanium Framework'
      ]
    },
    takeaways: [
      { icon: ShieldCheck, text: 'No visible micro-scratches on screen after 6 months of use without a protector.' },
      { icon: Cpu, text: 'Software fluidity remains pristine; zero lag or memory reload issues.' },
      { icon: Camera, text: 'Portrait edge-detection and low-light skin processing have significantly improved with updates.' },
      { icon: TrendingUp, text: 'Excellent value on secondary and official refurbished local channels.' },
      { icon: Clock, text: 'Battery health still sits at a high 98% capacity after continuous daily cycles.' }
    ],
    verdict: {
      buyIf: 'You want a rugged, top-tier display powerhouse that handles work, drawing, and elite photography with ease.',
      considerIf: 'You want to save BDT 20K+ compared to the newer flagship releases.',
      notForYouIf: 'You want an ultra-slim compact form factor or prefer curved edge screens.',
      overall: 'Yes, the S24 Ultra remains one of the absolute smartest flagship purchases in late 2026.',
      summary: 'Six months of abuse has proven the S24 Ultra’s extreme durability. Its anti-reflective display and extreme battery stamina continue to beat newer 2026 releases in direct practical testing.',
      chips: ['6-Month Tested', 'Extreme Durability', 'Flawless Performance', 'S-Pen Integration', '98% Battery Health']
    },
    evaluations: [
      { id: 'screen_durability', title: 'Gorilla Armor Screen Wear & Tear', score: 9.7, content: 'The Gorilla Glass Armor screen has proven exceptionally scratch-resistant. Even without a screen guard, there are no micro-scratches from pocket sand or key rubbing.' },
      { id: 'camera_zoom', title: 'Optical Zoom & High-Res Portrayal', score: 9.4, content: 'The 5x optical sensor is brilliant for framing street photography. Recent firmware updates have drastically improved natural color rendering and noise levels.' }
    ],
    faqs: [
      { question: 'Is the S-Pen useful for normal people?', answer: 'It is highly convenient for remote selfie shutter triggers, precise photo crops, and quick document signings.' },
      { question: 'How is the charging speed?', answer: 'The 45W charging refuels the phone to 65% in 30 minutes, which is decent though slower than Chinese competitors.' }
    ],
    relatedProducts: PRODUCTS.slice(0, 3),
    relatedGuides: [
      { id: '1', cover: 'https://images.unsplash.com/photo-1556656793-062ff9f1b74b?w=1200&h=800&fit=crop', title: 'Top 10 Smartphones to Buy in 2026', category: 'MOBILE', readTime: '15 MIN READ', views: '125K', badgeClass: 'bg-[#EB4501]' }
    ],
    tags: ['S24 Ultra 6 months review', 'Samsung Galaxy S24 Ultra BD', 'Is S24 Ultra worth it', 'Tech reviews Bangladesh'],
    priceStores: [
      { name: 'Daraz BD', price: '৳143,500', delivery: 'Free · 2-3 Days', isBest: true, rating: 4.8, link: 'https://daraz.com.bd' },
      { name: 'Pickaboo', price: '৳145,000', delivery: '৳150 · 1-2 Days', rating: 4.9, link: 'https://pickaboo.com' }
    ]
  },

  // Guide 4: Apex vs Bata: The Ultimate Sports Shoe Battle (FASHION)
  '4': {
    id: '4',
    type: 'BUYING GUIDE',
    badgeBg: 'bg-[#F59E0B]',
    title: 'Apex vs Bata: The Ultimate Sports Shoe Battle',
    subtitle: 'We put the top two local retail giants head-to-head in a rigorous comparison of active running footwear, analyzing materials, cushioning, and longevity.',
    coverImage: 'https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=800&h=600&fit=crop',
    author: {
      name: 'Sarah Jenkins',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop',
      verified: true,
      role: 'Lifestyle & Fit Columnist',
      bio: 'Fashion curator based in Dhaka. Obsessed with reviewing urban footwear, highlighting comfort, breathable knits, and local styling.'
    },
    date: 'May 10, 2026',
    readTime: '8 MIN READ',
    views: '8K',
    rating: 4.9,
    reviews: '120',
    overallWinner: {
      product: "Apex Men's Ultima Pro Runner",
      badge: 'COMFORT & HEEL SUPPORT CHAMPION',
      image: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=400&h=400&fit=crop',
      rating: 4.9,
      reviewsCount: '312 reviews',
      score: 9.2,
      scoreLabel: 'SUPERB',
      highlights: [
        'Aero-Foam Midsole Energy Return',
        'Breathable Engineered Knit Upper',
        'High Traction Slip Resistant Outsole',
        'Excellent Arch & Heel Support'
      ]
    },
    takeaways: [
      { icon: Smartphone, text: 'Apex Aero-foam midsole technology provides much better bounce and shock absorption than Bata runners.' },
      { icon: ShieldCheck, text: 'High-grade rubber outsole pods are highly resistant to peeling on asphalt roads.' },
      { icon: Cpu, text: 'Engineered mesh upper offers outstanding airflow, keeping feet sweat-free.' },
      { icon: TrendingUp, text: 'Unbeatable pricing in BDT, making it a very smart local purchase.' },
      { icon: Sparkles, text: 'Very versatile styling; fits perfectly with gym gear as well as casual linen jeans.' }
    ],
    verdict: {
      buyIf: 'You want a bouncy, supportive daily walking and running shoe from a highly trusted local brand with robust exchange services.',
      considerIf: 'You require specialized medical orthopedic insoles; you might need to swap the stock pads.',
      notForYouIf: 'You prefer heavy leather classic boots or are looking for elite international tracking spikes.',
      overall: 'Apex Ultima Pro Runner takes the crown for its modern active tech and superior cushioning.',
      summary: 'While Bata has decades of legacy, Apex’s athletic lineup is significantly more modern. The Ultima Pro Runner employs responsive foam and multi-layer mesh that keeps active feet happy in humid Bangladeshi summers.',
      chips: ['Aero-Foam Tech', 'Breathable Knit', 'High Traction Outsole', 'Anatomical Arch', '7-Day Exchange']
    },
    evaluations: [
      { id: 'cushioning', title: 'Midsole Comfort & Step Bounce', score: 9.5, content: 'The Aero-Foam padding is delightfully soft yet supportive, absorbing heavy impact on hard Dhaka brick tiles easily.' },
      { id: 'breathability', title: 'Upper Airflow & Heat Control', score: 9.3, content: 'Multiple mesh vents permit rapid moisture escape, ensuring your feet stay completely dry even during continuous hot walks.' },
      { id: 'durability', title: 'Sole Longevity & Stitch Integrity', score: 8.9, content: 'High abrasion rubber pods protect high-impact spots. After 100km of street walking, there are minimal signs of outsole wear.' }
    ],
    faqs: [
      { question: 'What is Apex’s return policy?', answer: 'Apex provides a seamless 7-day store exchange policy on unused items with original purchase bills and tags.' },
      { question: 'Are these sports shoes machine-washable?', answer: 'We advise gentle hand cleaning with soapy warm water and air-drying to prolong the specialized adhesive bonds.' }
    ],
    relatedProducts: [PRODUCTS[3], PRODUCTS[5]],
    relatedGuides: [
      { id: '7', cover: 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=800&h=1000&fit=crop', title: 'Luxury Watches Every Man Should Own', category: 'FASHION', readTime: 'REELS VIDEO', views: '850K', badgeClass: 'bg-[#F59E0B]' }
    ],
    tags: ['Apex vs Bata sports', 'Apex Ultima Pro Runner', 'Best walking shoes Bangladesh', 'Dhaka sneaker battle'],
    priceStores: [
      { name: 'Apex Online Store', price: '৳3,200', delivery: 'Free · 2-3 Days', isBest: true, rating: 4.9, link: 'https://apex4u.com' },
      { name: 'Daraz BD', price: '৳3,150', delivery: '৳60 · 3-4 Days', rating: 4.5, link: 'https://daraz.com.bd' }
    ]
  },

  // Guide 5: Morning Skincare Routine for Dry Skin (BEAUTY)
  '5': {
    id: '5',
    type: 'SHORTS',
    badgeBg: 'bg-[#EC4899]',
    title: 'Morning Skincare Routine for Dry Skin',
    subtitle: 'Step-by-step video guide reviewing the best gentle, hydrating skincare routines. Say goodbye to dry, flaky skin with BSTI validated products.',
    coverImage: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=600&h=1000&fit=crop',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-girl-cleaning-her-face-with-tonic-4389-large.mp4',
    duration: '1:00',
    author: {
      name: 'Sarah Jenkins',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop',
      verified: true,
      role: 'Skincare Analyst',
      bio: 'Beauty editor evaluating product ingredients, safety, and performance for sensitive skincare routines.'
    },
    date: 'May 18, 2026',
    readTime: 'SHORTS VIDEO',
    views: '95K',
    rating: 4.8,
    reviews: '12K',
    overallWinner: {
      product: 'CeraVe Hydrating Facial Cleanser',
      badge: 'BEST GENTLE CLEANSER',
      image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400&h=400&fit=crop',
      rating: 4.8,
      reviewsCount: '8.4K reviews',
      score: 9.5,
      scoreLabel: 'EXCELLENT',
      highlights: [
        'Formulated with 3 Essential Ceramides',
        'Hyaluronic Acid Boosts Deep Hydration',
        'MVE Continuous Release Technology',
        'Fragrance-Free and Highly Safe'
      ]
    },
    takeaways: [
      { icon: ShieldCheck, text: 'Gentle, non-foaming cleansers protect your natural moisture barrier.' },
      { icon: Cpu, text: 'Ceramides are essential for sealing in hydration throughout the humid day.' },
      { icon: Camera, text: 'Applying sunscreen is non-negotiable, even when staying indoors in Dhaka.' },
      { icon: TrendingUp, text: 'Concentrated formulas provide excellent multi-month value per bottle.' },
      { icon: Sparkles, text: 'Hyaluronic acid acts like a water magnet, keeping skin looking fresh and plump.' }
    ],
    verdict: {
      buyIf: 'You experience dryness, flakiness, or redness, and need a highly safe, dermatologist-developed routine.',
      considerIf: 'You prefer creamy, non-foaming formulations over heavy-sud cleansers.',
      notForYouIf: 'You have extremely oily, acne-prone skin requiring salicylic acid pore cleansers.',
      overall: 'The CeraVe Hydrating Cleanser is the absolute gold standard for restoring dry skin barriers.',
      summary: 'Our tested morning routine centers around CeraVe’s hydrating formula. It cleanses efficiently without stripping essential lipids, leaving a smooth, hydrated canvas ready for moisturizers and sunscreen.',
      chips: ['Dermatologist Tested', 'Ceramide Rich', 'Zero Scent', 'Barrier Restore', 'Deep Hydrating']
    },
    evaluations: [
      { id: 'hydration', title: 'Barrier Hydration & Moisture Seal', score: 9.6, content: 'The cleanser contains 3 vital ceramides. Skin hydration levels showed a 32% increase after 10 days of continuous morning use.' },
      { id: 'safety', title: 'Ingredient Safety & Sensitivity', score: 9.7, content: '100% free from drying alcohols, soap-free, and fragrance-free. Safe for extremely sensitive and eczema-prone skin types.' }
    ],
    faqs: [
      { question: 'How do I detect fake CeraVe bottles in Bangladesh?', answer: 'Check for the imported hologram seal, scan the barcode, and buy only from BSTI-certified cosmetics importers.' },
      { question: 'Should I apply this on wet skin?', answer: 'Yes, wet your face with lukewarm water, gently massage the lotion for 60 seconds, then rinse clean.' }
    ],
    relatedProducts: PRODUCTS.slice(1, 3),
    relatedGuides: [
      { id: '8', cover: 'https://images.unsplash.com/photo-1510972527921-ce03766a1cf1?w=800&h=1000&fit=crop', title: 'Best Coffee Machines for Barista Quality', category: 'HOME', readTime: '10 MIN READ', views: '18K', badgeClass: 'bg-[#EC4899]' }
    ],
    tags: ['Dry skin routine Dhaka', 'CeraVe Hydrating Cleanser price', 'BSTI skincare validation', 'Gentle skincare tips'],
    priceStores: [
      { name: 'Skin Care BD', price: '৳1,800', delivery: 'Free · 2-3 Days', isBest: true, rating: 4.9, link: '#' },
      { name: 'Pure Cosmetics Dhaka', price: '৳1,950', delivery: '৳100 · 1-2 Days', rating: 4.8, link: '#' }
    ]
  },

  // Guide 6: Playstation 5 Pro Review (GAMING)
  '6': {
    id: '6',
    type: 'VIDEO REVIEW',
    badgeBg: 'bg-[#6366F1]',
    title: 'Playstation 5 Pro Review: Is it worth the upgrade?',
    subtitle: 'We test Sony’s mid-cycle console refresh. With advanced ray-tracing, a massive 2TB SSD, and PSSR upscaling, does it justify its premium local price?',
    coverImage: 'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=800&h=450&fit=crop',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-digital-game-interface-with-colorful-shapes-4589-large.mp4',
    duration: '15:20',
    author: {
      name: 'Sarah Jenkins',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop',
      verified: true,
      role: 'Hardware Reviewer',
      bio: 'Senior console and PC gaming analyst. Delivering deep technological breakdowns of latest hardware capabilities.'
    },
    date: 'May 21, 2026',
    readTime: '15 MIN VIDEO',
    views: '1.2M',
    rating: 4.9,
    reviews: '85K',
    overallWinner: {
      product: 'Sony PlayStation 5 Pro',
      badge: 'THE ULTIMATE 4K CONSOLE',
      image: 'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=400&h=400&fit=crop',
      rating: 4.9,
      reviewsCount: '1.2M views',
      score: 9.6,
      scoreLabel: 'MASTERPIECE',
      highlights: [
        'Advanced PSSR AI Upscaling',
        'Locked 60 FPS in Fidelity Settings',
        'Massive 2TB High Speed SSD',
        'Wi-Fi 7 Latency Protection'
      ]
    },
    takeaways: [
      { icon: Cpu, text: 'PSSR upscaling uses machine learning to produce pristine 4K images from lower resolutions.' },
      { icon: Zap, text: 'No more choosing between 30 FPS quality and 60 FPS performance—Pro handles both easily.' },
      { icon: ShieldCheck, text: '2TB on-board storage easily holds over 25 massive AAA game installs.' },
      { icon: TrendingUp, text: 'Significantly improves backward-compatible PS4 and base PS5 games.' },
      { icon: Sparkles, text: 'Wi-Fi 7 supports ultra-low latency online multiplayer pings.' }
    ],
    verdict: {
      buyIf: 'You own a high-end 4K OLED TV, value extreme graphical details, and want a locked 60 FPS gaming standard.',
      considerIf: 'You are looking to buy your first PlayStation 5 console and have the budget for a premium upgrade.',
      notForYouIf: 'You only play casual games, or game on a standard 1080p screen where upgrades are less obvious.',
      overall: 'The PS5 Pro is a glorious technological achievement for hardcore console gamers.',
      summary: 'By eliminating the choice between performance and resolution, the PS5 Pro represents console gaming at its absolute peak. While expensive, the advanced PSSR and massive 2TB drive deliver a true premium experience.',
      chips: ['PSSR AI SuperRes', '60FPS Locked', '2TB SSD Storage', 'Ray Tracing Boost', 'Wi-Fi 7 Ready']
    },
    evaluations: [
      { id: 'gpu', title: 'Graphics Processing & Framerates', score: 9.7, content: 'With 67% more compute units than the base PS5, the Pro renders extreme lighting details and shadows flawlessly while maintaining locked 60 frames per second.' },
      { id: 'pssr', title: 'PSSR AI Image Quality', score: 9.6, content: 'Sony’s AI upscaler is the star of the show. It reconstructs details beautifully, making upscaled games look indistinguishable from native 4K.' }
    ],
    faqs: [
      { question: 'Does the PS5 Pro include a disc drive?', answer: 'No, the PS5 Pro is a digital-only console out of the box. You must purchase the official disc drive accessory separately.' },
      { question: 'Do old games run better?', answer: 'Yes, the PS5 Pro Game Boost automatically stabilizes and improves the framerate of over 8,500 PS4 and PS5 titles.' }
    ],
    relatedProducts: PRODUCTS.slice(1, 4),
    relatedGuides: [
      { id: '1', cover: 'https://images.unsplash.com/photo-1556656793-062ff9f1b74b?w=1200&h=800&fit=crop', title: 'Top 10 Smartphones to Buy in 2026', category: 'MOBILE', readTime: '15 MIN READ', views: '125K', badgeClass: 'bg-[#6366F1]' }
    ],
    tags: ['PlayStation 5 Pro review', 'PS5 Pro BD price', 'PSSR testing', 'Dhaka console gaming'],
    priceStores: [
      { name: 'Ryans Computers', price: '৳85,000', delivery: 'Free · 1-2 Days', isBest: true, rating: 4.9, link: 'https://ryanscomputers.com' },
      { name: 'Star Tech', price: '৳86,500', delivery: 'Free · 2-3 Days', rating: 4.8, link: 'https://startech.com.bd' }
    ]
  },

  // Guide 7: Luxury Watches Every Man Should Own (FASHION)
  '7': {
    id: '7',
    type: 'REELS',
    badgeBg: 'bg-[#8B5CF6]',
    title: 'Luxury Watches Every Man Should Own',
    subtitle: 'A high-impact video review showcasing the most iconic luxury timepieces, focusing on build precision, craftsmanship, and investment value.',
    coverImage: 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=800&h=1000&fit=crop',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-hand-applying-cream-on-the-skin-of-another-hand-4688-large.mp4',
    duration: '0:58',
    author: {
      name: 'Imtiaz Ahmed',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop',
      verified: true,
      role: 'Horological Curator',
      bio: 'Watch enthusiast and collector. Reviewing classical and modern luxury mechanical masterpieces.'
    },
    date: 'May 22, 2026',
    readTime: 'REELS VIDEO',
    views: '850K',
    rating: 4.9,
    reviews: '42K',
    overallWinner: {
      product: 'Rolex Submariner Date',
      badge: 'BEST INVESTMENT WATCH',
      image: 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=400&h=400&fit=crop',
      rating: 4.9,
      reviewsCount: '850K views',
      score: 9.8,
      scoreLabel: 'MASTERPIECE',
      highlights: [
        '904L Corrosion Resistant Oystersteel',
        'Calibre 3235 Automatic Chronometer',
        'Scratchproof Cerachrom Ceramic Bezel',
        'Unmatched 300m Waterproof Protection'
      ]
    },
    takeaways: [
      { icon: ShieldCheck, text: '904L Oystersteel offers incredible scratch and chemical corrosion resistance.' },
      { icon: Cpu, text: 'Calibre 3235 features a Chronergy escapement for ultimate mechanical precision.' },
      { icon: TrendingUp, text: 'Rolex sports models possess exceptional value retention in secondary markets.' },
      { icon: Smartphone, text: 'Extremely versatile layout; elevates professional suits and casual t-shirts equally.' },
      { icon: Clock, text: 'A robust 70-hour reserve ensures it keeps ticking through the entire weekend.' }
    ],
    verdict: {
      buyIf: 'You seek a life-long companion watch that holds its value, matches any dress, and represents horological perfection.',
      considerIf: 'You want to celebrate a major milestone with a highly prestigious, iconic artifact.',
      notForYouIf: 'You prefer smartwatches with pulse trackers, alerts, and electronic screens.',
      overall: 'The Rolex Submariner Date remains the absolute king of dive watches.',
      summary: 'There is a reason the Submariner is the most copied watch style in history. Its robust mechanical heart, surgical-grade steel casing, and peerless brand prestige make it the ultimate luxury timepiece to acquire.',
      chips: ['Calibre 3235 Auto', 'Oystersteel 904L', '300m Waterproof', 'Cerachrom Bezel', 'Elite Investment']
    },
    evaluations: [
      { id: 'mechanism', title: 'Automatic Movement & Precision', score: 9.9, content: 'Chronometer certified by COSC. The calibre 3235 is incredibly accurate at -2/+2 seconds daily, with stellar shock and temperature resistance.' },
      { id: 'bracelet', title: 'Clasp & Comfort Ergonomics', score: 9.7, content: 'The Oyster bracelet utilizes the Glidelock extension system, letting you adjust length in 2mm increments on-the-go without any tools.' }
    ],
    faqs: [
      { question: 'Why is buying a Rolex at retail so difficult?', answer: 'Rolex restricts supply to preserve brand exclusivity and extreme quality, resulting in long waiting lists at authorized dealers.' },
      { question: 'How often should a mechanical watch be serviced?', answer: 'Rolex recommends a professional servicing checkup once every 10 years.' }
    ],
    relatedProducts: [PRODUCTS[3], PRODUCTS[10]],
    relatedGuides: [
      { id: '4', cover: 'https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=800&h=600&fit=crop', title: 'Apex vs Bata: Sports Shoe Battle', category: 'FASHION', readTime: '8 MIN READ', views: '8K', badgeClass: 'bg-[#8B5CF6]' }
    ],
    tags: ['Best luxury watches', 'Rolex Submariner BD price', 'Horological investments', 'Iconic timepieces'],
    priceStores: [
      { name: 'Timekeeper Bangladesh', price: '৳1,650,000', delivery: 'Secure Hand Delivery', isBest: true, rating: 5.0, link: '#' },
      { name: 'Watches BD', price: '৳1,680,000', delivery: 'Insured Shipping', rating: 4.9, link: '#' }
    ]
  },

  // Guide 8: Best Coffee Machines for Barista Quality (HOME)
  '8': {
    id: '8',
    type: 'BUYING GUIDE',
    badgeBg: 'bg-[#78350F]',
    title: 'Best Coffee Machines for Barista Quality',
    subtitle: 'We test and compare the top home espresso machines. From integrated grinders to precise PID temperature controls, find your perfect kitchen brewer.',
    coverImage: 'https://images.unsplash.com/photo-1510972527921-ce03766a1cf1?w=800&h=1000&fit=crop',
    author: {
      name: 'Imtiaz Ahmed',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop',
      verified: true,
      role: 'Home Appliance Expert',
      bio: 'Consumer product reviewer with a strong focus on kitchen technology, gourmet appliances, and specialty brewing.'
    },
    date: 'May 19, 2026',
    readTime: '10 MIN READ',
    views: '18K',
    rating: 4.8,
    reviews: '540',
    overallWinner: {
      product: 'Breville Barista Express',
      badge: 'BEST ALL-IN-ONE ESPRESSO MAKER',
      image: 'https://images.unsplash.com/photo-1510972527921-ce03766a1cf1?w=400&h=400&fit=crop',
      rating: 4.8,
      reviewsCount: '1.2K reviews',
      score: 9.3,
      scoreLabel: 'EXCELLENT',
      highlights: [
        'Integrated Conical Burr Grinder',
        'Digital PID Temperature Controls',
        'Powerful Manual Steam Wand',
        '15-Bar Italian High-Pressure Pump'
      ]
    },
    takeaways: [
      { icon: Cpu, text: 'PID controller regulates water temperature precisely, avoiding bitter or sour extractions.' },
      { icon: Zap, text: 'Built-in grinder prepares fresh beans to extraction in less than 60 seconds.' },
      { icon: ShieldCheck, text: 'Sturdy brushed stainless steel housing fits any luxury kitchen aesthetic.' },
      { icon: TrendingUp, text: 'Pays for itself within 6 months compared to daily café purchases.' },
      { icon: Sparkles, text: 'Manual micro-foam steam texturing allows you to craft latte art like a pro.' }
    ],
    verdict: {
      buyIf: 'You love rich, authentic espresso, appreciate manual brewing crafts, and want an integrated grinding station.',
      considerIf: 'You want professional, high-end espresso without buying a separate multi-thousand-dollar grinder.',
      notForYouIf: 'You prefer quick single-button pod machines (like Nespresso) or plain drip filter coffee.',
      overall: 'The Barista Express is the absolute champion of home espresso makers.',
      summary: 'Breville’s Barista Express delivers everything required for gourmet lattes and flat whites. Its precise PID temperature, heavy portafilter, and powerful steam pressure guarantee barista-level crema at home.',
      chips: ['Built-in Grinder', 'PID Temp Regulation', 'Pro Micro-Foam', 'Dose Control', 'Heavy Steel Build']
    },
    evaluations: [
      { id: 'grinding', title: 'Burr Grinder Performance', score: 9.4, content: 'Integrated conical burrs with 16 dial adjustments deliver freshly ground coffee directly into the portafilter with excellent size consistency.' },
      { id: 'steam_pressure', title: 'Steam Pressure & Milk Texturing', score: 9.2, content: 'The professional high-pressure steam wand quickly heats and textures milk into velvet micro-foam, enabling high-precision latte art.' }
    ],
    faqs: [
      { question: 'Is the machine easy to clean?', answer: 'Yes. The machine lights up a "Clean Me" warning. Standard flushing and descaling takes 10 minutes.' },
      { question: 'What beans are recommended?', answer: 'We recommend fresh, locally roasted medium-to-dark coffee beans for the richest golden crema extraction.' }
    ],
    relatedProducts: PRODUCTS.slice(4, 7),
    relatedGuides: [
      { id: '5', cover: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=600&h=1000&fit=crop', title: 'Morning Skincare Routine for Dry Skin', category: 'BEAUTY', readTime: 'SHORTS VIDEO', views: '95K', badgeClass: 'bg-[#78350F]' }
    ],
    tags: ['Best espresso machines BD', 'Breville Barista Express price', 'Home barista equipment Dhaka', 'Coffee maker reviews'],
    priceStores: [
      { name: 'Kitchen World BD', price: '৳88,000', delivery: 'Free · 1-2 Days', isBest: true, rating: 4.9, link: '#' },
      { name: 'Best Buy Appliances', price: '৳92,000', delivery: 'Free · 2-3 Days', rating: 4.8, link: '#' }
    ]
  },
  'live-1': {
    id: 'live-1',
    type: 'LIVE SHOPPING',
    badgeBg: 'bg-[#EB4501]',
    title: 'Samsung Galaxy S26 Ultra Launch: Exclusive Live Unboxing & Price Drops',
    subtitle: 'We are live at the official Samsung Experience Store in Dhaka, unboxing the brand new Galaxy S26 Ultra. Join live to grab BDT 15,000 cash discount vouchers!',
    coverImage: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=1200&q=80',
    isLiveShopping: true,
    liveState: 'LIVE NOW',
    platform: 'YouTube Live',
    viewerCount: 4850,
    brand: 'Samsung',
    scheduledDate: 'July 14, 2026',
    scheduledTime: '01:00 AM (BST)',
    duration: '1h 30m',
    author: {
      name: 'Nusrat Jahan',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&q=80',
      verified: true,
      role: 'Tech Creator & Anchor',
      bio: 'Leading female tech content creator in Bangladesh. Specialized in live shopping streams and interactive unboxings.'
    },
    date: 'July 14, 2026',
    readTime: 'LIVE STREAM',
    views: '4.8K Watching',
    rating: 4.9,
    reviews: '850',
    topicsCovered: ['Bangladesh Retail Pricing', 'Pre-order Cash Discounts', 'Live Camera Test vs S24 Ultra', 'S-Pen AI capabilities demo'],
    productsMentioned: PRODUCTS.slice(0, 3),
    priceStores: [
      { name: 'Samsung Bangladesh Store', price: '৳175,000', delivery: 'Free Instant Shipping', isBest: true, rating: 4.9, link: '#' },
      { name: 'Daraz BD', price: '৳170,000', delivery: 'Free · 2-3 Days', rating: 4.8, link: '#' }
    ],
    takeaways: [
      { icon: Smartphone, text: "LIVE OFFER: Use voucher code 'S26LIVE' during this live stream for an extra BDT 5,000 off!" },
      { icon: Cpu, text: "Processor performance has been boosted by 25% with the new Snapdragon 8 Gen 4." },
      { icon: Camera, text: "The new 200MP camera sensor captures significantly sharper details in low-light environments." }
    ],
    verdict: {
      buyIf: 'You want the absolute pinnacle of smartphone technology, elite low-light photography, and want to leverage pre-order discounts.',
      considerIf: 'You are looking to upgrade from a Galaxy S21 Ultra or older.',
      notForYouIf: 'You are on a tight budget or prefer small, lightweight pocketable phones.',
      overall: "Samsung's Galaxy S26 Ultra is the ultimate flagship of 2026.",
      summary: 'We tested the S26 Ultra live, checking out its 200MP camera, Snapdragon 8 Gen 4 processor, and outstanding anti-reflective armor screen.',
      chips: ['200MP Main', 'S26 Dhaka Launch', 'S-Pen AI', 'Snapdragon 8 Gen 4']
    },
    evaluations: [
      { id: 'camera_lowlight', title: 'Low-light & Nightography Zoom', score: 9.9, content: 'Live zoom tests at 10x and 30x magnification showed remarkable noise control and stable optical image stabilization under dim Dhaka streets.' }
    ],
    faqs: [
      { question: 'When does pre-order shipping start in Bangladesh?', answer: 'Pre-orders placed today will start shipping on July 20, 2026 with verified store pickup options.' }
    ],
    tags: ['Samsung S26 live stream', 'S26 Bangladesh price', 'Dhaka pre-order deals', 'Galaxy S26 camera test'],
    relatedGuides: [
      { id: '1', cover: 'https://images.unsplash.com/photo-1556656793-062ff9f1b74b?w=600&h=800', title: 'Top 10 Smartphones to Buy in 2026', category: 'MOBILE', readTime: '15 MIN READ', views: '125K', badgeClass: 'bg-[#EB4501]' }
    ]
  },
  'live-2': {
    id: 'live-2',
    type: 'LIVE SHOPPING',
    badgeBg: 'bg-[#10B981]',
    title: 'DJI Mini 4 Pro Drone Outdoor Demonstration & Night-Flight Test',
    subtitle: 'Join us upcoming as we take the DJI Mini 4 Pro on a live night flight demonstration over the scenic Hatirjheel in Dhaka. Live tips on flying regulations!',
    coverImage: 'https://images.unsplash.com/photo-1508614589041-895b88991e3e?w=1200&q=80',
    isLiveShopping: true,
    liveState: 'UPCOMING',
    platform: 'Facebook Live',
    brand: 'DJI',
    scheduledDate: 'July 16, 2026',
    scheduledTime: '07:30 PM (BST)',
    duration: '45 mins',
    author: {
      name: 'Tanvir Hossain',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&q=80',
      verified: true,
      role: 'Creative Director & Pilot',
      bio: 'Professional aerial cinematographer and CAA-licensed drone pilot. Over 5 years filming beautiful spots in Bangladesh.'
    },
    date: 'July 16, 2026',
    readTime: 'UPCOMING LIVE',
    views: 'Scheduled',
    rating: 4.8,
    reviews: '340',
    topicsCovered: ['Hatirjheel Flight Permit Guidance', 'Low-light camera sensor test', 'ActiveTrack 360 obstacle avoidance', 'Dhaka local seller pricing'],
    productsMentioned: [PRODUCTS[4] || PRODUCTS[0], PRODUCTS[5] || PRODUCTS[1]],
    priceStores: [
      { name: 'Gadget & Gear', price: '৳98,000', delivery: 'Free · Instant Store Pickup', isBest: true, rating: 5.0, link: '#' }
    ],
    takeaways: [
      { icon: Camera, text: 'Under-249g weight means you can fly in many locations without needing commercial drone licensing.' },
      { icon: Zap, text: 'True vertical shooting mode makes it perfect for social media creators on Reels & TikTok.' }
    ],
    verdict: {
      buyIf: 'You are a content creator looking for stunning aerial photography without complex licensing overhead.',
      considerIf: 'You want a highly portable drone that fits inside a jacket pocket.',
      notForYouIf: 'You fly in extreme gale force winds regularly.',
      overall: 'The ultimate compact travel drone of 2026.',
      summary: "DJI's Mini 4 Pro represents a masterclass in portable drone photography.",
      chips: ['True Vertical', 'ActiveTrack 360', 'Under 249g', 'Hatirjheel Night Flight']
    },
    evaluations: [
      { id: 'sensor', title: '1/1.3-inch CMOS Sensor Performance', score: 9.3, content: 'Superb dynamic range with dual native ISO fusion ensures night landscapes look exceptionally clean.' }
    ],
    faqs: [
      { question: 'Do I need CAAB registration in Bangladesh?', answer: 'For recreational drones under 250g flown at low altitudes, registration requirements are simplified, but caution must be taken near airports.' }
    ],
    tags: ['DJI Mini 4 pro drone test', 'Dhaka Hatirjheel flight', 'CAAB drone rules Bangladesh', 'Drone price in BD'],
    relatedGuides: [
      { id: '8', cover: 'https://images.unsplash.com/photo-1510972527921-ce03766a1cf1?w=800&h=1000', title: 'Best Tech for Outdoor Creators', category: 'TECH', readTime: '12 MIN READ', views: '15K', badgeClass: 'bg-[#EB4501]' }
    ]
  },
  'live-3': {
    id: 'live-3',
    type: 'LIVE SHOPPING',
    badgeBg: 'bg-[#6366F1]',
    title: 'Sony WH-1000XM5: Deep-Dive Noise Cancellation Test & Comparison',
    subtitle: 'Did you miss the live audio showcase? Watch the full replay as we test the XM5 live inside a noisy coffee shop, comparing it side-by-side with XM4.',
    coverImage: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=1200&q=80',
    isLiveShopping: true,
    liveState: 'REPLAY',
    platform: 'YouTube Live',
    brand: 'Sony',
    scheduledDate: 'July 12, 2026',
    scheduledTime: '04:00 PM (BST)',
    duration: '1h 10m',
    author: {
      name: 'Tech World BD',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&q=80',
      verified: true,
      role: 'Lead Sound Engineer',
      bio: 'Expert audio reviewer and audiophile based in Dhaka. Focused on helping consumers find high-fidelity headphones and audio systems.'
    },
    date: 'July 12, 2026',
    readTime: 'REPLAY VIDEO',
    views: '12.5K Views',
    rating: 4.8,
    reviews: '1.2K',
    topicsCovered: ['Active Noise Cancellation vs XM4', 'Dhaka Traffic isolation test', 'Microphone array quality for zoom calls', 'Bangladesh market discounts'],
    productsMentioned: [PRODUCTS[2] || PRODUCTS[0], PRODUCTS[6] || PRODUCTS[1]],
    priceStores: [
      { name: 'Sony Rangs Bangladesh', price: '৳38,500', delivery: 'Free Shipping', isBest: true, rating: 4.9, link: '#' },
      { name: 'Daraz BD', price: '৳36,500', delivery: 'Free Shipping', rating: 4.7, link: '#' }
    ],
    videoChapters: [
      { time: '00:00', title: 'Introduction & Unboxing', description: 'First look at the XM5 case and lightweight carbon fiber materials.' },
      { time: '12:15', title: 'ANC Dhaka Bus Noise Test', description: 'Real-world test showing how the XM5 cancels heavy diesel engine rumbling.' },
      { time: '28:40', title: 'Microphone Call Quality Demo', description: 'Zoom call microphone quality under gusty fan conditions.' },
      { time: '45:10', title: 'Sound Profile & App Equalizer', description: 'Adjusting clear bass for traditional Bangladeshi instruments.' },
      { time: '1:02:05', title: 'Pricing & Dhaka Store Deals', description: 'Finding the best local warranties and lowest authentic pricing.' }
    ],
    takeaways: [
      { icon: Headphones, text: 'Industry-leading ANC makes Dhaka traffic rumbling vanish completely.' },
      { icon: Zap, text: '30-hour battery life with extremely fast charge (3 minutes yields 5 hours playback).' }
    ],
    verdict: {
      buyIf: 'You commute in noisy environments, take frequent voice calls, and want the best noise-canceling headphones available.',
      considerIf: 'You want a comfortable pair of over-ears for 8+ hours of continuous daily wearing.',
      notForYouIf: 'You require folding earcups for ultra-compact storage (consider XM4 instead).',
      overall: 'The absolute benchmark for premium ANC noise-canceling headphones.',
      summary: 'In our live review replay, we compared the XM5 to its predecessor and found the ANC and mic quality upgrades to be incredibly compelling.',
      chips: ['Sony XM5', 'ANC Benchmark', 'Dhaka Commuter', '30-Hr Battery']
    },
    evaluations: [
      { id: 'anc', title: 'Active Noise Canceling Performance', score: 9.8, content: 'Dual-processor system and 8 microphones adapt dynamically to cancel high-frequency chatter and low bus hums with absolute ease.' }
    ],
    faqs: [
      { question: 'Is the official international warranty covered in BD?', answer: 'Yes, verified Sony dealers in Dhaka like Sony Rangs cover official limited warranty terms.' }
    ],
    tags: ['Sony WH-1000XM5 Dhaka reviews', 'XM5 vs XM4 price BD', 'Best noise canceling headphones', 'Sony audio store Bangladesh'],
    relatedGuides: [
      { id: '1', cover: 'https://images.unsplash.com/photo-1556656793-062ff9f1b74b?w=600&h=800', title: 'Best Headphones for Travel 2026', category: 'AUDIO', readTime: '8 MIN READ', views: '32K', badgeClass: 'bg-[#EB4501]' }
    ]
  }
};

export function getEditorialContent(id: string | undefined): EditorialContent {
  const fallback = DYNAMIC_CONTENT_DB['1']; // S24 Ultra Buying Guide
  if (!id) return fallback;
  
  // Try direct lookup
  if (DYNAMIC_CONTENT_DB[id]) {
    return DYNAMIC_CONTENT_DB[id];
  }
  
  // Try mapping common variations
  const cleanId = id.replace('g-', '').replace('spot-', '').replace('story-', '');
  if (DYNAMIC_CONTENT_DB[cleanId]) {
    return DYNAMIC_CONTENT_DB[cleanId];
  }
  
  return fallback;
}
