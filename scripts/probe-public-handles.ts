/**
 * Deterministic probe for lib/publicHandles.ts — public handle format,
 * normalization, reserved names (Public Identity Phase B) and reserved catalog-id
 * prefixes (Phase C).
 *
 * Pure / in-memory only (reads src/App.tsx to keep the reserved list in step
 * with the storefront route table). Run with `npm run test:public-handles`.
 */
import { readFileSync } from 'node:fs';
import {
  HANDLE_MAX_LENGTH,
  HANDLE_MIN_LENGTH,
  HANDLE_PATTERN,
  RESERVED_HANDLES,
  RESERVED_HANDLE_PREFIXES,
  hasReservedPrefix,
  isReservedHandle,
  normalizeHandle,
  validateHandle,
} from '../lib/publicHandles';

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

const result = (input: string) => {
  const r = validateHandle(input);
  return 'reason' in r ? { ok: false, handle: r.handle, reason: r.reason } : { ok: true, handle: r.handle };
};

// ── Normalization ──
assertEqual('normalize: trims, strips one leading @, lowercases', normalizeHandle('  @Samsung  '), 'samsung');
assertEqual('normalize: only one leading @ removed', normalizeHandle('@@artveen'), '@artveen');
assertEqual('normalize: case-insensitive equivalence', [normalizeHandle('Farhan'), normalizeHandle('FARHAN'), normalizeHandle('farhan')], ['farhan', 'farhan', 'farhan']);

// ── Valid handles ──
for (const good of ['samsung', 'artveen', 'farhan-bin-rafiq', 'tech-talks-bd', 'a1b', 'brand2026', 'x-1-y', 'abcdefghij-abcdefghij-abcdefgh']) {
  assertEqual(`valid: ${good}`, result(good), { ok: true, handle: good });
}
assertEqual('valid after normalization: @Artveen', result('@Artveen'), { ok: true, handle: 'artveen' });
assertEqual('length bounds are 3..30', [HANDLE_MIN_LENGTH, HANDLE_MAX_LENGTH], [3, 30]);

// ── Invalid handles (same set the database CHECK constraint rejects) ──
const invalid: Array<[string, string]> = [
  ['', 'empty'],
  ['   ', 'empty'],
  ['ab', 'too_short'],
  ['abcdefghij-abcdefghij-abcdefghi', 'too_long'],
  ['1brand', 'must_start_with_letter'],
  ['-brand', 'leading_or_trailing_hyphen'],
  ['brand-', 'leading_or_trailing_hyphen'],
  ['bra--nd', 'consecutive_hyphens'],
  ['bra nd', 'invalid_characters'],
  ['bra_nd', 'invalid_characters'],
  ['brand.bd', 'invalid_characters'],
  ['brand/x', 'invalid_characters'],
  ['café', 'non_ascii'],
  ['ব্র্যান্ড', 'non_ascii'],
  ['ｓａｍｓｕｎｇ', 'non_ascii'],
  ['sаmsung', 'non_ascii'], // Cyrillic "а" homoglyph
];
for (const [input, reason] of invalid) {
  const r = result(input);
  assertOk(`invalid: ${JSON.stringify(input)} → ${reason}`, r.ok === false && (r as { reason: string }).reason === reason, JSON.stringify(r));
}
assertOk('every accepted handle matches the DB CHECK pattern', ['samsung', 'farhan-bin-rafiq', 'a1b'].every((h) => HANDLE_PATTERN.test(h)));
assertOk('DB CHECK pattern rejects what the validator rejects', ['1brand', '-brand', 'brand-', 'bra--nd', 'bra_nd', 'Samsung'].every((h) => !HANDLE_PATTERN.test(h)));

// ── Reserved names ──
assertEqual('reserved: products', result('products'), { ok: false, handle: 'products', reason: 'reserved' });
assertEqual('reserved after normalization: @Admin', result('@Admin'), { ok: false, handle: 'admin', reason: 'reserved' });
for (const word of ['products', 'brands', 'creators', 'spotlight', 'publisher', 'categories', 'compare', 'search', 'cart', 'checkout', 'advertise', 'admin', 'api']) {
  assertOk(`reserved (required): ${word}`, isReservedHandle(word));
}
assertOk('"account" is NOT reserved (no route or security justification found)', !isReservedHandle('account'));
assertOk('every reserved entry has a justification', Object.values(RESERVED_HANDLES).every((why) => ['route', 'dashboard', 'security'].includes(why)));
assertOk('reserved list keys are already normalized', Object.keys(RESERVED_HANDLES).every((k) => k === normalizeHandle(k)));

