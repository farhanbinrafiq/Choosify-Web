import React, { useState } from 'react';
import { BadgeCheck, Loader2, ShieldCheck, X } from 'lucide-react';
import { operationsApi } from '../../services/operationsApi';
import { toast } from '../../lib/notify';
import type { BookingOfferCard } from '../../types/serviceBooking';

export function BookingPaymentModal({
  offer,
  onClose,
  onPaid,
}: {
  offer: BookingOfferCard;
  onClose: () => void;
  onPaid: () => void;
}) {
  const [isPaying, setIsPaying] = useState(false);
  const canPartialPay = Boolean(offer.partialPaymentEnabled && offer.depositPercent);
  const depositAmount = canPartialPay
    ? Math.round((offer.price * offer.depositPercent!) / 100)
    : 0;
  const [paymentType, setPaymentType] = useState<'full' | 'partial'>('full');

  const handlePay = async () => {
    setIsPaying(true);
    try {
      await operationsApi.payBookingRequest(offer.requestId, offer.orderId, paymentType);
      toast.success(
        paymentType === 'partial'
          ? `Deposit paid — "${offer.listingTitle}" booking is confirmed. Rest due at check-in.`
          : `Payment confirmed — "${offer.listingTitle}" booking is locked in.`,
      );
      onPaid();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Payment failed. Please try again.');
    } finally {
      setIsPaying(false);
    }
  };

  const payingNow = paymentType === 'partial' ? depositAmount : offer.price;

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div
        className="relative w-full max-w-sm rounded-2xl bg-white shadow-2xl overflow-hidden text-left"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-[#E8EDF2] px-5 py-4">
          <h3 className="text-sm font-extrabold text-[#1A1A2E]">Pay &amp; Confirm Booking</h3>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:bg-gray-100 hover:text-[#1A1A2E] transition-colors cursor-pointer"
          >
            <X size={16} />
          </button>
        </div>

        <div className="px-5 py-4 space-y-4">
          {offer.autoApproved && (
            <div className="flex items-start gap-2.5 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2.5">
              <BadgeCheck size={16} className="text-emerald-600 shrink-0 mt-0.5" />
              <p className="text-[11px] font-semibold text-emerald-700 leading-relaxed">
                {offer.sellerName} has pre-approved instant booking — your request is already
                accepted. Complete payment below to confirm.
              </p>
            </div>
          )}

          <div className="flex gap-3">
            {offer.listingImage && (
              <img
                src={offer.listingImage}
                alt=""
                className="w-14 h-14 rounded-lg object-cover border border-[#E8EDF2] shrink-0"
              />
            )}
            <div className="min-w-0">
              <p className="text-xs font-bold text-[#1A1A2E] truncate">{offer.listingTitle}</p>
              <p className="text-[10px] text-[#9AA0AC]">{offer.sellerName}</p>
            </div>
          </div>

          {canPartialPay && (
            <div className="space-y-2">
              <span className="text-[10px] font-bold text-[#9AA0AC] uppercase tracking-wide">
                Payment option
              </span>
              <button
                type="button"
                onClick={() => setPaymentType('full')}
                className={`w-full flex items-center justify-between gap-3 rounded-xl border px-3.5 py-2.5 text-left transition-colors cursor-pointer ${
                  paymentType === 'full' ? 'border-[#FF5B00] bg-[#FF5B00]/5' : 'border-[#E8EDF2] bg-white'
                }`}
              >
                <span className="text-[11.5px] font-bold text-[#1A1A2E]">Pay in full</span>
                <span className="text-[12.5px] font-extrabold text-[#FF5B00]">
                  BDT {offer.price.toLocaleString()}
                </span>
              </button>
              <button
                type="button"
                onClick={() => setPaymentType('partial')}
                className={`w-full flex items-center justify-between gap-3 rounded-xl border px-3.5 py-2.5 text-left transition-colors cursor-pointer ${
                  paymentType === 'partial' ? 'border-[#FF5B00] bg-[#FF5B00]/5' : 'border-[#E8EDF2] bg-white'
                }`}
              >
                <span className="min-w-0">
                  <span className="block text-[11.5px] font-bold text-[#1A1A2E]">
                    Pay {offer.depositPercent}% deposit now
                  </span>
                  <span className="block text-[9.5px] text-[#9AA0AC]">
                    Rest (BDT {(offer.price - depositAmount).toLocaleString()}) due at check-in
                  </span>
                </span>
                <span className="text-[12.5px] font-extrabold text-[#FF5B00] shrink-0">
                  BDT {depositAmount.toLocaleString()}
                </span>
              </button>
            </div>
          )}

          <div className="rounded-xl border border-[#E8EDF2] bg-[#F9FAFB] p-3.5 flex items-center justify-between">
            <span className="text-[11px] font-semibold text-[#4B5563]">
              {canPartialPay && paymentType === 'partial' ? 'Deposit due now' : 'Amount to pay'}
            </span>
            <span className="text-base font-extrabold text-[#FF5B00]">
              BDT {payingNow.toLocaleString()}
            </span>
          </div>

          <div className="flex items-center gap-2 text-[10px] text-[#9AA0AC]">
            <ShieldCheck size={13} className="text-emerald-600 shrink-0" />
            Secure payment — booking confirms instantly once paid.
          </div>
        </div>

        <div className="px-5 pb-5">
          <button
            type="button"
            onClick={handlePay}
            disabled={isPaying}
            className="w-full py-3 rounded-xl bg-[#FF5B00] hover:bg-[#EF3C23] disabled:opacity-60 text-white text-[12.5px] font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer border-0"
          >
            {isPaying ? (
              <>
                <Loader2 size={15} className="animate-spin" /> Processing payment…
              </>
            ) : (
              `Pay BDT ${payingNow.toLocaleString()} & Confirm`
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
