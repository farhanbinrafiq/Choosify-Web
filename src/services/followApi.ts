import { getAccessToken, persistAuthToken, refreshSession } from '../lib/authSession';

const API_BASE = ((import.meta as any).env?.VITE_API_BASE_URL as string | undefined) || '/api/v1';

type FollowState = { count: number; following: boolean };

async function call<T>(path: string, method: 'GET' | 'POST' | 'DELETE' = 'GET'): Promise<T> {
  const send = (token: string | null) =>
    fetch(`${API_BASE}${path}`, {
      method,
      credentials: 'include',
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
  const token = getAccessToken();
  let response = await send(token);
  if (response.status === 401 && token) {
    const refreshed = await refreshSession().catch(() => null);
    if (refreshed?.accessToken) {
      persistAuthToken(refreshed.accessToken);
      response = await send(refreshed.accessToken);
    }
  }
  if (!response.ok) {
    const body = (await response.json().catch(() => ({}))) as { error?: string };
    const err = new Error(body.error || `Request failed (${response.status})`) as Error & { status?: number };
    err.status = response.status;
    throw err;
  }
  return response.json() as Promise<T>;
}

/** Real brand follows (server-side); counts are shared by every visitor. */
export const followApi = {
  getBrand: (brandId: string) => call<FollowState>(`/follows/brands/${encodeURIComponent(brandId)}`),
  followBrand: (brandId: string) => call<FollowState>(`/follows/brands/${encodeURIComponent(brandId)}`, 'POST'),
  unfollowBrand: (brandId: string) => call<FollowState>(`/follows/brands/${encodeURIComponent(brandId)}`, 'DELETE'),
  myBrands: () => call<{ brandIds: string[] }>('/follows/me/brands').then((r) => r.brandIds),
};

/** Fired after a follow / unfollow so every count on the page updates at once. */
export const BRAND_FOLLOW_COUNT_EVENT = 'choosify-brand-follow-count';
export type BrandFollowCountDetail = { brandId: string; count: number; following: boolean };
