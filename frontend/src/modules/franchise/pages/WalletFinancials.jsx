import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
   Wallet,
   TrendingUp,
   ArrowUpRight,
   ArrowDownRight,
   Download,
   Filter,
   Calendar,
   Clock,
   ArrowRight,
   History,
   X,
   ShieldCheck
} from 'lucide-react';
import { useFranchiseWalletStore } from '../store/walletStore';
import GlassTable from '../components/GlassTable';
import StatusBadge from '../components/StatusBadge';

export default function WalletFinancials() {
   const { balance, ledger = [], fetchWallet, requestPayout } = useFranchiseWalletStore();
   const payoutRequests = ledger.filter(t => t.type === 'Payout');
   const [isPayoutModalOpen, setPayoutModalOpen] = useState(false);
   const [payoutAmount, setPayoutAmount] = useState('');
   const [showSettlement, setShowSettlement] = useState(false);

   useEffect(() => {
      fetchWallet();
   }, [fetchWallet]);

   const handlePayoutRequest = (e) => {
      e.preventDefault();
      const amount = parseFloat(payoutAmount);
      if (amount > 0 && amount <= balance) {
         requestPayout(amount);
         setPayoutModalOpen(false);
         setPayoutAmount('');
      }
   };

   const totalYield = ledger.filter(t => t.type === 'Subscription' || t.amount > 0).reduce((acc, t) => acc + t.amount, 0);
   const totalSettled = ledger.filter(t => t.type === 'Payout' && t.status === 'completed').reduce((acc, t) => acc + Math.abs(t.amount), 0);
   const platformFee = totalYield * 0.1;

   const columns = [
      {
         header: 'Reference ID',
         accessor: 'id',
         render: (row) => <span className="text-[7.5px] font-black font-mono text-[var(--text-secondary)] uppercase tracking-[0.2em] italic opacity-60">{row._id || row.id}</span>
      },
      {
         header: 'Operation / Source',
         accessor: 'type',
         render: (row) => (
            <div className="flex items-center gap-2">
               <div className={`p-1.5 rounded-lg border shadow-inner ${row.amount > 0 ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-600' : 'bg-rose-500/10 border-rose-500/20 text-rose-600'
                  }`}>
                  {row.amount > 0 ? <ArrowUpRight size={10} strokeWidth={3} /> : <ArrowDownRight size={10} strokeWidth={3} />}
               </div>
               <div className="flex flex-col">
                  <span className="text-[9px] font-black text-[var(--text-primary)] uppercase tracking-widest italic leading-none">{row.type}</span>
                  {row.subscriberName && <span className="text-[6.5px] font-black text-[var(--text-tertiary)] opacity-60 tracking-[0.2em] truncate uppercase italic mt-0.5 leading-none">SUB: {row.subscriberName}</span>}
               </div>
            </div>
         )
      },
      {
         header: 'Timestamp',
         accessor: 'date',
         render: (row) => (
            <div className="flex flex-col">
               <span className="text-[9px] font-black text-[var(--text-secondary)] italic leading-none">{new Date(row.date).toLocaleDateString()}</span>
               <span className="text-[6.5px] font-black text-[var(--text-tertiary)] opacity-60 uppercase tracking-[0.2em] italic mt-0.5">{new Date(row.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
            </div>
         )
      },
      {
         header: 'Status',
         accessor: 'status',
         render: (row) => <StatusBadge status={row.status} />
      },
      {
         header: 'Nominal Value',
         accessor: 'amount',
         render: (row) => (
            <span className={`text-[10px] font-black tracking-widest italic ${row.amount > 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
               {row.amount > 0 ? '+' : ''}₹{Math.abs(row.amount).toLocaleString('en-IN')}
            </span>
         )
      }
   ];

   return (
      <div className="space-y-6 pb-12">
         {/* Page Header */}
         <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-0.5">
               <div className="flex items-center gap-2">
                  <div className="w-1 h-3 bg-emerald-500 rounded-full" />
                  <h1 className="text-lg font-black tracking-tighter text-[var(--text-primary)] uppercase italic leading-none">
                     Financial <span className="text-emerald-500">Ledger</span>
                  </h1>
               </div>
               <p className="text-[7.5px] font-black uppercase tracking-[0.3em] ml-3 text-[var(--text-tertiary)] italic opacity-40 leading-none">
                  EARNINGS_TRACKING • FRANCHISE_PAYOUT_CONSOLE
               </p>
            </div>

            <div className="flex items-center gap-2">
               <button
                  onClick={() => setShowSettlement(true)}
                  className="p-2 bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-lg text-[var(--text-tertiary)] hover:text-emerald-500 hover:border-emerald-500/20 transition-all shadow-inner"
               >
                  <Download size={14} />
               </button>
               <button
                  onClick={() => setPayoutModalOpen(true)}
                  className="px-3 py-1.5 bg-emerald-600 text-white rounded-xl text-[7.5px] font-black uppercase tracking-widest hover:bg-emerald-500 transition-all shadow-lg active:scale-95 italic flex items-center gap-1.5 shadow-emerald-950/20 leading-none"
               >
                  REQUEST_PAYOUT <ArrowRight size={10} strokeWidth={3} />
               </button>
            </div>
         </div>

         <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Wallet Balance Card */}
            <div className="lg:col-span-2 relative group p-6 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] shadow-inner flex flex-col justify-between min-h-[240px] overflow-hidden">
               <div className="absolute top-0 right-0 p-8 opacity-[0.02] scale-[2.5] rotate-12 pointer-events-none">
                  <Wallet size={120} className="text-emerald-500" />
               </div>

               <div className="space-y-1 relative z-10">
                  <div className="inline-flex items-center gap-2 px-2 py-1 bg-emerald-500/10 rounded border border-emerald-500/20 shadow-inner">
                     <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_#10b981]" />
                     <span className="text-[6.5px] font-black uppercase tracking-[0.3em] text-emerald-500 italic leading-none">AVAILABLE_LIQUIDITY</span>
                  </div>
                  <div className="flex items-baseline gap-3 mt-4">
                     <span className="text-[var(--text-tertiary)] text-xl font-black opacity-40 italic">₹</span>
                     <h2 className="text-5xl font-black tracking-tighter text-[var(--text-primary)] italic">
                        {balance.toLocaleString('en-IN')}
                     </h2>
                     <div className="flex flex-col gap-0 mb-1">
                        <span className="text-[7.5px] font-black text-emerald-500 uppercase tracking-widest italic flex items-center gap-1 leading-none">
                           <TrendingUp size={10} strokeWidth={3} />
                           +12.4% <span className="opacity-40 text-[var(--text-tertiary)] tracking-[0.2em]">YTD</span>
                        </span>
                        <span className="text-[6.5px] font-black text-[var(--text-tertiary)] uppercase tracking-[0.2em] italic opacity-40 mt-1 leading-none">REALTIME_SYNC</span>
                     </div>
                  </div>
               </div>

               <div className="grid grid-cols-3 gap-4 pt-6 border-t border-[var(--border-subtle)] relative z-10">
                  <div className="space-y-1.5">
                     <p className="text-[6.5px] font-black uppercase tracking-[0.3em] text-[var(--text-tertiary)] italic opacity-60 leading-none">TOTAL_YIELD</p>
                     <p className="text-lg font-black text-[var(--text-primary)] italic leading-none">₹{(totalYield / 1000).toFixed(1)}K</p>
                     <div className="w-6 h-0.5 bg-emerald-500/20 rounded-full" />
                  </div>
                  <div className="space-y-1.5">
                     <p className="text-[6.5px] font-black uppercase tracking-[0.3em] text-[var(--text-tertiary)] italic opacity-60 leading-none">PLATFORM_FEE</p>
                     <p className="text-lg font-black text-rose-500 italic leading-none">₹{(platformFee / 1000).toFixed(1)}K</p>
                     <div className="w-6 h-0.5 bg-rose-500/20 rounded-full" />
                  </div>
                  <div className="space-y-1.5">
                     <p className="text-[6.5px] font-black uppercase tracking-[0.3em] text-[var(--text-tertiary)] italic opacity-60 leading-none">SETTLED_TO_DATE</p>
                     <p className="text-lg font-black text-blue-500 italic leading-none">₹{(totalSettled / 1000).toFixed(1)}K</p>
                     <div className="w-6 h-0.5 bg-blue-500/20 rounded-full" />
                  </div>
               </div>
            </div>

            {/* Payout History Terminal */}
            <div className="flex flex-col rounded-xl bg-black border border-[var(--border-subtle)] shadow-inner p-4 overflow-hidden max-h-[240px] lg:max-h-full">
               <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/5">
                  <div className="flex items-center gap-1.5">
                     <h3 className="text-[9px] font-black uppercase tracking-[0.2em] text-white italic leading-none">PAYOUT_TERMINAL</h3>
                  </div>
                  <span className="text-[6.5px] font-black text-emerald-500 uppercase tracking-[0.3em] italic">ACTIVE</span>
               </div>

               <div className="flex-1 overflow-y-auto no-scrollbar space-y-2 pr-1">
                  {payoutRequests.length > 0 ? payoutRequests.map((req, i) => (
                     <div key={i} className="p-3 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-subtle)] shadow-inner group hover:border-emerald-500/20 transition-all flex flex-col justify-center">
                        <div className="flex items-center justify-between mb-1.5">
                           <span className="text-[10px] font-black text-emerald-500 tracking-widest italic leading-none">₹{req.amount.toLocaleString('en-IN')}</span>
                           <StatusBadge status={req.status} className="scale-[0.7] origin-right" />
                        </div>
                        <div className="flex items-center justify-between text-[var(--text-tertiary)]">
                           <div className="flex items-center gap-1 text-[6.5px] font-black uppercase tracking-[0.3em] italic opacity-60 leading-none">
                              <Calendar size={8} strokeWidth={3} />
                              {new Date(req.date).toLocaleDateString()}
                           </div>
                           <div className="text-[6.5px] font-black tracking-[0.2em] uppercase italic truncate opacity-40 leading-none">AC*4821</div>
                        </div>
                     </div>
                  )) : (
                     <div className="py-8 flex flex-col items-center justify-center text-center opacity-30 gap-2">
                        <History size={16} strokeWidth={2} className="text-white" />
                        <span className="text-[7.5px] font-black uppercase tracking-[0.3em] leading-none text-white italic">NO_PAYOUT_LOGS</span>
                     </div>
                  )}
               </div>

               <div className="mt-4 pt-3 border-t border-white/5">
                  <div className="flex items-center justify-between bg-[var(--bg-secondary)] p-3 rounded-xl border border-[var(--border-subtle)] shadow-inner">
                     <div className="space-y-1">
                        <p className="text-[6.5px] font-black uppercase tracking-[0.3em] text-emerald-500 leading-none italic">NEXT_HUB_CYCLE</p>
                        <p className="text-[9px] font-black text-white uppercase tracking-[0.2em] italic leading-none">MON_APR_06</p>
                     </div>
                     <div className="w-6 h-6 rounded bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.2)]">
                        <Clock size={10} strokeWidth={3} />
                     </div>
                  </div>
               </div>
            </div>
         </div>

         {/* Transaction Records */}
         <div className="space-y-4">
            <div className="flex items-center justify-between">
               <div className="space-y-0.5">
                  <h3 className="text-[9px] font-black uppercase tracking-[0.2em] text-[var(--text-primary)] italic leading-none">JOURNAL_LOG</h3>
                  <p className="text-[6.5px] font-black text-[var(--text-tertiary)] uppercase italic tracking-[0.3em] opacity-60 leading-none">OPERATIONAL_SETTLEMENT_RECORDS</p>
               </div>
            </div>
            <GlassTable columns={columns} data={ledger} emptyMessage="No transaction logs available for current operational period" />
         </div>

         <AnimatePresence>
            {isPayoutModalOpen && (
               <>
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setPayoutModalOpen(false)} className="fixed inset-0 bg-slate-950/40 backdrop-blur-[2px] z-[70]" />
                  <motion.div initial={{ opacity: 0, scale: 0.95, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 10 }} className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-xs bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-2xl p-6 z-[80] shadow-2xl flex flex-col gap-6">
                     <div className="flex flex-col items-center text-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-emerald-600/10 border border-emerald-500/20 flex items-center justify-center text-emerald-600 shadow-inner">
                           <Wallet size={20} strokeWidth={2} />
                        </div>
                        <div className="space-y-1 px-4">
                           <h3 className="text-lg font-black text-[var(--text-primary)] uppercase tracking-tighter italic leading-none">REQUEST_PAYOUT</h3>
                        </div>
                     </div>
                     <form onSubmit={handlePayoutRequest} className="space-y-5">
                        <input
                           type="number"
                           value={payoutAmount}
                           onChange={(e) => setPayoutAmount(e.target.value)}
                           className="bg-transparent border-b border-[var(--border-subtle)] outline-none text-2xl font-black text-[var(--text-primary)] w-full text-center"
                           placeholder="Enter Amount"
                        />
                        <button type="submit" className="w-full py-2.5 bg-emerald-600 text-white rounded-lg font-black uppercase italic">Authorize</button>
                     </form>
                  </motion.div>
               </>
            )}
         </AnimatePresence>

         <AnimatePresence>
            {showSettlement && (
               <>
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowSettlement(false)} className="fixed inset-0 bg-slate-950/60 backdrop-blur-md z-[100]" />
                  <motion.div initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }} className="fixed bottom-0 left-0 right-0 h-[80vh] bg-white text-slate-900 rounded-t-[3rem] p-10 z-[110] flex flex-col shadow-[0_-20px_50px_rgba(0,0,0,0.5)]">
                     <div className="flex justify-between items-start mb-8">
                        <div className="space-y-1">
                           <h2 className="text-2xl font-black uppercase tracking-tighter italic">Flexigo <span className="text-slate-400">Settlement Node</span></h2>
                        </div>
                        <button onClick={() => setShowSettlement(false)} className="p-3 bg-slate-100 rounded-full hover:bg-slate-200 transition-all">
                           <X size={24} />
                        </button>
                     </div>
                     <div className="flex-1 overflow-y-auto pr-2 space-y-8">
                        <div className="grid grid-cols-2 gap-10">
                           <div>
                              <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400">Gross Subscription Revenue</h4>
                              <p className="text-2xl font-black">₹{totalYield.toLocaleString()}</p>
                           </div>
                           <div>
                              <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400">Franchise Commission</h4>
                              <p className="text-2xl font-black text-emerald-600">₹{platformFee.toLocaleString()}</p>
                           </div>
                        </div>
                        <div className="bg-slate-900 text-white p-8 rounded-3xl">
                           <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-40 mb-1">Total Payout Amount</p>
                           <h3 className="text-4xl font-black tracking-tighter">₹{platformFee.toLocaleString()}</h3>
                        </div>
                        <div className="bg-amber-50 border border-amber-100 p-6 rounded-2xl flex items-start gap-4">
                           <ShieldCheck className="text-amber-500 shrink-0" size={20} />
                           <p className="text-[10px] font-bold text-amber-900 leading-relaxed uppercase tracking-wider">
                              This is an automated system-generated settlement report. Digital audit trail is active for regional compliance verification.
                           </p>
                        </div>
                     </div>
                  </motion.div>
               </>
            )}
         </AnimatePresence>
      </div>
   );
}
