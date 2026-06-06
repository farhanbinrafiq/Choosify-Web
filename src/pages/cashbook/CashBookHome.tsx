import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  BookOpen, Plus, MoreVertical, Edit2, Trash2, ArrowLeft, TrendingUp, 
  ArrowUpRight, ArrowDownLeft, RefreshCw, Layers 
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { DriveService, Book } from '../../lib/driveService';
import { useGlobalState } from '../../context/GlobalStateContext';
import toast from 'react-hot-toast';

const PRESET_COLORS = [
  '#FF5B00', // Choosify Orange
  '#07DD05', // Choosify Green
  '#3B82F6', // Blue
  '#9333EA', // Purple
  '#EC4899', // Pink
  '#F59E0B', // Amber
  '#EF4444', // Red
  '#06B6D4', // Cyan
  '#14B8A6', // Teal
];

const PRESET_EMOJIS = [
  '💼', '🏠', '🛒', '💰', '📈', '🍔', '🚗', '💡', '🎓', '🎁', '🛠️', '🏖️'
];

export function CashBookHome() {
  const navigate = useNavigate();
  const { currentUser } = useGlobalState();
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [isGoogleConnected, setIsGoogleConnected] = useState(DriveService.isConnected());

  // Modals state
  const [isNewBookOpen, setIsNewBookOpen] = useState(false);
  const [newBookName, setNewBookName] = useState('');
  const [selectedColor, setSelectedColor] = useState(PRESET_COLORS[0]);
  const [selectedEmoji, setSelectedEmoji] = useState(PRESET_EMOJIS[0]);

  // Rename modal state
  const [renameBookId, setRenameBookId] = useState<string | null>(null);
  const [renameBookName, setRenameBookName] = useState('');

  // Delete modal state (Require typing book name safety check)
  const [deleteBookObj, setDeleteBookObj] = useState<Book | null>(null);
  const [deleteConfirmName, setDeleteConfirmName] = useState('');

  // Dropdown menu state per card
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

  // Sync / Client configuration modal
  const [showSyncConfig, setShowSyncConfig] = useState(false);
  const [customClientId, setCustomClientId] = useState(DriveService.getClientId());

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await DriveService.getBooks();
      setBooks(data);
    } catch (e: any) {
      toast.error('Could not fetch CashBooks roster.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Check if redirect has returned an access token hash
    const handled = DriveService.handleAuthCallback();
    if (handled) {
      setIsGoogleConnected(true);
    }
    loadData();
  }, []);

  const handleCreateBook = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBookName.trim()) return;
    
    const resolveLoader = toast.loading('Creating Book...');
    try {
      await DriveService.createBook(
        newBookName,
        selectedColor,
        selectedEmoji
      );
      toast.dismiss(resolveLoader);
      toast.success('Your folder book was successfully created!');
      setNewBookName('');
      setSelectedColor(PRESET_COLORS[0]);
      setSelectedEmoji(PRESET_EMOJIS[0]);
      setIsNewBookOpen(false);
      loadData();
    } catch (e: any) {
      toast.dismiss(resolveLoader);
      toast.error('Failed to create book folder.');
    }
  };

  const handleRenameBook = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!renameBookId || !renameBookName.trim()) return;

    const resolveLoader = toast.loading('Renaming Book...');
    try {
      await DriveService.updateBookInfo(renameBookId, { name: renameBookName });
      toast.dismiss(resolveLoader);
      toast.success('Book renamed successfully!');
      setRenameBookId(null);
      setRenameBookName('');
      loadData();
    } catch (err) {
      toast.dismiss(resolveLoader);
      toast.error('Failed to rename book folder.');
    }
  };

  const handleDeleteBook = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!deleteBookObj) return;

    if (deleteConfirmName !== deleteBookObj.name) {
      toast.error('Confirmation text does not match name of the Book.');
      return;
    }

    const resolveLoader = toast.loading('Deleting Book and ledger history...');
    try {
      await DriveService.deleteBook(deleteBookObj.id);
      toast.dismiss(resolveLoader);
      toast.success('Book permanently deleted.');
      setDeleteBookObj(null);
      setDeleteConfirmName('');
      loadData();
    } catch (err) {
      toast.dismiss(resolveLoader);
      toast.error('Failed to delete book.');
    }
  };

  const handleConnectGoogle = () => {
    DriveService.authorize();
  };

  const handleDisconnectGoogle = () => {
    DriveService.disconnect();
    setIsGoogleConnected(false);
    loadData();
  };

  const handleUpdateClientId = () => {
    DriveService.setClientId(customClientId);
    toast.success('Client identity updated successfully.');
    setShowSyncConfig(false);
  };

  // Aggregated Net calculations across all books listed
  const totalCashIn = books.reduce((acc, curr) => acc + (curr.totalIn || 0), 0);
  const totalCashOut = books.reduce((acc, curr) => acc + (curr.totalOut || 0), 0);
  const netBalance = totalCashIn - totalCashOut;

  return (
    <div className="bg-[#0D1B2A] p-6 md:p-10 lg:p-12 min-h-screen text-white font-sans space-y-10 animate-in fade-in slide-in-from-bottom-5 duration-700">
      
      {/* Header section with Drive Link controller and back to dashboard redirect */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-white/5">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/dashboard')} 
            className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white/70 hover:text-white transition-all hover:bg-white/10"
            title="Back to Dashboard"
          >
            <ArrowLeft size={18} />
          </button>
          <div>
            <h1 className="text-3xl font-black text-white italic uppercase tracking-tighter mb-1 select-none">
              Cash<span className="text-[#F96500]">Book</span>
            </h1>
            <p className="text-gray-400 text-[10px] font-black uppercase tracking-[0.3em]">
              Personal & Business Ledger Safe Sync'd to your Google Drive
            </p>
          </div>
        </div>

        {/* Sync Controls */}
        <div className="flex items-center flex-wrap gap-3">
          <button
            onClick={() => setShowSyncConfig(!showSyncConfig)}
            className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest text-gray-300 italic transition-all flex items-center gap-2"
          >
            Settings
          </button>

          {isGoogleConnected ? (
            <div className="flex items-center gap-1">
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-green-accent/15 border border-green-accent/20 text-green-accent text-[9px] font-black uppercase italic">
                <span className="w-1.5 h-1.5 rounded-full bg-green-accent animate-ping" />
                Drive Connected
              </span>
              <button
                onClick={handleDisconnectGoogle}
                className="px-3.5 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/10 text-[9px] font-black uppercase rounded-xl tracking-wider transition-all italic"
              >
                Disconnect
              </button>
            </div>
          ) : (
            <button
              onClick={handleConnectGoogle}
              className="px-4 py-2.5 bg-orange-primary hover:bg-orange-primary/90 text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-2 shadow-xl shadow-orange-primary/10"
            >
              <RefreshCw size={12} className="animate-spin-slow" />
              Connect Google Drive
            </button>
          )}

          <button
            onClick={() => { loadData(); toast.success('Sync re-triggered.'); }}
            className="p-2.5 bg-white/5 border border-white/10 text-white hover:text-orange-primary hover:bg-white/10 rounded-xl transition-all"
            title="Refresh from Drive"
          >
            <RefreshCw size={14} />
          </button>
        </div>
      </div>

      {/* Sync/API Config Panel popup inside page */}
      <AnimatePresence>
        {showSyncConfig && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="p-6 bg-white/5 border border-white/10 rounded-3xl space-y-4"
          >
            <h3 className="text-xs font-black text-white uppercase tracking-wider italic">Google Drive API Client Configuration</h3>
            <p className="text-[10px] font-bold text-gray-400 leading-relaxed max-w-xl">
              By default, Choosify uses a secure developer API client credential configured via Google developer console. If your organization has strict Workspace permissions or custom scopes, you can inject your own Client ID below.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                placeholder="Google OAuth Client ID"
                value={customClientId}
                onChange={(e) => setCustomClientId(e.target.value)}
                className="flex-1 h-12 bg-white/5 border border-white/10 rounded-2xl px-4 text-xs font-mono text-white focus:outline-none focus:border-orange-primary/50"
              />
              <div className="flex gap-2">
                <button
                  onClick={handleUpdateClientId}
                  className="px-5 h-12 bg-[#07DD05] hover:bg-[#06bc04] text-white text-[10px] font-black uppercase rounded-2xl tracking-wider transition-all"
                >
                  Save ID
                </button>
                <button
                  onClick={() => {
                    setCustomClientId(PRESET_COLORS[0]);
                    DriveService.setClientId('');
                    setCustomClientId(DriveService.getClientId());
                    toast.success('Reset to default client ID');
                  }}
                  className="px-4 h-12 bg-white/5 hover:bg-white/10 border border-white/10 text-white text-[10px] font-black uppercase rounded-2xl transition-all"
                >
                  Reset
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* SUMMARY PANEL STRIP AT TOP - Total Cash In, Out, Balance */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Net Balance Card */}
        <div className="bg-[#132237] border border-white/10 rounded-[28px] p-8 flex items-center justify-between relative overflow-hidden group hover:bg-white/[0.08] hover:border-white/20 transition-all border-l-4 border-l-[#F96500]">
          <div className="absolute top-0 right-0 w-24 h-24 bg-orange-primary/5 blur-3xl rounded-full" />
          <div className="space-y-1.5">
            <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest block">Net Balance Across Books</span>
            <h2 className="text-3xl font-black text-white tracking-tight">
              ৳{netBalance.toLocaleString('en-IN')}
            </h2>
          </div>
          <div className="w-12 h-12 bg-orange-primary/10 text-orange-primary rounded-2xl flex items-center justify-center">
            <TrendingUp size={22} />
          </div>
        </div>

        {/* Total Cash In Card */}
        <div className="bg-[#132237] border border-white/10 rounded-[28px] p-8 flex items-center justify-between relative overflow-hidden group hover:bg-white/[0.08] hover:border-white/20 transition-all border-l-4 border-l-[#07DD05]">
          <div className="absolute top-0 right-0 w-24 h-24 bg-green-accent/5 blur-3xl rounded-full" />
          <div className="space-y-1.5">
            <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest block font-sans">Total Cash In</span>
            <h2 className="text-3xl font-black text-[#07DD05] tracking-tight">
              ৳{totalCashIn.toLocaleString('en-IN')}
            </h2>
          </div>
          <div className="w-12 h-12 bg-green-accent/10 text-green-accent rounded-2xl flex items-center justify-center">
            <ArrowUpRight size={22} />
          </div>
        </div>

        {/* Total Cash Out Card */}
        <div className="bg-[#132237] border border-white/10 rounded-[28px] p-8 flex items-center justify-between relative overflow-hidden group hover:bg-white/[0.08] hover:border-white/20 transition-all border-l-4 border-l-red-500">
          <div className="absolute top-0 right-0 w-24 h-24 bg-red-500/5 blur-3xl rounded-full" />
          <div className="space-y-1.5">
            <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest block">Total Cash Out</span>
            <h2 className="text-3xl font-black text-red-500 tracking-tight">
              ৳{totalCashOut.toLocaleString('en-IN')}
            </h2>
          </div>
          <div className="w-12 h-12 bg-red-500/10 text-red-500 rounded-2xl flex items-center justify-center">
            <ArrowDownLeft size={22} />
          </div>
        </div>

      </div>

      {/* Book Folder cards list */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-black text-white italic uppercase tracking-tight">Active Books</h2>
            <p className="text-[9px] text-gray-400 uppercase font-black tracking-widest">Select a ledger folder to record Cash transactions</p>
          </div>
          <button
            onClick={() => setIsNewBookOpen(true)}
            className="h-11 px-6 bg-orange-primary hover:bg-orange-primary/95 text-white text-[11px] font-black uppercase tracking-widest rounded-2xl transform active:scale-95 transition-all flex items-center gap-2 italic cursor-pointer"
          >
            <Plus size={16} /> New Book
          </button>
        </div>

        {loading ? (
          <div className="py-24 text-center space-y-4">
            <RefreshCw size={32} className="animate-spin text-[#F96500] mx-auto opacity-55" />
            <span className="text-xs font-black text-gray-400 uppercase tracking-widest italic block">Syncing workspace and ledgers...</span>
          </div>
        ) : books.length === 0 ? (
          <div className="bg-[#132237] border border-white/10 rounded-3xl p-16 text-center space-y-6 max-w-xl mx-auto border-dashed">
            <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mx-auto text-orange-primary">
              <BookOpen size={30} />
            </div>
            <div className="space-y-1">
              <h4 className="text-lg font-black uppercase italic tracking-tight">No Active CashBooks Found</h4>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Create your first book to start tracking cash flow</p>
            </div>
            <button
              onClick={() => setIsNewBookOpen(true)}
              className="py-3 px-6 bg-orange-primary hover:bg-[#EB4501] text-white font-black text-[10px] uppercase rounded-xl hover:scale-[1.02] active:scale-[0.98] transition-all tracking-widest italic"
            >
              Create first book
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {books.map((b) => (
              <div
                key={b.id}
                onClick={() => navigate(`/cashbook/${b.id}`)}
                className="bg-[#132237] border border-white/5 rounded-2xl p-6 relative flex flex-col justify-between hover:bg-white/[0.08] hover:border-white/15 hover:scale-[1.01] transition-all shadow-lg hover:shadow-2xl cursor-pointer overflow-hidden max-w-full"
                style={{ borderLeft: `5px solid ${b.color || '#FF5B00'}` }}
              >
                {/* 3 dots context menu */}
                <div 
                  className="absolute top-4 right-4 z-20"
                  onClick={(e) => { e.stopPropagation(); setActiveMenuId(activeMenuId === b.id ? null : b.id); }}
                >
                  <button className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/60 hover:text-white transition-all">
                    <MoreVertical size={14} />
                  </button>

                  <AnimatePresence>
                    {activeMenuId === b.id && (
                      <>
                        <div className="fixed inset-0 z-10" onClick={(e) => { e.stopPropagation(); setActiveMenuId(null); }} />
                        <motion.div
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                          className="absolute right-0 mt-1.5 w-40 bg-[#0A0A1F] border border-white/10 p-2 rounded-xl shadow-2xl z-20"
                        >
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setRenameBookId(b.id);
                              setRenameBookName(b.name);
                              setActiveMenuId(null);
                            }}
                            className="w-full flex items-center gap-3.5 px-3 py-2 text-[10px] text-gray-300 font-black uppercase hover:text-white hover:bg-white/5 rounded-lg transition-all text-left italic"
                          >
                            <Edit2 size={12} className="text-[#FF5B00]" /> Rename Book
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setDeleteBookObj(b);
                              setDeleteConfirmName('');
                              setActiveMenuId(null);
                            }}
                            className="w-full flex items-center gap-3.5 px-3 py-2 text-[10px] text-red-500 font-black uppercase hover:bg-red-500/10 rounded-lg transition-all text-left italic font-mono"
                          >
                            <Trash2 size={12} /> Delete Book
                          </button>
                        </motion.div>
                      </>
                    )}
                  </AnimatePresence>
                </div>

                {/* Card Content Folder */}
                <div className="flex items-center gap-4.5 mb-5 pr-8">
                  <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center text-3xl border border-white/5 shadow-inner shrink-0">
                    {b.icon || '📂'}
                  </div>
                  <div className="min-w-0 pr-2">
                    <h3 className="font-sans text-base font-black text-white italic uppercase truncate mb-1">
                      {b.name}
                    </h3>
                    <div className="flex items-center gap-2">
                      <span className="text-[9px] font-mono font-bold text-gray-400 uppercase">
                        {b.entryCount || 0} Entries
                      </span>
                      <span className="text-[8px] font-black text-gray-400 uppercase tracking-wider italic">
                        • {b.updated_at ? new Date(b.updated_at).toLocaleDateString('en-GB') : 'No updates'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Mini totals layout details */}
                <div className="grid grid-cols-2 gap-4 border-t border-white/5 pt-4 bg-white/[0.01] -mx-6 -mb-6 px-6 pb-6 rounded-b-2xl">
                  <div className="space-y-1 border-r border-white/5">
                    <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest block">Accumulated Net In</span>
                    <span className="text-sm font-black text-[#07DD05] tracking-tight truncate block">
                      ৳{(b.totalIn || 0).toLocaleString('en-IN')}
                    </span>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest block">Accumulated Out</span>
                    <span className="text-sm font-black text-red-500 tracking-tight truncate block">
                      ৳{(b.totalOut || 0).toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>

              </div>
            ))}
          </div>
        )}
      </div>

      {/* --- ADD NEW BOOK MODAL COMPONENT --- */}
      <AnimatePresence>
        {isNewBookOpen && (
          <div className="fixed inset-0 z-[250] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsNewBookOpen(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-md bg-[#0A0A1F] border border-white/10 rounded-[32px] overflow-hidden p-8 shadow-2xl space-y-6"
            >
              <div className="flex items-center justify-between border-b border-white/5 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-orange-primary/10 rounded-2xl flex items-center justify-center text-orange-primary font-bold">
                    📂
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-white italic uppercase tracking-tighter">Add Custom Book</h3>
                    <p className="text-[9px] uppercase tracking-widest text-gray-400">Initialize a custom business accounts ledger</p>
                  </div>
                </div>
              </div>

              <form onSubmit={handleCreateBook} className="space-y-5">
                {/* Name */}
                <div className="space-y-2">
                  <label className="text-[9px] font-black text-white/50 uppercase tracking-widest">Book Name</label>
                  <input
                    type="text"
                    required
                    maxLength={32}
                    placeholder="e.g., Office Supplies, Household Exp"
                    value={newBookName}
                    onChange={(e) => setNewBookName(e.target.value)}
                    className="w-full h-14 bg-white/5 border border-white/10 rounded-2xl px-5 text-white text-sm font-bold focus:outline-none focus:border-orange-primary/50"
                  />
                </div>

                {/* Color presets list picker */}
                <div className="space-y-2">
                  <label className="text-[9px] font-black text-white/50 uppercase tracking-widest block">Folder Accent Branding</label>
                  <div className="flex flex-wrap gap-2.5">
                    {PRESET_COLORS.map((col) => (
                      <button
                        key={col}
                        type="button"
                        onClick={() => setSelectedColor(col)}
                        className={`w-8 h-8 rounded-full border-2 transition-all transform active:scale-90`}
                        style={{ 
                          backgroundColor: col, 
                          borderColor: selectedColor === col ? 'white' : 'transparent',
                          scale: selectedColor === col ? '1.1' : '1'
                        }}
                      />
                    ))}
                  </div>
                </div>

                {/* Emoji list picker */}
                <div className="space-y-2">
                  <label className="text-[9px] font-black text-white/50 uppercase tracking-widest block">Primary Cover Icon</label>
                  <div className="grid grid-cols-6 gap-3 pt-1">
                    {PRESET_EMOJIS.map((emo) => (
                      <button
                        key={emo}
                        type="button"
                        onClick={() => setSelectedEmoji(emo)}
                        className={`h-11 rounded-xl text-xl flex items-center justify-center border font-sans transition-all active:scale-95 ${
                          selectedEmoji === emo 
                            ? 'bg-orange-primary/25 border-orange-primary text-white scale-105' 
                            : 'bg-white/5 border-white/10 text-gray-300 hover:bg-white/10'
                        }`}
                      >
                        {emo}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Saving / Loading UI button */}
                <div className="flex gap-4 border-t border-white/5 pt-5 justify-end">
                  <button
                    type="button"
                    onClick={() => setIsNewBookOpen(false)}
                    className="height-11 px-6 h-12 bg-white/5 hover:bg-white/10 border border-white/10 text-white text-[10px] uppercase font-black tracking-widest italic rounded-2xl transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={!newBookName.trim()}
                    className="px-6 h-12 bg-[#07DD05] hover:bg-[#06ca04] disabled:opacity-40 text-black disabled:text-white/40 text-[10px] uppercase font-black tracking-widest italic rounded-2xl transition-all flex items-center justify-center gap-1.5"
                  >
                    Create Book
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* --- RENAME BOOK MODAL INLINE --- */}
      <AnimatePresence>
        {renameBookId && (
          <div className="fixed inset-0 z-[250] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setRenameBookId(null)}
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-sm bg-[#0A0A1F] border border-white/10 rounded-[32px] p-8 shadow-2xl space-y-6"
            >
              <div>
                <h3 className="text-lg font-black uppercase italic tracking-tight">Rename Accounts Book</h3>
                <p className="text-[9px] uppercase text-gray-400">Modify cover identity for the folder</p>
              </div>

              <form onSubmit={handleRenameBook} className="space-y-4">
                <input
                  type="text"
                  required
                  placeholder="New book cover name"
                  value={renameBookName}
                  onChange={(e) => setRenameBookName(e.target.value)}
                  className="w-full h-14 bg-white/5 border border-white/10 rounded-2xl px-5 text-white text-sm font-bold focus:outline-none focus:border-orange-primary/50"
                />

                <div className="flex gap-3 justify-end border-t border-white/5 pt-4">
                  <button
                    type="button"
                    onClick={() => setRenameBookId(null)}
                    className="px-5 h-11 bg-white/5 hover:bg-white/10 text-white text-[10px] font-black uppercase tracking-widest italic rounded-xl"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 h-11 bg-[#F96500] hover:bg-[#F96500]/90 text-white text-[10px] font-black uppercase tracking-widest italic rounded-xl"
                  >
                    Rename
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* --- SAFE DELETE BOOK CONFIRMATION MODAL --- */}
      <AnimatePresence>
        {deleteBookObj && (
          <div className="fixed inset-0 z-[250] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setDeleteBookObj(null)}
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-md bg-[#0A0A1F] border border-red-500/25 rounded-[32px] p-8 shadow-2xl space-y-6"
            >
              <div className="space-y-2 text-center">
                <div className="w-14 h-14 bg-red-500/10 text-red-500 rounded-full flex items-center justify-center mx-auto text-2xl font-mono">
                  ⚠
                </div>
                <h3 className="text-xl font-black uppercase tracking-tight text-red-500 italic">Delete Registry Safely</h3>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider leading-relaxed">
                  This action is completely irreversible. Deleting the book folder <span className="text-white">"{deleteBookObj.name}"</span> will erase its transaction entries database and cloud sync references.
                </p>
              </div>

              <form onSubmit={handleDeleteBook} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest block text-center">
                    Type <span className="text-white">"{deleteBookObj.name}"</span> below to authorize destruction:
                  </label>
                  <input
                    type="text"
                    required
                    placeholder={deleteBookObj.name}
                    value={deleteConfirmName}
                    onChange={(e) => setDeleteConfirmName(e.target.value)}
                    className="w-full h-14 bg-red-500/5 border border-red-500/20 text-center text-red-400 rounded-2xl px-5 text-sm font-bold focus:outline-none focus:border-red-500 font-mono"
                  />
                </div>

                <div className="flex gap-3 justify-center border-t border-white/5 pt-5">
                  <button
                    type="button"
                    onClick={() => setDeleteBookObj(null)}
                    className="px-6 h-12 bg-white/5 hover:bg-white/10 text-white text-[10px] font-black uppercase tracking-widest italic rounded-2xl"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={deleteConfirmName !== deleteBookObj.name}
                    className="px-6 h-12 bg-red-500 hover:bg-red-600 disabled:opacity-40 text-white text-[10px] font-black uppercase tracking-widest italic rounded-2xl"
                  >
                    Confirm Delete
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
