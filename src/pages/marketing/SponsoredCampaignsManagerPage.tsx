import React, { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Plus } from 'lucide-react';
import toast from 'react-hot-toast';
import {
  deleteSponsoredCampaign,
  listSponsoredCampaigns,
} from '../../services/marketingCmsStorage';
import { SPONSORED_PLACEMENT_OPTIONS } from '../../components/marketing/SponsoredPlacementPicker';
import type { SponsoredCampaignStatus } from '../../types/marketing/cms';
import { cn } from '../../lib/utils';

const STATUS_COLORS: Record<SponsoredCampaignStatus, string> = {
  draft: 'bg-gray-100 text-gray-600',
  scheduled: 'bg-blue-100 text-blue-700',
  active: 'bg-green-100 text-green-700',
  paused: 'bg-yellow-100 text-yellow-700',
  expired: 'bg-red-100 text-red-600',
};

export function SponsoredCampaignsManagerPage() {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [refreshKey, setRefreshKey] = useState(0);

  const campaigns = useMemo(() => {
    let items = listSponsoredCampaigns();
    if (query.trim()) {
      const q = query.trim().toLowerCase();
      items = items.filter((c) => c.name.toLowerCase().includes(q) || c.brandName?.toLowerCase().includes(q));
    }
    return items.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
  }, [query, refreshKey]);

  const refresh = () => setRefreshKey((n) => n + 1);

  const handleDelete = (campaignId: string) => {
    deleteSponsoredCampaign(campaignId);
    toast.success('Campaign deleted');
    refresh();
  };

  return (
    <div className="flex-grow p-6 space-y-6 max-w-6xl">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-[#1A1A2E] tracking-tight">Sponsored Campaigns</h1>
          <p className="text-xs text-gray-500">Configure sponsored discovery placements · {campaigns.length} campaigns</p>
        </div>
        <Link
          to="/marketing/sponsored/new"
          className="inline-flex items-center gap-2 px-4 py-2 bg-[#EB4501] text-white text-xs font-bold uppercase rounded"
        >
          <Plus size={14} /> New Campaign
        </Link>
      </div>

      <input
        placeholder="Search campaigns..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-full max-w-md px-3 py-2 text-sm border border-[#e8edf2] rounded"
      />

      {campaigns.length === 0 ? (
        <div className="text-center py-16 border border-dashed border-[#e8edf2] rounded-lg">
          <p className="text-sm text-gray-500">No sponsored campaigns yet.</p>
          <Link to="/marketing/sponsored/new" className="mt-4 inline-block text-xs font-bold uppercase text-[#EB4501] hover:underline">
            Create campaign
          </Link>
        </div>
      ) : (
        <div className="bg-white border border-[#e8edf2] rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-[10px] font-bold uppercase text-gray-400">
              <tr>
                <th className="text-left p-3">Campaign</th>
                <th className="text-left p-3">Type</th>
                <th className="text-left p-3">Placements</th>
                <th className="text-left p-3">Priority</th>
                <th className="text-left p-3">Status</th>
                <th className="text-left p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {campaigns.map((c) => (
                <tr key={c.campaignId} className="border-t border-[#e8edf2] hover:bg-gray-50">
                  <td className="p-3">
                    <button
                      type="button"
                      onClick={() => navigate(`/marketing/sponsored/${c.campaignId}`)}
                      className="font-semibold text-left hover:text-[#CF4400]"
                    >
                      {c.name}
                    </button>
                    {c.brandName && <p className="text-xs text-gray-400">{c.brandName}</p>}
                  </td>
                  <td className="p-3 capitalize text-gray-500">{c.campaignType}</td>
                  <td className="p-3">
                    <div className="flex flex-wrap gap-1">
                      {c.placements.map((p) => (
                        <span key={p} className="px-1.5 py-0.5 text-[9px] font-bold uppercase bg-gray-100 rounded">
                          {SPONSORED_PLACEMENT_OPTIONS.find((o) => o.id === p)?.label ?? p}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="p-3">{c.priority}</td>
                  <td className="p-3">
                    <span className={cn('px-2 py-0.5 rounded text-[10px] font-bold uppercase', STATUS_COLORS[c.status])}>
                      {c.status}
                    </span>
                  </td>
                  <td className="p-3">
                    <button
                      type="button"
                      onClick={() => handleDelete(c.campaignId)}
                      className="text-xs text-red-500 hover:underline"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
