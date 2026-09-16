/**
 * Deterministic probe for src/lib/sorting/sortRegistry.ts.
 *
 * Pure / in-memory only — no React, no network, no browser, no persistent
 * artifacts. Run with `npm run test:sort-registry`.
 *
 * Asserts correct ordering for every implemented (non-default) sort option
 * on every page's registry entry, against small hand-built fixture arrays,
 * plus a tie-breaking case per entity to prove output is deterministic
 * (stable sort — ties keep their original relative order) rather than
 * randomly reordered between runs.
 */
import {
  PRODUCT_SORT_OPTIONS,
  SEARCH_SORT_OPTIONS,
  BRAND_SORT_OPTIONS,
  BRAND_DETAIL_SORT_OPTIONS,
  CREATOR_SORT_OPTIONS,
  CATEGORY_SORT_OPTIONS,
  DEAL_SORT_OPTIONS,
  applySortOption,
  type SortOption,
} from '../src/lib/sorting/sortRegistry';

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

function sortBy<TItem, TSortKey>(options: SortOption<TSortKey>[], id: string, items: TItem[]): TItem[] {
  return applySortOption(
    items,
    options,
    id,
    '__no_default_used_in_this_probe__',
    () => items, // default path unused here — every case below picks a real comparator
    (x) => x as unknown as TSortKey,
  );
}

function ids<T extends { id: string | number }>(items: T[]): (string | number)[] {
  return items.map((i) => i.id);
}

// ─── Products ────────────────────────────────────────────────────────────

{
  const items = [
    { id: 'p1', createdAt: '2026-01-01T00:00:00Z', price: 500 },
    { id: 'p2', createdAt: '2026-03-01T00:00:00Z', price: 100 },
    { id: 'p3', createdAt: '2026-02-01T00:00:00Z', price: 300 },
  ];
  assertEqual('Products: newest', ids(sortBy(PRODUCT_SORT_OPTIONS, 'newest', items)), ['p2', 'p3', 'p1']);
  assertEqual('Products: oldest', ids(sortBy(PRODUCT_SORT_OPTIONS, 'oldest', items)), ['p1', 'p3', 'p2']);
  assertEqual('Products: price_asc', ids(sortBy(PRODUCT_SORT_OPTIONS, 'price_asc', items)), ['p2', 'p3', 'p1']);
  assertEqual('Products: price_desc', ids(sortBy(PRODUCT_SORT_OPTIONS, 'price_desc', items)), ['p1', 'p3', 'p2']);

  // Tie-break: identical price -> stable, original relative order preserved
  const tied = [
    { id: 'a', createdAt: '2026-01-01T00:00:00Z', price: 200 },
    { id: 'b', createdAt: '2026-01-02T00:00:00Z', price: 200 },
    { id: 'c', createdAt: '2026-01-03T00:00:00Z', price: 200 },
  ];
  assertEqual('Products: price_asc tie-break is stable', ids(sortBy(PRODUCT_SORT_OPTIONS, 'price_asc', tied)), [
    'a',
    'b',
    'c',
  ]);
}

// ─── Search (products only) ─────────────────────────────────────────────

{
  // Deliberately give the highest id the OLDEST createdAt — if `newest` ever
  // regresses to the old `Number(b.id) - Number(a.id)` bug, this fixture
  // would sort id-desc (3,2,1) instead of date-desc (2,1,3).
  const items = [
    { id: 1, createdAt: '2026-05-01T00:00:00Z', price: 400 },
    { id: 2, createdAt: '2026-06-01T00:00:00Z', price: 200 },
    { id: 3, createdAt: '2026-01-01T00:00:00Z', price: 900 },
  ];
  assertEqual(
    'Search: newest is date-based, not id-based',
    ids(sortBy(SEARCH_SORT_OPTIONS, 'newest', items)),
    [2, 1, 3],
  );
  assertOk(
    'Search: newest does NOT fall back to id ordering',
    JSON.stringify(ids(sortBy(SEARCH_SORT_OPTIONS, 'newest', items))) !== JSON.stringify([3, 2, 1]),
  );
  assertEqual('Search: oldest', ids(sortBy(SEARCH_SORT_OPTIONS, 'oldest', items)), [3, 1, 2]);
  assertEqual('Search: price_asc', ids(sortBy(SEARCH_SORT_OPTIONS, 'price_asc', items)), [2, 1, 3]);
  assertEqual('Search: price_desc', ids(sortBy(SEARCH_SORT_OPTIONS, 'price_desc', items)), [3, 1, 2]);
}

