import React from 'react';
import { Check, Heart, MapPin, MessageCircleMore, Star } from 'lucide-react';
import { cn } from '../../lib/utils';
import { EmiAiLogo } from '../EmiAiLogo';

/** Low stock (<15) → red urgency; mid stock (15–30) → blue; healthy stock (>30) → green. */
function resolveStockDisplay(stockQuantity: number): { label: string; bgClass: string } {
  if (stockQuantity < 15) {
    return { label: `Only ${stockQuantity} Products Left`, bgClass: 'bg-[#FF000D]' };
  }
  if (stockQuantity <= 30) {
    return { label: `${stockQuantity} Products in Stock`, bgClass: 'bg-[#2323FF]' };
  }
  return { label: `${stockQuantity} Products in Stock`, bgClass: 'bg-[#07DD05]' };
}

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
  /** Generic category-schema-driven variant dimensions (canonical). When present
   *  these replace the legacy Color/Size/RAM blocks entirely. */
  optionGroups?: Array<{ id: string; name: string; displayType?: string; values: string[] }>;
  selectedOptions?: Record<string, string>;
  onSelectOption?: (groupName: string, value: string) => void;
  isValueAvailable?: (groupName: string, value: string) => boolean;
  /** The variant row the current selection resolves to (canonical). */
  resolvedVariant?: any;
  showSizeGuideButton: boolean;
  onOpenSizeChart: () => void;
  qty: number;
  setQty: (n: number | ((prev: number) => number)) => void;
  isWishlisted: boolean;
  onToggleWishlist: () => void;
  onAddToCart: () => void;
  onCompare: () => void;
  compareDisabled?: boolean;
  compareHint?: string;
  onMessageSeller: () => void;
  isService?: boolean;
  messageCtaLabel?: string;
  onAskEmi?: () => void;
  /** Optional add-ons panel (rendered in right column) */
  addonsSlot?: React.ReactNode;
  /** Outer shell is owned by the page — keep this flush when nested in DC_CONTENT_MAX */
  className?: string;
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
  compareDisabled = false,
  compareHint,
  onMessageSeller,
  isService = false,
  messageCtaLabel = 'Message Seller',
  onAskEmi,
  addonsSlot,
  className,
  optionGroups,
  selectedOptions = {},
  onSelectOption,
  isValueAvailable,
  resolvedVariant,
}: ProductDetailBuyBoxProps) {
  const basePriceNum =
    typeof product.price === 'number'
      ? product.price
      : Number(String(product.price).replace(/[^\d.]/g, '')) || 0;
  // Selected combination resolves the exact canonical price / MRP / SKU.
  const priceNum =
    typeof resolvedVariant?.price === 'number' && resolvedVariant.price >= 0
      ? resolvedVariant.price
      : basePriceNum;
  const origNum =
    (typeof resolvedVariant?.originalPrice === 'number' && resolvedVariant.originalPrice > 0
      ? resolvedVariant.originalPrice
      : undefined) ??
    product.originalPrice ??
    product.mrp ??
    0;
  const saveAmt = Math.max(0, origNum - priceNum);
  const savePct = origNum > 0 ? Math.round((saveAmt / origNum) * 100) : 0;
  const useGenericVariants = Array.isArray(optionGroups) && optionGroups.length > 0;
  const sku = resolvedVariant?.sku;
  const sizeOptions = uniqueSizes.length > 0 ? uniqueSizes : uniqueRams;

  const colorish = (name: string) => /colou?r|shade|finish/i.test(name);

  return (
    <div className={cn('w-full pb-10', className)}>
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
        <div className="choosify-emi-gradient text-white text-[10px] font-extrabold px-3 py-1.5 rounded-full justify-self-center lg:justify-self-end whitespace-nowrap">
          TRENDING
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1.6fr_1fr] gap-4 mb-4">
        {/* Left — product info */}
        <div className="bg-white rounded-xl border border-[#E8EDF2] p-[26px]">
          <div className="flex gap-2 mb-3.5 flex-wrap">
            <span className="bg-[#EB4501] text-white text-[9px] font-extrabold px-2.5 py-1 rounded-full">FEATURED</span>
            {isOutOfStock ? (
              <span className="bg-[#FF000D] text-white text-[9px] font-extrabold px-2.5 py-1 rounded-full">
              OUT OF STOCK
              </span>
            ) : (
              <span
                className={cn(
                  'text-white text-[9px] font-extrabold px-2.5 py-1 rounded-full',
                  resolveStockDisplay(stockQuantity).bgClass,
                )}
              >
                {resolveStockDisplay(stockQuantity).label}
              </span>
            )}
          </div>
          <h1 className="text-2xl font-extrabold text-[#1A1A2E] mb-1">{product.title}</h1>
          <div className="text-[13px] text-[#9AA0AC] mb-2.5">
            {brandName}
            {selectedColor ? ` · ${selectedColor}` : ''}
          </div>
          <div className="text-[13px] text-[#1A1A2E] mb-[18px] flex items-center gap-1.5 flex-wrap">
            <span className="inline-flex text-[#EB4501] gap-0.5">
              {[1, 2, 3, 4, 5].map((i) => (
                <Star
                  key={i}
                  size={12}
                  className={cn(
                    'fill-current',
                    i <= Math.floor(product.rating || 4) ? 'text-[#EB4501]' : 'text-slate-300',
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
            <div className="text-[26px] font-extrabold text-[#EB4501]">BDT {priceNum.toLocaleString()}</div>
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
          <div className="text-xs text-[#EB4501] mb-1">
            Get up to ৳ cashback · EMI available on this product
          </div>
          {sku && (
            <div className="text-[11px] text-[#9AA0AC] mb-4">SKU: <span className="font-semibold text-[#4B5563]">{sku}</span></div>
          )}
          {!sku && <div className="mb-4" />}

          {/* Generic, category-schema-driven variant dimensions (any names). */}
          {!isService && useGenericVariants && (
            <div className="mb-3">
              {optionGroups!.map((g) => {
                const current = selectedOptions[g.name] || '';
                return (
                  <div key={g.id} className="mb-4">
                    <div className="text-[11.5px] font-bold text-[#1A1A2E] mb-2">
                      {g.name.toUpperCase()}: {(current || '—')}
                    </div>
                    <div className="flex gap-2.5 flex-wrap">
                      {g.values.map((val) => {
                        const isSelected = current === val;
                        const available = isValueAvailable ? isValueAvailable(g.name, val) : true;
                        if (colorish(g.name)) {
                          return (
                            <button
                              key={val}
                              type="button"
                              onClick={() => onSelectOption?.(g.name, val)}
                              disabled={!available}
                              title={available ? val : `${val} — unavailable`}
                              className={cn(
                                'w-9 h-9 rounded-full border-2 flex items-center justify-center',
                                isSelected ? 'border-[#EB4501]' : 'border-transparent hover:border-slate-300',
                                !available && 'opacity-35 cursor-not-allowed',
                              )}
                              aria-label={val}
                            >
                              <span className={cn('w-6 h-6 rounded-full block shadow', getColorHexClass(val))} />
                            </button>
                          );
                        }
                        return (
                          <button
                            key={val}
                            type="button"
                            onClick={() => onSelectOption?.(g.name, val)}
                            disabled={!available}
                            className={cn(
                              'h-9 px-4 rounded-lg text-[11px] font-bold border transition-colors',
                              isSelected
                                ? 'border-[#EB4501] text-[#1A1A2E] bg-[#FFF6EF]'
                                : 'border-[#E5E7EB] text-[#1A1A2E] hover:border-slate-300',
                              !available && 'opacity-40 line-through cursor-not-allowed hover:border-[#E5E7EB]',
                            )}
                          >
                            {val}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
              {showSizeGuideButton && (
                <button type="button" onClick={onOpenSizeChart} className="text-[11px] font-bold text-[#EB4501]">
                  📏 Size Chart
                </button>
              )}
            </div>
          )}

          {!isService && !useGenericVariants && uniqueColors.length > 0 && (
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
                        isSelected ? 'border-[#EB4501]' : 'border-transparent hover:border-slate-300',
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

          {!isService && !useGenericVariants && sizeOptions.length > 0 && (
          <>
          <div className="flex justify-between items-center mb-2">
            <div className="text-[11.5px] font-bold text-[#1A1A2E]">
              {uniqueSizes.length > 0 ? 'SIZE' : 'STORAGE'}:{' '}
              {selectedSize || selectedStorage || selectedRam || sizeOptions[0]}
            </div>
            {showSizeGuideButton && (
              <button
                type="button"
                onClick={onOpenSizeChart}
                className="text-[11px] font-bold text-[#EB4501]"
              >
                📏 Size Chart
              </button>
            )}
          </div>
          <div className="flex gap-2.5 flex-wrap mb-5">
            {sizeOptions.map((size) => {
              const isSelected =
                selectedSize === size || selectedRam === size || selectedStorage === size;
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
                      ? 'border-[#EB4501] text-[#1A1A2E] bg-[#FFF6EF]'
                      : 'border-[#E5E7EB] text-[#1A1A2E] hover:border-slate-300',
                  )}
                >
                  {size}
                </button>
              );
            })}
          </div>
          </>
          )}

          {onAskEmi && (
            <button
              type="button"
              onClick={onAskEmi}
              className="mt-1 inline-flex items-center gap-2 text-white border-none px-5 py-3 rounded-lg text-[12.5px] font-bold cursor-pointer choosify-emi-gradient"
            >
              <EmiAiLogo size={24} />
              Ask EMI about this product
            </button>
          )}
        </div>

        {/* Right — commerce actions */}
        <div className="flex flex-col gap-3.5">
          <div className="flex flex-col gap-2.5">
            {!isService && (
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
            )}
            {!isService && (
            <button
              type="button"
              onClick={onAddToCart}
              disabled={isOutOfStock}
              className={cn(
                'w-full border-none py-3.5 rounded-lg text-[13px] font-bold',
                isOutOfStock
                  ? 'bg-[#F1F1F3] text-[#9AA0AC] cursor-not-allowed'
                  : 'bg-[#EB4501] text-white hover:bg-[#CF4400]',
              )}
            >
              {isOutOfStock ? 'OUT OF STOCK' : 'ADD TO CART'}
            </button>
            )}
            {isService && (
              <button
                type="button"
                onClick={onMessageSeller}
                className="w-full bg-[#EB4501] text-white border-none py-3.5 rounded-lg text-[13px] font-bold inline-flex items-center justify-center gap-2 hover:bg-[#CF4400]"
              >
                <MessageCircleMore size={14} />
                {messageCtaLabel}
              </button>
            )}
            {!isService && (
            <>
            <button
              type="button"
              onClick={onToggleWishlist}
              className={cn(
                'w-full bg-white border py-3 rounded-lg text-[12.5px] font-semibold inline-flex items-center justify-center gap-2 transition-colors',
                isWishlisted
                  ? 'border-[#EB4501] text-[#EB4501]'
                  : 'border-[#E5E7EB] text-[#EB4501]',
              )}
            >
              <Heart
                size={14}
                strokeWidth={2}
                className={cn(
                  'text-[#EB4501]',
                  isWishlisted && 'fill-[#EB4501]',
                )}
              />
              {isWishlisted ? 'Wishlisted' : 'Add to Wishlist'}
            </button>
            <button
              type="button"
              onClick={onCompare}
              title={compareHint || (compareDisabled ? 'Unavailable for current comparison' : 'Add to Compare')}
              aria-label={compareHint || 'Add to Compare'}
              aria-disabled={compareDisabled}
              className={cn(
                'w-full bg-white border border-[#E5E7EB] py-3 rounded-lg text-[12.5px] font-semibold hover:border-[#D1D5DB] transition-all',
                compareDisabled && 'opacity-40 grayscale cursor-not-allowed hover:border-[#E5E7EB]',
              )}
            >
              <span className={cn('choosify-emi-gradient-text', compareDisabled && 'opacity-70')}>
                ⇄ Compare
              </span>
            </button>
            <button
              type="button"
              onClick={onMessageSeller}
              className="w-full bg-[#000435] text-white border-none py-3 rounded-lg text-[12.5px] font-bold inline-flex items-center justify-center gap-2 hover:brightness-110"
            >
              <MessageCircleMore size={14} />
              {messageCtaLabel}
            </button>
            </>
            )}
          </div>

          {addonsSlot && (
            <div className="bg-white rounded-xl border border-[#E8EDF2] p-5">{addonsSlot}</div>
          )}

          {(() => {
            const di = product.deliveryInfo || {};
            const facts: string[] = Array.isArray(di.bullets) && di.bullets.filter(Boolean).length
              ? di.bullets.filter(Boolean)
              : ['Cash on Delivery available', 'Standard delivery across Bangladesh'];
            const region: string = di.region || 'Bangladesh';
            return (
              <div className="bg-white rounded-xl border border-[#E8EDF2] p-[18px] text-[12.5px] text-[#4B5563] leading-relaxed">
                <div className="text-[11px] font-extrabold text-[#9AA0AC] uppercase mb-2">Delivery Information</div>
                <div className="flex items-center gap-1.5 mb-2 text-[#1A1A2E] font-semibold">
                  <MapPin size={13} className="text-[#EB4501]" /> {region}
                </div>
                <ul className="m-0 p-0 list-none space-y-1">
                  {facts.map((f) => (
                    <li key={f} className="flex items-start gap-1.5">
                      <Check size={13} className="text-[#07DD05] mt-0.5 shrink-0" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })()}
        </div>
      </div>
    </div>
  );
}
