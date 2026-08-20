import React, { useEffect, useRef, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { CheckCircle2, XCircle, Loader2 } from 'lucide-react';
import { EmiAiLogo } from '../components/EmiAiLogo';
import { verifyEmail } from '../lib/authApi';

const PRIMARY = '#EB4501';

type Stage = 'checking' | 'success' | 'invalid';

export default function VerifyEmailPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') || '';
  const [stage, setStage] = useState<Stage>('checking');
  // Tracks which token this component instance has already requested, so
  // React 18 StrictMode's dev-only double-invoke (mount -> cleanup -> mount)
  // can't fire this single-use token twice — the second call would always
  // 400 and must not clobber the first call's real result. Deliberately NOT
  // using an effect-scoped `cancelled` flag here: StrictMode's synthetic
  // cleanup would flip it before the in-flight request resolves and silently
  // swallow the one real response, leaving the page stuck on "Verifying…".
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

  return (
    <div className="min-h-screen font-sans choosify-dark-surface flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="flex justify-center mb-8">
          <EmiAiLogo />
        </div>
        <div className="bg-white rounded-3xl shadow-2xl p-8 text-center space-y-4">
          {stage === 'checking' && (
            <>
              <Loader2 className="w-8 h-8 mx-auto animate-spin" style={{ color: PRIMARY }} />
              <h1 className="text-xl font-black text-[#000435]">Verifying your email…</h1>
            </>
          )}
          {stage === 'success' && (
            <>
              <div className="mx-auto w-14 h-14 rounded-full bg-emerald-50 flex items-center justify-center">
                <CheckCircle2 className="w-7 h-7 text-emerald-500" />
              </div>
              <h1 className="text-xl font-black text-[#000435]">Email verified</h1>
              <p className="text-sm text-gray-500 leading-relaxed">Your email address has been confirmed.</p>
              <Link
                to="/dashboard"
                className="inline-block w-full py-3 rounded-xl text-white text-sm font-bold mt-2"
                style={{ backgroundColor: PRIMARY }}
              >
                Go to my account
              </Link>
            </>
          )}
          {stage === 'invalid' && (
            <>
              <div className="mx-auto w-14 h-14 rounded-full bg-rose-50 flex items-center justify-center">
                <XCircle className="w-7 h-7 text-rose-500" />
              </div>
              <h1 className="text-xl font-black text-[#000435]">Link expired or invalid</h1>
              <p className="text-sm text-gray-500 leading-relaxed">
                This verification link is no longer valid. You can request a fresh one from your account settings
                after signing in.
              </p>
              <Link
                to="/login"
                className="inline-block w-full py-3 rounded-xl text-white text-sm font-bold mt-2"
                style={{ backgroundColor: PRIMARY }}
              >
                Sign in
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
