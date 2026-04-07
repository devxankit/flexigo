import React from 'react';
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

const mockChallans = [
  { id: 'CHL-4491', vehicle: 'EV-9021', type: 'Over Speeding', amount: '₹1,000', rto: 'KA-01 (BLR)', date: '2d ago', status: 'auto-paid' },
  { id: 'CHL-4490', vehicle: 'EV-1029', type: 'Wrong Side', amount: '₹500', rto: 'KA-05 (BLR)', date: '5d ago', status: 'pending' },
  { id: 'CHL-4489', vehicle: 'EV-4412', type: 'No Helmet', amount: '₹1,000', rto: 'KA-03 (BLR)', date: '1w ago', status: 'disputed' },
  { id: 'CHL-4488', vehicle: 'EV-5541', type: 'Signal Jump', amount: '₹500', rto: 'KA-51 (BLR)', date: '12d ago', status: 'auto-paid' },
];

export default function CompliancePage() {
  return (
    <div className="space-y-8 pb-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
         <div className="space-y-1">
            <div className="flex items-center gap-3">
               <div className="w-1 h-6 bg-emerald-600 rounded-full" />
               <h1 className="text-2xl font-bold tracking-tight text-[var(--text-primary)]">
                  Compliance <span className="text-emerald-500">Automation</span>
               </h1>
            </div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-tertiary)] ml-4">
               Vehicle Fines • Automatic Payment Tracking
            </p>
         </div>
         
         <div className="flex items-center gap-2">
            <button className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-[10px] font-bold uppercase tracking-wider hover:bg-emerald-700 transition-all shadow-sm active:scale-95 flex items-center gap-2">
               <RefreshCcw size={14} /> Update Fine Data
            </button>
            <button className="px-4 py-2 bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-lg text-[var(--text-primary)] text-[10px] font-bold uppercase tracking-wider hover:bg-[var(--bg-tertiary)] transition-all flex items-center gap-2 shadow-sm">
               <FileText size={14} /> Compliance Report
            </button>
         </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
         <AdminStatCard title="Total Fines" value="24" icon={Gavel} color="rose" subtitle="Unpaid vehicle fines" />
         <AdminStatCard title="Auto-Paid" value="₹12.4K" icon={IndianRupee} color="emerald" subtitle="Paid from wallet" />
         <AdminStatCard title="Fleet Status" value="98.2%" icon={ShieldCheck} color="blue" subtitle="Vehicles with no issues" />
         <AdminStatCard title="Data Sync" value="Live" icon={RefreshCcw} color="emerald" subtitle="Vahan API status" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
         {/* Challan Registry */}
         <div className="lg:col-span-2 bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-xl overflow-hidden shadow-sm">
            <div className="p-4 border-b border-[var(--border-subtle)] flex items-center justify-between">
               <h3 className="text-sm font-bold text-[var(--text-primary)] uppercase tracking-wider">Vehicle Fine History</h3>
               <div className="flex items-center gap-2">
                  <div className="relative">
                     <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[var(--text-tertiary)]" />
                     <input 
                       type="text" 
                       placeholder="Search Vehicle/ID..." 
                       className="pl-9 pr-4 py-1.5 bg-[var(--bg-tertiary)]/50 border border-[var(--border-subtle)] rounded-lg text-[10px] focus:border-emerald-500 outline-none transition-all"
                     />
                  </div>
               </div>
            </div>
            <div className="overflow-x-auto no-scrollbar">
               <table className="w-full">
                  <thead>
                     <tr className="border-b border-[var(--border-subtle)] bg-[var(--bg-tertiary)]/30">
                        {['Fine ID', 'Vehicle', 'Issue Type', 'Amount', 'RTO Code', 'Status'].map((header) => (
                           <th key={header} className="text-left py-4 text-[10px] font-bold uppercase tracking-widest text-[var(--text-tertiary)] px-4 whitespace-nowrap">{header}</th>
                        ))}
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--border-subtle)]">
                     {mockChallans.map((chl) => (
                        <tr key={chl.id} className="group/row hover:bg-[var(--bg-tertiary)]/30 transition-colors">
                           <td className="py-4 px-4 font-bold text-[10px] text-[var(--text-tertiary)] uppercase tracking-widest">{chl.id}</td>
                           <td className="py-4 px-4 font-bold text-xs text-[var(--text-primary)] uppercase tracking-tight">{chl.vehicle}</td>
                           <td className="py-4 px-4">
                              <div className="flex flex-col">
                                 <span className="text-[10px] font-bold text-[var(--text-tertiary)] uppercase tracking-wider">{chl.type}</span>
                                 <span className="text-[8px] font-bold text-[var(--text-tertiary)]/50 uppercase tracking-widest leading-none mt-1">{chl.date}</span>
                              </div>
                           </td>
                           <td className="py-4 px-4 text-xs font-bold text-rose-500">{chl.amount}</td>
                           <td className="py-4 px-4 text-[10px] font-bold text-[var(--text-tertiary)] uppercase">{chl.rto}</td>
                           <td className="py-4 px-4">
                              <div className={`inline-flex px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${
                                 chl.status === 'auto-paid' ? 'bg-emerald-500/10 text-emerald-500' : 
                                 chl.status === 'pending' ? 'bg-amber-500/10 text-amber-500' : 
                                 'bg-rose-500/10 text-rose-500'
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
         <div className="space-y-6">
            <div className="bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-xl p-6 shadow-sm">
               <div className="flex items-center justify-between mb-8 pb-4 border-b border-[var(--border-subtle)]">
                  <h3 className="text-sm font-bold text-[var(--text-primary)] uppercase tracking-wider">Settlement Engine</h3>
                  <div className="flex items-center gap-1 text-[9px] font-bold text-emerald-500 uppercase tracking-widest">
                     <CheckCircle2 size={12} /> Auto
                  </div>
               </div>

               <div className="space-y-4">
                  {[
                    { label: 'Auto-Deduct Wallet', enabled: true, desc: 'Deduct from rider wallet on sync' },
                    { label: 'RTO Hub Notification', enabled: true, desc: 'Alert nearest hub on critical challan' },
                    { label: 'Vehicle Lock on Unpaid', enabled: false, desc: 'Remote lock after 48h unpaid' },
                  ].map((rule) => (
                    <div key={rule.label} className="p-4 bg-[var(--bg-tertiary)] border border-[var(--border-subtle)] rounded-xl flex items-center justify-between group hover:border-emerald-500/30 transition-all cursor-pointer">
                       <div className="flex-1">
                          <p className="text-[10px] font-bold text-[var(--text-primary)] uppercase tracking-wider">{rule.label}</p>
                          <p className="text-[8px] font-bold text-[var(--text-tertiary)] uppercase tracking-widest mt-1">{rule.desc}</p>
                       </div>
                       <div className={`w-8 h-4 rounded-full flex items-center px-1 transition-colors ${rule.enabled ? 'bg-emerald-600/20' : 'bg-slate-500/20'}`}>
                          <div className={`w-2.5 h-2.5 rounded-full transition-all ${rule.enabled ? 'bg-emerald-500 ml-auto' : 'bg-slate-400 mr-auto'}`} />
                       </div>
                    </div>
                  ))}
               </div>

               <div className="mt-8 p-4 bg-emerald-600/5 border border-emerald-500/10 rounded-xl space-y-3">
                  <div className="flex items-center gap-2">
                     <AlertTriangle size={14} className="text-emerald-600" />
                     <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest">Regulatory Guard</p>
                  </div>
                  <p className="text-[10px] text-[var(--text-tertiary)] font-medium leading-relaxed italic">
                     Our automated payment system is currently connected with <span className="text-emerald-500 font-bold">Vahan API</span> for real-time traffic fine updates.
                  </p>
               </div>
            </div>

            {/* Compliance Archive Strip */}
            <div className="p-4 bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-xl flex items-center justify-between group cursor-pointer hover:border-emerald-500/30 transition-all">
               <div className="flex items-center gap-3">
                  <div className="p-2 bg-emerald-600/10 text-emerald-500 rounded-lg group-hover:scale-110 transition-transform">
                     <Calendar size={18} />
                  </div>
                  <div>
                     <p className="text-[10px] font-bold text-[var(--text-primary)] uppercase tracking-wider leading-none">Fiscal Archive</p>
                     <p className="text-[9px] font-bold text-[var(--text-tertiary)] uppercase tracking-widest mt-1">Download MTD RTO Report</p>
                  </div>
               </div>
               <ChevronRight size={16} className="text-[var(--text-tertiary)]" />
            </div>
         </div>
      </div>
    </div>
  );
}
