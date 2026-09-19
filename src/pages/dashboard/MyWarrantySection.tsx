import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, X, ChevronDown, ChevronUp, FileText } from 'lucide-react';
import { cn } from '../../lib/utils';
import { operationsApi } from '../../services/operationsApi';
import {
  warrantyClaimsApi,
  type WarrantyClaim,
  type WarrantyClaimIssueType,
  type WarrantyClaimServiceStage,
  type WarrantyClaimResolutionType,
  type WarrantyClaimAttachmentCategory,
  WARRANTY_CLAIM_ATTACHMENT_CATEGORY_LABELS,
} from '../../services/warrantyClaimsApi';
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
  /** Full claim history for this warranty entitlement — newest first. Never just the latest. */
  claims: WarrantyClaim[];
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

// No document exists before the claim is actually accepted and moving
// through repair — buyer already sees seller/staff notes and status updates
// on this page for that. Available from approval through resolution.
const DELIVERY_INVOICE_ELIGIBLE_STATUSES = new Set(['approved', 'service_in_progress', 'resolved']);

const ATTACHMENT_CATEGORIES: WarrantyClaimAttachmentCategory[] = ['warrantyCard', 'productPhoto', 'box', 'receipt'];

function CategoryUpload({
  label,
  files,
  onChange,
}: {
  label: string;
  files: File[];
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  const previews = files.map((f) => URL.createObjectURL(f));
  return (
    <div className="border border-[#E5E7EB] rounded-xl p-2.5">
      <label className="block text-[11px] font-bold text-[#1A1A2E] mb-1.5">{label}</label>
      <input type="file" accept="image/*" multiple onChange={onChange} className="text-[11px]" />
      {previews.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-2">
          {previews.map((src) => (
            <img key={src} src={src} alt="" className="w-12 h-12 rounded-lg object-cover border border-slate-200" />
          ))}
        </div>
      )}
    </div>
  );
}

const STATUS_LABEL: Record<string, string> = {
  submitted: 'Claim Submitted',
  acknowledged: 'Seller Viewed',
  more_info_required: 'More Info Required',
  approved: 'Claim Accepted',
  rejected: 'Rejected',
  service_in_progress: 'Resolution In Progress',
  resolved: 'Resolved',
  cancelled: 'Cancelled',
  disputed: 'Disputed',
};

const SERVICE_STAGE_LABEL: Record<WarrantyClaimServiceStage, string> = {
  return_requested: 'Return Requested',
  in_transit: 'Product In Transit',
  received: 'Product Received',
  under_review: 'Under Review',
  repair_in_progress: 'Repair In Progress',
  replacement_in_progress: 'Replacement In Progress',
  ready_for_dispatch: 'Ready For Dispatch',
  dispatched: 'Dispatched',
  delivered: 'Delivered',
};

const RESOLUTION_TYPE_LABEL: Record<WarrantyClaimResolutionType, string> = {
  repaired: 'Repaired',
  replaced: 'Replaced',
  refunded: 'Refunded',
  rejected: 'Rejected',
  no_fault_found: 'No Fault Found',
  other: 'Other',
};

