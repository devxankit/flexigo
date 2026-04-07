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
  Zap
} from 'lucide-react';
import AdminStatCard from '../components/AdminStatCard';
import { motion, AnimatePresence } from 'framer-motion';

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
  return (
    <div className="space-y-8 pb-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
         <div className="space-y-1">
            <div className="flex items-center gap-3">
               <div className="w-1 h-6 bg-emerald-600 rounded-full" />
               <h1 className="text-2xl font-bold tracking-tight text-[var(--text-primary)]">
                  Payment <span className="text-emerald-500">Gateway</span>
               </h1>
            </div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-tertiary)] ml-4">
               Transaction Orchestrator • Settlement Control
            </p>
         </div>
         
         <div className="flex items-center gap-2">
            <button className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-[10px] font-bold uppercase tracking-wider hover:bg-emerald-700 transition-all shadow-sm active:scale-95 flex items-center gap-2">
               <RefreshCcw size={14} /> Settlement Sync
            </button>
            <button className="p-2 bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-lg text-[var(--text-tertiary)] hover:text-emerald-400 transition-colors">
               <MoreVertical size={18} />
            </button>
         </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
         <AdminStatCard title="Daily Volume" value="₹12.4L" icon={Zap} color="emerald" subtitle="Gross Transacted" />
         <AdminStatCard title="Success Rate" value="98.2%" icon={CheckCircle2} color="blue" subtitle="Fleet Conversions" />
         <AdminStatCard title="Pending Settlements" value="₹45.2K" icon={Clock} color="amber" subtitle="Awaiting Bank" />
         <AdminStatCard title="Fraud Alerts" value="0" icon={Lock} color="emerald" subtitle="Secure Tunnel" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
         {/* Transaction Ledger */}
         <div className="lg:col-span-2 bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-xl overflow-hidden shadow-sm">
            <div className="p-4 border-b border-[var(--border-subtle)] flex items-center justify-between">
               <h3 className="text-sm font-bold text-[var(--text-primary)] uppercase tracking-wider">Transaction Ledger</h3>
               <div className="flex items-center gap-2">
                  <div className="relative">
                     <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[var(--text-tertiary)]" />
                     <input 
                       type="text" 
                       placeholder="Search Ref ID..." 
                       className="pl-9 pr-4 py-1.5 bg-[var(--bg-tertiary)]/50 border border-[var(--border-subtle)] rounded-lg text-[10px] focus:border-emerald-500 outline-none transition-all"
                     />
                  </div>
               </div>
            </div>
            <div className="overflow-x-auto no-scrollbar">
               <table className="w-full">
                  <thead>
                     <tr className="border-b border-[var(--border-subtle)] bg-[var(--bg-tertiary)]/30">
                        {['Ref ID', 'Initiator', 'Method', 'Amount', 'Status', 'Sync'].map((header) => (
                           <th key={header} className="text-left py-4 text-[10px] font-bold uppercase tracking-widest text-[var(--text-tertiary)] px-4 whitespace-nowrap">{header}</th>
                        ))}
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--border-subtle)]">
                     {mockTransactions.map((txn) => (
                        <tr key={txn.id} className="group/row hover:bg-[var(--bg-tertiary)]/30 transition-colors">
                           <td className="py-4 px-4 font-bold text-[10px] text-[var(--text-tertiary)] uppercase tracking-widest">{txn.id}</td>
                           <td className="py-4 px-4">
                              <div className="flex flex-col">
                                 <span className="text-xs font-bold text-[var(--text-primary)] group-hover:text-emerald-500 transition-colors uppercase tracking-tight">{txn.user}</span>
                              </div>
                           </td>
                           <td className="py-4 px-4">
                              <div className="flex items-center gap-2">
                                 <CreditCard size={12} className="text-[var(--text-tertiary)]" />
                                 <span className="text-[10px] font-bold text-[var(--text-tertiary)] uppercase">{txn.method}</span>
                              </div>
                           </td>
                           <td className="py-4 px-4 text-xs font-bold text-[var(--text-primary)]">{txn.amount}</td>
                           <td className="py-4 px-4">
                              <div className={`inline-flex px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${
                                 txn.status === 'success' ? 'bg-emerald-500/10 text-emerald-500' : 
                                 txn.status === 'pending' ? 'bg-amber-500/10 text-amber-500' : 
                                 'bg-rose-500/10 text-rose-500'
                              }`}>
                                 {txn.status}
                              </div>
                           </td>
                           <td className="py-4 px-4 text-[9px] font-bold text-[var(--text-tertiary)] uppercase whitespace-nowrap">{txn.date}</td>
                        </tr>
                     ))}
                  </tbody>
               </table>
            </div>
         </div>

         {/* Gateway Configuration & Health */}
         <div className="space-y-6">
            <div className="bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-xl p-6 shadow-sm">
               <div className="flex items-center justify-between mb-8 pb-4 border-b border-[var(--border-subtle)]">
                  <h3 className="text-sm font-bold text-[var(--text-primary)] uppercase tracking-wider">Gateway Status</h3>
                  <div className="flex items-center gap-1 text-[9px] font-bold text-emerald-500 uppercase tracking-widest">
                     <CheckCircle2 size={12} /> Live
                  </div>
               </div>

               <div className="space-y-4">
                  {Gateways.map((gw) => (
                     <div key={gw.name} className="p-4 bg-[var(--bg-tertiary)] border border-[var(--border-subtle)] rounded-xl group hover:border-emerald-500/30 transition-all">
                        <div className="flex items-center justify-between mb-3">
                           <div className="flex items-center gap-3">
                              <div className={`w-2 h-2 rounded-full ${gw.status === 'active' ? 'bg-emerald-500 animate-pulse' : 'bg-slate-500'}`} />
                              <span className="text-xs font-bold text-[var(--text-primary)] uppercase tracking-tight">{gw.name}</span>
                           </div>
                           <span className="text-[9px] font-bold text-[var(--text-tertiary)] uppercase tracking-[0.2em]">{gw.type}</span>
                        </div>
                        <div className="flex items-center justify-between text-[10px] font-bold">
                           <div className="flex items-center gap-1 text-[var(--text-tertiary)]">
                              <Clock size={12} /> Latency: <span className={gw.status === 'active' ? 'text-emerald-500' : ''}>{gw.speed}</span>
                           </div>
                           <button className="text-[var(--text-tertiary)] hover:text-emerald-500 transition-colors">
                              <ExternalLink size={12} />
                           </button>
                        </div>
                     </div>
                  ))}
               </div>

               <div className="mt-8 p-4 bg-emerald-600/5 border border-emerald-500/10 rounded-xl space-y-2">
                  <div className="flex items-center gap-2">
                     <Lock size={14} className="text-emerald-600" />
                     <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest">PCI-DSS Compliant</p>
                  </div>
                  <p className="text-[10px] text-[var(--text-tertiary)] font-medium leading-relaxed italic">
                     Unified tunnel encryption active across all mobile and web partner payment nodes.
                  </p>
               </div>
            </div>

            {/* Direct Channel Strip */}
            <div className="p-4 bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-xl space-y-4">
               <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                     <Building2 size={16} className="text-emerald-500" />
                     <span className="text-[10px] font-bold text-[var(--text-primary)] uppercase tracking-wider">Direct Bank Channels</span>
                  </div>
               </div>
               <div className="flex gap-2">
                  <div className="flex-1 p-2 bg-[var(--bg-tertiary)] border border-[var(--border-subtle)] rounded-lg flex flex-col items-center">
                     <span className="text-[8px] font-bold text-[var(--text-tertiary)] uppercase">HDFC NODE</span>
                     <span className="text-[10px] font-bold text-[var(--text-primary)] mt-1">ACTIVE</span>
                  </div>
                  <div className="flex-1 p-2 bg-[var(--bg-tertiary)] border border-[var(--border-subtle)] rounded-lg flex flex-col items-center">
                     <span className="text-[8px] font-bold text-[var(--text-tertiary)] uppercase">ICICI TUNNEL</span>
                     <span className="text-[10px] font-bold text-rose-500 mt-1">LOCKED</span>
                  </div>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
}
