/**
 * Local DEV mock service listings for Hotels / Doctors / Beauty booking E2E tests.
 *
 * Where: `src/data/mockServiceListings.ts`
 * How:   Merged into `allProducts` / brands / sellers / product details in
 *        GlobalStateContext whenever `import.meta.env.DEV` is true.
 *        No UI toggle — listings appear like any other product on `/products`.
 *
 * Identify: Titles prefixed `[TEST]`. Brand = "[TEST] Choosify Services".
 *           Seller id = `seller-test-services`. Product ids = 9101–9106.
 *
 * Terminal: `npm run seed:services` — prints seed summary + how to clear
 *           booking localStorage keys used while testing.
 */

import type { Brand, CommerceProduct, Seller } from '../types/schemas';
import type { CatalogProductDetail } from '../types/catalog';
import type { WhatsNearbyData, BeforeYourVisitData } from '../types/listingRelatedInfo';

/** High ids to avoid colliding with mock catalog (1–12) or typical API numeric ids. */
export const TEST_SERVICE_BRAND_ID = 9001;
export const TEST_SERVICE_SELLER_ID = 'seller-test-services';
export const TEST_SERVICE_USER_ID = 'usr-test-services';
export const TEST_SERVICE_PRODUCT_IDS = [9101, 9102, 9103, 9104, 9105, 9106] as const;

export type SeedCommerceProduct = CommerceProduct & {
  catalogId: string;
  brandName?: string;
  categoryName?: string;
  images?: string[];
  /** Complimentary features / amenities (maps to Box Content / Complimentary Features) */
  complimentaryFeatures?: string[];
  /** Property / clinic / salon specs (maps to Physical Specs / Property Specs) */
  propertySpecs?: string[];
  specs?: Array<{ label: string; value: string } | { key: string; value: string }>;
  location?: string;
  duration?: string;
  specialty?: string;
  whatsNearby?: WhatsNearbyData;
  beforeYourVisit?: BeforeYourVisitData;
};

/** Seed is always on in local `npm run dev`; never in production builds. */
export function isServiceSeedEnabled(): boolean {
  return Boolean(import.meta.env.DEV);
}

export const TEST_SERVICE_SELLER: Seller = {
  id: TEST_SERVICE_SELLER_ID,
  userId: TEST_SERVICE_USER_ID,
  businessName: '[TEST] Choosify Services Co.',
  licenseNo: 'TR-TEST-SVC-9001',
  verificationDocs: ['TestTradeLicense.pdf'],
  ratings: 4.9,
  logistics: {
    provider: 'Local service fulfillment',
    supportedRegions: ['Dhaka', 'Chittagong'],
  },
  sponsoredStatus: false,
  disputeHistory: { totalDisputes: 0, resolvedDisputes: 0 },
};

export const TEST_SERVICE_BRAND: Brand = {
  id: TEST_SERVICE_BRAND_ID,
  catalogId: 'brand-test-services',
  slug: 'test-choosify-services',
  name: '[TEST] Choosify Services',
  logo: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=200&h=200&fit=crop',
  verifiedStatus: true,
  followers: 1280,
  ratings: 4.9,
  sponsoredFlag: false,
  featuredFlag: true,
  category: 'Services',
  claimStatus: 'verified',
};

const hotelImages = [
  'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=600&fit=crop',
  'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&h=600&fit=crop',
  'https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=800&h=600&fit=crop',
];

const doctorImages = [
  'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=800&h=600&fit=crop',
  'https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=800&h=600&fit=crop',
];

const beautyImages = [
  'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800&h=600&fit=crop',
  'https://images.unsplash.com/photo-1519823551278-64ac92734fb1?w=800&h=600&fit=crop',
];

