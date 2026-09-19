import React from 'react';
import { BarChart3, Lock, ShieldCheck, Shield, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ChoosifyWordmarkLogo } from '../ChoosifyWordmarkLogo';
import { useGlobalState } from '../../context/GlobalStateContext';

/** Existing approved copy, moved here from LoginSignUpPage's old composite
 *  card so it isn't duplicated once the marketing panel and the form card
 *  are separate page-level columns. Not reworded. */
const BENEFITS = [
  { icon: Lock, iconBg: '#FF5B00', title: 'Save products & brands', sub: 'Keep your favorites in one place' },
  { icon: BarChart3, iconBg: '#7A3CFF', title: 'Track reviews & comparisons', sub: 'Make confident decisions' },
  { icon: Sparkles, iconBg: '#07A828', title: 'Get personalized recommendations', sub: 'Discover what’s right for you' },
];

/** Same copy/icons as the site's existing trust strip (Secure sign-in /
 *  Verified seller ecosystem / Privacy protected). */
const TRUST_POINTS = [
  { icon: Lock, title: 'Secure sign-in', sub: 'Your account is protected', iconColor: '#FF5B00' },
  { icon: ShieldCheck, title: 'Verified seller ecosystem', sub: 'Only trusted brands', iconColor: '#2323FF' },
  { icon: Shield, title: 'Privacy protected', sub: 'Your data stays private', iconColor: '#07A828' },
];

/**
 * Clean, minimal, white two-column authentication page shell shared by
 * every storefront auth surface (Login/Signup, Forgot Password, Reset
 * Password). Replaces the earlier full-bleed blurred-homepage background
 * treatment entirely -- no blur, no dark overlay, no glassmorphism.
 *
 * `children` is the existing, unmodified auth card content (whatever form
 * markup the calling page already had) -- this shell only controls the
 * page background, two-column layout, spacing and a light card frame
 * around it; it never touches the form's own internal structure.
 */
