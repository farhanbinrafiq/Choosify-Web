import type { ExportFormatId } from '../../../types/spotlight/intelligence';

export interface ExportFormatDefinition {
  id: ExportFormatId;
  label: string;
  description: string;
  phase: '5.4' | '6' | '7';
  available: boolean;
}

/** Export preparation — architecture only (Phase 5.4) */
export const EXPORT_REGISTRY: ExportFormatDefinition[] = [
  { id: 'csv', label: 'CSV', description: 'Metric tables and leaderboards', phase: '5.4', available: false },
  { id: 'excel', label: 'Excel', description: 'Multi-sheet intelligence workbook', phase: '5.4', available: false },
  { id: 'pdf', label: 'PDF', description: 'Dashboard snapshot report', phase: '5.4', available: false },
  { id: 'snapshot', label: 'Dashboard Snapshot', description: 'PNG capture of current view', phase: '5.4', available: false },
  { id: 'powerpoint', label: 'PowerPoint', description: 'Executive slide deck export', phase: '7', available: false },
];

export function exportFormatsAvailable(): ExportFormatDefinition[] {
  return EXPORT_REGISTRY.filter((e) => e.available);
}
