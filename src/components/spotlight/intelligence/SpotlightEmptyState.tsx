import React from 'react';
import { BarChart3 } from 'lucide-react';

interface SpotlightEmptyStateProps {
  title?: string;
  description?: string;
}

export function SpotlightEmptyState({
  title = 'No data yet',
  description = 'Adjust filters or publish Spotlight content to see intelligence metrics.',
}: SpotlightEmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center bg-white border border-dashed border-[#e8edf2] rounded-xl">
      <BarChart3 size={32} className="text-gray-300 mb-3" />
      <p className="text-sm font-black text-navy uppercase">{title}</p>
      <p className="text-xs text-gray-500 mt-1 max-w-sm">{description}</p>
    </div>
  );
}
