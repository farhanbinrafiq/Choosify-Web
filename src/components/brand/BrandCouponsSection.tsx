import React from 'react';
import { toast } from '../../lib/notify';
import { DragScrollContainer } from '../FilterEngine';
import { cn } from '../../lib/utils';

export type BrandCoupon = {
  pct: string;
  code: string;
  min: string;
};

export function buildBrandCoupons(brandName: string): BrandCoupon[] {
  const code = brandName.replace(/\s+/g, '').toUpperCase().slice(0, 12);
  return [
    { pct: '10%', code: `${code}10`, min: 'Min. Spend BDT 20,000' },
    { pct: '15%', code: `${code}15`, min: 'Min. Spend BDT 50,000' },
    { pct: '5%', code: `${code}STUDENT`, min: 'Student ID Required' },
    { pct: '৳2000', code: `${code}FLAT2K`, min: 'Min. Spend BDT 80,000' },
  ];
}

function copyCouponCode(code: string) {
  void navigator.clipboard.writeText(code).then(
    () => toast.success(`Promo Code "${code}" copied to clipboard!`),
    () => toast.error('Could not copy code'),
  );
}

/** Wide vertical coupon tile with copy — used in Brand Details deals row. */
export function BrandCouponCard({
  coupon,
  className,
}: {
  coupon: BrandCoupon;
  className?: string;
}) {
  return (
    <div
      className={cn(
        'flex items-center gap-3 bg-white border border-dashed border-[#E8EDF2] rounded-[10px] px-4 py-3.5 min-h-[72px]',
        className,
      )}
    >
      <div className="text-[16px] font-extrabold text-[#FF5B00] w-11 shrink-0 leading-none">
        {coupon.pct}
      </div>
      <div className="min-w-0 flex-1">
        <div className="text-[12.5px] font-bold text-[#1A1A2E] truncate">{coupon.code}</div>
        <div className="text-[10.5px] text-[#9AA0AC] truncate">{coupon.min}</div>
      </div>
      <button
        type="button"
        onClick={() => copyCouponCode(coupon.code)}
        className="shrink-0 h-8 px-2.5 rounded-lg border border-[#E8EDF2] hover:border-[#FF5B00] bg-[#F4F7F9] hover:bg-[#FFF3EA] text-[10px] font-extrabold uppercase tracking-wider text-[#FF5B00] cursor-pointer transition-colors"
        aria-label={`Copy code ${coupon.code}`}
      >
        Copy
      </button>
    </div>
  );
}

/** Up to 3 coupons stacked beside product deals. */
export function BrandCouponsStack({
  coupons,
  limit = 3,
  className,
}: {
  coupons: BrandCoupon[];
  limit?: number;
  className?: string;
}) {
  const items = coupons.slice(0, limit);
  if (items.length === 0) return null;

  return (
    <div
      className={cn(
        'w-full lg:w-[260px] xl:w-[280px] shrink-0 flex flex-col gap-2.5',
        className,
      )}
    >
      {items.map((cp) => (
        <BrandCouponCard key={cp.code} coupon={cp} className="flex-1" />
      ))}
    </div>
  );
}

/** Coupon tile sized to match a ProductCard grid tile — used as a carousel item. */
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

/** Fallback horizontal strip (when deals section is hidden). */
export function BrandCouponsSection({
  brandName,
  coupons,
}: {
  brandName: string;
  coupons?: BrandCoupon[];
}) {
  const items = coupons ?? buildBrandCoupons(brandName);

  return (
    <div className="w-full">
      <h3 className="text-[15px] font-extrabold text-[#1A1A2E] mb-3.5">
        {brandName.toUpperCase()} COUPONS
      </h3>
      <DragScrollContainer className="flex gap-3.5 overflow-x-auto pb-2 no-scrollbar snap-x snap-mandatory">
        {items.map((cp) => (
          <BrandCouponCard
            key={cp.code}
            coupon={cp}
            className="w-[280px] sm:w-[300px] shrink-0 snap-start"
          />
        ))}
      </DragScrollContainer>
    </div>
  );
}
