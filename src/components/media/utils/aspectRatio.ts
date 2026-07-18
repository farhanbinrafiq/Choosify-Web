import type { UniversalAspectRatio } from '../types/mediaModel';

const RATIO_TOLERANCE = 0.08;

const ASPECT_RATIO_VALUES: Record<UniversalAspectRatio, number> = {
  '9:16': 9 / 16,
  '16:9': 16 / 9,
  '1:1': 1,
  '4:5': 4 / 5,
  '4:3': 4 / 3,
  '21:9': 21 / 9,
};

export function getWidthHeightRatio(width: number, height: number): number {
  if (!width || !height) return 1;
  return width / height;
}

export function classifyAspectRatio(width: number, height: number): UniversalAspectRatio {
  const ratio = getWidthHeightRatio(width, height);
  let best: UniversalAspectRatio = '1:1';
  let bestDelta = Number.POSITIVE_INFINITY;

  (Object.entries(ASPECT_RATIO_VALUES) as [UniversalAspectRatio, number][]).forEach(
    ([key, value]) => {
      const delta = Math.abs(ratio - value);
      if (delta < bestDelta) {
        bestDelta = delta;
        best = key;
      }
    },
  );

  return bestDelta <= RATIO_TOLERANCE ? best : ratio < 0.85 ? '9:16' : ratio > 1.4 ? '16:9' : '1:1';
}

export function toCssAspectRatio(aspectRatio: UniversalAspectRatio): string {
  const [w, h] = aspectRatio.split(':');
  return `${w} / ${h}`;
}
