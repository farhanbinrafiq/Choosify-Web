/**
 * Storefront booking field helpers.
 *
 * Canonical field dictionary lives in choosify-admin-4.0:
 *   shared/booking/bookingFieldConfig.ts
 * exposed at GET /api/v1/booking/field-config
 *
 * This module keeps a bootstrap fallback (must stay in sync with admin)
 * and hydrates from the admin API when available so Product Studio and
 * Message Seller share one config source.
 */
import type {
  BookingRequestField,
  ServiceCategory,
} from '../types/serviceBooking';

const CATEGORY_ALIASES: Record<string, ServiceCategory> = {
  hotel: 'hotels',
  hotels: 'hotels',
  restaurant: 'restaurants',
  restaurants: 'restaurants',
  reservation: 'restaurants',
  travel: 'travel',
  tour: 'travel',
  tours: 'travel',
  doctor: 'doctors',
  doctors: 'doctors',
  healthcare: 'doctors',
  education: 'education',
  beauty: 'beauty',
  salon: 'beauty',
  spa: 'beauty',
  appointment: 'beauty',
  appointments: 'beauty',
  'real estate': 'real_estate',
  real_estate: 'real_estate',
  'real-estate': 'real_estate',
  property: 'real_estate',
  transport: 'transport',
  transportation: 'transport',
  event: 'events',
  events: 'events',
  wedding: 'events',
  ticket: 'tickets',
  tickets: 'tickets',
  'home service': 'home_services',
  'home services': 'home_services',
  home_services: 'home_services',
  cleaning: 'home_services',
  'gov service': 'gov_services',
  'gov services': 'gov_services',
  gov_services: 'gov_services',
  government: 'gov_services',
  recruitment: 'recruitment',
  hiring: 'recruitment',
  jobs: 'recruitment',
  b2b: 'b2b',
  wholesale: 'b2b',
  rental: 'rental',
  rent: 'rental',
  donation: 'donation',
  donations: 'donation',
  charity: 'donation',
};

export function isServiceListing(product: {
  productType?: string;
} | null | undefined): boolean {
  return String(product?.productType || '').toLowerCase() === 'service';
}

export function normalizeServiceCategory(value?: string | null): ServiceCategory {
  const normalized = String(value || '')
    .trim()
    .toLowerCase()
    .replace(/[&/]+/g, ' ')
    .replace(/-/g, ' ')
    .replace(/\s+/g, ' ');
  if (CATEGORY_ALIASES[normalized]) return CATEGORY_ALIASES[normalized];
  const match = Object.keys(CATEGORY_ALIASES).find((key) => normalized.includes(key));
  return match ? CATEGORY_ALIASES[match] : 'travel';
}

export function serviceMessageCtaLabel(serviceCategory?: string | null): string {
  switch (normalizeServiceCategory(serviceCategory)) {
    case 'restaurants':
      return 'Message for Reservation';
    case 'doctors':
    case 'beauty':
      return 'Message for Appointment';
    case 'events':
      return 'Message to Book Event';
    case 'tickets':
      return 'Message for Tickets';
    case 'home_services':
      return 'Message to Book Service';
    case 'gov_services':
      return 'Message for Assistance';
    case 'recruitment':
      return 'Message to Hire';
    case 'b2b':
      return 'Message for Quote';
    case 'rental':
      return 'Message to Rent';
    case 'donation':
      return 'Message to Donate';
    default:
      return 'Message to Book';
  }
}

const notes: BookingRequestField = {
  key: 'notes',
  label: 'Notes',
  type: 'textarea',
};

