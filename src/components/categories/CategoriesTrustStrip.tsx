import React from 'react';
import { ShieldCheck, CreditCard, RotateCcw, BadgeCheck, Headphones } from 'lucide-react';
import { cn } from '../../lib/utils';
import { CATEGORY_CONTENT_MAX } from '../../lib/design/categoryTokens';

const TRUST_ITEMS = [
  { id: 'verified', label: '100% Verified', icon: BadgeCheck },
  { id: 'payments', label: 'Secure Payments', icon: CreditCard },
  { id: 'returns', label: 'Easy Returns', icon: RotateCcw },
  { id: 'price', label: 'Price Guarantee', icon: ShieldCheck },
  { id: 'support', label: '24/7 Support', icon: Headphones },
];

interface CategoriesTrustStripProps {
  className?: string;
}

export function CategoriesTrustStrip({ className }: CategoriesTrustStripProps) {
  return (
    <section
      className={cn('bg-[#F7F8FA] border-t border-[#eef2f6]', className)}
      aria-label="Choosify trust guarantees"
    >
      <div className={cn(CATEGORY_CONTENT_MAX, 'py-10 md:py-12')}>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-4">
          {TRUST_ITEMS.map(({ id, label, icon: Icon }) => (
            <div
              key={id}
              className="flex flex-col items-center text-center gap-2.5 p-4 md:p-5 rounded-2xl bg-white border border-[#eef2f6] shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
            >
              <div className="w-10 h-10 rounded-full bg-[#E8500A]/10 text-[#E8500A] flex items-center justify-center">
                <Icon size={18} aria-hidden />
              </div>
              <span className="text-xs font-semibold text-[#1A1D4E]">{label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
