import type { IntelligenceBenchmark } from '../types/spotlight/intelligence';

/** Deterministic seed from string for stable demo metrics */
export function hashSeed(input: string): number {
  let h = 0;
  for (let i = 0; i < input.length; i += 1) {
    h = (h << 5) - h + input.charCodeAt(i);
    h |= 0;
  }
  return Math.abs(h);
}

export function seededValue(seed: string, min: number, max: number): number {
  const h = hashSeed(seed);
  return min + (h % 1000) / 1000 * (max - min);
}

export function buildBenchmark(
  seed: string,
  current: number,
  options?: { invertTrend?: boolean },
): IntelligenceBenchmark {
  const previousPeriod = current * seededValue(`${seed}-prev`, 0.82, 0.98);
  const platformAverage = current * seededValue(`${seed}-avg`, 0.55, 0.75);
  const topPerformer = current * seededValue(`${seed}-top`, 1.1, 1.6);
  const changePercent = previousPeriod === 0 ? 0 : ((current - previousPeriod) / previousPeriod) * 100;
  const trend = Math.abs(changePercent) < 1 ? 'flat' : changePercent > 0 ? 'up' : 'down';
  return {
    current,
    previousPeriod: Math.round(previousPeriod * 100) / 100,
    platformAverage: Math.round(platformAverage * 100) / 100,
    topPerformer: Math.round(topPerformer * 100) / 100,
    changePercent: Math.round(changePercent * 10) / 10,
    trend: options?.invertTrend && trend !== 'flat' ? (trend === 'up' ? 'down' : 'up') : trend,
  };
}

export function formatMetricValue(value: number, unit: 'count' | 'percent' | 'score' | 'currency' | 'duration'): string {
  if (unit === 'percent') return `${value.toFixed(1)}%`;
  if (unit === 'score') return `${Math.round(value)}`;
  if (unit === 'currency') return `BDT ${Math.round(value).toLocaleString()}`;
  if (unit === 'duration') return `${Math.round(value)}s`;
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000) return `${(value / 1_000).toFixed(1)}K`;
  return String(Math.round(value));
}
