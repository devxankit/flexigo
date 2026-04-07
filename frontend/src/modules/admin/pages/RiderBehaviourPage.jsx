import React, { useState } from 'react';
import { 
  Target, 
  Bell, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  ShieldAlert, 
  ArrowUpRight,
  User,
  Zap,
  CreditCard,
  FileWarning,
  Send,
  Settings
} from 'lucide-react';
import AdminStatCard from '../components/AdminStatCard';
import { motion } from 'framer-motion';

const mockBehaviorAlerts = [
  { id: 'AL-1092', rider: 'Vikram Mehta', type: 'Low Balance', severity: 'critical', due: 'Today', status: 'pending' },
  { id: 'AL-1091', rider: 'Sanya Gupta', type: 'Insurance Expiry', severity: 'medium', due: '2 Days', status: 'notified' },
  { id: 'AL-1090', rider: 'Raj Malhotra', type: 'Pending Payment', severity: 'high', due: 'Yesterday', status: 'pending' },
  { id: 'AL-1089', rider: 'Amit Shah', type: 'Low Balance', severity: 'critical', due: 'Just now', status: 'notified' },
  { id: 'AL-1088', rider: 'Priya Verma', type: 'PUC Expiry', severity: 'low', due: '5 Days', status: 'resolved' },
];

