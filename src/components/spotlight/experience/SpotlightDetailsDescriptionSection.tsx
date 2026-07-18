import React from 'react';
import { cn } from '../../../lib/utils';

/** Article / campaign / event body — LE-006.2 */
export function SpotlightDetailsDescriptionSection({
  title = 'Overview',
  subtitle,
  description,
  className,
}: {
  title?: string;
  subtitle?: string;
  description: string;
  className?: string;
}) {
  return (
    <section className={cn('scroll-mt-36', className)} aria-labelledby="spotlight-description-heading">
      <div className="mb-4 text-left">
        <h2 id="spotlight-description-heading" className="text-2xl font-extrabold text-[#1A1A2E] tracking-tight mb-0.5">
          {title}
        </h2>
        {subtitle && (
          <p className="text-[13px] font-medium text-[#9AA0AC]">{subtitle}</p>
        )}
      </div>
      <div className="bg-white rounded-[5px] border border-[#e8edf2] p-5 md:p-6 shadow-sm text-left">
        <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">{description}</p>
      </div>
    </section>
  );
}
