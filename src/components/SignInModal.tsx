import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Mail, Lock, LogIn, Github, ArrowRight, Search } from 'lucide-react';
import toast from 'react-hot-toast';
import { useGlobalState } from '../context/GlobalStateContext';

interface SignInModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SignInModal({ isOpen, onClose }: SignInModalProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { setIsLoggedIn } = useGlobalState();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Please enter your email and password.');
      return;
    }
    if (!email.includes('@')) {
      toast.error('Please enter a valid email address.');
      return;
    }
    if (password.length < 6) {
      toast.error('Password must be at least 6 characters.');
      return;
    }

    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setIsLoading(false);
    setIsLoggedIn(true);
    toast.success('Welcome back!');
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[250] flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-md"
          />
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-md bg-[#0A0A1F] border border-white/10 rounded-[32px] overflow-hidden shadow-2xl"
          >
            {/* Visual Flair */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-orange-primary/10 blur-[60px] rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none" />
            
            {/* Improved Close Button */}
            <button 
              onClick={onClose}
              className="absolute top-6 right-6 w-10 h-10 bg-white/5 hover:bg-white/10 border border-white/10 text-white flex items-center justify-center rounded-full transition-all group/close z-[120] backdrop-blur-md shadow-xl"
              aria-label="Close modal"
            >
              <X size={20} className="group-hover/close:rotate-90 transition-transform duration-300" />
            </button>
            
            <div className="relative z-10">
              <div className="p-10 pt-16">
                <div className="mb-10 text-center">
                <div className="w-16 h-16 bg-orange-primary/10 rounded-2xl flex items-center justify-center text-orange-primary mx-auto mb-6 border border-orange-primary/20 shadow-2xl">
                  <LogIn size={32} />
                </div>
                <h2 className="text-3xl font-black text-white italic uppercase tracking-tighter mb-2">Welcome <span className="text-orange-primary">Back</span></h2>
                <p className="text-gray-400 text-[10px] font-bold uppercase tracking-[0.2em] italic">Unlock the full Choosify.bd experience</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[9px] font-black text-white/40 uppercase tracking-widest italic ml-1">Email Protocol</label>
                  <div className="relative">
                    <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-white/20" size={18} />
                    <input 
                      type="email" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="discovery@choosify.bd"
                      className="w-full h-14 bg-white/5 border border-white/10 rounded-2xl pl-14 pr-6 text-white text-sm font-bold placeholder:text-white/10 focus:outline-none focus:border-orange-primary/50 transition-all font-mono"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[9px] font-black text-white/40 uppercase tracking-widest italic ml-1">Secure Passkey</label>
                  <div className="relative">
                    <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-white/20" size={18} />
                    <input 
                      type="password" 
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full h-14 bg-white/5 border border-white/10 rounded-2xl pl-14 pr-6 text-white text-sm font-bold placeholder:text-white/10 focus:outline-none focus:border-orange-primary/50 transition-all font-mono"
                    />
                  </div>
                </div>

                <button 
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-16 bg-orange-primary text-white rounded-2xl text-[11px] font-black uppercase tracking-widest italic flex items-center justify-center gap-3 shadow-2xl shadow-orange-primary/30 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed group mt-8"
                >
                  {isLoading ? (
                    <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      Execute Authorization <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>
              </form>

              <div className="mt-10 pt-10 border-t border-white/5">
                <p className="text-center text-[9px] font-black text-white/20 uppercase tracking-[0.3em] mb-6 italic">Alternative Access Routes</p>
                <div className="grid grid-cols-2 gap-4">
                  <button className="h-12 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center gap-3 text-white text-[9px] font-black uppercase tracking-widest italic hover:bg-white/10 transition-all">
                    <Github size={16} /> GitHub
                  </button>
                  <button className="h-12 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center gap-3 text-white text-[9px] font-black uppercase tracking-widest italic hover:bg-white/10 transition-all">
                    <Search size={16} /> Google
                  </button>
                </div>
              </div>

              <p className="mt-10 text-center text-[9px] font-black text-white/30 uppercase tracking-[0.2em] italic leading-relaxed px-4">
                By entering the discovery matrix, you agree to our <span className="text-white/50 underline cursor-pointer">Protocol Terms</span> & <span className="text-white/50 underline cursor-pointer">Security Policy</span>.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
      )}
    </AnimatePresence>
  );
}
