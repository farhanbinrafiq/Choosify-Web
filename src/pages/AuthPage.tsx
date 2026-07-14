import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Bot, Sparkles, Check, ShieldCheck, Award, MessageSquare, 
  Facebook, Instagram, Youtube, HelpCircle, ChevronDown, X, Send 
} from 'lucide-react';
import { AuthBackground } from '../components/auth/AuthBackground';
import { AuthCard, AuthMode } from '../components/auth/AuthCard';
import toast from 'react-hot-toast';

// Inline TikTok icon component
function TikTokIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.02 1.73 4.1 1.12 1.09 2.62 1.7 4.18 1.8v3.91c-1.85-.01-3.61-.68-5.07-1.82V14.5c.04 3.39-2.14 6.55-5.4 7.63-3.25 1.08-6.9-.32-8.56-3.32C1.65 15.82 2.45 11.9 5.31 9.87c1.78-1.27 4.14-1.55 6.16-.72.01-.16.02-.32.02-.48V4.83c-1.41-.35-2.88-.16-4.16.54-2.1 1.15-3.35 3.51-3.14 5.92.21 2.42 2.01 4.54 4.38 5.17 2.37.64 4.96-.2 6.09-2.26.47-.86.7-1.84.66-2.82V.02Z" />
    </svg>
  );
}

// Master logo path component
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

