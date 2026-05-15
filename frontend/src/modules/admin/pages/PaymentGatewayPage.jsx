import React, { useState } from 'react';
import { 
  CreditCard, 
  ExternalLink, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  MoreVertical, 
  Search, 
  ArrowUpRight,
  Wallet,
  Building2,
  Lock,
  RefreshCcw,
  Zap,
  ShieldCheck,
  Activity
} from 'lucide-react';
import AdminStatCard from '../components/AdminStatCard';
import OpsFilter from '../components/OpsFilter';
import { motion, AnimatePresence } from 'framer-motion';
import { useAdminDataStore } from '../store/adminDataStore';

const Gateways = [
  { name: 'RazorPay', status: 'active', speed: '99ms', type: 'Primary' },
  { name: 'PayU India', status: 'active', speed: '142ms', type: 'Secondary' },
  { name: 'Stripe', status: 'inactive', speed: '---', type: 'Global' },
];

export default function PaymentGatewayPage() {
  const { financeTransactions, financeStats, fetchFinanceData } = useAdminDataStore();
  const [activeFilters, setActiveFilters] = React.useState({ range: 'Last 7 Days' });
  const [searchQuery, setSearchQuery] = useState('');

  React.useEffect(() => {
    fetchFinanceData(activeFilters);
  }, []);

  const handleFilterChange = (newFilters) => {
    setActiveFilters(newFilters);
    fetchFinanceData(newFilters);
    console.log('Payment Gateway Sync:', newFilters);
  };

  const filteredTransactions = financeTransactions.filter(txn => 
    (txn.id || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (txn.user || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
         <div className="space-y-0.5">
            <div className="flex items-center gap-2">
               <div className="w-1 h-5 bg-emerald-600 rounded-full" />
               <h1 className="text-xl font-black tracking-tighter text-[var(--text-primary)] uppercase italic">
                  Payment <span className="text-emerald-500">Gateway</span>
               </h1>
            </div>
            <p className="text-[8px] font-black uppercase tracking-[0.2em] text-[var(--text-tertiary)] ml-3">
               Transaction Orchestrator & Settlement Control
            </p>
         </div>
         
         <div className="flex items-center gap-2">
            <OpsFilter onFilterChange={handleFilterChange} />
         </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
         <AdminStatCard title="Daily Volume" value={financeStats.dailyVolume} icon={Zap} color="emerald" subtitle="Gross Transacted" />
         <AdminStatCard title="Success Rate" value={financeStats.successRate} icon={CheckCircle2} color="blue" subtitle="Fleet Conversions" />
         <AdminStatCard title="Pending" value={financeStats.pending} icon={Clock} color="amber" subtitle="Awaiting Bank" />
      </div>

      {/* Transaction Ledger */}
      <div className="bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-2xl overflow-hidden shadow-sm">
         <div className="px-6 py-3 border-b border-[var(--border-subtle)] flex items-center justify-between bg-[var(--bg-tertiary)]/10">
            <h3 className="text-[11px] font-black text-[var(--text-primary)] uppercase tracking-wider leading-none italic">Transaction Payload Registry</h3>
            <div className="relative group">
               <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3 h-3 text-[var(--text-tertiary)] group-focus-within:text-emerald-500 transition-colors" />
               <input 
                 type="text" 
                 value={searchQuery}
                 onChange={(e) => setSearchQuery(e.target.value)}
                 placeholder="Search Ref ID..." 
                 className="pl-8 pr-3 py-1.5 bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-lg text-[9px] font-black tracking-widest focus:ring-1 focus:ring-emerald-500/20 outline-none transition-all w-32 text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)]/50 italic"
               />
            </div>
         </div>
         <div className="overflow-x-auto no-scrollbar">
            <table className="w-full">
               <thead>
                     <tr className="border-b border-[var(--border-subtle)] bg-[var(--bg-tertiary)]/5">
                     {['Ref Identity', 'Initiator', 'Method', 'Amount', 'Status', 'Sync'].map((header) => (
                        <th key={header} className="text-left py-3 px-4 text-xs font-semibold text-[var(--text-secondary)] whitespace-nowrap">{header}</th>
                     ))}
                  </tr>
               </thead>
               <tbody className="divide-y divide-[var(--border-subtle)]">
                  {filteredTransactions.map((txn) => (
                     <tr key={txn.id} className="group/row hover:bg-[var(--bg-tertiary)]/10 transition-colors text-sm">
                        <td className="py-2 px-4 font-medium  text-[var(--text-tertiary)]">{txn.id}</td>
                        <td className="py-2 px-4">
                           <span className="font-medium text-[var(--text-primary)] group-hover:text-emerald-500 transition-colors">{txn.user}</span>
                        </td>
                        <td className="py-2 px-4">
                           <div className="flex items-center gap-1.5">
                              <CreditCard size={10} className="text-[var(--text-tertiary)]/50" />
                              <span className="font-medium text-[var(--text-tertiary)]">{txn.method}</span>
                           </div>
                        </td>
                        <td className="py-2 px-4 font-medium text-[var(--text-primary)]">{txn.val}</td>
                        <td className="py-2 px-4">
                           <div className={`inline-flex px-1.5 py-0.5 rounded  font-medium   border  ${
                              txn.status === 'success' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/10' : 
                              txn.status === 'pending' ? 'bg-amber-500/10 text-amber-500 border-amber-500/10' : 
                              'bg-rose-500/10 text-rose-500 border-rose-500/10'
                           }`}>
                              {txn.status}
                           </div>
                        </td>
                        <td className="py-2 px-4  font-medium text-[var(--text-tertiary)]     whitespace-nowrap">{new Date(txn.date).toLocaleTimeString()}</td>
                     </tr>
                  ))}
               </tbody>
            </table>
         </div>
      </div>
    </div>
  );
}
