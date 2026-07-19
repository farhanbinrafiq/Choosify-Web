import React from 'react';

export type MiniChartKind = 'area' | 'line' | 'bar' | 'pie' | 'donut';

interface SpotlightMiniChartProps {
  kind: MiniChartKind;
  data: number[];
  height?: number;
  className?: string;
  color?: string;
}

function normalize(data: number[]): number[] {
  const max = Math.max(...data, 1);
  return data.map((v) => v / max);
}

export function SpotlightMiniChart({
  kind,
  data,
  height = 48,
  className = '',
  color = '#EB4501',
}: SpotlightMiniChartProps) {
  const values = normalize(data.length ? data : [0.2, 0.5, 0.3, 0.7, 0.4]);
  const w = 120;
  const h = height;
  const pad = 2;

  if (kind === 'bar') {
    const barW = (w - pad * 2) / values.length;
    return (
      <svg viewBox={`0 0 ${w} ${h}`} className={className} aria-hidden>
        {values.map((v, i) => {
          const bh = Math.max(2, v * (h - pad * 2));
          return (
            <rect
              key={i}
              x={pad + i * barW + 1}
              y={h - pad - bh}
              width={Math.max(2, barW - 2)}
              height={bh}
              fill={color}
              opacity={0.35 + v * 0.65}
              rx={1}
            />
          );
        })}
      </svg>
    );
  }

  if (kind === 'pie' || kind === 'donut') {
    const total = values.reduce((a, b) => a + b, 0) || 1;
    let angle = -90;
    const cx = w / 2;
    const cy = h / 2;
    const r = Math.min(w, h) / 2 - pad;
    const inner = kind === 'donut' ? r * 0.55 : 0;
    const colors = [color, '#050514', '#94a3b8', '#fbbf24', '#22c55e'];
    return (
      <svg viewBox={`0 0 ${w} ${h}`} className={className} aria-hidden>
        {values.slice(0, 5).map((v, i) => {
          const slice = (v / total) * 360;
          const start = (angle * Math.PI) / 180;
          angle += slice;
          const end = (angle * Math.PI) / 180;
          const x1 = cx + r * Math.cos(start);
          const y1 = cy + r * Math.sin(start);
          const x2 = cx + r * Math.cos(end);
          const y2 = cy + r * Math.sin(end);
          const large = slice > 180 ? 1 : 0;
          const d = inner
            ? `M ${cx + inner * Math.cos(start)} ${cy + inner * Math.sin(start)} L ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2} L ${cx + inner * Math.cos(end)} ${cy + inner * Math.sin(end)} A ${inner} ${inner} 0 ${large} 0 ${cx + inner * Math.cos(start)} ${cy + inner * Math.sin(start)}`
            : `M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2} Z`;
          return <path key={i} d={d} fill={colors[i % colors.length]} opacity={0.85} />;
        })}
      </svg>
    );
  }

  const points = values
    .map((v, i) => {
      const x = pad + (i / Math.max(values.length - 1, 1)) * (w - pad * 2);
      const y = h - pad - v * (h - pad * 2);
      return `${x},${y}`;
    })
    .join(' ');

  const areaPoints = `${pad},${h - pad} ${points} ${w - pad},${h - pad}`;

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className={className} aria-hidden>
      {kind === 'area' && (
        <polygon points={areaPoints} fill={color} opacity={0.12} />
      )}
      <polyline
        points={points}
        fill="none"
        stroke={color}
        strokeWidth={2}
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    </svg>
  );
}
