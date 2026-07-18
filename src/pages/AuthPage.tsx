import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Bot, Sparkles, Check, ShieldCheck, Award, MessageSquare, 
  Facebook, Instagram, Youtube, HelpCircle, ChevronDown, X, Send,
  Mail, Lock, User, Phone, Eye, EyeOff, ArrowRight, CheckCircle, RefreshCw, Star
} from 'lucide-react';
import { useGlobalState } from '../context/GlobalStateContext';
import { useNavigate, useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';

// Inline TikTok icon component
function TikTokIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.02 1.73 4.1 1.12 1.09 2.62 1.7 4.18 1.8v3.91c-1.85-.01-3.61-.68-5.07-1.82V14.5c.04 3.39-2.14 6.55-5.4 7.63-3.25 1.08-6.9-.32-8.56-3.32C1.65 15.82 2.45 11.9 5.31 9.87c1.78-1.27 4.14-1.55 6.16-.72.01-.16.02-.32.02-.48V4.83c-1.41-.35-2.88-.16-4.16.54-2.1 1.15-3.35 3.51-3.14 5.92.21 2.42 2.01 4.54 4.38 5.17 2.37.64 4.96-.2 6.09-2.26.47-.86.7-1.84.66-2.82V.02Z" />
    </svg>
  );
}

// Master Choosify Logo
const ChoosifyLogo: React.FC<{ className?: string }> = ({ className = "h-8 w-auto" }) => {
  return (
    <svg 
      viewBox="0 0 2585.84 505.4" 
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <g>
        <g>
          <path fill="#FF5B00" d="M921.65,303.09c0-47.35-38.42-85.71-85.76-85.71s-85.76,38.36-85.76,85.71,38.42,85.76,85.76,85.76c8.22,0,16.14-1.17,23.65-3.3-3.3-5.38-5.23-11.77-5.23-18.57,0-19.74,15.99-35.73,35.68-35.73,8.93,0,17.1,3.3,23.34,8.68,5.33-11.16,8.32-23.65,8.32-36.84Z"/>
          <path fill="#FF5B00" d="M356.15,303.09c0-47.35-38.42-85.71-85.76-85.71s-85.76,38.36-85.76,85.71c0,47.35,38.42,85.76,85.76,85.76,8.22,0,16.14-1.17,23.65-3.3-3.3-5.38-5.23-11.77-5.23-18.57,0-19.74,15.99-35.73,35.68-35.73,8.93,0,17.1,3.3,23.34,8.68,5.33-11.16,8.32-23.65,8.32-36.84Z"/>
          <path fill="#FF5B00" d="M252.7,505.4C113.36,505.4,0,392.04,0,252.7S113.36,0,252.7,0s252.7,113.36,252.7,252.7-113.36,252.7-252.7,252.7ZM252.7,57.74c-107.5,0-194.96,87.46-194.96,194.96s87.46,194.96,194.96,194.96,194.96-87.46,194.96-194.96S360.2,57.74,252.7,57.74Z"/>
          <path fill="#FF5B00" d="M779.18,505.4c-139.34,0-252.7-113.36-252.7-252.7S639.84,0,779.18,0s252.7,113.36,252.7,252.7-113.36,252.7-252.7,252.7ZM779.18,57.74c-107.5,0-194.96,87.46-194.96,194.96s87.46,194.96,194.96,194.96,194.96-87.46,194.96-194.96-87.46-194.96-194.96-194.96Z"/>
        </g>
        <g>
          <path fill="#fff" d="M1094.27,260.83c0-54.18,36.9-95.48,93.45-95.48,48.09,0,77.9,27.43,84.31,66.7h-51.45c-3.72-16.59-14.55-27.09-32.15-27.09-26.77,0-40.3,22.01-40.3,55.88s13.53,55.19,40.3,55.19c19.62,0,31.48-11.85,33.85-32.51h51.13c-1.7,40.97-34.21,72.8-84.31,72.8-57.58,0-94.83-41.64-94.83-95.48Z"/>
          <path fill="#fff" d="M1351.4,350.56h-53.18V98.64h53.18v69.42c0,1.68,0,16.25-.35,28.1h1.03c10.84-19.3,29.11-30.81,54.18-30.81,39.59,0,62.64,26.4,62.64,66.7v118.52h-52.83v-108.36c0-19.64-10.48-32.84-30.13-32.84-20.65,0-34.53,16.59-34.53,39.62v101.58Z"/>
          <path fill="#fff" d="M1494.41,260.83c0-54.18,37.92-95.48,95.5-95.48s94.8,41.31,94.8,95.48-37.57,95.48-94.8,95.48-95.5-41.64-95.5-95.48ZM1630.88,260.83c0-34.21-14.91-57.56-41.32-57.56s-41.29,23.35-41.29,57.56,14.2,56.89,41.29,56.89,41.32-23.03,41.32-56.89Z"/>
          <path fill="#fff" d="M1703.14,260.83c0-54.18,37.92-95.48,95.5-95.48s94.8,41.31,94.8,95.48-37.57,95.48-94.8,95.48-95.5-41.64-95.5-95.48ZM1839.61,260.83c0-34.21-14.91-57.56-41.32-57.56s-41.29,23.35-41.29,57.56,14.2,56.89,41.29,56.89,41.32-23.03,41.32-56.89Z"/>
          <path fill="#fff" d="M1908.8,295.02h50.11c3.05,16.94,15.93,26.42,36.58,26.42,18.98,0,29.81-7.79,29.81-20.65,0-16.25-21.35-18.29-46.39-23.03-32.19-6.09-64.69-14.22-64.69-56.21,0-36.9,33.53-56.2,75.85-56.2,50.11,0,75.18,21.67,79.92,53.15h-49.43c-3.4-12.86-13.56-19.3-30.49-19.3s-26.74,6.78-26.74,18.29c0,13.54,19.62,15.58,44.34,19.97,32.19,5.75,68.76,14.22,68.76,59.6,0,38.95-34.56,59.26-81.27,59.26-52.16,0-83.64-25.05-86.36-61.29Z"/>
          <rect fill="#fff" x="2102.94" y="170.41" width="53.18" height="180.15"/>
          <path fill="#fff" d="M2260.83,204.96v145.61h-53.18v-145.61h-27.09v-34.54h27.09v-15.23c0-19.3,4.74-32.84,15.26-42.33,11.83-10.5,30.46-14.55,53.47-14.22,7.12,0,14.59.34,22.02,1.35v37.92c-26.74-1.01-37.57.69-37.57,21v11.51h37.57v34.54h-37.57Z"/>
          <path fill="#fff" d="M2335.71,410.16v-41.64h2.72c.67.34,15.9.34,17.28.34,16.57,0,24.72-6.09,25.71-18.29,0-6.09-3.05-19.97-9.46-36.23l-55.88-143.92h55.88l23.02,69.09c8.11,24.38,14.91,62.64,14.91,62.64h.67s8.11-38.6,15.9-62.64l22.02-69.09h52.83l-64.34,184.56c-14.59,41.64-31.16,55.86-65.69,55.86-1.7,0-34.56-.34-35.58-.67Z"/>
          <path fill="#FF5B00" d="M2129.7,152.15c15.9,0,28.78-12.9,28.78-28.8,0-15.9-12.88-28.8-28.78-28.8-15.9,0-28.8,12.9-28.8,28.8,0,2.76.39,5.42,1.11,7.94,1.81-1.11,3.95-1.76,6.24-1.76,6.63,0,12,5.37,12,11.98,0,3-1.11,5.74-2.91,7.84,3.75,1.79,7.94,2.79,12.37,2.79Z"/>
        </g>
      </g>
    </svg>
  );
};

