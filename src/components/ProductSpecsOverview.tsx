import React from 'react';
import { cn } from '../lib/utils';
import { resolveOverviewListIcon } from './OverviewListIcon';

export interface ProductSpecItem {
  label: string;
  value: string;
}

interface ProductSpecsOverviewProps {
  specs: ProductSpecItem[];
  productTitle?: string;
  title?: string;
  subtitle?: string;
}

export function ProductSpecsOverview({
  specs,
  productTitle,
  title = 'Product Specifications',
  subtitle,
}: ProductSpecsOverviewProps) {
  return (
    <section
      id="product-specs-section"
      className="bg-white rounded-[5px] p-4 sm:p-6 md:p-8 border border-gray-100 shadow-sm scroll-mt-36 w-full text-left overflow-hidden"
    >
      <div className="text-center mb-6 sm:mb-8 border-b border-gray-100 pb-5">
        <h3 className="text-xl sm:text-2xl font-black text-[#1A1D4E] tracking-tight uppercase mb-1">
          {title}
        </h3>
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest italic font-mono bg-gray-50 border border-gray-100 rounded-full px-3 sm:px-4 py-1.5 w-fit max-w-full mx-auto break-words">
          {subtitle ??
            (productTitle ? `Technical details for ${productTitle}` : 'Technical product details')}
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-4">
        {specs.map((spec, i) => {
          const Icon = resolveOverviewListIcon(`${spec.label} ${spec.value}`);
          return (
            <div
              key={`${spec.label}-${i}`}
              className={cn(
                'min-w-0 overflow-hidden bg-gray-50 rounded-[5px] p-3 sm:p-4 border border-gray-100 flex flex-col gap-2 hover:shadow-md transition-shadow',
                i % 2 !== 0 && 'bg-white',
              )}
            >
              <div className="flex items-start gap-2 min-w-0">
                <div className="w-7 h-7 rounded-lg bg-[#FF5B00]/10 text-[#FF5B00] flex items-center justify-center shrink-0">
                  <Icon size={14} aria-hidden />
                </div>
                <span className="min-w-0 flex-1 text-[9px] font-black text-gray-400 uppercase tracking-wider break-words leading-snug">
                  {spec.label}
                </span>
              </div>
              <span className="min-w-0 text-xs font-black text-[#1A1D4E] uppercase tracking-wide leading-snug break-words [overflow-wrap:anywhere]">
                {spec.value}
              </span>
            </div>
          );
        })}
      </div>
    </section>
  );
}
