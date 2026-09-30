/**
 * Deterministic probe for lib/publicUrls.ts — canonical public URLs and legacy
 * link resolution (Phase A URL stabilization).
 *
 * Pure / in-memory only: fixtures mirror the real catalog shapes (including the
 * production collision where /products/3 matched two products, and brand ids
 * whose digits exceed Number.MAX_SAFE_INTEGER). No network, no browser.
 * Run with `npm run test:public-urls`.
 */
import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import {
  brandPath,
  creatorPath,
  guidePath,
  legacyNumericId,
  productPath,
  resolveBrandParam,
  resolveCatalogBrandParam,
  resolveCatalogCreatorParam,
  resolveCatalogProductParam,
  resolveCreatorParam,
  resolveProductParam,
  resolvedEntity,
  type RouteResolution,
} from '../lib/publicUrls';

let pass = 0;
let fail = 0;

function assertEqual(name: string, actual: unknown, expected: unknown) {
  const a = JSON.stringify(actual);
  const e = JSON.stringify(expected);
  if (a === e) {
    pass += 1;
    console.log(`PASS ${name}`);
  } else {
    fail += 1;
    console.log(`FAIL ${name} — expected ${e}, got ${a}`);
  }
}

function assertOk(name: string, condition: boolean, detail?: string) {
  if (condition) {
    pass += 1;
    console.log(`PASS ${name}`);
  } else {
    fail += 1;
    console.log(`FAIL ${name}${detail ? ` — ${detail}` : ''}`);
  }
}

const summary = <T extends { slug?: string | null }>(r: RouteResolution<T>) =>
  r.status === 'canonical'
    ? { status: r.status, slug: r.entity.slug }
    : r.status === 'redirect'
      ? { status: r.status, slug: r.entity.slug, to: r.to }
      : r.status === 'ambiguous'
        ? { status: r.status, matchedBy: r.matchedBy, count: r.count }
        : { status: r.status };

// ── Fixtures (API order, as returned by /catalog/products and /catalog/brands) ──
const catalogProducts = [
  { id: 'prod-s24-ultra', slug: 'samsung-galaxy-s24-ultra', title: 'Samsung Galaxy S24 Ultra' },
  { id: 'prod-macbook-air-m3', slug: 'apple-macbook-air-m3', title: 'Apple MacBook Air M3' },
  { id: 'prod-apex-loafer', slug: 'apex-mens-royal-loafer', title: 'Apex Mens Royal Loafer' },
  { id: 'prod-11', slug: 'walton-fridge', title: 'Walton Fridge' },
];
const UUID_BRAND_A = 'brand-2eec9bab-1234-4abc-8def-001122334455';
const catalogBrands = [
  { id: 'brand-walton', slug: 'walton', name: 'Walton' },
  { id: 'brand-samsung', slug: 'samsung', name: 'Samsung' },
  { id: UUID_BRAND_A, slug: 'artveen', name: 'Artveen' },
];
const catalogCreators = [
  { id: 'creator-techtalks', slug: 'tech-talks-bd', name: 'Tech Talks BD' },
  { id: 'creator-farhan', slug: 'farhan-bin-rafiq', name: 'Farhan Bin Rafiq' },
];

// The storefront's mapped lists (GlobalStateContext): numeric `id` from the legacy
// algorithm + catalogId/slug carried through.
const storefrontProducts = catalogProducts.map((p, i) => ({ id: legacyNumericId(p.id, i + 1), catalogId: p.id, slug: p.slug, title: p.title }));
const storefrontBrands = catalogBrands.map((b, i) => ({ id: legacyNumericId(b.id, i + 1), catalogId: b.id, slug: b.slug, name: b.name }));
const storefrontCreators = catalogCreators.map((c) => ({ id: c.id, slug: c.slug, name: c.name }));

