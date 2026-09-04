import React, { useEffect, useState } from 'react';
import {
  ArrowRight,
  Check,
  Eye,
  EyeOff,
  Footprints,
  GitCompareArrows,
  Headphones,
  Lock,
  Mail,
  Shield,
  ShieldCheck,
  ShoppingBag,
  Star,
  User,
  Watch,
} from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useGlobalState } from '../context/GlobalStateContext';
import { toast } from '../lib/notify';
import { cn } from '../lib/utils';
import { EmiAiLogo } from '../components/EmiAiLogo';
import { ChoosifyWordmarkLogo } from '../components/ChoosifyWordmarkLogo';
import { SocialAuthButtons } from '../components/auth/SocialAuthButtons';
import {
  firebaseAuthErrorMessage,
  registerWithEmailPassword,
  resolveSessionUser,
  signInWithEmailPassword,
} from '../lib/authSession';
import type { SessionIdentity } from '../lib/authSession';

type AuthTab = 'sign-in' | 'sign-up';

const PAGE_BG = '#18154C';
const PRIMARY = '#FF5B00';

/** Strongest three only — the full list lives on the marketing site. */
const SIGNIN_FEATURES = [
  'Save products & brands',
  'Track reviews & comparisons',
  'Get personalized recommendations',
];

/** Bottom trust strip — integrated with the background, not another card. */
const TRUST_POINTS = [
  {
    icon: Lock,
    title: 'Secure sign-in',
    sub: 'Your account is protected',
    iconColor: PRIMARY,
  },
  {
    icon: ShieldCheck,
    title: 'Verified seller ecosystem',
    sub: 'Only trusted brands',
    iconColor: '#2323FF',
  },
  {
    icon: Shield,
    title: 'Privacy protected',
    sub: 'Your data stays private',
    iconColor: '#07A828',
  },
];

/**
 * Decorative product-ecosystem cards for the empty outer space on large
 * desktop only. NOT catalog data — no images fetched, no API calls, no records.
 */
type EcoCard = {
  name: string;
  price: string;
  rating: string;
  icon: React.ComponentType<{ size?: number; className?: string; strokeWidth?: number }>;
  /** absolute-position + rotation classes */
  pos: string;
  rotate: string;
};

const ECOSYSTEM_LEFT: EcoCard[] = [
  {
    name: 'Wireless Earbuds',
    price: '৳2,499',
    rating: '4.8',
    icon: Headphones,
    pos: 'left-[3%] top-[16%] min-[1600px]:left-[5%]',
    rotate: '-rotate-[5deg]',
  },
  {
    name: 'Leather Tote',
    price: '৳4,890',
    rating: '4.7',
    icon: ShoppingBag,
    pos: 'left-[2%] top-[52%] min-[1600px]:left-[4%]',
    rotate: 'rotate-[4deg]',
  },
];

const ECOSYSTEM_RIGHT: EcoCard[] = [
  {
    name: 'Running Shoes',
    price: '৳6,490',
    rating: '4.6',
    icon: Footprints,
    pos: 'right-[3%] top-[13%] min-[1600px]:right-[5%]',
    rotate: 'rotate-[5deg]',
  },
  {
    name: 'Classic Watch',
    price: '৳3,250',
    rating: '4.7',
    icon: Watch,
    pos: 'right-[2%] top-[50%] min-[1600px]:right-[4%]',
    rotate: '-rotate-[4deg]',
  },
];

/** Decorative floating chips around the central composition. */
const FEATURE_CHIPS: {
  label: string;
  icon: React.ComponentType<{ size?: number; className?: string; strokeWidth?: number }>;
  pos: string;
}[] = [
  { label: 'Verified Sellers', icon: ShieldCheck, pos: 'left-[16%] top-[30%]' },
  { label: 'Compare Easily', icon: GitCompareArrows, pos: 'left-[15%] top-[52%]' },
  { label: 'Best Match', icon: Star, pos: 'right-[16%] top-[28%]' },
  { label: 'Secure & Safe', icon: Lock, pos: 'right-[15%] top-[50%]' },
];

/** A handful of tiny brand-tinted nodes drifting along the orbital band. */
const ORBIT_NODES: { pos: string; cls: string }[] = [
  { pos: 'left-[19%] top-[22%]', cls: 'h-1.5 w-1.5 bg-[#FF5B00]/50 shadow-[0_0_10px_2px_rgba(255,91,0,0.22)]' },
  { pos: 'right-[20%] top-[18%]', cls: 'h-1 w-1 bg-[#7A3CFF]/55' },
  { pos: 'right-[13%] top-[58%]', cls: 'h-1.5 w-1.5 bg-[#EF3C23]/45 shadow-[0_0_10px_2px_rgba(239,60,35,0.18)]' },
  { pos: 'left-[12%] top-[62%]', cls: 'h-1 w-1 bg-white/25' },
  { pos: 'left-[30%] top-[12%]', cls: 'h-1 w-1 bg-[#7A3CFF]/45' },
  { pos: 'right-[31%] top-[70%]', cls: 'h-1 w-1 bg-white/20' },
];

