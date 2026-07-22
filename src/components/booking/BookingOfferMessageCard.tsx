import React, { useEffect, useMemo, useState } from 'react';
import { Check, Clock3, ExternalLink, MessageSquare, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { BookingOfferCard } from '../../types/serviceBooking';

function formatRemaining(deadline?: string): string {
  if (!deadline) return '';
  const remaining = new Date(deadline).getTime() - Date.now();
  if (remaining <= 0) return 'Expired';
  const hours = Math.floor(remaining / 3_600_000);
  const minutes = Math.floor((remaining % 3_600_000) / 60_000);
  return `${hours}h ${minutes}m remaining`;
}

const STATUS_STYLE: Record<string, string> = {
  pending: 'bg-amber-50 text-amber-700 border-amber-200',
  accepted: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  buyer_accepted: 'bg-blue-50 text-blue-700 border-blue-200',
  confirmed: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  paid: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  declined: 'bg-red-50 text-red-700 border-red-200',
  buyer_declined: 'bg-red-50 text-red-700 border-red-200',
  countered: 'bg-violet-50 text-violet-700 border-violet-200',
  expired: 'bg-slate-100 text-slate-600 border-slate-200',
  payment_expired: 'bg-slate-100 text-slate-600 border-slate-200',
};

export function BookingOfferMessageCard({
  offer,
  onAccept,
  onDecline,
}: {
  offer: BookingOfferCard;
  onAccept?: () => void;
  onDecline?: () => void;
}) {
  const [, tick] = useState(0);
  useEffect(() => {
    const timer = window.setInterval(() => tick((value) => value + 1), 60_000);
    return () => window.clearInterval(timer);
  }, []);

  const deadline =
    offer.status === 'accepted' || offer.status === 'buyer_accepted'
      ? offer.buyerPayBy
      : offer.sellerRespondBy;
  const remaining = formatRemaining(deadline);
  const statusText = offer.status.replace(/_/g, ' ');
  const details = useMemo(
    () => Object.entries(offer.fields).filter(([key]) => key !== 'notes'),
    [offer.fields],
  );
  const canRespond = offer.status === 'countered' || offer.status === 'accepted';

  return (
    <div className="w-full max-w-sm overflow-hidden rounded-[10px] border border-[#E8EDF2] bg-white text-left shadow-sm">
      <div className="flex items-center justify-between gap-2 border-b border-[#E8EDF2] bg-[#F4F7F9] px-4 py-2.5">
        <span className="flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-wider text-[#9AA0AC]">
          <MessageSquare size={11} className="text-[#EB4501]" />
          {offer.isService ? 'Booking request' : 'Product request'} · v{offer.version}
        </span>
        <span
          className={`rounded-md border px-2 py-0.5 text-[9px] font-bold capitalize ${
            STATUS_STYLE[offer.status] ?? STATUS_STYLE.pending
          }`}
        >
          {statusText}
        </span>
      </div>

      <div className="flex gap-3 p-4">
        {offer.listingImage ? (
          <img
            src={offer.listingImage}
            alt=""
            className="h-16 w-16 shrink-0 rounded-lg border border-[#E8EDF2] object-cover"
          />
        ) : null}
        <div className="min-w-0 flex-1">
          <h4 className="mb-1 text-xs font-bold leading-tight text-[#1A1A2E]">
            {offer.listingTitle}
          </h4>
          <p className="text-[10px] font-medium text-[#9AA0AC]">{offer.sellerName}</p>
          <p className="mt-2 text-sm font-extrabold text-[#EB4501]">
            BDT {offer.price.toLocaleString()}
          </p>
          {offer.originalPrice && offer.originalPrice !== offer.price ? (
            <p className="text-[9px] text-[#9AA0AC] line-through">
              BDT {offer.originalPrice.toLocaleString()}
            </p>
          ) : null}
        </div>
      </div>

      <div className="border-t border-[#E8EDF2] px-4 py-3">
        <dl className="grid grid-cols-2 gap-x-3 gap-y-2">
          {details.map(([key, value]) => (
            <div key={key} className="min-w-0">
              <dt className="truncate text-[9px] font-bold capitalize text-[#9AA0AC]">
                {key.replace(/([A-Z])/g, ' $1')}
              </dt>
              <dd className="truncate text-[10px] font-semibold text-[#1A1A2E]">
                {String(value)}
              </dd>
            </div>
          ))}
        </dl>
        {offer.notes ? (
          <div className="mt-3 rounded-lg border border-[#E8EDF2] bg-[#F9FAFB] p-2.5">
            <span className="text-[9px] font-bold text-[#9AA0AC]">Notes</span>
            <p className="mt-0.5 text-[10px] font-medium text-[#4B5563]">
              {offer.notes}
            </p>
          </div>
        ) : null}
        {offer.declineReason ? (
          <div className="mt-3 rounded-lg border border-red-200 bg-red-50 p-2.5">
            <span className="text-[9px] font-bold text-red-600">Seller’s reason</span>
            <p className="mt-0.5 text-[10px] font-medium text-red-700">
              {offer.declineReason}
            </p>
          </div>
        ) : null}
      </div>

      {remaining ? (
        <div className="flex items-center gap-1.5 border-t border-[#E8EDF2] bg-amber-50/60 px-4 py-2 text-[10px] font-bold text-amber-700">
          <Clock3 size={12} />
          {remaining}
        </div>
      ) : null}

      <div className="flex flex-wrap justify-end gap-2 border-t border-[#E8EDF2] bg-[#F4F7F9] p-3">
        {canRespond && onDecline ? (
          <button
            type="button"
            onClick={onDecline}
            className="inline-flex items-center gap-1 rounded-lg border border-red-200 bg-white px-3 py-1.5 text-[9px] font-bold text-red-600"
          >
            <X size={10} /> Decline
          </button>
        ) : null}
        {canRespond && onAccept ? (
          <button
            type="button"
            onClick={onAccept}
            className="inline-flex items-center gap-1 rounded-lg border-0 bg-emerald-600 px-3 py-1.5 text-[9px] font-bold text-white"
          >
            <Check size={10} /> Accept offer
          </button>
        ) : null}
        <Link
          to={offer.listingHref}
          className="inline-flex items-center gap-1 rounded-lg border border-[#E5E7EB] bg-white px-3 py-1.5 text-[9px] font-bold text-[#4B5563]"
        >
          View listing <ExternalLink size={10} />
        </Link>
      </div>
    </div>
  );
}
