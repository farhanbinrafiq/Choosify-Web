import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import type { MessageThread, ThreadMessage } from '../../context/DashboardContext';
import type { Order, SubOrder } from '../../types/schemas';
import {
  entityTypeLabel,
  type AnnouncementAssociatedEntity,
} from '../../lib/announcements';
import { PRODUCTS, PLACEHOLDER_IMAGE } from '../../constants';
import { Package, User, Link2, Copy, Flag, Megaphone, ExternalLink } from 'lucide-react';
import { toast } from '../../lib/notify';

type MessagesRightRailProps = {
  activeThread?: MessageThread | null;
  linkedOrder?: Order | null;
  linkedSubOrder?: SubOrder | null;
  isAnnouncementsThread?: boolean;
  /** Focused announcement message (or latest with entity) */
  focusedAnnouncement?: ThreadMessage | null;
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

function resolveEntityDisplay(entity: AnnouncementAssociatedEntity) {
  if (entity.type === 'product' || entity.type === 'service') {
    const product = PRODUCTS.find((p) => String(p.id) === String(entity.id));
    if (product) {
      return {
        title: entity.title || product.title,
        subtitle:
          entity.subtitle ||
          [product.brand, product.category].filter(Boolean).join(' · ') ||
          entityTypeLabel(entity.type),
        image: entity.image || product.image || PLACEHOLDER_IMAGE,
        href: entity.href || `/products/${product.id}`,
        ctaLabel: entity.ctaLabel || 'View product',
        meta:
          product.price != null
            ? `৳${String(product.price).replace(/^\৳/, '')}`
            : undefined,
      };
    }
  }

  return {
    title: entity.title || `${entityTypeLabel(entity.type)} ${entity.id}`,
    subtitle: entity.subtitle || entityTypeLabel(entity.type),
    image: entity.image || PLACEHOLDER_IMAGE,
    href:
      entity.href ||
      (entity.type === 'guide'
        ? `/guides/${entity.id}`
        : entity.type === 'campaign'
          ? '/deals'
          : entity.type === 'brand'
            ? `/brands/${entity.id}`
            : entity.type === 'order'
              ? '/order-tracking'
              : '#'),
    ctaLabel:
      entity.ctaLabel ||
      (entity.type === 'guide'
        ? 'Open guide'
        : entity.type === 'campaign'
          ? 'View campaign'
          : entity.type === 'brand'
            ? 'View brand'
            : entity.type === 'order'
              ? 'Track order'
              : 'Open'),
    meta: undefined as string | undefined,
  };
}

function AnnouncementsRightRail({
  focusedAnnouncement,
  onReportProblem,
}: {
  focusedAnnouncement?: ThreadMessage | null;
  onReportProblem?: () => void;
}) {
  const entity = focusedAnnouncement?.associatedEntity;
  const display = useMemo(
    () => (entity ? resolveEntityDisplay(entity) : null),
    [entity],
  );

  return (
    <aside className="hidden xl:flex w-[260px] shrink-0 flex-col border-l border-[#E8EDF2] bg-white p-[18px] gap-5 overflow-y-auto min-h-0">
      <div>
        <div className="flex items-center gap-1.5 text-[11px] font-extrabold text-[#1A1A2E] mb-3">
          <Megaphone size={12} className="text-[#EB4501]" />
          Related to this announcement
        </div>

        {!entity || !display ? (
          <div className="rounded-[10px] border border-dashed border-[#E8EDF2] bg-[#F4F7F9] p-4 text-[11.5px] text-[#9AA0AC] leading-relaxed">
            Select an announcement in the thread to see the related product, guide, or campaign here.
          </div>
        ) : (
          <div className="rounded-[10px] border border-[#E8EDF2] overflow-hidden bg-white">
            <div className="aspect-[4/3] bg-[#F4F7F9] relative overflow-hidden">
              <img
                src={display.image}
                alt=""
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.src = PLACEHOLDER_IMAGE;
                }}
              />
              <span className="absolute top-2 left-2 text-[9px] font-extrabold uppercase tracking-wide px-2 py-0.5 rounded-md bg-white/95 text-[#EB4501] border border-[#EB4501]/20">
                {entityTypeLabel(entity.type)}
              </span>
            </div>
            <div className="p-3.5 space-y-2">
              <div>
                <h3 className="text-[13px] font-extrabold text-[#1A1A2E] leading-snug">
                  {display.title}
                </h3>
                {display.subtitle ? (
                  <p className="text-[11px] text-[#9AA0AC] mt-0.5">{display.subtitle}</p>
                ) : null}
              </div>
              {display.meta ? (
                <p className="text-[14px] font-extrabold text-[#EB4501] tabular-nums">
                  {display.meta}
                </p>
              ) : null}
              <Link
                to={display.href}
                className="inline-flex w-full items-center justify-center gap-1.5 min-h-[38px] px-3 rounded-lg bg-[#EB4501] text-white text-[11.5px] font-bold no-underline hover:brightness-110"
              >
                {display.ctaLabel}
                <ExternalLink size={12} />
              </Link>
            </div>
          </div>
        )}
      </div>

      {focusedAnnouncement?.text ? (
        <div>
          <div className="text-[11px] font-extrabold text-[#1A1A2E] mb-2">Announcement</div>
          <p className="text-[11.5px] text-[#4B5563] leading-relaxed whitespace-pre-line line-clamp-8">
            {focusedAnnouncement.text}
          </p>
        </div>
      ) : null}

      <div className="mt-auto pt-2 border-t border-[#E8EDF2] space-y-3">
        {onReportProblem && (
          <button
            type="button"
            onClick={onReportProblem}
            className="w-full inline-flex items-center justify-center gap-1.5 min-h-[38px] px-3 rounded-lg border border-[#E8EDF2] bg-white text-[11.5px] font-bold text-[#1A1A2E] hover:border-[#EB4501] hover:text-[#CF4400] cursor-pointer"
          >
            <Flag size={12} className="text-[#EB4501]" />
            Report to Support
          </button>
        )}
        <p className="text-[10.5px] text-[#9AA0AC] leading-relaxed">
          Click an announcement to update this panel with related content.
        </p>
      </div>
    </aside>
  );
}

