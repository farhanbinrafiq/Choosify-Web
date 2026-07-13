import React, { useState } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { useGlobalState } from '../context/GlobalStateContext';
import { Truck, CheckCircle, ShieldAlert, ArrowLeft, ChevronRight, Clock, MapPin, Package, Settings } from 'lucide-react';
import toast from 'react-hot-toast';

export function OrderTrackingPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { orders, updateSubOrderStatus } = useGlobalState();

  // Load from location state OR retrieve latest order from localStorage database
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(() => {
    const locOrder = (location.state as any)?.order;
    if (locOrder) return locOrder.orderId;
    const history = JSON.parse(localStorage.getItem('choosify_orders') || '[]');
    return history.length > 0 ? history[0].orderId : null;
  });

  const order = selectedOrderId ? (orders.find(o => o.orderId === selectedOrderId) || null) : null;

  const [searchId, setSearchId] = useState('');

  const handleSearchOrder = () => {
    if (!searchId.trim()) return;
    const found = orders.find((x: any) => x.orderId.toUpperCase() === searchId.trim().toUpperCase());
    if (found) {
      setSelectedOrderId(found.orderId);
      toast.success(`Lot Ticket "${searchId.toUpperCase()}" loaded!`);
    } else {
      toast.error(`Ticket "${searchId.toUpperCase()}" not found in current local session DB.`);
      setSelectedOrderId(null);
    }
  };

  // Mock Progression Helper
  const handleSimulateTransit = () => {
    if (!order) return;

    // Progression loop: pending -> dispatched -> transit -> delivered
    const currentStatus = order.subOrders[0]?.trackingStatus || 'pending';
    let nextStatus: 'pending' | 'dispatched' | 'transit' | 'delivered' = 'dispatched';

    if (currentStatus === 'pending') nextStatus = 'dispatched';
    else if (currentStatus === 'dispatched') nextStatus = 'transit';
    else if (currentStatus === 'transit') nextStatus = 'delivered';
    else {
      toast.success('This freight package is already marked as DELIVERED!');
      return;
    }

    order.subOrders.forEach((sub: any) => {
      updateSubOrderStatus(order.orderId, sub.sellerId, nextStatus);
    });
    toast.success(`Lot Milestone advanced: ${nextStatus.toUpperCase()}`);
  };

  const getStepActive = (status: string, milestone: string) => {
    const sequence = ['pending', 'dispatched', 'transit', 'delivered'];
    const sIdx = sequence.indexOf(status);
    const mIdx = sequence.indexOf(milestone);
    return sIdx >= mIdx;
  };

  return (
    <div className="flex flex-col min-h-screen bg-choosify-feed">
      {/* Header Panel */}
      <div className="w-full relative overflow-hidden shrink-0 border-b border-white/5">
        <div className="absolute inset-0 hero-gradient pointer-events-none" />
        <div className="max-w-[1914px] mx-auto w-full h-[303px] px-6 flex items-center justify-between relative z-10 animate-fade-in">
          <div className="flex flex-col justify-center">
            <div className="flex items-center gap-1 text-[9px] text-gray-500 uppercase tracking-widest font-black italic mb-1">
              <Link to="/" className="hover:text-white transition-colors">Home</Link>
              <ChevronRight size={10} />
              <span>Logistics Delivery</span>
            </div>
            <h1 className="text-xl md:text-2xl lg:text-3xl font-black uppercase tracking-tighter italic leading-none">
              Freight Staging &amp; <span className="text-orange-primary">Tracking</span>
            </h1>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">
              National courier network staging checkpoint client
            </p>
          </div>

          {orders.length > 0 && (
            <div className="flex gap-2 shrink-0">
              <input 
                className="bg-white/5 border border-white/10 rounded-full h-8 px-4 text-[10px] font-black uppercase text-white placeholder:text-gray-500 tracking-wider focus:outline-none focus:border-orange-primary"
                placeholder="Enter ORD-XXXXX ID"
                value={searchId}
                onChange={(e) => setSearchId(e.target.value)}
              />
              <button 
                onClick={handleSearchOrder}
                className="bg-orange-primary hover:bg-white hover:text-navy text-white text-[9px] font-black uppercase tracking-widest px-4 rounded-full transition-all h-8 italic cursor-pointer"
              >
                Search
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Main Track Grid */}
      <div className="max-w-4xl mx-auto w-full px-4 py-12 flex-1">
        {order === null && orders.length === 0 ? (
          <div className="bg-white border border-gray-100 rounded-[5px] p-16 text-center shadow-sm max-w-xl mx-auto space-y-6">
            <div className="w-16 h-16 bg-orange-primary/5 rounded-full flex items-center justify-center text-orange-primary mx-auto">
              <Package size={32} />
            </div>
            <div>
              <h3 className="text-xl font-black text-navy uppercase italic tracking-tighter mb-1 select-none">No orders yet</h3>
              <p className="text-[10px] text-gray-400 uppercase tracking-widest font-black leading-relaxed">
                Your placed orders will appear here for tracking
              </p>
            </div>
            <div className="pt-4">
              <Link 
                to="/products"
                className="bg-orange-primary hover:bg-[#FF5B00] text-white text-[10px] font-black uppercase tracking-widest px-8 py-3.5 rounded-full transition-all inline-block italic cursor-pointer border-none"
              >
                Start Shopping
              </Link>
            </div>
          </div>
        ) : !order ? (
          <div className="bg-white border border-gray-100 rounded-[5px] p-16 text-center shadow-sm max-w-xl mx-auto space-y-6">
            <div className="w-16 h-16 bg-orange-primary/5 rounded-full flex items-center justify-center text-orange-primary mx-auto">
              <Package size={32} />
            </div>
            <div>
              <h3 className="text-xl font-black text-navy uppercase italic tracking-tighter mb-1 select-none">Order not found</h3>
              <p className="text-[10px] text-gray-400 uppercase tracking-widest font-black leading-relaxed">
                No order matches that reference number. Please check the ID and try again.
              </p>
            </div>
            <div className="pt-2">
              <button
                onClick={() => setSelectedOrderId(null)}
                className="text-[10px] font-black uppercase tracking-wider text-orange-primary hover:underline cursor-pointer bg-transparent border-none"
              >
                Clear Search
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Simulation controls to help satisfy multi-status routing */}
            {(import.meta as any).env?.DEV && (
              <div className="bg-navy p-5 rounded-[5px] text-white flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <Clock size={20} className="text-orange-primary shrink-0 animate-spin" />
                  <div>
                    <h4 className="text-[10px] uppercase font-black tracking-widest italic text-white/90">Supplier Delivery Simulator</h4>
                    <p className="text-[8.5px] text-white/50 font-bold leading-none uppercase">Toggle status values instantly to simulate redX checkpoints</p>
                  </div>
                </div>

                <button
                  onClick={handleSimulateTransit}
                  className="bg-[#F8FAFC]/10 hover:bg-white/10 border border-white/10 text-white text-[9px] font-black uppercase tracking-widest px-5 py-2.5 rounded-xl transition-all italic flex items-center gap-2 pointer-events-auto shrink-0 animate-none"
                >
                  <Settings size={12} className="text-orange-primary" />
                  Advance Transit Step
                </button>
              </div>
            )}

            {/* Tracker Step Status Bar */}
            <div className="bg-white border border-gray-100 rounded-[5px] p-8 md:p-10 shadow-sm space-y-8">
              <div className="flex justify-between items-center border-b pb-4">
                <div>
                  <span className="text-[8.5px] font-black tracking-widest text-[#050514] uppercase">TICKET NUMBER REFERENCE:</span>
                  <p className="text-sm font-black text-orange-primary font-mono select-all leading-tight">#{order.orderId}</p>
                </div>
                <div className="text-right">
                  <span className="text-[8.5px] font-black tracking-widest text-gray-400 block uppercase leading-none mb-1">AGGREGATE WEIGHT PAYMENT:</span>
                  <span className="text-base font-black text-navy italic">
                    {order.isCOD ? 'CASH ON DELIVERY (COD)' : 'COMMERCIAL PREPAYMENT'}
                  </span>
                </div>
              </div>

              {order.status === 'cancelled' && (
                <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-6 py-4 space-y-1 text-sm font-semibold">
                  <div className="flex items-center gap-2 font-black text-rose-800 uppercase tracking-widest text-xs">
                    <span className="inline-block w-2.5 h-2.5 bg-red-600 rounded-full animate-pulse" />
                    This order was cancelled
                  </div>
                  {order.cancellationReason && (
                    <p className="text-xs text-red-600 font-medium font-sans">Reason: {order.cancellationReason}</p>
                  )}
                  <p className="text-[10px] text-red-500 font-mono">
                    Cancelled on: {new Date(order.cancelledAt || order.createdAt).toLocaleDateString('en-BD', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
              )}

              {/* Graphical Stepper */}
              <div className={`relative pt-4 pb-8 ${order.status === 'cancelled' ? 'opacity-40' : ''}`}>
                {/* Connecting pipeline */}
                <div className="absolute top-[26%] left-4 right-4 h-1.5 bg-gray-100 rounded-full -translate-y-1/2 z-0 hidden sm:block">
                  <div 
                    className="h-full bg-orange-primary rounded-full transition-all duration-500"
                    style={{
                      width: order.subOrders[0]?.trackingStatus === 'pending' ? '0%' :
                             order.subOrders[0]?.trackingStatus === 'dispatched' ? '33.33%' :
                             order.subOrders[0]?.trackingStatus === 'transit' ? '66.66%' : '100%'
                    }}
                  />
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 relative z-10 text-center">
                  {/* Step 1: Pending */}
                  <div className="flex flex-col items-center">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center border font-black italic shadow-inner ${
                      getStepActive(order.subOrders[0]?.trackingStatus, 'pending')
                        ? 'bg-orange-primary text-white border-orange-primary'
                        : 'bg-white text-gray-400 border-gray-100'
                    }`}>
                      01
                    </div>
                    <span className="text-[9px] font-black uppercase tracking-widest text-navy mt-3 italic">lot pending</span>
                    <p className="text-[7.5px] text-gray-405 uppercase font-black">Staged Ticket</p>
                  </div>

                  {/* Step 2: Dispatched */}
                  <div className="flex flex-col items-center">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center border font-black italic shadow-inner ${
                      getStepActive(order.subOrders[0]?.trackingStatus, 'dispatched')
                        ? 'bg-orange-primary text-white border-orange-primary'
                        : 'bg-white text-gray-400 border-gray-100'
                    }`}>
                      02
                    </div>
                    <span className="text-[9px] font-black uppercase tracking-widest text-navy mt-3 italic">palletized</span>
                    <p className="text-[7.5px] text-gray-405 uppercase font-black">Ready at Port</p>
                  </div>

                  {/* Step 3: Transit */}
                  <div className="flex flex-col items-center">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center border font-black italic shadow-inner ${
                      getStepActive(order.subOrders[0]?.trackingStatus, 'transit')
                        ? 'bg-orange-primary text-white border-orange-primary'
                        : 'bg-white text-gray-400 border-gray-100'
                    }`}>
                      03
                    </div>
                    <span className="text-[9px] font-black uppercase tracking-widest text-navy mt-3 italic">carrying</span>
                    <p className="text-[7.5px] text-gray-405 uppercase font-black">Freight Route</p>
                  </div>

                  {/* Step 4: Delivered */}
                  <div className="flex flex-col items-center">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center border font-black italic shadow-inner ${
                      getStepActive(order.subOrders[0]?.trackingStatus, 'delivered')
                        ? 'bg-orange-primary text-white border-orange-primary font-black animate-pulse'
                        : 'bg-white text-gray-400 border-gray-100'
                    }`}>
                      04
                    </div>
                    <span className="text-[9px] font-black uppercase tracking-widest text-navy mt-3 italic">settled</span>
                    <p className="text-[7.5px] text-gray-405 uppercase font-black">Pickup Settled</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Consignment sub package list */}
            <div className="bg-white border border-gray-100 rounded-[5px] p-8 md:p-10 shadow-sm space-y-6">
              <h3 className="text-sm font-black text-navy uppercase italic tracking-widest border-b pb-4">Consignments Freight Splits</h3>
              <div className="space-y-4">
                {order.subOrders.map((sub: any, idx: number) => (
                  <div key={idx} className="p-5 border border-gray-100 rounded-[5px] bg-gray-50/50 flex flex-col sm:flex-row justify-between gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Truck size={14} className="text-[#F96500]" />
                        <span className="text-xs font-black text-navy italic">{sub.sellerBusinessName} Lots</span>
                      </div>
                      <div className="text-[9px] text-gray-400 uppercase font-black font-mono space-y-0.5">
                        <p>Freight Invoice ID: <span className="text-navy">{sub.invoiceId}</span></p>
                        <p>Assigned Courier: Paperfly Heavy Logistics</p>
                      </div>

                      <div className="text-[10px] font-medium text-navy space-y-0.5 pt-1 border-t border-gray-100/50">
                        {sub.items.map((it: any, iIdx: number) => (
                          <div key={iIdx}>• {it.productTitle} x {it.quantity} units</div>
                        ))}
                      </div>
                    </div>

                    <div className="sm:text-right flex flex-col justify-between items-start sm:items-end">
                      <div className="bg-orange-primary/10 border border-orange-primary/30 px-3 py-1 rounded text-[8px] font-black text-[#F96500] uppercase italic tracking-widest">
                        Check: {sub.trackingStatus.toUpperCase()}
                      </div>
                      <div className="pt-2 text-right">
                        <span className="text-[8px] font-black text-gray-400 block leading-none">SPLIT CARRIER PRICE</span>
                        <span className="text-sm font-black text-navy italic">৳{(sub.items.reduce((sum: number, x: any) => sum + (x.price * x.quantity), 0) + sub.deliveryFee).toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Continue routing */}
        <div className="text-center pt-8">
          <Link to="/" className="text-xs font-black text-navy uppercase tracking-widest italic hover:text-orange-primary transition-all">
            ← Settle back to Catalog Feed
          </Link>
        </div>
      </div>
    </div>
  );
}
