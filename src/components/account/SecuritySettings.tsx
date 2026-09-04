import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Lock, Eye, EyeOff, Mail, ShieldCheck, X, Loader2, CheckCircle2, KeyRound, BadgeCheck } from 'lucide-react';
import { toast } from '../../lib/notify';
import { getAccessToken, persistAuthToken } from '../../lib/authSession';
import {
  ApiError,
  changePassword,
  fetchAccountOverview,
  requestLocalPasswordOtp,
  setLocalPassword,
  verifyLocalPasswordOtp,
  type AuthMeResponse,
} from '../../lib/authApi';

const PROVIDER_LABEL: Record<string, string> = { google: 'Google', facebook: 'Facebook' };

const MIN_LEN = 8;
const MAX_LEN = 128;
const CODE_TTL_SECONDS = 600;
const RESEND_COOLDOWN_SECONDS = 60;

/** Local, display-only mask — the server independently masks the address it actually sends to. */
function maskEmail(email: string): string {
  const [local, domain] = String(email || '').split('@');
  if (!domain) return '•••••';
  const head = local.slice(0, 2);
  return `${head}${'•'.repeat(Math.max(4, local.length - head.length))}@${domain}`;
}

function fmtCountdown(total: number): string {
  const m = Math.floor(Math.max(0, total) / 60);
  const s = Math.max(0, total) % 60;
  return `${m}:${String(s).padStart(2, '0')}`;
}

type EyeToggleProps = { visible: boolean; onToggle: () => void };
function EyeToggle({ visible, onToggle }: EyeToggleProps) {
  return (
    <button
      type="button"
      aria-label={visible ? 'Hide password' : 'Show password'}
      aria-pressed={visible}
      onClick={onToggle}
      className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1.5 text-[#9AA0AC] outline-none transition-colors hover:text-[#1A1A2E] focus-visible:ring-2 focus-visible:ring-[#FF5B00]/40"
    >
      {visible ? <EyeOff size={16} strokeWidth={2} /> : <Eye size={16} strokeWidth={2} />}
    </button>
  );
}

function PasswordField(props: {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  visible: boolean;
  onToggleVisible: () => void;
  autoComplete: string;
  autoFocus?: boolean;
}) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={props.id} className="text-[12px] font-semibold text-[#6B7280] ml-1">
        {props.label}
      </label>
      <div className="relative">
        <Lock size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#9AA0AC]" />
        <input
          id={props.id}
          type={props.visible ? 'text' : 'password'}
          value={props.value}
          onChange={(e) => props.onChange(e.target.value)}
          autoComplete={props.autoComplete}
          autoFocus={props.autoFocus}
          minLength={MIN_LEN}
          maxLength={MAX_LEN}
          placeholder="••••••••"
          className="w-full h-11 rounded-xl border border-slate-200 bg-slate-50 pl-9 pr-10 text-[13px] font-semibold text-[#1A1A2E] outline-none transition-all focus:border-[#FF5B00]/40 focus:bg-white focus:ring-2 focus:ring-[#FF5B00]/15"
        />
        <EyeToggle visible={props.visible} onToggle={props.onToggleVisible} />
      </div>
    </div>
  );
}

// ── Set-up-password modal (email OTP) ────────────────────────────────────────

type Step = 'verify' | 'sending' | 'code' | 'password' | 'done';

