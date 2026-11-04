/**
 * Word-aware text matching for storefront search. A searched word is never matched from the
 * middle of another word ("ring" must not match "Tailoring", "pet" must not match "carpet").
 *
 * - wordStartMatch: every searched word starts a word of the text (for names and titles, so a
 *   partly typed brand name like "aaro" still finds "Aarong").
 * - wholeWordMatch: every searched word IS a word of the text, singular/plural alike ("shoe" ↔
 *   "Shoes", "accessory" ↔ "Accessories") — for categories, tags and descriptions.
 */

/** \p{M} keeps Bangla vowel signs inside a word (জুতা is one word). */
export const searchWords = (value: unknown): string[] =>
  typeof value === 'string'
    ? value
        .toLowerCase()
        .split(/[^\p{L}\p{M}\p{N}]+/u)
        .filter(Boolean)
    : [];

const singular = (w: string): string =>
  w
    .replace(/ies$/, 'y')
    .replace(/(sses|shes|ches|xes)$/, (m) => m.slice(0, -2))
    .replace(/(?<!s)s$/, '');

const sameWord = (a: string, b: string) => a === b || singular(a) === singular(b);

export function wholeWordMatch(text: unknown, query: string): boolean {
  const q = searchWords(query);
  if (!q.length) return false;
  const t = searchWords(text);
  return q.every((w) => t.some((x) => sameWord(x, w)));
}

export function wordStartMatch(text: unknown, query: string): boolean {
  const q = searchWords(query);
  if (!q.length) return false;
  const t = searchWords(text);
  return q.every((w) => t.some((x) => x.startsWith(w) || sameWord(x, w)));
}
