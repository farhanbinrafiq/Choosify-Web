import React from 'react';

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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {items.map((cp) => (
          <div
            key={cp.code}
            className="flex items-center gap-3 bg-white border border-dashed border-[#E5E7EB] rounded-[10px] px-4 py-3.5"
          >
            <div className="text-[16px] font-extrabold text-[#FF5B00] w-11 shrink-0">
              {cp.pct}
            </div>
            <div className="min-w-0">
              <div className="text-[12.5px] font-bold text-[#1A1A2E] truncate">
                {cp.code}
              </div>
              <div className="text-[10.5px] text-[#9AA0AC]">{cp.min}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
