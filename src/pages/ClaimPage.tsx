import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { CheckCircle2, Clock, FileText, Loader2, ShieldCheck, Upload, XCircle } from 'lucide-react';
import {
  ACTIVE_CLAIM_STATUSES,
  claimsApi,
  type ClaimDocumentSpec,
  type ClaimIntentView,
  type ClaimantDetails,
} from '../services/claimsApi';
import { uploadPrivateVerificationFile } from '../services/mediaUpload';
import { resolvePartnerSignupUrl } from '../lib/partnerSignupOrigin';
import { toast } from '../lib/notify';
import { usePageBreadcrumbs } from '../context/BreadcrumbContext';

/**
 * /claim/:intentId — the one place a community Brand / Creator profile is
 * claimed. The server decides everything (eligibility, required documents,
 * ownership); this page only walks the claimant through it:
 *   signed out          → sign in, or apply as a Seller / Creator (claim carried along)
 *   wrong account type  → explain which account type can claim
 *   eligible            → upload the claim documents privately, then submit
 *   claim exists        → show its status (withdraw while it is open)
 */
export function ClaimPage() {
  const { intentId = '' } = useParams();
  const navigate = useNavigate();
  const [view, setView] = useState<ClaimIntentView | null>(null);
  const [loadError, setLoadError] = useState('');
  const [busy, setBusy] = useState<string>('');
  const [reviewNotice, setReviewNotice] = useState('');
  // The claim reference is not a page name — label the crumb with the profile instead.
  // There is no /claim index page: every crumb is a real route, and the last one
  // keeps the exact claim reference.
  const claimCrumb = { name: 'Ownership claim', path: `/claim/${encodeURIComponent(intentId)}` };
  const listCrumb =
    view?.intent.entityType === 'creator' ? { name: 'Creators', path: '/creators' } : { name: 'Brands', path: '/brands' };
  usePageBreadcrumbs(
    {
      replaceItems: view
        ? [
            { name: 'Home', path: '/' },
            listCrumb,
            ...(view.target.slug ? [{ name: view.target.name, path: `${listCrumb.path}/${view.target.slug}` }] : []),
            claimCrumb,
          ]
        : [{ name: 'Home', path: '/' }, claimCrumb],
    },
    [intentId, view?.intent.entityType, view?.target.name, view?.target.slug],
  );

  const load = useCallback(async () => {
    try {
      setView(await claimsApi.resolveIntent(intentId));
      setLoadError('');
    } catch (error) {
      setLoadError(error instanceof Error ? error.message : 'This claim link is not valid.');
    }
  }, [intentId]);

  useEffect(() => {
    void load();
    claimsApi
      .communityCopy()
      .then((c) => setReviewNotice(c.claimReviewNotice))
      .catch(() => undefined);
  }, [load]);

  const claim = view?.myClaim || null;
  const claimOpen = Boolean(claim && ACTIVE_CLAIM_STATUSES.has(claim.status));
  const editable = Boolean(claim && (claim.status === 'Draft' || claim.status === 'Submitted' || claim.status === 'Under Review'));
  const docsByType = useMemo(() => {
    const m = new Map<string, NonNullable<typeof claim>['documents'][number]>();
    for (const d of claim?.documents || []) if (d.status !== 'rejected' || !m.has(d.type)) m.set(d.type, d);
    return m;
  }, [claim]);
  const details = claim?.claimantDetails || null;
  // A representative claiming a Brand must also show the ID card the brand / company issued them.
  const isRequired = (s: ClaimDocumentSpec) =>
    s.required || (view?.intent.entityType === 'brand' && details?.relationship === 'representative' && s.type === 'Company ID Card');
  const missingRequired = (view?.requiredDocuments || []).filter((s) => isRequired(s) && !docsByType.has(s.type));
  const [editingDetails, setEditingDetails] = useState(false);

  const run = async (key: string, fn: () => Promise<unknown>, success?: string) => {
    setBusy(key);
    try {
      await fn();
      if (success) toast.success(success);
      await load();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Something went wrong. Please try again.');
    } finally {
      setBusy('');
    }
  };

  const ensureDraft = async (): Promise<string> => {
    if (claim && editable) return claim.id;
    const created = await claimsApi.openDraft(view!);
    return created.id;
  };

  const saveDetails = (next: ClaimantDetails) =>
    run(
      'details',
      async () => {
        const claimId = await ensureDraft();
        await claimsApi.saveClaimantDetails(claimId, next);
        setEditingDetails(false);
      },
      'Your details were saved',
    );

  const upload = (spec: ClaimDocumentSpec, file: File) =>
    run(
      `doc:${spec.type}`,
      async () => {
        const claimId = await ensureDraft();
        const uploaded = await uploadPrivateVerificationFile(file);
        await claimsApi.addDocument(claimId, { type: spec.type, name: file.name, doc_url: uploaded.url });
      },
      `${spec.label} uploaded`,
    );

  const nextPath = `/claim/${encodeURIComponent(intentId)}`;
  const partnerSignupHref = view
    ? `${resolvePartnerSignupUrl(view.viewer.requiredRole === 'creator' ? 'creator' : 'seller')}&claim=${encodeURIComponent(intentId)}`
    : '';
  const profileHref = view ? `/${view.intent.entityType === 'brand' ? 'brands' : 'creators'}/${view.target.slug}` : '/';
  const kindLabel = view?.intent.entityType === 'creator' ? 'creator profile' : 'brand';

  if (loadError) {
    return (
      <Shell>
        <div className="text-center">
          <XCircle className="mx-auto mb-3 h-8 w-8 text-[#9AA0AC]" />
          <h1 className="mb-2 text-lg font-extrabold text-[#1A1A2E]">Claim link unavailable</h1>
          <p className="mb-5 text-[13px] text-[#6B7280]">{loadError}</p>
          <Link to="/" className="text-[13px] font-bold text-[#2323FF]">
            Back to Choosify
          </Link>
        </div>
      </Shell>
    );
  }
  if (!view) {
    return (
      <Shell>
        <div className="flex justify-center py-10">
          <Loader2 className="h-6 w-6 animate-spin text-[#9AA0AC]" />
        </div>
      </Shell>
    );
  }

  return (
    <Shell>
      <div className="mb-6 flex items-center gap-4">
        {view.target.image ? (
          <img src={view.target.image} alt="" className="h-14 w-14 shrink-0 rounded-xl border border-[#E8EDF2] object-cover" />
        ) : (
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-[#F4F7F9] text-lg font-extrabold text-[#6B7280]">
            {view.target.name.slice(0, 2).toUpperCase()}
          </div>
        )}
        <div className="min-w-0">
          <div className="text-[11px] font-bold uppercase tracking-wider text-[#9AA0AC]">Ownership claim</div>
          <h1 className="truncate text-xl font-extrabold text-[#1A1A2E]" data-testid="claim-target-name">
            {view.target.name}
          </h1>
          <Link to={profileHref} className="text-[12px] font-semibold text-[#2323FF]">
            View public profile
          </Link>
        </div>
      </div>

      {claim && !editable && <ClosedClaim status={claim.status} feedback={claim.latestFeedback} />}

      {claim && !editable && !view.viewer.isOwner ? (
        view.ownership.claimable ? (
          <Link
            to={profileHref}
            className="inline-block rounded-lg border border-[#E5E7EB] bg-white px-5 py-2.5 text-xs font-semibold text-[#1A1A2E] hover:bg-[#F4F7F9]"
          >
            Start a new claim from the profile page
          </Link>
        ) : null
      ) : view.viewer.isOwner ? (
        <Notice tone="ok">You already own this {kindLabel}. Manage it from your dashboard.</Notice>
      ) : !claimOpen && !view.ownership.claimable ? (
        <Notice tone="muted">
          {view.ownership.state === 'claim_pending'
            ? 'Another ownership claim for this profile is already being reviewed.'
            : 'This profile cannot be claimed.'}{' '}
          If you believe you are the rightful owner, contact Choosify support — ownership disputes are reviewed by staff.
        </Notice>
      ) : !view.viewer.authenticated ? (
        <div className="space-y-4">
          <p className="text-[13px] leading-relaxed text-[#4B5563]">
            To claim this {kindLabel}, sign in with a {view.viewer.requiredRole === 'creator' ? 'Creator' : 'Seller'} account, or
            apply for one — your claim is carried along and no duplicate profile is created.
          </p>
          <div className="flex flex-col gap-2 sm:flex-row">
            <button
              type="button"
              onClick={() => navigate(`/login?next=${encodeURIComponent(nextPath)}`)}
              className="rounded-lg border border-[#FF000D] bg-[#FF000D] px-5 py-2.5 text-xs font-bold text-white hover:brightness-110"
            >
              Sign in to continue
            </button>
            <a
              href={partnerSignupHref}
              className="rounded-lg border border-[#E5E7EB] bg-white px-5 py-2.5 text-center text-xs font-semibold text-[#1A1A2E] hover:bg-[#F4F7F9]"
            >
              Apply as a {view.viewer.requiredRole === 'creator' ? 'Creator' : 'Seller'}
            </a>
          </div>
        </div>
      ) : view.viewer.isStaff ? (
        <Notice tone="muted">
          Choosify staff accounts cannot file ownership claims. Use the ownership assignment workflow in the admin dashboard.
        </Notice>
      ) : !view.viewer.eligible ? (
        <div className="space-y-4">
          <Notice tone="muted">
            {view.intent.entityType === 'brand'
              ? 'Brand claims need a Seller account. Your current account type cannot claim a brand.'
              : 'Creator profile claims need a Creator account. Your current account type cannot claim a creator profile.'}
          </Notice>
          {view.viewer.role === 'customer' || view.viewer.role === 'consumer' ? (
            <a
              href={partnerSignupHref}
              className="inline-block rounded-lg border border-[#FF000D] bg-[#FF000D] px-5 py-2.5 text-xs font-bold text-white hover:brightness-110"
            >
              Apply as a {view.viewer.requiredRole === 'creator' ? 'Creator' : 'Seller'}
            </a>
          ) : (
            <p className="text-[12px] text-[#6B7280]">
              Each Choosify account has one partner type. Sign in with your{' '}
              {view.viewer.requiredRole === 'creator' ? 'Creator' : 'Seller'} account, or contact support.
            </p>
          )}
        </div>
      ) : (
        <div className="space-y-5">
          {claim && claimOpen && claim.status !== 'Draft' ? (
            <Notice tone="pending">
              <span className="font-bold">Claim {claim.status === 'Submitted' ? 'submitted' : 'under review'}.</span> {reviewNotice}
              {claim.latestFeedback && (
                <span className="mt-2 block">
                  <span className="font-bold">Requested by Choosify:</span> {claim.latestFeedback}
                </span>
              )}
            </Notice>
          ) : (
            <p className="text-[13px] leading-relaxed text-[#4B5563]">
              First tell us who you are, then upload the documents below. Everything is stored privately and only Choosify reviewers
              can see it. Claiming does not change the profile until Choosify verifies your documents.
            </p>
          )}

          <ClaimantDetailsSection
            entityType={view.intent.entityType}
            details={details}
            editing={editingDetails || !details}
            canEdit={!claim || editable}
            busy={busy === 'details'}
            disabled={Boolean(busy)}
            onEdit={() => setEditingDetails(true)}
            onCancel={details ? () => setEditingDetails(false) : undefined}
            onSave={(next) => void saveDetails(next)}
          />

          <div className="text-[11px] font-bold uppercase tracking-wider text-[#9AA0AC]">2. Documents</div>
          {!details && (
            <p className="-mt-3 text-[12px] text-[#9AA0AC]" data-testid="claim-docs-locked">
              Save your details above to start uploading documents.
            </p>
          )}
          <ul className={`divide-y divide-[#EEF1F4] rounded-xl border border-[#E8EDF2] ${details ? '' : 'pointer-events-none opacity-50'}`}>
            {view.requiredDocuments.map((spec) => {
              const doc = docsByType.get(spec.type);
              const key = `doc:${spec.type}`;
              return (
                <li key={spec.type} className="flex flex-col gap-2 p-4 sm:flex-row sm:items-center" data-testid={`claim-doc-${spec.type}`}>
                  <div className="min-w-0 flex-1">
                    <div className="text-[13px] font-bold text-[#1A1A2E]">
                      {spec.label} {!isRequired(spec) && <span className="font-medium text-[#9AA0AC]">(optional)</span>}
                    </div>
                    <div className="text-[11.5px] text-[#6B7280]">{spec.hint}</div>
                    {doc && (
                      <div className="mt-1 flex items-center gap-1.5 text-[11.5px] font-semibold text-[#4B5563]">
                        <FileText className="h-3.5 w-3.5" /> {doc.name} ·{' '}
                        <span className={doc.status === 'rejected' ? 'text-red-600' : doc.status === 'approved' ? 'text-[#2E7D32]' : ''}>
                          {doc.status === 'pending' ? 'awaiting review' : doc.status}
                        </span>
                        {doc.notes && <span className="text-[#6B7280]">— {doc.notes}</span>}
                      </div>
                    )}
                  </div>
                  {(!claim || editable) && (
                    <label className="inline-flex cursor-pointer items-center justify-center gap-1.5 rounded-lg border border-[#E5E7EB] bg-white px-3.5 py-2 text-xs font-semibold text-[#1A1A2E] hover:bg-[#F4F7F9]">
                      {busy === key ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Upload className="h-3.5 w-3.5" />}
                      {doc ? 'Replace' : 'Upload'}
                      <input
                        type="file"
                        accept="image/*,application/pdf"
                        className="hidden"
                        disabled={Boolean(busy) || !details}
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          e.target.value = '';
                          if (file) void upload(spec, file);
                        }}
                      />
                    </label>
                  )}
                </li>
              );
            })}
          </ul>

          <div className="flex flex-col gap-2 sm:flex-row">
            {(!claim || claim.status === 'Draft') && (
              <button
                type="button"
                disabled={Boolean(busy) || missingRequired.length > 0 || !claim || !details}
                onClick={() => void run('submit', () => claimsApi.submit(claim!.id), 'Claim submitted for review')}
                data-testid="claim-submit"
                className="rounded-lg border border-[#FF000D] bg-[#FF000D] px-5 py-2.5 text-xs font-bold text-white hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {busy === 'submit' ? 'Submitting…' : 'Submit claim for review'}
              </button>
            )}
            {claim && claimOpen && (
              <button
                type="button"
                disabled={Boolean(busy)}
                onClick={() => {
                  if (window.confirm('Withdraw this ownership claim? You can start a new one later.')) {
                    void run('withdraw', () => claimsApi.withdraw(claim.id), 'Claim withdrawn');
                  }
                }}
                className="rounded-lg border border-[#E5E7EB] bg-white px-5 py-2.5 text-xs font-semibold text-[#6B7280] hover:bg-[#F4F7F9]"
              >
                Withdraw claim
              </button>
            )}
          </div>
          {(!claim || claim.status === 'Draft') && missingRequired.length > 0 && (
            <p className="text-[11.5px] text-[#9AA0AC]">
              Still needed: {[...(details ? [] : ['Your details']), ...missingRequired.map((s) => s.label)].join(', ')}
            </p>
          )}
        </div>
      )}
      {claim?.history?.length ? (
        <div className="mt-6 border-t border-[#EEF1F4] pt-4" data-testid="claim-history">
          <div className="mb-2 text-[11px] font-bold uppercase tracking-wider text-[#9AA0AC]">Claim history</div>
          <ul className="space-y-1.5">
            {claim.history.map((h, i) => (
              <li key={`${h.at}-${i}`} className="text-[12px] text-[#4B5563]">
                <span className="text-[#9AA0AC]">{new Date(h.at).toLocaleString()}</span> · <span className="font-semibold">{h.action}</span>
                {h.details ? <span className="text-[#6B7280]"> — {h.details}</span> : null}
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </Shell>
  );
}

const fieldClass =
  'w-full rounded-lg border border-[#E5E7EB] bg-white px-3 py-2 text-[13px] text-[#1A1A2E] outline-none focus:border-[#2323FF]';
const fieldLabel = 'mb-1 block text-[11px] font-bold uppercase tracking-wider text-[#6B7280]';

/** Step 1 of a claim: who is claiming, their role on the profile and how Choosify reaches them. */
function ClaimantDetailsSection({
  entityType,
  details,
  editing,
  canEdit,
  busy,
  disabled,
  onEdit,
  onCancel,
  onSave,
}: {
  entityType: 'brand' | 'creator';
  details: ClaimantDetails | null;
  editing: boolean;
  canEdit: boolean;
  busy: boolean;
  disabled: boolean;
  onEdit: () => void;
  onCancel?: () => void;
  onSave: (details: ClaimantDetails) => void;
}) {
  const isBrand = entityType === 'brand';
  const [form, setForm] = useState<ClaimantDetails>(
    details || { relationship: 'owner', roleTitle: '', fullName: '', phone: '', email: '' },
  );
  useEffect(() => {
    if (details) setForm(details);
  }, [details]);
  const set = (k: keyof ClaimantDetails, v: string) => setForm((f) => ({ ...f, [k]: v }));
  const complete =
    form.roleTitle.trim().length >= 2 &&
    form.fullName.trim().length >= 2 &&
    /^\+?\d{7,15}$/.test(form.phone.replace(/[\s()-]/g, '')) &&
    /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(form.email.trim());
  const relationshipLabel = (r: ClaimantDetails['relationship']) =>
    r === 'owner' ? (isBrand ? 'Owner of the brand' : 'I am this creator') : isBrand ? 'Authorised representative' : 'Manager / agent';

  return (
    <div className="rounded-xl border border-[#E8EDF2] p-4" data-testid="claimant-details">
      <div className="mb-3 flex items-center justify-between gap-2">
        <div className="text-[11px] font-bold uppercase tracking-wider text-[#9AA0AC]">1. Your details</div>
        {!editing && canEdit && (
          <button type="button" onClick={onEdit} disabled={disabled} className="text-[12px] font-semibold text-[#2323FF]">
            Edit
          </button>
        )}
      </div>
      {!editing && details ? (
        <dl className="grid grid-cols-1 gap-x-4 gap-y-2 text-[13px] sm:grid-cols-2">
          {[
            ['Claiming as', relationshipLabel(details.relationship)],
            ['Role', details.roleTitle],
            ['Full name', details.fullName],
            ['Phone', details.phone],
            ['Official email', details.email],
          ].map(([k, v]) => (
            <div key={k} className="min-w-0">
              <dt className="text-[11px] text-[#9AA0AC]">{k}</dt>
              <dd className="break-words font-semibold text-[#1A1A2E]">{v}</dd>
            </div>
          ))}
        </dl>
      ) : (
        <div className="space-y-3">
          <fieldset>
            <legend className={fieldLabel}>You are claiming as</legend>
            <div className="flex flex-col gap-2 sm:flex-row">
              {(['owner', 'representative'] as const).map((r) => (
                <label
                  key={r}
                  className={`flex flex-1 cursor-pointer items-center gap-2 rounded-lg border px-3 py-2 text-[13px] font-semibold ${
                    form.relationship === r ? 'border-[#2323FF] bg-[#F5F5FF] text-[#1A1A2E]' : 'border-[#E5E7EB] text-[#4B5563]'
                  }`}
                >
                  <input
                    type="radio"
                    name="claimant-relationship"
                    value={r}
                    checked={form.relationship === r}
                    onChange={() => set('relationship', r)}
                    data-testid={`claimant-relationship-${r}`}
                  />
                  {relationshipLabel(r)}
                </label>
              ))}
            </div>
            {isBrand && form.relationship === 'representative' && (
              <p className="mt-1.5 text-[11.5px] text-[#6B7280]">
                Representatives also upload the ID card the brand or company issued them, and an authorisation letter naming them.
              </p>
            )}
          </fieldset>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <label className={fieldLabel} htmlFor="claimant-role">
                Your role {isBrand ? 'at the brand' : ''}
              </label>
              <input
                id="claimant-role"
                className={fieldClass}
                value={form.roleTitle}
                onChange={(e) => set('roleTitle', e.target.value)}
                maxLength={80}
                placeholder={isBrand ? 'e.g. Founder, Managing Director, Marketing Manager' : 'e.g. Creator, Channel manager'}
              />
            </div>
            <div>
              <label className={fieldLabel} htmlFor="claimant-name">
                Full name
              </label>
              <input
                id="claimant-name"
                className={fieldClass}
                value={form.fullName}
                onChange={(e) => set('fullName', e.target.value)}
                maxLength={120}
                autoComplete="name"
              />
            </div>
            <div>
              <label className={fieldLabel} htmlFor="claimant-phone">
                Phone number
              </label>
              <input
                id="claimant-phone"
                className={fieldClass}
                value={form.phone}
                onChange={(e) => set('phone', e.target.value)}
                maxLength={30}
                inputMode="tel"
                autoComplete="tel"
                placeholder="+8801XXXXXXXXX"
              />
            </div>
            <div>
              <label className={fieldLabel} htmlFor="claimant-email">
                Official email address
              </label>
              <input
                id="claimant-email"
                type="email"
                className={fieldClass}
                value={form.email}
                onChange={(e) => set('email', e.target.value)}
                maxLength={160}
                autoComplete="email"
                placeholder={isBrand ? 'name@yourbrand.com' : 'you@example.com'}
              />
            </div>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              disabled={!complete || disabled}
              onClick={() => onSave({ ...form, email: form.email.trim(), fullName: form.fullName.trim(), roleTitle: form.roleTitle.trim(), phone: form.phone.trim() })}
              data-testid="claimant-details-save"
              className="rounded-lg border border-[#1A1A2E] bg-[#1A1A2E] px-4 py-2 text-xs font-bold text-white disabled:cursor-not-allowed disabled:opacity-50"
            >
              {busy ? 'Saving…' : 'Save details'}
            </button>
            {onCancel && (
              <button
                type="button"
                onClick={onCancel}
                className="rounded-lg border border-[#E5E7EB] bg-white px-4 py-2 text-xs font-semibold text-[#6B7280]"
              >
                Cancel
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-[70vh] bg-choosify-feed px-4 py-10">
      <div className="mx-auto w-full max-w-[640px] rounded-2xl border border-[#E8EDF2] bg-white p-5 shadow-[0_2px_10px_rgba(0,0,0,0.03)] sm:p-8">
        {children}
      </div>
    </div>
  );
}

function Notice({ tone, children }: { tone: 'ok' | 'muted' | 'pending'; children: React.ReactNode }) {
  const Icon = tone === 'ok' ? ShieldCheck : tone === 'pending' ? Clock : CheckCircle2;
  return (
    <div
      className={`flex gap-3 rounded-lg border p-4 text-[12.5px] leading-relaxed ${
        tone === 'pending' ? 'border-amber-200 bg-amber-50 text-amber-900' : 'border-[#E8EDF2] bg-[#F8FAFC] text-[#4B5563]'
      }`}
    >
      <Icon className="mt-0.5 h-4 w-4 shrink-0" />
      <div>{children}</div>
    </div>
  );
}

function ClosedClaim({ status, feedback }: { status: string; feedback: string | null }) {
  const text: Record<string, string> = {
    Approved: 'Your claim was approved — you now own this profile.',
    Rejected: 'Your previous claim was not approved.',
    Withdrawn: 'You withdrew your previous claim.',
    Expired: 'Your previous claim expired after a period of inactivity.',
  };
  return (
    <div className="mb-5">
      <Notice tone={status === 'Approved' ? 'ok' : 'muted'}>
        {text[status] || `Claim status: ${status}.`}
        {feedback && status === 'Rejected' && <span className="mt-1 block">Reason: {feedback}</span>}
      </Notice>
    </div>
  );
}
