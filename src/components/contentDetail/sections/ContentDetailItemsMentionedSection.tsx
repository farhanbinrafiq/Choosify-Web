import React from 'react';
import { ProductCard } from '../../ProductCard';
import { PRODUCT_CARD_GRID } from '../../../lib/pageLayout';
import {
  resolveItemsMentionedTitle,
} from '../../../lib/spotlight/content/categorySectionLabels';
import type { ContentDetailSectionConfig } from '../../../types/spotlight/experience/contentDetailSections';
import type { ContentDetailSectionContext } from '../contentDetailSectionContext';

/**
 * Items Mentioned — category-labeled; Top 3 framing when ≥3 top picks;
 * live always uses plain unranked titles.
 */
export function ContentDetailItemsMentionedSection({
  section,
  ctx,
}: {
  section: ContentDetailSectionConfig;
  ctx: ContentDetailSectionContext;
}) {
  const topPickIds = section.data?.topPickIds ?? [];
  const itemIds = section.data?.itemIds;

  let products = ctx.products;
  if (itemIds?.length) {
    products = itemIds
      .map((id) => ctx.products.find((p) => String(p.id) === String(id)))
      .filter(Boolean) as typeof ctx.products;
  }

  if (!products.length) return null;

  const topPickCount =
    topPickIds.length ||
    products.filter((p: any) =>
      Boolean(
        p?.isTopPick ||
          p?.featuredFlag ||
          /top.?pick|champion|best/i.test(String(p?.badge || '')),
      ),
    ).length;

  const { title, ranked } = resolveItemsMentionedTitle({
    category: ctx.category ?? ctx.content?.category,
    contentType: ctx.content?.contentType,
    topPickCount,
  });

  // Ranked Top 3: show top picks first (max 3). Unranked: flexible 1–10+.
  const display = ranked
    ? (topPickIds.length
        ? topPickIds
            .map((id) => products.find((p) => String(p.id) === String(id)))
            .filter(Boolean)
        : products
      ).slice(0, 3)
    : products;

  return (
    <div id="items-mentioned" className="scroll-mt-36">
      <div className="mb-3.5 text-left">
        <h2 className="text-[13px] font-extrabold text-[#1A1A2E] tracking-wide uppercase">
          {title}
        </h2>
        {!ranked && (
          <p className="text-[11.5px] text-[#9AA0AC] m-0 mt-1">
            Products and picks featured in this content
          </p>
        )}
      </div>
      <div className={PRODUCT_CARD_GRID}>
        {display.map((product: any, idx: number) => (
          <div
            key={product.id}
            id={`prod-sec-${idx}`}
            className="scroll-mt-36"
          >
            <ProductCard product={product} variant="grid" isGuideDetail={true} />
          </div>
        ))}
      </div>
      {ctx.hasMoreProducts && ctx.onLoadMoreProducts && !ranked && (
        <div className="text-center mt-8 font-bold">
          <button
            type="button"
            onClick={ctx.onLoadMoreProducts}
            className="px-8 py-3.5 border border-[#1A1A2E] hover:bg-[#1A1A2E] hover:text-white text-[#1A1A2E] font-bold text-[12px] rounded-full transition-all cursor-pointer bg-white"
          >
            Load More Products
          </button>
        </div>
      )}
    </div>
  );
}
