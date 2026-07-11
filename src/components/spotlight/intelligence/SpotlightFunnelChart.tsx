import React from 'react';
import type { IntelligenceFunnelStep } from '../../../types/spotlight/intelligence';

interface SpotlightFunnelChartProps {
  steps: IntelligenceFunnelStep[];
  title?: string;
  className?: string;
}

/** Funnel analytics — impression → buy with abandonment between steps */
export function SpotlightFunnelChart({ steps, title, className = '' }: SpotlightFunnelChartProps) {
  const max = Math.max(...steps.map((s) => s.value), 1);

  return (
    <div className={`space-y-3 ${className}`} role="img" aria-label={title ?? 'Conversion funnel'}>
      {title && <p className="text-sm font-black text-navy uppercase">{title}</p>}
      {steps.map((step, i) => {
        const widthPct = Math.max(8, (step.value / max) * 100);
        return (
          <div key={step.id} className="space-y-1">
            <div className="flex justify-between text-xs">
              <span className="font-bold text-navy">{step.label}</span>
              <span className="text-gray-500">{step.value.toLocaleString()}</span>
            </div>
            <div className="h-8 bg-[#F8FBFD] rounded overflow-hidden border border-[#e8edf2]">
              <div
                className="h-full bg-[#E8500A] rounded transition-all flex items-center justify-end pr-2"
                style={{ width: `${widthPct}%`, opacity: 0.35 + (widthPct / 100) * 0.65 }}
              >
                {widthPct > 20 && (
                  <span className="text-[9px] font-bold text-white">{Math.round(widthPct)}%</span>
                )}
              </div>
            </div>
            {step.dropoffPercent != null && i > 0 && (
              <p className="text-[10px] text-rose-500 font-bold">
                ↓ {step.dropoffPercent}% abandonment from {steps[i - 1].label}
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
}
