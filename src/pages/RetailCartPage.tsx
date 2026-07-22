import React from 'react';
import { useGlobalState } from '../context/GlobalStateContext';
import { Link, useNavigate } from 'react-router-dom';
import { cn } from '../lib/utils';
import {
  Plus,
  Minus,
  Trash2,
  ShoppingCart,
  ArrowRight,
  ShieldCheck,
  Truck,
  Store,
  AlertCircle,
} from 'lucide-react';
import toast from 'react-hot-toast';

/** Choosify.dc.html-aligned cart — compact navy header + light #F4F7F9 body (matches Checkout) */
export function RetailCartPage() {
  const { retailCart, updateCartQuantity, removeFromCart, clearCart } = useGlobalState();
  const navigate = useNavigate();

  const groupedCart = retailCart.reduce((acc: { [key: string]: typeof retailCart }, item) => {
    const sellerId = item.product.sellerId || 'seller-general';
    if (!acc[sellerId]) acc[sellerId] = [];
    acc[sellerId].push(item);
    return acc;
  }, {});

  const sellerIds = Object.keys(groupedCart);

  const calculateSellerSubtotal = (items: typeof retailCart) => {
    return items.reduce((sum, item) => {
      const price =
        item.selectedVariant && item.selectedVariant.price !== undefined
          ? item.selectedVariant.price
          : item.product.price;
      return sum + price * item.quantity;
    }, 0);
  };

  const DELIVERY_FEE_PER_SELLER = 120;
  const deliveryTotal = sellerIds.length * DELIVERY_FEE_PER_SELLER;

  const subtotal = retailCart.reduce((sum, item) => {
    const price =
      item.selectedVariant && item.selectedVariant.price !== undefined
        ? item.selectedVariant.price
        : item.product.price;
    return sum + price * item.quantity;
  }, 0);
  const aggregateTotal = subtotal + deliveryTotal;
  const isCODEligible = aggregateTotal < 150000;

  const handleQtyChange = (item: any, amount: number) => {
    const newQty = item.quantity + amount;
    if (newQty <= 0) {
      removeFromCart(item.id);
    } else {
      const itemStock =
        item.selectedVariant && item.selectedVariant.stock !== undefined
          ? item.selectedVariant.stock
          : item.product.stock !== undefined
            ? item.product.stock
            : 58;
      if (itemStock !== undefined && newQty > itemStock) {
        toast.error(`Only ${itemStock} units currently available for this selection.`);
        return;
      }
      updateCartQuantity(item.id, newQty);
    }
  };

  const handleProceedToCheckout = () => {
    if (retailCart.length === 0) {
      toast.error('Your Retail Cart is empty!');
      return;
    }

    for (const item of retailCart) {
      const itemStock =
        item.selectedVariant && item.selectedVariant.stock !== undefined
          ? item.selectedVariant.stock
          : item.product.stock !== undefined
            ? item.product.stock
            : 58;
      if (itemStock === 0) {
        toast.error(
          `"${item.product.title}" is out of stock in this combination! Please remove before checkout.`,
        );
        return;
      }
    }

    navigate('/checkout');
  };

  return (
    <div className="flex flex-col min-h-screen bg-choosify-feed">
      <div className="w-full px-5 sm:px-10 pt-4">
        <header className="max-w-[1100px] mx-auto choosify-dark-surface text-white px-5 sm:px-10 py-7 rounded-none overflow-hidden">
          <nav className="text-xs text-white/45 mb-3" aria-label="Breadcrumb">
            <Link to="/" className="hover:text-white/80">
              Home
            </Link>
            <span className="mx-1.5">›</span>
            <span className="text-[#EB4501]">Shopping Cart</span>
          </nav>
          <h1 className="text-[22px] sm:text-[26px] font-extrabold tracking-tight mb-1">
            Shopping Cart
          </h1>
          <p className="text-[12.5px] text-white/55 m-0">
            Review items by seller, then checkout securely.
          </p>
        </header>
      </div>

      <div className="max-w-[1100px] mx-auto w-full px-5 sm:px-8 py-8 flex-1">
        {retailCart.length === 0 ? (
          <div className="bg-white border border-[#E8EDF2] rounded-xl p-12 sm:p-16 text-center shadow-sm max-w-xl mx-auto flex flex-col items-center gap-5">
            <div className="w-20 h-20 bg-[#FFF3EA] rounded-full flex items-center justify-center text-[#EB4501]">
              <ShoppingCart size={36} strokeWidth={2} />
            </div>
            <div>
              <h3 className="text-xl font-extrabold text-[#1A1A2E] tracking-tight mb-1.5">
                Your cart is empty
              </h3>
              <p className="text-[12.5px] text-[#9AA0AC] font-semibold">
                Add products to start checking out
              </p>
            </div>
            <Link
              to="/products"
              className="inline-flex items-center gap-2 bg-[#EB4501] hover:bg-[#CF4400] text-white text-xs font-bold px-6 py-3 rounded-lg transition-colors"
            >
              Browse products <ArrowRight size={14} />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-5">
              {sellerIds.map((sellerId) => {
                const items = groupedCart[sellerId];
                const sellerName = items[0]?.product?.brand || items[0]?.product?.brandName || 'General Vendor';
                const sellerSubtotal = calculateSellerSubtotal(items);

                return (
                  <div
                    key={sellerId}
                    className="bg-white border border-[#E8EDF2] rounded-xl overflow-hidden shadow-sm"
                  >
                    <div className="bg-[#F4F7F9] border-b border-[#E8EDF2] px-5 py-3.5 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="w-8 h-8 rounded-full bg-[#000435] flex items-center justify-center text-white shrink-0">
                          <Store size={14} />
                        </div>
                        <div className="min-w-0">
                          <h3 className="text-[13px] font-extrabold text-[#1A1A2E] truncate">
                            {sellerName}
                          </h3>
                          <span className="text-[10.5px] font-semibold text-[#9AA0AC]">
                            Fulfillment · Dhaka warehouse
                          </span>
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <span className="text-[10px] font-bold text-[#9AA0AC] block leading-none mb-1">
                          Seller subtotal
                        </span>
                        <span className="text-sm font-extrabold text-[#1A1A2E]">
                          ৳{sellerSubtotal.toLocaleString()}
                        </span>
                      </div>
                    </div>

                    <div className="divide-y divide-[#E8EDF2]">
                      {items.map((item) => {
                        const product = item.product;
                        const itemPrice =
                          item.selectedVariant && item.selectedVariant.price !== undefined
                            ? item.selectedVariant.price
                            : item.product.price;
                        const itemStock =
                          item.selectedVariant && item.selectedVariant.stock !== undefined
                            ? item.selectedVariant.stock
                            : product.stock !== undefined
                              ? product.stock
                              : 58;

                        return (
                          <div
                            key={item.id}
                            className="p-5 flex flex-col sm:flex-row gap-4 hover:bg-[#F4F7F9]/60 transition-colors"
                          >
                            <div className="w-20 h-20 bg-white border border-[#E8EDF2] rounded-lg overflow-hidden flex-shrink-0 flex items-center justify-center p-2">
                              <img
                                src={item.selectedVariant?.image || product.image}
                                className="w-full h-full object-contain"
                                alt={product.title}
                              />
                            </div>

                            <div className="flex-1 flex flex-col justify-between min-w-0">
                              <div>
                                <div className="flex justify-between items-start gap-2 mb-1">
                                  <Link
                                    to={`/products/${product.id}`}
                                    className="text-[13px] font-bold text-[#1A1A2E] hover:text-[#CF4400] transition-colors line-clamp-2"
                                  >
                                    {product.title}
                                  </Link>
                                  <button
                                    type="button"
                                    onClick={() => removeFromCart(item.id)}
                                    className="text-[#9AA0AC] hover:text-red-500 transition-colors bg-transparent border-0 cursor-pointer p-0"
                                    aria-label="Remove item"
                                  >
                                    <Trash2 size={16} />
                                  </button>
                                </div>

                                {item.selectedVariant && (
                                  <div className="flex flex-wrap gap-1 mt-1 mb-1.5">
                                    {Object.entries(item.selectedVariant.attributes).map(
                                      ([key, value]) => (
                                        <span
                                          key={key}
                                          className="bg-[#FFF3EA] text-[#EB4501] text-[10px] font-bold px-2 py-0.5 rounded"
                                        >
                                          {key}: {value as string}
                                        </span>
                                      ),
                                    )}
                                    {item.selectedVariant.sku && (
                                      <span className="bg-[#F4F7F9] text-[#9AA0AC] text-[10px] font-semibold px-1.5 py-0.5 rounded font-mono">
                                        {item.selectedVariant.sku}
                                      </span>
                                    )}
                                  </div>
                                )}

                                <div className="flex items-center gap-3 mb-2">
                                  <span className="text-[11px] font-semibold text-[#9AA0AC]">
                                    {product.category}
                                  </span>
                                  <span
                                    className={cn(
                                      'text-[10px] font-bold px-2 py-0.5 rounded',
                                      itemStock === 0
                                        ? 'bg-red-50 text-red-500'
                                        : 'bg-green-50 text-green-700',
                                    )}
                                  >
                                    {itemStock === 0 ? 'Out of stock' : `${itemStock} left`}
                                  </span>
                                </div>
                              </div>

                              <div className="flex items-center justify-between gap-4 pt-1">
                                <div className="flex items-center gap-1 border border-[#E8EDF2] rounded-lg bg-white p-1">
                                  <button
                                    type="button"
                                    onClick={() => handleQtyChange(item, -1)}
                                    className="w-7 h-7 rounded-md hover:bg-[#F4F7F9] flex items-center justify-center text-[#9AA0AC] hover:text-[#1A1A2E] transition-colors border-0 bg-transparent cursor-pointer"
                                  >
                                    <Minus size={12} />
                                  </button>
                                  <span className="text-xs font-extrabold px-3 text-[#1A1A2E]">
                                    {item.quantity}
                                  </span>
                                  <button
                                    type="button"
                                    disabled={itemStock !== undefined && item.quantity >= itemStock}
                                    onClick={() => handleQtyChange(item, 1)}
                                    className="w-7 h-7 rounded-md hover:bg-[#F4F7F9] flex items-center justify-center text-[#9AA0AC] hover:text-[#1A1A2E] transition-colors disabled:opacity-30 border-0 bg-transparent cursor-pointer"
                                  >
                                    <Plus size={12} />
                                  </button>
                                </div>

                                <div className="text-right">
                                  <span className="text-[10px] font-bold text-[#9AA0AC] block leading-none mb-1">
                                    Line total
                                  </span>
                                  <span className="text-[14px] font-extrabold text-[#EB4501]">
                                    ৳{(itemPrice * item.quantity).toLocaleString()}
                                  </span>
                                  <span className="text-[10.5px] text-[#9AA0AC] block mt-0.5">
                                    ৳{itemPrice.toLocaleString()} / pc
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    <div className="bg-[#F4F7F9] border-t border-[#E8EDF2] px-5 py-3 flex items-center gap-2 text-[11.5px] font-semibold text-[#4B5563]">
                      <Truck size={14} className="text-[#000435]" />
                      <span>Delivery: Paperfly dispatch (৳{DELIVERY_FEE_PER_SELLER})</span>
                    </div>
                  </div>
                );
              })}

              <div className="flex items-center justify-between pt-1">
                <Link
                  to="/products"
                  className="text-[12.5px] font-bold text-[#1A1A2E] hover:text-[#CF4400] transition-colors"
                >
                  ← Continue shopping
                </Link>
                <button
                  type="button"
                  onClick={() => {
                    clearCart();
                    toast.success('Retail Cart Cleared successfully.');
                  }}
                  className="text-[12.5px] font-bold text-red-500 hover:text-red-600 transition-colors bg-transparent border-0 cursor-pointer"
                >
                  Clear cart
                </button>
              </div>
            </div>

            <div className="space-y-4">
              <div className="bg-white border border-[#E8EDF2] rounded-xl p-6 shadow-sm space-y-5">
                <h3 className="text-[15px] font-extrabold text-[#1A1A2E] tracking-tight border-b border-[#E8EDF2] pb-3.5">
                  Order summary
                </h3>

                <div className="space-y-3.5">
                  <div className="flex justify-between items-center text-[12.5px] font-semibold text-[#4B5563]">
                    <span>Subtotal</span>
                    <span className="font-extrabold text-[#1A1A2E]">৳{subtotal.toLocaleString()}</span>
                  </div>

                  <div className="flex justify-between items-start text-[12.5px] font-semibold text-[#4B5563]">
                    <div>
                      <span>Shipping</span>
                      <p className="text-[10.5px] text-[#9AA0AC] font-medium mt-0.5">
                        {sellerIds.length} package{sellerIds.length === 1 ? '' : 's'}
                      </p>
                    </div>
                    <span className="font-extrabold text-[#1A1A2E]">
                      ৳{deliveryTotal.toLocaleString()}
                    </span>
                  </div>

                  <div
                    className={cn(
                      'flex items-start gap-3 p-3.5 rounded-lg border text-[11.5px] font-semibold',
                      isCODEligible
                        ? 'bg-green-50/70 border-green-100 text-green-800'
                        : 'bg-red-50/70 border-red-100 text-red-700',
                    )}
                  >
                    {isCODEligible ? (
                      <>
                        <ShieldCheck size={18} className="shrink-0 text-green-600" />
                        <div>
                          <span className="font-bold">COD eligible</span>
                          <p className="text-[10.5px] font-medium text-green-700/80 mt-0.5">
                            This checkout qualifies for Cash on Delivery.
                          </p>
                        </div>
                      </>
                    ) : (
                      <>
                        <AlertCircle size={18} className="shrink-0 text-red-500" />
                        <div>
                          <span className="font-bold">COD limit exceeded</span>
                          <p className="text-[10.5px] font-medium text-red-600/80 mt-0.5">
                            Orders over ৳150,000 require prepayment or confirmation.
                          </p>
                        </div>
                      </>
                    )}
                  </div>

                  <div className="border-t border-[#E8EDF2] pt-3.5 flex justify-between items-center">
                    <span className="text-[12.5px] font-bold text-[#1A1A2E]">Grand total</span>
                    <span className="text-2xl font-extrabold text-[#EB4501] tracking-tight">
                      ৳{aggregateTotal.toLocaleString()}
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleProceedToCheckout}
                  className="w-full h-12 bg-[#EB4501] hover:bg-[#CF4400] text-white text-[13px] font-bold rounded-lg flex items-center justify-between px-5 transition-colors cursor-pointer border-0"
                >
                  <span>Proceed to checkout</span>
                  <ArrowRight size={16} />
                </button>

                <p className="text-[10.5px] font-medium text-[#9AA0AC] leading-relaxed text-center m-0">
                  Verified suppliers and secure Cash-on-Delivery logistics nationwide.
                </p>
              </div>

              <div className="choosify-dark-surface p-5 rounded-xl text-white flex gap-3.5 items-center">
                <ShieldCheck size={28} className="text-[#EB4501] shrink-0" />
                <div>
                  <h4 className="text-[12.5px] font-extrabold leading-none mb-1.5">
                    Choosify secure guarantee
                  </h4>
                  <p className="text-[10.5px] text-white/60 font-medium leading-relaxed m-0">
                    Verified suppliers, dispute monitoring, and COD protocols nationwide.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
