import type { Order } from '../../types/schemas';

/** Stable demo order ids so seed is idempotent across reloads. */
export const DEMO_PHYSICAL_ORDER_ID = 'ORD-DEMO-PHYSICAL';
export const DEMO_SERVICE_ORDER_ID = 'ORD-DEMO-SERVICE';

/** Bangladesh calendar date (YYYY-MM-DD) for today / offset days. */
function bangladeshYmd(offsetDays = 0): string {
  const ms = Date.now() + offsetDays * 24 * 60 * 60 * 1000;
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Dhaka',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(new Date(ms));
  const y = parts.find((p) => p.type === 'year')?.value;
  const m = parts.find((p) => p.type === 'month')?.value;
  const d = parts.find((p) => p.type === 'day')?.value;
  return `${y}-${m}-${d}`;
}

export function buildDemoExpiryOrders(): Order[] {
  const todayBd = bangladeshYmd(0);
  return [
    {
      orderId: DEMO_PHYSICAL_ORDER_ID,
      buyerId: 'user-standard',
      isCOD: false,
      isSplit: false,
      overallTotal: 129000,
      status: 'active',
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      subOrders: [
        {
          sellerId: 'apple',
          sellerBusinessName: 'Apple Retail BD',
          deliveryFee: 80,
          invoiceId: 'INV-DEMO-APPLE',
          trackingStatus: 'pending',
          items: [
            {
              productId: 1,
              productTitle: 'iPhone 15 Pro',
              quantity: 1,
              price: 129000,
              productType: 'physical',
            },
          ],
        },
      ],
    },
    {
      orderId: DEMO_SERVICE_ORDER_ID,
      buyerId: 'user-standard',
      isCOD: false,
      isSplit: false,
      overallTotal: 18500,
      status: 'confirmed',
      createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      subOrders: [
        {
          sellerId: 'panorama-hotel',
          sellerBusinessName: 'Panorama Hotel Dhaka',
          deliveryFee: 0,
          invoiceId: 'INV-DEMO-HOTEL',
          trackingStatus: 'pending',
          items: [
            {
              productId: 9001,
              productTitle: 'Deluxe Room — 1 Night',
              quantity: 1,
              price: 18500,
              productType: 'service',
              serviceCategory: 'hotels',
              // Closes 11:59 PM BD today → urgent “closes in X hours” while still open.
              serviceDetails: { checkOutDate: todayBd },
            },
          ],
        },
      ],
    },
  ];
}

/** Ensure demo expiry orders exist (does not remove user orders). */
export function ensureDemoExpiryOrders(existing: Order[]): Order[] {
  const demos = buildDemoExpiryOrders();
  let next = existing.slice();
  let changed = false;
  for (const demo of demos) {
    const idx = next.findIndex((o) => o.orderId === demo.orderId);
    if (idx === -1) {
      next = [demo, ...next];
      changed = true;
    } else {
      // Refresh service checkout date so the urgent window stays valid across days.
      next[idx] = demo;
      changed = true;
    }
  }
  return changed ? next : existing;
}
