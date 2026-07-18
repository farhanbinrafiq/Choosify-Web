import React from 'react';
import {
  BadgeCheck,
  Lock,
  Scale,
  Star,
  ShieldCheck,
  Headphones,
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { colors } from '../../design-system/tokens/colors';
import { radius } from '../../design-system/tokens/radius';
import { shadows } from '../../design-system/tokens/shadows';

const TRUST_ITEMS = [
  {
    id: 'verified',
    icon: BadgeCheck,
    title: 'Verified Sellers',
    description: 'Merchants audited for authenticity and buyer satisfaction.',
  },
  {
    id: 'checkout',
    icon: Lock,
    title: 'Secure Checkout',
    description: 'Encrypted payments and privacy-first checkout flows.',
  },
  {
    id: 'compare',
    icon: Scale,
    title: 'Price Comparison',
    description: 'Side-by-side specs and prices to decide faster.',
  },
  {
    id: 'authentic',
    icon: Star,
    title: 'Authentic Products',
    description: 'Genuine products from trusted distributors and brands.',
  },
  {
    id: 'protection',
    icon: ShieldCheck,
    title: 'Buyer Protection',
    description: 'Shop with confidence through Choosify advocacy standards.',
  },
  {
    id: 'support',
    icon: Headphones,
    title: 'Support',
    description: 'Dedicated help when you need guidance before you buy.',
  },
];

interface TrustStripProps {
  className?: string;
}

export function TrustStrip({ className }: TrustStripProps) {
  return (
    <div
      className={cn('grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6', className)}
      role="list"
      aria-label="Trust and safety highlights"
    >
      {TRUST_ITEMS.map(({ id, icon: Icon, title, description }) => (
        <article
          key={id}
          role="listitem"
          className={cn(
            'p-6 md:p-8 text-left transition-all duration-300 ease-out hover:-translate-y-1',
          )}
          style={{
            borderRadius: radius['2xl'],
            backgroundColor: 'rgba(255,255,255,0.8)',
            border: `1px solid ${colors.border.subtle}`,
            boxShadow: shadows.sm,
          }}
        >
          <div
            className="w-14 h-14 flex items-center justify-center mb-5"
            style={{
              borderRadius: radius['2xl'],
              backgroundColor: `${colors.brand.orange.legacy}1A`,
              color: colors.brand.orange.legacy,
            }}
          >
            <Icon size={26} aria-hidden />
          </div>
          <h3 className="text-sm font-bold mb-2" style={{ color: colors.text.body }}>
            {title}
          </h3>
          <p className="text-xs leading-relaxed" style={{ color: colors.text.muted }}>
            {description}
          </p>
        </article>
      ))}
    </div>
  );
}
