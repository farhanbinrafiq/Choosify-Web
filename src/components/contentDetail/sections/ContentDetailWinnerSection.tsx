import type { ContentDetailSectionConfig } from '../../../types/spotlight/experience/contentDetailSections';
import type { ContentDetailSectionContext } from '../contentDetailSectionContext';
import { GuideOverallWinnerCard } from '../../guide/GuideOverallWinnerCard';
import { PLACEHOLDER_IMAGE } from '../../../constants';
import React from 'react';

/** Winner / Top Pick(s) — supports 1–N winners via section.data.winnerIds */
export function ContentDetailWinnerSection({
  section,
  ctx,
}: {
  section: ContentDetailSectionConfig;
  ctx: ContentDetailSectionContext;
}) {
  const winnerIds = section.data?.winnerIds;
  const winners =
    winnerIds?.length
      ? winnerIds
          .map((id) => ctx.products.find((p) => String(p.id) === String(id)))
          .filter(Boolean)
      : ctx.products.slice(0, Math.max(1, Math.min(3, ctx.products.length)));

  if (!winners.length) return null;

  return (
    <div id="winner" className="scroll-mt-36 space-y-4">
      {winners.map((winner: any, index: number) => {
        const ratingNum = Number(winner?.rating ?? winner?.ratings ?? 4.8);
        const scoreNum = Math.min(
          10,
          Math.round((Number.isFinite(ratingNum) ? ratingNum : 4.8) * 2 * 10) / 10,
        );
        const checksFromProduct = Array.isArray(winner?.highlights)
          ? winner.highlights
          : Array.isArray(winner?.tags)
            ? winner.tags
            : Array.isArray(winner?.pros)
              ? winner.pros
              : null;
        const reviewsRaw =
          winner?.reviewsCount ?? winner?.reviews ?? winner?.reviewCount ?? '13.4K';
        const reviewsLabel =
          typeof reviewsRaw === 'number'
            ? reviewsRaw >= 1000
              ? `${(reviewsRaw / 1000).toFixed(1).replace(/\.0$/, '')}K`
              : String(reviewsRaw)
            : String(reviewsRaw);

        return (
          <GuideOverallWinnerCard
            key={winner?.id ?? index}
            name={
              winner?.title
                ? `${winner.brand ? `${winner.brand} ` : ''}${winner.title}`.trim()
                : winner?.name || 'Overall winner'
            }
            image={winner?.image || PLACEHOLDER_IMAGE}
            badge={String(
              winner?.badge ||
                winner?.category ||
                ctx.category ||
                (winners.length > 1 ? `TOP PICK ${index + 1}` : 'BEST PICK'),
            ).toUpperCase()}
            rating={Number.isFinite(ratingNum) ? ratingNum.toFixed(1) : '4.8'}
            reviews={reviewsLabel}
            score={scoreNum.toFixed(1)}
            scoreLabel={scoreNum >= 9 ? 'EXCELLENT' : scoreNum >= 8 ? 'GREAT' : 'GOOD'}
            checks={
              checksFromProduct?.map(String).filter(Boolean).slice(0, 4) || [
                'Best Display Quality',
                'Top Tier Performance',
                'Excellent Camera System',
                'Long-term Software Support',
              ]
            }
            shopHref={`/products/${winner?.id ?? ''}`}
          />
        );
      })}
    </div>
  );
}
