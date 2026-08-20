import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { EmiAiLogo } from '../components/EmiAiLogo';
import { requestPasswordReset } from '../lib/authApi';
import { toast } from '../lib/notify';

const PRIMARY = '#EB4501';

export default function ForgotPasswordPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || submitting) return;
    setSubmitting(true);
    try {
      await requestPasswordReset(email);
      // Always shows the same success state regardless of whether the
      // email exists — the API itself already returns a generic response;
      // this UI just has to not add its own enumeration signal on top.
      setSent(true);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Something went wrong. Please try again.');
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
          {sent ? (
            <div className="text-center space-y-4">
              <div className="mx-auto w-14 h-14 rounded-full bg-emerald-50 flex items-center justify-center">
                <CheckCircle2 className="w-7 h-7 text-emerald-500" />
              </div>
              <h1 className="text-xl font-black text-[#000435]">Check your email</h1>
              <p className="text-sm text-gray-500 leading-relaxed">
                If an account exists for <span className="font-semibold text-[#000435]">{email}</span>, we've sent a
                password reset link. It expires in 1 hour and can only be used once.
              </p>
              <Link
                to="/login"
                className="inline-flex items-center gap-1.5 text-sm font-bold mt-2"
                style={{ color: PRIMARY }}
              >
                <ArrowLeft className="w-4 h-4" /> Back to sign in
              </Link>
            </div>
          ) : (
            <>
              <h1 className="text-xl font-black text-[#000435] mb-1">Forgot your password?</h1>
              <p className="text-sm text-gray-500 mb-6">
                Enter your account email and we'll send you a link to reset it.
              </p>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-1.5">Email address</label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="email"
                      required
                      autoFocus
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#EB4501]/30 focus:border-[#EB4501]"
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-3 rounded-xl text-white text-sm font-bold disabled:opacity-60 transition-opacity"
                  style={{ backgroundColor: PRIMARY }}
                >
                  {submitting ? 'Sending…' : 'Send reset link'}
                </button>
              </form>
              <button
                type="button"
                onClick={() => navigate('/login')}
                className="w-full mt-5 inline-flex items-center justify-center gap-1.5 text-sm font-bold text-gray-500 hover:text-[#000435]"
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
