import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Trash2, ShoppingBag, ArrowRight, Plus, Minus } from 'lucide-react';
import { useGlobalState, CartItem } from '../context/GlobalStateContext';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const navigate = useNavigate();
  const {
    retailCart,
    removeFromCart,
    updateCartQuantity
  } = useGlobalState();

  const cartItems = retailCart;

  const getSlabPrice = (item: CartItem) => {
    if (item.selectedVariant && item.selectedVariant.price !== undefined) {
      return item.selectedVariant.price;
    }
    return item.product.price;
  };

  const calculateSubtotal = () => {
    return cartItems.reduce((acc, item) => {
      const price = getSlabPrice(item);
      return acc + (price * item.quantity);
    }, 0);
  };

  const subtotal = calculateSubtotal();
  const handleQtyChange = (item: CartItem, newQty: number) => {
    if (newQty <= 0) {
      removeFromCart(item.id);
      return;
    }

    updateCartQuantity(item.id, newQty);
  };

  const validateCartBeforeCheckout = () => {
    if (cartItems.length === 0) {
      toast.error('Your cart is empty');
      return false;
    }

    return true;
  };

  const handleCheckout = () => {
    if (!validateCartBeforeCheckout()) return;

    onClose();
    navigate('/checkout', {
      state: {
        sourceMode: 'retail',
      },
    });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black z-[200] cursor-pointer"
          />

          {/* Cart Sidebar */}
          <motion.div
            initial={{ 
              y: window.innerWidth < 640 ? '100%' : '0%', 
              x: window.innerWidth >= 640 ? '100%' : '0%' 
            }}
            animate={{ y: 0, x: 0 }}
            exit={{ 
              y: window.innerWidth < 640 ? '100%' : '0%', 
              x: window.innerWidth >= 640 ? '100%' : '0%' 
            }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed bottom-0 inset-x-0 rounded-t-2xl h-[85vh] sm:inset-x-auto sm:right-0 sm:top-0 sm:h-full sm:w-[480px] sm:rounded-none bg-white text-navy z-[210] flex flex-col shadow-2xl overflow-hidden border-l border-gray-100"
          >
            {/* Header */}
            <div className="p-6 flex items-center justify-between border-b text-white bg-orange-primary">
              <div className="flex items-center gap-3">
                <ShoppingBag className="w-6 h-6 animate-pulse" />
                <div>
                  <h3 className="text-lg font-black uppercase italic tracking-tight">
                    Shopping Cart
                  </h3>
                  <p className="text-[9px] uppercase tracking-widest text-white/70 font-bold italic">
                    Standard checkout
                  </p>
                </div>
              </div>
              <button 
                onClick={onClose}
                className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            {/* Cart Indicator */}
            <div className="bg-[#F8FAFC] px-6 py-3 flex items-center justify-between border-b border-gray-100 text-[10px] font-black uppercase tracking-widest italic">
              <span className="text-gray-400">Current Order Stream</span>
              <span className="px-3 py-1 rounded-full text-white bg-orange-primary">
                Retail
              </span>
            </div>

            {/* Cart Items Area */}
            <div className="flex-1 overflow-y-auto p-6 space-y-5">
              {cartItems.length === 0 ? (
                <div className="h-64 flex flex-col items-center justify-center text-center gap-4 text-gray-300">
                  <ShoppingBag size={48} className="stroke-1" />
                  <div className="text-xs font-black uppercase tracking-widest italic">
                    You have no items in your cart.
                  </div>
                </div>
              ) : (
                cartItems.map((item) => {
                  const product = item.product;
                  const itemPrice = getSlabPrice(item);
                  
                  return (
                    <div 
                      key={item.id} 
                      className="p-4 bg-gray-50 rounded-2xl border border-gray-100 flex gap-4 hover:bg-white hover:shadow-lg transition-all duration-300"
                    >
                      {/* Image Thumbnail */}
                      <div className="w-20 h-20 bg-white rounded-xl overflow-hidden border border-gray-100 flex-shrink-0 flex items-center justify-center p-2">
                        <img src={item.selectedVariant?.image || product.image} className="w-full h-full object-contain" alt={product.title} />
                      </div>

                      {/* Info & Quantity controls */}
                      <div className="flex-1 flex flex-col justify-between">
                        <div>
                          <div className="flex justify-between items-start gap-2 mb-1">
                            <h4 className="text-xs font-black text-navy uppercase italic tracking-tight line-clamp-1">
                              {product.title}
                            </h4>
                            <button 
                              onClick={() => removeFromCart(item.id)}
                              className="text-gray-300 hover:text-red-500 transition-colors"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                          
                          {item.selectedVariant && (
                            <div className="flex flex-wrap gap-1 mb-1.5 align-middle">
                              {Object.entries(item.selectedVariant.attributes).map(([key, value]) => (
                                <span key={key} className="bg-orange-primary/10 text-orange-deep text-[8px] font-black uppercase px-2 py-0.5 rounded tracking-wider italic">
                                  {key}: {value as string}
                                </span>
                              ))}
                              {item.selectedVariant.sku && (
                                <span className="bg-gray-100 text-gray-500 text-[8px] font-bold px-1.5 py-0.5 rounded uppercase font-mono">
                                  {item.selectedVariant.sku}
                                </span>
                              )}
                            </div>
                          )}
                          
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">{product.brand || 'Apex'}</span>
                          </div>
                        </div>

                        <div className="flex items-end justify-between gap-4">
                          {/* Quantity selector */}
                          <div className="flex items-center gap-1 border border-gray-100 rounded-full bg-white p-1">
                            <button 
                              onClick={() => handleQtyChange(item, item.quantity - 1)}
                              className="w-6 h-6 rounded-full hover:bg-gray-50 flex items-center justify-center text-gray-500"
                            >
                              <Minus size={10} />
                            </button>
                            <span className="text-xs font-black px-3 text-navy italic">{item.quantity}</span>
                            <button 
                              onClick={() => handleQtyChange(item, item.quantity + 1)}
                              className="w-6 h-6 rounded-full hover:bg-gray-50 flex items-center justify-center text-gray-500"
                            >
                              <Plus size={10} />
                            </button>
                          </div>

                          {/* Dynamic price */}
                          <div className="text-right">
                            <span className="text-[8px] font-black text-gray-300 uppercase tracking-widest block leading-none mb-1">UNIT PRICE</span>
                            <span className="text-[13px] font-black text-orange-primary italic leading-none">৳{itemPrice.toLocaleString()}</span>
                          </div>
                        </div>

                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Footer Summary Container */}
            {cartItems.length > 0 && (
              <div className="bg-[#F8FAFC] border-t border-gray-100 p-6 space-y-4 shadow-[0_-10px_30px_rgba(0,0,0,0.03)]">
                {/* Math breakdown */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-[10px] font-black text-gray-400 uppercase tracking-widest italic">
                    <span>Subtotal</span>
                    <span>৳{subtotal.toLocaleString()}</span>
                  </div>

                  <div className="flex justify-between items-center text-navy font-black italic">
                    <span className="text-[12px] uppercase tracking-widest">Estimated Total</span>
                    <span className="text-xl tracking-tight text-orange-primary leading-none">৳{subtotal.toLocaleString()}</span>
                  </div>

                  <div className="text-[8px] font-bold text-gray-400 leading-tight text-right">
                    Delivery and taxes are calculated at checkout.
                  </div>
                </div>

                {/* Confirm Checkout Button */}
                <button
                  onClick={handleCheckout}
                  className="w-full h-14 rounded-2xl flex items-center justify-between px-8 text-[11px] font-black uppercase tracking-[0.2em] italic shadow-xl transition-all cursor-pointer hover:scale-[1.01] active:scale-95 text-white bg-orange-primary shadow-orange-primary/20 hover:bg-navy"
                >
                  <span>Proceed to Order</span>
                  <ArrowRight size={18} className="animate-bounce" />
                </button>
              </div>
            )}

          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
