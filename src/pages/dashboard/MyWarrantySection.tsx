import React, { useEffect, useMemo, useState } from 'react';
import { ShieldCheck, X } from 'lucide-react';
import { cn } from '../../lib/utils';
import { operationsApi } from '../../services/operationsApi';
import { warrantyClaimsApi, type WarrantyClaim, type WarrantyClaimIssueType } from '../../services/warrantyClaimsApi';
import { uploadWarrantyClaimEvidence } from '../../services/mediaUpload';
import { useGlobalState } from '../../context/GlobalStateContext';
import { toast } from '../../lib/notify';

type DerivedStatus = 'UNDER_WARRANTY' | 'EXPIRING_SOON' | 'OUT_OF_WARRANTY' | 'CLAIM_OPEN' | 'CLAIM_RESOLVED';

type WarrantyItem = {
  orderId: string;
  orderItemId: string;
  productId: string;
  productTitle: string;
  image?: string;
  warrantyMonths: number;
  warrantyProvider?: string;
  warrantyType?: string;
  purchaseDate: string;
  warrantyStartsAt?: string;
  warrantyExpiresAt: string;
  claim?: WarrantyClaim;
  status: DerivedStatus;
};

const STATUS_BADGE: Record<DerivedStatus, { text: string; className: string }> = {
  UNDER_WARRANTY: { text: 'Under warranty', className: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  EXPIRING_SOON: { text: 'Expiring soon', className: 'bg-amber-50 text-amber-700 border-amber-200' },
  OUT_OF_WARRANTY: { text: 'Out of warranty', className: 'bg-slate-50 text-slate-500 border-slate-200' },
  CLAIM_OPEN: { text: 'Claim open', className: 'bg-blue-50 text-blue-700 border-blue-200' },
  CLAIM_RESOLVED: { text: 'Claim resolved', className: 'bg-violet-50 text-violet-700 border-violet-200' },
};

const OPEN_CLAIM_STATUSES = new Set(['submitted', 'acknowledged', 'more_info_required', 'approved', 'service_in_progress']);

const ISSUE_TYPES: { value: WarrantyClaimIssueType; label: string }[] = [
  { value: 'not_powering_on', label: 'Not powering on' },
  { value: 'manufacturing_defect', label: 'Manufacturing defect' },
  { value: 'physical_damage', label: 'Physical damage' },
  { value: 'battery_charging', label: 'Battery/charging' },
  { value: 'performance_software', label: 'Performance/software' },
  { value: 'missing_damaged_accessory', label: 'Missing/damaged accessory' },
  { value: 'other', label: 'Other' },
];

function timeRemaining(expiresAt: string): string {
  const ms = new Date(expiresAt).getTime() - Date.now();
  if (ms <= 0) return 'Expired';
  const days = Math.ceil(ms / (24 * 60 * 60 * 1000));
  if (days > 60) return `${Math.round(days / 30)} months left`;
  return `${days} day${days === 1 ? '' : 's'} left`;
}

export function MyWarrantySection() {
  const { currentUser } = useGlobalState();
  const [items, setItems] = useState<WarrantyItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [claimTarget, setClaimTarget] = useState<WarrantyItem | null>(null);

  const load = () => {
    setLoading(true);
    Promise.all([
      operationsApi.listOrders({ buyerId: currentUser.id }),
      warrantyClaimsApi.list(currentUser.id).catch(() => [] as WarrantyClaim[]),
    ])
      .then(([orders, claims]) => {
        const claimsByItem = new Map<string, WarrantyClaim>();
        for (const c of claims) {
          const existing = claimsByItem.get(c.orderItemId);
          if (!existing || new Date(c.submittedAt) > new Date(existing.submittedAt)) {
            claimsByItem.set(c.orderItemId, c);
          }
        }

        const derived: WarrantyItem[] = [];
        for (const order of orders) {
          const orderId = String((order as any).orderId || (order as any).id || '');
          const createdAt = String((order as any).createdAt || '');
          const subOrders = Array.isArray((order as any).subOrders) ? (order as any).subOrders : [];
          for (const sub of subOrders) {
            const subItems = Array.isArray(sub?.items) ? sub.items : [];
            for (const item of subItems) {
              const warrantyMonths = Number(item?.warrantyMonthsAtPurchase) || 0;
              const warrantyExpiresAt = typeof item?.warrantyExpiresAt === 'string' ? item.warrantyExpiresAt : '';
              if (!warrantyMonths || !warrantyExpiresAt) continue;
              const itemId = String(item?.itemId || '');
              const claim = itemId ? claimsByItem.get(itemId) : undefined;

              let status: DerivedStatus;
              if (claim && OPEN_CLAIM_STATUSES.has(claim.status)) {
                status = 'CLAIM_OPEN';
              } else if (claim && (claim.status === 'resolved' || claim.status === 'rejected')) {
                status = 'CLAIM_RESOLVED';
              } else {
                const daysLeft = (new Date(warrantyExpiresAt).getTime() - Date.now()) / (24 * 60 * 60 * 1000);
                status = daysLeft <= 0 ? 'OUT_OF_WARRANTY' : daysLeft <= 30 ? 'EXPIRING_SOON' : 'UNDER_WARRANTY';
              }

              derived.push({
                orderId,
                orderItemId: itemId,
                productId: String(item?.productId || ''),
                productTitle: String(item?.productTitle || 'Product'),
                image: typeof item?.image === 'string' ? item.image : undefined,
                warrantyMonths,
                warrantyProvider:
                  typeof item?.warrantyProviderAtPurchase === 'string' ? item.warrantyProviderAtPurchase : undefined,
                warrantyType: typeof item?.warrantyTypeAtPurchase === 'string' ? item.warrantyTypeAtPurchase : undefined,
                purchaseDate: createdAt,
                warrantyStartsAt: typeof item?.warrantyStartsAt === 'string' ? item.warrantyStartsAt : undefined,
                warrantyExpiresAt,
                claim,
                status,
              });
            }
          }
        }
        setItems(derived);
      })
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser.id]);

  return (
    <div className="max-w-3xl space-y-6 animate-in fade-in slide-in-from-bottom-5 duration-700">
      <div>
        <h2 className="text-2xl font-extrabold text-[#1A1A2E] tracking-tight mb-1">My Warranty</h2>
        <p className="text-[#9AA0AC] text-[12.5px]">Track warranty coverage and file claims for your purchases</p>
      </div>

      {loading ? (
        <div className="text-sm text-[#9AA0AC]">Loading…</div>
      ) : items.length === 0 ? (
        <div className="py-16 border border-dashed border-[#E8EDF2] rounded-[10px] flex flex-col items-center justify-center text-center bg-white">
          <ShieldCheck className="text-[#9AA0AC] mb-3" size={28} />
          <p className="text-[13px] font-medium text-[#9AA0AC]">No warranty-eligible purchases yet</p>
        </div>
      ) : (
        <div className="space-y-3" data-testid="warranty-item-list">
          {items.map((item) => {
            const badge = STATUS_BADGE[item.status];
            const canClaim = item.status === 'UNDER_WARRANTY' || item.status === 'EXPIRING_SOON';
            return (
              <div key={item.orderItemId} className="bg-white border border-[#E8EDF2] rounded-[10px] p-4 flex gap-3" data-testid="warranty-item-row">
                <img
                  src={item.image || 'https://placehold.co/80x80?text=Product'}
                  alt={item.productTitle}
                  className="w-16 h-16 rounded-lg object-cover shrink-0 bg-[#F4F7F9]"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <h3 className="text-[13.5px] font-extrabold text-[#1A1A2E] truncate">{item.productTitle}</h3>
                    <span className={cn('text-[10px] font-bold px-2 py-0.5 rounded-full border', badge.className)}>
                      {badge.text}
                    </span>
                  </div>
                  <p className="text-[11.5px] text-[#9AA0AC]">Order {item.orderId}</p>
                  <p className="text-[11.5px] text-[#4B5563] mt-1">
                    {item.warrantyMonths}-month warranty{item.warrantyProvider ? ` · ${item.warrantyProvider}` : ''}
                  </p>
                  <p className="text-[11.5px] text-[#9AA0AC]">
                    Expires {new Date(item.warrantyExpiresAt).toLocaleDateString('en-BD')} ·{' '}
                    {timeRemaining(item.warrantyExpiresAt)}
                  </p>
                  {item.claim && (
                    <p className="text-[11px] text-[#9AA0AC] mt-1">
                      Claim status: <span className="font-bold text-[#1A1A2E]">{item.claim.status.replace(/_/g, ' ')}</span>
                    </p>
                  )}
                  {canClaim && !item.claim && (
                    <button
                      onClick={() => setClaimTarget(item)}
                      className="mt-2 text-[11px] font-black uppercase px-3 py-1.5 rounded-lg bg-[#EB4501] text-white hover:brightness-105"
                      data-testid="claim-warranty-btn"
                    >
                      Claim Warranty
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {claimTarget && (
        <ClaimWarrantyModal
          item={claimTarget}
          onClose={() => setClaimTarget(null)}
          onSubmitted={() => {
            setClaimTarget(null);
            load();
          }}
        />
      )}
    </div>
  );
}

function ClaimWarrantyModal({
  item,
  onClose,
  onSubmitted,
}: {
  item: WarrantyItem;
  onClose: () => void;
  onSubmitted: () => void;
}) {
  const [issueType, setIssueType] = useState<WarrantyClaimIssueType>('not_powering_on');
  const [description, setDescription] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  const [submitting, setSubmitting] = useState(false);

  const previews = useMemo(() => files.map((f) => URL.createObjectURL(f)), [files]);

  const handleFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    const picked = Array.from(e.target.files || []);
    e.target.value = '';
    setFiles((prev) => [...prev, ...picked].slice(0, 8));
  };

  const submit = async () => {
    if (!description.trim()) {
      toast.error('Please describe the issue.');
      return;
    }
    setSubmitting(true);
    try {
      const attachmentMediaIds = files.length ? await uploadWarrantyClaimEvidence(files) : [];
      const result = await warrantyClaimsApi.create({
        orderId: item.orderId,
        orderItemId: item.orderItemId,
        issueType,
        description: description.trim(),
        attachmentMediaIds,
      });
      toast.success(result.reused ? 'You already have an open claim for this item.' : 'Warranty claim submitted.');
      onSubmitted();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Failed to submit claim.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl max-w-md w-full max-h-[85vh] overflow-y-auto p-6" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-black text-[#1A1A2E]">Claim Warranty</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="bg-[#F4F7F9] rounded-lg p-3 text-[11px] text-[#4B5563] space-y-1 mb-4">
          <div>
            <span className="font-bold">Product:</span> {item.productTitle}
          </div>
          <div>
            <span className="font-bold">Purchased:</span> {new Date(item.purchaseDate).toLocaleDateString('en-BD')}
          </div>
          <div>
            <span className="font-bold">Warranty period:</span> {item.warrantyMonths} months
          </div>
          <div>
            <span className="font-bold">Expires:</span> {new Date(item.warrantyExpiresAt).toLocaleDateString('en-BD')}
          </div>
        </div>

        <label className="block text-[10px] font-black uppercase text-slate-500 mb-1.5">Issue Type</label>
        <select
          value={issueType}
          onChange={(e) => setIssueType(e.target.value as WarrantyClaimIssueType)}
          className="w-full mb-3 p-2.5 border border-[#E5E7EB] rounded-xl text-xs"
        >
          {ISSUE_TYPES.map((t) => (
            <option key={t.value} value={t.value}>
              {t.label}
            </option>
          ))}
        </select>

        <label className="block text-[10px] font-black uppercase text-slate-500 mb-1.5">Problem Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          placeholder="Describe the issue…"
          className="w-full mb-3 p-2.5 border border-[#E5E7EB] rounded-xl text-xs"
        />

        <label className="block text-[10px] font-black uppercase text-slate-500 mb-1.5">Evidence (photos/video)</label>
        <input type="file" accept="image/*,video/mp4,video/webm" multiple onChange={handleFiles} className="text-xs mb-2" />
        {previews.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-3">
            {previews.map((src, i) => (
              <img key={src} src={src} alt="" className="w-14 h-14 rounded-lg object-cover border border-slate-200" />
            ))}
          </div>
        )}

        <button
          onClick={submit}
          disabled={submitting}
          className="w-full py-3 rounded-xl text-white text-sm font-bold bg-[#EB4501] disabled:opacity-60"
        >
          {submitting ? 'Submitting…' : 'Submit Claim'}
        </button>
      </div>
    </div>
  );
}
