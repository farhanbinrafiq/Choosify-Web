import React from 'react';
import { ChevronUp, ChevronDown, Eye, EyeOff } from 'lucide-react';
import type { SpotlightPageSectionConfig } from '../../types/spotlight/experience/pageSections';
import { SPOTLIGHT_PAGE_SECTION_IDS } from '../../types/spotlight/experience/pageSections';
import { cn } from '../../lib/utils';

const SECTION_LABELS: Record<string, string> = {
  hero_media: 'Hero',
  content_summary: 'Summary',
  media_gallery: 'Gallery',
  description: 'Description',
  schedule: 'Schedule',
  live_status: 'Live Status',
  countdown: 'Countdown',
  winner: 'Winner',
  why_it_won: 'Why It Won',
  verdict: 'Verdict',
  takeaways: 'Takeaways',
  pros: 'Pros',
  cons: 'Cons',
  top_picks: 'Top Picks',
  top_3: 'Top 3',
  top_5: 'Top 5',
  products_reviewed: 'Products',
  services_reviewed: 'Services',
  comparison_table: 'Comparison',
  specifications: 'Specifications',
  pricing: 'Pricing',
  associated_products: 'Associated Products',
  associated_services: 'Associated Services',
  download_attachments: 'Attachments',
  image_gallery: 'Image Gallery',
  video_gallery: 'Video Gallery',
  timeline: 'Timeline',
  announcements: 'Announcements',
  brand_profile_card: 'Brand Card',
  creator_profile_card: 'Creator Card',
  related_spotlight: 'Related Content',
  related_products: 'Related Products',
  related_services: 'Related Services',
  related_brands: 'Related Brands',
  tags: 'Tags',
  share: 'Share',
};

interface SectionEditorPanelProps {
  sections: SpotlightPageSectionConfig[];
  onChange: (sections: SpotlightPageSectionConfig[]) => void;
}

export function SectionEditorPanel({ sections, onChange }: SectionEditorPanelProps) {
  const ordered = [...sections].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

  const toggleVisible = (id: string) => {
    onChange(
      sections.map((s) => (s.id === id ? { ...s, visible: !s.visible } : s)),
    );
  };

  const move = (id: string, dir: -1 | 1) => {
    const idx = ordered.findIndex((s) => s.id === id);
    const swapIdx = idx + dir;
    if (swapIdx < 0 || swapIdx >= ordered.length) return;
    const next = [...ordered];
    [next[idx], next[swapIdx]] = [next[swapIdx], next[idx]];
    onChange(next.map((s, i) => ({ ...s, order: i })));
  };

  const addSection = (id: string) => {
    if (sections.some((s) => s.id === id)) return;
    onChange([...sections, { id: id as SpotlightPageSectionConfig['id'], visible: true, order: sections.length }]);
  };

  const available = SPOTLIGHT_PAGE_SECTION_IDS.filter((id) => !sections.some((s) => s.id === id));

  return (
    <div className="space-y-4">
      <ul className="space-y-2">
        {ordered.map((section) => (
          <li
            key={section.id}
            className={cn(
              'flex items-center gap-2 p-3 border rounded-lg',
              section.visible ? 'border-[#e8edf2] bg-white' : 'border-dashed border-gray-200 bg-gray-50 opacity-70',
            )}
          >
            <div className="flex flex-col gap-0.5">
              <button type="button" onClick={() => move(section.id, -1)} className="text-gray-400 hover:text-navy p-0.5">
                <ChevronUp size={14} />
              </button>
              <button type="button" onClick={() => move(section.id, 1)} className="text-gray-400 hover:text-navy p-0.5">
                <ChevronDown size={14} />
              </button>
            </div>
            <span className="flex-grow text-sm font-semibold text-navy">
              {SECTION_LABELS[section.id] ?? section.id}
            </span>
            <button
              type="button"
              onClick={() => toggleVisible(section.id)}
              className="p-1.5 rounded text-gray-400 hover:text-[#CF4400]"
              title={section.visible ? 'Hide section' : 'Show section'}
            >
              {section.visible ? <Eye size={16} /> : <EyeOff size={16} />}
            </button>
          </li>
        ))}
      </ul>

      {available.length > 0 && (
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">Add section</p>
          <div className="flex flex-wrap gap-2">
            {available.slice(0, 12).map((id) => (
              <button
                key={id}
                type="button"
                onClick={() => addSection(id)}
                className="px-2 py-1 text-[10px] font-bold uppercase border border-[#e8edf2] rounded hover:border-[#EB4501]/40"
              >
                + {SECTION_LABELS[id] ?? id}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
