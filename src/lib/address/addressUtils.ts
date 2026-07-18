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

  if (!draft.label.trim()) errors.label = 'Address name is required';
  if (!draft.location.countryId) errors.country = 'Country is required';
  if (!draft.location.divisionId) errors.division = 'Division is required';
  if (!draft.location.districtId) errors.district = 'District is required';
  if (!draft.location.cityId) errors.city = 'City is required';
  if (!draft.location.postalCode) errors.postalCode = 'Postal code is required';
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
  return {
    id: options?.id ?? `addr-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    ...draft,
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
    area: address.area,
    customArea: address.customArea,
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
  return [
    address.houseOrBuilding,
    address.floorOrUnit,
    area,
    address.location.unionOrWard,
    findLocationName(address.location.cityId),
    address.location.postalCode,
  ]
    .filter(Boolean)
    .join(', ');
}

export function formatLocationTrail(address: CustomerAddress): string {
  return [
    findLocationName(address.location.divisionId),
    findLocationName(address.location.districtId),
    findLocationName(address.location.upazilaId),
    findLocationName(address.location.cityId),
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
