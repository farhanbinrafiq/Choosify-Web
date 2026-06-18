export type GuideMode = 'direct' | 'roundup';

export interface CreatorData {
  id?: string;
  name: string;
  avatar: string;
  bio: string;
  socials: {
    facebook?: string;
    twitter?: string;
    youtube?: string;
  };
  verifiedStatus: string;
  quickTip: string;
}

export interface SpecCriteria {
  iconName: 'Smartphone' | 'Laptop' | 'Zap' | 'Globe' | 'MessageSquare' | 'ShoppingBag';
  label: string;
  pros: string[];
  cons: string[];
  best: string;
}

export interface GuideSpecConfig {
  category: string;
  criteriaList: SpecCriteria[];
}

export interface DynamicGuideData {
  id: number;
  title: string;
  excerpt?: string;
  mode: GuideMode;
  creator: CreatorData;
  categorySpecType: string; // references spec configurations
  priceStores?: Array<{
    name: string;
    price: string;
    delivery: string;
    isBest?: boolean;
    iconType: 'ShoppingBag' | 'Smartphone' | 'Globe' | 'Bookmark';
  }>;
}
