import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Loader2, RotateCcw, Send, Sparkles, X } from 'lucide-react';
import { cn } from '../lib/utils';
import { ChoosifyIconLogo } from './ChoosifyIconLogo';
import { useEmiChat } from '../hooks/useEmiChat';
import type { EmiCatalogPick } from '../lib/emiCatalogSearch';
import {
  floatingPanelDesktopClass,
  floatingPanelMobileClass,
  floatingPanelShellClass,
} from './FloatingPanelShell';

export const emiChatShellClass = cn(floatingPanelShellClass, 'text-[#1A1D4E]');
export const emiChatDesktopShellClass = cn(floatingPanelDesktopClass, 'w-[min(32rem,calc(100vw-2rem))]');
export const emiChatMobileShellClass = cn(floatingPanelMobileClass, 'max-h-[85vh]');

const SUGGESTED_PROMPTS = [
  'Phones under ৳30000',
  'Best deals today',
  'Formal wear brands',
  'What should I compare?',
];

function renderInlineMarkdown(text: string) {
  const parts = text.split(/(\*\*[^*]+\*\*|\[[^\]]+\]\([^)]+\))/g);
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return (
        <strong key={i} className="font-bold text-[#1A1D4E]">
          {part.slice(2, -2)}
        </strong>
      );
    }
    const linkMatch = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
    if (linkMatch) {
      const [, label, href] = linkMatch;
      const isInternal = href.startsWith('/');
      if (isInternal) {
        return (
          <Link key={i} to={href} className="text-[#E8500A] font-bold hover:underline">
            {label}
          </Link>
        );
      }
      return (
        <a key={i} href={href} className="text-[#E8500A] font-bold hover:underline" target="_blank" rel="noreferrer">
          {label}
        </a>
      );
    }
    return <React.Fragment key={i}>{part}</React.Fragment>;
  });
}

function PickCard({ pick }: { pick: EmiCatalogPick }) {
  if (pick.type === 'product') {
    return (
      <Link
        to={pick.url}
        className="flex items-center gap-2 p-2 rounded-lg border border-[#e8edf2] bg-white hover:border-[#E8500A]/35 transition-colors text-left"
      >
        <div className="min-w-0 flex-1">
          <p className="text-[10px] font-bold text-[#1A1D4E] truncate">{pick.title}</p>
          <p className="text-[9px] text-[#8a9bb0] truncate">
            {pick.brand || 'Product'}
            {pick.price != null ? ` · ৳${pick.price.toLocaleString()}` : ''}
          </p>
        </div>
        <ArrowRight size={12} className="text-[#E8500A] shrink-0" />
      </Link>
    );
  }
  if (pick.type === 'brand') {
    return (
      <Link
        to={pick.url}
        className="flex items-center gap-2 p-2 rounded-lg border border-[#e8edf2] bg-white hover:border-[#E8500A]/35 transition-colors text-left"
      >
        <p className="text-[10px] font-bold text-[#1A1D4E] truncate flex-1">{pick.name}</p>
        <ArrowRight size={12} className="text-[#E8500A] shrink-0" />
      </Link>
    );
  }
  return (
    <Link
      to={pick.url}
      className="flex items-center gap-2 p-2 rounded-lg border border-[#e8edf2] bg-white hover:border-[#E8500A]/35 transition-colors text-left"
    >
      <p className="text-[10px] font-bold text-[#1A1D4E] truncate flex-1">{pick.title}</p>
      <ArrowRight size={12} className="text-[#E8500A] shrink-0" />
    </Link>
  );
}

type EmiChatPanelProps = {
  onClose?: () => void;
  className?: string;
  variant?: 'panel' | 'page';
  seedPrompt?: string;
};

