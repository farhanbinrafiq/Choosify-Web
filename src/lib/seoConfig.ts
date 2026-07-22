import {
  DEFAULT_OG_IMAGE,
  NOINDEX_PATH_PREFIXES,
  OG_IMAGE_HEIGHT,
  OG_IMAGE_WIDTH,
  SITE_DEFAULT_DESCRIPTION,
  SITE_LOCALE,
  SITE_NAME,
  SITE_TAGLINE,
  SITE_THEME_COLOR,
  SITE_TWITTER_HANDLE,
  SITE_URL,
  SITEMAP_STATIC_PATHS,
  absoluteUrl,
  buildOgImageUrl,
  formatPageTitle,
  shouldNoIndex,
  type OgImageParams,
} from '../../lib/seoShared';

export {
  DEFAULT_OG_IMAGE,
  NOINDEX_PATH_PREFIXES,
  OG_IMAGE_HEIGHT,
  OG_IMAGE_WIDTH,
  SITE_DEFAULT_DESCRIPTION,
  SITE_LOCALE,
  SITE_NAME,
  SITE_TAGLINE,
  SITE_THEME_COLOR,
  SITE_TWITTER_HANDLE,
  SITE_URL,
  SITEMAP_STATIC_PATHS,
  absoluteUrl,
  buildOgImageUrl,
  formatPageTitle,
  shouldNoIndex,
};
export type { OgImageParams };

export const GA_MEASUREMENT_ID = 'G-4Z3ZF10WJD';

export type SeoMeta = {
  title: string;
  description: string;
  keywords?: string;
  ogImage?: string;
  ogType?: 'website' | 'article' | 'product';
  noindex?: boolean;
  /** Hint for dynamic OG card layout */
  ogCardType?: OgImageParams['type'];
  brandName?: string;
  entityImage?: string;
  label?: string;
};

export const STATIC_PAGE_SEO: Record<string, SeoMeta> = {
  '/': {
    title: 'Choosify — Bangladesh’s Smartest Product Discovery Platform',
    description: SITE_DEFAULT_DESCRIPTION,
    keywords: 'choosify, product discovery, brands, compare prices, Bangladesh, verified shopping',
    ogType: 'website',
    ogCardType: 'default',
  },
  '/products': {
    title: formatPageTitle('Browse Products & Services'),
    description:
      'Browse verified products and services with prices, reviews, and brand trust signals.',
    ogCardType: 'default',
    label: 'Browse',
  },
  '/brands': {
    title: formatPageTitle('Top Brands'),
    description: 'Explore verified brands on Choosify and compare offerings across Bangladesh.',
    ogCardType: 'brand',
    label: 'Brands',
  },
  '/categories': {
    title: formatPageTitle('Categories'),
    description: 'Shop by category and find trusted products from verified brands.',
    ogCardType: 'category',
    label: 'Categories',
  },
  '/deals': {
    title: formatPageTitle('Best Deals'),
    description: 'Discover live deals, flash offers, and verified discounts from top brands.',
    ogCardType: 'deal',
    label: 'Deals',
  },
  '/compare': {
    title: formatPageTitle('Compare Products & Brands'),
    description: 'Side-by-side comparison tool for products, brands, creators, and buying guides.',
    ogCardType: 'default',
    label: 'Compare',
  },
  '/spotlight': {
    title: formatPageTitle('Discover'),
    description:
      'Buying guides, recommendations, creator picks, and campaigns to help you decide with confidence.',
    ogType: 'article',
    ogCardType: 'article',
    label: 'Discover',
  },
  '/guides': {
    title: formatPageTitle('Discover & Learn'),
    description:
      'Buying guides, recommendations, creator picks, and educational content to help you decide with confidence.',
    ogType: 'article',
    ogCardType: 'article',
    label: 'Guides',
  },
  '/blogs': {
    title: formatPageTitle('Blogs & Buying Guides'),
    description: 'Expert blogs, reviews, and buying guides from the Choosify editorial team.',
    ogType: 'article',
    ogCardType: 'article',
    label: 'Blog',
  },
  '/recommendations': {
    title: formatPageTitle('Recommendations'),
    description: 'Buying guides, recommendations, creator picks, and educational content.',
    ogType: 'article',
    ogCardType: 'article',
    label: 'Picks',
  },
  '/creators': {
    title: formatPageTitle('Creators'),
    description: 'Discover creators sharing honest reviews and product recommendations.',
    ogCardType: 'creator',
    label: 'Creators',
  },
  '/search': {
    title: formatPageTitle('Discover'),
    description: 'Discover products, brands, campaigns, guides, and creators across Choosify.',
    ogCardType: 'default',
  },
  '/about': {
    title: formatPageTitle('About'),
    description: "Learn about Choosify — Bangladesh's smartest product discovery platform.",
  },
  '/contact': {
    title: formatPageTitle('Contact Us'),
    description: 'Get in touch with the Choosify team for support, partnerships, and inquiries.',
  },
  '/faq': {
    title: formatPageTitle('Frequently Asked Questions'),
    description:
      'Answers to common questions about comparing products, verified brands, deals, and shopping on Choosify.',
  },
  '/terms': {
    title: formatPageTitle('Terms of Service'),
    description: 'Read the Choosify terms of service.',
  },
  '/privacy': {
    title: formatPageTitle('Privacy Policy'),
    description: 'Read the Choosify privacy policy.',
  },
  '/partnership': {
    title: formatPageTitle('Partnership'),
    description: 'Partner with Choosify to reach verified shoppers across Bangladesh.',
  },
  '/advertise': {
    title: formatPageTitle('Advertise'),
    description: 'Promote your brand with Choosify advertising and sponsored placements.',
  },
  '/suggest-brand': {
    title: formatPageTitle('Suggest a Brand'),
    description: 'Suggest a brand to be listed and verified on Choosify.',
  },
  '/brand-deals': {
    title: formatPageTitle('Brand Deals'),
    description: 'Brand-wise deals and verified promotions on Choosify.',
    ogCardType: 'deal',
    label: 'Deals',
  },
};