// ── 0. Legacy numeric id reproduces the historical algorithm exactly ──
const historicToNumericId = (value: string, fallback: number) => {
  const numeric = Number(value.replace(/[^0-9]/g, ''));
  return Number.isFinite(numeric) && numeric > 0 ? numeric : fallback;
};
for (const [i, p] of [...catalogProducts, ...catalogBrands].entries()) {
  assertEqual(`legacyNumericId == historic algorithm (${p.id})`, legacyNumericId(p.id, i + 1), historicToNumericId(p.id, i + 1));
}
assertEqual('fixture reproduces prod collision: MacBook M3 legacy id', storefrontProducts[1].id, 3);
assertEqual('fixture reproduces prod collision: Apex loafer legacy id (position fallback)', storefrontProducts[2].id, 3);

// ── 1-3. Canonical builders use the slug ──
assertEqual('1 product canonical URL uses slug', productPath(storefrontProducts[1]), '/products/apple-macbook-air-m3');
assertEqual('1 product URL never uses the numeric id when a slug exists', productPath({ id: 3, slug: 'apex-mens-royal-loafer' }), '/products/apex-mens-royal-loafer');
assertEqual('1 product without slug falls back to catalog id (not digits)', productPath({ id: 3, catalogId: 'prod-macbook-air-m3' }), '/products/prod-macbook-air-m3');
assertEqual('2 brand canonical URL uses slug', brandPath(storefrontBrands[1]), '/brands/samsung');
assertEqual('2 brand sub-view keeps the slug', brandPath(storefrontBrands[1], '/products'), '/brands/samsung/products');
assertEqual('3 creator canonical URL uses slug', creatorPath(storefrontCreators[1]), '/creators/farhan-bin-rafiq');
assertEqual('3 creator without slug (static mock) falls back to id', creatorPath({ id: 'creator-farhan' }), '/creators/creator-farhan');
assertEqual('guide URL unchanged (/spotlight/{slug})', guidePath({ slug: 'best-smartphones', id: 'guide-1' }), '/spotlight/best-smartphones');

// ── 4. Large brand ids are strings, never Numbers ──
const uuidBrand = storefrontBrands[2];
assertOk('4 fixture brand id exceeds MAX_SAFE_INTEGER as a number', !Number.isSafeInteger(uuidBrand.id));
assertEqual('4 large-id brand canonical URL is the slug', brandPath(uuidBrand), '/brands/artveen');
assertEqual('4 raw catalog id resolves and redirects to slug', summary(resolveCatalogBrandParam(UUID_BRAND_A, catalogBrands)), { status: 'redirect', slug: 'artveen', to: '/brands/artveen' });
assertEqual(
  '4 the historical (lossy) numeric link still resolves when unique',
  summary(resolveBrandParam(String(uuidBrand.id), storefrontBrands)),
  { status: 'redirect', slug: 'artveen', to: '/brands/artveen' },
);
{
  // Two uuid brands whose digit strings collapse to the same double.
  const lossyA = { id: 'brand-11111111-1111-4111-8111-111111111111', slug: 'lossy-a', name: 'Lossy A' };
  const lossyB = { id: 'brand-11111111-1111-4111-8111-111111111112', slug: 'lossy-b', name: 'Lossy B' };
  const list = [lossyA, lossyB];
  const keyA = String(legacyNumericId(lossyA.id, 1));
  assertEqual('4 precision-collapsed legacy ids are detected as identical', keyA, String(legacyNumericId(lossyB.id, 2)));
  assertEqual('4 precision-collapsed legacy id is ambiguous, never guessed', summary(resolveCatalogBrandParam(keyA, list)), { status: 'ambiguous', matchedBy: 'legacy_numeric_id', count: 2 });
  assertEqual('4 each still resolves by slug', summary(resolveCatalogBrandParam('lossy-b', list)), { status: 'canonical', slug: 'lossy-b' });
}

