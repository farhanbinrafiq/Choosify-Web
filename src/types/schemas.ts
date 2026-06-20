export type UserRole = 'customer' | 'seller' | 'wholesaler' | 'creator' | 'admin';

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
  wholesaleEnabled: boolean;
  disputeHistory: {
    totalDisputes: number;
    resolvedDisputes: number;
  };
}

export interface Brand {
  id: number;
  name: string;
  logo: string;
  verifiedStatus: boolean;
  followers: number;
  ratings: number;
  sponsoredFlag: boolean;
  featuredFlag: boolean;
  wholesaleSupport: boolean;
  category?: string;
  claimStatus?: 'community' | 'pending' | 'verified';
}

export type ProductModeType = 'retail' | 'wholesale';

export interface BulkPriceSlab {
  minQuantity: number;
  price: number;
}

export interface Product {
  id: number;
  title: string;
  image: string;
  mode_type: ProductModeType;
  moq?: number;
  quantitySlabs?: BulkPriceSlab[];
  bulkPricing?: boolean;
  codSupport: boolean;
  quotationSupport: boolean;
  stock: number; // 0 for out of stock, positive for quantity in stock
  sellerId: string;
  brandId: number;
  brand?: string;
  pricingTiers?: BulkPriceSlab[];
  price: number;
  description: string;
  category?: string;
  variants?: any[];
  rating?: number;
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
}

export interface Order {
  orderId: string;
  buyerId: string;
  isCOD: boolean;
  isSplit: boolean;
  overallTotal: number;
  subOrders: SubOrder[];
  createdAt: string;
}

export interface BuyerReputation {
  userId: string;
  reputationScore: number; // 0 - 100
  codTrustScore: number;   // 0 - 100
  cancellationRatio: number; // percentage
  refusalRatio: number;      // percentage
}

export type ReportType = 'seller' | 'product' | 'brand';

export interface Report {
  report_id: string;
  reporter_id: string;
  type: ReportType;
  targetId: string; // seller_id or product_id or brand_id
  reason: string;
  description: string;
  evidence?: string;
  status: 'pending' | 'resolved';
  createdAt: string;
}
