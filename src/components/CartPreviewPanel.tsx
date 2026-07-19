import React from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Trash2, ShoppingBag, ArrowRight, Plus, Minus } from 'lucide-react';
import toast from 'react-hot-toast';
import { cn } from '../lib/utils';
import { useGlobalState, type CartItem } from '../context/GlobalStateContext';
import {
  floatingPanelDesktopClass,
  floatingPanelMobileClass,
  floatingPanelShellClass,
} from './FloatingPanelShell';

const PLACEHOLDER_IMAGE =
  'https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=200&q=80';

/** @deprecated Use floatingPanelShellClass */
export const cartPreviewShellClass = cn(floatingPanelShellClass, 'text-[#1A1D4E]');

/** @deprecated Use floatingPanelDesktopClass */
export const cartPreviewDesktopShellClass = floatingPanelDesktopClass;

/** @deprecated Use floatingPanelMobileClass */
export const cartPreviewMobileShellClass = cn(floatingPanelMobileClass, 'max-h-[82vh]');

type CartPreviewPanelProps = {
  onClose: () => void;
  className?: string;
};

export function CartPreviewPanel({ onClose, className }: CartPreviewPanelProps) {
  const navigate = useNavigate();
  const { retailCart, removeFromCart, updateCartQuantity, clearCart } = useGlobalState();

  const cartItems = retailCart;

  const getItemPrice = (item: CartItem) => {
    if (item.selectedVariant?.price !== undefined) return item.selectedVariant.price;
    return item.product.price;
  };

  const subtotal = cartItems.reduce(
    (acc, item) => acc + getItemPrice(item) * item.quantity,
    0,
  );

  const totalUnits = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const handleQtyChange = (item: CartItem, newQty: number) => {
    if (newQty <= 0) {
      removeFromCart(item.id);
      return;
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
    navigate('/checkout');
  };

  const openProduct = (item: CartItem) => {
    onClose();
    navigate(`/products/${item.product.id}`);
  };

  return (
    <div className={cn('flex flex-col min-h-0 h-full', className)}>
      <div className="px-4 sm:px-5 py-4 border-b border-[#e8edf2] flex items-center justify-between shrink-0 bg-white">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-9 h-9 rounded-full bg-[#EB4501]/10 flex items-center justify-center text-[#EB4501] shrink-0">
            <ShoppingBag size={16} />
          </div>
          <div className="min-w-0 text-left">
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#8a9bb0]">
              Retail cart
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
          className="w-8 h-8 rounded-full border border-[#e8edf2] hover:border-[#EB4501]/30 flex items-center justify-center text-[#8a9bb0] hover:text-[#CF4400] transition-colors cursor-pointer shrink-0"
          aria-label="Close cart"
        >
          <X size={16} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-4 sm:px-5 py-4 space-y-3 min-h-0 no-scrollbar">
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
              className="text-[10px] font-bold uppercase tracking-widest text-[#EB4501] hover:underline cursor-pointer"
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
                className="flex gap-3 items-start bg-[#F8FAFC] border border-[#e8edf2] hover:border-[#EB4501]/20 rounded-lg p-3 transition-colors group"
              >
                <button
                  type="button"
                  onClick={() => openProduct(item)}
                  className="w-14 h-14 rounded-lg overflow-hidden bg-white border border-[#e8edf2] shrink-0 cursor-pointer"
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
                    className="text-[11px] font-bold text-[#1A1D4E] uppercase tracking-tight line-clamp-2 text-left hover:text-[#CF4400] transition-colors w-full"
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
                    <span className="text-[11px] font-black text-[#EB4501] font-mono">
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
              className="py-2.5 px-3 rounded-lg border border-[#e8edf2] bg-white hover:bg-red-50 hover:border-red-200 hover:text-red-600 text-[10px] font-bold uppercase tracking-widest text-[#8a9bb0] transition-colors cursor-pointer"
            >
              Clear cart
            </button>
            <button
              type="button"
              onClick={() => {
                onClose();
                navigate('/cart/retail');
              }}
              className="py-2.5 px-3 rounded-lg border border-[#e8edf2] bg-[#F8FAFC] hover:bg-white text-[10px] font-bold uppercase tracking-widest text-[#1A1D4E] transition-colors cursor-pointer"
            >
              Full cart
            </button>
          </div>

          <button
            type="button"
            onClick={handleCheckout}
            className="w-full h-11 rounded-lg bg-[#EB4501] hover:bg-[#E04E00] text-white text-[11px] font-black uppercase tracking-[0.16em] flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-sm"
          >
            Checkout
            <ArrowRight size={14} />
          </button>
        </div>
      )}
    </div>
  );
}
