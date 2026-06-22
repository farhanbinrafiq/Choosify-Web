import { DynamicGuideData } from '../types/guide';

export const CREATOR_MAP = {
  farhan: {
    id: 'creator-farhan',
    name: 'Farhan Bin Rafiq',
    avatar: 'https://i.pravatar.cc/300?u=farhan',
    bio: 'Senior Tech Analyst & Digital Product Researcher with 10+ years of experience in the Bangladesh market.',
    socials: {
      facebook: 'https://facebook.com/farhan',
      twitter: 'https://twitter.com/farhan',
      youtube: 'https://youtube.com/farhan'
    },
    verifiedStatus: 'verified expert contributor',
    quickTip: 'Always check for official warranty stickers when buying premium electronics in Bangladesh.'
  },
  sarah: {
    id: 'creator-sarah',
    name: 'Sarah Jenkins',
    avatar: 'https://i.pravatar.cc/300?u=sarah',
    bio: 'Fashion Curator & Retail Analyst specializing in contemporary garments, material longevity, and Dhaka street style.',
    socials: {
      facebook: 'https://facebook.com/sarah',
      twitter: 'https://twitter.com/sarah',
      youtube: 'https://youtube.com/sarah'
    },
    verifiedStatus: 'fashion & beauty lead reviewer',
    quickTip: 'Always wash delicate block prints in cold water to preserve dye vibrancy and prevent premature shrinkage.'
  },
  imtiaz: {
    id: 'creator-imtiaz',
    name: 'Imtiaz Ahmed',
    avatar: 'https://i.pravatar.cc/300?u=imtiaz',
    bio: 'Interior Designer and Home Solutions Specialist with a passion for energy-efficient appliances and cozy layouts.',
    socials: {
      facebook: 'https://facebook.com/imtiaz',
      twitter: 'https://twitter.com/imtiaz',
      youtube: 'https://youtube.com/imtiaz'
    },
    verifiedStatus: 'home living chief editor',
    quickTip: 'Prioritize multi-functional modular pieces to maintain open spaces in compact urban apartments.'
  }
};

