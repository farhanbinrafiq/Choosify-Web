import {
  DEFAULT_OG_IMAGE,
  NOINDEX_PATH_PREFIXES,
  SITE_NAME,
  SITE_TAGLINE,
  SITE_URL,
  SITEMAP_STATIC_PATHS,
  absoluteUrl,
  shouldNoIndex,
} from '../../lib/seoShared';

export {
  DEFAULT_OG_IMAGE,
  NOINDEX_PATH_PREFIXES,
  SITE_NAME,
  SITE_TAGLINE,
  SITE_URL,
  SITEMAP_STATIC_PATHS,
  absoluteUrl,
  shouldNoIndex,
};

export const GA_MEASUREMENT_ID = 'G-4Z3ZF10WJD';

export type SeoMeta = {
  title: string;
  description: string;
  keywords?: string;
  ogImage?: string;
  ogType?: 'website' | 'article' | 'product';
  noindex?: boolean;
};

export const STATIC_PAGE_SEO: Record<string, SeoMeta> = {
  '/': {
    title: 'Choosify — Bangladesh Smartest Product Discovery Platform',
    description:
      "Compare verified brands, discover the best products, and shop with confidence on Choosify — Bangladesh's trusted product discovery platform.",
    keywords: 'choosify, product discovery, brands, compare prices, Bangladesh',
    ogType: 'website',
  },
  '/products': {
    title: 'All Products | Choosify',
    description: 'Browse verified products across categories with prices, reviews, and brand trust signals.',
  },
  '/brands': {
    title: 'Top Brands | Choosify',
    description: 'Explore verified brands on Choosify and compare offerings across Bangladesh.',
  },
  '/categories': {
    title: 'Categories | Choosify',
    description: 'Shop by category and find trusted products from verified brands.',
  },
  '/deals': {
    title: 'Best Deals | Choosify',
    description: 'Discover live deals, flash offers, and verified discounts from top brands.',
  },
  '/compare': {
    title: 'Compare Products & Brands | Choosify',
    description: 'Side-by-side comparison tool for products, brands, creators, and buying guides.',
  },
  '/guides': {
    title: 'Discover & Learn | Choosify',
    description: 'Buying guides, recommendations, creator picks, and educational content to help you decide with confidence.',
    ogType: 'article',
  },
  '/blogs': {
    title: 'Blogs & Buying Guides | Choosify',
    description: 'Expert blogs, reviews, and buying guides from the Choosify editorial team.',
    ogType: 'article',
  },
  '/recommendations': {
    title: 'Discover & Learn | Choosify',
    description: 'Buying guides, recommendations, creator picks, and educational content.',
    ogType: 'article',
  },
  '/creators': {
    title: 'Creators | Choosify',
    description: 'Discover creators sharing honest reviews and product recommendations.',
  },
  '/search': {
    title: 'Discover | Choosify',
    description: 'Discover products, brands, campaigns, guides, and creators across Choosify.',
  },
  '/about': {
    title: 'About Choosify',
    description: "Learn about Choosify — Bangladesh's smartest product discovery platform.",
  },
  '/contact': {
    title: 'Contact Us | Choosify',
    description: 'Get in touch with the Choosify team for support, partnerships, and inquiries.',
  },
  '/faq': {
    title: 'Frequently Asked Questions | Choosify',
    description:
      'Answers to common questions about comparing products, verified brands, deals, and shopping on Choosify.',
  },
  '/terms': {
    title: 'Terms of Service | Choosify',
    description: 'Read the Choosify terms of service.',
  },
  '/privacy': {
    title: 'Privacy Policy | Choosify',
    description: 'Read the Choosify privacy policy.',
  },
  '/partnership': {
    title: 'Partnership | Choosify',
    description: 'Partner with Choosify to reach verified shoppers across Bangladesh.',
  },
  '/advertise': {
    title: 'Advertise on Choosify',
    description: 'Promote your brand with Choosify advertising and sponsored placements.',
  },
  '/suggest-brand': {
    title: 'Suggest a Brand | Choosify',
    description: 'Suggest a brand to be listed and verified on Choosify.',
  },
  '/whats-on': {
    title: 'Events | Choosify',
    description: 'Discover upcoming brand events, product launches, festivals, and sponsored campaigns from verified shops.',
  },
  '/brand-deals': {
    title: 'Brand Deals | Choosify',
    description: 'Brand-wise deals and verified promotions on Choosify.',
  },
};
