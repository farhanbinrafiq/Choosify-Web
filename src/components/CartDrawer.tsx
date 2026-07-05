import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'motion/react';
import { X, Trash2, ShoppingBag, ArrowRight, Plus, Minus } from 'lucide-react';
import { useGlobalState, CartItem } from '../context/GlobalStateContext';
import { useNavigate } from 'react-router-dom';
import { cn } from '../lib/utils';
import toast from 'react-hot-toast';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  anchorEl?: HTMLElement | null;
}

const PLACEHOLDER_IMAGE =
  'https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=200&q=80';

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
  const navigate = useNavigate();
  const panelRef = useRef<HTMLDivElement>(null);
  const isMobileSheet = useIsMobileSheet();
  const [dropdownStyle, setDropdownStyle] = useState<{ top: number; right: number }>({
    top: 72,
    right: 16,
  });

  const {
    mode,
    retailCart,
    wholesaleCart,
    removeFromCart,
    updateCartQuantity,
    clearCart,
  } = useGlobalState();

  const cartItems = mode === 'retail' ? retailCart : wholesaleCart;

  const getItemPrice = (item: CartItem) => {
    if (mode === 'retail') {
      if (item.selectedVariant?.price !== undefined) return item.selectedVariant.price;
      return item.product.price;
    }
    const slabs = item.product.pricingTiers || item.product.quantitySlabs || [];
    if (slabs.length === 0) return item.product.price;
    const sorted = [...slabs].sort((a, b) => b.minQuantity - a.minQuantity);
    for (const slab of sorted) {
      if (item.quantity >= slab.minQuantity) return slab.price;
    }
    return item.product.price;
  };

  const subtotal = cartItems.reduce(
    (acc, item) => acc + getItemPrice(item) * item.quantity,
    0,
  );

  const totalUnits = cartItems.reduce((sum, item) => sum + item.quantity, 0);

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

  const handleQtyChange = (item: CartItem, newQty: number) => {
    if (newQty <= 0) {
      removeFromCart(item.id);
      return;
    }
    if (mode === 'wholesale') {
      const moq = item.product.moq || 10;
      if (newQty < moq) {
        toast.error(`Minimum order quantity is ${moq} units.`);
        return;
      }
    }
    updateCartQuantity(item.id, newQty);
  };

  const handleClearCart = () => {
    if (cartItems.length === 0) return;
    clearCart();
    toast.success('Cart cleared');
    onClose();
  };

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      toast.error('Your cart is empty');
      return;
    }
    onClose();
    navigate('/checkout', { state: { sourceMode: mode } });
  };

  const openProduct = (item: CartItem) => {
    onClose();
    navigate(`/products/${item.product.id}`);
  };

  const panelContent = (
    <>
      <div className="px-4 sm:px-5 py-4 border-b border-[#e8edf2] flex items-center justify-between shrink-0 bg-white">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-9 h-9 rounded-full bg-[#E8500A]/10 flex items-center justify-center text-[#E8500A] shrink-0">
            <ShoppingBag size={16} />
          </div>
          <div className="min-w-0 text-left">
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#8a9bb0]">
              {mode === 'retail' ? 'Retail cart' : 'Wholesale cart'}
            </p>
            <h3 className="text-sm font-black uppercase tracking-wide text-[#1A1D4E] truncate">
              {cartItems.length === 0
                ? 'Your cart is empty'
                : `${totalUnits} item${totalUnits === 1 ? '' : 's'} added`}
            </h3>
          </div>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="w-8 h-8 rounded-full border border-[#e8edf2] hover:border-[#E8500A]/30 flex items-center justify-center text-[#8a9bb0] hover:text-[#E8500A] transition-colors cursor-pointer shrink-0"
          aria-label="Close cart"
        >
          <X size={16} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-4 sm:px-5 py-4 space-y-3 min-h-0">
        {cartItems.length === 0 ? (
          <div className="py-10 text-center flex flex-col items-center gap-3">
            <div className="w-12 h-12 rounded-full border border-[#e8edf2] bg-[#F8FAFC] flex items-center justify-center text-[#8a9bb0]">
              <ShoppingBag size={20} />
            </div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-[#8a9bb0]">
              Nothing in your cart yet
            </p>
            <button
              type="button"
              onClick={() => {
                onClose();
                navigate('/products');
              }}
              className="text-[10px] font-bold uppercase tracking-widest text-[#E8500A] hover:underline"
            >
              Browse products
            </button>
          </div>
        ) : (
          cartItems.map((item) => {
            const product = item.product;
            const itemPrice = getItemPrice(item);
            const itemImage = item.selectedVariant?.image || product.image || PLACEHOLDER_IMAGE;

            return (
              <div
                key={item.id}
                className="flex gap-3 items-start bg-[#F8FAFC] border border-[#e8edf2] hover:border-[#E8500A]/20 rounded-[5px] p-3 transition-colors group"
              >
                <button
                  type="button"
                  onClick={() => openProduct(item)}
                  className="w-14 h-14 rounded-[5px] overflow-hidden bg-white border border-[#e8edf2] shrink-0 cursor-pointer"
                  aria-label={`View ${product.title}`}
                >
                  <img
                    src={itemImage}
                    alt=""
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    referrerPolicy="no-referrer"
                  />
                </button>

                <div className="flex-1 min-w-0 text-left">
                  <button
                    type="button"
                    onClick={() => openProduct(item)}
                    className="text-[11px] font-bold text-[#1A1D4E] uppercase tracking-tight line-clamp-2 text-left hover:text-[#E8500A] transition-colors w-full"
                  >
                    {product.title}
                  </button>

                  {item.selectedVariant?.attributes && (
                    <div className="flex flex-wrap gap-1 mt-1">
                      {Object.entries(item.selectedVariant.attributes).map(([key, value]) => (
                        <span
                          key={key}
                          className="text-[8px] font-bold uppercase px-1.5 py-0.5 rounded bg-white border border-[#e8edf2] text-[#8a9bb0]"
                        >
                          {key}: {value as string}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="flex items-center justify-between gap-2 mt-2">
                    <span className="text-[11px] font-black text-[#E8500A] font-mono">
                      ৳{itemPrice.toLocaleString()}
                    </span>

                    <div className="flex items-center gap-1 border border-[#e8edf2] rounded-full bg-white px-1 py-0.5">
                      <button
                        type="button"
                        onClick={() => handleQtyChange(item, item.quantity - 1)}
                        className="w-6 h-6 rounded-full hover:bg-[#F8FAFC] flex items-center justify-center text-[#8a9bb0]"
                        aria-label="Decrease quantity"
                      >
                        <Minus size={10} />
                      </button>
                      <span className="text-[10px] font-bold font-mono px-1 min-w-[1.25rem] text-center">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleQtyChange(item, item.quantity + 1)}
                        className="w-6 h-6 rounded-full hover:bg-[#F8FAFC] flex items-center justify-center text-[#8a9bb0]"
                        aria-label="Increase quantity"
                      >
                        <Plus size={10} />
                      </button>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => removeFromCart(item.id)}
                  className="p-1.5 rounded-full text-[#8a9bb0] hover:text-red-500 hover:bg-red-50 transition-colors shrink-0 cursor-pointer"
                  aria-label="Remove item"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            );
          })
        )}
      </div>

      {cartItems.length > 0 && (
        <div className="px-4 sm:px-5 py-4 border-t border-[#e8edf2] bg-white space-y-3 shrink-0">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#8a9bb0]">
              Subtotal
            </span>
            <span className="text-base font-black text-[#1A1D4E] font-mono">
              ৳{subtotal.toLocaleString()}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={handleClearCart}
              className="py-2.5 px-3 rounded-[5px] border border-[#e8edf2] bg-white hover:bg-red-50 hover:border-red-200 hover:text-red-600 text-[10px] font-bold uppercase tracking-widest text-[#8a9bb0] transition-colors cursor-pointer"
            >
              Clear cart
            </button>
            <button
              type="button"
              onClick={() => {
                onClose();
                navigate(mode === 'retail' ? '/cart/retail' : '/cart/b2b');
              }}
              className="py-2.5 px-3 rounded-[5px] border border-[#e8edf2] bg-[#F8FAFC] hover:bg-white text-[10px] font-bold uppercase tracking-widest text-[#1A1D4E] transition-colors cursor-pointer"
            >
              Full cart
            </button>
          </div>

          <button
            type="button"
            onClick={handleCheckout}
            className="w-full h-11 rounded-[5px] bg-[#E8500A] hover:bg-[#d14808] text-white text-[11px] font-black uppercase tracking-[0.16em] flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-sm"
          >
            Checkout
            <ArrowRight size={14} />
          </button>
        </div>
      )}
    </>
  );

  if (typeof document === 'undefined') return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <>
          {isMobileSheet && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.45 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
              className="fixed inset-0 bg-black z-[220] cursor-pointer"
            />
          )}

          <motion.div
            ref={panelRef}
            id="choosify-cart-preview"
            role="dialog"
            aria-modal="true"
            aria-label="Shopping cart"
            initial={
              isMobileSheet
                ? { y: '100%', opacity: 1 }
                : { opacity: 0, y: -8, scale: 0.98 }
            }
            animate={
              isMobileSheet
                ? { y: 0, opacity: 1 }
                : { opacity: 1, y: 0, scale: 1 }
            }
            exit={
              isMobileSheet
                ? { y: '100%', opacity: 1 }
                : { opacity: 0, y: -8, scale: 0.98 }
            }
            transition={{ type: 'spring', damping: 28, stiffness: 320 }}
            style={
              isMobileSheet
                ? undefined
                : {
                    top: dropdownStyle.top,
                    right: dropdownStyle.right,
                  }
            }
            className={cn(
              'bg-white border border-[#e8edf2] shadow-[0_24px_55px_rgba(0,0,0,0.16)] z-[230] flex flex-col overflow-hidden text-[#1A1D4E]',
              isMobileSheet
                ? 'fixed bottom-0 left-0 right-0 max-h-[82vh] rounded-t-2xl'
                : 'fixed w-[min(24rem,calc(100vw-1.5rem))] max-h-[min(32rem,calc(100vh-6rem))] rounded-[5px]',
            )}
          >
            {panelContent}
          </motion.div>
        </>
      )}
    </AnimatePresence>,
    document.body,
  );
}
