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
  '#EB4501',
  '#000435',
  '#7C3AED',
  '#0EA5E9',
];

/** Choosify.dc.html — 8-col logo name grid */
export function HomeFeaturedBrandsSection({
  featuredBrands,
  brandFallback = [],
}: HomeFeaturedBrandsSectionProps) {
  const brands = (featuredBrands.length ? featuredBrands : brandFallback).slice(0, 8);
  if (!brands.length) return null;

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
      <div className="grid grid-cols-4 md:grid-cols-8 gap-3 mb-2">
        {brands.map((b: any, i: number) => {
          const name = b.name || b.brandName || 'Brand';
          const href = b.slug ? `/brands/${b.slug}` : b.id ? `/brands/${b.id}` : '/brands';
          const logo = b.logo || b.image;
          return (
            <Link
              key={b.id ?? name}
              to={href}
              className="bg-white border border-[#E8EDF2] rounded-[10px] h-14 flex items-center justify-center px-2 hover:border-[#FF5B00]/40 transition-colors"
              title={name}
            >
              {logo ? (
                <img
                  src={logo || PLACEHOLDER_IMAGE}
                  alt={name}
                  className="max-h-8 max-w-full object-contain"
                  loading="lazy"
                />
              ) : (
                <span
                  className="text-[13px] font-extrabold truncate"
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
