import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Lock, ArrowLeft, CheckCircle2, XCircle } from 'lucide-react';
import { EmiAiLogo } from '../components/EmiAiLogo';
import { resetPassword } from '../lib/authApi';
import { toast } from '../lib/notify';

const PRIMARY = '#FF5B00';

type Stage = 'form' | 'success' | 'invalid';

export default function ResetPasswordPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') || '';

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [stage, setStage] = useState<Stage>(token ? 'form' : 'invalid');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;
    if (password.length < 8) {
      toast.error('Password must be at least 8 characters.');
      return;
    }
    if (password !== confirmPassword) {
      toast.error("Passwords don't match.");
      return;
    }
    setSubmitting(true);
    try {
      const result = await resetPassword(token, password);
      if (result.success) {
        setStage('success');
      } else {
        setStage('invalid');
      }
    } catch {
      setStage('invalid');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen font-sans choosify-dark-surface flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="flex justify-center mb-8">
          <EmiAiLogo />
        </div>
        <div className="bg-white rounded-3xl shadow-2xl p-8">
          {stage === 'success' && (
            <div className="text-center space-y-4">
              <div className="mx-auto w-14 h-14 rounded-full bg-emerald-50 flex items-center justify-center">
                <CheckCircle2 className="w-7 h-7 text-emerald-500" />
              </div>
              <h1 className="text-xl font-black text-[#18154C]">Password reset</h1>
              <p className="text-sm text-gray-500 leading-relaxed">
                Your password has been changed and every other active session has been signed out. Sign in with your
                new password.
              </p>
              <button
                onClick={() => navigate('/login')}
                className="w-full py-3 rounded-xl text-white text-sm font-bold mt-2"
                style={{ backgroundColor: PRIMARY }}
              >
                Sign in
              </button>
            </div>
          )}

          {stage === 'invalid' && (
            <div className="text-center space-y-4">
              <div className="mx-auto w-14 h-14 rounded-full bg-rose-50 flex items-center justify-center">
                <XCircle className="w-7 h-7 text-rose-500" />
              </div>
              <h1 className="text-xl font-black text-[#18154C]">Link expired or invalid</h1>
              <p className="text-sm text-gray-500 leading-relaxed">
                This password reset link is no longer valid — it may have already been used, or it's more than an
                hour old. Request a new one.
              </p>
              <Link
                to="/forgot-password"
                className="inline-block w-full py-3 rounded-xl text-white text-sm font-bold mt-2"
                style={{ backgroundColor: PRIMARY }}
              >
                Request a new link
              </Link>
            </div>
          )}

          {stage === 'form' && (
            <>
              <h1 className="text-xl font-black text-[#18154C] mb-1">Choose a new password</h1>
              <p className="text-sm text-gray-500 mb-6">Must be at least 8 characters.</p>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-1.5">New password</label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="password"
                      required
                      autoFocus
                      minLength={8}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF5B00]/30 focus:border-[#FF5B00]"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-1.5">Confirm new password</label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="password"
                      required
                      minLength={8}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF5B00]/30 focus:border-[#FF5B00]"
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-3 rounded-xl text-white text-sm font-bold disabled:opacity-60 transition-opacity"
                  style={{ backgroundColor: PRIMARY }}
                >
                  {submitting ? 'Resetting…' : 'Reset password'}
                </button>
              </form>
              <button
                type="button"
                onClick={() => navigate('/login')}
                className="w-full mt-5 inline-flex items-center justify-center gap-1.5 text-sm font-bold text-gray-500 hover:text-[#18154C]"
              >
                <ArrowLeft className="w-4 h-4" /> Back to sign in
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
