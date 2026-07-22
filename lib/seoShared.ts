/** Server-safe SEO constants shared by Vercel API routes and the client bundle. */

export const SITE_URL = 'https://www.choosify.bd';
export const SITE_NAME = 'Choosify';
export const SITE_TAGLINE = 'Choosify — Bangladesh’s Smartest Product Discovery Platform';
export const SITE_DEFAULT_DESCRIPTION =
  "Compare verified brands, discover trusted products, and shop with confidence on Choosify — Bangladesh's product & service discovery platform.";
export const SITE_TWITTER_HANDLE = '@choosifybd';
export const SITE_LOCALE = 'en_BD';
export const SITE_THEME_COLOR = '#000435';
export const SITE_BRAND_ORANGE = '#FF5B00';

/** Default social image size (Open Graph / Twitter large card) */
export const OG_IMAGE_WIDTH = 1200;
export const OG_IMAGE_HEIGHT = 630;

/**
 * Static fallback when the dynamic OG edge route is unavailable.
 * Version the filename when replacing the graphic — Facebook caches og:image by URL indefinitely.
 */
export const DEFAULT_OG_IMAGE_PATH = '/og/og-image-v2.png';
export const DEFAULT_OG_IMAGE = `${SITE_URL}${DEFAULT_OG_IMAGE_PATH}`;

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
  '/marketing',
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
  { path: '/spotlight', changeFrequency: 'daily', priority: 0.9 },
  { path: '/guides', changeFrequency: 'daily', priority: 0.85 },
  { path: '/blogs', changeFrequency: 'daily', priority: 0.85 },
  { path: '/recommendations', changeFrequency: 'daily', priority: 0.8 },
  { path: '/creators', changeFrequency: 'weekly', priority: 0.75 },
  { path: '/search', changeFrequency: 'weekly', priority: 0.5 },
  { path: '/about', changeFrequency: 'monthly', priority: 0.5 },
  { path: '/careers', changeFrequency: 'weekly', priority: 0.55 },
  { path: '/contact', changeFrequency: 'monthly', priority: 0.5 },
  { path: '/faq', changeFrequency: 'monthly', priority: 0.55 },
  { path: '/terms', changeFrequency: 'yearly', priority: 0.3 },
  { path: '/privacy', changeFrequency: 'yearly', priority: 0.3 },
  { path: '/partnership', changeFrequency: 'monthly', priority: 0.5 },
  { path: '/advertise', changeFrequency: 'monthly', priority: 0.5 },
  { path: '/suggest-brand', changeFrequency: 'monthly', priority: 0.4 },
  { path: '/brand-deals', changeFrequency: 'daily', priority: 0.7 },
];

/** Social crawler user-agents that need server-rendered meta (SPA shells are insufficient). */
export const SOCIAL_CRAWLER_UA_PATTERN =
  /facebookexternalhit|Facebot|Twitterbot|LinkedInBot|Slackbot|Discordbot|WhatsApp|TelegramBot|SkypeUriPreview|Pinterest|redditbot|Embedly|Quora Link Preview|Showyoubot|outbrain|vkShare|W3C_Validator|Google.*snippet/i;

export function absoluteUrl(path: string): string {
  if (path.startsWith('http')) return path;
  return `${SITE_URL}${path.startsWith('/') ? path : `/${path}`}`;
}

export function shouldNoIndex(pathname: string): boolean {
  return NOINDEX_PATH_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );
}

/** Title template: "Page Name | Choosify" */
export function formatPageTitle(pageTitle: string, options?: { absolute?: boolean }): string {
  const trimmed = pageTitle.trim();
  if (!trimmed) return SITE_NAME;
  if (options?.absolute || trimmed.includes(SITE_NAME)) return trimmed;
  return `${trimmed} | ${SITE_NAME}`;
}

export type OgImageParams = {
  title: string;
  description?: string;
  type?: 'default' | 'product' | 'brand' | 'category' | 'deal' | 'article' | 'creator';
  image?: string;
  brand?: string;
  label?: string;
};

/** Dynamic Open Graph image URL (Vercel Edge `/api/og`). */
export function buildOgImageUrl(params: OgImageParams): string {
  const search = new URLSearchParams();
  search.set('title', params.title.slice(0, 120));
  if (params.description) search.set('description', params.description.slice(0, 160));
  if (params.type) search.set('type', params.type);
  if (params.image) search.set('image', params.image);
  if (params.brand) search.set('brand', params.brand.slice(0, 60));
  if (params.label) search.set('label', params.label.slice(0, 40));
  return absoluteUrl(`/api/og?${search.toString()}`);
}
