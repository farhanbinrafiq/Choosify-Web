import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Check, CheckCheck, ExternalLink, Package } from 'lucide-react';
import { BookingOfferMessageCard } from '../booking/BookingOfferMessageCard';
import { PLACEHOLDER_IMAGE } from '../../constants';
import { CHOOSIFY_ANNOUNCEMENTS_TITLE } from '../../lib/announcements';
import { EntityCard } from './MessagesDynamicContentRail';
import type { ThreadMessage } from '../../context/DashboardContext';
import type { BookingOfferCard } from '../../types/serviceBooking';
import type { ManualOrderOfferCard } from '../../types/manualOrder';
import { cn } from '../../lib/utils';

export type MessageDeliveryStatus = 'sent' | 'delivered' | 'seen';

type MessageThreadExchangeProps = {
  messages: ThreadMessage[];
  /** True when this channel is Choosify Announcements (broadcast styling + focus). */
  isAnnouncementsThread?: boolean;
  focusedAnnouncementId?: number | null;
  onFocusAnnouncement?: (id: number) => void;
  currentUserAvatar?: string;
  peerAvatar?: string;
  /** Canonical id of the person viewing this thread. When a message carries
   *  its own `senderId`, ownership is decided by `senderId === currentUserId`
   *  — never by role/persona — so alignment is correct for a Seller/Creator/
   *  dual-capability account viewing ANY thread, Support included. */
  currentUserId?: string;
  /** Legacy fallback ONLY for messages with no `senderId` (older cached
   *  messages) — current viewer is the seller (outgoing = seller/admin-side
   *  sends). Default: buyer — outgoing = `user`. */
  viewerIsSeller?: boolean;
  onAcceptBookingOffer?: (offer: BookingOfferCard) => void;
  onDeclineBookingOffer?: (offer: BookingOfferCard) => void;
  onBookingOfferPaid?: (offer: BookingOfferCard) => void;
  onSellerRespondToOffer?: (offer: BookingOfferCard, action: 'accept' | 'decline' | 'counter') => void;
  showSellerBookingActions?: boolean;
  onWithdrawProductCard?: (message: ThreadMessage) => void;
  onAcceptProductCounter?: (message: ThreadMessage) => void;
  onDeclineProductCounter?: (message: ThreadMessage) => void;
  onAcceptOrderOffer?: (offer: ManualOrderOfferCard) => void;
  onRejectOrderOffer?: (offer: ManualOrderOfferCard) => void;
};

function isOutgoingForViewer(message: ThreadMessage, viewerIsSeller: boolean, currentUserId?: string): boolean {
  // Canonical path: compare the message's own sender identity to the viewer's
  // id. This is correct regardless of conversation type (buyer thread,
  // Support thread, ...), account role, or persona — a Seller/Creator/dual-
  // capability account viewing their OWN Support thread still resolves
  // correctly, which the role-based fallback below cannot do (Support
  // messages never carry sender:'seller'/'admin', only 'user'/'other').
  if (currentUserId && message.senderId) {
    return message.senderId === currentUserId;
  }
  // Fallback for a message with no senderId (older cached/local messages).
  if (viewerIsSeller) {
    return message.sender === 'seller' || message.sender === 'admin' || message.sender === 'creator';
  }
  return message.sender === 'user';
}

function resolveDeliveryStatus(
  messages: ThreadMessage[],
  message: ThreadMessage,
  index: number,
  viewerIsSeller: boolean,
  currentUserId?: string,
): MessageDeliveryStatus | null {
  if (!isOutgoingForViewer(message, viewerIsSeller, currentUserId)) return null;
  const laterPeerReply = messages.slice(index + 1).some((m) => !isOutgoingForViewer(m, viewerIsSeller, currentUserId));
  if (laterPeerReply) return 'seen';
  if (message.status === 'seen' || message.status === 'delivered' || message.status === 'sent') {
    return message.status;
  }
  return 'delivered';
}

function shouldShowTimeDivider(prev: ThreadMessage | undefined, curr: ThreadMessage): boolean {
  if (!prev) return Boolean(curr.time);
  if (prev.createdAt && curr.createdAt) {
    const gap = Math.abs(new Date(curr.createdAt).getTime() - new Date(prev.createdAt).getTime());
    return gap >= 15 * 60 * 1000;
  }
  return Boolean(prev.time && curr.time && prev.time !== curr.time);
}

