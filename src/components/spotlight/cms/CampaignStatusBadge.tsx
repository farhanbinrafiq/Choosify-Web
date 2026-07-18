import React from 'react';
import { cn } from '../../../lib/utils';
import type { SpotlightCampaignStatus } from '../../../types/spotlight/lifecycle';

const STATUS_STYLES: Record<SpotlightCampaignStatus, string> = {
  draft: 'bg-gray-100 text-gray-700',
  pending_review: 'bg-amber-100 text-amber-800',
  approved: 'bg-blue-100 text-blue-800',
  scheduled: 'bg-indigo-100 text-indigo-800',
  published: 'bg-green-100 text-green-800',
  paused: 'bg-orange-100 text-orange-800',
  expired: 'bg-gray-200 text-gray-600',
  archived: 'bg-slate-200 text-slate-600',
  rejected: 'bg-red-100 text-red-800',
};

const STATUS_LABELS: Record<SpotlightCampaignStatus, string> = {
  draft: 'Draft',
  pending_review: 'Pending Review',
  approved: 'Approved',
  scheduled: 'Scheduled',
  published: 'Published',
  paused: 'Paused',
  expired: 'Expired',
  archived: 'Archived',
  rejected: 'Rejected',
};

export function CampaignStatusBadge({ status }: { status: SpotlightCampaignStatus }) {
  return (
    <span
      className={cn(
        'inline-flex px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide',
        STATUS_STYLES[status],
      )}
    >
      {STATUS_LABELS[status]}
    </span>
  );
}
