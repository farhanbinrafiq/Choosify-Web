/**
 * robots.txt and sitemap.xml for the storefront, built from the live public
 * catalog (the same public endpoints and URL builders the SPA uses), so the
 * sitemap lists exactly the pages a visitor can open, at their canonical URLs.
 */
import { NOINDEX_PATH_PREFIXES, SITEMAP_STATIC_PATHS, SITE_URL, absoluteUrl, shouldNoIndex } from '../lib/seoShared';
import { brandPath, creatorPath, guidePath, productPath } from '../lib/publicUrls';
import { fetchAllCatalogProducts, fetchCatalogJson, listFrom } from './shareHtml';

/**
 * Private, signed-in and transactional pages are kept out of the crawl.
 * Public pages, /assets, /og, /api (the SPA's catalog calls) and media stay
 * crawlable so Google can render product pages.
 */
export function buildRobotsTxt(): string {
  return [
    'User-agent: *',
    'Allow: /',
    ...NOINDEX_PATH_PREFIXES.map((prefix) => `Disallow: ${prefix}`),
    '',
    `Sitemap: ${SITE_URL}/sitemap.xml`,
    '',
  ].join('\n');
}

type SitemapEntry = { loc: string; lastmod?: string; changefreq?: string; priority?: number };

function escapeXml(value: string): string {
  return value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;');
}

function isoDate(value: unknown): string | undefined {
  if (typeof value !== 'string' || !value) return undefined;
  const t = Date.parse(value);
  return Number.isFinite(t) ? new Date(t).toISOString() : undefined;
}

/** A public list, or a thrown error when the catalog cannot be read (never a silently short sitemap). */
async function requiredList(path: string): Promise<any[]> {
  const body = await fetchCatalogJson(path);
  if (body === null) throw new Error(`Catalog list unavailable: ${path}`);
  return listFrom(body);
}

const isLive = (row: any) => row?.status === undefined || row.status === 'live';

export async function buildSitemapXml(): Promise<string> {
  const [products, brands, creators, categories, guides] = await Promise.all([
    fetchAllCatalogProducts({ strict: true }),
    requiredList('/catalog/brands'),
    requiredList('/catalog/creators?status=live'),
    requiredList('/catalog/categories'),
    requiredList('/catalog/guides?status=live'),
  ]);

  const entries: SitemapEntry[] = SITEMAP_STATIC_PATHS.map((p) => ({
    loc: absoluteUrl(p.path),
    changefreq: p.changeFrequency,
    priority: p.priority,
  }));
  const add = (path: string, row: any, changefreq: string, priority: number) => {
    if (!path) return;
    entries.push({ loc: absoluteUrl(path), lastmod: isoDate(row?.updatedAt), changefreq, priority });
  };

  for (const p of products.filter(isLive)) add(productPath({ slug: p.slug, catalogId: p.id }), p, 'weekly', 0.8);
  for (const b of brands) add(brandPath({ publicHandle: b.publicHandle, slug: b.slug, catalogId: b.id }), b, 'weekly', 0.7);
  for (const c of creators.filter(isLive)) add(creatorPath({ publicHandle: c.publicHandle, slug: c.slug, id: c.id }), c, 'weekly', 0.6);
  // Top-level categories only: the storefront links these as /categories?category=<slug>.
  for (const c of categories.filter((c) => c?.enabled !== false && !c?.parentId)) {
    const key = c.slug || c.id;
    if (key) add(`/categories?category=${encodeURIComponent(key)}`, c, 'weekly', 0.6);
  }
  for (const g of guides.filter(isLive)) add(guidePath(g), g, 'monthly', 0.6);

  const seen = new Set<string>();
  const unique = entries.filter((e) => {
    const path = new URL(e.loc).pathname;
    if (seen.has(e.loc) || shouldNoIndex(path)) return false;
    seen.add(e.loc);
    return true;
  });

  const body = unique
    .map((e) =>
      [
        '  <url>',
        `    <loc>${escapeXml(e.loc)}</loc>`,
        e.lastmod ? `    <lastmod>${e.lastmod}</lastmod>` : '',
        e.changefreq ? `    <changefreq>${e.changefreq}</changefreq>` : '',
        e.priority !== undefined ? `    <priority>${e.priority.toFixed(1)}</priority>` : '',
        '  </url>',
      ]
        .filter(Boolean)
        .join('\n'),
    )
    .join('\n');
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${body}\n</urlset>\n`;
}
