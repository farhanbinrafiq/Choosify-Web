import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Store, Award } from 'lucide-react';
import { useGlobalState } from '../context/GlobalStateContext';
import type { SiteFooterColumn } from '../types/catalog';
import { getNavigationLabel } from '../lib/navigation';
import { ChoosifyTextWordmarkLogo } from './ChoosifyTextWordmarkLogo';
import { ChoosifyWordmarkLogo } from './ChoosifyWordmarkLogo';
import { BrandIcon } from './icons/BrandIcon';
import { APP_STORE_ICON, socialIconSrc } from './icons/brandIcons';
import { PaymentMethodsGrid } from './icons/PaymentMethodIcons';

/**
 * A visitor who hasn't signed up as a buyer at all still needs a way to
 * become a seller or creator directly -- both signup forms live on the
 * admin app (dashboard.choosify.bd/signup), not here. Mirrors the same
 * dev/prod origin resolution already used by the logged-in buyer dashboard's
 * "Join as Seller"/"Join as Creator" sidebar cards (SellerAccountSidebarCard.tsx,
 * BecomeCreatorSidebarCard.tsx) -- duplicated rather than shared since those
 * two also prefill ?email= from the logged-in buyer, which doesn't apply to
 * an anonymous footer link.
 */
const DEV_PARTNER_SIGNUP_ORIGIN = 'http://localhost:3001';
const PROD_PARTNER_SIGNUP_ORIGIN = 'https://dashboard.choosify.bd';

function resolvePartnerSignupOrigin(): string {
  const fromEnv = ((import.meta as any).env?.VITE_SELLER_DASHBOARD_URL as string | undefined)?.replace(
    /\/$/,
    '',
  );
  if (import.meta.env.DEV) {
    if (fromEnv && /(localhost|127\.0\.0\.1)/i.test(fromEnv)) return fromEnv;
    return DEV_PARTNER_SIGNUP_ORIGIN;
  }
  return fromEnv || PROD_PARTNER_SIGNUP_ORIGIN;
}

const PARTNER_SIGNUP_ORIGIN = resolvePartnerSignupOrigin();
const SELLER_SIGNUP_URL = PARTNER_SIGNUP_ORIGIN + "/signup?type=seller";
const CREATOR_SIGNUP_URL = PARTNER_SIGNUP_ORIGIN + "/signup?type=creator";

const DEFAULT_FOOTER_COLUMNS: SiteFooterColumn[] = [
  {
    id: 'discover',
    title: 'Discover',
    links: [
      { label: 'Top Brands', url: '/brands' },
      { label: 'Products & Services', url: '/products' },
      { label: 'New Arrival', url: '/products?sort=new' },
      { label: 'Compare Tool', url: '/compare' },
      { label: 'Best Deals', url: '/deals' },
    ],
  },
  {
    id: 'company',
    title: 'Company',
    links: [
      { label: 'Suggest a brand', url: '/suggest-brand' },
      { label: 'Partnership', url: '/partnership' },
      { label: 'Advertise', url: '/advertise' },
      { label: 'B2B', url: '/about#b2b' },
    ],
  },
  {
    id: 'legal',
    title: 'Legal',
    links: [
      { label: 'Terms', url: '/terms' },
      { label: 'Policy', url: '/privacy' },
      { label: 'Contact us', url: '/contact' },
      { label: 'About', url: '/about' },
      { label: 'Careers', url: '/careers' },
    ],
  },
];

const OFFICE_ADDRESSES = [
  {
    id: 'usa',
    label: 'USA Office',
    lines: ['1209 N Orange St', 'Wilmington, DE 19801', 'United States'],
  },
  {
    id: 'bangladesh',
    label: 'Bangladesh Office',
    lines: [
      'Level 11, Gulshan Commerce Center',
      'Road 45, Gulshan-2, Dhaka',
      'Bangladesh',
    ],
  },
] as const;