// ─── Brands ──────────────────────────────────────────────────────────────

{
  const items = [
    { id: 'br1', createdAt: '2026-02-01T00:00:00Z', name: 'Zeta', productCount: 10 },
    { id: 'br2', createdAt: '2026-04-01T00:00:00Z', name: 'apex', productCount: 40 },
    { id: 'br3', createdAt: '2026-01-01T00:00:00Z', name: 'Milo', productCount: 25 },
  ];
  assertEqual('Brands: newest', ids(sortBy(BRAND_SORT_OPTIONS, 'newest', items)), ['br2', 'br1', 'br3']);
  assertEqual('Brands: az (locale/case-insensitive)', ids(sortBy(BRAND_SORT_OPTIONS, 'az', items)), [
    'br2',
    'br3',
    'br1',
  ]);
  assertEqual('Brands: za', ids(sortBy(BRAND_SORT_OPTIONS, 'za', items)), ['br1', 'br3', 'br2']);
  assertEqual('Brands: most_products', ids(sortBy(BRAND_SORT_OPTIONS, 'most_products', items)), [
    'br2',
    'br3',
    'br1',
  ]);

  const tied = [
    { id: 'x', createdAt: '2026-01-01T00:00:00Z', name: 'Same', productCount: 5 },
    { id: 'y', createdAt: '2026-01-02T00:00:00Z', name: 'Same', productCount: 5 },
  ];
  assertEqual(
    'Brands: most_products tie-break is stable',
    ids(sortBy(BRAND_SORT_OPTIONS, 'most_products', tied)),
    ['x', 'y'],
  );
}

// ─── Brand Detail catalog ────────────────────────────────────────────────

{
  const items = [
    { id: 'bd1', price: 800, discountPercent: 10 },
    { id: 'bd2', price: 200, discountPercent: 50 },
    { id: 'bd3', price: 500, discountPercent: 25 },
  ];
  assertEqual('Brand Detail: price_asc', ids(sortBy(BRAND_DETAIL_SORT_OPTIONS, 'price_asc', items)), [
    'bd2',
    'bd3',
    'bd1',
  ]);
  assertEqual('Brand Detail: price_desc', ids(sortBy(BRAND_DETAIL_SORT_OPTIONS, 'price_desc', items)), [
    'bd1',
    'bd3',
    'bd2',
  ]);
  assertEqual('Brand Detail: discount_desc', ids(sortBy(BRAND_DETAIL_SORT_OPTIONS, 'discount_desc', items)), [
    'bd2',
    'bd3',
    'bd1',
  ]);
  assertOk(
    'Brand Detail: no rating_desc option exists',
    !BRAND_DETAIL_SORT_OPTIONS.some((o) => o.id === 'rating_desc' || o.id === 'rating-desc'),
  );
}

// ─── Creators ────────────────────────────────────────────────────────────

{
  const items = [
    { id: 'cr1', createdAt: '2026-03-01T00:00:00Z', name: 'Zed', contentCount: 4 },
    { id: 'cr2', createdAt: '2026-05-01T00:00:00Z', name: 'anna', contentCount: 12 },
    { id: 'cr3', createdAt: '2026-01-01T00:00:00Z', name: 'Milo', contentCount: 7 },
  ];
  assertEqual('Creators: newest', ids(sortBy(CREATOR_SORT_OPTIONS, 'newest', items)), ['cr2', 'cr1', 'cr3']);
  assertEqual('Creators: az', ids(sortBy(CREATOR_SORT_OPTIONS, 'az', items)), ['cr2', 'cr3', 'cr1']);
  assertEqual('Creators: za', ids(sortBy(CREATOR_SORT_OPTIONS, 'za', items)), ['cr1', 'cr3', 'cr2']);
  assertEqual('Creators: most_content', ids(sortBy(CREATOR_SORT_OPTIONS, 'most_content', items)), [
    'cr2',
    'cr3',
    'cr1',
  ]);
  assertOk(
    'Creators: no rating/review/hot/featured option exists',
    !CREATOR_SORT_OPTIONS.some((o) =>
      ['rating', 'rating_desc', 'reviews', 'review_desc', 'hot', 'featured_only', 'popularity'].includes(o.id),
    ),
  );

  const tied = [
    { id: 'm', createdAt: '2026-01-01T00:00:00Z', name: 'Dup', contentCount: 3 },
    { id: 'n', createdAt: '2026-01-02T00:00:00Z', name: 'Dup', contentCount: 3 },
  ];
  assertEqual('Creators: most_content tie-break is stable', ids(sortBy(CREATOR_SORT_OPTIONS, 'most_content', tied)), [
    'm',
    'n',
  ]);
}

