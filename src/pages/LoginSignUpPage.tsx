import React, { useEffect, useRef, useState } from 'react';
import { HeroScrollCue, HERO_SCROLL_CUE_PADDING } from '../components/HeroScrollCue';
import {
  BadgeCheck,
  ChevronRight,
  CircleDollarSign,
  Shield,
  Sparkles,
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useGlobalState } from '../context/GlobalStateContext';
import toast from 'react-hot-toast';
import { cn } from '../lib/utils';

type AuthTab = 'sign-in' | 'sign-up';

const FEATURES = [
  'Save unlimited products & brands',
  'Track your reviews & comparisons',
  'Personalised price drop alerts',
  'Verified-buyer badge on reviews',
];

const TRUST_COLUMNS = [
  {
    icon: Shield,
    title: 'Trust Worthy',
    body: "Choosify Do Not Promote Or Take Money from any brands to be a part of this platform. We independently list the brands with real world experience to help Bangladeshi shoppers avoid scams and find brands they can trust.",
  },
  {
    icon: CircleDollarSign,
    title: 'No Paid Promotion',
    body: "Choosify Do Not Promote Or Take Money from any brands to be a part of this platform. We independently list the brands with real world experience to help Bangladeshi shoppers avoid scams and find brands they can trust.",
  },
  {
    icon: BadgeCheck,
    title: 'Curated Brands Only',
    body: "Choosify Do Not Promote Or Take Money from any brands to be a part of this platform. We independently list the brands with real world experience to help Bangladeshi shoppers avoid scams and find brands they can trust.",
  },
];

function GoogleLogo() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true">
      <path fill="#EA4335" d="M12 10.2v3.6h5.1c-.2 1.2-1.5 3.6-5.1 3.6-3.1 0-5.6-2.5-5.6-5.6S8.9 6.2 12 6.2c1.8 0 3 .8 3.7 1.5l2.5-2.4C16.9 3.9 14.7 3 12 3 7 3 3 7 3 12s4 9 9 9c5.2 0 8.6-3.7 8.6-8.9 0-.6-.1-1-.2-1.4H12z" />
    </svg>
  );
}

function FacebookLogo() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true">
      <path fill="#1877F2" d="M22 12a10 10 0 1 0-11.6 9.9v-7h-2.3V12h2.3V9.8c0-2.3 1.4-3.6 3.5-3.6 1 0 2 .2 2 .2v2.2h-1.1c-1.1 0-1.4.7-1.4 1.4V12h2.4l-.4 2.9h-2v7A10 10 0 0 0 22 12z" />
    </svg>
  );
}

function AuthField({
  id,
  label,
  type = 'text',
  value,
  onChange,
  autoComplete,
}: {
  id: string;
  label: string;
  type?: string;
  value: string;
  onChange: (value: string) => void;
  autoComplete?: string;
}) {
  return (
    <div className="space-y-2">
      <label htmlFor={id} className="block text-[11px] font-bold uppercase tracking-[0.16em] text-[#374151]">
        {label}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        autoComplete={autoComplete}
        className="w-full h-[52px] rounded-xl border border-[#E5E7EB] bg-[#F3F4F6] px-4 text-sm font-medium text-heading outline-none transition-colors focus:border-orange-primary focus:bg-white focus:ring-2 focus:ring-orange-primary/15"
      />
    </div>
  );
}

