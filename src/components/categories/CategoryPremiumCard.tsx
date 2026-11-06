import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { cn } from '../../lib/utils';
import { getCategoryImage } from '../../lib/categoryImages';
import type { CategoryStatBlock } from '../../utils/categoryStats';
import type { CategorySubcategory } from '../../utils/categoryDisplay';

export type CategoryPremiumCardProps = {
  name: string;
  stats: CategoryStatBlock;
  icon: string;
  image?: string;
  subcategories?: CategorySubcategory[];
  featuredBrand?: string;
  /** Dedicated Brand Details route, e.g. `/brands/bata` */
  featuredBrandHref?: string;
  featuredBrandLogo?: string;
  /** Paid Ads Studio sponsor for this card (Category Promoted Slot). Only then is it "Promoted". */
  sponsor?: { name: string; logo?: string; href: string; external: boolean; adId?: string; adSlot?: string };
  onClick?: () => void;
  className?: string;
};

const SUBCAT_PREVIEW = 5;

/** Choosify.dc.html Categories tile — image, stats, inline subcats, Featured Brand footer */
export function CategoryPremiumCard({
  name,
  stats,
  image,
  subcategories = [],
  featuredBrand,
  featuredBrandHref,
  featuredBrandLogo,
  sponsor,
  onClick,
  className,
}: CategoryPremiumCardProps) {
  const navigate = useNavigate();
  const [expanded, setExpanded] = useState(false);
  const [logoFailed, setLogoFailed] = useState(false);
  // Footer: a paid sponsor (labelled Promoted) or the category's real top brand (labelled Top brand).
  // Never a made-up name: with neither, the footer is not drawn.
  // Footer: a paid sponsor (Ads Studio, "Promoted") or the brand Choosify staff featured for this
  // category in Category Management ("Featured"). Nothing is picked automatically.
  const featured = sponsor?.name || featuredBrand || '';
  const footerLogo = sponsor ? sponsor.logo : featuredBrandLogo;
  const featuredInitial = featured.charAt(0).toUpperCase();
  const brandHref = sponsor?.href || featuredBrandHref || `/brands?q=${encodeURIComponent(featured)}`;
  const showLogo = Boolean(footerLogo) && !logoFailed;
  useEffect(() => {
    setLogoFailed(false);
  }, [footerLogo]);
  const visible = expanded ? subcategories : subcategories.slice(0, SUBCAT_PREVIEW);
  const hasMore = subcategories.length > SUBCAT_PREVIEW;
  const moreLabel = expanded ? 'Show less' : 'Show All';

  const openCategory = () => {
    if (onClick) onClick();
    else navigate(`/products?category=${encodeURIComponent(name)}`);
  };

  const openSub = (subName: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    navigate(
      `/products?category=${encodeURIComponent(name)}&subcategory=${encodeURIComponent(subName)}&q=${encodeURIComponent(subName)}`,
    );
  };

  return (
    <div
      className={cn(
        'bg-white rounded-xl overflow-hidden border border-[#E8EDF2] flex flex-col h-full',
        className,
      )}
    >
      <button
        type="button"
        onClick={openCategory}
        className="relative h-[120px] w-full overflow-hidden bg-[#F4F7F9] border-0 p-0 cursor-pointer"
        aria-label={`Browse ${name}`}
      >
        <img
          src={getCategoryImage(name, image)}
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
          loading="lazy"
        />
      </button>

      <div className="px-4 pt-5 pb-4 flex-1 flex flex-col">
        <button
          type="button"
          onClick={openCategory}
          className="text-left text-[14px] font-bold text-[#1A1A2E] mb-0.5 border-0 bg-transparent p-0 cursor-pointer hover:text-[#EF3C23]"
        >
          {name}
        </button>
        <div className="text-[11px] text-[#9AA0AC] mb-3">
          {stats.products.toLocaleString()}{' '}
          <span className="text-[#1A1A2E] font-semibold">Products</span>
          {' · '}
          {stats.brands} <span className="text-[#1A1A2E] font-semibold">Brands</span>
        </div>

        {visible.map((sub) => (
          <button
            key={sub.name}
            type="button"
            onClick={(e) => openSub(sub.name, e)}
            className="block w-full text-left text-[12px] text-[#4B5563] mb-2 border-0 bg-transparent p-0 cursor-pointer hover:text-[#EF3C23]"
          >
            {sub.name}
          </button>
        ))}

        {hasMore && (
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setExpanded((v) => !v);
            }}
            className="text-left text-[11.5px] font-bold text-[#FF5B00] mt-0.5 border-0 bg-transparent p-0 cursor-pointer hover:brightness-110"
          >
            {moreLabel}
          </button>
        )}
      </div>

      {featured ? (
        <FooterLink
          href={brandHref}
          external={Boolean(sponsor?.external)}
          className={sponsor
            ? 'mt-auto choosify-dark-surface text-white px-4 py-3 flex items-center gap-2.5 no-underline hover:brightness-110'
            : 'mt-auto border-t border-[#EEF2F6] bg-[#F8FAFC] px-4 py-2.5 flex items-center gap-2.5 no-underline hover:bg-[#F1F5F9]'}
          testId={sponsor ? 'category-sponsor-footer' : 'category-top-brand-footer'}
          extra={sponsor?.adId && sponsor.adSlot ? { 'data-ad-id': sponsor.adId, 'data-ad-slot': sponsor.adSlot } : undefined}
        >
          <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-extrabold shrink-0 overflow-hidden ${sponsor ? 'bg-white/20' : 'bg-white border border-[#E8EDF2] text-[#1A1A2E]'}`}>
            {showLogo ? (
              <img src={footerLogo} alt="" className="w-full h-full object-cover" loading="lazy" onError={() => setLogoFailed(true)} />
            ) : (
              featuredInitial
            )}
          </div>
          <div className={`text-[11px] font-bold min-w-0 flex-1 truncate ${sponsor ? 'text-white' : 'text-[#1A1A2E]'}`}>
            <span className={sponsor ? 'text-white font-extrabold' : 'font-extrabold text-[#1A1A2E]'}>{featured}</span>
          </div>
          {sponsor ? (
            <span className="shrink-0 text-[9px] font-extrabold uppercase tracking-wide text-white bg-[#2323FF] rounded-full px-1.5 py-0.5" title="Paid placement">
              Promoted
            </span>
          ) : (
            <span className="shrink-0 text-[9px] font-extrabold uppercase tracking-wide text-[#6B7280] border border-[#E2E8F0] rounded-full px-1.5 py-0.5" title="Featured by Choosify for this category">
              Featured
            </span>
          )}
        </FooterLink>
      ) : null}
    </div>
  );
}

/** Footer link: internal route or a paid sponsor's external site (rel=sponsored). */
function FooterLink({ href, external, className, testId, children, extra }: { href: string; external: boolean; className: string; testId: string; children: React.ReactNode; extra?: Record<string, string> }) {
  const stop = (e: React.MouseEvent) => e.stopPropagation();
  if (external || /^https?:/i.test(href)) {
    return (
      <a href={href} target="_blank" rel="sponsored noopener noreferrer" className={className} onClick={stop} data-testid={testId} {...extra}>
        {children}
      </a>
    );
  }
  return (
    <Link to={href} className={className} onClick={stop} data-testid={testId} {...extra}>
      {children}
    </Link>
  );
}