export const DYNAMIC_GUIDES: Record<number, DynamicGuideData> = {
  1: {
    id: 1,
    title: 'Top 10 Smartphones to Buy in 2026',
    mode: 'roundup',
    creator: CREATOR_MAP.farhan,
    categorySpecType: 'mobile',
    priceStores: [
      { name: 'Daraz', price: '145,000', delivery: 'Free · 2-3 days', isBest: true, iconType: 'ShoppingBag' },
      { name: 'Pickaboo', price: '146,500', delivery: '৳60 · 1-2 days', iconType: 'Smartphone' },
      { name: 'Gadget Store', price: '148,000', delivery: 'Free · 3-5 days', iconType: 'Globe' },
      { name: 'Authorized Store', price: '150,000', delivery: '৳50 · 2-4 days', iconType: 'Bookmark' }
    ]
  },
  2: {
    id: 2,
    title: 'TOP 10 SMARTPHONES TO BUY IN 2026',
    mode: 'roundup',
    creator: CREATOR_MAP.farhan,
    categorySpecType: 'mobile',
    priceStores: [
      { name: 'Daraz', price: '145,000', delivery: 'Free · 2-3 days', isBest: true, iconType: 'ShoppingBag' },
      { name: 'Pickaboo', price: '146,500', delivery: '৳60 · 1-2 days', iconType: 'Smartphone' },
      { name: 'Gadget Store', price: '148,000', delivery: 'Free · 3-5 days', iconType: 'Globe' },
      { name: 'Authorized Store', price: '150,000', delivery: '৳50 · 2-4 days', iconType: 'Bookmark' }
    ]
  },
  3: {
    id: 3,
    title: 'Is the S24 Ultra Still Worth It in Late 2026?',
    mode: 'direct', // focuses primarily on S24 Ultra directly
    creator: CREATOR_MAP.sarah,
    categorySpecType: 'mobile',
    priceStores: [
      { name: 'Daraz', price: '143,500', delivery: 'Free · 1-2 days', isBest: true, iconType: 'ShoppingBag' },
      { name: 'Pickaboo', price: '145,000', delivery: '৳50 · 1-2 days', iconType: 'Smartphone' },
      { name: 'Authentic BD', price: '146,000', delivery: 'Free · 3 days', iconType: 'Globe' },
      { name: 'Ryan Gadgets', price: '147,500', delivery: '৳60 · 2-4 days', iconType: 'Bookmark' }
    ]
  },
  4: {
    id: 4,
    title: 'Apex vs Bata: The Ultimate Sports Shoe Battle',
    mode: 'roundup',
    creator: CREATOR_MAP.sarah,
    categorySpecType: 'fashion',
    priceStores: [
      { name: 'Apex Store', price: '3,200', delivery: 'Free · 2-3 days', isBest: true, iconType: 'ShoppingBag' },
      { name: 'Bata BD', price: '3,500', delivery: 'Free · 1-2 days', iconType: 'Globe' },
      { name: 'Daraz Mall', price: '3,150', delivery: '৳60 · 3-5 days', iconType: 'Bookmark' },
      { name: 'Lotto Outlet', price: '2,900', delivery: '৳50 · 2-4 days', iconType: 'Smartphone' }
    ]
  },
  5: {
    id: 5,
    title: 'Morning Skincare Routine for Dry Skin',
    mode: 'direct',
    creator: CREATOR_MAP.sarah,
    categorySpecType: 'beauty',
    priceStores: [
      { name: 'Skin Care BD', price: '1,800', delivery: 'Free · 2 days', isBest: true, iconType: 'ShoppingBag' },
      { name: 'Daraz', price: '1,850', delivery: '৳60 · 2-3 days', iconType: 'Smartphone' },
      { name: 'Beauty Shop', price: '1,900', delivery: 'Free · 3 days', iconType: 'Globe' },
      { name: 'Pure Cosmetics', price: '1,950', delivery: '৳50 · 1-2 days', iconType: 'Bookmark' }
    ]
  },
  6: {
    id: 6,
    title: 'Playstation 5 Pro Review: Is it really worth the upgrade?',
    mode: 'direct',
    creator: CREATOR_MAP.farhan,
    categorySpecType: 'gaming',
    priceStores: [
      { name: 'Ryans', price: '85,000', delivery: 'Free · 2-3 days', isBest: true, iconType: 'ShoppingBag' },
      { name: 'Star Tech', price: '86,500', delivery: '৳60 · 1-2 days', iconType: 'Bookmark' },
      { name: 'Tech Land', price: '87,000', delivery: 'Free · 3 days', iconType: 'Globe' },
      { name: 'Daraz BD', price: '89,000', delivery: '৳100 · 2-4 days', iconType: 'Smartphone' }
    ]
  },
  7: {
    id: 7,
    title: 'Luxury Watches Every Man Should Own',
    mode: 'roundup',
    creator: CREATOR_MAP.imtiaz,
    categorySpecType: 'fashion',
    priceStores: [
      { name: 'Timekeeper BD', price: '45,000', delivery: 'Free · 1-2 days', isBest: true, iconType: 'ShoppingBag' },
      { name: 'Perfume World', price: '48,000', delivery: 'Free · 2-3 days', iconType: 'Globe' },
      { name: 'Daraz Mall', price: '46,500', delivery: '৳100 · 3-5 days', iconType: 'Bookmark' },
      { name: 'Watches BD', price: '49,000', delivery: '৳80 · 2-4 days', iconType: 'Smartphone' }
    ]
  },
  8: {
    id: 8,
    title: 'Best Coffee Machines for Barista Quality',
    mode: 'roundup',
    creator: CREATOR_MAP.imtiaz,
    categorySpecType: 'home',
    priceStores: [
      { name: 'Kitchen World', price: '28,000', delivery: 'Free · 2-3 days', isBest: true, iconType: 'ShoppingBag' },
      { name: 'Daraz BD', price: '29,500', delivery: '৳150 · 3-5 days', iconType: 'Smartphone' },
      { name: 'Best Buy BD', price: '31,000', delivery: 'Free · 3 days', iconType: 'Globe' },
      { name: 'Star Tech', price: '32,500', delivery: '৳100 · 2-4 days', iconType: 'Bookmark' }
    ]
  }
};

// Fallback dynamic configuration
export const DEFAULT_DYNAMIC_GUIDE: DynamicGuideData = {
  id: 1,
  title: 'Unbiased Buying Recommendations',
  mode: 'roundup',
  creator: CREATOR_MAP.farhan,
  categorySpecType: 'mobile',
  priceStores: [
    { name: 'Daraz', price: '12,500', delivery: 'Free · 2-3 days', isBest: true, iconType: 'ShoppingBag' },
    { name: 'Pickaboo', price: '12,800', delivery: '৳60 · 1-2 days', iconType: 'Smartphone' },
    { name: 'Original Store', price: '13,000', delivery: 'Free · 3 days', iconType: 'Globe' },
    { name: 'Partner Shop', price: '13,200', delivery: '৳50 · 2-4 days', iconType: 'Bookmark' }
  ]
};

import { BLOGS } from '../constants';
export const mockGuides = BLOGS.map(g => ({
  ...g,
  tags: [g.category, g.type, g.author.split(' ')[0], 'guide', 'buying']
}));

