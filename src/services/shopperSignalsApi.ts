import { getAccessToken, persistAuthToken, refreshSession } from '../lib/authSession';

const API_BASE = ((import.meta as any).env?.VITE_API_BASE_URL as string | undefined) || '/api/v1';

export type ShopperSignalList = 'savedProducts' | 'savedBrands' | 'followedCreators';
export type ShopperSignalItem = { id: string; label: string; image?: string };

async function call(path: string, method: 'POST' | 'PUT' | 'DELETE', body?: unknown): Promise<void> {
  const send = (token: string | null) =>
    fetch(`${API_BASE}${path}`, {
      method,
      credentials: 'include',
      headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
      body: body === undefined ? undefined : JSON.stringify(body),
    });
  const token = getAccessToken();
  if (!token) return; // signed out: activity stays in this browser only
  let response = await send(token);
  if (response.status === 401) {
    const refreshed = await refreshSession().catch(() => null);
    if (refreshed?.accessToken) {
      persistAuthToken(refreshed.accessToken);
      response = await send(refreshed.accessToken);
    }
  }
  if (!response.ok) throw new Error(`Shopper signal sync failed (${response.status})`);
}

/**
 * Records a signed-in shopper's saved items and searches on their Choosify
 * account (operations shopper-signals), so they follow the account across
 * devices and Choosify support can see them on the Consumer profile.
 * Best-effort: failures never block the storefront UI.
 */
export const shopperSignalsApi = {
  replaceList: (list: ShopperSignalList, items: ShopperSignalItem[]) =>
    call(`/operations/shopper-signals/me/${list}`, 'PUT', { items }).catch(() => undefined),
  recordSearch: (q: string) => call('/operations/shopper-signals/me/searches', 'POST', { q }).catch(() => undefined),
  removeSearch: (q: string) => call(`/operations/shopper-signals/me/searches?q=${encodeURIComponent(q)}`, 'DELETE').catch(() => undefined),
  clearSearches: () => call('/operations/shopper-signals/me/searches', 'DELETE').catch(() => undefined),
};

/** Maps a storefront product / brand object to a signal item. */
export function toSignalItem(raw: any): ShopperSignalItem | null {
  const id = raw?.id ?? raw?.slug;
  if (id === undefined || id === null || id === '') return null;
  const image = raw?.image || raw?.logo || raw?.images?.[0];
  return { id: String(id), label: String(raw?.title || raw?.name || id), ...(typeof image === 'string' ? { image } : {}) };
}
