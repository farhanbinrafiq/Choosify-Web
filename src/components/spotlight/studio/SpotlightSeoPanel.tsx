import React from 'react';
import type { SpotlightExperienceSeo } from '../../../types/spotlight/studio';

interface SpotlightSeoPanelProps {
  seo: SpotlightExperienceSeo;
  title: string;
  onChange: (patch: Partial<SpotlightExperienceSeo>) => void;
}

export function SpotlightSeoPanel({ seo, title, onChange }: SpotlightSeoPanelProps) {
  return (
    <div className="p-6 space-y-4 max-w-xl">
      <h2 className="text-sm font-black text-navy uppercase">SEO</h2>
      <label className="block text-xs font-bold text-gray-500">
        Slug
        <input className="w-full mt-1 border border-[#e8edf2] rounded px-3 py-2 text-sm" value={seo.slug} onChange={(e) => onChange({ slug: e.target.value })} placeholder="url-slug" />
      </label>
      <label className="block text-xs font-bold text-gray-500">
        Meta Title
        <input className="w-full mt-1 border border-[#e8edf2] rounded px-3 py-2 text-sm" value={seo.metaTitle || title} onChange={(e) => onChange({ metaTitle: e.target.value })} />
      </label>
      <label className="block text-xs font-bold text-gray-500">
        Meta Description
        <textarea className="w-full mt-1 border border-[#e8edf2] rounded px-3 py-2 text-sm min-h-[80px]" value={seo.metaDescription} onChange={(e) => onChange({ metaDescription: e.target.value })} />
      </label>
      <label className="block text-xs font-bold text-gray-500">
        Canonical URL
        <input className="w-full mt-1 border border-[#e8edf2] rounded px-3 py-2 text-sm" value={seo.canonical ?? ''} onChange={(e) => onChange({ canonical: e.target.value })} />
      </label>
      <label className="block text-xs font-bold text-gray-500">
        Keywords (comma-separated)
        <input className="w-full mt-1 border border-[#e8edf2] rounded px-3 py-2 text-sm" value={seo.keywords.join(', ')} onChange={(e) => onChange({ keywords: e.target.value.split(',').map((k) => k.trim()).filter(Boolean) })} />
      </label>
      <label className="block text-xs font-bold text-gray-500">
        OG Image URL
        <input className="w-full mt-1 border border-[#e8edf2] rounded px-3 py-2 text-sm" value={seo.ogImage ?? ''} onChange={(e) => onChange({ ogImage: e.target.value })} />
      </label>
      <label className="block text-xs font-bold text-gray-500">
        Schema Type
        <select className="w-full mt-1 border border-[#e8edf2] rounded px-3 py-2 text-sm" value={seo.schemaType} onChange={(e) => onChange({ schemaType: e.target.value })}>
          <option value="Article">Article</option>
          <option value="Product">Product</option>
          <option value="VideoObject">VideoObject</option>
          <option value="Event">Event</option>
          <option value="LocalBusiness">LocalBusiness</option>
        </select>
      </label>
      <div className="flex gap-4">
        <label className="flex items-center gap-2 text-xs font-bold text-gray-500">
          <input type="checkbox" checked={seo.index} onChange={(e) => onChange({ index: e.target.checked })} /> Index
        </label>
        <label className="flex items-center gap-2 text-xs font-bold text-gray-500">
          <input type="checkbox" checked={seo.follow} onChange={(e) => onChange({ follow: e.target.checked })} /> Follow
        </label>
      </div>
    </div>
  );
}