/** Bootstrap fallback — prefer hydrateServiceBookingFieldsFromApi() */
export let SERVICE_BOOKING_FIELDS: Record<ServiceCategory, BookingRequestField[]> = {
  hotels: [
    { key: 'checkInDate', label: 'Check-in date', type: 'date', required: true },
    { key: 'checkInTime', label: 'Check-in time', type: 'time' },
    { key: 'checkOutDate', label: 'Check-out date', type: 'date', required: true },
    { key: 'checkOutTime', label: 'Check-out time', type: 'time' },
    { key: 'nights', label: 'Nights of stay', type: 'number', required: true, min: 1 },
    { key: 'adults', label: 'Adults', type: 'number', required: true, min: 1 },
    { key: 'children', label: 'Children', type: 'number', min: 0 },
    { key: 'guests', label: 'Total guests', type: 'number', required: true, min: 1 },
    notes,
  ],
  restaurants: [
    { key: 'reservationDate', label: 'Date', type: 'date', required: true },
    { key: 'reservationTime', label: 'Time', type: 'time', required: true },
    { key: 'partySize', label: 'Party size', type: 'number', required: true, min: 1 },
    notes,
  ],
  doctors: [
    { key: 'appointmentDate', label: 'Appointment date', type: 'date', required: true },
    { key: 'appointmentTime', label: 'Time', type: 'time', required: true },
    { key: 'patientName', label: 'Patient name', type: 'text', required: true },
    { key: 'patientAge', label: 'Patient age', type: 'number', required: true, min: 0 },
    { key: 'reason', label: 'Reason for visit', type: 'textarea', required: true },
    notes,
  ],
  education: [
    { key: 'preferredStartDate', label: 'Preferred start date', type: 'date', required: true },
    { key: 'seats', label: 'Seats', type: 'number', required: true, min: 1 },
    {
      key: 'mode',
      label: 'Mode',
      type: 'select',
      required: true,
      options: ['Online', 'In person', 'Hybrid'],
    },
    notes,
  ],
  beauty: [
    { key: 'appointmentDate', label: 'Date', type: 'date', required: true },
    { key: 'appointmentTime', label: 'Time', type: 'time', required: true },
    { key: 'guests', label: 'Guests', type: 'number', required: true, min: 1 },
    notes,
  ],
  real_estate: [
    { key: 'viewingDate', label: 'Viewing date', type: 'date', required: true },
    { key: 'viewingTime', label: 'Time', type: 'time', required: true },
    { key: 'visitors', label: 'Visitors', type: 'number', required: true, min: 1 },
    notes,
  ],
  transport: [
    { key: 'pickupDate', label: 'Pickup date', type: 'date', required: true },
    { key: 'pickupTime', label: 'Pickup time', type: 'time', required: true },
    { key: 'dropOffLocation', label: 'Drop-off location', type: 'text', required: true },
    { key: 'passengers', label: 'Passengers', type: 'number', required: true, min: 1 },
    notes,
  ],
  travel: [
    { key: 'travelDate', label: 'Preferred travel date', type: 'date', required: true },
    { key: 'travellers', label: 'Travellers', type: 'number', required: true, min: 1 },
    { key: 'destination', label: 'Destination', type: 'text', required: true },
    notes,
  ],
  events: [
    { key: 'eventDate', label: 'Event date', type: 'date', required: true },
    { key: 'eventLocation', label: 'Event location', type: 'text', required: true },
    { key: 'guestCount', label: 'Guest count', type: 'number', min: 1 },
    notes,
  ],
  tickets: [
    { key: 'visitDate', label: 'Visit / event date', type: 'date', required: true },
    { key: 'quantity', label: 'Number of tickets', type: 'number', required: true, min: 1 },
    notes,
  ],
  home_services: [
    { key: 'serviceDate', label: 'Preferred date', type: 'date', required: true },
    { key: 'serviceTime', label: 'Preferred time', type: 'time' },
    { key: 'address', label: 'Service address', type: 'text', required: true },
    notes,
  ],
  gov_services: [
    { key: 'preferredDate', label: 'Preferred date', type: 'date', required: true },
    { key: 'applicantName', label: 'Applicant name', type: 'text', required: true },
    notes,
  ],
  recruitment: [
    { key: 'preferredStartDate', label: 'Preferred start date', type: 'date', required: true },
    { key: 'rolesNeeded', label: 'Roles needed', type: 'number', required: true, min: 1 },
    notes,
  ],
  b2b: [
    { key: 'preferredDate', label: 'Preferred date', type: 'date', required: true },
    { key: 'quantity', label: 'Order quantity', type: 'number', required: true, min: 1 },
    notes,
  ],
  rental: [
    { key: 'rentalStartDate', label: 'Rental start date', type: 'date', required: true },
    { key: 'rentalEndDate', label: 'Rental end date', type: 'date', required: true },
    { key: 'quantity', label: 'Quantity', type: 'number', required: true, min: 1 },
    notes,
  ],
  donation: [
    { key: 'amount', label: 'Donation amount', type: 'number', required: true, min: 1 },
    notes,
  ],
};

