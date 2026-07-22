import React, { useEffect, useState } from 'react';
import { Flag, X } from 'lucide-react';
import { toast } from '../../lib/notify';
import { operationsApi } from '../../services/operationsApi';

type ReportConversationProblemModalProps = {
  open: boolean;
  onClose: () => void;
  conversationId?: string;
  orderId?: string;
  bookingRef?: string;
  sellerId?: string;
  sellerName?: string;
  buyerId: string;
  userName: string;
};

export function ReportConversationProblemModal({
  open,
  onClose,
  conversationId,
  orderId,
  bookingRef,
  sellerId,
  sellerName,
  buyerId,
  userName,
}: ReportConversationProblemModalProps) {
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const orderOrBooking = orderId || bookingRef || '';
  const sellerLabel = [sellerName, sellerId ? `(${sellerId})` : null]
    .filter(Boolean)
    .join(' ')
    .trim();

  useEffect(() => {
    if (open) setDescription('');
  }, [open, conversationId]);

  if (!open) return null;

  const handleSubmit = async () => {
    if (!description.trim()) {
      toast.error('Please describe the issue.');
      return;
    }
    setSubmitting(true);
    try {
      await operationsApi.submitPlatformMessage({
        buyerId,
        userName,
        orderId: orderId || undefined,
        conversationId,
        sellerId,
        isComplaint: true,
        body: [
          'Support complaint',
          '',
          description.trim(),
          '',
          `Conversation ID: ${conversationId || 'n/a'}`,
          `Order / booking number: ${orderOrBooking || 'n/a'}`,
          `Seller: ${sellerLabel || 'n/a'}`,
          sellerId ? `Seller ID: ${sellerId}` : null,
          bookingRef && bookingRef !== orderId ? `Booking ref: ${bookingRef}` : null,
        ]
          .filter(Boolean)
          .join('\n'),
      });
      toast.success('Report submitted to Choosify support. This does not reopen the seller chat.');
      setDescription('');
      onClose();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Could not submit report.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center p-4">
      <button
        type="button"
        className="absolute inset-0 bg-black/40 border-0 cursor-pointer"
        aria-label="Close"
        onClick={onClose}
      />
      <div className="relative w-full max-w-md bg-white rounded-2xl border border-[#E8EDF2] shadow-xl p-5 space-y-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#EB4501]/10 border border-[#EB4501]/20 flex items-center justify-center shrink-0">
              <Flag size={16} className="text-[#EB4501]" />
            </div>
            <div>
              <h3 className="text-[15px] font-extrabold text-[#1A1A2E]">Report to Support</h3>
              <p className="text-[12px] text-[#9AA0AC] mt-0.5 leading-snug">
                Sends a complaint to Choosify support staff. It does not reopen this conversation.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-lg border border-[#E8EDF2] flex items-center justify-center text-[#9AA0AC] cursor-pointer bg-white"
          >
            <X size={16} />
          </button>
        </div>

        <div className="space-y-1.5">
          <label className="text-[11px] font-bold text-[#9AA0AC]" htmlFor="support-issue">
            Issue description
          </label>
          <textarea
            id="support-issue"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            placeholder="Describe what went wrong…"
            className="w-full bg-[#F4F7F9] border border-[#E8EDF2] rounded-lg p-3 text-[12.5px] font-medium text-[#1A1A2E] resize-y"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-[11px] font-bold text-[#9AA0AC]" htmlFor="support-order">
            Order / booking number
          </label>
          <input
            id="support-order"
            value={orderOrBooking || '—'}
            readOnly
            className="w-full h-10 bg-[#EEF2F7] border border-[#E8EDF2] rounded-lg px-3 text-[12.5px] font-semibold text-[#1A1A2E]"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-[11px] font-bold text-[#9AA0AC]" htmlFor="support-seller">
            Seller information
          </label>
          <input
            id="support-seller"
            value={sellerLabel || '—'}
            readOnly
            className="w-full h-10 bg-[#EEF2F7] border border-[#E8EDF2] rounded-lg px-3 text-[12.5px] font-semibold text-[#1A1A2E]"
          />
        </div>

        <div className="text-[11px] text-[#9AA0AC] leading-snug bg-[#F4F7F9] rounded-lg px-3 py-2">
          Conversation ID: {conversationId || '—'}
        </div>

        <div className="flex gap-2 justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 text-[12.5px] font-bold rounded-lg border border-[#E8EDF2] bg-white text-[#1A1A2E] cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={submitting}
            onClick={() => void handleSubmit()}
            className="px-4 py-2.5 text-[12.5px] font-bold rounded-lg border-0 bg-[#EB4501] text-white cursor-pointer disabled:opacity-60"
          >
            {submitting ? 'Submitting…' : 'Submit'}
          </button>
        </div>
      </div>
    </div>
  );
}
