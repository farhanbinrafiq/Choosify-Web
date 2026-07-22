import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useGlobalState } from '../context/GlobalStateContext';
import type { SiteFooterColumn } from '../types/catalog';
import { ChoosifyTextWordmarkLogo } from './ChoosifyTextWordmarkLogo';
import { ChoosifyWordmarkLogo } from './ChoosifyWordmarkLogo';
import { BrandIcon } from './icons/BrandIcon';
import { APP_STORE_ICON, socialIconSrc } from './icons/brandIcons';
import { PaymentMethodsGrid } from './icons/PaymentMethodIcons';

const DEFAULT_FOOTER_COLUMNS: SiteFooterColumn[] = [
  {
    id: 'discover',
    title: 'Discover',
    links: [
      { label: 'Top Brands', url: '/brands' },
      { label: 'Browse', url: '/products' },
      { label: 'New Arrival', url: '/products?sort=new' },
      { label: 'Compare Tool', url: '/compare' },
      { label: 'Best Deals', url: '/deals' },
    ],
  },
  {
    id: 'company',
    title: 'Company',
    links: [
      { label: 'Suggest a brand', url: '/about#suggest-brand' },
      { label: 'Partnership', url: '/about#partnership' },
      { label: 'Advertise', url: '/about#advertise' },
      { label: 'B2B', url: '/about#b2b' },
    ],
  },
  {
    id: 'legal',
    title: 'Legal',
    links: [
      { label: 'Terms', url: '/about#terms' },
      { label: 'Policy', url: '/about#privacy' },
      { label: 'Contact us', url: '/about#contact' },
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
  const isCompare = label.toLowerCase().includes('compare');
  const className =
    'text-[13px] font-medium text-white/70 hover:text-white transition-colors inline-flex items-center gap-2';

  const content = (
    <>
      {label}
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

  return (
    <footer
      className="w-full footer-brand-gradient text-gray-400 font-sans relative overflow-hidden"
      id="global-footer"
    >
      <div className="max-w-[1280px] mx-auto px-6 md:px-10 pt-14 md:pt-16 relative z-10">
        {/* Top: brand + link columns */}
        <div className="grid grid-cols-1 lg:grid-cols-[1.15fr_1.85fr] gap-10 lg:gap-16 pb-10">
          <div className="max-w-sm">
            <Link to="/" className="inline-flex items-center mb-4" aria-label="Choosify Home">
              <ChoosifyTextWordmarkLogo height={32} />
            </Link>
            <p className="text-white/50 text-[13px] leading-relaxed mb-6">
              {footer?.description ||
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

            <FooterHeading>Contact Us</FooterHeading>
            <div className="flex flex-col gap-2">
              <a
                href="mailto:support@choosify.bd"
                className="text-[13px] font-medium text-white/70 hover:text-white transition-colors"
              >
                Email: support@choosify.bd
              </a>
              <a
                href="tel:+8801410423014"
                className="text-[13px] font-medium text-white/70 hover:text-white transition-colors"
              >
                Phone: +880 01410 423014
              </a>
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
              </div>
            ))}

            <div>
              <FooterHeading>Address</FooterHeading>
              <div className="flex flex-col gap-4">
                {OFFICE_ADDRESSES.map((office) => (
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
                {APP_DOWNLOADS.map((app) => (
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
                        <img
                          src={app.storeIcon}
                          alt=""
                          className="w-6 h-6 object-contain"
                          draggable={false}
                        />
                      </span>
                      <span className="flex flex-col min-w-0">
                        <span className="text-[10px] uppercase tracking-wide text-white/40 font-semibold truncate">
                          Get it on
                        </span>
                        <span className="flex items-center gap-1 text-[13px] font-semibold text-white/90 min-w-0">
                          <img
                            src={app.platformIcon}
                            alt=""
                            className={
                              app.id === 'apple'
                                ? 'w-3 h-3 object-contain invert shrink-0'
                                : 'w-3 h-3 object-contain shrink-0'
                            }
                            draggable={false}
                          />
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
                        src={`https://api.qrserver.com/v1/create-qr-code/?size=72x72&margin=6&data=${encodeURIComponent(app.href)}`}
                        alt={`QR code for ${app.store}`}
                        width={64}
                        height={64}
                        className="w-14 h-14 min-[400px]:w-16 min-[400px]:h-16 object-contain"
                        loading="lazy"
                      />
                    </a>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Delivery partner + business IDs */}
        <div className="border-t border-white/10 pt-8 pb-8">
          <div className="flex flex-wrap gap-8 lg:gap-16">
            {TRUST_SECTIONS.map((section) => (
              <div key={section.id}>
                <FooterHeading>{section.title}</FooterHeading>
                <div className="flex flex-wrap items-center gap-2">
                  {section.logos.map((logo) => (
                    <span
                      key={logo.src}
                      className="inline-flex items-center justify-center h-9 w-[72px] px-1.5 rounded-md overflow-hidden bg-white"
                      title={logo.alt}
                      aria-label={logo.alt}
                    >
                      <img
                        src={logo.src}
                        alt={logo.alt}
                        className="h-5 w-auto max-w-full object-contain"
                        loading="lazy"
                        draggable={false}
                      />
                    </span>
                  ))}
                </div>
              </div>
            ))}

            <div className="flex flex-wrap gap-8 lg:gap-16 lg:ml-auto lg:text-right">
              <div>
                <FooterHeading>DBID</FooterHeading>
                <p className="text-[13px] font-medium text-white/70">
                  DBID No: —
                </p>
              </div>

              <div>
                <FooterHeading>Trade License Number</FooterHeading>
                <p className="text-[13px] font-medium text-white/70">
                  Trade License No: —
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 py-5 flex items-center justify-center">
          <p className="text-xs text-white/35">
            <span className="text-orange-primary">©</span> 2026{' '}
            <span className="text-orange-primary font-semibold">Choosify</span>
            . All rights reserved.
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
          className="w-full max-w-[min(92vw,1100px)] h-auto opacity-[0.88]"
        />
      </div>
    </footer>
  );
}
