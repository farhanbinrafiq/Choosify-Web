import React, { useMemo } from 'react';
import { useEmiAssistant } from '../../hooks/useEmiAssistant';
import { EmiContextPanel } from './EmiContextPanel';
import { emiShoppingMemory } from '../../lib/emi/emiMemory';

interface EmiSearchAssistantProps {
  query?: string;
}

export function EmiSearchAssistant({ query }: EmiSearchAssistantProps) {
  const contextPartial = useMemo(() => ({ pageId: 'search' as const, query }), [query]);
  const { recommendations } = useEmiAssistant(contextPartial);

  React.useEffect(() => {
    if (query?.trim()) emiShoppingMemory.recordQuery(query);
  }, [query]);

  return (
    <EmiContextPanel
      title="Search Assistant"
      subtitle="Categories, brands, and Spotlight suggestions"
      recommendations={recommendations}
      compact
    />
  );
}
