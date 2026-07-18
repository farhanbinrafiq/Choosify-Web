import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, MessageSquare, Send, X } from 'lucide-react';
import { cn } from '../lib/utils';
import { useDashboard, type MessageThread } from '../context/DashboardContext';
import {
  floatingPanelDesktopClass,
  floatingPanelMobileClass,
  floatingPanelShellClass,
} from './FloatingPanelShell';

export const messagesPreviewShellClass = cn(floatingPanelShellClass, 'text-[#1A1D4E]');
export const messagesPreviewDesktopShellClass = floatingPanelDesktopClass;
export const messagesPreviewMobileShellClass = cn(floatingPanelMobileClass, 'max-h-[82vh]');

type MessagesPreviewPanelProps = {
  onClose: () => void;
  className?: string;
};

export function MessagesPreviewPanel({ onClose, className }: MessagesPreviewPanelProps) {
  const navigate = useNavigate();
  const { threads, threadMessages, addThreadMessage, markAllAsRead, setThreads } = useDashboard();
  const [activeThreadId, setActiveThreadId] = useState<string | null>(null);
  const [draft, setDraft] = useState('');
  const chatRef = useRef<HTMLDivElement>(null);

  const sortedThreads = useMemo(
    () => [...threads].sort((a, b) => (a.unread === b.unread ? 0 : a.unread ? -1 : 1)),
    [threads],
  );

  const activeThread = sortedThreads.find((t) => t.id === activeThreadId) ?? sortedThreads[0] ?? null;
  const activeMessages = threadMessages.filter((m) => m.threadId === activeThread?.id);

  useEffect(() => {
    if (!activeThreadId && sortedThreads[0]) {
      setActiveThreadId(sortedThreads[0].id);
    }
  }, [activeThreadId, sortedThreads]);

  useEffect(() => {
    if (!activeThread?.id || !activeThread.unread) return;
    setThreads((prev) =>
      prev.map((t) => (t.id === activeThread.id ? { ...t, unread: false } : t)),
    );
  }, [activeThread?.id, activeThread?.unread, setThreads]);

  useEffect(() => {
    const el = chatRef.current;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
  }, [activeMessages, activeThread?.id]);

  const handleSend = () => {
    const text = draft.trim();
    if (!text || !activeThread) return;
    addThreadMessage(activeThread.id, text, 'user');
    setDraft('');
  };

  const openFullInbox = (thread?: MessageThread) => {
    onClose();
    navigate(thread ? `/messages/${thread.id}` : '/messages');
  };

  return (
    <div className={cn('flex flex-col min-h-0 h-full', className)}>
      <div className="px-4 sm:px-5 py-4 border-b border-[#e8edf2] flex items-center justify-between shrink-0 bg-white gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-9 h-9 rounded-full bg-[#FF5B00]/10 flex items-center justify-center text-[#FF5B00] shrink-0">
            <MessageSquare size={16} />
          </div>
          <div className="min-w-0 text-left">
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#8a9bb0]">
              Inbox preview
            </p>
            <h3 className="text-sm font-black uppercase tracking-wide text-[#1A1D4E] truncate">
              {sortedThreads.length} conversation{sortedThreads.length === 1 ? '' : 's'}
            </h3>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {threads.some((t) => t.unread) && (
            <button
              type="button"
              onClick={markAllAsRead}
              className="text-[9px] font-black uppercase tracking-wider text-[#FF5B00] hover:underline cursor-pointer border-0 bg-transparent px-1"
            >
              Mark all read
            </button>
          )}
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full border border-[#e8edf2] hover:border-[#FF5B00]/30 flex items-center justify-center text-[#8a9bb0] hover:text-[#FF5B00] transition-colors cursor-pointer"
            aria-label="Close messages"
          >
            <X size={16} />
          </button>
        </div>
      </div>

      <div className="flex flex-1 min-h-0">
        <div className="w-[38%] min-w-[120px] max-w-[160px] border-r border-[#e8edf2] overflow-y-auto no-scrollbar bg-[#F8FAFC]">
          {sortedThreads.map((thread) => (
            <button
              key={thread.id}
              type="button"
              onClick={() => setActiveThreadId(thread.id)}
              className={cn(
                'w-full text-left px-3 py-3 border-b border-[#e8edf2]/80 transition-colors cursor-pointer border-x-0 border-t-0',
                activeThread?.id === thread.id ? 'bg-white' : 'hover:bg-white/80',
              )}
            >
              <div className="flex items-start gap-2">
                <img
                  src={thread.avatar}
                  alt=""
                  className="w-8 h-8 rounded-full object-cover shrink-0 border border-[#e8edf2]"
                />
                <div className="min-w-0 flex-1">
                  <p className="text-[10px] font-bold text-[#1A1D4E] truncate">{thread.title}</p>
                  <p className="text-[9px] text-[#8a9bb0] truncate mt-0.5">{thread.lastMessage}</p>
                </div>
                {thread.unread && (
                  <span className="w-2 h-2 rounded-full bg-[#FF5B00] shrink-0 mt-1" />
                )}
              </div>
            </button>
          ))}
        </div>

        <div className="flex-1 flex flex-col min-w-0 min-h-0">
          {activeThread ? (
            <>
              <div className="px-4 py-2.5 border-b border-[#e8edf2] bg-white shrink-0 flex items-center justify-between gap-2">
                <p className="text-[10px] font-black uppercase tracking-wider text-[#1A1D4E] truncate">
                  {activeThread.title}
                </p>
                <button
                  type="button"
                  onClick={() => openFullInbox(activeThread)}
                  className="text-[9px] font-black uppercase tracking-wider text-[#FF5B00] flex items-center gap-1 shrink-0 cursor-pointer border-0 bg-transparent"
                >
                  Open <ArrowRight size={10} />
                </button>
              </div>

              <div ref={chatRef} className="flex-1 overflow-y-auto px-4 py-3 space-y-2.5 no-scrollbar min-h-0 bg-[#F8FAFC]">
                {activeMessages.length === 0 ? (
                  <p className="text-[10px] text-[#8a9bb0] text-center py-8 uppercase tracking-wider font-bold">
                    No messages yet — say hello
                  </p>
                ) : (
                  activeMessages.slice(-8).map((msg) => (
                    <div
                      key={msg.id}
                      className={cn(
                        'max-w-[92%] rounded-[10px] px-3 py-2 text-[11px] leading-relaxed',
                        msg.sender === 'user'
                          ? 'ml-auto bg-[#FFF3EC] border border-[#FFD9C2] text-[#1A1A2E]'
                          : 'mr-auto bg-white border border-[#E8EDF2] text-[#1A1D4E]',
                      )}
                    >
                      {msg.text}
                    </div>
                  ))
                )}
              </div>

              {!activeThread.readOnly && (
                <div className="p-3 border-t border-[#e8edf2] bg-white shrink-0 flex gap-2">
                  <input
                    type="text"
                    value={draft}
                    onChange={(e) => setDraft(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                    placeholder="Type a message…"
                    className="flex-1 h-10 px-3 rounded-lg border border-[#e8edf2] text-xs outline-none focus:border-[#FF5B00]/40"
                  />
                  <button
                    type="button"
                    onClick={handleSend}
                    disabled={!draft.trim()}
                    className="h-[42px] w-[42px] rounded-lg bg-[#FF5B00] hover:bg-[#E04E00] text-white flex items-center justify-center disabled:opacity-40 cursor-pointer border-0 shrink-0"
                    aria-label="Send message"
                  >
                    <Send size={14} />
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-[10px] font-bold uppercase tracking-wider text-[#8a9bb0]">
              No conversations
            </div>
          )}
        </div>
      </div>

      <div className="px-4 py-3 border-t border-[#e8edf2] bg-white shrink-0">
        <button
          type="button"
          onClick={() => openFullInbox()}
          className="w-full h-11 rounded-lg bg-[#1A1A2E] hover:bg-[#121528] text-white text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 cursor-pointer border-0"
        >
          Open full inbox
          <ArrowRight size={14} />
        </button>
      </div>
    </div>
  );
}
