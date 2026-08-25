import React, { useCallback, useEffect, useState } from 'react';
import { Package, CheckCircle2, Loader2, RefreshCw, AlertTriangle } from 'lucide-react';
import { cn } from '../../lib/utils';
import { operationsApi } from '../../services/operationsApi';
import { useGlobalState } from '../../context/GlobalStateContext';
import { toast } from '../../lib/notify';

type SellerOrderItem = {
  itemId?: string;
  productId: string | number;
  productTitle: string;
  quantity: number;
  price: number;
  deliveredAt?: string;
};

type SellerSubOrder = {
  parentOrderId: string;
  invoiceId: string;
  createdAt: string;
  isCOD: boolean;
  items: SellerOrderItem[];
};

function toSellerSubOrders(rows: Record<string, unknown>[], sellerId: string): SellerSubOrder[] {
  const out: SellerSubOrder[] = [];
  for (const row of rows) {
    const rawSubs = Array.isArray(row.subOrders) ? row.subOrders : [];
    for (const rawSub of rawSubs) {
      const sub = rawSub as Record<string, unknown>;
      if (String(sub.sellerId || '') !== sellerId) continue;
      const rawItems = Array.isArray(sub.items) ? sub.items : [];
      out.push({
        parentOrderId: String(row.orderId || row.id || ''),
        invoiceId: String(sub.invoiceId || ''),
        createdAt: String(row.createdAt || ''),
        isCOD: Boolean(row.isCOD),
        items: rawItems.map((rawItem) => {
          const item = rawItem as Record<string, unknown>;
          return {
            itemId: typeof item.itemId === 'string' ? item.itemId : undefined,
            productId: (item.productId as string | number) ?? '',
            productTitle: String(item.productTitle || 'Item'),
            quantity: Number(item.quantity) || 0,
            price: Number(item.price) || 0,
            deliveredAt: typeof item.deliveredAt === 'string' ? item.deliveredAt : undefined,
          };
        }),
      });
    }
  }
  return out.sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
}

export function SellerOrdersSection() {
  const { currentUser } = useGlobalState();
  const [subOrders, setSubOrders] = useState<SellerSubOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [deliveringItemId, setDeliveringItemId] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setLoadError(null);
    try {
      const rows = await operationsApi.listOrders({ sellerId: currentUser.id });
      setSubOrders(toSellerSubOrders(rows, currentUser.id));
    } catch (e) {
      setLoadError(e instanceof Error ? e.message : 'Failed to load orders.');
    } finally {
      setLoading(false);
    }
  }, [currentUser.id]);

  useEffect(() => {
    load();
  }, [load]);

  const handleMarkDelivered = async (orderId: string, itemId: string | undefined) => {
    if (!itemId) {
      toast.error('This order predates itemized delivery tracking and cannot be marked delivered here.');
      return;
    }
    setDeliveringItemId(itemId);
    try {
      await operationsApi.markOrderItemDelivered(orderId, itemId);
      toast.success('Marked delivered.');
      // Re-fetch authoritative server state rather than assuming success locally.
      await load();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Failed to mark delivered.');
    } finally {
      setDeliveringItemId(null);
    }
  };

  return (
    <div className="max-w-3xl space-y-6 animate-in fade-in slide-in-from-bottom-5 duration-700">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-[#1A1A2E] tracking-tight mb-1">Seller Orders</h2>
          <p className="text-[#9AA0AC] text-[12.5px]">Orders containing your products — mark items delivered once fulfilled.</p>
        </div>
        <button
          onClick={load}
          disabled={loading}
          className="shrink-0 flex items-center gap-1.5 text-[11px] font-bold text-[#4B5563] hover:text-[#1A1A2E] border border-[#E8EDF2] rounded-full px-3 py-1.5 disabled:opacity-50 cursor-pointer"
        >
          <RefreshCw className={cn('w-3 h-3', loading && 'animate-spin')} />
          Refresh
        </button>
      </div>

      {loading && subOrders.length === 0 ? (
        <div className="py-16 flex items-center justify-center text-[#9AA0AC]">
          <Loader2 className="w-5 h-5 animate-spin mr-2" /> Loading orders…
        </div>
      ) : loadError ? (
        <div className="py-10 border border-dashed border-rose-200 rounded-[10px] flex flex-col items-center justify-center text-center bg-rose-50/40">
          <AlertTriangle className="text-rose-400 mb-3" size={24} />
          <p className="text-[13px] font-medium text-rose-600 mb-3">{loadError}</p>
          <button
            onClick={load}
            className="text-[11px] font-bold text-rose-700 border border-rose-200 rounded-full px-3 py-1.5 cursor-pointer"
          >
            Try again
          </button>
        </div>
      ) : subOrders.length === 0 ? (
        <div className="py-16 border border-dashed border-[#E8EDF2] rounded-[10px] flex flex-col items-center justify-center text-center bg-white">
          <Package className="text-[#9AA0AC] mb-3" size={28} />
          <p className="text-[13px] font-medium text-[#9AA0AC]">No orders yet</p>
        </div>
      ) : (
        <div className="space-y-3">
          {subOrders.map((sub) => (
            <div key={`${sub.parentOrderId}-${sub.invoiceId}`} className="bg-white border border-[#E8EDF2] rounded-[10px] p-4">
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <h3 className="text-[13.5px] font-extrabold text-[#1A1A2E]">{sub.parentOrderId}</h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full border bg-slate-50 text-slate-600 border-slate-200">
                  {sub.invoiceId}
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full border bg-slate-50 text-slate-600 border-slate-200">
                  {sub.isCOD ? 'Cash on delivery' : 'Prepaid'}
                </span>
              </div>
              <p className="text-[11.5px] text-[#9AA0AC] mb-3">
                Placed {sub.createdAt ? new Date(sub.createdAt).toLocaleString('en-BD') : '—'}
              </p>

              <div className="space-y-2">
                {sub.items.map((item, idx) => {
                  const isDelivering = item.itemId != null && deliveringItemId === item.itemId;
                  return (
                    <div
                      key={item.itemId || idx}
                      className="flex items-center justify-between gap-3 border-t border-[#F1F3F5] pt-2 first:border-t-0 first:pt-0"
                    >
                      <div className="min-w-0">
                        <p className="text-[12.5px] font-semibold text-[#1A1A2E] truncate">
                          {item.productTitle} <span className="text-[#9AA0AC] font-normal">× {item.quantity}</span>
                        </p>
                        <p className="text-[11.5px] text-[#9AA0AC]">৳{(item.price * item.quantity).toLocaleString()}</p>
                      </div>

                      {item.deliveredAt ? (
                        <span className="shrink-0 flex items-center gap-1 text-[10.5px] font-bold px-2 py-1 rounded-full border bg-emerald-50 text-emerald-700 border-emerald-200">
                          <CheckCircle2 size={12} /> Delivered {new Date(item.deliveredAt).toLocaleDateString('en-BD')}
                        </span>
                      ) : (
                        <button
                          onClick={() => handleMarkDelivered(sub.parentOrderId, item.itemId)}
                          disabled={isDelivering}
                          className="shrink-0 flex items-center gap-1.5 text-[10.5px] font-bold px-3 py-1.5 rounded-full bg-[#1A1A2E] text-white hover:bg-emerald-600 transition-colors disabled:opacity-60 cursor-pointer"
                        >
                          {isDelivering ? <Loader2 size={12} className="animate-spin" /> : <CheckCircle2 size={12} />}
                          {isDelivering ? 'Marking…' : 'Mark Delivered'}
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