/**
 * Buyer–seller: Transaction details + Support shortcuts.
 * Announcements: dynamic entity card for the focused announcement message.
 */
export function MessagesRightRail({
  activeThread,
  linkedOrder,
  linkedSubOrder,
  isAnnouncementsThread,
  focusedAnnouncement,
  conversationClosed,
  onViewOrder,
  onReportProblem,
}: MessagesRightRailProps) {
  if (isAnnouncementsThread) {
    return (
      <AnnouncementsRightRail
        focusedAnnouncement={focusedAnnouncement}
        onReportProblem={onReportProblem}
      />
    );
  }

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
            label="Invoice"
            value={invoiceId}
            onCopy={() => copyText('Invoice', invoiceId)}
          />
          <DetailRow label="Order date" value={orderDate} />
          <DetailRow label="Payment method" value={paymentMethod} />
          <DetailRow label="Status" value={orderStatus} />
          <DetailRow label="Total" value={totalAmount} valueClassName="text-[#EB4501]" />
        </div>
        {linkedOrder && onViewOrder && (
          <button
            type="button"
            onClick={onViewOrder}
            className="mt-3 w-full min-h-[36px] rounded-lg border border-[#E5E7EB] bg-white text-[11px] font-bold text-[#1A1A2E] hover:border-[#EB4501] hover:text-[#CF4400] cursor-pointer"
          >
            View order tracking →
          </button>
        )}
      </div>

      {/* Seller profile */}
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
                className="w-10 h-10 rounded-full object-cover border border-[#E8EDF2]"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-[#FFF3EC] text-[#EB4501] flex items-center justify-center text-[12px] font-extrabold">
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
            className="block w-full mt-3 bg-white border border-[#E5E7EB] text-[#1A1A2E] text-center py-2 rounded-lg text-[11px] font-bold hover:border-[#EB4501] hover:text-[#CF4400] transition-colors"
          >
            Browse brands →
          </Link>
        </div>

      {/* Support shortcuts */}
      <div>
        <div className="flex items-center gap-1.5 text-[11px] font-extrabold text-[#1A1A2E] mb-3">
          <Link2 size={12} className="text-[#EB4501]" />
          Support shortcuts
        </div>
        <div className="flex flex-col gap-2">
          {onReportProblem && (
            <button
              type="button"
              onClick={onReportProblem}
              className="flex justify-between items-center text-[11.5px] text-[#4B5563] hover:text-[#CF4400] transition-colors bg-transparent border-none cursor-pointer p-0 text-left"
            >
              <span className="inline-flex items-center gap-1.5">
                <Flag size={11} className="text-[#EB4501]" />
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
