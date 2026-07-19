import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useDashboard } from '../context/DashboardContext';
import { useGlobalState } from '../context/GlobalStateContext';
import { PRODUCTS, PLACEHOLDER_IMAGE } from '../constants';
import {
  CHOOSIFY_ANNOUNCEMENTS_THREAD_ID,
  CHOOSIFY_ANNOUNCEMENTS_TITLE,
} from '../lib/announcements';
import {
  Search, ArrowLeft, Send, MoreVertical, CheckCircle,
  Package, Truck, Clock, MessageSquare, ExternalLink, LayoutDashboard, CheckSquare,
  X, Info, Sparkles, Plus, Megaphone, Lock,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { operationsApi } from '../services/operationsApi';
import { MessagesRightRail } from '../components/messages/MessagesRightRail';

type ConversationTab = 'all' | 'orders' | 'support' | 'unread';

export function MessagesPage() {
  const { threadId } = useParams<{ threadId?: string }>();
  const navigate = useNavigate();
  const { threads, threadMessages, addThreadMessage, createNewThread, markAllAsRead, setThreads, setThreadMessages } = useDashboard();
  const { orders } = useGlobalState();
  const [inputText, setInputText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [conversationTab, setConversationTab] = useState<ConversationTab>('all');

  // Interactive Modal states
  const [showSourcingModal, setShowSourcingModal] = useState(false);

  // Sourcing Modal field states
  const [modalProdIdx, setModalProdIdx] = useState(0);
  const [modalColor, setModalColor] = useState('Sunset Orange');
  const [modalVariant, setModalVariant] = useState('Standard Retail Unit');
  const [modalQuantity, setModalQuantity] = useState(5);
  const [modalNotes, setModalNotes] = useState('');

  const sortedThreads = useMemo(() => {
    return [...threads].sort((a, b) => {
      if (a.id === CHOOSIFY_ANNOUNCEMENTS_THREAD_ID) return -1;
      if (b.id === CHOOSIFY_ANNOUNCEMENTS_THREAD_ID) return 1;
      return 0;
    });
  }, [threads]);

  // Active thread selection — announcements thread is pinned first
  const activeThreadId = threadId || (sortedThreads.length > 0 ? sortedThreads[0].id : null);
  const activeThread = sortedThreads.find(t => t.id === activeThreadId);
  const isAnnouncementsThread =
    activeThread?.type === 'announcement' ||
    activeThread?.id === CHOOSIFY_ANNOUNCEMENTS_THREAD_ID ||
    activeThread?.readOnly === true;

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
  const searchedThreads = sortedThreads.filter(t =>
    t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.lastMessage.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.orderRef?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const tabCounts = useMemo(() => {
    const all = searchedThreads.length;
    const ordersCount = searchedThreads.filter(
      (t) => !!t.orderRef || t.type === 'retail',
    ).length;
    const support = searchedThreads.filter(
      (t) => t.type === 'general' || t.type === 'announcement',
    ).length;
    const unread = searchedThreads.filter((t) => t.unread).length;
    return { all, orders: ordersCount, support, unread };
  }, [searchedThreads]);

  const filteredThreads = searchedThreads.filter((t) => {
    if (conversationTab === 'orders') return !!t.orderRef || t.type === 'retail';
    if (conversationTab === 'support') return t.type === 'general' || t.type === 'announcement';
    if (conversationTab === 'unread') return t.unread;
    return true;
  });

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
    if (!inputText.trim() || !activeThreadId || isAnnouncementsThread) return;

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

  const handleNewConversation = () => {
    const id = `thread-support-${Date.now()}`;
    createNewThread(
      id,
      'Choosify Support',
      PLACEHOLDER_IMAGE,
      'general',
      'How can we help you today?',
    );
    navigate(`/messages/${id}`);
    setConversationTab('support');
  };

  const hasUnread = threads.some(t => t.unread);

  const tabs: { id: ConversationTab; label: string; count: number }[] = [
    { id: 'all', label: 'All', count: tabCounts.all },
    { id: 'orders', label: 'Orders', count: tabCounts.orders },
    { id: 'support', label: 'Support', count: tabCounts.support },
    { id: 'unread', label: 'Unread', count: tabCounts.unread },
  ];

  return (
    <div className="flex flex-col bg-[#F4F7F9] text-[#1A1A2E] h-[calc(100dvh-var(--choosify-navbar-height,4rem))] max-h-[calc(100dvh-var(--choosify-navbar-height,4rem))] overflow-hidden">
      {/* Messages Header bar — constrained to feed silhouette */}
      <div className="w-full px-5 sm:px-10 pt-3 shrink-0">
        <div className="max-w-[1400px] mx-auto w-full choosify-dark-surface text-white px-5 sm:px-10 py-5 flex items-center justify-between gap-3.5 flex-wrap rounded-[14px] overflow-hidden">
        <div className="flex items-center gap-3 min-w-0">
          <button
            type="button"
            onClick={() => {
              if (threadId && window.innerWidth < 768) {
                navigate('/messages');
              } else {
                navigate('/dashboard');
              }
            }}
            className="w-9 h-9 rounded-lg bg-white/8 flex items-center justify-center text-white/70 hover:text-white transition-colors border-none cursor-pointer shrink-0"
          >
            <ArrowLeft size={16} />
          </button>
          <div className="min-w-0">
            <div className="text-[10.5px] font-bold text-[#FF5B00] tracking-[0.4px] mb-1">
              CUSTOMER SUPPORT CENTER
            </div>
            <h1 className="text-[19px] font-extrabold leading-tight flex items-center gap-2">
              <MessageSquare size={18} className="text-[#FF5B00] shrink-0" />
              Real-time support
            </h1>
            <p className="text-[11.5px] text-white/50 mt-0.5">We&apos;re here to help, 24/7</p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            type="button"
            onClick={() => {
              if (hasUnread) {
                markAllAsRead();
                toast.success('All support chats marked as read!');
              }
            }}
            disabled={!hasUnread}
            className={`px-4 py-2.5 rounded-lg text-[11px] font-bold transition-all flex items-center gap-1.5 border-none
              ${hasUnread
                ? 'bg-white/8 hover:bg-white/12 text-white cursor-pointer'
                : 'bg-white/[0.04] text-white/40 cursor-not-allowed'}`}
            title={hasUnread ? 'Mark all as read' : 'All messages are already read'}
          >
            <CheckSquare size={12} />
            Mark all as read
          </button>
          <Link
            to="/dashboard"
            state={{ activeTab: 'overview' }}
            className="px-4 py-2.5 bg-white/8 hover:bg-white/12 rounded-lg text-[11px] font-bold text-white transition-all flex items-center gap-1.5"
          >
            <LayoutDashboard size={12} className="text-[#FF5B00]" />
            Dashboard
          </Link>
          <Link
            to="/profile/orders"
            className="px-4 py-2.5 bg-[#FF5B00] hover:bg-[#EB4501] rounded-lg text-[11px] font-bold text-white transition-all flex items-center gap-1.5"
          >
            <Package size={12} />
            My Orders
          </Link>
        </div>
        </div>
      </div>

      {/* 3-column shell: list | chat | rail */}
      <div className="flex flex-1 min-h-0 overflow-hidden max-w-[1400px] w-full mx-auto">
        {/* Sidebar: conversation list (~300px) */}
        <aside
          className={`w-full md:w-[300px] bg-white border-r border-[#E8EDF2] flex flex-col shrink-0 min-h-0 ${
            threadId ? 'hidden md:flex' : 'flex'
          }`}
        >
          <div className="p-4 border-b border-[#E8EDF2] space-y-3 bg-white shrink-0">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-extrabold text-[#9AA0AC] tracking-[0.4px]">
                Your conversations
              </span>
              <button
                type="button"
                onClick={handleNewConversation}
                className="w-[22px] h-[22px] rounded-full bg-[#FF5B00] text-white flex items-center justify-center text-[13px] border-none cursor-pointer hover:bg-[#EB4501] transition-colors"
                title="New support conversation"
              >
                <Plus size={12} strokeWidth={3} />
              </button>
            </div>
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9AA0AC]" />
              <input
                onChange={(e) => setSearchQuery(e.target.value)}
                value={searchQuery}
                className="w-full h-9 pl-9 pr-3 bg-white border border-[#E5E7EB] rounded-lg text-[11.5px] font-medium text-[#1A1A2E] placeholder:text-[#9AA0AC] focus:outline-none focus:border-[#FF5B00] transition-all"
                placeholder="Search transactions / order references..."
              />
            </div>

            {/* Conversation tabs */}
            <div className="flex gap-3.5 overflow-x-auto no-scrollbar text-[11px] font-bold text-[#9AA0AC]">
              {tabs.map((tab) => {
                const active = conversationTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setConversationTab(tab.id)}
                    className={`shrink-0 pb-1.5 border-b-2 transition-colors border-none bg-transparent cursor-pointer ${
                      active
                        ? 'text-[#FF5B00] border-[#FF5B00]'
                        : 'border-transparent hover:text-[#1A1A2E]'
                    }`}
                  >
                    {tab.label}{' '}
                    <span
                      className={
                        active
                          ? 'bg-[#FF5B00] text-white rounded-lg px-1.5 py-px text-[9.5px]'
                          : 'text-[#1A1A2E]'
                      }
                    >
                      {tab.count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex-1 overflow-y-auto bg-white no-scrollbar min-h-0 px-1 py-1">
            {filteredThreads.length === 0 ? (
              <div className="p-8 text-center text-[#9AA0AC] text-[11px] font-medium">
                No conversations in this filter
              </div>
            ) : (
              filteredThreads.map((t) => {
                const isActive = t.id === activeThreadId;
                return (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => navigate(`/messages/${t.id}`)}
                    aria-current={isActive ? 'true' : undefined}
                    className={`w-full p-3 flex gap-3 text-left transition-all rounded-lg border-none cursor-pointer ${
                      isActive
                        ? 'bg-[#FFF3EC]'
                        : t.unread
                          ? 'bg-[#FFFBF8] hover:bg-[#F4F7F9]'
                          : 'bg-transparent hover:bg-[#F4F7F9]'
                    }`}
                  >
                    <div className="relative shrink-0">
                      <img
                        src={t.avatar}
                        className="w-[38px] h-[38px] rounded-full object-cover border border-[#E8EDF2]"
                        alt=""
                      />
                      {t.unread && !isActive && (
                        <div className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-[#FF5B00] border-2 border-white rounded-full" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-baseline justify-between gap-2">
                        <span className="text-xs font-bold text-[#1A1A2E] truncate">
                          {t.title}
                        </span>
                        <span className="text-[9.5px] text-[#9AA0AC] shrink-0">{t.time}</span>
                      </div>
                      <p className="text-[11px] text-[#4B5563] truncate mb-1">
                        {t.lastMessage}
                      </p>
                      <div className="flex flex-wrap items-center gap-1">
                        {t.type === 'announcement' && (
                          <span className="inline-flex text-[9px] font-bold bg-[#F1F1F3] text-[#4B5563] px-2 py-0.5 rounded">
                            Broadcast
                          </span>
                        )}
                        {t.orderRef && (
                          <span className="inline-flex text-[9px] font-bold bg-[#FFF3EC] text-[#EB4501] px-2 py-0.5 rounded-xl">
                            ORDER: {t.orderRef}
                          </span>
                        )}
                        {!t.orderRef && t.type === 'general' && (
                          <span className="inline-flex text-[9px] font-bold bg-[#F1F1F3] text-[#4B5563] px-2 py-0.5 rounded">
                            Support
                          </span>
                        )}
                      </div>
                    </div>
                    {t.unread && (
                      <div className="w-4 h-4 rounded-full bg-[#FF5B00] text-white text-[9px] font-bold flex items-center justify-center shrink-0 self-center">
                        1
                      </div>
                    )}
                  </button>
                );
              })
            )}
          </div>

          {searchedThreads.length > 6 && (
            <div className="p-3 border-t border-[#E8EDF2] shrink-0">
              <button
                type="button"
                onClick={() => setConversationTab('all')}
                className="block w-full text-center text-[11.5px] font-bold text-[#FF5B00] border-none bg-transparent cursor-pointer hover:underline"
              >
                View all conversations →
              </button>
            </div>
          )}
        </aside>

        {/* Chat pane */}
        <main
          className={`flex-1 flex flex-col bg-[#F4F7F9] min-h-0 min-w-0 ${
            threadId ? 'flex' : 'hidden md:flex'
          }`}
        >
          {threadId && (
            <div className="md:hidden flex items-center gap-3 px-4 py-3 bg-white border-b border-[#E8EDF2] flex-shrink-0">
              <Link
                to="/messages"
                className="flex items-center gap-2 text-[11px] font-bold text-[#4B5563] hover:text-[#000435] transition-colors"
              >
                <ArrowLeft size={14} />
                Back to messages
              </Link>
            </div>
          )}
          {activeThread ? (
            <>
              {/* Thread header */}
              <div className="px-5 py-3.5 border-b border-[#E8EDF2] bg-white flex items-center justify-between gap-3 shrink-0">
                <div className="flex items-center gap-3 min-w-0">
                  <img
                    src={activeThread.avatar}
                    className="w-[38px] h-[38px] rounded-full object-cover border border-[#E8EDF2] shrink-0"
                    alt=""
                  />
                  <div className="min-w-0">
                    <h2 className="text-[13px] font-bold text-[#1A1A2E] leading-tight truncate">
                      {activeThread.title}
                    </h2>
                    {isAnnouncementsThread ? (
                      <span className="text-[10.5px] font-medium text-[#4B5563] flex items-center gap-1">
                        <Megaphone size={10} className="text-[#FF5B00]" />
                        Read-only broadcast
                      </span>
                    ) : (
                      <span className="text-[10.5px] font-medium text-[#07DD05]">
                        ● Online
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {activeThread.orderRef && (
                    <span className="hidden sm:inline-flex bg-[#FFF3EC] text-[#EB4501] text-[10px] font-bold px-2.5 py-1 rounded-xl">
                      ORDER: {activeThread.orderRef}
                    </span>
                  )}
                  <button
                    type="button"
                    className="w-9 h-9 rounded-lg bg-[#F4F7F9] flex items-center justify-center text-[#9AA0AC] hover:text-[#1A1A2E] transition-colors border-none cursor-pointer"
                    title="Thread options"
                  >
                    <MoreVertical size={14} />
                  </button>
                </div>
              </div>

              {/* Chat viewport */}
              <div
                ref={chatViewportRef}
                className="flex-1 p-5 overflow-y-auto space-y-4 no-scrollbar relative min-h-0 bg-[#F4F7F9]"
              >
                {isAnnouncementsThread && (
                  <div className="max-w-2xl mx-auto bg-white border border-[#E8EDF2] rounded-[10px] p-4 flex items-start gap-3">
                    <Info size={16} className="text-[#FF5B00] shrink-0 mt-0.5" />
                    <p className="text-[11px] font-medium text-[#4B5563] leading-relaxed">
                      {CHOOSIFY_ANNOUNCEMENTS_TITLE} is a read-only channel. Order updates, platform news, and campaign alerts appear here. Replies are not supported.
                    </p>
                  </div>
                )}

                {/* Linked order card */}
                {linkedSubOrder && !isAnnouncementsThread && (
                  <div className="max-w-2xl mx-auto bg-white border border-[#E8EDF2] rounded-[10px] p-4 relative overflow-hidden">
                    <div className="flex flex-wrap items-center justify-between gap-2 mb-2.5">
                      <span className="text-[9px] font-extrabold bg-[#F1F1F3] text-[#4B5563] px-2 py-0.5 rounded">
                        LINKED LOT TRANSACTION
                      </span>
                      <span
                        className={`text-[9.5px] font-bold px-2.5 py-0.5 rounded-xl flex items-center gap-1
                        ${linkedSubOrder.trackingStatus === 'pending' ? 'bg-[#FFF3EC] text-[#EB4501]' : ''}
                        ${linkedSubOrder.trackingStatus === 'dispatched' ? 'bg-[#3867ff]/10 text-[#3867ff]' : ''}
                        ${linkedSubOrder.trackingStatus === 'transit' ? 'bg-purple-100 text-purple-600' : ''}
                        ${linkedSubOrder.trackingStatus === 'delivered' ? 'bg-[#07DD05]/10 text-[#07DD05]' : ''}
                      `}
                      >
                        {linkedSubOrder.trackingStatus === 'pending' && <Clock size={11} />}
                        {linkedSubOrder.trackingStatus === 'dispatched' && <Package size={11} />}
                        {linkedSubOrder.trackingStatus === 'transit' && <Truck size={11} />}
                        {linkedSubOrder.trackingStatus === 'delivered' && <CheckCircle size={11} />}
                        {linkedSubOrder.trackingStatus.toUpperCase()}
                      </span>
                    </div>

                    <div className="space-y-3">
                      {linkedSubOrder.items.map((item: any, iIdx: number) => (
                        <div key={iIdx} className="flex gap-3 items-center">
                          <img
                            src={getProductImageByTitle(item.productTitle)}
                            className="w-12 h-12 rounded-lg object-cover shrink-0 border border-[#E8EDF2] bg-white"
                            alt=""
                          />
                          <div className="flex-1 min-w-0">
                            <h4 className="text-[12.5px] font-bold text-[#1A1A2E] leading-tight line-clamp-1">
                              {item.productTitle}
                            </h4>
                            <div className="text-[10.5px] text-[#9AA0AC]">
                              Qty {(item.quantity ?? 1)} · ৳{(item.price ?? 0).toLocaleString()}
                            </div>
                          </div>
                          <div className="text-right shrink-0">
                            <div className="text-[13px] font-extrabold text-[#FF5B00]">
                              ৳{((item.price ?? 0) * (item.quantity ?? 1)).toLocaleString()}
                            </div>
                            <div className="text-[9.5px] text-[#9AA0AC]">
                              {linkedSubOrder.invoiceId}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="mt-4 pt-3 border-t border-[#E8EDF2] flex flex-wrap gap-3 items-center justify-between">
                      <div className="text-[11px]">
                        <span className="text-[#9AA0AC] block">Lot total</span>
                        <span className="font-extrabold text-[#1A1A2E] text-sm">
                          ৳{(
                            linkedSubOrder.items.reduce(
                              (acc: number, x: any) => acc + ((x.price ?? 0) * (x.quantity ?? 0)),
                              0,
                            ) + (linkedSubOrder.deliveryFee ?? 0)
                          ).toLocaleString()}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => navigate('/order-tracking', { state: { order: linkedOrder } })}
                        className="px-4 py-2 bg-[#F4F7F9] hover:bg-[#FF5B00] hover:text-white border border-[#E5E7EB] hover:border-[#FF5B00] rounded-lg text-[11px] font-bold text-[#4B5563] transition-all flex items-center gap-2 cursor-pointer"
                      >
                        <Truck size={12} />
                        View live tracking
                      </button>
                    </div>
                  </div>
                )}

                {/* Messages */}
                <div className="space-y-4">
                  {activeMessages.map((m) => {
                    const isOutgoing = m.sender === 'user';
                    const isAnnouncementMessage = isAnnouncementsThread || m.sender === 'admin';
                    const senderLabel = isOutgoing
                      ? 'You'
                      : isAnnouncementMessage
                        ? CHOOSIFY_ANNOUNCEMENTS_TITLE
                        : (m.senderName || activeThread?.title || 'Merchant');

                    return (
                      <div
                        key={m.id}
                        className={`flex flex-col max-w-[85%] sm:max-w-[75%] ${
                          isOutgoing ? 'ml-auto items-end' : 'mr-auto items-start'
                        }`}
                      >
                        {m.productCard && (
                          <div className="w-full max-w-sm rounded-[10px] overflow-hidden border border-[#E8EDF2] mb-2 text-left bg-white shadow-sm">
                            <div className="px-4 py-2 border-b border-[#E8EDF2] flex items-center justify-between bg-[#F4F7F9]">
                              <span className="text-[9px] font-bold uppercase text-[#9AA0AC] tracking-wider flex items-center gap-1.5">
                                <Package size={11} className="text-[#FF5B00]" />
                                Sourcing request
                              </span>
                              {(() => {
                                const status = m.productCard.status || 'pending';
                                if (status === 'pending') {
                                  return (
                                    <span className="px-2 py-0.5 text-[9px] font-bold bg-amber-500/10 text-amber-600 rounded-md border border-amber-500/20">
                                      Draft
                                    </span>
                                  );
                                }
                                if (status === 'approved') {
                                  return (
                                    <span className="px-2 py-0.5 text-[9px] font-bold bg-green-500/10 text-green-600 rounded-md border border-green-500/20">
                                      Approved
                                    </span>
                                  );
                                }
                                if (status === 'countered') {
                                  return (
                                    <span className="px-2 py-0.5 text-[9px] font-bold bg-blue-500/10 text-blue-600 rounded-md border border-blue-500/20">
                                      Counter offer
                                    </span>
                                  );
                                }
                                return (
                                  <span className="px-2 py-0.5 text-[9px] font-bold bg-gray-400/10 text-gray-500 rounded-md border border-gray-400/20">
                                    Withdrawn
                                  </span>
                                );
                              })()}
                            </div>

                            <div className="p-4 flex gap-3 items-start">
                              <img
                                src={m.productCard.image || PLACEHOLDER_IMAGE}
                                className="w-16 h-16 rounded-lg object-cover shrink-0 border border-[#E8EDF2] bg-white"
                                alt=""
                                referrerPolicy="no-referrer"
                              />
                              <div className="flex-1 min-w-0">
                                <h4 className="text-xs font-bold text-[#1A1A2E] leading-tight mb-1 line-clamp-2">
                                  {m.productCard.name}
                                </h4>
                                <div className="text-[10px] text-[#9AA0AC] font-medium space-y-0.5">
                                  <p>Variant: <span className="text-[#1A1A2E] font-bold">{m.productCard.variant}</span></p>
                                  <p>Color: <span className="text-[#1A1A2E] font-bold">{m.productCard.color}</span></p>
                                  <p>Qty: <span className="text-[#FF5B00] font-bold">{m.productCard.quantity}</span></p>
                                </div>
                              </div>
                            </div>

                            <div className="px-4 py-3 bg-[#F4F7F9]/80 border-t border-[#E8EDF2] text-[10px]">
                              {m.productCard.notes && (
                                <div className="mb-2 bg-white border border-[#E8EDF2] rounded-lg p-2">
                                  <span className="text-[9px] font-bold text-[#9AA0AC] block mb-0.5">Memo</span>
                                  <p className="text-[#4B5563] font-medium">&ldquo;{m.productCard.notes}&rdquo;</p>
                                </div>
                              )}
                              <div className="flex items-center justify-between pt-1 border-t border-dashed border-[#E5E7EB]">
                                <span className="text-[#9AA0AC] font-medium text-[9px]">Estimated total</span>
                                <div className="text-right">
                                  {m.productCard.status === 'countered' && (
                                    <span className="text-[9px] font-medium line-through text-[#9AA0AC] mr-2 block">
                                      ৳{(m.productCard.price * m.productCard.quantity).toLocaleString()}
                                    </span>
                                  )}
                                  <span className="text-xs font-extrabold text-[#FF5B00] block">
                                    ৳{((m.productCard.counterPrice || m.productCard.price) * m.productCard.quantity).toLocaleString()}
                                  </span>
                                </div>
                              </div>
                            </div>

                            <div className="p-3 bg-[#F4F7F9] border-t border-[#E8EDF2] flex flex-col gap-2">
                              <div className="w-full flex flex-wrap gap-1.5 justify-end">
                                {(m.productCard.status || 'pending') === 'pending' && (
                                  <button
                                    type="button"
                                    onClick={() => {
                                      updateProductCard(m.id, { status: 'canceled' });
                                      addThreadMessage(activeThreadId, `🚫 Buyer has withdrawn the sourcing request for ${m.productCard.name}.`, 'user', 'Me');
                                      toast.success('Sourcing request withdrawn!');
                                    }}
                                    className="px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 rounded-lg text-[9px] font-bold transition-all cursor-pointer"
                                  >
                                    Withdraw
                                  </button>
                                )}
                                {m.productCard.status === 'countered' && (
                                  <>
                                    <button
                                      type="button"
                                      onClick={() => {
                                        updateProductCard(m.id, { status: 'approved', price: m.productCard.counterPrice });
                                        addThreadMessage(activeThreadId, `✅ Buyer accepted the supplier counter offer of BDT ${m.productCard.counterPrice?.toLocaleString()} per unit! Sourcing transaction locked.`, 'user', 'Me');
                                        toast.success('Supplier counter offer accepted! Sourcing order verified.');
                                      }}
                                      className="px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white rounded-lg text-[9px] font-bold transition-all cursor-pointer border-none"
                                    >
                                      Accept counter
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => {
                                        updateProductCard(m.id, { status: 'canceled' });
                                        addThreadMessage(activeThreadId, `❌ Buyer declined the counter offer. Sourcing request cancelled.`, 'user', 'Me');
                                        toast.error('Deal declined.');
                                      }}
                                      className="px-3 py-1.5 bg-white hover:bg-[#F4F7F9] text-[#4B5563] border border-[#E5E7EB] rounded-lg text-[9px] font-bold transition-all cursor-pointer"
                                    >
                                      Decline
                                    </button>
                                  </>
                                )}
                              </div>
                              <div className="flex justify-end pt-1.5 border-t border-[#E8EDF2]">
                                <Link
                                  to={m.productCard.link}
                                  className="px-3 py-1.5 bg-white hover:bg-[#FFF3EC] text-[#4B5563] hover:text-[#FF5B00] border border-[#E5E7EB] text-[9px] font-bold rounded-lg transition-all flex items-center gap-1.5"
                                >
                                  View product <ExternalLink size={10} />
                                </Link>
                              </div>
                            </div>
                          </div>
                        )}

                        <div
                          className={`text-[10.5px] font-medium mb-1 px-1 ${
                            isOutgoing ? 'text-right' : 'text-left'
                          }`}
                        >
                          <span className="text-[#1A1A2E] font-bold">{senderLabel}</span>{' '}
                          <span className="text-[#9AA0AC] font-normal">{m.time}</span>
                        </div>
                        <div
                          className={`px-4 py-3 rounded-[10px] text-[12.5px] font-medium leading-relaxed whitespace-pre-line border
                          ${
                            isOutgoing
                              ? 'bg-white text-[#1A1A2E] border-[#FF5B00]/25 shadow-sm'
                              : isAnnouncementMessage
                                ? 'bg-white text-[#1A1A2E] border-[#000435]/10'
                                : 'bg-white text-[#1A1A2E] border-[#E8EDF2]'
                          }
                        `}
                        >
                          {m.text}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Composer */}
              {!isAnnouncementsThread && (
                <div className="px-5 py-3.5 bg-white border-t border-[#E8EDF2] flex flex-col gap-2.5 shrink-0">
                  <div className="flex flex-wrap gap-2.5">
                    <button
                      type="button"
                      onClick={() => {
                        setModalProdIdx(0);
                        setModalColor('Premium Titanium Silver');
                        setModalVariant('Volumetric Bulk Cargo Container');
                        setModalQuantity(25);
                        setShowSourcingModal(true);
                      }}
                      className="px-3.5 py-1.5 bg-white hover:bg-[#F4F7F9] border border-[#E5E7EB] rounded-2xl text-[11px] font-semibold text-[#4B5563] transition-all flex items-center gap-1.5 cursor-pointer"
                    >
                      <Plus size={12} className="text-[#FF5B00]" />
                      Share sourcing card
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setInputText('Hi! Do you have this specific product variant fully prepared for bulk dispatch?');
                      }}
                      className="px-3.5 py-1.5 bg-white hover:bg-[#F4F7F9] border border-[#E5E7EB] rounded-2xl text-[11px] font-semibold text-[#4B5563] transition-all cursor-pointer"
                    >
                      Check stock
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setInputText('Could we request premium safe wooden-box packaging for the entire lot?');
                      }}
                      className="px-3.5 py-1.5 bg-white hover:bg-[#F4F7F9] border border-[#E5E7EB] rounded-2xl text-[11px] font-semibold text-[#4B5563] transition-all cursor-pointer"
                    >
                      Packaging request
                    </button>
                  </div>

                  <div className="flex gap-2.5 items-center">
                    <input
                      value={inputText}
                      onChange={(e) => setInputText(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                      className="flex-1 h-[42px] bg-white border border-[#E5E7EB] rounded-lg px-3.5 text-[12.5px] font-medium text-[#1A1A2E] placeholder:text-[#9AA0AC] focus:outline-none focus:border-[#FF5B00] transition-all"
                      placeholder="Type your message..."
                    />
                    <button
                      type="button"
                      onClick={handleSendMessage}
                      className="w-[42px] h-[42px] rounded-lg bg-[#FF5B00] text-white flex items-center justify-center hover:bg-[#EB4501] transition-colors shrink-0 cursor-pointer border-none"
                      title="Send message"
                    >
                      <Send size={15} />
                    </button>
                  </div>
                  <div className="text-center text-[10px] text-[#9AA0AC] flex items-center justify-center gap-1">
                    <Lock size={10} />
                    All conversations are encrypted and secure
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-12 text-center max-w-lg mx-auto space-y-3">
              <div className="w-16 h-16 bg-white rounded-full border border-[#E8EDF2] flex items-center justify-center text-[#9AA0AC] mb-2">
                <MessageSquare size={28} />
              </div>
              <h3 className="text-base font-extrabold text-[#1A1A2E]">No conversation selected</h3>
              <p className="text-[11.5px] text-[#9AA0AC] leading-relaxed font-medium">
                Choose a thread from the list to chat with a seller or support.
              </p>
            </div>
          )}
        </main>

        {/* Right rail — xl+ */}
        <MessagesRightRail
          activeThread={activeThread}
          linkedOrder={linkedOrder}
          linkedSubOrder={linkedSubOrder}
          isAnnouncementsThread={isAnnouncementsThread}
          onViewOrder={() => {
            if (linkedOrder) {
              navigate('/order-tracking', { state: { order: linkedOrder } });
            }
          }}
        />
      </div>

      {/* Sourcing modal — logic unchanged */}
      {showSourcingModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-gray-950/65 backdrop-blur-xs">
          <div className="relative bg-white w-full max-w-lg rounded-2xl overflow-hidden shadow-2xl border border-[#E8EDF2] p-6 md:p-8 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-[#E8EDF2] pb-4 mb-6">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-[#FFF3EC] flex items-center justify-center text-[#FF5B00]">
                  <Sparkles size={16} />
                </div>
                <div>
                  <h3 className="text-xs font-extrabold text-[#1A1A2E] leading-none">Share sourcing config</h3>
                  <span className="text-[9px] font-medium text-[#9AA0AC] block mt-0.5">Buyer order request card</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowSourcingModal(false)}
                className="w-8 h-8 rounded-full bg-[#F4F7F9] hover:bg-[#E8EDF2] text-[#9AA0AC] hover:text-[#1A1A2E] flex items-center justify-center transition-colors border-none cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-[9px] font-bold text-[#9AA0AC] tracking-wider block mb-1.5">Product</label>
                <select
                  value={modalProdIdx}
                  onChange={(e) => setModalProdIdx(Number(e.target.value))}
                  className="w-full h-11 px-4 bg-[#F4F7F9] border border-[#E5E7EB] rounded-lg text-xs font-medium text-[#1A1A2E] focus:outline-none focus:border-[#FF5B00]"
                >
                  {PRODUCTS.map((prod, pIdx) => (
                    <option key={prod.id} value={pIdx}>
                      {prod.title} (৳{parseFloat(String(prod.price).replace(/,/g, '')).toLocaleString()})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[9px] font-bold text-[#9AA0AC] tracking-wider block mb-1.5">Variant</label>
                  <input
                    type="text"
                    value={modalVariant}
                    onChange={(e) => setModalVariant(e.target.value)}
                    className="w-full h-11 px-4 bg-[#F4F7F9] border border-[#E5E7EB] rounded-lg text-xs font-medium text-[#1A1A2E] focus:outline-none focus:border-[#FF5B00]"
                    placeholder="e.g. 256GB / 12GB RAM"
                  />
                </div>
                <div>
                  <label className="text-[9px] font-bold text-[#9AA0AC] tracking-wider block mb-1.5">Color</label>
                  <input
                    type="text"
                    value={modalColor}
                    onChange={(e) => setModalColor(e.target.value)}
                    className="w-full h-11 px-4 bg-[#F4F7F9] border border-[#E5E7EB] rounded-lg text-xs font-medium text-[#1A1A2E] focus:outline-none focus:border-[#FF5B00]"
                    placeholder="e.g. Space Gray"
                  />
                </div>
              </div>

              <div>
                <label className="text-[9px] font-bold text-[#9AA0AC] tracking-wider block mb-1.5">Quantity</label>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setModalQuantity(q => Math.max(1, q - 1))}
                    className="w-10 h-10 rounded-lg bg-[#F4F7F9] hover:bg-[#E8EDF2] text-[#1A1A2E] font-bold flex items-center justify-center border-none cursor-pointer"
                  >
                    -
                  </button>
                  <span className="text-sm font-extrabold text-[#1A1A2E] w-12 text-center">{modalQuantity}</span>
                  <button
                    type="button"
                    onClick={() => setModalQuantity(q => q + 1)}
                    className="w-10 h-10 rounded-lg bg-[#F4F7F9] hover:bg-[#E8EDF2] text-[#1A1A2E] font-bold flex items-center justify-center border-none cursor-pointer"
                  >
                    +
                  </button>
                </div>
              </div>

              <div>
                <label className="text-[9px] font-bold text-[#9AA0AC] tracking-wider block mb-1.5">Notes</label>
                <textarea
                  value={modalNotes}
                  onChange={(e) => setModalNotes(e.target.value)}
                  className="w-full p-4 bg-[#F4F7F9] border border-[#E5E7EB] rounded-lg text-xs font-medium text-[#1A1A2E] placeholder:text-[#9AA0AC] focus:outline-none focus:border-[#FF5B00] h-20 resize-none"
                  placeholder="e.g. Request fast dispatch with protective packaging..."
                />
              </div>

              <div className="bg-[#FFF3EC] border border-[#FF5B00]/15 rounded-xl p-4 flex justify-between items-center text-[11px] font-bold">
                <span className="text-[#EB4501]">Sourcing estimate</span>
                <span className="text-sm font-extrabold text-[#FF5B00]">
                  ৳{(parseFloat(String(PRODUCTS[modalProdIdx].price).replace(/,/g, '')) * modalQuantity).toLocaleString()}
                </span>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-[#E8EDF2] flex gap-3 justify-end">
              <button
                type="button"
                onClick={() => setShowSourcingModal(false)}
                className="px-5 py-2.5 bg-[#F4F7F9] hover:bg-[#E8EDF2] rounded-lg text-[10px] font-bold text-[#4B5563] transition-all cursor-pointer border-none"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleCreateSourcingRequest}
                className="px-5 py-2.5 bg-[#FF5B00] hover:bg-[#EB4501] text-white rounded-lg text-[10px] font-bold transition-all cursor-pointer border-none flex items-center gap-1"
              >
                <Sparkles size={12} />
                Confirm & share card
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
