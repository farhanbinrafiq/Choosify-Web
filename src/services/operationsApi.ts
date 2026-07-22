const API_BASE = ((import.meta as any).env?.VITE_API_BASE_URL as string | undefined) || '/api/v1';

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

async function request<T>(path: string, method: HttpMethod = 'GET', body?: unknown): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });
  if (!response.ok) {
    const rawError = await response.text();
    throw new Error(rawError || `Request failed with ${response.status}`);
  }
  return response.json() as Promise<T>;
}

export interface PublicProductReview {
  id: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt: string;
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
    bookingOffer?: unknown;
  }) => {
    const result = await request<{ data: unknown }>('/operations/platform-messages', 'POST', payload);
    return result.data;
  },
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
};
