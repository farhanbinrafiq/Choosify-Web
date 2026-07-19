import React from 'react';
import { Link } from 'react-router-dom';
import type { MessageThread } from '../../context/DashboardContext';
import type { Order, SubOrder } from '../../types/schemas';
import { Package, User, Link2, Copy } from 'lucide-react';
import toast from 'react-hot-toast';

type MessagesRightRailProps = {
  activeThread?: MessageThread | null;
  linkedOrder?: Order | null;
  linkedSubOrder?: SubOrder | null;
  isAnnouncementsThread?: boolean;
  onViewOrder?: () => void;
};

function copyText(label: string, value: string) {
  if (!value || value === '—') return;
  void navigator.clipboard?.writeText(value).then(
    () => toast.success(`${label} copied`),
    () => {},
  );
}

function formatStatus(status?: string) {
  if (!status) return '—';
  return status.replace(/_/g, ' ').toUpperCase();
}

function formatDate(iso?: string) {
  if (!iso) return '—';
  try {
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return iso;
    return d.toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  } catch {
    return iso;
  }
}

const SHORTCUTS = [
  { label: 'Track my order', to: '/order-tracking' },
  { label: 'My orders', to: '/profile/orders' },
  { label: 'Dashboard', to: '/dashboard' },
  { label: 'Browse brands', to: '/brands' },
] as const;

/**
 * Choosify.dc.html messages right rail — transaction details, seller profile, shortcuts.
 * Uses linked order/sub-order when present; otherwise placeholders from the active thread.
 */
