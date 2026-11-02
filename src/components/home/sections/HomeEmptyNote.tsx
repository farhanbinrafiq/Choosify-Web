import React from 'react';
import { Link } from 'react-router-dom';

/**
 * Honest empty state for a homepage section that has no real data yet — the
 * section keeps its place and heading instead of being filled with demo content.
 */
export function HomeEmptyNote({ text, linkHref, linkLabel }: { text: string; linkHref?: string; linkLabel?: string }) {
  return (
    <div
      className="rounded-[10px] border border-dashed border-[#E2E8F0] bg-white/60 px-4 py-6 text-center text-[12.5px] text-[#9AA0AC]"
      data-testid="home-empty-note"
    >
      {text}
      {linkHref && linkLabel ? (
        <>
          {' '}
          <Link to={linkHref} className="font-bold text-[#FF5B00] hover:underline">
            {linkLabel}
          </Link>
        </>
      ) : null}
    </div>
  );
}
