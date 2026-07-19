import React from 'react';
import type { IntelligenceGlobalFilters, IntelligenceTimeRange } from '../../../types/spotlight/intelligence';
import type { SpotlightCampaignRecord } from '../../../types/spotlight/cms';
import { PUBLISHER_CONTENT_TYPE_REGISTRY } from '../../../lib/spotlight/studio/publisherContentTypeRegistry';

const TIME_RANGES: { value: IntelligenceTimeRange; label: string }[] = [
  { value: 'today', label: 'Today' },
  { value: '7d', label: '7 Days' },
  { value: '30d', label: '30 Days' },
  { value: '90d', label: '90 Days' },
  { value: '12m', label: '12 Months' },
  { value: 'custom', label: 'Custom' },
];

interface SpotlightFilterBarProps {
  filters: IntelligenceGlobalFilters;
  campaigns: SpotlightCampaignRecord[];
  creators?: { id: string; name: string }[];
  collections?: { id: string; name: string }[];
  series?: { id: string; title: string }[];
  onChange: (patch: Partial<IntelligenceGlobalFilters>) => void;
  onReset: () => void;
}

/** Global intelligence filters — Phase 5.4 enhanced filter bar */
export function SpotlightFilterBar({
  filters,
  campaigns,
  creators = [],
  collections = [],
  series = [],
  onChange,
  onReset,
}: SpotlightFilterBarProps) {
  const brands = [...new Set(campaigns.map((c) => c.brandName).filter(Boolean))];

  return (
    <div className="bg-white border border-[#e8edf2] rounded-lg p-3 flex flex-wrap gap-3 items-center" role="search" aria-label="Intelligence filters">
      <div className="flex flex-wrap gap-1">
        {TIME_RANGES.map((r) => (
          <button
            key={r.value}
            type="button"
            onClick={() => onChange({ timeRange: r.value })}
            className={`px-2.5 py-1 text-[10px] font-bold uppercase rounded ${
              filters.timeRange === r.value ? 'bg-navy text-white' : 'bg-[#F8FBFD] text-gray-500 hover:text-navy'
            }`}
          >
            {r.label}
          </button>
        ))}
      </div>

      <select
        value={filters.contentType ?? ''}
        onChange={(e) => onChange({ contentType: e.target.value || undefined })}
        className="text-xs border border-[#e8edf2] rounded px-2 py-1.5 min-w-[120px]"
        aria-label="Filter by content type"
      >
        <option value="">All Content Types</option>
        {PUBLISHER_CONTENT_TYPE_REGISTRY.map((t) => (
          <option key={t.id} value={t.contentType}>{t.label}</option>
        ))}
      </select>

      <select
        value={filters.campaignId ?? ''}
        onChange={(e) => onChange({ campaignId: e.target.value || undefined })}
        className="text-xs border border-[#e8edf2] rounded px-2 py-1.5 min-w-[140px]"
        aria-label="Filter by campaign"
      >
        <option value="">All Campaigns</option>
        {campaigns.map((c) => (
          <option key={c.campaignId} value={c.campaignId}>{c.campaignName}</option>
        ))}
      </select>

      <select
        value={filters.brandId ?? ''}
        onChange={(e) => onChange({ brandId: e.target.value || undefined })}
        className="text-xs border border-[#e8edf2] rounded px-2 py-1.5 min-w-[120px]"
        aria-label="Filter by brand"
      >
        <option value="">All Brands</option>
        {brands.map((b) => (
          <option key={b} value={b}>{b}</option>
        ))}
      </select>

      {creators.length > 0 && (
        <select
          value={filters.creatorId ?? ''}
          onChange={(e) => onChange({ creatorId: e.target.value || undefined })}
          className="text-xs border border-[#e8edf2] rounded px-2 py-1.5 min-w-[120px]"
          aria-label="Filter by creator"
        >
          <option value="">All Creators</option>
          {creators.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
      )}

      {collections.length > 0 && (
        <select
          value={filters.collectionId ?? ''}
          onChange={(e) => onChange({ collectionId: e.target.value || undefined })}
          className="text-xs border border-[#e8edf2] rounded px-2 py-1.5 min-w-[120px]"
          aria-label="Filter by collection"
        >
          <option value="">All Collections</option>
          {collections.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
      )}

      {series.length > 0 && (
        <select
          value={filters.seriesId ?? ''}
          onChange={(e) => onChange({ seriesId: e.target.value || undefined })}
          className="text-xs border border-[#e8edf2] rounded px-2 py-1.5 min-w-[120px]"
          aria-label="Filter by series"
        >
          <option value="">All Series</option>
          {series.map((s) => (
            <option key={s.id} value={s.id}>{s.title}</option>
          ))}
        </select>
      )}

      <select
        value={filters.status ?? 'all'}
        onChange={(e) => onChange({ status: e.target.value })}
        className="text-xs border border-[#e8edf2] rounded px-2 py-1.5"
        aria-label="Filter by status"
      >
        <option value="all">All Status</option>
        <option value="published">Published</option>
        <option value="draft">Draft</option>
        <option value="scheduled">Scheduled</option>
        <option value="live">Live</option>
        <option value="archived">Archived</option>
      </select>

      <button
        type="button"
        onClick={onReset}
        className="text-[10px] font-bold uppercase text-gray-400 hover:text-[#CF4400] ml-auto"
      >
        Reset Filters
      </button>
    </div>
  );
}

/** @deprecated use SpotlightFilterBar — kept for backward compatibility */
export const SpotlightIntelligenceFilters = SpotlightFilterBar;
