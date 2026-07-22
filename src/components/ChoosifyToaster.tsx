import React from 'react';
import { Toaster, resolveValue } from 'react-hot-toast';
import { ChoosifyToast } from './ChoosifyToast';

const TOAST_DURATION_MS = 2500;
const MAX_VISIBLE = 3;

/**
 * Sitewide toast host — top-right below navbar, clear of bottom-right FABs.
 * Renders all react-hot-toast / notify() messages with the shared light card UI.
 */
export function ChoosifyToaster() {
  return (
    <Toaster
      position="top-right"
      reverseOrder={false}
      gutter={10}
      containerClassName="choosify-toaster"
      containerStyle={{
        top: '5.5rem',
        right: 'max(1rem, env(safe-area-inset-right, 0px))',
        zIndex: 260,
      }}
      toastOptions={{
        duration: TOAST_DURATION_MS,
      }}
    >
      {(t) => {
        const meta = (t as { choosify?: { title?: string; variant?: 'success' | 'error' | 'info' | 'loading' } })
          .choosify;
        const message = resolveValue(t.message, t);

        return (
          <ChoosifyToast
            toast={t}
            variant={meta?.variant}
            title={meta?.title}
            message={typeof message === 'string' ? message : undefined}
          />
        );
      }}
    </Toaster>
  );
}

export { TOAST_DURATION_MS, MAX_VISIBLE };
