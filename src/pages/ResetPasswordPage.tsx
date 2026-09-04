import React, { useMemo, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Lock, Eye, EyeOff, CheckCircle2, XCircle, ArrowRight } from 'lucide-react';
import { AuthScaffold, AuthPrimaryButton, AuthInput } from '../components/auth/AuthScaffold';
import { resetPassword } from '../lib/authApi';

type Stage = 'form' | 'success' | 'invalid';

// Canonical policy — mirrors the backend (min 8, max 128). Not weakened for UI.
const MIN_LEN = 8;
const MAX_LEN = 128;

export default function ResetPasswordPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') || '';

  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  // Each field toggles its own visibility, independently.
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [stage, setStage] = useState<Stage>(token ? 'form' : 'invalid');
  const [fieldError, setFieldError] = useState('');

  const tooShort = password.length > 0 && password.length < MIN_LEN;
  const mismatch = confirm.length > 0 && confirm !== password;
  const canSubmit = useMemo(
    () => password.length >= MIN_LEN && password.length <= MAX_LEN && password === confirm && !submitting,
    [password, confirm, submitting],
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFieldError('');
    if (password.length < MIN_LEN) {
      setFieldError(`Password must be at least ${MIN_LEN} characters.`);
      return;
    }
    if (password !== confirm) {
      setFieldError("Passwords don't match.");
      return;
    }
    setSubmitting(true);
    try {
      const result = await resetPassword(token, password);
      setStage(result.success ? 'success' : 'invalid');
    } catch {
      setStage('invalid');
    } finally {
      setSubmitting(false);
    }
  };

  const eyeToggle = (visible: boolean, toggle: () => void) => (
    <button
      type="button"
      aria-label={visible ? 'Hide password' : 'Show password'}
      aria-pressed={visible}
      onClick={toggle}
      className="rounded-md p-1.5 text-[#9AA0AC] outline-none transition-colors hover:text-[#1A1A2E] focus-visible:ring-2 focus-visible:ring-[#FF5B00]/40"
    >
      {visible ? <EyeOff size={16} strokeWidth={2} /> : <Eye size={16} strokeWidth={2} />}
    </button>
  );

  if (stage === 'success') {
    return (
      <AuthScaffold title="Password updated" subtitle="Your password has been changed and every other session was signed out.">
        <div className="flex flex-col items-center text-center">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50">
            <CheckCircle2 className="h-7 w-7 text-emerald-500" />
          </div>
          <p className="mb-5 text-[13px] leading-relaxed text-[#4B5563]">
            Sign in with your new password to continue.
          </p>
          <AuthPrimaryButton type="button" onClick={() => navigate('/login')}>
            Continue to sign in <ArrowRight size={16} strokeWidth={2.4} />
          </AuthPrimaryButton>
        </div>
      </AuthScaffold>
    );
  }

  if (stage === 'invalid') {
    return (
      <AuthScaffold
        title="Link expired or invalid"
        subtitle="This reset link is no longer valid — it may have already been used, or it's more than an hour old."
        footer={
          <Link to="/login" className="font-bold text-white/80 hover:text-white">
            Back to sign in
          </Link>
        }
      >
        <div className="flex flex-col items-center text-center">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-rose-50">
            <XCircle className="h-7 w-7 text-rose-500" />
          </div>
          <AuthPrimaryButton type="button" onClick={() => navigate('/forgot-password')}>
            Request a new link <ArrowRight size={16} strokeWidth={2.4} />
          </AuthPrimaryButton>
        </div>
      </AuthScaffold>
    );
  }

  return (
    <AuthScaffold title="Choose a new password" subtitle={`Use at least ${MIN_LEN} characters. This applies the same rules as sign-up.`}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <AuthInput
          id="new-password"
          label="New password"
          type={showNew ? 'text' : 'password'}
          required
          autoFocus
          minLength={MIN_LEN}
          maxLength={MAX_LEN}
          icon={Lock}
          rightSlot={eyeToggle(showNew, () => setShowNew((v) => !v))}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          autoComplete="new-password"
        />
        {tooShort ? (
          <p className="-mt-2 text-[11px] font-semibold text-rose-500">At least {MIN_LEN} characters.</p>
        ) : null}
        <AuthInput
          id="confirm-password"
          label="Confirm new password"
          type={showConfirm ? 'text' : 'password'}
          required
          minLength={MIN_LEN}
          maxLength={MAX_LEN}
          icon={Lock}
          rightSlot={eyeToggle(showConfirm, () => setShowConfirm((v) => !v))}
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          placeholder="••••••••"
          autoComplete="new-password"
        />
        {mismatch ? (
          <p className="-mt-2 text-[11px] font-semibold text-rose-500">Passwords don't match.</p>
        ) : null}
        {fieldError ? <p className="text-[11px] font-semibold text-rose-500">{fieldError}</p> : null}
        <AuthPrimaryButton type="submit" loading={submitting} disabled={!canSubmit}>
          {submitting ? 'Updating…' : 'Reset password'}
          {!submitting && <ArrowRight size={16} strokeWidth={2.4} />}
        </AuthPrimaryButton>
      </form>
    </AuthScaffold>
  );
}
