import { absoluteUrl } from './seoConfig';

export function slugifyPathSegment(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function decodeRouteParam(value: string): string {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

type RoutableRecord = {
  id?: number | string;
  catalogId?: string;
  slug?: string;
  name?: string;
  title?: string;
};

export function matchesRouteParam(record: RoutableRecord, routeParam: string): boolean {
  const decoded = decodeRouteParam(routeParam);
  const normalized = decoded.toLowerCase();

  if (record.id !== undefined && String(record.id) === decoded) return true;
  if (record.catalogId && record.catalogId === decoded) return true;
  if (record.slug && record.slug.toLowerCase() === normalized) return true;

  const label = record.name || record.title;
  if (label) {
    if (label.toLowerCase() === normalized) return true;
    if (slugifyPathSegment(label) === normalized) return true;
  }

  return false;
}

export function buildCanonicalPath(pathname: string, search: string): string {
  const params = new URLSearchParams(search);
  const allowedQueryKeys = ['category', 'q', 'brand', 'service'];
  const filtered = new URLSearchParams();

  for (const key of allowedQueryKeys) {
    const value = params.get(key);
    if (value) filtered.set(key, value);
  }

  const query = filtered.toString();
  const normalizedPath = pathname.length > 1 && pathname.endsWith('/') ? pathname.slice(0, -1) : pathname;
  return query ? `${normalizedPath}?${query}` : normalizedPath;
}

export function buildCanonicalUrl(pathname: string, search = ''): string {
  return absoluteUrl(buildCanonicalPath(pathname, search));
}

export type OgPageType = 'website' | 'article' | 'product';

export function resolveOgType(pathname: string): OgPageType {
  if (pathname === '/') return 'website';
  if (pathname.startsWith('/products/')) return 'product';
  if (
    pathname.startsWith('/guides/') ||
    pathname.startsWith('/reviews/') ||
    pathname.startsWith('/blogs/') ||
    pathname.startsWith('/recommendations/') ||
    pathname.startsWith('/spotlight/')
  ) {
    return 'article';
  }
  if (
    pathname === '/guides' ||
    pathname === '/blogs' ||
    pathname === '/recommendations' ||
    pathname === '/spotlight'
  ) {
    return 'article';
  }
  return 'website';
}

const SECTION_LABELS: Record<string, string> = {
  products: 'Products',
  brands: 'Brands',
  categories: 'Categories',
  deals: 'Deals',
  compare: 'Compare',
  guides: 'Discover & Learn',
  blogs: 'Discover & Learn',
  recommendations: 'Discover & Learn',
  reviews: 'Review Details',
  creators: 'Creators',
  search: 'Discover',
  'whats-on': 'Events',
  'brand-deals': 'Brand Deals',
  about: 'About Us',
  contact: 'Contact Us',
  faq: 'FAQ',
  terms: 'Terms of Service',
  privacy: 'Privacy Policy',
  partnership: 'Partnership',
  advertise: 'Advertise',
  'suggest-brand': 'Suggest a Brand',
  'post-offer': 'Post Offer',
  cart: 'Cart',
  checkout: 'Checkout',
  'order-success': 'Order Success',
  'order-tracking': 'Order Tracking',
  dashboard: 'Dashboard',
  messages: 'Messages',
  profile: 'Profile',
  seller: 'Seller',
  login: 'Login',
};

export function humanizeSegment(segment: string): string {
  if (SECTION_LABELS[segment]) return SECTION_LABELS[segment];
  return decodeRouteParam(segment)
    .replace(/-/g, ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

export type BreadcrumbItem = { name: string; path: string };

export function buildBreadcrumbItems(
  pathname: string,
  search: string,
  labelsByPath: Record<string, string> = {},
): BreadcrumbItem[] {
  const crumbs: BreadcrumbItem[] = [{ name: 'Home', path: '/' }];
  const canonicalPath = buildCanonicalPath(pathname, search);
  const [pathOnly, queryString] = canonicalPath.split('?');
  const segments = pathOnly.split('/').filter(Boolean);

  let current = '';
  for (const segment of segments) {
    current += `/${segment}`;
    crumbs.push({
      name: labelsByPath[current] || humanizeSegment(segment),
      path: current,
    });
  }

  if (queryString) {
    const params = new URLSearchParams(queryString);
    const category = params.get('category');
    if (category && pathname.startsWith('/categories')) {
      crumbs.push({
        name: labelsByPath[`category:${category}`] || humanizeSegment(category),
        path: `${current}?category=${encodeURIComponent(category)}`,
      });
    }
    const brand = params.get('brand');
    if (brand && pathname.startsWith('/products')) {
      crumbs.push({
        name: labelsByPath[`brand:${brand}`] || humanizeSegment(brand),
        path: `${current}?brand=${encodeURIComponent(brand)}`,
      });
    }
    const query = params.get('q');
    if (query && pathname.startsWith('/search')) {
      crumbs.push({
        name: `Discover: ${query}`,
        path: `${current}?q=${encodeURIComponent(query)}`,
      });
    }
  }

  return crumbs;
}
