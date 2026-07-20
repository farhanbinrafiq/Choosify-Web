import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { ChevronDown, Search } from 'lucide-react';
import { cn } from '../../lib/utils';

export interface SearchableSelectOption {
  id: string;
  name: string;
  postalCode?: string;
}

interface SearchableSelectFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: SearchableSelectOption[];
  required?: boolean;
  disabled?: boolean;
  placeholder?: string;
}

function FieldLabel({ children, required = false }: { children: React.ReactNode; required?: boolean }) {
  return (
    <label className="text-[12px] font-semibold text-[#9AA0AC] tracking-tight ml-1">
      {children}
      {required && <span className="text-[#EB4501] ml-1">*</span>}
    </label>
  );
}

export function SearchableSelectField({
  label,
  value,
  onChange,
  options,
  required,
  disabled,
  placeholder = 'Select',
}: SearchableSelectFieldProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [menuPos, setMenuPos] = useState<{ top: number; left: number; width: number } | null>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const selected = options.find((option) => option.id === value);
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return options;
    return options.filter((option) => {
      const haystack = `${option.name} ${option.postalCode ?? ''}`.toLowerCase();
      return haystack.includes(q);
    });
  }, [options, query]);

  const updateMenuPos = () => {
    const el = buttonRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    setMenuPos({
      top: rect.bottom + 4,
      left: rect.left,
      width: rect.width,
    });
  };

  useLayoutEffect(() => {
    if (!open) {
      setMenuPos(null);
      return;
    }
    updateMenuPos();
  }, [open]);

  useEffect(() => {
    if (!open) return;

    const handleClick = (event: MouseEvent) => {
      const target = event.target as Node;
      if (rootRef.current?.contains(target) || menuRef.current?.contains(target)) return;
      setOpen(false);
    };

    const handleReposition = () => updateMenuPos();

    document.addEventListener('mousedown', handleClick);
    window.addEventListener('resize', handleReposition);
    window.addEventListener('scroll', handleReposition, true);
    return () => {
      document.removeEventListener('mousedown', handleClick);
      window.removeEventListener('resize', handleReposition);
      window.removeEventListener('scroll', handleReposition, true);
    };
  }, [open]);

  return (
    <div className="space-y-2 relative" ref={rootRef}>
      <FieldLabel required={required}>{label}</FieldLabel>
      <button
        ref={buttonRef}
        type="button"
        disabled={disabled}
        onClick={() => !disabled && setOpen((prev) => !prev)}
        className={cn(
          'w-full min-h-[48px] bg-slate-50 border border-slate-200/60 rounded-2xl px-4 text-left text-xs font-bold text-[#1a1a2e] focus:outline-none focus:ring-2 focus:ring-[#EB4501]/10 focus:border-[#EB4501]/40 focus:bg-white transition-all flex items-center justify-between gap-2',
          disabled && 'bg-gray-50 text-gray-400 cursor-not-allowed',
        )}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span className={cn('truncate', !selected && 'text-gray-400')}>
          {selected
            ? selected.postalCode
              ? `${selected.name} (${selected.postalCode})`
              : selected.name
            : placeholder}
        </span>
        <ChevronDown size={14} className="shrink-0 text-gray-400" />
      </button>

      {open &&
        !disabled &&
        menuPos &&
        createPortal(
          <div
            ref={menuRef}
            className="fixed z-[220] rounded-lg border border-[#e8edf2] bg-white shadow-lg overflow-hidden"
            style={{
              top: menuPos.top,
              left: menuPos.left,
              width: menuPos.width,
            }}
          >
            <div className="flex items-center gap-2 border-b border-[#e8edf2] px-3 py-2">
              <Search size={14} className="text-gray-400 shrink-0" />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder={`Search ${label.toLowerCase()}...`}
                className="w-full text-[11px] font-bold text-[#1a1a2e] focus:outline-none"
                autoFocus
              />
            </div>
            <ul className="max-h-48 overflow-y-auto" role="listbox">
              {filtered.length === 0 ? (
                <li className="px-4 py-3 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                  No matches
                </li>
              ) : (
                filtered.map((option) => (
                  <li key={option.id}>
                    <button
                      type="button"
                      role="option"
                      aria-selected={option.id === value}
                      onClick={() => {
                        onChange(option.id);
                        setOpen(false);
                        setQuery('');
                      }}
                      className={cn(
                        'w-full text-left px-4 py-2.5 text-[11px] font-bold hover:bg-[#FFF0E8] transition-colors',
                        option.id === value ? 'text-[#EB4501] bg-[#FFF0E8]/60' : 'text-[#1a1a2e]',
                      )}
                    >
                      {option.postalCode ? `${option.name} (${option.postalCode})` : option.name}
                    </button>
                  </li>
                ))
              )}
            </ul>
          </div>,
          document.body,
        )}
    </div>
  );
}
