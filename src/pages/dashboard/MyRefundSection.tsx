import React, { useEffect, useMemo, useState } from 'react';
import { Wallet, X, ChevronDown, ChevronUp } from 'lucide-react';
import type { ReturnRequest } from '../../types/schemas';
import { cn } from '../../lib/utils';
import { operationsApi } from '../../services/operationsApi';
import { uploadReturnEvidence } from '../../services/mediaUpload';
import { useGlobalState } from '../../context/GlobalStateContext';
import { toast } from '../../lib/notify';

/**
 * My Refund — the money-side view of the SAME return/refund cases shown in
 * My Returns, not a separate case model (there is exactly one canonical
 * refund/finance path — see server/operationsRouter.ts's
 * PATCH /operations/returns/:id/refund, which is real escrow-backed money
 * movement, not a status label). This section frames those cases around
 * refund amount/progress and lets a buyer open a NEW refund request for a
 * delivered, not-yet-claimed order item ("Claim Refund") — the same
 * POST /operations/returns the Orders page's return flow already uses.
 */

type RefundPhase = 'awaiting_review' | 'approved_pending' | 'in_transit' | 'processing' | 'processed' | 'rejected' | 'disputed';

function refundPhase(row: ReturnRequest): RefundPhase {
  if (row.status === 'refunded') return 'processed';
  if (row.status === 'rejected') return 'rejected';
  if (row.status === 'dispute') return 'disputed';
  if (row.status === 'received') return 'processing';
  if (row.status === 'returned_in_transit') return 'in_transit';
  if (row.status === 'approved') return 'approved_pending';
  return 'awaiting_review';
}

