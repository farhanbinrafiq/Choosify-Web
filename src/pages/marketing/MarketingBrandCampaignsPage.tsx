import React from 'react';
import { MarketingContentListShell } from '../../components/marketing/MarketingContentListShell';

export function MarketingBrandCampaignsPage() {
  return (
    <MarketingContentListShell
      title="Brand Campaigns"
      description="Brand stories, campaigns, and launches"
      contentTypes={['brand_campaign', 'brand_story', 'product_launch']}
      createPath="/marketing/content/new?type=brand_campaign"
    />
  );
}
