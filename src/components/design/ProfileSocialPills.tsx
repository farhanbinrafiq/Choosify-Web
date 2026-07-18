import React from 'react';

export interface ProfileSocialLink {
  name: string;
  href?: string;
  bg: string;
  layers: Array<{ color: string; dx: number; dy: number; glyph: string }>;
}

/** Choosify.dc.html Brand Detail / Creator Profile social pills */
export const DEFAULT_PROFILE_SOCIAL_LINKS: ProfileSocialLink[] = [
  {
    name: 'Facebook',
    bg: '#1877F2',
    layers: [{ color: '#fff', dx: 0, dy: 0, glyph: 'f' }],
  },
  {
    name: 'TikTok',
    bg: '#000',
    layers: [
      { color: '#25F4EE', dx: -1, dy: -1, glyph: '♪' },
      { color: '#FE2C55', dx: 1, dy: 1, glyph: '♪' },
      { color: '#fff', dx: 0, dy: 0, glyph: '♪' },
    ],
  },
  {
    name: 'YouTube',
    bg: '#FF0000',
    layers: [{ color: '#fff', dx: 0, dy: 0, glyph: '▶' }],
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
              className="relative w-[26px] h-[26px] rounded-full flex items-center justify-center shrink-0"
              style={{ background: sl.bg }}
            >
              {sl.layers.map((ly, i) => (
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
              ))}
            </div>
            <span className="text-[11px] font-bold text-[#1A1A2E]">{sl.name}</span>
          </>
        );

        const pillClass =
          'inline-flex items-center gap-1.5 bg-[#F4F7F9] border border-[#E8EDF2] rounded-[20px] pl-1 pr-3 py-1 no-underline hover:border-[#FF5B00]/40 transition-colors';

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
