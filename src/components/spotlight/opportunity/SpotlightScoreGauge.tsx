import React from 'react';

interface SpotlightScoreGaugeProps {
  label: string;
  value: number;
  max?: number;
  size?: 'sm' | 'md' | 'lg';
}

export function SpotlightScoreGauge({ label, value, max = 100, size = 'md' }: SpotlightScoreGaugeProps) {
  const pct = Math.min(100, Math.max(0, (value / max) * 100));
  const dim = size === 'lg' ? 80 : size === 'sm' ? 48 : 64;
  const r = (dim - 8) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (pct / 100) * circ;

  return (
    <div className="flex flex-col items-center gap-1">
      <svg width={dim} height={dim} className="-rotate-90" aria-hidden>
        <circle cx={dim / 2} cy={dim / 2} r={r} fill="none" stroke="#e8edf2" strokeWidth={6} />
        <circle
          cx={dim / 2}
          cy={dim / 2}
          r={r}
          fill="none"
          stroke="#EB4501"
          strokeWidth={6}
          strokeDasharray={circ}
          strokeDashoffset={offset}
          strokeLinecap="round"
        />
      </svg>
      <span className="text-lg font-black text-navy -mt-12 relative" style={{ marginTop: `-${dim * 0.55}px` }}>
        {Math.round(value)}
      </span>
      <span className="text-[9px] font-bold uppercase text-gray-400 text-center mt-6">{label}</span>
    </div>
  );
}
