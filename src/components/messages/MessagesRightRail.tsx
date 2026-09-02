import React from 'react';
import { Link } from 'react-router-dom';
import type { MessageThread, ThreadMessage } from '../../context/DashboardContext';
import type { Order, SubOrder } from '../../types/schemas';
import type { AnnouncementAssociatedEntity } from '../../lib/announcements';
import { Package, User, Link2, Copy, Flag } from 'lucide-react';
import { toast } from '../../lib/notify';
import { MessagesDynamicContentRail } from './MessagesDynamicContentRail';

type MessagesRightRailProps = {
  activeThread?: MessageThread | null;
  linkedOrder?: Order | null;
  linkedSubOrder?: SubOrder | null;
  isAnnouncementsThread?: boolean;
  isEmiThread?: boolean;
  /** Focused announcement message (or latest with entity) */
  focusedAnnouncement?: ThreadMessage | null;
  /** Emi: entities from the focused / latest assistant reply with picks */
  emiEntities?: AnnouncementAssociatedEntity[] | null;
  emiExcerpt?: string | null;
  conversationClosed?: boolean;
  onViewOrder?: () => void;
  onReportProblem?: () => void;
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

/** Derives the buyer-seller info fields shared by the desktop rail and mobile info sheet. */
export function resolveBuyerSellerInfo(
  activeThread?: MessageThread | null,
  linkedOrder?: Order | null,
  linkedSubOrder?: SubOrder | null,
) {
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

  const sellerName = linkedSubOrder?.sellerBusinessName || activeThread?.title || 'Seller';
  const sellerInitials =
    sellerName
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((w) => w[0]?.toUpperCase() ?? '')
      .join('') || 'S';

  return {
    orderId,
    invoiceId,
    orderDate,
    paymentMethod,
    orderStatus,
    totalAmount,
    sellerName,
    sellerInitials,
  };
}

/**
 * Buyer–seller: Transaction details + Support shortcuts.
 * Announcements + Emi: shared dynamic content panel (products / brands / deals / guides).
 */
export function MessagesRightRail({
  activeThread,
  linkedOrder,
  linkedSubOrder,
  isAnnouncementsThread,
  isEmiThread,
  focusedAnnouncement,
  emiEntities,
  emiExcerpt,
  conversationClosed,
  onViewOrder,
  onReportProblem,
}: MessagesRightRailProps) {
  if (isAnnouncementsThread) {
    const entity = focusedAnnouncement?.associatedEntity;
    return (
      <MessagesDynamicContentRail
        mode="announcement"
        entities={entity ? [entity] : []}
        excerpt={focusedAnnouncement?.text}
        onReportProblem={onReportProblem}
      />
    );
  }

  if (isEmiThread) {
    return (
      <MessagesDynamicContentRail
        mode="emi"
        entities={emiEntities}
        excerpt={emiExcerpt}
        onReportProblem={onReportProblem}
      />
    );
  }

  const {
    orderId,
    invoiceId,
    orderDate,
    paymentMethod,
    orderStatus,
    totalAmount,
    sellerName,
    sellerInitials,
  } = resolveBuyerSellerInfo(activeThread, linkedOrder, linkedSubOrder);

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
      <BuyerSellerInfoPanel
        activeThread={activeThread}
        linkedOrder={linkedOrder}
        orderId={orderId}
        invoiceId={invoiceId}
        orderDate={orderDate}
        paymentMethod={paymentMethod}
        orderStatus={orderStatus}
        totalAmount={totalAmount}
        sellerName={sellerName}
        sellerInitials={sellerInitials}
        conversationClosed={conversationClosed}
        onViewOrder={onViewOrder}
        onReportProblem={onReportProblem}
      />
    </aside>
  );
}

