export const SITE_URL = 'https://www.choosify.bd';
export const SITE_NAME = 'Choosify';
export const SITE_TAGLINE = 'Choosify buy ORIGINAL';
export const DEFAULT_OG_IMAGE = `${SITE_URL}/logo.png`;
export const GA_MEASUREMENT_ID = 'G-4Z3ZF10WJD';

export type SeoMeta = {
  title: string;
  description: string;
  keywords?: string;
  ogImage?: string;
  noindex?: boolean;
};

export const STATIC_PAGE_SEO: Record<string, SeoMeta> = {
  '/': {
    title: 'Choosify — Bangladesh Smartest Product Discovery Platform',
    description:
      "Compare verified brands, discover the best products, and shop with confidence on Choosify — Bangladesh's trusted product discovery platform.",
    keywords: 'choosify, product discovery, brands, compare prices, Bangladesh',
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
    title: 'Buying Guides & Recommendations | Choosify',
    description: 'Expert guides, reviews, and recommendations to help you choose the right product.',
  },
  '/recommendations': {
    title: 'Recommendations | Choosify',
    description: 'Curated recommendations and editorial picks from the Choosify team.',
  },
  '/creators': {
    title: 'Creators | Choosify',
    description: 'Discover creators sharing honest reviews and product recommendations.',
  },
  '/search': {
    title: 'Search | Choosify',
    description: 'Search products, brands, guides, and deals on Choosify.',
  },
  '/about': {
    title: 'About Choosify',
    description: 'Learn about Choosify — Bangladesh\'s smartest product discovery platform.',
  },
  '/contact': {
    title: 'Contact Us | Choosify',
    description: 'Get in touch with the Choosify team for support, partnerships, and inquiries.',
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
  '/b2b': {
    title: 'B2B Solutions | Choosify',
    description: 'Wholesale and B2B solutions for brands and retailers on Choosify.',
  },
  '/suggest-brand': {
    title: 'Suggest a Brand | Choosify',
    description: 'Suggest a brand to be listed and verified on Choosify.',
  },
  '/customer-favorite': {
    title: 'Customer Favorites | Choosify',
    description: 'See what Choosify customers love most.',
  },
  '/brand-deals': {
    title: 'Brand Deals | Choosify',
    description: 'Brand-wise deals and verified promotions on Choosify.',
  },
};

/** Routes that should not be indexed */
export const NOINDEX_PATH_PREFIXES = [
  '/login',
  '/dashboard',
  '/checkout',
  '/cart',
  '/messages',
  '/seller',
  '/order-success',
  '/order-tracking',
  '/post-offer',
  '/profile',
  '/overview',
];

export const SITEMAP_STATIC_PATHS: Array<{
  path: string;
  changeFrequency: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority: number;
}> = [
  { path: '/', changeFrequency: 'daily', priority: 1.0 },
  { path: '/products', changeFrequency: 'daily', priority: 0.9 },
  { path: '/brands', changeFrequency: 'daily', priority: 0.9 },
  { path: '/categories', changeFrequency: 'weekly', priority: 0.8 },
  { path: '/deals', changeFrequency: 'daily', priority: 0.85 },
  { path: '/compare', changeFrequency: 'weekly', priority: 0.7 },
  { path: '/guides', changeFrequency: 'daily', priority: 0.85 },
  { path: '/recommendations', changeFrequency: 'daily', priority: 0.8 },
  { path: '/creators', changeFrequency: 'weekly', priority: 0.75 },
  { path: '/search', changeFrequency: 'weekly', priority: 0.5 },
  { path: '/about', changeFrequency: 'monthly', priority: 0.5 },
  { path: '/contact', changeFrequency: 'monthly', priority: 0.5 },
  { path: '/terms', changeFrequency: 'yearly', priority: 0.3 },
  { path: '/privacy', changeFrequency: 'yearly', priority: 0.3 },
  { path: '/partnership', changeFrequency: 'monthly', priority: 0.5 },
  { path: '/advertise', changeFrequency: 'monthly', priority: 0.5 },
  { path: '/b2b', changeFrequency: 'monthly', priority: 0.5 },
  { path: '/suggest-brand', changeFrequency: 'monthly', priority: 0.4 },
  { path: '/customer-favorite', changeFrequency: 'weekly', priority: 0.6 },
  { path: '/brand-deals', changeFrequency: 'daily', priority: 0.7 },
];

export function absoluteUrl(path: string): string {
  if (path.startsWith('http')) return path;
  return `${SITE_URL}${path.startsWith('/') ? path : `/${path}`}`;
}

export function shouldNoIndex(pathname: string): boolean {
  return NOINDEX_PATH_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );
}
