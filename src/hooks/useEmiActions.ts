import { useCallback, useState } from 'react';
import type { EmiActionId, EmiActionResult, EmiPageContext } from '../types/emi';
import { buildEmiActionSuggestion } from '../lib/emi/emiRecommendationEngine';
import { actionDefinition } from '../lib/emi/actionRegistry';

export function useEmiActions(context: EmiPageContext) {
  const [results, setResults] = useState<Record<string, EmiActionResult>>({});
  const [activeId, setActiveId] = useState<EmiActionId | null>(null);
  const [loading, setLoading] = useState(false);

  const runAction = useCallback(
    async (actionId: EmiActionId) => {
      const def = actionDefinition(actionId);
      if (!def) return;
      setActiveId(actionId);
      setLoading(true);
      // Architecture-only: client-side suggestion; future: POST /api/emi/action
      await new Promise((r) => setTimeout(r, 400));
      const result = buildEmiActionSuggestion(actionId, context);
      setResults((prev) => ({ ...prev, [actionId]: result }));
      setLoading(false);
    },
    [context],
  );

  const clearAction = useCallback((actionId: EmiActionId) => {
    setResults((prev) => {
      const next = { ...prev };
      delete next[actionId];
      return next;
    });
    if (activeId === actionId) setActiveId(null);
  }, [activeId]);

  return { results, activeId, loading, runAction, clearAction };
}
