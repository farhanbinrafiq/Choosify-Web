import type { BookingOfferCard } from '../types/serviceBooking';
import { getAccessToken } from '../lib/authSession';

const API_BASE = ((import.meta as any).env?.VITE_API_BASE_URL as string | undefined) || '/api/v1';

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

async function request<T>(path: string, method: HttpMethod = 'GET', body?: unknown): Promise<T> {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  const token = getAccessToken();
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE}${path}`, {
    method,
    headers,
    credentials: 'include',
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });
  if (!response.ok) {
    const rawError = await response.text();
    let parsed: { error?: string; message?: string } | null = null;
    try {
      parsed = JSON.parse(rawError) as { error?: string; message?: string };
    } catch {
      /* plain text */
    }
    const err = new Error(parsed?.message || parsed?.error || rawError || `Request failed with ${response.status}`) as Error & {
      code?: string;
      status?: number;
    };
    err.code = parsed?.error;
    err.status = response.status;
    throw err;
  }
  return response.json() as Promise<T>;
}

/** Shape of the pending-payment order server/booking/bookingService.ts builds and returns
 * from accept/buyer-accept — already persisted server-side, so the client only needs to
 * mirror it into local state (never re-POST it). */
export interface ServerBookingOrder {
  id: string;
  orderId: string;
  buyerId: string;
  isCOD: boolean;
  isSplit: boolean;
  overallTotal: number;
  subtotal?: number;
  deliveryTotal?: number;
  paymentMethod?: string;
  status?: string;
  bookingRequestId?: string;
  paymentDueAt?: string;
  createdAt: string;
  updatedAt?: string;
  subOrders: Array<{
    sellerId: string;
    sellerBusinessName: string;
    invoiceId: string;
    deliveryFee: number;
    items: Array<{
      productId: string;
      productTitle: string;
      quantity: number;
      price: number;
      productType?: 'physical' | 'service';
      serviceCategory?: string;
      serviceDetails?: Record<string, string | number>;
    }>;
  }>;
}

export interface PublicProductReview {
  id: string;
  userName: string;
  userId?: string;
  /** Uploaded profile photo URL when the reviewer has one */
  userAvatar?: string;
  rating: number;
  comment: string;
  createdAt: string;
  productId?: string;
  productTitle?: string;
  brandName?: string;
  response?: { id: string; author: string; comment: string; timestamp: string };
}

export interface TrackedShipment {
  id: string;
  orderId: string;
  status: string;
  courier: string;
  trackingNumber: string;
  trackingEvents: {
    id: string;
    timestamp: string;
    status: string;
    location: string;
    description: string;
  }[];
}

export const operationsApi = {
  createOrder: async (payload: Record<string, unknown>) => {
    const result = await request<{ data: Record<string, unknown> }>('/operations/orders', 'POST', payload);
    return result.data;
  },
  listOrders: async (params?: {
    buyerId?: string;
    sellerId?: string;
    status?: string;
  }): Promise<Record<string, unknown>[]> => {
    const qs = new URLSearchParams();
    if (params?.buyerId) qs.set('buyerId', params.buyerId);
    if (params?.sellerId) qs.set('sellerId', params.sellerId);
    if (params?.status) qs.set('status', params.status);
    const suffix = qs.toString() ? `?${qs}` : '';
    const result = await request<{ data: Record<string, unknown>[] }>(`/operations/orders${suffix}`);
    return result.data;
  },
  getSslcommerzStatus: async (): Promise<{
    configured: boolean;
    provider: string;
    mode: 'sandbox' | 'live' | null;
  }> => {
    const result = await request<{
      data: { configured: boolean; provider: string; mode: 'sandbox' | 'live' | null };
    }>('/operations/payments/sslcommerz/status');
    return result.data;
  },
  initSslcommerzPayment: async (payload: {
    orderId: string;
    customerEmail?: string;
  }): Promise<{ redirectUrl: string; tranId: string; orderId: string; amount: number }> => {
    const result = await request<{
      data: { redirectUrl: string; tranId: string; orderId: string; amount: number };
    }>('/operations/payments/sslcommerz/init', 'POST', payload);
    return result.data;
  },
  getOrder: async (orderId: string): Promise<Record<string, unknown>> => {
    const result = await request<{ data: Record<string, unknown> }>(
      `/operations/orders/${encodeURIComponent(orderId)}`,
    );
    return result.data;
  },
  cancelOrder: async (
    orderId: string,
    buyerId: string,
    reason: string,
  ): Promise<Record<string, unknown>> => {
    const result = await request<{ data: Record<string, unknown> }>(
      `/operations/orders/${encodeURIComponent(orderId)}/cancel`,
      'POST',
      { buyerId, reason },
    );
    return result.data;
  },
  listReturns: async (buyerId?: string): Promise<import('../types/schemas').ReturnRequest[]> => {
    const qs = buyerId ? `?buyerId=${encodeURIComponent(buyerId)}` : '';
    const result = await request<{ data: import('../types/schemas').ReturnRequest[] }>(
      `/operations/returns${qs}`,
    );
    return result.data;
  },
  createReturn: async (payload: {
    orderId: string;
    buyerId: string;
    sellerId: string;
    itemId?: string;
    reason: string;
    description: string;
    evidencePhotos?: string[];
    initiatedBy?: 'customer' | 'admin';
  }): Promise<import('../types/schemas').ReturnRequest> => {
    const result = await request<{ data: import('../types/schemas').ReturnRequest }>(
      '/operations/returns',
      'POST',
      payload,
    );
    return result.data;
  },
  validateCoupon: async (payload: {
    code: string;
    cartTotal: number;
    userId?: string;
    cartItems?: { id: string; price: number; category?: string; brand?: string; quantity?: number }[];
  }): Promise<{ valid: boolean; discount: number; type?: string; code?: string; reason?: string }> =>
    request('/operations/coupons/validate', 'POST', payload),
  submitReview: async (payload: {
    userId?: string;
    userName?: string;
    userAvatar?: string;
    productId?: string;
    productTitle: string;
    brandName?: string;
    storeName?: string;
    rating: number;
    comment: string;
  }) => {
    const result = await request<{ data: unknown }>('/operations/reviews', 'POST', payload);
    return result.data;
  },
  listProductReviews: async (productId: string): Promise<PublicProductReview[]> => {
    const result = await request<{ data: PublicProductReview[] }>(
      `/operations/reviews/public?productId=${encodeURIComponent(productId)}`,
    );
    return result.data;
  },
  listBrandReviews: async (brandName: string): Promise<PublicProductReview[]> => {
    const result = await request<{ data: PublicProductReview[] }>(
      `/operations/reviews/public?brandName=${encodeURIComponent(brandName)}`,
    );
    return result.data;
  },
  listMyReviews: async (userId?: string): Promise<Array<Record<string, unknown>>> => {
    const qs = new URLSearchParams();
    if (userId) qs.set('userId', userId);
    const suffix = qs.toString() ? `?${qs}` : '';
    const result = await request<{ data: Array<Record<string, unknown>> }>(
      `/operations/reviews${suffix}`,
    );
    return result.data;
  },
  listPlatformMessages: async (params?: {
    conversationId?: string;
    threadId?: string;
    userId?: string;
  }): Promise<{ data: Array<Record<string, unknown>>; conversationId?: string }> => {
    const qs = new URLSearchParams();
    if (params?.conversationId) qs.set('conversationId', params.conversationId);
    if (params?.threadId) qs.set('threadId', params.threadId);
    if (params?.userId) qs.set('userId', params.userId);
    const suffix = qs.toString() ? `?${qs}` : '';
    return request(`/operations/platform-messages${suffix}`);
  },
  submitLead: async (payload: {
    brandName: string;
    contactPerson?: string;
    email: string;
    budget?: string;
    placementInterest?: string;
    message?: string;
    source?: string;
  }) => {
    const result = await request<{ data: unknown }>('/operations/leads', 'POST', payload);
    return result.data;
  },
  submitPlatformMessage: async (payload: {
    buyerId: string;
    userName: string;
    body: string;
    orderId?: string;
    sellerId?: string;
    conversationId?: string;
    isComplaint?: boolean;
    bookingOffer?: unknown;
    /** Used by server when ops store has no order row yet (close-only enforcement). */
    orderSnapshot?: {
      orderId?: string;
      status?: string;
      cancelledAt?: string;
      subOrders?: Array<{
        trackingStatus?: string;
        items?: Array<{
          productType?: 'physical' | 'service';
          serviceCategory?: string;
          serviceDetails?: Record<string, string | number>;
        }>;
      }>;
    };
  }) => {
    const result = await request<{ data: unknown }>('/operations/platform-messages', 'POST', payload);
    return result.data;
  },
  getConversationExpiry: async (orderId: string) => {
    const result = await request<{ data: Record<string, unknown> }>(
      `/operations/conversation-expiry?orderId=${encodeURIComponent(orderId)}`,
    );
    return result.data;
  },
  getBookingRequest: async (requestId: string): Promise<BookingOfferCard> => {
    const result = await request<{ data: BookingOfferCard }>(`/booking/requests/${encodeURIComponent(requestId)}`);
    return result.data;
  },
  payBookingRequest: async (requestId: string, orderId?: string, paymentType: 'full' | 'partial' = 'full') => {
    const result = await request<{ data: unknown; request: unknown }>(
      `/booking/requests/${encodeURIComponent(requestId)}/mark-paid`,
      'POST',
      { orderId, paymentType },
    );
    return result.data;
  },
  acceptBookingRequest: async (
    requestId: string,
    sellerId: string,
    sellerName?: string,
  ): Promise<{ data: BookingOfferCard; order: ServerBookingOrder }> =>
    request(`/booking/requests/${encodeURIComponent(requestId)}/accept`, 'POST', { sellerId, sellerName }),
  declineBookingRequest: async (
    requestId: string,
    sellerId: string,
    sellerName: string | undefined,
    declineReason: string,
  ): Promise<{ data: BookingOfferCard }> =>
    request(`/booking/requests/${encodeURIComponent(requestId)}/decline`, 'POST', {
      sellerId,
      sellerName,
      declineReason,
    }),
  counterBookingRequest: async (
    requestId: string,
    sellerId: string,
    sellerName: string | undefined,
    patch: { price?: number; fields?: Record<string, string | number>; notes?: string },
  ): Promise<{ data: BookingOfferCard }> =>
    request(`/booking/requests/${encodeURIComponent(requestId)}/counter`, 'POST', {
      sellerId,
      sellerName,
      ...patch,
    }),
  buyerAcceptCounter: async (
    requestId: string,
    buyerId: string,
  ): Promise<{ data: BookingOfferCard; order: ServerBookingOrder }> =>
    request(`/booking/requests/${encodeURIComponent(requestId)}/buyer-accept`, 'POST', { buyerId }),
  buyerDeclineBookingRequest: async (
    requestId: string,
    buyerId: string,
    declineReason?: string,
  ): Promise<{ data: BookingOfferCard }> =>
    request(`/booking/requests/${encodeURIComponent(requestId)}/buyer-decline`, 'POST', {
      buyerId,
      ...(declineReason !== undefined ? { declineReason } : {}),
    }),
  submitSellerOffer: async (payload: {
    productName: string;
    category: string;
    brand: string;
    price: string;
    description: string;
    sellerName: string;
    sellerPhone: string;
    sellerRegion: string;
  }) => {
    const result = await request<{ data: unknown }>('/operations/seller-offers', 'POST', payload);
    return result.data;
  },
  trackShipment: async (orderId: string): Promise<TrackedShipment> => {
    const result = await request<{ data: TrackedShipment }>(
      `/operations/shipments/track/${encodeURIComponent(orderId)}`,
    );
    return result.data;
  },
  getFeatureFlags: async (): Promise<Record<string, boolean>> => {
    const result = await request<{ flags: Record<string, boolean> }>('/operations/feature-flags');
    return result.flags;
  },
  getSellerStatus: async (
    email: string,
  ): Promise<{ hasSellerAccount: boolean; dashboardPath?: string }> =>
    request(`/auth/seller-status?email=${encodeURIComponent(email)}`),

  listPublicJobs: async (): Promise<PublicJobPosting[]> => {
    const result = await request<{ data: PublicJobPosting[] }>('/operations/jobs/public');
    return result.data;
  },
  getPublicJob: async (idOrSlug: string): Promise<PublicJobPosting> => {
    const result = await request<{ data: PublicJobPosting }>(
      `/operations/jobs/public/${encodeURIComponent(idOrSlug)}`,
    );
    return result.data;
  },
  uploadResume: async (payload: {
    data: string;
    mimeType: string;
    fileName: string;
  }): Promise<{ url: string; fileName?: string }> => {
    const result = await request<{ success: boolean; url: string; fileName?: string }>(
      '/operations/media/upload-resume',
      'POST',
      payload,
    );
    return { url: result.url, fileName: result.fileName };
  },
  submitJobApplication: async (payload: {
    jobId: string;
    name: string;
    email: string;
    phone?: string;
    resumeUrl: string;
    resumeFileName?: string;
    coverLetter?: string;
  }) => {
    const result = await request<{ data: unknown }>('/operations/job-applications', 'POST', payload);
    return result.data;
  },
  /** Manual order created by a seller from the Meta inbox — preview shown before sign-in. */
  getOrderClaim: async (token: string): Promise<OrderClaimPreview> => {
    const result = await request<{ data: OrderClaimPreview }>(
      `/operations/orders/claim/${encodeURIComponent(token)}`,
    );
    return result.data;
  },
  confirmOrderClaim: async (
    token: string,
    payload: { buyerId: string; buyerName?: string },
  ): Promise<Record<string, unknown>> => {
    const result = await request<{ data: Record<string, unknown> }>(
      `/operations/orders/claim/${encodeURIComponent(token)}/confirm`,
      'POST',
      payload,
    );
    return result.data;
  },
  createVerification: async (payload: Record<string, unknown>) => {
    const result = await request<{ data: unknown }>('/operations/verifications', 'POST', payload);
    return result.data;
  },
  listVerifications: async (params?: { status?: string; entityType?: string; entityId?: string }) => {
    const qs = new URLSearchParams();
    if (params?.status) qs.set('status', params.status);
    if (params?.entityType) qs.set('entityType', params.entityType);
    if (params?.entityId) qs.set('entityId', params.entityId);
    const suffix = qs.toString() ? `?${qs}` : '';
    const result = await request<{ data: unknown[] }>(`/operations/verifications${suffix}`);
    return result.data;
  },
};

export interface OrderClaimSubOrderItem {
  productId: number;
  productTitle: string;
  quantity: number;
  price: number;
  productType?: 'physical' | 'service';
}

export interface OrderClaimSubOrder {
  sellerId: string;
  sellerBusinessName: string;
  items: OrderClaimSubOrderItem[];
  deliveryFee: number;
  invoiceId: string;
  trackingStatus: string;
}

export interface OrderClaimPreview {
  orderId: string;
  overallTotal: number;
  subtotal?: number;
  deliveryTotal?: number;
  isCOD: boolean;
  paymentMethod?: string;
  platformSource?: 'WhatsApp' | 'Facebook' | 'Instagram' | 'Offline';
  subOrders: OrderClaimSubOrder[];
  createdAt: string;
  claimed: boolean;
  claimedByName?: string;
}

export type PublicJobEmploymentType = 'full_time' | 'part_time' | 'internship' | 'contract';

export interface PublicJobPosting {
  id: string;
  slug: string;
  title: string;
  department: string;
  location: string;
  employmentType: PublicJobEmploymentType;
  summary: string;
  description: string;
  responsibilities: string;
  requirements: string;
  status: 'open' | 'closed' | 'draft';
  postedAt: string;
}
