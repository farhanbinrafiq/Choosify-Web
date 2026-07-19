import React from 'react';
import { cn } from '../../lib/utils';

export interface ProductAddon {
  id: string;
  title: string;
  description: string;
  price: number;
  image?: string;
  badge?: 'Popular' | 'Recommended' | 'Best Value';
  available: boolean;
}

interface OptionalAddonsModuleProps {
  addons: ProductAddon[];
  selectedIds: Set<string>;
  onToggle: (id: string) => void;
  basePrice: number;
  addonTotal: number;
}

/** Choosify.dc.html buy-box Add-on Items — checkbox + thumb + price row */
export function OptionalAddonsModule({
  addons,
  selectedIds,
  onToggle,
  basePrice,
  addonTotal,
}: OptionalAddonsModuleProps) {
  if (!addons.length) return null;

  return (
    <div className="w-full text-left">
      <div className="text-[13px] font-extrabold text-[#1A1A2E] mb-3.5">Add-on Items</div>
      <div className="flex flex-col gap-3.5">
        {addons.map((addon) => {
          const isSelected = selectedIds.has(addon.id);
          const isUnavailable = !addon.available;
          return (
            <button
              key={addon.id}
              type="button"
              onClick={() => !isUnavailable && onToggle(addon.id)}
              disabled={isUnavailable}
              className={cn(
                'flex items-center gap-2.5 text-left bg-transparent border-0 p-0 cursor-pointer w-full',
                isUnavailable && 'opacity-40 cursor-not-allowed',
              )}
            >
              <div
                className={cn(
                  'w-[18px] h-[18px] rounded border-2 flex items-center justify-center shrink-0 text-white text-[11px]',
                  isSelected ? 'border-[#EB4501] bg-[#EB4501]' : 'border-[#D1D5DB] bg-white',
                )}
              >
                {isSelected ? '✓' : null}
              </div>
              <div className="w-10 h-10 rounded-md overflow-hidden shrink-0 bg-[#F4F7F9]">
                {addon.image ? (
                  <img src={addon.image} alt="" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-[10px] font-bold text-[#9AA0AC]">
                    +
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-[12px] font-bold text-[#1A1A2E] truncate">{addon.title}</div>
                <div className="text-[10.5px] text-[#9AA0AC]">
                  +৳{addon.price.toLocaleString()}
                  {addon.badge ? ` · ${addon.badge}` : ''}
                </div>
              </div>
            </button>
          );
        })}
      </div>
      {selectedIds.size > 0 && (
        <div className="mt-3.5 pt-3 border-t border-[#F1F1F3] text-[11px] text-[#4B5563]">
          Product ৳{basePrice.toLocaleString()} + add-ons ৳{addonTotal.toLocaleString()} ={' '}
          <span className="font-extrabold text-[#1A1A2E]">
            ৳{(basePrice + addonTotal).toLocaleString()}
          </span>
        </div>
      )}
    </div>
  );
}