// ── Reserved catalog-id prefixes (Phase C) ──
assertEqual('reserved prefixes are exactly brand-, creator-, prod-', [...RESERVED_HANDLE_PREFIXES], ['brand-', 'creator-', 'prod-']);
for (const id of ['brand-apple', 'brand-samsung', 'brand-cb4ec847-ee87-4184-8659', 'creator-farhan', 'creator-1790540879009', 'prod-12']) {
  assertEqual(`reserved prefix: ${id}`, result(id), { ok: false, handle: id, reason: 'reserved_prefix' });
}
assertEqual('reserved prefix after normalization: @Brand-Samsung', result('@Brand-Samsung'), { ok: false, handle: 'brand-samsung', reason: 'reserved_prefix' });
for (const near of ['brands-hub', 'creators-club', 'product-lab', 'prodigy', 'brandx', 'brand2026', 'my-brand-shop', 'my-creator-page']) {
  assertEqual(`not a reserved prefix: ${near}`, result(near), { ok: true, handle: near });
}
assertEqual('a reserved name wins over a reserved prefix: brand-deals', result('brand-deals'), { ok: false, handle: 'brand-deals', reason: 'reserved' });
assertEqual('a bare prefix is still a hyphen error: brand-', result('brand-'), { ok: false, handle: 'brand-', reason: 'leading_or_trailing_hyphen' });
assertOk('no reserved name except brand-deals carries a reserved prefix', Object.keys(RESERVED_HANDLES).filter(hasReservedPrefix).join() === 'brand-deals');

// ── Shared contract vectors (byte-identical copy in Admin shared/publicHandles/vectors.json) ──
type Vectors = {
  minLength: number;
  maxLength: number;
  pattern: string;
  accept: Array<{ input: string; handle: string }>;
  reject: Array<{ input: string; handle: string; reason: string }>;
  reservedPrefixes: string[];
  reserved: Record<string, string>;
};
const vectors = JSON.parse(readFileSync('lib/publicHandleVectors.json', 'utf8')) as Vectors;
assertEqual('vectors: length bounds match', [vectors.minLength, vectors.maxLength], [HANDLE_MIN_LENGTH, HANDLE_MAX_LENGTH]);
assertEqual('vectors: pattern matches HANDLE_PATTERN', vectors.pattern, HANDLE_PATTERN.source);
for (const v of vectors.accept) assertEqual(`vector accept ${JSON.stringify(v.input)}`, result(v.input), { ok: true, handle: v.handle });
for (const v of vectors.reject) assertEqual(`vector reject ${JSON.stringify(v.input)}`, result(v.input), { ok: false, handle: v.handle, reason: v.reason });
assertEqual('vectors: reserved prefixes identical', [...RESERVED_HANDLE_PREFIXES], vectors.reservedPrefixes);
assertEqual('vectors: reserved list (names + justification) identical', Object.entries(RESERVED_HANDLES).sort(), Object.entries(vectors.reserved).sort());

// Every top-level storefront route must be reserved, so a handle URL can never shadow one.
const app = readFileSync('src/App.tsx', 'utf8');
const topLevel = [...new Set([...app.matchAll(/path="\/([^"/:]+)/g)].map((m) => m[1].toLowerCase()))];
const missing = topLevel.filter((seg) => !isReservedHandle(seg));
assertOk(`all ${topLevel.length} top-level storefront routes are reserved`, topLevel.length > 30 && missing.length === 0, `missing: ${missing.join(', ')}`);
for (const sys of ['api', 'assets', 'icons', 'fonts', 'hero', 'brand']) {
  assertOk(`server/static path reserved: ${sys}`, isReservedHandle(sys));
}

console.log(`\n${fail === 0 ? 'PASS' : 'FAIL'} probe-public-handles (${pass} passed, ${fail} failed)`);
process.exit(fail === 0 ? 0 : 1);