const PHASE_META: Record<RefundPhase, { text: string; className: string }> = {
  awaiting_review: { text: 'Awaiting review', className: 'bg-amber-50 text-amber-700 border-amber-200' },
  approved_pending: { text: 'Approved · refund pending', className: 'bg-blue-50 text-blue-700 border-blue-200' },
  in_transit: { text: 'Return in transit', className: 'bg-blue-50 text-blue-700 border-blue-200' },
  processing: { text: 'Item received · processing refund', className: 'bg-indigo-50 text-indigo-700 border-indigo-200' },
  processed: { text: 'Refund processed', className: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  rejected: { text: 'Rejected', className: 'bg-rose-50 text-rose-700 border-rose-200' },
  disputed: { text: 'In dispute', className: 'bg-violet-50 text-violet-700 border-violet-200' },
};

type EligibleItem = {
  orderId: string;
  itemId: string;
  productTitle: string;
  image?: string;
};

const REASONS: { value: string; label: string }[] = [
  { value: 'defective', label: 'Defective' },
  { value: 'damaged', label: 'Damaged in delivery' },
  { value: 'wrong_item', label: 'Wrong item sent' },
  { value: 'not_as_described', label: 'Not as described' },
  { value: 'customer_changed_mind', label: 'Changed my mind' },
];

export function MyRefundSection() {
  const { currentUser } = useGlobalState();
  const [cases, setCases] = useState<ReturnRequest[]>([]);
  const [eligibleItems, setEligibleItems] = useState<EligibleItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [claimTarget, setClaimTarget] = useState<EligibleItem | null>(null);

  const load = () => {
    setLoading(true);
    Promise.all([
      operationsApi.listReturns(currentUser.id).catch(() => [] as ReturnRequest[]),
      operationsApi.listOrders({ buyerId: currentUser.id }).catch(() => [] as Record<string, unknown>[]),
    ])
      .then(([returns, orders]) => {
        setCases(returns);

        const claimedItemIds = new Set(returns.map((r) => r.itemId));
        const eligible: EligibleItem[] = [];
        for (const order of orders) {
          const orderId = String((order as any).orderId || (order as any).id || '');
          const subOrders = Array.isArray((order as any).subOrders) ? (order as any).subOrders : [];
          for (const sub of subOrders) {
            const items = Array.isArray(sub?.items) ? sub.items : [];
            for (const item of items) {
              const itemId = String(item?.itemId || '');
              if (!itemId || claimedItemIds.has(itemId)) continue;
              const delivered = sub?.trackingStatus === 'delivered' || order?.status === 'completed';
              if (!delivered) continue;
              eligible.push({
                orderId,
                itemId,
                productTitle: String(item?.productTitle || 'Product'),
                image: typeof item?.image === 'string' ? item.image : undefined,
              });
            }
          }
        }
        setEligibleItems(eligible);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser.id]);

  const refundRelevantCases = useMemo(
    () => cases.filter((c) => c.status !== 'initiated'),
    [cases],
  );
  const awaitingReviewCases = useMemo(() => cases.filter((c) => c.status === 'initiated'), [cases]);

  return (
    <div className="max-w-3xl space-y-6 animate-in fade-in slide-in-from-bottom-5 duration-700">
      <div>
        <h2 className="text-2xl font-extrabold text-[#1A1A2E] tracking-tight mb-1">My Refund</h2>
        <p className="text-[#9AA0AC] text-[12.5px]">Track your refund progress and status, or claim a refund for an eligible order</p>
      </div>

      {eligibleItems.length > 0 && (
        <div className="bg-white border border-[#E8EDF2] rounded-[10px] p-4">
          <div className="text-[13px] font-extrabold text-[#1A1A2E] mb-2">Eligible for a refund claim</div>
          <div className="space-y-2">
            {eligibleItems.map((item) => (
              <div key={item.itemId} className="flex items-center gap-3 justify-between">
                <div className="flex items-center gap-3 min-w-0">
                  <img
                    src={item.image || 'https://placehold.co/48x48?text=Item'}
                    alt={item.productTitle}
                    className="w-10 h-10 rounded-lg object-cover shrink-0 bg-[#F4F7F9]"
                  />
                  <div className="min-w-0">
                    <div className="text-[12.5px] font-bold text-[#1A1A2E] truncate">{item.productTitle}</div>
                    <div className="text-[11px] text-[#9AA0AC]">Order {item.orderId}</div>
                  </div>
                </div>
                <button
                  onClick={() => setClaimTarget(item)}
                  className="text-[11px] font-black uppercase px-3 py-1.5 rounded-lg bg-[#FF5B00] text-white hover:brightness-105 shrink-0"
                  data-testid="claim-refund-btn"
                >
                  Claim Refund
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {loading ? (
        <div className="text-sm text-[#9AA0AC]">Loading…</div>
      ) : refundRelevantCases.length === 0 && awaitingReviewCases.length === 0 ? (
        <div className="py-16 border border-dashed border-[#E8EDF2] rounded-[10px] flex flex-col items-center justify-center text-center bg-white">
          <Wallet className="text-[#9AA0AC] mb-3" size={28} />
          <p className="text-[13px] font-medium text-[#9AA0AC]">No refund requests yet</p>
        </div>
      ) : (
        <div className="space-y-3">
          {[...refundRelevantCases, ...awaitingReviewCases].map((row) => {
            const phase = refundPhase(row);
            const badge = PHASE_META[phase];
            const isExpanded = expanded === row.id;
            return (
              <div key={row.id} className="bg-white border border-[#E8EDF2] rounded-[10px] p-4">
                <button onClick={() => setExpanded(isExpanded ? null : row.id)} className="w-full flex items-center justify-between text-left">
                  <div>
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <h3 className="text-[13.5px] font-extrabold text-[#1A1A2E] font-mono">{row.referenceId || row.id}</h3>
                      <span className={cn('text-[10px] font-bold px-2 py-0.5 rounded-full border', badge.className)}>{badge.text}</span>
                    </div>
                    <p className="text-[11.5px] text-[#9AA0AC]">Order {row.orderId}</p>
                    {typeof row.refundAmount === 'number' && (
                      <p className="text-[12.5px] font-bold text-[#1A1A2E] mt-1">Refund amount: ৳{row.refundAmount.toLocaleString()}</p>
                    )}
                  </div>
                  {isExpanded ? <ChevronUp size={16} className="text-[#9AA0AC] shrink-0" /> : <ChevronDown size={16} className="text-[#9AA0AC] shrink-0" />}
                </button>

                {isExpanded && (
                  <div className="mt-3 pt-3 border-t border-[#F1F1F3] space-y-2 text-[11.5px] text-[#4B5563]">
                    <div>Submitted {new Date(row.createdAt).toLocaleString('en-BD')}</div>
                    {row.returnTrackingId && <div>Return tracking: <span className="font-mono">{row.returnTrackingId}</span></div>}
                    {row.timeline && row.timeline.length > 0 && (
                      <ol className="space-y-1 border-t border-[#E8EDF2] pt-2">
                        {row.timeline.slice().reverse().map((t) => (
                          <li key={t.id} className="flex gap-2">
                            <span className="text-[#9AA0AC] shrink-0">{new Date(t.at).toLocaleDateString('en-BD')}</span>
                            <span>
                              <span className="font-bold text-[#1A1A2E]">{t.status.replace(/_/g, ' ')}</span>
                              {t.note ? ` — ${t.note}` : ''}
                            </span>
                          </li>
                        ))}
                      </ol>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {claimTarget && (
        <ClaimRefundModal
          item={claimTarget}
          buyerId={currentUser.id}
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

function ClaimRefundModal({
  item,
  buyerId,
  onClose,
  onSubmitted,
}: {
  item: EligibleItem;
  buyerId: string;
  onClose: () => void;
  onSubmitted: () => void;
}) {
  const [reason, setReason] = useState(REASONS[0].value);
  const [description, setDescription] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  const [videoLink, setVideoLink] = useState('');
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
    if (files.length === 0 && !videoLink.trim()) {
      toast.error('Please attach at least one evidence photo or a video link.');
      return;
    }
    if (videoLink.trim() && !/^https?:\/\//i.test(videoLink.trim())) {
      toast.error('Video link must start with http:// or https://');
      return;
    }
    setSubmitting(true);
    try {
      const evidenceMediaIds = files.length ? await uploadReturnEvidence(files) : [];
      const result = await operationsApi.createReturn({
        orderId: item.orderId,
        buyerId,
        sellerId: '',
        itemId: item.itemId,
        reason,
        description: description.trim(),
        evidenceMediaIds,
        videoLink: videoLink.trim() || undefined,
        initiatedBy: 'customer',
      });
      toast.success((result as { reused?: boolean }).reused ? 'You already have an open request for this item.' : 'Refund request submitted.');
      onSubmitted();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Failed to submit refund request.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl max-w-md w-full max-h-[85vh] overflow-y-auto p-6" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-black text-[#1A1A2E]">Claim Refund</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="bg-[#F4F7F9] rounded-lg p-3 text-[11px] text-[#4B5563] mb-4">
          <span className="font-bold">Product:</span> {item.productTitle}
          <br />
          <span className="font-bold">Order:</span> {item.orderId}
        </div>

        <label className="block text-[10px] font-black uppercase text-slate-500 mb-1.5">Reason</label>
        <select value={reason} onChange={(e) => setReason(e.target.value)} className="w-full mb-3 p-2.5 border border-[#E5E7EB] rounded-xl text-xs">
          {REASONS.map((r) => (
            <option key={r.value} value={r.value}>{r.label}</option>
          ))}
        </select>

        <label className="block text-[10px] font-black uppercase text-slate-500 mb-1.5">Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          placeholder="Tell us what happened…"
          className="w-full mb-3 p-2.5 border border-[#E5E7EB] rounded-xl text-xs"
        />

        <label className="block text-[10px] font-black uppercase text-slate-500 mb-1.5">Evidence Photos (photo or video link required)</label>
        <input type="file" accept="image/*" multiple onChange={handleFiles} className="text-xs mb-2" />
        {previews.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-3">
            {previews.map((src) => (
              <img key={src} src={src} alt="" className="w-14 h-14 rounded-lg object-cover border border-slate-200" />
            ))}
          </div>
        )}

        <label className="block text-[10px] font-black uppercase text-slate-500 mb-1.5">Video Link (photo or video link required)</label>
        <input
          type="url"
          value={videoLink}
          onChange={(e) => setVideoLink(e.target.value)}
          placeholder="Google Drive link to a video of the issue"
          className="w-full mb-4 p-2.5 border border-[#E5E7EB] rounded-xl text-xs"
        />

        <button
          onClick={submit}
          disabled={submitting}
          className="w-full py-3 rounded-xl text-white text-sm font-bold bg-[#FF5B00] disabled:opacity-60"
        >
          {submitting ? 'Submitting…' : 'Submit Refund Request'}
        </button>
      </div>
    </div>
  );
}
