import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, FileText, MoreVertical, Edit, Trash2, Search, Filter, Calendar, 
  ChevronDown, ChevronUp, Plus, Minus, Check, Camera, Paperclip, RefreshCw, X 
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { DriveService, Book, Entry } from '../../lib/driveService';
import { useGlobalState } from '../../context/GlobalStateContext';
import { jsPDF } from 'jspdf';
import toast from 'react-hot-toast';

const CATEGORIES = [
  'Sales / Revenue',
  'Salary / Wages',
  'Office Rent & Utilities',
  'Logistics / Transport',
  'Purchasing Stock',
  'Marketing / Ads',
  'Food & Lodging',
  'Sourcing Taxes & Fees',
  'Hardware / Equipment',
  'Cash Transfer / ATM',
  'Miscellaneous'
];

interface FilterState {
  dateRange: 'all' | 'today' | 'week' | 'month';
  type: 'all' | 'in' | 'out';
  paymentMode: 'all' | 'cash' | 'online' | 'cheque';
  searchQuery: string;
}

export function CashBookDetail() {
  const { bookId } = useParams<{ bookId: string }>();
  const navigate = useNavigate();
  const { currentUser } = useGlobalState();

  const [book, setBook] = useState<Book | null>(null);
  const [entries, setEntries] = useState<Entry[]>([]);
  const [loading, setLoading] = useState(true);

  // Filter conditions
  const [filters, setFilters] = useState<FilterState>({
    dateRange: 'all',
    type: 'all',
    paymentMode: 'all',
    searchQuery: ''
  });

  const [showFiltersModal, setShowFiltersModal] = useState(false);

  // Expandable active entry inline details ID
  const [expandedEntryId, setExpandedEntryId] = useState<string | null>(null);

  // New & Edit transaction state
  const [isEntryModalOpen, setIsEntryModalOpen] = useState(false);
  const [modalType, setModalType] = useState<'in' | 'out'>('in');
  const [editingEntry, setEditingEntry] = useState<Entry | null>(null);

  // Form parameters
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    time: new Date().toLocaleTimeString('en-US', { hour12: false }).substring(0, 5),
    amount: '',
    remark: '',
    contact: '',
    paymentMode: 'cash' as 'cash' | 'online' | 'cheque',
    category: CATEGORIES[0],
    attachment: ''
  });

  // Autocomplete state
  const [suggestedContacts, setSuggestedContacts] = useState<string[]>([]);
  const [showContactDropdown, setShowContactDropdown] = useState(false);
  const [addMoreFields, setAddMoreFields] = useState(false);

  // Top header dots dropdown
  const [headerMenuOpen, setHeaderMenuOpen] = useState(false);

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

        // Build some contact recommendations based on existing entries
        const uniqueContacts = Array.from(
          new Set(
            entriesData
              .map(e => e.contact?.trim())
              .filter(Boolean) as string[]
          )
        );
        // seed defaults if empty
        if (uniqueContacts.length === 0) {
          setSuggestedContacts(['Arif Rahman', 'Sourcing Hub BD', 'Farhan Bin Rafiq', 'Epyllion Garments', 'Apex Store Manager']);
        } else {
          setSuggestedContacts(uniqueContacts);
        }
      } else {
        toast.error('The selected CashBook does not exist.');
        navigate('/cashbook');
      }
    } catch (e: any) {
      toast.error('Could not sync entries.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [bookId]);

  // Compute chronologically accurate running balances
  const computeRunningBalancesMap = () => {
    // Sort oldest first for calculating accumulation sum
    const chronological = [...entries].sort((a, b) => 
      new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
    );

    let currentSum = 0;
    const balanceMapping: { [id: string]: number } = {};

    chronological.forEach((e) => {
      if (e.type === 'in') {
        currentSum += e.amount;
      } else {
        currentSum -= e.amount;
      }
      balanceMapping[e.id] = currentSum;
    });

    return balanceMapping;
  };

  const balancesMap = computeRunningBalancesMap();

  // Filter operations
  const filteredEntries = entries.filter((e) => {
    // Search filter
    if (filters.searchQuery) {
      const search = filters.searchQuery.toLowerCase();
      const matchRemark = e.remark.toLowerCase().includes(search);
      const matchContact = e.contact?.toLowerCase().includes(search);
      const matchCategory = e.category.toLowerCase().includes(search);
      if (!matchRemark && !matchContact && !matchCategory) {
        return false;
      }
    }

    // Type filter
    if (filters.type !== 'all' && e.type !== filters.type) {
      return false;
    }

    // Payment Mode filter
    if (filters.paymentMode !== 'all' && e.payment_mode !== filters.paymentMode) {
      return false;
    }

    // Date range filter
    if (filters.dateRange !== 'all') {
      const entryDate = new Date(e.timestamp);
      const now = new Date();
      if (filters.dateRange === 'today') {
        const todayStr = now.toISOString().split('T')[0];
        const entryStr = entryDate.toISOString().split('T')[0];
        if (entryStr !== todayStr) return false;
      } else if (filters.dateRange === 'week') {
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(now.getDate() - 7);
        if (entryDate < oneWeekAgo) return false;
      } else if (filters.dateRange === 'month') {
        const oneMonthAgo = new Date();
        oneMonthAgo.setMonth(now.getMonth() - 1);
        if (entryDate < oneMonthAgo) return false;
      }
    }

    return true;
  });

  // Sort entries newest first
  const sortedEntries = [...filteredEntries].sort((a, b) => 
    new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime() ||
    new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );

  // Group entries by Date (YYYY-MM-DD)
  const groupedEntries: { [dateStr: string]: Entry[] } = {};
  sortedEntries.forEach((entry) => {
    const dStr = entry.timestamp.split('T')[0];
    if (!groupedEntries[dStr]) {
      groupedEntries[dStr] = [];
    }
    groupedEntries[dStr].push(entry);
  });

  // Calculate dynamic filtered totals
  const filteredIn = filteredEntries.filter(e => e.type === 'in').reduce((acc, c) => acc + c.amount, 0);
  const filteredOut = filteredEntries.filter(e => e.type === 'out').reduce((acc, c) => acc + c.amount, 0);
  const filteredNet = filteredIn - filteredOut;

  // Handle open entry creation
  const handleOpenEntryModal = (type: 'in' | 'out') => {
    setModalType(type);
    setEditingEntry(null);
    setFormData({
      date: new Date().toISOString().split('T')[0],
      time: new Date().toTimeString().split(' ')[0].substring(0, 5),
      amount: '',
      remark: '',
      contact: '',
      paymentMode: 'cash',
      category: type === 'in' ? 'Sales / Revenue' : 'Office Rent & Utilities',
      attachment: ''
    });
    setAddMoreFields(false);
    setIsEntryModalOpen(true);
  };

  const handleOpenEditEntry = (entry: Entry) => {
    setModalType(entry.type);
    setEditingEntry(entry);
    const datePart = entry.timestamp.split('T')[0];
    const timePart = entry.timestamp.split('T')[1]?.substring(0, 5) || '12:00';

    setFormData({
      date: datePart,
      time: timePart,
      amount: String(entry.amount),
      remark: entry.remark,
      contact: entry.contact || '',
      paymentMode: entry.payment_mode,
      category: entry.category,
      attachment: entry.attachmentUrl || ''
    });
    setAddMoreFields(!!entry.attachmentUrl);
    setIsEntryModalOpen(true);
  };

  const handleSaveEntry = async (e: React.FormEvent, clearAfterSave: boolean = false) => {
    e.preventDefault();
    if (!bookId) return;

    const amountNum = parseFloat(formData.amount);
    if (isNaN(amountNum) || amountNum <= 0) {
      toast.error('Please enter a valid amount.');
      return;
    }

    const timestamp = `${formData.date}T${formData.time}:00.000Z`;
    const savingLoader = toast.loading('Syncing ledger transaction...');

    try {
      let updatedList: Entry[] = [];

      if (editingEntry) {
        // Edit flow
        updatedList = entries.map((item) => {
          if (item.id === editingEntry.id) {
            return {
              ...item,
              amount: amountNum,
              remark: formData.remark,
              contact: formData.contact || undefined,
              payment_mode: formData.paymentMode,
              category: formData.category,
              timestamp,
              attachmentUrl: formData.attachment || undefined,
            };
          }
          return item;
        });
        toast.success('Your ledger entry was successfully updated!');
      } else {
        // Create flow
        const newEntry: Entry = {
          id: `entry-${Math.floor(100000 + Math.random() * 900000)}`,
          type: modalType,
          amount: amountNum,
          remark: formData.remark,
          contact: formData.contact || undefined,
          payment_mode: formData.paymentMode,
          category: formData.category,
          timestamp,
          created_at: new Date().toISOString(),
          attachmentUrl: formData.attachment || undefined,
        };
        updatedList = [newEntry, ...entries];
        toast.success(`Entry added for ৳${amountNum}`);
      }

      await DriveService.saveEntries(bookId, updatedList);
      toast.dismiss(savingLoader);

      if (clearAfterSave) {
        // Reset and keep form open for "Save & Add New"
        setFormData({
          ...formData,
          amount: '',
          remark: '',
          contact: '',
          attachment: ''
        });
        setEditingEntry(null);
      } else {
        setIsEntryModalOpen(false);
      }
      
      loadData();
    } catch (err: any) {
      toast.dismiss(savingLoader);
      toast.error('Failed to register change with Drive.');
    }
  };

  const handleDeleteEntry = async (entryId: string) => {
    if (!bookId || !confirm('Are you absolutely sure you want to delete this ledger entry?')) return;
    
    const deletingLoader = toast.loading('Deleting record...');
    try {
      const updatedList = entries.filter(e => e.id !== entryId);
      await DriveService.saveEntries(bookId, updatedList);
      toast.dismiss(deletingLoader);
      toast.success('Ledger entry permanently erased.');
      loadData();
    } catch (err: any) {
      toast.dismiss(deletingLoader);
      toast.error('Cloud Sync failed to erase record.');
    }
  };

  // Generate dynamic statement PDF using jsPDF
  const handleExportPDF = () => {
    if (!book) return;
    try {
      const doc = new jsPDF();
      
      // Theme accents
      doc.setFillColor(10, 10, 31); // Navy Background header
      doc.rect(0, 0, 210, 45, 'F');
      
      doc.setTextColor(255, 255, 255);
      doc.setFont('Inter', 'bold');
      doc.setFontSize(22);
      doc.text("CHOOSIFY CASHBOOK LEDGER STATEMENT", 14, 18);
      
      doc.setFontSize(10);
      doc.text(`Account Book: ${book.name} (${book.icon})`, 14, 28);
      doc.text(`Generated Date: ${new Date().toLocaleString()}`, 14, 34);
      doc.text(`User Email: ${currentUser.email}`, 14, 40);

      // Financial overview content
      doc.setFillColor(243, 244, 246); // Off-White block
      doc.rect(14, 55, 182, 30, 'F');

      doc.setTextColor(26, 29, 78);
      doc.setFontSize(11);
      doc.text("Statement Summary Information", 20, 63);
      
      doc.setFontSize(9);
      doc.text(`Total Cash Inflow:  BDT ${filteredIn.toLocaleString('en-IN')}`, 20, 71);
      doc.text(`Total Cash Outflow: BDT ${filteredOut.toLocaleString('en-IN')}`, 20, 77);
      doc.text(`Net Ledger Balance: BDT ${filteredNet.toLocaleString('en-IN')}`, 110, 77);

      // Entries list rendering loop
      doc.setFontSize(10);
      doc.setTextColor(80, 80, 80);
      doc.text(`Showing ${sortedEntries.length} chronological ledger entries:`, 14, 98);

      let currentY = 108;
      
      // Header Table row
      doc.setFillColor(230, 235, 245);
      doc.rect(14, currentY - 5, 182, 7, 'F');
      doc.setFontSize(8);
      doc.setTextColor(10, 10, 31);
      doc.text("TIMESTAMP", 16, currentY);
      doc.text("CATEGORY & REMARK", 48, currentY);
      doc.text("CONTACT", 108, currentY);
      doc.text("MODE", 140, currentY);
      doc.text("AMOUNT (BDT)", 158, currentY);
      doc.text("RUNNING BAL", 182, currentY);

      currentY += 8;

      sortedEntries.forEach((e) => {
        if (currentY > 280) {
          doc.addPage();
          currentY = 20;
        }

        doc.setFontSize(7.5);
        doc.setTextColor(50, 50, 50);

        // Date Format
        const dateStr = new Date(e.timestamp).toLocaleDateString('en-GB');
        doc.text(dateStr, 16, currentY);

        // Category remark block
        const remarkShortStr = e.remark.length > 30 ? e.remark.substring(0, 28) + '..' : e.remark;
        doc.text(`${e.category} - ${remarkShortStr}`, 48, currentY);

        // Contact
        doc.text(e.contact || '-', 108, currentY);

        // Payment Mode
        doc.text(e.payment_mode.toUpperCase(), 140, currentY);

        // Green / Red amount colors using custom RGB
        if (e.type === 'in') {
          doc.setTextColor(7, 180, 5); // Green BDT
          doc.text(`+${e.amount.toFixed(1)}`, 158, currentY);
        } else {
          doc.setTextColor(220, 30, 30); // Red BDT
          doc.text(`-${e.amount.toFixed(1)}`, 158, currentY);
        }

        // Running balance representation
        doc.setTextColor(50, 50, 50);
        const runningBalVal = balancesMap[e.id] ?? 0;
        doc.text(`${runningBalVal.toFixed(1)}`, 182, currentY);

        currentY += 7.5;
      });

      doc.save(`CashBook_Ledger_Statement_${book.name.replace(/\s+/g, '_')}.pdf`);
      toast.success('PDF statement generated successfully.');
    } catch (e: any) {
      toast.error('Could not compile PDF document.');
    }
  };

  const handleClearFilters = () => {
    setFilters({
      dateRange: 'all',
      type: 'all',
      paymentMode: 'all',
      searchQuery: ''
    });
    toast.success('Filters reset successfully.');
  };

  if (loading) {
    return (
      <div className="py-36 text-center space-y-4">
        <RefreshCw size={36} className="animate-spin text-[#F96500] mx-auto" />
        <span className="text-xs font-black uppercase tracking-[0.2em] italic text-gray-400">Pristine ledger compiling...</span>
      </div>
    );
  }

  if (!book) return null;

  return (
    <div className="bg-[#0D1B2A] p-6 md:p-10 lg:p-12 min-h-screen text-white font-sans pb-32 space-y-10 animate-in fade-in slide-in-from-bottom-5 duration-700">
      
      {/* HEADER SECTION - Back, title, colored dot and exports */}
      <div className="flex items-center justify-between pb-6 border-b border-white/5">
        <div className="flex items-center gap-4.5 min-w-0 pr-4">
          <button 
            onClick={() => navigate('/cashbook')} 
            className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white/70 hover:text-white transition-all hover:bg-white/10 shrink-0"
          >
            <ArrowLeft size={18} />
          </button>
          
          <div className="flex items-center gap-3 min-w-0">
            <span className="text-3xl shrink-0">{book.icon || '📂'}</span>
            <div className="min-w-0">
              <div className="flex items-center gap-2.5">
                <h1 className="text-2xl md:text-3xl font-black text-white italic uppercase tracking-tighter truncate">
                  {book.name}
                </h1>
                {/* Colored dot representation */}
                <span 
                  className="w-3.5 h-3.5 rounded-full shrink-0 border border-white/10" 
                  style={{ backgroundColor: book.color || '#FF5B00' }}
                  title="Cover theme dot color"
                />
              </div>
              <p className="text-gray-400 text-[10px] font-black uppercase tracking-[0.3em] font-sans">
                Book Entries & Statement Dashboard
              </p>
            </div>
          </div>
        </div>

        {/* Header Actions Panel */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={handleExportPDF}
            className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-[#07DD05] hover:text-white hover:bg-[#07DD05]/10 border border-white/5 hover:border-[#07DD05]/30 transition-all cursor-pointer"
            title="Download PDF Ledger Statement"
          >
            <FileText size={16} />
          </button>

          <div className="relative">
            <button 
              onClick={() => setHeaderMenuOpen(!headerMenuOpen)}
              className="w-11 h-11 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 flex items-center justify-center text-white/70 hover:text-white transition-colors"
            >
              <MoreVertical size={16} />
            </button>
            <AnimatePresence>
              {headerMenuOpen && (
                <>
                  <div className="fixed inset-0 z-150" onClick={() => setHeaderMenuOpen(false)} />
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute right-0 mt-2.5 w-48 bg-[#050514] border border-white/10 rounded-2xl p-2 z-50 shadow-2xl"
                  >
                    <button
                      onClick={() => {
                        setHeaderMenuOpen(false);
                        navigate(`/cashbook/${book.id}/reports`);
                      }}
                      className="w-full flex items-center gap-3 px-4 py-3 text-[10px] font-black uppercase text-gray-400 hover:text-white hover:bg-white/5 rounded-xl transition-all text-left italic"
                    >
                      📊 View Structured Reports
                    </button>
                    <button
                      onClick={() => {
                        setHeaderMenuOpen(false);
                        handleExportPDF();
                      }}
                      className="w-full flex items-center gap-3 px-4 py-3 text-[10px] font-black uppercase text-gray-400 hover:text-white hover:bg-white/5 rounded-xl transition-all text-left italic"
                    >
                      📥 Quick Statement PDF
                    </button>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* SUMMARY CARD: Net, In, Out, Reports view link */}
      <div className="bg-[#132237] border border-white/5 rounded-[32px] p-8 md:p-10 relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-48 h-48 bg-orange-primary/5 blur-[80px] rounded-full" />
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-center">
          
          {/* Main Large Net Balance */}
          <div className="space-y-1.5 md:col-span-1 lg:border-r lg:border-white/10 pr-6">
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] block">Ledger Cumulative Net Balance</span>
            <div className="flex items-baseline gap-2">
              <h2 className="text-4xl md:text-5xl font-black text-white italic tracking-tight uppercase">
                ৳{filteredNet.toLocaleString('en-IN')}
              </h2>
            </div>
            <span className="text-[9px] font-mono text-gray-400 uppercase block font-black">Calculated and synchronized with personal drive</span>
          </div>

          {/* Quick inflow/outflow grid */}
          <div className="grid grid-cols-2 gap-4.5 lg:col-span-1 lg:border-r lg:border-white/10 lg:pr-6">
            <div className="space-y-1 bg-[#0A0A1F]/60 border border-white/5 p-4 rounded-2xl">
              <span className="text-[8px] font-black uppercase tracking-widest text-[#07DD05] block font-mono">BDT Total Cash In</span>
              <span className="text-xl font-black text-[#07DD05]">
                ৳{filteredIn.toLocaleString('en-IN')}
              </span>
            </div>
            
            <div className="space-y-1 bg-[#0A0A1F]/60 border border-white/5 p-4 rounded-2xl">
              <span className="text-[8px] font-black uppercase tracking-widest text-red-500 block font-mono">BDT Total Cash Out</span>
              <span className="text-xl font-black text-red-500">
                ৳{filteredOut.toLocaleString('en-IN')}
              </span>
            </div>
          </div>

          {/* View Reports call-to-action button */}
          <div className="flex flex-col justify-center items-stretch md:items-end lg:col-span-1">
            <button
              onClick={() => navigate(`/cashbook/${book.id}/reports`)}
              className="py-4 px-6 border-2 border-[#FF5B00]/30 hover:border-[#FF5B00] text-white text-xs font-black uppercase tracking-widest rounded-2xl hover:bg-[#FF5B00] hover:text-white transform hover:scale-[1.02] active:scale-[0.98] transition-all bg-[#FF5B00]/10 italic select-none text-center shadow-lg hover:shadow-orange-primary/10"
            >
              📊 VIEW REPORTS & ANALYSIS
            </button>
          </div>

        </div>
      </div>

      {/* FILTER BAR SECTION */}
      <div className="bg-[#132237] border border-white/5 rounded-3xl p-5 md:p-6 space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          
          {/* Real-time search */}
          <div className="relative flex-1">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
            <input
              type="text"
              placeholder="Search category, remarks, payee, contact names..."
              value={filters.searchQuery}
              onChange={(e) => setFilters({ ...filters, searchQuery: e.target.value })}
              className="w-full h-11 pl-11 pr-5 bg-white/5 border border-white/15 focus:border-orange-primary/40 rounded-xl text-xs font-semibold focus:outline-none transition-all placeholder:text-white/20"
            />
          </div>

          {/* Preset options */}
          <div className="flex items-center gap-3 overflow-x-auto no-scrollbar scroll-smooth">
            
            {/* Type selector */}
            <div className="flex rounded-xl border border-white/5 p-1 bg-black/50 select-none shrink-0 scale-95 origin-left">
              {(['all', 'in', 'out'] as const).map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setFilters({ ...filters, type })}
                  className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-wider transition-all italic ${
                    filters.type === type 
                      ? 'bg-orange-primary text-white shadow' 
                      : 'text-gray-300 hover:text-white'
                  }`}
                >
                  {type === 'all' ? 'All Ledger' : type === 'in' ? 'Inflow' : 'Outflow'}
                </button>
              ))}
            </div>

            {/* Clear Filter preset trigger */}
            {(filters.dateRange !== 'all' || filters.type !== 'all' || filters.paymentMode !== 'all' || filters.searchQuery !== '') && (
              <button
                onClick={handleClearFilters}
                className="px-3.5 py-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg text-[9px] font-black uppercase tracking-wider italic transition-all shrink-0"
              >
                Clear Filters
              </button>
            )}

            <button
              onClick={() => setShowFiltersModal(true)}
              className="h-10 px-4 bg-white/5 hover:bg-white/10 text-white hover:text-orange-primary border border-white/15 hover:border-orange-primary/30 rounded-xl text-[9px] uppercase font-black tracking-widest italic flex items-center gap-1.5 shrink-0"
            >
              <Filter size={12} /> Detailed Filter
            </button>

          </div>
        </div>
      </div>

      {/* FILTER VIEW POPUP DIALOG */}
      <AnimatePresence>
        {showFiltersModal && (
          <div className="fixed inset-0 z-[250] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowFiltersModal(false)}
              className="absolute inset-0 bg-black/85 backdrop-blur-md"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-md bg-[#0A0A1F] border border-white/10 rounded-[32px] p-8 shadow-2xl space-y-6"
            >
              <div>
                <h3 className="text-xl font-black uppercase italic tracking-tight text-white mb-1">Set Filter Parameters</h3>
                <p className="text-[9px] text-gray-400 uppercase tracking-widest font-black">Drilldown transaction ledgers</p>
              </div>

              <div className="space-y-4">
                {/* Date range selection */}
                <div className="space-y-2">
                  <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Temporal Frame</label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { value: 'all', label: 'All History' },
                      { value: 'today', label: 'Today Only' },
                      { value: 'week', label: 'Last 7 Days' },
                      { value: 'month', label: 'Last 30 Days' }
                    ].map((item) => (
                      <button
                        key={item.value}
                        onClick={() => setFilters({ ...filters, dateRange: item.value as any })}
                        className={`h-11 rounded-xl text-[10px] font-black uppercase italic transition-all ${
                          filters.dateRange === item.value 
                            ? 'bg-orange-primary text-white' 
                            : 'bg-white/5 text-gray-300 border border-white/10 hover:bg-white/10'
                        }`}
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Payment modes */}
                <div className="space-y-2">
                  <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Settlement Instruments</label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { value: 'all', label: 'All Modes' },
                      { value: 'cash', label: 'Cash Only' },
                      { value: 'online', label: 'MFS / Online' },
                      { value: 'cheque', label: 'Cheque' }
                    ].map((item) => (
                      <button
                        key={item.value}
                        onClick={() => setFilters({ ...filters, paymentMode: item.value as any })}
                        className={`h-11 rounded-xl text-[10px] font-black uppercase italic transition-all ${
                          filters.paymentMode === item.value 
                            ? 'bg-orange-primary text-white' 
                            : 'bg-white/5 text-gray-300 border border-white/10 hover:bg-white/10'
                        }`}
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex border-t border-white/5 pt-5 justify-end">
                <button
                  type="button"
                  onClick={() => setShowFiltersModal(false)}
                  className="px-6 h-12 bg-white/5 hover:bg-white/10 border border-white/10 font-black text-[10px] uppercase text-white tracking-widest italic rounded-2xl transition-all"
                >
                  Close & Apply
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* LEDGER ENTRIES LIST VIEW GROUPED BY DATE */}
      <div className="space-y-6">
        {entries.length === 0 ? (
          <div className="bg-[#132237] border border-white/5 rounded-3xl p-16 text-center space-y-6 max-w-md mx-auto">
            <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center mx-auto text-orange-primary">
              📂
            </div>
            <div className="space-y-1">
              <h4 className="text-base font-black uppercase italic tracking-tight">Ledger book is pristine empty</h4>
              <p className="text-[9px] text-gray-400 font-bold uppercase tracking-wider leading-relaxed">
                There are no transaction records inside this Accounts Book yet. Click split bottom buttons to register cash ledger items.
              </p>
            </div>
          </div>
        ) : filteredEntries.length === 0 ? (
          <div className="bg-[#132237] border border-white/5 rounded-3xl p-16 text-center space-y-4 max-w-md mx-auto">
            <div className="text-xl">🔍</div>
            <div className="space-y-1">
              <h4 className="text-sm font-black uppercase italic tracking-tight">No results matched filters</h4>
              <p className="text-[9px] text-gray-400 font-bold uppercase tracking-wider leading-relaxed">
                Change your date-range constraints, payment instrument scope, entry type or search inquiry to load transactions list.
              </p>
            </div>
            <button
              onClick={handleClearFilters}
              className="py-2.5 px-4 bg-white/5 hover:bg-white/10 border border-white/10 text-white text-[9px] font-black uppercase rounded-lg tracking-wider italic"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="space-y-8">
            {Object.keys(groupedEntries).sort((a,b) => b.localeCompare(a)).map((dateStr) => {
              const displayDateStr = new Date(dateStr).toLocaleDateString('en-GB', {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
                weekday: 'long'
              });

              return (
                <div key={dateStr} className="space-y-3.5">
                  {/* Date boundary header */}
                  <h4 className="text-[10px] font-mono tracking-[0.2em] uppercase font-black text-[#D6E1EC] italic flex items-center gap-3">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#FF5B00]/25 shrink-0 border border-[#FF5B00]/45" />
                    {displayDateStr}
                  </h4>

                  {/* Transactions stream in this boundary date */}
                  <div className="space-y-3">
                    {groupedEntries[dateStr].map((item) => {
                      const expanded = expandedEntryId === item.id;
                      const runningBal = balancesMap[item.id] ?? 0;
                      
                      const timeStr = new Date(item.timestamp).toLocaleTimeString('en-US', {
                        hour: 'numeric',
                        minute: '2-digit',
                        hour12: true
                      });

                      return (
                        <div
                          key={item.id}
                          className="bg-[#122135] border border-white/5 rounded-2xl hover:bg-[#15273F]/90 hover:border-white/10 transition-all overflow-hidden"
                        >
                          <div
                            onClick={() => setExpandedEntryId(expanded ? null : item.id)}
                            className="p-5 flex items-center justify-between gap-4 cursor-pointer select-none active:bg-white/[0.01]"
                          >
                            <div className="flex items-center gap-4 min-w-0">
                              {/* Payment badge cover */}
                              <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-[9px] font-black uppercase shrink-0 border border-white/5 ${
                                item.payment_mode === 'cash' ? 'bg-[#FF5B00]/10 text-[#FF5B00]' :
                                item.payment_mode === 'online' ? 'bg-[#07DD05]/10 text-[#07DD05]' : 'bg-blue-500/10 text-blue-400'
                              }`}>
                                {item.payment_mode === 'cash' ? 'CASH' : item.payment_mode === 'online' ? 'ONL' : 'CHQ'}
                              </div>
                              
                              <div className="min-w-0 pr-2">
                                <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest block font-sans">
                                  {item.category} • {timeStr}
                                </span>
                                <h5 className="font-sans text-[12.5px] font-bold text-white uppercase tracking-tight truncate leading-tight">
                                  {item.remark || 'N/A Remark'}
                                </h5>
                                {item.contact && (
                                  <span className="text-[8.5px] font-mono text-gray-400 font-bold uppercase italic mt-1 block">
                                    👤 {item.contact}
                                  </span>
                                )}
                              </div>
                            </div>

                            {/* Amount in green/red & chronological running balance */}
                            <div className="text-right shrink-0">
                              <span className={`text-[15px] font-black tracking-tight block ${
                                item.type === 'in' ? 'text-[#07DD05]' : 'text-red-500'
                              }`}>
                                {item.type === 'in' ? '+' : '−'}৳{item.amount.toLocaleString('en-IN')}
                              </span>
                              <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest block font-sans">
                                Bal: ৳{runningBal.toLocaleString('en-IN')}
                              </span>
                            </div>
                          </div>

                          {/* Inline Detail drawer details */}
                          <AnimatePresence>
                            {expanded && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                className="border-t border-white/5 bg-white/[0.02]"
                              >
                                <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                                  <div className="space-y-3">
                                    <div className="grid grid-cols-2 gap-4">
                                      <div>
                                        <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest block">Entry Reference ID</span>
                                        <span className="text-xs font-mono font-bold text-white">{item.id}</span>
                                      </div>
                                      <div>
                                        <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest block">Recorded Date</span>
                                        <span className="text-xs font-bold text-white">
                                          {new Date(item.timestamp).toLocaleDateString('en-GB')} {timeStr}
                                        </span>
                                      </div>
                                    </div>

                                    {item.attachmentUrl && (
                                      <div>
                                        <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest block mb-1">Attachment File / Image URL</span>
                                        <a 
                                          href={item.attachmentUrl} 
                                          target="_blank" 
                                          rel="noreferrer"
                                          className="text-orange-primary font-mono text-[10px] font-bold uppercase underline inline-flex items-center gap-1.5"
                                        >
                                          📎 View Attached File
                                        </a>
                                      </div>
                                    )}
                                  </div>

                                  {/* Actions strip */}
                                  <div className="flex md:justify-end gap-3 pt-4 md:pt-0">
                                    <button
                                      onClick={() => handleOpenEditEntry(item)}
                                      className="py-2.5 px-4 bg-white/5 hover:bg-white/10 border border-white/15 text-white text-[9px] font-black uppercase rounded-lg tracking-wider italic flex items-center gap-1.5"
                                    >
                                      <Edit size={12} className="text-[#FF5B00]" /> Edit Record
                                    </button>
                                    <button
                                      onClick={() => handleDeleteEntry(item.id)}
                                      className="py-2.5 px-4 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/10 text-[9px] font-black uppercase rounded-lg tracking-wider italic flex items-center gap-1.5"
                                    >
                                      <Trash2 size={12} /> Delete Record
                                    </button>
                                  </div>
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* --- STICKY BOTTOM CONTROL SPLIT COMPONENT --- */}
      <div className="fixed bottom-0 inset-x-0 bg-[#0A0A1F]/90 backdrop-blur-2xl border-t border-white/5 p-4 md:p-6 z-[80] lg:pl-[340px]">
        <div className="max-w-4xl mx-auto grid grid-cols-2 gap-4 pb-1">
          {/* CASH IN */}
          <button
            onClick={() => handleOpenEntryModal('in')}
            className="h-14 font-black uppercase tracking-widest text-[11px] rounded-2xl bg-[#07DD05] text-black hover:bg-[#06cb04] transform hover:scale-[1.01] active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#07DD05]/10 italic border-0 cursor-pointer"
          >
            <Plus size={16} /> + Cash In (Inflow)
          </button>

          {/* CASH OUT */}
          <button
            onClick={() => handleOpenEntryModal('out')}
            className="h-14 font-black uppercase tracking-widest text-[11px] rounded-2xl bg-red-500 text-white hover:bg-red-600 transform hover:scale-[1.01] active:scale-[0.98] transition-all flex items-center justify-center gap-1.5 shadow-lg shadow-red-500/10 italic border-0 cursor-pointer"
          >
            <Minus size={16} /> − Cash Out (Outflow)
          </button>
        </div>
      </div>

      {/* === ADD / EDIT TRANSACTION ENTRY MODAL COMPONENT === */}
      <AnimatePresence>
        {isEntryModalOpen && (
          <div className="fixed inset-0 z-[250] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsEntryModalOpen(false)}
              className="absolute inset-0 bg-black/85 backdrop-blur-md"
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-lg bg-[#0A0A1F] border border-white/10 rounded-[32px] overflow-hidden shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto p-8"
            >
              {/* Header inside transaction card */}
              <div className="flex items-center justify-between border-b border-white/5 pb-4">
                <div className="flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-white ${
                    modalType === 'in' ? 'bg-[#07DD05]/15 text-[#07DD05]' : 'bg-red-500/15 text-red-400'
                  }`}>
                    {modalType === 'in' ? <Plus size={18} /> : <Minus size={18} />}
                  </div>
                  <div>
                    <h3 className="text-xl font-black uppercase italic tracking-tight text-white flex items-center gap-2">
                      {editingEntry ? 'Edit' : 'Add'}{' '}
                      <span className={modalType === 'in' ? 'text-[#07DD05]' : 'text-red-500'}>
                        Cash {modalType === 'in' ? 'In (Income)' : 'Out (Expense)'}
                      </span>
                    </h3>
                    <p className="text-[9px] uppercase tracking-widest text-gray-400">Ledger Book entry synchronization</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsEntryModalOpen(false)}
                  className="p-1 text-white/50 hover:text-white hover:bg-white/5 rounded-full transition-all"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Form Content */}
              <form onSubmit={(e) => handleSaveEntry(e, false)} className="space-y-4">
                
                {/* Big Amount Field */}
                <div className="space-y-1.5 text-center">
                  <label className="text-[9.5px] font-black text-gray-400 uppercase tracking-widest">Transaction Amount</label>
                  <div className="relative max-w-sm mx-auto">
                    <span className="absolute left-6 top-1/2 -translate-y-1/2 text-2xl font-sans font-black text-white/30">৳</span>
                    <input
                      type="number"
                      required
                      min="1"
                      step="any"
                      placeholder="0.00"
                      value={formData.amount}
                      onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                      className={`w-full h-18 text-center text-2xl font-black rounded-2xl bg-white/5 text-white pr-6 pl-12 border focus:outline-none placeholder:text-white/10 ${
                        modalType === 'in' 
                          ? 'border-[#07DD05]/20 focus:border-[#07DD05]/60' 
                          : 'border-red-500/20 focus:border-red-500/60'
                      }`}
                      autoFocus
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {/* Date picker */}
                  <div className="space-y-1.5">
                    <label className="text-[9px] font-black text-white/40 uppercase tracking-widest block pl-1">Date</label>
                    <input
                      type="date"
                      required
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                      className="w-full h-12 bg-white/5 border border-white/10 rounded-xl px-4 text-xs font-bold focus:outline-none focus:border-orange-primary/50 text-white"
                    />
                  </div>
                  {/* Time picker */}
                  <div className="space-y-1.5">
                    <label className="text-[9px] font-black text-white/40 uppercase tracking-widest block pl-1">Time</label>
                    <input
                      type="time"
                      required
                      value={formData.time}
                      onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                      className="w-full h-12 bg-white/5 border border-white/10 rounded-xl px-4 text-xs font-bold focus:outline-none focus:border-orange-primary/50 text-white"
                    />
                  </div>
                </div>

                {/* Categories */}
                <div className="space-y-1.5">
                  <label className="text-[9px] font-black text-white/40 uppercase tracking-widest block pl-1">Category Classification</label>
                  <div className="relative">
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full h-12 bg-white/5 border border-white/10 rounded-xl px-4 pr-10 text-xs font-bold focus:outline-none focus:border-orange-primary/50 text-white appearance-none cursor-pointer"
                    >
                      {CATEGORIES.map((cat) => (
                        <option key={cat} value={cat} className="bg-[#0A0A1F] text-white py-2">
                          {cat}
                        </option>
                      ))}
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-white/40">
                      <ChevronDown size={14} />
                    </div>
                  </div>
                </div>

                {/* Remark Text input */}
                <div className="space-y-1.5">
                  <label className="text-[9px] font-black text-white/40 uppercase tracking-widest block pl-1">Description / Remarks</label>
                  <input
                    type="text"
                    required
                    maxLength={100}
                    placeholder="Provide a quick note (e.g., Office Tea vendor bill, RMG export advances)"
                    value={formData.remark}
                    onChange={(e) => setFormData({ ...formData, remark: e.target.value })}
                    className="w-full h-13 bg-white/5 border border-white/10 rounded-xl px-4 text-xs font-bold focus:outline-none focus:border-orange-primary/50 text-white"
                  />
                </div>

                {/* Payee / Contact Name with Autocomplete */}
                <div className="space-y-1.5 relative">
                  <label className="text-[9px] font-black text-white/40 uppercase tracking-widest block pl-1">Contact Name / Payee (Optional)</label>
                  <input
                    type="text"
                    maxLength={40}
                    placeholder="Type name or select from auto-complete list"
                    value={formData.contact}
                    onChange={(e) => {
                      setFormData({ ...formData, contact: e.target.value });
                      setShowContactDropdown(true);
                    }}
                    onFocus={() => setShowContactDropdown(true)}
                    className="w-full h-12 bg-white/5 border border-white/10 rounded-xl px-4 text-xs font-bold focus:outline-none focus:border-orange-primary/50 text-white"
                  />
                  
                  {/* Autocomplete Dropdown list */}
                  <AnimatePresence>
                    {showContactDropdown && suggestedContacts.length > 0 && (
                      <>
                        <div className="fixed inset-0 z-10" onClick={() => setShowContactDropdown(false)} />
                        <motion.div
                          initial={{ opacity: 0, scale: 0.98 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.98 }}
                          className="absolute left-0 right-0 mt-1 max-h-40 overflow-y-auto bg-[#050514] border border-white/10 rounded-xl p-1.5 z-20 shadow-2xl no-scrollbar backdrop-blur-3xl"
                        >
                          <div className="text-[8px] uppercase tracking-widest text-gray-400 font-bold px-3 py-1 font-sans border-b border-white/5 mb-1 select-none">
                            Saved Contacts
                          </div>
                          {suggestedContacts
                            .filter(c => c.toLowerCase().includes(formData.contact.toLowerCase()))
                            .map((contact) => (
                              <button
                                key={contact}
                                type="button"
                                onClick={() => {
                                  setFormData({ ...formData, contact });
                                  setShowContactDropdown(false);
                                }}
                                className="w-full text-left px-3 py-2 text-[10.5px] font-bold text-gray-300 hover:text-white hover:bg-white/5 rounded-lg transition-all"
                              >
                                👤 {contact}
                              </button>
                            ))}
                        </motion.div>
                      </>
                    )}
                  </AnimatePresence>
                </div>

                {/* Settlement Pill choice */}
                <div className="space-y-1.5">
                  <label className="text-[9px] font-black text-white/40 uppercase tracking-widest pl-1 block">Payment Mode Instrument</label>
                  <div className="grid grid-cols-3 gap-2">
                    {(['cash', 'online', 'cheque'] as const).map((mode) => (
                      <button
                        key={mode}
                        type="button"
                        onClick={() => setFormData({ ...formData, paymentMode: mode })}
                        className={`h-11 rounded-xl text-[10px] font-black uppercase italic transition-all border flex items-center justify-center gap-1 ${
                          formData.paymentMode === mode 
                            ? 'bg-orange-primary/10 border-orange-primary text-white scale-[1.02]' 
                            : 'bg-white/5 border-white/5 text-gray-400 hover:bg-white/10'
                        }`}
                      >
                        {formData.paymentMode === mode && <Check size={11} className="text-[#07DD05]" />}
                        {mode === 'cash' ? '💵 Cash' : mode === 'online' ? '📱 Online' : '🏦 Cheque'}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Add More Fields Expandable logic */}
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => setAddMoreFields(!addMoreFields)}
                    className="text-[9px] font-black uppercase tracking-widest text-[#FF5B00] hover:underline flex items-center gap-1"
                  >
                    {addMoreFields ? <ChevronUp size={11} /> : <ChevronDown size={11} />}
                    {addMoreFields ? 'Hide Additional Details' : 'Add More Fields (Attachments...)'}
                  </button>

                  <AnimatePresence>
                    {addMoreFields && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden space-y-2 pt-3"
                      >
                        <div className="space-y-1.5">
                          <label className="text-[8px] font-black text-white/45 uppercase tracking-widest pl-1 block">Attach File / Photo URL Link</label>
                          <div className="flex gap-2">
                            <input
                              type="text"
                              placeholder="e.g., https://my-sourcing-invoice.com/slip.pdf"
                              value={formData.attachment}
                              onChange={(e) => setFormData({ ...formData, attachment: e.target.value })}
                              className="flex-1 h-11 bg-white/5 border border-white/15 focus:border-orange-primary/40 rounded-xl px-4 text-xs font-sans text-white focus:outline-none"
                            />
                            <button
                              type="button"
                              onClick={() => {
                                setFormData({ ...formData, attachment: 'https://images.unsplash.com/photo-1554415707-6e8cfc93fe23?w=400&h=300' });
                                toast.success('Mock slip attachment generated.');
                              }}
                              className="p-3 bg-white/5 border border-white/10 text-white rounded-xl hover:bg-white/10 hover:text-orange-primary"
                              title="Mock Scan Slip File"
                            >
                              <Camera size={16} />
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Modal actions panel footer code */}
                <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-white/5 justify-end">
                  <button
                    type="button"
                    onClick={() => setIsEntryModalOpen(false)}
                    className="h-12 px-6 bg-white/5 hover:bg-white/10 border border-white/10 font-black text-[10px] uppercase text-white tracking-widest italic rounded-2xl transition-all"
                  >
                    Cancel
                  </button>

                  {/* SAVE & ADD NEW - only visible during create mode */}
                  {!editingEntry && (
                    <button
                      type="button"
                      onClick={(e) => handleSaveEntry(e, true)}
                      className="h-12 px-5 border-2 border-orange-primary/20 hover:border-orange-primary bg-orange-primary/5 text-white font-black text-[10px] uppercase tracking-widest italic rounded-2xl hover:scale-[1.01] active:scale-[0.98] transition-all"
                    >
                      Save & Add New
                    </button>
                  )}

                  <button
                    type="submit"
                    className="h-12 px-6 bg-[#07DD05] hover:bg-[#06cb04] text-black font-black text-[10px] uppercase tracking-widest italic rounded-2xl hover:scale-[1.01] active:scale-[0.98] transition-all"
                  >
                    Save Entry
                  </button>
                </div>

              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
