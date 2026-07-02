import {
  CATALOG_API_BASE_URL,
  NOINDEX_PATH_PREFIXES,
  SITE_URL,
  SITEMAP_STATIC_PATHS,
} from '../lib/seoShared';

type SitemapEntry = {
  loc: string;
  lastmod?: string;
  changefreq?: string;
  priority?: number;
};

type CatalogListResponse<T> = { data: T[] };

async function fetchCatalog<T>(path: string): Promise<T[]> {
  try {
    const response = await fetch(`${CATALOG_API_BASE_URL}${path}`, {
      headers: { Accept: 'application/json' },
    });
    if (!response.ok) return [];
    const json = (await response.json()) as CatalogListResponse<T>;
    return json.data ?? [];
  } catch {
    return [];
  }
}

function escapeXml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function toIsoDate(value?: string): string | undefined {
  if (!value) return undefined;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? undefined : date.toISOString();
}

function buildXml(entries: SitemapEntry[]): string {
  const urls = entries
    .map((entry) => {
      const parts = [
        '  <url>',
        `    <loc>${escapeXml(entry.loc)}</loc>`,
        entry.lastmod ? `    <lastmod>${escapeXml(entry.lastmod)}</lastmod>` : '',
        entry.changefreq ? `    <changefreq>${entry.changefreq}</changefreq>` : '',
        entry.priority !== undefined ? `    <priority>${entry.priority.toFixed(1)}</priority>` : '',
        '  </url>',
      ].filter(Boolean);
      return parts.join('\n');
    })
    .join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
}

function routeId(record: { id: string; slug?: string }): string {
  return encodeURIComponent(record.slug || record.id);
}

export default async function handler(
  _req: unknown,
  res: {
    setHeader: (name: string, value: string) => void;
    status: (code: number) => { send: (body: string) => void };
  },
) {
  const now = new Date().toISOString();
  const entries: SitemapEntry[] = SITEMAP_STATIC_PATHS.map((item) => ({
    loc: `${SITE_URL}${item.path}`,
    lastmod: now,
    changefreq: item.changeFrequency,
    priority: item.priority,
  }));

  const [products, brands, categories, guides, creators, deals] = await Promise.all([
    fetchCatalog<{ id: string; slug?: string; updatedAt?: string; status?: string }>(
      '/catalog/products',
    ),
    fetchCatalog<{ id: string; slug?: string; updatedAt?: string }>('/catalog/brands'),
    fetchCatalog<{ id: string; slug?: string; updatedAt?: string; enabled?: boolean }>(
      '/catalog/categories',
    ),
    fetchCatalog<{ id: string; slug?: string; updatedAt?: string; status?: string }>(
      '/catalog/guides?status=live',
    ),
    fetchCatalog<{ id: string; slug?: string; updatedAt?: string; status?: string }>(
      '/catalog/creators?status=live',
    ),
    fetchCatalog<{ id: string; slug?: string; updatedAt?: string; status?: string }>(
      '/catalog/deals',
    ),
  ]);

  for (const product of products) {
    if (product.status && product.status !== 'live') continue;
    const id = routeId(product);
    entries.push({
      loc: `${SITE_URL}/products/${id}`,
      lastmod: toIsoDate(product.updatedAt) || now,
      changefreq: 'weekly',
      priority: 0.8,
    });
  }

  for (const brand of brands) {
    const id = routeId(brand);
    entries.push({
      loc: `${SITE_URL}/brands/${id}`,
      lastmod: toIsoDate(brand.updatedAt) || now,
      changefreq: 'weekly',
      priority: 0.75,
    });
    entries.push({
      loc: `${SITE_URL}/brands/${id}/products`,
      lastmod: toIsoDate(brand.updatedAt) || now,
      changefreq: 'weekly',
      priority: 0.7,
    });
  }

  for (const category of categories) {
    if (category.enabled === false) continue;
    const slug = category.slug || category.id;
    entries.push({
      loc: `${SITE_URL}/categories?category=${encodeURIComponent(slug)}`,
      lastmod: toIsoDate(category.updatedAt) || now,
      changefreq: 'weekly',
      priority: 0.65,
    });
    entries.push({
      loc: `${SITE_URL}/products?category=${encodeURIComponent(slug)}`,
      lastmod: toIsoDate(category.updatedAt) || now,
      changefreq: 'weekly',
      priority: 0.65,
    });
  }

  for (const guide of guides) {
    const id = routeId(guide);
    const lastmod = toIsoDate(guide.updatedAt) || now;
    entries.push({
      loc: `${SITE_URL}/guides/${id}`,
      lastmod,
      changefreq: 'weekly',
      priority: 0.7,
    });
    entries.push({
      loc: `${SITE_URL}/blogs/${id}`,
      lastmod,
      changefreq: 'weekly',
      priority: 0.68,
    });
    entries.push({
      loc: `${SITE_URL}/recommendations/${id}`,
      lastmod,
      changefreq: 'weekly',
      priority: 0.65,
    });
    entries.push({
      loc: `${SITE_URL}/guides/${id}/products`,
      lastmod,
      changefreq: 'weekly',
      priority: 0.6,
    });
  }

  for (const creator of creators) {
    const id = routeId(creator);
    entries.push({
      loc: `${SITE_URL}/creators/${id}`,
      lastmod: toIsoDate(creator.updatedAt) || now,
      changefreq: 'monthly',
      priority: 0.6,
    });
  }

  for (const deal of deals) {
    if (deal.status && deal.status !== 'live') continue;
    const id = routeId(deal);
    entries.push({
      loc: `${SITE_URL}/deals#${id}`,
      lastmod: toIsoDate(deal.updatedAt) || now,
      changefreq: 'daily',
      priority: 0.7,
    });
  }

  const unique = new Map<string, SitemapEntry>();
  for (const entry of entries) {
    unique.set(entry.loc, entry);
  }

  res.setHeader('Content-Type', 'application/xml; charset=utf-8');
  res.setHeader('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=86400');
  res.status(200).send(buildXml([...unique.values()]));
}

// Exported for tests and reuse
export { NOINDEX_PATH_PREFIXES };
