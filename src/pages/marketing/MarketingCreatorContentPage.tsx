import React from 'react';
import { MarketingContentListShell } from '../../components/marketing/MarketingContentListShell';

export function MarketingCreatorContentPage() {
  return (
    <MarketingContentListShell
      title="Creator Content"
      description="Creator reviews, picks, and recommendations"
      contentTypes={['product_review', 'editorial', 'blog']}
      createPath="/marketing/content/new?type=product_review"
    />
  );
}
