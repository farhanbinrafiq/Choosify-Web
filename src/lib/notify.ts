import toastLib, { type Toast, type ToastOptions } from 'react-hot-toast';
import { MAX_VISIBLE, TOAST_DURATION_MS } from '../components/ChoosifyToaster';

type NotifyOptions = ToastOptions;

type CartAddPayload = {
  productId: string | number;
  title: string;
  quantity?: number;
  addonCount?: number;
};

const cartAddAccumulator = new Map<
  string,
  { title: string; quantity: number; addonCount: number; timer?: ReturnType<typeof setTimeout> }
>();

function trimVisibleQueue() {
  const visible = toastLib
    .getToasts()
    .filter((item) => item.visible && item.type !== 'loading')
    .sort((a, b) => a.createdAt - b.createdAt);

  while (visible.length > MAX_VISIBLE) {
    const oldest = visible.shift();
    if (oldest) toastLib.dismiss(oldest.id);
  }
}

function push(
  message: string,
  type: 'success' | 'error' | 'loading' | 'blank',
  options: NotifyOptions = {},
) {
  trimVisibleQueue();
  const duration = type === 'loading' ? Infinity : TOAST_DURATION_MS;
  const opts = { duration, ...options };

  if (type === 'error') return toastLib.error(message, opts);
  if (type === 'loading') return toastLib.loading(message, opts);
  if (type === 'success') return toastLib.success(message, opts);
  return toastLib(message, opts);
}

function cartDetail(title: string, quantity: number, addonCount: number) {
  const item =
    addonCount > 0
      ? `${title} + ${addonCount} add-on${addonCount > 1 ? 's' : ''}`
      : title;
  const suffix = quantity > 1 ? ` (${quantity} units)` : '';
  return `${item}${suffix}`;
}

export const notify = {
  success(message: string, options?: NotifyOptions) {
    return push(message, 'success', options);
  },

  error(message: string, options?: NotifyOptions) {
    return push(message, 'error', options);
  },

  info(message: string, options?: NotifyOptions) {
    return push(message, 'blank', options);
  },

  loading(message: string, options?: NotifyOptions) {
    return push(message, 'loading', options);
  },

  /** Coalesces rapid adds for the same product into one updating toast. */
  cartAdded({ productId, title, quantity = 1, addonCount = 0 }: CartAddPayload) {
    const key = String(productId);
    const prev = cartAddAccumulator.get(key);
    const nextQuantity = (prev?.quantity ?? 0) + quantity;
    const nextAddonCount = Math.max(prev?.addonCount ?? 0, addonCount);

    if (prev?.timer) clearTimeout(prev.timer);
    const timer = setTimeout(() => cartAddAccumulator.delete(key), 3000);
    cartAddAccumulator.set(key, {
      title,
      quantity: nextQuantity,
      addonCount: nextAddonCount,
      timer,
    });

    return push(`Added to cart — ${cartDetail(title, nextQuantity, nextAddonCount)}`, 'success', {
      id: `cart-add-${key}`,
    });
  },

  wishlistToggle(added: boolean, title?: string) {
    const message = title
      ? `${added ? 'Saved to wishlist' : 'Removed from wishlist'} — ${title}`
      : added
        ? 'Saved to wishlist'
        : 'Removed from wishlist';
    return push(message, 'success', { id: 'wishlist-toggle' });
  },

  bookingSent(brandName: string, isService = true) {
    return push(
      `${isService ? 'Booking request sent' : 'Request sent'} — ${brandName}`,
      'success',
      { id: 'booking-request-sent' },
    );
  },

  dismiss: toastLib.dismiss,
  remove: toastLib.remove,
  promise: toastLib.promise,
  custom: toastLib.custom,
  getToasts: toastLib.getToasts,
};

type ToastApi = typeof notify & ((message: string, options?: NotifyOptions) => string);

const toastCallable = ((message: string, options?: NotifyOptions) =>
  notify.info(message, options)) as ToastApi;

/** Drop-in alias for gradual migration from `react-hot-toast` */
export const toast = Object.assign(toastCallable, notify);

export type { Toast, ToastOptions };
