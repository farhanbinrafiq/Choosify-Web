import React, { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, LayoutGrid, List } from 'lucide-react';
import type { CmsContentStatus, CmsContentTypeId, MarketingContentRecord } from '../../types/marketing/cms';
import { CMS_CONTENT_TYPE_REGISTRY } from '../../lib/marketing/cmsContentTypeRegistry';
import { filterMarketingContent } from '../../services/marketingCmsStorage';
import { cn } from '../../lib/utils';

interface MarketingContentListShellProps {
  title: string;
  description: string;
  contentTypes?: CmsContentTypeId | CmsContentTypeId[];
  createPath?: string;
  editPathPrefix?: string;
}

const STATUS_COLORS: Record<CmsContentStatus, string> = {
  draft: 'bg-gray-100 text-gray-600',
  scheduled: 'bg-blue-100 text-blue-700',
  published: 'bg-green-100 text-green-700',
  expired: 'bg-red-100 text-red-600',
};

export function MarketingContentListShell({
  title,
  description,
  contentTypes,
  createPath = '/marketing/content/new',
  editPathPrefix = '/marketing/content',
}: MarketingContentListShellProps) {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState<CmsContentStatus | 'all'>('all');
  const [view, setView] = useState<'grid' | 'table'>('grid');
  const [refreshKey, setRefreshKey] = useState(0);

  const items = useMemo(
    () => filterMarketingContent({ contentType: contentTypes, status, query }),
    [contentTypes, status, query, refreshKey],
  );

  return (
    <div className="flex-grow p-6 space-y-6 max-w-6xl">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-[#1A1A2E] tracking-tight">{title}</h1>
          <p className="text-xs text-gray-500">{description} · {items.length} items</p>
        </div>
        <Link
          to={createPath}
          className="inline-flex items-center gap-2 px-4 py-2 bg-[#E8500A] text-white text-xs font-bold uppercase rounded"
        >
          <Plus size={14} /> Create
        </Link>
      </div>

      <div className="flex flex-wrap gap-3 items-center bg-white border border-[#e8edf2] rounded-lg p-3">
        <input
          placeholder="Search content..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="flex-grow min-w-[200px] px-3 py-2 text-sm border border-[#e8edf2] rounded"
        />
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value as CmsContentStatus | 'all')}
          className="px-3 py-2 text-sm border rounded"
        >
          <option value="all">All statuses</option>
          {(['draft', 'scheduled', 'published', 'expired'] as const).map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
        <div className="flex gap-1 ml-auto">
          <button type="button" onClick={() => setView('grid')} className={cn('p-2 rounded', view === 'grid' && 'bg-gray-100')}>
            <LayoutGrid size={16} />
          </button>
          <button type="button" onClick={() => setView('table')} className={cn('p-2 rounded', view === 'table' && 'bg-gray-100')}>
            <List size={16} />
          </button>
        </div>
      </div>

      {items.length === 0 ? (
        <div className="text-center py-16 border border-dashed border-[#e8edf2] rounded-lg">
          <p className="text-sm text-gray-500">No content yet. Create your first item.</p>
          <Link to={createPath} className="mt-4 inline-block text-xs font-bold uppercase text-[#E8500A] hover:underline">
            Create content
          </Link>
        </div>
      ) : view === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((item) => (
            <ContentCard key={item.contentId} item={item} onClick={() => navigate(`${editPathPrefix}/${item.contentId}`)} />
          ))}
        </div>
      ) : (
        <div className="bg-white border border-[#e8edf2] rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-[10px] font-bold uppercase text-gray-400">
              <tr>
                <th className="text-left p-3">Title</th>
                <th className="text-left p-3">Type</th>
                <th className="text-left p-3">Status</th>
                <th className="text-left p-3">Updated</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr
                  key={item.contentId}
                  className="border-t border-[#e8edf2] hover:bg-gray-50 cursor-pointer"
                  onClick={() => navigate(`${editPathPrefix}/${item.contentId}`)}
                >
                  <td className="p-3 font-semibold">{item.title}</td>
                  <td className="p-3 text-gray-500 capitalize">{item.contentType.replace(/_/g, ' ')}</td>
                  <td className="p-3">
                    <span className={cn('px-2 py-0.5 rounded text-[10px] font-bold uppercase', STATUS_COLORS[item.status])}>
                      {item.status}
                    </span>
                  </td>
                  <td className="p-3 text-gray-400 text-xs">{new Date(item.updatedAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function ContentCard({ item, onClick }: { item: MarketingContentRecord; onClick: () => void }) {
  const typeMeta = CMS_CONTENT_TYPE_REGISTRY.find((t) => t.id === item.contentType);
  return (
    <button
      type="button"
      onClick={onClick}
      className="text-left bg-white border border-[#e8edf2] rounded-lg p-4 hover:border-[#E8500A]/30 transition-colors"
    >
      <span className="text-2xl" aria-hidden>{typeMeta?.icon ?? '📄'}</span>
      <h3 className="font-bold text-navy mt-2 line-clamp-1">{item.title}</h3>
      <p className="text-xs text-gray-400 mt-1 capitalize">{item.contentType.replace(/_/g, ' ')}</p>
      <span className={cn('inline-block mt-3 px-2 py-0.5 rounded text-[10px] font-bold uppercase', STATUS_COLORS[item.status])}>
        {item.status}
      </span>
    </button>
  );
}
