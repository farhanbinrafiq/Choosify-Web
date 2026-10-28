/**
 * Owned-but-not-verified label. "Verified" is shown elsewhere and only for an
 * admin-approved, fully documented verification; owners whose documents are
 * still in review see "Verification pending", everyone else "Not yet verified".
 */
export function VerificationPill({ verification, className = '' }: { verification?: 'pending' | 'none'; className?: string }) {
  const pending = verification === 'pending';
  return (
    <span
      data-testid="verification-pill"
      title={
        pending
          ? 'The owner has submitted documents; Choosify is reviewing them.'
          : 'The owner has not completed document verification with Choosify yet.'
      }
      className={`inline-block rounded-full border px-2 py-0.5 text-[10px] font-bold ${
        pending ? 'border-amber-200 bg-amber-50 text-amber-700' : 'border-[#E5E7EB] bg-[#F4F7F9] text-[#6B7280]'
      } ${className}`}
    >
      {pending ? 'Verification pending' : 'Not yet verified'}
    </span>
  );
}
