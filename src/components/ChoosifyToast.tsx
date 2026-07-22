import React from 'react';
import type { Toast } from 'react-hot-toast';
import { AlertCircle, CheckCircle2, Info, Loader2 } from 'lucide-react';
import { cn } from '../lib/utils';

export type ChoosifyToastVariant = 'success' | 'error' | 'info' | 'loading';

export type ChoosifyToastProps = {
  toast: Toast;
  variant?: ChoosifyToastVariant;
  title?: string;
  message?: string;
};

function resolveVariant(toast: Toast, explicit?: ChoosifyToastVariant): ChoosifyToastVariant {
  if (explicit) return explicit;
  if (toast.type === 'error') return 'error';
  if (toast.type === 'loading') return 'loading';
  if (toast.type === 'success') return 'success';
  return 'info';
}

function Icon({ variant }: { variant: ChoosifyToastVariant }) {
  if (variant === 'loading') {
    return <Loader2 size={18} className="text-[#EB4501] animate-spin shrink-0" aria-hidden />;
  }
  if (variant === 'error') {
    return <AlertCircle size={18} className="text-[#FF000D] shrink-0" aria-hidden />;
  }
  if (variant === 'success') {
    return <CheckCircle2 size={18} className="text-[#07DD05] shrink-0" aria-hidden />;
  }
  return <Info size={18} className="text-[#2323FF] shrink-0" aria-hidden />;
}

/** Light card toast — used sitewide via ChoosifyToaster */
export function ChoosifyToast({ toast, variant, title, message }: ChoosifyToastProps) {
  const resolved = resolveVariant(toast, variant);
  const body =
    message ??
    (typeof toast.message === 'string' ? toast.message : String(toast.message ?? ''));

  return (
    <div
      role="status"
      aria-live="polite"
      className={cn(
        'pointer-events-auto w-[min(100vw-2rem,22rem)] rounded-xl border border-[#E8EDF2] bg-white shadow-high-density px-4 py-3 flex items-start gap-3 transition-all duration-200',
        toast.visible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 -translate-y-1 scale-[0.98]',
      )}
    >
      <Icon variant={resolved} />
      <div className="min-w-0 flex-1 text-left">
        {title ? (
          <p className="text-[12px] font-bold text-[#1A1A2E] leading-snug mb-0.5">{title}</p>
        ) : null}
        <p className={cn('text-[12.5px] leading-snug text-[#4B5563]', title && 'text-[12px]')}>
          {body}
        </p>
      </div>
    </div>
  );
}
