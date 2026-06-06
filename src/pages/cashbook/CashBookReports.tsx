import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, FileText, Download, BarChart2, Calendar, Filter, 
  Settings, CreditCard, ChevronRight, Hash, Database, RefreshCw 
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { DriveService, Book, Entry } from '../../lib/driveService';
import { jsPDF } from 'jspdf';
import * as XLSX from 'xlsx';
import toast from 'react-hot-toast';

export function CashBookReports() {
  const { bookId } = useParams<{ bookId: string }>();
  const navigate = useNavigate();

  const [book, setBook] = useState<Book | null>(null);
  const [entries, setEntries] = useState<Entry[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [duration, setDuration] = useState<'all' | 'today' | 'week' | 'month' | 'year'>('all');
  const [entryType, setEntryType] = useState<'all' | 'in' | 'out'>('all');
  const [paymentMode, setPaymentMode] = useState<'all' | 'cash' | 'online' | 'cheque'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Report Type Selection
  const [reportType, setReportType] = useState<'all' | 'day' | 'contact'>('all');

  const loadData = async () => {
    if (!bookId) return;
    setLoading(true);
    try {
      const booksList = await DriveService.getBooks();
      const currentBook = booksList.find(b => b.id === bookId);
      if (currentBook) {
        setBook(currentBook);
        const entriesData = await DriveService.getEntries(bookId);
        setEntries(entriesData);
      } else {
        toast.error('The selected CashBook does not exist.');
        navigate('/cashbook');
      }
    } catch (e: any) {
      toast.error('Could not load reports.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [bookId]);

  // Apply filters on the raw entries list
  const getFilteredEntries = () => {
    return entries.filter((e) => {
      // 1. Search term match
      if (searchTerm.trim()) {
        const search = searchTerm.toLowerCase();
        const remarkMatch = e.remark.toLowerCase().includes(search);
        const contactMatch = e.contact?.toLowerCase().includes(search);
        const categoryMatch = e.category.toLowerCase().includes(search);
        if (!remarkMatch && !contactMatch && !categoryMatch) return false;
      }

      // 2. Entry Type match
      if (entryType !== 'all' && e.type !== entryType) {
        return false;
      }

      // 3. Payment Mode match
      if (paymentMode !== 'all' && e.payment_mode !== paymentMode) {
        return false;
      }

      // 4. Duration match
      if (duration !== 'all') {
        const entryDate = new Date(e.timestamp);
        const now = new Date();
        if (duration === 'today') {
          const todayStr = now.toISOString().split('T')[0];
          const entryStr = entryDate.toISOString().split('T')[0];
          if (entryStr !== todayStr) return false;
        } else if (duration === 'week') {
          const oneWeekAgo = new Date();
          oneWeekAgo.setDate(now.getDate() - 7);
          if (entryDate < oneWeekAgo) return false;
        } else if (duration === 'month') {
          const oneMonthAgo = new Date();
          oneMonthAgo.setMonth(now.getMonth() - 1);
          if (entryDate < oneMonthAgo) return false;
        } else if (duration === 'year') {
          const oneYearAgo = new Date();
          oneYearAgo.setFullYear(now.getFullYear() - 1);
          if (entryDate < oneYearAgo) return false;
        }
      }

      return true;
    });
  };

  const activeFiltered = getFilteredEntries();

  // === COMPILATIONS / DATA STRUCTURES ===

  // 1. Day-wise summary list
  const getDayWiseSummary = () => {
    const daysMap: { [dateStr: string]: { date: string; cashIn: number; cashOut: number; balance: number } } = {};
    
    activeFiltered.forEach((e) => {
      const datePart = e.timestamp.split('T')[0];
      if (!daysMap[datePart]) {
        daysMap[datePart] = { date: datePart, cashIn: 0, cashOut: 0, balance: 0 };
      }
      if (e.type === 'in') {
        daysMap[datePart].cashIn += e.amount;
      } else {
        daysMap[datePart].cashOut += e.amount;
      }
    });

    // Compute balance and sort descending sequence
    return Object.values(daysMap)
      .map(d => ({
        ...d,
        balance: d.cashIn - d.cashOut
      }))
      .sort((a, b) => b.date.localeCompare(a.date));
  };

  // 2. Contact-wise summary list
  const getContactWiseSummary = () => {
    const contactsMap: { [contact: string]: { contact: string; cashIn: number; cashOut: number; balance: number } } = {};

    activeFiltered.forEach((e) => {
      const person = e.contact?.trim() || 'N/A Unspecified / Counter-sales';
      if (!contactsMap[person]) {
        contactsMap[person] = { contact: person, cashIn: 0, cashOut: 0, balance: 0 };
      }
      if (e.type === 'in') {
        contactsMap[person].cashIn += e.amount;
      } else {
        contactsMap[person].cashOut += e.amount;
      }
    });

    return Object.values(contactsMap)
      .map(c => ({
        ...c,
        balance: c.cashIn - c.cashOut
      }))
      .sort((a, b) => b.cashIn - a.cashIn);
  };

  const dayWiseList = getDayWiseSummary();
  const contactWiseList = getContactWiseSummary();

  // Switch to cycle durations click handler
  const cycleDuration = () => {
    const list: ('all' | 'today' | 'week' | 'month' | 'year')[] = ['all', 'today', 'week', 'month', 'year'];
    const idx = list.indexOf(duration);
    setDuration(list[(idx + 1) % list.length]);
  };

  const cycleEntryType = () => {
    const list: ('all' | 'in' | 'out')[] = ['all', 'in', 'out'];
    const idx = list.indexOf(entryType);
    setEntryType(list[(idx + 1) % list.length]);
  };

  const cyclePaymentMode = () => {
    const list: ('all' | 'cash' | 'online' | 'cheque')[] = ['all', 'cash', 'online', 'cheque'];
    const idx = list.indexOf(paymentMode);
    setPaymentMode(list[(idx + 1) % list.length]);
  };

  // === EXPORTS FLOW CODES ===

  // GENERATE EXCEL WITH SHEETJS
  const handleExportExcel = () => {
    if (!book) return;
    try {
      const wb = XLSX.utils.book_new();
      let sheetName = "";
      let rows: any[] = [];

      if (reportType === 'all') {
        sheetName = "All_Entries";
        rows = activeFiltered.map((e) => ({
          'Entry ID': e.id,
          'Type': e.type.toUpperCase(),
          'Amount (BDT)': e.amount,
          'Remarks': e.remark,
          'Category': e.category,
          'Contact Person': e.contact || 'N/A',
          'Payment Mode': e.payment_mode.toUpperCase(),
          'Timestamp': new Date(e.timestamp).toLocaleString(),
          'Created At': new Date(e.created_at).toLocaleString()
        }));
      } else if (reportType === 'day') {
        sheetName = "Day_wise_Summary";
        rows = dayWiseList.map((d) => ({
          'Date': d.date,
          'Total Cash In (BDT)': d.cashIn,
          'Total Cash Out (BDT)': d.cashOut,
          'Net Balance (BDT)': d.balance
        }));
      } else if (reportType === 'contact') {
        sheetName = "Contact_wise_Summary";
        rows = contactWiseList.map((c) => ({
          'Payee/Contact': c.contact,
          'Incoming Cash (BDT)': c.cashIn,
          'Outgoing Cash (BDT)': c.cashOut,
          'Net Balance (BDT)': c.balance
        }));
      }

      if (rows.length === 0) {
        toast.error('The active dataset is empty. Change filter properties to generate exports.');
        return;
      }

      const ws = XLSX.utils.json_to_sheet(rows);
      XLSX.utils.book_append_sheet(wb, ws, sheetName);
      
      const fileName = `CashBook_${book.name.replace(/\s+/g, '_')}_${sheetName}_Report.xlsx`;
      XLSX.writeFile(wb, fileName);
      toast.success('Spreadsheet loaded and downloaded successfully!', { icon: '📊' });
    } catch (e: any) {
      toast.error('Failed to compile excel file.');
    }
  };

  // GENERATE THE PDF
  const handleExportPDF = () => {
    if (!book) return;
    try {
      const doc = new jsPDF();
      
      // Paint Header Background Block
      doc.setFillColor(10, 10, 31);
      doc.rect(0, 0, 210, 42, 'F');

      doc.setTextColor(255, 255, 255);
      doc.setFont('Inter', 'bold');
      doc.setFontSize(18);
      
      let tableTitle = "";
      if (reportType === 'all') tableTitle = "ALL LEDGER ENTRIES LIST STATEMENT";
      else if (reportType === 'day') tableTitle = "DAY-WISE FINANCIAL PERFORMANCE SUMMARY";
      else if (reportType === 'contact') tableTitle = "CONTACT-WISE COMMERCIAL CASH FLOWS";

      doc.text(tableTitle, 14, 16);
      
      doc.setFontSize(8.5);
      doc.text(`Account Book: ${book.name} (${book.icon})`, 14, 25);
      doc.text(`Duration: ${duration.toUpperCase()} | Settlement Mode: ${paymentMode.toUpperCase()} | Type scope: ${entryType.toUpperCase()}`, 14, 30);
      doc.text(`Generated Date: ${new Date().toLocaleString()}`, 14, 35);

      let currentY = 55;

      // Table mapping depending on choices
      doc.setFillColor(243, 244, 246);
      doc.rect(14, currentY - 5, 182, 7, 'F');
      doc.setFontSize(8.5);
      doc.setTextColor(10, 10, 31);

      if (reportType === 'all') {
        doc.text("DATE", 16, currentY);
        doc.text("CATEGORY & DESCRIPTION", 44, currentY);
        doc.text("CONTACT", 104, currentY);
        doc.text("MODE", 138, currentY);
        doc.text("TYPE", 158, currentY);
        doc.text("AMOUNT (BDT)", 178, currentY);

        currentY += 8;
        activeFiltered.forEach((e) => {
          if (currentY > 280) { doc.addPage(); currentY = 20; }
          doc.setFontSize(7.5);
          doc.setTextColor(70, 70, 70);

          doc.text(e.timestamp.split('T')[0], 16, currentY);
          const remStr = e.remark.length > 25 ? e.remark.substring(0, 23) + '..' : e.remark;
          doc.text(`${e.category} - ${remStr}`, 44, currentY);
          doc.text(e.contact || 'None', 104, currentY);
          doc.text(e.payment_mode.toUpperCase(), 138, currentY);
          
          if (e.type === 'in') {
            doc.setTextColor(7, 160, 5);
            doc.text("INFLOW", 158, currentY);
            doc.text(`+${e.amount.toFixed(1)}`, 178, currentY);
          } else {
            doc.setTextColor(210, 30, 30);
            doc.text("OUTFLOW", 158, currentY);
            doc.text(`-${e.amount.toFixed(1)}`, 178, currentY);
          }
          currentY += 7.5;
        });

      } else if (reportType === 'day') {
        doc.text("SUMMARY DATE", 16, currentY);
        doc.text("TOTAL CASH INFLOW (BDT)", 64, currentY);
        doc.text("TOTAL CASH OUTFLOW (BDT)", 124, currentY);
        doc.text("NET ACCUMULATED BAL", 170, currentY);

        currentY += 8;
        dayWiseList.forEach((d) => {
          if (currentY > 280) { doc.addPage(); currentY = 20; }
          doc.setFontSize(8);
          doc.setTextColor(70, 70, 70);

          doc.text(d.date, 16, currentY);
          
          doc.setTextColor(7, 160, 5);
          doc.text(String(d.cashIn.toFixed(1)), 64, currentY);
          
          doc.setTextColor(215, 30, 30);
          doc.text(String(d.cashOut.toFixed(1)), 124, currentY);

          if (d.balance >= 0) {
            doc.setTextColor(7, 160, 5);
            doc.text(`+${d.balance.toFixed(1)}`, 170, currentY);
          } else {
            doc.setTextColor(215, 30, 30);
            doc.text(`${d.balance.toFixed(1)}`, 170, currentY);
          }
          currentY += 8;
        });

      } else if (reportType === 'contact') {
        doc.text("PAYEE OR COMMERCIAL CONTACT NAME", 16, currentY);
        doc.text("TOTAL CASH INFLOW (BDT)", 74, currentY);
        doc.text("TOTAL CASH OUTFLOW (BDT)", 124, currentY);
        doc.text("NET LEDGER BALANCE", 172, currentY);

        currentY += 8;
        contactWiseList.forEach((c) => {
          if (currentY > 280) { doc.addPage(); currentY = 20; }
          doc.setFontSize(8);
          doc.setTextColor(70, 70, 70);

          const nameStr = c.contact.length > 25 ? c.contact.substring(0, 23) + '..' : c.contact;
          doc.text(nameStr, 16, currentY);
          
          doc.setTextColor(7, 160, 5);
          doc.text(String(c.cashIn.toFixed(1)), 74, currentY);
          
          doc.setTextColor(215, 30, 30);
          doc.text(String(c.cashOut.toFixed(1)), 124, currentY);

          if (c.balance >= 0) {
            doc.setTextColor(7, 160, 5);
            doc.text(`+${c.balance.toFixed(1)}`, 172, currentY);
          } else {
            doc.setTextColor(215, 30, 30);
            doc.text(`${c.balance.toFixed(1)}`, 172, currentY);
          }
          currentY += 8;
        });
      }

      doc.save(`CashBook_${book.name.replace(/\s+/g, '_')}_Structured_Report.pdf`);
      toast.success('Structured Business Report downloaded successfully!');
    } catch (e: any) {
      toast.error('Could not compile structured report PDF.');
    }
  };

  if (loading) {
    return (
      <div className="py-36 text-center space-y-4">
        <RefreshCw size={36} className="animate-spin text-[#F96500] mx-auto opacity-60" />
        <span className="text-xs font-black uppercase tracking-widest italic text-gray-400 block">Sourcing analytical assets...</span>
      </div>
    );
  }

  if (!book) return null;

  return (
    <div className="bg-[#0D1B2A] p-6 md:p-10 lg:p-12 min-h-screen text-white font-sans space-y-10 animate-in fade-in slide-in-from-bottom-5 duration-700">
      
      {/* Header bar */}
      <div className="flex items-center gap-4.5 pb-6 border-b border-white/5">
        <button 
          onClick={() => navigate(`/cashbook/${book.id}`)} 
          className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white/70 hover:text-white transition-all hover:bg-white/10"
        >
          <ArrowLeft size={18} />
        </button>
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-white italic uppercase tracking-tighter mb-1">
            Structured <span className="text-[#F96500]">Reports</span>
          </h1>
          <p className="text-gray-400 text-[10px] font-black uppercase tracking-[0.3em] font-sans">
            Export ledger spreadsheet and statement documents
          </p>
        </div>
      </div>

      {/* FILTER CONTROLS SEGMENT WITH INTERACTIVE CHIP FLAPS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 bg-[#132237] border border-white/5 p-5 rounded-3xl">
        
        {/* Cycle Duration filter */}
        <div 
          onClick={cycleDuration}
          className="bg-[#0D1B2A]/60 border border-white/5 p-4.5 rounded-2xl cursor-pointer hover:border-orange-primary/30 transition-all space-y-1 select-none"
        >
          <div className="flex items-center justify-between text-gray-400">
            <span className="text-[8px] font-black uppercase tracking-widest blog">Time Span</span>
            <Calendar size={12} />
          </div>
          <span className="text-xs font-black uppercase italic block tracking-tighter text-white">
            {duration === 'all' ? 'All History' : duration === 'today' ? 'Today' : duration === 'week' ? 'Last 7 Days' : duration === 'month' ? 'Last 30 Days' : 'Last 1 Year'}
          </span>
          <span className="text-[7.5px] font-mono text-gray-400 uppercase block font-black">Click/Tap to cycle</span>
        </div>

        {/* Cycle Entry type */}
        <div 
          onClick={cycleEntryType}
          className="bg-[#0D1B2A]/60 border border-white/5 p-4.5 rounded-2xl cursor-pointer hover:border-orange-primary/30 transition-all space-y-1 select-none"
        >
          <div className="flex items-center justify-between text-gray-400">
            <span className="text-[8px] font-black uppercase tracking-widest">Entry Scope</span>
            <Filter size={12} />
          </div>
          <span className="text-xs font-black uppercase italic block tracking-tighter text-white">
            {entryType === 'all' ? 'All Transactions' : entryType === 'in' ? 'Inflows Only' : 'Outflows Only'}
          </span>
          <span className="text-[7.5px] font-mono text-gray-400 uppercase block font-black">Click/Tap to cycle</span>
        </div>

        {/* Cycle payment mode instrument */}
        <div 
          onClick={cyclePaymentMode}
          className="bg-[#0D1B2A]/60 border border-white/5 p-4.5 rounded-2xl cursor-pointer hover:border-orange-primary/30 transition-all space-y-1 select-none"
        >
          <div className="flex items-center justify-between text-gray-400">
            <span className="text-[8px] font-black uppercase tracking-widest">Payment Instrument</span>
            <CreditCard size={12} />
          </div>
          <span className="text-xs font-black uppercase italic block tracking-tighter text-white">
            {paymentMode === 'all' ? 'All Instruments' : paymentMode === 'cash' ? 'Cash Settlement' : paymentMode === 'online' ? 'Online MFS' : 'Bank Cheque'}
          </span>
          <span className="text-[7.5px] font-mono text-gray-400 uppercase block font-black">Click/Tap to cycle</span>
        </div>

        {/* Text search term */}
        <div className="bg-[#0D1B2A]/60 border border-white/5 p-4 rounded-2xl space-y-1">
          <span className="text-[8px] font-black uppercase tracking-widest text-gray-400">Search Query</span>
          <input
            type="text"
            placeholder="Type filter word..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full h-8 bg-transparent border-b border-white/10 hover:border-white/20 text-xs font-bold text-white focus:outline-none focus:border-orange-primary/50"
          />
          <span className="text-[7.5px] font-mono text-gray-400 uppercase block font-black">Live reactive match</span>
        </div>

      </div>

      {/* REPORT TYPE CHOOSER ROW (using existing card designs) */}
      <div className="space-y-4">
        <div>
          <h3 className="text-xs font-black text-white/50 uppercase tracking-[0.25em] pl-1 font-sans">Report Format Selection</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Option A: All Entries */}
          <div
            onClick={() => setReportType('all')}
            className={`cursor-pointer rounded-3xl p-6.5 border-2 transition-all relative overflow-hidden flex flex-col justify-between ${
              reportType === 'all' 
                ? 'bg-orange-primary/10 border-orange-primary shadow-xl shadow-orange-primary/5 scale-[1.01]' 
                : 'bg-[#132237] border-white/5 hover:bg-[#16273F]'
            }`}
          >
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-orange-primary">
                <Database size={18} />
              </div>
              <h4 className="text-base font-black uppercase italic tracking-tight text-white">All Entries Report</h4>
              <p className="text-[10px] text-gray-400 font-bold uppercase leading-relaxed">
                Aggregates a complete list of all cash transactions with timestamps, category tags, payee and descriptive remark details.
              </p>
            </div>
            <div className="mt-5 pt-3 border-t border-white/5 flex items-center justify-between">
              <span className="text-[8.5px] font-mono font-black uppercase text-gray-400">Active rows matched:</span>
              <span className="text-xs font-mono font-black text-[#07DD05]">{activeFiltered.length} Rows</span>
            </div>
          </div>

          {/* Option B: Day-wise Summary */}
          <div
            onClick={() => setReportType('day')}
            className={`cursor-pointer rounded-3xl p-6.5 border-2 transition-all relative overflow-hidden flex flex-col justify-between ${
              reportType === 'day' 
                ? 'bg-[#07DD05]/10 border-[#07DD05] shadow-xl shadow-green-primary/5 scale-[1.01]' 
                : 'bg-[#132237] border-white/5 hover:bg-[#16273F]'
            }`}
          >
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-[#07DD05]">
                <BarChart2 size={18} />
              </div>
              <h4 className="text-base font-black uppercase italic tracking-tight text-white">Day-wise Summary</h4>
              <p className="text-[10px] text-gray-400 font-bold uppercase leading-relaxed">
                Rolls up cash accounts on a daily basis, demonstrating total net inflows, outflows and net ledger balances.
              </p>
            </div>
            <div className="mt-5 pt-3 border-t border-white/5 flex items-center justify-between">
              <span className="text-[8.5px] font-mono font-black uppercase text-gray-400">Active compiled dates:</span>
              <span className="text-xs font-mono font-black text-[#07DD05]">{dayWiseList.length} Dates</span>
            </div>
          </div>

          {/* Option C: Contact-wise Summary */}
          <div
            onClick={() => setReportType('contact')}
            className={`cursor-pointer rounded-3xl p-6.5 border-2 transition-all relative overflow-hidden flex flex-col justify-between ${
              reportType === 'contact' 
                ? 'bg-blue-500/10 border-blue-500 shadow-xl scale-[1.01]' 
                : 'bg-[#132237] border-white/5 hover:bg-[#16273F]'
            }`}
          >
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-blue-400">
                <Hash size={18} />
              </div>
              <h4 className="text-base font-black uppercase italic tracking-tight text-white">Contact-wise Summary</h4>
              <p className="text-[10px] text-gray-400 font-bold uppercase leading-relaxed">
                Groups cash flows by contact payees, tracking which vendors or customers register the highest turnover.
              </p>
            </div>
            <div className="mt-5 pt-3 border-t border-white/5 flex items-center justify-between">
              <span className="text-[8.5px] font-mono font-black uppercase text-gray-400">Unique Payee contacts:</span>
              <span className="text-xs font-mono font-black text-[#07DD05]">{contactWiseList.length} Persons</span>
            </div>
          </div>

        </div>
      </div>

      {/* ACTION BLOCK - GENERATE EXCEL AND PDF */}
      <div className="bg-[#132237] border border-white/5 rounded-3xl p-6 md:p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="space-y-1">
          <h4 className="text-base font-black uppercase italic tracking-tight text-white">Generate Structured Documents</h4>
          <p className="text-[9.5px] text-gray-400 uppercase tracking-widest font-black">Files compile locally with full data payload encryption</p>
        </div>
        
        <div className="flex gap-4 w-full sm:w-auto shrink-0">
          {/* GENERATE EXCEL (outline layout) */}
          <button
            onClick={handleExportExcel}
            className="flex-1 sm:flex-initial h-14 px-8 border-2 border-orange-primary hover:border-orange-primary/90 hover:bg-orange-primary/5 text-orange-primary hover:text-white font-black text-xs uppercase tracking-widest italic rounded-2xl transition-all flex items-center justify-center gap-2.5 bg-transparent cursor-pointer"
          >
            <Download size={15} /> GENERATE EXCEL
          </button>

          {/* GENERATE PDF (filled layout) */}
          <button
            onClick={handleExportPDF}
            className="flex-1 sm:flex-initial h-14 px-8 bg-orange-primary hover:bg-orange-primary/95 text-white font-black text-xs uppercase tracking-widest italic rounded-2xl transform active:scale-95 transition-all flex items-center justify-center gap-2 shadow-xl shadow-orange-primary/10 border-0 cursor-pointer"
          >
            <FileText size={15} /> GENERATE PDF
          </button>
        </div>
      </div>

      {/* DATA LIVE PREVIEW SCREEN */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-black uppercase text-gray-400 tracking-widest font-sans">Active Ledger Compilation Preview</span>
        </div>

        <div className="bg-[#132237] border border-white/5 rounded-3xl overflow-hidden shadow-2xl">
          {reportType === 'all' && (
            <div className="overflow-x-auto">
              <table className="w-full text-left font-sans text-xs border-collapse">
                <thead>
                  <tr className="bg-[#0D1B2A]/60 border-b border-white/5 text-[9px] uppercase tracking-widest text-gray-400 font-bold">
                    <th className="p-5">Date</th>
                    <th className="p-5">Classification</th>
                    <th className="p-5">Payee Contact</th>
                    <th className="p-5">Instrument</th>
                    <th className="p-5 text-right">Amount (BDT)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {activeFiltered.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="p-10 text-center text-gray-450 uppercase font-black tracking-widest italic">
                        Empty dataset matching active conditions
                      </td>
                    </tr>
                  ) : (
                    activeFiltered.slice(0, 15).map((e) => (
                      <tr key={e.id} className="hover:bg-white/[0.01] transition-colors">
                        <td className="p-5 text-gray-400 font-mono">{e.timestamp.split('T')[0]}</td>
                        <td className="p-5">
                          <span className="font-bold text-white block">{e.category}</span>
                          <span className="text-[10.5px] text-gray-400 block truncate max-w-xs">{e.remark}</span>
                        </td>
                        <td className="p-5 font-bold italic text-white/80">{e.contact || '-'}</td>
                        <td className="p-5 font-bold uppercase text-gray-400">{e.payment_mode}</td>
                        <td className={`p-5 text-right font-black text-sm ${e.type === 'in' ? 'text-[#07DD05]' : 'text-red-500'}`}>
                          {e.type === 'in' ? '+' : '−'}৳{e.amount.toLocaleString('en-IN')}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}

          {reportType === 'day' && (
            <div className="overflow-x-auto">
              <table className="w-full text-left font-sans text-xs border-collapse">
                <thead>
                  <tr className="bg-[#0D1B2A]/60 border-b border-white/5 text-[9px] uppercase tracking-widest text-gray-400 font-bold">
                    <th className="p-5">Summary Date</th>
                    <th className="p-5 text-[#07DD05]">Inflows</th>
                    <th className="p-5 text-red-500">Outflows</th>
                    <th className="p-5 text-right">Net Balance (BDT)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {dayWiseList.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="p-10 text-center text-gray-450 uppercase font-black tracking-widest italic">
                        No rolling daily summary logged yet
                      </td>
                    </tr>
                  ) : (
                    dayWiseList.slice(0, 15).map((d) => (
                      <tr key={d.date} className="hover:bg-white/[0.01] transition-colors">
                        <td className="p-5 text-white font-mono font-bold">{d.date}</td>
                        <td className="p-5 font-bold text-[#07DD05]">৳{d.cashIn.toLocaleString('en-IN')}</td>
                        <td className="p-5 font-bold text-red-400">৳{d.cashOut.toLocaleString('en-IN')}</td>
                        <td className={`p-5 text-right font-black text-sm ${d.balance >= 0 ? 'text-[#07DD05]' : 'text-red-500'}`}>
                          ৳{d.balance.toLocaleString('en-IN')}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}

          {reportType === 'contact' && (
            <div className="overflow-x-auto">
              <table className="w-full text-left font-sans text-xs border-collapse">
                <thead>
                  <tr className="bg-[#0D1B2A]/60 border-b border-white/5 text-[9px] uppercase tracking-widest text-gray-400 font-bold">
                    <th className="p-5">Contact Entity Payee</th>
                    <th className="p-5 text-[#07DD05]">Accumulated Inflows</th>
                    <th className="p-5 text-red-500">Accumulated Outflows</th>
                    <th className="p-5 text-right">Net Ledger Balance (BDT)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {contactWiseList.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="p-10 text-center text-gray-450 uppercase font-black tracking-widest italic">
                        No contact specific ledgers recorded
                      </td>
                    </tr>
                  ) : (
                    contactWiseList.slice(0, 15).map((c) => (
                      <tr key={c.contact} className="hover:bg-white/[0.01] transition-colors">
                        <td className="p-5 font-bold text-white">👤 {c.contact}</td>
                        <td className="p-5 font-semibold text-[#07DD05]">৳{c.cashIn.toLocaleString('en-IN')}</td>
                        <td className="p-5 font-semibold text-red-400">৳{c.cashOut.toLocaleString('en-IN')}</td>
                        <td className={`p-5 text-right font-black text-sm ${c.balance >= 0 ? 'text-[#07DD05]' : 'text-red-500'}`}>
                          ৳{c.balance.toLocaleString('en-IN')}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}

          {/* Table footer paging limits disclaimer */}
          <div className="bg-[#0D1B2A]/30 p-4 border-t border-white/5 text-center">
            <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest italic">
              Showing up to 15 rolling rows in active visual preview. Export payload to fetch full ledger dataset.
            </span>
          </div>

        </div>
      </div>

    </div>
  );
}
