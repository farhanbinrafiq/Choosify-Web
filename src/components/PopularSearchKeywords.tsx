import React from 'react';
import { Link } from 'react-router-dom';
import { Search } from 'lucide-react';
import { cn } from '../lib/utils';
import { colors } from '../design-system/tokens/colors';
import { radius } from '../design-system/tokens/radius';
import { shadows } from '../design-system/tokens/shadows';
import { motionClass } from '../design-system/tokens/motion';

interface PopularSearchKeywordsProps {
  title: string;
  terms: string[];
  className?: string;
  variant?: 'default' | 'hero';
}

export function PopularSearchKeywords({
  title,
  terms,
  className,
  variant = 'default',
}: PopularSearchKeywordsProps) {
  if (!terms.length) return null;

  const isHero = variant === 'hero';

  return (
    <section
      className={cn(
        'mt-8 pt-8 border-t text-left',
        isHero ? 'border-white/15' : '',
        className,
      )}
      style={!isHero && !className?.includes('border-0') ? { borderColor: colors.border.DEFAULT } : undefined}
      aria-label={title || 'Popular searches'}
    >
      <h2
        className={cn(
          'text-xl sm:text-2xl font-bold tracking-tight mb-5',
          isHero ? 'text-white' : '',
          !title && 'sr-only',
        )}
        style={!isHero ? { color: colors.text.heading } : undefined}
      >
        {title || 'Popular searches'}
      </h2>
      <div className="flex flex-wrap gap-2.5 sm:gap-3">
        {terms.map((term) => (
          <Link
            key={term}
            to={`/search?q=${encodeURIComponent(term)}`}
            className={cn(
              'inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold min-h-[44px]',
              motionClass.hoverLift,
              isHero
                ? 'bg-white border border-white/20 shadow-sm'
                : 'bg-white border shadow-sm',
            )}
            style={{
              borderRadius: radius.full,
              borderColor: isHero ? undefined : colors.border.DEFAULT,
              color: colors.text.body,
            }}
          >
            <Search
              size={14}
              className="shrink-0"
              style={{ color: colors.brand.orange.legacy }}
              strokeWidth={2.25}
            />
            <span>{term}</span>
          </Link>
        ))}
      </div>
    </section>
  );
}
