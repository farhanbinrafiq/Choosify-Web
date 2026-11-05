/**
 * Ad impressions + clicks → POST /ads/events (Ads Studio reports).
 *
 * Every drawn ad carries data-ad-id + data-ad-slot. One tracker (mounted once in App):
 *  - VIEW  = at least half of the ad on screen for 1 second, once per page view;
 *  - CLICK = a click inside the ad, once per page view.
 * A page view is one route (new random id on every navigation). Events are batched and sent with
 * navigator.sendBeacon (text/plain → no CORS preflight). No cookies, user ids or personal data.
 */
const API_BASE = (((import.meta as unknown as { env?: Record<string, string> }).env?.VITE_API_BASE_URL as string | undefined) || '/api/v1').replace(/\/$/, '');

type Ev = { adId: string; slot: string; type: 'i' | 'c' };

const rid = () => {
  try {
    const a = new Uint8Array(12);
    crypto.getRandomValues(a);
    return Array.from(a, (b) => b.toString(16).padStart(2, '0')).join('');
  } catch {
    return `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 12)}`;
  }
};

let pageViewId = rid();
let queue: Ev[] = [];
const sent = new Set<string>();
let timer: number | null = null;

function flush() {
  if (timer) {
    window.clearTimeout(timer);
    timer = null;
  }
  if (!queue.length) return;
  const body = JSON.stringify({ pageViewId, events: queue.slice(0, 50) });
  queue = queue.slice(50);
  const url = `${API_BASE}/ads/events`;
  try {
    const ok = typeof navigator.sendBeacon === 'function' && navigator.sendBeacon(url, new Blob([body], { type: 'text/plain' }));
    if (!ok) void fetch(url, { method: 'POST', body, headers: { 'Content-Type': 'text/plain' }, keepalive: true, credentials: 'omit' }).catch(() => undefined);
  } catch {
    /* reporting never breaks a page */
  }
  if (queue.length) schedule();
}

function schedule() {
  if (!timer) timer = window.setTimeout(flush, 2000);
}

function push(adId: string, slot: string, type: 'i' | 'c') {
  const key = `${adId}:${slot}:${type}`;
  if (sent.has(key)) return;
  sent.add(key);
  queue.push({ adId, slot, type });
  if (type === 'c') flush();
  else schedule();
}

/** New page view (call on every route change): previous events are sent, counting starts fresh. */
export function newAdPageView() {
  flush();
  pageViewId = rid();
  sent.clear();
}

const VIEW_MS = 1000;

/** Starts watching the document for ads (idempotent). Returns a stop function. */
export function startAdTracking(): () => void {
  if (typeof window === 'undefined' || typeof IntersectionObserver === 'undefined') return () => undefined;
  const timers = new Map<Element, number>();
  const watched = new WeakSet<Element>();
  const io = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        const el = e.target as HTMLElement;
        const visible = e.isIntersecting && e.intersectionRatio >= 0.5 && document.visibilityState === 'visible';
        if (visible && !timers.has(el)) {
          timers.set(
            el,
            window.setTimeout(() => {
              timers.delete(el);
              const id = el.dataset.adId;
              const slot = el.dataset.adSlot;
              const shown = typeof (el as HTMLElement & { checkVisibility?: (o?: object) => boolean }).checkVisibility === 'function'
                ? (el as HTMLElement & { checkVisibility: (o?: object) => boolean }).checkVisibility({ opacityProperty: true, visibilityProperty: true })
                : true;
              if (id && slot && shown) push(id, slot, 'i');
            }, VIEW_MS),
          );
        } else if (!visible && timers.has(el)) {
          window.clearTimeout(timers.get(el));
          timers.delete(el);
        }
      }
    },
    { threshold: [0, 0.5, 1] },
  );
  const scan = (root: ParentNode) => {
    root.querySelectorAll?.('[data-ad-id][data-ad-slot]').forEach((el) => {
      if (watched.has(el)) return;
      watched.add(el);
      io.observe(el);
    });
  };
  scan(document);
  const mo = new MutationObserver((muts) => {
    for (const m of muts) {
      if (m.type === 'attributes' && m.target instanceof Element) {
        const el = m.target;
        if (el.matches('[data-ad-id][data-ad-slot]')) {
          // re-check (e.g. the hero's active slide changed)
          io.unobserve(el);
          watched.delete(el);
          scan(el.parentElement || document);
        }
        continue;
      }
      m.addedNodes.forEach((n) => n instanceof Element && (n.matches('[data-ad-id][data-ad-slot]') ? scan(n.parentElement || document) : scan(n)));
    }
  });
  mo.observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ['data-ad-id'] });
  const onClick = (ev: MouseEvent) => {
    const el = (ev.target as Element | null)?.closest?.('[data-ad-id][data-ad-slot]') as HTMLElement | null;
    if (el?.dataset.adId && el.dataset.adSlot) push(el.dataset.adId, el.dataset.adSlot, 'c');
  };
  document.addEventListener('click', onClick, true);
  const onHide = () => document.visibilityState === 'hidden' && flush();
  document.addEventListener('visibilitychange', onHide);
  window.addEventListener('pagehide', flush);
  return () => {
    io.disconnect();
    mo.disconnect();
    document.removeEventListener('click', onClick, true);
    document.removeEventListener('visibilitychange', onHide);
    window.removeEventListener('pagehide', flush);
    timers.forEach((t) => window.clearTimeout(t));
    flush();
  };
}

/** data-* attributes that make an element count as a drawn ad. */
export const adAttrs = (ad: { id: string; slot: string } | null | undefined): Record<string, string> =>
  ad ? { 'data-ad-id': ad.id, 'data-ad-slot': ad.slot } : {};
