/**
 * Generates public/sitemap.xml at build time so /sitemap.xml works even if
 * the Vercel serverless function fails to bundle.
 */
import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const SITE_URL = 'https://www.choosify.bd';
const CATALOG_API =
  (process.env.CATALOG_API_BASE_URL || 'https://dashboard.choosify.bd/api/v1').replace(/\/$/, '');

const STATIC_PATHS = [
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

async function fetchCatalog(path) {
  try {
    const response = await fetch(`${CATALOG_API}${path}`, {
      headers: { Accept: 'application/json' },
    });
    if (!response.ok) return [];
    const json = await response.json();
    return json.data ?? [];
  } catch {
    return [];
  }
}

function escapeXml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function toIsoDate(value) {
  if (!value) return undefined;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? undefined : date.toISOString();
}

function routeId(record) {
  return encodeURIComponent(record.slug || record.id);
}

function buildXml(entries) {
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

async function main() {
  const now = new Date().toISOString();
  const entries = STATIC_PATHS.map((item) => ({
    loc: `${SITE_URL}${item.path}`,
    lastmod: now,
    changefreq: item.changeFrequency,
    priority: item.priority,
  }));

  const [products, brands, categories, guides, creators] = await Promise.all([
    fetchCatalog('/catalog/products'),
    fetchCatalog('/catalog/brands'),
    fetchCatalog('/catalog/categories'),
    fetchCatalog('/catalog/guides?status=live'),
    fetchCatalog('/catalog/creators?status=live'),
  ]);

  for (const product of products) {
    if (product.status && product.status !== 'live') continue;
    entries.push({
      loc: `${SITE_URL}/products/${routeId(product)}`,
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
    entries.push({ loc: `${SITE_URL}/guides/${id}`, lastmod, changefreq: 'weekly', priority: 0.7 });
    entries.push({ loc: `${SITE_URL}/blogs/${id}`, lastmod, changefreq: 'weekly', priority: 0.68 });
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
    entries.push({
      loc: `${SITE_URL}/creators/${routeId(creator)}`,
      lastmod: toIsoDate(creator.updatedAt) || now,
      changefreq: 'monthly',
      priority: 0.6,
    });
  }

  const unique = new Map();
  for (const entry of entries) unique.set(entry.loc, entry);

  const outputPath = join(dirname(fileURLToPath(import.meta.url)), '..', 'public', 'sitemap.xml');
  writeFileSync(outputPath, buildXml([...unique.values()]), 'utf8');
  console.log(`[sitemap] Wrote ${unique.size} URLs to public/sitemap.xml`);
}

main().catch((error) => {
  console.error('[sitemap] Build-time generation failed:', error);
  process.exit(1);
});
