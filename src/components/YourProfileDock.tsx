import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  User, ArrowRight, X, ChevronDown, ChevronRight, 
  ShoppingCart, MessageSquare, Bookmark, Clock, 
  Shield, Bell, HelpCircle, LogOut, Settings, Heart, Radio
} from 'lucide-react';
import { cn } from '../lib/utils';
import { toast } from 'react-hot-toast';

export function YourProfileDock() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeAccordion, setActiveAccordion] = useState<string | null>('account');
  const drawerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const location = useLocation();

  // Close drawer on page navigation
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  // Handle outside click to close drawer
  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (
        isOpen && 
        drawerRef.current && 
        !drawerRef.current.contains(event.target as Node) &&
        triggerRef.current &&
        !triggerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [isOpen]);

  // Handle Escape key to close drawer
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const toggleAccordion = (name: string) => {
    setActiveAccordion(activeAccordion === name ? null : name);
  };

  const accordionGroups = [
    {
      id: 'account',
      title: 'Account Settings',
      items: [
        { to: '/dashboard', label: 'My Dashboard', icon: User, badge: 'FARHAN' },
        { to: '/dashboard', label: 'Order History', icon: ShoppingCart, badge: '35' },
        { to: '/dashboard', label: 'Profile Settings', icon: Settings },
      ]
    },
    {
      id: 'activity',
      title: 'My Activity & Stash',
      items: [
        { to: '/dashboard', label: 'Saved Products', icon: Bookmark, badge: '550' },
        { to: '/dashboard', label: 'Recently Viewed', icon: Clock, badge: '15' },
        { to: '/brands', label: 'Followed Brands', icon: Heart, badge: '8' },
      ]
    },
    {
      id: 'social',
      title: 'Social & Creators',
      items: [
        { to: '/messages', label: 'Messages Inbox', icon: MessageSquare, badge: '20' },
        { to: '/creators', label: 'Followed Creators', icon: Radio, badge: '12' },
      ]
    },
    {
      id: 'messages',
      title: 'Notifications & Alerts',
      items: [
        { to: '/messages', label: 'Activity Logs', icon: Bell, badge: 'New' },
        { to: '/messages', label: 'Support Inquiries', icon: Shield },
      ]
    },
    {
      id: 'support',
      title: 'Customer Experience',
      items: [
        { to: '/messages', label: 'Help Desk FAQ', icon: HelpCircle },
        { to: '/messages', label: 'Contact Support', icon: MessageSquare },
      ]
    }
  ];

  return (
    <>
      {/* COLLAPSED FLOATING PILL BUTTON */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            ref={triggerRef}
            key="collapsed-dock"
            id="floating-profile-dock-pill"
            initial={{ scale: 0, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0, opacity: 0, y: 20 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-[115px] sm:bottom-6 right-3 sm:right-6 lg:bottom-8 lg:right-8 z-[200] flex items-center gap-2.5 bg-white border border-[#E8500A]/30 hover:border-[#E8500A] text-[#1A1A2E] rounded-full px-5 py-3 shadow-[0_8px_30px_rgba(232,80,10,0.15)] hover:shadow-[0_8px_30px_rgba(232,80,10,0.25)] transition-all duration-300 font-sans cursor-pointer group"
          >
            <div className="w-6 h-6 rounded-full overflow-hidden bg-orange-primary/10 flex items-center justify-center border border-[#e8edf2] shrink-0">
              <img 
                src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=60&h=60&fit=crop" 
                className="w-full h-full object-cover" 
                alt="" 
                referrerPolicy="no-referrer"
              />
            </div>
            <span className="text-[10px] sm:text-xs font-black uppercase tracking-wider">
              YOUR PROFILE
            </span>
            <ArrowRight size={14} className="text-[#E8500A] transition-transform duration-300 group-hover:translate-x-1" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* EXPANDED PROFILE DRAWER */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop for mobile overlays */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.3 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 z-[220] md:hidden"
              onClick={() => setIsOpen(false)}
            />

            <motion.div
              ref={drawerRef}
              key="expanded-drawer"
              id="floating-profile-dock-drawer"
              initial={{ x: '100%', opacity: 0.5 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: '100%', opacity: 0.5 }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              // Position variables based on system responsiveness instructions
              className={cn(
                "fixed bg-white shadow-2xl flex flex-col z-[250] overflow-hidden border-[#e8edf2] font-sans text-[#1A1A2E]",
                // Desktop
                "lg:bottom-6 lg:right-6 lg:top-auto lg:h-[720px] lg:w-[400px] lg:rounded-[12px] lg:border",
                // Tablet
                "md:right-0 md:top-0 md:bottom-0 md:h-full md:w-[420px] md:rounded-l-[12px] md:border-l",
                // Mobile
                "left-0 right-0 bottom-0 top-[12vh] h-[88vh] w-full rounded-t-[16px] border-t"
              )}
            >
              {/* HEADER REGION (NON-COLLAPSIBLE PROFILE CARD) */}
              <div className="p-5 border-b border-[#e8edf2] bg-gradient-to-br from-[#FFF8F5]/80 to-[#FFF0E8]/50 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-4 text-left">
                  <div className="w-12 h-12 rounded-full border-2 border-white overflow-hidden shadow-md shrink-0">
                    <img 
                      src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&h=120&fit=crop" 
                      className="w-full h-full object-cover" 
                      alt="Farhan Bin Rafiq" 
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-[#1A1A2E] leading-tight uppercase font-sans">
                      Farhan Bin Rafiq
                    </h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="inline-block bg-[#E8500A]/10 text-[#E8500A] text-[8px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full">
                        PREMIUM CONSUMER
                      </span>
                      <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                    </div>
                  </div>
                </div>

                <button 
                  onClick={() => setIsOpen(false)}
                  className="w-9 h-9 rounded-full bg-white hover:bg-gray-100 flex items-center justify-center text-gray-400 hover:text-navy transition-all border border-[#e8edf2] cursor-pointer"
                >
                  <X size={15} />
                </button>
              </div>

              {/* DRAWERS GROUPS (ACCORDIONS) */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3 no-scrollbar text-left select-none">
                {accordionGroups.map((group) => {
                  const isExpanded = activeAccordion === group.id;

                  return (
                    <div 
                      key={group.id} 
                      className={cn(
                        "border border-[#e8edf2] rounded-[8px] overflow-hidden transition-all duration-300",
                        isExpanded ? "bg-white border-[#E8500A]/10 shadow-sm" : "bg-white hover:bg-[#FFF8F5]/30"
                      )}
                    >
                      <button
                        onClick={() => toggleAccordion(group.id)}
                        className="w-full px-4 py-3.5 flex items-center justify-between font-sans text-xs font-black uppercase tracking-wider text-navy bg-transparent outline-none border-none focus:outline-none cursor-pointer"
                      >
                        <span className={cn("transition-colors duration-200", isExpanded && "text-[#E8500A]")}>
                          {group.title}
                        </span>
                        {isExpanded ? (
                          <ChevronDown size={14} className="text-[#E8500A]" />
                        ) : (
                          <ChevronRight size={14} className="text-[#8a9bb0]" />
                        )}
                      </button>

                      {/* Expanded Panel Item Links */}
                      <AnimatePresence initial={false}>
                        {isExpanded && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2, ease: 'easeInOut' }}
                            className="border-t border-[#f4f7f9] bg-[#FDFDFD]"
                          >
                            <div className="py-1 px-2 space-y-1">
                              {group.items.map((item, idx) => {
                                const Icon = item.icon;
                                return (
                                  <Link
                                    key={idx}
                                    to={item.to}
                                    id={`dock-${group.id}-${item.label.toLowerCase().replace(/\s+/g, '-')}`}
                                    className="flex items-center justify-between py-2.5 px-3 rounded-[6px] hover:bg-[#FFF0E8]/50 text-[#1A1A2E] hover:text-[#E8500A] transition-all group duration-200"
                                  >
                                    <div className="flex items-center gap-3">
                                      <Icon 
                                        size={14} 
                                        className="text-[#8a9bb0] group-hover:text-[#E8500A] transition-colors shrink-0" 
                                      />
                                      <span className="font-sans text-[11px] font-semibold uppercase tracking-wide">
                                        {item.label}
                                      </span>
                                    </div>
                                    {item.badge && (
                                      <span className={cn(
                                        "px-2 py-0.5 text-[8.5px] font-mono font-black rounded-full leading-none shrink-0",
                                        item.badge === 'New' || item.badge === 'FARHAN'
                                          ? "bg-[#E8500A] text-white"
                                          : "bg-gray-100 text-gray-500 group-hover:bg-[#FFF0E8] group-hover:text-[#E8500A]"
                                      )}>
                                        {item.badge}
                                      </span>
                                    )}
                                  </Link>
                                );
                              })}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </div>

              {/* FOOTER ACTION PANEL */}
              <div className="p-4 border-t border-[#e8edf2] bg-gray-50 flex gap-2 shrink-0">
                <button
                  onClick={() => {
                    toast.success("Successfully logged out!", { icon: '👋' });
                    setIsOpen(false);
                  }}
                  className="flex-1 py-3 bg-white hover:bg-rose-50 text-rose-650 hover:text-rose-700 font-sans text-[10px] font-black uppercase tracking-wider rounded-lg border border-[#e8edf2] hover:border-rose-200 flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-sm text-red-650"
                >
                  <LogOut size={12} />
                  <span>Log Out Session</span>
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
