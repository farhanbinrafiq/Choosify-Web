import { getAccessToken } from '../lib/authSession';

const API_BASE = ((import.meta as any).env?.VITE_API_BASE_URL as string | undefined) || '/api/v1';

export type WarrantyClaimIssueType =
  | 'not_powering_on'
  | 'manufacturing_defect'
  | 'physical_damage'
  | 'battery_charging'
  | 'performance_software'
  | 'missing_damaged_accessory'
  | 'other';

export type WarrantyClaimStatus =
  | 'submitted'
  | 'acknowledged'
  | 'more_info_required'
  | 'approved'
  | 'rejected'
  | 'service_in_progress'
  | 'resolved'
  | 'cancelled';

export interface WarrantyClaim {
  id: string;
  referenceId?: string;
  orderId: string;
  orderItemId: string;
  consumerId: string;
  sellerId: string;
  brandId: string;
  productId: string;
  warrantyMonthsAtPurchase?: number;
  warrantyTypeAtPurchase?: string;
  warrantyProviderAtPurchase?: string;
  warrantyTermsSnapshot?: string;
  warrantyStartsAt?: string;
  warrantyExpiresAt?: string;
  issueType: WarrantyClaimIssueType;
  description: string;
  attachmentMediaIds: string[];
  status: WarrantyClaimStatus;
  sellerResponse?: string;
  resolutionNotes?: string;
  submittedAt: string;
}

function authHeaders(): Record<string, string> {
  const token = getAccessToken();
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

async function request<T>(path: string, method: string, body?: unknown): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers: authHeaders(),
    credentials: 'include',
    body: body ? JSON.stringify(body) : undefined,
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(json?.error || `Request failed (${res.status})`);
  return json as T;
}

export const warrantyClaimsApi = {
  list: async (consumerId?: string) => {
    const qs = consumerId ? `?consumerId=${encodeURIComponent(consumerId)}` : '';
    const result = await request<{ data: WarrantyClaim[] }>(`/operations/warranty-claims${qs}`, 'GET');
    return result.data;
  },
  create: async (payload: {
    orderId: string;
    orderItemId: string;
    issueType: WarrantyClaimIssueType;
    description: string;
    attachmentMediaIds?: string[];
  }) => {
    const result = await request<{ data: WarrantyClaim; reused?: boolean }>('/operations/warranty-claims', 'POST', payload);
    return result;
  },
  cancel: async (id: string) => {
    const result = await request<{ data: WarrantyClaim }>(`/operations/warranty-claims/${id}/cancel`, 'PATCH');
    return result.data;
  },
};
