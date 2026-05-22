import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useDashboard, ThreadMessage, MessageThread } from '../context/DashboardContext';
import { useGlobalState } from '../context/GlobalStateContext';
import { PRODUCTS, PLACEHOLDER_IMAGE } from '../constants';
import { 
  Search, ArrowLeft, Send, Bell, MoreVertical, ShieldAlert, CheckCircle, 
  Package, Truck, Clock, MessageSquare, ExternalLink, Settings, LayoutDashboard, Heart 
} from 'lucide-react';
import toast from 'react-hot-toast';

export function MessagesPage() {
  const { threadId } = useParams<{ threadId?: string }>();
  const navigate = useNavigate();
  const { threads, threadMessages, addThreadMessage, createNewThread } = useDashboard();
  const { orders } = useGlobalState();
  const [inputText, setInputText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Active thread selection
  const activeThreadId = threadId || (threads.length > 0 ? threads[0].id : null);
  const activeThread = threads.find(t => t.id === activeThreadId);

  // Filter threads by search query
  const filteredThreads = threads.filter(t => 
    t.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    t.lastMessage.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.orderRef?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Filter messages for active thread
  const activeMessages = threadMessages.filter(m => m.threadId === activeThreadId);

  // Ref to automatically scroll chat to bottom
  const chatBottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatBottomRef.current) {
      chatBottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [activeMessages]);

  // Find linked order for active thread
  const linkedOrder = orders.find(o => o.orderId === activeThread?.orderRef);
  
  // Find specific sub-order for active thread seller
  const linkedSubOrder = linkedOrder?.subOrders.find(sub => {
    // Check if thread ID contains seller ID
    const sellerId = activeThreadId?.replace('thread-', '');
    return sub.sellerId === sellerId;
  }) || linkedOrder?.subOrders[0];

  // Helper function to find a product image or fallback
  const getProductImageByTitle = (title: string) => {
    const p = PRODUCTS.find(prod => prod.title === title);
    return p?.image || PLACEHOLDER_IMAGE;
  };

  const handleSendMessage = () => {
    if (!inputText.trim() || !activeThreadId) return;

    // Send customer message
    addThreadMessage(activeThreadId, inputText.trim(), 'user', 'Me');
    const userMsg = inputText.trim();
    setInputText('');

    // Simulated merchant response delay to show active engagement
    setTimeout(() => {
      let responseText = `Thank you for your message. Our sales representative has received your ping about order reference ${activeThread?.orderRef || 'general inquiry'}. We will review this and respond shortly!`;
      
      const lower = userMsg.toLowerCase();
      if (lower.includes('deliver') || lower.includes('shipping') || lower.includes('when')) {
        responseText = `Regarding dispatch, order ${activeThread?.orderRef || ''} current logistics status is [${(linkedSubOrder?.trackingStatus || 'Pending confirmation').toUpperCase()}]. We pack all items under safe cargo metrics immediately after confirmation!`;
      } else if (lower.includes('discount') || lower.includes('price') || lower.includes('cost')) {
        responseText = `Our listed wholesale rates are strictly computed with slabs. We guarantee the absolute best deals in Bangladesh!`;
      } else if (lower.includes('size') || lower.includes('color') || lower.includes('variant')) {
        responseText = `Yes, your preferred parameters have been logged against Invoice [${linkedSubOrder?.invoiceId || 'N/A'}]. We will package exactly as staged!`;
      } else if (lower.includes('confirm') || lower.includes('approved')) {
        responseText = `Perfect! Your order logs have been successfully synced inside our supply terminal. Thank you for placing your secure trust in Choosify.bd!`;
      }

      addThreadMessage(activeThreadId, responseText, 'seller', activeThread?.title || 'Merchant Partner');
      toast.success('New reply received from factory representative!');
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#0A0A1F] text-white flex flex-col">
      {/* Messages Header bar */}
      <div className="w-full border-b border-white/5 bg-[#050514]/90 sticky top-0 z-40 backdrop-blur px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button 
            type="button" 
            onClick={() => navigate('/dashboard')} 
            className="w-9 h-9 rounded-full bg-white/5 flex items-center justify-center text-white/70 hover:text-white transition-colors"
          >
            <ArrowLeft size={16} />
          </button>
          <div>
            <span className="text-[9px] font-black text-[#F96500] uppercase tracking-[0.25em] block leading-none mb-1">Customer Support Center</span>
            <h1 className="text-xl font-black uppercase italic tracking-tighter leading-none flex items-center gap-2">
              <MessageSquare size={16} className="text-[#F96500]" /> Real-time Support <span className="text-gray-500 font-serif lowercase font-normal">Inbox</span>
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link 
            to="/dashboard"
            state={{ activeTab: 'overview' }}
            className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-[10px] font-bold text-white uppercase tracking-widest transition-all italic flex items-center gap-1"
          >
            <LayoutDashboard size={12} className="text-orange-primary" />
            My Dashboard
          </Link>
          <Link 
            to="/profile/orders"
            className="px-4 py-2 bg-orange-primary hover:bg-[#FF5B00] rounded-xl text-[10px] font-bold text-white uppercase tracking-widest transition-all italic flex items-center gap-1"
          >
            <Package size={12} />
            My Orders
          </Link>
        </div>
      </div>

      {/* Main container */}
      <div className="flex flex-1 overflow-hidden h-[calc(100vh-130px)]">
        {/* Sidebar: list of chat threads */}
        <aside className="w-full md:w-[320px] lg:w-[380px] bg-[#050514]/50 border-r border-white/5 flex flex-col shrink-0">
          <div className="p-6 border-b border-white/5 space-y-4">
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block italic">ACTIVE TRANSMISSION CHANNELS</span>
            <div className="relative">
              <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input 
                onChange={(e) => setSearchQuery(e.target.value)}
                value={searchQuery}
                className="w-full h-11 pl-11 pr-4 bg-white/5 border border-white/10 rounded-xl text-xs font-bold text-white placeholder:text-gray-500 focus:outline-none focus:border-[#F96500]/45" 
                placeholder="Search transactions / order references..." 
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto divide-y divide-white/5 no-scrollbar">
            {filteredThreads.length === 0 ? (
              <div className="p-8 text-center text-gray-500 text-[11px] font-bold uppercase tracking-wider">
                No messaging threads resolved
              </div>
            ) : (
              filteredThreads.map(t => {
                const isActive = t.id === activeThreadId;
                return (
                  <button
                    key={t.id}
                    onClick={() => navigate(`/messages/${t.id}`)}
                    className={`w-full p-6 flex gap-4 text-left transition-all hover:bg-white/5 relative ${isActive ? 'bg-white/5' : ''}`}
                  >
                    {isActive && <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#F96500]" />}
                    <div className="relative shrink-0">
                      <img src={t.avatar} className="w-12 h-12 rounded-full object-cover border border-white/10" alt="" />
                      <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-[#050514] rounded-full" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-black text-white uppercase italic truncate pr-2">{t.title}</span>
                        <span className="text-[8px] font-bold text-gray-500 tracking-wider shrink-0">{t.time}</span>
                      </div>
                      <p className="text-[10px] text-gray-400 line-clamp-1 italic mb-1">{t.lastMessage}</p>
                      {t.orderRef && (
                        <span className="inline-flex text-[8px] font-black bg-white/5 border border-white/10 text-orange-primary px-1.5 py-0.5 rounded uppercase tracking-wider">
                          ORDER: {t.orderRef}
                        </span>
                      )}
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </aside>

        {/* Messaging / Conversation content viewport */}
        <main className="flex-1 flex flex-col bg-[#08081A]">
          {activeThread ? (
            <>
              {/* Header inside open thread Chat */}
              <div className="p-6 border-b border-white/5 bg-[#050514]/40 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <img src={activeThread.avatar} className="w-11 h-11 rounded-full object-cover border border-white/10" alt="" />
                  <div>
                    <h2 className="text-sm font-black text-white italic uppercase tracking-wider leading-none mb-1">{activeThread.title}</h2>
                    <div className="flex items-center gap-2">
                      <span className="text-[9px] font-bold text-green-400 uppercase italic font-black flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"></span>
                        Active Stream
                      </span>
                      {activeThread.orderRef && (
                        <span className="text-[8px] font-black bg-[#F96500]/10 border border-[#F96500]/30 text-orange-primary px-2 py-0.5 rounded-md uppercase tracking-wider">
                          {activeThread.orderRef}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button className="w-9 h-9 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:text-white transition-colors" title="Notifications">
                    <Bell size={14} />
                  </button>
                  <button className="w-9 h-9 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:text-white transition-colors" title="Thread Options">
                    <MoreVertical size={14} />
                  </button>
                </div>
              </div>

              {/* Chat Viewport Area with support for linked order cards inside the stream */}
              <div className="flex-1 p-6 md:p-8 overflow-y-auto space-y-6 no-scrollbar relative">
                {/* 🚨 ORDER OVERVIEW CARD INSIDE CHAT (CRITICAL REQUIREMENT) */}
                {linkedSubOrder && (
                  <div className="max-w-2xl mx-auto bg-[#050514] border border-white/5 hover:border-white/10 rounded-3xl p-6 shadow-2xl relative overflow-hidden transition-all duration-300">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-[#F96500]/5 rounded-full blur-2xl" />
                    
                    {/* Upper layout: badge indicators */}
                    <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/5 pb-4 mb-4">
                      <div className="flex items-center gap-2">
                        <span className="text-[8.5px] font-black bg-orange-primary text-white px-2 py-0.5 rounded-md italic tracking-wider">
                          LINKED LOT TRANSACTION
                        </span>
                        <span className="text-[8.5px] font-mono text-gray-400">
                          {linkedSubOrder.invoiceId}
                        </span>
                      </div>
                      
                      {/* Tracking state badges matching original design colors */}
                      <span className={`text-[9px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded italic border flex items-center gap-1.5
                        ${linkedSubOrder.trackingStatus === 'pending' ? 'bg-[#FF9F00]/10 border-[#FF9F00]/30 text-[#FF9F00]' : ''}
                        ${linkedSubOrder.trackingStatus === 'dispatched' ? 'bg-[#3867ff]/10 border-[#3867ff]/30 text-[#3867ff]' : ''}
                        ${linkedSubOrder.trackingStatus === 'transit' ? 'bg-purple-500/10 border-purple-500/30 text-purple-400' : ''}
                        ${linkedSubOrder.trackingStatus === 'delivered' ? 'bg-[#07DD05]/10 border-[#07DD05]/30 text-[#07DD05]' : ''}
                      `}>
                        {linkedSubOrder.trackingStatus === 'pending' && <Clock size={11} />}
                        {linkedSubOrder.trackingStatus === 'dispatched' && <Package size={11} />}
                        {linkedSubOrder.trackingStatus === 'transit' && <Truck size={11} />}
                        {linkedSubOrder.trackingStatus === 'delivered' && <CheckCircle size={11} />}
                        {linkedSubOrder.trackingStatus.toUpperCase()}
                      </span>
                    </div>

                    {/* Middle layer: Product details */}
                    <div className="space-y-4">
                      {linkedSubOrder.items.map((item: any, iIdx: number) => (
                        <div key={iIdx} className="flex gap-4 items-start">
                          <img 
                            src={getProductImageByTitle(item.productTitle)}
                            className="w-16 h-16 rounded-2xl object-cover shrink-0 border border-white/10 bg-white"
                            alt=""
                          />
                          <div className="flex-1 min-w-0">
                            <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest block mb-1">
                              {activeThread.title}
                            </span>
                            <h4 className="text-xs font-black text-white uppercase italic leading-tight mb-1 line-clamp-1">
                              {item.productTitle}
                            </h4>
                            <div className="flex items-center gap-3 text-[10px] text-gray-500 font-bold">
                              <span>Quantity: <b className="text-white">{(item.quantity ?? 1)} units</b></span>
                              <span>•</span>
                              <span>Unit Net: <b className="text-orange-primary">৳{(item.price ?? 0).toLocaleString()}</b></span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Bottom layer: tracking status bar indicators */}
                    <div className="mt-6 pt-4 border-t border-white/5 grid grid-cols-4 gap-2 text-center text-gray-500">
                      {['pending', 'dispatched', 'transit', 'delivered'].map((step, sIdx, arr) => {
                        const statusWeights: Record<string, number> = { pending: 1, dispatched: 2, transit: 3, delivered: 4 };
                        const isActive = statusWeights[linkedSubOrder.trackingStatus] >= statusWeights[step];
                        return (
                          <div key={step} className="space-y-2">
                            <div className={`h-1 rounded-full transition-all duration-500 ${isActive ? 'bg-[#F96500]' : 'bg-white/5'}`} />
                            <span className={`text-[8px] font-black uppercase tracking-wider block ${isActive ? 'text-white' : 'text-gray-600'}`}>
                              {step}
                            </span>
                          </div>
                        );
                      })}
                    </div>

                    {/* Order action parameters */}
                    <div className="mt-6 flex flex-wrap gap-4 items-center justify-between">
                      <div className="text-[10px]">
                        <span className="text-gray-500 block">Lot Total (With Freight):</span>
                        <span className="font-black text-white text-sm">
                          ৳{(linkedSubOrder.items.reduce((acc: number, x: any) => acc + ((x.price ?? 0) * (x.quantity ?? 0)), 0) + (linkedSubOrder.deliveryFee ?? 0)).toLocaleString()}
                        </span>
                      </div>
                      <button
                        onClick={() => navigate('/order-tracking', { state: { order: linkedOrder } })}
                        className="px-5 py-2.5 bg-white/5 hover:bg-orange-primary hover:text-white border border-white/10 rounded-xl text-[9px] font-black text-gray-300 uppercase tracking-widest transition-all italic flex items-center gap-2"
                      >
                        <Truck size={12} />
                        View Live Tracking Timeline
                      </button>
                    </div>
                  </div>
                )}

                {/* Messages Listing thread */}
                <div className="space-y-6">
                  {activeMessages.map((m) => {
                    const isUser = m.sender === 'user';
                    return (
                      <div 
                        key={m.id} 
                        className={`flex flex-col max-w-[85%] sm:max-w-[70%] ${isUser ? 'ml-auto items-end animate-in slide-in-from-right-4 duration-300' : 'mr-auto items-start animate-in slide-in-from-left-4 duration-300'}`}
                      >
                        <div className={`px-5 py-3 md:px-6 md:py-4 rounded-[20px] mb-2 text-[11px] md:text-sm font-bold leading-relaxed shadow-xl
                          ${isUser 
                            ? 'bg-[#F96500] text-white rounded-tr-none italic' 
                            : 'bg-white/5 text-gray-300 rounded-tl-none border border-white/10'
                          }
                        `}>
                          {m.text}
                        </div>
                        <span className="text-[8.5px] font-black text-gray-500 uppercase tracking-widest px-2 italic">
                          {m.senderName} • {m.time}
                        </span>
                      </div>
                    );
                  })}
                  <div ref={chatBottomRef} />
                </div>
              </div>

              {/* Chat Send Input Box footer */}
              <div className="p-6 md:p-8 bg-[#050514]/80 border-t border-white/5">
                <div className="relative max-w-4xl mx-auto">
                  <input 
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    className="w-full h-14 bg-white/5 border border-white/10 rounded-2xl pl-6 pr-16 text-xs font-bold text-white placeholder:text-gray-500 focus:outline-none focus:border-[#F96500]/50 transition-all" 
                    placeholder="Type message to seller/factory logistics coordinator..." 
                  />
                  <button 
                    onClick={handleSendMessage}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-xl bg-orange-primary text-white flex items-center justify-center hover:bg-[#FF5B00] transition-colors shadow-lg active:scale-95"
                    title="Send Ticket Message"
                  >
                    <Send size={14} />
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-12 text-center max-w-lg mx-auto space-y-4">
              <div className="w-20 h-20 bg-white/5 rounded-full border border-white/10 flex items-center justify-center text-white/20 mb-4 scale-110">
                <MessageSquare size={32} />
              </div>
              <h3 className="text-lg font-black uppercase text-white italic tracking-tight">No dialogue stream active</h3>
              <p className="text-[10px] text-gray-400 uppercase tracking-widest leading-relaxed font-bold">
                Select a supplier transaction node from the workspace pipeline lists to monitor communication, discuss parameters, or track logistics.
              </p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
