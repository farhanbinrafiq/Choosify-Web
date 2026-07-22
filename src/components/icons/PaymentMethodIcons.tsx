import React from 'react';
import { cn } from '../../lib/utils';
import { PAYMENT_ICON, type PaymentIconKey } from './brandIcons';

export type PaymentMethodId = PaymentIconKey;

export const PAYMENT_METHODS: Array<{
  id: PaymentMethodId;
  label: string;
  src: string;
}> = [
  { id: 'visa', label: 'Visa', src: PAYMENT_ICON.visa },
  { id: 'mastercard', label: 'Mastercard', src: PAYMENT_ICON.mastercard },
  { id: 'paypal', label: 'PayPal', src: PAYMENT_ICON.paypal },
  { id: 'amex', label: 'American Express', src: PAYMENT_ICON.amex },
  { id: 'applePay', label: 'Apple Pay', src: PAYMENT_ICON.applePay },
  { id: 'googlePay', label: 'Google Pay', src: PAYMENT_ICON.googlePay },
  { id: 'bkash', label: 'bKash', src: PAYMENT_ICON.bkash },
  { id: 'nagad', label: 'Nagad', src: PAYMENT_ICON.nagad },
  { id: 'ucb', label: 'UCB', src: PAYMENT_ICON.ucb },
  { id: 'cityBank', label: 'City Bank', src: PAYMENT_ICON.cityBank },
  { id: 'bracBank', label: 'BRAC Bank', src: PAYMENT_ICON.bracBank },
  { id: 'easternBank', label: 'Eastern Bank', src: PAYMENT_ICON.easternBank },
  { id: 'standardChartered', label: 'Standard Chartered', src: PAYMENT_ICON.standardChartered },
];

/** Top row gets ceil(n/2); bottom gets floor(n/2) so bottom never has more. */
function splitPaymentRows<T>(items: T[]): [T[], T[]] {
  const mid = Math.ceil(items.length / 2);
  return [items.slice(0, mid), items.slice(mid)];
}

interface PaymentMethodBadgeProps {
  id: PaymentMethodId;
  className?: string;
}

export function PaymentMethodBadge({ id, className }: PaymentMethodBadgeProps) {
  const method = PAYMENT_METHODS.find((m) => m.id === id);
  if (!method) return null;

  return (
    <span
      className={
        className ??
        'inline-flex items-center justify-center h-9 w-[52px] px-1.5 rounded-md overflow-hidden bg-white'
      }
      title={method.label}
      aria-label={method.label}
    >
      <img
        src={method.src}
        alt={method.label}
        className="h-5 w-auto max-w-full object-contain"
        draggable={false}
      />
    </span>
  );
}

export function PaymentMethodsGrid({
  className,
  layout = 'grid',
}: {
  className?: string;
  layout?: 'grid' | 'row';
}) {
  if (layout === 'row') {
    // Uniform auto-fill grid keeps every icon cell the same size and evenly
    // spaced regardless of viewport width (mobile + desktop).
    return (
      <div
        className={cn(
          'grid grid-cols-[repeat(auto-fill,minmax(52px,1fr))] gap-2 max-w-[440px]',
          className,
        )}
      >
        {PAYMENT_METHODS.map((method) => (
          <PaymentMethodBadge
            key={method.id}
            id={method.id}
            className="inline-flex items-center justify-center h-9 w-full px-1.5 rounded-md overflow-hidden bg-white"
          />
        ))}
      </div>
    );
  }

  const [topRow, bottomRow] = splitPaymentRows(PAYMENT_METHODS);

  return (
    <div className={className ?? 'flex flex-col gap-2'}>
      <div className="grid grid-cols-2 gap-2">
        {topRow.map((method) => (
          <PaymentMethodBadge key={method.id} id={method.id} />
        ))}
      </div>
      {bottomRow.length > 0 && (
        <div className="grid grid-cols-2 gap-2">
          {bottomRow.map((method) => (
            <PaymentMethodBadge key={method.id} id={method.id} />
          ))}
        </div>
      )}
    </div>
  );
}