// ─── Categories ──────────────────────────────────────────────────────────

{
  const items = [
    { id: 'cat1', name: 'Zebra', count: 120 },
    { id: 'cat2', name: 'apple', count: 500 },
    { id: 'cat3', name: 'Mango', count: 300 },
  ];
  assertEqual('Categories: az', ids(sortBy(CATEGORY_SORT_OPTIONS, 'az', items)), ['cat2', 'cat3', 'cat1']);
  assertEqual('Categories: za', ids(sortBy(CATEGORY_SORT_OPTIONS, 'za', items)), ['cat1', 'cat3', 'cat2']);
  assertEqual('Categories: most_products', ids(sortBy(CATEGORY_SORT_OPTIONS, 'most_products', items)), [
    'cat2',
    'cat3',
    'cat1',
  ]);
  assertOk(
    'Categories: no newest/most-popular option exists',
    !CATEGORY_SORT_OPTIONS.some((o) => ['newest', 'oldest', 'most_popular', 'popularity'].includes(o.id)),
  );
}

// ─── Deals ───────────────────────────────────────────────────────────────

{
  const now = Date.parse('2026-06-01T00:00:00Z');
  const items = [
    { id: 'd1', createdAt: '2026-01-01T00:00:00Z', price: 700, discountPercent: 15, endsAt: now + 72 * 3600_000 },
    { id: 'd2', createdAt: '2026-04-01T00:00:00Z', price: 300, discountPercent: 60, endsAt: now + 2 * 3600_000 },
    { id: 'd3', createdAt: '2026-02-01T00:00:00Z', price: 500, discountPercent: 30, endsAt: null },
  ];
  assertEqual('Deals: ending_soon (null endsAt sinks last)', ids(sortBy(DEAL_SORT_OPTIONS, 'ending_soon', items)), [
    'd2',
    'd1',
    'd3',
  ]);
  assertEqual('Deals: newest', ids(sortBy(DEAL_SORT_OPTIONS, 'newest', items)), ['d2', 'd3', 'd1']);
  assertEqual('Deals: price_asc', ids(sortBy(DEAL_SORT_OPTIONS, 'price_asc', items)), ['d2', 'd3', 'd1']);
  assertEqual('Deals: price_desc', ids(sortBy(DEAL_SORT_OPTIONS, 'price_desc', items)), ['d1', 'd3', 'd2']);
  assertEqual('Deals: discount_desc (real dealDiscountPercent, not raw field)', ids(sortBy(DEAL_SORT_OPTIONS, 'discount_desc', items)), [
    'd2',
    'd3',
    'd1',
  ]);

  const tied = [
    { id: 'e', createdAt: '2026-01-01T00:00:00Z', price: 100, discountPercent: 20, endsAt: now + 3600_000 },
    { id: 'f', createdAt: '2026-01-02T00:00:00Z', price: 100, discountPercent: 20, endsAt: now + 3600_000 },
  ];
  assertEqual('Deals: price_asc tie-break is stable', ids(sortBy(DEAL_SORT_OPTIONS, 'price_asc', tied)), ['e', 'f']);
}

// ─── Default-option pass-through sanity check ───────────────────────────

{
  // The default/"Featured" option must have NO comparator — applySortOption
  // must call applyDefault(items) unmodified (proving the page's existing
  // rank*() is what runs, not a registry comparator).
  const items = [{ id: 'z' }, { id: 'y' }, { id: 'x' }];
  let defaultCalled = false;
  const out = applySortOption(
    items,
    PRODUCT_SORT_OPTIONS,
    'featured',
    'featured',
    (list) => {
      defaultCalled = true;
      return list;
    },
    (x) => x as unknown as { createdAt?: string; price: number },
  );
  assertOk('Default option ("featured") delegates to applyDefault()', defaultCalled);
  assertEqual('Default option leaves item order untouched by the registry', ids(out as { id: string }[]), [
    'z',
    'y',
    'x',
  ]);
  assertOk(
    'PRODUCT_SORT_OPTIONS default entry has no comparator',
    PRODUCT_SORT_OPTIONS.find((o) => o.id === 'featured')?.comparator === undefined,
  );
}

// ─── Summary ─────────────────────────────────────────────────────────────

console.log(`\n${pass} passed, ${fail} failed, ${pass + fail} total`);
if (fail > 0) {
  process.exit(1);
}