function StatusLabel({ status }: { status: MessageDeliveryStatus }) {
  if (status === 'seen') {
    return (
      <span className="inline-flex items-center gap-0.5 text-[10px] font-medium text-[#FF5B00]">
        <CheckCheck size={12} strokeWidth={2.5} aria-hidden />
        Seen
      </span>
    );
  }
  if (status === 'delivered') {
    return (
      <span className="inline-flex items-center gap-0.5 text-[10px] font-medium text-[#9AA0AC]">
        <CheckCheck size={12} strokeWidth={2.25} aria-hidden />
        Delivered
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-0.5 text-[10px] font-medium text-[#9AA0AC]">
      <Check size={12} strokeWidth={2.25} aria-hidden />
      Sent
    </span>
  );
}

export function MessageThreadExchange({
  messages,
  isAnnouncementsThread = false,
  focusedAnnouncementId = null,
  onFocusAnnouncement,
  currentUserAvatar,
  peerAvatar,
  currentUserId,
  viewerIsSeller = false,
  onAcceptBookingOffer,
  onDeclineBookingOffer,
  onBookingOfferPaid,
  onSellerRespondToOffer,
  showSellerBookingActions = false,
  onWithdrawProductCard,
  onAcceptProductCounter,
  onDeclineProductCounter,
  onAcceptOrderOffer,
  onRejectOrderOffer,
}: MessageThreadExchangeProps) {
  const lastOutgoingId = useMemo(() => {
    for (let i = messages.length - 1; i >= 0; i -= 1) {
      if (isOutgoingForViewer(messages[i], viewerIsSeller, currentUserId)) return messages[i].id;
    }
    return null;
  }, [messages, viewerIsSeller, currentUserId]);

  if (messages.length === 0) {
    return (
      <div className="py-16 text-center text-[12.5px] font-medium text-[#9AA0AC]">
        No messages yet — say hello
      </div>
    );
  }

  return (
    <div className="space-y-1">
      {messages.map((m, index) => {
        const prev = index > 0 ? messages[index - 1] : undefined;
        const showDivider = shouldShowTimeDivider(prev, m);
        const isOutgoing = isOutgoingForViewer(m, viewerIsSeller, currentUserId);
        const isAnnouncementMessage = isAnnouncementsThread || m.sender === 'admin';
        const avatarSrc = isOutgoing
          ? currentUserAvatar || PLACEHOLDER_IMAGE
          : m.avatar || peerAvatar || PLACEHOLDER_IMAGE;
        const status = resolveDeliveryStatus(messages, m, index, viewerIsSeller, currentUserId);
        const showStatus = isOutgoing && m.id === lastOutgoingId && status && !isAnnouncementsThread;

        return (
          <React.Fragment key={m.id}>
            {showDivider && (
              <div className="flex items-center justify-center py-3" role="separator">
                <span className="px-3 py-1 rounded-full bg-[#E8EDF2]/80 text-[10px] font-semibold text-[#6B7280]">
                  {m.time}
                </span>
              </div>
            )}

            <div
              id={`msg-${m.id}`}
              role={isAnnouncementsThread ? 'button' : undefined}
              tabIndex={isAnnouncementsThread ? 0 : undefined}
              onClick={() => {
                if (isAnnouncementsThread) onFocusAnnouncement?.(m.id);
              }}
              onKeyDown={(e) => {
                if (!isAnnouncementsThread) return;
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  onFocusAnnouncement?.(m.id);
                }
              }}
              className={cn(
                'flex w-full gap-2.5',
                isOutgoing ? 'flex-row-reverse' : 'flex-row',
                isAnnouncementsThread &&
                  cn(
                    'cursor-pointer rounded-2xl p-0.5 transition-shadow',
                    focusedAnnouncementId === m.id
                      ? 'ring-2 ring-[#FF5B00]/35'
                      : 'hover:ring-1 hover:ring-[#E8EDF2]',
                  ),
              )}
            >
              <img
                src={avatarSrc}
                alt=""
                className="w-8 h-8 rounded-full object-cover shrink-0 border border-[#E8EDF2] bg-white mt-0.5"
                referrerPolicy="no-referrer"
              />

              <div
                className={cn(
                  'flex flex-col min-w-0 max-w-[min(85%,28rem)]',
                  isOutgoing ? 'items-end' : 'items-start',
                )}
              >
                {m.bookingOffer && (
                  <div className="mb-2 w-full max-w-sm">
                    <BookingOfferMessageCard
                      offer={m.bookingOffer}
                      onAccept={
                        m.bookingOffer.status === 'countered' || m.bookingOffer.status === 'accepted'
                          ? () => onAcceptBookingOffer?.(m.bookingOffer!)
                          : undefined
                      }
                      onDecline={
                        m.bookingOffer.status === 'countered' || m.bookingOffer.status === 'accepted'
                          ? () => onDeclineBookingOffer?.(m.bookingOffer!)
                          : undefined
                      }
                      onPaid={() => onBookingOfferPaid?.(m.bookingOffer!)}
                    />
                    {showSellerBookingActions && m.bookingOffer.status === 'pending' && onSellerRespondToOffer && (
                      <div className="mt-2 flex flex-wrap justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => onSellerRespondToOffer(m.bookingOffer!, 'decline')}
                          className="rounded-lg border border-red-200 bg-white px-3 py-1.5 text-[9px] font-bold text-red-600 cursor-pointer"
                        >
                          Decline
                        </button>
                        <button
                          type="button"
                          onClick={() => onSellerRespondToOffer(m.bookingOffer!, 'counter')}
                          className="rounded-lg border border-violet-200 bg-white px-3 py-1.5 text-[9px] font-bold text-violet-700 cursor-pointer"
                        >
                          Modify / Counter
                        </button>
                        <button
                          type="button"
                          onClick={() => onSellerRespondToOffer(m.bookingOffer!, 'accept')}
                          className="rounded-lg border-0 bg-emerald-600 px-3 py-1.5 text-[9px] font-bold text-white cursor-pointer"
                        >
                          Accept
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {m.orderOffer && (
                  <div className="w-full max-w-sm rounded-[14px] overflow-hidden border border-[#E8EDF2] mb-2 text-left bg-white shadow-sm">
                    <div className="px-4 py-2 border-b border-[#E8EDF2] flex items-center justify-between bg-[#F4F7F9]">
                      <span className="text-[9px] font-bold uppercase text-[#9AA0AC] tracking-wider flex items-center gap-1.5">
                        <Package size={11} className="text-[#FF5B00]" />
                        Order offer
                      </span>
                      <span
                        className={cn(
                          'px-2 py-0.5 text-[9px] font-bold rounded-md border',
                          m.orderOffer.status === 'pending' &&
                            'bg-amber-500/10 text-amber-600 border-amber-500/20',
                          m.orderOffer.status === 'accepted' &&
                            'bg-green-500/10 text-green-600 border-green-500/20',
                          m.orderOffer.status === 'rejected' &&
                            'bg-gray-400/10 text-gray-500 border-gray-400/20',
                        )}
                      >
                        {m.orderOffer.status === 'pending'
                          ? 'Awaiting response'
                          : m.orderOffer.status === 'accepted'
                            ? 'Accepted'
                            : 'Rejected'}
                      </span>
                    </div>

                    <div className="p-4 space-y-2">
                      {m.orderOffer.items.map((it, idx) => (
                        <div key={idx} className="flex gap-3 items-center">
                          <img
                            src={it.image || PLACEHOLDER_IMAGE}
                            className="w-12 h-12 rounded-lg object-cover shrink-0 border border-[#E8EDF2] bg-white"
                            alt=""
                            referrerPolicy="no-referrer"
                          />
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-bold text-[#1A1A2E] leading-tight line-clamp-1">
                              {it.productTitle}
                            </p>
                            <p className="text-[10px] text-[#9AA0AC] font-medium">
                              Qty {it.quantity} · ৳{it.price.toLocaleString()} each
                            </p>
                          </div>
                        </div>
                      ))}
                      {m.orderOffer.notes && (
                        <div className="bg-[#F4F7F9] border border-[#E8EDF2] rounded-lg p-2">
                          <span className="text-[9px] font-bold text-[#9AA0AC] block mb-0.5">Note</span>
                          <p className="text-[#4B5563] text-[11px] font-medium">{m.orderOffer.notes}</p>
                        </div>
                      )}
                    </div>

                    <div className="px-4 py-3 bg-[#F4F7F9]/80 border-t border-[#E8EDF2] text-[10px] flex items-center justify-between">
                      <span className="text-[#9AA0AC] font-medium">Total</span>
                      <span className="text-xs font-extrabold text-[#FF5B00]">
                        ৳{m.orderOffer.overallTotal.toLocaleString()}
                      </span>
                    </div>

                    {m.orderOffer.status === 'rejected' && m.orderOffer.rejectReason && (
                      <div className="px-4 py-2 bg-white border-t border-[#E8EDF2] text-[10px] text-[#9AA0AC]">
                        Reason: {m.orderOffer.rejectReason}
                      </div>
                    )}

                    {!viewerIsSeller && m.orderOffer.status === 'pending' && (
                      <div className="p-3 bg-[#F4F7F9] border-t border-[#E8EDF2] flex justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => onRejectOrderOffer?.(m.orderOffer!)}
                          className="px-3 py-1.5 bg-white hover:bg-[#F4F7F9] text-[#4B5563] border border-[#E5E7EB] rounded-lg text-[9px] font-bold transition-all cursor-pointer"
                        >
                          Reject
                        </button>
                        <button
                          type="button"
                          onClick={() => onAcceptOrderOffer?.(m.orderOffer!)}
                          className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[9px] font-bold transition-all cursor-pointer border-none"
                        >
                          Accept
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {m.productCard && (
                  <div className="w-full max-w-sm rounded-[14px] overflow-hidden border border-[#E8EDF2] mb-2 text-left bg-white shadow-sm">
                    <div className="px-4 py-2 border-b border-[#E8EDF2] flex items-center justify-between bg-[#F4F7F9]">
                      <span className="text-[9px] font-bold uppercase text-[#9AA0AC] tracking-wider flex items-center gap-1.5">
                        <Package size={11} className="text-[#FF5B00]" />
                        Sourcing request
                      </span>
                      {(() => {
                        const statusLabel = m.productCard.status || 'pending';
                        if (statusLabel === 'pending') {
                          return (
                            <span className="px-2 py-0.5 text-[9px] font-bold bg-amber-500/10 text-amber-600 rounded-md border border-amber-500/20">
                              Draft
                            </span>
                          );
                        }
                        if (statusLabel === 'approved') {
                          return (
                            <span className="px-2 py-0.5 text-[9px] font-bold bg-green-500/10 text-green-600 rounded-md border border-green-500/20">
                              Approved
                            </span>
                          );
                        }
                        if (statusLabel === 'countered') {
                          return (
                            <span className="px-2 py-0.5 text-[9px] font-bold bg-blue-500/10 text-blue-600 rounded-md border border-blue-500/20">
                              Counter offer
                            </span>
                          );
                        }
                        return (
                          <span className="px-2 py-0.5 text-[9px] font-bold bg-gray-400/10 text-gray-500 rounded-md border border-gray-400/20">
                            Withdrawn
                          </span>
                        );
                      })()}
                    </div>

                    <div className="p-4 flex gap-3 items-start">
                      <img
                        src={m.productCard.image || PLACEHOLDER_IMAGE}
                        className="w-16 h-16 rounded-lg object-cover shrink-0 border border-[#E8EDF2] bg-white"
                        alt=""
                        referrerPolicy="no-referrer"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="text-xs font-bold text-[#1A1A2E] leading-tight mb-1 line-clamp-2">
                          {m.productCard.name}
                        </h4>
                        <div className="text-[10px] text-[#9AA0AC] font-medium space-y-0.5">
                          <p>
                            Variant:{' '}
                            <span className="text-[#1A1A2E] font-bold">{m.productCard.variant}</span>
                          </p>
                          <p>
                            Color:{' '}
                            <span className="text-[#1A1A2E] font-bold">{m.productCard.color}</span>
                          </p>
                          <p>
                            Qty:{' '}
                            <span className="text-[#FF5B00] font-bold">{m.productCard.quantity}</span>
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="px-4 py-3 bg-[#F4F7F9]/80 border-t border-[#E8EDF2] text-[10px]">
                      {m.productCard.notes && (
                        <div className="mb-2 bg-white border border-[#E8EDF2] rounded-lg p-2">
                          <span className="text-[9px] font-bold text-[#9AA0AC] block mb-0.5">Memo</span>
                          <p className="text-[#4B5563] font-medium">&ldquo;{m.productCard.notes}&rdquo;</p>
                        </div>
                      )}
                      <div className="flex items-center justify-between pt-1 border-t border-dashed border-[#E5E7EB]">
                        <span className="text-[#9AA0AC] font-medium text-[9px]">Estimated total</span>
                        <div className="text-right">
                          {m.productCard.status === 'countered' && (
                            <span className="text-[9px] font-medium line-through text-[#9AA0AC] mr-2 block">
                              ৳{(m.productCard.price * m.productCard.quantity).toLocaleString()}
                            </span>
                          )}
                          <span className="text-xs font-extrabold text-[#FF5B00] block">
                            ৳
                            {(
                              (m.productCard.counterPrice || m.productCard.price) *
                              m.productCard.quantity
                            ).toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="p-3 bg-[#F4F7F9] border-t border-[#E8EDF2] flex flex-col gap-2">
                      <div className="w-full flex flex-wrap gap-1.5 justify-end">
                        {(m.productCard.status || 'pending') === 'pending' && (
                          <button
                            type="button"
                            onClick={() => onWithdrawProductCard?.(m)}
                            className="px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 rounded-lg text-[9px] font-bold transition-all cursor-pointer"
                          >
                            Withdraw
                          </button>
                        )}
                        {m.productCard.status === 'countered' && (
                          <>
                            <button
                              type="button"
                              onClick={() => onAcceptProductCounter?.(m)}
                              className="px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white rounded-lg text-[9px] font-bold transition-all cursor-pointer border-none"
                            >
                              Accept counter
                            </button>
                            <button
                              type="button"
                              onClick={() => onDeclineProductCounter?.(m)}
                              className="px-3 py-1.5 bg-white hover:bg-[#F4F7F9] text-[#4B5563] border border-[#E5E7EB] rounded-lg text-[9px] font-bold transition-all cursor-pointer"
                            >
                              Decline
                            </button>
                          </>
                        )}
                      </div>
                      <div className="flex justify-end pt-1.5 border-t border-[#E8EDF2]">
                        <Link
                          to={m.productCard.link}
                          className="px-3 py-1.5 bg-white hover:bg-[#FFF3EC] text-[#4B5563] hover:text-[#EF3C23] border border-[#E5E7EB] text-[9px] font-bold rounded-lg transition-all flex items-center gap-1.5"
                        >
                          View product <ExternalLink size={10} />
                        </Link>
                      </div>
                    </div>
                  </div>
                )}

                {m.text?.trim() ? (
                  <div
                    className={cn(
                      'px-3.5 py-2.5 text-[13px] font-medium leading-relaxed whitespace-pre-line break-words',
                      isOutgoing
                        ? 'bg-[#FF5B00] text-white rounded-[18px] rounded-br-md'
                        : isAnnouncementMessage
                          ? 'bg-white text-[#1A1A2E] border border-[#E8EDF2] rounded-[18px] rounded-bl-md shadow-sm'
                          : 'bg-[#F1F1F3] text-[#1A1A2E] rounded-[18px] rounded-bl-md',
                    )}
                  >
                    {!isOutgoing && isAnnouncementMessage && (
                      <span className="block text-[10px] font-bold text-[#9AA0AC] mb-1">
                        {CHOOSIFY_ANNOUNCEMENTS_TITLE}
                      </span>
                    )}
                    {m.text}
                  </div>
                ) : null}

                {isAnnouncementMessage && m.associatedEntity && (
                  <div className="xl:hidden w-full max-w-sm mt-2" onClick={(e) => e.stopPropagation()}>
                    <EntityCard entity={m.associatedEntity} />
                  </div>
                )}

                {showStatus && status ? (
                  <div className="mt-1 px-1">
                    <StatusLabel status={status} />
                  </div>
                ) : null}
              </div>
            </div>
          </React.Fragment>
        );
      })}
    </div>
  );
}