// ── 5 + 7. The /products/3 collision fails safely (client and server) ──
assertEqual('5 /products/3 is ambiguous in the storefront (never an arbitrary product)', summary(resolveProductParam('3', storefrontProducts)), { status: 'ambiguous', matchedBy: 'legacy_numeric_id', count: 2 });
assertEqual('5 /products/3 is ambiguous for the share renderer too', summary(resolveCatalogProductParam('3', catalogProducts)), { status: 'ambiguous', matchedBy: 'legacy_numeric_id', count: 2 });
assertEqual('5 resolvedEntity of an ambiguous link is undefined', resolvedEntity(resolveProductParam('3', storefrontProducts)), undefined);
assertEqual('5 the MacBook itself is still reachable by slug', summary(resolveProductParam('apple-macbook-air-m3', storefrontProducts)), { status: 'canonical', slug: 'apple-macbook-air-m3' });
assertEqual('5 the loafer itself is still reachable by slug', summary(resolveProductParam('apex-mens-royal-loafer', storefrontProducts)), { status: 'canonical', slug: 'apex-mens-royal-loafer' });
assertEqual('5 product identity stays the internal catalog id', resolvedEntity(resolveProductParam('apex-mens-royal-loafer', storefrontProducts))?.catalogId, 'prod-apex-loafer');
{
  const dupCreators = [...storefrontCreators, { id: 'creator-farhan-2', slug: 'farhan-bin-rafiq', name: 'Farhan Bin Rafiq' }];
  assertEqual('7 duplicate creator slug is ambiguous', summary(resolveCreatorParam('farhan-bin-rafiq', dupCreators)), { status: 'ambiguous', matchedBy: 'slug', count: 2 });
  // Two brands both named "Samsung" (slugs differ): the old name-based link is ambiguous.
  const sameName = [
    { id: 1, catalogId: 'brand-samsung', slug: 'samsung-official', name: 'Samsung' },
    { id: 99, catalogId: 'brand-samsung-bd', slug: 'samsung-bd', name: 'Samsung' },
  ];
  assertEqual('7 brand name link shared by two brands is ambiguous', summary(resolveBrandParam('samsung', sameName)), { status: 'ambiguous', matchedBy: 'alias', count: 2 });
}

// ── 6. Safe legacy links redirect to the canonical slug ──
assertEqual('6 unique legacy numeric product id redirects', summary(resolveProductParam('24', storefrontProducts)), { status: 'redirect', slug: 'samsung-galaxy-s24-ultra', to: '/products/samsung-galaxy-s24-ultra' });
assertEqual('6 unique legacy numeric (share renderer) redirects', summary(resolveCatalogProductParam('11', catalogProducts)), { status: 'redirect', slug: 'walton-fridge', to: '/products/walton-fridge' });
assertEqual('6 product catalog id redirects', summary(resolveProductParam('prod-apex-loafer', storefrontProducts)), { status: 'redirect', slug: 'apex-mens-royal-loafer', to: '/products/apex-mens-royal-loafer' });
assertEqual('6 upper-case slug redirects to the lower-case canonical', summary(resolveProductParam('Apple-MacBook-Air-M3', storefrontProducts)), { status: 'redirect', slug: 'apple-macbook-air-m3', to: '/products/apple-macbook-air-m3' });
assertEqual('6 brand catalog id redirects', summary(resolveBrandParam('brand-samsung', storefrontBrands)), { status: 'redirect', slug: 'samsung', to: '/brands/samsung' });
assertEqual('6 brand legacy position id redirects when unique', summary(resolveBrandParam('1', storefrontBrands)), { status: 'redirect', slug: 'walton', to: '/brands/walton' });
assertEqual('6 brand name link redirects', summary(resolveBrandParam('Samsung', storefrontBrands)), { status: 'redirect', slug: 'samsung', to: '/brands/samsung' });
assertEqual('6 creator id redirects to slug', summary(resolveCreatorParam('creator-farhan', storefrontCreators)), { status: 'redirect', slug: 'farhan-bin-rafiq', to: '/creators/farhan-bin-rafiq' });
assertEqual('6 creator id redirects to slug (share renderer)', summary(resolveCatalogCreatorParam('creator-techtalks', catalogCreators)), { status: 'redirect', slug: 'tech-talks-bd', to: '/creators/tech-talks-bd' });
assertEqual('6 url-encoded slug resolves', summary(resolveProductParam(encodeURIComponent('walton-fridge'), storefrontProducts)), { status: 'canonical', slug: 'walton-fridge' });

