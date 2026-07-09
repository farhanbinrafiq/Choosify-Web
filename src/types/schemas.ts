export type UserRole = 'customer' | 'seller' | 'creator' | 'admin';

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
}

export interface CommerceProduct {
  id: number;
  catalogId?: string;
  slug?: string;
  title: string;
  image: string;
  codSupport: boolean;
  stock: number;
  sellerId: string;
  brandId: number;
  brand?: string;
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
  isNewArrival?: boolean;
  isBestseller?: boolean;
}

export interface SubOrderItem {
  productId: number;
  productTitle: string;
  quantity: number;
  price: number;
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
  subOrders: SubOrder[];
  createdAt: string;
  status?: 'active' | 'cancelled' | 'completed';
  cancelledAt?: string;
  cancellationReason?: string;
  cancelledBy?: 'buyer' | 'seller' | 'admin';
  returnRequested?: boolean;
  returnReason?: string;
  returnRequestedAt?: string;
  disputeId?: string;
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
  reason: string;
  description: string;
  evidence?: string;
  status: 'pending' | 'approved' | 'rejected' | 'completed';
  createdAt: string;
  resolvedAt?: string;
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
