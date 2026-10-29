import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2, PauseCircle, Trash2 } from 'lucide-react';
import { toast } from '../../lib/notify';
import { getAccessToken } from '../../lib/authSession';
import { deactivateMyAccount, requestMyAccountDeletion } from '../../lib/authApi';
import { useGlobalState } from '../../context/GlobalStateContext';

const MIN_REASON = 10;
const DELETION_DAYS = 90;

type Mode = null | 'break' | 'delete';

/**
 * "Take a break" (inactive until you sign in again) and "Delete my account"
 * (inactive now, deleted after 90 days unless you sign in again). The server
 * enforces the same rules and ends every session.
 */
export default function AccountStatusSettings() {
  const navigate = useNavigate();
  const { logout } = useGlobalState();
  const [mode, setMode] = useState<Mode>(null);
  const [reason, setReason] = useState('');
  const [confirmed, setConfirmed] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const open = (next: Mode) => {
    setMode(next);
    setReason('');
    setConfirmed(false);
    setError(null);
  };

  const reasonOk = reason.trim().length >= MIN_REASON;
  const canSubmit = reasonOk && (mode === 'break' || confirmed) && !busy;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    setBusy(true);
    setError(null);
    try {
      const token = getAccessToken() || '';
      if (mode === 'delete') {
        await requestMyAccountDeletion(token, reason.trim());
        toast.success('Your deletion request was received. Your account is inactive and will be deleted in 90 days unless you sign in again.');
      } else {
        await deactivateMyAccount(token, reason.trim());
        toast.success('Your account is inactive. Sign in any time to come back.');
      }
      logout();
      navigate('/');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
      setBusy(false);
    }
  };

  return (
    <div className="rounded-[10px] border border-[#E8EDF2] bg-white p-6" data-testid="account-status-settings">
      <div className="mb-3 flex items-center gap-2">
        <span className="text-[#FF5B00]">
          <PauseCircle size={16} />
        </span>
        <h3 className="text-[13px] font-bold text-[#1A1A2E]">Account</h3>
      </div>

      {mode === null ? (
        <div className="space-y-4">
          <div>
            <p className="text-[13px] font-semibold text-[#1A1A2E]">Take a break</p>
            <p className="mt-1 text-[12.5px] leading-relaxed text-[#6B7280]">
              Make your account inactive. You&apos;ll be signed out everywhere. Sign in again whenever you&apos;re ready and
              everything will be just as you left it.
            </p>
            <button
              type="button"
              data-testid="account-take-break"
              onClick={() => open('break')}
              className="mt-2 inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-[12.5px] font-bold text-[#1A1A2E] transition-colors hover:bg-slate-50"
            >
              <PauseCircle size={14} /> Make my account inactive
            </button>
          </div>
          <div className="border-t border-slate-100 pt-4">
            <p className="text-[13px] font-semibold text-[#1A1A2E]">Delete my account</p>
            <p className="mt-1 text-[12.5px] leading-relaxed text-[#6B7280]">
              Your request will be reviewed and your account will be put in deletion. It stays inactive for{' '}
              {DELETION_DAYS} days and is then permanently deleted. Changed your mind? Just sign in again within{' '}
              {DELETION_DAYS} days and your account is active again.
            </p>
            <button
              type="button"
              data-testid="account-delete"
              onClick={() => open('delete')}
              className="mt-2 inline-flex items-center gap-2 rounded-xl border border-red-200 bg-white px-4 py-2 text-[12.5px] font-bold text-red-600 transition-colors hover:bg-red-50"
            >
              <Trash2 size={14} /> Delete my account
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={submit} className="space-y-4">
          <p className="text-[13px] font-semibold text-[#1A1A2E]">
            {mode === 'delete' ? 'Delete my account' : 'Make my account inactive'}
          </p>
          {error ? (
            <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-[12px] font-medium text-red-700">{error}</div>
          ) : null}
          <div className="space-y-1.5">
            <label htmlFor="account-status-reason" className="ml-1 text-[12px] font-semibold text-[#6B7280]">
              {mode === 'delete' ? 'Why are you leaving?' : 'Why are you taking a break?'}
            </label>
            <textarea
              id="account-status-reason"
              data-testid="account-status-reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={3}
              maxLength={1000}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-[13px] text-[#1A1A2E] outline-none transition-all focus:border-[#FF5B00]/40 focus:bg-white focus:ring-2 focus:ring-[#FF5B00]/15"
            />
            <p className="ml-1 text-[11px] text-[#9AA0AC]">
              {reasonOk ? 'Thanks — this helps us improve.' : `At least ${MIN_REASON} characters.`}
            </p>
          </div>
          {mode === 'delete' ? (
            <label className="flex items-start gap-2 text-[12.5px] leading-relaxed text-[#4B5563]">
              <input
                type="checkbox"
                data-testid="account-delete-confirm"
                checked={confirmed}
                onChange={(e) => setConfirmed(e.target.checked)}
                className="mt-1"
              />
              I understand my account will be inactive now and permanently deleted after {DELETION_DAYS} days unless I
              sign in again.
            </label>
          ) : null}
          <div className="flex gap-2">
            <button
              type="submit"
              data-testid="account-status-submit"
              disabled={!canSubmit}
              className={`inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-[12.5px] font-bold text-white transition-all hover:brightness-110 disabled:opacity-50 ${
                mode === 'delete' ? 'bg-red-600' : 'bg-[#1A1A2E]'
              }`}
            >
              {busy ? <Loader2 size={14} className="animate-spin" /> : null}
              {mode === 'delete' ? 'Submit deletion request' : 'Make inactive and sign out'}
            </button>
            <button
              type="button"
              onClick={() => open(null)}
              disabled={busy}
              className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-[12.5px] font-bold text-[#1A1A2E] hover:bg-slate-50"
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
