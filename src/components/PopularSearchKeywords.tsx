import React from 'react';
import { Link } from 'react-router-dom';
import { Search } from 'lucide-react';
import { cn } from '../lib/utils';

interface PopularSearchKeywordsProps {
  title: string;
  terms: string[];
  className?: string;
}

export function PopularSearchKeywords({ title, terms, className }: PopularSearchKeywordsProps) {
  if (!terms.length) return null;

  return (
    <section
      className={cn(
        'mt-8 pt-8 border-t border-[#e8edf2] text-left',
        className,
      )}
      aria-label={title}
    >
      <h2 className="text-xl sm:text-2xl font-bold text-[#1a1a2e] tracking-tight mb-5">
        {title}
      </h2>
      <div className="flex flex-wrap gap-2.5 sm:gap-3">
        {terms.map((term) => (
          <Link
            key={term}
            to={`/search?q=${encodeURIComponent(term)}`}
            className="inline-flex items-center gap-2 rounded-full bg-[#f3f4f6] hover:bg-[#e8edf2] border border-transparent hover:border-[#d1d5db] px-4 py-2 text-sm font-medium text-[#374151] transition-colors"
          >
            <Search size={14} className="shrink-0 text-[#6b7280]" strokeWidth={2.25} />
            <span>{term}</span>
          </Link>
        ))}
      </div>
    </section>
  );
}
