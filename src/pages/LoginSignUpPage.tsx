import React, { useEffect, useState } from 'react';
import {
  ArrowRight,
  BadgeCheck,
  Check,
  Lock,
  Mail,
  Shield,
  ShieldCheck,
} from 'lucide-react';

import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useGlobalState } from '../context/GlobalStateContext';
import toast from 'react-hot-toast';
import { cn } from '../lib/utils';
import { EmiAiLogo } from '../components/EmiAiLogo';

type AuthTab = 'sign-in' | 'sign-up';

const PAGE_BG = '#000435';
const PRIMARY = '#EB4501';

const SIGNIN_FEATURES = [
  'Save unlimited products & brands',
  'Track your reviews & comparisons',
  'Personalised price drop alerts',
  'Verified-buyer badge on reviews',
  'AI-powered shopping assistant',
];

const TRUST_POINTS = [
  {
    icon: Shield,
    title: 'Trust You Can Rely On',
    sub: 'We verify brands and sellers so you can shop with complete confidence.',
    bg: 'rgba(235, 69, 1,0.18)',
    iconColor: PRIMARY,
  },
  {
    icon: ShieldCheck,
    title: 'Safe & Secure Platform',
    sub: 'Your data and payments are protected with enterprise-grade security.',
    bg: 'rgba(35,35,255,0.18)',
    iconColor: '#2323FF',
  },
  {
    icon: BadgeCheck,
    title: 'Genuine Products Only',
    sub: 'All products are authentic, quality-checked and 100% reliable.',
    bg: 'rgba(7,168,40,0.18)',
    iconColor: '#07A828',
  },
];

/** Decorative blurred collage tiles (optional backdrop). */
const BACKDROP_TILES = [
  { name: 'Wireless Earbuds', price: '৳2,499', hue: 'from-[#1A1D4E] to-[#3A1E22]' },
  { name: 'Leather Tote', price: '৳4,890', hue: 'from-[#2D1B4E] to-[#000435]' },
  { name: 'Smart Watch', price: '৳12,999', hue: 'from-[#0F2A4A] to-[#1A1030]' },
  { name: 'Cotton Panjabi', price: '৳1,850', hue: 'from-[#1E3A2F] to-[#000435]' },
  { name: 'Running Shoes', price: '৳6,450', hue: 'from-[#3A1E22] to-[#1A1030]' },
  { name: 'Perfume Set', price: '৳3,200', hue: 'from-[#2A1848] to-[#000435]' },
  { name: 'Kitchen Blender', price: '৳5,990', hue: 'from-[#1A2A4E] to-[#0A0A1F]' },
  { name: 'Skincare Kit', price: '৳2,150', hue: 'from-[#3A2040] to-[#1a1030]' },
  { name: 'Laptop Stand', price: '৳1,299', hue: 'from-[#0F2840] to-[#000435]' },
  { name: 'Denim Jacket', price: '৳3,750', hue: 'from-[#1A254E] to-[#3A1E22]' },
];

function GoogleLogo() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
      <path fill="#EA4335" d="M12 10.2v3.6h5.1c-.2 1.2-1.5 3.6-5.1 3.6-3.1 0-5.6-2.5-5.6-5.6S8.9 6.2 12 6.2c1.8 0 3 .8 3.7 1.5l2.5-2.4C16.9 3.9 14.7 3 12 3 7 3 3 7 3 12s4 9 9 9c5.2 0 8.6-3.7 8.6-8.9 0-.6-.1-1-.2-1.4H12z" />
    </svg>
  );
}

function FacebookLogo() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
      <path fill="#1877F2" d="M22 12a10 10 0 1 0-11.6 9.9v-7h-2.3V12h2.3V9.8c0-2.3 1.4-3.6 3.5-3.6 1 0 2 .2 2 .2v2.2h-1.1c-1.1 0-1.4.7-1.4 1.4V12h2.4l-.4 2.9h-2v7A10 10 0 0 0 22 12z" />
    </svg>
  );
}

function AppleLogo() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true" fill="currentColor">
      <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.52-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.04 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
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
  icon: Icon,
  placeholder,
}: {
  id: string;
  label: string;
  type?: string;
  value: string;
  onChange: (value: string) => void;
  autoComplete?: string;
  icon?: React.ComponentType<{ size?: number; className?: string; strokeWidth?: number }>;
  placeholder?: string;
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
            'placeholder:text-[#9AA0AC] focus:border-[#EB4501] focus:ring-2 focus:ring-[#EB4501]/15',
            Icon ? 'pl-10 pr-3.5' : 'px-3.5',
          )}
        />
      </div>
    </div>
  );
}

