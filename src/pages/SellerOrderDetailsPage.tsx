import React from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { FileText, ArrowLeft, Mail, Phone, Calendar, MapPin, Printer, ShieldCheck, CreditCard, MessageSquare } from 'lucide-react';
import toast from 'react-hot-toast';

export function SellerOrderDetailsPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const sub = (location.state as any)?.subOrder;

  React.useEffect(() => {
    if (!sub) {
      navigate('/seller/orders');
    }
  }, [sub, navigate]);

  if (!sub) return null;

  const handlePrint = () => {
    toast.success('Initiated printing of commercial freight declaration!');
  };

  return (
    <div className="flex flex-col min-h-screen bg-choosify-feed">
      {/* Header Panel */}
      <div className="w-full relative overflow-hidden shrink-0 border-b border-white/5">
        <div className="absolute inset-0 hero-gradient pointer-events-none" />
        <div className="max-w-[1914px] mx-auto w-full h-[303px] px-6 flex items-center justify-between relative z-10 animate-fade-in">
          <div className="flex flex-col justify-center">
            <button 
              onClick={() => navigate('/seller/orders')} 
              className="group text-[10px] font-black text-gray-400 hover:text-white transition-colors uppercase tracking-widest italic flex items-center gap-1.5 mb-1 cursor-pointer"
            >
              <ArrowLeft size={12} className="group-hover:-translate-x-1 transition-transform" />
              Return to Factory Queue / Ledger
            </button>
            <h1 className="text-xl md:text-2xl lg:text-3xl font-black uppercase tracking-tighter italic leading-none">
              Commercial <span className="text-[#F96500]">Invoice</span> Statement
            </h1>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">
              PRO-FORMA CONSIGNMENT TICKET ID: <span className="text-white font-mono">{sub.invoiceId}</span>
            </p>
          </div>

          <button 
            onClick={handlePrint}
            className="bg-white/5 border border-white/10 hover:bg-white/10 text-white text-[8px] font-black uppercase tracking-widest px-4 py-2 rounded-full transition-all italic flex items-center gap-1.5 cursor-pointer"
          >
            <Printer size={11} className="text-[#F96500] shrink-0 animate-pulse" />
            Print Waybill
          </button>
        </div>
      </div>

      {/* Invoice Staging Block */}
      <div className="max-w-4xl mx-auto w-full px-4 py-12 flex-1">
        <div className="bg-white border border-gray-100 rounded-[5px] p-8 md:p-12 shadow-sm space-y-10">
          {/* Top Invoice Header Grid */}
          <div className="flex flex-col md:flex-row justify-between gap-8 border-b pb-8">
            <div className="space-y-3">
              <span className="text-[9px] bg-navy text-white px-2.5 py-1 rounded font-black italic tracking-widest uppercase">
                Consignee Verification Log
              </span>
              <div className="space-y-1">
                <p className="text-xs font-black text-navy uppercase italic">Destination Stream:</p>
                <div className="text-[11px] font-bold text-gray-500 space-y-1 text-left">
                  <p className="flex items-center gap-1.5 text-navy font-black"><MapPin size={12} className="text-orange-primary" /> House 42, Road 11, Banani, Dhaka</p>
                  <p className="flex items-center gap-1.5"><Phone size={12} /> +880 1712-345678</p>
                  <p className="flex items-center gap-1.5"><Calendar size={12} /> Staged: {new Date(sub.overallOrderDate).toLocaleString()}</p>
                </div>
              </div>
            </div>

            <div className="md:text-right space-y-1.5 md:items-end flex flex-col">
              <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest">STAGING SOURCE</span>
              <h2 className="text-base font-black text-[#F96500] uppercase italic tracking-wider leading-none">
                {sub.sellerBusinessName} Outlet
              </h2>
              <span className="text-[9px] font-bold text-gray-400 block">Registered Carrier Contract #33</span>
              <div className="bg-navy p-3 rounded-xl text-white inline-block mt-2">
                <span className="text-[7.5px] font-black text-orange-primary uppercase tracking-widest block mb-0.5 leading-none">ORDER PARENT REFERENCE</span>
                <span className="text-xs font-black font-mono tracking-tight text-white">{sub.parentOrderId}</span>
              </div>
            </div>
          </div>

          {/* Products Table */}
          <div className="space-y-4">
            <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest block leading-none">Invoice Products Staged details</span>
            <div className="border border-gray-100 rounded-[5px] overflow-hidden divide-y divide-gray-100 shadow-inner">
              <div className="bg-[#F8FAFC] px-6 py-3.5 grid grid-cols-4 text-[9px] font-black text-navy uppercase tracking-widest italic">
                <div className="col-span-2">Staged Inventory Description</div>
                <div className="text-center">Units lot Qty</div>
                <div className="text-right">Unit Lot Cost</div>
              </div>

              {sub.items.map((it: any, idx: number) => (
                <div key={idx} className="px-6 py-4 grid grid-cols-4 text-xs font-bold text-navy items-center hover:bg-gray-50/40 transition-colors">
                  <div className="col-span-2 uppercase font-black tracking-tight italic text-[11px] text-navy">{it.productTitle}</div>
                  <div className="text-center text-[#F96500] text-sm font-black font-mono italic">{it.quantity}</div>
                  <div className="text-right text-[11px] font-black italic">৳{it.price.toLocaleString()}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Settle summary calculations */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-6 border border-gray-100 rounded-[5px] bg-[#F8FAFC] gap-4">
            <div>
              <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest block mb-0.5">Payment Settle method:</span>
              <span className="text-xs font-black text-navy uppercase italic">
                {sub.isCOD ? 'CASH ON DELIVERY ESCROW' : 'CREDIT TERMS ACCOUNTS RECEIVED'}
              </span>
            </div>

            <div className="sm:text-right shrink-0">
              <span className="text-[8px] font-black text-gray-400 block leading-none mb-1 uppercase tracking-widest">NET TRANSACTION EARNING</span>
              <p className="text-2xl font-black text-[#F96500] font-sans italic leading-none">
                ৳{sub.price ? (sub.price * sub.quantity).toLocaleString() : sub.items.reduce((sum: number, x: any) => sum + (x.price * x.quantity), 0).toLocaleString()}
              </p>
              <span className="text-[8.5px] font-bold text-gray-300 block">Freight Charge Included: ৳{sub.deliveryFee}</span>
            </div>
          </div>

          {/* Help visual coordination card wrapper and buyer-seller chat trigger */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-t pt-8">
            <div className="p-5 border border-gray-100 rounded-[5px] flex gap-3.5 items-center">
              <ShieldCheck size={28} className="text-green-600 shrink-0" />
              <div className="space-y-0.5">
                <h4 className="text-[10px] font-black uppercase text-navy italic leading-none">Double Escrow Guaranteed</h4>
                <p className="text-[8px] text-gray-400 font-medium leading-relaxed leading-normal">
                  All funds are held in secure escrow. Dispute resolution mechanisms are tracked for merchant assurance.
                </p>
              </div>
            </div>

            <button 
              onClick={() => {
                navigate('/dashboard');
                toast.success('Channel active! Redirected to coordination feed logs.');
              }}
              className="p-5 border border-dashed border-[#F96500]/30 hover:bg-[#F96500]/5 hover:border-[#F96500] rounded-[5px] flex gap-3.5 items-center justify-between text-left group transition-all"
            >
              <div className="flex gap-3.5 items-center">
                <MessageSquare size={28} className="text-[#F96500] shrink-0" />
                <div className="space-y-0.5">
                  <h4 className="text-[10px] font-black uppercase text-navy italic leading-none">Buyer Contact Channel</h4>
                  <p className="text-[8px] text-gray-400 font-medium leading-relaxed leading-normal">Interact directly with Kamal Uddin regarding custom logistics schedules.</p>
                </div>
              </div>
              <ArrowLeft size={16} className="text-[#F96500] rotate-180 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
