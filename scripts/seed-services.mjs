/**
 * Dev helper: summarize local service seed listings and booking reset steps.
 * Listings are baked into `src/data/mockServiceListings.ts` and auto-merged
 * into the product catalog during `npm run dev` — no UI activation.
 *
 * Usage: npm run seed:services
 */

const LISTINGS = [
  { id: 9101, category: 'hotels', title: '[TEST] Riverside Deluxe Suite — Gulshan' },
  { id: 9102, category: 'hotels', title: '[TEST] Cox’s Bazar Garden Cottage' },
  { id: 9103, category: 'doctors', title: '[TEST] Dr. Nabila Rahman — Cardiology Consult' },
  { id: 9104, category: 'doctors', title: '[TEST] Dr. Arif Hossain — Dermatology Clinic' },
  { id: 9105, category: 'beauty', title: '[TEST] Bridal Glow Makeup Package' },
  { id: 9106, category: 'beauty', title: '[TEST] Deep Tissue Spa Therapy (90 min)' },
];

console.log(`
Choosify local service seed
===========================
Source: src/data/mockServiceListings.ts
Mode:   Auto-injected in DEV via GlobalStateContext (no UI panel)

${LISTINGS.length} listings:
${LISTINGS.map((l) => `  • ${l.id}  [${l.category}]  ${l.title}`).join('\n')}

Browse:
  /products
  /products?service=hotels
  /products?service=doctors
  /products?service=beauty
  /products?q=%5BTEST%5D

Detail pages:
  /products/9101 … /products/9106

Reset booking threads / orders (browser console, then reload):
  localStorage.removeItem('choosify_threads');
  localStorage.removeItem('choosify_thread_messages');
  localStorage.removeItem('choosify_orders');
  localStorage.removeItem('choosify_notifications');
`);