export type AuthMode = 'login' | 'register' | 'forgot-password' | 'reset-password' | 'verify-email' | 'email-sent' | 'two-factor';

interface BackgroundProduct {
  id: number;
  title: string;
  brand: string;
  price: string;
  badge: string;
  badgeBg: string;
  image: string;
  installmentPrice: string;
}

const BACKGROUND_PRODUCTS: BackgroundProduct[] = [
  {
    id: 1,
    title: 'iPhone 15 Pro Max',
    brand: 'Apple',
    price: '৳134,990',
    badge: 'BEST SELLER',
    badgeBg: 'bg-blue-500/15 text-blue-300 border-blue-500/20',
    image: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=300&h=300&fit=crop',
    installmentPrice: '৳6,366'
  },
  {
    id: 2,
    title: 'Sony WH-1000XM5',
    brand: 'Sony',
    price: '৳29,990',
    badge: 'BEST SELLER',
    badgeBg: 'bg-blue-500/15 text-blue-300 border-blue-500/20',
    image: 'https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=300&h=300&fit=crop',
    installmentPrice: '৳2,500'
  },
  {
    id: 3,
    title: 'Samsung Galaxy S24 Ultra',
    brand: 'Samsung',
    price: '৳145,000',
    badge: 'HOT DEAL',
    badgeBg: 'bg-[#FF5B00]/15 text-[#FF5B00] border-[#FF5B00]/20',
    image: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=300&h=300&fit=crop',
    installmentPrice: '৳8,660'
  },
  {
    id: 4,
    title: 'Google Pixel 8 Pro',
    brand: 'Google',
    price: '৳139,990',
    badge: 'TOP SPOT',
    badgeBg: 'bg-purple-500/15 text-purple-300 border-purple-500/20',
    image: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=300&h=300&fit=crop',
    installmentPrice: '৳7,680'
  },
  {
    id: 5,
    title: 'MacBook Air M1',
    brand: 'Apple',
    price: '৳146,990',
    badge: 'TOP RATED',
    badgeBg: 'bg-indigo-500/15 text-indigo-300 border-indigo-500/20',
    image: 'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=300&h=300&fit=crop',
    installmentPrice: '৳8,785'
  },
  {
    id: 6,
    title: 'DJI Mini 4 Pro',
    brand: 'DJI',
    price: '৳89,990',
    badge: 'NEW',
    badgeBg: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/20',
    image: 'https://images.unsplash.com/photo-1527977966376-1c8408f9f108?w=300&h=300&fit=crop',
    installmentPrice: '৳6,366'
  },
  {
    id: 7,
    title: 'Nike Air Max 270',
    brand: 'Nike',
    price: '৳12,990',
    badge: 'BEST SELLER',
    badgeBg: 'bg-blue-500/15 text-blue-300 border-blue-500/20',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300&h=300&fit=crop',
    installmentPrice: '৳2,580'
  },
  {
    id: 8,
    title: 'Instax Mini 12',
    brand: 'Fujifilm',
    price: '৳11,990',
    badge: 'BEST SELLER',
    badgeBg: 'bg-blue-500/15 text-blue-300 border-blue-500/20',
    image: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=300&h=300&fit=crop',
    installmentPrice: '৳2,500'
  },
  {
    id: 9,
    title: 'Premium Travel Bag',
    brand: 'Nomatic',
    price: '৳4,590',
    badge: 'HOT DEAL',
    badgeBg: 'bg-[#FF5B00]/15 text-[#FF5B00] border-[#FF5B00]/20',
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=300&h=300&fit=crop',
    installmentPrice: '৳785'
  }
];