export function LoginSignUpPage() {
  const [activeTab, setActiveTab] = useState<AuthTab>('sign-in');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
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

  const handleSocialLogin = (provider: 'Google' | 'Facebook' | 'Apple') => {
    toast.success(`${provider} login coming soon! Use email for now.`);
  };

  const handleForgotPassword = () => {
    toast('Password reset coming soon. Contact support if you need help.', { icon: '🔑' });
  };

  const isSignUp = activeTab === 'sign-up';

  return (
    <div
      className="min-h-screen font-sans relative overflow-hidden"
      style={{ background: PAGE_BG }}
    >
      {/* Optional blurred product collage backdrop */}
      <div
        className="absolute inset-0 grid grid-cols-5 gap-3.5 px-6 pt-[100px] pb-6 opacity-30 blur-[1px] pointer-events-none"
        aria-hidden
      >
        {BACKDROP_TILES.map((tile) => (
          <div key={tile.name} className="rounded-[10px] overflow-hidden relative h-[180px]">
            <div className={cn('absolute inset-0 bg-gradient-to-br', tile.hue)} />
            <div className="absolute bottom-2 left-2 right-2 text-[10px] text-white font-bold [text-shadow:0_1px_4px_rgba(0,0,0,0.8)]">
              {tile.name}
              <div className="text-[9px] font-extrabold text-[#EB4501]">{tile.price}</div>
            </div>
          </div>
        ))}
      </div>
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'linear-gradient(180deg,rgba(13,15,29,0.75),rgba(13,15,29,0.94) 60%,#000435)',
        }}
      />

      <div className="relative z-[2] flex flex-col min-h-screen">
        {/* Top bar — logo lives in Navbar only; keep help + Ask EMI here */}
        <div className="flex justify-end items-center px-6 sm:px-10 py-6">
          <div className="flex items-center gap-4">
            <Link
              to="/contact"
              className="text-[12.5px] text-white/60 hover:text-white/85 transition-colors hidden sm:inline"
            >
              Need help?
            </Link>
            <Link
              to="/emi"
              className="flex items-center gap-1.5 choosify-emi-gradient rounded-full py-1.5 pl-1.5 pr-3.5 hover:brightness-110 transition-all border-0"
            >
              <span className="w-[22px] h-[22px] rounded-full bg-white flex items-center justify-center overflow-hidden p-px">
                <EmiAiLogo size={18} className="w-[18px] h-[18px]" />
              </span>
              <span className="text-xs font-bold text-white">Ask EMI</span>
            </Link>
          </div>
        </div>

        {/* Two-column center */}
        <div className="flex-1 flex items-center justify-center gap-10 lg:gap-[60px] px-6 sm:px-10 py-5 flex-wrap">
          {/* Left marketing copy */}
          <div className="max-w-[400px] w-full">
            <div className="inline-block bg-[rgba(255,90,44,0.15)] text-[#EB4501] text-[11px] font-bold px-3.5 py-1.5 rounded-full mb-5">
              ✦ Join 100,000+ SHOPPERS
            </div>
            <h1 className="text-[28px] sm:text-[34px] font-extrabold text-white leading-[1.2] mb-[18px]">
              Verify Brands.
              <br />
              Compare Easily.
              <br />
              Choose With <span className="choosify-emi-gradient-text">Confidence</span>
            </h1>
            <p className="text-[13.5px] text-white/55 leading-[1.7] m-0 mb-6">
              Bookmark products, track your reviews, and get personalized picks from Bangladesh&apos;s
              #1 discovery platform.
            </p>
            <ul className="space-y-3.5 list-none p-0 m-0">
              {SIGNIN_FEATURES.map((feature) => (
                <li
                  key={feature}
                  className="flex items-center gap-2.5 text-[13px] text-white/85"
                >
                  <span className="w-5 h-5 flex items-center justify-center shrink-0">
                    <Check size={14} strokeWidth={3} stroke="url(#choosify-emi-icon-grad)" />
                  </span>
                  {feature}
                </li>
              ))}
            </ul>
          </div>

          {/* Right auth card */}
          <div
            className="bg-white rounded-2xl p-8 sm:p-9 w-full max-w-[380px] shadow-[0_20px_60px_rgba(0,0,0,0.5)]"
            style={{ width: 'min(100%, 380px)' }}
          >
            <h2 className="text-[22px] font-extrabold text-[#1A1A2E] mb-1">
              {isSignUp ? 'Create your account' : 'Welcome back'}
            </h2>
            <p className="text-[12.5px] text-[#9AA0AC] mb-5">
              {isSignUp
                ? 'Join Choosify to save products and compare brands'
                : 'Sign in to continue to Choosify'}
            </p>

            {/* Segmented tabs */}
            <div className="flex bg-[#F1F1F3] rounded-lg p-1 mb-5">
              <button
                type="button"
                onClick={() => setActiveTab('sign-in')}
                className={cn(
                  'flex-1 text-center py-2.5 rounded-md text-[12.5px] font-bold transition-all',
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
                  'flex-1 text-center py-2.5 rounded-md text-[12.5px] font-bold transition-all',
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
                placeholder="Enter your email"
              />

              <AuthField
                id="password"
                label="Password"
                type="password"
                value={password}
                onChange={setPassword}
                autoComplete={isSignUp ? 'new-password' : 'current-password'}
                icon={Lock}
                placeholder="Enter your password"
              />

              {!isSignUp && (
                <div className="flex items-center justify-between gap-3">
                  <label className="flex cursor-pointer items-center gap-1.5 text-xs text-[#4B5563]">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="h-3.5 w-3.5 rounded accent-[#EB4501]"
                    />
                    Remember me
                  </label>
                  <button
                    type="button"
                    onClick={handleForgotPassword}
                    className="text-xs font-bold text-[#EB4501] hover:underline"
                  >
                    Forgot password?
                  </button>
                </div>
              )}

              <button
                type="submit"
                className={cn(
                  'w-full py-3.5 rounded-lg text-[13px] font-bold cursor-pointer active:scale-[0.99] transition-all flex items-center justify-center gap-2',
                  isSignUp
                    ? 'choosify-emi-gradient text-white border-none hover:brightness-105'
                    : 'bg-white border border-[#E5E7EB] choosify-emi-gradient-text hover:border-[#D1D5DB]',
                )}
              >
                {isSignUp ? 'Create account' : 'Sign in to Choosify'}
                <ArrowRight
                  size={16}
                  strokeWidth={2.4}
                  stroke={isSignUp ? 'currentColor' : 'url(#choosify-emi-icon-grad)'}
                />
              </button>
            </form>

            <div className="my-5 flex items-center gap-3">
              <div className="h-px flex-1 bg-[#E8EDF2]" />
              <span className="text-[11px] text-[#9AA0AC]">OR</span>
              <div className="h-px flex-1 bg-[#E8EDF2]" />
            </div>

            <div className="flex gap-2.5 mb-5">
              <button
                type="button"
                onClick={() => handleSocialLogin('Google')}
                className="flex-1 border border-[#E5E7EB] bg-white py-2.5 px-1.5 rounded-lg text-[11px] font-semibold cursor-pointer flex items-center justify-center gap-1.5 text-[#1A1A2E] hover:bg-[#F9FAFB] transition-colors"
                aria-label="Continue with Google"
              >
                <GoogleLogo />
                Google
              </button>
              <button
                type="button"
                onClick={() => handleSocialLogin('Facebook')}
                className="flex-1 border border-[#E5E7EB] bg-white py-2.5 px-1.5 rounded-lg text-[11px] font-semibold cursor-pointer flex items-center justify-center gap-1.5 text-[#1877F2] hover:bg-[#F9FAFB] transition-colors"
                aria-label="Continue with Facebook"
              >
                <FacebookLogo />
                Facebook
              </button>
              <button
                type="button"
                onClick={() => handleSocialLogin('Apple')}
                className="flex-1 border border-[#E5E7EB] bg-white py-2.5 px-1.5 rounded-lg text-[11px] font-semibold cursor-pointer flex items-center justify-center gap-1.5 text-[#1A1A2E] hover:bg-[#F9FAFB] transition-colors"
                aria-label="Continue with Apple"
              >
                <AppleLogo />
                Apple
              </button>
            </div>

            <p className="text-center text-[12.5px] text-[#9AA0AC] m-0">
              {isSignUp ? 'Already have an account?' : 'New to Choosify?'}{' '}
              <button
                type="button"
                onClick={() => setActiveTab(isSignUp ? 'sign-in' : 'sign-up')}
                className="text-[#EB4501] font-bold hover:underline"
              >
                {isSignUp ? 'Sign in' : 'Sign up'}
              </button>
            </p>
          </div>
        </div>

        {/* Bottom trust strip */}
        <div className="max-w-[1100px] mx-auto w-full px-6 sm:px-10 pb-10">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 border border-white/12 rounded-[14px] px-5 sm:px-[30px] py-[26px]">
            {TRUST_POINTS.map((point) => {
              const Icon = point.icon;
              return (
                <article key={point.title} className="flex items-start gap-3">
                  <div
                    className="w-[38px] h-[38px] rounded-[10px] flex items-center justify-center shrink-0"
                    style={{ background: point.bg, color: point.iconColor }}
                  >
                    <Icon size={18} strokeWidth={2.1} />
                  </div>
                  <div>
                    <h3 className="text-[13px] font-bold text-white mb-1">{point.title}</h3>
                    <p className="text-[11.5px] text-white/50 leading-normal m-0">{point.sub}</p>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
