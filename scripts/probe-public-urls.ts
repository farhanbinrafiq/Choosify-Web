/**
 * Deterministic probe for lib/publicUrls.ts — canonical public URLs and legacy
 * link resolution (Phase A URL stabilization), plus Brand / Creator public-handle
 * URLs (Public Identity Phase C: handle → slug → id) and the C4 retired-handle
 * fallback helpers.
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
  isUsableHandle,
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
  asPublicHandleResolution,
  brandForHandleResolution,
  catalogEntityForHandleResolution,
  creatorForHandleResolution,
  handleLookupKey,
  publicUsernameLabel,
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

const phaseA = { pass, fail };

// ══ Phase C — Brand / Creator public handles (additive; Products and Guides unchanged) ══
// A record carrying an active `publicHandle` is linked as /brands/{handle} or
// /creators/{handle}; without one (absent, null or malformed) the Phase A URL is
// produced exactly as before. Retired handles are not resolved by this module.
const brief = (r: RouteResolution<{ catalogId?: string | null; id?: unknown }>) =>
  r.status === 'redirect'
    ? `redirect:${r.to}`
    : r.status === 'canonical'
      ? `canonical:${String(r.entity.catalogId ?? r.entity.id)}`
      : r.status === 'ambiguous'
        ? `ambiguous:${r.matchedBy}`
        : r.status;

// ── C1. Builders: handle → slug → id ──
assertEqual('C1 brand: handle wins over slug', brandPath({ publicHandle: 'samsung-bd', slug: 'samsung', catalogId: 'brand-samsung', id: 7 }), '/brands/samsung-bd');
assertEqual('C1 brand: handle with sub-path', brandPath({ publicHandle: 'samsung-bd', slug: 'samsung' }, '/products'), '/brands/samsung-bd/products');
assertEqual('C1 brand: absent handle → slug (Phase A unchanged)', brandPath({ slug: 'samsung', catalogId: 'brand-samsung' }), '/brands/samsung');
assertEqual('C1 brand: null handle → slug', brandPath({ publicHandle: null, slug: 'samsung', catalogId: 'brand-samsung' }), '/brands/samsung');
assertEqual('C1 brand: no handle, no slug → catalog id', brandPath({ publicHandle: null, slug: '', catalogId: 'brand-x' }), '/brands/brand-x');
assertEqual('C1 brand: no handle, slug or catalog id → id', brandPath({ id: 42 }), '/brands/42');
assertEqual('C1 brand: missing entity → /brands', brandPath(null), '/brands');
assertEqual('C1 creator: handle wins over slug', creatorPath({ publicHandle: 'farhan', slug: 'farhan-bin-rafiq', id: 'creator-farhan' }), '/creators/farhan');
assertEqual('C1 creator: absent handle → slug', creatorPath({ slug: 'farhan-bin-rafiq', id: 'creator-farhan' }), '/creators/farhan-bin-rafiq');
assertEqual('C1 creator: no handle or slug → id', creatorPath({ id: 'creator-farhan' }), '/creators/creator-farhan');

// ── C2. Malformed handles are ignored (never repaired) → slug ──
for (const bad of ['Samsung', 'ab', 'sam sung', '@samsung', 'sam/sung', '-samsung', 'samsung-', 'sa--msung', 'abcdefghij-abcdefghij-abcdefghi', 'café', '1abc', '']) {
  assertEqual(`C2 brand: malformed handle ${JSON.stringify(bad)} ignored → slug`, brandPath({ publicHandle: bad, slug: 'samsung' }), '/brands/samsung');
}
assertEqual('C2 isUsableHandle accepts the stored form only', ['apex', 'tech-talks-bd', 'Apex', 'ap', ' apex'].map(isUsableHandle), [true, true, false, false, false]);

// ── C3. Products and Guides never use a handle ──
assertEqual('C3 product: handle-like field ignored by the builder', productPath({ slug: 'macbook', publicHandle: 'nope' } as never), '/products/macbook');
assertEqual('C3 guide: handle-like field ignored by the builder', guidePath({ slug: 'best-phones', publicHandle: 'nope' } as never), '/spotlight/best-phones');
{
  const handleLikeProducts = [{ id: 5, catalogId: 'prod-5', slug: 'macbook', publicHandle: 'macbook-x' }];
  assertEqual('C3 product: handle-like value is not a product URL key', brief(resolveProductParam('macbook-x', handleLikeProducts)), 'not_found');
  assertEqual('C3 product: slug stays canonical when a handle-like field is present', brief(resolveProductParam('macbook', handleLikeProducts)), 'canonical:prod-5');
  assertEqual(
    'C3 catalog product: id still redirects to the slug when a handle-like field is present',
    brief(resolveCatalogProductParam('prod-5', [{ id: 'prod-5', slug: 'macbook', publicHandle: 'macbook-x' }])),
    'redirect:/products/macbook',
  );
}

// ── C4. Storefront resolvers: handle first, then the Phase A chain ──
const handleBrands = [
  { id: 1, catalogId: 'brand-samsung', slug: 'samsung', publicHandle: 'samsung-bd', name: 'Samsung' },
  { id: 2, catalogId: 'brand-walton', slug: 'walton', publicHandle: 'walton', name: 'Walton' },
  { id: 3, catalogId: 'brand-apex', slug: 'apex', publicHandle: null, name: 'Apex' },
];
assertEqual('C4 brand: handle URL is canonical', brief(resolveBrandParam('samsung-bd', handleBrands)), 'canonical:brand-samsung');
assertEqual('C4 brand: slug URL redirects to the handle URL', brief(resolveBrandParam('samsung', handleBrands)), 'redirect:/brands/samsung-bd');
assertEqual('C4 brand: catalog id redirects to the handle URL', brief(resolveBrandParam('brand-samsung', handleBrands)), 'redirect:/brands/samsung-bd');
assertEqual('C4 brand: legacy numeric id redirects to the handle URL', brief(resolveBrandParam('1', handleBrands)), 'redirect:/brands/samsung-bd');
assertEqual('C4 brand: name alias redirects to the handle URL', brief(resolveBrandParam('Samsung', handleBrands)), 'redirect:/brands/samsung-bd');
assertEqual('C4 brand: upper-case handle redirects to the stored form', brief(resolveBrandParam('SAMSUNG-BD', handleBrands)), 'redirect:/brands/samsung-bd');
assertEqual('C4 brand: handle equal to slug is canonical', brief(resolveBrandParam('walton', handleBrands)), 'canonical:brand-walton');
assertEqual('C4 brand without handle: slug canonical (Phase A unchanged)', brief(resolveBrandParam('apex', handleBrands)), 'canonical:brand-apex');
assertEqual('C4 brand without handle: id redirects to the slug (Phase A unchanged)', brief(resolveBrandParam('brand-apex', handleBrands)), 'redirect:/brands/apex');
assertEqual('C4 brand: unknown → not_found', brief(resolveBrandParam('nokia', handleBrands)), 'not_found');
assertEqual('C4 brand: sub-path redirect target is built from the handle', brandPath(handleBrands[0], '/products'), '/brands/samsung-bd/products');
{
  const dupHandle = [
    { id: 1, catalogId: 'b1', slug: 'one', publicHandle: 'same' },
    { id: 2, catalogId: 'b2', slug: 'two', publicHandle: 'same' },
  ];
  assertEqual('C4 brand: duplicate handle in data → ambiguous, never guessed', brief(resolveBrandParam('same', dupHandle)), 'ambiguous:handle');
  const legacyCollision = [
    { id: 3, catalogId: 'p3a', slug: 'a', publicHandle: 'alpha' },
    { id: 3, catalogId: 'p3b', slug: 'b', publicHandle: 'beta' },
  ];
  assertEqual('C4 brand: colliding legacy numeric id stays ambiguous with handles', brief(resolveBrandParam('3', legacyCollision)), 'ambiguous:legacy_numeric_id');
}
const handleCreators = [
  { id: 'creator-farhan', slug: 'farhan-bin-rafiq', publicHandle: 'farhan' },
  { id: 'creator-sarah', slug: 'sarah-jenkins' },
];
assertEqual('C4 creator: handle URL canonical', brief(resolveCreatorParam('farhan', handleCreators)), 'canonical:creator-farhan');
assertEqual('C4 creator: slug redirects to the handle', brief(resolveCreatorParam('farhan-bin-rafiq', handleCreators)), 'redirect:/creators/farhan');
assertEqual('C4 creator: id redirects to the handle', brief(resolveCreatorParam('creator-farhan', handleCreators)), 'redirect:/creators/farhan');
assertEqual('C4 creator without handle: slug canonical (Phase A unchanged)', brief(resolveCreatorParam('sarah-jenkins', handleCreators)), 'canonical:creator-sarah');
assertEqual('C4 creator: the display @handle is not a URL key', brief(resolveCreatorParam('farhan_tech', handleCreators)), 'not_found');

// ── C5. Catalog (share renderer) resolvers ──
{
  const catBrands = [
    { id: 'brand-samsung', slug: 'samsung', name: 'Samsung', publicHandle: 'samsung-bd' },
    { id: 'brand-apex', slug: 'apex', name: 'Apex' },
  ];
  assertEqual('C5 catalog brand: handle canonical', brief(resolveCatalogBrandParam('samsung-bd', catBrands)), 'canonical:brand-samsung');
  assertEqual('C5 catalog brand: slug → handle', brief(resolveCatalogBrandParam('samsung', catBrands)), 'redirect:/brands/samsung-bd');
  assertEqual('C5 catalog brand without handle unchanged', brief(resolveCatalogBrandParam('apex', catBrands)), 'canonical:brand-apex');
  const catCreators = [{ id: 'creator-farhan', slug: 'farhan-bin-rafiq', publicHandle: 'farhan' }];
  assertEqual('C5 catalog creator: handle canonical', brief(resolveCatalogCreatorParam('farhan', catCreators)), 'canonical:creator-farhan');
  assertEqual('C5 catalog creator: slug → handle', brief(resolveCatalogCreatorParam('farhan-bin-rafiq', catCreators)), 'redirect:/creators/farhan');
}

// ── C6. Brand / Creator type separation: a handle only resolves within its own type ──
{
  const brandsT = [{ id: 1, catalogId: 'brand-nova', slug: 'nova', publicHandle: 'nova-bd', name: 'Nova' }];
  const creatorsT = [{ id: 'creator-nova', slug: 'nova-creator', publicHandle: 'nova' }];
  assertEqual('C6 a creator slug is not a brand URL', brief(resolveBrandParam('nova-creator', brandsT)), 'not_found');
  assertEqual('C6 a brand handle is not a creator URL', brief(resolveCreatorParam('nova-bd', creatorsT)), 'not_found');
  assertEqual('C6 same key, two types: /brands/nova is the brand (slug → its handle)', brief(resolveBrandParam('nova', brandsT)), 'redirect:/brands/nova-bd');
  assertEqual('C6 same key, two types: /creators/nova is the creator (handle)', brief(resolveCreatorParam('nova', creatorsT)), 'canonical:creator-nova');
  assertEqual(
    'C6 share renderer keeps the types apart too',
    [
      brief(resolveCatalogBrandParam('nova-bd', [{ id: 'brand-nova', slug: 'nova', publicHandle: 'nova-bd' }])),
      brief(resolveCatalogCreatorParam('nova-bd', [{ id: 'creator-nova', slug: 'nova-creator', publicHandle: 'nova' }])),
    ],
    ['canonical:brand-nova', 'not_found'],
  );
}

// ── C7. Handle URLs round-trip and stay within the public path shapes ──
for (const b of handleBrands) {
  assertEqual(`C7 brand canonical round-trips (${b.catalogId})`, brief(resolveBrandParam(brandPath(b).split('/').pop()!, handleBrands)), `canonical:${b.catalogId}`);
}
for (const c of handleCreators) {
  assertEqual(`C7 creator canonical round-trips (${c.id})`, brief(resolveCreatorParam(creatorPath(c).split('/').pop()!, handleCreators)), `canonical:${c.id}`);
}
{
  const handleBuilt = [...handleBrands.map((b) => brandPath(b)), ...handleBrands.map((b) => brandPath(b, '/products')), ...handleCreators.map(creatorPath)];
  assertOk('C7 handle builders only produce public entity paths', handleBuilt.every((u) => /^\/(brands|creators)\/[a-z0-9-]+(\/products)?$/.test(u)), handleBuilt.join(' '));
}

const phaseC = { pass: pass - phaseA.pass, fail: fail - phaseA.fail };
console.log(`\nPhase A section: ${phaseA.pass} passed, ${phaseA.fail} failed`);
console.log(`Phase C handle section: ${phaseC.pass} passed, ${phaseC.fail} failed`);

// ══ Public Identity C4 — retired-handle fallback helpers (shared by the pages and shareHtml) ══
const beforeC4 = { pass, fail };
{
  const retired = (entityType: 'brand' | 'creator', entityId: string, handle: string, currentHandle: string | null) =>
    ({ entityType, entityId, handle, status: 'retired' as const, currentHandle });

  // R1. When a lookup is made at all (malformed / reserved input never reaches the API).
  assertEqual('R1 lookup key: a valid handle', handleLookupKey('samsung-old'), 'samsung-old');
  assertEqual('R1 lookup key: normalized like the validator (@, case, url-encoding)', [handleLookupKey('@Samsung-Old'), handleLookupKey(encodeURIComponent('@samsung-old'))], ['samsung-old', 'samsung-old']);
  for (const bad of ['', 'ab', 'a_b', 'sam sung', 'café', 'samsung-', '-samsung', 'sa--msung', 'products', 'brands', 'brand-apple', 'creator-1790540879009', 'prod-12', '1abc', 'abcdefghij-abcdefghij-abcdefghi']) {
    assertEqual(`R1 no lookup (malformed/reserved): ${JSON.stringify(bad)}`, handleLookupKey(bad), null);
  }
  assertEqual('R1 no lookup for null/undefined', [handleLookupKey(null), handleLookupKey(undefined)], [null, null]);

  // R2. Resolver answers are validated before use.
  const good = { entityType: 'brand', entityId: 'brand-samsung', handle: 'samsung-old', status: 'retired', currentHandle: 'samsung-bd' };
  assertEqual('R2 a well-formed answer is accepted', asPublicHandleResolution(good, 'brand'), good);
  assertEqual('R2 wrong entity type → null', asPublicHandleResolution(good, 'creator'), null);
  assertEqual('R2 unknown status → null', asPublicHandleResolution({ ...good, status: 'reserved' }, 'brand'), null);
  assertEqual('R2 missing entity id → null', asPublicHandleResolution({ ...good, entityId: '' }, 'brand'), null);
  assertEqual('R2 bad currentHandle → null', asPublicHandleResolution({ ...good, currentHandle: 5 }, 'brand'), null);
  assertEqual('R2 garbage → null', [asPublicHandleResolution(null, 'brand'), asPublicHandleResolution('x', 'brand'), asPublicHandleResolution({}, 'brand')], [null, null, null]);
  assertEqual('R2 extra fields are dropped (only routing fields kept)', Object.keys(asPublicHandleResolution({ ...good, name: 'Samsung', sellerId: 'u-1' }, 'brand') || {}).sort(), ['currentHandle', 'entityId', 'entityType', 'handle', 'status']);

  // R3. Brand targets (storefront list).
  const brands = [
    { id: 1, catalogId: 'brand-samsung', slug: 'samsung', publicHandle: 'samsung-bd', name: 'Samsung' },
    { id: 2, catalogId: 'brand-walton', slug: 'walton', publicHandle: null, name: 'Walton' },
  ];
  const t1 = brandForHandleResolution(retired('brand', 'brand-samsung', 'samsung-old', 'samsung-bd'), brands);
  assertEqual('R3 retired Brand handle → current Brand handle URL', t1 ? brandPath(t1) : null, '/brands/samsung-bd');
  const t2 = brandForHandleResolution(retired('brand', 'brand-walton', 'walton-old', null), brands);
  assertEqual('R3 retired handle, no current handle → slug URL', t2 ? brandPath(t2) : null, '/brands/walton');
  assertEqual('R3 active handle of a Brand absent from the loaded public list → not found', brandForHandleResolution({ entityType: 'brand', entityId: 'brand-draft', handle: 'draft-h', status: 'active', currentHandle: 'draft-h' }, brands), undefined);
  assertEqual('R3 retired handle of a Brand absent from the list → not found', brandForHandleResolution(retired('brand', 'brand-gone', 'gone', null), brands), undefined);
  assertEqual('R3 wrong entity type (a Creator answer on the Brand page) → not found', brandForHandleResolution(retired('creator', 'brand-samsung', 'x', null) as never, brands), undefined);
  assertEqual('R3 null / failed lookup → not found', brandForHandleResolution(null, brands), undefined);
  assertEqual('R3 numeric storefront ids are never matched against the resolver id', brandForHandleResolution(retired('brand', '1', 'x', null), brands), undefined);
  assertEqual('R3 /products sub-path target is built from the current handle', t1 ? brandPath(t1, '/products') : null, '/brands/samsung-bd/products');
  // Loop safety: the redirect target is the entity's own canonical key, which resolves locally (no second lookup).
  assertEqual('R3 the redirect target resolves canonically (no loop, no second lookup)', summary(resolveBrandParam('samsung-bd', brands)), { status: 'canonical', slug: 'samsung' });
  assertEqual('R3 slug-fallback target resolves canonically too', summary(resolveBrandParam('walton', brands)), { status: 'canonical', slug: 'walton' });
  assertEqual('R3 an already-current handle never reaches the lookup (resolves locally)', resolveBrandParam('samsung-bd', brands).status !== 'not_found', true);
  assertEqual('R3 a retired handle is not found locally (this is what triggers the lookup)', resolveBrandParam('samsung-old', brands).status, 'not_found');

  // R4. Creator targets.
  const creators = [
    { id: 'creator-farhan', slug: 'farhan-bin-rafiq', publicHandle: 'farhan' },
    { id: 'creator-sarah', slug: 'sarah-jenkins', publicHandle: null },
  ];
  const c1 = creatorForHandleResolution(retired('creator', 'creator-farhan', 'farhan-old', 'farhan'), creators);
  assertEqual('R4 retired Creator handle → current Creator handle URL', c1 ? creatorPath(c1) : null, '/creators/farhan');
  const c2 = creatorForHandleResolution(retired('creator', 'creator-sarah', 'sarah-old', null), creators);
  assertEqual('R4 retired Creator handle, no current handle → slug URL', c2 ? creatorPath(c2) : null, '/creators/sarah-jenkins');
  assertEqual('R4 a Brand answer on the Creator page → not found', creatorForHandleResolution(retired('brand', 'creator-farhan', 'x', null) as never, creators), undefined);
  assertEqual('R4 Creator absent from the live list (draft/archived) → not found', creatorForHandleResolution({ entityType: 'creator', entityId: 'creator-draft', handle: 'd', status: 'active', currentHandle: 'd' }, creators), undefined);
  assertEqual('R4 Creator target resolves canonically (no loop)', summary(resolveCreatorParam('farhan', creators)), { status: 'canonical', slug: 'farhan-bin-rafiq' });

  // R5. Share renderer (raw catalog lists).
  const catBrands = [{ id: 'brand-samsung', slug: 'samsung', publicHandle: 'samsung-bd' }];
  const cb = catalogEntityForHandleResolution(retired('brand', 'brand-samsung', 'samsung-old', 'samsung-bd'), 'brand', catBrands);
  assertEqual('R5 catalog list: retired handle → the listed entity', cb?.id, 'brand-samsung');
  assertEqual('R5 catalog list: canonical uses the current handle', cb ? brandPath({ publicHandle: cb.publicHandle, slug: cb.slug, catalogId: cb.id }) : null, '/brands/samsung-bd');
  assertEqual('R5 catalog list: duplicate ids are never guessed', catalogEntityForHandleResolution(retired('brand', 'b1', 'x', null), 'brand', [{ id: 'b1' }, { id: 'b1' }]), undefined);
}
const phaseC4 = { pass: pass - beforeC4.pass, fail: fail - beforeC4.fail };
console.log(`\nPhase C4 retired-handle section: ${phaseC4.pass} passed, ${phaseC4.fail} failed`);

// ── Visible username (Creator hero F1): registered handle only, never the free-text display handle ──
{
  const live = [
    { id: 'creator-farhan', slug: 'farhan-bin-rafiq', name: 'Farhan Bin Rafiq', handle: '@farhan_tech', publicHandle: 'farhan-bin-rafiq' },
    { id: 'creator-techtalks', slug: 'tech-talks-bd', name: 'Tech Talks BD', handle: '@techtalksbd', publicHandle: 'tech-talks-bd' },
    { id: 'creator-sarah', slug: 'sarah-jenkins', name: 'Sarah Jenkins', handle: '@sarah_style', publicHandle: 'sarah-jenkins' },
  ];
  assertEqual('U1 Farhan shows @farhan-bin-rafiq', publicUsernameLabel(live[0]), '@farhan-bin-rafiq');
  assertEqual('U1 TechTalks shows @tech-talks-bd', publicUsernameLabel(live[1]), '@tech-talks-bd');
  assertEqual('U1 Sarah shows @sarah-jenkins', publicUsernameLabel(live[2]), '@sarah-jenkins');
  assertEqual('U2 visible username, profile URL and canonical key agree', live.map((c) => [publicUsernameLabel(c), creatorPath(c)]), [
    ['@farhan-bin-rafiq', '/creators/farhan-bin-rafiq'],
    ['@tech-talks-bd', '/creators/tech-talks-bd'],
    ['@sarah-jenkins', '/creators/sarah-jenkins'],
  ]);
  assertEqual('U3 a free-text handle that names another account never overrides the username', publicUsernameLabel({ handle: '@walton', publicHandle: 'farhan-bin-rafiq' } as never), '@farhan-bin-rafiq');
  assertEqual('U4 no registered username → no username shown (free-text handle ignored)', [
    publicUsernameLabel({ handle: '@farhan_tech', publicHandle: null } as never),
    publicUsernameLabel({ handle: '@walton' } as never),
    publicUsernameLabel({ name: 'Draft Creator', publicHandle: undefined } as never),
    publicUsernameLabel(null),
  ], [null, null, null, null]);
  assertEqual('U4 malformed stored values are not shown', ['Farhan', '@farhan', 'ab', ' farhan', 'farhan_tech', ''].map((publicHandle) => publicUsernameLabel({ publicHandle })), [null, null, null, null, null, null]);
  assertEqual('U5 input objects are not modified', JSON.stringify(live[0]), JSON.stringify({ id: 'creator-farhan', slug: 'farhan-bin-rafiq', name: 'Farhan Bin Rafiq', handle: '@farhan_tech', publicHandle: 'farhan-bin-rafiq' }));
  const hero = readFileSync('src/components/creator/CreatorProfileHero.tsx', 'utf8');
  assertEqual('U6 Creator hero renders the registered username and no longer reads creator.handle', [/publicUsernameLabel\(creator\)/.test(hero), /creator\.handle\b/.test(hero)], [true, false]);
}

console.log(`\n${fail === 0 ? 'PASS' : 'FAIL'} probe-public-urls (${pass} passed, ${fail} failed)`);
process.exit(fail === 0 ? 0 : 1);
