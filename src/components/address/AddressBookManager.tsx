import React, { useState } from 'react';
import {
  AlertTriangle,
  Building2,
  Edit3,
  Home,
  MapPin,
  Plus,
  ShieldCheck,
  Star,
  Trash2,
  Truck,
  Users,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useDashboard } from '../../context/DashboardContext';
import type { AddressType, CustomerAddress, CustomerAddressDraft } from '../../lib/address/addressTypes';
import {
  addressToDraft,
  createEmptyAddressDraft,
  draftToAddress,
  formatAddressLine,
  validateAddressDraft,
} from '../../lib/address/addressUtils';
import { findLocationName } from '../../lib/address/bangladeshLocations';
import { cn } from '../../lib/utils';
import { AddressFormDrawer } from './AddressFormDrawer';

const ADDRESS_TYPES: Array<{ id: AddressType; label: string; icon: React.ElementType }> = [
  { id: 'home', label: 'Home', icon: Home },
  { id: 'office', label: 'Office', icon: Building2 },
  { id: 'parents', label: 'Parents', icon: Users },
  { id: 'other', label: 'Other', icon: MapPin },
];

function statusMeta(status: CustomerAddress['verificationStatus']) {
  if (status === 'verified') {
    return { label: 'Verified', className: 'bg-emerald-50 text-emerald-700 border-emerald-200', icon: ShieldCheck };
  }
  if (status === 'needs_attention') {
    return { label: 'Needs Attention', className: 'bg-rose-50 text-rose-700 border-rose-200', icon: AlertTriangle };
  }
  return { label: 'New Address', className: 'bg-amber-50 text-amber-700 border-amber-200', icon: AlertTriangle };
}

