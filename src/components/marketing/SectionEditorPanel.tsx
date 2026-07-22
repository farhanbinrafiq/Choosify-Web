import React from 'react';
import { ChevronUp, ChevronDown, Eye, EyeOff, Lock } from 'lucide-react';
import type { SpotlightPageSectionConfig } from '../../types/spotlight/experience/pageSections';
import {
  CONTENT_DETAIL_FIXED_SECTION_IDS,
  CONTENT_DETAIL_OPTIONAL_SECTION_IDS,
  CONTENT_DETAIL_OPTIONAL_SECTION_LABELS,
  type ContentDetailSectionConfig,
} from '../../types/spotlight/experience/contentDetailSections';
import { cn } from '../../lib/utils';

const FIXED_LABELS: Record<string, string> = {
  hero_media: 'Hero',
  media_gallery: 'Photo / Video Gallery',
  what_is_discussed: 'What Is Discussed?',
  related_spotlight: 'You May Also Like',
  profile_card: 'Creator / Brand Profile',
};

interface SectionEditorPanelProps {
  /** Legacy pageSections (still accepted) */
  sections: SpotlightPageSectionConfig[];
  onChange: (sections: SpotlightPageSectionConfig[]) => void;
  /** Preferred Content Detail optional config */
  detailSections?: ContentDetailSectionConfig[];
  onDetailSectionsChange?: (sections: ContentDetailSectionConfig[]) => void;
}

/**
 * Creator/admin section toggles for Content Detail.
 * Fixed sections are locked; optional sections can be toggled + reordered.
 */
export function SectionEditorPanel({
  sections,
  onChange,
  detailSections,
  onDetailSectionsChange,
}: SectionEditorPanelProps) {
  const optional =
    detailSections ??
    CONTENT_DETAIL_OPTIONAL_SECTION_IDS.map((id, order) => {
      const legacy = sections.find((s) => s.id === id || (id === 'items_mentioned' && (s.id === 'top_3' || s.id === 'associated_products')));
      return {
        id,
        enabled: legacy ? legacy.visible : true,
        order: legacy?.order ?? order,
      } satisfies ContentDetailSectionConfig;
    });

  const ordered = [...optional].sort((a, b) => a.order - b.order);

  const emit = (next: ContentDetailSectionConfig[]) => {
    onDetailSectionsChange?.(next);
    // Keep legacy pageSections in sync for older consumers
    onChange(
      next.map((s, i) => ({
        id: s.id as SpotlightPageSectionConfig['id'],
        visible: s.enabled,
        order: i,
      })),
    );
  };

  const toggleEnabled = (id: string) => {
    emit(ordered.map((s) => (s.id === id ? { ...s, enabled: !s.enabled } : s)));
  };

  const move = (id: string, dir: -1 | 1) => {
    const idx = ordered.findIndex((s) => s.id === id);
    const swapIdx = idx + dir;
    if (swapIdx < 0 || swapIdx >= ordered.length) return;
    const next = [...ordered];
    [next[idx], next[swapIdx]] = [next[swapIdx], next[idx]];
    emit(next.map((s, i) => ({ ...s, order: i })));
  };

  const addOptional = (id: (typeof CONTENT_DETAIL_OPTIONAL_SECTION_IDS)[number]) => {
    if (ordered.some((s) => s.id === id)) return;
    emit([...ordered, { id, enabled: true, order: ordered.length }]);
  };

  const available = CONTENT_DETAIL_OPTIONAL_SECTION_IDS.filter(
    (id) => !ordered.some((s) => s.id === id),
  );

  return (
    <div className="space-y-6">
      <div>
        <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2 flex items-center gap-1.5">
          <Lock size={12} /> Fixed sections (always on)
        </p>
        <ul className="space-y-2">
          {CONTENT_DETAIL_FIXED_SECTION_IDS.map((id) => (
            <li
              key={id}
              className="flex items-center gap-2 p-3 border rounded-lg border-[#e8edf2] bg-gray-50 opacity-90"
            >
              <Lock size={14} className="text-gray-300 shrink-0" />
              <span className="flex-grow text-sm font-semibold text-navy">
                {FIXED_LABELS[id] ?? id}
              </span>
              <span className="text-[10px] font-bold uppercase text-gray-400">Always</span>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">
          Optional sections (per content item)
        </p>
        <ul className="space-y-2">
          {ordered.map((section) => (
            <li
              key={section.id}
              className={cn(
                'flex items-center gap-2 p-3 border rounded-lg',
                section.enabled
                  ? 'border-[#e8edf2] bg-white'
                  : 'border-dashed border-gray-200 bg-gray-50 opacity-70',
              )}
            >
              <div className="flex flex-col gap-0.5">
                <button
                  type="button"
                  onClick={() => move(section.id, -1)}
                  className="text-gray-400 hover:text-navy p-0.5"
                >
                  <ChevronUp size={14} />
                </button>
                <button
                  type="button"
                  onClick={() => move(section.id, 1)}
                  className="text-gray-400 hover:text-navy p-0.5"
                >
                  <ChevronDown size={14} />
                </button>
              </div>
              <span className="flex-grow text-sm font-semibold text-navy">
                {CONTENT_DETAIL_OPTIONAL_SECTION_LABELS[section.id] ?? section.id}
              </span>
              <button
                type="button"
                onClick={() => toggleEnabled(section.id)}
                className="p-1.5 rounded text-gray-400 hover:text-[#CF4400]"
                title={section.enabled ? 'Disable section' : 'Enable section'}
              >
                {section.enabled ? <Eye size={16} /> : <EyeOff size={16} />}
              </button>
            </li>
          ))}
        </ul>

        {available.length > 0 && (
          <div className="mt-3">
            <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">
              Add optional section
            </p>
            <div className="flex flex-wrap gap-2">
              {available.map((id) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => addOptional(id)}
                  className="px-2 py-1 text-[10px] font-bold uppercase border border-[#e8edf2] rounded hover:border-[#EB4501]/40"
                >
                  {CONTENT_DETAIL_OPTIONAL_SECTION_LABELS[id]}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
