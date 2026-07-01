const SITE_URL = 'https://www.choosify.bd';
const CATALOG_API =
  process.env.CATALOG_API_BASE_URL?.replace(/\/$/, '') ||
  'https://dashboard.choosify.bd/api/v1';

const STATIC_PATHS: Array<{
  path: string;
  changeFrequency: string;
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

type SitemapEntry = {
  loc: string;
  lastmod?: string;
  changefreq?: string;
  priority?: number;
};

type CatalogListResponse<T> = { data: T[] };

async function fetchCatalog<T>(path: string): Promise<T[]> {
  try {
    const response = await fetch(`${CATALOG_API}${path}`, {
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

export default async function handler(
  _req: unknown,
  res: {
    setHeader: (name: string, value: string) => void;
    status: (code: number) => { send: (body: string) => void };
  },
) {
  const now = new Date().toISOString();
  const entries: SitemapEntry[] = STATIC_PATHS.map((item) => ({
    loc: `${SITE_URL}${item.path}`,
    lastmod: now,
    changefreq: item.changeFrequency,
    priority: item.priority,
  }));

  const [products, brands, categories, guides, creators] = await Promise.all([
    fetchCatalog<{ id: string; slug?: string; updatedAt?: string; status?: string }>(
      '/catalog/products',
    ),
    fetchCatalog<{ id: string; slug?: string; updatedAt?: string }>('/catalog/brands'),
    fetchCatalog<{ id: string; slug?: string; updatedAt?: string }>('/catalog/categories'),
    fetchCatalog<{ id: string; slug?: string; updatedAt?: string; status?: string }>(
      '/catalog/guides?status=live',
    ),
    fetchCatalog<{ id: string; slug?: string; updatedAt?: string; status?: string }>(
      '/catalog/creators?status=live',
    ),
  ]);

  for (const product of products) {
    if (product.status && product.status !== 'live') continue;
    const id = product.slug || product.id;
    entries.push({
      loc: `${SITE_URL}/products/${encodeURIComponent(id)}`,
      lastmod: toIsoDate(product.updatedAt) || now,
      changefreq: 'weekly',
      priority: 0.8,
    });
  }

  for (const brand of brands) {
    const id = brand.slug || brand.id;
    entries.push({
      loc: `${SITE_URL}/brands/${encodeURIComponent(id)}`,
      lastmod: toIsoDate(brand.updatedAt) || now,
      changefreq: 'weekly',
      priority: 0.75,
    });
  }

  for (const category of categories) {
    if (category.slug) {
      entries.push({
        loc: `${SITE_URL}/categories?category=${encodeURIComponent(category.slug)}`,
        lastmod: toIsoDate(category.updatedAt) || now,
        changefreq: 'weekly',
        priority: 0.65,
      });
    }
  }

  for (const guide of guides) {
    const id = guide.slug || guide.id;
    entries.push({
      loc: `${SITE_URL}/guides/${encodeURIComponent(id)}`,
      lastmod: toIsoDate(guide.updatedAt) || now,
      changefreq: 'weekly',
      priority: 0.7,
    });
    entries.push({
      loc: `${SITE_URL}/recommendations/${encodeURIComponent(id)}`,
      lastmod: toIsoDate(guide.updatedAt) || now,
      changefreq: 'weekly',
      priority: 0.65,
    });
  }

  for (const creator of creators) {
    const id = creator.slug || creator.id;
    entries.push({
      loc: `${SITE_URL}/creators/${encodeURIComponent(id)}`,
      lastmod: toIsoDate(creator.updatedAt) || now,
      changefreq: 'monthly',
      priority: 0.6,
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
