import type {
  ContentCardAspectRatio,
  ContentCardCta,
  ContentCardEngagement,
  ContentCardLayoutVariant,
  ContentCardMode,
  ContentCardPlatform,
  ContentCardProduct,
  UniversalContentCardModel,
} from './universalContentCardTypes';

/** Media-only variant — layout, typography, and footer stay identical */
export type CommerceCardVariant =
  | 'landscape-video'
  | 'portrait-reel'
  | 'blog'
  | 'image'
  | 'live'
  | 'guide'
  | 'square';

export interface UniversalCommerceCardModel extends UniversalContentCardModel {
  ctaLabel?: string;
  views?: string | number;
  likes?: string | number;
  shares?: string | number;
  popularityScore?: number;
  publishedAt?: string;
  creatorAvatar?: string;
  /** Publisher trust signal for the feed header */
  isVerified?: boolean;
  /** e.g. Brand / Creator / Verified Seller */
  publisherTypeLabel?: string;
}

export interface UniversalCommerceCardProps {
  model: UniversalCommerceCardModel;
  variant: CommerceCardVariant;
  mode?: ContentCardMode;
  /**
   * LE-006 — render brand/creator identity above the media (Facebook-style).
   * Opt-in so preview surfaces (Guides, Product Details) keep their layout.
   */
  showPublisherHeader?: boolean;
  onNavigate?: () => void;
  className?: string;
  /**
   * Discover Blog Stories lane — horizontal row:
   * 40% square thumbnail | 60% title + byline.
   */
  compactMedia?: boolean;
}

const LAYOUT_TO_VARIANT: Record<ContentCardLayoutVariant, CommerceCardVariant> = {
  reel: 'portrait-reel',
  landscape: 'landscape-video',
  blog: 'blog',
  square: 'square',
  live: 'live',
  featured: 'landscape-video',
};

export function resolveCommerceCardVariant(
  layoutVariant: ContentCardLayoutVariant,
  aspectRatio?: ContentCardAspectRatio,
): CommerceCardVariant {
  if (layoutVariant === 'blog') return 'guide';
  if (layoutVariant === 'square') return aspectRatio === '1/1' ? 'square' : 'image';
  return LAYOUT_TO_VARIANT[layoutVariant];
}

export type {
  ContentCardAspectRatio,
  ContentCardCta,
  ContentCardEngagement,
  ContentCardLayoutVariant,
  ContentCardMode,
  ContentCardPlatform,
  ContentCardProduct,
};
