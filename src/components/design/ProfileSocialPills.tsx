import React from 'react';
import { BRAND_ICON } from '../icons/brandIcons';

export interface ProfileSocialLink {
  name: string;
  href?: string;
  iconSrc?: string;
  /** @deprecated Prefer iconSrc — kept for legacy glyph layers */
  bg?: string;
  layers?: Array<{ color: string; dx: number; dy: number; glyph: string }>;
}

/** Brand Detail / Creator Profile social pills — rounded icons from brand sprite */
export const DEFAULT_PROFILE_SOCIAL_LINKS: ProfileSocialLink[] = [
  {
    name: 'Facebook',
    href: 'https://www.facebook.com/choosify.bd',
    iconSrc: BRAND_ICON.facebook,
  },
  {
    name: 'Instagram',
    href: 'https://www.instagram.com/choosify.bd/',
    iconSrc: BRAND_ICON.instagram,
  },
  {
    name: 'YouTube',
    href: 'https://www.youtube.com/@choosifybd',
    iconSrc: BRAND_ICON.youtube,
  },
  {
    name: 'LinkedIn',
    href: 'https://www.linkedin.com/company/choosifybangladesh/',
    iconSrc: BRAND_ICON.linkedin,
  },
  {
    name: 'TikTok',
    href: 'https://www.tiktok.com/@choosify.bd',
    iconSrc: BRAND_ICON.tiktok,
  },
];

interface ProfileSocialPillsProps {
  links?: ProfileSocialLink[];
  className?: string;
}

export function ProfileSocialPills({
  links = DEFAULT_PROFILE_SOCIAL_LINKS,
  className,
}: ProfileSocialPillsProps) {
  if (!links.length) return null;

  return (
    <div className={`flex flex-wrap gap-2 ${className ?? ''}`}>
      {links.map((sl) => {
        const inner = (
          <>
            <div
              className="relative w-[26px] h-[26px] rounded-full flex items-center justify-center shrink-0 overflow-hidden bg-white"
              style={sl.iconSrc ? undefined : { background: sl.bg }}
            >
              {sl.iconSrc ? (
                <img
                  src={sl.iconSrc}
                  alt=""
                  width={20}
                  height={20}
                  className="w-5 h-5 object-contain"
                  draggable={false}
                  aria-hidden
                />
              ) : (
                (sl.layers ?? []).map((ly, i) => (
                  <span
                    key={`${sl.name}-${i}`}
                    className="absolute text-[11px] font-extrabold leading-none"
                    style={{
                      color: ly.color,
                      transform: `translate(${ly.dx}px, ${ly.dy}px)`,
                    }}
                  >
                    {ly.glyph}
                  </span>
                ))
              )}
            </div>
            <span className="text-[11px] font-bold text-[#1A1A2E]">{sl.name}</span>
          </>
        );

        const pillClass =
          'inline-flex items-center gap-1.5 bg-[#F4F7F9] border border-[#E8EDF2] rounded-[20px] pl-1 pr-3 py-1 no-underline hover:border-[#EB4501]/40 transition-colors';

        if (sl.href) {
          return (
            <a
              key={sl.name}
              href={sl.href}
              target="_blank"
              rel="noopener noreferrer"
              className={pillClass}
            >
              {inner}
            </a>
          );
        }

        return (
          <div key={sl.name} className={pillClass} role="img" aria-label={sl.name}>
            {inner}
          </div>
        );
      })}
    </div>
  );
}
