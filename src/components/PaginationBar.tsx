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
}

function buildPageList(current: number, total: number): (number | '...')[] {
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }
  if (current <= 3) return [1, 2, 3, '...', total];
  if (current >= total - 2) return [1, '...', total - 2, total - 1, total];
  return [1, '...', current, '...', total];
}

export function PaginationBar({
  currentPage = 1,
  totalPages = 12,
  showingCount,
  totalCount,
  onPageChange,
  className,
}: PaginationBarProps) {
  const pages = buildPageList(currentPage, totalPages);
  const showing = showingCount ?? totalCount ?? 0;
  const total = totalCount ?? showing;

  return (
    <div className={cn('mt-16 pt-12 border-t border-gray-100 flex flex-col items-center gap-6', className)}>
      <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 max-w-full px-2">
        <button
          type="button"
          disabled={currentPage <= 1}
          onClick={() => onPageChange?.(Math.max(1, currentPage - 1))}
          className="w-9 h-9 min-w-[36px] min-h-[36px] shrink-0 rounded-full flex items-center justify-center bg-white border border-[#e8edf2] text-navy hover:bg-[#E8500A] hover:text-white hover:border-[#E8500A] transition-all disabled:opacity-40 disabled:pointer-events-none group"
          aria-label="Previous page"
        >
          <ArrowRight size={15} className="rotate-180 group-hover:-translate-x-0.5 transition-transform" />
        </button>

        {pages.map((page, i) =>
          page === '...' ? (
            <span key={`ellipsis-${i}`} className="w-9 h-9 flex items-center justify-center text-[11px] font-bold text-gray-300">
              …
            </span>
          ) : (
            <button
              key={page}
              type="button"
              onClick={() => onPageChange?.(page)}
              className={cn(
                'w-9 h-9 min-w-[36px] min-h-[36px] shrink-0 rounded-full flex items-center justify-center text-[11px] font-black transition-all',
                page === currentPage
                  ? 'bg-[#E8500A] text-white border border-[#E8500A]'
                  : 'bg-white border border-[#e8edf2] text-navy hover:border-[#E8500A] hover:text-[#E8500A]',
              )}
              aria-label={`Page ${page}`}
              aria-current={page === currentPage ? 'page' : undefined}
            >
              {page}
            </button>
          ),
        )}

        <button
          type="button"
          disabled={currentPage >= totalPages}
          onClick={() => onPageChange?.(Math.min(totalPages, currentPage + 1))}
          className="w-9 h-9 min-w-[36px] min-h-[36px] shrink-0 rounded-full flex items-center justify-center bg-white border border-[#e8edf2] text-navy hover:bg-[#E8500A] hover:text-white hover:border-[#E8500A] transition-all disabled:opacity-40 disabled:pointer-events-none group"
          aria-label="Next page"
        >
          <ArrowRight size={15} className="group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>

      {(showing > 0 || total > 0) && (
        <p className="text-[10px] font-black text-gray-300 uppercase tracking-[0.2em]">
          Showing <span className="text-navy">{showing}</span> of <span className="text-navy">{total}</span> results
        </p>
      )}
    </div>
  );
}
