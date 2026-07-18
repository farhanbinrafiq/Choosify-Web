import type { EngagementEntityType } from '../../hooks/useCardEngagement';

/** Natural media ratios — never force identical rectangles */
export type ContentCardAspectRatio =
  | '9/16'
  | '16/9'
  | '1/1'
  | '4/5'
  | '3/4'
  | '16/10'
  | '2.2/1';

export type ContentCardLayoutVariant = 'reel' | 'landscape' | 'blog' | 'square' | 'live' | 'featured';

export type ContentCardPlatform = 'instagram' | 'youtube' | 'blog' | 'tiktok' | 'facebook' | 'live';

export type ContentCardMode = 'commerce' | 'editorial' | 'preview';

export interface ContentCardProduct {
  id: string | number;
  title: string;
  image?: string;
  price: number;
  slug?: string;
}

export interface ContentCardCta {
  label: string;
  href: string;
}

export interface ContentCardEngagement {
  entityType: EngagementEntityType;
  entityId: string | number;
  payload?: Record<string, unknown>;
}

export interface UniversalContentCardModel {
  id: string;
  href: string;
  title: string;
  excerpt?: string;
  layoutVariant: ContentCardLayoutVariant;
  aspectRatio: ContentCardAspectRatio;
  image?: string;
  videoUrl?: string;
  liveEmbedUrl?: string;
  badgeLabel: string;
  platform: ContentCardPlatform;
  platformLabel?: string;
  duration?: string;
  readTime?: string;
  isSponsored?: boolean;
  brandName?: string;
  creatorName?: string;
  product?: ContentCardProduct;
  primaryCta?: ContentCardCta;
  secondaryCta?: ContentCardCta;
  compareHref?: string;
  engagement?: ContentCardEngagement;
}

export interface UniversalContentCardProps {
  model: UniversalContentCardModel;
  mode?: ContentCardMode;
  onNavigate?: () => void;
  className?: string;
}