export function StorefrontAuthShell({ children }: { children: React.ReactNode }) {
  const { siteConfig } = useGlobalState();
  const image = siteConfig?.authVisual?.storefrontImage;
  const imageAlt = siteConfig?.authVisual?.storefrontImageAlt || '';

  return (
    <div className="relative min-h-screen bg-white font-sans">
      {/* Need help? — Ask EMI entry point removed from the auth shell entirely
          (per product decision), on every breakpoint. */}
      <div className="absolute right-6 top-6 z-[3] hidden items-center gap-4 sm:right-10 sm:flex">
        <Link
          to="/contact"
          className="text-[12.5px] font-semibold text-[#6B7280] transition-colors hover:text-[#1A1A2E]"
        >
          Need help?
        </Link>
      </div>

      {/* DOM order is deliberately card-first, marketing-second — that's
          also the desired mobile TAB/reading order. `lg:order-*` below only
          repositions them visually into the existing left/right desktop
          layout; it never reverses keyboard/screen-reader order (CSS `order`
          changes visual position only, so putting the card later in the DOM
          just to move it "left" on desktop would have made mobile tab order
          go through the marketing link before the form — avoided by keeping
          DOM order = mobile visual order, and using `order` only for the
          desktop-only repositioning). */}
      <div className="mx-auto flex min-h-screen w-full max-w-[1400px] flex-col lg:flex-row">
        {/* The existing, unmodified auth card — first in the DOM so it's
            reachable at/near the top of the first mobile viewport without
            scrolling past marketing content. lg:order-2 moves it to the
            right column on desktop, matching the existing desktop layout. */}
        <div className="flex flex-1 items-center justify-center px-6 pt-8 pb-10 sm:px-10 lg:order-2 lg:py-16">
          <div className="w-full max-w-[400px]">
            {/* Compact brand mark — mobile only. Desktop keeps the full
                wordmark + badge/headline in the marketing column below;
                this is not a duplicate, it's the mobile substitute for it. */}
            <Link to="/" aria-label="Choosify home" className="mb-6 flex justify-center lg:hidden">
              <ChoosifyWordmarkLogo height={30} className="h-[30px] w-auto" tone="navy" />
            </Link>
            <div className="rounded-2xl border border-[#EEF0F4] bg-white p-8 shadow-[0_1px_3px_rgba(16,24,40,0.06)] sm:p-9">
              {children}
            </div>
          </div>
        </div>

        {/* Brand / marketing information — second in the DOM (and visually
            below the card on mobile), moved to the left column on desktop
            via lg:order-1, matching the existing desktop layout. */}
        <div className="flex flex-col items-center justify-center border-t border-[#EEF0F4] px-6 py-6 text-center sm:px-10 sm:py-14 lg:order-1 lg:w-[46%] lg:items-start lg:border-t-0 lg:border-r lg:px-14 lg:py-16 lg:text-left xl:w-[42%] xl:px-16">
          {/* Full logo stays desktop-only here — mobile gets a compact brand
              mark above the auth card instead, so it isn't shown twice. */}
          <Link to="/" aria-label="Choosify home" className="mb-8 hidden w-max lg:inline-block">
            <ChoosifyWordmarkLogo height={26} className="h-[26px] w-auto" tone="navy" />
          </Link>
          <div className="mb-5 hidden w-max rounded-full bg-[rgba(255,90,44,0.1)] px-3.5 py-1.5 text-[11px] font-bold text-[#FF5B00] lg:inline-block">
            ✦ Join 100,000+ SHOPPERS
          </div>
          {/* Headline + descriptive copy are the largest marketing block —
              desktop-only; mobile keeps the compact benefits/trust bullets
              below instead of this long-form copy. */}
          <h1 className="mb-5 hidden text-[28px] font-extrabold leading-[1.2] text-[#1A1A2E] sm:text-[34px] sm:mb-6 lg:block">
            Verify Brands.
            <br />
            Compare Easily.
            <br />
            Choose With <span className="choosify-emi-gradient-text">Confidence.</span>
          </h1>
          <p className="m-0 mb-7 hidden max-w-[420px] text-[13.5px] leading-[1.7] text-[#6B7280] lg:block">
            Bookmark products, track reviews, and get personalized picks from Bangladesh&apos;s #1
            discovery platform.
          </p>

          <ul className="m-0 mb-7 hidden w-full list-none space-y-4 p-0 lg:block">
            {BENEFITS.map((b) => {
              const Icon = b.icon;
              return (
                <li key={b.title} className="flex items-start justify-center gap-3 text-left lg:justify-start">
                  <span
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full"
                    style={{ backgroundColor: `${b.iconBg}1a` }}
                  >
                    <Icon size={16} strokeWidth={2.2} style={{ color: b.iconBg }} />
                  </span>
                  <div>
                    <div className="text-[13.5px] font-bold text-[#1A1A2E]">{b.title}</div>
                    <div className="text-[11.5px] text-[#9AA0AC]">{b.sub}</div>
                  </div>
                </li>
              );
            })}
          </ul>

          {image ? (
            <div className="mb-7 hidden overflow-hidden rounded-2xl lg:block">
              <img src={image} alt={imageAlt} className="h-[180px] w-full object-cover" loading="lazy" />
            </div>
          ) : null}

          <div className="mt-2 hidden w-full border-t border-[#EEF0F4] pt-6 lg:block">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              {TRUST_POINTS.map((point) => {
                const Icon = point.icon;
                return (
                  <div key={point.title} className="flex items-start justify-center gap-2 text-left lg:justify-start">
                    <Icon size={15} strokeWidth={2.1} className="mt-0.5 shrink-0" style={{ color: point.iconColor }} />
                    <div>
                      <div className="text-[11.5px] font-bold text-[#1A1A2E]">{point.title}</div>
                      <div className="text-[10.5px] text-[#9AA0AC]">{point.sub}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <p className="mt-0 text-[11px] text-[#9AA0AC] lg:mt-8">
            <span className="text-[#FF5B00]">©</span> {new Date().getFullYear()}{' '}
            <span className="font-semibold text-[#FF5B00]">Choosify Technologies Ltd</span>. All rights
            reserved.
          </p>
        </div>
      </div>
    </div>
  );
}
