import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Wallet, 
  TrendingUp, 
  ArrowUpRight, 
  ArrowDownRight, 
  CreditCard, 
  History, 
  Download, 
  Plus, 
  ChevronRight,
  Filter,
  PieChart,
  BarChart3,
  Calendar,
  CheckCircle2,
  Clock,
  ArrowRight,
  X
} from 'lucide-react';
import { useFranchiseWalletStore } from '../store/walletStore';
import GlassTable from '../components/GlassTable';
import StatusBadge from '../components/StatusBadge';

export default function WalletFinancials() {
  const { balance, ledger = [], requestPayout } = useFranchiseWalletStore();
  const payoutRequests = ledger.filter(t => t.type === 'Payout');
  const [isPayoutModalOpen, setPayoutModalOpen] = useState(false);
  const [payoutAmount, setPayoutAmount] = useState('');

  const handlePayoutRequest = (e) => {
    e.preventDefault();
    const amount = parseFloat(payoutAmount);
    if (amount > 0 && amount <= balance) {
      requestPayout(amount);
      setPayoutModalOpen(false);
      setPayoutAmount('');
    }
  };

  const columns = [
    {
      header: 'Reference ID',
      accessor: 'id',
      render: (row) => <span className="text-[10px] font-bold font-mono text-[var(--text-secondary)] uppercase tracking-wider">{row.id}</span>
    },
    {
      header: 'Operation / Source',
      accessor: 'type',
      render: (row) => (
        <div className="flex items-center gap-3">
           <div className={`p-2 rounded-lg border shadow-sm ${
             row.amount > 0 ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-600' : 'bg-rose-500/10 border-rose-500/20 text-rose-600'
           }`}>
             {row.amount > 0 ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
           </div>
           <div className="flex flex-col">
              <span className="text-xs font-bold text-[var(--text-primary)] uppercase tracking-tight">{row.type}</span>
              {row.subscriber && <span className="text-[9px] font-bold text-[var(--text-secondary)] truncate uppercase">Subscriber: {row.subscriber}</span>}
           </div>
        </div>
      )
    },
    {
      header: 'Timestamp',
      accessor: 'date',
      render: (row) => (
        <div className="flex flex-col">
           <span className="text-xs font-bold text-[var(--text-secondary)]">{new Date(row.date).toLocaleDateString()}</span>
           <span className="text-[10px] font-bold text-[var(--text-secondary)] uppercase">{new Date(row.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
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
        <span className={`text-sm font-black tracking-tight ${row.amount > 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
           {row.amount > 0 ? '+' : ''}₹{Math.abs(row.amount).toLocaleString('en-IN')}
        </span>
      )
    }
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <div className="w-1 h-6 bg-emerald-500 rounded-full" />
            <h1 className="text-2xl font-bold tracking-tight text-[var(--text-primary)]">
              Financial <span className="text-emerald-500">Ledger</span>
            </h1>
          </div>
          <p className="text-[10px] font-bold uppercase tracking-wider ml-4 text-[var(--text-tertiary)]">
             Operational Revenue • Commission Tracking Console
          </p>
        </div>

        <div className="flex items-center gap-3">
           <button className="p-2.5 bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-lg text-[var(--text-tertiary)] hover:text-[var(--text-primary)] transition-all shadow-sm">
              <Download size={18} />
           </button>
           <button 
             onClick={() => setPayoutModalOpen(true)}
             className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-xs font-bold uppercase tracking-wider hover:bg-emerald-700 transition-all shadow-sm flex items-center gap-2 active:scale-95"
           >
              Initialize Settlement <ArrowRight size={16} strokeWidth={2.5} />
           </button>
        </div>
      </div>

      {/* Financial Overview Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Wallet Balance Card */}
        <div className="lg:col-span-2 relative group p-8 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] shadow-sm flex flex-col justify-between min-h-[300px] overflow-hidden">
           <div className="absolute top-0 right-0 p-8 opacity-[0.03] scale-[2.5] rotate-12 pointer-events-none">
              <Wallet size={120} className="text-emerald-500" />
           </div>
           
           <div className="space-y-1 relative z-10">
              <div className="inline-flex items-center gap-2 px-2.5 py-1 bg-emerald-500/10 rounded-md border border-emerald-500/20">
                 <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                 <span className="text-[9px] font-bold uppercase tracking-widest text-emerald-600">Settlement Balance</span>
              </div>
              <div className="flex items-baseline gap-4 mt-6">
                 <span className="text-[var(--text-tertiary)] text-2xl font-bold opacity-40 italic">₹</span>
                 <h2 className="text-7xl font-bold tracking-tight text-[var(--text-primary)]">
                   {balance.toLocaleString('en-IN')}
                 </h2>
                 <div className="flex flex-col gap-0.5 mb-2">
                    <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider flex items-center gap-1">
                       <TrendingUp size={12} />
                       +12.4% <span className="opacity-60 text-[var(--text-tertiary)] tracking-normal italic">periodic surge</span>
                    </span>
                    <span className="text-[9px] font-medium text-[var(--text-tertiary)] uppercase opacity-60">Verified 2 mins ago</span>
                 </div>
              </div>
           </div>

           <div className="grid grid-cols-3 gap-6 pt-8 border-t border-[var(--border-subtle)] relative z-10">
              <div className="space-y-1">
                 <p className="text-[9px] font-bold uppercase tracking-wider text-[var(--text-tertiary)]">Gross Ops Revenue</p>
                 <p className="text-xl font-bold text-[var(--text-primary)]">₹1.24L</p>
                 <div className="w-8 h-1 bg-emerald-500/20 rounded-full" />
              </div>
              <div className="space-y-1">
                 <p className="text-[9px] font-bold uppercase tracking-wider text-[var(--text-tertiary)]">Node Platform Fee</p>
                 <p className="text-xl font-bold text-rose-500">₹8.40K</p>
                 <div className="w-8 h-1 bg-rose-500/20 rounded-full" />
              </div>
              <div className="space-y-1">
                 <p className="text-[9px] font-bold uppercase tracking-wider text-[var(--text-tertiary)]">Cycle Payouts</p>
                 <p className="text-xl font-bold text-blue-500">₹45.0K</p>
                 <div className="w-8 h-1 bg-blue-500/20 rounded-full" />
              </div>
           </div>
        </div>

        {/* Payout History Terminal */}
        <div className="flex flex-col rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] shadow-sm p-6 overflow-hidden max-h-[300px] lg:max-h-full">
           <div className="space-y-1 mb-6">
              <h3 className="text-sm font-bold uppercase tracking-wider text-[var(--text-primary)] leading-none">Payout History</h3>
              <p className="text-[10px] font-medium text-[var(--text-tertiary)] uppercase tracking-wide">Withdrawal Node Logs</p>
           </div>

           <div className="flex-1 overflow-y-auto no-scrollbar space-y-3 pr-1">
              {payoutRequests.length > 0 ? payoutRequests.map((req, i) => (
                <div key={i} className="p-4 rounded-lg bg-[var(--bg-tertiary)]/30 border border-[var(--border-subtle)] group hover:border-emerald-500/20 transition-all">
                   <div className="flex items-center justify-between mb-2">
                       <span className="text-sm font-bold text-[var(--text-primary)] tracking-tight">₹{req.amount.toLocaleString('en-IN')}</span>
                       <StatusBadge status={req.status} className="scale-[0.7] origin-right" />
                   </div>
                   <div className="flex items-center gap-3 text-[var(--text-tertiary)]">
                      <div className="flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-wider">
                         <Calendar size={12} strokeWidth={2.5} />
                         {req.date}
                      </div>
                      <div className="w-1 h-1 rounded-full bg-[var(--border-subtle)]" />
                      <div className="text-[9px] font-bold tracking-tight uppercase italic truncate">A/C: **** 4821</div>
                   </div>
                </div>
              )) : (
                <div className="py-12 flex flex-col items-center justify-center text-center opacity-30 gap-3">
                   <History size={24} strokeWidth={1.5} />
                   <span className="text-[10px] font-bold uppercase tracking-widest leading-none">No Payout Records Found</span>
                </div>
              )}
           </div>
           
           <div className="mt-6 pt-6 border-t border-[var(--border-subtle)]">
              <div className="flex items-center justify-between bg-emerald-600/5 p-4 rounded-lg border border-emerald-500/10 group">
                 <div className="space-y-0.5">
                    <p className="text-[9px] font-bold uppercase tracking-widest text-emerald-600 leading-none">Next Hub Cycle</p>
                    <p className="text-[11px] font-bold text-[var(--text-primary)] uppercase tracking-tight italic mt-1">Mon, April 06</p>
                 </div>
                 <div className="w-8 h-8 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-subtle)] flex items-center justify-center text-emerald-600 shadow-sm">
                    <Clock size={16} strokeWidth={2.5} />
                 </div>
              </div>
           </div>
        </div>

      </div>

      {/* Transaction Records */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
           <div className="space-y-0.5">
              <h3 className="text-sm font-bold uppercase tracking-wider text-[var(--text-primary)]">Journal Log</h3>
              <p className="text-[10px] font-medium text-[var(--text-tertiary)] uppercase italic tracking-wide">Operational settlement and commission accounting</p>
           </div>
           <div className="flex items-center gap-3">
              <div className="flex bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-lg p-0.5 shadow-sm">
                 <button className="px-3 py-1 rounded-md text-[9px] font-bold uppercase tracking-wider bg-emerald-600 text-white shadow-sm">All Records</button>
                 <button className="px-3 py-1 rounded-md text-[9px] font-bold uppercase tracking-wider text-[var(--text-tertiary)] hover:text-[var(--text-primary)] transition-colors">Yields</button>
              </div>
              <button className="p-2 bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-lg text-[var(--text-tertiary)] hover:text-emerald-500 shadow-sm transition-all">
                <Filter size={16} />
              </button>
           </div>
        </div>

        <GlassTable columns={columns} data={ledger} emptyMessage="No transaction logs available for current operational period" />
      </div>

      {/* Payout Request Modal - Professional B2B */}
      <AnimatePresence>
        {isPayoutModalOpen && (
          <>
            <motion.div 
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               exit={{ opacity: 0 }}
               onClick={() => setPayoutModalOpen(false)}
               className="fixed inset-0 bg-slate-950/40 backdrop-blur-[2px] z-[70]"
            />
            <motion.div 
               initial={{ opacity: 0, scale: 0.95, y: 10 }}
               animate={{ opacity: 1, scale: 1, y: 0 }}
               exit={{ opacity: 0, scale: 0.95, y: 10 }}
               className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-sm bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-xl p-8 z-[80] shadow-2xl flex flex-col gap-6"
            >
               <div className="flex flex-col items-center text-center gap-5">
                  <div className="w-16 h-16 rounded-xl bg-emerald-600/10 border border-emerald-500/20 flex items-center justify-center text-emerald-600 shadow-sm">
                     <Wallet size={32} strokeWidth={1.5} />
                  </div>
                  <div className="space-y-1 px-4">
                     <h3 className="text-xl font-bold text-[var(--text-primary)] uppercase tracking-tight">Settlement Request</h3>
                     <p className="text-[10px] font-medium text-[var(--text-tertiary)] uppercase leading-relaxed tracking-wider">
                        Transfers initiated to Hub Linked Account • Cycle: <span className="text-emerald-600 font-bold underline decoration-emerald-500/30 underline-offset-2">48H Batch</span>
                     </p>
                  </div>
               </div>

               <form onSubmit={handlePayoutRequest} className="space-y-6">
                  <div className="space-y-2 border-b border-[var(--border-subtle)] pb-6">
                     <div className="flex justify-between items-center">
                        <label className="text-[9px] font-bold uppercase tracking-widest text-[var(--text-tertiary)]">Batch Load Amount</label>
                        <span className="text-[9px] font-bold text-emerald-600 uppercase tracking-widest">Max: ₹{balance.toLocaleString()}</span>
                     </div>
                     <div className="flex items-center gap-3">
                        <span className="text-2xl font-bold text-emerald-600 opacity-50 italic">₹</span>
                        <input 
                           autoFocus
                           required
                           type="number" 
                           value={payoutAmount}
                           onChange={(e) => setPayoutAmount(e.target.value)}
                           className="bg-transparent border-none outline-none text-5xl font-bold text-[var(--text-primary)] w-full placeholder:text-[var(--text-tertiary)]/20 tracking-tighter"
                           placeholder="0.00"
                        />
                     </div>
                  </div>

                  <div className="p-4 rounded-lg bg-[var(--bg-tertiary)]/20 border border-[var(--border-subtle)] space-y-2 text-[9px] font-bold uppercase tracking-widest text-[var(--text-tertiary)]">
                     <div className="flex items-center justify-between">
                        <span>Registry Node</span>
                        <span className="text-[var(--text-secondary)]">KORAMANGALA_HUB_01</span>
                     </div>
                     <div className="flex items-center justify-between">
                        <span>Protocol Surcharge</span>
                        <span className="text-emerald-600">ZERO_FEE (PROMO)</span>
                     </div>
                  </div>

                  <div className="flex gap-3">
                     <button 
                        type="button"
                        onClick={() => setPayoutModalOpen(false)}
                        className="flex-1 py-2.5 rounded-lg bg-[var(--bg-tertiary)] border border-[var(--border-subtle)] text-[10px] font-bold uppercase tracking-widest text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-emerald-500/30 transition-all shadow-sm"
                     >
                        Abort
                     </button>
                     <button 
                        type="submit"
                        className="flex-1 py-2.5 rounded-lg bg-emerald-600 text-white text-[10px] font-bold uppercase tracking-widest hover:bg-emerald-700 shadow-lg active:scale-95 transition-all shadow-emerald-900/20"
                     >
                        Authorize
                     </button>
                  </div>
               </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
