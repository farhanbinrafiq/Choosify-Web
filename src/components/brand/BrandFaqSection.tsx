import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '../../lib/utils';
import type { CatalogBrandFaq } from '../../types/catalog';

/**
 * Real seller-entered FAQs only (brand.faq via Brand Studio) — no template
 * "Are {brand} products genuine?" filler when the seller hasn't written any.
 * Caller (BrandDetailPage) skips rendering this section entirely when `faq`
 * is empty.
 */
export function BrandFaqSection({
  brandName: _brandName,
  faq,
}: {
  brandName: string;
  faq?: CatalogBrandFaq[];
}) {
  const faqs = faq ?? [];
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  if (faqs.length === 0) return null;

  return (
    <div id="faq-section" className="scroll-mt-36 w-full">
      <h3 className="text-[15px] font-extrabold text-[#1A1A2E] mb-3.5">
        FREQUENTLY ASKED QUESTIONS
      </h3>
      <div className="bg-white border border-[#E8EDF2] rounded-[10px] px-[22px] py-1.5">
        {faqs.map((fq, i) => {
          const open = openIndex === i;
          return (
            <div
              key={fq.q}
              className={cn(
                'border-b border-[#F1F1F3] last:border-0',
              )}
            >
              <button
                type="button"
                onClick={() => setOpenIndex(open ? null : i)}
                className="w-full flex justify-between items-center gap-3 py-3.5 bg-transparent border-0 cursor-pointer text-left px-0"
              >
                <span className="text-[12.5px] font-semibold text-[#1A1A2E]">
                  {fq.q}
                </span>
                <ChevronDown
                  size={14}
                  className={cn(
                    'text-[#9AA0AC] shrink-0 transition-transform',
                    open && 'rotate-180',
                  )}
                />
              </button>
              {open && (
                <p className="text-[12px] text-[#4B5563] leading-relaxed pb-3.5 m-0 pr-6">
                  {fq.a}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
