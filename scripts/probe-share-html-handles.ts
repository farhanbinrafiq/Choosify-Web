/**
 * Deterministic probe for server/shareHtml.ts — Brand / Creator link-preview
 * canonical URLs with public handles (Public Identity C4).
 *
 * Runs buildShareHtml() against a local stub catalog API (127.0.0.1, random port)
 * that serves fixed Brand / Creator lists and the public handle resolver, and
 * records every request it receives. No real API, no database, no network.
 *
 * Run with `npx tsx scripts/probe-share-html-handles.ts`.
 */
import http from 'node:http';
import type { AddressInfo } from 'node:net';

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

// ── Stub catalog API ──
const BRANDS = [
  { id: 'brand-samsung', slug: 'samsung', name: 'Samsung', description: 'Phones and TVs', publicHandle: 'samsung-bd' },
  { id: 'brand-walton', slug: 'walton', name: 'Walton', description: 'Electronics', publicHandle: null },
];
const CREATORS = [
  { id: 'creator-farhan', slug: 'farhan-bin-rafiq', name: 'Farhan', bio: 'Tech reviews', publicHandle: 'farhan' },
  { id: 'creator-sarah', slug: 'sarah-jenkins', name: 'Sarah', bio: 'Lifestyle', publicHandle: null },
];
type Resolution = { entityType: string; entityId: string; handle: string; status: string; currentHandle: string | null };
const RESOLVER: Record<string, Resolution | 'fail' | 'garbage'> = {
  'brand:samsung-old': { entityType: 'brand', entityId: 'brand-samsung', handle: 'samsung-old', status: 'retired', currentHandle: 'samsung-bd' },
  'brand:walton-old': { entityType: 'brand', entityId: 'brand-walton', handle: 'walton-old', status: 'retired', currentHandle: null },
  'brand:draft-h': { entityType: 'brand', entityId: 'brand-draft', handle: 'draft-h', status: 'active', currentHandle: 'draft-h' },
  'brand:wrong-type': { entityType: 'creator', entityId: 'creator-farhan', handle: 'wrong-type', status: 'retired', currentHandle: 'farhan' },
  'brand:boom-h': 'fail',
  'brand:junk-h': 'garbage',
  'creator:farhan-old': { entityType: 'creator', entityId: 'creator-farhan', handle: 'farhan-old', status: 'retired', currentHandle: 'farhan' },
  'creator:sarah-old': { entityType: 'creator', entityId: 'creator-sarah', handle: 'sarah-old', status: 'retired', currentHandle: null },
};
const requests: string[] = [];
const server = http.createServer((req, res) => {
  const url = new URL(req.url || '/', 'http://stub');
  requests.push(`${url.pathname}${url.search}`);
  const send = (status: number, body: unknown) => {
    res.writeHead(status, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(body));
  };
  if (url.pathname === '/catalog/brands') return send(200, { data: BRANDS });
  if (url.pathname === '/catalog/creators') return send(200, { data: CREATORS });
  if (url.pathname.startsWith('/catalog/products')) return send(200, { data: [], meta: { total: 0 } });
  const m = url.pathname.match(/^\/catalog\/handles\/([^/]+)\/resolve$/);
  if (m) {
    const entry = RESOLVER[`${url.searchParams.get('type')}:${decodeURIComponent(m[1])}`];
    if (entry === 'fail') return send(500, { success: false, error: 'boom' });
    if (entry === 'garbage') return send(200, { data: { nonsense: true } });
    if (!entry) return send(404, { success: false, error: 'Handle not found', code: 'HANDLE_NOT_FOUND' });
    return send(200, { success: true, data: entry });
  }
  return send(404, {});
});

