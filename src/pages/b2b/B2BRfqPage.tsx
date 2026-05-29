import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FileCheck2, Send, HelpCircle, ArrowLeft, RefreshCw, Layers,
  ChevronRight, Info, AlertCircle, CheckCircle2, Clock
} from 'lucide-react';
import { useGlobalState } from '../../context/GlobalStateContext';
import toast from 'react-hot-toast';

export function B2BRfqPage() {
  const navigate = useNavigate();
  const { rfqs, submitRfq, acceptQuotation } = useGlobalState();

  const [rfqItem, setRfqItem] = useState('');
  const [rfqQty, setRfqQty] = useState(100);
  const [rfqCat, setRfqCat] = useState('Fashion & Lifestyle');
  const [rfqPrice, setRfqPrice] = useState(300);
  const [rfqNotes, setRfqNotes] = useState('');

  const handleRfqBroadcastSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rfqItem.trim()) {
      toast.error('Please specify what item you want to source');
      return;
    }
    submitRfq({
      item: rfqItem,
      category: rfqCat,
      quantity: rfqQty,
      targetPrice: rfqPrice,
      notes: rfqNotes || `Urgent volume inquiry. Production must meet standard industrial parameters.`
    });
    setRfqItem('');
    setRfqNotes('');
    toast.success('Commercial RFQ broadcasted to verified Bangladesh factories!');
  };

  return (
    <div className="min-h-screen bg-white text-slate-800 font-sans pb-16 selection:bg-[#FF0038] selection:text-white font-sans">
      
      {/* 1. HERO BANNER HEADER */}
      <div className="bg-gradient-to-br from-[#081120] via-[#0b1b33] to-[#FF0038] py-14 border-none text-white relative">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <button 
            onClick={() => navigate('/')}
            className="flex items-center gap-1 text-[10px] font-black uppercase tracking-widest text-[#FF0038]/90 hover:text-white transition-colors mb-4 italic"
          >
            <ArrowLeft size={12} /> B2B Portal Hub
          </button>
          
          <h1 className="text-3xl md:text-5xl font-black text-white italic uppercase tracking-tighter leading-none">
            Corporate RFQ System
          </h1>
          <p className="text-xs text-slate-200 mt-2 max-w-xl font-medium tracking-wide">
            Broadcast sourcing specifications across regional textile hubs, RMG clusters, and electronics suppliers. Standard contracts generated systematically.
          </p>
        </div>
      </div>

      {/* 2. RFQ CONTENT GRID */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 mt-10 grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Side: Submit New Sourcing Form - 4 cols */}
        <div className="lg:col-span-4 bg-[#081120] border-none rounded-[32px] p-6 shadow-xl text-white relative h-fit sticky top-24">
          <h3 className="text-lg font-black text-white italic uppercase tracking-tight pb-2 border-b border-white/10 mb-6">
            Broadcast New Sourcing Lot
          </h3>

          <form onSubmit={handleRfqBroadcastSubmit} className="space-y-4">
            <div>
              <label className="block text-[8px] font-black uppercase tracking-widest text-slate-300 mb-1.5 font-mono">Specification Item Name</label>
              <input 
                type="text" 
                value={rfqItem}
                onChange={(e) => setRfqItem(e.target.value)}
                required
                placeholder="e.g. Combed Pima Cotton Polo shirts lot for corporate"
                className="w-full h-10 px-3 bg-black/40 border border-white/10 rounded-lg text-xs font-bold text-white focus:outline-none focus:border-[#FF0038]"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[8px] font-black uppercase tracking-widest text-slate-300 mb-1.5">Quantity Required</label>
                <input 
                  type="number" 
                  value={rfqQty}
                  onChange={(e) => setRfqQty(Number(e.target.value))}
                  className="w-full h-10 px-3 bg-black/40 border border-white/10 rounded-lg text-xs font-bold text-white focus:outline-none focus:border-[#FF0038]"
                />
              </div>
              <div>
                <label className="block text-[8px] font-black uppercase tracking-widest text-slate-300 mb-1.5">Target Budget (BDT)</label>
                <input 
                  type="number" 
                  value={rfqPrice}
                  onChange={(e) => setRfqPrice(Number(e.target.value))}
                  className="w-full h-10 px-3 bg-black/40 border border-white/10 rounded-lg text-xs font-bold text-white focus:outline-none focus:border-[#FF0038]"
                />
              </div>
            </div>

            <div>
              <label className="block text-[8px] font-black uppercase tracking-widest text-slate-300 mb-1.5">Primary Category Selection</label>
              <select 
                value={rfqCat}
                onChange={(e) => setRfqCat(e.target.value)}
                className="w-full h-10 px-3 bg-black/40 border border-[#081120]/10 rounded-lg text-xs font-bold text-white focus:outline-none focus:border-[#FF0038]"
              >
                <option className="bg-[#081120]">Fashion & Lifestyle</option>
                <option className="bg-[#081120]">Tech & Electronics</option>
                <option className="bg-[#081120]">Mobile & Phones</option>
                <option className="bg-[#081120]">Jewelry & Accessories</option>
              </select>
            </div>

            <div>
              <label className="block text-[8px] font-black uppercase tracking-widest text-slate-300 mb-1.5">Material & Branding Directives</label>
              <textarea 
                value={rfqNotes}
                onChange={(e) => setRfqNotes(e.target.value)}
                rows={3}
                placeholder="Include custom fabric blend ratios, lead times, GOTS or OEKO certification guidelines."
                className="w-full p-3 bg-black/40 border border-white/10 rounded-lg text-xs font-bold text-white focus:outline-none focus:border-[#FF0038] resize-none"
              />
            </div>

            <button 
              type="submit"
              className="w-full h-12 bg-[#FF0038] hover:bg-[#d6002f] text-white border-none rounded-lg text-xs font-black uppercase tracking-widest italic transition-all shadow-md flex items-center justify-center gap-2"
            >
              Broadcast Sourcing RFQ <Send size={12} />
            </button>
          </form>
        </div>

        {/* Right Side: Active RFQs & Direct Quotations - 8 cols */}
        <div className="lg:col-span-8 space-y-6">
          <h2 className="text-xl font-black text-[#081120] italic uppercase tracking-tight pl-2">Live volume bidding desk</h2>
          
          {rfqs.length === 0 ? (
            <div className="bg-[#F7F8FA] border border-slate-200 rounded-[32px] p-12 text-center text-slate-800 shadow-sm">
              <HelpCircle size={40} className="text-slate-400 mx-auto mb-4" />
              <h4 className="font-bold text-base text-[#081120] italic">No Active Sourcing Broadcasts</h4>
              <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">Submit your specific lot requirements using the rapid broadcast drawer.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {rfqs.map((q) => (
                <div 
                  key={q.id}
                  className="bg-[#F7F8FA] border border-slate-200 rounded-[28px] p-6 relative overflow-hidden transition-all duration-300 shadow-sm text-slate-800"
                >
                  <div className="flex flex-col md:flex-row justify-between md:items-start gap-4 border-b border-slate-200 pb-4 mb-4">
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-[9px] font-black font-mono tracking-widest text-[#FF0038]">{q.id}</span>
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest font-sans">{q.category}</span>
                        <span className="inline-flex items-center gap-1 text-[8px] font-black uppercase tracking-widest bg-white px-2 py-0.5 rounded-lg border border-slate-200 font-mono text-slate-600">
                          <Clock size={10} /> {q.date}
                        </span>
                      </div>
                      <h4 className="font-black text-[#081120] italic text-base mt-1.5 leading-snug">{q.item}</h4>
                    </div>

                    <div className="flex flex-wrap gap-2 items-center">
                      <span className="text-xs font-bold text-slate-500">Lot size:</span>
                      <span className="text-sm font-black text-[#081120] font-mono italic">{q.quantity} units</span>
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 text-[9px] font-black uppercase tracking-wider rounded-lg border ${
                        q.status === 'ordered'
                          ? 'bg-sky-500/10 text-sky-600 border-sky-500/20 shadow-sm'
                          : q.status === 'replied' 
                          ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20' 
                          : 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20'
                      }`}>
                        {q.status === 'ordered' ? '✓ Accepted & Factored' : q.status === 'replied' ? '✓ Quotation Received' : '● Bidding Pending'}
                      </span>
                    </div>
                  </div>

                  {/* Notes specifications block */}
                  <p className="text-xs text-slate-650 leading-relaxed font-sans font-medium mb-4 bg-white p-3 rounded-xl border border-slate-200">
                    {q.notes}
                  </p>

                  {/* Supplier quotes feedback block */}
                  {q.status === 'replied' && q.supplierName && (
                    <div className="bg-[#081120] border-none p-5 rounded-2xl space-y-4 text-white shadow-md">
                      <div className="flex items-center justify-between flex-wrap gap-2 border-b border-white/10 pb-3">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-lg bg-white/10 border border-white/20 flex items-center justify-center font-black text-xs text-[#FF0038] font-mono italic">
                            {q.supplierAvatar}
                          </div>
                          <div>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Offered by plant</p>
                            <p className="text-xs font-black text-white italic">{q.supplierName}</p>
                          </div>
                        </div>

                        <div className="text-right">
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono">Bidded Rate</p>
                          <p className="text-xs font-black text-emerald-400 font-mono italic">
                            ৳{q.pricePerUnit?.toLocaleString()} / Unit <span className="text-slate-300 text-[9px] font-bold font-sans">Total: ৳{q.totalOfferPrice?.toLocaleString()}</span>
                          </p>
                        </div>
                      </div>

                      <p className="text-xs text-slate-200 font-medium font-sans">
                        <b>Factory response notes:</b> {q.responseNotes}
                      </p>

                      <div className="pt-2 flex items-center justify-end">
                        <button 
                          onClick={() => {
                            acceptQuotation(q.id);
                          }}
                          className="px-5 py-2.5 bg-[#FF0038] hover:bg-[#d6002f] border-none text-white text-[9px] font-black uppercase tracking-widest italic rounded-lg transition-all shadow-md"
                        >
                          Accept Escrow Quotation Offer
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Ordered state cleared visual */}
                  {q.status === 'ordered' && q.supplierName && (
                    <div className="bg-emerald-500/10 border border-emerald-500/20 p-4 rounded-xl flex gap-3.5 items-center text-slate-800">
                      <CheckCircle2 className="text-emerald-600 flex-shrink-0" size={20} />
                      <div>
                        <p className="text-xs font-black text-slate-800 italic">Contract Accepted & Cleared</p>
                        <p className="text-[10px] text-slate-500 font-medium font-sans mt-0.5">Commercial lot invoice forwarded to <b>{q.supplierName}</b> shipping desk. Track delivery on your primary dashboard.</p>
                      </div>
                    </div>
                  )}

                </div>
              ))}
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
