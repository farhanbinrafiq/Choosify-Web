import React from 'react';
import { Link } from 'react-router-dom';
import { DcHomeBlock } from '../DcHomePanel';
import {
  POPULAR_SERVICE_TILES,
  type PopularServiceId,
  productsHrefForService,
} from '../../../lib/home/popularServices';

interface HomePopularServicesSectionProps {
  services?: { id: string; label: string; href?: string }[];
}

/** Choosify.dc.html — service tiles open the products list (products + services as cards) */
export function HomePopularServicesSection({ services }: HomePopularServicesSectionProps) {
  const items = services?.length
    ? services.map((s) => {
        const def =
          POPULAR_SERVICE_TILES.find((d) => d.id === s.id) ?? POPULAR_SERVICE_TILES[0]!;
        const id = (s.id as PopularServiceId) || def.id;
        return {
          ...def,
          ...s,
          href: s.href || productsHrefForService(id, s.label || def.label),
        };
      })
    : POPULAR_SERVICE_TILES;

  return (
    <DcHomeBlock id="section-services">
      <h2 id="section-services-heading" className="text-[19px] font-extrabold text-[#1A1A2E] mb-4">
        Popular Services
      </h2>
      <div className="grid grid-cols-4 md:grid-cols-8 gap-3 mb-2">
        {items.map(({ id, label, letter, href, bg, fg, icon: Icon }) => (
          <Link
            key={id}
            to={href}
            className="bg-white border border-[#E8EDF2] rounded-[10px] px-2 py-[18px] flex flex-col items-center gap-2 hover:border-[#FF5B00]/35 transition-colors"
          >
            <div
              className="w-[34px] h-[34px] rounded-full flex items-center justify-center text-xs font-extrabold"
              style={{ backgroundColor: bg, color: fg }}
            >
              <Icon size={14} aria-hidden />
              <span className="sr-only">{letter}</span>
            </div>
            <div className="text-[11px] font-semibold text-[#1A1A2E] text-center line-clamp-2">
              {label}
            </div>
          </Link>
        ))}
      </div>
    </DcHomeBlock>
  );
}