function SetupPasswordModal(props: { accountEmail: string; onClose: () => void; onCompleted: () => void }) {
  const { accountEmail, onClose, onCompleted } = props;
  const [step, setStep] = useState<Step>('verify');
  const [maskedEmail, setMaskedEmail] = useState<string>(() => maskEmail(accountEmail));
  const [code, setCode] = useState('');
  const [setupToken, setSetupToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [expiresIn, setExpiresIn] = useState(CODE_TTL_SECONDS);
  const [resendIn, setResendIn] = useState(0);

  const tickRef = useRef<number | null>(null);
  useEffect(() => {
    tickRef.current = window.setInterval(() => {
      setExpiresIn((s) => (s > 0 ? s - 1 : 0));
      setResendIn((s) => (s > 0 ? s - 1 : 0));
    }, 1000);
    return () => {
      if (tickRef.current) window.clearInterval(tickRef.current);
    };
  }, []);

  // Esc to close (except mid-write, to avoid a half-done impression)
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !busy) onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [busy, onClose]);

  const token = () => getAccessToken() || '';

  const sendCode = useCallback(
    async (isResend: boolean) => {
      setError('');
      setBusy(true);
      if (!isResend) setStep('sending');
      try {
        const res = await requestLocalPasswordOtp(token());
        setMaskedEmail(res.email || maskEmail(accountEmail));
        setExpiresIn(res.expiresInSeconds || CODE_TTL_SECONDS);
        setResendIn(RESEND_COOLDOWN_SECONDS);
        setCode('');
        setStep('code');
        if (isResend) toast.success('New code sent.');
      } catch (e) {
        const err = e as ApiError;
        if (err.code === 'RESEND_TOO_SOON' && err.retryAfterSeconds) setResendIn(err.retryAfterSeconds);
        setError(err.message || 'Could not send a verification code.');
        setStep(isResend ? 'code' : 'verify');
      } finally {
        setBusy(false);
      }
    },
    [accountEmail],
  );

  const submitCode = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (busy) return;
      setError('');
      if (!/^\d{6}$/.test(code)) {
        setError('Enter the 6-digit code from the email.');
        return;
      }
      setBusy(true);
      try {
        const res = await verifyLocalPasswordOtp(token(), code);
        setSetupToken(res.setupToken);
        setStep('password');
      } catch (err) {
        setError((err as ApiError).message || 'That code is not correct.');
      } finally {
        setBusy(false);
      }
    },
    [busy, code],
  );

  const submitPassword = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (busy) return;
      setError('');
      if (newPassword.length < MIN_LEN) {
        setError(`Password must be at least ${MIN_LEN} characters.`);
        return;
      }
      if (newPassword !== confirmPassword) {
        setError('Passwords do not match.');
        return;
      }
      setBusy(true);
      try {
        const res = await setLocalPassword(token(), setupToken, newPassword, confirmPassword);
        if (res.accessToken) persistAuthToken(res.accessToken);
        setStep('done');
      } catch (err) {
        const apiErr = err as ApiError;
        setError(apiErr.message || 'Could not set your password.');
        // A dead/spent authorization means starting over.
        if (apiErr.code === 'SETUP_AUTHORIZATION_INVALID') {
          setSetupToken('');
          setStep('verify');
        }
      } finally {
        setBusy(false);
      }
    },
    [busy, confirmPassword, newPassword, setupToken],
  );

  const codeExpired = expiresIn <= 0;

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center bg-[#0B0B14]/55 p-4" role="dialog" aria-modal="true" aria-label="Set up a password">
      <div className="w-full max-w-[440px] overflow-hidden rounded-2xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-3.5">
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#FF5B00]/10 text-[#FF5B00]">
              <KeyRound size={15} />
            </span>
            <h3 className="text-[14px] font-extrabold tracking-tight text-[#1A1A2E]">Set up a password</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={busy}
            aria-label="Close"
            className="rounded-lg p-1.5 text-[#9AA0AC] transition-colors hover:bg-slate-100 hover:text-[#1A1A2E] disabled:opacity-40"
          >
            <X size={16} />
          </button>
        </div>

        <div className="px-5 py-5">
          {error ? (
            <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-[12px] font-medium text-red-700">
              {error}
            </div>
          ) : null}

          {(step === 'verify' || step === 'sending') && (
            <div className="space-y-4">
              <div className="flex items-start gap-2.5">
                <Mail size={17} className="mt-0.5 shrink-0 text-[#FF5B00]" />
                <p className="text-[13px] leading-relaxed text-[#4B5563]">
                  We&apos;ll send a one-time verification code to{' '}
                  <span className="font-bold text-[#1A1A2E]">{maskedEmail}</span> — the email on your Choosify account.
                </p>
              </div>
              <button
                type="button"
                onClick={() => sendCode(false)}
                disabled={busy}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#FF5B00] py-3 text-[13px] font-bold text-white transition-all hover:brightness-110 disabled:opacity-60"
              >
                {step === 'sending' ? <Loader2 size={15} className="animate-spin" /> : null}
                {step === 'sending' ? 'Sending…' : 'Send verification code'}
              </button>
            </div>
          )}

          {step === 'code' && (
            <form onSubmit={submitCode} className="space-y-4">
              <div className="space-y-1.5">
                <label htmlFor="lp-otp" className="text-[12px] font-semibold text-[#6B7280] ml-1">
                  Verification code
                </label>
                <input
                  id="lp-otp"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  pattern="\d{6}"
                  maxLength={6}
                  autoFocus
                  value={code}
                  onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  placeholder="______"
                  className="w-full h-12 rounded-xl border border-slate-200 bg-slate-50 px-4 text-center text-[20px] font-bold tracking-[0.5em] text-[#1A1A2E] outline-none focus:border-[#FF5B00]/40 focus:bg-white focus:ring-2 focus:ring-[#FF5B00]/15"
                />
                <div className="flex items-center justify-between px-1 pt-0.5">
                  <span className={`text-[11px] font-semibold ${codeExpired ? 'text-red-500' : 'text-[#9AA0AC]'}`}>
                    {codeExpired ? 'Code expired' : `Code expires in ${fmtCountdown(expiresIn)}`}
                  </span>
                  <button
                    type="button"
                    onClick={() => sendCode(true)}
                    disabled={busy || resendIn > 0}
                    className="text-[11px] font-bold text-[#FF5B00] hover:underline disabled:text-[#9AA0AC] disabled:no-underline"
                  >
                    {resendIn > 0 ? `Resend code (${resendIn}s)` : 'Resend code'}
                  </button>
                </div>
              </div>
              <button
                type="submit"
                disabled={busy || code.length !== 6}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#FF5B00] py-3 text-[13px] font-bold text-white transition-all hover:brightness-110 disabled:opacity-60"
              >
                {busy ? <Loader2 size={15} className="animate-spin" /> : null}
                {busy ? 'Checking…' : 'Continue'}
              </button>
            </form>
          )}

          {step === 'password' && (
            <form onSubmit={submitPassword} className="space-y-4">
              <p className="text-[12.5px] leading-relaxed text-[#4B5563]">
                Email verified. Choose a password — at least {MIN_LEN} characters. You&apos;ll still be able to continue with
                Google too.
              </p>
              <PasswordField
                id="lp-new"
                label="New password"
                value={newPassword}
                onChange={setNewPassword}
                visible={showNew}
                onToggleVisible={() => setShowNew((v) => !v)}
                autoComplete="new-password"
                autoFocus
              />
              <PasswordField
                id="lp-confirm"
                label="Confirm new password"
                value={confirmPassword}
                onChange={setConfirmPassword}
                visible={showConfirm}
                onToggleVisible={() => setShowConfirm((v) => !v)}
                autoComplete="new-password"
              />
              <button
                type="submit"
                disabled={busy || newPassword.length < MIN_LEN || newPassword !== confirmPassword}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#FF5B00] py-3 text-[13px] font-bold text-white transition-all hover:brightness-110 disabled:opacity-60"
              >
                {busy ? <Loader2 size={15} className="animate-spin" /> : null}
                {busy ? 'Setting…' : 'Set password'}
              </button>
            </form>
          )}

          {step === 'done' && (
            <div className="space-y-4 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50">
                <CheckCircle2 className="h-6 w-6 text-emerald-500" />
              </div>
              <div>
                <p className="text-[14px] font-extrabold text-[#1A1A2E]">Password added</p>
                <p className="mt-1 text-[12.5px] leading-relaxed text-[#4B5563]">
                  You can now sign in with your email and password, or keep using Continue with Google. Other devices were
                  signed out.
                </p>
              </div>
              <button
                type="button"
                onClick={onCompleted}
                className="w-full rounded-xl bg-[#1A1A2E] py-3 text-[13px] font-bold text-white transition-all hover:brightness-125"
              >
                Done
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Change-password inline form (account already has one) ────────────────────

function ChangePasswordInline(props: { onDone: () => void; onCancel: () => void }) {
  const [current, setCurrent] = useState('');
  const [next, setNext] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNext, setShowNext] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (busy) return;
    setError('');
    if (next.length < MIN_LEN) return setError(`New password must be at least ${MIN_LEN} characters.`);
    if (next !== confirm) return setError('Passwords do not match.');
    if (next === current) return setError('New password must be different from the current one.');
    setBusy(true);
    try {
      await changePassword(getAccessToken() || '', current, next);
      toast.success('Password changed.');
      props.onDone();
    } catch (err) {
      setError((err as ApiError).message || 'Could not change your password.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <form onSubmit={submit} className="mt-4 space-y-4 border-t border-slate-100 pt-4">
      {error ? (
        <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-[12px] font-medium text-red-700">{error}</div>
      ) : null}
      <PasswordField
        id="cp-current"
        label="Current password"
        value={current}
        onChange={setCurrent}
        visible={showCurrent}
        onToggleVisible={() => setShowCurrent((v) => !v)}
        autoComplete="current-password"
        autoFocus
      />
      <PasswordField
        id="cp-new"
        label="New password"
        value={next}
        onChange={setNext}
        visible={showNext}
        onToggleVisible={() => setShowNext((v) => !v)}
        autoComplete="new-password"
      />
      <PasswordField
        id="cp-confirm"
        label="Confirm new password"
        value={confirm}
        onChange={setConfirm}
        visible={showConfirm}
        onToggleVisible={() => setShowConfirm((v) => !v)}
        autoComplete="new-password"
      />
      <div className="flex gap-2">
        <button
          type="submit"
          disabled={busy}
          className="flex items-center justify-center gap-2 rounded-xl bg-[#FF5B00] px-5 py-2.5 text-[12.5px] font-bold text-white transition-all hover:brightness-110 disabled:opacity-60"
        >
          {busy ? <Loader2 size={14} className="animate-spin" /> : null}
          {busy ? 'Saving…' : 'Update password'}
        </button>
        <button
          type="button"
          onClick={props.onCancel}
          disabled={busy}
          className="rounded-xl px-4 py-2.5 text-[12.5px] font-bold text-[#6B7280] transition-colors hover:bg-slate-100"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

// ── Panel ───────────────────────────────────────────────────────────────────

function Card(props: { title: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="rounded-[10px] border border-[#E8EDF2] bg-white p-6">
      <div className="mb-3 flex items-center gap-2">
        <span className="text-[#FF5B00]">{props.icon}</span>
        <h3 className="text-[13px] font-bold text-[#1A1A2E]">{props.title}</h3>
      </div>
      {props.children}
    </div>
  );
}

export default function SecuritySettings({ accountEmail }: { accountEmail: string }) {
  const [loading, setLoading] = useState(true);
  const [overview, setOverview] = useState<AuthMeResponse | null>(null);
  const [failed, setFailed] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [changing, setChanging] = useState(false);

  const load = useCallback(async () => {
    const token = getAccessToken();
    if (!token) {
      setLoading(false);
      setFailed(true);
      return;
    }
    try {
      const data = await fetchAccountOverview(token);
      setOverview(data);
      setFailed(!data);
    } catch {
      setFailed(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const email = overview?.email || accountEmail;
  const emailVerified = overview?.emailVerified === true;
  const hasPassword = overview?.hasPassword === true;
  const isConsumer = (overview?.role || 'user') === 'user';
  const identities = overview?.identities ?? [];

  if (loading) {
    return (
      <div className="max-w-2xl">
        <div className="flex items-center gap-2 text-[12.5px] text-[#9AA0AC]">
          <Loader2 size={14} className="animate-spin" /> Loading your security settings…
        </div>
      </div>
    );
  }

  if (failed) {
    return (
      <div className="max-w-2xl">
        <p className="text-[12.5px] text-[#9AA0AC]">Couldn&apos;t load your security settings. Refresh to try again.</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl space-y-5">
      {/* Email */}
      <Card title="Email" icon={<Mail size={16} />}>
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
          <span className="text-[13px] font-semibold text-[#1A1A2E]">{email}</span>
          {emailVerified ? (
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-bold text-emerald-600">
              <BadgeCheck size={12} /> Verified
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-[11px] font-bold text-amber-600">
              Not verified
            </span>
          )}
        </div>
        <p className="mt-2 text-[11.5px] text-[#9AA0AC]">
          Email changes aren&apos;t supported yet. Contact support if you need this updated.
        </p>
      </Card>

      {/* Password */}
      <Card title="Password" icon={<KeyRound size={16} />}>
        {!hasPassword ? (
          <div className="space-y-3">
            <p className="text-[13px] font-semibold text-[#1A1A2E]">No password set</p>
            <p className="text-[12.5px] leading-relaxed text-[#6B7280]">
              You currently sign in with Google. Set up a password if you&apos;d also like to sign in using your email
              address. Google sign-in keeps working either way.
            </p>
            <button
              type="button"
              onClick={() => setModalOpen(true)}
              disabled={!isConsumer}
              className="inline-flex items-center gap-2 rounded-xl bg-[#FF5B00] px-5 py-2.5 text-[12.5px] font-bold text-white transition-all hover:brightness-110 disabled:opacity-50"
            >
              <KeyRound size={14} /> Set up password
            </button>
          </div>
        ) : (
          <div>
            <span className="text-[15px] tracking-[0.2em] text-[#1A1A2E]">••••••••••••</span>
            {!changing ? (
              <div className="mt-3">
                <button
                  type="button"
                  onClick={() => setChanging(true)}
                  className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-[12.5px] font-bold text-[#1A1A2E] transition-colors hover:bg-slate-50"
                >
                  <KeyRound size={14} /> Change password
                </button>
              </div>
            ) : (
              <ChangePasswordInline onDone={() => setChanging(false)} onCancel={() => setChanging(false)} />
            )}
          </div>
        )}
      </Card>

      {/* Connected accounts */}
      <Card title="Connected accounts" icon={<ShieldCheck size={16} />}>
        {identities.length === 0 ? (
          <p className="text-[12.5px] text-[#6B7280]">No social accounts are connected.</p>
        ) : (
          <ul className="space-y-2.5">
            {identities.map((id) => (
              <li key={id.provider} className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-[13px] font-bold text-[#1A1A2E]">{PROVIDER_LABEL[id.provider] || id.provider}</p>
                  {id.email ? <p className="truncate text-[11.5px] text-[#9AA0AC]">{id.email}</p> : null}
                </div>
                <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-[11px] font-bold text-emerald-600">
                  <CheckCircle2 size={12} /> Connected
                </span>
              </li>
            ))}
          </ul>
        )}
        <p className="mt-3 text-[11.5px] text-[#9AA0AC]">
          Adding a Choosify password doesn&apos;t disconnect Google — you can use either to sign in.
        </p>
      </Card>

      {modalOpen ? (
        <SetupPasswordModal
          accountEmail={email}
          onClose={() => setModalOpen(false)}
          onCompleted={() => {
            setModalOpen(false);
            void load();
          }}
        />
      ) : null}
    </div>
  );
}
