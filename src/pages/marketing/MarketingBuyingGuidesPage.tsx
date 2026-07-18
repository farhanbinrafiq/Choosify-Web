import React from 'react';
import { MarketingContentListShell } from '../../components/marketing/MarketingContentListShell';

export function MarketingBuyingGuidesPage() {
  return (
    <MarketingContentListShell
      title="Buying Guides"
      description="Comparison guides with winner, pros, and verdict sections"
      contentTypes="buying_guide"
      createPath="/marketing/content/new?type=buying_guide"
    />
  );
}
