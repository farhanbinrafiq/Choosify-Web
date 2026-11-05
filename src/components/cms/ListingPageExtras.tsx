/**
 * Website Studio → Pages → Storefront pages: the editable words on the listing pages.
 * Published content comes in site.websiteStudio.listingPages (a draft inside the Studio preview);
 * anything missing falls back to the built-in words in cmsListingPages.
 */
import React from 'react';
import { Link } from 'react-router-dom';
import { useGlobalState } from '../../context/GlobalStateContext';
import { normalizeListingPage, type ListingCta, type ListingPageContent, type ListingPageKey } from '../../lib/cmsListingPages';

export function useListingPage(key: ListingPageKey): ListingPageContent {
  const { siteConfig } = useGlobalState();
  const raw = (siteConfig?.websiteStudio as { listingPages?: Record<string, unknown> } | undefined)?.listingPages?.[key];
  return React.useMemo(() => normalizeListingPage(key, raw), [key, raw]);
}

export function ListingIntro({ text, className = '' }: { text: string; className?: string }) {
  if (!text.trim()) return null;
  return (
    <p className={`m-0 text-[13px] leading-relaxed text-[#5B6472] ${className}`} data-testid="listing-intro">
      {text}
    </p>
  );
}

export function ListingCtaStrip({ cta, className = '' }: { cta: ListingCta; className?: string }) {
  if (!cta.show || !cta.buttonLabel.trim() || !cta.buttonHref) return null;
  const button = 'inline-flex shrink-0 items-center justify-center rounded-lg bg-[#FF5B00] px-5 py-2.5 text-[12px] font-extrabold uppercase tracking-wide text-white no-underline shadow-md hover:brightness-110';
  const external = /^https:\/\//i.test(cta.buttonHref);
  return (
    <section
      className={`flex flex-col gap-3 rounded-2xl bg-gradient-to-r from-[#3B1E3F] via-[#2A1846] to-[#2B1A4A] px-5 py-5 sm:flex-row sm:items-center sm:px-7 ${className}`}
      data-testid="listing-cta"
    >
      <div className="min-w-0 flex-1">
        {cta.heading ? <div className="text-[16px] font-extrabold text-white">{cta.heading}</div> : null}
        {cta.text ? <div className="mt-1 text-[13px] text-white/70">{cta.text}</div> : null}
      </div>
      {external ? (
        <a href={cta.buttonHref} target="_blank" rel="noopener noreferrer" className={button} data-testid="listing-cta-button">
          {cta.buttonLabel}
        </a>
      ) : /^(mailto:|tel:|#)/i.test(cta.buttonHref) ? (
        <a href={cta.buttonHref} className={button} data-testid="listing-cta-button">
          {cta.buttonLabel}
        </a>
      ) : (
        <Link to={cta.buttonHref} className={button} data-testid="listing-cta-button">
          {cta.buttonLabel}
        </Link>
      )}
    </section>
  );
}
