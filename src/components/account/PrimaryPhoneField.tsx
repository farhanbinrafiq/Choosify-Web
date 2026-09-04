import React, { useEffect, useRef, useState } from 'react';
import { Phone, Loader2, Trash2, Pencil, Check } from 'lucide-react';
import { toast } from '../../lib/notify';
import { getAccessToken } from '../../lib/authSession';
import { ApiError, deletePrimaryPhone, fetchAccountOverview, updatePrimaryPhone } from '../../lib/authApi';

/** `+8801712345678` -> `+880 1712-345678` (display only). */
function formatForDisplay(e164: string | null | undefined): string {
  if (!e164) return '';
  const m = /^\+880(1\d)(\d{3})(\d{4})$/.exec(e164);
  if (m) return `+880 ${m[1]}${m[2]}-${m[3]}`;
  return e164;
}

/** Lightweight client-side sanity check — the server is authoritative. */
function looksPlausible(local: string): boolean {
  const digits = local.replace(/\D/g, '');
  if (/^01\d{9}$/.test(digits)) return true; // BD local
  if (digits.startsWith('880')) return /^8801[3-9]\d{8}$/.test(digits);
  return digits.length >= 8 && digits.length <= 15; // international, server validates
}

type Mode = 'view' | 'edit' | 'confirm-delete';

export default function PrimaryPhoneField() {
  const [loading, setLoading] = useState(true);
  const [phone, setPhone] = useState<string | null>(null);
  const [mode, setMode] = useState<Mode>('view');
  const [draft, setDraft] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    let alive = true;
    (async () => {
      const token = getAccessToken();
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const data = await fetchAccountOverview(token);
        if (alive) setPhone(data?.phone ?? null);
      } catch {
        /* leave as null */
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  useEffect(() => {
    if (mode === 'edit') inputRef.current?.focus();
  }, [mode]);

  const startAdd = () => {
    setDraft('');
    setError('');
    setMode('edit');
  };
  const startEdit = () => {
    // Pre-fill the local BD form when possible, else the raw E.164.
    setDraft(phone && phone.startsWith('+880') ? `0${phone.slice(4)}` : phone || '');
    setError('');
    setMode('edit');
  };

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    if (busy) return;
    setError('');
    if (!looksPlausible(draft)) {
      setError('Enter a valid phone number, e.g. 01XXXXXXXXX.');
      return;
    }
    setBusy(true);
    try {
      const res = await updatePrimaryPhone(getAccessToken() || '', draft.trim());
      setPhone(res.phone);
      setMode('view');
      toast.success('Phone number saved.');
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Could not save your phone number.');
    } finally {
      setBusy(false);
    }
  };

  const remove = async () => {
    if (busy) return;
    setBusy(true);
    try {
      await deletePrimaryPhone(getAccessToken() || '');
      setPhone(null);
      setMode('view');
      toast.success('Phone number removed.');
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Could not remove your phone number.');
      setMode('view');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="space-y-2">
      <label className="ml-1 text-[12px] font-semibold tracking-tight text-[#9AA0AC]">Phone Number</label>

      {loading ? (
        <div className="flex h-12 items-center gap-2 rounded-2xl border border-slate-200/60 bg-slate-50 px-5 text-[12px] text-[#9AA0AC]">
          <Loader2 size={14} className="animate-spin" /> Loading…
        </div>
      ) : mode === 'edit' ? (
        <form onSubmit={save} className="space-y-2">
          <div className="flex items-stretch gap-2">
            <span className="flex items-center rounded-2xl border border-slate-200/60 bg-slate-100 px-3 text-[12px] font-bold text-[#6B7280]">
              +880
            </span>
            <div className="relative flex-1">
              <Phone size={14} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#9AA0AC]" />
              <input
                ref={inputRef}
                inputMode="tel"
                autoComplete="tel"
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                placeholder="01XXXXXXXXX"
                maxLength={20}
                className="h-12 w-full rounded-2xl border border-slate-200/60 bg-slate-50 pl-9 pr-4 text-xs font-bold text-[#1a1a2e] outline-none transition-all focus:border-[#FF5B00]/40 focus:bg-white focus:ring-2 focus:ring-[#FF5B00]/10"
              />
            </div>
          </div>
          {error ? <p className="ml-1 text-[11px] font-semibold text-rose-500">{error}</p> : null}
          <div className="flex gap-2">
            <button
              type="submit"
              disabled={busy}
              className="inline-flex items-center gap-1.5 rounded-xl bg-[#FF5B00] px-4 py-2 text-[12px] font-bold text-white transition-all hover:brightness-110 disabled:opacity-60"
            >
              {busy ? <Loader2 size={13} className="animate-spin" /> : <Check size={13} />} Save
            </button>
            <button
              type="button"
              onClick={() => {
                setMode('view');
                setError('');
              }}
              disabled={busy}
              className="rounded-xl px-3 py-2 text-[12px] font-bold text-[#6B7280] transition-colors hover:bg-slate-100"
            >
              Cancel
            </button>
          </div>
        </form>
      ) : mode === 'confirm-delete' ? (
        <div className="rounded-2xl border border-rose-100 bg-rose-50/60 p-4">
          <p className="text-[12.5px] font-bold text-[#1A1A2E]">Remove phone number?</p>
          <p className="mt-1 text-[11.5px] leading-relaxed text-[#6B7280]">
            This number will be removed from your Choosify account. Existing orders will not be changed.
          </p>
          <div className="mt-3 flex gap-2">
            <button
              type="button"
              onClick={remove}
              disabled={busy}
              className="inline-flex items-center gap-1.5 rounded-xl bg-rose-600 px-4 py-2 text-[12px] font-bold text-white transition-all hover:brightness-110 disabled:opacity-60"
            >
              {busy ? <Loader2 size={13} className="animate-spin" /> : <Trash2 size={13} />} Remove
            </button>
            <button
              type="button"
              onClick={() => setMode('view')}
              disabled={busy}
              className="rounded-xl px-3 py-2 text-[12px] font-bold text-[#6B7280] transition-colors hover:bg-white"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : phone ? (
        <div className="flex items-center justify-between gap-3 rounded-2xl border border-slate-200/60 bg-white px-5 py-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-[#1a1a2e]">{formatForDisplay(phone)}</span>
            <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-[#6B7280]">
              Primary
            </span>
          </div>
          <div className="flex gap-1">
            <button
              type="button"
              onClick={startEdit}
              className="inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-[11px] font-bold text-[#1A1A2E] transition-colors hover:bg-slate-100"
            >
              <Pencil size={12} /> Edit
            </button>
            <button
              type="button"
              onClick={() => setMode('confirm-delete')}
              className="inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-[11px] font-bold text-rose-600 transition-colors hover:bg-rose-50"
            >
              <Trash2 size={12} /> Delete
            </button>
          </div>
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50/60 px-5 py-4">
          <p className="text-[12px] font-bold text-[#1A1A2E]">No phone number added</p>
          <p className="mt-0.5 text-[11.5px] text-[#9AA0AC]">Add a primary phone number for your Choosify account.</p>
          <button
            type="button"
            onClick={startAdd}
            className="mt-2.5 inline-flex items-center gap-1.5 rounded-xl bg-[#FF5B00] px-4 py-2 text-[12px] font-bold text-white transition-all hover:brightness-110"
          >
            <Phone size={13} /> Add phone number
          </button>
        </div>
      )}
    </div>
  );
}
