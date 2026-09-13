import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { X, ShieldAlert, CheckCircle2, Loader2 } from 'lucide-react';
import { useGlobalState } from '../context/GlobalStateContext';
import { submitReport, type ReportCategory, type ReportSource } from '../services/reportApi';

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  /** Real backend resourceType vocabulary -- product/brand/creator/guide/review/user, etc. */
  type: string;
  /** The real canonical id of the reported entity (never a name, index, or fabricated value). */
  targetId: string;
  targetName: string;
  source?: ReportSource;
}

const REASONS: Array<{ value: ReportCategory; label: string }> = [
  { value: 'spam', label: 'Spam' },
  { value: 'fraud', label: 'Fraud / Scam' },
  { value: 'abuse', label: 'Harassment / Abuse' },
  { value: 'counterfeit', label: 'Counterfeit / Misleading' },
  { value: 'fake_product', label: 'Fake Product Listing' },
  { value: 'copyright', label: 'Copyright / IP' },
  { value: 'incorrect_information', label: 'Incorrect Information' },
  { value: 'other', label: 'Other' },
];

/**
 * Real end-to-end report flow -- submits to the actual moderation backend
 * (POST /api/moderation/reports, choosify-admin-4.0) so the report lands in
 * Admin > Moderation Center > Reported. No local/fake persistence: this used
 * to push into GlobalStateContext's in-memory `reports` array, which never
 * reached a moderator. Reporter identity always comes from the signed-in
 * user's JWT server-side -- this component never sends a reporter id.
 */
export function ReportModal({ isOpen, onClose, type, targetId, targetName, source }: ReportModalProps) {
  const { isLoggedIn } = useGlobalState();
  const navigate = useNavigate();
  const location = useLocation();
  const [reason, setReason] = useState<ReportCategory>('spam');
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const requiresDetails = reason === 'other';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting || submitted) return;

    if (!isLoggedIn) {
      onClose();
      navigate('/login', { state: { from: location.pathname } });
      return;
    }

    if (requiresDetails && !description.trim()) {
      setError('Please tell us more so our review team understands the issue.');
      return;
    }

    setSubmitting(true);
    setError(null);
    try {
      await submitReport({
        category: reason,
        resourceType: type,
        resourceId: targetId,
        resourceLabel: targetName,
        description: description.trim() || undefined,
        source,
      });
      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        setDescription('');
        setReason('spam');
        onClose();
      }, 2000);
    } catch (err) {
      const status = (err as { status?: number })?.status;
      if (status === 401) {
        onClose();
        navigate('/login', { state: { from: location.pathname } });
        return;
      }
      if (status === 409) {
        setError('You already submitted a similar report recently. Our team is reviewing it.');
      } else if (status === 400) {
        setError(err instanceof Error ? err.message : 'Please check your report details and try again.');
      } else {
        setError('Something went wrong submitting your report. Please try again.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[250] flex items-center justify-center p-4 font-sans">
      <div className="absolute inset-0 bg-[#18154C]/55 backdrop-blur-sm" onClick={onClose} />

      <div className="relative w-full max-w-xl bg-white rounded-2xl overflow-hidden shadow-2xl border border-[#E8EDF2] z-10 p-6 sm:p-8 animate-in fade-in zoom-in-95 duration-200">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-9 h-9 rounded-lg bg-[#F4F7F9] flex items-center justify-center text-[#9AA0AC] hover:text-[#1A1A2E] hover:bg-[#E8EDF2] transition-colors"
        >
          <X size={16} />
        </button>

        {submitted ? (
          <div className="text-center py-10">
            <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-600 mx-auto mb-5">
              <CheckCircle2 size={32} />
            </div>
            <h3 className="text-xl font-extrabold text-[#1A1A2E] tracking-tight mb-2">
              Thanks. Your report has been submitted for review.
            </h3>
            <p className="text-[13px] font-medium text-[#9AA0AC]">
              Our team is reviewing it.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="flex items-center gap-3 border-b border-[#E8EDF2] pb-5">
              <div className="w-11 h-11 rounded-xl bg-red-50 flex items-center justify-center text-red-500 shrink-0">
                <ShieldAlert size={22} />
              </div>
              <div>
                <h4 className="text-lg font-extrabold text-[#1A1A2E] tracking-tight">Report an issue</h4>
                <p className="text-[13px] font-medium text-[#9AA0AC]">
                  Flagging {type}: <span className="text-[#FF5B00]">{targetName}</span>
                </p>
              </div>
            </div>

            {error && (
              <div className="rounded-xl border border-red-200 bg-red-50 px-3.5 py-2.5 text-[12.5px] font-semibold text-red-700">
                {error}
              </div>
            )}

            <div>
              <label className="block text-[12px] font-semibold text-[#9AA0AC] mb-2.5">
                Why are you reporting this?
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {REASONS.map((r) => (
                  <button
                    key={r.value}
                    type="button"
                    onClick={() => setReason(r.value)}
                    className={`px-4 py-2.5 rounded-xl text-left text-[13px] font-semibold border transition-all ${
                      reason === r.value
                        ? 'bg-[#18154C] text-white border-[#18154C]'
                        : 'bg-[#F4F7F9] text-[#1A1A2E]/80 border-[#E8EDF2] hover:border-[#d5dce5]'
                    }`}
                  >
                    {r.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-[12px] font-semibold text-[#9AA0AC] mb-2.5">
                Tell us more {requiresDetails ? '' : '(optional)'}
              </label>
              <textarea
                required={requiresDetails}
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Explain the issue -- don't just repeat the reason above…"
                className="w-full bg-[#F4F7F9] border border-[#E8EDF2] rounded-xl p-3.5 text-sm font-medium text-[#1A1A2E] placeholder:text-[#9AA0AC] focus:outline-none focus:border-[#FF5B00]/40 focus:bg-white transition-all resize-none"
              />
            </div>

            <div className="flex gap-3 pt-4 border-t border-[#E8EDF2]">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-3 bg-[#F4F7F9] hover:bg-[#E8EDF2] text-[#1A1A2E] text-[13px] font-bold tracking-tight rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="flex-1 py-3 bg-red-500 hover:bg-red-600 disabled:opacity-60 text-white text-[13px] font-bold tracking-tight rounded-xl transition-all inline-flex items-center justify-center gap-1.5"
              >
                {submitting && <Loader2 size={14} className="animate-spin" />}
                Submit report
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
