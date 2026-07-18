import React from 'react';
import { Link } from 'react-router-dom';
import { cn } from '../../lib/utils';
import { colors } from '../../design-system/tokens/colors';
import { radius } from '../../design-system/tokens/radius';
import { shadows } from '../../design-system/tokens/shadows';
import { motionClass } from '../../design-system/tokens/motion';

interface BrandLogoMarqueeProps {
  brands: Array<{ id: string | number; name: string; logo?: string }>;
  className?: string;
}

export function BrandLogoMarquee({ brands, className }: BrandLogoMarqueeProps) {
  if (!brands.length) return null;

  return (
    <div
      className={cn(
        'flex gap-4 md:gap-5 overflow-x-auto scrollbar-hide snap-x snap-mandatory pb-1 -mx-1 px-1',
        className,
      )}
      role="list"
      aria-label="Featured brand logos"
    >
      {brands.map((brand) => (
        <Link
          key={brand.id}
          to={`/brands/${brand.id}`}
          role="listitem"
          title={brand.name}
          className={cn(
            'group snap-start shrink-0 flex items-center justify-center bg-white border min-w-[140px] md:min-w-[160px] h-[72px] md:h-[80px] px-6',
            motionClass.hoverLift,
          )}
          style={{
            borderColor: colors.border.subtle,
            borderRadius: radius.xl,
            boxShadow: shadows.sm,
          }}
        >
          {brand.logo && String(brand.logo).startsWith('http') ? (
            <img
              src={brand.logo}
              alt={brand.name}
              className="h-7 md:h-8 w-auto max-w-[110px] object-contain opacity-80 group-hover:opacity-100 transition-opacity"
              loading="lazy"
            />
          ) : (
            <span className="text-sm font-black" style={{ color: colors.text.body }}>
              {brand.name}
            </span>
          )}
        </Link>
      ))}
    </div>
  );
}
