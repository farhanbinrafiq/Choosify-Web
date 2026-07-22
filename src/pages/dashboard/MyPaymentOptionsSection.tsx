import React, { useMemo, useState } from 'react';
import { CreditCard, Plus, Trash2, Smartphone } from 'lucide-react';
import { toast } from '../../lib/notify';
import { cn } from '../../lib/utils';
import type { PaymentMethodKind, SavedPaymentMethod } from '../../types/paymentMethods';
import {
  savePaymentMethods,
  seedDefaultPaymentMethodsIfEmpty,
} from '../../lib/dashboard/pendingActions';

const KIND_LABEL: Record<PaymentMethodKind, string> = {
  card: 'Card',
  bkash: 'bKash',
  nagad: 'Nagad',
  rocket: 'Rocket',
};

function statusLabel(status: SavedPaymentMethod['status']) {
  switch (status) {
    case 'pending_verification':
      return { text: 'Pending verification', className: 'bg-amber-50 text-amber-700 border-amber-200' };
    case 'expiring_soon':
      return { text: 'Expiring soon', className: 'bg-orange-50 text-orange-700 border-orange-200' };
    case 'expired':
      return { text: 'Expired', className: 'bg-rose-50 text-rose-700 border-rose-200' };
    default:
      return { text: 'Active', className: 'bg-emerald-50 text-emerald-700 border-emerald-200' };
  }
}

