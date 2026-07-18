import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import type { SpotlightContent } from '../../../types/spotlight/experience/content';
import type { CatalogProduct } from '../../../types/catalog';
import {
  UniversalCommerceCard,
  resolveCommerceCardVariant,
  spotlightToContentCardModel,
} from '../../content';
import { primaryProductForContent } from '../../../utils/spotlightMixedFeed';
import { cn } from '../../../lib/utils';

/** Related Spotlight content — Choosify.dc.html “You May Also Like” rail */
export function SpotlightDetailsRelatedRail({
  items,
  products,
  title = 'You May Also Like',
  subtitle,
  viewAllHref = '/spotlight',
  viewAllLabel = 'View All ›',
  className,
}: {
  items: SpotlightContent[];
  products: CatalogProduct[];
  title?: string;
  subtitle?: string;
  viewAllHref?: string;
  viewAllLabel?: string;
  className?: string;
}) {
  const visible = useMemo(() => items.slice(0, 4), [items]);

  if (!visible.length) return null;

  return (
    <section
      className={cn('pt-8 border-t border-[#F1F1F3]', className)}
      aria-labelledby="spotlight-related-heading"
    >
      <div className="flex items-baseline justify-between gap-3 mb-3.5">
        <div>
          <h3
            id="spotlight-related-heading"
            className="text-[13px] font-extrabold text-[#1A1A2E] tracking-wide uppercase"
          >
            {title}
          </h3>
          {subtitle && <p className="text-[12px] text-[#9AA0AC] mt-1">{subtitle}</p>}
        </div>
        <Link
          to={viewAllHref}
          className="text-[12px] font-bold text-[#1A1A2E] hover:text-[#FF5B00] shrink-0"
        >
          {viewAllLabel}
        </Link>
      </div>

      <div className="choosify-spotlight-related-grid">
        {visible.map((content) => {
          const product = primaryProductForContent(content, products);
          const model = spotlightToContentCardModel(content, product);
          return (
            <UniversalCommerceCard
              key={content.contentId}
              mode="commerce"
              variant={resolveCommerceCardVariant(model.layoutVariant, model.aspectRatio)}
              model={model}
            />
          );
        })}
      </div>
    </section>
  );
}
