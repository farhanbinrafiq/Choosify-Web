import React from 'react';
import { Link } from 'react-router-dom';
import { BadgeCheck } from 'lucide-react';
import type { SpotlightCampaignContribution } from '../../../types/spotlight/collaboration/campaign';
import { CONTRIBUTION_TYPE_LABELS } from '../../../types/spotlight/collaboration/campaign';
import { COLLABORATION_ROLE_LABELS } from '../../../types/spotlight/collaboration/engine';

interface PublisherContributionCardProps {
  contribution: SpotlightCampaignContribution;
}

export function PublisherContributionCard({ contribution }: PublisherContributionCardProps) {
  return (
    <div className="flex items-start gap-3 p-4 border border-[#e8edf2] rounded-[5px] bg-white text-left">
      {contribution.publisherLogoUrl ? (
        <img src={contribution.publisherLogoUrl} alt="" className="w-10 h-10 rounded-full object-cover shrink-0" />
      ) : (
        <span className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-xs font-bold shrink-0">
          {contribution.publisherName.slice(0, 1)}
        </span>
      )}
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-1.5 flex-wrap">
          <Link
            to={`/publisher/${contribution.publisherId.replace(/^(brand|creator|seller)-/, '')}`}
            className="text-sm font-bold text-[#1a1a2e] hover:text-[#CF4400]"
          >
            {contribution.publisherName}
          </Link>
          {contribution.isVerified && <BadgeCheck size={12} className="text-[#EB4501]" />}
        </div>
        <p className="text-[10px] text-gray-400 uppercase tracking-wide mt-0.5">
          {COLLABORATION_ROLE_LABELS[contribution.role]} · {CONTRIBUTION_TYPE_LABELS[contribution.contributionType]}
        </p>
        {contribution.headline && (
          <p className="text-xs text-gray-600 mt-1 line-clamp-2">{contribution.headline}</p>
        )}
      </div>
    </div>
  );
}
