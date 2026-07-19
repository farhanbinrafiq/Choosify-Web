import React from 'react';
import { Sparkles } from 'lucide-react';
import type { EmiPageContext } from '../../types/emi';
import { actionsForAssistant } from '../../lib/emi/actionRegistry';
import { useEmiActions } from '../../hooks/useEmiActions';
import { EmiActionButton, EmiActionSuggestion } from './EmiActionButton';

interface EmiPublisherPanelProps {
  context: EmiPageContext;
}

export function EmiPublisherPanel({ context }: EmiPublisherPanelProps) {
  const actions = actionsForAssistant('publisher');
  const { results, activeId, loading, runAction, clearAction } = useEmiActions(context);

  return (
    <div className="p-6 space-y-4 max-w-xl">
      <h2 className="text-sm font-black text-navy uppercase flex items-center gap-2">
        <Sparkles size={16} className="text-[#EB4501]" aria-hidden /> Emi Publisher Assistant
      </h2>
      <p className="text-xs text-gray-500">
        Suggest improvements — review and apply manually. No automatic generation in Phase 5.6.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {actions.map((action) => (
          <div key={action.id}>
            <EmiActionButton
              actionId={action.id}
              onRun={runAction}
              loading={loading && activeId === action.id}
              active={Boolean(results[action.id])}
              className="w-full"
            />
            {results[action.id] && (
              <EmiActionSuggestion
                suggestion={results[action.id].suggestion}
                why={results[action.id].why}
                applyHint={results[action.id].applyHint}
                onDismiss={() => clearAction(action.id)}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
