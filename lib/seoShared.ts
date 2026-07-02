/** Server-safe SEO constants shared by Vercel API routes and the client bundle. */

export const SITE_URL = 'https://www.choosify.bd';
export const SITE_NAME = 'Choosify';
export const SITE_TAGLINE = 'Choosify buy ORIGINAL';
export const DEFAULT_OG_IMAGE = `${SITE_URL}/logo.png`;
export const CATALOG_API_BASE_URL =
  (typeof process !== 'undefined' && process.env?.CATALOG_API_BASE_URL?.replace(/\/$/, '')) ||
  'https://dashboard.choosify.bd/api/v1';

export const ORGANIZATION_SOCIAL_LINKS = [
  'https://www.facebook.com/choosify.bd',
  'https://www.instagram.com/choosify.bd/',
  'https://www.tiktok.com/@choosify5',
  'https://www.youtube.com/@choosifybd',
];

export const ORGANIZATION_CONTACT = {
  email: 'support@choosify.bd',
  contactType: 'customer support',
};

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
  { path: '/blogs', changeFrequency: 'daily', priority: 0.85 },
  { path: '/recommendations', changeFrequency: 'daily', priority: 0.8 },
  { path: '/creators', changeFrequency: 'weekly', priority: 0.75 },
  { path: '/search', changeFrequency: 'weekly', priority: 0.5 },
  { path: '/about', changeFrequency: 'monthly', priority: 0.5 },
  { path: '/contact', changeFrequency: 'monthly', priority: 0.5 },
  { path: '/faq', changeFrequency: 'monthly', priority: 0.55 },
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
