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
 * Featured Brands — responsive logo tiles.
 * Design bar is ~140×56 (≈5:2). Use that aspect so tiles scale as a unit
 * instead of a fixed height that squashes/stretches as column width changes.
 */
const BRAND_TILE_ASPECT = 'aspect-[5/2]';

/**
 * Columns per screen width (2 / 3 / 4 / 6) and how many full rows each shows, so the grid
 * never ends in a half-empty row: phone 4×2, small tablet 3×3, tablet 2×4, desktop 2×6.
 * With fewer brands, each width rounds down to whole rows (one short row only if there are
 * fewer brands than columns).
 */
const GRID_STEPS = [
  { cols: 2, max: 8, show: 'flex', hide: 'hidden' },
  { cols: 3, max: 9, show: 'sm:flex', hide: 'sm:hidden' },
  { cols: 4, max: 8, show: 'md:flex', hide: 'md:hidden' },
  { cols: 6, max: 12, show: 'lg:flex', hide: 'lg:hidden' },
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
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 mb-2">
        {brands.map((b: any, i: number) => {
          const name = b.name || b.brandName || 'Brand';
          const href = brandPath(b);
          const logo = b.logo || b.image;
          return (
            <Link
              key={b.id ?? name}
              to={href}
              className={`group relative overflow-hidden bg-white border border-[#E8EDF2] rounded-[10px] ${BRAND_TILE_ASPECT} w-full min-w-0 ${visibilityClasses(i, brands.length)} items-center justify-center px-2.5 hover:border-[#FF5B00]/40 transition-colors`}
              title={name}
              data-testid="home-brand-tile"
            >
              {logo ? (
                <>
                  {/* Fill the tile with a soft, blurred copy of the logo, so square or dark
                      logos don't sit as a small stamp on white; the logo itself keeps its
                      own proportions (never stretched or cropped). */}
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
                    className="relative h-[86%] w-auto max-w-[92%] object-contain rounded-[6px] group-hover:scale-[1.03] transition-transform"
                    loading="lazy"
                  />
                </>
              ) : (
                <span
                  className="text-[clamp(11px,2.8vw,13px)] font-extrabold truncate max-w-full text-center leading-tight px-0.5"
                  style={{ color: BRAND_COLORS[i % BRAND_COLORS.length] }}
                >
                  {name}
                </span>
              )}
            </Link>
          );
        })}
      </div>
    </DcHomeBlock>
  );
}
