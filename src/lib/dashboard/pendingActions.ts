import type { Order, ReturnRequest } from '../../types/schemas';
import type { SavedPaymentMethod } from '../../types/paymentMethods';

const CANCELLATIONS_SEEN_KEY = 'choosify_cancellations_seen_ids';
const RETURNS_KEY = 'choosify_return_requests';
const PAYMENT_METHODS_KEY = 'choosify_payment_methods';

export function readJsonArray<T>(key: string): T[] {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function writeJsonArray<T>(key: string, value: T[]) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* ignore quota */
  }
}

export function loadReturnRequests(): ReturnRequest[] {
  return readJsonArray<ReturnRequest>(RETURNS_KEY);
}

export function saveReturnRequests(rows: ReturnRequest[]) {
  writeJsonArray(RETURNS_KEY, rows);
}

export function loadPaymentMethods(): SavedPaymentMethod[] {
  return readJsonArray<SavedPaymentMethod>(PAYMENT_METHODS_KEY);
}

export function savePaymentMethods(rows: SavedPaymentMethod[]) {
  writeJsonArray(PAYMENT_METHODS_KEY, rows);
}

export function loadSeenCancellationIds(): Set<string> {
  return new Set(readJsonArray<string>(CANCELLATIONS_SEEN_KEY));
}

export function markCancellationsSeen(orderIds: string[]) {
  const next = loadSeenCancellationIds();
  orderIds.forEach((id) => next.add(id));
  writeJsonArray(CANCELLATIONS_SEEN_KEY, [...next]);
}

/** Unpaid booking/order payments still within (or without) the due window. */
export function isPendingToPay(order: Order, now = Date.now()): boolean {
  if (order.status !== 'pending_payment') return false;
  if (!order.paymentDueAt) return true;
  return new Date(order.paymentDueAt).getTime() > now;
}

/** Active return = awaiting seller/admin action or approved & in progress. */
export function isActiveReturn(row: ReturnRequest): boolean {
  return row.status === 'pending' || row.status === 'approved';
}

/**
 * Cancellations Overview: only recent, unacknowledged cancellations.
 * Historical/processed cancellations remain in the sidebar list forever,
 * but drop off Overview after the user opens My Cancellations (or after 14 days).
 */
export function isPendingCancellationOverview(
  order: Order,
  seenIds: Set<string>,
  now = Date.now(),
): boolean {
  if (order.status !== 'cancelled' && !order.cancelledAt) return false;
  if (seenIds.has(order.orderId)) return false;
  const cancelledAt = order.cancelledAt || order.createdAt;
  const ageMs = now - new Date(cancelledAt).getTime();
  const fourteenDays = 14 * 24 * 60 * 60 * 1000;
  return Number.isFinite(ageMs) && ageMs <= fourteenDays;
}

/** Payment Options Overview: method needs verification or is expired/expiring. */
export function paymentMethodNeedsAttention(method: SavedPaymentMethod): boolean {
  return (
    method.status === 'pending_verification' ||
    method.status === 'expiring_soon' ||
    method.status === 'expired'
  );
}

export function getPendingToPayOrders(orders: Order[]): Order[] {
  return orders.filter((o) => isPendingToPay(o));
}

export function getCancelledOrders(orders: Order[]): Order[] {
  return orders.filter((o) => o.status === 'cancelled' || !!o.cancelledAt);
}

export function getPendingCancellationOrders(orders: Order[]): Order[] {
  const seen = loadSeenCancellationIds();
  return getCancelledOrders(orders).filter((o) =>
    isPendingCancellationOverview(o, seen),
  );
}

export function getActiveReturns(returns: ReturnRequest[]): ReturnRequest[] {
  return returns.filter(isActiveReturn);
}

export function getAttentionPaymentMethods(
  methods: SavedPaymentMethod[],
): SavedPaymentMethod[] {
  return methods.filter(paymentMethodNeedsAttention);
}

export function seedDefaultPaymentMethodsIfEmpty(): SavedPaymentMethod[] {
  const existing = loadPaymentMethods();
  if (existing.length > 0) return existing;
  const seeded: SavedPaymentMethod[] = [
    {
      id: 'pm-card-1',
      kind: 'card',
      label: 'Visa ending 4242',
      maskedAccount: '•••• 4242',
      brand: 'Visa',
      expiryMonth: 8,
      expiryYear: 2027,
      isDefault: true,
      status: 'ok',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'pm-bkash-1',
      kind: 'bkash',
      label: 'bKash Personal',
      maskedAccount: '01XXX-XXX789',
      status: 'ok',
      createdAt: new Date().toISOString(),
    },
  ];
  savePaymentMethods(seeded);
  return seeded;
}
