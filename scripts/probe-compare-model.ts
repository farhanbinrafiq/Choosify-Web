/**
 * Compare model probe — `npm run test:compare-model`.
 *
 * Locks the Compare engine's data-integrity rules (src/components/compare/compareModel.ts):
 *  - columns carry only values present on the real record (missing → undefined, never a default)
 *  - scores come only from real ratings / stored scores; no rating → no score
 *  - winner = highest valid score; ties and missing data are reported, never invented
 *  - decision profiles rank the current selection and never add subjects
 *  - Emi facts quote only selected subjects' values
 *  - share links carry only the active mode + selected ids
 */
import {
  DECISION_PROFILES,
  brandColumn,
  compareShareUrl,
  creatorColumn,
  decideWinner,
  emiFacts,
  guideColumn,
  parseCompareQuery,
  productColumn,
  reviewStats,
  verdictText,
} from '../src/components/compare/compareModel';

let pass = 0;
const fails: string[] = [];
const check = (c: unknown, label: string, detail?: unknown) => {
  if (c) pass++;
  else fails.push(label);
  console.log(c ? 'PASS' : 'FAIL', label, c ? '' : JSON.stringify(detail ?? ''));
};

// Products
const bare = productColumn({ id: 'p1', title: 'Bare Phone', price: 10000, stock: 3 }, { creatorGuideCount: 0, href: '/products/p1' });
check(bare.score === null && bare.rating === null, 'product without reviews has no score / rating', bare);
check(bare.values.warranty === undefined && bare.values.originalPrice === undefined, 'missing warranty / original price stay empty (no defaults)');
check(bare.values.availability === 'In stock' && bare.values.deal === 'No active deal', 'availability and deal come from the record');
check(!Object.values(bare.values).some((v) => /Excellent|Premium|90\/100|M-XXL|Cotton|1 Year/.test(String(v))), 'no prototype spec values');
const oos = productColumn({ id: 'p2', title: 'Gone', price: 5000, stock: 0 }, { creatorGuideCount: 0, href: '' });
check(oos.values.availability === 'Out of stock' && oos.flags.inStock === false, 'zero stock is reported as out of stock');

const stats = reviewStats([{ rating: 5 }, { rating: 4 }, { rating: 4 }]);
check(stats?.average === 4.3 && stats.count === 3, 'review stats average real ratings', stats);
check(reviewStats([])?.count === 0 && reviewStats([])?.average === null, 'no reviews → count 0, no average');
check(reviewStats(undefined) === undefined, 'reviews not loaded → unknown (not "0")');

const a = productColumn({ id: 'a', title: 'A', price: 20000 }, { stats: { average: 4.6, count: 10 }, creatorGuideCount: 1, href: '' });
const b = productColumn({ id: 'b', title: 'B', price: 15000 }, { stats: { average: 4.0, count: 4 }, creatorGuideCount: 0, href: '' });
const c = productColumn({ id: 'c', title: 'C', price: 9000 }, { stats: { average: null, count: 0 }, creatorGuideCount: 0, href: '' });
check(a.score === 9.2 && b.score === 8, 'existing rule: score = rating × 2 on a 10-point scale', [a.score, b.score]);
const ownScore = productColumn({ id: 'o', title: 'O', score: 7.5 }, { stats: { average: 4.9, count: 2 }, creatorGuideCount: 0, href: '' });
check(ownScore.score === 7.5, 'a catalog-provided product score is used as-is');

