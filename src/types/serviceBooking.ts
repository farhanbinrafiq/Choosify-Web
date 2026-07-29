export type ServiceCategory =
  | 'hotels'
  | 'restaurants'
  | 'travel'
  | 'doctors'
  | 'education'
  | 'beauty'
  | 'real_estate'
  | 'transport'
  | 'events'
  | 'tickets'
  | 'home_services'
  | 'gov_services'
  | 'recruitment'
  | 'b2b'
  | 'rental'
  | 'donation';

export type BookingOfferStatus =
  | 'pending'
  | 'accepted'
  | 'declined'
  | 'countered'
  | 'buyer_accepted'
  | 'buyer_declined'
  | 'expired'
  | 'payment_expired'
  | 'paid';

export interface BookingRequestField {
  key: string;
  label: string;
  type: 'text' | 'number' | 'date' | 'time' | 'select' | 'textarea';
  required?: boolean;
  options?: string[];
  min?: number;
}

export interface BookingOfferCard {
  kind: 'booking_offer';
  requestId: string;
  version: number;
  listingId: string;
  listingTitle: string;
  listingImage?: string;
  listingHref: string;
  sellerId: string;
  sellerName: string;
  buyerId: string;
  serviceCategory?: ServiceCategory;
  isService: boolean;
  fields: Record<string, string | number>;
  notes?: string;
  price: number;
  originalPrice?: number;
  currency: 'BDT';
  status: BookingOfferStatus;
  createdAt: string;
  /** True when the listing skipped manual seller acceptance — buyer can pay immediately. */
  autoApproved?: boolean;
  /** Listing allows paying a deposit now with the rest due at check-in/service, instead of full payment. */
  partialPaymentEnabled?: boolean;
  /** Seller's chosen deposit percent when partialPaymentEnabled. */
  depositPercent?: number;
  sellerRespondBy: string;
  buyerPayBy?: string;
  declineReason?: string;
  orderId?: string;
}
