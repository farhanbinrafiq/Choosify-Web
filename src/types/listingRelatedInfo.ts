import type { ServiceCategory } from './serviceBooking';

/** Five fixed What's Nearby buckets (CMS + storefront share these keys). */
export type NearbyCategoryKey =
  | 'restaurant_cafe'
  | 'entertainment_attraction'
  | 'hospital_police'
  | 'transport_airport'
  | 'shopping_atm';

export interface NearbyPlaceEntry {
  name: string;
  distance?: string;
  note?: string;
}

export type WhatsNearbyData = Partial<Record<NearbyCategoryKey, NearbyPlaceEntry[]>>;

export type BeforeVisitFieldKey =
  | 'parkingAvailability'
  | 'cancellationPolicy'
  | 'whatToBring'
  | 'wheelchairAccess'
  | 'insuranceAccepted';

export type BeforeYourVisitData = Partial<Record<BeforeVisitFieldKey, string>>;

export type RelatedInfoSectionKind =
  | 'price_across_stores'
  | 'whats_nearby'
  | 'before_your_visit';

export type RelatedInfoVisibility = 'mandatory' | 'optional' | 'seller_enabled';

export interface RelatedInfoSectionRule {
  kind: RelatedInfoSectionKind;
  visibility: RelatedInfoVisibility;
  /** Before Your Visit — which CMS fields apply for this service category */
  beforeVisitFields?: BeforeVisitFieldKey[];
}

export type ListingRelatedInfoProduct = {
  productType?: string;
  serviceCategory?: string;
  priceAcrossStoresEnabled?: boolean;
  storeComparisonList?: Array<{
    id?: string;
    storeName: string;
    price: number;
    availability?: string;
    storeUrl?: string;
  }>;
  whatsNearby?: WhatsNearbyData;
  beforeYourVisit?: BeforeYourVisitData;
};

export function isPhysicalListing(product: ListingRelatedInfoProduct | null | undefined): boolean {
  return String(product?.productType || 'physical').toLowerCase() !== 'service';
}

export function relatedInfoServiceCategory(
  product: ListingRelatedInfoProduct | null | undefined,
): ServiceCategory | null {
  if (!product || isPhysicalListing(product)) return null;
  const raw = String(product.serviceCategory || '').trim().toLowerCase();
  if (!raw) return null;
  return raw.replace(/-/g, '_') as ServiceCategory;
}
