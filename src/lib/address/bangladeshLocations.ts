import type { LocationNode, PostalLocation } from './addressTypes';

export const BANGLADESH_COUNTRY: LocationNode = {
  id: 'BD',
  name: 'Bangladesh',
};

export const BANGLADESH_DIVISIONS: LocationNode[] = [
  { id: 'BD-10', name: 'Barishal', parentId: 'BD' },
  { id: 'BD-20', name: 'Chattogram', parentId: 'BD' },
  { id: 'BD-30', name: 'Dhaka', parentId: 'BD' },
  { id: 'BD-40', name: 'Khulna', parentId: 'BD' },
  { id: 'BD-45', name: 'Mymensingh', parentId: 'BD' },
  { id: 'BD-50', name: 'Rajshahi', parentId: 'BD' },
  { id: 'BD-55', name: 'Rangpur', parentId: 'BD' },
  { id: 'BD-60', name: 'Sylhet', parentId: 'BD' },
];

export const BANGLADESH_DISTRICTS: LocationNode[] = [
  { id: 'BD-10-BAR', name: 'Barishal', parentId: 'BD-10' },
  { id: 'BD-10-BHO', name: 'Bhola', parentId: 'BD-10' },
  { id: 'BD-20-CTG', name: 'Chattogram', parentId: 'BD-20' },
  { id: 'BD-20-CXB', name: "Cox's Bazar", parentId: 'BD-20' },
  { id: 'BD-20-COM', name: 'Cumilla', parentId: 'BD-20' },
  { id: 'BD-20-FEN', name: 'Feni', parentId: 'BD-20' },
  { id: 'BD-30-DHK', name: 'Dhaka', parentId: 'BD-30' },
  { id: 'BD-30-GAZ', name: 'Gazipur', parentId: 'BD-30' },
  { id: 'BD-30-NAR', name: 'Narayanganj', parentId: 'BD-30' },
  { id: 'BD-30-FAR', name: 'Faridpur', parentId: 'BD-30' },
  { id: 'BD-40-KHU', name: 'Khulna', parentId: 'BD-40' },
  { id: 'BD-40-JES', name: 'Jashore', parentId: 'BD-40' },
  { id: 'BD-45-MYM', name: 'Mymensingh', parentId: 'BD-45' },
  { id: 'BD-45-JAM', name: 'Jamalpur', parentId: 'BD-45' },
  { id: 'BD-50-RAJ', name: 'Rajshahi', parentId: 'BD-50' },
  { id: 'BD-50-BOG', name: 'Bogura', parentId: 'BD-50' },
  { id: 'BD-55-RAN', name: 'Rangpur', parentId: 'BD-55' },
  { id: 'BD-55-DIN', name: 'Dinajpur', parentId: 'BD-55' },
  { id: 'BD-60-SYL', name: 'Sylhet', parentId: 'BD-60' },
  { id: 'BD-60-MOU', name: 'Moulvibazar', parentId: 'BD-60' },
];