export const TEST_SERVICE_PRODUCTS: SeedCommerceProduct[] = [
  {
    id: 9101,
    catalogId: 'test-svc-hotel-riverside-suite',
    slug: 'test-hotel-riverside-deluxe-suite',
    title: '[TEST] Riverside Deluxe Suite — Gulshan',
    image: hotelImages[0],
    images: hotelImages,
    brand: TEST_SERVICE_BRAND.name,
    brandName: TEST_SERVICE_BRAND.name,
    brandId: TEST_SERVICE_BRAND_ID,
    sellerId: TEST_SERVICE_SELLER_ID,
    price: 12500,
    originalPrice: 15000,
    discountPercent: 17,
    stock: 8,
    codSupport: false,
    rating: 4.8,
    category: 'Hotels & Stays',
    categoryName: 'Hotels & Stays',
    productType: 'service',
    serviceCategory: 'hotels',
    location: 'Road 55, Gulshan 2, Dhaka',
    description:
      'Spacious hotel suite with river-facing balcony, king bed, and complimentary breakfast. Ideal for testing hotel Message to Book nights/guests/check-in fields.',
    complimentaryFeatures: [
      'Daily breakfast for 2',
      'Airport pickup (one way)',
      'High-speed Wi‑Fi',
      'Evening welcome drink',
      'Access to rooftop pool & gym',
    ],
    propertySpecs: [
      'Room size: 42 m²',
      'Bed: 1× King',
      'Max occupancy: 3 guests',
      'View: Riverside',
      'Check-in from 14:00 · Check-out by 12:00',
      'Location: Gulshan 2, Dhaka',
    ],
    specs: [
      { label: 'Property', value: 'Riverside Boutique Hotel' },
      { label: 'Room type', value: 'Deluxe Suite' },
      { label: 'Price', value: 'BDT 12,500 / night' },
      { label: 'Location', value: 'Gulshan 2, Dhaka' },
      { label: 'Max guests', value: '3' },
      { label: 'Cancellation', value: 'Free until 24h before check-in' },
    ],
    featuredFlag: true,
    tags: ['hotel', 'suite', 'hospitality', 'stay', 'TEST'],
    whatsNearby: {
      restaurant_cafe: [
        { name: 'Gulshan Society Cafe', distance: '350 m' },
        { name: 'Spice Route Kitchen', distance: '600 m' },
      ],
      entertainment_attraction: [{ name: 'Gulshan Lake Park', distance: '500 m' }],
      hospital_police: [{ name: 'United Hospital Emergency', distance: '1.2 km' }],
      transport_airport: [{ name: 'Hazrat Shahjalal Airport', distance: '12 km' }],
      shopping_atm: [
        { name: 'Gulshan 1 Circle ATM', distance: '200 m' },
        { name: 'Unimart Gulshan', distance: '450 m' },
      ],
    },
  },
  {
    id: 9102,
    catalogId: 'test-svc-hotel-cox-cottage',
    slug: 'test-hotel-cox-bazar-garden-cottage',
    title: '[TEST] Cox’s Bazar Garden Cottage',
    image: hotelImages[1],
    images: [hotelImages[1], hotelImages[2]],
    brand: TEST_SERVICE_BRAND.name,
    brandName: TEST_SERVICE_BRAND.name,
    brandId: TEST_SERVICE_BRAND_ID,
    sellerId: TEST_SERVICE_SELLER_ID,
    price: 8900,
    stock: 5,
    codSupport: false,
    rating: 4.6,
    category: 'Hotels & Stays',
    categoryName: 'Hotels & Stays',
    productType: 'service',
    serviceCategory: 'hotels',
    location: 'Kolatoli Beach Road, Cox’s Bazar',
    description:
      'Private garden cottage near the beach with AC, outdoor seating, and resort amenities. Second hotel listing for filter/list testing.',
    complimentaryFeatures: [
      'Welcome fruit basket',
      'Beach towels',
      'Complimentary tea & coffee',
      'Late checkout (subject to availability)',
    ],
    propertySpecs: [
      'Cottage size: 28 m²',
      'Bed: 1× Queen + daybed',
      'Max occupancy: 2 adults + 1 child',
      'Distance to beach: 400 m',
      'Location: Cox’s Bazar',
    ],
    specs: [
      { label: 'Property', value: 'Garden Resort Cottages' },
      { label: 'Room type', value: 'Garden Cottage' },
      { label: 'Price', value: 'BDT 8,900 / night' },
      { label: 'Location', value: 'Cox’s Bazar' },
      { label: 'Amenities', value: 'AC, Wi‑Fi, private patio' },
    ],
    tags: ['hotel', 'resort', 'cottage', 'stay', 'TEST'],
  },
  {
    id: 9103,
    catalogId: 'test-svc-doctor-cardio',
    slug: 'test-doctor-dr-nabila-cardiology',
    title: '[TEST] Dr. Nabila Rahman — Cardiology Consult',
    image: doctorImages[0],
    images: doctorImages,
    brand: TEST_SERVICE_BRAND.name,
    brandName: TEST_SERVICE_BRAND.name,
    brandId: TEST_SERVICE_BRAND_ID,
    sellerId: TEST_SERVICE_SELLER_ID,
    price: 1500,
    stock: 20,
    codSupport: false,
    rating: 4.9,
    category: 'Doctors & Clinics',
    categoryName: 'Doctors & Clinics',
    productType: 'service',
    serviceCategory: 'doctors',
    specialty: 'Cardiology',
    location: 'United Hospital Consulting Rooms, Gulshan',
    description:
      'Board-certified cardiologist consultation. Use Message for Appointment to test patient name/age, appointment date/time, and reason fields.',
    complimentaryFeatures: [
      'ECG review included',
      'Digital prescription',
      'Follow-up message within 7 days',
    ],
    propertySpecs: [
      'Clinic: United Hospital Consulting Wing',
      'Chamber: Room 412',
      'Available: Sat–Thu 5:00 PM – 8:00 PM',
      'Consult duration: ~20 minutes',
      'Languages: Bangla, English',
    ],
    specs: [
      { label: 'Specialty', value: 'Cardiology' },
      { label: 'Consultation fee', value: 'BDT 1,500' },
      { label: 'Clinic', value: 'United Hospital, Gulshan' },
      { label: 'Next availability', value: 'Weekday evenings' },
      { label: 'Experience', value: '12+ years' },
    ],
    featuredFlag: true,
    tags: ['doctor', 'clinic', 'medical', 'health', 'TEST'],
    beforeYourVisit: {
      parkingAvailability: 'Basement parking at United Hospital (paid).',
      cancellationPolicy: 'Free cancellation up to 4 hours before appointment.',
      whatToBring: 'National ID, previous reports, insurance card if applicable.',
      wheelchairAccess: 'Wheelchair-accessible lift to consulting wing.',
      insuranceAccepted: 'Green Delta, Pragati Life, and major corporate panels.',
    },
  },
  {
    id: 9104,
    catalogId: 'test-svc-doctor-derm',
    slug: 'test-doctor-dr-arif-dermatology',
    title: '[TEST] Dr. Arif Hossain — Dermatology Clinic',
    image: doctorImages[1],
    images: [doctorImages[1]],
    brand: TEST_SERVICE_BRAND.name,
    brandName: TEST_SERVICE_BRAND.name,
    brandId: TEST_SERVICE_BRAND_ID,
    sellerId: TEST_SERVICE_SELLER_ID,
    price: 1200,
    stock: 15,
    codSupport: false,
    rating: 4.7,
    category: 'Doctors & Clinics',
    categoryName: 'Doctors & Clinics',
    productType: 'service',
    serviceCategory: 'doctors',
    specialty: 'Dermatology',
    location: 'Labaid Diagnostic, Dhanmondi',
    description:
      'Skin & allergy consultations with same-week appointment slots. Second doctor listing for list/filter coverage.',
    complimentaryFeatures: [
      'Skin analysis notes',
      'Sample care plan PDF',
      'Priority reschedule once',
    ],
    propertySpecs: [
      'Clinic: Labaid Diagnostic, Dhanmondi',
      'Available: Sun, Tue, Thu mornings',
      'Consult duration: ~15 minutes',
    ],
    specs: [
      { label: 'Specialty', value: 'Dermatology' },
      { label: 'Consultation fee', value: 'BDT 1,200' },
      { label: 'Clinic', value: 'Labaid, Dhanmondi' },
      { label: 'Focus', value: 'Acne, eczema, allergies' },
    ],
    tags: ['doctor', 'dermatology', 'clinic', 'wellness', 'TEST'],
  },
  {
    id: 9105,
    catalogId: 'test-svc-beauty-bridal',
    slug: 'test-beauty-bridal-glow-package',
    title: '[TEST] Bridal Glow Makeup Package',
    image: beautyImages[0],
    images: beautyImages,
    brand: TEST_SERVICE_BRAND.name,
    brandName: TEST_SERVICE_BRAND.name,
    brandId: TEST_SERVICE_BRAND_ID,
    sellerId: TEST_SERVICE_SELLER_ID,
    price: 8500,
    stock: 6,
    codSupport: false,
    rating: 4.8,
    category: 'Beauty & Salon',
    categoryName: 'Beauty & Salon',
    productType: 'service',
    serviceCategory: 'beauty',
    duration: '3 hours',
    location: 'Banani Salon Studio, Road 11',
    description:
      'Full bridal makeup, hair styling, and trial option. Message for Appointment exercises date/time/guests fields.',
    complimentaryFeatures: [
      'Skin prep & primer',
      'False lashes',
      'Touch-up kit for the day',
      'Junior artist assistant',
    ],
    propertySpecs: [
      'Duration: ~3 hours',
      'Provider: Senior Makeup Artist — Mehreen',
      'Studio: Banani Road 11',
      'Max guests in suite: 4',
    ],
    specs: [
      { label: 'Service', value: 'Bridal Glow Package' },
      { label: 'Price', value: 'BDT 8,500' },
      { label: 'Duration', value: '3 hours' },
      { label: 'Provider', value: 'Mehreen (Senior Artist)' },
      { label: 'Location', value: 'Banani, Dhaka' },
    ],
    featuredFlag: true,
    tags: ['beauty', 'salon', 'bridal', 'makeup', 'TEST'],
    beforeYourVisit: {
      parkingAvailability: 'Street parking on Road 11; valet not available.',
      cancellationPolicy: '50% fee if cancelled within 24 hours.',
      whatToBring: 'Inspiration photos, skin allergy notes, appointment confirmation.',
      wheelchairAccess: 'Ground-floor studio with step-free entry.',
    },
  },
  {
    id: 9106,
    catalogId: 'test-svc-beauty-spa',
    slug: 'test-beauty-deep-tissue-spa',
    title: '[TEST] Deep Tissue Spa Therapy (90 min)',
    image: beautyImages[1],
    images: [beautyImages[1]],
    brand: TEST_SERVICE_BRAND.name,
    brandName: TEST_SERVICE_BRAND.name,
    brandId: TEST_SERVICE_BRAND_ID,
    sellerId: TEST_SERVICE_SELLER_ID,
    price: 3200,
    stock: 10,
    codSupport: false,
    rating: 4.5,
    category: 'Beauty & Salon',
    categoryName: 'Beauty & Salon',
    productType: 'service',
    serviceCategory: 'beauty',
    duration: '90 minutes',
    location: 'Gulshan Spa House',
    description:
      'Relaxing deep-tissue spa session with aromatherapy oils. Second beauty listing for filters and booking popup.',
    complimentaryFeatures: [
      'Herbal tea after session',
      'Aromatherapy oils',
      'Locker & shower access',
    ],
    propertySpecs: [
      'Duration: 90 minutes',
      'Therapist: Licensed spa therapist',
      'Location: Gulshan Spa House',
    ],
    specs: [
      { label: 'Service', value: 'Deep Tissue Spa Therapy' },
      { label: 'Price', value: 'BDT 3,200' },
      { label: 'Duration', value: '90 minutes' },
      { label: 'Provider', value: 'Gulshan Spa House' },
    ],
    tags: ['beauty', 'spa', 'skincare', 'grooming', 'TEST'],
    beforeYourVisit: {
      parkingAvailability: 'Shared lot behind Gulshan Spa House.',
      cancellationPolicy: 'Reschedule once for free; late cancel incurs 30% fee.',
      whatToBring: 'Comfortable clothing, allergy list if any.',
      wheelchairAccess: 'Lift access to treatment rooms on level 2.',
    },
  },
];

