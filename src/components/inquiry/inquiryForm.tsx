import React, { useCallback, useEffect, useState } from 'react';
import { CheckCircle2, AlertCircle, RefreshCw } from 'lucide-react';
import {
  operationsApi,
  type InquiryOptions,
  type InquiryPayload,
} from '../../services/operationsApi';
import { useGlobalState } from '../../context/GlobalStateContext';

/* Shared building blocks for the public business-inquiry forms. Each page keeps
   its own fields/layout; this only owns options loading, submit state, error
   mapping, the honeypot and the success panel. */

let optionsCache: InquiryOptions | null = null;

export function useInquiryOptions() {
  const [options, setOptions] = useState<InquiryOptions | null>(optionsCache);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(!optionsCache);

  const load = useCallback(() => {
    setLoading(true);
    setError(null);
    operationsApi
      .getInquiryOptions()
      .then((o) => {
        optionsCache = o;
        setOptions(o);
      })
      .catch(() => setError('We could not load the form options. Please try again.'))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!optionsCache) load();
  }, [load]);

  return { options, loading, error, retry: load };
}

type SubmitStatus = 'idle' | 'submitting' | 'success' | 'error';

export function useInquirySubmit() {
  const [status, setStatus] = useState<SubmitStatus>('idle');
  const [referenceId, setReferenceId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const submit = async (payload: InquiryPayload) => {
    setStatus('submitting');
    setError(null);
    setFieldErrors({});
    try {
      const result = await operationsApi.submitInquiry({
        ...payload,
        sourcePath: typeof window !== 'undefined' ? window.location.pathname : undefined,
      });
      setReferenceId(result.referenceId);
      setStatus('success');
    } catch (err) {
      const e = err as Error & { status?: number; fieldErrors?: Record<string, string> };
      if (e.fieldErrors && Object.keys(e.fieldErrors).length) {
        setFieldErrors(e.fieldErrors);
        setError('Please check the highlighted fields.');
      } else if (e.status === 429) {
        setError('Too many submissions from your connection. Please wait a little and try again.');
      } else if (!e.status) {
        setError('We could not reach Choosify. Check your connection and try again — your details are still in the form.');
      } else {
        setError('Something went wrong on our side and your request was not sent. Please try again in a moment.');
      }
      setStatus('error');
    }
  };

  const reset = () => {
    setStatus('idle');
    setReferenceId(null);
    setError(null);
    setFieldErrors({});
  };

  /** Drop a field's server error once the user edits it (and the summary once none remain). */
  const clearFieldError = (field: string) => {
    if (!fieldErrors[field]) return;
    const next = { ...fieldErrors };
    delete next[field];
    setFieldErrors(next);
    if (Object.keys(next).length === 0) setError(null);
  };

  return { status, referenceId, error, fieldErrors, submit, reset, clearFieldError, submitting: status === 'submitting' };
}

/** Name/email of the signed-in user, for prefilling. The server links the account from the session, never from these fields. */
export function useSignedInContact() {
  const { isLoggedIn, currentUser } = useGlobalState();
  if (!isLoggedIn || !currentUser || currentUser.id === 'guest') return { name: '', email: '' };
  return { name: currentUser.name || '', email: currentUser.email || '' };
}

/** Off-screen field bots tend to fill; hidden from people and assistive tech. */
export function InquiryHoneypot({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <div aria-hidden="true" style={{ position: 'absolute', left: '-10000px', top: 'auto', width: 1, height: 1, overflow: 'hidden' }}>
      <label>
        Company fax
        <input type="text" name="company_fax" tabIndex={-1} autoComplete="off" value={value} onChange={(e) => onChange(e.target.value)} />
      </label>
    </div>
  );
}

export function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="mt-1 text-[11px] font-semibold text-red-600">{message}</p>;
}

export function InquiryFormError({ message }: { message: string | null }) {
  if (!message) return null;
  return (
    <div role="alert" className="flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-[12px] font-semibold text-red-700">
      <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
      <span>{message}</span>
    </div>
  );
}

export function InquiryOptionsError({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-3 text-[12px] font-semibold text-amber-800">
      <p>{message}</p>
      <button type="button" onClick={onRetry} className="mt-2 inline-flex items-center gap-1.5 text-navy underline">
        <RefreshCw className="w-3.5 h-3.5" /> Try again
      </button>
    </div>
  );
}

/** Same visual as the pages' original success card, now driven by a real server response. */
export function InquirySuccessPanel({
  title = 'Request received',
  subtitle,
  referenceId,
  body,
  resetLabel,
  onReset,
}: {
  title?: string;
  subtitle?: string;
  referenceId: string | null;
  body: string;
  resetLabel: string;
  onReset: () => void;
}) {
  return (
    <div role="status" className="py-12 px-2 text-center flex flex-col items-center justify-center space-y-6">
      <div className="w-16 h-16 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-500 flex items-center justify-center">
        <CheckCircle2 className="w-8 h-8" />
      </div>
      <div>
        <h3 className="text-base font-extrabold text-[#1A1A2E] tracking-tight mb-1">{title}</h3>
        {subtitle ? <p className="text-gray-400 text-[10px] uppercase font-bold tracking-wider">{subtitle}</p> : null}
      </div>
      {referenceId ? (
        <div className="rounded-lg border border-gray-200 bg-gray-50 px-4 py-2">
          <div className="text-[9px] uppercase font-bold tracking-wider text-gray-400">Your reference</div>
          <div className="font-mono text-sm font-extrabold text-navy">{referenceId}</div>
        </div>
      ) : null}
      <p className="text-gray-500 text-xs leading-relaxed font-semibold max-w-sm">{body}</p>
      <button
        type="button"
        onClick={onReset}
        className="px-6 py-2.5 bg-navy hover:bg-orange-primary text-white text-[9px] font-black uppercase tracking-widest rounded-lg transition-colors border-none cursor-pointer"
      >
        {resetLabel}
      </button>
    </div>
  );
}

export const inquiryInputClass =
  'w-full p-3 bg-gray-50/50 border border-gray-200 rounded-[5px] outline-none text-navy focus:border-orange-primary transition-colors font-medium';
export const inquiryLabelClass = 'block text-[10px] uppercase tracking-wider text-navy font-bold';
