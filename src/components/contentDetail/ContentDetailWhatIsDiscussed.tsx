import React from 'react';
import { cn } from '../../lib/utils';
import type { ContentDetailSectionContext } from './contentDetailSectionContext';

/** Fixed section: What Is Discussed? — product jump list for the content body. */
export function ContentDetailWhatIsDiscussed({
  products,
  activeIndex = 0,
  onSelect,
}: {
  products: ContentDetailSectionContext['products'];
  activeIndex?: number;
  onSelect?: (index: number) => void;
}) {
  if (!products.length) return null;

  return (
    <div id="what-is-discussed" className="scroll-mt-36">
      <div className="bg-white rounded-[10px] p-5 border border-[#E8EDF2]">
        <div className="text-[13px] font-extrabold text-[#1A1A2E] text-center mb-4">
          WHAT IS <span className="text-[#EB4501]">DISCUSSED?</span>
        </div>
        <div className="h-px bg-[#F1F1F3] mb-2.5" />
        <div className="flex flex-col max-h-[360px] overflow-y-auto no-scrollbar">
          {products.map((p: any, idx: number) => {
            const isActive = activeIndex === idx;
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => {
                  onSelect?.(idx);
                  const el = document.getElementById(`prod-sec-${idx}`);
                  if (el) {
                    const top =
                      el.getBoundingClientRect().top + window.pageYOffset - 200;
                    window.scrollTo({ top: Math.max(0, top), behavior: 'smooth' });
                  }
                }}
                className={cn(
                  'w-full flex items-center gap-2.5 px-1.5 py-2.5 border-b border-[#F4F7F9] text-left cursor-pointer bg-transparent',
                  isActive && 'bg-[#FFF3EA]',
                )}
              >
                <div
                  className={cn(
                    'w-[22px] h-[22px] rounded-full shrink-0 flex items-center justify-center text-[11px] font-extrabold',
                    idx === 0
                      ? 'bg-[#EB4501] text-white'
                      : 'bg-[#F4F7F9] text-[#9AA0AC]',
                  )}
                >
                  {idx === 0 ? '👑' : idx + 1}
                </div>
                <span className="flex-1 text-[11.5px] font-bold text-[#1A1A2E] truncate">
                  {p.brand} {p.title || p.name}
                </span>
                <div className="w-10 h-[30px] rounded overflow-hidden shrink-0 bg-[#F4F7F9]">
                  <img src={p.image} className="w-full h-full object-contain" alt="" />
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
