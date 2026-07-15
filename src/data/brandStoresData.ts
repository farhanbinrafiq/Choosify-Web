import { Cpu, Shirt, Smartphone, Tv, Footprints, Sparkles, Star, Heart, Check, Trash } from 'lucide-react';

export interface BrandStoreDeal {
  id: string;
  type: 'coupon' | 'cashback' | 'bundle' | 'bank' | 'sale';
  title: string;
  description: string;
  badge: string;
  code?: string;
  expiry: string;
}

export interface BrandStoreStory {
  id: string;
  title: string;
  date: string;
  image: string;
  category: string;
  excerpt: string;
}

export interface BrandStoreProduct {
  id: string;
  title: string;
  price: number;
  originalPrice?: number;
  discount?: string;
  image: string;
  badge?: 'HOT' | 'NEW' | 'SALE' | 'BEST SELLER' | 'BUDGET' | 'RECOMMENDED' | null;
  rating: string;
  reviews: string;
  category: string;
}

export interface BrandFAQ {
  question: string;
  answer: string;
}

export interface BrandStorefrontData {
  id: string;
  name: string;
  slogan: string;
  description: string;
  logo: string;
  logoUrl?: string;
  verified: boolean;
  location: string;
  founded: string;
  website: string;
  bannerImage?: string;
  bannerClass: string;
  bgGradient: string;
  accentColor: string;
  accentHoverColor: string;
  textColor: string;
  score: string;
  reviewsCount: string;
  recommendPct: string;
  socials: { fb?: string; ig?: string; x?: string; yt?: string };
  metrics: {
    quality: string;
    value: string;
    durability: string;
    design: string;
    support: string;
  };
  categories: string[];
  deals: BrandStoreDeal[];
  products: BrandStoreProduct[];
  stories: BrandStoreStory[];
  faqs: BrandFAQ[];
  contacts: {
    website: string;
    fb: string;
    ig: string;
    whatsapp: string;
    support: string;
    email: string;
    storeLocator: string;
  };
  relatedBrandIds: string[];
}

