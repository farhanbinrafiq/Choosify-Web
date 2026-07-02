import React, { useState } from 'react';
import { CheckCircle2 } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useGlobalState } from '../context/GlobalStateContext';
import toast from 'react-hot-toast';

type AuthTab = 'sign-in' | 'sign-up';

export function LoginSignUpPage() {
  const [activeTab, setActiveTab] = useState<AuthTab>('sign-in');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { setIsLoggedIn } = useGlobalState();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogin = (e: React.FormEvent) => {
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

    setIsLoggedIn(true);
    toast.success('Welcome back!');
    navigate(location.state?.from || '/dashboard');
  };

  const handleSocialLogin = (provider: 'Google' | 'Facebook') => {
    toast.success(`${provider} login coming soon! Use email login for now.`);
  };

  const handleSignUpTab = () => {
    setActiveTab('sign-up');
    toast('Sign up is coming soon. Use Sign In for now.', { icon: 'ℹ️' });
  };

  return (
    <div className="flex flex-col min-h-[calc(100vh-5rem)] bg-white">
      <div className="flex-1 flex flex-col lg:flex-row">
        <div className="lg:w-1/2 bg-orange-primary relative flex flex-col p-8 md:p-12 lg:p-24 orange-brand-gradient overflow-hidden min-h-[280px] lg:min-h-0">
           <div className="mt-auto relative z-10">
              <h1 className="text-4xl lg:text-5xl font-black text-white leading-tight mb-8 tracking-tighter italic">
                Bangladesh&apos;s Most Trusted <br/> <span className="text-white/90 underline decoration-white/30 underline-offset-4">Product Discovery</span> Platform
              </h1>
              <div className="space-y-6">
                {['Compare thousands of products', 'Find the best deals', 'Read expert guides'].map((point) => (
                  <div key={point} className="flex items-center gap-4">
                    <div className="w-8 h-8 rounded-full bg-green-accent flex items-center justify-center text-white"><CheckCircle2 size={16} /></div>
                    <span className="text-white font-bold text-lg">{point}</span>
                  </div>
                ))}
              </div>
           </div>
        </div>
        <div className="lg:w-1/2 flex flex-col justify-center p-8 md:p-12 lg:p-24">
           <div className="max-w-md w-full mx-auto">
              <div className="flex gap-12 border-b border-gray-100 mb-12">
                 <button
                   type="button"
                   onClick={() => setActiveTab('sign-in')}
                   className={`pb-4 text-2xl font-black uppercase tracking-tighter italic transition-colors ${
                     activeTab === 'sign-in'
                       ? 'text-navy border-b-4 border-orange-primary'
                       : 'text-gray-300 border-b-4 border-transparent hover:text-gray-500'
                   }`}
                 >
                   Sign In
                 </button>
                 <button
                   type="button"
                   onClick={handleSignUpTab}
                   className={`pb-4 text-2xl font-black uppercase tracking-tighter italic transition-colors ${
                     activeTab === 'sign-up'
                       ? 'text-navy border-b-4 border-orange-primary'
                       : 'text-gray-300 border-b-4 border-transparent hover:text-gray-500'
                   }`}
                 >
                   Sign Up
                 </button>
              </div>
              <form onSubmit={handleLogin} className="space-y-8">
                 <div className="space-y-2">
                    <h2 className="text-3xl font-black text-navy uppercase tracking-tighter italic">Welcome Back 👋</h2>
                    <input 
                      type="email" 
                      placeholder="Email Address" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      autoComplete="email"
                      className="w-full h-14 pl-4 rounded-xl bg-ice-blue border-none focus:ring-2 focus:ring-orange-primary outline-none font-semibold" 
                    />
                    <input 
                      type="password" 
                      placeholder="Password" 
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      autoComplete="current-password"
                      className="w-full h-14 pl-4 rounded-xl bg-ice-blue border-none focus:ring-2 focus:ring-orange-primary outline-none font-semibold" 
                    />
                 </div>
                 <button type="submit" className="w-full h-16 button-gradient text-white font-black rounded-2xl text-sm uppercase tracking-widest shadow-xl shadow-orange-primary/30 hover:opacity-95 transition-opacity">Log In Now</button>
                 <div className="grid grid-cols-2 gap-4">
                    <button type="button" onClick={() => handleSocialLogin('Google')} className="h-14 rounded-2xl border-2 border-gray-100 flex items-center justify-center gap-3 font-bold text-navy hover:bg-ice-blue transition-all">Google</button>
                    <button type="button" onClick={() => handleSocialLogin('Facebook')} className="h-14 rounded-2xl border-2 border-gray-100 flex items-center justify-center gap-3 font-bold text-navy hover:bg-ice-blue transition-all">Facebook</button>
                 </div>
              </form>
           </div>
        </div>
      </div>
    </div>
  );
}
