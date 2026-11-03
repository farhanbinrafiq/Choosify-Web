import { brandPath } from '../../../../lib/publicUrls';
import { HomeEmptyNote } from './HomeEmptyNote';
import React from 'react';
import { Link } from 'react-router-dom';
import { DcHomeBlock } from '../DcHomePanel';
import { ViewAllLink } from '../../design/ViewAllLink';
import { PLACEHOLDER_IMAGE } from '../../../constants';

interface HomeFeaturedBrandsSectionProps {
  featuredBrands: any[];
  brandFallback?: any[];
  curatedPicks?: any[];
}

const BRAND_COLORS = [
  '#1A1A2E',
  '#FF5B00',
  '#2323FF',
  '#07A828',
  '#FF5B00',
  '#18154C',
  '#7C3AED',
  '#0EA5E9',
];

/**
 * Featured Brands — round logo bubbles with the brand name underneath.
 * Columns per screen width (4 / 6) and how many full rows each shows, so the grid never
 * ends in a half-empty row: phone 2 rows of 4, tablet and up 2 rows of 6. With fewer
 * brands, each width rounds down to whole rows (one short row only if there are fewer
 * brands than columns).
 */
const GRID_STEPS = [
  { cols: 4, max: 8, show: 'flex', hide: 'hidden' },
  { cols: 6, max: 12, show: 'md:flex', hide: 'md:hidden' },
] as const;
const MAX_FEATURED_BRANDS = 12;

const wholeRows = (count: number, cols: number, max: number) => {
  const n = Math.min(count, max);
  return n < cols ? n : n - (n % cols);
};

/** Tailwind classes that show tile `index` only where it falls inside a whole row. */
const visibilityClasses = (index: number, count: number) =>
  GRID_STEPS.map((s) => (index < wholeRows(count, s.cols, s.max) ? s.show : s.hide)).join(' ');

export function HomeFeaturedBrandsSection({
  featuredBrands,
  brandFallback = [],
}: HomeFeaturedBrandsSectionProps) {
  // Real brands only; the bundled sample list is a development aid (empty in production).
  const brands = (featuredBrands.length ? featuredBrands : brandFallback).slice(0, MAX_FEATURED_BRANDS);

  return (
    <DcHomeBlock id="section-featured-brands">
      <div className="flex items-baseline justify-between gap-3 mb-4">
        <h2
          id="section-featured-brands-heading"
          className="text-[19px] font-extrabold text-[#1A1A2E]"
        >
          Featured Brands
        </h2>
        <ViewAllLink href="/brands" label="VIEW ALL BRANDS ›" />
      </div>

      {brands.length === 0 && <HomeEmptyNote text="No featured brands yet." linkHref="/brands" linkLabel="Browse all brands" />}
      <div className="grid grid-cols-4 md:grid-cols-6 gap-x-3 gap-y-4 mb-2">
        {brands.map((b: any, i: number) => {
          const name = b.name || b.brandName || 'Brand';
          const href = brandPath(b);
          const logo = b.logo || b.image;
          return (
            <Link
              key={b.id ?? name}
              to={href}
              className={`group min-w-0 ${visibilityClasses(i, brands.length)} flex-col items-center gap-2 no-underline`}
              title={name}
              data-testid="home-brand-tile"
            >
              <span
                className="relative w-full max-w-[136px] aspect-square rounded-full overflow-hidden bg-white border border-[#E8EDF2] shadow-[0_2px_10px_rgba(0,0,0,0.05)] flex items-center justify-center group-hover:border-[#FF5B00]/50 group-hover:shadow-[0_4px_16px_rgba(255,91,0,0.15)] transition-all"
                data-testid="home-brand-circle"
              >
                {logo ? (
                  <>
                    {/* A soft, blurred copy of the logo fills the circle; the logo itself keeps
                        its own proportions (never stretched) and is sized so even a square
                        logo's corners stay inside the circle. */}
                    <img
                      src={logo}
                      alt=""
                      aria-hidden
                      className="absolute inset-0 w-full h-full object-cover scale-150 blur-2xl opacity-80 pointer-events-none"
                      loading="lazy"
                    />
                    <img
                      src={logo || PLACEHOLDER_IMAGE}
                      alt={name}
                      className="relative w-[68%] h-[68%] object-contain rounded-[8px] group-hover:scale-[1.05] transition-transform"
                      loading="lazy"
                    />
                  </>
                ) : (
                  <span
                    className="text-[clamp(16px,4vw,26px)] font-extrabold leading-none"
                    style={{ color: BRAND_COLORS[i % BRAND_COLORS.length] }}
                  >
                    {name.slice(0, 2).toUpperCase()}
                  </span>
                )}
              </span>
              <span className="w-full text-center text-[11px] md:text-[12px] font-bold text-[#1A1A2E] truncate leading-tight group-hover:text-[#FF5B00] transition-colors">
                {name}
              </span>
            </Link>
          );
        })}
      </div>
    </DcHomeBlock>
  );
}
