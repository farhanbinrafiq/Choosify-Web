/** Development-only performance helpers — no telemetry is sent. */

const isDev = import.meta.env.DEV;

type PerfMark = {
  label: string;
  startedAt: number;
};

const marks = new Map<string, PerfMark>();

export function perfMarkStart(label: string) {
  if (!isDev) return;
  marks.set(label, { label, startedAt: performance.now() });
  performance.mark(`${label}:start`);
}

export function perfMarkEnd(label: string, detail?: Record<string, unknown>) {
  if (!isDev) return;
  const mark = marks.get(label);
  const durationMs = mark ? performance.now() - mark.startedAt : 0;
  performance.mark(`${label}:end`);
  try {
    performance.measure(label, `${label}:start`, `${label}:end`);
  } catch {
    // ignore duplicate measure names
  }
  marks.delete(label);
  console.debug(`[perf] ${label}: ${durationMs.toFixed(1)}ms`, detail ?? '');
  return durationMs;
}

export function perfRouteTransition(pathname: string) {
  perfMarkStart(`route:${pathname}`);
  requestAnimationFrame(() => {
    requestAnimationFrame(() => perfMarkEnd(`route:${pathname}`));
  });
}

export async function perfApiCall<T>(label: string, request: () => Promise<T>): Promise<T> {
  if (!isDev) return request();
  perfMarkStart(`api:${label}`);
  try {
    return await request();
  } finally {
    perfMarkEnd(`api:${label}`);
  }
}

export function observeImageLoad(src: string, onComplete?: (durationMs: number) => void) {
  if (!isDev || !src) return;
  const startedAt = performance.now();
  const img = new Image();
  img.onload = () => {
    const durationMs = performance.now() - startedAt;
    console.debug(`[perf] image:${durationMs.toFixed(1)}ms`, src);
    onComplete?.(durationMs);
  };
  img.src = src;
}
