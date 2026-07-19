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
    <div className="fixed inset-0 z-[120] flex justify-end font-sans">
      <button
        type="button"
        aria-label="Close studio editor"
        className="absolute inset-0 bg-[#000435]/45"
        onClick={closeEditor}
      />
      <aside className="relative w-full max-w-md h-full bg-white border-l border-[#E8EDF2] shadow-2xl flex flex-col">
        <div className="flex items-start justify-between gap-3 px-5 py-4 border-b border-[#E8EDF2]">
          <div>
            <p className="text-[11px] font-bold tracking-tight text-[#EB4501]">
              CMS Studio
            </p>
            <h2 className="text-lg font-extrabold text-[#1A1A2E] tracking-tight">
              {section.label}
            </h2>
            <p className="text-[12px] font-medium text-[#9AA0AC] mt-1">
              Anchor: {section.anchorId}
            </p>
          </div>
          <button
            type="button"
            onClick={closeEditor}
            className="p-2 rounded-lg hover:bg-[#F4F7F9] text-[#9AA0AC]"
          >
            <X size={16} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4 bg-[#F4F7F9]/40">
          {section.fields.length === 0 ? (
            <p className="text-[13px] font-medium text-[#9AA0AC] leading-relaxed">
              This section is mapped for navigation and layout control. Field editing will be wired to the backend CMS in a later phase.
            </p>
          ) : (
            section.fields.map((field) => (
              <label key={field.id} className="block space-y-2">
                <span className="text-[12px] font-semibold tracking-tight text-[#1A1A2E]">
                  {field.label}
                  {field.required ? ' *' : ''}
                </span>
                {field.type === 'richtext' ? (
                  <textarea
                    rows={5}
                    value={getFieldValue(section.id, field.id)}
                    onChange={(e) => setFieldValue(section.id, field.id, e.target.value)}
                    className="w-full rounded-lg border border-[#E8EDF2] bg-white px-3 py-2 text-[13px] font-medium text-[#1A1A2E] focus:outline-none focus:border-[#EB4501]/40"
                    placeholder={`Draft ${field.label.toLowerCase()}`}
                  />
                ) : field.type === 'toggle' ? (
                  <select
                    value={getFieldValue(section.id, field.id, 'true')}
                    onChange={(e) => setFieldValue(section.id, field.id, e.target.value)}
                    className="w-full rounded-lg border border-[#E8EDF2] bg-white px-3 py-2 text-[13px] font-medium text-[#1A1A2E] focus:outline-none focus:border-[#EB4501]/40"
                  >
                    <option value="true">Enabled</option>
                    <option value="false">Disabled</option>
                  </select>
                ) : (
                  <input
                    type="text"
                    value={getFieldValue(section.id, field.id)}
                    onChange={(e) => setFieldValue(section.id, field.id, e.target.value)}
                    className="w-full rounded-lg border border-[#E8EDF2] bg-white px-3 py-2 text-[13px] font-medium text-[#1A1A2E] focus:outline-none focus:border-[#EB4501]/40"
                    placeholder={`Draft ${field.label.toLowerCase()}`}
                  />
                )}
                <span className="text-[11px] font-medium text-[#9AA0AC]">
                  Path: {field.path}
                </span>
              </label>
            ))
          )}
        </div>

        <div className="px-5 py-4 border-t border-[#E8EDF2] flex items-center gap-2 bg-white">
          <button
            type="button"
            onClick={() => saveSectionDraft(section.id)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#000435] text-white text-[13px] font-bold tracking-tight hover:bg-[#CF4400] transition-colors"
          >
            <Save size={13} />
            Save draft
          </button>
          <button
            type="button"
            onClick={() => clearSectionDraft(section.id)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border border-[#E8EDF2] text-[13px] font-bold tracking-tight text-[#9AA0AC] hover:text-[#CF4400] hover:border-[#EB4501]/30 transition-colors"
          >
            <Trash2 size={13} />
            Clear
          </button>
        </div>
      </aside>
    </div>
  );
}
