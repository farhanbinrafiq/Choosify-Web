import React, { useState } from 'react';
import { X, ShieldAlert, CheckCircle2 } from 'lucide-react';
import { useGlobalState } from '../context/GlobalStateContext';

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'seller' | 'product' | 'brand';
  targetId: string;
  targetName: string;
}

export function ReportModal({ isOpen, onClose, type, targetId, targetName }: ReportModalProps) {
  const { addReport } = useGlobalState();
  const [reason, setReason] = useState('Spam or Scam');
  const [description, setDescription] = useState('');
  const [evidence, setEvidence] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) return;

    addReport(type, targetId, reason, description, evidence || undefined);
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setDescription('');
      setEvidence('');
      onClose();
    }, 2000);
  };

  const reasons = [
    'Spam or Misbehavior',
    'Counterfeit / Fake Products',
    'Incorrect Specifications or Photos',
    'Pricing Manipulation / Fraud',
    'Prohibited or Illegal Material',
    'Poor Business Practice / Abuse',
    'Other',
  ];

  return (
    <div className="fixed inset-0 z-[250] flex items-center justify-center p-4 font-sans">
      <div className="absolute inset-0 bg-[#000435]/55 backdrop-blur-sm" onClick={onClose} />

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
              Report submitted
            </h3>
            <p className="text-[13px] font-medium text-[#9AA0AC]">
              Our team is reviewing your report.
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
                  Flagging {type}: <span className="text-[#EB4501]">{targetName}</span>
                </p>
              </div>
            </div>

            <div>
              <label className="block text-[12px] font-semibold text-[#9AA0AC] mb-2.5">
                Reason
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {reasons.map((r, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setReason(r)}
                    className={`px-4 py-2.5 rounded-xl text-left text-[13px] font-semibold border transition-all ${
                      reason === r
                        ? 'bg-[#000435] text-white border-[#000435]'
                        : 'bg-[#F4F7F9] text-[#1A1A2E]/80 border-[#E8EDF2] hover:border-[#d5dce5]'
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-[12px] font-semibold text-[#9AA0AC] mb-2.5">
                Details
              </label>
              <textarea
                required
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe the issue to help our review team…"
                className="w-full bg-[#F4F7F9] border border-[#E8EDF2] rounded-xl p-3.5 text-sm font-medium text-[#1A1A2E] placeholder:text-[#9AA0AC] focus:outline-none focus:border-[#EB4501]/40 focus:bg-white transition-all resize-none"
              />
            </div>

            <div>
              <label className="block text-[12px] font-semibold text-[#9AA0AC] mb-2.5">
                Evidence link (optional)
              </label>
              <input
                type="text"
                value={evidence}
                onChange={(e) => setEvidence(e.target.value)}
                placeholder="https://…"
                className="w-full bg-[#F4F7F9] border border-[#E8EDF2] rounded-xl px-3.5 py-3 text-sm font-medium text-[#1A1A2E] placeholder:text-[#9AA0AC] focus:outline-none focus:border-[#EB4501]/40 focus:bg-white transition-all"
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
                className="flex-1 py-3 bg-red-500 hover:bg-red-600 text-white text-[13px] font-bold tracking-tight rounded-xl transition-all"
              >
                Submit report
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
