import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { cn } from '../../lib/utils';
import { DC_LISTING_HERO_BG, EMI_GRADIENT_CLASS, LISTING_PAGE_MAX_WIDTH } from '../../lib/design/dcListingTokens';

interface DcListingHeroProps {
  /** Plain text before the gradient pill, e.g. "Explore Every" */
  titleBefore: string;
  /** Text inside the blue→orange pill, e.g. "Product" */
  titleHighlight: string;
  /** Optional line above title (Discover uses "DISCOVER.") */
  eyebrow?: string;
  searchPlaceholder?: string;
  quickChips?: string[];
  onSearch?: (query: string) => void;
  onChipClick?: (chip: string) => void;
  /** Match listing feed width (Home/Product/Guide detail stay full-bleed elsewhere) */
  maxWidthClass?: string;
  className?: string;
}

/**
 * Choosify listing/discover hero — navy gradient constrained to the feed silhouette
 * (not viewport edge-to-edge; only Home / Product Detail / Guide Detail heroes stay full-bleed).
 */
export function DcListingHero({
  titleBefore,
  titleHighlight,
  eyebrow,
  searchPlaceholder = 'Search...',
  quickChips = [],
  onSearch,
  onChipClick,
  maxWidthClass = LISTING_PAGE_MAX_WIDTH,
  className,
}: DcListingHeroProps) {
  const [query, setQuery] = useState('');

  const submit = (e?: React.FormEvent) => {
    e?.preventDefault();
    onSearch?.(query.trim());
  };

  return (
    <div className={cn('w-full px-5 sm:px-8 lg:px-10', className)}>
      <div
        className={cn(
          maxWidthClass,
          'mx-auto relative px-5 sm:px-10 pt-14 pb-14 text-center text-white overflow-hidden rounded-[14px] choosify-dark-surface',
        )}
        style={{ background: DC_LISTING_HERO_BG }}
      >
        {eyebrow && (
          <div className="relative z-[1] text-[11px] font-extrabold text-[#FF5B00] tracking-widest mb-3.5">
            {eyebrow}
          </div>
        )}
        <h1 className="relative z-[1] text-3xl md:text-[36px] font-extrabold leading-tight mb-7">
          {titleBefore}{' '}
          <span
            className={cn(
              'inline-block px-4 py-1 rounded-lg text-white',
              EMI_GRADIENT_CLASS,
            )}
          >
            {titleHighlight}
          </span>
        </h1>

        <form
          onSubmit={submit}
          className="relative z-[1] max-w-[400px] mx-auto mb-6 bg-white/10 backdrop-blur-[14px] border border-white/22 rounded-full p-1 flex gap-1.5"
        >
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={searchPlaceholder}
            className="flex-1 h-8 border-none bg-transparent rounded-full px-4 text-xs text-white placeholder:text-white/50 outline-none"
          />
          <button
            type="submit"
            className="bg-white/14 border border-white/25 text-white h-8 px-4 rounded-full text-[11px] font-bold inline-flex items-center gap-1.5 shrink-0 hover:bg-white/20 transition-colors"
          >
            <Search size={12} aria-hidden />
            Search
          </button>
        </form>

        {quickChips.length > 0 && (
          <div className="relative z-[1] flex justify-center gap-2.5 flex-wrap">
            {quickChips.map((chip) => (
              <button
                key={chip}
                type="button"
                onClick={() => {
                  setQuery(chip);
                  onChipClick?.(chip);
                  onSearch?.(chip);
                }}
                className="bg-white/8 border border-white/16 text-white/85 text-[11px] font-semibold px-3.5 py-1.5 rounded-[14px] hover:bg-white/14 transition-colors"
              >
                🔍 {chip}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
