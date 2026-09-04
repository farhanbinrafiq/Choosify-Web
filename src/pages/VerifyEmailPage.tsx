import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { CheckCircle2, XCircle, Loader2, ArrowRight } from 'lucide-react';
import { AuthScaffold, AuthPrimaryButton } from '../components/auth/AuthScaffold';
import { verifyEmail } from '../lib/authApi';

type Stage = 'checking' | 'success' | 'invalid';

export default function VerifyEmailPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') || '';
  const [stage, setStage] = useState<Stage>('checking');
  // See git history: a ref (not an effect `cancelled` flag) guards React
  // StrictMode's dev double-invoke from firing this single-use token twice.
  const requestedTokenRef = useRef<string | null>(null);

  useEffect(() => {
    if (!token) {
      setStage('invalid');
      return;
    }
    if (requestedTokenRef.current === token) return;
    requestedTokenRef.current = token;
    verifyEmail(token)
      .then((result) => setStage(result.success ? 'success' : 'invalid'))
      .catch(() => setStage('invalid'));
  }, [token]);

  if (stage === 'checking') {
    return (
      <AuthScaffold title="Verifying your email…" subtitle="This only takes a moment.">
        <div className="flex justify-center py-4">
          <Loader2 className="h-8 w-8 animate-spin text-[#FF5B00]" />
        </div>
      </AuthScaffold>
    );
  }

  if (stage === 'success') {
    return (
      <AuthScaffold title="Email verified" subtitle="Your email address has been confirmed.">
        <div className="flex flex-col items-center text-center">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50">
            <CheckCircle2 className="h-7 w-7 text-emerald-500" />
          </div>
          <AuthPrimaryButton type="button" onClick={() => navigate('/')}>
            Continue to Choosify <ArrowRight size={16} strokeWidth={2.4} />
          </AuthPrimaryButton>
        </div>
      </AuthScaffold>
    );
  }

  return (
    <AuthScaffold
      title="Link expired or invalid"
      subtitle="This verification link is no longer valid. Request a fresh one from your account settings after signing in."
      footer={
        <button type="button" onClick={() => navigate('/login')} className="font-bold text-white/80 hover:text-white">
          Back to sign in
        </button>
      }
    >
      <div className="flex flex-col items-center text-center">
        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-rose-50">
          <XCircle className="h-7 w-7 text-rose-500" />
        </div>
        <AuthPrimaryButton type="button" onClick={() => navigate('/login')}>
          Sign in <ArrowRight size={16} strokeWidth={2.4} />
        </AuthPrimaryButton>
      </div>
    </AuthScaffold>
  );
}
