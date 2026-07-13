import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useDashboard } from '../context/DashboardContext';
import { useGlobalState } from '../context/GlobalStateContext';
import { PRODUCTS, PLACEHOLDER_IMAGE } from '../constants';
import { 
  Search, ArrowLeft, Send, Bell, MoreVertical, 
  Package, Truck, Clock, MessageSquare, ExternalLink,
  X, Check, Sparkles, Plus, Copy, Lock, Download, Play, Smile, Paperclip, ChevronRight, CheckCheck
} from 'lucide-react';
import toast from 'react-hot-toast';

interface Thread {
  id: string;
  title: string;
  avatar: string;
  lastMessage: string;
  time: string;
  unread: boolean;
  unreadCount?: number;
  tagType: 'order' | 'announcement' | 'general' | 'admin' | 'support' | 'collaboration';
  tagText: string;
  online: boolean;
  orderId?: string;
  txnId?: string;
  orderDate?: string;
  paymentMethod?: string;
  orderStatus?: string;
  totalAmount?: string;
  memberSince?: string;
  totalOrders?: number;
  responseTime?: string;
  rating?: string;
  ratingCount?: string;
  verified?: boolean;
}

interface Message {
  id: number;
  sender: 'other' | 'support' | 'user' | 'seller';
  senderName: string;
  time: string;
  text: string;
  avatar?: string;
  attachment?: {
    name: string;
    size: string;
  };
  productCard?: {
    name: string;
    variant: string;
    color: string;
    quantity: number;
    price: number;
    notes: string;
    image: string;
    status: 'pending' | 'approved' | 'countered' | 'canceled';
    link: string;
    counterPrice?: number;
  };
}

