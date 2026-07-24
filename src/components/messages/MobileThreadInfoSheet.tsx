import React from 'react';
import { X } from 'lucide-react';
import { BuyerSellerInfoPanel, resolveBuyerSellerInfo } from './MessagesRightRail';
import type { MessageThread } from '../../context/DashboardContext';
import type { Order, SubOrder } from '../../types/schemas';

type MobileThreadInfoSheetProps = {
  open: boolean;
  onClose: () => void;
  activeThread: MessageThread;
  linkedOrder?: Order | null;
  linkedSubOrder?: SubOrder | null;
  conversationClosed?: boolean;
  onViewOrder?: () => void;
  onReportProblem?: () => void;
};

/** WhatsApp-style contact-info bottom sheet — mobile fallback for the xl+ right rail. */
export function MobileThreadInfoSheet({
  open,
  onClose,
  activeThread,
  linkedOrder,
  linkedSubOrder,
  conversationClosed,
  onViewOrder,
  onReportProblem,
}: MobileThreadInfoSheetProps) {
  if (!open) return null;

  const info = resolveBuyerSellerInfo(activeThread, linkedOrder, linkedSubOrder);

  return (
    <div className="xl:hidden fixed inset-0 z-[100] flex items-end justify-center" role="dialog" aria-modal="true">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} aria-hidden="true" />
      <div className="relative w-full max-h-[85vh] bg-white rounded-t-2xl shadow-2xl flex flex-col overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3.5 border-b border-[#E8EDF2] shrink-0">
          <h2 className="text-[13.5px] font-extrabold text-[#1A1A2E]">Conversation info</h2>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#F4F7F9] flex items-center justify-center text-[#4B5563] border-none cursor-pointer"
            aria-label="Close"
          >
            <X size={16} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-5">
          <BuyerSellerInfoPanel
            activeThread={activeThread}
            linkedOrder={linkedOrder}
            conversationClosed={conversationClosed}
            onViewOrder={onViewOrder}
            onReportProblem={onReportProblem}
            {...info}
          />
        </div>
      </div>
    </div>
  );
}
