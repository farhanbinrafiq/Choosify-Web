import React from 'react';
import { ShoppingCart } from 'lucide-react';
import { cn } from '../../lib/utils';

interface CartIconButtonProps {
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  /** Outer diameter in px (default 28) */
  size?: number;
  className?: string;
  label?: string;
}

/**
 * Platform-standard product-card cart control: circular orange button with a
 * cart glyph and a small blue "+" badge in the corner (Flash Deal reference style).
 */
export function CartIconButton({
  onClick,
  size = 28,
  className,
  label = 'Add to cart',
}: CartIconButtonProps) {
  const iconSize = Math.max(12, Math.round(size * 0.48));
  const badgeSize = Math.min(16, Math.max(12, Math.round(size * 0.5)));
  const badgeFont = Math.min(10, Math.max(8, Math.round(size * 0.34)));

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'relative rounded-full bg-[#EB4501] text-white flex items-center justify-center border-0 cursor-pointer shrink-0 hover:brightness-110 active:scale-95 transition-all p-0',
        className,
      )}
      style={{ width: size, height: size }}
      aria-label={label}
      title={label}
    >
      <ShoppingCart size={iconSize} strokeWidth={1.7} className="text-white" />
      <span
        className="absolute -top-1 -right-1 rounded-full bg-[#2323FF] text-white font-extrabold flex items-center justify-center leading-none pointer-events-none"
        style={{ width: badgeSize, height: badgeSize, fontSize: badgeFont }}
      >
        +
      </span>
    </button>
  );
}
