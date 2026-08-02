export type UserRole = 'customer' | 'seller' | 'brand' | 'creator' | 'moderator' | 'admin';

export interface User {
  id: string;
  role: UserRole;
  name: string;
  username: string;
  phone: string;
  email: string;
  avatar: string;
  address: string;
  reputation_score: number;
  orderStats: {
    totalOrders: number;
    completedOrders: number;
    cancelledOrders: number;
  };
  verification: {
    verified: boolean;
    docType?: string;
    docUrl?: string;
  };
  premiumStatus: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Seller {
  id: string;
  userId: string;
  businessName: string;
  licenseNo: string;
  verificationDocs: string[];
  ratings: number;
  logistics: {
    provider: string;
    supportedRegions: string[];
  };
  sponsoredStatus: boolean;
  disputeHistory: {
    totalDisputes: number;
    resolvedDisputes: number;
  };
}

export interface Brand {
  id: number;
  catalogId?: string;
  slug?: string;
  name: string;
  logo: string;
  verifiedStatus: boolean;
  followers: number;
  ratings: number;
  sponsoredFlag: boolean;
  featuredFlag: boolean;
  category?: string;
  claimStatus?: 'community' | 'pending' | 'verified';
  /** Original onboard timestamp — used by listing ranking (not updatedAt) */
  createdAt?: string;
  updatedAt?: string;
}

export interface CommerceProduct {
  id: number;
  catalogId?: string;
  /** Catalog/API brand id string (e.g. brand-samsung) before numeric normalization */
  catalogBrandId?: string;
  slug?: string;
  title: string;
  image: string;
  codSupport: boolean;
  stock: number;
  sellerId: string;
  brandId: number;
  brand?: string;
  brandName?: string;
  price: number;
  description: string;
  category?: string;
  variants?: any[];
  rating?: number;
  isDeal?: boolean;
  dealType?: 'flash' | 'seasonal' | 'brand' | 'promo' | 'clearance';
  discountPercent?: number;
  originalPrice?: number;
  promoCode?: string;
  dealValidUntil?: string;
  tags?: string[];
  featuredFlag?: boolean;
  publishedAt?: string;
  createdAt?: string;
  isNewArrival?: boolean;
  isBestseller?: boolean;
  /** Physical catalog item or message-booked service */
  productType?: 'physical' | 'service';
  serviceCategory?: string;
  /** Seller opt-in: buyer may pay a deposit online now, rest due at delivery. */
  partialPaymentEnabled?: boolean;
  depositPercent?: number;
}

export interface SubOrderItem {
  productId: number;
  productTitle: string;
  quantity: number;
  price: number;
  productType?: 'physical' | 'service';
  serviceCategory?: string;
  serviceDetails?: Record<string, string | number>;
}

export interface SubOrder {
  sellerId: string;
  sellerBusinessName: string;
  items: SubOrderItem[];
  deliveryFee: number;
  invoiceId: string;
  trackingStatus: 'pending' | 'dispatched' | 'transit' | 'delivered';
  codCollected?: boolean;
  estimatedDeliveryDate?: string;
  cancellationReason?: string;
}

export interface Order {
  orderId: string;
  buyerId: string;
  isCOD: boolean;
  isSplit: boolean;
  overallTotal: number;
  subtotal?: number;
  deliveryTotal?: number;
  promoCode?: string;
  promoDiscount?: number;
  promoType?: 'flat' | 'percentage' | string;
  paymentMethod?: 'cod' | 'credit' | 'online';
  subOrders: SubOrder[];
  createdAt: string;
  status?: 'pending_payment' | 'active' | 'confirmed' | 'cancelled' | 'completed';
  /** Direct booking orders bypass cart and link to the accepted conversation offer. */
  bookingRequestId?: string;
  paymentDueAt?: string;
  paidAt?: string;
  invoiceGeneratedAt?: string;
  cancelledAt?: string;
  cancellationReason?: string;
  cancelledBy?: 'buyer' | 'seller' | 'admin';
  returnRequested?: boolean;
  returnReason?: string;
  returnRequestedAt?: string;
  disputeId?: string;
  /** COD orders only — delivery fee prepaid online at checkout; product amount stays due at the doorstep. */
  codDeliveryFeePaid?: boolean;
  codDeliveryFeePaidAt?: string;
  codRemainingAmount?: number;
  /** Deposit-now/rest-at-delivery online payment (independent of COD). */
  isPartialPayment?: boolean;
  depositPercent?: number;
  depositAmount?: number;
  remainingAmount?: number;
  /** SSLCommerz gateway lifecycle — alongside `status`, not a replacement for pending_payment. */
  paymentProvider?: 'sslcommerz';
  paymentStatus?: 'unpaid' | 'pending' | 'paid' | 'failed' | 'cancelled';
  paymentTranId?: string;
  paymentValId?: string;
  paidAmount?: number;
  paymentValidatedAt?: string;
}

export interface BuyerReputation {
  userId: string;
  reputationScore: number;
  codTrustScore: number;
  cancellationRatio: number;
  refusalRatio: number;
}

export type ReportType = 'seller' | 'product' | 'brand';

export interface Report {
  report_id: string;
  reporter_id: string;
  type: ReportType;
  targetId: string;
  reason: string;
  description: string;
  evidence?: string;
  status: 'pending' | 'resolved';
  createdAt: string;
}

export interface ReturnRequest {
  id: string;
  orderId: string;
  sellerId: string;
  buyerId: string;
  itemId?: string;
  reason: string;
  description: string;
  evidence?: string;
  evidencePhotos?: string[];
  /** Admin CMS statuses; `pending` kept as a storefront alias for `initiated`. */
  status:
    | 'pending'
    | 'initiated'
    | 'approved'
    | 'rejected'
    | 'returned_in_transit'
    | 'received'
    | 'refunded'
    | 'dispute'
    | 'completed';
  createdAt: string;
  updatedAt?: string;
  resolvedAt?: string;
  refundAmount?: number;
  refundStatus?: string;
  returnTrackingId?: string;
}

export interface PromoCode {
  id: string;
  code: string;
  brandId?: string;
  brandName?: string;
  discountType: 'percentage' | 'flat';
  discountValue: number;
  minOrderValue?: number;
  maxUsage?: number;
  usedCount: number;
  validUntil: string;
  active: boolean;
}
