import React from 'react';
import { Link } from 'react-router-dom';
import { toast } from '../../../lib/notify';
import { cn } from '../../../lib/utils';

export interface PriceAcrossStoreRow {
  id?: string;
  storeName: string;
  price: number;
  availability?: string;
  storeUrl?: string;
}

export interface PriceAcrossStoresPanelProps {
  stores: PriceAcrossStoreRow[];
  fallbackPrice?: number;
  className?: string;
}

const STORE_COLORS = ['#EB4501', '#07A828', '#2323FF', '#1A1A2E'];

/** Sidebar "Price Across Stores" — unchanged DC styling, seller/CMS-driven rows. */
export function PriceAcrossStoresPanel({
  stores,
  fallbackPrice = 1500,
  className,
}: PriceAcrossStoresPanelProps) {
  const rows =
    stores.length > 0
      ? stores.map((store, index) => ({
          name: store.storeName,
          delivery: store.availability || 'See store',
          price: store.price,
          color: STORE_COLORS[index % STORE_COLORS.length],
          url: store.storeUrl,
        }))
      : [
          { name: 'Daraz BD', delivery: '2–3 days', price: Math.round(fallbackPrice * 0.96), color: '#EB4501' },
          { name: 'Official Store', delivery: 'Official · 1–2 days', price: fallbackPrice, color: '#07A828' },
          { name: 'Pickaboo', delivery: 'Nationwide', price: Math.round(fallbackPrice * 1.02), color: '#2323FF' },
          { name: 'Ryans', delivery: 'Express available', price: Math.round(fallbackPrice * 0.99), color: '#1A1A2E' },
        ];

  return (
    <div className={cn('bg-[#F4F7F9] rounded-[10px] p-4 text-left', className)}>
      <div className="text-[11px] font-extrabold text-[#1A1A2E] mb-3">PRICE ACROSS STORES</div>
      {rows.map((store) => (
        <div
          key={store.name}
          className="flex items-center gap-2.5 bg-white border border-[#E8EDF2] rounded-[10px] px-3 py-2.5 mb-2.5"
        >
          <div className="w-8 h-8 rounded-full bg-[#000435] text-white flex items-center justify-center text-[11px] font-extrabold shrink-0">
            {store.name.charAt(0)}
          </div>
          <div className="min-w-0 shrink-0 sm:w-[28%]">
            <div className="text-[11.5px] font-bold text-[#1A1A2E] truncate">{store.name}</div>
            <div className="text-[10px] text-[#9AA0AC] sm:hidden">🚚 {store.delivery}</div>
          </div>
          <div className="hidden sm:block flex-1 min-w-0 text-center text-[10px] text-[#9AA0AC] truncate">
            🚚 {store.delivery}
          </div>
          <div className="text-[12.5px] font-extrabold shrink-0 ml-auto sm:ml-0" style={{ color: store.color }}>
            ৳{store.price.toLocaleString()}
          </div>
          <button
            type="button"
            onClick={() => {
              if ('url' in store && store.url) {
                window.open(store.url, '_blank', 'noopener,noreferrer');
                return;
              }
              toast.success(`Opening ${store.name}…`);
            }}
            className="bg-[#EB4501] text-white border-0 px-3.5 py-1.5 rounded-2xl text-[10.5px] font-bold cursor-pointer shrink-0 whitespace-nowrap"
          >
            Shop Now
          </button>
        </div>
      ))}
      <Link to="/deals" className="text-[11px] font-bold text-[#EB4501] hover:underline">
        View more stores →
      </Link>
    </div>
  );
}
