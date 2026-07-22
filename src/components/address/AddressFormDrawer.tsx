import React, { useEffect, useMemo } from 'react';
import { X } from 'lucide-react';
import type { AddressType, CustomerAddressDraft } from '../../lib/address/addressTypes';
import {
  BANGLADESH_COUNTRY,
  BANGLADESH_DIVISIONS,
  getCitiesForUpazila,
  getDistrictsForDivision,
  getPostalCodesForCity,
  getUpazilasForDistrict,
} from '../../lib/address/bangladeshLocations';
import { cn } from '../../lib/utils';
import { SearchableSelectField } from './SearchableSelectField';

const ADDRESS_TYPES: Array<{ id: AddressType; label: string }> = [
  { id: 'home', label: 'Home' },
  { id: 'office', label: 'Office' },
  { id: 'parents', label: 'Parents' },
  { id: 'other', label: 'Other' },
];

function FieldLabel({ children, required = false }: { children: React.ReactNode; required?: boolean }) {
  return (
    <label className="text-[12px] font-semibold text-[#9AA0AC] tracking-tight ml-1">
      {children}
      {required && <span className="text-[#EB4501] ml-1">*</span>}
    </label>
  );
}

function TextField({
  label,
  value,
  onChange,
  required,
  placeholder,
}: {
  label: string;
  value?: string;
  onChange: (value: string) => void;
  required?: boolean;
  placeholder?: string;
}) {
  return (
    <div className="space-y-2">
      <FieldLabel required={required}>{label}</FieldLabel>
      <input
        value={value ?? ''}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="w-full h-12 bg-slate-50 border border-slate-200/60 rounded-2xl px-4 text-xs font-bold text-[#1a1a2e] focus:outline-none focus:ring-2 focus:ring-[#EB4501]/10 focus:border-[#EB4501]/40 focus:bg-white transition-all"
      />
    </div>
  );
}

interface AddressFormDrawerProps {
  open: boolean;
  editing: boolean;
  draft: CustomerAddressDraft;
  errors: Record<string, string>;
  onClose: () => void;
  onSubmit: () => void;
  onDraftChange: (patch: Partial<CustomerAddressDraft>) => void;
  onLocationChange: (patch: Partial<CustomerAddressDraft['location']>) => void;
}