export function MessagesRightRail({
  activeThread,
  linkedOrder,
  linkedSubOrder,
  isAnnouncementsThread,
  onViewOrder,
}: MessagesRightRailProps) {
  const orderId = linkedOrder?.orderId || activeThread?.orderRef || '—';
  const invoiceId = linkedSubOrder?.invoiceId || '—';
  const orderDate = formatDate(linkedOrder?.createdAt);
  const paymentMethod = linkedOrder
    ? linkedOrder.isCOD || linkedOrder.paymentMethod === 'cod'
      ? 'Cash on Delivery (COD)'
      : 'Card / Credit'
    : '—';
  const orderStatus = linkedSubOrder?.trackingStatus
    ? formatStatus(linkedSubOrder.trackingStatus)
    : linkedOrder?.status
      ? formatStatus(linkedOrder.status)
      : activeThread?.orderRef
        ? 'IN PROGRESS'
        : '—';
  const totalAmount = linkedOrder
    ? `৳${(linkedOrder.overallTotal ?? 0).toLocaleString()}`
    : linkedSubOrder
      ? `৳${(
          linkedSubOrder.items.reduce(
            (acc, x) => acc + (x.price ?? 0) * (x.quantity ?? 0),
            0,
          ) + (linkedSubOrder.deliveryFee ?? 0)
        ).toLocaleString()}`
      : '—';

  const sellerName =
    linkedSubOrder?.sellerBusinessName ||
    activeThread?.title ||
    'Seller';
  const sellerInitials = sellerName
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? '')
    .join('') || 'S';

  if (!activeThread) {
    return (
      <aside className="hidden xl:flex w-[260px] shrink-0 flex-col border-l border-[#E8EDF2] bg-white p-[18px] gap-5 overflow-y-auto min-h-0">
        <p className="text-[11px] text-[#9AA0AC] font-medium leading-relaxed">
          Select a conversation to see transaction details and seller info.
        </p>
      </aside>
    );
  }

  return (
    <aside className="hidden xl:flex w-[260px] shrink-0 flex-col border-l border-[#E8EDF2] bg-white p-[18px] gap-5 overflow-y-auto min-h-0">
      {/* Transaction details */}
      <div>
        <div className="flex items-center gap-1.5 text-[11px] font-extrabold text-[#1A1A2E] mb-3">
          <Package size={12} className="text-[#EB4501]" />
          Transaction details
        </div>
        <div className="flex flex-col gap-3 text-[11px]">
          <DetailRow
            label="Order ID"
            value={orderId}
            onCopy={() => copyText('Order ID', orderId)}
          />
          <DetailRow
            label="Invoice / transaction"
            value={invoiceId}
            onCopy={invoiceId !== '—' ? () => copyText('Invoice', invoiceId) : undefined}
          />
          <DetailRow label="Order date" value={orderDate} />
          <DetailRow label="Payment method" value={paymentMethod} />
          <DetailRow
            label="Order status"
            value={orderStatus}
            valueClassName={
              orderStatus !== '—' ? 'text-[#EB4501] font-bold' : undefined
            }
          />
          <DetailRow
            label="Total amount"
            value={totalAmount}
            valueClassName="font-extrabold text-[#1A1A2E]"
          />
        </div>
        {linkedOrder ? (
          <button
            type="button"
            onClick={onViewOrder}
            className="w-full mt-3.5 bg-[#1A1A2E] hover:bg-[#000435] text-white border-none py-2.5 rounded-lg text-[11px] font-bold cursor-pointer transition-colors"
          >
            View full order details →
          </button>
        ) : activeThread.orderRef ? (
          <Link
            to="/profile/orders"
            className="block w-full mt-3.5 bg-[#1A1A2E] hover:bg-[#000435] text-white text-center py-2.5 rounded-lg text-[11px] font-bold transition-colors"
          >
            View my orders →
          </Link>
        ) : (
          <p className="mt-3 text-[10px] text-[#9AA0AC] leading-relaxed">
            {isAnnouncementsThread
              ? 'Broadcast channel — no linked order.'
              : 'No linked order on this thread yet.'}
          </p>
        )}
      </div>

      {/* Seller / counterpart profile */}
      {!isAnnouncementsThread && (
        <div>
          <div className="flex items-center gap-1.5 text-[11px] font-extrabold text-[#1A1A2E] mb-3">
            <User size={12} className="text-[#EB4501]" />
            Seller profile
          </div>
          <div className="flex items-center gap-2.5 mb-3">
            {activeThread.avatar ? (
              <img
                src={activeThread.avatar}
                alt=""
                className="w-9 h-9 rounded-full object-cover border border-[#E8EDF2] shrink-0"
              />
            ) : (
              <div className="w-9 h-9 rounded-full bg-[#DB2777] text-white flex items-center justify-center text-xs font-extrabold shrink-0">
                {sellerInitials}
              </div>
            )}
            <div className="min-w-0">
              <div className="text-xs font-bold text-[#1A1A2E] truncate">
                {sellerName}
              </div>
              <div className="text-[9.5px] text-[#07DD05] font-bold">
                ✓ Verified seller
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2.5 text-[10.5px]">
            <div>
              <div className="text-[#9AA0AC]">Thread type</div>
              <div className="font-bold text-[#1A1A2E] capitalize">
                {activeThread.type}
              </div>
            </div>
            <div>
              <div className="text-[#9AA0AC]">Order ref</div>
              <div className="font-bold text-[#1A1A2E] truncate">
                {activeThread.orderRef || '—'}
              </div>
            </div>
            <div>
              <div className="text-[#9AA0AC]">Last activity</div>
              <div className="font-bold text-[#1A1A2E]">
                {activeThread.time || '—'}
              </div>
            </div>
            <div>
              <div className="text-[#9AA0AC]">Status</div>
              <div className="font-bold text-[#1A1A2E]">
                {activeThread.unread ? 'Unread' : 'Read'}
              </div>
            </div>
          </div>
          <Link
            to="/brands"
            className="block w-full mt-3 bg-white border border-[#E5E7EB] text-[#1A1A2E] text-center py-2 rounded-lg text-[11px] font-bold hover:border-[#EB4501] hover:text-[#CF4400] transition-colors"
          >
            Browse brands →
          </Link>
        </div>
      )}

      {/* Support shortcuts */}
      <div>
        <div className="flex items-center gap-1.5 text-[11px] font-extrabold text-[#1A1A2E] mb-3">
          <Link2 size={12} className="text-[#EB4501]" />
          Support shortcuts
        </div>
        <div className="flex flex-col gap-2">
          {SHORTCUTS.map((s) => (
            <Link
              key={s.to}
              to={s.to}
              className="flex justify-between items-center text-[11.5px] text-[#4B5563] hover:text-[#CF4400] transition-colors"
            >
              {s.label}
              <span className="text-[#9AA0AC]">›</span>
            </Link>
          ))}
        </div>
      </div>
    </aside>
  );
}

function DetailRow({
  label,
  value,
  valueClassName,
  onCopy,
}: {
  label: string;
  value: string;
  valueClassName?: string;
  onCopy?: () => void;
}) {
  return (
    <div>
      <div className="text-[#9AA0AC] mb-0.5">{label}</div>
      <div className={`font-bold text-[#1A1A2E] flex items-center gap-1 ${valueClassName ?? ''}`}>
        <span className="truncate">{value}</span>
        {onCopy && value !== '—' && (
          <button
            type="button"
            onClick={onCopy}
            className="shrink-0 p-0.5 text-[#9AA0AC] hover:text-[#CF4400] border-none bg-transparent cursor-pointer"
            title={`Copy ${label}`}
          >
            <Copy size={11} />
          </button>
        )}
      </div>
    </div>
  );
}
