import React from 'react';
import type { SpotlightCampaignBadgeType } from '../../../types/spotlight/homepage';
import { SPOTLIGHT_CAMPAIGN_TYPE_META } from '../../../types/spotlight/campaignTypes';
import type { SpotlightCampaignType } from '../../../types/spotlight/campaignTypes';
import { cn } from '../../../lib/utils';

const BADGE_LABELS: Record<SpotlightCampaignBadgeType, string> = {
  new_launch: 'New Launch',
  promotion: 'Promotion',
  sale: 'Sale',
  limited_time: 'Limited Time',
  sponsored: 'Sponsored',
  editors_pick: "Editor's Pick",
  trending: 'Trending',
  featured: 'Featured',
  brand_story: 'Brand Story',
};

interface SpotlightCampaignBadgesProps {
  badges: SpotlightCampaignBadgeType[];
  campaignType: SpotlightCampaignType;
  className?: string;
}

export function SpotlightCampaignBadges({ badges, campaignType, className }: SpotlightCampaignBadgesProps) {
  const primary = badges[0];
  const typeLabel = SPOTLIGHT_CAMPAIGN_TYPE_META[campaignType]?.label;

  return (
    <div className={cn('flex flex-wrap gap-1.5', className)}>
      {primary && (
        <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-[#EB4501] text-white">
          {BADGE_LABELS[primary]}
        </span>
      )}
      <span className="px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider bg-white/90 text-[#1a1a2e] border border-[#e8edf2]">
        {typeLabel}
      </span>
      {badges.includes('sponsored') && primary !== 'sponsored' && (
        <span className="px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider bg-amber-50 text-amber-700 border border-amber-200">
          Sponsored
        </span>
      )}
    </div>
  );
}