function detailFromProduct(product: SeedCommerceProduct): CatalogProductDetail {
  return {
    productId: product.catalogId,
    productType: product.productType,
    serviceCategory: product.serviceCategory,
    about: product.description,
    specs: (product.specs || []).map((row) => ({
      key: 'label' in row ? row.label : row.key,
      value: row.value,
    })),
    pros: product.complimentaryFeatures?.slice(0, 3) || [],
    cons: [],
    bestForTags: product.tags?.filter((t) => t !== 'TEST') || [],
    storeComparisonList: [],
    whatsNearby: product.whatsNearby,
    beforeYourVisit: product.beforeYourVisit,
    physicalStores: product.location
      ? [
          {
            id: `${product.catalogId}-location`,
            storeName: product.brandName || TEST_SERVICE_BRAND.name,
            address: product.location,
            city: product.location.split(',').pop()?.trim() || 'Dhaka',
            badgeLabel: 'Service location',
          },
        ]
      : [],
    overviewBlocks: [
      {
        id: `${product.catalogId}-overview`,
        title: 'Service Overview',
        content: product.description,
        bullets: product.complimentaryFeatures || [],
        enabled: true,
        sortOrder: 0,
      },
    ],
    optionGroups: [],
    productVariants: [],
    creatorContent: [],
    seoTitle: product.title,
    seoDescription: product.description,
    updatedAt: '2026-07-22T00:00:00Z',
  };
}

