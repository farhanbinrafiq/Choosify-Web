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
