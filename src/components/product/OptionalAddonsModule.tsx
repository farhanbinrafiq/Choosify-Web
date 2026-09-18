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
  maxQuantity?: number;
}

interface OptionalAddonsModuleProps {
  addons: ProductAddon[];
  selectedIds: Set<string>;
  onToggle: (id: string) => void;
  quantities?: Record<string, number>;
  onQtyChange?: (id: string, qty: number) => void;
  basePrice: number;
  addonTotal: number;
}

/** Choosify.dc.html buy-box Add-on Items — checkbox + thumb + price row */
export function OptionalAddonsModule({
  addons,
  selectedIds,
  onToggle,
  quantities,
  onQtyChange,
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
          const max = addon.maxQuantity && addon.maxQuantity >= 1 ? addon.maxQuantity : 1;
          const qty = quantities?.[addon.id] ?? 1;
          const showStepper = isSelected && !isUnavailable && max > 1;
          return (
            <div key={addon.id} className="flex items-center gap-2.5 w-full">
              <button
                type="button"
                onClick={() => !isUnavailable && onToggle(addon.id)}
                disabled={isUnavailable}
                className={cn(
                  'flex items-center gap-2.5 text-left bg-transparent border-0 p-0 cursor-pointer flex-1 min-w-0',
                  isUnavailable && 'opacity-40 cursor-not-allowed',
                )}
              >
                <div
                  className={cn(
                    'w-[18px] h-[18px] rounded border-2 flex items-center justify-center shrink-0 text-white text-[11px]',
                    isSelected ? 'border-[#FF5B00] bg-[#FF5B00]' : 'border-[#D1D5DB] bg-white',
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
                    {addon.price > 0 ? `+৳${addon.price.toLocaleString()}` : 'Free'}
                    {addon.badge ? ` · ${addon.badge}` : ''}
                    {showStepper ? ` · up to ${max}` : ''}
                  </div>
                </div>
              </button>
              {showStepper && (
                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    type="button"
                    onClick={() => onQtyChange?.(addon.id, qty - 1)}
                    disabled={qty <= 1}
                    className="w-6 h-6 rounded border border-[#D1D5DB] text-[#4B5563] text-[12px] font-bold flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    −
                  </button>
                  <span className="w-5 text-center text-[11.5px] font-bold text-[#1A1A2E]">{qty}</span>
                  <button
                    type="button"
                    onClick={() => onQtyChange?.(addon.id, qty + 1)}
                    disabled={qty >= max}
                    className="w-6 h-6 rounded border border-[#D1D5DB] text-[#4B5563] text-[12px] font-bold flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    +
                  </button>
                </div>
              )}
            </div>
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