export const BANGLADESH_UPAZILAS: LocationNode[] = [
  { id: 'BD-30-DHK-DHN', name: 'Dhanmondi', parentId: 'BD-30-DHK' },
  { id: 'BD-30-DHK-GUL', name: 'Gulshan', parentId: 'BD-30-DHK' },
  { id: 'BD-30-DHK-MIR', name: 'Mirpur', parentId: 'BD-30-DHK' },
  { id: 'BD-30-DHK-UTR', name: 'Uttara', parentId: 'BD-30-DHK' },
  { id: 'BD-30-GAZ-GAZ', name: 'Gazipur Sadar', parentId: 'BD-30-GAZ' },
  { id: 'BD-30-NAR-NAR', name: 'Narayanganj Sadar', parentId: 'BD-30-NAR' },
  { id: 'BD-30-FAR-FAR', name: 'Faridpur Sadar', parentId: 'BD-30-FAR' },
  { id: 'BD-20-CTG-KOT', name: 'Kotwali', parentId: 'BD-20-CTG' },
  { id: 'BD-20-CTG-PHC', name: 'Panchlaish', parentId: 'BD-20-CTG' },
  { id: 'BD-20-CXB-CXB', name: "Cox's Bazar Sadar", parentId: 'BD-20-CXB' },
  { id: 'BD-20-COM-COM', name: 'Cumilla Sadar', parentId: 'BD-20-COM' },
  { id: 'BD-20-FEN-FEN', name: 'Feni Sadar', parentId: 'BD-20-FEN' },
  { id: 'BD-10-BAR-BAR', name: 'Barishal Sadar', parentId: 'BD-10-BAR' },
  { id: 'BD-10-BHO-BHO', name: 'Bhola Sadar', parentId: 'BD-10-BHO' },
  { id: 'BD-40-KHU-SON', name: 'Sonadanga', parentId: 'BD-40-KHU' },
  { id: 'BD-40-JES-JES', name: 'Jashore Sadar', parentId: 'BD-40-JES' },
  { id: 'BD-45-MYM-MYM', name: 'Mymensingh Sadar', parentId: 'BD-45-MYM' },
  { id: 'BD-45-JAM-JAM', name: 'Jamalpur Sadar', parentId: 'BD-45-JAM' },
  { id: 'BD-50-RAJ-RAJ', name: 'Rajshahi Sadar', parentId: 'BD-50-RAJ' },
  { id: 'BD-50-BOG-BOG', name: 'Bogura Sadar', parentId: 'BD-50-BOG' },
  { id: 'BD-55-RAN-RAN', name: 'Rangpur Sadar', parentId: 'BD-55-RAN' },
  { id: 'BD-55-DIN-DIN', name: 'Dinajpur Sadar', parentId: 'BD-55-DIN' },
  { id: 'BD-60-SYL-SYL', name: 'Sylhet Sadar', parentId: 'BD-60-SYL' },
  { id: 'BD-60-MOU-MOU', name: 'Moulvibazar Sadar', parentId: 'BD-60-MOU' },
];

export const BANGLADESH_CITIES: LocationNode[] = [
  { id: 'BD-30-DHK-DHN-DHC', name: 'Dhaka City', parentId: 'BD-30-DHK-DHN' },
  { id: 'BD-30-DHK-GUL-DNC', name: 'Dhaka North City', parentId: 'BD-30-DHK-GUL' },
  { id: 'BD-30-DHK-MIR-DNC', name: 'Dhaka North City', parentId: 'BD-30-DHK-MIR' },
  { id: 'BD-30-DHK-UTR-DNC', name: 'Dhaka North City', parentId: 'BD-30-DHK-UTR' },
  { id: 'BD-30-GAZ-GAZ-GCC', name: 'Gazipur City', parentId: 'BD-30-GAZ-GAZ' },
  { id: 'BD-30-NAR-NAR-NCC', name: 'Narayanganj City', parentId: 'BD-30-NAR-NAR' },
  { id: 'BD-30-FAR-FAR-FMC', name: 'Faridpur Municipality', parentId: 'BD-30-FAR-FAR' },
  { id: 'BD-20-CTG-KOT-CCC', name: 'Chattogram City', parentId: 'BD-20-CTG-KOT' },
  { id: 'BD-20-CTG-PHC-CCC', name: 'Chattogram City', parentId: 'BD-20-CTG-PHC' },
  { id: 'BD-20-CXB-CXB-CMC', name: "Cox's Bazar Municipality", parentId: 'BD-20-CXB-CXB' },
  { id: 'BD-20-COM-COM-CMC', name: 'Cumilla City', parentId: 'BD-20-COM-COM' },
  { id: 'BD-20-FEN-FEN-FMC', name: 'Feni Municipality', parentId: 'BD-20-FEN-FEN' },
  { id: 'BD-10-BAR-BAR-BCC', name: 'Barishal City', parentId: 'BD-10-BAR-BAR' },
  { id: 'BD-10-BHO-BHO-BMC', name: 'Bhola Municipality', parentId: 'BD-10-BHO-BHO' },
  { id: 'BD-40-KHU-SON-KCC', name: 'Khulna City', parentId: 'BD-40-KHU-SON' },
  { id: 'BD-40-JES-JES-JMC', name: 'Jashore Municipality', parentId: 'BD-40-JES-JES' },
  { id: 'BD-45-MYM-MYM-MCC', name: 'Mymensingh City', parentId: 'BD-45-MYM-MYM' },
  { id: 'BD-45-JAM-JAM-JMC', name: 'Jamalpur Municipality', parentId: 'BD-45-JAM-JAM' },
  { id: 'BD-50-RAJ-RAJ-RCC', name: 'Rajshahi City', parentId: 'BD-50-RAJ-RAJ' },
  { id: 'BD-50-BOG-BOG-BMC', name: 'Bogura Municipality', parentId: 'BD-50-BOG-BOG' },
  { id: 'BD-55-RAN-RAN-RCC', name: 'Rangpur City', parentId: 'BD-55-RAN-RAN' },
  { id: 'BD-55-DIN-DIN-DMC', name: 'Dinajpur Municipality', parentId: 'BD-55-DIN-DIN' },
  { id: 'BD-60-SYL-SYL-SCC', name: 'Sylhet City', parentId: 'BD-60-SYL-SYL' },
  { id: 'BD-60-MOU-MOU-MMC', name: 'Moulvibazar Municipality', parentId: 'BD-60-MOU-MOU' },
];

