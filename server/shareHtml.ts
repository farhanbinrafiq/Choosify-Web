/**
 * Plain-Node replacement for api/share.js (previously a Vercel Edge Function).
 * Renders complete server-side Open Graph/Twitter-card HTML for social-media
 * crawlers, which do not execute the SPA's client-side PageSeo.tsx.
 */
import {
  CATALOG_API_BASE_URL,
  DEFAULT_OG_IMAGE,
  SITE_LOCALE,
  SITE_NAME,
  SITE_THEME_COLOR,
  SITE_TWITTER_HANDLE,
  SITE_URL,
  OG_IMAGE_HEIGHT,
  OG_IMAGE_WIDTH,
  absoluteUrl,
  buildOgImageUrl,
  formatPageTitle,
  shouldNoIndex,
} from '../lib/seoShared';

function escapeHtml(value: string): string {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function clip(value: string | undefined, max: number): string {
  const t = String(value || '').trim();
  if (t.length <= max) return t;
  return `${t.slice(0, max - 1).trimEnd()}…`;
}

function humanize(value: string): string {
  try {
    return decodeURIComponent(value)
      .replace(/[-_]+/g, ' ')
      .replace(/\b\w/g, (c) => c.toUpperCase());
  } catch {
    return value;
  }
}

function normalizePath(pathname: string, search: string): string {
  const params = new URLSearchParams(search.startsWith('?') ? search.slice(1) : search);
  const allowed = ['category', 'q', 'brand', 'service'];
  const filtered = new URLSearchParams();
  for (const key of allowed) {
    const value = params.get(key);
    if (value) filtered.set(key, value);
  }
  const normalized = pathname.length > 1 && pathname.endsWith('/') ? pathname.slice(0, -1) : pathname;
  const query = filtered.toString();
  return query ? `${normalized}?${query}` : normalized;
}

async function fetchCatalogJson(path: string): Promise<any> {
  try {
    const res = await fetch(`${CATALOG_API_BASE_URL}${path.startsWith('/') ? path : `/${path}`}`, {
      headers: { Accept: 'application/json' },
      signal: AbortSignal.timeout(4000),
    });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

type ShareMeta = {
  title: string;
  description: string;
  ogImage: string;
  ogType: string;
  canonical: string;
  noindex: boolean;
};

const STATIC_SHARE: Record<string, { title: string; description: string; ogImage: string; ogType: string }> = {
  '/': {
    title: 'Choosify — Bangladesh’s Smartest Product Discovery Platform',
    description:
      "Compare verified brands, discover trusted products, and shop with confidence on Choosify — Bangladesh's product & service discovery platform.",
    ogImage: DEFAULT_OG_IMAGE,
    ogType: 'website',
  },
  '/products': {
    title: formatPageTitle('All Products'),
    description: 'Browse verified products and services with prices, reviews, and brand trust signals.',
    ogImage: '',
    ogType: 'website',
  },
  '/brands': {
    title: formatPageTitle('Top Brands'),
    description: 'Explore verified brands on Choosify and compare offerings across Bangladesh.',
    ogImage: '',
    ogType: 'website',
  },
  '/categories': {
    title: formatPageTitle('Categories'),
    description: 'Shop by category and find trusted products from verified brands.',
    ogImage: '',
    ogType: 'website',
  },
  '/deals': {
    title: formatPageTitle('Best Deals'),
    description: 'Discover live deals, flash offers, and verified discounts from top brands.',
    ogImage: '',
    ogType: 'website',
  },
  '/spotlight': {
    title: formatPageTitle('Discover'),
    description: 'Guides, reviews, campaigns, and creator picks to help you decide with confidence.',
    ogImage: '',
    ogType: 'article',
  },
  '/creators': {
    title: formatPageTitle('Creators'),
    description: 'Discover creators sharing honest reviews and product recommendations.',
    ogImage: '',
    ogType: 'website',
  },
  '/compare': {
    title: formatPageTitle('Compare Products & Brands'),
    description: 'Side-by-side comparison for products, brands, creators, and buying guides.',
    ogImage: '',
    ogType: 'website',
  },
};

async function resolveShareMeta(pathname: string, search: string): Promise<ShareMeta> {
  const canonicalPath = normalizePath(pathname, search);
  const canonical = absoluteUrl(canonicalPath);
  const noindex = shouldNoIndex(pathname);
  const segments = pathname.split('/').filter(Boolean);
  const [section, id] = segments;

  if (section === 'products' && id) {
    const product = await fetchCatalogJson(`/products/${encodeURIComponent(id)}`);
    const title = product?.seoTitle || product?.title || product?.name || humanize(id);
    const description =
      product?.seoDescription ||
      product?.description ||
      `View ${title} on Choosify — verified product discovery for Bangladesh.`;
    const brand = product?.brandName || product?.brand || '';
    const image = product?.image || product?.images?.[0] || '';
    return {
      title: formatPageTitle(title),
      description: clip(description, 160),
      ogImage: buildOgImageUrl({
        title,
        description: clip(description, 120),
        type: 'product',
        image,
        brand,
        label: 'Product',
      }),
      ogType: 'product',
      canonical,
      noindex,
    };
  }

  if (section === 'brands' && id) {
    const brand = await fetchCatalogJson(`/brands/${encodeURIComponent(id)}`);
    const name = brand?.name || humanize(id);
    const description = brand?.description || brand?.category || `Explore ${name} on Choosify.`;
    return {
      title: formatPageTitle(name),
      description: clip(description, 160),
      ogImage: buildOgImageUrl({
        title: name,
        description: clip(description, 120),
        type: 'brand',
        image: brand?.logo || '',
        label: 'Brand',
      }),
      ogType: 'website',
      canonical,
      noindex,
    };
  }

  if (
    (section === 'spotlight' ||
      section === 'guides' ||
      section === 'blogs' ||
      section === 'recommendations' ||
      section === 'reviews') &&
    id
  ) {
    const title = humanize(id);
    const description = `Read ${title} on Choosify Discover.`;
    return {
      title: formatPageTitle(title),
      description,
      ogImage: buildOgImageUrl({ title, description, type: 'article', label: 'Discover' }),
      ogType: 'article',
      canonical,
      noindex,
    };
  }

  if (pathname.startsWith('/categories')) {
    const params = new URLSearchParams(search.startsWith('?') ? search.slice(1) : search);
    const category = params.get('category');
    if (category) {
      const name = humanize(category);
      const description = `Browse ${name} products and services on Choosify.`;
      return {
        title: formatPageTitle(name),
        description,
        ogImage: buildOgImageUrl({ title: name, description, type: 'category', label: 'Category' }),
        ogType: 'website',
        canonical,
        noindex,
      };
    }
  }

  const staticMeta = STATIC_SHARE[pathname];
  if (staticMeta) {
    return {
      ...staticMeta,
      ogImage:
        staticMeta.ogImage ||
        buildOgImageUrl({
          title: staticMeta.title,
          description: staticMeta.description,
          type: staticMeta.ogType === 'article' ? 'article' : pathname === '/deals' ? 'deal' : 'default',
        }),
      canonical,
      noindex,
    };
  }

  return {
    title: SITE_NAME,
    description:
      "Compare verified brands, discover trusted products, and shop with confidence on Choosify — Bangladesh's product & service discovery platform.",
    ogImage: buildOgImageUrl({ title: SITE_NAME, description: SITE_NAME, type: 'default' }),
    ogType: 'website',
    canonical,
    noindex,
  };
}

export async function buildShareHtml(pathname: string, search: string): Promise<string> {
  const meta = await resolveShareMeta(pathname || '/', search);

  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${escapeHtml(meta.title)}</title>
  <meta name="description" content="${escapeHtml(meta.description)}" />
  <meta name="theme-color" content="${SITE_THEME_COLOR}" />
  <meta name="robots" content="${meta.noindex ? 'noindex, nofollow' : 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1'}" />
  <link rel="canonical" href="${escapeHtml(meta.canonical)}" />
  <meta property="og:type" content="${meta.ogType}" />
  <meta property="og:site_name" content="${SITE_NAME}" />
  <meta property="og:locale" content="${SITE_LOCALE}" />
  <meta property="og:title" content="${escapeHtml(meta.title)}" />
  <meta property="og:description" content="${escapeHtml(meta.description)}" />
  <meta property="og:url" content="${escapeHtml(meta.canonical)}" />
  <meta property="og:image" content="${escapeHtml(meta.ogImage)}" />
  <meta property="og:image:secure_url" content="${escapeHtml(meta.ogImage)}" />
  <meta property="og:image:width" content="${OG_IMAGE_WIDTH}" />
  <meta property="og:image:height" content="${OG_IMAGE_HEIGHT}" />
  <meta property="og:image:alt" content="${escapeHtml(meta.title)}" />
  <meta property="og:image:type" content="image/png" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:site" content="${SITE_TWITTER_HANDLE}" />
  <meta name="twitter:creator" content="${SITE_TWITTER_HANDLE}" />
  <meta name="twitter:title" content="${escapeHtml(meta.title)}" />
  <meta name="twitter:description" content="${escapeHtml(meta.description)}" />
  <meta name="twitter:image" content="${escapeHtml(meta.ogImage)}" />
  <meta name="twitter:image:alt" content="${escapeHtml(meta.title)}" />
  <meta http-equiv="refresh" content="0;url=${escapeHtml(meta.canonical)}" />
</head>
<body>
  <p><a href="${escapeHtml(meta.canonical)}">${escapeHtml(meta.title)}</a></p>
  <p>${escapeHtml(meta.description)}</p>
</body>
</html>`;
}