export function MessagesPage() {
  const { threadId } = useParams<{ threadId?: string }>();
  const navigate = useNavigate();
  const { markAllAsRead } = useDashboard();
  
  // 1. Thread Seed Data Matching the Screenshot Visuals exactly
  const defaultThreads: Thread[] = [
    {
      id: 'thread-apple-outlet',
      title: 'APPLE FACTORY OUTLET',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&h=150&q=80',
      lastMessage: 'Hi, I have an issue with my MacBook Air M2. The screen flickers randomly when I\'m using external display.',
      time: '11:24 PM',
      unread: true,
      unreadCount: 2,
      tagType: 'order',
      tagText: 'ORDER: ORD-12121',
      online: true,
      orderId: 'ORD-12121',
      txnId: 'TXN-98764',
      orderDate: 'May 12, 2025 • 10:18 AM',
      paymentMethod: 'Cash on Delivery (COD)',
      orderStatus: 'PENDING CONFIRMATION',
      totalAmount: '৳128,120',
      memberSince: 'Jan 15, 2023',
      totalOrders: 24,
      responseTime: 'Within 1 hour',
      rating: '4.8',
      ratingCount: '1.2K',
      verified: true
    },
    {
      id: 'thread-choosify-announcements',
      title: 'CHOOSIFY ANNOUNCEMENTS',
      avatar: 'announcement-avatar', // Special rendering
      lastMessage: 'New Year Sale Live!',
      time: '11:18 PM',
      unread: true,
      unreadCount: 1,
      tagType: 'announcement',
      tagText: 'ANNOUNCEMENT',
      online: false,
      orderId: 'N/A',
      txnId: 'N/A',
      orderDate: 'Jan 01, 2026',
      paymentMethod: 'N/A',
      orderStatus: 'ACTIVE',
      totalAmount: 'N/A',
      memberSince: 'Platform Channel',
      totalOrders: 0,
      responseTime: 'Instant',
      rating: '5.0',
      ratingCount: '10K',
      verified: true
    },
    {
      id: 'thread-apex-outlet',
      title: 'APEX FACTORY OUTLET',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&h=150&q=80',
      lastMessage: 'When will my order be delivered?',
      time: '10:45 PM',
      unread: false,
      tagType: 'order',
      tagText: 'ORDER: ORD-12060',
      online: true,
      orderId: 'ORD-12060',
      txnId: 'TXN-48592',
      orderDate: 'May 10, 2025 • 04:30 PM',
      paymentMethod: 'bKash Wallet',
      orderStatus: 'DISPATCHED',
      totalAmount: '৳4,500',
      memberSince: 'Feb 20, 2022',
      totalOrders: 18,
      responseTime: 'Within 2 hours',
      rating: '4.6',
      ratingCount: '850',
      verified: true
    },
    {
      id: 'thread-samsung-outlet',
      title: 'SAMSUNG FACTORY OUTLET',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=150&h=150&q=80',
      lastMessage: 'Do you have any ongoing offers?',
      time: '09:30 PM',
      unread: false,
      tagType: 'general',
      tagText: 'GENERAL QUERY',
      online: true,
      orderId: 'ORD-11590',
      txnId: 'TXN-38591',
      orderDate: 'Apr 18, 2025 • 11:15 AM',
      paymentMethod: 'Credit Card',
      orderStatus: 'COMPLETED',
      totalAmount: '৳89,900',
      memberSince: 'Mar 05, 2024',
      totalOrders: 54,
      responseTime: 'Within 15 mins',
      rating: '4.9',
      ratingCount: '2.4K',
      verified: true
    },
    {
      id: 'thread-farhan-rafiq',
      title: 'FARHAN RAFIQ (ADMIN)',
      avatar: 'https://res.cloudinary.com/djdyqr8yd/image/upload/v1781880900/FBR_n3eycm.png',
      lastMessage: 'Approved my return request',
      time: '08:20 PM',
      unread: false,
      tagType: 'admin',
      tagText: 'ADMIN',
      online: true,
      orderId: 'RET-5592',
      txnId: 'TXN-39581',
      orderDate: 'May 08, 2025 • 11:20 AM',
      paymentMethod: 'Refund to Wallet',
      orderStatus: 'APPROVED',
      totalAmount: '৳12,000',
      memberSince: 'Jan 01, 2021',
      totalOrders: 120,
      responseTime: 'Instant',
      rating: '5.0',
      ratingCount: '5.0K',
      verified: true
    },
    {
      id: 'thread-samsung-bd',
      title: 'SAMSUNG BANGLADESH LTD.',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&h=150&q=80',
      lastMessage: 'Need technical support for my TV',
      time: 'Yesterday',
      unread: false,
      tagType: 'support',
      tagText: 'SUPPORT',
      online: false,
      orderId: 'ORD-11440',
      txnId: 'TXN-90215',
      orderDate: 'Apr 02, 2025 • 03:45 PM',
      paymentMethod: 'Cash on Delivery (COD)',
      orderStatus: 'SERVICED',
      totalAmount: '৳52,000',
      memberSince: 'Jul 18, 2023',
      totalOrders: 82,
      responseTime: 'Within 1 hour',
      rating: '4.7',
      ratingCount: '1.9K',
      verified: true
    },
    {
      id: 'thread-apple-retail',
      title: 'APPLE RETAIL BD',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&h=150&q=80',
      lastMessage: 'Warranty claim for iPhone 15 Pro',
      time: '2 Days ago',
      unread: false,
      tagType: 'order',
      tagText: 'ORDER: ORD-11911',
      online: false,
      orderId: 'ORD-11911',
      txnId: 'TXN-11048',
      orderDate: 'Apr 25, 2025 • 02:15 PM',
      paymentMethod: 'Credit Card',
      orderStatus: 'CLAIM UNDER REVIEW',
      totalAmount: '৳145,000',
      memberSince: 'Sep 14, 2022',
      totalOrders: 41,
      responseTime: 'Within 2 hours',
      rating: '4.8',
      ratingCount: '920',
      verified: true
    },
    {
      id: 'thread-creator-collab',
      title: 'CREATOR COLLAB',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&h=150&q=80',
      lastMessage: 'Interested in collaboration opportunity',
      time: '3 Days ago',
      unread: false,
      tagType: 'collaboration',
      tagText: 'COLLABORATION',
      online: true,
      orderId: 'COL-8821',
      txnId: 'TXN-00983',
      orderDate: 'Mar 15, 2025 • 10:00 AM',
      paymentMethod: 'Sponsorship Grant',
      orderStatus: 'PROPOSAL PHASE',
      totalAmount: '৳25,000',
      memberSince: 'Oct 01, 2024',
      totalOrders: 5,
      responseTime: 'Within 12 hours',
      rating: '4.5',
      ratingCount: '42',
      verified: false
    }
  ];

  // 2. Default messages mapped by thread ID
  const defaultMessagesByThread: Record<string, Message[]> = {
    'thread-apple-outlet': [
      {
        id: 1,
        sender: 'seller',
        senderName: 'APPLE FACTORY OUTLET',
        time: '11:20 PM',
        text: "Hi, I have an issue with my MacBook Air M2. The screen flickers randomly when I'm using external display.",
        avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&h=150&q=80'
      },
      {
        id: 2,
        sender: 'support',
        senderName: 'CHOOSIFY SUPPORT',
        time: '11:21 PM',
        text: "Hello! I'm sorry to hear that. Don't worry, I'll help you with this issue. Can you please share a short video of the problem?"
      },
      {
        id: 3,
        sender: 'seller',
        senderName: 'APPLE FACTORY OUTLET',
        time: '11:23 PM',
        text: "Sure, here is the video.",
        avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&h=150&q=80',
        attachment: {
          name: 'macbook-issue.mp4',
          size: '18.4 MB'
        }
      },
      {
        id: 4,
        sender: 'support',
        senderName: 'CHOOSIFY SUPPORT',
        time: '11:24 PM',
        text: "Thanks for sharing. I've forwarded this to our technical team. They will get back to you within 2 hours."
      },
      {
        id: 5,
        sender: 'seller',
        senderName: 'APPLE FACTORY OUTLET',
        time: '11:24 PM',
        text: "Thank you so much!",
        avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&h=150&q=80'
      }
    ],
    'thread-choosify-announcements': [
      {
        id: 1,
        sender: 'support',
        senderName: 'CHOOSIFY ANNOUNCEMENTS',
        time: '11:18 PM',
        text: "🔔 New Year Sale Live! Celebrate 2026 with verified premium factory offers. Massive deals and global logistics integrations are live today."
      }
    ],
    'thread-apex-outlet': [
      {
        id: 1,
        sender: 'seller',
        senderName: 'APEX FACTORY OUTLET',
        time: '10:45 PM',
        text: "When will my order be delivered?",
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&h=150&q=80'
      },
      {
        id: 2,
        sender: 'support',
        senderName: 'CHOOSIFY SUPPORT',
        time: '10:50 PM',
        text: "Hello! We have dispatched your lot to the central hub. Let me update your tracker details right now."
      }
    ],
    'thread-samsung-outlet': [
      {
        id: 1,
        sender: 'seller',
        senderName: 'SAMSUNG FACTORY OUTLET',
        time: '09:30 PM',
        text: "Do you have any ongoing offers for corporate bulk buyers of the Galaxy S24 Series?",
        avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=150&h=150&q=80'
      }
    ],
    'thread-farhan-rafiq': [
      {
        id: 1,
        sender: 'seller',
        senderName: 'FARHAN RAFIQ (ADMIN)',
        time: '08:20 PM',
        text: "Approved my return request. Please verify details for the reverse logistics pickup.",
        avatar: 'https://res.cloudinary.com/djdyqr8yd/image/upload/v1781880900/FBR_n3eycm.png'
      }
    ],
    'thread-samsung-bd': [
      {
        id: 1,
        sender: 'seller',
        senderName: 'SAMSUNG BANGLADESH LTD.',
        time: 'Yesterday',
        text: "Need technical support for my TV. There are vertical lines appearing after the recent power surge.",
        avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&h=150&q=80'
      }
    ],
    'thread-apple-retail': [
      {
        id: 1,
        sender: 'seller',
        senderName: 'APPLE RETAIL BD',
        time: '2 Days ago',
        text: "Warranty claim for iPhone 15 Pro submitted. Here are the diagnostics report logs.",
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&h=150&q=80'
      }
    ],
    'thread-creator-collab': [
      {
        id: 1,
        sender: 'seller',
        senderName: 'CREATOR COLLAB',
        time: '3 Days ago',
        text: "Interested in collaboration opportunity. Can we establish a campaign timeline for August 2026?",
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&h=150&q=80'
      }
    ]
  };

  // State initialization with localStorage fallback
  const [threads, setThreadsState] = useState<Thread[]>(() => {
    const saved = localStorage.getItem('choosify_mirror_threads');
    return saved ? JSON.parse(saved) : defaultThreads;
  });

  const [messagesMap, setMessagesMap] = useState<Record<string, Message[]>>(() => {
    const saved = localStorage.getItem('choosify_mirror_messages');
    return saved ? JSON.parse(saved) : defaultMessagesByThread;
  });

  const [activeThreadId, setActiveThreadId] = useState<string>(() => {
    return threadId || 'thread-apple-outlet';
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'All' | 'Orders' | 'Support' | 'Unread'>('All');
  const [inputText, setInputText] = useState('');
  const [showSourcingModal, setShowSourcingModal] = useState(false);

  // Sourcing modal configuration state
  const [modalProdIdx, setModalProdIdx] = useState(0);
  const [modalVariant, setModalVariant] = useState('Standard Retail Unit');
  const [modalColor, setModalColor] = useState('Sunset Orange');
  const [modalQuantity, setModalQuantity] = useState(5);
  const [modalNotes, setModalNotes] = useState('');

  // Auto-scroll reference
  const chatBottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatBottomRef.current) {
      chatBottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messagesMap, activeThreadId]);

  // Persist state to localstorage
  useEffect(() => {
    localStorage.setItem('choosify_mirror_threads', JSON.stringify(threads));
  }, [threads]);

  useEffect(() => {
    localStorage.setItem('choosify_mirror_messages', JSON.stringify(messagesMap));
  }, [messagesMap]);

  // Handle URL change
  useEffect(() => {
    if (threadId) {
      setActiveThreadId(threadId);
    }
  }, [threadId]);

  // Active thread object lookup
  const activeThread = threads.find(t => t.id === activeThreadId) || threads[0];

  // Mark selected thread as read automatically
  useEffect(() => {
    if (activeThread && activeThread.unread) {
      setThreadsState(prev => prev.map(t => t.id === activeThread.id ? { ...t, unread: false, unreadCount: 0 } : t));
    }
  }, [activeThreadId]);

  // Copying helper function
  const handleCopyText = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied to clipboard!`);
  };

  // Switch thread
  const handleSelectThread = (id: string) => {
    setActiveThreadId(id);
    navigate(`/messages/${id}`);
  };

  // Filter conversations
  const filteredThreads = threads.filter(t => {
    const matchesSearch = t.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          t.lastMessage.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (t.orderId && t.orderId.toLowerCase().includes(searchQuery.toLowerCase())) ||
                          (t.txnId && t.txnId.toLowerCase().includes(searchQuery.toLowerCase()));
    
    if (!matchesSearch) return false;

    if (activeTab === 'Orders') {
      return t.tagType === 'order';
    }
    if (activeTab === 'Support') {
      return t.tagType === 'support' || t.tagType === 'announcement';
    }
    if (activeTab === 'Unread') {
      return t.unread;
    }
    return true; // 'All'
  });

  // Send message implementation with simulated factory/customer response
  const handleSendMessage = () => {
    if (!inputText.trim()) return;

    const userMessage: Message = {
      id: Date.now(),
      sender: 'support',
      senderName: 'CHOOSIFY SUPPORT',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      text: inputText.trim()
    };

    const updatedMsgs = [...(messagesMap[activeThreadId] || []), userMessage];
    
    setMessagesMap(prev => ({
      ...prev,
      [activeThreadId]: updatedMsgs
    }));

    // Update last message in thread list
    setThreadsState(prev => prev.map(t => {
      if (t.id === activeThreadId) {
        return {
          ...t,
          lastMessage: inputText.trim(),
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
      }
      return t;
    }));

    setInputText('');

    // Simulated Auto response
    setTimeout(() => {
      const autoResponses: Record<string, string[]> = {
        'thread-apple-outlet': [
          "Perfect! I will test this and let you know if the flickering persists.",
          "Awesome, thanks for forwarding. Looking forward to the technician's update.",
          "Received! Thank you so much for the quick response."
        ],
        'thread-apex-outlet': [
          "Perfect, I'll keep an eye out for the Gazipur delivery vehicle. Thank you!",
          "Great service! Let me know if you need any additional documents."
        ],
        'thread-samsung-outlet': [
          "Got it. Please share the pricing table as soon as you have it.",
          "Thank you for the quick support! We are setting up our purchase order."
        ]
      };

      const replies = autoResponses[activeThreadId] || [
        "Thanks for the support! Our team has logged this internally.",
        "Understood. We appreciate your immediate assistance.",
        "Will do. Thanks!"
      ];

      const randomReply = replies[Math.floor(Math.random() * replies.length)];

      const sellerMessage: Message = {
        id: Date.now() + 1,
        sender: 'seller',
        senderName: activeThread.title,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        text: randomReply,
        avatar: activeThread.avatar
      };

      setMessagesMap(prev => ({
        ...prev,
        [activeThreadId]: [...(prev[activeThreadId] || []), sellerMessage]
      }));

      setThreadsState(prev => prev.map(t => {
        if (t.id === activeThreadId) {
          return {
            ...t,
            lastMessage: randomReply,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          };
        }
        return t;
      }));

      toast.success(`Reply from ${activeThread.title}`);
    }, 1500);
  };

  // Submit sourcing product card modal
  const handleCreateSourcingRequest = () => {
    const selectedProd = PRODUCTS[modalProdIdx];
    const unitPriceNum = parseFloat(String(selectedProd.price).replace(/,/g, ''));

    const pCard = {
      image: selectedProd.image || PLACEHOLDER_IMAGE,
      name: selectedProd.title,
      variant: modalVariant || "Standard Retail Unit",
      color: modalColor || "Midnight Gray",
      quantity: modalQuantity,
      notes: modalNotes || "Requested with premium wooden secure packaging.",
      price: unitPriceNum,
      link: `/products/${selectedProd.id}`,
      status: "pending" as const
    };

    const cardMessage: Message = {
      id: Date.now(),
      sender: 'support',
      senderName: 'CHOOSIFY SUPPORT',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      text: `🛒 Shared parameter card for ${selectedProd.title}`,
      productCard: pCard
    };

    setMessagesMap(prev => ({
      ...prev,
      [activeThreadId]: [...(prev[activeThreadId] || []), cardMessage]
    }));

    setShowSourcingModal(false);
    setModalNotes('');
    toast.success('Custom product sourcing card shared inside chat!');

    // Seller response
    setTimeout(() => {
      const responseText = `💬 Custom parameters received for ${selectedProd.title}! We have calculated BDT ${(unitPriceNum * modalQuantity).toLocaleString()} in draft status. Our logistics team will review and approve within 1 hour.`;
      const replyMsg: Message = {
        id: Date.now() + 1,
        sender: 'seller',
        senderName: activeThread.title,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        text: responseText,
        avatar: activeThread.avatar
      };

      setMessagesMap(prev => ({
        ...prev,
        [activeThreadId]: [...(prev[activeThreadId] || []), replyMsg]
      }));

      toast.success('Reply received from supplier representative!');
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#F5F8FD] text-gray-900 flex flex-col font-sans">
      
      {/* ========================================================= */}
      {/* 🌟 CUSTOMER SUPPORT HERO                                  */}
      {/* ========================================================= */}
      <div className="w-full bg-gradient-to-r from-[#050B2C] to-[#1F0B3C] text-white px-8 py-7 flex flex-col md:flex-row items-start md:items-center justify-between border-b border-[#EEF2F7]/10 shrink-0">
        <div className="space-y-1">
          <span className="text-[#FF5B00] text-[10px] font-extrabold uppercase tracking-[0.25em] block leading-none">
            CUSTOMER SUPPORT CENTER
          </span>
          <h1 className="text-2xl font-black uppercase italic tracking-tighter leading-none flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-[#FF5B00]/20 flex items-center justify-center text-[#FF5B00]">
              💬
            </span>
            REAL-TIME SUPPORT
          </h1>
          <p className="text-xs text-gray-400 font-medium italic">
            We're here to help, 24/7
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 mt-4 md:mt-0">
          <button
            type="button"
            onClick={() => {
              markAllAsRead();
              setThreadsState(prev => prev.map(t => ({ ...t, unread: false, unreadCount: 0 })));
              toast.success('All Support Chats marked as read!');
            }}
            className="px-4 py-2 bg-transparent hover:bg-white/5 border border-white/20 rounded-xl text-[10px] font-black uppercase tracking-widest text-white transition-all flex items-center gap-2 cursor-pointer"
          >
            <Check size={12} className="text-[#FF5B00]" />
            Mark All As Read
          </button>
          <Link 
            to="/dashboard"
            className="px-4 py-2 bg-transparent hover:bg-white/5 border border-white/20 rounded-xl text-[10px] font-black uppercase tracking-widest text-white transition-all flex items-center gap-2"
          >
            <span className="text-orange-500">❖</span>
            My Dashboard
          </Link>
          <Link 
            to="/profile/orders"
            className="px-4 py-2 bg-[#FF5B00] hover:bg-[#FF5B00] text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 shadow-lg shadow-[#FF5B00]/10"
          >
            <Package size={12} />
            My Orders
          </Link>
        </div>
      </div>

      {/* ========================================================= */}
      {/* 🚀 THREE-COLUMN MESSAGING LAYOUT                         */}
      {/* ========================================================= */}
      <div className="flex-1 max-w-[1600px] w-full mx-auto px-6 py-6 flex flex-col lg:flex-row gap-6 overflow-hidden">
        
        {/* --------------------------------------------------------- */}
        {/* 1. LEFT CONVERSATION SIDEBAR (≈26% Width)                 */}
        {/* --------------------------------------------------------- */}
        <aside className="w-full lg:w-[26%] bg-white rounded-[24px] border border-[#EEF2F7] shadow-xs flex flex-col shrink-0 overflow-hidden">
          
          {/* Header Title & Plus */}
          <div className="p-5 border-b border-[#EEF2F7] flex items-center justify-between">
            <h2 className="text-xs font-black uppercase text-gray-900 tracking-wider">
              Your Conversations
            </h2>
            <button
              onClick={() => {
                toast.success("Initializing a new transaction dialogue pipeline...");
              }}
              className="w-8 h-8 rounded-full bg-[#F5F8FD] hover:bg-[#EEF2F7] flex items-center justify-center text-gray-500 hover:text-gray-900 transition-colors border-none cursor-pointer"
              title="Create Conversation"
            >
              <Plus size={16} />
            </button>
          </div>

          {/* Search Box */}
          <div className="px-5 pt-4">
            <div className="relative">
              <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input 
                onChange={(e) => setSearchQuery(e.target.value)}
                value={searchQuery}
                className="w-full h-11 pl-11 pr-4 bg-[#F5F8FD] border border-[#EEF2F7] rounded-xl text-xs font-bold text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-[#FF5B00] transition-all" 
                placeholder="Search transactions / order references..." 
              />
            </div>
          </div>

          {/* Tabs row with Badges */}
          <div className="px-5 py-3 border-b border-[#EEF2F7] flex items-center justify-between text-xs font-bold text-gray-500 mt-2">
            {[
              { id: 'All', count: 8 },
              { id: 'Orders', count: 5 },
              { id: 'Support', count: 3 },
              { id: 'Unread', count: 3 }
            ].map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-1 pb-1 transition-all relative border-none bg-transparent cursor-pointer
                    ${isActive ? 'text-[#FF5B00] font-black' : 'hover:text-gray-900'}`}
                >
                  <span>{tab.id}</span>
                  <span className={`text-[9px] px-1.5 py-0.2 rounded-full font-black text-white
                    ${isActive ? 'bg-[#FF5B00]' : 'bg-[#6B7280]'}`}>
                    {tab.count}
                  </span>
                  {isActive && (
                    <span className="absolute bottom-[-13px] left-0 right-0 h-[3px] bg-[#FF5B00] rounded-full" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Scrollable conversation list */}
          <div className="flex-1 overflow-y-auto divide-y divide-[#EEF2F7] no-scrollbar">
            {filteredThreads.length === 0 ? (
              <div className="p-8 text-center text-gray-400 text-xs font-semibold uppercase tracking-wider">
                No matching dialogues
              </div>
            ) : (
              filteredThreads.map((t) => {
                const isActive = t.id === activeThreadId;
                
                // Get custom color styles for tags to match high-fidelity visuals
                let tagStyles = 'bg-gray-150 border-gray-200 text-gray-600';
                if (t.tagType === 'order') tagStyles = 'border-red-200 text-red-500 bg-red-50/50';
                if (t.tagType === 'announcement') tagStyles = 'border-indigo-200 text-indigo-500 bg-indigo-50/50';
                if (t.tagType === 'admin') tagStyles = 'border-emerald-200 text-emerald-600 bg-emerald-50/50';
                if (t.tagType === 'support') tagStyles = 'border-blue-200 text-blue-500 bg-blue-50/50';
                if (t.tagType === 'collaboration') tagStyles = 'border-purple-200 text-purple-600 bg-purple-50/50';
                if (t.tagType === 'general') tagStyles = 'border-amber-200 text-amber-600 bg-amber-50/50';

                return (
                  <button
                    key={t.id}
                    onClick={() => handleSelectThread(t.id)}
                    className={`w-full p-4 flex gap-3 text-left transition-all hover:bg-[#F5F8FD] relative border-none bg-transparent cursor-pointer
                      ${isActive ? 'bg-[#F5F8FD]/80 font-medium' : ''}`}
                  >
                    {isActive && (
                      <div className="absolute left-0 top-0 bottom-0 w-[4px] bg-[#FF5B00]" />
                    )}
                    
                    {/* Avatar structure */}
                    <div className="relative shrink-0">
                      {t.avatar === 'announcement-avatar' ? (
                        <div className="w-11 h-11 rounded-full bg-[#FF5B00] flex items-center justify-center text-white font-black text-sm border border-orange-200 shadow-sm">
                          CH
                        </div>
                      ) : (
                        <img 
                          src={t.avatar} 
                          className="w-11 h-11 rounded-full object-cover border border-[#EEF2F7]" 
                          alt="" 
                          referrerPolicy="no-referrer"
                        />
                      )}
                      {t.online && (
                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full" />
                      )}
                    </div>

                    {/* Metadata */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-black text-gray-900 uppercase truncate pr-1">
                          {t.title}
                        </span>
                        <span className="text-[9px] font-semibold text-gray-400 shrink-0">
                          {t.time}
                        </span>
                      </div>
                      
                      <p className="text-[11px] text-gray-500 line-clamp-1 italic mb-1.5 font-medium">
                        {t.lastMessage}
                      </p>

                      <div className="flex items-center justify-between">
                        <span className={`inline-flex text-[8px] font-black border px-1.5 py-0.5 rounded uppercase tracking-wider ${tagStyles}`}>
                          {t.tagText}
                        </span>
                        
                        {t.unreadCount && t.unreadCount > 0 ? (
                          <span className="w-5 h-5 rounded-full bg-[#FF5B00] text-white text-[10px] font-bold flex items-center justify-center shrink-0 shadow-xs animate-pulse">
                            {t.unreadCount}
                          </span>
                        ) : null}
                      </div>
                    </div>
                  </button>
                );
              })
            )}
          </div>

          {/* Bottom center links */}
          <div className="py-4 text-center border-t border-[#EEF2F7] bg-white rounded-b-[24px]">
            <button
              onClick={() => toast.success('Workspace history synced fully')}
              className="text-xs font-black text-[#FF5B00] hover:underline uppercase tracking-wider bg-transparent border-none cursor-pointer"
            >
              View all conversations →
            </button>
          </div>
        </aside>

        {/* --------------------------------------------------------- */}
        {/* 2. CENTER CHAT AREA (≈49% Width)                          */}
        {/* --------------------------------------------------------- */}
        <main className="w-full lg:w-[49%] bg-white rounded-[24px] border border-[#EEF2F7] shadow-xs flex flex-col overflow-hidden">
          
          {/* Conversation Header */}
          <div className="p-4 border-b border-[#EEF2F7] flex items-center justify-between bg-white shrink-0">
            <div className="flex items-center gap-3">
              <div className="relative">
                {activeThread.avatar === 'announcement-avatar' ? (
                  <div className="w-10 h-10 rounded-full bg-[#FF5B00] flex items-center justify-center text-white font-black text-xs border border-orange-200">
                    CH
                  </div>
                ) : (
                  <img 
                    src={activeThread.avatar} 
                    className="w-10 h-10 rounded-full object-cover border border-[#EEF2F7]" 
                    alt="" 
                    referrerPolicy="no-referrer"
                  />
                )}
                {activeThread.online && (
                  <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-white rounded-full" />
                )}
              </div>
              
              <div>
                <h2 className="text-xs font-black text-gray-900 uppercase tracking-wider leading-none mb-1">
                  {activeThread.title}
                </h2>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-semibold text-gray-400 flex items-center gap-1">
                    <span className={`w-1.5 h-1.5 rounded-full ${activeThread.online ? 'bg-green-500' : 'bg-gray-400'}`}></span>
                    {activeThread.online ? 'Online' : 'Offline'}
                  </span>
                  {activeThread.orderId && activeThread.orderId !== 'N/A' && (
                    <span className="text-[8px] font-black bg-orange-50 border border-orange-200 text-[#FF5B00] px-1.5 py-0.5 rounded uppercase tracking-wider">
                      ORDER: {activeThread.orderId}
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button 
                onClick={() => toast.success('Live audit tracking activated')}
                className="w-8 h-8 rounded-full hover:bg-gray-50 flex items-center justify-center text-gray-400 hover:text-gray-900 border-none bg-transparent cursor-pointer"
                title="Audit Track"
              >
                <Bell size={15} />
              </button>
              <button 
                onClick={() => toast.success('Support ticket parameters generated')}
                className="w-8 h-8 rounded-full hover:bg-gray-50 flex items-center justify-center text-gray-400 hover:text-gray-900 border-none bg-transparent cursor-pointer"
                title="Options"
              >
                <MoreVertical size={15} />
              </button>
            </div>
          </div>

          {/* Live Chat Viewport / Stream */}
          <div className="flex-1 p-5 overflow-y-auto space-y-4 no-scrollbar bg-white">
            
            {/* LINKED LOT TRANSACTION CARD (Conditionally show for Apple Outlet or based on order ID) */}
            {activeThread.id === 'thread-apple-outlet' && (
              <div className="p-4 bg-white border border-[#EEF2F7] rounded-2xl shadow-xs relative">
                
                {/* Header line */}
                <div className="flex items-center justify-between border-b border-[#EEF2F7] pb-3 mb-3">
                  <div className="flex items-center gap-2">
                    <span className="bg-[#FF5B00] text-white text-[8px] font-black uppercase tracking-wider px-2 py-0.5 rounded-sm">
                      LINKED LOT TRANSACTION
                    </span>
                    <span className="text-[9px] font-black text-gray-400 tracking-wider">
                      TXN ID: {activeThread.txnId}
                    </span>
                  </div>
                  <span className="border border-[#FF9F00] text-[#FF9F00] bg-[#FF9F00]/5 px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-wider">
                    🟠 PENDING
                  </span>
                </div>

                {/* Content details */}
                <div className="flex items-start gap-4">
                  <img 
                    src="https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=150&h=150&q=80" 
                    className="w-14 h-14 object-cover rounded-xl border border-[#EEF2F7] bg-white shrink-0" 
                    alt="MacBook"
                    referrerPolicy="no-referrer"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-bold text-gray-900 uppercase tracking-tight mb-1">
                      APPLE MACBOOK AIR M2
                    </h4>
                    <p className="text-[10px] text-[#6B7280] font-semibold mb-0.5">
                      Space Gray • 512GB SSD • 8GB RAM
                    </p>
                    <p className="text-[10px] text-gray-400 font-medium">
                      Order placed on <span className="font-bold text-gray-500">May 12, 2025</span>
                    </p>
                  </div>
                </div>

                {/* Bottom details */}
                <div className="mt-4 pt-3 border-t border-[#EEF2F7] flex items-center justify-between">
                  <div>
                    <span className="text-[9px] text-[#6B7280] font-bold block leading-none mb-1">TOTAL AMOUNT</span>
                    <span className="text-base font-black text-[#FF5B00] font-mono leading-none">
                      {activeThread.totalAmount}
                    </span>
                  </div>
                  <button 
                    onClick={() => toast.success('Opening detailed transaction pipeline...')}
                    className="px-4 py-2 bg-[#F5F8FD] hover:bg-[#EEF2F7] text-xs font-black text-gray-700 rounded-xl transition-all flex items-center gap-1.5 border border-[#EEF2F7] cursor-pointer"
                  >
                    View Transaction Details →
                  </button>
                </div>
              </div>
            )}

            {/* Chat Messages Timeline */}
            <div className="space-y-4">
              <div className="text-center py-2">
                <span className="text-[9px] font-black text-gray-400 uppercase tracking-wider">
                  Today, May 12
                </span>
              </div>

              {(messagesMap[activeThreadId] || []).map((m) => {
                const isSupport = m.sender === 'support';
                
                return (
                  <div 
                    key={m.id} 
                    className={`flex gap-3 max-w-[85%] ${isSupport ? 'ml-auto flex-row-reverse' : 'mr-auto'}`}
                  >
                    {/* Avatar */}
                    {!isSupport && (
                      <div className="relative shrink-0">
                        {m.avatar ? (
                          <img 
                            src={m.avatar} 
                            className="w-8 h-8 rounded-full object-cover border border-[#EEF2F7]" 
                            alt="" 
                            referrerPolicy="no-referrer"
                          />
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-orange-500 text-white flex items-center justify-center font-bold text-xs uppercase">
                            {m.senderName.charAt(0)}
                          </div>
                        )}
                      </div>
                    )}
                    
                    {isSupport && (
                      <div className="w-8 h-8 rounded-full bg-[#FF5B00] border border-orange-200 text-white font-black text-[10px] flex items-center justify-center shrink-0">
                        C
                      </div>
                    )}

                    <div className="space-y-1">
                      {/* Name + Time info */}
                      <div className={`flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-wider text-gray-400
                        ${isSupport ? 'justify-end' : ''}`}>
                        <span className="text-gray-700 font-extrabold">{m.senderName}</span>
                        <span>•</span>
                        <span>{m.time}</span>
                      </div>

                      {/* Message Bubble */}
                      <div className={`rounded-2xl p-3.5 text-xs font-bold leading-relaxed shadow-xs border
                        ${isSupport 
                          ? 'bg-[#EEF6FF] text-gray-800 border-[#D6E1EC]/20 rounded-tr-none' 
                          : 'bg-white text-gray-800 border-[#EEF2F7] rounded-tl-none'}`}>
                        <p>{m.text}</p>

                        {/* File Attachment Card */}
                        {m.attachment && (
                          <div className="bg-white border border-[#EEF2F7] rounded-xl p-3 flex items-center justify-between gap-4 mt-2.5 max-w-sm shadow-xs">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center text-white shrink-0">
                                <Play size={16} fill="currentColor" className="ml-0.5 text-white" />
                              </div>
                              <div>
                                <p className="text-xs font-bold text-gray-900">{m.attachment.name}</p>
                                <p className="text-[10px] text-gray-400 font-semibold">{m.attachment.size}</p>
                              </div>
                            </div>
                            <button
                              onClick={() => toast.success(`Downloading ${m.attachment?.name}...`)}
                              className="w-8 h-8 rounded-full hover:bg-[#F5F8FD] flex items-center justify-center text-gray-400 hover:text-gray-800 border-none bg-transparent cursor-pointer"
                            >
                              <Download size={15} />
                            </button>
                          </div>
                        )}

                        {/* Custom Shared Product Card */}
                        {m.productCard && (
                          <div className="bg-white border border-[#EEF2F7] rounded-xl p-3.5 mt-3 shadow-xs max-w-sm text-left text-gray-900">
                            <div className="flex items-center justify-between border-b border-[#EEF2F7] pb-2 mb-2">
                              <span className="text-[8px] font-black uppercase text-[#FF5B00] tracking-wider">
                                SOURCING DEMO CARD
                              </span>
                              <span className="text-[8px] font-bold bg-[#FF5B00]/10 text-[#FF5B00] px-1.5 py-0.5 rounded uppercase">
                                {m.productCard.status}
                              </span>
                            </div>
                            <div className="flex gap-3">
                              <img 
                                src={m.productCard.image} 
                                className="w-12 h-12 rounded-lg object-cover shrink-0 border border-[#EEF2F7]" 
                                alt="" 
                                referrerPolicy="no-referrer"
                              />
                              <div>
                                <h5 className="text-[11px] font-black uppercase text-gray-900 leading-tight">
                                  {m.productCard.name}
                                </h5>
                                <p className="text-[9px] text-[#6B7280] mt-0.5">
                                  Color: <span className="font-bold text-gray-900">{m.productCard.color}</span> • Qty: <span className="font-bold text-[#FF5B00]">{m.productCard.quantity}</span>
                                </p>
                              </div>
                            </div>
                            <div className="mt-3 pt-2 border-t border-[#EEF2F7] flex items-center justify-between text-[10px]">
                              <span className="text-gray-400 font-bold uppercase">Estimated total:</span>
                              <span className="font-mono font-black text-[#FF5B00]">
                                ৳{(m.productCard.price * m.productCard.quantity).toLocaleString()}
                              </span>
                            </div>
                          </div>
                        )}

                        {/* Read status checkmarks */}
                        {isSupport && (
                          <div className="flex justify-end mt-1 text-[#FF5B00]">
                            <CheckCheck size={14} className="text-blue-500" />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
              <div ref={chatBottomRef} />
            </div>
          </div>

          {/* Message Composer & Chips */}
          <div className="p-4 border-t border-[#EEF2F7] bg-white shrink-0">
            
            {/* Quick action chips */}
            <div className="flex items-center gap-2 overflow-x-auto pb-3 no-scrollbar shrink-0">
              <button
                onClick={() => {
                  setModalProdIdx(0);
                  setModalVariant("Standard Retail Unit");
                  setModalColor("Space Gray");
                  setModalQuantity(10);
                  setShowSourcingModal(true);
                }}
                className="bg-[#F5F8FD] hover:bg-gray-100 border border-[#EEF2F7] rounded-full px-3 py-1.5 text-[10px] font-black text-gray-700 flex items-center gap-1 cursor-pointer transition-colors shrink-0"
              >
                <Plus size={10} className="text-[#FF5B00]" />
                Share Product Card
              </button>
              <button
                onClick={() => setInputText(`Hello! Can you please verify dispatch status for ${activeThread.orderId || 'general order'}?`)}
                className="bg-[#F5F8FD] hover:bg-gray-100 border border-[#EEF2F7] rounded-full px-3 py-1.5 text-[10px] font-black text-gray-700 flex items-center gap-1 cursor-pointer transition-colors shrink-0"
              >
                Check Order Status
              </button>
              <button
                onClick={() => setInputText("What is the return/refund procedure for bulk logistics lots?")}
                className="bg-[#F5F8FD] hover:bg-gray-100 border border-[#EEF2F7] rounded-full px-3 py-1.5 text-[10px] font-black text-gray-700 flex items-center gap-1 cursor-pointer transition-colors shrink-0"
              >
                Returns & Refunds
              </button>
              <button
                onClick={() => setInputText("Do you support immediate warranty exchanges inside Dhaka?")}
                className="bg-[#F5F8FD] hover:bg-gray-100 border border-[#EEF2F7] rounded-full px-3 py-1.5 text-[10px] font-black text-gray-700 flex items-center gap-1 cursor-pointer transition-colors shrink-0"
              >
                FAQ
              </button>
            </div>

            {/* Input Composer Box */}
            <div className="flex items-center gap-3 bg-[#F5F8FD] border border-[#EEF2F7] rounded-2xl p-2 pl-4">
              <input 
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                className="flex-1 bg-transparent border-none text-xs font-bold text-gray-900 placeholder:text-gray-400 focus:outline-none py-2" 
                placeholder="Type your message..." 
              />
              <div className="flex items-center gap-1">
                <button 
                  onClick={() => toast.success('Emoji tray activated')}
                  className="w-8 h-8 rounded-lg hover:bg-gray-150 flex items-center justify-center text-gray-400 hover:text-gray-800 border-none bg-transparent cursor-pointer"
                  title="Emoji"
                >
                  <Smile size={16} />
                </button>
                <button 
                  onClick={() => toast.success('Logistics document dispatch active')}
                  className="w-8 h-8 rounded-lg hover:bg-gray-150 flex items-center justify-center text-gray-400 hover:text-gray-800 border-none bg-transparent cursor-pointer"
                  title="Attachment"
                >
                  <Paperclip size={16} />
                </button>
                <button 
                  onClick={handleSendMessage}
                  className="w-10 h-10 rounded-xl bg-[#FF5B00] hover:bg-[#FF5B00] text-white flex items-center justify-center shadow-md active:scale-95 transition-all border-none cursor-pointer"
                  title="Send Message"
                >
                  <Send size={14} className="text-white" />
                </button>
              </div>
            </div>

            {/* Security Notice beneath Composer */}
            <div className="pt-3 flex items-center justify-center gap-1 text-[10px] text-[#6B7280] font-bold leading-none shrink-0">
              <Lock size={11} className="text-gray-400" />
              <span>All conversations are encrypted and secure.</span>
            </div>
          </div>
        </main>

        {/* --------------------------------------------------------- */}
        {/* 3. RIGHT SIDEBAR (≈25% Width)                            */}
        {/* --------------------------------------------------------- */}
        <aside className="w-full lg:w-[25%] flex flex-col gap-6 shrink-0 overflow-y-auto no-scrollbar">
          
          {/* CARD 1: TRANSACTION DETAILS */}
          <div className="bg-white rounded-[24px] border border-[#EEF2F7] shadow-xs p-5">
            <div className="flex items-center gap-2 border-b border-[#EEF2F7] pb-3 mb-4">
              <span className="text-[#FF5B00] text-xs">💳</span>
              <h3 className="text-xs font-black uppercase text-gray-900 tracking-wider">
                Transaction Details
              </h3>
            </div>

            <div className="space-y-3.5">
              <div>
                <span className="text-[10px] font-semibold text-[#6B7280] uppercase tracking-wider block mb-1">
                  Order ID
                </span>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-gray-900 font-mono">
                    {activeThread.orderId || 'N/A'}
                  </span>
                  {activeThread.orderId && activeThread.orderId !== 'N/A' && (
                    <button
                      onClick={() => handleCopyText(activeThread.orderId!, 'Order ID')}
                      className="px-2 py-0.5 bg-[#F5F8FD] hover:bg-[#EEF2F7] border border-[#EEF2F7] rounded text-[9px] font-black text-[#FF5B00] flex items-center gap-1 cursor-pointer transition-colors"
                    >
                      <Copy size={9} />
                      Copy
                    </button>
                  )}
                </div>
              </div>

              <div>
                <span className="text-[10px] font-semibold text-[#6B7280] uppercase tracking-wider block mb-1">
                  Transaction ID
                </span>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-gray-900 font-mono">
                    {activeThread.txnId || 'N/A'}
                  </span>
                  {activeThread.txnId && activeThread.txnId !== 'N/A' && (
                    <button
                      onClick={() => handleCopyText(activeThread.txnId!, 'Transaction ID')}
                      className="px-2 py-0.5 bg-[#F5F8FD] hover:bg-[#EEF2F7] border border-[#EEF2F7] rounded text-[9px] font-black text-[#FF5B00] flex items-center gap-1 cursor-pointer transition-colors"
                    >
                      <Copy size={9} />
                      Copy
                    </button>
                  )}
                </div>
              </div>

              <div>
                <span className="text-[10px] font-semibold text-[#6B7280] uppercase tracking-wider block mb-1">
                  Order Date
                </span>
                <p className="text-xs font-bold text-gray-900">
                  {activeThread.orderDate || 'N/A'}
                </p>
              </div>

              <div>
                <span className="text-[10px] font-semibold text-[#6B7280] uppercase tracking-wider block mb-1">
                  Payment Method
                </span>
                <p className="text-xs font-bold text-gray-900">
                  {activeThread.paymentMethod || 'N/A'}
                </p>
              </div>

              <div>
                <span className="text-[10px] font-semibold text-[#6B7280] uppercase tracking-wider block mb-1">
                  Order Status
                </span>
                <p className="text-xs font-bold text-gray-900 flex items-center gap-1.5 uppercase">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#FF5B00] inline-block"></span>
                  {activeThread.orderStatus || 'N/A'}
                </p>
              </div>

              <div>
                <span className="text-[10px] font-semibold text-[#6B7280] uppercase tracking-wider block mb-1">
                  Total Amount
                </span>
                <p className="text-lg font-black text-[#FF5B00] font-mono">
                  {activeThread.totalAmount || 'N/A'}
                </p>
              </div>
            </div>

            <button 
              onClick={() => toast.success('Routing to detailed transaction audit report...')}
              className="mt-5 w-full py-3 bg-white hover:bg-[#F5F8FD] border border-[#EEF2F7] rounded-xl text-xs font-black text-gray-700 transition-all text-center flex items-center justify-center gap-1 cursor-pointer"
            >
              View Full Order Details →
            </button>
          </div>

          {/* CARD 2: CUSTOMER PROFILE */}
          <div className="bg-white rounded-[24px] border border-[#EEF2F7] shadow-xs p-5">
            <div className="flex items-center gap-2 border-b border-[#EEF2F7] pb-3 mb-4">
              <span className="text-[#FF5B00] text-xs">👤</span>
              <h3 className="text-xs font-black uppercase text-gray-900 tracking-wider">
                Customer Profile
              </h3>
            </div>

            <div className="flex items-start gap-3.5 mb-4">
              {activeThread.avatar === 'announcement-avatar' ? (
                <div className="w-12 h-12 rounded-full bg-[#FF5B00] flex items-center justify-center text-white font-black text-sm border border-orange-200 shrink-0">
                  CH
                </div>
              ) : (
                <img 
                  src={activeThread.avatar} 
                  className="w-12 h-12 rounded-full object-cover border border-[#EEF2F7] shrink-0" 
                  alt="" 
                  referrerPolicy="no-referrer"
                />
              )}
              
              <div>
                <h4 className="text-xs font-black text-gray-900 uppercase">
                  {activeThread.title}
                </h4>
                {activeThread.verified ? (
                  <span className="inline-flex bg-green-50 text-green-600 border border-green-200 rounded px-1.5 py-0.5 text-[8.5px] font-bold items-center gap-1 mt-1 leading-none">
                    ✓ Verified Seller
                  </span>
                ) : (
                  <span className="inline-flex bg-gray-50 text-gray-500 border border-gray-200 rounded px-1.5 py-0.5 text-[8.5px] font-bold items-center gap-1 mt-1 leading-none">
                    Standard Account
                  </span>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-y-3.5 gap-x-2 text-xs border-t border-b border-[#EEF2F7] py-4 my-4">
              <div>
                <span className="text-[10px] text-gray-400 font-bold block uppercase leading-none mb-1">
                  Member since
                </span>
                <span className="font-bold text-gray-900 truncate block">
                  {activeThread.memberSince || 'N/A'}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-gray-400 font-bold block uppercase leading-none mb-1">
                  Total Orders
                </span>
                <span className="font-bold text-gray-900 block">
                  {activeThread.totalOrders ?? 'N/A'}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-gray-400 font-bold block uppercase leading-none mb-1">
                  Response Time
                </span>
                <span className="font-bold text-gray-900 block">
                  {activeThread.responseTime || 'N/A'}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-gray-400 font-bold block uppercase leading-none mb-1">
                  Rating
                </span>
                <span className="font-bold text-gray-900 block">
                  ★ {activeThread.rating || 'N/A'} ({activeThread.ratingCount || '0'})
                </span>
              </div>
            </div>

            <button 
              onClick={() => toast.success('Opening catalog profile page...')}
              className="w-full py-3 bg-white hover:bg-[#F5F8FD] border border-[#EEF2F7] rounded-xl text-xs font-black text-gray-700 transition-all text-center flex items-center justify-center gap-1 cursor-pointer"
            >
              View Store Profile →
            </button>
          </div>

          {/* CARD 3: SUPPORT SHORTCUTS */}
          <div className="bg-white rounded-[24px] border border-[#EEF2F7] shadow-xs p-5">
            <div className="flex items-center gap-2 border-b border-[#EEF2F7] pb-3 mb-4">
              <span className="text-[#FF5B00] text-xs">⚙️</span>
              <h3 className="text-xs font-black uppercase text-gray-900 tracking-wider">
                Support Shortcuts
              </h3>
            </div>

            <div className="divide-y divide-[#EEF2F7]">
              {[
                "Return & Refund Policy",
                "Warranty Information",
                "Shipping & Delivery",
                "Product Support"
              ].map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => toast.success(`Opening shortcut: ${item}`)}
                  className="w-full py-3 text-left text-xs font-bold text-gray-700 hover:text-[#FF5B00] flex items-center justify-between transition-colors bg-transparent border-none cursor-pointer"
                >
                  <span>{item}</span>
                  <ChevronRight size={14} className="text-gray-400" />
                </button>
              ))}
            </div>
          </div>

        </aside>

      </div>

      {/* ========================================================= */}
      {/* 🚨 CUSTOM IN-CHAT SOURCING CONFIGURATION MODAL            */}
      {/* ========================================================= */}
      {showSourcingModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-gray-950/60 backdrop-blur-xs">
          <div className="relative bg-white w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl border border-gray-100 p-6 md:p-8 animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-gray-100 pb-4 mb-6">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-orange-500/10 flex items-center justify-center text-[#FF5B00]">
                  <Sparkles size={16} />
                </div>
                <div>
                  <h3 className="text-xs font-black uppercase text-gray-900 tracking-wider leading-none">
                    Share Custom Sourcing Config
                  </h3>
                  <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest block mt-0.5">
                    Generate Buyer Order Request Card
                  </span>
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
                <label className="text-[10px] font-bold uppercase text-gray-400 tracking-wider block mb-1.5">
                  Select Sourcing Catalog Product:
                </label>
                <select
                  value={modalProdIdx}
                  onChange={(e) => setModalProdIdx(Number(e.target.value))}
                  className="w-full h-11 px-4 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold text-gray-900 focus:outline-none focus:border-[#FF5B00]"
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
                  <label className="text-[10px] font-bold uppercase text-gray-400 tracking-wider block mb-1.5">
                    Selected Variant:
                  </label>
                  <input
                    type="text"
                    value={modalVariant}
                    onChange={(e) => setModalVariant(e.target.value)}
                    className="w-full h-11 px-4 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold text-gray-900 focus:outline-none focus:border-[#FF5B00]"
                    placeholder="e.g. 256GB / 12GB RAM"
                  />
                </div>

                {/* Color */}
                <div>
                  <label className="text-[10px] font-bold uppercase text-gray-400 tracking-wider block mb-1.5">
                    Selected Color:
                  </label>
                  <input
                    type="text"
                    value={modalColor}
                    onChange={(e) => setModalColor(e.target.value)}
                    className="w-full h-11 px-4 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold text-gray-900 focus:outline-none focus:border-[#FF5B00]"
                    placeholder="e.g. Space Gray"
                  />
                </div>
              </div>

              {/* Quantity */}
              <div>
                <label className="text-[10px] font-bold uppercase text-gray-400 tracking-wider block mb-1.5">
                  Wholesale Quantity (Units):
                </label>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setModalQuantity(q => Math.max(1, q - 1))}
                    className="w-10 h-10 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold flex items-center justify-center border-none cursor-pointer"
                  >
                    -
                  </button>
                  <span className="text-sm font-black text-gray-900 w-12 text-center">
                    {modalQuantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => setModalQuantity(q => q + 1)}
                    className="w-10 h-10 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold flex items-center justify-center border-none cursor-pointer"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Custom Notes */}
              <div>
                <label className="text-[10px] font-bold uppercase text-gray-400 tracking-wider block mb-1.5">
                  Special Logistics Notes Memo:
                </label>
                <textarea
                  value={modalNotes}
                  onChange={(e) => setModalNotes(e.target.value)}
                  className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-[#FF5B00] h-20 resize-none"
                  placeholder="e.g. Request fast sea-cargo delivery with complete bubble wrap protection layers..."
                />
              </div>

              {/* Total Summary */}
              <div className="bg-[#EEF6FF] border border-[#EEF2F7] rounded-2xl p-4 flex justify-between items-center text-xs font-bold text-gray-700">
                <span>Estimated Total Volume Sourcing BDT:</span>
                <span className="text-sm font-black text-[#FF5B00] font-mono">
                  ৳{(parseFloat(String(PRODUCTS[modalProdIdx].price).replace(/,/g, '')) * modalQuantity).toLocaleString()}
                </span>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="mt-6 pt-4 border-t border-gray-100 flex gap-3 justify-end">
              <button
                type="button"
                onClick={() => setShowSourcingModal(false)}
                className="px-5 py-2.5 bg-gray-50 hover:bg-gray-100 rounded-xl text-[10px] font-black uppercase tracking-wider text-gray-500 transition-all cursor-pointer border-none"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleCreateSourcingRequest}
                className="px-5 py-2.5 bg-[#FF5B00] hover:bg-[#FF5B00] text-white rounded-xl text-[10px] font-black uppercase tracking-wider transition-all italic shadow-md cursor-pointer border-none flex items-center gap-1"
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