export const TEST_SERVICE_PRODUCT_DETAILS: Record<string, CatalogProductDetail> = Object.fromEntries(
  TEST_SERVICE_PRODUCTS.map((p) => [p.catalogId, detailFromProduct(p)]),
);

export function mergeServiceSeedProducts(existing: CommerceProduct[]): CommerceProduct[] {
  if (!isServiceSeedEnabled()) return existing;
  const seedIds = new Set(TEST_SERVICE_PRODUCTS.map((p) => p.id));
  const seedCatalogIds = new Set(TEST_SERVICE_PRODUCTS.map((p) => p.catalogId));
  const withoutDupes = existing.filter(
    (p) =>
      !seedIds.has(Number(p.id)) &&
      !seedCatalogIds.has(String((p as SeedCommerceProduct).catalogId || '')),
  );
  return [...TEST_SERVICE_PRODUCTS, ...withoutDupes];
}

export function mergeServiceSeedBrands(existing: Brand[]): Brand[] {
  if (!isServiceSeedEnabled()) return existing;
  if (existing.some((b) => b.id === TEST_SERVICE_BRAND_ID || b.catalogId === TEST_SERVICE_BRAND.catalogId)) {
    return existing;
  }
  return [TEST_SERVICE_BRAND, ...existing];
}

export function mergeServiceSeedSellers(existing: Seller[]): Seller[] {
  if (!isServiceSeedEnabled()) return existing;
  if (existing.some((s) => s.id === TEST_SERVICE_SELLER_ID)) return existing;
  return [TEST_SERVICE_SELLER, ...existing];
}

export function mergeServiceSeedProductDetails(
  existing: Record<string, CatalogProductDetail>,
): Record<string, CatalogProductDetail> {
  if (!isServiceSeedEnabled()) return existing;
  return { ...TEST_SERVICE_PRODUCT_DETAILS, ...existing };
}
