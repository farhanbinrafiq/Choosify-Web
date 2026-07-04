import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Ruler } from 'lucide-react';
import type { CatalogProductSizeGuide } from '../types/catalog';

interface SizeGuideModalProps {
  open: boolean;
  onClose: () => void;
  sizeGuide: CatalogProductSizeGuide;
}

export function SizeGuideModal({ open, onClose, sizeGuide }: SizeGuideModalProps) {
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

  const headers = sizeGuide.columnHeaders?.length
    ? sizeGuide.columnHeaders
    : sizeGuide.rows?.[0]
      ? Object.keys(sizeGuide.rows[0])
      : [];

  return (
    <AnimatePresence>
      {open && (
        <div
          className="fixed inset-0 z-[200] flex items-center justify-center bg-black/75 p-4 overflow-y-auto backdrop-blur-sm"
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          aria-labelledby="size-guide-title"
        >
          <motion.div
            key="size-guide-modal"
            initial={{ scale: 0.95, opacity: 0, y: 12 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 12 }}
            transition={{ type: 'spring', damping: 26, stiffness: 340 }}
            className="bg-white rounded-2xl p-6 max-w-2xl w-full relative text-left shadow-2xl border border-[#e8edf2] my-8"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={onClose}
              className="absolute top-4 right-4 w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 hover:text-[#1A1D4E] cursor-pointer border-none flex items-center justify-center transition-colors"
              aria-label="Close size guide"
            >
              <X size={16} />
            </button>

            <div className="flex items-center gap-2 mb-3 pr-10">
              <div className="w-9 h-9 rounded-full bg-[#FFF0E8] text-[#E8500A] flex items-center justify-center shrink-0">
                <Ruler size={16} />
              </div>
              <div>
                <h3
                  id="size-guide-title"
                  className="text-lg font-black text-[#1A1D4E] uppercase tracking-tight leading-tight"
                >
                  {sizeGuide.title || 'Size Guide'}
                </h3>
                {sizeGuide.unitLabel && (
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                    Measurements in {sizeGuide.unitLabel}
                  </p>
                )}
              </div>
            </div>

            {sizeGuide.description && (
              <p className="text-sm text-gray-600 mb-4 leading-relaxed">
                {sizeGuide.description}
              </p>
            )}

            {sizeGuide.imageUrl && (
              <img
                src={sizeGuide.imageUrl}
                alt={sizeGuide.title || 'Size guide chart'}
                className="w-full rounded-xl border border-[#e8edf2] mb-4 object-contain max-h-[420px] bg-gray-50"
              />
            )}

            {sizeGuide.rows && sizeGuide.rows.length > 0 && headers.length > 0 && (
              <div className="overflow-x-auto rounded-xl border border-[#e8edf2]">
                <table className="w-full text-left text-xs min-w-[320px]">
                  <thead className="bg-[#FFF0E8] text-[#1A1D4E] uppercase tracking-wider text-[9px] font-black">
                    <tr>
                      {headers.map((header) => (
                        <th key={header} className="px-4 py-3 border-b border-[#e8edf2] whitespace-nowrap">
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {sizeGuide.rows.map((row, index) => (
                      <tr key={`${row.size}-${index}`} className="odd:bg-gray-50">
                        {headers.map((header) => (
                          <td
                            key={header}
                            className="px-4 py-2.5 font-semibold text-[#1A1D4E] border-b border-[#e8edf2] whitespace-nowrap"
                          >
                            {row[header] ?? '—'}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
