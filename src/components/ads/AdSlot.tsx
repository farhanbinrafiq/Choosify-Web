/**
 * Storefront rendering of Ads Studio ads (public delivery, see lib/ads/adSlots.ts).
 *  - AdSlotBanner: wide designed banners, shown WHOLE at their own proportions (never cropped).
 *  - AdSlotCard:   sponsored card (3:4 image or text-on-gradient) for side rails / product page.
 * Both render nothing while loading, on error, or when no ad is booked for the slot. Every ad
 * carries a visible "Sponsored" label so paid content is never mistaken for editorial content.
 */
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { adHref, sponsoredLabel, useAdSlot, type AdSlotId, type PublicAd } from '../../lib/ads/adSlots';
import type { SponsoredPlacementItem } from '../../types/commerce/sponsoredPlacement';

function AdLink({ ad, className, children, testId }: { ad: PublicAd; className?: string; children: React.ReactNode; testId?: string }) {
  const target = adHref(ad);
  if (!target) return <div className={className} data-testid={testId}>{children}</div>;
  if (target.external || /^https?:/i.test(target.href)) {
    return (
      <a href={target.href} target="_blank" rel="sponsored noopener noreferrer" className={className} data-testid={testId}>
        {children}
      </a>
    );
  }
  return (
    <Link to={target.href} className={className} data-testid={testId}>
      {children}
    </Link>
  );
}

const Chip = ({ ad }: { ad: PublicAd }) => (
  <span className="absolute left-2 top-2 z-[2] rounded-md bg-black/60 px-1.5 py-0.5 text-[9.5px] font-extrabold uppercase tracking-wide text-white" data-testid="ad-sponsored-chip">
    {sponsoredLabel(ad)}
  </span>
);

/** Wide banner slot: the uploaded design is shown whole; several ads rotate every 7 seconds. */
export function AdSlotBanner({ slot, className = '' }: { slot: AdSlotId; className?: string }) {
  const ads = useAdSlot(slot).filter((a) => a.image);
  const [i, setI] = useState(0);
  useEffect(() => {
    if (ads.length < 2) return;
    const t = window.setInterval(() => setI((x) => (x + 1) % ads.length), 7000);
    return () => window.clearInterval(t);
  }, [ads.length]);
  if (!ads.length) return null;
  const ad = ads[i % ads.length];
  return (
    <section className={`w-full ${className}`} aria-label="Sponsored" data-testid={`ad-slot-${slot}`}>
      <AdLink ad={ad} className="relative mx-auto block w-fit max-w-full overflow-hidden rounded-xl" testId="ad-banner-link">
        <Chip ad={ad} />
        <img
          src={ad.image}
          alt={ad.alt}
          width={ad.imageWidth}
          height={ad.imageHeight}
          className="block h-auto w-auto max-w-full max-h-[360px] object-contain"
          loading="lazy"
          data-testid="ad-banner-image"
        />
      </AdLink>
      {ads.length > 1 && (
        <div className="mt-2 flex justify-center gap-1.5">
          {ads.map((a, j) => (
            <button key={a.id} type="button" aria-label={`Show sponsored banner ${j + 1}`} onClick={() => setI(j)} className={`h-1.5 rounded-full ${j === i % ads.length ? 'w-4 bg-[#FF5B00]' : 'w-1.5 bg-[#CBD5E1]'}`} />
          ))}
        </div>
      )}
    </section>
  );
}

/** One sponsored card (first booked ad for the slot). */
export function AdSlotCard({ slot, className = '' }: { slot: AdSlotId; className?: string }) {
  const ad = useAdSlot(slot)[0];
  if (!ad) return null;
  return (
    <div className={`w-full ${className}`} data-testid={`ad-slot-${slot}`}>
      <AdLink ad={ad} className="relative block overflow-hidden rounded-xl border border-[#E8EDF2] bg-white text-left">
        <Chip ad={ad} />
        {ad.display !== 'text' && ad.image ? (
          <img src={ad.image} alt={ad.alt} className="block aspect-[3/4] w-full object-cover" loading="lazy" />
        ) : (
          <div className="flex aspect-[3/4] w-full flex-col justify-end bg-gradient-to-br from-[#1A1D4E] to-[#FF5B00] p-4">
            {ad.sponsorLogoUrl && <img src={ad.sponsorLogoUrl} alt="" className="mb-auto h-10 w-10 rounded-full bg-white object-contain p-1" />}
            <div className="text-[15px] font-extrabold leading-tight text-white">{ad.headline}</div>
          </div>
        )}
        {(ad.headline || ad.subtext || ad.ctaLabel) && (
          <div className="p-3">
            {ad.display !== 'text' && ad.headline && <div className="text-[13px] font-extrabold text-[#1A1A2E] line-clamp-2">{ad.headline}</div>}
            {ad.subtext && <div className="mt-0.5 text-[11.5px] text-[#6B7280] line-clamp-2">{ad.subtext}</div>}
            {ad.ctaLabel && adHref(ad) && <span className="mt-2 inline-block rounded-lg bg-[#FF5B00] px-3 py-1.5 text-[11px] font-extrabold text-white">{ad.ctaLabel}</span>}
          </div>
        )}
      </AdLink>
    </div>
  );
}

/** Ads Studio ad → the shared sponsored-item shape used by in-feed sponsored cards. */
export function adToSponsoredItem(ad: PublicAd): SponsoredPlacementItem | null {
  const target = adHref(ad);
  if (!target) return null;
  return {
    id: `ad:${ad.id}`,
    kind: 'spotlight',
    sponsorName: ad.sponsorName || 'Sponsored',
    sponsorLogoUrl: ad.sponsorLogoUrl,
    sponsoredLabel: sponsoredLabel(ad),
    href: target.href,
    isExternal: target.external,
    ctaLabel: ad.ctaLabel || 'Learn more',
    title: ad.headline,
    subtitle: ad.subtext,
    image: ad.image,
  };
}
