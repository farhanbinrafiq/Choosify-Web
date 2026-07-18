import React from 'react';
import { MarketingContentListShell } from '../../components/marketing/MarketingContentListShell';

export function MarketingCollectionsPage() {
  return (
    <MarketingContentListShell
      title="Collections"
      description="Curated product and content collections"
      contentTypes="collection"
      createPath="/marketing/content/new?type=collection"
    />
  );
}