export function MyPaymentOptionsSection() {
  const [methods, setMethods] = useState<SavedPaymentMethod[]>(() =>
    seedDefaultPaymentMethodsIfEmpty(),
  );
  const [showAdd, setShowAdd] = useState(false);
  const [kind, setKind] = useState<PaymentMethodKind>('card');
  const [label, setLabel] = useState('');
  const [account, setAccount] = useState('');
  const [expiryMonth, setExpiryMonth] = useState('12');
  const [expiryYear, setExpiryYear] = useState('2028');

  const sorted = useMemo(
    () =>
      [...methods].sort((a, b) => Number(!!b.isDefault) - Number(!!a.isDefault)),
    [methods],
  );

  const persist = (next: SavedPaymentMethod[]) => {
    setMethods(next);
    savePaymentMethods(next);
  };

  const handleDelete = (id: string) => {
    const next = methods.filter((m) => m.id !== id);
    if (next.length && !next.some((m) => m.isDefault)) {
      next[0] = { ...next[0], isDefault: true };
    }
    persist(next);
    toast.success('Payment method removed.');
  };

  const handleAdd = () => {
    const trimmedLabel = label.trim();
    const trimmedAccount = account.trim();
    if (!trimmedLabel || !trimmedAccount) {
      toast.error('Add a label and account details.');
      return;
    }
    const next: SavedPaymentMethod = {
      id: `pm-${Date.now()}`,
      kind,
      label: trimmedLabel,
      maskedAccount:
        kind === 'card'
          ? `•••• ${trimmedAccount.slice(-4)}`
          : trimmedAccount,
      brand: kind === 'card' ? 'Card' : undefined,
      expiryMonth: kind === 'card' ? Number(expiryMonth) : undefined,
      expiryYear: kind === 'card' ? Number(expiryYear) : undefined,
      isDefault: methods.length === 0,
      status: kind === 'card' ? 'ok' : 'pending_verification',
      createdAt: new Date().toISOString(),
    };
    persist([next, ...methods]);
    setShowAdd(false);
    setLabel('');
    setAccount('');
    toast.success(
      kind === 'card'
        ? 'Card saved.'
        : `${KIND_LABEL[kind]} saved — verification pending.`,
    );
  };

  return (
    <div className="max-w-3xl space-y-6 animate-in fade-in slide-in-from-bottom-5 duration-700">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-[#1A1A2E] tracking-tight mb-1">
            My Payment Options
          </h2>
          <p className="text-[#9AA0AC] text-[12.5px]">
            Saved cards and mobile financial services (bKash, Nagad, Rocket)
          </p>
        </div>
        <button
          type="button"
          onClick={() => setShowAdd((v) => !v)}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#EB4501] hover:brightness-110 text-white text-[13px] font-bold rounded-xl border-0 cursor-pointer"
        >
          <Plus size={16} />
          Add method
        </button>
      </div>

      {showAdd && (
        <div className="bg-white border border-[#E8EDF2] rounded-[10px] p-5 space-y-4">
          <h3 className="text-[13px] font-bold text-[#1A1A2E]">Add payment method</h3>
          <div className="flex flex-wrap gap-2">
            {(Object.keys(KIND_LABEL) as PaymentMethodKind[]).map((k) => (
              <button
                key={k}
                type="button"
                onClick={() => setKind(k)}
                className={cn(
                  'px-3 py-2 text-[12px] font-bold rounded-lg border cursor-pointer',
                  kind === k
                    ? 'bg-[#EB4501]/10 border-[#EB4501] text-[#EB4501]'
                    : 'bg-white border-[#E8EDF2] text-[#6B7280]',
                )}
              >
                {KIND_LABEL[k]}
              </button>
            ))}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              placeholder={kind === 'card' ? 'e.g. Personal Visa' : 'e.g. bKash Personal'}
              className="h-11 bg-slate-50 border border-slate-200/60 rounded-xl px-4 text-xs font-bold text-[#1a1a2e] focus:outline-none focus:border-[#EB4501]/40"
            />
            <input
              value={account}
              onChange={(e) => setAccount(e.target.value)}
              placeholder={kind === 'card' ? 'Card number' : 'Mobile number'}
              className="h-11 bg-slate-50 border border-slate-200/60 rounded-xl px-4 text-xs font-bold text-[#1a1a2e] focus:outline-none focus:border-[#EB4501]/40"
            />
            {kind === 'card' && (
              <>
                <input
                  value={expiryMonth}
                  onChange={(e) => setExpiryMonth(e.target.value)}
                  placeholder="MM"
                  className="h-11 bg-slate-50 border border-slate-200/60 rounded-xl px-4 text-xs font-bold text-[#1a1a2e] focus:outline-none focus:border-[#EB4501]/40"
                />
                <input
                  value={expiryYear}
                  onChange={(e) => setExpiryYear(e.target.value)}
                  placeholder="YYYY"
                  className="h-11 bg-slate-50 border border-slate-200/60 rounded-xl px-4 text-xs font-bold text-[#1a1a2e] focus:outline-none focus:border-[#EB4501]/40"
                />
              </>
            )}
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleAdd}
              className="px-4 py-2.5 bg-[#EB4501] text-white text-[12.5px] font-bold rounded-xl border-0 cursor-pointer"
            >
              Save method
            </button>
            <button
              type="button"
              onClick={() => setShowAdd(false)}
              className="px-4 py-2.5 bg-white text-[#1A1A2E] text-[12.5px] font-bold rounded-xl border border-[#E8EDF2] cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {sorted.length === 0 ? (
        <div className="py-16 border border-dashed border-[#E8EDF2] rounded-[10px] flex flex-col items-center justify-center text-center bg-white">
          <CreditCard className="text-[#9AA0AC] mb-3" size={28} />
          <p className="text-[13px] font-medium text-[#9AA0AC]">
            No saved payment methods yet
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {sorted.map((method) => {
            const badge = statusLabel(method.status);
            const Icon = method.kind === 'card' ? CreditCard : Smartphone;
            return (
              <div
                key={method.id}
                className="bg-white border border-[#E8EDF2] rounded-[10px] p-4 flex flex-col sm:flex-row sm:items-center gap-3"
              >
                <div className="w-11 h-11 rounded-xl bg-[#F4F7F9] border border-[#E8EDF2] flex items-center justify-center shrink-0">
                  <Icon size={18} className="text-[#EB4501]" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-[13.5px] font-extrabold text-[#1A1A2E] truncate">
                      {method.label}
                    </h3>
                    {method.isDefault && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full border bg-[#EB4501]/10 text-[#EB4501] border-[#EB4501]/25">
                        Default
                      </span>
                    )}
                    <span
                      className={cn(
                        'text-[10px] font-bold px-2 py-0.5 rounded-full border',
                        badge.className,
                      )}
                    >
                      {badge.text}
                    </span>
                  </div>
                  <p className="text-[12px] text-[#9AA0AC] mt-0.5">
                    {KIND_LABEL[method.kind]} · {method.maskedAccount}
                    {method.kind === 'card' &&
                      method.expiryMonth &&
                      method.expiryYear &&
                      ` · Exp ${String(method.expiryMonth).padStart(2, '0')}/${method.expiryYear}`}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => handleDelete(method.id)}
                  className="inline-flex items-center gap-1.5 px-3 py-2 text-[12px] font-bold text-rose-600 bg-rose-50 hover:bg-rose-100 border border-rose-100 rounded-lg cursor-pointer"
                >
                  <Trash2 size={14} />
                  Delete
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
