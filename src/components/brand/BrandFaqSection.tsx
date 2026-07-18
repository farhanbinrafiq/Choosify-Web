import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '../../lib/utils';

export function buildBrandFaqs(brandName: string): { q: string; a: string }[] {
  return [
    {
      q: `Are ${brandName} products sold on Choosify 100% genuine?`,
      a: `Yes. All ${brandName} listings on Choosify are sourced from authorized sellers and verified partners with authenticity checks before publication.`,
    },
    {
      q: `What warranty do I get on ${brandName} purchases?`,
      a: `Most ${brandName} products include the official manufacturer warranty. Coverage length varies by category — check each product page for exact terms.`,
    },
    {
      q: `How do I claim service or repair support?`,
      a: `Visit an authorized service center listed under Where to Buy, or contact the seller via Choosify Messages with your order ID and serial number.`,
    },
    {
      q: `Does ${brandName} offer EMI or installment options?`,
      a: `EMI is available on eligible ${brandName} products through partner banks and card issuers. Look for the EMI badge on the product buy box.`,
    },
    {
      q: `Where is my nearest authorized ${brandName} store?`,
      a: `Use the Store Location section above for authorized stores, distributors, and service centers near you, including map links where available.`,
    },
  ];
}

export function BrandFaqSection({ brandName }: { brandName: string }) {
  const faqs = buildBrandFaqs(brandName);
  const [openIndex, setOpenIndex] = useState<number | null>(null);

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
