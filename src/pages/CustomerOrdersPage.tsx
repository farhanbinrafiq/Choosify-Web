import React, { useState } from 'react';
import { useGlobalState } from '../context/GlobalStateContext';
import { useDashboard } from '../context/DashboardContext';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Package, ArrowRight, Eye, Tag, FileText, CheckCircle, Clock, Truck, 
  ArrowLeft, RefreshCw, MessageSquare, ShieldCheck, Download, ExternalLink 
} from 'lucide-react';
import { PRODUCTS, PLACEHOLDER_IMAGE } from '../constants';
import toast from 'react-hot-toast';

export function CustomerOrdersPage() {
  const navigate = useNavigate();
  const { orders } = useGlobalState();
  const { createNewThread } = useDashboard();

  const handleOpenConversation = (subOrder: any, parentOrderId: string) => {
    // Dynamically spawn or update thread before navigating to guarantee existence
    const threadId = `thread-${subOrder.sellerId}`;
    createNewThread(
      threadId,
      `${subOrder.sellerBusinessName} Factory Outlet`,
      `https://i.pravatar.cc/150?u=${subOrder.sellerId}`,
      'retail',
      `Negotiating lot details and courier dispatch queries for order ${parentOrderId}`,
      parentOrderId
    );

    toast.success(`Active channel opened with ${subOrder.sellerBusinessName}`);
    navigate(`/messages/${threadId}`);
  };

  const handleDownloadInvoice = (invoiceId: string) => {
    toast.success(`Lot Pro-Forma Invoice sheet "${invoiceId}" downloaded successfully!`);
  };

  // Helper to fetch matching products image based on title inside PRODUCTS constants
  const getProductImageByTitle = (title: string) => {
    const p = PRODUCTS.find(prod => prod.title === title);
    return p?.image || PLACEHOLDER_IMAGE;
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#0A0A1F] text-white">
      {/* Visual Workspace Hero */}
      <div className="w-full bg-[#050514] pt-12 pb-16 px-6 md:px-12 border-b border-white/5 relative overflow-hidden">
        <div className="absolute inset-0 hero-gradient opacity-95" />
        <div className="max-w-7xl mx-auto relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <Link to="/dashboard" className="text-xs font-black text-gray-400 hover:text-white transition-colors uppercase tracking-widest italic flex items-center gap-1.5">
              <ArrowLeft size={12} /> Return to Profile Dashboard
            </Link>
            <h1 className="text-3xl font-black uppercase tracking-tighter italic">
              My Staged <span className="text-orange-primary font-serif">Orders</span>
            </h1>
            <p className="text-xs text-gray-400 font-bold uppercase tracking-widest leading-none">
              Historic and active purchases routed through secure cargo terminals
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link 
              to="/messages"
              className="bg-white/5 border border-white/10 hover:bg-white/10 text-white font-black uppercase tracking-widest text-[9.5px] px-5 py-3 rounded-xl transition-all italic flex items-center gap-2"
            >
              <MessageSquare size={13} className="text-orange-primary" />
              Active Chat Support
            </Link>
          </div>
        </div>
      </div>

      {/* Orders container */}
      <div className="max-w-7xl mx-auto w-full px-4 md:px-8 py-10 flex-1">
        {orders.length === 0 ? (
          <div className="bg-white/5 border border-white/10 rounded-[32px] p-16 text-center max-w-xl mx-auto space-y-6">
            <div className="w-20 h-20 bg-white/5 rounded-full border border-white/10 flex items-center justify-center text-white/20 mx-auto scale-110">
              <Package size={32} />
            </div>
            <div>
              <h3 className="text-lg font-black uppercase italic text-white tracking-widest mb-3">No Staged Orders Located</h3>
              <p className="text-[10.5px] text-gray-400 uppercase tracking-widest leading-relaxed font-bold">
                Ensure you have products added to your cart, and completed checkout terms to stage orders.
              </p>
            </div>
            <Link 
              to="/products"
              className="inline-flex items-center gap-2 px-8 py-4 bg-orange-primary hover:bg-[#FF5B00] rounded-xl text-xs font-black uppercase tracking-widest italic transition-all shadow-xl shadow-[#F96500]/25"
            >
              Browse Products <ArrowRight size={14} />
            </Link>
          </div>
        ) : (
          <div className="space-y-10">
            <div className="flex justify-between items-center text-[10px] font-black text-gray-500 uppercase tracking-widest italic px-4">
              <span>DESIGNATED LOTS ACCOUNTS</span>
              <span>Showing {orders.length} transactions</span>
            </div>

            <div className="space-y-8">
              {orders.map((order, idx) => {
                const orderDate = new Date(order.createdAt).toLocaleString();
                const totalItemCount = order.subOrders.reduce((acc, sub) => acc + sub.items.reduce((sum, item) => sum + item.quantity, 0), 0);

                return (
                  <div key={order.orderId} className="bg-[#050514]/65 border border-white/10 rounded-[32px] p-6 md:p-8 space-y-6 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/[0.01] rounded-full blur-2xl" />
                    
                    {/* Upper order header */}
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-white/5 pb-4 gap-4">
                      <div>
                        <div className="flex flex-wrap items-center gap-3 mb-2">
                          <span className="text-[10px] font-black bg-[#F96500]/10 border border-[#F96500]/30 text-orange-primary px-2.5 py-0.5 rounded italic uppercase tracking-wider">
                            ORDER Reference: {order.orderId}
                          </span>
                          <span className="text-[9px] font-black bg-navy border border-white/10 text-white px-2 py-0.5 rounded uppercase tracking-widest">
                            {order.isCOD ? 'Cash On Delivery' : 'Settle Pre-Paid'}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-[10px] text-gray-400 font-bold uppercase">
                          <span>Staged On: {orderDate}</span>
                          <span>•</span>
                          <span>Total Items: {totalItemCount} Units</span>
                        </div>
                      </div>

                      <div className="md:text-right">
                        <span className="text-[8px] font-black text-gray-500 uppercase tracking-widest block leading-none mb-1">AGGREGATE SETTLEMENT VALUE</span>
                        <p className="text-xl font-black text-[#07DD05] font-sans italic leading-none">
                          ৳{(order.overallTotal ?? 0).toLocaleString()}
                        </p>
                      </div>
                    </div>

                    {/* Suborders grouping list (Sellers split) */}
                    <div className="space-y-4">
                      {order.subOrders.map((sub: any, sIdx: number) => {
                        const subTotal = sub.items.reduce((sum: number, it: any) => sum + ((it.price ?? 0) * (it.quantity ?? 0)), 0);
                        return (
                          <div key={sIdx} className="bg-white/[0.02] border border-white/5 hover:border-white/10 rounded-2xl p-5 md:p-6 transition-colors flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                            
                            {/* Product and Seller detail */}
                            <div className="flex-1 space-y-4">
                              <div className="flex items-center gap-2">
                                <span className="text-[9px] font-black bg-white/10 text-white px-2 py-0.5 rounded font-mono">
                                  {sub.invoiceId}
                                </span>
                                <span className="text-xs font-black text-orange-primary uppercase italic tracking-wider">
                                  {sub.sellerBusinessName}
                                </span>
                              </div>

                              <div className="space-y-3">
                                {sub.items.map((it: any, iIdx: number) => (
                                  <div key={iIdx} className="flex gap-4 items-center">
                                    <div className="w-12 h-12 rounded-xl border border-white/5 bg-white p-1 shrink-0">
                                      <img src={getProductImageByTitle(it.productTitle)} className="w-full h-full object-contain" alt="" />
                                    </div>
                                    <div>
                                      <h4 className="text-xs font-black text-white hover:text-orange-primary transition-colors uppercase italic leading-none truncate max-w-sm">
                                        {it.productTitle}
                                      </h4>
                                      <span className="text-[9px] text-gray-500 font-bold block mt-1 uppercase font-mono">
                                        {(it.quantity ?? 1)} x ৳{(it.price ?? 0).toLocaleString()}
                                      </span>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>

                            {/* Logistics status indicators and Actions */}
                            <div className="flex flex-col sm:flex-row md:flex-col lg:flex-row items-start sm:items-center md:items-start lg:items-center gap-6 shrink-0 w-full sm:w-auto">
                              
                              {/* Financial Sub Sum block */}
                              <div className="text-left md:text-right">
                                <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest block leading-none mb-1">Lot Total</span>
                                <p className="text-sm font-black text-[#F96500] italic leading-none mb-2">
                                  ৳{((subTotal ?? 0) + (sub.deliveryFee ?? 0)).toLocaleString()}
                                </p>
                                
                                {/* Live dispatch tracker steps */}
                                <span className={`text-[8.5px] font-black uppercase tracking-wider px-2 py-0.5 rounded italic border flex items-center gap-1
                                  ${sub.trackingStatus === 'pending' ? 'bg-[#FF9F00]/10 border-[#FF9F00]/30 text-[#FF9F00]' : ''}
                                  ${sub.trackingStatus === 'dispatched' ? 'bg-[#3867ff]/10 border-[#3867ff]/30 text-[#3867ff]' : ''}
                                  ${sub.trackingStatus === 'transit' ? 'bg-purple-500/10 border-purple-500/30 text-purple-400' : ''}
                                  ${sub.trackingStatus === 'delivered' ? 'bg-[#07DD05]/10 border-[#07DD05]/30 text-[#07DD05]' : ''}
                                `}>
                                  {sub.trackingStatus === 'pending' && <Clock size={10} />}
                                  {sub.trackingStatus === 'dispatched' && <Package size={10} />}
                                  {sub.trackingStatus === 'transit' && <Truck size={10} />}
                                  {sub.trackingStatus === 'delivered' && <CheckCircle size={10} />}
                                  {sub.trackingStatus.toUpperCase()}
                                </span>
                              </div>

                              {/* Action buttons inside each Lot/Suborder */}
                              <div className="flex gap-2 flex-wrap sm:flex-nowrap w-full sm:w-auto">
                                <button
                                  type="button"
                                  onClick={() => handleOpenConversation(sub, order.orderId)}
                                  className="flex-1 sm:flex-none h-11 px-4 rounded-xl bg-white/5 hover:bg-orange-primary hover:text-white text-white border border-white/10 text-[9.5px] font-black uppercase tracking-widest transition-all italic flex items-center justify-center gap-1.5"
                                  title="Send instant message corresponding to lot details"
                                >
                                  <MessageSquare size={13} />
                                  <span>Message Seller</span>
                                </button>
                                
                                <button
                                  type="button"
                                  onClick={() => navigate('/order-tracking', { state: { order } })}
                                  className="flex-1 sm:flex-none h-11 px-4 rounded-xl bg-orange-primary hover:bg-[#FF5B00] text-white text-[9.5px] font-black uppercase tracking-widest transition-all italic flex items-center justify-center gap-1.5"
                                  title="View visual roadmap tracking milestone steps"
                                >
                                  <Truck size={13} />
                                  <span>Track Live</span>
                                </button>

                                <button
                                  type="button"
                                  onClick={() => handleDownloadInvoice(sub.invoiceId)}
                                  className="h-11 w-11 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 flex items-center justify-center border border-white/10"
                                  title="Download corporate invoice PDF"
                                >
                                  <FileText size={14} />
                                </button>
                              </div>

                            </div>

                          </div>
                        );
                      })}
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
