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
}

export interface UniversalCommerceCardProps {
  model: UniversalCommerceCardModel;
  variant: CommerceCardVariant;
  mode?: ContentCardMode;
  onNavigate?: () => void;
  className?: string;
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
