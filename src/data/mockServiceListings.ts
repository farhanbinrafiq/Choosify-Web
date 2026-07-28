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
  {
    id: 9201,
    catalogId: 'svc-travel-coxsbazar-tour',
    slug: 'coxs-bazar-3d2n-tour-package',
    title: "Cox's Bazar 3D2N Tour Package",
    image: 'https://images.unsplash.com/photo-1590523278191-995cbcda646b?w=800&h=600&fit=crop',
    images: ['https://images.unsplash.com/photo-1590523278191-995cbcda646b?w=800&h=600&fit=crop'],
    brand: TEST_SERVICE_BRAND.name,
    brandName: TEST_SERVICE_BRAND.name,
    brandId: TEST_SERVICE_BRAND_ID,
    sellerId: TEST_SERVICE_SELLER_ID,
    price: 14500,
    originalPrice: 17000,
    discountPercent: 15,
    stock: 25,
    codSupport: false,
    rating: 4.7,
    category: 'Travel & Hospitality',
    categoryName: 'Travel & Hospitality',
    productType: 'service',
    serviceCategory: 'travel',
    duration: '3 days, 2 nights',
    location: "Cox's Bazar, Bangladesh",
    description: 'All-inclusive 3D2N Cox\'s Bazar package with hotel stay, breakfast, and beach-side sightseeing tour.',
    complimentaryFeatures: ['Hotel stay (2 nights)', 'Daily breakfast', 'Guided beach tour', 'Airport transfer'],
    propertySpecs: ['Group size: up to 4', 'Departs: Dhaka', 'Season: Year-round'],
    specs: [
      { label: 'Package', value: "Cox's Bazar 3D2N" },
      { label: 'Price', value: 'BDT 14,500 / person' },
      { label: 'Duration', value: '3 days, 2 nights' },
    ],
    tags: ['travel', 'tour', 'package', 'hospitality'],
  },
  {
    id: 9202,
    catalogId: 'svc-travel-amusement-park',
    slug: 'amusement-park-day-pass-fantasy-kingdom',
    title: 'Amusement Park Day Pass — Fantasy Kingdom',
    image: 'https://images.unsplash.com/photo-1560253023-3ec5d502959f?w=800&h=600&fit=crop',
    images: ['https://images.unsplash.com/photo-1560253023-3ec5d502959f?w=800&h=600&fit=crop'],
    brand: TEST_SERVICE_BRAND.name,
    brandName: TEST_SERVICE_BRAND.name,
    brandId: TEST_SERVICE_BRAND_ID,
    sellerId: TEST_SERVICE_SELLER_ID,
    price: 1200,
    stock: 200,
    codSupport: false,
    rating: 4.5,
    category: 'Travel & Hospitality',
    categoryName: 'Travel & Hospitality',
    productType: 'service',
    serviceCategory: 'tickets',
    location: 'Fantasy Kingdom, Ashulia',
    description: 'Full-day entry ticket to Fantasy Kingdom amusement park, valid for all rides and attractions.',
    complimentaryFeatures: ['Unlimited rides', 'Access to water park section', 'Locker facility'],
    specs: [
      { label: 'Ticket type', value: 'Full Day Pass' },
      { label: 'Price', value: 'BDT 1,200 / person' },
      { label: 'Venue', value: 'Fantasy Kingdom, Ashulia' },
    ],
    tags: ['tickets', 'amusement park', 'entertainment', 'family'],
  },
  {
    id: 9203,
    catalogId: 'svc-travel-concert-ticket',
    slug: 'concert-ticket-coke-studio-bangla-live',
    title: 'Concert Ticket — Coke Studio Bangla Live',
    image: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800&h=600&fit=crop',
    images: ['https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800&h=600&fit=crop'],
    brand: TEST_SERVICE_BRAND.name,
    brandName: TEST_SERVICE_BRAND.name,
    brandId: TEST_SERVICE_BRAND_ID,
    sellerId: TEST_SERVICE_SELLER_ID,
    price: 2500,
    stock: 500,
    codSupport: false,
    rating: 4.8,
    category: 'Travel & Hospitality',
    categoryName: 'Travel & Hospitality',
    productType: 'service',
    serviceCategory: 'tickets',
    location: 'Army Stadium, Dhaka',
    description: 'General admission ticket to the live Coke Studio Bangla concert featuring top regional artists.',
    complimentaryFeatures: ['General admission entry', 'Digital e-ticket', 'On-site merchandise discount'],
    specs: [
      { label: 'Event', value: 'Coke Studio Bangla Live' },
      { label: 'Price', value: 'BDT 2,500 / ticket' },
      { label: 'Venue', value: 'Army Stadium, Dhaka' },
    ],
    tags: ['tickets', 'concert', 'entertainment', 'live event'],
  },
  {
    id: 9204,
    catalogId: 'svc-realestate-apartment-rent',
    slug: '2-bed-apartment-for-rent-bashundhara',
    title: '2-Bed Apartment for Rent — Bashundhara R/A',
    image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&h=600&fit=crop',
    images: ['https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&h=600&fit=crop'],
    brand: TEST_SERVICE_BRAND.name,
    brandName: TEST_SERVICE_BRAND.name,
    brandId: TEST_SERVICE_BRAND_ID,
    sellerId: TEST_SERVICE_SELLER_ID,
    price: 35000,
    stock: 1,
    codSupport: false,
    rating: 4.6,
    category: 'Real Estate',
    categoryName: 'Real Estate',
    productType: 'service',
    serviceCategory: 'real-estate',
    location: 'Bashundhara R/A, Dhaka',
    description: 'Well-lit 2-bedroom apartment for rent, 1200 sqft, with covered parking and 24/7 security.',
    propertySpecs: ['Size: 1200 sqft', 'Bedrooms: 2', 'Bathrooms: 2', 'Parking: 1 covered slot'],
    specs: [
      { label: 'Rent', value: 'BDT 35,000 / month' },
      { label: 'Size', value: '1200 sqft' },
      { label: 'Location', value: 'Bashundhara R/A' },
    ],
    tags: ['real estate', 'apartment', 'rent'],
  },
  {
    id: 9205,
    catalogId: 'svc-events-wedding-photography',
    slug: 'wedding-photography-full-day-package',
    title: 'Wedding Photography Full-Day Package',
    image: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=800&h=600&fit=crop',
    images: ['https://images.unsplash.com/photo-1519741497674-611481863552?w=800&h=600&fit=crop'],
    brand: TEST_SERVICE_BRAND.name,
    brandName: TEST_SERVICE_BRAND.name,
    brandId: TEST_SERVICE_BRAND_ID,
    sellerId: TEST_SERVICE_SELLER_ID,
    price: 45000,
    originalPrice: 55000,
    discountPercent: 18,
    stock: 8,
    codSupport: false,
    rating: 4.9,
    category: 'Events & Wedding',
    categoryName: 'Events & Wedding',
    productType: 'service',
    serviceCategory: 'events',
    duration: 'Full day (10 hours)',
    location: 'Dhaka & surrounding areas',
    description: 'Full-day wedding photography coverage with 2 photographers, edited album, and same-day highlight reel.',
    complimentaryFeatures: ['2 professional photographers', 'Edited photo album', 'Same-day highlight reel'],
    specs: [
      { label: 'Coverage', value: 'Full day (10 hours)' },
      { label: 'Price', value: 'BDT 45,000' },
      { label: 'Delivery', value: 'Album in 2 weeks' },
    ],
    tags: ['wedding', 'photography', 'events'],
  },
  {
    id: 9206,
    catalogId: 'svc-home-deep-cleaning',
    slug: 'home-deep-cleaning-service',
    title: 'Home Deep Cleaning Service',
    image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800&h=600&fit=crop',
    images: ['https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800&h=600&fit=crop'],
    brand: TEST_SERVICE_BRAND.name,
    brandName: TEST_SERVICE_BRAND.name,
    brandId: TEST_SERVICE_BRAND_ID,
    sellerId: TEST_SERVICE_SELLER_ID,
    price: 3500,
    stock: 40,
    codSupport: false,
    rating: 4.6,
    category: 'Professional & Home Services',
    categoryName: 'Professional & Home Services',
    productType: 'service',
    serviceCategory: 'home-services',
    duration: '4-5 hours',
    location: 'Dhaka Metro Area',
    description: 'Full home deep cleaning covering kitchen, bathrooms, floors, and upholstery by a trained team.',
    complimentaryFeatures: ['Eco-friendly cleaning agents', 'Trained & vetted staff', 'Post-clean inspection checklist'],
    specs: [
      { label: 'Service', value: 'Home Deep Cleaning' },
      { label: 'Price', value: 'BDT 3,500' },
      { label: 'Duration', value: '4-5 hours' },
    ],
    tags: ['home services', 'cleaning', 'professional services'],
  },
  {
    id: 9207,
    catalogId: 'svc-gov-passport-renewal',
    slug: 'passport-renewal-assistance-service',
    title: 'Passport Renewal Assistance Service',
    image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800&h=600&fit=crop',
    images: ['https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800&h=600&fit=crop'],
    brand: TEST_SERVICE_BRAND.name,
    brandName: TEST_SERVICE_BRAND.name,
    brandId: TEST_SERVICE_BRAND_ID,
    sellerId: TEST_SERVICE_SELLER_ID,
    price: 2800,
    stock: 60,
    codSupport: false,
    rating: 4.4,
    category: 'Financial & Government Services',
    categoryName: 'Financial & Government Services',
    productType: 'service',
    serviceCategory: 'gov-services',
    location: 'Agargaon Passport Office, Dhaka',
    description: 'End-to-end assistance for passport renewal — form filling, appointment booking, and document review.',
    complimentaryFeatures: ['Document checklist review', 'Appointment slot booking', 'Status tracking updates'],
    specs: [
      { label: 'Service', value: 'Passport Renewal Assistance' },
      { label: 'Price', value: 'BDT 2,800' },
      { label: 'Processing', value: '10-15 working days' },
    ],
    tags: ['government services', 'passport', 'assistance'],
  },
  {
    id: 9208,
    catalogId: 'svc-jobs-bulk-hiring',
    slug: 'corporate-bulk-hiring-recruitment-package',
    title: 'Corporate Bulk Hiring Recruitment Package',
    image: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=800&h=600&fit=crop',
    images: ['https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=800&h=600&fit=crop'],
    brand: TEST_SERVICE_BRAND.name,
    brandName: TEST_SERVICE_BRAND.name,
    brandId: TEST_SERVICE_BRAND_ID,
    sellerId: TEST_SERVICE_SELLER_ID,
    price: 25000,
    stock: 10,
    codSupport: false,
    rating: 4.5,
    category: 'Jobs & Recruitment',
    categoryName: 'Jobs & Recruitment',
    productType: 'service',
    serviceCategory: 'recruitment',
    location: 'Remote / On-site',
    description: 'End-to-end bulk hiring package for corporate clients — sourcing, screening, and shortlisting up to 20 roles.',
    complimentaryFeatures: ['Candidate sourcing', 'Pre-screening interviews', 'Shortlist report within 2 weeks'],
    specs: [
      { label: 'Package', value: 'Bulk Hiring (up to 20 roles)' },
      { label: 'Price', value: 'BDT 25,000' },
      { label: 'Turnaround', value: '2 weeks' },
    ],
    tags: ['jobs', 'recruitment', 'hiring'],
  },
  {
    id: 9209,
    catalogId: 'svc-b2b-fabric-sourcing',
    slug: 'bulk-wholesale-cotton-fabric-sourcing',
    title: 'Bulk Wholesale Cotton Fabric Sourcing',
    image: 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=800&h=600&fit=crop',
    images: ['https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=800&h=600&fit=crop'],
    brand: TEST_SERVICE_BRAND.name,
    brandName: TEST_SERVICE_BRAND.name,
    brandId: TEST_SERVICE_BRAND_ID,
    sellerId: TEST_SERVICE_SELLER_ID,
    price: 180000,
    stock: 5,
    codSupport: false,
    rating: 4.6,
    category: 'B2B Marketplace',
    categoryName: 'B2B Marketplace',
    productType: 'service',
    serviceCategory: 'b2b',
    location: 'Narayanganj Textile Hub',
    description: 'Bulk cotton fabric sourcing for garment manufacturers, minimum order 5,000 meters, quality-audited mills.',
    complimentaryFeatures: ['Quality-audited mills', 'Sample swatches provided', 'Freight coordination'],
    specs: [
      { label: 'MOQ', value: '5,000 meters' },
      { label: 'Price', value: 'BDT 180,000 (per 5,000m lot)' },
      { label: 'Lead time', value: '3-4 weeks' },
    ],
    tags: ['b2b', 'wholesale', 'sourcing', 'textile'],
  },
  {
    id: 9210,
    catalogId: 'svc-rental-camera',
    slug: 'dslr-camera-rental-3-day-package',
    title: 'DSLR Camera Rental — 3 Day Package',
    image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&h=600&fit=crop',
    images: ['https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&h=600&fit=crop'],
    brand: TEST_SERVICE_BRAND.name,
    brandName: TEST_SERVICE_BRAND.name,
    brandId: TEST_SERVICE_BRAND_ID,
    sellerId: TEST_SERVICE_SELLER_ID,
    price: 2200,
    stock: 12,
    codSupport: false,
    rating: 4.7,
    category: 'Rental Marketplace',
    categoryName: 'Rental Marketplace',
    productType: 'service',
    serviceCategory: 'rental',
    duration: '3 days',
    location: 'Dhaka Metro Area (delivery available)',
    description: 'Full-frame DSLR camera rental with 2 lenses, tripod, and extra battery — 3-day package.',
    complimentaryFeatures: ['2 lenses included', 'Extra battery & charger', 'Free delivery within Dhaka'],
    specs: [
      { label: 'Rental period', value: '3 days' },
      { label: 'Price', value: 'BDT 2,200' },
      { label: 'Deposit', value: 'BDT 10,000 (refundable)' },
    ],
    tags: ['rental', 'camera', 'equipment'],
  },
  {
    id: 9211,
    catalogId: 'svc-community-flood-relief',
    slug: 'flood-relief-donation-fund',
    title: 'Flood Relief Donation Fund',
    image: 'https://images.unsplash.com/photo-1593113630400-ea4288922497?w=800&h=600&fit=crop',
    images: ['https://images.unsplash.com/photo-1593113630400-ea4288922497?w=800&h=600&fit=crop'],
    brand: TEST_SERVICE_BRAND.name,
    brandName: TEST_SERVICE_BRAND.name,
    brandId: TEST_SERVICE_BRAND_ID,
    sellerId: TEST_SERVICE_SELLER_ID,
    price: 500,
    stock: 99999,
    codSupport: false,
    rating: 5.0,
    category: 'Community & Social Impact',
    categoryName: 'Community & Social Impact',
    productType: 'service',
    serviceCategory: 'donation',
    location: 'Nationwide relief distribution',
    description: 'Contribute to emergency flood relief — funds food, clean water, and shelter kits for affected families.',
    complimentaryFeatures: ['100% of funds go to relief distribution', 'Donation receipt provided', 'Impact report shared'],
    specs: [
      { label: 'Minimum donation', value: 'BDT 500' },
      { label: 'Distribution', value: 'Nationwide' },
      { label: 'Transparency', value: 'Monthly impact report' },
    ],
    tags: ['donation', 'community', 'relief', 'social impact'],
  },
  {
    id: 9212,
    catalogId: 'svc-booking-restaurant-reservation',
    slug: 'fine-dining-reservation-cafe-bloom-gulshan',
    title: 'Fine Dining Reservation — Cafe Bloom Gulshan',
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&h=600&fit=crop',
    images: ['https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&h=600&fit=crop'],
    brand: TEST_SERVICE_BRAND.name,
    brandName: TEST_SERVICE_BRAND.name,
    brandId: TEST_SERVICE_BRAND_ID,
    sellerId: TEST_SERVICE_SELLER_ID,
    price: 0,
    stock: 30,
    codSupport: false,
    rating: 4.7,
    category: 'Bookings & Appointments',
    categoryName: 'Bookings & Appointments',
    productType: 'service',
    serviceCategory: 'reservation',
    location: 'Cafe Bloom, Gulshan 2, Dhaka',
    description: 'Reserve a table at Cafe Bloom Gulshan — free reservation, pay only for what you order on arrival.',
    complimentaryFeatures: ['Free table reservation', 'Window seating on request', 'Birthday setup on request'],
    specs: [
      { label: 'Reservation fee', value: 'Free' },
      { label: 'Table size', value: 'Up to 6 guests' },
      { label: 'Hours', value: '12 PM – 11 PM daily' },
    ],
    tags: ['reservation', 'restaurant', 'dining', 'booking'],
  },
  {
    id: 9213,
    catalogId: 'svc-booking-massage-appointment',
    slug: 'full-body-massage-appointment-60-min',
    title: 'Full Body Massage Appointment — 60 Min',
    image: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=800&h=600&fit=crop',
    images: ['https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=800&h=600&fit=crop'],
    brand: TEST_SERVICE_BRAND.name,
    brandName: TEST_SERVICE_BRAND.name,
    brandId: TEST_SERVICE_BRAND_ID,
    sellerId: TEST_SERVICE_SELLER_ID,
    price: 2800,
    stock: 20,
    codSupport: false,
    rating: 4.6,
    category: 'Bookings & Appointments',
    categoryName: 'Bookings & Appointments',
    productType: 'service',
    serviceCategory: 'appointments',
    duration: '60 minutes',
    location: 'Serenity Wellness Spa, Banani',
    description: 'Relaxing full-body massage appointment with a licensed therapist — 60-minute session.',
    complimentaryFeatures: ['Licensed therapist', 'Herbal tea after session', 'Locker & shower access'],
    specs: [
      { label: 'Service', value: 'Full Body Massage' },
      { label: 'Price', value: 'BDT 2,800' },
      { label: 'Duration', value: '60 minutes' },
    ],
    tags: ['appointment', 'massage', 'wellness', 'booking'],
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
