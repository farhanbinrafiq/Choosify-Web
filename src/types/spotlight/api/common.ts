/**
 * Shared API primitives — LE-005.3.2
 * Reusable by Choosify-Web and choosify-admin-4.0.
 */

export interface SpotlightApiMeta {
  requestId: string;
  timestamp: string;
  version?: string;
}

export interface SpotlightPaginatedRequest {
  cursor?: string;
  page?: number;
  pageSize?: number;
}

export interface SpotlightPaginatedResponse<T> {
  items: T[];
  nextCursor?: string;
  totalEstimate?: number;
  pageSize: number;
}

export interface SpotlightApiResponse<T> {
  data: T;
  meta: SpotlightApiMeta;
}

export interface SpotlightApiListResponse<T> {
  data: SpotlightPaginatedResponse<T>;
  meta: SpotlightApiMeta;
}

export interface SpotlightMutationResponse<T = void> {
  data: T;
  meta: SpotlightApiMeta;
}

/** Actor context passed on mutating requests */
export interface SpotlightActorContext {
  userId: string;
  role: 'seller' | 'moderator' | 'admin' | 'system';
  sellerId?: string;
}

export interface SpotlightIdParam {
  campaignId: string;
}

export interface SpotlightSlugParam {
  slug: string;
}