export function LoginSignUpPage() {
  const [activeTab, setActiveTab] = useState<AuthTab>('sign-in');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { setIsLoggedIn } = useGlobalState();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const requestedTab = (location.state as { tab?: AuthTab } | null)?.tab;
    if (requestedTab === 'sign-in' || requestedTab === 'sign-up') {
      setActiveTab(requestedTab);
    }
  }, [location.state]);

  const handleSubmit = (e: React.FormEvent) => {
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
    if (password.length < 6) {
      toast.error('Password must be at least 6 characters.');
      return;
    }

    setIsLoggedIn(true);
    toast.success(activeTab === 'sign-up' ? 'Account created! Welcome to Choosify.' : 'Welcome back!');
    navigate(location.state?.from || '/dashboard');
  };

  const handleSocialLogin = (provider: 'Google' | 'Facebook') => {
    toast.success(`${provider} login coming soon! Use email for now.`);
  };

  const isSignUp = activeTab === 'sign-up';
  const loginHeroRef = useRef<HTMLElement>(null);

  return (
    <div className="min-h-screen bg-white font-sans text-heading">
      <div className="grid min-h-[min(760px,72vh)] grid-cols-1 lg:grid-cols-2">
        {/* Left marketing panel */}
        <section
          ref={loginHeroRef}
          className={cn(
            'relative flex min-h-[420px] items-center choosify-dark-gradient px-8 py-14 md:px-12 lg:px-16 lg:py-16',
            HERO_SCROLL_CUE_PADDING,
          )}
        >
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,91,0,0.2),transparent_45%)]" />
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,rgba(0,4,53,0.35),transparent_50%)]" />

          <div className="relative z-10 w-full max-w-xl">
            <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-orange-primary/35 bg-orange-primary/15 px-4 py-2 text-[11px] font-bold uppercase tracking-[0.16em] text-orange-primary">
              <Sparkles size={14} />
              Join 130,000+ Shoppers
            </div>

            <h1 className="text-[2rem] font-extrabold leading-[1.08] tracking-tight text-white sm:text-[2.35rem] lg:text-[2.55rem]">
              Verify Brands.
              <br />
              Compare Easily.
              <br />
              Choose With Confidence.
            </h1>

            <p className="mt-5 max-w-md text-sm leading-relaxed text-white/70 md:text-[15px]">
              Book Mark Products, Track Your Reviews, and get personalized picks from Bangladesh&apos;s #1 Discovery Platform.
            </p>

            <ul className="mt-10 space-y-5">
              {FEATURES.map((feature) => (
                <li key={feature} className="flex items-center gap-4">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-orange-primary text-white shadow-lg shadow-orange-primary/25">
                    <BadgeCheck size={18} strokeWidth={2.5} />
                  </span>
                  <span className="text-sm font-semibold text-white/92 md:text-[15px]">{feature}</span>
                </li>
              ))}
            </ul>
          </div>
          <HeroScrollCue anchorRef={loginHeroRef} scrollTargetId="login-trust-section" />
        </section>

        {/* Right auth panel */}
        <section className="flex items-center justify-center px-6 py-12 md:px-10 lg:px-14 lg:py-16">
          <div className="w-full max-w-[430px]">
            <div className="mb-8 flex w-full rounded-full bg-[#F3F4F6] p-1">
              <button
                type="button"
                onClick={() => setActiveTab('sign-in')}
                className={cn(
                  'flex-1 rounded-full py-3 text-sm font-bold transition-all',
                  !isSignUp ? 'bg-white text-heading shadow-sm' : 'text-[#9CA3AF] hover:text-heading',
                )}
              >
                Sign in
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('sign-up')}
                className={cn(
                  'flex-1 rounded-full py-3 text-sm font-bold transition-all',
                  isSignUp ? 'bg-orange-primary text-white shadow-md shadow-orange-primary/25' : 'text-[#9CA3AF] hover:text-heading',
                )}
              >
                Sign Up
              </button>
            </div>

            <div className="mb-8">
              <h2 className="text-[2rem] font-extrabold leading-tight tracking-tight text-heading">
                {isSignUp ? 'Create your account' : 'Welcome back'}
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-[#6B7280]">
                {isSignUp
                  ? 'Start Saving Your Time in finding Verified Brands'
                  : 'Sign in to access your saved products, reviews, and comparisons.'}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {isSignUp && (
                <AuthField
                  id="full-name"
                  label="Full Name"
                  value={fullName}
                  onChange={setFullName}
                  autoComplete="name"
                />
              )}

              <AuthField
                id="email"
                label="Email"
                type="email"
                value={email}
                onChange={setEmail}
                autoComplete="email"
              />

              <AuthField
                id="password"
                label="Password"
                type="password"
                value={password}
                onChange={setPassword}
                autoComplete={isSignUp ? 'new-password' : 'current-password'}
              />

              <button
                type="submit"
                className="mt-2 flex h-14 w-full items-center justify-center gap-2 rounded-xl bg-orange-primary text-sm font-bold text-white shadow-lg shadow-orange-primary/25 transition-all hover:bg-orange-deep active:scale-[0.99]"
              >
                {isSignUp ? 'Create Account' : 'Sign In'}
                <ChevronRight size={18} />
              </button>
            </form>

            <div className="my-8 flex items-center gap-4">
              <div className="h-px flex-1 bg-[#E5E7EB]" />
              <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#9CA3AF]">Or</span>
              <div className="h-px flex-1 bg-[#E5E7EB]" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => handleSocialLogin('Google')}
                className="flex h-[92px] flex-col items-center justify-center gap-2.5 rounded-xl border border-[#E5E7EB] bg-white text-sm font-semibold text-heading transition-colors hover:bg-[#F9FAFB]"
              >
                <GoogleLogo />
                Google
              </button>
              <button
                type="button"
                onClick={() => handleSocialLogin('Facebook')}
                className="flex h-[92px] flex-col items-center justify-center gap-2.5 rounded-xl border border-[#E5E7EB] bg-white text-sm font-semibold text-heading transition-colors hover:bg-[#F9FAFB]"
              >
                <FacebookLogo />
                Facebook
              </button>
            </div>

            <p className="mt-8 text-center text-sm text-[#6B7280]">
              {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
              <button
                type="button"
                onClick={() => setActiveTab(isSignUp ? 'sign-in' : 'sign-up')}
                className="font-bold text-orange-primary hover:underline"
              >
                {isSignUp ? 'Sign in' : 'Sign up'}
              </button>
            </p>
          </div>
        </section>
      </div>

      {/* Bottom trust section */}
      <section id="login-trust-section" className="border-t border-[#E5E7EB] bg-white px-6 py-14 md:px-10 lg:px-16">
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-12 md:grid-cols-3 md:gap-10">
          {TRUST_COLUMNS.map((column) => {
            const Icon = column.icon;
            return (
              <article key={column.title} className="text-center md:text-left">
                <div className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#F9FAFB] text-[#6B4423] md:mx-0">
                  <Icon size={22} strokeWidth={2.2} />
                </div>
                <h3 className="text-lg font-extrabold text-heading">{column.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-[#6B7280]">{column.body}</p>
              </article>
            );
          })}
        </div>
      </section>
    </div>
  );
}
