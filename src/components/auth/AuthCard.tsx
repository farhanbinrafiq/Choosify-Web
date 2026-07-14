import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mail, Lock, User, Phone, Eye, EyeOff, ArrowRight, ShieldCheck, CheckCircle, RefreshCw } from 'lucide-react';
import { useGlobalState } from '../../context/GlobalStateContext';
import toast from 'react-hot-toast';

export type AuthMode = 'login' | 'register' | 'forgot-password' | 'reset-password' | 'verify-email' | 'email-sent' | 'two-factor';

interface AuthCardProps {
  currentMode?: AuthMode;
  onModeChange?: (mode: AuthMode) => void;
}

export const AuthCard: React.FC<AuthCardProps> = ({ currentMode, onModeChange }) => {
  const [internalMode, setInternalMode] = useState<AuthMode>('login');
  
  // Use either controlled or uncontrolled mode
  const mode = currentMode || internalMode;
  const setMode = (newMode: AuthMode) => {
    if (onModeChange) {
      onModeChange(newMode);
    } else {
      setInternalMode(newMode);
    }
  };

  const { setIsLoggedIn, updateCurrentUser } = useGlobalState();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  // Form values
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [verificationCode, setVerificationCode] = useState('');
  const [tfaCode, setTfaCode] = useState('');

  // Submit handers
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (mode === 'login') {
      if (!email.trim() || !password.trim()) {
        toast.error('Please enter your email and password.');
        return;
      }
      
      // Perform mock sign-in
      updateCurrentUser({
        name: fullName || 'Farhan Bin Rafiq',
        email: email,
        avatar: 'https://res.cloudinary.com/djdyqr8yd/image/upload/v1781880900/FBR_n3eycm.png'
      });
      setIsLoggedIn(true);
      toast.success('Successfully logged in!');
      
    } else if (mode === 'register') {
      if (!fullName.trim() || !email.trim() || !phone.trim() || !password.trim()) {
        toast.error('Please fill out all fields.');
        return;
      }
      if (password !== confirmPassword) {
        toast.error('Passwords do not match.');
        return;
      }
      
      // Navigate to email verification
      toast.success('Registration details saved. Please verify your email.');
      setMode('verify-email');
      
    } else if (mode === 'forgot-password') {
      if (!email.trim()) {
        toast.error('Please enter your email address.');
        return;
      }
      toast.success('Reset instructions sent to ' + email);
      setMode('email-sent');
      
    } else if (mode === 'email-sent') {
      // Simulate opening email client
      toast.success('Opening system email client...');
      setMode('reset-password');
      
    } else if (mode === 'reset-password') {
      if (!password.trim()) {
        toast.error('Please enter a new password.');
        return;
      }
      if (password !== confirmPassword) {
        toast.error('Passwords do not match.');
        return;
      }
      toast.success('Password reset successfully. Please sign in.');
      setMode('login');
      
    } else if (mode === 'verify-email') {
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
      
    } else if (mode === 'two-factor') {
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
    // Auto login
    updateCurrentUser({
      name: 'Farhan Bin Rafiq',
      email: 'farhanbinrafiq@gmail.com',
      avatar: 'https://res.cloudinary.com/djdyqr8yd/image/upload/v1781880900/FBR_n3eycm.png'
    });
    setIsLoggedIn(true);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="bg-white rounded-[28px] shadow-[0_24px_80px_rgba(0,4,53,0.18)] p-10 w-full max-w-[540px] text-slate-800 flex flex-col justify-center relative overflow-hidden"
      id="auth-card-panel"
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={mode}
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -10 }}
          transition={{ duration: 0.25 }}
        >
          {/* Header */}
          <div className="mb-8 text-center sm:text-left">
            <h2 className="text-[32px] font-black text-[#000435] leading-tight mb-2 tracking-tight">
              {mode === 'login' && 'Welcome back'}
              {mode === 'register' && 'Create account'}
              {mode === 'forgot-password' && 'Forgot password'}
              {mode === 'email-sent' && 'Link sent!'}
              {mode === 'reset-password' && 'Create new password'}
              {mode === 'verify-email' && 'Verify email'}
              {mode === 'two-factor' && 'Two-factor auth'}
            </h2>
            <p className="text-[#61667C] font-semibold text-sm">
              {mode === 'login' && 'Sign in to continue to Choosify'}
              {mode === 'register' && 'Join us to discover best products'}
              {mode === 'forgot-password' && 'Enter email to receive recovery instructions'}
              {mode === 'email-sent' && 'We have sent recovery link to your inbox'}
              {mode === 'reset-password' && 'Create a strong, secure new password'}
              {mode === 'verify-email' && "We've sent a 6-digit code to your email"}
              {mode === 'two-factor' && 'Enter the code from your authenticator app'}
            </p>
          </div>

          {/* Segmented Controller (Sign In / Sign Up) */}
          {(mode === 'login' || mode === 'register') && (
            <div className="relative flex bg-[#F4F7F9] p-1.5 rounded-2xl mb-8" id="auth-tab-selector">
              <button
                type="button"
                onClick={() => setMode('login')}
                className={`flex-1 py-3 text-sm font-black rounded-xl transition-all relative z-10 ${
                  mode === 'login' ? 'text-[#000435]' : 'text-[#61667C] hover:text-[#000435]'
                }`}
              >
                Sign in
              </button>
              <button
                type="button"
                onClick={() => setMode('register')}
                className={`flex-1 py-3 text-sm font-black rounded-xl transition-all relative z-10 ${
                  mode === 'register' ? 'text-[#000435]' : 'text-[#61667C] hover:text-[#000435]'
                }`}
              >
                Sign up
              </button>
              
              {/* Animated active slide background and orange line */}
              <motion.div
                className="absolute top-1.5 bottom-1.5 bg-white rounded-xl shadow-sm z-0"
                layoutId="activeTabBg"
                style={{
                  width: 'calc(50% - 6px)',
                  left: mode === 'login' ? '6px' : 'calc(50% + 0px)'
                }}
                transition={{ type: 'spring', stiffness: 380, damping: 30 }}
              />
              <motion.div
                className="absolute bottom-1.5 h-[3px] bg-[#FF5B00] rounded-full z-10"
                layoutId="activeTabUnderline"
                style={{
                  width: '60px',
                  left: mode === 'login' ? 'calc(25% - 30px)' : 'calc(75% - 30px)'
                }}
                transition={{ type: 'spring', stiffness: 380, damping: 30 }}
              />
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'register' && (
              <div className="relative">
                <User className="absolute left-4 top-[18px] text-[#8D94A8] pointer-events-none" size={20} />
                <input
                  type="text"
                  required
                  placeholder="Full Name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full bg-[#F4F7F9] h-[56px] pl-12 pr-4 rounded-2xl text-[#1A1A2E] placeholder-[#8D94A8] focus:placeholder-slate-400 outline-none font-bold text-sm focus:ring-2 focus:ring-[#FF5B00]/10 transition-all border border-transparent focus:bg-white focus:border-[#FF5B00]/30 shadow-inner shadow-black/[0.01]"
                />
              </div>
            )}

            {(mode === 'login' || mode === 'register' || mode === 'forgot-password') && (
              <div className="relative">
                <Mail className="absolute left-4 top-[18px] text-[#8D94A8] pointer-events-none" size={20} />
                <input
                  type="email"
                  required
                  placeholder="Email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#F4F7F9] h-[56px] pl-12 pr-4 rounded-2xl text-[#1A1A2E] placeholder-[#8D94A8] focus:placeholder-slate-400 outline-none font-bold text-sm focus:ring-2 focus:ring-[#FF5B00]/10 transition-all border border-transparent focus:bg-white focus:border-[#FF5B00]/30 shadow-inner shadow-black/[0.01]"
                />
              </div>
            )}

            {mode === 'register' && (
              <div className="relative">
                <Phone className="absolute left-4 top-[18px] text-[#8D94A8] pointer-events-none" size={20} />
                <input
                  type="tel"
                  required
                  placeholder="Phone number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-[#F4F7F9] h-[56px] pl-12 pr-4 rounded-2xl text-[#1A1A2E] placeholder-[#8D94A8] focus:placeholder-slate-400 outline-none font-bold text-sm focus:ring-2 focus:ring-[#FF5B00]/10 transition-all border border-transparent focus:bg-white focus:border-[#FF5B00]/30 shadow-inner shadow-black/[0.01]"
                />
              </div>
            )}

            {(mode === 'login' || mode === 'register' || mode === 'reset-password') && (
              <div className="relative">
                <Lock className="absolute left-4 top-[18px] text-[#8D94A8] pointer-events-none" size={20} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder={mode === 'reset-password' ? 'New Password' : 'Password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-[#F4F7F9] h-[56px] pl-12 pr-12 rounded-2xl text-[#1A1A2E] placeholder-[#8D94A8] focus:placeholder-slate-400 outline-none font-bold text-sm focus:ring-2 focus:ring-[#FF5B00]/10 transition-all border border-transparent focus:bg-white focus:border-[#FF5B00]/30 shadow-inner shadow-black/[0.01]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-[18px] text-[#8D94A8] hover:text-[#000435] transition-colors"
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            )}

            {(mode === 'register' || mode === 'reset-password') && (
              <div className="relative">
                <Lock className="absolute left-4 top-[18px] text-[#8D94A8] pointer-events-none" size={20} />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  required
                  placeholder="Confirm Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full bg-[#F4F7F9] h-[56px] pl-12 pr-12 rounded-2xl text-[#1A1A2E] placeholder-[#8D94A8] focus:placeholder-slate-400 outline-none font-bold text-sm focus:ring-2 focus:ring-[#FF5B00]/10 transition-all border border-transparent focus:bg-white focus:border-[#FF5B00]/30 shadow-inner shadow-black/[0.01]"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-[18px] text-[#8D94A8] hover:text-[#000435] transition-colors"
                  aria-label="Toggle confirm password visibility"
                >
                  {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            )}

            {mode === 'verify-email' && (
              <div className="relative">
                <ShieldCheck className="absolute left-4 top-[18px] text-[#8D94A8] pointer-events-none" size={20} />
                <input
                  type="text"
                  required
                  maxLength={6}
                  placeholder="6-digit verification code"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, ''))}
                  className="w-full bg-[#F4F7F9] h-[56px] pl-12 pr-4 rounded-2xl text-[#1A1A2E] placeholder-[#8D94A8] tracking-widest text-center outline-none font-black text-lg focus:ring-2 focus:ring-[#FF5B00]/10 transition-all border border-transparent focus:bg-white focus:border-[#FF5B00]/30 shadow-inner shadow-black/[0.01]"
                />
              </div>
            )}

            {mode === 'two-factor' && (
              <div className="relative">
                <ShieldCheck className="absolute left-4 top-[18px] text-[#8D94A8] pointer-events-none" size={20} />
                <input
                  type="text"
                  required
                  maxLength={6}
                  placeholder="2FA security code"
                  value={tfaCode}
                  onChange={(e) => setTfaCode(e.target.value.replace(/\D/g, ''))}
                  className="w-full bg-[#F4F7F9] h-[56px] pl-12 pr-4 rounded-2xl text-[#1A1A2E] placeholder-[#8D94A8] tracking-widest text-center outline-none font-black text-lg focus:ring-2 focus:ring-[#FF5B00]/10 transition-all border border-transparent focus:bg-white focus:border-[#FF5B00]/30 shadow-inner shadow-black/[0.01]"
                />
              </div>
            )}

            {mode === 'email-sent' && (
              <div className="flex flex-col items-center justify-center py-6 text-center">
                <div className="w-16 h-16 bg-[#FF5B00]/10 text-[#FF5B00] rounded-full flex items-center justify-center mb-4">
                  <CheckCircle size={36} />
                </div>
                <p className="text-sm font-semibold text-slate-500 max-w-sm">
                  We sent a secure password reset link to <strong className="text-slate-800">{email || 'your email'}</strong>. Please click the link inside the email to finalize the process.
                </p>
              </div>
            )}

            {/* Remember me & Forgot Password */}
            {mode === 'login' && (
              <div className="flex justify-between items-center text-xs mt-4">
                <label className="flex items-center gap-2.5 text-[#61667C] font-bold cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="accent-[#FF5B00] w-4 h-4 rounded border-slate-300"
                  />
                  Remember me
                </label>
                <button
                  type="button"
                  onClick={() => setMode('forgot-password')}
                  className="text-[#FF5B00] hover:text-[#EB4501] font-black transition-colors"
                >
                  Forgot password?
                </button>
              </div>
            )}

            {/* Submit Button */}
            <motion.button
              type="submit"
              whileHover={{ scale: 1.01, translateY: -1 }}
              whileTap={{ scale: 0.99 }}
              className="w-full mt-6 bg-gradient-to-r from-[#FF5B00] to-[#EB4501] text-white h-[56px] rounded-2xl font-black text-sm uppercase tracking-wider shadow-lg shadow-[#FF5B00]/25 flex items-center justify-center gap-2 cursor-pointer transition-all hover:brightness-110"
            >
              {mode === 'login' && 'Sign in to Choosify'}
              {mode === 'register' && 'Sign up for Choosify'}
              {mode === 'forgot-password' && 'Send Reset Link'}
              {mode === 'email-sent' && 'Open Email Client'}
              {mode === 'reset-password' && 'Reset Password'}
              {mode === 'verify-email' && 'Verify & Continue'}
              {mode === 'two-factor' && 'Verify and Login'}
              <ArrowRight size={18} />
            </motion.button>
          </form>

          {/* Social Logins - Only for Login and Register */}
          {(mode === 'login' || mode === 'register') && (
            <div className="mt-8">
              {/* Divider */}
              <div className="relative flex py-4 items-center">
                <div className="flex-grow border-t border-[#F4F7F9]"></div>
                <span className="flex-shrink mx-4 text-[#8D94A8] text-xs font-black uppercase tracking-widest">OR</span>
                <div className="flex-grow border-t border-[#F4F7F9]"></div>
              </div>

              {/* Grid of buttons */}
              <div className="flex flex-col gap-3">
                <button
                  type="button"
                  onClick={() => handleSocialLogin('Google')}
                  className="w-full bg-white hover:bg-slate-50 border border-slate-100 h-[56px] rounded-2xl text-xs font-extrabold text-[#000435] transition-all duration-300 flex items-center justify-center gap-3 shadow-[0_4px_12px_rgba(0,4,53,0.03)]"
                >
                  <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05" />
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335" />
                  </svg>
                  <span>Continue with Google</span>
                </button>

                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => handleSocialLogin('Facebook')}
                    className="bg-white hover:bg-slate-50 border border-slate-100 h-[56px] rounded-2xl text-xs font-extrabold text-[#000435] transition-all duration-300 flex items-center justify-center gap-2.5 shadow-[0_4px_12px_rgba(0,4,53,0.03)]"
                  >
                    <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24" fill="#1877F2" xmlns="http://www.w3.org/2000/svg">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                    </svg>
                    <span>Facebook</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleSocialLogin('Apple')}
                    className="bg-white hover:bg-slate-50 border border-slate-100 h-[56px] rounded-2xl text-xs font-extrabold text-[#000435] transition-all duration-300 flex items-center justify-center gap-2.5 shadow-[0_4px_12px_rgba(0,4,53,0.03)]"
                  >
                    <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24" fill="#000000" xmlns="http://www.w3.org/2000/svg">
                      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 4.17c.66-.81 1.11-1.93.99-3.06-1 .04-2.21.67-2.93 1.49-.62.69-1.16 1.84-1.01 2.96 1.12.09 2.27-.58 2.95-1.39" />
                    </svg>
                    <span>Apple</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Alternate Footer links */}
          <div className="mt-8 pt-6 border-t border-slate-100 text-center">
            {mode === 'login' && (
              <p className="text-xs font-bold text-[#61667C]">
                New to Choosify?{' '}
                <button
                  type="button"
                  onClick={() => setMode('register')}
                  className="text-[#FF5B00] hover:text-[#EB4501] font-black hover:underline"
                >
                  Sign Up
                </button>
              </p>
            )}

            {mode === 'register' && (
              <p className="text-xs font-bold text-[#61667C]">
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => setMode('login')}
                  className="text-[#FF5B00] hover:text-[#EB4501] font-black hover:underline"
                >
                  Sign In
                </button>
              </p>
            )}

            {mode === 'forgot-password' && (
              <button
                type="button"
                onClick={() => setMode('login')}
                className="text-xs font-black text-[#FF5B00] hover:text-[#EB4501]"
              >
                Back to Sign in
              </button>
            )}

            {mode === 'email-sent' && (
              <div className="flex flex-col gap-3 justify-center items-center">
                <button
                  type="button"
                  onClick={() => setMode('forgot-password')}
                  className="text-xs font-black text-[#FF5B00] hover:text-[#EB4501] flex items-center gap-1.5"
                >
                  <RefreshCw size={12} /> Resend verification email
                </button>
                <button
                  type="button"
                  onClick={() => setMode('login')}
                  className="text-xs font-black text-[#61667C] hover:text-[#000435]"
                >
                  Back to Sign in
                </button>
              </div>
            )}

            {mode === 'reset-password' && (
              <button
                type="button"
                onClick={() => setMode('login')}
                className="text-xs font-black text-[#FF5B00] hover:text-[#EB4501]"
              >
                Back to Sign in
              </button>
            )}

            {mode === 'verify-email' && (
              <div className="flex flex-col gap-3 justify-center items-center">
                <button
                  type="button"
                  onClick={() => toast.success('A new 6-digit verification code has been sent!')}
                  className="text-xs font-black text-[#FF5B00] hover:text-[#EB4501]"
                >
                  Resend verification code
                </button>
                <button
                  type="button"
                  onClick={() => setMode('login')}
                  className="text-xs font-black text-[#61667C] hover:text-[#000435]"
                >
                  Back to Sign in
                </button>
              </div>
            )}

            {mode === 'two-factor' && (
              <button
                type="button"
                onClick={() => setMode('login')}
                className="text-xs font-black text-[#FF5B00] hover:text-[#EB4501]"
              >
                Back to Sign in
              </button>
            )}
          </div>
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
};
