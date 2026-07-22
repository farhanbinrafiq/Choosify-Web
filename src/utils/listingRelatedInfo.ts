import type { ServiceCategory } from '../types/serviceBooking';
import type {
  BeforeVisitFieldKey,
  BeforeYourVisitData,
  ListingRelatedInfoProduct,
  NearbyCategoryKey,
  NearbyPlaceEntry,
  RelatedInfoSectionKind,
  RelatedInfoSectionRule,
  WhatsNearbyData,
} from '../types/listingRelatedInfo';
import { isPhysicalListing } from '../types/listingRelatedInfo';
import { normalizeServiceCategory } from './serviceBooking';

export const NEARBY_CATEGORY_DEFS: ReadonlyArray<{
  key: NearbyCategoryKey;
  label: string;
}> = [
  { key: 'restaurant_cafe', label: 'Restaurant & Cafe' },
  { key: 'entertainment_attraction', label: 'Entertainment & Attraction' },
  { key: 'hospital_police', label: 'Hospital & Police Station' },
  { key: 'transport_airport', label: 'Transport & Airport' },
  { key: 'shopping_atm', label: 'Shopping & ATM' },
] as const;

export const BEFORE_VISIT_FIELD_DEFS: ReadonlyArray<{
  key: BeforeVisitFieldKey;
  label: string;
}> = [
  { key: 'parkingAvailability', label: 'Parking Availability' },
  { key: 'cancellationPolicy', label: 'Cancellation Policy' },
  { key: 'whatToBring', label: 'What to Bring' },
  { key: 'wheelchairAccess', label: 'Wheelchair Access' },
  { key: 'insuranceAccepted', label: 'Insurance Accepted' },
] as const;

const MANDATORY_NEARBY: ServiceCategory[] = ['hotels', 'real_estate'];
const OPTIONAL_NEARBY: ServiceCategory[] = ['restaurants', 'travel'];
const MANDATORY_BEFORE_VISIT: ServiceCategory[] = ['doctors', 'beauty'];
const OPTIONAL_BEFORE_VISIT: ServiceCategory[] = ['education', 'transport'];

const BEFORE_VISIT_FIELDS_BY_CATEGORY: Record<ServiceCategory, BeforeVisitFieldKey[]> = {
  doctors: [
    'parkingAvailability',
    'cancellationPolicy',
    'whatToBring',
    'wheelchairAccess',
    'insuranceAccepted',
  ],
  beauty: ['parkingAvailability', 'cancellationPolicy', 'whatToBring', 'wheelchairAccess'],
  education: ['parkingAvailability', 'cancellationPolicy', 'whatToBring', 'wheelchairAccess'],
  transport: ['parkingAvailability', 'cancellationPolicy', 'whatToBring', 'wheelchairAccess'],
  hotels: [],
  restaurants: [],
  travel: [],
  real_estate: [],
};

export function resolveRelatedInfoRule(
  product: ListingRelatedInfoProduct | null | undefined,
): RelatedInfoSectionRule | null {
  if (!product) return null;

  if (isPhysicalListing(product)) {
    return { kind: 'price_across_stores', visibility: 'seller_enabled' };
  }

  const category = normalizeServiceCategory(product.serviceCategory);
  if (MANDATORY_NEARBY.includes(category) || OPTIONAL_NEARBY.includes(category)) {
    return {
      kind: 'whats_nearby',
      visibility: MANDATORY_NEARBY.includes(category) ? 'mandatory' : 'optional',
    };
  }
  if (MANDATORY_BEFORE_VISIT.includes(category) || OPTIONAL_BEFORE_VISIT.includes(category)) {
    return {
      kind: 'before_your_visit',
      visibility: MANDATORY_BEFORE_VISIT.includes(category) ? 'mandatory' : 'optional',
      beforeVisitFields: BEFORE_VISIT_FIELDS_BY_CATEGORY[category],
    };
  }

  return null;
}

export function hasWhatsNearbyContent(data?: WhatsNearbyData | null): boolean {
  if (!data) return false;
  return NEARBY_CATEGORY_DEFS.some((def) => {
    const entries = data[def.key];
    return Array.isArray(entries) && entries.some((e) => String(e?.name || '').trim());
  });
}

export function hasBeforeYourVisitContent(
  data?: BeforeYourVisitData | null,
  fields?: BeforeVisitFieldKey[],
): boolean {
  if (!data) return false;
  const keys = fields?.length ? fields : BEFORE_VISIT_FIELD_DEFS.map((f) => f.key);
  return keys.some((key) => String(data[key] || '').trim());
}

export function shouldShowPriceAcrossStores(product: ListingRelatedInfoProduct | null | undefined): boolean {
  if (!product || !isPhysicalListing(product)) return false;
  if (product.priceAcrossStoresEnabled === false) return false;
  if (product.priceAcrossStoresEnabled === true) return true;
  return Array.isArray(product.storeComparisonList) && product.storeComparisonList.length > 0;
}

export interface ResolvedRelatedInfoSection {
  kind: RelatedInfoSectionKind;
  rule: RelatedInfoSectionRule;
  whatsNearby?: WhatsNearbyData;
  beforeYourVisit?: BeforeYourVisitData;
  beforeVisitFields?: BeforeVisitFieldKey[];
  storeComparisonList?: ListingRelatedInfoProduct['storeComparisonList'];
}

/** Returns the single sidebar section to render, or null when nothing should show. */
export function resolveListingRelatedInfoSection(
  product: ListingRelatedInfoProduct | null | undefined,
): ResolvedRelatedInfoSection | null {
  const rule = resolveRelatedInfoRule(product);
  if (!rule || !product) return null;

  if (rule.kind === 'price_across_stores') {
    if (!shouldShowPriceAcrossStores(product)) return null;
    return {
      kind: rule.kind,
      rule,
      storeComparisonList: product.storeComparisonList,
    };
  }

  if (rule.kind === 'whats_nearby') {
    const whatsNearby = product.whatsNearby;
    if (rule.visibility === 'optional' && !hasWhatsNearbyContent(whatsNearby)) return null;
    return { kind: rule.kind, rule, whatsNearby };
  }

  if (rule.kind === 'before_your_visit') {
    const fields = rule.beforeVisitFields || [];
    const beforeYourVisit = product.beforeYourVisit;
    if (rule.visibility === 'optional' && !hasBeforeYourVisitContent(beforeYourVisit, fields)) {
      return null;
    }
    return { kind: rule.kind, rule, beforeYourVisit, beforeVisitFields: fields };
  }

  return null;
}

export function nearbyEntriesForCategory(
  data: WhatsNearbyData | undefined,
  key: NearbyCategoryKey,
): NearbyPlaceEntry[] {
  const entries = data?.[key];
  return Array.isArray(entries) ? entries.filter((e) => String(e?.name || '').trim()) : [];
}
