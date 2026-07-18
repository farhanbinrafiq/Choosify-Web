import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useGlobalState } from '../../context/GlobalStateContext';
import { CMS_TEMPLATE_REGISTRY } from '../../lib/marketing/cmsTemplateRegistry';
import { createEmptyContent, upsertMarketingContent } from '../../services/marketingCmsStorage';
import toast from 'react-hot-toast';

export function MarketingTemplatesPage() {
  const navigate = useNavigate();
  const { currentUser } = useGlobalState();

  const startFromTemplate = (templateId: string) => {
    const template = CMS_TEMPLATE_REGISTRY.find((t) => t.id === templateId);
    if (!template) return;
    const record = createEmptyContent(template.contentType, currentUser.id, template.label);
    record.pageSections = template.defaultSections;
    record.summary = template.description;
    const saved = upsertMarketingContent(record);
    toast.success(`Started from "${template.label}" template`);
    navigate(`/marketing/content/${saved.contentId}`);
  };

  return (
    <div className="flex-grow p-6 space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-extrabold text-[#1A1A2E] tracking-tight">Templates</h1>
        <p className="text-xs text-gray-500">Starter templates for common Spotlight content formats</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {CMS_TEMPLATE_REGISTRY.map((t) => (
          <div key={t.id} className="bg-white border border-[#e8edf2] rounded-lg p-5 flex flex-col">
            <span className="text-3xl" aria-hidden>{t.icon}</span>
            <h3 className="font-bold text-navy mt-2">{t.label}</h3>
            <p className="text-xs text-gray-500 mt-1 flex-grow">{t.description}</p>
            <p className="text-[10px] text-gray-400 mt-2 uppercase">
              {t.defaultSections.filter((s) => s.visible).length} sections · {t.contentType.replace(/_/g, ' ')}
            </p>
            <button
              type="button"
              onClick={() => startFromTemplate(t.id)}
              className="mt-4 px-4 py-2 text-xs font-bold uppercase bg-[#E8500A] text-white rounded w-fit"
            >
              Use Template
            </button>
          </div>
        ))}
      </div>

      <p className="text-xs text-gray-400">
        Templates pre-configure sections. Edit freely in the{' '}
        <Link to="/marketing/content" className="text-[#E8500A] hover:underline">Spotlight Content</Link> editor.
      </p>
    </div>
  );
}
