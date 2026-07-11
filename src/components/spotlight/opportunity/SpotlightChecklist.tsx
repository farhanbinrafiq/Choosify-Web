import React from 'react';
import { Check, Circle } from 'lucide-react';
import type { OptimizationChecklistItem } from '../../../types/spotlight/opportunity';
import { Link } from 'react-router-dom';

interface SpotlightChecklistProps {
  items: OptimizationChecklistItem[];
  title?: string;
}

export function SpotlightChecklist({ items, title = 'Optimization Checklist' }: SpotlightChecklistProps) {
  const completed = items.filter((i) => i.completed).length;
  const pct = items.length ? Math.round((completed / items.length) * 100) : 0;

  return (
    <div className="bg-white border border-[#e8edf2] rounded-xl p-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-sm font-black text-navy uppercase">{title}</h3>
        <span className="text-xs font-bold text-[#E8500A]">{completed}/{items.length} · {pct}%</span>
      </div>
      <div className="h-1.5 bg-gray-100 rounded-full mb-4 overflow-hidden">
        <div className="h-full bg-[#E8500A] rounded-full transition-all" style={{ width: `${pct}%` }} role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100} />
      </div>
      <ul className="space-y-2">
        {items.map((item) => (
          <li key={item.id} className="flex items-start gap-2">
            {item.completed ? (
              <Check size={14} className="text-emerald-500 shrink-0 mt-0.5" aria-label="Complete" />
            ) : (
              <Circle size={14} className="text-gray-300 shrink-0 mt-0.5" aria-label="Incomplete" />
            )}
            {item.href && !item.completed ? (
              <Link to={item.href} className="text-xs text-navy hover:text-[#E8500A] font-medium">{item.label}</Link>
            ) : (
              <span className={`text-xs ${item.completed ? 'text-gray-400 line-through' : 'text-navy font-medium'}`}>{item.label}</span>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