export default function RiderBehaviourPage() {
  return (
    <div className="space-y-8 pb-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
         <div className="space-y-1">
            <div className="flex items-center gap-3">
               <div className="w-1 h-6 bg-emerald-600 rounded-full" />
               <h1 className="text-2xl font-bold tracking-tight text-[var(--text-primary)]">
                  Rider <span className="text-emerald-500">Behaviour</span>
               </h1>
            </div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-tertiary)] ml-4">
               Predictive Alerts • Notification Configuration Hub
            </p>
         </div>
         
         <div className="flex items-center gap-2">
            <button className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-[10px] font-bold uppercase tracking-wider hover:bg-emerald-700 transition-all shadow-sm active:scale-95 flex items-center gap-2">
               <Send size={14} /> Global Push
            </button>
            <button className="p-2 bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-lg text-[var(--text-tertiary)] hover:text-emerald-500 transition-colors">
               <Settings size={18} />
            </button>
         </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
         <AdminStatCard title="Active Alerts" value="142" icon={Bell} color="rose" subtitle="Requires Dispatch" />
         <AdminStatCard title="Low Balance" value="28" icon={Zap} color="amber" subtitle="Wallet Threshold" />
         <AdminStatCard title="Doc Expiry" value="12" icon={FileWarning} color="blue" subtitle="Insurance/PUC" />
         <AdminStatCard title="Response Rate" value="92%" icon={CheckCircle2} color="emerald" subtitle="User Cleanup" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
         {/* Alert Registry */}
         <div className="lg:col-span-2 bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-xl overflow-hidden shadow-sm">
            <div className="p-4 border-b border-[var(--border-subtle)] flex items-center justify-between">
               <h3 className="text-sm font-bold text-[var(--text-primary)] uppercase tracking-wider">Behavior & Status Alerts</h3>
               <div className="flex items-center gap-2">
                  <span className="text-[9px] font-bold text-rose-500 uppercase tracking-widest bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/20 animate-pulse">Live Feed</span>
               </div>
            </div>
            <div className="overflow-x-auto no-scrollbar">
               <table className="w-full">
                  <thead>
                     <tr className="border-b border-[var(--border-subtle)] bg-[var(--bg-tertiary)]/30">
                        {['Alert Ref', 'Rider/Partner', 'Violation Type', 'Severity', 'SLA/Due', 'Status'].map((header) => (
                           <th key={header} className="text-left py-4 text-[10px] font-bold uppercase tracking-widest text-[var(--text-tertiary)] px-4 whitespace-nowrap">{header}</th>
                        ))}
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--border-subtle)]">
                     {mockBehaviorAlerts.map((alert) => (
                        <tr key={alert.id} className="group/row hover:bg-[var(--bg-tertiary)]/30 transition-colors">
                           <td className="py-4 px-4 font-bold text-[10px] text-[var(--text-tertiary)] uppercase tracking-widest">{alert.id}</td>
                           <td className="py-4 px-4">
                              <div className="flex items-center gap-2">
                                 <User size={12} className="text-[var(--text-tertiary)]" />
                                 <span className="text-xs font-bold text-[var(--text-primary)] group-hover:text-emerald-500 transition-colors uppercase tracking-tight">{alert.rider}</span>
                              </div>
                           </td>
                           <td className="py-4 px-4">
                              <div className="flex items-center gap-2">
                                 {alert.type.includes('Balance') ? <Zap size={10} className="text-amber-500" /> : <FileWarning size={10} className="text-blue-500" />}
                                 <span className="text-[10px] font-bold text-[var(--text-tertiary)] uppercase">{alert.type}</span>
                              </div>
                           </td>
                           <td className="py-4 px-4">
                              <span className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded border ${
                                 alert.severity === 'critical' ? 'bg-rose-500/10 text-rose-500 border-rose-500/20 shadow-[0_0_10px_rgba(244,63,94,0.1)]' : 
                                 alert.severity === 'high' ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' :
                                 'bg-blue-500/10 text-blue-500 border-blue-500/20'
                              }`}>
                                 {alert.severity}
                              </span>
                           </td>
                           <td className="py-4 px-4 text-[10px] font-bold text-[var(--text-tertiary)] uppercase whitespace-nowrap">{alert.due}</td>
                           <td className="py-4 px-4">
                              <div className={`inline-flex px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${
                                 alert.status === 'resolved' ? 'bg-emerald-500/10 text-emerald-500' : 
                                 alert.status === 'notified' ? 'bg-blue-500/10 text-blue-500' : 
                                 'bg-amber-500/10 text-amber-500'
                              }`}>
                                 {alert.status}
                              </div>
                           </td>
                        </tr>
                     ))}
                  </tbody>
               </table>
            </div>
         </div>

         {/* Configuration & Reminders Panel */}
         <div className="space-y-6">
            <div className="bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-xl p-6 shadow-sm">
               <div className="flex items-center justify-between mb-8 pb-4 border-b border-[var(--border-subtle)]">
                  <h3 className="text-sm font-bold text-[var(--text-primary)] uppercase tracking-wider">Notice Engine</h3>
                  <div className="flex items-center gap-1 text-[9px] font-bold text-emerald-500 uppercase tracking-widest">
                     <CheckCircle2 size={12} /> Auto-Sync
                  </div>
               </div>

               <div className="space-y-4">
                  {[
                    { label: 'Pending Payments', icon: CreditCard, threshold: '> 24h overdue' },
                    { label: 'Low Balance', icon: Zap, threshold: '< ₹50' },
                    { label: 'Document Expiry', icon: ShieldAlert, threshold: '< 7 days' },
                  ].map((config) => (
                    <div key={config.label} className="p-4 bg-[var(--bg-tertiary)] border border-[var(--border-subtle)] rounded-xl flex items-center justify-between group hover:border-emerald-500/30 transition-all cursor-pointer">
                       <div className="flex items-center gap-3">
                          <div className="p-2 bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-lg text-emerald-500 group-hover:scale-110 transition-transform">
                             <config.icon size={16} />
                          </div>
                          <div>
                             <p className="text-[10px] font-bold text-[var(--text-primary)] uppercase tracking-wider">{config.label}</p>
                             <p className="text-[8px] font-bold text-[var(--text-tertiary)] uppercase tracking-widest mt-1">Trigger: {config.threshold}</p>
                          </div>
                       </div>
                       <div className="w-8 h-4 bg-emerald-600/20 rounded-full flex items-center px-1">
                          <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full ml-auto" />
                       </div>
                    </div>
                  ))}
               </div>

               <div className="mt-8 p-4 bg-emerald-600/5 border border-emerald-500/10 rounded-xl space-y-3">
                  <div className="flex items-center gap-2">
                     <AlertTriangle size={14} className="text-emerald-600" />
                     <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest">Efficiency Protocol</p>
                  </div>
                  <p className="text-[10px] text-[var(--text-tertiary)] font-medium leading-relaxed">
                     Automated reminders reduce payout delays by <span className="text-emerald-500 font-bold">34%</span> on average across the network nodes.
                  </p>
               </div>
            </div>

            {/* Quick Dispatch Strip */}
            <div className="p-4 bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-xl flex items-center justify-between group cursor-pointer hover:border-rose-500/30 transition-all">
               <div className="flex items-center gap-3">
                  <div className="p-2 bg-rose-500/10 text-rose-500 rounded-lg group-hover:rotate-12 transition-transform">
                     <ShieldAlert size={18} />
                  </div>
                  <div>
                     <p className="text-[10px] font-bold text-[var(--text-primary)] uppercase tracking-wider leading-none">Critical Eviction</p>
                     <p className="text-[9px] font-bold text-[var(--text-tertiary)] uppercase tracking-widest mt-1">Sync Outstanding Debts</p>
                  </div>
               </div>
               <ArrowUpRight size={16} className="text-[var(--text-tertiary)] group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            </div>
         </div>
      </div>
    </div>
  );
}
