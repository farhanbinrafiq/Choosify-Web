import React from 'react';
import { cn } from '../../../lib/utils';
import { Button } from '../buttons/Button';

export interface StorePriceItem {
  id: string;
  logo: string | React.ElementType; // Can be image URL or icon component
  storeName: string;
  price: string;
  cashback?: string;
  onViewStore?: () => void;
}

export interface PriceAcrossStoresCardProps {
  title?: string;
  stores: StorePriceItem[];
  onViewAllStores?: () => void;
  className?: string;
}

export const PriceAcrossStoresCard: React.FC<PriceAcrossStoresCardProps> = ({
  title,
  stores,
  onViewAllStores,
  className
}) => {
  return (
    <div className={cn("bg-white rounded-2xl border border-slate-100 p-6 flex flex-col", className)}>
      {title && (
        <h3 className="text-sm font-black text-[#000435] uppercase tracking-wider mb-6">
          {title}
        </h3>
      )}
      
      <div className="flex-1 space-y-4">
        {stores.map((store) => (
          <div key={store.id} className="flex items-center justify-between border-b border-slate-50 pb-4 last:border-0 last:pb-0 group">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full border border-slate-100 bg-white shadow-sm flex items-center justify-center overflow-hidden shrink-0">
                {typeof store.logo === 'string' ? (
                  <img src={store.logo} alt={store.storeName} className="w-6 h-6 object-contain" />
                ) : (
                  <store.logo className="w-5 h-5 text-slate-700" />
                )}
              </div>
              <span className="text-sm font-bold text-slate-700">{store.storeName}</span>
            </div>
            
            <div className="flex flex-col items-end">
              <span className="text-sm font-black text-[#000435]">{store.price}</span>
              {store.cashback && (
                <span className="text-[10px] font-bold text-[#07D005]">
                  Cashback {store.cashback}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      {onViewAllStores && (
        <div className="mt-6 pt-4 border-t border-slate-100 text-center">
          <Button variant="ghost" size="sm" onClick={onViewAllStores} className="w-full text-[#EB4501] hover:text-[#000435]">
            View All Stores ({stores.length})
          </Button>
        </div>
      )}
    </div>
  );
};