/** Shared buyer-seller info content — desktop rail + mobile bottom sheet. */
export function BuyerSellerInfoPanel({
  activeThread,
  linkedOrder,
  orderId,
  invoiceId,
  orderDate,
  paymentMethod,
  orderStatus,
  totalAmount,
  sellerName,
  sellerInitials,
  conversationClosed,
  onViewOrder,
  onReportProblem,
}: {
  activeThread: MessageThread;
  linkedOrder?: Order | null;
  orderId: string;
  invoiceId: string;
  orderDate: string;
  paymentMethod: string;
  orderStatus: string;
  totalAmount: string;
  sellerName: string;
  sellerInitials: string;
  conversationClosed?: boolean;
  onViewOrder?: () => void;
  onReportProblem?: () => void;
}) {
  return (
    <>
      {/* Transaction details */}
      <div>
        <div className="flex items-center gap-1.5 text-[11px] font-extrabold text-[#1A1A2E] mb-3">
          <Package size={12} className="text-[#FF5B00]" />
          Transaction details
        </div>
        <div className="flex flex-col gap-3 text-[11px]">
          <DetailRow
            label="Order ID"
            value={orderId}
            onCopy={() => copyText('Order ID', orderId)}
          />
          <DetailRow
            label="Invoice"
            value={invoiceId}
            onCopy={() => copyText('Invoice', invoiceId)}
          />
          <DetailRow label="Order date" value={orderDate} />
          <DetailRow label="Payment method" value={paymentMethod} />
          <DetailRow label="Status" value={orderStatus} />
          <DetailRow label="Total" value={totalAmount} valueClassName="text-[#FF5B00]" />
        </div>
        {linkedOrder && onViewOrder && (
          <button
            type="button"
            onClick={onViewOrder}
            className="mt-3 w-full min-h-[36px] rounded-lg border border-[#E5E7EB] bg-white text-[11px] font-bold text-[#1A1A2E] hover:border-[#FF5B00] hover:text-[#EF3C23] cursor-pointer"
          >
            View order tracking →
          </button>
        )}
      </div>

      {/* Seller profile */}
      <div>
          <div className="flex items-center gap-1.5 text-[11px] font-extrabold text-[#1A1A2E] mb-3">
            <User size={12} className="text-[#FF5B00]" />
            Seller profile
          </div>
          <div className="flex items-center gap-2.5 mb-3">
            {activeThread.avatar ? (
              <img
                src={activeThread.avatar}
                alt=""
                className="w-10 h-10 rounded-full object-cover border border-[#E8EDF2]"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-[#FFF3EC] text-[#FF5B00] flex items-center justify-center text-[12px] font-extrabold">
                {sellerInitials}
              </div>
            )}
            <div className="min-w-0">
              <div className="text-[12.5px] font-extrabold text-[#1A1A2E] truncate">
                {sellerName}
              </div>
              <div className="text-[10.5px] text-[#9AA0AC]">
                {activeThread.type === 'retail' ? 'Verified seller' : 'Conversation partner'}
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2 text-[10.5px]">
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
            className="block w-full mt-3 bg-white border border-[#E5E7EB] text-[#1A1A2E] text-center py-2 rounded-lg text-[11px] font-bold hover:border-[#FF5B00] hover:text-[#EF3C23] transition-colors"
          >
            Browse brands →
          </Link>
        </div>

      {/* Support shortcuts */}
      <div>
        <div className="flex items-center gap-1.5 text-[11px] font-extrabold text-[#1A1A2E] mb-3">
          <Link2 size={12} className="text-[#FF5B00]" />
          Support shortcuts
        </div>
        <div className="flex flex-col gap-2">
          {onReportProblem && (
            <button
              type="button"
              onClick={onReportProblem}
              className="flex justify-between items-center text-[11.5px] text-[#4B5563] hover:text-[#EF3C23] transition-colors bg-transparent border-none cursor-pointer p-0 text-left"
            >
              <span className="inline-flex items-center gap-1.5">
                <Flag size={11} className="text-[#FF5B00]" />
                Report to Support
                {conversationClosed ? ' (closed chat)' : ''}
              </span>
              <span className="text-[#9AA0AC]">›</span>
            </button>
          )}
          {SHORTCUTS.map((s) => (
            <Link
              key={s.to}
              to={s.to}
              className="flex justify-between items-center text-[11.5px] text-[#4B5563] hover:text-[#EF3C23] transition-colors"
            >
              {s.label}
              <span className="text-[#9AA0AC]">›</span>
            </Link>
          ))}
        </div>
      </div>
    </>
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
            className="shrink-0 p-0.5 text-[#9AA0AC] hover:text-[#EF3C23] border-none bg-transparent cursor-pointer"
            title={`Copy ${label}`}
          >
            <Copy size={11} />
          </button>
        )}
      </div>
    </div>
  );
}