const DEFAULT_SOCIALS = [
  { id: 'fb', platform: 'Facebook', url: 'https://www.facebook.com/choosify.bd', isVisible: true, order: 0 },
  { id: 'ig', platform: 'Instagram', url: 'https://www.instagram.com/choosify.bd/', isVisible: true, order: 1 },
  { id: 'yt', platform: 'YouTube', url: 'https://www.youtube.com/@choosifybd', isVisible: true, order: 2 },
  { id: 'li', platform: 'LinkedIn', url: 'https://www.linkedin.com/company/choosifybangladesh/', isVisible: true, order: 3 },
  { id: 'tt', platform: 'TikTok', url: 'https://www.tiktok.com/@choosify.bd', isVisible: true, order: 4 },
];

const TRUST_SECTIONS = [
  {
    id: 'delivery',
    title: 'Delivery Partner',
    logos: [
      {
        src: '/icons/trust/pathao.png',
        alt: 'Pathao',
      },
      {
        src: '/icons/trust/redx.png',
        alt: 'RedX',
      },
      {
        src: '/icons/trust/steadfast.png',
        alt: 'SteadFast Courier',
      },
    ],
  },
] as const;

const APP_DOWNLOADS = [
  {
    id: 'android',
    platform: 'Android',
    store: 'Google Play',
    href: 'https://play.google.com/store',
    platformIcon: APP_STORE_ICON.android,
    storeIcon: APP_STORE_ICON.googlePlay,
  },
  {
    id: 'apple',
    platform: 'Apple',
    store: 'App Store',
    href: 'https://apps.apple.com/',
    platformIcon: APP_STORE_ICON.apple,
    storeIcon: APP_STORE_ICON.appStore,
  },
] as const;

function FooterHeading({ children }: { children: React.ReactNode }) {
  return (
    <h4 className="text-[11px] font-bold uppercase tracking-[0.08em] text-white/40 mb-4">
      {children}
    </h4>
  );
}

function FooterLink({
  label,
  url,
}: {
  label: string;
  url: string;
}) {
  const displayLabel = getNavigationLabel(url, label);
  const isCompare = displayLabel.toLowerCase().includes('compare');
  const className =
    'text-[13px] font-medium text-white/70 hover:text-white transition-colors inline-flex items-center gap-2';

  const content = (
    <>
      {displayLabel}
      {isCompare && (
        <span className="text-[9px] font-bold text-white bg-[#2323FF] px-1.5 py-0.5 rounded tracking-wide">
          NEW
        </span>
      )}
    </>
  );

  if (url.startsWith('http')) {
    return (
      <a href={url} className={className} target="_blank" rel="noopener noreferrer">
        {content}
      </a>
    );
  }

  return (
    <Link to={url} className={className}>
      {content}
    </Link>
  );
}

