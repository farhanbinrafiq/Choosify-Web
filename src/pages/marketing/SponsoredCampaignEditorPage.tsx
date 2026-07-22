import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { toast } from '../../lib/notify';
import { ArrowLeft, Save } from 'lucide-react';
import { useGlobalState } from '../../context/GlobalStateContext';
import type { SponsoredCampaignStatus, SponsoredCampaignRecord, CmsPreviewMode } from '../../types/marketing/cms';
import type { SponsoredPlacementKind } from '../../types/commerce/sponsoredPlacement';
import {
  createEmptySponsoredCampaign,
  getSponsoredCampaignById,
  upsertSponsoredCampaign,
} from '../../services/marketingCmsStorage';
import { SponsoredPlacementPicker } from '../../components/marketing/SponsoredPlacementPicker';
import { MediaManagerPanel } from '../../components/spotlight/cms/MediaManagerPanel';
import { ProductLinkerPanel } from '../../components/spotlight/cms/ProductLinkerPanel';
import { CmsPreviewPanel } from '../../components/marketing/CmsPreviewPanel';

const CAMPAIGN_TYPES: { id: SponsoredPlacementKind; label: string }[] = [
  { id: 'product', label: 'Product' },
  { id: 'brand', label: 'Brand' },
  { id: 'collection', label: 'Collection' },
  { id: 'spotlight', label: 'Spotlight' },
  { id: 'guide', label: 'Guide' },
  { id: 'service', label: 'Service' },
  { id: 'deal', label: 'Deal' },
  { id: 'launch', label: 'Launch' },
];

export function SponsoredCampaignEditorPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { currentUser, allBrands } = useGlobalState();
  const isNew = !id || id === 'new';
  const [record, setRecord] = useState<SponsoredCampaignRecord>(() =>
    isNew ? createEmptySponsoredCampaign(currentUser.id) : createEmptySponsoredCampaign(currentUser.id),
  );
  const [previewMode, setPreviewMode] = useState<CmsPreviewMode>('sponsored_card');

  useEffect(() => {
    if (!isNew && id) {
      const existing = getSponsoredCampaignById(id);
      if (existing) setRecord(existing);
    }
  }, [id, isNew]);

  const update = (patch: Partial<SponsoredCampaignRecord>) => {
    setRecord((prev) => ({ ...prev, ...patch }));
  };

  const handleSave = () => {
    const saved = upsertSponsoredCampaign(record);
    setRecord(saved);
    toast.success('Campaign saved');
    if (isNew) navigate(`/marketing/sponsored/${saved.campaignId}`, { replace: true });
  };

  const mediaIds = record.mediaId ? [record.mediaId] : [];

  return (
    <div className="flex-grow p-6 max-w-4xl mx-auto space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link to="/marketing/sponsored" className="inline-flex items-center gap-2 text-xs text-gray-500 hover:text-[#CF4400]">
          <ArrowLeft size={14} /> Sponsored Campaigns
        </Link>
        <button
          type="button"
          onClick={handleSave}
          className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-[#EB4501] text-white text-xs font-bold uppercase rounded"
        >
          <Save size={14} /> Save
        </button>
      </div>

      <h1 className="text-2xl font-extrabold text-[#1A1A2E] tracking-tight">
        {isNew ? 'New Sponsored Campaign' : record.name}
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <label className="text-[10px] font-bold uppercase text-gray-400">Campaign Name</label>
            <input
              value={record.name}
              onChange={(e) => update({ name: e.target.value })}
              className="w-full mt-1 px-3 py-2 border border-[#e8edf2] rounded text-sm"
            />
          </div>

          <div>
            <label className="text-[10px] font-bold uppercase text-gray-400">Campaign Type</label>
            <select
              value={record.campaignType}
              onChange={(e) => update({ campaignType: e.target.value as SponsoredPlacementKind })}
              className="w-full mt-1 px-3 py-2 border border-[#e8edf2] rounded text-sm"
            >
              {CAMPAIGN_TYPES.map((t) => (
                <option key={t.id} value={t.id}>{t.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-[10px] font-bold uppercase text-gray-400 mb-2 block">Placements</label>
            <SponsoredPlacementPicker
              selected={record.placements}
              onChange={(placements) => update({ placements })}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] font-bold uppercase text-gray-400">Priority</label>
              <input
                type="number"
                min={1}
                max={100}
                value={record.priority}
                onChange={(e) => update({ priority: Number(e.target.value) })}
                className="w-full mt-1 px-3 py-2 border border-[#e8edf2] rounded text-sm"
              />
            </div>
            <div>
              <label className="text-[10px] font-bold uppercase text-gray-400">Status</label>
              <select
                value={record.status}
                onChange={(e) => update({ status: e.target.value as SponsoredCampaignStatus })}
                className="w-full mt-1 px-3 py-2 border border-[#e8edf2] rounded text-sm"
              >
                {(['draft', 'scheduled', 'active', 'paused', 'expired'] as const).map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] font-bold uppercase text-gray-400">Start Date</label>
              <input
                type="datetime-local"
                value={record.startDate.slice(0, 16)}
                onChange={(e) => update({ startDate: new Date(e.target.value).toISOString() })}
                className="w-full mt-1 px-3 py-2 border border-[#e8edf2] rounded text-sm"
              />
            </div>
            <div>
              <label className="text-[10px] font-bold uppercase text-gray-400">End Date</label>
              <input
                type="datetime-local"
                value={record.endDate.slice(0, 16)}
                onChange={(e) => update({ endDate: new Date(e.target.value).toISOString() })}
                className="w-full mt-1 px-3 py-2 border border-[#e8edf2] rounded text-sm"
              />
            </div>
          </div>

          <div>
            <label className="text-[10px] font-bold uppercase text-gray-400">Brand</label>
            <select
              value={record.brandId ?? ''}
              onChange={(e) => {
                const brand = allBrands.find((b) => String(b.id) === e.target.value);
                update({ brandId: e.target.value || undefined, brandName: brand?.name });
              }}
              className="w-full mt-1 px-3 py-2 border border-[#e8edf2] rounded text-sm"
            >
              <option value="">Select brand</option>
              {allBrands.slice(0, 50).map((b) => (
                <option key={b.id} value={String(b.id)}>{b.name}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] font-bold uppercase text-gray-400">CTA Label</label>
              <input
                value={record.cta.label}
                onChange={(e) => update({ cta: { ...record.cta, label: e.target.value } })}
                className="w-full mt-1 px-3 py-2 border border-[#e8edf2] rounded text-sm"
              />
            </div>
            <div>
              <label className="text-[10px] font-bold uppercase text-gray-400">CTA URL</label>
              <input
                value={record.cta.url}
                onChange={(e) => update({ cta: { ...record.cta, url: e.target.value } })}
                className="w-full mt-1 px-3 py-2 border border-[#e8edf2] rounded text-sm"
              />
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <label className="text-[10px] font-bold uppercase text-gray-400 mb-2 block">Media</label>
            <MediaManagerPanel
              mediaIds={mediaIds}
              primaryMediaId={record.mediaId}
              onChange={(ids, primary) => update({ mediaId: primary ?? ids[0] })}
            />
          </div>

          <div>
            <label className="text-[10px] font-bold uppercase text-gray-400 mb-2 block">Products</label>
            <ProductLinkerPanel
              linkedProductIds={record.productIds}
              onChange={(productIds) => update({ productIds })}
            />
          </div>

          <CmsPreviewPanel
            mode={previewMode}
            onModeChange={setPreviewMode}
            sponsored={record}
          />
        </div>
      </div>
    </div>
  );
}
