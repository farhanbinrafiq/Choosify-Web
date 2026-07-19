import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { cn } from '../../lib/utils';

const TOP_COUPONS = [
  { pct: '10%', code: 'CHOOSIFY10', min: 'Min. Spend BDT 5,000' },
  { pct: '15%', code: 'SAVE15', min: 'Min. Spend BDT 10,000' },
  { pct: '5%', code: 'EMI5', min: 'Min. Spend BDT 3,000' },
] as const;

/** Choosify.dc.html dealsTrustStrip — authentic / guarantee strip */
const DEALS_TRUST = [
  { icon: '🛡', bg: '#DBEAFE', title: '100% Authentic', sub: 'Verified products & sellers' },
  { icon: '🔒', bg: '#FFEDD5', title: 'Best Price Guarantee', sub: 'We beat any lower price' },
  { icon: '↺', bg: '#DCFCE7', title: 'Easy Returns', sub: '7-day return policy' },
  { icon: '🔐', bg: '#F3E8FF', title: 'Secure Payments', sub: '100% secure checkout' },
  { icon: '🎧', bg: '#FEE2E2', title: '24/7 Support', sub: "We're here to help" },
] as const;

const POPULAR_DEAL_CATS = [
  { name: 'Smartphones', icon: '📱' },
  { name: 'Laptops', icon: '💻' },
  { name: 'Audio', icon: '🎧' },
  { name: 'Smart Watches', icon: '⌚' },
  { name: 'Home Appliances', icon: '🏠' },
  { name: 'Gaming', icon: '🎮' },
  { name: 'Accessories', icon: '🔌' },
  { name: 'Cameras', icon: '📷' },
] as const;

const BRAND_DEALS_ROW = [
  { name: 'SAMSUNG', off: 'Up to 20% Off', color: '#1428A0' },
  { name: 'Apple', off: 'Up to 15% Off', color: '#1A1A2E' },
  { name: 'mi', off: 'Up to 18% Off', color: '#EB4501' },
  { name: 'SONY', off: 'Up to 25% Off', color: '#1A1A2E' },
  { name: 'DELL', off: 'Up to 20% Off', color: '#2323FF' },
  { name: 'ASUS', off: 'Up to 20% Off', color: '#1A1A2E' },
] as const;

export function DealsTopCouponsCard({ className }: { className?: string }) {
  const [copied, setCopied] = useState<string | null>(null);

  return (
    <div
      className={cn(
        'bg-white rounded-xl border border-[#E8EDF2] p-5 flex flex-col',
        className,
      )}
    >
      <div className="flex justify-between items-center mb-3.5">
        <div className="text-[13px] font-extrabold text-[#1A1A2E]">TOP COUPONS</div>
        <Link
          to="/deals?tab=promo"
          className="text-[11px] font-bold text-[#1A1A2E] no-underline hover:text-[#CF4400]"
        >
          VIEW ALL COUPONS ›
        </Link>
      </div>
      <div className="flex flex-col gap-2.5 mb-3.5 flex-1">
        {TOP_COUPONS.map((cp) => (
          <div
            key={cp.code}
            className="flex items-center gap-3 border border-dashed border-[#E5E7EB] rounded-lg px-3 py-2.5"
          >
            <div className="text-sm font-extrabold text-[#EB4501] w-[38px] shrink-0">{cp.pct}</div>
            <div className="flex-1 min-w-0">
              <div className="text-[11px] font-bold text-[#1A1A2E]">Use Code: {cp.code}</div>
              <div className="text-[9.5px] text-[#9AA0AC]">{cp.min}</div>
            </div>
            <button
              type="button"
              onClick={() => {
                void navigator.clipboard.writeText(cp.code);
                setCopied(cp.code);
                setTimeout(() => setCopied(null), 1500);
              }}
              className="text-[9.5px] font-extrabold text-[#2323FF] cursor-pointer shrink-0 bg-transparent border-0 p-0 hover:underline"
            >
              {copied === cp.code ? 'COPIED' : 'COPY'}
            </button>
          </div>
        ))}
      </div>
      <Link
        to="/deals?tab=promo"
        className="text-[11.5px] font-bold text-center block text-[#1A1A2E] no-underline hover:text-[#CF4400]"
      >
        MORE COUPONS ›
      </Link>
    </div>
  );
}

