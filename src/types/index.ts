export * from './schemas';
export * from './evaluation';
export * from './catalog';

// ─── GUIDE / RECOMMENDATION TYPES ───────────────────────

export type GuideMode = 'direct' | 'roundup';

export type AudienceTag =
  | 'Gamers' | 'Content Creators' | 'Office Professionals'
  | 'Students' | 'Vloggers' | 'Photographers' | 'Developers'
  | 'Casual Users' | 'Casual Wear' | 'Formal'
  | 'Outdoor & Adventure' | 'Premium Buyers' | 'Budget-Friendly'
  | 'Modest Fashion' | 'Families' | 'Solo Travelers'
  | 'Couples & Honeymoon' | 'Budget Travelers'
  | 'Luxury Travelers' | 'Business Travelers'
  | 'School Students' | 'University Students'
  | 'Working Professionals' | 'Beginners'
  | 'Advanced Learners' | 'Everyone' | 'Gift Ideas';

export interface GuideMentionedProduct {
  productId: string | number;
  name: string;
  brand: string;
  image: string;
  price: number;
  category: string;
  verified: boolean;
  creatorNote?: string;
  specs: Record<string, string>;
  isWinner?: boolean;
  rank?: number;
}

export interface GuideCreator {
  id: string | number;
  name: string;
  avatar: string;
  title: string;
  bio: string;
  verified: boolean;
  totalGuides: number;
  totalViews: number;
  expertise: string[];
  socialLinks?: {
    youtube?: string;
    facebook?: string;
    instagram?: string;
  };
}

export interface RecommendationGuide {
  id: string;
  slug: string;
  mode: GuideMode;
  category: string;
  title: string;
  subtitle?: string;
  coverImage: string;
  publishedAt: string;
  updatedAt?: string;
  readTimeMinutes: number;
  views: number;
  saves: number;
  creator: GuideCreator;
  featuredProduct: GuideMentionedProduct;
  mentionedProducts?: GuideMentionedProduct[];
  shortDescription: string;
  whatWeLike: string[];
  whatToConsider: string[];
  recommendedFor: AudienceTag[];
  verdict: string;
  relatedGuides?: {
    id: string;
    title: string;
    coverImage: string;
    category: string;
    creator: string;
  }[];
}
