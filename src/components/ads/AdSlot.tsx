/**
 * Storefront rendering of Ads Studio ads (public delivery, see lib/ads/adSlots.ts).
 *  - AdSlotBanner: wide designed banners, shown WHOLE at their own proportions (never cropped).
 *  - AdSlotCard:   sponsored card (3:4 image or text-on-gradient) for side rails / product page.
 * Both render nothing while loading, on error, or when no ad is booked for the slot. Every ad
 * carries a visible "Sponsored" label so paid content is never mistaken for editorial content.
 */
import React from 'react';
import { adAttrs } from '../../lib/ads/adEvents';
import { brandGradient } from '../../lib/ads/brandColor';
import { AdSlotCarousel } from '../commerce/AdSlotCarousel';
import { Link } from 'react-router-dom';
import { AD_SLOTS, adHref, sponsoredLabel, useAdSlot, type AdSlotId, type PublicAd } from '../../lib/ads/adSlots';
import type { SponsoredPlacementItem } from '../../types/commerce/sponsoredPlacement';

function AdLink({ ad, className, children, testId, style }: { ad: PublicAd; className?: string; children: React.ReactNode; testId?: string; style?: React.CSSProperties }) {
  const target = adHref(ad);
  const track = adAttrs(ad);
  if (!target) return <div className={className} style={style} data-testid={testId} {...track}>{children}</div>;
  if (target.external || /^https?:/i.test(target.href)) {
    return (
      <a href={target.href} target="_blank" rel="sponsored noopener noreferrer" className={className} style={style} data-testid={testId} {...track}>
        {children}
      </a>
    );
  }
  return (
    <Link to={target.href} className={className} style={style} data-testid={testId} {...track}>
      {children}
    </Link>
  );
}

const Chip = ({ ad }: { ad: PublicAd }) => (
  <span className="absolute left-1.5 top-1.5 z-[2] rounded bg-black/60 px-1 py-px text-[7.5px] font-extrabold uppercase tracking-wide text-white sm:left-2 sm:top-2 sm:rounded-md sm:px-1.5 sm:py-0.5 sm:text-[9.5px]" data-testid="ad-sponsored-chip">
    {sponsoredLabel(ad)}
  </span>
);

/**
 * Wide banner slot — a FIXED frame (4:1 on desktop, max 300px tall; 5:2 on phones) so a banner
 * never takes more space than the slot allows. The uploaded design is fitted WHOLE inside the
 * frame (never cropped) over a soft blurred fill of the same image, with the advertiser's orange
 * CTA button (right side, vertically centred) when a label and destination are set. When the
 * advertiser ticks "show headline & subtext", they are drawn over the left of the image.
 * Several ads in the same spot stack into a carousel with round switch icons below.
 */
export function AdSlotBanner({ slot, position, className = '' }: { slot: AdSlotId; position?: string; className?: string }) {
  const ads = useBannerAds(slot, position);
  if (!ads.length) return null;
  const testId = position ? `ad-slot-${slot}-${position}` : `ad-slot-${slot}`;
  return (
    <section className={`w-full ${className}`} aria-label="Sponsored" data-testid={testId} data-ad-position={position}>
      <AdSlotCarousel
        items={ads}
        getKey={(a) => a.id}
        axis="x"
        paginationPosition="below"
        autoplay
        autoplayMs={7000}
        ariaLabel="Sponsored banners"
        paginationRingOffsetClassName="ring-offset-[#F0F6FF]"
        getIcon={(a) => ({ label: a.headline || 'Sponsored', imageUrl: a.sponsorLogoUrl || a.image })}
        renderSlide={(a) => (a.format === 'cta_strip' ? <CtaStrip ad={a} /> : <BannerFrame ad={a} />)}
      />
    </section>
  );
}

