import { getAccessToken, persistAuthToken, refreshSession } from '../lib/authSession';

/**
 * server/moderation/moderationRouter.ts (choosify-admin-4.0) is mounted at
 * bare `/api`, not `/api/v1` like catalogApi/operationsApi -- every route on
 * it defines its own `/admin/...` or (for this public endpoint) bare
 * `/moderation/...` path, so the real callable URL is
 * `/api/moderation/reports`, never `/api/v1/moderation/reports`.
 */
const VERSIONED_BASE = ((import.meta as any).env?.VITE_API_BASE_URL as string | undefined) || '/api/v1';
const API_BASE = VERSIONED_BASE.replace(/\/v1\/?$/, '');

export type ReportCategory =
  | 'spam'
  | 'fake_product'
  | 'counterfeit'
  | 'abuse'
  | 'copyright'
  | 'incorrect_information'
  | 'fraud'
  | 'other';

export type ReportSource = 'storefront' | 'seller_dashboard' | 'creator_dashboard' | 'consumer_account' | 'admin';

export interface SubmitReportInput {
  category: ReportCategory;
  /** Real backend resourceType vocabulary: product | brand | seller | creator | guide | review | user | consumer | media | campaign | post. */
  resourceType: string;
  /** The real canonical id of the reported entity -- never a display name, index, or fabricated value. */
  resourceId: string;
  resourceLabel?: string;
  description?: string;
  source?: ReportSource;
}

export interface ReportApiError extends Error {
  status?: number;
  serverCode?: string;
}

function doFetch(path: string, body: unknown, token: string | null) {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (token) headers.Authorization = `Bearer ${token}`;
  return fetch(`${API_BASE}${path}`, {
    method: 'POST',
    headers,
    credentials: 'include',
    body: JSON.stringify(body),
  });
}

/**
 * Submits a report to the real, already-existing moderation backend
 * (POST /api/moderation/reports). Reporter identity is derived server-side
 * from the JWT this call carries -- this function never sends a reporter id
 * itself, and callers must not add one.
 */
export async function submitReport(input: SubmitReportInput): Promise<{ id: string; status: string }> {
  const token = getAccessToken();
  if (!token) {
    const err = new Error('You need to be signed in to submit a report.') as ReportApiError;
    err.status = 401;
    throw err;
  }

  let response = await doFetch('/moderation/reports', input, token);

  if (response.status === 401) {
    try {
      const refreshed = await refreshSession();
      if (refreshed?.accessToken) {
        persistAuthToken(refreshed.accessToken);
        response = await doFetch('/moderation/reports', input, refreshed.accessToken);
      }
    } catch {
      // fall through to normal error handling below
    }
  }

  if (!response.ok) {
    const rawText = await response.text();
    let parsed: { error?: string; message?: string; code?: string } | null = null;
    try {
      parsed = JSON.parse(rawText);
    } catch {
      /* plain text body */
    }
    const err = new Error(parsed?.message || parsed?.error || rawText || `Request failed with ${response.status}`) as ReportApiError;
    err.status = response.status;
    err.serverCode = parsed?.code;
    throw err;
  }

  const json = (await response.json()) as { data: { id: string; status: string } };
  return json.data;
}