export const AuthPage: React.FC = () => {
  const [authMode, setAuthMode] = useState<AuthMode>('login');
  const { setIsLoggedIn, updateCurrentUser, isLoggedIn } = useGlobalState();
  const navigate = useNavigate();
  const location = useLocation();

  // Redirect if already logged in
  useEffect(() => {
    if (isLoggedIn) {
      const destination = (location.state as any)?.from || '/';
      navigate(destination, { replace: true });
    }
  }, [isLoggedIn, navigate, location]);

  // EMI Chat Assistant State
  const [isEmiChatOpen, setIsEmiChatOpen] = useState(false);
  const [emiMessage, setEmiMessage] = useState('');
  const [chatHistory, setChatHistory] = useState<Array<{ sender: 'user' | 'emi'; text: string }>>([
    { sender: 'emi', text: "Hi! I'm EMI, your AI Shopping Assistant. 👋 How can I help you find products, compare brands, or navigate Choosify today?" }
  ]);

  // Form states
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [verificationCode, setVerificationCode] = useState('');
  const [tfaCode, setTfaCode] = useState('');

  const handleSendMessage = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!emiMessage.trim()) return;

    const userText = emiMessage;
    setChatHistory(prev => [...prev, { sender: 'user', text: userText }]);
    setEmiMessage('');

    // Generate response based on keywords
    setTimeout(() => {
      let replyText = "I'm looking into that for you! Choosify offers Bangladesh's smartest product discovery and authentic price comparisons.";
      const text = userText.toLowerCase();

      if (text.includes('iphone') || text.includes('samsung') || text.includes('phone') || text.includes('compare')) {
        replyText = "We offer a direct comparison engine for smartphones! For example, comparing the iPhone 15 Pro Max and Samsung Galaxy S24 Ultra lets you look at specs, official seller ratings, and installment choices side-by-side. Go to the Compare page once you sign in!";
      } else if (text.includes('install') || text.includes('emi') || text.includes('charge') || text.includes('price')) {
        replyText = "Absolutely! Standard product cards feature 0% EMI financing directly from verified partners. You can see installment pricing starting as low as ৳2,500/month!";
      } else if (text.includes('verify') || text.includes('genuine') || text.includes('real')) {
        replyText = "Every single brand partner on Choosify undergoes complete authenticity and license verification. Reviewers with genuine purchases get exclusive 'Verified Buyer' badges so you can trust their reviews completely.";
      } else if (text.includes('hello') || text.includes('hi') || text.includes('hey')) {
        replyText = "Hello! 👋 I'm ready to help you search for brands, calculate EMI budgets, or compare electronic products. What are you looking to buy today?";
      }

      setChatHistory(prev => [...prev, { sender: 'emi', text: replyText }]);
    }, 800);
  };

  const selectSuggestion = (suggestion: string) => {
    setChatHistory(prev => [...prev, { sender: 'user', text: suggestion }]);
    setTimeout(() => {
      let replyText = "";
      if (suggestion.includes('iPhone')) {
        replyText = "Great comparison! 📱 The iPhone 15 Pro Max starts at ৳134,990 (approx ৳6,366/mo EMI), while the Galaxy S24 Ultra is ৳145,000. S24 Ultra excels in camera zoom and built-in S-Pen, while the iPhone is highly efficient with its A17 Pro Chip and titanium build. Both are verified authentic on Choosify!";
      } else if (suggestion.includes('brands')) {
        replyText = "Choosify lists top electronics and fashion brands including Apple, Samsung, Sony, Apex, Nike, and DJI. Every single listing comes from verified official stores and authorized distributors.";
      } else if (suggestion.includes('badges')) {
        replyText = "Verified Buyer badges are given automatically to users who complete their purchase through our integrated checkout. This guarantees 100% authentic and trustworthy product reviews.";
      }
      setChatHistory(prev => [...prev, { sender: 'emi', text: replyText }]);
    }, 600);
  };

  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (authMode === 'login') {
      if (!email.trim() || !password.trim()) {
        toast.error('Please enter your email and password.');
        return;
      }
      
      updateCurrentUser({
        name: fullName || 'Farhan Bin Rafiq',
        email: email,
        avatar: 'https://res.cloudinary.com/djdyqr8yd/image/upload/v1781880900/FBR_n3eycm.png'
      });
      setIsLoggedIn(true);
      toast.success('Successfully logged in! Welcome back.');
      
    } else if (authMode === 'register') {
      if (!fullName.trim() || !email.trim() || !phone.trim() || !password.trim()) {
        toast.error('Please fill out all fields.');
        return;
      }
      if (password !== confirmPassword) {
        toast.error('Passwords do not match.');
        return;
      }
      
      toast.success('Registration details saved. Please verify your email.');
      setAuthMode('verify-email');
      
    } else if (authMode === 'forgot-password') {
      if (!email.trim()) {
        toast.error('Please enter your email address.');
        return;
      }
      toast.success('Reset instructions sent to ' + email);
      setAuthMode('email-sent');
      
    } else if (authMode === 'email-sent') {
      toast.success('Opening system email client...');
      setAuthMode('reset-password');
      
    } else if (authMode === 'reset-password') {
      if (!password.trim()) {
        toast.error('Please enter a new password.');
        return;
      }
      if (password !== confirmPassword) {
        toast.error('Passwords do not match.');
        return;
      }
      toast.success('Password reset successfully. Please sign in.');
      setAuthMode('login');
      
    } else if (authMode === 'verify-email') {
      if (!verificationCode.trim()) {
        toast.error('Please enter the 6-digit verification code.');
        return;
      }
      toast.success('Email verified successfully! Logging you in...');
      updateCurrentUser({
        name: fullName || 'Farhan Bin Rafiq',
        email: email || 'farhanbinrafiq@gmail.com',
        avatar: 'https://res.cloudinary.com/djdyqr8yd/image/upload/v1781880900/FBR_n3eycm.png'
      });
      setIsLoggedIn(true);
      
    } else if (authMode === 'two-factor') {
      if (!tfaCode.trim()) {
        toast.error('Please enter your security code.');
        return;
      }
      toast.success('2FA verification successful!');
      setIsLoggedIn(true);
    }
  };

  const handleSocialLogin = (provider: string) => {
    toast.success(`Connecting securely via ${provider}...`);
    updateCurrentUser({
      name: 'Farhan Bin Rafiq',
      email: 'farhanbinrafiq@gmail.com',
      avatar: 'https://res.cloudinary.com/djdyqr8yd/image/upload/v1781880900/FBR_n3eycm.png'
    });
    setIsLoggedIn(true);
  };

  const columns = [
    [0, 5, 2],
    [1, 6, 8],
    [3, 7, 0],
    [4, 2, 5],
    [8, 1, 3]
  ];

  return (
    <div className="relative min-h-screen w-full flex flex-col justify-between bg-[#000435] text-white font-sans antialiased overflow-x-hidden" id="auth-main-layout">
      
      {/* BACKGROUND GRAPHICS: BLURRED PRODUCT CARDS GRID */}
      <div className="absolute inset-0 z-0 overflow-hidden select-none pointer-events-none" id="auth-background-layer">
        <div className="absolute inset-x-0 top-0 bottom-0 grid grid-cols-2 md:grid-cols-5 gap-6 p-6 opacity-[0.45] blur-[8px] scale-105">
          {columns.map((colIndices, colIdx) => (
            <motion.div
              key={colIdx}
              className={`flex flex-col gap-6 ${colIdx >= 2 ? 'hidden md:flex' : ''}`}
              animate={{
                y: colIdx % 2 === 0 ? [0, -45, 0] : [-45, 0, -45],
              }}
              transition={{
                duration: 25 + colIdx * 5,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              style={{
                marginTop: `${colIdx * 30}px`
              }}
            >
              {colIndices.map((prodIdx, itemIdx) => {
                const product = BACKGROUND_PRODUCTS[prodIdx];
                return (
                  <div
                    key={`${colIdx}-${itemIdx}-${product.id}`}
                    className="bg-white/5 backdrop-blur-md rounded-3xl border border-white/10 p-5 flex flex-col justify-between shadow-2xl h-[300px]"
                  >
                    <div className="flex justify-between items-start">
                      <span className={`text-[8px] font-black tracking-wider uppercase px-2 py-0.5 rounded border ${product.badgeBg}`}>
                        {product.badge}
                      </span>
                    </div>
                    
                    <div className="w-full h-32 my-3 overflow-hidden rounded-2xl bg-black/10 flex items-center justify-center">
                      <img
                        src={product.image}
                        alt={product.title}
                        className="w-full h-full object-cover opacity-80"
                        referrerPolicy="no-referrer"
                      />
                    </div>

                    <div className="text-left">
                      <h4 className="text-xs font-extrabold text-white tracking-tight leading-tight truncate">
                        {product.title}
                      </h4>
                      <p className="text-[9px] text-white/40 font-bold">{product.brand}</p>
                      
                      <div className="flex items-baseline justify-between mt-1">
                        <span className="text-xs font-black text-[#FF5B00]">{product.price}</span>
                        <div className="text-right">
                          <p className="text-[7px] text-white/30 font-bold uppercase leading-none">0% EMI</p>
                          <p className="text-[9px] text-white/80 font-extrabold leading-none">{product.installmentPrice}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </motion.div>
          ))}
        </div>

        {/* Navy Overlay (~80-85% Opacity as requested) */}
        <div className="absolute inset-0 bg-[#000435]/82 z-10" id="dark-navy-overlay" />
        
        {/* Soft Radial Vignette for centering visual focus */}
        <div className="absolute inset-0 z-15 bg-[radial-gradient(circle_at_center,transparent_20%,rgba(0,4,53,0.85)_85%)]" />
        
        {/* Light Glow Highlights */}
        <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] rounded-full bg-[#FF5B00]/10 blur-[130px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full bg-indigo-500/10 blur-[130px]" />
      </div>

      {/* TOP NAVIGATION HEADER */}
      <header className="relative z-30 w-full px-6 lg:px-12 py-5 flex justify-between items-center shrink-0 border-b border-white/5 bg-gradient-to-b from-black/30 to-transparent" id="auth-header-nav">
        <div className="flex items-center">
          <ChoosifyLogo className="h-7 sm:h-[34px] w-auto" />
        </div>
        <div className="flex gap-4 sm:gap-6 items-center">
          <span className="text-xs font-bold text-white/60 hidden sm:inline">Need help?</span>
          <button 
            type="button"
            onClick={() => setIsEmiChatOpen(true)}
            className="bg-white/10 backdrop-blur-md px-5 py-2.5 rounded-full text-xs font-black flex items-center gap-2 border border-white/10 hover:bg-white/20 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer shadow-lg shadow-black/25"
          >
            {/* Mascot Avatar with little hat */}
            <div className="relative w-5 h-5 flex items-center justify-center shrink-0">
              <Bot size={15} className="text-[#FF5B00] animate-bounce" />
              <span className="absolute -top-1 -right-1 flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
            </div>
            <span>Ask EMI</span>
          </button>
        </div>
      </header>

      {/* MAIN LAYOUT WRAPPER */}
      <main className="relative z-20 flex-1 flex flex-col justify-center px-6 lg:px-12 py-8 max-w-7xl mx-auto w-full" id="auth-content-container">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center w-full my-auto">
          
          {/* LEFT COLUMN: BRAND STORYTELLING PANEL */}
          <section className="lg:col-span-5 flex flex-col text-left space-y-6 lg:pr-4" id="brand-prop-column">
            {/* Shoppers Badge */}
            <div className="inline-flex self-start items-center gap-2 bg-gradient-to-r from-[#FF5B00] to-[#EB4501] text-white px-4.5 py-2 rounded-full text-[10px] font-black tracking-wider uppercase shadow-lg shadow-[#FF5B00]/25">
              <Sparkles size={12} className="animate-pulse text-white" />
              <span>Join 100,000+ SHOPPERS</span>
            </div>

            {/* Typography paired Headline */}
            <h1 className="text-4xl sm:text-[45px] lg:text-[48px] font-black tracking-tight leading-[1.1] text-white uppercase font-sans">
              Verify Brands.<br />
              Compare Easily.<br />
              <span className="text-[#FF5B00]">Choose With Confidence</span>
            </h1>

            {/* Promise paragraph */}
            <p className="text-sm sm:text-base text-white/70 max-w-md font-medium leading-relaxed">
              Book Mark Products, Track Your Reviews, and get personalized picks from Bangladesh's #1 Discovery Platform.
            </p>

            {/* Bullet List */}
            <ul className="space-y-3.5 pt-2">
              {[
                "Save unlimited products & brands",
                "Track your reviews & comparisons",
                "Personalised price drop alerts",
                "Verified-buyer badge on reviews"
              ].map((bullet, idx) => (
                <li key={idx} className="flex items-center gap-3 text-xs sm:text-sm font-bold text-white/90">
                  <div className="w-5 h-5 rounded-full bg-[#FF5B00] flex items-center justify-center text-white shrink-0 shadow-md shadow-[#FF5B00]/20">
                    <Check size={11} strokeWidth={4} />
                  </div>
                  <span>{bullet}</span>
                </li>
              ))}
            </ul>

            {/* EMI ASSISTANT WIDGET & FLOATING BUBBLE */}
            <div className="bg-white/5 backdrop-blur-md border border-white/10 p-4.5 rounded-[24px] flex items-start gap-4 max-w-sm mt-8 relative shadow-xl hover:bg-white/[0.08] transition-all" id="emi-mascot-widget">
              <div className="w-10 h-10 rounded-full bg-slate-900 border border-white/10 flex items-center justify-center text-[#FF5B00] shrink-0 shadow-inner relative">
                <Bot size={22} className="animate-pulse" />
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 rounded-full border-2 border-[#000435]" />
              </div>
              <div className="text-xs leading-relaxed text-left flex-1">
                <p className="font-extrabold text-[#FF5B00] text-[10px] uppercase tracking-wider mb-1">Hi! I'm EMI 👋</p>
                <p className="text-white/90 font-bold">Your AI Shopping Assistant.</p>
                <p className="text-white/60 font-semibold mt-0.5">I can help you compare products, discover brands, and make smarter buying decisions.</p>
                <button 
                  onClick={() => setIsEmiChatOpen(true)}
                  className="text-[10px] font-black text-[#FF5B00] hover:text-[#EB4501] mt-2 flex items-center gap-1 uppercase tracking-wider transition-colors"
                >
                  Chat with EMI &rarr;
                </button>
              </div>
            </div>
          </section>

          {/* VERTICAL DIVIDER */}
          <div className="hidden lg:block lg:col-span-1 h-80 w-px bg-white/10 justify-self-center relative">
            <div className="absolute top-1/4 bottom-1/4 left-0 right-0 w-[2px] -ml-px rounded-full bg-gradient-to-b from-[#FF5B00] to-transparent opacity-40" />
          </div>

          {/* RIGHT COLUMN: GLASSMORPHISM AUTH CARD */}
          <section className="lg:col-span-6 flex justify-center items-center lg:justify-end w-full" id="auth-panel-column">
            <div 
              className="bg-white rounded-[32px] shadow-[0_24px_80px_rgba(0,0,0,0.25)] p-8 sm:p-10 w-full max-w-[500px] text-slate-800 flex flex-col justify-center relative overflow-hidden"
              id="auth-card-panel"
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={authMode}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.22 }}
                >
                  {/* Headline & Description */}
                  <div className="mb-6 text-center sm:text-left">
                    <h2 className="text-2xl sm:text-[28px] font-black text-[#000435] leading-none mb-2 tracking-tight">
                      {authMode === 'login' && 'Welcome back'}
                      {authMode === 'register' && 'Create account'}
                      {authMode === 'forgot-password' && 'Forgot password'}
                      {authMode === 'email-sent' && 'Verification Sent'}
                      {authMode === 'reset-password' && 'Create new password'}
                      {authMode === 'verify-email' && 'Verify your email'}
                      {authMode === 'two-factor' && 'Two-factor auth'}
                    </h2>
                    <p className="text-slate-500 font-semibold text-xs leading-normal">
                      {authMode === 'login' && 'Sign in to continue to Choosify'}
                      {authMode === 'register' && 'Join us to discover best products'}
                      {authMode === 'forgot-password' && 'Enter email to receive recovery instructions'}
                      {authMode === 'email-sent' && 'Check your inbox for a password reset link.'}
                      {authMode === 'reset-password' && 'Choose a secure, strong password.'}
                      {authMode === 'verify-email' && 'Please input the 6-digit code we sent you.'}
                      {authMode === 'two-factor' && 'Enter security key from your authenticator app.'}
                    </p>
                  </div>

                  {/* Segmented Switcher for Login / Signup */}
                  {(authMode === 'login' || authMode === 'register') && (
                    <div className="relative flex bg-slate-100/80 p-1 rounded-2xl mb-6 border border-slate-200/40" id="auth-tab-selector">
                      <button
                        type="button"
                        onClick={() => setAuthMode('login')}
                        className={`flex-1 py-2.5 text-xs font-black rounded-xl transition-all relative z-10 ${
                          authMode === 'login' ? 'text-[#000435]' : 'text-slate-500 hover:text-slate-800'
                        }`}
                      >
                        Sign in
                      </button>
                      <button
                        type="button"
                        onClick={() => setAuthMode('register')}
                        className={`flex-1 py-2.5 text-xs font-black rounded-xl transition-all relative z-10 ${
                          authMode === 'register' ? 'text-[#000435]' : 'text-slate-500 hover:text-slate-800'
                        }`}
                      >
                        Sign up
                      </button>
                      
                      {/* Active pill indicator background */}
                      <motion.div
                        className="absolute top-1 bottom-1 bg-white rounded-xl shadow-md z-0"
                        layoutId="activeAuthTabBg"
                        style={{
                          width: 'calc(50% - 4px)',
                          left: authMode === 'login' ? '4px' : 'calc(50% + 0px)'
                        }}
                        transition={{ type: 'spring', stiffness: 350, damping: 28 }}
                      />
                      
                      {/* High precision bottom accent line */}
                      <motion.div
                        className="absolute bottom-1 h-[2px] bg-[#FF5B00] rounded-full z-15"
                        layoutId="activeAuthTabLine"
                        style={{
                          width: '40px',
                          left: authMode === 'login' ? 'calc(25% - 20px)' : 'calc(75% - 20px)'
                        }}
                        transition={{ type: 'spring', stiffness: 350, damping: 28 }}
                      />
                    </div>
                  )}

                  {/* Dynamic Form fields block */}
                  <form onSubmit={handleAuthSubmit} className="space-y-4">
                    {authMode === 'register' && (
                      <div className="relative">
                        <User className="absolute left-4.5 top-4.5 text-slate-400 pointer-events-none" size={18} />
                        <input
                          type="text"
                          required
                          placeholder="Full Name"
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          className="w-full bg-slate-50 h-13 pl-12 pr-4 rounded-2xl text-slate-950 placeholder-slate-400 focus:placeholder-slate-500 outline-none font-bold text-xs focus:ring-2 focus:ring-[#FF5B00]/10 transition-all border border-slate-200/50 focus:bg-white focus:border-[#FF5B00]/40"
                        />
                      </div>
                    )}

                    {(authMode === 'login' || authMode === 'register' || authMode === 'forgot-password') && (
                      <div className="relative">
                        <Mail className="absolute left-4.5 top-4.5 text-slate-400 pointer-events-none" size={18} />
                        <input
                          type="email"
                          required
                          placeholder="Email address"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="w-full bg-slate-50 h-13 pl-12 pr-4 rounded-2xl text-slate-950 placeholder-slate-400 focus:placeholder-slate-500 outline-none font-bold text-xs focus:ring-2 focus:ring-[#FF5B00]/10 transition-all border border-slate-200/50 focus:bg-white focus:border-[#FF5B00]/40"
                        />
                      </div>
                    )}

                    {authMode === 'register' && (
                      <div className="relative">
                        <Phone className="absolute left-4.5 top-4.5 text-slate-400 pointer-events-none" size={18} />
                        <input
                          type="tel"
                          required
                          placeholder="Phone number"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          className="w-full bg-slate-50 h-13 pl-12 pr-4 rounded-2xl text-slate-950 placeholder-slate-400 focus:placeholder-slate-500 outline-none font-bold text-xs focus:ring-2 focus:ring-[#FF5B00]/10 transition-all border border-slate-200/50 focus:bg-white focus:border-[#FF5B00]/40"
                        />
                      </div>
                    )}

                    {(authMode === 'login' || authMode === 'register' || authMode === 'reset-password') && (
                      <div className="relative">
                        <Lock className="absolute left-4.5 top-4.5 text-slate-400 pointer-events-none" size={18} />
                        <input
                          type={showPassword ? 'text' : 'password'}
                          required
                          placeholder={authMode === 'reset-password' ? 'New Password' : 'Password'}
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="w-full bg-slate-50 h-13 pl-12 pr-12 rounded-2xl text-slate-950 placeholder-slate-400 focus:placeholder-slate-500 outline-none font-bold text-xs focus:ring-2 focus:ring-[#FF5B00]/10 transition-all border border-slate-200/50 focus:bg-white focus:border-[#FF5B00]/40"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-4.5 top-4.5 text-slate-400 hover:text-[#000435] transition-colors"
                        >
                          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                      </div>
                    )}

                    {(authMode === 'register' || authMode === 'reset-password') && (
                      <div className="relative">
                        <Lock className="absolute left-4.5 top-4.5 text-slate-400 pointer-events-none" size={18} />
                        <input
                          type={showConfirmPassword ? 'text' : 'password'}
                          required
                          placeholder="Confirm Password"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          className="w-full bg-slate-50 h-13 pl-12 pr-12 rounded-2xl text-slate-950 placeholder-slate-400 focus:placeholder-slate-500 outline-none font-bold text-xs focus:ring-2 focus:ring-[#FF5B00]/10 transition-all border border-slate-200/50 focus:bg-white focus:border-[#FF5B00]/40"
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-4.5 top-4.5 text-slate-400 hover:text-[#000435] transition-colors"
                        >
                          {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                      </div>
                    )}

                    {authMode === 'verify-email' && (
                      <div className="relative">
                        <ShieldCheck className="absolute left-4.5 top-4.5 text-slate-400 pointer-events-none" size={18} />
                        <input
                          type="text"
                          required
                          maxLength={6}
                          placeholder="6-digit verification code"
                          value={verificationCode}
                          onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, ''))}
                          className="w-full bg-slate-50 h-13 pl-12 pr-4 rounded-2xl text-slate-950 placeholder-slate-400 tracking-widest text-center outline-none font-black text-sm focus:ring-2 focus:ring-[#FF5B00]/10 transition-all border border-slate-200/50 focus:bg-white focus:border-[#FF5B00]/40"
                        />
                      </div>
                    )}

                    {authMode === 'two-factor' && (
                      <div className="relative">
                        <ShieldCheck className="absolute left-4.5 top-4.5 text-slate-400 pointer-events-none" size={18} />
                        <input
                          type="text"
                          required
                          maxLength={6}
                          placeholder="2FA security code"
                          value={tfaCode}
                          onChange={(e) => setTfaCode(e.target.value.replace(/\D/g, ''))}
                          className="w-full bg-slate-50 h-13 pl-12 pr-4 rounded-2xl text-slate-950 placeholder-slate-400 tracking-widest text-center outline-none font-black text-sm focus:ring-2 focus:ring-[#FF5B00]/10 transition-all border border-slate-200/50 focus:bg-white focus:border-[#FF5B00]/40"
                        />
                      </div>
                    )}

                    {authMode === 'email-sent' && (
                      <div className="flex flex-col items-center justify-center py-4 text-center">
                        <div className="w-14 h-14 bg-[#FF5B00]/10 text-[#FF5B00] rounded-full flex items-center justify-center mb-3">
                          <CheckCircle size={30} />
                        </div>
                        <p className="text-xs font-bold text-slate-500 max-w-sm leading-relaxed">
                          We sent a recovery link to <strong className="text-slate-800">{email || 'your email'}</strong>. Click it to reset your password.
                        </p>
                      </div>
                    )}

                    {/* Remember me & Forgot Password Row */}
                    {authMode === 'login' && (
                      <div className="flex justify-between items-center text-xs pt-1">
                        <label className="flex items-center gap-2 text-slate-500 font-bold cursor-pointer select-none">
                          <input
                            type="checkbox"
                            checked={rememberMe}
                            onChange={(e) => setRememberMe(e.target.checked)}
                            className="accent-[#FF5B00] w-4.5 h-4.5 rounded border-slate-300"
                          />
                          Remember me
                        </label>
                        <button
                          type="button"
                          onClick={() => setAuthMode('forgot-password')}
                          className="text-[#FF5B00] hover:text-[#EB4501] font-black transition-colors cursor-pointer"
                        >
                          Forgot password?
                        </button>
                      </div>
                    )}

                    {/* CTA Primary Submit Button */}
                    <button
                      type="submit"
                      className="btn-primary w-full mt-5 h-13 text-xs uppercase tracking-wider flex items-center justify-center gap-2"
                    >
                      <span>
                        {authMode === 'login' && 'Sign in to Choosify'}
                        {authMode === 'register' && 'Sign up for Choosify'}
                        {authMode === 'forgot-password' && 'Send Reset Link'}
                        {authMode === 'email-sent' && 'Open Email Client'}
                        {authMode === 'reset-password' && 'Reset Password'}
                        {authMode === 'verify-email' && 'Verify & Continue'}
                        {authMode === 'two-factor' && 'Verify and Login'}
                      </span>
                      <ArrowRight size={16} />
                    </button>
                  </form>

                  {/* Social Logins - Standard 3-column Grid */}
                  {(authMode === 'login' || authMode === 'register') && (
                    <div className="mt-6">
                      <div className="relative flex py-3 items-center">
                        <div className="flex-grow border-t border-slate-100"></div>
                        <span className="flex-shrink mx-3 text-slate-400 text-[10px] font-black uppercase tracking-widest">OR</span>
                        <div className="flex-grow border-t border-slate-100"></div>
                      </div>

                      <div className="flex flex-col gap-2.5">
                        {/* Google Social Button */}
                        <button
                          type="button"
                          onClick={() => handleSocialLogin('Google')}
                          className="btn-outline w-full h-11 text-[11px] flex items-center justify-center gap-2.5 shadow-sm"
                        >
                          <svg className="w-4.5 h-4.5 shrink-0" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05" />
                            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335" />
                          </svg>
                          <span>Continue with Google</span>
                        </button>

                        <div className="grid grid-cols-2 gap-2.5">
                          <button
                            type="button"
                            onClick={() => handleSocialLogin('Facebook')}
                            className="btn-outline w-full h-11 text-[11px] flex items-center justify-center gap-2 shadow-sm"
                          >
                            <svg className="w-4.5 h-4.5 shrink-0" viewBox="0 0 24 24" fill="#1877F2" xmlns="http://www.w3.org/2000/svg">
                              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                            </svg>
                            <span>Facebook</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => handleSocialLogin('Apple')}
                            className="btn-outline w-full h-11 text-[11px] flex items-center justify-center gap-2 shadow-sm"
                          >
                            <svg className="w-4.5 h-4.5 shrink-0" viewBox="0 0 24 24" fill="#000000" xmlns="http://www.w3.org/2000/svg">
                              <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 4.17c.66-.81 1.11-1.93.99-3.06-1 .04-2.21.67-2.93 1.49-.62.69-1.16 1.84-1.01 2.96 1.12.09 2.27-.58 2.95-1.39" />
                            </svg>
                            <span>Apple</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Switch to reverse view links */}
                  <div className="mt-6 pt-5 border-t border-slate-100 text-center">
                    {authMode === 'login' && (
                      <p className="text-xs font-bold text-slate-500">
                        New to Choosify?{' '}
                        <button
                          type="button"
                          onClick={() => setAuthMode('register')}
                          className="text-[#FF5B00] hover:text-[#EB4501] font-black cursor-pointer hover:underline"
                        >
                          Sign up
                        </button>
                      </p>
                    )}

                    {authMode === 'register' && (
                      <p className="text-xs font-bold text-slate-500">
                        Already have an account?{' '}
                        <button
                          type="button"
                          onClick={() => setAuthMode('login')}
                          className="text-[#FF5B00] hover:text-[#EB4501] font-black cursor-pointer hover:underline"
                        >
                          Sign in
                        </button>
                      </p>
                    )}

                    {authMode === 'forgot-password' && (
                      <button
                        type="button"
                        onClick={() => setAuthMode('login')}
                        className="text-xs font-black text-[#FF5B00] hover:text-[#EB4501]"
                      >
                        Back to Sign in
                      </button>
                    )}

                    {authMode === 'email-sent' && (
                      <div className="flex flex-col gap-2.5 justify-center items-center">
                        <button
                          type="button"
                          onClick={() => setAuthMode('forgot-password')}
                          className="text-xs font-black text-[#FF5B00] hover:text-[#EB4501] flex items-center gap-1.5"
                        >
                          <RefreshCw size={11} /> Resend verification email
                        </button>
                        <button
                          type="button"
                          onClick={() => setAuthMode('login')}
                          className="text-xs font-black text-slate-500 hover:text-[#000435]"
                        >
                          Back to Sign in
                        </button>
                      </div>
                    )}

                    {authMode === 'reset-password' && (
                      <button
                        type="button"
                        onClick={() => setAuthMode('login')}
                        className="text-xs font-black text-[#FF5B00] hover:text-[#EB4501]"
                      >
                        Back to Sign in
                      </button>
                    )}

                    {authMode === 'verify-email' && (
                      <div className="flex flex-col gap-2.5 justify-center items-center">
                        <button
                          type="button"
                          onClick={() => toast.success('A new 6-digit verification code has been sent!')}
                          className="text-xs font-black text-[#FF5B00] hover:text-[#EB4501]"
                        >
                          Resend verification code
                        </button>
                        <button
                          type="button"
                          onClick={() => setAuthMode('login')}
                          className="text-xs font-black text-slate-500 hover:text-[#000435]"
                        >
                          Back to Sign in
                        </button>
                      </div>
                    )}

                    {authMode === 'two-factor' && (
                      <button
                        type="button"
                        onClick={() => setAuthMode('login')}
                        className="text-xs font-black text-[#FF5B00] hover:text-[#EB4501]"
                      >
                        Back to Sign in
                      </button>
                    )}
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </section>

        </div>

        {/* TRUST BANNER BAR */}
        <div className="w-full mt-10 z-10" id="trust-banner-wrapper">
          <div className="bg-white/5 backdrop-blur-md rounded-3xl border border-white/5 p-6 md:p-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-4 divide-y md:divide-y-0 md:divide-x divide-white/10">
              
              {/* Feature 1 */}
              <div className="flex items-start gap-4 text-left pb-6 md:pb-0 md:px-4">
                <div className="w-11 h-11 rounded-2xl bg-[#FF5B00]/10 text-[#FF5B00] border border-[#FF5B00]/25 flex items-center justify-center shrink-0">
                  <ShieldCheck size={22} />
                </div>
                <div>
                  <h3 className="text-xs font-black text-white tracking-wide uppercase mb-1">Trust You Can Rely On</h3>
                  <p className="text-[11px] text-white/55 font-bold leading-relaxed">
                    We verify brands and sellers so you can shop with complete confidence.
                  </p>
                </div>
              </div>

              {/* Feature 2 */}
              <div className="flex items-start gap-4 text-left pt-6 md:pt-0 md:px-6">
                <div className="w-11 h-11 rounded-2xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/25 flex items-center justify-center shrink-0">
                  <Award size={22} />
                </div>
                <div>
                  <h3 className="text-xs font-black text-white tracking-wide uppercase mb-1">Safe & Secure Platform</h3>
                  <p className="text-[11px] text-white/55 font-bold leading-relaxed">
                    Your data and payments are protected with enterprise-grade security.
                  </p>
                </div>
              </div>

              {/* Feature 3 */}
              <div className="flex items-start gap-4 text-left pt-6 md:pt-0 md:pl-6">
                <div className="w-11 h-11 rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/25 flex items-center justify-center shrink-0">
                  <CheckCircle size={22} />
                </div>
                <div>
                  <h3 className="text-xs font-black text-white tracking-wide uppercase mb-1">Genuine Products Only</h3>
                  <p className="text-[11px] text-white/55 font-bold leading-relaxed">
                    All products are authentic, quality-checked and 100% reliable.
                  </p>
                </div>
              </div>

            </div>
          </div>
        </div>
      </main>

      {/* FOOTER */}
      <footer className="relative z-30 w-full bg-[#00021A] py-6 px-6 lg:px-12 shrink-0 border-t border-white/5 text-xs text-white/50" id="auth-footer-bar">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          
          {/* Logo & Description */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left gap-2 max-w-sm">
            <ChoosifyLogo className="h-5 w-auto" />
            <p className="text-[11px] font-bold text-white/40 leading-normal">
              Bangladesh's smartest product discovery platform. Find the best brands, compare prices and shop with confidence.
            </p>
          </div>

          {/* Slogan */}
          <div className="text-center md:text-left text-xs font-bold">
            Choose <span className="text-[#FF5B00] font-black">Easy</span>. Compare & Decide <span className="text-[#FF5B00] font-black">Wisely.</span>
          </div>

          {/* Social Row */}
          <div className="flex items-center gap-3">
            <a href="https://facebook.com" target="_blank" rel="noreferrer" className="w-8 h-8 rounded-full bg-white/5 hover:bg-[#FF5B00]/10 border border-white/10 hover:border-[#FF5B00] flex items-center justify-center text-white hover:text-[#FF5B00] transition-all">
              <Facebook size={14} />
            </a>
            <a href="https://instagram.com" target="_blank" rel="noreferrer" className="w-8 h-8 rounded-full bg-white/5 hover:bg-[#FF5B00]/10 border border-white/10 hover:border-[#FF5B00] flex items-center justify-center text-white hover:text-[#FF5B00] transition-all">
              <Instagram size={14} />
            </a>
            <a href="https://tiktok.com" target="_blank" rel="noreferrer" className="w-8 h-8 rounded-full bg-white/5 hover:bg-[#FF5B00]/10 border border-white/10 hover:border-[#FF5B00] flex items-center justify-center text-white hover:text-[#FF5B00] transition-all">
              <TikTokIcon size={14} />
            </a>
            <a href="https://youtube.com" target="_blank" rel="noreferrer" className="w-8 h-8 rounded-full bg-white/5 hover:bg-[#FF5B00]/10 border border-white/10 hover:border-[#FF5B00] flex items-center justify-center text-white hover:text-[#FF5B00] transition-all">
              <Youtube size={14} />
            </a>
          </div>

          {/* Copyright & Country dropdown */}
          <div className="flex flex-col sm:flex-row items-center gap-4 text-center sm:text-right font-semibold">
            <span>&copy; 2026 Choosify. All rights reserved.</span>
            
            <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-3 py-1 text-[10px] uppercase font-black hover:bg-white/10 transition-colors cursor-pointer">
              <svg className="w-4 h-3 rounded-sm shrink-0" viewBox="0 0 20 12" xmlns="http://www.w3.org/2000/svg">
                <rect width="20" height="12" fill="#006a4e" />
                <circle cx="9" cy="6" r="4" fill="#f42a41" />
              </svg>
              <span>Bangladesh | BDT</span>
              <ChevronDown size={11} className="text-white/40" />
            </div>
          </div>

        </div>
      </footer>

      {/* DEV FLOOR CONTROLLER (HIDDEN/SMALL AT BOTTOM FOR VERIFICATION) */}
      <div className="fixed bottom-24 right-6 z-40 bg-slate-900/90 backdrop-blur-md rounded-2xl border border-[#FF5B00]/20 p-2 shadow-2xl flex flex-col gap-1" id="dev-flow-auditor">
        <div className="text-[8px] font-black tracking-widest text-[#FF5B00] px-2 py-0.5 border-b border-white/10 uppercase mb-0.5">
          DEV PREVIEW
        </div>
        <div className="flex flex-wrap gap-1 max-w-[150px]">
          {(['login', 'register', 'forgot-password', 'verify-email', 'two-factor'] as AuthMode[]).map((mode) => (
            <button
              key={mode}
              onClick={() => setAuthMode(mode)}
              className={`px-1.5 py-0.5 rounded text-[8px] font-extrabold uppercase transition-all ${
                authMode === mode 
                  ? 'bg-[#FF5B00] text-white' 
                  : 'bg-white/5 text-white/60 hover:bg-white/10'
              }`}
            >
              {mode.replace('-', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* EMI AI CHAT DRAWER */}
      <AnimatePresence>
        {isEmiChatOpen && (
          <div className="fixed inset-0 z-50 flex justify-end" id="emi-chat-overlay">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsEmiChatOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />

            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 320, damping: 28 }}
              className="relative w-full max-w-[420px] h-full bg-[#000435] border-l border-white/10 shadow-2xl flex flex-col justify-between z-10 text-white"
            >
              {/* Header */}
              <div className="p-5 border-b border-white/10 flex items-center justify-between bg-gradient-to-r from-[#000435] to-[#FF5B00]/10">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#FF5B00]/15 flex items-center justify-center text-[#FF5B00] border border-[#FF5B00]/20 animate-pulse">
                    <Bot size={20} />
                  </div>
                  <div>
                    <h4 className="text-sm font-black">Ask EMI AI Assistant</h4>
                    <span className="text-[10px] text-emerald-400 font-extrabold flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping inline-block" />
                      Active & Ready
                    </span>
                  </div>
                </div>
                <button 
                  onClick={() => setIsEmiChatOpen(false)}
                  className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center hover:text-white text-white/60 transition-colors"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Chat messages */}
              <div className="flex-1 overflow-y-auto p-5 space-y-4" id="emi-message-history">
                {chatHistory.map((msg, i) => (
                  <div key={i} className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>
                    <div className={`p-4 rounded-2xl max-w-[85%] text-xs font-bold leading-relaxed shadow-md ${
                      msg.sender === 'user' 
                        ? 'bg-[#FF5B00] text-white rounded-tr-none' 
                        : 'bg-white/5 border border-white/10 text-white/90 rounded-tl-none'
                    }`}>
                      {msg.text}
                    </div>
                    <span className="text-[9px] text-white/30 font-bold mt-1 uppercase">
                      {msg.sender === 'user' ? 'You' : 'EMI'}
                    </span>
                  </div>
                ))}
              </div>

              {/* Sugestions */}
              <div className="px-5 py-2 border-t border-white/5 space-y-2">
                <span className="text-[9px] font-black uppercase tracking-wider text-white/40 block">Suggested Questions:</span>
                <div className="flex flex-col gap-1.5">
                  {[
                    "Compare iPhone 15 Pro Max and Samsung S24",
                    "What top brand stores are verified on Choosify?",
                    "How can I get a Verified Buyer Badge?"
                  ].map((s, idx) => (
                    <button
                      key={idx}
                      onClick={() => selectSuggestion(s)}
                      className="text-left px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 hover:border-[#FF5B00]/40 text-[11px] font-bold text-white/80 hover:text-white transition-all hover:bg-white/[0.07]"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              {/* Send message */}
              <form onSubmit={handleSendMessage} className="p-5 border-t border-white/10 bg-slate-900/50 flex gap-2">
                <input
                  type="text"
                  placeholder="Ask EMI anything..."
                  value={emiMessage}
                  onChange={(e) => setEmiMessage(e.target.value)}
                  className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs text-white placeholder-white/40 focus:outline-none focus:border-[#FF5B00]/50 font-bold"
                />
                <button
                  type="submit"
                  className="w-11 h-11 rounded-xl bg-[#FF5B00] hover:bg-[#EB4501] text-white flex items-center justify-center transition-all cursor-pointer shadow-lg shadow-[#FF5B00]/15"
                >
                  <Send size={16} />
                </button>
              </form>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};
