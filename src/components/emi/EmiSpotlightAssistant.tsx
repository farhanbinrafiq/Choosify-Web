import React, { useMemo } from 'react';
import type { SpotlightContent } from '../../types/spotlight/experience/content';
import { useEmiAssistant } from '../../hooks/useEmiAssistant';
import { EmiContextPanel } from './EmiContextPanel';
import { EmiSummaryCard } from './EmiAssistantCard';
import { emiShoppingMemory } from '../../lib/emi/emiMemory';
import { openEmiPanel } from '../../lib/emi';
import { EmiAiLogo } from '../EmiAiLogo';

interface EmiSpotlightAssistantProps {
  content: SpotlightContent;
}

export function EmiSpotlightAssistant({ content }: EmiSpotlightAssistantProps) {
  const contextPartial = useMemo(
    () => ({
      pageId: 'spotlight_content' as const,
      contentId: content.contentId,
      entityLabel: content.headline,
      productIds: content.commerce.featuredProductIds.length
        ? content.commerce.featuredProductIds
        : content.connections.productIds,
      metadata: {
        headline: content.headline,
        description: content.description,
      },
    }),
    [content],
  );

  const { recommendations } = useEmiAssistant(contextPartial);

  React.useEffect(() => {
    emiShoppingMemory.recordContentView(content.contentId);
  }, [content.contentId]);

  const summary = recommendations.find((r) => r.kind === 'summary');

  return (
    <div className="space-y-4">
      {summary && <EmiSummaryCard headline={content.headline} summary={summary.body} />}
      <EmiContextPanel
        title="Spotlight Assistant"
        subtitle="Products, advice, and key takeaways"
        recommendations={recommendations}
        compact
      />
      <button
        type="button"
        onClick={() => openEmiPanel(`Summarize this Spotlight: ${content.headline}`)}
        className="text-[10px] font-bold uppercase text-[#EB4501] hover:underline inline-flex items-center gap-1.5"
      >
        <EmiAiLogo size={14} className="w-3.5 h-3.5" />
        Ask Emi →
      </button>
    </div>
  );
}
