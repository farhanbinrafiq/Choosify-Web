/**
 * Lightweight client-side sanity check for a Bangladesh mobile number, mirroring
 * choosify-admin-4.0's src/lib/identityNormalizeClient.ts isPlausibleBdPhone (the
 * two repos can't share code directly). Used to keep the checkout shipping
 * "Phone" field semantically distinct from free-text fields like "Delivery
 * Address" -- without this, nothing stopped a customer from leaving any
 * arbitrary string (including a pasted address) in the phone input, since the
 * checkout submit handler only checked that the field was non-empty.
 */
export function normalizeBdPhone(raw: string): string {
  let d = String(raw || '').replace(/[^\d]/g, '');
  if (!d) return '';
  if (d.startsWith('880')) d = d.slice(3);
  if (d.length === 11 && d.startsWith('01')) return d;
  if (d.length === 10 && d.startsWith('1')) return `0${d}`;
  return '';
}

export function isPlausibleBdPhone(raw: string): boolean {
  return /^01[3-9]\d{8}$/.test(normalizeBdPhone(raw));
}
