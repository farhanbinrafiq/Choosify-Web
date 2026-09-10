export type AddressType = 'home' | 'office' | 'parents' | 'university' | 'other';

export type AddressVerificationStatus = 'verified' | 'new' | 'needs_attention';

export interface LocationNode {
  id: string;
  name: string;
  parentId?: string;
}

export interface PostalLocation extends LocationNode {
  postalCode: string;
  cityId: string;
}

export interface AddressLocationSelection {
  countryId: string;
  divisionId: string;
  districtId: string;
  upazilaId: string;
  unionOrWard?: string;
  cityId: string;
  postalCodeId: string;
  postalCode: string;
  /**
   * Manual fallback — used only when a structured option is missing from
   * Choosify's location dataset. When `manual<Field>` is true the matching
   * `<field>Id` is cleared and the typed value lives in `<field>Name`
   * (or, for the postal code, in `postalCode`). Any manual flag being true is
   * what makes `CustomerAddress.isCustomLocation` true — a normal address that
   * only uses the structured selectors is never marked custom.
   */
  districtName?: string;
  upazilaName?: string;
  cityName?: string;
  manualDistrict?: boolean;
  manualUpazila?: boolean;
  manualCity?: boolean;
  manualPostalCode?: boolean;
}

export interface ReservedGeoFields {
  latitude?: number;
  longitude?: number;
  mapProviderId?: string;
  deliveryZoneId?: string;
  gateCode?: string;
}

export interface CustomerAddress {
  id: string;
  label: string;
  type: AddressType;
  recipientName?: string;
  phone?: string;
  location: AddressLocationSelection;
  area: string;
  customArea?: string;
  isCustomLocation: boolean;
  houseOrBuilding: string;
  floorOrUnit?: string;
  landmark?: string;
  deliveryInstructions?: string;
  isDefault: boolean;
  verificationStatus: AddressVerificationStatus;
  reserved?: ReservedGeoFields;
  createdAt: string;
  updatedAt: string;
}

export interface CustomerAddressDraft {
  label: string;
  type: AddressType;
  recipientName?: string;
  phone?: string;
  location: AddressLocationSelection;
  area: string;
  customArea?: string;
  isCustomLocation: boolean;
  houseOrBuilding: string;
  floorOrUnit?: string;
  landmark?: string;
  deliveryInstructions?: string;
  verificationStatus?: AddressVerificationStatus;
}

export interface AddressValidationResult {
  valid: boolean;
  errors: Partial<Record<keyof CustomerAddressDraft | 'country' | 'division' | 'district' | 'city' | 'postalCode', string>>;
}
