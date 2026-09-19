import React from 'react';
import { ArrowRight } from 'lucide-react';
import { cn } from '../lib/utils';

export interface PaginationBarProps {
  currentPage?: number;
  /** Real page count derived from the caller's own data (e.g.
   *  `Math.ceil(total / pageSize)` or backend pagination metadata) --
   *  required, not defaulted, so a caller can never end up showing fake
   *  pages just because it forgot to pass this. */
  totalPages: number;
  showingCount?: number;
  totalCount?: number;
  onPageChange?: (page: number) => void;
  className?: string;
  /** Choosify.dc.html pageNums: square 32px, arrows shown by default -- a
   *  page-number-only control is unusable once there are more pages than
   *  fit the windowed list (e.g. page 3 of 43 has no way to reach 4 or 5
   *  without them). */
  showArrows?: boolean;
  showSummary?: boolean;
}

/**
 * Windowed page list that always shows the current page WITH its neighbors,
 * not just "first 3 / last 3" -- being on page 3 of 43 must show 4 and 5 as
 * reachable, not jump straight from 3 to an ellipsis and page 43.
 */
function buildPageList(current: number, total: number): (number | '...')[] {
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }
  if (current <= 4) {
    return [1, 2, 3, 4, 5, '...', total];
  }
  if (current >= total - 3) {
    return [1, '...', total - 4, total - 3, total - 2, total - 1, total];
  }
  return [1, '...', current - 1, current, current + 1, '...', total];
}

/** Choosify.dc.html `pageNums` — 32×32, radius 6px, active #FF5B00 */
export function PaginationBar({
  currentPage = 1,
  totalPages,
  showingCount,
  totalCount,
  onPageChange,
  className,
  showArrows = true,
  showSummary = false,
}: PaginationBarProps) {
  // A dataset with zero or one page has nothing to paginate -- render
  // nothing rather than a decorative single "1" button or (worse) fake pages.
  if (totalPages <= 1) return null;

  const pages = buildPageList(currentPage, totalPages);
  const showing = showingCount ?? totalCount ?? 0;
  const total = totalCount ?? showing;

  const pageBtn =
    'w-8 h-8 min-w-[32px] min-h-[32px] shrink-0 rounded-md flex items-center justify-center text-xs font-bold transition-colors cursor-pointer';

  return (
    <div className={cn('mt-7 flex flex-col items-center gap-4', className)}>
      <div className="flex flex-wrap items-center justify-center gap-2 max-w-full px-2">
        {showArrows && (
          <button
            type="button"
            disabled={currentPage <= 1}
            onClick={() => onPageChange?.(Math.max(1, currentPage - 1))}
            className={cn(
              pageBtn,
              'bg-white border border-[#E5E7EB] text-[#1A1A2E] hover:border-[#FF5B00] hover:text-[#EF3C23] disabled:opacity-40 disabled:pointer-events-none',
            )}
            aria-label="Previous page"
          >
            <ArrowRight size={14} className="rotate-180" />
          </button>
        )}

        {pages.map((page, i) =>
          page === '...' ? (
            <span
              key={`ellipsis-${i}`}
              className="w-8 h-8 flex items-center justify-center text-xs font-bold text-[#9AA0AC]"
            >
              …
            </span>
          ) : (
            <button
              key={page}
              type="button"
              onClick={() => onPageChange?.(page)}
              className={cn(
                pageBtn,
                page === currentPage
                  ? 'bg-[#FF5B00] text-white border-0'
                  : 'bg-white border border-[#E5E7EB] text-[#1A1A2E] hover:border-[#FF5B00] hover:text-[#EF3C23]',
              )}
              aria-label={`Page ${page}`}
              aria-current={page === currentPage ? 'page' : undefined}
            >
              {page}
            </button>
          ),
        )}

        {showArrows && (
          <button
            type="button"
            disabled={currentPage >= totalPages}
            onClick={() => onPageChange?.(Math.min(totalPages, currentPage + 1))}
            className={cn(
              pageBtn,
              'bg-white border border-[#E5E7EB] text-[#1A1A2E] hover:border-[#FF5B00] hover:text-[#EF3C23] disabled:opacity-40 disabled:pointer-events-none',
            )}
            aria-label="Next page"
          >
            <ArrowRight size={14} />
          </button>
        )}
      </div>

      {showSummary && (showing > 0 || total > 0) && (
        <p className="text-[10px] font-bold text-[#9AA0AC] uppercase tracking-[0.16em]">
          Showing <span className="text-[#1A1A2E]">{showing}</span> of{' '}
          <span className="text-[#1A1A2E]">{total}</span> results
        </p>
      )}
    </div>
  );
}
