import { useEffect, useState } from 'react';
import { Info } from 'lucide-react';
import { claimsApi } from '../../services/claimsApi';
import type { PublicOwnership } from '../../types/catalog';

let copyCache: Promise<{ brandDisclaimer: string; creatorDisclaimer: string } | null> | null = null;
const loadCopy = () => {
  if (!copyCache) copyCache = claimsApi.communityCopy().catch(() => null);
  return copyCache;
};

/**
 * Public clarification shown on unclaimed community profiles (and while a claim
 * is pending). The text is staff-editable (Admin → Community profiles copy).
 */
export function CommunityProfileNotice({
  entityType,
  ownership,
  onClaim,
  claiming,
}: {
  entityType: 'brand' | 'creator';
  ownership: PublicOwnership | undefined;
  onClaim?: () => void;
  claiming?: boolean;
}) {
  const [text, setText] = useState('');
  const visible = ownership?.state === 'community' || ownership?.state === 'claim_pending';
  useEffect(() => {
    if (!visible) return;
    let cancelled = false;
    void loadCopy().then((copy) => {
      if (!cancelled && copy) setText(entityType === 'brand' ? copy.brandDisclaimer : copy.creatorDisclaimer);
    });
    return () => {
      cancelled = true;
    };
  }, [visible, entityType]);
  if (!visible) return null;
  const pending = ownership?.state === 'claim_pending';
  return (
    <div
      data-testid="community-profile-notice"
      className="mb-6 flex flex-col gap-4 rounded-xl border border-[#E8EDF2] bg-white p-5 shadow-[0_2px_10px_rgba(0,0,0,0.03)] md:flex-row md:items-center"
    >
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#F4F7F9]">
        <Info className="h-5 w-5 text-[#6B7280]" />
      </div>
      <div className="min-w-0 flex-1">
        <div className="mb-1 text-[13px] font-extrabold text-[#1A1A2E]">
          {pending ? 'Community profile · ownership claim under review' : 'Community profile · unclaimed'}
        </div>
        <p className="text-[12px] font-medium leading-relaxed text-[#6B7280]">{text}</p>
      </div>
      {!pending && ownership?.claimable && onClaim && (
        <button
          type="button"
          onClick={onClaim}
          disabled={claiming}
          data-testid="community-claim-cta"
          className="w-full shrink-0 rounded-lg border border-[#FF000D] bg-[#FF000D] px-5 py-2.5 text-xs font-bold text-white hover:brightness-110 disabled:opacity-60 md:w-auto"
        >
          {claiming ? 'Starting…' : entityType === 'brand' ? 'Claim this brand' : 'Claim this profile'}
        </button>
      )}
    </div>
  );
}
