export type ServiceCategory =
  | 'hotels'
  | 'restaurants'
  | 'travel'
  | 'doctors'
  | 'education'
  | 'beauty'
  | 'real_estate'
  | 'transport';

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
  sellerRespondBy: string;
  buyerPayBy?: string;
  declineReason?: string;
  orderId?: string;
}
