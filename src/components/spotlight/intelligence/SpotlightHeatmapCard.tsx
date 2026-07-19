import React from 'react';
import type { IntelligenceHeatmapCell, HeatmapKind } from '../../../types/spotlight/intelligence';

interface SpotlightHeatmapCardProps {
  title: string;
  kind: HeatmapKind;
  cells: IntelligenceHeatmapCell[];
  description?: string;
}

function cellColor(value: number): string {
  if (value >= 80) return 'bg-[#EB4501]';
  if (value >= 60) return 'bg-[#EB4501]/70';
  if (value >= 40) return 'bg-[#EB4501]/45';
  if (value >= 20) return 'bg-[#EB4501]/25';
  return 'bg-[#F8FBFD]';
}

/** Heatmap architecture — no backend required (Phase 5.4) */
export function SpotlightHeatmapCard({ title, kind, cells, description }: SpotlightHeatmapCardProps) {
  const rows = [...new Set(cells.map((c) => c.row))];
  const cols = [...new Set(cells.map((c) => c.col))];

  const getCell = (row: string, col: string) =>
    cells.find((c) => c.row === row && c.col === col)?.value ?? 0;

  return (
    <div className="bg-white border border-[#e8edf2] rounded-xl p-4">
      <div className="mb-3">
        <p className="text-sm font-black text-navy uppercase">{title}</p>
        {description && <p className="text-[10px] text-gray-400 mt-0.5">{description}</p>}
        <p className="text-[9px] text-gray-300 uppercase mt-1">{kind.replace(/_/g, ' ')} heatmap</p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-[10px]" role="grid" aria-label={`${title} heatmap`}>
          <thead>
            <tr>
              <th className="p-1 text-left text-gray-400 font-bold" scope="col" />
              {cols.map((col) => (
                <th key={col} className="p-1 text-center text-gray-400 font-bold uppercase" scope="col">{col}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row}>
                <th className="p-1 text-left text-gray-500 font-bold" scope="row">{row}</th>
                {cols.map((col) => {
                  const v = getCell(row, col);
                  return (
                    <td key={col} className="p-1">
                      <div
                        className={`h-8 rounded flex items-center justify-center font-bold text-navy/80 ${cellColor(v)}`}
                        title={`${row} × ${col}: ${v}`}
                        aria-label={`${row} ${col} intensity ${v}`}
                      >
                        {v}
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
