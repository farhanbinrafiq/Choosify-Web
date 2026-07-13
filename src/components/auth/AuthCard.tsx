import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mail, Lock, User, Eye, EyeOff, Check } from 'lucide-react';

export const AuthCard = () => {
  const [activeTab, setActiveTab] = useState<'signin' | 'signup'>('signin');
  const [showPassword, setShowPassword] = useState(false);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-[28px] shadow-[0_20px_60px_rgba(0,4,53,0.15)] p-10 w-full max-w-[560px]"
    >
      <div className="mb-8">
        <h2 className="text-[32px] font-bold text-[#000435] mb-2">Welcome back</h2>
        <p className="text-[#61667C]">Sign in to continue to Choosify</p>
      </div>

      {/* Tabs */}
      <div className="relative flex bg-[#F4F7F9] p-1.5 rounded-2xl mb-8">
        <button 
          onClick={() => setActiveTab('signin')}
          className={`flex-1 py-3.5 text-sm font-bold rounded-xl transition-all ${activeTab === 'signin' ? 'bg-white shadow-sm text-[#000435]' : 'text-[#61667C]'}`}
        >
          Sign in
        </button>
        <button 
          onClick={() => setActiveTab('signup')}
          className={`flex-1 py-3.5 text-sm font-bold rounded-xl transition-all ${activeTab === 'signup' ? 'bg-white shadow-sm text-[#000435]' : 'text-[#61667C]'}`}
        >
          Sign up
        </button>
        {/* Orange underline */}
        <motion.div 
          className="absolute bottom-2 h-0.5 bg-[#FF5B00] rounded-full"
          initial={false}
          animate={{ x: activeTab === 'signin' ? '0%' : '100%', width: '48%' }}
          style={{ left: '1.5%' }}
        />
      </div>

      {/* Form Fields */}
      <div className="space-y-4">
        {activeTab === 'signup' && (
          <div className="relative">
            <User className="absolute left-4 top-[18px] text-[#8D94A8]" size={20} />
            <input type="text" placeholder="Full Name" className="w-full bg-[#F4F7F9] h-[56px] pl-12 rounded-2xl text-[#1A1A2E] placeholder-[#8D94A8] outline-none font-medium" />
          </div>
        )}
        <div className="relative">
          <Mail className="absolute left-4 top-[18px] text-[#8D94A8]" size={20} />
          <input type="email" placeholder="Enter your email" className="w-full bg-[#F4F7F9] h-[56px] pl-12 rounded-2xl text-[#1A1A2E] placeholder-[#8D94A8] outline-none font-medium" />
        </div>
        <div className="relative">
          <Lock className="absolute left-4 top-[18px] text-[#8D94A8]" size={20} />
          <input type={showPassword ? 'text' : 'password'} placeholder="Enter your password" className="w-full bg-[#F4F7F9] h-[56px] pl-12 pr-12 rounded-2xl text-[#1A1A2E] placeholder-[#8D94A8] outline-none font-medium" />
          <button 
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-[18px] text-[#8D94A8]"
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>
      </div>

      {activeTab === 'signin' && (
        <div className="flex justify-between items-center text-sm mt-4">
          <label className="flex items-center gap-2 text-[#61667C] font-medium cursor-pointer">
            <input type="checkbox" className="accent-[#FF5B00] w-4 h-4" />
            Remember me
          </label>
          <a href="#" className="text-[#FF5B00] font-bold">Forgot password?</a>
        </div>
      )}

      <button className="w-full mt-8 bg-gradient-to-r from-[#FF5B00] to-[#EB4501] text-white h-[56px] rounded-2xl font-bold shadow-lg shadow-[#FF5B00]/20 hover:scale-[1.01] transition-transform flex items-center justify-center gap-2">
        {activeTab === 'signin' ? 'Sign in to Choosify' : 'Sign up for Choosify'}
        →
      </button>

      {/* Social Logins */}
      <div className="mt-8">
        <p className="text-center text-[#61667C] text-sm mb-4">OR</p>
        <div className="grid grid-cols-3 gap-3">
          {['Google', 'Facebook', 'Apple'].map(provider => (
            <button key={provider} className="bg-white border border-[#F4F7F9] h-[56px] rounded-2xl text-xs font-bold text-[#000435] hover:border-[#FF5B00]/30 transition-all flex items-center justify-center gap-2">
              <span className="w-5 h-5 bg-[#F4F7F9] rounded-full" />
              {provider}
            </button>
          ))}
        </div>
      </div>

      {/* Footer */}
      <p className="text-center text-[#1A1A2E] text-sm mt-8">
        {activeTab === 'signin' ? 'New to Choosify? ' : 'Already have an account? '}
        <button onClick={() => setActiveTab(activeTab === 'signin' ? 'signup' : 'signin')} className="text-[#FF5B00] font-bold">
          {activeTab === 'signin' ? 'Sign up' : 'Sign in'}
        </button>
      </p>
      
      {/* Trust Bar */}
      <div className="grid grid-cols-3 gap-2 mt-8 pt-8 border-t border-[#F4F7F9]">
        {['Trusted & Secure', 'No Spam, Ever', 'Join Millions'].map(item => (
          <div key={item} className="flex flex-col items-center text-center gap-1">
            <div className="bg-[#F4F7F9] p-2 rounded-full text-[#000435]">🔒</div>
            <p className="text-[10px] font-bold text-[#000435]">{item}</p>
          </div>
        ))}
      </div>
    </motion.div>
  );
};
