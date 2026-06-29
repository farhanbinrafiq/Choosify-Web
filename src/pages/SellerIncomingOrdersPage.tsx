import React, { useState } from 'react';
import { useGlobalState } from '../context/GlobalStateContext';
import { useNavigate, Link } from 'react-router-dom';
import { Store, ArrowRight, Eye, Tag, FileText, CheckCircle, Package, ArrowLeft, RefreshCw, MessageSquare } from 'lucide-react';
import toast from 'react-hot-toast';

export function SellerIncomingOrdersPage() {
  const navigate = useNavigate();
  const { orders, updateSubOrderStatus } = useGlobalState();

  // Current logged in merchant factory profile
  const [activeMerchant, setActiveMerchant] = useState('seller-samsung');

  const merchantProfiles = [
    { id: 'seller-samsung', name: 'Samsung Bangladesh Ltd.', type: 'Wholesale & Retail' },
    { id: 'seller-apple', name: 'Apple Retail BD', type: 'Retail Exclusive' },
    { id: 'seller-apex', name: 'Apex Footwear BD Group', type: 'Wholesale & Retail' },
    { id: 'seller-general', name: 'General Outlets BD', type: 'Retail Standard' }
  ];

  const refreshOrders = () => {
    toast.success('Dispatched factory ledger synchronized in real-time.');
  };

  // Extract all suborders belonging to the active merchant
  const sellerSubOrders: any[] = [];
  orders.forEach(o => {
    o.subOrders.forEach((sub: any) => {
      if (sub.sellerId === activeMerchant) {
        sellerSubOrders.push({
          parentOrderId: o.orderId,
          buyerId: o.buyerId,
          isCOD: o.isCOD,
          overallOrderDate: o.createdAt,
          ...sub
        });
      }
    });
  });

  // Modify individual lot suborder status
  const handleUpdateStatus = (parentOrderId: string, nextStatus: 'pending' | 'dispatched' | 'transit' | 'delivered') => {
    updateSubOrderStatus(parentOrderId, activeMerchant, nextStatus);
  };

  return (
    <div className="flex flex-col min-h-screen bg-choosify-feed">
      {/* Merchant Header */}
      <div className="w-full relative overflow-hidden shrink-0 border-b border-white/5">
        <div className="absolute inset-0 hero-gradient pointer-events-none" />
        <div className="max-w-[1914px] mx-auto w-full h-[303px] px-6 flex items-center justify-between relative z-10 animate-fade-in">
          <div className="flex flex-col justify-center">
            <Link to="/dashboard" className="text-[10px] font-black text-gray-400 hover:text-white transition-colors uppercase tracking-widest italic flex items-center gap-1 mb-1">
              <ArrowLeft size={12} /> Return to Personal Dashboard
            </Link>
            <h1 className="text-xl md:text-2xl lg:text-3xl font-black uppercase tracking-tighter italic leading-none">
              Merchant Supply <span className="text-orange-primary font-serif">HQ</span>
            </h1>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest leading-none mt-1">
              Incoming Staged Orders &amp; factory logistics Router
            </p>
          </div>

          <button 
            onClick={refreshOrders}
            className="bg-white/5 border border-white/10 hover:bg-white/10 text-white font-black uppercase tracking-widest text-[8px] px-4 py-2 rounded-full transition-all italic flex items-center gap-1.5 cursor-pointer"
          >
            <RefreshCw size={11} className="text-orange-primary shrink-0" />
            Sync Ledger
          </button>
        </div>
      </div>

      {/* Profile Selector */}
      <div className="max-w-7xl mx-auto w-full px-4 md:px-8 pt-8">
        <div className="bg-white border border-gray-100 rounded-[5px] p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#F96500]/5 border border-[#F96500]/35 flex items-center justify-center text-[#F96500]">
              <Store size={18} />
            </div>
            <div>
              <span className="text-[8.5px] font-black text-gray-400 uppercase tracking-widest block leading-none mb-1">Active Supplier Node</span>
              <h2 className="text-sm font-black text-navy uppercase italic tracking-wider leading-none">
                {merchantProfiles.find(m => m.id === activeMerchant)?.name}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[9px] font-black uppercase tracking-widest text-gray-400 italic">Switch Merchant:</span>
            <select 
              value={activeMerchant}
              onChange={(e) => setActiveMerchant(e.target.value)}
              className="border border-gray-100 px-3 py-2 bg-gray-50 text-xs font-black text-navy uppercase rounded-xl focus:outline-none focus:border-orange-primary cursor-pointer"
            >
              {merchantProfiles.map(p => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Orders List Content */}
      <div className="max-w-7xl mx-auto w-full px-4 md:px-8 py-10 flex-1">
        {sellerSubOrders.length === 0 ? (
          <div className="bg-white border border-gray-100 rounded-[5px] p-16 text-center max-w-xl mx-auto shadow-sm space-y-4">
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center text-gray-300 mx-auto">
              <Package size={28} />
            </div>
            <div>
              <h3 className="text-base font-black uppercase text-navy italic tracking-tight mb-2">No incoming packages staged</h3>
              <p className="text-[9.5px] text-gray-400 uppercase tracking-widest leading-relaxed font-bold">
                Orders checking out from standard retail store or wholesale palette stages will land in this dashboard queue.
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex justify-between items-center text-[10px] font-black text-gray-400 uppercase tracking-widest italic px-4">
              <span>DESIGNATED LOTS FREIGHT LIST</span>
              <span>{sellerSubOrders.length} Sub-Consignments</span>
            </div>

            <div className="grid grid-cols-1 gap-6">
              {sellerSubOrders.map((sub, idx) => {
                const totalItemCount = sub.items.reduce((acc: number, x: any) => acc + x.quantity, 0);
                const subTotal = sub.items.reduce((acc: number, x: any) => acc + (x.price * x.quantity), 0);

                return (
                  <div key={idx} className="bg-white border border-gray-100 rounded-[5px] p-6 md:p-8 hover:shadow-md transition-shadow grid grid-cols-1 lg:grid-cols-4 gap-6 items-center">
                    {/* Lot Details */}
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className="text-[9px] font-black bg-[#F96500]/10 border border-[#F96500]/30 text-[#F96500] px-2 py-0.5 rounded italic">
                          TICKET: {sub.parentOrderId}
                        </span>
                        <span className="text-[9px] font-black bg-navy text-white px-2 py-0.5 rounded font-mono">
                          {sub.invoiceId}
                        </span>
                      </div>
                      <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest block leading-none">Staged Inflow Date</span>
                      <p className="text-xs font-bold text-navy">{new Date(sub.overallOrderDate).toLocaleString()}</p>
                    </div>

                    {/* Products items summary */}
                    <div className="space-y-1">
                      <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest block leading-none mb-1">Lot Products List</span>
                      <div className="text-[10px] text-navy font-bold leading-relaxed">
                        {sub.items.map((it: any, iIdx: number) => (
                          <div key={iIdx} className="truncate">• {it.productTitle} <span className="text-[#F96500]">x {it.quantity}</span></div>
                        ))}
                      </div>
                    </div>

                    {/* Earnings summary */}
                    <div className="space-y-1">
                      <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest block leading-none mb-1">Lot Earnings Metric</span>
                      <p className="text-base font-black text-[#F96500] italic leading-none mb-1">
                        ৳{subTotal.toLocaleString()}
                      </p>
                      <span className="text-[8.5px] text-gray-405 font-bold uppercase">
                        Settle: {sub.isCOD ? 'Cash Collection' : 'Corporate Ledger'}
                      </span>
                    </div>

                    {/* Action toggles & tracking routing */}
                    <div className="flex flex-col sm:flex-row lg:flex-col gap-3 justify-end items-stretch">
                      <div className="flex flex-wrap items-center gap-1.5 justify-start lg:justify-end">
                        <span className="text-[8.5px] font-black text-gray-400 italic uppercase">Logistics Status:</span>
                        <span className="text-[8.5px] bg-[#050514] text-white font-black uppercase tracking-widest px-2 py-0.5 rounded italic">
                          {sub.trackingStatus.toUpperCase()}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 lg:grid-cols-1 gap-2">
                        {/* Status progression triggers */}
                        {sub.trackingStatus === 'pending' && (
                          <button 
                            onClick={() => handleUpdateStatus(sub.parentOrderId, 'dispatched')}
                            className="bg-navy hover:bg-[#F96500] text-white text-[9px] font-black uppercase tracking-widest py-2 rounded-xl transition-all italic text-center"
                          >
                            Accept &amp; Palletize
                          </button>
                        )}
                        {sub.trackingStatus === 'dispatched' && (
                          <button 
                            onClick={() => handleUpdateStatus(sub.parentOrderId, 'transit')}
                            className="bg-navy hover:bg-[#F96500] text-white text-[9px] font-black uppercase tracking-widest py-2 rounded-xl transition-all italic text-center"
                          >
                            Dispatch Out
                          </button>
                        )}
                        {sub.trackingStatus === 'transit' && (
                          <button 
                            onClick={() => handleUpdateStatus(sub.parentOrderId, 'delivered')}
                            className="bg-navy hover:bg-green-600 text-white text-[9px] font-black uppercase tracking-widest py-2 rounded-xl transition-all italic text-center"
                          >
                            Mark Delivered
                          </button>
                        )}

                        <Link 
                          to={`/seller/orders/${sub.parentOrderId}`}
                          state={{ subOrder: sub }}
                          className="border border-gray-100 hover:border-[#F96500]/55 bg-gray-50 text-navy hover:text-[#F96500] text-[9px] font-black uppercase tracking-widest py-2 rounded-xl transition-all italic text-center flex items-center justify-center gap-1.5"
                        >
                          <Eye size={12} /> Live Invoice
                        </Link>
                      </div>
                    </div>

                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
