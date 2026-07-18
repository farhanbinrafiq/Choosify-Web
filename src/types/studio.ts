/** CMS studio kinds — each maps to a public page composition. */
export type StudioKind = 'website' | 'product' | 'brand' | 'creator' | 'event';

export type StudioSectionFieldType =
  | 'text'
  | 'richtext'
  | 'image'
  | 'gallery'
  | 'product_list'
  | 'toggle'
  | 'select'
  | 'date_range';

export interface StudioSectionField {
  id: string;
  label: string;
  type: StudioSectionFieldType;
  path: string;
  required?: boolean;
  options?: Array<{ value: string; label: string }>;
}

/** Descriptor for a composable page section used in both public site and admin studio. */
export interface StudioSectionDescriptor {
  id: string;
  label: string;
  studio: StudioKind;
  /** DOM anchor id on the public page */
  anchorId: string;
  fields: StudioSectionField[];
  order: number;
}

export interface StudioEditContext {
  studio: StudioKind;
  entityId: string;
  mode: 'view' | 'edit';
  draft: boolean;
}
