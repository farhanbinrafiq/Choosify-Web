import React from 'react';
import { cn } from '../../../lib/utils';
import type { SpotlightCampaignFolderId } from '../../../types/spotlight/cms';
import { SYSTEM_CAMPAIGN_FOLDERS } from '../../../types/spotlight/cms';
import { listCustomFolders } from '../../../services/spotlightCampaignStorage';

interface CampaignFolderSidebarProps {
  activeFolderId: SpotlightCampaignFolderId;
  onSelect: (folderId: SpotlightCampaignFolderId) => void;
  onCreateFolder?: (name: string) => void;
}

export function CampaignFolderSidebar({
  activeFolderId,
  onSelect,
  onCreateFolder,
}: CampaignFolderSidebarProps) {
  const customFolders = listCustomFolders();

  const handleCreate = () => {
    const name = window.prompt('Folder name');
    if (name?.trim()) onCreateFolder?.(name.trim());
  };

  const folders = [
    { folderId: 'all', name: 'All Campaigns', icon: '📋' },
    ...SYSTEM_CAMPAIGN_FOLDERS,
    ...customFolders,
  ];

  return (
    <aside className="w-56 shrink-0 border-r border-[#e8edf2] bg-white p-4 space-y-1">
      <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-3">
        Marketing / Spotlight
      </p>
      {folders.map((f) => (
        <button
          key={f.folderId}
          type="button"
          onClick={() => onSelect(f.folderId)}
          className={cn(
            'w-full text-left px-3 py-2 rounded text-xs font-semibold transition-colors',
            activeFolderId === f.folderId
              ? 'bg-[#EB4501]/10 text-[#EB4501]'
              : 'text-gray-600 hover:bg-gray-50',
          )}
        >
          {f.icon ?? '📁'} {f.name}
        </button>
      ))}
      {onCreateFolder && (
        <button
          type="button"
          onClick={handleCreate}
          className="w-full mt-4 px-3 py-2 text-xs font-bold text-[#EB4501] border border-dashed border-[#EB4501]/30 rounded hover:bg-[#CF4400]/5"
        >
          + New Folder
        </button>
      )}
    </aside>
  );
}
