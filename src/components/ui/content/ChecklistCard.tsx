import React, { useState } from 'react';
import { CheckCircle2, Circle } from 'lucide-react';
import { cn } from '../../../lib/utils';

export interface ChecklistItem {
  id: string;
  text: string;
  completed?: boolean;
}

export interface ChecklistCardProps {
  title?: string;
  items: ChecklistItem[];
  onToggle?: (id: string) => void;
  className?: string;
}

export const ChecklistCard: React.FC<ChecklistCardProps> = ({
  title,
  items,
  onToggle,
  className
}) => {
  // Local state fallback if onToggle is not provided
  const [localItems, setLocalItems] = useState(items);

  const handleToggle = (id: string) => {
    if (onToggle) {
      onToggle(id);
    } else {
      setLocalItems(prev => prev.map(item => item.id === id ? { ...item, completed: !item.completed } : item));
    }
  };

  const displayItems = onToggle ? items : localItems;
  const completedCount = displayItems.filter(i => i.completed).length;
  const progress = (completedCount / displayItems.length) * 100;

  return (
    <div className={cn("bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-sm", className)}>
      {title && (
        <div className="mb-6">
          <h3 className="text-xl font-black text-[#000435] mb-2">{title}</h3>
          
          <div className="flex items-center gap-3">
            <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
              <div 
                className="h-full bg-[#000435] rounded-full transition-all duration-500 ease-out" 
                style={{ width: `${progress}%` }} 
              />
            </div>
            <span className="text-xs font-bold text-slate-400 shrink-0">
              {completedCount} / {displayItems.length}
            </span>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {displayItems.map((item) => (
          <button
            key={item.id}
            onClick={() => handleToggle(item.id)}
            className={cn(
              "w-full flex items-start gap-3 p-4 rounded-xl border text-left transition-all hover:bg-slate-50 cursor-pointer",
              item.completed ? "border-emerald-200 bg-emerald-50/30" : "border-slate-100"
            )}
          >
            <div className="shrink-0 mt-0.5">
              {item.completed ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-500" />
              ) : (
                <Circle className="w-5 h-5 text-slate-300" />
              )}
            </div>
            <span className={cn(
              "text-sm font-semibold leading-relaxed transition-colors",
              item.completed ? "text-slate-400 line-through" : "text-[#000435]"
            )}>
              {item.text}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};
