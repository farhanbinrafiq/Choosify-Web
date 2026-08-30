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

export interface BeforeVisitCustomField {
  id: string;
  label: string;
  value: string;
}

export type BeforeYourVisitData = Partial<Record<BeforeVisitFieldKey, string>> & {
  /** Seller-added fields beyond the five presets. */
  customFields?: BeforeVisitCustomField[];
};

/** Seller-defined Related Information section (columns of heading + bullets). */
export interface CustomRelatedInfoData {
  title?: string;
  blocks?: Array<{ id: string; heading: string; items: string[] }>;
}

export type RelatedInfoSectionKind =
  | 'price_across_stores'
  | 'whats_nearby'
  | 'before_your_visit'
  | 'custom';

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
  /** Explicit Related Information variant chosen in Product Studio. */
  relatedInfoType?: 'price_across_stores' | 'whats_nearby' | 'before_your_visit' | 'custom';
  customRelatedInfo?: CustomRelatedInfoData;
  storeComparisonList?: Array<{
    id?: string;
    storeName: string;
    price: number;
    availability?: string;
    storeUrl?: string;
    logoUrl?: string;
    isFeatured?: boolean;
    /** Merge output — true ⇒ Choosify/admin-promoted (render a badge). */
    sponsored?: boolean;
    promoLabel?: string;
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
