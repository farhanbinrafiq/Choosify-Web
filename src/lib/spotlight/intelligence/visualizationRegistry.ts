import type { MiniChartKind } from '../../../components/spotlight/intelligence/SpotlightMiniChart';

export interface VisualizationDefinition {
  id: MiniChartKind | 'funnel' | 'heatmap' | 'sparkline' | 'leaderboard' | 'timeline';
  label: string;
  description: string;
  responsive: boolean;
  minHeight: number;
}

/** Visualization registry — chart types available to intelligence widgets */
export const VISUALIZATION_REGISTRY: VisualizationDefinition[] = [
  { id: 'area', label: 'Area Chart', description: 'Filled time-series trend', responsive: true, minHeight: 120 },
  { id: 'line', label: 'Line Chart', description: 'Time-series line', responsive: true, minHeight: 120 },
  { id: 'bar', label: 'Bar Chart', description: 'Categorical comparison', responsive: true, minHeight: 120 },
  { id: 'donut', label: 'Donut Chart', description: 'Proportional breakdown', responsive: true, minHeight: 100 },
  { id: 'pie', label: 'Pie Chart', description: 'Share distribution', responsive: true, minHeight: 100 },
  { id: 'funnel', label: 'Funnel', description: 'Conversion journey with drop-off', responsive: true, minHeight: 200 },
  { id: 'heatmap', label: 'Heatmap', description: 'Grid intensity map', responsive: true, minHeight: 160 },
  { id: 'sparkline', label: 'Sparkline', description: 'Inline mini trend', responsive: true, minHeight: 48 },
  { id: 'leaderboard', label: 'Leaderboard', description: 'Ranked list table', responsive: true, minHeight: 200 },
  { id: 'timeline', label: 'Timeline', description: 'Chronological events', responsive: true, minHeight: 120 },
];

export function getVisualization(id: string): VisualizationDefinition | undefined {
  return VISUALIZATION_REGISTRY.find((v) => v.id === id);
}
