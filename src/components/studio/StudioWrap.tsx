import React from 'react';
import { getStudioSectionById } from '../../data/studioSections';
import { useStudioEdit } from '../../context/StudioEditContext';
import { StudioSectionShell } from './StudioSectionShell';

type StudioWrapProps = {
  sectionId: string;
  className?: string;
  style?: React.CSSProperties;
  children: React.ReactNode;
};

/**
 * Thin registry lookup + edit affordance wrapper for public page sections.
 */
export function StudioWrap({ sectionId, className, style, children }: StudioWrapProps) {
  const section = getStudioSectionById(sectionId);
  const { editMode, openEditor } = useStudioEdit();

  if (!section) {
    return (
      <div className={className}>
        {children}
      </div>
    );
  }

  return (
    <StudioSectionShell
      section={section}
      editMode={editMode}
      onEdit={openEditor}
      className={className}
      style={style}
    >
      {children}
    </StudioSectionShell>
  );
}
