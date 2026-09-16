import React, { useEffect, useState } from 'react';
import { ArrowRight, Eye, EyeOff, Lock, Mail } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useGlobalState } from '../context/GlobalStateContext';
import { toast } from '../lib/notify';
import { cn } from '../lib/utils';
import { SocialAuthButtons } from '../components/auth/SocialAuthButtons';
import { StorefrontAuthShell } from '../components/auth/StorefrontAuthShell';
import {
  firebaseAuthErrorMessage,
  registerWithEmailPassword,
  resolveSessionUser,
  signInWithEmailPassword,
} from '../lib/authSession';
import type { SessionIdentity } from '../lib/authSession';

type AuthTab = 'sign-in' | 'sign-up';

function AuthField({
  id,
  label,
  type = 'text',
  value,
  onChange,
  autoComplete,
  icon: Icon,
  placeholder,
  rightSlot,
}: {
  id: string;
  label: string;
  type?: string;
  value: string;
  onChange: (value: string) => void;
  autoComplete?: string;
  icon?: React.ComponentType<{ size?: number; className?: string; strokeWidth?: number }>;
  placeholder?: string;
  rightSlot?: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="block text-xs font-semibold text-[#1A1A2E]">
        {label}
      </label>
      <div className="relative">
        {Icon ? (
          <Icon
            size={16}
            strokeWidth={2}
            className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9AA0AC]"
          />
        ) : null}
        <input
          id={id}
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          autoComplete={autoComplete}
          placeholder={placeholder}
          className={cn(
            'w-full h-[42px] rounded-lg border border-[#E5E7EB] bg-white text-[13px] font-medium text-[#1A1A2E] outline-none transition-colors box-border',
            'placeholder:text-[#9AA0AC] focus:border-[#FF5B00] focus:ring-2 focus:ring-[#FF5B00]/15',
            Icon ? 'pl-10' : 'pl-3.5',
            rightSlot ? 'pr-10' : 'pr-3.5',
          )}
        />
        {rightSlot ? (
          <div className="absolute right-2 top-1/2 -translate-y-1/2">{rightSlot}</div>
        ) : null}
      </div>
    </div>
  );
}

