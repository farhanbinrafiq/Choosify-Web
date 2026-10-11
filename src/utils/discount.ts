/** Exact discount between an original and a sale price, in percent (0 when there is none). */
export function discountPercent(price: number, original: number): number {
  if (!(original > 0) || !(price >= 0) || original <= price) return 0;
  return ((original - price) / original) * 100;
}

/**
 * Discount % for labels: two decimals, trailing zeros dropped —
 * 55,000 → 45,000 is "18.18", 50,000 → 40,000 is "20".
 */
export function formatDiscountPercent(pct: number): string {
  const rounded = Math.round(pct * 100) / 100;
  return String(rounded);
}
