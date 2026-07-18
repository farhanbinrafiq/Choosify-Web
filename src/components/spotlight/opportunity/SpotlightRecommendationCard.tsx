import React from 'react';
import { Sparkles } from 'lucide-react';
import type { SpotlightOpportunityInstance } from '../../../types/spotlight/opportunity';
import { actionsForAssistant } from '../../../lib/emi/actionRegistry';
import { EmiActionButton } from '../../emi/EmiActionButton';
import { buildPageContext } from '../../../lib/emi/emiContextEngine';
import { useEmiActions } from '../../../hooks/useEmiActions';

interface SpotlightRecommendationCardProps {
  opportunity?: SpotlightOpportunityInstance;
  estimatedTotalImpact?: number;
  missingCount?: number;
}

export function SpotlightRecommendationCard({ opportunity, estimatedTotalImpact, missingCount }: SpotlightRecommendationCardProps) {
  const publisherContext = buildPageContext('/marketing/opportunity', { pageId: 'opportunity_center' });
  const { runAction, loading, activeId } = useEmiActions(publisherContext);
  const quickActions = actionsForAssistant('publisher').slice(0, 4);

  if (opportunity) {
    return (
      <div className="bg-[#050514] text-white rounded-xl p-5 space-y-3">
        <p className="text-[10px] font-bold uppercase text-[#E8500A]">Recommended next step</p>
        <h3 className="text-lg font-black">{opportunity.title}</h3>
        <p className="text-sm text-gray-300 leading-relaxed">{opportunity.coachingMessage}</p>
        <p className="text-xs font-bold text-emerald-400">Estimated improvement: +{opportunity.estimatedImpactPercent}% engagement</p>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-[#050514] to-navy text-white rounded-xl p-5 space-y-4">
      <p className="text-[10px] font-bold uppercase text-[#E8500A] tracking-widest">Publisher Success Coach</p>
      <h3 className="text-xl font-extrabold tracking-tight">What should you improve next?</h3>
      {missingCount != null && missingCount > 0 ? (
        <>
          <p className="text-sm text-gray-300">Your Spotlight content has <strong className="text-white">{missingCount} opportunities</strong> to improve quality, discovery, and commerce.</p>
          {estimatedTotalImpact != null && estimatedTotalImpact > 0 && (
            <p className="text-sm font-bold text-emerald-400">Estimated improvement if addressed: +{estimatedTotalImpact}% engagement</p>
          )}
        </>
      ) : (
        <p className="text-sm text-gray-300">Your Spotlight experiences are well optimized. Keep publishing!</p>
      )}
      <div className="flex flex-wrap gap-2 pt-2 border-t border-white/10">
        {quickActions.map((action) => (
          <EmiActionButton
            key={action.id}
            actionId={action.id}
            onRun={runAction}
            loading={loading && activeId === action.id}
            compact
            className="bg-white/10 border-white/20 text-white hover:text-[#E8500A]"
          />
        ))}
      </div>
    </div>
  );
}
