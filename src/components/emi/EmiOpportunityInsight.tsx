import React, { useMemo } from 'react';
import type { SpotlightOpportunityInstance } from '../../types/spotlight/opportunity';
import { mapFutureAiCapability } from '../../lib/emi/actionRegistry';
import { useEmiActions } from '../../hooks/useEmiActions';
import { buildPageContext } from '../../lib/emi/emiContextEngine';
import { EmiActionButton, EmiActionSuggestion } from './EmiActionButton';
import { EmiConfidenceBadge } from './EmiConfidenceBadge';
import { Sparkles } from 'lucide-react';

interface EmiOpportunityInsightProps {
  opportunity: SpotlightOpportunityInstance;
}

export function EmiOpportunityInsight({ opportunity }: EmiOpportunityInsightProps) {
  const context = useMemo(
    () =>
      buildPageContext('/marketing/opportunity', {
        pageId: 'opportunity_center',
        entityId: opportunity.opportunityId,
        entityLabel: opportunity.title,
        metadata: {
          opportunityTitle: opportunity.title,
          coachingMessage: opportunity.coachingMessage,
          estimatedImpact: opportunity.estimatedImpactPercent,
        },
      }),
    [opportunity],
  );

  const actionId = mapFutureAiCapability(opportunity.futureAiCapability);
  const { results, loading, activeId, runAction, clearAction } = useEmiActions(context);

  return (
    <div className="mt-2 pt-2 border-t border-[#e8edf2] space-y-2">
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-[9px] font-black uppercase text-[#EB4501] flex items-center gap-1">
          <Sparkles size={10} aria-hidden /> Emi explains
        </span>
        <EmiConfidenceBadge level="high" score={Math.min(95, 60 + opportunity.estimatedImpactPercent)} />
        {opportunity.estimatedImpactPercent > 0 && (
          <span className="text-[9px] text-emerald-600 font-bold">+{opportunity.estimatedImpactPercent}% est.</span>
        )}
      </div>
      <p className="text-[10px] text-gray-500">{opportunity.coachingMessage}</p>
      {actionId && (
        <>
          <EmiActionButton actionId={actionId} onRun={runAction} loading={loading && activeId === actionId} compact />
          {results[actionId] && (
            <EmiActionSuggestion
              suggestion={results[actionId].suggestion}
              why={results[actionId].why}
              applyHint={results[actionId].applyHint}
              onDismiss={() => clearAction(actionId)}
            />
          )}
        </>
      )}
    </div>
  );
}
