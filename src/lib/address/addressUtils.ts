import type {
  AddressValidationResult,
  CustomerAddress,
  CustomerAddressDraft,
} from './addressTypes';
import { BANGLADESH_COUNTRY, findLocationName } from './bangladeshLocations';

export const ADDRESS_STORAGE_KEY = 'choosify_customer_addresses';

export function createEmptyAddressDraft(): CustomerAddressDraft {
  return {
    label: 'Home',
    type: 'home',
    recipientName: '',
    phone: '',
    location: {
      countryId: BANGLADESH_COUNTRY.id,
      divisionId: '',
      districtId: '',
      upazilaId: '',
      unionOrWard: '',
      cityId: '',
      postalCodeId: '',
      postalCode: '',
      districtName: '',
      upazilaName: '',
      cityName: '',
      manualDistrict: false,
      manualUpazila: false,
      manualCity: false,
      manualPostalCode: false,
    },
    area: '',
    customArea: '',
    isCustomLocation: false,
    houseOrBuilding: '',
    floorOrUnit: '',
    landmark: '',
    deliveryInstructions: '',
    verificationStatus: 'new',
  };
}

export function validateAddressDraft(draft: CustomerAddressDraft): AddressValidationResult {
  const errors: AddressValidationResult['errors'] = {};
  const loc = draft.location;

  if (!draft.label.trim()) errors.label = 'Address name is required';
  if (!loc.countryId) errors.country = 'Country is required';
  if (!loc.divisionId) errors.division = 'Division is required';
  // District / City stay required — satisfied by either a structured selection
  // or an intentional manual fallback value, never by an empty field.
  if (!loc.districtId && !loc.districtName?.trim()) errors.district = 'District is required';
  if (!loc.cityId && !loc.cityName?.trim()) errors.city = 'City is required';
  if (!loc.postalCode.trim()) errors.postalCode = 'Postal code is required';
  if (!draft.area.trim() && !draft.customArea?.trim()) errors.area = 'Area / block / road is required';
  if (!draft.houseOrBuilding.trim()) errors.houseOrBuilding = 'House / building is required';

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
}

export function draftToAddress(
  draft: CustomerAddressDraft,
  options?: { id?: string; isDefault?: boolean; createdAt?: string },
): CustomerAddress {
  const now = new Date().toISOString();
  const location = draft.location;
  return {
    id: options?.id ?? `addr-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    ...draft,
    location: {
      ...location,
      districtName: location.districtName?.trim() || undefined,
      upazilaName: location.upazilaName?.trim() || undefined,
      cityName: location.cityName?.trim() || undefined,
      postalCode: location.postalCode.trim(),
    },
    label: draft.label.trim(),
    area: draft.area.trim(),
    customArea: draft.customArea?.trim(),
    houseOrBuilding: draft.houseOrBuilding.trim(),
    floorOrUnit: draft.floorOrUnit?.trim(),
    landmark: draft.landmark?.trim(),
    deliveryInstructions: draft.deliveryInstructions?.trim(),
    isDefault: options?.isDefault ?? false,
    verificationStatus: draft.verificationStatus ?? 'new',
    createdAt: options?.createdAt ?? now,
    updatedAt: now,
    reserved: {},
  };
}

export function addressToDraft(address: CustomerAddress): CustomerAddressDraft {
  return {
    label: address.label,
    type: address.type,
    recipientName: address.recipientName,
    phone: address.phone,
    location: address.location,
    // Area / Road is a single free-text field now; fold any legacy customArea
    // value into it so editing an older address does not lose it.
    area: address.area || address.customArea || '',
    customArea: undefined,
    isCustomLocation: address.isCustomLocation,
    houseOrBuilding: address.houseOrBuilding,
    floorOrUnit: address.floorOrUnit,
    landmark: address.landmark,
    deliveryInstructions: address.deliveryInstructions,
    verificationStatus: address.verificationStatus,
  };
}

export function formatAddressLine(address: CustomerAddress): string {
  const area = address.isCustomLocation && address.customArea ? address.customArea : address.area;
  const { location } = address;
  return [
    address.houseOrBuilding,
    address.floorOrUnit,
    area,
    location.unionOrWard,
    findLocationName(location.cityId) || location.cityName,
    location.postalCode,
  ]
    .filter(Boolean)
    .join(', ');
}

export function formatLocationTrail(address: CustomerAddress): string {
  const { location } = address;
  return [
    findLocationName(location.divisionId),
    findLocationName(location.districtId) || location.districtName,
    findLocationName(location.upazilaId) || location.upazilaName,
    findLocationName(location.cityId) || location.cityName,
  ]
    .filter(Boolean)
    .join(' / ');
}

export function getDefaultAddress(addresses: CustomerAddress[]): CustomerAddress | undefined {
  return addresses.find((address) => address.isDefault) ?? addresses[0];
}

export function normalizeDefaultAddress(addresses: CustomerAddress[]): CustomerAddress[] {
  if (addresses.length === 0) return addresses;
  if (addresses.some((address) => address.isDefault)) return addresses;
  return addresses.map((address, index) => ({ ...address, isDefault: index === 0 }));
}
