import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, ArrowLeft, ArrowRight, MailCheck } from 'lucide-react';
import { AuthScaffold, AuthPrimaryButton, AuthInput } from '../components/auth/AuthScaffold';
import { requestPasswordReset } from '../lib/authApi';
import { toast } from '../lib/notify';

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
      // Same success state whether or not the email exists — the API returns a
      // generic body; this UI adds no enumeration signal of its own.
      setSent(true);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (sent) {
    return (
      <AuthScaffold
        title="Check your email"
        subtitle={`If an account exists for ${email}, we've sent a password reset link.`}
        footer={
          <button type="button" onClick={() => navigate('/login')} className="font-bold text-white/80 hover:text-white">
            Back to sign in
          </button>
        }
      >
        <div className="flex flex-col items-center text-center">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#FFF3EA]">
            <MailCheck className="h-7 w-7 text-[#FF5B00]" />
          </div>
          <p className="text-[13px] leading-relaxed text-[#4B5563]">
            The link expires in <span className="font-semibold text-[#18154C]">1 hour</span> and can be used once.
            Didn't get it? Check spam, or request another.
          </p>
          <button
            type="button"
            onClick={() => setSent(false)}
            className="mt-4 text-xs font-bold text-[#FF5B00] hover:underline"
          >
            Use a different email
          </button>
        </div>
      </AuthScaffold>
    );
  }

  return (
    <AuthScaffold
      title="Forgot your password?"
      subtitle="Enter your account email and we'll send you a link to reset it."
      footer={
        <button
          type="button"
          onClick={() => navigate('/login')}
          className="inline-flex items-center gap-1.5 font-bold text-white/80 hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" /> Back to sign in
        </button>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <AuthInput
          id="email"
          label="Email address"
          type="email"
          required
          autoFocus
          icon={Mail}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
        />
        <AuthPrimaryButton type="submit" loading={submitting}>
          {submitting ? 'Sending…' : 'Send reset link'}
          {!submitting && <ArrowRight size={16} strokeWidth={2.4} />}
        </AuthPrimaryButton>
      </form>
    </AuthScaffold>
  );
}
