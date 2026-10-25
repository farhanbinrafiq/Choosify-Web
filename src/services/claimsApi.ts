import { request } from './operationsApi';
import type { PublicOwnership } from '../types/catalog';

/**
 * Community Claimable Profiles — storefront client. Every decision (who may
 * claim, which documents, ownership changes) is made by the server; this only
 * calls it.
 */

export type ClaimEntityType = 'brand' | 'creator';

export interface ClaimDocumentSpec {
  type: string;
  label: string;
  hint: string;
  required: boolean;
}

export interface ClaimDocument {
  id: string;
  type: string;
  name: string;
  status: 'pending' | 'approved' | 'rejected';
  notes: string | null;
}

/** Who is claiming — collected before the documents; the server requires it to submit. */
export interface ClaimantDetails {
  relationship: 'owner' | 'representative';
  roleTitle: string;
  fullName: string;
  phone: string;
  email: string;
}

export interface MyClaim {
  id: string;
  status: 'Draft' | 'Submitted' | 'Under Review' | 'Approved' | 'Rejected' | 'Withdrawn' | 'Expired';
  created_at: string;
  updated_at: string;
  closedReason: string | null;
  claimantDetails?: ClaimantDetails | null;
  documents: ClaimDocument[];
  latestFeedback: string | null;
  history?: Array<{ at: string; action: string; details: string }>;
}

export interface ClaimIntentView {
  intent: { id: string; entityType: ClaimEntityType; entityId: string; expiresAt: string; source: string };
  target: { id: string; name: string; slug: string; image: string; category: string };
  ownership: PublicOwnership;
  viewer: {
    authenticated: boolean;
    role: string | null;
    requiredRole: 'seller' | 'creator';
    eligible: boolean;
    isOwner: boolean;
    isStaff: boolean;
  };
  requiredDocuments: ClaimDocumentSpec[];
  myClaim: MyClaim | null;
}

export const ACTIVE_CLAIM_STATUSES = new Set<MyClaim['status']>(['Draft', 'Submitted', 'Under Review']);

export const claimsApi = {
  /** Start a claim from a profile page — returns the server-issued claim reference. */
  startIntent: async (entityType: ClaimEntityType, entityId: string) => {
    const r = await request<{ data: { id: string; expiresAt: string; ownership: PublicOwnership } }>(
      '/operations/claim-intents',
      'POST',
      { entityType, entityId, source: 'storefront' },
    );
    return r.data;
  },
  resolveIntent: async (intentId: string) => {
    const r = await request<{ data: ClaimIntentView }>(`/operations/claim-intents/${encodeURIComponent(intentId)}`);
    return r.data;
  },
  /** Opens (or reuses) the claimant's Draft claim for the intent's profile. */
  openDraft: async (view: ClaimIntentView) => {
    const r = await request<{ data: { id: string } }>('/operations/verifications', 'POST', {
      entityType: view.intent.entityType,
      entityId: view.intent.entityId,
      claimIntentId: view.intent.id,
      claimSource: 'storefront',
      status: 'Draft',
      documents: [],
    });
    return r.data;
  },
  saveClaimantDetails: async (claimId: string, details: ClaimantDetails) =>
    request<{ data: unknown }>(`/operations/verifications/${encodeURIComponent(claimId)}/claimant-details`, 'PATCH', details),
  addDocument: async (claimId: string, doc: { type: string; name: string; doc_url: string }) =>
    request<{ data: unknown }>(`/operations/verifications/${encodeURIComponent(claimId)}/documents`, 'POST', doc),
  submit: async (claimId: string) =>
    request<{ data: unknown }>(`/operations/verifications/${encodeURIComponent(claimId)}/submit`, 'PATCH', {}),
  withdraw: async (claimId: string) =>
    request<{ data: unknown }>(`/operations/verifications/${encodeURIComponent(claimId)}/withdraw`, 'POST', {}),
  communityCopy: async () => {
    const r = await request<{ data: { brandDisclaimer: string; creatorDisclaimer: string; claimReviewNotice: string } }>(
      '/catalog/site/community-profiles',
    );
    return r.data;
  },
};
