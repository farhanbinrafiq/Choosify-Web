import React from 'react';
import { CheckCircle2 } from 'lucide-react';
import { cn } from '../lib/utils';

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
      className="bg-white rounded-[5px] p-6 md:p-8 border border-gray-100 shadow-sm scroll-mt-36 w-full text-left"
    >
      <div className="text-center mb-8 border-b border-gray-100 pb-5">
        <h3 className="text-2xl font-black text-[#1A1D4E] tracking-tight uppercase mb-1">
          {title}
        </h3>
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest italic font-mono bg-gray-50 border border-gray-100 rounded-full px-4 py-1.5 w-fit mx-auto">
          {subtitle ??
            (productTitle ? `Technical details for ${productTitle}` : 'Technical product details')}
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {specs.map((spec, i) => (
          <div
            key={`${spec.label}-${i}`}
            className={cn(
              'bg-gray-50 rounded-[5px] p-4 border border-gray-100 flex flex-col gap-2 hover:shadow-md transition-shadow',
              i % 2 !== 0 && 'bg-white',
            )}
          >
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-[#EB4501]/10 text-[#EB4501] flex items-center justify-center shrink-0">
                <CheckCircle2 size={14} />
              </div>
              <span className="text-[9px] font-black text-gray-400 uppercase tracking-wider">
                {spec.label}
              </span>
            </div>
            <span className="text-xs font-black text-[#1A1D4E] uppercase tracking-wide leading-snug pl-9">
              {spec.value}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
