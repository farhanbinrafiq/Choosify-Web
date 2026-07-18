import {
  DEFAULT_OG_IMAGE,
  OG_IMAGE_HEIGHT,
  OG_IMAGE_WIDTH,
  SITE_DEFAULT_DESCRIPTION,
  SITE_LOCALE,
  SITE_NAME,
  SITE_THEME_COLOR,
  SITE_TWITTER_HANDLE,
  SITE_URL,
  absoluteUrl,
  buildOgImageUrl,
  formatPageTitle,
  shouldNoIndex,
} from '../lib/seoShared';

export const config = {
  runtime: 'edge',
};

type ShareMeta = {
  title: string;
  description: string;
  ogImage: string;
  ogType: 'website' | 'article' | 'product';
  canonical: string;
  noindex: boolean;
};

/**
 * Server-rendered HTML shell for social crawlers (Facebook, LinkedIn, X, WhatsApp, Slack, Discord, Telegram).
 * SPA client meta alone is not reliable for these bots.
 */
export default async function handler(request: Request): Promise<Response> {
  const url = new URL(request.url);
  const pathWithQuery = url.searchParams.get('path') || '/';
  const [pathname, query = ''] = pathWithQuery.split('?');
  const meta = await resolveShareMeta(pathname || '/', search ? `?${search}` : '');

  const html = `<!doctype html>
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

  return new Response(html, {
    status: 200,
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'public, s-maxage=600, stale-while-revalidate=86400',
    },
  });
}

async function resolveShareMeta(pathname: string, search: string): Promise<ShareMeta> {
  const canonicalPath = normalizePath(pathname, search);
  const canonical = absoluteUrl(canonicalPath);
  const noindex = shouldNoIndex(pathname);
  const segments = pathname.split('/').filter(Boolean);
  const [section, id] = segments;

  // Product detail
  if (section === 'products' && id) {
    const product = await fetchCatalogJson<any>(`/products/${encodeURIComponent(id)}`).catch(() => null);
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

  // Brand detail
  if (section === 'brands' && id) {
    const brand = await fetchCatalogJson<any>(`/brands/${encodeURIComponent(id)}`).catch(() => null);
    const name = brand?.name || humanize(id);
    const description =
      brand?.description || brand?.category || `Explore ${name} on Choosify.`;
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

  // Spotlight / guides / articles
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
      ogImage: buildOgImageUrl({
        title,
        description,
        type: 'article',
        label: 'Discover',
      }),
      ogType: 'article',
      canonical,
      noindex,
    };
  }

  // Category query
  if (pathname.startsWith('/categories')) {
    const params = new URLSearchParams(search.startsWith('?') ? search.slice(1) : search);
    const category = params.get('category');
    if (category) {
      const name = humanize(category);
      const description = `Browse ${name} products and services on Choosify.`;
      return {
        title: formatPageTitle(name),
        description,
        ogImage: buildOgImageUrl({
          title: name,
          description,
          type: 'category',
          label: 'Category',
        }),
        ogType: 'website',
        canonical,
        noindex,
      };
    }
  }

  // Static route map
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
    title: formatPageTitle(SITE_NAME, { absolute: true }),
    description: SITE_DEFAULT_DESCRIPTION,
    ogImage: buildOgImageUrl({
      title: SITE_NAME,
      description: SITE_DEFAULT_DESCRIPTION,
      type: 'default',
    }),
    ogType: 'website',
    canonical,
    noindex,
  };
}

const STATIC_SHARE: Record<string, Omit<ShareMeta, 'canonical' | 'noindex'>> = {
  '/': {
    title: 'Choosify — Bangladesh’s Smartest Product Discovery Platform',
    description: SITE_DEFAULT_DESCRIPTION,
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

async function fetchCatalogJson<T>(path: string): Promise<T | null> {
  const base =
    (typeof process !== 'undefined' && process.env.CATALOG_API_BASE_URL?.replace(/\/$/, '')) ||
    'https://dashboard.choosify.bd/api/v1';
  const res = await fetch(`${base}${path.startsWith('/') ? path : `/${path}`}`, {
    headers: { Accept: 'application/json' },
  });
  if (!res.ok) return null;
  return (await res.json()) as T;
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

function clip(value: string, max: number): string {
  const t = value.trim();
  if (t.length <= max) return t;
  return `${t.slice(0, max - 1).trimEnd()}…`;
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}
