import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { CmsPreviewPanel } from '../../components/marketing/CmsPreviewPanel';
import {
  filterMarketingContent,
  listSponsoredCampaigns,
} from '../../services/marketingCmsStorage';
import type { CmsPreviewMode } from '../../types/marketing/cms';

export function MarketingPreviewPage() {
  const contentItems = filterMarketingContent({});
  const sponsoredItems = listSponsoredCampaigns();
  const [contentId, setContentId] = useState(contentItems[0]?.contentId ?? '');
  const [sponsoredId, setSponsoredId] = useState(sponsoredItems[0]?.campaignId ?? '');
  const [mode, setMode] = useState<CmsPreviewMode>('spotlight_detail');
  const [previewTarget, setPreviewTarget] = useState<'content' | 'sponsored'>('content');

  const content = contentItems.find((c) => c.contentId === contentId);
  const sponsored = sponsoredItems.find((c) => c.campaignId === sponsoredId);

  return (
    <div className="flex-grow p-6 space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-extrabold text-[#1A1A2E] tracking-tight">Preview</h1>
        <p className="text-xs text-gray-500">
          Preview Spotlight cards, detail pages, and sponsored placements — no publishing required
        </p>
      </div>

      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => setPreviewTarget('content')}
          className={`px-3 py-1.5 text-[10px] font-bold uppercase rounded border ${previewTarget === 'content' ? 'bg-navy text-white' : 'bg-white'}`}
        >
          Spotlight Content
        </button>
        <button
          type="button"
          onClick={() => setPreviewTarget('sponsored')}
          className={`px-3 py-1.5 text-[10px] font-bold uppercase rounded border ${previewTarget === 'sponsored' ? 'bg-navy text-white' : 'bg-white'}`}
        >
          Sponsored Campaign
        </button>
      </div>

      {previewTarget === 'content' ? (
        <div className="space-y-3">
          {contentItems.length === 0 ? (
            <p className="text-sm text-gray-500">
              No content to preview. <Link to="/marketing/content/new" className="text-[#E8500A] hover:underline">Create content</Link>
            </p>
          ) : (
            <>
              <select
                value={contentId}
                onChange={(e) => setContentId(e.target.value)}
                className="w-full max-w-md px-3 py-2 border rounded text-sm"
              >
                {contentItems.map((c) => (
                  <option key={c.contentId} value={c.contentId}>{c.title}</option>
                ))}
              </select>
              <CmsPreviewPanel mode={mode} onModeChange={setMode} content={content} />
            </>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {sponsoredItems.length === 0 ? (
            <p className="text-sm text-gray-500">
              No campaigns to preview. <Link to="/marketing/sponsored/new" className="text-[#E8500A] hover:underline">Create campaign</Link>
            </p>
          ) : (
            <>
              <select
                value={sponsoredId}
                onChange={(e) => setSponsoredId(e.target.value)}
                className="w-full max-w-md px-3 py-2 border rounded text-sm"
              >
                {sponsoredItems.map((c) => (
                  <option key={c.campaignId} value={c.campaignId}>{c.name}</option>
                ))}
              </select>
              <CmsPreviewPanel
                mode={mode === 'spotlight_card' ? 'sponsored_card' : mode}
                onModeChange={setMode}
                sponsored={sponsored}
              />
            </>
          )}
        </div>
      )}
    </div>
  );
}
