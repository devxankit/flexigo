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
  Settings,
  Activity
} from 'lucide-react';
import AdminStatCard from '../components/AdminStatCard';
import { motion } from 'framer-motion';

import { useAdminDataStore } from '../store/adminDataStore';

export default function RiderBehaviourPage() {
  const { riderBehaviour, fetchRiderBehaviour } = useAdminDataStore();

  React.useEffect(() => {
    fetchRiderBehaviour();
  }, []);
  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
         <div className="space-y-0.5">
            <div className="flex items-center gap-2">
               <div className="w-1 h-5 bg-emerald-600 rounded-full" />
               <h1 className="text-xl font-black tracking-tighter text-[var(--text-primary)] uppercase italic">
                  Behaviour <span className="text-emerald-500">Registry</span>
               </h1>
            </div>
            <p className="text-[8px] font-black uppercase tracking-[0.2em] text-[var(--text-tertiary)] ml-3">
               Predictive Alerts & Notification Control
            </p>
         </div>
         
         <div className="flex items-center gap-2">
            <button className="px-3 py-1.5 bg-emerald-600 text-white rounded-lg text-[9px] font-black uppercase tracking-widest hover:bg-emerald-700 transition-all shadow-md active:scale-95 flex items-center gap-1.5">
               <Send size={12} /> Global Push
            </button>
            <button className="p-1.5 bg-[var(--bg-tertiary)]/50 border border-[var(--border-subtle)] rounded-lg text-[var(--text-tertiary)] hover:text-emerald-500 transition-all">
               <Settings size={14} />
            </button>
         </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
         <AdminStatCard title="Active Alerts" value={riderBehaviour.activeAlerts} icon={Bell} color="rose" subtitle="Requires Dispatch" />
         <AdminStatCard title="Low Balance" value={riderBehaviour.lowBalance} icon={Zap} color="amber" subtitle="Wallet Threshold" />
         <AdminStatCard title="Doc Expiry" value={riderBehaviour.docExpiry} icon={FileWarning} color="blue" subtitle="Insurance Delta" />
         <AdminStatCard title="Cleanup" value={riderBehaviour.cleanup} icon={Activity} color="emerald" subtitle="User Response" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
         {/* Alert Registry */}
         <div className="lg:col-span-2 bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-2xl overflow-hidden shadow-sm">
            <div className="px-6 py-3 border-b border-[var(--border-subtle)] flex items-center justify-between bg-[var(--bg-tertiary)]/10">
               <h3 className="text-[11px] font-black text-[var(--text-primary)] uppercase tracking-wider leading-none italic">Behaviour Violation stream</h3>
               <span className="text-[7.5px] font-black text-rose-500 uppercase tracking-widest bg-rose-600/5 px-2 py-0.5 rounded border border-rose-500/10 animate-pulse italic">Live Feed</span>
            </div>
            <div className="overflow-x-auto no-scrollbar">
               <table className="w-full">
                  <thead>
                     <tr className="border-b border-[var(--border-subtle)] bg-[var(--bg-tertiary)]/20">
                        {['Alert Ref', 'Persona', 'Violation Type', 'Severity', 'Due Date', 'Status'].map((header) => (
                           <th key={header} className="text-left py-2.5 px-6 text-[8px] font-black uppercase tracking-widest text-[var(--text-tertiary)] whitespace-nowrap">{header}</th>
                        ))}
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--border-subtle)]">
                     {(riderBehaviour.behaviourAlerts || []).map((alert) => (
                        <tr key={alert.id} className="group/row hover:bg-[var(--bg-tertiary)]/20 transition-colors text-[10px]">
                           <td className="py-2.5 px-6 font-black text-[7px] text-[var(--text-tertiary)] uppercase tracking-widest leading-none italic">{alert.id}</td>
                           <td className="py-2.5 px-6">
                              <div className="flex items-center gap-2 leading-none">
                                 <User size={10} className="text-[var(--text-tertiary)]/50" />
                                 <span className="font-black text-[var(--text-primary)] group-hover:text-emerald-500 transition-colors uppercase tracking-tight italic leading-none">{alert.rider}</span>
                              </div>
                           </td>
                           <td className="py-2.5 px-6">
                              <div className="flex items-center gap-1.5 leading-none">
                                 {alert.type.includes('Balance') ? <Zap size={8} className="text-amber-500" /> : <FileWarning size={8} className="text-blue-500" />}
                                 <span className="text-[9px] font-black text-[var(--text-tertiary)] uppercase leading-none italic">{alert.type}</span>
                              </div>
                           </td>
                           <td className="py-2.5 px-6">
                              <span className={`text-[7px] font-black uppercase px-1.5 py-0.5 rounded border leading-none ${
                                 alert.severity === 'critical' ? 'bg-rose-500/10 text-rose-500 border-rose-500/10' : 
                                 alert.severity === 'high' ? 'bg-amber-500/10 text-amber-500 border-amber-500/10' :
                                 'bg-blue-500/10 text-blue-500 border-blue-500/10'
                              }`}>
                                 {alert.severity}
                              </span>
                           </td>
                           <td className="py-2.5 px-6 text-[9px] font-black text-[var(--text-tertiary)] uppercase italic tracking-widest leading-none whitespace-nowrap">{alert.due}</td>
                           <td className="py-2.5 px-6">
                              <div className={`inline-flex px-1.5 py-0.5 rounded text-[7px] font-black uppercase tracking-widest border leading-none ${
                                 alert.status === 'resolved' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/10' : 
                                 alert.status === 'notified' ? 'bg-blue-500/10 text-blue-500 border-blue-500/10' : 
                                 'bg-amber-500/10 text-amber-500 border-amber-500/10'
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
         <div className="space-y-4">
            <div className="bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-2xl p-5 shadow-sm border-t-4 border-t-emerald-600">
               <div className="flex items-center justify-between mb-6 pb-2 border-b border-[var(--border-subtle)]">
                  <h3 className="text-[11px] font-black text-[var(--text-primary)] uppercase tracking-widest italic leading-none">Notice Engine</h3>
                  <div className="flex items-center gap-1 text-[8px] font-black text-emerald-500 uppercase tracking-widest italic animate-pulse leading-none">
                     <CheckCircle2 size={10} /> Auto-Sync
                  </div>
               </div>

               <div className="space-y-3">
                  {[
                    { label: 'Pending Payments', icon: CreditCard, threshold: '> 24h overdue' },
                    { label: 'Low Balance', icon: Zap, threshold: '< ₹50' },
                    { label: 'Doc Expiry', icon: ShieldAlert, threshold: '< 7 days' },
                  ].map((config) => (
                    <div key={config.label} className="p-3 bg-[var(--bg-tertiary)]/50 border border-[var(--border-subtle)] rounded-xl flex items-center justify-between group hover:border-emerald-500/30 transition-all cursor-pointer">
                       <div className="flex items-center gap-2.5">
                          <div className="p-1.5 bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-lg text-emerald-500 group-hover:scale-110 transition-transform">
                             <config.icon size={12} />
                          </div>
                          <div>
                             <p className="text-[9px] font-black text-[var(--text-primary)] uppercase tracking-wider leading-none italic">{config.label}</p>
                             <p className="text-[7px] font-black text-[var(--text-tertiary)] uppercase mt-1 leading-none italic">Trigger: {config.threshold}</p>
                          </div>
                       </div>
                       <div className="w-6 h-3 bg-emerald-600/20 rounded-full flex items-center px-0.5">
                          <div className="w-2 h-2 bg-emerald-500 rounded-full ml-auto" />
                       </div>
                    </div>
                  ))}
               </div>

               <div className="mt-6 p-3 bg-emerald-600/5 border border-emerald-500/10 rounded-xl space-y-1.5 relative overflow-hidden group">
                  <div className="absolute right-0 top-0 p-2 opacity-[0.05] pointer-events-none group-hover:scale-110 transition-transform">
                     <Target size={40} />
                  </div>
                  <div className="flex items-center gap-1.5">
                     <Activity size={10} className="text-emerald-600" />
                     <p className="text-[9px] font-black text-emerald-600 uppercase tracking-widest italic leading-none">Efficiency Protocol</p>
                  </div>
                  <p className="text-[8.5px] text-[var(--text-tertiary)] font-bold leading-relaxed uppercase tracking-wider italic">
                     Reminders reduce delays by <span className="text-emerald-500 font-black">34%</span> on average.
                  </p>
               </div>
            </div>

            {/* Quick Dispatch Strip */}
            <div className="p-3 bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-xl flex items-center justify-between group cursor-pointer hover:border-rose-500/30 transition-all shadow-sm border-l-4 border-l-rose-600">
               <div className="flex items-center gap-3">
                  <div className="p-2 bg-rose-500/10 text-rose-500 rounded-lg group-hover:rotate-12 transition-transform shadow-inner">
                     <ShieldAlert size={16} />
                  </div>
                  <div>
                     <p className="text-[10px] font-black text-[var(--text-primary)] uppercase leading-none italic font-black">Critical Dispatch</p>
                     <p className="text-[7.5px] font-black text-[var(--text-tertiary)] uppercase mt-1 italic tracking-widest leading-none">Sync Debts</p>
                  </div>
               </div>
               <ArrowUpRight size={14} className="text-[var(--text-tertiary)] group-hover:text-rose-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
            </div>
         </div>
      </div>
    </div>
  );
}