let hydrated = false;

/** Pull canonical config from admin API (no-op if unreachable). */
export async function hydrateServiceBookingFieldsFromApi(
  apiBaseUrl = import.meta.env.VITE_API_BASE_URL || '',
): Promise<boolean> {
  if (hydrated) return true;
  const base = String(apiBaseUrl || '').replace(/\/$/, '');
  if (!base) return false;
  try {
    const res = await fetch(`${base}/api/v1/booking/field-config`);
    if (!res.ok) return false;
    const json = await res.json();
    const fieldsByCategory = json?.data?.fieldsByCategory;
    if (fieldsByCategory && typeof fieldsByCategory === 'object') {
      SERVICE_BOOKING_FIELDS = fieldsByCategory as Record<ServiceCategory, BookingRequestField[]>;
      hydrated = true;
      return true;
    }
  } catch {
    // keep bootstrap fallback
  }
  return false;
}

export function serviceBookingFields(serviceCategory?: string | null): BookingRequestField[] {
  return SERVICE_BOOKING_FIELDS[normalizeServiceCategory(serviceCategory)];
}

export function productOptionFields(product: any): BookingRequestField[] {
  const fields: BookingRequestField[] = [];
  const seen = new Set<string>();
  const add = (key: string, label: string, options: unknown) => {
    if (!Array.isArray(options)) return;
    const values = [...new Set(options.map(String).filter(Boolean))];
    if (values.length && !seen.has(key)) {
      seen.add(key);
      fields.push({ key, label, type: 'select', options: values });
    }
  };

  product?.optionGroups?.forEach((group: any) =>
    add(
      String(group.id || group.name || 'option')
        .toLowerCase()
        .replace(/\s+/g, '_'),
      String(group.name || 'Option'),
      group.values,
    ),
  );
  add('color', 'Color', product?.colors);
  add('size', 'Size', product?.sizes);
  add(
    'variant',
    'Variant',
    product?.variants?.map(
      (variant: any) =>
        variant.name ||
        variant.title ||
        (variant.attributes
          ? Object.values(variant.attributes).join(' / ')
          : variant.options
            ? Object.values(variant.options).join(' / ')
            : variant.sku),
    ),
  );
  add('ram', 'RAM', product?.rams);
  add('storage', 'Storage', product?.storageOptions || product?.storages);

  fields.push({ key: 'quantity', label: 'Quantity', type: 'number', required: true, min: 1 });
  fields.push(notes);
  return fields;
}

export function requestFieldsForListing(product: any): BookingRequestField[] {
  if (!isServiceListing(product)) return productOptionFields(product);
  const all = serviceBookingFields(product?.serviceCategory);
  const requiredKeys: string[] | undefined = product?.requiredBookingFieldKeys;
  if (!Array.isArray(requiredKeys) || requiredKeys.length === 0) return all;
  const filtered = all.filter((f) => requiredKeys.includes(f.key) || f.key === 'notes');
  return filtered.length ? filtered : all;
}

export function listingSectionLabels(product: any) {
  const service = isServiceListing(product);
  return {
    specifications: service ? 'Service Specifications' : 'Product Specifications',
    overview: service ? 'Service Overview' : 'Product Overview',
    boxContent: service ? 'Complimentary Features' : 'Box Content',
    physicalSpecs: service ? 'Property Specs' : 'Physical Specs',
  };
}