/** One wide designed banner inside the fixed frame. */
function BannerFrame({ ad }: { ad: PublicAd }) {
  // Phones: the frame takes the design's own shape (2:1–4:1), so it fills edge to edge uncropped.
  // Desktop: fixed 4:1 frame; the whole design with a soft side fill, or (advertiser's choice)
  // filled edge to edge, cropping top/bottom around the chosen focus.
  // Phones: a separate taller phone picture when the advertiser gave one (its own shape),
  // otherwise the wide design in a slightly taller frame (never thinner than 2.2:1).
  const phonePic = ad.mobileImage;
  const ratio = phonePic
    ? ad.mobileImageWidth && ad.mobileImageHeight ? Math.min(2, Math.max(0.8, ad.mobileImageWidth / ad.mobileImageHeight)) : 1
    : ad.imageWidth && ad.imageHeight ? Math.min(2.2, Math.max(1.8, ad.imageWidth / ad.imageHeight)) : 2.2;
  const fill = ad.fit === 'fill';
  return (
    <AdLink
      ad={ad}
      className={`relative block w-full aspect-[var(--ad-ratio)] sm:aspect-[4/1] ${phonePic ? 'max-h-[460px]' : 'max-h-[300px]'} sm:max-h-[300px] overflow-hidden rounded-xl bg-[#0F1238]`}
      style={{ ['--ad-ratio' as string]: `${ratio.toFixed(3)} / 1` }}
      testId="ad-banner-link"
    >
      {phonePic ? <img src={phonePic} alt={ad.alt} className="absolute inset-0 z-[1] h-full w-full object-cover sm:hidden" loading="lazy" data-testid="ad-banner-phone-image" /> : null}
      <img src={ad.image} alt="" aria-hidden className={`absolute inset-0 h-full w-full scale-110 object-cover blur-xl opacity-60 ${fill ? 'sm:hidden' : ''}`} loading="lazy" />
      <img
        src={ad.image}
        alt={ad.alt}
        width={ad.imageWidth}
        height={ad.imageHeight}
        className={`relative block h-full w-full object-contain ${fill ? 'sm:object-cover' : ''}`}
        style={fill ? { objectPosition: `center ${ad.focusY || 'center'}` } : undefined}
        loading="lazy"
        data-testid="ad-banner-image"
      />
      {ad.showText && (ad.headline || ad.subtext) && (
        <div
          className="absolute inset-y-0 left-0 z-[1] flex w-[62%] flex-col justify-center bg-gradient-to-r from-black/70 via-black/40 to-transparent px-4 pt-5 sm:w-[55%] sm:px-8"
          data-testid="ad-banner-text"
        >
          {ad.headline && <div className="text-[15px] font-extrabold leading-tight text-white line-clamp-2 sm:text-[26px]">{ad.headline}</div>}
          {ad.subtext && <div className="mt-1 text-[11px] font-medium text-white/85 line-clamp-2 sm:mt-2 sm:text-[15px]">{ad.subtext}</div>}
        </div>
      )}
      <Chip ad={ad} />
      {ad.ctaLabel && adHref(ad) && (
        <span
          className="absolute bottom-1.5 right-1.5 z-[2] inline-flex items-center gap-0.5 rounded-md bg-[#FF5B00] px-2 py-0.5 text-[9px] font-extrabold uppercase tracking-wide text-white shadow-md sm:bottom-auto sm:right-5 sm:top-1/2 sm:-translate-y-1/2 sm:gap-1 sm:rounded-lg sm:px-4 sm:py-2 sm:text-[12.5px]"
          data-testid="ad-cta-button"
        >
          {ad.ctaLabel} <span aria-hidden>→</span>
        </span>
      )}
    </AdLink>
  );
}

/**
 * Drawable banner ads for a slot. With `position`, only the ads pinned to that exact spot on the
 * page (the server resolves "no spot chosen" to the slot's default spot).
 */
export function useBannerAds(slot: AdSlotId, position?: string): PublicAd[] {
  return useAdSlot(slot).filter(
    (a) => (a.image || (a.format === 'cta_strip' && a.headline)) && (!position || (a.position ?? position) === position),
  );
}

/** Text CTA strip (no artwork): headline + line on the dark brand gradient, orange button right. */
function CtaStrip({ ad }: { ad: PublicAd }) {
  return (
    <AdLink
      ad={ad}
      className={`relative flex flex-col items-center gap-3 overflow-hidden rounded-xl px-5 py-5 text-center no-underline sm:flex-row sm:items-center sm:gap-5 sm:px-8 sm:py-7 sm:text-left ${brandGradient(ad.brandColor, 110, ad.brandColor2) ? '' : 'bg-gradient-to-r from-[#3B1E3F] via-[#2A1846] to-[#2B1A4A]'}`}
      style={brandGradient(ad.brandColor, 110, ad.brandColor2) ? { background: brandGradient(ad.brandColor, 110, ad.brandColor2)! } : undefined}
      testId="ad-strip-link"
    >
      {ad.sponsorLogoUrl && (
        <span className={`h-16 w-16 shrink-0 self-center overflow-hidden rounded-full shadow-[0_4px_14px_rgba(0,0,0,.35)] sm:h-[72px] sm:w-[72px] ${ad.logoFit === 'fit' ? 'bg-white p-2' : ''}`}>
          <img
            src={ad.sponsorLogoUrl}
            alt=""
            className={`h-full w-full ${ad.logoFit === 'fit' ? 'object-contain' : 'object-cover'}`}
            style={ad.logoFit !== 'fit' && ad.logoZoom ? { transform: `scale(${ad.logoZoom})` } : undefined}
            loading="lazy"
            data-testid="ad-strip-logo"
          />
        </span>
      )}
      <div className="min-w-0 flex-1">
        {/* "Sponsored" sits with the text (above the title), not in the corner by the logo. */}
        <div className="mb-1 text-[10px] font-extrabold uppercase tracking-[0.14em] text-white/60" data-testid="ad-sponsored-chip">{sponsoredLabel(ad)}</div>
        <div className="text-[16px] font-extrabold leading-tight text-white sm:text-[18px]">{ad.headline}</div>
        {ad.subtext && <div className="mt-1 text-[12.5px] text-white/70 sm:text-[13.5px]">{ad.subtext}</div>}
      </div>
      {ad.ctaLabel && adHref(ad) && (
        <span className="inline-flex shrink-0 items-center justify-center rounded-lg bg-[#FF5B00] px-5 py-2.5 text-[12.5px] font-extrabold uppercase tracking-wide text-white shadow-md sm:px-6 sm:py-3" data-testid="ad-cta-button">
          {ad.ctaLabel}
        </span>
      )}
    </AdLink>
  );
}

