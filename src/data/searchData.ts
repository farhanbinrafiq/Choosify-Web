export const BRAND_DEALS = [
  { id: 'aarong', name: "Aarong", dealHighlight: "Flat 15% OFF on Handicrafts", logo: "Aa", bgClass: "bg-orange-primary" },
  { id: 'apex', name: "Apex", dealHighlight: "Buy 1 Get 1 Free on Select Shoes", logo: "A", bgClass: "bg-navy" },
  { id: 'sailor', name: "Sailor", dealHighlight: "Flat 20% OFF on Casual Wear", logo: "S", bgClass: "bg-teal-700" },
  { id: 'adidas', name: "Adidas", dealHighlight: "Extra 10% OFF on Sportswear", logo: "Ad", bgClass: "bg-[#1A1D4E]" },
  { id: 'bay', name: "Bay Emporium", dealHighlight: "Up to 30% OFF on Leather Boots", logo: "B", bgClass: "bg-red-700" }
];

export const PROMO_CODES = [
  { brandId: 'aarong', brandName: "Aarong", code: "AARONG15", discount: "Flat 15% OFF" },
  { brandId: 'apex', brandName: "Apex", code: "APEXFOOT26", discount: "BDT 500 FLAT" },
  { brandId: 'sailor', brandName: "Sailor", code: "SAILOREID", discount: "Flat 20% OFF" },
  { brandId: 'adidas', brandName: "Adidas", code: "ADIEXTRA10", discount: "10% FLAT OFF" }
];

export const COMPARE_DATABASES = [
  { id: 'product-compare', title: "Sailor vs Yellow Cotton Comparison", category: "Products", route: "/compare" },
  { id: 'brand-compare', title: "Aarong vs Yellow Positioning Matrix", category: "Brands", route: "/compare" },
  { id: 'creator-compare', title: "Nafis Anjum vs Tasnim Creator Comparison", category: "Creators", route: "/compare" },
  { id: 'guide-compare', title: "Capsule vs Traditional Wardrobe Comparison", category: "Guides", route: "/compare" },
  { id: 'ai-compare', title: "Value vs Longevity Premium Quality Cost Matrix", category: "AI Matrix", route: "/compare" }
];

export interface Influencer {
  id: string;
  name: string;
  handle: string;
  avatar: string;
  bio: string;
  platform: 'YouTube' | 'Instagram' | 'TikTok' | 'Facebook';
  verifiedStatus: string;
  quickTip: string;
  rating?: number;
}

export const INFLUENCERS: Influencer[] = [
  {
    id: "inf-1",
    name: "Farhan Bin Rafiq",
    handle: "@farhan",
    avatar: "https://res.cloudinary.com/djdyqr8yd/image/upload/v1781880900/FBR_n3eycm.png",
    bio: "Senior Tech Analyst & Digital Product Researcher with 10+ years of experience in the Bangladesh market.",
    platform: "YouTube",
    verifiedStatus: "verified expert contributor",
    quickTip: "Always check for official warranty stickers when buying premium electronics in Bangladesh.",
    rating: 4.9
  },
  {
    id: "inf-2",
    name: "Sarah Jenkins",
    handle: "@sarah",
    avatar: "https://i.pravatar.cc/300?u=sarah",
    bio: "Fashion Curator & Retail Analyst specializing in contemporary garments, material longevity, and Dhaka street style.",
    platform: "Instagram",
    verifiedStatus: "fashion & beauty lead reviewer",
    quickTip: "Always wash delicate block prints in cold water to preserve dye vibrancy and prevent premature shrinkage.",
    rating: 4.8
  },
  {
    id: "inf-3",
    name: "Imtiaz Ahmed",
    handle: "@imtiaz",
    avatar: "https://i.pravatar.cc/300?u=imtiaz",
    bio: "Interior Designer and Home Solutions Specialist with a passion for energy-efficient appliances and cozy layouts.",
    platform: "Facebook",
    verifiedStatus: "home living chief editor",
    quickTip: "Prioritize multi-functional modular pieces to maintain open spaces in compact urban apartments.",
    rating: 4.7
  },
  {
    id: "inf-4",
    name: "Style Maven",
    handle: "@stylemaven",
    avatar: "https://i.pravatar.cc/300?u=stylemaven",
    bio: "Dhaka-based streetwear curator and wardrobe styling consultant.",
    platform: "Instagram",
    verifiedStatus: "verified lifestyle creator",
    quickTip: "Standard sneakers pair exceptionally well with semi-formal linen trousers.",
    rating: 4.6
  },
  {
    id: "inf-5",
    name: "BB Tech Reviews",
    handle: "@bbtech",
    avatar: "https://i.pravatar.cc/300?u=bbtech",
    bio: "Unbiased tech unboxings, deep specs breakdowns, and local product comparisons.",
    platform: "YouTube",
    verifiedStatus: "certified gadget reviewer",
    quickTip: "For true premium audio quality, always enable high-definition codec streaming.",
    rating: 4.9
  }
];