// Winner
const w = decideWinner([a, b, c], 'product');
check(w.kind === 'winner' && w.column.id === 'a', 'winner = highest valid score', w);
check(decideWinner([a], 'product').kind === 'insufficient', 'one subject → no winner');
check(decideWinner([a, c], 'product').kind === 'insufficient', 'only one scored subject → not enough data');
const tieB = productColumn({ id: 'b2', title: 'B2' }, { stats: { average: 4.6, count: 1 }, creatorGuideCount: 0, href: '' });
const tie = decideWinner([a, tieB], 'product');
check(tie.kind === 'tie' && tie.columns.length === 2, 'equal top scores are reported as a tie', tie);
check(/tied/.test(verdictText(tie)), 'tie verdict says it is a tie');
check(decideWinner([guideColumn({ id: 'g1', title: 'G' }, { authorName: '', href: '' }), guideColumn({ id: 'g2', title: 'H' }, { authorName: '', href: '' })], 'guide').kind === 'unscored', 'guides are never given a winner');
check(verdictText(w).startsWith('A leads with 9.2/10'), 'verdict names the real winner and score', verdictText(w));
const w2 = decideWinner([b, c, productColumn({ id: 'd', title: 'D' }, { stats: { average: 4.8, count: 2 }, creatorGuideCount: 0, href: '' })], 'product');
check(w2.kind === 'winner' && w2.column.id === 'd', 'winner recalculates when the selection changes');

// Profiles never add subjects
const sel = [a, b, c];
for (const p of DECISION_PROFILES.product) {
  const pick = p.pick?.(sel);
  check(!pick || sel.includes(pick), `profile "${p.label}" only picks from the selection`);
}
check(DECISION_PROFILES.product.find((p) => p.id === 'best-budget')!.pick!(sel)?.id === 'c', 'Best Budget = lowest price in the selection');
check(DECISION_PROFILES.product.find((p) => p.id === 'best-value')!.pick!(sel)?.id === 'b', 'Best Value = best score per taka (scored + priced only)');
check(DECISION_PROFILES.product.find((p) => p.id === 'best-premium')!.pick!(sel)?.id === 'a', 'Best Premium = highest-priced with at least average score');
check(DECISION_PROFILES.product.find((p) => p.id === 'best-value')!.pick!([c]) === null, 'no data → no pick (never invented)');

// Brands / creators
const br = brandColumn({ id: 7, catalogId: 'brand-x', name: 'X', logo: 'XX', ratings: 0, followers: 3, verifiedStatus: false }, { productCount: 2, minPrice: 100, maxPrice: 300, creatorGuideCount: 0, href: '' });
check(br.id === 'brand-x' && br.score === null && br.values.rating === 'Not rated yet', 'unrated brand has no score');
check(br.image === '', 'initials placeholder is not treated as a logo image');
check(br.values.priceRange === '৳100 – ৳300', 'brand price range from its real products');
const cr = creatorColumn({ id: 'c1', name: 'Rifat', score: 0, followers: { YouTube: '0' } }, { liveGuideCount: 0, href: '' });
check(cr.score === null && cr.values.followers === 'Not recorded', 'creator without trust score / followers shows that honestly');
check(creatorColumn({ id: 'c2', name: 'S', score: 90 }, { liveGuideCount: 0, href: '' }).score === 9, 'creator 0–100 trust score → 0–10');

// Emi
const facts = emiFacts([a, b, c], 'product');
check(facts.length > 0 && facts.every((f) => /\b(A|B|C)\b/.test(f)), 'Emi facts only mention selected subjects', facts);
check(emiFacts([a], 'product').length === 0, 'Emi needs two or more subjects');
check(!facts.some((f) => /confidence|%\s*match/i.test(f)), 'Emi facts carry no invented confidence');

// Share
const url = compareShareUrl('https://x.test', 'brand', ['b1', 'b2']);
check(url === 'https://x.test/compare?mode=brand&ids=b1%2Cb2', 'share URL = mode + selected ids only', url);
const parsed = parseCompareQuery('?mode=creator&ids=a,b,a,,c,d,e');
check(parsed.mode === 'creator' && parsed.ids.join() === 'a,b,c,d', 'shared link parses mode and de-duplicated, capped ids', parsed);
check(parseCompareQuery('?mode=evil').mode === null, 'unknown mode in a link is ignored');

console.log(`\n=== ${pass} passed, ${fails.length} failed ===`);
if (fails.length) process.exit(1);