/** Category Promoted Slot: the booked sponsor for a category card (matched by id, then name). */
export function useCategorySponsors(): (category: { id?: string; name: string }) => PublicAd | undefined {
  const ads = useAdSlot(AD_SLOTS.CATEGORY_CARD_FOOTER);
  return (category) =>
    ads.find((a) => a.categoryId && category.id && a.categoryId === category.id) ??
    ads.find((a) => a.categoryName && a.categoryName.trim().toLowerCase() === category.name.trim().toLowerCase());
}

/** Sponsored side card(s): one card, or several taking turns with round switch icons below. */
export function AdSlotCard({ slot, className = '' }: { slot: AdSlotId; className?: string }) {
  const ads = useAdSlot(slot);
  if (!ads.length) return null;
  return (
    <div className={`w-full ${className}`} data-testid={`ad-slot-${slot}`}>
      <AdSlotCarousel
        items={ads}
        getKey={(a) => a.id}
        axis="x"
        paginationPosition="below"
        autoplay
        autoplayMs={7000}
        ariaLabel="Sponsored cards"
        getIcon={(a) => ({ label: a.headline || 'Sponsored', imageUrl: a.sponsorLogoUrl || a.image })}
        renderSlide={(a) => <SideCard ad={a} />}
      />
    </div>
  );
}

/** Ads booked for a slot (for "booked ad or house card" choices). */
export function useSlotHasAds(slot: AdSlotId): boolean {
  return useAdSlot(slot).length > 0;
}

/**
 * In-grid sponsored cards — the same shell and size as the cards around them (brand / creator /
 * deal grids). Renders the booked ads, or `fallback` (the house "Advertise here" card) if none.
 */
export function GridAdCards({ slot, fallback = null }: { slot: AdSlotId; fallback?: React.ReactNode }) {
  const ads = useAdSlot(slot);
  if (!ads.length) return <>{fallback}</>;
  return (
    <>
      {ads.map((ad) => (
        <AdGridCard key={ad.id} ad={ad} />
      ))}
    </>
  );
}

export type GridAdEntry = { kind: 'gridAd'; key: string; ad: PublicAd };

/**
 * Inserts the slot's booked in-grid ads into a card list: after every N real cards (the smallest
 * "after every N cards" chosen on the booked ads), several ads taking turns. With fewer cards
 * than N — or "once, after the last card" — one ad follows the last card.
 */
export function useGridAds<T extends { key: string }>(slot: AdSlotId, entries: T[], isCard: (e: T) => boolean): Array<T | GridAdEntry> {
  const ads = useAdSlot(slot);
  if (!ads.length) return entries;
  const steps = ads.map((a) => (Number.isFinite(a.gridEvery) ? Number(a.gridEvery) : 8)).filter((n) => n > 0);
  const every = steps.length ? Math.min(...steps) : 0;
  const total = entries.filter(isCard).length;
  const out: Array<T | GridAdEntry> = [];
  let n = 0;
  let shown = 0;
  for (const e of entries) {
    out.push(e);
    if (!isCard(e)) continue;
    n++;
    if (every > 0 && n % every === 0) {
      const ad = ads[shown % ads.length];
      out.push({ kind: 'gridAd', key: `grid-ad-${ad.id}-${n}`, ad });
      shown++;
    } else if (n === total && shown === 0) {
      out.push({ kind: 'gridAd', key: `grid-ad-${ads[0].id}-end`, ad: ads[0] });
      shown++;
    }
  }
  return out;
}

