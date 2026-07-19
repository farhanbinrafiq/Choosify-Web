import React from 'react';
import { cn } from '../lib/utils';

const LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

interface AlphabetFilterStripProps {
  activeLetter: string | null;
  onLetterChange: (letter: string | null) => void;
  className?: string;
  compact?: boolean;
}

export function AlphabetFilterStrip({
  activeLetter,
  onLetterChange,
  className,
  compact = false,
}: AlphabetFilterStripProps) {
  return (
    <div className={cn('flex flex-col gap-2', className)}>
      <div className="text-[9px] font-black uppercase tracking-[0.15em] text-[#8a9bb0] text-left">
        Browse A–Z
      </div>
      <div
        className={cn(
          'grid gap-1 bg-white border border-[#e8edf2] rounded-[5px] p-2.5 shadow-sm',
          compact ? 'grid-cols-7' : 'grid-cols-7 sm:grid-cols-9',
        )}
      >
        <button
          type="button"
          onClick={() => onLetterChange(null)}
          className={cn(
            'col-span-full py-1.5 rounded-[3px] text-[9px] font-black uppercase tracking-widest transition-all cursor-pointer',
            activeLetter === null
              ? 'bg-[#EB4501] text-white shadow-sm'
              : 'bg-gray-50 text-gray-400 hover:bg-gray-100',
          )}
        >
          All
        </button>
        {LETTERS.map((letter) => (
          <button
            key={letter}
            type="button"
            onClick={() => onLetterChange(activeLetter === letter ? null : letter)}
            className={cn(
              'h-7 rounded-[3px] text-[10px] font-black transition-all flex items-center justify-center uppercase cursor-pointer',
              activeLetter === letter
                ? 'bg-[#EB4501] text-white shadow-xs'
                : 'bg-gray-50 text-gray-400 hover:text-[#1A1D4E] hover:bg-gray-100/70',
            )}
          >
            {letter}
          </button>
        ))}
      </div>
    </div>
  );
}
