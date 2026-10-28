import { request } from './operationsApi';
import type { CustomerAddress } from '../lib/address/addressTypes';
import { formatAddressLine, formatLocationTrail } from '../lib/address/addressUtils';

/**
 * The signed-in account's address book on the server (GET/PUT /auth/me/addresses),
 * so it follows the shopper across devices and Choosify staff can see it.
 * Each address also carries a readable `summary` / `trail` for the admin view.
 */
export const addressBookApi = {
  get: async (): Promise<CustomerAddress[]> => {
    const result = await request<{ data: CustomerAddress[] }>('/auth/me/addresses');
    return Array.isArray(result.data) ? result.data : [];
  },
  save: async (addresses: CustomerAddress[]): Promise<void> => {
    await request('/auth/me/addresses', 'PUT', {
      addresses: addresses.map((a) => ({ ...a, summary: formatAddressLine(a), trail: formatLocationTrail(a) })),
    });
  },
};