export function LoginSignUpPage() {
  const [activeTab, setActiveTab] = useState<AuthTab>('sign-in');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const { setIsLoggedIn, updateCurrentUser, currentUser } = useGlobalState();
  const location = useLocation();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const requestedTab = (location.state as { tab?: AuthTab } | null)?.tab;
    if (requestedTab === 'sign-in' || requestedTab === 'sign-up') {
      setActiveTab(requestedTab);
    }
  }, [location.state]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (activeTab === 'sign-up' && !fullName.trim()) {
      toast.error('Please enter your full name.');
      return;
    }
    if (!email || !password) {
      toast.error('Please enter your email and password.');
      return;
    }
    if (!email.includes('@')) {
      toast.error('Please enter a valid email address.');
      return;
    }
    if (activeTab === 'sign-up' && password.length < 8) {
      toast.error('Password must be at least 8 characters.');
      return;
    }

    setIsSubmitting(true);
    try {
      const identity =
        activeTab === 'sign-up'
          ? await registerWithEmailPassword(email, password, fullName)
          : await signInWithEmailPassword(email, password);

      const { user } = await resolveSessionUser(identity, currentUser);
      updateCurrentUser(user);
      setIsLoggedIn(true);
      toast.success(activeTab === 'sign-up' ? 'Account created! Welcome to Choosify.' : 'Welcome back!');
      // Return-to-order: honour ?next= (survives a signup reload) then state.from.
      const nextParam = new URLSearchParams(location.search).get('next');
      const from =
        (nextParam && nextParam.startsWith('/') ? nextParam : undefined) ||
        (location.state as { from?: string } | null)?.from;
      const dest =
        from && from !== '/login' && !from.startsWith('/login/')
          ? from
          : '/';
      navigate(dest, { replace: true });
    } catch (err) {
      toast.error(firebaseAuthErrorMessage(err));
    } finally {
      setIsSubmitting(false);
    }
  };

  /** Shared post-auth handler for a successful Google / Facebook sign-in — the
   *  backend has already verified the provider credential and returned a normal
   *  Choosify Consumer session. */
  const handleSocialSuccess = async (identity: SessionIdentity) => {
    const { user } = await resolveSessionUser(identity, currentUser);
    updateCurrentUser(user);
    setIsLoggedIn(true);
    toast.success('Welcome to Choosify!');
    const nextParam = new URLSearchParams(location.search).get('next');
    const from =
      (nextParam && nextParam.startsWith('/') ? nextParam : undefined) ||
      (location.state as { from?: string } | null)?.from;
    const dest = from && from !== '/login' && !from.startsWith('/login/') ? from : '/';
    navigate(dest, { replace: true });
  };

  const handleForgotPassword = () => {
    navigate('/forgot-password');
  };

  const isSignUp = activeTab === 'sign-up';

  return (
    <StorefrontAuthShell>
      <>
        <h2 className="mb-1 text-[22px] font-extrabold text-[#1A1A2E]">
                  {isSignUp ? 'Create your account' : 'Welcome back'}
                </h2>
                <p className="mb-5 text-[12.5px] text-[#9AA0AC]">
                  {isSignUp
                    ? 'Join Choosify to save products and compare brands'
                    : 'Sign in to continue to Choosify'}
                </p>

                {/* Segmented tabs */}
                <div className="mb-5 flex rounded-lg bg-[#F1F1F3] p-1">
                  <button
                    type="button"
                    onClick={() => setActiveTab('sign-in')}
                    className={cn(
                      'flex-1 rounded-md py-2.5 text-center text-[12.5px] font-bold transition-all',
                      !isSignUp
                        ? 'bg-white text-[#1A1A2E] shadow-[0_1px_3px_rgba(0,0,0,0.1)]'
                        : 'bg-transparent text-[#9AA0AC] hover:text-[#1A1A2E]',
                    )}
                  >
                    Sign in
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab('sign-up')}
                    className={cn(
                      'flex-1 rounded-md py-2.5 text-center text-[12.5px] font-bold transition-all',
                      isSignUp
                        ? 'bg-white text-[#1A1A2E] shadow-[0_1px_3px_rgba(0,0,0,0.1)]'
                        : 'bg-transparent text-[#9AA0AC] hover:text-[#1A1A2E]',
                    )}
                  >
                    Sign up
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  {isSignUp && (
                    <AuthField
                      id="full-name"
                      label="Full Name"
                      value={fullName}
                      onChange={setFullName}
                      autoComplete="name"
                      placeholder="Your full name"
                    />
                  )}

                  <AuthField
                    id="email"
                    label="Email address"
                    type="email"
                    value={email}
                    onChange={setEmail}
                    autoComplete="email"
                    icon={Mail}
                    placeholder="Enter your email address"
                  />

                  <AuthField
                    id="password"
                    label="Password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={setPassword}
                    autoComplete={isSignUp ? 'new-password' : 'current-password'}
                    icon={Lock}
                    placeholder="Enter your password"
                    rightSlot={
                      <button
                        type="button"
                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                        aria-pressed={showPassword}
                        onClick={() => setShowPassword((v) => !v)}
                        className="rounded-md p-1.5 text-[#9AA0AC] outline-none transition-colors hover:text-[#1A1A2E] focus-visible:ring-2 focus-visible:ring-[#FF5B00]/40"
                      >
                        {showPassword ? <EyeOff size={16} strokeWidth={2} /> : <Eye size={16} strokeWidth={2} />}
                      </button>
                    }
                  />

                  {!isSignUp && (
                    <div className="flex items-center justify-between gap-3">
                      <label className="flex cursor-pointer items-center gap-1.5 text-xs text-[#4B5563]">
                        <input
                          type="checkbox"
                          checked={rememberMe}
                          onChange={(e) => setRememberMe(e.target.checked)}
                          className="h-3.5 w-3.5 rounded accent-[#FF5B00]"
                        />
                        Remember me
                      </label>
                      <button
                        type="button"
                        onClick={handleForgotPassword}
                        className="text-xs font-bold text-[#FF5B00] hover:underline"
                      >
                        Forgot password?
                      </button>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={cn(
                      'flex w-full items-center justify-center gap-2 rounded-lg border-none bg-[#FF5B00] py-3.5 text-[13px] font-bold text-white transition-all hover:brightness-105 active:scale-[0.99]',
                      isSubmitting && 'cursor-not-allowed opacity-60',
                    )}
                  >
                    {isSubmitting
                      ? isSignUp
                        ? 'Creating account…'
                        : 'Signing in…'
                      : isSignUp
                        ? 'Create account'
                        : 'Sign in to Choosify'}
                    {!isSubmitting && <ArrowRight size={16} strokeWidth={2.4} className="text-current" />}
                  </button>
                </form>

                <div className="my-5 flex items-center gap-3">
                  <div className="h-px flex-1 bg-[#E8EDF2]" />
                  <span className="text-[11px] text-[#9AA0AC]">OR</span>
                  <div className="h-px flex-1 bg-[#E8EDF2]" />
                </div>

                <SocialAuthButtons
                  mode={isSignUp ? 'sign-up' : 'sign-in'}
                  disabled={isSubmitting}
                  onSuccess={handleSocialSuccess}
                  onError={(message) => toast.error(message)}
                />

                <p className="m-0 text-center text-[12.5px] text-[#9AA0AC]">
                  {isSignUp ? 'Already have an account?' : 'New to Choosify?'}{' '}
                  <button
                    type="button"
                    onClick={() => setActiveTab(isSignUp ? 'sign-in' : 'sign-up')}
                    className="font-bold text-[#FF5B00] hover:underline"
                  >
                    {isSignUp ? 'Sign in' : 'Sign up'}
                  </button>
                </p>
      </>
    </StorefrontAuthShell>
  );
}
