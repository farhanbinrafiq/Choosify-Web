import React from 'react';
import type { BookingRequestField } from '../../types/serviceBooking';

export function BookingRequestFields({
  fields,
  values,
  onChange,
}: {
  fields: BookingRequestField[];
  values: Record<string, string | number>;
  onChange: (key: string, value: string | number) => void;
}) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {fields.map((field) => {
        const commonClass =
          'w-full bg-white border border-[#E5E7EB] rounded-xl px-3.5 py-2.5 text-xs text-[#1A1A2E] outline-none focus:border-[#EB4501] transition-colors';
        const value = values[field.key] ?? '';
        return (
          <label
            key={field.key}
            className={field.type === 'textarea' ? 'sm:col-span-2' : ''}
          >
            <span className="block text-[11px] font-bold text-[#4B5563] mb-1.5">
              {field.label}
              {field.required ? <span className="text-[#EB4501]"> *</span> : null}
            </span>
            {field.type === 'select' ? (
              <select
                className={commonClass}
                value={String(value)}
                required={field.required}
                onChange={(event) => onChange(field.key, event.target.value)}
              >
                <option value="">Select {field.label.toLowerCase()}</option>
                {field.options?.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            ) : field.type === 'textarea' ? (
              <textarea
                className={`${commonClass} resize-none`}
                rows={3}
                value={String(value)}
                required={field.required}
                placeholder={`Add ${field.label.toLowerCase()}…`}
                onChange={(event) => onChange(field.key, event.target.value)}
              />
            ) : (
              <input
                className={commonClass}
                type={field.type}
                min={field.min}
                value={value}
                required={field.required}
                onChange={(event) =>
                  onChange(
                    field.key,
                    field.type === 'number'
                      ? Number(event.target.value)
                      : event.target.value,
                  )
                }
              />
            )}
          </label>
        );
      })}
    </div>
  );
}
