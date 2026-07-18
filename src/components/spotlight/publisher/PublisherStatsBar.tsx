import React from 'react';
import type { SpotlightPublisherProfile } from '../../../types/spotlight/publisher/profile';

interface PublisherStatsBarProps {
  profile: SpotlightPublisherProfile;
}

export function PublisherStatsBar({ profile }: PublisherStatsBarProps) {
  const items = [
    { label: 'Trust', value: profile.trustScore },
    { label: 'Reputation', value: profile.reputation },
    { label: 'Campaigns', value: profile.stats.campaignCount },
    { label: 'Live', value: profile.stats.liveCount },
    { label: 'Reviews', value: profile.stats.reviewCount },
    { label: 'Content', value: profile.stats.contentCount },
  ];

  return (
    <div className="grid grid-cols-3 sm:grid-cols-6 gap-3 mb-8">
      {items.map((item) => (
        <div key={item.label} className="text-center p-3 rounded-[5px] border border-[#e8edf2] bg-white">
          <p className="text-lg font-black text-[#1a1a2e]">{item.value}</p>
          <p className="text-[9px] font-bold uppercase tracking-wider text-gray-400">{item.label}</p>
        </div>
      ))}
    </div>
  );
}
