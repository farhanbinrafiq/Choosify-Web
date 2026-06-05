import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ShoppingCart, MessageSquare, X, Trash2, ArrowRight, Send, 
  Clock, Heart, ShoppingBag, ExternalLink, ChevronRight, CheckCircle, Package 
} from 'lucide-react';
import { useGlobalState, CartItem } from '../context/GlobalStateContext';
import { useDashboard, MessageThread, ThreadMessage } from '../context/DashboardContext';
import { PRODUCTS, PLACEHOLDER_IMAGE } from '../constants';

export function FloatingOverlays() {
  const navigate = useNavigate();
  const { mode, retailCart, wholesaleCart, removeFromCart, updateCartQuantity } = useGlobalState();
  const { threads, threadMessages, addThreadMessage } = useDashboard();

  // Active floating panel state: null | 'cart' | 'inbox'
  const [activePanel, setActivePanel] = useState<'cart' | 'inbox' | null>(null);
  
  // Selected thread inside mini message board for real-time nested chatting
  const [activeThreadId, setActiveThreadId] = useState<string | null>(null);
  const [chatInput, setChatInput] = useState('');
  
  // Cart notification bouncing tracking
  const activeCart = mode === 'retail' ? retailCart : wholesaleCart;
  const totalCartItems = activeCart.reduce((sum, item) => sum + item.quantity, 0);
  const [lastCartCount, setLastCartCount] = useState(totalCartItems);
  const [cartBadgeBounce, setCartBadgeBounce] = useState(false);

  // Unread message count across threads
  const unreadCount = threads.filter(t => t.unread).length;
  const [lastUnreadCount, setLastUnreadCount] = useState(unreadCount);
  const [inboxBadgeBounce, setInboxBadgeBounce] = useState(false);

  const miniChatBottomRef = useRef<HTMLDivElement>(null);

  // Trigger bounce on cart volume changes
  useEffect(() => {
    if (totalCartItems > lastCartCount) {
      setCartBadgeBounce(true);
      const timer = setTimeout(() => setCartBadgeBounce(false), 800);
      return () => clearTimeout(timer);
    }
    setLastCartCount(totalCartItems);
  }, [totalCartItems, lastCartCount]);

  // Trigger bounce on inbox status changes
  useEffect(() => {
    if (unreadCount > lastUnreadCount) {
      setInboxBadgeBounce(true);
      const timer = setTimeout(() => setInboxBadgeBounce(false), 800);
      return () => clearTimeout(timer);
    }
    setLastUnreadCount(unreadCount);
  }, [unreadCount, lastUnreadCount]);

  // Scroll to bottom of mini-chat
  useEffect(() => {
    if (miniChatBottomRef.current) {
      miniChatBottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [threadMessages, activeThreadId]);

  // Retrieve active subtotal
  const subtotal = activeCart.reduce((sum, item) => {
    const price = item.selectedVariant?.price || item.product.price;
    return sum + (price * item.quantity);
  }, 0);

  // Format price helper
  const formatPrice = (p: number) => {
    return p.toLocaleString('en-US');
  };

  // Mini-chat response flow matching existing MessagesPage triggers
  const handleMiniSend = () => {
    if (!chatInput.trim() || !activeThreadId) return;

    // Send user msg
    addThreadMessage(activeThreadId, chatInput.trim(), 'user', 'Me');
    const userMsg = chatInput.trim();
    setChatInput('');

    // Simulated reply
    setTimeout(() => {
      const activeThreadObj = threads.find(t => t.id === activeThreadId);
      let responseText = `Thank you for your message! Our representative logged your query. We will update you shortly on this request.`;
      
      const lower = userMsg.toLowerCase();
      if (lower.includes('deliver') || lower.includes('shipping') || lower.includes('when')) {
        responseText = `Regarding dispatch, your order is packaging. We secure all catalog orders instantly after confirmation.`;
      } else if (lower.includes('discount') || lower.includes('price') || lower.includes('cost')) {
        responseText = `Our wholesale rates are highly competitive. Slabs are applied automatically in global checkouts!`;
      } else if (lower.includes('size') || lower.includes('color') || lower.includes('variant')) {
        responseText = `Logged and noted! We package order lots exactly as staged in the inventory parameters.`;
      } else if (lower.includes('confirm') || lower.includes('approved')) {
        responseText = `Perfect! Your confirmation log is resolved inside our supply ecosystem. Thank you for choosing Choosify!`;
      }

      addThreadMessage(activeThreadId, responseText, 'seller', activeThreadObj?.title || 'Partner Support');
    }, 1500);
  };

  // Active message stream for selected thread
  const activeMessages = threadMessages.filter(m => m.threadId === activeThreadId);
  const activeThreadObj = threads.find(t => t.id === activeThreadId);

  return (
    <div className="fixed bottom-28 md:bottom-10 right-6 z-[95] flex flex-col gap-4 text-[#1A1D4E] font-sans antialiased">
      
      {/* PERSISTENT FLOATING PANEL POPUPS */}
      <AnimatePresence>
        
        {/* PANEL 1: MINI FLOATING CART */}
        {activePanel === 'cart' && (
          <motion.div 
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.95 }}
            transition={{ type: "spring", damping: 25, stiffness: 350 }}
            className="absolute bottom-20 right-0 w-[calc(100vw-48px)] sm:w-[380px] bg-[#0A0B1E]/95 backdrop-blur-xl border border-white/10 rounded-[32px] overflow-hidden shadow-[0_25px_60px_rgba(0,0,0,0.8)] z-50 text-white flex flex-col max-h-[80vh]"
            id="floating-mini-cart-drawer"
          >
            {/* Header */}
            <div className="p-6 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-full bg-orange-primary/10 flex items-center justify-center text-orange-primary">
                  <ShoppingCart size={16} />
                </div>
                <div>
                  <div className="text-[10px] uppercase tracking-widest text-[#E8500A] font-extrabold">Instant Checklist</div>
                  <h3 className="text-sm font-black uppercase italic tracking-wider">My Quick Cart</h3>
                </div>
              </div>
              <button 
                onClick={() => setActivePanel(null)}
                className="w-8 h-8 rounded-full hover:bg-white/10 flex items-center justify-center text-gray-400 hover:text-white transition-all"
              >
                <X size={16} />
              </button>
            </div>

            {/* List Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4 max-h-[350px] no-scrollbar">
              {activeCart.length === 0 ? (
                <div className="py-12 text-center text-gray-500 flex flex-col items-center justify-center gap-3">
                  <div className="w-12 h-12 rounded-full border border-white/5 bg-white/[0.01] flex items-center justify-center text-gray-600">
                    <ShoppingBag size={20} />
                  </div>
                  <p className="text-[11px] font-black uppercase tracking-wider">Your transaction cart is empty</p>
                  <p className="text-[9px] lowercase italic text-gray-600 max-w-[200px] leading-relaxed">
                    discover top Bangladesh products and click add with custom volume metrics
                  </p>
                </div>
              ) : (
                activeCart.map((item) => {
                  const itemPrice = item.selectedVariant?.price || item.product.price;
                  const itemImage = item.selectedVariant?.image || item.product.image || PLACEHOLDER_IMAGE;
                  const itemTitle = item.product.title;
                  const redirectPath = mode === 'retail' ? `/products/${item.product.id}` : `/b2b/product/${item.product.id}`;

                  return (
                    <div key={item.id} className="flex gap-4 items-center bg-white/[0.02] border border-white/5 hover:border-white/10 p-3.5 rounded-2xl transition-all group">
                      <Link 
                        to={redirectPath} 
                        onClick={() => setActivePanel(null)}
                        className="w-14 h-14 rounded-xl overflow-hidden bg-white/5 border border-white/10 shrink-0 relative flex items-center justify-center"
                      >
                        <img src={itemImage} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" referrerPolicy="no-referrer" />
                      </Link>
                      <div className="flex-1 min-w-0">
                        <Link 
                          to={redirectPath}
                          onClick={() => setActivePanel(null)}
                          className="text-[11px] font-bold text-white uppercase italic truncate block hover:text-orange-primary transition-colors mb-0.5"
                        >
                          {itemTitle}
                        </Link>
                        {item.selectedVariant?.attributes && (
                          <div className="text-[9px] text-[#A0A5C0] flex gap-2 mb-1">
                            {Object.entries(item.selectedVariant.attributes).map(([key, val]: any) => (
                              <span key={key} className="bg-white/5 px-1.5 py-0.5 rounded text-[8px] uppercase">{key}: {val}</span>
                            ))}
                          </div>
                        )}
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] font-mono font-black text-orange-primary">
                            ৳{formatPrice(itemPrice)}
                          </span>
                          
                          {/* Compact Qty Stepper */}
                          <div className="flex items-center gap-2 bg-black/20 px-2 py-0.5 rounded-lg border border-white/5">
                            <button 
                              onClick={() => item.quantity > 1 && updateCartQuantity(item.id, item.quantity - 1)}
                              className="text-[10px] text-gray-400 hover:text-white px-1"
                            >
                              -
                            </button>
                            <span className="text-[9px] font-bold font-mono px-0.5">{item.quantity}</span>
                            <button 
                              onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                              className="text-[10px] text-gray-400 hover:text-white px-1"
                            >
                              +
                            </button>
                          </div>
                        </div>
                      </div>
                      
                      {/* Delete */}
                      <button 
                        onClick={() => removeFromCart(item.id)}
                        className="p-2 rounded-xl text-gray-500 hover:text-red-400 hover:bg-white/[0.04] transition-all shrink-0"
                        title="Remove product"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  );
                })
              )}
            </div>

            {/* Bottom Actions if cart is populated */}
            {activeCart.length > 0 && (
              <div className="p-6 border-t border-white/5 bg-white/[0.01] space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase tracking-widest text-[#A0A5C0]">Estimated Subtotal</span>
                  <span className="text-lg font-mono font-black text-white">৳{formatPrice(subtotal)}</span>
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <button 
                    onClick={() => {
                      setActivePanel(null);
                      navigate(mode === 'retail' ? '/cart/retail' : '/cart/b2b');
                    }}
                    className="py-3 px-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl text-[10px] font-bold uppercase tracking-widest text-white transition-all text-center flex items-center justify-center gap-1"
                  >
                    View Full Cart
                  </button>
                  <button 
                    onClick={() => {
                      setActivePanel(null);
                      navigate('/checkout');
                    }}
                    className="py-3 px-4 bg-orange-primary hover:bg-[#FF5B00] rounded-2xl text-[10px] font-bold uppercase tracking-widest text-white transition-all text-center flex items-center justify-center gap-1 shadow-[0_4px_20px_rgba(249,101,0,0.3)] font-black italic"
                  >
                    Checkout <ChevronRight size={12} />
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        )}

        {/* PANEL 2: MINI MESSENGER POPUP */}
        {activePanel === 'inbox' && (
          <motion.div 
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.95 }}
            transition={{ type: "spring", damping: 25, stiffness: 350 }}
            className="absolute bottom-20 right-0 w-[calc(100vw-48px)] sm:w-[380px] bg-[#0A0B1E]/95 backdrop-blur-xl border border-white/10 rounded-[32px] overflow-hidden shadow-[0_25px_60px_rgba(0,0,0,0.8)] z-50 text-white flex flex-col max-h-[85vh]"
            id="floating-mini-messenger"
          >
            {/* INBOX THREADS LISTING OR ACTIVES FEED */}
            {!activeThreadId ? (
              <>
                {/* Threads Header */}
                <div className="p-6 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-full bg-[#1877F2]/10 flex items-center justify-center text-[#1877F2]">
                      <MessageSquare size={16} />
                    </div>
                    <div>
                      <div className="text-[10px] uppercase tracking-widest text-[#1B74E4] font-extrabold">Instant Feed</div>
                      <h3 className="text-sm font-black uppercase italic tracking-wider">Merchant Chats</h3>
                    </div>
                  </div>
                  <button 
                    onClick={() => setActivePanel(null)}
                    className="w-8 h-8 rounded-full hover:bg-white/10 flex items-center justify-center text-gray-400 hover:text-white transition-all"
                  >
                    <X size={16} />
                  </button>
                </div>

                {/* Threads list */}
                <div className="flex-1 overflow-y-auto p-4 space-y-2 max-h-[350px] no-scrollbar">
                  <span className="text-[8px] font-black text-gray-400 uppercase tracking-[0.2em] px-2 block mb-2">My Live Stream Connections</span>
                  {threads.length === 0 ? (
                    <div className="py-12 text-center text-gray-500">No active chat networks available</div>
                  ) : (
                    threads.map((t) => (
                      <button
                        key={t.id}
                        onClick={() => setActiveThreadId(t.id)}
                        className="w-full text-left p-3.5 rounded-2xl border border-white/5 hover:border-white/10 bg-white/[0.01] hover:bg-white/[0.03] flex gap-3.5 items-center transition-all relative group"
                      >
                        <div className="relative shrink-0">
                          <img src={t.avatar} className="w-10 h-10 rounded-full object-cover border border-white/10" alt="" />
                          <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border border-[#0A0B1E] rounded-full animate-pulse" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-0.5">
                            <span className="text-[10px] font-black text-white hover:text-orange-primary transition-colors uppercase italic truncate pr-2">
                              {t.title}
                            </span>
                            <span className="text-[8px] text-gray-600 font-medium shrink-0">{t.time}</span>
                          </div>
                          <p className="text-[9px] text-[#A0A5C0] line-clamp-1 italic">{t.lastMessage}</p>
                          {t.orderRef && (
                            <span className="inline-flex mt-1 text-[7.5px] font-black border border-white/5 bg-white/5 px-1.5 py-0.2 rounded text-orange-primary">
                              ORDER: {t.orderRef}
                            </span>
                          )}
                        </div>

                        {/* Unread dot indicator */}
                        {t.unread && (
                          <span className="w-2.5 h-2.5 rounded-full bg-orange-primary shrink-0 animate-bounce" />
                        )}
                      </button>
                    ))
                  )}
                </div>

                {/* Inbox Footer Actions */}
                <div className="p-4 border-t border-white/5 bg-white/[0.01]">
                  <button 
                    onClick={() => {
                      setActivePanel(null);
                      navigate('/messages');
                    }}
                    className="w-full py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest text-center flex items-center justify-center gap-1.5 hover:text-orange-primary transition-colors"
                  >
                    See All Messages <ExternalLink size={10} />
                  </button>
                </div>
              </>
            ) : (
              
              /* NESTED CHAT VIEWPORT LAYER */
              <>
                {/* Active Thread chat header */}
                <div className="p-5 border-b border-white/5 flex items-center justify-between bg-white/[0.03] shrink-0">
                  <div className="flex items-center gap-3">
                    <button 
                      onClick={() => setActiveThreadId(null)}
                      className="text-xs text-gray-400 hover:text-white flex items-center gap-1 mr-1.5 focus:outline-none"
                    >
                      ←
                    </button>
                    <img src={activeThreadObj?.avatar} className="w-9 h-9 rounded-full object-cover border border-white/10" alt="" />
                    <div>
                      <h4 className="text-[11px] font-black text-white uppercase italic leading-none truncate max-w-[140px]">{activeThreadObj?.title}</h4>
                      <span className="text-[8px] text-green-400 font-extrabold uppercase flex items-center gap-1 mt-0.5">
                        <span className="w-1 h-1 rounded-full bg-green-400 animate-pulse" /> Live Stream
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-1.5">
                    <button 
                      onClick={() => {
                        setActivePanel(null);
                        navigate(`/messages/${activeThreadId}`);
                      }}
                      className="p-1.5 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition-all text-[8px] font-bold uppercase tracking-wider flex items-center gap-1"
                      title="Expand to Fullscreen"
                    >
                      <ExternalLink size={11} />
                    </button>
                    <button 
                      onClick={() => setActivePanel(null)}
                      className="w-7 h-7 rounded-full hover:bg-white/10 flex items-center justify-center text-gray-400 hover:text-white"
                    >
                      <X size={14} />
                    </button>
                  </div>
                </div>

                {/* Live Thread Chat stream container */}
                <div className="flex-1 overflow-y-auto p-4 space-y-3 max-h-[300px] min-h-[250px] bg-[#070817] no-scrollbar">
                  
                  {/* Miniature Transaction details overlay */}
                  {activeThreadObj?.orderRef && (
                    <div className="bg-white/[0.02] border border-white/5 rounded-xl p-3 text-[9px] mb-3 relative overflow-hidden flex items-center justify-between gap-2.5">
                      <div>
                        <div className="font-extrabold uppercase text-orange-primary tracking-widest text-[8px] mb-0.5">Linked transaction</div>
                        <span className="font-mono text-white text-[9.5px]">{activeThreadObj.orderRef}</span>
                      </div>
                      <span className="text-[7.5px] font-black uppercase text-green-400 bg-green-500/10 px-1.5 py-0.5 rounded border border-green-500/10 flex items-center gap-1">
                        <CheckCircle size={9} /> SECURED
                      </span>
                    </div>
                  )}

                  {/* Messages loop */}
                  {activeMessages.map((msg) => {
                    const isUser = msg.sender === 'user';
                    return (
                      <div key={msg.id} className={`flex gap-2.5 items-end max-w-[85%] ${isUser ? 'ml-auto flex-row-reverse text-right' : 'mr-auto text-left'}`}>
                        {!isUser && (
                          <img src={activeThreadObj?.avatar} className="w-6 h-6 rounded-full object-cover opacity-80 border border-white/10" alt="" />
                        )}
                        <div>
                          <div className={`p-3 text-[10.5px] rounded-2xl ${
                            isUser 
                              ? 'bg-orange-primary text-white rounded-br-none shadow-[0_4px_12px_rgba(249,101,0,0.2)]' 
                              : 'bg-white/[0.06] border border-white/5 text-gray-100 rounded-bl-none'
                          }`}>
                            <p className="leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                          </div>
                          <span className="text-[7px] text-gray-600 block mt-1 px-1 font-mono">{msg.time}</span>
                        </div>
                      </div>
                    );
                  })}
                  <div ref={miniChatBottomRef} />
                </div>

                {/* Live input controls */}
                <div className="p-3 border-t border-white/5 bg-white/[0.02] shrink-0 flex gap-2">
                  <input
                    onChange={(e) => setChatInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleMiniSend()}
                    value={chatInput}
                    className="flex-1 bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-[11px] focus:outline-none focus:border-orange-primary placeholder:text-gray-600 text-white"
                    placeholder="Type transaction message..."
                  />
                  <button 
                    onClick={handleMiniSend}
                    className="w-8 h-8 rounded-xl bg-orange-primary hover:bg-[#FF5B00] text-white flex items-center justify-center shrink-0 transition-all hover:scale-105 active:scale-95"
                    aria-label="Send message"
                  >
                    <Send size={12} className="relative left-[-0.5px]" />
                  </button>
                </div>
              </>
            )}
          </motion.div>
        )}

      </AnimatePresence>

      {/* FLOATING ACTION ICON TRIGGER DOCK */}
      <div className="flex md:flex-col items-center gap-3.5">
        
        {/* BUTTON 1: FLOATING MESSAGING INBOX TRIGGER */}
        <motion.button
          onClick={() => setActivePanel(activePanel === 'inbox' ? null : 'inbox')}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.94 }}
          className={`w-14 h-14 rounded-full flex items-center justify-center relative shadow-[0_8px_30px_rgba(0,0,0,0.5)] border transition-all duration-300
            ${activePanel === 'inbox' 
              ? 'bg-[#1877F2] border-[#2C85F3] text-white shadow-[#1877F2]/30' 
              : 'bg-[#0A0B1E]/90 hover:bg-[#0F112D] border-white/10 hover:border-white/20 text-white'
            }`}
          title="Merchant Support Line"
        >
          <MessageSquare size={22} />
          
          {/* Badge indicator count inside floating trigger */}
          {unreadCount > 0 && (
            <motion.span 
              animate={inboxBadgeBounce ? { scale: [1, 1.4, 0.9, 1.2, 1] } : { scale: 1 }}
              transition={{ duration: 0.6 }}
              className="absolute -top-1 -right-1 bg-red-500 text-white font-mono text-[9px] font-black w-5 h-5 rounded-full flex items-center justify-center border-2 border-[#0A0B1E] animate-pulse shadow-md"
            >
              {unreadCount}
            </motion.span>
          )}
        </motion.button>

        {/* BUTTON 2: FLOATING CART TRIGGER */}
        <motion.button
          onClick={() => setActivePanel(activePanel === 'cart' ? null : 'cart')}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.94 }}
          className={`w-14 h-14 rounded-full flex items-center justify-center relative shadow-[0_8px_30px_rgba(0,0,0,0.5)] border transition-all duration-300
            ${activePanel === 'cart' 
              ? 'bg-orange-primary border-[#FF7020] text-white shadow-orange-primary/30' 
              : 'bg-[#0A0B1E]/90 hover:bg-[#0F112D] border-white/10 hover:border-white/20 text-white'
            }`}
          title="Shopping Cart Checklist"
        >
          <ShoppingCart size={22} />
          
          {/* Badge index sum */}
          {totalCartItems > 0 && (
            <motion.span 
              animate={cartBadgeBounce ? { scale: [1, 1.4, 0.9, 1.2, 1] } : { scale: 1 }}
              transition={{ duration: 0.6 }}
              className="absolute -top-1 -right-1 bg-orange-primary text-white font-mono text-[9px] font-black w-5 h-5 rounded-full flex items-center justify-center border-2 border-[#0A0B1E] shadow-md"
            >
              {totalCartItems}
            </motion.span>
          )}
        </motion.button>

      </div>

    </div>
  );
}
