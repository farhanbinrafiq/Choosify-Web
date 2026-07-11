import React from 'react';
import { Sparkles, Loader2 } from 'lucide-react';
import type { EmiActionId } from '../../types/emi';
import { actionDefinition } from '../../lib/emi/actionRegistry';
import { cn } from '../../lib/utils';

interface EmiActionButtonProps {
  actionId: EmiActionId;
  onRun: (id: EmiActionId) => void;
  loading?: boolean;
  active?: boolean;
  compact?: boolean;
  className?: string;
}

export function EmiActionButton({ actionId, onRun, loading, active, compact, className }: EmiActionButtonProps) {
  const def = actionDefinition(actionId);
  if (!def) return null;

  return (
    <button
      type="button"
      onClick={() => onRun(actionId)}
      disabled={loading}
      className={cn(
        'inline-flex items-center gap-1.5 text-left border rounded transition-colors',
        compact ? 'px-2 py-1.5 text-[9px]' : 'px-3 py-2 text-[10px]',
        active
          ? 'border-[#E8500A] bg-[#FFF0E8] text-[#E8500A]'
          : 'border-[#e8edf2] bg-white text-gray-600 hover:border-[#E8500A]/40 hover:text-[#E8500A]',
        loading && 'opacity-60 cursor-wait',
        className,
      )}
      title={def.description}
    >
      {loading ? <Loader2 size={12} className="animate-spin shrink-0" /> : <span aria-hidden>{def.icon}</span>}
      <span className="font-bold uppercase tracking-wide">{def.label}</span>
    </button>
  );
}

interface EmiActionSuggestionProps {
  suggestion: string;
  why?: string;
  applyHint?: string;
  onDismiss?: () => void;
}

export function EmiActionSuggestion({ suggestion, why, applyHint, onDismiss }: EmiActionSuggestionProps) {
  return (
    <div className="mt-2 p-3 bg-[#fafbfc] border border-[#e8edf2] rounded-[5px] text-left space-y-2">
      <p className="text-xs text-gray-700 leading-relaxed flex gap-2">
        <Sparkles size={14} className="text-[#E8500A] shrink-0 mt-0.5" aria-hidden />
        {suggestion}
      </p>
      {why && <p className="text-[10px] text-gray-400"><strong className="text-gray-500">Why:</strong> {why}</p>}
      {applyHint && <p className="text-[10px] text-[#E8500A]/80">{applyHint}</p>}
      {onDismiss && (
        <button type="button" onClick={onDismiss} className="text-[9px] font-bold uppercase text-gray-400 hover:text-navy">
          Dismiss
        </button>
      )}
    </div>
  );
}