async function main() {
  await new Promise<void>((resolve) => server.listen(0, '127.0.0.1', () => resolve()));
  const { port } = server.address() as AddressInfo;
  process.env.CATALOG_API_BASE_URL = `http://127.0.0.1:${port}`;
  // Imported only after the stub base URL is set (seoShared reads it at import time).
  const { buildShareHtml } = await import('../server/shareHtml');
  const { SITE_URL } = await import('../lib/seoShared');

  const render = async (path: string, search = '') => {
    const before = requests.length;
    const html = await buildShareHtml(path, search);
    const canonical = html.match(/<link rel="canonical" href="([^"]*)"/)?.[1] ?? null;
    const title = html.match(/<title>([^<]*)<\/title>/)?.[1] ?? null;
    const resolverCalls = requests.slice(before).filter((r) => r.startsWith('/catalog/handles/'));
    return { canonical: canonical ? canonical.replace(SITE_URL, '') : null, title, resolverCalls };
  };

  // ── Brands ──
  let r = await render('/brands/samsung-bd');
  assertEqual('brand preview by current handle: canonical uses the handle', r.canonical, '/brands/samsung-bd');
  assertEqual('brand preview by current handle: no resolver request', r.resolverCalls.length, 0);
  r = await render('/brands/samsung');
  assertEqual('brand preview by slug: canonical is the handle URL', r.canonical, '/brands/samsung-bd');
  r = await render('/brands/brand-samsung');
  assertEqual('brand preview by catalog id: canonical is the handle URL (no internal id)', r.canonical, '/brands/samsung-bd');
  r = await render('/brands/walton');
  assertEqual('brand preview without a handle: canonical falls back to the slug', r.canonical, '/brands/walton');
  r = await render('/brands/samsung-old');
  assertEqual('retired brand handle: canonical is the current handle', r.canonical, '/brands/samsung-bd');
  assertEqual('retired brand handle: real brand metadata (title)', Boolean(r.title?.includes('Samsung')), true);
  assertEqual('retired brand handle: exactly one resolver request, typed brand', r.resolverCalls, ['/catalog/handles/samsung-old/resolve?type=brand']);
  r = await render('/brands/samsung-old/products');
  assertEqual('retired brand handle: /products sub-path kept', r.canonical, '/brands/samsung-bd/products');
  r = await render('/brands/walton-old');
  assertEqual('retired handle without a current handle: canonical falls back to the slug', r.canonical, '/brands/walton');

  const unresolved = async (path: string, label: string, expectResolverCall: boolean) => {
    const res = await render(path);
    assertEqual(`${label}: existing fallback canonical (the requested path)`, res.canonical, path);
    assertEqual(`${label}: ${expectResolverCall ? 'one resolver request' : 'no resolver request'}`, res.resolverCalls.length, expectResolverCall ? 1 : 0);
    assertEqual(`${label}: rendered without crashing`, typeof res.title, 'string');
  };
  await unresolved('/brands/ghost-h', 'unknown brand handle (404)', true);
  await unresolved('/brands/draft-h', 'active handle of a brand not in the public list', true);
  await unresolved('/brands/wrong-type', 'resolver answer of the wrong entity type', true);
  await unresolved('/brands/boom-h', 'resolver failure (500)', true);
  await unresolved('/brands/junk-h', 'malformed resolver answer', true);
  await unresolved('/brands/a_b', 'malformed handle', false);
  await unresolved('/brands/brand-nope', 'reserved-prefix param', false);

  // ── Creators ──
  r = await render('/creators/farhan');
  assertEqual('creator preview by current handle: canonical uses the handle', r.canonical, '/creators/farhan');
  assertEqual('creator preview by current handle: no resolver request', r.resolverCalls.length, 0);
  r = await render('/creators/farhan-bin-rafiq');
  assertEqual('creator preview by slug: canonical is the handle URL', r.canonical, '/creators/farhan');
  r = await render('/creators/sarah-jenkins');
  assertEqual('creator preview without a handle: canonical falls back to the slug', r.canonical, '/creators/sarah-jenkins');
  r = await render('/creators/farhan-old');
  assertEqual('retired creator handle: canonical is the current handle', r.canonical, '/creators/farhan');
  assertEqual('retired creator handle: one resolver request, typed creator', r.resolverCalls, ['/catalog/handles/farhan-old/resolve?type=creator']);
  r = await render('/creators/sarah-old');
  assertEqual('retired creator handle without a current handle: slug canonical', r.canonical, '/creators/sarah-jenkins');
  await unresolved('/creators/ghost-c', 'unknown creator handle', true);
  r = await render('/creators/samsung-old');
  assertEqual('a brand-only retired handle on the creator path: not resolved as a creator', r.canonical, '/creators/samsung-old');

  // ── Products / other previews untouched ──
  r = await render('/products/some-product');
  assertEqual('product preview never calls the handle resolver', r.resolverCalls.length, 0);
  r = await render('/brands');
  assertEqual('brand listing preview never calls the handle resolver', r.resolverCalls.length, 0);

  server.close();
  console.log(`\n${fail === 0 ? 'PASS' : 'FAIL'} probe-share-html-handles (${pass} passed, ${fail} failed)`);
  process.exit(fail === 0 ? 0 : 1);
}

main().catch((error) => {
  console.error('PROBE ERROR', error instanceof Error ? error.stack || error.message : error);
  server.close();
  process.exit(1);
});