export function AddressFormDrawer({
  open,
  editing,
  draft,
  errors,
  onClose,
  onSubmit,
  onDraftChange,
  onLocationChange,
}: AddressFormDrawerProps) {
  const districts = useMemo(
    () => getDistrictsForDivision(draft.location.divisionId),
    [draft.location.divisionId],
  );
  const upazilas = useMemo(
    () => getUpazilasForDistrict(draft.location.districtId),
    [draft.location.districtId],
  );
  const cities = useMemo(
    () => getCitiesForUpazila(draft.location.upazilaId),
    [draft.location.upazilaId],
  );
  const postalCodes = useMemo(
    () => getPostalCodesForCity(draft.location.cityId),
    [draft.location.cityId],
  );

  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center p-3 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="address-form-title"
    >
      <button
        type="button"
        className="absolute inset-0 bg-black/40 backdrop-blur-[1px]"
        onClick={onClose}
        aria-label="Close address form"
      />
      <div className="relative w-full max-w-3xl max-h-[calc(100dvh-1.5rem)] sm:max-h-[min(90dvh,820px)] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200 z-[201]">
        <div className="flex items-center justify-between gap-4 border-b border-[#e8edf2] px-5 py-4 shrink-0">
          <div className="text-left">
            <h2 id="address-form-title" className="text-lg font-extrabold tracking-tight text-[#1A1A2E]">
              {editing ? 'Edit Address' : 'Add New Address'}
            </h2>
            <p className="text-[12px] font-medium text-[#9AA0AC]">
              Bangladesh location selector
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-10 h-10 rounded-xl border border-[#E8EDF2] flex items-center justify-center text-gray-500 hover:text-[#1a1a2e]"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto overflow-x-hidden px-5 py-5 space-y-5 text-left">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <TextField
              label="Address Name"
              required
              value={draft.label}
              onChange={(label) => onDraftChange({ label })}
              placeholder="Home, Office, Parents"
            />
            <div className="space-y-2">
              <FieldLabel required>Address Type</FieldLabel>
              <select
                value={draft.type}
                onChange={(event) => onDraftChange({ type: event.target.value as AddressType })}
                className="w-full h-12 bg-slate-50 border border-slate-200/60 rounded-2xl px-4 text-xs font-bold text-[#1a1a2e] focus:outline-none focus:ring-2 focus:ring-[#EB4501]/10 focus:border-[#EB4501]/40 focus:bg-white transition-all"
              >
                {ADDRESS_TYPES.map((type) => (
                  <option key={type.id} value={type.id}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>
            <TextField
              label="Recipient Name"
              value={draft.recipientName}
              onChange={(recipientName) => onDraftChange({ recipientName })}
              placeholder="Full name"
            />
            <TextField
              label="Phone Number"
              value={draft.phone}
              onChange={(phone) => onDraftChange({ phone })}
              placeholder="+880 1XXX-XXXXXX"
            />
            <SearchableSelectField
              label="Country"
              required
              value={draft.location.countryId}
              onChange={() => undefined}
              options={[BANGLADESH_COUNTRY]}
              disabled
            />
            <SearchableSelectField
              label="Division"
              required
              value={draft.location.divisionId}
              options={BANGLADESH_DIVISIONS}
              onChange={(divisionId) =>
                onLocationChange({
                  divisionId,
                  districtId: '',
                  upazilaId: '',
                  cityId: '',
                  postalCodeId: '',
                  postalCode: '',
                })
              }
            />
            <SearchableSelectField
              label="District"
              required
              value={draft.location.districtId}
              options={districts}
              disabled={!draft.location.divisionId}
              onChange={(districtId) =>
                onLocationChange({
                  districtId,
                  upazilaId: '',
                  cityId: '',
                  postalCodeId: '',
                  postalCode: '',
                })
              }
            />
            <SearchableSelectField
              label="Upazila / Thana"
              value={draft.location.upazilaId}
              options={upazilas}
              disabled={!draft.location.districtId}
              onChange={(upazilaId) =>
                onLocationChange({ upazilaId, cityId: '', postalCodeId: '', postalCode: '' })
              }
            />
            <SearchableSelectField
              label="City / Municipality"
              required
              value={draft.location.cityId}
              options={cities}
              disabled={!draft.location.upazilaId}
              onChange={(cityId) => onLocationChange({ cityId, postalCodeId: '', postalCode: '' })}
            />
            <SearchableSelectField
              label="Postal Code"
              required
              value={draft.location.postalCodeId}
              options={postalCodes}
              disabled={!draft.location.cityId}
              onChange={(postalCodeId) => {
                const postal = postalCodes.find((item) => item.id === postalCodeId);
                onLocationChange({ postalCodeId, postalCode: postal?.postalCode ?? '' });
              }}
            />
            <TextField
              label={draft.isCustomLocation ? 'Custom Area / Road' : 'Area / Road'}
              required
              value={draft.isCustomLocation ? draft.customArea : draft.area}
              onChange={(value) =>
                draft.isCustomLocation
                  ? onDraftChange({ customArea: value })
                  : onDraftChange({ area: value })
              }
              placeholder="Banani DOHS, Road 11"
            />
            <TextField
              label="House / Building"
              required
              value={draft.houseOrBuilding}
              onChange={(houseOrBuilding) => onDraftChange({ houseOrBuilding })}
              placeholder="House 12, Building B"
            />
            <TextField
              label="Apartment / Floor"
              value={draft.floorOrUnit}
              onChange={(floorOrUnit) => onDraftChange({ floorOrUnit })}
              placeholder="3rd floor, Unit 3B"
            />
            <TextField
              label="Landmark"
              value={draft.landmark}
              onChange={(landmark) => onDraftChange({ landmark })}
              placeholder="Near mosque / school"
            />
            <div className="sm:col-span-2">
              <TextField
                label="Delivery Instructions"
                value={draft.deliveryInstructions}
                onChange={(deliveryInstructions) => onDraftChange({ deliveryInstructions })}
                placeholder="Call before arrival"
              />
            </div>
          </div>

          <div className="rounded-[5px] bg-[#fafbfc] border border-[#e8edf2] p-4 space-y-3">
            <p className="text-[10px] font-black uppercase tracking-wider text-[#1a1a2e]">
              Can&apos;t find your area?
            </p>
            <button
              type="button"
              onClick={() => onDraftChange({ isCustomLocation: !draft.isCustomLocation })}
              className={cn(
                'min-h-[44px] px-4 rounded-full text-[10px] font-black uppercase tracking-wider border',
                draft.isCustomLocation
                  ? 'bg-[#EB4501] text-white border-[#EB4501]'
                  : 'bg-white text-[#1a1a2e] border-[#e8edf2]',
              )}
            >
              Use Custom Area
            </button>
            {draft.isCustomLocation && (
              <p className="text-[10px] text-amber-700 font-bold">
                Custom area will be saved with isCustomLocation = true for admin review.
              </p>
            )}
          </div>

          {Object.keys(errors).length > 0 && (
            <div className="rounded-xl border border-rose-100 bg-rose-50 p-3 text-[12px] font-semibold text-rose-700">
              {Object.values(errors)[0]}
            </div>
          )}
        </div>

        <div className="border-t border-[#E8EDF2] px-5 py-4 flex flex-col sm:flex-row sm:justify-end gap-2 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="min-h-[44px] px-5 rounded-xl border border-[#E8EDF2] text-[13px] font-bold text-[#1a1a2e]"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onSubmit}
            className="min-h-[44px] px-5 rounded-xl bg-[#EB4501] text-white text-[13px] font-bold hover:brightness-110"
          >
            Save Address
          </button>
        </div>
      </div>
    </div>
  );
}
