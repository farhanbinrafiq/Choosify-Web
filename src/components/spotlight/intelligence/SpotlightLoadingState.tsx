import React from 'react';
import { Loader2 } from 'lucide-react';

export function SpotlightLoadingState({ label = 'Loading intelligence…' }: { label?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 gap-3 text-gray-400" role="status" aria-live="polite">
      <Loader2 className="animate-spin text-[#E8500A]" size={28} />
      <p className="text-xs font-bold uppercase tracking-wider">{label}</p>
    </div>
  );
}
