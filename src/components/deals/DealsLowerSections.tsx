import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { cn } from '../../lib/utils';
import { SponsoredVerticalAdCarousel } from '../commerce/SponsoredVerticalAdCarousel';
import { useGlobalState } from '../../context/GlobalStateContext';
import { getCtaBanner, isCtaBannerVisible } from '../../lib/ctaBanners';
import { getCategoryIconComponent } from '../../lib/categoryIcons';
import { AssuranceStrip } from '../assurance/AssuranceStrip';
import type { StorefrontDealsCuration } from '../../types/catalog';

/*
 * Deals page lower modules. Content is Admin-curated (Storefront Curation →
 * Deals Curation) and resolved server-side against the real coupon / category /
 * brand records with eligibility applied. Each module renders nothing when it
 * has no items — no empty cards, no prototype fallback.
 */

export function DealsTopCouponsCard({
  coupons,
  className,
  onViewAllCoupons,
}: {
  coupons: StorefrontDealsCuration['topCoupons'];
  className?: string;
  /** Same pattern as Discover lane “View All” — activates in-page filter, no navigation. */
  onViewAllCoupons?: () => void;
}) {
  const [copied, setCopied] = useState<string | null>(null);

  if (coupons.length === 0) return null;

  const handleViewAll = () => {
    onViewAllCoupons?.();
  };

  return (
    <div
      className={cn(
        'bg-white rounded-xl border border-[#E8EDF2] p-5 flex flex-col',
        className,
      )}
    >
      <div className="flex justify-between items-center mb-3.5">
        <div className="text-[13px] font-extrabold text-[#1A1A2E]">TOP COUPONS</div>
        <button
          type="button"
          onClick={handleViewAll}
          className="text-[11px] font-bold text-[#1A1A2E] hover:text-[#EF3C23] cursor-pointer bg-transparent border-0 p-0 min-h-[44px] sm:min-h-0"
        >
          VIEW ALL COUPONS ›
        </button>
      </div>
      <div className="flex flex-col gap-2.5 mb-3.5 flex-1">
        {coupons.map((cp) => (
          <div
            key={cp.code}
            className="flex items-center gap-3 border border-dashed border-[#E5E7EB] rounded-lg px-3 py-2.5"
          >
            <div className="text-sm font-extrabold text-[#FF5B00] min-w-[38px] shrink-0">{cp.headline}</div>
            <div className="flex-1 min-w-0">
              <div className="text-[11px] font-bold text-[#1A1A2E] truncate">Use Code: {cp.code}</div>
              <div className="text-[9.5px] text-[#9AA0AC]">{cp.detail}</div>
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
      <button
        type="button"
        onClick={handleViewAll}
        className="text-[11.5px] font-bold text-center block w-full text-[#1A1A2E] hover:text-[#EF3C23] cursor-pointer bg-transparent border-0 p-0"
      >
        MORE COUPONS ›
      </button>
    </div>
  );
}

/** Choosify authentication / trust guarantees — CMS placement `deals.assurance_strip`. */
export function DealsAuthenticationStrip({ className }: { className?: string }) {
  return <AssuranceStrip placement="deals.assurance_strip" className={className} />;
}

export function DealsPopularCategoriesCard({
  categories,
  onCategoryClick,
  className,
}: {
  categories: StorefrontDealsCuration['popularCategories'];
  onCategoryClick?: (name: string) => void;
  className?: string;
}) {
  if (categories.length === 0) return null;
  return (
    <div className={cn('bg-white rounded-xl border border-[#E8EDF2] p-5', className)}>
      <div className="flex justify-between items-center mb-3.5">
        <div className="text-[13px] font-extrabold text-[#1A1A2E]">POPULAR DEAL CATEGORIES</div>
        <Link
          to="/categories"
          className="text-[11px] font-bold text-[#1A1A2E] no-underline hover:text-[#EF3C23]"
        >
          VIEW ALL ›
        </Link>
      </div>
      <div className="grid grid-cols-2 gap-2.5">
        {categories.map((pc) => (
          <button
            key={pc.id}
            type="button"
            onClick={() => onCategoryClick?.(pc.name)}
            className="flex items-center gap-2 text-[11.5px] text-[#4B5563] cursor-pointer bg-transparent border-0 p-1.5 rounded-md hover:bg-[#F4F7F9] text-left"
          >
            <span className="inline-flex w-4 h-4 shrink-0" aria-hidden>
              {getCategoryIconComponent(pc.name, pc.icon, '#FF5B00')}
            </span>
            {pc.name}
          </button>
        ))}
      </div>
    </div>
  );
}

/** One Brand Deals tile — logo when it loads, otherwise the brand name (never a broken image). */
function BrandDealTile({ brand }: { brand: StorefrontDealsCuration['brandDeals'][number] }) {
  const [logoFailed, setLogoFailed] = useState(false);
  const showLogo = !!brand.logo && !logoFailed;
  return (
    <Link
      to={`/brands/${encodeURIComponent(brand.slug)}`}
      className="border border-[#E8EDF2] rounded-lg px-2 py-3 text-center no-underline hover:border-[#FF5B00]/40 transition-colors min-w-0"
    >
      {showLogo ? (
        <img
          src={brand.logo!}
          alt={brand.name}
          onError={() => setLogoFailed(true)}
          className="h-6 w-auto max-w-full mx-auto mb-2 object-contain"
          loading="lazy"
        />
      ) : (
        <div className="text-xs font-extrabold mb-2 text-[#1A1A2E] truncate">{brand.name}</div>
      )}
      {/* Only real live deal discounts — never an invented "Up to" figure. */}
      <div className="text-[9.5px] text-[#9AA0AC] truncate">
        {brand.upToPercent ? `Up to ${brand.upToPercent}% Off` : showLogo ? brand.name : 'View brand'}
      </div>
    </Link>
  );
}

export function DealsBrandDealsCard({
  brands,
  className,
}: {
  brands: StorefrontDealsCuration['brandDeals'];
  className?: string;
}) {
  if (brands.length === 0) return null;
  return (
    <div className={cn('bg-white rounded-xl border border-[#E8EDF2] p-5', className)}>
      <div className="flex justify-between items-center mb-3.5">
        <div className="text-[13px] font-extrabold text-[#1A1A2E]">BRAND DEALS</div>
        <Link
          to="/brands"
          className="text-[11px] font-bold text-[#1A1A2E] no-underline hover:text-[#EF3C23]"
        >
          VIEW ALL BRANDS ›
        </Link>
      </div>
      <div className="grid grid-cols-3 sm:grid-cols-6 gap-2.5">
        {brands.map((bd) => (
          <BrandDealTile key={bd.id} brand={bd} />
        ))}
      </div>
    </div>
  );
}

export function DealsSubscribeBanner({ className }: { className?: string }) {
  const [email, setEmail] = useState('');
  const { siteConfig } = useGlobalState();
  const cta = getCtaBanner(siteConfig?.ctaBanners, 'deals.subscribe_cta');

  if (!isCtaBannerVisible(cta)) return null;

  return (
    <div
      className={cn(
        'choosify-dark-surface rounded-xl px-7 py-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-white',
        className,
      )}
    >
      <div>
        <div className="text-[15px] font-bold mb-1">{cta.title}</div>
        <div className="text-xs text-white/55">{cta.subtitle}</div>
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
          className="bg-[#FF5B00] text-white border-0 px-[22px] rounded-lg text-xs font-bold cursor-pointer hover:brightness-110 shrink-0"
        >
          {cta.buttonLabel}
        </button>
      </form>
    </div>
  );
}

/** Portrait / vertical sidebar advertise unit — Choosify.dc.html listing rails */
export function DealsVerticalSponsoredCard({ className }: { className?: string }) {
  return (
    <SponsoredVerticalAdCarousel
      className={className}
      includeAdvertisePlaceholder
      autoplay
      withDemoFallback
    />
  );
}
