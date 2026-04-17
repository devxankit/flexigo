import React, { useEffect } from 'react';
import { 
  ClipboardCheck, 
  ShieldCheck, 
  AlertTriangle, 
  RefreshCcw, 
  Gavel, 
  FileText, 
  Building2, 
  Search, 
  Filter, 
  CheckCircle2,
  Calendar,
  IndianRupee,
  ChevronRight
} from 'lucide-react';
import AdminStatCard from '../components/AdminStatCard';
import { useAdminDataStore } from '../store/adminDataStore';

export default function CompliancePage() {
  const { complianceRecords, complianceStats, fetchComplianceData } = useAdminDataStore();

  useEffect(() => {
    fetchComplianceData();
  }, []);

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
         <div className="space-y-0.5">
            <div className="flex items-center gap-2">
               <div className="w-1 h-5 bg-emerald-600 rounded-full" />
               <h1 className="text-xl font-black tracking-tighter text-[var(--text-primary)] uppercase italic">
                  Compliance <span className="text-emerald-500">Automation</span>
               </h1>
            </div>
            <p className="text-[8px] font-black uppercase tracking-[0.2em] text-[var(--text-tertiary)] ml-3">
               Regulatory Guard & Settlement
            </p>
         </div>
         
         <div className="flex items-center gap-2">
            <button 
               onClick={fetchComplianceData}
               className="px-3 py-1.5 bg-emerald-600 text-white rounded-lg text-[9px] font-black uppercase tracking-widest hover:bg-emerald-700 transition-all shadow-md active:scale-95 flex items-center gap-1.5"
            >
               <RefreshCcw size={12} /> Sync Vahan
            </button>
            <button className="px-3 py-1.5 bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-lg text-[var(--text-primary)] text-[9px] font-black uppercase tracking-widest hover:bg-[var(--bg-tertiary)] transition-all flex items-center gap-1.5 shadow-sm">
               <FileText size={12} /> RTO Report
            </button>
         </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
         <AdminStatCard title="Active Fines" value={complianceStats.activeFines} icon={Gavel} color="rose" subtitle="Unpaid" />
         <AdminStatCard title="Auto Settled" value={complianceStats.autoSettled} icon={IndianRupee} color="emerald" subtitle="MTD Pay" />
         <AdminStatCard title="Compliance" value={complianceStats.complianceRate} icon={ShieldCheck} color="blue" subtitle="Asset Health" />
         <AdminStatCard title="API Guard" value={complianceStats.apiStatus} icon={RefreshCcw} color="emerald" subtitle="Vahan Node" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
         {/* Challan Registry */}
         <div className="lg:col-span-2 bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-2xl overflow-hidden shadow-sm">
            <div className="px-6 py-3 border-b border-[var(--border-subtle)] flex items-center justify-between bg-emerald-500/5">
               <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-600/10 border border-emerald-500/20 flex items-center justify-center text-emerald-500 shadow-inner">
                     <ClipboardCheck size={16} />
                  </div>
                  <h3 className="text-[11px] font-black text-[var(--text-primary)] uppercase tracking-wider leading-none">Vehicle Fine Registry</h3>
               </div>
               <div className="relative group">
                  <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3 h-3 text-[var(--text-tertiary)] group-focus-within:text-emerald-500 transition-colors" />
                  <input 
                    type="text" 
                    placeholder="Search Asset..." 
                    className="pl-8 pr-3 py-1.5 bg-[var(--bg-tertiary)]/50 border border-[var(--border-subtle)] rounded-lg text-[9px] font-black uppercase tracking-widest focus:ring-1 focus:ring-emerald-500/20 outline-none w-32 transition-all text-[var(--text-primary)]"
                  />
               </div>
            </div>
            <div className="overflow-x-auto no-scrollbar">
               <table className="w-full text-left">
                  <thead>
                     <tr className="border-b border-[var(--border-subtle)] bg-[var(--bg-tertiary)]/20">
                        {['ID', 'Asset', 'Issue Type', 'Amount', 'RTO', 'Status'].map((header) => (
                           <th key={header} className="py-2.5 px-6 text-[8px] font-black uppercase tracking-widest text-[var(--text-tertiary)] whitespace-nowrap">{header}</th>
                        ))}
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--border-subtle)]">
                     {complianceRecords.map((chl) => (
                        <tr key={chl.id} className="group/row hover:bg-[var(--bg-tertiary)]/20 transition-colors text-[10px]">
                           <td className="py-2.5 px-6 font-black text-[7.5px] text-[var(--text-tertiary)] uppercase tracking-widest leading-none">{chl.id}</td>
                           <td className="py-2.5 px-6 font-black text-[var(--text-primary)] uppercase tracking-tight italic leading-none">{chl.vehicle}</td>
                           <td className="py-2.5 px-6">
                              <div className="flex flex-col">
                                 <span className="font-black text-[var(--text-primary)] uppercase tracking-wider leading-tight italic">{chl.type}</span>
                                 <span className="text-[7px] font-black text-[var(--text-tertiary)] uppercase italic mt-0.5 leading-none">{new Date(chl.date).toLocaleDateString()}</span>
                              </div>
                           </td>
                           <td className="py-2.5 px-6 font-black text-rose-500 tracking-tight leading-none">{chl.amount}</td>
                           <td className="py-2.5 px-6 text-[7.5px] font-black text-[var(--text-tertiary)] uppercase italic leading-none">{chl.rto}</td>
                           <td className="py-2.5 px-6">
                              <div className={`inline-flex px-1.5 py-0.5 rounded text-[7px] font-black uppercase tracking-widest border ${
                                 chl.status === 'auto-paid' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/10' : 
                                 chl.status === 'pending' ? 'bg-amber-500/10 text-amber-500 border-amber-500/10' : 
                                 'bg-rose-500/10 text-rose-500 border-rose-500/10'
                              }`}>
                                 {chl.status}
                              </div>
                           </td>
                        </tr>
                     ))}
                  </tbody>
               </table>
            </div>
         </div>

         {/* Automated Deduction Panel */}
         <div className="space-y-4">
            <div className="bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-2xl p-5 shadow-sm border-t-4 border-t-emerald-600">
               <div className="flex items-center justify-between mb-6 pb-2 border-b border-[var(--border-subtle)]">
                  <h3 className="text-[11px] font-black text-[var(--text-primary)] uppercase tracking-widest leading-none italic">Protocol Matrix</h3>
                  <div className="flex items-center gap-1 text-[8px] font-black text-emerald-500 uppercase italic animate-pulse">
                     <CheckCircle2 size={10} /> Live
                  </div>
               </div>

               <div className="space-y-2.5">
                  {[
                    { label: 'Auto-Deduct', enabled: true, desc: 'Rider wallet sync' },
                    { label: 'Hub Dispatch', enabled: true, desc: 'Local hub alert' },
                    { label: 'Asset Lock', enabled: false, desc: 'Critical fine block' },
                  ].map((rule) => (
                    <div key={rule.label} className="p-2.5 bg-[var(--bg-tertiary)]/50 border border-[var(--border-subtle)] rounded-xl flex items-center justify-between group hover:border-emerald-500/30 transition-all cursor-pointer">
                       <div className="flex-1">
                          <p className="text-[9px] font-black text-[var(--text-primary)] uppercase tracking-wider leading-none italic">{rule.label}</p>
                          <p className="text-[7px] font-black text-[var(--text-tertiary)] uppercase italic mt-1 leading-none">{rule.desc}</p>
                       </div>
                       <div className={`w-7 h-3.5 rounded-full flex items-center px-0.5 transition-colors ${rule.enabled ? 'bg-emerald-600/20' : 'bg-[var(--bg-tertiary)] shadow-inner'}`}>
                          <div className={`w-2.5 h-2.5 rounded-full transition-all shadow-sm ${rule.enabled ? 'bg-emerald-500 ml-auto' : 'bg-slate-500 mr-auto'}`} />
                       </div>
                    </div>
                  ))}
               </div>

               <div className="mt-6 p-3 bg-emerald-600/5 border border-emerald-500/10 rounded-xl space-y-2 relative overflow-hidden group">
                  <div className="absolute right-0 top-0 p-2 opacity-[0.05] pointer-events-none group-hover:scale-110 transition-transform">
                     <ShieldCheck size={40} />
                  </div>
                  <div className="flex items-center gap-1.5">
                     <AlertTriangle size={10} className="text-emerald-600" />
                     <p className="text-[8px] font-black text-emerald-600 uppercase tracking-widest italic leading-none">Vahan API Node</p>
                  </div>
                  <p className="text-[8px] text-[var(--text-tertiary)] font-bold leading-relaxed uppercase tracking-wider italic">
                     Real-time infra synchronization active.
                  </p>
               </div>
            </div>

            {/* Compliance Archive Strip */}
            <div className="p-3 bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-2xl flex items-center justify-between group cursor-pointer hover:border-emerald-500/30 transition-all shadow-sm border-l-4 border-l-emerald-600">
               <div className="flex items-center gap-3">
                  <div className="p-2 bg-emerald-600/10 text-emerald-500 rounded-lg shadow-inner group-hover:rotate-12 transition-transform">
                     <Calendar size={16} />
                  </div>
                  <div>
                     <p className="text-[10px] font-black text-[var(--text-primary)] uppercase leading-none">Fiscal Audit</p>
                     <p className="text-[7.5px] font-black text-[var(--text-tertiary)] uppercase mt-1 italic tracking-widest leading-none">Download Registry</p>
                  </div>
               </div>
               <ChevronRight size={14} className="text-[var(--text-tertiary)]/50 group-hover:translate-x-0.5 transition-transform" />
            </div>
         </div>
      </div>
    </div>
  );
}
