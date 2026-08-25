/** Mirrors choosify-admin shared/manualOrder/manualOrderTypes.ts — Sprint 10. */

export type ManualOrderOfferStatus = 'pending' | 'accepted' | 'rejected';

export interface ManualOrderOfferItem {
  productId: string;
  productTitle: string;
  variantId?: string;
  quantity: number;
  price: number;
  productType?: 'physical' | 'service';
  image?: string;
}

export interface ManualOrderOfferCard {
  kind: 'manual_order_offer';
  offerId: string;
  conversationId: string;
  sellerId: string;
  sellerName?: string;
  buyerId: string;
  buyerName?: string;
  items: ManualOrderOfferItem[];
  notes?: string;
  subtotal: number;
  deliveryTotal: number;
  overallTotal: number;
  currency: 'BDT';
  status: ManualOrderOfferStatus;
  createdAt: string;
  orderId?: string;
  rejectReason?: string;
}
