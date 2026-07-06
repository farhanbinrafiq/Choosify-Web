import React from 'react';
import { Link } from 'react-router-dom';
import { Search } from 'lucide-react';
import { cn } from '../lib/utils';

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
        'mt-8 pt-8 border-t border-[#e8edf2] text-left',
        isHero && 'border-white/15',
        className,
      )}
      aria-label={title}
    >
      <h2
        className={cn(
          'text-xl sm:text-2xl font-bold tracking-tight mb-5',
          isHero ? 'text-white' : 'text-[#1a1a2e]',
        )}
      >
        {title}
      </h2>
      <div className="flex flex-wrap gap-2.5 sm:gap-3">
        {terms.map((term) => (
          <Link
            key={term}
            to={`/search?q=${encodeURIComponent(term)}`}
            className={cn(
              'inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition-colors',
              isHero
                ? 'bg-white text-[#1A1D4E] border border-white/20 hover:bg-white/95 hover:border-white shadow-sm'
                : 'bg-white text-[#1A1D4E] border border-[#e8edf2] hover:border-[#E8500A]/25 hover:bg-[#fafbfc] shadow-sm',
            )}
          >
            <Search
              size={14}
              className={cn('shrink-0', isHero ? 'text-[#E8500A]' : 'text-[#6b7280]')}
              strokeWidth={2.25}
            />
            <span>{term}</span>
          </Link>
        ))}
      </div>
    </section>
  );
}
