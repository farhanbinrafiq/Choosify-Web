import React from 'react';
import { Bell, MessageCircleMore, Loader2, AlertTriangle, RefreshCw } from 'lucide-react';
import type { AppNotification } from '../../services/notificationApi';
import { cn } from '../../lib/utils';

/** Deterministic source attribution — routing is by canonical `category`/`type`
 *  metadata, never by sniffing message text, so a seller can never spoof
 *  "Choosify" / an official system notification. */
function sourceLabel(n: AppNotification): string {
  if (n.category === 'seller' || n.category === 'creator') {
    const from = typeof n.metadata?.sourceName === 'string' ? n.metadata.sourceName : null;
    return from || (n.category === 'seller' ? 'Seller update' : 'Creator update');
  }
  return 'Choosify · System';
}

function formatTimestamp(iso: string): string {
  try {
    const d = new Date(iso);
    const now = new Date();
    const sameDay = d.toDateString() === now.toDateString();
    const datePart = sameDay
      ? 'Today'
      : d.toLocaleDateString('en-BD', { month: 'short', day: 'numeric' });
    const timePart = d.toLocaleTimeString('en-BD', { hour: '2-digit', minute: '2-digit' });
    return `${datePart} · ${timePart}`;
  } catch {
    return '';
  }
}

export function NotificationsChannel({
  items,
  loading,
  error,
  onOpen,
  onMarkAllRead,
  onRefresh,
}: {
  items: AppNotification[];
  loading: boolean;
  error: string | null;
  onOpen: (n: AppNotification) => void;
  onMarkAllRead: () => void;
  onRefresh: () => void;
}) {
  const hasUnread = items.some((n) => !n.read);

  return (
    <div className="flex-1 min-h-0 flex flex-col bg-choosify-feed">
      <div className="px-5 py-3 bg-white border-b border-[#E8EDF2] flex items-center justify-between gap-3 shrink-0">
        <p className="text-[11px] text-[#9AA0AC] font-medium">
          Order, refund, account and campaign updates — official system channel.
        </p>
        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={onRefresh}
            disabled={loading}
            className="flex items-center gap-1 text-[11px] font-bold text-[#6B7280] hover:text-[#1A1A2E] bg-transparent border-none cursor-pointer disabled:opacity-50"
          >
            <RefreshCw size={12} className={cn(loading && 'animate-spin')} /> Refresh
          </button>
          {hasUnread && (
            <button
              type="button"
              onClick={onMarkAllRead}
              className="text-[11px] font-bold text-[#FF5B00] hover:underline bg-transparent border-none cursor-pointer"
            >
              Mark all as read
            </button>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-5 space-y-3 no-scrollbar">
        {loading && items.length === 0 ? (
          <div className="py-24 flex items-center justify-center text-[#9AA0AC]">
            <Loader2 size={20} className="animate-spin mr-2" /> Loading notifications…
          </div>
        ) : error ? (
          <div className="py-14 flex flex-col items-center text-center text-rose-500 bg-rose-50/40 border border-dashed border-rose-200 rounded-lg">
            <AlertTriangle size={24} className="mb-2" />
            <p className="text-[12px] font-medium mb-2">{error}</p>
            <button
              type="button"
              onClick={onRefresh}
              className="text-[11px] font-bold border border-rose-200 rounded-full px-3 py-1.5 bg-transparent cursor-pointer"
            >
              Try again
            </button>
          </div>
        ) : items.length === 0 ? (
          <div className="py-24 flex flex-col items-center text-center text-[#9AA0AC]">
            <Bell size={48} className="mb-4 text-[#CBD5E1]" />
            <p className="text-[13px] font-bold text-[#4B5563]">No notifications yet.</p>
            <p className="text-[11.5px] mt-1 max-w-xs leading-relaxed">
              Important account, order and platform updates will appear here.
            </p>
          </div>
        ) : (
          items.map((n) => (
            <button
              key={n.id}
              type="button"
              onClick={() => onOpen(n)}
              className={cn(
                'w-full text-left bg-white border rounded-xl p-4 flex items-start gap-3.5 transition-all hover:bg-[#F9FAFB] cursor-pointer relative overflow-hidden',
                !n.read ? 'border-[#FF5B00]/30 bg-[#FFF8F4]' : 'border-[#E8EDF2]',
              )}
            >
              {!n.read && <span className="absolute left-0 top-0 bottom-0 w-1 bg-[#FF5B00]" />}
              <div
                className={cn(
                  'w-10 h-10 rounded-lg flex items-center justify-center shrink-0',
                  n.category === 'seller' || n.category === 'creator'
                    ? 'bg-[#059669]/10 text-[#059669]'
                    : 'bg-[#FF5B00]/12 text-[#FF5B00]',
                )}
              >
                {n.type.includes('message') ? <MessageCircleMore size={19} /> : <Bell size={19} />}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2 mb-0.5">
                  <span className="text-[9.5px] font-black uppercase tracking-wide text-[#9AA0AC]">
                    {sourceLabel(n)}
                  </span>
                  <span className="text-[9.5px] text-[#9AA0AC] shrink-0">{formatTimestamp(n.createdAt)}</span>
                </div>
                <h4 className="text-[13px] font-bold text-[#1A1A2E] leading-snug">{n.title}</h4>
                {n.summary && (
                  <p className="text-[12px] text-[#4B5563] leading-relaxed mt-0.5">{n.summary}</p>
                )}
                {n.actionUrl && (
                  <span
                    onClick={(e) => {
                      e.stopPropagation();
                      onOpen(n);
                    }}
                    className="inline-block mt-1.5 text-[11.5px] font-bold text-[#FF5B00] hover:underline"
                  >
                    View →
                  </span>
                )}
              </div>
            </button>
          ))
        )}
      </div>
    </div>
  );
}
