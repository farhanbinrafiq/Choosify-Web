import React from 'react';
import { Heart, MessageCircle, Star } from 'lucide-react';
import { cn } from '../../lib/utils';
import { EmiAiLogo } from '../EmiAiLogo';

interface ProductDetailBuyBoxProps {
  product: any;
  brandName: string;
  isOutOfStock: boolean;
  stockQuantity: number;
  purchasedCount: number;
  viewCount: number;
  uniqueColors: string[];
  uniqueSizes: string[];
  uniqueRams: string[];
  selectedColor: string;
  selectedSize: string;
  selectedRam: string;
  selectedStorage: string;
  setSelectedColor: (v: string) => void;
  setSelectedSize: (v: string) => void;
  setSelectedRam: (v: string) => void;
  getColorHexClass: (color: string) => string;
  showSizeGuideButton: boolean;
  onOpenSizeChart: () => void;
  qty: number;
  setQty: (n: number | ((prev: number) => number)) => void;
  isWishlisted: boolean;
  onToggleWishlist: () => void;
  onAddToCart: () => void;
  onCompare: () => void;
  onMessageSeller: () => void;
  onAskEmi?: () => void;
  /** Optional add-ons panel (rendered in right column) */
  addonsSlot?: React.ReactNode;
}

/** Choosify.dc.html Product Detail — stats strip + 1.6fr / 1fr buy box */
export function ProductDetailBuyBox({
  product,
  brandName,
  isOutOfStock,
  stockQuantity,
  purchasedCount,
  viewCount,
  uniqueColors,
  uniqueSizes,
  uniqueRams,
  selectedColor,
  selectedSize,
  selectedRam,
  selectedStorage,
  setSelectedColor,
  setSelectedSize,
  setSelectedRam,
  getColorHexClass,
  showSizeGuideButton,
  onOpenSizeChart,
  qty,
  setQty,
  isWishlisted,
  onToggleWishlist,
  onAddToCart,
  onCompare,
  onMessageSeller,
  onAskEmi,
  addonsSlot,
}: ProductDetailBuyBoxProps) {
  const priceNum = typeof product.price === 'number' ? product.price : Number(String(product.price).replace(/[^\d.]/g, '')) || 0;
  const origNum = product.originalPrice || product.mrp || Math.round(priceNum * 1.1);
  const saveAmt = Math.max(0, origNum - priceNum);
  const savePct = origNum > 0 ? Math.round((saveAmt / origNum) * 100) : 0;
  const sizeOptions =
    uniqueSizes.length > 0 ? uniqueSizes : uniqueRams.length > 0 ? uniqueRams : ['8GB/128GB', '12GB/256GB', '12GB/512GB', '16GB/1TB'];

  return (
    <div className="max-w-[1280px] mx-auto px-5 sm:px-8 lg:px-10 pb-10 -mt-0">
      {/* Stats strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-[repeat(4,1fr)_auto] gap-3.5 bg-white rounded-xl border border-[#E8EDF2] px-6 py-[18px] mb-4 items-center">
        <div className="text-center">
          <div className="text-lg font-extrabold text-[#1A1A2E]">★ {product.rating || '4.8'}</div>
          <div className="text-[11px] text-[#9AA0AC]">Rating</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-extrabold text-[#1A1A2E]">{(product.reviews || 12400).toLocaleString()}</div>
          <div className="text-[11px] text-[#9AA0AC]">Reviews</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-extrabold text-[#1A1A2E]">{purchasedCount.toLocaleString()}</div>
          <div className="text-[11px] text-[#9AA0AC]">Orders</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-extrabold text-[#1A1A2E]">{viewCount.toLocaleString()}</div>
          <div className="text-[11px] text-[#9AA0AC]">Views</div>
        </div>
        <div className="bg-[#1A1A2E] text-white text-[10px] font-extrabold px-3 py-1.5 rounded justify-self-center lg:justify-self-end whitespace-nowrap">
          TRENDING
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1.6fr_1fr] gap-4 mb-4">
        {/* Left — product info */}
        <div className="bg-white rounded-xl border border-[#E8EDF2] p-[26px]">
          <div className="flex gap-2 mb-3.5 flex-wrap">
            <span className="bg-[#FF5B00] text-white text-[9px] font-extrabold px-2.5 py-1 rounded">FEATURED</span>
            {!isOutOfStock && (
              <span className="bg-[#07DD05] text-white text-[9px] font-extrabold px-2.5 py-1 rounded">
                IN STOCK · {stockQuantity}
              </span>
            )}
          </div>
          <h1 className="text-2xl font-extrabold text-[#1A1A2E] mb-1">{product.title}</h1>
          <div className="text-[13px] text-[#9AA0AC] mb-2.5">
            {brandName}
            {selectedColor ? ` · ${selectedColor}` : ''}
          </div>
          <div className="text-[13px] text-[#1A1A2E] mb-[18px] flex items-center gap-1.5 flex-wrap">
            <span className="inline-flex text-[#FF5B00] gap-0.5">
              {[1, 2, 3, 4, 5].map((i) => (
                <Star
                  key={i}
                  size={12}
                  className={cn(
                    'fill-current',
                    i <= Math.floor(product.rating || 4) ? 'text-[#FF5B00]' : 'text-slate-300',
                  )}
                />
              ))}
            </span>
            <b>{product.rating || '4.8'}</b>
            <span className="text-[#9AA0AC]">
              ({product.reviews || '12.4K'} Reviews) · {purchasedCount}+ sold
            </span>
          </div>

          <div className="flex items-baseline gap-3 mb-1.5 flex-wrap">
            <div className="text-[26px] font-extrabold text-[#EB4501]">
              BDT {typeof product.price === 'number' ? product.price.toLocaleString() : product.price}
            </div>
            {saveAmt > 0 && (
              <>
                <div className="text-[15px] text-[#9AA0AC] line-through">
                  BDT {origNum.toLocaleString()}
                </div>
                <div className="text-[13px] text-[#07DD05] font-bold">
                  Save BDT {saveAmt.toLocaleString()} ({savePct}%)
                </div>
              </>
            )}
          </div>
          <div className="text-xs text-[#FF5B00] mb-5">
            Get up to ৳ cashback · EMI available on this product
          </div>

          {uniqueColors.length > 0 && (
            <>
              <div className="text-[11.5px] font-bold text-[#1A1A2E] mb-2">
                COLOR: {(selectedColor || uniqueColors[0] || '').toUpperCase()}
              </div>
              <div className="flex gap-2.5 mb-5 flex-wrap">
                {uniqueColors.map((color) => {
                  const isSelected = selectedColor === color;
                  return (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setSelectedColor(color)}
                      className={cn(
                        'w-9 h-9 rounded-full border-2 flex items-center justify-center',
                        isSelected ? 'border-[#FF5B00]' : 'border-transparent hover:border-slate-300',
                      )}
                      aria-label={color}
                    >
                      <span className={cn('w-6 h-6 rounded-full block shadow', getColorHexClass(color))} />
                    </button>
                  );
                })}
              </div>
            </>
          )}

          <div className="flex justify-between items-center mb-2">
            <div className="text-[11.5px] font-bold text-[#1A1A2E]">
              {uniqueSizes.length > 0 ? 'SIZE' : 'STORAGE'}:{' '}
              {selectedSize || selectedStorage || selectedRam || sizeOptions[1] || sizeOptions[0]}
            </div>
            {showSizeGuideButton && (
              <button
                type="button"
                onClick={onOpenSizeChart}
                className="text-[11px] font-bold text-[#FF5B00]"
              >
                📏 Size Chart
              </button>
            )}
          </div>
          <div className="flex gap-2.5 flex-wrap mb-5">
            {sizeOptions.map((size) => {
              const isSelected =
                selectedSize === size ||
                selectedRam === size ||
                selectedStorage === size ||
                (size === '12GB/256GB' && !selectedSize && !selectedRam);
              return (
                <button
                  key={size}
                  type="button"
                  onClick={() => {
                    if (uniqueSizes.length > 0) setSelectedSize(size);
                    else setSelectedRam(size);
                  }}
                  className={cn(
                    'h-9 px-4 rounded-lg text-[11px] font-bold border transition-colors',
                    isSelected
                      ? 'border-[#FF5B00] text-[#1A1A2E] bg-[#FFF6EF]'
                      : 'border-[#E5E7EB] text-[#1A1A2E] hover:border-slate-300',
                  )}
                >
                  {size}
                </button>
              );
            })}
          </div>

          {onAskEmi && (
            <button
              type="button"
              onClick={onAskEmi}
              className="mt-1 inline-flex items-center gap-2 text-white border-none px-5 py-3 rounded-lg text-[12.5px] font-bold cursor-pointer"
              style={{
                background:
                  'radial-gradient(1200px 500px at 15% 0%, hsla(22,100%,50%,0.5), transparent 65%), radial-gradient(900px 500px at 90% 20%, hsla(12,92%,45%,0.4), transparent 65%), #000435',
              }}
            >
              <span className="w-6 h-6 rounded-full bg-white flex items-center justify-center p-0.5 shrink-0">
                <EmiAiLogo size={16} className="w-4 h-4" />
              </span>
              Ask EMI about this product
            </button>
          )}
        </div>

        {/* Right — commerce actions */}
        <div className="flex flex-col gap-3.5">
          <div className="flex flex-col gap-2.5">
            <div className="flex items-center justify-between bg-[#F4F7F9] rounded-lg px-2.5 py-1.5">
              <span className="text-xs font-bold text-[#1A1A2E]">Quantity</span>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                  className="w-7 h-7 rounded-md border border-[#E5E7EB] bg-white text-[#1A1A2E] text-sm font-bold"
                >
                  −
                </button>
                <span className="text-[13px] font-extrabold text-[#1A1A2E] min-w-4 text-center">{qty}</span>
                <button
                  type="button"
                  onClick={() => setQty((q) => q + 1)}
                  className="w-7 h-7 rounded-md border border-[#E5E7EB] bg-white text-[#1A1A2E] text-sm font-bold"
                >
                  +
                </button>
              </div>
            </div>
            <button
              type="button"
              onClick={onAddToCart}
              disabled={isOutOfStock}
              className="w-full bg-[#FF5B00] text-white border-none py-3.5 rounded-lg text-[13px] font-bold hover:bg-[#EB4501] disabled:opacity-50"
            >
              ADD TO CART
            </button>
            <button
              type="button"
              onClick={onToggleWishlist}
              className={cn(
                'w-full bg-white border border-[#E5E7EB] py-3 rounded-lg text-[12.5px] font-semibold inline-flex items-center justify-center gap-2',
                isWishlisted && 'border-[#FF5B00] text-[#FF5B00]',
              )}
            >
              <Heart size={14} className={cn(isWishlisted && 'fill-current')} />
              {isWishlisted ? 'Wishlisted' : 'Add to Wishlist'}
            </button>
            <button
              type="button"
              onClick={onCompare}
              className="w-full bg-white text-[#1A1A2E] border border-[#E5E7EB] py-3 rounded-lg text-[12.5px] font-semibold"
            >
              ⇄ Compare
            </button>
            <button
              type="button"
              onClick={onMessageSeller}
              className="w-full bg-[#2323FF] text-white border-none py-3 rounded-lg text-[12.5px] font-bold inline-flex items-center justify-center gap-2 hover:bg-[#1a1acc]"
            >
              <MessageCircle size={14} />
              Message Seller to Buy
            </button>
          </div>

          {addonsSlot && (
            <div className="bg-white rounded-xl border border-[#E8EDF2] p-5">{addonsSlot}</div>
          )}

          <div className="bg-white rounded-xl border border-[#E8EDF2] p-[18px] text-[12.5px] text-[#4B5563] leading-relaxed">
            📍 Delivery in <b className="text-[#1A1A2E]">Dhaka, Bangladesh</b>
            <br />✓ Standard Delivery Available
          </div>
        </div>
      </div>
    </div>
  );
}