function EcosystemCard({ card }: { card: EcoCard }) {
  const Icon = card.icon;
  return (
    <div
      aria-hidden
      className={cn(
        'absolute w-[150px] rounded-2xl border border-white/10 bg-white/[0.045] p-3.5 text-left',
        'shadow-[0_20px_50px_-20px_rgba(0,0,0,0.6)] backdrop-blur-[3px] pointer-events-none select-none',
        card.pos,
        card.rotate,
      )}
    >
      <span className="absolute -inset-px rounded-2xl bg-gradient-to-br from-white/[0.06] to-transparent" />
      <div className="relative">
        <div className="mb-2 flex items-center justify-between">
          <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-white/[0.06] text-white/70">
            <Icon size={15} strokeWidth={2} />
          </span>
          <span className="flex items-center gap-0.5 text-[9.5px] font-bold text-white/60">
            <Star size={9} className="fill-[#FF5B00] text-[#FF5B00]" /> {card.rating}
          </span>
        </div>
        <div className="text-[11px] font-bold text-white/85">{card.name}</div>
        <div className="text-[10px] font-extrabold text-[#FF5B00]">{card.price}</div>
      </div>
    </div>
  );
}

function FeatureChip({
  label,
  icon: Icon,
  pos,
}: {
  label: string;
  icon: React.ComponentType<{ size?: number; className?: string; strokeWidth?: number }>;
  pos: string;
}) {
  return (
    <div
      aria-hidden
      className={cn(
        'absolute flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.05]',
        'px-3 py-1.5 text-[10.5px] font-semibold text-white/70 backdrop-blur-[3px]',
        'shadow-[0_10px_30px_-15px_rgba(0,0,0,0.6)] pointer-events-none select-none',
        pos,
      )}
    >
      <Icon size={12} strokeWidth={2} className="text-[#FF5B00]" />
      {label}
    </div>
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
    <div
      className="auth-shell relative min-h-screen overflow-hidden font-sans choosify-dark-surface"
      style={{ backgroundColor: PAGE_BG }}
    >
      {/* ── Atmospheric depth (decorative, non-interactive) ───────────────── */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
        <div className="auth-dot-grid absolute inset-0 opacity-[0.5]" />
        <div className="absolute -left-[12%] top-[8%] h-[520px] w-[520px] rounded-full bg-[#FF5B00]/10 blur-[130px]" />
        <div className="absolute -right-[14%] top-[24%] h-[560px] w-[560px] rounded-full bg-[#7A3CFF]/14 blur-[150px]" />
        <div className="absolute bottom-[-18%] left-1/2 h-[460px] w-[720px] -translate-x-1/2 rounded-full bg-[#EF3C23]/8 blur-[150px]" />
        {/* subtle dotted orbital paths — centred on the auth composition (large desktop only) */}
        <div className="hidden xl:block auth-orbit absolute left-1/2 top-1/2 h-[740px] w-[740px] -translate-x-1/2 translate-y-[calc(-50%_-_1.25rem)] rounded-full" />
        <div className="hidden min-[1600px]:block auth-orbit auth-orbit--wide absolute left-1/2 top-1/2 h-[1040px] w-[1160px] -translate-x-1/2 translate-y-[calc(-50%_-_1.25rem)] rounded-full" />
        {/* tiny brand-tinted orbital nodes */}
        {ORBIT_NODES.map((n, i) => (
          <span key={i} className={cn('absolute hidden rounded-full xl:block', n.pos, n.cls)} />
        ))}
      </div>
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/15 via-transparent to-black/35"
        aria-hidden
      />

      {/* ── Decorative product ecosystem — large desktop only ─────────────── */}
      <div className="pointer-events-none absolute inset-0 hidden xl:block" aria-hidden>
        {ECOSYSTEM_LEFT.map((c) => (
          <EcosystemCard key={c.name} card={c} />
        ))}
        {ECOSYSTEM_RIGHT.map((c) => (
          <EcosystemCard key={c.name} card={c} />
        ))}
        <div className="hidden min-[1600px]:block">
          {FEATURE_CHIPS.map((chip) => (
            <FeatureChip key={chip.label} {...chip} />
          ))}
        </div>
      </div>

      <div className="relative z-[2] flex min-h-screen flex-col">
        {/* Ask EMI — floats independently in the upper-right, no header chrome */}
        <div className="absolute right-6 top-6 z-[3] flex items-center gap-4 sm:right-10">
          <Link
            to="/contact"
            className="hidden text-[12.5px] text-white/60 transition-colors hover:text-white/85 sm:inline"
          >
            Need help?
          </Link>
          <Link
            to="/messages/thread-emi-ai"
            className="flex items-center gap-1.5 rounded-full border-0 py-1.5 pl-1.5 pr-3.5 transition-all hover:brightness-110 choosify-emi-gradient"
          >
            <EmiAiLogo size={22} />
            <span className="text-xs font-bold text-white">Ask EMI</span>
          </Link>
        </div>

        {/* Central composition — card + trust strip as one group, slightly above centre */}
        <div className="flex flex-1 items-center justify-center px-6 py-10 sm:px-10">
          <div className="w-full max-w-[920px] lg:-translate-y-4 min-[1600px]:max-w-[980px] min-[1600px]:-translate-y-8">
            <div className="flex w-full flex-col overflow-hidden rounded-2xl shadow-[0_28px_80px_-24px_rgba(0,0,0,0.65)] lg:flex-row">
              {/* Left marketing copy */}
              <div className="flex min-w-0 flex-1 flex-col p-7 choosify-dark-surface sm:p-9 min-[1600px]:p-11">
                <ChoosifyWordmarkLogo height={26} className="mb-6 h-[26px] w-auto" tone="white" />
                <div className="mb-5 inline-block w-max rounded-full bg-[rgba(255,90,44,0.15)] px-3.5 py-1.5 text-[11px] font-bold text-[#FF5B00]">
                  ✦ Join 100,000+ SHOPPERS
                </div>
                <h1 className="mb-6 text-[28px] font-extrabold leading-[1.2] text-white sm:text-[34px] sm:mb-7">
                  Verify Brands.
                  <br />
                  Compare Easily.
                  <br />
                  Choose With{' '}
                  <span className="choosify-emi-gradient-text">Confidence.</span>
                </h1>
                <p className="m-0 mb-8 text-[13.5px] leading-[1.7] text-white/55">
                  Bookmark products, track reviews, and get personalized picks from
                  Bangladesh&apos;s #1 discovery platform.
                </p>
                <ul className="m-0 list-none space-y-3.5 p-0">
                  {SIGNIN_FEATURES.map((feature) => (
                    <li key={feature} className="flex items-center gap-2.5 text-[13px] text-white/85">
                      <span className="flex h-5 w-5 shrink-0 items-center justify-center">
                        <Check size={14} strokeWidth={3} stroke="url(#choosify-emi-icon-grad)" />
                      </span>
                      {feature}
                    </li>
                  ))}
                </ul>

                {/* Community / social proof */}
                <div className="mt-9 flex items-center gap-3 sm:mt-10">
                  <div className="flex -space-x-2">
                    {['from-[#FF5B00] to-[#EF3C23]', 'from-[#7A3CFF] to-[#2323FF]', 'from-[#0EA5A5] to-[#07A828]'].map(
                      (g, i) => (
                        <span
                          key={i}
                          aria-hidden
                          className={cn(
                            'flex h-7 w-7 items-center justify-center rounded-full border-2 border-[#1B1750] bg-gradient-to-br',
                            g,
                          )}
                        >
                          <User size={12} strokeWidth={2.4} className="text-white/90" />
                        </span>
                      ),
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-0.5 text-[#FF5B00]">
                      {[0, 1, 2, 3, 4].map((i) => (
                        <Star key={i} size={11} className="fill-current" />
                      ))}
                    </div>
                    <p className="m-0 text-[11px] text-white/55">Trusted by 100,000+ smart shoppers</p>
                  </div>
                </div>
              </div>

              {/* Right auth panel — form + handlers unchanged */}
              <div className="w-full bg-white p-8 sm:p-9 lg:w-[400px] lg:shrink-0">
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
                    placeholder="Enter your email"
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
              </div>
            </div>

            {/* Trust strip — integrated with the background, not a card */}
            <div className="mt-8 hidden grid-cols-3 gap-6 px-2 sm:grid">
              {TRUST_POINTS.map((point) => {
                const Icon = point.icon;
                return (
                  <div key={point.title} className="flex items-start gap-2.5">
                    <Icon
                      size={16}
                      strokeWidth={2.1}
                      className="mt-0.5 shrink-0"
                      style={{ color: point.iconColor }}
                    />
                    <div>
                      <h3 className="m-0 text-[12px] font-bold text-white/85">{point.title}</h3>
                      <p className="m-0 text-[11px] leading-normal text-white/45">{point.sub}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