export function AdGridCard({ ad }: { ad: PublicAd }) {
  const target = adHref(ad);
  return (
    <AdLink
      ad={ad}
      className="choosify-dark-surface relative flex h-full min-h-[300px] flex-col overflow-hidden rounded-[10px] text-left no-underline"
      testId={`ad-grid-card-${ad.slot}`}
    >
      <div className={`relative min-h-0 flex-[7] overflow-hidden ${brandGradient(ad.brandColor, 110, ad.brandColor2) ? '' : 'bg-gradient-to-br from-[#FF5B00] to-[#2323FF]'}`} style={brandGradient(ad.brandColor, 135, ad.brandColor2) ? { background: brandGradient(ad.brandColor, 135, ad.brandColor2)! } : undefined}>
        {ad.display !== 'text' && ad.image ? (
          <img src={ad.image} alt={ad.alt} className="absolute inset-0 h-full w-full object-cover" loading="lazy" />
        ) : ad.sponsorLogoUrl ? (
          <img src={ad.sponsorLogoUrl} alt="" className={`absolute left-1/2 top-1/2 h-20 w-20 -translate-x-1/2 -translate-y-1/2 rounded-full shadow-[0_4px_14px_rgba(0,0,0,.35)] ${ad.logoFit === 'fit' ? 'bg-white object-contain p-2' : 'object-cover'}`} loading="lazy" />
        ) : null}
        <Chip ad={ad} />
      </div>
      <div className="flex min-h-0 flex-[3] flex-col justify-center p-3.5">
        {ad.headline && <div className="mb-1 text-[13.5px] font-bold leading-snug text-white line-clamp-2">{ad.headline}</div>}
        {ad.subtext && <div className="mb-3 text-[11px] leading-snug text-white/60 line-clamp-2">{ad.subtext}</div>}
        {ad.ctaLabel && target && (
          <span className="mt-auto w-full rounded-md bg-[#FF5B00] py-2.5 text-center text-[11.5px] font-extrabold uppercase text-white" data-testid="ad-cta-button">
            {ad.ctaLabel} →
          </span>
        )}
      </div>
    </AdLink>
  );
}

function SideCard({ ad }: { ad: PublicAd }) {
  return (
      <AdLink ad={ad} className="relative block overflow-hidden rounded-xl border border-[#E8EDF2] bg-white text-left">
        {ad.display !== 'text' && ad.image ? <Chip ad={ad} /> : null}
        {ad.display !== 'text' && ad.image ? (
          <img src={ad.image} alt={ad.alt} className="block aspect-[3/4] w-full object-cover" loading="lazy" />
        ) : (
          <div className={`flex aspect-[3/4] w-full flex-col justify-end p-4 ${brandGradient(ad.brandColor, 110, ad.brandColor2) ? '' : 'bg-gradient-to-br from-[#1A1D4E] to-[#FF5B00]'}`} style={brandGradient(ad.brandColor, 160, ad.brandColor2) ? { background: brandGradient(ad.brandColor, 160, ad.brandColor2)! } : undefined}>
            {ad.sponsorLogoUrl && <img src={ad.sponsorLogoUrl} alt="" className={`mb-auto h-12 w-12 rounded-full shadow-[0_4px_14px_rgba(0,0,0,.35)] ${ad.logoFit === 'fit' ? 'bg-white object-contain p-1.5' : 'object-cover'}`} />}
            <div className="mb-1 text-[10px] font-extrabold uppercase tracking-[0.14em] text-white/60" data-testid="ad-sponsored-chip">{sponsoredLabel(ad)}</div>
            <div className="text-[15px] font-extrabold leading-tight text-white">{ad.headline}</div>
          </div>
        )}
        {(ad.headline || ad.subtext || ad.ctaLabel) && (
          <div className="p-3">
            {ad.display !== 'text' && ad.headline && <div className="text-[13px] font-extrabold text-[#1A1A2E] line-clamp-2">{ad.headline}</div>}
            {ad.subtext && <div className="mt-0.5 text-[11.5px] text-[#6B7280] line-clamp-2">{ad.subtext}</div>}
            {ad.ctaLabel && adHref(ad) && (
              <span className="mx-auto mt-2.5 flex w-fit items-center gap-1 rounded-lg bg-[#FF5B00] px-4 py-1.5 text-[11px] font-extrabold uppercase tracking-wide text-white" data-testid="ad-card-cta">
                {ad.ctaLabel} <span aria-hidden>→</span>
              </span>
            )}
          </div>
        )}
      </AdLink>
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
