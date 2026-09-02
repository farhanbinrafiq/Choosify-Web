import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useDashboard } from '../context/DashboardContext';
import { useGlobalState } from '../context/GlobalStateContext';
import { PRODUCTS, PLACEHOLDER_IMAGE } from '../constants';
import {
  CHOOSIFY_ANNOUNCEMENTS_THREAD_ID,
  CHOOSIFY_ANNOUNCEMENTS_TITLE,
} from '../lib/announcements';
import {
  EMI_MESSAGES_THREAD_ID,
  EMI_MESSAGES_THREAD_TITLE,
} from '../lib/emiThread';
import { emiPicksToAssociatedEntities } from '../lib/emiCatalogSearch';
import type { EmiCatalogPick } from '../lib/emiCatalogSearch';
import {
  Search, ArrowLeft, Send, MoreVertical, CheckCircle,
  Package, Truck, Clock, MessageCircleMore, LayoutDashboard, CheckSquare,
  X, Sparkles, Megaphone, Lock, AlertTriangle, Flag, Info,
} from 'lucide-react';
import { toast } from '../lib/notify';
import { operationsApi, type ServerBookingOrder } from '../services/operationsApi';
import { MessagesRightRail } from '../components/messages/MessagesRightRail';
import { MobileThreadInfoSheet } from '../components/messages/MobileThreadInfoSheet';
import { ReportConversationProblemModal } from '../components/messages/ReportConversationProblemModal';
import { MessageThreadExchange } from '../components/messages/MessageThreadExchange';
import { SendOrderOfferModal } from '../components/messages/SendOrderOfferModal';
import type { ManualOrderOfferCard } from '../types/manualOrder';
import { EmiChatPanel } from '../components/EmiChatPanel';
import type { BookingOfferCard } from '../types/serviceBooking';
import type { Order } from '../types/schemas';
import { evaluatePostOrderConversationExpiry, resolveOrderForMessageThread } from '../lib/messaging/conversationExpiry';
import { ensureStorefrontSupportThread, isChoosifySupportThread } from '../lib/supportConversation';
import { messagingApi } from '../services/messagingApi';

type ConversationTab = 'all' | 'orders' | 'support' | 'unread';

/** server/booking/bookingService.ts already builds and persists this order (via
 * operationsStore.createOrder) inside accept/buyer-accept — this only mirrors that
 * server order into local state. Never pass the result through addOrder(), which
 * would re-POST it to /operations/orders and create a duplicate. */
function mapServerBookingOrderToClientOrder(serverOrder: ServerBookingOrder): Order {
  return {
    orderId: String(serverOrder.orderId || serverOrder.id),
    buyerId: String(serverOrder.buyerId),
    isCOD: Boolean(serverOrder.isCOD),
    isSplit: Boolean(serverOrder.isSplit),
    overallTotal: Number(serverOrder.overallTotal) || 0,
    subtotal: serverOrder.subtotal,
    deliveryTotal: serverOrder.deliveryTotal,
    paymentMethod: serverOrder.paymentMethod as Order['paymentMethod'],
    subOrders: (serverOrder.subOrders || []).map((sub) => ({
      sellerId: sub.sellerId,
      sellerBusinessName: sub.sellerBusinessName,
      items: (sub.items || []).map((item) => ({
        productId: Number(item.productId) || 0,
        productTitle: item.productTitle,
        quantity: item.quantity,
        price: item.price,
        productType: item.productType,
        serviceCategory: item.serviceCategory,
        serviceDetails: item.serviceDetails,
      })),
      deliveryFee: sub.deliveryFee || 0,
      invoiceId: sub.invoiceId,
      trackingStatus: 'pending' as const,
    })),
    createdAt: serverOrder.createdAt,
    status: serverOrder.status as Order['status'],
    bookingRequestId: serverOrder.bookingRequestId,
    paymentDueAt: serverOrder.paymentDueAt,
  };
}

const ACTIVE_BOOKING_STATUSES = new Set(['pending', 'countered', 'accepted', 'buyer_accepted']);

