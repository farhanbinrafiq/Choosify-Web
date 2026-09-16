import React from 'react';
import { StorefrontAuthShell } from './StorefrontAuthShell';

/**
 * Shared shell for the secondary consumer auth screens (Forgot Password, Check
 * Email, Reset Password, Reset Success, Verify Email) so they belong to the
 * SAME design family as the approved LoginSignUpPage — the clean white
 * two-column `StorefrontAuthShell` (brand/marketing left, sharp auth card
 * right). Not a redesign of the login page; a lighter-weight member of its
 * family. Reusing `StorefrontAuthShell` here (rather than each page/scaffold
 * owning its own copy) is what makes every page built on `AuthScaffold`
 * share the same background/layout automatically.
 */
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
    <StorefrontAuthShell>
      <>
        <h1 className="mb-1 text-[22px] font-extrabold text-[#1A1A2E]">{title}</h1>
        {subtitle ? <p className="mb-5 text-[12.5px] leading-relaxed text-[#9AA0AC]">{subtitle}</p> : <div className="mb-5" />}
        {children}
        {footer ? <div className="mt-5 text-center text-[12.5px] text-[#6B7280]">{footer}</div> : null}
      </>
    </StorefrontAuthShell>
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