function AddressCard({
  address,
  onEdit,
  onDelete,
  onSetDefault,
}: {
  address: CustomerAddress;
  onEdit: () => void;
  onDelete: () => void;
  onSetDefault: () => void;
}) {
  const type = ADDRESS_TYPES.find((item) => item.id === address.type) ?? ADDRESS_TYPES[3];
  const TypeIcon = type.icon;
  const status = statusMeta(address.verificationStatus);
  const StatusIcon = status.icon;
  const area = address.isCustomLocation && address.customArea ? address.customArea : address.area;

  return (
    <article className="bg-white border border-[#E8EDF2] rounded-[14px] p-5 hover:border-[#FF5B00]/30 transition-all text-left h-full flex flex-col">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-11 h-11 rounded-xl bg-[#FFF3EA] text-[#FF5B00] flex items-center justify-center shrink-0">
            <TypeIcon size={18} />
          </div>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h4 className="text-sm font-extrabold tracking-tight text-[#1A1A2E] truncate">
                {address.label}
              </h4>
              {address.isDefault && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-[#FF5B00] text-white text-[10px] font-bold">
                  <Star size={9} className="fill-current" /> Default
                </span>
              )}
            </div>
            <span className="inline-flex mt-1 px-2 py-0.5 rounded-lg border border-[#E8EDF2] text-[10px] font-semibold text-[#9AA0AC]">
              {type.label}
            </span>
          </div>
        </div>
        <span
          className={cn(
            'inline-flex items-center gap-1 px-2 py-1 rounded-lg border text-[10px] font-bold shrink-0',
            status.className,
          )}
        >
          <StatusIcon size={10} />
          {status.label}
        </span>
      </div>

      <div className="mt-4 space-y-2 flex-1">
        {address.recipientName && (
          <p className="text-xs font-bold text-[#1a1a2e]">{address.recipientName}</p>
        )}
        {address.phone && (
          <p className="text-[11px] font-semibold text-gray-500">{address.phone}</p>
        )}
        <p className="text-xs font-bold text-[#1a1a2e] leading-relaxed">
          {[address.houseOrBuilding, address.floorOrUnit, area].filter(Boolean).join(', ')}
        </p>
        <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-[11px] font-semibold text-[#9AA0AC]">
          <p>
            <span className="text-gray-400">Division:</span>{' '}
            {findLocationName(address.location.divisionId) || '—'}
          </p>
          <p>
            <span className="text-gray-400">District:</span>{' '}
            {findLocationName(address.location.districtId) || '—'}
          </p>
          <p>
            <span className="text-gray-400">City:</span>{' '}
            {findLocationName(address.location.cityId) || '—'}
          </p>
          <p>
            <span className="text-gray-400">Postal:</span> {address.location.postalCode || '—'}
          </p>
        </div>
        {address.landmark && (
          <p className="text-[11px] text-gray-500">Landmark: {address.landmark}</p>
        )}
        {address.isCustomLocation && (
          <p className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-2 py-1">
            <AlertTriangle size={10} /> Custom area
          </p>
        )}
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        {!address.isDefault && (
          <button
            type="button"
            onClick={onSetDefault}
            className="min-h-[40px] px-3 rounded-xl border border-[#E8EDF2] text-[12px] font-bold text-[#1a1a2e] hover:border-[#FF5B00]/40"
          >
            Set as Default
          </button>
        )}
        <button
          type="button"
          onClick={onEdit}
          className="min-h-[40px] px-3 rounded-xl border border-[#E8EDF2] text-[12px] font-bold text-[#1a1a2e] hover:border-[#FF5B00]/40 flex items-center justify-center gap-1"
        >
          <Edit3 size={12} /> Edit
        </button>
        <button
          type="button"
          onClick={onDelete}
          className="min-h-[40px] px-3 rounded-xl border border-rose-100 bg-rose-50 text-[12px] font-bold text-rose-600 hover:bg-rose-100 flex items-center justify-center gap-1"
        >
          <Trash2 size={12} /> Delete
        </button>
      </div>
    </article>
  );
}

function CheckoutPreviewCard({ address }: { address: CustomerAddress }) {
  const type = ADDRESS_TYPES.find((item) => item.id === address.type)?.label ?? 'Address';

  return (
    <div className="rounded-[14px] border border-[#E8EDF2] bg-white p-5 text-left">
      <div className="flex items-center gap-2 mb-3">
        <Truck size={16} className="text-[#FF5B00]" />
        <h4 className="text-[13px] font-bold tracking-tight text-[#1A1A2E]">
          Default Delivery Address
        </h4>
      </div>
      <div className="rounded-xl bg-[#F4F7F9] border border-[#E8EDF2] p-4 space-y-1">
        <p className="text-[11px] font-bold text-[#FF5B00]">{type}</p>
        {address.recipientName && (
          <p className="text-sm font-bold text-[#1a1a2e]">{address.recipientName}</p>
        )}
        <p className="text-xs text-gray-600 leading-relaxed">{formatAddressLine(address)}</p>
        <p className="text-[11px] font-semibold text-[#9AA0AC]">
          {findLocationName(address.location.cityId)} · {address.location.postalCode}
        </p>
      </div>
      <p className="mt-3 text-[11px] font-medium text-[#9AA0AC]">
        Preview — checkout will use this address automatically.
      </p>
    </div>
  );
}

export function AddressBookManager({ embedded = false }: { embedded?: boolean }) {
  const {
    customerAddresses,
    defaultCustomerAddress,
    addCustomerAddress,
    updateCustomerAddress,
    deleteCustomerAddress,
    setDefaultCustomerAddress,
  } = useDashboard();

  const [draft, setDraft] = useState<CustomerAddressDraft>(() => createEmptyAddressDraft());
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const openCreate = () => {
    setDraft(createEmptyAddressDraft());
    setEditingId(null);
    setErrors({});
    setFormOpen(true);
  };

  const resetForm = () => {
    setDraft(createEmptyAddressDraft());
    setEditingId(null);
    setErrors({});
    setFormOpen(false);
  };

  const submit = () => {
    const result = validateAddressDraft(draft);
    setErrors(result.errors as Record<string, string>);
    if (!result.valid) {
      toast.error('Please complete required address fields');
      return;
    }

    if (editingId) {
      const existing = customerAddresses.find((address) => address.id === editingId);
      updateCustomerAddress(
        draftToAddress(draft, {
          id: editingId,
          isDefault: existing?.isDefault,
          createdAt: existing?.createdAt,
        }),
      );
    } else {
      addCustomerAddress(draftToAddress(draft, { isDefault: customerAddresses.length === 0 }));
    }
    resetForm();
  };

  const edit = (address: CustomerAddress) => {
    setDraft(addressToDraft(address));
    setEditingId(address.id);
    setErrors({});
    setFormOpen(true);
  };

  const remove = (address: CustomerAddress) => {
    if (window.confirm(`Delete "${address.label}"? This cannot be undone.`)) {
      deleteCustomerAddress(address.id);
    }
  };

  return (
    <section
      className={cn('space-y-8', !embedded && 'animate-in fade-in slide-in-from-bottom-5 duration-700')}
      aria-labelledby="address-book-heading"
    >
      {!embedded && (
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div className="text-left">
            <h2
              id="address-book-heading"
              className="text-2xl font-extrabold text-[#1A1A2E] tracking-tight mb-2"
            >
              My addresses
            </h2>
            <p className="text-[#9AA0AC] text-[13px] font-medium">
              Manage your delivery locations for faster checkout
            </p>
          </div>
          <button
            type="button"
            onClick={openCreate}
            className="inline-flex items-center justify-center gap-2 min-h-[44px] px-5 py-3 bg-[#FF5B00] text-white rounded-xl text-[13px] font-bold tracking-tight hover:brightness-110"
          >
            <Plus size={14} /> Add new address
          </button>
        </div>
      )}

      {embedded && (
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="text-left">
            <h3 className="text-lg font-extrabold tracking-tight text-[#1A1A2E]">Addresses</h3>
            <p className="text-[13px] font-medium text-[#9AA0AC]">
              Saved delivery locations
            </p>
          </div>
          <button
            type="button"
            onClick={openCreate}
            className="inline-flex items-center justify-center gap-2 min-h-[44px] px-4 py-2 bg-[#FF5B00] text-white rounded-xl text-[13px] font-bold tracking-tight hover:brightness-110"
          >
            <Plus size={14} /> Add new address
          </button>
        </div>
      )}

      {customerAddresses.length === 0 ? (
        <div className="py-16 border border-dashed border-[#E8EDF2] rounded-[14px] bg-white text-center">
          <MapPin size={40} className="mx-auto text-[#FF5B00] mb-4" />
          <h4 className="text-base font-extrabold tracking-tight text-[#1A1A2E]">
            No saved addresses yet
          </h4>
          <p className="text-[12.5px] font-medium text-[#9AA0AC] mt-2 max-w-sm mx-auto">
            Add your first delivery address.
          </p>
          <button
            type="button"
            onClick={openCreate}
            className="mt-6 inline-flex items-center justify-center gap-2 min-h-[44px] px-5 py-3 bg-[#FF5B00] text-white rounded-xl text-[13px] font-bold tracking-tight hover:brightness-110"
          >
            <Plus size={14} /> Add Address
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {customerAddresses.map((address) => (
            <AddressCard
              key={address.id}
              address={address}
              onEdit={() => edit(address)}
              onDelete={() => remove(address)}
              onSetDefault={() => setDefaultCustomerAddress(address.id)}
            />
          ))}
        </div>
      )}

      {defaultCustomerAddress && customerAddresses.length > 0 && (
        <CheckoutPreviewCard address={defaultCustomerAddress} />
      )}

      <AddressFormDrawer
        open={formOpen}
        editing={Boolean(editingId)}
        draft={draft}
        errors={errors}
        onClose={resetForm}
        onSubmit={submit}
        onDraftChange={(patch) => setDraft((prev) => ({ ...prev, ...patch }))}
        onLocationChange={(patch) =>
          setDraft((prev) => ({ ...prev, location: { ...prev.location, ...patch } }))
        }
      />
    </section>
  );
}
