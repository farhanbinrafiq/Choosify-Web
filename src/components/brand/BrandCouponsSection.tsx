import React from 'react';
import { toast } from '../../lib/notify';
import { cn } from '../../lib/utils';

export type BrandCoupon = {
  pct: string;
  code: string;
  min: string;
};

function copyCouponCode(code: string) {
  void navigator.clipboard.writeText(code).then(
    () => toast.success(`Promo Code "${code}" copied to clipboard!`),
    () => toast.error('Could not copy code'),
  );
}

/** Coupon tile sized to match a ProductCard grid tile — used as a carousel item (Deals page). */
export function BrandCouponCarouselCard({
  coupon,
  className,
}: {
  coupon: BrandCoupon;
  className?: string;
}) {
  return (
    <div
      className={cn(
        'bg-white rounded-[10px] overflow-hidden border border-dashed border-[#E8EDF2] w-full max-w-full h-full flex flex-col',
        className,
      )}
    >
      <div className="h-[170px] shrink-0 bg-[#FFF3EA] flex flex-col items-center justify-center gap-1">
        <div className="text-[26px] font-extrabold text-[#FF5B00] leading-none">{coupon.pct}</div>
        <div className="text-[10px] font-bold uppercase tracking-wider text-[#FF5B00]/70">Off Coupon</div>
      </div>
      <div className="px-3 pt-[11px] pb-3 flex flex-col flex-1 min-h-0 text-left">
        <div className="text-[12.5px] font-bold text-[#1A1A2E] mb-0.5 whitespace-nowrap overflow-hidden text-ellipsis">
          {coupon.code}
        </div>
        <div className="text-[10px] text-[#6B7280] mb-1.5 whitespace-nowrap overflow-hidden text-ellipsis">
          {coupon.min}
        </div>
        <button
          type="button"
          onClick={() => copyCouponCode(coupon.code)}
          className="mt-auto w-full h-8 rounded-lg border border-[#E8EDF2] hover:border-[#FF5B00] bg-[#F4F7F9] hover:bg-[#FFF3EA] text-[10px] font-extrabold uppercase tracking-wider text-[#FF5B00] cursor-pointer transition-colors"
          aria-label={`Copy code ${coupon.code}`}
        >
          Copy Code
        </button>
      </div>
    </div>
  );
}
