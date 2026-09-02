import React from 'react';
import { Eye, FileCheck2, Pencil, UploadCloud, X } from 'lucide-react';
import type { PrescriptionData } from './PrescriptionDetailsModal';

interface PrescriptionUploadModuleProps {
  data: PrescriptionData | null;
  onOpenModal: () => void;
  onClear: () => void;
}

function summaryParts(data: PrescriptionData): string[] {
  const parts: string[] = [];
  const hasPower =
    data.rightEye.sph || data.rightEye.cyl || data.rightEye.axis ||
    data.leftEye.sph || data.leftEye.cyl || data.leftEye.axis || data.pd;
  if (hasPower) parts.push('Lens power added');
  if (data.fileName) parts.push(`File: ${data.fileName}`);
  return parts;
}

/** Sits directly underneath Add-on Items — required once a prescription lens type is selected. */
export function PrescriptionUploadModule({ data, onOpenModal, onClear }: PrescriptionUploadModuleProps) {
  return (
    <div className="w-full text-left mt-4 pt-4 border-t border-[#F1F1F3]">
      <div className="flex items-center gap-1.5 text-[13px] font-extrabold text-[#1A1A2E] mb-2.5">
        <Eye size={14} className="text-[#FF5B00]" />
        Upload Prescription
      </div>

      {data ? (
        <div className="flex items-start gap-2.5 rounded-lg border border-[#E8EDF2] bg-[#F4F7F9] px-3.5 py-3">
          <div className="w-8 h-8 rounded-full bg-[#07DD05]/10 text-[#07A828] flex items-center justify-center shrink-0">
            <FileCheck2 size={15} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-[11.5px] font-bold text-[#1A1A2E]">Prescription added</div>
            <div className="text-[10.5px] text-[#6B7280]">{summaryParts(data).join(' · ')}</div>
          </div>
          <button
            type="button"
            onClick={onOpenModal}
            className="shrink-0 h-7 px-2.5 rounded-md border border-[#E5E7EB] bg-white text-[10px] font-bold text-[#1A1A2E] hover:border-[#FF5B00] hover:text-[#EF3C23] cursor-pointer inline-flex items-center gap-1"
          >
            <Pencil size={10} />
            Edit
          </button>
          <button
            type="button"
            onClick={onClear}
            className="shrink-0 h-7 w-7 rounded-md border border-[#E5E7EB] bg-white text-[#9AA0AC] hover:text-red-600 hover:border-red-200 cursor-pointer flex items-center justify-center"
            aria-label="Remove prescription details"
          >
            <X size={12} />
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={onOpenModal}
          className="w-full flex items-center gap-2.5 rounded-lg border-[1.5px] border-dashed border-[#FF5B00]/40 bg-[#FFF6EF] px-3.5 py-3 cursor-pointer hover:border-[#FF5B00] transition-colors text-left"
        >
          <div className="w-8 h-8 rounded-full bg-white text-[#FF5B00] flex items-center justify-center shrink-0 border border-[#FF5B00]/20">
            <UploadCloud size={15} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-[11.5px] font-bold text-[#1A1A2E]">Add your lens power / upload prescription</div>
            <div className="text-[10.5px] text-[#6B7280]">Required for prescription lenses — required before checkout</div>
          </div>
        </button>
      )}
    </div>
  );
}