export const BANGLADESH_POSTAL_LOCATIONS: PostalLocation[] = [
  { id: 'BD-30-DHK-DHN-1209', name: 'Dhanmondi', parentId: 'BD-30-DHK-DHN-DHC', cityId: 'BD-30-DHK-DHN-DHC', postalCode: '1209' },
  { id: 'BD-30-DHK-GUL-1212', name: 'Gulshan', parentId: 'BD-30-DHK-GUL-DNC', cityId: 'BD-30-DHK-GUL-DNC', postalCode: '1212' },
  { id: 'BD-30-DHK-MIR-1216', name: 'Mirpur', parentId: 'BD-30-DHK-MIR-DNC', cityId: 'BD-30-DHK-MIR-DNC', postalCode: '1216' },
  { id: 'BD-30-DHK-UTR-1230', name: 'Uttara', parentId: 'BD-30-DHK-UTR-DNC', cityId: 'BD-30-DHK-UTR-DNC', postalCode: '1230' },
  { id: 'BD-30-GAZ-GAZ-1700', name: 'Gazipur Sadar', parentId: 'BD-30-GAZ-GAZ-GCC', cityId: 'BD-30-GAZ-GAZ-GCC', postalCode: '1700' },
  { id: 'BD-30-NAR-NAR-1400', name: 'Narayanganj Sadar', parentId: 'BD-30-NAR-NAR-NCC', cityId: 'BD-30-NAR-NAR-NCC', postalCode: '1400' },
  { id: 'BD-30-FAR-FAR-7800', name: 'Faridpur Sadar', parentId: 'BD-30-FAR-FAR-FMC', cityId: 'BD-30-FAR-FAR-FMC', postalCode: '7800' },
  { id: 'BD-20-CTG-KOT-4000', name: 'Chattogram GPO', parentId: 'BD-20-CTG-KOT-CCC', cityId: 'BD-20-CTG-KOT-CCC', postalCode: '4000' },
  { id: 'BD-20-CTG-PHC-4203', name: 'Panchlaish', parentId: 'BD-20-CTG-PHC-CCC', cityId: 'BD-20-CTG-PHC-CCC', postalCode: '4203' },
  { id: 'BD-20-CXB-CXB-4700', name: "Cox's Bazar", parentId: 'BD-20-CXB-CXB-CMC', cityId: 'BD-20-CXB-CXB-CMC', postalCode: '4700' },
  { id: 'BD-20-COM-COM-3500', name: 'Cumilla Sadar', parentId: 'BD-20-COM-COM-CMC', cityId: 'BD-20-COM-COM-CMC', postalCode: '3500' },
  { id: 'BD-20-FEN-FEN-3900', name: 'Feni Sadar', parentId: 'BD-20-FEN-FEN-FMC', cityId: 'BD-20-FEN-FEN-FMC', postalCode: '3900' },
  { id: 'BD-10-BAR-BAR-8200', name: 'Barishal Sadar', parentId: 'BD-10-BAR-BAR-BCC', cityId: 'BD-10-BAR-BAR-BCC', postalCode: '8200' },
  { id: 'BD-10-BHO-BHO-8300', name: 'Bhola Sadar', parentId: 'BD-10-BHO-BHO-BMC', cityId: 'BD-10-BHO-BHO-BMC', postalCode: '8300' },
  { id: 'BD-40-KHU-SON-9100', name: 'Khulna GPO', parentId: 'BD-40-KHU-SON-KCC', cityId: 'BD-40-KHU-SON-KCC', postalCode: '9100' },
  { id: 'BD-40-JES-JES-7400', name: 'Jashore Sadar', parentId: 'BD-40-JES-JES-JMC', cityId: 'BD-40-JES-JES-JMC', postalCode: '7400' },
  { id: 'BD-45-MYM-MYM-2200', name: 'Mymensingh Sadar', parentId: 'BD-45-MYM-MYM-MCC', cityId: 'BD-45-MYM-MYM-MCC', postalCode: '2200' },
  { id: 'BD-45-JAM-JAM-2000', name: 'Jamalpur Sadar', parentId: 'BD-45-JAM-JAM-JMC', cityId: 'BD-45-JAM-JAM-JMC', postalCode: '2000' },
  { id: 'BD-50-RAJ-RAJ-6000', name: 'Rajshahi GPO', parentId: 'BD-50-RAJ-RAJ-RCC', cityId: 'BD-50-RAJ-RAJ-RCC', postalCode: '6000' },
  { id: 'BD-50-BOG-BOG-5800', name: 'Bogura Sadar', parentId: 'BD-50-BOG-BOG-BMC', cityId: 'BD-50-BOG-BOG-BMC', postalCode: '5800' },
  { id: 'BD-55-RAN-RAN-5400', name: 'Rangpur Sadar', parentId: 'BD-55-RAN-RAN-RCC', cityId: 'BD-55-RAN-RAN-RCC', postalCode: '5400' },
  { id: 'BD-55-DIN-DIN-5200', name: 'Dinajpur Sadar', parentId: 'BD-55-DIN-DIN-DMC', cityId: 'BD-55-DIN-DIN-DMC', postalCode: '5200' },
  { id: 'BD-60-SYL-SYL-3100', name: 'Sylhet Sadar', parentId: 'BD-60-SYL-SYL-SCC', cityId: 'BD-60-SYL-SYL-SCC', postalCode: '3100' },
  { id: 'BD-60-MOU-MOU-3200', name: 'Moulvibazar Sadar', parentId: 'BD-60-MOU-MOU-MMC', cityId: 'BD-60-MOU-MOU-MMC', postalCode: '3200' },
];

export function getDistrictsForDivision(divisionId: string): LocationNode[] {
  return BANGLADESH_DISTRICTS.filter((district) => district.parentId === divisionId);
}

export function getUpazilasForDistrict(districtId: string): LocationNode[] {
  return BANGLADESH_UPAZILAS.filter((upazila) => upazila.parentId === districtId);
}

export function getCitiesForUpazila(upazilaId: string): LocationNode[] {
  return BANGLADESH_CITIES.filter((city) => city.parentId === upazilaId);
}

export function getPostalCodesForCity(cityId: string): PostalLocation[] {
  return BANGLADESH_POSTAL_LOCATIONS.filter((postal) => postal.cityId === cityId);
}

export function findLocationName(id?: string): string {
  if (!id) return '';
  return (
    [
      BANGLADESH_COUNTRY,
      ...BANGLADESH_DIVISIONS,
      ...BANGLADESH_DISTRICTS,
      ...BANGLADESH_UPAZILAS,
      ...BANGLADESH_CITIES,
      ...BANGLADESH_POSTAL_LOCATIONS,
    ].find((location) => location.id === id)?.name ?? ''
  );
}
