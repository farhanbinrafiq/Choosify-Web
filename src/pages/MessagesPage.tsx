import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useDashboard, ThreadMessage, MessageThread } from '../context/DashboardContext';
import { useGlobalState } from '../context/GlobalStateContext';
import { PRODUCTS, PLACEHOLDER_IMAGE } from '../constants';
import { 
  Search, ArrowLeft, Send, Bell, MoreVertical, ShieldAlert, CheckCircle, 
  Package, Truck, Clock, MessageSquare, ExternalLink, Settings, LayoutDashboard, Heart, CheckSquare,
  X, MessageCircle, CheckCircle2, Info, Sparkles, Plus
} from 'lucide-react';
import toast from 'react-hot-toast';
import { operationsApi } from '../services/operationsApi';

export function MessagesPage() {
  const { threadId } = useParams<{ threadId?: string }>();
  const navigate = useNavigate();
  const { threads, threadMessages, addThreadMessage, createNewThread, markAllAsRead, setThreads, setThreadMessages } = useDashboard();
  const { orders } = useGlobalState();
  const [inputText, setInputText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Interactive Modal states
  const [showSourcingModal, setShowSourcingModal] = useState(false);
  
  // Sourcing Modal field states
  const [modalProdIdx, setModalProdIdx] = useState(0);
  const [modalColor, setModalColor] = useState('Sunset Orange');
  const [modalVariant, setModalVariant] = useState('Standard Retail Unit');
  const [modalQuantity, setModalQuantity] = useState(5);
  const [modalNotes, setModalNotes] = useState('');

  // Active thread selection
  const activeThreadId = threadId || (threads.length > 0 ? threads[0].id : null);
  const activeThread = threads.find(t => t.id === activeThreadId);

  // Auto-mark active thread as read
  useEffect(() => {
    if (activeThreadId) {
      const active = threads.find(t => t.id === activeThreadId);
      if (active && active.unread) {
        setThreads(prev => prev.map(t => t.id === activeThreadId ? { ...t, unread: false } : t));
      }
    }
  }, [activeThreadId, threads, setThreads]);

  // Filter threads by search query
  const filteredThreads = threads.filter(t => 
    t.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    t.lastMessage.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.orderRef?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Filter messages for active thread
  const activeMessages = threadMessages.filter(m => m.threadId === activeThreadId);

  // Ref to scroll only the chat viewport (not the whole page)
  const chatViewportRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, [threadId]);

  useEffect(() => {
    const viewport = chatViewportRef.current;
    if (!viewport) return;
    viewport.scrollTop = viewport.scrollHeight;
  }, [activeMessages, activeThreadId]);

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

  // Helper function to update dynamic product card state inside message history
  const updateProductCard = (messageId: number, updates: Partial<any>) => {
    setThreadMessages(prev => {
      const updated = prev.map(msg => {
        if (msg.id === messageId && msg.productCard) {
          return {
            ...msg,
            productCard: {
              ...msg.productCard,
              ...updates
            }
          };
        }
        return msg;
      });
      localStorage.setItem('choosify_thread_messages', JSON.stringify(updated));
      return updated;
    });
  };

  const handleSendMessage = () => {
    if (!inputText.trim() || !activeThreadId) return;

    addThreadMessage(activeThreadId, inputText.trim(), 'user', 'Me');
    const userMsg = inputText.trim();
    setInputText('');

    operationsApi
      .submitPlatformMessage({
        buyerId: 'user-standard',
        userName: 'Me',
        body: userMsg,
        orderId: activeThread?.orderRef,
      })
      .catch(() => {});

    setTimeout(() => {
      let responseText = `Thank you for your message. Our sales representative has received your ping about order reference ${activeThread?.orderRef || 'general inquiry'}. We will review this and respond shortly!`;
      
      const lower = userMsg.toLowerCase();
      if (lower.includes('deliver') || lower.includes('shipping') || lower.includes('when')) {
        responseText = `Regarding dispatch, order ${activeThread?.orderRef || ''} current logistics status is [${(linkedSubOrder?.trackingStatus || 'Pending confirmation').toUpperCase()}]. We pack all items under safe cargo metrics immediately after confirmation!`;
      } else if (lower.includes('discount') || lower.includes('price') || lower.includes('cost')) {
        responseText = `Our listed retail prices reflect current verified brand offers. We help you compare the best deals in Bangladesh!`;
      } else if (lower.includes('size') || lower.includes('color') || lower.includes('variant')) {
        responseText = `Yes, your preferred parameters have been logged against Invoice [${linkedSubOrder?.invoiceId || 'N/A'}]. We will package exactly as staged!`;
      } else if (lower.includes('confirm') || lower.includes('approved')) {
        responseText = `Perfect! Your order logs have been successfully synced inside our supply terminal. Thank you for placing your secure trust in Choosify.bd!`;
      }

      addThreadMessage(activeThreadId, responseText, 'seller', activeThread?.title || 'Merchant Partner');
      toast.success('New reply received from factory representative!');
    }, 1500);
  };

  const handleCreateSourcingRequest = () => {
    const selectedProd = PRODUCTS[modalProdIdx];
    const unitPriceNum = parseFloat(String(selectedProd.price).replace(/,/g, ''));
    
    const pCard = {
      image: selectedProd.image || PLACEHOLDER_IMAGE,
      name: selectedProd.title,
      variant: modalVariant || "Standard Sourcing Config",
      color: modalColor || "Midnight Slate",
      quantity: modalQuantity,
      notes: modalNotes || "Special protective transport carton requested.",
      price: unitPriceNum,
      link: `/products/${selectedProd.id}`,
      status: "pending"
    };

    const threadId = activeThreadId || 'thread-general';
    const orderRef = `CHOOSIFY-${Math.floor(1000000 + Math.random() * 9000000)}`;

    const structuredMsg = `🛒 SPECIAL IN-CHAT SOURCING ORDER DISPATCH:
📦 Item: ${selectedProd.title}
🎨 Color: ${modalColor}
⚙️ Variant: ${modalVariant}
🔢 Quantity: ${modalQuantity}
💵 Unit Price: BDT ${unitPriceNum.toLocaleString()}
📝 Sourcing Memo: ${modalNotes || "No notes."}`;

    // 1. Post shared card message
    addThreadMessage(threadId, structuredMsg, 'user', 'Me', pCard);

    // 2. Set thread meta order reference if missing
    setThreads(prev => prev.map(t => {
      if (t.id === threadId) {
        return {
          ...t,
          orderRef: t.orderRef || orderRef
        };
      }
      return t;
    }));

    setShowSourcingModal(false);
    setModalNotes('');
    toast.success('Custom product card shared inside current thread!');

    // 3. Automated seller reply
    setTimeout(() => {
      const sellerResponse = `💬 SELLER SOURCING NOTIFICATION:
Thank you for sending this custom parameter card! We have logged BDT ${(unitPriceNum * modalQuantity).toLocaleString()} in draft format. Let me review and approve it.`;
      addThreadMessage(threadId, sellerResponse, 'seller', activeThread?.title || 'Merchant Partner');
      toast.success('Reply received from supplier representative!');
    }, 1200);
  };

  return (
    <div className="flex flex-col bg-choosify-feed text-gray-900 h-[calc(100dvh-var(--choosify-navbar-height,4rem))] max-h-[calc(100dvh-var(--choosify-navbar-height,4rem))] overflow-hidden">
      {/* Messages Header bar */}
      <div className="w-full border-b border-[#D6E1EC] bg-[#000435] text-white shrink-0 px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <button 
            type="button" 
            onClick={() => {
              if (threadId && window.innerWidth < 768) {
                navigate('/messages');
              } else {
                navigate('/dashboard');
              }
            }} 
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
          {(() => {
            const hasUnread = threads.some(t => t.unread);
            return (
              <button
                type="button"
                onClick={() => {
                  if (hasUnread) {
                    markAllAsRead();
                    toast.success('All Support Chats marked as read!');
                  }
                }}
                disabled={!hasUnread}
                className={`px-4 py-2 border rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all italic flex items-center gap-1.5
                  ${hasUnread 
                    ? 'bg-white/5 hover:bg-white/10 border-white/10 text-white cursor-pointer' 
                    : 'bg-white/[0.02] border-white/5 text-gray-500 cursor-not-allowed'}`}
                title={hasUnread ? "Mark All as Read" : "All messages are already read"}
              >
                <CheckSquare size={12} className={hasUnread ? 'text-[#F96550]' : 'text-gray-600'} />
                Mark All as Read
              </button>
            );
          })()}
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

      {/* Main container — fills viewport below navbar + page header */}
      <div className="flex flex-1 min-h-0 overflow-hidden">
        {/* Sidebar: list of chat threads */}
        <aside className={`w-full md:w-[320px] lg:w-[380px] bg-white border-r border-[#D6E1EC] flex flex-col shrink-0 min-h-0 ${threadId ? 'hidden md:flex' : 'flex'}`}>
          <div className="p-4 sm:p-6 border-b border-gray-100 space-y-4 bg-white shrink-0">
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block italic">Your conversations</span>
            <div className="relative">
              <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input 
                onChange={(e) => setSearchQuery(e.target.value)}
                value={searchQuery}
                className="w-full h-11 pl-11 pr-4 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-orange-primary focus:bg-white transition-all" 
                placeholder="Search transactions / order references..." 
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto divide-y divide-gray-100 bg-white no-scrollbar min-h-0">
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
                    aria-current={isActive ? 'true' : undefined}
                    className={`w-full p-4 sm:p-5 flex gap-4 text-left transition-all relative border-l-4 ${
                      isActive
                        ? 'bg-gradient-to-r from-[#FFF5F0] via-[#FFFAF7] to-white border-l-[#E8500A] shadow-[inset_0_0_0_1px_rgba(232,80,10,0.1)]'
                        : 'border-l-transparent hover:bg-gray-50'
                    } ${t.unread && !isActive ? 'bg-[#FFFBF8]' : ''}`}
                  >
                    <div className="relative shrink-0">
                      <img
                        src={t.avatar}
                        className={`w-12 h-12 rounded-full object-cover border-2 ${
                          isActive ? 'border-[#E8500A] ring-2 ring-[#E8500A]/20' : 'border-gray-200'
                        }`}
                        alt=""
                      />
                      {isActive && (
                        <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-[#E8500A] border-2 border-white rounded-full" />
                      )}
                      {!isActive && t.unread && (
                        <div className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-[#E8500A] border-2 border-white rounded-full" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <span className={`text-xs uppercase italic truncate pr-2 ${
                          isActive ? 'font-black text-[#E8500A]' : 'font-bold text-gray-900'
                        }`}>
                          {t.title}
                        </span>
                        <span className="text-[8px] font-bold text-gray-500 tracking-wider shrink-0">{t.time}</span>
                      </div>
                      <p className={`text-[10px] line-clamp-1 italic mb-1.5 ${
                        isActive ? 'text-gray-700 font-semibold' : 'text-gray-500'
                      }`}>
                        {t.lastMessage}
                      </p>
                      <div className="flex flex-wrap items-center gap-1.5">
                        {isActive && (
                          <span className="inline-flex text-[8px] font-black bg-[#E8500A] text-white px-2 py-0.5 rounded uppercase tracking-wider">
                            Active chat
                          </span>
                        )}
                        {t.orderRef && (
                          <span className="inline-flex text-[8px] font-black bg-[#F0F8FF] border border-[#D6E1EC] text-[#E8500A] px-1.5 py-0.5 rounded uppercase tracking-wider">
                            ORDER: {t.orderRef}
                          </span>
                        )}
                      </div>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </aside>

        {/* Messaging / Conversation content viewport */}
        <main className={`flex-1 flex flex-col bg-choosify-feed min-h-0 min-w-0 ${threadId ? 'flex' : 'hidden md:flex'}`}>
          {threadId && (
            <div className="md:hidden flex items-center gap-3 px-4 py-3 bg-white border-b border-[#D6E1EC] flex-shrink-0">
              <Link
                to="/messages"
                className="flex items-center gap-2 text-[11px] font-black uppercase tracking-wider text-gray-600 hover:text-navy transition-colors"
              >
                <ArrowLeft size={14} />
                Back to Messages
              </Link>
            </div>
          )}
          {activeThread ? (
            <>
              {/* Header inside open thread chat */}
              <div className="p-4 sm:p-6 border-b border-[#E8500A]/20 bg-gradient-to-r from-[#FFF5F0] to-white flex items-center justify-between shrink-0">
                <div className="flex items-center gap-4 min-w-0">
                  <img
                    src={activeThread.avatar}
                    className="w-11 h-11 rounded-full object-cover border-2 border-[#E8500A] ring-2 ring-[#E8500A]/15 shrink-0"
                    alt=""
                  />
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="inline-flex text-[8px] font-black bg-[#E8500A] text-white px-2 py-0.5 rounded uppercase tracking-wider">
                        Current thread
                      </span>
                    </div>
                    <h2 className="text-sm font-black text-[#1A1D4E] italic uppercase tracking-wider leading-none mb-1 truncate">
                      {activeThread.title}
                    </h2>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[9px] font-bold text-green-600 uppercase italic flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                        Live chat
                      </span>
                      {activeThread.orderRef && (
                        <span className="text-[8px] font-black bg-orange-50 border border-orange-200 text-[#E8500A] px-2 py-0.5 rounded-md uppercase tracking-wider">
                          {activeThread.orderRef}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:text-gray-900 transition-colors border-none cursor-pointer" title="Notifications">
                    <Bell size={14} />
                  </button>
                  <button className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:text-gray-900 transition-colors border-none cursor-pointer" title="Thread Options">
                    <MoreVertical size={14} />
                  </button>
                </div>
              </div>

              {/* Chat viewport — scroll contained here only */}
              <div
                ref={chatViewportRef}
                className="flex-1 p-4 sm:p-6 md:p-8 overflow-y-auto space-y-6 no-scrollbar relative min-h-0"
              >
                {/* 🚨 ORDER OVERVIEW CARD INSIDE CHAT (CRITICAL REQUIREMENT) */}
                {linkedSubOrder && (
                  <div className="max-w-2xl mx-auto bg-white border border-[#D6E1EC] rounded-3xl p-6 shadow-sm relative overflow-hidden transition-all duration-300">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-[#F96500]/5 rounded-full blur-2xl" />
                    
                    {/* Upper layout: badge indicators */}
                    <div className="flex flex-wrap items-center justify-between gap-4 border-b border-gray-100 pb-4 mb-4">
                      <div className="flex items-center gap-2">
                        <span className="text-[8.5px] font-black bg-orange-primary text-white px-2 py-0.5 rounded-md italic tracking-wider">
                          LINKED LOT TRANSACTION
                        </span>
                        <span className="text-[8.5px] font-mono text-gray-500">
                          {linkedSubOrder.invoiceId}
                        </span>
                      </div>
                      
                      {/* Tracking state badges matching original design colors */}
                      <span className={`text-[9px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded italic border flex items-center gap-1.5
                        ${linkedSubOrder.trackingStatus === 'pending' ? 'bg-[#FF9F00]/10 border-[#FF9F00]/30 text-[#FF9F00]' : ''}
                        ${linkedSubOrder.trackingStatus === 'dispatched' ? 'bg-[#3867ff]/10 border-[#3867ff]/30 text-[#3867ff]' : ''}
                        ${linkedSubOrder.trackingStatus === 'transit' ? 'bg-purple-100 border-purple-300 text-purple-600' : ''}
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
                            className="w-16 h-16 rounded-2xl object-cover shrink-0 border border-gray-200 bg-white"
                            alt=""
                          />
                          <div className="flex-1 min-w-0">
                            <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest block mb-1">
                              {activeThread.title}
                            </span>
                            <h4 className="text-xs font-black text-gray-900 uppercase italic leading-tight mb-1 line-clamp-1">
                              {item.productTitle}
                            </h4>
                            <div className="flex items-center gap-3 text-[10px] text-gray-500 font-bold">
                              <span>Quantity: <b className="text-gray-900">{(item.quantity ?? 1)} units</b></span>
                              <span>•</span>
                              <span>Unit Net: <b className="text-orange-primary">৳{(item.price ?? 0).toLocaleString()}</b></span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Bottom layer: tracking status bar indicators */}
                    <div className="mt-6 pt-4 border-t border-gray-100 grid grid-cols-4 gap-2 text-center text-gray-500">
                      {['pending', 'dispatched', 'transit', 'delivered'].map((step, sIdx, arr) => {
                        const statusWeights: Record<string, number> = { pending: 1, dispatched: 2, transit: 3, delivered: 4 };
                        const isActive = statusWeights[linkedSubOrder.trackingStatus] >= statusWeights[step];
                        return (
                          <div key={step} className="space-y-2">
                            <div className={`h-1 rounded-full transition-all duration-500 ${isActive ? 'bg-[#F96500]' : 'bg-gray-150'}`} />
                            <span className={`text-[8px] font-black uppercase tracking-wider block ${isActive ? 'text-gray-950 font-black' : 'text-gray-400'}`}>
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
                        <span className="font-black text-gray-950 text-sm">
                          ৳{(linkedSubOrder.items.reduce((acc: number, x: any) => acc + ((x.price ?? 0) * (x.quantity ?? 0)), 0) + (linkedSubOrder.deliveryFee ?? 0)).toLocaleString()}
                        </span>
                      </div>
                      <button
                        onClick={() => navigate('/order-tracking', { state: { order: linkedOrder } })}
                        className="px-5 py-2.5 bg-gray-50 hover:bg-orange-primary hover:text-white border border-gray-200 hover:border-orange-primary rounded-xl text-[9px] font-black text-gray-700 transition-all italic flex items-center gap-2 cursor-pointer"
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
                    const isOutgoing = m.sender === 'user';
                    const senderLabel = m.sender === 'user' ? 'You' : (activeThread?.title || 'Merchant');

                    return (
                      <div 
                        key={m.id} 
                        className={`flex flex-col max-w-[85%] sm:max-w-[75%] ${isOutgoing ? 'ml-auto items-end animate-in slide-in-from-right-4 duration-300' : 'mr-auto items-start animate-in slide-in-from-left-4 duration-300'}`}
                      >
                        {m.productCard && (
                          <div className={`w-full max-w-sm rounded-3xl overflow-hidden border mb-3 text-left transition-all hover:shadow-lg bg-white text-gray-900 border-gray-200 shadow-md relative group`}>
                            {/* Card Status Indicator overlay */}
                            <div className="px-4 py-2 border-b border-gray-100 flex items-center justify-between bg-gray-50">
                              <span className="text-[8px] font-black uppercase text-gray-400 tracking-wider flex items-center gap-1.5 leading-none">
                                <Package size={11} className="text-[#E8500A]" />
                                Sourcing Request Card
                              </span>
                              {(() => {
                                const status = m.productCard.status || 'pending';
                                if (status === 'pending') {
                                  return (
                                    <span className="px-2 py-0.5 text-[8px] font-black uppercase bg-amber-500/10 text-amber-600 rounded-md border border-amber-500/20 italic animate-pulse">
                                      🟡 Sourcing Draft
                                    </span>
                                  );
                                } else if (status === 'approved') {
                                  return (
                                    <span className="px-2 py-0.5 text-[8px] font-black uppercase bg-green-500/10 text-green-600 rounded-md border border-green-500/20 italic">
                                      🟢 APPROVED BY SELLER
                                    </span>
                                  );
                                } else if (status === 'countered') {
                                  return (
                                    <span className="px-2 py-0.5 text-[8px] font-black uppercase bg-blue-500/10 text-blue-600 rounded-md border border-blue-500/20 italic">
                                      🔵 COUNTER OFFER PROPOSED
                                    </span>
                                  );
                                } else {
                                  return (
                                    <span className="px-2 py-0.5 text-[8px] font-black uppercase bg-gray-400/10 text-gray-500 rounded-md border border-gray-400/20 italic">
                                      ⚪ REJECTED / WITHDRAWN
                                    </span>
                                  );
                                }
                              })()}
                            </div>

                            {/* Product Header */}
                            <div className="p-4 flex gap-4 items-start">
                              <img 
                                src={m.productCard.image || PLACEHOLDER_IMAGE} 
                                className="w-20 h-20 rounded-2xl object-cover shrink-0 border border-gray-200 bg-white" 
                                alt="" 
                                referrerPolicy="no-referrer"
                              />
                              <div className="flex-1 min-w-0">
                                <h4 className="text-xs font-black text-gray-900 uppercase italic leading-tight mb-1 line-clamp-2">
                                  {m.productCard.name}
                                </h4>
                                <div className="text-[10px] text-gray-500 font-bold space-y-0.5 mt-2">
                                  <p>Variant: <span className="text-gray-900 font-extrabold">{m.productCard.variant}</span></p>
                                  <p>Color: <span className="text-gray-900 font-extrabold">{m.productCard.color}</span></p>
                                  <p>Quantity: <span className="text-[#E8500A] font-extrabold">{m.productCard.quantity} units</span></p>
                                </div>
                              </div>
                            </div>
                            
                            {/* Notes & Pricing */}
                            <div className="px-4 py-3.5 bg-gray-50/50 border-t border-gray-100 text-[10px]">
                              {m.productCard.notes && (
                                <div className="mb-3 bg-white border border-gray-100 rounded-xl p-2.5">
                                  <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest block mb-0.5">Sourcing Parameter Memo</span>
                                  <p className="text-gray-600 font-medium italic">"{m.productCard.notes}"</p>
                                </div>
                              )}
                              
                              <div className="flex items-center justify-between pt-1 border-t border-dashed border-gray-200">
                                <span className="text-gray-500 font-bold uppercase text-[9px] tracking-wider">Estimated Total Sourcing Net:</span>
                                <div className="text-right">
                                  {m.productCard.status === 'countered' && (
                                    <span className="text-[9px] font-bold line-through text-gray-400 mr-2 block">
                                      ৳{(m.productCard.price * m.productCard.quantity).toLocaleString()}
                                    </span>
                                  )}
                                  <span className="text-xs font-black text-[#E8500A] font-mono block">
                                    ৳{((m.productCard.counterPrice || m.productCard.price) * m.productCard.quantity).toLocaleString()}
                                  </span>
                                </div>
                              </div>
                            </div>

                            {/* Buyer sourcing card actions */}
                            <div className="p-3 bg-gray-50 border-t border-gray-100 flex flex-col gap-2">
                              <div className="w-full flex flex-wrap gap-1.5 justify-end">
                                {(m.productCard.status || 'pending') === 'pending' && (
                                  <button
                                    onClick={() => {
                                      updateProductCard(m.id, { status: 'canceled' });
                                      addThreadMessage(activeThreadId, `🚫 Buyer has withdrawn the sourcing request for ${m.productCard.name}.`, 'user', 'Me');
                                      toast.success('Sourcing request withdrawn!');
                                    }}
                                    className="px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 rounded-xl text-[9px] font-black uppercase tracking-wider transition-all cursor-pointer border-none"
                                  >
                                    Withdraw Card
                                  </button>
                                )}
                                {m.productCard.status === 'countered' && (
                                  <>
                                    <button
                                      onClick={() => {
                                        updateProductCard(m.id, { status: 'approved', price: m.productCard.counterPrice });
                                        addThreadMessage(activeThreadId, `✅ Buyer accepted the supplier counter offer of BDT ${m.productCard.counterPrice?.toLocaleString()} per unit! Sourcing transaction locked.`, 'user', 'Me');
                                        toast.success('Supplier counter offer accepted! Sourcing order verified.');
                                      }}
                                      className="px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white rounded-xl text-[9px] font-black uppercase tracking-wider transition-all cursor-pointer border-none"
                                    >
                                      Accept Counter Deal
                                    </button>
                                    <button
                                      onClick={() => {
                                        updateProductCard(m.id, { status: 'canceled' });
                                        addThreadMessage(activeThreadId, `❌ Buyer declined the counter offer. Sourcing request cancelled.`, 'user', 'Me');
                                        toast.error('Deal declined.');
                                      }}
                                      className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-[9px] font-black uppercase tracking-wider transition-all cursor-pointer border-none"
                                    >
                                      Decline Deal
                                    </button>
                                  </>
                                )}
                              </div>

                              <div className="flex justify-end pt-1.5 border-t border-gray-100">
                                <Link 
                                  to={m.productCard.link}
                                  className="px-3.5 py-1.5 bg-gray-50 hover:bg-[#F96500]/10 text-gray-700 hover:text-[#F96500] border border-gray-200 hover:border-[#F96500]/25 text-[8.5px] font-black uppercase tracking-wider rounded-xl transition-all italic flex items-center gap-1.5 leading-none"
                                >
                                  View Sourcing Product Details <ExternalLink size={10} />
                                </Link>
                              </div>
                            </div>
                          </div>
                        )}

                        <div className={`px-5 py-3 md:px-6 md:py-4 rounded-[20px] mb-2 text-[11px] md:text-sm font-bold leading-relaxed shadow-sm
                          ${isOutgoing 
                            ? 'bg-[#F96500] text-white rounded-tr-none italic' 
                            : 'bg-white text-gray-800 rounded-tl-none border border-gray-100'
                          }
                        `}>
                          {m.text}
                        </div>
                        <span className="text-[8.5px] font-black text-gray-400 uppercase tracking-widest px-2 italic">
                          {senderLabel} • {m.time}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Chat send input */}
              <div className="p-4 sm:p-6 md:p-8 bg-white border-t border-gray-200 flex flex-col gap-3 shrink-0">
                
                {/* 🛒 QUICK SOURCING DEMO ACTION PILLS */}
                <div className="flex flex-wrap gap-2 justify-start max-w-4xl mx-auto w-full">
                  <button
                    onClick={() => {
                      // Preload samsung or other popular product index
                      setModalProdIdx(0);
                      setModalColor("Premium Titanium Silver");
                      setModalVariant("Volumetric Bulk Cargo Container");
                      setModalQuantity(25);
                      setShowSourcingModal(true);
                    }}
                    className="px-3.5 py-2 bg-blue-50 hover:bg-blue-100 border border-blue-200 hover:border-blue-300 rounded-xl text-[10px] font-black text-blue-700 transition-all italic flex items-center gap-1.5 cursor-pointer"
                  >
                    <Plus size={12} className="text-blue-600 animate-pulse" />
                    Share New Sourcing Product Card
                  </button>
                  <button
                    onClick={() => {
                      setInputText("Hi! Do you have this specific product variant fully prepared for bulk dispatch?");
                    }}
                    className="px-3.5 py-2 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-xl text-[10px] font-bold text-gray-600 transition-all cursor-pointer"
                  >
                    Check Stock Slabs 📦
                  </button>
                  <button
                    onClick={() => {
                      setInputText("Could we request premium safe wooden-box packaging for the entire lot?");
                    }}
                    className="px-3.5 py-2 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-xl text-[10px] font-bold text-gray-600 transition-all cursor-pointer"
                  >
                    Logistics Packaging Memo 🏷️
                  </button>
                </div>

                <div className="relative max-w-4xl mx-auto w-full">
                  <input 
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    className="w-full h-14 bg-gray-50 border border-gray-200 rounded-2xl pl-6 pr-16 text-xs font-bold text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-orange-primary focus:bg-white transition-all" 
                    placeholder="Type your message to the seller or support team..."
                  />
                  <button 
                    onClick={handleSendMessage}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-xl bg-orange-primary text-white flex items-center justify-center hover:bg-[#FF5B00] transition-colors shadow-lg active:scale-95 cursor-pointer border-none"
                    title="Send Ticket Message"
                  >
                    <Send size={14} />
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-12 text-center max-w-lg mx-auto space-y-4">
              <div className="w-20 h-20 bg-white rounded-full border border-gray-200 flex items-center justify-center text-gray-300 mb-4 scale-110 shadow-sm">
                <MessageSquare size={32} />
              </div>
              <h3 className="text-lg font-black uppercase text-gray-950 italic tracking-tight">No dialogue stream active</h3>
              <p className="text-[10px] text-gray-500 uppercase tracking-widest leading-relaxed font-bold">
                Select a supplier transaction node from the workspace pipeline lists to monitor communication, discuss parameters, or track logistics.
              </p>
            </div>
          )}
        </main>
      </div>

      {/* 🚨 CUSTOM IN-CHAT SOURCING ORDER CARD GENERATION MODAL */}
      {showSourcingModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-gray-950/65 backdrop-blur-xs">
          <div className="relative bg-white w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl border border-gray-100 p-6 md:p-8 animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-gray-100 pb-4 mb-6">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                  <Sparkles size={16} />
                </div>
                <div>
                  <h3 className="text-xs font-black uppercase text-gray-950 italic tracking-wide leading-none">Share Custom Sourcing Config</h3>
                  <span className="text-[8px] font-bold text-gray-400 uppercase tracking-widest block mt-0.5">Simulate Buyer Order Request Card</span>
                </div>
              </div>
              <button
                onClick={() => setShowSourcingModal(false)}
                className="w-8 h-8 rounded-full bg-gray-50 hover:bg-gray-100 text-gray-500 hover:text-gray-900 flex items-center justify-center transition-colors border-none cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            {/* Modal Body Fields */}
            <div className="space-y-4">
              {/* Product Selection */}
              <div>
                <label className="text-[9px] font-black uppercase text-gray-400 tracking-wider block mb-1.5">Select Sourcing Product Catalog:</label>
                <select
                  value={modalProdIdx}
                  onChange={(e) => setModalProdIdx(Number(e.target.value))}
                  className="w-full h-11 px-4 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold text-gray-900 focus:outline-none focus:border-blue-500"
                >
                  {PRODUCTS.map((prod, pIdx) => (
                    <option key={prod.id} value={pIdx}>
                      {prod.title} (৳{parseFloat(String(prod.price).replace(/,/g, '')).toLocaleString()})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Variant */}
                <div>
                  <label className="text-[9px] font-black uppercase text-gray-400 tracking-wider block mb-1.5">Selected Variant:</label>
                  <input
                    type="text"
                    value={modalVariant}
                    onChange={(e) => setModalVariant(e.target.value)}
                    className="w-full h-11 px-4 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold text-gray-900 focus:outline-none focus:border-blue-500"
                    placeholder="e.g. 256GB / 12GB RAM"
                  />
                </div>

                {/* Color */}
                <div>
                  <label className="text-[9px] font-black uppercase text-gray-400 tracking-wider block mb-1.5">Selected Color:</label>
                  <input
                    type="text"
                    value={modalColor}
                    onChange={(e) => setModalColor(e.target.value)}
                    className="w-full h-11 px-4 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold text-gray-900 focus:outline-none focus:border-blue-500"
                    placeholder="e.g. Space Gray"
                  />
                </div>
              </div>

              {/* Quantity */}
              <div>
                <label className="text-[9px] font-black uppercase text-gray-400 tracking-wider block mb-1.5">Order Quantity (Units):</label>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setModalQuantity(q => Math.max(1, q - 1))}
                    className="w-10 h-10 rounded-xl bg-gray-150 hover:bg-gray-200 text-gray-800 font-bold flex items-center justify-center border-none cursor-pointer"
                  >
                    -
                  </button>
                  <span className="text-sm font-black text-gray-900 w-12 text-center">{modalQuantity}</span>
                  <button
                    type="button"
                    onClick={() => setModalQuantity(q => q + 1)}
                    className="w-10 h-10 rounded-xl bg-gray-150 hover:bg-gray-200 text-gray-800 font-bold flex items-center justify-center border-none cursor-pointer"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Custom Notes */}
              <div>
                <label className="text-[9px] font-black uppercase text-gray-400 tracking-wider block mb-1.5">Special Sourcing Parameter Memo:</label>
                <textarea
                  value={modalNotes}
                  onChange={(e) => setModalNotes(e.target.value)}
                  className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-blue-500 h-20 resize-none"
                  placeholder="e.g. Request fast sea-cargo dispatch with heavy bubble wrap and individual manufacturer tags..."
                />
              </div>

              {/* Total Summary */}
              <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 flex justify-between items-center text-[11px] font-bold">
                <span className="text-blue-800">Sourcing Total Estimate:</span>
                <span className="text-sm font-black text-[#E8500A] font-mono">
                  ৳{(parseFloat(String(PRODUCTS[modalProdIdx].price).replace(/,/g, '')) * modalQuantity).toLocaleString()}
                </span>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="mt-6 pt-4 border-t border-gray-100 flex gap-3 justify-end">
              <button
                type="button"
                onClick={() => setShowSourcingModal(false)}
                className="px-5 py-2.5 bg-gray-50 hover:bg-gray-100 rounded-xl text-[10px] font-black uppercase tracking-wider text-gray-600 transition-all cursor-pointer border-none"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleCreateSourcingRequest}
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-[10px] font-black uppercase tracking-wider transition-all italic shadow-md cursor-pointer border-none flex items-center gap-1"
              >
                <Sparkles size={12} />
                Confirm & Dispatch Card
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
