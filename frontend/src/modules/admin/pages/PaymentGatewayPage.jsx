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
import { motion, AnimatePresence } from 'framer-motion';
import { useAdminDataStore } from '../store/adminDataStore';

const mockTransactions = [
  { id: 'TXN-001', amount: '₹12,400', method: 'UPI (RazorPay)', status: 'success', date: '2m ago', user: 'Rahul @ Franchise' },
  { id: 'TXN-002', amount: '₹850', method: 'Card (PayU)', status: 'pending', date: '15m ago', user: 'Zeba @ Rider' },
  { id: 'TXN-003', amount: '₹4,200', method: 'Bank Transfer', status: 'success', date: '1h ago', user: 'Mehta Logistics' },
  { id: 'TXN-004', amount: '₹75,000', method: 'UPI (RazorPay)', status: 'failed', date: '3h ago', user: 'Koramangala Hub' },
];

const Gateways = [
  { name: 'RazorPay', status: 'active', speed: '99ms', type: 'Primary' },
  { name: 'PayU India', status: 'active', speed: '142ms', type: 'Secondary' },
  { name: 'Stripe', status: 'inactive', speed: '---', type: 'Global' },
];

export default function PaymentGatewayPage() {
  const { financeTransactions, financeStats, fetchFinanceData } = useAdminDataStore();

  React.useEffect(() => {
    fetchFinanceData();
  }, []);

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
            <button 
               onClick={fetchFinanceData}
               className="px-3 py-1.5 bg-emerald-600 text-white rounded-lg text-[9px] font-black uppercase tracking-widest hover:bg-emerald-700 transition-all shadow-md active:scale-95 flex items-center gap-1.5"
            >
               <RefreshCcw size={12} /> Settlement Sync
            </button>
            <button className="p-1.5 bg-[var(--bg-tertiary)]/50 border border-[var(--border-subtle)] rounded-lg text-[var(--text-tertiary)] hover:text-emerald-500 transition-all">
               <MoreVertical size={14} />
            </button>
         </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
         <AdminStatCard title="Daily Volume" value={financeStats.dailyVolume} icon={Zap} color="emerald" subtitle="Gross Transacted" />
         <AdminStatCard title="Success Rate" value={financeStats.successRate} icon={CheckCircle2} color="blue" subtitle="Fleet Conversions" />
         <AdminStatCard title="Pending" value={financeStats.pending} icon={Clock} color="amber" subtitle="Awaiting Bank" />
         <AdminStatCard title="Fraud Guard" value="Secure" icon={Lock} color="emerald" subtitle="Secure Tunnel" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
         {/* Transaction Ledger */}
         <div className="lg:col-span-2 bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-2xl overflow-hidden shadow-sm">
            <div className="px-6 py-3 border-b border-[var(--border-subtle)] flex items-center justify-between bg-[var(--bg-tertiary)]/10">
               <h3 className="text-[11px] font-black text-[var(--text-primary)] uppercase tracking-wider leading-none italic">Transaction Payload Registry</h3>
               <div className="relative group">
                  <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3 h-3 text-[var(--text-tertiary)] group-focus-within:text-emerald-500 transition-colors" />
                  <input 
                    type="text" 
                    placeholder="Search Ref ID..." 
                    className="pl-8 pr-3 py-1.5 bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-lg text-[9px] font-black uppercase tracking-widest focus:ring-1 focus:ring-emerald-500/20 outline-none transition-all w-32 text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)]/50 italic"
                  />
               </div>
            </div>
            <div className="overflow-x-auto no-scrollbar">
               <table className="w-full">
                  <thead>
                     <tr className="border-b border-[var(--border-subtle)] bg-[var(--bg-tertiary)]/20">
                        {['Ref Identity', 'Initiator', 'Method', 'Amount', 'Status', 'Sync'].map((header) => (
                           <th key={header} className="text-left py-2.5 px-6 text-[8px] font-black uppercase tracking-widest text-[var(--text-tertiary)] whitespace-nowrap">{header}</th>
                        ))}
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--border-subtle)]">
                     {financeTransactions.map((txn) => (
                        <tr key={txn.id} className="group/row hover:bg-[var(--bg-tertiary)]/20 transition-colors text-[10px]">
                           <td className="py-2.5 px-6 font-black text-[7px] text-[var(--text-tertiary)] uppercase tracking-widest leading-none italic">{txn.id}</td>
                           <td className="py-2.5 px-6">
                              <span className="font-black text-[var(--text-primary)] group-hover:text-emerald-500 transition-colors uppercase tracking-tight italic leading-none">{txn.user}</span>
                           </td>
                           <td className="py-2.5 px-6">
                              <div className="flex items-center gap-1.5">
                                 <CreditCard size={10} className="text-[var(--text-tertiary)]/50" />
                                 <span className="text-[9px] font-black text-[var(--text-tertiary)] uppercase leading-none italic">{txn.method}</span>
                              </div>
                           </td>
                           <td className="py-2.5 px-6 font-black text-[var(--text-primary)] italic leading-none">{txn.val}</td>
                           <td className="py-2.5 px-6">
                              <div className={`inline-flex px-1.5 py-0.5 rounded text-[7px] font-black uppercase tracking-widest border leading-none ${
                                 txn.status === 'success' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/10' : 
                                 txn.status === 'pending' ? 'bg-amber-500/10 text-amber-500 border-amber-500/10' : 
                                 'bg-rose-500/10 text-rose-500 border-rose-500/10'
                              }`}>
                                 {txn.status}
                              </div>
                           </td>
                           <td className="py-2.5 px-6 text-[7px] font-black text-[var(--text-tertiary)] uppercase italic tracking-widest leading-none whitespace-nowrap">{new Date(txn.date).toLocaleTimeString()}</td>
                        </tr>
                     ))}
                  </tbody>
               </table>
            </div>
         </div>

         {/* Gateway Configuration & Health */}
         <div className="space-y-4">
            <div className="bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-2xl p-5 shadow-sm border-t-4 border-t-emerald-600">
               <div className="flex items-center justify-between mb-6 pb-2 border-b border-[var(--border-subtle)]">
                  <h3 className="text-[11px] font-black text-[var(--text-primary)] uppercase tracking-widest leading-none italic">Gateway Status</h3>
                  <div className="flex items-center gap-1 text-[8px] font-black text-emerald-500 uppercase tracking-widest animate-pulse italic leading-none">
                     <CheckCircle2 size={10} /> Live
                  </div>
               </div>

               <div className="space-y-3">
                  {Gateways.map((gw) => (
                     <div key={gw.name} className="p-3 bg-[var(--bg-tertiary)]/50 border border-[var(--border-subtle)] rounded-xl group hover:border-emerald-500/30 transition-all cursor-pointer">
                        <div className="flex items-center justify-between mb-2">
                           <div className="flex items-center gap-1.5">
                              <div className={`w-1.5 h-1.5 rounded-full ${gw.status === 'active' ? 'bg-emerald-500 animate-pulse shadow-[0_0_5px_#10b981]' : 'bg-slate-500'}`} />
                              <span className="text-[10px] font-black text-[var(--text-primary)] uppercase tracking-tight italic leading-none">{gw.name}</span>
                           </div>
                           <span className="text-[7px] font-black text-[var(--text-tertiary)] uppercase tracking-widest italic leading-none">{gw.type}</span>
                        </div>
                        <div className="flex items-center justify-between text-[9px] font-black italic">
                           <div className="flex items-center gap-1 text-[var(--text-tertiary)]/50 leading-none">
                              <Clock size={10} /> <span className="text-[8px] uppercase tracking-widest font-black">Latency:</span> <span className={gw.status === 'active' ? 'text-emerald-500' : ''}>{gw.speed}</span>
                           </div>
                           <ExternalLink size={10} className="text-[var(--text-tertiary)]/30 group-hover:text-emerald-500 transition-all" />
                        </div>
                     </div>
                  ))}
               </div>

               <div className="mt-6 p-3 bg-emerald-600/5 border border-emerald-500/10 rounded-xl space-y-1.5 relative overflow-hidden group">
                  <div className="absolute right-0 top-0 p-2 opacity-[0.05] pointer-events-none group-hover:scale-110 transition-transform">
                     <Lock size={40} />
                  </div>
                  <div className="flex items-center gap-1.5">
                     <ShieldCheck size={10} className="text-emerald-600" />
                     <p className="text-[9px] font-black text-emerald-600 uppercase tracking-widest italic leading-none">PCI-DSS Compliant</p>
                  </div>
                  <p className="text-[8.5px] text-[var(--text-tertiary)] font-bold leading-relaxed uppercase tracking-wider italic">
                     Unified tunnel encryption active across all partner nodes.
                  </p>
               </div>
            </div>

            {/* Direct Channel Strip */}
            <div className="p-4 bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-2xl flex flex-col gap-3 shadow-sm border-l-4 border-l-emerald-600">
               <div className="flex items-center gap-2">
                  <Building2 size={16} className="text-emerald-500" />
                  <span className="text-[10px] font-black text-[var(--text-primary)] uppercase tracking-widest italic">Bank Channels</span>
               </div>
               <div className="flex gap-2">
                  {['HDFC NODE', 'ICICI TUNNEL'].map((bank, idx) => (
                    <div key={bank} className="flex-1 p-2 bg-[var(--bg-tertiary)]/50 border border-[var(--border-subtle)] rounded-xl flex flex-col items-center group cursor-pointer hover:border-emerald-500/30 transition-all shadow-inner">
                       <span className="text-[7px] font-black text-[var(--text-tertiary)] uppercase tracking-widest italic leading-none">{bank}</span>
                       <span className={`text-[9px] font-black mt-1.5 italic leading-none ${idx === 0 ? 'text-emerald-500' : 'text-rose-500'}`}>{idx === 0 ? 'ACTIVE' : 'LOCKED'}</span>
                    </div>
                  ))}
               </div>
            </div>
         </div>
      </div>
    </div>
  );
}
