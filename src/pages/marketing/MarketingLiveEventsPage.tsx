import React from 'react';
import { MarketingContentListShell } from '../../components/marketing/MarketingContentListShell';

export function MarketingLiveEventsPage() {
  return (
    <MarketingContentListShell
      title="Live Events"
      description="Live shopping and event content"
      contentTypes="live_event"
      createPath="/marketing/content/new?type=live_event"
    />
  );
}