export const BRAND_STORES_DB: Record<string, BrandStorefrontData> = {
  apple: {
    id: 'apple',
    name: 'Apple Bangladesh',
    slogan: 'Think Different. Powered by Innovation.',
    description: 'Apple Inc. designs and manufactures premium consumer electronics including iPhones, iPads, MacBooks, Apple Watches, and premium audio devices. Welcome to the official digital experience storefront.',
    logo: 'A',
    logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg',
    verified: true,
    location: 'California, USA',
    founded: '1976',
    website: 'https://apple.com',
    bannerClass: 'from-[#050C24] via-[#0D1530] to-[#170C35]',
    bgGradient: 'bg-gradient-to-br from-[#020617] via-[#0f172a] to-[#1e1b4b]',
    accentColor: '#FF5B00',
    accentHoverColor: '#EB4501',
    textColor: 'text-white',
    score: '4.8',
    reviewsCount: '8,756',
    recommendPct: '94%',
    socials: { fb: '#', ig: '#', x: '#', yt: '#' },
    metrics: { quality: '4.9', value: '4.1', durability: '4.6', design: '4.9', support: '4.5' },
    categories: ['All', 'iPhone', 'Mac', 'iPad', 'Watch', 'AirPods', 'Accessories'],
    deals: [
      { id: 'ap-deal-1', type: 'coupon', title: '৳5,000 Coupon', description: 'Save instantly on iPhone 15 Pro series. Use at checkout.', badge: 'OFFICIAL COUPON', code: 'APPLE5K', expiry: 'Ends in 3 days' },
      { id: 'ap-deal-2', type: 'bank', title: '10% City Bank AMEX Discount', description: 'Get up to ৳10,000 instant discount on 12-month EMI plans.', badge: 'BANK PROMO', expiry: 'Ends Jul 31' },
      { id: 'ap-deal-3', type: 'cashback', title: '৳3,000 bKash Cashback', description: 'Get flat cashback on purchasing any Apple AirPods Pro or Watch.', badge: 'CASHBACK', expiry: 'Ends in 1 week' },
      { id: 'ap-deal-4', type: 'bundle', title: 'MacBook Office Bundle', description: 'Buy any MacBook Air or Pro and get original Multiport Adapter at 50% off.', badge: 'BUNDLE SAVE', expiry: 'Limited Stock' },
      { id: 'ap-deal-5', type: 'sale', title: 'Student ID Offer', description: 'Show your verified university student ID card to get 5% flat off on iPads and MacBooks.', badge: 'STUDENT PROMO', expiry: 'Ongoing' }
    ],
    products: [
      { id: 'apple-iphone-15', title: 'Apple iPhone 15 (128GB) - Black', price: 114999, originalPrice: 134999, discount: '15% OFF', image: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=400&q=80', badge: 'HOT', rating: '4.9', reviews: '1.2K', category: 'iPhone' },
      { id: 'apple-iphone-15-pro', title: 'Apple iPhone 15 Pro Max (256GB) - Natural Titanium', price: 165000, originalPrice: 185000, discount: '11% OFF', image: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=400&q=80', badge: 'BEST SELLER', rating: '5.0', reviews: '932', category: 'iPhone' },
      { id: 'apple-macbook-air', title: 'Apple MacBook Air M2 (8GB/256GB SSD)', price: 128000, originalPrice: 142000, discount: '10% OFF', image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&q=80', badge: 'HOT', rating: '4.8', reviews: '723', category: 'Mac' },
      { id: 'apple-macbook-pro', title: 'Apple MacBook Pro M3 Pro (18GB/512GB SSD)', price: 245000, originalPrice: 265000, discount: '8% OFF', image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&q=80', badge: 'NEW', rating: '4.9', reviews: '145', category: 'Mac' },
      { id: 'apple-airpods-pro', title: 'Apple AirPods Pro (2nd Gen) with MagSafe', price: 25999, originalPrice: 29999, discount: '13% OFF', image: 'https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=400&q=80', badge: 'NEW', rating: '4.9', reviews: '1.5K', category: 'AirPods' },
      { id: 'apple-airpods-3', title: 'Apple AirPods (3rd Generation)', price: 19500, originalPrice: 22000, discount: '11% OFF', image: 'https://images.unsplash.com/photo-1588449668365-d15e397f6787?w=400&q=80', badge: 'SALE', rating: '4.7', reviews: '420', category: 'AirPods' },
      { id: 'apple-watch-9', title: 'Apple Watch Series 9 GPS (45mm) Midnight', price: 45999, originalPrice: 57999, discount: '20% OFF', image: 'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=400&q=80', badge: 'SALE', rating: '4.8', reviews: '560', category: 'Watch' },
      { id: 'apple-watch-ultra-2', title: 'Apple Watch Ultra 2 GPS + Cellular Titanium', price: 98000, originalPrice: 110000, discount: '11% OFF', image: 'https://images.unsplash.com/photo-1434494878577-86c23bcb06b9?w=400&q=80', badge: 'BEST SELLER', rating: '5.0', reviews: '180', category: 'Watch' },
      { id: 'apple-ipad-air', title: 'Apple iPad Air M1 (64GB, Wi-Fi)', price: 68500, originalPrice: 75000, discount: '9% OFF', image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400&q=80', badge: 'RECOMMENDED', rating: '4.7', reviews: '310', category: 'iPad' },
      { id: 'apple-ipad-pro', title: 'Apple iPad Pro M4 (11-inch, Wi-Fi, 256GB)', price: 118000, originalPrice: 125000, discount: '6% OFF', image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400&q=80', badge: 'NEW', rating: '5.0', reviews: '98', category: 'iPad' },
      { id: 'apple-pencil-2', title: 'Apple Pencil (2nd Generation)', price: 13500, originalPrice: 15500, discount: '13% OFF', image: 'https://images.unsplash.com/photo-1608156639585-b3a032ef9689?w=400&q=80', badge: 'BEST SELLER', rating: '4.8', reviews: '820', category: 'Accessories' },
      { id: 'apple-magsafe-charger', title: 'Apple MagSafe Charger (15W Fast Charge)', price: 4500, originalPrice: 5500, discount: '18% OFF', image: 'https://images.unsplash.com/photo-1608156639585-b3a032ef9689?w=400&q=80', badge: 'BUDGET', rating: '4.6', reviews: '1.1K', category: 'Accessories' }
    ],
    stories: [
      { id: 'ap-story-1', title: 'Apple Carbon Neutral Commitment 2030', date: 'Jul 2026', image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=600&q=80', category: 'ECOLOGY', excerpt: 'How Apple is transforming its manufacturing process to ensure all product assemblies generate zero carbon footprint by the end of this decade.' },
      { id: 'ap-story-2', title: 'Behind the Design of Grade 5 Titanium Alloy', date: 'Jun 2026', image: 'https://images.unsplash.com/photo-1605236453806-6ff368536b8e?w=600&q=80', category: 'ENGINEERING', excerpt: 'An immersive tour of Apple’s specialized metallurgy lab exploring the lightweight aerospace titanium used on the iPhone Pro models.' },
      { id: 'ap-story-3', title: 'A Day in the Life of a Local App Developer', date: 'May 2026', image: 'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=600&q=80', category: 'COMMUNITY', excerpt: 'How high school coder Nabil developed a globally trending productivity tool entirely on a basic MacBook Air in Dhaka.' }
    ],
    faqs: [
      { question: 'Do Apple products purchased from Choosify carry an official warranty?', answer: 'Yes! All Apple products listed on Choosify from verified official storefront distributors carry a full 1-year official brand warranty redeemable at any Apple Authorized Service Provider in Bangladesh.' },
      { question: 'What is AppleCare+ and is it available in Bangladesh?', answer: 'AppleCare+ is Apple\'s premium extended coverage program providing hardware protection and accidental damage coverage. Currently, AppleCare+ can be registered through official authorized resellers upon invoice confirmation.' },
      { question: 'Are these iPhones factory unlocked?', answer: 'Absolutely. Every single iPhone sold through our verified stores is 100% factory unlocked, globally compatible, and registers perfectly with any mobile carrier in Bangladesh.' }
    ],
    contacts: { website: 'https://apple.com', fb: 'https://facebook.com', ig: 'https://instagram.com', whatsapp: '+8801700000000', support: '16247', email: 'support@apple-bd.com', storeLocator: 'Bashundhara City, Level 5, Block A' },
    relatedBrandIds: ['samsung', 'xiaomi', 'walton']
  },
  samsung: {
    id: 'samsung',
    name: 'Samsung Bangladesh',
    slogan: 'Inspire the World, Create the Future.',
    description: 'Samsung Electronics is a global leader in technology, opening new possibilities for people everywhere. From cutting-edge Galaxy smartphones to smart home appliances and ultra-premium QLED TVs.',
    logo: 'S',
    logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/2/24/Samsung_Logo.svg',
    verified: true,
    location: 'Seoul, South Korea',
    founded: '1969',
    website: 'https://samsung.com/bd',
    bannerClass: 'from-[#0A1A5C] via-[#0D247E] to-[#141529]',
    bgGradient: 'bg-gradient-to-br from-[#030712] via-[#030d24] to-[#011640]',
    accentColor: '#3B82F6',
    accentHoverColor: '#2563EB',
    textColor: 'text-white',
    score: '4.6',
    reviewsCount: '12,410',
    recommendPct: '89%',
    socials: { fb: '#', ig: '#', yt: '#' },
    metrics: { quality: '4.7', value: '4.5', durability: '4.5', design: '4.6', support: '4.4' },
    categories: ['All', 'Galaxy S', 'Galaxy A', 'Tablets', 'Watches', 'Audio', 'Smart TV'],
    deals: [
      { id: 'sam-deal-1', type: 'coupon', title: '৳7,500 Galaxy Coupon', description: 'Instant cash discount on Galaxy S24 Ultra series. Voucher auto-applied.', badge: 'AI LAUNCH DISCOUNT', code: 'GALAXY75', expiry: 'Ends Jul 25' },
      { id: 'sam-deal-2', type: 'cashback', title: '৳5,000 bKash Cashback', description: 'Flat cashback on purchasing the Galaxy A55 5G from verified plazas.', badge: 'BKASH CASHBACK', expiry: 'Ongoing' },
      { id: 'sam-deal-3', type: 'bundle', title: 'Galaxy Ecosystem Bundle', description: 'Buy Galaxy S24 and get Galaxy Buds2 Pro at a massive 40% discount.', badge: 'BUNDLE DEALS', expiry: 'Limited slots' }
    ],
    products: [
      { id: 'samsung-s24-ultra', title: 'Samsung Galaxy S24 Ultra (12GB/256GB) Titanium', price: 145000, originalPrice: 155000, discount: '6% OFF', image: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=400&q=80', badge: 'BEST SELLER', rating: '4.8', reviews: '128', category: 'Galaxy S' },
      { id: 'samsung-s24-plus', title: 'Samsung Galaxy S24+ (12GB/256GB) Onyx Black', price: 119000, originalPrice: 129000, discount: '8% OFF', image: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=400&q=80', badge: 'HOT', rating: '4.7', reviews: '84', category: 'Galaxy S' },
      { id: 'samsung-a55', title: 'Samsung Galaxy A55 5G (8GB/256GB)', price: 49500, originalPrice: 54999, discount: '10% OFF', image: 'https://images.unsplash.com/photo-1563897539633-7374c276c212?w=400&q=80', badge: 'RECOMMENDED', rating: '4.6', reviews: '230', category: 'Galaxy A' },
      { id: 'samsung-a35', title: 'Samsung Galaxy A35 5G (8GB/128GB)', price: 34500, originalPrice: 38000, discount: '9% OFF', image: 'https://images.unsplash.com/photo-1563897539633-7374c276c212?w=400&q=80', badge: 'BUDGET', rating: '4.4', reviews: '45', category: 'Galaxy A' },
      { id: 'samsung-tab-s9', title: 'Samsung Galaxy Tab S9 Ultra Wi-Fi (256GB)', price: 118000, originalPrice: 128000, discount: '8% OFF', image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400&q=80', badge: 'NEW', rating: '4.9', reviews: '62', category: 'Tablets' },
      { id: 'samsung-watch-6', title: 'Samsung Galaxy Watch 6 Classic LTE 47mm', price: 34999, originalPrice: 39999, discount: '13% OFF', image: 'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=400&q=80', badge: 'SALE', rating: '4.5', reviews: '115', category: 'Watches' },
      { id: 'samsung-buds-2', title: 'Samsung Galaxy Buds2 Pro Wireless Earbuds', price: 16500, originalPrice: 19500, discount: '15% OFF', image: 'https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=400&q=80', badge: 'HOT', rating: '4.7', reviews: '340', category: 'Audio' },
      { id: 'samsung-tv-qled', title: 'Samsung 55" QN90C Neo QLED 4K Smart TV', price: 148000, originalPrice: 165000, discount: '10% OFF', image: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=400&q=80', badge: 'BEST SELLER', rating: '4.9', reviews: '45', category: 'Smart TV' }
    ],
    stories: [
      { id: 'sam-story-1', title: 'The Next Era of Galaxy AI in Bangladesh', date: 'Jun 2026', image: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=600&q=80', category: 'INTELLIGENCE', excerpt: 'How Live Translate, Chat Assist, and Circle to Search are breaking linguistic boundaries in corporate offices and universities across Dhaka.' },
      { id: 'sam-story-2', title: 'Engineering Foldable Glass Panels', date: 'Apr 2026', image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&q=80', category: 'HARDWARE', excerpt: 'Behind the scenes at Samsung Display division as we produce micro-thin folding glass capable of surviving over 200,000 folds.' }
    ],
    faqs: [
      { question: 'Do Samsung devices come with official warranty card?', answer: 'Yes! All Samsung phones sold by verified sellers come with Samsung Mobile Bangladesh official 1-year warranty registration valid across all 42 authorized Service Centers in BD.' },
      { question: 'Where are Samsung phones manufactured?', answer: 'Samsung phones sold in Bangladesh are assembled right here in Narsingdi, Bangladesh under state-of-the-art Samsung High-Tech Manufacturing facilities, ensuring premium quality at aggressive tax-saved pricing!' }
    ],
    contacts: { website: 'https://samsung.com/bd', fb: 'https://facebook.com/samsung', ig: 'https://instagram.com/samsung', whatsapp: '+8809612300300', support: '09612300300', email: 'feedback.bd@samsung.com', storeLocator: 'Gulshan-2 Circle, Plot 23, Dhaka' },
    relatedBrandIds: ['apple', 'xiaomi', 'walton']
  },
  xiaomi: {
    id: 'xiaomi',
    name: 'Xiaomi Bangladesh',
    slogan: 'Innovation for Everyone.',
    description: 'Xiaomi Corporation makes high-quality technology accessible to everyone. Famous for its hyper-aggressive price-to-performance smartphones, smart wearable ecosystems, and innovative IoT home appliances.',
    logo: 'mi',
    logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/a/ae/Xiaomi_logo_%282021-%29.svg',
    verified: true,
    location: 'Beijing, China',
    founded: '2010',
    website: 'https://mi.com/bd',
    bannerClass: 'from-[#EC5F06] via-[#F47E31] to-[#2B1B12]',
    bgGradient: 'bg-gradient-to-br from-[#1c120c] via-[#2d1a0e] to-[#0c0d12]',
    accentColor: '#FF6700',
    accentHoverColor: '#E05A00',
    textColor: 'text-white',
    score: '4.6',
    reviewsCount: '3,850',
    recommendPct: '91%',
    socials: { fb: '#', ig: '#', yt: '#' },
    metrics: { quality: '4.4', value: '4.9', durability: '4.3', design: '4.4', support: '4.2' },
    categories: ['All', 'Phones', 'Wearables', 'Audio', 'Smart Home', 'Powerbanks'],
    deals: [
      { id: 'xi-deal-1', type: 'coupon', title: '৳2,000 Coupon', description: 'Save instantly on Redmi Note 13 series. Use code XIMI2K.', badge: 'COUPON', code: 'XIMI2K', expiry: 'Ends tomorrow' },
      { id: 'xi-deal-2', type: 'cashback', title: '৳1,500 bKash Cashback', description: 'Flat cashback on purchasing any Redmi Smart Band or Watch.', badge: 'BKASH SPECIAL', expiry: 'Limited Time' }
    ],
    products: [
      { id: 'xiaomi-redmi-note-13-pro', title: 'Xiaomi Redmi Note 13 Pro (8GB/256GB)', price: 31999, originalPrice: 34999, discount: '9% OFF', image: 'https://images.unsplash.com/photo-1512499617640-c74ae3a79d37?w=400&q=80', badge: 'BEST SELLER', rating: '4.6', reviews: '156', category: 'Phones' },
      { id: 'xiaomi-14-ultra', title: 'Xiaomi 14 Ultra 5G (16GB/512GB) Leica', price: 135000, originalPrice: 145000, discount: '7% OFF', image: 'https://images.unsplash.com/photo-1512499617640-c74ae3a79d37?w=400&q=80', badge: 'NEW', rating: '4.9', reviews: '34', category: 'Phones' },
      { id: 'xiaomi-watch-s3', title: 'Xiaomi Watch S3 Bluetooth Smartwatch', price: 14500, originalPrice: 16500, discount: '12% OFF', image: 'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=400&q=80', badge: 'HOT', rating: '4.5', reviews: '82', category: 'Wearables' },
      { id: 'xiaomi-band-8', title: 'Xiaomi Smart Band 8 Activity Tracker', price: 3499, originalPrice: 3999, discount: '13% OFF', image: 'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=400&q=80', badge: 'BUDGET', rating: '4.7', reviews: '912', category: 'Wearables' },
      { id: 'xiaomi-buds-5', title: 'Xiaomi Redmi Buds 5 Pro Wireless Earbuds', price: 6800, originalPrice: 7500, discount: '9% OFF', image: 'https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=400&q=80', badge: 'RECOMMENDED', rating: '4.4', reviews: '145', category: 'Audio' },
      { id: 'xiaomi-tv-a-pro', title: 'Xiaomi A Pro 55 Inch Smart Google TV', price: 46500, originalPrice: 52000, discount: '11% OFF', image: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=400&q=80', badge: 'BEST SELLER', rating: '4.7', reviews: '118', category: 'Smart Home' },
      { id: 'xiaomi-powerbank-20k', title: 'Xiaomi 20000mAh 50W Fast Charge Power Bank', price: 4200, originalPrice: 4800, discount: '13% OFF', image: 'https://images.unsplash.com/photo-1608156639585-b3a032ef9689?w=400&q=80', badge: 'BUDGET', rating: '4.8', reviews: '560', category: 'Powerbanks' }
    ],
    stories: [
      { id: 'xi-story-1', title: 'Co-Engineering with Leica Camera', date: 'May 2026', image: 'https://images.unsplash.com/photo-1495121605193-b116b5b9c5fe?w=600&q=80', category: 'PHOTOGRAPHY', excerpt: 'How Xiaomi integrated legendary German optical engineering directly into mobile sensor lens systems to pioneer professional mobile street photography.' }
    ],
    faqs: [
      { question: 'Is official Xiaomi warranty applicable on all products?', answer: 'Yes! Only Xiaomi products bought with official National Distributor stamps carry the 1-year localized warranty redeemable at authorized Xiaomi service plazas.' }
    ],
    contacts: { website: 'https://mi.com/bd', fb: 'https://facebook.com/xiaomibangladesh', ig: 'https://instagram.com', whatsapp: '+8809600000000', support: '09609000000', email: 'support.bd@xiaomi.com', storeLocator: 'Eastern Plaza, Level 4, Dhaka' },
    relatedBrandIds: ['samsung', 'apple', 'walton']
  },
  walton: {
    id: 'walton',
    name: 'Walton Plaza',
    slogan: 'Our Product, Our Pride.',
    description: 'Walton is Bangladesh\'s pioneering home-grown conglomerate manufacturing high-tech electronics, commercial home appliances, refrigeration, smart televisions, and personal computers locally with international standards.',
    logo: 'W',
    logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/e/e3/WALTON_logo.png',
    verified: true,
    location: 'Dhaka, Bangladesh',
    founded: '1977',
    website: 'https://waltonbd.com',
    bannerClass: 'from-[#052C5C] via-[#0E427F] to-[#121A28]',
    bgGradient: 'bg-gradient-to-br from-[#020d1c] via-[#051a33] to-[#0c0d12]',
    accentColor: '#1E40AF',
    accentHoverColor: '#1D4ED8',
    textColor: 'text-white',
    score: '4.5',
    reviewsCount: '15,120',
    recommendPct: '88%',
    socials: { fb: '#' },
    metrics: { quality: '4.2', value: '4.9', durability: '4.6', design: '4.1', support: '4.4' },
    categories: ['All', 'Refrigerators', 'Smart TVs', 'ACs', 'Home Appliances', 'Laptops', 'Mobile'],
    deals: [
      { id: 'wal-deal-1', type: 'sale', title: '৳10,000 Exchange Offer', description: 'Exchange your old working/non-working refrigerator for a new Walton Non-Frost Refrigerator and save up to ৳10,000!', badge: 'EXCHANGE FEST', expiry: 'Ends Jul 31' },
      { id: 'wal-deal-2', type: 'coupon', title: '৳2,000 Monsoon AC Discount', description: 'Save instantly on buying energy-saving Walton Inverter AC. Coupon: MONSOONAC.', badge: 'AC PROMO', code: 'MONSOONAC', expiry: 'Ends soon' }
    ],
    products: [
      { id: 'walton-refrigerator-nonfrost', title: 'Walton Non-Frost Refrigerator 320 Liters', price: 48500, originalPrice: 54000, discount: '10% OFF', image: 'https://images.unsplash.com/photo-1571175482282-4b37d0258d1d?w=400&q=80', badge: 'BEST SELLER', rating: '4.6', reviews: '180', category: 'Refrigerators' },
      { id: 'walton-tv-4k', title: 'Walton 43 Inch 4K Android Smart TV', price: 29900, originalPrice: 34500, discount: '13% OFF', image: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=400&q=80', badge: 'HOT', rating: '4.5', reviews: '112', category: 'Smart TVs' },
      { id: 'walton-ac-inverter', title: 'Walton 1.5 Ton Intelligent Inverter AC', price: 58000, originalPrice: 65000, discount: '10% OFF', image: 'https://images.unsplash.com/photo-1571175482282-4b37d0258d1d?w=400&q=80', badge: 'RECOMMENDED', rating: '4.7', reviews: '64', category: 'ACs' },
      { id: 'walton-rice-cooker', title: 'Walton Smart Electric Rice Cooker 2.8L', price: 3200, originalPrice: 3800, discount: '15% OFF', image: 'https://images.unsplash.com/photo-1571175482282-4b37d0258d1d?w=400&q=80', badge: 'BUDGET', rating: '4.4', reviews: '240', category: 'Home Appliances' },
      { id: 'walton-laptop-tamarind', title: 'Walton Tamarind EX10 Core i5 11th Gen Laptop', price: 49500, originalPrice: 56000, discount: '11% OFF', image: 'https://images.unsplash.com/photo-1496181133227-f83bb023945d?w=400&q=80', badge: 'NEW', rating: '4.3', reviews: '15', category: 'Laptops' },
      { id: 'walton-phone-nexus', title: 'Walton Primo Nexus Pro (8GB/128GB)', price: 16999, originalPrice: 19500, discount: '12% OFF', image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&q=80', badge: 'BUDGET', rating: '4.2', reviews: '84', category: 'Mobile' }
    ],
    stories: [
      { id: 'wal-story-1', title: 'From Local Foundry to International Exporter', date: 'May 2026', image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=600&q=80', category: 'MANUFACTURING', excerpt: 'How Walton built a massive high-tech industrial complex in Chandra, Gazipur that now exports refrigerators and ACs to over 30 countries.' }
    ],
    faqs: [
      { question: 'What warranty is offered on Walton Compressor?', answer: 'Walton offers an industry-leading 12-year warranty on all Inverter Refrigerator and AC Compressors, which is backed by immediate support from any Walton Plaza in Bangladesh.' }
    ],
    contacts: { website: 'https://waltonbd.com', fb: 'https://facebook.com/waltonbd', ig: 'https://instagram.com', whatsapp: '+8801680000000', support: '16267', email: 'support@waltonbd.com', storeLocator: 'Walton Plaza, Gazipur, Chandra' },
    relatedBrandIds: ['samsung', 'xiaomi']
  },
  aarong: {
    id: 'aarong',
    name: 'Aarong Heritage',
    slogan: 'A Heritage of Handcrafted Artistry.',
    description: 'Aarong is Bangladesh\'s leading ethical fashion and lifestyle retail brand. As a social enterprise of BRAC, Aarong supports over 65,000 rural artisans, bringing ancient Bangladeshi weaving and handicraft traditions to modern premium lifestyles.',
    logo: 'Aa',
    logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/e/e0/Aarong_Logo.jpg',
    verified: true,
    location: 'Dhaka, Bangladesh',
    founded: '1978',
    website: 'https://aarong.com',
    bannerClass: 'from-[#2B1B17] via-[#482F24] to-[#140D0B]',
    bgGradient: 'bg-gradient-to-br from-[#1c110e] via-[#2a1712] to-[#120c0a]',
    accentColor: '#B45309',
    accentHoverColor: '#92400E',
    textColor: 'text-amber-50',
    score: '4.9',
    reviewsCount: '11,280',
    recommendPct: '96%',
    socials: { fb: '#', ig: '#' },
    metrics: { quality: '4.9', value: '4.4', durability: '4.7', design: '4.9', support: '4.5' },
    categories: ['All', "Men's wear", "Women's wear", 'Kids', 'Home decor', 'Jewelry'],
    deals: [
      { id: 'aar-deal-1', type: 'coupon', title: '৳1,000 Eid Coupon', description: 'Get flat discount on purchasing premium Silk Panjabis or Sarees. Coupon: EIDHERITAGE.', badge: 'FESTIVAL COUPON', code: 'EIDHERITAGE', expiry: 'Ends Jul 20' },
      { id: 'aar-deal-2', type: 'bank', title: '15% BRAC Bank Discount', description: 'Save instantly on credit card payments on orders over ৳5,000.', badge: 'BRAC EXCLUSIVE', expiry: 'Ongoing' }
    ],
    products: [
      { id: 'aarong-panjabi-silk', title: 'Aarong Premium Raw Silk Embroidered Panjabi', price: 8500, originalPrice: 10500, discount: '19% OFF', image: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=400&q=80', badge: 'BEST SELLER', rating: '4.9', reviews: '112', category: "Men's wear" },
      { id: 'aarong-cotton-saree', title: 'Aarong Handloom Cotton Jamdani Saree', price: 16500, originalPrice: 19500, discount: '15% OFF', image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=400&q=80', badge: 'HOT', rating: '5.0', reviews: '45', category: "Women's wear" },
      { id: 'aarong-shalwar-kameez', title: 'Aarong Premium Silk Shalwar Kameez Set', price: 9800, originalPrice: 11500, discount: '14% OFF', image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=400&q=80', badge: 'NEW', rating: '4.8', reviews: '38', category: "Women's wear" },
      { id: 'aarong-kids-kurta', title: 'Aarong Kid\'s Handloom Embroidered Kurta', price: 1800, originalPrice: 2400, discount: '25% OFF', image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&q=80', badge: 'BUDGET', rating: '4.6', reviews: '94', category: 'Kids' },
      { id: 'aarong-bedsheet-nakshi', title: 'Aarong Hand-stitched Nakshi Kantha Bedsheet', price: 12500, originalPrice: 14500, discount: '13% OFF', image: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=400&q=80', badge: 'RECOMMENDED', rating: '4.9', reviews: '24', category: 'Home decor' },
      { id: 'aarong-clay-pottery', title: 'Aarong Terracotta Handcrafted Clay Vase Set', price: 1200, originalPrice: 1600, discount: '25% OFF', image: 'https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?w=400&q=80', badge: 'BUDGET', rating: '4.7', reviews: '156', category: 'Home decor' },
      { id: 'aarong-silver-necklace', title: 'Aarong Filigree Handcrafted Silver Necklace', price: 6500, originalPrice: 7500, discount: '13% OFF', image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=400&q=80', badge: 'NEW', rating: '4.8', reviews: '19', category: 'Jewelry' }
    ],
    stories: [
      { id: 'aar-story-1', title: 'Empowering Rural Artisans with Fair Wages', date: 'Apr 2026', image: 'https://images.unsplash.com/photo-1544924405-3642395d8f6d?w=600&q=80', category: 'COMMUNITY', excerpt: 'How Aarong and BRAC set up artisan hubs in Manikganj and Jessore to provide sustainable, direct fair trade employment opportunities to over 65,000 women.' },
      { id: 'aar-story-2', title: 'The Art of Hand-Spun Khadi Fabric', date: 'Mar 2026', image: 'https://images.unsplash.com/photo-1505236858219-8359eb29e3a9?w=600&q=80', category: 'HERITAGE', excerpt: 'Exploring the rigorous, patient process of spinning natural cotton fibers into fine Khadi cloths on traditional spinning wheels in Comilla.' }
    ],
    faqs: [
      { question: 'Is Aarong a non-profit social enterprise?', answer: 'Yes! Aarong is a social enterprise of BRAC. 50% of Aarong\'s operating profits are directly reinvested into BRAC\'s developmental programs supporting ultra-poor populations and women\'s empowerment across rural Bangladesh.' }
    ],
    contacts: { website: 'https://aarong.com', fb: 'https://facebook.com/aarong', ig: 'https://instagram.com/aarong', whatsapp: '+8801711223344', support: '09612227222', email: 'support@aarong.brac.net', storeLocator: 'Tejgaon Link Road, plot 242, Dhaka' },
    relatedBrandIds: ['bata']
  },
  bata: {
    id: 'bata',
    name: 'Bata Bangladesh',
    slogan: 'Walk with Confidence.',
    description: 'Bata Bangladesh is the leading premium footwear manufacturer in the country. From legacy leather formal wear to lightweight sports shoes and comfortable everyday sandals, Bata ensures unmatched quality and posture support.',
    logo: 'B',
    logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/e/e8/Bata_logo.svg',
    verified: true,
    location: 'Dhaka, Bangladesh',
    founded: '1962',
    website: 'https://batabd.com',
    bannerClass: 'from-[#C4151C] via-[#941014] to-[#1E0608]',
    bgGradient: 'bg-gradient-to-br from-[#1a0506] via-[#290809] to-[#0d0d12]',
    accentColor: '#DC2626',
    accentHoverColor: '#B91C1C',
    textColor: 'text-white',
    score: '4.6',
    reviewsCount: '11,020',
    recommendPct: '93%',
    socials: { fb: '#' },
    metrics: { quality: '4.6', value: '4.7', durability: '4.8', design: '4.3', support: '4.4' },
    categories: ['All', 'Formal', 'Sneakers', 'Sandals', 'Heels', 'Accessories'],
    deals: [
      { id: 'bat-deal-1', type: 'sale', title: 'Buy 1 Get 1 Free', description: 'Purchase any Bata Comfit and get a second pairs of selected sandals completely free!', badge: 'BOGO', expiry: 'Ends Jul 25' },
      { id: 'bat-deal-2', type: 'coupon', title: '৳500 Welcome Voucher', description: 'Get instant ৳500 discount on your first footwear purchase. Code: BATANEW500.', badge: 'NEW SIGNUP', code: 'BATANEW500', expiry: 'Ongoing' }
    ],
    products: [
      { id: 'bata-oxford-leather', title: 'Bata Men\'s Premium Leather Oxford Formals', price: 4800, originalPrice: 5500, discount: '13% OFF', image: 'https://images.unsplash.com/photo-1533867617858-e7b97e060509?w=400&q=80', badge: 'BEST SELLER', rating: '4.7', reviews: '310', category: 'Formal' },
      { id: 'bata-comfit-sandal', title: 'Bata Comfit Ergo-Posture Men\'s Sandals', price: 2400, originalPrice: 2800, discount: '14% OFF', image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&q=80', badge: 'HOT', rating: '4.8', reviews: '1.2K', category: 'Sandals' },
      { id: 'bata-power-sneaker', title: 'Bata Power Air-Bounce Running Sneakers', price: 3800, originalPrice: 4500, discount: '15% OFF', image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&q=80', badge: 'NEW', rating: '4.6', reviews: '420', category: 'Sneakers' },
      { id: 'bata-heels-marie', title: 'Bata Marie Claire Women\'s Block Heels', price: 2900, originalPrice: 3500, discount: '17% OFF', image: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=400&q=80', badge: 'RECOMMENDED', rating: '4.5', reviews: '89', category: 'Heels' },
      { id: 'bata-school-shoes', title: 'Bata Unisex Classic White Canvas School Shoes', price: 999, originalPrice: 1200, discount: '17% OFF', image: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=400&q=80', badge: 'BUDGET', rating: '4.4', reviews: '2.4K', category: 'Sandals' }
    ],
    stories: [
      { id: 'bat-story-1', title: 'The Posture Science of Bata Comfit', date: 'Jun 2026', image: 'https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=600&q=80', category: 'SCIENCE', excerpt: 'How ergonomic medical orthopedic testing in our Tongi manufacturing labs led to the develop of revolutionary footbed arcs that prevent spine pain.' }
    ],
    faqs: [
      { question: 'What is Bata\'s shoe size replacement policy?', answer: 'We offer an absolute 7-day hassle-free size exchange policy at any of Bata\'s 250+ retail stores in Bangladesh with valid invoice slips.' }
    ],
    contacts: { website: 'https://batabd.com', fb: 'https://facebook.com/batabangladesh', ig: 'https://instagram.com', whatsapp: '+8801700112233', support: '16514', email: 'support@batabd.com', storeLocator: 'Bata Plaza, Tongi Industrial Area, Dhaka' },
    relatedBrandIds: ['aarong']
  }
};
