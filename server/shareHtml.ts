/**
 * Plain-Node replacement for api/share.js (previously a Vercel Edge Function).
 * Renders complete server-side Open Graph/Twitter-card HTML for social-media
 * crawlers, which do not execute the SPA's client-side PageSeo.tsx.
 */
import {
  CATALOG_API_BASE_URL,
  DEFAULT_OG_IMAGE,
  SITE_LOCALE,
  SITE_DEFAULT_DESCRIPTION,
  SITE_NAME,
  SITE_TAGLINE,
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
import {
  asPublicHandleResolution,
  brandPath,
  catalogEntityForHandleResolution,
  creatorPath,
  handleLookupKey,
  productPath,
  resolveCatalogBrandParam,
  resolveCatalogCreatorParam,
  resolveCatalogProductParam,
  resolvedEntity,
} from '../lib/publicUrls';

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

/**
 * Public Identity C4: an entity a RETIRED (or not-yet-listed) handle points at,
 * via the same public resolver the SPA uses, matched against the already-fetched
 * public list. Undefined when the param cannot be a handle (no request), on 404,
 * on failure, or when the entity is not in the public list.
 */
async function entityViaHandleResolver<T extends { id: string }>(
  type: 'brand' | 'creator',
  param: string,
  list: readonly T[],
): Promise<T | undefined> {
  const key = handleLookupKey(param);
  if (!key) return undefined;
  const body = await fetchCatalogJson(`/catalog/handles/${encodeURIComponent(key)}/resolve?type=${type}`);
  return catalogEntityForHandleResolution(asPublicHandleResolution(body?.data, type), type, list);
}

/**
 * Catalog reads are cached briefly: page HTML for every visitor now carries
 * server-resolved metadata, so a page load must not wait on the catalog API
 * each time. Fresh for CATALOG_CACHE_TTL_MS, then served stale while one
 * background refresh runs; a failed refresh keeps the last good value.
 * Failures (null) are never cached.
 */
const CATALOG_CACHE_TTL_MS = 120_000;
const CATALOG_CACHE_MAX_ENTRIES = 2000;
const catalogCache = new Map<string, { at: number; value: any; refreshing?: Promise<any> }>();

async function loadCatalogJson(path: string): Promise<any> {
  const value = await fetchCatalogJsonUncached(path);
  if (value !== null) {
    if (catalogCache.size >= CATALOG_CACHE_MAX_ENTRIES) catalogCache.clear();
    catalogCache.set(path, { at: Date.now(), value });
  } else {
    const hit = catalogCache.get(path);
    if (hit) hit.refreshing = undefined;
  }
  return value;
}

export async function fetchCatalogJson(path: string): Promise<any> {
  const hit = catalogCache.get(path);
  if (!hit) return loadCatalogJson(path);
  if (Date.now() - hit.at >= CATALOG_CACHE_TTL_MS && !hit.refreshing) {
    hit.refreshing = loadCatalogJson(path).catch(() => null);
  }
  return hit.value;
}

async function fetchCatalogJsonUncached(path: string): Promise<any> {
  try {
    const res = await fetch(`${CATALOG_API_BASE_URL}${path.startsWith('/') ? path : `/${path}`}`, {
      headers: { Accept: 'application/json' },
      signal: AbortSignal.timeout(4000),
    });
    if (!res.ok) return null;
    // A wrong path can 200 with an HTML fallback page instead of 404 --
    // check content-type before trying to parse, and `await` the parse so a
    // malformed body is caught here (a bare `return res.json()` inside this
    // try block does NOT let this catch handle that promise's rejection).
    const contentType = res.headers.get('content-type') || '';
    if (!contentType.includes('application/json')) return null;
    return await res.json();
  } catch {
    return null;
  }
}

export function listFrom(body: any): any[] {
  return Array.isArray(body?.data) ? body.data : Array.isArray(body) ? body : [];
}

/**
 * Every product, paged exactly like the storefront's catalogApi.listProducts (same order).
 * `strict` throws when a page cannot be read instead of returning a partial list.
 */
export async function fetchAllCatalogProducts(options?: { strict?: boolean }): Promise<any[]> {
  const pageSize = 100;
  const all: any[] = [];
  for (let offset = 0, total = Infinity; offset < total; offset += pageSize) {
    const body = await fetchCatalogJson(`/catalog/products?limit=${pageSize}&offset=${offset}`);
    if (body === null && options?.strict) throw new Error('Catalog products unavailable');
    const rows = listFrom(body);
    all.push(...rows);
    total = typeof body?.meta?.total === 'number' ? body.meta.total : all.length;
    if (rows.length < pageSize) break;
    if (offset > 5000) break; // hard safety stop
  }
  return all;
}

export type ShareMeta = {
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
    // Same resolution as the SPA (lib/publicUrls): slug, catalog id, or a legacy
    // numeric id that matches exactly one product. An ambiguous or unknown id
    // keeps the requested path as canonical and never borrows another product.
    const match = resolvedEntity(resolveCatalogProductParam(id, await fetchAllCatalogProducts()));
    const product = match
      ? (await fetchCatalogJson(`/catalog/products/${encodeURIComponent(match.id)}`)) ?? match
      : null;
    const title = product?.seoTitle || product?.title || product?.name || humanize(id);
    const description =
      product?.seoDescription ||
      product?.description ||
      `View ${title} on Choosify — verified product discovery for Bangladesh.`;
    const brand = product?.brandName || product?.brand || '';
    const image = product?.image || product?.gallery?.[0] || '';
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
      canonical: match ? absoluteUrl(productPath({ slug: match.slug, catalogId: match.id })) : canonical,
      noindex,
    };
  }

  if (section === 'brands' && id) {
    // No singular brand-detail endpoint exists server-side -- fetch the
    // list and find the match, same as the web app's own catalogApi.ts does.
    const brandList = listFrom(await fetchCatalogJson('/catalog/brands'));
    const brand =
      resolvedEntity(resolveCatalogBrandParam(id, brandList)) ?? (await entityViaHandleResolver('brand', id, brandList));
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
      canonical: brand
        ? absoluteUrl(`${brandPath({ publicHandle: brand.publicHandle, slug: brand.slug, catalogId: brand.id })}${segments[2] === 'products' ? '/products' : ''}`)
        : canonical,
      noindex,
    };
  }

  if (section === 'creators' && id) {
    const creatorList = listFrom(await fetchCatalogJson('/catalog/creators?status=live'));
    const creator =
      resolvedEntity(resolveCatalogCreatorParam(id, creatorList)) ??
      (await entityViaHandleResolver('creator', id, creatorList));
    const name = creator?.name || humanize(id);
    const description = creator?.bio || `Follow ${name} on Choosify.`;
    return {
      title: formatPageTitle(name),
      description: clip(description, 160),
      ogImage: buildOgImageUrl({
        title: name,
        description: clip(description, 120),
        type: 'default',
        image: creator?.avatar || '',
        label: 'Creator',
      }),
      ogType: 'website',
      canonical: creator
        ? absoluteUrl(creatorPath({ publicHandle: creator.publicHandle, slug: creator.slug, id: creator.id }))
        : canonical,
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

/** Every SEO/social tag the SPA's PageSeo also manages, for one page. */
export function renderSeoHeadTags(meta: ShareMeta, indent = '    '): string {
  return [
    `<title>${escapeHtml(meta.title)}</title>`,
    `<meta name="description" content="${escapeHtml(meta.description)}" />`,
    `<meta name="robots" content="${meta.noindex ? 'noindex, nofollow' : 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1'}" />`,
    `<link rel="canonical" href="${escapeHtml(meta.canonical)}" />`,
    `<meta property="og:type" content="${meta.ogType}" />`,
    `<meta property="og:site_name" content="${SITE_NAME}" />`,
    `<meta property="og:locale" content="${SITE_LOCALE}" />`,
    `<meta property="og:title" content="${escapeHtml(meta.title)}" />`,
    `<meta property="og:description" content="${escapeHtml(meta.description)}" />`,
    `<meta property="og:url" content="${escapeHtml(meta.canonical)}" />`,
    `<meta property="og:image" content="${escapeHtml(meta.ogImage)}" />`,
    `<meta property="og:image:secure_url" content="${escapeHtml(meta.ogImage)}" />`,
    `<meta property="og:image:width" content="${OG_IMAGE_WIDTH}" />`,
    `<meta property="og:image:height" content="${OG_IMAGE_HEIGHT}" />`,
    `<meta property="og:image:alt" content="${escapeHtml(meta.title)}" />`,
    `<meta property="og:image:type" content="image/png" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:site" content="${SITE_TWITTER_HANDLE}" />`,
    `<meta name="twitter:creator" content="${SITE_TWITTER_HANDLE}" />`,
    `<meta name="twitter:title" content="${escapeHtml(meta.title)}" />`,
    `<meta name="twitter:description" content="${escapeHtml(meta.description)}" />`,
    `<meta name="twitter:image" content="${escapeHtml(meta.ogImage)}" />`,
    `<meta name="twitter:image:alt" content="${escapeHtml(meta.title)}" />`,
  ].join(`\n${indent}`);
}

/** Longest a page load waits for catalog-backed metadata before using the path-only fallback. */
const PAGE_META_BUDGET_MS = 2500;

/**
 * Metadata for a page request. Never the homepage's canonical for another
 * route: if the catalog is slow, the fallback still uses this page's own
 * canonical path and noindex rule (with the site-wide title/description).
 */
export async function resolvePageMeta(pathname: string, search: string): Promise<ShareMeta> {
  const path = pathname || '/';
  const fallback: ShareMeta = {
    title: SITE_TAGLINE,
    description: SITE_DEFAULT_DESCRIPTION,
    ogImage: DEFAULT_OG_IMAGE,
    ogType: 'website',
    canonical: absoluteUrl(normalizePath(path, search)),
    noindex: shouldNoIndex(path),
  };
  let timer: ReturnType<typeof setTimeout> | undefined;
  try {
    return await Promise.race([
      resolveShareMeta(path, search),
      new Promise<ShareMeta>((resolve) => {
        timer = setTimeout(() => resolve(fallback), PAGE_META_BUDGET_MS);
      }),
    ]);
  } catch {
    return fallback;
  } finally {
    if (timer) clearTimeout(timer);
  }
}

const SEO_BLOCK = /<!-- seo:start -->[\s\S]*?<!-- seo:end -->/;

/** Replace index.html's default SEO block (between the seo markers) with this page's tags. */
export function injectSeoHead(html: string, meta: ShareMeta): string {
  if (!SEO_BLOCK.test(html)) return html;
  return html.replace(SEO_BLOCK, () => `<!-- seo:start -->
    ${renderSeoHeadTags(meta)}
    <!-- seo:end -->`);
}

export async function buildShareHtml(pathname: string, search: string): Promise<string> {
  const meta = await resolveShareMeta(pathname || '/', search);

  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <meta name="theme-color" content="${SITE_THEME_COLOR}" />
  ${renderSeoHeadTags(meta, '  ')}
  <meta http-equiv="refresh" content="0;url=${escapeHtml(meta.canonical)}" />
</head>
<body>
  <p><a href="${escapeHtml(meta.canonical)}">${escapeHtml(meta.title)}</a></p>
  <p>${escapeHtml(meta.description)}</p>
</body>
</html>`;
}