/*
  An anonymous visitor has no reason to create a buyer account first just to
  reach seller/creator signup -- these go straight to
  dashboard.choosify.bd/signup?type=... regardless of whether the visitor has
  any Choosify account at all. Rendered directly under the Discover column so
  the "become a partner" path sits with the other discovery links.
*/
function SellOrCreateWithUs() {
  return (
    <div>
      <FooterHeading>Sell Or Create With Us</FooterHeading>
      <div className="flex flex-col gap-2">
        <a
          href={SELLER_SIGNUP_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 text-[13px] font-semibold text-white/70 hover:text-white transition-colors"
        >
          <Store size={14} className="text-orange-primary shrink-0" />
          Sign Up As A Seller
        </a>
        <a
          href={CREATOR_SIGNUP_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 text-[13px] font-semibold text-white/70 hover:text-white transition-colors"
        >
          <Award size={14} className="text-orange-primary shrink-0" />
          Join As A Creator
        </a>
      </div>
    </div>
  );
}

export function Footer() {
  const { siteConfig } = useGlobalState();
  const footer = siteConfig?.footer;
  const cmsSocials = (siteConfig?.socialLinks || [])
    .filter((link) => link.isVisible)
    .sort((a, b) => a.order - b.order);

  const socials = cmsSocials.length ? cmsSocials : DEFAULT_SOCIALS;

  const footerColumns = useMemo(
    () => (footer?.columns?.length ? footer.columns : DEFAULT_FOOTER_COLUMNS),
    [footer?.columns],
  );

  // "Sell Or Create With Us" hangs under the Discover column; fall back to the
  // first column when a CMS-configured footer has no column called "Discover".
  const sellCreateColumnId = useMemo(() => {
    const match = footerColumns.find(
      (c) => c.id === 'discover' || c.title.trim().toLowerCase() === 'discover',
    );
    return match?.id ?? footerColumns[0]?.id;
  }, [footerColumns]);

  const officeAddresses = useMemo(() => {
    const fromCms = [footer?.usaOffice, footer?.bangladeshOffice]
      .filter(Boolean)
      .map((office, idx) => {
        const lines =
          (office?.lines && office.lines.length
            ? office.lines
            : String((office as { address?: string } | undefined)?.address || '')
                .split(/\n+/)
                .map((l) => l.trim())
                .filter(Boolean)) || [];
        return {
          id: idx === 0 ? 'usa' : 'bangladesh',
          label: office?.title || (idx === 0 ? 'USA Office' : 'Bangladesh Office'),
          lines: lines.length ? lines : OFFICE_ADDRESSES[idx]?.lines || [],
        };
      })
      .filter((o) => o.lines.length > 0);
    return fromCms.length ? fromCms : OFFICE_ADDRESSES;
  }, [footer?.usaOffice, footer?.bangladeshOffice]);

  const contactEmail = footer?.contactEmail || 'support@choosify.bd';
  const contactPhone = footer?.contactPhone || '+880 01410 423014';
  const dbid = footer?.dbid?.trim() || '—';
  const tradeLicense = footer?.tradeLicense?.trim() || '—';
  const year = new Date().getFullYear();

  const deliveryPartners = (footer?.deliveryPartners || [])
    .filter((p) => p.enabled !== false)
    .sort((a, b) => (a.order || 0) - (b.order || 0));

  const platforms =
    footer?.platforms?.filter((p) => p.enabled !== false).length
      ? footer.platforms.filter((p) => p.enabled !== false)
      : APP_DOWNLOADS.map((app) => ({
          id: app.id,
          platform: app.platform,
          store: app.store,
          href: app.href,
          qrImage: undefined as string | undefined,
          storeIcon: app.storeIcon,
          platformIcon: app.platformIcon,
        }));

  return (
    <footer
      className="w-full footer-brand-gradient text-gray-400 font-sans relative overflow-hidden"
      id="global-footer"
    >
      <div className="max-w-[1280px] mx-auto px-6 md:px-10 pt-14 md:pt-16 relative z-10">
        {/* Top: brand + link columns */}
        <div className="grid grid-cols-1 lg:grid-cols-[1.15fr_1.85fr] gap-10 lg:gap-16 pb-10">
          <div>
          <div className="max-w-sm">
            <Link to="/" className="inline-flex items-center mb-4" aria-label="Choosify Home">
              {siteConfig?.websiteAssets?.footerLogo ? (
                <img
                  src={siteConfig.websiteAssets.footerLogo}
                  alt="Choosify"
                  className="h-12 w-auto object-contain"
                />
              ) : (
                <ChoosifyTextWordmarkLogo height={48} className="h-12 w-auto" />
              )}
            </Link>
            <p className="text-white/50 text-[13px] leading-relaxed mb-6">
              {footer?.tagline ||
                footer?.description ||
                "Bangladesh's smartest product discovery platform. Find the best brand, compare price, and shop with confidence."}
            </p>
            <FooterHeading>Connect</FooterHeading>
            <div className="flex flex-wrap gap-2 mb-6">
              {socials.map((social) => (
                <a
                  key={social.id}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-full bg-white flex items-center justify-center hover:scale-105 transition-transform"
                  aria-label={`Visit Choosify on ${social.platform}`}
                  title={social.platform}
                >
                  {socialIconSrc(social.platform) ? (
                    <BrandIcon
                      platform={social.platform}
                      size={20}
                      className="w-5 h-5 object-contain"
                    />
                  ) : null}
                </a>
              ))}
            </div>
          </div>

          {/*
            The brand block above is capped at max-w-sm (logo/tagline read
            better narrow), which leaves this row free to use the blank space
            next to it, still within this same first grid column.
          */}
          <div className="flex flex-wrap gap-x-10 gap-y-6 sm:gap-x-16 mt-6">
            <div>
              <FooterHeading>Contact Us</FooterHeading>
              <div className="flex flex-col gap-2">
                <a
                  href={`mailto:${contactEmail}`}
                  className="text-[13px] font-medium text-white/70 hover:text-white transition-colors"
                >
                  Email: {contactEmail}
                </a>
                <a
                  href={`tel:${contactPhone.replace(/\s+/g, '')}`}
                  className="text-[13px] font-medium text-white/70 hover:text-white transition-colors"
                >
                  Phone: {contactPhone}
                </a>
              </div>
            </div>
          </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 sm:gap-8">
            {footerColumns.map((column) => (
              <div key={column.id}>
                <FooterHeading>{column.title}</FooterHeading>
                <div className="flex flex-col gap-2.5">
                  {column.links.map((link) => (
                    <FooterLink
                      key={`${column.id}-${link.label}`}
                      label={link.label}
                      url={link.url}
                    />
                  ))}
                </div>
                {column.id === sellCreateColumnId && (
                  <div className="mt-8">
                    <SellOrCreateWithUs />
                  </div>
                )}
              </div>
            ))}

            <div>
              <FooterHeading>Address</FooterHeading>
              <div className="flex flex-col gap-4">
                {officeAddresses.map((office) => (
                  <div key={office.id}>
                    <p className="text-[13px] font-semibold text-white/90 mb-1">{office.label}</p>
                    <p className="text-[12px] font-medium text-white/50 leading-relaxed">
                      {office.lines.map((line) => (
                        <span key={line} className="block">
                          {line}
                        </span>
                      ))}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom strip: payments + apps — same column split as brand/links above */}
        {footer?.showPaymentIcons !== false && (
          <div className="border-t border-white/10 pt-8 pb-8">
            <div className="grid grid-cols-1 lg:grid-cols-[1.15fr_1.85fr] gap-10 lg:gap-16 items-start">
              <div>
                <FooterHeading>Payments Accepted</FooterHeading>
                <PaymentMethodsGrid layout="row" />
              </div>

              <div className="w-full lg:flex lg:flex-col lg:items-end lg:text-right">
                <FooterHeading>Available On Platforms</FooterHeading>
                <p className="text-white/45 text-xs mb-4 lg:max-w-md">
                  Download the app — or scan to open the store
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full lg:w-auto lg:max-w-[520px]">
                  {platforms.map((app) => {
                    const fallback = APP_DOWNLOADS.find((a) => a.id === app.id);
                    const storeIcon = (app as { storeIcon?: string }).storeIcon || fallback?.storeIcon;
                    const platformIcon = (app as { platformIcon?: string }).platformIcon || fallback?.platformIcon;
                    return (
                      <div
                        key={app.id}
                        className="flex items-center gap-3 rounded-2xl bg-white/[0.04] border border-white/10 p-2.5 pr-3 text-left w-full"
                      >
                        <a
                          href={app.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2.5 flex-1 min-w-0 hover:opacity-90 transition-opacity"
                          aria-label={`Download Choosify on ${app.store}`}
                        >
                          <span className="w-10 h-10 rounded-xl bg-black flex items-center justify-center overflow-hidden shrink-0">
                            {storeIcon ? (
                              <img
                                src={storeIcon}
                                alt=""
                                className="w-6 h-6 object-contain"
                                draggable={false}
                              />
                            ) : null}
                          </span>
                          <span className="flex flex-col min-w-0">
                            <span className="text-[10px] uppercase tracking-wide text-white/40 font-semibold truncate">
                              Get it on
                            </span>
                            <span className="flex items-center gap-1 text-[13px] font-semibold text-white/90 min-w-0">
                              {platformIcon ? (
                                <img
                                  src={platformIcon}
                                  alt=""
                                  className={
                                    app.id === 'apple'
                                      ? 'w-3 h-3 object-contain invert shrink-0'
                                      : 'w-3 h-3 object-contain shrink-0'
                                  }
                                  draggable={false}
                                />
                              ) : null}
                              <span className="truncate">{app.platform}</span>
                            </span>
                          </span>
                        </a>

                        <a
                          href={app.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="shrink-0 rounded-lg bg-white p-1.5 hover:opacity-95 transition-opacity"
                          aria-label={`Scan QR code for ${app.store}`}
                          title={`Scan for ${app.store}`}
                        >
                          <img
                            src={
                              app.qrImage ||
                              `https://api.qrserver.com/v1/create-qr-code/?size=72x72&margin=6&data=${encodeURIComponent(app.href)}`
                            }
                            alt={`QR code for ${app.store}`}
                            width={64}
                            height={64}
                            className="w-14 h-14 min-[400px]:w-16 min-[400px]:h-16 object-contain"
                            loading="lazy"
                          />
                        </a>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Delivery partner + business IDs */}
        {footer?.showDeliveryPartners !== false && (
          <div className="border-t border-white/10 pt-8 pb-8">
            <div className="flex flex-wrap gap-8 lg:gap-16">
              <div>
                <FooterHeading>Delivery Partner</FooterHeading>
                <div className="flex flex-wrap items-center gap-2">
                  {(deliveryPartners.length
                    ? deliveryPartners.map((logo) => ({
                        src: logo.image || '',
                        alt: logo.label,
                      }))
                    : TRUST_SECTIONS[0].logos
                  ).map((logo) => (
                    <span
                      key={logo.src || logo.alt}
                      className="inline-flex items-center justify-center h-9 w-[72px] px-1.5 rounded-md overflow-hidden bg-white"
                      title={logo.alt}
                      aria-label={logo.alt}
                    >
                      {logo.src ? (
                        <img
                          src={logo.src}
                          alt={logo.alt}
                          className="h-5 w-auto max-w-full object-contain"
                          loading="lazy"
                          draggable={false}
                        />
                      ) : (
                        <span className="text-[9px] font-bold text-slate-700">{logo.alt}</span>
                      )}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex flex-wrap gap-8 lg:gap-16 lg:ml-auto lg:text-right">
                <div>
                  <FooterHeading>DBID</FooterHeading>
                  <p className="text-[13px] font-medium text-white/70">DBID No: {dbid}</p>
                </div>

                <div>
                  <FooterHeading>Trade License Number</FooterHeading>
                  <p className="text-[13px] font-medium text-white/70">Trade License No: {tradeLicense}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="border-t border-white/10 py-5 flex items-center justify-center">
          <p className="text-xs text-white/35">
            {footer?.copyrightText ? (
              footer.copyrightText
            ) : (
              <>
                <span className="text-orange-primary">©</span> {year}{' '}
                <span className="text-orange-primary font-semibold">Choosify</span>
                . All rights reserved.
              </>
            )}
          </p>
        </div>
      </div>

      <div
        className="w-full flex justify-center pb-3 overflow-hidden select-none pointer-events-none px-4"
        aria-hidden
      >
        <ChoosifyWordmarkLogo
          fluid
          title=""
          className="w-full max-w-[min(92vw,1100px)] h-auto opacity-[0.88] [image-rendering:auto]"
        />
      </div>
    </footer>
  );
}
