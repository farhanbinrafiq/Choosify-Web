import React, { useEffect, useMemo } from 'react';
import { X, Save, Trash2 } from 'lucide-react';
import { getStudioSectionById } from '../../data/studioSections';
import { useStudioEdit } from '../../context/StudioEditContext';

export function StudioEditPanel() {
  const {
    editMode,
    activeSectionId,
    closeEditor,
    getFieldValue,
    setFieldValue,
    saveSectionDraft,
    clearSectionDraft,
  } = useStudioEdit();

  const section = useMemo(
    () => (activeSectionId ? getStudioSectionById(activeSectionId) : undefined),
    [activeSectionId],
  );

  useEffect(() => {
    if (!editMode) closeEditor();
  }, [editMode, closeEditor]);

  if (!editMode || !section) return null;

  return (
    <div className="fixed inset-0 z-[120] flex justify-end">
      <button
        type="button"
        aria-label="Close studio editor"
        className="absolute inset-0 bg-[#050514]/45"
        onClick={closeEditor}
      />
      <aside className="relative w-full max-w-md h-full bg-white border-l border-[#e8edf2] shadow-2xl flex flex-col">
        <div className="flex items-start justify-between gap-3 px-5 py-4 border-b border-[#e8edf2]">
          <div>
            <p className="text-[9px] font-black uppercase tracking-[0.2em] text-[#E8500A]">
              CMS Studio
            </p>
            <h2 className="text-lg font-black text-[#1A1D4E] italic uppercase tracking-tight">
              {section.label}
            </h2>
            <p className="text-[10px] font-semibold text-gray-400 mt-1">
              Anchor: {section.anchorId}
            </p>
          </div>
          <button
            type="button"
            onClick={closeEditor}
            className="p-2 rounded-full hover:bg-gray-100 text-gray-500"
          >
            <X size={16} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
          {section.fields.length === 0 ? (
            <p className="text-[11px] font-semibold text-gray-500 leading-relaxed">
              This section is mapped for navigation and layout control. Field editing will be wired to the backend CMS in a later phase.
            </p>
          ) : (
            section.fields.map((field) => (
              <label key={field.id} className="block space-y-2">
                <span className="text-[10px] font-black uppercase tracking-wider text-[#1A1D4E]">
                  {field.label}
                  {field.required ? ' *' : ''}
                </span>
                {field.type === 'richtext' ? (
                  <textarea
                    rows={5}
                    value={getFieldValue(section.id, field.id)}
                    onChange={(e) => setFieldValue(section.id, field.id, e.target.value)}
                    className="w-full rounded-[5px] border border-[#e8edf2] px-3 py-2 text-[12px] font-medium text-[#1A1D4E] focus:outline-none focus:border-[#E8500A]/40"
                    placeholder={`Draft ${field.label.toLowerCase()}`}
                  />
                ) : field.type === 'toggle' ? (
                  <select
                    value={getFieldValue(section.id, field.id, 'true')}
                    onChange={(e) => setFieldValue(section.id, field.id, e.target.value)}
                    className="w-full rounded-[5px] border border-[#e8edf2] px-3 py-2 text-[12px] font-medium text-[#1A1D4E] focus:outline-none focus:border-[#E8500A]/40"
                  >
                    <option value="true">Enabled</option>
                    <option value="false">Disabled</option>
                  </select>
                ) : (
                  <input
                    type="text"
                    value={getFieldValue(section.id, field.id)}
                    onChange={(e) => setFieldValue(section.id, field.id, e.target.value)}
                    className="w-full rounded-[5px] border border-[#e8edf2] px-3 py-2 text-[12px] font-medium text-[#1A1D4E] focus:outline-none focus:border-[#E8500A]/40"
                    placeholder={`Draft ${field.label.toLowerCase()}`}
                  />
                )}
                <span className="text-[9px] font-bold uppercase tracking-wider text-gray-400">
                  Path: {field.path}
                </span>
              </label>
            ))
          )}
        </div>

        <div className="px-5 py-4 border-t border-[#e8edf2] flex items-center gap-2">
          <button
            type="button"
            onClick={() => saveSectionDraft(section.id)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-[5px] bg-[#1A1D4E] text-white text-[10px] font-black uppercase tracking-wider hover:bg-[#E8500A] transition-colors"
          >
            <Save size={13} />
            Save draft
          </button>
          <button
            type="button"
            onClick={() => clearSectionDraft(section.id)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-[5px] border border-[#e8edf2] text-[10px] font-black uppercase tracking-wider text-gray-500 hover:text-[#E8500A] hover:border-[#E8500A]/30 transition-colors"
          >
            <Trash2 size={13} />
            Clear
          </button>
        </div>
      </aside>
    </div>
  );
}
