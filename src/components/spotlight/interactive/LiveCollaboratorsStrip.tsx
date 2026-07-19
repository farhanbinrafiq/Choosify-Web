import React from 'react';
import type { SpotlightCollaborationMember } from '../../../types/spotlight/collaboration/engine';
import { COLLABORATION_ROLE_LABELS } from '../../../types/spotlight/collaboration/engine';
import { BadgeCheck } from 'lucide-react';

interface LiveCollaboratorsStripProps {
  collaborators: SpotlightCollaborationMember[];
}

/** Live Collaboration (CTO) — verified contributors */
export function LiveCollaboratorsStrip({ collaborators }: LiveCollaboratorsStripProps) {
  if (!collaborators.length) return null;
  return (
    <div className="text-left mb-6">
      <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Contributors</p>
      <div className="flex flex-wrap gap-2">
        {collaborators.map((c) => (
          <div
            key={c.publisherId}
            className="inline-flex items-center gap-2 px-3 py-1.5 border border-[#e8edf2] rounded-full bg-white text-[10px]"
          >
            {c.logoUrl ? (
              <img src={c.logoUrl} alt="" className="w-5 h-5 rounded-full object-cover" />
            ) : (
              <span className="w-5 h-5 rounded-full bg-gray-100 flex items-center justify-center font-bold">{c.name.slice(0, 1)}</span>
            )}
            <span className="font-bold text-[#1a1a2e]">{c.name}</span>
            {c.isVerified && <BadgeCheck size={10} className="text-[#EB4501]" />}
            <span className="text-gray-400 uppercase">{COLLABORATION_ROLE_LABELS[c.role]}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
