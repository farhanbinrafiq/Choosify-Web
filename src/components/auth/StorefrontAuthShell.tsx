import React from 'react';
import { BarChart3, Lock, ShieldCheck, Shield, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ChoosifyWordmarkLogo } from '../ChoosifyWordmarkLogo';
import { EmiAiLogo } from '../EmiAiLogo';
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
      {/* Ask EMI — same wording/icon/link/functionality as before, just
          restyled for a light page (was previously white-on-navy). */}
      <div className="absolute right-6 top-6 z-[3] flex items-center gap-4 sm:right-10">
        <Link
          to="/contact"
          className="hidden text-[12.5px] font-semibold text-[#6B7280] transition-colors hover:text-[#1A1A2E] sm:inline"
        >
          Need help?
        </Link>
        <Link
          to="/messages/thread-emi-ai"
          className="flex items-center gap-1.5 rounded-full border-0 py-1.5 pl-1.5 pr-3.5 transition-all hover:brightness-110 choosify-emi-gradient"
        >
          <EmiAiLogo size={22} />
          <span className="text-xs font-bold text-white">Ask EMI</span>
        </Link>
      </div>

      <div className="mx-auto flex min-h-screen w-full max-w-[1400px] flex-col lg:flex-row">
        {/* Left — brand / marketing information */}
        <div className="flex flex-col justify-center border-b border-[#EEF0F4] px-6 py-10 sm:px-10 sm:py-14 lg:w-[46%] lg:border-b-0 lg:border-r lg:px-14 lg:py-16 xl:w-[42%] xl:px-16">
          <Link to="/" aria-label="Choosify home" className="mb-8 inline-block w-max">
            <ChoosifyWordmarkLogo height={26} className="h-[26px] w-auto" tone="navy" />
          </Link>
          <div className="mb-5 inline-block w-max rounded-full bg-[rgba(255,90,44,0.1)] px-3.5 py-1.5 text-[11px] font-bold text-[#FF5B00]">
            ✦ Join 100,000+ SHOPPERS
          </div>
          <h1 className="mb-5 text-[28px] font-extrabold leading-[1.2] text-[#1A1A2E] sm:text-[34px] sm:mb-6">
            Verify Brands.
            <br />
            Compare Easily.
            <br />
            Choose With <span className="choosify-emi-gradient-text">Confidence.</span>
          </h1>
          <p className="m-0 mb-7 max-w-[420px] text-[13.5px] leading-[1.7] text-[#6B7280]">
            Bookmark products, track reviews, and get personalized picks from Bangladesh&apos;s #1
            discovery platform.
          </p>

          <ul className="m-0 mb-7 list-none space-y-4 p-0">
            {BENEFITS.map((b) => {
              const Icon = b.icon;
              return (
                <li key={b.title} className="flex items-start gap-3">
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

          <div className="mt-2 border-t border-[#EEF0F4] pt-6">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              {TRUST_POINTS.map((point) => {
                const Icon = point.icon;
                return (
                  <div key={point.title} className="flex items-start gap-2">
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

          <p className="mt-8 text-[11px] text-[#9AA0AC]">
            <span className="text-[#FF5B00]">©</span> {new Date().getFullYear()}{' '}
            <span className="font-semibold text-[#FF5B00]">Choosify Technologies Ltd</span>. All rights
            reserved.
          </p>
        </div>

        {/* Right — the existing, unmodified auth card */}
        <div className="flex flex-1 items-center justify-center px-6 py-10 sm:px-10 lg:py-16">
          <div className="w-full max-w-[400px] rounded-2xl border border-[#EEF0F4] bg-white p-8 shadow-[0_1px_3px_rgba(16,24,40,0.06)] sm:p-9">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
