import React from 'react';
import { SpotlightToolbar } from './SpotlightToolbar';
import { SpotlightSidebar } from './SpotlightSidebar';
import type { StudioPanelId, SpotlightExperienceBuilderState } from '../../../hooks/useSpotlightExperienceBuilder';

interface SpotlightEditorShellProps {
  builder: SpotlightExperienceBuilderState;
  onSave: () => void;
  onSubmit?: () => void;
  onPublish?: () => void;
  children: React.ReactNode;
  library?: React.ReactNode;
}

export function SpotlightEditorShell({
  builder,
  onSave,
  onSubmit,
  onPublish,
  children,
  library,
}: SpotlightEditorShellProps) {
  const { draft, activePanel, setActivePanel } = builder;

  return (
    <div className="flex flex-col h-[calc(100vh-120px)] min-h-[600px] bg-[#F8FBFD]">
      <SpotlightToolbar
        title={draft.title || draft.headline}
        status={draft.status}
        onSave={onSave}
        onPreview={() => setActivePanel('preview')}
        onSubmit={onSubmit}
        onPublish={onPublish}
      />
      <div className="flex flex-1 min-h-0">
        <SpotlightSidebar activePanel={activePanel} onPanelChange={setActivePanel} />
        <div className="flex flex-1 min-w-0">
          <main className="flex-1 overflow-y-auto bg-white">
            {children}
          </main>
          {activePanel === 'editor' && library && (
            <aside className="w-64 shrink-0 border-l border-[#e8edf2] bg-white overflow-y-auto hidden lg:block">
              {library}
            </aside>
          )}
        </div>
      </div>
    </div>
  );
}

export type { StudioPanelId };
