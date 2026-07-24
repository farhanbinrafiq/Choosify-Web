import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Eye, UploadCloud, FileText, Trash2 } from 'lucide-react';
import { toast } from '../../lib/notify';

export interface EyePower {
  sph: string;
  cyl: string;
  axis: string;
}

export interface PrescriptionData {
  rightEye: EyePower;
  leftEye: EyePower;
  pd: string;
  notes?: string;
  fileName?: string;
  fileDataUrl?: string;
}

const EMPTY_EYE: EyePower = { sph: '', cyl: '', axis: '' };
const MAX_FILE_BYTES = 8 * 1024 * 1024;

function hasPowerDetails(data: Pick<PrescriptionData, 'rightEye' | 'leftEye' | 'pd'>): boolean {
  return Boolean(
    data.rightEye.sph.trim() ||
      data.rightEye.cyl.trim() ||
      data.rightEye.axis.trim() ||
      data.leftEye.sph.trim() ||
      data.leftEye.cyl.trim() ||
      data.leftEye.axis.trim() ||
      data.pd.trim(),
  );
}

interface PrescriptionDetailsModalProps {
  open: boolean;
  initialData: PrescriptionData | null;
  onClose: () => void;
  onSave: (data: PrescriptionData) => void;
}

/** Popup card — fill lens power and/or upload a prescription document (Eyewear add-ons). */
export function PrescriptionDetailsModal({
  open,
  initialData,
  onClose,
  onSave,
}: PrescriptionDetailsModalProps) {
  const [rightEye, setRightEye] = useState<EyePower>(initialData?.rightEye ?? EMPTY_EYE);
  const [leftEye, setLeftEye] = useState<EyePower>(initialData?.leftEye ?? EMPTY_EYE);
  const [pd, setPd] = useState(initialData?.pd ?? '');
  const [notes, setNotes] = useState(initialData?.notes ?? '');
  const [fileName, setFileName] = useState(initialData?.fileName ?? '');
  const [fileDataUrl, setFileDataUrl] = useState(initialData?.fileDataUrl ?? '');

  useEffect(() => {
    if (!open) return;
    setRightEye(initialData?.rightEye ?? EMPTY_EYE);
    setLeftEye(initialData?.leftEye ?? EMPTY_EYE);
    setPd(initialData?.pd ?? '');
    setNotes(initialData?.notes ?? '');
    setFileName(initialData?.fileName ?? '');
    setFileDataUrl(initialData?.fileDataUrl ?? '');
  }, [open, initialData]);

  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [open, onClose]);

  const handleFile = (file: File | null) => {
    if (!file) return;
    if (file.size > MAX_FILE_BYTES) {
      toast.error('File is too large — please upload under 8MB.');
      return;
    }
    setFileName(file.name);
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = () => setFileDataUrl(String(reader.result || ''));
      reader.readAsDataURL(file);
    } else {
      setFileDataUrl('');
    }
  };

  const powerFilled = hasPowerDetails({ rightEye, leftEye, pd });
  const canSave = powerFilled || Boolean(fileName);

  const handleSave = () => {
    if (!canSave) {
      toast.error('Add your lens power details or upload your prescription — at least one is required.');
      return;
    }
    onSave({ rightEye, leftEye, pd, notes: notes.trim() || undefined, fileName: fileName || undefined, fileDataUrl: fileDataUrl || undefined });
    toast.success('Prescription details saved');
  };

  const eyeField = (
    label: string,
    eye: EyePower,
    setEye: (v: EyePower) => void,
  ) => (
    <div>
      <div className="text-[11px] font-bold text-[#1A1A2E] mb-1.5">{label}</div>
      <div className="grid grid-cols-3 gap-2">
        {(['sph', 'cyl', 'axis'] as const).map((field) => (
          <div key={field}>
            <label className="block text-[9.5px] font-semibold text-[#9AA0AC] uppercase tracking-wide mb-1">
              {field}
            </label>
            <input
              type="text"
              inputMode="decimal"
              value={eye[field]}
              onChange={(e) => setEye({ ...eye, [field]: e.target.value })}
              placeholder="0.00"
              className="w-full h-9 px-2.5 rounded-lg border border-[#E5E7EB] text-[12px] font-medium text-[#1A1A2E] focus:outline-none focus:border-[#EB4501] transition-colors"
            />
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <AnimatePresence>
      {open && (
        <div
          className="fixed inset-0 z-[200] flex items-center justify-center bg-black/75 p-4 overflow-y-auto backdrop-blur-sm"
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          aria-labelledby="prescription-modal-title"
        >
          <motion.div
            key="prescription-modal"
            initial={{ scale: 0.95, opacity: 0, y: 12 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 12 }}
            transition={{ type: 'spring', damping: 26, stiffness: 340 }}
            className="bg-white rounded-2xl p-6 max-w-lg w-full relative text-left shadow-2xl border border-[#e8edf2] my-8"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={onClose}
              className="absolute top-4 right-4 w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 hover:text-[#1A1D4E] cursor-pointer border-none flex items-center justify-center transition-colors"
              aria-label="Close"
            >
              <X size={16} />
            </button>

            <div className="flex items-center gap-2 mb-1 pr-10">
              <div className="w-9 h-9 rounded-full bg-[#FFF0E8] text-[#EB4501] flex items-center justify-center shrink-0">
                <Eye size={16} />
              </div>
              <div>
                <h3 id="prescription-modal-title" className="text-base font-extrabold text-[#1A1A2E] tracking-tight leading-tight">
                  Prescription Details
                </h3>
                <p className="text-[11.5px] font-medium text-[#9AA0AC]">
                  Enter your lens power, upload a document, or both
                </p>
              </div>
            </div>

            <div className="mt-5 flex flex-col gap-4">
              {eyeField('Right Eye (OD)', rightEye, setRightEye)}
              {eyeField('Left Eye (OS)', leftEye, setLeftEye)}

              <div>
                <label className="block text-[11px] font-bold text-[#1A1A2E] mb-1.5">
                  Pupillary Distance (PD)
                </label>
                <input
                  type="text"
                  inputMode="decimal"
                  value={pd}
                  onChange={(e) => setPd(e.target.value)}
                  placeholder="e.g. 62"
                  className="w-full h-9 px-2.5 rounded-lg border border-[#E5E7EB] text-[12px] font-medium text-[#1A1A2E] focus:outline-none focus:border-[#EB4501] transition-colors max-w-[140px]"
                />
              </div>

              <div className="flex items-center gap-3">
                <div className="flex-1 h-px bg-[#F1F1F3]" />
                <span className="text-[10.5px] font-bold text-[#9AA0AC] uppercase tracking-wide">Or / And</span>
                <div className="flex-1 h-px bg-[#F1F1F3]" />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#1A1A2E] mb-1.5">
                  Upload Prescription Document
                </label>
                {fileName ? (
                  <div className="flex items-center gap-2.5 rounded-lg border border-[#E5E7EB] bg-[#F4F7F9] px-3 py-2.5">
                    {fileDataUrl ? (
                      <img src={fileDataUrl} alt="" className="w-10 h-10 rounded-md object-cover shrink-0 border border-[#E8EDF2]" />
                    ) : (
                      <FileText size={18} className="text-[#EB4501] shrink-0" />
                    )}
                    <span className="text-[11.5px] font-semibold text-[#1A1A2E] truncate flex-1">{fileName}</span>
                    <button
                      type="button"
                      onClick={() => {
                        setFileName('');
                        setFileDataUrl('');
                      }}
                      className="shrink-0 w-7 h-7 rounded-md bg-white border border-[#E5E7EB] flex items-center justify-center text-[#9AA0AC] hover:text-red-600 hover:border-red-200 cursor-pointer"
                      aria-label="Remove file"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center gap-1.5 rounded-lg border-[1.5px] border-dashed border-[#D1D5DB] hover:border-[#EB4501]/50 bg-[#FAFAFB] py-5 cursor-pointer transition-colors">
                    <UploadCloud size={20} className="text-[#9AA0AC]" />
                    <span className="text-[11.5px] font-bold text-[#1A1A2E]">Click to upload</span>
                    <span className="text-[10px] text-[#9AA0AC]">JPG, PNG or PDF · up to 8MB</span>
                    <input
                      type="file"
                      accept="image/*,.pdf"
                      className="hidden"
                      onChange={(e) => handleFile(e.target.files?.[0] ?? null)}
                    />
                  </label>
                )}
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#1A1A2E] mb-1.5">
                  Notes for the optician (optional)
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={2}
                  placeholder="Any additional detail about your prescription…"
                  className="w-full px-2.5 py-2 rounded-lg border border-[#E5E7EB] text-[12px] font-medium text-[#1A1A2E] focus:outline-none focus:border-[#EB4501] transition-colors resize-none"
                />
              </div>
            </div>

            <div className="mt-5 flex gap-2.5">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 h-11 rounded-lg border border-[#E5E7EB] bg-white text-[12.5px] font-bold text-[#4B5563] hover:border-[#D1D5DB] cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSave}
                disabled={!canSave}
                className="flex-1 h-11 rounded-lg bg-[#EB4501] text-white text-[12.5px] font-bold hover:bg-[#CF4400] disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer border-none"
              >
                Save Prescription
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
