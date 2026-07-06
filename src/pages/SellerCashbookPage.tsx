import React, { useMemo } from 'react';
import { ArrowLeft, ArrowUpRight, ArrowDownLeft, Wallet, Receipt, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';

const CASHBOOK_ROWS = [
  { id: 'cb-1001', date: '06 Jul 2026', type: 'credit', label: 'Order payout', note: 'Order #CH-2048 settled', amount: 18500 },
  { id: 'cb-1002', date: '05 Jul 2026', type: 'debit', label: 'Courier adjustment', note: 'Bulk delivery charge', amount: 1800 },
  { id: 'cb-1003', date: '04 Jul 2026', type: 'credit', label: 'Advance received', note: 'Brand campaign deposit', amount: 12000 },
  { id: 'cb-1004', date: '03 Jul 2026', type: 'debit', label: 'Refund issued', note: 'Returned order reimbursement', amount: 2400 },
  { id: 'cb-1005', date: '02 Jul 2026', type: 'credit', label: 'Retail sales batch', note: 'Weekend storefront sales', amount: 9300 },
];

export function SellerCashbookPage() {
  const summary = useMemo(() => {
    const credits = CASHBOOK_ROWS.filter((row) => row.type === 'credit').reduce((sum, row) => sum + row.amount, 0);
    const debits = CASHBOOK_ROWS.filter((row) => row.type === 'debit').reduce((sum, row) => sum + row.amount, 0);
    return {
      credits,
      debits,
      balance: credits - debits,
    };
  }, []);

  return (
    <div className="min-h-screen bg-choosify-feed py-8">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-5 lg:px-6">
        <div className="choosify-dark-gradient rounded-[15px] border border-white/5 p-6 md:p-8 text-white mb-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="text-[10px] font-black uppercase tracking-[0.18em] text-white/40">Seller finance</div>
              <h1 className="text-2xl md:text-3xl font-black uppercase italic tracking-tight mt-2">Cashbook</h1>
              <p className="text-white/60 text-sm mt-2 max-w-2xl">
                Sellers can now track credits, debits, and running balance from one ledger instead of leaving the dashboard flow.
              </p>
            </div>
            <Link
              to="/dashboard"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-[5px] bg-white/10 hover:bg-white/15 text-[10px] font-black uppercase tracking-widest border border-white/10"
            >
              <ArrowLeft size={14} />
              Back to dashboard
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white border border-[#e8edf2] rounded-[8px] p-5 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-11 h-11 rounded-full bg-[#E8500A]/10 text-[#E8500A] flex items-center justify-center">
                <Wallet size={18} />
              </div>
              <div>
                <div className="text-[10px] font-black uppercase tracking-widest text-[#8a9bb0]">Net balance</div>
                <div className="text-2xl font-black italic text-[#1A1D4E]">৳{summary.balance.toLocaleString()}</div>
              </div>
            </div>
            <p className="text-[11px] font-semibold text-gray-500">Available seller ledger balance after credits and debits.</p>
          </div>

          <div className="bg-white border border-[#e8edf2] rounded-[8px] p-5 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-11 h-11 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <TrendingUp size={18} />
              </div>
              <div>
                <div className="text-[10px] font-black uppercase tracking-widest text-[#8a9bb0]">Total credits</div>
                <div className="text-2xl font-black italic text-[#1A1D4E]">৳{summary.credits.toLocaleString()}</div>
              </div>
            </div>
            <p className="text-[11px] font-semibold text-gray-500">Payouts, advances, and revenue collections credited to seller accounts.</p>
          </div>

          <div className="bg-white border border-[#e8edf2] rounded-[8px] p-5 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-11 h-11 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center">
                <Receipt size={18} />
              </div>
              <div>
                <div className="text-[10px] font-black uppercase tracking-widest text-[#8a9bb0]">Total debits</div>
                <div className="text-2xl font-black italic text-[#1A1D4E]">৳{summary.debits.toLocaleString()}</div>
              </div>
            </div>
            <p className="text-[11px] font-semibold text-gray-500">Refunds, courier charges, and manual seller-side deductions.</p>
          </div>
        </div>

        <div className="bg-white border border-[#e8edf2] rounded-[12px] shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-[#e8edf2] flex items-center justify-between gap-3">
            <div>
              <h2 className="text-sm font-black uppercase italic text-[#1A1D4E]">Ledger activity</h2>
              <p className="text-[11px] font-semibold text-gray-500 mt-1">Recent seller-facing accounting entries.</p>
            </div>
          </div>

          <div className="divide-y divide-[#e8edf2]">
            {CASHBOOK_ROWS.map((row) => (
              <div key={row.id} className="px-5 py-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      row.type === 'credit' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
                    }`}
                  >
                    {row.type === 'credit' ? <ArrowDownLeft size={16} /> : <ArrowUpRight size={16} />}
                  </div>
                  <div>
                    <div className="text-[10px] font-black uppercase tracking-widest text-[#8a9bb0]">{row.date}</div>
                    <h3 className="text-sm font-black text-[#1A1D4E] mt-1">{row.label}</h3>
                    <p className="text-[11px] font-semibold text-gray-500 mt-1">{row.note}</p>
                  </div>
                </div>
                <div className={`text-lg font-black italic ${row.type === 'credit' ? 'text-emerald-600' : 'text-rose-600'}`}>
                  {row.type === 'credit' ? '+' : '-'}৳{row.amount.toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
