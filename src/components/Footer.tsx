import React from 'react';
import { Facebook, Instagram, Youtube } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useGlobalState } from '../context/GlobalStateContext';
import type { SiteFooterColumn } from '../types/catalog';
import { ChoosifyTextWordmarkLogo } from './ChoosifyTextWordmarkLogo';
import { ChoosifyWordmarkLogo } from './ChoosifyWordmarkLogo';

/** Choosify.dc.html / Footer.dc.html column set — do not inject extra LEGAL links */
const DEFAULT_FOOTER_COLUMNS: SiteFooterColumn[] = [
  {
    id: 'discover',
    title: 'DISCOVER',
    links: [
      { label: 'Top Brands', url: '/brands' },
      { label: 'New Arrival', url: '/products?sort=new' },
      { label: 'Compare Tool', url: '/compare' },
      { label: 'Best Deals', url: '/deals' },
    ],
  },
  {
    id: 'company',
    title: 'COMPANY',
    links: [
      { label: 'Suggest a brand', url: '/about#suggest-brand' },
      { label: 'Partnership', url: '/about#partnership' },
      { label: 'Advertise', url: '/about#advertise' },
      { label: 'B2B', url: '/about#b2b' },
    ],
  },
  {
    id: 'legal',
    title: 'LEGAL',
    links: [
      { label: 'Terms', url: '/about#terms' },
      { label: 'Policy', url: '/about#privacy' },
      { label: 'Contact us', url: '/about#contact' },
      { label: 'About', url: '/about' },
    ],
  },
];

function TikTokIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.02 1.73 4.1 1.12 1.09 2.62 1.7 4.18 1.8v3.91c-1.85-.01-3.61-.68-5.07-1.82V14.5c.04 3.39-2.14 6.55-5.4 7.63-3.25 1.08-6.9-.32-8.56-3.32C1.65 15.82 2.45 11.9 5.31 9.87c1.78-1.27 4.14-1.55 6.16-.72.01-.16.02-.32.02-.48V4.83c-1.41-.35-2.88-.16-4.16.54-2.1 1.15-3.35 3.51-3.14 5.92.21 2.42 2.01 4.54 4.38 5.17 2.37.64 4.96-.2 6.09-2.26.47-.86.7-1.84.66-2.82V.02Z" />
    </svg>
  );
}

const SOCIAL_BG: Record<string, string> = {
  facebook: '#1877F2',
  instagram: 'linear-gradient(45deg,#f09433,#e6683c,#dc2743,#cc2366,#bc1888)',
  tiktok: '#000000',
  youtube: '#FF0000',
};

export function Footer() {
  const { siteConfig } = useGlobalState();
  const footer = siteConfig?.footer;
  const socialLinks = (siteConfig?.socialLinks || [])
    .filter((link) => link.isVisible)
    .sort((a, b) => a.order - b.order);

  // Footer.dc.html: Facebook, TikTok, YouTube only
  const defaultSocials = [
    { id: 'fb', platform: 'Facebook', url: 'https://www.facebook.com/choosify.bd', isVisible: true, order: 0 },
    { id: 'tt', platform: 'TikTok', url: 'https://www.tiktok.com/@choosify5', isVisible: true, order: 1 },
    { id: 'yt', platform: 'YouTube', url: 'https://www.youtube.com/@choosifybd', isVisible: true, order: 2 },
  ];

  const renderSocialIcon = (platform: string) => {
    const normalized = platform.toLowerCase();
    if (normalized.includes('instagram')) return <Instagram size={16} />;
    if (normalized.includes('tiktok')) return <TikTokIcon size={16} />;
    if (normalized.includes('youtube')) return <Youtube size={16} />;
    return <Facebook size={16} />;
  };

  const socialBg = (platform: string) => {
    const n = platform.toLowerCase();
    if (n.includes('instagram')) return SOCIAL_BG.instagram;
    if (n.includes('tiktok')) return SOCIAL_BG.tiktok;
    if (n.includes('youtube')) return SOCIAL_BG.youtube;
    return SOCIAL_BG.facebook;
  };

  const footerColumns = useMemo(
    () => (footer?.columns?.length ? footer.columns : DEFAULT_FOOTER_COLUMNS),
    [footer?.columns],
  );

  return (
    <footer className="w-full footer-brand-gradient text-gray-400 font-sans relative overflow-hidden" id="global-footer">
      <div className="max-w-[1280px] mx-auto px-6 md:px-10 pt-16 relative z-10">
        <div className="flex flex-wrap gap-12 md:gap-[60px] justify-between pb-11 border-b border-white/10">
          <div className="flex-1 min-w-[280px] max-w-[360px]">
            <Link to="/" className="inline-flex items-center mb-4" aria-label="Choosify Home">
              <ChoosifyTextWordmarkLogo height={34} />
            </Link>
            <p className="text-white/55 text-sm leading-relaxed mb-7">
              {footer?.description ||
                "Bangladesh's Smartest Product Discovery Platform. Find The Best Brand, Compare Price, And Shop With Confidence"}
            </p>
            <h4 className="text-white font-bold uppercase tracking-[0.06em] text-[13px] mb-3.5">
              Connect With Us
            </h4>
            <div className="flex flex-col gap-2.5">
              {(socialLinks.length ? socialLinks : defaultSocials).map((social) => (
                <a
                  key={social.id}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2.5 group"
                  aria-label={`Visit Choosify on ${social.platform}`}
                >
                  <span
                    className="w-8 h-8 rounded-full flex items-center justify-center text-white shrink-0"
                    style={{ background: socialBg(social.platform) }}
                  >
                    {renderSocialIcon(social.platform)}
                  </span>
                  <span className="text-[13px] font-semibold text-white/85 group-hover:text-white transition-colors">
                    {social.platform}
                  </span>
                </a>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap gap-12 md:gap-[60px]">
            {footerColumns.map((column) => (
              <div key={column.id} className="min-w-[150px]">
                <h4 className="text-white/40 font-bold uppercase tracking-[0.06em] text-[13px] mb-[18px]">
                  {column.title}
                </h4>
                <div className="flex flex-col gap-3.5">
                  {column.links.map((link) =>
                    link.url.startsWith('http') ? (
                      <a
                        key={`${column.id}-${link.label}`}
                        href={link.url}
                        className="text-white/85 text-sm font-semibold hover:text-white transition-colors inline-flex items-center gap-2"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {link.label}
                        {link.label.toLowerCase().includes('compare') && (
                          <span className="text-[9px] font-extrabold text-white bg-[#2323FF] px-1.5 py-0.5 rounded-[5px] tracking-wide">
                            NEW
                          </span>
                        )}
                      </a>
                    ) : (
                      <Link
                        key={`${column.id}-${link.label}`}
                        to={link.url}
                        className="text-white/85 text-sm font-semibold hover:text-white transition-colors inline-flex items-center gap-2"
                      >
                        {link.label}
                        {link.label.toLowerCase().includes('compare') && (
                          <span className="text-[9px] font-extrabold text-white bg-[#2323FF] px-1.5 py-0.5 rounded-[5px] tracking-wide">
                            NEW
                          </span>
                        )}
                      </Link>
                    ),
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <p className="text-xs text-white/40 text-center py-5">© 2026 Choosify. All rights reserved.</p>
      </div>

      <div
        className="w-full flex justify-center mt-1 pb-3 overflow-hidden select-none pointer-events-none px-4"
        aria-hidden
      >
        <ChoosifyWordmarkLogo
          fluid
          title=""
          className="w-full max-w-[min(92vw,1100px)] h-auto opacity-[0.92]"
        />
      </div>
    </footer>
  );
}