/** Choosify authentication / trust guarantees — dealsTrustStrip */
export function DealsAuthenticationStrip({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'bg-white rounded-xl border border-[#E8EDF2] px-5 sm:px-6 py-5 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5',
        className,
      )}
      aria-label="Choosify authentication guarantees"
    >
      {DEALS_TRUST.map((tb) => (
        <div key={tb.title} className="flex items-center gap-2.5 min-w-0">
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-sm"
            style={{ backgroundColor: tb.bg }}
            aria-hidden
          >
            {tb.icon}
          </div>
          <div className="min-w-0">
            <div className="text-[11.5px] font-bold text-[#1A1A2E] truncate">{tb.title}</div>
            <div className="text-[9.5px] text-[#9AA0AC] leading-snug">{tb.sub}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

export function DealsPopularCategoriesCard({
  onCategoryClick,
  className,
}: {
  onCategoryClick?: (name: string) => void;
  className?: string;
}) {
  return (
    <div className={cn('bg-white rounded-xl border border-[#E8EDF2] p-5', className)}>
      <div className="flex justify-between items-center mb-3.5">
        <div className="text-[13px] font-extrabold text-[#1A1A2E]">POPULAR DEAL CATEGORIES</div>
        <Link
          to="/categories"
          className="text-[11px] font-bold text-[#1A1A2E] no-underline hover:text-[#CF4400]"
        >
          VIEW ALL ›
        </Link>
      </div>
      <div className="grid grid-cols-2 gap-2.5">
        {POPULAR_DEAL_CATS.map((pc) => (
          <button
            key={pc.name}
            type="button"
            onClick={() => onCategoryClick?.(pc.name)}
            className="flex items-center gap-2 text-[11.5px] text-[#4B5563] cursor-pointer bg-transparent border-0 p-1.5 rounded-md hover:bg-[#F4F7F9] text-left"
          >
            <span aria-hidden>{pc.icon}</span> {pc.name}
          </button>
        ))}
      </div>
    </div>
  );
}

export function DealsBrandDealsCard({ className }: { className?: string }) {
  return (
    <div className={cn('bg-white rounded-xl border border-[#E8EDF2] p-5', className)}>
      <div className="flex justify-between items-center mb-3.5">
        <div className="text-[13px] font-extrabold text-[#1A1A2E]">BRAND DEALS</div>
        <Link
          to="/brands"
          className="text-[11px] font-bold text-[#1A1A2E] no-underline hover:text-[#CF4400]"
        >
          VIEW ALL BRANDS ›
        </Link>
      </div>
      <div className="grid grid-cols-3 sm:grid-cols-6 gap-2.5">
        {BRAND_DEALS_ROW.map((bd) => (
          <Link
            key={bd.name}
            to="/brands"
            className="border border-[#E8EDF2] rounded-lg px-2 py-3 text-center no-underline hover:border-[#EB4501]/40 transition-colors"
          >
            <div className="text-xs font-extrabold mb-2" style={{ color: bd.color }}>
              {bd.name}
            </div>
            <div className="text-[9.5px] text-[#9AA0AC]">{bd.off}</div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export function DealsSubscribeBanner({ className }: { className?: string }) {
  const [email, setEmail] = useState('');

  return (
    <div
      className={cn(
        'choosify-dark-surface rounded-xl px-7 py-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-white',
        className,
      )}
    >
      <div>
        <div className="text-[15px] font-bold mb-1">🎁 NEVER MISS A DEAL!</div>
        <div className="text-xs text-white/55">
          Subscribe and get top deals straight to your inbox.
        </div>
      </div>
      <form
        className="flex gap-2.5 w-full sm:w-auto"
        onSubmit={(e) => {
          e.preventDefault();
          setEmail('');
        }}
      >
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          className="w-full sm:w-[240px] h-11 rounded-lg border-0 px-4 text-[12.5px] text-[#1A1A2E]"
        />
        <button
          type="submit"
          className="bg-[#EB4501] text-white border-0 px-[22px] rounded-lg text-xs font-bold cursor-pointer hover:brightness-110 shrink-0"
        >
          SUBSCRIBE
        </button>
      </form>
    </div>
  );
}

/** Portrait / vertical sidebar advertise unit — Choosify.dc.html listing rails */
export function DealsVerticalSponsoredCard({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'bg-[#FFF6EF] rounded-[10px] overflow-hidden border-[1.5px] border-dashed border-[#EB4501] relative flex flex-col min-h-[320px]',
        className,
      )}
    >
      <div className="absolute top-2 left-2 bg-[#1A1A2E] text-white text-[8px] font-extrabold px-1.5 py-0.5 rounded-sm z-[1]">
        SPONSORED
      </div>
      <div className="h-[160px] bg-gradient-to-br from-[#EB4501] to-[#2323FF] flex items-end justify-center pb-3">
        <span className="text-white text-[12px] font-extrabold text-center px-3">
          PROMOTE YOUR DEAL
        </span>
      </div>
      <div className="p-4 flex flex-col flex-1">
        <div className="text-[10px] font-bold text-[#9AA0AC] tracking-wide mb-1">ADVERTISEMENT</div>
        <div className="text-[13px] font-semibold text-[#1A1A2E] mb-3 leading-snug">
          Reach 2M+ shoppers with a featured deal slot
        </div>
        <Link
          to="/advertise"
          className="mt-auto w-full bg-[#EB4501] text-white text-center border-none py-2.5 rounded-md text-[11.5px] font-extrabold hover:brightness-110 no-underline"
        >
          ADVERTISE HERE →
        </Link>
      </div>
    </div>
  );
}
