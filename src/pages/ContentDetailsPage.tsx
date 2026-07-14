import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { 
  ShieldCheck, Youtube, Star, ArrowRight, ChevronRight, Play, 
  Bookmark, Share2, Plus, Check, Smartphone, Cpu, Camera, 
  TrendingUp, CheckCircle2, XCircle, HelpCircle, Info, Copy, 
  ExternalLink, Eye, MessageSquare, Send, Award, Sparkles, 
  Clock, Flame, Zap, Shield, Heart, Share, Volume2, Maximize, 
  Pause, RotateCcw, FlameKindling, Ticket, AlertTriangle, Calendar, Bell
} from 'lucide-react';
import { cn } from '../lib/utils';
import { PRODUCTS } from '../constants';
import { ProductCard } from '../components/ProductCard';
import { getEditorialContent } from '../data/dynamicContentDb';

// ==========================================
// DYNAMIC EDITORIAL DATABASE (17 Content Types)
// ==========================================

interface EditorialContent {
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
  relatedProducts: typeof PRODUCTS;
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
}

const EDIT_DATABASE: Record<string, EditorialContent> = {
  // 1. BUYING GUIDES
  'g-1': {
    id: 'g-1',
    type: 'BUYING GUIDE',
    badgeBg: 'bg-[#FF5B00]',
    title: 'Best Smartphones Under 30K in BD (2026)',
    subtitle: 'Find the absolute best value-for-money smartphones under BDT 30,000 currently available in Bangladesh.',
    coverImage: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=1200&q=80',
    author: {
      name: 'Farhan Ahmed',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&q=80',
      verified: true,
      role: 'Tech Expert & Reviewer',
      bio: 'Over a decade of testing mobile phones. Dedicated to helping tech buyers in Bangladesh find their next daily driver without overpaying.'
    },
    date: 'May 12, 2026',
    readTime: '10 min read',
    views: '18.4K views',
    rating: 4.8,
    reviews: '2.3K',
    overallWinner: {
      product: 'Redmi Note 13 Pro 4G',
      badge: 'BEST BUDGET KING',
      image: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=400&h=400&fit=crop',
      rating: 4.7,
      reviewsCount: '890 reviews',
      score: 8.9,
      scoreLabel: 'EXCELLENT',
      highlights: [
        'Gorgeous 120Hz AMOLED Panel',
        'Incredible 200MP Main Camera',
        'Premium Slim Bezel Styling',
        '67W Ultra Fast Charger Included'
      ]
    },
    takeaways: [
      { icon: Smartphone, text: 'AMOLED screen with high refresh rates is now standard under 30K.' },
      { icon: Camera, text: 'The 200MP sensor delivers flagship-grade daytime photos, though lowlight remains average.' },
      { icon: Cpu, text: 'Helio G99 Ultra offers fluid everyday multitasking but is not for heavy gaming.' },
      { icon: ShieldCheck, text: 'Good software security updates but expect moderate bloatware out of the box.' },
      { icon: TrendingUp, text: 'Unbelievable pricing makes it highly superior to competitors from Samsung at this tier.' }
    ],
    verdict: {
      buyIf: 'You want the best display, premium slim bezels, and a high-resolution daytime camera.',
      considerIf: 'You are willing to stretch your budget for a 5G compatible processor.',
      notForYouIf: 'You expect high-performance graphics settings in BGMI or 4K 60FPS video recording.',
      overall: 'Redmi Note 13 Pro 4G remains the supreme king of value under BDT 30,000.',
      summary: 'For budget hunters in Bangladesh, the Redmi Note 13 Pro offers an unmatched display and a stunning form factor. It prioritizes the screen and design over gaming chipsets, making it a stellar daily organizer.',
      chips: ['120Hz AMOLED', '200MP Camera', '67W Turbo Charge', 'Ultra Slim Bezels', 'Great Styling']
    },
    evaluations: [
      { id: 'display', title: 'Display Quality & Viewability', score: 9.3, content: 'The screen is easily the best feature of this phone. At 1300 nits peak brightness, it remains highly readable under direct sunlight in Dhaka. Colours are punchy and 120Hz scroll is butter smooth.' },
      { id: 'camera', title: 'Camera Performance', score: 8.8, content: 'Daytime 200MP shots are incredibly detailed. Skin tones look natural and HDR controls highlights well. However, secondary 8MP ultra-wide and macro cameras are underwhelming.' },
      { id: 'battery', title: 'Battery and 67W Turbo Charge', score: 9.0, content: 'The 5000mAh battery consistently lasts a full day of heavy social media, browsing, and YouTube. The included 67W charger refuels the device from 0% to 100% in exactly 46 minutes.' }
    ],
    faqs: [
      { question: 'Is the 4G variant better than the 5G variant under 30K?', answer: 'Yes, the 4G variant has slimmer bezels and is significantly cheaper, leaving more budget for storage. 5G rollout in BD is still limited.' },
      { question: 'Does it support dual SIM and microSD card?', answer: 'Yes, it features a hybrid card slot that allows either dual SIMs or one nano-SIM and one microSD card.' }
    ],
    relatedProducts: PRODUCTS.slice(2, 6),
    relatedGuides: [
      { id: 'g-3', cover: 'https://images.unsplash.com/photo-1585338107529-13afc5f02586?w=600&q=80', title: 'Best Air Conditioners for BD Summer', category: 'BUYING GUIDE', readTime: '7 min read', views: '11K views', badgeClass: 'bg-[#FF5B00]' },
      { id: 'g-5', cover: 'https://images.unsplash.com/photo-1496181133227-f83bb023945d?w=600&q=80', title: 'Best Student Laptops in BD', category: 'BUYING GUIDE', readTime: '12 min read', views: '14K views', badgeClass: 'bg-[#FF5B00]' }
    ],
    tags: ['Best phones under 30k Bangladesh', 'Redmi Note 13 Pro BD price', 'Budget king phones 2026', 'Symphony vs Redmi under 30000 BDT']
  },

  // 2. REELS / SHORTS (VIDEO REVIEW)
  'spot-2': {
    id: 'spot-2',
    type: 'REELS',
    badgeBg: 'bg-[#10B981]',
    title: '5 Sneakers You Need This Summer (2026)',
    subtitle: 'Stay light, breathable, and fresh. Nusrat reviews the top lightweight summer sneakers perfect for humid climates.',
    coverImage: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=1200&q=80',
    author: {
      name: 'Nusrat Jahan',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&q=80',
      verified: true,
      role: 'Fashion & Sneaker Creator',
      bio: 'Sneaker collector based in Dhaka. Obsessed with reviewing urban footwear, highlighting comfort, breathable knits, and local styling.'
    },
    date: 'May 10, 2026',
    readTime: '3 min watch',
    views: '45.2K views',
    rating: 4.9,
    reviews: '820',
    videoChapters: [
      { time: '0:00', title: 'Summer Sneaker Mandate', description: 'Why mesh and breathability are crucial for BD weather.' },
      { time: '0:45', title: 'Nike Air Max Breathable', description: 'Lightweight heel cushion with translucent side meshes.' },
      { time: '1:30', title: 'Adidas Ultraboost Light', description: 'The absolute king of long-distance walk comfort.' },
      { time: '2:10', title: 'New Balance 550 Retro', description: 'Leather look but with amazing ventilation pores.' },
      { time: '2:40', title: 'Bata Sporty Summer Flex', description: 'The best local budget-friendly alternative.' }
    ],
    takeaways: [
      { icon: Flame, text: 'Engineered mesh fabrics outperform leather in humid hot weather.' },
      { icon: Zap, text: 'Midsole cushioning directly reduces back strain during urban walks.' },
      { icon: Shield, text: 'Always use water-resistant spray protection against sudden monsoon rain.' },
      { icon: Clock, text: 'No-tie speed laces offer premium comfort for active commuters.' },
      { icon: Sparkles, text: 'Neutral slate, off-white, and beige colorways style best with summer linen shorts.' }
    ],
    verdict: {
      buyIf: 'You walk a lot in hot weather and want breathable comfort sneakers that style easily.',
      considerIf: 'You want premium durability and are willing to pay for imported genuine mesh.',
      notForYouIf: 'You need heavy-duty high-ankle support for trekking or hiking.',
      overall: 'Mesh-heavy running-inspired sneakers are a non-negotiable summer requirement.',
      summary: 'Summer calls for footwear that does not trap sweat. Choosing mesh designs like the Ultraboost Light or premium knit alternatives keeps you cool while providing maximum impact protection.',
      chips: ['Engineered Mesh', 'Maximum Airflow', 'Bounce Midsoles', 'Linen Styling', 'Waterproof Guard']
    },
    evaluations: [
      { id: 'mesh', title: 'Upper Mesh Breathability', score: 9.6, content: 'Tested in 36°C afternoon heat. Knit and mesh uppers allow wind to flow freely, keeping socks totally dry even after 5,000 steps.' },
      { id: 'cushion', title: 'Midsole Support & Shock Intake', score: 9.4, content: 'Boost foam and modern cloudfoam pods take the impact beautifully. Perfect for heavy urban exploration or running errands in the city.' },
      { id: 'grip', title: 'Traction on Slippery Pavements', score: 8.5, content: 'Dhaka tile pavements get extremely slick when wet. Rubber compound outsoles provide reliable grip, though wet marble tiles still require caution.' }
    ],
    faqs: [
      { question: 'How do I clean sweat stains from white mesh sneakers?', answer: 'Mix warm water with baking soda and gentle dish soap. Scrub using a soft-bristled toothbrush, then air-dry completely.' },
      { question: 'Is Bata summer athletic footwear durable?', answer: 'Yes, Bata’s recent premium sports line offers incredible local warranty support and decent durability.' }
    ],
    relatedProducts: PRODUCTS.slice(4, 6),
    relatedGuides: [
      { id: 'story-1', cover: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80', title: 'Best Running Shoes for 2026', category: 'BUYING GUIDE', readTime: '12 min read', views: '28K views', badgeClass: 'bg-[#FF5B00]' }
    ],
    tags: ['Best summer sneakers BD', 'Nusrat Sneaker Reviews', 'White breathable sneakers 2026', 'Comfort walking shoes Dhaka']
  },

  // 3. CAMPAIGNS
  'spot-5': {
    id: 'spot-5',
    type: 'CAMPAIGN',
    badgeBg: 'bg-[#EC4899]',
    title: 'Eid Collection 2025 Now Live (Bata)',
    subtitle: 'Celebrate in absolute style. Discover the ultimate Bata Eid footwear with premium voucher codes and cashback offers.',
    coverImage: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1200&q=80',
    author: {
      name: 'Sadequa Sultana',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&q=80',
      verified: true,
      role: 'Fashion Director & Organizer',
      bio: 'Fashion curator specializing in festive Bangladeshi apparel. Linking heritage styling with modern, premium lifestyle footwear.'
    },
    date: 'Jan 22, 2026',
    readTime: '5 min read',
    views: '32.1K views',
    rating: 4.8,
    reviews: '1.9K',
    campaignBlock: {
      sponsorName: 'Bata Bangladesh',
      discountAmount: 'Flat 15% OFF on Eid footwear',
      voucherCode: 'BATAEID2025',
      durationDays: 4,
      ctaLink: 'https://www.batabd.com',
      ctaText: 'Visit Bata Eid Store'
    },
    takeaways: [
      { icon: Flame, text: 'Bata Red Label premium festive sandals features advanced memory foam soles.' },
      { icon: Award, text: 'Genuine leather traditional slip-ons match perfectly with fine Punjabi suits.' },
      { icon: Zap, text: 'Voucher code BATAEID2025 grants flat 15% instant savings at online checkout.' },
      { icon: ShieldCheck, text: 'All purchases carry official 30-day wear-and-tear replacement warranty.' },
      { icon: Clock, text: 'Same-day delivery available across Dhaka for all orders placed before 2 PM.' }
    ],
    verdict: {
      buyIf: 'You want incredibly comfortable festive footwear that complements traditional panjabis and sarees.',
      considerIf: 'You want high durability leather that can easily outlast the festive season.',
      notForYouIf: 'You are looking for specialized track cleats or professional trail running boots.',
      overall: 'An excellent opportunity to acquire premium, stylish footwear at a 15% discount.',
      summary: 'Bata’s Eid 2025 collection excels in providing elegant, lightweight styles that keep you comfortable through long days of festive visits. The voucher code offers a perfect incentive.',
      chips: ['Eid Special', 'Memory Foam Sole', 'Genuine Leather', '30-Day Warranty', 'Free Delivery']
    },
    evaluations: [
      { id: 'comfort', title: 'Festive All-Day Comfort', score: 9.5, content: 'Bata Red Label uses high-density memory cushioning. Walking from house to house during Eid visits feels comfortable and friction-free.' },
      { id: 'design', title: 'Style Pairing & Festive Aesthetics', score: 9.2, content: 'The leather sandals feature elegant dual-tone brown and black finishes, pairing magnificently with white, pastel, or deep navy festive Panjabis.' },
      { id: 'pricing', title: 'Discount & Real Value Assessment', score: 8.9, content: 'The 15% off voucher code brings prices down considerably. The average price drops to BDT 3,500, offering excellent premium build for money.' }
    ],
    faqs: [
      { question: 'Is the discount code applicable in physical outlets?', answer: 'No, this voucher code is strictly valid for purchases made via the official Bata online portal.' },
      { question: 'What is the return policy if the size does not fit?', answer: 'Bata offers free size exchange at any local Bata dealer shop within 7 days of online delivery.' }
    ],
    relatedProducts: PRODUCTS.slice(3, 5),
    relatedGuides: [
      { id: 'g-1', cover: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&q=80', title: 'Best Phones Under 30K in BD', category: 'BUYING GUIDE', readTime: '10 min read', views: '18K views', badgeClass: 'bg-[#FF5B00]' }
    ],
    tags: ['Bata Eid Collection 2025', 'Bata online discount code', 'Eid shopping BD', 'Panjabi shoes Dhaka']
  },

  // 4. CREATOR / PRODUCT REVIEWS
  'story-2': {
    id: 'story-2',
    type: 'CREATOR REVIEW',
    badgeBg: 'bg-[#8B5CF6]',
    title: '30 Day Review: Samsung S24 Ultra (Nusrat)',
    subtitle: 'Nusrat Jahan puts the titanium powerhouse to the test. Is it still the best overall flagship phone in 2026?',
    coverImage: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=1200&q=80',
    author: {
      name: 'Nusrat Jahan',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&q=80',
      verified: true,
      role: 'Tech Creator',
      bio: 'Dhaka-based tech creator covering premium mobile flagships and smart ecosystems. Known for testing camera zoom on real streets.'
    },
    date: 'May 14, 2026',
    readTime: '12 min read',
    views: '24.6K views',
    rating: 4.8,
    reviews: '13.4K',
    creatorReview: {
      score: 9.4,
      scoreLabel: 'SUPERB',
      pros: [
        'Unmatched anti-reflective screen coating',
        '2-day battery life under normal load',
        'Incredible 5x optical and 100x zoom versatility',
        'Solid, rock-rigid titanium frame'
      ],
      cons: [
        'Extremely bulky and heavy for one-hand use',
        'Charging is capped at slow 45W speed',
        'Very high premium price tag'
      ],
      verdict: 'The Samsung Galaxy S24 Ultra remains one of the most complete flagship smartphones in 2026. Its screen anti-reflection alone is worth the price.'
    },
    takeaways: [
      { icon: Smartphone, text: 'Titanium frame has proven incredibly resilient against drop scuffs.' },
      { icon: Camera, text: 'The 5x optical telephoto lens is vastly more useful than the old 10x sensor.' },
      { icon: Cpu, text: 'Snapdragon 8 Gen 3 for Galaxy is exceptionally fast and does not run hot.' },
      { icon: Shield, text: 'Anti-reflective screen means you do not see your own reflection in outdoor daylight.' },
      { icon: Clock, text: '7 years of promised OS updates guarantee solid future-proof resale value.' }
    ],
    verdict: {
      buyIf: 'You want a ultimate premium productivity device with stylus, top-tier screen, and versatile zoom.',
      considerIf: 'You find a refurbished or discounted box unit in local marketplaces.',
      notForYouIf: 'You have small hands or hate carrying heavy heavy devices in trouser pockets.',
      overall: 'The S24 Ultra is the ultimate king of hardware maturity in 2026.',
      summary: 'With its anti-reflective coating, extreme zoom range, and productivity stylus, the S24 Ultra remains a peerless mobile workhorse. The battery easily beats the iPhone 15 Pro Max under everyday multi-tasking.',
      chips: ['Anti-Reflective', 'S-Pen Productivity', '100x Zoom Camera', 'Titanium build', '7 Years Updates']
    },
    evaluations: [
      { id: 'screen', title: 'Anti-Reflective Display Test', score: 9.8, content: 'Normal screens reflect up to 4% light. The S24 Ultra’s Gorilla Armor coating cuts reflections down by 75%, making the contrast outdoors look like ink on paper. It has to be seen to be believed.' },
      { id: 'battery', title: 'Real World Battery Performance', score: 9.5, content: 'Dhaka mobile data usage usually kills batteries. S24 Ultra handles 5 hours of 4G browsing, continuous navigation on Google Maps, and camera shots, ending the day with solid 35% juice remaining.' }
    ],
    faqs: [
      { question: 'Does the anti-reflective effect disappear with tempered glass?', answer: 'Yes. Putting a standard glossy tempered glass screen protector will completely negate the anti-reflective screen coating. Use official anti-reflective films instead.' },
      { question: 'Is the S-Pen actually useful?', answer: 'Perfect for signing PDF documents on the go, editing high-precision cropping on Lightroom, or acting as a remote shutter button for group photos.' }
    ],
    relatedProducts: PRODUCTS.slice(0, 3),
    relatedGuides: [
      { id: 'g-1', cover: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&q=80', title: 'Best Phones Under 30K in BD', category: 'BUYING GUIDE', readTime: '10 min read', views: '18K views', badgeClass: 'bg-[#FF5B00]' }
    ],
    tags: ['S24 Ultra review Bangladesh', 'Samsung S24 Ultra real battery life', 'Nusrat Jahan reviews S24 Ultra', 'Best flagship phones BD']
  }
};

// Default S24 Ultra fallback payload if ID does not exist in EDIT_DATABASE
const DEFAULT_PAYLOAD: EditorialContent = {
  id: 'samsung-s24',
  type: 'BUYING GUIDE',
  badgeBg: 'bg-[#000435]',
  title: 'Is the Samsung Galaxy S24 Ultra Still Worth It in 2026?',
  subtitle: 'We put Samsungs titan flagship to the test against newer releases to see if it still reigns supreme.',
  coverImage: 'https://images.unsplash.com/photo-1707343843437-caacff5cfa74?q=80&w=2000',
  author: {
    name: 'Farhan Ahmed',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&q=80',
    verified: true,
    role: 'Tech Expert & Reviewer',
    bio: '10+ years of experience reviewing consumer tech products. Testing, comparing, and recommending the best gear.'
  },
  date: 'Jan 12, 2026',
  readTime: '12 min read',
  views: '24.6K views',
  rating: 4.8,
  reviews: '13.4K',
  overallWinner: {
    product: 'Samsung Galaxy S24 Ultra',
    badge: 'BEST FLAGSHIP PHONE',
    image: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=400&h=400&fit=crop',
    rating: 4.8,
    reviewsCount: '13.4K reviews',
    score: 9.4,
    scoreLabel: 'EXCELLENT',
    highlights: [
      'Best Anti-Reflective Screen',
      'Top Tier Battery Stamina',
      'Excellent 5x Optical Zoom Camera',
      '7 Years Software Support promised'
    ]
  },
  takeaways: [
    { icon: Smartphone, text: 'Anti-reflective display technology remains unmatched in direct sunlight.' },
    { icon: Cpu, text: 'Snapdragon 8 Gen 3 still delivers flawless everyday and gaming performance.' },
    { icon: Camera, text: 'Versatile 200MP camera system captures stunning details across all zoom levels.' },
    { icon: ShieldCheck, text: 'Guaranteed software upgrades keep it fully secure and fresh for 7 years.' },
    { icon: TrendingUp, text: 'Greatly reduced local market pricing makes it an outstanding current value.' }
  ],
  verdict: {
    buyIf: 'You want a premium, flat-screen titan phone with a built-in stylus and exceptional outdoor screen viewing.',
    considerIf: 'You want a highly reliable workhorse phone that will last you easily for the next 4-5 years.',
    notForYouIf: 'You have small hands, prefer extremely lightweight phones, or want 120W crazy fast charging.',
    overall: 'The S24 Ultra is easily one of the smartest flagship investments you can make in 2026.',
    summary: 'Samsungs S24 Ultra has matured into an absolute masterpiece of value. Price drops have made its premium titanium styling, brilliant anti-reflective display, and unparalleled battery life affordable for luxury seekers.',
    chips: ['Gorilla Glass Armor', 'Built-in S-Pen', 'Superb Zoom range', '2-Day Battery Life', 'High Resale Value']
  },
  evaluations: [
    { id: 'design', title: 'Design & Titanium Durability', score: 9.5, content: 'The squared-off design feels extremely professional. The titanium grade frame resists scratches and scuffs exceptionally well, maintaining its clean premium look.' },
    { id: 'screen', title: 'Satin Display & Viewing Contrast', score: 9.8, content: 'Outdoor viewability is unmatched. The Gorilla Armor cover glass reduces glaring reflections by up to 75%, so screen content looks incredibly crisp and clear even in midday sun.' },
    { id: 'camera', title: 'High Precision Camera & Zoom Range', score: 9.3, content: 'The 200MP sensor and new 5x telephoto are incredibly optimized. Real-life daylight portraits show exceptional contrast and natural skin tones, with low-light night shots highly noise-suppressed.' }
  ],
  faqs: [
    { question: 'Is S24 Ultra still future-proof in 2026?', answer: 'Absolutely. Samsung promised 7 full years of Android OS and security upgrades, meaning it is supported until 2031.' },
    { question: 'Does S24 Ultra support e-SIM in Bangladesh?', answer: 'Yes, it supports dual physical nano-SIM cards as well as eSIM profile activation simultaneously.' }
  ],
  relatedProducts: PRODUCTS.slice(0, 4),
  relatedGuides: [
    { id: 'g-1', cover: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&q=80', title: 'Best Phones Under 30K in BD', category: 'BUYING GUIDE', readTime: '10 min read', views: '18K views', badgeClass: 'bg-[#FF5B00]' },
    { id: 'story-2', cover: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=600&q=80', title: '30 Day Review: Samsung S24 Ultra', category: 'CREATOR REVIEW', readTime: '12 min read', views: '24K views', badgeClass: 'bg-[#8B5CF6]' }
  ],
  tags: ['Samsung Galaxy S24 Ultra review', 'S24 Ultra BD price 2026', 'Best flagships 2026', 'Gorilla Glass Armor review']
};

export function ContentDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // Resolve content data using our dynamic content database
  const content = getEditorialContent(id) as any;
  
  const [isSaved, setIsSaved] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  
  // Interactive comments state
  const [comments, setComments] = useState<{
    id: number;
    user: string;
    avatar: string;
    rating: number;
    comment: string;
    date: string;
    likes: number;
    liked?: boolean;
  }[]>([
    { id: 1, user: 'Abrar Chowdhury', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop', rating: 5, comment: 'Hands down the most helpful guide. Finally a resource that actually tests these on our local Bangladeshi roads and weather conditions!', date: '2 days ago', likes: 18 },
    { id: 2, user: 'Tasnim Karim', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop', rating: 4, comment: 'Completely agree about the anti-reflective screen. It makes outdoor maps navigation so much easier. Exceptional write-up.', date: '1 day ago', likes: 6 }
  ]);
  const [newCommentText, setNewCommentText] = useState('');
  const [newCommentRating, setNewCommentRating] = useState(5);
  
  // Animated Video Player Mockup state
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [videoProgress, setVideoProgress] = useState(25); // percentage
  const [videoTime, setVideoTime] = useState('02:45');
  const [volume, setVolume] = useState(80);
  const videoIntervalRef = useRef<any>(null);

  // Campaign countdown states (simulated live tickers)
  const [countdown, setCountdown] = useState({ hours: 14, minutes: 22, seconds: 45 });

  // Copy code trigger
  const [copiedCode, setCopiedCode] = useState(false);

  // Live Shopping specialized interactive states
  const [liveChatMessages, setLiveChatMessages] = useState<{ id: number; user: string; text: string; time: string }[]>([
    { id: 1, user: 'Imran Khan', text: 'Does it have a global warranty?', time: '12:02' },
    { id: 2, user: 'Farah S.', text: 'Voucher code is working guys! Just saved BDT 5,000!', time: '12:04' },
    { id: 3, user: 'Asif Karim', text: 'How is the low-light zoom comparison?', time: '12:05' }
  ]);
  const [newLiveChatMessage, setNewLiveChatMessage] = useState('');
  const [reminderSet, setReminderSet] = useState(false);
  const [activeChapterIndex, setActiveChapterIndex] = useState(0);
  const [featuredProductInChapter, setFeaturedProductInChapter] = useState<any>(null);

  useEffect(() => {
    // Scroll to top when loading new content
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setIsVideoPlaying(false);
    setVideoProgress(15);
    setVideoTime('01:15');
  }, [id]);

  // Video timer simulation
  useEffect(() => {
    if (isVideoPlaying) {
      videoIntervalRef.current = setInterval(() => {
        setVideoProgress((prev) => {
          if (prev >= 100) {
            setIsVideoPlaying(false);
            return 0;
          }
          const next = prev + 0.5;
          const seconds = Math.floor((next * 120) / 100);
          const mins = Math.floor(seconds / 60);
          const secs = seconds % 60;
          setVideoTime(`${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`);
          return next;
        });
      }, 300);
    } else {
      if (videoIntervalRef.current) clearInterval(videoIntervalRef.current);
    }
    return () => {
      if (videoIntervalRef.current) clearInterval(videoIntervalRef.current);
    };
  }, [isVideoPlaying]);

  // Countdown clock simulation
  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return { hours: 24, minutes: 0, seconds: 0 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleSaveToggle = () => {
    setIsSaved(!isSaved);
    toast.success(isSaved ? 'Removed from saved collection' : 'Saved to your personal collection!');
  };

  const handleFollowToggle = () => {
    setIsFollowing(!isFollowing);
    toast.success(isFollowing ? `Unfollowed ${content.author.name}` : `You are now following ${content.author.name}!`);
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success('Link copied to clipboard! Share it with friends.');
  };

  const handleCopyVoucherCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(true);
    toast.success('Coupon code copied to clipboard!');
    setTimeout(() => setCopiedCode(false), 3000);
  };

  const handlePostComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommentText.trim()) return;

    const commentObj = {
      id: comments.length + 1,
      user: 'Anonymous Shopper',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop',
      rating: newCommentRating,
      comment: newCommentText.trim(),
      date: 'Just now',
      likes: 0
    };

    setComments([commentObj, ...comments]);
    setNewCommentText('');
    toast.success('Your review has been posted successfully!');
  };

  const handleLikeComment = (commentId: number) => {
    setComments(prev => prev.map(c => {
      if (c.id === commentId) {
        return {
          ...c,
          liked: !c.liked,
          likes: c.liked ? c.likes - 1 : c.likes + 1
        };
      }
      return c;
    }));
  };

  return (
    <div id="choosify_universal_details_page" className="bg-[#F8F9FC] min-h-screen font-sans antialiased text-[#000435] pb-24">
      
      {/* 1. STICKY NAV REUSE (Accommodated inside general App.tsx layouts, matching global theme) */}

      {/* 2. DYNAMIC HERO HEADER SECTION */}
      <section className="w-full bg-[#000435] text-white pt-12 pb-24 px-6 lg:px-16 relative overflow-hidden">
        {/* Abstract Glowing Aura */}
        <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-[-30%] left-[-10%] w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none" />
        
        <div className="max-w-[1440px] mx-auto relative z-10">
          {/* Breadcrumb Grid */}
          <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400 mb-8 font-semibold tracking-wider uppercase">
            <Link to="/" className="hover:text-[#FF5B00] transition-colors">Home</Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
            <Link to="/discover" className="hover:text-[#FF5B00] transition-colors">Discover</Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
            <span className="text-white truncate max-w-xs">{content.title}</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-12 lg:gap-16 items-center">
            
            {/* Left Column (60% equivalent) */}
            <div className="flex flex-col">
              <div className="flex flex-wrap gap-2 mb-6">
                <span className={cn("text-[10px] font-bold text-white px-3.5 py-1.5 rounded-full tracking-widest uppercase shadow-md", content.badgeBg)}>
                  {content.type}
                </span>
                {content.campaignBlock && (
                  <span className="text-[10px] font-bold text-white px-3.5 py-1.5 rounded-full tracking-widest uppercase bg-[#FF5B00] flex items-center gap-1 shadow-md">
                    <Flame className="w-3 h-3 fill-current animate-pulse" /> LIMITED DEAL
                  </span>
                )}
              </div>

              <h1 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-black leading-[1.1] mb-6 tracking-tight text-white">
                {content.title}
              </h1>

              <p className="text-base md:text-lg text-slate-300 font-medium leading-relaxed mb-8 max-w-2xl">
                {content.subtitle}
              </p>

              {/* Creator Metadata block */}
              <div className="flex items-center gap-4 mb-8 border-b border-white/10 pb-8">
                <img 
                  src={content.author.avatar} 
                  alt={content.author.name} 
                  className="w-12 h-12 rounded-full object-cover border-2 border-[#FF5B00]/40 shadow-lg shrink-0" 
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="font-extrabold text-sm md:text-base text-white truncate">{content.author.name}</span>
                    {content.author.verified && <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />}
                  </div>
                  <div className="flex flex-wrap items-center gap-2 text-[11px] md:text-xs text-slate-400 font-semibold mt-0.5">
                    <span>{content.author.role}</span>
                    <span className="w-1 h-1 rounded-full bg-slate-600 shrink-0" />
                    <span>{content.date}</span>
                    <span className="w-1 h-1 rounded-full bg-slate-600 shrink-0" />
                    <span className="flex items-center gap-1 text-[#FF5B00]"><Eye className="w-3.5 h-3.5" /> {content.views}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons Row */}
              <div className="flex flex-wrap items-center gap-3">
                {/* Save Button */}
                <button 
                  onClick={handleSaveToggle}
                  className={cn(
                    "px-6 py-3.5 rounded-full text-xs font-bold tracking-wider uppercase transition-all flex items-center gap-2 shrink-0 border",
                    isSaved 
                      ? "bg-[#FF5B00] border-[#FF5B00] text-white shadow-lg shadow-[#FF5B00]/20" 
                      : "bg-white/10 border-white/10 text-white hover:bg-white/20"
                  )}
                >
                  <Bookmark className={cn("w-4 h-4", isSaved && "fill-current")} />
                  {isSaved ? 'Saved in Library' : 'Save Collection'}
                </button>

                {/* Follow Button */}
                <button 
                  onClick={handleFollowToggle}
                  className={cn(
                    "px-6 py-3.5 rounded-full text-xs font-bold tracking-wider uppercase transition-all flex items-center gap-2 shrink-0 border",
                    isFollowing 
                      ? "bg-emerald-500 border-emerald-500 text-white shadow-lg shadow-emerald-500/20" 
                      : "bg-white/10 border-white/10 text-white hover:bg-white/20"
                  )}
                >
                  {isFollowing ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                  {isFollowing ? 'Following Creator' : 'Follow Creator'}
                </button>

                {/* Share Button */}
                <button 
                  onClick={handleShare}
                  className="px-6 py-3.5 rounded-full text-xs font-bold tracking-wider uppercase bg-white/10 border border-white/10 text-white hover:bg-white/20 transition-all flex items-center gap-2 shrink-0"
                >
                  <Share2 className="w-4 h-4" /> Share
                </button>
              </div>

            </div>

            {/* Right Column (40% equivalent) - Contextual Media Block */}
            <div className="w-full flex justify-center">
              <div className="w-full max-w-[440px] rounded-[28px] overflow-hidden shadow-2xl border-2 border-white/10 bg-black/90 flex flex-col">
                
                {content.isLiveShopping ? (
                  // ==========================================
                  // LIVE SHOPPING SPECIALIZED PORTLET CARD
                  // ==========================================
                  <div className="w-full flex flex-col h-[520px]">
                    
                    {/* Live Stream Viewport */}
                    {content.liveState === 'LIVE NOW' && (
                      <div className="flex-1 flex flex-col bg-slate-900 relative overflow-hidden min-h-[220px]">
                        {/* Stream cover image backdrop with subtle moving glow */}
                        <img 
                          src={content.coverImage} 
                          alt="" 
                          className="absolute inset-0 w-full h-full object-cover opacity-30 animate-pulse duration-[8000ms]" 
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/40 to-transparent" />

                        {/* Stream Header Info */}
                        <div className="absolute top-4 left-4 right-4 z-20 flex items-center justify-between pointer-events-none">
                          <span className="bg-red-600 text-white font-black text-[9px] px-3 py-1 rounded-full flex items-center gap-1.5 animate-pulse shadow-md">
                            <span className="w-1.5 h-1.5 rounded-full bg-white block" /> LIVE NOW
                          </span>
                          <span className="bg-black/60 backdrop-blur-md text-white font-bold text-[10px] px-3 py-1 rounded-full flex items-center gap-1">
                            <Eye className="w-3.5 h-3.5 text-[#FF5B00]" /> {content.viewerCount || '4,850'} WATCHING
                          </span>
                        </div>

                        {/* Floating Platform Tag */}
                        <div className="absolute top-14 left-4 z-20 bg-[#FF5B00]/90 backdrop-blur-md text-white font-extrabold text-[8px] tracking-widest px-2.5 py-1 rounded">
                          {content.platform?.toUpperCase()} STREAM
                        </div>

                        {/* Animated Video Stream Mockup Overlay */}
                        <div className="flex-1 flex flex-col items-center justify-center relative p-6">
                          <div className="w-12 h-12 rounded-full bg-white/15 backdrop-blur-md border border-white/20 flex items-center justify-center animate-bounce">
                            <Play className="w-5 h-5 fill-white text-white ml-0.5" />
                          </div>
                          <span className="text-white/60 font-mono text-[9px] tracking-widest uppercase mt-3">Streaming Active Unboxing</span>
                        </div>

                        {/* Bottom Bar Info Overlay */}
                        <div className="p-4 bg-slate-950/85 border-t border-white/5 z-10 flex items-center justify-between">
                          <div className="text-left">
                            <p className="text-[9px] font-black text-[#FF5B00] uppercase tracking-wider">Host & Anchor</p>
                            <h4 className="text-xs font-extrabold text-white">{content.author.name}</h4>
                          </div>
                          <div className="bg-[#FF5B00] text-white text-[9px] font-black px-3 py-1.5 rounded-lg flex items-center gap-1">
                            <Ticket className="w-3.5 h-3.5" /> CODE: S26LIVE
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Upcoming Live Widget */}
                    {content.liveState === 'UPCOMING' && (
                      <div className="flex-1 flex flex-col bg-slate-950 relative overflow-hidden p-6 text-center justify-between">
                        {/* Faded backdrop */}
                        <img 
                          src={content.coverImage} 
                          alt="" 
                          className="absolute inset-0 w-full h-full object-cover opacity-20 pointer-events-none" 
                        />
                        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/90 via-slate-900/60 to-slate-950" />

                        <div className="relative z-10 flex flex-col items-center pt-4">
                          <div className="w-14 h-14 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mb-4 text-emerald-400 animate-pulse">
                            <Bell className="w-6 h-6" />
                          </div>
                          <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[9px] font-black tracking-widest px-3 py-1 rounded-full uppercase mb-4">
                            Scheduled Broadcast
                          </span>
                          <h3 className="text-white text-lg font-black tracking-tight leading-snug px-4">
                            {content.title}
                          </h3>
                        </div>

                        {/* Digital Ticker Block */}
                        <div className="relative z-10 my-6 bg-white/5 border border-white/10 rounded-2xl p-4 mx-2">
                          <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-2">Starts In</div>
                          <div className="flex justify-center items-center gap-4 font-mono">
                            <div>
                              <span className="text-2xl font-black text-white">01</span>
                              <p className="text-[8px] text-slate-500 uppercase font-semibold mt-0.5">Day</p>
                            </div>
                            <span className="text-xl font-black text-[#FF5B00] -mt-4">:</span>
                            <div>
                              <span className="text-2xl font-black text-white">18</span>
                              <p className="text-[8px] text-slate-500 uppercase font-semibold mt-0.5">Hours</p>
                            </div>
                            <span className="text-xl font-black text-[#FF5B00] -mt-4">:</span>
                            <div>
                              <span className="text-2xl font-black text-white">42</span>
                              <p className="text-[8px] text-slate-500 uppercase font-semibold mt-0.5">Mins</p>
                            </div>
                            <span className="text-xl font-black text-[#FF5B00] -mt-4">:</span>
                            <div>
                              <span className="text-2xl font-black text-white">15</span>
                              <p className="text-[8px] text-slate-500 uppercase font-semibold mt-0.5">Secs</p>
                            </div>
                          </div>
                        </div>

                        {/* Booking CTAs */}
                        <div className="relative z-10 flex flex-col gap-2.5 pb-2">
                          <button 
                            onClick={() => {
                              setReminderSet(true);
                              toast.success("Reminder Active! We will alert you 10 mins before start 🔔");
                            }}
                            className={cn(
                              "w-full py-3.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center justify-center gap-2",
                              reminderSet 
                                ? "bg-emerald-600 text-white shadow-lg" 
                                : "bg-[#FF5B00] hover:bg-[#E05000] text-white shadow-lg shadow-[#FF5B00]/20"
                            )}
                          >
                            <Bell className="w-4 h-4 fill-current" />
                            {reminderSet ? 'SMS & Email Reminder Set' : 'Set Stream Reminder'}
                          </button>
                          
                          <button 
                            onClick={() => toast.success("Event added to Google Calendar! 📅")}
                            className="w-full py-3 bg-white/10 hover:bg-white/20 border border-white/10 rounded-xl text-xs font-bold uppercase text-white transition-all flex items-center justify-center gap-2"
                          >
                            <Calendar className="w-4 h-4" /> Add to Google Calendar
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Replay Video chapters Widget */}
                    {content.liveState === 'REPLAY' && (
                      <div className="flex-1 flex flex-col bg-slate-900 relative overflow-hidden min-h-[220px]">
                        <img 
                          src={content.coverImage} 
                          alt="" 
                          className={cn(
                            "absolute inset-0 w-full h-full object-cover transition-opacity duration-500 pointer-events-none",
                            isVideoPlaying ? "opacity-20" : "opacity-100"
                          )} 
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/40 to-transparent" />

                        {/* Floating watermark */}
                        <div className="absolute top-4 left-4 z-20 flex items-center gap-1.5 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full text-[10px] font-bold text-[#FF5B00]">
                          <Youtube className="w-3.5 h-3.5 fill-current" /> RECORDED REPLAY
                        </div>

                        {/* Interactive Replay button */}
                        {!isVideoPlaying && (
                          <button 
                            onClick={() => {
                              setIsVideoPlaying(true);
                              toast.success("Launching unboxing replay session...");
                            }}
                            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-white text-[#000435] rounded-full flex items-center justify-center shadow-2xl hover:scale-110 active:scale-95 transition-transform z-20 group"
                          >
                            <Play className="w-6 h-6 fill-current ml-1 text-[#FF5B00]" />
                          </button>
                        )}

                        {/* Replay stream player */}
                        {isVideoPlaying && (
                          <div className="absolute inset-0 z-20 flex flex-col justify-end p-6 text-white bg-black/45">
                            <div className="flex items-center gap-3 mb-4">
                              <button 
                                onClick={() => setIsVideoPlaying(false)} 
                                className="p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
                              >
                                <Pause className="w-4 h-4 fill-current text-white" />
                              </button>
                              <div className="flex-1">
                                <span className="text-[9px] font-black text-indigo-400 uppercase tracking-widest">Replaying Session</span>
                                <div className="text-[10px] text-slate-200 truncate font-semibold">{content.title}</div>
                              </div>
                              <span className="text-[11px] font-mono font-bold bg-black/40 px-2 py-0.5 rounded">{videoTime}</span>
                            </div>

                            {/* Timeline with highlight dot */}
                            <div className="relative w-full h-1 bg-white/20 rounded-full mb-3 overflow-hidden cursor-pointer">
                              <div className="absolute left-0 top-0 h-full bg-[#FF5B00] transition-all" style={{ width: `${videoProgress}%` }} />
                            </div>

                            {/* Volume bar and speed selection */}
                            <div className="flex items-center justify-between border-t border-white/5 pt-2">
                              <span className="text-[9px] text-slate-400 font-mono">Speed: 1.0x (Normal)</span>
                              <span className="text-[9px] text-[#FF5B00] font-black uppercase tracking-wider">Duration: {content.duration}</span>
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Bottom Dynamic Interactive Console */}
                    {content.liveState === 'LIVE NOW' ? (
                      // Live Chat scrolling log for Active Streams
                      <div className="h-[260px] bg-slate-950 border-t border-white/10 flex flex-col justify-between p-4">
                        <div className="text-left border-b border-white/5 pb-2 flex justify-between items-center shrink-0">
                          <span className="text-[9px] font-black tracking-widest text-slate-400 uppercase">Live Chat Feed</span>
                          <span className="text-[9px] font-semibold text-emerald-400 flex items-center gap-1">
                            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full inline-block animate-pulse" /> Active Connecting
                          </span>
                        </div>

                        {/* Scrolling list */}
                        <div className="flex-1 overflow-y-auto py-2 flex flex-col gap-2 scrollbar-hide text-left">
                          {liveChatMessages.map((msg) => (
                            <div key={msg.id} className="text-xs">
                              <span className="text-slate-400 font-black mr-1.5">{msg.user}</span>
                              <span className="text-slate-200">{msg.text}</span>
                              <span className="text-[8px] text-slate-600 float-right mt-1">{msg.time}</span>
                            </div>
                          ))}
                        </div>

                        {/* Input chat form */}
                        <form 
                          onSubmit={(e) => {
                            e.preventDefault();
                            if (!newLiveChatMessage.trim()) return;
                            const newMsg = {
                              id: liveChatMessages.length + 1,
                              user: 'You (Shopper)',
                              text: newLiveChatMessage.trim(),
                              time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                            };
                            setLiveChatMessages([...liveChatMessages, newMsg]);
                            setNewLiveChatMessage('');
                            toast.success("Comment sent live!");
                          }}
                          className="flex items-center gap-2 mt-2 pt-2 border-t border-white/5 shrink-0"
                        >
                          <input 
                            type="text"
                            placeholder="Ask the host anything..."
                            value={newLiveChatMessage}
                            onChange={(e) => setNewLiveChatMessage(e.target.value)}
                            className="flex-1 bg-slate-900 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#FF5B00] transition-colors"
                          />
                          <button 
                            type="submit"
                            className="w-8 h-8 rounded-lg bg-[#FF5B00] text-white flex items-center justify-center hover:bg-[#E05000] shrink-0"
                          >
                            <Send className="w-3.5 h-3.5" />
                          </button>
                        </form>
                      </div>
                    ) : content.liveState === 'REPLAY' ? (
                      // Chapter Selector log for Replay Streams
                      <div className="h-[260px] bg-slate-950 border-t border-white/10 flex flex-col p-4 text-left justify-between">
                        <div className="border-b border-white/5 pb-2 shrink-0">
                          <span className="text-[9px] font-black tracking-widest text-slate-400 uppercase">Interactive Video Chapters</span>
                        </div>

                        {/* Chapter timeline list */}
                        <div className="flex-1 overflow-y-auto py-2 flex flex-col gap-1.5 scrollbar-hide">
                          {content.videoChapters?.map((chap: any, idx: number) => {
                            const isActive = activeChapterIndex === idx;
                            return (
                              <button
                                key={idx}
                                onClick={() => {
                                  setActiveChapterIndex(idx);
                                  setIsVideoPlaying(true);
                                  // Update progress bar
                                  const totalSeconds = 70 * 60; // 70 minutes mock
                                  const timeParts = chap.time.split(':').map(Number);
                                  const chapSeconds = timeParts.length === 3 
                                    ? timeParts[0] * 3600 + timeParts[1] * 60 + timeParts[2]
                                    : timeParts[0] * 60 + timeParts[1];
                                  const percentage = (chapSeconds / totalSeconds) * 100;
                                  setVideoProgress(percentage);
                                  setVideoTime(chap.time);
                                  
                                  // Assign product alert depending on chapter index
                                  const mentionedProduct = content.productsMentioned?.[idx % content.productsMentioned.length];
                                  if (mentionedProduct) {
                                    setFeaturedProductInChapter(mentionedProduct);
                                    toast.success(`Seeking to ${chap.title}! Mentioned product loaded.`, { duration: 4000 });
                                  } else {
                                    setFeaturedProductInChapter(null);
                                    toast.success(`Seeking to chapter: ${chap.title}`);
                                  }
                                }}
                                className={cn(
                                  "w-full p-2.5 rounded-xl text-xs text-left transition-all border flex items-start gap-2.5",
                                  isActive 
                                    ? "bg-[#FF5B00]/10 border-[#FF5B00]/30 text-white" 
                                    : "bg-slate-900/50 border-white/5 text-slate-300 hover:bg-slate-900 hover:border-white/10"
                                )}
                              >
                                <span className="bg-[#FF5B00] text-white font-mono font-black text-[9px] px-1.5 py-0.5 rounded shrink-0">
                                  {chap.time}
                                </span>
                                <div className="flex-1 min-w-0">
                                  <h5 className="font-extrabold truncate">{chap.title}</h5>
                                  <p className="text-[10px] text-slate-400 line-clamp-1 mt-0.5">{chap.description}</p>
                                </div>
                              </button>
                            );
                          })}
                        </div>

                        {/* Interactive Contextual chapter popup overlay */}
                        {featuredProductInChapter && (
                          <div className="bg-slate-900 border border-white/10 rounded-xl p-2 mt-2 flex items-center justify-between shrink-0">
                            <div className="flex items-center gap-2 min-w-0">
                              <img 
                                src={featuredProductInChapter.image} 
                                alt="" 
                                className="w-8 h-8 object-contain bg-white/5 rounded" 
                              />
                              <div className="min-w-0">
                                <p className="text-[8px] text-slate-400 uppercase font-black tracking-wider leading-none">CHAPTER HIGHLIGHT</p>
                                <p className="text-[10px] font-extrabold text-white truncate leading-snug">{featuredProductInChapter.name}</p>
                              </div>
                            </div>
                            <Link 
                              to={`/brands/${featuredProductInChapter.brandId || 'samsung'}`}
                              className="text-[9px] font-black text-[#FF5B00] uppercase tracking-wider hover:underline shrink-0 pl-2"
                            >
                              Compare & Buy
                            </Link>
                          </div>
                        )}
                      </div>
                    ) : (
                      // Upcoming session detail box
                      <div className="h-[260px] bg-slate-950 border-t border-white/10 p-5 flex flex-col justify-between text-left shrink-0">
                        <div>
                          <p className="text-[9px] font-black tracking-widest text-slate-400 uppercase mb-2">Live Session Target Items</p>
                          <div className="flex flex-col gap-2.5">
                            {content.productsMentioned?.map((prod: any, idx: number) => (
                              <div key={idx} className="flex items-center gap-3 bg-white/5 p-2 rounded-xl border border-white/5">
                                <img src={prod.image} alt="" className="w-10 h-10 object-contain bg-white rounded-lg p-1 shrink-0" />
                                <div className="flex-1 min-w-0">
                                  <h4 className="text-xs font-black text-white truncate">{prod.name}</h4>
                                  <p className="text-[10px] font-bold text-slate-400">{prod.price}</p>
                                </div>
                                <span className="bg-emerald-500/10 text-emerald-400 text-[8px] font-bold tracking-widest px-2 py-0.5 rounded border border-emerald-500/20 uppercase">
                                  LIVE DISCOUNT
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                        <p className="text-[9.5px] text-slate-400 italic">★ Exclusive live discounts and bundle vouchers will drop during flight demonstration.</p>
                      </div>
                    )}
                  </div>
                ) : (
                  // ==========================================
                  // ORIGINAL GENERAL HIGH-RES POSTER GRID FOR EDITORIALS / STORIES / GUIDES
                  // ==========================================
                  <div className="w-full h-full relative group min-h-[400px]">
                    <img 
                      src={content.coverImage} 
                      alt={content.title} 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-transparent" />
                    
                    {/* Floating Branding logo */}
                    <div className="absolute bottom-6 left-6 right-6 z-10 text-white text-left">
                      <div className="text-xs font-black text-[#FF5B00] uppercase tracking-wider mb-1">Choosify Verified Content</div>
                      <p className="text-sm font-medium text-slate-200/95 leading-snug">Every recommendation is backed by real rigorous comparison testing.</p>
                    </div>
                  </div>
                )}

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 3. DYNAMIC MODULES SECTION */}
      <main className="max-w-[1440px] mx-auto px-6 lg:px-16 -mt-10 relative z-20">

        {/* ========================================================================================================= */}
        {/* MODULE 1: BUYING GUIDE WINNER CARD */}
        {/* ========================================================================================================= */}
        {content.overallWinner && (
          <div className="bg-[#000435] rounded-[32px] p-8 md:p-10 flex flex-col lg:flex-row items-center gap-8 md:gap-12 shadow-2xl mb-12 relative overflow-hidden border border-white/5">
            {/* Ambient Background Aura */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-blue-600/10 rounded-full blur-[110px] pointer-events-none" />
            
            <div className="w-full lg:w-[320px] shrink-0 bg-white/5 rounded-2xl p-6 relative overflow-hidden flex flex-col items-center justify-center border border-white/10 group">
              <div className="absolute inset-0 bg-gradient-to-b from-blue-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
              <img 
                src={content.overallWinner.image} 
                alt={content.overallWinner.product} 
                className="max-h-48 object-contain drop-shadow-2xl z-10 transition-transform duration-500 group-hover:scale-105" 
              />
            </div>

            <div className="flex-1 text-white z-10">
              <div className="flex items-center gap-2 mb-4">
                <Award className="w-6 h-6 text-[#FF5B00]" />
                <span className="text-sm font-extrabold uppercase tracking-widest text-[#FF5B00]">OVERALL TEST WINNER</span>
              </div>

              <div className="flex flex-wrap items-start justify-between gap-6">
                <div className="max-w-md">
                  <span className="inline-block bg-[#FF5B00] text-white text-[9px] font-black uppercase tracking-wider px-2.5 py-1 rounded mb-3">
                    {content.overallWinner.badge}
                  </span>
                  <h2 className="text-2xl md:text-3xl font-black mb-3 leading-tight tracking-tight">{content.overallWinner.product}</h2>
                  <div className="flex items-center gap-2 mb-6">
                    <div className="flex text-[#FF5B00]">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <Star key={i} className="w-4 h-4 fill-current" />
                      ))}
                    </div>
                    <span className="font-bold text-sm text-slate-200">{content.overallWinner.rating}</span>
                    <span className="text-slate-400 text-xs font-medium">({content.overallWinner.reviewsCount})</span>
                  </div>
                  
                  <Link 
                    to="/products" 
                    className="text-[#FF5B00] font-black flex items-center gap-1.5 text-xs tracking-wider uppercase hover:text-[#EB4501] transition-colors group"
                  >
                    Compare prices on Choosify 
                    <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1.5 transition-transform" />
                  </Link>
                </div>

                {/* Highlights List */}
                <div className="space-y-3 max-w-xs">
                  {content.overallWinner.highlights.map((highlight: string, idx: number) => (
                    <div key={idx} className="flex items-center gap-3">
                      <div className="w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center shrink-0">
                        <Check className="w-3 h-3 text-emerald-400" />
                      </div>
                      <span className="font-semibold text-xs md:text-sm text-slate-200">{highlight}</span>
                    </div>
                  ))}
                </div>

                {/* score circle block */}
                <div className="bg-white/5 border border-white/10 rounded-2xl p-6 text-center min-w-[140px] shadow-inner">
                  <div className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mb-1">Choosify Score</div>
                  <div className="text-5xl font-black text-[#FF5B00] mb-1">{content.overallWinner.score}</div>
                  <div className="text-[10px] font-bold text-slate-400 mb-3">Out of 10</div>
                  <span className="inline-block px-3 py-1 bg-emerald-500/20 text-emerald-400 font-extrabold text-[9px] uppercase tracking-wider rounded-full">
                    {content.overallWinner.scoreLabel}
                  </span>
                </div>

              </div>
            </div>
          </div>
        )}

        {/* ========================================================================================================= */}
        {/* MODULE: WHERE TO BUY & BEST DEALS COMPARISON */}
        {/* ========================================================================================================= */}
        {content.priceStores && content.priceStores.length > 0 && (
          <div className="bg-white rounded-[32px] p-6 md:p-10 shadow-soft mb-12 border border-slate-100/80 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50/40 rounded-full blur-2xl pointer-events-none" />
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <Sparkles className="w-5 h-5 text-[#FF5B00] animate-pulse" />
                  <h3 className="text-sm md:text-base font-black text-[#000435] uppercase tracking-widest">
                    WHERE TO BUY & BEST DEALS
                  </h3>
                </div>
                <p className="text-xs text-slate-400 font-semibold">
                  Verified local stockists and direct import channels in Bangladesh
                </p>
              </div>
              <span className="bg-emerald-50 text-emerald-600 border border-emerald-200/50 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-wider shrink-0 shadow-sm">
                Verified Deal Price
              </span>
            </div>

            {/* Desktop Table View */}
            <div className="hidden md:block overflow-hidden rounded-2xl border border-slate-100">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#F8F9FC] border-b border-slate-100 text-[11px] font-black text-slate-400 uppercase tracking-widest">
                    <th className="p-5">Store Details</th>
                    <th className="p-5">Delivery Commitment</th>
                    <th className="p-5">Seller Rating</th>
                    <th className="p-5 text-right">Best Price</th>
                    <th className="p-5 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {content.priceStores.map((store: any, idx: number) => (
                    <tr key={idx} className="hover:bg-slate-50/50 transition-colors text-xs md:text-sm">
                      <td className="p-5 font-bold text-[#000435] flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center font-black text-[#FF5B00] border border-slate-200/50 text-base shrink-0">
                          {store.name[0]}
                        </div>
                        <div className="flex flex-col">
                          <span className="text-slate-800 text-sm font-bold">{store.name}</span>
                          {store.isBest && (
                            <span className="text-[9px] text-[#FF5B00] font-black uppercase tracking-widest mt-0.5 flex items-center gap-1">
                              <Flame className="w-3 h-3 fill-current" /> BEST OFFER
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="p-5 font-bold text-slate-500 text-xs md:text-sm">{store.delivery}</td>
                      <td className="p-5">
                        <div className="flex items-center gap-1 font-bold text-[#000435]">
                          <Star className="w-4 h-4 fill-[#FF5B00] text-[#FF5B00]" />
                          <span className="text-sm">{store.rating.toFixed(1)}</span>
                        </div>
                      </td>
                      <td className="p-5 text-right font-black text-[#FF5B00] text-lg md:text-xl">{store.price}</td>
                      <td className="p-5 text-right">
                        <a 
                          href={store.link}
                          target="_blank"
                          rel="noreferrer"
                          onClick={() => toast.success(`Redirecting to ${store.name} portal...`)}
                          className="inline-flex items-center gap-2 bg-[#000435] hover:bg-[#FF5B00] text-white font-bold text-xs uppercase tracking-widest px-5 py-3 rounded-xl transition-all shadow-md hover:-translate-y-0.5 active:translate-y-0"
                        >
                          Go to Store <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards View */}
            <div className="block md:hidden space-y-4">
              {content.priceStores.map((store: any, idx: number) => (
                <div key={idx} className="bg-slate-50/50 rounded-2xl p-5 border border-slate-100 flex flex-col gap-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-full bg-white flex items-center justify-center font-black text-[#FF5B00] border border-slate-200/50 text-sm">
                        {store.name[0]}
                      </div>
                      <div className="flex flex-col">
                        <span className="font-bold text-[#000435] text-sm">{store.name}</span>
                        {store.isBest && (
                          <span className="text-[9px] text-[#FF5B00] font-black uppercase tracking-widest mt-0.5 flex items-center gap-1">
                            <Flame className="w-2.5 h-2.5 fill-current" /> BEST OFFER
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-1 font-bold text-slate-800 text-xs">
                      <Star className="w-3.5 h-3.5 fill-[#FF5B00] text-[#FF5B00]" />
                      <span>{store.rating.toFixed(1)}</span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center border-t border-b border-slate-100 py-3 text-xs font-semibold text-slate-500">
                    <div>
                      <div className="text-[9px] font-black uppercase tracking-wider text-slate-400 mb-0.5">Delivery Time</div>
                      <span>{store.delivery}</span>
                    </div>
                    <div className="text-right">
                      <div className="text-[9px] font-black uppercase tracking-wider text-slate-400 mb-0.5">Best Deal</div>
                      <span className="text-base font-black text-[#FF5B00]">{store.price}</span>
                    </div>
                  </div>

                  <a 
                    href={store.link}
                    target="_blank"
                    rel="noreferrer"
                    onClick={() => toast.success(`Redirecting to ${store.name} portal...`)}
                    className="w-full text-center bg-[#000435] hover:bg-[#FF5B00] text-white font-bold text-xs uppercase tracking-widest py-3.5 rounded-xl transition-all shadow-sm flex items-center justify-center gap-2"
                  >
                    Go to Store <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================================================================= */}
        {/* MODULE 2: CAMPAIGN SUMMARY BLOCK (DISCOUNTS & CTA) */}
        {/* ========================================================================================================= */}
        {content.campaignBlock && (
          <div className="bg-white rounded-[32px] p-8 md:p-10 shadow-soft mb-12 border border-slate-100 flex flex-col md:flex-row justify-between items-center gap-8 relative overflow-hidden">
            {/* Side Accent line */}
            <div className="absolute top-0 left-0 w-2 h-full bg-[#EC4899]" />
            
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-3">
                <Ticket className="w-5 h-5 text-[#EC4899]" />
                <span className="text-xs font-extrabold uppercase tracking-wider text-[#EC4899]">VOUCHER CAMPAIGN SPONSOR</span>
              </div>
              <h3 className="text-xl md:text-2xl font-black text-[#000435] mb-2">{content.campaignBlock.sponsorName}</h3>
              <p className="text-sm font-semibold text-slate-400 mb-6">{content.campaignBlock.discountAmount}</p>

              {/* Promo code copy block */}
              <div className="flex flex-col sm:flex-row items-stretch gap-3 max-w-md">
                <div className="bg-[#F8F9FC] border-2 border-dashed border-slate-200 rounded-xl px-5 py-3.5 flex items-center justify-between gap-4 font-mono font-bold text-lg text-[#000435]">
                  <span>{content.campaignBlock.voucherCode}</span>
                  <button 
                    onClick={() => handleCopyVoucherCode(content.campaignBlock!.voucherCode)}
                    className="text-slate-400 hover:text-[#FF5B00] transition-colors"
                    title="Copy promo code"
                  >
                    <Copy className="w-5 h-5" />
                  </button>
                </div>
                <button 
                  onClick={() => handleCopyVoucherCode(content.campaignBlock!.voucherCode)}
                  className="bg-[#000435] hover:bg-[#FF5B00] text-white font-bold text-xs uppercase tracking-wider px-6 py-3 rounded-xl transition-all"
                >
                  {copiedCode ? 'COPIED!' : 'COPY CODE'}
                </button>
              </div>
            </div>

            {/* Simulated interactive ticking clock */}
            <div className="flex flex-col items-center shrink-0 bg-[#F8F9FC] border border-slate-100 p-6 rounded-2xl min-w-[200px]">
              <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mb-3">FLASH TIMER</span>
              <div className="flex gap-2 text-[#000435] font-mono text-2xl font-black">
                <div className="flex flex-col items-center bg-white border border-slate-200/50 px-3 py-2 rounded-lg shadow-sm">
                  <span>{countdown.hours.toString().padStart(2, '0')}</span>
                  <span className="text-[9px] font-bold text-slate-400 mt-1 uppercase">HRS</span>
                </div>
                <span className="mt-1">:</span>
                <div className="flex flex-col items-center bg-white border border-slate-200/50 px-3 py-2 rounded-lg shadow-sm">
                  <span>{countdown.minutes.toString().padStart(2, '0')}</span>
                  <span className="text-[9px] font-bold text-slate-400 mt-1 uppercase">MIN</span>
                </div>
                <span className="mt-1">:</span>
                <div className="flex flex-col items-center bg-white border border-slate-200/50 px-3 py-2 rounded-lg shadow-sm">
                  <span>{countdown.seconds.toString().padStart(2, '0')}</span>
                  <span className="text-[9px] font-bold text-slate-400 mt-1 uppercase">SEC</span>
                </div>
              </div>
              <a 
                href={content.campaignBlock.ctaLink} 
                target="_blank" 
                referrerPolicy="no-referrer"
                className="w-full text-center bg-[#FF5B00] hover:bg-[#EB4501] text-white text-xs font-bold uppercase tracking-wider py-3.5 rounded-xl shadow-md transition-all mt-6 flex items-center justify-center gap-1.5"
              >
                {content.campaignBlock.ctaText} <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

          </div>
        )}

        {/* ========================================================================================================= */}
        {/* MODULE 3: CREATOR REVIEW / SCORE SUMMARY */}
        {/* ========================================================================================================= */}
        {content.creatorReview && (
          <div className="bg-white rounded-[32px] p-8 md:p-10 shadow-soft mb-12 border border-slate-100 grid grid-cols-1 lg:grid-cols-[1fr_2fr_1.2fr] gap-8 items-center relative">
            
            {/* Score circle */}
            <div className="flex flex-col items-center justify-center text-center p-6 bg-[#F8F9FC] border border-slate-200/50 rounded-2xl">
              <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mb-2">CREATOR RATING</span>
              <div className="text-6xl font-black text-[#8B5CF6] mb-1">{content.creatorReview.score}</div>
              <span className="text-[10px] font-bold text-slate-400 mb-4">Out of 10</span>
              <span className="inline-block bg-purple-100 text-[#8B5CF6] text-[10px] font-extrabold tracking-widest uppercase px-3.5 py-1.5 rounded-full">
                {content.creatorReview.scoreLabel}
              </span>
            </div>

            {/* Pros & Cons list */}
            <div className="flex flex-col gap-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <div className="flex items-center gap-2 text-emerald-600 font-bold uppercase tracking-wider text-xs mb-3">
                    <CheckCircle2 className="w-4 h-4" /> THE PROS
                  </div>
                  <ul className="space-y-2">
                    {content.creatorReview.pros.map((pro: string, idx: number) => (
                      <li key={idx} className="flex items-start gap-2 text-xs md:text-sm font-medium text-slate-600">
                        <span className="text-emerald-500 font-black shrink-0 mt-0.5">•</span>
                        <span>{pro}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <div className="flex items-center gap-2 text-red-500 font-bold uppercase tracking-wider text-xs mb-3">
                    <XCircle className="w-4 h-4" /> THE CONS
                  </div>
                  <ul className="space-y-2">
                    {content.creatorReview.cons.map((con: string, idx: number) => (
                      <li key={idx} className="flex items-start gap-2 text-xs md:text-sm font-medium text-slate-600">
                        <span className="text-red-400 font-black shrink-0 mt-0.5">•</span>
                        <span>{con}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Quick Verdict Summary */}
            <div className="border-t lg:border-t-0 lg:border-l border-slate-150 pt-6 lg:pt-0 lg:pl-8 flex flex-col justify-between h-full">
              <div>
                <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mb-2 block">Quick Verdict</span>
                <p className="text-sm font-semibold text-slate-600 leading-relaxed italic">
                  "{content.creatorReview.verdict}"
                </p>
              </div>
              <button 
                onClick={() => {
                  const el = document.getElementById('detailed_eval_section');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className="mt-6 text-xs font-extrabold text-[#8B5CF6] uppercase tracking-wider hover:text-purple-700 transition-colors flex items-center gap-1.5"
              >
                Read Detailed Breakdown <ArrowRight className="w-4 h-4" />
              </button>
            </div>

          </div>
        )}

        {/* ========================================================================================================= */}
        {/* MODULE 4: INTERACTIVE CHAPTERS TRACKER */}
        {/* ========================================================================================================= */}
        {content.videoChapters && content.videoChapters.length > 0 && (
          <div className="bg-white rounded-[32px] p-8 md:p-10 shadow-soft mb-12 border border-slate-100">
            <div className="flex items-center gap-2 mb-6">
              <Clock className="w-5 h-5 text-[#FF5B00]" />
              <h3 className="text-base font-black text-[#000435] uppercase tracking-wider">VIDEO CHAPTERS & HIGHLIGHT TRACKER</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
              {content.videoChapters.map((chapter: any, idx: number) => (
                <button 
                  key={idx}
                  onClick={() => {
                    setVideoTime(chapter.time);
                    // Match percentage roughly
                    setVideoProgress((idx + 1) * 20);
                    setIsVideoPlaying(true);
                    toast.success(`Jumped to chapter: ${chapter.title}`);
                  }}
                  className="bg-[#F8F9FC] hover:bg-slate-50 border border-slate-200/60 hover:border-[#FF5B00] rounded-xl p-4 text-left transition-all group shadow-sm active:scale-98"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-mono font-black text-[#FF5B00]">{chapter.time}</span>
                    <Play className="w-3.5 h-3.5 text-slate-300 group-hover:text-[#FF5B00] transition-colors" />
                  </div>
                  <h4 className="text-xs font-bold text-slate-900 group-hover:text-[#FF5B00] transition-colors mb-1 line-clamp-1">{chapter.title}</h4>
                  <p className="text-[11px] font-semibold text-slate-400 line-clamp-2 leading-relaxed">{chapter.description}</p>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================================================================= */}
        {/* MODULE 5: KEY TAKEAWAYS & VERDICT BLOCK */}
        {/* ========================================================================================================= */}
        <div className="mb-12">
          <h2 className="text-2xl font-black text-[#000435] uppercase tracking-wider mb-6 flex items-center gap-2">
            <span className="w-2 h-6 bg-[#FF5B00] rounded-full" /> KEY TAKEAWAYS
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
            {content.takeaways.map((item: any, idx: number) => {
              const IconComp = item.icon || Info;
              return (
                <div key={idx} className="bg-white rounded-2xl p-6 flex flex-col justify-between gap-4 border border-slate-100 shadow-[0_4px_20px_rgb(0,0,0,0.01)] hover:shadow-soft transition-all group">
                  <div className="w-10 h-10 rounded-xl bg-[#F8F9FC] flex items-center justify-center shrink-0 text-[#FF5B00] border border-slate-200/50 group-hover:bg-[#FF5B00] group-hover:text-white transition-all">
                    <IconComp className="w-5 h-5" />
                  </div>
                  <p className="text-[#050B2C] font-semibold text-xs md:text-sm leading-relaxed">{item.text}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* ========================================================================================================= */}
        {/* MODULE 6: RECOMMENDATIONS & VERDICT SPLIT */}
        {/* ========================================================================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_1.5fr] gap-8 mb-12 items-start">
          {/* Left panel criteria cards */}
          <div>
            <h2 className="text-2xl font-black text-[#000435] uppercase tracking-wider mb-6 flex items-center gap-2">
              <span className="w-2 h-6 bg-[#FF5B00] rounded-full" /> QUICK CRITERIA
            </h2>
            
            <div className="space-y-4">
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex items-start gap-4 hover:border-emerald-500/30 transition-colors">
                <div className="w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600 shrink-0 mt-0.5">
                  <CheckCircle2 className="w-4.5 h-4.5" />
                </div>
                <div>
                  <span className="text-xs font-black text-emerald-600 tracking-wider uppercase">BUY IF YOU</span>
                  <p className="text-slate-600 text-xs md:text-sm font-semibold mt-1 leading-relaxed">{content.verdict.buyIf}</p>
                </div>
              </div>
              
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex items-start gap-4 hover:border-amber-500/30 transition-colors">
                <div className="w-8 h-8 rounded-full bg-amber-50 flex items-center justify-center text-amber-600 shrink-0 mt-0.5">
                  <HelpCircle className="w-4.5 h-4.5" />
                </div>
                <div>
                  <span className="text-xs font-black text-amber-500 tracking-wider uppercase">CONSIDER IF</span>
                  <p className="text-slate-600 text-xs md:text-sm font-semibold mt-1 leading-relaxed">{content.verdict.considerIf}</p>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex items-start gap-4 hover:border-red-500/30 transition-colors">
                <div className="w-8 h-8 rounded-full bg-red-50 flex items-center justify-center text-red-600 shrink-0 mt-0.5">
                  <XCircle className="w-4.5 h-4.5" />
                </div>
                <div>
                  <span className="text-xs font-black text-red-500 tracking-wider uppercase">NOT FOR YOU IF</span>
                  <p className="text-slate-600 text-xs md:text-sm font-semibold mt-1 leading-relaxed">{content.verdict.notForYouIf}</p>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex items-start gap-4 hover:border-blue-500/30 transition-colors">
                <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 shrink-0 mt-0.5">
                  <Info className="w-4.5 h-4.5" />
                </div>
                <div>
                  <span className="text-xs font-black text-blue-600 tracking-wider uppercase">VERDICT SUMMARY</span>
                  <p className="text-slate-600 text-xs md:text-sm font-semibold mt-1 leading-relaxed">{content.verdict.overall}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Verdict Highlight box */}
          <div>
            <h2 className="text-2xl font-black text-[#000435] uppercase tracking-wider mb-6 flex items-center gap-2">
              <span className="w-2 h-6 bg-[#000435] rounded-full" /> DECISION SUMMARY
            </h2>
            <div className="bg-[#000435] text-white rounded-[28px] p-8 md:p-10 shadow-xl border border-white/5 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-48 h-48 bg-[#FF5B00]/10 rounded-full blur-[80px] pointer-events-none" />
              
              <span className="text-xs font-black text-[#FF5B00] uppercase tracking-widest block mb-4">THE FINAL VERDICT</span>
              <p className="text-lg md:text-2xl font-semibold leading-relaxed mb-8 text-slate-100 italic">
                "{content.verdict.summary}"
              </p>
              
              <div className="flex flex-wrap gap-2">
                {content.verdict.chips.map((chip: string, idx: number) => (
                  <span key={idx} className="bg-white/10 text-white font-bold text-xs px-4.5 py-2 rounded-full flex items-center gap-1.5 hover:bg-white/15 transition-all">
                    <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" /> {chip}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ========================================================================================================= */}
        {/* MODULE 7: DETAILED STEP-BY-STEP EVALUATION BREAKDOWNS */}
        {/* ========================================================================================================= */}
        <div id="detailed_eval_section" className="mb-12">
          <h2 className="text-2xl font-black text-[#000435] uppercase tracking-wider mb-6 flex items-center gap-2">
            <span className="w-2 h-6 bg-[#FF5B00] rounded-full" /> DETAILED CRITERIA BREAKDOWN
          </h2>
          
          <div className="space-y-4">
            {content.evaluations.map((item: any, idx: number) => (
              <div key={item.id} className="bg-white border border-slate-100 rounded-2xl p-6 hover:shadow-soft transition-all">
                <div className="flex flex-wrap items-center justify-between gap-4 mb-3 border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-[#000435] text-white font-mono font-black text-xs flex items-center justify-center shrink-0">
                      {(idx + 1)}
                    </span>
                    <h4 className="text-base font-black text-[#000435]">{item.title}</h4>
                  </div>
                  {/* Score pill */}
                  <div className="bg-amber-50 border border-amber-200/50 text-[#FF5B00] font-mono font-black text-xs md:text-sm px-3.5 py-1.5 rounded-xl shadow-sm flex items-center gap-1">
                    <span>Score:</span>
                    <span className="text-sm md:text-base">{item.score}</span>
                    <span className="text-[10px] text-slate-400 font-bold">/ 10</span>
                  </div>
                </div>
                <p className="text-slate-600 text-sm font-semibold leading-relaxed">{item.content}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ========================================================================================================= */}
        {/* MODULE 8: OTHER PRODUCTS MENTIONED CAROUSEL */}
        {/* ========================================================================================================= */}
        <div className="mb-12">
          <h2 className="text-2xl font-black text-[#000435] uppercase tracking-wider mb-6 flex items-center gap-2">
            <span className="w-2 h-6 bg-[#FF5B00] rounded-full" /> OTHER PRODUCTS MENTIONED
          </h2>
          <div className="flex gap-6 overflow-x-auto pb-4 snap-x scrollbar-hide relative group">
            {(content.relatedProducts || content.productsMentioned || []).map((product: any) => (
              <div key={product.id} className="min-w-[280px] lg:min-w-[300px] shrink-0 snap-start">
                <ProductCard product={product} />
              </div>
            ))}
            {/* Scroll indicators */}
            <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
              <button className="w-10 h-10 rounded-full bg-white shadow-lg border border-slate-100 flex items-center justify-center text-[#000435] hover:bg-slate-50">
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* ========================================================================================================= */}
        {/* MODULE 8.5: LIVE SHOPPING INTEL & DYNAMIC BUYER JOURNEY MAP */}
        {/* ========================================================================================================= */}
        {content.isLiveShopping && (
          <div className="bg-white rounded-[32px] p-8 md:p-10 shadow-soft border border-slate-100 mb-12 text-left">
            <h3 className="text-xl font-black text-[#000435] uppercase tracking-wider mb-6 flex items-center gap-2">
              <span className="w-2 h-6 bg-[#FF5B00] rounded-full" /> LIVE BROADCAST SUMMARY & METRICS
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-[#F8F9FC] rounded-2xl p-5 border border-slate-200/40">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Topics Explored</span>
                <ul className="space-y-2 mt-3">
                  {content.topicsCovered?.map((topic: string, i: number) => (
                    <li key={i} className="text-xs font-bold text-slate-700 flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" /> {topic}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-[#F8F9FC] rounded-2xl p-5 border border-slate-200/40">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Platform Details</span>
                <div className="mt-4 space-y-2 text-xs font-bold text-slate-700">
                  <p>Stream Platform: <span className="text-[#FF5B00]">{content.platform}</span></p>
                  <p>Estimated Duration: <span className="text-indigo-600">{content.duration}</span></p>
                  <p>Featured Brand: <span className="text-indigo-600">{content.brand}</span></p>
                  <p>Consensus Rating: <span className="text-amber-500">★ {content.rating} / 5</span></p>
                </div>
              </div>
              <div className="bg-[#F8F9FC] rounded-2xl p-5 border border-slate-200/40">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Services Mentioned</span>
                <div className="mt-4 flex flex-wrap gap-2">
                  <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-black px-2.5 py-1 rounded">0% EMI INSTALLMENT</span>
                  <span className="bg-indigo-50 text-indigo-700 border border-indigo-200 text-[10px] font-black px-2.5 py-1 rounded">OFFICIAL BD WARRANTY</span>
                  <span className="bg-amber-50 text-amber-700 border border-amber-200 text-[10px] font-black px-2.5 py-1 rounded">STORE PICKUP</span>
                  <span className="bg-purple-50 text-purple-700 border border-purple-200 text-[10px] font-black px-2.5 py-1 rounded">EXCHANGE CASHBACK</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Dynamic Buyer Journey Roadmap widget */}
        <div className="bg-gradient-to-br from-[#000435] to-[#0A1054] text-white rounded-[32px] p-8 md:p-10 shadow-2xl mb-12 text-left relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/10 rounded-full blur-[100px] pointer-events-none" />
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-white/10 pb-6 mb-8">
            <div>
              <span className="text-xs font-black text-[#FF5B00] uppercase tracking-widest block mb-1">Choosify AI Assistant</span>
              <h3 className="text-2xl font-black text-white leading-tight tracking-tight uppercase">YOUR ACTIVE BUYING JOURNEY</h3>
            </div>
            <div className="bg-white/10 px-4 py-2 rounded-xl border border-white/10 text-xs font-bold text-slate-300">
              Journey Code: <span className="text-[#FF5B00] font-mono">BD-S26-44</span>
            </div>
          </div>

          {/* Stepper Timeline UI */}
          <div className="grid grid-cols-1 md:grid-cols-6 gap-6 relative">
            <div className="absolute top-1/2 left-4 right-4 h-0.5 bg-white/10 -translate-y-1/2 hidden md:block z-0" />
            
            {[
              { step: '1', title: 'Watch Review', desc: 'Livestream unboxing & test details', completed: true },
              { step: '2', title: 'Check Verdict', desc: 'Expert ratings & low-light tests', completed: true },
              { step: '3', title: 'Compare Specs', desc: 'Side-by-side comparison matrix', completed: false, link: `/brands/${content.brand?.toLowerCase() || 'samsung'}` },
              { step: '4', title: 'Grab Vouchers', desc: 'Claim coupon S26LIVE for BDT 5,000 off', completed: false },
              { step: '5', title: 'Compare Stores', desc: 'Find lowest authentic pricing BD', completed: false },
              { step: '6', title: 'Buy Safely', desc: 'Checkout at official Samsung authorized store', completed: false }
            ].map((stepObj, idx) => (
              <div key={idx} className="flex flex-col items-center text-center relative z-10 group">
                <div className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center font-mono font-black text-sm border-2 transition-all shadow-md",
                  stepObj.completed 
                    ? "bg-[#FF5B00] border-[#FF5B00] text-white scale-110"
                    : "bg-slate-900 border-white/20 text-slate-400 group-hover:border-[#FF5B00] group-hover:text-white"
                )}>
                  {stepObj.completed ? '✓' : stepObj.step}
                </div>
                <h4 className="text-xs font-extrabold text-white mt-3 mb-1 uppercase tracking-wider">{stepObj.title}</h4>
                <p className="text-[10px] text-slate-400 font-semibold leading-relaxed px-2">{stepObj.desc}</p>
                {stepObj.link && (
                  <Link 
                    to={stepObj.link}
                    className="text-[10px] font-black text-[#FF5B00] uppercase tracking-wider mt-2 hover:underline"
                  >
                    Launch Page
                  </Link>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* ========================================================================================================= */}
        {/* MODULE 9: ABOUT AUTHOR & TOC GRID */}
        {/* ========================================================================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_1.5fr] gap-8 mb-12">
          {/* Author info card */}
          <div className="bg-white rounded-[24px] p-8 border border-slate-100 shadow-soft flex flex-col justify-between">
            <div>
              <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mb-6 block">ABOUT THE WRITER</span>
              <div className="flex items-start gap-4 mb-6">
                <img src={content.author.avatar} alt={content.author.name} className="w-16 h-16 rounded-full object-cover border-2 border-[#FF5B00]/40 shadow-md shrink-0" />
                <div>
                  <div className="flex items-center gap-1.5 mb-1">
                    <span className="font-extrabold text-lg text-[#000435]">{content.author.name}</span>
                    {content.author.verified && <ShieldCheck className="w-4.5 h-4.5 text-emerald-500" />}
                  </div>
                  <div className="text-[#FF5B00] font-black text-xs uppercase tracking-wider mb-3">{content.author.role}</div>
                  <p className="text-slate-600 font-semibold text-xs md:text-sm leading-relaxed">{content.author.bio}</p>
                </div>
              </div>
            </div>
            
            <div className="flex gap-4 border-t border-slate-100 pt-6">
              <button 
                onClick={() => {
                  setIsFollowing(!isFollowing);
                  toast.success(isFollowing ? 'Unfollowed expert' : 'Following expert!');
                }}
                className={cn(
                  "flex-1 text-xs font-bold tracking-wider uppercase py-3.5 rounded-xl border transition-all",
                  isFollowing 
                    ? "bg-emerald-500 border-emerald-500 text-white" 
                    : "bg-white border-slate-200 text-[#000435] hover:bg-slate-50"
                )}
              >
                {isFollowing ? '✓ Following' : '+ Follow Expert'}
              </button>
              <button 
                onClick={() => toast.success('Creator credentials and background validated by Choosify.')}
                className="flex-1 bg-[#000435] hover:bg-slate-900 text-white text-xs font-bold tracking-wider uppercase py-3.5 rounded-xl transition-all"
              >
                Verify Badge
              </button>
            </div>
          </div>

          {/* Table of Contents card */}
          <div className="bg-white rounded-[24px] p-8 border border-slate-100 shadow-soft">
            <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mb-6 block">IN THIS DIRECTORY</span>
            <ul className="space-y-4">
              {[
                { label: "Executive Test Verdict and Overall Winner", id: "choosify_universal_details_page" },
                { label: "Key Takeaways, Insights & Commuter Specs", id: "detailed_eval_section" },
                { label: "Decision Criteria: Buy If, Consider If, Skip If", id: "detailed_eval_section" },
                { label: "Detailed Criteria Breakdown & Final Scores Table", id: "detailed_eval_section" },
                { label: "Interactive Reader Comments, Ratings & FAQs", id: "faq_readers_section" }
              ].map((item, idx) => (
                <li key={idx} className="border-b border-slate-100/60 pb-3 last:border-b-0 last:pb-0">
                  <button 
                    onClick={() => {
                      const el = document.getElementById(item.id);
                      if (el) el.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="flex items-start gap-4 text-left group w-full"
                  >
                    <span className="text-[#FF5B00] font-mono font-black text-xs md:text-sm group-hover:scale-110 transition-transform">{(idx + 1).toString().padStart(2, '0')}.</span>
                    <span className="text-[#000435] font-bold text-xs md:text-sm group-hover:text-[#FF5B00] transition-colors">{item.label}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* ========================================================================================================= */}
        {/* MODULE 10: FAQ & COMMONS RATING MODULE */}
        {/* ========================================================================================================= */}
        <div id="faq_readers_section" className="grid grid-cols-1 lg:grid-cols-[1.5fr_1fr] gap-8 mb-12">
          {/* FAQ panel */}
          <div className="bg-white rounded-[24px] p-8 border border-slate-100 shadow-soft">
            <h3 className="text-base font-black text-[#000435] uppercase tracking-wider mb-6 flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-[#FF5B00]" /> FREQUENTLY ASKED QUESTIONS
            </h3>
            
            <div className="space-y-4">
              {content.faqs.map((faq: any, idx: number) => (
                <div key={idx} className="border-b border-slate-150 pb-4 last:border-none last:pb-0">
                  <h4 className="text-sm font-black text-[#000435] mb-2 flex items-center gap-2">
                    <span className="text-[#FF5B00]">•</span> {faq.question}
                  </h4>
                  <p className="text-slate-600 text-xs md:text-sm font-semibold leading-relaxed pl-4">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Ratings & Interactive Comments Block */}
          <div className="bg-white rounded-[24px] p-8 border border-slate-100 shadow-soft">
            <h3 className="text-base font-black text-[#000435] uppercase tracking-wider mb-6 flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-[#FF5B00]" /> WHAT READERS SAY
            </h3>

            {/* score statistics */}
            <div className="flex items-center gap-6 mb-8 border-b border-slate-100 pb-6">
              <div>
                <div className="text-5xl font-black text-[#000435]">{content.rating}</div>
                <div className="flex text-[#FF5B00] mt-1.5 mb-1">
                  {[1,2,3,4,5].map(i => <Star key={i} className="w-3.5 h-3.5 fill-current" />)}
                </div>
                <span className="text-[10px] font-bold text-slate-400 block">{content.reviews} total reviews</span>
              </div>
              
              <div className="flex-1 space-y-1.5">
                {[
                  { stars: 5, pct: 82 },
                  { stars: 4, pct: 12 },
                  { stars: 3, pct: 4 },
                  { stars: 2, pct: 1 },
                  { stars: 1, pct: 1 }
                ].map(row => (
                  <div key={row.stars} className="flex items-center gap-2 text-[10px] md:text-xs font-semibold">
                    <span className="w-10 text-right text-slate-500">{row.stars} Stars</span>
                    <div className="flex-1 h-1.5 rounded-full bg-slate-100 overflow-hidden">
                      <div className="h-full bg-[#FF5B00] rounded-full" style={{ width: `${row.pct}%` }} />
                    </div>
                    <span className="w-8 text-right text-slate-400">{row.pct}%</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Live comments list */}
            <div className="space-y-4 mb-6 max-h-[300px] overflow-y-auto pr-2 scrollbar-hide">
              {comments.map(c => (
                <div key={c.id} className="bg-[#F8F9FC] border border-slate-200/50 rounded-xl p-4 shadow-sm">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <img src={c.avatar} alt="" className="w-6 h-6 rounded-full object-cover border border-slate-200" />
                      <span className="text-xs font-extrabold text-[#000435]">{c.user}</span>
                    </div>
                    <span className="text-[10px] font-bold text-slate-400">{c.date}</span>
                  </div>
                  <div className="flex text-amber-400 mb-1.5">
                    {Array.from({ length: c.rating }).map((_, i) => (
                      <Star key={i} className="w-3 h-3 fill-current" />
                    ))}
                  </div>
                  <p className="text-slate-600 text-xs font-semibold leading-relaxed mb-3">"{c.comment}"</p>
                  
                  {/* Likes bar */}
                  <button 
                    onClick={() => handleLikeComment(c.id)}
                    className={cn(
                      "text-[10px] font-bold flex items-center gap-1 hover:text-[#FF5B00] transition-colors",
                      c.liked ? "text-[#FF5B00]" : "text-slate-400"
                    )}
                  >
                    <Heart className={cn("w-3.5 h-3.5", c.liked && "fill-current")} /> Useful ({c.likes})
                  </button>
                </div>
              ))}
            </div>

            {/* Comment post form */}
            <form onSubmit={handlePostComment} className="border-t border-slate-100 pt-4">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xs font-bold text-[#000435]">Your rating:</span>
                <div className="flex gap-1">
                  {[1,2,3,4,5].map(star => (
                    <button 
                      type="button"
                      key={star}
                      onClick={() => setNewCommentRating(star)}
                      className="text-amber-400 hover:scale-110 transition-transform"
                    >
                      <Star className={cn("w-4.5 h-4.5", star <= newCommentRating ? "fill-current" : "stroke-current")} />
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex items-stretch gap-2">
                <input 
                  type="text" 
                  value={newCommentText}
                  onChange={(e) => setNewCommentText(e.target.value)}
                  placeholder="Ask a question or post review..."
                  className="flex-1 bg-[#F8F9FC] border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-semibold text-[#000435] placeholder-slate-400 focus:outline-none focus:border-[#FF5B00]"
                />
                <button 
                  type="submit" 
                  className="bg-[#000435] hover:bg-[#FF5B00] text-white px-4.5 py-2.5 rounded-xl transition-colors shadow-md flex items-center justify-center shrink-0"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </form>

          </div>
        </div>

        {/* ========================================================================================================= */}
        {/* MODULE 11: RELATED EDITORIAL CARDS ("YOU MAY ALSO LIKE") */}
        {/* ========================================================================================================= */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-black text-[#000435] uppercase tracking-wider flex items-center gap-2">
              <span className="w-2 h-6 bg-[#FF5B00] rounded-full" /> YOU MAY ALSO LIKE
            </h2>
            <Link 
              to="/discover" 
              className="text-xs font-black text-[#FF5B00] uppercase tracking-wider hover:text-[#EB4501] transition-colors flex items-center gap-1"
            >
              Explore all guides <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {content.relatedGuides.map((guide: any) => (
              <div 
                key={guide.id} 
                onClick={() => navigate(`/discover/${guide.id}`)}
                className="bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-[0_4px_20px_rgb(0,0,0,0.01)] hover:shadow-soft transition-all cursor-pointer group"
              >
                <div className="aspect-[16/10] overflow-hidden relative">
                  <img 
                    src={guide.cover} 
                    alt={guide.title} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
                  <span className="absolute top-4 left-4 text-[9px] font-black text-white px-3 py-1 rounded-full uppercase tracking-wider bg-black/40 backdrop-blur-md">
                    {guide.category}
                  </span>
                </div>
                <div className="p-5">
                  <h3 className="font-extrabold text-base text-[#000435] leading-snug group-hover:text-[#FF5B00] transition-colors mb-3 line-clamp-2">
                    {guide.title}
                  </h3>
                  <div className="flex items-center gap-2 text-[11px] font-semibold text-slate-400">
                    <span>{guide.readTime}</span>
                    <span className="w-1 h-1 rounded-full bg-slate-300" />
                    <span className="flex items-center gap-0.5"><Eye className="w-3 h-3" /> {guide.views}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ========================================================================================================= */}
        {/* MODULE 12: POPULAR SEARCH TAG BAR */}
        {/* ========================================================================================================= */}
        <div className="pt-8 border-t border-slate-200/60">
          <h3 className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mb-4">Popular searches connected with this guide</h3>
          <div className="flex flex-wrap gap-2">
            {content.tags.map((tag: string, idx: number) => (
              <button 
                key={idx} 
                onClick={() => toast.success(`Filtering platform details by: ${tag}`)}
                className="bg-white text-slate-600 font-semibold text-xs px-4.5 py-2.5 rounded-full hover:text-[#FF5B00] hover:border-[#FF5B00] transition-colors border border-slate-200/50 shadow-sm cursor-pointer active:scale-95"
              >
                #{tag}
              </button>
            ))}
          </div>
        </div>

      </main>
    </div>
  );
}
