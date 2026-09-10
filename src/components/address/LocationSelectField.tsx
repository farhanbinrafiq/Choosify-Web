import React from 'react';
import { ListChecks, PencilLine } from 'lucide-react';
import { SearchableSelectField, type SearchableSelectOption } from './SearchableSelectField';

interface LocationSelectFieldProps {
  label: string;
  required?: boolean;
  /** Structured selection (from Choosify's location dataset). */
  value: string;
  options: SearchableSelectOption[];
  onSelect: (id: string) => void;
  /** Manual fallback for a location missing from the dataset. */
  manual: boolean;
  manualValue: string;
  onManualChange: (text: string) => void;
  onEnterManual: () => void;
  onExitManual: () => void;
  /**
   * True when an ancestor location was entered manually, so there is no
   * structured parent to list children from. The field is then manual-only and
   * the "choose from the list instead" switch is hidden.
   */
  lockedManual?: boolean;
  /** Disables the structured selector (e.g. no parent picked yet). */
  disabled?: boolean;
  placeholder?: string;
  manualPlaceholder?: string;
  manualInputMode?: React.HTMLAttributes<HTMLInputElement>['inputMode'];
}

function FieldLabel({ children, required = false }: { children: React.ReactNode; required?: boolean }) {
  return (
    <label className="text-[12px] font-semibold text-[#9AA0AC] tracking-tight ml-1">
      {children}
      {required && <span className="text-[#FF5B00] ml-1">*</span>}
    </label>
  );
}

export function LocationSelectField({
  label,
  required,
  value,
  options,
  onSelect,
  manual,
  manualValue,
  onManualChange,
  onEnterManual,
  onExitManual,
  lockedManual = false,
  disabled = false,
  placeholder = 'Select',
  manualPlaceholder,
  manualInputMode,
}: LocationSelectFieldProps) {
  const showManual = manual || lockedManual;

  if (showManual) {
    return (
      <div className="space-y-2">
        <FieldLabel required={required}>{label}</FieldLabel>
        <input
          value={manualValue}
          onChange={(event) => onManualChange(event.target.value)}
          placeholder={manualPlaceholder ?? `Enter ${label.toLowerCase()}`}
          inputMode={manualInputMode}
          className="w-full h-12 bg-white border border-[#FF5B00]/40 rounded-2xl px-4 text-xs font-bold text-[#1a1a2e] focus:outline-none focus:ring-2 focus:ring-[#FF5B00]/10 focus:border-[#FF5B00]/60 transition-all"
        />
        <div className="flex items-center justify-between gap-2 flex-wrap pl-1">
          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-700">
            <PencilLine size={11} className="shrink-0" />
            Manually entered — not from Choosify&apos;s location list
          </span>
          {!lockedManual && (
            <button
              type="button"
              onClick={onExitManual}
              className="inline-flex items-center gap-1 text-[10px] font-bold text-[#1a1a2e] hover:text-[#FF5B00]"
            >
              <ListChecks size={11} className="shrink-0" />
              Choose from the list instead
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <SearchableSelectField
      label={label}
      required={required}
      value={value}
      options={options}
      disabled={disabled}
      placeholder={placeholder}
      onChange={onSelect}
      onRequestManual={disabled ? undefined : onEnterManual}
      manualActionLabel={`Can't find it? Add ${label.toLowerCase()} manually`}
    />
  );
}