export const AuthPage: React.FC = () => {
  // Current active mode inside AuthCard (for demonstration and preview selection)
  const [authMode, setAuthMode] = useState<AuthMode>('login');
  
  // EMI Chat Assistant Open State
  const [isEmiChatOpen, setIsEmiChatOpen] = useState(false);
  const [emiMessage, setEmiMessage] = useState('');
  const [chatHistory, setChatHistory] = useState<Array<{ sender: 'user' | 'emi'; text: string }>>([
    { sender: 'emi', text: "Hi! I'm EMI, your AI Shopping Assistant. 👋 How can I help you find products, compare brands, or navigate Choosify today?" }
  ]);

  const handleSendMessage = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!emiMessage.trim()) return;

    const userText = emiMessage;
    setChatHistory(prev => [...prev, { sender: 'user', text: userText }]);
    setEmiMessage('');

    // Generate responsive reply based on keywords
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

  return (
    <div className="relative min-h-screen lg:h-screen w-full overflow-y-auto lg:overflow-hidden flex flex-col justify-between bg-[#000435] text-white font-sans antialiased" id="auth-main-layout">
      {/* Background layer */}
      <AuthBackground />

      {/* TOP FLOATING NAVIGATION */}
      <header className="relative z-30 w-full px-6 lg:px-12 py-5 flex justify-between items-center shrink-0 border-b border-white/5 bg-gradient-to-b from-black/20 to-transparent" id="auth-header-nav">
        <div className="flex items-center">
          <ChoosifyLogo className="h-7 sm:h-9 w-auto" />
        </div>
        <div className="flex gap-4 sm:gap-6 items-center">
          <span className="text-xs font-bold text-white/60 hidden sm:inline">Need help?</span>
          <button 
            type="button"
            onClick={() => setIsEmiChatOpen(true)}
            className="bg-white/10 backdrop-blur-md px-5 py-2.5 rounded-full text-xs font-black flex items-center gap-2 border border-white/10 hover:bg-white/25 hover:scale-[1.03] transition-all cursor-pointer shadow-lg shadow-black/10 hover:shadow-[#FF5B00]/10"
          >
            <Bot size={16} className="text-[#FF5B00] animate-bounce" />
            <span>Ask EMI</span>
          </button>
        </div>
      </header>

      {/* MAIN TWO-COLUMN CONTENT GRID */}
      <main className="relative z-20 flex-1 flex flex-col justify-center px-6 lg:px-12 py-6 max-w-7xl mx-auto w-full overflow-hidden" id="auth-content-container">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center w-full my-auto">
          
          {/* Left Column: Brand Story / Value Proposition (38%) */}
          <section className="lg:col-span-5 flex flex-col text-left space-y-6 lg:pr-6" id="brand-prop-column">
            {/* Join Shoppers Badge */}
            <div className="inline-flex self-start items-center gap-2 bg-[#FF5B00] text-white px-4 py-1.5 rounded-full text-xs font-black tracking-wider uppercase shadow-md shadow-[#FF5B00]/20 hover:scale-[1.02] transition-transform">
              <Sparkles size={13} className="animate-spin-slow text-white" />
              <span>Join 100,000+ Shoppers</span>
            </div>

            {/* Headline */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-[1.12] text-white">
              Verify Brands.<br />
              Compare Easily.<br />
              <span className="text-[#FF5B00] relative">
                Choose With Confidence.
                <span className="absolute left-0 right-0 -bottom-1 h-1 bg-[#FF5B00]/20 rounded-full" />
              </span>
            </h1>

            {/* Paragraph */}
            <p className="text-sm sm:text-base text-white/70 max-w-md font-semibold leading-relaxed">
              Book Mark Products, Track Your Reviews, and get personalized picks from Bangladesh's #1 Discovery Platform
            </p>

            {/* Spacing Divider / bullet list */}
            <ul className="space-y-4 pt-2">
              {[
                "Save unlimited products & brands",
                "Track your reviews & comparisons",
                "Personalised price drop alerts",
                "Verified-buyer badge on reviews"
              ].map((bullet, idx) => (
                <li key={idx} className="flex items-center gap-3 text-sm font-bold text-white/90 hover:translate-x-1 transition-transform">
                  <div className="w-5 h-5 rounded-full bg-[#FF5B00] flex items-center justify-center text-white shrink-0 shadow-md shadow-[#FF5B00]/15">
                    <Check size={12} strokeWidth={4} />
                  </div>
                  <span>{bullet}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* Subtle Vertical Divider */}
          <div className="hidden lg:block lg:col-span-1 h-80 w-px bg-white/10 justify-self-center relative">
            <div className="absolute top-1/4 bottom-1/4 left-0 right-0 w-[3px] -ml-px rounded-full bg-gradient-to-b from-[#FF5B00] to-transparent opacity-60" />
          </div>

          {/* Right Column: Floating White Auth Card (62%) */}
          <section className="lg:col-span-6 flex flex-col justify-center items-center lg:items-end w-full" id="auth-panel-column">
            <AuthCard currentMode={authMode} onModeChange={(mode) => setAuthMode(mode)} />
          </section>
        </div>

        {/* TRUST BANNER ROW */}
        <div className="w-full mt-10" id="trust-banner-wrapper">
          <div className="bg-white/5 backdrop-blur-md rounded-[32px] border border-white/5 p-6 lg:p-8 shadow-[0_12px_40px_rgba(0,0,0,0.15)]">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-6 divide-y md:divide-y-0 md:divide-x divide-white/10">
              
              {/* Feature 1 */}
              <div className="flex items-start gap-4 text-left pb-6 md:pb-0 md:px-4">
                <div className="w-12 h-12 rounded-2xl bg-[#FF5B00]/10 text-[#FF5B00] border border-[#FF5B00]/25 flex items-center justify-center shrink-0 shadow-lg shadow-[#FF5B00]/5">
                  <ShieldCheck size={24} className="glow-orange" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-white tracking-wide uppercase mb-1">Trust You Can Rely On</h3>
                  <p className="text-xs text-white/55 font-bold leading-relaxed">
                    We verify brands and sellers so you can shop with complete confidence.
                  </p>
                </div>
              </div>

              {/* Feature 2 */}
              <div className="flex items-start gap-4 text-left pt-6 md:pt-0 md:px-6">
                <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/25 flex items-center justify-center shrink-0 shadow-lg shadow-indigo-500/5">
                  <Award size={24} className="glow-indigo" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-white tracking-wide uppercase mb-1">Safe & Secure Platform</h3>
                  <p className="text-xs text-white/55 font-bold leading-relaxed">
                    Your data and payments are protected with enterprise-grade security.
                  </p>
                </div>
              </div>

              {/* Feature 3 */}
              <div className="flex items-start gap-4 text-left pt-6 md:pt-0 md:pl-6">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/25 flex items-center justify-center shrink-0 shadow-lg shadow-emerald-500/5">
                  <Check className="w-6 h-6 text-emerald-400 glow-emerald" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-white tracking-wide uppercase mb-1">Genuine Products Only</h3>
                  <p className="text-xs text-white/55 font-bold leading-relaxed">
                    All products are authentic, quality-checked and 100% reliable.
                  </p>
                </div>
              </div>

            </div>
          </div>
        </div>
      </main>

      {/* FOOTER BAR CONTAINER */}
      <footer className="relative z-30 w-full bg-[#00021A] py-6 px-6 lg:px-12 shrink-0 border-t border-white/5 text-xs text-white/50" id="auth-footer-bar">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          
          {/* Logo & Slogan sector */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left gap-2 max-w-sm">
            <ChoosifyLogo className="h-5 w-auto" />
            <p className="text-[11px] font-bold text-white/40 leading-normal">
              Bangladesh's smartest product discovery platform. Find the best brands, compare prices and shop with confidence.
            </p>
          </div>

          {/* Slogan */}
          <div className="text-center md:text-left text-xs font-bold">
            Choose <span className="text-[#FF5B00] font-black">Easy</span>, Compare & Decide <span className="text-[#FF5B00] font-black">Wisely.</span>
          </div>

          {/* Social icons row */}
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

          {/* Copyright & Country/Currency selector dropdown */}
          <div className="flex flex-col sm:flex-row items-center gap-4 text-center sm:text-right font-semibold">
            <span>&copy; 2026 Choosify. All rights reserved.</span>
            
            {/* Country Pill */}
            <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-3 py-1 text-[10px] uppercase font-black hover:bg-white/10 transition-colors cursor-pointer">
              <svg className="w-4 h-3 rounded-sm shrink-0" viewBox="0 0 20 12" xmlns="http://www.w3.org/2000/svg">
                <rect width="20" height="12" fill="#006a4e" />
                <circle cx="9" cy="6" r="4" fill="#f42a41" />
              </svg>
              <span>Bangladesh | BDT</span>
              <ChevronDown size={12} className="text-white/40" />
            </div>
          </div>

        </div>
      </footer>

      {/* DEV FLOATING PREVIEW CONTROLLER */}
      <div className="fixed bottom-24 right-6 z-40 bg-slate-900/90 backdrop-blur-md rounded-2xl border border-[#FF5B00]/20 p-2 shadow-2xl flex flex-col gap-1.5" id="dev-flow-auditor">
        <div className="text-[9px] font-black tracking-widest text-[#FF5B00] px-2 py-0.5 border-b border-white/10 uppercase mb-1">
          DEV: PREVIEW FLOWS
        </div>
        <div className="grid grid-cols-2 sm:flex sm:flex-row gap-1">
          {(['login', 'register', 'forgot-password', 'reset-password', 'verify-email', 'email-sent', 'two-factor'] as AuthMode[]).map((mode) => (
            <button
              key={mode}
              onClick={() => setAuthMode(mode)}
              className={`px-2 py-1 rounded text-[9px] font-extrabold uppercase transition-all ${
                authMode === mode 
                  ? 'bg-[#FF5B00] text-white shadow-md' 
                  : 'bg-white/5 text-white/70 hover:bg-white/10 hover:text-white'
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
            {/* Backdrop click closer */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsEmiChatOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />

            {/* Chat drawer body */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="relative w-full max-w-[420px] h-full bg-[#000435] border-l border-white/10 shadow-2xl flex flex-col justify-between z-10 text-white"
            >
              {/* Header */}
              <div className="p-5 border-b border-white/10 flex items-center justify-between bg-gradient-to-r from-navy to-[#FF5B00]/10">
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

              {/* Chat Message Lists */}
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

              {/* Suggestions chips */}
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

              {/* Message Input Bar */}
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