export function MessagesPage({
  embedded = false,
  initialThreadId,
}: {
  /** Render inside Dashboard shell (keep sidebar; no full-page chrome redirects) */
  embedded?: boolean;
  initialThreadId?: string;
} = {}) {
  const { threadId: routeThreadId } = useParams<{ threadId?: string }>();
  const navigate = useNavigate();
  const {
    threads,
    threadMessages,
    addThreadMessage,
    createNewThread,
    markAllAsRead,
    setThreads,
    setThreadMessages,
    addNotification,
  } = useDashboard();
  const { orders, addClaimedOrder, currentUser } = useGlobalState();
  const [inputText, setInputText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [conversationTab, setConversationTab] = useState<ConversationTab>('all');
  const [localThreadId, setLocalThreadId] = useState<string | undefined>(initialThreadId);

  useEffect(() => {
    if (embedded && initialThreadId) {
      setLocalThreadId(initialThreadId);
    }
  }, [embedded, initialThreadId]);

  const threadId = embedded ? localThreadId : routeThreadId;

  const selectThread = (id: string | undefined) => {
    if (embedded) {
      setLocalThreadId(id);
      return;
    }
    if (id) navigate(`/messages/${id}`);
    else navigate('/messages');
  };

  // Interactive Modal states
  const [showReportModal, setShowReportModal] = useState(false);
  const [showSendOfferModal, setShowSendOfferModal] = useState(false);
  const [showMobileInfo, setShowMobileInfo] = useState(false);
  const [expiryNow, setExpiryNow] = useState(() => Date.now());
  const [focusedAnnouncementId, setFocusedAnnouncementId] = useState<number | null>(null);
  const [announcementSearch, setAnnouncementSearch] = useState('');
  const [focusedEmiMessageId, setFocusedEmiMessageId] = useState<string | null>(null);
  const [emiActiveContent, setEmiActiveContent] = useState<{
    messageId: string;
    picks: EmiCatalogPick[];
    excerpt: string;
  } | null>(null);

  const handleEmiActiveContentChange = useCallback(
    (payload: { messageId: string; picks: EmiCatalogPick[]; excerpt: string } | null) => {
      setEmiActiveContent(payload);
    },
    [],
  );

  const emiRailEntities = useMemo(
    () => emiPicksToAssociatedEntities(emiActiveContent?.picks),
    [emiActiveContent?.picks],
  );

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
  const isEmiThread = activeThread?.id === EMI_MESSAGES_THREAD_ID;

  // Auto-mark active thread as read (only when selection changes — not on every threads update)
  useEffect(() => {
    if (!activeThreadId) return;
    setThreads((prev) => {
      const active = prev.find((t) => t.id === activeThreadId);
      if (!active?.unread) return prev;
      return prev.map((t) => (t.id === activeThreadId ? { ...t, unread: false } : t));
    });
  }, [activeThreadId, setThreads]);

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
    setShowMobileInfo(false);
  }, [threadId]);

  // Thread-open: fetch platform inbox history (conv_platform_<buyerId>). Booking-offer poll below is separate.
  useEffect(() => {
    if (!activeThreadId) return;
    if (
      activeThreadId === CHOOSIFY_ANNOUNCEMENTS_THREAD_ID ||
      activeThreadId === EMI_MESSAGES_THREAD_ID
    ) {
      return;
    }
    if (!currentUser?.id || !localStorage.getItem('choosify_auth_token')) return;
    let cancelled = false;

    const formatTime = (iso: string) => {
      try {
        return new Date(iso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      } catch {
        return '';
      }
    };

    if (isChoosifySupportThread(activeThread)) {
      (async () => {
        try {
          const rows = await messagingApi.listSupportMessages(activeThreadId);
          if (cancelled || !Array.isArray(rows) || !rows.length) return;
          setThreadMessages((prev) => {
            const mapped = rows.map((row, index) => {
              const timestamp = String(row.createdAt || new Date().toISOString());
              const isUser = row.senderRole !== 'admin' && row.senderRole !== 'system';
              return {
                id: index + 1,
                serverId: String(row.id),
                threadId: activeThreadId,
                text: String(row.body || ''),
                sender: (isUser ? 'user' : 'other') as 'user' | 'other',
                senderName: isUser ? 'Me' : 'Choosify Support',
                time: formatTime(timestamp),
                createdAt: timestamp,
                status: (isUser ? 'delivered' : undefined) as 'delivered' | undefined,
              };
            });
            const serverIds = new Set(mapped.map((m) => m.serverId));
            const kept = prev.filter(
              (m) =>
                m.threadId !== activeThreadId ||
                (m.serverId && serverIds.has(m.serverId)),
            );
            return [...kept, ...mapped] as typeof prev;
          });
        } catch {
          /* keep local history if API unreachable */
        }
      })();
      return () => {
        cancelled = true;
      };
    }

    (async () => {
      try {
        const result = await operationsApi.listPlatformMessages({ userId: currentUser.id });
        if (cancelled) return;
        const rows = Array.isArray(result.data) ? result.data : [];
        if (!rows.length) return;

        setThreadMessages((prev) => {
          const mapped = rows.map((row) => {
            const content = (row.content || {}) as { body?: string };
            const rawBody = String(content.body || '');
            const orderMatch = rawBody.match(/^\[Order\s+([^\]]+)\]/i);
            const complaintThread = rawBody.match(/\[Complaint[^\]]*·\s*thread\s+([^\s\]]+)/i);
            let threadId = 'thread-general';
            if (complaintThread?.[1]) threadId = complaintThread[1];
            else if (orderMatch?.[1]) {
              const orderId = orderMatch[1].trim();
              const byRef = threads.find((t) => t.orderRef === orderId);
              threadId = byRef?.id || activeThreadId;
            } else if (row.bookingOffer) {
              threadId = activeThreadId;
            }
            const text = rawBody
              .replace(/^\[Order\s+[^\]]+\]\s*/i, '')
              .replace(/^\[Complaint[^\]]*\]\s*/i, '')
              .trim();
            const timestamp = String(row.timestamp || new Date().toISOString());
            const serverId = String(row.id || `m_plat_${timestamp}`);
            const isBuyer = row.direction === 'inbound';
            let hash = 0;
            for (let i = 0; i < serverId.length; i += 1) {
              hash = (Math.imul(31, hash) + serverId.charCodeAt(i)) | 0;
            }
            return {
              id: Math.abs(hash) || Date.now(),
              serverId,
              threadId,
              text: text || rawBody,
              sender: (isBuyer ? 'user' : 'other') as 'user' | 'other',
              senderName: isBuyer ? 'Me' : String(row.senderName || 'Support'),
              time: formatTime(timestamp),
              createdAt: timestamp,
              bookingOffer: row.bookingOffer as import('../types/serviceBooking').BookingOfferCard | undefined,
              status: (isBuyer ? 'delivered' : undefined) as 'delivered' | undefined,
            };
          });

          const serverIds = new Set(mapped.map((m) => m.serverId));
          const kept = prev.filter((m) => {
            if (
              m.threadId === CHOOSIFY_ANNOUNCEMENTS_THREAD_ID ||
              m.threadId === EMI_MESSAGES_THREAD_ID
            ) {
              return true;
            }
            if (m.serverId) return serverIds.has(m.serverId);
            if (mapped.length && m.threadId === 'thread-general' && !m.serverId && !m.bookingOffer) {
              return false;
            }
            return true;
          });
          const byKey = new Map<string, (typeof mapped)[number] | (typeof prev)[number]>();
          for (const m of kept) byKey.set(m.serverId || `local-${m.id}`, m);
          for (const m of mapped) byKey.set(m.serverId || `local-${m.id}`, m);
          return Array.from(byKey.values()) as typeof prev;
        });
      } catch {
        // Keep local history if API unreachable.
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [activeThreadId, activeThread, currentUser.id, setThreadMessages, threads]);

  useEffect(() => {
    const viewport = chatViewportRef.current;
    if (!viewport) return;
    viewport.scrollTop = viewport.scrollHeight;
  }, [activeMessages, activeThreadId]);

  // Find linked order for active thread (orderRef, bookingRequestId, or seller thread match)
  const linkedOrder = useMemo(
    () => resolveOrderForMessageThread(activeThread, orders) as Order | null,
    [activeThread, orders],
  );

  // Backfill orderRef on retail threads so inbox badges and deep-links stay consistent
  useEffect(() => {
    setThreads((prev) => {
      let changed = false;
      const next = prev.map((t) => {
        if (t.orderRef || t.type === 'announcement' || t.id === EMI_MESSAGES_THREAD_ID) return t;
        const order = resolveOrderForMessageThread(t, orders);
        if (!order?.orderId) return t;
        changed = true;
        return { ...t, orderRef: order.orderId };
      });
      return changed ? next : prev;
    });
  }, [orders, setThreads]);

  // Find specific sub-order for active thread seller
  const linkedSubOrder = linkedOrder?.subOrders.find(sub => {
    // Check if thread ID contains seller ID
    const sellerId = activeThreadId?.replace(/^thread-/, '').replace(/^seller-/, '');
    return sub.sellerId === sellerId || sub.sellerId === `seller-${sellerId}`;
  }) || linkedOrder?.subOrders[0];

  const conversationExpiry = useMemo(
    () => evaluatePostOrderConversationExpiry(linkedOrder, expiryNow),
    [linkedOrder, expiryNow],
  );
  const isConversationClosed = conversationExpiry.status === 'closed';
  const showFreezeNotice =
    !isAnnouncementsThread &&
    !isEmiThread &&
    conversationExpiry.status === 'open' &&
    Boolean(conversationExpiry.freezeNotice);
  const showExpiryWarning =
    !isAnnouncementsThread &&
    !isEmiThread &&
    conversationExpiry.status === 'open' &&
    Boolean(conversationExpiry.showWarning);

  const announcementMessages = useMemo(
    () =>
      isAnnouncementsThread
        ? activeMessages.filter((m) => m.threadId === CHOOSIFY_ANNOUNCEMENTS_THREAD_ID)
        : [],
    [isAnnouncementsThread, activeMessages],
  );

  const focusedAnnouncement = useMemo(() => {
    if (!isAnnouncementsThread) return null;
    if (focusedAnnouncementId != null) {
      const selected = announcementMessages.find((m) => m.id === focusedAnnouncementId);
      if (selected) return selected;
    }
    const withEntity = [...announcementMessages].reverse().find((m) => m.associatedEntity);
    return withEntity || announcementMessages[announcementMessages.length - 1] || null;
  }, [isAnnouncementsThread, focusedAnnouncementId, announcementMessages]);

  useEffect(() => {
    if (!isAnnouncementsThread) {
      setFocusedAnnouncementId(null);
      setAnnouncementSearch('');
      return;
    }
    setFocusedAnnouncementId((current) => {
      if (current != null && announcementMessages.some((m) => m.id === current)) return current;
      const withEntity = [...announcementMessages].reverse().find((m) => m.associatedEntity);
      return withEntity?.id ?? announcementMessages[announcementMessages.length - 1]?.id ?? null;
    });
  }, [isAnnouncementsThread, activeThreadId, announcementMessages]);

  useEffect(() => {
    if (!isEmiThread) {
      setFocusedEmiMessageId(null);
      setEmiActiveContent(null);
    }
  }, [isEmiThread, activeThreadId]);

  const announcementSearchQuery = announcementSearch.trim().toLowerCase();
  const visibleMessages = useMemo(() => {
    if (!isAnnouncementsThread || !announcementSearchQuery) return activeMessages;
    return activeMessages.filter((m) => {
      const haystack = [
        m.text,
        m.associatedEntity?.title,
        m.associatedEntity?.subtitle,
        m.associatedEntity?.type,
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();
      return haystack.includes(announcementSearchQuery);
    });
  }, [isAnnouncementsThread, activeMessages, announcementSearchQuery]);

  useEffect(() => {
    if (!isAnnouncementsThread || !announcementSearchQuery || visibleMessages.length === 0) return;
    const firstId = visibleMessages[0]?.id;
    if (firstId == null) return;
    setFocusedAnnouncementId(firstId);
    const el = document.getElementById(`msg-${firstId}`);
    el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }, [isAnnouncementsThread, announcementSearchQuery, visibleMessages]);
  useEffect(() => {
    if (!linkedOrder || isAnnouncementsThread || isEmiThread) return;
    const timer = window.setInterval(() => setExpiryNow(Date.now()), 60_000);
    return () => window.clearInterval(timer);
  }, [linkedOrder, isAnnouncementsThread, isEmiThread]);

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

  /** Renders the resulting message bubble from a server response — no longer the
   * state-mutation path itself. `freshCard` must be the server's own BookingOfferCard
   * (result.data), not a client-synthesized version bump. */
  const applyServerOffer = (
    freshCard: BookingOfferCard,
    sender: 'user' | 'seller',
    text: string,
  ) => {
    if (!activeThreadId) return;
    addThreadMessage(
      activeThreadId,
      text,
      sender,
      sender === 'user' ? 'Me' : freshCard.sellerName,
      undefined,
      freshCard,
    );
  };

  /** Passive sync from the booking poll below — updates the offer card in place
   * without posting a new message bubble (the four action handlers below already
   * narrate their own actions via applyServerOffer). Only moves forward: a stale
   * poll response can never roll back a newer local version. */
  const reconcileBookingOffer = useCallback(
    (freshCard: BookingOfferCard) => {
      setThreadMessages((prev) => {
        let latestIdx = -1;
        let latestVersion = -1;
        prev.forEach((m, idx) => {
          if (m.bookingOffer?.requestId === freshCard.requestId && m.bookingOffer.version > latestVersion) {
            latestVersion = m.bookingOffer.version;
            latestIdx = idx;
          }
        });
        if (latestIdx === -1 || latestVersion >= freshCard.version) return prev;
        const next = [...prev];
        next[latestIdx] = { ...next[latestIdx], bookingOffer: freshCard };
        return next;
      });
    },
    [setThreadMessages],
  );

  const acceptBookingOffer = async (offer: BookingOfferCard) => {
    if (offer.orderId || orders.some((order) => order.bookingRequestId === offer.requestId)) {
      toast('A pending order already exists for this request.');
      return;
    }
    try {
      const result = await operationsApi.buyerAcceptCounter(offer.requestId, currentUser.id);
      const order = mapServerBookingOrderToClientOrder(result.order);
      addClaimedOrder(order);
      if (activeThreadId) {
        setThreads((prev) =>
          prev.map((t) =>
            t.id === activeThreadId ? { ...t, orderRef: order.orderId, type: 'retail' as const } : t,
          ),
        );
      }
      applyServerOffer(
        result.data,
        'user',
        `Offer accepted. Pending order ${order.orderId} was created; payment is due within 8 hours.`,
      );
      addNotification(
        `You accepted ${offer.sellerName}'s offer. Complete payment for ${order.orderId} within 8 hours.`,
        'order',
      );
      window.dispatchEvent(
        new CustomEvent('choosify-booking-buyer-accepted', {
          detail: { requestId: offer.requestId, orderId: order.orderId, sellerId: offer.sellerId },
        }),
      );
      // Server-side buyerAcceptCounter notifies the seller directly (Sprint 9).
      toast.success('Offer accepted. Pending payment order created.');
    } catch (err) {
      toast.error((err as Error)?.message || 'Failed to accept this offer. Try again.');
    }
  };

  const declineBookingOffer = async (offer: BookingOfferCard) => {
    try {
      const result = await operationsApi.buyerDeclineBookingRequest(offer.requestId, currentUser.id);
      applyServerOffer(result.data, 'user', `Buyer declined offer version ${offer.version}.`);
      toast.success('Offer declined.');
    } catch (err) {
      toast.error((err as Error)?.message || 'Failed to decline this offer. Try again.');
    }
  };

  const acceptOrderOffer = async (offer: ManualOrderOfferCard) => {
    if (!activeThreadId) return;
    try {
      const result = await operationsApi.acceptManualOrderOffer(offer.offerId);
      const orderId = (result.order as { orderId?: string })?.orderId || result.data.orderId;
      addThreadMessage(
        activeThreadId,
        `Offer accepted — order ${orderId} created.`,
        'user',
        'Me',
        undefined,
        undefined,
        result.data,
      );
      toast.success('Offer accepted — order created.');
    } catch (err) {
      toast.error((err as Error)?.message || 'Failed to accept this offer. Try again.');
    }
  };

  const rejectOrderOffer = async (offer: ManualOrderOfferCard) => {
    if (!activeThreadId) return;
    try {
      const result = await operationsApi.rejectManualOrderOffer(offer.offerId);
      addThreadMessage(activeThreadId, 'Offer rejected.', 'user', 'Me', undefined, undefined, result.data);
      toast.success('Offer rejected.');
    } catch (err) {
      toast.error((err as Error)?.message || 'Failed to reject this offer. Try again.');
    }
  };

  const sellerRespondToOffer = async (
    offer: BookingOfferCard,
    action: 'accept' | 'decline' | 'counter',
  ) => {
    if (action === 'decline') {
      const reason = window.prompt('Decline reason (required):')?.trim();
      if (!reason) {
        toast.error('A decline reason is required.');
        return;
      }
      try {
        const result = await operationsApi.declineBookingRequest(
          offer.requestId,
          currentUser.id,
          currentUser.name,
          reason,
        );
        applyServerOffer(result.data, 'seller', `Seller declined this request: ${reason}`);
        addNotification(`${offer.sellerName} declined your request: ${reason}`, 'message');
        // Server-side declineBookingRequest notifies the buyer directly (Sprint 9).
      } catch (err) {
        toast.error((err as Error)?.message || 'Failed to decline this booking request.');
      }
      return;
    }

    if (action === 'counter') {
      const entered = window.prompt('Enter modified total price (BDT):', String(offer.price));
      const price = Number(entered);
      if (!Number.isFinite(price) || price <= 0) {
        toast.error('Enter a valid counter-offer price.');
        return;
      }
      const modifiedDetails = window
        .prompt(
          'Describe any modified booking details (optional):',
          String(offer.fields.sellerModification || ''),
        )
        ?.trim();
      try {
        const result = await operationsApi.counterBookingRequest(
          offer.requestId,
          currentUser.id,
          currentUser.name,
          {
            price,
            fields: modifiedDetails ? { sellerModification: modifiedDetails } : undefined,
          },
        );
        applyServerOffer(
          result.data,
          'seller',
          `Seller sent a modified offer of BDT ${price.toLocaleString()}.`,
        );
        addNotification(
          `${offer.sellerName} sent a counter-offer of BDT ${price.toLocaleString()}.`,
          'message',
        );
        // Server-side counterBookingRequest notifies the buyer directly (Sprint 9).
      } catch (err) {
        toast.error((err as Error)?.message || 'Failed to send counter-offer.');
      }
      return;
    }

    try {
      const result = await operationsApi.acceptBookingRequest(offer.requestId, currentUser.id, currentUser.name);
      const order = mapServerBookingOrderToClientOrder(result.order);
      addClaimedOrder(order);
      applyServerOffer(
        result.data,
        'seller',
        'Seller accepted this request. Complete payment within 8 hours.',
      );
      addNotification(
        `${offer.sellerName} accepted your request. You have 8 hours to complete payment.`,
        'message',
      );
      // Server-side acceptBookingRequest notifies the buyer directly (Sprint 9).
    } catch (err) {
      toast.error((err as Error)?.message || 'Failed to accept this booking request.');
    }
  };

  // Neither side has a way to learn the other responded without this: poll the canonical
  // booking request while its thread is open and the offer is still in an active (non-terminal)
  // status, and reconcile local state if the server has moved past what's shown. This is an
  // intentional MVP tradeoff, not the final answer — real-time infra (SSE/websocket) would
  // replace it, but that's out of scope for this batch.
  const activeBookingOffer = useMemo(() => {
    let latest: BookingOfferCard | null = null;
    for (const m of activeMessages) {
      if (m.bookingOffer && (!latest || m.bookingOffer.version > latest.version)) {
        latest = m.bookingOffer;
      }
    }
    return latest;
  }, [activeMessages]);

  useEffect(() => {
    if (!activeBookingOffer || !ACTIVE_BOOKING_STATUSES.has(activeBookingOffer.status)) return;
    const requestId = activeBookingOffer.requestId;
    let cancelled = false;
    const poll = async () => {
      try {
        const fresh = await operationsApi.getBookingRequest(requestId);
        if (!cancelled) reconcileBookingOffer(fresh);
      } catch {
        // Transient network errors are fine to swallow on a background poll — next tick retries.
      }
    };
    poll();
    const interval = window.setInterval(poll, 18000);
    return () => {
      cancelled = true;
      window.clearInterval(interval);
    };
  }, [activeBookingOffer?.requestId, activeBookingOffer?.status, reconcileBookingOffer]);

  const handleSendMessage = async () => {
    if (!inputText.trim() || !activeThreadId || isAnnouncementsThread || isEmiThread) return;
    if (isConversationClosed) {
      toast.error(conversationExpiry.closedLabel || 'This conversation has ended');
      return;
    }

    const userMsg = inputText.trim();
    setInputText('');

    if (isChoosifySupportThread(activeThread)) {
      try {
        await messagingApi.sendSupportMessage(activeThreadId, userMsg);
      } catch (err) {
        toast.error((err as Error)?.message || 'Could not send support message.');
        return;
      }
      addThreadMessage(activeThreadId, userMsg, 'user', 'Me');
      return;
    }

    try {
      await operationsApi.submitPlatformMessage({
        buyerId: currentUser.id || 'user-standard',
        userName: currentUser.name || 'Me',
        body: userMsg,
        orderId: linkedOrder?.orderId || activeThread?.orderRef,
        conversationId: activeThreadId,
        orderSnapshot: linkedOrder
          ? {
              orderId: linkedOrder.orderId,
              status: linkedOrder.status,
              cancelledAt: linkedOrder.cancelledAt,
              subOrders: linkedOrder.subOrders?.map((sub) => ({
                trackingStatus: sub.trackingStatus,
                items: sub.items?.map((item) => ({
                  productType: item.productType,
                  serviceCategory: item.serviceCategory,
                  serviceDetails: item.serviceDetails,
                })),
              })),
            }
          : undefined,
      });
    } catch (err) {
      const code = (err as Error & { code?: string })?.code;
      if (code === 'CONVERSATION_EXPIRED') {
        toast.error((err as Error).message || 'This conversation has ended');
        return;
      }
      // Soft-fail when API unreachable; local expiry gate already applied above.
    }

    addThreadMessage(activeThreadId, userMsg, 'user', 'Me');
  };

  const handleNewConversation = async () => {
    const opened = await ensureStorefrontSupportThread({
      createNewThread,
      selectThread,
    });
    if (opened?.conversationId) {
      setConversationTab('support');
    }
  };

  const handleMarkAllAsRead = () => {
    const hadUnread = threads.some((t) => t.unread === true);
    markAllAsRead();
    if (hadUnread) {
      toast.success('All conversations marked as read');
    } else {
      toast.success('All conversations are already read');
    }
  };

  const tabs: { id: ConversationTab; label: string; count: number }[] = [
    { id: 'all', label: 'All', count: tabCounts.all },
    { id: 'orders', label: 'Orders', count: tabCounts.orders },
    { id: 'support', label: 'Support', count: tabCounts.support },
    { id: 'unread', label: 'Unread', count: tabCounts.unread },
  ];

  return (
    <div
      className={
        embedded
          ? 'flex flex-col bg-transparent text-[#1A1A2E] h-[min(720px,calc(100dvh-10rem))] max-h-[calc(100dvh-10rem)] overflow-hidden rounded-[10px] border border-[#E8EDF2] bg-white'
          : 'flex flex-col bg-choosify-feed text-[#1A1A2E] h-[calc(100dvh-var(--choosify-navbar-height,4rem))] max-h-[calc(100dvh-var(--choosify-navbar-height,4rem))] overflow-hidden'
      }
    >
      {/* Compact Inbox toolbar — replaces the old dark hero to give the
          conversation workspace more vertical room. Presentation only.
          Hidden on mobile once a thread is open (thread header takes over). */}
      {!embedded && (
      <div
        className={`w-full shrink-0 border-b border-[#E8EDF2] bg-white ${threadId ? 'hidden md:block' : ''}`}
      >
        <div className="max-w-[1400px] mx-auto w-full px-5 sm:px-10 h-[64px] flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <button
              type="button"
              onClick={() => {
                if (threadId && window.innerWidth < 768) {
                  selectThread(undefined);
                } else {
                  navigate('/dashboard');
                }
              }}
              className="w-8 h-8 rounded-lg border border-[#E8EDF2] flex items-center justify-center text-[#4B5563] hover:text-[#1A1A2E] hover:border-[#FF5B00]/40 transition-colors bg-white cursor-pointer shrink-0"
              aria-label="Back"
            >
              <ArrowLeft size={15} />
            </button>
            <div className="min-w-0">
              <h1 className="text-[15px] font-extrabold text-[#1A1A2E] leading-tight tracking-tight m-0">
                Messages
              </h1>
              <p className="hidden sm:block text-[11px] text-[#9AA0AC] leading-tight m-0 mt-0.5">
                Customer support &amp; order conversations
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={handleMarkAllAsRead}
              disabled={tabCounts.unread === 0}
              className="hidden sm:inline-flex items-center gap-1.5 px-2.5 h-8 rounded-lg text-[11px] font-bold transition-colors text-[#9AA0AC] hover:text-[#1A1A2E] disabled:opacity-40 disabled:cursor-default cursor-pointer bg-transparent border-none"
              title="Mark all conversations as read"
            >
              <CheckSquare size={12} />
              Mark all as read
            </button>
            <Link
              to="/dashboard"
              state={{ activeTab: 'overview' }}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 h-8 rounded-lg text-[11px] font-bold text-[#1A1A2E] border border-[#E8EDF2] hover:border-[#FF5B00]/40 transition-colors no-underline"
            >
              <LayoutDashboard size={12} className="text-[#FF5B00]" />
              Dashboard
            </Link>
            <Link
              to="/dashboard"
              state={{ activeTab: 'orders' }}
              className="inline-flex items-center gap-1.5 px-3 h-8 rounded-lg text-[11px] font-bold text-white bg-[#FF5B00] hover:bg-[#EF3C23] transition-colors no-underline"
            >
              <Package size={12} />
              My Orders
            </Link>
          </div>
        </div>
      </div>
      )}

      {embedded && (
        <div className="px-4 py-3 border-b border-[#E8EDF2] bg-white shrink-0 flex items-center justify-between gap-3">
          <div className="min-w-0">
            <h2 className="text-[15px] font-extrabold text-[#1A1A2E] tracking-tight">Messages</h2>
            <p className="text-[11.5px] text-[#9AA0AC]">Buyer and seller conversations</p>
          </div>
          <button
            type="button"
            onClick={handleMarkAllAsRead}
            className="px-3 py-2 rounded-lg text-[11px] font-bold transition-all flex items-center gap-1.5 border border-[#E8EDF2] bg-[#F4F7F9] text-[#1A1A2E] cursor-pointer hover:border-[#FF5B00]/40"
            title="Mark all conversations as read"
          >
            <CheckSquare size={12} />
            Mark all as read
          </button>
        </div>
      )}

      {/* 3-column shell: list | chat | rail */}
      <div className={`flex flex-1 min-h-0 overflow-hidden w-full mx-auto ${embedded ? '' : 'max-w-[1400px]'}`}>
        {/* Sidebar: conversation list (~300px) */}
        <aside
          className={`w-full md:w-[300px] bg-white border-r border-[#E8EDF2] flex flex-col shrink-0 min-h-0 ${
            threadId ? 'hidden md:flex' : 'flex'
          }`}
        >
          <div className="p-4 border-b border-[#E8EDF2] space-y-3 bg-white shrink-0">
            <div className="flex flex-col gap-2">
              <span className="text-[11px] font-extrabold text-[#9AA0AC] tracking-[0.4px]">
                Your conversations
              </span>
              <button
                type="button"
                onClick={handleNewConversation}
                className="w-full box-border px-3 py-2 rounded-lg bg-[#FF5B00] text-white flex items-center justify-center gap-1.5 text-[10.5px] font-bold border-none cursor-pointer hover:bg-[#EF3C23] transition-colors"
                title="Start a new conversation with Choosify Support"
              >
                <MessageCircleMore size={12} strokeWidth={2.5} />
                Contact Support
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
                const threadExpiry = evaluatePostOrderConversationExpiry(
                  resolveOrderForMessageThread(t, orders),
                  expiryNow,
                );
                const threadHasFreeze =
                  threadExpiry.status === 'open' && Boolean(threadExpiry.freezeNotice);
                const threadUrgent =
                  threadExpiry.status === 'open' && Boolean(threadExpiry.showWarning);
                const threadClosed = threadExpiry.status === 'closed';
                return (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => selectThread(t.id)}
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
                        {t.id === EMI_MESSAGES_THREAD_ID && (
                          <span className="inline-flex text-[9px] font-bold bg-[#FFF3EC] text-[#FF5B00] px-2 py-0.5 rounded">
                            Emi AI
                          </span>
                        )}
                        {t.type === 'announcement' && (
                          <span className="inline-flex text-[9px] font-bold bg-[#F1F1F3] text-[#4B5563] px-2 py-0.5 rounded">
                            Broadcast
                          </span>
                        )}
                        {t.orderRef && (
                          <span className="inline-flex text-[9px] font-bold bg-[#FFF3EC] text-[#FF5B00] px-2 py-0.5 rounded-xl">
                            ORDER: {t.orderRef}
                          </span>
                        )}
                        {threadUrgent && (
                          <span className="inline-flex items-center gap-0.5 text-[9px] font-bold bg-amber-50 text-amber-800 px-2 py-0.5 rounded">
                            <AlertTriangle size={9} />
                            Closes soon
                          </span>
                        )}
                        {!threadUrgent && threadHasFreeze && (
                          <span className="inline-flex items-center gap-0.5 text-[9px] font-bold bg-[#F4F7F9] text-[#4B5563] px-2 py-0.5 rounded">
                            <Clock size={9} />
                            Has freeze
                          </span>
                        )}
                        {threadClosed && (
                          <span className="inline-flex items-center gap-0.5 text-[9px] font-bold bg-[#F1F1F3] text-[#9AA0AC] px-2 py-0.5 rounded">
                            <Lock size={9} />
                            Closed
                          </span>
                        )}
                        {!t.orderRef && t.type === 'general' && t.id !== EMI_MESSAGES_THREAD_ID && (
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
          className={`flex-1 flex flex-col bg-choosify-feed min-h-0 min-w-0 ${
            threadId ? 'flex' : 'hidden md:flex'
          }`}
        >
          {activeThread ? (
            <>
              {/* Thread header — clean, WhatsApp-style: back arrow + avatar + name on mobile, info icon opens bottom sheet */}
              <div className="px-4 sm:px-5 py-3 sm:py-3.5 border-b border-[#E8EDF2] bg-white flex items-center justify-between gap-3 shrink-0">
                <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
                  <button
                    type="button"
                    onClick={() => selectThread(undefined)}
                    className="md:hidden shrink-0 w-8 h-8 -ml-1 flex items-center justify-center text-[#1A1A2E] bg-transparent border-none cursor-pointer"
                    aria-label="Back to messages"
                  >
                    <ArrowLeft size={19} />
                  </button>
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
                        Platform updates
                      </span>
                    ) : isEmiThread ? (
                      <span className="text-[10.5px] font-medium text-[#4B5563] flex items-center gap-1">
                        <Sparkles size={10} className="text-[#FF5B00]" />
                        Shopping assistant
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
                    <span className="hidden sm:inline-flex bg-[#FFF3EC] text-[#FF5B00] text-[10px] font-bold px-2.5 py-1 rounded-xl">
                      ORDER: {activeThread.orderRef}
                    </span>
                  )}
                  {!isEmiThread && (
                    <button
                      type="button"
                      onClick={() => setShowReportModal(true)}
                      className="hidden sm:inline-flex items-center gap-1.5 h-9 px-2.5 rounded-lg bg-[#F4F7F9] border border-[#E8EDF2] text-[11px] font-bold text-[#4B5563] hover:text-[#FF5B00] hover:border-[#FF5B00]/30 cursor-pointer"
                      title="Report to Support"
                    >
                      <Flag size={13} />
                      Report to Support
                    </button>
                  )}
                  {!isAnnouncementsThread && !isEmiThread && (
                    <button
                      type="button"
                      onClick={() => setShowMobileInfo(true)}
                      className="xl:hidden w-9 h-9 rounded-lg bg-[#F4F7F9] flex items-center justify-center text-[#9AA0AC] hover:text-[#1A1A2E] transition-colors border-none cursor-pointer"
                      title="Conversation info"
                      aria-label="Conversation info"
                    >
                      <Info size={16} />
                    </button>
                  )}
                  <button
                    type="button"
                    className="hidden md:flex w-9 h-9 rounded-lg bg-[#F4F7F9] items-center justify-center text-[#9AA0AC] hover:text-[#1A1A2E] transition-colors border-none cursor-pointer"
                    title="Thread options"
                  >
                    <MoreVertical size={14} />
                  </button>
                </div>
              </div>

              {/* Chat viewport — Emi AI embeds the full assistant inside Messages */}
              {isEmiThread ? (
                <div className="flex-1 min-h-0 overflow-hidden flex flex-col bg-white">
                  <EmiChatPanel
                    variant="page"
                    className="h-full border-0 rounded-none shadow-none"
                    focusedMessageId={focusedEmiMessageId}
                    onFocusMessage={setFocusedEmiMessageId}
                    onActiveContentChange={handleEmiActiveContentChange}
                  />
                </div>
              ) : (
              <>
              <div
                ref={chatViewportRef}
                className="flex-1 p-5 overflow-y-auto space-y-4 no-scrollbar relative min-h-0 bg-choosify-feed"
              >
                {showFreezeNotice && conversationExpiry.freezeNotice && (
                  <div className="max-w-2xl mx-auto bg-[#F4F7F9] border border-[#E8EDF2] rounded-[10px] p-3.5 flex items-start gap-3">
                    <Clock size={16} className="text-[#6B7280] shrink-0 mt-0.5" />
                    <div>
                      <p className="text-[12px] font-bold text-[#1A1A2E]">Conversation freeze</p>
                      <p className="text-[11.5px] text-[#4B5563] mt-0.5 leading-snug">
                        {conversationExpiry.freezeNotice}
                      </p>
                    </div>
                  </div>
                )}

                {showExpiryWarning && conversationExpiry.warningLabel && (
                  <div className="max-w-2xl mx-auto bg-amber-50 border border-amber-200 rounded-[10px] p-3.5 flex items-start gap-3">
                    <AlertTriangle size={16} className="text-amber-600 shrink-0 mt-0.5" />
                    <p className="text-[12px] font-semibold text-amber-800 leading-snug">
                      {conversationExpiry.warningLabel}
                    </p>
                  </div>
                )}

                {isConversationClosed && (
                  <div className="max-w-2xl mx-auto bg-[#F4F7F9] border border-[#E8EDF2] rounded-[10px] p-3.5 flex items-start gap-3">
                    <Lock size={16} className="text-[#9AA0AC] shrink-0 mt-0.5" />
                    <div>
                      <p className="text-[12.5px] font-bold text-[#1A1A2E]">
                        {conversationExpiry.closedLabel || 'This conversation has ended'}
                      </p>
                      <p className="text-[11.5px] text-[#9AA0AC] mt-0.5 leading-snug">
                        Message history stays available. New replies are closed
                        {conversationExpiry.reason === 'delivered'
                          ? ' because the order was delivered.'
                          : conversationExpiry.reason === 'cancelled'
                            ? ' because the order was cancelled.'
                            : conversationExpiry.reason === 'service_date_passed'
                              ? ' after the service date ended (11:59 PM Bangladesh time).'
                              : '.'}{' '}
                        Need help? Use Report to Support.
                      </p>
                    </div>
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
                        ${linkedSubOrder.trackingStatus === 'pending' ? 'bg-[#FFF3EC] text-[#FF5B00]' : ''}
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
                        className="px-4 py-2 bg-[#F4F7F9] hover:bg-[#EF3C23] hover:text-white border border-[#E5E7EB] hover:border-[#FF5B00] rounded-lg text-[11px] font-bold text-[#4B5563] transition-all flex items-center gap-2 cursor-pointer"
                      >
                        <Truck size={12} />
                        View live tracking
                      </button>
                    </div>
                  </div>
                )}

                {currentUser.role === 'seller' && activeThreadId && !isAnnouncementsThread && !isEmiThread && (
                  <div className="max-w-2xl mx-auto w-full flex justify-end mb-2">
                    <button
                      type="button"
                      onClick={() => setShowSendOfferModal(true)}
                      className="px-3 py-1.5 bg-white hover:bg-[#FFF3EC] text-[#4B5563] hover:text-[#EF3C23] border border-[#E5E7EB] hover:border-[#FF5B00] rounded-lg text-[11px] font-bold transition-all cursor-pointer"
                    >
                      + Send Order Offer
                    </button>
                  </div>
                )}

                {/* Messages — Messenger-style exchange */}
                <div className="max-w-2xl mx-auto w-full">
                  {isAnnouncementsThread && announcementSearchQuery && visibleMessages.length === 0 && (
                    <div className="py-10 text-center text-[12.5px] font-medium text-[#9AA0AC]">
                      No announcements match “{announcementSearch.trim()}”
                    </div>
                  )}
                  <MessageThreadExchange
                    messages={visibleMessages}
                    isAnnouncementsThread={isAnnouncementsThread}
                    focusedAnnouncementId={focusedAnnouncementId}
                    onFocusAnnouncement={setFocusedAnnouncementId}
                    currentUserAvatar={currentUser.avatar}
                    peerAvatar={activeThread?.avatar}
                    viewerIsSeller={currentUser.role === 'seller'}
                    showSellerBookingActions={currentUser.role === 'seller'}
                    onAcceptBookingOffer={acceptBookingOffer}
                    onDeclineBookingOffer={declineBookingOffer}
                    onSellerRespondToOffer={sellerRespondToOffer}
                    onAcceptOrderOffer={acceptOrderOffer}
                    onRejectOrderOffer={rejectOrderOffer}
                    onWithdrawProductCard={(m) => {
                      if (!m.productCard || !activeThreadId) return;
                      updateProductCard(m.id, { status: 'canceled' });
                      addThreadMessage(
                        activeThreadId,
                        `🚫 Buyer has withdrawn the sourcing request for ${m.productCard.name}.`,
                        'user',
                        'Me',
                      );
                      toast.success('Sourcing request withdrawn!');
                    }}
                    onAcceptProductCounter={(m) => {
                      if (!m.productCard || !activeThreadId) return;
                      updateProductCard(m.id, {
                        status: 'approved',
                        price: m.productCard.counterPrice,
                      });
                      addThreadMessage(
                        activeThreadId,
                        `✅ Buyer accepted the supplier counter offer of BDT ${m.productCard.counterPrice?.toLocaleString()} per unit! Sourcing transaction locked.`,
                        'user',
                        'Me',
                      );
                      toast.success('Supplier counter offer accepted! Sourcing order verified.');
                    }}
                    onDeclineProductCounter={(m) => {
                      if (!m.productCard || !activeThreadId) return;
                      updateProductCard(m.id, { status: 'canceled' });
                      addThreadMessage(
                        activeThreadId,
                        `❌ Buyer declined the counter offer. Sourcing request cancelled.`,
                        'user',
                        'Me',
                      );
                      toast.error('Deal declined.');
                    }}
                  />
                </div>
              </div>

              {/* Composer — announcements search; closed chats locked; others reply */}
              {isAnnouncementsThread ? (
                <div className="px-5 py-3.5 bg-[#EEF2F7] border-t border-[#E8EDF2] shrink-0">
                  <div className="flex gap-2.5 items-center">
                    <div className="relative flex-1">
                      <Search
                        size={15}
                        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#6B7280] pointer-events-none"
                        aria-hidden
                      />
                      <input
                        value={announcementSearch}
                        onChange={(e) => setAnnouncementSearch(e.target.value)}
                        className="w-full h-[42px] bg-[#E2E8F0] border border-[#CBD5E1] rounded-lg pl-10 pr-10 text-[12.5px] font-medium text-[#1A1A2E] placeholder:text-[#64748B] focus:outline-none focus:border-[#94A3B8] focus:bg-[#F1F5F9] transition-all"
                        placeholder="Search announcements…"
                        aria-label="Search announcements in this channel"
                        type="search"
                      />
                      {announcementSearch ? (
                        <button
                          type="button"
                          onClick={() => setAnnouncementSearch('')}
                          className="absolute right-2.5 top-1/2 -translate-y-1/2 w-7 h-7 rounded-md flex items-center justify-center text-[#64748B] hover:text-[#1A1A2E] bg-transparent border-none cursor-pointer"
                          aria-label="Clear search"
                        >
                          <X size={14} />
                        </button>
                      ) : null}
                    </div>
                    <span
                      className="w-[42px] h-[42px] rounded-lg bg-[#CBD5E1] text-[#475569] flex items-center justify-center shrink-0"
                      aria-hidden
                      title="Search"
                    >
                      <Search size={15} />
                    </span>
                  </div>
                </div>
              ) : isConversationClosed ? (
                <div className="px-5 py-3.5 bg-[#F4F7F9] border-t border-[#E8EDF2] shrink-0">
                  <div
                    className="flex items-center gap-3 h-[42px] px-3.5 rounded-lg bg-[#E8EDF2]/70 border border-[#E5E7EB] text-[#9AA0AC] select-none pointer-events-none"
                    role="status"
                    aria-live="polite"
                  >
                    <Lock size={14} className="shrink-0 text-[#9AA0AC]" aria-hidden />
                    <span className="flex-1 text-[12px] font-medium leading-snug">
                      {conversationExpiry.closedLabel || 'This conversation has ended'}
                    </span>
                    <span
                      className="w-[42px] h-[42px] -mr-1 rounded-lg bg-[#D1D5DB] text-white/80 flex items-center justify-center shrink-0"
                      aria-hidden
                    >
                      <Send size={15} />
                    </span>
                  </div>
                  <div className="mt-2 flex items-center justify-center gap-3">
                    <button
                      type="button"
                      onClick={() => setShowReportModal(true)}
                      className="text-[11px] font-bold text-[#FF5B00] hover:underline bg-transparent border-none cursor-pointer inline-flex items-center gap-1"
                    >
                      <Flag size={11} />
                      Report to Support
                    </button>
                  </div>
                </div>
              ) : (
                <div className="px-5 py-3.5 bg-white border-t border-[#E8EDF2] flex flex-col gap-2.5 shrink-0">
                  {(showFreezeNotice || showExpiryWarning) && (
                    <div className="space-y-2" aria-live="polite">
                      {showExpiryWarning && conversationExpiry.warningLabel && (
                        <div className="bg-amber-50 border border-amber-200 rounded-lg px-3 py-2 flex items-start gap-2">
                          <AlertTriangle size={14} className="text-amber-600 shrink-0 mt-0.5" />
                          <p className="text-[11.5px] font-semibold text-amber-800 leading-snug">
                            {conversationExpiry.warningLabel}
                          </p>
                        </div>
                      )}
                      {showFreezeNotice && conversationExpiry.freezeNotice && (
                        <div className="bg-[#F4F7F9] border border-[#E8EDF2] rounded-lg px-3 py-2 flex items-start gap-2">
                          <Clock size={14} className="text-[#6B7280] shrink-0 mt-0.5" />
                          <p className="text-[11.5px] font-medium text-[#4B5563] leading-snug">
                            {conversationExpiry.freezeNotice}
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                  <div className="flex flex-wrap gap-2.5">
                    <button
                      type="button"
                      onClick={() => setShowReportModal(true)}
                      className="px-3.5 py-1.5 bg-white hover:bg-[#F4F7F9] border border-[#E5E7EB] rounded-2xl text-[11px] font-semibold text-[#4B5563] transition-all flex items-center gap-1.5 cursor-pointer"
                    >
                      <Flag size={12} className="text-[#FF5B00]" />
                      Report to Support
                    </button>
                  </div>

                  <div className="flex gap-2.5 items-center">
                    <input
                      value={inputText}
                      onChange={(e) => setInputText(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && void handleSendMessage()}
                      className="flex-1 h-[42px] bg-white border border-[#E5E7EB] rounded-lg px-3.5 text-[12.5px] font-medium text-[#1A1A2E] placeholder:text-[#9AA0AC] focus:outline-none focus:border-[#FF5B00] transition-all"
                      placeholder="Type your message..."
                    />
                    <button
                      type="button"
                      onClick={() => void handleSendMessage()}
                      className="w-[42px] h-[42px] rounded-lg bg-[#FF5B00] text-white flex items-center justify-center hover:bg-[#EF3C23] transition-colors shrink-0 cursor-pointer border-none"
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
              )}
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-12 text-center max-w-lg mx-auto space-y-3">
              <div className="w-16 h-16 bg-white rounded-full border border-[#E8EDF2] flex items-center justify-center text-[#9AA0AC] mb-2">
                <MessageCircleMore size={28} className="text-[#FF5B00]" />
              </div>
              <h3 className="text-base font-extrabold text-[#1A1A2E]">No conversation selected</h3>
              <p className="text-[11.5px] text-[#9AA0AC] leading-relaxed font-medium">
                Choose a thread from the list to chat with a seller or support — or open {EMI_MESSAGES_THREAD_TITLE} for shopping help.
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
          isEmiThread={isEmiThread}
          focusedAnnouncement={focusedAnnouncement}
          emiEntities={isEmiThread ? emiRailEntities : null}
          emiExcerpt={isEmiThread ? emiActiveContent?.excerpt ?? null : null}
          conversationClosed={isConversationClosed}
          onReportProblem={() => setShowReportModal(true)}
          onViewOrder={() => {
            if (linkedOrder) {
              navigate('/order-tracking', { state: { order: linkedOrder } });
            }
          }}
        />
      </div>

      {activeThread && !isAnnouncementsThread && !isEmiThread && (
        <MobileThreadInfoSheet
          open={showMobileInfo}
          onClose={() => setShowMobileInfo(false)}
          activeThread={activeThread}
          linkedOrder={linkedOrder}
          linkedSubOrder={linkedSubOrder}
          conversationClosed={isConversationClosed}
          onReportProblem={() => {
            setShowMobileInfo(false);
            setShowReportModal(true);
          }}
          onViewOrder={() => {
            if (linkedOrder) {
              navigate('/order-tracking', { state: { order: linkedOrder } });
            }
          }}
        />
      )}

      <ReportConversationProblemModal
        open={showReportModal}
        onClose={() => setShowReportModal(false)}
        conversationId={activeThreadId || undefined}
        orderId={linkedOrder?.orderId}
        bookingRef={linkedOrder?.bookingRequestId || (!linkedOrder ? activeThread?.orderRef : undefined)}
        sellerId={linkedSubOrder?.sellerId}
        sellerName={linkedSubOrder?.sellerBusinessName || activeThread?.title}
        buyerId={currentUser.id || 'user-standard'}
        userName={currentUser.name || 'Buyer'}
      />

      {showSendOfferModal && (
        <SendOrderOfferModal
          buyerIdDefault={activeThreadId?.startsWith('conv_platform_') ? activeThreadId.replace('conv_platform_', '') : undefined}
          onClose={() => setShowSendOfferModal(false)}
          onSent={() => setShowSendOfferModal(false)}
        />
      )}
    </div>
  );
}
