import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'motion/react';
import { getFloatingPanelMotion } from './FilterEngine';
import { cn } from '../lib/utils';
import {
  CartPreviewPanel,
  cartPreviewDesktopShellClass,
  cartPreviewMobileShellClass,
  cartPreviewShellClass,
} from './CartPreviewPanel';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  anchorEl?: HTMLElement | null;
}

function useIsMobileSheet() {
  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== 'undefined' ? window.matchMedia('(max-width: 639px)').matches : false,
  );

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 639px)');
    const onChange = () => setIsMobile(mq.matches);
    onChange();
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  return isMobile;
}

export function CartDrawer({ isOpen, onClose, anchorEl }: CartDrawerProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const isMobileSheet = useIsMobileSheet();
  const [dropdownStyle, setDropdownStyle] = useState<{ top: number; right: number }>({
    top: 72,
    right: 16,
  });

  useLayoutEffect(() => {
    if (!isOpen || isMobileSheet || !anchorEl) return;

    const syncPosition = () => {
      const rect = anchorEl.getBoundingClientRect();
      setDropdownStyle({
        top: rect.bottom + 10,
        right: Math.max(12, window.innerWidth - rect.right),
      });
    };

    syncPosition();
    window.addEventListener('resize', syncPosition);
    window.addEventListener('scroll', syncPosition, true);
    return () => {
      window.removeEventListener('resize', syncPosition);
      window.removeEventListener('scroll', syncPosition, true);
    };
  }, [isOpen, isMobileSheet, anchorEl]);

  useEffect(() => {
    if (!isOpen) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (!isOpen) return;

    const onPointerDown = (e: MouseEvent) => {
      const target = e.target as Node;
      if (panelRef.current?.contains(target)) return;
      if (anchorEl?.contains(target)) return;
      onClose();
    };

    document.addEventListener('mousedown', onPointerDown);
    return () => document.removeEventListener('mousedown', onPointerDown);
  }, [isOpen, onClose, anchorEl]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = isMobileSheet ? 'hidden' : '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen, isMobileSheet]);

  if (typeof document === 'undefined') return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <>
          {isMobileSheet && (
            <motion.div
              key="cart-drawer-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.45, transition: { duration: 0.15, ease: 'easeOut' } }}
              exit={{ opacity: 0, transition: { duration: 0.12, ease: 'easeIn' } }}
              onClick={onClose}
              className="fixed inset-0 bg-black z-[220] cursor-pointer"
            />
          )}

          <motion.div
            key="cart-drawer-panel"
            ref={panelRef}
            id="choosify-cart-preview"
            role="dialog"
            aria-modal="true"
            aria-label="Shopping cart"
            {...getFloatingPanelMotion(isMobileSheet, false)}
            style={{
              ...(isMobileSheet
                ? undefined
                : {
                    top: dropdownStyle.top,
                    right: dropdownStyle.right,
                  }),
              willChange: 'transform, opacity',
              transformOrigin: isMobileSheet ? 'bottom center' : 'top right',
            }}
            className={cn(
              cartPreviewShellClass,
              'z-[230] transform-gpu backface-hidden',
              isMobileSheet
                ? cn('fixed', cartPreviewMobileShellClass)
                : cn('fixed', cartPreviewDesktopShellClass),
            )}
          >
            <CartPreviewPanel onClose={onClose} />
          </motion.div>
        </>
      )}
    </AnimatePresence>,
    document.body,
  );
}
