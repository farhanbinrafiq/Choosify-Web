import React, { useCallback, useEffect, useState } from 'react';
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { ArrowLeft, Save, Eye } from 'lucide-react';
import { useGlobalState } from '../../context/GlobalStateContext';
import { CMS_CONTENT_TYPE_REGISTRY, getCmsContentType } from '../../lib/marketing/cmsContentTypeRegistry';
import type { CmsContentTypeId, CmsContentStatus, CmsPreviewMode } from '../../types/marketing/cms';
import {
  createEmptyContent,
  getMarketingContentById,
  slugifyContentTitle,
  upsertMarketingContent,
} from '../../services/marketingCmsStorage';
import { SectionEditorPanel } from '../../components/marketing/SectionEditorPanel';
import { AssociationPanel } from '../../components/marketing/AssociationPanel';
import { MediaManagerPanel } from '../../components/spotlight/cms/MediaManagerPanel';
import { CmsPreviewPanel } from '../../components/marketing/CmsPreviewPanel';
import { cn } from '../../lib/utils';

type EditorTab = 'details' | 'sections' | 'media' | 'associations' | 'preview';

export function MarketingContentEditorPage() {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { currentUser } = useGlobalState();
  const isNew = !id || id === 'new';
  const [tab, setTab] = useState<EditorTab>('details');
  const [pickedType, setPickedType] = useState<CmsContentTypeId | null>(
    (searchParams.get('type') as CmsContentTypeId) || null,
  );
  const [record, setRecord] = useState(() =>
    isNew && pickedType ? createEmptyContent(pickedType, currentUser.id) : null,
  );
  const [previewMode, setPreviewMode] = useState<CmsPreviewMode>('spotlight_detail');

  useEffect(() => {
    if (!isNew && id) {
      const existing = getMarketingContentById(id);
      if (existing) {
        setRecord(existing);
        setPickedType(existing.contentType);
      }
    }
  }, [id, isNew]);

  const update = useCallback(
    (patch: Partial<NonNullable<typeof record>>) => {
      setRecord((prev) => (prev ? { ...prev, ...patch } : prev));
    },
    [],
  );

  const handleSave = () => {
    if (!record) return;
    const saved = upsertMarketingContent({
      ...record,
      slug: slugifyContentTitle(record.title),
    });
    setRecord(saved);
    toast.success('Content saved');
    if (isNew) navigate(`/marketing/content/${saved.contentId}`, { replace: true });
  };

  if (isNew && !pickedType) {
    return (
      <div className="flex-grow p-6 max-w-4xl mx-auto">
        <Link to="/marketing/content" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-[#E8500A] mb-6">
          <ArrowLeft size={14} /> Back to Spotlight Content
        </Link>
        <h1 className="text-2xl font-extrabold text-[#1A1A2E] tracking-tight mb-2">Create Spotlight Content</h1>
        <p className="text-sm text-gray-500 mb-6">Choose a content type. Only relevant fields and sections will be exposed.</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {CMS_CONTENT_TYPE_REGISTRY.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => {
                setPickedType(t.id);
                setRecord(createEmptyContent(t.id, currentUser.id));
              }}
              className="flex flex-col items-start gap-1 rounded-xl border border-[#e8edf2] bg-white p-4 text-left hover:border-[#E8500A]/40 hover:bg-[#E8500A]/5 transition-colors"
            >
              <span className="text-2xl" aria-hidden>{t.icon}</span>
              <span className="font-bold text-sm text-navy">{t.label}</span>
              <span className="text-xs text-gray-400 capitalize">{t.group}</span>
            </button>
          ))}
        </div>
      </div>
    );
  }

  if (!record) {
    return <div className="p-6 text-gray-500">Loading...</div>;
  }

  const typeMeta = getCmsContentType(record.contentType);

  return (
    <div className="flex-grow flex flex-col min-h-0">
      <div className="border-b border-[#e8edf2] bg-white px-6 py-3 flex flex-wrap items-center justify-between gap-3">
        <Link to="/marketing/content" className="inline-flex items-center gap-2 text-xs text-gray-500 hover:text-[#E8500A]">
          <ArrowLeft size={14} /> Spotlight Content
          {typeMeta && <span className="text-gray-300">·</span>}
          {typeMeta && <span className="font-bold text-navy">{typeMeta.icon} {typeMeta.label}</span>}
        </Link>
        <div className="flex items-center gap-2">
          <select
            value={record.status}
            onChange={(e) => update({ status: e.target.value as CmsContentStatus })}
            className="px-3 py-1.5 text-xs border rounded"
          >
            {(['draft', 'scheduled', 'published', 'expired'] as const).map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
          <button
            type="button"
            onClick={handleSave}
            className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-[#E8500A] text-white text-xs font-bold uppercase rounded"
          >
            <Save size={14} /> Save
          </button>
        </div>
      </div>

      <div className="flex flex-grow min-h-0">
        <nav className="w-44 shrink-0 border-r border-[#e8edf2] bg-white p-3 space-y-1 hidden sm:block">
          {([
            ['details', 'Details'],
            ['sections', 'Sections'],
            ['media', 'Media'],
            ['associations', 'Associations'],
            ['preview', 'Preview'],
          ] as [EditorTab, string][]).map(([key, label]) => (
            <button
              key={key}
              type="button"
              onClick={() => setTab(key)}
              className={cn(
                'w-full text-left px-3 py-2 rounded text-xs font-semibold',
                tab === key ? 'bg-[#E8500A]/10 text-[#E8500A]' : 'text-gray-600 hover:bg-gray-50',
              )}
            >
              {key === 'preview' && <Eye size={12} className="inline mr-1" />}
              {label}
            </button>
          ))}
        </nav>

        <div className="flex-grow p-6 overflow-y-auto max-w-3xl">
          {tab === 'details' && (
            <div className="space-y-4">
              <div>
                <label className="text-[10px] font-bold uppercase text-gray-400">Title</label>
                <input
                  value={record.title}
                  onChange={(e) => update({ title: e.target.value, headline: e.target.value })}
                  className="w-full mt-1 px-3 py-2 border border-[#e8edf2] rounded text-sm"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold uppercase text-gray-400">Headline</label>
                <input
                  value={record.headline}
                  onChange={(e) => update({ headline: e.target.value })}
                  className="w-full mt-1 px-3 py-2 border border-[#e8edf2] rounded text-sm"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold uppercase text-gray-400">Summary</label>
                <textarea
                  value={record.summary}
                  onChange={(e) => update({ summary: e.target.value })}
                  rows={4}
                  className="w-full mt-1 px-3 py-2 border border-[#e8edf2] rounded text-sm"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold uppercase text-gray-400">Tags (comma-separated)</label>
                <input
                  value={record.tags.join(', ')}
                  onChange={(e) => update({ tags: e.target.value.split(',').map((t) => t.trim()).filter(Boolean) })}
                  className="w-full mt-1 px-3 py-2 border border-[#e8edf2] rounded text-sm"
                />
              </div>
              {typeMeta && (
                <div className="bg-gray-50 border border-[#e8edf2] rounded-lg p-4">
                  <p className="text-[10px] font-bold uppercase text-gray-400 mb-2">Type-specific fields</p>
                  <div className="flex flex-wrap gap-2">
                    {typeMeta.fields.map((f) => (
                      <span key={f} className="px-2 py-1 text-[10px] font-bold uppercase bg-white border rounded capitalize">
                        {f.replace(/_/g, ' ')}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {tab === 'sections' && (
            <SectionEditorPanel
              sections={record.pageSections}
              onChange={(pageSections) => update({ pageSections })}
            />
          )}

          {tab === 'media' && (
            <MediaManagerPanel
              mediaIds={record.mediaIds}
              primaryMediaId={record.primaryMediaId}
              onChange={(mediaIds, primaryMediaId) => update({ mediaIds, primaryMediaId })}
            />
          )}

          {tab === 'associations' && (
            <AssociationPanel
              associations={record.associations}
              onChange={(associations) => update({ associations })}
            />
          )}

          {tab === 'preview' && (
            <CmsPreviewPanel
              mode={previewMode}
              onModeChange={setPreviewMode}
              content={record}
            />
          )}
        </div>
      </div>
    </div>
  );
}
