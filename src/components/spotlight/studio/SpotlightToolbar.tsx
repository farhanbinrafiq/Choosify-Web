import React from 'react';
import { Save, Send, Eye, Clock, ChevronDown } from 'lucide-react';
import type { SpotlightExperienceStatus } from '../../../types/spotlight/studio';
import { cn } from '../../../lib/utils';

const STATUS_LABELS: Record<SpotlightExperienceStatus, string> = {
  draft: 'Draft',
  pending_review: 'Pending Review',
  scheduled: 'Scheduled',
  published: 'Published',
  live: 'Live',
  expired: 'Expired',
  archived: 'Archived',
  revision: 'Revision',
  rejected: 'Rejected',
};

interface SpotlightToolbarProps {
  title: string;
  status: SpotlightExperienceStatus;
  onSave: () => void;
  onPreview: () => void;
  onSubmit?: () => void;
  onPublish?: () => void;
}

export function SpotlightToolbar({ title, status, onSave, onPreview, onSubmit, onPublish }: SpotlightToolbarProps) {
  return (
    <header className="h-14 border-b border-[#e8edf2] bg-white flex items-center justify-between px-4 gap-3 shrink-0">
      <div className="min-w-0">
        <p className="text-[10px] font-bold uppercase text-gray-400 tracking-wider">Spotlight Publisher Studio</p>
        <h1 className="text-sm font-black text-navy truncate">{title || 'Untitled Experience'}</h1>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        <span className={cn(
          'hidden sm:inline-flex items-center gap-1 px-2 py-1 rounded text-[10px] font-bold uppercase',
          status === 'published' || status === 'live' ? 'bg-emerald-50 text-emerald-700' : 'bg-gray-100 text-gray-500',
        )}>
          <Clock size={10} /> {STATUS_LABELS[status]}
        </span>
        <button type="button" onClick={onPreview} className="inline-flex items-center gap-1 px-3 py-1.5 text-[10px] font-bold uppercase border border-[#e8edf2] rounded hover:border-[#EB4501]/40">
          <Eye size={12} /> Preview
        </button>
        <button type="button" onClick={onSave} className="inline-flex items-center gap-1 px-3 py-1.5 text-[10px] font-bold uppercase border border-[#e8edf2] rounded hover:border-[#EB4501]/40">
          <Save size={12} /> Save
        </button>
        {onSubmit && (
          <button type="button" onClick={onSubmit} className="inline-flex items-center gap-1 px-3 py-1.5 text-[10px] font-bold uppercase bg-navy text-white rounded">
            <Send size={12} /> Submit
          </button>
        )}
        {onPublish && (
          <button type="button" onClick={onPublish} className="inline-flex items-center gap-1 px-3 py-1.5 text-[10px] font-bold uppercase bg-[#EB4501] text-white rounded">
            Publish <ChevronDown size={12} />
          </button>
        )}
      </div>
    </header>
  );
}