/** What the buyer should expect next, given the current status/stage — informational only, never a fabricated SLA. */
function nextExpectedStep(claim: WarrantyClaim): string | null {
  switch (claim.status) {
    case 'submitted':
      return 'Waiting for the seller to review your claim.';
    case 'acknowledged':
      return 'The seller has seen your claim and is deciding next steps.';
    case 'more_info_required':
      return 'Please provide the additional information the seller requested.';
    case 'approved':
      return 'Your claim was accepted — the seller will begin resolving it shortly.';
    case 'service_in_progress':
      return claim.serviceStage === 'return_requested' || claim.serviceStage === 'in_transit'
        ? 'Send the product back as instructed by the seller.'
        : 'The seller is working on a repair, replacement, or resolution.';
    default:
      return null;
  }
}

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
  const [expandedItem, setExpandedItem] = useState<string | null>(null);
  const [expandedClaim, setExpandedClaim] = useState<string | null>(null);

  const load = () => {
    setLoading(true);
    Promise.all([
      operationsApi.listOrders({ buyerId: currentUser.id }),
      warrantyClaimsApi.list(currentUser.id).catch(() => [] as WarrantyClaim[]),
    ])
      .then(([orders, claims]) => {
        // Full history per item — newest first. Never keep only the latest.
        const claimsByItem = new Map<string, WarrantyClaim[]>();
        for (const c of claims) {
          const list = claimsByItem.get(c.orderItemId) || [];
          list.push(c);
          claimsByItem.set(c.orderItemId, list);
        }
        for (const list of claimsByItem.values()) {
          list.sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime());
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
              const itemClaims = itemId ? claimsByItem.get(itemId) || [] : [];
              const latestClaim = itemClaims[0];

              let status: DerivedStatus;
              if (latestClaim && OPEN_CLAIM_STATUSES.has(latestClaim.status)) {
                status = 'CLAIM_OPEN';
              } else if (latestClaim && (latestClaim.status === 'resolved' || latestClaim.status === 'rejected')) {
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
                claims: itemClaims,
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
            const hasOpenClaim = item.claims.some((c) => OPEN_CLAIM_STATUSES.has(c.status));
            const warrantyActive = item.status !== 'OUT_OF_WARRANTY';
            const canClaim = warrantyActive && !hasOpenClaim;
            const isExpanded = expandedItem === item.orderItemId;
            return (
              <div key={item.orderItemId} className="bg-white border border-[#E8EDF2] rounded-[10px] p-4" data-testid="warranty-item-row">
                <div className="flex gap-3">
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
                      {warrantyActive ? 'Warranty Active' : 'Expired'} · Expires{' '}
                      {new Date(item.warrantyExpiresAt).toLocaleDateString('en-BD')} · {timeRemaining(item.warrantyExpiresAt)}
                    </p>

                    <div className="flex items-center gap-3 mt-2">
                      {item.claims.length > 0 && (
                        <button
                          onClick={() => setExpandedItem(isExpanded ? null : item.orderItemId)}
                          className="text-[11px] font-bold text-[#1A1A2E] flex items-center gap-1"
                        >
                          Claims made: {item.claims.length}
                          {isExpanded ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
                        </button>
                      )}
                      {canClaim && (
                        <button
                          onClick={() => setClaimTarget(item)}
                          className="text-[11px] font-black uppercase px-3 py-1.5 rounded-lg bg-[#FF5B00] text-white hover:brightness-105"
                          data-testid="claim-warranty-btn"
                        >
                          Claim Warranty
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {isExpanded && item.claims.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-[#F1F1F3] space-y-2">
                    {item.claims.map((claim, idx) => {
                      const claimExpanded = expandedClaim === claim.id;
                      const nextStep = nextExpectedStep(claim);
                      return (
                        <div key={claim.id} className="bg-[#FAFAFB] rounded-lg p-3">
                          <button
                            onClick={() => setExpandedClaim(claimExpanded ? null : claim.id)}
                            className="w-full flex items-center justify-between text-[11.5px]"
                          >
                            <span className="font-bold text-[#1A1A2E]">
                              Claim #{item.claims.length - idx} ({claim.referenceId || claim.id})
                              {claim.resolutionType ? ` — ${RESOLUTION_TYPE_LABEL[claim.resolutionType]}` : ''} —{' '}
                              {STATUS_LABEL[claim.status] || claim.status}
                            </span>
                            {claimExpanded ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
                          </button>

                          {claimExpanded && (
                            <div className="mt-2 text-[11px] text-[#4B5563] space-y-2">
                              <div>Submitted {new Date(claim.submittedAt).toLocaleDateString('en-BD')}</div>
                              {claim.status === 'service_in_progress' && claim.serviceStage && (
                                <div className="font-bold text-[#1A1A2E]">{SERVICE_STAGE_LABEL[claim.serviceStage]}</div>
                              )}
                              {claim.sellerResponse && (
                                <div className="bg-white rounded-lg p-2 border border-[#E8EDF2]">
                                  <span className="font-bold">Latest seller note:</span> {claim.sellerResponse}
                                </div>
                              )}
                              {claim.estimatedCompletionDate && !['resolved', 'rejected', 'cancelled'].includes(claim.status) && (
                                <div>
                                  <span className="font-bold">Estimated completion:</span>{' '}
                                  {new Date(claim.estimatedCompletionDate).toLocaleDateString('en-BD')}
                                </div>
                              )}
                              {nextStep && <div className="italic text-[#9AA0AC]">Next: {nextStep}</div>}
                              {claim.resolutionNotes && (
                                <div>
                                  <span className="font-bold">Outcome:</span> {claim.resolutionNotes}
                                </div>
                              )}

                              {claim.timeline && claim.timeline.length > 0 && (
                                <ol className="space-y-1 border-t border-[#E8EDF2] pt-2">
                                  {claim.timeline.slice().reverse().map((t) => (
                                    <li key={t.id} className="flex gap-2">
                                      <span className="text-[#9AA0AC] shrink-0">{new Date(t.at).toLocaleDateString('en-BD')}</span>
                                      <span>
                                        <span className="font-bold">{STATUS_LABEL[t.status] || t.status}</span>
                                        {t.serviceStage ? ` · ${SERVICE_STAGE_LABEL[t.serviceStage]}` : ''}
                                        {t.note ? ` — ${t.note}` : ''}
                                      </span>
                                    </li>
                                  ))}
                                </ol>
                              )}

                              {DELIVERY_INVOICE_ELIGIBLE_STATUSES.has(claim.status) && (
                              <Link
                                to={`/warranty-claims/${claim.id}/document`}
                                target="_blank"
                                className="inline-flex items-center gap-1 text-[11px] font-bold text-[#FF5B00]"
                              >
                                <FileText size={12} /> Warranty Delivery Invoice
                              </Link>
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
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
  const [filesByCategory, setFilesByCategory] = useState<Record<WarrantyClaimAttachmentCategory, File[]>>({
    warrantyCard: [],
    productPhoto: [],
    box: [],
    receipt: [],
  });
  const [submitting, setSubmitting] = useState(false);

  const totalFileCount = ATTACHMENT_CATEGORIES.reduce((sum, cat) => sum + filesByCategory[cat].length, 0);

  const handleFiles = (cat: WarrantyClaimAttachmentCategory) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const picked = Array.from(e.target.files || []);
    e.target.value = '';
    setFilesByCategory((prev) => ({ ...prev, [cat]: [...prev[cat], ...picked].slice(0, 4) }));
  };

  const submit = async () => {
    if (!description.trim()) {
      toast.error('Please describe the issue.');
      return;
    }
    if (totalFileCount === 0) {
      toast.error('Please attach at least one photo — warranty card, product, box, or receipt.');
      return;
    }
    setSubmitting(true);
    try {
      const attachmentCategories: Partial<Record<WarrantyClaimAttachmentCategory, string[]>> = {};
      for (const cat of ATTACHMENT_CATEGORIES) {
        const catFiles = filesByCategory[cat];
        if (catFiles.length) attachmentCategories[cat] = await uploadWarrantyClaimEvidence(catFiles);
      }
      const result = await warrantyClaimsApi.create({
        orderId: item.orderId,
        orderItemId: item.orderItemId,
        issueType,
        description: description.trim(),
        attachmentCategories,
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

        <div className="mb-1.5 flex items-center justify-between">
          <label className="block text-[10px] font-black uppercase text-slate-500">Evidence — at least one photo required</label>
        </div>
        <div className="space-y-3 mb-3">
          {ATTACHMENT_CATEGORIES.map((cat) => (
            <CategoryUpload
              key={cat}
              label={WARRANTY_CLAIM_ATTACHMENT_CATEGORY_LABELS[cat]}
              files={filesByCategory[cat]}
              onChange={handleFiles(cat)}
            />
          ))}
        </div>

        <button
          onClick={submit}
          disabled={submitting}
          className="w-full py-3 rounded-xl text-white text-sm font-bold bg-[#FF5B00] disabled:opacity-60"
        >
          {submitting ? 'Submitting…' : 'Submit Claim'}
        </button>
      </div>
    </div>
  );
}
