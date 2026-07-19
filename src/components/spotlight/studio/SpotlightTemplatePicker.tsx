import React from 'react';
import { TEMPLATE_REGISTRY } from '../../../lib/spotlight/studio/templateRegistry';
import { BLUEPRINT_REGISTRY } from '../../../lib/spotlight/studio/blueprintRegistry';

interface SpotlightTemplatePickerProps {
  onSelectTemplate: (templateId: string) => void;
  onSelectBlueprint: (blueprintId: string) => void;
}

export function SpotlightTemplatePicker({ onSelectTemplate, onSelectBlueprint }: SpotlightTemplatePickerProps) {
  return (
    <div className="p-4 space-y-6 border-b border-[#e8edf2] bg-[#F8FBFD]">
      <div>
        <p className="text-[10px] font-black uppercase text-gray-400 mb-2">Templates — starting layout</p>
        <div className="flex flex-wrap gap-2">
          {TEMPLATE_REGISTRY.slice(0, 8).map((t) => (
            <button
              key={t.templateId}
              type="button"
              onClick={() => onSelectTemplate(t.templateId)}
              className="px-3 py-1.5 text-[10px] font-bold uppercase bg-white border border-[#e8edf2] rounded hover:border-[#EB4501]/40"
            >
              {t.title}
            </button>
          ))}
        </div>
      </div>
      <div>
        <p className="text-[10px] font-black uppercase text-gray-400 mb-2">Blueprints — workflow + structure</p>
        <div className="flex flex-wrap gap-2">
          {BLUEPRINT_REGISTRY.map((b) => (
            <button
              key={b.blueprintId}
              type="button"
              onClick={() => onSelectBlueprint(b.blueprintId)}
              className="px-3 py-1.5 text-[10px] font-bold uppercase bg-white border border-[#e8edf2] rounded hover:border-navy/40 flex items-center gap-1"
              title={b.description}
            >
              <span>{b.icon}</span> {b.title}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
