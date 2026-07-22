import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, Check, ShieldCheck, Lock, Upload, FileText, Camera, AlertTriangle, 
  ArrowRight, Landmark, FileCheck, CheckCircle2, UserCheck, RefreshCw, Eye, HelpCircle,
  Video, Instagram, Rss, Facebook, Clock, Award
} from 'lucide-react';
import { useGlobalState } from '../context/GlobalStateContext';
import { toast } from '../lib/notify';

interface ClaimProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetType: 'brand' | 'creator';
  targetId: string | number;
  targetName: string;
  onClaimSubmitted: () => void;
}

type ActiveSection = 'A' | 'B' | 'C' | 'D' | 'E';

export function ClaimProfileModal({ 
  isOpen, 
  onClose, 
  targetType, 
  targetId, 
  targetName, 
  onClaimSubmitted 
}: ClaimProfileModalProps) {
  const { 
    isLoggedIn, 
    setIsLoggedIn, 
    currentUser, 
    setCurrentUser, 
    updateBrandClaimStatus, 
    updateCreatorClaimStatus 
  } = useGlobalState();

  // Current onboarding view: 'user_check' | 'form' | 'submitting' | 'success_status'
  const [flowStep, setFlowStep] = useState<'user_check' | 'form' | 'submitting' | 'success_status'>('user_check');

  // Active form section
  const [activeSection, setActiveSection] = useState<ActiveSection>('A');

  // ==========================================
  // SHARED FORM STATE & VARIABLES
  // ==========================================

  // BRAND FORM STATES
  // Section A
  const [fullName, setFullName] = useState(currentUser?.name || '');
  const [phoneNumber, setPhoneNumber] = useState(currentUser?.phone || '');
  const [roleSelection, setRoleSelection] = useState<'owner' | 'authorized_rep'>('owner');

  // Section B
  const [tradeLicenseNo, setTradeLicenseNo] = useState('');
  const [licenseFile, setLicenseFile] = useState<string | null>(null);
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [businessEmail, setBusinessEmail] = useState('');

  // Section C
  const [nidNumber, setNidNumber] = useState('');
  const [nidFront, setNidFront] = useState<string | null>(null);
  const [nidBack, setNidBack] = useState<string | null>(null);
  const [selfieCaptured, setSelfieCaptured] = useState<boolean>(false);
  const [selfiePreview, setSelfiePreview] = useState<string | null>(null);
  const [isCapturing, setIsCapturing] = useState<boolean>(false);
  const [passportDrivingNum, setPassportDrivingNum] = useState('');

  // Section D
  const [tinNumber, setTinNumber] = useState('');
  const [vatNumber, setVatNumber] = useState('');
  const [bankAccName, setBankAccName] = useState('');
  const [bankAccNumber, setBankAccNumber] = useState('');
  const [bankName, setBankName] = useState('');
  const [bankBranch, setBankBranch] = useState('');
  const [bankFile, setBankFile] = useState<string | null>(null);

  // Section E
  const [checkAuthorized, setCheckAuthorized] = useState(false);
  const [checkDetailsTrue, setCheckDetailsTrue] = useState(false);

  // CREATOR FORM STATES
  // Section A (Creator Profile Creation)
  const [creatorDisplayName, setCreatorDisplayName] = useState(currentUser?.name || '');
  const [creatorHandle, setCreatorHandle] = useState(currentUser?.username || '');
  const [creatorEmail, setCreatorEmail] = useState(currentUser?.email || 'farhanbinrafiq@gmail.com');
  const [creatorPhone, setCreatorPhone] = useState(currentUser?.phone || '');
  const [creatorCategory, setCreatorCategory] = useState<'influencer' | 'reviewer' | 'affiliate' | 'other'>('influencer');

  // Section B (Social Identity Verification)
  const [ytUrl, setYtUrl] = useState('');
  const [igUrl, setIgUrl] = useState('');
  const [ttUrl, setTtUrl] = useState('');
  const [fbUrl, setFbUrl] = useState('');

  // Section C (Identity Verification)
  const [creatorNid, setCreatorNid] = useState('');
  const [creatorGovId, setCreatorGovId] = useState<string | null>(null);

  // Section D (Creator Authorization)
  const [creatorDeclare, setCreatorDeclare] = useState(false);

  // Reset states on modal opening, check authentication & eligibility
  useEffect(() => {
    if (isOpen) {
      if (!isLoggedIn) {
        setFlowStep('user_check');
      } else if (targetType === 'brand' && currentUser.role !== 'seller') {
        setFlowStep('user_check');
      } else if (targetType === 'creator' && currentUser.role !== 'creator') {
        setFlowStep('user_check');
      } else {
        setFlowStep('form');
      }
      setActiveSection('A');

      // Sync user data
      setFullName(currentUser?.name || '');
      setPhoneNumber(currentUser?.phone || '');
      setCreatorDisplayName(currentUser?.name || '');
      setCreatorHandle(currentUser?.username || '');
      setCreatorEmail(currentUser?.email || 'farhanbinrafiq@gmail.com');
      setCreatorPhone(currentUser?.phone || '');

      // Reset uploaded assets
      setLicenseFile(null);
      setNidFront(null);
      setNidBack(null);
      setSelfieCaptured(false);
      setSelfiePreview(null);
      setBankFile(null);
      setCreatorGovId(null);

      // Reset flags & form fields
      setTradeLicenseNo('');
      setWebsiteUrl('');
      setBusinessEmail('');
      setNidNumber('');
      setPassportDrivingNum('');
      setTinNumber('');
      setVatNumber('');
      setBankAccName('');
      setBankAccNumber('');
      setBankName('');
      setBankBranch('');
      setCheckAuthorized(false);
      setCheckDetailsTrue(false);
      setYtUrl('');
      setIgUrl('');
      setTtUrl('');
      setFbUrl('');
      setCreatorNid('');
      setCreatorDeclare(false);
    }
  }, [isOpen, isLoggedIn, currentUser, targetType]);

  // Handle Login Event (simulation)
  const handleLogIn = () => {
    setIsLoggedIn(true);
    toast.success('Signed in successfully as primary representative.');
  };

  // Convert role to Seller Mode
  const handleCreateSellerProfile = () => {
    setCurrentUser({
      ...currentUser,
      role: 'seller'
    });
    setFlowStep('form');
    toast.success('Seller Profile configured! Proceed to claim form.', {
      icon: '💼',
      duration: 3500
    });
  };

  // Convert role to Creator Mode
  const handleCreateCreatorProfile = () => {
    setCurrentUser({
      ...currentUser,
      role: 'creator'
    });
    setFlowStep('form');
    toast.success('Creator Profile configured! Proceed to claim form.', {
      icon: '🎨',
      duration: 3500
    });
  };

  // Safe file upload simulator
  const simulateFileUpload = (fieldName: string, setter: (val: string) => void) => {
    const loadingToast = toast.loading(`Uploading security attachment for ${fieldName}...`);
    setTimeout(() => {
      toast.dismiss(loadingToast);
      const uuidPart = Math.floor(Math.random() * 90000 + 10000);
      const randName = `VERIFICATION_${fieldName.toUpperCase().replace(/\s+/g, '_')}_${uuidPart}.pdf`;
      setter(randName);
      toast.success(`${fieldName} verification file processed successfully.`);
    }, 1100);
  };

  // Face webcam match simulation
  const handleTakeSelfie = () => {
    setIsCapturing(true);
    const takingToast = toast.loading('Capturing biometric face outline...');
    setTimeout(() => {
      toast.dismiss(takingToast);
      setIsCapturing(false);
      setSelfieCaptured(true);
      setSelfiePreview('https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop');
      toast.success('Biometric face verification vector synchronized.');
    }, 1300);
  };

  // Form step navigation definitions
  const sections = targetType === 'brand' ? [
    { key: 'A', name: 'Identity & Details', step: 'Section A' },
    { key: 'B', name: 'Trade & Business Docs', step: 'Section B' },
    { key: 'C', name: 'Legal KYC & Face Match', step: 'Section C' },
    { key: 'D', name: 'TIN & Bank Registry', step: 'Section D' },
    { key: 'E', name: 'Official Declarations', step: 'Section E' }
  ] : [
    { key: 'A', name: 'Creator Profile', step: 'Section A' },
    { key: 'B', name: 'Social Identity', step: 'Section B' },
    { key: 'C', name: 'Identity Verification', step: 'Section C' },
    { key: 'D', name: 'Creator Authorization', step: 'Section D' }
  ];

  // Client Side validation logic prior to submit
  const validateForm = (): boolean => {
    if (targetType === 'brand') {
      if (!fullName.trim() || !phoneNumber.trim()) {
        setActiveSection('A');
        toast.error('Section A: Full Name and Contact Phone Number are required.');
        return false;
      }
      if (!tradeLicenseNo.trim() || !licenseFile || !websiteUrl.trim() || !businessEmail.trim()) {
        setActiveSection('B');
        toast.error('Section B: Trade License No, registration documents, company website, and business domain email are required.');
        return false;
      }
      if (!nidNumber.trim() || !nidFront || !nidBack || !selfieCaptured) {
        setActiveSection('C');
        toast.error('Section C: National ID Number, front/back uploads, and Face ID verification are required.');
        return false;
      }
      if (!tinNumber.trim() || !bankAccName.trim() || !bankAccNumber.trim() || !bankName.trim() || !bankFile) {
        setActiveSection('D');
        toast.error('Section D: NBR Tax Details, settlement bank coordinates, and statements verification file are required.');
        return false;
      }
      if (!checkAuthorized || !checkDetailsTrue) {
        setActiveSection('E');
        toast.error('Section E: You must accept all professional declarations prior to submitting.');
        return false;
      }
    } else {
      // Creator flow validation
      if (!creatorDisplayName.trim() || !creatorHandle.trim() || !creatorEmail.trim() || !creatorPhone.trim()) {
        setActiveSection('A');
        toast.error('Section A: All creator profile fields are required.');
        return false;
      }
      if (!ytUrl.trim() && !igUrl.trim() && !ttUrl.trim()) {
        setActiveSection('B');
        toast.error('Section B: Provide at least one social media handle link (YouTube, Instagram, or TikTok).');
        return false;
      }
      if (!creatorNid.trim() || !creatorGovId || !selfieCaptured) {
        setActiveSection('C');
        toast.error('Section C: NID identification value, ID document upload, and Biometric selfie matches are required.');
        return false;
      }
      if (!creatorDeclare) {
        setActiveSection('D');
        toast.error('Section D: You must declare creator source profile ownership before submitting.');
        return false;
      }
    }
    return true;
  };

  // Form submission handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setFlowStep('submitting');
    
    // Non-blocking wait for encryption credentials simulation
    await new Promise(resolve => setTimeout(resolve, 2200));

    // Persist pending review state inside global context
    if (targetType === 'brand') {
      updateBrandClaimStatus(targetId, 'pending');
    } else {
      updateCreatorClaimStatus(String(targetId), 'pending');
    }

    setFlowStep('success_status');
    onClaimSubmitted();
  };

  const currentEmail = currentUser?.email || 'farhanbinrafiq@gmail.com';

  return (
    <AnimatePresence>
      {isOpen && (
        <div id="unified-claim-form-modal-portal" className="fixed inset-0 z-[250] flex items-center justify-center p-3 md:p-6 select-none font-sans">
          {/* Backdrop blur overlay */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-md"
          />

          <motion.div 
            initial={{ opacity: 0, scale: 0.96, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 15 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-4xl h-[92vh] md:h-[84vh] bg-white rounded-3xl overflow-hidden shadow-2xl border border-gray-100 flex flex-col text-[#1A1A2E]"
          >
            {/* Modal CORE HEADER */}
            <div className="flex items-center justify-between p-5 md:p-6 border-b border-gray-100 shrink-0 bg-white">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-orange-50 text-[#F97316] flex items-center justify-center font-bold">
                  <ShieldCheck size={22} className="stroke-[2.5]" />
                </div>
                <div>
                  <h2 className="text-base md:text-lg font-extrabold text-[#1A1A2E] leading-tight mb-0.5 tracking-tight">
                    Claim {targetType === 'brand' ? 'Brand Ownership' : 'Creator Profile'}
                  </h2>
                  <p className="text-[12px] text-[#9AA0AC] font-medium tracking-tight">
                    Professional Verification Network For <span className="text-[#F97316]">{targetName}</span>
                  </p>
                </div>
              </div>

              <button 
                type="button"
                onClick={onClose}
                className="w-9 h-9 rounded-full border border-gray-100 bg-gray-50 flex items-center justify-center text-gray-500 hover:text-[#1A1A2E] hover:bg-gray-100 transition-all cursor-pointer shadow-xs"
              >
                <X size={16} />
              </button>
            </div>

            {/* Modal FLEXIBLE SCROLL CONTENT */}
            <div className="flex-1 overflow-y-auto p-5 md:p-8 bg-gray-50/30">
              
              {/* STEP 1: USER ELIGIBILITY GATE */}
              {flowStep === 'user_check' && (
                <div id="eligibility-gating" className="max-w-md mx-auto py-10 space-y-8 text-center animate-fade-in">
                  <div className="w-16 h-16 bg-orange-50 stroke-[1.5] rounded-full flex items-center justify-center mx-auto text-[#F97316]">
                    <Lock size={28} />
                  </div>
                  
                  {!isLoggedIn ? (
                    <div className="space-y-6">
                      <div className="space-y-2">
                        <h3 className="text-lg font-extrabold tracking-tight text-[#1A1A2E]">Authentication required</h3>
                        <p className="text-xs text-gray-500 font-bold leading-relaxed uppercase">
                          Please sign in or configure your profile representation to initiate the secure claiming workflow.
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={handleLogIn}
                        className="w-full h-12 rounded-xl bg-white border border-[#E5E7EB] hover:border-[#D1D5DB] font-bold text-[13px] tracking-tight shadow-sm flex items-center justify-center gap-1.5 cursor-pointer transition-all choosify-emi-gradient-text"
                      >
                        Sign In as Representative{' '}
                        <ArrowRight size={13} stroke="url(#choosify-emi-icon-grad)" />
                      </button>
                    </div>
                  ) : targetType === 'brand' && currentUser.role !== 'seller' ? (
                    <div className="space-y-6">
                      <div className="space-y-2">
                        <h4 className="text-[12px] font-bold text-[#EB4501] tracking-tight block">Eligibility check</h4>
                        <h3 className="text-lg font-extrabold tracking-tight text-[#1A1A2E]">Seller profile required</h3>
                        <p className="text-xs text-[#1A1A2E] font-bold leading-relaxed bg-[#F97316]/5 border border-[#F97316]/20 p-3.5 rounded-xl">
                          "Create Seller Profile to continue claiming brands"
                        </p>
                        <p className="text-[11px] text-gray-500 font-semibold leading-relaxed uppercase pt-2">
                          Claims must be connected with a verified commercial brand seller account in order to access exclusive catalogs, store insights, and discount configurations.
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={handleCreateSellerProfile}
                        className="w-full h-12 rounded-xl bg-[#EB4501] text-white hover:brightness-110 font-bold text-[13px] tracking-tight shadow-sm flex items-center justify-center gap-1.5 border-none cursor-pointer transition-all"
                      >
                        Create Seller Profile <ArrowRight size={13} />
                      </button>
                    </div>
                  ) : targetType === 'creator' && currentUser.role !== 'creator' ? (
                    <div className="space-y-6">
                      <div className="space-y-2">
                        <h4 className="text-[12px] font-bold text-[#EB4501] tracking-tight block">Eligibility check</h4>
                        <h3 className="text-lg font-extrabold tracking-tight text-[#1A1A2E]">Creator profile required</h3>
                        <p className="text-xs text-[#1A1A2E] font-bold leading-relaxed bg-[#F97316]/5 border border-[#F97316]/20 p-3.5 rounded-xl">
                          "Create Creator Profile to continue claiming your creator page"
                        </p>
                        <p className="text-[11px] text-gray-500 font-semibold leading-relaxed uppercase pt-2">
                          Authorize and declare your original digital channel metrics by onboarding into the dedicated Creator network directory.
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={handleCreateCreatorProfile}
                        className="w-full h-12 rounded-xl bg-[#EB4501] text-white hover:brightness-110 font-bold text-[13px] tracking-tight shadow-sm flex items-center justify-center gap-1.5 border-none cursor-pointer transition-all"
                      >
                        Create Creator Profile <ArrowRight size={13} />
                      </button>
                    </div>
                  ) : null}
                </div>
              )}

              {/* STEP 2 & 3: BRAND OR CREATOR FORM STEPS */}
              {flowStep === 'form' && (
                <form onSubmit={handleSubmit} className="space-y-6 animate-fade-in text-left">
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
                    
                    {/* Left Index Nav Stepper Panel */}
                    <div className="md:col-span-4 flex md:flex-col gap-2 overflow-x-auto no-scrollbar border-b md:border-b-0 md:border-r border-gray-150 pb-3 md:pb-0 md:pr-4">
                      {sections.map((sec) => (
                        <button
                          key={sec.key}
                          type="button"
                          onClick={() => setActiveSection(sec.key as ActiveSection)}
                          className={`w-full text-left p-3.5 rounded-2xl transition-all border outline-none cursor-pointer flex items-center gap-3 shrink-0 md:shrink ${
                            activeSection === sec.key 
                              ? 'bg-orange-50 border-[#F97316]/20 text-[#F97316]' 
                              : 'bg-white border-gray-200/60 text-gray-500 hover:bg-gray-100 hover:text-[#1A1A2E]'
                          }`}
                        >
                          <span className="text-[11px] font-bold tracking-tight shrink-0 bg-white border border-gray-200/50 w-6 h-6 rounded-lg flex items-center justify-center shadow-xs">
                            {sec.key}
                          </span>
                          <div className="min-w-0">
                            <span className="text-[11px] font-medium text-[#9AA0AC] tracking-tight block leading-none">{sec.step}</span>
                            <span className="text-[12px] font-bold tracking-tight block truncate mt-0.5">{sec.name}</span>
                          </div>
                        </button>
                      ))}
                    </div>

                    {/* Right Interactive Form Area */}
                    <div className="md:col-span-8 bg-white p-5 md:p-6 rounded-2xl border border-gray-150 space-y-5">
                      
                      {/* =======================================================
                          A. BRAND CLAIM SECTIONS RENDER
                          ======================================================= */}
                      {targetType === 'brand' && (
                        <>
                          {/* SECTION A: REGISTRY AND IDENTITY */}
                          {activeSection === 'A' && (
                            <div className="space-y-4 animate-fade-in">
                              <div>
                                <h3 className="text-sm font-extrabold tracking-tight text-[#1A1A2E] mb-0.5">Section A: Profile Representative Identity</h3>
                                <p className="text-[12px] text-[#9AA0AC] font-medium tracking-tight">Contact dossier of authorized manager</p>
                              </div>

                              <div className="space-y-3.5">
                                <div className="space-y-1">
                                  <label className="text-[12px] font-semibold text-[#9AA0AC] tracking-tight block">Full Legal Name</label>
                                  <input 
                                    type="text"
                                    required
                                    value={fullName}
                                    onChange={(e) => setFullName(e.target.value)}
                                    placeholder="Farhan Bin Rafiq"
                                    className="w-full h-11 bg-white border border-gray-200 rounded-xl px-3.5 text-xs font-bold focus:outline-none focus:border-[#F97316]"
                                  />
                                </div>

                                <div className="space-y-1">
                                  <label className="text-[12px] font-semibold text-[#9AA0AC] tracking-tight block">Corporate Email Address (Prefilled)</label>
                                  <input 
                                    type="email"
                                    disabled
                                    value={currentEmail}
                                    className="w-full h-11 bg-gray-50 text-gray-500 border border-gray-205 rounded-xl px-3.5 text-xs font-bold cursor-not-allowed"
                                  />
                                </div>

                                <div className="space-y-1">
                                  <label className="text-[12px] font-semibold text-[#9AA0AC] tracking-tight block">Direct Contact Phone Number</label>
                                  <input 
                                    type="tel"
                                    required
                                    value={phoneNumber}
                                    onChange={(e) => setPhoneNumber(e.target.value)}
                                    placeholder="+880 1712-349812"
                                    className="w-full h-11 bg-white border border-gray-200 rounded-xl px-3.5 text-xs font-bold focus:outline-none focus:border-[#F97316]"
                                  />
                                </div>

                                <div className="space-y-1">
                                  <label className="text-[12px] font-semibold text-[#9AA0AC] tracking-tight block">Target Brand Identity (Read-only)</label>
                                  <input 
                                    type="text"
                                    disabled
                                    value={targetName}
                                    className="w-full h-11 bg-gray-50 text-gray-500 border border-gray-205 rounded-xl px-3.5 text-xs font-black uppercase cursor-not-allowed"
                                  />
                                </div>

                                <div className="space-y-1.5">
                                  <label className="text-[12px] font-semibold text-[#9AA0AC] tracking-tight block">Official Corporate Authorization Status</label>
                                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                    {[
                                      { value: 'owner', label: 'Primary Brand Owner / Founder' },
                                      { value: 'authorized_rep', label: 'Authorized Corporate Representative' }
                                    ].map((opt) => (
                                      <button
                                        key={opt.value}
                                        type="button"
                                        onClick={() => setRoleSelection(opt.value as any)}
                                        className={`p-3 rounded-lg text-[12px] font-bold tracking-tight border text-left transition-all ${
                                          roleSelection === opt.value 
                                            ? 'bg-orange-50 border-[#F97316] text-[#F97316]' 
                                            : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                                        }`}
                                      >
                                        {opt.label}
                                      </button>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}

                          {/* SECTION B: BUSINESS VERIFICATION */}
                          {activeSection === 'B' && (
                            <div className="space-y-4 animate-fade-in">
                              <div>
                                <h3 className="text-sm font-extrabold tracking-tight text-[#1A1A2E] mb-0.5">Section B: Trade & Commercial Registry</h3>
                                <p className="text-[12px] text-[#9AA0AC] font-medium tracking-tight">Government-issued commercial authorization certs</p>
                              </div>

                              <div className="space-y-3.5">
                                <div className="space-y-1">
                                  <label className="text-[12px] font-semibold text-[#9AA0AC] tracking-tight block">Trade License or Registration Number</label>
                                  <input 
                                    type="text"
                                    required
                                    value={tradeLicenseNo}
                                    onChange={(e) => setTradeLicenseNo(e.target.value)}
                                    placeholder="E.g., TL-23910-NBR"
                                    className="w-full h-11 bg-white border border-gray-200 rounded-xl px-3.5 text-xs font-bold focus:outline-none focus:border-[#F97316]"
                                  />
                                </div>

                                <div className="space-y-1.5">
                                  <label className="text-[12px] font-semibold text-[#9AA0AC] tracking-tight block">Business Registration Document (Upload)</label>
                                  <div 
                                    onClick={() => simulateFileUpload('Trade License', setLicenseFile)}
                                    className="border-2 border-dashed border-gray-200 hover:border-[#F97316]/50 bg-white rounded-xl p-5 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-1"
                                  >
                                    {licenseFile ? (
                                      <>
                                        <FileCheck className="w-8 h-8 text-green-600 animate-pulse" />
                                        <span className="text-[10px] font-mono font-bold text-gray-800">{licenseFile}</span>
                                        <span className="text-[8px] text-gray-400 uppercase font-mono font-bold">Document uploaded successfully</span>
                                      </>
                                    ) : (
                                      <>
                                        <Upload className="w-6 h-6 text-gray-400" />
                                        <span className="text-[12px] font-semibold text-[#9AA0AC] tracking-tight">Attach Physical License Document Package</span>
                                        <span className="text-[8px] font-bold text-gray-400 uppercase font-mono">Accepts PDF, JPG, PNG up to 10MB</span>
                                      </>
                                    )}
                                  </div>
                                </div>

                                <div className="space-y-1">
                                  <label className="text-[12px] font-semibold text-[#9AA0AC] tracking-tight block">Official Brand Website URL</label>
                                  <div className="relative">
                                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-semibold text-gray-400">https://</span>
                                    <input 
                                      type="text"
                                      required
                                      value={websiteUrl}
                                      onChange={(e) => setWebsiteUrl(e.target.value)}
                                      placeholder="www.brandname.com"
                                      className="w-full h-11 bg-white border border-gray-200 rounded-xl pl-16 pr-3.5 text-xs font-bold focus:outline-none focus:border-[#F97316]"
                                    />
                                  </div>
                                </div>

                                <div className="space-y-1">
                                  <label className="text-[12px] font-semibold text-[#9AA0AC] tracking-tight block">Corporate Domain Email Verification</label>
                                  <input 
                                    type="email"
                                    required
                                    value={businessEmail}
                                    onChange={(e) => setBusinessEmail(e.target.value)}
                                    placeholder="executive@branddomain.com"
                                    className="w-full h-11 bg-white border border-gray-200 rounded-xl px-3.5 text-xs font-bold focus:outline-none focus:border-[#F97316]"
                                  />
                                  <span className="text-[12px] font-medium text-[#EB4501] tracking-tight mt-1 block">
                                    ⚠ Domain verification link will be cross-referenced with your website DNS configuration.
                                  </span>
                                </div>
                              </div>
                            </div>
                          )}

                          {/* SECTION C: LEGAL VERIFICATION (KYC) */}
                          {activeSection === 'C' && (
                            <div className="space-y-4 animate-fade-in">
                              <div>
                                <h3 className="text-sm font-extrabold tracking-tight text-[#1A1A2E] mb-0.5">Section C: Representative Identity Matching</h3>
                                <p className="text-[12px] text-[#9AA0AC] font-medium tracking-tight">National database integration credentials</p>
                              </div>

                              <div className="space-y-3.5">
                                <div className="space-y-1">
                                  <label className="text-[12px] font-semibold text-[#9AA0AC] tracking-tight block">National ID Number (NID)</label>
                                  <input 
                                    type="text"
                                    required
                                    value={nidNumber}
                                    onChange={(e) => setNidNumber(e.target.value)}
                                    placeholder="National NID card number (e.g. 1992-8812-321)"
                                    className="w-full h-11 bg-white border border-gray-200 rounded-xl px-3.5 text-xs font-bold focus:outline-none focus:border-[#F97316]"
                                  />
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                  <div className="space-y-1">
                                    <label className="text-[12px] font-semibold text-[#9AA0AC] tracking-tight block">NID Document (Front)</label>
                                    <div 
                                      onClick={() => simulateFileUpload('NID Front Card', setNidFront)}
                                      className="border border-dashed border-gray-200 bg-gray-50/50 hover:bg-white rounded-lg p-4 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-1"
                                    >
                                      {nidFront ? (
                                        <span className="text-[9px] font-mono font-bold text-green-600 block truncate max-w-full">{nidFront}</span>
                                      ) : (
                                        <>
                                          <Upload className="w-5 h-5 text-gray-400" />
                                          <span className="text-[12px] font-semibold text-[#9AA0AC] tracking-tight">Attach Front JPG/PDF</span>
                                        </>
                                      )}
                                    </div>
                                  </div>

                                  <div className="space-y-1">
                                    <label className="text-[12px] font-semibold text-[#9AA0AC] tracking-tight block">NID Document (Back)</label>
                                    <div 
                                      onClick={() => simulateFileUpload('NID Back Card', setNidBack)}
                                      className="border border-dashed border-gray-200 bg-gray-50/50 hover:bg-white rounded-lg p-4 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-1"
                                    >
                                      {nidBack ? (
                                        <span className="text-[9px] font-mono font-bold text-green-600 block truncate max-w-full">{nidBack}</span>
                                      ) : (
                                        <>
                                          <Upload className="w-5 h-5 text-gray-400" />
                                          <span className="text-[12px] font-semibold text-[#9AA0AC] tracking-tight">Attach Back JPG/PDF</span>
                                        </>
                                      )}
                                    </div>
                                  </div>
                                </div>

                                {/* Dynamic Webcam selfie placeholder UI */}
                                <div className="bg-orange-50/20 border border-[#F97316]/10 p-4 rounded-xl space-y-2">
                                  <span className="text-[12px] font-bold text-[#EB4501] tracking-tight block">National Registry Face Matching API</span>
                                  <div className="flex flex-col sm:flex-row items-center gap-4">
                                    <div className="w-20 h-20 rounded-full border border-gray-200 bg-white overflow-hidden shrink-0 flex items-center justify-center bg-cover bg-center" style={{ backgroundImage: selfiePreview ? `url(${selfiePreview})` : 'none' }}>
                                      {!selfiePreview && <Camera className="w-6 h-6 text-gray-400" />}
                                    </div>
                                    <div className="flex-1 space-y-1 text-center sm:text-left">
                                      <span className="text-xs font-bold text-[#1A1A2E] block">Selfie / Face Match Upload</span>
                                      <span className="text-[9.5px] text-gray-500 block leading-relaxed uppercase">
                                        Take a snapshot matching the front card profile.
                                      </span>
                                      <button
                                        type="button"
                                        onClick={handleTakeSelfie}
                                        disabled={isCapturing}
                                        className="h-9 px-4 mt-1 bg-[#000435] hover:bg-[#1a1a5e] text-white text-[12px] font-sans font-bold tracking-tight rounded-lg cursor-pointer border-none shadow-sm transition-all"
                                      >
                                        {isCapturing ? 'Acquiring Cam Lens...' : selfieCaptured ? 'Retake Biometric Verification' : 'Initialize Webcam Selfie'}
                                      </button>
                                    </div>
                                  </div>
                                </div>

                                <div className="space-y-1">
                                  <label className="text-[12px] font-semibold text-[#9AA0AC] tracking-tight block">Passport / Driving License Number (Optional)</label>
                                  <input 
                                    type="text"
                                    value={passportDrivingNum}
                                    onChange={(e) => setPassportDrivingNum(e.target.value)}
                                    placeholder="Alternative Government reference identifier"
                                    className="w-full h-11 bg-white border border-gray-200 rounded-xl px-3.5 text-xs font-bold focus:outline-none focus:border-[#F97316]"
                                  />
                                </div>
                              </div>
                            </div>
                          )}

                          {/* SECTION D: REVENUE REGISTRY & FINANCIALS */}
                          {activeSection === 'D' && (
                            <div className="space-y-4 animate-fade-in">
                              <div>
                                <h3 className="text-sm font-extrabold tracking-tight text-[#1A1A2E] mb-0.5">Section D: Financial & Settlement Auditing</h3>
                                <p className="text-[12px] text-[#9AA0AC] font-medium tracking-tight">Revenue tracking TIN accounts and settlement bank details</p>
                              </div>

                              <div className="space-y-3.5">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pb-1 border-b border-gray-100">
                                  <div className="space-y-1">
                                    <label className="text-[12px] font-semibold text-[#9AA0AC] tracking-tight">TIN Number (NBR Tax ID)</label>
                                    <input 
                                      type="text"
                                      required
                                      value={tinNumber}
                                      onChange={(e) => setTinNumber(e.target.value)}
                                      placeholder="Taxpayer identification"
                                      className="w-full h-11 bg-white border border-gray-200 rounded-xl px-3.5 text-xs font-bold focus:outline-none focus:border-[#F97316]"
                                    />
                                  </div>

                                  <div className="space-y-1">
                                    <label className="text-[12px] font-semibold text-[#9AA0AC] tracking-tight">VAT Registration Number (Optional)</label>
                                    <input 
                                      type="text"
                                      value={vatNumber}
                                      onChange={(e) => setVatNumber(e.target.value)}
                                      placeholder="Government VAT certificate"
                                      className="w-full h-11 bg-white border border-gray-200 rounded-xl px-3.5 text-xs font-bold focus:outline-none focus:border-[#F97316]"
                                    />
                                  </div>
                                </div>

                                <div className="bg-gray-50/75 border border-gray-150 p-4.5 rounded-xl space-y-3">
                                  <div className="flex items-center gap-1.5 text-[#1A1A2E]">
                                    <Landmark size={15} className="text-[#F97316]" />
                                    <span className="text-[12px] font-bold tracking-tight">Business Bank Account Details</span>
                                  </div>

                                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    <div className="space-y-1">
                                      <label className="text-[12px] font-semibold text-[#9AA0AC] tracking-tight block">Settlement Account Legal Name</label>
                                      <input 
                                        type="text"
                                        required
                                        value={bankAccName}
                                        onChange={(e) => setBankAccName(e.target.value)}
                                        placeholder="E.g., apex Footwear Sourcing"
                                        className="w-full h-10 border border-gray-200 rounded-lg px-3 text-[11px] font-bold focus:outline-none"
                                      />
                                    </div>

                                    <div className="space-y-1">
                                      <label className="text-[12px] font-semibold text-[#9AA0AC] tracking-tight block">Account Number</label>
                                      <input 
                                        type="text"
                                        required
                                        value={bankAccNumber}
                                        onChange={(e) => setBankAccNumber(e.target.value)}
                                        placeholder="Settlement checking account no"
                                        className="w-full h-10 border border-gray-200 rounded-lg px-3 text-[11px] font-medium focus:outline-none"
                                      />
                                    </div>

                                    <div className="space-y-1">
                                      <label className="text-[12px] font-semibold text-[#9AA0AC] tracking-tight block">Settlement Bank Name</label>
                                      <input 
                                        type="text"
                                        required
                                        value={bankName}
                                        onChange={(e) => setBankName(e.target.value)}
                                        placeholder="E.g., Bank Asia PLC"
                                        className="w-full h-10 border border-gray-200 rounded-lg px-3 text-[11px] font-bold focus:outline-none"
                                      />
                                    </div>

                                    <div className="space-y-1">
                                      <label className="text-[12px] font-semibold text-[#9AA0AC] tracking-tight block">Branch & Routing Code</label>
                                      <input 
                                        type="text"
                                        required
                                        value={bankBranch}
                                        onChange={(e) => setBankBranch(e.target.value)}
                                        placeholder="Branch location name"
                                        className="w-full h-10 border border-gray-200 rounded-lg px-3 text-[11px] font-bold focus:outline-none"
                                      />
                                    </div>
                                  </div>
                                </div>

                                <div className="space-y-1.5">
                                  <label className="text-[12px] font-semibold text-[#9AA0AC] tracking-tight block">Business Bank Account/Cheque Verification document</label>
                                  <div 
                                    onClick={() => simulateFileUpload('Settlement Bank Statement', setBankFile)}
                                    className="border border-dashed border-gray-200 bg-gray-50/50 hover:bg-white rounded-lg p-3 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-1"
                                  >
                                    {bankFile ? (
                                      <span className="text-[9px] font-mono font-bold text-green-600 block truncate max-w-full">{bankFile}</span>
                                    ) : (
                                      <>
                                        <Upload className="w-5 h-5 text-gray-400" />
                                        <span className="text-[12px] font-semibold text-[#9AA0AC] tracking-tight">Attach bank verification statement (.PDF)</span>
                                      </>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}

                          {/* SECTION E: DECLARATIONS */}
                          {activeSection === 'E' && (
                            <div className="space-y-4 animate-fade-in">
                              <div>
                                <h3 className="text-sm font-extrabold tracking-tight text-[#1A1A2E] mb-0.5">Section E: Representative Legal Undertaking</h3>
                                <p className="text-[12px] text-[#9AA0AC] font-medium tracking-tight">Authorized signature parameters check</p>
                              </div>

                              <div className="space-y-4">
                                <label className="flex items-start gap-3 p-3.5 bg-gray-50 hover:bg-white border border-gray-150 hover:border-gray-250 rounded-xl cursor-pointer select-none transition-colors">
                                  <input 
                                    type="checkbox"
                                    checked={checkAuthorized}
                                    onChange={(e) => setCheckAuthorized(e.target.checked)}
                                    className="mt-0.5 accent-[#F97316] w-4 h-4 shrink-0 rounded"
                                  />
                                  <div className="text-[10px] text-gray-600 font-extrabold leading-normal uppercase">
                                    I confirm I am authorized representative of this brand
                                  </div>
                                </label>

                                <label className="flex items-start gap-3 p-3.5 bg-gray-50 hover:bg-white border border-gray-150 hover:border-gray-250 rounded-xl cursor-pointer select-none transition-colors">
                                  <input 
                                    type="checkbox"
                                    checked={checkDetailsTrue}
                                    onChange={(e) => setCheckDetailsTrue(e.target.checked)}
                                    className="mt-0.5 accent-[#F97316] w-4 h-4 shrink-0 rounded"
                                  />
                                  <div className="text-[10px] text-gray-600 font-extrabold leading-normal uppercase">
                                    All information is accurate and legally valid
                                  </div>
                                </label>

                                <div className="bg-red-50/70 border border-red-100 p-4 rounded-xl flex items-start gap-3">
                                  <AlertTriangle className="w-4.5 h-4.5 text-red-600 shrink-0 mt-0.5" />
                                  <div className="text-[9.5px] text-red-800 font-black tracking-normal leading-normal uppercase">
                                    WARNING: Submission of counterfeit legal papers or identity fraud holds serious judicial penalties and warrants instant platform block.
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}
                        </>
                      )}

                      {/* =======================================================
                          B. CREATOR CLAIM SECTIONS RENDER
                          ======================================================= */}
                      {targetType === 'creator' && (
                        <>
                          {/* SECTION A: CREATOR PROFILE CREATION */}
                          {activeSection === 'A' && (
                            <div className="space-y-4 animate-fade-in col-span-1 border-none bg-transparent">
                              <div>
                                <h3 className="text-sm font-extrabold tracking-tight text-[#1A1A2E] mb-0.5">Section A: Creator Profile Registration</h3>
                                <p className="text-[12px] text-[#9AA0AC] font-medium tracking-tight">Primary profile database variables</p>
                              </div>

                              <div className="space-y-3.5 bg-trans">
                                <div className="space-y-1">
                                  <label className="text-[12px] font-semibold text-[#9AA0AC] tracking-tight block">Creator Display Name</label>
                                  <input 
                                    type="text"
                                    required
                                    value={creatorDisplayName}
                                    onChange={(e) => setCreatorDisplayName(e.target.value)}
                                    placeholder="E.g., Farhan bin Rafiq Vlogs"
                                    className="w-full h-11 bg-white border border-gray-200 rounded-xl px-3.5 text-xs font-bold focus:outline-none focus:border-[#F97316]"
                                  />
                                </div>

                                <div className="space-y-1">
                                  <label className="text-[12px] font-semibold text-[#9AA0AC] tracking-tight block">Username / Handle</label>
                                  <input 
                                    type="text"
                                    required
                                    value={creatorHandle}
                                    onChange={(e) => setCreatorHandle(e.target.value)}
                                    placeholder="farhanvlogs"
                                    className="w-full h-11 bg-white border border-gray-200 rounded-xl px-3.5 text-xs font-bold focus:outline-none focus:border-[#F97316]"
                                  />
                                </div>

                                <div className="space-y-1">
                                  <label className="text-[12px] font-semibold text-[#9AA0AC] tracking-tight block">Primary Creator Email</label>
                                  <input 
                                    type="email"
                                    required
                                    value={creatorEmail}
                                    onChange={(e) => setCreatorEmail(e.target.value)}
                                    placeholder="collabs@creator.com"
                                    className="w-full h-11 bg-white border border-gray-200 rounded-xl px-3.5 text-xs font-bold focus:outline-none focus:border-[#F97316]"
                                  />
                                </div>

                                <div className="space-y-1">
                                  <label className="text-[12px] font-semibold text-[#9AA0AC] tracking-tight block">Contact Phone Number</label>
                                  <input 
                                    type="tel"
                                    required
                                    value={creatorPhone}
                                    onChange={(e) => setCreatorPhone(e.target.value)}
                                    placeholder="+880 1712-329812"
                                    className="w-full h-11 bg-white border border-gray-200 rounded-xl px-3.5 text-xs font-bold focus:outline-none focus:border-[#F97316]"
                                  />
                                </div>

                                <div className="space-y-1">
                                  <label className="text-[12px] font-semibold text-[#9AA0AC] tracking-tight block">Creator Category Focus</label>
                                  <select 
                                    value={creatorCategory}
                                    onChange={(e) => setCreatorCategory(e.target.value as any)}
                                    className="w-full h-11 bg-white border border-gray-200 rounded-xl px-3.5 text-xs font-bold focus:outline-none focus:border-[#F97316]"
                                  >
                                    <option value="influencer">Influencer / Media Star</option>
                                    <option value="reviewer">Reviewer / Unboxer</option>
                                    <option value="affiliate">Affiliate / Sales Partner</option>
                                    <option value="other">Other Digital Creative Focus</option>
                                  </select>
                                </div>
                              </div>
                            </div>
                          )}

                          {/* SECTION B: SOCIAL IDENTITY VERIFICATION */}
                          {activeSection === 'B' && (
                            <div className="space-y-4 animate-fade-in col-span-1 border-none bg-transparent">
                              <div>
                                <h3 className="text-sm font-extrabold tracking-tight text-[#1A1A2E] mb-0.5">Section B: Social Identity Integration</h3>
                                <p className="text-[12px] text-[#9AA0AC] font-medium tracking-tight">Social profiles ownership links registry</p>
                              </div>

                              <div className="space-y-3.5">
                                <div className="space-y-1">
                                  <label className="text-[12px] font-semibold text-[#9AA0AC] tracking-tight block flex items-center gap-1">
                                    <Video size={10} className="text-red-500" /> YouTube Channel URL
                                  </label>
                                  <input 
                                    type="url"
                                    value={ytUrl}
                                    onChange={(e) => setYtUrl(e.target.value)}
                                    placeholder="https://youtube.com/c/yourchannel"
                                    className="w-full h-11 bg-white border border-gray-200 rounded-xl px-3.5 text-xs font-bold focus:outline-none focus:border-[#F97316]"
                                  />
                                </div>

                                <div className="space-y-1">
                                  <label className="text-[12px] font-semibold text-[#9AA0AC] tracking-tight block flex items-center gap-1">
                                    <Instagram size={10} className="text-pink-500" /> Instagram Profile URL
                                  </label>
                                  <input 
                                    type="url"
                                    value={igUrl}
                                    onChange={(e) => setIgUrl(e.target.value)}
                                    placeholder="https://instagram.com/handle"
                                    className="w-full h-11 bg-white border border-gray-200 rounded-xl px-3.5 text-xs font-bold focus:outline-none focus:border-[#F97316]"
                                  />
                                </div>

                                <div className="space-y-1">
                                  <label className="text-[12px] font-semibold text-[#9AA0AC] tracking-tight block flex items-center gap-1">
                                    <Rss size={10} className="text-violet-500" /> TikTok Profile URL
                                  </label>
                                  <input 
                                    type="url"
                                    value={ttUrl}
                                    onChange={(e) => setTtUrl(e.target.value)}
                                    placeholder="https://tiktok.com/@handle"
                                    className="w-full h-11 bg-white border border-gray-200 rounded-xl px-3.5 text-xs font-bold focus:outline-none focus:border-[#F97316]"
                                  />
                                </div>

                                <div className="space-y-1">
                                  <label className="text-[12px] font-semibold text-[#9AA0AC] tracking-tight block flex items-center gap-1">
                                    <Facebook size={10} className="text-blue-500" /> Facebook Page (Optional)
                                  </label>
                                  <input 
                                    type="url"
                                    value={fbUrl}
                                    onChange={(e) => setFbUrl(e.target.value)}
                                    placeholder="https://facebook.com/yourpage"
                                    className="w-full h-11 bg-white border border-gray-200 rounded-xl px-3.5 text-xs font-bold focus:outline-none focus:border-[#F97316]"
                                  />
                                </div>
                              </div>
                            </div>
                          )}

                          {/* SECTION C: IDENTITY VERIFICATION */}
                          {activeSection === 'C' && (
                            <div className="space-y-4 animate-fade-in col-span-1 border-none bg-transparent">
                              <div>
                                <h3 className="text-sm font-extrabold tracking-tight text-[#1A1A2E] mb-0.5">Section C: Government Identity Proof</h3>
                                <p className="text-[12px] text-[#9AA0AC] font-medium tracking-tight">Physical identification checks</p>
                              </div>

                              <div className="space-y-3.5">
                                <div className="space-y-1">
                                  <label className="text-[12px] font-semibold text-[#9AA0AC] tracking-tight block">NID Number</label>
                                  <input 
                                    type="text"
                                    required
                                    value={creatorNid}
                                    onChange={(e) => setCreatorNid(e.target.value)}
                                    placeholder="National NID card value (e.g., 9012-321-8812)"
                                    className="w-full h-11 bg-white border border-gray-200 rounded-xl px-3.5 text-xs font-bold focus:outline-none focus:border-[#F97316]"
                                  />
                                </div>

                                <div className="space-y-1.5">
                                  <label className="text-[12px] font-semibold text-[#9AA0AC] tracking-tight block">Government ID Document (Front Photo / Scan)</label>
                                  <div 
                                    onClick={() => simulateFileUpload('Government ID', setCreatorGovId)}
                                    className="border-2 border-dashed border-gray-200 hover:border-[#F97316]/50 bg-white rounded-xl p-5 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-1"
                                  >
                                    {creatorGovId ? (
                                      <>
                                        <FileCheck className="w-8 h-8 text-green-600" />
                                        <span className="text-[10px] font-mono font-bold text-gray-850">{creatorGovId}</span>
                                        <span className="text-[8px] text-gray-400 font-bold uppercase font-mono">ID received successfully</span>
                                      </>
                                    ) : (
                                      <>
                                        <Upload className="w-6 h-6 text-gray-400" />
                                        <span className="text-[12px] font-semibold text-[#9AA0AC] tracking-tight font-sans">Upload NID or Passport File</span>
                                        <span className="text-[8px] font-bold text-gray-400 uppercase font-mono">PDF, PNG, JPG up to 12MB</span>
                                      </>
                                    )}
                                  </div>
                                </div>

                                {/* Dynamic Webcam selfie placeholder UI */}
                                <div className="bg-orange-50/20 border border-[#F97316]/10 p-4 rounded-xl space-y-2">
                                  <span className="text-[12px] font-bold text-[#EB4501] tracking-tight block font-mono">Biometric Presence Matching</span>
                                  <div className="flex flex-col sm:flex-row items-center gap-4">
                                    <div className="w-20 h-20 rounded-full border border-gray-200 bg-white overflow-hidden shrink-0 flex items-center justify-center bg-cover bg-center" style={{ backgroundImage: selfiePreview ? `url(${selfiePreview})` : 'none' }}>
                                      {!selfiePreview && <Camera className="w-6 h-6 text-gray-400" />}
                                    </div>
                                    <div className="flex-1 space-y-1 text-center sm:text-left">
                                      <span className="text-xs font-bold text-[#1A1A2E] block">Selfie Verification Match</span>
                                      <span className="text-[9.5px] text-gray-500 block leading-relaxed uppercase">
                                        Take a real-life face snapshot to match central social databases.
                                      </span>
                                      <button
                                        type="button"
                                        onClick={handleTakeSelfie}
                                        disabled={isCapturing}
                                        className="h-9 px-4 mt-1 bg-[#000435] hover:bg-[#1a1a5e] text-white text-[12px] font-sans font-bold tracking-tight rounded-lg cursor-pointer border-none shadow-sm transition-all"
                                      >
                                        {isCapturing ? 'Acquiring Cam Lens...' : selfieCaptured ? 'Retake Biometric Verification' : 'Initialize Webcam Selfie'}
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}

                          {/* SECTION D: CREATOR AUTHORIZATION */}
                          {activeSection === 'D' && (
                            <div className="space-y-4 animate-fade-in col-span-1 border-none bg-transparent">
                              <div>
                                <h3 className="text-sm font-extrabold tracking-tight text-[#1A1A2E] mb-0.5">Section D: Creator Authorization</h3>
                                <p className="text-[12px] text-[#9AA0AC] font-medium tracking-tight">Mandatory digital owner undertaking</p>
                              </div>

                              <div className="space-y-4">
                                <label className="flex items-start gap-3 p-3.5 bg-gray-50 hover:bg-white border border-gray-150 hover:border-gray-250 rounded-xl cursor-pointer select-none transition-colors">
                                  <input 
                                    type="checkbox"
                                    checked={creatorDeclare}
                                    onChange={(e) => setCreatorDeclare(e.target.checked)}
                                    className="mt-0.5 accent-[#F97316] w-4 h-4 shrink-0 rounded"
                                  />
                                  <div className="text-[10px] text-gray-600 font-extrabold leading-normal uppercase">
                                    I confirm I am the original owner of this creator profile
                                  </div>
                                </label>

                                <div className="bg-red-50/70 border border-red-100 p-4 rounded-xl flex items-start gap-3">
                                  <AlertTriangle className="w-4.5 h-4.5 text-red-600 shrink-0 mt-0.5" />
                                  <div className="text-[9.5px] text-red-800 font-black tracking-normal leading-normal uppercase">
                                    CRITICAL WARNING: Impersonating famous creatives or uploading mock social ID profiles is a violation of international copyright terms and is subject to immediate legal action.
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}
                        </>
                      )}

                    </div>
                  </div>

                  {/* Modal FOOTER ACTIONS STEPPER LOGIC */}
                  <div className="flex border-t border-gray-100 pt-5 justify-between items-center shrink-0 bg-white">
                    <button
                      type="button"
                      onClick={() => {
                        const keys: ActiveSection[] = targetType === 'brand' ? ['A', 'B', 'C', 'D', 'E'] : ['A', 'B', 'C', 'D'];
                        const idx = keys.indexOf(activeSection);
                        if (idx > 0) {
                          setActiveSection(keys[idx - 1]);
                        }
                      }}
                      disabled={activeSection === 'A'}
                      className="px-5 h-11 rounded-xl text-[9px] font-black uppercase text-gray-600 hover:text-navy hover:bg-gray-50 border border-gray-200 disabled:opacity-30 disabled:pointer-events-none transition-all cursor-pointer bg-white"
                    >
                      Previous Section
                    </button>

                    {activeSection !== (targetType === 'brand' ? 'E' : 'D') ? (
                      <button
                        type="button"
                        onClick={() => {
                          const keys: ActiveSection[] = targetType === 'brand' ? ['A', 'B', 'C', 'D', 'E'] : ['A', 'B', 'C', 'D'];
                          const idx = keys.indexOf(activeSection);
                          setActiveSection(keys[idx + 1]);
                        }}
                        className="px-6 h-11 rounded-xl text-[9px] font-black uppercase bg-[#1A1A2E] text-white hover:bg-[#2A2A4E] transition-all cursor-pointer flex items-center gap-1 border-none shadow-sm"
                      >
                        Next Section <ArrowRight size={12} />
                      </button>
                    ) : (
                      <button
                        type="submit"
                        className="px-6 h-11 rounded-xl text-[9px] font-black uppercase bg-[#F97316] text-white hover:bg-[#EA580C] shadow-md transition-all cursor-pointer flex items-center gap-1 border-none"
                      >
                        Submit {targetType === 'brand' ? 'Brand' : 'Creator'} Claim
                      </button>
                    )}
                  </div>
                </form>
              )}

              {/* STEP 4: SUBMITTING / UPLOADING */}
              {flowStep === 'submitting' && (
                <div id="submitting-processing" className="max-w-md mx-auto py-16 space-y-5 text-center animate-fade-in flex flex-col items-center justify-center">
                  <div className="w-12 h-12 rounded-full border-3 border-[#F97316] border-t-transparent animate-spin shrink-0" />
                  <div className="space-y-1 shrink-0">
                    <h3 className="text-base font-extrabold tracking-tight text-[#1A1A2E]">Submitting verification…</h3>
                    <p className="text-[9px] text-[#F97316] font-black uppercase tracking-widest font-mono">Securing corporate credentials network...</p>
                  </div>
                  <p className="text-[10.5px] text-gray-500 font-bold max-w-sm leading-relaxed uppercase">
                    Your trade licensing profiles, government national identity details, face vectors, and settlement bank logs are being compiled for secure moderation evaluation.
                  </p>
                </div>
              )}

              {/* STEP 5: STATIC "VERIFICATION PENDING" STATUS SCREEN */}
              {flowStep === 'success_status' && (
                <div id="static-verification-pending-card" className="max-w-lg mx-auto py-8 space-y-6 text-center animate-fade-in flex flex-col items-center justify-center select-text">
                  {/* Big non-looping static badge */}
                  <div className="w-14 h-14 bg-amber-500 text-white rounded-2xl flex items-center justify-center shadow-md shrink-0">
                    <Clock size={28} className="stroke-[2.5]" />
                  </div>

                  <div className="space-y-2 shrink-0">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-[12px] font-bold tracking-tight bg-amber-100 text-amber-800 border border-amber-200">
                      Ownership Verification Pending
                    </span>
                    <h3 className="text-xl font-extrabold tracking-tight text-[#1A1A2E]">Your submission is under review</h3>
                    <p className="text-[13px] text-[#9AA0AC] font-medium leading-relaxed max-w-sm">
                      "We will notify you once verification is complete"
                    </p>
                  </div>

                  {/* High contrast static detail index block */}
                  <div className="w-full bg-white border border-gray-150 rounded-2xl p-5 text-left space-y-4">
                    <div className="flex items-center gap-1.5 border-b border-gray-100 pb-2 pb-1.5 shrink-0">
                      <Award size={13} className="text-[#F97316]" />
                      <span className="text-[12px] font-bold text-[#1A1A2E] tracking-tight">Registry Processing Track</span>
                    </div>

                    <div className="relative pl-6 space-y-6 border-l border-gray-200/80">
                      <div className="relative">
                        <span className="absolute -left-8.5 top-0 w-5 h-5 rounded-full bg-green-500 flex items-center justify-center text-white text-[8px] font-bold">
                          ✓
                        </span>
                        <div>
                          <span className="text-[10px] font-black text-gray-800 uppercase block">Credentials Dossier Uploaded</span>
                          <span className="text-[8.5px] text-gray-400 uppercase font-bold tracking-wider block">Completed just now</span>
                        </div>
                      </div>

                      <div className="relative">
                        <span className="absolute -left-8.5 top-0 w-5 h-5 rounded-full bg-amber-500 flex items-center justify-center text-white text-[8px] font-bold">
                          ●
                        </span>
                        <div>
                          <span className="text-[10px] font-black text-amber-700 uppercase block">Manual Auditing & Verification Review</span>
                          <span className="text-[9px] text-gray-550 font-bold leading-relaxed block uppercase mt-0.5">
                            Our administration committee is actively analyzing physical trade certificates, identity logs, and biometric match indexes.
                          </span>
                        </div>
                      </div>

                      <div className="relative opacity-35">
                        <span className="absolute -left-8.5 top-0 w-5 h-5 rounded-full bg-gray-250 border border-gray-300"></span>
                        <div>
                          <span className="text-[10px] font-black text-gray-800 uppercase block">Sovereign Storefront Control Transferred</span>
                          <span className="text-[8px] text-gray-400 uppercase font-black block">Awaiting physical validations</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-4 w-full">
                    <button
                      type="button"
                      onClick={onClose}
                      className="flex-1 h-12 rounded-xl text-[9px] font-sans font-black uppercase text-gray-600 hover:text-navy hover:bg-gray-50 border border-gray-200 transition-all cursor-pointer bg-white"
                    >
                      Close Window
                    </button>
                    <button
                      type="button"
                      onClick={onClose}
                      className="flex-1 h-12 rounded-xl text-[9px] font-sans font-black uppercase bg-[#1A1A2E] text-white hover:bg-[#2A2A4E] transition-all cursor-pointer border-none shadow-sm"
                    >
                      Return To Dashboard
                    </button>
                  </div>
                </div>
              )}

            </div>

          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
