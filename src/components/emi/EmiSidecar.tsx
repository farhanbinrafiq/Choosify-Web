import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Sparkles, X } from 'lucide-react';
import { useEmiAssistant } from '../../hooks/useEmiAssistant';
import { pageDefinition, resolveEmiPageId } from '../../lib/emi/pageRegistry';
import { EmiInsightCard } from './EmiContextPanel';
import { useGlobalState } from '../../context/GlobalStateContext';
import { cn } from '../../lib/utils';

/** Optional floating sidecar — context-aware, non-intrusive Copilot surface */
export function EmiSidecar() {
  const location = useLocation();
  const { isFeatureEnabled } = useGlobalState();
  const pageId = resolveEmiPageId(location.pathname);
  const pageDef = pageDefinition(pageId);
  const [open, setOpen] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  const { recommendations, assistantId } = useEmiAssistant({ pageId });

  const hidden =
    !isFeatureEnabled('enable_emi_assistant') ||
    dismissed ||
    !pageDef?.sidecarEnabled ||
    location.pathname.startsWith('/emi') ||
    location.pathname.startsWith('/marketing');

  const tip = recommendations[0];

  if (hidden || !tip) return null;

  return (
    <div
      className={cn(
        'fixed z-[200] pointer-events-none',
        'bottom-[calc(5rem+env(safe-area-inset-bottom,0px))] left-4 md:bottom-6 md:left-6',
        'max-w-[280px] w-[calc(100vw-2rem)]',
      )}
    >
      {!open ? (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="pointer-events-auto flex items-center gap-2 px-3 py-2 bg-white border border-[#e8edf2] rounded-full shadow-md hover:border-[#E8500A]/40 text-left"
          aria-label="Open Emi contextual assistant"
        >
          <Sparkles size={14} className="text-[#E8500A] shrink-0" />
          <span className="text-[10px] font-bold text-navy truncate">{tip.title}</span>
        </button>
      ) : (
        <div className="pointer-events-auto bg-white border border-[#e8edf2] rounded-[5px] shadow-lg overflow-hidden">
          <div className="flex items-center justify-between px-3 py-2 border-b border-[#e8edf2] bg-[#fafbfc]">
            <span className="text-[10px] font-black uppercase text-[#E8500A] flex items-center gap-1">
              <Sparkles size={12} aria-hidden /> Emi · {assistantId}
            </span>
            <div className="flex gap-1">
              <button type="button" onClick={() => setDismissed(true)} className="p-1 text-gray-400 hover:text-navy" aria-label="Dismiss Emi sidecar">
                <X size={14} />
              </button>
              <button type="button" onClick={() => setOpen(false)} className="p-1 text-gray-400 hover:text-navy" aria-label="Minimize">
                <span className="text-xs">−</span>
              </button>
            </div>
          </div>
          <div className="p-3 max-h-48 overflow-y-auto">
            <EmiInsightCard recommendation={tip} compact />
          </div>
        </div>
      )}
    </div>
  );
}
