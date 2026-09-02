import React, { useState } from 'react';
import { X, Plus, Trash2, Loader2 } from 'lucide-react';
import { operationsApi } from '../../services/operationsApi';
import { toast } from '../../lib/notify';
import type { ManualOrderOfferCard } from '../../types/manualOrder';

type DraftItem = {
  productId: string;
  quantity: string;
  price: string;
};

/**
 * Seller-side manual order offer composer (Sprint 10). Deliberately a plain
 * product-id entry rather than a picker — GET /catalog/products has no
 * seller-scoped filter today, and the backend already validates existence +
 * ownership + pricing robustly, so this is honest and safe even though a
 * proper picker (Sprint 11 UX polish) would be nicer.
 */
export function SendOrderOfferModal({
  buyerIdDefault,
  onClose,
  onSent,
}: {
  buyerIdDefault?: string;
  onClose: () => void;
  onSent: (offer: ManualOrderOfferCard) => void;
}) {
  const [buyerId, setBuyerId] = useState(buyerIdDefault || '');
  const [items, setItems] = useState<DraftItem[]>([{ productId: '', quantity: '1', price: '' }]);
  const [deliveryTotal, setDeliveryTotal] = useState('0');
  const [notes, setNotes] = useState('');
  const [sending, setSending] = useState(false);

  const updateItem = (idx: number, patch: Partial<DraftItem>) => {
    setItems((prev) => prev.map((it, i) => (i === idx ? { ...it, ...patch } : it)));
  };

  const handleSend = async () => {
    if (!buyerId.trim()) {
      toast.error('Buyer ID is required.');
      return;
    }
    const parsedItems = items
      .filter((it) => it.productId.trim())
      .map((it) => ({
        productId: it.productId.trim(),
        quantity: Math.max(1, Math.floor(Number(it.quantity) || 1)),
        price: Number(it.price),
      }));
    if (parsedItems.length === 0) {
      toast.error('Add at least one product.');
      return;
    }
    if (parsedItems.some((it) => !Number.isFinite(it.price) || it.price <= 0)) {
      toast.error('Every item needs a valid price.');
      return;
    }
    setSending(true);
    try {
      const offer = await operationsApi.createManualOrderOffer({
        buyerId: buyerId.trim(),
        items: parsedItems,
        deliveryTotal: Math.max(0, Number(deliveryTotal) || 0),
        notes: notes.trim() || undefined,
      });
      toast.success('Order offer sent.');
      onSent(offer);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to send offer.');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div
        className="bg-white rounded-2xl max-w-md w-full max-h-[85vh] overflow-y-auto p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-black text-[#1A1A2E]">Send Order Offer</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700 cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-3">
          <div>
            <label className="text-[11px] font-bold text-[#4B5563] block mb-1">Buyer ID</label>
            <input
              value={buyerId}
              onChange={(e) => setBuyerId(e.target.value)}
              placeholder="Buyer's account ID"
              className="w-full border border-[#E5E7EB] rounded-lg px-3 py-2 text-[12.5px]"
            />
          </div>

          <div>
            <label className="text-[11px] font-bold text-[#4B5563] block mb-1">Items</label>
            <div className="space-y-2">
              {items.map((it, idx) => (
                <div key={idx} className="flex gap-2 items-center">
                  <input
                    value={it.productId}
                    onChange={(e) => updateItem(idx, { productId: e.target.value })}
                    placeholder="Product ID"
                    className="flex-1 min-w-0 border border-[#E5E7EB] rounded-lg px-2 py-1.5 text-[12px]"
                  />
                  <input
                    value={it.quantity}
                    onChange={(e) => updateItem(idx, { quantity: e.target.value })}
                    placeholder="Qty"
                    type="number"
                    min={1}
                    className="w-16 border border-[#E5E7EB] rounded-lg px-2 py-1.5 text-[12px]"
                  />
                  <input
                    value={it.price}
                    onChange={(e) => updateItem(idx, { price: e.target.value })}
                    placeholder="Price"
                    type="number"
                    min={0}
                    className="w-20 border border-[#E5E7EB] rounded-lg px-2 py-1.5 text-[12px]"
                  />
                  {items.length > 1 && (
                    <button
                      type="button"
                      onClick={() => setItems((prev) => prev.filter((_, i) => i !== idx))}
                      className="text-rose-500 cursor-pointer shrink-0"
                    >
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={() => setItems((prev) => [...prev, { productId: '', quantity: '1', price: '' }])}
              className="mt-2 flex items-center gap-1 text-[11px] font-bold text-[#FF5B00] cursor-pointer"
            >
              <Plus size={12} /> Add item
            </button>
          </div>

          <div>
            <label className="text-[11px] font-bold text-[#4B5563] block mb-1">Delivery charge (৳)</label>
            <input
              value={deliveryTotal}
              onChange={(e) => setDeliveryTotal(e.target.value)}
              type="number"
              min={0}
              className="w-full border border-[#E5E7EB] rounded-lg px-3 py-2 text-[12.5px]"
            />
          </div>

          <div>
            <label className="text-[11px] font-bold text-[#4B5563] block mb-1">Note (optional)</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={2}
              className="w-full border border-[#E5E7EB] rounded-lg px-3 py-2 text-[12.5px] resize-none"
            />
          </div>

          <button
            type="button"
            onClick={handleSend}
            disabled={sending}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg py-2.5 text-[12.5px] font-bold flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-60 border-none"
          >
            {sending ? <Loader2 size={14} className="animate-spin" /> : null}
            {sending ? 'Sending…' : 'Send Offer'}
          </button>
        </div>
      </div>
    </div>
  );
}
