import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';
import { getCategoryImage } from '../lib/categoryImages';

export type CategoryPhotoCardProps = {
  name: string;
  productCount: number;
  image?: string;
  href?: string;
  onClick?: () => void;
  isExpanded?: boolean;
  className?: string;
};

export function CategoryPhotoCard({
  name,
  productCount,
  image,
  href = '/categories',
  onClick,
  isExpanded = false,
  className,
}: CategoryPhotoCardProps) {
  const cardClass = cn(
    'choosify-category-photo-card choosify-category-card bg-white border rounded-[5px] flex flex-col overflow-hidden transition-[border-color,box-shadow,transform] duration-200 cursor-pointer group relative text-left p-0',
    isExpanded
      ? 'border-[#EB4501] ring-4 ring-[#EB4501]/5 z-20 shadow-md'
      : 'border-[#e8edf2] hover:border-[#EB4501]/25 hover:shadow-sm',
    className,
  );

  const content = (
    <>
      <div className="relative w-full aspect-[4/3] bg-[#F0F4F9] overflow-hidden">
        <img
          src={getCategoryImage(name, image)}
          alt={name}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
          loading="lazy"
        />
        {isExpanded && (
          <div className="absolute inset-0 bg-[#EB4501]/10 border-2 border-[#EB4501]/40 pointer-events-none" />
        )}
      </div>

      <div className="w-full px-3 py-3 sm:px-3.5 sm:py-3.5 border-t border-[#e8edf2] bg-white">
        <h4 className="font-semibold text-[11px] sm:text-xs text-[#1a1a2e] group-hover:text-[#CF4400] transition-colors leading-snug uppercase tracking-tight line-clamp-2">
          {name}
        </h4>
        <p className="text-[10px] text-[#EB4501] font-semibold leading-none uppercase font-mono mt-1.5">
          {productCount.toLocaleString()} Products
        </p>
      </div>

      {isExpanded && (
        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.15, ease: 'easeOut' }}
          className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-4 h-4 bg-white rotate-45 border-r border-b border-[#EB4501]/30 z-10"
        />
      )}
    </>
  );

  if (onClick) {
    return (
      <motion.div
        role="button"
        tabIndex={0}
        onClick={onClick}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onClick();
          }
        }}
        className={cardClass}
        whileTap={{ scale: 0.99 }}
        transition={{ duration: 0.12 }}
      >
        {content}
      </motion.div>
    );
  }

  return (
    <motion.div whileTap={{ scale: 0.99 }} transition={{ duration: 0.12 }} className="h-full">
      <Link to={href} className={cn(cardClass, 'h-full block no-underline')}>
        {content}
      </Link>
    </motion.div>
  );
}