// ── 8. Unknown links fail safely ──
assertEqual('8 unknown product slug', summary(resolveProductParam('no-such-product', storefrontProducts)), { status: 'not_found' });
assertEqual('8 unknown numeric product id', summary(resolveProductParam('999', storefrontProducts)), { status: 'not_found' });
assertEqual('8 empty param', summary(resolveBrandParam('', storefrontBrands)), { status: 'not_found' });
assertEqual('8 unknown creator', summary(resolveCreatorParam('nobody', storefrontCreators)), { status: 'not_found' });
assertEqual('8 creators have no numeric legacy form', summary(resolveCreatorParam('2', storefrontCreators)), { status: 'not_found' });

// ── 9 + 12. Builders are consistent, round-trip, and never produce /api ──
for (const p of storefrontProducts) {
  assertEqual(`9 product canonical round-trips (${p.slug})`, summary(resolveProductParam(productPath(p).split('/').pop()!, storefrontProducts)), { status: 'canonical', slug: p.slug });
}
for (const b of storefrontBrands) {
  assertEqual(`9 brand canonical round-trips (${b.slug})`, summary(resolveBrandParam(brandPath(b).split('/').pop()!, storefrontBrands)), { status: 'canonical', slug: b.slug });
}
for (const c of storefrontCreators) {
  assertEqual(`9 creator canonical round-trips (${c.slug})`, summary(resolveCreatorParam(creatorPath(c).split('/').pop()!, storefrontCreators)), { status: 'canonical', slug: c.slug });
}
const built = [
  ...storefrontProducts.map(productPath),
  ...storefrontBrands.map((b) => brandPath(b)),
  ...storefrontCreators.map(creatorPath),
  productPath(null),
  brandPath(undefined),
  creatorPath({}),
  productPath({ id: 'a/b?c#d' }),
];
assertOk('12 builders never produce an /api path', built.every((u) => !u.startsWith('/api')), built.join(' '));
assertOk('9 builders only produce public entity paths', built.every((u) => /^\/(products|brands|creators)(\/[^/?#]+(\/products)?)?$/.test(u)), built.join(' '));
assertEqual('9 unsafe characters in an id are encoded, never create extra segments', productPath({ id: 'a/b?c#d' }), '/products/a%2Fb%3Fc%23d');
assertEqual('9 missing entity builds the listing path', [productPath(null), brandPath(undefined), creatorPath({})], ['/products', '/brands', '/creators']);

// ── 10 + 12 + 13. Route table and server routing are unchanged ──
const git = (args: string[]) => execFileSync('git', args, { encoding: 'utf8' });
const headApp = git(['show', 'HEAD:src/App.tsx']).replace(/\r\n/g, '\n');
const workApp = readFileSync('src/App.tsx', 'utf8').replace(/\r\n/g, '\n');
assertOk('10 public route table (src/App.tsx) unchanged', headApp === workApp);
for (const route of ['/products/:id', '/brands/:id', '/brands/:id/products', '/creators/:id', '/spotlight/:slug', '/publisher/:slug']) {
  assertOk(`10 route still declared: ${route}`, workApp.includes(`path="${route}"`));
}
const headServer = git(['show', 'HEAD:server.ts']).replace(/\r\n/g, '\n');
assertOk('12 server routing (server.ts: /api/og, /api/share, SPA fallback) unchanged', headServer === readFileSync('server.ts', 'utf8').replace(/\r\n/g, '\n'));

console.log(`\n${fail === 0 ? 'PASS' : 'FAIL'} probe-public-urls (${pass} passed, ${fail} failed)`);
process.exit(fail === 0 ? 0 : 1);
