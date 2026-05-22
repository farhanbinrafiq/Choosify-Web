import React, { useState } from 'react';
import { AlertTriangle, X, ShieldAlert, CheckCircle2 } from 'lucide-react';
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
    'Other'
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-[#050514]/80 backdrop-blur-sm" onClick={onClose} />
      
      {/* Modal Card */}
      <div className="relative w-full max-w-xl bg-white rounded-[32px] overflow-hidden shadow-high-density border border-gray-100 z-10 p-8 md:p-10 animate-in fade-in zoom-in-95 duration-200">
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 hover:text-navy hover:bg-gray-100 transition-colors"
        >
          <X size={18} />
        </button>

        {submitted ? (
          <div className="text-center py-10">
            <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center text-green-500 mx-auto mb-6">
              <CheckCircle2 size={40} />
            </div>
            <h3 className="text-2xl font-black text-navy italic tracking-tight uppercase mb-3">Report Submitted</h3>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest italic">
              Our safety compliance desk is reviewing your claim.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex items-center gap-4 border-b border-gray-50 pb-6">
              <div className="w-12 h-12 rounded-2xl bg-red-500/10 flex items-center justify-center text-red-500">
                <ShieldAlert size={24} />
              </div>
              <div>
                <h4 className="text-lg font-black text-navy uppercase italic tracking-tight">Report Safe Portal</h4>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest italic">
                  Flagging {type}: <span className="text-orange-primary">{targetName}</span> (ID: {targetId})
                </p>
              </div>
            </div>

            {/* Reason Selection */}
            <div>
              <label className="block text-[9px] font-black uppercase text-gray-400 tracking-widest mb-3 italic">
                Reason for Reporting
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {reasons.map((r, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setReason(r)}
                    className={`px-5 py-3 rounded-2xl text-left text-xs font-bold border transition-all ${
                      reason === r 
                        ? 'bg-navy text-white border-navy shadow-lg shadow-navy/20' 
                        : 'bg-gray-50 text-gray-500 border-gray-100 hover:bg-gray-100'
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>

            {/* Description Details */}
            <div>
              <label className="block text-[9px] font-black uppercase text-gray-400 tracking-widest mb-3 italic">
                Detailed Explanation
              </label>
              <textarea
                required
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe the discrepancy, fake representation, or scam attempt in detail to aid verification..."
                className="w-full bg-gray-50 border border-gray-100 rounded-2xl p-4 text-xs font-bold text-navy placeholder:text-gray-300 focus:outline-none focus:border-navy focus:bg-white transition-all resize-none"
              />
            </div>

            {/* Evidence Link */}
            <div>
              <label className="block text-[9px] font-black uppercase text-gray-400 tracking-widest mb-3 italic">
                Evidence Link / Image URL (Optional)
              </label>
              <input
                type="text"
                value={evidence}
                onChange={(e) => setEvidence(e.target.value)}
                placeholder="https://imgur.com/your-proof.png"
                className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-4 py-3 text-xs font-bold text-navy placeholder:text-gray-300 focus:outline-none focus:border-navy focus:bg-white transition-all"
              />
            </div>

            {/* Actions */}
            <div className="flex gap-4 pt-4 border-t border-gray-50">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-4 bg-gray-50 hover:bg-gray-100 text-gray-500 text-[10px] font-black uppercase tracking-widest rounded-full transition-colors italic"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 py-4 bg-red-500 hover:bg-red-600 text-white text-[10px] font-black uppercase tracking-widest rounded-full transition-all hover:scale-[1.02] active:scale-[0.98] italic"
              >
                Submit Report
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
