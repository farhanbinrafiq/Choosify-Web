import React from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { CheckCircle2, ShoppingBag, FileText, ArrowRight, MessageSquare, ShieldCheck, Download, ExternalLink } from 'lucide-react';
import toast from 'react-hot-toast';

export function OrderSuccessPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const order = (location.state as any)?.order;

  React.useEffect(() => {
    if (!order) {
      navigate('/');
    }
  }, [order, navigate]);

  if (!order) return null;

  const handleDownloadInvoice = () => {
    toast.success('Stated Pro-Forma Invoice sheet compiled successfully! Initiated PDF rendering buffer.');
  };

  return (
    <div className="flex flex-col min-h-screen bg-choosify-feed">
      {/* Visual Header */}
      <div className="w-full pt-16 pb-24 px-4 text-center text-white relative overflow-hidden border-b border-white/5">
        <div className="absolute inset-0 hero-gradient" />
        <div className="max-w-2xl mx-auto relative z-10 flex flex-col items-center gap-6">
          <div className="w-20 h-20 bg-green-500/10 border border-green-500/30 rounded-full flex items-center justify-center text-green-400">
            <CheckCircle2 size={44} className="animate-pulse" />
          </div>

          <div className="space-y-2">
            <span className="text-[9px] font-black text-[#F96500] uppercase tracking-[0.3em] italic">Transaction Staged Successfully</span>
            <h1 className="text-3xl md:text-4xl font-black uppercase tracking-tighter italic">
              Order Confirmed &amp; <span className="text-green-400">Routed</span>
            </h1>
            <p className="text-gray-400 text-xs font-semibold uppercase tracking-widest leading-normal max-w-lg">
              Ticket <span className="text-white font-mono">{order.orderId}</span> has been dispatched to merchant factory logs. Direct message streams are active.
            </p>
          </div>
        </div>
      </div>

      {/* Main detailed blocks */}
      <div className="max-w-4xl mx-auto w-full px-4 py-12 -mt-12 relative z-20 space-y-8">
        {/* Split invoices card */}
        <div className="bg-white border border-gray-100 rounded-[5px] p-8 md:p-10 shadow-xl shadow-navy/5 space-y-8">
          <div>
            <h3 className="text-sm font-black text-navy uppercase italic tracking-widest border-b pb-4 mb-6">
              Corporate Bill of Lading &amp; Split Invoices
            </h3>

            <div className="space-y-4">
              {order.subOrders.map((sub: any, idx: number) => (
                <div key={idx} className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-6 border border-gray-100 rounded-[5px] bg-gray-50/50 hover:bg-gray-50 transition-colors gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="text-[10px] bg-navy text-white font-black uppercase tracking-widest px-2 py-0.5 rounded italic">
                        INVOICE {idx + 1}
                      </span>
                      <span className="text-xs font-bold text-navy">{sub.sellerBusinessName}</span>
                    </div>
                    <div className="flex flex-wrap items-center gap-3 text-[10px] text-gray-400 font-bold uppercase font-mono mb-2">
                      <span>ID: {sub.invoiceId}</span>
                      <span>•</span>
                      <span>TRACKING STATUS: {sub.trackingStatus.toUpperCase()}</span>
                    </div>
                    <div className="text-[10px] text-gray-500 space-y-0.5">
                      {sub.items.map((it: any, iIdx: number) => (
                        <p key={iIdx}>• {it.productTitle} ({it.quantity} units x ৳{it.price.toLocaleString()})</p>
                      ))}
                    </div>
                  </div>

                  <div className="sm:text-right shrink-0">
                    <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest block leading-none mb-1">Lot Net Sum</span>
                    <p className="text-base font-black text-[#F96500] italic leading-none mb-1">
                      ৳{sub.items.reduce((acc: number, x: any) => acc + (x.price * x.quantity), 0).toLocaleString()}
                    </p>
                    <span className="text-[8.5px] font-bold text-gray-300 block">Freight: ৳{sub.deliveryFee}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Settle summary */}
          <div className="bg-navy p-6 rounded-[5px] text-white flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <span className="text-[8px] font-black text-orange-primary uppercase tracking-widest block mb-1">Total Settlement Amount</span>
              <p className="text-2xl font-black font-sans text-white italic leading-none">৳{order.overallTotal.toLocaleString()}</p>
            </div>
            
            <button 
              onClick={handleDownloadInvoice}
              className="flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/15 px-5 py-3 rounded-full text-[10px] font-black uppercase tracking-widest italic text-white transition-all"
            >
              <Download size={14} className="text-orange-primary" />
              Download Pro-Forma Invoice
            </button>
          </div>
        </div>

        {/* Action routing cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Conversational coordinator card */}
          <div className="bg-white border border-gray-100 rounded-[5px] p-8 shadow-sm space-y-4 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="w-12 h-12 rounded-2xl bg-orange-primary/5 flex items-center justify-center text-orange-primary">
                <MessageSquare size={24} />
              </div>
              <h4 className="text-sm font-black text-navy uppercase italic tracking-wider">Seller Direct Channels</h4>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wide leading-relaxed">
                We have instantly generated custom chat logs with the supplier freight team. Send shipping updates or confirm COD terms now!
              </p>
            </div>

            <button 
              onClick={() => navigate('/messages')}
              className="w-full h-12 bg-[#050514] hover:bg-[#F96500] text-white text-[10px] font-black uppercase tracking-widest rounded-xl flex items-center justify-between px-6 transition-all italic"
            >
              <span>Open Merchant Inbox</span>
              <ArrowRight size={14} />
            </button>
          </div>

          {/* Tracker tool card */}
          <div className="bg-white border border-gray-100 rounded-[5px] p-8 shadow-sm space-y-4 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="w-12 h-12 rounded-2xl bg-[#050514]/5 flex items-center justify-center text-navy">
                <ShoppingBag size={24} />
              </div>
              <h4 className="text-sm font-black text-navy uppercase italic tracking-wider">Fulfillment Logs Tracker</h4>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wide leading-relaxed">
                Access dispatch dispatch logs, transit vectors, paperfly staging checkpoints, and arrival windows directly.
              </p>
            </div>

            <button 
              onClick={() => navigate('/order-tracking', { state: { order } })}
              className="w-full h-12 bg-orange-primary hover:bg-navy text-white text-[10px] font-black uppercase tracking-widest rounded-xl flex items-center justify-between px-6 transition-all italic"
            >
              <span>View Live Order Tracker</span>
              <ArrowRight size={14} />
            </button>
          </div>
        </div>

        {/* Home direct */}
        <div className="text-center pt-4">
          <Link to="/" className="text-xs font-black text-navy uppercase tracking-widest italic hover:text-orange-primary transition-all">
            ← Return to Home Shopping Stream
          </Link>
        </div>
      </div>
    </div>
  );
}
