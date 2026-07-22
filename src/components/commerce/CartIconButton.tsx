import React from 'react';
import { ArrowRight, ShoppingCart, type LucideIcon } from 'lucide-react';
import { cn } from '../../lib/utils';

interface CartIconButtonProps {
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  /** Outer diameter in px (default 28) */
  size?: number;
  className?: string;
  label?: string;
  /** Override glyph — defaults to cart; services use ArrowRight */
  icon?: LucideIcon;
  /** Blue "+" badge (cart add affordance). Off for non-cart actions. */
  showBadge?: boolean;
}

/**
 * Platform-standard product-card action control: circular orange button.
 * Physical products use cart + badge; service listings use arrow-forward (view/book).
 */
export function CartIconButton({
  onClick,
  size = 28,
  className,
  label = 'Add to cart',
  icon: Icon = ShoppingCart,
  showBadge = true,
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
      <Icon size={iconSize} strokeWidth={1.7} className="text-white" />
      {showBadge ? (
        <span
          className="absolute -top-1 -right-1 rounded-full bg-[#2323FF] text-white font-extrabold flex items-center justify-center leading-none pointer-events-none"
          style={{ width: badgeSize, height: badgeSize, fontSize: badgeFont }}
        >
          +
        </span>
      ) : null}
    </button>
  );
}

/** Same chrome as cart button; ArrowRight signals view / Message to Book for services. */
export function ServiceViewIconButton({
  onClick,
  size = 28,
  className,
  label = 'View service',
}: Omit<CartIconButtonProps, 'icon' | 'showBadge'>) {
  return (
    <CartIconButton
      onClick={onClick}
      size={size}
      className={className}
      label={label}
      icon={ArrowRight}
      showBadge={false}
    />
  );
}
