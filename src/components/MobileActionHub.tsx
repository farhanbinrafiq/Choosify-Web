import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  LayoutGrid,
  SlidersHorizontal,
  User,
  ShoppingCart,
  MessageSquare,
  ChevronRight,
  X,
} from 'lucide-react';
import { cn } from '../lib/utils';

export type MobileHubAction = {
  id: string;
  label: string;
  description?: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  badge?: number;
  onClick: () => void;
};

interface MobileActionHubProps {
  isOpen: boolean;
  onToggle: () => void;
  onClose: () => void;
  actions: MobileHubAction[];
  hubRef: React.RefObject<HTMLDivElement | null>;
}

export function MobileActionHub({
  isOpen,
  onToggle,
  onClose,
  actions,
  hubRef,
}: MobileActionHubProps) {
  const totalBadge = actions.reduce((sum, action) => sum + (action.badge || 0), 0);

  return (
    <div
      ref={hubRef}
      className="fixed z-[220] bottom-4 right-4 flex flex-col items-end sm:hidden"
      style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
    >
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[218] bg-black/40"
              onClick={onClose}
            />
            <motion.div
              initial={{ y: '100%', opacity: 1 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: '100%', opacity: 1 }}
              transition={{ type: 'spring', damping: 28, stiffness: 340 }}
              className="fixed bottom-0 left-0 right-0 z-[219] max-h-[min(70vh,520px)] rounded-t-[24px] bg-white border border-[#e8edf2] shadow-[0_-12px_40px_rgba(0,0,0,0.12)] overflow-hidden"
              style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
            >
              <div className="w-12 h-1 rounded-full bg-gray-200 mx-auto mt-3 shrink-0" />
              <div className="flex items-center justify-between px-5 pt-4 pb-3 border-b border-[#e8edf2]">
                <div>
                  <p className="text-[9px] font-black uppercase tracking-[0.18em] text-orange-primary">
                    Quick Actions
                  </p>
                  <h3 className="text-sm font-black text-heading uppercase">Menu</h3>
                </div>
                <button
                  type="button"
                  onClick={onClose}
                  className="w-9 h-9 rounded-full border border-[#e8edf2] bg-white flex items-center justify-center text-gray-400"
                  aria-label="Close quick actions"
                >
                  <X size={16} />
                </button>
              </div>
              <div className="overflow-y-auto no-scrollbar p-3 space-y-2">
                {actions.map((action) => {
                  const Icon = action.icon;
                  return (
                    <button
                      key={action.id}
                      type="button"
                      onClick={action.onClick}
                      className="w-full min-h-[52px] flex items-center justify-between gap-3 rounded-xl border border-[#e8edf2] bg-white px-4 py-3 text-left active:bg-surface-selected transition-colors"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <span className="w-10 h-10 rounded-full bg-orange-primary/10 text-orange-primary flex items-center justify-center shrink-0">
                          <Icon size={18} />
                        </span>
                        <span className="min-w-0">
                          <span className="block text-[11px] font-black uppercase tracking-wide text-heading">
                            {action.label}
                          </span>
                          {action.description && (
                            <span className="block text-[10px] text-gray-500 mt-0.5 truncate">
                              {action.description}
                            </span>
                          )}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        {action.badge !== undefined && action.badge > 0 && (
                          <span className="min-w-[20px] h-5 px-1.5 rounded-full bg-orange-primary text-white text-[9px] font-black flex items-center justify-center">
                            {action.badge > 99 ? '99+' : action.badge}
                          </span>
                        )}
                        <ChevronRight size={14} className="text-gray-300" />
                      </div>
                    </button>
                  );
                })}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <motion.button
        type="button"
        onClick={onToggle}
        whileTap={{ scale: 0.95 }}
        className={cn(
          'relative w-14 h-14 rounded-full border shadow-[0_8px_24px_rgba(0,0,0,0.15)] flex items-center justify-center transition-colors',
          isOpen
            ? 'bg-heading border-heading text-white'
            : 'bg-orange-primary border-orange-primary text-white',
        )}
        aria-label={isOpen ? 'Close quick actions menu' : 'Open quick actions menu'}
        aria-expanded={isOpen}
      >
        {isOpen ? <X size={22} /> : <LayoutGrid size={22} />}
        {!isOpen && totalBadge > 0 && (
          <span className="absolute -top-1 -right-1 min-w-[20px] h-5 px-1 rounded-full bg-white text-orange-primary text-[9px] font-black border-2 border-orange-primary flex items-center justify-center">
            {totalBadge > 99 ? '99+' : totalBadge}
          </span>
        )}
      </motion.button>
    </div>
  );
}
