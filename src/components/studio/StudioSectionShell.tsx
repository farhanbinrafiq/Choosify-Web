import React from 'react';
import { Pencil } from 'lucide-react';
import { cn } from '../../lib/utils';
import type { StudioSectionDescriptor } from '../../types/studio';

type StudioSectionShellProps = {
  section: StudioSectionDescriptor;
  editMode?: boolean;
  onEdit?: (sectionId: string) => void;
  className?: string;
  style?: React.CSSProperties;
  children: React.ReactNode;
};

/**
 * Wraps a public page section so CMS studios can render the same layout with edit affordances.
 * When editMode is true, admins see the live section plus an edit control.
 */
export function StudioSectionShell({
  section,
  editMode = false,
  onEdit,
  className,
  style,
  children,
}: StudioSectionShellProps) {
  return (
    <div
      id={section.anchorId}
      data-studio-section={section.id}
      data-studio-kind={section.studio}
      style={style}
      className={cn('relative scroll-mt-36 w-full', editMode && 'ring-1 ring-transparent hover:ring-[#E8500A]/25 rounded-[5px]', className)}
    >
      {editMode && (
        <button
          type="button"
          onClick={() => onEdit?.(section.id)}
          className="absolute top-3 right-3 z-20 inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-[#1A1D4E] text-white text-[9px] font-black uppercase tracking-wider shadow-md hover:bg-[#E8500A] transition-colors"
        >
          <Pencil size={11} />
          Edit {section.label}
        </button>
      )}
      {children}
    </div>
  );
}
