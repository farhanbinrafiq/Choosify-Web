export type PaymentMethodKind = 'card' | 'bkash' | 'nagad' | 'rocket';

export type PaymentMethodAttention =
  | 'ok'
  | 'pending_verification'
  | 'expiring_soon'
  | 'expired';

export interface SavedPaymentMethod {
  id: string;
  kind: PaymentMethodKind;
  label: string;
  /** Last 4 digits for cards, or masked MFS number */
  maskedAccount: string;
  brand?: string;
  expiryMonth?: number;
  expiryYear?: number;
  isDefault?: boolean;
  status: PaymentMethodAttention;
  createdAt: string;
}
