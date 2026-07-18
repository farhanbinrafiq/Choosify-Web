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
    await new Promise((resolve) => setTimeout(resolve, 1500));

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
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 16 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-md bg-[#000435] border border-white/10 rounded-2xl overflow-hidden shadow-2xl font-sans"
          >
            <button
              onClick={onClose}
              className="absolute top-5 right-5 w-9 h-9 bg-white/10 hover:bg-white/15 border border-white/10 text-white flex items-center justify-center rounded-lg transition-all z-[120]"
              aria-label="Close modal"
            >
              <X size={18} />
            </button>

            <div className="relative z-10 p-8 pt-12 sm:p-10 sm:pt-14">
              <div className="mb-8 text-center">
                <div className="w-14 h-14 bg-[#FF5B00]/15 rounded-xl flex items-center justify-center text-[#FF5B00] mx-auto mb-5 border border-[#FF5B00]/20">
                  <LogIn size={26} />
                </div>
                <h2 className="text-2xl sm:text-[28px] font-extrabold text-white tracking-tight mb-2">
                  Welcome back
                </h2>
                <p className="text-white/55 text-[13px] font-medium">
                  Sign in to unlock the full Choosify experience
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[12px] font-semibold text-white/50 ml-0.5">Email</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" size={16} />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@email.com"
                      className="w-full h-12 bg-white/5 border border-white/10 rounded-xl pl-11 pr-4 text-white text-sm font-medium placeholder:text-white/25 focus:outline-none focus:border-[#FF5B00]/50 transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[12px] font-semibold text-white/50 ml-0.5">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" size={16} />
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full h-12 bg-white/5 border border-white/10 rounded-xl pl-11 pr-4 text-white text-sm font-medium placeholder:text-white/25 focus:outline-none focus:border-[#FF5B00]/50 transition-all"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-12 bg-[#FF5B00] hover:brightness-110 text-white rounded-xl text-[14px] font-bold tracking-tight flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed group mt-6"
                >
                  {isLoading ? (
                    <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      Sign in <ArrowRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
                    </>
                  )}
                </button>
              </form>

              <div className="mt-8 pt-8 border-t border-white/10">
                <p className="text-center text-[12px] font-medium text-white/40 mb-4">Or continue with</p>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    className="h-11 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center gap-2 text-white text-[13px] font-bold tracking-tight hover:bg-white/10 transition-all"
                  >
                    <Github size={15} /> GitHub
                  </button>
                  <button
                    type="button"
                    className="h-11 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center gap-2 text-white text-[13px] font-bold tracking-tight hover:bg-white/10 transition-all"
                  >
                    <Search size={15} /> Google
                  </button>
                </div>
              </div>

              <p className="mt-8 text-center text-[12px] font-medium text-white/40 leading-relaxed px-2">
                By signing in, you agree to our{' '}
                <span className="text-white/70 underline cursor-pointer">Terms</span> &{' '}
                <span className="text-white/70 underline cursor-pointer">Privacy Policy</span>.
              </p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
