import React from 'react';
import { Link } from 'react-router-dom';
import { Copy } from 'lucide-react';
import { cn } from '../lib/utils';
import { toast } from '../lib/notify';

/**
 * Featured Brand Deals + Featured Promocodes — reusable, viewport-agnostic.
 *
 * Extracted verbatim from the /brands right-hand sidebar. That legacy `<aside>`
 * is `hidden lg:flex` and is additionally forced to `display:none` at every
 * width >= 1024px by the `.choosify-listing-feed-only` page shell, so it never
 * renders. The live placement is inside `<main>` on /brands, shown at all
 * widths (1 col on phones, 2 cols from `sm`). This is not a "mobile" component.
 *
 * Renders a fragment of two self-contained cards — the parent owns the layout.
 * Presentation only. No ad slot / analytics here; the (dead) sidebar still
 * carries the single `<AdSenseSlot format="sidebar" />` declaration, so there
 * is exactly one ad request. No element ids → safe to render more than once.
 */

interface BrandDeal {
  id: string;
  name: string;
  dealHighlight: string;
  logo: string;
  bgClass: string;
}

const BRAND_DEALS: BrandDeal[] = [
  { id: 'aarong', name: "Aarong", dealHighlight: "Flat 15% OFF on Handicrafts", logo: "Aa", bgClass: "bg-orange-primary/95" },
  { id: 'apex', name: "Apex", dealHighlight: "Buy 1 Get 1 Free on Select Shoes", logo: "A", bgClass: "bg-navy" },
  { id: 'sailor', name: "Sailor", dealHighlight: "Flat 20% OFF on Casual Wear", logo: "S", bgClass: "bg-teal-700" },
  { id: 'adidas', name: "Adidas", dealHighlight: "Extra 10% OFF on Sportswear", logo: "Ad", bgClass: "bg-[#1A1D4E]" },
  { id: 'bay', name: "Bay Emporium", dealHighlight: "Up to 30% OFF on Leather Boots", logo: "B", bgClass: "bg-red-700" }
];

interface PromoCode {
  brandId: string;
  brandName: string;
  code: string;
  discount: string;
}

const PROMO_CODES: PromoCode[] = [
  { brandId: 'aarong', brandName: "Aarong", code: "AARONG15", discount: "Flat 15% OFF" },
  { brandId: 'apex', brandName: "Apex", code: "APEXFOOT26", discount: "BDT 500 FLAT" },
  { brandId: 'sailor', brandName: "Sailor", code: "SAILOREID", discount: "Flat 20% OFF" },
  { brandId: 'adidas', brandName: "Adidas", code: "ADIEXTRA10", discount: "10% FLAT OFF" }
];

export function FeaturedBrandDealsPanel() {
  return (
    <>
      {/* FEATURED BRAND DEALS SECTION */}
      <div className="bg-white rounded-2xl border border-[#eef2f6] p-4.5 shadow-sm w-full text-left animate-fade-in">
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#eef2f6] px-1">
          <h3 className="text-[11px] font-semibold text-[#8a9bb0] uppercase tracking-wider">
            Featured Brand Deals
          </h3>
          <Link
            to="/brand-deals"
            className="text-[10px] font-bold text-orange-primary hover:underline flex items-center gap-1"
          >
            See All →
          </Link>
        </div>

        <div className="flex flex-col gap-2.5">
          {BRAND_DEALS.length === 0 ? (
            <div className="text-center py-6 border border-dashed border-gray-200 rounded-2xl">
              <p className="text-xs text-gray-400 font-medium">Featured brand deals will appear here.</p>
            </div>
          ) : (
            BRAND_DEALS.map((item) => (
              <Link
                to={`/brands/${item.id}`}
                key={item.id}
                className="flex items-center gap-3 bg-white border border-[#eef2f6]/60 rounded-2xl p-2 hover:shadow-soft hover:border-[#FF5B00]/10 transition-all duration-300 group cursor-pointer"
              >
                <div className={cn("w-9 h-9 rounded-lg overflow-hidden shrink-0 border border-transparent flex items-center justify-center text-white font-semibold text-xs shadow-sm", item.bgClass)}>
                  {item.logo}
                </div>
                <div className="flex-1 min-w-0 flex flex-col justify-center text-left">
                  <h4 className="font-sans text-xs font-semibold uppercase tracking-tight text-[#1A1D4E] group-hover:text-[#EF3C23] transition-colors truncate">
                    {item.name}
                  </h4>
                  <p className="text-[9px] font-semibold text-gray-400 mt-0.5 truncate uppercase">
                    {item.dealHighlight}
                  </p>
                </div>
                <span className="text-[8px] font-bold text-[#FF5B00] uppercase tracking-wider shrink-0 whitespace-nowrap group-hover:-translate-x-0.5 transition-transform">
                  View Deal
                </span>
              </Link>
            ))
          )}
        </div>
      </div>

      {/* FEATURED PROMOCODES SECTION */}
      <div className="bg-white rounded-2xl border border-[#eef2f6] p-4.5 shadow-sm w-full text-left animate-fade-in">
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#eef2f6] px-1">
          <h3 className="text-[11px] font-semibold text-[#8a9bb0] uppercase tracking-wider">
            Featured Promocodes
          </h3>
        </div>

        <div className="flex flex-col gap-2.5">
          {PROMO_CODES.length === 0 ? (
            <div className="text-center py-6 border border-dashed border-gray-200 rounded-2xl">
              <p className="text-xs text-gray-400 font-medium">No active promo codes available right now.</p>
            </div>
          ) : (
            PROMO_CODES.map((item, idx) => (
              <Link
                to={`/brands/${item.brandId}`}
                key={idx}
                className="bg-white border border-[#eef2f6]/65 hover:border-[#FF5B00]/15 rounded-2xl p-2.5 hover:shadow-soft transition-all duration-300 group cursor-pointer flex flex-col gap-2 text-left"
              >
                {/* Header row with brand details */}
                <div className="flex items-center justify-between gap-2">
                  <div className="min-w-0">
                    <h4 className="font-sans text-xs font-semibold uppercase tracking-tight text-[#1A1D4E] group-hover:text-[#EF3C23] transition-colors truncate">
                      {item.brandName}
                    </h4>
                    <span className="text-[9px] font-bold text-[#FF5B00] uppercase tracking-wide">
                      {item.discount}
                    </span>
                  </div>

                  {/* Copy button */}
                  <button
                    onClick={(e) => {
                      e.preventDefault(); // prevent follow Link navigation
                      e.stopPropagation(); // prevent card container click handler
                      navigator.clipboard.writeText(item.code);
                      toast.success(`Coupon code "${item.code}" copied to clipboard!`);
                    }}
                    className="px-2.5 py-1 bg-[#FF5B00]/10 hover:bg-[#EF3C23] text-[#FF5B00] hover:text-white transition-all cursor-pointer rounded-full text-[8px] font-bold uppercase tracking-wider flex items-center gap-1 shrink-0"
                  >
                    <Copy className="w-2.5 h-2.5" />
                    Copy
                  </button>
                </div>

                {/* Code display window */}
                <div className="bg-gray-50 border border-dashed border-[#eef2f6] rounded-2xl px-2.5 py-1.5 flex items-center justify-between font-mono text-[9.5px] font-semibold text-gray-650 tracking-wider">
                  <span>{item.code}</span>
                  <span className="text-[7.5px] font-sans font-semibold text-gray-400 uppercase">ACTIVE</span>
                </div>
              </Link>
            ))
          )}
        </div>
      </div>
    </>
  );
}
