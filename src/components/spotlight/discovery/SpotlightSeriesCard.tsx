import React from 'react';
import { Link } from 'react-router-dom';
import type { SpotlightSeries } from '../../../types/spotlight/discovery/series';

interface SpotlightSeriesCardProps {
  series: SpotlightSeries;
}

export function SpotlightSeriesCard({ series }: SpotlightSeriesCardProps) {
  const thumb = series.episodes[0]?.thumbnailUrl;
  return (
    <Link
      to={`/spotlight/series/${series.slug}`}
      className="group flex gap-3 p-3 bg-white border border-[#e8edf2] rounded-[5px] hover:border-[#EB4501]/40 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-[#EB4501] min-h-[88px]"
      aria-label={`Series: ${series.title}`}
    >
      <div className="w-16 h-16 shrink-0 rounded bg-gray-100 overflow-hidden">
        {thumb ? <img src={thumb} alt="" className="w-full h-full object-cover" /> : null}
      </div>
      <div className="text-left min-w-0">
        <p className="text-[9px] font-black uppercase text-gray-400">Series · {series.seasons} season</p>
        <h3 className="text-sm font-bold text-[#1a1a2e] line-clamp-2">{series.title}</h3>
        <p className="text-[10px] text-gray-500 mt-0.5">{series.episodes.length} episodes</p>
      </div>
    </Link>
  );
}
