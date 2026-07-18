import React from 'react';
import { ArrowRight } from 'lucide-react';
import { cn } from '../lib/utils';

export interface PaginationBarProps {
  currentPage?: number;
  totalPages?: number;
  showingCount?: number;
  totalCount?: number;
  onPageChange?: (page: number) => void;
  className?: string;
  /** Choosify.dc.html pageNums: square 32px, no arrows, no summary (default). */
  showArrows?: boolean;
  showSummary?: boolean;
}

function buildPageList(current: number, total: number): (number | '...')[] {
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }
  if (current <= 3) return [1, 2, 3, '...', total];
  if (current >= total - 2) return [1, '...', total - 2, total - 1, total];
  return [1, '...', current, '...', total];
}

/** Choosify.dc.html `pageNums` — 32×32, radius 6px, active #FF5B00 */
export function PaginationBar({
  currentPage = 1,
  totalPages = 12,
  showingCount,
  totalCount,
  onPageChange,
  className,
  showArrows = false,
  showSummary = false,
}: PaginationBarProps) {
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
              'bg-white border border-[#E5E7EB] text-[#1A1A2E] hover:border-[#FF5B00] hover:text-[#FF5B00] disabled:opacity-40 disabled:pointer-events-none',
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
                  : 'bg-white border border-[#E5E7EB] text-[#1A1A2E] hover:border-[#FF5B00] hover:text-[#FF5B00]',
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
              'bg-white border border-[#E5E7EB] text-[#1A1A2E] hover:border-[#FF5B00] hover:text-[#FF5B00] disabled:opacity-40 disabled:pointer-events-none',
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