export function EmiChatPanel({ onClose, className, variant = 'panel', seedPrompt }: EmiChatPanelProps) {
  const { messages, isLoading, sendMessage, clearChat } = useEmiChat();
  const [draft, setDraft] = useState('');
  const chatRef = useRef<HTMLDivElement>(null);
  const seededRef = useRef<string | null>(null);

  useEffect(() => {
    if (!seedPrompt || seededRef.current === seedPrompt) return;
    seededRef.current = seedPrompt;
    void sendMessage(seedPrompt);
  }, [seedPrompt, sendMessage]);

  useEffect(() => {
    const el = chatRef.current;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
  }, [messages, isLoading]);

  const handleSend = () => {
    const text = draft.trim();
    if (!text) return;
    setDraft('');
    void sendMessage(text);
  };

  return (
    <div className={cn('flex flex-col min-h-0 h-full', className)}>
      <div className="px-4 sm:px-5 py-4 border-b border-[#e8edf2] flex items-center justify-between shrink-0 bg-gradient-to-r from-[#1A1D4E] to-[#252a6e] text-white gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shrink-0 shadow-lg p-1.5">
            <ChoosifyIconLogo size={28} />
          </div>
          <div className="min-w-0 text-left">
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-white/60 flex items-center gap-1">
              <Sparkles size={10} className="text-[#E8500A]" />
              Choosify Assistant
            </p>
            <h3 className="text-sm font-black uppercase tracking-wide truncate">Emi</h3>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={clearChat}
            className="text-[9px] font-black uppercase tracking-wider text-white/70 hover:text-white cursor-pointer border-0 bg-transparent px-1 flex items-center gap-1"
            title="Clear chat"
          >
            <RotateCcw size={11} />
            Clear
          </button>
          {onClose ? (
            <button
              type="button"
              onClick={onClose}
              className="w-8 h-8 rounded-full border border-white/20 hover:bg-white/10 flex items-center justify-center text-white transition-colors cursor-pointer"
              aria-label="Close Emi"
            >
              <X size={16} />
            </button>
          ) : null}
        </div>
      </div>

      <div ref={chatRef} className="flex-1 overflow-y-auto px-4 py-4 space-y-3 no-scrollbar min-h-0 bg-[#F8FAFC]">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={cn('flex flex-col gap-2 max-w-[95%]', msg.role === 'user' ? 'ml-auto items-end' : 'mr-auto items-start')}
          >
            <div
              className={cn(
                'rounded-2xl px-3.5 py-2.5 text-[12px] leading-relaxed whitespace-pre-wrap',
                msg.role === 'user'
                  ? 'bg-[#E8500A] text-white rounded-tr-sm'
                  : 'bg-white border border-[#e8edf2] text-[#1A1D4E] rounded-tl-sm shadow-sm',
              )}
            >
              {renderInlineMarkdown(msg.content)}
            </div>
            {msg.picks && msg.picks.length > 0 && msg.role === 'assistant' ? (
              <div className="w-full max-w-[280px] space-y-1.5">
                {msg.picks.slice(0, 4).map((pick, idx) => (
                  <PickCard key={`${pick.type}-${pick.id}-${idx}`} pick={pick} />
                ))}
              </div>
            ) : null}
          </div>
        ))}
        {isLoading ? (
          <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-[#8a9bb0]">
            <Loader2 size={14} className="animate-spin text-[#E8500A]" />
            Emi is thinking…
          </div>
        ) : null}
      </div>

      {messages.length <= 2 ? (
        <div className="px-4 py-2 border-t border-[#e8edf2] bg-white shrink-0 flex flex-wrap gap-1.5">
          {SUGGESTED_PROMPTS.map((prompt) => (
            <button
              key={prompt}
              type="button"
              onClick={() => void sendMessage(prompt)}
              disabled={isLoading}
              className="px-2.5 py-1 rounded-full text-[9px] font-bold uppercase tracking-wide border border-[#e8edf2] text-[#64748b] hover:border-[#E8500A]/40 hover:text-[#E8500A] bg-white cursor-pointer transition-colors disabled:opacity-50"
            >
              {prompt}
            </button>
          ))}
        </div>
      ) : null}

      <div className="p-3 border-t border-[#e8edf2] bg-white shrink-0 flex gap-2">
        <input
          type="text"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
          placeholder="Ask Emi anything about Choosify…"
          disabled={isLoading}
          className="flex-1 h-11 px-3 rounded-xl border border-[#e8edf2] text-xs outline-none focus:border-[#E8500A]/40 disabled:opacity-60"
        />
        <button
          type="button"
          onClick={handleSend}
          disabled={!draft.trim() || isLoading}
          className="h-11 w-11 rounded-xl bg-[#E8500A] hover:bg-[#CF4400] text-white flex items-center justify-center disabled:opacity-40 cursor-pointer border-0 shrink-0"
          aria-label="Send to Emi"
        >
          <Send size={15} />
        </button>
      </div>

      {variant === 'panel' ? (
        <div className="px-4 py-2.5 border-t border-[#e8edf2] bg-[#F8FAFC] shrink-0">
          <Link
            to="/emi"
            onClick={onClose}
            className="text-[9px] font-black uppercase tracking-wider text-[#8a9bb0] hover:text-[#E8500A] flex items-center justify-center gap-1"
          >
            Open full Emi chat <ArrowRight size={10} />
          </Link>
        </div>
      ) : null}
    </div>
  );
}
