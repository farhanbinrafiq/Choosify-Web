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
  | 'cancelled'
  | 'disputed';

/** Granular progress WITHIN 'service_in_progress' — see server/operations/types.ts. */
export type WarrantyClaimServiceStage =
  | 'return_requested'
  | 'in_transit'
  | 'received'
  | 'under_review'
  | 'repair_in_progress'
  | 'replacement_in_progress'
  | 'ready_for_dispatch'
  | 'dispatched'
  | 'delivered';

export type WarrantyClaimResolutionType = 'repaired' | 'replaced' | 'refunded' | 'rejected' | 'no_fault_found' | 'other';

/** The four proof categories a warranty claim's evidence is collected under — each its own upload section. */
export type WarrantyClaimAttachmentCategory = 'warrantyCard' | 'productPhoto' | 'box' | 'receipt';

export const WARRANTY_CLAIM_ATTACHMENT_CATEGORY_LABELS: Record<WarrantyClaimAttachmentCategory, string> = {
  warrantyCard: 'Warranty Card',
  productPhoto: 'Product Issue Photos',
  box: 'Box',
  receipt: 'Original Invoice / Money Receipt',
};

export interface WarrantyClaimTimelineEntry {
  id: string;
  status: WarrantyClaimStatus;
  serviceStage?: WarrantyClaimServiceStage;
  note?: string;
  at: string;
  by?: string;
}

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
  attachmentCategories?: Partial<Record<WarrantyClaimAttachmentCategory, string[]>>;
  status: WarrantyClaimStatus;
  serviceStage?: WarrantyClaimServiceStage;
  sellerResponse?: string;
  resolutionNotes?: string;
  resolutionType?: WarrantyClaimResolutionType;
  estimatedCompletionDate?: string;
  timeline?: WarrantyClaimTimelineEntry[];
  submittedAt: string;
  resolvedAt?: string;
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
    attachmentCategories?: Partial<Record<WarrantyClaimAttachmentCategory, string[]>>;
  }) => {
    const result = await request<{ data: WarrantyClaim; reused?: boolean }>('/operations/warranty-claims', 'POST', payload);
    return result;
  },
  cancel: async (id: string) => {
    const result = await request<{ data: WarrantyClaim }>(`/operations/warranty-claims/${id}/cancel`, 'PATCH');
    return result.data;
  },
  provideInfo: async (id: string, description: string, attachmentMediaIds?: string[]) => {
    const result = await request<{ data: WarrantyClaim }>(`/operations/warranty-claims/${id}/provide-info`, 'PATCH', {
      description,
      attachmentMediaIds,
    });
    return result.data;
  },
  getDocument: async (id: string) => {
    const result = await request<{
      data: {
        claim: WarrantyClaim;
        buyer: { name: string; choosifyUserId: string | null; email: string } | null;
        seller: { name: string; choosifyUserId: string | null; email: string } | null;
        product: { title?: string; variant?: string; serialNumber?: string } | null;
      };
    }>(`/operations/warranty-claims/${id}/document`, 'GET');
    return result.data;
  },
};
