import React from 'react';
import { Link } from 'react-router-dom';
import { EmiAiLogo } from '../EmiAiLogo';
import { ChoosifyWordmarkLogo } from '../ChoosifyWordmarkLogo';

/**
 * Shared shell for the secondary consumer auth screens (Forgot Password, Check
 * Email, Reset Password, Reset Success, Verify Email) so they belong to the
 * SAME design family as the approved LoginSignUpPage — navy ground with
 * atmospheric depth, Choosify wordmark, floating "Ask EMI", a single white
 * card, the orange primary CTA. Not a redesign of the login page; a
 * lighter-weight member of its family.
 */
const PAGE_BG = '#18154C';

export function AuthScaffold({
  title,
  subtitle,
  children,
  footer,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}) {
  return (
    <div
      className="auth-shell relative min-h-screen overflow-hidden font-sans choosify-dark-surface"
      style={{ backgroundColor: PAGE_BG }}
    >
      {/* Atmospheric depth — decorative, matches LoginSignUpPage */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
        <div className="auth-dot-grid absolute inset-0 opacity-[0.5]" />
        <div className="absolute -left-[14%] top-[6%] h-[480px] w-[480px] rounded-full bg-[#FF5B00]/10 blur-[130px]" />
        <div className="absolute -right-[16%] top-[22%] h-[520px] w-[520px] rounded-full bg-[#7A3CFF]/14 blur-[150px]" />
        <div className="absolute bottom-[-20%] left-1/2 h-[420px] w-[680px] -translate-x-1/2 rounded-full bg-[#EF3C23]/8 blur-[150px]" />
      </div>
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/15 via-transparent to-black/35"
        aria-hidden
      />

      <div className="relative z-[2] flex min-h-screen flex-col">
        {/* Ask EMI — same placement as LoginSignUpPage */}
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

        <div className="flex flex-1 items-center justify-center px-6 py-12 sm:px-10">
          <div className="w-full max-w-[420px]">
            <div className="mb-6 flex justify-center">
              <Link to="/login" aria-label="Choosify home">
                <ChoosifyWordmarkLogo height={26} className="h-[26px] w-auto" tone="white" />
              </Link>
            </div>
            <div className="rounded-2xl bg-white p-8 shadow-[0_28px_80px_-24px_rgba(0,0,0,0.65)] sm:p-9">
              <h1 className="mb-1 text-[22px] font-extrabold text-[#1A1A2E]">{title}</h1>
              {subtitle ? <p className="mb-5 text-[12.5px] leading-relaxed text-[#9AA0AC]">{subtitle}</p> : <div className="mb-5" />}
              {children}
            </div>
            {footer ? <div className="mt-5 text-center text-[12.5px] text-white/55">{footer}</div> : null}
          </div>
        </div>
      </div>
    </div>
  );
}

/** Orange primary CTA — identical treatment to LoginSignUpPage's submit button. */
export function AuthPrimaryButton({
  children,
  loading,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { loading?: boolean }) {
  return (
    <button
      {...props}
      disabled={props.disabled || loading}
      className={
        'flex w-full items-center justify-center gap-2 rounded-lg border-none bg-[#FF5B00] py-3.5 text-[13px] font-bold text-white transition-all hover:brightness-105 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60 ' +
        (props.className || '')
      }
    >
      {children}
    </button>
  );
}

/** Text field styled like LoginSignUpPage's AuthField. */
export function AuthInput({
  icon: Icon,
  rightSlot,
  label,
  id,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & {
  icon?: React.ComponentType<{ size?: number; className?: string; strokeWidth?: number }>;
  rightSlot?: React.ReactNode;
  label: string;
  id: string;
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
          {...props}
          className={
            'box-border h-[42px] w-full rounded-lg border border-[#E5E7EB] bg-white text-[13px] font-medium text-[#1A1A2E] outline-none transition-colors placeholder:text-[#9AA0AC] focus:border-[#FF5B00] focus:ring-2 focus:ring-[#FF5B00]/15 ' +
            (Icon ? 'pl-10 ' : 'pl-3.5 ') +
            (rightSlot ? 'pr-10 ' : 'pr-3.5 ')
          }
        />
        {rightSlot ? <div className="absolute right-2 top-1/2 -translate-y-1/2">{rightSlot}</div> : null}
      </div>
    </div>
  );
}
