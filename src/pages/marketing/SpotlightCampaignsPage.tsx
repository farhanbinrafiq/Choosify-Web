import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LayoutGrid, List, Plus, Copy } from 'lucide-react';
import toast from 'react-hot-toast';
import { useSpotlightCampaigns } from '../../hooks/useSpotlightCampaigns';
import { CampaignFolderSidebar } from '../../components/spotlight/cms/CampaignFolderSidebar';
import { CampaignStatusBadge } from '../../components/spotlight/cms/CampaignStatusBadge';
import { SPOTLIGHT_CAMPAIGN_TYPE_META } from '../../types/spotlight/campaignTypes';
import type { SpotlightCampaignType } from '../../types/spotlight/campaignTypes';
import type { SpotlightCampaignStatus } from '../../types/spotlight/lifecycle';
import {
  upsertCampaign,
  upsertFolder,
} from '../../services/spotlightCampaignStorage';
import { duplicateCampaign } from '../../utils/spotlightCampaignDuplicate';
import { useGlobalState } from '../../context/GlobalStateContext';
import { cn } from '../../lib/utils';

export function SpotlightCampaignsPage() {
  const navigate = useNavigate();
  const { currentUser } = useGlobalState();
  const { query, setQuery, campaigns, total, totalPages, refresh } = useSpotlightCampaigns();

  const handleDuplicate = (campaignId: string) => {
    const source = campaigns.find((c) => c.campaignId === campaignId);
    if (!source) return;
    const copy = duplicateCampaign(source);
    upsertCampaign(copy);
    toast.success('Campaign duplicated');
    refresh();
    navigate(`/marketing/spotlight/${copy.campaignId}`);
  };

  const handleCreateFolder = (name: string) => {
    upsertFolder({
      folderId: `folder-${Date.now()}`,
      name,
      icon: '📁',
      createdBy: currentUser.id,
      createdAt: new Date().toISOString(),
    });
    refresh();
    toast.success(`Folder "${name}" created`);
  };

  return (
    <div className="max-w-7xl mx-auto flex min-h-[calc(100vh-80px)]">
      <CampaignFolderSidebar
        activeFolderId={query.filters.folderId ?? 'all'}
        onSelect={(folderId) =>
          setQuery((q) => ({ ...q, filters: { ...q.filters, folderId }, page: 1 }))
        }
        onCreateFolder={handleCreateFolder}
      />

      <main className="flex-grow p-6 space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black text-navy uppercase italic">Spotlight Campaigns</h1>
            <p className="text-xs text-gray-500">{total} campaigns</p>
          </div>
          <Link
            to="/marketing/spotlight/new"
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#E8500A] text-white text-xs font-bold uppercase rounded"
          >
            <Plus size={14} /> New Campaign
          </Link>
        </div>

        <div className="flex flex-wrap gap-3 items-center bg-white border border-[#e8edf2] rounded-lg p-3">
          <input
            placeholder="Search campaigns..."
            value={query.filters.query ?? ''}
            onChange={(e) =>
              setQuery((q) => ({ ...q, filters: { ...q.filters, query: e.target.value }, page: 1 }))
            }
            className="flex-grow min-w-[200px] px-3 py-2 text-sm border border-[#e8edf2] rounded"
          />
          <select
            value={query.filters.status ?? 'all'}
            onChange={(e) =>
              setQuery((q) => ({
                ...q,
                filters: { ...q.filters, status: e.target.value as SpotlightCampaignStatus | 'all' },
                page: 1,
              }))
            }
            className="px-3 py-2 text-sm border rounded"
          >
            <option value="all">All statuses</option>
            {(['draft', 'pending_review', 'approved', 'scheduled', 'published', 'paused', 'expired', 'archived', 'rejected'] as const).map((s) => (
              <option key={s} value={s}>{s.replace(/_/g, ' ')}</option>
            ))}
          </select>
          <select
            value={query.filters.campaignType ?? 'all'}
            onChange={(e) =>
              setQuery((q) => ({
                ...q,
                filters: { ...q.filters, campaignType: e.target.value as SpotlightCampaignType | 'all' },
                page: 1,
              }))
            }
            className="px-3 py-2 text-sm border rounded"
          >
            <option value="all">All types</option>
            {(Object.keys(SPOTLIGHT_CAMPAIGN_TYPE_META) as SpotlightCampaignType[]).map((t) => (
              <option key={t} value={t}>{SPOTLIGHT_CAMPAIGN_TYPE_META[t].label}</option>
            ))}
          </select>
          <div className="flex gap-1 ml-auto">
            <button
              type="button"
              onClick={() => setQuery((q) => ({ ...q, view: 'grid' }))}
              className={cn('p-2 rounded', query.view === 'grid' && 'bg-gray-100')}
            >
              <LayoutGrid size={16} />
            </button>
            <button
              type="button"
              onClick={() => setQuery((q) => ({ ...q, view: 'table' }))}
              className={cn('p-2 rounded', query.view === 'table' && 'bg-gray-100')}
            >
              <List size={16} />
            </button>
          </div>
        </div>

        {query.view === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {campaigns.map((c) => (
              <article
                key={c.campaignId}
                className="bg-white border border-[#e8edf2] rounded-lg p-4 hover:border-[#E8500A]/30 cursor-pointer"
                onClick={() => navigate(`/marketing/spotlight/${c.campaignId}`)}
              >
                <div className="flex justify-between items-start mb-2">
                  <CampaignStatusBadge status={c.status} />
                  {c.isSponsored && (
                    <span className="text-[10px] font-bold text-[#E8500A]">SPONSORED</span>
                  )}
                </div>
                <h3 className="font-bold text-navy text-sm">{c.campaignName}</h3>
                <p className="text-xs text-gray-500 mt-1">{SPOTLIGHT_CAMPAIGN_TYPE_META[c.campaignType].label}</p>
                <div className="flex gap-2 mt-3">
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); handleDuplicate(c.campaignId); }}
                    className="text-xs text-gray-500 hover:text-[#E8500A] flex items-center gap-1"
                  >
                    <Copy size={12} /> Duplicate
                  </button>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="bg-white border border-[#e8edf2] rounded-lg overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-left text-[10px] uppercase tracking-widest text-gray-400">
                <tr>
                  <th className="p-3">Campaign</th>
                  <th className="p-3">Type</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Sponsored</th>
                  <th className="p-3">Updated</th>
                  <th className="p-3" />
                </tr>
              </thead>
              <tbody>
                {campaigns.map((c) => (
                  <tr
                    key={c.campaignId}
                    className="border-t border-[#e8edf2] hover:bg-gray-50 cursor-pointer"
                    onClick={() => navigate(`/marketing/spotlight/${c.campaignId}`)}
                  >
                    <td className="p-3 font-semibold">{c.campaignName}</td>
                    <td className="p-3">{SPOTLIGHT_CAMPAIGN_TYPE_META[c.campaignType].label}</td>
                    <td className="p-3"><CampaignStatusBadge status={c.status} /></td>
                    <td className="p-3">{c.isSponsored ? 'Yes' : 'No'}</td>
                    <td className="p-3 text-gray-400">{new Date(c.updatedAt).toLocaleDateString()}</td>
                    <td className="p-3">
                      <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); handleDuplicate(c.campaignId); }}
                        className="text-xs text-[#E8500A]"
                      >
                        Duplicate
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {campaigns.length === 0 && (
          <div className="text-center py-16 text-gray-400">
            <p>No campaigns yet.</p>
            <Link to="/marketing/spotlight/new" className="text-[#E8500A] font-bold text-sm mt-2 inline-block">
              Create your first campaign
            </Link>
          </div>
        )}

        {totalPages > 1 && (
          <div className="flex justify-center gap-2">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => setQuery((q) => ({ ...q, page: p }))}
                className={cn(
                  'px-3 py-1 rounded text-sm',
                  query.page === p ? 'bg-[#E8500A] text-white' : 'bg-white border',
                )}
              >
                {p}
              </button>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
